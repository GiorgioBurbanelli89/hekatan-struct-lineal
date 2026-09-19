function D() {
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
    let l = false, p = 0, f = 0, d = 0, c = 0;
    t.addEventListener("mousedown", (n) => {
      const a = n.target;
      if (!a.closest("#modal-header") || a.closest("button")) return;
      l = true;
      const r = t.getBoundingClientRect();
      p = n.clientX, f = n.clientY, d = r.left, c = r.top, t.style.bottom = "auto", t.style.right = "auto", t.style.left = `${r.left}px`, t.style.top = `${r.top}px`, n.preventDefault();
    }), document.addEventListener("mousemove", (n) => {
      if (!l) return;
      let a = d + (n.clientX - p), r = c + (n.clientY - f);
      a = Math.max(-t.offsetWidth + 80, Math.min(window.innerWidth - 80, a)), r = Math.max(0, Math.min(window.innerHeight - 30, r)), t.style.left = `${a}px`, t.style.top = `${r}px`;
    }), document.addEventListener("mouseup", () => {
      l = false;
    });
  }
  let v = false, M = false, s = null;
  const m = 0.9;
  function S(l, p) {
    var _a, _b, _c, _d, _e, _f;
    if (!l.frequencies || l.frequencies.length === 0) {
      const e = ((_a = p.properties) == null ? void 0 : _a.length) ? p.properties.map((o) => `<div>${o}</div>`).join("") : "<div>El solver no devolvi\xF3 modos.</div>";
      t.innerHTML = `<div id="modal-header" style="display:flex; align-items:center; justify-content:space-between; padding:8px 12px; cursor:move; user-select:none;" title="Arrastra para mover">
  <b style="color:#ff0">\u2725 \u26A1 MODAL \u2014 ${p.title}</b>
</div>
<div id="modal-body" style="padding:0 12px 10px 12px;">
  <div style="color:#f44; font-weight:bold; font-size:13px; padding:6px 0">\u2717 El an\xE1lisis modal NO se ejecut\xF3</div>
  <div style="color:#fa0; font-size:11px; line-height:1.5">${e}</div>
</div>`;
      return;
    }
    const f = ["Ux", "Uy", "Uz", "Rx", "Ry", "Rz"], d = [0, 0, 0, 0, 0, 0], c = l.frequencies.length;
    let n = -1, a = -1, r = -1, F = 0, A = 0;
    {
      const e = [0, 0, 0, 0, 0, 0];
      for (let o = 0; o < c; o++) {
        const $ = ((_b = l.massParticipation) == null ? void 0 : _b[o]) || [0, 0, 0, 0, 0, 0];
        for (let y = 0; y < 6; y++) e[y] += $[y];
        n < 0 && e[0] >= m && (n = o + 1), a < 0 && e[1] >= m && (a = o + 1), r < 0 && e[0] >= m && e[1] >= m && (r = o + 1);
      }
      F = e[0], A = e[1];
    }
    const q = (() => {
      const e = (o) => `${((m - o) * 100).toFixed(1)} %`;
      return r > 0 ? `<span style="color:#0f0" title="Masa participativa \u2265 90 % en X e Y (NEC-15 \xA76.2.2 / ASCE 7-22 \xA712.9.1.1)">\u2713 \u2265 90 % en X e Y al modo ${r} de ${c} \xB7 \u03A3Ux ${(F * 100).toFixed(1)} % \xB7 \u03A3Uy ${(A * 100).toFixed(1)} %</span>` : n > 0 && a < 0 ? `<span style="color:#fa0">\u26A0 FALTAN MODOS EN Y \u2014 \u03A3Uy=${(A * 100).toFixed(1)} % en ${c} modos (faltan ${e(A)} para el 90 % que exige NEC-15 \xA76.2.2). X cumple en el modo ${n}. Sub\xED \xABN\xB0 de modos\xBB en Settings \u25B8 \u26A1 Modal + Animaci\xF3n.</span>` : a > 0 && n < 0 ? `<span style="color:#fa0">\u26A0 FALTAN MODOS EN X \u2014 \u03A3Ux=${(F * 100).toFixed(1)} % en ${c} modos (faltan ${e(F)} para el 90 % que exige NEC-15 \xA76.2.2). Y cumple en el modo ${a}. Sub\xED \xABN\xB0 de modos\xBB en Settings \u25B8 \u26A1 Modal + Animaci\xF3n.</span>` : `<span style="color:#f44">\u2717 FALTAN MODOS EN AMBAS DIRECCIONES \u2014 \u03A3Ux=${(F * 100).toFixed(1)} % \xB7 \u03A3Uy=${(A * 100).toFixed(1)} % en ${c} modos. NEC-15 \xA76.2.2 exige \u2265 90 %: el cortante din\xE1mico sale bajo y el control Vdin/Vest no es representativo. Sub\xED \xABN\xB0 de modos\xBB en Settings \u25B8 \u26A1 Modal + Animaci\xF3n.</span>`;
    })(), E = (e, o, $, y, g) => `<button id="${e}" title="${$}" style="padding:3px 9px; font-size:10px;
        cursor:pointer; background:${y}; color:#fff; border:1px solid ${g};
        border-radius:3px; font-family:monospace; white-space:nowrap;">${o}</button>`;
    let h = `<div id="modal-header" style="display:flex; align-items:center; justify-content:space-between; padding:8px 12px; cursor:move; user-select:none;" title="Arrastr\xE1 desde ac\xE1 para mover la ventana">
  <b style="color:#ff0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; min-width:0" title="${p.title}">\u2725 \u26A1 MODAL \u2014 ${p.title}</b>
  <div style="display:flex; gap:4px; margin-left:12px; flex-shrink:0;">
    ${E("modal-copy", "\u{1F4CB} Copiar", "Copiar la tabla al portapapeles \u2014 se pega en Excel en columnas", "#2d6a4f", "#40916c")}
    ${E("modal-wide", "\u2922 Ancho", "Agrandar la ventana a casi toda la pantalla", "#33507a", "#4a6fa5")}
    ${E("modal-minimize", "\u25AC", "Minimizar", "#555", "#777")}
    ${E("modal-close", "\u2715", "Cerrar (se vuelve a abrir con \xAB\u{1F4CB} Mostrar tabla\xBB en Settings)", "#7a3333", "#a54a4a")}
  </div>
</div>`;
    h += '<div id="modal-body" style="padding:0 12px 10px 12px;">', h += `<div style="padding:2px 0 4px 0; font-weight:bold; font-size:11px; line-height:1.4; width:0; min-width:100%">${q}</div>`, h += `<table style="border-collapse:collapse; color:#0f0; font-size:10px; margin-top:2px; white-space:nowrap">
<tr style="color:#ff0; border-bottom:1px solid #ff03">
  <th style="padding:1px 4px">Mode</th>
  <th style="padding:1px 4px">Freq (Hz)</th>
  <th style="padding:1px 4px">Period (s)</th>
  <th style="padding:1px 4px">\u03C9 (rad/s)</th>`;
    for (const e of f) h += `<th style="padding:1px 4px">${e}</th>`;
    h += `<th style="padding:1px 4px; color:#0ff">\u03A3Ux</th>
  <th style="padding:1px 4px; color:#0ff">\u03A3Uy</th>
  <th style="padding:1px 4px; color:#0ff">\u03A3Rx</th>
  <th style="padding:1px 4px; color:#0ff">\u03A3Ry</th>
  <th style="padding:1px 4px; color:#0ff">\u03A3Rz</th>
  <th style="padding:1px 4px; color:#fff">Tipo</th></tr>`;
    for (let e = 0; e < 6; e++) d[e] = 0;
    if (l.frequencies.forEach((e, o) => {
      var _a2;
      const $ = e > 0 ? 1 / e : 0, y = e * 2 * Math.PI, g = e >= 500, u = ((_a2 = l.massParticipation) == null ? void 0 : _a2[o]) || [0, 0, 0, 0, 0, 0];
      for (let i = 0; i < 6; i++) d[i] += u[i];
      let b = 0, x = u[0];
      for (let i = 1; i < 6; i++) u[i] > x && (x = u[i], b = i);
      const R = g ? "masa faltante (r\xEDgida)" : x < 0.05 ? "\u2014" : `${f[b]} (${(x * 100).toFixed(0)} %)`, L = b === 0 || b === 1 ? "#0f0" : b === 5 ? "#0ff" : b === 2 ? "#fa0" : "#888", U = o + 1 === n, w = o + 1 === a, z = o + 1 === r;
      h += `<tr style="border-bottom:1px solid #fff1; ${g ? "background:rgba(0,180,255,0.12);" : z ? "background:rgba(0,255,0,0.12);" : U || w ? "background:rgba(255,200,0,0.1);" : ""}">
  <td style="padding:1px 4px; text-align:center">${g ? "MF" : o + 1 + (z ? " \u2605" : "")}</td>
  <td style="padding:1px 4px; text-align:right">${g ? "r\xEDgido" : e.toFixed(4)}</td>
  <td style="padding:1px 4px; text-align:right">${g ? "\u22480" : $.toFixed(4)}</td>
  <td style="padding:1px 4px; text-align:right">${g ? "\u2014" : y.toFixed(2)}</td>`;
      for (let i = 0; i < 6; i++) {
        const j = (u[i] * 100).toFixed(1), k = u[i] > 0.5 ? "#f00" : u[i] > 0.1 ? "#ff0" : "#0f0";
        h += `<td style="padding:1px 4px; text-align:right; color:${k}">${j}%</td>`;
      }
      const N = d[0] >= m ? "#0f0" : "#0ff", T = d[1] >= m ? "#0f0" : "#0ff";
      h += `<td style="padding:1px 4px; text-align:right; color:${N}">${(d[0] * 100).toFixed(1)}%${U ? " \u2713" : ""}</td>
  <td style="padding:1px 4px; text-align:right; color:${T}">${(d[1] * 100).toFixed(1)}%${w ? " \u2713" : ""}</td>
  <td style="padding:1px 4px; text-align:right; color:#0ff">${(d[3] * 100).toFixed(1)}%</td>
  <td style="padding:1px 4px; text-align:right; color:#0ff">${(d[4] * 100).toFixed(1)}%</td>
  <td style="padding:1px 4px; text-align:right; color:#0ff">${(d[5] * 100).toFixed(1)}%</td>
  <td style="padding:1px 4px; color:${L}">${R}</td></tr>`;
    }), h += `</table>
<div style="margin-top:6px; font-size:10px; color:#888;">
  \u2605 = primer modo donde \u03A3Ux y \u03A3Uy \u2265 90 %  \xB7  Tipos: <span style="color:#0f0">Ux/Uy</span>=lateral \xB7 <span style="color:#0ff">Rz</span>=torsional \xB7 <span style="color:#fa0">Uz</span>=vertical (no relevante para sismo)
</div>`, h += "</div>", t.innerHTML = h, !M && !s && (M = true, t.style.width = "max-content", t.style.height = "auto"), v) {
      const e = t.querySelector("#modal-body"), o = t.querySelector("#modal-minimize");
      e && (e.style.display = "none"), o && (o.textContent = "\u25A2", o.title = "Restaurar");
    }
    (_c = t.querySelector("#modal-minimize")) == null ? void 0 : _c.addEventListener("click", () => {
      v = !v;
      const e = t.querySelector("#modal-body"), o = t.querySelector("#modal-minimize");
      v ? (e.style.display = "none", o.textContent = "\u25A2", o.title = "Restaurar") : (e.style.display = "block", o.textContent = "\u25AC", o.title = "Minimizar");
    }), (_d = t.querySelector("#modal-wide")) == null ? void 0 : _d.addEventListener("click", () => {
      const e = t.querySelector("#modal-wide");
      s ? (t.style.width = s.w, t.style.height = s.h, t.style.left = s.l, t.style.top = s.t, t.style.bottom = s.bo, t.style.right = s.r, s = null, e.textContent = "\u2922 Ancho", e.title = "Agrandar la ventana a casi toda la pantalla") : (s = { w: t.style.width, h: t.style.height, l: t.style.left, t: t.style.top, bo: t.style.bottom, r: t.style.right }, t.style.width = "96vw", t.style.height = "88vh", t.style.left = "2vw", t.style.top = "5vh", t.style.bottom = "auto", t.style.right = "auto", e.textContent = "\u2921 Reducir", e.title = "Volver al tama\xF1o anterior");
    }), (_e = t.querySelector("#modal-close")) == null ? void 0 : _e.addEventListener("click", () => {
      var _a2;
      t.style.display = "none";
      try {
        (_a2 = window.__hekatanModalTablaCerrada) == null ? void 0 : _a2.call(window);
      } catch {
      }
    }), (_f = t.querySelector("#modal-copy")) == null ? void 0 : _f.addEventListener("click", () => {
      const e = [];
      e.push(`Modal Analysis	${p.title}`), e.push(q.replace(/<[^>]+>/g, "").trim()), e.push(""), e.push(["Modo", "Freq (Hz)", "Periodo (s)", "w (rad/s)", ...f, "SUx", "SUy", "SRx", "SRy", "SRz", "Tipo"].join("	"));
      const o = [0, 0, 0, 0, 0, 0], $ = [];
      l.frequencies.forEach((x, R) => {
        var _a2;
        const L = x > 0 ? 1 / x : 0, U = x * 2 * Math.PI, w = ((_a2 = l.massParticipation) == null ? void 0 : _a2[R]) || [0, 0, 0, 0, 0, 0];
        for (let i = 0; i < 6; i++) o[i] += w[i];
        let z = 0, C = w[0];
        for (let i = 1; i < 6; i++) w[i] > C && (C = w[i], z = i);
        const N = C < 0.05 ? "\u2014" : `${f[z]} (${(C * 100).toFixed(0)}%)`, T = [String(R + 1), x.toFixed(4), L.toFixed(4), U.toFixed(2), ...w.map((i) => (i * 100).toFixed(1)), (o[0] * 100).toFixed(1), (o[1] * 100).toFixed(1), (o[3] * 100).toFixed(1), (o[4] * 100).toFixed(1), (o[5] * 100).toFixed(1), N];
        e.push(T.join("	")), $.push("<tr>" + T.map((i) => `<td>${i}</td>`).join("") + "</tr>");
      });
      const y = e.join(`
`), g = `<table border="1" cellspacing="0" cellpadding="3">
<caption>Modal Analysis \u2014 ${p.title}</caption>
<tr>${["Modo", "Freq (Hz)", "Periodo (s)", "w (rad/s)", ...f, "SUx", "SUy", "SRx", "SRy", "SRz", "Tipo"].map((x) => `<th>${x}</th>`).join("")}</tr>
${$.join(`
`)}</table>`, u = t.querySelector("#modal-copy"), b = (x) => {
        u.textContent = x ? "\u2713 Copiada" : "\u2717 no se pudo", setTimeout(() => {
          u.textContent = "\u{1F4CB} Copiar";
        }, 1600);
      };
      (async () => {
        var _a2;
        try {
          typeof ClipboardItem < "u" && ((_a2 = navigator.clipboard) == null ? void 0 : _a2.write) ? await navigator.clipboard.write([new ClipboardItem({ "text/plain": new Blob([y], { type: "text/plain" }), "text/html": new Blob([g], { type: "text/html" }) })]) : await navigator.clipboard.writeText(y), b(true);
        } catch {
          try {
            await navigator.clipboard.writeText(y), b(true);
          } catch {
            b(false);
          }
        }
      })();
    });
  }
  return { div: t, render: S };
}
const I = 3.7;
function O(t) {
  let v = 1 / 0, M = 1 / 0, s = 1 / 0, m = -1 / 0, S = -1 / 0, l = -1 / 0;
  for (let f = 0; f < t.length; f++) {
    const d = t[f], c = d[0], n = d[1], a = d[2];
    c < v && (v = c), c > m && (m = c), n < M && (M = n), n > S && (S = n), a < s && (s = a), a > l && (l = a);
  }
  if (!isFinite(v)) return 1;
  const p = Math.sqrt((m - v) ** 2 + (S - M) ** 2 + (l - s) ** 2);
  return p > 1e-12 ? p : 1;
}
export {
  I as M,
  D as c,
  O as m
};
