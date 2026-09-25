/** Importar S2K con el botón y comprobar que las CARGAS llegan (ΣFz en states.nodeInputs). */
import puppeteer from "puppeteer";
const ARCH = process.argv[2] || "C:/Users/j-b-j/Downloads/Cancha Parque.s2k";
const PNG = process.argv[3] || "importar_s2k.png";
const URL_ = "http://localhost:4600/workspace/?t=new-blank";
const nav = await puppeteer.launch({ headless: "new",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage();
await pag.setViewport({ width: 1400, height: 900 });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const errores = [];
pag.on("pageerror", (e) => errores.push(String(e).slice(0, 200)));
pag.on("console", (m) => { const t = m.text(); if (/S2K|CSI Importer|Importar/.test(t)) console.log("  [consola] " + t.slice(0, 220)); });
pag.on("dialog", (d) => { console.log("  aviso: " + d.message().slice(0, 150)); d.accept(); });
await pag.goto(URL_, { waitUntil: "networkidle2", timeout: 180000 });
await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 });
await espera(4000);
const pulsar = (t) => pag.evaluate((t) => {
  const b = [...document.querySelectorAll(".tp-btnv_b")].find((x) => x.textContent.includes(t));
  if (!b) return false;
  let f = b.closest(".tp-fldv"); while (f) { if (f.classList.contains("tp-fldv-cpl")) f.querySelector(":scope > .tp-fldv_b").click(); f = f.parentElement?.closest(".tp-fldv"); }
  b.click(); return true;
}, t);
const [ch] = await Promise.all([pag.waitForFileChooser({ timeout: 15000 }), pulsar("Importar S2K")]);
await ch.accept([ARCH]);
await espera(5000);
await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx && (window.__hekatanStates?.nodes?.rawVal?.length ?? 0) > 0, { timeout: 120000 });
await espera(8000);
const r = await pag.evaluate(() => {
  const st = window.__hekatanStates;
  const L = st.nodeInputs.rawVal.loads; let F = [0, 0, 0];
  for (const v of L.values()) for (let k = 0; k < 3; k++) F[k] += v[k];
  const ei = st.elementInputs.rawVal;
  return { t: new URLSearchParams(location.search).get("t"), nudos: st.nodes.rawVal.length, elems: st.elements.rawVal.length,
    apoyos: st.nodeInputs.rawVal.supports.size, nudosCargados: L.size, F: F.map((x) => +x.toFixed(3)),
    frameFixedEnd: ei.frameFixedEnd?.size ?? 0, frameLoads: ei.frameLoads?.size ?? 0,
    desp: st.deformOutputs?.rawVal?.deformations?.size ?? 0 };
});
console.log(JSON.stringify(r));
await pag.screenshot({ path: PNG });
console.log("errores:", errores.length ? errores : "ninguno");
await nav.close();
