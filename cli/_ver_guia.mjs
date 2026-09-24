import puppeteer from "puppeteer";
const b = await puppeteer.connect({ browserURL: "http://localhost:9222", defaultViewport: null });
const p = (await b.pages()).find(x => !x.url().startsWith("devtools"));
await p.bringToFront();
await p.goto("http://localhost:4600/workspace/?t=itw-test-2-voladizo", { waitUntil: "networkidle2", timeout: 180000 });
await new Promise(r => setTimeout(r, 12000));
const ok = await p.evaluate(() => { if (window.__hekatanGuiaFem) { window.__hekatanGuiaFem(); return true; } return false; });
await new Promise(r => setTimeout(r, 1500));
// abrir las respuestas para que se vean
await p.evaluate(() => document.querySelectorAll("#hk-guia-fem details").forEach((d,i) => { if (i<4) d.open = true; }));
await new Promise(r => setTimeout(r, 800));
await p.screenshot({ path: "cli/shots/en_vivo/guia_fem.png" });
console.log("guia montada:", ok);
b.disconnect();
