/**
 * Qué enseña el visor al pasar el cursor (Jorge, 30-sep-2026: «no puedo apreciar el caso de los nudos»; la
 * tarjeta de la matriz local y el recuadro de resultados tapaban el modelo). Casillas en Settings › 🖱 Al pasar
 * el cursor. Se guardan en el navegador.
 *   nudos / barras / areas : el recuadro de información (desplazamientos, reacciones, esfuerzos) de cada tipo
 *   kBarras / kAreas       : la tarjeta «Matriz de rigidez local» de barras / de paños de cáscara
 */
import van, { State } from "vanjs-core";

const CLAVE = "hk_hover_prefs_v1";
const leer = (): Record<string, boolean> => { try { return JSON.parse(localStorage.getItem(CLAVE) ?? "{}"); } catch { return {}; } };
const ini = leer();
const st = (k: string) => van.state<boolean>(ini[k] ?? true);
export const hoverPrefs: Record<"nudos" | "barras" | "areas" | "kBarras" | "kAreas" | "todos", State<boolean>> = {
  nudos: st("nudos"), barras: st("barras"), areas: st("areas"), kBarras: st("kBarras"), kAreas: st("kAreas"),
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
