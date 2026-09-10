/**
 * REPLICAR: el «Replicate» de ETABS y el ARRAY de AutoCAD, por comando.
 *
 * El motor ya estaba (`__hekatanReplicateSelection`) pero solo se llegaba a él por los campos del
 * panel. Ahora es un comando, como en ETABS/SAP2000/AutoCAD:
 *
 *   REP ⏎  →  «desplazamiento Δx,Δy,Δz (o solo la altura)»  →  0,0,3.1 ⏎  →  «copias <1>»  →  1 ⏎
 *
 * ⚠️ Tecleado va SIEMPRE por pasos, porque el ESPACIO ejecuta el comando (como en AutoCAD): al
 * escribir «rep 0,0,3.1» el espacio ya lanza «rep» y el resto se lee como la respuesta. Es el
 * flujo bueno, el de ETABS. La línea entera («rep 0,0,3.1 2») solo vale desde un guion, por
 * `__hekatanCadRun`, donde no hay teclado de por medio.
 *
 * La prueba levanta el edificio que pidió Jorge: primer piso de 3.20 m y segundo de 3.10, el
 * segundo hecho REPLICANDO el primero. Comprueba las cotas que quedan: 0, 3.20 y 6.30.
 *
 *   node cli/ctl_replicar.mjs
 */
import puppeteer from "puppeteer";
import { readFileSync, existsSync, statSync, mkdirSync } from "fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "shots", "replicar"); mkdirSync(OUT, { recursive: true });
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
const PUERTO = 4747;
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

const cmd = async (txt, tras = 420) => {
  await pag.evaluate(() => { const i = document.getElementById("hk3-cmd-input"); if (i) i.value = ""; });
  await pag.focus("#hk3-cmd-input");
  await pag.type("#hk3-cmd-input", txt, { delay: 12 });
  await pag.keyboard.press("Enter");
  await espera(tras);
};
const esc = async () => { await pag.keyboard.press("Escape"); await espera(250); };
const cotas = () => pag.evaluate(() => {
  const p = (window).__hekatanDrawingPoints?.val || [];
  const z = [...new Set(p.map((q) => +q[2].toFixed(2)))].sort((a, b) => a - b);
  return { nudos: p.length, cotas: z };
});
// los últimos ecos: tras el aviso, el comando cambia a la herramienta de selección
// y escribe el suyo, así que el mensaje que importa no es siempre el último
const ultimo = () => pag.evaluate(() => [...document.querySelectorAll("#hk3-cmd-hist div")]
  .slice(-3).map((d) => d.textContent || "").join(" ⏎ "));

// ── PISO 1: cuatro montantes de 3.20 m (con LÍNEA, que va de punto a punto:
// el comando COLUMNA usa la altura fija del ribbon y ensuciaba las cotas)
const ESQ = [[0, 0], [6, 0], [6, -5], [0, -5]];
for (const [x, y] of ESQ) {
  await cmd("l");
  await cmd(`${x},${y},0`, 260);
  await cmd(`${x},${y},3.2`, 380);
  await esc();
}
await cmd("pl");
for (const [x, y] of ESQ) await cmd(`${x},${y},3.2`, 300);
await cmd("c");            // cerrar el contorno de vigas
await esc();
const p1 = await cotas();
ok(p1.cotas.length === 2 && p1.cotas.includes(0) && p1.cotas.includes(3.2),
   "piso 1: montantes de 0 a 3.20 m y vigas arriba", `cotas ${p1.cotas.join(", ")}`);

// ── DESIGNAR: «TODO» (el all de AutoCAD) y «ÚLTIMO» (su last). Sin ellos, para coger
// un piso entero había que encerrarlo con una ventana de píxeles, que deja fuera lo
// que no quepa en pantalla.
await cmd("s");
await cmd("todo", 600);
const nTodo = await pag.evaluate(() => (window).__hekatanSelectionSize?.() ?? 0);
ok(nTodo >= 5, "«TODO» designa el modelo entero (el all de AutoCAD)", `${nTodo} objetos`);
await cmd("ultimo", 600);
const nUlt = await pag.evaluate(() => (window).__hekatanSelectionSize?.() ?? 0);
ok(nUlt === 1, "«ÚLTIMO» designa solo lo último dibujado (su last)", `${nUlt} objeto`);

