/**
 * Panel «🔩 Hyperstatic (pretensado)» del workspace (5-oct-2026): Load Case «Hyperstatic» de SAP2000.
 *   La estructura SIN apoyos cargada con las REACCIONES del caso aplicado ahora (el caso base: típicamente las cargas
 *   equivalentes del tendón) → esfuerzos SECUNDARIOS. = SAP2000 0.000 % (tests/casos/hiperestatico_sap2000.mjs).
 */
import type { State } from "vanjs-core";
import { hyperstaticAnalysis, type HiperestaticoResultado } from "hekatan-fem";

export interface ModeloHiper {
  nodes: State<any[]>; elements: State<any[]>; nodeInputs: State<any>; elementInputs: State<any>;
  deformOutputs: State<any>; analyzeOutputs: State<any>;
}

export function montarHiperestatico(folder: any, estado: ModeloHiper) {
  const f = folder.addFolder({ title: "🔩 Hyperstatic (secundarios del pretensado)", expanded: false });
  const p = { info: "Caso base = las cargas del caso aplicado (p. ej. las equivalentes del tendón). ▶ Calcular." };
  f.addButton({ title: "▶ Calcular Hyperstatic" }).on("click", () => calcular());
  f.addBinding(p, "info", { label: "", readonly: true, multiline: true, rows: 8 });
  f.addButton({ title: "↩ Volver al caso base" }).on("click", () => volver());
  f.addButton({ title: "🎞 Cómo se usa (GIF)" }).on("click", () => {
    try { window.open(`${(import.meta as any).env?.BASE_URL ?? "./"}tutoriales/hyperstatic.gif`, "_blank"); } catch { /* nada */ }
  });
  let res: HiperestaticoResultado | null = null, antes: { d: any; a: any } | null = null;
  function calcular() {
    volver();
    const nodes = estado.nodes.val, elements = estado.elements.val, ni = estado.nodeInputs.val, ei = estado.elementInputs.val;
    if (!ni?.supports?.size) { p.info = "✗ el modelo no tiene apoyos"; f.refresh(); return; }
    const t0 = performance.now();
    try { res = hyperstaticAnalysis(nodes as any, elements as any, ni, ei); } catch (e) { res = null; p.info = "✗ " + String(e); f.refresh(); return; }
    let sR = [0, 0, 0], mMax = 0, mMin = 0;
    for (const r of res.reaccionesBase.values()) for (let k = 0; k < 3; k++) sR[k] += r[k];
    for (const [, m] of res.bendingsZ) { mMax = Math.max(mMax, -m[0], m[1]); mMin = Math.min(mMin, -m[0], m[1]); }
    const fz = [...res.reaccionesBase].map(([q, r]) => `  nudo ${q}: Fz = ${r[2].toFixed(3)}`).slice(0, 6).join("\n");
    p.info = `Hyperstatic (SAP2000)\nreacciones del caso base:\n${fz}\nΣF = (${sR.map((x) => x.toFixed(3)).join(", ")})` +
      `${Math.hypot(...sR) > 1e-6 ? "  ⚠ no autoequilibrado" : ""}\nM3 secundario: ${mMin.toFixed(3)} … ${mMax.toFixed(3)}\n${(performance.now() - t0).toFixed(0)} ms · como SAP2000`;
    antes = { d: estado.deformOutputs.val, a: estado.analyzeOutputs.val };
    estado.deformOutputs.val = { deformations: res.deformations, reactions: res.reactions } as any;
    estado.analyzeOutputs.val = { ...(antes.a ?? {}), normals: res.normals, shearsY: res.shearsY, shearsZ: res.shearsZ, torsions: res.torsions,
      bendingsY: res.bendingsY, bendingsZ: res.bendingsZ } as any;
    f.refresh();
  }
  function volver() { if (antes) { estado.deformOutputs.val = antes.d; estado.analyzeOutputs.val = antes.a; antes = null; } }
  return { calcular, volver, resultado: () => res, params: p, folder: f };
}
