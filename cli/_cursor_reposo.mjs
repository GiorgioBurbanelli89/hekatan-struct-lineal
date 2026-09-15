// Cursor como AutoCAD: en REPOSO junto a la cruz no debe haber cajas (ni X= Y= Z= ni «Designe objetos»).
// Captura 3 recortes alrededor del cursor: reposo, tecleando «L», y dibujando una línea.
// Uso: node cli/_cursor_reposo.mjs [url]   → cli/shots/cursor/{reposo,tecleando,dibujando}.png
import puppeteer from "puppeteer";
import fs from "node:fs";
const url = process.argv[2] || "http://localhost:4600/workspace/?t=new-blank";
const out = "cli/shots/cursor"; fs.mkdirSync(out, { recursive: true });
// El Chrome de puppeteer (~/.cache/puppeteer) se borró en la limpieza de disco: se usa Edge.
const nav = await puppeteer.launch({ headless: "new", executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1600, height: 900 });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const errores = []; pag.on("pageerror", (e) => errores.push(String(e)));
await pag.goto(url, { waitUntil: "networkidle2", timeout: 180000 }); await espera(4000);
// La guía de bienvenida tapaba justo la zona del cursor (1ª corrida: los 3 recortes eran la guía)
await pag.evaluate(() => { try { window.__hekatanRibbon?.guia?.(false); } catch (e) {} });
for (const id of ["hk-settings-toggle", "hk-pane-toggle"]) { try { await pag.click("#" + id); await espera(300); } catch (e) {} }
await pag.keyboard.press("Escape"); await espera(300);
// punto del lienzo sin nada encima
const { cx, cy } = await pag.evaluate(() => {
  const libre = (x, y) => { const e = document.elementFromPoint(x, y); return e && e.tagName === "CANVAS"; };
  for (let y = 700; y > 250; y -= 25) for (let x = 1100; x > 400; x -= 25) if (libre(x, y) && libre(x - 200, y - 120) && libre(x + 280, y + 150)) return { cx: x, cy: y };
  return { cx: 900, cy: 500 };
});
console.log("cursor en", cx, cy);
const visibles = () => pag.evaluate(() => {
  const v = (id) => { const e = document.getElementById(id); if (!e) return "no existe"; const s = getComputedStyle(e); return s.display !== "none" && s.visibility !== "hidden" ? "VISIBLE" : "oculto"; };
  return { "hk-coord-readout": v("hk-coord-readout"), "hk-dyn": v("hk-dyn"), "hk-rubber-angle": v("hk-rubber-angle"),
    angulo: document.getElementById("hk-rubber-angle")?.textContent || "", longitud: document.getElementById("hk-rubber-label")?.value || "",
    prompt: document.getElementById("hk-dyn-prompt")?.textContent || "",
    foco: (document.activeElement?.id || document.activeElement?.tagName || ""),
    dynTexto: document.getElementById("hk-dyn-input")?.value || "",
    rubberDisplay: document.getElementById("hk-rubber-label")?.style.display || "",
    dynInline: document.getElementById("hk-dyn")?.style.display || "" };
});
const recorte = async (nombre) => {
  await pag.screenshot({ path: `${out}/${nombre}.png`, clip: { x: cx - 220, y: cy - 140, width: 520, height: 300 } });
  console.log(nombre, JSON.stringify(await visibles()));
};
for (let i = 0; i < 6; i++) { await pag.mouse.move(cx - 60 + i * 12, cy - 30 + i * 6); await espera(80); }
await espera(600); await recorte("reposo");
await pag.keyboard.type("L"); await espera(400);
await pag.mouse.move(cx + 2, cy + 1); await espera(400); await recorte("tecleando");
await pag.keyboard.press("Enter"); await espera(500);
await pag.mouse.click(cx - 150, cy + 40); await espera(300);
for (let i = 0; i < 8; i++) { await pag.mouse.move(cx - 150 + i * 20, cy + 40 - i * 5); await espera(60); }
await espera(500); await recorte("dibujando");
// línea horizontal: en AutoCAD se ve un solo vector punteado y la caja «0°»
await pag.mouse.move(cx + 120, cy + 40); await espera(150);
await pag.mouse.move(cx + 150, cy + 40); await espera(600); await recorte("horizontal");
console.log("pageerror:", errores.length, errores.slice(0, 3));
await nav.close();
