#!/usr/bin/env node
/**
 * El ribbon CAD (`?ribbon=1`), probado como lo usaria alguien: TECLAS de una
 * letra como en AutoCAD y clics reales sobre el lienzo. Deja PNG por paso y
 * el GIF.
 *
 *   node cli/ctl_ribbon.mjs
 */
import puppeteer from "puppeteer";
import { mkdirSync, writeFileSync, readFileSync, existsSync, statSync, rmSync } from "fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";
import { execFileSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "shots");
const FR = join(OUT, "ctl_ribbon");
rmSync(FR, { recursive: true, force: true });
mkdirSync(FR, { recursive: true });
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
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
await new Promise((r) => srv.listen(4709, r));
const nav = await puppeteer.launch({ headless: "new",
  args: ["--no-sandbox","--disable-setuid-sandbox","--enable-unsafe-swiftshader",
         "--use-angle=swiftshader","--window-size=1500,1000"] });
const pag = await nav.newPage();
await pag.setViewport({ width: 1500, height: 1000 });
const errores = [], consola = [];
pag.on("pageerror", (e) => errores.push(e.message));
pag.on("console", (m) => consola.push(`[${m.type()}] ${m.text()}`));
// SIN `&ribbon=1` a proposito: se prueba lo que ve quien entra normal.
await pag.goto(`http://localhost:4709${BASE}workspace/?t=new-blank`,
               { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 8000));

await pag.evaluate(() => {
  const c = document.createElement("div");
  c.id = "ctl-cursor";
  c.style.cssText = "position:fixed;width:16px;height:16px;pointer-events:none;z-index:99999;" +
    "border:2px solid #fbbf24;border-radius:50%;transform:translate(-50%,-50%);" +
    "background:radial-gradient(circle,#ef4444 30%,transparent 65%);box-shadow:0 0 8px #ef4444;left:-60px;top:-60px";
  document.body.appendChild(c);
  const t = document.createElement("div");
  t.id = "ctl-paso";
  t.style.cssText = "position:fixed;bottom:56px;left:50%;transform:translateX(-50%);padding:6px 16px;" +
    "background:rgba(15,23,42,.96);color:#22d3ee;border:1px solid #22d3ee;border-radius:8px;" +
    "font:13px Consolas,monospace;z-index:99998";
  document.body.appendChild(t);
  window.__ctlAt = (x, y) => { const e = document.getElementById("ctl-cursor");
    if (e) { e.style.left = x + "px"; e.style.top = y + "px"; } };
  window.__ctlPaso = (s) => { const e = document.getElementById("ctl-paso"); if (e) e.textContent = s; };
});
let nf = 0;
const foto = async (txt) => {
  if (txt !== undefined) await pag.evaluate((t) => window.__ctlPaso(t), txt);
  await pag.screenshot({ path: join(FR, `frame_${String(nf++).padStart(2, "0")}.png`) });
};
const filas = [];
const anota = (q, ok, det) => { filas.push({ ok });
  console.log(`${ok ? "  ok  " : "FALLA "} ${q}${det ? "   " + det : ""}`); };
const tool = () => pag.evaluate(() => window.__hekatanCadState?.get?.()?.tool ?? null);
const modelo = () => pag.evaluate(() => {
  const g = (k) => { const v = window[k]; return v && v.val ? v.val : []; };
  const pls = g("__hekatanDrawingPolylines");
  return { nudos: g("__hekatanDrawingPoints").length,
           tramos: pls.reduce((s, p) => s + Math.max(0, p.length - 1), 0),
           ejes: (window.__hekatanAxisGrids || []).length,
           niveles: (window.__hekatanLevels || []).length };
});

anota("el ribbon sale POR DEFECTO, sin parametro en la URL",
      await pag.evaluate(() => !!document.getElementById("hk-ribbon")), "");
// La guia se abre sola la PRIMERA vez: quien entra no sabe ni que existe.
anota("la guia se abre sola la primera vez",
      await pag.evaluate(() => window.__hekatanRibbon?.guiaVisible?.() === true), "");
await foto("La guia se abre sola: que es el plano de trabajo y como empezar");
await pag.keyboard.press("Escape");
await new Promise((r) => setTimeout(r, 500));
anota("Esc cierra la guia",
      await pag.evaluate(() => window.__hekatanRibbon?.guiaVisible?.() === false), "");
