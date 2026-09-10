/**
 * Las VISTAS dicen su plano, y las REFERENCIAS se eligen de una lista.
 *
 *  · Cada botón de vista lleva su plano de trabajo (XY / XZ / YZ): la vista no es
 *    solo mirar desde otro lado, decide DÓNDE CAE EL CLIC.
 *  · Clic derecho sobre «OSNAP F3» abre el cuadro de referencias, como el Object
 *    Snap Settings de AutoCAD o la lista de Snaps de Revit.
 *
 *   node cli/ctl_vistas_y_osnap.mjs            (local)
 *   node cli/ctl_vistas_y_osnap.mjs publico
 */
import puppeteer from "puppeteer";
import { readFileSync, existsSync, statSync, mkdirSync } from "fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUB = process.argv[2] === "publico";
const OUT = join(__dirname, "shots", "napkin"); mkdirSync(OUT, { recursive: true });
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
const PUERTO = 4774;
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
  ? "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=new-blank"
  : `http://localhost:${PUERTO}${BASE}workspace/?t=new-blank`;
const nav = await puppeteer.launch({ headless: "new",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage();
await pag.setViewport({ width: 1280, height: 800 });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const fallos = [];
const ok = (c, q, d = "") => { console.log(`${c ? "  ✓" : "  ✗"} ${q}${d ? "  —  " + d : ""}`); if (!c) fallos.push(q); };
await pag.goto(URL_, { waitUntil: "networkidle2", timeout: 180000 });
await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 });
await espera(5000);
await pag.evaluate(() => {
  document.getElementById("hk-ribbon-guia")?.remove();
  const c = document.querySelector("#viewer").__ctx.controls;
  if (c) { c.enableDamping = false; c.update?.(); }
});

// ── 1. cada botón de vista dice su plano ───────────────────────────────────
const botones = await pag.evaluate(() => [...document.querySelectorAll("#hk-ribbon button")]
  .map((b) => (b.textContent || "").replace(/\s+/g, "").trim())
  .filter((t) => /Planta|Frente|Lado|3D/.test(t)));
ok(botones.some((t) => /PlantaXY/.test(t)), "«Planta» dice XY", botones[0]);
ok(botones.some((t) => /FrenteXZ/.test(t)), "«Frente» dice XZ", botones[1]);
ok(botones.some((t) => /LadoYZ/.test(t)), "«Lado» dice YZ", botones[2]);

// ── 2. y la rejilla se pone en ESE plano ───────────────────────────────────
const plano = () => pag.evaluate(() => {
  const v = document.querySelector("#viewer");
  let g = null; v.__ctx.scene.traverse((o) => { if (o.name === "hekatan-grid") g = o; });
  g?.updateMatrixWorld();
  const e = g.matrixWorld.elements;
  return { n: [e[8], e[9], e[10]].map((q) => +q.toFixed(2)),
           work: window.__hekatanCadState?.get?.()?.workPlane,
           barra: document.getElementById("hk-statusbar-plano")?.textContent };
});
const vista = async (i) => { await pag.evaluate((k) => window.__hekatanRibbon?.vista?.(k), i); await espera(1100); };
await vista(1); const fr = await plano();
ok(Math.abs(fr.n[1]) > 0.9 && fr.work === "xz" && /XZ/.test(fr.barra || ""),
   "en Frente la rejilla se pone en X-Z, y la barra lo dice", JSON.stringify(fr));
await vista(2); const la = await plano();
ok(Math.abs(la.n[0]) > 0.9 && la.work === "yz" && /YZ/.test(la.barra || ""),
   "en Lado, en Y-Z", JSON.stringify(la));
await vista(0); const pl = await plano();
ok(Math.abs(pl.n[2]) > 0.9 && pl.work === "xy" && /XY/.test(pl.barra || ""),
   "y en Planta vuelve al suelo, X-Y", JSON.stringify(pl));

// ── 3. el cuadro de referencias, con el clic derecho sobre OSNAP ───────────
const bOsnap = await pag.evaluate(() => {
  const b = [...document.querySelectorAll("#hk-statusbar button")]
    .find((e) => (e.textContent || "").includes("OSNAP"));
  if (!b) return null;
  const r = b.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2, txt: b.textContent };
});
ok(!!bOsnap && /▾/.test(bOsnap.txt), "el botón OSNAP anuncia que tiene lista", bOsnap?.txt);
await pag.mouse.click(bOsnap.x, bOsnap.y, { button: "right" });
await espera(500);
const cuadro = () => pag.evaluate(() => {
  const c = document.getElementById("hk-osnap-cuadro");
  if (!c || c.style.display === "none") return null;
  return { filas: [...c.querySelectorAll("label")].map((l) => l.textContent.trim()),
           marcadas: [...c.querySelectorAll("input")].filter((i) => i.checked).length };
});
const c1 = await cuadro();
ok(!!c1, "el clic derecho abre el cuadro de referencias");
ok(c1 && c1.filas.length >= 10, "están todas las referencias", `${c1?.filas.length}: ${(c1?.filas || []).slice(0, 4).join(" · ")}`);
ok(c1 && /Origen/.test(c1.filas[0]) && c1.filas.some((f) => /Centro/.test(f))
   && c1.filas.some((f) => /Rastreo/.test(f)),
   "incluye Origen, Centro y Rastreo", (c1?.filas || []).join(" · ").slice(0, 80));
await pag.screenshot({ path: join(OUT, PUB ? "osnap_cuadro_publico.png" : "osnap_cuadro_local.png") });

// ── 4. destildar una la APAGA de verdad ───────────────────────────────────
const antes = await pag.evaluate(() => window.__hekatanOsnap?.mid);
await pag.evaluate(() => {
  const c = document.getElementById("hk-osnap-cuadro");
  const fila = [...c.querySelectorAll("label")].find((l) => /Punto medio/.test(l.textContent));
  const chk = fila.querySelector("input");
  chk.checked = !chk.checked;
  chk.dispatchEvent(new Event("change", { bubbles: true }));
});
await espera(300);
const despues = await pag.evaluate(() => window.__hekatanOsnap?.mid);
ok(antes !== despues, "destildar «Punto medio» lo apaga de verdad", `${antes} → ${despues}`);
await pag.keyboard.press("Escape"); await espera(300);
ok(!(await cuadro()), "y Esc cierra el cuadro");
await nav.close(); srv?.close();
console.log(fallos.length ? `\n${fallos.length} FALLO(S)` : `\nTodo correcto (${PUB ? "sitio público" : "local"})`);
process.exit(fallos.length ? 1 : 0);
