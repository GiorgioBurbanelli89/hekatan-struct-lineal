/**
 * Edificio Muros — Hormigón + Muros de Corte perimetrales (Shear Walls).
 *
 * Sistema de muros de corte actuando como elementos principales de resistencia
 * lateral. En este ejemplo los muros perimetrales se modelan como diagonales
 * rígidas (bracesMode=1 proxy); en implementación completa serían shell Q4
 * con discretización ETABS 25 cm. Pórticos + muros comparten cargas laterales.
 *
 * Códigos aplicables:
 *   - ACI 318-22, Chapter 18.10   (Special Structural Walls, SSW)
 *   - ACI 318-22, Chapter 11       (Wall design for in-plane and out-of-plane)
 *   - ASCE/SEI 7-22, Table 12.2-1  (Building Frame Systems w/ Special RC Shear Walls, R=6)
 *                                   (Bearing Wall Systems w/ Ordinary RC Shear Walls, R=4)
 *   - ASCE/SEI 7-22 §12.2.5.4      (Dual system requirements si se combina)
 *   - NEC-SE-DS sismo + NEC-SE-HM (Ecuador)
 *
 * Típico para edificios altos de hormigón armado (6+ pisos) donde los
 * pórticos solos no alcanzan para limitar la deriva sísmica (ASCE 7-22
 * Table 12.12-1: δ_x ≤ 0.020 h_sx para RCC ordinary occupancy).
 */
import { edificioAporticado } from "../edificio-aporticado/edificioAporticado";
import type { ExampleDef } from "../workspace/exampleRegistry";

const base = edificioAporticado.params;
const params = { ...base };

params.matCol     = { ...base.matCol,     default: 0 };  // Hormigón
params.matViga    = { ...base.matViga,    default: 0 };
params.slabOn     = { ...base.slabOn,     default: 1 };
// ⚠️ Aqui decia `bracesMode = 1` (diagonales perimetrales, "muros proxy") y NO
// tocaba `murosMode`, cuyo defecto es 0 = ninguno. O sea: el ejemplo que se
// llama "Edificio con Muros de Corte" salia con CERO muros y N diagonales.
// Es el mismo bug que CLAUDE.md da por cerrado el 2-sep-2026 para
// `edificioAporticado`, y que aqui seguia vivo. Se copia lo que hace el gemelo
// que si funciona, `edificio-con-muros/edificioConMuros.ts:22-23`.
params.bracesMode = { ...base.bracesMode, default: 0 };  // sin diagonales: los muros son de verdad
params.murosMode  = { ...base.murosMode,  default: 3 };  // muros Q4 en X e Y
params.tMuro      = { ...base.tMuro,      default: 0.25 };
params.slabT      = { ...base.slabT,      default: 0.15 };
params.fcConcr    = { ...base.fcConcr,    default: 280 };
params.nPisos     = { ...base.nPisos,     default: 6 };
params.diafragmaRigido = { ...base.diafragmaRigido, default: 1 };  // ASCE 7-22 + lumped mass

export const edificioMuros: ExampleDef = {
  id: "edificio-muros",
  name: "Edificio con Muros de Corte (Hormigón)",
  category: "4️⃣ Mixtos · 🏢 Edificios",
  // F22 (tensión vertical de membrana): el campo con el que se LEE un muro de corte. Con M11 los muros
  // salían uniformes y "sin colormap" (Jorge, 6-sep-2026).
  defaultShellResult: "membraneYY",
  // ⚠️ `membraneYY` NO estaba en esta lista, y `filterShellResultOptions` la usa
  // para PODAR el desplegable: el campo por defecto del propio ejemplo quedaba
  // fuera de sus propias opciones.
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
