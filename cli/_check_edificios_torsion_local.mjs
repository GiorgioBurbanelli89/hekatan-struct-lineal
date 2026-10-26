// Abre el ejemplo edificios-torsion en el sitio compilado LOCAL (vite preview) y mira que carga, calcula y no da errores.
import puppeteer from "puppeteer";
import { mkdirSync } from "node:fs";
const BASE = process.argv[2] ?? "http://localhost:4712/hekatan-struct-lineal/workspace/";
mkdirSync("cli/shots/edificios_torsion", { recursive: true });
const nav = await puppeteer.launch({ headless: "new", executablePath: process.env.CHROME || "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--no-sandbox", "--disable-setuid-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const p = await nav.newPage(); await p.setViewport({ width: 1500, height: 950 });
const errs = [], cons = [];
p.on("pageerror", (e) => errs.push(String(e.message).slice(0, 200)));
p.on("console", (m) => { if (m.type() === "error") cons.push(m.text().slice(0, 200)); });
await p.goto(`${BASE}?t=edificios-torsion`, { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 9000));
const lee = () => p.evaluate(() => {
  const labels = [...document.querySelectorAll(".tp-lblv")].map((e) => (e.querySelector(".tp-lblv_l")?.textContent.trim() ?? "") + " = " + (e.querySelector("input,select")?.value ?? e.querySelector(".tp-txtv_i")?.textContent ?? e.textContent.slice(-40)));
  const S = window.__hekatanStates;
  return { nodos: S?.nodes?.val?.length, elementos: S?.elements?.val?.length, labels: labels.filter(l => /Tu|Cambio|Combinaci|Vigas con|Tcr|Edificio|Punto/i.test(l)).slice(0, 12) };
});
console.log("inicial:", JSON.stringify(await lee()));
await p.screenshot({ path: "cli/shots/edificios_torsion/inicial.png" });
console.log("errores de pagina:", errs.slice(0, 3), "| console.error:", cons.slice(0, 3));
await nav.close();
