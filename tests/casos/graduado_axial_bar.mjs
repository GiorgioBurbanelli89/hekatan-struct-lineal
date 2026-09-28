/**
 * Ejemplo graduado `axial-bar` (barra axial) — ver docs/GRADUAR_UN_EJEMPLO.md.
 *
 * Construye el ExampleDef con sus valores por defecto (estados falsos, como en
 * `tests/casos/solidos_visor.mjs` sección 5) y comprueba: cuenta de nudos y
 * barras, ausencia de NaN en la deformada, equilibrio ΣR+ΣF=0 y el desplazamiento
 * FEM contra el analítico u = F·L/(E·A).
 */
import { empaquetar, R } from "../lib/bundle.mjs";

export const nombre = "graduado-axial-bar";
export const descripcion = "ejemplo graduado axial-bar: cuenta, sin NaN, equilibrio y FEM vs analítico F·L/(E·A)";

export async function correr() {
  const v = await empaquetar(`
    export { axialBar, mallaBarraAxial } from "${R}/examples/src/axial-bar/axialBar";
  `, "graduado-axial-bar");
  const filas = [];

  const ex = v.axialBar;
  const params = Object.fromEntries(Object.entries(ex.params).map(([k, d]) => [k, d.default]));
  const st = () => ({ val: undefined, rawVal: undefined });
  const states = {
    nodes: st(), elements: st(), nodeInputs: st(), elementInputs: st(),
    deformOutputs: st(), analyzeOutputs: st(), objects3D: st(),
  };
  ex.build(params, states);

  const nNodes = states.nodes.val.length;
  const nElem = states.elements.val.length;
  filas.push({
    que: "nudos y barras", crudo: true,
    medido: `${nNodes} nudos, ${nElem} barras`,
    limite: `${params.nElem + 1} nudos, ${params.nElem} barras`,
    ok: nNodes === params.nElem + 1 && nElem === params.nElem,
  });

  const defs = states.deformOutputs.val.deformations;
  let nan = 0;
  for (const [, d] of defs) for (const x of d) if (!isFinite(x)) nan++;
  filas.push({
    que: "sin NaN en la deformada", crudo: true,
    medido: `${nan} componentes`, limite: "0", ok: nan === 0,
  });

  // Equilibrio: suma de reacciones + suma de cargas = 0, componente a componente,
  // límite 1e-6 % del total de carga aplicada.
  const reacts = states.deformOutputs.val.reactions;
  const cargas = states.nodeInputs.val.loads;
  const sumR = [0, 0, 0, 0, 0, 0], sumF = [0, 0, 0, 0, 0, 0];
  for (const [, r] of reacts) for (let i = 0; i < 6; i++) sumR[i] += r[i];
  for (const [, l] of cargas) for (let i = 0; i < 6; i++) sumF[i] += l[i];
  const totalCarga = Math.hypot(...sumF) || 1;
  const desbalance = Math.hypot(...sumR.map((r, i) => r + sumF[i]));
  const pctDesbalance = (desbalance / totalCarga) * 100;
  filas.push({
    que: "equilibrio ΣR+ΣF=0", medido: pctDesbalance, limite: 1e-6,
    ok: pctDesbalance <= 1e-6,
    detalle: `ΣR=[${sumR.map((x) => x.toFixed(4)).join(",")}]  ΣF=[${sumF.map((x) => x.toFixed(4)).join(",")}]`,
  });

  // FEM vs analítico: u = F·L/(E·A), en el nudo del extremo cargado.
  const E = params.E_gpa * 1e6, A = params.A_cm2 * 1e-4;
  const u_teorico = (params.F_kN * params.L_m) / (E * A);
  const u_fem = defs.get(params.nElem)[0];
  const pctErr = (Math.abs(u_fem - u_teorico) / Math.abs(u_teorico)) * 100;
  filas.push({
    que: "FEM vs analítico u=F·L/(E·A)", medido: pctErr, limite: 1e-6,
    ok: pctErr <= 1e-6,
    detalle: `${u_fem.toExponential(8)} m vs ${u_teorico.toExponential(8)} m`,
  });

  // La malla pura exportada es la misma que usa build() (mismo módulo, mismo import).
  const m = v.mallaBarraAxial(params);
  filas.push({
    que: "malla pura == la que arma build()", crudo: true,
    medido: `${m.nodes.length} nudos`, limite: `${nNodes} nudos`,
    ok: m.nodes.length === nNodes,
  });

  return filas;
}