// La barra tiene que decir SIEMPRE contra que plano y a que cota se dibuja.
const ref = await pag.evaluate(() => document.getElementById("hk-ribbon-estado")?.textContent || "");
anota("la barra dice el plano y la cota", /PLANTA|ALZADO/.test(ref) && /cota Z/.test(ref), ref.slice(0, 60));
// Un ARCHIVO NUEVO abre vacio. El dibujo se guardaba en localStorage y se
// restauraba en cada carga sin avisar, asi que «Archivo nuevo (lienzo CAD)»
// aparecia con el modelo de la ultima vez, de otro dia y a medio hacer.
{
  const m = await modelo();
  anota("un archivo nuevo abre con el lienzo VACIO",
        m.nudos === 0 && m.tramos === 0, `${m.nudos} nudos, ${m.tramos} tramos`);
}
await foto("El ribbon: una FILA pegada al lienzo, con la letra del atajo");

// ── 1) La rejilla desde la propia barra ─────────────────────────────────────
const bG = await pag.evaluate(() => {
  const b = Array.from(document.querySelectorAll("#hk-ribbon button"))
    .find((x) => (x.textContent || "").includes("Rejilla"));
  if (!b) return null;
  const q = b.getBoundingClientRect();
  return { x: q.left + q.width / 2, y: q.top + q.height / 2 };
});
if (bG) {
  await pag.evaluate((x, y) => window.__ctlAt(x, y), bG.x, bG.y);
  await foto("Los vanos ya estan escritos en la barra: 4x6 · 3x5 · 4x3");
  await pag.mouse.click(bG.x, bG.y);
  await new Promise((r) => setTimeout(r, 2200));
}
const m1 = await modelo();
anota("un boton levanta la estructura", m1.ejes === 9 && m1.tramos === 80,
      `${m1.ejes} ejes, ${m1.niveles} niveles, ${m1.tramos} columnas, ${m1.nudos} nudos`);
await pag.evaluate(() => window.__hekatanAutoFit?.());
await new Promise((r) => setTimeout(r, 1200));
await foto("9 ejes · 5 niveles · 80 columnas, de un boton");

// ── 1b) El PUNTO DE REFERENCIA al cambiar de plano ─────────────────────────
// Dibujar en planta y pasar al alzado dejaba el plano vertical SIEMPRE en el
// origen: si la planta va de y=0 a y=15, el alzado cortaba por y=0 y no habia
// nada que dijera por donde. Ahora se ancla al ultimo punto dibujado.
{
  const ref = await pag.evaluate(() => {
    const pts = window.__hekatanDrawingPoints?.val ?? [];
    return pts.length ? pts[pts.length - 1] : null;
  });
  await pag.evaluate(() => {
    const b = Array.from(document.querySelectorAll("button.tp-btnv_b"))
      .find((e) => (e.textContent || "").includes("Plano XZ"));
    b && b.click();
  });
  await new Promise((r) => setTimeout(r, 1400));
  const st = await pag.evaluate(() => ({
    grid: window.__hekatanDrawingGridTarget?.val?.position ?? null,
    ref: window.__hekatanPuntoRef ?? null,
    barra: document.getElementById("hk-ribbon-estado")?.textContent || "",
  }));
  anota("el alzado se ancla al ultimo punto, no al origen",
        !!ref && !!st.grid && Math.abs(st.grid[1] - ref[1]) < 1e-6,
        `ultimo punto Y=${ref ? ref[1].toFixed(2) : "?"} · plano en Y=${st.grid ? st.grid[1].toFixed(2) : "?"}`);
  anota("la barra dice por donde corta", /pasa por Y/.test(st.barra), st.barra.slice(0, 70));
  // El marcador existe y se ve en cámara ortogonal; en perspectiva se OCULTA a propósito (se
  // quedaba flotando sobre la cercha en el 3D del Tutorial 9).
  anota("hay marcador del punto de referencia (visible salvo en perspectiva)",
        await pag.evaluate(() => {
          const ctx = document.querySelector("#viewer")?.__ctx;
          let o = null;
          ctx?.scene.traverse((x) => { if (x.name === "punto-referencia") o = x; });
          window.__dbgRef = { existe: !!o, visible: o && o.visible, persp: !!ctx.camera.isPerspectiveCamera, plano: window.__hekatanPlanoRef };
          if (!o) return false;
          return o.visible === !ctx.camera.isPerspectiveCamera;
        }), JSON.stringify(await pag.evaluate(() => window.__dbgRef)));
  await foto("Alzado anclado al ultimo punto — la barra dice por donde corta");
  await pag.evaluate(() => {
    const b = Array.from(document.querySelectorAll("button.tp-btnv_b"))
      .find((e) => (e.textContent || "").includes("Plano XY (planta)"));
    b && b.click();
  });
  await new Promise((r) => setTimeout(r, 1200));
}

