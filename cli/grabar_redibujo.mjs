/**
 * Graba el PILOTO DE REDIBUJO (cli/piloto_redibujo.js) con su cursor virtual y deja fotogramas + meta para
 * el GIF (cli/gif_redibujo.py). Jorge: «genera un gif para revisarlas».
 *   node cli/grabar_redibujo.mjs <carpeta> portico-2d slab-beams-columns ...  [--ms 150]
 */
import puppeteer from "puppeteer";
import fs from "node:fs";
import path from "node:path";
const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args.splice(i, 2)[1] : d; };
const MS = +opt("--ms", "150"), BASE = opt("--base", "http://localhost:4600");
const [OUT, ...ids] = args;
const PILOTO = fs.readFileSync(new URL("./piloto_redibujo.js", import.meta.url), "utf8");
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const nav = await puppeteer.launch({ headless: "new", protocolTimeout: 600000, args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
for (const id of ids) {
  const dir = path.join(OUT, id); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  const pag = await nav.newPage(); await pag.setViewport({ width: 1280, height: 720 });
  await pag.goto(`${BASE}/workspace/?t=${id}`, { waitUntil: "networkidle2", timeout: 180000 }); await espera(4000);
  await pag.evaluate(PILOTO); const leido = await pag.evaluate(() => window.__piloto.leer());
  const cdp = await pag.target().createCDPSession();
  const meta = []; let k = 0;
  const foto = async (texto) => { const { data } = await cdp.send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(path.join(dir, `f${String(k).padStart(4, "0")}.png`), Buffer.from(data, "base64")); meta.push({ f: k++, texto }); };
  for (let i = 0; i < 6; i++) await foto(`Ejemplo original: ${leido.barras} barras · ${leido.cascaras} losas`);
  await pag.goto(`${BASE}/workspace/?t=new-blank`, { waitUntil: "networkidle2", timeout: 180000 }); await espera(3500);
  await pag.evaluate(PILOTO);
  await pag.evaluate((ms) => { window.__piloto.dibujar({ ms }); }, MS);
  for (let n = 0; n < 4000; n++) {
    const e = await pag.evaluate(() => ({ ...window.__piloto.estado }));
    await foto(`Redibujando con el cursor: ${e.paso} · ${e.hechos}/${e.total}`);
    if (e.fin) break;
    await espera(Math.max(60, MS));
  }
  await espera(900);
  const cmp = await pag.evaluate(() => window.__piloto.comparar());
  const err = await pag.evaluate(() => window.__piloto.estado.error);
  const veredicto = cmp.ok ? `✓ IDÉNTICO: ${cmp.barras} barras y ${cmp.cascaras} losas` : `✗ faltan ${cmp.faltanBarras} barras / ${cmp.faltanCascaras} losas · sobran ${cmp.sobranBarras}${err ? " · " + err : ""}`;
  for (let i = 0; i < 12; i++) await foto(veredicto);
  fs.writeFileSync(path.join(dir, "meta.json"), JSON.stringify({ id, leido, cmp, veredicto, fotos: meta }, null, 1));
  console.log(id, k, "fotogramas ·", veredicto);
  await pag.close();
}
await nav.close();
