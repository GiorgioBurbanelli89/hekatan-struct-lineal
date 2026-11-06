/**
 * E2K: ETABS reparte la losa en UN sentido (ONEWAYLOADDIST) solo si el paño tiene pendiente <= 20 grados (medido por OAPI, 6-nov-2026, registros/2026-11-05_sap2000_galpon.md).
 * Por encima, la carga va por la linea de maxima pendiente (a los bordes de arriba/abajo) y las correas a lo largo de la pendiente no reciben nada.
 * Se toma el vano 6x6 (tests/datos/e2k_vano_simple_A.e2k, 3 %, correas 1G a lo largo de Y cada 1 m) y se cambia la pendiente editando las cotas de los POINT.
 */
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs"; import { tmpdir } from "node:os"; import { join, dirname } from "node:path"; import { fileURLToPath } from "node:url";
import { cargarMod, key } from "../lib/vano_cmp.mjs"; import { resolverHeks } from "../lib/heks.mjs";
const AQUI = dirname(fileURLToPath(import.meta.url));
export const nombre = "e2k-regla-20-grados";
export const descripcion = "e2k: losa one-way solo reparte a las correas con pendiente <= 20 grados (regla de ETABS 22)";
const silencio = async (f) => { const l = console.log, w = console.warn, e = console.error, i = console.info; console.log = console.warn = console.error = console.info = () => {};
  try { return await f(); } finally { console.log = l; console.warn = w; console.error = e; console.info = i; } };

async function correas(mod, grados) {
  let txt = readFileSync(join(AQUI, "..", "datos", "e2k_vano_simple_A.e2k"), "latin1");
  const t = Math.tan(grados * Math.PI / 180);
  txt = txt.replace(/^(\s*POINT\s+"[^"]+"\s+)(\S+)\s+(\S+)(?:\s+(\S+))?\s*$/gm, (m, pre, x, y, z) => z === undefined ? m : `${pre}${x} ${y} ${(740 - t * parseFloat(y)).toFixed(3)}`);
  const res = await silencio(() => mod.e2kAHeks(txt, "pend.e2k", {}));
  const fh = join(mkdtempSync(join(tmpdir(), "r20-")), "p.heks"); writeFileSync(fh, res.heks);
  globalThis.__hekatanFactoresPatron = { Dead: 1 };
  const s = await silencio(() => resolverHeks(fh));
  const SY = s.analyzeOutputs.shearsY, SZ = s.analyzeOutputs.shearsZ;
  let suma = 0, n = 0;
  s.elements.forEach((e, i) => { if (e.length !== 2) return; const a = s.nodes[e[0]], b = s.nodes[e[1]];
    if (Math.abs(a[0] - b[0]) > 1e-6 || Math.abs(Math.abs(b[1] - a[1]) - 1) > 0.3 && Math.abs(b[1] - a[1]) < 0.5) return;   // solo las que van a lo largo de Y
    if (Math.abs(a[1] - b[1]) < 1e-6) return;
    const v = Math.hypot(SY.get(i)?.[0] ?? 0, SZ.get(i)?.[0] ?? 0); suma += v; n++; });
  return { suma, n };
}
export async function correr() {
  const mod = await cargarMod(), filas = [];
  const r3 = await correas(mod, 3), r20 = await correas(mod, 20), r25 = await correas(mod, 25);
  const f = (x) => x.toFixed(3);
  filas.push({ que: "pendiente 3 grados: cortante de las barras a lo largo de Y (suma, kN)", crudo: true, medido: f(r3.suma), limite: "> 5 kN (las correas cargan)", ok: r3.suma > 5, detalle: `${r3.n} barras` });
  filas.push({ que: "pendiente 20 grados: reparte igual", crudo: true, medido: f(r20.suma), limite: "> 5 kN", ok: r20.suma > 5, detalle: `${r20.n} barras` });
  filas.push({ que: "pendiente 25 grados: las correas NO reciben carga (ETABS)", crudo: true, medido: f(r25.suma), limite: "< 15 % de la de 3 grados", ok: r25.suma < 0.15 * r3.suma, detalle: `${r25.n} barras` });
  return filas;
}
