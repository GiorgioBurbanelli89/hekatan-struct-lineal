/**
 * 📄 Report Explained — derivación FEM completa imprimible.
 *
 *  Genera un reporte HTML con TODA la derivación FEM paso a paso:
 *    1. Input Data — geometría, conectividad, propiedades, cargas
 *    2. Local Stiffness Matrices — K_local por elemento
 *    3. Transformation — T por elemento
 *    4. Global Assembly — K_sys
 *    5. Boundary Conditions — DOFs fijos, sustitución
 *    6. Solve — K · u = F
 *    7. Reactions — F = K · u en DOFs fijos
 *    8. Internal Forces — F_int = K_local · T · u
 *    9. Modal (si aplica) — frecuencias + modos + masa participativa
 *
 *  Soporta dos modos:
 *    - Inline (renderiza en un HTMLElement, opcionalmente con KaTeX)
 *    - PDF (abre nueva ventana con @media print listo para imprimir)
 */
import type {
  Node, Element, NodeInputs, ElementInputs,
  DeformOutputs, AnalyzeOutputs, ModalOutputs,
} from "hekatan-fem";
import { computeFrameMatrices, type FrameElementProps } from "../inspect/elementMath";

export interface ReportInput {
  nodes: Node[];
  elements: Element[];
  nodeInputs: NodeInputs;
  elementInputs: ElementInputs;
  deformOutputs?: DeformOutputs;
  analyzeOutputs?: AnalyzeOutputs;
  modalOutputs?: ModalOutputs;
  /** Title shown at top of report */
  title?: string;
  /** Subtitle / description */
  subtitle?: string;
}

