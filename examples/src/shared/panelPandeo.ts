/**
 * Panel «⟂ Pandeo (lineal)» del workspace (1-oct-2026): el Load Case «Buckling» de SAP2000 sobre el modelo en pantalla.
 *   [K − λ·G(r)]·Ψ = 0      r = las cargas del caso que está aplicado ahora (las flechas del visor)
 * La axial P-delta de cada barra sale del estático de r (promedio de los extremos, CSiRefer cap. XXII) y G se arma en
 * el C++ (hekatan-fem/src/cpp/utils/pandeo.h). Arbitrado con SAP2000: tests/casos/pandeo_sap2000.mjs (0.0000 %).
 * Barras (frames) y, desde el 5-oct-2026, CÁSCARAS Q4 y (6-oct-2026) TRIÁNGULOS (muros y losas: Kg con las fuerzas de
 * membrana del estático de r, CSiRefer p.444; = SAP2000 en tests/casos/pandeo_cascara_sap2000.mjs, también con modificadores).
 * Sólidos: sin G. Shell-Thick: Struct usa MITC4 (Bathe-Dvorkin), no la placa gruesa de CSI: con malla gruesa λ
 * difiere hasta ~10 %; con malla fina 0.1–2 % y converge a la exacta FSDT (test placa-gruesa-navier).
 *
 * También la lista de los 11 «Load Case Type» de SAP2000: los lineales están (o estarán) en Hekatan Struct; los NO
 * LINEALES son del módulo Pro (decisión de Jorge, 1-oct-2026).
 */
import type { State } from "vanjs-core";
import { bucklingAnalysis, deform, type PandeoResultado } from "hekatan-fem";
import { modelDiagonal } from "./modeScale";

export interface ModeloPandeo {
  nodes: State<any[]>; elements: State<any[]>; nodeInputs: State<any>; elementInputs: State<any>; analyzeOutputs: State<any>;
}

const TIPOS: Array<[string, string]> = [
  ["Static", "✓ Hekatan Struct: el caso de carga de siempre (Settings › Caso)."],
  ["Staged Construction", "Módulo Pro — no disponible en Hekatan Struct (análisis NO LINEAL)."],
  ["Multi-step Static", "✓ Hekatan Struct: 🚚 Carga móvil (Multi-step Static), un estático por paso, = SAP2000."],
  ["Modal", "✓ Hekatan Struct: ⚡ Modal + Animación."],
  ["Response Spectrum", "✓ Hekatan Struct: 🌎 Sismo NEC (CQC, = SAP2000)."],
  ["Time History (lineal)", "✓ Hekatan Struct: 〰 Tiempo-historia (lineal), modal o directa."],
  ["Time History (no lineal)", "Módulo Pro — no disponible en Hekatan Struct (análisis NO LINEAL)."],
  ["Nonlinear Static (pushover)", "Módulo Pro — no disponible en Hekatan Struct (análisis NO LINEAL)."],
  ["Moving Load", "✓ Hekatan Struct: 🚚 Carga móvil › Moving Load (líneas de influencia, envolvente), = SAP2000."],
  ["Buckling", "✓ Hekatan Struct: ⟂ Pandeo (lineal) de barras, muros y losas, = SAP2000."],
  ["Steady State", "✓ Hekatan Struct: 〜 Estado estacionario (lineal), = SAP2000."],
  ["Power Spectral Density", "✓ Hekatan Struct: 〜 Estado estacionario / PSD, = SAP2000."],
  ["Hyperstatic", "✓ Hekatan Struct: 🔩 Hyperstatic (secundarios del pretensado), = SAP2000."],
];

export function montarTiposDeCaso(folder: any) {
  const f = folder.addFolder({ title: "📋 Tipos de caso (SAP2000)", expanded: false });
  const p = { tipo: 9, info: TIPOS[9][1] };
  const op: Record<string, number> = {}; TIPOS.forEach(([n], k) => (op[n] = k));
  f.addBinding(p, "tipo", { label: "Load Case Type", options: op }).on("change", () => { p.info = TIPOS[p.tipo][1]; f.refresh(); });
  f.addBinding(p, "info", { label: "", readonly: true, multiline: true, rows: 3 });
  const elegir = (k: number) => { p.tipo = k; p.info = TIPOS[k][1]; f.refresh(); };
  return { params: p, elegir, tipos: TIPOS.map(([n]) => n), folder: f };
}

