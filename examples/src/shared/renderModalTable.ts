import { ModalOutputs } from "hekatan-fem";

export interface ModalTableConfig {
  /** Title shown above the table, e.g. "Example 6.3 Space Frame" */
  title: string;
  /** Optional property lines shown below the title */
  properties?: string[];
  /** SVG del espectro NEC-15 (Sa vs T) insertado en el cuerpo del panel. */
  spectrumHtml?: string;
}

/**
 * Panel modal con detección automática del cumplimiento ASCE 7-22 §12.9.1.1
 *   "Sufficient modes shall be included to capture at least 90 % of the
 *    actual mass in each of the orthogonal horizontal directions of response."
 *
 * Marca con ✓ el modo donde por primera vez ΣUx, ΣUy llegan a 90 % y muestra
 * un dictamen general arriba del cuadro.
 */
export function createModalPanel() {
  const div = document.createElement("div");
  div.id = "modal-results";
  div.style.cssText = `
    position: fixed; bottom: 10px; left: 10px; z-index: 9999;
    background: rgba(0,0,0,0.92); color: #0f0; font-family: monospace;
    font-size: 12px; border-radius: 6px;
    width: 640px; max-width: 60vw; max-height: 50vh;
    display: flex; flex-direction: column; overflow: hidden;
    pointer-events: auto;
    border: 1px solid #0f06; box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    resize: both;
    min-width: 340px; min-height: 120px;
  `;

  let minimized = false;
  const ASCE_THRESHOLD = 0.90; // 90 % per ASCE 7-22 §12.9.1.1

  function render(m: ModalOutputs, config: ModalTableConfig) {
    if (!m.frequencies || m.frequencies.length === 0) {
      div.innerHTML = "<b style='padding:12px;display:block'>Modal: no results</b>";
      return;
    }

    const dirs = ["Ux", "Uy", "Uz", "Rx", "Ry", "Rz"];
    const sumP = [0, 0, 0, 0, 0, 0];
    const N = m.frequencies.length;

    // Pre-cálculo: detectar modo donde se alcanza 90 % en X, Y
    let modeAt90X = -1, modeAt90Y = -1, modeAt90Both = -1;
    let totalX = 0, totalY = 0, totalZ = 0, totalRz = 0;
    {
      const s = [0, 0, 0, 0, 0, 0];
      for (let i = 0; i < N; i++) {
        const mp = m.massParticipation?.[i] || [0, 0, 0, 0, 0, 0];
        for (let d = 0; d < 6; d++) s[d] += mp[d];
        if (modeAt90X < 0 && s[0] >= ASCE_THRESHOLD) modeAt90X = i + 1;
        if (modeAt90Y < 0 && s[1] >= ASCE_THRESHOLD) modeAt90Y = i + 1;
        if (modeAt90Both < 0 && s[0] >= ASCE_THRESHOLD && s[1] >= ASCE_THRESHOLD)
          modeAt90Both = i + 1;
      }
      totalX = s[0]; totalY = s[1]; totalZ = s[2]; totalRz = s[5];
    }

    // ── Detección de los 3 modos sísmicos principales (Ux, Uy, Rz) ──
    // El primer modo donde cada DOF tiene MPF > 0.10 (10 %)
    let primaryUx = -1, primaryUy = -1, primaryRz = -1;
    const primaryThreshold = 0.10;
    for (let i = 0; i < N; i++) {
      const mp = m.massParticipation?.[i] || [0, 0, 0, 0, 0, 0];
      if (primaryUx < 0 && mp[0] > primaryThreshold) primaryUx = i + 1;
      if (primaryUy < 0 && mp[1] > primaryThreshold) primaryUy = i + 1;
      if (primaryRz < 0 && mp[5] > primaryThreshold) primaryRz = i + 1;
    }

    // ── Header con dictamen ASCE ──
    const dictamen = (() => {
      if (modeAt90Both > 0)
        return `<span style="color:#0f0">✓ ASCE 7-22 §12.9.1.1 — 90 % alcanzado en X e Y al modo ${modeAt90Both} de ${N}</span>`;
      if (modeAt90X > 0 && modeAt90Y < 0)
        return `<span style="color:#fa0">⚠ X cumple en modo ${modeAt90X}, Y todavía en ${(totalY * 100).toFixed(1)} % — aumentar nModes</span>`;
      if (modeAt90Y > 0 && modeAt90X < 0)
        return `<span style="color:#fa0">⚠ Y cumple en modo ${modeAt90Y}, X todavía en ${(totalX * 100).toFixed(1)} % — aumentar nModes</span>`;
      return `<span style="color:#f44">✗ ASCE 7-22 NO cumplido en ${N} modos · ΣUx=${(totalX * 100).toFixed(1)} % · ΣUy=${(totalY * 100).toFixed(1)} % — aumentar nModes</span>`;
    })();

    // ── Resumen 3 modos principales (estilo ETABS) ──
    const primaryBlock = (() => {
      const fmt = (idx: number, dir: string) => {
        if (idx < 0) return `<span style="color:#f44">${dir}: no encontrado en ${N} modos</span>`;
        const mp = m.massParticipation?.[idx - 1] || [0, 0, 0, 0, 0, 0];
        const dDir = dir === "Ux" ? 0 : dir === "Uy" ? 1 : 5;
        const T = m.frequencies[idx - 1] > 0 ? 1 / m.frequencies[idx - 1] : 0;
        return `<span style="color:#0f0">${dir}: modo ${idx}, T=${T.toFixed(3)} s, MPF=${(mp[dDir] * 100).toFixed(1)} %</span>`;
      };
      return `<div style="margin:4px 0; padding:4px 6px; background:rgba(0,255,255,0.05); border-left:2px solid #0ff; font-size:11px;">
  🎯 <b>Modos sísmicos principales</b> (ASCE 7-22 §12.9.1):<br>
  ${fmt(primaryUx, "Ux")} · ${fmt(primaryUy, "Uy")} · ${fmt(primaryRz, "Rz")}
</div>`;
    })();

    let html = `<div id="modal-header" style="flex:0 0 auto; display:flex; align-items:center; justify-content:space-between; padding:6px 10px; cursor:move; border-bottom:1px solid #0f04; background:rgba(0,0,0,0.4);">
  <b style="color:#ff0; font-size:12px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis">⚡ MODAL — ${config.title}</b>
  <div style="display:flex; gap:4px; margin-left:12px;">
    <button id="modal-copy" style="padding:2px 8px; font-size:10px; cursor:pointer;
      background:#2d6a4f; color:#fff; border:1px solid #40916c; border-radius:3px;" title="Copiar tabla">📋</button>
    <button id="modal-minimize" style="padding:2px 8px; font-size:10px; cursor:pointer;
      background:#555; color:#fff; border:1px solid #777; border-radius:3px;" title="Minimizar">▬</button>
    <button id="modal-close" style="padding:2px 8px; font-size:10px; cursor:pointer;
      background:#7a2d2d; color:#fff; border:1px solid #b04545; border-radius:3px;" title="Cerrar (ocultar ventana)">✕</button>
  </div>
</div>`;

    html += `<div id="modal-body" style="flex:1 1 auto; min-height:0; overflow:auto; padding:6px 12px 10px 12px;">`;

    // Dictamen arriba
    html += `<div style="padding:6px 0; font-weight:bold; font-size:13px;">${dictamen}</div>`;
    // Resumen 3 modos principales (Ux, Uy, Rz)
    html += primaryBlock;

    if (config.properties) {
      for (const line of config.properties) {
        html += `<span style="color:#888">${line}</span>\n`;
      }
    }
    // Gráfica del espectro NEC-15 (Sa vs T) con T₁ del modal marcado.
    if (config.spectrumHtml) html += config.spectrumHtml;

    html += `<table style="border-collapse:collapse; color:#0f0; font-size:11px; margin-top:4px">
<tr style="color:#ff0; border-bottom:1px solid #ff03">
  <th style="padding:2px 6px">Mode</th>
  <th style="padding:2px 6px">Freq (Hz)</th>
  <th style="padding:2px 6px">Period (s)</th>
  <th style="padding:2px 6px">ω (rad/s)</th>`;
    for (const d of dirs) html += `<th style="padding:2px 5px">${d}</th>`;
    html += `<th style="padding:2px 5px; color:#0ff">ΣUx</th>
  <th style="padding:2px 5px; color:#0ff">ΣUy</th>
  <th style="padding:2px 5px; color:#0ff">ΣRz</th>
  <th style="padding:2px 5px; color:#fff">Tipo</th></tr>`;

    // Reset y armar filas
    for (let d = 0; d < 6; d++) sumP[d] = 0;
    m.frequencies.forEach((freq, i) => {
      const T = freq > 0 ? 1 / freq : 0;
      const omega = freq * 2 * Math.PI;
      const mp = m.massParticipation?.[i] || [0, 0, 0, 0, 0, 0];
      for (let d = 0; d < 6; d++) sumP[d] += mp[d];

      // Clasificar modo: cuál DOF domina (mayor MPF)
      let domDir = 0, domVal = mp[0];
      for (let d = 1; d < 6; d++) if (mp[d] > domVal) { domVal = mp[d]; domDir = d; }
      const tipoLabel = domVal < 0.05 ? "—" : `${dirs[domDir]} (${(domVal * 100).toFixed(0)} %)`;
      const tipoColor =
        domDir === 0 || domDir === 1
          ? "#0f0"
          : domDir === 5
          ? "#0ff"
          : domDir === 2
          ? "#fa0"
          : "#888";

      // Highlight si este modo alcanza 90 % en X o Y
      const isAt90X = i + 1 === modeAt90X;
      const isAt90Y = i + 1 === modeAt90Y;
      const isAt90Both = i + 1 === modeAt90Both;
      const rowBg = isAt90Both
        ? "background:rgba(0,255,0,0.12);"
        : isAt90X || isAt90Y
        ? "background:rgba(255,200,0,0.1);"
        : "";

      html += `<tr style="border-bottom:1px solid #fff1; ${rowBg}">
  <td style="padding:2px 6px; text-align:center">${i + 1}${isAt90Both ? " ★" : ""}</td>
  <td style="padding:2px 6px; text-align:right">${freq.toFixed(4)}</td>
  <td style="padding:2px 6px; text-align:right">${T.toFixed(4)}</td>
  <td style="padding:2px 6px; text-align:right">${omega.toFixed(2)}</td>`;

      for (let d = 0; d < 6; d++) {
        const pct = (mp[d] * 100).toFixed(1);
        const color = mp[d] > 0.5 ? "#f00" : mp[d] > 0.1 ? "#ff0" : "#0f0";
        html += `<td style="padding:2px 5px; text-align:right; color:${color}">${pct}%</td>`;
      }

      const sxColor = sumP[0] >= ASCE_THRESHOLD ? "#0f0" : "#0ff";
      const syColor = sumP[1] >= ASCE_THRESHOLD ? "#0f0" : "#0ff";
      html += `<td style="padding:2px 5px; text-align:right; color:${sxColor}">${(sumP[0] * 100).toFixed(1)}%${isAt90X ? " ✓" : ""}</td>
  <td style="padding:2px 5px; text-align:right; color:${syColor}">${(sumP[1] * 100).toFixed(1)}%${isAt90Y ? " ✓" : ""}</td>
  <td style="padding:2px 5px; text-align:right; color:#0ff">${(sumP[5] * 100).toFixed(1)}%</td>
  <td style="padding:2px 5px; color:${tipoColor}">${tipoLabel}</td></tr>`;
    });

    html += `</table>
<div style="margin-top:6px; font-size:10px; color:#888;">
  ★ = primer modo donde ΣUx y ΣUy ≥ 90 %  ·  Tipos: <span style="color:#0f0">Ux/Uy</span>=lateral · <span style="color:#0ff">Rz</span>=torsional · <span style="color:#fa0">Uz</span>=vertical (no relevante para sismo)
</div>`;
    html += "</div>";
    div.innerHTML = html;

    if (minimized) {
      const body = div.querySelector("#modal-body") as HTMLElement;
      const btn = div.querySelector("#modal-minimize") as HTMLElement;
      if (body) body.style.display = "none";
      if (btn) { btn.textContent = "▢"; btn.title = "Restaurar"; }
    }

    div.querySelector("#modal-minimize")?.addEventListener("click", () => {
      minimized = !minimized;
      const body = div.querySelector("#modal-body") as HTMLElement;
      const btn = div.querySelector("#modal-minimize") as HTMLElement;
      if (minimized) { body.style.display = "none"; btn.textContent = "▢"; btn.title = "Restaurar"; }
      else { body.style.display = "block"; btn.textContent = "▬"; btn.title = "Minimizar"; }
    });

    // Cerrar = ocultar la ventana ENTERA (no solo colapsar el cuerpo). Así el
    // usuario sigue con otro cálculo sin que el panel le tape el modelo. Se
    // vuelve a mostrar al apretar "Correr modal + animar" (display = "block").
    div.querySelector("#modal-close")?.addEventListener("click", () => {
      div.style.display = "none";
    });

    // Arrastrar el panel por el header → moverlo a donde no tape el modelo
    const header = div.querySelector("#modal-header") as HTMLElement;
    header?.addEventListener("mousedown", (e) => {
      if ((e.target as HTMLElement).tagName === "BUTTON") return;
      const r = div.getBoundingClientRect();
      div.style.bottom = "auto"; div.style.top = `${r.top}px`; div.style.left = `${r.left}px`;
      const ox = (e as MouseEvent).clientX - r.left, oy = (e as MouseEvent).clientY - r.top;
      const move = (ev: MouseEvent) => {
        div.style.left = `${Math.max(0, ev.clientX - ox)}px`;
        div.style.top = `${Math.max(0, ev.clientY - oy)}px`;
      };
      const up = () => { document.removeEventListener("mousemove", move); document.removeEventListener("mouseup", up); };
      document.addEventListener("mousemove", move); document.addEventListener("mouseup", up);
      e.preventDefault();
    });

    div.querySelector("#modal-copy")?.addEventListener("click", () => {
      const lines: string[] = [];
      lines.push(`Modal Analysis — ${config.title}`);
      lines.push(dictamen.replace(/<[^>]+>/g, ""));
      const hdr = `Mode  Freq(Hz)  Period(s)  ω(rad/s)  ${dirs.join("     ")}  ΣUx    ΣUy    ΣRz   Tipo`;
      lines.push(hdr);
      lines.push("-".repeat(hdr.length));
      const sp2 = [0, 0, 0, 0, 0, 0];
      m.frequencies.forEach((freq, i) => {
        const T = freq > 0 ? 1 / freq : 0;
        const omega = freq * 2 * Math.PI;
        const mp = m.massParticipation?.[i] || [0, 0, 0, 0, 0, 0];
        for (let d = 0; d < 6; d++) sp2[d] += mp[d];
        let domDir = 0, domVal = mp[0];
        for (let d = 1; d < 6; d++) if (mp[d] > domVal) { domVal = mp[d]; domDir = d; }
        const tipoLabel = domVal < 0.05 ? "—" : `${dirs[domDir]} (${(domVal * 100).toFixed(0)}%)`;
        const mpStr = mp.map(v => ((v * 100).toFixed(1) + "%").padStart(6)).join(" ");
        lines.push(`${String(i + 1).padStart(4)}  ${freq.toFixed(4).padStart(9)}  ${T.toFixed(4).padStart(9)}  ${omega.toFixed(2).padStart(9)}  ${mpStr}  ${(sp2[0] * 100).toFixed(1).padStart(5)}%  ${(sp2[1] * 100).toFixed(1).padStart(5)}%  ${(sp2[5] * 100).toFixed(1).padStart(5)}%  ${tipoLabel}`);
      });
      navigator.clipboard.writeText(lines.join("\n"));
      const btn = div.querySelector("#modal-copy") as HTMLElement;
      btn.textContent = "✓";
      setTimeout(() => btn.textContent = "📋", 1500);
    });
  }

  return { div, render };
}
