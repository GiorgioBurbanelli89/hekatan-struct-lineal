// Revision por FOTOGRAMAS de los ejemplos de solidos y placas: PNG por ejemplo + errores + escala + barra.
//   node cli/_revisar_solidos_placas.mjs [base] < ids.txt      (base = http://localhost:4600 por defecto)
import puppeteer from "puppeteer"; import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
const BASE = process.argv[2] || "http://localhost:4600";
const ids = readFileSync(0, "utf-8").split(/\s+/).filter(Boolean);
const DIR = "cli/shots/revision_solidos_placas"; mkdirSync(DIR, { recursive: true });
const b = await puppeteer.launch({ headless: "new", args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const out = [];
for (const id of ids) {
  const p = await b.newPage(); await p.setViewport({ width: 1400, height: 850 });
  const errs = []; p.on("pageerror", e => errs.push(String(e).slice(0, 160))); p.on("console", m => { if (m.type() === "error") errs.push(m.text().slice(0, 160)); });
  const t0 = Date.now();
  try {
    await p.goto(`${BASE}/workspace/?t=${id}`, { waitUntil: "networkidle2", timeout: 120000 });
    await new Promise(r => setTimeout(r, 5000));
    const info = await p.evaluate(() => {
      const s = window.__hekatanSettings?.();
      return { xy: s?.deformScale?.val, z: s?.deformScaleZ?.val, shell: s?.shellResults?.val, solid: s?.solidResults?.val,
               leyenda: document.querySelector("#legend")?.innerText?.replace(/\s+/g, " ").slice(0, 90) ?? "" };
    });
    await p.screenshot({ path: `${DIR}/${id}.png` });
    out.push({ id, ms: Date.now() - t0, errores: errs, ...info });
    console.log(id, "|", errs.length, "err |", JSON.stringify(info).slice(0, 160));
  } catch (e) { out.push({ id, fallo: String(e).slice(0, 200), errores: errs }); console.log(id, "FALLO", String(e).slice(0, 120)); }
  await p.close();
}
writeFileSync(`${DIR}/_resumen.json`, JSON.stringify(out, null, 1));
await b.close();
