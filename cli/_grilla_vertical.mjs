/**
 * GRILLA AUXILIAR VERTICAL: un alzado A UNA DISTANCIA, no por el origen.
 *
 * Jorge (16-sep-2026, con la captura del pórtico dibujado en el aire): «necesito
 * saber cómo al hacer réplica, o cómo se coloca la grilla auxiliar a cierta
 * distancia». En alzado la rejilla pasaba por Y = 0 y no había forma de llevarla
 * al pórtico que tocaba.
 *
 * Se mide, con el ratón:
 *   1. vista Frente (plano XZ) y la casilla pasa a pedir Y (no la cota Z);
 *   2. Y = 6 + Enter → el plano de trabajo se va a Y = 6 y la vista no salta;
 *   3. lo que dibujes cae en y = 6;
 *   4. ▦+ deja esa grilla puesta; vuelves a Y = 0 y la de 6 sigue ahí;
 *   5. el OSNAP engancha a un cruce de la grilla de Y = 6 desde el plano Y = 0.
 *
 *   node cli/_grilla_vertical.mjs
 */
import puppeteer from "puppeteer";
import fs from "node:fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "shots", "grilla_vertical");
fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
const PUERTO = 4777;
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".wasm": "application/wasm", ".json": "application/json", ".svg": "image/svg+xml",
  ".png": "image/png", ".ico": "image/x-icon", ".woff2": "font/woff2" };
const srv = createServer((req, res) => {
  let p = decodeURIComponent((req.url || "/").split("?")[0]);
  if (p.startsWith(BASE)) p = p.slice(BASE.length - 1);
  let f = join(raiz, p);
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = join(f, "index.html");
  if (!fs.existsSync(f)) { res.writeHead(404); return res.end("404"); }
  res.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" });
  res.end(fs.readFileSync(f));
});
await new Promise((r) => srv.listen(PUERTO, r));
const nav = await puppeteer.launch({ headless: "new",
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1400, height: 880 });
const err = []; pag.on("pageerror", (e) => err.push(String(e).slice(0, 160)));
const esp = (m) => new Promise((r) => setTimeout(r, m));
const fallos = [];
const ok = (c, q, d = "") => { console.log((c ? "  OK  " : "  --  ") + q + (d ? "  |  " + d : "")); if (!c) fallos.push(q); };

