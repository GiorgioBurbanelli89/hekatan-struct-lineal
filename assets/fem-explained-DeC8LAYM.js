import "./modulepreload-polyfill-B5Qt9EMX.js";
import { n as pt, m as mt, L as Z, d as xt, V as ut, B as ht, q as bt, b as gt, v as M } from "./Text-C1TX4d8g.js";
import { g as _t, b as yt, a as vt, __tla as __tla_0 } from "./analyze-BNmKymcK.js";
import { d as $t, __tla as __tla_1 } from "./didacticCpp-BoYi16rL.js";
import { g as wt, c as zt, __tla as __tla_2 } from "./aiAgent-CDkRN2K5.js";
import "./tweakpane-BXg6ZhiP.js";
import { n as Mt, s as Q, m as N, t as Et } from "./pureFunctionsAny.generated-DeJSBP3k.js";
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
  })(),
  (() => {
    try {
      return __tla_2;
    } catch {
    }
  })()
]).then(async () => {
  function Lt(t, l, i, r) {
    const p = t.renderer.domElement, f = new pt();
    f.params.Line = {
      threshold: 20
    };
    let m = null, a = null;
    p.addEventListener("pointerdown", (e) => {
      a = [
        e.clientX,
        e.clientY
      ];
    }), p.addEventListener("pointerup", (e) => {
      if (!a) return;
      const c = e.clientX - a[0], s = e.clientY - a[1];
      if (Math.sqrt(c * c + s * s) > 5) return;
      const d = p.getBoundingClientRect(), b = new mt((e.clientX - d.left) / d.width * 2 - 1, -((e.clientY - d.top) / d.height) * 2 + 1);
      f.setFromCamera(b, t.camera);
      const x = [];
      t.scene.traverse((h) => {
        (h instanceof Z || h instanceof xt) && h.visible && h !== m && x.push(h);
      });
      const u = f.intersectObjects(x, false);
      if (u.length > 0) {
        const h = u[0].point, _ = l.val, $ = i.val;
        let E = -1, j = 1 / 0;
        for (let L = 0; L < $.length; L++) {
          const w = _[$[L][0]], v = _[$[L][1]];
          if (!w || !v) continue;
          const A = new ut((w[0] + v[0]) / 2, (w[1] + v[1]) / 2, (w[2] + v[2]) / 2), q = h.distanceTo(A);
          q < j && (j = q, E = L);
        }
        E >= 0 && (o(E, _, $, t), r.val = E);
      }
    });
    function o(e, c, s, d) {
      m && (d.scene.remove(m), m.geometry.dispose(), m.material.dispose(), m = null);
      const b = s[e], x = c[b[0]], u = c[b[1]];
      if (!x || !u) return;
      const h = new ht(), _ = new Float32Array([
        x[0],
        x[1],
        x[2],
        u[0],
        u[1],
        u[2]
      ]);
      h.setAttribute("position", new bt(_, 3));
      const $ = new gt({
        color: 16776960,
        linewidth: 3,
        depthTest: false
      });
      m = new Z(h, $), m.renderOrder = 999, d.scene.add(m), d.render();
    }
  }
  function St(t, l, i, r, p) {
    const { properties: f } = l;
    let m = `
    <div class="fem-header">
      <h2>FEM Step-by-Step</h2>
      <div>
        <span class="element-badge">Element ${i}</span>
        <span class="label">Beam (2 nodes, 12 DOFs)</span>
      </div>
      <div class="info-box">
        <div><strong>Nodes:</strong> ${r[0]} \u2192 ${r[1]}</div>
        <div><strong>Coords:</strong> (${p[0].map((a) => a.toFixed(1)).join(", ")}) \u2192 (${p[1].map((a) => a.toFixed(1)).join(", ")})</div>
        <div><strong>Length:</strong> <span class="value">${l.length.toFixed(2)}</span></div>
        <div><strong>Properties:</strong>
          E=${D(f.E)}, A=${D(f.A)}, Iz=${D(f.Iz)}, Iy=${D(f.Iy)}, G=${D(f.G)}, J=${D(f.J)}
        </div>
      </div>
    </div>
  `;
    for (let a = 0; a < l.steps.length; a++) {
      const o = l.steps[a];
      m += qt(o);
    }
    t.innerHTML = m, t.querySelectorAll("h3").forEach((a) => {
      a.addEventListener("click", () => {
        const o = a.nextElementSibling;
        if (o) {
          o.classList.toggle("collapsed");
          const e = a.querySelector(".arrow");
          e && (e.textContent = o.classList.contains("collapsed") ? ">" : "v");
        }
      });
    });
  }
  function qt(t, l) {
    let i = '<div class="step">';
    i += `<h3><span class="arrow" style="display:inline-block;width:16px;font-family:monospace">v</span> ${t.title}</h3>`, i += '<div class="step-content">', i += `<p style="color:#a0a0a0;margin:4px 0">${t.description}</p>`;
    for (const r of t.formulas) i += `<div class="formula">${W(r)}</div>`;
    if (t.values.length > 0) {
      i += '<div class="info-box">';
      for (const r of t.values) i += `<div class="value">${W(r)}</div>`;
      i += "</div>";
    }
    return t.matrix && (i += Dt(t.matrix, t.matrixLabel ?? "", t.matrixSize ?? "")), t.extraHtml && (i += t.extraHtml), i += "</div></div>", i;
  }
  function W(t) {
    try {
      if (typeof katex < "u") return katex.renderToString(t, {
        displayMode: false,
        throwOnError: false
      });
    } catch {
    }
    return `<code>${t}</code>`;
  }
  function Dt(t, l, i) {
    var _a;
    const r = t.length, p = ((_a = t[0]) == null ? void 0 : _a.length) ?? 0, f = 12, m = Math.min(r, f), a = Math.min(p, f);
    let o = '<div style="margin:8px 0">';
    o += `<div style="color:#e94560;font-weight:bold;margin-bottom:4px">${l} (${i})</div>`, o += '<div style="overflow-x:auto">', o += '<table class="matrix-table">', o += "<tr><td></td>";
    for (let e = 0; e < a; e++) o += `<td style="color:#00d4ff;text-align:center;font-size:9px">${tt(e)}</td>`;
    o += "</tr>";
    for (let e = 0; e < m; e++) {
      o += "<tr>", o += `<td style="color:#00d4ff;font-size:9px;white-space:nowrap">${tt(e)}</td>`;
      for (let c = 0; c < a; c++) {
        const s = t[e][c], d = Math.abs(s) < 1e-10;
        o += `<td class="${d ? "zero" : e === c ? "highlight" : ""}">${d ? "0" : Ft(s)}</td>`;
      }
      o += "</tr>";
    }
    return o += "</table></div></div>", o;
  }
  function tt(t) {
    const l = Math.floor(t / 6), i = t % 6;
    return `${[
      "u",
      "v",
      "w",
      "rx",
      "ry",
      "rz"
    ][i]}${l === 0 ? "i" : "j"}`;
  }
  function Ft(t) {
    return Math.abs(t) >= 1e6 || Math.abs(t) < 0.01 && t !== 0 ? t.toExponential(1) : Math.abs(t) >= 100 ? t.toFixed(0) : Math.abs(t) >= 1 ? t.toFixed(2) : t.toFixed(4);
  }
  function D(t) {
    return Math.abs(t) >= 1e6 ? t.toExponential(2) : t === 0 ? "0" : t.toFixed(2);
  }
  function jt(t, l, i, r, p, f, m) {
    var _a, _b, _c, _d, _e, _f;
    const a = i[t], o = l[a[0]], e = l[a[1]], c = [
      o,
      e
    ], s = Mt(Q(o, e)), d = ((_a = r.elasticities) == null ? void 0 : _a.get(t)) ?? 0, b = ((_b = r.areas) == null ? void 0 : _b.get(t)) ?? 0, x = ((_c = r.momentsOfInertiaZ) == null ? void 0 : _c.get(t)) ?? 0, u = ((_d = r.momentsOfInertiaY) == null ? void 0 : _d.get(t)) ?? 0, h = ((_e = r.shearModuli) == null ? void 0 : _e.get(t)) ?? 0, _ = ((_f = r.torsionalConstants) == null ? void 0 : _f.get(t)) ?? 0, $ = d * b / s, E = d * x / s ** 3, j = d * u / s ** 3, L = h * _ / s, w = _t(c, r, t), v = yt(c), A = N(Et(v), N(w, v)), q = Q(e, o), X = q[0] / s, U = q[1] / s, G = q[2] / s, rt = Math.sqrt(X ** 2 + U ** 2), V = a[0] * 6, H = a[1] * 6, S = [];
    if (f == null ? void 0 : f.deformations) {
      const z = f.deformations.get(a[0]) ?? [
        0,
        0,
        0,
        0,
        0,
        0
      ], k = f.deformations.get(a[1]) ?? [
        0,
        0,
        0,
        0,
        0,
        0
      ];
      S.push(...z, ...k);
    }
    const ct = S.length === 12 ? N(v, S) : Array(12).fill(0), g = S.length === 12 ? N(w, ct) : Array(12).fill(0), y = [];
    y.push({
      title: "Step 1: Element Geometry",
      description: "Euler-Bernoulli beam element with 2 nodes and 6 DOFs per node (u, v, w, theta_x, theta_y, theta_z).",
      formulas: [
        `\\text{Node } i = (${n(o[0])},\\; ${n(o[1])},\\; ${n(o[2])})`,
        `\\text{Node } j = (${n(e[0])},\\; ${n(e[1])},\\; ${n(e[2])})`,
        "L = \\sqrt{(x_j-x_i)^2 + (y_j-y_i)^2 + (z_j-z_i)^2}"
      ],
      values: [
        `L = ${n(s)}`
      ]
    }), y.push({
      title: "Step 2: Shape Functions (Hermite Cubics)",
      description: "For bending, Euler-Bernoulli theory uses Hermite cubic polynomials. For axial and torsion, linear shape functions are used.",
      formulas: [
        "\\textbf{Axial (linear):}",
        "N_1(\\xi) = 1 - \\xi, \\quad N_2(\\xi) = \\xi, \\quad \\xi = x/L",
        "\\textbf{Bending (Hermite cubic):}",
        "N_1(\\xi) = 1 - 3\\xi^2 + 2\\xi^3",
        "N_2(\\xi) = L\\xi(1 - \\xi)^2",
        "N_3(\\xi) = 3\\xi^2 - 2\\xi^3",
        "N_4(\\xi) = L\\xi^2(\\xi - 1)",
        "\\textbf{Torsion (linear):}",
        "N_1(\\xi) = 1 - \\xi, \\quad N_2(\\xi) = \\xi"
      ],
      values: [],
      extraHtml: kt()
    }), y.push({
      title: "Step 3: Strain-Displacement Relations (B Matrix)",
      description: "The B matrix relates nodal displacements to strains. For each DOF type:",
      formulas: [
        "\\textbf{Axial strain:} \\quad \\varepsilon = \\frac{du}{dx} = \\frac{1}{L}[-1 \\quad 1]\\{u_i, u_j\\}",
        "\\textbf{Bending curvature:} \\quad \\kappa = \\frac{d^2v}{dx^2} = B_b \\cdot \\{v_i, \\theta_i, v_j, \\theta_j\\}",
        "B_b = \\frac{1}{L^3}\\begin{bmatrix} -6+12\\xi & L(-4+6\\xi) & 6-12\\xi & L(-2+6\\xi) \\end{bmatrix}",
        "\\textbf{Torsional twist:} \\quad \\phi' = \\frac{d\\theta_x}{dx} = \\frac{1}{L}[-1 \\quad 1]\\{\\theta_{xi}, \\theta_{xj}\\}"
      ],
      values: []
    }), y.push({
      title: "Step 4: Constitutive Relations (Material)",
      description: "Material stiffness for each deformation mode:",
      formulas: [
        "\\textbf{Axial:} \\quad \\sigma = E \\cdot \\varepsilon \\quad \\Rightarrow \\quad D_{axial} = E \\cdot A",
        "\\textbf{Bending Z:} \\quad M_z = E I_z \\cdot \\kappa_z \\quad \\Rightarrow \\quad D_{bz} = E \\cdot I_z",
        "\\textbf{Bending Y:} \\quad M_y = E I_y \\cdot \\kappa_y \\quad \\Rightarrow \\quad D_{by} = E \\cdot I_y",
        "\\textbf{Torsion:} \\quad T = G J \\cdot \\phi' \\quad \\Rightarrow \\quad D_{torsion} = G \\cdot J"
      ],
      values: [
        `E = ${n(d)}, \\quad A = ${n(b)}, \\quad EA = ${n(d * b)}`,
        `I_z = ${n(x)}, \\quad I_y = ${n(u)}`,
        `G = ${n(h)}, \\quad J = ${n(_)}`
      ]
    }), y.push({
      title: "Step 5: Local Stiffness Matrix K_local (12x12)",
      description: "Obtained by integrating K = integral(B^T D B dx, 0, L) for each DOF combination.",
      formulas: [
        "K_{local} = \\int_0^L B^T D \\, B \\, dx",
        "\\text{DOFs: } [u_i, v_i, w_i, \\theta_{xi}, \\theta_{yi}, \\theta_{zi}, u_j, v_j, w_j, \\theta_{xj}, \\theta_{yj}, \\theta_{zj}]",
        "\\text{Key terms:}",
        `K[0,0] = \\frac{EA}{L} = ${n($)}`,
        `K[1,1] = \\frac{12EI_z}{L^3} = ${n(12 * E)}`,
        `K[2,2] = \\frac{12EI_y}{L^3} = ${n(12 * j)}`,
        `K[3,3] = \\frac{GJ}{L} = ${n(L)}`,
        `K[4,4] = \\frac{4EI_y}{L} = ${n(4 * j * s ** 2)}`,
        `K[5,5] = \\frac{4EI_z}{L} = ${n(4 * E * s ** 2)}`
      ],
      values: [],
      matrix: w,
      matrixLabel: "K_local",
      matrixSize: "12x12"
    });
    let J;
    Math.abs(G) > 0.999 ? J = G > 0 ? "\\lambda = \\begin{bmatrix} 0 & 0 & 1 \\\\ 1 & 0 & 0 \\\\ 0 & 1 & 0 \\end{bmatrix} \\quad \\text{(vertical, n=1)}" : "\\lambda = \\begin{bmatrix} 0 & 0 & -1 \\\\ 1 & 0 & 0 \\\\ 0 & -1 & 0 \\end{bmatrix} \\quad \\text{(vertical, n=-1)}" : J = "\\lambda = \\begin{bmatrix} l & m & n \\\\ -ln/D & -mn/D & D \\\\ m/D & -l/D & 0 \\end{bmatrix}", y.push({
      title: "Step 6: Coordinate Transformation Matrix T (12x12)",
      description: "Transforms from local to global coordinates using direction cosines.",
      formulas: [
        `\\text{Direction cosines: } l = ${n(X)}, \\; m = ${n(U)}, \\; n = ${n(G)}`,
        `D = \\sqrt{l^2 + m^2} = ${n(rt)}`,
        J,
        "T = I_4 \\otimes \\lambda \\quad \\text{(Kronecker product, 12x12)}"
      ],
      values: [],
      matrix: v,
      matrixLabel: "T",
      matrixSize: "12x12"
    }), y.push({
      title: "Step 7: Global Stiffness K_global = T^T K_local T",
      description: "The global stiffness matrix in the global coordinate system.",
      formulas: [
        "K_{global} = T^T \\cdot K_{local} \\cdot T"
      ],
      values: [],
      matrix: A,
      matrixLabel: "K_global",
      matrixSize: "12x12"
    });
    const dt = Array.from({
      length: 6
    }, (z, k) => V + k), ft = Array.from({
      length: 6
    }, (z, k) => H + k);
    return y.push({
      title: "Step 8: Assembly into Global System",
      description: `Element ${t} connects node ${a[0]} (DOFs ${V}-${V + 5}) to node ${a[1]} (DOFs ${H}-${H + 5}).`,
      formulas: [
        `\\text{Global DOFs: } [${dt.join(", ")}, ${ft.join(", ")}]`,
        "K_{total}[\\text{DOFs}_i, \\text{DOFs}_j] \\mathrel{+}= K_{global}[i, j]",
        `\\text{Total DOFs in model: } ${l.length * 6}`,
        "\\text{Free DOFs (after BCs): removed fixed supports}"
      ],
      values: [],
      extraHtml: Tt(a, l.length, t, i.length)
    }), y.push({
      title: "Step 9: Solution u = K^{-1} F",
      description: "After applying boundary conditions, solve the reduced system.",
      formulas: [
        "K_{free} \\cdot u_{free} = F_{free}",
        "\\text{LU decomposition: } K = L \\cdot U",
        "u = U^{-1}(L^{-1} F)"
      ],
      values: S.length === 12 ? [
        `u_{node\\,${a[0]}} = [${S.slice(0, 6).map((z) => n(z, 6)).join(", ")}]`,
        `u_{node\\,${a[1]}} = [${S.slice(6, 12).map((z) => n(z, 6)).join(", ")}]`
      ] : [
        "\\text{(no results available)}"
      ]
    }), y.push({
      title: "Step 10: Internal Forces f = K_local T u",
      description: "Transform global displacements to local, then multiply by local stiffness.",
      formulas: [
        "u_{local} = T \\cdot u_{global}",
        "f_{local} = K_{local} \\cdot u_{local}",
        "\\text{DOF order: } [N_i, V_{yi}, V_{zi}, T_i, M_{yi}, M_{zi}, N_j, V_{yj}, V_{zj}, T_j, M_{yj}, M_{zj}]"
      ],
      values: g.some((z) => z !== 0) ? [
        `N_i = ${n(g[0], 4)}, \\quad V_{yi} = ${n(g[1], 4)}, \\quad V_{zi} = ${n(g[2], 4)}`,
        `T_i = ${n(g[3], 4)}, \\quad M_{yi} = ${n(g[4], 4)}, \\quad M_{zi} = ${n(g[5], 4)}`,
        `N_j = ${n(g[6], 4)}, \\quad V_{yj} = ${n(g[7], 4)}, \\quad V_{zj} = ${n(g[8], 4)}`,
        `T_j = ${n(g[9], 4)}, \\quad M_{yj} = ${n(g[10], 4)}, \\quad M_{zj} = ${n(g[11], 4)}`
      ] : [
        "\\text{(no results available)}"
      ]
    }), {
      elementIndex: t,
      elementNodes: a,
      nodeCoords: c,
      length: s,
      properties: {
        E: d,
        A: b,
        Iz: x,
        Iy: u,
        G: h,
        J: _
      },
      steps: y,
      kLocal: w,
      T: v,
      kGlobal: A
    };
  }
  function n(t, l = 2) {
    return Math.abs(t) < 1e-10 ? "0" : Math.abs(t) > 1e6 || Math.abs(t) < 0.01 && t !== 0 ? t.toExponential(l) : t.toFixed(l);
  }
  function kt(t) {
    const a = [
      {
        name: "N1",
        color: "#ff6b6b",
        fn: (e) => 1 - 3 * e ** 2 + 2 * e ** 3
      },
      {
        name: "N2/L",
        color: "#4ecdc4",
        fn: (e) => e * (1 - e) ** 2
      },
      {
        name: "N3",
        color: "#45b7d1",
        fn: (e) => 3 * e ** 2 - 2 * e ** 3
      },
      {
        name: "N4/L",
        color: "#f9ca24",
        fn: (e) => e ** 2 * (e - 1)
      }
    ];
    let o = '<svg viewBox="0 0 460 140" style="width:100%;max-width:460px;background:#0d1117;border-radius:4px;margin:8px 0">';
    o += `<line x1="30" y1="${140 / 2}" x2="430" y2="${140 / 2}" stroke="#444" stroke-width="1"/>`, o += '<line x1="30" y1="30" x2="30" y2="110" stroke="#444" stroke-width="1"/>', o += `<text x="${460 / 2}" y="135" fill="#888" font-size="11" text-anchor="middle">xi (0 to 1)</text>`;
    for (const e of a) {
      let c = "";
      for (let x = 0; x <= 50; x++) {
        const u = x / 50, h = 30 + u * 400, _ = 140 / 2 - e.fn(u) * 80;
        c += (x === 0 ? "M" : "L") + `${h.toFixed(1)},${_.toFixed(1)}`;
      }
      o += `<path d="${c}" fill="none" stroke="${e.color}" stroke-width="2"/>`;
      const s = 0.85, d = 30 + s * 400 + 5, b = 140 / 2 - e.fn(s) * 80 - 5;
      o += `<text x="${d}" y="${b}" fill="${e.color}" font-size="10" font-weight="bold">${e.name}</text>`;
    }
    return o += "</svg>", o;
  }
  function Tt(t, l, i, r) {
    const p = l * 6, f = Math.min(p, 18), m = 22, a = t[0] * 6, o = t[1] * 6, e = [
      ...Array.from({
        length: 6
      }, (s, d) => a + d),
      ...Array.from({
        length: 6
      }, (s, d) => o + d)
    ];
    let c = `<div style="margin:8px 0;font-size:11px;color:#888">
    <strong style="color:#e94560">Assembly map</strong> (element ${i} fills highlighted positions in K_total):
  </div>`;
    c += '<div style="overflow-x:auto"><table class="matrix-table" style="font-size:10px">', c += "<tr><td></td>";
    for (let s = 0; s < f; s++) {
      const d = e.includes(s);
      c += `<td style="text-align:center;font-size:9px;color:${d ? "#00d4ff" : "#555"}">${s}</td>`;
    }
    c += "</tr>";
    for (let s = 0; s < f; s++) {
      c += "<tr>";
      const d = e.includes(s);
      c += `<td style="font-size:9px;color:${d ? "#00d4ff" : "#555"}">${s}</td>`;
      for (let b = 0; b < f; b++) {
        const x = e.includes(b), u = d && x;
        c += `<td style="background:${u ? "#0f3460" : "transparent"};color:${u ? "#00d4ff" : "#333"};text-align:center;width:${m}px;height:${m}px;padding:1px">${u ? "+" : "."}</td>`;
      }
      c += "</tr>";
    }
    return c += "</table></div>", p > f && (c += `<div style="font-size:10px;color:#666;margin-top:4px">(showing ${f}x${f} of ${p}x${p})</div>`), c;
  }
  const P = 2e5, Bt = 0.3, et = P / (2 * (1 + Bt)), ot = 100, nt = 833.33, at = 833.33, it = 1400, R = 1e3, B = M.state([
    [
      0,
      0,
      0
    ],
    [
      R,
      0,
      0
    ],
    [
      R,
      0,
      R
    ]
  ]), F = M.state([
    [
      0,
      1
    ],
    [
      1,
      2
    ]
  ]), Y = M.state({
    supports: /* @__PURE__ */ new Map([
      [
        0,
        [
          true,
          true,
          true,
          true,
          true,
          true
        ]
      ]
    ]),
    loads: /* @__PURE__ */ new Map([
      [
        2,
        [
          10,
          0,
          0,
          0,
          0,
          0
        ]
      ]
    ])
  }), O = M.state({
    elasticities: /* @__PURE__ */ new Map([
      [
        0,
        P
      ],
      [
        1,
        P
      ]
    ]),
    shearModuli: /* @__PURE__ */ new Map([
      [
        0,
        et
      ],
      [
        1,
        et
      ]
    ]),
    areas: /* @__PURE__ */ new Map([
      [
        0,
        ot
      ],
      [
        1,
        ot
      ]
    ]),
    momentsOfInertiaY: /* @__PURE__ */ new Map([
      [
        0,
        nt
      ],
      [
        1,
        nt
      ]
    ]),
    momentsOfInertiaZ: /* @__PURE__ */ new Map([
      [
        0,
        at
      ],
      [
        1,
        at
      ]
    ]),
    torsionalConstants: /* @__PURE__ */ new Map([
      [
        0,
        it
      ],
      [
        1,
        it
      ]
    ])
  }), T = M.state({}), C = M.state({});
  M.derive(() => {
    const t = B.val, l = F.val, i = Y.val, r = O.val;
    !t.length || !l.length || (T.val = $t(t, l, i, r), C.val = vt(t, l, r, T.val));
  });
  const I = document.createElement("div");
  I.id = "fem-panel";
  I.innerHTML = `
  <div class="fem-header">
    <h2>FEM Step-by-Step</h2>
    <p>Click on an element or select below:</p>
    <div id="element-buttons" style="margin:8px 0;display:flex;gap:6px;flex-wrap:wrap"></div>
  </div>
`;
  const K = M.state(-1);
  M.derive(() => {
    const t = K.val;
    if (t < 0) return;
    const l = B.val, i = F.val, r = O.val, p = Y.val, f = T.val;
    if (C.val, !l.length || !i.length || !(f == null ? void 0 : f.deformations)) return;
    const m = i[t].map((o) => l[o]);
    if (m.length === 2) {
      const o = jt(t, l, i, r, p, f);
      St(I, o, t, i[t], m);
    }
  });
  const st = document.createElement("style");
  st.textContent = `
  body { margin: 0; font-family: 'Segoe UI', sans-serif; overflow: hidden; }

  #fem-panel {
    position: fixed;
    right: 0; top: 0;
    width: 520px; height: 100vh;
    background: #1a1a2e;
    color: #e0e0e0;
    overflow-y: auto;
    z-index: 10000;
    padding: 16px 20px;
    box-sizing: border-box;
    border-left: 3px solid #0f3460;
    font-size: 13px;
    line-height: 1.5;
    box-shadow: -4px 0 20px rgba(0,0,0,0.5);
  }
  #fem-panel h2 { color: #00d4ff; margin: 0 0 8px 0; font-size: 18px; }
  #fem-panel h3 {
    color: #e94560;
    margin: 20px 0 8px 0;
    font-size: 15px;
    border-bottom: 1px solid #333;
    padding-bottom: 4px;
    cursor: pointer;
  }
  #fem-panel h3:hover { color: #ff6b81; }
  #fem-panel .step { margin-bottom: 12px; }
  #fem-panel .step-content { padding-left: 8px; }
  #fem-panel .step-content.collapsed { display: none; }

  #fem-panel .katex-display { margin: 8px 0; overflow-x: auto; }
  #fem-panel .katex { font-size: 0.95em; }

  #fem-panel .matrix-table {
    border-collapse: collapse;
    font-family: 'Consolas', monospace;
    font-size: 11px;
    margin: 6px 0;
  }
  #fem-panel .matrix-table td {
    padding: 2px 6px;
    text-align: right;
    border: 1px solid #333;
    min-width: 60px;
  }
  #fem-panel .matrix-table td.highlight { background: #0f3460; color: #00d4ff; }
  #fem-panel .matrix-table td.zero { color: #555; }

  #fem-panel .info-box {
    background: #16213e;
    border-left: 3px solid #00d4ff;
    padding: 8px 12px;
    margin: 8px 0;
    border-radius: 0 4px 4px 0;
  }
  #fem-panel .formula { color: #ffd700; margin: 4px 0; }
  #fem-panel .value { color: #7bed9f; }
  #fem-panel .label { color: #a0a0a0; }

  #fem-panel .element-badge {
    display: inline-block;
    background: #e94560;
    color: white;
    padding: 2px 10px;
    border-radius: 12px;
    font-weight: bold;
    margin-right: 8px;
  }

  /* Highlight selected element in viewer */
  .selected-element { stroke: #ff0; stroke-width: 3; }

  /* Scrollbar */
  #fem-panel::-webkit-scrollbar { width: 8px; }
  #fem-panel::-webkit-scrollbar-track { background: #1a1a2e; }
  #fem-panel::-webkit-scrollbar-thumb { background: #0f3460; border-radius: 4px; }
`;
  document.head.appendChild(st);
  const lt = wt({
    mesh: {
      nodes: B,
      elements: F,
      nodeInputs: Y,
      elementInputs: O,
      deformOutputs: T,
      analyzeOutputs: C
    },
    settingsObj: {
      deformedShape: true,
      gridSize: 1500
    }
  });
  document.body.append(lt, I);
  document.body.append(zt({
    sourceCode: "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal/blob/main/examples/src/fem-explained/main.ts"
  }));
  setTimeout(() => {
    const t = document.getElementById("element-buttons");
    if (t) {
      const i = F.val;
      for (let r = 0; r < i.length; r++) {
        const p = document.createElement("button");
        p.textContent = `Elem ${r}`, p.style.cssText = "background:#0f3460;color:#00d4ff;border:1px solid #00d4ff;padding:4px 12px;border-radius:4px;cursor:pointer;font-size:12px", p.addEventListener("click", () => {
          K.val = r;
        }), t.appendChild(p);
      }
    }
    const l = lt.__ctx;
    l && Lt(l, B, F, K);
  }, 500);
  window._fem = {
    selectedElement: K,
    nodes: B,
    elements: F,
    elementInputs: O,
    deformOutputs: T,
    analyzeOutputs: C
  };
});
