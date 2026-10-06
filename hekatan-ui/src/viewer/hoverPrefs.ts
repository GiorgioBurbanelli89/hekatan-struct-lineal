/**
 * Qué enseña el visor al pasar el cursor (Jorge, 30-sep-2026: «no puedo apreciar el caso de los nudos»; la
 * tarjeta de la matriz local y el recuadro de resultados tapaban el modelo). Casillas en Settings › 🖱 Al pasar
 * el cursor. Se guardan en el navegador.
 *   nudos / barras / areas : el recuadro de información (desplazamientos, reacciones, esfuerzos) de cada tipo
 *   kBarras / kAreas       : la tarjeta «Matriz de rigidez local» de barras / de paños de cáscara
 */
import van, { State } from "vanjs-core";

// v2 (6-oct-2026): la tarjeta «Matriz de rigidez local» de los PAÑOS pasa a estar APAGADA por defecto. Es más alta que
// la ventana (dos matrices de 12×12): al pasar por una placa se abría ENCIMA del cursor, se quedaba con los eventos del
// ratón y el recuadro de resultados se congelaba en el primer paño («no funciona el hover en la placa», Jorge, 5-oct).
// Se enciende en Settings › 🖱 Al pasar el cursor › «matriz K de áreas». Lo demás se hereda de v1.
const CLAVE = "hk_hover_prefs_v2";
const leer = (k: string): Record<string, boolean> => { try { return JSON.parse(localStorage.getItem(k) ?? "{}"); } catch { return {}; } };
const v2 = leer(CLAVE), v1 = leer("hk_hover_prefs_v1");
const ini: Record<string, boolean> = Object.keys(v2).length ? v2 : { ...v1, kAreas: false };
const st = (k: string, d = true) => van.state<boolean>(ini[k] ?? d);
export const hoverPrefs: Record<"nudos" | "barras" | "areas" | "kBarras" | "kAreas" | "todos", State<boolean>> = {
  nudos: st("nudos"), barras: st("barras"), areas: st("areas"), kBarras: st("kBarras"), kAreas: st("kAreas", false),
  // false = el recuadro de una cáscara enseña SOLO el resultado elegido en «Resultados de cáscara»
  todos: van.state<boolean>(ini["todos"] ?? false),
};
van.derive(() => {
  const o: Record<string, boolean> = {};
  for (const [k, s] of Object.entries(hoverPrefs)) o[k] = s.val;
  try { localStorage.setItem(CLAVE, JSON.stringify(o)); } catch { /* sin almacenamiento */ }
});
(globalThis as any).__hekatanHoverPrefs = hoverPrefs;

/** ¿Se enseña el recuadro de este tipo de objeto? */
export function hoverPermitido(tipo: string): boolean {
  if (tipo === "node") return hoverPrefs.nudos.val;
  if (tipo === "frame") return hoverPrefs.barras.val;
  return hoverPrefs.areas.val;            // shell y solid
}
