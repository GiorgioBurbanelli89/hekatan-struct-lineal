/**
 * LAS SIETE CIMENTACIONES, UNA POR UNA.
 *
 * Jorge, 17-sep-2026: «faltan plantillas de cimentación: zapata aislada, zapata con
 * vigas de amarre, zapata combinada, zapata esquinera, zapata de lindero» y
 * «vigas de cimentación invertidas, una T invertida, como elemento frame».
 *
 * De cada tipología se mide lo mismo, y lo que manda es el EQUILIBRIO: si la suma
 * de la reacción del terreno no es la carga aplicada, los muelles no están
 * recogiendo la carga y da igual lo bonito que salga el dibujo.
 *
 * También se recogen los avisos de consola: en la de lindero y la esquinera, que son
 * excéntricas de nacimiento, el muelle LINEAL puede quedar traccionado donde el
 * terreno se despegaría. Eso hay que verlo, no esconderlo.
 *
 *   node cli/_cim_siete_tipos.mjs
 */
import puppeteer from "puppeteer";
import fs from "node:fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "shots", "cim7");
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
await new Promise((r) => srv.listen(4871, r));
const nav = await puppeteer.launch({ headless: "new",
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1400, height: 900 });
const err = []; pag.on("pageerror", (e) => err.push(String(e).slice(0, 140)));
const avisos = [];
pag.on("console", (m) => { if (/Cimentaci/.test(m.text())) avisos.push(m.text().slice(0, 150)); });

await pag.goto(`http://localhost:4871${BASE}workspace/?t=plantillas`, { waitUntil: "networkidle2", timeout: 180000 });
await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 });
await new Promise((r) => setTimeout(r, 8000));

const NOM = { 10: "AISLADA", 8: "REJILLA+AMARRE", 11: "COMBINADA", 12: "LINDERO",
              13: "ESQUINERA", 14: "VIGA T INVERTIDA", 9: "LOSA MAT" };
let fallos = 0;
for (const t of [10, 8, 11, 12, 13, 14, 9]) {
  avisos.length = 0;
  await pag.evaluate((q) => window.__hekatanSetParam("tipo", q), t);
  await new Promise((r) => setTimeout(r, 7000));
  const m = await pag.evaluate(() => {
    const st = window.__hekatanStates, el = st.elements.val;
    const def = st.deformOutputs.val?.deformations;
    let w = 0, nan = 0;
    def?.forEach?.((v) => { const q = v?.[2] ?? 0; if (!isFinite(q)) nan++; else w = Math.min(w, q); });
    const sp = st.nodeInputs.val.springs ?? [];
    let R = 0;
    for (const s of sp) if (s.dof === 2) {
      const q = def?.get ? def.get(s.node)?.[2] : null;
      if (q != null && isFinite(q)) R += -s.k * q;
    }
    const P = [...(st.nodeInputs.val.loads?.values() ?? [])].reduce((a, v) => a + (-v[2] || 0), 0);
    return { nudos: st.nodes.val.length, panos: el.filter((e) => e.length === 4).length,
             barras: el.filter((e) => e.length === 2).length, asiento: w * 1000, nan, R, P };
  });
  const eq = Math.abs(m.R - m.P) / Math.max(1, m.P) < 0.02;
  const ok = m.nan === 0 && m.asiento < 0 && eq && (m.panos > 0 || m.barras > 0);
  if (!ok) fallos++;
  console.log(`${ok ? " OK " : " -- "} ${String(t).padStart(2)} ${NOM[t].padEnd(16)} ` +
    `${String(m.nudos).padStart(4)} nudos · ${String(m.panos).padStart(4)} paños · ` +
    `${String(m.barras).padStart(3)} barras · asiento ${m.asiento.toFixed(3).padStart(8)} mm · ` +
    `ΣR ${m.R.toFixed(0)}/${m.P.toFixed(0)} kN`);
  for (const a of avisos) console.log("        " + a.replace(/^\[Cimentación\]\s*/, "aviso: "));
  await pag.screenshot({ path: join(OUT, `${t}_${NOM[t].replace(/[^A-Z]/g, "")}.png`) });
}
console.log("\npageerror:", err.length, err.slice(0, 2));
console.log(`fotogramas en ${OUT}`);
await nav.close(); srv.close();
process.exit(fallos ? 1 : 0);
