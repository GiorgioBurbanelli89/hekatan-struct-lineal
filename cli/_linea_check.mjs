// Rastrea quién BORRA la polilínea de 1 punto al hacer el segundo clic de una diagonal (Howe).
import puppeteer from "puppeteer";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1280, height: 720 });
pag.on("console", (m) => { const t = m.text(); if (t.startsWith("SET")) console.log("   ", t.slice(0, 600)); });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const ev = (f, a) => pag.evaluate(f, a);
await pag.goto("http://localhost:4600/workspace/?t=new-blank", { waitUntil: "networkidle2", timeout: 120000 }); await espera(3000);
await ev(() => { try { window.__hekatanRibbon?.guia?.(false); window.__hekatanDrawingPoints.val = []; window.__hekatanDrawingPolylines.val = [[]]; } catch (e) {} });
for (const id of ["hk-settings-toggle", "hk-pane-toggle"]) { try { await pag.click("#" + id); await espera(300); } catch (e) {} }
const cinta = async (re) => { const b = await ev((re) => { const b = [...document.querySelectorAll("#hk-ribbon button")].find((b) => new RegExp(re).test(b.textContent)); const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, re); await pag.mouse.click(b.x, b.y); await espera(300); };
const barra = async (re) => { const b = await ev((re) => { const b = [...document.querySelectorAll("button")].find((b) => new RegExp(re).test(b.textContent.trim())); const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, re); await pag.mouse.click(b.x, b.y); await espera(300); };
const proj = (P) => ev((P) => { const h = [...document.querySelectorAll("div")].find((d) => d.__ctx && d.__ctx.camera); const c = h.__ctx; const r = h.querySelector("canvas").getBoundingClientRect(); const V = Object.getPrototypeOf(c.camera.position).constructor; return P.map(([x, y, z]) => { const v = new V(x, y, z).project(c.camera); return { x: (v.x * 0.5 + 0.5) * r.width + r.left, y: (-v.y * 0.5 + 0.5) * r.height + r.top }; }); }, P);
const clicM = async (p) => { const [q] = await proj([p]); await pag.mouse.move(q.x, q.y); await espera(150); await pag.mouse.click(q.x, q.y); await espera(250); };
await cinta("Frente"); await barra("^SNAP");
const pl = () => ev(() => window.__hekatanDrawingPolylines.rawVal.map((p) => p.length));
const poli = async (pts) => { await cinta("Polilínea"); for (const p of pts) await clicM(p); await pag.keyboard.press("Enter"); await espera(250); };
const inf = [0, 2, 4, 6, 8, 10, 12].map((x) => [x, 0, 0]), sup = [0, 2, 4, 6, 8, 10, 12].map((x) => [x, 0, 2]);
await poli(inf); await poli(sup);
for (let i = 1; i < 6; i++) { await cinta("Línea"); await clicM(inf[i]); await clicM(sup[i]); await pag.keyboard.press("Escape"); await espera(150); }
await cinta("Línea"); await clicM(inf[2]); await clicM(sup[3]); await pag.keyboard.press("Escape"); await espera(150);
console.log("antes de la diagonal problemática:", JSON.stringify(await pl()));
// vigilar el setter del State de polilíneas
await ev(() => { const st = window.__hekatanDrawingPolylines; const proto = Object.getPrototypeOf(st); const d = Object.getOwnPropertyDescriptor(proto, "val"); Object.defineProperty(st, "val", { configurable: true, set(v) { console.log("SET " + JSON.stringify(v.map((p) => p.length)) + " :: " + new Error().stack.split("\n").slice(2, 7).map((l) => l.trim().replace(/^at /, "").replace(/https?:\/\/[^ ]*\//g, "")).join(" | ")); d.set.call(this, v); }, get() { return d.get.call(this); } }); });
await cinta("Línea"); await clicM(sup[3]); console.log("tras A:", JSON.stringify(await pl())); await clicM(inf[4]); console.log("tras B:", JSON.stringify(await pl()));
await nav.close();
