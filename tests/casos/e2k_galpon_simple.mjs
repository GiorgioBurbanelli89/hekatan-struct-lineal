/**
 * E2K: GALPON SENCILLO contra ETABS 22 (OAPI): 3 columnas por lado (tubo 200x6), VP continua en y=0 e y=6, 13 correas 1G ARTICULADAS
 * (RELEASE TI M2I M2J M3I M3J) cada 1 m, cubierta membrana «Cubierta metalica» (ONEWAYLOADDIST) de 12 paños de 1×6 m. Generador:
 * `tests/datos/e2k_galpon_simple_genera_etabs.py` (usa galpon1.EDB del mercado; python simple.py NOMBRE [--slope 0] [--ang 90] [--corte]).
 *  - plana : cubierta horizontal (pendiente 0)        - rot90 : lo mismo con la losa girada 90° (reparte a las VP, no a las correas)
 *  - corte : y=6 empotrada (nudos de corte), sin columnas en y=6; cargas laterales en y=0.
 * Causas del importador halladas aquí (cada una con su fila):
 *   1. EMPATE en el reparto de la losa en una dirección (la muestra central caía sobre la bisectriz y ganaba la primera correa:
 *      4.893 / 4.862 kN en columnas simétricas contra 4.875 de ETABS).
 *   2. BRAZO AUTOMÁTICO de columna REDONDA: B = 0 en un tubo, así que las vigas que llegan en el sentido Y no recibían brazo.
 *   3. CORREA ARTICULADA CON BRAZO: ETABS pone la rótula en la CARA del brazo (luz libre 5.8 m) y su reacción R actúa a 0.1 m del eje
 *      del pilar: le mete el momento R·0.1 (Fy de las bases ±0.025 kN; Hekatan daba 0.000).
 */
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { empaquetar, R } from "../lib/bundle.mjs";
import { resolverHeks } from "../lib/heks.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
export const nombre = "e2k-galpon-simple";
export const descripcion = "e2k: galpon sencillo vs ETABS 22 (reparto en una direccion, brazo de columna redonda, correa articulada con brazo, malla de la membrana)";

