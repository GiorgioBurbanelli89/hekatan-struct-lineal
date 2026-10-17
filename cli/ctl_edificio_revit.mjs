/**
 * Test de dibujo de punta a punta (17-oct-2026), TODO con clics de ratón sobre botones y lienzo:
 * Modo Revit (Rejilla → columnas, vigas, losas en todos los niveles) → cinta clásica: apoyos en la base y
 * cargas en la cubierta → el modelo se resuelve → equilibrio ΣRz = Σcargas.
 *   node cli/ctl_edificio_revit.mjs [--base URL] [--png carpeta]
 */
import puppeteer from "puppeteer";
import fs from "node:fs";
import path from "node:path";
const args = process.argv.slice(2);
const ib = args.indexOf("--base"), BASE = ib >= 0 ? args[ib + 1] : "http://localhost:4600";
const ip = args.indexOf("--png"), PNG = ip >= 0 ? args[ip + 1] : null;
if (PNG) fs.mkdirSync(PNG, { recursive: true });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const t0 = Date.now();
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1280, height: 620 });
const errs = []; pag.on("pageerror", (e) => errs.push(e.message)); pag.on("dialog", (d) => d.accept());
const consola = []; pag.on("console", (m) => consola.push(m.text()));
await pag.goto(`${BASE}/workspace/?t=new-blank`, { waitUntil: "networkidle2", timeout: 120000 }); await espera(3500);
const ev = (f, a) => pag.evaluate(f, a);
const filas = []; const ok = (q, c, d = "") => { filas.push(!!c); console.log(`${c ? "  ✓" : "  ✗"} ${q}${d ? "  · " + d : ""}`); };
let nf = 0; const foto = async (n) => { if (PNG) await pag.screenshot({ path: path.join(PNG, `${String(++nf).padStart(2, "0")}_${n}.png`) }); };
// clic real; si cae sobre otra cosa que la esperada, se dice
const clicEn = async ([x, y], lienzo = false, veces = 1) => {
  const que = await ev(([a, b]) => { const e = document.elementFromPoint(a, b); return e ? e.tagName + "." + (e.className || e.id || "") : "nada"; }, [x, y]);
  if (lienzo && !/^CANVAS/.test(que)) return `tapado por ${que}`;
  await pag.mouse.move(x, y, { steps: 4 }); await espera(60);
  await pag.mouse.click(x, y, { clickCount: veces }); await espera(250); return null;
};
const centro = (sel) => ev((s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return r.width ? [r.left + r.width / 2, r.top + r.height / 2] : null; }, sel);
const boton = (re, dentro = "body") => ev(([re, d]) => { const b = [...document.querySelectorAll(`${d} button, ${d} .tp-btnv_b`)].find((b) => new RegExp(re).test(b.textContent) && b.getBoundingClientRect().width > 0 && b.offsetParent !== null); if (!b) return null; const r = b.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }, [re, dentro]);
// botón de la cinta clásica por su título «Nombre (TECLA) — …» (la cinta es position:fixed: offsetParent es null)
const cinta = (nombre) => ev((n) => { const b = [...document.querySelectorAll("#hk-ribbon button")].find((b) => (b.title || "").startsWith(n + " (")); if (!b) return null; const r = b.getBoundingClientRect(); return r.width && r.top >= 0 && r.bottom <= innerHeight ? [r.left + r.width / 2, r.top + r.height / 2] : null; }, nombre);
const mundo = (p) => ev((p) => { const c = document.querySelector("#viewer canvas"); const x = window.__hekatanViewerCtx(); const r = c.getBoundingClientRect(); const V = Object.getPrototypeOf(x.camera.position).constructor; const v = new V(...p).project(x.camera); return [(v.x * 0.5 + 0.5) * r.width + r.left, (-v.y * 0.5 + 0.5) * r.height + r.top]; }, p);
const pulsa = async (c, que) => { if (!c) { ok(`botón «${que}» en pantalla`, false); return false; } await clicEn(c); await espera(400); return true; };
const modelo = () => ev(() => { const P = window.__hekatanDrawingPoints.rawVal, A = window.__hekatanDrawingAreas.rawVal, L = window.__hekatanDrawingPolylines.rawVal;
  return { nudos: P.length, barras: L.filter((p) => p.length).length - A.length, losas: A.length, apoyos: window.__hekatanManualSupports?.size ?? 0, cargas: window.__hekatanManualLoads?.size ?? 0 }; });

