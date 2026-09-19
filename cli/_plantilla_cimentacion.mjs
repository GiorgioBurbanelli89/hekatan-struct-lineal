/**
 * LA PLANTILLA DE CIMENTACIÓN: que exista, que resuelva y que el suelo trabaje.
 *
 * Tres cosas, no una:
 *   1. la opción sale en el desplegable de plantillas;
 *   2. el modelo se arma y RESUELVE (zapatas y losa), sin NaN;
 *   3. ΣR del terreno = ΣP aplicada — si el equilibrio no cierra, los muelles
 *      no están recogiendo la carga y lo demás da igual.
 *
 *   node cli/_plantilla_cimentacion.mjs
 */
import puppeteer from "puppeteer";
import fs from "node:fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "shots", "cimentacion");
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
await new Promise((r) => srv.listen(4841, r));
const nav = await puppeteer.launch({ headless: "new",
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1400, height: 880 });
const err = []; pag.on("pageerror", (e) => err.push(String(e).slice(0, 160)));
pag.on("dialog", (d) => d.accept().catch(() => {}));
const esp = (m) => new Promise((r) => setTimeout(r, m));
const fallos = [];
const ok = (c, q, d = "") => { console.log((c ? "  OK  " : "  --  ") + q + (d ? "  |  " + d : "")); if (!c) fallos.push(q); };

await pag.goto(`http://localhost:4841${BASE}workspace/?t=plantillas`, { waitUntil: "networkidle2", timeout: 180000 });
await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 }); await esp(9000);

const hayOpcion = await pag.evaluate(() => [...document.querySelectorAll("option, select")]
  .map((e) => e.textContent || "").join(" ").includes("Cimentación"));
ok(hayOpcion, "la plantilla de Cimentación sale en el desplegable");

// Se arma por el MISMO camino que el usuario: tocando los parametros de la app
// (__hekatanSetParam) y dejando que reconstruya. Armarlo a mano en el script
// mediria el script, no la app.
const medir = async (cimTipo, zapForm) => {
  // ⚠️ `tipo` PRIMERO: al cambiar de plantilla el panel se reconstruye y los
  // parametros que no estaban en la anterior vuelven a su defecto. Poniendolo
  // al final, el `ms` que se habia fijado se perdia y las dos formulaciones
  // salian con MALLA DISTINTA — comparar eso no mide la formulacion.
  for (const [k, v] of [["tipo", 8], ["nx", 3], ["ny", 3], ["sx", 5], ["sy", 5],
                        ["cimTipo", cimTipo], ["zapForm", zapForm], ["ms", 0.5]])
    await pag.evaluate((a, b) => window.__hekatanSetParam(a, b), k, v);
  await esp(2500);
  return pag.evaluate(() => {
    const st = window.__hekatanStates;
    const nodes = st.nodes.val, el = st.elements.val;
    const def = st.deformOutputs.val?.deformations;
    let wmin = 0, nan = 0, n = 0;
    if (def?.forEach) def.forEach((v) => { const w = v?.[2] ?? 0; n++;
      if (!isFinite(w)) nan++; else wmin = Math.min(wmin, w); });
    const springs = st.nodeInputs.val.springs ?? [];
    let R = 0;
    for (const s of springs) if (s.dof === 2) {
      const w = def?.get ? def.get(s.node)?.[2] : null;
      if (w != null && isFinite(w)) R += -s.k * w;
    }
    const P = [...(st.nodeInputs.val.loads?.values() ?? [])].reduce((a, v) => a + (-v[2] || 0), 0);
    const pr = window.__hekatanGetParams();
    return { ms: pr.ms, zapB: pr.zapB, zapForm: pr.zapForm, cimTipo: pr.cimTipo, tipo: pr.tipo,
             nudos: nodes.length, panos: el.filter((e) => e.length === 4).length,
             barras: el.filter((e) => e.length === 2).length, wmin, nan, nDef: n, R, P };
  });
};

for (const [nombre, t, f] of [["zapatas aisladas · Shell-Thin (SAFE)", 0, 1],
                              ["zapatas aisladas · Shell-Thick", 0, 0],
                              ["losa de cimentación (mat)", 1, 1]]) {
  const m = await medir(t, f);
  console.log(`\n── ${nombre}`);
  console.log(`   params: tipo ${m.tipo} · cimTipo ${m.cimTipo} · zapForm ${m.zapForm} · ms ${m.ms} · B ${m.zapB}`);
  console.log(`   ${m.nudos} nudos · ${m.panos} paños · ${m.barras} barras`);
  console.log(`   asiento máx ${(m.wmin * 1000).toFixed(3)} mm · ΣR terreno ${m.R.toFixed(1)} kN · ΣP ${m.P.toFixed(1)} kN`);
  ok(m.panos > 0 && m.barras > 0, `${nombre}: se arma con paños y barras`);
  ok(m.nan === 0 && m.wmin < 0, `${nombre}: resuelve y el cimiento ASIENTA, sin NaN`,
     `${(m.wmin * 1000).toFixed(3)} mm`);
  ok(Math.abs(m.R - m.P) / Math.max(1, m.P) < 0.02, `${nombre}: ΣR del terreno = ΣP aplicada`,
     `${m.R.toFixed(1)} vs ${m.P.toFixed(1)} kN`);
  await pag.screenshot({ path: join(OUT, `${t}_${f}.png`) });
}
ok(err.length === 0, "sin errores de página", err.slice(0, 2).join(" | "));
await nav.close(); srv.close();
console.log(fallos.length ? `\n${fallos.length} FALLO(S)` : "\nTodo correcto");
process.exit(fallos.length ? 1 : 0);
