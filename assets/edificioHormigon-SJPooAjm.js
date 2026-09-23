import { e as i, __tla as __tla_0 } from "./edificioAporticado-Bw0jTPTc.js";
let r;
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
    default: 0
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
    default: 0.15
  };
  e.fcConcr = {
    ...a.fcConcr,
    default: 240
  };
  r = {
    id: "edificio-hormigon",
    name: "Edificio Hormig\xF3n (puro)",
    category: "4\uFE0F\u20E3 Mixtos \xB7 \u{1F3E2} Edificios",
    defaultShellResult: "bendingXX",
    availableShellResults: [
      "none",
      "pressure",
      "membraneXX",
      "membraneYY",
      "membraneXY",
      "membranePrincipalMax",
      "membranePrincipalMin",
      "vonMises",
      "tranverseShearX",
      "tranverseShearY",
      "transverseShearMax",
      "bendingXX",
      "bendingYY",
      "bendingXY",
      "bendingPrincipalMax",
      "bendingPrincipalMin",
      "displacementX",
      "displacementY",
      "displacementZ"
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
  r as e
};
