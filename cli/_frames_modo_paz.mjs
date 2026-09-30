import puppeteer from "puppeteer";
const BASE = process.argv[2], OUT = process.argv[3], ids = process.argv.slice(4);
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
for (const ex of ids) {
  const pag = await nav.newPage(); await pag.setViewport({ width: 1400, height: 900 });
  await pag.goto(`${BASE}/workspace/?t=${ex}`, { waitUntil: "networkidle2", timeout: 120000 });
  await new Promise((r) => setTimeout(r, 5000));
  await pag.evaluate(() => { for (const b of document.querySelectorAll("button")) if (b.textContent.includes("Correr modal")) { b.click(); return; } });
  await new Promise((r) => setTimeout(r, 5000));
  await pag.evaluate(() => { for (const b of document.querySelectorAll("*")) { const t = b.textContent?.trim(); if ((t === "✕" || t === "×") && b.children.length === 0) { const r = b.getBoundingClientRect(); if (r.x > 1200 && r.y < 120) { b.click(); } } } });
  for (let k = 0; k < 3; k++) { await new Promise((r) => setTimeout(r, 450)); await pag.screenshot({ path: `${OUT}/${ex}_modo1_f${k}.png`, clip: { x: 300, y: 30, width: 780, height: 780 } }); }
  await pag.close();
}
await nav.close();
