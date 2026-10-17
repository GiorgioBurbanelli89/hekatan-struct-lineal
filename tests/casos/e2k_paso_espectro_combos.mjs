/**
 * Casos de espectro, funciones y combinaciones del e2k leído → .heks (e2kcaso / e2kfunc / e2kcombo) → .e2k exportado,
 * TAL CUAL (16-oct-2026). Antes el .heks guardaba solo la ÚLTIMA componente de cada caso de espectro (U3 1.96 de cuatro)
 * y solo las combinaciones que nombraban patrones (2 de 11 en el TACNA); el .e2k exportado no llevaba ninguna.
 * La aceleración (SF) del fichero leído está en m/s² y el exportado va en mm: tiene que salir ×1000.
 */
import { empaquetar, R } from "../lib/bundle.mjs";

export const nombre = "e2k-paso-espectro-combos";
export const descripcion = "casos de espectro, funciones y combinaciones del e2k leído pasan tal cual al e2k exportado";

const HEKS = `node 1 0 0 0
node 2 0 0 3
node 3 4 0 3
node 4 4 0 0
frame 1 1 2 25000000 0.16 0.002133 0.002133 0.0036 0.2 2.4
frame 2 2 3 25000000 0.16 0.002133 0.002133 0.0036 0.2 2.4
frame 3 4 3 25000000 0.16 0.002133 0.002133 0.0036 0.2 2.4
support 1 fixed
support 4 fixed
load 2 10 0 0 0 0 0
e2kfunc FUNCTION "SISTEMA_DE_MUROS"  FUNCTYPE "SPECTRUM"  DAMPRATIO 0.05  SPECTYPE "USER"
e2kfunc FUNCTION "SISTEMA_DE_MUROS"  TIMEVAL "0  0.2872  0.4  0.2872  1  0.1269"
e2kcaso LOADCASE "SISMO_D_X-X"  TYPE  "Response Spectrum"  MODALCASE  "Modal"
e2kcaso LOADCASE "SISMO_D_X-X"  ACCEL  "U1"  FUNC  "SISTEMA_DE_MUROS"  SF  9.8067
e2kcaso LOADCASE "SISMO_D_X-X"  ACCEL  "U2"  FUNC  "SISTEMA_DE_MUROS"  SF  2.942
e2kcaso LOADCASE "SISMO_D_X-X"  DIRCOMBO  "ABS"
e2kcombo COMBO "Comb1"  TYPE "Linear Add"
e2kcombo COMBO "Comb1"  LOADCASE "Dead"  SF 1.2
e2kcombo COMBO "Comb1"  LOADCASE "SISMO_D_X-X"  SF 1
e2kcombo COMBO "ENVOLVENTE"  TYPE "Envelope"
e2kcombo COMBO "ENVOLVENTE"  LOADCOMBO "Comb1"  SF 1
solve
`;

export async function correr() {
  const mod = await empaquetar(`
const g = globalThis; g.window = g;
const nodo = () => ({ style:{}, appendChild(){}, setAttribute(){}, addEventListener(){}, classList:{add(){},remove(){},toggle(){},contains:()=>false}, getContext:()=>null, querySelector:()=>null, querySelectorAll:()=>[], remove(){} });
g.document = g.document ?? { createElement: nodo, createElementNS: nodo, body: nodo(), head: nodo(), documentElement: nodo(), querySelector:()=>null, querySelectorAll:()=>[], addEventListener(){}, getElementById:()=>null };
const { cliModeler } = await import("${R}/examples/src/cli-modeler/cliModeler");
const { exportE2k } = await import("${R}/examples/src/shared/e2kExporter");
export function aE2k(texto) {
  const st = (v) => ({ val: v });
  const s = { nodes: st([]), elements: st([]), nodeInputs: st({}), elementInputs: st({}), deformOutputs: st({}), analyzeOutputs: st({}), objects3D: st([]) };
  globalThis.window.__hekatanCliScript = texto;
  cliModeler.build({}, s);
  return exportE2k({ nodes: s.nodes.val, elements: s.elements.val, nodeInputs: s.nodeInputs.val, elementInputs: s.elementInputs.val, title: "t", weightMode: "manual" });
}`, "e2kPasoEspectro");
  const e2k = mod.aE2k(HEKS);
  const fila = (que, ok, detalle) => ({ que, crudo: true, medido: ok ? "si" : "no", limite: "si", ok, detalle });
  const sf = e2k.match(/LOADCASE "SISMO_D_X-X"\s+ACCEL\s+"U1"\s+FUNC\s+"SISTEMA_DE_MUROS"\s+SF\s+([\d.]+)/)?.[1];
  return [
    fila("la función del espectro va en $ FUNCTIONS", /\$ FUNCTIONS[\s\S]*FUNCTION "SISTEMA_DE_MUROS"\s+FUNCTYPE "SPECTRUM"/.test(e2k)),
    fila("el caso de espectro lleva sus DOS componentes", /ACCEL\s+"U1"/.test(e2k) && /ACCEL\s+"U2"/.test(e2k)),
    fila("SF de la aceleración pasa de m/s² a mm/s² (9.8067 → 9806.7)", sf === "9806.7", `SF escrito: ${sf}`),
    fila("la combinación lineal y la ENVOLVENTE van en $ LOAD COMBINATIONS",
      /\$ LOAD COMBINATIONS[\s\S]*COMBO "Comb1"\s+TYPE "Linear Add"/.test(e2k) && /COMBO "ENVOLVENTE"\s+LOADCOMBO "Comb1"/.test(e2k)),
  ];
}
