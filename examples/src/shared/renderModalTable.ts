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
  // ⚠️ El tamaño: `resize: both` estaba puesto desde siempre y NO funcionaba
  // para agrandar. La culpa era de `max-width: 760px; max-height: 60vh`: el
  // `max-*` le gana al tamaño que fija el usuario al arrastrar la esquina, así
  // que el panel solo podía ACHICARSE. Ahora el tope es la pantalla (96vw/92vh)
  // y el tamaño inicial va en `width`/`height`, que sí es lo que el arrastre
  // sobrescribe.
  div.style.cssText = `
    position: fixed; bottom: 10px; left: 10px; z-index: 9999;
    background: rgba(0,0,0,0.92); color: #0f0; font-family: monospace;
    font-size: 11px; border-radius: 6px;
    width: 760px; height: 60vh;
    max-width: 96vw; max-height: 92vh;
    overflow-x: auto; overflow-y: auto;
    pointer-events: auto;
    border: 1px solid #0f03;
    resize: both;
    min-width: 360px; min-height: 160px;
  `;

  // ── Drag por la cabecera (#modal-header) — el panel tapaba el modelo y no se
  //    podía mover. La cabecera se re-crea en cada render(), por eso el listener
  //    vive en el `div` persistente y detecta el header con closest(). ──
  {
    let dragging = false, sx = 0, sy = 0, ox = 0, oy = 0;
    div.addEventListener("mousedown", (e) => {
      const t = e.target as HTMLElement;
      if (!t.closest("#modal-header")) return;   // solo arrastra por la cabecera
      if (t.closest("button")) return;            // no sobre los botones (copiar/minimizar)
      dragging = true;
      const r = div.getBoundingClientRect();
      sx = e.clientX; sy = e.clientY; ox = r.left; oy = r.top;
      div.style.bottom = "auto"; div.style.right = "auto";
      div.style.left = `${r.left}px`; div.style.top = `${r.top}px`;
      e.preventDefault();
    });
    document.addEventListener("mousemove", (e) => {
      if (!dragging) return;
      let nl = ox + (e.clientX - sx), nt = oy + (e.clientY - sy);
      nl = Math.max(-div.offsetWidth + 80, Math.min(window.innerWidth - 80, nl));
      nt = Math.max(0, Math.min(window.innerHeight - 30, nt));
      div.style.left = `${nl}px`; div.style.top = `${nt}px`;
    });
    document.addEventListener("mouseup", () => { dragging = false; });
  }

  let minimized = false;
  let ajustadoATabla = false;
  // Tamaño guardado antes de "⤢ Ancho", para poder volver.
  let anchoPrev: { w: string; h: string; l: string; t: string; bo: string; r: string } | null = null;
  const ASCE_THRESHOLD = 0.90; // 90 % per ASCE 7-22 §12.9.1.1

  function render(m: ModalOutputs, config: ModalTableConfig) {
    // Sin frecuencias = el modal NO corrió (típicamente por el tope de GDL). El motivo
    // técnico viene en config.properties — antes se perdía tras un "no results" mudo y el
    // usuario apretaba "Correr modal" sin enterarse de por qué no pasaba nada.
    if (!m.frequencies || m.frequencies.length === 0) {
      const motivo = config.properties?.length
        ? config.properties.map((l) => `<div>${l}</div>`).join("")
        : "<div>El solver no devolvió modos.</div>";
      div.innerHTML = `<div id="modal-header" style="display:flex; align-items:center; justify-content:space-between; padding:8px 12px; cursor:move; user-select:none;" title="Arrastra para mover">
  <b style="color:#ff0">✥ ⚡ MODAL — ${config.title}</b>
</div>
<div id="modal-body" style="padding:0 12px 10px 12px;">
  <div style="color:#f44; font-weight:bold; font-size:13px; padding:6px 0">✗ El análisis modal NO se ejecutó</div>
  <div style="color:#fa0; font-size:11px; line-height:1.5">${motivo}</div>
</div>`;
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

    // ── Aviso técnico de masa participativa (NEC-15 §6.2.2 / ASCE 7-22 §12.9.1.1) ──
    // Es el ÚNICO texto que queda en el panel: dice si faltan modos y cuántos faltan.
    const dictamen = (() => {
      const falta = (tot: number) => `${((ASCE_THRESHOLD - tot) * 100).toFixed(1)} %`;
      // Corto y en UNA línea: el aviso largo ocupaba dos renglones y tapaba los modos (Jorge,
      // 14-sep-2026: «que se vean los 3 primeros modos y hasta ΣRz»). La norma queda en el title.
      if (modeAt90Both > 0)
        return `<span style="color:#0f0" title="Masa participativa ≥ 90 % en X e Y (NEC-15 §6.2.2 / ASCE 7-22 §12.9.1.1)">✓ ≥ 90 % en X e Y al modo ${modeAt90Both} de ${N} · ΣUx ${(totalX * 100).toFixed(1)} % · ΣUy ${(totalY * 100).toFixed(1)} %</span>`;
      if (modeAt90X > 0 && modeAt90Y < 0)
        return `<span style="color:#fa0">⚠ FALTAN MODOS EN Y — ΣUy=${(totalY * 100).toFixed(1)} % en ${N} modos (faltan ${falta(totalY)} para el 90 % que exige NEC-15 §6.2.2). X cumple en el modo ${modeAt90X}. Subí «N° de modos» en Settings ▸ ⚡ Modal + Animación.</span>`;
      if (modeAt90Y > 0 && modeAt90X < 0)
        return `<span style="color:#fa0">⚠ FALTAN MODOS EN X — ΣUx=${(totalX * 100).toFixed(1)} % en ${N} modos (faltan ${falta(totalX)} para el 90 % que exige NEC-15 §6.2.2). Y cumple en el modo ${modeAt90Y}. Subí «N° de modos» en Settings ▸ ⚡ Modal + Animación.</span>`;
      return `<span style="color:#f44">✗ FALTAN MODOS EN AMBAS DIRECCIONES — ΣUx=${(totalX * 100).toFixed(1)} % · ΣUy=${(totalY * 100).toFixed(1)} % en ${N} modos. NEC-15 §6.2.2 exige ≥ 90 %: el cortante dinámico sale bajo y el control Vdin/Vest no es representativo. Subí «N° de modos» en Settings ▸ ⚡ Modal + Animación.</span>`;
    })();

    // Los botones llevan TEXTO, no solo el icono: con "📋" a secas nadie
    // adivina que se puede copiar la tabla, y esa fue justo la pregunta
    // («alguien que quiera copiar la tabla, cómo hace»).
    const btn = (id: string, txt: string, tip: string, bg: string, bd: string) =>
      `<button id="${id}" title="${tip}" style="padding:3px 9px; font-size:10px;
        cursor:pointer; background:${bg}; color:#fff; border:1px solid ${bd};
        border-radius:3px; font-family:monospace; white-space:nowrap;">${txt}</button>`;
    let html = `<div id="modal-header" style="display:flex; align-items:center; justify-content:space-between; padding:8px 12px; cursor:move; user-select:none;" title="Arrastrá desde acá para mover la ventana">
  <b style="color:#ff0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; min-width:0" title="${config.title}">✥ ⚡ MODAL — ${config.title}</b>
  <div style="display:flex; gap:4px; margin-left:12px; flex-shrink:0;">
    ${btn("modal-copy", "📋 Copiar", "Copiar la tabla al portapapeles — se pega en Excel en columnas", "#2d6a4f", "#40916c")}
    ${btn("modal-wide", "⤢ Ancho", "Agrandar la ventana a casi toda la pantalla", "#33507a", "#4a6fa5")}
    ${btn("modal-minimize", "▬", "Minimizar", "#555", "#777")}
    ${btn("modal-close", "✕", "Cerrar (se vuelve a abrir con «📋 Mostrar tabla» en Settings)", "#7a3333", "#a54a4a")}
  </div>
</div>`;

    html += `<div id="modal-body" style="padding:0 12px 10px 12px;">`;

    // El panel es SOLO LA TABLA: el único texto es el aviso técnico de masa participativa
    // (si faltan modos hay que enterarse acá). El resumen de modos principales, las líneas
    // de NEC/cortante/derivas/combos (config.properties) y el espectro NO se renderizan —
    // viven en el menú "📋 Tablas" de Analysis Outputs y en el panel de espectro.
    html += `<div style="padding:2px 0 4px 0; font-weight:bold; font-size:11px; line-height:1.4">${dictamen}</div>`;

    // nowrap: el «✓» de ΣUx partía la celda y cada fila salía del doble de alto
    html += `<table style="border-collapse:collapse; color:#0f0; font-size:10px; margin-top:2px; white-space:nowrap">
<tr style="color:#ff0; border-bottom:1px solid #ff03">
  <th style="padding:1px 4px">Mode</th>
  <th style="padding:1px 4px">Freq (Hz)</th>
  <th style="padding:1px 4px">Period (s)</th>
  <th style="padding:1px 4px">ω (rad/s)</th>`;
    for (const d of dirs) html += `<th style="padding:1px 4px">${d}</th>`;
    html += `<th style="padding:1px 4px; color:#0ff">ΣUx</th>
  <th style="padding:1px 4px; color:#0ff">ΣUy</th>
  <th style="padding:1px 4px; color:#0ff">ΣRx</th>
  <th style="padding:1px 4px; color:#0ff">ΣRy</th>
  <th style="padding:1px 4px; color:#0ff">ΣRz</th>
  <th style="padding:1px 4px; color:#fff">Tipo</th></tr>`;

    // Reset y armar filas
    for (let d = 0; d < 6; d++) sumP[d] = 0;
    m.frequencies.forEach((freq, i) => {
      const T = freq > 0 ? 1 / freq : 0;
      const omega = freq * 2 * Math.PI;
      const isMF = freq >= 500;   // pseudo-modo rígido = corrección de masa faltante (A)
      const mp = m.massParticipation?.[i] || [0, 0, 0, 0, 0, 0];
      for (let d = 0; d < 6; d++) sumP[d] += mp[d];

      // Clasificar modo: cuál DOF domina (mayor MPF)
      let domDir = 0, domVal = mp[0];
      for (let d = 1; d < 6; d++) if (mp[d] > domVal) { domVal = mp[d]; domDir = d; }
      const tipoLabel = isMF ? "masa faltante (rígida)" : domVal < 0.05 ? "—" : `${dirs[domDir]} (${(domVal * 100).toFixed(0)} %)`;
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

      html += `<tr style="border-bottom:1px solid #fff1; ${isMF ? "background:rgba(0,180,255,0.12);" : rowBg}">
  <td style="padding:1px 4px; text-align:center">${isMF ? "MF" : (i + 1) + (isAt90Both ? " ★" : "")}</td>
  <td style="padding:1px 4px; text-align:right">${isMF ? "rígido" : freq.toFixed(4)}</td>
  <td style="padding:1px 4px; text-align:right">${isMF ? "≈0" : T.toFixed(4)}</td>
  <td style="padding:1px 4px; text-align:right">${isMF ? "—" : omega.toFixed(2)}</td>`;

      for (let d = 0; d < 6; d++) {
        const pct = (mp[d] * 100).toFixed(1);
        const color = mp[d] > 0.5 ? "#f00" : mp[d] > 0.1 ? "#ff0" : "#0f0";
        html += `<td style="padding:1px 4px; text-align:right; color:${color}">${pct}%</td>`;
      }

      const sxColor = sumP[0] >= ASCE_THRESHOLD ? "#0f0" : "#0ff";
      const syColor = sumP[1] >= ASCE_THRESHOLD ? "#0f0" : "#0ff";
      html += `<td style="padding:1px 4px; text-align:right; color:${sxColor}">${(sumP[0] * 100).toFixed(1)}%${isAt90X ? " ✓" : ""}</td>
  <td style="padding:1px 4px; text-align:right; color:${syColor}">${(sumP[1] * 100).toFixed(1)}%${isAt90Y ? " ✓" : ""}</td>
  <td style="padding:1px 4px; text-align:right; color:#0ff">${(sumP[3] * 100).toFixed(1)}%</td>
  <td style="padding:1px 4px; text-align:right; color:#0ff">${(sumP[4] * 100).toFixed(1)}%</td>
  <td style="padding:1px 4px; text-align:right; color:#0ff">${(sumP[5] * 100).toFixed(1)}%</td>
  <td style="padding:1px 4px; color:${tipoColor}">${tipoLabel}</td></tr>`;
    });

    html += `</table>
<div style="margin-top:6px; font-size:10px; color:#888;">
  ★ = primer modo donde ΣUx y ΣUy ≥ 90 %  ·  Tipos: <span style="color:#0f0">Ux/Uy</span>=lateral · <span style="color:#0ff">Rz</span>=torsional · <span style="color:#fa0">Uz</span>=vertical (no relevante para sismo)
</div>`;
    html += "</div>";
    div.innerHTML = html;

    // Tamaño inicial = el de la TABLA (hasta ΣRz y Tipo), no 760 px fijos que la cortaban en Rz.
    // Solo la primera vez: si el usuario ya arrastró la esquina o pulsó «Ancho», se respeta.
    if (!ajustadoATabla && !anchoPrev) {
      ajustadoATabla = true;
      requestAnimationFrame(() => {
        const tabla = div.querySelector("#modal-body table") as HTMLElement | null;
        if (!tabla) return;
        const w = Math.min(tabla.scrollWidth + 36, Math.round(window.innerWidth * 0.96));
        div.style.width = `${Math.max(w, 360)}px`;
        const hTot = div.scrollHeight + 4;
        div.style.height = `${Math.min(hTot, Math.round(window.innerHeight * 0.6))}px`;
      });
    }

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

    // ⤢ Ancho: arrastrar la esquina funciona, pero con 24 modos y 13 columnas
    // lo que uno quiere es la tabla ENTERA de un golpe. Segundo clic la
    // devuelve al tamaño de antes.
    div.querySelector("#modal-wide")?.addEventListener("click", () => {
      const b = div.querySelector("#modal-wide") as HTMLElement;
      if (!anchoPrev) {
        anchoPrev = { w: div.style.width, h: div.style.height,
                      l: div.style.left, t: div.style.top,
                      bo: div.style.bottom, r: div.style.right };
        div.style.width = "96vw"; div.style.height = "88vh";
        div.style.left = "2vw"; div.style.top = "5vh";
        div.style.bottom = "auto"; div.style.right = "auto";
        b.textContent = "⤡ Reducir"; b.title = "Volver al tamaño anterior";
      } else {
        div.style.width = anchoPrev.w; div.style.height = anchoPrev.h;
        div.style.left = anchoPrev.l; div.style.top = anchoPrev.t;
        div.style.bottom = anchoPrev.bo; div.style.right = anchoPrev.r;
        anchoPrev = null;
        b.textContent = "⤢ Ancho"; b.title = "Agrandar la ventana a casi toda la pantalla";
      }
    });

    // ✕ Cerrar. Además de ocultar, avisa al workspace para que el toggle
    // «📋 Mostrar tabla» de Settings se destilde solo: si no, la casilla queda
    // marcada con la tabla cerrada y hay que apagarla y encenderla para que
    // vuelva — el clásico interruptor que miente.
    div.querySelector("#modal-close")?.addEventListener("click", () => {
      div.style.display = "none";
      try { (window as any).__hekatanModalTablaCerrada?.(); } catch { /* standalone */ }
    });

    div.querySelector("#modal-copy")?.addEventListener("click", () => {
      // ── Se copia en TSV, no en ancho fijo ──
      // El formato viejo alineaba con espacios: se lee lindo en un .txt y en
      // Excel cae TODO en una sola columna, que es donde va a parar el 90 % de
      // las veces. Con TAB, Excel/Sheets lo abren en columnas solo.
      // Y los números van SIN el "%" y con punto decimal: con el símbolo Excel
      // los toma como texto y después no se pueden sumar ni graficar.
      const tsv: string[] = [];
      tsv.push(`Modal Analysis\t${config.title}`);
      tsv.push(dictamen.replace(/<[^>]+>/g, "").trim());
      tsv.push("");
      tsv.push(["Modo", "Freq (Hz)", "Periodo (s)", "w (rad/s)",
                ...dirs, "SUx", "SUy", "SRx", "SRy", "SRz", "Tipo"].join("\t"));
      const sp2 = [0, 0, 0, 0, 0, 0];
      const filasHtml: string[] = [];
      m.frequencies.forEach((freq, i) => {
        const T = freq > 0 ? 1 / freq : 0;
        const omega = freq * 2 * Math.PI;
        const mp = m.massParticipation?.[i] || [0, 0, 0, 0, 0, 0];
        for (let d = 0; d < 6; d++) sp2[d] += mp[d];
        let domDir = 0, domVal = mp[0];
        for (let d = 1; d < 6; d++) if (mp[d] > domVal) { domVal = mp[d]; domDir = d; }
        const tipoLabel = domVal < 0.05 ? "—" : `${dirs[domDir]} (${(domVal * 100).toFixed(0)}%)`;
        const celdas = [String(i + 1), freq.toFixed(4), T.toFixed(4), omega.toFixed(2),
                        ...mp.map(v => (v * 100).toFixed(1)),
                        (sp2[0] * 100).toFixed(1), (sp2[1] * 100).toFixed(1),
                        (sp2[3] * 100).toFixed(1), (sp2[4] * 100).toFixed(1),
                        (sp2[5] * 100).toFixed(1), tipoLabel];
        tsv.push(celdas.join("\t"));
        filasHtml.push("<tr>" + celdas.map(c => `<td>${c}</td>`).join("") + "</tr>");
      });
      const texto = tsv.join("\n");
      // Además del TSV se pone una tabla HTML en el portapapeles: pegando en
      // Word o en un correo sale con bordes en vez de un bloque de texto.
      const html2 = `<table border="1" cellspacing="0" cellpadding="3">
<caption>Modal Analysis — ${config.title}</caption>
<tr>${["Modo", "Freq (Hz)", "Periodo (s)", "w (rad/s)", ...dirs, "SUx", "SUy", "SRx", "SRy", "SRz", "Tipo"]
  .map(h => `<th>${h}</th>`).join("")}</tr>
${filasHtml.join("\n")}</table>`;
      const btn = div.querySelector("#modal-copy") as HTMLElement;
      const listo = (ok: boolean) => {
        btn.textContent = ok ? "✓ Copiada" : "✗ no se pudo";
        setTimeout(() => { btn.textContent = "📋 Copiar"; }, 1600);
      };
      (async () => {
        try {
          // `ClipboardItem` no está en todos los navegadores; si falla, TSV pelado.
          if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
            await navigator.clipboard.write([new ClipboardItem({
              "text/plain": new Blob([texto], { type: "text/plain" }),
              "text/html": new Blob([html2], { type: "text/html" }),
            })]);
          } else {
            await navigator.clipboard.writeText(texto);
          }
          listo(true);
        } catch {
          try { await navigator.clipboard.writeText(texto); listo(true); }
          catch { listo(false); }
        }
      })();
    });
  }

  return { div, render };
}
