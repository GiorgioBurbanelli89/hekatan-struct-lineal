/**
 * Edificio con Muros de corte (shear walls).
 *
 * Variante de edificio-aporticado con:
 *   - slabOn = ON (losa Q4 por piso)
 *   - bracesMode = 1 (muros perimetrales como arriostramiento)
 *     NOTA: actualmente se modelan como diagonales 1D en el perímetro.
 *     Una versión con Muros Q4 (shell membrana vertical) requiere extender
 *     el build() de edificioAporticado con elementos shell vertical.
 *
 * Representa edificio dual — pórtico + muros de corte.
 * Típico en edificios altos (≥6 pisos) NEC-SE-DS.
 */
import { edificioAporticado } from "../edificio-aporticado/edificioAporticado";
import type { ExampleDef } from "../workspace/exampleRegistry";

const baseParams = edificioAporticado.params;
const params = { ...baseParams };

// Defaults edificio dual
params.slabOn     = { ...baseParams.slabOn,     default: 1 };      // losa ON
params.bracesMode = { ...baseParams.bracesMode, default: 1 };      // perimetrales (proxy de muros)
params.slabT      = { ...baseParams.slabT,      default: 0.15 };
// Edificio dual es más rígido — puede tener más pisos por default
params.nPisos     = { ...baseParams.nPisos,     default: 6 };

export const edificioConMuros: ExampleDef = {
  id: "edificio-con-muros",
  name: "Edificio con Muros de corte",
  category: "Edificios",
  // vonMises por defecto: el MURO de corte muestra su esfuerzo de membrana
  // (con bendingXX salía azul porque el muro no tiene flexión de placa).
  defaultShellResult: "vonMises",
  availableShellResults: ["vonMises", "membraneXX", "membraneYY", "membraneXY", "bendingXX", "bendingYY", "bendingXY", "displacementZ"],
  hasModal: true,
  params,
  build: edificioAporticado.build,
  runModal: edificioAporticado.runModal,
  computedLabels: edificioAporticado.computedLabels,  // reacciones → zapata
};
