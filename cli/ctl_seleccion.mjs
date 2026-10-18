/**
 * SELECCIÓN como AutoCAD (18-oct-2026), con el ratón real, en el Modo Revit («Modificar»):
 *   clic en un nudo · ventana izq→der (solo lo que queda ENTERO dentro) · captura der→izq (lo que TOCA)
 *   · lo mismo ARRASTRANDO.   node cli/ctl_seleccion.mjs [--base URL]
 */
import puppeteer from "puppeteer";
const args = process.argv.slice(2); const ib = args.indexOf("--base"); const BASE = ib >= 0 ? args[ib + 1] : "http://localhost:4600";
const ip = args.indexOf("--png"); const PNG = ip >= 0 ? args[ip + 1] : null;
import fs from "node:fs"; if (PNG) fs.mkdirSync(PNG, { recursive: true });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1280, height: 720 });
const errs = []; pag.on("pageerror", (e) => errs.push(e.message));
await pag.goto(`${BASE}/workspace/?t=new-blank`, { waitUntil: "networkidle2", timeout: 180000 }); await espera(4000);
const ev = (f, a) => pag.evaluate(f, a);
const filas = []; const ok = (q, c, d = "") => { filas.push(!!c); console.log(`${c ? "  ✓" : "  ✗"} ${q}${d ? "  · " + d : ""}`); };
const centro = (sel) => ev((s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return r.width ? [r.left + r.width / 2, r.top + r.height / 2] : null; }, sel);
const boton = (re) => ev((re) => { const b = [...document.querySelectorAll("#hk-revit button")].find((b) => new RegExp(re).test(b.textContent) && b.getBoundingClientRect().width > 0); if (!b) return null; const r = b.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }, re);
const clic = async (c) => { await pag.mouse.move(c[0], c[1], { steps: 4 }); await espera(60); await pag.mouse.click(c[0], c[1]); await espera(350); };
const mundo = (p) => ev((p) => { const c = document.querySelector("#viewer canvas"); const x = window.__hekatanViewerCtx(); const r = c.getBoundingClientRect(); const V = Object.getPrototypeOf(x.camera.position).constructor; const v = new V(...p).project(x.camera); return [(v.x * 0.5 + 0.5) * r.width + r.left, (-v.y * 0.5 + 0.5) * r.height + r.top]; }, p);
const sel = () => ev(() => { const s = [...(window.__hekatanSelection ?? [])]; return { n: s.length, pt: s.filter((i) => i.startsWith("pt:")).length, seg: s.filter((i) => i.startsWith("seg:")).length }; });
// edificio: Rejilla → Crear → columnas y vigas en todos los niveles → planta N+3 → Modificar
if (!(await ev(() => document.body.classList.contains("hk-revit-on")))) await clic(await centro("#hk-revit-toggle"));
await clic(await centro('#hk-revit .rv-b[data-rv="ejes"]')); await clic(await boton("Crear")); await espera(1500);
await clic(await centro('#hk-revit .rv-niv[data-z="3"]')); await espera(800);
await clic(await centro('#hk-revit .rv-b[data-rv="columna"]')); await clic(await boton("En ejes · todos")); await espera(600);
await clic(await centro('#hk-revit .rv-b[data-rv="viga"]')); await clic(await boton("En ejes · todos")); await espera(600);
await clic(await centro('#hk-revit .rv-b[data-rv="modificar"]')); await espera(400);
// 1. clic sobre un nudo (que está ENCIMA de los ejes B y 2)
await clic(await mundo([6, 5, 3]));
let s = await sel(); ok("clic en el nudo (6,5,3), que cae sobre los ejes B y 2 → 1 nudo seleccionado", s.pt === 1 && s.n === 1, JSON.stringify(s));
await pag.keyboard.press("Escape"); await espera(300);
// 2. VENTANA izq→der alrededor del vano 6–12 × 5–10 (con margen dentro de los ejes vecinos)
const a1 = await mundo([5, 11, 3]), b1 = await mundo([13, 4, 3]);
await clic(a1); await clic(b1);
s = await sel(); ok("ventana izq→der (6–12 × 5–10): 4 nudos + las 4 vigas del vano, nada que salga del recuadro", s.pt === 4 && s.seg === 4, JSON.stringify(s));
await pag.keyboard.press("Escape"); await espera(300);
// 3. CAPTURA der→izq pequeña, en medio del vano (no contiene nudos): coge la viga que cruza
const a2 = await mundo([9.4, 6.3, 3]), b2 = await mundo([8.6, 3.7, 3]);   // los dos clics en VACÍO (a 1.3 m de la viga)
await clic(a2); await clic(b2);
s = await sel(); ok("captura der→izq sobre la viga del eje 2 entre B y C: la viga (que solo TOCA el recuadro)", s.seg === 1 && s.pt === 0, JSON.stringify(s));
await pag.keyboard.press("Escape"); await espera(300);
// 3b. RESALTADO: mientras se mueve (antes de soltar) se ve lo que va a entrar, y después lo seleccionado
const foto = async (n) => { if (PNG) await pag.screenshot({ path: `${PNG}/${n}.png` }); };
const resaltado = () => ev(() => { const g = window.__hekatanViewerCtx().scene.getObjectByName("hk-seleccion-previa"); return { previa: window.__hekatanPreviaN ?? 0, lineasPrevia: g?.children.length ?? 0 }; });
for (const [nom, A, Bp, esperaPrevia] of [["izq_a_der", a1, b1, 8], ["der_a_izq", a2, b2, 1]]) {
  await clic(A); await pag.mouse.move((A[0] + Bp[0]) / 2, (A[1] + Bp[1]) / 2, { steps: 4 }); await pag.mouse.move(Bp[0], Bp[1], { steps: 6 }); await espera(250);
  const r = await resaltado(); await foto(`${nom}_1_moviendo`);
  ok(`${nom}: mientras se mueve, VISTA PREVIA de lo que entra (${esperaPrevia} objetos) resaltada`, r.previa === esperaPrevia && r.lineasPrevia > 0, JSON.stringify(r));
  await pag.mouse.click(Bp[0], Bp[1]); await espera(400);
  const sl = await ev(() => { const g = window.__hekatanViewerCtx().scene.children.find((o) => o.children?.some?.((c) => c.isLineSegments2 && c.material?.linewidth === 5)); return { sel: window.__hekatanSelection?.size ?? 0, gruesas: !!g, previa: window.__hekatanPreviaN ?? 0 }; });
  await foto(`${nom}_2_seleccionado`);
  ok(`${nom}: al soltar, lo seleccionado queda resaltado en línea GRUESA y la vista previa se quita`, sl.sel === esperaPrevia && sl.gruesas && sl.previa === 0, JSON.stringify(sl));
  await pag.keyboard.press("Escape"); await espera(300);
}
// 4. lo mismo ARRASTRANDO
const arrastra = async (a, b) => { await pag.mouse.move(a[0], a[1]); await pag.mouse.down(); await pag.mouse.move(b[0], b[1], { steps: 12 }); await pag.mouse.up(); await espera(400); };
await arrastra(a1, b1); s = await sel(); ok("arrastrando izq→der: la misma ventana", s.pt === 4 && s.seg === 4, JSON.stringify(s));
await pag.keyboard.press("Escape"); await espera(300);
await arrastra(a2, b2); s = await sel(); ok("arrastrando der→izq: la misma captura", s.seg === 1 && s.pt === 0, JSON.stringify(s));
ok("sin errores de página", !errs.length, errs.slice(0, 2).join(" | "));
console.log(`${filas.filter(Boolean).length}/${filas.length} OK`); await nav.close(); process.exit(filas.every(Boolean) ? 0 : 1);
