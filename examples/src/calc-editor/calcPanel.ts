/**
 * calcPanel.ts — Panel UI: editor de código izquierda + output KaTeX derecha
 *
 * Se abre como overlay fullscreen sobre el viewer 3D.
 * Templates seleccionables. Ctrl+Enter ejecuta.
 */

import { evaluate, getLibrary, deleteFromLibrary, getLibraryFunctionCode } from "./calcEngine";
import { renderCalcOutput, getCalcStyles } from "./calcRenderer";
import { getTemplate, templateList, ModelData } from "./calcTemplates";
import { exportStandalone, generateMatlabScript, generatePythonScript, generateHekatanScript, downloadFile } from "./calcExportStandalone";

let panelElement: HTMLDivElement | null = null;
let currentModelData: ModelData | null = null;
let katexLoaded = false;
let currentLang: "mathjs" | "matlab" | "python" | "hekatan" = "mathjs";
let currentTemplateId = "fem_auto";

/** Ensure KaTeX CSS + JS are loaded */
function ensureKatex(callback: () => void) {
  if (katexLoaded || (window as any).katex) {
    katexLoaded = true;
    callback();
    return;
  }
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css";
  document.head.appendChild(link);

  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js";
  script.onload = () => {
    katexLoaded = true;
    callback();
  };
  document.head.appendChild(script);
}

/** Open the calc panel — shows as bottom panel, viewer stays on top */
export function openCalcPanel(modelData: ModelData) {
  currentModelData = modelData;

  if (panelElement) {
    panelElement.style.display = "flex";
    resizeViewer3D(true);
    return;
  }

  ensureKatex(() => {
    createPanel();
    resizeViewer3D(true);
    // Load default template
    loadTemplate("fem_auto");
  });
}

/** Close the calc panel */
export function closeCalcPanel() {
  if (panelElement) {
    panelElement.style.display = "none";
    resizeViewer3D(false);
  }
}

/** Resize the 3D viewer when calc panel opens/closes */
function resizeViewer3D(calcOpen: boolean) {
  // Find the 3D viewer container (canvas parent)
  const canvas = document.querySelector("canvas");
  if (canvas && canvas.parentElement) {
    const container = canvas.parentElement;
    if (calcOpen) {
      container.style.height = "45vh";
      container.style.transition = "height 0.2s ease";
    } else {
      container.style.height = "";
      container.style.transition = "height 0.2s ease";
    }
    // Trigger Three.js resize
    window.dispatchEvent(new Event("resize"));
  }
}

/** Check if panel is open */
export function isCalcPanelOpen(): boolean {
  return panelElement !== null && panelElement.style.display !== "none";
}

// ═══════════════════════════════════════════════════════
// PANEL CREATION
// ═══════════════════════════════════════════════════════

