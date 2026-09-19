import { e as a, __tla as __tla_0 } from "./edificioAporticado-B0SiAtGJ.js";
import { c as i, __tla as __tla_1 } from "./simpleExampleTemplates-tRnQz-nV.js";
let c;
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
  })()
]).then(async () => {
  c = {
    ...a,
    id: "edif-acero-diag",
    category: "4\uFE0F\u20E3 Mixtos \xB7 \u{1F3E2} Edificios",
    name: "Edificio Acero + Diagonales",
    params: i(a.params, {
      matCol: 1,
      matViga: 1,
      colSize: 0.3,
      vigaB: 0.2,
      vigaH: 0.45,
      vSecOn: 1,
      nVSec: 2,
      slabOn: 1,
      slabT: 0.08,
      bracesMode: 1
    })
  };
});
export {
  __tla,
  c as e
};
