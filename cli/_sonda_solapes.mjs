// SONDA DE SOLAPES (Jorge, 19-sep-2026: «mira que no solape ningún botón, no solo esos»).
// Sirve el bundle local (website/src/examples) y, en cada ESTADO de la ventana, revisa TODOS los
// mandos pulsables (button, input, select, summary, [role=button]) y avisa de tres cosas:
//   TAPADO    — en su centro manda OTRO elemento (elementFromPoint no es él ni un hijo/padre suyo)
//   SE PISAN  — dos mandos que no son padre/hijo se cortan ≥ 20 % del menor
//   FUERA     — el mando se sale de la ventana (y no está dentro de un contenedor con scroll)
//   node cli/_sonda_solapes.mjs            (1280x720)      node cli/_sonda_solapes.mjs 1600 900
import puppeteer from "puppeteer";
import { createServer } from "http";
import { readFileSync, existsSync, statSync, mkdirSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = "/hekatan-struct-lineal/", raiz = join(__dirname, "..", "website", "src", "examples"), PUERTO = 4733;
const W = +(process.argv[2] || 1280), H = +(process.argv[3] || 720);
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".wasm": "application/wasm", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".ico": "image/x-icon", ".woff2": "font/woff2", ".mp4": "video/mp4" };
const srv = createServer((req, res) => {
  let p = decodeURIComponent((req.url || "/").split("?")[0]); if (p.startsWith(BASE)) p = p.slice(BASE.length - 1);
  let f = join(raiz, p); if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
  if (!existsSync(f)) { res.writeHead(404); return res.end("404"); }
  res.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" }); res.end(readFileSync(f));
});
await new Promise((r) => srv.listen(PUERTO, r));
const OUT = join(__dirname, "shots", "_solapes"); mkdirSync(OUT, { recursive: true });
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"] });
const pag = await nav.newPage(); await pag.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

