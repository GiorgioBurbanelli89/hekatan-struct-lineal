// Fotogramas del GIF «exportar a SAP2000 (.s2k) y ETABS (.e2k)». node cli/_gif_exportar.mjs <dir>
import puppeteer from "puppeteer";
import { writeFileSync, readdirSync, statSync } from "node:fs";
const DIR = process.argv[2], DESC = `${DIR}/descargas`;
const URL = "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=muro-manabi&p=" + Buffer.from(JSON.stringify({ modelo: 1, cf: 1, L: 3, sCf: 1.5, ms: 0.3 })).toString("base64");
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1600, height: 1000 });
const cdp = await pag.createCDPSession(); await cdp.send("Page.setDownloadBehavior", { behavior: "allow", downloadPath: DESC.replace(/\//g, "\\") });
await pag.goto(URL, { waitUntil: "networkidle2", timeout: 120000 }); await new Promise((r) => setTimeout(r, 7000));
await pag.evaluate(() => { const p = window.__hekatanHoverPrefs; for (const k in p) p[k].val = false; });   // que no salga nada encima del modelo
const meta = []; let n = 0, cur = [900, 600];
const foto = async (rotulo, clic = false, k = 1, caja = null) => { for (let i = 0; i < k; i++) { const f = `f_${String(n++).padStart(3, "0")}.png`; await pag.screenshot({ path: `${DIR}/${f}` }); meta.push({ f, x: cur[0], y: cur[1], clic, rotulo, caja }); } };
const ir = async (dest, rotulo, pasos = 8) => { const [x0, y0] = cur; for (let i = 1; i <= pasos; i++) { const t = i / pasos, e = t * t * (3 - 2 * t); cur = [x0 + (dest[0] - x0) * e, y0 + (dest[1] - y0) * e]; await pag.mouse.move(cur[0], cur[1]); await foto(rotulo); } };
const boton = () => pag.evaluate(() => { const e = [...document.querySelectorAll("button")].find((x) => x.innerText.includes("Exportar") && x.getBoundingClientRect().y < 40); const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
const item = (txt) => pag.evaluate((txt) => { const e = [...document.querySelectorAll("#hk-menus *, [id*=menu] *")].find((x) => x.children.length === 0 && x.innerText?.trim().includes(txt) && x.getBoundingClientRect().height > 0); const r = e.getBoundingClientRect(); return { p: [r.x + 30, r.y + r.height / 2], caja: [r.x - 8, r.y - 4, r.x + 300, r.y + r.height + 20] }; }, txt);
const esperaArchivo = async (ext) => { for (let i = 0; i < 40; i++) { const f = readdirSync(DESC).find((q) => q.endsWith(ext)); if (f) return `${f} (${(statSync(`${DESC}/${f}`).size / 1024).toFixed(0)} kB)`; await new Promise((r) => setTimeout(r, 250)); } return null; };
const exportar = async (txt, ext, r1, r2) => {
  await ir(await boton(), r1, 9); await foto(r1, true, 2); await pag.mouse.click(cur[0], cur[1]); await new Promise((r) => setTimeout(r, 700)); await foto(r1, false, 4);
  const it = await item(txt); await ir(it.p, r1, 8); await foto(r1, false, 5, it.caja); await foto(r1, true, 2, it.caja);
  await pag.mouse.click(it.p[0], it.p[1]);
  const f = await esperaArchivo(ext); console.log("descargado:", f);
  await new Promise((r) => setTimeout(r, 600)); await ir([1150, 650], r2.replace("ARCHIVO", f ?? "?"), 8); await foto(r2.replace("ARCHIVO", f ?? "?"), false, 14);
};
await foto("Muro con contrafuertes en Hekatan Struct", false, 5);
await exportar("SAP2000 (.s2k)", ".s2k", "Barra de arriba › «Exportar» › «SAP2000 (.s2k)»", "Se descarga ARCHIVO  ·  SAP2000: File › Import › SAP2000 .s2k");
await exportar("ETABS (.e2k)", ".e2k", "«Exportar» › «ETABS (.e2k)»", "Se descarga ARCHIVO  ·  ETABS: File › Import › ETABS .e2k");
writeFileSync(`${DIR}/meta.json`, JSON.stringify(meta), "utf-8");
console.log("fotogramas", n);
await nav.close();
