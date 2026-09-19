/**
 * La PLANTILLA «Zapata con levantamiento» con los datos del ejemplo 6.10 de Das (P, columna en
 * x = 0.15 y y = 0.30 desde el centro, ks 2000) tiene que dar LO MISMO que el ejemplo: mismo .heks y
 * mismos asientos. Y con P + momentos en vez de mover la columna, la misma resultante.
 */
import { empaquetar, R } from "../lib/bundle.mjs";

export const nombre = "zapata-levantamiento-plantilla";
export const descripcion = "plantilla con los datos de Das 6.10 = ejemplo (mismo .heks y mismos resultados)";

export async function correr() {
  const m = await empaquetar(`
const g = globalThis; g.window = g.window ?? {}; g.localStorage = g.localStorage ?? { getItem: () => null, setItem() {} };
export * from "${R}/examples/src/zapata-excentrica/zapataExcentrica";
export { cliModeler } from "${R}/examples/src/cli-modeler/cliModeler";`, "zapexc-plantilla");
  const defs = Object.fromEntries(Object.entries(m.zapataLevantamientoPlantilla.params).map(([k, v]) => [k, v.default]));
  const filas = [];
  const hEj = m.heksZapataExcentrica(m.DAS_EJ610);
  const hPl = m.heksZapataExcentrica(m.paramsDePlantilla(defs));
  filas.push({ que: "mismo .heks (plantilla por defecto = ejemplo Das 6.10)", medido: hEj === hPl ? 1 : 0, limite: 1, ok: hEj === hPl, crudo: true,
               detalle: `${hEj.length} vs ${hPl.length} caracteres` });
  // la misma resultante con la columna centrada y momentos: My = P·ex, Mx = P·ey
  const P = defs.P;
  const conM = m.paramsDePlantilla({ ...defs, xcol: 0, ycol: 0, My: P * 0.15, Mx: P * 0.30 });
  const e1 = m.paramsDePlantilla(defs);
  const dif = Math.abs(conM.exL - e1.exL) + Math.abs(conM.eyB - e1.eyB);
  filas.push({ que: "P + momentos = columna corrida (misma e)", medido: dif, limite: 1e-12, ok: dif < 1e-12, crudo: true,
               detalle: `e/B ${conM.exL.toFixed(4)} · e/L ${conM.eyB.toFixed(4)}` });
  // resolver los dos y comparar asientos
  const st = (v) => ({ val: v });
  const res = (texto) => {
    globalThis.window = { __hekatanCliScript: texto };
    const s = { nodes: st([]), elements: st([]), nodeInputs: st({}), elementInputs: st({}), deformOutputs: st({}), analyzeOutputs: st({}), objects3D: st([]) };
    m.cliModeler.build({}, s);
    return s.deformOutputs.val.deformations;
  };
  const A = res(hEj), B = res(hPl);
  let peor = 0; for (const [k, v] of A) peor = Math.max(peor, Math.abs(v[2] - B.get(k)[2]));
  filas.push({ que: "asientos plantilla vs ejemplo", medido: peor, limite: 1e-12, ok: peor <= 1e-12, crudo: true, detalle: "m, peor nudo" });
  // y el conmutador lineal: sin «suelo sin tracción» la presión máxima es la del lineal (SAP2000 76.67)
  const lin = res(m.heksZapataExcentrica({ ...m.DAS_EJ610, sinTraccion: false }));
  let wmin = 0; for (const v of lin.values()) wmin = Math.min(wmin, v[2]);
  const qlin = -wmin * 2000;
  filas.push({ que: "lineal (suelo tira) vs SAP2000 lineal 76.670", medido: Math.abs(qlin / 76.670 - 1) * 100, limite: 0.01,
               ok: Math.abs(qlin / 76.670 - 1) * 100 <= 0.01, detalle: `${qlin.toFixed(3)} tonf/m²` });
  return filas;
}
