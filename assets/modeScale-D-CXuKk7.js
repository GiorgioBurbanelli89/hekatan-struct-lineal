const O = { "--mt-bg": "rgba(0,0,0,0.92)", "--mt-fg": "#0f0", "--mt-tit": "#ff0", "--mt-sum": "#0ff", "--mt-txt": "#fff", "--mt-alto": "#f00", "--mt-avis": "#fa0", "--mt-err": "#f44", "--mt-borde": "#0f03", "--mt-borde2": "#ff03" }, D = { "--mt-bg": "rgba(252,252,253,0.97)", "--mt-fg": "#15803d", "--mt-tit": "#1e3a8a", "--mt-sum": "#0e7490", "--mt-txt": "#1e293b", "--mt-alto": "#b91c1c", "--mt-avis": "#b45309", "--mt-err": "#b91c1c", "--mt-borde": "rgba(15,23,42,0.18)", "--mt-borde2": "rgba(30,58,138,0.25)" };
function k(t) {
  let p = false;
  try {
    p = document.documentElement.getAttribute("data-hk-piel") === "claro";
  } catch {
  }
  const $ = p ? D : O;
  for (const l in $) t.style.setProperty(l, $[l]);
  t.style.fontWeight = p ? "500" : "400";
}
function _() {
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
    let r = false, c = 0, y = 0, s = 0, m = 0;
    t.addEventListener("mousedown", (a) => {
      const n = a.target;
      if (!n.closest("#modal-header") || n.closest("button")) return;
      r = true;
      const d = t.getBoundingClientRect();
      c = a.clientX, y = a.clientY, s = d.left, m = d.top, t.style.bottom = "auto", t.style.right = "auto", t.style.left = `${d.left}px`, t.style.top = `${d.top}px`, a.preventDefault();
    }), document.addEventListener("mousemove", (a) => {
      if (!r) return;
      let n = s + (a.clientX - c), d = m + (a.clientY - y);
      n = Math.max(-t.offsetWidth + 80, Math.min(window.innerWidth - 80, n)), d = Math.max(0, Math.min(window.innerHeight - 30, d)), t.style.left = `${n}px`, t.style.top = `${d}px`;
    }), document.addEventListener("mouseup", () => {
      r = false;
    });
  }
  k(t), window.addEventListener("hk-piel", () => k(t));
  let p = false, $ = false, l = null;
  const h = 0.9;
  function M(r, c) {
    var _a, _b, _c, _d, _e, _f;
    if (!r.frequencies || r.frequencies.length === 0) {
      const e = ((_a = c.properties) == null ? void 0 : _a.length) ? c.properties.map((o) => `<div>${o}</div>`).join("") : "<div>El solver no devolvi\xF3 modos.</div>";
      t.innerHTML = `<div id="modal-header" style="display:flex; align-items:center; justify-content:space-between; padding:8px 12px; cursor:move; user-select:none;" title="Arrastra para mover">
  <b style="color:var(--mt-tit)">\u2725 \u26A1 MODAL \u2014 ${c.title}</b>
</div>
<div id="modal-body" style="padding:0 12px 10px 12px;">
  <div style="color:var(--mt-err); font-weight:bold; font-size:13px; padding:6px 0">\u2717 El an\xE1lisis modal NO se ejecut\xF3</div>
  <div style="color:var(--mt-avis); font-size:11px; line-height:1.5">${e}</div>
</div>`;
      return;
    }
    const y = ["Ux", "Uy", "Uz", "Rx", "Ry", "Rz"], s = [0, 0, 0, 0, 0, 0], m = r.frequencies.length;
    let a = -1, n = -1, d = -1, A = 0, E = 0;
    {
      const e = [0, 0, 0, 0, 0, 0];
      for (let o = 0; o < m; o++) {
        const w = ((_b = r.massParticipation) == null ? void 0 : _b[o]) || [0, 0, 0, 0, 0, 0];
        for (let g = 0; g < 6; g++) e[g] += w[g];
        a < 0 && e[0] >= h && (a = o + 1), n < 0 && e[1] >= h && (n = o + 1), d < 0 && e[0] >= h && e[1] >= h && (d = o + 1);
      }
      A = e[0], E = e[1];
    }
    const P = (() => {
      const e = (o) => `${((h - o) * 100).toFixed(1)} %`;
      return d > 0 ? `<span style="color:var(--mt-fg)" title="Masa participativa \u2265 90 % en X e Y (NEC-15 \xA76.2.2 / ASCE 7-22 \xA712.9.1.1)">\u2713 \u2265 90 % en X e Y al modo ${d} de ${m} \xB7 \u03A3Ux ${(A * 100).toFixed(1)} % \xB7 \u03A3Uy ${(E * 100).toFixed(1)} %</span>` : a > 0 && n < 0 ? `<span style="color:var(--mt-avis)">\u26A0 FALTAN MODOS EN Y \u2014 \u03A3Uy=${(E * 100).toFixed(1)} % en ${m} modos (faltan ${e(E)} para el 90 % que exige NEC-15 \xA76.2.2). X cumple en el modo ${a}. Sub\xED \xABN\xB0 de modos\xBB en Settings \u25B8 \u26A1 Modal + Animaci\xF3n.</span>` : n > 0 && a < 0 ? `<span style="color:var(--mt-avis)">\u26A0 FALTAN MODOS EN X \u2014 \u03A3Ux=${(A * 100).toFixed(1)} % en ${m} modos (faltan ${e(A)} para el 90 % que exige NEC-15 \xA76.2.2). Y cumple en el modo ${n}. Sub\xED \xABN\xB0 de modos\xBB en Settings \u25B8 \u26A1 Modal + Animaci\xF3n.</span>` : `<span style="color:var(--mt-err)">\u2717 FALTAN MODOS EN AMBAS DIRECCIONES \u2014 \u03A3Ux=${(A * 100).toFixed(1)} % \xB7 \u03A3Uy=${(E * 100).toFixed(1)} % en ${m} modos. NEC-15 \xA76.2.2 exige \u2265 90 %: el cortante din\xE1mico sale bajo y el control Vdin/Vest no es representativo. Sub\xED \xABN\xB0 de modos\xBB en Settings \u25B8 \u26A1 Modal + Animaci\xF3n.</span>`;
    })(), z = (e, o, w, g, v) => `<button id="${e}" title="${w}" style="padding:3px 9px; font-size:10px;
        cursor:pointer; background:${g}; color:var(--mt-txt); border:1px solid ${v};
        border-radius:3px; font-family:monospace; white-space:nowrap;">${o}</button>`;
    let f = `<div id="modal-header" style="display:flex; align-items:center; justify-content:space-between; padding:8px 12px; cursor:move; user-select:none;" title="Arrastr\xE1 desde ac\xE1 para mover la ventana">
  <b style="color:var(--mt-tit); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; min-width:0" title="${c.title}">\u2725 \u26A1 MODAL \u2014 ${c.title}</b>
  <div style="display:flex; gap:4px; margin-left:12px; flex-shrink:0;">
    ${z("modal-copy", "\u{1F4CB} Copiar", "Copiar la tabla al portapapeles \u2014 se pega en Excel en columnas", "#2d6a4f", "#40916c")}
    ${z("modal-wide", "\u2922 Ancho", "Agrandar la ventana a casi toda la pantalla", "#33507a", "#4a6fa5")}
    ${z("modal-minimize", "\u25AC", "Minimizar", "#555", "#777")}
    ${z("modal-close", "\u2715", "Cerrar (se vuelve a abrir con \xAB\u{1F4CB} Mostrar tabla\xBB en Settings)", "#7a3333", "#a54a4a")}
  </div>
</div>`;
    f += '<div id="modal-body" style="padding:0 12px 10px 12px;">', f += `<div style="padding:2px 0 4px 0; font-weight:bold; font-size:11px; line-height:1.4; width:0; min-width:100%">${P}</div>`, f += `<table style="border-collapse:collapse; color:var(--mt-fg); font-size:10px; margin-top:2px; white-space:nowrap">
<tr style="color:var(--mt-tit); border-bottom:1px solid var(--mt-borde2)">
  <th style="padding:1px 4px">Mode</th>
  <th style="padding:1px 4px">Freq (Hz)</th>
  <th style="padding:1px 4px">Period (s)</th>
  <th style="padding:1px 4px">\u03C9 (rad/s)</th>`;
    for (const e of y) f += `<th style="padding:1px 4px">${e}</th>`;
    f += `<th style="padding:1px 4px; color:var(--mt-sum)">\u03A3Ux</th>
  <th style="padding:1px 4px; color:var(--mt-sum)">\u03A3Uy</th>
  <th style="padding:1px 4px; color:var(--mt-sum)">\u03A3Rx</th>
  <th style="padding:1px 4px; color:var(--mt-sum)">\u03A3Ry</th>
  <th style="padding:1px 4px; color:var(--mt-sum)">\u03A3Rz</th>
  <th style="padding:1px 4px; color:var(--mt-txt)">Tipo</th></tr>`;
    for (let e = 0; e < 6; e++) s[e] = 0;
    if (r.frequencies.forEach((e, o) => {
      var _a2;
      const w = e > 0 ? 1 / e : 0, g = e * 2 * Math.PI, v = e >= 500, u = ((_a2 = r.massParticipation) == null ? void 0 : _a2[o]) || [0, 0, 0, 0, 0, 0];
      for (let i = 0; i < 6; i++) s[i] += u[i];
      let b = 0, x = u[0];
      for (let i = 1; i < 6; i++) u[i] > x && (x = u[i], b = i);
      const L = v ? "masa faltante (r\xEDgida)" : x < 0.05 ? "\u2014" : `${y[b]} (${(x * 100).toFixed(0)} %)`, T = b === 0 || b === 1 ? "var(--mt-fg)" : b === 5 ? "var(--mt-sum)" : b === 2 ? "var(--mt-avis)" : "#888", R = o + 1 === a, S = o + 1 === n, F = o + 1 === d;
      f += `<tr style="border-bottom:1px solid var(--mt-txt)1; ${v ? "background:rgba(0,180,255,0.12);" : F ? "background:rgba(0,255,0,0.12);" : R || S ? "background:rgba(255,200,0,0.1);" : ""}">
  <td style="padding:1px 4px; text-align:center">${v ? "MF" : o + 1 + (F ? " \u2605" : "")}</td>
  <td style="padding:1px 4px; text-align:right">${v ? "r\xEDgido" : e.toFixed(4)}</td>
  <td style="padding:1px 4px; text-align:right">${v ? "\u22480" : w.toFixed(4)}</td>
  <td style="padding:1px 4px; text-align:right">${v ? "\u2014" : g.toFixed(2)}</td>`;
      for (let i = 0; i < 6; i++) {
        const q = (u[i] * 100).toFixed(1), I = u[i] > 0.5 ? "var(--mt-alto)" : u[i] > 0.1 ? "var(--mt-tit)" : "var(--mt-fg)";
        f += `<td style="padding:1px 4px; text-align:right; color:${I}">${q}%</td>`;
      }
      const N = s[0] >= h ? "var(--mt-fg)" : "var(--mt-sum)", U = s[1] >= h ? "var(--mt-fg)" : "var(--mt-sum)";
      f += `<td style="padding:1px 4px; text-align:right; color:${N}">${(s[0] * 100).toFixed(1)}%${R ? " \u2713" : ""}</td>
  <td style="padding:1px 4px; text-align:right; color:${U}">${(s[1] * 100).toFixed(1)}%${S ? " \u2713" : ""}</td>
  <td style="padding:1px 4px; text-align:right; color:var(--mt-sum)">${(s[3] * 100).toFixed(1)}%</td>
  <td style="padding:1px 4px; text-align:right; color:var(--mt-sum)">${(s[4] * 100).toFixed(1)}%</td>
  <td style="padding:1px 4px; text-align:right; color:var(--mt-sum)">${(s[5] * 100).toFixed(1)}%</td>
  <td style="padding:1px 4px; color:${T}">${L}</td></tr>`;
    }), f += `</table>
<div style="margin-top:6px; font-size:10px; color:#888;">
  \u2605 = primer modo donde \u03A3Ux y \u03A3Uy \u2265 90 %  \xB7  Tipos: <span style="color:var(--mt-fg)">Ux/Uy</span>=lateral \xB7 <span style="color:var(--mt-sum)">Rz</span>=torsional \xB7 <span style="color:var(--mt-avis)">Uz</span>=vertical (no relevante para sismo)
</div>`, f += "</div>", t.innerHTML = f, !$ && !l && ($ = true, t.style.width = "max-content", t.style.height = "auto"), p) {
      const e = t.querySelector("#modal-body"), o = t.querySelector("#modal-minimize");
      e && (e.style.display = "none"), o && (o.textContent = "\u25A2", o.title = "Restaurar");
    }
    (_c = t.querySelector("#modal-minimize")) == null ? void 0 : _c.addEventListener("click", () => {
      p = !p;
      const e = t.querySelector("#modal-body"), o = t.querySelector("#modal-minimize");
      p ? (e.style.display = "none", o.textContent = "\u25A2", o.title = "Restaurar") : (e.style.display = "block", o.textContent = "\u25AC", o.title = "Minimizar");
    }), (_d = t.querySelector("#modal-wide")) == null ? void 0 : _d.addEventListener("click", () => {
      const e = t.querySelector("#modal-wide");
      l ? (t.style.width = l.w, t.style.height = l.h, t.style.left = l.l, t.style.top = l.t, t.style.bottom = l.bo, t.style.right = l.r, l = null, e.textContent = "\u2922 Ancho", e.title = "Agrandar la ventana a casi toda la pantalla") : (l = { w: t.style.width, h: t.style.height, l: t.style.left, t: t.style.top, bo: t.style.bottom, r: t.style.right }, t.style.width = "96vw", t.style.height = "88vh", t.style.left = "2vw", t.style.top = "5vh", t.style.bottom = "auto", t.style.right = "auto", e.textContent = "\u2921 Reducir", e.title = "Volver al tama\xF1o anterior");
    }), (_e = t.querySelector("#modal-close")) == null ? void 0 : _e.addEventListener("click", () => {
      var _a2;
      t.style.display = "none";
      try {
        (_a2 = window.__hekatanModalTablaCerrada) == null ? void 0 : _a2.call(window);
      } catch {
      }
    }), (_f = t.querySelector("#modal-copy")) == null ? void 0 : _f.addEventListener("click", () => {
      const e = [];
      e.push(`Modal Analysis	${c.title}`), e.push(P.replace(/<[^>]+>/g, "").trim()), e.push(""), e.push(["Modo", "Freq (Hz)", "Periodo (s)", "w (rad/s)", ...y, "SUx", "SUy", "SRx", "SRy", "SRz", "Tipo"].join("	"));
      const o = [0, 0, 0, 0, 0, 0], w = [];
      r.frequencies.forEach((x, L) => {
        var _a2;
        const T = x > 0 ? 1 / x : 0, R = x * 2 * Math.PI, S = ((_a2 = r.massParticipation) == null ? void 0 : _a2[L]) || [0, 0, 0, 0, 0, 0];
        for (let i = 0; i < 6; i++) o[i] += S[i];
        let F = 0, C = S[0];
        for (let i = 1; i < 6; i++) S[i] > C && (C = S[i], F = i);
        const N = C < 0.05 ? "\u2014" : `${y[F]} (${(C * 100).toFixed(0)}%)`, U = [String(L + 1), x.toFixed(4), T.toFixed(4), R.toFixed(2), ...S.map((i) => (i * 100).toFixed(1)), (o[0] * 100).toFixed(1), (o[1] * 100).toFixed(1), (o[3] * 100).toFixed(1), (o[4] * 100).toFixed(1), (o[5] * 100).toFixed(1), N];
        e.push(U.join("	")), w.push("<tr>" + U.map((i) => `<td>${i}</td>`).join("") + "</tr>");
      });
      const g = e.join(`
`), v = `<table border="1" cellspacing="0" cellpadding="3">
<caption>Modal Analysis \u2014 ${c.title}</caption>
<tr>${["Modo", "Freq (Hz)", "Periodo (s)", "w (rad/s)", ...y, "SUx", "SUy", "SRx", "SRy", "SRz", "Tipo"].map((x) => `<th>${x}</th>`).join("")}</tr>
${w.join(`
`)}</table>`, u = t.querySelector("#modal-copy"), b = (x) => {
        u.textContent = x ? "\u2713 Copiada" : "\u2717 no se pudo", setTimeout(() => {
          u.textContent = "\u{1F4CB} Copiar";
        }, 1600);
      };
      (async () => {
        var _a2;
        try {
          typeof ClipboardItem < "u" && ((_a2 = navigator.clipboard) == null ? void 0 : _a2.write) ? await navigator.clipboard.write([new ClipboardItem({ "text/plain": new Blob([g], { type: "text/plain" }), "text/html": new Blob([v], { type: "text/html" }) })]) : await navigator.clipboard.writeText(g), b(true);
        } catch {
          try {
            await navigator.clipboard.writeText(g), b(true);
          } catch {
            b(false);
          }
        }
      })();
    });
  }
  return { div: t, render: M };
}
const j = 3.7, H = 1.1, X = j * H;
function Y(t) {
  let p = 1 / 0, $ = 1 / 0, l = 1 / 0, h = -1 / 0, M = -1 / 0, r = -1 / 0;
  for (let y = 0; y < t.length; y++) {
    const s = t[y], m = s[0], a = s[1], n = s[2];
    m < p && (p = m), m > h && (h = m), a < $ && ($ = a), a > M && (M = a), n < l && (l = n), n > r && (r = n);
  }
  if (!isFinite(p)) return 1;
  const c = Math.sqrt((h - p) ** 2 + (M - $) ** 2 + (r - l) ** 2);
  return c > 1e-12 ? c : 1;
}
export {
  X as M,
  _ as c,
  Y as m
};
