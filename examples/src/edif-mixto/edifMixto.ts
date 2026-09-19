/**
 * Edificio mixto — variante de `edificio-aporticado` con otros parámetros por defecto.
 *
 * Vivía dentro de `shared/moreExamples.ts`, un fichero que NO importaba nadie: los 21
 * ejemplos que había ahí eran código muerto y `?t=edif-mixto` no cargaba nada. Cada ejemplo
 * va en SU carpeta, como el resto del repo (18-sep-2026).
 */
import type { ExampleDef } from "../workspace/exampleRegistry";
import { edificioAporticado } from "../edificio-aporticado/edificioAporticado";
import { clonarParamsCon } from "../shared/simpleExampleTemplates";

/** Edificio mixto (hormigón + acero vigas) */
export const edifMixto: ExampleDef = {
  ...edificioAporticado,
  id: "edif-mixto",
  category: "4️⃣ Mixtos · 🏢 Edificios",
  name: "Edificio Mixto (cols hormigón + vigas acero)",
  params: clonarParamsCon(edificioAporticado.params, {
    matCol: 0, matViga: 1, colSize: 0.45, vigaB: 0.20, vigaH: 0.50,
    vSecOn: 1, slabOn: 1, slabT: 0.12,
  }),
};
