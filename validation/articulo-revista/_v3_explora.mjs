// v3 - explora la UI del workspace publico en ALTA DEFINICION (dSF=2)
import puppeteer from "puppeteer";
import { mkdirSync } from "node:fs";
const OUT = process.argv[2]; mkdirSync(OUT, { recursive: true });
const URL = "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=test-m-dual";
const dormir = ms => new Promise(s => setTimeout(s, ms));
const b = await puppeteer.launch({
  executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
  headless: "new",
  args: ["--no-sandbox","--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader","--window-size=1920,1080"],
  defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 2 },
});
const p = await b.newPage();
const errs = []; p.on("pageerror", e => errs.push("PAGEERROR " + e.message));
await p.goto(URL, { waitUntil: "networkidle2", timeout: 180000 });
await dormir(25000);
await p.screenshot({ path: `${OUT}/v3_00_carga_HD.png` });
const info = await p.evaluate(() => {
  const bs = [...document.querySelectorAll("button")].map(e => {
    const r = e.getBoundingClientRect();
    return { t: (e.innerText||"").trim().slice(0,60), x: Math.round(r.x+r.width/2), y: Math.round(r.y+r.height/2), w: Math.round(r.width) };
  }).filter(o => o.w > 0);
  const sels = [...document.querySelectorAll("select")].map(e => {
    const r = e.getBoundingClientRect();
    return { id: e.id, name: e.name, x: Math.round(r.x+r.width/2), y: Math.round(r.y+r.height/2), opts: [...e.options].map(o=>o.value+"|"+o.text).slice(0,30) };
  });
  const globals = Object.keys(window).filter(k => /anim|modal|mode|struct|hek|app|ws|viewer|scene/i.test(k)).slice(0,60);
  return { bs, sels, globals, canvas: [...document.querySelectorAll("canvas")].map(c=>({w:c.width,h:c.height})) };
});
console.log(JSON.stringify(info, null, 1));
console.log("ERRORES:", errs.slice(0,8));
await b.close();
