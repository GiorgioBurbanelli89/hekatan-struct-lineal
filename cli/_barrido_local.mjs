// Barrido de TODOS los ejemplos en el servidor local: pageerror, console.error, nudos, NaN. → JSONL + PNG
import puppeteer from "puppeteer";
import { appendFileSync, writeFileSync } from "node:fs";
const BASE = "http://localhost:4600/workspace/";
const OUT = "cli/shots/barrido_local/";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
let p = await nav.newPage(); await p.goto(BASE, { waitUntil: "networkidle2", timeout: 180000 }); await new Promise(r => setTimeout(r, 8000));
const ids = await p.evaluate(() => { const L = window.__hekatanExamples; return (typeof L === "function" ? L() : L ?? []).map(e => e.id ?? e); });
await p.close(); writeFileSync(OUT + "_res.jsonl", "");
console.log("ejemplos", ids.length);
for (const id of ids) {
  const pg = await nav.newPage(); await pg.setViewport({ width: 1500, height: 950 });
  const errs = [], cons = [];
  pg.on("pageerror", e => errs.push(String(e.message).slice(0, 180)));
  pg.on("console", m => { if (m.type() === "error") cons.push(m.text().slice(0, 180)); });
  const t0 = Date.now(); let info = {};
  try {
    await pg.goto(BASE + "?t=" + id, { waitUntil: "networkidle2", timeout: 120000 });
    await new Promise(r => setTimeout(r, 6000));
    info = await pg.evaluate(() => { const S = window.__hekatanStates; const N = S?.nodes?.val ?? [];
      let nan = 0; for (const n of N) if (n.some(v => !Number.isFinite(v))) nan++;
      return { nudos: N.length, elems: S?.elements?.val?.length ?? 0, nanCoord: nan, ejemplo: window.__hekatanExample?.() }; });
    await pg.screenshot({ path: OUT + id + ".png" });
  } catch (e) { errs.push("NAV " + String(e.message).slice(0, 120)); }
  const fila = { id, ms: Date.now() - t0, pageerror: errs, console: cons.slice(0, 5), ...info };
  appendFileSync(OUT + "_res.jsonl", JSON.stringify(fila) + "\n");
  await pg.close();
}
await nav.close(); console.log("fin");
