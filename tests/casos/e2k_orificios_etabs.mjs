/**
 * Importar un .e2k ESCRITO POR ETABS y calcularlo (1-oct-2026). Modelo SINTÉTICO armado dentro de ETABS 22
 * por la OAPI (validation/e2k-orificios/etabs_ref_orificios.py), exportado con SU exportador y analizado
 * por ETABS (juez): 3 plantas de acero, losa Shell-Thin con diafragma D1 y malla AUTOMESH en las vigas,
 * ORIFICIOS (uno dentro de la losa en las 3 plantas y otro tocando el borde solo en la planta 2), vigas
 * secundarias articuladas (`RELEASE "PINNED"`) que nacen a media luz de las principales, brazos rígidos
 * automáticos, fuente de masa desde las CARGAS (Dead 1 + Live 0.25) y sismo «User Coefficient» ±ecc.
 *
 * Lo mide por la MISMA tubería que «📥 Importar E2K» de la app: `e2kAHeks` → `.heks` → `cliModeler`.
 *   - reacción en la base (Fx Fy Fz y Mz) de Dead, Live, SEx y SEy        0.001 %
 *   - masa de la fuente (AssembledJointMass U1)                             0.001 %
 *   - ninguna celda de losa ni ningún nudo DENTRO de un orificio
 *   - periodos 1-3                                                         ≤ 0.5 % (la malla de la losa no es nudo a nudo la de ETABS)
 */
import { readFileSync, existsSync } from "node:fs";
import { empaquetar, R } from "../lib/bundle.mjs";

export const nombre = "e2k-orificios";
export const descripcion = "e2k de ETABS con orificios, diafragma, fuente de masa por cargas y sismo por coeficiente vs ETABS";

const V = `${R}/validation/e2k-orificios`;

export async function correr() {
  if (!existsSync(`${V}/ref_orificios_etabs.json`) || !existsSync(`${V}/sintetico_etabs.e2k`))
    return [{ que: "faltan sintetico_etabs.e2k / ref_orificios_etabs.json", medido: 1, limite: 0, ok: false, detalle: "python etabs_ref_orificios.py" }];
  const ref = JSON.parse(readFileSync(`${V}/ref_orificios_etabs.json`, "utf-8"));
  const m = await empaquetar(`export { e2kAHeks } from "${R}/examples/src/shared/e2kAHeks";\n` +
    `export { cliModeler } from "${R}/examples/src/cli-modeler/cliModeler";\n`, "e2k-orificios");
  const lg = console.log, inf = console.info; console.log = () => {}; console.info = () => {};
  let r;
  try { r = m.e2kAHeks(readFileSync(`${V}/sintetico_etabs.e2k`, "latin1"), "sintetico_etabs.e2k"); } finally { console.log = lg; console.info = inf; }
  globalThis.window = globalThis;
  const st = (v) => ({ val: v });
  const resolver = (factores) => {
    globalThis.__hekatanCliScript = r.heks;
    globalThis.__hekatanFactoresPatron = factores;
    const s = { nodes: st([]), elements: st([]), nodeInputs: st({}), elementInputs: st({}), deformOutputs: st({}), analyzeOutputs: st({}), objects3D: st([]) };
    console.log = () => {}; try { m.cliModeler.build({}, s); } finally { console.log = lg; }
    return s;
  };
  const base = (s) => {
    const b = [0, 0, 0, 0, 0, 0];
    for (const [n, v] of s.deformOutputs.val?.reactions ?? []) {
      const p = s.nodes.val[n];
      for (let k = 0; k < 6; k++) b[k] += v[k] ?? 0;
      b[3] += p[1] * v[2] - p[2] * v[1]; b[4] += p[2] * v[0] - p[0] * v[2]; b[5] += p[0] * v[1] - p[1] * v[0];
    }
    return b;
  };
  const filas = [], fila = (que, medido, limite, detalle) => filas.push({ que, medido, limite, ok: medido <= limite, detalle });
  const pct = (a, b) => 100 * Math.abs(a - b) / Math.max(Math.abs(b), 1e-9);

  for (const [pat, comps] of [["Dead", [2]], ["Live", [2]], ["SEx", [0, 5]], ["SEy", [1, 5]]]) {
    const h = base(resolver({ [pat]: 1 })), e = ref.base[pat];
    for (const k of comps)
      fila(`${pat}: ${["Fx", "Fy", "Fz", "Mx", "My", "Mz"][k]} en la base vs ETABS (%)`, pct(h[k], e[k]), 1e-3, `${h[k].toFixed(3)} / ${e[k].toFixed(3)}`);
  }
  const s = resolver({ Dead: 1 });
  const masa = [...(s.nodeInputs.val.masses ?? new Map()).values()].reduce((a, b) => a + b, 0);
  fila("masa de la fuente (Dead + 0.25 Live) vs ETABS (%)", pct(masa, ref.masa_U1), 1e-3, `${masa.toFixed(4)} / ${ref.masa_U1.toFixed(4)} t`);
  fila("orificios recortados en las losas (A1 × 3 plantas + A2 en la 2)", Math.abs((r.modelo.analisis?.orificios.recortes ?? 0) - 4), 0,
       `${r.modelo.analisis?.orificios.recortes ?? 0} de 4`);

  // nada DENTRO de un orificio: ni el centro de una celda ni un nudo
  const ori = [{ x: [7, 8.5], y: [1.5, 3.5], z: [3, 6, 9] }, { x: [1, 2.5], y: [8.5, 10], z: [6] }];
  const dentro = (p) => ori.some((o) => o.z.some((z) => Math.abs(p[2] - z) < 1e-6) &&
    p[0] > o.x[0] + 1e-6 && p[0] < o.x[1] - 1e-6 && p[1] > o.y[0] + 1e-6 && p[1] < o.y[1] - 1e-6);
  const N = s.nodes.val;
  let celdas = 0, nudos = 0;
  s.elements.val.forEach((el) => {
    if (el.length < 3) return;
    const c = [0, 1, 2].map((k) => el.reduce((a, n) => a + N[n][k], 0) / el.length);
    if (dentro(c)) celdas++;
  });
  N.forEach((p) => { if (dentro(p)) nudos++; });
  fila("celdas de losa dentro de un orificio", celdas, 0, `${s.elements.val.filter((e) => e.length > 2).length} celdas en total`);
  fila("nudos dentro de un orificio", nudos, 0, `${N.length} nudos`);

  let modal = null;
  globalThis.__hekatanCliModalModes = "6";
  console.log = () => {}; try { m.cliModeler.runModal({}, s, { render: (o) => { modal = o; } }); } finally { console.log = lg; }
  for (let i = 0; i < 3; i++) {
    const T = 1 / modal.frequencies[i], Te = ref.modos[i].T;
    fila(`modo ${i + 1}: periodo vs ETABS (%)`, pct(T, Te), 0.5, `${T.toFixed(4)} / ${Te.toFixed(4)} s (malla de losa propia)`);
  }
  return filas;
}
