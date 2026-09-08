import { e as a, __tla as __tla_0 } from "./edificioAporticado-DFoz5MTv.js";
let i;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  const e = a.params, s = {
    ...e
  };
  s.slabOn = {
    ...e.slabOn,
    default: 1
  };
  s.bracesMode = {
    ...e.bracesMode,
    default: 0
  };
  s.slabT = {
    ...e.slabT,
    default: 0.15
  };
  i = {
    id: "edificio-con-losa",
    name: "Edificio con Losa (sin muros)",
    category: "4\uFE0F\u20E3 Mixtos \xB7 \u{1F3E2} Edificios",
    defaultShellResult: "bendingXX",
    availableShellResults: [
      "bendingXX",
      "bendingYY",
      "bendingXY",
      "displacementZ",
      "vonMises"
    ],
    hasModal: true,
    params: s,
    build: a.build,
    runModal: a.runModal,
    computedLabels: a.computedLabels
  };
});
export {
  __tla,
  i as e
};
