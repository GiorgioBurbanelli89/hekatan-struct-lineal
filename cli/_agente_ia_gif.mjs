// Prueba de punta a punta del agente de IA con un modelo REAL (Ollama local), con CURSOR
// VIRTUAL: se ve dónde se hace clic (🤖 → caja de texto → Enviar). Graba PNG por fotograma.
//   node cli/_agente_ia_gif.mjs <carpeta_frames> "<pedido>" [modelo] [url]
import puppeteer from "puppeteer";
import fs from "node:fs";
const [dir, pedido, modelo = "qwen2.5:7b", url = "http://localhost:4600/workspace/?t=new-blank"] = process.argv.slice(2);
fs.mkdirSync(dir, { recursive: true });
const nav = await puppeteer.launch({ headless: "new",
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const p = await nav.newPage();
await p.setViewport({ width: 1280, height: 720 });
const errores = [];
p.on("pageerror", (e) => errores.push(String(e)));
await p.goto(url, { waitUntil: "networkidle2", timeout: 120000 });
await p.evaluate((m) => {
  localStorage.setItem("hekatan_ai_provider", "ollama");
  localStorage.setItem("hekatan_ai_model_agente_ollama", m);
}, modelo);
await p.reload({ waitUntil: "networkidle2" });
await new Promise((r) => setTimeout(r, 3000));
await p.keyboard.press("Escape");
await p.evaluate(() => { const x = [...document.querySelectorAll("button")].find((b) => b.textContent.trim() === "✕" && b.closest("div")?.innerText.includes("Cómo usar")); x?.click(); });

// ── cursor virtual (el de cli/demo_napkin.mjs) ──
const ponerCursor = () => p.evaluate(() => {
  if (document.getElementById("hk-cursor")) return;
  const c = document.createElement("div");
  c.id = "hk-cursor";
  c.style.cssText = "position:fixed;left:640px;top:400px;z-index:100000;pointer-events:none;width:26px;height:26px;transform:translate(-2px,-2px)";
  c.innerHTML = '<svg viewBox="0 0 24 24" width="26" height="26"><path d="M4 2 L4 19 L9 14.5 L12 21.5 L15 20 L12 13.5 L18.5 13.5 Z" fill="#ffffff" stroke="#0b1220" stroke-width="1.6" stroke-linejoin="round"/></svg>';
  document.body.appendChild(c);
  const a = document.createElement("div");
  a.id = "hk-cursor-aro";
  a.style.cssText = "position:fixed;z-index:99999;pointer-events:none;display:none;width:40px;height:40px;margin:-20px 0 0 -20px;border-radius:50%;border:3px solid #22d3ee;background:rgba(34,211,238,.22)";
  document.body.appendChild(a);
});
await ponerCursor();
let n = 0;
const foto = async (k = 1) => { await ponerCursor(); const f = `${dir}/f${String(n++).padStart(4, "0")}.png`; await p.screenshot({ path: f }); for (let i = 1; i < k; i++) fs.copyFileSync(f, `${dir}/f${String(n++).padStart(4, "0")}.png`); };
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const raton = async (x, y, pasos = 14) => {
  const p0 = await p.evaluate(() => { const c = document.getElementById("hk-cursor"); return [parseFloat(c.style.left), parseFloat(c.style.top)]; });
  for (let i = 1; i <= pasos; i++) {
    const t = i / pasos, e = t * t * (3 - 2 * t);
    const px = p0[0] + (x - p0[0]) * e, py = p0[1] + (y - p0[1]) * e;
    await p.mouse.move(px, py);
    await p.evaluate(({ x, y }) => { const c = document.getElementById("hk-cursor"); c.style.left = x + "px"; c.style.top = y + "px"; }, { x: px, y: py });
    if (i % 2 === 0) await foto();
  }
  await foto(3);
};
const clic = async (x, y) => {
  await p.evaluate(({ x, y }) => { const a = document.getElementById("hk-cursor-aro"); a.style.left = x + "px"; a.style.top = y + "px"; a.style.display = "block"; }, { x, y });
  await foto(5);
  await p.mouse.click(x, y);
  await espera(250);
  await foto(5);
  await p.evaluate(() => { document.getElementById("hk-cursor-aro").style.display = "none"; });
  await foto(2);
};
const centro = (sel) => p.evaluate((s) => { const r = document.querySelector(s).getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }, sel);

await foto(6);
// 1. clic en el botón 🤖
let [x, y] = await centro("#hk-agente-lanzador");
await raton(x, y); await clic(x, y);
// 2. clic en la caja de texto y escribir
[x, y] = await centro("#hk-agente-ia textarea");
await raton(x, y); await clic(x, y);
for (let i = 0; i < pedido.length; i += 5) { await p.keyboard.type(pedido.slice(i, i + 5)); await foto(); }
await foto(4);
// 3. clic en Enviar
[x, y] = await p.evaluate(() => { const b = [...document.querySelectorAll("#hk-agente-ia button")].find((b) => b.textContent.includes("Enviar")); const r = b.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
await raton(x, y);
await p.evaluate(() => { window.__agenteHecho = false; });
await clic(x, y);
// el cursor se aparta a mirar el modelo mientras la IA trabaja
await raton(470, 420, 12);
await p.evaluate(() => {
  const obs = setInterval(() => {
    const e = [...document.querySelectorAll("#hk-agente-ia button")].find((x) => x.textContent.includes("Enviar"));
    if (e) { window.__agenteHecho = true; clearInterval(obs); }
  }, 300);
});
const t0 = Date.now();
while (!(await p.evaluate(() => window.__agenteHecho)) && Date.now() - t0 < 15 * 60e3) { await foto(); await espera(1000); }
// al final, el cursor señala la respuesta
[x, y] = await p.evaluate(() => { const l = [...document.querySelectorAll("#hk-agente-ia > div")][2]; const r = l.getBoundingClientRect(); return [r.x + 40, r.y + r.height - 60]; });
await raton(x, y, 12);
await foto(30);
const chat = await p.evaluate(() => document.querySelector("#hk-agente-ia").innerText);
fs.writeFileSync(`${dir}/chat.txt`, chat);
console.log(chat);
console.log(`\n${n} fotogramas, ${((Date.now() - t0) / 1000).toFixed(0)} s, pageerrors ${errores.length}`, errores.slice(0, 3));
await nav.close();
