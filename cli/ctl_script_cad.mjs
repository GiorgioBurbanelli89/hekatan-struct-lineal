/**
 * SCRIPT de dibujo (hekatan-ui/src/cad/scriptCad.ts): varias órdenes pegadas, con bucles y {expresiones}.
 *   node cli/ctl_script_cad.mjs
 */
import puppeteer from "puppeteer";
import { readFileSync, existsSync, statSync, mkdirSync } from "fs";
import { createServer } from "http";
import { join, extname, dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
const URL_PUBLICA = process.env.URL_PUBLICA;   // p. ej. https://giorgioburbanelli89.github.io/hekatan-struct-lineal/
const MIME = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css", ".wasm":"application/wasm", ".json":"application/json", ".svg":"image/svg+xml", ".png":"image/png", ".ico":"image/x-icon", ".woff2":"font/woff2" };
const srv = createServer((req, res) => { let p = decodeURIComponent((req.url || "/").split("?")[0]); if (p.startsWith(BASE)) p = p.slice(BASE.length - 1);
  let f = join(raiz, p); if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
  if (!existsSync(f)) { res.writeHead(404); return res.end("404"); }
  res.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" }); res.end(readFileSync(f)); });
await new Promise((r) => srv.listen(4771, r));
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=d3d11", "--ignore-gpu-blocklist", "--window-size=1500,1000"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1500, height: 1000 });
const err = []; pag.on("pageerror", (e) => err.push(e.message));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const fallos = [];
const ok = (c, q, d = "") => { console.log(`${c ? "  ok  " : "FALLA "} ${q}${d ? "   " + d : ""}`); if (!c) fallos.push(q); };
const destino = URL_PUBLICA ? `${URL_PUBLICA}workspace/?t=new-blank` : `http://localhost:4771${BASE}workspace/?t=new-blank`;
await pag.goto(destino, { waitUntil: "networkidle2", timeout: 120000 });
await wait(8000); await pag.keyboard.press("Escape"); await wait(400);
const modelo = () => pag.evaluate(() => { const g = (k) => { const v = window[k]; return v && v.val ? v.val : []; };
  const pls = g("__hekatanDrawingPolylines");
  return { nudos: g("__hekatanDrawingPoints").length, tramos: pls.reduce((s, p) => s + Math.max(0, p.length - 1), 0),
           pts: g("__hekatanDrawingPoints").map((p) => Array.from(p).map((v) => +(+v).toFixed(3))) }; });
const estado = () => pag.evaluate(() => document.getElementById("hk-script-est")?.textContent || "");
const escribir = (t) => pag.evaluate((t) => { const a = document.getElementById("hk-script-txt"); a.value = t; }, t);
const ejecutar = async () => { await pag.evaluate(() => document.getElementById("hk-script-go").click()); await wait(1500); };

// 1) se abre con la orden SCRIPT (y con el botón del panel)
await pag.evaluate(() => window.__hekatanSetView("plan")); await wait(800);
await pag.focus("#hk3-cmd-input");   // como en uso real: el foco vive en la línea de órdenes (A/S/D/F son atajos fuera de ella)
await pag.keyboard.type("script ", { delay: 40 }); await wait(500);
ok(await pag.evaluate(() => { const v = document.getElementById("hk-script-cad"); return !!v && getComputedStyle(v).display !== "none"; }), "la orden SCRIPT abre la ventana");

// 2) el ejemplo: bucle + expresiones + rectángulo
await pag.evaluate(() => document.getElementById("hk-script-ej").click());
await ejecutar();
let m = await modelo();
// 4 columnas (2 pts c/u) + 1 viga (2 pts) + rectángulo (4 pts) = 14 nudos; 4 + 1 + 4 tramos = 9
ok(m.tramos === 9, "el ejemplo dibuja 4 columnas + viga + rectángulo (9 tramos)", `${m.tramos} tramos, ${m.nudos} nudos · ${await estado()}`);
const tiene = (x, y) => m.pts.some((p) => Math.abs(p[0] - x) < 1e-6 && Math.abs(p[1] - y) < 1e-6);
ok(tiene(18, 4) && tiene(12, 0) && tiene(0, 4), "las {expresiones} dan (18,4), (12,0) y (0,4) exactos");
await pag.screenshot({ path: join(__dirname, "shots_bench", "script_cad.png") });

// 3) errores claros, sin dibujar nada de un bucle roto
await pag.evaluate(() => { document.getElementById("hk-script-un").click(); });
const antes = (await modelo()).tramos;
await escribir("para i 0 3\n l {i*6},0 {i*6},4\n"); await ejecutar();
ok(/falta «fin»/.test(await estado()) && (await modelo()).tramos === antes, "bucle sin «fin»: error claro y no dibuja", await estado());
await escribir("l {zz*2},0 5,5"); await ejecutar();
ok(/«zz» no está definido/.test(await estado()), "variable no definida: error claro", await estado());
await escribir("l {process.exit()},0 1,1"); await ejecutar();
ok(/no permitido|no está definido/.test(await estado()), "no ejecuta código arbitrario en las llaves", await estado());

// 4) polilínea cerrada y desde vacío: «pl … c»
await pag.keyboard.press("Escape");
const t0 = (await modelo()).tramos;
await escribir("pl 30,0 34,0 34,3 30,3 c"); await ejecutar();
const t1 = (await modelo()).tramos;
ok(t1 - t0 === 4, "pl … c cierra la polilínea (4 tramos)", `${t1 - t0} tramos nuevos`);

// 5) velocidad: 40 columnas en bucle
const t2 = (await modelo()).tramos; const ini = Date.now();
await escribir("para i 0 39\n l {i*3},50 {i*3},54\nfin"); await pag.evaluate(() => document.getElementById("hk-script-go").click());
let est = ""; for (let k = 0; k < 100; k++) { est = await estado(); if (/✓|✕/.test(est)) break; await wait(100); }
const dt = Date.now() - ini; const t3 = (await modelo()).tramos;
ok(t3 - t2 === 40, "bucle de 40 columnas: 40 tramos", `${t3 - t2} tramos en ${dt} ms`);
console.log("pageerrors:", err.length, err.slice(0, 2));
ok(err.length === 0, "sin errores de página");
await nav.close(); srv.close();
console.log(fallos.length ? `\n${fallos.length} FALLO(S)` : "\nTodo correcto");
process.exit(fallos.length ? 1 : 0);
