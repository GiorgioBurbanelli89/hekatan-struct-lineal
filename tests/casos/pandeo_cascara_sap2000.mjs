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

export function modeloStruct(M, E, nu, pfThick = 0) {
  const nodes = M.nodos.map((p) => [...p]);
  const elements = M.panos.map((c) => [...c]);
  const em = (v) => new Map(elements.map((_, e) => [e, v]));
  // tipo 2 = Shell-Thick de SAP; mods = los 10 modificadores de CSI (f11 f22 f12 m11 m22 m12 v13 v23 masa peso)
  const elementInputs = { elasticities: em(E), poissonsRatios: em(nu), thicknesses: em(M.t), shearModuli: em(E / (2 * (1 + nu))),
    plateFormulations: em(M.tipo === 2 ? pfThick : 1), etabsWallJoint: false };
  if (M.mods) elementInputs.shellModifiers = em(M.mods.slice(0, 8));
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
    // Shell-Thick (tipo 2): OMITIDO a propósito. La K de la placa gruesa de Struct (MITC4/DSE/DKMQ) no es la de CSI
    // (ya medido en estático: 0.37–1.9 %) y el pandeo hereda esa diferencia (λ1 0.7–10 %); la Kg no se puede aislar sin
    // la K de CSI. Se informa aparte en registros/2026-10-05_struct_lo_que_falta_6_casos.md.
    // 6-oct-2026: diagnosticado. Con MALLA GRUESA la diferencia es de formulación del elemento grueso (en ambos lados
    // lejos de la analítica: placa 4×2 SAP +53 %, Struct +37 %); con malla fina losa 0.26 %, muro 0.33 % y la placa SS
    // duro de los dos va a Reddy (10.2.22) a ≤ 0.12 % → test `placa-gruesa-navier`. Aquí queda INFORMATIVA.
    if (M.tipo === 2) {
      const mT = modeloStruct(M, D.E, D.nu, 0);
      const dT = fem.deform(mT.nodes, mT.elements, mT.nodeInputs, mT.elementInputs);
      const lT = fem.bucklingAnalysis(mT.nodes, mT.elements, mT.nodeInputs, mT.elementInputs, undefined, 2, dT.deformations).factors[0];
      const dd = (Math.abs(lT) / Math.abs(s.factores[0]) - 1) * 100;
      filas.push({ que: `${M.nombre}: Shell-Thick malla gruesa, diferencia de ELEMENTO (informativa)`, medido: dd.toFixed(2) + " %", limite: "info", ok: true, crudo: true,
        detalle: `Struct ${Math.abs(lT).toFixed(4)} · SAP2000 ${Math.abs(s.factores[0]).toFixed(4)} · analítica ${M.analitico?.toFixed(4)} — malla fina en placa-gruesa-navier` });
      continue;
    }
    const m = modeloStruct(M, D.E, D.nu);
    const tri = M.panos.some((c) => c.length === 3);
    // TODOS los modos de SAP (también los de EN EL PLANO, λ 2600…48 000: la membrana de Struct = la de CSI).
    // Excepción medida: losa_4x4 modo 8 de SAP λ = −0.0583 no tiene pareja (su forma es la del modo 7756 en el plano,
    // MAC 0.995): residuo del solver iterativo de SAP con 8 modos pedidos sobre 5 de verdad.
    const espurio = (l) => Math.abs(l) < 0.5;
    const ks = s.factores.map((_, k) => k).filter((k) => !espurio(s.factores[k]));
    // TRIÁNGULOS: la Kg sola es exacta (1e-4 %), pero la membrana del triángulo de Struct = la de SAP a ~1e-5 de su K
    // (bloque θθ; validation/pandeo_cascara/proto_mem_tri.py): con tensión NO uniforme (muro) λ queda a ≤ 5e-4 % (con modificadores 8e-4 %), y los
    // modos EN EL PLANO (λ > 1000, dependen solo de la membrana) a ≤ 2e-3 %.
    const lim = tri ? 1e-3 : 1e-4, limPlano = tri ? 2e-3 : 1e-4;
    // (2) cadena entera
    const d = fem.deform(m.nodes, m.elements, m.nodeInputs, m.elementInputs);
    const r = fem.bucklingAnalysis(m.nodes, m.elements, m.nodeInputs, m.elementInputs, undefined, s.factores.length + 4, d.deformations);
    let peor = 0, peorPl = 0, peorMac = 1, nMac = 0; const det = [];
    const uz = (v) => v.filter((_, i) => i % 6 < 3);   // traslaciones (el muro pandea en y, la losa en z)
    for (const k of ks) {
      const ref = s.factores[k], j = emparejar(r?.factors ?? [], ref), h = r?.factors?.[j] ?? NaN;
      const dd = isNaN(h) ? 1e9 : Math.abs(h / ref - 1) * 100;
      if (Math.abs(ref) < 1000) peor = Math.max(peor, dd); else peorPl = Math.max(peorPl, dd);
      if (det.length < 3) det.push(`${h?.toFixed?.(6)}/${ref.toFixed(6)}`);
      if (Math.abs(ref) < 1000) { nMac++; peorMac = Math.min(peorMac, mac(uz(r.modeShapes[j]), uz(s.modos[k].flat()))); }
    }
    const esp = s.factores.length - ks.length;
    const ok = peor <= lim && peorPl <= limPlano;
    filas.push({ que: `${M.nombre}: λ de ${ks.length} modos (Struct entero)`, medido: Math.max(peor, peorPl * lim / limPlano), limite: lim, ok,
      detalle: det.join("  ") + `  · fuera del plano ${peor.toExponential(1)} %, en el plano ${peorPl.toExponential(1)} %` +
        (M.analitico ? `  · Timoshenko ${M.analitico.toFixed(4)}` : "") + (esp ? `  · ${esp} espurio de SAP` : "") });
    if (!nMac) continue;
    // losa_12x12: el VECTOR de SAP no está convergido (su cociente de Rayleigh con la K y la Kg da 8.8307, no su λ 8.8251;
    // residuo 3.6 %); el de Struct, 1e-13. Por eso su MAC se queda en 0.99990.
    const limMac = M.nombre === "losa_12x12" ? 2e-4 : 1e-6;
    filas.push({ que: `${M.nombre}: forma (traslaciones) de ${nMac} modos, 1 − MAC mín`, medido: 1 - peorMac, limite: limMac, ok: 1 - peorMac <= limMac,
      detalle: `MAC mín ${peorMac.toFixed(8)}` });
    // (1) la Kg sola: el estático de SAP2000
    const us = new Map(Object.entries(s.estatico).map(([q, v]) => [+q, v]));
    const r1 = fem.bucklingAnalysis(m.nodes, m.elements, m.nodeInputs, m.elementInputs, undefined, s.factores.length + 4, us);
    // en triángulos solo los modos FUERA del plano (los de en el plano dependen de la membrana, no de la Kg)
    const ks1 = tri ? ks.filter((k) => Math.abs(s.factores[k]) < 1000) : ks;
    let p1 = 0; for (const k of ks1) p1 = Math.max(p1, Math.abs(r1.factors[emparejar(r1.factors, s.factores[k])] / s.factores[k] - 1) * 100);
    filas.push({ que: `${M.nombre}: Kg sola (estático de SAP) λ de ${ks1.length} modos`, medido: p1, limite: 1e-4, ok: p1 <= 1e-4,
      detalle: `${r1.factors[0].toFixed(6)}/${s.factores[0].toFixed(6)}` });
  }
  // (3) el EJEMPLO del menú (pandeo-cascara-sap2000) con sus parámetros por defecto: misma malla y λ = SAP2000
  const ex = (await empaquetar(`export { pandeoCascara } from "${R}/examples/src/pandeo-cascara/pandeoCascara";
`, "pandeoCascara")).pandeoCascara;
  const mk = () => { const st = (v) => ({ val: v }); return { nodes: st([]), elements: st([]), nodeInputs: st({}), elementInputs: st({}),
    deformOutputs: st({}), analyzeOutputs: st({}), objects3D: st([]) }; };
  for (const [tipo, nombreSap] of [[0, "placa_16x8"], [1, "muro_8x12"], [2, "losa_12x12"], [0, "placa_4x2"], [1, "muro_2x3"], [2, "losa_4x4"],
    [0, "placa_t16x8"], [1, "muro_t8x12"], [2, "losa_t12x12"], [0, "placa_t4x2"], [1, "muro_t2x3"], [2, "losa_t4x4"]]) {
    const p = {}; for (const [k, d] of Object.entries(ex.params)) p[k] = d.default;
    ex.onParamChange?.("tipo", Object.assign(p, { tipo }));
    const tri = nombreSap.includes("_t"); p.elem = tri ? 1 : 0;
    const [nx, ny] = nombreSap.split("_")[1].replace("t", "").split("x").map(Number); p.nx = nx; p.ny = ny;
    const st = mk(); ex.build(p, st); const L = ex.computedLabels(p, st);
    const M = D.modelos.find((m) => m.nombre === nombreSap);
    const misma = JSON.stringify(st.nodes.val) === JSON.stringify(M.nodos) && JSON.stringify(st.elements.val) === JSON.stringify(M.panos);
    let peor = 0; const fil = [];
    for (let k = 1; k <= 6; k++) { const m = /\(([-0-9.]+) %\)/.exec(L[`modo ${k}: λ`] ?? ""); if (m) peor = Math.max(peor, Math.abs(+m[1])); fil.push(m ? 1 : 0); }
    const n = fil.reduce((a, b) => a + b, 0);
    const limE = tri ? 1e-3 : 1e-4;   // triángulos: la membrana a ~1e-5 de la de SAP (ver arriba)
    filas.push({ que: `ejemplo ${nombreSap}: misma malla y λ vs SAP2000 (${n} modos con pareja)`, medido: misma && n >= 4 ? peor : 1e9, limite: limE,
      ok: misma && n >= 4 && peor <= limE, detalle: (L["modo 1: λ"] ?? "") + (misma ? "" : "  ✗ malla distinta") });
  }
  return filas;
}
