/**
 * Edificio acero + diagonales — variante de `edificio-aporticado` con otros parámetros por defecto.
 *
 * Vivía dentro de `shared/moreExamples.ts`, un fichero que NO importaba nadie: los 21
 * ejemplos que había ahí eran código muerto y `?t=edif-acero-diag` no cargaba nada. Cada ejemplo
 * va en SU carpeta, como el resto del repo (18-sep-2026).
 */
import type { ExampleDef } from "../workspace/exampleRegistry";
import { edificioAporticado } from "../edificio-aporticado/edificioAporticado";
import { clonarParamsCon } from "../shared/simpleExampleTemplates";

/** Edificio acero con diagonales */
export const edifAceroDiag: ExampleDef = {
  ...edificioAporticado,
  id: "edif-acero-diag",
  category: "4️⃣ Mixtos · 🏢 Edificios",
  name: "Edificio Acero + Diagonales",
  params: clonarParamsCon(edificioAporticado.params, {
    matCol: 1, matViga: 1, colSize: 0.30, vigaB: 0.20, vigaH: 0.45,
    vSecOn: 1, nVSec: 2, slabOn: 1, slabT: 0.08,
    bracesMode: 1,  // perimetrales
  }),
};
