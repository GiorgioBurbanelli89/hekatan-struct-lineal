// Fotogramas para el GIF de novedades (29-sep-2026), del SITIO PÚBLICO. Cada escena: PNG + rótulo en escenas.json.
import puppeteer from "puppeteer";
import { writeFileSync, mkdirSync } from "node:fs";
const B = process.env.B || "https://giorgioburbanelli89.github.io/hekatan-struct-lineal";
const DIR = "cli/shots/gif_novedades"; mkdirSync(DIR, { recursive: true });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1600, height: 900 });
pag.on("dialog", (d) => d.accept().catch(() => {}));
const esc = []; let k = 0;
const foto = async (es, en, marco = null, dur = 2200) => {
  const f = `${String(++k).padStart(2, "0")}.png`;
  await pag.screenshot({ path: `${DIR}/${f}` });
  esc.push({ f, es, en, marco, dur });
};
const caja = (sel) => pag.evaluate((s) => { const r = document.querySelector(s)?.getBoundingClientRect(); return r ? [r.x, r.y, r.width, r.height] : null; }, sel);
const abrir = async (id) => {
  await pag.goto(`${B}/workspace/index.html?t=${id}`, { waitUntil: "domcontentloaded", timeout: 180000 });
  await pag.waitForFunction(() => !!window.__hekatanRunModalAnimate && !!window.__hkKLocalHover && window.__hekatanStates?.elements?.val?.length, { timeout: 180000 });
  await espera(6000);
};
// 1) GDL del modal a la vista
await abrir("plantillas");
await foto("GDL del modelo, a la vista junto al botón del modal", "Model DOFs, visible next to the modal button", await caja("#hk-modal-gdl-panel"));
await pag.evaluate(() => window.__hekatanRunModalAnimate()); await espera(7000);
await foto("Corre el modal: GDL usados frente al tope (100 000)", "Run modal: DOFs used vs. the limit (100,000)", await caja("#hk-modal-gdl-panel"), 2600);
await espera(700); await foto("Corre el modal: GDL usados frente al tope (100 000)", "Run modal: DOFs used vs. the limit (100,000)", await caja("#hk-modal-gdl-panel"), 900);
await pag.evaluate(() => { window.__hekatanModalStop?.(); window.__hekatanDofMaxModal = 1500; window.__hekatanRunModalAnimate(); }); await espera(5000);
await foto("Si pasa del tope: en rojo, y el modal no se calcula", "Over the limit: red, the modal is not run", await caja("#hk-modal-gdl-panel"), 2800);
await pag.evaluate(() => { window.__hekatanDofMaxModal = 0; });
// 2) barra: matriz en números y en letras
const ib = await pag.evaluate(() => window.__hekatanStates.elements.val.findIndex((e) => e.length === 2));
await pag.evaluate((j) => { window.__hkKLocalHover.vista("numeros"); window.__hkKLocalHover.ver(j, 330, 90); }, ib); await espera(700);
await foto("Cursor sobre una barra: su matriz de rigidez local, la del solver", "Hover a frame: its local stiffness matrix, from the solver", await caja("#hk-klocal"), 2600);
await pag.evaluate((j) => { window.__hkKLocalHover.vista("letras"); window.__hkKLocalHover.ver(j, 330, 90); }, ib); await espera(700);
await foto("Pestaña «En letras»: k_a, k_v, k_m… = la del solver", "«Symbolic» tab: k_a, k_v, k_m… equals the solver matrix", await caja("#hk-klocal"), 3200);
// 3) paño del estribo
await abrir("estribo-puente");
const ip = await pag.evaluate(() => window.__hekatanStates.elements.val.findIndex((e) => e.length === 4));
await pag.evaluate((j) => window.__hkKLocalHover.verPano(j, 330, 60), ip); await espera(700);
await foto("Cursor sobre una placa: placa y membrana, con su formulación", "Hover a shell: plate and membrane blocks, with their formulation", await caja("#hk-klocal"), 3400);
await pag.evaluate(() => document.getElementById("hk-klocal") && (document.getElementById("hk-klocal").style.display = "none"));
// 4) Exportar > Fortran
await pag.evaluate(() => { const s = window.__hekatanSettings(); s.shellResults.val = "membranePrincipalMax"; });
await espera(1500);
await pag.evaluate(() => { document.querySelectorAll("#hk-menus button").forEach((b) => { if (/Exportar/.test(b.textContent)) b.click(); }); });
await espera(800);
const itF = await pag.evaluate(() => { const it = [...document.querySelectorAll("div,button")].filter((e) => /Fortran \(\.f90\)/.test(e.textContent || "") && e.children.length < 4); const r = (it[it.length - 1] ?? it[0])?.getBoundingClientRect(); return r ? [r.x, r.y, r.width, r.height] : null; });
await foto("Exportar › Fortran: los resultados activos en un .f90", "Export › Fortran: the active results as a .f90 program", itF, 3000);
await pag.evaluate(() => { const it = [...document.querySelectorAll("div,button")].filter((e) => /Fortran \(\.f90\)/.test(e.textContent || "") && e.children.length < 4); (it[it.length - 1] ?? it[0])?.click(); });
await espera(1000);
const f90 = await pag.evaluate(() => window.__hekatanUltimoFortran ?? "");
writeFileSync(`${DIR}/estribo_FMax.f90`, f90);
writeFileSync(`${DIR}/escenas.json`, JSON.stringify(esc, null, 1));
console.log(esc.length, "fotogramas ·", f90.split("\n").length, "líneas de Fortran");
await nav.close();
