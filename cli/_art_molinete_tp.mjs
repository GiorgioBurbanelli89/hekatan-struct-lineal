// Ensayo sin cursor: test-m-dual malla 1.0 m, muros en molinete puestos DESDE EL TWEAKPANE (inputs/select del DOM).
import puppeteer from "puppeteer";
const BASE = process.argv[2] ?? "https://giorgioburbanelli89.github.io/hekatan-struct-lineal";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const pag = await nav.newPage(); await pag.setViewport({ width: 1600, height: 1000 });
const err = []; pag.on("pageerror", (e) => err.push(String(e)));
const P = Buffer.from(JSON.stringify({ ms: 1.0 })).toString("base64");
await pag.goto(`${BASE}/workspace/?t=test-m-dual&p=${P}&v=${Date.now()}`, { waitUntil: "networkidle2", timeout: 120000 }); await espera(9000);
const poner = async (etq, v) => {
  const h = await pag.evaluateHandle((etq) => [...document.querySelectorAll(".tp-lblv")].find((x) => x.querySelector(".tp-lblv_l")?.innerText.trim() === etq), etq);
  const el = h.asElement(); if (!el) return "NO " + etq;
  await el.evaluate((e) => e.scrollIntoView({ block: "center" }));
  const s = await el.$("select");
  if (s) { const idx = await s.evaluate((s, v) => [...s.options].findIndex((o) => o.value === String(v) || o.text.startsWith(v === 0 ? "⟂X" : "⟂Y")), v);
    const val = await s.evaluate((s, i) => s.options[i].value, idx); await s.select(val); return "ok"; }
  const i = await el.$("input"); await i.click({ clickCount: 3 }); await pag.keyboard.type(String(v)); await pag.keyboard.press("Enter"); return "ok";
};
const abrir = (t) => pag.evaluate((t) => { const e = [...document.querySelectorAll(".tp-fldv_t")].find((x) => x.innerText.includes(t));
  if (e && !e.closest(".tp-fldv").classList.contains("tp-fldv-expanded")) e.click(); return !!e; }, t);
console.log("carpeta", await abrir("Muros de corte")); await espera(800);
const M = [[0, 0, 0, 1], [0, 2, 1, 1], [1, 0, 1, 1], [1, 2, 0, 1]];
console.log(await poner("N° de muros", 4)); await espera(4000); await abrir("Muros de corte"); await espera(800);
for (let k = 1; k <= 4; k++) {
  const [d, l, s, w] = M[k - 1];
  for (const [e, v] of [[`Muro ${k} · dirección`, d], [`Muro ${k} · línea (eje)`, l], [`Muro ${k} · vano inicial`, s], [`Muro ${k} · ancho (vanos)`, w]]) {
    const r = await poner(e, v); if (r !== "ok") console.log(r); await espera(1500);
  }
}
await espera(3000);
const r = await pag.evaluate(() => { const n = window.__hekatanNEC; n.params.sistema = 1; n.params.irregular = 0; n.correr(); const a = n.params.info; n.aguiar();
  const r = n.resultado(); return { nudos: window.__hekatanStates.nodes.val.length, info: a, aguiar: n.params.info,
    cr: r.cr.map((c) => c.map((v) => v.toFixed(2)).join(",")), cm: r.pisos.map((q) => q.cm.map((v) => v.toFixed(2)).join(",")) }; });
await pag.screenshot({ path: "cli/shots/aguiar/molinete_tp.png" });
for (const nm of [24, 36, 60]) console.log(nm, await pag.evaluate((nm) => { const n = window.__hekatanNEC; n.params.nModos = nm; n.correr(); return n.params.info.split(String.fromCharCode(10))[4]; }, nm));
console.log(JSON.stringify({ ...r, err }, null, 1)); await nav.close();
