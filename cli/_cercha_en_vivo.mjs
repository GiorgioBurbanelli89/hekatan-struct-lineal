// PRUEBA EN VIVO (ventana VISIBLE): puppeteer mueve un cursor en el DOM y dibuja una cercha Warren
// en la app publicada, desde la cinta: Frente → Polilínea (cordones) → Línea (montantes y diagonales)
// → Apoyo → Carga. Un fotograma PNG por paso, comprobaciones en el DOM y GIF al final.
// Sin setViewport (con emulación la ventana visible no pinta).
// Uso: node cli/_cercha_en_vivo.mjs [url]  → cli/shots/cercha_vivo/NNN_*.png + cercha_vivo.gif
import puppeteer from "puppeteer";
import fs from "node:fs";
import { execFileSync } from "node:child_process";
const url = process.argv[2] || "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=new-blank";
const out = "cli/shots/cercha_vivo"; fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
const nav = await puppeteer.launch({
  headless: false, defaultViewport: null,
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  args: ["--window-size=1400,900", "--window-position=60,40", "--no-first-run",
         "--disable-backgrounding-occluded-windows", "--disable-renderer-backgrounding", "--disable-background-timer-throttling"],
});
const [pag] = await nav.pages();
const esp = (ms) => new Promise((r) => setTimeout(r, ms));
const errores = []; pag.on("pageerror", (e) => errores.push(String(e).slice(0, 200)));
pag.on("dialog", (d) => d.accept().catch(() => {}));
await pag.goto(url, { waitUntil: "networkidle2", timeout: 180000 });
await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 }); await esp(4000);
await pag.evaluate(() => { try { window.__hekatanRibbon?.guia?.(false); } catch (e) {} });
await pag.keyboard.press("Escape"); await esp(400);

