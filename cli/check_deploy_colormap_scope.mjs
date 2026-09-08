// Verifica en el deploy: (a) "Rango colormap: solo muros" pinta el muro y=0 del dual con gradiente,
// (b) la leyenda no recorta etiquetas, (c) en un portico sin cascaras la leyenda se esconde.
import puppeteer from "puppeteer";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--disable-setuid-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const abrir = async (id) => { const p = await nav.newPage(); await p.setViewport({ width: 1500, height: 1000 }); await p.goto(`https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=${id}`, { waitUntil: "networkidle2", timeout: 120000 }); await new Promise((r) => setTimeout(r, 8000)); return p; };
const setSel = (p, label, texto) => p.evaluate((label, texto) => { const row = [...document.querySelectorAll(".tp-lblv")].find((e) => e.querySelector(".tp-lblv_l")?.textContent.trim().includes(label)); const sel = row?.querySelector("select"); if (!sel) return "no select"; const opt = [...sel.options].find((o) => o.textContent.includes(texto)); if (!opt) return "no opt: " + [...sel.options].map((o) => o.textContent).join("|"); sel.value = opt.value; sel.dispatchEvent(new Event("change", { bubbles: true })); return "ok"; }, label, texto);
const leg = (p) => p.evaluate(() => ({ hidden: document.getElementById("legend")?.hidden, labels: [...document.querySelectorAll("#legend p")].map((e) => e.innerText), anchos: [...document.querySelectorAll("#legend p")].map((e) => Math.round(e.getBoundingClientRect().width)) }));
// (a) dual
let p = await abrir("edificio-dual");
console.log(JSON.stringify({ paso: "dual F22 por defecto", leg: await leg(p) }));
await p.screenshot({ path: "cli/shots/deploy/_v3_dual_auto.png" });
const r1 = await setSel(p, "Rango colormap", process.argv[2] ?? "muros Y"); await new Promise((r) => setTimeout(r, 2500)); await p.evaluate(() => { const ctx = [...document.querySelectorAll("div")].map(d => d.__ctx).find(Boolean); ctx.render?.(); });
await new Promise((r) => setTimeout(r, 800)); await p.screenshot({ path: "cli/shots/deploy/_v3_dual_muros.png" });
console.log(JSON.stringify({ paso: "dual rango=" + (process.argv[2] ?? "muros Y"), set: r1, leg: await leg(p) }));
// diagrid parametrico accesible por URL
await p.close(); p = await abrir("diagrid"); console.log(JSON.stringify({ paso: "diagrid", titulo: await p.evaluate(() => document.querySelector(".tp-rotv_t")?.textContent?.trim()), nudos: await p.evaluate(() => window.__hekatanStates?.nodes?.val?.length) })); await p.close();
// (b) placa-base leyenda
p = await abrir("placa-base"); console.log(JSON.stringify({ paso: "placa-base leyenda", leg: await leg(p) })); await p.close();
// (c) portico sin cascaras
p = await abrir("test-m-portico"); console.log(JSON.stringify({ paso: "test-m-portico leyenda", leg: await leg(p) })); await p.close();
await nav.close();