function createPanel() {
  panelElement = document.createElement("div");
  panelElement.id = "calc-panel";

  // Inject styles
  const style = document.createElement("style");
  style.textContent = getPanelStyles() + getCalcStyles();
  document.head.appendChild(style);

  panelElement.innerHTML = `
    <div class="calc-toolbar">
      <div class="calc-toolbar-left">
        <button id="calc-run" class="calc-btn calc-btn-run" title="Ejecutar (Ctrl+Enter)">▶ Ejecutar</button>
        <select id="calc-lang" class="calc-select calc-lang-select" title="Exportar como">
          <option value="matlab">💾 MATLAB .m</option>
          <option value="python">💾 Python .py</option>
          <option value="hekatan">💾 Hekatan .hcalc</option>
        </select>
        <button id="calc-export" class="calc-btn" title="Descargar archivo">💾 Descargar</button>
        <select id="calc-template" class="calc-select">
          ${templateList.map(t => `<option value="${t.id}">${t.name}</option>`).join("")}
        </select>
      </div>
      <div class="calc-toolbar-right">
        <button id="calc-help" class="calc-btn" title="Funciones disponibles">❓ Funciones</button>
        <button id="calc-library" class="calc-btn" title="Funciones guardadas (persistentes)">📚 Librería</button>
        <button id="calc-fullscreen" class="calc-btn" title="Pantalla completa">⛶</button>
        <span class="calc-title">📐 Calculadora FEM</span>
        <button id="calc-close" class="calc-btn calc-btn-close" title="Cerrar">✕</button>
      </div>
    </div>
    <div class="calc-body">
      <div class="calc-editor-wrap">
        <div class="calc-editor-header">Editor</div>
        <div class="calc-editor-container">
          <div class="calc-line-numbers" id="calc-line-nums"></div>
          <textarea id="calc-editor" class="calc-textarea" spellcheck="false" wrap="off"></textarea>
        </div>
      </div>
      <div class="calc-divider"></div>
      <div class="calc-output-wrap">
        <div class="calc-output-header">Output</div>
        <div id="calc-output" class="calc-output-container"></div>
      </div>
    </div>
  `;

  document.body.appendChild(panelElement);

  // Event handlers
  const editor = panelElement.querySelector("#calc-editor") as HTMLTextAreaElement;
  const output = panelElement.querySelector("#calc-output") as HTMLDivElement;
  const runBtn = panelElement.querySelector("#calc-run") as HTMLButtonElement;
  const closeBtn = panelElement.querySelector("#calc-close") as HTMLButtonElement;
  const templateSelect = panelElement.querySelector("#calc-template") as HTMLSelectElement;
  const lineNums = panelElement.querySelector("#calc-line-nums") as HTMLDivElement;

  // Run
  runBtn.addEventListener("click", () => runCode(editor, output));

  // Ctrl+Enter
  editor.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "Enter") {
      e.preventDefault();
      runCode(editor, output);
    }
    // Tab → 2 spaces
    if (e.key === "Tab") {
      e.preventDefault();
      const start = editor.selectionStart;
      editor.value = editor.value.substring(0, start) + "  " + editor.value.substring(editor.selectionEnd);
      editor.selectionStart = editor.selectionEnd = start + 2;
    }
  });

  // Line numbers
  editor.addEventListener("input", () => updateLineNumbers(editor, lineNums));
  editor.addEventListener("scroll", () => {
    lineNums.scrollTop = editor.scrollTop;
  });

  // Close
  closeBtn.addEventListener("click", closeCalcPanel);

  // Help — show available functions
  const helpBtn = panelElement.querySelector("#calc-help") as HTMLButtonElement;
  helpBtn.addEventListener("click", () => showFunctionsHelp(output));

  // Library — show/manage saved functions
  const libBtn = panelElement.querySelector("#calc-library") as HTMLButtonElement;
  libBtn.addEventListener("click", () => showLibrary(output, editor));

  // Fullscreen toggle
  const fullscreenBtn = panelElement.querySelector("#calc-fullscreen") as HTMLButtonElement;
  let isFullscreen = false;
  fullscreenBtn.addEventListener("click", () => {
    isFullscreen = !isFullscreen;
    if (isFullscreen) {
      panelElement!.style.position = "fixed";
      panelElement!.style.top = "0";
      panelElement!.style.left = "0";
      panelElement!.style.width = "100vw";
      panelElement!.style.height = "100vh";
      panelElement!.style.zIndex = "10000";
      fullscreenBtn.textContent = "⛶ Salir";
      // Hide 3D viewer area
      const calcBody = panelElement!.querySelector(".calc-body") as HTMLElement;
      if (calcBody) calcBody.style.height = "calc(100vh - 40px)";
    } else {
      panelElement!.style.position = "";
      panelElement!.style.top = "";
      panelElement!.style.left = "";
      panelElement!.style.width = "";
      panelElement!.style.height = "";
      panelElement!.style.zIndex = "";
      fullscreenBtn.textContent = "⛶";
      const calcBody = panelElement!.querySelector(".calc-body") as HTMLElement;
      if (calcBody) calcBody.style.height = "";
    }
  });

  // Export format selector
  const langSelect = panelElement.querySelector("#calc-lang") as HTMLSelectElement;
  langSelect.addEventListener("change", () => {
    currentLang = langSelect.value as any;
  });

  // Download button — saves current editor content as file
  const exportBtn = panelElement.querySelector("#calc-export") as HTMLButtonElement;
  exportBtn.addEventListener("click", () => {
    if (currentLang === "matlab" && currentModelData) {
      exportStandalone(currentModelData, editor.value, "matlab");
    } else if (currentLang === "python" && currentModelData) {
      exportStandalone(currentModelData, editor.value, "python");
    } else if (currentLang === "hekatan") {
      downloadFile(editor.value, "modelo.hcalc", "text/plain");
    } else {
      downloadFile(editor.value, "calc_script.txt", "text/plain");
    }
  });

  // Template
  templateSelect.addEventListener("change", () => {
    loadTemplate(templateSelect.value);
  });
}

