/**
 * STEADY STATE y PSD como SAP2000 — ejemplo de los Load Case «Steady State» y «Power Spectral Density» (5-oct-2026).
 *   [K − ω²M + i·(dK·K + dM·M)]·a = Σ s·f(ω)·e^{iθ}·p        (CSiRefer cap. XXV, amortiguamiento histerético)
 *   Re = en fase (cos ωt), Im = a 90° (sin ωt), |a| = √(Re² + Im²), fase = atan2(Im, Re)
 *   PSD: f(ω) = √S(ω) (S interpolada lineal) → √PSD de la respuesta = |a|, RMS = √∫|a|² df (trapecio)
 * Pórtico 3D de pandeo-sap2000 (4 trozos por barra, una columna girada 30°, la otra articulada) con la masa del
 * hormigón (23.5 kN/m³), carga armónica 20 kN en X y 2 kN en Y en el nudo (0,0,3), 40 frecuencias 0.5…20 Hz, dK 0.04.
 * SAP2000 24 por OAPI: validation/estacionario/sap_ss.py y validation/psd/sap_psd.py → sapDatos.ts (generado).
 * Test: `node tests/run.mjs estacionario` (0.000 %).
 */
import type { ExampleDef } from "../workspace/exampleRegistry";
import { deform, analyze, steadyStateAnalysis, psdAnalysis } from "hekatan-fem";
import { armar, SEC } from "../pandeo/pandeoSap";
import { getSharedChartPanel } from "../shared/chartPanel";
import { SAP_SS } from "./sapDatos";

const E = 2.5e7, NU = 0.2, GAMMA = 23.5, G = 9.80665;
const GRAF = ["Módulo |u|", "Fase (°)", "Parte real Re", "Parte imaginaria Im"];
const fase = (re: number, im: number) => (Math.atan2(im, re) * 180) / Math.PI;
const dFase = (a: number, b: number) => { let d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };

type Res = { caso: number; comp: number; graf: number; carga: number; ref: boolean; frec: number[]; re: number[][]; im: number[][];
  raiz?: number[][]; rms?: number[]; sapRe?: number[][]; sapIm?: number[][] };
let ultimo: Res | null = null;

function valor(g: number, re: number, im: number) { return g === 0 ? Math.hypot(re, im) : g === 1 ? fase(re, im) : g === 2 ? re : im; }

function graficar(r: Res) {
  if (typeof document === "undefined") return;
  const panel = getSharedChartPanel(); const c = "xyz"[r.comp];
  if (r.caso === 1) {
    const h: [number, number][] = r.frec.map((f, k) => [f, r.raiz![k][r.comp] * 1000]);
    const s = r.ref ? SAP_SS.frec.map((f, k) => [f, SAP_SS.raizPSD[k][r.comp] * 1000] as [number, number]) : [];
    panel.setTitle(`PSD · √PSD de u${c} del nudo (0,0,3)`);
    panel.setSeries([{ label: `Hekatan Struct √PSD u${c}`, data: h, color: "#7f96b3", width: 2 },
      ...(r.ref ? [{ label: "SAP2000 24", data: s, color: "#e67e22", type: "scatter" as const }] : [])]);
    panel.setAxes({ xLabel: "f (Hz)", yLabel: "√PSD (mm/√Hz)", grid: true, xMin: undefined, xMax: undefined, yMin: undefined, yMax: undefined });
    panel.show(); return;
  }
  const esc = r.graf === 1 ? 1 : 1000;
  const h: [number, number][] = r.frec.map((f, k) => [f, valor(r.graf, r.re[k][r.comp], r.im[k][r.comp]) * esc]);
  const s: [number, number][] = r.ref ? SAP_SS.frec.map((f, k) => [f, valor(r.graf, r.sapRe![k][r.comp], r.sapIm![k][r.comp]) * esc]) : [];
  panel.setTitle(`Steady State · ${GRAF[r.graf]} de u${c} del nudo (0,0,3)`);
  panel.setSeries([{ label: `Hekatan Struct u${c}`, data: h, color: "#7f96b3", width: 2 },
    ...(r.ref ? [{ label: "SAP2000 24", data: s, color: "#e67e22", type: "scatter" as const }] : [])]);
  panel.setAxes({ xLabel: "f (Hz)", yLabel: r.graf === 1 ? "fase (°)" : `u${c} (mm)`, grid: true,
    xMin: undefined, xMax: undefined, yMin: r.graf === 1 ? -180 : undefined, yMax: r.graf === 1 ? 180 : undefined });
  panel.show();
}

