// SONDA RÁPIDA de un capítulo de tutorial contra el DEV SERVER, sin grabar fotogramas:
// corre los mismos pasos (mismos clics con el ratón) y saca UN PNG al final de cada paso.
// Sirve para cazar el fallo en 1-3 min en vez de en una toma de 30 min.
//   node cli/_sonda_capitulo.mjs cap19_cercha_warren [puerto=4610] [desdePaso] [hastaPaso]
import puppeteer from "puppeteer";
import { mkdirSync } from "fs";
import { pathToFileURL } from "url";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
const AQUI = dirname(fileURLToPath(import.meta.url));
const CAP = process.argv[2]; const PUERTO = process.argv[3] || "4610";
const DESDE = +(process.argv[4] ?? 0), HASTA = +(process.argv[5] ?? 99);
const cap = await import(pathToFileURL(join(AQUI, "tutoriales", CAP + ".mjs")).href);
const OUT = join(AQUI, "shots", "sonda_" + CAP); mkdirSync(OUT, { recursive: true });
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"] });
const pag = await nav.newPage();
await pag.evaluateOnNewDocument(() => { try { Object.defineProperty(window, "showSaveFilePicker", { value: undefined, configurable: true }); } catch (e) {} });
await pag.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });
const err = []; pag.on("pageerror", (e) => err.push(e.message.slice(0, 160)));
let resp = null; pag.on("dialog", (d) => { const r = resp; resp = null; d.accept(r ?? undefined).catch(() => {}); });
const ruta = cap.ruta || "workspace/?t=plantillas";
await pag.goto(`http://localhost:${PUERTO}/${ruta}`, { waitUntil: "networkidle2", timeout: 180000 }).catch(() => {});
await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 });
await new Promise((r) => setTimeout(r, 5000));
// la misma capa del grabador, en mínimo: cursor, clic y caja (para que los pasos no fallen)
await pag.evaluate(() => {
  const capa = document.createElement("div"); capa.style.cssText = "position:fixed;inset:0;z-index:2147483647;pointer-events:none"; document.body.appendChild(capa);
  const cur = document.createElement("div"); cur.style.cssText = "position:absolute;width:12px;height:12px;border:2px solid #f43f5e;border-radius:50%;transform:translate(-6px,-6px)"; capa.appendChild(cur);
  const cj = document.createElement("div"); cj.style.cssText = "position:absolute;border:2px solid #22d3ee;display:none;color:#fff;font:12px sans-serif"; capa.appendChild(cj);
  window.__tutCursor = (x, y) => { cur.style.left = x + "px"; cur.style.top = y + "px"; };
  window.__tutClick = () => {};
  window.__tutCaja = (r, t) => { Object.assign(cj.style, { display: "block", left: r.x + "px", top: r.y + "px", width: r.w + "px", height: r.h + "px" }); cj.textContent = t || ""; };
  window.__tutSinCaja = () => { cj.style.display = "none"; };
  // descargas: se capturan como en el grabador
  const orig = URL.createObjectURL;
  URL.createObjectURL = function (b) { try { b.text?.().then((t) => { window.__tutDescarga = { nombre: "descarga", texto: t }; }); } catch (e) {} return orig.call(URL, b); };
});
const api = {
  pag, espera: (ms) => new Promise((r) => setTimeout(r, ms)), foto: async () => {},
  quieto: async (n, ms = 260) => { await new Promise((r) => setTimeout(r, Math.min(n * ms, 1500) / 3)); },
  general: async () => {}, cerca: async () => true, cercaSel: async () => true, marcar: async () => true, sinCuadro: async () => {},
  portada: async () => {}, responder: (t) => { resp = t; }, dialogo: async () => null,
  archivo: async () => { const d = await pag.evaluate(() => window.__tutDescarga?.texto?.length ?? 0); console.log("   descarga:", d, "car."); return d ? { texto: "" } : null; },
  sinArchivo: async () => {},
  abrir: async () => { throw new Error("sonda: a.abrir es del PANEL, no de la cinta"); },
  ajuste: async () => { throw new Error("sonda: a.ajuste es inyectar por código"); },
  elegir: async () => { throw new Error("sonda: a.elegir es un desplegable del PANEL"); },
  pulsar: async () => { throw new Error("sonda: a.pulsar busca en el PANEL"); },
};
// ¿Algún clic cae en un Tweakpane? Se vigila en la página.
await pag.evaluate(() => { window.__clicsPanel = []; document.addEventListener("pointerdown", (e) => { const t = e.target; if (t?.closest?.(".tp-dfwv, .tp-rotv, #settings, #hk-pane-host")) window.__clicsPanel.push((t.textContent || t.className || "").toString().slice(0, 40)); }, true); });
const t0 = Date.now();
for (let i = 0; i < cap.pasos.length; i++) {
  if (i < DESDE || i > HASTA) continue;
  const p = cap.pasos[i]; const t = Date.now();
  try { await p.hacer(api); } catch (e) { console.log(`  !! paso ${i} falló: ${String(e).slice(0, 200)}`); }
  await pag.screenshot({ path: join(OUT, `p${String(i).padStart(2, "0")}.png`) });
  const pan = await pag.evaluate(() => window.__clicsPanel.splice(0));
  console.log(`${String(i).padStart(2)} ${((Date.now() - t) / 1000).toFixed(0)}s ${p.rotulo.slice(0, 70)}${pan.length ? "  ❌ CLIC EN PANEL: " + pan.join(" | ") : ""}`);
}
console.log(`total ${((Date.now() - t0) / 1000).toFixed(0)} s · pageerror: ${err.length ? err.join(" / ") : 0}`);
await nav.close();
