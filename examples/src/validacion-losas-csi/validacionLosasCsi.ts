/**
 * VALIDACIÓN CSI · losas (22-sep-2026). Categoría «2️⃣ Shells · ✅ Validación CSI».
 *
 * Losas macizas en L, en T, con hueco, con ductos (uno circular) y de lados oblicuos. La malla es la
 * que generó ETABS 22 solo (Auto Mesh de fábrica, 1.25 m: cuadriláteros + triángulos) con Shell-Thin.
 * Sobre ESA malla Hekatan (DKQ + DKT) da lo mismo que ETABS, SAP2000, OpenSees y un solver numpy
 * independiente: 0.000 % nudo a nudo (`node tests/run.mjs dkt-triangulo`, 29/29).
 *
 * t = 0.20 m, E = 25e6 kN/m², ν = 0.2, q = −10 kN/m², apoyos donde los puso ETABS. kN, m.
 * Scripts, .e2k/.s2k/.tcl y README: `validation/losas_irregulares/`.
 */
import type { ExampleDef } from "../workspace/exampleRegistry";
import { cliModeler } from "../cli-modeler/cliModeler";
import { MODELOS } from "./modelos";

const CASOS = ["losa_L_hueco", "L_sin_hueco", "rect_con_hueco", "losa_T", "losa_ductos", "pentagono", "trapecio_hueco_girado"];

export const validacionLosasCsi: ExampleDef = {
  id: "validacion-losas-csi",
  name: "Losas irregulares (malla ETABS) vs ETABS · SAP2000 · OpenSees",
  category: "2️⃣ Shells · ✅ Validación CSI",
  defaultShellResult: "displacementZ",
  availableShellResults: ["none", "displacementZ", "bendingXX", "bendingYY", "bendingXY"],
  params: {
    caso: {
      default: 4, label: "Losa",
      options: {
        "L con hueco": 0, "L": 1, "Rectángulo con hueco": 2, "T": 3,
        "Con 3 ductos (uno circular)": 4, "Pentágono (lados oblicuos)": 5, "Trapecio con hueco girado": 6,
      },
    },
  },
  build(p, states, modalPanel) {
    const w = window as any;
    const antes = w.__hekatanCliScript;             // no pisar el script del CLI Modeler
    w.__hekatanCliScript = MODELOS[CASOS[Math.round(p.caso ?? 4)] ?? "losa_ductos"];
    try { cliModeler.build(p, states, modalPanel); }
    finally { w.__hekatanCliScript = antes; }
  },
};
