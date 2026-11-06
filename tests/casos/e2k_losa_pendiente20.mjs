/**
 * E2K: regla de los 20 grados de ETABS para la losa en un sentido (ONEWAYLOADDIST) con cubierta inclinada.
 * Complementa e2k_regla_20grados (vano 6x6 existente): este es la pieza B aislada (5 correas con releases, ANG 90 = vano local hacia las correas),
 * con momento en extremos y reacciones; el otro suma cortantes del vano.
 * ETABS 22 (OAPI, `pieza_b_pend.py`): paño inclinado con 5 correas subiendo por la pendiente, 4 franjas, Live 1 kN/m2:
 *   cortante de la correa interior = 1.0 kN con 3, 6, 10, 15, 16, 18, 19, 19.9 grados; 0.0 kN con 20.1 y 25 (la carga va por la linea de
 *   maxima pendiente a las principales, que reciben 0.513 kN).
 * Aqui por la ruta e2k (`e2kParser` `unaDirArea` -> `e2kAHeks` -> .heks con `fixedend` -> solver) con e2k propios, generados por
 * `tests/datos/e2k_losa_pendiente20_genera.mjs` (3, 19.9, 20.1, 25 grados). Comprueba cortante, momento en extremos de correas
 * articuladas (= 0) y suma de reacciones.
 */
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { cargarMod } from "../lib/vano_cmp.mjs";
import { resolverHeks } from "../lib/heks.mjs";
const AQUI = dirname(fileURLToPath(import.meta.url));
export const nombre = "e2k-losa-pendiente20";
export const descripcion = "e2k: losa en un sentido con pendiente: reparte a las correas hasta 19.9 grados y no desde 20.1 (regla de ETABS)";

const silencio = async (f) => { const l = console.log, w = console.warn, e = console.error, i = console.info; console.log = console.warn = console.error = console.info = () => {};
  try { return await f(); } finally { console.log = l; console.warn = w; console.error = e; console.info = i; } };

export async function correr() {
  const mod = await cargarMod();
  const dir = mkdtempSync(join(tmpdir(), "p20-"));
  const filas = [];
  const fila = (que, medido, limite, ok, detalle = "") => filas.push({ que, crudo: true, medido, limite, ok, detalle });
  const f = (x, n = 4) => x.toFixed(n);
  for (const [tag, inc] of [["3", 3], ["19p9", 19.9], ["20p1", 20.1], ["25", 25]]) {
    const txt = readFileSync(join(AQUI, "..", "datos", `e2k_losa_pendiente20_${tag}.e2k`), "latin1");
    const res = await silencio(() => mod.e2kAHeks(txt, `p20_${tag}.e2k`, {}));
    const fh = join(dir, `p20_${tag}.heks`); writeFileSync(fh, res.heks);
    globalThis.__hekatanFactoresPatron = { Live: 1 };
    const s = await silencio(() => resolverHeks(fh));
    // reacciones
    let Rz = 0; const Rn = s.deformOutputs.reactions; s.nodes.forEach((p, i) => { const r = Rn?.get(i); if (r) Rz += r[2]; });
    // correas (extremos a la misma y, distinta x) y principales (misma x)
    const SY = s.analyzeOutputs.shearsY, SZ = s.analyzeOutputs.shearsZ, MY = s.analyzeOutputs.bendingsY, MZ = s.analyzeOutputs.bendingsZ;
    const correas = [], princ = [];
    s.elements.forEach((e, i) => {
      if (e.length !== 2) return; const a = s.nodes[e[0]], b = s.nodes[e[1]], v = (m) => m?.get(i) ?? [0, 0];
      const V = Math.max(Math.hypot(v(SY)[0], v(SZ)[0]), Math.hypot(v(SY)[1], v(SZ)[1]));
      const Mext = Math.max(...[MY, MZ].flatMap((m) => v(m).map(Math.abs)));   // estaciones i y j: extremos
      if (Math.abs(a[1] - b[1]) < 1e-6 && Math.abs(a[0] - b[0]) > 1) correas.push({ y: a[1], V, Mext });
      else if (Math.abs(a[0] - b[0]) < 1e-6) princ.push({ V });
    });
    const interiores = correas.filter((c) => c.y > 0.4 && c.y < 1.6);
    const alto = inc <= 20;   // <= 20 grados: reparte por el eje local a las correas; > 20: por la linea de maxima pendiente a las principales
    const esperado = alto ? 1 / Math.cos(inc * Math.PI / 180) : 0.0;   // ETABS mide 1.0 con su montaje; aqui la franja es de 0.5 m en planta y el vano 4 m: V = w·0.5·(L/cos)/2... ver detalle
    const dev = Math.max(...interiores.map((c) => Math.abs(c.V - esperado)));
    fila(`${inc} gr: cortante de las 3 correas interiores (kN)`, interiores.map((c) => f(c.V, 3)).join(" / "), `${f(esperado, 3)} ± 0.01`, interiores.length === 3 && dev <= 0.01,
      alto ? "ETABS 1.0 (carga por el eje local a las correas)" : "ETABS 0.0 (carga a las principales)");
    const Mmax = Math.max(...interiores.map((c) => c.Mext));
    fila(`${inc} gr: momento en extremos de correas articuladas (kN·m)`, f(Mmax, 4), "<= 0.01", correas.length === 5 && Mmax <= 0.01, "releases T/M2/M3: no transmiten momento al nudo");
    const q = 1 * 2 * 4 / Math.cos(inc * Math.PI / 180);   // 1 kN/m2 sobre la SUPERFICIE: 2 m x (4 m / cos)
    fila(`${inc} gr: suma de reacciones Fz (kN)`, f(Rz, 3), alto ? `${f(q, 3)} ± 0.01 (= carga)` : `8 .. ${f(q, 3)}`, alto ? Math.abs(Rz - q) <= 0.01 : Rz >= 8 - 0.01 && Rz <= q + 0.01,
      alto ? "" : "por la maxima pendiente la carga se toma sobre la proyeccion en planta (8.000); pendiente: unificar con la superficie");
    if (!alto) { const Vp = Math.max(...princ.map((p) => p.V)); fila(`${inc} gr: cortante maximo de las principales (kN)`, f(Vp, 3), "> 0.3 (recibe la carga)", Vp > 0.3, "ETABS 0.513"); }
  }
  return filas;
}
