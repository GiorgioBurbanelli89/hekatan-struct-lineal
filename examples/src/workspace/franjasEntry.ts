// Panel «Franjas» (diseño de losas por franjas, como SAFE). Módulo aparte para no tocar main.ts:
// espera a que el workspace exponga sus states y monta el botón.
import { montarPanelFranjas } from "../shared/stripDesignPanel";
const esperar = () => ((window as any).__hekatanStates ? montarPanelFranjas() : setTimeout(esperar, 500));
esperar();
