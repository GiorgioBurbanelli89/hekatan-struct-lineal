/**
 * El cursor tiene que caer EN el cruce de los ejes de replanteo.
 *
 * No caía: el buscador de referencias solo miraba puntos, polilíneas y líneas
 * auxiliares. Los EJES (la rejilla estilo Revit) no entraban, así que el cursor se
 * limitaba a redondear a múltiplos de `__hekatanSnap2D` (0.5 m de fábrica). Con ejes
 * a 4.60 m o 7.25 m el punto quedaba CERCA del cruce, nunca encima — y eso es lo que
 * se veía en pantalla.
 *
 * Se prueba con cotas que NO son múltiplo de 0.5, que es donde se nota.
 *
 *   node cli/ctl_osnap_ejes.mjs
 */
import puppeteer from "puppeteer";
import { readFileSync, existsSync, statSync, mkdirSync } from "fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
const PUERTO = 4756;
const MIME = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css",
  ".wasm":"application/wasm", ".json":"application/json", ".svg":"image/svg+xml",
  ".png":"image/png", ".ico":"image/x-icon", ".woff2":"font/woff2" };
const srv = createServer((req, res) => {
  let p = decodeURIComponent((req.url || "/").split("?")[0]);
  if (p.startsWith(BASE)) p = p.slice(BASE.length - 1);
  let f = join(raiz, p);
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
  if (!existsSync(f)) { res.writeHead(404); return res.end("404"); }
  res.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" });
  res.end(readFileSync(f));
});
mkdirSync(join(__dirname, "shots"), { recursive: true });
await new Promise((r) => srv.listen(PUERTO, r));
const nav = await puppeteer.launch({ headless: "new",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage();
await pag.setViewport({ width: 1280, height: 720 });
const errores = []; pag.on("pageerror", (e) => errores.push(e.message));
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const fallos = [];
const ok = (cond, que, detalle = "") => {
  console.log(`${cond ? "  ✓" : "  ✗"} ${que}${detalle ? "  —  " + detalle : ""}`);
  if (!cond) fallos.push(que);
};
await pag.goto(`http://localhost:${PUERTO}${BASE}workspace/?t=new-blank`, { waitUntil: "networkidle2", timeout: 180000 });
await espera(6000);
await pag.evaluate(() => document.getElementById("hk-ribbon-guia")?.remove());

// ejes a cotas que NO son múltiplo del paso de rejilla (0.5 m): 4.60 y 7.25
const EJES = [
  { label: "A", start: [0, 0, 0], end: [0, 12, 0] },
  { label: "B", start: [4.6, 0, 0], end: [4.6, 12, 0] },
  { label: "1", start: [-2, 7.25, 0], end: [14, 7.25, 0] },
];
const CRUCE = [4.6, 7.25, 0];        // B con 1
await pag.evaluate((ejes) => {
  const lista = window.__hekatanAxisGrids;
  if (lista) { lista.length = 0; ejes.forEach((e) => lista.push(e)); }
  const niv = window.__hekatanLevels;
  if (niv) { niv.length = 0; niv.push({ label: "N+3.10", z: 3.1 }); }
}, EJES);
ok(await pag.evaluate(() => (window.__hekatanAxisGrids || []).length) === 3,
   "se cargan 3 ejes de replanteo (dos a 4.60 y 7.25, fuera de la rejilla de 0.5)");

const proy = (P) => pag.evaluate(([wx, wy, wz]) => {
  const v = document.querySelector("#viewer"), cv = v.querySelector("canvas");
  const r = cv.getBoundingClientRect(), cam = v.__ctx.camera; cam.updateMatrixWorld();
  const m = cam.projectionMatrix.elements, mv = cam.matrixWorldInverse.elements;
  const tx = mv[0]*wx+mv[4]*wy+mv[8]*wz+mv[12], ty = mv[1]*wx+mv[5]*wy+mv[9]*wz+mv[13];
  const tz = mv[2]*wx+mv[6]*wy+mv[10]*wz+mv[14], tw = mv[3]*wx+mv[7]*wy+mv[11]*wz+mv[15];
  const cx = m[0]*tx+m[4]*ty+m[8]*tz+m[12]*tw, cy = m[1]*tx+m[5]*ty+m[9]*tz+m[13]*tw;
  const cw = m[3]*tx+m[7]*ty+m[11]*tz+m[15]*tw;
  return { x: r.left+(cx/cw+1)/2*r.width, y: r.top+(1-cy/cw)/2*r.height };
}, P);

// el buscador de referencias, llamado directo: es lo que usa el cursor
const refDe = (x, y, z) => pag.evaluate(([px, py, pz]) =>
  window.__hekatanOsnapCompute?.(px, py, pz, 0.6) ?? null, [x, y, z]);

// 1) cerca del cruce de dos ejes → tiene que dar el cruce EXACTO
const r1 = await refDe(CRUCE[0] + 0.28, CRUCE[1] - 0.31, 0);
const d1 = r1 ? Math.hypot(r1.x - CRUCE[0], r1.y - CRUCE[1], r1.z - CRUCE[2]) : Infinity;
ok(d1 < 1e-6, "el cruce de dos EJES es una referencia (Intersección)",
   r1 ? `${r1.type} → (${r1.x}, ${r1.y}, ${r1.z}), error ${d1.toExponential(1)} m` : "no devuelve nada");

// 2) y el cursor de verdad, con el ratón cerca del cruce, cae encima
await pag.evaluate(() => document.querySelector("#viewer")?.__ctx?.render?.());
await pag.evaluate(() => [...document.querySelectorAll("#hk-ribbon button")]
  .find((b) => (b.textContent || "").includes("Planta"))?.click());
await espera(1000);
// ⚠️ NO se encuadra: con el modelo vacío el encuadre deja el cruce fuera del lienzo o
// bajo el ribbon, y el ratón clica el BOTÓN. Se centra la cámara en el cruce a mano.
await pag.evaluate((C) => {
  const v = document.querySelector("#viewer"), c = v.__ctx.camera;
  v.__ctx.controls.target.set(C[0], C[1], C[2]);
  c.position.set(C[0], C[1], C[2] + 40);
  if (c.isOrthographicCamera) { c.zoom = 12; c.updateProjectionMatrix(); }
  c.lookAt(v.__ctx.controls.target); v.__ctx.controls.update?.(); v.__ctx.render?.();
}, CRUCE);
await espera(700);
const sc = await proy(CRUCE);
const tapado = await pag.evaluate(({ x, y }) => {
  const e = document.elementFromPoint(x, y); return e ? e.tagName !== "CANVAS" : true;
}, sc);
ok(!tapado, "el cruce queda sobre el lienzo, no bajo un panel", `(${sc.x.toFixed(0)}, ${sc.y.toFixed(0)})`);
await pag.mouse.move(sc.x + 6, sc.y - 5);      // CERCA, no encima
await espera(500);
const m2 = await pag.evaluate(() => {
  const sm = window.__hekatanSnapMarker;
  return sm?.visible ? [sm.position.x, sm.position.y, sm.position.z] : null;
});
const d2 = m2 ? Math.hypot(m2[0] - CRUCE[0], m2[1] - CRUCE[1], m2[2] - CRUCE[2]) : Infinity;
ok(d2 < 1e-6, "y el CURSOR cae en el cruce, no en el múltiplo de 0.5 más próximo",
   m2 ? `marcador (${m2.map((q) => +q.toFixed(3)).join(", ")}), error ${d2.toExponential(1)} m` : "sin marcador");

// 3) sobre el eje, sin llegar al cruce: el punto cae EN el eje (Cercano)
// «Cercano» viene APAGADO de fábrica, igual que en AutoCAD: se enciende para probarlo.
await pag.evaluate(() => { const o = window.__hekatanOsnap; if (o) o.nea = true; });
const r3 = await refDe(4.6 + 0.22, 2.0, 0);
ok(r3 && Math.abs(r3.x - 4.6) < 1e-6, "un punto sobre un EJE cae en el eje (Cercano)",
   r3 ? `${r3.type} → x = ${r3.x}` : "no devuelve nada");

// 4) eje que sube × NIVEL: el punto de la elevación
await pag.evaluate(() => {
  const lista = window.__hekatanAxisGrids;
  lista.push({ label: "V", start: [4.6, 7.25, 0], end: [4.6, 7.25, 9] });
});
const r4 = await refDe(4.6, 7.25, 3.1 + 0.25);
ok(r4 && Math.abs(r4.z - 3.1) < 1e-6, "el cruce de un eje con un NIVEL también es referencia",
   r4 ? `${r4.type} → z = ${r4.z}` : "no devuelve nada");

// una captura del cruce, para MIRARLO: que el punto esté en el cruce y no al lado
await pag.screenshot({ path: join(__dirname, "shots", "osnap_ejes_cruce.png"),
  clip: { x: Math.max(0, sc.x - 110), y: Math.max(0, sc.y - 110), width: 220, height: 220 } });
console.log(`   captura: cli/shots/osnap_ejes_cruce.png`);
ok(errores.length === 0, "sin errores de página", errores.slice(0, 2).join(" | "));
await nav.close(); srv.close();
console.log(fallos.length ? `\n${fallos.length} FALLO(S)` : "\nTodo correcto");
process.exit(fallos.length ? 1 : 0);
