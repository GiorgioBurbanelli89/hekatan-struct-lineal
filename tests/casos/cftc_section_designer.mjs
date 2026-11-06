/**
 * COLUMNA CFT CIRCULAR (tubo redondo relleno) contra SAP2000 (Section Designer:
 * Pipe + Solid Circle) y ETABS (Filled Steel Pipe). Medido el 3-sep-2026: los dos
 * programas POLIGONIZAN el circulo (SAP ~48 lados, ETABS ~32), asi que su A queda
 * 0.3 / 0.6 % por debajo de la exacta y sus flechas 0.4 / 1.3 % por encima de la
 * de Hekatan, que usa el circulo exacto. Lo que vigila:
 *   1. `cftc` del .heks: A e I exactas, As Timoshenko, J = Js + (Gc/Gs)·Jc.
 *   2. la columna queda dentro de la banda de los dos programas.
 *   3. el s2k sale como SD (Pipe + Solid Circle) y el e2k como Filled Steel Pipe,
 *      y los dos parsers devuelven la forma CFT redonda con fillE.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { empaquetar, R } from "../lib/bundle.mjs";
import { resolverHeks } from "../lib/heks.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
export const nombre = "cftc-section-designer";
export const descripcion = "columna CFT CIRCULAR: propiedades exactas, flecha vs SAP2000-SD y ETABS-FSP (poligonizan), s2k SD Pipe y e2k Filled Steel Pipe";
const pct = (a, b) => Math.abs(a - b) / Math.abs(b) * 100;

export async function correr() {
  const ref = JSON.parse(readFileSync(join(AQUI, "..", "datos", "cftc_csi_ref.json"), "utf-8"));
  const mod = await empaquetar(`
    export { exportS2k } from "${R}/examples/src/shared/s2kExporter";
    export { parseS2k } from "${R}/examples/src/shared/s2kParser";
    export { exportE2k } from "${R}/examples/src/shared/e2kExporter";
    export { parseE2k } from "${R}/examples/src/shared/e2kParser";
    export { cftPipeSectionEc } from "${R}/examples/src/shared/cadSections";
  `, "cftc-sd");
  const filas = [];
  const fila = (que, medido, refv, limite, detalle) => { const d = pct(medido, refv); filas.push({ que, medido: d, limite, ok: d <= limite, detalle: `${detalle}: ${medido.toPrecision(7)} vs ${refv.toPrecision(7)}` }); };
  const c = mod.cftPipeSectionEc(0.3, 0.01, 2e8, 0.3, 2.5e7, 0.2);
  fila("A transformada exacta", c.A, ref.exacto.A, 1e-9, "m2");
  fila("A vs SAP2000-SD (poligono ~48 lados)", c.A, ref.sap2000_sd.Area, 0.5, "m2; ETABS " + ref.etabs_fsp.Area.toPrecision(6) + " (~32 lados)");
  fila("As (Timoshenko) vs SAP2000-SD", c.As2, ref.sap2000_sd.As2, 0.5, "m2; ETABS " + ref.etabs_fsp.As2.toPrecision(5));
  fila("J = Js + g·Jc vs SAP2000-SD", c.J, ref.sap2000_sd.J, 2.0, "m4; ETABS " + ref.etabs_fsp.J.toPrecision(5) + " (poligono)");
  const m = await resolverHeks(join(AQUI, "..", "datos", "cftc_columna.heks"));
  const u = m.deformOutputs.deformations.get(1);
  fila("ux lateral vs SAP2000 Section Designer", u[0], ref.sap2000_sd.ux, 0.5, "m");
  fila("ux lateral vs ETABS Filled Steel Pipe", u[0], ref.etabs_fsp.ux, 1.5, "m");
  fila("uz axial vs SAP2000-SD", u[2], ref.sap2000_sd.uz, 0.5, "m (el poligono de SAP tiene 0.3 % menos area)");
  const s2k = mod.exportS2k({ nodes: m.nodes, elements: m.elements, nodeInputs: m.nodeInputs, elementInputs: m.elementInputs, title: "cftc", units: { force: "KN", length: "m" }, selfWtMult: 0 });
  const dir = join(AQUI, "..", "..", "..", "galpon-bodega-electoral", "sap_cft_circ"); try { mkdirSync(dir, { recursive: true }); } catch {}
  writeFileSync(join(dir, "hekatan_cftc.s2k"), s2k, "utf-8");
  const pipe = /SHAPE PIPE[\s\S]*?OuterDiam=0\.3\s+WallThick=0\.01/.test(s2k), circ = /SHAPE SOLID CIRCLE[\s\S]*?Diameter=0\.28/.test(s2k);
  const esSD = /Shape="SD Section"/.test(s2k);
  filas.push({ que: "el s2k lleva la CFT redonda como SD: Pipe 0.3x0.01 + Solid Circle 0.28", crudo: true, medido: `${esSD ? "SD" : "General"} ${pipe ? "pipe" : "-"}/${circ ? "circulo" : "-"}`, limite: "SD pipe/circulo", ok: esSD && pipe && circ, detalle: "SECTION DESIGNER PROPERTIES 10 y 13" });
  const q = mod.parseS2k(s2k); const sh = q.sectionShapes?.get(0);
  filas.push({ que: "parseS2k devuelve CFT redonda d=0.3 tw=0.01 fillE=2.5e7", crudo: true, medido: sh ? `${sh.type} d=${sh.d} tw=${sh.tw} fillE=${sh.fillE}` : "sin forma", limite: "CFT d=0.3 tw=0.01 fillE=25000000", ok: !!sh && sh.type === "CFT" && sh.d === 0.3 && sh.tw === 0.01 && sh.fillE === 25000000, detalle: "tablas SD 10/13 + MATERIAL 02" });
  const e2k = mod.exportE2k({ nodes: m.nodes, elements: m.elements, nodeInputs: m.nodeInputs, elementInputs: m.elementInputs, title: "cftc", units: { force: "KN", length: "m" }, weightMode: "manual", diaphragm: "none" });
  const dirE = join(AQUI, "..", "..", "..", "galpon-bodega-electoral", "etabs_cft_circ"); try { mkdirSync(dirE, { recursive: true }); } catch {}
  writeFileSync(join(dirE, "hekatan_cftc.e2k"), e2k, "utf-8");
  const fsp = /SHAPE\s+"Filled Steel Pipe"\s+D\s+300\s+T\s+10\s+FILLMATERIAL\s+"ConcFill_1"/.test(e2k);
  filas.push({ que: "el e2k lleva la CFT redonda como Filled Steel Pipe D 300 T 10", crudo: true, medido: fsp ? "Filled Steel Pipe" : "no esta", limite: "Filled Steel Pipe", ok: fsp, detalle: "la parametrica de ETABS; N y mm" });
  const c32 = mod.cftPipeSectionEc(0.3, 0.01, 2e8, 0.3, 2.5e7, 0.2, 32); const q2 = mod.parseE2k(e2k); const i = [...q2.sectionShapes.entries()].find(([, s]) => s.type === "CFT")?.[0]; const s2 = i !== undefined ? q2.sectionShapes.get(i) : null;
  const okE = !!s2 && Math.abs(s2.d - 0.3) < 1e-9 && Math.abs(s2.tw - 0.01) < 1e-9 && pct(q2.elementInputs.areas.get(i), c32.A) < 1e-6 && pct(q2.elementInputs.torsionalConstants.get(i), c32.J) < 1e-6;   // e2k = ETABS: poligono de 32 lados
  filas.push({ que: "parseE2k devuelve CFT redonda con A/J del poligono de 32 lados (ETABS)", crudo: true, medido: s2 ? `d=${s2.d} tw=${s2.tw} A=${q2.elementInputs.areas.get(i).toPrecision(6)}` : "sin CFT", limite: `d=0.3 tw=0.01 A=${c32.A.toPrecision(6)}`, ok: okE, detalle: "antes no existia el caso Filled Steel Pipe" });
  return filas;
}
