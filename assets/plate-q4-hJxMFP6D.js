import "./modulepreload-polyfill-B5Qt9EMX.js";
import { v as y } from "./theme-Dxpmbnyd.js";
import { p as Y, __tla as __tla_0 } from "./didacticCpp-CnEP9H1T.js";
import "./tweakpane-BXg6ZhiP.js";
import { g as K } from "./styles-DjzQZscE.js";
import { __tla as __tla_1 } from "./deform-CK_Uh0DH.js";
import "./preload-helper-V2P8TQsQ.js";
Promise.all([
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
  const n = {
    Lx: y.state(10),
    Ly: y.state(10),
    nx: y.state(16),
    ny: y.state(16),
    thickness: y.state(0.2),
    E: y.state(3e7),
    nu: y.state(0.3),
    pressure: y.state(-10),
    bcType: y.state("simply-supported"),
    resultType: y.state("w")
  };
  let X = null;
  function O(s, l, i, t, g, w, R = 50) {
    let f = 0;
    for (let o = 1; o <= R; o += 2) for (let M = 1; M <= R; M += 2) {
      const E = (o * Math.PI / s) ** 2 + (M * Math.PI / l) ** 2, F = 16 * i / (Math.PI ** 2 * o * M);
      f += F / (t * E ** 2) * Math.sin(o * Math.PI * g / s) * Math.sin(M * Math.PI * w / l);
    }
    return f;
  }
  function B() {
    const s = Y({
      E: n.E.val,
      nu: n.nu.val,
      thickness: n.thickness.val,
      meshLx: n.Lx.val,
      meshLy: n.Ly.val,
      meshNx: n.nx.val,
      meshNy: n.ny.val,
      bcType: n.bcType.val,
      pressure: n.pressure.val
    });
    return X = s, s;
  }
  function U(s, l, i) {
    const t = s.getContext("2d"), g = s.width, w = s.height;
    if (t.clearRect(0, 0, g, w), l.nodeResults.length === 0) return;
    const R = n.Lx.val, f = n.Ly.val, o = 60, M = g - 2 * o, E = w - 2 * o, F = M / R, q = E / f, C = Math.min(F, q), D = o + (M - R * C) / 2, N = o + (E - f * C) / 2;
    function P(e, a) {
      return [
        D + e * C,
        N + (f - a) * C
      ];
    }
    let x = [], H = false;
    if (i === "w") x = l.nodeResults.map((e) => e.w);
    else if (i === "bx") x = l.nodeResults.map((e) => e.bx);
    else if (i === "by") x = l.nodeResults.map((e) => e.by);
    else {
      H = true;
      const e = i;
      x = l.elementResults.map((a) => a[e]);
    }
    const S = Math.min(...x), m = Math.max(...x), z = m - S || 1;
    function W(e) {
      const a = (e - S) / z, p = a < 0.5 ? 0 : Math.round(255 * Math.min(1, (a - 0.5) * 2)), v = a < 0.25 ? Math.round(255 * a * 4) : a < 0.75 ? 255 : Math.round(255 * (1 - (a - 0.75) * 4)), Q = a < 0.5 ? Math.round(255 * (1 - a * 2)) : 0;
      return `rgb(${p},${v},${Q})`;
    }
    for (const e of l.elementResults) {
      const [a, p, v, Q] = e.nodes, T = [
        l.nodeResults[a],
        l.nodeResults[p],
        l.nodeResults[v],
        l.nodeResults[Q]
      ];
      if (H) {
        const A = e[i];
        t.fillStyle = W(A);
      } else {
        const k = (x[a] + x[p] + x[v] + x[Q]) / 4;
        t.fillStyle = W(k);
      }
      t.beginPath();
      const [I, d] = P(T[0].x, T[0].y);
      t.moveTo(I, d);
      for (let k = 1; k < 4; k++) {
        const [A, $] = P(T[k].x, T[k].y);
        t.lineTo(A, $);
      }
      t.closePath(), t.fill(), t.strokeStyle = "rgba(0,0,0,0.15)", t.lineWidth = 0.5, t.stroke();
    }
    const b = g - o + 10, L = E, r = 20;
    for (let e = 0; e < L; e++) {
      const a = 1 - e / L;
      t.fillStyle = W(S + a * z), t.fillRect(b, N + e, r, 1);
    }
    t.strokeStyle = "#333", t.lineWidth = 1, t.strokeRect(b, N, r, L), t.fillStyle = "#333", t.font = "11px monospace", t.textAlign = "left";
    const u = (e) => Math.abs(e) < 1e-3 ? e.toExponential(2) : e.toFixed(4);
    t.fillText(u(m), b + r + 4, N + 10), t.fillText(u((m + S) / 2), b + r + 4, N + L / 2 + 4), t.fillText(u(S), b + r + 4, N + L - 2), t.fillStyle = "#222", t.font = "bold 14px sans-serif", t.textAlign = "center";
    const _ = {
      w: "Desplazamiento w (m)",
      bx: "Rotaci\xF3n \u03B2x (rad)",
      by: "Rotaci\xF3n \u03B2y (rad)",
      Mxx: "Momento Mxx (kN\xB7m/m)",
      Myy: "Momento Myy (kN\xB7m/m)",
      Mxy: "Momento Mxy (kN\xB7m/m)",
      Qx: "Cortante Qx (kN/m)",
      Qy: "Cortante Qy (kN/m)"
    };
    t.fillText(_[i] || i, g / 2, 20), t.fillStyle = "#555", t.font = "12px sans-serif", t.textAlign = "center", t.fillText("x (m)", g / 2, w - 5), t.save(), t.translate(12, w / 2), t.rotate(-Math.PI / 2), t.fillText("y (m)", 0, 0), t.restore(), t.fillStyle = "#777", t.font = "10px monospace";
    const h = 5;
    for (let e = 0; e <= h; e++) {
      const a = R / h * e, [p, v] = P(a, 0);
      t.textAlign = "center", t.fillText(a.toFixed(1), p, v + 14);
    }
    for (let e = 0; e <= h; e++) {
      const a = f / h * e, [p, v] = P(0, a);
      t.textAlign = "right", t.fillText(a.toFixed(1), p - 6, v + 4);
    }
  }
  function j() {
    const { div: s, h2: l, h3: i, p: t, span: g, label: w, input: R, select: f, option: o, button: M, canvas: E, table: F, tr: q, td: C, th: D, tbody: N, thead: P, br: x, strong: H } = y.tags, S = E({
      width: 700,
      height: 600,
      style: "border:1px solid #ccc; background:#fafafa; display:block; margin:0 auto"
    }), m = (r, u, _, h, e) => {
      const a = g({
        style: "font-weight:bold; min-width:60px; display:inline-block"
      }, () => u.val.toFixed(e < 1 ? 2 : 0));
      return s({
        style: "display:flex; align-items:center; gap:8px; margin:2px 0"
      }, w({
        style: "min-width:80px; text-align:right; font-size:13px"
      }, r), R({
        type: "range",
        min: _,
        max: h,
        step: e,
        value: u.val,
        style: "flex:1",
        oninput: (p) => {
          u.val = parseFloat(p.target.value);
        }
      }), a);
    }, z = f({
      style: "padding:4px",
      onchange: (r) => {
        n.bcType.val = r.target.value;
      }
    }, o({
      value: "simply-supported",
      selected: true
    }, "Simply Supported"), o({
      value: "clamped"
    }, "Clamped")), W = f({
      style: "padding:4px",
      onchange: (r) => {
        n.resultType.val = r.target.value;
      }
    }, o({
      value: "w"
    }, "w (displacement)"), o({
      value: "bx"
    }, "\u03B2x (rotation)"), o({
      value: "by"
    }, "\u03B2y (rotation)"), o({
      value: "Mxx"
    }, "Mxx (moment)"), o({
      value: "Myy"
    }, "Myy (moment)"), o({
      value: "Mxy"
    }, "Mxy (torsion)"), o({
      value: "Qx"
    }, "Qx (shear)"), o({
      value: "Qy"
    }, "Qy (shear)")), b = s({
      style: "font-family:monospace; font-size:12px; background:#f0f0f0; padding:10px; border-radius:4px; margin-top:8px; white-space:pre"
    });
    return y.derive(() => {
      const r = n.Lx.val, u = n.Ly.val, _ = n.nx.val, h = n.ny.val, e = n.thickness.val, a = n.E.val, p = n.nu.val, v = n.pressure.val, Q = n.bcType.val, T = n.resultType.val;
      try {
        const I = performance.now(), d = B(), k = performance.now() - I;
        U(S, d, T);
        const A = a * e ** 3 / (12 * (1 - p ** 2)), $ = Q === "simply-supported" ? O(r, u, Math.abs(v), A, r / 2, u / 2) : NaN, G = Math.abs(d.centerW ?? d.maxW), V = isNaN($) ? NaN : Math.abs((G - $) / $ * 100);
        let c = `Plate Q4 (Mindlin-Reissner SRI)  ${_}\xD7${h} = ${_ * h} elements, ${(_ + 1) * (h + 1)} nodes
`;
        c += `Time: ${k.toFixed(1)} ms
`, c += `\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
`, c += `w_max     = ${d.maxW.toExponential(6)}
`, c += `|w_center|= ${G.toExponential(6)}
`, isNaN($) || (c += `w_Navier  = ${$.toExponential(6)}  (analytical)
`, c += `Error     = ${V.toFixed(2)}%
`), c += `\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
`, c += `Mxx_max = ${d.maxMxx.toExponential(4)}
`, c += `Myy_max = ${d.maxMyy.toExponential(4)}
`, c += `Mxy_max = ${d.maxMxy.toExponential(4)}
`, c += `Qx_max  = ${d.maxQx.toExponential(4)}
`, c += `Qy_max  = ${d.maxQy.toExponential(4)}`, b.textContent = c;
      } catch (I) {
        b.textContent = `Error: ${I.message}`;
      }
    }), s({
      style: "max-width:900px; margin:0 auto; padding:20px; font-family:sans-serif"
    }, l("Placa Q4 \u2014 Mindlin-Reissner (WASM)"), t({
      style: "color:#555; font-size:13px"
    }, "4-node isoparametric plate element with Selective Reduced Integration (SRI). ", "Bending: 2\xD72 Gauss, Shear: 1\xD71 Gauss. Converges to Kirchhoff theory for thin plates."), s({
      style: "display:grid; grid-template-columns:1fr 1fr; gap:16px"
    }, s(i("Geometr\xEDa"), m("Lx (m)", n.Lx, 1, 30, 1), m("Ly (m)", n.Ly, 1, 30, 1), m("nx", n.nx, 2, 64, 2), m("ny", n.ny, 2, 64, 2), i("Material"), m("t (m)", n.thickness, 0.05, 2, 0.05), m("E (kN/m\xB2)", n.E, 1e6, 1e8, 1e6), m("\u03BD", n.nu, 0, 0.45, 0.05)), s(i("Cargas"), m("q (kN/m\xB2)", n.pressure, -50, 0, 1), i("Condiciones de Borde"), s({
      style: "margin:4px 0"
    }, z), i("Resultado"), s({
      style: "margin:4px 0"
    }, W))), x(), S, b);
  }
  document.body.append(j(), K({
    sourceCode: "https://github.com/madil4/awatif/blob/main/examples/src/plate-q4/main.ts",
    author: "Hekatan"
  }));
  window.plateQ4 = {
    solve: B,
    state: n,
    get lastResult() {
      return X;
    }
  };
});
