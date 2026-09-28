/**
 * Ejemplo graduado `plate-q4` (placa Mindlin-Reissner Q4) — ver
 * docs/GRADUAR_UN_EJEMPLO.md.
 *
 * Comprueba cuenta de nudos y elementos, ausencia de NaN en la deformada y el
 * benchmark del panel viejo (`plate-q4/main.ts`, hasta el 28-sep-2026): w en
 * el centro contra la serie de Navier, solo válida para apoyo simple.
 *
 * `plateQ4Solve` (a diferencia de `deform`/`analyze`) no devuelve reacciones:
 * no hay equilibrio ΣR+ΣF que comprobar aquí (regla f de GRADUAR_UN_EJEMPLO.md:
 * "whenever the solver returns reactions").
 *
 * ⚠️ El panel viejo mostraba el error de Navier en texto (`Error = ${errW}%`)
 * pero NUNCA tuvo un semáforo de pasa/falla como shear-wall-q4 o
 * cantilever-beam-q4 — no hay un límite "del panel viejo" que copiar. Medido
 * con los valores por defecto (Lx=Ly=10 m, t=0.2 m, malla 16×16, apoyo
 * simple): 0.64 %, coherente con que Navier es teoría de placa delgada
 * (Kirchhoff) y el solver aquí es Mindlin-Reissner (incluye cortante
 * transversal) — no es error del solver. Se deja un límite conservador de
 * 2 % sin aflojarlo si algún día mide más que eso.
 */
import { empaquetar, R } from "../lib/bundle.mjs";

export const nombre = "graduado-plate-q4";
export const descripcion = "ejemplo graduado plate-q4: cuenta, sin NaN y w en el centro vs serie de Navier";

const LIMITE_NAVIER = 2; // ver nota arriba: sin semáforo en el panel viejo, límite conservador

export async function correr() {
  const v = await empaquetar(`
    export { plateQ4 } from "${R}/examples/src/plate-q4/plateQ4";
  `, "graduado-plate-q4");
  const filas = [];

  const ex = v.plateQ4;
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

  // Las 5 resultantes (Mxx/Myy/Mxy/Qx/Qy) sin NaN por elemento.
  const ao = states.analyzeOutputs.val;
  let nanRes = 0, nRes = 0;
  for (const mapa of [ao.bendingXX, ao.bendingYY, ao.bendingXY, ao.tranverseShearX, ao.tranverseShearY]) {
    for (const [, arr] of mapa) for (const x of arr) { nRes++; if (!isFinite(x)) nanRes++; }
  }
  filas.push({
    que: "sin NaN en Mxx/Myy/Mxy/Qx/Qy", crudo: true,
    medido: `${nanRes} de ${nRes}`, limite: "0", ok: nanRes === 0,
  });

  // Benchmark del panel viejo: w en el centro vs la serie de Navier (params por defecto = apoyo simple).
  const etiquetas = ex.computedLabels(params, states);
  const errTxt = etiquetas["Δ Hekatan vs Navier"];
  const err = errTxt ? parseFloat(errTxt) : NaN;
  filas.push({
    que: "w centro vs Navier (apoyo simple)", medido: err, limite: LIMITE_NAVIER,
    ok: isFinite(err) && err <= LIMITE_NAVIER,
    detalle: `${etiquetas["w en el centro"]} vs ${etiquetas["w Navier (analítico)"]}`,
  });

  // Con empotrado, la etiqueta avisa que Navier no aplica (no hay comparación que forzar).
  const paramsEmpotrada = { ...params, bcType: 1 };
  const statesEmp = {
    nodes: st(), elements: st(), nodeInputs: st(), elementInputs: st(),
    deformOutputs: st(), analyzeOutputs: st(), objects3D: st(),
  };
  ex.build(paramsEmpotrada, statesEmp);
  const etiquetasEmp = ex.computedLabels(paramsEmpotrada, statesEmp);
  filas.push({
    que: "empotrada: Navier no aplica", crudo: true,
    medido: etiquetasEmp["w Navier (analítico)"],
    limite: "aviso de 'no aplica'",
    ok: /no aplica/.test(etiquetasEmp["w Navier (analítico)"] ?? ""),
  });

  return filas;
}
