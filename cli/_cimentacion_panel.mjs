/**
 * ¿QUÉ SE PUEDE ELEGIR DENTRO, una vez pulsada la cimentación?
 *
 * Jorge, 17-sep-2026: «cuando haces click en la cimentación no está abriendo
 * opciones, solo hay una forma de cimentación adentro».
 *
 * Se pulsa la entrada del menú y se LEE el panel de parámetros: qué dice el
 * desplegable «Plantilla», qué opciones tiene, y qué hay en el folder de
 * cimentación. Con fotograma de cada paso, contra la web PÚBLICA.
 *
 *   node cli/_cimentacion_panel.mjs
 */
import puppeteer from "puppeteer";
import fs from "node:fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "shots", "cimentacion_panel");
fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
const URL = "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/";

const nav = await puppeteer.launch({ headless: "new",
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1400, height: 900 });
const err = []; pag.on("pageerror", (e) => err.push(String(e).slice(0, 160)));
pag.on("dialog", (d) => d.accept().catch(() => {}));
const esp = (m) => new Promise((r) => setTimeout(r, m));
let n = 0;
const foto = async (t) => { await esp(250); await pag.screenshot({ path: join(OUT, `${String(n++).padStart(2, "0")}_${t}.png`) }); };
const fallos = [];
const ok = (c, q, d = "") => { console.log((c ? "  OK  " : "  --  ") + q + (d ? "  |  " + d : "")); if (!c) fallos.push(q); };

await pag.setCacheEnabled(false);
await pag.goto(URL, { waitUntil: "networkidle2", timeout: 240000 });
await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 150000 });
await esp(9000);

const bMenu = await pag.evaluate(() => {
  const b = [...document.querySelectorAll("button")].find((e) => /Men[úu]/.test(e.textContent || ""));
  const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
});
await pag.mouse.click(bMenu.x, bMenu.y); await esp(1500);
await foto("menu");

await pag.evaluate(() => {
  const b = [...document.querySelectorAll("button")]
    .find((e) => (e.textContent || "").includes("zapatas aisladas"));
  b?.click();
});
await esp(9000);
await foto("tras_pulsar_zapatas");

// ── qué se puede elegir DENTRO ────────────────────────────────────────────
const panel = await pag.evaluate(() => {
  // desplegables de Tweakpane: <select> con sus <option>
  const sels = [...document.querySelectorAll("select")].map((s) => {
    // la etiqueta está en la fila del propio control
    const fila = s.closest("div[class*=cntr], div[class*=row], .tp-lblv, .tp-rotv") || s.parentElement;
    const etiqueta = (fila?.textContent || "").replace(s.textContent || "", "").trim().slice(0, 40);
    return { etiqueta, valor: s.value,
             opciones: [...s.options].map((o) => o.textContent.trim()) };
  });
  const folders = [...document.querySelectorAll("button, .tp-fldv_b")]
    .map((b) => (b.textContent || "").trim())
    .filter((t) => /Cimentación|Rejilla|Pisos|Secciones|Cargas|Malla/.test(t));
  return { sels, folders };
});

const selPlantilla = panel.sels.find((s) => s.opciones.some((o) => o.includes("Cimentación")));
console.log("\n   desplegable que manda la tipología:");
if (selPlantilla) {
  console.log("     etiqueta:", JSON.stringify(selPlantilla.etiqueta));
  console.log("     valor actual:", JSON.stringify(selPlantilla.valor));
  selPlantilla.opciones.forEach((o) => console.log("       · " + o));
}
ok(!!selPlantilla, "dentro del panel hay un desplegable con las tipologías");
const cims = selPlantilla ? selPlantilla.opciones.filter((o) => o.includes("Cimentación")) : [];
ok(cims.length === 2, "y desde ahí se puede cambiar ENTRE LAS DOS cimentaciones sin volver al menú",
   `${cims.length} opciones de cimentación`);

console.log("\n   folders visibles:", panel.folders.join(" · "));
ok(panel.folders.some((f) => f.includes("Cimentación")), "hay un folder «⬓ Cimentación» con sus parámetros");

// abrir el folder de cimentación y fotografiarlo
await pag.evaluate(() => {
  const b = [...document.querySelectorAll("button, .tp-fldv_b")]
    .find((e) => (e.textContent || "").includes("Cimentación"));
  b?.click();
});
await esp(1200);
await foto("folder_cimentacion");

const campos = await pag.evaluate(() => [...document.querySelectorAll("input, select")]
  .map((e) => {
    const fila = e.closest(".tp-lblv") || e.parentElement?.parentElement;
    return ((fila?.textContent || "").trim().slice(0, 45));
  })
  .filter((t) => /zapata|losa|balasto|columna|pedestal|amarre|vuelo|Formulación|malla/i.test(t)));
console.log("\n   parámetros de cimentación en el panel:");
[...new Set(campos)].forEach((c) => console.log("     · " + c));
ok(campos.length >= 5, "el folder trae los parámetros del cimiento", `${[...new Set(campos)].length}`);

ok(err.length === 0, "sin errores de página", err.slice(0, 2).join(" | "));
await nav.close();
console.log(`\nfotogramas en ${OUT}`);
console.log(fallos.length ? `${fallos.length} FALLO(S)` : "Todo correcto");
process.exit(fallos.length ? 1 : 0);
