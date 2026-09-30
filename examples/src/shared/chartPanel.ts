/**
 * =============================================================================
 *  Chart Panel — Visor de gráficas para benchmarks dinámicos
 * =============================================================================
 *
 *  Panel flotante con Canvas 2D para mostrar:
 *    • Time history (u, v, a vs t)
 *    • Modal shapes (φ vs piso/posición)
 *    • Espectros de respuesta (D-V-A vs T)
 *    • Cargas en el tiempo F(t)
 *
 *  Sin dependencias externas — solo Canvas 2D nativo.
 *  Tweakpane se usa solo para toggles de series visibles.
 *
 *  Uso típico:
 *    const panel = createChartPanel({ title: "Paz 7.1 — Time History" });
 *    panel.setSeries([
 *      { label: "u1(t)", data: [[0,0],[0.1,0.5],...], color: "#1a4d8c" },
 *      { label: "u2(t)", data: [[0,0],[0.1,1.2],...], color: "#c0392b" },
 *    ]);
 *    panel.setAxes({ xLabel: "t (s)", yLabel: "u (in)" });
 *    panel.show();
 * =============================================================================
 */

export type Point = [number, number];

export interface Series {
  label: string;
  data: Point[];
  color: string;
  /** "line" (default) | "scatter" | "bar" */
  type?: "line" | "scatter" | "bar";
  /** Grosor línea (default 2) */
  width?: number;
  /** Visible (default true) */
  visible?: boolean;
}

export interface ChartAxes {
  xLabel: string;
  yLabel: string;
  /** Override range. Default = auto-fit */
  xMin?: number;
  xMax?: number;
  yMin?: number;
  yMax?: number;
  /** Si true, dibuja grilla menor */
  grid?: boolean;
}

export interface ChartPanelOptions {
  title?: string;
  width?: number;        // default 560
  height?: number;       // default 360
  /** Posición fija top-right por default */
  position?: { top?: number; right?: number; left?: number; bottom?: number };
  /** Container padre. Default = document.body */
  parent?: HTMLElement;
  /** Si true, se muestra al crear. Default = false */
  initiallyVisible?: boolean;
}

export interface ChartPanelApi {
  /** El elemento DOM del panel (para append/remove externo) */
  el: HTMLDivElement;
  /** Setea series y redibuja */
  setSeries(series: Series[]): void;
  /** Setea ejes y redibuja */
  setAxes(axes: ChartAxes): void;
  /** Setea título */
  setTitle(title: string): void;
  /** Mostrar */
  show(): void;
  /** Ocultar */
  hide(): void;
  /** Toggle */
  toggle(): void;
  /** Forzar redibujo */
  redraw(): void;
  /** Eliminar del DOM */
  destroy(): void;
}

const DEFAULT_COLORS = [
  "#1a4d8c", "#c0392b", "#2d8659", "#d4a017",
  "#7d3c98", "#117a8b", "#e67e22", "#34495e",
];

export function nextColor(idx: number): string {
  return DEFAULT_COLORS[idx % DEFAULT_COLORS.length];
}

