/**
 * Ejemplo graduado `sydney-opera` (velas tipo cáscara en shells Q4) — ver
 * docs/GRADUAR_UN_EJEMPLO.md.
 *
 * Sin panel de benchmark (el panel viejo `sydney-opera/main.ts` no comparaba
 * contra ningún programa ni fórmula): se comprueba cuenta de nudos y
 * elementos, ausencia de NaN en la deformada y equilibrio ΣR+ΣF=0 en X/Y/Z
 * bajo el self-weight.
 */
import { empaquetar, R } from "../lib/bundle.mjs";

export const nombre = "graduado-sydney-opera";
export const descripcion = "ejemplo graduado sydney-opera: cuenta, sin NaN y equilibrio bajo self-weight";

export async function correr() {
  const v = await empaquetar(`
    export { sydneyOpera, mallaSydneyOpera } from "${R}/examples/src/sydney-opera/sydneyOpera";
  `, "graduado-sydney-opera");
  const filas = [];

  const ex = v.sydneyOpera;
  const params = Object.fromEntries(Object.entries(ex.params).map(([k, d]) => [k, d.default]));
  const st = () => ({ val: undefined, rawVal: undefined });
  const states = {
    nodes: st(), elements: st(), nodeInputs: st(), elementInputs: st(),
    deformOutputs: st(), analyzeOutputs: st(), objects3D: st(),
  };
  ex.build(params, states);

  const nShells = Math.round(params.nShells), nArch = Math.round(params.nArch);
  const nEsperado = nShells * 5 * (nArch + 1);
  const eEsperado = nShells * 4 * nArch;
  const nNodes = states.nodes.val.length, nElem = states.elements.val.length;
  filas.push({
    que: "nudos y elementos", crudo: true,
    medido: `${nNodes} nudos, ${nElem} elementos`,
    limite: `${nEsperado} nudos, ${eEsperado} elementos`,
    ok: nNodes === nEsperado && nElem === eEsperado,
  });

  const defs = states.deformOutputs.val.deformations;
  let nan = 0;
  for (const [, d] of defs) for (const x of d) if (!isFinite(x)) nan++;
  filas.push({
    que: "sin NaN en la deformada", crudo: true,
    medido: `${nan} componentes`, limite: "0", ok: nan === 0,
  });

  // Equilibrio: suma de reacciones + suma de cargas (self-weight, todo en −Z) = 0
  // en X/Y/Z, límite 1e-6 % del total de carga aplicada.
  const reacts = states.deformOutputs.val.reactions;
  const cargas = states.nodeInputs.val.loads;
  const sumR = [0, 0, 0], sumF = [0, 0, 0];
  for (const [, r] of reacts) for (let i = 0; i < 3; i++) sumR[i] += r[i];
  for (const [, l] of cargas) for (let i = 0; i < 3; i++) sumF[i] += l[i];
  const totalCarga = Math.hypot(...sumF) || 1;
  const desbalance = Math.hypot(...sumR.map((r, i) => r + sumF[i]));
  const pctDesbalance = (desbalance / totalCarga) * 100;
  filas.push({
    que: "equilibrio ΣR+ΣF=0 (X,Y,Z)", medido: pctDesbalance, limite: 1e-6,
    ok: pctDesbalance <= 1e-6,
    detalle: `ΣR=[${sumR.map((x) => x.toFixed(6)).join(",")}]  ΣF=[${sumF.map((x) => x.toFixed(6)).join(",")}]`,
  });

  // La malla pura exportada es la misma que usa build() (mismo módulo, mismo import).
  const m = v.mallaSydneyOpera(params);
  filas.push({
    que: "malla pura == la que arma build()", crudo: true,
    medido: `${m.nodes.length} nudos`, limite: `${nNodes} nudos`,
    ok: m.nodes.length === nNodes,
  });

  return filas;
}
