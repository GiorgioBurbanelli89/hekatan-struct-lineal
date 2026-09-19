/**
 * 📈 Modal Panel — visor profesional de análisis modal estilo ETABS.
 *
 *  Muestra:
 *    • Tabla de modos: ω(rad/s), f(Hz), T(s), MPF Ux/Uy/Uz/Rx/Ry/Rz, ΣMPF
 *    • Verificación ASCE 7-22 §12.9.1: 90% participación acumulada
 *    • Slider para navegar modos + play/pause animation
 *    • Highlights: filas con %MPF dominante por dirección
 *
 *  API minimal:
 *    panel = createModalPanel({ onModeChange })
 *    panel.update(out, meta)
 *    panel.show() / hide() / toggle()
 *    panel.activeMode → State<number>  (van.state, suscribible para animar la deformada)
 */
import van, { type State } from "vanjs-core";
import type { ModalOutputs } from "hekatan-fem";

export interface ModalPanelMeta {
  title?: string;
  /** Properties description (E, ρ, sections, etc.) */
  properties?: string[];
}

export interface ModalPanelOptions {
  /** Anchor: TOP-RIGHT por default */
  position?: { top?: number; right?: number; left?: number; bottom?: number };
  /** Si true, se muestra al crear */
  initiallyVisible?: boolean;
  /** Callback cuando cambia el modo activo (slider) */
  onModeChange?: (modeIdx: number) => void;
}

export interface ModalPanelApi {
  el: HTMLDivElement;
  /** Index del modo activo (1-based en UI, 0-based aquí). State observable. */
  activeMode: State<number>;
  /** Update con nuevos resultados */
  update(out: ModalOutputs, meta?: ModalPanelMeta): void;
  /** Compatibilidad legacy con `modalPanel.render()` */
  render(out: ModalOutputs, meta?: ModalPanelMeta): void;
  show(): void;
  hide(): void;
  toggle(): void;
  /** Animation control */
  play(): void;
  pause(): void;
  destroy(): void;
}

