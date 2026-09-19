/**
 * Edificio con muros — variante de `edificio-aporticado` con otros parámetros por defecto.
 *
 * Vivía dentro de `shared/moreExamples.ts`, un fichero que NO importaba nadie: los 21
 * ejemplos que había ahí eran código muerto y `?t=edif-muros` no cargaba nada. Cada ejemplo
 * va en SU carpeta, como el resto del repo (18-sep-2026).
 */
import type { ExampleDef } from "../workspace/exampleRegistry";
import { edificioAporticado } from "../edificio-aporticado/edificioAporticado";
import { clonarParamsCon } from "../shared/simpleExampleTemplates";

/** Edificio con muros de corte (aproximados como diagonales por ahora) */
export const edifMuros: ExampleDef = {
  ...edificioAporticado,
  id: "edif-muros",
  category: "4️⃣ Mixtos · 🏢 Edificios",
  name: "Edificio con Muros (diagonales equivalentes)",
  params: clonarParamsCon(edificioAporticado.params, {
    matCol: 0, matViga: 0, slabOn: 1, slabT: 0.15,
    bracesMode: 1,  // perimetrales como sustituto visual de muros
    Ex: 100, Ey: 100,
  }),
};
