/**
 * Tutorial del MODO REVIT (17-oct-2026): graba los fotogramas (f000.png… + pasos.json) que monta
 * hekatan-school/montar_tutorial.py con la voz. TODO con el cursor (Jorge: «sino no sirve»): cada acción
 * es un clic, un doble clic o una tecla de verdad; nada se inyecta por código.
 * 1080p: lienzo 1280×620 a ×1.5 (1920×930) + franja negra de 150 px para el subtítulo.
 *   node cli/tutorial_modo_revit.mjs <carpeta_salida> [--base URL]
 */
import puppeteer from "puppeteer";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const OUT = args[0] ?? "tutorial_modo_revit";
const ib = args.indexOf("--base");
const BASE = ib >= 0 ? args[ib + 1] : "http://localhost:4600";
fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1280, height: 620, deviceScaleFactor: 1.5 });
const errs = []; pag.on("pageerror", (e) => errs.push(e.message)); pag.on("dialog", (d) => d.accept());
await pag.goto(`${BASE}/workspace/?t=new-blank`, { waitUntil: "networkidle2", timeout: 120000 }); await espera(3500);
const ev = (f, a) => pag.evaluate(f, a);

// cursor y aro de clic dibujados en la página (puppeteer no pinta el del sistema)
await ev(() => {
  const c = document.createElement("div"); c.id = "hk-tut-cursor";
  c.innerHTML = '<svg width="24" height="32" viewBox="0 0 26 34"><path d="M2 2 L2 27 L8.5 21 L13 32 L17.5 30 L13 19.5 L22 19.5 Z" fill="#fff" stroke="#000" stroke-width="2" stroke-linejoin="round"/></svg>';
  c.style.cssText = "position:fixed;left:640px;top:330px;z-index:2147483647;pointer-events:none;transform:translate(-2px,-2px)";
  document.body.appendChild(c);
  window.__aro = (x, y) => { const a = document.createElement("div");
    a.style.cssText = `position:fixed;left:${x - 18}px;top:${y - 18}px;width:36px;height:36px;border-radius:50%;border:3px solid #fbbf24;z-index:2147483646;pointer-events:none;transition:all .45s ease-out;opacity:1`;
    document.body.appendChild(a); requestAnimationFrame(() => { a.style.transform = "scale(1.8)"; a.style.opacity = "0"; }); setTimeout(() => a.remove(), 600); };
});
let k = 0; const pasos = []; let desde = 0; let cur = { x: 640, y: 330 };
// captura directa por CDP: page.screenshot() hace bringToFront y eso le quitaba el foco a la caja donde se
// escribe (la cota no se editaba en la grabación, aunque a mano sí)
const cdp = await pag.target().createCDPSession();
const foto = async () => { const { data } = await cdp.send("Page.captureScreenshot", { format: "png", clip: { x: 0, y: 0, width: 1280, height: 620, scale: 1.5 } }); fs.writeFileSync(path.join(OUT, `f${String(k).padStart(3, "0")}.png`), Buffer.from(data, "base64")); k++; };
const paso = (rotulo) => { pasos.push({ desde, hasta: k - 1, rotulo }); desde = k; };
const quieto = async (n) => { for (let i = 0; i < n; i++) { await espera(70); await foto(); } };
const ponCursor = (x, y) => ev(([a, b]) => { const c = document.getElementById("hk-tut-cursor"); c.style.left = a + "px"; c.style.top = b + "px"; }, [x, y]);
const mover = async (x, y, n = 8) => {
  const p0 = { ...cur };
  for (let i = 1; i <= n; i++) {
    const t = i / n, s = t * t * (3 - 2 * t);
    const cx = p0.x + (x - p0.x) * s, cy = p0.y + (y - p0.y) * s;
    await pag.mouse.move(cx, cy); await ponCursor(cx, cy); await foto();
  }
  cur = { x, y };
};
let lienzo = false;
const clic = async (x, y, n = 8, veces = 1) => {
  const que = await ev(([a, b]) => { const e = document.elementFromPoint(a, b); return e ? e.tagName + "." + (e.className || "") : "nada"; }, [x, y]);
  if (/^nada/.test(que)) throw new Error(`clic fuera de la ventana en ${x},${y}`);
  if (lienzo && !/^CANVAS/.test(que)) throw new Error(`el clic en el lienzo cae sobre ${que} (${x},${y})`);
  await mover(x, y, n); await ev(([a, b]) => window.__aro(a, b), [x, y]);
  for (let i = 1; i <= veces; i++) await pag.mouse.click(x, y, { clickCount: i });   // doble clic = dos clics seguidos
  await espera(250); await foto(); await foto();
};
const escribir = async (texto) => {
  await pag.keyboard.down("Control"); await pag.keyboard.press("a"); await pag.keyboard.up("Control");
  for (const ch of texto) { await pag.keyboard.type(ch); await espera(60); await foto(); }
  await quieto(3); await pag.keyboard.press("Enter"); await espera(500); await foto();
};
const centro = (sel) => { lienzo = false; return ev((s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }, sel); };
const boton = (re) => { lienzo = false; return ev((re) => { const b = [...document.querySelectorAll("#hk-revit button")].find((b) => new RegExp(re).test(b.textContent) && b.getBoundingClientRect().width > 0); if (!b) return null; const r = b.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }, re); };
const mundo = (p) => { lienzo = true; return ev((p) => { const c = document.querySelector("#viewer canvas"); const x = window.__hekatanViewerCtx(); const r = c.getBoundingClientRect(); const V = Object.getPrototypeOf(x.camera.position).constructor; const v = new V(...p).project(x.camera); return [(v.x * 0.5 + 0.5) * r.width + r.left, (-v.y * 0.5 + 0.5) * r.height + r.top]; }, p); };
const herr = (id) => centro(`#hk-revit .rv-b[data-rv="${id}"]`);
const debe = async (sel) => { const c = await centro(sel); if (!c) throw new Error("no está en pantalla: " + sel); return c; };

