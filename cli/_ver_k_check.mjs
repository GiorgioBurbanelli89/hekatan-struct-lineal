/**
 * «Ver K local» de BARRA y de PAÑO, con el ratón, en local o en el sitio público.
 *
 *   node cli/_ver_k_check.mjs local  [carpeta_png]   (sirve website/src/examples en :4824)
 *   node cli/_ver_k_check.mjs public [carpeta_png]   (https://giorgioburbanelli89.github.io/hekatan-struct-lineal/)
 *
 * Cómo se abre (lo mismo que hace este script): clic sobre la barra o el paño en el visor
 * → sale abajo al centro el botón «📐 Ver K local · barra N / paño N» (#hk-klocal-chip)
 * → clic en el botón → ventana #hk-klocal con la matriz. Si el clic no cae sobre el
 * elemento buscado (otro delante), se designa por el evento hk:model-selection y se avisa.
 */
import puppeteer from "puppeteer";
import fs from "node:fs";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join, extname } from "node:path";

const AQUI = dirname(fileURLToPath(import.meta.url));
const MODO = process.argv[2] || "local";
const OUT = process.argv[3] || join(AQUI, "shots", "ver_k", MODO);
fs.mkdirSync(OUT, { recursive: true });
const BASE = "/hekatan-struct-lineal/";
let srv = null, ORIGEN = "https://giorgioburbanelli89.github.io";
if (MODO === "local") {
  const raiz = join(AQUI, "..", "website", "src", "examples");
  const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".wasm": "application/wasm",
    ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".mp4": "video/mp4", ".woff2": "font/woff2" };
  srv = createServer((req, res) => {
    let p = decodeURIComponent((req.url || "/").split("?")[0]);
    if (p.startsWith(BASE)) p = p.slice(BASE.length - 1);
    let f = join(raiz, p);
    if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = join(f, "index.html");
    if (!fs.existsSync(f)) { res.writeHead(404); return res.end("404"); }
    res.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" }); res.end(fs.readFileSync(f));
  });
  await new Promise((r) => srv.listen(4824, r));
  ORIGEN = "http://localhost:4824";
}

// cada caso: ejemplo, cómo se prepara, y qué elemento se busca
const CASOS = [
  { n: "01_barra_plantillas", t: "plantillas", tipo: "frame" },
  { n: "02_pano_thin_mesa_torsion", t: "mesa-torsion", tipo: "shell", nn: 4, pf: [1] },
  { n: "02b_pano_thick_test_m_losa", t: "test-m-losa", tipo: "shell", nn: 4, pf: [0, 2] },
  { n: "03_pano_thick_cimentacion_winkler", t: "plantillas", set: { tipo: 10 }, tipo: "shell", nn: 4, pf: [0, 2] },
  { n: "04_barra_cimentacion_winkler", t: "plantillas", set: { tipo: 8 }, tipo: "frame" },
  { n: "05_pano_thin_q4_validacion", t: "validacion-losas-csi", tipo: "shell", nn: 4, pf: [1] },
  { n: "06_pano_thin_t3_validacion", t: "validacion-losas-csi", tipo: "shell", nn: 3, pf: [1] },
  { n: "07_pano_thick_t3", t: "validacion-losas-csi", tipo: "shell", nn: 3, pf: [0, 2], opcional: true },
];

