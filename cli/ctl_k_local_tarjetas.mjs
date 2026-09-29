/**
 * Tarjetas de K local al pasar el cursor: paño (estribo-puente) y barra con la pestaña «En letras»
 * (plantillas). Guarda PNG y el texto de las dos hojas de Hekatan LISP.
 *   node cli/ctl_k_local_tarjetas.mjs [--base http://localhost:4600]
 */
import puppeteer from "puppeteer";
import { mkdirSync, writeFileSync } from "node:fs";
const i = process.argv.indexOf("--base");
const BASE = i >= 0 ? process.argv[i + 1] : "http://localhost:4600";
const DIR = "cli/shots/ctl_k_local_tarjetas";
mkdirSync(DIR, { recursive: true });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage();
await pag.setViewport({ width: 1600, height: 1000 });
const errores = [];
pag.on("pageerror", (e) => errores.push(e.message));
let fallos = 0;
const ok = (c, t) => { console.log(`${c ? "ok  " : "FALLA"} ${t}`); if (!c) fallos++; };
const abrir = async (id) => {
  await pag.goto(`${BASE}/workspace/index.html?t=${id}`, { waitUntil: "networkidle2", timeout: 180000 });
  await pag.waitForFunction(() => !!window.__hkKLocalHover && !!window.__hekatanStates?.elements?.val?.length, { timeout: 120000 });
  await espera(4000);
};
// 1) paño del estribo: el primero de la zapata y uno de la pantalla
await abrir("estribo-puente");
const idxs = await pag.evaluate(() => {
  const el = window.__hekatanStates.elements.val; const q = [];
  el.forEach((e, i) => { if (e.length === 4) q.push(i); });
  return [q[0], q[q.length - 1]];
});
for (const [k, idx] of idxs.entries()) {
  await pag.evaluate((j) => window.__hkKLocalHover.verPano(j, 120, 60), idx);
  await espera(600);
  const r = await pag.evaluate(() => { const t = document.getElementById("hk-klocal"); return { vis: t?.style.display, txt: t?.innerText ?? "", tablas: t?.querySelectorAll("table").length ?? 0 }; });
  await pag.screenshot({ path: `${DIR}/pano_${k + 1}.png` });
  ok(r.vis === "block" && r.tablas === 2 && /Placa/.test(r.txt) && /Membrana/.test(r.txt), `paño ${idx + 1}: tarjeta con placa y membrana · ${r.txt.split("\n")[1]}`);
}
// hoja del paño
const hPano = await pag.evaluate((j) => { let h = ""; const o = window.__hkHoja; window.__hkHoja = (a, b) => { h = b; }; return h; }, idxs[0]);
// 2) barra con la pestaña en letras
await abrir("plantillas");
const ib = await pag.evaluate(() => window.__hekatanStates.elements.val.findIndex((e) => e.length === 2));
await pag.evaluate((j) => { window.__hkKLocalHover.vista("letras"); window.__hkKLocalHover.ver(j, 120, 60); }, ib);
await espera(600);
const rb = await pag.evaluate(() => document.getElementById("hk-klocal")?.innerText ?? "");
await pag.screenshot({ path: `${DIR}/barra_letras.png` });
ok(/k\s*v3/.test(rb.replace(/\n/g, " ")) || /kv3/.test(rb.replace(/\s/g, "")), "barra: tabla en letras (k_v3…)");
ok(/con los números de esta barra da la matriz del solver/.test(rb) || /liberaciones|brazos/.test(rb), "barra: comprobación letras = solver");
await pag.evaluate(() => { document.querySelector('#hk-klocal .tabs button[data-v="numeros"]')?.click(); });
await espera(400);
await pag.screenshot({ path: `${DIR}/barra_numeros.png` });
ok(errores.length === 0, "0 errores de página " + errores.join(" | "));
await nav.close();
console.log(fallos ? `${fallos} FALLOS` : "TODO BIEN");
process.exit(fallos ? 1 : 0);
