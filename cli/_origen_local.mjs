/**
 * ORIGEN LOCAL (SCU): «una posición donde dentro hay otra coordenada».
 *
 * Jorge (16-sep-2026, con el dibujo de los dos trípodes): es lo que quiere para
 * dibujar en 3D. Pones el origen en un punto del modelo y «0,0,0» pasa a ser ESE
 * punto, con su trípode a la vista y la línea de puntos al origen global.
 *
 * Se mide:
 *   1. el botón ⌖ pide el punto y el OSNAP engancha (se pone sobre un nudo);
 *   2. el trípode y la línea al origen aparecen en la escena;
 *   3. teclear «2,0,0» dibuja en ORIGEN + (2,0,0), no en (2,0,0);
 *   4. la rejilla se centra en el origen nuevo;
 *   5. pulsar otra vez vuelve al origen global y las coordenadas son absolutas.
 *
 *   node cli/_origen_local.mjs
 */
import puppeteer from "puppeteer";
import fs from "node:fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "shots", "origen_local");
fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
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
await new Promise((r) => srv.listen(4787, r));
const nav = await puppeteer.launch({ headless: "new",
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1400, height: 880 });
const err = []; pag.on("pageerror", (e) => err.push(String(e).slice(0, 160)));
const esp = (m) => new Promise((r) => setTimeout(r, m));
const fallos = [];
const ok = (c, q, d = "") => { console.log((c ? "  OK  " : "  --  ") + q + (d ? "  |  " + d : "")); if (!c) fallos.push(q); };

