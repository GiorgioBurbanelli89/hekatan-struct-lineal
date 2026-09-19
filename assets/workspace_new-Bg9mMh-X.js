import "./modulepreload-polyfill-B5Qt9EMX.js";
import { c as r, __tla as __tla_0 } from "./cliModeler-DEIrl_1S.js";
import { r as a, __tla as __tla_1 } from "./runExampleStandalone-D4u69Vdt.js";
import "./cadSections-Cc6U2MoW.js";
import "./cargasPorCaso-B_GZ_-rO.js";
import { __tla as __tla_2 } from "./h8-Dq5Es-cV.js";
import { __tla as __tla_3 } from "./didacticCpp-Czy7NlhT.js";
import { __tla as __tla_4 } from "./analyze-Du843e5g.js";
import { __tla as __tla_5 } from "./getViewer-B5L64pyA.js";
import "./theme-C-zoknmI.js";
import "./Text-Cehu0nom.js";
import "./tweakpane-BXg6ZhiP.js";
import "./aiAgent-VzHiuQev.js";
import "./pureFunctionsAny.generated-DeJSBP3k.js";
import "./renderModalTable-CaPpqUR8.js";
import "./units-DmFPJGLv.js";
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
  })(),
  (() => {
    try {
      return __tla_5;
    } catch {
    }
  })()
]).then(async () => {
  const t = "hekatan.nuevo.borrador", n = [
    "# Modelo nuevo \u2014 escrib\xED encima. Comandos:",
    "#   node ID x y z            frame ID nI nJ E A Iz Iy J nu rho",
    "#   support ID fixed|pinned  load ID FX FY FZ MX MY MZ",
    "#   frameload ID wx wy wz    shell ID n1 n2 n3 n4 t E",
    "#   ang ID grados            as ID As2 As3",
    "#   solve",
    "",
    "node 1 0 0 0",
    "node 2 5 0 0",
    "support 1 fixed",
    "frame 1 1 2 200e6 0.0029 3.11e-5 1.78e-6 4.67e-8 0.3 7.85   # VA-250",
    "load 2 0 0 -10",
    "solve"
  ].join(`
`);
  let e = n;
  try {
    const o = localStorage.getItem(t);
    o && o.trim() && (e = o);
  } catch {
  }
  window.__hekatanCliScript = e;
  setInterval(() => {
    try {
      const o = window.__hekatanCliLastScript;
      o && o.trim() && localStorage.setItem(t, o);
    } catch {
    }
  }, 4e3);
  const i = {
    ...r,
    id: "nuevo",
    name: "Modelo nuevo",
    category: "\u{1F4D0} Nuevo",
    params: {}
  };
  a(i);
});
