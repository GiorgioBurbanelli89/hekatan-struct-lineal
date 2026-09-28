/**
 * Regresión del ejemplo graduado «gateway-arch» (arco parabólico, 2 arcos + bracing).
 *
 * Construye el ejemplo con sus parámetros por defecto y estados falsos (mismo patrón que
 * `solidos_visor.mjs`, sección 5) y comprueba: nudos/barras contra la fórmula de la malla,
 * que la deformada no tenga NaN, equilibrio global (ΣF + ΣR = 0 en X, Y, Z, relativo a la
 * carga total) y un valor SELLADO de la flecha máxima.
 *
 * El sello (1.1894651696670187 mm, nudo 21) se midió de ESTE MISMO código el 28-sep-2026,
 * corriendo `ex.build()` con los parámetros por defecto. Falta cruzarlo contra la página
 * vieja `examples/src/gateway-arch/main.ts` (antes de graduar) con
 * `node cli/comparar_graduado.mjs gateway-arch`, que carea nudo a nudo en el navegador.
 */
import { empaquetar, R } from "../lib/bundle.mjs";

export const nombre = "graduado-gateway-arch";
export const descripcion = "Gateway Arch graduado: nudos/barras, NaN, equilibrio y flecha máxima sellada";

const SELLO_FLECHA_MM = 1.1894651696670187;
const pct = (a, b) => (b === 0 ? Math.abs(a) * 100 : (Math.abs(a - b) / Math.abs(b)) * 100);

export async function correr() {
  const v = await empaquetar(`
    export { gatewayArch } from "${R}/examples/src/gateway-arch/gatewayArch";
  `, "graduado-gateway-arch");
  const ex = v.gatewayArch;
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

  // 1. nudos y barras, contra la fórmula de la propia malla (2 arcos de nDiv+1 nudos cada
  //    uno + 5 barras por tramo + el último transversal).
  const nDiv = Math.round(params.nDiv);
  const nNodosEsperados = (nDiv + 1) * 2;
  const nBarrasEsperadas = nDiv * 5 + 1;
  filas.push({
    que: "nudos y barras", crudo: true,
    medido: `${nodes.length} nudos, ${elements.length} barras`,
    limite: `${nNodosEsperados} nudos, ${nBarrasEsperadas} barras`,
    ok: nodes.length === nNodosEsperados && elements.length === nBarrasEsperadas,
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