await pag.goto(`http://localhost:4787${BASE}workspace/?t=new-blank`, { waitUntil: "networkidle2", timeout: 180000 });
await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 }); await esp(5000);
await pag.evaluate(() => document.getElementById("hk-ribbon-guia")?.remove());
for (const id of ["#hk-settings-toggle", "#hk-pane-toggle"]) {
  const b = await pag.evaluate((s) => { const e = document.querySelector(s); if (!e) return null;
    const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, id);
  if (b) { await pag.mouse.click(b.x, b.y); await esp(600); }
}
await pag.evaluate(() => {
  const v = document.querySelector("#viewer"), c = v.__ctx.camera;
  v.__ctx.controls.target.set(5, 4, 1); c.position.set(22, -19, 14);
  c.lookAt(v.__ctx.controls.target); v.__ctx.controls.update?.(); v.__ctx.render?.();
  window.__hekatanSnapEnabled = true;
});
await esp(600);
const boton = (f) => pag.evaluate((f) => {
  const b = [...document.querySelectorAll("#hk-ribbon button")].find((e) => e.offsetParent !== null &&
    new RegExp(f).test((e.textContent || "") + " " + (e.title || "")));
  if (!b) return null; const r = b.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, f);
const proy = (P) => pag.evaluate((W) => {
  const v = document.querySelector("#viewer"), cv = v.querySelector("canvas");
  const r = cv.getBoundingClientRect(), cam = v.__ctx.camera; cam.updateMatrixWorld();
  const V = Object.getPrototypeOf(cam.position).constructor;
  const q = new V(W[0], W[1], W[2]).project(cam);
  return { x: (q.x * .5 + .5) * r.width + r.left, y: (-q.y * .5 + .5) * r.height + r.top };
}, P);
const pts = () => pag.evaluate(() => (window.__hekatanDrawingPoints?.rawVal ?? []).map((p) => p.map((v) => +v.toFixed(2))));
const teclear = async (txt) => {
  await pag.evaluate(() => { const i = document.getElementById("hk3-cmd-input"); if (i) { i.value = ""; i.focus(); } });
  await pag.keyboard.type(txt, { delay: 25 }); await pag.keyboard.press("Enter"); await esp(500);
};

// ── 1. colocar el origen en un punto (6, 4, 0) ────────────────────────────
const bSCU = await boton("Origen local");
ok(!!bSCU, "está el botón ⌖ de origen local");
await pag.mouse.click(bSCU.x, bSCU.y); await esp(600);
ok(await pag.evaluate(() => window.__hekatanColocandoSCU === true), "pide el punto");
const q = await proy([6, 4, 0]);
await pag.mouse.move(q.x, q.y, { steps: 6 }); await esp(400);
await pag.mouse.click(q.x, q.y); await esp(800);
const O = await pag.evaluate(() => (window.__hekatanSCU ?? []).map((v) => +v.toFixed(2)));
ok(O.length === 3 && Math.abs(O[0] - 6) < 0.6 && Math.abs(O[1] - 4) < 0.6,
   "el origen queda donde tocaste", JSON.stringify(O));

// ── 2. se ve el trípode y la línea al origen global ───────────────────────
const scu = await pag.evaluate(() => {
  let n = null;
  document.querySelector("#viewer").__ctx.scene.traverse((o) => { if (o.name === "hekatan-scu") n = { visible: o.visible, hijos: o.children.length }; });
  return n; });
ok(scu && scu.visible && scu.hijos >= 4, "se dibuja el trípode + la línea al origen global", JSON.stringify(scu));
await pag.screenshot({ path: join(OUT, "01_origen_puesto.png") });

// ── 3. las coordenadas tecleadas son RELATIVAS a él ───────────────────────
await teclear("l");
await teclear("0,0,0");
await teclear("3,0,0");
await pag.keyboard.press("Escape"); await esp(500);
const P = await pts();
console.log("       nudos: " + JSON.stringify(P));
const p0 = P[0] ?? [];
ok(P.length >= 2 && Math.abs(p0[0] - O[0]) < 0.05 && Math.abs(p0[1] - O[1]) < 0.05,
   "«0,0,0» cae en el ORIGEN LOCAL, no en el global", JSON.stringify(p0));
const p1 = P[1] ?? [];
ok(Math.abs(p1[0] - (O[0] + 3)) < 0.05 && Math.abs(p1[1] - O[1]) < 0.05,
   "y «3,0,0» son 3 m DESDE ahí", JSON.stringify(p1));

// ── 4. la rejilla se centra en el origen nuevo ────────────────────────────
const gt = await pag.evaluate(() => (window.__hekatanDrawingGridTarget?.rawVal?.position ?? []).map((v) => +v.toFixed(2)));
ok(Math.abs(gt[0] - O[0]) < 0.05 && Math.abs(gt[1] - O[1]) < 0.05,
   "la rejilla se centra en el origen local", JSON.stringify(gt));

// ── 5. volver al global ───────────────────────────────────────────────────
await pag.mouse.click(bSCU.x, bSCU.y); await esp(700);
const O2 = await pag.evaluate(() => (window.__hekatanSCU ?? []).map((v) => +v.toFixed(2)));
ok(O2.every((v) => Math.abs(v) < 1e-9), "pulsarlo otra vez vuelve al origen global", JSON.stringify(O2));
const vis = await pag.evaluate(() => { let v = null;
  document.querySelector("#viewer").__ctx.scene.traverse((o) => { if (o.name === "hekatan-scu") v = o.visible; });
  return v; });
ok(vis === false, "y el trípode se esconde");
await teclear("l");
await teclear("0,0,0");
await pag.keyboard.press("Escape"); await esp(400);
const P2 = await pts();
const ult = P2.at(-1) ?? [];
ok(Math.hypot(ult[0], ult[1], ult[2]) < 0.05, "ahora «0,0,0» vuelve a ser el origen global", JSON.stringify(ult));
await pag.screenshot({ path: join(OUT, "02_vuelta_global.png") });

ok(err.length === 0, "sin errores de página", err.slice(0, 2).join(" | "));
await nav.close(); srv.close();
console.log(fallos.length ? "\n" + fallos.length + " FALLO(S)" : "\nTodo correcto");
process.exit(fallos.length ? 1 : 0);
