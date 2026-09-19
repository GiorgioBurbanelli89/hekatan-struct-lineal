// Sonda: «⛶ Encuadrar» lleva la Warren al hueco libre (debajo de la cinta), en Frente y en 3D.
import puppeteer from "puppeteer";
const PUERTO = process.argv[2] || "4610";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const pag = await nav.newPage(); const err = []; pag.on("pageerror", (e) => err.push(e.message.slice(0, 160)));
await pag.setViewport({ width: 1280, height: 720 });
const heks = `http://localhost:${PUERTO}/tutoriales/warren.heks`;
await pag.goto(`http://localhost:${PUERTO}/workspace/?heks=${encodeURIComponent(heks)}`, { waitUntil: "networkidle2", timeout: 120000 });
await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 });
await new Promise((r) => setTimeout(r, 4000));
await pag.evaluate(() => { window.__hekatanRibbonPlegar?.(false); });
for (const id of ["hk-settings-toggle", "hk-pane-toggle"]) { await pag.click("#" + id).catch(() => {}); await new Promise((r) => setTimeout(r, 900)); }
const btn = async (re) => { const r = await pag.evaluate((re) => { const e = [...document.querySelectorAll("#hk-ribbon button")].find((b) => b.offsetParent && new RegExp(re).test(b.textContent || "")); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; }, re); if (r) { await pag.mouse.click(r.x, r.y); await new Promise((q) => setTimeout(q, 900)); } else console.log("x", re); };
const caja = () => pag.evaluate(() => { const v = document.querySelector("#viewer"); const c = v.__ctx; const cr = v.querySelector("canvas").getBoundingClientRect(); const V = c.camera.position.constructor; const P = window.__hekatanStates.nodes.rawVal.map((p) => { const q = new V(...p).project(c.camera); return [(q.x * .5 + .5) * cr.width + cr.left, (-q.y * .5 + .5) * cr.height + cr.top]; }); const xs = P.map((p) => p[0]), ys = P.map((p) => p[1]); return [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)].map(Math.round); });
await btn("Frente"); console.log("Frente antes", await caja());
await btn("Encuadrar"); console.log("Frente encuadrado", await caja(), await pag.evaluate(() => document.getElementById("hk-ribbon-estado")?.textContent?.slice(-70)));
await pag.screenshot({ path: "cli/shots/cinta/encuadrar_frente.png" });
await btn("^🧊"); await btn("Encuadrar"); console.log("3D encuadrado", await caja());
await pag.screenshot({ path: "cli/shots/cinta/encuadrar_3d.png" });
console.log("pageerror:", err.length ? err : 0);
await nav.close();