// ── cursor en el DOM (blanco; rojo con aro al hacer clic) ──
await pag.evaluate(() => {
  const c = document.createElement("div"); c.id = "vivo-cursor";
  c.innerHTML = '<svg width="26" height="34" viewBox="0 0 26 34"><path id="vivo-flecha" d="M1 1 L1 27 L8 20 L13 32 L18 30 L13 18 L23 18 Z" fill="#fff" stroke="#000" stroke-width="1.6"/></svg>';
  c.style.cssText = "position:fixed;left:0;top:0;z-index:2147483647;pointer-events:none;";
  const aro = document.createElement("div"); aro.id = "vivo-aro";
  aro.style.cssText = "position:fixed;width:34px;height:34px;margin:-17px 0 0 -17px;border:3px solid #ff2d55;border-radius:50%;z-index:2147483646;pointer-events:none;display:none;";
  const nota = document.createElement("div"); nota.id = "vivo-nota";
  nota.style.cssText = "position:fixed;left:50%;bottom:120px;transform:translateX(-50%);z-index:2147483647;pointer-events:none;background:rgba(15,23,42,.95);color:#facc15;border:2px solid #facc15;border-radius:8px;padding:8px 16px;font:600 18px system-ui;";
  document.body.append(c, aro, nota);
  window.__vivo = (x, y, rojo) => { c.style.left = x + "px"; c.style.top = y + "px"; document.getElementById("vivo-flecha").setAttribute("fill", rojo ? "#ff2d55" : "#fff"); aro.style.display = rojo ? "block" : "none"; aro.style.left = x + "px"; aro.style.top = y + "px"; };
  window.__vivoNota = (t) => { nota.textContent = t; nota.style.display = t ? "block" : "none"; };
});
let cur = { x: 700, y: 450 }, n = 0;
const foto = async (nombre) => { await esp(250); await pag.screenshot({ path: `${out}/${String(n++).padStart(3, "0")}_${nombre}.png` }); };
const nota = (t) => pag.evaluate((t) => window.__vivoNota(t), t);
const mover = async (x, y, pasos = 12) => {
  for (let i = 1; i <= pasos; i++) {
    const px = cur.x + (x - cur.x) * i / pasos, py = cur.y + (y - cur.y) * i / pasos;
    await pag.mouse.move(px, py); await pag.evaluate((q) => window.__vivo(q.x, q.y, false), { x: px, y: py }); await esp(22);
  }
  cur = { x, y };
};
const clic = async (x, y, nombre) => {
  await mover(x, y); await pag.evaluate((q) => window.__vivo(q.x, q.y, true), { x, y });
  await pag.mouse.click(x, y); await esp(250); if (nombre) await foto(nombre);
  await pag.evaluate((q) => window.__vivo(q.x, q.y, false), { x, y });
};
const boton = async (re) => pag.evaluate((re) => { const b = [...document.querySelectorAll("#hk-ribbon button, button")].find((b) => new RegExp(re).test((b.textContent || "").trim())); if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, re);
const cinta = async (re, texto) => { const b = await boton(re); if (!b) throw new Error("no está el botón " + re); await nota(texto); await clic(b.x, b.y, re.replace(/[^A-Za-zÁ-ú]/g, "")); };
const proj = (P) => pag.evaluate((P) => { const h = document.querySelector("#viewer"); const c = h.__ctx; const r = h.querySelector("canvas").getBoundingClientRect(); const V = Object.getPrototypeOf(c.camera.position).constructor; return P.map(([x, y, z]) => { const v = new V(x, y, z).project(c.camera); return { x: (v.x * 0.5 + 0.5) * r.width + r.left, y: (-v.y * 0.5 + 0.5) * r.height + r.top }; }); }, P);
const clicMundo = async (p, nombre) => { const [q] = await proj([p]); await clic(q.x, q.y, nombre); };
const dom = () => pag.evaluate(() => ({
  tramos: (window.__hekatanDrawingPolylines?.rawVal ?? []).reduce((s, p) => s + Math.max(0, p.length - 1), 0),
  nudos: (window.__hekatanDrawingPoints?.rawVal ?? []).length,
  tool: window.__hekatanCadState?.get?.()?.tool,
}));

await nota("Prueba en vivo: cercha Warren desde la cinta"); await mover(700, 450); await foto("inicio");
await cinta("^\\S*\\s*Frente", "Vista Frente (plano XZ)"); await esp(1500); await foto("frente");
// geometría: 6 paneles de 2 m, altura 2 m
const L = 12, pano = 2, H = 2;
const inf = [], sup = [];
for (let x = 0; x <= L; x += pano) { inf.push([x, 0, 0]); sup.push([x, 0, H]); }
await cinta("^\\S*\\s*Polil", "Polilínea: cordón inferior");
for (const p of inf) await clicMundo(p, "cordon_inf");
await pag.keyboard.press("Enter"); await esp(400); await foto("cordon_inf_ok");
await cinta("^\\S*\\s*Polil", "Polilínea: cordón superior");
for (const p of sup) await clicMundo(p, "cordon_sup");
await pag.keyboard.press("Enter"); await esp(400); await foto("cordon_sup_ok");
for (let i = 0; i < inf.length; i++) {
  await cinta("^\\S*\\s*Línea", `Línea: montante ${i + 1}`);
  await clicMundo(inf[i]); await clicMundo(sup[i], `montante_${i + 1}`); await pag.keyboard.press("Escape"); await esp(250);
}
for (let i = 0; i < inf.length - 1; i++) {
  const [a, b] = i % 2 === 0 ? [inf[i], sup[i + 1]] : [sup[i], inf[i + 1]];
  await cinta("^\\S*\\s*Línea", `Línea: diagonal ${i + 1}`);
  await clicMundo(a); await clicMundo(b, `diagonal_${i + 1}`); await pag.keyboard.press("Escape"); await esp(250);
}
const d1 = await dom(); console.log("DOM tras dibujar:", JSON.stringify(d1));
await cinta("^\\S*\\s*Apoyo", "Apoyo: extremos del cordón inferior");
await clicMundo(inf[0], "apoyo_izq"); await clicMundo(inf[inf.length - 1], "apoyo_der");
await cinta("^\\S*\\s*Carga$|^\\S*\\s*Carga\\s*CG", "Carga: nudos del cordón superior");
for (let i = 1; i < sup.length - 1; i++) await clicMundo(sup[i], `carga_${i}`);
await cinta("^\\S*\\s*Selec", "Selec.: fin"); await pag.keyboard.press("Escape"); await esp(2500);
await nota("Cercha Warren dibujada, apoyada y cargada"); await foto("final");
const d2 = await dom();
const esperado = { tramos: 12 + 7 + 6 };
console.log("DOM final:", JSON.stringify(d2), "· tramos esperados", esperado.tramos, d2.tramos === esperado.tramos ? "OK" : "REVISAR");
console.log("pageerror:", errores.length, errores.slice(0, 3), "· fotogramas:", n);
await nota("");
// GIF (ffmpeg, paleta propia) con todos los fotogramas en orden
const FF = "C:/Users/j-b-j/AppData/Roaming/Python/Python312/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe";
const lista = fs.readdirSync(out).filter((f) => f.endsWith(".png")).sort();
fs.writeFileSync(`${out}/lista.txt`, lista.map((f) => `file '${f}'\nduration 0.55`).join("\n") + `\nfile '${lista[lista.length - 1]}'\n`);
execFileSync(FF, ["-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", `${out}/lista.txt`,
  "-vf", "scale=960:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse=dither=bayer", `${out}/cercha_vivo.gif`]);
console.log("GIF:", `${out}/cercha_vivo.gif`, Math.round(fs.statSync(`${out}/cercha_vivo.gif`).size / 1024), "KB");
await esp(3000);
await nav.close();