// y con ÚLTIMO se replica SOLO el anillo de vigas: así el 2.º piso se apoya en el 1.º
// (con TODO subirían también las columnas de abajo y quedaría colgando).
const antesAnillo = await cotas();
await cmd("rep");
await cmd("0,0,3.1");
await cmd("1", 900);
const anillo = await cotas();
ok(anillo.cotas.some((z) => Math.abs(z - 6.3) < 0.01) && anillo.nudos === antesAnillo.nudos + 4,
   "replicando solo el anillo, el 2.º nivel queda a 6.30 m con 4 nudos nuevos",
   `${antesAnillo.nudos} → ${anillo.nudos} nudos, cotas ${anillo.cotas.join(", ")}`);

// ── PISO 2: se designa todo y se REPLICA 3.10 m hacia arriba
await cmd("s");                                        // herramienta de selección
await pag.evaluate(() => (window).__hekatanSelectAll?.());
await espera(400);
let sel = await pag.evaluate(() => (window).__hekatanSelectionSize?.() ?? 0);
if (!sel) {   // sin «seleccionar todo», se hace con una ventana clic-clic
  await pag.mouse.click(360, 300); await espera(250);
  await pag.mouse.click(940, 580); await espera(500);
  sel = await pag.evaluate(() => (window).__hekatanSelectionSize?.() ?? 0);
}
ok(sel > 0, "se designa el piso 1 entero", `${sel} objetos`);
// tecleado, por pasos: REP ⏎ · el desplazamiento ⏎ · las copias ⏎
await cmd("rep");
const prA = await pag.evaluate(() => document.getElementById("hk3-cmd-prompt")?.textContent || "");
ok(/desplazamiento/i.test(prA), "«REP» pregunta el desplazamiento (como ETABS)", prA.slice(0, 58));
await cmd("0,0,3.1");
const prB = await pag.evaluate(() => document.getElementById("hk3-cmd-prompt")?.textContent || "");
ok(/copias/i.test(prB), "…y después el número de copias", prB.slice(0, 58));
await cmd("1");
const p2 = await cotas();
ok(p2.cotas.some((z) => Math.abs(z - 6.3) < 0.01), "el 2.º piso queda a 6.30 m (3.20 + 3.10)", `cotas ${p2.cotas.join(", ")}`);
ok(p2.nudos > p1.nudos, "y añade nudos, no mueve los de abajo", `${p1.nudos} → ${p2.nudos} nudos`);
await pag.screenshot({ path: join(OUT, "01_edificio_2pisos.png") });

// la línea entera, desde un guion (sin teclado, el espacio no ejecuta)
await pag.evaluate(() => { (window).__hekatanCadRun("s"); });
await pag.mouse.click(360, 290); await espera(250);
await pag.mouse.click(950, 600); await espera(500);
const antes3 = await cotas();
await pag.evaluate(() => (window).__hekatanCadRun("rep 0,0,10"));
await espera(900);
const p3 = await cotas();
ok(p3.nudos > antes3.nudos && p3.cotas.some((z) => z >= 10),
   "y desde un guion vale la línea entera: «rep 0,0,10»", `cotas ${p3.cotas.join(", ")}`);

/** Designa el modelo entero. Por ventana clic-clic dejaba de coger nada en cuanto
 *  el edificio crecía y se salía del rectángulo de píxeles fijo. */
const designarTodo = async () => {
  await pag.evaluate(() => { (window).__hekatanCadRun("s"); });
  await espera(250);
  await pag.evaluate(() => (window).__hekatanSelectAll?.());
  await espera(400);
  let n = await pag.evaluate(() => (window).__hekatanSelectionSize?.() ?? 0);
  if (!n) {
    await pag.mouse.click(360, 290); await espera(250);
    await pag.mouse.click(950, 600); await espera(500);
    n = await pag.evaluate(() => (window).__hekatanSelectionSize?.() ?? 0);
  }
  return n;
};

