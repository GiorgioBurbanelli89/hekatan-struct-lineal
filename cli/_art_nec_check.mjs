// Edificio del artículo (test-m-dual, malla 1.0 m) en la app pública: 1 muro y molinete; NEC + Aguiar.
import puppeteer from "puppeteer";
const BASE = process.argv[2] ?? "https://giorgioburbanelli89.github.io/hekatan-struct-lineal";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const MOL = { nWalls: 4, wDir_1: 0, wLine_1: 0, wStart_1: 0, wSpan_1: 1, wDir_2: 0, wLine_2: 2, wStart_2: 1, wSpan_2: 1,
  wDir_3: 1, wLine_3: 0, wStart_3: 1, wSpan_3: 1, wDir_4: 1, wLine_4: 2, wStart_4: 0, wSpan_4: 1 };
for (const [nom, extra] of [["1 muro", {}], ["molinete", MOL]]) {
  const pag = await nav.newPage(); await pag.setViewport({ width: 1600, height: 1000 });
  const err = []; pag.on("pageerror", (e) => err.push(String(e)));
  const P = Buffer.from(JSON.stringify({ ms: 1.0, ...extra })).toString("base64");
  await pag.goto(`${BASE}/workspace/?t=test-m-dual&p=${P}&v=${Date.now()}`, { waitUntil: "networkidle2", timeout: 120000 }); await espera(9000);
  const r = await pag.evaluate(() => { const n = window.__hekatanNEC; n.params.sistema = 1; n.params.irregular = 0; n.correr(); const a = n.params.info; n.aguiar();
    const r = n.resultado(); return { nudos: document.body.innerText.match(/(\d+) nudos/)?.[1], info: a, aguiar: n.params.info,
      cr: r.cr.map((c) => c.map((v) => v.toFixed(2)).join(",")), cm: r.pisos.map((q) => q.cm.map((v) => v.toFixed(2)).join(",")) }; });
  console.log("==", nom, JSON.stringify({ ...r, err }, null, 1)); await pag.close();
}
await nav.close();
