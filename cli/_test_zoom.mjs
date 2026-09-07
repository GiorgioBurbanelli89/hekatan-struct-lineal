// TEST 2: ¿se LEE el pane? Captura al doble de densidad y recorta la zona que
// se explica, a 1280x720 exactos. Un tutorial que no deja leer el boton que
// hay que tocar no es un tutorial.
import puppeteer from "puppeteer";
import { mkdirSync, readFileSync, existsSync, statSync } from "fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "frames_tutorial"); mkdirSync(OUT, { recursive: true });
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
const MIME = { ".html":"text/html", ".js":"text/javascript", ".css":"text/css", ".wasm":"application/wasm",
               ".json":"application/json", ".svg":"image/svg+xml", ".png":"image/png", ".ico":"image/x-icon" };
const srv = createServer((req,res)=>{ let p=decodeURIComponent((req.url||"/").split("?")[0]);
  if(p.startsWith(BASE)) p=p.slice(BASE.length-1); let f=join(raiz,p);
  if(existsSync(f)&&statSync(f).isDirectory()) f=join(f,"index.html");
  if(!existsSync(f)){res.writeHead(404);return res.end("404");}
  res.writeHead(200,{"content-type":MIME[extname(f)]||"application/octet-stream"}); res.end(readFileSync(f)); });
await new Promise(r=>srv.listen(4697,r));
const espera=(ms)=>new Promise(r=>setTimeout(r,ms));
const nav = await puppeteer.launch({ headless:"new", args:["--no-sandbox","--enable-unsafe-swiftshader",
  "--use-angle=swiftshader","--enable-webgl","--ignore-gpu-blocklist"] });
const pag = await nav.newPage();
// deviceScaleFactor 2 = cada pixel CSS son 2 de imagen: el texto sale nitido al recortar
await pag.setViewport({ width:1280, height:720, deviceScaleFactor:2 });
await pag.goto(`http://localhost:4697${BASE}workspace/?t=test-m-dual`, { waitUntil:"networkidle2", timeout:120000 });
await espera(8000);
// A) la app entera, al doble -> 2560x1440, se baja a 1280x720 sin perder nada
await pag.screenshot({ path: join(OUT, "z_app.png") });
// B) SOLO el panel derecho (donde se elige el ejemplo y estan las carpetas)
const r = await pag.evaluate(() => {
  const p = document.querySelector("#parameters") || document.querySelector(".tp-dfwv");
  if (!p) return null; const b = p.getBoundingClientRect();
  return { x: Math.max(0,b.x-8), y: Math.max(0,b.y-8), width: Math.min(640,b.width+16), height: Math.min(360,b.height+16) };
});
console.log("panel:", JSON.stringify(r));
if (r) await pag.screenshot({ path: join(OUT,"z_panel.png"), clip: r });
await nav.close(); srv.close();