// 1. presentación: las vistas a la derecha, las herramientas arriba
await quieto(6);
await mover(...(await herr("eje")), 10); await quieto(3); await mover(...(await herr("muro")), 10); await quieto(3);
await mover(...(await debe('#hk-revit .rv-niv[data-alzado="S"]')), 10); await quieto(4); paso("intro");
// 2. rejilla
await clic(...(await herr("ejes"))); await quieto(8);
await clic(...(await boton("Crear"))); await espera(1600); await quieto(8); paso("rejilla");
// 3. eje dibujado: dos clics, la burbuja sale sola; la cota azul se pulsa y se escribe
await clic(...(await herr("eje"))); await quieto(3);
await clic(...(await mundo([-6, 0, 3]))); await mover(...(await mundo([-6, 9, 3])), 10); await quieto(3);
await clic(...(await mundo([-6, 15, 3])), 6); await quieto(8);
const cotaEje = await debe("#hk-revit .rv-cota-t[title]");
console.log("cota eje en", cotaEje, await ev(() => JSON.stringify(window.__hekatanModoRevit.cotas())));
await clic(...cotaEje);
console.log("tras clic: activo =", await ev(() => document.activeElement?.className + "/" + document.activeElement?.tagName));
await escribir("5"); await quieto(8); paso("eje");
console.log("F =", await ev(() => window.__hekatanAxisGrids.find((a) => a.label === "F")?.start[0]));
// 4. nivel en el alzado Sur, con su cota
await clic(...(await debe('#hk-revit .rv-niv[data-alzado="S"]'))); await espera(900); await quieto(4);
await clic(...(await herr("nivel"))); await quieto(3);
await mover(...(await mundo([10, 0, 13.5])), 8); await mover(...(await mundo([10, 0, 15])), 8); await quieto(3);
await clic(...(await mundo([10, 0, 15])), 2); await quieto(6);
await clic(...(await debe("#hk-revit .rv-cota-t[title]")));
await escribir("3"); await quieto(8); paso("nivel");
// 5. columnas: de vuelta a la planta N+3.00, un clic en un cruce y luego en todos los cruces de todos los niveles
await clic(...(await debe('#hk-revit .rv-niv[data-z="3"]'))); await espera(900); await quieto(3);
await clic(...(await herr("columna"))); await quieto(3);
await clic(...(await mundo([6, 5, 3]))); await quieto(5);
await clic(...(await boton("En ejes · todos"))); await espera(700); await quieto(8); paso("columna");
// 6. vigas en cadena y en todos los ejes
await clic(...(await herr("viga"))); await quieto(3);
for (const p of [[0, 0, 3], [6, 0, 3], [12, 0, 3], [18, 0, 3]]) await clic(...(await mundo(p)), 7);
await pag.keyboard.press("Escape"); await quieto(3);
await clic(...(await boton("En ejes · todos"))); await espera(700); await quieto(8); paso("viga");
// 7. losa con un clic en el vano y luego todas
await clic(...(await herr("losa"))); await quieto(3);
await mover(...(await mundo([9, 7.5, 3]))); await quieto(5);
await clic(...(await mundo([9, 7.5, 3])), 2); await quieto(5);
await clic(...(await boton("Todas · todos"))); await espera(700); await quieto(8); paso("losa");
// 8. 3D
await clic(...(await herr("modificar"))); await clic(...(await debe('#hk-revit .rv-niv[data-vista3d="1"]'))); await espera(1300); await quieto(14); paso("3d");
// 9. pegado: doble clic en la cota del N+3.00, se escribe 3.80 y toda la planta sube
const cota = await debe('#hk-revit .rv-niv[data-z="3"] .rv-cota');
await clic(...cota, 8, 2); await quieto(3);
await escribir("3.80"); await espera(900); await quieto(4);
await clic(...(await debe('#hk-revit .rv-niv[data-vista3d="1"]'))); await espera(1300); await quieto(14); paso("pegado");

const info = await ev(() => { const P = window.__hekatanDrawingPoints.rawVal, A = window.__hekatanDrawingAreas.rawVal;
  return { nudos: P.length, barras: window.__hekatanDrawingPolylines.rawVal.filter((p) => p.length).length - A.length, losas: A.length,
    cotas: [...new Set(P.map((p) => p[2]))].sort((a, b) => a - b), ejes: window.__hekatanAxisGrids.map((a) => a.label + ":" + (Math.abs(a.start[0] - a.end[0]) < 1e-6 ? a.start[0] : a.start[1])) }; });
fs.writeFileSync(path.join(OUT, "pasos.json"), JSON.stringify({ pasos, info, errores: errs }, null, 1));
console.log(k, "fotogramas,", pasos.length, "pasos", JSON.stringify(info), "errores:", errs.length);
await nav.close();
