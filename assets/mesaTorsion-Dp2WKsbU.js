import { a as Ct, __tla as __tla_0 } from "./analyze-DW0aWqsq.js";
import { m as Et, d as Lt, __tla as __tla_1 } from "./didacticCpp-BoYi16rL.js";
import { V as zt } from "./Text-C1TX4d8g.js";
import { w as Pt, __tla as __tla_2 } from "./concreteBeamDesignPanel-B8ukOlOG.js";
let ao, oo, Ut;
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
  })(),
  (() => {
    try {
      return __tla_2;
    } catch {
    }
  })()
]).then(async () => {
  const g = () => window, pt = "/hekatan-struct-lineal/", me = (e) => typeof e == "function" ? e() : e, J = (e) => new Promise((o) => setTimeout(o, e));
  let b = null, $ = 0, U = [], ht = "", ne = true, z = false, F = 0, ce = null;
  const fe = () => {
    var _a;
    (_a = window.speechSynthesis) == null ? void 0 : _a.cancel(), ce && (ce.pause(), ce = null);
  };
  async function At(e, o) {
    fe();
    const t = new Audio(pt + e);
    ce = t;
    const n = new Promise((a) => {
      t.onended = () => a(), t.onerror = () => a();
    });
    try {
      await t.play();
    } catch {
      return ce === t && (ce = null), null;
    }
    return o === F ? {
      fin: n
    } : null;
  }
  oo = (e, o = 4) => (+e.toFixed(o)).toString().replace(".", ",");
  function It(e, o) {
    const t = window.speechSynthesis, n = Math.max(1800, e.length * 62);
    return !t || !ne ? J(n) : new Promise((a) => {
      t.cancel();
      const s = new SpeechSynthesisUtterance(e);
      s.lang = "es-ES", s.rate = 1.02;
      const i = t.getVoices().find((m) => m.lang.startsWith("es"));
      i && (s.voice = i);
      let r = false;
      const c = () => {
        r || (r = true, a());
      };
      s.onend = c, s.onerror = c, setTimeout(c, n + 4e3), o === F ? t.speak(s) : c();
    });
  }
  let j = null, H = null, I = null, _ = null, ke = 300, $e = 300, bt = 0, N = null;
  const Le = "http://www.w3.org/2000/svg";
  function Vt() {
    if (j) return;
    j = document.createElement("div"), j.innerHTML = '<svg width="34" height="34" viewBox="0 0 24 24"><path d="M3 2l7 19 2.5-7.5L20 11z" fill="#fff" stroke="#000" stroke-width="1.4"/></svg>', j.style.cssText = "position:fixed;z-index:9700;pointer-events:none;left:0;top:0;filter:drop-shadow(0 3px 4px #000c)", H = document.createElement("div"), H.style.cssText = "position:fixed;z-index:9690;pointer-events:none;border:3px solid #22d3ee;border-radius:12px;box-shadow:0 0 0 5px #22d3ee40;transition:all .7s ease;opacity:0", I = document.createElement("div"), I.style.cssText = "position:fixed;z-index:9710;pointer-events:none;background:#111827;color:#cffafe;border:1px solid #22d3ee;border-radius:8px;padding:5px 9px;font:600 14px system-ui;transition:left .7s ease,top .7s ease,opacity .3s;opacity:0;white-space:nowrap", _ = document.createElementNS(Le, "svg"), _.setAttribute("style", "position:fixed;left:0;top:0;width:100vw;height:100vh;z-index:9680;pointer-events:none"), _.innerHTML = '<defs><marker id="hk-fl" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#22d3ee"/></marker></defs>', document.body.append(_, H, j, I);
    const e = document.createElement("style");
    e.id = "hk-tutor-st", e.textContent = "@keyframes hkOnda{from{transform:translate(-50%,-50%) scale(.2);opacity:.9}to{transform:translate(-50%,-50%) scale(2.4);opacity:0}}", document.head.appendChild(e), Xe(ke, $e), gt();
  }
  function Dt() {
    var _a;
    cancelAnimationFrame(bt), j == null ? void 0 : j.remove(), H == null ? void 0 : H.remove(), I == null ? void 0 : I.remove(), _ == null ? void 0 : _.remove(), (_a = document.getElementById("hk-tutor-st")) == null ? void 0 : _a.remove(), j = H = I = null, _ = null, N = null;
  }
  function Xe(e, o) {
    e = Math.min(Math.max(e, 4), innerWidth - 30), o = Math.min(Math.max(o, 34), innerHeight - 30), ke = e, $e = o, j && (j.style.transform = `translate(${e - 3}px,${o - 2}px)`);
  }
  let Se = null;
  function Oe(e, o) {
    const t = Math.hypot(e - ke, o - $e), n = Math.min(1300, 450 + t * 0.9);
    return new Promise((a) => {
      Se = {
        x0: ke,
        y0: $e,
        x1: e,
        y1: o,
        t0: performance.now(),
        ms: n,
        ok: a
      };
    });
  }
  function Nt(e, o) {
    const t = document.createElement("div");
    t.style.cssText = `position:fixed;left:${e}px;top:${o}px;width:46px;height:46px;border:3px solid #22d3ee;border-radius:50%;z-index:9695;pointer-events:none;animation:hkOnda .7s ease-out forwards`, document.body.appendChild(t), setTimeout(() => t.remove(), 750);
  }
  function gt() {
    bt = requestAnimationFrame(gt);
    const e = performance.now();
    if (Se) {
      const o = Se, t = Math.min(1, (e - o.t0) / o.ms), n = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2, a = (o.x0 + o.x1) / 2, s = (o.y0 + o.y1) / 2;
      Math.hypot(o.x1 - o.x0, o.y1 - o.y0);
      const i = a - (o.y1 - o.y0) * 0.12, r = s + (o.x1 - o.x0) * 0.12, c = 1 - n;
      Xe(c * c * o.x0 + 2 * c * n * i + n * n * o.x1, c * c * o.y0 + 2 * c * n * r + n * n * o.y1), t >= 1 && (Se = null, Nt(o.x1, o.y1), o.ok());
      return;
    }
    if (N) {
      const o = e / 900, t = Math.max(8, N.width * 0.3), n = Math.max(6, N.height * 0.3);
      Xe(N.left + N.width / 2 + t * Math.cos(o), N.top + N.height / 2 + n * Math.sin(o));
    }
  }
  function pe(e) {
    var _a, _b, _c, _d, _e2;
    const o = (_b = (_a = g()).__hekatanViewerCtx) == null ? void 0 : _b.call(_a), n = (_e2 = (_d = (_c = g().__hekatanStates) == null ? void 0 : _c.nodes) == null ? void 0 : _d.val) == null ? void 0 : _e2[e];
    if (!o || !n) return null;
    const a = o.rendererElm.getBoundingClientRect(), s = new zt(n[0], n[1], n[2]).project(o.camera);
    return [
      a.left + (s.x + 1) / 2 * a.width,
      a.top + (1 - s.y) / 2 * a.height
    ];
  }
  function xt(e) {
    let o = 1e9, t = 1e9, n = -1e9, a = -1e9;
    for (const i of e) {
      const r = pe(i);
      r && (o = Math.min(o, r[0]), n = Math.max(n, r[0]), t = Math.min(t, r[1]), a = Math.max(a, r[1]));
    }
    if (o > n) return null;
    const s = 4;
    return new DOMRect(o - s, t - s, n - o + 2 * s, a - t + 2 * s);
  }
  function Ft(e) {
    var _a, _b, _c, _d, _e2;
    if (e === "modelo") {
      const s = (_d = (_c = (_b = (_a = g()).__hekatanViewerCtx) == null ? void 0 : _b.call(_a)) == null ? void 0 : _c.rendererElm) == null ? void 0 : _d.getBoundingClientRect();
      return s ? new DOMRect(s.left + s.width * 0.4, s.top + s.height * 0.4, s.width * 0.2, s.height * 0.2) : null;
    }
    if (/^[#.[]/.test(e)) return ((_e2 = document.querySelector(e)) == null ? void 0 : _e2.getBoundingClientRect()) ?? null;
    const o = e.trim().toLowerCase();
    let t = null, n = 1e12;
    for (const s of document.querySelectorAll("body *")) {
      if ((b == null ? void 0 : b.contains(s)) || s.children.length > 2 || (s.textContent || "").trim().toLowerCase() !== o) continue;
      const i = s.getBoundingClientRect();
      !i.width || !i.height || i.width * i.height < n && (t = s, n = i.width * i.height);
    }
    if (!t) return null;
    const a = t.closest(".tp-lblv, .tp-rotv, tr, li") || t;
    return a.scrollIntoView({
      block: "center"
    }), a.getBoundingClientRect();
  }
  function Bt(e, o, t = "alineada") {
    var _a, _b;
    const n = (_b = (_a = g().__hekatanStates) == null ? void 0 : _a.nodes) == null ? void 0 : _b.val, a = n == null ? void 0 : n[e], s = n == null ? void 0 : n[o];
    if (!a || !s) return null;
    const i = [
      s[0] - a[0],
      s[1] - a[1],
      s[2] - a[2]
    ];
    return t === "vertical" ? Math.abs(i[2]) : t === "horizontal" ? Math.hypot(i[0], i[1]) : Math.hypot(i[0], i[1], i[2]);
  }
  const it = (e) => (+e.toFixed(vt.DIMDEC + (Math.abs(e) < 10 ? 1 : 0))).toString();
  function qt(e, o, t, n = "alineada") {
    var _a;
    const a = Bt(e, o, n);
    if (a === null) return t ?? "";
    const s = t && t.includes("=") ? t.split("=")[0].trim() + " = " : "", i = t && !t.includes("=") ? t.trim() : (_a = t == null ? void 0 : t.split("=")[1]) == null ? void 0 : _a.trim(), r = i === void 0 ? NaN : parseFloat(i.replace(",", "."));
    return Number.isFinite(r) && Math.abs(r - a) > Math.max(5e-3, 5e-3 * Math.abs(a)) && console.warn(`[tutor] cota ${e}-${o}: el guion dec\xEDa ${i} y el modelo mide ${it(a)}; se dibuja la del modelo`), s + it(a);
  }
  const vt = {
    DIMEXO: 5,
    DIMEXE: 6,
    DIMTXT: 14,
    DIMGAP: 4,
    DIMDEC: 2
  };
  function Rt(e, o, t, n, a, s) {
    const i = vt, r = [
      e[0] + n * s,
      e[1] + a * s
    ], c = [
      o[0] + n * s,
      o[1] + a * s
    ], m = (y, B) => `<line x1="${y[0] + n * i.DIMEXO}" y1="${y[1] + a * i.DIMEXO}" x2="${B[0] + n * i.DIMEXE}" y2="${B[1] + a * i.DIMEXE}" stroke="#22d3ee" stroke-width="1"/>`;
    let f = Math.atan2(c[1] - r[1], c[0] - r[0]) * 180 / Math.PI;
    (f > 90 || f < -90) && (f += 180);
    const d = (r[0] + c[0]) / 2 + n * (i.DIMGAP + i.DIMTXT * 0.35), u = (r[1] + c[1]) / 2 + a * (i.DIMGAP + i.DIMTXT * 0.35);
    return m(e, r) + m(o, c) + `<line x1="${r[0]}" y1="${r[1]}" x2="${c[0]}" y2="${c[1]}" stroke="#22d3ee" stroke-width="1.6" marker-start="url(#hk-fl)" marker-end="url(#hk-fl)"/><text x="${d}" y="${u}" transform="rotate(${f.toFixed(1)} ${d} ${u})" fill="#cffafe" font-family="system-ui" font-weight="700" font-size="${i.DIMTXT}" text-anchor="middle" paint-order="stroke" stroke="#0b1020" stroke-width="4">${t}</text>`;
  }
  function rt(e) {
    var _a, _b;
    if (!_) return;
    _.querySelectorAll("g").forEach((r) => r.remove());
    const o = ((_b = (_a = g().__hekatanStates) == null ? void 0 : _a.nodes) == null ? void 0 : _b.val) ?? [];
    let t = 0, n = 0, a = 0;
    for (let r = 0; r < o.length; r++) {
      const c = pe(r);
      c && (t += c[0], n += c[1], a++);
    }
    const s = t / (a || 1), i = n / (a || 1);
    for (const [r, c, m, f = 36, d = "alineada"] of e ?? []) {
      const u = pe(r), y = pe(c);
      if (!u || !y) continue;
      const B = qt(r, c, m, d), X = Math.abs(f), h = d === "horizontal" ? [
        u[0],
        Math.max(u[1], y[1])
      ] : d === "vertical" ? [
        Math.max(u[0], y[0]),
        u[1]
      ] : u, M = d === "horizontal" ? [
        y[0],
        Math.max(u[1], y[1])
      ] : d === "vertical" ? [
        Math.max(u[0], y[0]),
        y[1]
      ] : y, te = Math.hypot(M[0] - h[0], M[1] - h[1]) || 1;
      let Y = -(M[1] - h[1]) / te, G = (M[0] - h[0]) / te;
      Y * ((h[0] + M[0]) / 2 - s) + G * ((h[1] + M[1]) / 2 - i) < 0 && (Y = -Y, G = -G);
      const oe = document.createElementNS(Le, "g");
      oe.innerHTML = Rt(h, M, B, Y, G, X), oe.style.opacity = "0", oe.style.transition = "opacity .5s", _.appendChild(oe), requestAnimationFrame(() => oe.style.opacity = "1");
    }
  }
  function Ot(e) {
    if (_) for (const [o, t] of e ?? []) {
      const n = xt(o);
      if (!n) continue;
      const a = n.left + n.width / 2, s = n.top + n.height / 2, i = document.createElementNS(Le, "g");
      i.innerHTML = `<circle cx="${a}" cy="${s}" r="13" fill="#1e3a8a" stroke="#93c5fd" stroke-width="1.5"/><text x="${a}" y="${s + 5}" fill="#fff" font-family="system-ui" font-weight="700" font-size="13" text-anchor="middle">${t}</text>`, i.style.opacity = "0", i.style.transition = "opacity .5s", _.appendChild(i), requestAnimationFrame(() => i.style.opacity = "1");
    }
  }
  async function jt(e, o) {
    var _a, _b, _c, _d, _e2;
    if (Vt(), typeof e == "string" && e !== "modelo" && !/^[#.[]/.test(e) && document.body.classList.contains("hk-pane-oculto")) {
      const i = document.getElementById("hk-pane-toggle");
      if (i) {
        const r = i.getBoundingClientRect();
        H.style.opacity = "0", I.style.opacity = "0", await Oe(r.left + r.width / 2, r.top + r.height / 2), i.click(), je = true, ut(true), await J(700);
      }
    } else je && (e === void 0 || typeof e != "string" || e === "modelo" || e.startsWith("[data-cuerpo]")) && (Ye(), je = false, ut(false), await J(700));
    const t = e === void 0 ? null : typeof e == "string" ? Ft(e) : xt(e.nudos);
    N = null;
    const n = typeof e == "string" && e !== "modelo" && !e.startsWith("[data-cuerpo]");
    if (_ && (_.style.transition = "opacity .3s", _.style.opacity = n ? "0" : "1"), !t) {
      if (H.style.opacity = "0", I.style.opacity = "0", b) {
        const i = b.getBoundingClientRect();
        await Oe(i.right - 50, i.bottom - 70);
      }
      return;
    }
    const a = t.left + t.width / 2, s = t.top + t.height / 2;
    if (_.querySelectorAll("[data-punto]").forEach((i) => i.remove()), e !== void 0 && typeof e != "string") {
      H.style.opacity = "0";
      for (const i of e.nudos) {
        const r = pe(i);
        if (!r) continue;
        const c = document.createElementNS(Le, "circle");
        c.setAttribute("data-punto", "1"), c.setAttribute("cx", `${r[0]}`), c.setAttribute("cy", `${r[1]}`), c.setAttribute("r", "7"), c.setAttribute("fill", "#22d3ee"), c.setAttribute("stroke", "#000"), c.setAttribute("stroke-width", "1.5"), c.innerHTML = '<animate attributeName="r" values="5;10;5" dur="1.2s" repeatCount="indefinite"/>', _.appendChild(c);
      }
    } else Object.assign(H.style, {
      left: t.left + "px",
      top: t.top + "px",
      width: t.width + "px",
      height: t.height + "px",
      opacity: "1"
    });
    if (o) {
      I.textContent = o;
      const i = (((_e2 = (_d = (_c = (_b = (_a = g()).__hekatanViewerCtx) == null ? void 0 : _b.call(_a)) == null ? void 0 : _c.rendererElm) == null ? void 0 : _d.getBoundingClientRect()) == null ? void 0 : _e2.right) ?? innerWidth) - 10, r = I.offsetWidth || 260, c = a + 30 + r > i ? a - 30 - r : a + 30;
      Object.assign(I.style, {
        left: Math.max(c, 8) + "px",
        top: Math.max(t.top - 40, 40) + "px",
        opacity: "1"
      });
    } else I.style.opacity = "0";
    await Oe(a, s), N = typeof e == "string" ? t : new DOMRect(a - 20, s - 14, 40, 28);
  }
  async function lt(e) {
    !e || !g().__hekatanParams || !g().__hekatanRebuild || (Object.assign(g().__hekatanParams(), e), g().__hekatanRebuild(), await J(500), Ee(), await J(250));
  }
  function ct() {
    if (!b) return;
    const e = U[$], o = b.querySelector("[data-cuerpo]");
    o.innerHTML = `<div style="color:#94a3b8;font-size:12px;margin-bottom:2px">${ht.replace(/^Tutor · /, "")}</div><div style="font-weight:700;color:#7dd3fc;margin-bottom:6px">${$ + 1}/${U.length} \xB7 ${e.titulo}</div>` + (e.fig ? `<img src="${pt}img/itw/${e.fig}" style="width:100%;max-height:44vh;object-fit:contain;background:#fff;border-radius:6px;margin:6px 0 12px">` : "") + `<div style="line-height:1.5">${e.texto()}</div>`, b.querySelector("[data-ant]").disabled = $ === 0, b.querySelector("[data-sig]").disabled = $ === U.length - 1, b.querySelector("[data-barra]").style.width = `${($ + 1) / U.length * 100}%`;
  }
  async function ie() {
    var _a, _b;
    if (!b) return;
    const e = ++F;
    fe();
    const o = U[$];
    if (await lt(o.params), e !== F) return;
    ct(), await ((_a = b == null ? void 0 : b.querySelector("[data-cuerpo] img")) == null ? void 0 : _a.decode().catch(() => {
    })), rt([]);
    const t = o.tiempos ?? [
      {
        voz: o.voz ?? (() => b.querySelector("[data-cuerpo]").innerText),
        senalar: o.senalar
      }
    ], n = o.audio && ne ? await At(o.audio, e) : null;
    if (o.audio && ne && !n && b) {
      const a = document.createElement("div");
      if (a.style.cssText = "margin-top:10px;color:#fca5a5;font-size:13px", a.textContent = "Pulsa \u25B6 Reproducir o \u21BB para o\xEDr la voz (el navegador pide un clic).", (_b = b.querySelector("[data-cuerpo]")) == null ? void 0 : _b.appendChild(a), z) {
        z = false, he();
        return;
      }
    }
    for (const a of t) {
      if (e !== F || !b) return;
      a.params && await lt(a.params), a.accion && (await a.accion(), await J(300)), (a.params || a.accion) && ct(), (a.cotas || a.etiquetas) && (rt(a.cotas ? me(a.cotas) : []), Ot(a.etiquetas ? me(a.etiquetas) : []));
      const s = o.audio ? J(a.ms ?? 2500) : It(me(a.voz), e);
      await jt(a.senalar === void 0 ? void 0 : me(a.senalar), a.globo === void 0 ? void 0 : me(a.globo)), await s, await J(250);
    }
    n && e === F && await n.fin, z && e === F && $ < U.length - 1 ? (await J(500), e === F && ($++, ie())) : z && $ === U.length - 1 && (z = false, he());
  }
  function he() {
    const e = b == null ? void 0 : b.querySelector("[data-auto]");
    e && (e.textContent = z ? "\u23F8 Pausa" : "\u25B6 Reproducir");
  }
  const Ce = "min(44vw, 720px)";
  let re = null, je = false, dt = false;
  const Je = () => document.body.classList.contains("hk-pane-oculto"), Ye = () => {
    var _a;
    return (_a = document.getElementById("hk-pane-toggle")) == null ? void 0 : _a.click();
  };
  function Jt() {
    var _a, _b, _c, _d, _e2, _f;
    const e = (_b = (_a = g()).__hekatanViewerCtx) == null ? void 0 : _b.call(_a), o = (_d = (_c = g().__hekatanStates) == null ? void 0 : _c.nodes) == null ? void 0 : _d.val;
    if (!e || !(o == null ? void 0 : o.length)) return;
    const t = [
      1 / 0,
      1 / 0,
      1 / 0
    ], n = [
      -1 / 0,
      -1 / 0,
      -1 / 0
    ];
    for (const f of o) for (let d = 0; d < 3; d++) f[d] < t[d] && (t[d] = f[d]), f[d] > n[d] && (n[d] = f[d]);
    const a = [
      n[0] - t[0],
      n[1] - t[1],
      n[2] - t[2]
    ], s = Math.max(...a), i = a.indexOf(Math.min(...a));
    if (a[i] > 0.02 * s) return;
    const r = e.camera, c = e.controls.target;
    c.set((t[0] + n[0]) / 2, (t[1] + n[1]) / 2, (t[2] + n[2]) / 2);
    const m = Math.hypot(...a) * 1.6 + 1;
    r.position.set(c.x + (i === 0 ? m : 0), c.y + (i === 1 ? m : 0), c.z + (i === 2 ? m : 0)), r.up.set(0, i === 2 ? 1 : 0, i === 2 ? 0 : 1), r.lookAt(c), r.updateProjectionMatrix(), (_f = (_e2 = e.controls).update) == null ? void 0 : _f.call(_e2), e.render();
  }
  function Ee() {
    var _a, _b;
    (_b = (_a = g()).__hekatanAutoFit) == null ? void 0 : _b.call(_a), setTimeout(() => {
      var _a2, _b2, _c, _d;
      Jt();
      const e = (_b2 = (_a2 = g()).__hekatanViewerCtx) == null ? void 0 : _b2.call(_a2);
      if (!e) return;
      const o = e.controls.target, t = e.camera;
      t.isOrthographicCamera ? t.zoom /= 1.3 : t.position.sub(o).multiplyScalar(1.3).add(o), t.updateProjectionMatrix(), (_d = (_c = e.controls).update) == null ? void 0 : _d.call(_c), e.render();
    }, 120);
  }
  function ut(e) {
    var _a, _b, _c;
    const o = (_b = (_a = g()).__hekatanViewerElm) == null ? void 0 : _b.call(_a);
    if (!o || re === null) return;
    (_c = document.getElementById("hk-pane-toggle")) == null ? void 0 : _c.previousElementSibling;
    const t = e ? 450 : 130;
    o.style.width = `calc(100% - ${Ce} - ${t}px)`, setTimeout(() => {
      window.dispatchEvent(new Event("resize")), Ee();
    }, 300);
  }
  function mt(e) {
    var _a, _b;
    const o = (_b = (_a = g()).__hekatanViewerElm) == null ? void 0 : _b.call(_a);
    o && (e ? (re === null && (re = o.style.cssText, dt = Je()), Je() || Ye(), document.body.classList.add("hk-tutor"), o.style.marginLeft = Ce, o.style.width = `calc(100% - ${Ce} - 130px)`) : re !== null && (o.style.cssText = re, re = null, document.body.classList.remove("hk-tutor"), Je() !== dt && Ye()), setTimeout(() => {
      window.dispatchEvent(new Event("resize")), Ee();
    }, 400), setTimeout(Ee, 1100));
  }
  function Ue(e, o, t = false) {
    var _a, _b;
    U = o, ht = e, $ = 0, z = t;
    try {
      const a = (_b = (_a = g()).__hekatanSettings) == null ? void 0 : _b.call(_a);
      (a == null ? void 0 : a.shellResults) && (a.shellResults.val = "displacementZ");
    } catch {
    }
    b == null ? void 0 : b.remove(), b = document.createElement("div"), b.style.cssText = `position:fixed;top:32px;left:0;width:${Ce};bottom:92px;overflow-y:auto;overflow-x:hidden;z-index:9500;background:#0f172a;color:#e2e8f0;border-right:2px solid #334155;font:16px system-ui;box-shadow:6px 0 20px #0008`, b.innerHTML = '<div style="padding:8px 10px;background:#1e3a8a;border-radius:10px 10px 0 0;display:flex;gap:8px;align-items:center;cursor:move"><b style="flex:1">\u{1F393} Tutor</b><button data-voz title="Voz s\xED / no" style="background:none;border:0;color:#fff;cursor:pointer">\u{1F50A}</button><button data-x title="Cerrar" style="background:none;border:0;color:#fff;cursor:pointer">\u2715</button></div><div style="height:3px;background:#1e293b"><div data-barra style="height:3px;background:#22d3ee;width:0;transition:width .5s"></div></div><div data-cuerpo style="padding:12px 18px;line-height:1.55"></div><div style="display:flex;gap:8px;padding:10px 18px 16px;position:sticky;bottom:0;background:#0f172a;font-size:16px"><button data-ant style="padding:6px 10px">\u25C0</button><button data-auto style="flex:1;padding:6px;background:#16a34a;color:#fff;border:0;border-radius:4px;font-weight:600">\u25B6 Reproducir</button><button data-rep style="padding:6px 10px" title="Repetir este paso">\u21BB</button><button data-sig style="flex:1;padding:6px;background:#2563eb;color:#fff;border:0;border-radius:4px">Siguiente \u25B6</button></div>', document.body.appendChild(b), mt(true), he();
    const n = (a) => b.querySelector(a);
    n("[data-x]").addEventListener("click", () => {
      F++, z = false, fe(), b == null ? void 0 : b.remove(), b = null, Dt(), mt(false);
    }), n("[data-voz]").addEventListener("click", (a) => {
      ne = !ne, a.target.textContent = ne ? "\u{1F50A}" : "\u{1F507}", ne || fe();
    }), n("[data-ant]").addEventListener("click", () => {
      $ > 0 && (z = false, he(), $--, ie());
    }), n("[data-sig]").addEventListener("click", () => {
      $ < U.length - 1 && ($++, ie());
    }), n("[data-rep]").addEventListener("click", () => ie()), n("[data-auto]").addEventListener("click", () => {
      z = !z, he(), z ? ie() : (F++, fe());
    }), ie();
  }
  Ut = function(e, o, t) {
    typeof window > "u" || !g().__hekatanRebuild || (g().__hekatanTutorTest = (n) => Ue(o, t(), !!n), !g().__hekatanTutorAuto && new URLSearchParams(location.search).get("tutor") === "1" && (g().__hekatanTutorAuto = true, setTimeout(() => Ue(o, t(), true), 2500)), Pt({
      id: "tutor-" + e,
      orden: 5,
      icono: "\u{1F393}",
      titulo: "Tutor del test (paso a paso, con voz)",
      detalle: "Explica este banco: el problema del paper, la soluci\xF3n exacta y cada malla con los n\xFAmeros de Hekatan.",
      abrir: () => Ue(o, t())
    }));
  };
  const yt = 9.80665, k = () => window, be = () => k().__hekatanStates, K = (e) => Number.isFinite(e) ? e.toFixed(2) : "\u2014", Q = (e) => Number.isFinite(e) ? e.toFixed(3) : "\u2014", We = () => {
    var _a, _b;
    return ((_b = (_a = be()) == null ? void 0 : _a.nodes) == null ? void 0 : _b.val) ?? [];
  }, Ht = () => {
    var _a;
    return (_a = be()) == null ? void 0 : _a._mesaTorsionIdx;
  }, Ge = () => {
    var _a, _b, _c;
    return ((_c = (_b = (_a = k()).__hekatanParams) == null ? void 0 : _b.call(_a)) == null ? void 0 : _c.Lx) ?? 6;
  }, x = () => We().map((e, o) => [
    e,
    o
  ]).filter(([e]) => Math.abs(e[1]) < 1e-9 && e[2] > 1e-9).sort((e, o) => e[0][0] - o[0][0]).map(([, e]) => e), Xt = () => {
    const e = We();
    let o = -1, t = 1e9;
    return e.forEach((n, a) => {
      if (n[2] < 1e-9) return;
      const s = Math.hypot(n[0] - Ge() / 2, n[1] - Ge() / 2);
      s < t && (t = s, o = a);
    }), o;
  };
  function D() {
    var _a, _b, _c;
    const e = (_c = (_b = (_a = be()) == null ? void 0 : _a.analyzeOutputs) == null ? void 0 : _b.val) == null ? void 0 : _c.torsions, o = Ht();
    if (!e || !o) return NaN;
    let t = 0;
    for (let n = o.beamStart; n < o.beamEnd; n++) {
      const a = e.get(n);
      a && (t = Math.max(t, Math.abs(a[0]), Math.abs(a[1])));
    }
    return t / yt;
  }
  function He() {
    var _a, _b, _c, _d;
    const e = (_b = (_a = be()) == null ? void 0 : _a.analyzeOutputs) == null ? void 0 : _b.val, o = (_d = (_c = be()) == null ? void 0 : _c.elements) == null ? void 0 : _d.val, t = We(), n = (e == null ? void 0 : e.bendingYYjoint) ?? (e == null ? void 0 : e.bendingYY);
    if (!n || !o) return NaN;
    const a = /* @__PURE__ */ new Map();
    for (const [r, c] of n) {
      const m = o[r];
      !m || m.length !== 4 || m.forEach((f, d) => {
        if (Math.abs(t[f][1]) > 1e-9) return;
        const u = a.get(f) ?? [
          0,
          0
        ];
        a.set(f, [
          u[0] + c[d],
          u[1] + 1
        ]);
      });
    }
    const s = [
      ...a.entries()
    ].map(([r, [c, m]]) => ({
      x: t[r][0],
      m: c / m / yt
    })).sort((r, c) => r.x - c.x), i = Ge() / 2;
    for (let r = 0; r < s.length - 1; r++) if (i >= s[r].x - 1e-9 && i <= s[r + 1].x + 1e-9) return s[r].m + (s[r + 1].m - s[r].m) * (i - s[r].x) / (s[r + 1].x - s[r].x);
    return NaN;
  }
  function O() {
    var _a, _b;
    const e = ((_b = (_a = k()).__hekatanParams) == null ? void 0 : _b.call(_a)) ?? {}, o = 2812.279 / 0.70307, t = 1 / 0.0254, n = (e.bViga ?? 0.3) * t, a = (e.hViga ?? 0.5) * t;
    return 0.75 * (4 * Math.sqrt(o) * (n * a) ** 2 / (2 * (n + a))) * 4.4482216 * 0.0254 / 9806.65;
  }
  const Mt = (e) => new Promise((o) => setTimeout(o, e));
  async function le(e) {
    Object.assign(k().__hekatanParams(), e), k().__hekatanRebuild(), await Mt(450);
  }
  function ee(e, o) {
    var _a, _b;
    const t = (_b = (_a = k()).__hekatanSettings) == null ? void 0 : _b.call(_a);
    t && (e !== void 0 && t.frameResults && (t.frameResults.val = e), o !== void 0 && t.shellResults && (t.shellResults.val = o));
  }
  async function q(e) {
    var _a, _b, _c, _d, _e2, _f, _g;
    if ((_b = (_a = k()).__hekatanSetView) == null ? void 0 : _b.call(_a, e), e !== "iso") return;
    await Mt(200);
    const o = (_d = (_c = k()).__hekatanViewerCtx) == null ? void 0 : _d.call(_c);
    if (!o) return;
    const t = o.controls.target, n = o.camera;
    n.isOrthographicCamera ? n.zoom /= 1.35 : n.position.sub(t).multiplyScalar(1.35).add(t), n.updateProjectionMatrix(), (_f = (_e2 = o.controls).update) == null ? void 0 : _f.call(_e2), (_g = o.render) == null ? void 0 : _g.call(o);
  }
  let v = [];
  async function Yt(e = 6) {
    v = [];
    let o = 1;
    await le({
      factorJ: 1
    });
    for (let t = 0; t < e; t++) {
      const n = D();
      if (v.push({
        f: o,
        Tu: n
      }), O() / n >= 0.95) break;
      o *= O() / n, await le({
        factorJ: +o.toFixed(4)
      });
    }
    return v[v.length - 1];
  }
  const Gt = {
    nMesh: 5,
    factorJ: 1,
    vigaNudos: 1,
    activeCase: 4,
    rigidOffsets: 0
  }, se = (e) => `<p style="font-size:13px;color:#94a3b8;margin-top:8px">${e}</p>`, _e = (e) => `<div style="font:600 19px Cambria,serif;color:#fff;margin:8px 0 8px 12px">${e}</div>`;
  function Wt() {
    return [
      {
        titulo: "1. La mesa",
        audio: "tutoriales/mesa_torsion/p1.mp3",
        params: Gt,
        texto: () => {
          var _a, _b, _c, _d;
          return "<p>Losa de 10 cm sobre cuatro vigas de borde (30\xD750) y cuatro columnas (40\xD740, base articulada). La losa se modela con <b>c\xE1scaras</b> Shell-Thin y la viga con un <b>elemento frame</b>.</p>" + se(`Modelo: Mesa torsi\xF3nT.e2k (ETABS 19.1), combinaci\xF3n UDCon2 = 1.2D + 1.6L + 1.2SCP, losa ${(_b = (_a = k()).__hekatanParams) == null ? void 0 : _b.call(_a).nMesh}\xD7${(_d = (_c = k()).__hekatanParams) == null ? void 0 : _d.call(_c).nMesh}.`);
        },
        tiempos: [
          {
            voz: "",
            ms: 3200,
            accion: async () => {
              await q("iso"), ee("none", "displacementZ");
            },
            senalar: () => ({
              nudos: [
                Xt()
              ]
            }),
            globo: "Losa: c\xE1scara Shell-Thin, t = 0.10 m"
          },
          {
            voz: "",
            ms: 3200,
            senalar: () => ({
              nudos: x()
            }),
            globo: "Viga 30\xD750: barra (frame)"
          },
          {
            voz: "",
            ms: 2800,
            senalar: () => ({
              nudos: [
                0,
                x()[0]
              ]
            }),
            globo: "Columna 40\xD740, base articulada"
          }
        ]
      },
      {
        titulo: "2. C\xF3mo se unen losa y viga (Wilson \xA77.7)",
        audio: "tutoriales/mesa_torsion/p2.mp3",
        texto: () => "<p>En Wilson el nodo <i>i</i> est\xE1 en el plano medio de la losa y el <i>j</i> en el eje neutro de la viga; se unen con una <b>restricci\xF3n r\xEDgida</b> (ec. 7.15):</p>" + _e("\u03B8<sub>x</sub><sup>losa</sup> = \u03B8<sub>x</sub><sup>viga</sup>") + '<p style="font-size:14px;color:#cbd5e1">Wilson, <i>An\xE1lisis Est\xE1tico y Din\xE1mico de Estructuras</i>, \xA77.7, Fig. 7.6, ec. (7.15), p\xE1gs. 119\u2013120.</p>' + se("En Struct (brazos r\xEDgidos = 0) viga y losa COMPARTEN el nudo: la restricci\xF3n queda en la igualdad de giros en cada nudo compartido."),
        tiempos: [
          {
            voz: "",
            ms: 6200,
            accion: () => q("elevX"),
            senalar: () => ({
              nudos: x()
            }),
            globo: "\u03B8x losa = \u03B8x viga en cada nudo compartido"
          },
          {
            voz: "",
            ms: 6e3,
            senalar: () => ({
              nudos: [
                x()[Math.floor(x().length / 2)]
              ]
            }),
            globo: "Nudo compartido losa\u2013viga"
          }
        ]
      },
      {
        titulo: "3. Por eso la viga se tuerce",
        audio: "tutoriales/mesa_torsion/p3.mp3",
        texto: () => "<p>La losa cargada quiere girar en su borde; la viga lo impide con su rigidez torsional:</p>" + _e("T<sub>u</sub> = G\xB7J\xB7\u03B8\u2032") + `<p>Es <b>torsi\xF3n de compatibilidad</b>: aparece porque la viga acompa\xF1a el giro de la losa.</p><p>En este modelo: <b>T<sub>u</sub> = ${Q(D())} tonf\xB7m</b> (m\xE1ximo, junto a la columna).</p>`,
        tiempos: [
          {
            voz: "",
            ms: 6e3,
            accion: async () => {
              await q("plan"), ee("contour:torsions", "none");
            },
            senalar: () => ({
              nudos: [
                x()[0],
                x()[1]
              ]
            }),
            globo: () => `T_u = ${K(D())} tonf\xB7m`
          },
          {
            voz: "",
            ms: 5200,
            senalar: () => ({
              nudos: x()
            }),
            globo: "Diagrama de torsi\xF3n de la viga"
          }
        ]
      },
      {
        titulo: "4. \xBFEs confiable esa T<sub>u</sub>? El mallado",
        audio: "tutoriales/mesa_torsion/p4.mp3",
        texto: () => {
          var _a, _b, _c, _d;
          return `<p>La compatibilidad solo se cumple <b>en los nudos compartidos</b>. Wilson: <i>\u201Cpodr\xEDa ser necesario aplicar la restricci\xF3n a varias secciones a lo largo del eje de la viga\u201D</i>.</p><p>Losa ${(_b = (_a = k()).__hekatanParams) == null ? void 0 : _b.call(_a).nMesh}\xD7${(_d = (_c = k()).__hekatanParams) == null ? void 0 : _d.call(_c).nMesh}: <b>${x().length}</b> nudos compartidos \xB7 <b>T<sub>u</sub> = ${Q(D())} tonf\xB7m</b>.</p>` + _e("dT/dx = m<sub>borde</sub>(x) \u21D2 T<sub>u</sub> = \u222B\u2080<sup>L/2</sup> m dx") + '<table style="font-size:13px;color:#cbd5e1;border-collapse:collapse"><tr><th style="padding:2px 8px">n</th><th style="padding:2px 8px">Struct</th><th style="padding:2px 8px">ETABS 22</th></tr>' + [
            [
              1,
              "0.000",
              "0.000"
            ],
            [
              2,
              "2.615",
              "2.528"
            ],
            [
              4,
              "5.040",
              "4.860"
            ],
            [
              8,
              "5.849",
              "5.639"
            ],
            [
              16,
              "6.059",
              "5.844"
            ]
          ].map(([e, o, t]) => `<tr><td style="padding:1px 8px">${e}</td><td style="padding:1px 8px">${o}</td><td style="padding:1px 8px">${t}</td></tr>`).join("") + "</table>" + se("Tabla: registros/2026-09-23_torsion_vs_malla.md (misma malla en los dos programas, brazos 0). A 32\xD732 T_u = \u2212\u222Bm dx al 1 %.");
        },
        tiempos: [
          1,
          2,
          4,
          8,
          16
        ].map((e) => ({
          voz: "",
          ms: 3300,
          params: {
            nMesh: e
          },
          accion: () => {
            q("plan"), ee("contour:torsions", "none");
          },
          senalar: () => ({
            nudos: x()
          }),
          globo: () => `${e}\xD7${e}: ${x().length} nudos compartidos \xB7 T_u = ${K(D())} tonf\xB7m`
        }))
      },
      {
        titulo: "5. Modelo lineal: la viga no cumple",
        audio: "tutoriales/mesa_torsion/p5.mp3",
        params: {
          nMesh: 5,
          factorJ: 1
        },
        texto: () => `<p>Con J bruta, malla 5\xD75 (la de ETABS): <b>T<sub>u</sub> = ${Q(D())} tonf\xB7m</b> en Struct; la voz cita el de ETABS, 5.22 (Struct queda +3.7 % en torsi\xF3n en todas las mallas).</p><p>\u03C6T<sub>cr</sub> = <b>${Q(O())} tonf\xB7m</b> (ACI 318-19 \xA722.7.5.1, viga 30\xD750 sin alas, f'c = 4000 psi) \u2192 T<sub>u</sub> / \u03C6T<sub>cr</sub> = ${K(D() / O())}.</p>` + se("La interacci\xF3n cortante\u2013torsi\xF3n 51.46 > 31.67 kgf/cm\xB2 y el O/S #45 son del dise\xF1o de ETABS: Struct no hace ese chequeo y no los verifica."),
        tiempos: [
          {
            voz: "",
            ms: 7e3,
            accion: async () => {
              await q("plan"), ee("contour:torsions", "none");
            },
            senalar: () => ({
              nudos: [
                x()[0],
                x()[1]
              ]
            }),
            globo: () => `T_u = ${K(D())} > \u03C6T_cr = ${K(O())} tonf\xB7m`
          },
          {
            voz: "",
            ms: 6500,
            senalar: () => ({
              nudos: x()
            }),
            globo: "ETABS: O/S #45 (sobreesfuerzo cortante + torsi\xF3n)"
          }
        ]
      },
      {
        titulo: "6. La viga se fisura: J se reduce",
        audio: "tutoriales/mesa_torsion/p6.mp3",
        params: {
          nMesh: 5,
          factorJ: 1
        },
        texto: () => "<p>Si T<sub>u</sub> &gt; T<sub>cr</sub> la viga se fisura y su rigidez torsional cae. ACI 318 \xA722.7.3.2 permite dise\xF1arla para \u03C6T<sub>cr</sub>. Se itera:</p>" + _e("f<sub>k+1</sub> = f<sub>k</sub> \xB7 \u03C6T<sub>cr</sub> / T<sub>u,k</sub>") + (v.length ? '<table style="font-size:13px;color:#cbd5e1">' + v.map((e, o) => `<tr><td style="padding:1px 8px">${o}</td><td style="padding:1px 8px">f = ${e.f.toFixed(4)}</td><td style="padding:1px 8px">T_u = ${Q(e.Tu)}</td><td style="padding:1px 8px">\u03C6T_cr/T_u = ${Q(O() / e.Tu)}</td></tr>`).join("") + "</table>" : "") + se(`Struct, malla 5\xD75, \u03C6T_cr = ${Q(O())}. La voz cita el c\xE1lculo de ETABS (factor 0.0695, T_u = 2.00, \u03C6T_cr = 1.94); el \u03C6T_cr de ETABS no se reprodujo aqu\xED. Reducir J e iterar es una aproximaci\xF3n secante de la viga fisurada. Solo vale en torsi\xF3n de COMPATIBILIDAD; la de EQUILIBRIO no se reduce.`),
        tiempos: [
          0,
          1,
          2,
          3,
          4,
          5
        ].map((e) => ({
          voz: "",
          ms: 3e3,
          accion: async () => {
            if (e === 0) v = [], await le({
              factorJ: 1
            });
            else {
              const t = v[v.length - 1];
              O() / t.Tu < 0.95 && await le({
                factorJ: +(t.f * O() / t.Tu).toFixed(4)
              });
            }
            await q("plan"), ee("contour:torsions", "none");
            const o = k().__hekatanParams().factorJ;
            (!v.length || v[v.length - 1].f !== o) && v.push({
              f: o,
              Tu: D()
            });
          },
          senalar: () => ({
            nudos: [
              x()[0],
              x()[1]
            ]
          }),
          globo: () => `paso ${e}: factor J = ${k().__hekatanParams().factorJ.toFixed(4)} \xB7 T_u = ${K(D())} tonf\xB7m`
        }))
      },
      {
        titulo: "7. El momento pasa a la losa",
        audio: "tutoriales/mesa_torsion/p7.mp3",
        texto: () => {
          const e = v.length ? v[v.length - 1].f : NaN;
          return `<p>El torque que la viga ya no toma lo toma la <b>losa</b>. Mapa: momento M22 de la losa (m<sub>yy</sub>).</p><p>Borde sur, centro: <b>m = ${Q(He())} tonf\xB7m/m</b> con factor J = ${k().__hekatanParams().factorJ.toFixed(4)}.</p>` + se(`Lo que se conserva EXACTO es el momento del corte completo x = L/2: losa + vigas + empuje de p\xF3rtico H\xB7h = 65.681 tonf\xB7m con J bruta y con J reducida (malla 16\xD716); la losa pasa de 8.11 a 13.57. La suma borde + centro en UN punto no es constante (no es una franja sobre apoyos r\xEDgidos). La voz cita ETABS (\u22122.73 \u2192 \u22120.85); factor final de Struct: ${Number.isFinite(e) ? e.toFixed(4) : "\u2014"}.`);
        },
        tiempos: [
          {
            voz: "",
            ms: 6200,
            accion: async () => {
              await le({
                factorJ: 1
              }), await q("iso"), ee("none", "bendingYY");
            },
            senalar: () => ({
              nudos: x().filter((e, o, t) => Math.abs(o - (t.length - 1) / 2) <= 0.5)
            }),
            globo: () => `J bruta: m_borde = ${K(He())} tonf\xB7m/m`
          },
          {
            voz: "",
            ms: 6300,
            accion: async () => {
              v.length || await Yt(), await le({
                factorJ: +v[v.length - 1].f.toFixed(4)
              }), await q("iso"), ee("none", "bendingYY");
            },
            senalar: () => ({
              nudos: x().filter((e, o, t) => Math.abs(o - (t.length - 1) / 2) <= 0.5)
            }),
            globo: () => `J fisurada: m_borde = ${K(He())} tonf\xB7m/m`
          }
        ]
      },
      {
        titulo: "8. Conclusi\xF3n para el dise\xF1o",
        audio: "tutoriales/mesa_torsion/p8.mp3",
        texto: () => "<p>\u2022 La T<sub>u</sub> lineal es un <b>m\xE1ximo el\xE1stico</b>, confiable solo si la malla converge (T<sub>u</sub> sube al refinar: 0 \u2192 2.62 \u2192 5.04 \u2192 5.85 \u2192 6.06).<br>\u2022 La <b>losa</b> se arma con los momentos <b>despu\xE9s</b> de fisurar la viga (positivo al centro +48 % a 16\xD716).<br>\u2022 La <b>viga</b> igual lleva estribos cerrados y acero longitudinal para \u03C6T<sub>cr</sub>.<br>\u2022 Solo aplica a torsi\xF3n de <b>compatibilidad</b>; la de <b>equilibrio</b> (un volado colgado de la viga) no se reduce.<br>\u2022 Reducir J e iterar es una aproximaci\xF3n secante del comportamiento no lineal.</p>",
        tiempos: [
          {
            voz: "",
            ms: 9500,
            accion: async () => {
              await q("iso"), ee("contour:torsions", "none");
            },
            senalar: "modelo"
          },
          {
            voz: "",
            ms: 9e3,
            senalar: () => ({
              nudos: x()
            }),
            globo: "Estribos cerrados + longitudinal para \u03C6T_cr"
          }
        ]
      }
    ];
  }
  let ae, ft, R;
  ae = 9.80665;
  ft = {
    Dead: {
      P: 5.72,
      V2: 2.05,
      V3: 0.45,
      T: 0.53,
      M2: 1.57,
      M3: 2.43
    },
    Live: {
      P: 4.5,
      V2: 2.2,
      V3: 0.61,
      T: 1.15,
      M2: 2.13,
      M3: 3.14
    },
    SCP: {
      P: 9,
      V2: 4.41,
      V3: 1.22,
      T: 2.29,
      M2: 4.26,
      M3: 6.28
    },
    UDCon1: {
      P: 20.61,
      V2: 9.03,
      V3: 2.33,
      T: 3.96,
      M2: 8.16,
      M3: 12.2
    },
    UDCon2: {
      P: 24.86,
      V2: 11.27,
      V3: 2.97,
      T: 5.22,
      M2: 10.4,
      M3: 15.48
    }
  };
  R = [
    0.34337,
    0.34337,
    0.28756
  ];
  ao = {
    id: "mesa-torsion",
    name: "\u{1F300} Mesa de Torsi\xF3n (ETABS Gabriela/Seproinca)",
    category: "4\uFE0F\u20E3 Mixtos \xB7 \u{1F500} Losas con vigas",
    benchmark: true,
    defaultShellResult: "displacementZ",
    availableShellResults: [
      "none",
      "pressure",
      "membraneXX",
      "membraneYY",
      "membraneXY",
      "membranePrincipalMax",
      "membranePrincipalMin",
      "vonMises",
      "tranverseShearX",
      "tranverseShearY",
      "transverseShearMax",
      "bendingXX",
      "bendingYY",
      "bendingXY",
      "bendingPrincipalMax",
      "bendingPrincipalMin",
      "displacementX",
      "displacementY",
      "displacementZ"
    ],
    hasModal: true,
    guide: [
      "Modelo 'Mesa de torsi\xF3n' ETABS 19.1 (Gabriela/Seproinca 2020).",
      "6\xD76m \xD7 4m alto \xB7 4 col C40\xD740 PINNED-base \xB7 4 vigas V30\xD750 perim \xB7 losa 10cm \xB7 diaph r\xEDgido.",
      "Selector 'Caso visualizado' cambia entre Dead/Live/SCP/UDCon1/UDCon2.",
      "Tabla \u{1F4CA} Comparaci\xF3n ETABS muestra picks ETABS vs Hekatan por componente y diferencia %.",
      "ETABS periodos modal: T1=T2=0.34337s lateral, T3=0.28756s torsi\xF3n Rz.",
      "Rigid offsets ETABS: col flexible=3.5m (auto -h_viga/2), viga flexible=5.6m (auto -b_col/2).",
      "T_u vs malla (Wilson \xA77.7): cambia 'Subdiv losa' 1\u219216 y 'Uni\xF3n viga\u2013losa'; T_u = 0 / 2.61 / 5.04 / 5.85 / 6.06 tonf\xB7m (UDCon2).",
      "\u{1F393} Tutor con voz: men\xFA \xAB\u{1F4D0} Dise\xF1o\xBB \u2192 \xABTutor del test\xBB, o abre ?t=mesa-torsion&tutor=1 (Wilson \xA77.7, malla, ACI \xA722.7.3.2)."
    ],
    params: {
      activeCase: {
        default: 0,
        label: "Caso visualizado",
        options: {
          "Dead (selfweight)": 0,
          "Live (q=0.5 tonf/m\xB2)": 1,
          "SCP (q=1.0 tonf/m\xB2)": 2,
          "UDCon1 (1.4D+1.4SCP)": 3,
          "UDCon2 (1.2D+1.6L+1.2SCP)": 4
        },
        folder: "Caso"
      },
      Lx: {
        default: 6,
        min: 4,
        max: 12,
        step: 0.5,
        label: "Lx (m)",
        folder: "Geometr\xEDa"
      },
      Ly: {
        default: 6,
        min: 4,
        max: 12,
        step: 0.5,
        label: "Ly (m)",
        folder: "Geometr\xEDa"
      },
      H: {
        default: 4,
        min: 2.5,
        max: 6,
        step: 0.25,
        label: "H piso (m)",
        folder: "Geometr\xEDa"
      },
      nMesh: {
        default: 5,
        min: 1,
        max: 32,
        step: 1,
        label: "Subdiv losa (n\xD7n)",
        folder: "Geometr\xEDa"
      },
      vigaNudos: {
        default: 1,
        label: "Uni\xF3n viga\u2013losa",
        options: {
          "Nudos compartidos (viga partida en la malla)": 1,
          "Solo en los extremos (viga de una pieza)": 0
        },
        folder: "Geometr\xEDa"
      },
      bCol: {
        default: 0.4,
        min: 0.25,
        max: 0.8,
        step: 0.05,
        label: "b col (m)",
        folder: "Secciones"
      },
      hCol: {
        default: 0.4,
        min: 0.25,
        max: 0.8,
        step: 0.05,
        label: "h col (m)",
        folder: "Secciones"
      },
      bViga: {
        default: 0.3,
        min: 0.2,
        max: 0.6,
        step: 0.05,
        label: "b viga (m)",
        folder: "Secciones"
      },
      hViga: {
        default: 0.5,
        min: 0.3,
        max: 0.9,
        step: 0.05,
        label: "h viga (m)",
        folder: "Secciones"
      },
      tLosa: {
        default: 0.1,
        min: 0.08,
        max: 0.3,
        step: 0.01,
        label: "t losa (m)",
        folder: "Secciones"
      },
      factorJ: {
        default: 1,
        min: 1e-3,
        max: 1,
        step: 1e-4,
        label: "Factor J vigas",
        folder: "Secciones"
      },
      E_GPa: {
        default: 24.85,
        min: 15,
        max: 35,
        step: 0.5,
        label: "E (GPa)",
        folder: "Material"
      },
      nu: {
        default: 0.2,
        min: 0.1,
        max: 0.3,
        step: 0.01,
        label: "\u03BD",
        folder: "Material"
      },
      gamma_kNm3: {
        default: 23.57,
        min: 18,
        max: 28,
        step: 0.1,
        label: "\u03B3 (kN/m\xB3)",
        folder: "Material"
      },
      apoyo: {
        default: 0,
        label: "Apoyo base",
        options: {
          "Pinned (UX UY UZ)": 0,
          "Empotrado (6 DOF)": 1
        },
        folder: "Apoyo"
      },
      rigidOffsets: {
        default: 1,
        label: "Rigid offsets ETABS-like",
        options: {
          "ON (h_viga/2 + b_col/2)": 1,
          "OFF (full length)": 0
        },
        folder: "ETABS features"
      },
      q_SCP: {
        default: 1,
        min: 0,
        max: 5,
        step: 0.1,
        label: "SCP (tonf/m\xB2)",
        folder: "Cargas"
      },
      q_Live: {
        default: 0.5,
        min: 0,
        max: 5,
        step: 0.1,
        label: "Live (tonf/m\xB2)",
        folder: "Cargas"
      },
      nModos: {
        default: 12,
        min: 3,
        max: 24,
        step: 1,
        label: "N modos modal",
        folder: "Modal"
      },
      masaModal: {
        default: 0,
        label: "Masa modal",
        options: {
          "ETABS (K_M: viga en esquinas, lateral, por piso)": 0,
          "Por elemento (viga repartida)": 1
        },
        folder: "Modal"
      }
    },
    computedLabels(e, o) {
      const t = {}, n = o._mesaTorsionCases;
      if (!n) return t;
      t["\u2014\u2014 ETABS ref T\u2081 Ux \u2014\u2014"] = `${R[0].toFixed(4)} s`, t["\u2014\u2014 ETABS ref T\u2082 Uy \u2014\u2014"] = `${R[1].toFixed(4)} s`, t["\u2014\u2014 ETABS ref T\u2083 Rz \u2014\u2014"] = `${R[2].toFixed(4)} s`;
      for (const a of [
        "Dead",
        "Live",
        "SCP",
        "UDCon1",
        "UDCon2"
      ]) {
        const s = n[a], i = ft[a];
        if (!s || !i) continue;
        const r = (c, m) => {
          const f = m !== 0 ? (c - m) / m * 100 : 0;
          return `H=${c.toFixed(2)}  E=${m.toFixed(2)}  \u0394=${f >= 0 ? "+" : ""}${f.toFixed(1)}%`;
        };
        t[`${a} |P|`] = r(s.P, i.P), t[`${a} |V\u2082|`] = r(s.V2, i.V2), t[`${a} |V\u2083|`] = r(s.V3, i.V3), t[`${a} |T|`] = r(s.T, i.T), t[`${a} |M\u2082|`] = r(s.M2, i.M2), t[`${a} |M\u2083|`] = r(s.M3, i.M3);
      }
      return t;
    },
    build(e, o) {
      const t = Math.round(e.nMesh), n = e.Lx, a = e.Ly, s = e.H, i = n / t, r = a / t, c = e.gamma_kNm3 / 9.81, m = [
        [
          0,
          0,
          0
        ],
        [
          n,
          0,
          0
        ],
        [
          n,
          a,
          0
        ],
        [
          0,
          a,
          0
        ]
      ], f = 4;
      for (let l = 0; l <= t; l++) for (let p = 0; p <= t; p++) m.push([
        p * i,
        l * r,
        s
      ]);
      const d = (l, p) => f + p * (t + 1) + l, u = [];
      for (let l = 0; l < t; l++) for (let p = 0; p < t; p++) u.push([
        d(p, l),
        d(p + 1, l),
        d(p + 1, l + 1),
        d(p, l + 1)
      ]);
      const y = u.length;
      u.push([
        0,
        d(0, 0)
      ]), u.push([
        1,
        d(t, 0)
      ]), u.push([
        2,
        d(t, t)
      ]), u.push([
        3,
        d(0, t)
      ]);
      const B = y, X = u.length, h = Math.round(e.vigaNudos ?? 1) === 0 ? 1 : t, M = t / h;
      for (let l = 0; l < h; l++) u.push([
        d(l * M, 0),
        d((l + 1) * M, 0)
      ]);
      for (let l = 0; l < h; l++) u.push([
        d(t, l * M),
        d(t, (l + 1) * M)
      ]);
      for (let l = 0; l < h; l++) u.push([
        d(l * M, t),
        d((l + 1) * M, t)
      ]);
      for (let l = 0; l < h; l++) u.push([
        d(0, l * M),
        d(0, (l + 1) * M)
      ]);
      const te = X, Y = u.length, G = /* @__PURE__ */ new Map(), oe = e.apoyo < 0.5;
      for (const l of [
        0,
        1,
        2,
        3
      ]) G.set(l, oe ? [
        true,
        true,
        true,
        false,
        false,
        false
      ] : [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      const ge = e.E_GPa * 1e6, Ze = ge / (2 * (1 + e.nu)), Ke = /* @__PURE__ */ new Map(), xe = /* @__PURE__ */ new Map(), ve = /* @__PURE__ */ new Map(), ze = /* @__PURE__ */ new Map(), Pe = /* @__PURE__ */ new Map(), Ae = /* @__PURE__ */ new Map(), Ie = /* @__PURE__ */ new Map(), Ve = /* @__PURE__ */ new Map(), ye = /* @__PURE__ */ new Map(), De = /* @__PURE__ */ new Map(), Me = /* @__PURE__ */ new Map(), Qe = /* @__PURE__ */ new Map();
      for (let l = 0; l < y; l++) Ke.set(l, e.tLosa), xe.set(l, ge), ve.set(l, e.nu), ye.set(l, c), Qe.set(l, 1);
      const et = e.bCol * e.hCol, Tt = e.bCol * Math.pow(e.hCol, 3) / 12, wt = e.hCol * Math.pow(e.bCol, 3) / 12, tt = (l, p) => {
        const S = Math.max(l, p), T = Math.min(l, p), E = T / S;
        return 1 / 3 * (1 - 0.21 * E * (1 - Math.pow(E, 4) / 12)) * S * Math.pow(T, 3);
      }, _t = tt(e.bCol, e.hCol), ot = e.rigidOffsets > 0.5 ? e.hViga / 2 / s : 0;
      for (let l = B; l < X; l++) xe.set(l, ge), ve.set(l, e.nu), Ve.set(l, Ze), ze.set(l, et), Pe.set(l, wt), Ae.set(l, Tt), Ie.set(l, _t), ye.set(l, c), De.set(l, {
        type: "rect",
        b: e.bCol,
        h: e.hCol
      }), ot > 0 && Me.set(l, [
        0,
        ot
      ]);
      const at = e.bViga * e.hViga, St = e.bViga * Math.pow(e.hViga, 3) / 12, kt = e.hViga * Math.pow(e.bViga, 3) / 12, $t = tt(e.bViga, e.hViga) * (e.factorJ ?? 1), nt = n / h, Ne = e.rigidOffsets > 0.5 ? e.bCol / 2 / nt : 0;
      let P = te;
      for (let l = 0; l < 4; l++) for (let p = 0; p < h; p++) {
        if (xe.set(P, ge), ve.set(P, e.nu), Ve.set(P, Ze), ze.set(P, at), Pe.set(P, kt), Ae.set(P, St), Ie.set(P, $t), ye.set(P, c), De.set(P, {
          type: "rect",
          b: e.bViga,
          h: e.hViga
        }), Ne > 0) {
          const S = p === 0 ? Ne : 0, T = p === h - 1 ? Ne : 0;
          S + T > 0 && Me.set(P, [
            S,
            T
          ]);
        }
        P++;
      }
      o.nodes.val = m, o.elements.val = u, o.elementInputs.val = {
        elasticities: xe,
        poissonsRatios: ve,
        shearModuli: Ve,
        areas: ze,
        momentsOfInertiaY: Pe,
        momentsOfInertiaZ: Ae,
        torsionalConstants: Ie,
        thicknesses: Ke,
        densities: ye,
        sectionShapes: De,
        rigidOffsets: Me.size > 0 ? Me : void 0,
        plateFormulations: Qe
      }, o._mesaTorsionIdx = {
        beamStart: te,
        beamEnd: Y,
        RHO: c,
        topCorners: [
          d(0, 0),
          d(t, 0),
          d(t, t),
          d(0, t)
        ]
      };
      function st(l, p, S) {
        const T = /* @__PURE__ */ new Map(), E = (w, A) => {
          const V = T.get(w) || [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          T.set(w, [
            V[0],
            V[1],
            V[2] + A,
            V[3],
            V[4],
            V[5]
          ]);
        };
        if (l !== 0) {
          for (let L = 0; L < t; L++) for (let C = 0; C < t; C++) {
            const Re = -(e.tLosa * i * r * e.gamma_kNm3 * l) / 4;
            for (const we of [
              d(C, L),
              d(C + 1, L),
              d(C + 1, L + 1),
              d(C, L + 1)
            ]) E(we, Re);
          }
          const w = et * s * e.gamma_kNm3 * l, A = [
            [
              0,
              d(0, 0)
            ],
            [
              1,
              d(t, 0)
            ],
            [
              2,
              d(t, t)
            ],
            [
              3,
              d(0, t)
            ]
          ];
          for (const [L, C] of A) E(L, -w / 2), E(C, -w / 2);
          let V = te;
          for (let L = 0; L < 4; L++) for (let C = 0; C < h; C++) {
            const [Te, Re] = u[V], we = at * nt * e.gamma_kNm3 * l;
            E(Te, -we / 2), E(Re, -we / 2), V++;
          }
        }
        const Z = (p + S) * ae;
        if (Z !== 0) for (let w = 0; w <= t; w++) for (let A = 0; A <= t; A++) {
          const C = (A === 0 || A === t) && (w === 0 || w === t) ? 0.25 : A === 0 || A === t || w === 0 || w === t ? 0.5 : 1, Te = -Z * i * r * C;
          E(d(A, w), Te);
        }
        return T;
      }
      const de = [
        {
          name: "Dead",
          sw: 1,
          scp: 0,
          live: 0
        },
        {
          name: "Live",
          sw: 0,
          scp: 0,
          live: e.q_Live
        },
        {
          name: "SCP",
          sw: 0,
          scp: e.q_SCP,
          live: 0
        },
        {
          name: "UDCon1",
          sw: 1.4,
          scp: 1.4 * e.q_SCP,
          live: 0
        },
        {
          name: "UDCon2",
          sw: 1.2,
          scp: 1.2 * e.q_SCP,
          live: 1.6 * e.q_Live
        }
      ], Fe = {}, Be = {};
      for (const l of de) {
        const p = st(l.sw, l.scp, l.live);
        try {
          const S = Lt(m, u, {
            supports: G,
            loads: p
          }, o.elementInputs.val), T = Ct(m, u, o.elementInputs.val, S);
          Fe[l.name] = {
            deform: S,
            analyze: T
          }, Be[l.name] = Zt(T, B, Y);
        } catch (S) {
          console.warn(`[Mesa torsi\xF3n] caso ${l.name} fall\xF3:`, S.message);
        }
      }
      o._mesaTorsionCases = Be, o._mesaTorsionAllResults = Fe;
      const ue = [
        "Dead",
        "Live",
        "SCP",
        "UDCon1",
        "UDCon2"
      ][Math.round(e.activeCase)] || "UDCon2", qe = Fe[ue];
      qe && (o.deformOutputs.val = qe.deform, o.analyzeOutputs.val = qe.analyze), o.nodeInputs.val = {
        supports: G,
        loads: st(de.find((l) => l.name === ue).sw, de.find((l) => l.name === ue).scp, de.find((l) => l.name === ue).live)
      };
      const W = [];
      W.push(`[Mesa torsi\xF3n] Caso visualizado: ${ue}`), W.push(`  Discretizaci\xF3n: ${y} shells losa, 4 cols, ${Y - te} segs viga`), W.push(`  Rigid offsets: ${e.rigidOffsets > 0.5 ? `ON (col top -${(e.hViga / 2).toFixed(2)}m, viga ends -${(e.bCol / 2).toFixed(2)}m)` : "OFF"}`), W.push(""), W.push("  Picks por caso \u2014 Hekatan vs ETABS (\u0394% relativo, sin remapear componentes):"), W.push(`  ${"Case".padEnd(8)} ${"Comp".padEnd(4)} ${"Hekatan".padStart(10)} ${"ETABS".padStart(10)} ${"\u0394%".padStart(8)}`);
      for (const l of de) {
        const p = Be[l.name], S = ft[l.name];
        if (!(!p || !S)) for (const T of [
          "P",
          "V2",
          "V3",
          "T",
          "M2",
          "M3"
        ]) {
          const E = p[T], Z = S[T], w = Z !== 0 ? (E - Z) / Z * 100 : 0;
          W.push(`  ${l.name.padEnd(8)} ${T.padEnd(4)} ${E.toFixed(3).padStart(10)} ${Z.toFixed(3).padStart(10)} ${(w >= 0 ? "+" : "") + w.toFixed(1).padStart(7)}%`);
        }
      }
      console.log(W.join(`
`)), o.objects3D.val = [], Ut("mesa-torsion", "Tutor \xB7 Mesa de torsi\xF3n: T_u, malla y fisuraci\xF3n", Wt);
    },
    runModal(e, o, t) {
      if (!o.nodes.val.length) return;
      const n = Math.round(e.nModos);
      try {
        let a = o.nodeInputs.val, s = o.elementInputs.val, i = 0, r = 0;
        const c = o._mesaTorsionIdx;
        if (Math.round(e.masaModal ?? 0) === 0 && c) {
          const d = new Map(s.densities);
          for (let h = c.beamStart; h < c.beamEnd; h++) d.set(h, 0);
          const u = e.rigidOffsets > 0.5 ? e.bCol : 0, y = (h) => c.RHO * e.bViga * e.hViga * (h - u) / 2, B = y(e.Lx) + y(e.Ly), X = new Map(a.masses ?? []);
          for (const h of c.topCorners) X.set(h, (X.get(h) ?? 0) + B);
          s = {
            ...s,
            densities: d
          }, a = {
            ...a,
            masses: X
          }, i = 1, r = 1;
        }
        const m = Et(o.nodes.val, o.elements.val, a, s, n, i, r);
        o._mesaTorsionModal = {
          nodeInputs: a,
          elementInputs: s,
          lateral: i,
          lump: r,
          out: m
        };
        const f = [];
        f.push(`[Mesa torsi\xF3n Modal Hekatan FEM 3D] ${n} modos:`);
        for (let d = 0; d < Math.min(n, 6); d++) {
          const u = 1 / m.frequencies[d];
          f.push(`  Modo ${d + 1}: T = ${u.toFixed(4)} s   f = ${m.frequencies[d].toFixed(3)} Hz`);
        }
        f.push(""), f.push("ETABS 19.1 reference:"), f.push(`  Modo 1 T\u2081 Ux = ${R[0].toFixed(4)} s`), f.push(`  Modo 2 T\u2082 Uy = ${R[1].toFixed(4)} s`), f.push(`  Modo 3 T\u2083 Rz = ${R[2].toFixed(4)} s`), console.log(f.join(`
`)), (t == null ? void 0 : t.render) && t.render(m, {
          title: `Mesa de Torsi\xF3n \u2014 ${e.Lx}\xD7${e.Ly}m, ${e.H}m alto`,
          properties: [
            `${e.apoyo < 0.5 ? "Pinned base" : "Empotrado"}  E=${e.E_GPa} GPa  \u03BD=${e.nu}`,
            `ETABS ref: T\u2081=${R[0]}s  T\u2082=${R[1]}s  T\u2083=${R[2]}s`
          ]
        });
      } catch (a) {
        console.error("[Mesa torsi\xF3n Modal] error:", a.message);
      }
    }
  };
  function Zt(e, o, t) {
    const n = (a) => {
      if (!a) return 0;
      let s = 0;
      for (let i = o; i < t; i++) {
        const r = a.get(i);
        r && (s = Math.max(s, Math.abs(r[0]), Math.abs(r[1])));
      }
      return s;
    };
    return {
      P: n(e.normals) / ae,
      V2: n(e.shearsY) / ae,
      V3: n(e.shearsZ) / ae,
      T: n(e.torsions) / ae,
      M2: n(e.bendingsY) / ae,
      M3: n(e.bendingsZ) / ae
    };
  }
});
export {
  __tla,
  ao as m,
  oo as n,
  Ut as r
};
