/**
 * ============================================================================
 *  Plate Q4 Example — Mindlin-Reissner 4-node Plate Element (WASM)
 * ============================================================================
 *
 *  Interactive example with:
 *   - Auto-generated rectangular mesh (adjustable Lx, Ly, nx, ny)
 *   - Simply-supported or clamped BCs
 *   - Uniform pressure or center point load
 *   - Color-mapped results (w, Mxx, Myy, Mxy, Qx, Qy)
 *   - Comparison with analytical (Navier) solution
 *
 *  Uses the Mindlin-Reissner Q4 element compiled to WASM via Emscripten.
 * ============================================================================
 */

import van from "vanjs-core";
import { plateQ4Solve, type PlateQ4Output } from "hekatan-fem";
import { getToolbar } from "hekatan-ui";

// ── State ──
const state = {
  Lx: van.state(10),
  Ly: van.state(10),
  nx: van.state(16),
  ny: van.state(16),
  thickness: van.state(0.2),
  E: van.state(30e6),      // kN/m²  (concrete ~30 GPa)
  nu: van.state(0.3),
  pressure: van.state(-10), // kN/m² (downward)
  bcType: van.state("simply-supported" as "simply-supported" | "clamped"),
  resultType: van.state("w" as string),
};

let lastOutput: PlateQ4Output | null = null;

// ── Navier analytical solution (simply-supported, uniform load) ──
function navierW(a: number, b: number, q: number, D: number, x: number, y: number, nTerms = 50): number {
  let w = 0;
  for (let m = 1; m <= nTerms; m += 2) {
    for (let n = 1; n <= nTerms; n += 2) {
      const amn = (m * Math.PI / a) ** 2 + (n * Math.PI / b) ** 2;
      const qmn = 16 * q / (Math.PI ** 2 * m * n);
      w += qmn / (D * amn ** 2) * Math.sin(m * Math.PI * x / a) * Math.sin(n * Math.PI * y / b);
    }
  }
  return w;
}

// ── Run solver ──
function solve(): PlateQ4Output {
  const output = plateQ4Solve({
    E: state.E.val,
    nu: state.nu.val,
    thickness: state.thickness.val,
    meshLx: state.Lx.val,
    meshLy: state.Ly.val,
    meshNx: state.nx.val,
    meshNy: state.ny.val,
    bcType: state.bcType.val,
    pressure: state.pressure.val,
  });
  lastOutput = output;
  return output;
}

