/**
 * Panel «〜 Estado estacionario» (1-oct-2026): el Load Case «Steady State» de SAP2000 sobre el modelo en pantalla.
 *   [K − ω²M + i·(dK·K + dM·M)]·a = s·f(ω)·e^{iθ}·p     (CSiRefer cap. XXV, amortiguamiento HISTERÉTICO)
 * Carga: las fuerzas del caso aplicado (las flechas) o una aceleración unitaria en la base. Motor: steadyStateAnalysis
 * (hekatan-fem → modal.cpp, sección 8b), arbitrado con SAP2000: tests/casos/estacionario_sap2000.mjs (0.000 %).
 * Gráfica: módulo |u| = √(Re² + Im²), fase = atan2(Im, Re) (convención CSI: Re = cos ωt, Im = sin ωt), Re o Im del nudo de control contra la frecuencia. Animación: u(t) = Re·cos ωt + Im·sin ωt.
 */
import type { State } from "vanjs-core";
import { steadyStateAnalysis, psdAnalysis, type EstacionarioResultado } from "hekatan-fem";
import { getSharedChartPanel } from "./chartPanel";
import { modelDiagonal } from "./modeScale";

export interface ModeloSS { nodes: State<any[]>; elements: State<any[]>; nodeInputs: State<any>; elementInputs: State<any>; }

