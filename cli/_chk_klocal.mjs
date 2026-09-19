import puppeteer from "puppeteer";
const nav = await puppeteer.launch({ headless: "new", executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", args: ["--no-sandbox","--enable-unsafe-swiftshader","--use-angle=swiftshader"] });
const p = await nav.newPage(); await p.setViewport({width:1400,height:800});
const errs = []; p.on("pageerror", e => errs.push(String(e).slice(0,160)));
p.on("console", m => { const t = m.text(); if (/error|Error/.test(t)) errs.push("c:"+t.slice(0,140)); });
await p.goto(process.argv[2], { waitUntil: "networkidle2", timeout: 120000 });
await new Promise(r => setTimeout(r, 12000));
const st = await p.evaluate(() => ({
  viewer: !!document.querySelector("#viewer"),
  ctx: !!(document.querySelector("#viewer")||{}).__ctx,
  kloc: typeof window.__hekatanKLocal,
  diag: typeof window.__hekatanDiagrama2D,
  chip: !!document.querySelector("#hk-klocal-chip"),
}));
console.log(JSON.stringify(st), "| errores:", errs.slice(0,3));
await nav.close();
