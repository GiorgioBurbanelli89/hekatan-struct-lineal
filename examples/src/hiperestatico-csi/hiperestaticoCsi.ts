/**
 * HYPERSTATIC como SAP2000 — ejemplo del Load Case «Hyperstatic» (5-oct-2026): fuerzas SECUNDARIAS del pretensado.
 *   Caso base = cargas equivalentes de un tendón parabólico en una viga continua 2 × 20 m (P, flechas e₁ y e₂):
 *     w = 8·P·e/L² hacia arriba en cada vano, P·4e/L hacia abajo en cada extremo de vano, axial ±P en los extremos.
 *   Hyperstatic = la viga SIN apoyos cargada con las reacciones del base → M secundario (lineal entre apoyos).
 * Mismo modelo en SAP2000 24 por OAPI (validation/casos-csi/sap_hiperestatico.py). Test `node tests/run.mjs hiperestatico`.
 */
import type { ExampleDef } from "../workspace/exampleRegistry";
import { deform, analyze, hyperstaticAnalysis } from "hekatan-fem";

const E = 2.5e7, NU = 0.2;
const SEC = { A: 0.6, As2: 0.5, As3: 0.5, J: 0.03690796651957947, I22: 0.0125, I33: 0.072 };
// SAP2000 24 con P = 2000 kN, e = 0.4 / 0.3 m
const SAP = { r0: 34.90951453830398, r20: -69.81902907665244, m3Max: 698.1902548405851, v2Max: 34.909514359314926 };
let ultimo: { r0: number; r20: number; m3Max: number; v2Max: number; ref: boolean } | null = null;

export const hiperestaticoCsi: ExampleDef = {
  id: "hiperestatico-sap2000",
  name: "Hyperstatic (pretensado, momentos secundarios) — igual que SAP2000",
  category: "1️⃣ Frames · 🎯 2 GDL Flexión",
  params: {
    P: { default: 2000, label: "Fuerza del tendón P (kN)", folder: "Tendón", min: 100, max: 10000, step: 100 },
    e1: { default: 0.4, label: "Flecha vano 1 (m)", folder: "Tendón", min: 0, max: 1, step: 0.05 },
    e2: { default: 0.3, label: "Flecha vano 2 (m)", folder: "Tendón", min: 0, max: 1, step: 0.05 },
  },
  guide: [
    "Hyperstatic = la estructura SIN apoyos cargada con las reacciones del caso base (aquí, el tendón)",
    "Las cargas del tendón se equilibran solas: en una viga isostática no darían reacciones; en la continua sí → momento secundario",
    "📊 Calculados: reacciones y momento secundario de Hekatan Struct y de SAP2000 (P 2000 kN, e 0.4 / 0.3 m)",
    "Settings › 🔩 Hyperstatic: ▶ Calcular (toma las cargas del caso aplicado) y ver el diagrama secundario",
  ],
  build(p, states) {
    const L = 20, n = 40;
    const nodes = Array.from({ length: n + 1 }, (_, k) => [k, 0, 0]);
    const elements = Array.from({ length: n }, (_, k) => [k, k + 1]);
    const mapa = (v: number) => new Map(elements.map((_, e) => [e, v]));
    const frameLoads = new Map<number, number[]>();
    const ei: any = { elasticities: mapa(E), shearModuli: mapa(E / (2 * (1 + NU))), poissonsRatios: mapa(NU), densities: mapa(0),
      areas: mapa(SEC.A), momentsOfInertiaZ: mapa(SEC.I33), momentsOfInertiaY: mapa(SEC.I22), torsionalConstants: mapa(SEC.J),
      shearAreasZ: mapa(SEC.As2), shearAreasY: mapa(SEC.As3), frameLoads };
    const supports = new Map<number, boolean[]>([[0, [true, true, true, true, false, false]], [20, [false, true, true, false, false, false]], [40, [false, true, true, false, false, false]]]);
    const loads = new Map<number, number[]>();
    const suma = (q: number, c: number[]) => { const v = loads.get(q) ?? [0, 0, 0, 0, 0, 0]; c.forEach((x, k) => (v[k] += x)); loads.set(q, v); };
    [p.e1, p.e2].forEach((e, v) => {
      const w = (8 * p.P * e) / (L * L), i0 = v * 20, i1 = i0 + 20;
      for (let el = i0; el < i1; el++) { frameLoads.set(el, [0, 0, w]); suma(el, [0, 0, w / 2, 0, -w / 12, 0]); suma(el + 1, [0, 0, w / 2, 0, w / 12, 0]); }
      suma(i0, [0, 0, (-w * L) / 2, 0, 0, 0]); suma(i1, [0, 0, (-w * L) / 2, 0, 0, 0]);
    });
    suma(0, [p.P, 0, 0, 0, 0, 0]); suma(40, [-p.P, 0, 0, 0, 0, 0]);
    states.nodes.val = nodes as any; states.elements.val = elements as any;
    states.nodeInputs.val = { supports, loads } as any; states.elementInputs.val = ei;
    try {
      const d = deform(nodes as any, elements as any, states.nodeInputs.val, ei);
      states.deformOutputs.val = d; states.analyzeOutputs.val = analyze(nodes as any, elements as any, ei, d);
      const H = hyperstaticAnalysis(nodes as any, elements as any, states.nodeInputs.val, ei);
      let m3Max = 0, v2Max = 0;
      for (const [, m] of H.bendingsZ) m3Max = Math.max(m3Max, -m[0], m[1]);
      for (const [, v] of H.shearsY) v2Max = Math.max(v2Max, -v[0], v[1]);
      ultimo = { r0: H.reaccionesBase.get(0)![2], r20: H.reaccionesBase.get(20)![2], m3Max, v2Max,
        ref: Math.abs(p.P - 2000) < 1e-9 && Math.abs(p.e1 - 0.4) < 1e-9 && Math.abs(p.e2 - 0.3) < 1e-9 };
    } catch (e) { console.warn("[hiperestatico-sap2000]", e); ultimo = null; }
    states.objects3D.val = [];
  },
  computedLabels() {
    const o: Record<string, string> = {};
    if (!ultimo) { o["Hyperstatic"] = "✗ no se pudo calcular"; return o; }
    const f = (h: number, s: number, dec: number) => ultimo!.ref ? `${h.toFixed(dec)} · SAP2000 ${s.toFixed(dec)} (${(100 * (h / s - 1)).toFixed(4)} %)` : h.toFixed(dec);
    o["Reacción base x=0 (kN)"] = f(ultimo.r0, SAP.r0, 4);
    o["Reacción base x=20 (kN)"] = f(ultimo.r20, SAP.r20, 4);
    o["M3 secundario máx (kN·m)"] = f(ultimo.m3Max, SAP.m3Max, 4);
    o["V2 secundario (kN)"] = f(ultimo.v2Max, SAP.v2Max, 4);
    o["Referencia"] = ultimo.ref ? "SAP2000 24, caso HYP sobre PT (validation/casos-csi)" : "sin referencia (P 2000 kN, e 0.4 / 0.3 m la tiene)";
    return o;
  },
};
