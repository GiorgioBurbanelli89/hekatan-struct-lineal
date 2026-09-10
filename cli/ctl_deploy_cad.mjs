/**
 * Lo del CAD, comprobado en el SITIO PÚBLICO (no en local): que lo que se subió es lo
 * que se arregló. Todo a ratón, como lo haría Jorge.
 *
 *   node cli/ctl_deploy_cad.mjs
 */
import puppeteer from "puppeteer";
import { mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "shots", "deploy"); mkdirSync(OUT, { recursive: true });
const URL_ = "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=new-blank";
const W = 1400, H = 900;
const nav = await puppeteer.launch({ headless: "new",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage();
await pag.setViewport({ width: W, height: H });
const errores = []; pag.on("pageerror", (e) => errores.push(e.message));
const consola = []; pag.on("console", (m) => consola.push(m.text()));
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const fallos = [];
const ok = (c, q, d = "") => { console.log(`${c ? "  ✓" : "  ✗"} ${q}${d ? "  —  " + d : ""}`); if (!c) fallos.push(q); };

await pag.goto(URL_, { waitUntil: "networkidle2", timeout: 180000 });
await espera(7000);
await pag.evaluate(() => {
  for (const id of ["hk-ribbon-guia", "settings", "hk-pane-host"]) document.getElementById(id)?.remove();
  const c = document.querySelector("#viewer").__ctx.controls;
  if (c) { c.enableDamping = false; c.update?.(); }
});
const pulsar = async (txt, ms = 700) => {
  const c = await pag.evaluate(({ t, AN, AL }) => {
    const cand = [...document.querySelectorAll("button, .tp-btnv_b")]
      .filter((e) => e.offsetParent !== null && (e.textContent || "").includes(t))
      .map((e) => ({ e, r: e.getBoundingClientRect() }))
      .filter(({ r }) => r.width > 0 && r.top >= 0 && r.left >= 0 && r.bottom <= AL && r.right <= AN);
    const b = cand.find(({ e }) => e.closest("#hk-ribbon")) ?? cand[0];
    if (!b) return null;
    return { x: b.r.left + b.r.width / 2, y: b.r.top + b.r.height / 2 };
  }, { t: txt, AN: W, AL: H });
  if (!c) return false;
  await pag.mouse.click(c.x, c.y); await espera(ms); return true;
};
const campoRibbon = async (title, valor) => {
  const c = await pag.evaluate((t) => {
    const i = [...document.querySelectorAll("#hk-ribbon input")]
      .find((e) => (e.title || "").toLowerCase().includes(t.toLowerCase()));
    if (!i) return null;
    const r = i.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }, title);
  if (!c) return false;
  await pag.mouse.click(c.x, c.y, { clickCount: 3 });
  await pag.keyboard.type(String(valor));
  await pag.keyboard.press("Enter"); await espera(500); return true;
};
const proy = (P) => pag.evaluate((Q) => {
  const [wx, wy, wz] = Q;
  const v = document.querySelector("#viewer"), cv = v.querySelector("canvas");
  const r = cv.getBoundingClientRect(), cam = v.__ctx.camera; cam.updateMatrixWorld();
  const m = cam.projectionMatrix.elements, mv = cam.matrixWorldInverse.elements;
  const tx = mv[0]*wx+mv[4]*wy+mv[8]*wz+mv[12], ty = mv[1]*wx+mv[5]*wy+mv[9]*wz+mv[13];
  const tz = mv[2]*wx+mv[6]*wy+mv[10]*wz+mv[14], tw = mv[3]*wx+mv[7]*wy+mv[11]*wz+mv[15];
  const cx = m[0]*tx+m[4]*ty+m[8]*tz+m[12]*tw, cy = m[1]*tx+m[5]*ty+m[9]*tz+m[13]*tw;
  const cw = m[3]*tx+m[7]*ty+m[11]*tz+m[15]*tw;
  return { x: r.left+(cx/cw+1)/2*r.width, y: r.top+(1-cy/cw)/2*r.height };
}, P);
const clic = async (P, ms = 380) => {
  const c = await proy(P);
  const tapado = await pag.evaluate((q) => {
    const e = document.elementFromPoint(q.x, q.y); return e ? e.tagName !== "CANVAS" : true;
  }, c);
  if (tapado) return false;
  await pag.mouse.move(c.x, c.y, { steps: 5 }); await espera(140);
  await pag.mouse.click(c.x, c.y); await espera(ms); return true;
};
const mirarPlanta = (cx, cy, alto) => pag.evaluate(({ cx, cy, alto, BY }) => {
  const v = document.querySelector("#viewer"), cam = v.__ctx.camera, cv = v.querySelector("canvas");
  const r = cv.getBoundingClientRect();
  cam.up.set(0, 1, 0);
  if (cam.isOrthographicCamera) { cam.zoom = (cam.top - cam.bottom) / alto; cam.updateProjectionMatrix(); }
  const mpp = (cam.top - cam.bottom) / cam.zoom / r.height;
  const dy = (BY - (r.top + r.height / 2)) * mpp;
  v.__ctx.controls.target.set(cx, cy + dy, 0);
  cam.position.set(cx, cy + dy, 60);
  cam.lookAt(v.__ctx.controls.target); v.__ctx.controls.update?.(); v.__ctx.render?.();
}, { cx, cy, alto, BY: 245 + (H - 245 - 110) / 2 });

// ── la planta y las columnas, a ratón ───────────────────────────────────────
await pulsar("Planta", 1000);
await mirarPlanta(3, -2.5, 12);
ok(await pulsar("Rect"), "el ribbon responde: RECTÁNGULO");
await clic([0, 0, 0]); await clic([6, -5, 0], 600);
await pag.keyboard.press("Escape"); await espera(300);
await pulsar("Columna");
const ESQ = [[0, 0, 0], [6, 0, 0], [6, -5, 0], [0, -5, 0]];
for (const P of ESQ) await clic(P, 380);
await pag.keyboard.press("Escape"); await espera(300);
await pulsar("Apoyo");
let ap = 0; for (const P of ESQ) if (await clic(P, 260)) ap++;
ok((await pag.evaluate(() => window.__hekatanManualSupports?.size ?? 0)) === 4,
   "cuatro apoyos puestos a clic", `${ap} clics`);

// ── subir y cargar la cubierta ─────────────────────────────────────────────
await campoRibbon("Cuantos pisos", 6);
ok(await pulsar("Subir", 1500), "«⇈ Subir» levanta el edificio");
const cotas = await pag.evaluate(() => [...new Set((window.__hekatanDrawingPoints?.val || [])
  .map((q) => +q[2].toFixed(2)))].sort((a, b) => a - b));
ok(cotas.length === 8 && Math.max(...cotas) === 21, "siete plantas de 3 m, sin solaparse",
   `cotas ${cotas.join(", ")}`);
await campoRibbon("Cota Z", 21);
await mirarPlanta(3, -2.5, 12);
await pulsar("Carga");
let cg = 0; for (const [x, y] of [[0,0],[6,0],[6,-5],[0,-5]]) if (await clic([x, y, 21], 260)) cg++;
ok((await pag.evaluate(() => window.__hekatanManualLoads?.size ?? 0)) === 4,
   "cuatro cargas en la cubierta, subiendo la cota Z", `${cg} clics`);

// ── lo del arreglo: nudos SOLDADOS y modelo resuelto ───────────────────────
await espera(1500);
const linea = consola.filter((t) => /\[NewBlank\]/.test(t)).slice(-1)[0] || "";
const m = linea.match(/Solve OK — (\d+) nudos \(de (\d+) puntos\), (\d+) elementos/);
ok(!!m, "el modelo se RESUELVE solo, al tener apoyos y cargas", linea.slice(0, 90));
if (m) ok(+m[1] === 32 && +m[2] === 84 && +m[3] === 56,
   "los nudos que coinciden se SUELDAN (era 84 sueltos)", `${m[1]} nudos de ${m[2]} puntos, ${m[3]} barras`);

// ── A S D F ────────────────────────────────────────────────────────────────
await pulsar("3D", 800);
await pag.evaluate(() => document.activeElement && document.activeElement.blur());
const est = () => pag.evaluate(() => {
  const s = window.__hekatanSettings?.();
  const v = document.querySelector("#viewer");
  let piezas = 0;
  v.__ctx.scene.traverse((o) => { if (o.type === "Mesh" && o.parent?.type === "Group") piezas++; });
  return { frame: s?.frameResults?.rawVal, defo: !!s?.deformedShape?.rawVal, piezas };
});
for (const [t, q] of [["a", "normals"], ["s", "shearsY"], ["d", "bendingsZ"]]) {
  await pag.keyboard.press(t); await espera(900);
  const e = await est();
  ok(e.frame === q, `«${t.toUpperCase()}» dibuja el diagrama`, `${e.frame} · ${e.piezas} piezas en escena`);
}
await pag.screenshot({ path: join(OUT, "cad_publico.png") });
ok(errores.length === 0, "sin errores de página", errores.slice(0, 2).join(" | "));
await nav.close();
console.log(fallos.length ? `\n${fallos.length} FALLO(S)` : "\nTodo correcto — el sitio público lleva el arreglo");
process.exit(fallos.length ? 1 : 0);