export async function correr() {
  const mod = await empaquetar(`export { e2kAHeks } from "${R}/examples/src/shared/e2kAHeks";\n`, "e2k-galpon-simple");
  const key = (p) => p.map((v) => Math.round(v * 1000)).join("|");
  const dir = mkdtempSync(join(tmpdir(), "galpon-simple-"));
  const filas = [];
  const silencio = async (f) => {
    const l = console.log, w = console.warn, e = console.error, i = console.info; console.log = () => {}; console.warn = () => {}; console.error = () => {}; console.info = () => {};
    try { return await f(); } finally { console.log = l; console.warn = w; console.error = e; console.info = i; }
  };
  const resolver = async (nom, opc, pat) => {
    const ref = JSON.parse(readFileSync(join(AQUI, "..", "datos", `e2k_galpon_simple_${nom}_ref.json`), "utf-8"));
    const res = await silencio(() => mod.e2kAHeks(readFileSync(join(AQUI, "..", "datos", `e2k_galpon_simple_${nom}.e2k`), "latin1"), `${nom}.e2k`, opc));
    const fh = join(dir, `${nom}_${opc.tamMembrana ?? 0}.heks`); writeFileSync(fh, res.heks);
    globalThis.__hekatanFactoresPatron = { [pat]: 1 };
    const s = await silencio(() => resolverHeks(fh));
    const idx = new Map(s.nodes.map((p, i) => [key(p), i]));
    const U = s.deformOutputs.deformations, Rn = s.deformOutputs.reactions;
    const reac = (k) => { let sq = 0, sr = 0; for (const [nm, v] of Object.entries(ref.JointReact[pat])) { const h = Rn?.get(idx.get(key(ref.pts[nm]))) ?? [0, 0, 0]; sq += (h[k] - v[k]) ** 2; sr += v[k] ** 2; } return 100 * Math.sqrt(sq / (sr || 1e-30)); };
    const desp = (k) => { let sq = 0, sr = 0; for (const [nm, v] of Object.entries(ref.JointDispl[pat])) { const u = U.get(idx.get(key(ref.pts[nm]))) ?? [0, 0, 0]; sq += (u[k] - v[k]) ** 2; sr += v[k] ** 2; } return 100 * Math.sqrt(sq / (sr || 1e-30)); };
    return { reac, desp, Rn, idx, ref };
  };
  const fila = (que, medido, limite, ok, detalle = "") => filas.push({ que, crudo: true, medido, limite, ok, detalle });

  // plana: reacciones de las 6 columnas
  for (const pat of ["Dead", "Live"]) {
    const r = await resolver("plana", {}, pat);
    fila(`plana ${pat}: reaccion Fz de las columnas (rms rel)`, `${r.reac(2).toFixed(4)} %`, "<= 0.05 %", r.reac(2) <= 0.05, "antes 0.1 %: 4.893 / 4.862 kN en columnas simétricas (empate) contra 4.875 de ETABS");
    fila(`plana ${pat}: reaccion Fy de las columnas (rms rel)`, `${r.reac(1).toFixed(2)} %`, "<= 5 %", r.reac(1) <= 5, "antes 100 % (Fy = 0.000 contra ±0.025/±0.050 kN): falta el momento R·0.1 de las correas en la cara del brazo");
    fila(`plana ${pat}: Uz rms rel`, `${r.desp(2).toFixed(3)} %`, "<= 0.1 %", r.desp(2) <= 0.1);
  }
  { // simetria exacta del reparto: las columnas de x = 0 y x = 12 reciben lo mismo
    const r = await resolver("plana", {}, "Live"), f = (x, y) => r.Rn.get(r.idx.get(key([x, y, 0])))[2];
    const d = 100 * Math.abs(f(0, 0) - f(12, 0)) / f(0, 0);
    fila("plana Live: columnas x=0 y x=12 simetricas (Fz)", `${f(0, 0).toFixed(4)} / ${f(12, 0).toFixed(4)} kN (${d.toFixed(4)} %)`, "<= 0.005 %", d <= 0.005, "ETABS 4.8752 / 4.8752");
  }
  { const r = await resolver("plana", {}, "LATX");
    fila("plana LATX: reaccion Fx de las columnas (rms rel)", `${r.reac(0).toFixed(3)} %`, "<= 1 %", r.reac(0) <= 1, "cortante por la membrana de y=6 a y=0 (ETABS -1.043 / -3.242 kN)"); }

  // rot90: la losa girada reparte a las VP (viga en X) y no a las correas
  for (const pat of ["Dead", "Live"]) {
    const r = await resolver("rot90", {}, pat);
    fila(`rot90 ${pat}: Uz rms rel (losa girada 90°)`, `${r.desp(2).toFixed(3)} %`, "<= 0.1 %", r.desp(2) <= 0.1, "con la direccion sin girar contra la referencia girada: 0.7-0.95 %");
    fila(`rot90 ${pat}: Uy rms rel`, `${r.desp(1).toFixed(3)} %`, "<= 1 %", r.desp(1) <= 1, "sin girar contra la referencia girada: 130-210 %");
    fila(`rot90 ${pat}: Fz de las columnas rms rel`, `${r.reac(2).toFixed(4)} %`, "<= 0.05 %", r.reac(2) <= 0.05);
  }

  // corte: nudos empotrados en y=6; un solo Q4 por paño casa con ETABS, subdividir a 1.25 m EMPEORA (no converge a ETABS)
  const c0 = await resolver("corte", {}, "Live"), c1 = await resolver("corte", { tamMembrana: 1.25 }, "Live");
  fila("corte Live: reaccion Fy de los nudos de corte (1 Q4 por paño)", `${c0.reac(1).toFixed(2)} %`, "<= 5 %", c0.reac(1) <= 5, "ETABS 0.0185 kN en (6,6): 1 Q4 da 0.0181");
  fila("corte Live: reaccion Fx de los nudos de corte (1 Q4 por paño)", `${c0.reac(0).toFixed(2)} %`, "<= 6 %", c0.reac(0) <= 6);
  fila("corte Live: subdividir la membrana a 1.25 m empeora las reacciones de corte (documenta, no es un objetivo)", `Fy ${c1.reac(1).toFixed(1)} % > ${c0.reac(1).toFixed(1)} %`, "mayor que con 1 Q4",
    c1.reac(1) > c0.reac(1), "en (6,6) el signo se invierte: ETABS +0.0185, 1 Q4 +0.0181, 1.25 m -0.0134 kN");
  { const l0 = await resolver("corte", {}, "LATX"), l1 = await resolver("corte", { tamMembrana: 1.25 }, "LATX");
    fila("corte LATX: reaccion Fx de corte (cortante de la membrana), 1 Q4 mejor que 1.25 m", `${l0.reac(0).toFixed(1)} % < ${l1.reac(0).toFixed(1)} %`, "1 Q4 menor", l0.reac(0) < l1.reac(0), "ETABS reparte el cortante casi uniforme (-1.137 en la esquina); mallas finas concentran"); }
  return filas;
}
