// Interfaz local vs pública: botones, carpetas de ajustes y capturas.
import puppeteer from "puppeteer";
import { writeFileSync } from "node:fs";
const SITIOS = { local: "http://localhost:4600/workspace/?t=edificio-dual", publico: "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=edificio-dual" };
const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox","--enable-unsafe-swiftshader","--use-angle=swiftshader","--enable-webgl"] });
const out = {};
for (const [nom, url] of Object.entries(SITIOS)) {
  const p = await b.newPage(); await p.setViewport({ width: 1600, height: 950 });
  await p.goto(url + "&v=" + Date.now(), { waitUntil: "networkidle2", timeout: 180000 });
  await new Promise(r => setTimeout(r, 14000));
  out[nom] = await p.evaluate(() => {
    const t = (e) => (e.textContent || "").replace(/\s+/g, " ").trim();
    const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2; };
    return {
      botones: [...document.querySelectorAll("button,.tp-btnv_b")].filter(vis).map(t).filter(x => x && x.length < 40),
      carpetas: [...document.querySelectorAll(".tp-fldv_t,.tp-rotv_t")].filter(vis).map(t),
      etiquetas: [...document.querySelectorAll(".tp-lblv_l")].filter(vis).map(t),
    };
  });
  await p.screenshot({ path: `cli/shots/ui_${nom}.png` });
  await p.close();
}
const dif = (a, b2) => a.filter(x => !b2.includes(x));
for (const k of ["botones", "carpetas", "etiquetas"]) {
  console.log(`\n== ${k}: local ${out.local[k].length} · publico ${out.publico[k].length}`);
  const sl = dif(out.local[k], out.publico[k]), sp = dif(out.publico[k], out.local[k]);
  if (sl.length) console.log("  SOLO EN LOCAL  :", sl.join(" | ").slice(0, 400));
  if (sp.length) console.log("  SOLO EN PUBLICO:", sp.join(" | ").slice(0, 400));
  if (!sl.length && !sp.length) console.log("  iguales");
}
writeFileSync("cli/shots/ui_comparacion.json", JSON.stringify(out, null, 1));
await b.close();
