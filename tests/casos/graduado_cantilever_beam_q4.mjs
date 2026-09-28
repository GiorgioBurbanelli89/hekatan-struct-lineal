/**
 * Ejemplo graduado `cantilever-beam-q4` (viga cantiléver en shells Q4) — ver
 * docs/GRADUAR_UN_EJEMPLO.md.
 *
 * Construye el ExampleDef con sus valores por defecto y comprueba: cuenta de
 * nudos y elementos, ausencia de NaN en la deformada, equilibrio ΣR+ΣF=0 en
 * X/Y/Z y el benchmark del panel viejo (`cantilever-beam-q4/main.ts`, hasta el
 * 28-sep-2026): Uz de la punta contra Euler-Bernoulli δ=P·L³/(3·E·I), con el
 * mismo límite de "aceptable" que usaba ese panel (< 5 %, donde pasaba de
 * amarillo — "shear locking" — a rojo "FALLA").
 */
import { empaquetar, R } from "../lib/bundle.mjs";

export const nombre = "graduado-cantilever-beam-q4";
export const descripcion = "ejemplo graduado cantilever-beam-q4: cuenta, sin NaN, equilibrio y Uz vs Euler-Bernoulli";

const LIMITE_BENCHMARK = 5; // el panel viejo: <1% PASA, 1-5% "aceptable" (shear locking), >=5% FALLA

export async function correr() {
  const v = await empaquetar(`
    export { cantileverBeamQ4, mallaVigaCantileverQ4 }
      from "${R}/examples/src/cantilever-beam-q4/cantileverBeamQ4";
  `, "graduado-cantilever-beam-q4");
  const filas = [];

  const ex = v.cantileverBeamQ4;
  const params = Object.fromEntries(Object.entries(ex.params).map(([k, d]) => [k, d.default]));
  const st = () => ({ val: undefined, rawVal: undefined });
  const states = {
    nodes: st(), elements: st(), nodeInputs: st(), elementInputs: st(),
    deformOutputs: st(), analyzeOutputs: st(), objects3D: st(),
  };
  ex.build(params, states);

  const nx = Math.round(params.nx), ny = Math.round(params.ny);
  const nEsperado = (nx + 1) * (ny + 1), eEsperado = nx * ny;
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

  // Equilibrio: suma de reacciones + suma de cargas = 0 en X/Y/Z, límite 1e-6 %
  // del total de carga aplicada.
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

  // Benchmark del panel viejo: Uz de la punta vs Euler-Bernoulli.
  const m = v.mallaVigaCantileverQ4(params);
  const tipDef = defs.get(m.tipMid);
  const uz = tipDef ? tipDef[2] : 0;
  const iBeam = (params.t * params.h * params.h * params.h) / 12;
  const deltaAna = (params.P * params.L * params.L * params.L) / (3 * params.E * iBeam);
  const errPct = Math.abs(Math.abs(uz) / deltaAna - 1) * 100;
  filas.push({
    que: "Uz punta vs Euler-Bernoulli", medido: errPct, limite: LIMITE_BENCHMARK,
    ok: errPct <= LIMITE_BENCHMARK,
    detalle: `${uz.toExponential(4)} m vs ${(-deltaAna).toExponential(4)} m`,
  });

  // La malla pura exportada es la misma que usa build() (mismo módulo, mismo import).
  filas.push({
    que: "malla pura == la que arma build()", crudo: true,
    medido: `${m.nodes.length} nudos`, limite: `${nNodes} nudos`,
    ok: m.nodes.length === nNodes,
  });

  return filas;
}
