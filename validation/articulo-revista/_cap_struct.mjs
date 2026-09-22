// Abre el Hekatan Struct PUBLICO con ?t=test-m-dual, corre modal y captura PNG.
import puppeteer from "puppeteer";
import { mkdirSync } from "node:fs";

const OUT = process.argv[2];
const URL = "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=test-m-dual";
mkdirSync(OUT, { recursive: true });
const dormir = ms => new Promise(s => setTimeout(s, ms));

const b = await puppeteer.launch({
  executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
  headless: "new",
  args: ["--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
  defaultViewport: { width: 1600, height: 950 },
});
const p = await b.newPage();
const errs = [];
p.on("pageerror", e => errs.push("PAGEERROR " + e.message));

await p.goto(URL, { waitUntil: "networkidle2", timeout: 120000 });
await dormir(25000);

const btn = async (txt) => p.evaluate((txt) => {
  const e = [...document.querySelectorAll("button")].find(e => (e.innerText || "").includes(txt));
  if (!e) return false; e.scrollIntoView({ block: "center" }); e.click(); return true;
}, txt);

// 1) correr modal + animar (coordenada del boton en el panel izquierdo)
await p.mouse.click(152, 291);
console.log("modal lanzado, esperando 70 s...");
await dormir(70000);
await p.screenshot({ path: `${OUT}/01_struct_modal.png` });

// 2) tabla de modos
await p.mouse.click(146, 315);
await dormir(8000);
await p.screenshot({ path: `${OUT}/02_struct_tabla_modos.png` });

// 3) espectro
await p.mouse.click(146, 337);
await dormir(6000);
await p.screenshot({ path: `${OUT}/03_struct_espectro.png` });

// 4) panel Modal+ ASCE (periodos + cortante)
console.log("Modal+ASCE:", await btn("Modal+"));
await dormir(15000);
await p.screenshot({ path: `${OUT}/04_struct_modal_asce.png` });

const txt = await p.evaluate(() => document.body.innerText);
console.log("--- lineas con numeros de interes ---");
console.log(txt.split("\n").filter(l => /0\.48|0\.43|32\.0|26\.4|26\.5|16\.3|85\.8|99\.2|Cortante|cortante|basal|Modo|T\s*=/.test(l)).slice(0, 60).join("\n"));
console.log("ERRORES:", errs.slice(0, 8));
await b.close();