export function createModalPanel(opts: ModalPanelOptions = {}): ModalPanelApi {
  const el = document.createElement("div");
  el.className = "hekatan-modal-panel";
  Object.assign(el.style, {
    position: "fixed",
    top: opts.position?.top != null ? `${opts.position.top}px` : "70px",
    right: opts.position?.right != null ? `${opts.position.right}px` : "12px",
    left: opts.position?.left != null ? `${opts.position.left}px` : "auto",
    bottom: opts.position?.bottom != null ? `${opts.position.bottom}px` : "auto",
    width: "640px",
    maxHeight: "560px",
    background: "rgba(20,24,30,0.94)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "8px",
    boxShadow: "0 6px 24px rgba(0,0,0,0.5)",
    color: "#e2e8f0",
    fontFamily: "ui-monospace, Menlo, Consolas, monospace",
    fontSize: "11px",
    zIndex: "100",
    backdropFilter: "blur(6px)",
    display: opts.initiallyVisible ? "flex" : "none",
    flexDirection: "column",
    overflow: "hidden",
  });

  // ── Header ──
  const header = document.createElement("div");
  Object.assign(header.style, {
    display: "flex", alignItems: "center", gap: "8px",
    padding: "8px 12px", borderBottom: "1px solid rgba(255,255,255,0.1)",
    cursor: "move", userSelect: "none", background: "rgba(255,255,255,0.03)",
  });
  const titleEl = document.createElement("span");
  titleEl.textContent = "📈 Modal — —";
  Object.assign(titleEl.style, { flex: "1", fontWeight: "600", color: "#a5b4fc", fontSize: "12px" });
  header.appendChild(titleEl);
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "×";
  Object.assign(closeBtn.style, {
    background: "transparent", border: "none", color: "#e2e8f0",
    fontSize: "20px", cursor: "pointer", padding: "0 6px", lineHeight: "1",
  });
  closeBtn.onclick = () => api.hide();
  header.appendChild(closeBtn);
  el.appendChild(header);

  // ── Properties banner ──
  const propsEl = document.createElement("div");
  Object.assign(propsEl.style, {
    padding: "6px 12px", background: "rgba(255,255,255,0.02)",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    fontSize: "10.5px", color: "#94a3b8", lineHeight: "1.5",
  });
  el.appendChild(propsEl);

  // ── ASCE 7-22 §12.9.1 status banner ──
  const asceEl = document.createElement("div");
  Object.assign(asceEl.style, {
    padding: "6px 12px", fontSize: "10.5px", color: "#fde68a",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  });
  el.appendChild(asceEl);

  // ── Table ──
  const tableContainer = document.createElement("div");
  Object.assign(tableContainer.style, { flex: "1", overflow: "auto", padding: "0 6px" });
  el.appendChild(tableContainer);

  // ── Animation controls ──
  const controls = document.createElement("div");
  Object.assign(controls.style, {
    display: "flex", alignItems: "center", gap: "8px",
    padding: "8px 12px", borderTop: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.03)",
  });
  const prevBtn = ctrlBtn("◀");
  const playBtn = ctrlBtn("▶");
  const nextBtn = ctrlBtn("▶▶");
  controls.appendChild(prevBtn);
  controls.appendChild(playBtn);
  controls.appendChild(nextBtn);
  const slider = document.createElement("input");
  slider.type = "range"; slider.min = "1"; slider.max = "1"; slider.value = "1";
  Object.assign(slider.style, { flex: "1" });
  controls.appendChild(slider);
  const modeLabel = document.createElement("span");
  Object.assign(modeLabel.style, { color: "#fde68a", fontSize: "11px", minWidth: "120px", textAlign: "right" });
  modeLabel.textContent = "Modo 1";
  controls.appendChild(modeLabel);
  el.appendChild(controls);

  // ── Drag por header ──
  let dragOff: { x: number; y: number } | null = null;
  header.addEventListener("mousedown", (e) => {
    const r = el.getBoundingClientRect();
    dragOff = { x: e.clientX - r.left, y: e.clientY - r.top };
    e.preventDefault();
  });
  window.addEventListener("mousemove", (e) => {
    if (!dragOff) return;
    el.style.left = `${e.clientX - dragOff.x}px`;
    el.style.top = `${e.clientY - dragOff.y}px`;
    el.style.right = "auto";
  });
  window.addEventListener("mouseup", () => { dragOff = null; });

  // ── State ──
  const activeMode = van.state(0);
  let animTimer: ReturnType<typeof setInterval> | null = null;
  let lastOut: ModalOutputs | null = null;

  function setMode(i: number) {
    if (!lastOut) return;
    const n = lastOut.frequencies?.length ?? 1;
    activeMode.val = Math.max(0, Math.min(n - 1, i));
    const f = lastOut.frequencies[activeMode.val];
    modeLabel.textContent = `Modo ${activeMode.val + 1} — f=${f.toFixed(3)} Hz · T=${(1 / f).toFixed(4)} s`;
    slider.value = String(activeMode.val + 1);
    opts.onModeChange?.(activeMode.val);
    highlightActiveRow();
  }

  prevBtn.onclick = () => setMode(activeMode.val - 1);
  nextBtn.onclick = () => setMode(activeMode.val + 1);
  slider.oninput = () => setMode(parseInt(slider.value) - 1);
  playBtn.onclick = () => {
    if (animTimer) { api.pause(); }
    else { api.play(); }
  };

  function highlightActiveRow() {
    tableContainer.querySelectorAll("tr[data-mode]").forEach((tr) => {
      const i = parseInt((tr as HTMLElement).dataset.mode!);
      (tr as HTMLElement).style.background = i === activeMode.val
        ? "rgba(245,158,11,0.18)" : "transparent";
    });
  }

  function update(out: ModalOutputs, meta?: ModalPanelMeta) {
    lastOut = out;
    if (meta?.title) titleEl.textContent = `📈 ${meta.title}`;
    propsEl.innerHTML = (meta?.properties ?? []).map((p) => `<div>${escapeHtml(p)}</div>`).join("");
    // Render table
    renderTable(tableContainer, out, asceEl, setMode);
    // Slider range
    const n = out.frequencies?.length ?? 1;
    slider.max = String(n);
    setMode(0);
  }

  // Append to DOM
  document.body.appendChild(el);

  const api: ModalPanelApi = {
    el,
    activeMode,
    update,
    render: update,  // legacy alias
    show() { el.style.display = "flex"; },
    hide() { el.style.display = "none"; api.pause(); },
    toggle() { el.style.display = el.style.display === "none" ? "flex" : "none"; },
    play() {
      if (animTimer) return;
      playBtn.textContent = "⏸";
      animTimer = setInterval(() => {
        if (!lastOut) return;
        const n = lastOut.frequencies.length;
        setMode((activeMode.val + 1) % n);
      }, 1500);
    },
    pause() {
      if (animTimer) { clearInterval(animTimer); animTimer = null; }
      playBtn.textContent = "▶";
    },
    destroy() { api.pause(); el.remove(); },
  };
  return api;
}

