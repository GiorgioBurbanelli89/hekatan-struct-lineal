import puppeteer from "puppeteer";
const URL = "https://giorgioburbanelli89.github.io/hekatan-lisp/";
const OUT = process.argv[2] || "lispweb_u";
const nav = await puppeteer.launch({ headless: "new",
  args: ["--no-sandbox","--disable-setuid-sandbox","--window-size=1600,1000"] });
const pag = await nav.newPage();
await pag.setViewport({ width: 1600, height: 1000 });
const err = []; pag.on("pageerror", e => err.push(e.message));
await pag.goto(URL, { waitUntil: "networkidle2", timeout: 180000 });
await new Promise(r => setTimeout(r, 30000));   // el wasm tarda en arrancar
const hoja = `# Unidades en la web
L = 3m|cm
q = 606kN/1.193m^2|tonf/m2
k = 2000tonf/m^3|kN/m^3
mal = 3m+2s|m
`;
// escribir en el editor
const sel = (await pag.$("textarea")) ? "textarea" : ".cm-content";
await pag.click(sel);
await pag.evaluate((s) => { const t = document.querySelector(s); if (t && "value" in t) { t.value = ""; t.dispatchEvent(new Event("input", {bubbles:true})); } }, sel);
await pag.type(sel, hoja, { delay: 8 });
await new Promise(r => setTimeout(r, 2000));
// ejecutar: F5, Ctrl+Enter o el botón de resultado
for (const k of ["F5"]) { await pag.keyboard.press(k); await new Promise(r => setTimeout(r, 1500)); }
await new Promise(r => setTimeout(r, 12000));
await pag.screenshot({ path: `${OUT}.png` });
const txt = await pag.evaluate(() => (document.body.innerText||""));
const lin = txt.split("\n").filter(l => /cm|tonf|kN|⚠/.test(l)).slice(0, 12);
console.log(JSON.stringify({ err: err.slice(0,3), lineas: lin }, null, 1));
await nav.close();
