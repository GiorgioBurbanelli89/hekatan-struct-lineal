/**
 * Contador de GDL en la barra de estado: nudos y grados de libertad del modelo
 * en pantalla, y en rojo con el tope cuando el modal de la plantilla lo pasa.
 *
 *   node cli/ctl_contador_gdl.mjs [--base http://localhost:4600]
 */
import puppeteer from "puppeteer";
import { mkdirSync } from "node:fs";

const i = process.argv.indexOf("--base");
const BASE = i >= 0 ? process.argv[i + 1] : "http://localhost:4600";
const DIR = "cli/shots/ctl_contador_gdl";
mkdirSync(DIR, { recursive: true });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

const nav = await puppeteer.launch({ headless: "new",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage();
await pag.setViewport({ width: 1600, height: 900 });
const errores = [];
pag.on("pageerror", (e) => errores.push(String(e.message)));
pag.on("dialog", (d) => d.dismiss().catch(() => {}));

const leer = () => pag.evaluate(() => {
  const el = document.getElementById("hk-statusbar-gdl");
  return { texto: el?.textContent ?? null, color: el?.style.color ?? null,
           nudos: window.__hekatanStates?.nodes?.val?.length ?? 0,
           info: window.__hekatanModalInfo ?? null };
});
let fallos = 0;
const comprobar = (que, ok, dato) => { console.log(`${ok ? "ok  " : "FALLA"}  ${que}  ${dato ?? ""}`); if (!ok) fallos++; };

await pag.goto(`${BASE}/workspace/index.html?t=plantillas`, { waitUntil: "networkidle2", timeout: 180000 });
await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 });
await espera(6000);
let r = await leer();
await pag.screenshot({ path: `${DIR}/01_plantilla.png` });
comprobar("hay contador en la barra", r.texto !== null, JSON.stringify(r.texto));
comprobar("cuenta 6 GDL por nudo", r.nudos > 0 && (r.texto ?? "").replace(/\s/g, "").includes(`${r.nudos * 6}GDL`),
  `${r.nudos} nudos`);

// modelo que pasa del tope: se baja el tope, no se agranda el modelo (memoria)
await pag.evaluate(() => { window.__hekatanDofMaxModal = 600; window.__hekatanSetParam("pisos", 3); });
await espera(8000);
await pag.evaluate(() => window.__hekatanRunModalAnimate?.());
await espera(12000);
r = await leer();
await pag.screenshot({ path: `${DIR}/02_pasa_del_tope.png` });
comprobar("el modal se corta y el contador lo dice", !!r.info && r.info.dof > 600 && /tope modal/.test(r.texto ?? ""),
  JSON.stringify(r.texto));
comprobar("en rojo", /248|f87171/.test(r.color ?? ""), r.color);
comprobar("0 errores de pagina", errores.length === 0, errores.join(" | "));

await nav.close();
console.log(fallos ? `\n${fallos} FALLOS` : "\nTODO BIEN");
process.exit(fallos ? 1 : 0);
