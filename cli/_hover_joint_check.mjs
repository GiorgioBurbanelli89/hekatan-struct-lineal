// El recuadro del cursor sobre la base del muro: valor en el joint, según «Promediado». node cli/_hover_joint_check.mjs <base> <png>
import puppeteer from "puppeteer";
const [BASE, PNG] = process.argv.slice(2);
const URL = `${BASE}/workspace/?t=muro-manabi&p=` + Buffer.from(JSON.stringify({ modelo: 1, cf: 1, L: 3, sCf: 1.5, ms: 0.15 })).toString("base64");
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1600, height: 1000 });
await pag.goto(URL, { waitUntil: "networkidle2", timeout: 120000 }); await new Promise((r) => setTimeout(r, 7000));
await pag.evaluate(() => { const p = window.__hekatanHoverPrefs; p.nudos.val = false; p.kAreas.val = false; p.kBarras.val = false; });
const leer = () => pag.evaluate(() => [...document.querySelectorAll("div")].find((q) => q.style.whiteSpace === "pre-line" && q.style.display === "block")?.textContent ?? "");
let txt = "";
for (let y = 420; y <= 720 && !txt.startsWith("Shell"); y += 20) for (let x = 650; x <= 1050 && !txt.startsWith("Shell"); x += 20) { await pag.mouse.move(x, y); await new Promise((r) => setTimeout(r, 120)); txt = await leer(); }
for (const modo of ["todos", "ninguno"]) {
  await pag.evaluate((m) => { window.__hekatanPromediado.val = m; }, modo);
  await pag.mouse.move(10, 990); await new Promise((r) => setTimeout(r, 400));
  const pos = await pag.evaluate(() => 0);
  console.log("──", modo); 
}
console.log(txt.split("\n").slice(0, 20).join("\n"));
await pag.screenshot({ path: PNG });
await nav.close();
