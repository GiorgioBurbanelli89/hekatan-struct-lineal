/**
 * Edificio Mixto — Columnas Hormigón + Vigas Acero W (Composite).
 *
 * Sistema estructural mixto compuesto muy popular en edificios altos:
 * columnas de hormigón (rigidez gravitacional y lateral) + vigas de acero W
 * con shear studs (luces mayores, peso menor). Losa colaborante 12 cm.
 *
 * Códigos aplicables:
 *   - AISC 360-22, Chapter I   (Design of Composite Members)
 *   - AISC 341-22, Chapter G   (Composite Intermediate Moment Frames, IMF)
 *   - ACI 318-22, Chapter 18    (Concrete column seismic detailing)
 *   - ASCE/SEI 7-22, Table 12.2-1  (Composite systems, R=5–8 según detailing)
 *   - NEC-SE-HM + NEC-SE-AC (Ecuador)
 *
 * Caso típico: edificios de 8-20 pisos con grandes luces arquitectónicas.
 */
import { edificioAporticado } from "../edificio-aporticado/edificioAporticado";
import type { ExampleDef } from "../workspace/exampleRegistry";

const base = edificioAporticado.params;
const params = { ...base };

params.matCol     = { ...base.matCol,     default: 0 };  // Hormigón
params.matViga    = { ...base.matViga,    default: 1 };  // Acero W
params.colShape   = { ...base.colShape,   default: 0 };  // Col Rectangular
params.slabOn     = { ...base.slabOn,     default: 1 };
params.bracesMode = { ...base.bracesMode, default: 0 };
params.slabT      = { ...base.slabT,      default: 0.12 };
params.fcConcr    = { ...base.fcConcr,    default: 280 };  // f'c típico composite

export const edificioMixto: ExampleDef = {
  id: "edificio-mixto",
  name: "Edificio Mixto (Col Hormigón + Viga Acero)",
  category: "4️⃣ Mixtos · 🏢 Edificios",
  defaultShellResult: "bendingXX",
  availableShellResults: [
    "none", "pressure",
    "membraneXX", "membraneYY", "membraneXY",
    "membranePrincipalMax", "membranePrincipalMin", "vonMises",
    "tranverseShearX", "tranverseShearY", "transverseShearMax",
    "bendingXX", "bendingYY", "bendingXY",
    "bendingPrincipalMax", "bendingPrincipalMin",
    "displacementX", "displacementY", "displacementZ",
  ],
  hasModal: true,
  params,
  build: edificioAporticado.build,
  runModal: edificioAporticado.runModal,
  computedLabels: edificioAporticado.computedLabels,
  dynamicParams: edificioAporticado.dynamicParams,
};
