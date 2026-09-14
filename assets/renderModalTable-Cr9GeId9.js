function H() {
  const t = document.createElement("div");
  t.id = "modal-results", t.style.cssText = `
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
  {
    let s = false, f = 0, u = 0, r = 0, b = 0;
    t.addEventListener("mousedown", (a) => {
      const n = a.target;
      if (!n.closest("#modal-header") || n.closest("button")) return;
      s = true;
      const l = t.getBoundingClientRect();
      f = a.clientX, u = a.clientY, r = l.left, b = l.top, t.style.bottom = "auto", t.style.right = "auto", t.style.left = `${l.left}px`, t.style.top = `${l.top}px`, a.preventDefault();
    }), document.addEventListener("mousemove", (a) => {
      if (!s) return;
      let n = r + (a.clientX - f), l = b + (a.clientY - u);
      n = Math.max(-t.offsetWidth + 80, Math.min(window.innerWidth - 80, n)), l = Math.max(0, Math.min(window.innerHeight - 30, l)), t.style.left = `${n}px`, t.style.top = `${l}px`;
    }), document.addEventListener("mouseup", () => {
      s = false;
    });
  }
  let A = false, L = false, x = null;
  const $ = 0.9;
  function q(s, f) {
    var _a, _b, _c, _d, _e, _f;
    if (!s.frequencies || s.frequencies.length === 0) {
      const e = ((_a = f.properties) == null ? void 0 : _a.length) ? f.properties.map((o) => `<div>${o}</div>`).join("") : "<div>El solver no devolvi\xF3 modos.</div>";
      t.innerHTML = `<div id="modal-header" style="display:flex; align-items:center; justify-content:space-between; padding:8px 12px; cursor:move; user-select:none;" title="Arrastra para mover">
  <b style="color:#ff0">\u2725 \u26A1 MODAL \u2014 ${f.title}</b>
</div>
<div id="modal-body" style="padding:0 12px 10px 12px;">
  <div style="color:#f44; font-weight:bold; font-size:13px; padding:6px 0">\u2717 El an\xE1lisis modal NO se ejecut\xF3</div>
  <div style="color:#fa0; font-size:11px; line-height:1.5">${e}</div>
</div>`;
      return;
    }
    const u = ["Ux", "Uy", "Uz", "Rx", "Ry", "Rz"], r = [0, 0, 0, 0, 0, 0], b = s.frequencies.length;
    let a = -1, n = -1, l = -1, w = 0, S = 0;
    {
      const e = [0, 0, 0, 0, 0, 0];
      for (let o = 0; o < b; o++) {
        const y = ((_b = s.massParticipation) == null ? void 0 : _b[o]) || [0, 0, 0, 0, 0, 0];
        for (let p = 0; p < 6; p++) e[p] += y[p];
        a < 0 && e[0] >= $ && (a = o + 1), n < 0 && e[1] >= $ && (n = o + 1), l < 0 && e[0] >= $ && e[1] >= $ && (l = o + 1);
      }
      w = e[0], S = e[1];
    }
    const N = (() => {
      const e = (o) => `${(($ - o) * 100).toFixed(1)} %`;
      return l > 0 ? `<span style="color:#0f0" title="Masa participativa \u2265 90 % en X e Y (NEC-15 \xA76.2.2 / ASCE 7-22 \xA712.9.1.1)">\u2713 \u2265 90 % en X e Y al modo ${l} de ${b} \xB7 \u03A3Ux ${(w * 100).toFixed(1)} % \xB7 \u03A3Uy ${(S * 100).toFixed(1)} %</span>` : a > 0 && n < 0 ? `<span style="color:#fa0">\u26A0 FALTAN MODOS EN Y \u2014 \u03A3Uy=${(S * 100).toFixed(1)} % en ${b} modos (faltan ${e(S)} para el 90 % que exige NEC-15 \xA76.2.2). X cumple en el modo ${a}. Sub\xED \xABN\xB0 de modos\xBB en Settings \u25B8 \u26A1 Modal + Animaci\xF3n.</span>` : n > 0 && a < 0 ? `<span style="color:#fa0">\u26A0 FALTAN MODOS EN X \u2014 \u03A3Ux=${(w * 100).toFixed(1)} % en ${b} modos (faltan ${e(w)} para el 90 % que exige NEC-15 \xA76.2.2). Y cumple en el modo ${n}. Sub\xED \xABN\xB0 de modos\xBB en Settings \u25B8 \u26A1 Modal + Animaci\xF3n.</span>` : `<span style="color:#f44">\u2717 FALTAN MODOS EN AMBAS DIRECCIONES \u2014 \u03A3Ux=${(w * 100).toFixed(1)} % \xB7 \u03A3Uy=${(S * 100).toFixed(1)} % en ${b} modos. NEC-15 \xA76.2.2 exige \u2265 90 %: el cortante din\xE1mico sale bajo y el control Vdin/Vest no es representativo. Sub\xED \xABN\xB0 de modos\xBB en Settings \u25B8 \u26A1 Modal + Animaci\xF3n.</span>`;
    })(), C = (e, o, y, p, h) => `<button id="${e}" title="${y}" style="padding:3px 9px; font-size:10px;
        cursor:pointer; background:${p}; color:#fff; border:1px solid ${h};
        border-radius:3px; font-family:monospace; white-space:nowrap;">${o}</button>`;
    let c = `<div id="modal-header" style="display:flex; align-items:center; justify-content:space-between; padding:8px 12px; cursor:move; user-select:none;" title="Arrastr\xE1 desde ac\xE1 para mover la ventana">
  <b style="color:#ff0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; min-width:0" title="${f.title}">\u2725 \u26A1 MODAL \u2014 ${f.title}</b>
  <div style="display:flex; gap:4px; margin-left:12px; flex-shrink:0;">
    ${C("modal-copy", "\u{1F4CB} Copiar", "Copiar la tabla al portapapeles \u2014 se pega en Excel en columnas", "#2d6a4f", "#40916c")}
    ${C("modal-wide", "\u2922 Ancho", "Agrandar la ventana a casi toda la pantalla", "#33507a", "#4a6fa5")}
    ${C("modal-minimize", "\u25AC", "Minimizar", "#555", "#777")}
    ${C("modal-close", "\u2715", "Cerrar (se vuelve a abrir con \xAB\u{1F4CB} Mostrar tabla\xBB en Settings)", "#7a3333", "#a54a4a")}
  </div>
</div>`;
    c += '<div id="modal-body" style="padding:0 12px 10px 12px;">', c += `<div style="padding:2px 0 4px 0; font-weight:bold; font-size:11px; line-height:1.4">${N}</div>`, c += `<table style="border-collapse:collapse; color:#0f0; font-size:10px; margin-top:2px; white-space:nowrap">
<tr style="color:#ff0; border-bottom:1px solid #ff03">
  <th style="padding:1px 4px">Mode</th>
  <th style="padding:1px 4px">Freq (Hz)</th>
  <th style="padding:1px 4px">Period (s)</th>
  <th style="padding:1px 4px">\u03C9 (rad/s)</th>`;
    for (const e of u) c += `<th style="padding:1px 4px">${e}</th>`;
    c += `<th style="padding:1px 4px; color:#0ff">\u03A3Ux</th>
  <th style="padding:1px 4px; color:#0ff">\u03A3Uy</th>
  <th style="padding:1px 4px; color:#0ff">\u03A3Rx</th>
  <th style="padding:1px 4px; color:#0ff">\u03A3Ry</th>
  <th style="padding:1px 4px; color:#0ff">\u03A3Rz</th>
  <th style="padding:1px 4px; color:#fff">Tipo</th></tr>`;
    for (let e = 0; e < 6; e++) r[e] = 0;
    if (s.frequencies.forEach((e, o) => {
      var _a2;
      const y = e > 0 ? 1 / e : 0, p = e * 2 * Math.PI, h = e >= 500, m = ((_a2 = s.massParticipation) == null ? void 0 : _a2[o]) || [0, 0, 0, 0, 0, 0];
      for (let i = 0; i < 6; i++) r[i] += m[i];
      let g = 0, d = m[0];
      for (let i = 1; i < 6; i++) m[i] > d && (d = m[i], g = i);
      const z = h ? "masa faltante (r\xEDgida)" : d < 0.05 ? "\u2014" : `${u[g]} (${(d * 100).toFixed(0)} %)`, R = g === 0 || g === 1 ? "#0f0" : g === 5 ? "#0ff" : g === 2 ? "#fa0" : "#888", E = o + 1 === a, v = o + 1 === n, F = o + 1 === l;
      c += `<tr style="border-bottom:1px solid #fff1; ${h ? "background:rgba(0,180,255,0.12);" : F ? "background:rgba(0,255,0,0.12);" : E || v ? "background:rgba(255,200,0,0.1);" : ""}">
  <td style="padding:1px 4px; text-align:center">${h ? "MF" : o + 1 + (F ? " \u2605" : "")}</td>
  <td style="padding:1px 4px; text-align:right">${h ? "r\xEDgido" : e.toFixed(4)}</td>
  <td style="padding:1px 4px; text-align:right">${h ? "\u22480" : y.toFixed(4)}</td>
  <td style="padding:1px 4px; text-align:right">${h ? "\u2014" : p.toFixed(2)}</td>`;
      for (let i = 0; i < 6; i++) {
        const j = (m[i] * 100).toFixed(1), k = m[i] > 0.5 ? "#f00" : m[i] > 0.1 ? "#ff0" : "#0f0";
        c += `<td style="padding:1px 4px; text-align:right; color:${k}">${j}%</td>`;
      }
      const T = r[0] >= $ ? "#0f0" : "#0ff", U = r[1] >= $ ? "#0f0" : "#0ff";
      c += `<td style="padding:1px 4px; text-align:right; color:${T}">${(r[0] * 100).toFixed(1)}%${E ? " \u2713" : ""}</td>
  <td style="padding:1px 4px; text-align:right; color:${U}">${(r[1] * 100).toFixed(1)}%${v ? " \u2713" : ""}</td>
  <td style="padding:1px 4px; text-align:right; color:#0ff">${(r[3] * 100).toFixed(1)}%</td>
  <td style="padding:1px 4px; text-align:right; color:#0ff">${(r[4] * 100).toFixed(1)}%</td>
  <td style="padding:1px 4px; text-align:right; color:#0ff">${(r[5] * 100).toFixed(1)}%</td>
  <td style="padding:1px 4px; color:${R}">${z}</td></tr>`;
    }), c += `</table>
<div style="margin-top:6px; font-size:10px; color:#888;">
  \u2605 = primer modo donde \u03A3Ux y \u03A3Uy \u2265 90 %  \xB7  Tipos: <span style="color:#0f0">Ux/Uy</span>=lateral \xB7 <span style="color:#0ff">Rz</span>=torsional \xB7 <span style="color:#fa0">Uz</span>=vertical (no relevante para sismo)
</div>`, c += "</div>", t.innerHTML = c, !L && !x && (L = true, requestAnimationFrame(() => {
      const e = t.querySelector("#modal-body table");
      if (!e) return;
      const o = Math.min(e.scrollWidth + 36, Math.round(window.innerWidth * 0.96));
      t.style.width = `${Math.max(o, 360)}px`;
      const y = t.scrollHeight + 4;
      t.style.height = `${Math.min(y, Math.round(window.innerHeight * 0.6))}px`;
    })), A) {
      const e = t.querySelector("#modal-body"), o = t.querySelector("#modal-minimize");
      e && (e.style.display = "none"), o && (o.textContent = "\u25A2", o.title = "Restaurar");
    }
    (_c = t.querySelector("#modal-minimize")) == null ? void 0 : _c.addEventListener("click", () => {
      A = !A;
      const e = t.querySelector("#modal-body"), o = t.querySelector("#modal-minimize");
      A ? (e.style.display = "none", o.textContent = "\u25A2", o.title = "Restaurar") : (e.style.display = "block", o.textContent = "\u25AC", o.title = "Minimizar");
    }), (_d = t.querySelector("#modal-wide")) == null ? void 0 : _d.addEventListener("click", () => {
      const e = t.querySelector("#modal-wide");
      x ? (t.style.width = x.w, t.style.height = x.h, t.style.left = x.l, t.style.top = x.t, t.style.bottom = x.bo, t.style.right = x.r, x = null, e.textContent = "\u2922 Ancho", e.title = "Agrandar la ventana a casi toda la pantalla") : (x = { w: t.style.width, h: t.style.height, l: t.style.left, t: t.style.top, bo: t.style.bottom, r: t.style.right }, t.style.width = "96vw", t.style.height = "88vh", t.style.left = "2vw", t.style.top = "5vh", t.style.bottom = "auto", t.style.right = "auto", e.textContent = "\u2921 Reducir", e.title = "Volver al tama\xF1o anterior");
    }), (_e = t.querySelector("#modal-close")) == null ? void 0 : _e.addEventListener("click", () => {
      var _a2;
      t.style.display = "none";
      try {
        (_a2 = window.__hekatanModalTablaCerrada) == null ? void 0 : _a2.call(window);
      } catch {
      }
    }), (_f = t.querySelector("#modal-copy")) == null ? void 0 : _f.addEventListener("click", () => {
      const e = [];
      e.push(`Modal Analysis	${f.title}`), e.push(N.replace(/<[^>]+>/g, "").trim()), e.push(""), e.push(["Modo", "Freq (Hz)", "Periodo (s)", "w (rad/s)", ...u, "SUx", "SUy", "SRx", "SRy", "SRz", "Tipo"].join("	"));
      const o = [0, 0, 0, 0, 0, 0], y = [];
      s.frequencies.forEach((d, z) => {
        var _a2;
        const R = d > 0 ? 1 / d : 0, E = d * 2 * Math.PI, v = ((_a2 = s.massParticipation) == null ? void 0 : _a2[z]) || [0, 0, 0, 0, 0, 0];
        for (let i = 0; i < 6; i++) o[i] += v[i];
        let F = 0, M = v[0];
        for (let i = 1; i < 6; i++) v[i] > M && (M = v[i], F = i);
        const T = M < 0.05 ? "\u2014" : `${u[F]} (${(M * 100).toFixed(0)}%)`, U = [String(z + 1), d.toFixed(4), R.toFixed(4), E.toFixed(2), ...v.map((i) => (i * 100).toFixed(1)), (o[0] * 100).toFixed(1), (o[1] * 100).toFixed(1), (o[3] * 100).toFixed(1), (o[4] * 100).toFixed(1), (o[5] * 100).toFixed(1), T];
        e.push(U.join("	")), y.push("<tr>" + U.map((i) => `<td>${i}</td>`).join("") + "</tr>");
      });
      const p = e.join(`
`), h = `<table border="1" cellspacing="0" cellpadding="3">
<caption>Modal Analysis \u2014 ${f.title}</caption>
<tr>${["Modo", "Freq (Hz)", "Periodo (s)", "w (rad/s)", ...u, "SUx", "SUy", "SRx", "SRy", "SRz", "Tipo"].map((d) => `<th>${d}</th>`).join("")}</tr>
${y.join(`
`)}</table>`, m = t.querySelector("#modal-copy"), g = (d) => {
        m.textContent = d ? "\u2713 Copiada" : "\u2717 no se pudo", setTimeout(() => {
          m.textContent = "\u{1F4CB} Copiar";
        }, 1600);
      };
      (async () => {
        var _a2;
        try {
          typeof ClipboardItem < "u" && ((_a2 = navigator.clipboard) == null ? void 0 : _a2.write) ? await navigator.clipboard.write([new ClipboardItem({ "text/plain": new Blob([p], { type: "text/plain" }), "text/html": new Blob([h], { type: "text/html" }) })]) : await navigator.clipboard.writeText(p), g(true);
        } catch {
          try {
            await navigator.clipboard.writeText(p), g(true);
          } catch {
            g(false);
          }
        }
      })();
    });
  }
  return { div: t, render: q };
}
export {
  H as c
};
