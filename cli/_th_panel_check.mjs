// El panel de tiempo-historia en el navegador (build servido) con El Centro × 2.6524: carga el archivo, corre y lee p.info.
//   node cli/_th_panel_check.mjs <base> <registro.txt> <salida.png>
import puppeteer from "puppeteer";
const [BASE, REG, PNG] = process.argv.slice(2);
const P = Buffer.from(JSON.stringify({ tipo: 0, nx: 3, pisos: 3, sx: 5, offsets: 0 })).toString("base64");
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1600, height: 1100 });
const err = []; pag.on("pageerror", (e) => err.push(String(e)));
await pag.goto(`${BASE}/workspace/?t=plantillas&p=${P}`, { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 6000));
const txt = (await import("node:fs")).readFileSync(REG, "utf-8");
await pag.evaluate((txt) => {
  const th = window.__hekatanTiempoHistoria;
  Object.assign(th.params, { metodo: 0, dir: 0, registro: 1 });
  th.cargarTexto(txt, "elcentro1940_NS_ms2.txt");
  Object.assign(th.params, { escala: 2.6524, xi: 5, nModos: 12, dt: 0.02 }); th.refrescar();
  th.correr();
}, txt);
await new Promise((r) => setTimeout(r, 3000));
const info = await pag.evaluate(() => window.__hekatanTiempoHistoria.params.info);
console.log(info); console.log("errores", err.length, err.slice(0, 2));
await pag.screenshot({ path: PNG });
await nav.close();
