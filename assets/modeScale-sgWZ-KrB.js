const D = { "--mt-bg": "rgba(0,0,0,0.92)", "--mt-fg": "#0f0", "--mt-tit": "#ff0", "--mt-sum": "#0ff", "--mt-txt": "#fff", "--mt-alto": "#f00", "--mt-avis": "#fa0", "--mt-err": "#f44", "--mt-borde": "#0f03", "--mt-borde2": "#ff03" }, j = { "--mt-bg": "rgba(252,252,253,0.97)", "--mt-fg": "#15803d", "--mt-tit": "#1e3a8a", "--mt-sum": "#0e7490", "--mt-txt": "#1e293b", "--mt-alto": "#b91c1c", "--mt-avis": "#b45309", "--mt-err": "#b91c1c", "--mt-borde": "rgba(15,23,42,0.18)", "--mt-borde2": "rgba(30,58,138,0.25)" };
function q(t) {
  let g = false;
  try {
    g = document.documentElement.getAttribute("data-hk-piel") === "claro";
  } catch {
  }
  const h = g ? j : D;
  for (const w in h) t.style.setProperty(w, h[w]);
  t.style.fontWeight = g ? "500" : "400";
}
function B() {
  const t = document.createElement("div");
  t.id = "modal-results", t.style.cssText = `
    position: fixed; bottom: 10px; left: 10px; z-index: 9999;
    background: var(--mt-bg); color: var(--mt-fg); font-family: monospace;
    font-size: 11px; border-radius: 6px;
    width: 760px; height: 60vh;
    max-width: 96vw; max-height: 92vh;
    overflow-x: auto; overflow-y: auto;
    pointer-events: auto;
    border: 1px solid var(--mt-borde);
    resize: both;
    min-width: 360px; min-height: 160px;
  `;
  {
    let a = false, s = 0, x = 0, l = 0, p = 0;
    t.addEventListener("mousedown", (n) => {
      const c = n.target;
      if (!c.closest("#modal-header") || c.closest("button")) return;
      a = true;
      const d = t.getBoundingClientRect();
      s = n.clientX, x = n.clientY, l = d.left, p = d.top, t.style.bottom = "auto", t.style.right = "auto", t.style.left = `${d.left}px`, t.style.top = `${d.top}px`, n.preventDefault();
    }), document.addEventListener("mousemove", (n) => {
      if (!a) return;
      let c = l + (n.clientX - s), d = p + (n.clientY - x);
      c = Math.max(-t.offsetWidth + 80, Math.min(window.innerWidth - 80, c)), d = Math.max(0, Math.min(window.innerHeight - 30, d)), t.style.left = `${c}px`, t.style.top = `${d}px`;
    }), document.addEventListener("mouseup", () => {
      a = false;
    });
  }
  q(t);
  const g = () => {
    const a = t.getBoundingClientRect();
    a.height > 0 && a.bottom > window.innerHeight - 4 && (t.style.bottom = "auto", t.style.top = Math.max(4, window.innerHeight - a.height - 8) + "px");
  };
  for (const a of [300, 1200, 3e3]) setTimeout(g, a);
  window.addEventListener("resize", g), window.addEventListener("hk-piel", () => q(t));
  let h = false, w = false, r = null;
  const f = 0.9;
  function A(a, s) {
    var _a, _b, _c, _d, _e, _f;
    if (!a.frequencies || a.frequencies.length === 0) {
      const e = ((_a = s.properties) == null ? void 0 : _a.length) ? s.properties.map((o) => `<div>${o}</div>`).join("") : "<div>El solver no devolvi\xF3 modos.</div>";
      t.innerHTML = `<div id="modal-header" style="display:flex; align-items:center; justify-content:space-between; padding:8px 12px; cursor:move; user-select:none;" title="Arrastra para mover">
  <b style="color:var(--mt-tit)">\u2725 \u26A1 MODAL \u2014 ${s.title}</b>
</div>
<div id="modal-body" style="padding:0 12px 10px 12px;">
  <div style="color:var(--mt-err); font-weight:bold; font-size:13px; padding:6px 0">\u2717 El an\xE1lisis modal NO se ejecut\xF3</div>
  <div style="color:var(--mt-avis); font-size:11px; line-height:1.5">${e}</div>
</div>`;
      return;
    }
    const x = ["Ux", "Uy", "Uz", "Rx", "Ry", "Rz"], l = [0, 0, 0, 0, 0, 0], p = a.frequencies.length;
    let n = -1, c = -1, d = -1, E = 0, F = 0;
    {
      const e = [0, 0, 0, 0, 0, 0];
      for (let o = 0; o < p; o++) {
        const M = ((_b = a.massParticipation) == null ? void 0 : _b[o]) || [0, 0, 0, 0, 0, 0];
        for (let y = 0; y < 6; y++) e[y] += M[y];
        n < 0 && e[0] >= f && (n = o + 1), c < 0 && e[1] >= f && (c = o + 1), d < 0 && e[0] >= f && e[1] >= f && (d = o + 1);
      }
      E = e[0], F = e[1];
    }
    const k = (() => {
      const e = (o) => `${((f - o) * 100).toFixed(1)} %`;
      return d > 0 ? `<span style="color:var(--mt-fg)" title="Masa participativa \u2265 90 % en X e Y (NEC-15 \xA76.2.2 / ASCE 7-22 \xA712.9.1.1)">\u2713 \u2265 90 % en X e Y al modo ${d} de ${p} \xB7 \u03A3Ux ${(E * 100).toFixed(1)} % \xB7 \u03A3Uy ${(F * 100).toFixed(1)} %</span>` : n > 0 && c < 0 ? `<span style="color:var(--mt-avis)">\u26A0 FALTAN MODOS EN Y \u2014 \u03A3Uy=${(F * 100).toFixed(1)} % en ${p} modos (faltan ${e(F)} para el 90 % que exige NEC-15 \xA76.2.2). X cumple en el modo ${n}. Sub\xED \xABN\xB0 de modos\xBB en Settings \u25B8 \u26A1 Modal + Animaci\xF3n.</span>` : c > 0 && n < 0 ? `<span style="color:var(--mt-avis)">\u26A0 FALTAN MODOS EN X \u2014 \u03A3Ux=${(E * 100).toFixed(1)} % en ${p} modos (faltan ${e(E)} para el 90 % que exige NEC-15 \xA76.2.2). Y cumple en el modo ${c}. Sub\xED \xABN\xB0 de modos\xBB en Settings \u25B8 \u26A1 Modal + Animaci\xF3n.</span>` : `<span style="color:var(--mt-err)">\u2717 FALTAN MODOS EN AMBAS DIRECCIONES \u2014 \u03A3Ux=${(E * 100).toFixed(1)} % \xB7 \u03A3Uy=${(F * 100).toFixed(1)} % en ${p} modos. NEC-15 \xA76.2.2 exige \u2265 90 %: el cortante din\xE1mico sale bajo y el control Vdin/Vest no es representativo. Sub\xED \xABN\xB0 de modos\xBB en Settings \u25B8 \u26A1 Modal + Animaci\xF3n.</span>`;
    })(), L = (e, o, M, y, u) => `<button id="${e}" title="${M}" style="padding:3px 9px; font-size:10px;
        cursor:pointer; background:${y}; color:var(--mt-txt); border:1px solid ${u};
        border-radius:3px; font-family:monospace; white-space:nowrap;">${o}</button>`;
    let v = `<div id="modal-header" style="display:flex; align-items:center; justify-content:space-between; padding:8px 12px; cursor:move; user-select:none;" title="Arrastr\xE1 desde ac\xE1 para mover la ventana">
  <b style="color:var(--mt-tit); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; min-width:0" title="${s.title}">\u2725 \u26A1 MODAL \u2014 ${s.title}</b>
  <div style="display:flex; gap:4px; margin-left:12px; flex-shrink:0;">
    ${L("modal-copy", "\u{1F4CB} Copiar", "Copiar la tabla al portapapeles \u2014 se pega en Excel en columnas", "#2d6a4f", "#40916c")}
    ${L("modal-wide", "\u2922 Maximizar", "Agrandar la tabla a casi toda la pantalla (para verla entera)", "#33507a", "#4a6fa5")}
    ${L("modal-minimize", "\u25AC", "Minimizar", "#555", "#777")}
    ${L("modal-close", "\u2715", "Cerrar (se vuelve a abrir con \xAB\u{1F4CB} Mostrar tabla\xBB en Settings)", "#7a3333", "#a54a4a")}
  </div>
</div>`;
    v += '<div id="modal-body" style="padding:0 12px 10px 12px;">', v += `<div style="padding:2px 0 4px 0; font-weight:bold; font-size:11px; line-height:1.4; width:0; min-width:100%">${k}</div>`, v += `<table style="border-collapse:collapse; color:var(--mt-fg); font-size:10px; margin-top:2px; white-space:nowrap">
<tr style="color:var(--mt-tit); border-bottom:1px solid var(--mt-borde2)">
  <th style="padding:1px 4px">Mode</th>
  <th style="padding:1px 4px">Freq (Hz)</th>
  <th style="padding:1px 4px">Period (s)</th>
  <th style="padding:1px 4px">\u03C9 (rad/s)</th>`;
    for (const e of x) v += `<th style="padding:1px 4px">${e}</th>`;
    v += `<th style="padding:1px 4px; color:var(--mt-sum)">\u03A3Ux</th>
  <th style="padding:1px 4px; color:var(--mt-sum)">\u03A3Uy</th>
  <th style="padding:1px 4px; color:var(--mt-sum)">\u03A3Rx</th>
  <th style="padding:1px 4px; color:var(--mt-sum)">\u03A3Ry</th>
  <th style="padding:1px 4px; color:var(--mt-sum)">\u03A3Rz</th>
  <th style="padding:1px 4px; color:var(--mt-txt)">Tipo</th></tr>`;
    for (let e = 0; e < 6; e++) l[e] = 0;
    if (a.frequencies.forEach((e, o) => {
      var _a2;
      const M = e > 0 ? 1 / e : 0, y = e * 2 * Math.PI, u = e >= 500, b = ((_a2 = a.massParticipation) == null ? void 0 : _a2[o]) || [0, 0, 0, 0, 0, 0];
      for (let i = 0; i < 6; i++) l[i] += b[i];
      let $ = 0, m = b[0];
      for (let i = 1; i < 6; i++) b[i] > m && (m = b[i], $ = i);
      const R = u ? "masa faltante (r\xEDgida)" : m < 0.05 ? "\u2014" : `${x[$]} (${(m * 100).toFixed(0)} %)`, N = $ === 0 || $ === 1 ? "var(--mt-fg)" : $ === 5 ? "var(--mt-sum)" : $ === 2 ? "var(--mt-avis)" : "#888", U = o + 1 === n, S = o + 1 === c, C = o + 1 === d;
      v += `<tr style="border-bottom:1px solid var(--mt-txt)1; ${u ? "background:rgba(0,180,255,0.12);" : C ? "background:rgba(0,255,0,0.12);" : U || S ? "background:rgba(255,200,0,0.1);" : ""}">
  <td style="padding:1px 4px; text-align:center">${u ? "MF" : o + 1 + (C ? " \u2605" : "")}</td>
  <td style="padding:1px 4px; text-align:right">${u ? "r\xEDgido" : e.toFixed(4)}</td>
  <td style="padding:1px 4px; text-align:right">${u ? "\u22480" : M.toFixed(4)}</td>
  <td style="padding:1px 4px; text-align:right">${u ? "\u2014" : y.toFixed(2)}</td>`;
      for (let i = 0; i < 6; i++) {
        const I = (b[i] * 100).toFixed(1), O = b[i] > 0.5 ? "var(--mt-alto)" : b[i] > 0.1 ? "var(--mt-tit)" : "var(--mt-fg)";
        v += `<td style="padding:1px 4px; text-align:right; color:${O}">${I}%</td>`;
      }
      const P = l[0] >= f ? "var(--mt-fg)" : "var(--mt-sum)", T = l[1] >= f ? "var(--mt-fg)" : "var(--mt-sum)";
      v += `<td style="padding:1px 4px; text-align:right; color:${P}">${(l[0] * 100).toFixed(1)}%${U ? " \u2713" : ""}</td>
  <td style="padding:1px 4px; text-align:right; color:${T}">${(l[1] * 100).toFixed(1)}%${S ? " \u2713" : ""}</td>
  <td style="padding:1px 4px; text-align:right; color:var(--mt-sum)">${(l[3] * 100).toFixed(1)}%</td>
  <td style="padding:1px 4px; text-align:right; color:var(--mt-sum)">${(l[4] * 100).toFixed(1)}%</td>
  <td style="padding:1px 4px; text-align:right; color:var(--mt-sum)">${(l[5] * 100).toFixed(1)}%</td>
  <td style="padding:1px 4px; color:${N}">${R}</td></tr>`;
    }), v += `</table>
<div style="margin-top:6px; font-size:10px; color:#888;">
  \u2605 = primer modo donde \u03A3Ux y \u03A3Uy \u2265 90 %  \xB7  Tipos: <span style="color:var(--mt-fg)">Ux/Uy</span>=lateral \xB7 <span style="color:var(--mt-sum)">Rz</span>=torsional \xB7 <span style="color:var(--mt-avis)">Uz</span>=vertical (no relevante para sismo)
</div>`, v += "</div>", t.innerHTML = v, !w && !r && (w = true, t.style.width = "max-content", t.style.height = "auto"), h) {
      const e = t.querySelector("#modal-body"), o = t.querySelector("#modal-minimize");
      e && (e.style.display = "none"), o && (o.textContent = "\u25A2", o.title = "Restaurar");
    }
    (_c = t.querySelector("#modal-minimize")) == null ? void 0 : _c.addEventListener("click", () => {
      h = !h;
      const e = t.querySelector("#modal-body"), o = t.querySelector("#modal-minimize");
      h ? (e.style.display = "none", o.textContent = "\u25A2", o.title = "Restaurar") : (e.style.display = "block", o.textContent = "\u25AC", o.title = "Minimizar");
    }), (_d = t.querySelector("#modal-wide")) == null ? void 0 : _d.addEventListener("click", () => {
      const e = t.querySelector("#modal-wide");
      r ? (t.style.width = r.w, t.style.height = r.h, t.style.left = r.l, t.style.top = r.t, t.style.bottom = r.bo, t.style.right = r.r, r = null, e.textContent = "\u2922 Maximizar", e.title = "Agrandar la tabla a casi toda la pantalla (para verla entera)") : (r = { w: t.style.width, h: t.style.height, l: t.style.left, t: t.style.top, bo: t.style.bottom, r: t.style.right }, t.style.width = "96vw", t.style.height = "88vh", t.style.left = "2vw", t.style.top = "5vh", t.style.bottom = "auto", t.style.right = "auto", e.textContent = "\u2921 Reducir", e.title = "Volver al tama\xF1o anterior");
    }), (_e = t.querySelector("#modal-close")) == null ? void 0 : _e.addEventListener("click", () => {
      var _a2;
      t.style.display = "none";
      try {
        (_a2 = window.__hekatanModalTablaCerrada) == null ? void 0 : _a2.call(window);
      } catch {
      }
    }), (_f = t.querySelector("#modal-copy")) == null ? void 0 : _f.addEventListener("click", () => {
      const e = [];
      e.push(`Modal Analysis	${s.title}`), e.push(k.replace(/<[^>]+>/g, "").trim()), e.push(""), e.push(["Modo", "Freq (Hz)", "Periodo (s)", "w (rad/s)", ...x, "SUx", "SUy", "SRx", "SRy", "SRz", "Tipo"].join("	"));
      const o = [0, 0, 0, 0, 0, 0], M = [];
      a.frequencies.forEach((m, R) => {
        var _a2;
        const N = m > 0 ? 1 / m : 0, U = m * 2 * Math.PI, S = ((_a2 = a.massParticipation) == null ? void 0 : _a2[R]) || [0, 0, 0, 0, 0, 0];
        for (let i = 0; i < 6; i++) o[i] += S[i];
        let C = 0, z = S[0];
        for (let i = 1; i < 6; i++) S[i] > z && (z = S[i], C = i);
        const P = z < 0.05 ? "\u2014" : `${x[C]} (${(z * 100).toFixed(0)}%)`, T = [String(R + 1), m.toFixed(4), N.toFixed(4), U.toFixed(2), ...S.map((i) => (i * 100).toFixed(1)), (o[0] * 100).toFixed(1), (o[1] * 100).toFixed(1), (o[3] * 100).toFixed(1), (o[4] * 100).toFixed(1), (o[5] * 100).toFixed(1), P];
        e.push(T.join("	")), M.push("<tr>" + T.map((i) => `<td>${i}</td>`).join("") + "</tr>");
      });
      const y = e.join(`
`), u = `<table border="1" cellspacing="0" cellpadding="3">
<caption>Modal Analysis \u2014 ${s.title}</caption>
<tr>${["Modo", "Freq (Hz)", "Periodo (s)", "w (rad/s)", ...x, "SUx", "SUy", "SRx", "SRy", "SRz", "Tipo"].map((m) => `<th>${m}</th>`).join("")}</tr>
${M.join(`
`)}</table>`, b = t.querySelector("#modal-copy"), $ = (m) => {
        b.textContent = m ? "\u2713 Copiada" : "\u2717 no se pudo", setTimeout(() => {
          b.textContent = "\u{1F4CB} Copiar";
        }, 1600);
      };
      (async () => {
        var _a2;
        try {
          typeof ClipboardItem < "u" && ((_a2 = navigator.clipboard) == null ? void 0 : _a2.write) ? await navigator.clipboard.write([new ClipboardItem({ "text/plain": new Blob([y], { type: "text/plain" }), "text/html": new Blob([u], { type: "text/html" }) })]) : await navigator.clipboard.writeText(y), $(true);
        } catch {
          try {
            await navigator.clipboard.writeText(y), $(true);
          } catch {
            $(false);
          }
        }
      })();
    });
  }
  return { div: t, render: A };
}
const H = 3.7, _ = 1.1, X = H * _;
function Y(t) {
  let g = 1 / 0, h = 1 / 0, w = 1 / 0, r = -1 / 0, f = -1 / 0, A = -1 / 0;
  for (let s = 0; s < t.length; s++) {
    const x = t[s], l = x[0], p = x[1], n = x[2];
    l < g && (g = l), l > r && (r = l), p < h && (h = p), p > f && (f = p), n < w && (w = n), n > A && (A = n);
  }
  if (!isFinite(g)) return 1;
  const a = Math.sqrt((r - g) ** 2 + (f - h) ** 2 + (A - w) ** 2);
  return a > 1e-12 ? a : 1;
}
export {
  X as M,
  B as c,
  Y as m
};