export function montarPandeo(folder: any, estado: ModeloPandeo, viewerElm: HTMLElement, pararOtrasAnimaciones: () => void) {
  const f = folder.addFolder({ title: "⟂ Pandeo (lineal)", expanded: false });
  const p = { nModos: 6, modo: 1, info: "Cargas r = las del caso aplicado (flechas). ▶ Calcular." };
  let ultimo: PandeoResultado | null = null;
  f.addBinding(p, "nModos", { label: "N° de modos", min: 1, max: 30, step: 1 });
  f.addButton({ title: "▶ Calcular pandeo" }).on("click", () => calcular());
  f.addBinding(p, "info", { label: "", readonly: true, multiline: true, rows: 10 });
  f.addBinding(p, "modo", { label: "Modo a ver", min: 1, max: 30, step: 1 }).on("change", () => { if (raf) animar(); });
  f.addButton({ title: "🎞 Animar el modo de pandeo" }).on("click", () => animar());
  f.addButton({ title: "⏹ Detener" }).on("click", () => parar(true));
  f.addButton({ title: "🎞 Cómo se usa (GIF): muros y losas" }).on("click", () => {
    try { window.open(`${(import.meta as any).env?.BASE_URL ?? "./"}tutoriales/pandeo_cascaras.gif`, "_blank"); } catch { /* nada */ }
  });

  function calcular() {
    parar(true);
    const nodes = estado.nodes.val, elements = estado.elements.val, ni = estado.nodeInputs.val, ei = estado.elementInputs.val;
    const normals: Map<number, number[]> | undefined = estado.analyzeOutputs.val?.normals;
    if (!nodes?.length) { p.info = "✗ no hay modelo"; f.refresh(); return; }
    const nQ4 = elements.filter((e: number[]) => e.length === 4 || e.length === 3).length;   // cáscaras: Q4 y triángulos
    if ((!normals || normals.size === 0) && nQ4 === 0) { p.info = "✗ el modelo no tiene barras con fuerza axial ni cáscaras (los sólidos aún sin G)."; f.refresh(); return; }
    const t0 = performance.now();
    try {
      // cáscaras: la Kg sale de las fuerzas de membrana del ESTÁTICO de r (se resuelve aquí: la deformada en pantalla
      // puede ser otra cosa, p. ej. un modo)
      const est = nQ4 ? (deform(nodes, elements, ni, ei, (ni as any).springs) as any)?.deformations : undefined;
      ultimo = bucklingAnalysis(nodes, elements, ni, ei, normals, p.nModos, est) ?? null;
    } catch (e) { ultimo = null; p.info = "✗ " + String(e); f.refresh(); return; }
    if (!ultimo || !ultimo.factors.length) { p.info = "✗ no se pudo resolver (¿mecanismo? ¿sin compresión?)"; f.refresh(); return; }
    const conSolidos = elements.some((e: number[]) => e.length > 4);
    const pf: Map<number, number> | undefined = (ei as any).plateFormulations;
    const gruesa = elements.some((e: number[], k: number) => (e.length === 3 || e.length === 4) && (ei as any).thicknesses?.get?.(k) > 0 && pf?.get(k) !== 1);
    const l1 = ultimo.factors[0];
    p.info = "λ = factor de pandeo\n" +
      ultimo.factors.map((l, k) => `modo ${k + 1}:  λ = ${l.toFixed(4)}`).join("\n") +
      "\n" + (l1 > 1 ? "λ₁ > 1: aguanta las cargas" : l1 > 0 ? "λ₁ < 1: PANDEA antes" : "λ₁ < 0: cargas invertidas") +
      (conSolidos ? "\n⚠ sólidos: sin G todavía" : "") +
      (gruesa ? "\n⚠ Shell-Thick: placa MITC4 (Bathe-Dvorkin), no la de SAP2000: con malla gruesa λ difiere hasta ~10 %; refine la malla: Struct converge a la exacta FSDT (con malla fina 0.1–2 % de SAP2000)" : "") +
      `\n${(performance.now() - t0).toFixed(0)} ms · como SAP2000`;
    p.modo = 1; f.refresh();
  }

  let raf = 0, originales: any[] | null = null, deformadaAntes: boolean | null = null;
  const ajustes = () => (viewerElm as any).__settings ?? (viewerElm as any).__ctx?.settings;
  function parar(restaurar: boolean) {
    if (raf) cancelAnimationFrame(raf); raf = 0;
    const st = ajustes();
    if (deformadaAntes !== null && st?.deformedShape) st.deformedShape.val = deformadaAntes;
    deformadaAntes = null;
    if (restaurar && originales && originales.length === estado.nodes.rawVal.length) estado.nodes.val = originales.map((n) => [...n]);
    originales = null;
  }
  function animar() {
    if (!ultimo) { calcular(); if (!ultimo) return; }
    pararOtrasAnimaciones(); parar(true);
    const k = Math.min(ultimo!.modeShapes.length, Math.max(1, Math.round(p.modo))) - 1;
    const psi = ultimo!.modeShapes[k];
    originales = estado.nodes.rawVal.map((n: any) => [...n]);
    const st = ajustes();
    if (st?.deformedShape) { deformadaAntes = !!st.deformedShape.val; st.deformedShape.val = false; }
    let umax = 0;
    for (let i = 0; i < originales.length; i++) umax = Math.max(umax, Math.hypot(psi[6 * i], psi[6 * i + 1], psi[6 * i + 2]));
    const esc = umax > 0 ? 0.06 * modelDiagonal(originales as any) / umax : 0;
    let ultimoT = 0; const t0 = performance.now();
    const tick = (now: number) => {
      if (now - ultimoT >= 50) {
        ultimoT = now; const s = Math.sin(((now - t0) / 1000) * 2 * Math.PI * 0.6);
        estado.nodes.val = originales!.map((n: any, i: number) => [n[0] + esc * s * psi[6 * i], n[1] + esc * s * psi[6 * i + 1], n[2] + esc * s * psi[6 * i + 2]]) as any;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }
  return { calcular, animar, parar, resultado: () => ultimo, params: p, refrescar: () => f.refresh(), folder: f };
}
