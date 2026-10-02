// Panel de ACCESO RÁPIDO: capturas a 1600×1000 y a ancho de teléfono, ejemplos con parámetros, plantillas, enlace corto.
//   node cli/_acceso_check.mjs <base> <carpeta>
import puppeteer from "puppeteer";
import { mkdirSync } from "node:fs";
const [base = "http://localhost:4610/hekatan-struct-lineal", dir = "cli/shots/acceso"] = process.argv.slice(2);
mkdirSync(dir, { recursive: true });
const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const P = Buffer.from(JSON.stringify({ tipo: 2, ejesX: "0,5,11,15", ejesY: "0,4.5,9.5", pisos: 4, h: 3, h1: 3.6, volXp: 1.2, volYm: 1.5, volXm: 0, volYp: 0, formLosa: 51, tlosa: 0.25, offsets: 0 })).toString("base64");
const casos = [["edificio", `/workspace/?t=edificio-aporticado`], ["plantillas", `/workspace/?t=plantillas&p=${P}`], ["zapata", `/workspace/?t=zapata-aislada`], ["blank", `/workspace/?t=new-blank`]];
const rep = {};
for (const [nom, ruta] of casos) for (const [ancho, alto] of [[1600, 1000], [400, 860]]) {
  const p = await b.newPage(); await p.setViewport({ width: ancho, height: alto });
  const errs = []; p.on("pageerror", (e) => errs.push(String(e).slice(0, 160)));
  await p.goto(base + ruta + (ruta.includes("?") ? "&" : "?") + "v=" + Date.now(), { waitUntil: "networkidle2", timeout: 180000 }); await espera(9000);
  const info = await p.evaluate(() => {
    const a = document.getElementById("hk-acceso"), r = a?.getBoundingClientRect();
    const g = [...(a?.querySelectorAll(".ar-g") ?? [])].map((x) => x.querySelector(".ar-t")?.textContent + ":" + x.querySelectorAll(".ar-f").length);
    const pane = document.getElementById("hk-pane-host"), set = document.getElementById("settings");
    return { acceso: !!a && a.style.display !== "none", caja: r && [r.x, r.y, r.width, r.height].map(Math.round), grupos: g,
      paneOculto: pane?.style.transform?.includes("translateX") ?? null, settingsOculto: set?.style.transform?.includes("translateX") ?? null,
      anchoBody: document.body.scrollWidth };
  });
  await p.screenshot({ path: `${dir}/${nom}_${ancho}.png` });
  if (ancho === 1600 && nom === "edificio") {
    // abrir DIMENSIONES con la tecla, cambiar el nº de pisos desde el panel → ¿el modelo se rehace?
    await p.keyboard.down("Alt"); await p.keyboard.press("2"); await p.keyboard.up("Alt"); await espera(600);
    const antes = await p.evaluate(() => window.__hekatanStates.nodes.val.length);
    const cambio = await p.evaluate(() => { const i = [...document.querySelectorAll("#hk-acceso [data-k]")].find((e) => /pisos|nPisos|stories|floors/i.test(e.dataset.k)); if (!i) return null; i.value = String(Number(i.value) + 1); i.dispatchEvent(new Event("change")); return i.dataset.k; });
    await espera(5000);
    const despues = await p.evaluate(() => window.__hekatanStates.nodes.val.length);
    info.cambio = { clave: cambio, nudosAntes: antes, nudosDespues: despues, param: await p.evaluate((k) => window.__hekatanGetParams()[k], cambio) };
    await p.screenshot({ path: `${dir}/${nom}_dim_${ancho}.png` });
    await p.keyboard.down("Alt"); await p.keyboard.press("3"); await p.keyboard.up("Alt"); await espera(800);
    await p.screenshot({ path: `${dir}/${nom}_res_${ancho}.png` });
  }
  rep[`${nom}_${ancho}`] = { ...info, errs };
  await p.close();
}
console.log(JSON.stringify(rep, null, 1));
await b.close();
