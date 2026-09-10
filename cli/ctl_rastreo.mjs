/**
 * RASTREO DE REFERENCIA — el «object snap tracking» de AutoCAD.
 *
 * El caso de Jorge: bajando una columna desde la esquina del pórtico, ¿en qué se
 * apoya para parar en la cota de la base de al lado? El ORTO da el ángulo, pero la
 * COTA no la daba nadie. Ahora, al alinearse con un nudo ya dibujado, esa coordenada
 * se clava en la suya y sale la línea de rastreo hasta él.
 *
 *   node cli/ctl_rastreo.mjs            (local)
 *   node cli/ctl_rastreo.mjs publico
 */
import puppeteer from "puppeteer";
import { readFileSync, existsSync, statSync, mkdirSync } from "fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUB = process.argv[2] === "publico";
const OUT = join(__dirname, "shots", "napkin"); mkdirSync(OUT, { recursive: true });
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
const PUERTO = 4772;
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".wasm": "application/wasm", ".json": "application/json", ".svg": "image/svg+xml",
  ".png": "image/png", ".ico": "image/x-icon", ".woff2": "font/woff2" };
let srv = null;
if (!PUB) {
  srv = createServer((req, res) => {
    let p = decodeURIComponent((req.url || "/").split("?")[0]);
    if (p.startsWith(BASE)) p = p.slice(BASE.length - 1);
    let f = join(raiz, p);
    if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
    if (!existsSync(f)) { res.writeHead(404); return res.end("404"); }
    res.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" });
    res.end(readFileSync(f));
  });
  await new Promise((r) => srv.listen(PUERTO, r));
}
const URL_ = PUB
  ? "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=new-blank"
  : `http://localhost:${PUERTO}${BASE}workspace/?t=new-blank`;
