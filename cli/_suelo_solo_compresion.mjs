/**
 * EL TERRENO NO TIRA: muelle de solo compresión, como el «Compression Only» que
 * SAFE pone por defecto en el muelle de área de una zapata.
 *
 * Se compara, en la MISMA zapata, el suelo lineal contra el de solo compresión, y
 * se comprueban las dos condiciones que definen un contacto unilateral:
 *
 *   · donde el muelle está puesto, el nudo COMPRIME (w < 0);
 *   · donde el nudo se levanta, NO hay muelle.
 *
 * Si alguna de las dos falla, el reparto de presiones no vale aunque el dibujo
 * salga bonito. Se mira en la de LINDERO y la ESQUINERA, que son excéntricas de
 * nacimiento y son donde el suelo se despega de verdad.
 *
 *   node cli/_suelo_solo_compresion.mjs
 */
import puppeteer from "puppeteer";
import fs from "node:fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "shots", "solo_compresion");
fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".wasm": "application/wasm", ".json": "application/json", ".svg": "image/svg+xml",
  ".png": "image/png", ".ico": "image/x-icon", ".woff2": "font/woff2" };
const srv = createServer((req, res) => {
  let p = decodeURIComponent((req.url || "/").split("?")[0]);
  if (p.startsWith(BASE)) p = p.slice(BASE.length - 1);
  let f = join(raiz, p);
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = join(f, "index.html");
  if (!fs.existsSync(f)) { res.writeHead(404); return res.end("404"); }
  res.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" });
  res.end(fs.readFileSync(f));
});
await new Promise((r) => srv.listen(4891, r));
const nav = await puppeteer.launch({ headless: "new",
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1400, height: 900 });
const err = []; pag.on("pageerror", (e) => err.push(String(e).slice(0, 150)));
const logs = [];
pag.on("console", (m) => { if (/Cimentaci/.test(m.text())) logs.push(m.text().slice(0, 170)); });
const esp = (m) => new Promise((r) => setTimeout(r, m));
const fallos = [];
const ok = (c, q, d = "") => { console.log((c ? "  OK  " : "  --  ") + q + (d ? "  |  " + d : "")); if (!c) fallos.push(q); };

await pag.goto(`http://localhost:4891${BASE}workspace/?t=plantillas`, { waitUntil: "networkidle2", timeout: 180000 });
await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 });
await esp(8000);

const medir = async (tipo, suelo) => {
  logs.length = 0;
  await pag.evaluate((t) => window.__hekatanSetParam("tipo", t), tipo);
  await esp(1500);
  await pag.evaluate((q) => window.__hekatanSetParam("suelo", q), suelo);
  await esp(8000);
  return pag.evaluate(() => {
    const st = window.__hekatanStates;
    const def = st.deformOutputs.val?.deformations;
    const sp = st.nodeInputs.val.springs ?? [];
    let wmin = 0, arriba = 0, total = 0, R = 0;
    for (const s of sp) {
      if (s.dof !== 2) continue;
      total++;
      const w = def?.get ? def.get(s.node)?.[2] : null;
      if (w == null || !isFinite(w)) continue;
      wmin = Math.min(wmin, w);
      if (w > 1e-9) arriba++;
      // ⚠️ Solo cuenta el muelle que ESTÁ COMPRIMIDO. Sumando también los
      // levantados, su -k·w (negativo) restaba y el equilibrio parecía no cerrar:
      // 770.8 contra 800 kN. Eran muelles que la solución ya había retirado.
      if (w < 0) R += -s.k * w;
    }
    const P = [...(st.nodeInputs.val.loads?.values() ?? [])].reduce((a, v) => a + (-v[2] || 0), 0);
    return { wmin: wmin * 1000, arriba, total, R, P, contacto: st.__cimContacto };
  });
};

for (const [tipo, nombre] of [[12, "LINDERO"], [13, "ESQUINERA"]]) {
  console.log(`\n── ${nombre}`);
  const lin = await medir(tipo, 0);
  console.log(`   suelo LINEAL          : asiento ${lin.wmin.toFixed(3)} mm · ` +
              `${lin.arriba} de ${lin.total} nudos LEVANTADOS con el muelle puesto (traccionando)`);
  const cmp = await medir(tipo, 1);
  const c = cmp.contacto ?? {};
  console.log(`   suelo SOLO COMPRESIÓN : asiento ${cmp.wmin.toFixed(3)} mm · ` +
              `${c.despegados} de ${c.total} nudos despegados · ${c.iteraciones} iteración(es)`);
  for (const l of logs.filter((x) => /contacto unilateral/.test(x))) console.log("        " + l.replace(/^\[Cimentación\]\s*/, ""));

  ok(lin.arriba > 0, `${nombre}: con suelo lineal SÍ hay muelles traccionando (el problema existe)`,
     `${lin.arriba} nudos`);
  ok(c.convergio === true, `${nombre}: la iteración de contacto CONVERGE`, `${c.iteraciones} iteraciones`);
  ok(c.traccion === 0, `${nombre}: al converger, NINGÚN muelle tira del terreno`, `${c.traccion} traccionando`);
  ok(c.despegado === 0, `${nombre}: y ningún nudo comprime sin muelle`, `${c.despegado}`);
  ok(Math.abs(cmp.R - cmp.P) / Math.max(1, cmp.P) < 0.02,
     `${nombre}: el equilibrio sigue cerrando`, `ΣR ${cmp.R.toFixed(1)} vs ΣP ${cmp.P.toFixed(1)} kN`);
  ok(Math.abs(cmp.wmin) > Math.abs(lin.wmin) * 0.99,
     `${nombre}: sin el muelle que tiraba, la zapata asienta MÁS (o igual)`,
     `${lin.wmin.toFixed(3)} → ${cmp.wmin.toFixed(3)} mm`);
  await pag.screenshot({ path: join(OUT, `${nombre}.png`) });
}
ok(err.length === 0, "sin errores de página", err.slice(0, 2).join(" | "));
await nav.close(); srv.close();
console.log(`\nfotogramas en ${OUT}`);
console.log(fallos.length ? `${fallos.length} FALLO(S)` : "Todo correcto");
process.exit(fallos.length ? 1 : 0);
