// SONDA: el orden de Settings ▸ Analyze en Case / Combo / Mode, con fotograma de cada uno, y que
// al cambiar de modo SE MUEVA (fotogramas seguidos distintos). Uso: node cli/_sonda_settings.mjs [URL_BASE]
import puppeteer from "puppeteer";
const BASE = process.argv[2] || "http://localhost:4795/hekatan-struct-lineal/";
const U = BASE + "workspace/?m=7nF68EUiy5UVJuli&modal=80";
const OUT = "cli/shots/sonda_modos";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const p = await nav.newPage(); await p.setViewport({ width: 1500, height: 950 });
const errs = []; p.on("pageerror", e => errs.push(e.message));
await p.goto(U, { waitUntil: "domcontentloaded", timeout: 120000 });
await p.waitForFunction(() => !!document.getElementById("modal-results")?.innerText?.includes("MODAL"), { timeout: 240000 }).catch(() => errs.push("sin tabla modal"));
await new Promise(r => setTimeout(r, 4000));
// la fila de «Analyze»: lo que hay entre «Analyze» y «Node results», en orden
const orden = () => p.evaluate(() => {
  const filas = [...document.querySelectorAll("#settings .tp-lblv, #settings .tp-fldv_t, #settings .tp-btnv_t")]
    .map(e => e.classList.contains("tp-lblv")
      ? (e.querySelector(".tp-lblv_l")?.textContent.trim() + " = " + (e.querySelector("select")?.selectedOptions[0]?.textContent.trim() ?? e.querySelector("input")?.checked))
      : e.textContent.trim());
  const i = filas.findIndex(t => /Analyze/.test(t)), j = filas.findIndex(t => /^Node results/.test(t));
  return filas.slice(i, j);
});
const poner = (label, texto) => p.evaluate((label, texto) => {
  const f = [...document.querySelectorAll("#settings .tp-lblv")].find(e => e.querySelector(".tp-lblv_l")?.textContent.trim() === label);
  const s = f?.querySelector("select"); if (!s) return "no hay " + label;
  const o = [...s.options].find(o => o.textContent.replace(/\s+/g, " ").trim().startsWith(texto)); if (!o) return "no hay opcion " + texto;
  s.value = o.value; s.dispatchEvent(new Event("change", { bubbles: true })); return o.textContent.trim();
}, label, texto);
const v = await p.evaluate(() => document.querySelector("#viewer").getBoundingClientRect().toJSON());
const clip = { x: v.x + 40, y: v.y + 40, width: Math.min(700, v.width - 80), height: Math.min(420, v.height - 80) };
const settingsClip = await p.evaluate(() => document.querySelector("#settings").getBoundingClientRect().toJSON());
const mueve = async () => { const a = await p.screenshot({ clip }); await new Promise(r => setTimeout(r, 400)); const b = await p.screenshot({ clip }); return Buffer.compare(a, b) !== 0; };
const pasos = [["inicio (Mode)", null, null], ["Modo 2", "Modo", "2 (T"], ["Modo 3", "Modo", "3 (T"], ["Combo", "Resultado", "Combo"], ["Case", "Resultado", "Case"], ["Mode otra vez", "Resultado", "Mode"], ["Modo 1", "Modo", "1 (T"]];
for (const [n, lab, txt] of pasos) {
  const r = lab ? await poner(lab, txt) : "—";
  await new Promise(r => setTimeout(r, 2500));
  const tag = n.replace(/\W+/g, "_");
  await p.screenshot({ path: `${OUT}/settings_${tag}.png`, clip: { x: settingsClip.x, y: settingsClip.y, width: settingsClip.width, height: Math.min(560, settingsClip.height) } });
  console.log(JSON.stringify({ paso: n, puse: r, se_mueve: await mueve(), analyze: await orden() }));
}
console.log(JSON.stringify({ errs: errs.slice(0, 5) }));
await nav.close();