function ctrlBtn(label: string): HTMLButtonElement {
  const b = document.createElement("button");
  b.textContent = label;
  Object.assign(b.style, {
    background: "rgba(165,180,252,0.1)", border: "1px solid rgba(165,180,252,0.3)",
    color: "#a5b4fc", padding: "4px 10px", borderRadius: "4px",
    cursor: "pointer", fontSize: "12px", fontFamily: "monospace",
  });
  return b;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

/** Render tabla de modos con masa participativa + verifica ASCE 7-22 §12.9.1 */
function renderTable(
  container: HTMLElement,
  out: ModalOutputs,
  asceEl: HTMLElement,
  // ⚠️ Antes no habia este parametro: la fila llamaba a un `slider_setMode`
  // con el CUERPO VACIO («Override desde getModalPanel via cierre» — nunca se
  // hizo). Hacer clic en una fila de la tabla de modos no hacia NADA, y sin
  // error: el modo seguia siendo el de antes.
  alElegirModo: (i: number) => void,
) {
  container.innerHTML = "";
  const n = out.frequencies?.length ?? 0;
  if (n === 0) {
    container.textContent = "Sin resultados modales.";
    return;
  }

  const tbl = document.createElement("table");
  Object.assign(tbl.style, {
    width: "100%", borderCollapse: "collapse", fontSize: "10.5px",
    fontFamily: "ui-monospace, Menlo, monospace",
  });
  // Header
  const thead = document.createElement("thead");
  thead.innerHTML = `
    <tr style="background:rgba(165,180,252,0.1);position:sticky;top:0">
      <th style="padding:6px 4px;text-align:right;color:#a5b4fc">Modo</th>
      <th style="padding:6px 4px;text-align:right;color:#a5b4fc">ω(rad/s)</th>
      <th style="padding:6px 4px;text-align:right;color:#a5b4fc">f(Hz)</th>
      <th style="padding:6px 4px;text-align:right;color:#a5b4fc">T(s)</th>
      <th style="padding:6px 4px;text-align:right;color:#a5b4fc">Ux</th>
      <th style="padding:6px 4px;text-align:right;color:#a5b4fc">Uy</th>
      <th style="padding:6px 4px;text-align:right;color:#a5b4fc">Uz</th>
      <th style="padding:6px 4px;text-align:right;color:#a5b4fc">Rx</th>
      <th style="padding:6px 4px;text-align:right;color:#a5b4fc">Ry</th>
      <th style="padding:6px 4px;text-align:right;color:#a5b4fc">Rz</th>
      <th style="padding:6px 4px;text-align:right;color:#a5b4fc">ΣUx</th>
      <th style="padding:6px 4px;text-align:right;color:#a5b4fc">ΣUy</th>
      <th style="padding:6px 4px;text-align:right;color:#a5b4fc">ΣUz</th>
      <th style="padding:6px 4px;text-align:right;color:#a5b4fc">ΣRx</th>
      <th style="padding:6px 4px;text-align:right;color:#a5b4fc">ΣRy</th>
      <th style="padding:6px 4px;text-align:right;color:#a5b4fc">ΣRz</th>
      <th style="padding:6px 4px;text-align:left;color:#a5b4fc">Tipo</th>
    </tr>`;
  tbl.appendChild(thead);

  // Body
  const tbody = document.createElement("tbody");
  let sumUx = 0, sumUy = 0, sumUz = 0, sumRx = 0, sumRy = 0, sumRz = 0;
  let firstUx = -1, firstUy = -1, firstRz = -1;
  let achieved90Ux = -1, achieved90Uy = -1, achieved90Rz = -1;
  for (let i = 0; i < n; i++) {
    const f = out.frequencies[i];
    const omega = 2 * Math.PI * f;
    const T = 1 / f;
    const mpRaw = out.massParticipation?.[i];
    // mpRaw puede ser number[6] (formato legacy) o {ux, uy, uz, rx, ry, rz}
    let ux = 0, uy = 0, uz = 0, rx = 0, ry = 0, rz = 0;
    if (Array.isArray(mpRaw)) {
      ux = mpRaw[0] ?? 0; uy = mpRaw[1] ?? 0; uz = mpRaw[2] ?? 0;
      rx = mpRaw[3] ?? 0; ry = mpRaw[4] ?? 0; rz = mpRaw[5] ?? 0;
    } else if (mpRaw && typeof mpRaw === "object") {
      const m = mpRaw as { ux?: number; uy?: number; uz?: number; rx?: number; ry?: number; rz?: number };
      ux = m.ux ?? 0; uy = m.uy ?? 0; uz = m.uz ?? 0;
      rx = m.rx ?? 0; ry = m.ry ?? 0; rz = m.rz ?? 0;
    }
    sumUx += ux; sumUy += uy; sumUz += uz; sumRx += rx; sumRy += ry; sumRz += rz;
    if (firstUx < 0 && ux > 0.5) firstUx = i;
    if (firstUy < 0 && uy > 0.5) firstUy = i;
    if (firstRz < 0 && rz > 0.5) firstRz = i;
    if (achieved90Ux < 0 && sumUx > 0.9) achieved90Ux = i;
    if (achieved90Uy < 0 && sumUy > 0.9) achieved90Uy = i;
    if (achieved90Rz < 0 && sumRz > 0.9) achieved90Rz = i;

    let tipo = "—";
    if (i === firstUx) tipo = `Ux (${(ux * 100).toFixed(0)}%)`;
    else if (i === firstUy) tipo = `Uy (${(uy * 100).toFixed(0)}%)`;
    else if (i === firstRz) tipo = `Rz (${(rz * 100).toFixed(0)}%)`;

    const tr = document.createElement("tr");
    tr.dataset.mode = String(i);
    Object.assign(tr.style, { borderBottom: "1px solid rgba(255,255,255,0.04)", cursor: "pointer" });
    tr.onclick = () => alElegirModo(i);
    tr.innerHTML = `
      <td style="padding:3px 4px;text-align:right;color:#fde68a;font-weight:600">${i + 1}</td>
      <td style="padding:3px 4px;text-align:right">${omega.toFixed(2)}</td>
      <td style="padding:3px 4px;text-align:right;color:#fde68a">${f.toFixed(3)}</td>
      <td style="padding:3px 4px;text-align:right">${T.toFixed(3)}</td>
      <td style="padding:3px 4px;text-align:right;color:${cmpColor(ux)}">${pct(ux)}</td>
      <td style="padding:3px 4px;text-align:right;color:${cmpColor(uy)}">${pct(uy)}</td>
      <td style="padding:3px 4px;text-align:right;color:${cmpColor(uz)}">${pct(uz)}</td>
      <td style="padding:3px 4px;text-align:right;color:${cmpColor(rx)}">${pct(rx)}</td>
      <td style="padding:3px 4px;text-align:right;color:${cmpColor(ry)}">${pct(ry)}</td>
      <td style="padding:3px 4px;text-align:right;color:${cmpColor(rz)}">${pct(rz)}</td>
      <td style="padding:3px 4px;text-align:right;color:#94a3b8">${pct(sumUx)}</td>
      <td style="padding:3px 4px;text-align:right;color:#94a3b8">${pct(sumUy)}</td>
      <td style="padding:3px 4px;text-align:right;color:#94a3b8">${pct(sumUz)}</td>
      <td style="padding:3px 4px;text-align:right;color:#94a3b8">${pct(sumRx)}</td>
      <td style="padding:3px 4px;text-align:right;color:#94a3b8">${pct(sumRy)}</td>
      <td style="padding:3px 4px;text-align:right;color:#94a3b8">${pct(sumRz)}</td>
      <td style="padding:3px 4px;text-align:left;color:#a5b4fc">${tipo}</td>
    `;
    tbody.appendChild(tr);
  }
  tbl.appendChild(tbody);
  container.appendChild(tbl);

  // ASCE banner
  // Regla de Jorge (18-sep-2026): la participacion de masa se muestra SIEMPRE con las
  // SEIS sumatorias. El 90 % de ASCE 7-22 §12.9.1 / NEC-15 se exige por DIRECCION de
  // analisis (X e Y); las otras cuatro se informan porque delatan si faltan modos.
  const seis = `ΣUx=${pct(sumUx)} ΣUy=${pct(sumUy)} ΣUz=${pct(sumUz)} ΣRx=${pct(sumRx)} ΣRy=${pct(sumRy)} ΣRz=${pct(sumRz)}`;
  const ascePassed = achieved90Ux >= 0 && achieved90Uy >= 0;
  if (ascePassed) {
    asceEl.innerHTML = `<b>ASCE 7-22 §12.9.1:</b> ✓ 90% alcanzado en X (modo ${achieved90Ux + 1}) e Y (modo ${achieved90Uy + 1}) de ${n}<br><span style="color:#94a3b8">${seis}</span>`;
    asceEl.style.color = "#86efac";
  } else {
    asceEl.innerHTML = `<b>ASCE 7-22 §12.9.1:</b> ⚠ con ${n} modos NO se llega al 90 % en las dos direcciones. Considera aumentar.<br><span style="color:#94a3b8">${seis}</span>`;
    asceEl.style.color = "#fcd34d";
  }
}

function pct(v: number): string {
  return `${(v * 100).toFixed(1)}%`;
}
function cmpColor(v: number): string {
  if (v > 0.5) return "#86efac";    // verde — dominante
  if (v > 0.1) return "#fde68a";    // amarillo — significativo
  return "#475569";                  // gris — irrelevante
}


