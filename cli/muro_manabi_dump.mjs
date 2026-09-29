#!/usr/bin/env node
/**
 * El muro de Manabí (examples/src/muro-manabi) resuelto por Hekatan y volcado para armar el MISMO
 * modelo en SAP2000 y ETABS por OAPI: misma malla, mismos apoyos, mismos muelles y mismas cargas
 * nodales (galpon-bodega-electoral/csi_desde_dump.py para membrana y cáscara; sap_h8_modelo.py
 * para el sólido).
 *
 *   node cli/muro_manabi_dump.mjs <carpeta_salida> [clave=valor ...]
 *
 * Escribe muro_<modelo>_<caso>.json para los 3 modelos × 2 casos y un resumen.json.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { empaquetar, R } from "../tests/lib/bundle.mjs";

const [carpeta, ...kv] = process.argv.slice(2);
if (!carpeta) { console.error("uso: node cli/muro_manabi_dump.mjs <carpeta_salida> [k=v ...]"); process.exit(2); }
const over = {};
for (const a of kv) { const m = a.match(/^([A-Za-z_]\w*)=(.+)$/); if (m && !isNaN(+m[2])) over[m[1]] = +m[2]; }
mkdirSync(carpeta, { recursive: true });

const mod = await empaquetar(`
const g = globalThis; g.window = g.window ?? g;
export { resolverMuroManabi } from "${R}/examples/src/muro-manabi/muroManabi";
export { MURO_MANABI } from "${R}/examples/src/muro-manabi/malla";
`, "muro-manabi-dump");

const plano = (o) => {
  if (o instanceof Map) return Object.fromEntries([...o].map(([k, v]) => [k, plano(v)]));
  if (Array.isArray(o)) return o.map(plano);
  if (o && typeof o === "object") return Object.fromEntries(Object.entries(o).map(([k, v]) => [k, plano(v)]));
  return o;
};
const NOMBRE = ["membrana", "cascara", "solido"], CASO = ["estatico", "sismico"];
const resumen = [];
for (const modelo of [0, 1, 2]) for (const caso of [0, 1]) {
  const p = { ...mod.MURO_MANABI, ...over, modelo, caso };
  const t0 = Date.now();
  const s = mod.resolverMuroManabi(p, over.placa ?? 1);
  const ms = Date.now() - t0;
  const m = s.malla, U = s.deformOutputs.deformations ?? new Map();
  let pmin = Infinity, pmax = -Infinity;
  s.presion.forEach((v) => { pmin = Math.min(pmin, v); pmax = Math.max(pmax, v); });
  const carga = [0, 0, 0];
  m.loads.forEach((f) => { carga[0] += f[0]; carga[1] += f[1]; carga[2] += f[2]; });
  const fila = {
    modelo: NOMBRE[modelo], caso: CASO[caso], nudos: m.info.nudos, elementos: m.info.elementos,
    Ka: m.info.Ka, Kae: m.info.Kae, psi: m.info.psi, suma: m.info.suma,
    cargaFx: carga[0], cargaFz: carga[2], reaccionFx: s.reaccion[0], reaccionFz: s.reaccion[2],
    uxCoronacion_mm: (U.get(m.nudoCoronacion)?.[0] ?? NaN) * 1000,
    presionMax_kPa: -pmin, presionMin_kPa: -pmax, ms, error: s.error ?? null,
  };
  resumen.push(fila);
  const out = {
    params: { ...p, E: m.E, nu: m.nu, EHormigon: p.E, nuHormigon: p.nu }, tipo: m.tipo, nudoCoronacion: m.nudoCoronacion,
    nodes: m.nodes, elements: m.elements,
    nodeInputs: { supports: plano(m.supports), loads: plano(m.loads), springs: m.springs, cargasPorPatron: plano(m.cargas) },
    elementInputs: plano(s.elementInputs),
    deformations: plano(U), reactions: plano(s.deformOutputs.reactions ?? new Map()),
    base: m.base, presion: plano(s.presion),
  };
  writeFileSync(join(carpeta, `muro_${NOMBRE[modelo]}_${CASO[caso]}.json`), JSON.stringify(out));
  const eq = (a, b) => (Math.abs(a + b) / Math.max(1e-9, Math.abs(a)) * 100).toExponential(1);
  console.log(`${NOMBRE[modelo].padEnd(8)} ${CASO[caso].padEnd(8)} ${String(m.info.nudos).padStart(5)} nudos ${String(m.info.elementos).padStart(5)} elem` +
    `  ux corona ${fila.uxCoronacion_mm.toFixed(4).padStart(9)} mm  presion ${fila.presionMax_kPa.toFixed(1).padStart(6)} / ${fila.presionMin_kPa.toFixed(1).padStart(6)} kPa` +
    `  equilibrio x ${eq(carga[0], s.reaccion[0])} %  z ${eq(carga[2], s.reaccion[2])} %  ${ms} ms${s.error ? "  ERROR " + s.error : ""}`);
}
const i = resumen[0];
console.log(`Ka ${i.Ka.toFixed(4)}  Kae ${i.Kae.toFixed(4)}  psi ${i.psi.toFixed(2)} grados`);
for (const k of ["PP", "RELLENO", "EMPUJE", "SISMO"])
  console.log(`  ${k.padEnd(8)} ` + resumen.filter((r) => r.caso === "sismico").map((r) => `${r.modelo}: Fx ${r.suma[k][0].toFixed(3)} Fz ${r.suma[k][2].toFixed(3)}`).join("  |  "));
writeFileSync(join(carpeta, "resumen.json"), JSON.stringify(resumen, null, 1));
console.log("->", carpeta);
