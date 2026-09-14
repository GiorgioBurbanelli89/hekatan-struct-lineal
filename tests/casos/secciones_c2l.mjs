// Canal C y doble ángulo 2L PARAMÉTRICOS contra SAP2000 (el juez), y su viaje por s2k y e2k.
// Referencia: GetSectProps de SAP2000 24 por OAPI (cli/_csi_secciones_c2l.py y cli/_csi_2l_barrido.py, 14-sep-2026):
// 2 canales y 13 dobles ángulos (11 del barrido, cambiando una cota cada vez, + 2 del primer sondeo).
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { empaquetar, R } from "../lib/bundle.mjs";
import { resolverHeks } from "../lib/heks.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
export const nombre = "secciones-c2l";
export const descripcion = "canal C y doble ángulo 2L paramétricos: 6 propiedades = SAP2000, s2k Channel/Double Angle, e2k Steel Channel/Steel Double Angle";

const pct = (a, b) => (b === 0 ? Math.abs(a) : Math.abs(a - b) / Math.abs(b) * 100);
const CLAVES = [["A", "Area"], ["Iz", "I33"], ["Iy", "I22"], ["J", "Torsion"], ["As2", "As2"], ["As3", "As3"]];

export async function correr() {
  const sap = JSON.parse(readFileSync(join(AQUI, "..", "datos", "secciones_c2l_sap.json"), "utf-8"));
  const barrido = JSON.parse(readFileSync(join(AQUI, "..", "datos", "barrido_2l_sap.json"), "utf-8"));
  const mod = await empaquetar(`
    export { channelSectionCsi, dblAngleSectionCsi } from "${R}/examples/src/shared/cadSections";
    export { exportS2k } from "${R}/examples/src/shared/s2kExporter";
    export { parseS2k } from "${R}/examples/src/shared/s2kParser";
    export { exportE2k } from "${R}/examples/src/shared/e2kExporter";
    export { parseE2k } from "${R}/examples/src/shared/e2kParser";
  `, "secciones-c2l");
  const filas = [];
  const peorDe = (lista) => {
    let peor = 0, donde = "";
    for (const [nom, h, ref] of lista)
      for (const [kh, kr] of CLAVES) { const d = pct(h[kh], ref[kr]); if (d > peor) { peor = d; donde = `${nom} ${kr}`; } }
    return { peor, donde };
  };

  // 1. canal C: las seis propiedades
  const canales = ["C200", "C150"].map((nm) => [nm, mod.channelSectionCsi(...sap.secs[nm]), sap[nm]]);
  const pc = peorDe(canales);
  filas.push({ que: "canal C: A, I33, I22, J, As2, As3 = SAP2000 (2 perfiles)", medido: pc.peor, limite: 1e-6, ok: pc.peor <= 1e-6, detalle: `peor ${pc.donde}` });

  // 2. doble ángulo: primer sondeo (t2 = ancho total, dis = separación)
  const dobles = ["L50D", "L75D"].map((nm) => [nm, mod.dblAngleSectionCsi(...sap.secs[nm]), sap[nm]]);
  // barrido: la JSON guarda t2 TOTAL en el 2L
  for (const [nom, v] of Object.entries(barrido["2L"])) {
    const g = v.dims;
    dobles.push([`barrido ${nom}`, mod.dblAngleSectionCsi(g.t3, g.t2, g.tf, g.tw, g.dis), v]);
  }
  const pd = peorDe(dobles);
  filas.push({ que: `doble ángulo 2L: A, I33, I22, J, As2, As3 = SAP2000 (${dobles.length} geometrías)`, medido: pd.peor, limite: 1e-6, ok: pd.peor <= 1e-6, detalle: `peor ${pd.donde}` });

  // 3. un modelo con las dos secciones: s2k y e2k las escriben paramétricas y se leen de vuelta con las mismas propiedades
  const heks = join(AQUI, "..", "datos", "secciones_c2l.heks");
  const m = await resolverHeks(heks);
  const s2k = mod.exportS2k({ nodes: m.nodes, elements: m.elements, nodeInputs: m.nodeInputs, elementInputs: m.elementInputs, title: "c2l", units: { force: "KN", length: "m" }, selfWtMult: 0 });
  const e2k = mod.exportE2k({ nodes: m.nodes, elements: m.elements, nodeInputs: m.nodeInputs, elementInputs: m.elementInputs, title: "c2l", units: { force: "KN", length: "m" }, weightMode: "manual", diaphragm: "none" });
  // SngAngWid es obligatorio: SAP2000 al importar rehace t2 = 2·SngAngWid + dis (sin él, el 2L entra con la mitad del área)
  const fila2L = (s2k.match(/Shape="Double Angle"[^\n]*/) ?? [""])[0];
  const w2L = parseFloat((fila2L.match(/SngAngWid=([\d.eE+-]+)/) ?? [])[1]);
  const t2L = parseFloat((fila2L.match(/\bt2=([\d.eE+-]+)/) ?? [])[1]), dis2L = parseFloat((fila2L.match(/\bdis=([\d.eE+-]+)/) ?? [])[1]);
  const tieneS2k = /Shape=Channel/.test(s2k) && isFinite(w2L) && Math.abs(2 * w2L + dis2L - t2L) < 1e-9;
  filas.push({ que: "s2k escribe Channel y \"Double Angle\" con SngAngWid = (t2 − dis)/2", crudo: true, medido: tieneS2k ? "sí" : "no", limite: "sí", ok: tieneS2k, detalle: fila2L.slice(0, 90) });
  const tieneE2k = /SHAPE "Steel Channel"/.test(e2k) && /SHAPE "Steel Double Angle"[^\n]*DIS/.test(e2k);
  filas.push({ que: "e2k escribe Steel Channel y Steel Double Angle (con DIS)", crudo: true, medido: tieneE2k ? "sí" : "no", limite: "sí", ok: tieneE2k, detalle: "" });

  // Las barras se emparejan por las COORDENADAS de sus extremos, no por índice: el lector del e2k las reordena
  // (columnas, vigas, riostras) y comparar por índice cruzaba un canal con un 2L.
  const clave = (M, e) => M.elements[e].map((n) => M.nodes[n].map((c) => c.toFixed(3)).join(",")).sort().join("|");
  const comparaIda = (m2, via) => {
    const idx2 = new Map();
    for (let j = 0; j < m2.elements.length; j++) if (m2.elements[j].length === 2) idx2.set(clave(m2, j), j);
    let peor = 0, donde = "", casadas = 0, barras = 0;
    for (let i = 0; i < m.elements.length; i++) {
      if (m.elements[i].length !== 2) continue;
      barras++;
      const j = idx2.get(clave(m, i));
      if (j === undefined) { peor = Infinity; donde = `barra ${i} sin pareja`; continue; }
      casadas++;
      for (const [k, nm] of [["areas", "A"], ["momentsOfInertiaZ", "I33"], ["momentsOfInertiaY", "I22"], ["torsionalConstants", "J"], ["shearAreasZ", "As2"], ["shearAreasY", "As3"]]) {
        const a = m.elementInputs[k]?.get(i), b = m2.elementInputs[k]?.get(j);
        if (a === undefined || b === undefined) continue;
        const d = pct(b, a); if (d > peor) { peor = d; donde = `barra ${i} ${nm}`; }
      }
    }
    return { peor, donde: `${donde} · ${casadas}/${barras} casadas`, via };
  };
  for (const [texto, parse, via] of [[s2k, mod.parseS2k, "s2k"], [e2k, mod.parseE2k, "e2k"]]) {
    let r;
    try { r = comparaIda(parse(texto), via); } catch (e) { r = { peor: Infinity, donde: String(e).slice(0, 80), via }; }
    filas.push({ que: `ida y vuelta por ${via}: A, I, J, As iguales`, medido: r.peor, limite: 0.001, ok: r.peor <= 0.001, detalle: r.donde });
  }
  return filas;
}
