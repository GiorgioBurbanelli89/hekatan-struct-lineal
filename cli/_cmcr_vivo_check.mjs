// Planta CM/CR en vivo: test-m-dual, casilla on, muros paso a paso (teclado real); captura de cada paso.
import puppeteer from "puppeteer";
import { mkdirSync } from "node:fs";
const DIR = "cli/shots/cmcr_vivo"; mkdirSync(DIR, { recursive: true });
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1600, height: 1000 });
const err = []; pag.on("pageerror", (e) => err.push(String(e)));
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const P = Buffer.from(JSON.stringify({ ms: 1.0 })).toString("base64");
await pag.goto(`https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=test-m-dual&p=${P}&v=${Date.now()}`, { waitUntil: "networkidle2", timeout: 120000 }); await espera(9000);
const abrir = (t) => pag.evaluate((t) => { const e = [...document.querySelectorAll(".tp-fldv_t")].find((x) => x.innerText.includes(t)); if (e && !e.closest(".tp-fldv").classList.contains("tp-fldv-expanded")) e.click(); }, t);
const poner = async (etq, v) => { const h = await pag.evaluateHandle((etq) => [...document.querySelectorAll(".tp-lblv")].find((x) => x.querySelector(".tp-lblv_l")?.innerText.trim().startsWith(etq) && x.getBoundingClientRect().width), etq);
  const el = h.asElement(); if (!el) return console.log("sin", etq); await el.evaluate((e) => e.scrollIntoView({ block: "center" }));
  const c = await el.$(".tp-ckbv_w"); if (c) { await c.click(); return; }
  const i = await el.$("input"); await i.click({ clickCount: 3 }); await pag.keyboard.type(String(v)); await pag.keyboard.press("Enter"); };
const leer = () => pag.evaluate(() => document.querySelector("#hk-cmcr-vivo")?.innerText.split("\n")[1] ?? "—");
await abrir("Sismo NEC"); await espera(500); await poner("🎯 Planta CM/CR en vivo"); await espera(3000);
console.log("1 muro:", await leer()); await pag.screenshot({ path: `${DIR}/0_un_muro.png` });
await abrir("Muros de corte"); await poner("N° de muros", 2); await espera(5000); console.log("2 muros (defecto):", await leer()); await pag.screenshot({ path: `${DIR}/1.png` });
await abrir("Muros de corte"); await poner("N° de muros", 4); await espera(5000); console.log("4 muros (defecto, lados completos):", await leer()); await pag.screenshot({ path: `${DIR}/2.png` });
for (const [k, v, n] of [["Muro 2 · vano inicial", 1, 3], ["Muro 2 · ancho", 1, 4], ["Muro 3 · vano inicial", 1, 5], ["Muro 3 · ancho", 1, 6], ["Muro 4 · ancho", 1, 7]]) {
  await abrir("Muros de corte"); await poner(k, v); await espera(5000); console.log(k, "=", v, ":", await leer()); await pag.screenshot({ path: `${DIR}/${n}.png` });
}
console.log("errores", err); await nav.close();
