import { e as n, __tla as __tla_0 } from "./edificioAporticado-PFEWHw-9.js";
let c;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  let i, s;
  i = {
    nVanosX: 3,
    nVanosY: 2,
    nPisos: 1,
    spanX: 6,
    spanY: 5,
    hPiso: 4.5,
    matCol: 1,
    matViga: 1,
    colSize: 0.25,
    vigaB: 0.2,
    vigaH: 0.4,
    vSecOn: 1,
    nVSec: 3,
    vSecDir: 2,
    slabOn: 1,
    slabT: 0.08,
    nSubViga: 3
  };
  s = () => {
    const a = {};
    for (const [o, e] of Object.entries(n.params)) a[o] = {
      ...e,
      default: i[o] ?? e.default
    };
    return a;
  };
  c = {
    ...n,
    id: "mezanine",
    name: "Mezanine (1 piso acero + deck)",
    category: "4\uFE0F\u20E3 Mixtos \xB7 \u{1F3E2} Edificios",
    params: s()
  };
});
export {
  __tla,
  c as m
};
