/**
 * PANDEO DE CÁSCARAS (muros y losas) contra SAP2000 24 por OAPI (5-oct-2026).
 *   [K − λ·G(r)]·Ψ = 0, G de cáscara (CSiRefer p.444): tensiones de membrana del estático de r en Gauss 2×2 (ITW con
 *   giro normal), integradas con las derivadas de las N bilineales, sobre u, v, w.
 * Modelos (validation/pandeo_cascara/modelos.py, la MISMA malla en los dos): placa simplemente apoyada comprimida
 * (Timoshenko k = 4), muro ménsula con carga en la cabeza, losa en cortante puro (k_s = 9.34). Shell-Thin.
 * Referencia: validation/pandeo_cascara/sap_pandeo_cascara.py → sap_pandeo_cascara.json (λ, formas, estático).
 * Capas: (1) Kg sola = con el ESTÁTICO DE SAP → λ exactos; (2) cadena entera de Struct → λ y MAC de las formas.
 * (El prototipo en Python, cuya membrana NO es la del C++, dejaba en el muro +0.0039 %: la capa (1) aísla la Kg.)
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { cargarFem, empaquetar, R } from "../lib/bundle.mjs";
import { RAIZ } from "../lib/wasm.mjs";

export function modeloStruct(M, E, nu) {
  const nodes = M.nodos.map((p) => [...p]);
  const elements = M.panos.map((c) => [...c]);
  const em = (v) => new Map(elements.map((_, e) => [e, v]));
  const elementInputs = { elasticities: em(E), poissonsRatios: em(nu), thicknesses: em(M.t), shearModuli: em(E / (2 * (1 + nu))),
    plateFormulations: em(1), etabsWallJoint: false };
  const supports = new Map(Object.entries(M.apoyos).map(([k, s]) => [+k, s.map((x) => !!x)]));
  const loads = new Map(Object.entries(M.cargas).map(([k, c]) => [+k, [...c]]));
  return { nodes, elements, nodeInputs: { supports, loads }, elementInputs };
}

// λ y −λ tienen el mismo |λ| (losa en cortante): se empareja cada modo de SAP con el λ de Struct más cercano
const emparejar = (hs, ref) => { let j = -1, best = Infinity; hs.forEach((h, i) => { const d = Math.abs(h / ref - 1); if (d < best) { best = d; j = i; } }); return j; };
const mac = (a, b) => { let ab = 0, aa = 0, bb = 0; for (let i = 0; i < a.length; i++) { ab += a[i] * b[i]; aa += a[i] * a[i]; bb += b[i] * b[i]; } return (ab * ab) / (aa * bb); };

export const nombre = "pandeo-cascara-sap2000";
export const descripcion = "Pandeo de cáscaras (muros y losas) = SAP2000: λ y formas (MAC), Kg sola y cadena entera";
export async function correr() {
  const fem = await cargarFem();
  const D = JSON.parse(readFileSync(join(RAIZ, "validation/pandeo_cascara/modelos.json"), "utf8"));
  const S = JSON.parse(readFileSync(join(RAIZ, "validation/pandeo_cascara/sap_pandeo_cascara.json"), "utf8"));
  const filas = [];
  for (const M of D.modelos) {
    const s = S[M.nombre]; if (!s) continue;
    const m = modeloStruct(M, D.E, D.nu);
    // TODOS los modos de SAP (también los de EN EL PLANO, λ 2600…48 000: la membrana de Struct = la de CSI).
    // Excepción medida: losa_4x4 modo 8 de SAP λ = −0.0583 no tiene pareja (su forma es la del modo 7756 en el plano,
    // MAC 0.995): residuo del solver iterativo de SAP con 8 modos pedidos sobre 5 de verdad.
    const espurio = (l) => Math.abs(l) < 0.5;
    const ks = s.factores.map((_, k) => k).filter((k) => !espurio(s.factores[k]));
    const lim = 1e-4;
    // (2) cadena entera
    const d = fem.deform(m.nodes, m.elements, m.nodeInputs, m.elementInputs);
    const r = fem.bucklingAnalysis(m.nodes, m.elements, m.nodeInputs, m.elementInputs, undefined, s.factores.length + 4, d.deformations);
    let peor = 0, peorMac = 1, nMac = 0; const det = [];
    const uz = (v) => v.filter((_, i) => i % 6 < 3);   // traslaciones (el muro pandea en y, la losa en z)
    for (const k of ks) {
      const ref = s.factores[k], j = emparejar(r?.factors ?? [], ref), h = r?.factors?.[j] ?? NaN;
      const dd = Math.abs(h / ref - 1) * 100; peor = Math.max(peor, isNaN(dd) ? 1e9 : dd);
      if (det.length < 3) det.push(`${h?.toFixed?.(6)}/${ref.toFixed(6)}`);
      if (Math.abs(ref) < 1000) { nMac++; peorMac = Math.min(peorMac, mac(uz(r.modeShapes[j]), uz(s.modos[k].flat()))); }
    }
    const esp = s.factores.length - ks.length;
    filas.push({ que: `${M.nombre}: λ de ${ks.length} modos (Struct entero)`, medido: peor, limite: lim, ok: peor <= lim,
      detalle: det.join("  ") + (M.analitico ? `  · Timoshenko ${M.analitico.toFixed(4)}` : "") + (esp ? `  · ${esp} espurio de SAP` : "") });
    if (!nMac) continue;
    // losa_12x12: el VECTOR de SAP no está convergido (su cociente de Rayleigh con la K y la Kg da 8.8307, no su λ 8.8251;
    // residuo 3.6 %); el de Struct, 1e-13. Por eso su MAC se queda en 0.99990.
    const limMac = M.nombre === "losa_12x12" ? 2e-4 : 1e-6;
    filas.push({ que: `${M.nombre}: forma (traslaciones) de ${nMac} modos, 1 − MAC mín`, medido: 1 - peorMac, limite: limMac, ok: 1 - peorMac <= limMac,
      detalle: `MAC mín ${peorMac.toFixed(8)}` });
    // (1) la Kg sola: el estático de SAP2000
    const us = new Map(Object.entries(s.estatico).map(([q, v]) => [+q, v]));
    const r1 = fem.bucklingAnalysis(m.nodes, m.elements, m.nodeInputs, m.elementInputs, undefined, s.factores.length + 4, us);
    let p1 = 0; for (const k of ks) p1 = Math.max(p1, Math.abs(r1.factors[emparejar(r1.factors, s.factores[k])] / s.factores[k] - 1) * 100);
    filas.push({ que: `${M.nombre}: Kg sola (estático de SAP) λ de ${ks.length} modos`, medido: p1, limite: 1e-4, ok: p1 <= 1e-4,
      detalle: `${r1.factors[0].toFixed(6)}/${s.factores[0].toFixed(6)}` });
  }
  // (3) el EJEMPLO del menú (pandeo-cascara-sap2000) con sus parámetros por defecto: misma malla y λ = SAP2000
  const ex = (await empaquetar(`export { pandeoCascara } from "${R}/examples/src/pandeo-cascara/pandeoCascara";
`, "pandeoCascara")).pandeoCascara;
  const mk = () => { const st = (v) => ({ val: v }); return { nodes: st([]), elements: st([]), nodeInputs: st({}), elementInputs: st({}),
    deformOutputs: st({}), analyzeOutputs: st({}), objects3D: st([]) }; };
  for (const [tipo, nombreSap] of [[0, "placa_16x8"], [1, "muro_8x12"], [2, "losa_12x12"], [0, "placa_4x2"], [1, "muro_2x3"], [2, "losa_4x4"]]) {
    const p = {}; for (const [k, d] of Object.entries(ex.params)) p[k] = d.default;
    ex.onParamChange?.("tipo", Object.assign(p, { tipo }));
    const [nx, ny] = nombreSap.split("_")[1].split("x").map(Number); p.nx = nx; p.ny = ny;
    const st = mk(); ex.build(p, st); const L = ex.computedLabels(p, st);
    const M = D.modelos.find((m) => m.nombre === nombreSap);
    const misma = JSON.stringify(st.nodes.val) === JSON.stringify(M.nodos) && JSON.stringify(st.elements.val) === JSON.stringify(M.panos);
    let peor = 0; const fil = [];
    for (let k = 1; k <= 6; k++) { const m = /\(([-0-9.]+) %\)/.exec(L[`modo ${k}: λ`] ?? ""); if (m) peor = Math.max(peor, Math.abs(+m[1])); fil.push(m ? 1 : 0); }
    const n = fil.reduce((a, b) => a + b, 0);
    filas.push({ que: `ejemplo ${nombreSap}: misma malla y λ vs SAP2000 (${n} modos con pareja)`, medido: misma && n >= 4 ? peor : 1e9, limite: 1e-4,
      ok: misma && n >= 4 && peor <= 1e-4, detalle: (L["modo 1: λ"] ?? "") + (misma ? "" : "  ✗ malla distinta") });
  }
  return filas;
}
