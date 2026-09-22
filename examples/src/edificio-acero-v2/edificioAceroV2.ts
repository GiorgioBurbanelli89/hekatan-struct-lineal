/**
 * Edificio Acero (v2) — Pórtico de acero W puro (OMF/IMF/SMF).
 *
 * Columnas y vigas de acero perfil W (AISC Steel Construction Manual, 16th Ed).
 * Losa metal-deck + concreto colaborante (12 cm total, composite).
 * Sin muros de corte ni diagonales.
 *
 * Códigos aplicables:
 *   - AISC 360-22   (Specification for Structural Steel Buildings)
 *   - AISC 341-22   (Seismic Provisions for Structural Steel Buildings)
 *                   OMF (R=3.5), IMF (R=4.5), SMF (R=8)
 *   - ASCE/SEI 7-22, Table 12.2-1  (Moment-resisting frame systems in steel)
 *   - AISC Steel Construction Manual, 16th Ed (perfiles W, HSS, HSS round)
 *   - NEC-SE-AC (Ecuador)  (equivalente local)
 *
 * Caso típico: oficinas, estacionamientos, comerciales ligeros de 3-10 pisos.
 */
import { edificioAporticado } from "../edificio-aporticado/edificioAporticado";
import type { ExampleDef } from "../workspace/exampleRegistry";

const base = edificioAporticado.params;
const params = { ...base };

params.matCol     = { ...base.matCol,     default: 1 };  // Acero W
params.matViga    = { ...base.matViga,    default: 1 };  // Acero W
params.slabOn     = { ...base.slabOn,     default: 1 };  // metal-deck
params.bracesMode = { ...base.bracesMode, default: 0 };
params.slabT      = { ...base.slabT,      default: 0.12 };  // 5-cm deck + 7-cm losa

export const edificioAceroV2: ExampleDef = {
  id: "edificio-acero-v2",
  name: "Edificio Acero (W profiles)",
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
