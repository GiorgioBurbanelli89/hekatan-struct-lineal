import puppeteer from "puppeteer";
import { readFileSync, existsSync, statSync } from "fs";
import { createServer } from "http";
import { join, extname } from "path";
const BASE = "/hekatan-struct-lineal/";
const raiz = join(process.cwd(), "website", "src", "examples");
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json" };
const srv = createServer((req, res) => {
  let p = decodeURIComponent((req.url || "/").split("?")[0]);
  if (p.startsWith(BASE)) p = p.slice(BASE.length - 1);
  let f = join(raiz, p);
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
  if (!existsSync(f)) { res.writeHead(404); return res.end("404"); }
  res.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" });
  res.end(readFileSync(f));
});
await new Promise((r) => srv.listen(4775, r));
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const p = await nav.newPage();
await p.setViewport({ width: 1280, height: 800 });
await p.goto("http://localhost:4775" + BASE + "workspace/?t=new-blank", { waitUntil: "networkidle2", timeout: 180000 });
await p.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 });
await new Promise((r) => setTimeout(r, 6000));
const info = await p.evaluate(() => {
  const R = (el) => { const r = el?.getBoundingClientRect(); return r ? [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)] : null; };
  const rib = document.getElementById("hk-ribbon");
  const filas = rib ? [...rib.children].map(R) : [];
  return { ribbon: R(rib), canvas: R(document.querySelector("#viewer canvas")),
    viewer: R(document.querySelector("#viewer")), filas,
    nBotones: rib ? rib.querySelectorAll("button").length : -1,
    guia: R(document.getElementById("hk-ribbon-guia")),
    centro640_400: (() => { const el = document.elementFromPoint(640, 400); const c = []; let n = el; while (n && n !== document.body) { c.push(n.tagName + (n.id ? "#" + n.id : "")); n = n.parentElement; } return c.join(" < "); })() };
});
console.log(JSON.stringify(info, null, 1));
await nav.close(); srv.close();
