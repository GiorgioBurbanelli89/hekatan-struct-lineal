// Dos capturas del MISMO modelo en modal: una del deploy (codigo viejo) y otra
// del local (arreglado). Se cuenta ademas cuanto pixel naranja hay suelto.
import puppeteer from "puppeteer";
const [url, png] = process.argv.slice(2);
const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
const p = await b.newPage();
await p.setViewport({ width: 1500, height: 900 });
await p.goto(url, { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 20000));
await p.screenshot({ path: png });
// cuanta superficie naranja hay (las secciones): mas dispersa = mas se nota el bug
const naranja = await p.evaluate(() => {
  const c = document.querySelector("canvas");
  if (!c) return null;
  const g = document.createElement("canvas");
  g.width = c.width; g.height = c.height;
  const ctx = g.getContext("2d");
  ctx.drawImage(c, 0, 0);
  const d = ctx.getImageData(0, 0, g.width, g.height).data;
  let n = 0;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i], gr = d[i + 1], bl = d[i + 2];
    if (r > 180 && gr > 110 && gr < 200 && bl < 110) n++;   // el ambar f59e0b/fbbf24
  }
  return { px: n, total: g.width * g.height, pct: +(100 * n / (g.width * g.height)).toFixed(3) };
});
console.log(png.split(/[\/]/).pop(), JSON.stringify(naranja));
await b.close();