const revisar = () => pag.evaluate(() => {
  const nombre = (e) => (e.id ? "#" + e.id + " " : "") + "«" + ((e.title || e.getAttribute("aria-label") || e.textContent || e.value || e.tagName).trim().replace(/\s+/g, " ").slice(0, 34)) + "»";
  const els = [...document.querySelectorAll("button, input, select, summary, [role=button], textarea")].filter((e) => {
    const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
    if (!(r.width > 3 && r.height > 3 && cs.visibility !== "hidden" && cs.display !== "none" && +cs.opacity > 0.05)) return false;
    // un panel PLEGADO sigue en el DOM: la app lo saca con translateX + opacity 0 + pointer-events none.
    // Eso no es «estar fuera de la pantalla», es estar guardado: no cuenta.
    for (let p = e.parentElement; p; p = p.parentElement) { const c = getComputedStyle(p); if (+c.opacity < 0.05 || c.pointerEvents === "none" && /matrix|translate/.test(c.transform)) return false; }
    return true;
  });
  const conScroll = (e) => { for (let p = e.parentElement; p; p = p.parentElement) { const cs = getComputedStyle(p); if (/(auto|scroll)/.test(cs.overflowY + cs.overflowX) && (p.scrollHeight > p.clientHeight + 2 || p.scrollWidth > p.clientWidth + 2)) return p; } return null; };
  const visibleEnSuCaja = (e, r) => { const sc = conScroll(e); if (!sc) return true; const q = sc.getBoundingClientRect(); const cx = r.left + r.width / 2, cy = r.top + r.height / 2; return cx >= q.left && cx <= q.right && cy >= q.top && cy <= q.bottom; };
  const tapados = [], fuera = [], pares = [];
  const vivos = [];
  for (const e of els) {
    const r = e.getBoundingClientRect(); const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    if (!visibleEnSuCaja(e, r)) continue;                       // recortado por el scroll de su panel: no es un fallo
    if (r.right > innerWidth + 1 || r.bottom > innerHeight + 1 || r.left < -1 || r.top < -1) {
      if (!conScroll(e)) fuera.push(nombre(e) + " caja " + [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)].join(","));
      if (cx > innerWidth || cy > innerHeight || cx < 0 || cy < 0) continue;
    }
    const arriba = document.elementFromPoint(cx, cy);
    if (arriba && arriba !== e && !e.contains(arriba) && !arriba.contains(e) && !(arriba.id || "").startsWith("vd-") && !(arriba.id || "").startsWith("tut-")) {
      // un label o un span decorativo del propio mando no cuenta: tiene que pertenecer a OTRO mando o a otro panel
      const dueño = arriba.closest("button, [role=button], select, input, .tp-rotv, #hk-ribbon, #hk-cad-tit, [id^=hk-]");
      if (dueño && dueño !== e && !dueño.contains(e)) tapados.push(nombre(e) + "  ← tapado por  " + nombre(dueño));
    }
    vivos.push({ e, r });
  }
  for (let i = 0; i < vivos.length; i++) for (let j = i + 1; j < vivos.length; j++) {
    const a = vivos[i], b = vivos[j];
    if (a.e.contains(b.e) || b.e.contains(a.e)) continue;
    const w = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left), h = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top);
    if (w <= 1 || h <= 1) continue;
    const menor = Math.min(a.r.width * a.r.height, b.r.width * b.r.height);
    if (w * h / menor >= 0.2) pares.push(nombre(a.e) + "  ×  " + nombre(b.e) + "  (" + Math.round(100 * w * h / menor) + " % del menor)");
  }
  return { mandos: vivos.length, tapados, pares, fuera };
});
const informe = [];
const estado = async (nombre) => {
  await espera(900);
  const r = await revisar();
  await pag.screenshot({ path: join(OUT, nombre + ".png") });
  const n = r.tapados.length + r.pares.length + r.fuera.length;
  console.log(`\n== ${nombre}: ${r.mandos} mandos a la vista · ${n ? n + " PROBLEMA(S)" : "sin solapes"}`);
  for (const t of r.tapados) console.log("   TAPADO   " + t);
  for (const t of r.pares) console.log("   SE PISAN " + t);
  for (const t of r.fuera) console.log("   FUERA    " + t);
  informe.push({ nombre, ...r });
};
const clicId = (id) => pag.evaluate((id) => { const b = document.getElementById(id); if (b) b.click(); return !!b; }, id);
// HK_URL=<servidor> (p. ej. el vite de un worktree) en vez del bundle; HK_EJEMPLO=<id> añade los estados de ese ejemplo
const URL_BASE = process.env.HK_URL ? process.env.HK_URL.replace(/\/?$/, "/") : `http://localhost:${PUERTO}${BASE}`;
const cargar = async (q) => { await pag.goto(`${URL_BASE}workspace/${q}`, { waitUntil: "networkidle2", timeout: 180000 }); await espera(6500); await pag.keyboard.press("Escape"); await espera(400); };

await cargar("?t=plantillas");
await estado("1_plantilla_al_cargar");
await clicId("hk-ribbon-abrir"); await estado("2_plantilla_cinta_abierta");
await clicId("hk-pane-toggle"); await espera(900); await estado("3_cinta_abierta_panel_derecho_plegado");
await clicId("hk-settings-toggle"); await espera(900); await estado("4_cinta_abierta_los_dos_paneles_plegados");
await clicId("hk-ribbon-plegar"); await estado("5_cinta_plegada_paneles_plegados");
if (process.env.HK_EJEMPLO) {
  await cargar(`?t=${process.env.HK_EJEMPLO}&sinBienvenida=1`); await espera(4000);
  await estado("E1_" + process.env.HK_EJEMPLO + "_al_cargar");
  await clicId("hk-ribbon-abrir"); await espera(600); await estado("E2_" + process.env.HK_EJEMPLO + "_cinta_abierta");
}
await cargar("?t=new-blank");
await estado("6_lienzo_en_blanco_al_cargar");
await clicId("hk-pane-toggle"); await clicId("hk-settings-toggle"); await espera(900); await estado("7_lienzo_en_blanco_paneles_plegados");
writeFileSync(join(OUT, "informe.json"), JSON.stringify({ ventana: [W, H], estados: informe }, null, 1));
const total = informe.reduce((s, e) => s + e.tapados.length + e.pares.length + e.fuera.length, 0);
console.log(`\nTOTAL: ${total} problema(s) en ${informe.length} estados · capturas en cli/shots/_solapes/`);
await nav.close(); srv.close();
