/**
 * El Test M en HEKATAN STRUCT, dibujado desde cero con el raton A LA VISTA.
 *
 * El mismo modelo que se monto en ETABS: portico 3x3 vanos (6 x 5 m),
 * 3 pisos de 3 m, losas y cuatro muros de corte.
 *
 *   node cli/testm_struct.mjs            # contra el deploy publico
 *   node cli/testm_struct.mjs --local    # contra localhost:4600
 *
 * El cursor se PINTA (puppeteer no lo dibuja) y VIAJA de un punto a otro:
 * en un video hay que ver de donde viene y adonde va.
 */
import puppeteer from "puppeteer";
import fs from "node:fs";

const LOCAL = process.argv.includes("--local");
const BASE = LOCAL ? "http://localhost:4600/workspace/"
                   : "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/";
const SALIDA = "cli/shots/testm_struct";
fs.mkdirSync(SALIDA, { recursive: true });

let nf = 0;
const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--window-size=1920,1080"] });
const p = await b.newPage();
await p.setViewport({ width: 1920, height: 1080 });
const errs = [];
p.on("pageerror", (e) => errs.push(String(e).slice(0, 110)));

/** El cursor: puppeteer no lo dibuja, asi que se pinta uno de verdad. */
async function ponerCursor() {
  await p.evaluate(() => {
    if (document.getElementById("hk-cur")) return;
    const c = document.createElement("div");
    c.id = "hk-cur";
    c.style.cssText = `position:fixed;left:0;top:0;width:26px;height:30px;z-index:2147483647;
      pointer-events:none;transition:left .09s linear,top .09s linear;`;
    c.innerHTML = `<svg viewBox="0 0 12 20" width="26" height="30">
      <polygon points="0,0 0,17 4,13 7,19 9,18 6,12 11,12"
               fill="#fff" stroke="#000" stroke-width="1.4" stroke-linejoin="round"/></svg>`;
    document.body.appendChild(c);
    window.__cur = (x, y) => { c.style.left = x + "px"; c.style.top = y + "px"; };
    window.__cur(960, 540);
  });
}

/** El cursor VIAJA hasta el punto, y luego se clica. */
async function mover(x, y, pasos = 12) {
  await p.evaluate((x, y) => window.__cur && window.__cur(x, y), x, y);
  await p.mouse.move(x, y, { steps: pasos });
  await new Promise((r) => setTimeout(r, 140));
}

async function clic(x, y) {
  await mover(x, y);
  await p.mouse.click(x, y);
  await new Promise((r) => setTimeout(r, 220));
}

async function foto(nombre) {
  nf++;
  const f = `${SALIDA}/${String(nf).padStart(2, "0")}_${nombre}.png`;
  await p.screenshot({ path: f });
  console.log("   foto:", f.split("/").pop());
}

/** Escribe en la linea de ordenes del CAD, tecla a tecla (se ve escribir). */
async function orden(txt) {
  const sel = await p.evaluate(() => {
    const i = [...document.querySelectorAll("input,textarea")]
      .find((e) => /comando|orden|cli/i.test(e.placeholder + " " + e.id + " " + e.className));
    if (!i) return null;
    i.focus();
    return true;
  });
  if (!sel) return false;
  await p.keyboard.type(txt, { delay: 22 });
  await p.keyboard.press("Enter");
  await new Promise((r) => setTimeout(r, 350));
  return true;
}

console.log("abriendo", BASE);
await p.goto(BASE + "?cb=" + Date.now(), { waitUntil: "networkidle0", timeout: 90000 });
await p.waitForFunction(() => window.__hekatanStates, { timeout: 60000 }).catch(() => {});
await new Promise((r) => setTimeout(r, 3000));
await ponerCursor();
await foto("inicio");

// que hay en pantalla: se busca el CAD y la linea de ordenes
const ui = await p.evaluate(() => {
  const txt = document.body.innerText;
  const inputs = [...document.querySelectorAll("input,textarea")].map((e) => ({
    ph: e.placeholder || "", id: e.id || "", cls: (e.className || "").slice(0, 40),
  }));
  return {
    hayCLI: /comando|Teclee|orden/i.test(txt),
    inputs: inputs.filter((i) => i.ph || i.id).slice(0, 12),
    botones: [...document.querySelectorAll("button")].map((x) => x.textContent.trim())
      .filter(Boolean).slice(0, 30),
  };
});
console.log("CLI presente:", ui.hayCLI);
console.log("inputs:", JSON.stringify(ui.inputs));
console.log("botones:", ui.botones.join(" · ").slice(0, 300));
console.log("errores JS:", errs.length, errs[0] || "");
await b.close();
