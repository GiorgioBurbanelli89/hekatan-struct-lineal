/**
 * Brazos rígidos automáticos en la APP: abre la plantilla con RZ = 0 y con RZ = 1 (enlace `&p=` del
 * botón Compartir) y lee lo que quedó en el modelo: número de barras con brazo, un brazo de viga y uno
 * de columna, y el desplazamiento maximo. Con RZ = 1 el desplazamiento baja.
 *
 *   node cli/ctl_brazos_rz.mjs [--base URL]      (defecto: el público)
 */
import puppeteer from "puppeteer";

const args = process.argv.slice(2);
const i = args.indexOf("--base");
const BASE = i >= 0 ? args[i + 1] : "https://giorgioburbanelli89.github.io/hekatan-struct-lineal";
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");

const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const filas = [];
for (const [nombre, p] of [["sin brazos (SAP2000)", { offsets: 0 }], ["ETABS, RZ = 0", { rz: 0 }], ["ETABS, RZ = 1", { rz: 1 }]]) {
  const pag = await nav.newPage();
  await pag.goto(`${BASE}/workspace/?t=plantillas&p=${b64(p)}`, { waitUntil: "networkidle2", timeout: 120000 });
  await new Promise((r) => setTimeout(r, 4000));
  const r = await pag.evaluate(() => {
    const st = window.__hekatanStates;
    const eo = st?.elementInputs?.val?.endOffsets;
    const nodes = st?.nodes?.val ?? [], els = st?.elements?.val ?? [];
    let viga = null, col = null;
    eo?.forEach((v, e) => {
      const [a, b] = els[e]; const vert = Math.abs(nodes[b][2] - nodes[a][2]) > 1e-6;
      if (vert && !col) col = v; if (!vert && !viga) viga = v;
    });
    let uMax = 0;
    st?.deformOutputs?.val?.deformations?.forEach((d) => { uMax = Math.max(uMax, Math.hypot(d[0], d[1], d[2])); });
    return { n: eo ? eo.size : 0, viga, col, uMax };
  });
  filas.push({ nombre, ...r });
  await pag.close();
}
await nav.close();
const f = (v) => (v ? v.map((x) => +x.toFixed(3)).join(" / ") : "—");
for (const r of filas) console.log(`${r.nombre.padEnd(22)} barras con brazo ${String(r.n).padStart(4)} · viga ${f(r.viga).padEnd(16)} · columna ${f(r.col).padEnd(16)} · u máx ${(r.uMax * 1000).toFixed(4)} mm`);
const [sin, rz0, rz1] = filas;
// (RZ = 0 contra sin brazos NO es igual: con brazos de ETABS la viga no pesa el tramo dentro de la columna)
const ok = rz0.n > 0 && rz1.n === rz0.n && rz1.uMax < rz0.uMax && sin.n === 0;
console.log(ok ? "OK: brazos puestos, RZ = 1 rigidiza, SAP2000 sin brazos" : "FALLA");
process.exit(ok ? 0 : 1);
