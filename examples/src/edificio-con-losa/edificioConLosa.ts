/**
 * Edificio con Losa (sin muros ni diagonales).
 *
 * Variante de edificio-aporticado con:
 *   - slabOn = ON (losa Q4 en cada piso)
 *   - bracesMode = 0 (sin diagonales)
 *   - Sin muros de corte
 *
 * Representa un edificio aporticado clásico con losas macizas funcionando
 * como diafragma (flexible por ahora — ver roadmap de diafragma rígido).
 * Típico residencial NEC-SE-HM.
 */
import { edificioAporticado } from "../edificio-aporticado/edificioAporticado";
import type { ExampleDef } from "../workspace/exampleRegistry";

// Clona params base pero con slabOn=1 por default y sin diagonales.
// Mantiene TODOS los demás params (geometría, luces, alturas, secciones, cargas).
const baseParams = edificioAporticado.params;
const params = { ...baseParams };

// Override defaults críticos
params.slabOn   = { ...baseParams.slabOn,   default: 1 };     // losa ON
params.bracesMode = { ...baseParams.bracesMode, default: 0 };  // sin diagonales
// Espesor losa 15 cm (típico NEC)
params.slabT    = { ...baseParams.slabT,    default: 0.15 };

export const edificioConLosa: ExampleDef = {
  id: "edificio-con-losa",
  name: "Edificio con Losa (sin muros)",
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
  build: edificioAporticado.build,        // reutilizar lógica existente
  runModal: edificioAporticado.runModal,
  computedLabels: edificioAporticado.computedLabels,  // hereda reacciones → zapata
};