await pag.goto(`http://localhost:${PUERTO}${BASE}workspace/?t=new-blank`, { waitUntil: "networkidle2", timeout: 180000 });
await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 });
await esp(5000);
await pag.evaluate(() => document.getElementById("hk-ribbon-guia")?.remove());
for (const id of ["#hk-settings-toggle", "#hk-pane-toggle"]) {
  const b = await pag.evaluate((s) => { const e = document.querySelector(s); if (!e) return null;
    const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, id);
  if (b) { await pag.mouse.click(b.x, b.y); await esp(600); }
}
await pag.evaluate(() => { window.__hekatanSnapEnabled = true; });

const centro = (sel, f) => pag.evaluate((sel, f) => {
  const b = [...document.querySelectorAll(sel)].find((e) => e.offsetParent !== null &&
    new RegExp(f).test((e.textContent || "") + " " + (e.title || "")));
  if (!b) return null; const r = b.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, sel, f);
const proy = (P) => pag.evaluate((W) => {
  const v = document.querySelector("#viewer"), cv = v.querySelector("canvas");
  const r = cv.getBoundingClientRect(), cam = v.__ctx.camera; cam.updateMatrixWorld();
  const V = Object.getPrototypeOf(cam.position).constructor;
  const q = new V(W[0], W[1], W[2]).project(cam);
  return { x: (q.x * .5 + .5) * r.width + r.left, y: (-q.y * .5 + .5) * r.height + r.top };
}, P);

const DIST = 6;
// ── 1. vista Frente: el plano de trabajo pasa a XZ ────────────────────────
const bFrente = await centro("#hk-ribbon button", "Frente");
await pag.mouse.click(bFrente.x, bFrente.y); await esp(1200);
const plano = await pag.evaluate(() => window.__hekatanCadState?.get?.()?.workPlane);
ok(plano === "xz", "el botón Frente pone el plano de trabajo en XZ", "plano = " + plano);
const rotulo = await pag.evaluate(() => document.getElementById("hk-dist-rotulo")?.textContent || "");
ok(/^Y del plano/.test(rotulo), "y la casilla pasa a pedir la Y (no la cota Z)", rotulo);

// ── 2. poner Y = 6 ────────────────────────────────────────────────────────
const camA = await pag.evaluate(() => { const c = document.querySelector("#viewer").__ctx.camera;
  return [c.position.x, c.position.y, c.position.z].map((q) => +q.toFixed(2)); });
const cz = await pag.evaluate(() => { const i = document.getElementById("hk-dist-plano");
  if (!i) return null; const r = i.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
await pag.mouse.click(cz.x, cz.y, { clickCount: 3 });
await pag.keyboard.type(String(DIST)); await pag.keyboard.press("Enter"); await esp(900);
const wy = await pag.evaluate(() => window.__hekatanCadState?.get?.()?.workY);
ok(Math.abs((wy ?? 0) - DIST) < 1e-6, `el plano de alzado se va a Y = ${DIST}`, "workY = " + wy);
const gt = await pag.evaluate(() => window.__hekatanDrawingGridTarget?.rawVal?.position);
ok(gt && Math.abs(gt[1] - DIST) < 1e-6, "y la rejilla de trabajo se mueve con él", JSON.stringify(gt));
const camB = await pag.evaluate(() => { const c = document.querySelector("#viewer").__ctx.camera;
  return [c.position.x, c.position.y, c.position.z].map((q) => +q.toFixed(2)); });
ok(camA.every((v, i) => Math.abs(v - camB[i]) < 0.02), "sin reencuadrar la vista", camA + " → " + camB);
await pag.screenshot({ path: join(OUT, "01_plano_y6.png") });

// ── 3. lo dibujado cae en y = 6 ───────────────────────────────────────────
const bRect = await centro("#hk-ribbon button", "Rect");
await pag.mouse.click(bRect.x, bRect.y); await esp(600);
for (const P of [[2, DIST, 1], [8, DIST, 5]]) {
  const q = await proy(P); await pag.mouse.move(q.x, q.y, { steps: 4 }); await esp(150);
  await pag.mouse.click(q.x, q.y); await esp(400);
}
await pag.keyboard.press("Escape"); await esp(400);
const pts = await pag.evaluate(() => (window.__hekatanDrawingPoints?.rawVal ?? []).map((p) => p.map((v) => +v.toFixed(2))));
ok(pts.length > 0 && pts.every((p) => Math.abs(p[1] - DIST) < 0.05),
   `lo que dibujas cae en y = ${DIST}`, JSON.stringify(pts));

// ── 4. ▦+ deja la grilla vertical puesta ──────────────────────────────────
const bAux = await centro("#hk-ribbon button", "grilla auxiliar");
await pag.mouse.click(bAux.x, bAux.y); await esp(800);
const aux = await pag.evaluate(() => window.__hekatanPlanosAux ?? []);
ok(aux.some((g) => g.plano === "xz" && Math.abs(g.d - DIST) < 1e-6),
   "▦+ deja la grilla auxiliar VERTICAL", JSON.stringify(aux));
await pag.mouse.click(cz.x, cz.y, { clickCount: 3 });
await pag.keyboard.type("0"); await pag.keyboard.press("Enter"); await esp(900);
const rej = await pag.evaluate(() => { const o = [];
  document.querySelector("#viewer").__ctx.scene.traverse((x) => {
    if (typeof x.name === "string" && x.name.startsWith("hekatan-grid"))
      o.push({ n: x.name.replace("hekatan-grid", "") || "(trabajo)",
               p: [x.position.x, x.position.y, x.position.z].map((v) => +v.toFixed(2)) }); });
  return o; });
console.log("       rejillas: " + JSON.stringify(rej));
ok(rej.some((r) => Math.abs(r.p[1] - DIST) < 0.01), `con el plano en Y = 0, la grilla de Y = ${DIST} SIGUE puesta`);
await pag.screenshot({ path: join(OUT, "02_dos_alzados.png") });

// ── 5. el OSNAP engancha en esa grilla desde el plano Y = 0 ───────────────
// ⚠️ En ALZADO FRONTAL puro esto no se puede ni preguntar: (4, 6, 3) y (4, 0, 3)
// caen en el MISMO píxel, y ahí tiene que ganar el plano de trabajo, que es donde
// vas a dibujar. Se mira en 3D, que es donde los dos puntos se distinguen.
const b3D = await centro("#hk-ribbon button", "3D");
await pag.mouse.click(b3D.x, b3D.y); await esp(1400);
const q = await proy([4, DIST, 3]);
await pag.mouse.move(q.x, q.y, { steps: 6 }); await esp(600);
const os = await pag.evaluate(() => window.__hekatanOsnapUltimo ?? null);
console.log("       osnap: " + JSON.stringify(os));
ok(!!os && Math.abs((os.y ?? 0) - DIST) < 0.05,
   `el OSNAP engancha a la grilla vertical de Y = ${DIST}`, JSON.stringify(os));
await pag.screenshot({ path: join(OUT, "03_osnap_vertical.png") });

ok(err.length === 0, "sin errores de página", err.slice(0, 2).join(" | "));
await nav.close(); srv.close();
console.log(fallos.length ? "\n" + fallos.length + " FALLO(S)" : "\nTodo correcto");
process.exit(fallos.length ? 1 : 0);
