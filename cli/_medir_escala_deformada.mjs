// Mide la escala de la deformada que pone el workspace al cargar un ejemplo (y tras rebuild).
//   node cli/_medir_escala_deformada.mjs [id ...]
import puppeteer from "puppeteer";
const ids = process.argv.slice(2).length ? process.argv.slice(2) : ["plate-thick"];
const b = await puppeteer.launch({ headless: "new", args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const p = await b.newPage(); await p.setViewport({ width: 1400, height: 850 });
const leer = () => p.evaluate(() => {
  const s = window.__hekatanSettings?.();
  return { xy: s?.deformScale?.val, z: s?.deformScaleZ?.val, def: s?.deformedShape?.val };
});
for (const id of ids) {
  await p.goto(`http://localhost:4600/workspace/?t=${id}`, { waitUntil: "networkidle2", timeout: 120000 });
  await new Promise(r => setTimeout(r, 5000));
  const a = await leer();
  await p.evaluate(() => window.__hekatanRebuild?.()); await new Promise(r => setTimeout(r, 3000));
  const c = await leer();
  console.log(id, "al cargar:", JSON.stringify(a), "| tras rebuild:", JSON.stringify(c));
}
await b.close();
