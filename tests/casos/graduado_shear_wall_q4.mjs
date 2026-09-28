/**
 * Ejemplo graduado `shear-wall-q4` (muro de corte en shells Q4) — ver
 * docs/GRADUAR_UN_EJEMPLO.md.
 *
 * Construye el ExampleDef con sus valores por defecto (estados falsos, como en
 * `tests/casos/solidos_visor.mjs` sección 5) y comprueba: cuenta de nudos y
 * elementos, ausencia de NaN en la deformada, equilibrio ΣR+ΣF=0 en X/Y/Z y el
 * benchmark que traía el panel viejo (`shear-wall-q4/main.ts`, hasta el
 * 28-sep-2026): |Ux| del centro de la fila superior contra OpenSees TCL,
 * SAP2000 y ETABS, con el mismo límite de "aceptable" que usaba ese panel
 * (< 5 %, el punto donde pasaba de amarillo a rojo — ✗ ALGUNO FALLA).
 */
import { empaquetar, R } from "../lib/bundle.mjs";

export const nombre = "graduado-shear-wall-q4";
export const descripcion = "ejemplo graduado shear-wall-q4: cuenta, sin NaN, equilibrio y Ux vs OpenSees/SAP2000/ETABS";

const LIMITE_BENCHMARK = 5; // el panel viejo: <5% "aceptable", >=5% "FALLA"

export async function correr() {
  const v = await empaquetar(`
    export { shearWallQ4, mallaMuroCorteQ4, REF_OPENSEES, REF_SAP2000, REF_ETABS }
      from "${R}/examples/src/shear-wall-q4/shearWallQ4";
  `, "graduado-shear-wall-q4");
  const filas = [];

  const ex = v.shearWallQ4;
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
  // del total de carga aplicada (las componentes de momento no se comparan: el
  // equilibrio de momentos depende de brazos de palanca, no solo de la suma de
  // las reacciones de momento).
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

  // Benchmark del panel viejo: |Ux| en el centro de la fila superior.
  const m = v.mallaMuroCorteQ4(params);
  const def = defs.get(m.topCenter);
  const ux = Math.abs(def ? def[0] : 0);
  const refs = [
    ["OpenSees TCL", v.REF_OPENSEES],
    ["SAP2000", v.REF_SAP2000],
    ["ETABS", v.REF_ETABS],
  ];
  for (const [nombreRef, ref] of refs) {
    const err = Math.abs(ux - ref) / ref * 100;
    filas.push({
      que: `Ux vs ${nombreRef}`, medido: err, limite: LIMITE_BENCHMARK,
      ok: err <= LIMITE_BENCHMARK,
      detalle: `${ux.toExponential(4)} m vs ${ref.toExponential(3)} m`,
    });
  }

  // La malla pura exportada es la misma que usa build() (mismo módulo, mismo import).
  filas.push({
    que: "malla pura == la que arma build()", crudo: true,
    medido: `${m.nodes.length} nudos`, limite: `${nNodes} nudos`,
    ok: m.nodes.length === nNodes,
  });

  return filas;
}