export function createChartPanel(opts: ChartPanelOptions = {}): ChartPanelApi {
  const W = opts.width ?? 560;
  const H = opts.height ?? 360;
  const parent = opts.parent ?? document.body;

  // ── Container ───────────────────────────────────────────────────
  const el = document.createElement("div");
  el.id = "hk-shared-chart";          // para saber si está a la vista (Compartir lo guarda en el enlace)
  el.className = "hekatan-chart-panel";
  Object.assign(el.style, {
    position: "fixed",
    top: opts.position?.top != null ? `${opts.position.top}px` : "auto",
    right: opts.position?.right != null ? `${opts.position.right}px` : "16px",
    left: opts.position?.left != null ? `${opts.position.left}px` : "auto",
    bottom: opts.position?.bottom != null ? `${opts.position.bottom}px` : "16px",
    width: `${W + 16}px`,
    background: "rgba(20, 24, 30, 0.92)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "8px",
    boxShadow: "0 6px 24px rgba(0,0,0,0.5)",
    padding: "8px",
    fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
    fontSize: "11px",
    color: "#e2e8f0",
    zIndex: "100",
    backdropFilter: "blur(6px)",
    display: opts.initiallyVisible ? "block" : "none",
    userSelect: "none",
  });

  // Header (título + cerrar)
  const header = document.createElement("div");
  Object.assign(header.style, {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "4px",
    paddingBottom: "4px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    cursor: "move",
  });
  const titleEl = document.createElement("span");
  titleEl.textContent = opts.title ?? "Chart";
  Object.assign(titleEl.style, { fontWeight: "600", fontSize: "12px", color: "#a5b4fc" });
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "×";
  Object.assign(closeBtn.style, {
    background: "transparent", border: "none", color: "#e2e8f0",
    fontSize: "18px", cursor: "pointer", padding: "0 6px", lineHeight: "1",
  });
  closeBtn.onclick = () => api.hide();
  header.appendChild(titleEl);
  header.appendChild(closeBtn);
  el.appendChild(header);

  // ── Drag a través del header ─────────────────────────────────────
  let dragOff: { x: number; y: number } | null = null;
  header.addEventListener("mousedown", (e) => {
    const rect = el.getBoundingClientRect();
    dragOff = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    e.preventDefault();
  });
  window.addEventListener("mousemove", (e) => {
    if (!dragOff) return;
    el.style.left = `${e.clientX - dragOff.x}px`;
    el.style.top = `${e.clientY - dragOff.y}px`;
    el.style.right = "auto";
    el.style.bottom = "auto";
  });
  window.addEventListener("mouseup", () => { dragOff = null; });

  // Canvas
  const canvas = document.createElement("canvas");
  canvas.width = W * window.devicePixelRatio;
  canvas.height = H * window.devicePixelRatio;
  Object.assign(canvas.style, { width: `${W}px`, height: `${H}px`, display: "block" });
  el.appendChild(canvas);

  // Legend (toggle series)
  const legend = document.createElement("div");
  Object.assign(legend.style, {
    marginTop: "4px",
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    paddingTop: "4px",
    borderTop: "1px solid rgba(255,255,255,0.1)",
    fontSize: "10px",
  });
  el.appendChild(legend);

  // Cursor info (X/Y at mouse)
  const cursorInfo = document.createElement("div");
  Object.assign(cursorInfo.style, {
    position: "absolute",
    background: "rgba(0,0,0,0.85)",
    border: "1px solid rgba(255,255,255,0.2)",
    padding: "3px 6px",
    borderRadius: "3px",
    pointerEvents: "none",
    fontSize: "10px",
    display: "none",
    color: "#fde68a",
  });
  el.appendChild(cursorInfo);

  parent.appendChild(el);

  // ── Estado interno ─────────────────────────────────────────────
  let series: Series[] = [];
  let axes: ChartAxes = { xLabel: "x", yLabel: "y", grid: true };

  // ── Helpers de dibujo ───────────────────────────────────────────
  const ctx = canvas.getContext("2d")!;
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

  const PAD = { top: 18, right: 18, bottom: 36, left: 56 };

  function autoRange(): { xMin: number; xMax: number; yMin: number; yMax: number } {
    const visible = series.filter((s) => s.visible !== false);
    let xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity;
    for (const s of visible) {
      for (const [x, y] of s.data) {
        if (Number.isFinite(x) && Number.isFinite(y)) {
          if (x < xMin) xMin = x; if (x > xMax) xMax = x;
          if (y < yMin) yMin = y; if (y > yMax) yMax = y;
        }
      }
    }
    if (!Number.isFinite(xMin)) { xMin = 0; xMax = 1; yMin = 0; yMax = 1; }
    if (xMin === xMax) { xMax = xMin + 1; }
    if (yMin === yMax) { yMax = yMin + 1; }
    // Margin 5%
    const dx = (xMax - xMin) * 0.02;
    const dy = (yMax - yMin) * 0.08;
    return { xMin: xMin - dx, xMax: xMax + dx, yMin: yMin - dy, yMax: yMax + dy };
  }

  function ticks(min: number, max: number, count: number = 6): number[] {
    const range = max - min;
    if (range <= 0) return [min];
    const rawStep = range / count;
    const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const norm = rawStep / mag;
    const step = (norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10) * mag;
    const start = Math.ceil(min / step) * step;
    const out: number[] = [];
    for (let v = start; v <= max + step * 0.001; v += step) out.push(v);
    return out;
  }

  function fmtTick(v: number): string {
    if (Math.abs(v) < 1e-12) return "0";
    if (Math.abs(v) >= 1e4 || Math.abs(v) < 1e-3) return v.toExponential(1);
    return parseFloat(v.toFixed(4)).toString();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const range = {
      xMin: axes.xMin ?? autoRange().xMin,
      xMax: axes.xMax ?? autoRange().xMax,
      yMin: axes.yMin ?? autoRange().yMin,
      yMax: axes.yMax ?? autoRange().yMax,
    };
    const innerW = W - PAD.left - PAD.right;
    const innerH = H - PAD.top - PAD.bottom;
    const sx = (x: number) => PAD.left + ((x - range.xMin) / (range.xMax - range.xMin)) * innerW;
    const sy = (y: number) => PAD.top + innerH - ((y - range.yMin) / (range.yMax - range.yMin)) * innerH;

    // Background
    ctx.fillStyle = "rgba(255,255,255,0.02)";
    ctx.fillRect(PAD.left, PAD.top, innerW, innerH);

    // Grid + ticks
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.fillStyle = "#94a3b8";
    ctx.font = "10px ui-monospace, monospace";
    ctx.textBaseline = "middle";
    const xt = ticks(range.xMin, range.xMax, 7);
    const yt = ticks(range.yMin, range.yMax, 6);
    ctx.beginPath();
    for (const x of xt) {
      const px = sx(x);
      ctx.moveTo(px, PAD.top); ctx.lineTo(px, PAD.top + innerH);
    }
    for (const y of yt) {
      const py = sy(y);
      ctx.moveTo(PAD.left, py); ctx.lineTo(PAD.left + innerW, py);
    }
    ctx.stroke();
    ctx.textAlign = "center";
    for (const x of xt) ctx.fillText(fmtTick(x), sx(x), H - PAD.bottom + 12);
    ctx.textAlign = "right";
    for (const y of yt) ctx.fillText(fmtTick(y), PAD.left - 4, sy(y));

    // Axis lines (X=0, Y=0)
    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    if (range.xMin <= 0 && range.xMax >= 0) {
      ctx.moveTo(sx(0), PAD.top); ctx.lineTo(sx(0), PAD.top + innerH);
    }
    if (range.yMin <= 0 && range.yMax >= 0) {
      ctx.moveTo(PAD.left, sy(0)); ctx.lineTo(PAD.left + innerW, sy(0));
    }
    ctx.stroke();

    // Box
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.strokeRect(PAD.left, PAD.top, innerW, innerH);

    // Labels
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "11px ui-monospace, monospace";
    ctx.textAlign = "center";
    ctx.fillText(axes.xLabel, PAD.left + innerW / 2, H - 6);
    ctx.save();
    ctx.translate(12, PAD.top + innerH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(axes.yLabel, 0, 0);
    ctx.restore();

    // Series
    for (const s of series) {
      if (s.visible === false) continue;
      ctx.strokeStyle = s.color;
      ctx.fillStyle = s.color;
      ctx.lineWidth = s.width ?? 1.5;
      const type = s.type ?? "line";
      if (type === "line") {
        ctx.beginPath();
        let started = false;
        for (const [x, y] of s.data) {
          if (!Number.isFinite(x) || !Number.isFinite(y)) { started = false; continue; }
          const px = sx(x), py = sy(y);
          if (!started) { ctx.moveTo(px, py); started = true; }
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      } else if (type === "scatter") {
        for (const [x, y] of s.data) {
          if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
          ctx.beginPath();
          ctx.arc(sx(x), sy(y), 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (type === "bar") {
        for (const [x, y] of s.data) {
          if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
          const px = sx(x);
          const py0 = sy(0), py1 = sy(y);
          ctx.fillRect(px - 2, Math.min(py0, py1), 4, Math.abs(py1 - py0));
        }
      }
    }
  }

  function rebuildLegend() {
    legend.innerHTML = "";
    series.forEach((s, i) => {
      const item = document.createElement("span");
      Object.assign(item.style, {
        display: "inline-flex", alignItems: "center", gap: "4px",
        padding: "1px 6px", border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: "3px", cursor: "pointer", opacity: s.visible === false ? "0.4" : "1",
      });
      const sw = document.createElement("span");
      Object.assign(sw.style, { display: "inline-block", width: "10px", height: "10px", background: s.color, borderRadius: "1px" });
      const lab = document.createElement("span");
      lab.textContent = s.label;
      item.appendChild(sw); item.appendChild(lab);
      item.onclick = () => {
        s.visible = s.visible === false ? true : false;
        rebuildLegend();
        draw();
      };
      legend.appendChild(item);
    });
  }

  // Cursor tracking
  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    if (mx < PAD.left || mx > W - PAD.right || my < PAD.top || my > H - PAD.bottom) {
      cursorInfo.style.display = "none";
      return;
    }
    const r = autoRange();
    const xMin = axes.xMin ?? r.xMin, xMax = axes.xMax ?? r.xMax;
    const yMin = axes.yMin ?? r.yMin, yMax = axes.yMax ?? r.yMax;
    const innerW = W - PAD.left - PAD.right;
    const innerH = H - PAD.top - PAD.bottom;
    const x = xMin + ((mx - PAD.left) / innerW) * (xMax - xMin);
    const y = yMax - ((my - PAD.top) / innerH) * (yMax - yMin);
    cursorInfo.style.display = "block";
    cursorInfo.style.left = `${mx + 12}px`;
    cursorInfo.style.top = `${my - 18}px`;
    cursorInfo.textContent = `${axes.xLabel}=${fmtTick(x)}  ${axes.yLabel}=${fmtTick(y)}`;
  });
  canvas.addEventListener("mouseleave", () => { cursorInfo.style.display = "none"; });

  const api: ChartPanelApi = {
    el,
    setSeries(s) {
      series = s.map((sx, i) => ({ ...sx, color: sx.color || nextColor(i), visible: sx.visible !== false }));
      rebuildLegend();
      draw();
    },
    setAxes(a) { axes = { ...axes, ...a }; draw(); },
    setTitle(t) { titleEl.textContent = t; },
    show() { el.style.display = "block"; draw(); },
    hide() { el.style.display = "none"; },
    toggle() { el.style.display = el.style.display === "none" ? "block" : "none"; if (el.style.display === "block") draw(); },
    redraw() { draw(); },
    destroy() { el.remove(); },
  };
  return api;
}

/** Singleton compartido entre ejemplos — un panel en todo el workspace */
let _sharedPanel: ChartPanelApi | null = null;
export function getSharedChartPanel(): ChartPanelApi {
  if (!_sharedPanel) {
    _sharedPanel = createChartPanel({
      title: "📈 Gráficas — benchmark dinámico",
      width: 580,
      height: 340,
      position: { top: 70, right: 12 },
      initiallyVisible: false,
    });
  }
  return _sharedPanel;
}
