// Panel «Sismo NEC» en el navegador (build servido) sobre el edificio del curso: calcula y captura.
//   node cli/_nec_panel_check.mjs <base> <salida.png>
import puppeteer from "puppeteer";
const [BASE, PNG] = process.argv.slice(2);
const P = Buffer.from(JSON.stringify({ tipo: 2, ejesX: "0,5,11,15", ejesY: "0,4.5,9.5", pisos: 4, h: 3, h1: 3.6, volXp: 1.2, volYm: 1.5, volXm: 0, volYp: 0, formLosa: 51, tlosa: 0.25, offsets: 0 })).toString("base64");
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1600, height: 1000 });
const err = []; pag.on("pageerror", (e) => err.push(String(e)));
pag.on("console", (m) => { if (m.type() === "error" && /NEC/.test(m.text())) err.push(m.text()); });
await pag.goto(`${BASE}/workspace/?t=plantillas&p=${P}`, { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 7000));
const ok = await pag.evaluate(() => !!window.__hekatanNEC);
console.log("panel montado:", ok);
if (ok) {
  const t0 = Date.now();
  await pag.evaluate(() => window.__hekatanNEC.correr());
  console.log("calculo", ((Date.now() - t0) / 1000).toFixed(1), "s");
  console.log(await pag.evaluate(() => window.__hekatanNEC.params.info));
}
console.log("errores", err.length, err.slice(0, 3));
await new Promise((r) => setTimeout(r, 1500));
await pag.screenshot({ path: PNG });
await nav.close();