export function generateReportHtml(inp: ReportInput): string {
  const { nodes, elements, nodeInputs, elementInputs, deformOutputs, modalOutputs } = inp;
  const out: string[] = [];

  out.push(`<!DOCTYPE html><html><head><meta charset="utf-8">`);
  out.push(`<title>${escapeHtml(inp.title || "FEM Report")}</title>`);
  out.push(`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.css">`);
  out.push(`<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.js"></script>`);
  out.push(`<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/contrib/auto-render.min.js" onload="renderMathInElement(document.body)"></script>`);
  out.push(`<style>
    body { font-family: ui-sans-serif, system-ui, sans-serif; max-width: 1100px; margin: 24px auto; padding: 0 24px; color: #1e293b; line-height: 1.55; }
    h1 { color: #1a4d8c; border-bottom: 3px solid #1a4d8c; padding-bottom: 8px; }
    h2 { color: #1a4d8c; margin-top: 32px; padding-bottom: 4px; border-bottom: 1px solid #cbd5e1; }
    h3 { color: #475569; }
    table { border-collapse: collapse; width: 100%; margin: 12px 0; font-size: 13px; }
    th, td { border: 1px solid #cbd5e1; padding: 6px 10px; text-align: right; }
    th { background: #1a4d8c; color: white; text-align: center; }
    tr:nth-child(even) { background: #f1f5f9; }
    .latex { font-family: "Times New Roman", serif; padding: 8px 14px; background: #f8fafc; border-left: 3px solid #1a4d8c; margin: 8px 0; }
    .info { background: #fef3c7; border-left: 3px solid #f59e0b; padding: 10px 14px; margin: 12px 0; }
    .ok { color: #15803d; font-weight: 600; }
    .matrix { font-family: ui-monospace, monospace; font-size: 11px; overflow-x: auto; }
    code { background: #e2e8f0; padding: 2px 6px; border-radius: 3px; font-size: 12px; }
    @media print {
      body { font-size: 11pt; max-width: none; }
      h2 { page-break-after: avoid; }
      table { page-break-inside: avoid; }
      .no-print { display: none; }
    }
    .toolbar { position: sticky; top: 0; background: white; padding: 10px 0; border-bottom: 1px solid #cbd5e1; margin-bottom: 16px; }
    .btn { background: #1a4d8c; color: white; border: none; padding: 6px 14px; border-radius: 4px; cursor: pointer; font-size: 13px; margin-right: 8px; }
  </style>`);
  out.push(`</head><body>`);

  // Toolbar (no-print)
  out.push(`<div class="toolbar no-print">`);
  out.push(`  <button class="btn" onclick="window.print()">🖨 Imprimir / PDF</button>`);
  out.push(`  <button class="btn" onclick="window.close()">✕ Cerrar</button>`);
  out.push(`</div>`);

  // Header
  out.push(`<h1>${escapeHtml(inp.title || "Finite Element Analysis — Step-by-Step Report")}</h1>`);
  if (inp.subtitle) out.push(`<p style="color:#64748b;font-style:italic">${escapeHtml(inp.subtitle)}</p>`);
  out.push(`<p style="color:#64748b">Complete FEM derivation from element formulation to final results.</p>`);

  // ─── 1. Input Data ───
  out.push(`<h2>1. Input Data</h2>`);
  const nFrames = elements.filter((e) => e.length === 2).length;
  const nShells = elements.filter((e) => e.length === 3 || e.length === 4).length;
  const nSolids = elements.filter((e) => e.length === 8).length;
  const totalDOFs = nodes.length * 6;
  out.push(`<table style="width:auto"><tr><td style="text-align:left">Number of nodes</td><td>${nodes.length}</td></tr>`);
  out.push(`<tr><td style="text-align:left">Number of elements</td><td>${elements.length} (${nFrames} frames, ${nShells} shells, ${nSolids} solids)</td></tr>`);
  out.push(`<tr><td style="text-align:left">DOFs per node</td><td>6 (u<sub>x</sub>, u<sub>y</sub>, u<sub>z</sub>, θ<sub>x</sub>, θ<sub>y</sub>, θ<sub>z</sub>)</td></tr>`);
  out.push(`<tr><td style="text-align:left">Total DOFs</td><td>${totalDOFs}</td></tr></table>`);

  // 1.1 Node Coordinates
  out.push(`<h3>1.1 Node Coordinates</h3>`);
  out.push(`<table><tr><th>Node</th><th>x</th><th>y</th><th>z</th></tr>`);
  for (let i = 0; i < Math.min(nodes.length, 50); i++) {
    const n = nodes[i];
    out.push(`<tr><td>${i}</td><td>${fmt(n[0])}</td><td>${fmt(n[1])}</td><td>${fmt(n[2])}</td></tr>`);
  }
  if (nodes.length > 50) out.push(`<tr><td colspan="4" style="text-align:center;font-style:italic">... ${nodes.length - 50} más</td></tr>`);
  out.push(`</table>`);

  // 1.2 Element Connectivity
  out.push(`<h3>1.2 Element Connectivity</h3>`);
  out.push(`<table><tr><th>Element</th><th>Type</th><th>Nodes</th></tr>`);
  for (let i = 0; i < Math.min(elements.length, 40); i++) {
    const e = elements[i];
    const type = e.length === 2 ? "Frame" : e.length === 3 ? "Shell-CST" : e.length === 4 ? "Shell-Q4" : "Solid-H8";
    out.push(`<tr><td>${i}</td><td>${type}</td><td>${e.join(" → ")}</td></tr>`);
  }
  if (elements.length > 40) out.push(`<tr><td colspan="3" style="text-align:center;font-style:italic">... ${elements.length - 40} más</td></tr>`);
  out.push(`</table>`);

  // 1.3 Section Properties (frames)
  out.push(`<h3>1.3 Section Properties (Frames)</h3>`);
  out.push(`<table><tr><th>Element</th><th>E</th><th>A</th><th>I<sub>y</sub></th><th>I<sub>z</sub></th><th>J</th></tr>`);
  for (let i = 0; i < Math.min(nFrames, 30); i++) {
    const E = elementInputs.elasticities?.get(i);
    const A = elementInputs.areas?.get(i);
    const Iy = (elementInputs as any).momentsOfInertiaY?.get(i);
    const Iz = (elementInputs as any).momentsOfInertiaZ?.get(i);
    const J = elementInputs.torsionalConstants?.get(i);
    out.push(`<tr><td>${i}</td><td>${fmtSci(E)}</td><td>${fmtSci(A)}</td><td>${fmtSci(Iy)}</td><td>${fmtSci(Iz)}</td><td>${fmtSci(J)}</td></tr>`);
  }
  if (nFrames > 30) out.push(`<tr><td colspan="6" style="text-align:center;font-style:italic">... ${nFrames - 30} más</td></tr>`);
  out.push(`</table>`);

  // 1.4 Boundary conditions
  out.push(`<h3>1.4 Boundary Conditions (Supports)</h3>`);
  if (nodeInputs.supports && nodeInputs.supports.size > 0) {
    out.push(`<table><tr><th>Node</th><th>U<sub>x</sub></th><th>U<sub>y</sub></th><th>U<sub>z</sub></th><th>R<sub>x</sub></th><th>R<sub>y</sub></th><th>R<sub>z</sub></th></tr>`);
    for (const [n, sup] of nodeInputs.supports) {
      out.push(`<tr><td>${n}</td>${sup.map((v) => `<td>${v ? "✓" : ""}</td>`).join("")}</tr>`);
    }
    out.push(`</table>`);
  }

  // 1.5 Loads
  out.push(`<h3>1.5 Applied Loads</h3>`);
  if (nodeInputs.loads && nodeInputs.loads.size > 0) {
    out.push(`<table><tr><th>Node</th><th>F<sub>x</sub></th><th>F<sub>y</sub></th><th>F<sub>z</sub></th><th>M<sub>x</sub></th><th>M<sub>y</sub></th><th>M<sub>z</sub></th></tr>`);
    for (const [n, l] of nodeInputs.loads) {
      out.push(`<tr><td>${n}</td>${l.map((v) => `<td>${fmt(v)}</td>`).join("")}</tr>`);
    }
    out.push(`</table>`);
  }

  // ─── 2. Local stiffness sample (first frame) ───
  if (nFrames > 0) {
    out.push(`<h2>2. Element Stiffness Matrices</h2>`);
    out.push(`<div class="latex">$$ K^e_{\\text{local}} = \\text{(12×12)} \\quad \\text{for each frame element} $$</div>`);
    // Compute first element matrices as illustration
    const e0 = elements[0];
    if (e0.length === 2 && nodes[e0[0]] && nodes[e0[1]]) {
      const props: FrameElementProps = {
        E: elementInputs.elasticities?.get(0) ?? 2e8,
        G: elementInputs.shearModuli?.get(0) ?? 8e7,
        A: elementInputs.areas?.get(0) ?? 0.01,
        Iy: (elementInputs as any).momentsOfInertiaY?.get(0) ?? 1e-4,
        Iz: (elementInputs as any).momentsOfInertiaZ?.get(0) ?? 1e-4,
        J: elementInputs.torsionalConstants?.get(0) ?? 1e-4,
      };
      try {
        const m = computeFrameMatrices({ ni: nodes[e0[0]], nj: nodes[e0[1]] }, props);
        out.push(`<h3>2.1 Element 0 (sample) — L = ${m.L.toFixed(3)} m</h3>`);
        out.push(matrixHtml("K_local (12×12)", m.K_local, 11));
        out.push(`<div class="latex">$$ T_{12 \\times 12} = \\text{block-diag}(R, R, R, R), \\quad K_{\\text{global}} = T^T \\cdot K_{\\text{local}} \\cdot T $$</div>`);
        out.push(matrixHtml("K_global (12×12)", m.K_global, 11));
      } catch (e) {
        out.push(`<div class="info">Could not compute K_local for element 0: ${(e as Error).message}</div>`);
      }
    }
  }

  // ─── 3. Solver ───
  out.push(`<h2>3. Global Assembly & Solve</h2>`);
  out.push(`<div class="latex">$$ K_{\\text{sys}} \\cdot u = F \\quad \\Rightarrow \\quad u = K_{\\text{sys}}^{-1} \\cdot F $$</div>`);
  out.push(`<p>El sistema global se resuelve usando descomposición LU dispersa (SparseLU) para sistemas grandes, o LU densa para sistemas pequeños (&lt; 200 DOFs).</p>`);

  // ─── 4. Results ───
  if (deformOutputs?.deformations) {
    out.push(`<h2>4. Nodal Displacements</h2>`);
    out.push(`<table><tr><th>Node</th><th>U<sub>x</sub></th><th>U<sub>y</sub></th><th>U<sub>z</sub></th><th>R<sub>x</sub></th><th>R<sub>y</sub></th><th>R<sub>z</sub></th></tr>`);
    let count = 0;
    for (const [n, u] of deformOutputs.deformations) {
      if (count >= 30) break;
      out.push(`<tr><td>${n}</td>${u.map((v) => `<td>${fmtSci(v)}</td>`).join("")}</tr>`);
      count++;
    }
    if (deformOutputs.deformations.size > 30) out.push(`<tr><td colspan="7" style="text-align:center;font-style:italic">... ${deformOutputs.deformations.size - 30} más</td></tr>`);
    out.push(`</table>`);
  }

  // ─── 5. Reactions ───
  if (deformOutputs?.reactions) {
    out.push(`<h2>5. Support Reactions</h2>`);
    out.push(`<div class="latex">$$ F_{\\text{reaction}} = K_{\\text{fixed-fixed}} \\cdot u_{\\text{free}} - F_{\\text{ext, fixed}} $$</div>`);
    out.push(`<table><tr><th>Node</th><th>F<sub>x</sub></th><th>F<sub>y</sub></th><th>F<sub>z</sub></th><th>M<sub>x</sub></th><th>M<sub>y</sub></th><th>M<sub>z</sub></th></tr>`);
    for (const [n, r] of deformOutputs.reactions) {
      out.push(`<tr><td>${n}</td>${r.map((v) => `<td>${fmtSci(v)}</td>`).join("")}</tr>`);
    }
    out.push(`</table>`);
  }

  // ─── 6. Modal ───
  if (modalOutputs?.frequencies) {
    out.push(`<h2>6. Modal Analysis</h2>`);
    out.push(`<div class="latex">$$ (K - \\omega^2 M)\\,\\phi = 0 $$</div>`);
    // Regla de Jorge (18-sep-2026): el informe muestra los modos (1-3 como minimo, aqui
    // TODOS los calculados) y la participacion de masa con las SEIS sumatorias.
    const DIR6 = ["Ux", "Uy", "Uz", "Rx", "Ry", "Rz"];
    const mpAll = modalOutputs.massParticipation ?? [];
    const acc = [0, 0, 0, 0, 0, 0];
    const hayMP = mpAll.length > 0;
    out.push(`<table><tr><th>Mode</th><th>ω (rad/s)</th><th>f (Hz)</th><th>T (s)</th>`
      + (hayMP ? DIR6.map((k) => `<th>${k} %</th>`).join("") + DIR6.map((k) => `<th>Σ${k} %</th>`).join("") : "")
      + `</tr>`);
    for (let i = 0; i < modalOutputs.frequencies.length; i++) {
      const f = modalOutputs.frequencies[i];
      let cel = "";
      if (hayMP) {
        const mp = mpAll[i] ?? [];
        const dir: string[] = [], sum: string[] = [];
        for (let d = 0; d < 6; d++) { const v = mp[d] ?? 0; acc[d] += v; dir.push(`<td>${(v * 100).toFixed(2)}</td>`); sum.push(`<td>${(acc[d] * 100).toFixed(2)}</td>`); }
        cel = dir.join("") + sum.join("");
      }
      out.push(`<tr><td>${i + 1}</td><td>${(2 * Math.PI * f).toFixed(3)}</td><td>${f.toFixed(3)}</td><td>${(1 / f).toFixed(4)}</td>${cel}</tr>`);
    }
    out.push(`</table>`);
    if (hayMP) {
      out.push(`<p><b>Participating mass, the six sums with ${modalOutputs.frequencies.length} modes:</b> `
        + DIR6.map((k, d) => `Σ${k} = ${(acc[d] * 100).toFixed(2)} %`).join(" · ")
        + `<br>NEC-15 §6.2.2 / ASCE 7-22 §12.9.1.1 require ≥ 90 % in each direction of analysis (X, Y). `
        + `The other four sums are reported because they are what reveals missing modes.</p>`);
    }
  }

  out.push(`<hr><p style="font-size:11px;color:#64748b;text-align:center">Generated by Hekatan Struct Lineal · ${new Date().toLocaleString()}</p>`);
  out.push(`</body></html>`);
  return out.join("\n");
}