// ── 2) Las TECLAS, como AutoCAD ─────────────────────────────────────────────
// (P es PAN y Q no es nada en AutoCAD: la cinta rotula PL y LO, y esos son los alias.)
for (const [k, esperado, txt] of [["l","line","L → Linea"],
                                  ["pl","polyline","PL → Polilinea"],
                                  ["k","col","K → Columna"],
                                  ["lo","area","LO → Losa"]]) {
  // Las letras se acumulan en la ventana de comandos y el ESPACIO/Enter ejecuta, como en AutoCAD.
  await pag.keyboard.press("Escape");
  await new Promise((r) => setTimeout(r, 200));
  await pag.keyboard.type(k + " ", { delay: 40 });
  await new Promise((r) => setTimeout(r, 420));
  const t = await tool();
  const foco = await pag.evaluate(() => {
    const a = document.activeElement;
    return a ? `${a.tagName}#${a.id || "-"} valor="${(a.value ?? "").slice(0,12)}"` : "nada";
  });
  anota(`tecla '${k}' activa ${esperado}`, t === esperado, `tool = ${t} · foco = ${foco}`);
  await foto(txt);
}

// ── 3) Vistas por número ────────────────────────────────────────────────────
for (const [k, txt] of [["4","Tecla 4 → 3D"], ["1","Tecla 1 → Planta"]]) {
  await pag.keyboard.press("Escape");         // con herramienta activa un dígito es una coordenada
  await new Promise((r) => setTimeout(r, 200));
  await pag.keyboard.press(k);
  await new Promise((r) => setTimeout(r, 1500));
  await pag.evaluate(() => window.__hekatanAutoFit?.());
  await new Promise((r) => setTimeout(r, 900));
  await foto(txt);
}

// ── 4) Dibujar una viga con el raton, encima de la rejilla ─────────────────
await pag.keyboard.press("Escape");
await pag.keyboard.type("l ", { delay: 40 });
await new Promise((r) => setTimeout(r, 350));
const cv = await pag.evaluate(() => {
  const c = document.querySelector("#viewer canvas"); const r = c.getBoundingClientRect();
  return { x: r.left, y: r.top, w: r.width, h: r.height };
});
await foto("Tecla L y a dibujar: sin tocar ningun menu");
for (const [dx, dy] of [[0.38,0.42],[0.60,0.42],[0.60,0.60]]) {
  const x = cv.x + cv.w * dx, y = cv.y + cv.h * dy;
  await pag.evaluate((a, b) => window.__ctlAt(a, b), x, y);
  await pag.mouse.move(x, y);
  await new Promise((r) => setTimeout(r, 260));
  await pag.mouse.click(x, y);
  await new Promise((r) => setTimeout(r, 520));
  await foto();
}
const m2 = await modelo();
anota("los clics anaden tramos sobre la rejilla", m2.tramos > m1.tramos,
      `${m1.tramos} -> ${m2.tramos}`);
await pag.keyboard.press("Escape");
await pag.keyboard.press("4");
await new Promise((r) => setTimeout(r, 1500));
await pag.evaluate(() => window.__hekatanAutoFit?.());
await new Promise((r) => setTimeout(r, 1200));
await foto("La estructura levantada");
await foto();

writeFileSync(join(OUT, "ctl_ribbon.errores.txt"),
  ["== pageerror ==", ...errores, "", "== consola ==", ...consola.slice(-120)].join("\n"), "utf-8");
console.log(`\n${errores.length} pageerror`);
await nav.close(); srv.close();
try {
  execFileSync("ffmpeg", ["-y", "-framerate", "0.85", "-i", join(FR, "frame_%02d.png"),
    "-vf", "scale=1150:-1:flags=lanczos,split[a][b];[a]palettegen[p];[b][p]paletteuse",
    join(OUT, "ctl_ribbon.gif")], { stdio: "pipe" });
  console.log(`GIF -> cli/shots/ctl_ribbon.gif   (${nf} fotogramas)`);
} catch (e) { console.log("sin GIF:", String(e).slice(0, 120)); }
const malas = filas.filter((f) => !f.ok).length;
console.log(malas ? `FALLA: ${filas.length - malas}/${filas.length}` : `OK: ${filas.length}/${filas.length}`);
process.exit(malas ? 1 : 0);
