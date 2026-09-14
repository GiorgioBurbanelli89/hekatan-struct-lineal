import puppeteer from "puppeteer";
import { execFileSync } from "child_process";
import { mkdirSync } from "fs";
const [url, dir] = process.argv.slice(2);
const FF = "C:/Users/j-b-j/AppData/Roaming/Python/Python312/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe";
const b = await puppeteer.launch({ headless: "new", protocolTimeout: 240000, args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const espera = (ms) => new Promise(r => setTimeout(r, ms));
async function abrir(movil) {
  const p = await b.newPage();
  if (movil) { await p.setUserAgent("Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Mobile Safari/537.36"); await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }); }
  else await p.setViewport({ width: 1600, height: 900 });
  const log = []; p.on("console", m => log.push(m.text())); p.on("pageerror", e => log.push("PAGEERROR " + e.message));
  await p.goto(url, { waitUntil: "domcontentloaded", timeout: 240000 });
  for (let i = 0; i < 50 && !log.some(t => /Modal OK/.test(t)); i++) await espera(3000);
  await espera(6000); p._log = log; return p;
}
const fila = (p, et) => p.evaluate((e) => { const f = [...document.querySelectorAll(".tp-lblv")].find(l => l.querySelector(".tp-lblv_l")?.textContent?.trim() === e); if (!f) return null; const s = f.querySelector("select"); return { visible: f.offsetParent !== null, valor: s ? s.selectedOptions[0]?.textContent : f.querySelector("input")?.checked, opciones: s ? [...s.options].slice(0, 12).map(o => o.textContent) : null }; }, et);
const elegir = (p, et, empieza) => p.evaluate((e, t) => { const s = [...document.querySelectorAll(".tp-lblv")].find(l => l.querySelector(".tp-lblv_l")?.textContent?.trim() === e).querySelector("select"); const o = [...s.options].find(o => o.textContent.trim().startsWith(t)); s.value = o.value; s.dispatchEvent(new Event("change", { bubbles: true })); }, et, empieza);
const firma = (p) => p.evaluate(() => { const v = [...document.querySelectorAll("div")].find(d => d.__ctx); let s = 0; v.__ctx.scene.traverse(o => { const a = o.geometry?.attributes?.position; if (a && o.visible && a.count < 20000) for (let i = 0; i < a.array.length; i += 7) s += a.array[i]; }); return +s.toFixed(3); });
const anima = async (p) => { const a = await firma(p); await espera(400); return a !== await firma(p); };
const estado = async (p, tag) => { const c = await fila(p, "Case results"), m = await fila(p, "Modo"), a = await fila(p, "🎞 Animar"); console.log(`${tag.padEnd(26)} anima=${await anima(p)}  Case=${c?.valor}  Modo=${m?.visible ? m.valor : "(oculto)"}  Animar=${a?.valor}`); };

// ── ESCRITORIO ──
const d = await abrir(false);
console.log("opciones Case:", JSON.stringify((await fila(d, "Case results"))?.opciones));
await estado(d, "1 al abrir");
await elegir(d, "Modo", "2 "); await espera(2000); await estado(d, "2 Modo 2");
await elegir(d, "Case results", "Dead"); await espera(3500); await estado(d, "3 Case Dead");
await elegir(d, "Case results", "Σ 1.4D"); await espera(3500); await estado(d, "4 Case combo 1.4D");
await elegir(d, "Case results", "Modal"); await espera(2500); await estado(d, "5 Case Modal");
await elegir(d, "Modo", "5 "); await espera(2000); await estado(d, "6 Modo 5");
await d.evaluate(() => [...document.querySelectorAll(".tp-lblv")].find(l => l.querySelector(".tp-lblv_l")?.textContent?.trim() === "🎞 Animar").querySelector("input").click()); await espera(1500); await estado(d, "7 Animar desmarcado");
await elegir(d, "Modo", "3 "); await espera(2000); await estado(d, "8 Modo 3 sin animar");
await d.screenshot({ path: `${dir}/casemodo_escritorio.png` });
console.log(d._log.filter(t => /PAGEERROR/.test(t)).slice(0, 3).join("\n"));
await d.close();

// ── CELULAR: fotogramas para el GIF ──
const g = `${dir}/gif_movil`; mkdirSync(g, { recursive: true });
const m = await abrir(true); let n = 0;
const foto = async (k, ms = 180) => { for (let i = 0; i < k; i++) { await m.screenshot({ path: `${g}/f${String(n++).padStart(3, "0")}.png` }); await espera(ms); } };
await foto(14);
await m.evaluate(() => [...document.querySelectorAll(".hk-mobile-fab")].find(x => x.textContent.trim() === "⚙").click()); await espera(900); await foto(6);
await elegir(m, "Modo", "2 "); await espera(900);
await m.evaluate(() => [...document.querySelectorAll(".hk-mobile-fab")].find(x => x.textContent.trim() === "⚙").click()); await espera(900); await foto(14);
await m.evaluate(() => [...document.querySelectorAll(".hk-mobile-fab")].find(x => x.textContent.trim() === "🛠").click()); await espera(900); await foto(5);
await m.evaluate(() => [...document.querySelectorAll(".hk-mobile-fab")].find(x => x.textContent.trim() === "🛠").click()); await espera(900); await foto(6);
await b.close();
execFileSync(FF, ["-y", "-v", "error", "-framerate", "5", "-i", `${g}/f%03d.png`, "-vf", "scale=360:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse", `${dir}/hekatan_movil.gif`]);
console.log("GIF:", `${dir}/hekatan_movil.gif`, n, "fotogramas");
