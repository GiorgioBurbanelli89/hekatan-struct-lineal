import { e as a, __tla as __tla_0 } from "./edificioAporticado-DVslVtEE.js";
let s;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  let c, r;
  c = {
    matCol: 1,
    matViga: 1,
    colSize: 0.3,
    vigaB: 0.2,
    vigaH: 0.45,
    vSecOn: 1,
    nVSec: 2,
    vSecDir: 2,
    slabOn: 1,
    slabT: 0.08
  };
  r = () => {
    const e = {};
    for (const [o, i] of Object.entries(a.params)) e[o] = {
      ...i,
      default: c[o] ?? i.default
    };
    return e;
  };
  s = {
    ...a,
    id: "edif-acero",
    name: "Edificio de Acero (W + deck)",
    category: "4\uFE0F\u20E3 Mixtos \xB7 \u{1F3E2} Edificios",
    params: r()
  };
});
export {
  __tla,
  s as e
};
