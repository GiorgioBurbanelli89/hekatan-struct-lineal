// Sonda: la pestaña «IFC y cortes» usa las MISMAS casillas del panel Settings › Cortes X/Y/Z.
import puppeteer from "puppeteer";
const PUERTO = process.argv[2] || "4610";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const pag = await nav.newPage(); const err = []; pag.on("pageerror", (e) => err.push(e.message.slice(0, 160)));
await pag.setViewport({ width: 1280, height: 720 });
await pag.goto(`http://localhost:${PUERTO}/workspace/?t=new-blank`, { waitUntil: "networkidle2", timeout: 120000 });
await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 });
await new Promise((r) => setTimeout(r, 3000));
await pag.evaluate(() => { window.__hekatanRibbon?.guia?.(false); window.__hekatanRibbonPlegar?.(false); });
await pag.click("#hk-ribbon-tab-ifc"); await new Promise((r) => setTimeout(r, 500));
await pag.click('#hk-ribbon input[data-mando="posZ"]', { clickCount: 3 }); await pag.keyboard.type("2.5"); await pag.keyboard.press("Enter");
await new Promise((r) => setTimeout(r, 400));
const b = await pag.evaluate(() => { const e = [...document.querySelectorAll("#hk-ribbon button")].find((x) => x.offsetParent && /Corte Z/.test(x.textContent)); const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
await pag.mouse.click(b.x, b.y); await new Promise((r) => setTimeout(r, 500));
console.log(JSON.stringify(await pag.evaluate(() => ({ clip: window.__hekatanClip, msg: document.getElementById("hk-ribbon-estado")?.textContent?.slice(0, 120) }))));
console.log("pageerror:", err.length ? err : 0);
await nav.close();