function loadTemplate(templateId: string) {
  if (!panelElement || !currentModelData) return;
  currentTemplateId = templateId;
  const editor = panelElement.querySelector("#calc-editor") as HTMLTextAreaElement;
  const lineNums = panelElement.querySelector("#calc-line-nums") as HTMLDivElement;
  const output = panelElement.querySelector("#calc-output") as HTMLDivElement;

  // All modes use the same evaluable math.js template (syntax ≈ MATLAB)
  // The language selector only changes what 💾 Download produces
  const code = getTemplate(templateId, currentModelData);
  editor.value = code;
  updateLineNumbers(editor, lineNums);
  runCode(editor, output);
}

function runCode(editor: HTMLTextAreaElement, output: HTMLDivElement) {
  const code = editor.value;
  const result = evaluate(code, undefined, currentModelData || undefined);
  output.innerHTML = renderCalcOutput(result);

  // Scroll output to top
  output.scrollTop = 0;
}

function updateLineNumbers(editor: HTMLTextAreaElement, lineNums: HTMLDivElement) {
  const lines = editor.value.split("\n");
  lineNums.innerHTML = lines.map((_, i) =>
    `<div class="calc-ln-num">${i + 1}</div>`
  ).join("");
}

// ═══════════════════════════════════════════════════════
// EXPORT TO MATLAB / PYTHON
// ═══════════════════════════════════════════════════════

