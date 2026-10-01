// Barrido de TODOS los ejemplos contra el build local (o HK_BASE): PNG + errores. node cli/_barrido_local.mjs <dir>
import puppeteer from "puppeteer";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
const DIR = process.argv[2] ?? "cli/shots/barrido"; mkdirSync(DIR, { recursive: true });
const BASE = process.env.HK_BASE ?? "http://localhost:8931/hekatan-struct-lineal";
const ids = readFileSync("cli/shots/deploy/_ids.txt", "utf8").split(/\s+/).filter(Boolean);
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const res = [];
for (const id of ids) {
  const pag = await nav.newPage(); await pag.setViewport({ width: 1280, height: 800 });
  const err = []; pag.on("pageerror", (e) => err.push(String(e).slice(0, 160)));
  try {
    await pag.goto(`${BASE}/workspace/?t=${id}`, { waitUntil: "networkidle2", timeout: 90000 }); await new Promise((r) => setTimeout(r, 6000));
    const info = await pag.evaluate(() => { const s = window.__hekatanSettings?.(); const st = window.__hekatanStates;
      const els = st?.elements?.val ?? []; return { el: s?.elements?.val, malla: s?.malla?.val, n: st?.nodes?.val?.length ?? 0, barras: els.filter((e) => e.length === 2).length, areas: els.filter((e) => e.length === 3 || e.length === 4).length }; });
    await pag.screenshot({ path: `${DIR}/${id}.png` }); res.push({ id, ...info, err });
  } catch (e) { res.push({ id, err: [String(e).slice(0, 160)] }); }
  await pag.close(); console.log(id, res[res.length - 1].err.length ? "ERR" : "ok");
}
writeFileSync(`${DIR}/_resultado.json`, JSON.stringify(res, null, 1)); await nav.close();
