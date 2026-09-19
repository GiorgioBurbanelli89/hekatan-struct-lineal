// Prueba de punta a punta del agente de IA con un modelo REAL (Ollama local) y graba
// fotogramas PNG cada ~1.2 s mientras la IA arma el modelo. Uso:
//   node cli/_agente_ia_gif.mjs <carpeta_frames> "<pedido>" [modelo]
import puppeteer from "puppeteer";
import fs from "node:fs";
const [dir, pedido, modelo = "qwen2.5:7b"] = process.argv.slice(2);
fs.mkdirSync(dir, { recursive: true });
const nav = await puppeteer.launch({ headless: "new",
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const p = await nav.newPage();
await p.setViewport({ width: 1280, height: 720 });
const errores = [];
p.on("pageerror", (e) => errores.push(String(e)));
await p.goto("http://localhost:4600/workspace/?t=new-blank", { waitUntil: "networkidle2", timeout: 120000 });
await p.evaluate((m) => {
  localStorage.setItem("hekatan_ai_provider", "ollama");
  localStorage.setItem("hekatan_ai_model_agente_ollama", m);
}, modelo);
await p.reload({ waitUntil: "networkidle2" });
await new Promise((r) => setTimeout(r, 3000));
await p.keyboard.press("Escape");
await p.evaluate(() => { const x = [...document.querySelectorAll("button")].find((b) => b.textContent.trim() === "✕" && b.closest("div")?.innerText.includes("Cómo usar")); x?.click(); });
let n = 0;
const foto = async () => p.screenshot({ path: `${dir}/f${String(n++).padStart(4, "0")}.png` });
await foto();
await p.evaluate(() => window.__hekatanAgenteIA());
// escribir el pedido letra a letra (se ve en el GIF)
await p.focus("#hk-agente-ia textarea");
for (let i = 0; i < pedido.length; i += 6) {
  await p.keyboard.type(pedido.slice(i, i + 6));
  await foto();
}
await p.evaluate(() => { window.__agenteHecho = false; });
await p.keyboard.press("Enter");
const t0 = Date.now();
await p.evaluate(() => {
  const b = [...document.querySelectorAll("#hk-agente-ia button")].find((x) => x.textContent.includes("Parar"));
  const obs = setInterval(() => {
    const e = [...document.querySelectorAll("#hk-agente-ia button")].find((x) => x.textContent.includes("Enviar"));
    if (e) { window.__agenteHecho = true; clearInterval(obs); }
  }, 300);
});
while (!(await p.evaluate(() => window.__agenteHecho)) && Date.now() - t0 < 15 * 60e3) {
  await foto();
  await new Promise((r) => setTimeout(r, 1200));
}
for (let i = 0; i < 4; i++) { await foto(); await new Promise((r) => setTimeout(r, 800)); }
const chat = await p.evaluate(() => document.querySelector("#hk-agente-ia").innerText);
fs.writeFileSync(`${dir}/chat.txt`, chat);
console.log(chat);
console.log(`\n${n} fotogramas, ${((Date.now() - t0) / 1000).toFixed(0)} s, pageerrors ${errores.length}`, errores.slice(0, 3));
await nav.close();