const nav = await puppeteer.launch({ headless: "new",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage();
await pag.setViewport({ width: 1280, height: 800 });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const fallos = [];
const ok = (c, q, d = "") => { console.log(`${c ? "  ✓" : "  ✗"} ${q}${d ? "  —  " + d : ""}`); if (!c) fallos.push(q); };
await pag.goto(URL_, { waitUntil: "networkidle2", timeout: 180000 });
await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 });
await espera(5000);
await pag.evaluate(() => {
  document.getElementById("hk-ribbon-guia")?.remove();
  const c = document.querySelector("#viewer").__ctx.controls;
  if (c) { c.enableDamping = false; c.update?.(); }
});
const cmd = async (t, tras = 420) => {
  await pag.evaluate(() => { const i = document.getElementById("hk3-cmd-input"); if (i) i.value = ""; });
  await pag.focus("#hk3-cmd-input");
  await pag.type("#hk3-cmd-input", t, { delay: 12 });
  await pag.keyboard.press("Enter");
  await espera(tras);
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
const leer = () => pag.evaluate(() => {
  const s = window.__hekatanSnapMarker;
  const e = document.getElementById("hk-osnap-etiqueta");
  let guia = null;
  document.querySelector("#viewer").__ctx.scene.traverse((o) => {
    if (o.type === "Line" && o.visible && o.material?.color?.getHexString?.() === "ffc400"
        && o.geometry?.attributes?.position?.count === 2) {
      const a = o.geometry.attributes.position.array;
      guia = [ [a[0],a[1],a[2]].map(q=>+q.toFixed(3)), [a[3],a[4],a[5]].map(q=>+q.toFixed(3)) ];
    }
  });
  return { pos: s?.visible ? [s.position.x, s.position.y, s.position.z].map((q) => +q.toFixed(4)) : null,
           etiqueta: e && e.style.display !== "none" ? e.textContent : null, guia };
});

// ── el pórtico de Jorge: dos columnas de 3 m y la viga ─────────────────────
await cmd("l"); await cmd("0,0,0", 300); await cmd("0,0,3", 300);
await pag.keyboard.press("Escape"); await espera(300);
await cmd("l"); await cmd("0,0,3", 300); await cmd("6,0,3", 400);
await pag.keyboard.press("Escape"); await espera(400);
await pag.evaluate(() => window.__hekatanRibbon?.vista?.(3)); await espera(900);
await pag.evaluate(() => window.__hekatanAutoFit?.()); await espera(900);
const n0 = await pag.evaluate(() => (window.__hekatanDrawingPoints?.val || []).length);
ok(n0 >= 3, "el pórtico de partida está dibujado", `${n0} nudos`);

// ── ahora la columna de la derecha, HACIA ABAJO, con el ratón ──────────────
await pag.evaluate(() => window.__hekatanRibbon?.usar?.("line"));
await espera(500);
const a = await proy([6, 0, 3]);
await pag.mouse.move(a.x, a.y, { steps: 6 }); await espera(400);
await pag.mouse.click(a.x, a.y); await espera(500);
console.log("    tras el 1er clic:", JSON.stringify(await pag.evaluate(() => ({
  n: (window.__hekatanDrawingPoints?.val || []).length,
  ultimo: (window.__hekatanDrawingPoints?.val || []).slice(-1)[0]?.map((q) => +q.toFixed(3)),
  estado: (window.__hekatanCadStatusText || "").slice(0, 70),
  tool: window.__hekatanCadState?.get?.()?.tool,
}))));
// el cursor baja, cerca de la cota 0 de la otra base pero SIN acertarla
const casi = await proy([6, 0, 0.16]);
await pag.mouse.move(casi.x, casi.y, { steps: 10 });
await espera(600);
const m = await leer();
console.log("    tras mover:", JSON.stringify(await pag.evaluate(() => {
  const rb = window.__hekatanRubberBand;
  const a = rb?.visible ? rb.geometry.attributes.position.array : null;
  return { goma: a ? [[a[0],a[1],a[2]].map(q=>+q.toFixed(3)), [a[3],a[4],a[5]].map(q=>+q.toFixed(3))] : null,
           estado: (window.__hekatanCadStatusText || "").slice(0, 70) };
})));
ok(!!m.pos && Math.abs(m.pos[2]) < 1e-6,
   "bajando la columna, la cota se CLAVA en la de la otra base (z = 0)", JSON.stringify(m.pos));
ok(m.etiqueta === "Alineado con un nudo", "y lo dice junto al cursor", String(m.etiqueta));
ok(!!m.guia && Math.abs(m.guia[0][0]) < 1e-6 && Math.abs(m.guia[1][0] - 6) < 1e-6,
   "y sale la línea de rastreo desde el nudo que sirve de referencia", JSON.stringify(m.guia));
await pag.screenshot({ path: join(OUT, PUB ? "rastreo_publico.png" : "rastreo_local.png") });
await pag.mouse.click(casi.x, casi.y); await espera(500);
await pag.keyboard.press("Escape"); await espera(300);
const pts = await pag.evaluate(() => (window.__hekatanDrawingPoints?.val || []).map((q) => q.map((c) => +c.toFixed(4))));
const base = pts[pts.length - 1];
ok(Math.abs(base[2]) < 1e-6 && Math.abs(base[0] - 6) < 1e-6,
   "la columna queda a plomo y con la base a la MISMA cota", JSON.stringify(base));

// ── con ALT no hay rastreo ─────────────────────────────────────────────────
await pag.evaluate(() => window.__hekatanRibbon?.usar?.("line"));
await espera(400);
await pag.mouse.click(a.x, a.y); await espera(400);
await pag.evaluate(({ x, y }) => {
  const cv = document.querySelector("#viewer").querySelector("canvas");
  cv.dispatchEvent(new PointerEvent("pointermove", { clientX: x, clientY: y, altKey: true, bubbles: true, pointerId: 1 }));
}, { x: casi.x, y: casi.y });
await espera(400);
const mAlt = await leer();
ok(!mAlt.guia, "con ALT no hay rastreo: el punto cae en crudo", JSON.stringify(mAlt.guia));
await pag.keyboard.press("Escape");
await nav.close(); srv?.close();
console.log(fallos.length ? `\n${fallos.length} FALLO(S)` : `\nTodo correcto (${PUB ? "sitio público" : "local"})`);
process.exit(fallos.length ? 1 : 0);
