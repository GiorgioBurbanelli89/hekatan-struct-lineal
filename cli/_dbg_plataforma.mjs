// ¿Por qué la plataforma mallada se ve vertical? Se mira la ORIENTACIÓN real de las
// cáscaras que se crean (su normal) y cómo queda la cámara, con capturas.
//   node cli/_dbg_plataforma.mjs
import puppeteer from "puppeteer";
import { readFileSync, existsSync, statSync, mkdirSync } from "fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "shots", "plataforma"); mkdirSync(OUT, { recursive: true });
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
const MIME = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css", ".wasm":"application/wasm", ".json":"application/json", ".svg":"image/svg+xml", ".png":"image/png", ".ico":"image/x-icon", ".woff2":"font/woff2" };
const srv = createServer((req, res) => {
  let p = decodeURIComponent((req.url || "/").split("?")[0]);
  if (p.startsWith(BASE)) p = p.slice(BASE.length - 1);
  let f = join(raiz, p);
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
  if (!existsSync(f)) { res.writeHead(404); return res.end("404"); }
  res.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" });
  res.end(readFileSync(f));
});
await new Promise((r) => srv.listen(4746, r));
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage();
await pag.setViewport({ width: 1280, height: 720 });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
await pag.goto(`http://localhost:4746${BASE}workspace/?t=new-blank`, { waitUntil: "networkidle2", timeout: 180000 });
await espera(6000);
await pag.evaluate(() => document.getElementById("hk-ribbon-guia")?.remove());

// la orientación de cada cáscara: su normal, y si es horizontal o vertical
const orientaciones = () => pag.evaluate(() => {
  const st = (window).__hekatanStates;
  const N = st?.nodes?.val || [], E = st?.elements?.val || [];
  const cuenta = { horizontal: 0, vertical: 0, inclinada: 0 };
  const muestras = [];
  for (const e of E) {
    if (e.length !== 4 && e.length !== 3) continue;
    const P = e.map((i) => N[i]);
    const u = [0,1,2].map((k) => P[2][k] - P[0][k]);
    const v = [0,1,2].map((k) => (P[3] ? P[3][k] : P[1][k]) - P[1][k]);
    const n = [u[1]*v[2]-u[2]*v[1], u[2]*v[0]-u[0]*v[2], u[0]*v[1]-u[1]*v[0]];
    const m = Math.hypot(...n) || 1;
    const nz = Math.abs(n[2] / m);
    const clase = nz > 0.95 ? "horizontal" : nz < 0.05 ? "vertical" : "inclinada";
    cuenta[clase]++;
    if (muestras.length < 3) muestras.push({ clase, nz: +nz.toFixed(3), pts: P.map((q) => q.map((c) => +c.toFixed(2))) });
  }
  const cam = document.querySelector("#viewer").__ctx.camera;
  return { nudos: N.length, cascaras: E.filter((e) => e.length > 2).length, ...cuenta, muestras,
           camara: { orto: !!cam.isOrthographicCamera, pos: [cam.position.x, cam.position.y, cam.position.z].map((q) => +q.toFixed(1)), up: [cam.up.x, cam.up.y, cam.up.z] } };
});

// LOSA dibujada por comando, en el plano XY (planta)
const cmd = async (txt) => {
  await pag.evaluate(() => { const i = document.getElementById("hk3-cmd-input"); if (i) i.value = ""; });
  await pag.focus("#hk3-cmd-input");
  await pag.type("#hk3-cmd-input", txt, { delay: 12 });
  await pag.keyboard.press("Enter");
  await espera(450);
};
await cmd("lo");
for (const p of ["0,0,0", "6,0,0", "6,5,0", "0,5,0"]) await cmd(p);
await pag.keyboard.press("Escape"); await espera(800);
console.log("LOSA por comando:", JSON.stringify(await orientaciones()).slice(0, 600));
await pag.screenshot({ path: join(OUT, "03_losa.png") });
// y el estado del PLANO DE TRABAJO
console.log("plano de trabajo:", await pag.evaluate(() => ({
  barra: document.querySelector("#hk-cad-estado, #hk-status-plano")?.textContent?.trim()?.slice(0, 40),
  pie: [...document.querySelectorAll("div")].map((d) => d.textContent).filter((t) => t && /Plano [XYZ]/.test(t)).slice(-1)[0]?.slice(0, 30),
  wp: (window).__hekatanCadState?.get?.()?.plane ?? (window).__hekatanCadState?.get?.()?.workPlane,
})));
await nav.close(); srv.close();
