import { e as o, __tla as __tla_0 } from "./edificioAporticado-CmTpJQnt.js";
let i;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  const e = o.params, a = {
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
  i = {
    id: "edificio-con-muros",
    name: "Edificio con Muros de corte",
    category: "4\uFE0F\u20E3 Mixtos \xB7 \u{1F3E2} Edificios",
    defaultShellResult: "membraneYY",
    availableShellResults: [
      "bendingXX",
      "bendingYY",
      "bendingXY",
      "membraneXX",
      "membraneYY",
      "membranePrincipalMin",
      "membranePrincipalMax",
      "displacementZ",
      "vonMises"
    ],
    hasModal: true,
    params: a,
    build: o.build,
    runModal: o.runModal,
    computedLabels: o.computedLabels
  };
});
export {
  __tla,
  i as e
};
