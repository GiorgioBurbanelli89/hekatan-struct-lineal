import puppeteer from "puppeteer";
const [url, dir] = process.argv.slice(2);
const b = await puppeteer.launch({ headless: "new", protocolTimeout: 240000, args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const espera = (ms) => new Promise(r => setTimeout(r, ms));
async function abrir(movil) {
  const p = await b.newPage();
  if (movil) { await p.setUserAgent("Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Mobile Safari/537.36"); await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }); }
  else await p.setViewport({ width: 1600, height: 900 });
  const log = []; p.on("console", m => log.push(m.text())); p.on("pageerror", e => log.push("PAGEERROR " + e.message));
  await p.goto(url, { waitUntil: "domcontentloaded", timeout: 240000 });
  for (let i = 0; i < 50 && !log.some(t => /Modal OK/.test(t)); i++) await espera(3000);
  await espera(8000); p._log = log; return p;
}
const fila = (p, et) => p.evaluate((e) => { const f = [...document.querySelectorAll(".tp-lblv")].find(l => l.querySelector(".tp-lblv_l")?.textContent?.trim() === e && l.offsetParent !== null); if (!f) return null; const s = f.querySelector("select"); return { valor: s ? s.selectedOptions[0]?.textContent : "(sin select)", opciones: s ? [...s.options].map(o => o.textContent) : null }; }, et);
const elegir = (p, et, empieza) => p.evaluate((e, t) => { const s = [...document.querySelectorAll(".tp-lblv")].find(l => l.querySelector(".tp-lblv_l")?.textContent?.trim() === e && l.offsetParent !== null).querySelector("select"); const o = [...s.options].find(o => o.textContent.trim().startsWith(t)); s.value = o.value; s.dispatchEvent(new Event("change", { bubbles: true })); }, et, empieza);
const firma = (p) => p.evaluate(() => { const v = [...document.querySelectorAll("div")].find(d => d.__ctx); let s = 0; v.__ctx.scene.traverse(o => { const a = o.geometry?.attributes?.position; if (a && o.visible && a.count < 20000) for (let i = 0; i < a.array.length; i += 7) s += a.array[i]; }); return +s.toFixed(3); });
const anima = async (p) => { const a = await firma(p); await espera(400); return a !== await firma(p); };
const estado = async (p, tag) => { const r = await fila(p, "Resultado"); const lista = (await fila(p, "Case")) || (await fila(p, "Combo")) || (await fila(p, "Caso modal")); const m = await fila(p, "Modo"); console.log(`${tag.padEnd(22)} anima=${await anima(p)}  Resultado=${r?.valor}  lista=${lista?.valor}  Modo=${m ? m.valor : "(no)"}`); };

const d = await abrir(false);
const dup = await d.evaluate(() => [...document.querySelectorAll(".tp-lblv_l")].map(l => l.textContent.trim()).filter(t => t === "Modo #" || t === "Modo"));
console.log("etiquetas «Modo»/«Modo #» en pantalla:", JSON.stringify(dup));
await estado(d, "1 al abrir");
await elegir(d, "Modo", "3 "); await espera(2000); await estado(d, "2 Modo 3");
await elegir(d, "Resultado", "Case"); await espera(4000); await estado(d, "3 Case");
await elegir(d, "Resultado", "Combo"); await espera(4000); await estado(d, "4 Combo");
await elegir(d, "Resultado", "Mode"); await espera(3000); await estado(d, "5 Mode");
await d.screenshot({ path: `${dir}/v5_escritorio.png` });
console.log(d._log.filter(t => /PAGEERROR/.test(t)).slice(0, 3).join("\n") || "sin errores de página");
await d.close();

const m = await abrir(true);
const medir = () => m.evaluate(() => { const R = id => { const e = document.getElementById(id); if (!e) return null; const r = e.getBoundingClientRect(); return [Math.round(r.y), Math.round(r.height)]; }; return { viewer: R("viewer"), settings: R("settings"), tabla: R("modal-results"), min: document.documentElement.classList.contains("hk-tabla-min") }; });
await m.screenshot({ path: `${dir}/v5_movil_1_abrir.png` }); console.log("celular abrir:", JSON.stringify(await medir()));
await m.evaluate(() => document.getElementById("modal-minimize").click()); await espera(900);
await m.screenshot({ path: `${dir}/v5_movil_2_tabla_min.png` }); console.log("tabla minimizada:", JSON.stringify(await medir()));
await m.evaluate(() => document.getElementById("modal-minimize").click()); await espera(900);
await m.screenshot({ path: `${dir}/v5_movil_3_tabla_vuelve.png` }); console.log("tabla restaurada:", JSON.stringify(await medir()));
await b.close();