// ── DE UN PUNTO A OTRO: el «offset a cierto punto» de ETABS / el punto base del COPY
// Tecleado va por pasos (el espacio ejecuta): REP ⏎ · P ⏎ · punto base ⏎ · 2.º punto ⏎ · copias ⏎
const nSel4 = await designarTodo();
ok(nSel4 > 0, "se vuelve a designar el modelo para replicar por puntos", `${nSel4} objetos`);
const antes4 = await cotas();
await cmd("rep");
await cmd("p");
const prP = await pag.evaluate(() => document.getElementById("hk3-cmd-prompt")?.textContent || "");
ok(/punto base/i.test(prP), "«P» pide el PUNTO BASE (como el Replicate de ETABS)", prP.slice(0, 52));
await cmd("0,0,0");
const prP2 = await pag.evaluate(() => document.getElementById("hk3-cmd-prompt")?.textContent || "");
ok(/segundo punto/i.test(prP2), "…y luego el SEGUNDO punto", prP2.slice(0, 52));
await cmd("2,0,20");        // Δ = (2, 0, 20): se mide por la cota, que es inconfundible
const prP3 = await pag.evaluate(() => document.getElementById("hk3-cmd-prompt")?.textContent || "");
ok(/copias/i.test(prP3), "…y después el número de copias", prP3.slice(0, 58));
await cmd("1");
const ecoP = await ultimo();
const p4 = await cotas();
if (!p4.cotas.some((z) => z >= 20)) console.log("     eco tras las copias:", ecoP.slice(0, 140));
ok(p4.nudos > antes4.nudos && p4.cotas.some((z) => z >= 20),
   "replica con el Δ que hay entre los dos puntos", `cotas ${p4.cotas.join(", ")}`);

// y en una línea, desde un guion: «rep p base segundo»
await designarTodo();
const antes5 = await cotas();
await pag.evaluate(() => (window).__hekatanCadRun("rep p 0,0,0 0,0,40"));
await espera(900);
const p5 = await cotas();
ok(p5.nudos > antes5.nudos && p5.cotas.some((z) => z >= 40),
   "y en una línea: «rep p 0,0,0 0,0,40»", `cotas ${p5.cotas.slice(-3).join(", ")}`);

// sin nada designado, avisa en vez de callarse  (sin espacios: el espacio ejecuta)
await pag.evaluate(() => (window).__hekatanClearSelection?.());
await espera(300);
await cmd("rep");
const msg = await ultimo();
ok(/designe/i.test(msg), "sin designar nada, avisa en vez de callarse", msg.slice(0, 62));
await pag.keyboard.press("Escape"); await espera(250);
// ── y el BOTÓN del ribbon, que es por donde lo va a buscar cualquiera ──────
// REPLICAR vivía solo en el cuadro de comandos y en una carpeta del panel de
// propiedades: escondido, siendo la orden que convierte un pórtico en un edificio.
const pulsarRibbon = async (txt, ms = 800) => {
  const c = await pag.evaluate((t) => {
    const b = [...document.querySelectorAll("#hk-ribbon button")]
      .filter((e) => e.offsetParent !== null && (e.textContent || "").includes(t))[0];
    if (!b) return null;
    const r = b.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }, txt);
  if (!c) return false;
  await pag.mouse.click(c.x, c.y); await espera(ms); return true;
};
const prompt = () => pag.evaluate(() => document.getElementById("hk3-cmd-prompt")?.textContent || "");
ok(await pulsarRibbon("Replicar", 500), "el ribbon tiene su botón REPLICAR");
await cmd("s"); await cmd("todo", 600);
await pulsarRibbon("Replicar", 800);
const pr1 = await prompt();
ok(/desplazamiento/i.test(pr1), "el botón lanza la misma orden: pide el desplazamiento", pr1.slice(0, 54));
await cmd("0,0,3", 500);
const pr2 = await prompt();
ok(/copias/i.test(pr2), "…y después cuántas copias", pr2.slice(0, 54));
await cmd("2", 900);
const cotasBoton = await cotas();
ok(cotasBoton.cotas.length > 3, "y replica de verdad", `cotas ${cotasBoton.cotas.slice(0, 6).join(", ")}`);

ok(errores.length === 0, "sin errores de página", errores.slice(0, 2).join(" | "));

await nav.close(); srv.close();
console.log(fallos.length ? `\n${fallos.length} FALLO(S)` : "\nTodo correcto");
process.exit(fallos.length ? 1 : 0);
