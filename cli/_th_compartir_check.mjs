// Ciclo de COMPARTIR con un registro SUBIDO: carga el archivo, corre, pide el enlace (sube el registro al servicio de
// enlaces cortos) y abre ESE enlace en otra pestaña limpia: tiene que dar el mismo resultado sin el archivo.
//   node cli/_th_compartir_check.mjs <base> <registro.txt>
import puppeteer from "puppeteer";
import { readFileSync } from "node:fs";
const [BASE, REG] = process.argv.slice(2);
const P = Buffer.from(JSON.stringify({ tipo: 0, nx: 3, pisos: 3, sx: 5, offsets: 0 })).toString("base64");
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-webgl"] });
const err = [];
const a = await nav.newPage(); a.on("pageerror", (e) => err.push(String(e)));
await a.goto(`${BASE}/workspace/?t=plantillas&p=${P}`, { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 6000));
const info1 = await a.evaluate((txt) => { const th = window.__hekatanTiempoHistoria;
  Object.assign(th.params, { metodo: 0, dir: 0, registro: 1 }); th.cargarTexto(txt, "mi_registro_portoviejo.txt");
  Object.assign(th.params, { escala: 2.6524, xi: 5, nModos: 12, dt: 0.02 }); th.refrescar(); th.correr(); return th.params.info; }, readFileSync(REG, "utf-8"));
const url = (await a.evaluate(() => window.__hekatanEnlaceEjemplo())).url;
console.log("ENLACE:", url);
const b = await nav.newPage(); b.on("pageerror", (e) => err.push(String(e)));
await b.goto(url, { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 12000));
const info2 = await b.evaluate(() => window.__hekatanTiempoHistoria.params.info);
console.log("ORIGEN:\n" + info1 + "\nABIERTO DESDE EL ENLACE:\n" + info2); console.log("errores", err.length, err.slice(0, 2));
await nav.close();
