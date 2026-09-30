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
    semantica: 0,         // reacción en la base: 0 SAP2000 (elástica), 1 ETABS (directa + cK·K·v)
    info: "—",
  };
  let acel: Acel = pulso(p.ampG, p.dur, p.total, p.dt);
  let ultimo: { r: THResultado; nodoControl: number; comp: number; anim?: THResultado; extremos?: any } | null = null;

  f.addBinding(p, "metodo", { label: "Método", options: { "Modal (exacto por modo)": 0, "Directa (HHT / Newmark)": 1 } });
  f.addBinding(p, "dir", { label: "Dirección", options: { X: 0, Y: 1, Z: 2 } });
  f.addBinding(p, "registro", { label: "Registro", options: { "Pulso de medio seno": 0, "Archivo (RENAC o t, a)": 1 } })
    .on("change", () => { if (p.registro === 1) abrirArchivo(); else rehacerPulso(); });
  const fPulso = f.addFolder({ title: "Pulso", expanded: false });
  fPulso.addBinding(p, "ampG", { label: "amplitud (g)", min: 0.01, max: 2, step: 0.01 }).on("change", () => rehacerPulso());
  fPulso.addBinding(p, "dur", { label: "duración (s)", min: 0.05, max: 5, step: 0.05 }).on("change", () => rehacerPulso());
  fPulso.addBinding(p, "total", { label: "total (s)", min: 0.5, max: 60, step: 0.5 }).on("change", () => rehacerPulso());
  f.addBinding(p, "escala", { label: "factor de escala", min: 0.0001, max: 100, step: 0.0001 });   // NEC: 4 decimales (2.6524)
  f.addBinding(p, "xi", { label: "ξ amortiguamiento (%)", min: 0, max: 30, step: 0.5 });
  f.addBinding(p, "nModos", { label: "N° de modos (modal)", min: 1, max: 200, step: 1 });
  f.addBinding(p, "alpha", { label: "α HHT (directa)", min: -0.3333, max: 0, step: 0.01 });
  f.addBinding(p, "dt", { label: "Δt salida (s)", min: 0.001, max: 0.1, step: 0.001 });
  f.addBinding(p, "semantica", { label: "Reacción en la base", options: { "como SAP2000": 0, "como ETABS": 1 } });
  f.addBinding(p, "info", { label: "", readonly: true, multiline: true, rows: 4 });
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
      cargarTexto(await fl.text(), fl.name);
    };
    inp.click();
  }
  /** La lectura del archivo, separada del diálogo (el botón la usa; y los ensayos sin ratón). */
  function cargarTexto(texto: string, nombre = "archivo") {
    {
      try {
        acel = leerAcelerograma(texto, "m/s2", nombre);
        const pk = pico(acel);
        p.dt = +acel.dt.toFixed(4);
        p.info = `${acel.fuente}\nPGA ${(Math.abs(pk.a) / G).toFixed(3)} g en t = ${pk.t.toFixed(2)} s${acel.aviso ? "\n⚠ " + acel.aviso : ""}`;
      } catch (e: any) { p.info = "✗ " + e.message; p.registro = 0; }
      f.refresh();
    }
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
      const base = {
        metodo: (p.metodo === 1 ? "directa" : "modal") as "directa" | "modal", dt: p.dt, nPasos, numModes: p.nModos,
        xi: p.metodo === 0 ? xi : 0, cM, cK, alpha: p.alpha,
        cargas: [{ tipo: "aceleracion" as const, dir: p.dir as 0 | 1 | 2, funcion: { t, v }, sf: p.escala }],
        semantica: (p.semantica === 1 ? "etabs" : "sap") as "etabs" | "sap",
      };
      // 1) animación: todos los nudos cada `paso` pasos + ENVOLVENTE de todos los pasos (el máximo real de cada nudo)
      const ra = timeHistoryAnalysis(nodes, elements, ni, ei, { ...base, nudosSalida: nodes.map((_, i) => i), paso, envolvente: true });
      if (!ra) throw new Error("el motor no devolvió resultado (¿modelo sin masa o inestable?)");
      // nudo de control: el de mayor |u| en TODOS los pasos (la envolvente, no los cuadros de la animación)
      let nc = 0, umax = -1;
      if (ra.envolvente) ra.envolvente.forEach((e, n) => { if (Math.abs(e[p.dir]) > umax) { umax = Math.abs(e[p.dir]); nc = n; } });
      else ra.u.forEach((serie, n) => { for (const u of serie) if (Math.abs(u[p.dir]) > umax) { umax = Math.abs(u[p.dir]); nc = n; } });
      // 2) gráficas y máximos: el nudo de control y el cortante basal en CADA paso (hasta 30-sep se leían de los cuadros
      //    de la animación, 1 de cada `paso`: en El Centro con 1558 pasos salía 22.4 mm en vez de 24.27 y 260 kN en vez de 292)
      const rc = timeHistoryAnalysis(nodes, elements, ni, ei, { ...base, nudosSalida: [nc], paso: 1, envolvente: false }) ?? ra;
      const r: THResultado = rc;
      ultimo = { r, nodoControl: nc, comp: p.dir, anim: ra };
      const ms = performance.now() - t0;
      // extremos como los lee ETABS bajo su gráfica: «Max: (t, valor); Min: (t, valor)», de TODOS los pasos
      const ext = (vals: number[]) => {
        let iM = 0, im = 0;
        vals.forEach((v, i) => { if (v > vals[iM]) iM = i; if (v < vals[im]) im = i; });
        return { tM: rc.t[iM], vM: vals[iM], tm: rc.t[im], vm: vals[im] };
      };
      const eu = ext((rc.u.get(nc) ?? []).map((u) => 1000 * u[p.dir]));
      const ev = ext(rc.base.map((b) => b[p.dir]));
      const par = (t: number, v: number, d: number) => `(${t.toFixed(2)} s, ${v.toFixed(d)})`;
      ultimo.extremos = { u: eu, V: ev };
      p.info = `${p.metodo === 1 ? "Directa" : `Modal, ${r.nModos} modos`} · ${nPasos} pasos · ${(ms / 1000).toFixed(1)} s
` +
        `u nudo ${nc} [mm]  Máx ${par(eu.tM, eu.vM, 3)}  Mín ${par(eu.tm, eu.vm, 3)}
` +
        `cortante basal [kN]  Máx ${par(ev.tM, ev.vM, 2)}  Mín ${par(ev.tm, ev.vm, 2)}`;
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
      const eu = ultimo.extremos?.u;
      const leyU = eu ? `  ·  Máx (${eu.tM.toFixed(2)}, ${eu.vM.toFixed(3)})  Mín (${eu.tm.toFixed(2)}, ${eu.vm.toFixed(3)})` : "";
      panel.setSeries([{ label: `u${eje.toLowerCase()} nudo ${nc} [mm]${leyU}`, data: tt.map((x, k) => [x, s[k][p.dir] * 1000] as [number, number]), color: "#7f96b3", width: 2 }]);
      panel.setAxes({ xLabel: "t (s)", yLabel: "u (mm)", grid: true });
    } else {
      const { r } = ultimo;
      panel.setTitle(`Cortante basal V${eje.toLowerCase()}(t)`);
      const ev = ultimo.extremos?.V;
      const leyV = ev ? `  ·  Máx (${ev.tM.toFixed(2)}, ${ev.vM.toFixed(2)})  Mín (${ev.tm.toFixed(2)}, ${ev.vm.toFixed(2)})` : "";
      panel.setSeries([{ label: `V${eje.toLowerCase()} base [kN]${leyV}`, data: r.base.map((b, k) => [r.t[k], b[p.dir]] as [number, number]), color: "#c0392b", width: 2 }]);
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
    const r = ultimo!.anim ?? ultimo!.r;       // la animación usa los cuadros de TODOS los nudos
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
  return { correr, animar, parar, resultado: () => ultimo, cargarTexto, params: p, refrescar: () => f.refresh() };
}
