import { e, __tla as __tla_0 } from "./edificioAporticado-jC_F1Mwo.js";
let s;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  const a = e.params, n = {
    ...a
  };
  n.slabOn = {
    ...a.slabOn,
    default: 1
  };
  n.bracesMode = {
    ...a.bracesMode,
    default: 0
  };
  n.slabT = {
    ...a.slabT,
    default: 0.15
  };
  s = {
    id: "edificio-con-losa",
    name: "Edificio con Losa (sin muros)",
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
    params: n,
    build: e.build,
    runModal: e.runModal,
    computedLabels: e.computedLabels
  };
});
export {
  __tla,
  s as e
};
