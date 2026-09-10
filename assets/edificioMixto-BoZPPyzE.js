import { e as i, __tla as __tla_0 } from "./edificioAporticado-PFEWHw-9.js";
let l;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  const a = i.params, e = {
    ...a
  };
  e.matCol = {
    ...a.matCol,
    default: 0
  };
  e.matViga = {
    ...a.matViga,
    default: 1
  };
  e.colShape = {
    ...a.colShape,
    default: 0
  };
  e.slabOn = {
    ...a.slabOn,
    default: 1
  };
  e.bracesMode = {
    ...a.bracesMode,
    default: 0
  };
  e.slabT = {
    ...a.slabT,
    default: 0.12
  };
  e.fcConcr = {
    ...a.fcConcr,
    default: 280
  };
  l = {
    id: "edificio-mixto",
    name: "Edificio Mixto (Col Hormig\xF3n + Viga Acero)",
    category: "4\uFE0F\u20E3 Mixtos \xB7 \u{1F3E2} Edificios",
    defaultShellResult: "bendingXX",
    availableShellResults: [
      "bendingXX",
      "bendingYY",
      "displacementZ",
      "vonMises"
    ],
    hasModal: true,
    params: e,
    build: i.build,
    runModal: i.runModal,
    computedLabels: i.computedLabels,
    dynamicParams: i.dynamicParams
  };
});
export {
  __tla,
  l as e
};
