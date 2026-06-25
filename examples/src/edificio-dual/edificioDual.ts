/**
 * Edificio Dual — Mixto + Muros de Corte + Diagonales (Dual System).
 *
 * Sistema estructural dual sofisticado para edificios altos:
 *   - Columnas: Hormigón (rigidez gravitacional + lateral)
 *   - Vigas: Acero W composite (luces grandes)
 *   - Muros de corte hormigón (resistencia lateral primaria)
 *   - Diagonales de acero en TODOS los vanos (rigidez lateral redundante)
 *
 * Códigos aplicables (sistema dual):
 *   - ASCE/SEI 7-22, Table 12.2-1, categoría "Dual Systems":
 *       • Special RC shear walls + Special moment frames  R=7, Ωo=2.5, Cd=5.5
 *       • Special RC shear walls + Intermediate moment    R=6.5
 *   - ASCE/SEI 7-22 §12.2.5.4  (Moment frames capaces de 25% de V base)
 *   - ACI 318-22, Chapter 18   (detallado sísmico muros + pórticos)
 *   - AISC 341-22 / 360-22     (diagonales y componentes acero)
 *   - NEC-SE-DS sismo  (sistema dual art. 4.2)
 *
 * Redundancia del sistema (ASCE 7-22 §12.3.4):
 *   Si muros fallan → diagonales toman la carga.
 *   Si diagonales pandean → muros y pórticos resisten.
 *   ρ = 1.0 (no penalty factor) por ser dual redundante.
 *
 * Caso típico: edificios altos (15+ pisos) en SDC D–F con alta sismicidad.
 */
import { edificioAporticado } from "../edificio-aporticado/edificioAporticado";
import type { ExampleDef } from "../workspace/exampleRegistry";

const base = edificioAporticado.params;
const params = { ...base };

params.matCol     = { ...base.matCol,     default: 0 };  // Hormigón
params.matViga    = { ...base.matViga,    default: 1 };  // Acero W
params.colShape   = { ...base.colShape,   default: 0 };
params.slabOn     = { ...base.slabOn,     default: 1 };
params.bracesMode = { ...base.bracesMode, default: 2 };  // todas las diagonales
params.slabT      = { ...base.slabT,      default: 0.12 };
params.fcConcr    = { ...base.fcConcr,    default: 280 };
params.nPisos     = { ...base.nPisos,     default: 10 };

export const edificioDual: ExampleDef = {
  id: "edificio-dual",
  name: "Edificio Dual (Mixto + Muros + Diagonales)",
  category: "Edificios",
  // vonMises por defecto: el MURO de corte muestra su esfuerzo de membrana
  // (con bendingXX salía azul porque el muro no tiene flexión de placa).
  defaultShellResult: "vonMises",
  availableShellResults: ["vonMises", "membraneXX", "membraneYY", "membraneXY", "bendingXX", "bendingYY", "bendingXY", "displacementZ"],
  hasModal: true,
  params,
  build: edificioAporticado.build,
  runModal: edificioAporticado.runModal,
  computedLabels: edificioAporticado.computedLabels,
  dynamicParams: edificioAporticado.dynamicParams,
};
