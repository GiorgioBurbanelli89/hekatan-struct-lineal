/**
 * Botón 🔗 Compartir: (1) el enlace del ejemplo con los parámetros cambiados; (2) abrir ese enlace da el
 * MISMO modelo; (3) el botón no choca con ningún elemento de la barra en 7 anchos de pantalla; (4) el
 * aviso queda dentro de la ventana y no tapa el botón. Guarda PNG de cada ancho.
 *   node cli/ctl_compartir.mjs [--base URL]
 */
import puppeteer from "puppeteer";
import { mkdirSync } from "node:fs";
const i = process.argv.indexOf("--base"); const BASE = i >= 0 ? process.argv[i + 1] : "http://localhost:4600";
const DIR = "cli/shots/ctl_compartir"; mkdirSync(DIR, { recursive: true });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
let fallos = 0; const ok = (c, t) => { console.log(`${c ? "ok  " : "FALLA"} ${t}`); if (!c) fallos++; };
const abrir = async (pag, url) => {
  await pag.goto(url, { waitUntil: "networkidle2", timeout: 180000 });
  await pag.waitForFunction(() => !!document.getElementById("hk-compartir-btn") && window.__hekatanStates?.nodes?.val?.length, { timeout: 120000 });
  await espera(4000);
};
// 1) + 2) enlace con parámetros y su vuelta
const pag = await nav.newPage(); await pag.setViewport({ width: 1600, height: 900 });
const err = []; pag.on("pageerror", (e) => err.push(e.message));
await abrir(pag, `${BASE}/workspace/index.html?t=plantillas`);
await pag.evaluate(() => { window.__hekatanSetParam("pisos", 5); window.__hekatanSetParam("nx", 3); });
await espera(5000);
const antes = await pag.evaluate(() => window.__hekatanStates.nodes.val.length);
await pag.click("#hk-compartir-btn"); await espera(1200);
const aviso = await pag.evaluate(() => { const a = document.getElementById("hk-compartir-aviso"); return a ? { txt: a.innerText, url: a.querySelector("input")?.value } : null; });
await pag.screenshot({ path: `${DIR}/01_aviso.png` });
ok(aviso?.url && /[?&]t=plantillas/.test(aviso.url) && /[?&]p=/.test(aviso.url), "el enlace: " + aviso?.url);
const p2 = await nav.newPage(); await p2.setViewport({ width: 1600, height: 900 });
await abrir(p2, aviso.url.replace(/^https?:\/\/[^/]+/, BASE.replace(/\/hekatan-struct-lineal$/, "") ).replace("//workspace", "/workspace"));
await espera(4000);
const despues = await p2.evaluate(() => window.__hekatanStates.nodes.val.length);
await p2.screenshot({ path: `${DIR}/02_abierto.png` });
ok(despues === antes, `abrir el enlace da el mismo modelo: ${despues} nudos = ${antes}`);
await p2.close();
// 3) + 4) choques en 7 anchos
for (const [w, h] of [[1920, 1080], [1600, 900], [1366, 768], [1280, 720], [1100, 700], [1024, 700], [900, 700], [800, 700]]) {
  await pag.setViewport({ width: w, height: h }); await espera(1200);
  const r = await pag.evaluate(() => {
    const b = document.getElementById("hk-compartir-btn"); const rb = b.getBoundingClientRect();
    const cen = document.elementFromPoint(rb.x + rb.width / 2, rb.y + rb.height / 2);
    const dentro = rb.left >= 0 && rb.right <= innerWidth && rb.top >= 0 && rb.bottom <= innerHeight && rb.width > 10;
    // todo lo visible que NO es el botón ni está dentro de él, y que no lo contiene
    const choques = [], fondo = [];
    for (const e of document.querySelectorAll("body *")) {
      if (e === b || b.contains(e) || e.contains(b)) continue;
      const cs = getComputedStyle(e); if (cs.visibility === "hidden" || cs.display === "none" || +cs.opacity === 0) continue;
      const re = e.getBoundingClientRect(); if (re.width < 2 || re.height < 2) continue;
      if (e.children.length && !["BUTTON", "INPUT", "SELECT", "IMG", "CANVAS", "SVG"].includes(e.tagName)) continue;   // hojas visibles
      const sx = Math.min(rb.right, re.right) - Math.max(rb.left, re.left), sy = Math.min(rb.bottom, re.bottom) - Math.max(rb.top, re.top);
      // el lienzo 3D (o el de dibujo) ocupa la ventana entera POR DETRÁS: no es un choque si el botón queda encima
      if (e.tagName === "CANVAS" && re.width >= innerWidth * 0.6 && re.height >= innerHeight * 0.6 && b.contains(document.elementFromPoint(rb.x + rb.width / 2, rb.y + rb.height / 2))) { fondo.push(`${Math.round(re.width)}×${Math.round(re.height)}`); continue; }
      if (sx > 1 && sy > 1) choques.push(`${e.tagName}${e.id ? "#" + e.id : ""}.${String(e.className).slice(0, 20)} «${(e.textContent || "").trim().slice(0, 18)}»`);
    }
    return { dentro, arriba: b.contains(cen), choques, fondo, rect: [Math.round(rb.x), Math.round(rb.y), Math.round(rb.width), Math.round(rb.height)] };
  });
  const fueraBarra = await pag.evaluate(() => [...document.querySelectorAll("#hk-cad-tit button")].filter((e) => {
    const cs = getComputedStyle(e); if (cs.display === "none" || cs.visibility === "hidden") return false;
    const q = e.getBoundingClientRect(); return q.width > 2 && (q.right > innerWidth + 0.5 || q.left < -0.5); }).map((e) => e.id || (e.textContent || "").trim().slice(0, 10)));
  ok(fueraBarra.length === 0, `${w}×${h}: ningún botón de la barra se sale de la pantalla ${fueraBarra.join(", ")}`);
  await pag.click("#hk-compartir-btn"); await espera(900);
  const av = await pag.evaluate(() => { const a = document.getElementById("hk-compartir-aviso"), b = document.getElementById("hk-compartir-btn");
    const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
    return { dentro: ra.left >= 0 && ra.right <= innerWidth && ra.bottom <= innerHeight, tapaBoton: ra.top < rb.bottom && ra.bottom > rb.top && ra.left < rb.right && ra.right > rb.left }; });
  await pag.screenshot({ path: `${DIR}/ancho_${w}.png` });
  ok(r.dentro && r.arriba && r.choques.length === 0 && av.dentro && !av.tapaBoton,
    `${w}×${h}: botón ${r.rect.join(",")} · a la vista ${r.dentro && r.arriba} · choques ${r.choques.length ? r.choques.join(" | ") : 0} (lienzo de fondo ${r.fondo.join(",") || "—"}) · aviso dentro ${av.dentro} · tapa el botón ${av.tapaBoton}`);
  await pag.evaluate(() => document.getElementById("hk-compartir-aviso")?.remove());
}
ok(err.length === 0, "0 errores " + err.join(" | "));
await nav.close(); process.exit(fallos ? 1 : 0);