export const estacionarioCsi: ExampleDef = {
  id: "estacionario-sap2000",
  name: "Steady State y PSD (respuesta armónica) — igual que SAP2000",
  category: "1️⃣ Frames · 🏢 Edificios",
  params: {
    caso: { default: 0, label: "Load Case", folder: "Caso", options: { "Steady State": 0, "Power Spectral Density": 1 } },
    graf: { default: 0, label: "Gráfica", folder: "Caso", options: { "Módulo |u|": 0, "Fase (°)": 1, "Parte real Re": 2, "Parte imaginaria Im": 3 } },
    comp: { default: 0, label: "Componente", folder: "Caso", options: { ux: 0, uy: 1 } },
    carga: { default: 0, label: "Carga", folder: "Caso", options: { "20 kN en X + 2 kN en Y (nudo 0,0,3)": 0, "Aceleración en la base X (1 m/s²)": 1 } },
    dK: { default: 0.04, label: "dK histerético (2ξ)", folder: "Caso", min: 0.001, max: 0.5, step: 0.001 },
  },
  guide: [
    "Steady State = la respuesta a una carga que vibra p·cos ωt para siempre: a = [K − ω²M + i·dK·K]⁻¹·p en cada frecuencia",
    "Re = la parte en fase con la carga, Im = la parte a 90°; módulo |u| = √(Re² + Im²), fase = atan2(Im, Re)",
    "Los picos de |u| caen en las frecuencias propias (resonancia); ahí la fase pasa por −90°",
    "PSD = la misma respuesta con carga aleatoria: √PSD = |u| con f(ω) = √S(ω), RMS = √∫|u|² df",
    "📊 Calculados y la gráfica: Hekatan Struct (línea) y SAP2000 24 (puntos), mismo modelo; con dK 0.04 hay referencia",
    "Settings › 〜 Estado estacionario / PSD: el mismo cálculo sobre cualquier modelo, con animación",
  ],
  build(p, states) {
    const M = armar(1, 4);
    const top = M.nodes.findIndex((x) => Math.hypot(x[0], x[1], x[2] - 3) < 1e-9);
    const ei: any = { elasticities: new Map(), shearModuli: new Map(), areas: new Map(), momentsOfInertiaZ: new Map(), momentsOfInertiaY: new Map(),
      torsionalConstants: new Map(), poissonsRatios: new Map(), densities: new Map(), shearAreasY: new Map(), shearAreasZ: new Map(), localAngles: new Map() };
    M.frames.forEach(([, , s, ang], e) => {
      const S = SEC[s];
      ei.elasticities.set(e, E); ei.shearModuli.set(e, E / (2 * (1 + NU))); ei.poissonsRatios.set(e, NU); ei.densities.set(e, GAMMA / G);
      ei.areas.set(e, S.A); ei.momentsOfInertiaZ.set(e, S.I33); ei.momentsOfInertiaY.set(e, S.I22); ei.torsionalConstants.set(e, S.J);
      ei.shearAreasZ.set(e, S.As2); ei.shearAreasY.set(e, S.As3); if (ang) ei.localAngles.set(e, ang);
    });
    const elements = M.frames.map(([i, j]) => [i, j]);
    const loads = new Map<number, number[]>([[top, [20, 2, 0, 0, 0, 0]]]);
    states.nodes.val = M.nodes as any; states.elements.val = elements as any;
    states.nodeInputs.val = { supports: M.apoyos, loads } as any; states.elementInputs.val = ei;
    const caso = Math.round(p.caso), carga = caso === 1 ? 0 : Math.round(p.carga);
    const ref = Math.abs(p.dK - 0.04) < 1e-9;
    try {
      const d = deform(M.nodes as any, elements as any, states.nodeInputs.val, ei);
      states.deformOutputs.val = d; states.analyzeOutputs.val = analyze(M.nodes as any, elements as any, ei, d);
      const frec = [...SAP_SS.frec];
      const r: Res = { caso, comp: Math.round(p.comp), graf: Math.round(p.graf), carga, ref, frec, re: [], im: [] };
      if (caso === 1) {
        const rp = psdAnalysis(M.nodes as any, elements as any, states.nodeInputs.val, ei,
          { frecuencias: frec, psd: SAP_SS.psdF.map((f, k) => [f, SAP_SS.psdS[k]] as [number, number]), dK: p.dK, dM: 0, nudos: [top] });
        r.raiz = rp!.raizPSD.get(top)!; r.rms = rp!.rms.get(top)!;
      } else {
        const ss = steadyStateAnalysis(M.nodes as any, elements as any, states.nodeInputs.val, ei,
          { frecuencias: frec, dK: p.dK, dM: 0, cargas: carga === 1 ? [{ tipo: 1, dir: 0, s: 1, fase: 0 }] as any : undefined, nudos: [top] });
        r.re = ss!.re.get(top)!; r.im = ss!.im.get(top)!;
        r.sapRe = (carga === 1 ? SAP_SS.acelRe : SAP_SS.re) as any; r.sapIm = (carga === 1 ? SAP_SS.acelIm : SAP_SS.im) as any;
      }
      ultimo = r; (states as any)._ss = r; graficar(r);
    } catch (e) { console.warn("[estacionario-sap2000]", e); ultimo = null; }
    states.objects3D.val = [];
  },
  computedLabels() {
    // Claves FIJAS (el panel 📊 Calculados solo refresca las filas que creó al abrir el ejemplo)
    const K = ["Pico (Hz)", "En el pico (mm)", "Fase en el pico (°)", "Peor de 40 f (Re/Im o √PSD)", "Módulo / RMS", "Fase: peor de 40 f", "Referencia"];
    const o: Record<string, string> = {}; K.forEach((k) => (o[k] = "—"));
    const r = ultimo; if (!r) { o["Referencia"] = "✗ no se pudo calcular"; return o; }
    const c = r.comp, u = "u" + "xyz"[c], pct = (h: number, s: number) => `(${(100 * (h / s - 1)).toFixed(4)} %)`;
    if (r.caso === 1) {
      let k0 = 0; r.raiz!.forEach((v, k) => { if (v[c] > r.raiz![k0][c]) k0 = k; });
      o[K[0]] = `${r.frec[k0].toFixed(2)} Hz · √PSD ${u}`;
      o[K[2]] = "PSD no conserva la fase (CSiRefer p. 474)";
      if (!r.ref) { o[K[1]] = `√PSD ${(r.raiz![k0][c] * 1000).toFixed(4)}`; o[K[4]] = `RMS ${u} ${(r.rms![c] * 1000).toFixed(4)} mm`; o[K[6]] = "sin referencia (dK 0.04 la tiene)"; return o; }
      let um = 0, pe = 0; SAP_SS.raizPSD.forEach((v) => (um = Math.max(um, Math.abs(v[c]))));
      r.raiz!.forEach((v, k) => (pe = Math.max(pe, Math.abs(v[c] - SAP_SS.raizPSD[k][c]) / um * 100)));
      o[K[1]] = `√PSD ${(r.raiz![k0][c] * 1000).toFixed(4)} · SAP2000 ${(SAP_SS.raizPSD[k0][c] * 1000).toFixed(4)} ${pct(r.raiz![k0][c], SAP_SS.raizPSD[k0][c])}`;
      o[K[3]] = `√PSD ${u}: ${pe.toFixed(4)} % del máximo · SAP2000`;
      o[K[4]] = `RMS ${u} ${(r.rms![c] * 1000).toFixed(4)} mm · SAP2000 ${(SAP_SS.rms[c] * 1000).toFixed(4)} ${pct(r.rms![c], SAP_SS.rms[c])}`;
      o[K[6]] = "SAP2000 24, Load Case PSD: S = 1, 2, 0.5, 0.5 en 0, 5, 10, 100 Hz (validation/psd)";
      return o;
    }
    let k0 = 0; r.re.forEach((v, k) => { if (Math.hypot(v[c], r.im[k][c]) > Math.hypot(r.re[k0][c], r.im[k0][c])) k0 = k; });
    const mH = Math.hypot(r.re[k0][c], r.im[k0][c]), fH = fase(r.re[k0][c], r.im[k0][c]);
    o[K[0]] = `${r.frec[k0].toFixed(2)} Hz · |${u}|`;
    if (!r.ref) { o[K[1]] = `|${u}| ${(mH * 1000).toFixed(4)}`; o[K[2]] = fH.toFixed(4); o[K[6]] = "sin referencia (dK 0.04 la tiene)"; return o; }
    const sR = r.sapRe!, sI = r.sapIm!; const mS = Math.hypot(sR[k0][c], sI[k0][c]), fS = fase(sR[k0][c], sI[k0][c]);
    o[K[1]] = `|${u}| ${(mH * 1000).toFixed(4)} · SAP2000 ${(mS * 1000).toFixed(4)} ${pct(mH, mS)}`;
    o[K[2]] = `${fH.toFixed(4)} · SAP2000 ${fS.toFixed(4)}`;
    let um = 0, pRI = 0, pM = 0, pF = 0;
    sR.forEach((v, k) => (um = Math.max(um, Math.hypot(v[c], sI[k][c]))));
    r.re.forEach((v, k) => {
      pRI = Math.max(pRI, Math.abs(v[c] - sR[k][c]) / um * 100, Math.abs(r.im[k][c] - sI[k][c]) / um * 100);
      pM = Math.max(pM, Math.abs(Math.hypot(v[c], r.im[k][c]) - Math.hypot(sR[k][c], sI[k][c])) / um * 100);
      pF = Math.max(pF, dFase(fase(v[c], r.im[k][c]), fase(sR[k][c], sI[k][c])));
    });
    o[K[3]] = `Re e Im ${u}: ${pRI.toFixed(4)} % del máximo · SAP2000`;
    o[K[4]] = `|${u}|: ${pM.toFixed(4)} % del máximo · SAP2000`;
    o[K[5]] = `${pF.toFixed(4)}° · SAP2000`;
    o[K[6]] = r.carga === 1 ? "SAP2000 24, caso SSA (aceleración U1), validation/estacionario" : "SAP2000 24, caso SS (Real/Imag at Freq), validation/estacionario";
    return o;
  },
};
