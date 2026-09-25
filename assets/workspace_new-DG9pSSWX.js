import "./modulepreload-polyfill-B5Qt9EMX.js";
import { c as r, __tla as __tla_0 } from "./cliModeler-BLcd8BKm.js";
import { r as a, __tla as __tla_1 } from "./runExampleStandalone-CcX0Klym.js";
import "./cadSections-BcRFaG1j.js";
import "./materials-VwssM8Vw.js";
import "./cargasPorCaso-B_GZ_-rO.js";
import { __tla as __tla_2 } from "./h8-NvnnhbYJ.js";
import { __tla as __tla_3 } from "./didacticCpp-BoYi16rL.js";
import { __tla as __tla_4 } from "./analyze-B8I5UoWo.js";
import { __tla as __tla_5 } from "./aiAgent-BAR3xtkA.js";
import "./Text-C1TX4d8g.js";
import "./tweakpane-BXg6ZhiP.js";
import "./pureFunctionsAny.generated-DeJSBP3k.js";
import "./concreteBeamDesignPanel-DrkCnll_.js";
import "./modeScale-sgWZ-KrB.js";
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
