// ¿Se VE el medidor de GDL del modal? Fotogramas del panel: al abrir, tras correr el modal y pasado
// del tope. Pantalla completa + recorte del panel izquierdo a tamaño legible.
import puppeteer from "puppeteer";
import { mkdirSync } from "node:fs";
const BASE = process.argv[2] || "http://localhost:4600";
const DIR = "cli/shots/ctl_modal_gdl_visible"; mkdirSync(DIR, { recursive: true });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1600, height: 1000 });
const err = []; pag.on("pageerror", (e) => err.push(e.message)); pag.on("dialog", (d) => d.accept().catch(() => {}));
let fallos = 0; const ok = (c, t) => { console.log(`${c ? "ok  " : "FALLA"} ${t}`); if (!c) fallos++; };
const foto = async (n) => {
  await pag.screenshot({ path: `${DIR}/${n}.png` });
  const r = await pag.evaluate(() => { const b = document.getElementById("hk-modal-gdl-panel")?.getBoundingClientRect(); return b ? { x: b.x, y: b.y, w: b.width, h: b.height } : null; });
  if (r) await pag.screenshot({ path: `${DIR}/${n}_panel.png`, clip: { x: 0, y: Math.max(0, r.y - 120), width: 320, height: r.h + 220 } });
  return r;
};
const estado = () => pag.evaluate(() => {
  const c = document.getElementById("hk-modal-gdl-panel"); if (!c) return null;
  const r = c.getBoundingClientRect(), mid = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
  return { txt: c.innerText.replace(/\s+/g, " "), visible: r.width > 50 && r.height > 5 && r.y > 0 && r.y + r.height < innerHeight, tapado: !c.contains(mid), color: c.querySelector("b")?.style.color };
});
await pag.goto(`${BASE}/workspace/index.html?t=plantillas`, { waitUntil: "networkidle2", timeout: 180000 });
await pag.waitForFunction(() => !!window.__hekatanRunModalAnimate, { timeout: 120000 }); await espera(5000);
let e = await estado(); await foto("01_al_abrir");
ok(e?.visible && !e.tapado, "al abrir, a la vista: " + e?.txt);
await pag.evaluate(() => window.__hekatanRunModalAnimate()); await espera(8000);
e = await estado(); await foto("02_modal_corrido");
ok(e?.visible && !e.tapado && /dentro del tope/.test(e.txt), "tras correr el modal: " + e?.txt);
await pag.evaluate(() => { window.__hekatanDofMaxModal = 1500; window.__hekatanRunModalAnimate(); }); await espera(6000);
e = await estado(); await foto("03_pasa_del_tope");
ok(e?.visible && /pasa del tope/.test(e.txt) && /239/.test(e.color), "pasado del tope, en rojo: " + e?.txt);
ok(err.length === 0, "0 errores " + err.join(" | "));
await nav.close(); process.exit(fallos ? 1 : 0);
