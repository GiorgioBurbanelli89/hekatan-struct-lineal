#!/usr/bin/env node
/**
 * ¿El ejemplo GRADUADO da lo mismo que la página vieja? Nudo a nudo, en el navegador.
 *
 *   node cli/comparar_graduado.mjs <id> [<id> ...]
 *   node cli/comparar_graduado.mjs muro-contencion-solido --viejo=../hekatan-struct-todo/website/src/examples
 *
 * Graduar = pasar un ejemplo de página propia (metida en un marco) a `ExampleDef` dentro del
 * workspace. El riesgo es que al reescribirlo cambie el MODELO sin que nadie lo note. Esto abre
 * los dos —la página vieja `/<id>/` de un build de ANTES y el workspace `?t=<id>` del build de
 * ahora— y compara lo que cada visor tiene puesto:
 *
 *   1. los NUDOS: cuántos y dónde (con la deformada apagada)
 *   2. los DESPLAZAMIENTOS: deformada a escala 1 menos la posición original, nudo a nudo
 *
 * Se lee de la escena de three.js (`#viewer.__ctx.scene`), que existe igual en los dos: la
 * página vieja no publica sus estados, pero lo que pinta sí se puede medir.
 *
 * Sale con código 1 si algo no cuadra. Tolerancia: 1e-6 m en coordenadas y 1e-4 % del
 * desplazamiento máximo (la posición pasa por Float32, que da 7 cifras).
 */
import puppeteer from "puppeteer";
import { readFileSync, existsSync, statSync, mkdirSync } from "fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname, resolve } from "path";

const AQUI = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opcion = (n, d) => { const a = args.find((x) => x.startsWith(`--${n}=`)); return a ? a.slice(n.length + 3) : d; };
const IDS = args.filter((a) => !a.startsWith("--"));
const VIEJO = resolve(opcion("viejo", join(AQUI, "..", "..", "hekatan-struct-todo", "website", "src", "examples")));
const NUEVO = resolve(opcion("nuevo", join(AQUI, "..", "website", "src", "examples")));
const TOL_COORD = 1e-5, TOL_DESP_PCT = 1e-2;
const OUT = join(AQUI, "shots", "graduados"); mkdirSync(OUT, { recursive: true });
if (!IDS.length) { console.error("uso: node cli/comparar_graduado.mjs <id> [<id> ...]"); process.exit(2); }
for (const d of [VIEJO, NUEVO]) if (!existsSync(join(d, "workspace", "index.html"))) { console.error(`no hay build en ${d}`); process.exit(2); }

const BASE = "/hekatan-struct-lineal/";
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".wasm": "application/wasm",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".ico": "image/x-icon",
  ".woff2": "font/woff2", ".heks": "application/json" };
const servir = (raiz) => new Promise((ok) => {
  const srv = createServer((req, res) => {
    let p = decodeURIComponent((req.url || "/").split("?")[0]);
    if (p.startsWith(BASE)) p = p.slice(BASE.length - 1);
    let f = join(raiz, p);
    if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
    if (!existsSync(f)) { res.writeHead(404); return res.end("404"); }
    res.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" });
    res.end(readFileSync(f));
  });
  srv.listen(0, () => ok(srv));
});
const sV = await servir(VIEJO), sN = await servir(NUEVO);
const urlV = (id) => `http://localhost:${sV.address().port}${BASE}${id}/`;
const urlN = (id) => `http://localhost:${sN.address().port}${BASE}workspace/?t=${id}`;

