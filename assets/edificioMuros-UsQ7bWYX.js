import { e as i, __tla as __tla_0 } from "./edificioAporticado-d7zmLwjD.js";
let n;
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
  n = {
    id: "edificio-muros",
    name: "Edificio con Muros de Corte (Hormig\xF3n)",
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
    params: e,
    build: i.build,
    runModal: i.runModal,
    computedLabels: i.computedLabels,
    dynamicParams: i.dynamicParams
  };
});
export {
  __tla,
  n as e
};
