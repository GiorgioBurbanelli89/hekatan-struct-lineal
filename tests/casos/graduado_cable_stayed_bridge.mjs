/**
 * Regresión del ejemplo graduado «cable-stayed-bridge» (tablero + 2 torres + cables).
 *
 * Construye el ejemplo con sus parámetros por defecto y estados falsos (mismo patrón que
 * `solidos_visor.mjs`, sección 5) y comprueba: nudos/barras contra la propia malla pura
 * `mallaCableStayedBridge` (la que usa `build()`), que la deformada no tenga NaN, equilibrio
 * global (ΣF + ΣR = 0 en X, Y, Z, relativo a la carga total) y un valor SELLADO de la flecha
 * máxima. El conteo de cables no tiene una fórmula cerrada simple (depende de la condición
 * `dx > span·0.05 && dx < span·0.45 && i par` del abanico), así que se contrasta contra la
 * malla en vez de contra un número fijo — eso ya prueba que `build()` no se desvía de ella.
 *
 * El sello (51.54124295774494 mm, nudo 19) se midió de ESTE MISMO código el 28-sep-2026,
 * corriendo `ex.build()` con los parámetros por defecto. Falta cruzarlo contra la página
 * vieja `examples/src/cable-stayed-bridge/main.ts` (antes de graduar) con
 * `node cli/comparar_graduado.mjs cable-stayed-bridge`, que carea nudo a nudo en el navegador.
 */
import { empaquetar, R } from "../lib/bundle.mjs";

export const nombre = "graduado-cable-stayed-bridge";
export const descripcion = "Puente Atirantado graduado: nudos/barras, NaN, equilibrio y flecha máxima sellada";

const SELLO_FLECHA_MM = 51.54124295774494;
const pct = (a, b) => (b === 0 ? Math.abs(a) * 100 : (Math.abs(a - b) / Math.abs(b)) * 100);

export async function correr() {
  const v = await empaquetar(`
    export { cableStayedBridge } from "${R}/examples/src/cable-stayed-bridge/cableStayedBridge";
    export { mallaCableStayedBridge } from "${R}/examples/src/cable-stayed-bridge/cableStayedBridge";
  `, "graduado-cable-stayed-bridge");
  const ex = v.cableStayedBridge;
  const params = Object.fromEntries(Object.entries(ex.params).map(([k, d]) => [k, d.default]));
  const st = () => ({ val: undefined, rawVal: undefined });
  const states = {
    nodes: st(), elements: st(), nodeInputs: st(), elementInputs: st(),
    deformOutputs: st(), analyzeOutputs: st(), objects3D: st(),
  };
  ex.build(params, states);

  const filas = [];
  const nodes = states.nodes.val ?? [];
  const elements = states.elements.val ?? [];
  const def = states.deformOutputs.val ?? {};
  const ni = states.nodeInputs.val ?? {};

  // 1. nudos y barras, contra la MISMA malla pura que usa build() (el conteo de cables no
  //    tiene fórmula cerrada: depende del abanico dx > span·0.05 && dx < span·0.45 && i par).
  const malla = v.mallaCableStayedBridge({
    span: params.span, towerH: params.towerH, deckH: params.deckH, deckW: params.deckW,
    nSpanDiv: params.nSpanDiv, loadDeck: params.loadDeck,
  });
  filas.push({
    que: "nudos y barras", crudo: true,
    medido: `${nodes.length} nudos, ${elements.length} barras`,
    limite: `${malla.nodes.length} nudos, ${malla.elements.length} barras (malla pura)`,
    ok: nodes.length === malla.nodes.length && elements.length === malla.elements.length,
  });
  // Con los defaults: 34 nudos de tablero + 8 de torres = 42; 49 barras de tablero/torres
  // (nDeckEls + nTorreEls) + cables.
  filas.push({
    que: "barras: tablero+torres vs cables", crudo: true,
    medido: `${malla.nDeckEls + malla.nTorreEls} tablero/torres, ${elements.length - malla.nDeckEls - malla.nTorreEls} cables`,
    limite: `${elements.length} barras en total`,
    ok: malla.nDeckEls + malla.nTorreEls < elements.length,
  });

  // 2. deformada sin NaN
  let nan = 0;
  for (const [, v2] of def.deformations ?? []) if (v2.some((x) => !Number.isFinite(x))) nan++;
  filas.push({
    que: "deformada sin NaN", crudo: true, medido: `${nan} nudos con NaN`, limite: "0",
    ok: nan === 0,
  });

  // 3. equilibrio global ΣF + ΣR = 0, relativo a la carga total, componente a componente
  const sF = [0, 0, 0], sR = [0, 0, 0];
  if (ni.loads) for (const [, v2] of ni.loads) for (let i = 0; i < 3; i++) sF[i] += v2[i] || 0;
  if (def.reactions) for (const [, v2] of def.reactions) for (let i = 0; i < 3; i++) sR[i] += v2[i] || 0;
  const total = Math.hypot(...sF) || 1;
  const EJES = ["X", "Y", "Z"];
  for (let i = 0; i < 3; i++) {
    const dif = Math.abs(sF[i] + sR[i]);
    const medido = (dif / total) * 100;
    filas.push({
      que: `equilibrio ${EJES[i]} (ΣF+ΣR=0)`, medido, limite: 1e-6, ok: medido <= 1e-6,
      detalle: `ΣF=${sF[i].toFixed(4)} kN, ΣR=${sR[i].toFixed(4)} kN`,
    });
  }

  // 4. flecha máxima, sellada el 28-sep-2026
  let dMax = 0, nodoDMax = -1;
  for (const [n, v2] of def.deformations ?? []) {
    const d = Math.hypot(v2[0], v2[1], v2[2]);
    if (d > dMax) { dMax = d; nodoDMax = n; }
  }
  const dMaxMm = dMax * 1000;
  const medido = pct(dMaxMm, SELLO_FLECHA_MM);
  filas.push({
    que: "flecha máxima (sello 28-sep-2026)", medido, limite: 1e-6, ok: medido <= 1e-6,
    detalle: `${dMaxMm.toFixed(7)} mm en el nudo ${nodoDMax} vs sello ${SELLO_FLECHA_MM.toFixed(7)} mm`,
  });

  return filas;
}
