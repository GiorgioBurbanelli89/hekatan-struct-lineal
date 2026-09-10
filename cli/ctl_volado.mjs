/**
 * El VOLADO no puede mover la estructura: ni acortar los muros ni inventar apoyos.
 *
 * Dos fallos que cazó Jorge mirando la pantalla (10-sep-2026, dual):
 *   · al subir «volado perimetral» el MURO se acortaba — se iba al voladizo, porque
 *     se colocaba con índices contados desde 0 y con volado el índice 0 ya no es el
 *     eje A sino el borde del voladizo;
 *   · y aparecían APOYOS en la base donde no hay columna — el volado añade un eje a
 *     cada lado, sus cruces contaban como nudo de cimentación y todo nudo con z = 0
 *     lleva empotramiento.
 *
 * Se mide lo mismo con volado y sin él: los muros tienen que ser LOS MISMOS (mismo
 * largo, mismo alto, mismo sitio) y los apoyos tienen que ser los mismos.
 *
 *   node cli/ctl_volado.mjs            (el build local)
 *   node cli/ctl_volado.mjs publico    (el sitio de GitHub Pages)
 */
import puppeteer from "puppeteer";
import { readFileSync, existsSync, statSync, mkdirSync } from "fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUB = process.argv[2] === "publico";
const OUT = join(__dirname, "shots", "volado"); mkdirSync(OUT, { recursive: true });
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
const PUERTO = 4776;
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
  ? "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=plantillas"
  : `http://localhost:${PUERTO}${BASE}workspace/?t=plantillas`;
const nav = await puppeteer.launch({ headless: "new",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage();
await pag.setViewport({ width: 1400, height: 900 });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const fallos = [];
const ok = (c, q, d = "") => { console.log(`${c ? "  ✓" : "  ✗"} ${q}${d ? "  —  " + d : ""}`); if (!c) fallos.push(q); };
await pag.goto(URL_, { waitUntil: "networkidle2", timeout: 180000 });
await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 });
await espera(6000);

/** Muros, apoyos y planta del modelo que hay ahora. */
const radiografia = () => pag.evaluate(() => {
  const st = window.__hekatanStates || {};
  const nodes = st.nodes?.rawVal ?? [];
  const els = st.elements?.rawVal ?? [];
  const ni = st.nodeInputs?.rawVal ?? {};
  const ei = st.elementInputs?.rawVal ?? {};
  // los muros son las cáscaras VERTICALES (todos sus nudos comparten x o y, y suben)
  const muros = [];
  els.forEach((e, k) => {
    if (e.length !== 4) return;
    const P = e.map((i) => nodes[i]).filter(Boolean);
    if (P.length !== 4) return;
    const dz = Math.max(...P.map((p) => p[2])) - Math.min(...P.map((p) => p[2]));
    if (dz < 1e-6) return;                       // horizontal: es losa
    muros.push({ k, P });
  });
  const ext = (sel) => {
    const v = muros.flatMap((m) => m.P.map(sel));
    return v.length ? [+Math.min(...v).toFixed(3), +Math.max(...v).toFixed(3)] : null;
  };
  const apoyos = [...(ni.supports?.keys?.() ?? [])].map((i) => nodes[i]).filter(Boolean);
  const xs = nodes.map((n) => n[0]), ys = nodes.map((n) => n[1]);
  return {
    nMuros: muros.length,
    muroX: ext((p) => p[0]), muroY: ext((p) => p[1]), muroZ: ext((p) => p[2]),
    apoyos: apoyos.length,
    apoyoX: apoyos.length ? [+Math.min(...apoyos.map((p) => p[0])).toFixed(3),
                             +Math.max(...apoyos.map((p) => p[0])).toFixed(3)] : null,
    planta: [+(Math.max(...xs) - Math.min(...xs)).toFixed(2),
             +(Math.max(...ys) - Math.min(...ys)).toFixed(2)],
    espesores: [...new Set([...(ei.thicknesses?.values?.() ?? [])])].sort(),
  };
});

const poner = async (o) => { await pag.evaluate((q) => {
  for (const [k, v] of Object.entries(q)) window.__hekatanSetParam(k, v);
}, o); await espera(9000); };

// dual, 4x4 ejes de 6 m, 3 pisos — sin volado y con volado
await poner({ tipo: 6, nx: 4, ny: 4, sx: 6, sy: 6, pisos: 3, ms: 2, volado: 0 });
const sin = await radiografia();
await pag.screenshot({ path: join(OUT, "ctl_sin_volado.png") });
console.log("  sin volado:", JSON.stringify(sin));
await poner({ volado: 0.75 });
const con = await radiografia();
await pag.screenshot({ path: join(OUT, "ctl_con_volado.png") });
console.log("  con volado 0.75:", JSON.stringify(con));

ok(sin.nMuros > 0, "hay muros que medir", `${sin.nMuros} cáscaras verticales`);
ok(con.nMuros === sin.nMuros, "el volado no cambia el NÚMERO de cáscaras de muro",
   `${sin.nMuros} → ${con.nMuros}`);
for (const [eje, nom] of [["muroX", "largo en X"], ["muroY", "posición en Y"], ["muroZ", "altura"]])
  ok(JSON.stringify(con[eje]) === JSON.stringify(sin[eje]),
     `el muro conserva su ${nom}`, `${JSON.stringify(sin[eje])} → ${JSON.stringify(con[eje])}`);
ok(con.apoyos === sin.apoyos, "el volado no inventa apoyos en la base",
   `${sin.apoyos} → ${con.apoyos}`);
ok(JSON.stringify(con.apoyoX) === JSON.stringify(sin.apoyoX),
   "los apoyos siguen bajo los ejes, no bajo el voladizo",
   `${JSON.stringify(sin.apoyoX)} → ${JSON.stringify(con.apoyoX)}`);
ok(con.planta[0] > sin.planta[0] && con.planta[1] > sin.planta[1],
   "la LOSA sí crece con el volado (si no, el volado no haría nada)",
   `${JSON.stringify(sin.planta)} → ${JSON.stringify(con.planta)}`);

console.log(`\n${fallos.length ? "FALLOS: " + fallos.join(" · ") : "OK: el volado solo alarga la losa"}`);
await nav.close(); if (srv) srv.close();
process.exit(fallos.length ? 1 : 0);