function exportAs(code: string, target: "matlab" | "python") {
  const lines = code.split("\n");
  const converted: string[] = [];

  if (target === "python") {
    converted.push("import numpy as np");
    converted.push("from numpy.linalg import inv, det, solve, norm, eig");
    converted.push("");
  }

  for (const line of lines) {
    const trimmed = line.trim();

    // Comments: % → % (MATLAB) or # (Python)
    if (trimmed.startsWith("%")) {
      converted.push(target === "python" ? trimmed.replace(/^%/, "#") : trimmed);
      continue;
    }
    if (trimmed === "") { converted.push(""); continue; }

    let out = trimmed;

    // Strip inline comments
    const cIdx = out.indexOf("%");
    const comment = cIdx >= 0 ? out.substring(cIdx) : "";
    if (cIdx >= 0) out = out.substring(0, cIdx).trim();

    // Replace funciones propias del motor with pure math equivalents
    // stiffness(i), transform(i), kglobal(i) → comment explaining manual implementation
    if (/^(\w+)\s*=\s*(stiffness|transform|kglobal|solve_model|u_node|r_node)\(/.test(out)) {
      const commentStr = target === "python" ? "#" : "%";
      converted.push(`${commentStr} ${out}  → implementar manualmente (ver abajo)`);
      continue;
    }
    if (/^(resultado|solve_model)\b/.test(out)) {
      if (target === "matlab") {
        converted.push("U = K_global \\ F_global;  % Resolver sistema");
        converted.push("R = K_global * U - F_global;  % Reacciones");
      } else {
        converted.push("U = np.linalg.solve(K_global, F_global)  # Resolver sistema");
        converted.push("R = K_global @ U - F_global  # Reacciones");
      }
      continue;
    }

    if (target === "matlab") {
      // MATLAB syntax is almost identical to our calc panel
      // Matrices: [a, b; c, d] — same in MATLAB
      // Transpose: A' — same in MATLAB
      // Backslash: K \ F — same in MATLAB
      out = out
        .replace(/\beye\((\d+)\)/g, "eye($1)")
        .replace(/\bzeros\((\d+),\s*(\d+)\)/g, "zeros($1,$2)")
        .replace(/\bones\((\d+),\s*(\d+)\)/g, "ones($1,$2)");
      converted.push(out + (comment ? "  " + comment : "") + ";");
    } else {
      // Python/NumPy conversion
      out = out
        // Matrix definition: [1,2;3,4] → np.array([[1,2],[3,4]])
        .replace(/\[([^\]]*;[^\]]*)\]/g, (_, inner) => {
          const rows = inner.split(";").map((r: string) => `[${r.trim()}]`).join(",");
          return `np.array([${rows}])`;
        })
        // Transpose: A' → A.T
        .replace(/(\w+)'/g, "$1.T")
        // Matrix multiply: A * B → A @ B (for matrices)
        .replace(/\s*\*\s*/g, " @ ")
        // Backslash solve: K \ F → np.linalg.solve(K, F)
        .replace(/(\w+)\s*\\\s*(\w+)/g, "np.linalg.solve($1, $2)")
        // eye, zeros, ones
        .replace(/\beye\((\d+)\)/g, "np.eye($1)")
        .replace(/\bzeros\((\d+),\s*(\d+)\)/g, "np.zeros(($1,$2))")
        .replace(/\bones\((\d+),\s*(\d+)\)/g, "np.ones(($1,$2))")
        .replace(/\binv\(/g, "np.linalg.inv(")
        .replace(/\bdet\(/g, "np.linalg.det(")
        .replace(/\bnorm\(/g, "np.linalg.norm(")
        .replace(/\babs\(/g, "np.abs(")
        .replace(/\bmax\(/g, "np.max(")
        .replace(/\bmin\(/g, "np.min(")
        .replace(/\bsqrt\(/g, "np.sqrt(");

      // for loop: for i = 1:n → for i in range(1, n+1):
      if (/^for\s+(\w+)\s*=\s*(\d+):(\w+)/.test(out)) {
        out = out.replace(/^for\s+(\w+)\s*=\s*(\d+):(\w+)/, "for $1 in range($2, $3+1):");
      }
      // end → (remove, Python uses indentation)
      if (out === "end") { continue; }

      converted.push(out + (comment ? "  " + comment.replace("%", "#") : ""));
    }
  }

  // Add FEM helper functions at the bottom
  if (target === "matlab") {
    converted.push("");
    converted.push("% ═══════════════════════════════════════════");
    converted.push("% Funciones FEM (implementar según necesidad)");
    converted.push("% ═══════════════════════════════════════════");
    converted.push("% function K = beam_stiffness_3d(E, A, Iz, Iy, G, J, L)");
    converted.push("%   % Timoshenko beam 12x12 stiffness matrix");
    converted.push("%   % Ver: Dr. Aguiar, Análisis Matricial de Estructuras");
    converted.push("% end");
  } else {
    converted.push("");
    converted.push("# ═══════════════════════════════════════════");
    converted.push("# Funciones FEM (implementar según necesidad)");
    converted.push("# ═══════════════════════════════════════════");
    converted.push("# def beam_stiffness_3d(E, A, Iz, Iy, G, J, L):");
    converted.push("#     # Timoshenko beam 12x12 stiffness matrix");
    converted.push("#     pass");
  }

  const ext = target === "matlab" ? "m" : "py";
  const filename = `fem_model.${ext}`;
  const blob = new Blob([converted.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ═══════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════

function getPanelStyles(): string {
  return `
    #calc-panel {
      position: fixed;
      bottom: 0; left: 0;
      width: 100vw; height: 55vh;
      background: #0d1117;
      z-index: 100000;
      display: flex;
      flex-direction: column;
      color: #d4d4d4;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      border-top: 2px solid #58a6ff;
      box-shadow: 0 -4px 20px rgba(0,0,0,0.5);
    }

    .calc-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 12px;
      background: #161b22;
      border-bottom: 1px solid #30363d;
      min-height: 40px;
    }
    .calc-toolbar-left, .calc-toolbar-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .calc-title {
      font-size: 14px;
      font-weight: 600;
      color: #58a6ff;
    }

    .calc-btn {
      padding: 5px 12px;
      border: 1px solid #30363d;
      border-radius: 4px;
      background: #21262d;
      color: #d4d4d4;
      cursor: pointer;
      font-size: 13px;
    }
    .calc-btn:hover { background: #30363d; }
    .calc-btn-run {
      background: #238636;
      border-color: #2ea043;
      color: white;
      font-weight: 600;
    }
    .calc-btn-run:hover { background: #2ea043; }
    .calc-btn-close {
      background: transparent;
      border: none;
      color: #8b949e;
      font-size: 18px;
      padding: 2px 8px;
    }
    .calc-btn-close:hover { color: #ff6b6b; }

    .calc-select {
      padding: 5px 8px;
      border: 1px solid #30363d;
      border-radius: 4px;
      background: #21262d;
      color: #d4d4d4;
      font-size: 12px;
    }
    .calc-lang-select {
      background: #1a3a5c;
      border-color: #58a6ff;
      font-weight: 600;
    }

    .calc-body {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    .calc-editor-wrap, .calc-output-wrap {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .calc-editor-header, .calc-output-header {
      padding: 4px 12px;
      background: #161b22;
      border-bottom: 1px solid #30363d;
      font-size: 11px;
      color: #8b949e;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .calc-divider {
      width: 3px;
      background: #30363d;
      cursor: col-resize;
    }
    .calc-divider:hover { background: #58a6ff; }

    .calc-editor-container {
      flex: 1;
      display: flex;
      overflow: hidden;
    }

    .calc-line-numbers {
      padding: 8px 0;
      background: #0d1117;
      border-right: 1px solid #21262d;
      overflow: hidden;
      min-width: 36px;
    }
    .calc-ln-num {
      text-align: right;
      padding: 0 8px 0 4px;
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      font-size: 13px;
      line-height: 20px;
      color: #484f58;
      user-select: none;
    }

    .calc-textarea {
      flex: 1;
      padding: 8px;
      background: #0d1117;
      color: #e6edf3;
      border: none;
      resize: none;
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      font-size: 13px;
      line-height: 20px;
      tab-size: 2;
      outline: none;
      overflow: auto;
    }
    .calc-textarea::selection {
      background: #264f78;
    }

    .calc-output-container {
      flex: 1;
      padding: 8px;
      overflow-y: auto;
      background: #0d1117;
    }

    /* Responsive: en móvil todo stacked */
    @media (max-width: 900px) {
      #calc-panel {
        height: 60vh;
      }
      .calc-body {
        flex-direction: column;
      }
      .calc-editor-wrap {
        flex: none;
        height: 40%;
      }
      .calc-output-wrap {
        flex: 1;
      }
      .calc-divider {
        width: 100%;
        height: 3px;
        cursor: row-resize;
      }
      .calc-toolbar {
        flex-wrap: wrap;
        gap: 3px;
        padding: 4px 6px;
        min-height: 32px;
      }
      .calc-toolbar-left, .calc-toolbar-right {
        flex-wrap: wrap;
        gap: 3px;
      }
      .calc-title { font-size: 11px; }
      .calc-btn { padding: 3px 6px; font-size: 11px; }
      .calc-select { font-size: 11px; padding: 3px 4px; max-width: 140px; }
      .calc-lang-select { max-width: 110px; }
    }
    @media (max-width: 480px) {
      #calc-panel {
        height: 75vh;
        bottom: 0;
        border-radius: 8px 8px 0 0;
      }
      .calc-body {
        flex-direction: column;
      }
      .calc-editor-wrap {
        flex: none;
        height: 35%;
      }
      .calc-output-wrap {
        flex: 1;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
      }
      .calc-toolbar {
        flex-wrap: wrap;
        gap: 2px;
        padding: 3px 4px;
        min-height: 28px;
      }
      .calc-toolbar-left, .calc-toolbar-right {
        flex-wrap: wrap;
        gap: 2px;
      }
      .calc-title { font-size: 10px; max-width: 80px; overflow: hidden; text-overflow: ellipsis; }
      .calc-btn { padding: 2px 5px; font-size: 10px; }
      .calc-select { font-size: 10px; padding: 2px 3px; max-width: 100px; }
      .calc-lang-select { max-width: 80px; }
      .calc-editor textarea { font-size: 11px !important; }
      .calc-output { font-size: 11px; }
      .calc-output .katex { font-size: 0.85em; }
    }
  `;
}

// ═══════════════════════════════════════════════════════
// HELP — LIST ALL AVAILABLE FUNCTIONS
// ═══════════════════════════════════════════════════════

function showLibrary(output: HTMLDivElement, editor: HTMLTextAreaElement) {
  const lib = getLibrary();
  const names = Object.keys(lib);

  if (names.length === 0) {
    output.innerHTML = `
    <div style="padding: 16px; color: #ccc; font-family: 'JetBrains Mono', monospace;">
      <h2 style="color: #61afef; margin: 0 0 12px;">📚 Librería de funciones</h2>
      <p style="color: #888;">No hay funciones guardadas todavía.</p>
      <p style="color: #aaa;">Define una función en el editor:</p>
      <pre style="color: #98c379; background: #1e1e2e; padding: 12px; border-radius: 6px;">function K = rigidez_axial(E, A, L)
  K = (E * A / L) * [1, -1; -1, 1]
end</pre>
      <p style="color: #aaa;">Al ejecutar, se guarda automáticamente en la librería.<br>
      Después puedes llamarla desde cualquier script:</p>
      <pre style="color: #98c379; background: #1e1e2e; padding: 12px; border-radius: 6px;">K1 = rigidez_axial(210000, 0.01, 2)</pre>
    </div>`;
    return;
  }

  let html = `
  <div style="padding: 16px; color: #ccc; font-family: 'JetBrains Mono', monospace; font-size: 13px;">
    <h2 style="color: #61afef; margin: 0 0 12px;">📚 Librería de funciones (${names.length})</h2>
    <p style="color: #888; font-size: 11px; margin-bottom: 12px;">
      Estas funciones están guardadas y disponibles en cualquier script.
    </p>`;

  for (const name of names) {
    const fn = lib[name];
    const sig = fn.outVar
      ? `${fn.outVar} = ${fn.name}(${fn.args.join(", ")})`
      : `${fn.name}(${fn.args.join(", ")})`;
    const code = getLibraryFunctionCode(name);

    html += `
    <div style="background: #1e1e2e; border: 1px solid #333; border-radius: 6px; padding: 10px; margin-bottom: 10px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
        <span style="color: #e5c07b; font-weight: bold;">function ${sig}</span>
        <div>
          <button class="lib-insert-btn" data-fn="${name}" style="background: #2d5a27; color: #98c379; border: none; padding: 3px 8px; border-radius: 3px; cursor: pointer; margin-right: 4px; font-size: 11px;">📋 Insertar</button>
          <button class="lib-delete-btn" data-fn="${name}" style="background: #5a2727; color: #ff6b6b; border: none; padding: 3px 8px; border-radius: 3px; cursor: pointer; font-size: 11px;">🗑 Eliminar</button>
        </div>
      </div>
      <pre style="color: #9cdcfe; margin: 0; font-size: 12px; white-space: pre-wrap;">${code}</pre>
    </div>`;
  }

  html += `</div>`;
  output.innerHTML = html;

  // Event delegation for insert/delete buttons
  output.querySelectorAll(".lib-insert-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const fnName = (btn as HTMLElement).dataset.fn!;
      const code = getLibraryFunctionCode(fnName);
      editor.value = code + "\n\n" + editor.value;
    });
  });

  output.querySelectorAll(".lib-delete-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const fnName = (btn as HTMLElement).dataset.fn!;
      deleteFromLibrary(fnName);
      showLibrary(output, editor); // refresh
    });
  });
}

function showFunctionsHelp(output: HTMLDivElement) {
  output.innerHTML = `
  <div style="padding: 16px; color: #ccc; font-family: 'JetBrains Mono', monospace; font-size: 13px; line-height: 1.8;">
    <h2 style="color: #61afef; margin: 0 0 12px;">📐 Funciones disponibles</h2>

    <h3 style="color: #e5c07b; margin: 12px 0 6px;">🔢 Álgebra Lineal</h3>
    <table style="border-collapse: collapse; width: 100%;">
    <tr><td style="color:#98c379;padding:2px 12px 2px 0">det(A)</td><td>Determinante</td></tr>
    <tr><td style="color:#98c379">inv(A)</td><td>Inversa</td></tr>
    <tr><td style="color:#98c379">transpose(A) / A'</td><td>Transpuesta</td></tr>
    <tr><td style="color:#98c379">trace(A)</td><td>Traza (suma diagonal)</td></tr>
    <tr><td style="color:#98c379">rank(A)</td><td>Rango de matriz</td></tr>
    <tr><td style="color:#98c379">cond(A)</td><td>Número de condición</td></tr>
    <tr><td style="color:#98c379">norm(A)</td><td>Norma (vector o matriz)</td></tr>
    <tr><td style="color:#98c379">rref(A)</td><td>Forma escalonada reducida</td></tr>
    <tr><td style="color:#98c379">lup(A)</td><td>Descomposición LU con pivoteo</td></tr>
    <tr><td style="color:#98c379">qr(A)</td><td>Descomposición QR</td></tr>
    <tr><td style="color:#98c379">eigs(A)</td><td>Eigenvalores y eigenvectores</td></tr>
    <tr><td style="color:#98c379">lusolve(A, b)</td><td>Resolver Ax=b via LU</td></tr>
    <tr><td style="color:#98c379">A \\ b</td><td>Resolver Ax=b (backslash)</td></tr>
    </table>

    <h3 style="color: #e5c07b; margin: 12px 0 6px;">📐 Construcción de Matrices</h3>
    <table style="border-collapse: collapse; width: 100%;">
    <tr><td style="color:#98c379;padding:2px 12px 2px 0">eye(n)</td><td>Matriz identidad n×n</td></tr>
    <tr><td style="color:#98c379">zeros(n,m)</td><td>Matriz de ceros</td></tr>
    <tr><td style="color:#98c379">ones(n,m)</td><td>Matriz de unos</td></tr>
    <tr><td style="color:#98c379">diag(v)</td><td>Matriz diagonal desde vector</td></tr>
    <tr><td style="color:#98c379">triu(A)</td><td>Triangular superior</td></tr>
    <tr><td style="color:#98c379">tril(A)</td><td>Triangular inferior</td></tr>
    <tr><td style="color:#98c379">kron(A,B)</td><td>Producto de Kronecker</td></tr>
    <tr><td style="color:#98c379">linspace(a,b,n)</td><td>Vector de n puntos entre a y b</td></tr>
    <tr><td style="color:#98c379">size(A)</td><td>Dimensiones [filas, columnas]</td></tr>
    <tr><td style="color:#98c379">length(v)</td><td>Longitud máxima</td></tr>
    </table>

    <h3 style="color: #e5c07b; margin: 12px 0 6px;">➕ Operaciones</h3>
    <table style="border-collapse: collapse; width: 100%;">
    <tr><td style="color:#98c379;padding:2px 12px 2px 0">A + B, A - B</td><td>Suma/resta</td></tr>
    <tr><td style="color:#98c379">A * B</td><td>Multiplicación de matrices</td></tr>
    <tr><td style="color:#98c379">A .* B</td><td>Multiplicación elemento a elemento</td></tr>
    <tr><td style="color:#98c379">A ^ n</td><td>Potencia de matriz</td></tr>
    <tr><td style="color:#98c379">cross(a,b)</td><td>Producto cruz</td></tr>
    <tr><td style="color:#98c379">dot(a,b)</td><td>Producto punto</td></tr>
    </table>

    <h3 style="color: #e5c07b; margin: 12px 0 6px;">📊 Estadística</h3>
    <table style="border-collapse: collapse; width: 100%;">
    <tr><td style="color:#98c379;padding:2px 12px 2px 0">max(v), min(v)</td><td>Máximo/mínimo</td></tr>
    <tr><td style="color:#98c379">sum(v), prod(v)</td><td>Suma/producto</td></tr>
    <tr><td style="color:#98c379">mean(v), median(v)</td><td>Media/mediana</td></tr>
    <tr><td style="color:#98c379">std(v), variance(v)</td><td>Desviación/varianza</td></tr>
    <tr><td style="color:#98c379">sort(v)</td><td>Ordenar</td></tr>
    </table>

    <h3 style="color: #e5c07b; margin: 12px 0 6px;">📈 Matemáticas</h3>
    <table style="border-collapse: collapse; width: 100%;">
    <tr><td style="color:#98c379;padding:2px 12px 2px 0">sin, cos, tan</td><td>Trigonométricas</td></tr>
    <tr><td style="color:#98c379">asin, acos, atan, atan2</td><td>Inversas</td></tr>
    <tr><td style="color:#98c379">exp, log, log10</td><td>Exponencial/logaritmo</td></tr>
    <tr><td style="color:#98c379">sqrt, abs, ceil, floor</td><td>Raíz, absoluto, redondeo</td></tr>
    <tr><td style="color:#98c379">pi, e, i</td><td>Constantes</td></tr>
    <tr><td style="color:#98c379">polyval(p,x)</td><td>Evaluar polinomio</td></tr>
    </table>

    <h3 style="color: #e5c07b; margin: 12px 0 6px;">🏗️ FEM</h3>
    <table style="border-collapse: collapse; width: 100%;">
    <tr><td style="color:#98c379;padding:2px 12px 2px 0">stiffness(i)</td><td>K local del elemento i (12×12)</td></tr>
    <tr><td style="color:#98c379">transform(i)</td><td>Matriz T de transformación (12×12)</td></tr>
    <tr><td style="color:#98c379">kglobal(i)</td><td>K global = T'·K·T (12×12)</td></tr>
    <tr><td style="color:#98c379">elem_length(i)</td><td>Longitud del elemento i</td></tr>
    <tr><td style="color:#98c379">assemble_dofs(i)</td><td>DOFs globales del elemento i</td></tr>
    <tr><td style="color:#98c379">solve_model()</td><td>Resolver modelo completo (WASM C++/Eigen)</td></tr>
    <tr><td style="color:#98c379">unode(n)</td><td>Desplazamientos del nodo n [ux,uy,uz,rx,ry,rz]</td></tr>
    <tr><td style="color:#98c379">rnode(n)</td><td>Reacciones del nodo n [Fx,Fy,Fz,Mx,My,Mz]</td></tr>
    </table>

    <h3 style="color: #e5c07b; margin: 12px 0 6px;">🔁 Control de flujo</h3>
    <table style="border-collapse: collapse; width: 100%;">
    <tr><td style="color:#98c379;padding:2px 12px 2px 0">for i = 1:n ... end</td><td>Ciclo for</td></tr>
    <tr><td style="color:#98c379">if cond ... else ... end</td><td>Condicional</td></tr>
    <tr><td style="color:#98c379">% comentario</td><td>Comentario (usa \$...\$ para KaTeX)</td></tr>
    </table>

    <h3 style="color: #e5c07b; margin: 12px 0 6px;">📖 Referencia</h3>
    <p style="color:#888; font-size:11px;">Basado en math.js + WASM C++/Eigen. Compatible con sintaxis MATLAB.<br>
    Ref: Ferreira "MATLAB Codes for FEA" (Springer 2009)</p>
  </div>`;
}
