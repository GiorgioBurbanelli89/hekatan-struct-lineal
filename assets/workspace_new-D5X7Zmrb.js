import "./modulepreload-polyfill-B5Qt9EMX.js";
import { c as e, __tla as __tla_0 } from "./cliModeler-BxlZQmwi.js";
import { r as a, __tla as __tla_1 } from "./runExampleStandalone-CmvQS5V0.js";
import "./cadSections-DVtTZU6U.js";
import { __tla as __tla_2 } from "./h8-CxkkFRzA.js";
import { __tla as __tla_3 } from "./deform-CK_Uh0DH.js";
import "./preload-helper-V2P8TQsQ.js";
import "./analyze-DgLgRmKg.js";
import "./pureFunctionsAny.generated-DeJSBP3k.js";
import { __tla as __tla_4 } from "./didacticCpp-CnEP9H1T.js";
import "./theme-DQ--CgsI.js";
import "./tweakpane-BXg6ZhiP.js";
import "./getViewer-DoAG4kNs.js";
import "./Text-ERv22veQ.js";
import "./styles-0iLl92Fx.js";
import "./renderModalTable-BJWFR1R0.js";
import "./units-D6XsaEPz.js";
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
  const t = "hekatan.nuevo.borrador", i = [
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
  let r = i;
  try {
    const o = localStorage.getItem(t);
    o && o.trim() && (r = o);
  } catch {
  }
  window.__hekatanCliScript = r;
  setInterval(() => {
    try {
      const o = window.__hekatanCliLastScript;
      o && o.trim() && localStorage.setItem(t, o);
    } catch {
    }
  }, 4e3);
  const n = {
    ...e,
    id: "nuevo",
    name: "Modelo nuevo",
    category: "\u{1F4D0} Nuevo",
    params: {}
  };
  a(n);
});
