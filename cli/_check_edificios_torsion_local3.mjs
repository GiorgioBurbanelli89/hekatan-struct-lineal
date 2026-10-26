import puppeteer from "puppeteer";
const BASE = "http://localhost:4712/hekatan-struct-lineal/workspace/";
const nav = await puppeteer.launch({ headless: "new", executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const p = await nav.newPage(); await p.setViewport({ width: 1700, height: 1000 });
await p.goto(`${BASE}?t=edificios-torsion`, { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 9000));
await p.mouse.click(1688, 500);                       // el asa de la derecha
await new Promise((r) => setTimeout(r, 2500));
await p.screenshot({ path: "cli/shots/edificios_torsion/panel_derecho.png" });
await nav.close();
