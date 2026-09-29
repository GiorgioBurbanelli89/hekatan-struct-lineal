import puppeteer from "puppeteer";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const p = await nav.newPage(); await p.setViewport({ width: 800, height: 700 });
await p.goto("http://localhost:4600/workspace/index.html?t=plantillas", { waitUntil: "networkidle2", timeout: 180000 });
await p.waitForFunction(() => !!document.getElementById("hk-compartir-btn"), { timeout: 120000 }); await new Promise((r) => setTimeout(r, 3000));
console.log(await p.evaluate(() => [...document.querySelectorAll("#hk-cad-tit .der *")].filter((e) => e.getBoundingClientRect().width > 20 && e.children.length < 3).map((e) => {
  const r = e.getBoundingClientRect(); return `${e.tagName}#${e.id}.${String(e.className).slice(0, 20)} x=${Math.round(r.x)} w=${Math.round(r.width)} «${(e.textContent || "").trim().slice(0, 30)}»`; }).join("\n")));
const sinBoton = await p.evaluate(() => { document.getElementById("hk-compartir-btn").style.display = "none"; return document.getElementById("hk-cad-tit").scrollWidth; });
console.log("ancho de la barra SIN el botón nuevo:", sinBoton);
await nav.close();
