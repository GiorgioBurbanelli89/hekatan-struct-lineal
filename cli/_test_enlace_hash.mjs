// Prueba del enlace «modelo dentro» (#h=) en el deploy (o la base que se pase).
// 1) arma el enlace en Node (zlib deflateRaw + base64url, el MISMO formato que CompressionStream)
// 2) lo abre: ¿cargó el modelo? ¿salió la tabla modal?
// 3) desde la página, __hekatanEnlaceModelo() → el hash debe descomprimir al MISMO .heks
// Uso: node cli/_test_enlace_hash.mjs <modelo.heks> <base workspace url> <salida.png> [movil]
import fs from "node:fs";
import zlib from "node:zlib";
import puppeteer from "puppeteer";

const [heksPath, base, png, modo = ""] = process.argv.slice(2);
const texto = fs.readFileSync(heksPath, "utf8");
const b64 = zlib.deflateRawSync(Buffer.from(texto, "utf8")).toString("base64")
  .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const url = `${base}?modal=12#h=${b64}`;
console.log("heks", texto.length, "bytes → enlace", url.length, "caracteres");

const movil = modo === "movil";
const browser = await puppeteer.launch({ headless: "new", args: ["--use-gl=angle", "--enable-webgl"] });
const page = await browser.newPage();
const errores = [];
page.on("pageerror", (e) => errores.push(String(e)));
page.on("dialog", (d) => d.dismiss());
await page.setViewport(movil ? { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 3 }
                             : { width: 1366, height: 768 });
await page.goto(url, { waitUntil: "networkidle2", timeout: 180000 });
let tabla = false;
try {
  await page.waitForFunction(() => document.querySelector("#modal-results table"), { timeout: 240000 });
  tabla = true;
} catch { /* se informa abajo */ }
await new Promise((r) => setTimeout(r, 1500));
const r = await page.evaluate(async () => {
  const w = window;
  const enlace = w.__hekatanEnlaceModelo ? await w.__hekatanEnlaceModelo() : null;
  let vuelta = null;
  if (enlace) {
    const h = new URL(enlace).hash.slice(3);
    const std = h.replace(/-/g, "+").replace(/_/g, "/");
    const bin = atob(std + "===".slice((std.length + 3) % 4));
    const buf = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    vuelta = await new Response(new Blob([buf]).stream().pipeThrough(new DecompressionStream("deflate-raw"))).text();
  }
  return {
    enlaceLargo: enlace?.length ?? 0,
    modal: new URL(enlace ?? location.href).searchParams.get("modal"),
    vuelta,
    modos: document.querySelectorAll("#modal-results table tr").length - 1,
    enlaceClase: document.documentElement.classList.contains("hk-enlace"),
    velo: [...document.querySelectorAll("div")].some((d) => d.textContent === "Cargando modelo…"),
  };
});
console.log(JSON.stringify({
  tablaModal: tabla, modos: r.modos, claseEnlace: r.enlaceClase, veloPegado: r.velo,
  enlaceDesdePagina: r.enlaceLargo, modalEnEnlace: r.modal,
  vueltaIgual: r.vuelta === texto,
  pageerrors: errores.length, primerError: errores[0] ?? null,
}));
await page.screenshot({ path: png });
await browser.close();
