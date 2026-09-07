// Captura la piel CAD en sus DOS modos, contra el servidor de desarrollo, a
// doble densidad: 2560x1440. Es la unica forma de juzgar texto de 11 px.
import puppeteer from "puppeteer";
import { mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "frames_tutorial"); mkdirSync(OUT, { recursive: true });
const espera = (ms) => new Promise(r => setTimeout(r, ms));
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox",
  "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl",
  "--ignore-gpu-blocklist"] });
const pag = await nav.newPage();
await pag.setViewport({ width: 1280, height: 720, deviceScaleFactor: 2 });
const errs = [];
pag.on("pageerror", e => errs.push(e.message));
await pag.goto("http://localhost:4600/workspace/?t=test-m-dual", { waitUntil: "networkidle2", timeout: 120000 });
await espera(9000);
for (const modo of ["oscuro", "claro"]) {
  await pag.evaluate((m) => {
    const b = document.querySelector("#hk-cad-tit .piel");
    if (document.documentElement.getAttribute("data-hk-piel") !== m) b.click();
  }, modo);
  await espera(2500);
  await pag.screenshot({ path: join(OUT, `piel_${modo}.png`) });
  // se COMPRUEBA el contraste, no se mira: el blanco sobre blanco no se ve
  const chk = await pag.evaluate(() => {
    const p = document.querySelector("#legend p");
    const t = document.querySelector("#hk-cad-tit");
    const e = document.querySelector("#hk-cad-est button.on");
    return { legenda: p && getComputedStyle(p).color,
             titulo: t && getComputedStyle(t).backgroundColor,
             conmutador: e && getComputedStyle(e).color };
  });
  console.log(modo, JSON.stringify(chk));
}
console.log("errores de pagina:", errs.length, errs.slice(0, 3).join(" | "));
await nav.close();
