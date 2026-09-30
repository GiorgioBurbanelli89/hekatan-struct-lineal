/**
 * Panel «〰 Tiempo-historia» del workspace (30-sep-2026): el análisis lineal de SAP2000/ETABS sobre el
 * modelo que está en pantalla, sea cual sea (barras, cáscaras, sólidos, diafragmas, muelles).
 *
 * Motor: `timeHistoryAnalysis` (hekatan-fem → modal.cpp + utils/tiempoHistoria.h), arbitrado con SAP2000
 * paso a paso (tests/casos/tiempo_historia_sap2000.mjs). Unidades del workspace: kN, m, t → a en m/s².
 *   · Modal: modos del modal, cada uno integrado EXACTO con la carga lineal entre puntos (Chopra §5.2).
 *   · Directa: HHT-α (α = 0 = Newmark), amortiguamiento de Rayleigh con ξ en el modo 1 y en el modo n.
 * Registro: pulso de medio seno, o un archivo del usuario (RENAC o dos columnas t, a). No se incluye ningún
 * registro real (los de RENAC tienen política de uso): se leen solo si el usuario los carga.
 */
import type { State } from "vanjs-core";
import { timeHistoryAnalysis, modalAnalysis, type THResultado } from "hekatan-fem";
import { getSharedChartPanel } from "../chartPanel";
import { leerAcelerograma, pulso, pico, G, type Acel } from "./acelerograma";
import { modelDiagonal } from "../modeScale";

export interface ModeloTH {
  nodes: State<any[]>;
  elements: State<any[]>;
  nodeInputs: State<any>;
  elementInputs: State<any>;
}

