// Sonda: la cinta de acceso rápido a 1280×720, 1366×768 y 1920×1080.
// Mide si algún botón de la cinta se sale, se tapa o se solapa con otro, y guarda un PNG por ancho.
//   node cli/_cinta_anchos.mjs [puerto] [salida_dir] [pestaña]
import puppeteer from "puppeteer";
import { mkdirSync } from "fs";
const PUERTO = process.argv[2] || "4610";
const OUT = process.argv[3] || "cli/shots/cinta";
const PEST = process.argv[4] || "";
mkdirSync(OUT, { recursive: true });
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const pag = await nav.newPage();
const errores = [];
pag.on("pageerror", (e) => errores.push(e.message.slice(0, 160)));
let fallos = 0;
for (const [w, h] of [[1280, 720], [1366, 768], [1920, 1080]]) {
  await pag.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  await pag.goto(`http://localhost:${PUERTO}/workspace/?t=new-blank`, { waitUntil: "networkidle2", timeout: 120000 });
  await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 });
  await new Promise((r) => setTimeout(r, 2500));
  await pag.evaluate(() => { try { window.__hekatanRibbon?.guia?.(false); window.__hekatanRibbonPlegar?.(false); } catch (e) {} });
  if (PEST) await pag.evaluate((p) => window.__hekatanRibbon?.pestana?.(p), PEST);
  await new Promise((r) => setTimeout(r, 800));
  const m = await pag.evaluate(() => {
    const cinta = document.getElementById("hk-ribbon");
    if (!cinta) return { error: "sin cinta" };
    const rc = cinta.getBoundingClientRect();
    const els = [...cinta.querySelectorAll("button, input")].filter((e) => e.offsetParent !== null);
    const R = els.map((e) => ({ t: (e.textContent || e.value || e.title || "").replace(/\s+/g, " ").trim().slice(0, 18), r: e.getBoundingClientRect() }));
    const fuera = [], tapados = [], solapes = [];
    for (const x of R) {
      const r = x.r;
      if (r.width < 2) continue;
      if (r.left < rc.left - 1 || r.right > rc.right + 1 || r.right > window.innerWidth || r.left < 0) fuera.push(`${x.t} [${Math.round(r.left)}-${Math.round(r.right)}]`);
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const top = document.elementFromPoint(cx, cy);
      const el = els[R.indexOf(x)];
      if (top && top !== el && !el.contains(top) && !top.contains(el)) tapados.push(`${x.t} ← ${top.id || top.className || top.tagName}`);
    }
    for (let i = 0; i < R.length; i++) for (let j = i + 1; j < R.length; j++) {
      const a = R[i].r, b = R[j].r;
      const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left), oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      if (ox > 1 && oy > 1 && !els[i].contains(els[j]) && !els[j].contains(els[i])) solapes.push(`${R[i].t} × ${R[j].t}`);
    }
    // filas con desplazamiento interno (botones escondidos por overflow)
    const filas = [...cinta.children].filter((f) => f.scrollWidth > f.clientWidth + 2).map((f) => `${f.scrollWidth}>${f.clientWidth}`);
    return { cinta: [Math.round(rc.left), Math.round(rc.right), Math.round(rc.bottom)], n: R.length, fuera, tapados, solapes, filasConScroll: filas };
  });
  const ok = !m.error && !m.fuera.length && !m.tapados.length && !m.solapes.length && !m.filasConScroll.length;
  if (!ok) fallos++;
  console.log(`${w}x${h}: ${ok ? "OK" : "FALLA"}`, JSON.stringify(m));
  await pag.screenshot({ path: `${OUT}/cinta_${w}${PEST ? "_" + PEST : ""}.png`, clip: { x: 0, y: 0, width: w, height: Math.min(h, 260) } });
}
if (errores.length) console.log("pageerror:", errores.slice(0, 5));
await nav.close();
process.exit(fallos ? 1 : 0);
