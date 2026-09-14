import puppeteer from "puppeteer";

const URLB = process.argv[2] || "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?m=7nF68EUiy5UVJuli&modal=80&t=new-blank";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const p = await nav.newPage(); await p.setViewport({ width: 1500, height: 950 });
const errs = []; p.on("pageerror", e => errs.push(e.message)); p.on("console", m => { if (m.type() === "error" || /modo|anim/i.test(m.text())) errs.push(m.text().slice(0, 150)); });
await p.goto(URLB, { waitUntil: "domcontentloaded", timeout: 120000 });
await new Promise(r => setTimeout(r, 25000));
const labels = () => p.evaluate(() => [...document.querySelectorAll("#settings .tp-lblv, #settings .tp-fldv_t")].map(e => { const l = e.querySelector?.(".tp-lblv_l")?.textContent?.trim() ?? e.textContent.trim(); const v = e.querySelector?.("select")?.selectedOptions?.[0]?.textContent ?? e.querySelector?.("input[type=checkbox]")?.checked; return l + (v !== undefined ? " = " + v : ""); }).filter(Boolean));
console.log("SETTINGS:", JSON.stringify(await labels()));
const diff = async (tag) => {
  const c = { clip: { x: 300, y: 60, width: 880, height: 600 } };
  const a = await p.screenshot(c); await new Promise(r => setTimeout(r, 400)); const b = await p.screenshot(c);
  console.log(tag, "fotogramas distintos:", Buffer.compare(a, b) !== 0);
};
await diff("inicio");
const anim = await p.evaluate(() => { const l = [...document.querySelectorAll("#settings .tp-lblv")].find(e => /Animar/.test(e.textContent)); const cb = l?.querySelector("input[type=checkbox]"); return cb ? cb.checked : "no hay"; });
console.log("Animar checked:", anim);
if (anim === false) { await p.evaluate(() => { const l = [...document.querySelectorAll("#settings .tp-lblv")].find(e => /Animar/.test(e.textContent)); l.querySelector("input[type=checkbox]").click(); }); await new Promise(r => setTimeout(r, 1500)); await diff("tras marcar Animar"); console.log("SETTINGS2:", JSON.stringify(await labels())); }
await p.screenshot({ path: "cli/shots/movil/chk_anim_desk.png" });
console.log("ERR:", JSON.stringify(errs.slice(0, 8)));
await nav.close();
