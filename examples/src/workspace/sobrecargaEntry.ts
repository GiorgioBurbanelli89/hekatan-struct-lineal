// Panel «Sobrecarga DNE» (asistente NEC-SE-CG). Módulo aparte para no tocar main.ts, mismo
// patrón que franjasEntry.ts: espera a que el workspace exponga sus states y monta el botón.
//
// NO está referenciado todavía desde workspace/index.html (a propósito: Jorge pidió no tocar
// nada del workspace hasta que termine el otro despliegue en curso). Cuando se autorice, la
// única línea que falta es la misma que ya usa franjasEntry.ts:
//   <script type="module" src="./sobrecargaEntry.ts"></script>
import { montarPanelSobrecarga } from "../shared/sobrecargaMuertaPanel";
const esperar = () => ((window as any).__hekatanStates ? montarPanelSobrecarga() : setTimeout(esperar, 500));
esperar();
