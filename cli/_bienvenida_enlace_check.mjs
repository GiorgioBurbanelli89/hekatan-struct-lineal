// Sonda: con un enlace a un MODELO no sale la bienvenida (solo 🙋 y ES/EN); sin parámetros, sí.
import puppeteer from "puppeteer";
import { mkdirSync } from "fs";
const PUERTO = process.argv[2] || "4610"; const OUT = "cli/shots/bienvenida"; mkdirSync(OUT, { recursive: true });
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const err = [];
for (const [nom, q, w, h] of [["workspace", "", 1920, 1080], ["zapata", "t=zapata-excentrica", 1920, 1080], ["m", "m=cNdgGBOgjQDYiic4", 1920, 1080], ["mdiseno", "m=e3qQ74c6C2sEmWPq&diseno=1", 1920, 1080], ["workspace", "", 1366, 768], ["zapata", "t=zapata-excentrica", 1366, 768]]) {
  const pag = await nav.newPage(); pag.on("pageerror", (e) => err.push(nom + ": " + e.message.slice(0, 120)));
  await pag.evaluateOnNewDocument(() => { try { localStorage.setItem("hk_drawingPoints", "[[0,0,0],[1,0,0],[1,1,0],[0,1,0],[0,0,1]]"); localStorage.setItem("hk_drawingPolylines", "[[0,1,2,3]]"); } catch (e) {} });
  await pag.setViewport({ width: w, height: h });
  await pag.goto(`http://localhost:${PUERTO}/workspace/?${q}${q ? "&" : ""}bienvenida=1`, { waitUntil: "networkidle2", timeout: 120000 }).catch(() => {});
  await new Promise((r) => setTimeout(r, 9000));
  const m = await pag.evaluate(() => ({ cuadro: !!document.getElementById("hk-bienv"), ayudo: document.getElementById("hk-agente-lanzador")?.textContent || null,
    idioma: document.getElementById("hk-idioma-btn")?.textContent || null, recuperar: document.querySelectorAll("#hk-bienv-recuperar").length,
    avisoSuelto: [...document.querySelectorAll("div")].some((d) => /Hay un dibujo guardado/.test(d.textContent || "") && getComputedStyle(d).position === "fixed") }));
  console.log(`${nom} ${w}:`, JSON.stringify(m));
  await pag.screenshot({ path: `${OUT}/enlace_${nom}_${w}.png` }); await pag.close();
}
console.log("pageerror:", err.length ? err : 0); await nav.close();
