import puppeteer from "file:///C:/Users/j-b-j/Documents/Hekatan%20Calc%201.0.0/hekatan-struct/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js";
const OUT = "cli/shots/_tutvid/"; const FPS = 8, DT = 1000 / FPS;
const nav = await puppeteer.launch({ headless: "new", executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--autoplay-policy=no-user-gesture-required"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1280, height: 720 });
// sin HMR: otra sesión edita archivos y Vite recargaba la página a mitad de la toma
await pag.evaluateOnNewDocument(() => { window.WebSocket = class { constructor() {} addEventListener() {} removeEventListener() {} send() {} close() {} }; });
await pag.goto("http://localhost:4600/workspace/?t=new-blank", { waitUntil: "networkidle2", timeout: 120000 });
await pag.waitForSelector("#hk-cad-tutorial", { timeout: 60000 }); await new Promise((r) => setTimeout(r, 3000));
await pag.evaluate(() => {
  try { window.__hekatanRibbon?.guia?.(false); } catch (e) {}
  const m = document.createElement("div"); m.id = "hk-mano"; m.textContent = "👆";
  m.style.cssText = "position:fixed;z-index:2147483647;pointer-events:none;font-size:46px;line-height:1;left:0;top:0;filter:drop-shadow(0 3px 5px #000);transition:transform .12s;transform-origin:30% 0;";
  document.body.appendChild(m);
  const n = document.createElement("div"); n.id = "hk-nota";
  n.style.cssText = "position:fixed;z-index:2147483646;pointer-events:none;background:#D3A53C;color:#111;font:600 15px Segoe UI,system-ui;padding:7px 12px;border-radius:6px;box-shadow:0 4px 14px rgba(0,0,0,.6);display:none;max-width:330px;";
  document.body.appendChild(n);
  window.__mano = (x, y) => { m.style.left = (x - 14) + "px"; m.style.top = (y - 2) + "px"; };   // la punta del índice en (x, y)
  window.__pulso = (on) => { m.style.transform = on ? "scale(.8)" : "scale(1)"; };
  window.__nota = (t, x, y) => { if (!t) { n.style.display = "none"; return; } n.textContent = t; n.style.display = "block"; n.style.left = x + "px"; n.style.top = y + "px"; };
});
let k = 0, pos = { x: 640, y: 420 };
// el clip se reproduce A SU VELOCIDAD en el vídeo: pausado y avanzado 1/FPS por fotograma (la captura es más lenta que el reloj)
const pasoVideo = () => pag.evaluate((dt) => new Promise((ok) => { const v = document.querySelector("#hk-tut video"); if (!v || !v.src || v.readyState < 1) return ok(); v.pause(); const t = Math.min((v.currentTime || 0) + dt, (v.duration || 1e9) - 0.05); if (Math.abs(t - v.currentTime) < 1e-3) return ok(); v.addEventListener("seeked", () => ok(), { once: true }); v.currentTime = t; setTimeout(ok, 400); }), 1 / FPS).catch(() => {});
const foto = async () => { await pasoVideo(); const t0 = Date.now(); await pag.screenshot({ path: OUT + "f" + String(k++).padStart(4, "0") + ".png" }); const d = DT - (Date.now() - t0); if (d > 0) await new Promise((r) => setTimeout(r, d)); };
const quieto = async (seg) => { const n = Math.round(seg * FPS); for (let i = 0; i < n; i++) await foto(); };
const ir = async (x, y, seg = 1.1) => { const n = Math.max(2, Math.round(seg * FPS)); const p0 = { ...pos }; for (let i = 1; i <= n; i++) { const t = i / n, e = t * t * (3 - 2 * t); pos = { x: p0.x + (x - p0.x) * e, y: p0.y + (y - p0.y) * e }; await pag.mouse.move(pos.x, pos.y); await pag.evaluate((p) => window.__mano(p.x, p.y), pos); await foto(); } };
const clic = async () => { await pag.evaluate(() => window.__pulso(true)); await foto(); await pag.mouse.click(pos.x, pos.y); await pag.evaluate(() => window.__pulso(false)); await foto(); };
const centro = (sel, i = 0) => pag.evaluate(({ sel, i }) => { const r = document.querySelectorAll(sel)[i].getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, l: r.left, b: r.bottom, r: r.right, t: r.top }; }, { sel, i });
const nota = (t, x, y) => pag.evaluate(({ t, x, y }) => window.__nota(t, x, y), { t, x, y });

await pag.evaluate((p) => window.__mano(p.x, p.y), pos); await quieto(1);
let c = await centro("#hk-cad-tutorial"); await nota("1 · Arriba a la derecha: «🎬 Tutorial»", c.l - 250, c.b + 60);
await ir(c.x, c.y + 4, 1.4); await quieto(0.8); await clic(); await nota(""); await quieto(1.2);
c = await centro("#hk-tut .it", 4); await nota("2 · Elige un clip de la lista", c.l + 20, c.b + 8);
await ir(c.x + 60, c.y + 6, 1.3); await quieto(0.6); await clic(); await nota(""); await ir(c.r + 140, c.y + 170, 0.8);
await nota("Se reproduce aquí, con voz y subtítulos", 640, 150); await quieto(2); await nota(""); await quieto(4);
c = await centro("#hk-tut-sig"); await nota("3 · «Siguiente ▶» pasa al otro clip (o pasa solo al terminar)", c.l - 330, c.t - 50);
await ir(c.x, c.y + 4, 1.1); await quieto(0.5);
console.log("bajo la mano:", await pag.evaluate((p) => { const e = document.elementFromPoint(p.x, p.y); return e && (e.tagName + "#" + e.id); }, pos), "antes:", await pag.evaluate(() => document.querySelector("#hk-tut video").src.split("/").pop()));
await clic(); console.log("después:", await pag.evaluate(() => document.querySelector("#hk-tut video").src.split("/").pop()));
await nota(""); await quieto(3.5);
c = await centro("#hk-tut .hojas a", 0); await pag.evaluate(() => document.querySelector("#hk-tut .hojas").scrollIntoView({ block: "end" })); await quieto(0.3);
c = await centro("#hk-tut .hojas a", 0); await nota("📐 El porqué: abre la hoja en Hekatan LISP web", c.l + 10, c.t - 46);
await ir(c.x - 40, c.y + 4, 1.2); await quieto(2); await nota("");
c = await centro("#hk-tut-x"); await nota("✕ o Esc para cerrar", c.l - 190, c.b + 50); await ir(c.x, c.y + 4, 1.1); await quieto(0.6); await clic(); await nota(""); await quieto(1.2);
await nav.close(); console.log(k, "fotogramas");
