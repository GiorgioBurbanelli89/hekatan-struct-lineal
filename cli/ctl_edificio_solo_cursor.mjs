/**
 * ¿SE PUEDE LEVANTAR UN EDIFICIO SOLO CON EL CURSOR?
 *
 * Cinco plantas con su ducto de ascensor, SIN teclear un comando: solo botones del
 * ribbon, clics en el lienzo y los mandos del panel. Es la pregunta de Jorge, y se
 * responde midiendo: cada paso dice qué se creó y qué NO se pudo hacer con el ratón.
 * Al final se cuentan los clics y se lista lo único que hubo que teclear.
 *
 *   node cli/ctl_edificio_solo_cursor.mjs
 */
import puppeteer from "puppeteer";
import { readFileSync, existsSync, statSync, mkdirSync } from "fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "shots", "edificio5"); mkdirSync(OUT, { recursive: true });
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".wasm": "application/wasm", ".json": "application/json", ".svg": "image/svg+xml",
  ".png": "image/png", ".ico": "image/x-icon", ".woff2": "font/woff2" };
const srv = createServer((req, res) => {
  let p = decodeURIComponent((req.url || "/").split("?")[0]);
  if (p.startsWith(BASE)) p = p.slice(BASE.length - 1);
  let f = join(raiz, p);
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
  if (!existsSync(f)) { res.writeHead(404); return res.end("404"); }
  res.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" });
  res.end(readFileSync(f));
});
await new Promise((r) => srv.listen(4761, r));
const nav = await puppeteer.launch({ headless: "new",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage();
await pag.setViewport({ width: 1500, height: 950 });
const errores = []; pag.on("pageerror", (e) => errores.push(e.message));
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const fallos = [];
const ok = (c, q, d = "") => { console.log((c ? "  OK  " : "  --  ") + q + (d ? "  |  " + d : "")); if (!c) fallos.push(q); };
let CLICS = 0;
const TECLEADO = [];

await pag.goto("http://localhost:4761" + BASE + "workspace/?t=new-blank", { waitUntil: "networkidle2", timeout: 180000 });
await espera(6000);
await pag.evaluate(() => document.getElementById("hk-ribbon-guia")?.remove());

// SOLO RATON: pulsar un boton por su texto
const pulsar = async (txt, ms = 700) => {
  const c = await pag.evaluate((t) => {
    const b = [...document.querySelectorAll("#hk-ribbon button, .tp-btnv_b, button")]
      .filter((e) => e.offsetParent !== null && (e.textContent || "").includes(t))[0];
    if (!b) return null;
    const r = b.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }, txt);
  if (!c) return false;
  await pag.mouse.click(c.x, c.y); CLICS++;
  await espera(ms);
  return true;
};
// coordenada del mundo -> pixel
const proy = (P) => pag.evaluate((W) => {
  const wx = W[0], wy = W[1], wz = W[2];
  const v = document.querySelector("#viewer"), cv = v.querySelector("canvas");
  const r = cv.getBoundingClientRect(), cam = v.__ctx.camera; cam.updateMatrixWorld();
  const m = cam.projectionMatrix.elements, mv = cam.matrixWorldInverse.elements;
  const tx = mv[0]*wx + mv[4]*wy + mv[8]*wz + mv[12], ty = mv[1]*wx + mv[5]*wy + mv[9]*wz + mv[13];
  const tz = mv[2]*wx + mv[6]*wy + mv[10]*wz + mv[14], tw = mv[3]*wx + mv[7]*wy + mv[11]*wz + mv[15];
  const cx = m[0]*tx + m[4]*ty + m[8]*tz + m[12]*tw, cy = m[1]*tx + m[5]*ty + m[9]*tz + m[13]*tw;
  const cw = m[3]*tx + m[7]*ty + m[11]*tz + m[15]*tw;
  return { x: r.left + (cx / cw + 1) / 2 * r.width, y: r.top + (1 - cy / cw) / 2 * r.height };
}, P);
// clic en el mundo, solo si NO cae bajo un panel (el ribbon tapa el centro-arriba)
const clicMundo = async (P, ms = 380) => {
  const c = await proy(P);
  const tapado = await pag.evaluate((q) => {
    const e = document.elementFromPoint(q.x, q.y); return e ? e.tagName !== "CANVAS" : true;
  }, c);
  if (tapado) { console.log("       aviso: (" + P.join(",") + ") cae bajo un panel"); return false; }
  await pag.mouse.move(c.x, c.y, { steps: 4 });
  await espera(140);
  await pag.mouse.click(c.x, c.y); CLICS++;
  await espera(ms);
  return true;
};
const modelo = () => pag.evaluate(() => {
  const p = window.__hekatanDrawingPoints?.val || [];
  const pl = window.__hekatanDrawingPolylines?.val || [];
  const ar = window.__hekatanDrawingAreas?.val || [];
  return { nudos: p.length, tramos: pl.reduce((s, q) => s + Math.max(0, q.length - 1), 0),
           areas: ar.length,
           cotas: [...new Set(p.map((q) => +q[2].toFixed(2)))].sort((a, b) => a - b) };
});

// la vista: PLANTA, encuadrada para que el edificio quede por debajo del ribbon
await pulsar("Planta", 1100);
await pag.evaluate(() => {
  const v = document.querySelector("#viewer"), c = v.__ctx.camera;
  v.__ctx.controls.target.set(6, -5, 0); c.position.set(6, -5, 60);
  if (c.isOrthographicCamera) { c.zoom = 26; c.updateProjectionMatrix(); }
  c.lookAt(v.__ctx.controls.target); v.__ctx.controls.update?.(); v.__ctx.render?.();
});
await espera(700);

// 1) el contorno de la planta, 12 x 10, con RECTANGULO
ok(await pulsar("Rect"), "el boton RECTANGULO responde");
await clicMundo([0, 0, 0]);
await clicMundo([12, -10, 0], 600);
await pag.keyboard.press("Escape"); await espera(300);
const m1 = await modelo();
ok(m1.nudos >= 4, "el contorno de la planta sale con dos clics", m1.nudos + " nudos");

// 2) el ducto del ascensor, 2.4 x 2.4, otro rectangulo dentro
ok(await pulsar("Rect"), "se vuelve a coger RECTANGULO");
await clicMundo([8.6, -1.4, 0]);
await clicMundo([11.0, -3.8, 0], 600);
await pag.keyboard.press("Escape"); await espera(300);
const m2 = await modelo();
ok(m2.nudos >= m1.nudos + 4, "el ducto del ascensor, dentro de la planta", m1.nudos + " -> " + m2.nudos + " nudos");
await pag.screenshot({ path: join(OUT, "01_planta.png") });

// 3) las columnas: boton COLUMNA y un clic en cada esquina
ok(await pulsar("Columna"), "el boton COLUMNA responde");
let cols = 0;
const ESQ = [[0,0,0],[12,0,0],[12,-10,0],[0,-10,0],[8.6,-1.4,0],[11,-1.4,0],[11,-3.8,0],[8.6,-3.8,0]];
for (const P of ESQ) if (await clicMundo(P, 420)) cols++;
await pag.keyboard.press("Escape"); await espera(300);
const m3 = await modelo();
ok(m3.cotas.length >= 2, "las columnas suben: aparece una cota nueva", "cotas " + m3.cotas.join(", "));
console.log("       columnas clicadas: " + cols + " de 8");

// 4) los muros del ducto, con el boton MURO
ok(await pulsar("Muro"), "el boton MURO responde");
let muros = 0;
const LADOS = [[[8.6,-1.4,0],[11,-1.4,0]], [[11,-1.4,0],[11,-3.8,0]],
               [[11,-3.8,0],[8.6,-3.8,0]], [[8.6,-3.8,0],[8.6,-1.4,0]]];
for (const par of LADOS) {
  const a = await clicMundo(par[0], 260);
  const b = a ? await clicMundo(par[1], 420) : false;
  if (a && b) muros++;
}
await pag.keyboard.press("Escape"); await espera(400);
const m4 = await modelo();
ok(m4.areas > m3.areas, "los muros del ducto son areas", m3.areas + " -> " + m4.areas + " areas");
console.log("       muros clicados: " + muros + " de 4");
await pag.screenshot({ path: join(OUT, "02_planta_baja.png") });

// 5) las 4 plantas de arriba: designar con ventana y el boton REPLICAR
await pulsar("Selec", 500);
const a1 = await proy([-2, 2, 0]), b1 = await proy([14, -12, 0]);
await pag.mouse.click(a1.x, a1.y); CLICS++; await espera(300);
await pag.mouse.click(b1.x, b1.y); CLICS++; await espera(600);
const sel = await pag.evaluate(() => window.__hekatanSelectionSize?.() ?? 0);
ok(sel > 0, "se designa la planta entera con una ventana de dos clics", sel + " objetos");

const abierto = await pulsar("Editar", 700);
ok(abierto, "el panel Editar - Replicar / Mover se abre con el raton");
const ponerCampo = async (etiqueta, valor) => {
  const r = await pag.evaluate((et) => {
    const f = [...document.querySelectorAll(".tp-lblv")]
      .find((e) => (e.querySelector(".tp-lblv_l")?.textContent || "").trim().startsWith(et));
    const i = f?.querySelector("input");
    if (!i) return null;
    const q = i.getBoundingClientRect();
    return { x: q.left + q.width / 2, y: q.top + q.height / 2 };
  }, etiqueta);
  if (!r) return false;
  await pag.mouse.click(r.x, r.y, { clickCount: 3 }); CLICS++;
  await pag.keyboard.type(String(valor)); TECLEADO.push(etiqueta + " = " + valor);
  await pag.keyboard.press("Enter"); await espera(350);
  return true;
};
const cz = await ponerCampo("Δz", 3);
const cc = await ponerCampo("Copias", 4);
ok(cz && cc, "los campos de desplazamiento y copias aceptan el valor", "dz = 3 m, 4 copias");
ok(await pulsar("Replicar selecci", 1400), "el boton Replicar seleccion responde");
const m5 = await modelo();
ok(m5.cotas.some((z) => Math.abs(z - 15) < 0.05) || m5.cotas.length >= 6,
   "quedan cinco plantas: la cubierta a 15 m", "cotas " + m5.cotas.join(", "));
ok(m5.nudos > m4.nudos * 2, "y el modelo crece, no se mueve", m4.nudos + " -> " + m5.nudos + " nudos");

// a la vista, para mirarlo
await pulsar("3D", 1100);
await pag.evaluate(() => window.__hekatanAutoFit?.()); await espera(900);
// ¿ENCUADRA de verdad? Se proyectan las 8 esquinas de la caja del modelo y se
// mira cuántas caen dentro del lienzo. Un encuadre que deja el edificio fuera no
// es un encuadre, por mucho que la función haya corrido.
const enc = await pag.evaluate(() => {
  const d = window.__hekatanDrawingPoints;
  const P = (d?.rawVal ?? d?.val ?? []);
  if (!P.length) return null;
  const mn = [Infinity,Infinity,Infinity], mx = [-Infinity,-Infinity,-Infinity];
  for (const q of P) for (let k=0;k<3;k++){ if(q[k]<mn[k])mn[k]=q[k]; if(q[k]>mx[k])mx[k]=q[k]; }
  const v = document.querySelector("#viewer"), cv = v.querySelector("canvas");
  const r = cv.getBoundingClientRect(), cam = v.__ctx.camera; cam.updateMatrixWorld();
  const m = cam.projectionMatrix.elements, mv = cam.matrixWorldInverse.elements;
  let dentro = 0;
  for (const x of [mn[0],mx[0]]) for (const y of [mn[1],mx[1]]) for (const z of [mn[2],mx[2]]) {
    const tx=mv[0]*x+mv[4]*y+mv[8]*z+mv[12], ty=mv[1]*x+mv[5]*y+mv[9]*z+mv[13];
    const tz=mv[2]*x+mv[6]*y+mv[10]*z+mv[14], tw=mv[3]*x+mv[7]*y+mv[11]*z+mv[15];
    const cx=m[0]*tx+m[4]*ty+m[8]*tz+m[12]*tw, cy=m[1]*tx+m[5]*ty+m[9]*tz+m[13]*tw;
    const cw=m[3]*tx+m[7]*ty+m[11]*tz+m[15]*tw;
    const px=(cx/cw+1)/2, py=(1-cy/cw)/2;
    if (cw > 0 && px>=0 && px<=1 && py>=0 && py<=1) dentro++;
  }
  return { dentro, caja: [mn.map(q=>+q.toFixed(1)), mx.map(q=>+q.toFixed(1))],
           cam: [cam.position.x, cam.position.y, cam.position.z].map(q=>+q.toFixed(1)),
           mira: [v.__ctx.controls.target.x, v.__ctx.controls.target.y, v.__ctx.controls.target.z].map(q=>+q.toFixed(1)),
           tipo: cam.isOrthographicCamera ? "orto" : "persp", zoom: +(cam.zoom||1).toFixed(2) };
});
console.log("       encuadre:", JSON.stringify(enc));
ok(enc && enc.dentro === 8, "el encuadre deja el edificio ENTERO en pantalla",
   enc ? enc.dentro + " de 8 esquinas dentro" : "sin datos");
await pag.screenshot({ path: join(OUT, "03_edificio_3d.png") });
console.log("\n       clics de raton: " + CLICS);
console.log("       tecleado: " + (TECLEADO.length ? TECLEADO.join(" | ") : "NADA"));
ok(errores.length === 0, "sin errores de pagina", errores.slice(0, 2).join(" | "));

await nav.close(); srv.close();
console.log(fallos.length ? "\n" + fallos.length + " FALLO(S)" : "\nTodo correcto");
process.exit(fallos.length ? 1 : 0);
