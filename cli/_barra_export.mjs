// El boton Exportar en la barra de titulo: que este, que encaje y que su menu abra.
import puppeteer from "puppeteer";
const [url, png] = process.argv.slice(2);
const b = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
const p = await b.newPage();
await p.setViewport({ width: 1600, height: 950 });
await p.goto(url, { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 16000));
const caja = await p.evaluate(() => {
  const t = document.getElementById("hk-cad-tit");
  const bs = [...(t?.querySelectorAll("button") ?? [])].map((e) => {
    const r = e.getBoundingClientRect();
    return { txt: (e.textContent || "").trim().slice(0, 18), x: Math.round(r.left), w: Math.round(r.width) };
  }).filter((x) => x.w > 0);
  const r = t?.getBoundingClientRect();
  return { botones: bs, barra: r ? [Math.round(r.width), Math.round(r.height)] : null };
});
console.log("barra:", JSON.stringify(caja.barra), "\nbotones:", caja.botones.map((x) => `${x.txt}@${x.x}`).join(" | "));
// abrir el menu Exportar
await p.evaluate(() => document.getElementById("hk-exportar-btn")?.click());
await new Promise((r) => setTimeout(r, 900));
const menu = await p.evaluate(() => {
  const m = document.getElementById("hk-exportar-menu");
  if (!m) return null;
  return { items: [...m.querySelectorAll("[data-id]")].map((d) => d.querySelector("b")?.textContent?.trim()) };
});
console.log("menu:", JSON.stringify(menu));
await p.screenshot({ path: png, clip: { x: 0, y: 0, width: 1600, height: 260 } });
await b.close();