export function montarEstacionario(folder: any, estado: ModeloSS, viewerElm: HTMLElement, pararOtras: () => void) {
  const f = folder.addFolder({ title: "〜 Estado estacionario / PSD (lineal)", expanded: false });
  const p = { tipo: 0, psd: "0:1, 5:2, 10:0.5, 100:0.5", carga: 0, f1: 0.5, f2: 20, n: 100, dK: 0.04, dM: 0, nudo: -1, dir: 0, graf: 0, fver: 0, info: "Carga armónica = las fuerzas del caso aplicado. ▶ Calcular." };
  let ultimo: { r: EstacionarioResultado; nudo: number } | null = null;
  f.addBinding(p, "tipo", { label: "Tipo de caso", options: { "Steady State (amplitud)": 0, "Power Spectral Density (RMS)": 1 } });
  f.addBinding(p, "psd", { label: "PSD  f:S, f:S… (Hz : carga²/Hz)" });
  f.addBinding(p, "carga", { label: "Carga", options: { "Fuerzas del caso aplicado": 0, "Aceleración en la base X (1 m/s²)": 1, "Aceleración en la base Y (1 m/s²)": 2 } });
  f.addBinding(p, "f1", { label: "f inicial (Hz)", min: 0, max: 100, step: 0.1 });
  f.addBinding(p, "f2", { label: "f final (Hz)", min: 0.1, max: 200, step: 0.1 });
  f.addBinding(p, "n", { label: "N° de incrementos", min: 2, max: 1000, step: 1 });
  f.addBinding(p, "dK", { label: "dK histerético (2ξ)", min: 0, max: 1, step: 0.001 });
  f.addBinding(p, "dM", { label: "dM", min: 0, max: 10, step: 0.001 });
  f.addBinding(p, "nudo", { label: "Nudo de control (−1 auto)", min: -1, max: 1e6, step: 1 });
  f.addBinding(p, "dir", { label: "Componente", options: { Ux: 0, Uy: 1, Uz: 2 } }).on("change", () => graficar());
  f.addBinding(p, "graf", { label: "Gráfica", options: { "Módulo |u|": 0, "Fase (°) = atan2(Im, Re)": 1, "Parte real Re": 2, "Parte imaginaria Im": 3 } }).on("change", () => graficar());
  f.addButton({ title: "▶ Calcular estado estacionario" }).on("click", () => calcular());
  f.addBinding(p, "info", { label: "", readonly: true, multiline: true, rows: 5 });
  f.addBinding(p, "fver", { label: "f a animar (Hz, 0 = pico)", min: 0, max: 200, step: 0.01 });
  f.addButton({ title: "🎞 Animar a esa frecuencia" }).on("click", () => animar());
  f.addButton({ title: "⏹ Detener" }).on("click", () => parar(true));
  f.addButton({ title: "🎞 Cómo se usa (GIF)" }).on("click", () => {
    try { window.open(`${(import.meta as any).env?.BASE_URL ?? "./"}tutoriales/${p.tipo === 1 ? "psd" : "steady_state"}.gif`, "_blank"); } catch { /* nada */ }
  });

  function frecuencias() { const a: number[] = []; for (let k = 0; k <= p.n; k++) a.push(+(p.f1 + (p.f2 - p.f1) * k / p.n).toFixed(6)); return a; }
  function cargas(): any[] | undefined {
    if (p.carga === 0) return undefined;
    return [{ tipo: 1, dir: p.carga - 1, s: 1, fase: 0 }];
  }
  function nudoControl(): number {
    if (p.nudo >= 0) return p.nudo;
    const L: Map<number, number[]> | undefined = estado.nodeInputs.val?.loads;
    let mejor = -1, m = 0;
    L?.forEach((v, q) => { const a = Math.hypot(v[0], v[1], v[2]); if (a > m) { m = a; mejor = q; } });
    if (mejor >= 0 && p.carga === 0) return mejor;
    const N = estado.nodes.val; let zt = -Infinity; N.forEach((n: number[], q: number) => { if (n[2] > zt) { zt = n[2]; mejor = q; } });
    return mejor;
  }
  function calcular() {
    parar(true);
    const nodes = estado.nodes.val, els = estado.elements.val, ni = estado.nodeInputs.val, ei = estado.elementInputs.val;
    if (!nodes?.length) { p.info = "✗ no hay modelo"; f.refresh(); return; }
    if (!ei?.densities?.size) { p.info = "✗ el modelo no tiene masa (densidades): el estado estacionario la necesita"; f.refresh(); return; }
    const nudo = nudoControl(); const t0 = performance.now();
    try {
      const r = steadyStateAnalysis(nodes, els, ni, ei, { frecuencias: frecuencias(), dK: p.dK, dM: p.dM, cargas: cargas() as any, nudos: [nudo] });
      if (!r) throw new Error("sin resultado");
      ultimo = { r, nudo };
    } catch (e) { ultimo = null; p.info = "✗ " + String(e); f.refresh(); return; }
    if (p.tipo === 1) {
      const psd = p.psd.split(",").map((x) => x.split(":").map(Number)).filter((v) => v.length === 2 && v.every(isFinite)) as Array<[number, number]>;
      const rp = psdAnalysis(nodes, els, ni, ei, { frecuencias: frecuencias(), psd, dK: p.dK, dM: p.dM, carga: p.carga === 0 ? undefined : { tipo: 1, dir: p.carga - 1 }, nudos: [nudo] });
      if (rp) {
        const rr = rp.raizPSD.get(nudo)!; ultimo = { r: { frecuencias: rp.frecuencias, re: new Map([[nudo, rr]]), im: new Map([[nudo, rr.map(() => [0, 0, 0, 0, 0, 0])]]) }, nudo };
        const rms = rp.rms.get(nudo)!;
        p.info = `PSD · nudo ${nudo} · ${rp.frecuencias.length} frecuencias
RMS: ux ${(rms[0] * 1000).toFixed(4)} · uy ${(rms[1] * 1000).toFixed(4)} · uz ${(rms[2] * 1000).toFixed(4)} mm
√(∫PSD df), trapecio, como SAP2000
${(performance.now() - t0).toFixed(0)} ms`;
        f.refresh(); graficar(); return;
      }
    }
    const pico = picoDe(); p.fver = pico.f;
    p.info = `Nudo de control ${nudo} · ${ultimo.r.frecuencias.length} frecuencias\nPico de |u${"xyz"[p.dir]}| = ${(pico.a * 1000).toFixed(3)} mm a ${pico.f.toFixed(2)} Hz\n(resonancia: cerca de un periodo propio)\n${(performance.now() - t0).toFixed(0)} ms · como SAP2000 Steady State`;
    f.refresh(); graficar();
  }
  function amplitudes(): [number, number][] {
    if (!ultimo) return [];
    const re = ultimo.r.re.get(ultimo.nudo) ?? [], im = ultimo.r.im.get(ultimo.nudo) ?? [];
    return ultimo.r.frecuencias.map((fr, k) => [fr, Math.hypot(re[k]?.[p.dir] ?? 0, im[k]?.[p.dir] ?? 0)] as [number, number]);
  }
  function picoDe() { let b = { f: 0, a: 0 }; for (const [fr, a] of amplitudes()) if (a > b.a) b = { f: fr, a }; return b; }
  function graficar() {
    if (!ultimo) return;
    const panel = getSharedChartPanel(); const c = "xyz"[p.dir];
    const g = p.tipo === 1 ? 0 : p.graf, nombres = ["|u", "fase u", "Re u", "Im u"];
    const re = ultimo.r.re.get(ultimo.nudo) ?? [], im = ultimo.r.im.get(ultimo.nudo) ?? [];
    const val = (k: number) => { const a = re[k]?.[p.dir] ?? 0, b = im[k]?.[p.dir] ?? 0;
      return g === 0 ? Math.hypot(a, b) * 1000 : g === 1 ? (Math.atan2(b, a) * 180) / Math.PI : (g === 2 ? a : b) * 1000; };
    panel.setTitle(p.tipo === 1 ? `PSD · √PSD de u${c} del nudo ${ultimo.nudo}` : `Estado estacionario · ${nombres[g]}${c}${g === 0 ? "|" : ""} del nudo ${ultimo.nudo}`);
    panel.setSeries([{ label: `${nombres[g]}${c}${g === 0 ? "|" : ""} ${g === 1 ? "[°]" : "[mm]"}  ·  pico ${picoDe().f.toFixed(2)} Hz`, data: ultimo.r.frecuencias.map((fr, k) => [fr, val(k)] as [number, number]), color: "#7f96b3", width: 2 }]);
    panel.setAxes({ xLabel: "f (Hz)", yLabel: g === 1 ? "fase (°)" : g === 0 ? "|u| (mm)" : "u (mm)", grid: true, xMin: undefined, xMax: undefined, yMin: g === 1 ? -180 : undefined, yMax: g === 1 ? 180 : undefined });
    panel.show();
  }

  let raf = 0, originales: any[] | null = null, deformadaAntes: boolean | null = null;
  const ajustes = () => (viewerElm as any).__settings ?? (viewerElm as any).__ctx?.settings;
  function parar(restaurar: boolean) {
    if (raf) cancelAnimationFrame(raf); raf = 0;
    const st = ajustes(); if (deformadaAntes !== null && st?.deformedShape) st.deformedShape.val = deformadaAntes; deformadaAntes = null;
    if (restaurar && originales && originales.length === estado.nodes.rawVal.length) estado.nodes.val = originales.map((n) => [...n]);
    originales = null;
  }
  function animar() {
    if (!ultimo) { calcular(); if (!ultimo) return; }
    pararOtras(); parar(true);
    const fr = p.fver > 0 ? p.fver : picoDe().f;
    const nodes = estado.nodes.rawVal;
    const r = steadyStateAnalysis(nodes, estado.elements.val, estado.nodeInputs.val, estado.elementInputs.val,
      { frecuencias: [fr], dK: p.dK, dM: p.dM, cargas: cargas() as any });
    if (!r) return;
    originales = nodes.map((n: any) => [...n]);
    const st = ajustes(); if (st?.deformedShape) { deformadaAntes = !!st.deformedShape.val; st.deformedShape.val = false; }
    let umax = 0; r.re.forEach((v, q) => { const w = r.im.get(q)![0]; umax = Math.max(umax, Math.hypot(v[0][0], v[0][1], v[0][2], w[0], w[1], w[2])); });
    const esc = umax > 0 ? 0.05 * modelDiagonal(originales as any) / umax : 0; const t0 = performance.now(); let ult = 0;
    const tick = (now: number) => {
      if (now - ult >= 50) {
        ult = now; const ph = ((now - t0) / 1000) * 2 * Math.PI * 0.7, c = Math.cos(ph), s = Math.sin(ph);
        estado.nodes.val = originales!.map((n: any, q: number) => { const a = r.re.get(q)?.[0], b = r.im.get(q)?.[0];
          return a && b ? [n[0] + esc * (a[0] * c + b[0] * s), n[1] + esc * (a[1] * c + b[1] * s), n[2] + esc * (a[2] * c + b[2] * s)] : [...n]; }) as any;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }
  return { calcular, animar, parar, resultado: () => ultimo, params: p, refrescar: () => f.refresh(), folder: f };
}