// 1. edificio en Modo Revit, con clics
await pulsa(await centro('#hk-revit .rv-b[data-rv="ejes"]'), "Rejilla");
await pulsa(await boton("Crear", "#hk-revit"), "Crear ejes y niveles"); await espera(1600);
await pulsa(await centro('#hk-revit .rv-niv[data-z="3"]'), "N+3.00"); await espera(800);
for (const [h, b] of [["columna", "En ejes · todos"], ["viga", "En ejes · todos"], ["losa", "Todas · todos"]]) {
  await pulsa(await centro(`#hk-revit .rv-b[data-rv="${h}"]`), h);
  await pulsa(await boton(b, "#hk-revit"), `${h}: ${b}`); await espera(700);
}
await pulsa(await centro('#hk-revit .rv-b[data-rv="modificar"]'), "Modificar");
let m = await modelo();
ok("Modo Revit: 80 columnas + 124 vigas + 48 losas (4 pisos), sin duplicados", m.barras === 204 && m.losas === 48, JSON.stringify(m));
await pulsa(await centro('#hk-revit .rv-niv[data-vista3d="1"]'), "Vista 3D"); await espera(1200); await foto("edificio");

// 2. apoyos en la base: planta N+0.00 y herramienta Apoyo de la cinta clásica
await pulsa(await centro('#hk-revit .rv-niv[data-z="0"]'), "N+0.00"); await espera(900);
const aCinta = await boton("Cinta clásica", "#hk-revit") ?? await boton("Cinta clásica");
await pulsa(aCinta, "Cinta clásica"); await espera(800);
await foto("cinta_clasica");
const apoyo = await cinta("Apoyo");
ok("cinta clásica: herramienta Apoyo a la vista", !!apoyo);
const tapados = [];
if (apoyo) {
  await clicEn(apoyo); await espera(400);
  for (const x of [0, 6, 12, 18, 24]) for (const y of [0, 5, 10, 15]) { const r = await clicEn(await mundo([x, y, 0]), true); if (r) tapados.push(`(${x},${y}) ${r}`); await espera(120); }
  await pag.keyboard.press("Escape"); await espera(300);
}
m = await modelo();
ok("20 apoyos en los 20 cruces de la base, a clic", m.apoyos === 20, `${m.apoyos} apoyos${tapados.length ? " · " + tapados.slice(0, 3).join(" | ") : ""}`);
await foto("apoyos");
// 3. cargas en la cubierta (z = 12): una por cruce
const carga = await cinta("Carga");
ok("cinta clásica: herramienta Carga a la vista", !!carga);
const tap2 = [];
if (carga) {
  // planta de la cubierta CON EL RATÓN: clic en el campo «Cota Z» de la cinta y escribir 12
  const cz = await ev(() => { const i = document.getElementById("hk-dist-plano"); if (!i) return null; const r = i.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; });
  ok("cinta clásica: campo «Cota Z» a la vista", !!cz);
  if (cz) { await clicEn(cz, false, 3); await pag.keyboard.type("12"); await pag.keyboard.press("Enter"); await espera(800); }
  await clicEn(carga); await espera(400);
  for (const x of [0, 6, 12, 18, 24]) for (const y of [0, 5, 10, 15]) { const r = await clicEn(await mundo([x, y, 12]), true); if (r) tap2.push(`(${x},${y}) ${r}`); await espera(120); }
  await pag.keyboard.press("Escape"); await espera(300);
}
m = await modelo();
const zc = await ev(() => { const P = window.__hekatanDrawingPoints.rawVal; return [...(window.__hekatanManualLoads?.keys() ?? [])].map((k) => P[+String(k).replace(/^pt:/, "")]?.[2]); });
ok("las cargas están en la CUBIERTA (z = 12), no en la base", zc.length === 20 && zc.every((z) => z === 12), [...new Set(zc)].join(","));
ok("20 cargas en la cubierta, a clic", m.cargas === 20, `${m.cargas} cargas${tap2.length ? " · " + tap2.slice(0, 3).join(" | ") : ""}`);
await foto("cargas");
// 4. se resuelve y cumple el equilibrio
await espera(2500);
const linea = consola.filter((t) => /Solve OK/.test(t)).slice(-1)[0] ?? "";
ok("el modelo se RESUELVE", !!linea, linea.slice(0, 110));
const eq = await ev(() => { const L = window.__hekatanManualLoads, R = window.__hekatanStates?.deformOutputs?.rawVal?.reactions;
  let F = 0; L?.forEach((v) => F += v[2] ?? 0); let Rz = 0; if (R) (R instanceof Map ? R : new Map(Object.entries(R))).forEach((v) => Rz += v[2] ?? 0);
  return { F, Rz, hayR: !!R }; });
ok("equilibrio: ΣRz + ΣFz = 0", eq.hayR && Math.abs(eq.Rz + eq.F) < 1e-6 * Math.max(1, Math.abs(eq.F)), JSON.stringify(eq));
await foto("resuelto");
ok("sin errores de página", errs.length === 0, errs.slice(0, 2).join(" | "));
console.log(`${filas.filter(Boolean).length}/${filas.length} OK (${((Date.now() - t0) / 1000).toFixed(1)} s)`);
await nav.close(); process.exit(filas.every(Boolean) ? 0 : 1);
