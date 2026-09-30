/**
 * Ejemplos que traen su PROPIO panel de control en vez de exportar `params` + `build()`.
 *
 * Se ven en el lienzo del workspace, embebidos, sin salir de la página
 * (`mostrarEjemploEmbebido` en `workspace/main.ts`).
 *
 * El 28-sep-2026 se graduaron los 22 que eran modelos de cálculo (ver
 * `docs/GRADUAR_UN_EJEMPLO.md` y los tests `tests/casos/graduado_*.mjs`), salieron los 13
 * heredados del proyecto de origen y el duplicado `placa-cantilever-q4`. Queda uno, que no es
 * un modelo con parámetros sino una explicación paso a paso con su propia interfaz.
 */

import type { ExampleDef } from "./exampleRegistry";

/** Entrada mínima de un ejemplo con panel propio. */
function conPanelPropio(id: string, name: string, category: string, benchmark = false): ExampleDef {
  return {
    id,
    name,
    category,
    benchmark,
    standaloneUrl: `../${id}/`,
  };
}

// ─── Educativo ──────────────────────────────────────────────────────
// Dos barras en L, fijas: al pulsar una enseña su matriz de rigidez local, la transformación
// y el ensamblaje. No tiene parámetros que exponer: es una lección, no un modelo.
export const femExplained = conPanelPropio("fem-explained", "FEM paso a paso", "🧪 Utilidades");

export const ejemplosConPanelPropio: ExampleDef[] = [
  femExplained,
];
