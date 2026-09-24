/**
 * Edificio Hormigón — Pórtico de hormigón armado puro (IMF/SMF).
 *
 * Variante limpia del edificio-aporticado configurada para SOLO HORMIGÓN:
 *   - matCol = 0 (Hormigón), matViga = 0 (Hormigón)
 *   - colShape = 0 (Rectangular)
 *   - slabOn = 1 (losa hormigón 15 cm, discretizada ETABS-style)
 *   - bracesMode = 0 (sin diagonales), sin muros de corte
 *
 * Códigos aplicables:
 *   - ACI 318-22, Chapter 18  (Earthquake-Resistant Structures: IMF/SMF detailing)
 *   - ASCE/SEI 7-22, Table 12.2-1  (R=5 IMF, R=8 SMF for concrete moment frames)
 *   - ASCE/SEI 7-22, Chapter 12    (Seismic Design Requirements for Building Structures)
 *   - NEC-SE-HM (Ecuador) / NEC-SE-DS sismo  (equivalentes locales)
 *
 * Caso típico: edificios residenciales y oficinas pequeñas de 3–6 pisos,
 * zonas de sismicidad moderada a alta (SDC C–D).
 */
import { edificioAporticado } from "../edificio-aporticado/edificioAporticado";
import type { ExampleDef } from "../workspace/exampleRegistry";

const base = edificioAporticado.params;
const params = { ...base };

// Forzar hormigón + losa + sin diagonales
params.matCol     = { ...base.matCol,     default: 0 };
params.matViga    = { ...base.matViga,    default: 0 };
params.colShape   = { ...base.colShape,   default: 0 };
params.slabOn     = { ...base.slabOn,     default: 1 };
params.bracesMode = { ...base.bracesMode, default: 0 };
params.slabT      = { ...base.slabT,      default: 0.15 };
params.fcConcr    = { ...base.fcConcr,    default: 240 };

export const edificioHormigon: ExampleDef = {
  id: "edificio-hormigon",
  name: "Edificio Hormigón (puro)",
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
