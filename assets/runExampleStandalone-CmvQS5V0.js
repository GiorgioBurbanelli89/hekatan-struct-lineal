const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-BTBFNVjz.js","assets/analyze-DgLgRmKg.js","assets/pureFunctionsAny.generated-DeJSBP3k.js","assets/didacticCpp-CnEP9H1T.js","assets/deform-CK_Uh0DH.js","assets/preload-helper-V2P8TQsQ.js","assets/planeQ4-DsCzHfbV.js","assets/layeredQ4-DuXBBCkf.js","assets/mitc3-2FJr2z_r.js","assets/fiberSectionCft-CvKVMF85.js","assets/menegottoPinto-9Id4uJ7l.js"])))=>i.map(i=>d[i]);
import { _ as ot } from "./preload-helper-V2P8TQsQ.js";
import { o as kt, t as wt, V as B, u as xt, B as ut, b as ht, d as _t, w as $t, v as K } from "./theme-DQ--CgsI.js";
import { P as Mt } from "./tweakpane-BXg6ZhiP.js";
import { c as Lt, d as Et, g as zt } from "./getViewer-DoAG4kNs.js";
import { g as Pt } from "./styles-0iLl92Fx.js";
import { c as Tt } from "./renderModalTable-BJWFR1R0.js";
import { f as nt, d as it, e as Ft, g as It, h as St, i as st, j as Dt, s as lt, k as ct, l as dt, m as pt, n as Nt, o as Ct, p as At, q as Bt, t as Ot, r as jt } from "./units-D6XsaEPz.js";
let Kt;
let __tla = (async () => {
  const f = (w, C = 4) => w == null || !isFinite(w) ? "\u2014" : Math.abs(w) === 0 ? "0" : Math.abs(w) < 1e-3 || Math.abs(w) > 1e5 ? w.toExponential(C) : w.toFixed(C);
  function Yt(w, C) {
    if (!document.getElementById("hk-inspect-styles")) {
      const v = document.createElement("style");
      v.id = "hk-inspect-styles", v.textContent = `
      .hk-inspect-btn {
        /* Top-center del viewer: no choca con Settings panel (top-left) ni con
         * el Tweakpane principal del ejemplo (top-right). */
        position: absolute; top: 8px; left: 50%; transform: translateX(-50%);
        z-index: 100;
        background: rgba(34,85,136,0.92); color: #fff;
        border: 1px solid #336699; border-radius: 4px;
        padding: 4px 10px; font-size: 11px;
        cursor: pointer; font-family: system-ui, sans-serif;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        backdrop-filter: blur(2px);
      }
      .hk-inspect-btn:hover { background: rgba(51,102,153,0.96); }
      .hk-inspect-btn.active { background: #ff4444; border-color: #ff4444; }
      .hk-inspect-panel {
        /* Posici\xF3n central-derecha del viewer (lejos del Settings panel a la
         * izquierda y del Tweakpane principal a la derecha). Arrastrable. */
        position: fixed; top: 60px; left: 260px; z-index: 9999;
        background: rgba(20,24,32,0.96); color: #e8e8e8;
        border: 1px solid #336699; border-radius: 8px;
        padding: 12px; min-width: 320px; max-width: 460px; max-height: 80vh;
        overflow-y: auto; font-family: monospace; font-size: 12px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.6);
      }
      .hk-inspect-panel h3 { cursor: move; user-select: none; }
      .hk-inspect-panel h3 {
        margin: 0 0 8px 0; color: #ffaa44; font-size: 14px;
        display: flex; justify-content: space-between; align-items: center;
        font-family: system-ui, sans-serif;
      }
      .hk-inspect-panel .close-btn {
        background: none; border: none; color: #ff8888; cursor: pointer;
        font-size: 16px; padding: 0 4px;
      }
      .hk-inspect-panel .section {
        margin-top: 10px; border-top: 1px solid #444; padding-top: 8px;
      }
      .hk-inspect-panel .section-title {
        color: #ffaa44; font-size: 11px; font-weight: bold;
        text-transform: uppercase; margin-bottom: 4px;
      }
      .hk-inspect-panel .prop-row {
        display: flex; justify-content: space-between; padding: 2px 0;
      }
      .hk-inspect-panel .prop-key { color: #88ccff; }
      .hk-inspect-panel .prop-val { color: #ffeebb; font-weight: bold; }
      .hk-inspect-panel table {
        border-collapse: collapse; width: 100%;
        margin-top: 4px; font-size: 11px;
      }
      .hk-inspect-panel td {
        border: 1px solid #444; padding: 3px 6px; text-align: right;
        color: #cce; white-space: nowrap;
      }
      .hk-inspect-panel td.header {
        color: #ffaa44; font-weight: bold; background: #1a2030;
        text-align: center;
      }
      .hk-inspect-panel .hint {
        color: #888; font-size: 10px; font-family: system-ui, sans-serif;
        margin-top: 6px; font-style: italic;
      }
    `, document.head.appendChild(v);
    }
    const Y = () => w.__ctx || null;
    let X = false, P = null, Z = null;
    const R = document.createElement("button");
    R.className = "hk-inspect-btn", R.textContent = "\u{1F50D} Inspect", R.title = "Click para inspeccionar elementos. Clicke\xE1 un elemento para ver sus propiedades.", getComputedStyle(w).position === "static" && (w.style.position = "relative"), w.appendChild(R);
    const W = (v) => {
      var _a;
      const E = Y();
      if (!E) return -1;
      const g = E.renderer.domElement.getBoundingClientRect(), _ = new kt((v.clientX - g.left) / g.width * 2 - 1, -((v.clientY - g.top) / g.height) * 2 + 1), l = new wt();
      l.setFromCamera(_, ((_a = E.controls) == null ? void 0 : _a.object) || E.camera), l.params.Line = {
        threshold: 0.5
      };
      const p = C.nodes.val || [], h = C.elements.val || [];
      if (p.length === 0 || h.length === 0) return -1;
      let b = 1 / 0, x = -1, $ = 1 / 0, k = -1;
      const u = l.ray;
      for (let a = 0; a < h.length; a++) {
        const e = h[a];
        if (e.length === 2) {
          const r = new B(...p[e[0]]), s = new B(...p[e[1]]), n = new xt(r, s), t = new B(), i = new B();
          u.closestPointToPoint(n.getCenter(new B()), t), n.closestPointToPoint(t, true, i);
          const c = t.distanceTo(i);
          c < b && (b = c, x = a);
        } else if (e.length === 3) {
          const r = new B(...p[e[0]]), s = new B(...p[e[1]]), n = new B(...p[e[2]]), t = new B();
          let i = u.intersectTriangle(r, s, n, false, t);
          if (i || (i = u.intersectTriangle(r, n, s, false, t)), i) {
            const c = u.origin.distanceTo(t);
            c < $ && ($ = c, k = a);
          }
        } else if (e.length === 4) {
          const r = new B(...p[e[0]]), s = new B(...p[e[1]]), n = new B(...p[e[2]]), t = new B(...p[e[3]]), i = new B();
          let c = u.intersectTriangle(r, s, n, false, i);
          if (c || (c = u.intersectTriangle(r, n, s, false, i)), c) {
            const o = u.origin.distanceTo(i);
            o < $ && ($ = o, k = a);
          }
          if (c = u.intersectTriangle(r, n, t, false, i), c || (c = u.intersectTriangle(r, t, n, false, i)), c) {
            const o = u.origin.distanceTo(i);
            o < $ && ($ = o, k = a);
          }
        } else if (e.length === 8) {
          const r = e.map((t) => new B(...p[t])), s = new B(), n = [
            [
              0,
              1,
              2,
              3
            ],
            [
              4,
              5,
              6,
              7
            ],
            [
              0,
              1,
              5,
              4
            ],
            [
              2,
              3,
              7,
              6
            ],
            [
              0,
              3,
              7,
              4
            ],
            [
              1,
              2,
              6,
              5
            ]
          ];
          for (const t of n) {
            let i = u.intersectTriangle(r[t[0]], r[t[1]], r[t[2]], false, s);
            if (i || (i = u.intersectTriangle(r[t[0]], r[t[2]], r[t[1]], false, s)), i) {
              const c = u.origin.distanceTo(s);
              c < $ && ($ = c, k = a);
            }
            if (i = u.intersectTriangle(r[t[0]], r[t[2]], r[t[3]], false, s), i || (i = u.intersectTriangle(r[t[0]], r[t[3]], r[t[2]], false, s)), i) {
              const c = u.origin.distanceTo(s);
              c < $ && ($ = c, k = a);
            }
          }
        }
      }
      if (k >= 0) return k;
      const y = p.reduce((a, e) => [
        Math.min(a[0], e[0]),
        Math.min(a[1], e[1]),
        Math.min(a[2], e[2])
      ], [
        1 / 0,
        1 / 0,
        1 / 0
      ]), z = p.reduce((a, e) => [
        Math.max(a[0], e[0]),
        Math.max(a[1], e[1]),
        Math.max(a[2], e[2])
      ], [
        -1 / 0,
        -1 / 0,
        -1 / 0
      ]), d = Math.max(z[0] - y[0], z[1] - y[1], z[2] - y[2], 1);
      return b < d * 0.05 ? x : -1;
    }, Q = () => {
      const v = Y();
      Z && v && (v.scene.remove(Z), Z = null, v.render());
    }, M = (v) => {
      Q();
      const E = Y();
      if (!E) return;
      const S = C.elements.val[v], g = C.nodes.val;
      if (S.length === 2) {
        const _ = new ut().setFromPoints([
          new B(...g[S[0]]),
          new B(...g[S[1]])
        ]), l = new ht({
          color: 16729156,
          linewidth: 4
        });
        Z = new _t(_, l);
      } else {
        const _ = S.map((h) => new B(...g[h]));
        _.push(_[0]);
        const l = new ut().setFromPoints(_), p = new ht({
          color: 16729156,
          linewidth: 4
        });
        Z = new $t(l, p);
      }
      E.scene.add(Z), E.render();
    }, tt = (v) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r;
      P && P.remove();
      const E = C.elements.val, S = C.nodes.val, g = E[v], _ = C.elementInputs.val || {}, l = (_a = C.deformOutputs) == null ? void 0 : _a.val, p = g.length === 2, h = g.length === 3, b = g.length === 4, x = g.length === 8;
      let k = `
      <div class="prop-row"><span class="prop-key">Tipo</span><span class="prop-val">${p ? "Frame (2 nodos)" : h ? "Shell triangular (3 nodos)" : b ? "Shell Q4 (4 nodos)" : x ? "Solid Hex8 (8 nodos)" : `Element (${g.length} nodos)`}</span></div>
      <div class="prop-row"><span class="prop-key">Element idx</span><span class="prop-val">${v}</span></div>
      <div class="prop-row"><span class="prop-key">Nodos</span><span class="prop-val">${g.join(", ")}</span></div>
    `;
      if (p) {
        const d = S[g[0]], a = S[g[1]], e = Math.sqrt((a[0] - d[0]) ** 2 + (a[1] - d[1]) ** 2 + (a[2] - d[2]) ** 2), r = ((_b = _.elasticities) == null ? void 0 : _b.get(v)) || 0, s = ((_c = _.areas) == null ? void 0 : _c.get(v)) || 0, n = ((_d = _.momentsOfInertiaZ) == null ? void 0 : _d.get(v)) || 0, t = ((_e = _.momentsOfInertiaY) == null ? void 0 : _e.get(v)) || 0, i = ((_f = _.shearModuli) == null ? void 0 : _f.get(v)) || 0, c = ((_g = _.torsionalConstants) == null ? void 0 : _g.get(v)) || 0, o = (_h = _.shearAreasY) == null ? void 0 : _h.get(v), m = (_i = _.shearAreasZ) == null ? void 0 : _i.get(v), L = (_j = _.densities) == null ? void 0 : _j.get(v), F = o != null && o < 0 || m != null && m < 0, A = F ? "Bernoulli (As=\u22121)" : o != null && o > 0 || m != null && m > 0 ? "Timoshenko (As expl\xEDcito)" : "Timoshenko (5/6\xB7A default)", D = F ? 0 : (o ?? 0) > 0 ? o : 5 / 6 * s, N = F ? 0 : (m ?? 0) > 0 ? m : 5 / 6 * s, T = !F && D > 0 && i > 0 ? 12 * r * t / (i * D * e * e) : 0, I = !F && N > 0 && i > 0 ? 12 * r * n / (i * N * e * e) : 0, V = r * s / e, H = i * c / e, J = 12 * r * n / (e * e * e) / (1 + I), G = 6 * r * n / (e * e) / (1 + I), rt = 4 * r * n / e * (1 + I / 4) / (1 + I), vt = 2 * r * n / e * (1 - I / 2) / (1 + I), mt = 12 * r * t / (e * e * e) / (1 + T), yt = 6 * r * t / (e * e) / (1 + T), ft = 4 * r * t / e * (1 + T / 4) / (1 + T), gt = 2 * r * t / e * (1 - T / 2) / (1 + T), bt = 2 * (V + H + J + mt + ft + rt);
        k += `
        <div class="section">
          <div class="section-title">Geometr\xEDa</div>
          <div class="prop-row"><span class="prop-key">L</span><span class="prop-val">${f(e)} m</span></div>
        </div>
        <div class="section">
          <div class="section-title">Material</div>
          <div class="prop-row"><span class="prop-key">E</span><span class="prop-val">${f(r)}</span></div>
          <div class="prop-row"><span class="prop-key">G</span><span class="prop-val">${f(i)}</span></div>
          ${L != null ? `<div class="prop-row"><span class="prop-key">\u03C1</span><span class="prop-val">${f(L)}</span></div>` : ""}
        </div>
        <div class="section">
          <div class="section-title">Secci\xF3n</div>
          <div class="prop-row"><span class="prop-key">A</span><span class="prop-val">${f(s)}</span></div>
          <div class="prop-row"><span class="prop-key">Iz (weak)</span><span class="prop-val">${f(n)}</span></div>
          <div class="prop-row"><span class="prop-key">Iy (strong)</span><span class="prop-val">${f(t)}</span></div>
          <div class="prop-row"><span class="prop-key">J</span><span class="prop-val">${f(c)}</span></div>
        </div>
        <div class="section">
          <div class="section-title">Beam Theory</div>
          <div class="prop-row"><span class="prop-key">Tipo</span><span class="prop-val">${A}</span></div>
          <div class="prop-row"><span class="prop-key">AsY (efectiva)</span><span class="prop-val">${f(D)}</span></div>
          <div class="prop-row"><span class="prop-key">AsZ (efectiva)</span><span class="prop-val">${f(N)}</span></div>
          <div class="prop-row"><span class="prop-key">\u03C6Y = 12\xB7E\xB7Iy/(G\xB7AsY\xB7L\xB2)</span><span class="prop-val">${f(T, 4)}</span></div>
          <div class="prop-row"><span class="prop-key">\u03C6Z = 12\xB7E\xB7Iz/(G\xB7AsZ\xB7L\xB2)</span><span class="prop-val">${f(I, 4)}</span></div>
        </div>

        <div class="section">
          <div class="section-title">Matriz K local 12\xD712 \u2014 coeficientes</div>
          <div class="prop-row"><span class="prop-key">EA/L (axial)</span><span class="prop-val">${f(V)}</span></div>
          <div class="prop-row"><span class="prop-key">GJ/L (torsi\xF3n)</span><span class="prop-val">${f(H)}</span></div>
          <table>
            <tr><td class="header">eje Z (Iz)</td><td class="header">tz=12EIz/L\xB3/(1+\u03C6Z)</td><td class="header">bz=6EIz/L\xB2/(1+\u03C6Z)</td><td class="header">kz=4EIz/L\xB7\u03BA\u207A/(1+\u03C6Z)</td><td class="header">az=2EIz/L\xB7\u03BA\u207B/(1+\u03C6Z)</td></tr>
            <tr><td class="header">valor</td><td>${f(J)}</td><td>${f(G)}</td><td>${f(rt)}</td><td>${f(vt)}</td></tr>
            <tr><td class="header">eje Y (Iy)</td><td class="header">ty=12EIy/L\xB3/(1+\u03C6Y)</td><td class="header">by=6EIy/L\xB2/(1+\u03C6Y)</td><td class="header">ky=4EIy/L\xB7\u03BA\u207A/(1+\u03C6Y)</td><td class="header">ay=2EIy/L\xB7\u03BA\u207B/(1+\u03C6Y)</td></tr>
            <tr><td class="header">valor</td><td>${f(mt)}</td><td>${f(yt)}</td><td>${f(ft)}</td><td>${f(gt)}</td></tr>
          </table>
          <div class="hint">\u03BA\u207A = (1+\u03C6/4),  \u03BA\u207B = (1\u2212\u03C6/2). Bernoulli \u21D2 \u03C6=0 \u21D2 \u03BA\u207A=\u03BA\u207B=1.</div>
        </div>

        <div class="section">
          <div class="section-title">Trazas (invariantes)</div>
          <div class="prop-row"><span class="prop-key">tr(K_local)</span><span class="prop-val">${f(bt)}</span></div>
          <div class="prop-row"><span class="prop-key">  = 2(EA/L + GJ/L + tz + ty + kz + ky)</span><span class="prop-val"></span></div>
          <div class="prop-row"><span class="prop-key">det(K_local)</span><span class="prop-val">0 (rank 6, 6 rigid body modes)</span></div>
        </div>
      `;
      } else if (h || b) {
        const d = ((_k = _.elasticities) == null ? void 0 : _k.get(v)) || 0, a = ((_l = _.thicknesses) == null ? void 0 : _l.get(v)) || 0, e = ((_m = _.poissonsRatios) == null ? void 0 : _m.get(v)) || 0, s = ((_n = _.shearModuli) == null ? void 0 : _n.get(v)) || d / (2 * (1 + e)), n = 5 / 6, t = d * a ** 3 / (12 * (1 - e * e)), i = t * 1, c = t * e, o = t * (1 - e) / 2, m = n * s * a, L = d / (1 - e * e), F = L * 1, A = L * e, D = L * (1 - e) / 2, N = i + i + o, T = 2 * m, I = F + F + D;
        k += `
        <div class="section">
          <div class="section-title">Material</div>
          <div class="prop-row"><span class="prop-key">E</span><span class="prop-val">${f(d)}</span></div>
          <div class="prop-row"><span class="prop-key">G</span><span class="prop-val">${f(s)}</span></div>
          <div class="prop-row"><span class="prop-key">\u03BD</span><span class="prop-val">${f(e)}</span></div>
        </div>
        <div class="section">
          <div class="section-title">Shell</div>
          <div class="prop-row"><span class="prop-key">t</span><span class="prop-val">${f(a)} m</span></div>
          <div class="prop-row"><span class="prop-key">k_s (shear corr.)</span><span class="prop-val">5/6 = ${f(n, 4)}</span></div>
        </div>

        <div class="section">
          <div class="section-title">D_bending \u2014 Et\xB3/(12(1\u2212\u03BD\xB2)) \xB7 K_b</div>
          <div class="prop-row"><span class="prop-key">factor = Et\xB3/(12(1\u2212\u03BD\xB2))</span><span class="prop-val">${f(t)}</span></div>
          <table>
            <tr><td class="header"></td><td class="header">\u03BAxx</td><td class="header">\u03BAyy</td><td class="header">\u03BAxy</td></tr>
            <tr><td class="header">Mxx</td><td>${f(i)}</td><td>${f(c)}</td><td>0</td></tr>
            <tr><td class="header">Myy</td><td>${f(c)}</td><td>${f(i)}</td><td>0</td></tr>
            <tr><td class="header">Mxy</td><td>0</td><td>0</td><td>${f(o)}</td></tr>
          </table>
          <div class="prop-row"><span class="prop-key">tr(D_b)</span><span class="prop-val">${f(N)}</span></div>
        </div>

        <div class="section">
          <div class="section-title">D_shear \u2014 k_s\xB7G\xB7t \xB7 I\u2082</div>
          <table>
            <tr><td class="header"></td><td class="header">\u03B3xz</td><td class="header">\u03B3yz</td></tr>
            <tr><td class="header">Qx</td><td>${f(m)}</td><td>0</td></tr>
            <tr><td class="header">Qy</td><td>0</td><td>${f(m)}</td></tr>
          </table>
          <div class="prop-row"><span class="prop-key">tr(D_s)</span><span class="prop-val">${f(T)}</span></div>
        </div>

        <div class="section">
          <div class="section-title">D_membrane \u2014 E/(1\u2212\u03BD\xB2) \xB7 K_m</div>
          <div class="prop-row"><span class="prop-key">factor = E/(1\u2212\u03BD\xB2)</span><span class="prop-val">${f(L)}</span></div>
          <table>
            <tr><td class="header"></td><td class="header">\u03B5xx</td><td class="header">\u03B5yy</td><td class="header">\u03B3xy</td></tr>
            <tr><td class="header">Nxx</td><td>${f(F)}</td><td>${f(A)}</td><td>0</td></tr>
            <tr><td class="header">Nyy</td><td>${f(A)}</td><td>${f(F)}</td><td>0</td></tr>
            <tr><td class="header">Nxy</td><td>0</td><td>0</td><td>${f(D)}</td></tr>
          </table>
          <div class="prop-row"><span class="prop-key">tr(D_m)</span><span class="prop-val">${f(I)}</span></div>
        </div>
      `;
      } else if (x) {
        const d = (_o = _.elasticities) == null ? void 0 : _o.get(v), a = (_p = _.poissonsRatios) == null ? void 0 : _p.get(v);
        k += `
        <div class="section">
          <div class="section-title">Material</div>
          <div class="prop-row"><span class="prop-key">E</span><span class="prop-val">${f(d)}</span></div>
          <div class="prop-row"><span class="prop-key">\u03BD</span><span class="prop-val">${f(a)}</span></div>
        </div>
      `;
      }
      let u = '<table><tr><td class="header">Nodo</td><td class="header">X</td><td class="header">Y</td><td class="header">Z</td>';
      (l == null ? void 0 : l.deformations) && (u += '<td class="header">uX</td><td class="header">uY</td><td class="header">uZ</td>'), u += "</tr>";
      for (const d of g) {
        const a = S[d];
        if (u += `<tr><td class="header">${d}</td><td>${f(a[0])}</td><td>${f(a[1])}</td><td>${f(a[2])}</td>`, l == null ? void 0 : l.deformations) {
          const e = l.deformations.get(d);
          e ? u += `<td>${f(e[0] * 1e3, 3)}</td><td>${f(e[1] * 1e3, 3)}</td><td>${f(e[2] * 1e3, 3)}</td>` : u += "<td>\u2014</td><td>\u2014</td><td>\u2014</td>";
        }
        u += "</tr>";
      }
      u += "</table>", (l == null ? void 0 : l.deformations) && (u += '<div class="hint">Desplazamientos en mm.</div>'), k += `
      <div class="section">
        <div class="section-title">Nodos & Desplazamientos</div>
        ${u}
      </div>
    `;
      const y = (_q = C.analyzeOutputs) == null ? void 0 : _q.val;
      if (y && (b || h)) {
        const d = [
          [
            "\u03C3 pressure",
            y.pressure,
            "kN/m\xB2"
          ],
          [
            "bending Mxx",
            y.bendingXX,
            "kN\xB7m/m"
          ],
          [
            "bending Myy",
            y.bendingYY,
            "kN\xB7m/m"
          ],
          [
            "bending Mxy",
            y.bendingXY,
            "kN\xB7m/m"
          ],
          [
            "membrane Nxx",
            y.membraneXX,
            "kN/m"
          ],
          [
            "membrane Nyy",
            y.membraneYY,
            "kN/m"
          ],
          [
            "membrane Nxy",
            y.membraneXY,
            "kN/m"
          ],
          [
            "shear Qx",
            y.shearX,
            "kN/m"
          ],
          [
            "shear Qy",
            y.shearY,
            "kN/m"
          ],
          [
            "von Mises",
            y.vonMises,
            "kN/m\xB2"
          ]
        ].filter(([a, e]) => e && e.size > 0);
        if (d.length > 0) {
          let a = '<table><tr><td class="header">campo</td>';
          for (let e = 0; e < g.length; e++) a += `<td class="header">n${g[e]}</td>`;
          a += '<td class="header">prom</td><td class="header">unid</td></tr>';
          for (const [e, r, s] of d) {
            const n = r.get(v);
            if (!n) continue;
            a += `<tr><td class="header">${e}</td>`;
            let t = 0, i = 0;
            for (let o = 0; o < g.length; o++) {
              const m = n[o];
              m != null && (t += m, i++), a += `<td>${f(m, 3)}</td>`;
            }
            const c = i > 0 ? t / i : NaN;
            a += `<td>${f(c, 3)}</td><td style="text-align:left">${s}</td></tr>`;
          }
          a += "</table>", k += `
          <div class="section">
            <div class="section-title">Resultados an\xE1lisis (por nodo del elemento)</div>
            ${a}
            <div class="hint">Valores por nodo del elemento (interpolados desde Gauss).</div>
          </div>
        `;
        }
      }
      if (p && (l == null ? void 0 : l.deformations)) {
        const d = l.deformations.get(g[0]), a = l.deformations.get(g[1]);
        if (d && a) {
          const e = S[g[0]], r = S[g[1]], s = r[0] - e[0], n = r[1] - e[1], t = r[2] - e[2], i = Math.sqrt(s * s + n * n + t * t), c = [
            s / i,
            n / i,
            t / i
          ], o = [
            a[0] - d[0],
            a[1] - d[1],
            a[2] - d[2]
          ], m = o[0] * c[0] + o[1] * c[1] + o[2] * c[2], L = m / i, F = Math.sqrt((o[0] - m * c[0]) ** 2 + (o[1] - m * c[1]) ** 2 + (o[2] - m * c[2]) ** 2);
          k += `
          <div class="section">
            <div class="section-title">Deformaci\xF3n del elemento</div>
            <div class="prop-row"><span class="prop-key">\u0394u axial (j\u2212i)\xB7\xEA</span><span class="prop-val">${f(m * 1e3, 4)} mm</span></div>
            <div class="prop-row"><span class="prop-key">\u03B5 axial</span><span class="prop-val">${f(L, 6)}</span></div>
            <div class="prop-row"><span class="prop-key">|\u0394u transversal|</span><span class="prop-val">${f(F * 1e3, 4)} mm</span></div>
          </div>
        `;
        }
      }
      P = document.createElement("div"), P.className = "hk-inspect-panel", P.innerHTML = `
      <h3>
        <span>\u{1F50D} Inspect \u2014 Element ${v}</span>
        <button class="close-btn" title="Cerrar">\u2715</button>
      </h3>
      ${k}
      <div class="hint">Click otro elemento para inspeccionarlo. Click X o "Inspect" para cerrar.<br/>Arrastr\xE1 del t\xEDtulo para mover el panel.</div>
    `, (_r = P.querySelector(".close-btn")) == null ? void 0 : _r.addEventListener("click", () => {
        U();
      });
      try {
        const d = localStorage.getItem("hk_inspect_panel_pos");
        if (d) {
          const { left: a, top: e } = JSON.parse(d);
          typeof a == "number" && typeof e == "number" && (P.style.left = `${a}px`, P.style.top = `${e}px`);
        }
      } catch {
      }
      const z = P.querySelector("h3");
      if (z) {
        let d = false, a = 0, e = 0, r = 0, s = 0;
        z.addEventListener("mousedown", (n) => {
          if (n.target.classList.contains("close-btn")) return;
          d = true, a = n.clientX, e = n.clientY;
          const t = P.getBoundingClientRect();
          r = t.left, s = t.top, P.style.left = `${r}px`, P.style.top = `${s}px`, n.preventDefault();
        }), window.addEventListener("mousemove", (n) => {
          if (!d || !P) return;
          const t = n.clientX - a, i = n.clientY - e, c = Math.max(0, Math.min(window.innerWidth - 100, r + t)), o = Math.max(0, Math.min(window.innerHeight - 50, s + i));
          P.style.left = `${c}px`, P.style.top = `${o}px`;
        }), window.addEventListener("mouseup", () => {
          if (!(!d || !P)) {
            d = false;
            try {
              localStorage.setItem("hk_inspect_panel_pos", JSON.stringify({
                left: parseFloat(P.style.left),
                top: parseFloat(P.style.top)
              }));
            } catch {
            }
          }
        });
      }
      document.body.appendChild(P);
    }, U = () => {
      P && (P.remove(), P = null), Q();
    };
    let q = null, O = null;
    const j = (v) => {
      const E = Y();
      if (!E) return false;
      const S = E.renderer.domElement;
      return v.target === S || S.contains(v.target);
    }, at = () => {
      const v = Y();
      if (!v) {
        console.warn("[Inspect] viewer ctx not ready yet");
        return;
      }
      const E = v.renderer.domElement;
      q = (g) => {
        if (!j(g)) return;
        const _ = W(g);
        _ >= 0 && (g.preventDefault(), g.stopImmediatePropagation(), M(_), tt(_));
      };
      const S = (g) => {
        if (!j(g)) return;
        W(g) >= 0 && (g.preventDefault(), g.stopImmediatePropagation());
      };
      O = (g) => {
        if (!j(g)) return;
        const _ = W(g);
        E.style.cursor = _ >= 0 ? "pointer" : "default";
      }, window.addEventListener("click", q, true), window.addEventListener("mousedown", S, true), E.addEventListener("mousemove", O), q.__mousedownPair = S;
    }, et = () => {
      const v = Y();
      if (q) {
        window.removeEventListener("click", q, true);
        const E = q.__mousedownPair;
        E && window.removeEventListener("mousedown", E, true);
      }
      if (v && O) {
        const E = v.renderer.domElement;
        E.removeEventListener("mousemove", O), E.style.cursor = "default";
      }
      q = null, O = null, U();
    };
    R.addEventListener("click", () => {
      X = !X, R.classList.toggle("active", X), R.textContent = X ? "\u{1F50D} Inspect (ON)" : "\u{1F50D} Inspect", X ? setTimeout(at, 50) : et();
    });
  }
  K.derive(() => {
    Lt.val = nt.val;
  });
  K.derive(() => {
    Et.val = it.val;
  });
  Kt = function(w) {
    const C = K.state([]), Y = K.state([]), X = K.state({}), P = K.state({}), Z = K.state({}), R = K.state({}), W = K.state([]), Q = {
      nodes: C,
      elements: Y,
      nodeInputs: X,
      elementInputs: P,
      deformOutputs: Z,
      analyzeOutputs: R,
      objects3D: W
    }, M = Object.fromEntries(Object.entries(w.params).map(([l, p]) => {
      const h = p.default;
      return p.unitType === "force" ? [
        l,
        Ft(h)
      ] : p.unitType === "moment" ? [
        l,
        It(h)
      ] : [
        l,
        h
      ];
    })), tt = () => {
      const l = {
        ...M
      };
      for (const [p, h] of Object.entries(w.params)) h.unitType === "force" && (l[p] = Ot(M[p])), h.unitType === "moment" && (l[p] = jt(M[p]));
      return l;
    };
    let U = null, q = null;
    const O = () => {
      if (w.build(tt(), Q), w.computedLabels && U && q) {
        const l = w.computedLabels(tt(), Q);
        for (const p of Object.keys(U)) p in l && (U[p] = l[p]);
        for (const p of Object.keys(l)) p in U || (U[p] = l[p]);
        q.refresh();
      }
    }, j = document.createElement("div"), at = `hk_paneHostPos_${w.id}`, et = (() => {
      try {
        const l = localStorage.getItem(at);
        if (l) return JSON.parse(l);
      } catch {
      }
      return null;
    })();
    j.style.cssText = "position:fixed;" + (et ? `left:${et.left}px;top:${et.top}px;right:auto;` : "top:16px;right:16px;") + "width:min(320px,calc(100vw - 32px));max-width:90vw;z-index:100;max-height:90vh;overflow-y:auto;font-size:12px;box-shadow:0 6px 24px rgba(0,0,0,0.35);border:1px solid rgba(255,255,255,0.08);", document.body.appendChild(j);
    let v = null;
    const E = () => {
      v && v.dispose(), j.innerHTML = "";
      const l = new Mt({
        container: j,
        title: w.name
      });
      if (v = l, q = l, setTimeout(() => {
        const s = j.querySelector(".tp-rotv_b, .tp-fldv_b");
        if (!s) return;
        s.style.cursor = "move", s.style.userSelect = "none";
        let n = false, t = 0, i = 0, c = 0, o = 0;
        s.addEventListener("mousedown", (m) => {
          n = true, t = m.clientX, i = m.clientY;
          const L = j.getBoundingClientRect();
          c = L.left, o = L.top, j.style.right = "auto", j.style.left = `${c}px`, j.style.top = `${o}px`, m.preventDefault();
        }), window.addEventListener("mousemove", (m) => {
          if (!n) return;
          const L = m.clientX - t, F = m.clientY - i, A = Math.max(0, Math.min(window.innerWidth - 40, c + L)), D = Math.max(0, Math.min(window.innerHeight - 40, o + F));
          j.style.left = `${A}px`, j.style.top = `${D}px`;
        }), window.addEventListener("mouseup", () => {
          if (n) {
            n = false;
            try {
              localStorage.setItem(at, JSON.stringify({
                left: parseFloat(j.style.left),
                top: parseFloat(j.style.top)
              }));
            } catch {
            }
          }
        });
      }, 0), /^(zapata|guerra-ej|safe-bench-)/.test(w.id)) {
        const s = l.addFolder({
          title: "\u{1F4C4} SAFE F2K",
          expanded: false
        });
        s.addButton({
          title: "\u{1F4E4} Exportar a SAFE (.f2k)"
        }).on("click", async () => {
          try {
            const t = M;
            if (typeof w.exportF2k == "function") {
              w.exportF2k(t);
              return;
            }
            const { downloadZapataF2k: i } = await ot(async () => {
              const { downloadZapataF2k: T } = await import("./f2kExporter-CcrVIqWt.js");
              return {
                downloadZapataF2k: T
              };
            }, []), c = t.ks_factor ?? 10.5, o = t.q_adm ?? 20, m = c * o * 9.80665, L = (t.useSimple ?? 1) >= 0.5, F = L ? (t.P_simple ?? 0) * 9.80665 : (t.P_D ?? 10) * 9.80665, A = L ? 0 : (t.P_L ?? 5) * 9.80665, D = L ? (t.Mx_simple ?? 0) * 9.80665 : (t.Mx_D ?? 0) * 9.80665, N = L ? (t.My_simple ?? 0) * 9.80665 : (t.My_D ?? 0) * 9.80665;
            i({
              Lz: t.Lz ?? 1.5,
              Bz: t.Bz ?? 1.5,
              tz: t.tz ?? 0.3,
              bc: t.bc ?? 0.4,
              ks_kNm3: m,
              P_dead_kN: F,
              P_live_kN: A,
              Mx_dead_kNm: D,
              My_dead_kNm: N
            }, `Zapata_Hekatan_${Date.now()}.f2k`), alert(`F2K descargado.
ks=${m.toFixed(0)} kN/m\xB3, P_dead=${F.toFixed(1)} kN.
Abrilo en SAFE: File \u2192 Import \u2192 SAFE Text File.`);
          } catch (t) {
            alert(`Error: ${(t == null ? void 0 : t.message) ?? t}`);
          }
        });
        const n = async (t, i) => {
          const { parseZapataF2k: c } = await ot(async () => {
            const { parseZapataF2k: m } = await import("./f2kImporter-Cp9ARV1y.js");
            return {
              parseZapataF2k: m
            };
          }, []), o = c(t);
          return o.Lz != null && (M.Lz = o.Lz), o.Bz != null && (M.Bz = o.Bz), o.tz != null && (M.tz = o.tz), o.bc != null && (M.bc = o.bc), o.q_adm != null && (M.q_adm = o.q_adm), o.ks_factor != null && (M.ks_factor = o.ks_factor), o.ks_kNm3 != null && (M.ks = o.ks_kNm3), o.P_dead_tonf != null && (M.useSimple = 1, M.P_simple = o.P_dead_tonf, M.useD = 0, M.useL = 0, M.useS = 0), o.Mx_dead_tonfm != null && (M.Mx_simple = o.Mx_dead_tonfm), o.My_dead_tonfm != null && (M.My_simple = o.My_dead_tonfm), o.q_adm != null && o.ks_factor != null && (M.soilType = 0), E(), O(), o;
        };
        window.__hekatanImportF2kText = n, s.addButton({
          title: "\u{1F4E5} Importar F2K\u2026"
        }).on("click", () => {
          const t = document.createElement("input");
          t.type = "file", t.accept = ".f2k,.txt", t.onchange = async (i) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _i;
            const c = (_a = i.target.files) == null ? void 0 : _a[0];
            if (c) try {
              const o = await c.text(), m = await n(o, c.name);
              alert(`F2K importado: ${c.name}

Geometr\xEDa:
  Lz = ${(_b = m.Lz) == null ? void 0 : _b.toFixed(2)} m, Bz = ${(_c = m.Bz) == null ? void 0 : _c.toFixed(2)} m, tz = ${(_d = m.tz) == null ? void 0 : _d.toFixed(2)} m
  Columna = ${(_e = m.bc) == null ? void 0 : _e.toFixed(2)} m

Suelo:
  ks = ${(_f = m.ks_kNm3) == null ? void 0 : _f.toFixed(0)} kN/m\xB3
  q_adm = ${(_g = m.q_adm) == null ? void 0 : _g.toFixed(1)} tonf/m\xB2  ks_factor = ${(_h = m.ks_factor) == null ? void 0 : _h.toFixed(1)}

Cargas (modo Simple):
  P = ${(_i = m.P_dead_tonf) == null ? void 0 : _i.toFixed(2)} tonf
  Mx = ${(m.Mx_dead_tonfm ?? 0).toFixed(2)} tonf\xB7m
  My = ${(m.My_dead_tonfm ?? 0).toFixed(2)} tonf\xB7m

\u2713 Los sliders del Tweakpane se actualizaron.`);
            } catch (o) {
              alert(`Error: ${(o == null ? void 0 : o.message) ?? o}`);
            }
          }, t.click();
        }), s.addButton({
          title: "\u{1F40D} Exportar a OpenSeesPy (.py)"
        }).on("click", async () => {
          try {
            const { exportZapataOpsPy: t } = await ot(async () => {
              const { exportZapataOpsPy: A } = await import("./opsPyExporter-poZ71N0w.js");
              return {
                exportZapataOpsPy: A
              };
            }, []), i = M, c = (i.ks_factor ?? 10.5) * (i.q_adm ?? 20) * 9.80665, o = (i.useSimple ?? 1) >= 0.5, m = t({
              Lz: i.Lz ?? 1.5,
              Bz: i.Bz ?? 1.5,
              tz: i.tz ?? 0.3,
              bc: i.bc ?? 0.4,
              ks_kNm3: c,
              P_dead_kN: o ? (i.P_simple ?? 0) * 9.80665 : (i.P_D ?? 10) * 9.80665,
              P_live_kN: o ? 0 : (i.P_L ?? 5) * 9.80665
            }), L = new Blob([
              m
            ], {
              type: "text/x-python"
            }), F = document.createElement("a");
            F.href = URL.createObjectURL(L), F.download = `Zapata_Hekatan_${Date.now()}.py`, F.click(), alert(`OpenSeesPy script descargado.
Ejecutar: python -X utf8 <archivo>.py`);
          } catch (t) {
            alert(`Error: ${(t == null ? void 0 : t.message) ?? t}`);
          }
        });
      }
      const p = l.addFolder({
        title: "Unidades",
        expanded: false
      }), h = {
        force: nt.val,
        disp: it.val
      };
      p.addBinding(h, "force", {
        label: "Fuerza",
        options: {
          kN: "kN",
          tonf: "tonf",
          kip: "kip"
        }
      }).on("change", (s) => {
        const n = nt.val, t = s.value;
        if (n !== t) {
          const i = n === "kN" ? 1 : n === "tonf" ? 9.80665 : 4.4482216, c = t === "kN" ? 1 : t === "tonf" ? 9.80665 : 4.4482216;
          for (const [o, m] of Object.entries(w.params)) (m.unitType === "force" || m.unitType === "moment") && (M[o] = M[o] * i / c);
        }
        nt.val = t, E(), O();
      }), p.addBinding(h, "disp", {
        label: "Desplazamiento",
        options: {
          mm: "mm",
          cm: "cm",
          m: "m",
          in: "in"
        }
      }).on("change", (s) => {
        it.val = s.value, E(), O();
      });
      const b = p.addFolder({
        title: "\u{1F310} Sistema (preset)",
        expanded: true
      }), x = {
        sistema: st()
      };
      b.addBinding(x, "sistema", {
        label: "Preset",
        options: {
          "Metric MKS (tonf, m, mm, kgf/cm\xB2)": "Metric MKS",
          "Metric SI (kN, m, mm, MPa)": "Metric SI",
          "U.S. Imperial (kip, ft, in, ksi)": "U.S. Imperial",
          "Custom (granular)": "Custom"
        }
      }).on("change", (s) => {
        s.value !== "Custom" && (Dt(s.value), h.force = nt.val, h.disp = it.val, k.stress = lt.val, k.subgrade = ct.val, k.stiffTrans = dt.val, k.lengthSection = pt.val, l.refresh(), E(), O());
      });
      const $ = p.addFolder({
        title: "\u{1F4D0} Display Units (granular)",
        expanded: false
      }), k = {
        stress: lt.val,
        subgrade: ct.val,
        stiffTrans: dt.val,
        lengthSection: pt.val
      };
      $.addBinding(k, "stress", {
        label: "Stress",
        options: {
          "kN/m\xB2": "kN/m\xB2",
          kPa: "kPa",
          MPa: "MPa",
          GPa: "GPa",
          "kgf/cm\xB2": "kgf/cm\xB2",
          "tonf/m\xB2": "tonf/m\xB2",
          psi: "psi",
          ksi: "ksi",
          "kip/ft\xB2": "kip/ft\xB2"
        }
      }).on("change", (s) => {
        lt.val = s.value, x.sistema = st(), l.refresh(), O();
      }), $.addBinding(k, "subgrade", {
        label: "Subgrade ks",
        options: {
          "kN/m\xB3": "kN/m\xB3",
          "tonf/m\xB3": "tonf/m\xB3",
          "kgf/cm\xB3": "kgf/cm\xB3",
          "kip/ft\xB3": "kip/ft\xB3",
          pci: "pci"
        }
      }).on("change", (s) => {
        ct.val = s.value, x.sistema = st(), l.refresh(), O();
      }), $.addBinding(k, "stiffTrans", {
        label: "Stiffness K",
        options: {
          "kN/m": "kN/m",
          "tonf/m": "tonf/m",
          "kip/in": "kip/in",
          "kip/ft": "kip/ft",
          "N/mm": "N/mm"
        }
      }).on("change", (s) => {
        dt.val = s.value, x.sistema = st(), l.refresh(), O();
      }), $.addBinding(k, "lengthSection", {
        label: "Length section",
        options: {
          mm: "mm",
          cm: "cm",
          m: "m",
          in: "in",
          ft: "ft"
        }
      }).on("change", (s) => {
        pt.val = s.value, x.sistema = st(), l.refresh(), O();
      });
      const u = "Par\xE1metros", y = /* @__PURE__ */ new Map(), z = (s) => s === u || /\bmodo\b/i.test(s) || /activar/i.test(s) || /combinaci/i.test(s), d = (s) => (y.has(s) || y.set(s, l.addFolder({
        title: s,
        expanded: z(s)
      })), y.get(s));
      let a = null;
      const e = () => {
        a !== null && clearTimeout(a), a = window.setTimeout(() => {
          a = null, O();
        }, 120);
      }, r = {};
      for (const [s, n] of Object.entries(w.params)) {
        const t = n.folder ?? u, i = d(t);
        if (n.boolean) {
          r[s] = M[s] >= 0.5, i.addBinding(r, s, {
            label: n.label ?? s
          }).on("change", (L) => {
            M[s] = L.value ? 1 : 0, w.onParamChange && (w.onParamChange(s, M), l.refresh()), e();
          });
          continue;
        }
        const c = Nt(n.label ?? s), o = n.unitType === "force" ? ` ${Ct()}` : n.unitType === "moment" ? ` ${At()}` : n.unitType === "disp" ? ` ${Bt()}` : "", m = {
          label: c + o
        };
        n.options !== void 0 ? m.options = n.options : (n.min !== void 0 && (m.min = n.min), n.max !== void 0 && (m.max = n.max), n.step !== void 0 && (m.step = n.step)), i.addBinding(M, s, m).on("change", () => {
          w.onParamChange && (w.onParamChange(s, M), l.refresh()), e();
        });
      }
      if (w.computedLabels) {
        const s = l.addFolder({
          title: "\u{1F4CA} Resultados",
          expanded: true
        }), n = w.computedLabels(tt(), Q);
        U = U ?? {};
        for (const t of Object.keys(n)) U[t] = n[t];
        for (const t of Object.keys(n)) s.addBinding(U, t, {
          readonly: true,
          view: "text",
          interval: 0
        });
      }
    };
    E();
    const S = zt({
      mesh: {
        nodes: C,
        elements: Y,
        nodeInputs: X,
        elementInputs: P,
        deformOutputs: Z,
        analyzeOutputs: R
      },
      objects3D: W,
      settingsObj: {
        deformedShape: true,
        displayScale: -1.5,
        shellResults: w.defaultShellResult ?? "displacementZ",
        gridSize: 10,
        showCotas: true
      }
    });
    document.body.append(S, Pt({
      sourceCode: "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal",
      author: "https://www.linkedin.com/in/jorge-burbano-213741138/"
    })), Yt(S, {
      nodes: C,
      elements: Y,
      elementInputs: P,
      deformOutputs: Z,
      analyzeOutputs: R
    }), O();
    const g = () => window.__hekatanOutputsFolder ?? q;
    try {
      const l = g();
      if (l == null ? void 0 : l.addButton) {
        const p = l.addButton({
          title: "\u25B6 Ejecutar analisis",
          index: 0
        });
        p.on("click", async () => {
          const h = p.title;
          try {
            p.title = "\u23F3 resolviendo\u2026", await new Promise((b) => setTimeout(b, 30)), O();
          } catch (b) {
            console.error("[ejecutar]", b), alert(`El analisis fallo: ${(b == null ? void 0 : b.message) ?? b}`);
          } finally {
            p.title = h;
          }
        });
      }
    } catch (l) {
      console.warn("[ejecutar] no se pudo montar:", (l == null ? void 0 : l.message) ?? l);
    }
    try {
      const l = g();
      if (l == null ? void 0 : l.addFolder) {
        const p = l.addFolder({
          title: "\u26A1 Modal",
          expanded: false
        }), h = {
          modos: 12
        };
        let b = null;
        const x = {
          modo: 1,
          info: "\u2014",
          freq: "\u2014",
          periodo: "\u2014",
          dir: "\u2014"
        }, $ = () => {
          if (!b) return;
          const d = b.getStatus();
          x.info = d.state, x.freq = d.frequency, x.periodo = d.period, x.dir = d.dominant;
          try {
            p.refresh();
          } catch {
          }
        }, k = () => (b || (b = St({
          mesh: {
            nodes: C,
            elements: Y,
            deformOutputs: Z,
            analyzeOutputs: R
          },
          viewerElm: S,
          onStatusChange: $
        })), b);
        p.addBinding(h, "modos", {
          min: 1,
          max: 60,
          step: 1,
          label: "N\xBA de modos"
        });
        let u = null;
        const y = p.addButton({
          title: "\u25B6 Correr modal"
        });
        y.on("click", async () => {
          var _a, _b;
          const d = C.rawVal || [], a = Y.rawVal || [], e = X.rawVal || {}, r = P.rawVal || {};
          if (!d.length || !a.length) {
            alert("No hay modelo que analizar.");
            return;
          }
          if (!((_a = e.supports) == null ? void 0 : _a.size)) {
            alert("El modelo no tiene apoyos: sin ellos el modal no tiene sentido.");
            return;
          }
          if (!((_b = r.densities) == null ? void 0 : _b.size)) {
            alert("Las barras no tienen densidad: sin masa no hay modos.");
            return;
          }
          u || (u = Tt(), document.body.appendChild(u.div));
          const s = y.title, n = (t) => {
            try {
              y.title = t;
            } catch {
            }
          };
          try {
            if (typeof w.runModal == "function") {
              n("\u23F3 calculando\u2026"), await new Promise((D) => setTimeout(D, 30)), w.runModal(tt(), Q, u), n(s);
              return;
            }
            n("\u23F3 calculando\u2026");
            const t = new Worker(new URL("/hekatan-struct-lineal/assets/modal.worker-Ci_6cdZt.js", import.meta.url), {
              type: "module"
            }), i = (D) => {
              const N = {};
              for (const [T, I] of Object.entries(D ?? {})) I instanceof Map && (N[T] = [
                ...I.entries()
              ]);
              return N;
            };
            let c = false, o = false;
            const m = async (D) => {
              if (!c) {
                c = true;
                try {
                  t.terminate();
                } catch {
                }
                console.warn(`[modal] ${D}: se resuelve en el hilo principal`), n("\u23F3 calculando (sin worker)\u2026"), await new Promise((N) => setTimeout(N, 30));
                try {
                  const { modalAnalysis: N } = await ot(async () => {
                    const { modalAnalysis: I } = await import("./index-BTBFNVjz.js").then(async (m2) => {
                      await m2.__tla;
                      return m2;
                    });
                    return {
                      modalAnalysis: I
                    };
                  }, __vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10])), T = N(d, a, e, r, h.modos);
                  u.render(T, {
                    title: w.name,
                    properties: []
                  });
                  try {
                    k().setResults(T), $();
                  } catch {
                  }
                } catch (N) {
                  console.error("[modal]", N), alert(`El modal fallo: ${(N == null ? void 0 : N.message) ?? N}`);
                }
                n(s);
              }
            }, L = setTimeout(() => {
              !o && !c && m("el worker no dio se\xF1al de vida en 8 s");
            }, 8e3), F = Date.now(), A = setInterval(() => {
              if (c) {
                clearInterval(A);
                return;
              }
              n(`\u23F3 calculando\u2026 ${Math.round((Date.now() - F) / 1e3)} s`);
            }, 1e3);
            t.onmessage = (D) => {
              var _a2;
              if (c) return;
              if ((_a2 = D.data) == null ? void 0 : _a2.vivo) {
                o = true;
                return;
              }
              c = true, clearTimeout(L), clearInterval(A);
              const { ok: N, m: T, error: I } = D.data ?? {};
              if (n(s), t.terminate(), !N) {
                console.error("[modal]", I), alert(`El modal fallo: ${I}`);
                return;
              }
              u.render(T, {
                title: w.name,
                properties: []
              });
              try {
                k().setResults(T), $();
              } catch {
              }
            }, t.onerror = (D) => {
              clearTimeout(L), clearInterval(A), console.error("[modal worker]", D), m("el worker fallo al arrancar");
            }, t.postMessage({
              nodes: d,
              elements: a,
              nodeInputs: i(e),
              elementInputs: i(r),
              nModes: h.modos
            });
          } catch (t) {
            n(s), console.error("[modal]", t), alert(`El modal fallo: ${(t == null ? void 0 : t.message) ?? t}`);
          }
        }), p.addBinding(x, "modo", {
          min: 1,
          max: 60,
          step: 1,
          label: "Modo a ver"
        }).on("change", (d) => {
          if (!b || b.modeCount() === 0) return;
          const a = Math.min(Math.max(1, Math.round(d.value)), b.modeCount()) - 1;
          b.isPlaying() ? b.setMode(a) : b.showStatic(a), $();
        });
        const z = p.addButton({
          title: "\u25B6 Animar modo"
        });
        z.on("click", () => {
          const d = k();
          if (d.modeCount() === 0) {
            alert("Primero hay que correr el modal: no hay modos que animar.");
            return;
          }
          if (d.isPlaying()) {
            d.stop();
            try {
              z.title = "\u25B6 Animar modo";
            } catch {
            }
          } else {
            d.setMode(Math.min(Math.max(1, x.modo), d.modeCount()) - 1), d.play();
            try {
              z.title = "\u23F9 Parar animacion";
            } catch {
            }
          }
          $();
        }), p.addBinding(x, "freq", {
          readonly: true,
          label: "Frecuencia"
        }), p.addBinding(x, "periodo", {
          readonly: true,
          label: "Periodo"
        }), p.addBinding(x, "dir", {
          readonly: true,
          label: "Direccion"
        }), p.addBinding(x, "info", {
          readonly: true,
          label: "Estado"
        });
      }
    } catch (l) {
      console.warn("[modal] no se pudo montar:", (l == null ? void 0 : l.message) ?? l);
    }
    try {
      const l = g();
      if (l == null ? void 0 : l.addFolder) {
        const p = l.addFolder({
          title: "\u{1F527} Design",
          expanded: false
        }), h = {
          limite: 360
        };
        p.addBinding(h, "limite", {
          options: {
            "L/360 (entrepiso)": 360,
            "L/240": 240,
            "L/180 (cubierta)": 180
          },
          label: "L\xEDmite de flecha"
        }), p.addButton({
          title: "\u25B6 Comprobar servicio"
        }).on("click", () => {
          const b = C.rawVal || [], x = Y.rawVal || [], k = (Z.rawVal || {}).deformations;
          if (!k || !k.size) {
            alert("Primero hay que resolver el modelo.");
            return;
          }
          const u = [], y = (r) => {
            const s = b[r[0]], n = b[r[1]], t = Math.hypot(n[0] - s[0], n[1] - s[1], n[2] - s[2]);
            return t < 1e-9 ? null : [
              (n[0] - s[0]) / t,
              (n[1] - s[1]) / t,
              (n[2] - s[2]) / t
            ];
          }, z = /* @__PURE__ */ new Map();
          x.forEach((r, s) => {
            if (!(!r || r.length !== 2)) for (const n of r) z.has(n) || z.set(n, []), z.get(n).push(s);
          });
          const d = /* @__PURE__ */ new Set();
          let a = null;
          for (let r = 0; r < x.length; r++) {
            const s = x[r];
            if (!s || s.length !== 2 || d.has(r)) continue;
            const n = y(s);
            if (!n) continue;
            const t = [
              r
            ];
            d.add(r);
            const i = [
              s[0],
              s[1]
            ];
            for (let T = 0; T < 2; T++) {
              let I = i[T];
              for (; ; ) {
                const V = (z.get(I) || []).filter((J) => !d.has(J)).find((J) => {
                  const G = y(x[J]);
                  return G ? Math.abs(G[0] * n[0] + G[1] * n[1] + G[2] * n[2]) > 0.999 : false;
                });
                if (V === void 0) break;
                d.add(V), t.push(V);
                const H = x[V];
                I = H[0] === I ? H[1] : H[0], i[T] = I;
              }
            }
            const c = b[i[0]], o = b[i[1]], m = Math.hypot(o[0] - c[0], o[1] - c[1], o[2] - c[2]);
            if (m < 1) continue;
            const L = (k.get(i[0]) || [
              0,
              0,
              0
            ])[2], F = (k.get(i[1]) || [
              0,
              0,
              0
            ])[2];
            let A = 0;
            for (const T of t) for (const I of x[T]) {
              const V = b[I], H = m < 1e-9 ? 0 : ((V[0] - c[0]) * (o[0] - c[0]) + (V[1] - c[1]) * (o[1] - c[1]) + (V[2] - c[2]) * (o[2] - c[2])) / (m * m), J = L + (F - L) * H, G = Math.abs((k.get(I) || [
                0,
                0,
                0
              ])[2] - J) * 1e3;
              G > A && (A = G);
            }
            const D = m / h.limite * 1e3, N = A / D;
            (!a || N > a.r) && (a = {
              i: r,
              L: m,
              f: A,
              lim: D,
              r: N
            });
          }
          if (!a) {
            alert("No hay barras con luz suficiente que comprobar.");
            return;
          }
          const e = a.r <= 1;
          u.push(`L\xEDmite: L/${h.limite}`), u.push(`Barra m\xE1s solicitada: luz ${a.L.toFixed(2)} m`), u.push(`   flecha ${a.f.toFixed(1)} mm  \xB7  l\xEDmite ${a.lim.toFixed(1)} mm`), u.push(`   ratio ${a.r.toFixed(2)}  ->  ${e ? "CUMPLE" : "NO CUMPLE"}`), u.push(""), u.push("Falta: resistencia AISC 360 (P-M, pandeo, cortante)"), u.push("y composite beam. Esto comprueba SERVICIO."), alert(u.join(`
`));
        });
      }
    } catch (l) {
      console.warn("[design] no se pudo montar:", (l == null ? void 0 : l.message) ?? l);
    }
    try {
      const l = S, p = [
        [
          "Design \u25B8 Steel Frame Design",
          "Design"
        ],
        [
          "Design \u25B8 Composite Beam Design",
          "Design"
        ],
        [
          "",
          ""
        ],
        [
          "Assign \u25B8 Frame \u25B8 Section Property",
          "Ver"
        ],
        [
          "Assign \u25B8 Frame \u25B8 Local Axes",
          "Ver"
        ],
        [
          "Display \u25B8 Frame Forces",
          "Analyze"
        ],
        [
          "Display \u25B8 Shell Forces",
          "Analyze"
        ],
        [
          "",
          ""
        ],
        [
          "Analyze \u25B8 Run Modal",
          "Modal"
        ],
        [
          "Analyze \u25B8 Tablas",
          "Analyze"
        ]
      ], h = document.createElement("div");
      h.style.cssText = [
        "position:fixed",
        "display:none",
        "z-index:9500",
        "min-width:230px",
        "background:#232a35",
        "border:1px solid #3a4150",
        "border-radius:6px",
        "padding:4px 0",
        "color:#cfd6e0",
        "font:12px ui-monospace,Consolas,monospace",
        "box-shadow:0 8px 28px rgba(0,0,0,.45)"
      ].join(";"), document.body.appendChild(h);
      const b = () => {
        h.style.display = "none";
      };
      window.addEventListener("click", b), window.addEventListener("blur", b);
      const x = (y) => {
        const z = (d) => {
          var _a, _b;
          for (const a of (d == null ? void 0 : d.children) ?? []) if (typeof a.title == "string" && a.children) {
            if (a.title.toLowerCase().includes(y.toLowerCase())) {
              try {
                a.expanded = true;
              } catch {
              }
              try {
                (_b = (_a = a.element) == null ? void 0 : _a.scrollIntoView) == null ? void 0 : _b.call(_a, {
                  block: "nearest"
                });
              } catch {
              }
              return true;
            }
            if (z(a)) return true;
          }
          return false;
        };
        return z(q);
      };
      let $ = 0, k = 0, u = 0;
      l.addEventListener("pointerdown", (y) => {
        y.button === 2 && ($ = y.clientX, k = y.clientY, u = Date.now());
      }, true), l.addEventListener("contextmenu", (y) => {
        if (y.preventDefault(), Math.hypot(y.clientX - $, y.clientY - k) > 5 || Date.now() - u > 400) return;
        y.stopPropagation(), h.innerHTML = "";
        const z = document.createElement("div");
        z.textContent = (C.rawVal || []).length ? `${(C.rawVal || []).length} nudos \xB7 ${(Y.rawVal || []).length} elementos` : "sin modelo", z.style.cssText = "padding:5px 12px;color:#8a94a6;font-size:11px;border-bottom:1px solid #3a4150;margin-bottom:3px", h.appendChild(z);
        for (const [d, a] of p) {
          if (!d) {
            const r = document.createElement("div");
            r.style.cssText = "height:1px;background:#3a4150;margin:4px 0", h.appendChild(r);
            continue;
          }
          const e = document.createElement("div");
          e.textContent = d, e.style.cssText = "padding:5px 12px;cursor:pointer;white-space:nowrap", e.onmouseenter = () => {
            e.style.background = "#2f3742";
          }, e.onmouseleave = () => {
            e.style.background = "transparent";
          }, e.onclick = (r) => {
            r.stopPropagation(), b(), x(a) || (console.warn("[menu] no hay carpeta:", a), alert(`\xAB${d}\xBB todav\xEDa no est\xE1: falta la carpeta "${a}".`));
          }, h.appendChild(e);
        }
        h.style.left = Math.min(y.clientX, window.innerWidth - 250) + "px", h.style.top = Math.min(y.clientY, window.innerHeight - 320) + "px", h.style.display = "block";
      }), console.log("[menu] clic derecho sobre el modelo -> Design / Assign / Analyze");
    } catch (l) {
      console.warn("[menu] no se pudo montar:", (l == null ? void 0 : l.message) ?? l);
    }
    const _ = () => {
      var _a, _b, _c, _d, _e;
      const l = S.__ctx, p = C.rawVal || [];
      if (!l || !p.length) return;
      let h = 1 / 0, b = 1 / 0, x = 1 / 0, $ = -1 / 0, k = -1 / 0, u = -1 / 0;
      for (const t of p) !isFinite(t[0]) || !isFinite(t[1]) || !isFinite(t[2]) || (t[0] < h && (h = t[0]), t[0] > $ && ($ = t[0]), t[1] < b && (b = t[1]), t[1] > k && (k = t[1]), t[2] < x && (x = t[2]), t[2] > u && (u = t[2]));
      if (!isFinite(h)) return;
      const y = (h + $) / 2, z = (b + k) / 2, d = (x + u) / 2, a = Math.hypot($ - h, k - b, u - x) || 10;
      try {
        const t = S.__settings;
        (t == null ? void 0 : t.gridSize) && (t.gridSize.val = Math.max(10, Math.ceil(a)));
      } catch {
      }
      const { camera: e, controls: r, render: s } = l;
      (r == null ? void 0 : r.target) && r.target.set(y, z, d);
      const n = a * 1.4;
      e.position.set(y + n * 0.8, z - n * 0.8, d + n * 0.6), (_b = (_a = e.up) == null ? void 0 : _a.set) == null ? void 0 : _b.call(_a, 0, 0, 1), (_c = e.lookAt) == null ? void 0 : _c.call(e, y, z, d), (_d = e.updateProjectionMatrix) == null ? void 0 : _d.call(e), (_e = r == null ? void 0 : r.update) == null ? void 0 : _e.call(r), s == null ? void 0 : s();
    };
    requestAnimationFrame(() => requestAnimationFrame(_));
  };
})();
export {
  __tla,
  Kt as r
};