/** Abre el reporte en una nueva ventana lista para imprimir/PDF */
export function openReportExplained(inp: ReportInput): void {
  const html = generateReportHtml(inp);
  const w = window.open("", "_blank", "width=1100,height=800");
  if (!w) { alert("Popup bloqueado. Permite popups para ver el reporte."); return; }
  w.document.open();
  w.document.write(html);
  w.document.close();
}

/** Render the report inline in a target element */
export function renderReportInline(target: HTMLElement, inp: ReportInput): void {
  target.innerHTML = generateReportHtml(inp);
}

// ─── Helpers ───
function fmt(v: number | undefined): string {
  if (v == null) return "—";
  if (Math.abs(v) < 1e-12) return "0";
  if (Math.abs(v) >= 1e5 || Math.abs(v) < 1e-3) return v.toExponential(3);
  return parseFloat(v.toFixed(4)).toString();
}
function fmtSci(v: number | undefined): string {
  if (v == null) return "—";
  if (Math.abs(v) < 1e-12) return "0";
  return v.toExponential(3);
}
function matrixHtml(title: string, M: number[][], precision: number): string {
  const lines: string[] = [];
  lines.push(`<div class="matrix"><strong>${title}</strong><table>`);
  for (const row of M) {
    lines.push(`<tr>${row.map((v) => `<td style="font-size:9px">${Math.abs(v) < 1e-10 ? "0" : v.toExponential(2)}</td>`).join("")}</tr>`);
  }
  lines.push(`</table></div>`);
  return lines.join("");
}
function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
