import { e as a, __tla as __tla_0 } from "./edificioAporticado-BT5XCqNq.js";
import { c as o, __tla as __tla_1 } from "./simpleExampleTemplates-rH8lVN9H.js";
let r;
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
  r = {
    ...a,
    id: "edif-muros",
    category: "4\uFE0F\u20E3 Mixtos \xB7 \u{1F3E2} Edificios",
    name: "Edificio con Muros (diagonales equivalentes)",
    params: o(a.params, {
      matCol: 0,
      matViga: 0,
      slabOn: 1,
      slabT: 0.15,
      bracesMode: 1,
      Ex: 100,
      Ey: 100
    })
  };
});
export {
  __tla,
  r as e
};
