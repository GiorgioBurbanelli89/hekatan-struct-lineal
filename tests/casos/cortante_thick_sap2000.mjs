/**
 * CORTANTE TRANSVERSAL V13/V23 del Shell-Thick contra SAP2000 24 (juez), misma malla.
 *
 * El bug (19-sep-2026): `analyze.ts` recuperaba gamma = dw/dx + theta_x, dw/dy + theta_y
 * (convencion de pendientes anterior a los giros de mano derecha del 3-sep-2026). Con los
 * giros de verdad eso vale w,x + w,y en el limite delgado y, por Ds = 5/6·G·t, el radier
 * MOD_002 salia con V13 ~2300 veces el de SAFE. Ahora V = Ds·gamma con la gamma ASUMIDA del
 * propio elemento de CSI (cortantes de lado + internos recuperados) en el CENTRO: un valor
 * por elemento, igual en sus 4 joints, como lista AreaForceShell.
 *
 * Y los modificadores M11/M22/M12/V13/V23 (`shellmod`) entran ahora en la recuperacion igual
 * que en la rigidez: los pedestales del radier (M×100) salian con el momento 100 veces chico.
 *
 * Referencia: `tests/datos/cortante_thick_sap2000.json` (SAP2000 por OAPI, AreaForceShell):
 *   · placa 4×3 m, 4×3 Q4, t = 0.4, apoyo simple, carga repartida + puntual;
 *   · radier MOD_002 malla conforme 0.60 m (889 cascaras, 87 pedestales con M×100), SAP con
 *     los mismos muelles nodales, cargas, peso propio y frameload: Uz 2.6e-9 % del maximo.
 * ⚠️ En malla DISTORSIONADA la recuperacion de CSI no es esta (placa con nudos movidos 15 %:
 * V 23 %, M 3.9 %; Uz 0.0000 %): queda por extraer del binario. Aqui no se mide.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { cargarFem } from "../lib/bundle.mjs";
import { resolverHeks } from "../lib/heks.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const REF = JSON.parse(readFileSync(join(AQUI, "..", "datos", "cortante_thick_sap2000.json"), "utf-8"));

export const nombre = "cortante-thick-sap2000";
export const descripcion = "V13/V23 del Shell-Thick y M con modificadores vs SAP2000 24, misma malla (placa y radier)";

const pct = (a, b, esc) => 100 * Math.abs(a - b) / esc;

export async function correr() {
  const filas = [];
  // ── placa 4×3 ──
  const { deform, analyze } = await cargarFem();
  const m = REF.placa.modelo;
  const supports = new Map(), loads = new Map();
  for (let n = 0; n < m.nodes.length; n++) supports.set(n, [true, true, false, false, false, true]);
  for (const n of m.borde) supports.set(n, [true, true, true, false, false, true]);
  m.Fz.forEach((f, n) => { if (f) loads.set(n, [0, 0, f, 0, 0, 0]); });
  const mp = (v) => new Map(m.elements.map((_, k) => [k, v]));
  const inp = { thicknesses: mp(m.t), elasticities: mp(m.E), poissonsRatios: mp(m.nu),
                shearModuli: mp(m.E / 2 / (1 + m.nu)), densities: mp(0), plateFormulations: mp(0) };
  const d = deform(m.nodes, m.elements, { supports, loads }, inp);
  const a = analyze(m.nodes, m.elements, inp, d);
  let vmax = 0, peor = 0;
  REF.placa.V.forEach(([v13, v23]) => { vmax = Math.max(vmax, Math.abs(v13), Math.abs(v23)); });
  REF.placa.V.forEach(([v13, v23], i) => {
    const hx = a.tranverseShearXjoint.get(i), hy = a.tranverseShearYjoint.get(i);
    for (let j = 0; j < 4; j++) peor = Math.max(peor, pct(hx[j], v13, vmax), pct(hy[j], v23, vmax));
  });
  filas.push({ que: "placa 4x3 t=0.4: V13/V23 por joint vs SAP2000", medido: peor, limite: 1e-6,
               ok: peor <= 1e-6, detalle: `peor ${peor.toExponential(2)} % de |V|max ${vmax.toFixed(4)} kN/m (12 elementos x 4 joints)` });

  // ── radier MOD_002 conforme ──
  const r = await resolverHeks(join(AQUI, "..", "datos", "radier_mod002_conforme.heks"));
  const A = r.analyzeOutputs;
  let vm = 0, pv = 0, n = 0;
  for (const [, [v13, v23]] of Object.entries(REF.radier.V)) vm = Math.max(vm, Math.abs(v13), Math.abs(v23));
  for (const [k, [v13, v23]] of Object.entries(REF.radier.V)) {
    const i = +k;
    pv = Math.max(pv, pct(A.tranverseShearXjoint.get(i)[0], v13, vm), pct(A.tranverseShearYjoint.get(i)[0], v23, vm));
    n++;
  }
  filas.push({ que: "radier MOD_002 (889 cascaras): V13/V23 vs SAP2000", medido: pv, limite: 1e-4,
               ok: pv <= 1e-4, detalle: `peor ${pv.toExponential(2)} % de |V|max ${vm.toFixed(2)} kN/m en ${n} elementos (antes ~2300 veces SAFE)` });
  let mm = 0, pm = 0;
  for (const [, fs] of Object.entries(REF.radier.Mped)) for (const f of fs) mm = Math.max(mm, ...f.slice(1).map(Math.abs));
  for (const [k, fs] of Object.entries(REF.radier.Mped)) {
    const i = +k, el = r.elements[i];
    for (const [nudo, m11, m22, m12] of fs) {
      const p = el.indexOf(nudo);
      pm = Math.max(pm, pct(A.bendingXXjoint.get(i)[p], m11, mm), pct(A.bendingYYjoint.get(i)[p], m22, mm),
                    pct(A.bendingXYjoint.get(i)[p], m12, mm));
    }
  }
  filas.push({ que: "radier: M de los 87 pedestales (shellmod M×100) vs SAP2000", medido: pm, limite: 0.1,
               ok: pm <= 0.1, detalle: `peor ${pm.toFixed(4)} % de |M|max ${mm.toFixed(2)} kN (sin el modificador salia 100 veces chico)` });
  return filas;
}
