/**
 * e2k importado -> EDITADO en Struct -> exportado (4-nov-2026).
 * Antes el camino con e2kModel re-emitia el crudo e ignoraba la edicion; ahora aplica el cambio sobre el crudo
 * y el resto (combos, casos, espectros, materiales, secciones, malla...) sale tal cual.
 * Se comprueba: (1) sin editar = crudo identico; (2) tras editar, solo cambian las lineas esperadas;
 * (3) re-importar el exportado da el modelo editado; (4) camino reconstruido conserva casos/combos/espectros/materiales.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { empaquetar, R } from "../lib/bundle.mjs";

export const nombre = "e2k-roundtrip-edicion";
export const descripcion = "e2k importado, editado y exportado: solo cambia lo editado; re-importar da lo editado; reconstruido conserva datos";

const AQUI = dirname(fileURLToPath(import.meta.url));
const ARCH = join(AQUI, "..", "datos", "e2k_galpon_simple_plana.e2k");
const norm = (t) => t.split(/\r?\n/).map((l) => l.trim().replace(/\s+/g, " ")).filter((l) => l && !l.startsWith("$") && l !== "END");
const cuenta = (ls) => { const m = new Map(); ls.forEach((l) => m.set(l, (m.get(l) ?? 0) + 1)); return m; };
function dif(a, b) {
  const A = cuenta(a), B = cuenta(b), soloA = [], soloB = [];
  for (const [l, n] of A) for (let i = 0; i < n - (B.get(l) ?? 0); i++) soloA.push(l);
  for (const [l, n] of B) for (let i = 0; i < n - (A.get(l) ?? 0); i++) soloB.push(l);
  return { soloA, soloB };
}
const seccion = (t, nom) => { const L = t.split(/\r?\n/); const i = L.findIndex((l) => l.trim() === "$ " + nom); if (i < 0) return []; const o = []; for (let j = i + 1; j < L.length && !L[j].startsWith("$"); j++) if (L[j].trim()) o.push(L[j].trim().replace(/\s+/g, " ")); return o; };

export async function correr() {
  const m = await empaquetar(`export { parseE2k } from "${R}/examples/src/shared/e2kParser";\nexport { exportE2k } from "${R}/examples/src/shared/e2kExporter";\n`, "rt");
  const texto = readFileSync(ARCH, "utf-8");
  const filas = [];
  const mk = () => m.parseE2k(texto);
  const entrada = (md) => ({ nodes: md.nodes, elements: md.elements, nodeInputs: md.nodeInputs, elementInputs: md.elementInputs, title: md.info.title, units: md.units, e2kModel: md });

  // 1. sin editar
  let md = mk();
  const orig = norm(texto);
  const e0 = m.exportE2k(entrada(md));
  let d = dif(orig, norm(e0));
  filas.push({ que: "sin editar = crudo", medido: d.soloA.length + d.soloB.length, limite: 0, ok: d.soloA.length + d.soloB.length === 0, detalle: [...d.soloA, ...d.soloB].slice(0, 3).join(" | ") });

  // 2. editar: borrar B3, mover punto 13 (+500 en x), añadir nudo+barra, carga FX +2 kN en nudo 4, seccion de B5 (A x2), quitar apoyo del 11
  md = mk();
  const ix = (nm) => md.elementNames.indexOf(nm);
  const iN = (nm) => md.nodeNames.indexOf(nm);
  const eB3 = ix("B3"), eB5 = ix("B5"), n13 = iN("13@N2 COL"), n4 = iN("4@N2 COL"), n11 = iN("11@Base"), n15 = iN("15@N2 COL");
  const x13 = md.nodes[n13][0];
  const nodes = md.nodes.map((n) => [...n]);
  nodes[n13][0] += 0.5;
  nodes.push([nodes[n15][0], nodes[n15][1] + 1.5, nodes[n15][2]]);
  const nNuevo = nodes.length - 1;
  const viejos = md.elements, ei = md.elementInputs;
  const mapas = ["elasticities", "shearModuli", "areas", "momentsOfInertiaZ", "momentsOfInertiaY", "torsionalConstants", "shearAreasY", "shearAreasZ", "thicknesses", "densities"];
  const nuevoIdx = []; const elements = [];
  viejos.forEach((e, i) => { if (i === eB3) { nuevoIdx.push(-1); return; } nuevoIdx.push(elements.length); elements.push([...e]); });
  const einp = { ...ei };
  for (const k of mapas) if (ei[k] instanceof Map) { const nm = new Map(); for (const [i, v] of ei[k]) if (nuevoIdx[i] >= 0) nm.set(nuevoIdx[i], v); einp[k] = nm; }
  const aMas = elements.length; elements.push([n15, nNuevo]);
  for (const k of mapas) if (einp[k] instanceof Map) einp[k].set(aMas, einp[k].get(nuevoIdx[eB5]));
  const A5 = ei.areas.get(eB5);
  einp.areas.set(nuevoIdx[eB5], A5 * 2);
  const loads = new Map(md.nodeInputs.loads); loads.set(n4, [...(loads.get(n4) ?? [0, 0, 0, 0, 0, 0])]); loads.get(n4)[0] += 2;
  const supports = new Map(md.nodeInputs.supports); supports.delete(n11);
  const avisos = [];
  const e1 = m.exportE2k({ nodes, elements, nodeInputs: { ...md.nodeInputs, loads, supports }, elementInputs: einp, title: "x", units: md.units, e2kModel: md, avisos });
  d = dif(orig, norm(e1));
  const sA = d.soloA.join("\n"), sB = d.soloB.join("\n");
  const sinB3 = !norm(e1).some((l) => /^LINE(ASSIGN)? "B3"/.test(l));
  filas.push({ que: "B3 borrada (LINE y LINEASSIGN)", medido: sinB3 ? "ok" : "sigue", limite: "ok", ok: sinB3 && /LINE "B3"/.test(sA) && /LINEASSIGN "B3"/.test(sA) });
  filas.push({ que: "punto 13 movido +500 mm", medido: sB.match(/POINT "13" ([\d.]+) 0 740/)?.[1] ?? "no", limite: "1500", ok: /POINT "13" 1500 0 740/.test(sB) });
  filas.push({ que: "barra nueva + punto nuevo", medido: /LINE "HE1"/.test(sB) && /POINT "HS1"/.test(sB) ? "ok" : "no", limite: "ok", ok: /LINE "HE1"/.test(sB) && /POINT "HS1" 3000 1500 ?(740)?/.test(sB) });
  filas.push({ que: "carga FX +2 kN en nudo 4", medido: sB.match(/POINTLOAD "4" "N2 COL".*FX ([\d.]+)/)?.[1] ?? "no", limite: "2000", ok: /POINTLOAD "4" "N2 COL" TYPE "FORCE" LC "Dead" FX 2000/.test(sB) });
  filas.push({ que: "seccion de B5 cambiada (General)", medido: /LINEASSIGN "B5" "N2 COL" SECTION "HS_SEC1"/.test(sB) ? "ok" : "no", limite: "ok", ok: /LINEASSIGN "B5" "N2 COL" SECTION "HS_SEC1"/.test(sB) && /FRAMESECTION "HS_SEC1"/.test(sB) });
  filas.push({ que: "apoyo del punto 11 quitado", medido: /POINTASSIGN "11" "Base"/.test(sA) ? "ok" : "no", limite: "ok", ok: /POINTASSIGN "11" "Base"/.test(sA) });
  const intactas = ["LOAD COMBINATIONS", "LOAD CASES", "FUNCTIONS", "MATERIAL PROPERTIES", "ANALYSIS OPTIONS", "MASS SOURCE", "DIAPHRAGM NAMES", "STORIES - IN SEQUENCE FROM TOP", "LOAD PATTERNS"];
  const malas = intactas.filter((s) => seccion(texto, s).join("\n") !== seccion(e1, s).join("\n"));
  filas.push({ que: "secciones no tocadas identicas", medido: malas.join(",") || "todas", limite: "todas", ok: malas.length === 0 });
  const extra = d.soloA.length + d.soloB.length;
  filas.push({ que: "lineas distintas (esperado ~14)", medido: extra, limite: 20, ok: extra <= 20, detalle: `avisos: ${avisos.join(" ; ")} | A: ${d.soloA.join(" || ")} | B: ${d.soloB.join(" || ")}`.slice(0, 1500) });

  // 3. re-importar el exportado
  const r = m.parseE2k(e1);
  filas.push({ que: "reimportar: barras", medido: r.info.nFrames, limite: md.info.nFrames, ok: r.info.nFrames === md.info.nFrames });
  filas.push({ que: "reimportar: nudos", medido: r.info.nNodes, limite: md.info.nNodes + 1, ok: r.info.nNodes === md.info.nNodes + 1 });
  const j13 = r.nodeNames.indexOf("13@N2 COL");
  filas.push({ que: "reimportar: x del 13", medido: j13 >= 0 ? r.nodes[j13][0] : "no", limite: x13 + 0.5, ok: j13 >= 0 && Math.abs(r.nodes[j13][0] - (x13 + 0.5)) < 1e-9 });
  const jB5 = r.elementNames.indexOf("B5");
  filas.push({ que: "reimportar: A de B5 x2", medido: r.elementInputs.areas.get(jB5), limite: A5 * 2, ok: Math.abs(r.elementInputs.areas.get(jB5) / (A5 * 2) - 1) < 1e-6 });
  const e2 = m.exportE2k(entrada(r));
  d = dif(norm(e1), norm(e2));
  filas.push({ que: "re-exportar el reimportado = igual", medido: d.soloA.length + d.soloB.length, limite: 0, ok: d.soloA.length + d.soloB.length === 0 });

  // 4. camino reconstruido (sin e2kModel): conserva casos, combos, espectros, materiales
  const md2 = mk();
  const e3 = m.exportE2k({ nodes: md2.nodes, elements: md2.elements, nodeInputs: md2.nodeInputs, elementInputs: md2.elementInputs, title: md2.info.title, units: md2.units });
  const cnt = (t, re) => t.split(/\r?\n/).filter((l) => re.test(l)).length;
  for (const [que, re] of [["COMBOS", /^\s*COMBO\s+"[^"]+"\s+TYPE/], ["LOADCASE (tipo)", /^\s*LOADCASE\s+"[^"]+"\s+TYPE/], ["MATERIAL (tipo)", /^\s*MATERIAL\s+"[^"]+"\s+TYPE/], ["FUNCTION (tipo)", /^\s*FUNCTION\s+"[^"]+"\s+FUNCTYPE/]]) {
    const o = cnt(texto, re), n = cnt(e3, re);
    filas.push({ que: `reconstruido conserva ${que}`, medido: `${n}/${o}`, limite: `${o}/${o}`, ok: n >= o });
  }
  filas.push({ que: "reconstruido: DIAPHRAGM SEMIRIGID", medido: /DIAPHRAGM\s+"D1"\s+TYPE SEMIRIGID/.test(e3) ? "ok" : "no", limite: "ok", ok: /DIAPHRAGM\s+"D1"\s+TYPE SEMIRIGID/.test(e3) });
  filas.push({ que: "reconstruido: AUTOMESHOPTIONS", medido: /AUTOMESHOPTIONS/.test(e3) ? "ok" : "no", limite: "ok", ok: /AUTOMESHOPTIONS/.test(e3) });
  return filas.map((f) => ({ ...f, crudo: true }));
}
