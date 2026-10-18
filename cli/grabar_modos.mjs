/**
 * GIF: dónde se cambia el N° de MODOS de vibración (18-oct-2026), con el ratón real y cursor visible:
 * pestaña «⟩» → Settings › ⚡ Modal + Animación › 🔢 N° de modos → escribir 30 → ▶ Correr modal → tabla.
 *   node cli/grabar_modos.mjs <carpeta> [--base URL] [--t ejemplo] [--n 30]
 */
import puppeteer from "puppeteer";
import fs from "node:fs";
import path from "node:path";
const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args.splice(i, 2)[1] : d; };
const BASE = opt("--base", "http://localhost:4600"), EJ = opt("--t", "edificio-aporticado"), N = +opt("--n", "30");
const OUT = path.join(args[0], "modos"); fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1280, height: 720 });
await pag.goto(`${BASE}/workspace/?t=${EJ}`, { waitUntil: "networkidle2", timeout: 180000 }); await espera(5000);
const ev = (f, a) => pag.evaluate(f, a);
const cdp = await pag.target().createCDPSession();
const fotos = []; let k = 0, texto = "";
const foto = async (n = 1) => { for (let i = 0; i < n; i++) { const { data } = await cdp.send("Page.captureScreenshot", { format: "png" }); fs.writeFileSync(path.join(OUT, `f${String(k).padStart(4, "0")}.png`), Buffer.from(data, "base64")); fotos.push({ f: k++, texto }); } };
await ev(() => {
  const c = document.createElement("div"); c.id = "hk-gif-cursor";
  c.innerHTML = '<svg width="22" height="30" viewBox="0 0 26 34"><path d="M2 2 L2 27 L8.5 21 L13 32 L17.5 30 L13 19.5 L22 19.5 Z" fill="#fff" stroke="#000" stroke-width="2"/></svg>';
  c.style.cssText = "position:fixed;left:640px;top:360px;z-index:2147483647;pointer-events:none;transform:translate(-2px,-2px)"; document.body.appendChild(c);
  document.addEventListener("pointermove", (e) => { c.style.left = e.clientX + "px"; c.style.top = e.clientY + "px"; }, true);
  window.__aro = (x, y) => { const a = document.createElement("div"); a.style.cssText = `position:fixed;left:${x - 16}px;top:${y - 16}px;width:32px;height:32px;border-radius:50%;border:3px solid #fbbf24;z-index:2147483646;pointer-events:none;transition:all .45s ease-out`; document.body.appendChild(a); requestAnimationFrame(() => { a.style.transform = "scale(1.8)"; a.style.opacity = "0"; }); setTimeout(() => a.remove(), 550); };
  window.__marco = (e) => { document.getElementById("hk-gif-marco")?.remove(); if (!e) return; const r = e.getBoundingClientRect(); const m = document.createElement("div"); m.id = "hk-gif-marco"; m.style.cssText = `position:fixed;left:${r.left - 4}px;top:${r.top - 4}px;width:${r.width + 8}px;height:${r.height + 8}px;border:3px solid #ff3b30;border-radius:6px;z-index:2147483645;pointer-events:none`; document.body.appendChild(m); };
  window.__fold = (re) => [...document.querySelectorAll(".tp-fldv_t")].find((e) => new RegExp(re).test(e.textContent))?.closest(".tp-fldv") ?? null;
  window.__centro = (e) => { if (!e) return null; const r = e.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
});
let cur = [640, 360];
const mover = async (x, y, n = 12) => { const [x0, y0] = cur; for (let i = 1; i <= n; i++) { const t = i / n, s = t * t * (3 - 2 * t); await pag.mouse.move(x0 + (x - x0) * s, y0 + (y - y0) * s); await foto(); } cur = [x, y]; };
const clic = async (c, n = 3) => { if (!c) throw new Error("no está en pantalla: " + texto); await mover(c[0], c[1]); await ev(([a, b]) => window.__aro(a, b), c); await pag.mouse.click(c[0], c[1]); await espera(300); await foto(n); };

texto = `Ejemplo «${EJ}»: ¿dónde se cambia el número de modos de vibración?`; await foto(10);
texto = "1 · Pestaña «⟩» del borde IZQUIERDO: abre el panel Settings";
await ev(() => window.__marco(document.getElementById("hk-settings-toggle")));
await clic(await ev(() => window.__centro(document.getElementById("hk-settings-toggle"))), 6); await ev(() => window.__marco(null));
await espera(700); await foto(4);
texto = "2 · Dentro de Settings: la carpeta «⚡ Modal + Animación»";
await ev(() => { const f = window.__fold("Modal \\+ Animaci"); f?.scrollIntoView({ block: "start" }); window.__marco(f); }); await espera(300);
const tm = await ev(() => window.__centro(window.__fold("Modal \\+ Animaci")?.querySelector(".tp-fldv_t")));
await mover(tm[0], tm[1]); await foto(12);
texto = `3 · «🔢 N° de modos»: escribir ${N} y Enter  (0 = el que trae el ejemplo)`;
await ev(() => window.__marco(window.__fold("N° de modos")));
const cm = await ev(() => window.__centro(window.__fold("N° de modos")?.querySelector("input")));
await mover(cm[0], cm[1]); await ev(([a, b]) => window.__aro(a, b), cm); await pag.mouse.click(cm[0], cm[1], { clickCount: 3 }); await foto(3);
for (const ch of String(N)) { await pag.keyboard.type(ch); await espera(80); await foto(2); }
await pag.keyboard.press("Enter"); await espera(400); await foto(6); await ev(() => window.__marco(null));
texto = "4 · «▶ Correr modal + animar»: calcula esos modos y anima el primero";
const bm = await ev(() => { const b = [...document.querySelectorAll(".tp-btnv_b")].find((b) => /Correr modal/.test(b.textContent)); b?.scrollIntoView({ block: "nearest" }); window.__marco(b); return window.__centro(b); });
await clic(bm, 2); await ev(() => window.__marco(null));
await espera(4000); await foto(14);
texto = `5 · «📋 Tabla de modos»: la lista con periodo, frecuencia y masa participativa`;
const tb = await ev(() => { const l = [...document.querySelectorAll(".tp-lblv_l")].find((e) => /Tabla de modos/.test(e.textContent)); const i = l?.closest(".tp-lblv")?.querySelector("input"); i?.scrollIntoView({ block: "nearest" }); return window.__centro(i); });
if (tb) { await clic(tb, 4); await espera(900); }
const filas = await ev(() => { let mx = 0; document.querySelectorAll("table").forEach((t) => { if (/Modo|Mode|Period/i.test(t.innerText) && t.getBoundingClientRect().width > 0) mx = Math.max(mx, t.querySelectorAll("tbody tr").length || t.querySelectorAll("tr").length - 1); }); return mx; });
texto = `5 · Tabla de modos: ${filas} modos calculados`; await foto(18);
fs.writeFileSync(path.join(OUT, "meta.json"), JSON.stringify({ id: "Modos de vibración", fotos, filas, N }, null, 1));
console.log(k, "fotogramas · filas en la tabla:", filas); await nav.close();
