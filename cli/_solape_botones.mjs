// ¿Algún botón visible se solapa con «📐 Diseño»? Varios anchos de pantalla. PNG de la barra por ancho.
import puppeteer from "puppeteer";
const BASE = process.env.HK_BASE || "http://localhost:4700/hekatan-struct-lineal";
const nav = await puppeteer.launch({ headless: "new", executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--no-sandbox","--use-angle=swiftshader","--enable-unsafe-swiftshader"] });
const dormir = ms => new Promise(r => setTimeout(r, ms));
for (const [w, h] of [[1920, 1080], [1500, 950], [1366, 768], [1280, 720], [1024, 700], [800, 700]]) {
  const p = await nav.newPage(); await p.setViewport({ width: w, height: h });
  await p.goto(BASE + "/workspace/?m=e3qQ74c6C2sEmWPq", { waitUntil: "networkidle2", timeout: 180000 }); await dormir(20000);
  const r = await p.evaluate(() => {
    const vis = e => e.offsetParent && e.getBoundingClientRect().width > 2;
    const barra = [...document.querySelectorAll("#hk-cad-tit button")].filter(vis);
    const todos = [...document.querySelectorAll("button, [role=button]")].filter(vis);
    const choques = [];
    for (const a of barra) { const A = a.getBoundingClientRect();
      for (const e of todos) { if (e === a || a.contains(e) || e.contains(a)) continue; const B = e.getBoundingClientRect();
        if (A.left < B.right - 1 && B.left < A.right - 1 && A.top < B.bottom - 1 && B.top < A.bottom - 1) choques.push(a.textContent.trim().slice(0,14) + " × " + (e.textContent || e.id).trim().slice(0, 20)); } }
    return { barra: barra.map(b => b.textContent.trim().slice(0, 12)), choques };
  });
  console.log(w + "x" + h, JSON.stringify(r));
  await p.screenshot({ path: `cli/shots/solape_${w}.png`, clip: { x: 0, y: 0, width: w, height: 110 } }); await p.close();
}
await nav.close();
