function k() {
  const e = document.createElement("div");
  e.id = "modal-results", e.style.cssText = `
    position: fixed; bottom: 10px; left: 10px; z-index: 9999;
    background: rgba(0,0,0,0.92); color: #0f0; font-family: monospace;
    font-size: 12px; border-radius: 6px;
    width: 760px; height: 60vh;
    max-width: 96vw; max-height: 92vh;
    overflow-x: auto; overflow-y: auto;
    pointer-events: auto;
    border: 1px solid #0f03;
    resize: both;
    min-width: 360px; min-height: 160px;
  `;
  {
    let s = false, g = 0, h = 0, r = 0, u = 0;
    e.addEventListener("mousedown", (a) => {
      const n = a.target;
      if (!n.closest("#modal-header") || n.closest("button")) return;
      s = true;
      const l = e.getBoundingClientRect();
      g = a.clientX, h = a.clientY, r = l.left, u = l.top, e.style.bottom = "auto", e.style.right = "auto", e.style.left = `${l.left}px`, e.style.top = `${l.top}px`, a.preventDefault();
    }), document.addEventListener("mousemove", (a) => {
      if (!s) return;
      let n = r + (a.clientX - g), l = u + (a.clientY - h);
      n = Math.max(-e.offsetWidth + 80, Math.min(window.innerWidth - 80, n)), l = Math.max(0, Math.min(window.innerHeight - 30, l)), e.style.left = `${n}px`, e.style.top = `${l}px`;
    }), document.addEventListener("mouseup", () => {
      s = false;
    });
  }
  let M = false, m = null;
  const $ = 0.9;
  function T(s, g) {
    var _a, _b, _c, _d, _e, _f;
    if (!s.frequencies || s.frequencies.length === 0) {
      const t = ((_a = g.properties) == null ? void 0 : _a.length) ? g.properties.map((o) => `<div>${o}</div>`).join("") : "<div>El solver no devolvi\xF3 modos.</div>";
      e.innerHTML = `<div id="modal-header" style="display:flex; align-items:center; justify-content:space-between; padding:8px 12px; cursor:move; user-select:none;" title="Arrastra para mover">
  <b style="color:#ff0">\u2725 \u26A1 MODAL \u2014 ${g.title}</b>
</div>
<div id="modal-body" style="padding:0 12px 10px 12px;">
  <div style="color:#f44; font-weight:bold; font-size:13px; padding:6px 0">\u2717 El an\xE1lisis modal NO se ejecut\xF3</div>
  <div style="color:#fa0; font-size:11px; line-height:1.5">${t}</div>
</div>`;
      return;
    }
    const h = ["Ux", "Uy", "Uz", "Rx", "Ry", "Rz"], r = [0, 0, 0, 0, 0, 0], u = s.frequencies.length;
    let a = -1, n = -1, l = -1, w = 0, S = 0;
    {
      const t = [0, 0, 0, 0, 0, 0];
      for (let o = 0; o < u; o++) {
        const b = ((_b = s.massParticipation) == null ? void 0 : _b[o]) || [0, 0, 0, 0, 0, 0];
        for (let p = 0; p < 6; p++) t[p] += b[p];
        a < 0 && t[0] >= $ && (a = o + 1), n < 0 && t[1] >= $ && (n = o + 1), l < 0 && t[0] >= $ && t[1] >= $ && (l = o + 1);
      }
      w = t[0], S = t[1];
    }
    const N = (() => {
      const t = (o) => `${(($ - o) * 100).toFixed(1)} %`;
      return l > 0 ? `<span style="color:#0f0">\u2713 Masa participativa \u2265 90 % en X e Y al modo ${l} de ${u} \xB7 \u03A3Ux=${(w * 100).toFixed(1)} % \u03A3Uy=${(S * 100).toFixed(1)} % (NEC-15 \xA76.2.2 / ASCE 7-22 \xA712.9.1.1)</span>` : a > 0 && n < 0 ? `<span style="color:#fa0">\u26A0 FALTAN MODOS EN Y \u2014 \u03A3Uy=${(S * 100).toFixed(1)} % en ${u} modos (faltan ${t(S)} para el 90 % que exige NEC-15 \xA76.2.2). X cumple en el modo ${a}. Sub\xED \xABN\xB0 de modos\xBB en Settings \u25B8 \u26A1 Modal + Animaci\xF3n.</span>` : n > 0 && a < 0 ? `<span style="color:#fa0">\u26A0 FALTAN MODOS EN X \u2014 \u03A3Ux=${(w * 100).toFixed(1)} % en ${u} modos (faltan ${t(w)} para el 90 % que exige NEC-15 \xA76.2.2). Y cumple en el modo ${n}. Sub\xED \xABN\xB0 de modos\xBB en Settings \u25B8 \u26A1 Modal + Animaci\xF3n.</span>` : `<span style="color:#f44">\u2717 FALTAN MODOS EN AMBAS DIRECCIONES \u2014 \u03A3Ux=${(w * 100).toFixed(1)} % \xB7 \u03A3Uy=${(S * 100).toFixed(1)} % en ${u} modos. NEC-15 \xA76.2.2 exige \u2265 90 %: el cortante din\xE1mico sale bajo y el control Vdin/Vest no es representativo. Sub\xED \xABN\xB0 de modos\xBB en Settings \u25B8 \u26A1 Modal + Animaci\xF3n.</span>`;
    })(), C = (t, o, b, p, x) => `<button id="${t}" title="${b}" style="padding:3px 9px; font-size:10px;
        cursor:pointer; background:${p}; color:#fff; border:1px solid ${x};
        border-radius:3px; font-family:monospace; white-space:nowrap;">${o}</button>`;
    let c = `<div id="modal-header" style="display:flex; align-items:center; justify-content:space-between; padding:8px 12px; cursor:move; user-select:none;" title="Arrastr\xE1 desde ac\xE1 para mover la ventana">
  <b style="color:#ff0">\u2725 \u26A1 MODAL ANALYSIS \u2014 ${g.title}</b>
  <div style="display:flex; gap:4px; margin-left:12px;">
    ${C("modal-copy", "\u{1F4CB} Copiar", "Copiar la tabla al portapapeles \u2014 se pega en Excel en columnas", "#2d6a4f", "#40916c")}
    ${C("modal-wide", "\u2922 Ancho", "Agrandar la ventana a casi toda la pantalla", "#33507a", "#4a6fa5")}
    ${C("modal-minimize", "\u25AC", "Minimizar", "#555", "#777")}
    ${C("modal-close", "\u2715", "Cerrar (se vuelve a abrir con \xAB\u{1F4CB} Mostrar tabla\xBB en Settings)", "#7a3333", "#a54a4a")}
  </div>
</div>`;
    c += '<div id="modal-body" style="padding:0 12px 10px 12px;">', c += `<div style="padding:6px 0; font-weight:bold; font-size:12px; line-height:1.4">${N}</div>`, c += `<table style="border-collapse:collapse; color:#0f0; font-size:11px; margin-top:4px">
<tr style="color:#ff0; border-bottom:1px solid #ff03">
  <th style="padding:2px 6px">Mode</th>
  <th style="padding:2px 6px">Freq (Hz)</th>
  <th style="padding:2px 6px">Period (s)</th>
  <th style="padding:2px 6px">\u03C9 (rad/s)</th>`;
    for (const t of h) c += `<th style="padding:2px 5px">${t}</th>`;
    c += `<th style="padding:2px 5px; color:#0ff">\u03A3Ux</th>
  <th style="padding:2px 5px; color:#0ff">\u03A3Uy</th>
  <th style="padding:2px 5px; color:#0ff">\u03A3Rx</th>
  <th style="padding:2px 5px; color:#0ff">\u03A3Ry</th>
  <th style="padding:2px 5px; color:#0ff">\u03A3Rz</th>
  <th style="padding:2px 5px; color:#fff">Tipo</th></tr>`;
    for (let t = 0; t < 6; t++) r[t] = 0;
    if (s.frequencies.forEach((t, o) => {
      var _a2;
      const b = t > 0 ? 1 / t : 0, p = t * 2 * Math.PI, x = t >= 500, f = ((_a2 = s.massParticipation) == null ? void 0 : _a2[o]) || [0, 0, 0, 0, 0, 0];
      for (let i = 0; i < 6; i++) r[i] += f[i];
      let y = 0, d = f[0];
      for (let i = 1; i < 6; i++) f[i] > d && (d = f[i], y = i);
      const z = x ? "masa faltante (r\xEDgida)" : d < 0.05 ? "\u2014" : `${h[y]} (${(d * 100).toFixed(0)} %)`, R = y === 0 || y === 1 ? "#0f0" : y === 5 ? "#0ff" : y === 2 ? "#fa0" : "#888", E = o + 1 === a, v = o + 1 === n, F = o + 1 === l;
      c += `<tr style="border-bottom:1px solid #fff1; ${x ? "background:rgba(0,180,255,0.12);" : F ? "background:rgba(0,255,0,0.12);" : E || v ? "background:rgba(255,200,0,0.1);" : ""}">
  <td style="padding:2px 6px; text-align:center">${x ? "MF" : o + 1 + (F ? " \u2605" : "")}</td>
  <td style="padding:2px 6px; text-align:right">${x ? "r\xEDgido" : t.toFixed(4)}</td>
  <td style="padding:2px 6px; text-align:right">${x ? "\u22480" : b.toFixed(4)}</td>
  <td style="padding:2px 6px; text-align:right">${x ? "\u2014" : p.toFixed(2)}</td>`;
      for (let i = 0; i < 6; i++) {
        const q = (f[i] * 100).toFixed(1), j = f[i] > 0.5 ? "#f00" : f[i] > 0.1 ? "#ff0" : "#0f0";
        c += `<td style="padding:2px 5px; text-align:right; color:${j}">${q}%</td>`;
      }
      const L = r[0] >= $ ? "#0f0" : "#0ff", U = r[1] >= $ ? "#0f0" : "#0ff";
      c += `<td style="padding:2px 5px; text-align:right; color:${L}">${(r[0] * 100).toFixed(1)}%${E ? " \u2713" : ""}</td>
  <td style="padding:2px 5px; text-align:right; color:${U}">${(r[1] * 100).toFixed(1)}%${v ? " \u2713" : ""}</td>
  <td style="padding:2px 5px; text-align:right; color:#0ff">${(r[3] * 100).toFixed(1)}%</td>
  <td style="padding:2px 5px; text-align:right; color:#0ff">${(r[4] * 100).toFixed(1)}%</td>
  <td style="padding:2px 5px; text-align:right; color:#0ff">${(r[5] * 100).toFixed(1)}%</td>
  <td style="padding:2px 5px; color:${R}">${z}</td></tr>`;
    }), c += `</table>
<div style="margin-top:6px; font-size:10px; color:#888;">
  \u2605 = primer modo donde \u03A3Ux y \u03A3Uy \u2265 90 %  \xB7  Tipos: <span style="color:#0f0">Ux/Uy</span>=lateral \xB7 <span style="color:#0ff">Rz</span>=torsional \xB7 <span style="color:#fa0">Uz</span>=vertical (no relevante para sismo)
</div>`, c += "</div>", e.innerHTML = c, M) {
      const t = e.querySelector("#modal-body"), o = e.querySelector("#modal-minimize");
      t && (t.style.display = "none"), o && (o.textContent = "\u25A2", o.title = "Restaurar");
    }
    (_c = e.querySelector("#modal-minimize")) == null ? void 0 : _c.addEventListener("click", () => {
      M = !M;
      const t = e.querySelector("#modal-body"), o = e.querySelector("#modal-minimize");
      M ? (t.style.display = "none", o.textContent = "\u25A2", o.title = "Restaurar") : (t.style.display = "block", o.textContent = "\u25AC", o.title = "Minimizar");
    }), (_d = e.querySelector("#modal-wide")) == null ? void 0 : _d.addEventListener("click", () => {
      const t = e.querySelector("#modal-wide");
      m ? (e.style.width = m.w, e.style.height = m.h, e.style.left = m.l, e.style.top = m.t, e.style.bottom = m.bo, e.style.right = m.r, m = null, t.textContent = "\u2922 Ancho", t.title = "Agrandar la ventana a casi toda la pantalla") : (m = { w: e.style.width, h: e.style.height, l: e.style.left, t: e.style.top, bo: e.style.bottom, r: e.style.right }, e.style.width = "96vw", e.style.height = "88vh", e.style.left = "2vw", e.style.top = "5vh", e.style.bottom = "auto", e.style.right = "auto", t.textContent = "\u2921 Reducir", t.title = "Volver al tama\xF1o anterior");
    }), (_e = e.querySelector("#modal-close")) == null ? void 0 : _e.addEventListener("click", () => {
      var _a2;
      e.style.display = "none";
      try {
        (_a2 = window.__hekatanModalTablaCerrada) == null ? void 0 : _a2.call(window);
      } catch {
      }
    }), (_f = e.querySelector("#modal-copy")) == null ? void 0 : _f.addEventListener("click", () => {
      const t = [];
      t.push(`Modal Analysis	${g.title}`), t.push(N.replace(/<[^>]+>/g, "").trim()), t.push(""), t.push(["Modo", "Freq (Hz)", "Periodo (s)", "w (rad/s)", ...h, "SUx", "SUy", "SRx", "SRy", "SRz", "Tipo"].join("	"));
      const o = [0, 0, 0, 0, 0, 0], b = [];
      s.frequencies.forEach((d, z) => {
        var _a2;
        const R = d > 0 ? 1 / d : 0, E = d * 2 * Math.PI, v = ((_a2 = s.massParticipation) == null ? void 0 : _a2[z]) || [0, 0, 0, 0, 0, 0];
        for (let i = 0; i < 6; i++) o[i] += v[i];
        let F = 0, A = v[0];
        for (let i = 1; i < 6; i++) v[i] > A && (A = v[i], F = i);
        const L = A < 0.05 ? "\u2014" : `${h[F]} (${(A * 100).toFixed(0)}%)`, U = [String(z + 1), d.toFixed(4), R.toFixed(4), E.toFixed(2), ...v.map((i) => (i * 100).toFixed(1)), (o[0] * 100).toFixed(1), (o[1] * 100).toFixed(1), (o[3] * 100).toFixed(1), (o[4] * 100).toFixed(1), (o[5] * 100).toFixed(1), L];
        t.push(U.join("	")), b.push("<tr>" + U.map((i) => `<td>${i}</td>`).join("") + "</tr>");
      });
      const p = t.join(`
`), x = `<table border="1" cellspacing="0" cellpadding="3">
<caption>Modal Analysis \u2014 ${g.title}</caption>
<tr>${["Modo", "Freq (Hz)", "Periodo (s)", "w (rad/s)", ...h, "SUx", "SUy", "SRx", "SRy", "SRz", "Tipo"].map((d) => `<th>${d}</th>`).join("")}</tr>
${b.join(`
`)}</table>`, f = e.querySelector("#modal-copy"), y = (d) => {
        f.textContent = d ? "\u2713 Copiada" : "\u2717 no se pudo", setTimeout(() => {
          f.textContent = "\u{1F4CB} Copiar";
        }, 1600);
      };
      (async () => {
        var _a2;
        try {
          typeof ClipboardItem < "u" && ((_a2 = navigator.clipboard) == null ? void 0 : _a2.write) ? await navigator.clipboard.write([new ClipboardItem({ "text/plain": new Blob([p], { type: "text/plain" }), "text/html": new Blob([x], { type: "text/html" }) })]) : await navigator.clipboard.writeText(p), y(true);
        } catch {
          try {
            await navigator.clipboard.writeText(p), y(true);
          } catch {
            y(false);
          }
        }
      })();
    });
  }
  return { div: e, render: T };
}
export {
  k as c
};
