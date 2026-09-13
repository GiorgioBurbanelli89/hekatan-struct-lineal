// Comprueba el paso 10: plegar → «✏ Dibujar» (id) → ▾ → «heks» → marcar «Guardar .heks» → Esc → botón en la cinta → descarga
import puppeteer from "puppeteer";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1280, height: 720 });
const cdp = await pag.createCDPSession(); await cdp.send("Browser.setDownloadBehavior", { behavior: "deny" });
let descarga = null; pag.on("response", () => {}); await pag.evaluateOnNewDocument(() => { const o = URL.createObjectURL; URL.createObjectURL = (b) => { window.__blobs = (window.__blobs || []); window.__blobs.push(b); return o.call(URL, b); }; });
await pag.goto("http://localhost:4600/workspace/?t=new-blank", { waitUntil: "networkidle2", timeout: 120000 }); await new Promise((r) => setTimeout(r, 3000));
await pag.evaluate(() => { try { window.__hekatanRibbon?.guia?.(false); } catch (e) {} });
for (const id of ["hk-settings-toggle", "hk-pane-toggle"]) { try { await pag.click("#" + id); await new Promise((r) => setTimeout(r, 300)); } catch (e) {} }
const w = (ms) => new Promise((r) => setTimeout(r, ms));
const R = (fn) => pag.evaluate((src) => { const el = new Function("return (" + src + ")()")(); if (!el) return null; const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height }; }, fn.toString());
const clic = async (fn, nombre) => { const p = await R(fn); if (!p || !p.w) { console.log("x no se ve:", nombre, JSON.stringify(p)); return false; } await pag.mouse.click(p.x, p.y); await w(400); console.log("✓", nombre, Math.round(p.x), Math.round(p.y)); return true; };
await clic(() => document.getElementById("hk-ribbon-plegar"), "plegar");
console.log("  cinta:", await pag.evaluate(() => [getComputedStyle(document.getElementById("hk-ribbon")).display, document.elementFromPoint(1218, 76)?.id || document.elementFromPoint(1218, 76)?.className]));
await clic(() => document.getElementById("hk-ribbon-abrir"), "abrir (id)");
console.log("  cinta:", await pag.evaluate(() => [getComputedStyle(document.getElementById("hk-ribbon")).display, document.elementFromPoint(1218, 76)?.id || document.elementFromPoint(1218, 76)?.className]));
await clic(() => document.getElementById("hk-ribbon-mas"), "▾");
await clic(() => document.querySelector("#hk-ribbon-extras-lista input[type=text]"), "buscar"); await pag.keyboard.type("heks", { delay: 40 }); await w(400);
await clic(() => [...document.querySelectorAll("#hk-ribbon-extras-lista label")].find((l) => /Guardar \.heks/.test(l.textContent || ""))?.querySelector("input"), "marcar Guardar .heks");
await pag.keyboard.press("Escape"); await w(400);
await clic(() => [...document.querySelectorAll("#hk-ribbon-extras button")].find((b) => /Guardar/.test(b.textContent || "")), "Guardar (cinta)");
await w(1000);
console.log("  blobs creados:", await pag.evaluate(async () => { const b = window.__blobs || []; return b.length ? (await b[b.length - 1].text()).slice(0, 120) : 0; }));
await nav.close();
