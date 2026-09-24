/**
 * EL MENÚ DE PLANTILLAS, FOTOGRAMA A FOTOGRAMA.
 *
 * Jorge, 17-sep-2026: «revisa con fotogramas: pusiste el botón de cimentación y
 * luego no zapatas aisladas o una lista».
 *
 * Se abre el menú «📐 Nuevo modelo · Plantillas», se lee la lista ENTERA de
 * botones tal como la ve él, se pulsa cada entrada de cimentación y se mira que
 * lo que sale sea lo que dice el botón.
 *
 *   node cli/_menu_cimentacion.mjs
 */
import puppeteer from "puppeteer";
import fs from "node:fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "shots", "menu_cimentacion");
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
await new Promise((r) => srv.listen(4857, r));
const nav = await puppeteer.launch({ headless: "new",
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1400, height: 900 });
const err = []; pag.on("pageerror", (e) => err.push(String(e).slice(0, 160)));
pag.on("dialog", (d) => d.accept().catch(() => {}));
const esp = (m) => new Promise((r) => setTimeout(r, m));
const fallos = [];
const ok = (c, q, d = "") => { console.log((c ? "  OK  " : "  --  ") + q + (d ? "  |  " + d : "")); if (!c) fallos.push(q); };
let n = 0;
const foto = async (t) => { await esp(150); await pag.screenshot({ path: join(OUT, `${String(n++).padStart(2, "0")}_${t}.png`) }); };

await pag.goto(`http://localhost:4857${BASE}workspace/`, { waitUntil: "networkidle2", timeout: 180000 });
await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 });
await esp(8000);
await foto("portada");

// abrir el menú (el botón 🏠 Menú de arriba)
const bMenu = await pag.evaluate(() => {
  const b = [...document.querySelectorAll("button")].find((e) => /Men[úu]/.test(e.textContent || ""));
  if (!b) return null; const r = b.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
});
if (bMenu) { await pag.mouse.click(bMenu.x, bMenu.y); await esp(1200); }
await foto("menu_abierto");

const lista = await pag.evaluate(() => [...document.querySelectorAll("button")]
  .map((b) => (b.textContent || "").trim())
  .filter((t) => t && (t.includes("Pórtico") || t.includes("Losa") || t.includes("Cimentación") ||
                       t.includes("rejilla") || t.includes("Lienzo") || t.includes("Editar"))));
console.log("\n   LISTA que ve el usuario:");
for (const t of lista) console.log("     · " + t);
const zap = lista.find((t) => t.includes("zapatas aisladas"));
const losa = lista.find((t) => t.includes("losa de cimentación"));
ok(!!zap, "hay una entrada de ZAPATAS AISLADAS en el menú", zap || "no está");
ok(!!losa, "hay una entrada de LOSA DE CIMENTACIÓN en el menú", losa || "no está");

const pulsar = (txt) => pag.evaluate((t) => {
  const b = [...document.querySelectorAll("button")].find((e) => (e.textContent || "").trim() === t);
  if (!b) return false; b.click(); return true;
}, txt);
const medir = () => pag.evaluate(() => {
  const st = window.__hekatanStates, el = st.elements.val;
  const def = st.deformOutputs.val?.deformations;
  let w = 0; def?.forEach?.((v) => { w = Math.min(w, v?.[2] ?? 0); });
  const pr = window.__hekatanGetParams();
  return { tipo: pr.tipo, zapForm: pr.zapForm, panos: el.filter((e) => e.length === 4).length,
           barras: el.filter((e) => e.length === 2).length,
           muelles: (st.nodeInputs.val.springs || []).length, asiento: w * 1000 };
});

for (const [txt, rotulo, esperaBarras] of [[zap, "zapatas", true], [losa, "losa", false]]) {
  if (!txt) continue;
  if (bMenu) { await pag.mouse.click(bMenu.x, bMenu.y); await esp(1000); }
  const puls = await pulsar(txt);
  ok(puls, `se puede pulsar «${txt.slice(0, 40)}…»`);
  await esp(7000);
  const m = await medir();
  console.log(`   ${rotulo}: tipo ${m.tipo} · zapForm ${m.zapForm} · ${m.panos} paños · ${m.barras} barras · ` +
              `${m.muelles} muelles · asiento ${m.asiento.toFixed(3)} mm`);
  ok(m.panos > 0 && m.muelles > 0, `${rotulo}: arma cimiento con muelles de suelo`);
  ok(m.asiento < 0, `${rotulo}: asienta`, `${m.asiento.toFixed(3)} mm`);
  ok(m.zapForm === 0, `${rotulo}: arranca en Shell-Thick (lo que recomienda el manual CSI)`, `zapForm ${m.zapForm}`);
  if (esperaBarras) ok(m.barras > 0, "las zapatas traen vigas de amarre y pedestales", `${m.barras} barras`);
  await foto(rotulo);
}
ok(err.length === 0, "sin errores de página", err.slice(0, 2).join(" | "));
await nav.close(); srv.close();
console.log(`\nfotogramas en ${OUT}`);
console.log(fallos.length ? `${fallos.length} FALLO(S)` : "Todo correcto");
process.exit(fallos.length ? 1 : 0);
