import { E as X, __tla as __tla_0 } from "./workspace-ChbWH61x.js";
import { __tla as __tla_1 } from "./aiAgent-CjfWDbux.js";
import "./__vite-browser-external-D7Ct-6yo.js";
let B;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })(),
  (() => {
    try {
      return __tla_1;
    } catch {
    }
  })()
]).then(async () => {
  const q = "hk-zapatas-planta", U = [
    8,
    9,
    10,
    11,
    12,
    13
  ];
  let v = 0, F = 0.05, P = false, T = null, _ = null;
  const W = [
    [
      "w",
      "Oeste \u25C0"
    ],
    [
      "e",
      "Este \u25B6"
    ],
    [
      "s",
      "Sur \u25BC"
    ],
    [
      "n",
      "Norte \u25B2"
    ]
  ], A = (r) => Math.round(r * 1e3) / 1e3;
  function Z(r) {
    const e = /* @__PURE__ */ new Set();
    for (let i = 0; i < r.length; i++) for (let d = i + 1; d < r.length; d++) {
      const c = r[i], p = r[d];
      c.x0 < p.x1 - 1e-6 && p.x0 < c.x1 - 1e-6 && c.y0 < p.y1 - 1e-6 && p.y0 < c.y1 - 1e-6 && (e.add(i), e.add(d));
    }
    return e;
  }
  function D(r, e) {
    if (_.aplicar) {
      const c = {
        w: A(Math.max(0, e.w)),
        e: A(Math.max(0, e.e)),
        s: A(Math.max(0, e.s)),
        n: A(Math.max(0, e.n))
      };
      clearTimeout(T), T = setTimeout(() => _.aplicar(r, c), 250);
      return;
    }
    const i = _.sub, d = X.get(i) ?? {};
    d[r] = {
      w: A(Math.max(0, e.w)),
      e: A(Math.max(0, e.e)),
      s: A(Math.max(0, e.s)),
      n: A(Math.max(0, e.n))
    }, X.set(i, d), clearTimeout(T), T = setTimeout(() => {
      var _a;
      return (_a = window.__hekatanRebuild) == null ? void 0 : _a.call(window);
    }, 250);
  }
  let $ = {
    k: 1,
    x0: 0,
    y0: 0,
    H: 0
  };
  function J(r) {
    const e = r.zapatas, i = r.columnas, d = r.vigas, c = Math.min(...e.map((t) => t.x0)) - 0.4, p = Math.max(...e.map((t) => t.x1)) + 0.4, S = Math.min(...e.map((t) => t.y0)) - 0.4, b = Math.max(...e.map((t) => t.y1)) + 0.4, n = 330, o = Math.max(120, Math.min(260, n * (b - S) / (p - c))), m = Math.min(n / (p - c), o / (b - S)), a = (t) => (t - c) * m, l = (t) => o - (t - S) * m;
    $ = {
      k: m,
      x0: c,
      y0: S,
      H: o
    };
    const I = Z(e);
    let k = `<svg width="${n}" height="${o}" style="background:#0d1118;border:1px solid #2a3140;border-radius:6px;cursor:pointer">`;
    for (const t of d) k += `<line x1="${a(t[0])}" y1="${l(t[1])}" x2="${a(t[2])}" y2="${l(t[3])}" stroke="#7f8ea8" stroke-width="3"/>`;
    e.forEach((t, x) => {
      const u = x === v, h = I.has(x);
      k += `<rect data-i="${x}" x="${a(t.x0)}" y="${l(t.y1)}" width="${(t.x1 - t.x0) * m}" height="${(t.y1 - t.y0) * m}" fill="${u ? "rgba(255,200,60,.35)" : "rgba(90,160,255,.22)"}" stroke="${h ? "#ff5d5d" : u ? "#ffc83c" : "#5aa0ff"}" stroke-width="${u ? 2.5 : 1.5}"/>`;
    });
    for (const t of i) {
      const x = t.bx ?? t.b, u = t.by ?? t.b;
      k += `<rect x="${a(t.x - x / 2)}" y="${l(t.y + u / 2)}" width="${Math.max(3, x * m)}" height="${Math.max(3, u * m)}" fill="#e8eef9" pointer-events="none"/>`;
    }
    const s = e[v];
    if (s) {
      const t = s.vuelos, x = (s.y0 + s.y1) / 2, u = (s.x0 + s.x1) / 2, h = (y, f, E, M) => `<text data-t="${y}" x="${f}" y="${E}" fill="#ffc83c" font-size="11" text-anchor="middle" pointer-events="none">${M}</text>`;
      k += h("w", a(s.x0) + 14, l(x) - 4, t.w.toFixed(2)) + h("e", a(s.x1) - 14, l(x) - 4, t.e.toFixed(2)) + h("s", a(u), l(s.y0) - 4, t.s.toFixed(2)) + h("n", a(u), l(s.y1) + 12, t.n.toFixed(2));
      const g = (y, f, E, M, j, O) => `<line data-h="${y}" x1="${f}" y1="${E}" x2="${M}" y2="${j}" stroke="#ffc83c" stroke-opacity=".01" stroke-width="12" style="cursor:${O}"/><line data-hv="${y}" x1="${f}" y1="${E}" x2="${M}" y2="${j}" stroke="#ffc83c" stroke-width="3.5" pointer-events="none"/>`;
      k += g("w", a(s.x0), l(s.y1), a(s.x0), l(s.y0), "ew-resize") + g("e", a(s.x1), l(s.y1), a(s.x1), l(s.y0), "ew-resize") + g("s", a(s.x0), l(s.y0), a(s.x1), l(s.y0), "ns-resize") + g("n", a(s.x0), l(s.y1), a(s.x1), l(s.y1), "ns-resize");
    }
    return k + "</svg>";
  }
  function Y() {
    var _a, _b, _c;
    const r = window;
    return (_ == null ? void 0 : _.siempre) ? ((_a = r.__hekatanExample) == null ? void 0 : _a.call(r)) === "csi-importer" : ((_b = r.__hekatanExample) == null ? void 0 : _b.call(r)) !== "plantillas" ? false : U.includes(Math.round((_c = r.__hekatanGetParams) == null ? void 0 : _c.call(r).tipo));
  }
  B = function(r) {
    var _a, _b;
    const e = r.__cimPlanta;
    if (!e || typeof document > "u") return;
    _ = e, v >= e.zapatas.length && (v = 0);
    let i = document.getElementById(q);
    i || (i = document.createElement("div"), i.id = q, i.style.cssText = "position:fixed;left:312px;top:58px;z-index:9500;width:352px;background:rgba(18,22,30,.96);color:#e8eef9;font:12px Segoe UI,sans-serif;border:1px solid #2f3a4d;border-radius:8px;padding:8px 10px;box-shadow:0 6px 24px rgba(0,0,0,.5)", document.body.appendChild(i), setInterval(() => {
      const n = document.getElementById(q);
      n && (n.style.display = Y() ? "" : "none");
    }, 700)), i.style.display = Y() ? "" : "none";
    const d = e.zapatas[v], c = d.vuelos, p = d.x1 - d.x0, S = d.y1 - d.y0, b = (n, o) => `<button data-a="${n}" style="background:#26314a;color:#e8eef9;border:1px solid #3a4560;border-radius:4px;padding:2px 6px;cursor:pointer">${o}</button>`;
    i.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><b>\u{1F4D0} Zapatas en planta</b><button id="${q}-p" style="all:unset;cursor:pointer;padding:0 6px">${P ? "\u25BE" : "\u25B4"}</button></div>` + (P ? "" : J(e) + `<div style="margin:6px 0 4px">Zapata <b>${v + 1}</b> de ${e.zapatas.length} \xB7 <b data-sz>${p.toFixed(2)} \xD7 ${S.toFixed(2)} m</b> \xB7 canto ${d.t.toFixed(2)} m</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 8px">` + W.map(([n, o]) => `<label style="display:flex;justify-content:space-between;align-items:center">${o}<input data-c="${n}" type="number" min="0" step="${F}" value="${c[n].toFixed(2)}" style="width:68px;background:#0d1118;color:#fff;border:1px solid #3a4560;border-radius:4px;padding:2px 4px"></label>`).join("") + `</div><div style="margin:6px 0 2px;display:flex;align-items:center;gap:6px">paso <select id="${q}-paso" style="background:#0d1118;color:#fff;border:1px solid #3a4560;border-radius:4px">` + [
      0.01,
      0.05,
      0.1,
      0.25,
      0.5
    ].map((n) => `<option ${n === F ? "selected" : ""} value="${n}">${n.toFixed(2)} m</option>`).join("") + '</select><span style="opacity:.7">arrastra una cara amarilla o escribe</span></div><div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px">' + b("centrada", "\u25AB Centrada") + b("lw", "\u25E7 Lindero O") + b("le", "\u25E8 Lindero E") + b("ls", "\u2B13 Lindero S") + b("ln", "\u2B12 Lindero N") + b("esq", "\u25F0 Esquinera (O+S)") + b("igual", "\u25A3 4 caras = Oeste") + b("reset", "\u21BA Original") + "</div>" + (Z(e.zapatas).size ? '<div style="color:#ff7b7b;margin-top:6px">\u26A0 Hay zapatas que se solapan (borde rojo): se mallar\xEDan dos veces.</div>' : "")), (_a = i.querySelector(`#${q}-p`)) == null ? void 0 : _a.addEventListener("click", () => {
      P = !P, B(r);
    }), i.querySelectorAll("rect[data-i]").forEach((n) => n.addEventListener("click", () => {
      v = +n.dataset.i, B(r);
    })), (_b = i.querySelector(`#${q}-paso`)) == null ? void 0 : _b.addEventListener("change", (n) => {
      F = +n.target.value, B(r);
    }), K(i, d), i.querySelectorAll("input[data-c]").forEach((n) => n.addEventListener("change", () => {
      const o = {
        ...c
      };
      o[n.dataset.c] = +n.value, D(v, o);
    })), i.querySelectorAll("button[data-a]").forEach((n) => n.addEventListener("click", () => {
      const o = n.dataset.a, m = d.base, a = {
        ...c
      }, l = Math.max(m.w, m.e, m.s, m.n);
      o === "centrada" && Object.assign(a, {
        w: l,
        e: l,
        s: l,
        n: l
      }), o === "reset" && Object.assign(a, m), o === "lw" && (a.w = 0), o === "le" && (a.e = 0), o === "ls" && (a.s = 0), o === "ln" && (a.n = 0), o === "esq" && (a.w = 0, a.s = 0), o === "igual" && Object.assign(a, {
        e: a.w,
        s: a.w,
        n: a.w
      }), D(v, a);
    }));
  };
  function K(r, e, i) {
    const d = r.querySelector("svg");
    if (!d) return;
    const c = e.vuelos, p = {
      x0: e.x0 + c.w,
      x1: e.x1 - c.e,
      y0: e.y0 + c.s,
      y1: e.y1 - c.n
    };
    d.querySelectorAll("line[data-h]").forEach((S) => S.addEventListener("pointerdown", (b) => {
      var _a;
      b.preventDefault(), b.stopPropagation();
      const n = S.dataset.h, o = {
        ...c
      };
      (_a = S.setPointerCapture) == null ? void 0 : _a.call(S, b.pointerId);
      const m = (l) => {
        const I = d.getBoundingClientRect(), k = $.x0 + (l.clientX - I.left) / $.k, s = $.y0 + ($.H - (l.clientY - I.top)) / $.k;
        let t = n === "w" ? p.x0 - k : n === "e" ? k - p.x1 : n === "s" ? p.y0 - s : s - p.y1;
        t = Math.max(0, Math.round(t / F) * F), o[n] = A(t);
        const x = p.x0 - o.w, u = p.x1 + o.e, h = p.y0 - o.s, g = p.y1 + o.n, y = (w) => (w - $.x0) * $.k, f = (w) => $.H - (w - $.y0) * $.k, E = d.querySelector(`rect[data-i="${v}"]`);
        E == null ? void 0 : E.setAttribute("x", String(y(x))), E == null ? void 0 : E.setAttribute("y", String(f(g))), E == null ? void 0 : E.setAttribute("width", String((u - x) * $.k)), E == null ? void 0 : E.setAttribute("height", String((g - h) * $.k));
        const M = (w, H, N, L, G) => d.querySelectorAll(`line[data-h="${w}"],line[data-hv="${w}"]`).forEach((C) => {
          C.setAttribute("x1", String(H)), C.setAttribute("y1", String(N)), C.setAttribute("x2", String(L)), C.setAttribute("y2", String(G));
        });
        M("w", y(x), f(g), y(x), f(h)), M("e", y(u), f(g), y(u), f(h)), M("s", y(x), f(h), y(u), f(h)), M("n", y(x), f(g), y(u), f(g));
        const j = (x + u) / 2, O = (h + g) / 2, z = (w, H, N) => {
          const L = d.querySelector(`text[data-t="${w}"]`);
          L && (L.setAttribute("x", String(H)), L.setAttribute("y", String(N)), L.textContent = o[w].toFixed(2));
        };
        z("w", y(x) + 14, f(O) - 4), z("e", y(u) - 14, f(O) - 4), z("s", y(j), f(h) - 4), z("n", y(j), f(g) + 12);
        const R = r.querySelector("b[data-sz]");
        R && (R.textContent = `${(u - x).toFixed(2)} \xD7 ${(g - h).toFixed(2)} m`), r.querySelectorAll("input[data-c]").forEach((w) => {
          w.value = o[w.dataset.c].toFixed(2);
        });
      }, a = () => {
        window.removeEventListener("pointermove", m), window.removeEventListener("pointerup", a), D(v, o);
      };
      window.addEventListener("pointermove", m), window.addEventListener("pointerup", a);
    }));
  }
});
export {
  __tla,
  B as montarPanelPlanta
};
