/**
 * LA CIMENTACIÓN, EN LA WEB PÚBLICA, PULSANDO LOS BOTONES.
 *
 * No vale con que `gh-pages` diga «Published»: eso solo dice que subió ficheros.
 * Aquí se abre la URL pública, se abre el menú, se pulsa CADA entrada de
 * cimentación y se mide lo que sale, con fotograma de cada paso.
 *
 *   node cli/_cimentacion_publico.mjs
 */
import puppeteer from "puppeteer";
import fs from "node:fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "shots", "cimentacion_publico");
fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
const URL = "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/";

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
const foto = async (t) => { await esp(200); await pag.screenshot({ path: join(OUT, `${String(n++).padStart(2, "0")}_${t}.png`) }); };

// caché fuera: se mide el deploy de AHORA, no el que tenga guardado el navegador
await pag.setCacheEnabled(false);
await pag.goto(URL, { waitUntil: "networkidle2", timeout: 240000 });
await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 150000 });
await esp(9000);
await foto("portada");

const bMenu = await pag.evaluate(() => {
  const b = [...document.querySelectorAll("button")].find((e) => /Men[úu]/.test(e.textContent || ""));
  if (!b) return null; const r = b.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
});
ok(!!bMenu, "está el botón de Menú");
await pag.mouse.click(bMenu.x, bMenu.y); await esp(1500);
await foto("menu");

const entradas = await pag.evaluate(() => [...document.querySelectorAll("button")]
  .map((b) => (b.textContent || "").trim()).filter((t) => t.includes("Cimentación")));
console.log("\n   entradas de cimentación en PÚBLICO:");
entradas.forEach((t) => console.log("     · " + t));
ok(entradas.length === 2, "hay DOS cimentaciones para elegir, no una", `${entradas.length}`);

const medir = () => pag.evaluate(() => {
  const st = window.__hekatanStates, el = st.elements.val;
  const def = st.deformOutputs.val?.deformations;
  let w = 0, nan = 0;
  def?.forEach?.((v) => { const q = v?.[2] ?? 0; if (!isFinite(q)) nan++; else w = Math.min(w, q); });
  const pr = window.__hekatanGetParams();
  const springs = st.nodeInputs.val.springs ?? [];
  let R = 0;
  for (const s of springs) if (s.dof === 2) {
    const q = def?.get ? def.get(s.node)?.[2] : null;
    if (q != null && isFinite(q)) R += -s.k * q;
  }
  const P = [...(st.nodeInputs.val.loads?.values() ?? [])].reduce((a, v) => a + (-v[2] || 0), 0);
  // ¿en cuántos nudos entra la carga de cada columna? (la huella)
  const nCargados = [...(st.nodeInputs.val.loads?.keys() ?? [])].length;
  return { tipo: pr.tipo, zapForm: pr.zapForm, volCim: pr.volCim,
           panos: el.filter((e) => e.length === 4).length, barras: el.filter((e) => e.length === 2).length,
           nudos: st.nodes.val.length, muelles: springs.length, nCargados, asiento: w * 1000, nan, R, P };
});

for (const txt of entradas) {
  await pag.evaluate((t) => {
    const b = [...document.querySelectorAll("button")].find((e) => (e.textContent || "").trim() === t);
    b?.click();
  }, txt);
  await esp(9000);
  const m = await medir();
  const nombre = txt.includes("zapatas") ? "zapatas" : "losa";
  console.log(`\n── ${txt}`);
  console.log(`   tipo ${m.tipo} · Shell-${m.zapForm === 0 ? "Thick" : "Thin"} · vuelo ${m.volCim} m`);
  console.log(`   ${m.nudos} nudos · ${m.panos} paños · ${m.barras} barras · ${m.muelles} muelles`);
  console.log(`   carga repartida en ${m.nCargados} nudos · asiento ${m.asiento.toFixed(3)} mm`);
  console.log(`   ΣR terreno ${m.R.toFixed(1)} kN = ΣP ${m.P.toFixed(1)} kN`);
  ok(m.panos > 0 && m.muelles > 0, `${nombre}: arma cimiento con muelles`, `${m.panos} paños`);
  ok(m.nan === 0 && m.asiento < 0, `${nombre}: resuelve y asienta, sin NaN`, `${m.asiento.toFixed(3)} mm`);
  ok(Math.abs(m.R - m.P) / Math.max(1, m.P) < 0.02, `${nombre}: ΣR del terreno = ΣP`, `${m.R.toFixed(1)} vs ${m.P.toFixed(1)}`);
  ok(m.nCargados > 16, `${nombre}: la carga entra por la HUELLA, no por un nudo por columna`,
     `${m.nCargados} nudos cargados`);
  await foto(nombre);
  if (txt !== entradas[entradas.length - 1]) { await pag.mouse.click(bMenu.x, bMenu.y); await esp(1500); }
}
ok(err.length === 0, "sin errores de página", err.slice(0, 2).join(" | "));
await nav.close();
console.log(`\nfotogramas en ${OUT}`);
console.log(fallos.length ? `${fallos.length} FALLO(S)` : "Todo correcto en el DEPLOY PÚBLICO");
process.exit(fallos.length ? 1 : 0);
