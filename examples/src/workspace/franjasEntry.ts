// Panel «Franjas» (diseño de losas por franjas, como SAFE). Módulo aparte para no tocar main.ts:
// espera a que el workspace exponga sus states y monta el botón.
import { montarPanelFranjas } from "../shared/stripDesignPanel";
const esperar = () => ((window as any).__hekatanStates ? (montarPanelFranjas(), abrirSiLoPide()) : setTimeout(esperar, 500));
esperar();
// `&diseno=1` en el enlace: abre con el mapa de ACERO (cm²/m) en vez de la presión, cuando ya hay resultados.
function abrirSiLoPide() {
  if (!new URLSearchParams(location.search).get("diseno")) return;
  const t0 = Date.now();
  const listo = () => (window as any).__hekatanStates?.analyzeOutputs?.val?.bendingXXjoint;
  const ir = () => (listo() ? document.getElementById("hk-franjas-btn")?.click() : Date.now() - t0 < 90000 && setTimeout(ir, 700));
  setTimeout(ir, 1500);
}
