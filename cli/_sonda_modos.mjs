// SONDA: elegir modos en Hekatan Struct (deploy público) y ver con fotogramas si SE MUEVE tras cada cambio.
import puppeteer from "puppeteer";
const U = "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?m=7nF68EUiy5UVJuli&modal=80";
const OUT = "cli/shots/sonda_modos";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const p = await nav.newPage(); await p.setViewport({ width: 1500, height: 950 });
const errs = []; p.on("pageerror", e => errs.push(e.message));
await p.goto(U, { waitUntil: "domcontentloaded", timeout: 120000 });
await p.waitForFunction(() => !!document.getElementById("modal-results")?.innerText?.includes("MODAL"), { timeout: 240000 }).catch(() => errs.push("sin tabla modal"));
await new Promise(r => setTimeout(r, 4000));
const v = await p.evaluate(() => document.querySelector("#viewer").getBoundingClientRect().toJSON());
const clip = { x: v.x + 40, y: v.y + 40, width: Math.min(700, v.width - 80), height: Math.min(420, v.height - 80) };
const leer = () => p.evaluate(() => Object.fromEntries([...document.querySelectorAll("#settings .tp-lblv")]
  .map(e => [e.querySelector(".tp-lblv_l")?.textContent.trim(), e.querySelector("select")?.selectedOptions[0]?.textContent.trim() ?? e.querySelector("input")?.checked])
  .filter(([k]) => /^(Resultado|Case|Combo|Modo|🎞 Animar)$/.test(k))));
const poner = (label, valorIdx, texto) => p.evaluate((label, valorIdx, texto) => {
  const f = [...document.querySelectorAll("#settings .tp-lblv")].find(e => e.querySelector(".tp-lblv_l")?.textContent.trim() === label);
  const s = f?.querySelector("select"); if (!s) return "no hay " + label;
  const o = texto ? [...s.options].find(o => o.textContent.trim().startsWith(texto)) : s.options[valorIdx];
  if (!o) return "no hay opcion";
  s.value = o.value; s.dispatchEvent(new Event("change", { bubbles: true })); return o.textContent.trim();
}, label, valorIdx, texto);
const pasos = [["Modo", 1], ["Modo", 2], ["Modo", 0], ["Modo", 4], ["Resultado", null, "Case"], ["Case", null, "Dead"], ["Resultado", null, "Mode"], ["Modo", 1]];
for (let i = 0; i < pasos.length; i++) {
  const [lab, idx, txt] = pasos[i];
  const r = await poner(lab, idx, txt);
  await new Promise(r => setTimeout(r, 2500));
  for (let k = 0; k < 3; k++) { await p.screenshot({ path: `${OUT}/p${i}_${k}.png`, clip }); await new Promise(r => setTimeout(r, 350)); }
  console.log(JSON.stringify({ paso: i, puse: `${lab} = ${r}`, estado: await leer() }));
}
console.log(JSON.stringify({ errs: errs.slice(0, 5) }));
await nav.close();
