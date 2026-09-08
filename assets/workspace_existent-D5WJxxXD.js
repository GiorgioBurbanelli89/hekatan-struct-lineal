import "./modulepreload-polyfill-B5Qt9EMX.js";
import { c as d } from "./csiImporter-d1C9iX1E.js";
import { c as p, __tla as __tla_0 } from "./cliModeler-DW6WcTvx.js";
import { p as k } from "./e2kParser-UQm6yNuB.js";
import { r as w, __tla as __tla_1 } from "./runExampleStandalone-xuCc7obF.js";
import "./theme-U-6D_qyI.js";
import "./cadSections-DVtTZU6U.js";
import { __tla as __tla_2 } from "./h8-B8y-PzF9.js";
import { __tla as __tla_3 } from "./deform-ZnZ8PQ4z.js";
import "./preload-helper-V2P8TQsQ.js";
import "./analyze-BFwM3Jvn.js";
import "./pureFunctionsAny.generated-DeJSBP3k.js";
import { __tla as __tla_4 } from "./didacticCpp-DaEmtxPu.js";
import "./tweakpane-BXg6ZhiP.js";
import "./getViewer-uzQ7rr8P.js";
import "./Text-CUW6lNkV.js";
import "./styles-SbI03m7S.js";
import "./renderModalTable-BJWFR1R0.js";
import "./units-C7eDg0Ff.js";
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
  })(),
  (() => {
    try {
      return __tla_3;
    } catch {
    }
  })(),
  (() => {
    try {
      return __tla_4;
    } catch {
    }
  })()
]).then(async () => {
  const h = new URLSearchParams(window.location.search);
  function u(s) {
    const o = document.createElement("div");
    return o.textContent = s, o.style.cssText = [
      "position:fixed",
      "inset:0",
      "z-index:9000",
      "display:flex",
      "align-items:center",
      "justify-content:center",
      "background:#1b1e24",
      "color:#7f8a9a",
      "font:13px ui-monospace,Consolas,monospace",
      "pointer-events:none"
    ].join(";"), document.body.appendChild(o), o;
  }
  function l(s, o) {
    var _a, _b;
    const t = k(s), a = {};
    for (const [c, e] of Object.entries(t.elementInputs ?? {})) e instanceof Map && (a[c] = [
      ...e.entries()
    ]);
    window.__hekatanImportedModel = {
      fuente: "E2K",
      archivo: o,
      nodes: t.nodes,
      elements: t.elements,
      tipos: t.elements.map((c, e) => {
        var _a2;
        return c.length === 4 ? "AREA" : ((_a2 = t.elementTypes) == null ? void 0 : _a2[e]) ?? "BEAM";
      }),
      secciones: t.elements.map((c, e) => {
        var _a2;
        return ((_a2 = t.elementSections) == null ? void 0 : _a2.get(e)) ?? "\u2014";
      }),
      plantas: t.elementStories ?? [],
      supports: [
        ...(((_a = t.nodeInputs) == null ? void 0 : _a.supports) ?? /* @__PURE__ */ new Map()).entries()
      ],
      loads: [
        ...(((_b = t.nodeInputs) == null ? void 0 : _b.loads) ?? /* @__PURE__ */ new Map()).entries()
      ],
      elementInputs: a,
      info: t.info
    };
    const r = new Set(t.elements.map((c, e) => {
      var _a2;
      return (_a2 = t.elementSections) == null ? void 0 : _a2.get(e);
    })).size;
    return {
      n: t.nodes.length,
      e: t.elements.length,
      s: r
    };
  }
  function b() {
    const s = document.createElement("button");
    s.textContent = "\u{1F4C2} Abrir .e2k / .heks", s.style.cssText = [
      "position:fixed",
      "top:12px",
      "left:50%",
      "transform:translateX(-50%)",
      "z-index:9100",
      "padding:8px 16px",
      "border-radius:6px",
      "border:1px solid #3a4150",
      "background:#242a35",
      "color:#cfd6e0",
      "font:13px ui-monospace,Consolas,monospace",
      "cursor:pointer"
    ].join(";"), s.onclick = () => {
      const o = document.createElement("input");
      o.type = "file", o.accept = ".e2k,.$et,.heks,.txt", o.onchange = async (t) => {
        var _a;
        const a = (_a = t.target.files) == null ? void 0 : _a[0];
        if (!a) return;
        const r = await a.text();
        /\.heks$/i.test(a.name) ? window.__hekatanCliScript = r : l(r, a.name), window.location.reload();
      }, o.click();
    }, document.body.appendChild(s);
  }
  function $(s) {
    const o = document.createElement("div");
    o.textContent = s, o.style.cssText = [
      "position:fixed",
      "top:44px",
      "right:16px",
      "z-index:101",
      "padding:2px 8px",
      "border-radius:4px",
      "background:rgba(20,24,31,0.85)",
      "color:#8b95a5",
      "font:11px ui-monospace,Consolas,monospace",
      "pointer-events:none",
      "max-width:min(320px,calc(100vw - 32px))"
    ].join(";"), document.body.appendChild(o);
  }
  async function v() {
    var _a, _b;
    const s = h.get("e2k"), o = h.get("heks");
    let t = d, a = "Modelo existente", r = "";
    if (s) {
      const e = u("Importando e2k\u2026");
      try {
        const n = await fetch(s, {
          cache: "no-store"
        });
        if (!n.ok) throw new Error(`HTTP ${n.status}`);
        const i = s.split("/").pop() || s, m = l(await n.text(), i);
        a = i, r = `${m.n} nudos \xB7 ${m.e} elementos \xB7 ${m.s} secciones`;
      } catch (n) {
        e.textContent = `No se pudo importar ${s} \u2014 ${(n == null ? void 0 : n.message) ?? n}`, setTimeout(() => e.remove(), 5e3);
      } finally {
        setTimeout(() => e.remove(), 300);
      }
    } else if (o) {
      t = p;
      const e = u("Cargando modelo\u2026");
      try {
        const n = await fetch(o, {
          cache: "no-store"
        });
        if (!n.ok) throw new Error(`HTTP ${n.status}`);
        const i = await n.text();
        window.__hekatanCliScript = i;
        const m = o.split("/").pop() || o, f = (i.match(/^\s*node\s+/gm) ?? []).length, x = (i.match(/^\s*frame\s+/gm) ?? []).length, g = (i.match(/^\s*shell\s+/gm) ?? []).length;
        a = m, r = `${f} nudos \xB7 ${x} barras \xB7 ${g} shells`;
      } catch (n) {
        e.textContent = `No se pudo cargar ${o} \u2014 ${(n == null ? void 0 : n.message) ?? n}`, setTimeout(() => e.remove(), 5e3);
      } finally {
        setTimeout(() => e.remove(), 300);
      }
    } else if (sessionStorage.getItem("hekatan.abrir.texto")) {
      const e = sessionStorage.getItem("hekatan.abrir.texto") || "", n = sessionStorage.getItem("hekatan.abrir.nombre") || "archivo";
      if (sessionStorage.removeItem("hekatan.abrir.texto"), sessionStorage.removeItem("hekatan.abrir.nombre"), /\.heks$/i.test(n)) {
        t = p, window.__hekatanCliScript = e;
        const i = (e.match(/^\s*node\s+/gm) ?? []).length, m = (e.match(/^\s*frame\s+/gm) ?? []).length;
        a = n, r = `${i} nudos \xB7 ${m} barras`;
      } else {
        const i = l(e, n);
        a = n, r = `${i.n} nudos \xB7 ${i.e} elementos \xB7 ${i.s} secciones`;
      }
    } else if (window.__hekatanImportedModel) {
      const e = window.__hekatanImportedModel;
      a = e.archivo, r = `${((_a = e.nodes) == null ? void 0 : _a.length) ?? 0} nudos \xB7 ${((_b = e.elements) == null ? void 0 : _b.length) ?? 0} elementos`;
    } else window.__hekatanCliScript ? t = p : b();
    const c = {
      ...t,
      id: "workspace_existent",
      name: a,
      category: "\u{1F4C2} Existente",
      params: t === d ? t.params : {}
    };
    w(c), r && $(r);
  }
  v();
});
