import { e as l, __tla as __tla_0 } from "./edificioAporticado-CmTpJQnt.js";
let i;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  const a = l.params, e = {
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
    default: 2
  };
  e.slabT = {
    ...a.slabT,
    default: 0.12
  };
  e.fcConcr = {
    ...a.fcConcr,
    default: 280
  };
  e.nPisos = {
    ...a.nPisos,
    default: 10
  };
  e.murosMode = {
    ...a.murosMode,
    default: 3
  };
  e.tMuro = {
    ...a.tMuro,
    default: 0.25
  };
  i = {
    id: "edificio-dual",
    name: "Edificio Dual (Mixto + Muros + Diagonales)",
    category: "4\uFE0F\u20E3 Mixtos \xB7 \u{1F3E2} Edificios",
    defaultShellResult: "membraneYY",
    availableShellResults: [
      "bendingXX",
      "bendingYY",
      "membraneXX",
      "membraneYY",
      "membranePrincipalMin",
      "membranePrincipalMax",
      "displacementZ",
      "vonMises"
    ],
    hasModal: true,
    params: e,
    build: l.build,
    runModal: l.runModal,
    computedLabels: l.computedLabels,
    dynamicParams: l.dynamicParams
  };
});
export {
  __tla,
  i as e
};
