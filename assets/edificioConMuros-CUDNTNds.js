import { e as n, __tla as __tla_0 } from "./edificioAporticado-CVfnSDUM.js";
let s;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  const e = n.params, a = {
    ...e
  };
  a.slabOn = {
    ...e.slabOn,
    default: 1
  };
  a.bracesMode = {
    ...e.bracesMode,
    default: 0
  };
  a.murosMode = {
    ...e.murosMode,
    default: 3
  };
  a.tMuro = {
    ...e.tMuro,
    default: 0.25
  };
  a.slabT = {
    ...e.slabT,
    default: 0.15
  };
  a.nPisos = {
    ...e.nPisos,
    default: 6
  };
  s = {
    id: "edificio-con-muros",
    name: "Edificio con Muros de corte",
    category: "4\uFE0F\u20E3 Mixtos \xB7 \u{1F3E2} Edificios",
    defaultShellResult: "membraneYY",
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
    build: n.build,
    runModal: n.runModal,
    computedLabels: n.computedLabels
  };
});
export {
  __tla,
  s as e
};
