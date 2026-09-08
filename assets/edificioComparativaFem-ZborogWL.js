import { e as s, __tla as __tla_0 } from "./edificioAporticado-DxlMXcDB.js";
let r;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  const a = s.params, e = {
    ...a
  };
  e.nVanosX = {
    ...a.nVanosX,
    default: 3
  };
  e.nVanosY = {
    ...a.nVanosY,
    default: 3
  };
  e.nPisos = {
    ...a.nPisos,
    default: 3
  };
  e.spanX = {
    ...a.spanX,
    default: 5
  };
  e.spanY = {
    ...a.spanY,
    default: 5
  };
  e.hPiso = {
    ...a.hPiso,
    default: 3
  };
  e.fcConcr = {
    ...a.fcConcr,
    default: 210
  };
  e.colSize = {
    ...a.colSize,
    default: 0.4
  };
  e.vigaB = {
    ...a.vigaB,
    default: 0.3
  };
  e.vigaH = {
    ...a.vigaH,
    default: 0.4
  };
  e.matCol = {
    ...a.matCol,
    default: 0
  };
  e.matViga = {
    ...a.matViga,
    default: 0
  };
  e.slabT = {
    ...a.slabT,
    default: 0.15
  };
  e.slabOn = {
    ...a.slabOn,
    default: 0
  };
  r = {
    id: "edificio-comparativa-fem",
    name: "Edificio \xB7 Comparativa FEM cruzada",
    category: "1\uFE0F\u20E3 Frames \xB7 \u{1F3AF} n GDL Sistemas",
    benchmark: true,
    defaultShellResult: "vonMises",
    availableShellResults: [
      "vonMises",
      "bendingXX",
      "bendingYY",
      "displacementZ"
    ],
    hasModal: true,
    params: e,
    build: s.build,
    runModal: s.runModal,
    computedLabels: (n, i) => {
      var _a, _b;
      return {
        ...((_b = (_a = s).computedLabels) == null ? void 0 : _b.call(_a, n, i)) ?? {},
        "\u2500\u2500 \u{1F9EA} TEST \xB7 Comparaci\xF3n 5 solvers \xB7 5 configuraciones \u2500\u2500": "",
        "\u{1F4D0} Modelo": "4\xD74 cols \xD7 3 pisos \xB7 Vanos 5m \xB7 h=3m \xB7 f'c=210",
        "\u2500\u2500 A. FRAME PURO \u2500\u2500": "",
        "A \xB7 Hekatan T\u2081": "0.3496 s",
        "A \xB7 OpenSeesPy T\u2081": "0.3383 s \xB7 \u0394 \u22123.2%",
        "A \xB7 OpenSees TCL T\u2081": "0.3383 s (idem solver)",
        "A \xB7 ETABS 22 T\u2081": "\u2248 0.34 s",
        "A \xB7 CalculiX T\u2081": "TBD (.inp generado)",
        "A \xB7 Code Aster T\u2081": "TBD (.comm generado)",
        "\u2500\u2500 B. + LOSA Membrane \u2500\u2500": "",
        "B \xB7 OpenSeesPy ShellMITC4 T\u2081": "0.2909 s (full shell, +bending)",
        "B \xB7 ETABS Membrane Slab T\u2081": "0.6718 s (referencia)",
        "B \xB7 ETABS ShellThin SemiR T\u2081": "0.6179 s",
        "B \xB7 ETABS ShellThin Rigid T\u2081": "0.6178 s",
        "B \xB7 Hekatan Memb sin cracked": "0.5044 s \xB7 -25% (m\xE1s r\xEDgido)",
        "B \xB7 Hekatan Memb + Cracked": "0.7329 s \xB7 +9.1% \u2705 (ETABS-like)",
        "B \xB7 \u2713 Receta Hekatan=ETABS": "slabType=Membrane + cracked=On",
        "\u2500\u2500 C. + LOSA + 2 MUROS perimet. \u2500\u2500": "",
        "C \xB7 OpenSeesPy T\u2081": "0.1731 s \xB7 T\u2082=0.050 (muros rigidizan Y)",
        "C \xB7 ETABS 2 muros P1/P2": "0.4134 s / T\u2082=0.1861",
        "C \xB7 Hekatan T\u2081": "TBD (bracesMode=perimetrales)",
        "\u2500\u2500 D. + DIAGONALES fachadas \u2500\u2500": "",
        "D \xB7 OpenSeesPy T\u2081": "0.3447 s \xB7 T\u2082=0.240 (X-bracing)",
        "D \xB7 ETABS X-bracing": "TBD",
        "D \xB7 Hekatan T\u2081": "TBD (bracesMode=todas)",
        "\u2500\u2500 E. MIXTO (losa+muros+diag) \u2500\u2500": "",
        "E \xB7 OpenSeesPy T\u2081": "0.1740 s \xB7 T\u2082=0.049",
        "E \xB7 ETABS Mixto": "TBD",
        "E \xB7 Hekatan Mixto T\u2081": "TBD",
        "\u2500\u2500 DICTAMEN \u2500\u2500": "",
        "\u2713 Frame puro Hekatan\u2194OpenSees": "3.3% (VALIDADO)",
        "\u2713 Memb+Cracked Hekatan\u2194ETABS": "9.1% (VALIDADO)",
        "\u2713 ASCE 7-22 \xA712.9.1.1": "\u226590% \u03A3 MPF X+Y al modo 6-10",
        "\u2713 CSI Manual \xA74.12 W/g": "Bug masa corregido",
        "\u{1F4CB} Receta para coincidir ETABS": "Membrane + Cracked + Self-weight",
        "\u2192 Pr\xF3ximo": "ejecutar Hekatan con muros + diagonales"
      };
    },
    dynamicParams: s.dynamicParams
  };
});
export {
  __tla,
  r as e
};