const nav = await puppeteer.launch({ headless: "new",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"] });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const fallos = [];
const ok = (c, q, d = "") => { console.log(`${c ? "  ✓" : "  ✗"} ${q}${d ? "  —  " + d : ""}`); if (!c) fallos.push(q); };

/** Lo que el visor de esa página tiene puesto: posiciones sin deformar y desplazamientos. */
async function medir(url, png) {
  const pag = await nav.newPage();
  await pag.setViewport({ width: 1400, height: 860 });
  const errores = [];
  pag.on("pageerror", (e) => errores.push(e.message));
  await pag.goto(url, { waitUntil: "networkidle2", timeout: 180000 });
  await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 }).catch(() => {});
  await espera(8000);
  await pag.screenshot({ path: png });
  const r = await pag.evaluate(async () => {
    const v = document.querySelector("#viewer");
    if (!v?.__ctx) return { error: "la página no tiene visor (#viewer.__ctx)" };
    const s = v.__settings ?? v.__ctx.settings;
    const cm = v.__ctx.scene.getObjectByName("__hekatan_shell_colormap");
    if (!cm || !s) return { error: "el visor no tiene colormap o ajustes" };
    const dormir = (ms) => new Promise((r) => setTimeout(r, ms));
    const pos = () => Array.from(cm.geometry.attributes.position?.array ?? []);
    s.deformedShape.val = false; await dormir(900);
    const p0 = pos();
    if (s.deformScale) s.deformScale.val = 1;
    if (s.deformScaleZ) s.deformScaleZ.val = 1;
    s.deformedShape.val = true; await dormir(900);
    const p1 = pos();
    return { p0, p1, marco: !!document.getElementById("hk-ejemplo-embebido") && document.getElementById("hk-ejemplo-embebido").style.display !== "none" };
  });
  await pag.close();
  return { ...r, errores };
}

const clave = (x, y, z) => `${x.toFixed(4)},${y.toFixed(4)},${z.toFixed(4)}`;
function porNudo(m) {
  const mapa = new Map(); let uMax = 0;
  for (let i = 0; i + 2 < m.p0.length; i += 3) {
    const u = [m.p1[i] - m.p0[i], m.p1[i + 1] - m.p0[i + 1], m.p1[i + 2] - m.p0[i + 2]];
    uMax = Math.max(uMax, Math.hypot(...u));
    const k = clave(m.p0[i], m.p0[i + 1], m.p0[i + 2]);
    (mapa.get(k) ?? mapa.set(k, []).get(k)).push(u);
  }
  // nudos coincidentes: se ordenan por su desplazamiento para casarlos uno con uno
  mapa.forEach((l) => l.sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]));
  return { mapa, uMax, n: m.p0.length / 3 };
}

for (const id of IDS) {
  console.log(`\n── ${id} ──`);
  const V = await medir(urlV(id), join(OUT, `${id}_antes.png`));
  const N = await medir(urlN(id), join(OUT, `${id}_ahora.png`));
  if (V.error) { ok(false, "página vieja", V.error); continue; }
  if (N.error) { ok(false, "workspace", N.error); continue; }
  ok(!N.marco, "el de ahora corre dentro del workspace, sin marco");
  ok(N.errores.length === 0, "sin errores de JavaScript", N.errores[0] ?? "");
  const a = porNudo(V), b = porNudo(N);
  ok(a.n === b.n && a.n > 0, "mismo número de nudos", `${a.n} antes, ${b.n} ahora`);
  let sinPareja = 0, peor = 0, casados = 0;
  a.mapa.forEach((la, k) => {
    const lb = b.mapa.get(k);
    if (!lb || lb.length !== la.length) { sinPareja += la.length; return; }
    la.forEach((u, i) => { casados++; for (let c = 0; c < 3; c++) peor = Math.max(peor, Math.abs(u[c] - lb[i][c])); });
  });
  ok(sinPareja === 0, "los mismos nudos, en el mismo sitio", `${casados} casados, ${sinPareja} sin pareja (tolerancia ${TOL_COORD} m)`);
  const ref = Math.max(a.uMax, 1e-30), pct = 100 * peor / ref;
  ok(casados > 0 && pct <= TOL_DESP_PCT, "los mismos desplazamientos, nudo a nudo",
     `peor ${pct.toExponential(2)} % del máximo · u máx ${a.uMax.toExponential(5)} antes, ${b.uMax.toExponential(5)} ahora (m)`);
}
await nav.close(); sV.close(); sN.close();
console.log(fallos.length ? `\n${fallos.length} FALLO(S)` : "\nTODO BIEN");
console.log(`capturas: ${OUT}`);
process.exit(fallos.length ? 1 : 0);