const nav = await puppeteer.launch({ headless: "new",
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const esp = (ms) => new Promise((r) => setTimeout(r, ms));
const filas = [];
for (const c of CASOS) {
  const pag = await nav.newPage(); await pag.setViewport({ width: 1500, height: 900 });
  const err = []; pag.on("pageerror", (e) => err.push(String(e).slice(0, 160)));
  await pag.goto(`${ORIGEN}${BASE}workspace/?t=${c.t}`, { waitUntil: "networkidle2", timeout: 180000 });
  await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx && !!window.__hekatanMallaK, { timeout: 150000 });
  await esp(6000);
  if (c.set) { for (const [k, v] of Object.entries(c.set)) await pag.evaluate((k, v) => window.__hekatanSetParam(k, v), k, v); await esp(7000); }
  await pag.keyboard.press("Escape"); await esp(300);
  // se apaga la deformada: el clic va a la geometría ORIGINAL (con la deformada puesta la barra
  // dibujada está desplazada unos píxeles de su posición y el clic cae al lado)
  await pag.evaluate(() => { try { const s = window.__hekatanSettings?.(); if (s?.deformedShape) s.deformedShape.val = false; } catch {} }); await esp(1500);
  // el elemento buscado más cercano al centro del lienzo, y su punto en pantalla
  const obj = await pag.evaluate((c) => {
    const h = document.querySelector("#viewer"), ctx = h.__ctx, r = h.querySelector("canvas").getBoundingClientRect();
    const V = Object.getPrototypeOf(ctx.camera.position).constructor;
    const m = window.__hekatanMallaK, N = m.nodes.rawVal, E = m.elements.rawVal, ei = m.elementInputs.rawVal ?? {};
    const cands = [];
    E.forEach((el, i) => {
      if (c.tipo === "frame" ? el.length !== 2 : el.length !== c.nn) return;
      if (c.tipo === "shell") { const pf = ei.plateFormulations?.get?.(i) ?? 0; if (!c.pf.includes(pf)) return; if (!(ei.thicknesses?.get?.(i) > 0)) return; }
      const P = el.map((k) => N[k]); const g = [0, 1, 2].map((k) => P.reduce((s, p) => s + p[k], 0) / P.length);
      const v = new V(g[0], g[1], g[2]).project(ctx.camera);
      const x = (v.x * 0.5 + 0.5) * r.width + r.left, y = (-v.y * 0.5 + 0.5) * r.height + r.top;
      if (x < r.left + 60 || x > r.right - 60 || y < r.top + 120 || y > r.bottom - 200 || v.z > 1) return;
      const d = Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2));
      cands.push({ i, x, y, d, pf: ei.plateFormulations?.get?.(i) ?? 0 });
    });
    return cands.sort((a, b) => a.d - b.d).slice(0, 8);
  }, c);
  if (!obj.length) { filas.push({ caso: c.n, t: c.t, res: c.opcional ? "no hay ese tipo de elemento en el ejemplo (opcional)" : "SIN ELEMENTO A LA VISTA" }); await pag.close(); continue; }
  let via = "clic", chip = null, el = obj[0];
  for (const o of obj) {   // se prueba con el ratón sobre los candidatos más centrados
    await pag.keyboard.press("Escape"); await esp(200);
    await pag.mouse.move(o.x - 5, o.y - 4); await esp(150); await pag.mouse.move(o.x, o.y); await esp(250);
    await pag.mouse.click(o.x, o.y); await esp(800);
    chip = await pag.evaluate(() => { const b = document.getElementById("hk-klocal-chip"); return b && !b.hidden ? { txt: b.textContent, idx: +b.dataset.idx, tipo: b.dataset.tipo } : null; });
    if (chip && chip.tipo === c.tipo && chip.idx === o.i) { el = o; via = `clic del ratón en (${Math.round(o.x)}, ${Math.round(o.y)})`; break; }
  }
  const obj0 = el;
  if (!chip || chip.tipo !== c.tipo || chip.idx !== obj0.i) {
    via = `evento (el clic designó ${chip ? chip.tipo + " " + (chip.idx + 1) : "nada"})`;
    await pag.evaluate((t, i) => window.dispatchEvent(new CustomEvent("hk:model-selection", { detail: { ultimo: { type: t, idx: i } } })), c.tipo, obj0.i);
    await esp(500);
    chip = await pag.evaluate(() => { const b = document.getElementById("hk-klocal-chip"); return b && !b.hidden ? { txt: b.textContent, idx: +b.dataset.idx, tipo: b.dataset.tipo } : null; });
  }
  await pag.screenshot({ path: join(OUT, c.n + "_a_boton.png") });
  // clic de ratón en el botón
  const bc = await pag.evaluate(() => { const r = document.getElementById("hk-klocal-chip")?.getBoundingClientRect(); return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null; });
  if (bc) { await pag.mouse.click(bc.x, bc.y); await esp(1200); }
  const win = await pag.evaluate(() => {
    const h = document.getElementById("hk-klocal"); if (!h || h.hidden) return null;
    const tablas = [...h.querySelectorAll("table")].map((t) => `${t.querySelectorAll("tr").length - 1}x${t.querySelectorAll("tr")[1]?.querySelectorAll("td").length ?? 0}`);
    return { titulo: h.querySelector("b")?.textContent, info: h.querySelector("span")?.textContent?.slice(0, 170), aviso: h.querySelector(".hk-k-aviso")?.textContent ?? "", tablas };
  });
  await pag.screenshot({ path: join(OUT, c.n + "_b_ventana.png") });
  filas.push({ caso: c.n, t: c.t + (c.set ? " " + JSON.stringify(c.set) : ""), elemento: obj0.i + 1, pf: obj0.pf, via, boton: chip?.txt, ventana: win, errores: err.slice(0, 2) });
  await pag.close();
}
await nav.close(); if (srv) srv.close();
console.log(JSON.stringify(filas, null, 1));
fs.writeFileSync(join(OUT, "_resumen.json"), JSON.stringify(filas, null, 1));
