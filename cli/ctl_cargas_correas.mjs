/**
 * CARGAS EN TODAS LAS CORREAS + VIENTO ⟂ ZINC: importar la Cancha Parque (.s2k de
 * SAP2000) y comprobar que el visor dibuja una flecha en TODOS los nudos cargados,
 * que las 186 correas de 6 m ven su carga (Jorge, 25-sep-2026: «las cargas no tiene
 * repartido en todas las correas») y que el patrón VIENTO actúa PERPENDICULAR al
 * zinc (Jorge: «es un galpón curvo, el viento va perpendicular al zinc»).
 *
 * El bug de las flechas era loads.ts: submuestreaba 582 nudos cargados a 240
 * (160 flechas, 90 correas sin ninguna). Umbral nuevo: SUBMUESTREA_DESDE = 700.
 * El viento: s2kParser rota las filas DesignType=Wind de Gravedad a la normal de
 * la superficie → ΣFx pasa de 0 a −222.862 kN y ΣFz de −1352.591 a −1332.686.
 *
 *   node cli/ctl_cargas_correas.mjs            (build local)
 *   node cli/ctl_cargas_correas.mjs publico    (GitHub Pages)
 */
import puppeteer from "puppeteer";
import { readFileSync, existsSync, statSync, mkdirSync } from "fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUB = process.argv[2] === "publico";
const OUT = join(__dirname, "shots", "cargas_correas"); mkdirSync(OUT, { recursive: true });
const ARCH = "C:/Users/j-b-j/Downloads/Cancha Parque v24.s2k";
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
const PUERTO = 4787;
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".wasm": "application/wasm", ".json": "application/json", ".svg": "image/svg+xml",
  ".png": "image/png", ".ico": "image/x-icon", ".woff2": "font/woff2" };
let srv = null;
if (!PUB) {
  srv = createServer((req, res) => {
    let p = decodeURIComponent((req.url || "/").split("?")[0]);
    if (p.startsWith(BASE)) p = p.slice(BASE.length - 1);
    let f = join(raiz, p);
    if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
    if (!existsSync(f)) { res.writeHead(404); return res.end("404"); }
    res.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" });
    res.end(readFileSync(f));
  });
  await new Promise((r) => srv.listen(PUERTO, r));
}
const URL_ = PUB
  ? "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=edificio-frame-nec"
  : `http://localhost:${PUERTO}${BASE}workspace/?t=edificio-frame-nec`;
const nav = await puppeteer.launch({ headless: "new",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage();
await pag.setViewport({ width: 1400, height: 900 });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const fallos = [];
const ok = (c, q, d = "") => { console.log(`${c ? "  ✓" : "  ✗"} ${q}${d ? "  —  " + d : ""}`); if (!c) fallos.push(q); };
const errores = [];
pag.on("pageerror", (e) => errores.push(String(e).slice(0, 200)));
pag.on("dialog", (d) => { console.log("    aviso: " + d.message().slice(0, 150)); d.accept(); });

if (!existsSync(ARCH)) {
  console.log(`✗ falta el archivo ${ARCH} — corre en la máquina de Jorge`);
  process.exit(1);
}
await pag.goto(URL_, { waitUntil: "networkidle2", timeout: 180000 });
await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 });
await espera(5000);
const pulsarBoton = (texto) => pag.evaluate((t) => {
  const b = [...document.querySelectorAll(".tp-btnv_b")].find((x) => x.textContent.includes(t));
  if (!b) return false;
  const f = b.closest(".tp-fldv"); if (f && f.classList.contains("tp-fldv-cpl")) f.querySelector(":scope > .tp-fldv_b").click();
  b.click(); return true;
}, texto);
const [ch] = await Promise.all([pag.waitForFileChooser({ timeout: 15000 }), pulsarBoton("Importar S2K")]);
await ch.accept([ARCH]);
await pag.waitForFunction(
  () => new URLSearchParams(location.search).get("t") === "csi-importer"
    && (window.__hekatanStates?.nodes?.rawVal?.length ?? 0) > 0,
  { timeout: 120000 });
await espera(8000);
// Las flechas viven de settings.loads; si el ejemplo arranca con ellas off, se encienden.
await pag.evaluate(() => {
  const s = window.__hekatanSettings?.();
  if (s?.loads && !s.loads.val) s.loads.val = true;
});
await espera(2500);

const r = await pag.evaluate(() => {
  const st = window.__hekatanStates;
  const L = st.nodeInputs.rawVal.loads; let F = 0, Fx = 0, Fy = 0;
  for (const v of L.values()) { F += v[2] ?? 0; Fx += v[0] ?? 0; Fy += v[1] ?? 0; }
  const g = document.querySelector("#viewer").__ctx.scene.getObjectByName("loadsGroup");
  const nodosFlecha = [];
  let flechas = 0;
  g?.children.forEach((o) => {
    if (o.type !== "ArrowHelper") return;
    flechas++;
    const n = o.userData?.nudo; if (n) nodosFlecha.push([n[0] ?? n.x, n[1] ?? n.y, n[2] ?? n.z]);
  });
  // correas: barras de L ≈ 6 m; ¿algún extremo lleva flecha? (tol 0.15 m por la deformada)
  const nodes = st.nodes.rawVal, elems = st.elements.rawVal;
  let correas = 0, conFlecha = 0;
  for (const e of elems) {
    if (e.length !== 2) continue;
    const a = nodes[e[0]], b = nodes[e[1]];
    const L = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
    if (Math.abs(L - 6) > 0.05) continue;
    correas++;
    const cerca = (p) => nodosFlecha.some((q) => Math.hypot(q[0] - p[0], q[1] - p[1], q[2] - p[2]) < 0.15);
    if (cerca(a) || cerca(b)) conFlecha++;
  }
  return { nudos: nodes.length, nudosCargados: L.size, fz: +F.toFixed(3),
    fx: +Fx.toFixed(3), fy: +Fy.toFixed(3),
    flechas, nodosConFlecha: nodosFlecha.length, correas, conFlecha };
});
console.log(JSON.stringify(r));
ok(r.nudosCargados === 582 && Math.abs(r.fz - (-1332.686)) < 0.05,
  "las cargas del s2k llegan enteras (582 nudos, ΣFz = −1332.686 kN)",
  `nudosCargados=${r.nudosCargados} ΣFz=${r.fz}`);
ok(Math.abs(r.fx - (-222.862)) < 0.05 && Math.abs(r.fy) < 1e-6,
  "el viento va PERPENDICULAR al zinc: componente horizontal y nada en Y",
  `ΣFx=${r.fx} ΣFy=${r.fy} (antes 0 / 0)`);
ok(r.flechas >= r.nudosCargados * 0.9,
  "hay flecha en prácticamente todos los nudos cargados (sin submuestreo ≤700)",
  `${r.flechas} flechas / ${r.nudosCargados} nudos`);
ok(r.correas === 186 && r.conFlecha === r.correas,
  "TODAS las correas de 6 m ven su carga a la vista",
  `${r.conFlecha}/${r.correas}`);
await pag.screenshot({ path: join(OUT, (PUB ? "pub_" : "") + "cargas_correas.png") });
ok(errores.length === 0, "sin errores de página", errores.join(" | "));
await nav.close(); srv?.close();
console.log(fallos.length ? `\nFALLAN ${fallos.length}` : "\nTODO OK");
process.exit(fallos.length ? 1 : 0);
