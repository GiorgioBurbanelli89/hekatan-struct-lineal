/**
 * ▶ Un EJEMPLO se abre ya resuelto; una PLANTILLA no.
 *
 * Regla de Jorge (18-sep-2026):
 *   · **Ejemplo** = una demostración. Se entra y se ve: resuelto, con sus resultados a la
 *     vista y, si tiene modal, con los modos corridos y la animación en marcha. También
 *     cuando se abre por enlace (`?t=<id>`), que es como lo comparte.
 *   · **Plantilla** = una herramienta. El usuario ajusta vanos, pisos, secciones, muros o
 *     cimentación y calcula cuando quiere. No se ejecuta sola.
 *
 * ── EL FRENO, con los números ya medidos (CLAUDE.md) ──
 * La animación reescribe `mesh.nodes` en cada fotograma: 50-80 ms con 6600 nudos, o sea
 * 10-15 fps y el hilo ocupado. Por eso el arranque automático mira el tamaño:
 *
 *   ≤ 1500 nudos      → modal + animación normal
 *   1500 - 4000 nudos → modal + animación a paso reducido
 *   > 4000 nudos      → modal SÍ, animación NO (y se dice por qué, no se calla)
 *
 * Todo sale en un `setTimeout(…, 0)` después del primer dibujo: si se lanzara dentro de
 * `loadExample`, la página se quedaría en blanco mientras resuelve.
 *
 * Escape: `&auto=0` en la URL abre el ejemplo sin ejecutar nada (para depurar).
 */

export type TipoModelo = "ejemplo" | "plantilla";

/** Cuántos parámetros hacen de algo una herramienta y no una demostración. */
const PARAMS_PLANTILLA = 6;

/**
 * Qué es cada cosa. Si el `ExampleDef` lo declara (`tipo`), manda lo declarado; si no, se
 * deduce: con muchos mandos es una plantilla, con pocos o ninguno es un ejemplo.
 */
export function tipoDeModelo(ex: any): TipoModelo {
  if (ex?.tipo === "ejemplo" || ex?.tipo === "plantilla") return ex.tipo;
  if (ex?.standaloneUrl) return "ejemplo";          // los legacy traen su propia página
  if (ex?.id === "new-blank" || ex?.id === "cad-draw" || ex?.id === "cli-modeler") return "plantilla";
  const n = Object.keys(ex?.params ?? {}).length;
  if (ex?.dynamicParams) return "plantilla";        // se reconfigura sola = herramienta
  return n >= PARAMS_PLANTILLA ? "plantilla" : "ejemplo";
}

/**
 * Marca para el selector, que es donde hay que poder distinguirlos de un vistazo:
 * ▶ = ejemplo (se abre ejecutándose) · 📐 = plantilla (se ajusta y se calcula).
 * (Era 🧪, pero la categoría «🧪 Utilidades» ya lo usa y en la lista se confundían.)
 */
export function etiquetaTipo(ex: any): string {
  return tipoDeModelo(ex) === "ejemplo" ? "▶" : "📐";
}

export interface GanchosAuto {
  /** Corre el modal y arranca la animación (el `__hekatanRunModalAnimate` del workspace). */
  correrModalAnimar?: () => void;
  /** Para la animación dejando los modos calculados. */
  pararAnimacion?: () => void;
  /** Mensaje para el usuario (barra de estado); si no hay, se usa la consola. */
  avisar?: (msg: string) => void;
}

export interface ResultadoAuto {
  /** Qué se hizo, para poder comprobarlo desde fuera (tests y arneses). */
  accion: "nada-es-plantilla" | "apagado-por-url" | "resuelto" | "modal-animando" | "modal-sin-animar";
  nudos: number;
}

/**
 * Se llama al final de `loadExample`. Devuelve QUÉ hizo (no un booleano): así el arnés
 * puede comprobar que un ejemplo abrió animando y una plantilla no.
 */
export function autoEjecutar(ex: any, states: any, ganchos: GanchosAuto = {}): ResultadoAuto {
  const nudos = states?.nodes?.val?.length ?? 0;
  const avisar = ganchos.avisar ?? ((m: string) => console.log("[auto]", m));

  let apagado = false;
  try { apagado = new URLSearchParams(location.search).get("auto") === "0"; } catch { /* sin URL */ }
  if (apagado) return { accion: "apagado-por-url", nudos };

  if (tipoDeModelo(ex) !== "ejemplo") return { accion: "nada-es-plantilla", nudos };

  // El modelo ya está resuelto por `build()`; lo que falta, si lo tiene, es el modal.
  if (!ex?.hasModal || !ganchos.correrModalAnimar) return { accion: "resuelto", nudos };

  const animar = nudos <= 4000;
  const paso = nudos > 1500 ? "reducido" : "normal";
  (globalThis as any).__hekatanAnimPaso = paso;

  // Después del primer dibujo, nunca dentro de loadExample.
  setTimeout(() => {
    try {
      ganchos.correrModalAnimar!();
      if (!animar) {
        // Se corre el modal igual (los modos son el resultado), pero la animación se deja
        // apagada: con este tamaño iría a 10-15 fps y bloquearía el panel.
        ganchos.pararAnimacion?.();
        avisar(`Modelo grande (${nudos} nudos): modos calculados, animación apagada. Pulsá «▶ Correr modal + animar» para verla.`);
      }
    } catch (e: any) {
      avisar("No se pudo correr el modal automáticamente: " + (e?.message ?? e));
    }
  }, 0);

  return { accion: animar ? "modal-animando" : "modal-sin-animar", nudos };
}
