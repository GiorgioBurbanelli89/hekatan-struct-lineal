import { e as o, __tla as __tla_0 } from "./edificioAporticado-B0SiAtGJ.js";
let i;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  const a = o.params, e = {
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
  e.slabOn = {
    ...a.slabOn,
    default: 1
  };
  e.bracesMode = {
    ...a.bracesMode,
    default: 0
  };
  e.murosMode = {
    ...a.murosMode,
    default: 3
  };
  e.tMuro = {
    ...a.tMuro,
    default: 0.25
  };
  e.slabT = {
    ...a.slabT,
    default: 0.15
  };
  e.fcConcr = {
    ...a.fcConcr,
    default: 280
  };
  e.nPisos = {
    ...a.nPisos,
    default: 6
  };
  e.diafragmaRigido = {
    ...a.diafragmaRigido,
    default: 1
  };
  i = {
    id: "edificio-muros",
    name: "Edificio con Muros de Corte (Hormig\xF3n)",
    category: "4\uFE0F\u20E3 Mixtos \xB7 \u{1F3E2} Edificios",
    defaultShellResult: "membraneYY",
    availableShellResults: [
      "membraneXX",
      "membraneYY",
      "membraneXY",
      "bendingXX",
      "bendingYY",
      "displacementZ",
      "vonMises"
    ],
    hasModal: true,
    params: e,
    build: o.build,
    runModal: o.runModal,
    computedLabels: o.computedLabels,
    dynamicParams: o.dynamicParams
  };
});
export {
  __tla,
  i as e
};
