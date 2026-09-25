import { e as i, __tla as __tla_0 } from "./edificioAporticado-ckoXsHB1.js";
import { c as o, __tla as __tla_1 } from "./simpleExampleTemplates-DQEnfnkD.js";
let s;
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
  s = {
    ...i,
    id: "edif-mixto",
    category: "4\uFE0F\u20E3 Mixtos \xB7 \u{1F3E2} Edificios",
    name: "Edificio Mixto (cols hormig\xF3n + vigas acero)",
    params: o(i.params, {
      matCol: 0,
      matViga: 1,
      colSize: 0.45,
      vigaB: 0.2,
      vigaH: 0.5,
      vSecOn: 1,
      slabOn: 1,
      slabT: 0.12
    })
  };
});
export {
  __tla,
  s as e
};
