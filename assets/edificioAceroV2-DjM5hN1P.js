import { e as i, __tla as __tla_0 } from "./edificioAporticado-B0NwIQWa.js";
let r;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  const e = i.params, a = {
    ...e
  };
  a.matCol = {
    ...e.matCol,
    default: 1
  };
  a.matViga = {
    ...e.matViga,
    default: 1
  };
  a.slabOn = {
    ...e.slabOn,
    default: 1
  };
  a.bracesMode = {
    ...e.bracesMode,
    default: 0
  };
  a.slabT = {
    ...e.slabT,
    default: 0.12
  };
  r = {
    id: "edificio-acero-v2",
    name: "Edificio Acero (W profiles)",
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
    params: a,
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