export function montarTiempoHistoria(folder: any, estado: ModeloTH, viewerElm: HTMLElement, pararOtrasAnimaciones: () => void) {
  const f = folder.addFolder({ title: "〰 Tiempo-historia (lineal)", expanded: false });
  const p = {
    metodo: 0,            // 0 modal, 1 directa
    dir: 0,               // 0 X, 1 Y, 2 Z
    registro: 0,          // 0 pulso, 1 archivo
    ampG: 0.3, dur: 0.5, total: 4,
    escala: 1.0,
    xi: 5,                // %
    nModos: 12,
    alpha: 0,
    dt: 0.01,
    grafica: 0,           // 0 u nudo de control, 1 cortante basal, 2 aceleración del terreno
    info: "—",
  };
  let acel: Acel = pulso(p.ampG, p.dur, p.total, p.dt);
  let ultimo: { r: THResultado; nodoControl: number; comp: number } | null = null;

  f.addBinding(p, "metodo", { label: "Método", options: { "Modal (exacto por modo)": 0, "Directa (HHT / Newmark)": 1 } });
  f.addBinding(p, "dir", { label: "Dirección", options: { X: 0, Y: 1, Z: 2 } });
  f.addBinding(p, "registro", { label: "Registro", options: { "Pulso de medio seno": 0, "Archivo (RENAC o t, a)": 1 } })
    .on("change", () => { if (p.registro === 1) abrirArchivo(); else rehacerPulso(); });
  const fPulso = f.addFolder({ title: "Pulso", expanded: false });
  fPulso.addBinding(p, "ampG", { label: "amplitud (g)", min: 0.01, max: 2, step: 0.01 }).on("change", () => rehacerPulso());
  fPulso.addBinding(p, "dur", { label: "duración (s)", min: 0.05, max: 5, step: 0.05 }).on("change", () => rehacerPulso());
  fPulso.addBinding(p, "total", { label: "total (s)", min: 0.5, max: 60, step: 0.5 }).on("change", () => rehacerPulso());
  f.addBinding(p, "escala", { label: "factor de escala", min: 0.01, max: 10, step: 0.01 });
  f.addBinding(p, "xi", { label: "ξ amortiguamiento (%)", min: 0, max: 30, step: 0.5 });
  f.addBinding(p, "nModos", { label: "N° de modos (modal)", min: 1, max: 200, step: 1 });
  f.addBinding(p, "alpha", { label: "α HHT (directa)", min: -0.3333, max: 0, step: 0.01 });
  f.addBinding(p, "dt", { label: "Δt salida (s)", min: 0.001, max: 0.1, step: 0.001 });
  f.addBinding(p, "info", { label: "", readonly: true, multiline: true, rows: 3 });
  f.addButton({ title: "▶ Correr tiempo-historia" }).on("click", () => correr());
  f.addBinding(p, "grafica", { label: "Gráfica", options: { "u del nudo de control": 0, "Cortante basal": 1, "Aceleración del terreno": 2 } })
    .on("change", () => graficar());
  f.addButton({ title: "🎞 Animar la deformada" }).on("click", () => animar());
  f.addButton({ title: "⏹ Detener animación" }).on("click", () => parar(true));

  function rehacerPulso() { acel = pulso(p.ampG, p.dur, p.total, p.dt); p.info = acel.fuente; f.refresh(); }
  function abrirArchivo() {
    const inp = document.createElement("input");
    inp.type = "file"; inp.accept = ".txt,.dat,.csv,.acc,.evt,.*";
    inp.onchange = async () => {
      const fl = inp.files?.[0]; if (!fl) return;
      try {
        acel = leerAcelerograma(await fl.text(), "m/s2", fl.name);
        const pk = pico(acel);
        p.dt = +acel.dt.toFixed(4);
        p.info = `${acel.fuente}\nPGA ${(Math.abs(pk.a) / G).toFixed(3)} g en t = ${pk.t.toFixed(2)} s${acel.aviso ? "\n⚠ " + acel.aviso : ""}`;
      } catch (e: any) { p.info = "✗ " + e.message; p.registro = 0; }
      f.refresh();
    };
    inp.click();
  }

  function modeloActual() {
    return { nodes: estado.nodes.val, elements: estado.elements.val, ni: estado.nodeInputs.val, ei: estado.elementInputs.val };
  }

  function correr() {
    parar(true);
    const { nodes, elements, ni, ei } = modeloActual();
    if (!nodes?.length) { p.info = "✗ no hay modelo"; f.refresh(); return; }
    const t = [], v = [];
    for (let i = 0; i < acel.pares.length; i += 2) { t.push(acel.pares[i]); v.push(acel.pares[i + 1]); }
    const T = t[t.length - 1] ?? 0;
    const nPasos = Math.max(1, Math.round(T / p.dt));
    // Rayleigh (directa): ξ en el modo 1 y en el modo nModos (o el último que haya)
    let cM = 0, cK = 0;
    const xi = p.xi / 100;
    const t0 = performance.now();
    try {
      if (p.metodo === 1 && xi > 0) {
        const mo = modalAnalysis(nodes, elements, ni, ei, Math.max(2, p.nModos), 0, 0, 1, ni.diaphragms, ni.springs);
        const f1 = mo.frequencies[0], fn = mo.frequencies[mo.frequencies.length - 1];
        if (f1 && fn && fn > f1) { const w1 = 2 * Math.PI * f1, wn = 2 * Math.PI * fn; cM = 2 * xi * w1 * wn / (w1 + wn); cK = 2 * xi / (w1 + wn); }
      }
      // animación: todos los nudos, con ≤ 150 cuadros (y ≤ ~6 millones de números)
      const nN = nodes.length;
      const cuadros = Math.max(20, Math.min(150, Math.floor(6e6 / (nN * 6))));
      const paso = Math.max(1, Math.ceil(nPasos / cuadros));
      const r = timeHistoryAnalysis(nodes, elements, ni, ei, {
        metodo: p.metodo === 1 ? "directa" : "modal", dt: p.dt, nPasos, numModes: p.nModos,
        xi: p.metodo === 0 ? xi : 0, cM, cK, alpha: p.alpha,
        cargas: [{ tipo: "aceleracion", dir: p.dir as 0 | 1 | 2, funcion: { t, v }, sf: p.escala }],
        nudosSalida: nodes.map((_, i) => i), paso, envolvente: false,
      });
      if (!r) throw new Error("el motor no devolvió resultado (¿modelo sin masa o inestable?)");
      // nudo de control: el de mayor |u| en la dirección de la carga
      let nc = 0, umax = -1;
      r.u.forEach((serie, n) => { for (const u of serie) if (Math.abs(u[p.dir]) > umax) { umax = Math.abs(u[p.dir]); nc = n; } });
      const vmax = Math.max(...r.base.map((b) => Math.abs(b[p.dir])));
      ultimo = { r, nodoControl: nc, comp: p.dir };
      const ms = performance.now() - t0;
      p.info = `${p.metodo === 1 ? "Directa" : `Modal, ${r.nModos} modos`} · ${nPasos} pasos · ${(ms / 1000).toFixed(1)} s\n` +
        `u máx ${(umax * 1000).toFixed(2)} mm en el nudo ${nc}\ncortante basal máx ${vmax.toFixed(1)} kN`;
      f.refresh();
      graficar();
    } catch (e: any) { p.info = "✗ " + (e?.message ?? e); f.refresh(); }
  }

  function graficar() {
    const panel = getSharedChartPanel();
    const eje = ["X", "Y", "Z"][p.dir];
    if (p.grafica === 2 || !ultimo) {
      const d: [number, number][] = [];
      for (let i = 0; i < acel.pares.length; i += 2) d.push([acel.pares[i], acel.pares[i + 1] * p.escala / G]);
      panel.setTitle(`Aceleración del terreno a${eje.toLowerCase()}(t)`);
      panel.setSeries([{ label: acel.fuente.slice(0, 60), data: d, color: "#7f96b3", width: 1.5 }]);
      panel.setAxes({ xLabel: "t (s)", yLabel: "a (g)", grid: true });
    } else if (p.grafica === 0) {
      const { r, nodoControl: nc } = ultimo;
      const s = r.u.get(nc) ?? [];
      const tt = r.t.filter((_, k) => k < s.length);
      panel.setTitle(`u${eje.toLowerCase()}(t) del nudo ${nc} (relativo al terreno)`);
      panel.setSeries([{ label: `u${eje.toLowerCase()} nudo ${nc}`, data: tt.map((x, k) => [x, s[k][p.dir] * 1000] as [number, number]), color: "#7f96b3", width: 2 }]);
      panel.setAxes({ xLabel: "t (s)", yLabel: "u (mm)", grid: true });
    } else {
      const { r } = ultimo;
      panel.setTitle(`Cortante basal V${eje.toLowerCase()}(t)`);
      panel.setSeries([{ label: `V${eje.toLowerCase()} (reacción en la base)`, data: r.base.map((b, k) => [r.t[k], b[p.dir]] as [number, number]), color: "#c0392b", width: 2 }]);
      panel.setAxes({ xLabel: "t (s)", yLabel: "V (kN)", grid: true });
    }
    panel.show();
  }

  // ── animación: nudos = originales + escala·u(t) (solo traslaciones), en bucle ──
  let raf = 0, originales: any[] | null = null, deformadaAntes: boolean | null = null;
  const ajustes = () => (viewerElm as any).__settings ?? (viewerElm as any).__ctx?.settings;
  function parar(restaurar: boolean) {
    if (raf) cancelAnimationFrame(raf); raf = 0;
    // la deformada ESTÁTICA (caso Dead) se apaga mientras se anima: si no, el visor la suma encima de los nudos movidos
    const st = ajustes();
    if (deformadaAntes !== null && st?.deformedShape) { st.deformedShape.val = deformadaAntes; }
    deformadaAntes = null;
    if (restaurar && originales && originales.length === estado.nodes.rawVal.length) estado.nodes.val = originales.map((n) => [...n]);
    originales = null;
  }
  function animar() {
    if (!ultimo) { correr(); if (!ultimo) return; }
    pararOtrasAnimaciones();
    parar(true);
    const { r } = ultimo!;
    originales = estado.nodes.rawVal.map((n: any) => [...n]);
    const st = ajustes();
    if (st?.deformedShape) { deformadaAntes = !!st.deformedShape.val; st.deformedShape.val = false; }
    let umax = 0;
    r.u.forEach((serie) => serie.forEach((u) => { umax = Math.max(umax, Math.hypot(u[0], u[1], u[2])); }));
    const esc = umax > 0 ? 0.037 * modelDiagonal(originales as any) / umax : 1;   // 3.7 % de la diagonal, como el modal
    const nF = r.t.length;
    let k = 0, ultimoT = 0;
    const tick = (now: number) => {
      if (now - ultimoT >= 50) {       // ~20 cuadros por segundo
        ultimoT = now;
        const nuevos = originales!.map((n: any, i: number) => {
          const u = r.u.get(i)?.[k]; return u ? [n[0] + esc * u[0], n[1] + esc * u[1], n[2] + esc * u[2]] : [...n];
        });
        estado.nodes.val = nuevos as any;
        k = (k + 1) % nF;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }
  p.info = acel.fuente;
  return { correr, animar, parar, resultado: () => ultimo };
}
