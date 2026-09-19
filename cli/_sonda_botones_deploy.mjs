// Sonda: TODOS los botones del workspace que NO son del Tweakpane (barra de arriba, cinta, flotantes),
// en el DEPLOY PÚBLICO, con su id, título, texto y caja; y lo que abren «Menú», «?», «Tutorial».
//   node cli/_sonda_botones_deploy.mjs [url]
import puppeteer from "puppeteer";
import { writeFileSync, mkdirSync } from "fs";
const URL0 = process.argv[2] || "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=plantillas";
const OUT = "cli/shots/_sonda_deploy"; mkdirSync(OUT, { recursive: true });
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"] });
const pag = await nav.newPage();
await pag.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });
await pag.goto(URL0, { waitUntil: "networkidle2", timeout: 180000 });
await new Promise((r) => setTimeout(r, 7000));
const lista = () => pag.evaluate(() => {
  const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== "hidden"; };
  return [...document.querySelectorAll("button, [role=button], a[href], summary")]
    .filter((b) => vis(b) && !b.closest(".tp-rotv") && !b.closest(".tp-dfwv"))
    .map((b) => { const r = b.getBoundingClientRect(); return { id: b.id || "", t: (b.textContent || "").trim().replace(/\s+/g, " ").slice(0, 40), title: (b.title || b.getAttribute("aria-label") || "").slice(0, 90), caja: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)], padre: (b.parentElement?.id || b.parentElement?.className || "").toString().slice(0, 40) }; });
});
const base = await lista();
console.log("== botones fuera del Tweakpane, al cargar:", base.length);
for (const b of base) console.log(JSON.stringify(b));
await pag.screenshot({ path: OUT + "/00_carga.png" });
const pulsa = async (nombre, sel) => {
  const ok = await pag.evaluate((sel) => { const e = typeof sel === "string" && sel.startsWith("#") ? document.querySelector(sel) : [...document.querySelectorAll("button")].find((b) => (b.textContent || "").trim().includes(sel) && !b.closest(".tp-rotv")); if (!e) return false; e.click(); return true; }, sel);
  await new Promise((r) => setTimeout(r, 1800));
  const ahora = await lista();
  const nuevos = ahora.filter((a) => !base.some((b) => b.id === a.id && b.t === a.t && b.caja[0] === a.caja[0] && b.caja[1] === a.caja[1]));
  console.log(`\n== tras «${nombre}» (${ok ? "pulsado" : "NO ENCONTRADO"}): ${nuevos.length} botones nuevos`);
  for (const b of nuevos.slice(0, 60)) console.log(JSON.stringify(b));
  const texto = await pag.evaluate(() => [...document.querySelectorAll("#hk-ribbon-guia, [id*=ayuda], [id*=tutorial], [id*=menu], dialog[open]")].filter((e) => e.getBoundingClientRect().width > 0).map((e) => e.id + ": " + (e.innerText || "").replace(/\s+/g, " ").slice(0, 500)));
  if (texto.length) console.log("   paneles visibles:", JSON.stringify(texto));
  await pag.screenshot({ path: `${OUT}/${nombre}.png` });
};
await pulsa("01_dibujar", "#hk-ribbon-abrir");
await pulsa("02_ayuda", "?");
await pag.keyboard.press("Escape");
await pulsa("03_tutorial", "Tutorial");
await pag.keyboard.press("Escape");
await pulsa("04_mas", "▾");
await pag.keyboard.press("Escape");
await nav.close();