// ── Canvas rendering ──
function renderPlate(canvas: HTMLCanvasElement, output: PlateQ4Output, resultType: string) {
  const ctx = canvas.getContext("2d")!;
  const W = canvas.width;
  const H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  if (output.nodeResults.length === 0) return;

  const Lx = state.Lx.val;
  const Ly = state.Ly.val;
  const margin = 60;
  const plotW = W - 2 * margin;
  const plotH = H - 2 * margin;
  const scaleX = plotW / Lx;
  const scaleY = plotH / Ly;
  const scale = Math.min(scaleX, scaleY);
  const offX = margin + (plotW - Lx * scale) / 2;
  const offY = margin + (plotH - Ly * scale) / 2;

  function toCanvas(x: number, y: number): [number, number] {
    return [offX + x * scale, offY + (Ly - y) * scale]; // flip Y
  }

  // Get values per node or element
  let values: number[] = [];
  let perElement = false;

  if (resultType === "w") {
    values = output.nodeResults.map((n) => n.w);
  } else if (resultType === "bx") {
    values = output.nodeResults.map((n) => n.bx);
  } else if (resultType === "by") {
    values = output.nodeResults.map((n) => n.by);
  } else {
    perElement = true;
    const key = resultType as keyof typeof output.elementResults[0];
    values = output.elementResults.map((e) => e[key] as number);
  }

  // Color scale
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  function valueToColor(v: number): string {
    const t = (v - minVal) / range; // 0..1
    // Blue → Cyan → Green → Yellow → Red
    const r = t < 0.5 ? 0 : Math.round(255 * Math.min(1, (t - 0.5) * 2));
    const g = t < 0.25 ? Math.round(255 * t * 4) : t < 0.75 ? 255 : Math.round(255 * (1 - (t - 0.75) * 4));
    const b = t < 0.5 ? Math.round(255 * (1 - t * 2)) : 0;
    return `rgb(${r},${g},${b})`;
  }

  // Draw filled quads
  for (const elem of output.elementResults) {
    const [n1, n2, n3, n4] = elem.nodes;
    const nodes = [output.nodeResults[n1], output.nodeResults[n2], output.nodeResults[n3], output.nodeResults[n4]];

    if (perElement) {
      const key = resultType as keyof typeof elem;
      const v = elem[key] as number;
      ctx.fillStyle = valueToColor(v);
    } else {
      // Average node values for fill color
      const avg = (values[n1] + values[n2] + values[n3] + values[n4]) / 4;
      ctx.fillStyle = valueToColor(avg);
    }

    ctx.beginPath();
    const [x1, y1] = toCanvas(nodes[0].x, nodes[0].y);
    ctx.moveTo(x1, y1);
    for (let i = 1; i < 4; i++) {
      const [xi, yi] = toCanvas(nodes[i].x, nodes[i].y);
      ctx.lineTo(xi, yi);
    }
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.15)";
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  // Draw color legend
  const legendX = W - margin + 10;
  const legendH = plotH;
  const legendW = 20;
  for (let i = 0; i < legendH; i++) {
    const t = 1 - i / legendH;
    ctx.fillStyle = valueToColor(minVal + t * range);
    ctx.fillRect(legendX, offY + i, legendW, 1);
  }
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 1;
  ctx.strokeRect(legendX, offY, legendW, legendH);

  // Legend labels
  ctx.fillStyle = "#333";
  ctx.font = "11px monospace";
  ctx.textAlign = "left";
  const fmt = (v: number) => {
    if (Math.abs(v) < 0.001) return v.toExponential(2);
    return v.toFixed(4);
  };
  ctx.fillText(fmt(maxVal), legendX + legendW + 4, offY + 10);
  ctx.fillText(fmt((maxVal + minVal) / 2), legendX + legendW + 4, offY + legendH / 2 + 4);
  ctx.fillText(fmt(minVal), legendX + legendW + 4, offY + legendH - 2);

  // Title
  ctx.fillStyle = "#222";
  ctx.font = "bold 14px sans-serif";
  ctx.textAlign = "center";
  const titles: Record<string, string> = {
    w: "Desplazamiento w (m)",
    bx: "Rotación βx (rad)",
    by: "Rotación βy (rad)",
    Mxx: "Momento Mxx (kN·m/m)",
    Myy: "Momento Myy (kN·m/m)",
    Mxy: "Momento Mxy (kN·m/m)",
    Qx: "Cortante Qx (kN/m)",
    Qy: "Cortante Qy (kN/m)",
  };
  ctx.fillText(titles[resultType] || resultType, W / 2, 20);

  // Axes labels
  ctx.fillStyle = "#555";
  ctx.font = "12px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("x (m)", W / 2, H - 5);
  ctx.save();
  ctx.translate(12, H / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText("y (m)", 0, 0);
  ctx.restore();

  // Axis ticks
  ctx.fillStyle = "#777";
  ctx.font = "10px monospace";
  const nTicks = 5;
  for (let i = 0; i <= nTicks; i++) {
    const xv = (Lx / nTicks) * i;
    const [px, py] = toCanvas(xv, 0);
    ctx.textAlign = "center";
    ctx.fillText(xv.toFixed(1), px, py + 14);
  }
  for (let i = 0; i <= nTicks; i++) {
    const yv = (Ly / nTicks) * i;
    const [px, py] = toCanvas(0, yv);
    ctx.textAlign = "right";
    ctx.fillText(yv.toFixed(1), px - 6, py + 4);
  }
}

// ── Build UI ──
function buildUI() {
  const { div, h2, h3, p, span, label, input, select, option, button, canvas, table, tr, td, th, tbody, thead, br, strong } = van.tags;

  const canvasEl = canvas({ width: 700, height: 600, style: "border:1px solid #ccc; background:#fafafa; display:block; margin:0 auto" });

  // Controls
  const makeSlider = (lbl: string, st: any, min: number, max: number, step: number) => {
    const valSpan = span({ style: "font-weight:bold; min-width:60px; display:inline-block" }, () => st.val.toFixed(step < 1 ? 2 : 0));
    return div({ style: "display:flex; align-items:center; gap:8px; margin:2px 0" },
      label({ style: "min-width:80px; text-align:right; font-size:13px" }, lbl),
      input({
        type: "range", min, max, step, value: st.val,
        style: "flex:1",
        oninput: (e: Event) => { st.val = parseFloat((e.target as HTMLInputElement).value); },
      }),
      valSpan
    );
  };

  const bcSelect = select(
    { style: "padding:4px", onchange: (e: Event) => { state.bcType.val = (e.target as HTMLSelectElement).value as any; } },
    option({ value: "simply-supported", selected: true }, "Simply Supported"),
    option({ value: "clamped" }, "Clamped"),
  );

  const resultSelect = select(
    { style: "padding:4px", onchange: (e: Event) => { state.resultType.val = (e.target as HTMLSelectElement).value; } },
    option({ value: "w" }, "w (displacement)"),
    option({ value: "bx" }, "βx (rotation)"),
    option({ value: "by" }, "βy (rotation)"),
    option({ value: "Mxx" }, "Mxx (moment)"),
    option({ value: "Myy" }, "Myy (moment)"),
    option({ value: "Mxy" }, "Mxy (torsion)"),
    option({ value: "Qx" }, "Qx (shear)"),
    option({ value: "Qy" }, "Qy (shear)"),
  );

  const infoDiv = div({ style: "font-family:monospace; font-size:12px; background:#f0f0f0; padding:10px; border-radius:4px; margin-top:8px; white-space:pre" });

  // Reactive: solve & render on any parameter change
  van.derive(() => {
    // Touch all reactive values
    const _lx = state.Lx.val;
    const _ly = state.Ly.val;
    const _nx = state.nx.val;
    const _ny = state.ny.val;
    const _t = state.thickness.val;
    const _E = state.E.val;
    const _nu = state.nu.val;
    const _p = state.pressure.val;
    const _bc = state.bcType.val;
    const _rt = state.resultType.val;

    try {
      const t0 = performance.now();
      const output = solve();
      const dt = performance.now() - t0;

      renderPlate(canvasEl as HTMLCanvasElement, output, _rt);

      // Analytical comparison
      const D = _E * _t ** 3 / (12 * (1 - _nu ** 2));
      const wAnalytical = _bc === "simply-supported"
        ? navierW(_lx, _ly, Math.abs(_p), D, _lx / 2, _ly / 2)
        : NaN;

      const wCenter = Math.abs(output.centerW ?? output.maxW);
      const errW = !isNaN(wAnalytical) ? Math.abs((wCenter - wAnalytical) / wAnalytical * 100) : NaN;

      let info = `Plate Q4 (Mindlin-Reissner SRI)  ${_nx}×${_ny} = ${_nx * _ny} elements, ${(_nx+1)*(_ny+1)} nodes\n`;
      info += `Time: ${dt.toFixed(1)} ms\n`;
      info += `──────────────────────────────────────────\n`;
      info += `w_max     = ${output.maxW.toExponential(6)}\n`;
      info += `|w_center|= ${wCenter.toExponential(6)}\n`;
      if (!isNaN(wAnalytical)) {
        info += `w_Navier  = ${wAnalytical.toExponential(6)}  (analytical)\n`;
        info += `Error     = ${errW.toFixed(2)}%\n`;
      }
      info += `──────────────────────────────────────────\n`;
      info += `Mxx_max = ${output.maxMxx.toExponential(4)}\n`;
      info += `Myy_max = ${output.maxMyy.toExponential(4)}\n`;
      info += `Mxy_max = ${output.maxMxy.toExponential(4)}\n`;
      info += `Qx_max  = ${output.maxQx.toExponential(4)}\n`;
      info += `Qy_max  = ${output.maxQy.toExponential(4)}`;
      infoDiv.textContent = info;
    } catch (err: any) {
      infoDiv.textContent = `Error: ${err.message}`;
    }
  });

  const container = div(
    { style: "max-width:900px; margin:0 auto; padding:20px; font-family:sans-serif" },
    h2("Placa Q4 — Mindlin-Reissner (WASM)"),
    p({ style: "color:#555; font-size:13px" },
      "4-node isoparametric plate element with Selective Reduced Integration (SRI). ",
      "Bending: 2×2 Gauss, Shear: 1×1 Gauss. Converges to Kirchhoff theory for thin plates."
    ),
    div({ style: "display:grid; grid-template-columns:1fr 1fr; gap:16px" },
      div(
        h3("Geometría"),
        makeSlider("Lx (m)", state.Lx, 1, 30, 1),
        makeSlider("Ly (m)", state.Ly, 1, 30, 1),
        makeSlider("nx", state.nx, 2, 64, 2),
        makeSlider("ny", state.ny, 2, 64, 2),
        h3("Material"),
        makeSlider("t (m)", state.thickness, 0.05, 2, 0.05),
        makeSlider("E (kN/m²)", state.E, 1e6, 100e6, 1e6),
        makeSlider("ν", state.nu, 0.0, 0.45, 0.05),
      ),
      div(
        h3("Cargas"),
        makeSlider("q (kN/m²)", state.pressure, -50, 0, 1),
        h3("Condiciones de Borde"),
        div({ style: "margin:4px 0" }, bcSelect),
        h3("Resultado"),
        div({ style: "margin:4px 0" }, resultSelect),
      )
    ),
    br(),
    canvasEl,
    infoDiv,
  );

  return container;
}

// Mount
document.body.append(
  buildUI(),
  getToolbar({
    sourceCode: "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/plate-q4/main.ts",
    author: "Hekatan",
  })
);

// Expose to CLI
(window as any).plateQ4 = {
  solve,
  state,
  get lastResult() { return lastOutput; },
};
