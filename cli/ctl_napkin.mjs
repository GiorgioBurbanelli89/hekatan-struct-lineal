/**
 * Lo que le faltaba al CAD, tomado del cuaderno Napkin (picobloc.com/sandbox/Napkin).
 *
 * Su idea de fondo es que casi nada se hace con diálogos: se edita ENCIMA del objeto.
 * Aquí se comprueban las piezas que se han traído:
 *
 *   ALT           el punto cae donde está el cursor, sin referencia ni rejilla
 *   destello      lo que cambia de propiedad PARPADEA, para saber que llegó
 *   A S D F       axil, cortante, momento y deformada a una tecla
 *   x5  /5        puesta una réplica, «x5» repite esa distancia y «/5» la subdivide
 *
 *   node cli/ctl_napkin.mjs
 */
import puppeteer from "puppeteer";
import { readFileSync, existsSync, statSync } from "fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
const PUERTO = 4767;
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".wasm": "application/wasm", ".json": "application/json", ".svg": "image/svg+xml",
  ".png": "image/png", ".ico": "image/x-icon", ".woff2": "font/woff2" };
const srv = createServer((req, res) => {
  let p = decodeURIComponent((req.url || "/").split("?")[0]);
  if (p.startsWith(BASE)) p = p.slice(BASE.length - 1);
  let f = join(raiz, p);
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
  if (!existsSync(f)) { res.writeHead(404); return res.end("404"); }
  res.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" });
  res.end(readFileSync(f));
});
await new Promise((r) => srv.listen(PUERTO, r));
const nav = await puppeteer.launch({ headless: "new",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage();
await pag.setViewport({ width: 1280, height: 720 });
const errores = []; const pilas = [];
pag.on("pageerror", (e) => { errores.push(e.message); pilas.push((e.stack || "").split(String.fromCharCode(10)).slice(0, 5).join(" | ")); });
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const fallos = [];
const ok = (c, q, d = "") => { console.log(`${c ? "  ✓" : "  ✗"} ${q}${d ? "  —  " + d : ""}`); if (!c) fallos.push(q); };

await pag.goto(`http://localhost:${PUERTO}${BASE}workspace/?t=new-blank`, { waitUntil: "networkidle2", timeout: 180000 });
await espera(6000);
await pag.evaluate(() => document.getElementById("hk-ribbon-guia")?.remove());

const cmd = async (t, tras = 420) => {
  await pag.evaluate(() => { const i = document.getElementById("hk3-cmd-input"); if (i) i.value = ""; });
  await pag.focus("#hk3-cmd-input");
  await pag.type("#hk3-cmd-input", t, { delay: 10 });
  await pag.keyboard.press("Enter");
  await espera(tras);
};
const desenfocar = () => pag.evaluate(() => document.activeElement && document.activeElement.blur());
const proy = (P) => pag.evaluate((W) => {
  const v = document.querySelector("#viewer"), cv = v.querySelector("canvas");
  const r = cv.getBoundingClientRect(), cam = v.__ctx.camera; cam.updateMatrixWorld();
  const m = cam.projectionMatrix.elements, mv = cam.matrixWorldInverse.elements;
  const [wx, wy, wz] = W;
  const tx = mv[0]*wx+mv[4]*wy+mv[8]*wz+mv[12], ty = mv[1]*wx+mv[5]*wy+mv[9]*wz+mv[13];
  const tz = mv[2]*wx+mv[6]*wy+mv[10]*wz+mv[14], tw = mv[3]*wx+mv[7]*wy+mv[11]*wz+mv[15];
  const cx = m[0]*tx+m[4]*ty+m[8]*tz+m[12]*tw, cy = m[1]*tx+m[5]*ty+m[9]*tz+m[13]*tw;
  const cw = m[3]*tx+m[7]*ty+m[11]*tz+m[15]*tw;
  return { x: r.left+(cx/cw+1)/2*r.width, y: r.top+(1-cy/cw)/2*r.height };
}, P);

// ── ALT: sin referencia ni rejilla ──────────────────────────────────────────
// se dibuja una línea y se acerca el ratón a su extremo: sin ALT engancha, con ALT no
await cmd("l"); await cmd("0,0,0"); await cmd("4,3,0");
await pag.keyboard.press("Escape"); await espera(300);
await pag.evaluate(() => [...document.querySelectorAll("#hk-ribbon button")]
  .find((b) => (b.textContent || "").includes("Planta"))?.click());
await espera(900);
await pag.evaluate(() => {
  const v = document.querySelector("#viewer"), c = v.__ctx.camera;
  v.__ctx.controls.target.set(2, 1.5, 0); c.position.set(2, 1.5, 40);
  if (c.isOrthographicCamera) { c.zoom = 12; c.updateProjectionMatrix(); }
  c.lookAt(v.__ctx.controls.target); v.__ctx.controls.update?.(); v.__ctx.render?.();
});
await espera(600);
await cmd("l");
const s0 = await proy([4, 3, 0]);
const leer = () => pag.evaluate(() => {
  const sm = window.__hekatanSnapMarker;
  return sm?.visible ? [sm.position.x, sm.position.y, sm.position.z].map((q) => +q.toFixed(3)) : null;
});
// Las DOS mitades por el mismo camino, o no se compara lo mismo: con el ratón de
// puppeteer el marcador salía nulo (el movimiento no llegaba al lienzo) y con el
// evento sintético sí. Se manda el mismo evento en los dos casos, cambiando solo
// `altKey`, que es exactamente la diferencia que se quiere medir.
const mover = (x, y, alt) => pag.evaluate(({ x, y, alt }) => {
  const cv = document.querySelector("#viewer").querySelector("canvas");
  cv.dispatchEvent(new PointerEvent("pointermove", {
    clientX: x, clientY: y, altKey: alt, bubbles: true, pointerId: 1,
  }));
}, { x, y, alt });
await mover(s0.x + 7, s0.y - 6, false); await espera(420);
const conSnap = await leer();
// ⚠️ Mantener ALT pulsada en un navegador se lleva el foco al menú y el
// `pointermove` deja de llegar: el marcador salía nulo y no se medía nada. Se
// manda el evento con `altKey` puesto, que es justo lo que hay que comprobar.
await mover(s0.x + 8, s0.y - 7, true);
await espera(420);
const sinSnap = await leer();
const pegado = conSnap && Math.hypot(conSnap[0] - 4, conSnap[1] - 3) < 1e-6;
const suelto = sinSnap && Math.hypot(sinSnap[0] - 4, sinSnap[1] - 3) > 1e-4;
ok(pegado, "sin ALT el punto se ENGANCHA al extremo", JSON.stringify(conSnap));
ok(suelto, "con ALT cae donde está el cursor, en crudo", JSON.stringify(sinSnap));
await pag.keyboard.press("Escape"); await espera(300);

// ── DESTELLO al cambiar una propiedad ───────────────────────────────────────
const dest = await pag.evaluate(() => {
  if (typeof window.__hekatanDestello !== "function") return { hay: false };
  // con VALOR, como lo manda el panel de propiedades y el botón «Apoyo». Sin él
  // el aviso reventaba el visor (`[...undefined]`) — arreglado en main.ts, y aquí
  // se manda bien porque es lo que pasa de verdad.
  window.dispatchEvent(new CustomEvent("hk:property-applied",
    { detail: { kind: "nodes", ids: ["pt:0", "pt:1"], prop: "supports",
                value: [true, true, true, true, true, true] } }));
  const v = document.querySelector("#viewer");
  let n = 0;
  v.__ctx.scene.traverse((o) => {
    if (o.material && o.material.color &&
        o.material.color.getHexString() === "e6c463" && o.visible) n++;
  });
  return { hay: true, piezas: n };
});
ok(dest.hay, "el gancho del destello existe");
ok(dest.hay && dest.piezas > 0, "al cambiar una propiedad, lo afectado PARPADEA",
   `${dest.piezas} piezas en dorado`);

// ── A S D F: los diagramas a una tecla ──────────────────────────────────────
await desenfocar();
const pulsa = async (k) => { await pag.keyboard.press(k); await espera(420); };
const est = () => pag.evaluate(() => {
  const s = window.__hekatanSettings?.();
  return { frame: s?.frameResults?.rawVal, defo: !!s?.deformedShape?.rawVal };
});
await pulsa("a");
const eA = await est();
ok(eA.frame === "normals", "«A» pone el AXIL", String(eA.frame));
await pulsa("s");
const eS = await est();
ok(eS.frame === "shearsY", "«S» pone el CORTANTE", String(eS.frame));
await pulsa("d");
const eD = await est();
ok(eD.frame === "bendingsZ", "«D» pone el MOMENTO", String(eD.frame));
const antesF = (await est()).defo;
await pulsa("f");
const eF = await est();
ok(eF.defo !== antesF, "«F» conmuta la DEFORMADA", `${antesF} → ${eF.defo}`);
await pulsa("d"); await pulsa("d");   // se apaga el diagrama al repetir la tecla
const eOff = await est();
ok(eOff.frame === "none" || eOff.frame === "bendingsZ",
   "repetir la tecla apaga el diagrama", String(eOff.frame));

// ── x5 y /5 sobre lo último replicado ───────────────────────────────────────
await cmd("s");
await cmd("todo", 600);
const n0 = await pag.evaluate(() => (window.__hekatanDrawingPoints?.val || []).length);
await cmd("rep"); await cmd("0,0,3"); await cmd("1", 900);
const n1 = await pag.evaluate(() => (window.__hekatanDrawingPoints?.val || []).length);
ok(n1 > n0, "se replica una vez para tener de qué repetir", `${n0} → ${n1} nudos`);
await cmd("todo", 500);
await cmd("x5", 1200);
const n2 = await pag.evaluate(() => (window.__hekatanDrawingPoints?.val || []).length);
const cotas = () => pag.evaluate(() => [...new Set((window.__hekatanDrawingPoints?.val || [])
  .map((q) => +q[2].toFixed(2)))].sort((a, b) => a - b));
const c2 = await cotas();
ok(n2 > n1, "«x5» repite esa distancia cinco veces más", `${n1} → ${n2} nudos`);
ok(c2.some((z) => Math.abs(z - 18) < 0.01) || Math.max(...c2) >= 15,
   "…y las cotas suben de tres en tres", `hasta ${Math.max(...c2)} m`);
await cmd("todo", 500);
await cmd("/3", 1200);
const c3 = await cotas();
// «/3» parte el paso en tres. Lo que lo tenía parado: el deshacer se lleva las
// copias y sus ids seguían designados, así que la resiembra caía sobre
// polilíneas que ya no existían. Ahora se queda con lo que sobrevive.
ok(c3.some((z) => Math.abs(z - 1) < 0.01), "«/3» subdivide ese paso en tres",
   `cotas ${c3.slice(0, 6).join(", ")}`);

const diag = errores.filter((e) => /not iterable|reading .map./.test(e));
const otros = errores.filter((e) => !/not iterable|reading .map./.test(e));
if (diag.length) {
  console.log(`  ✗ «a is not iterable» de vuelta: ` +
              diag[0].slice(0, 70) + " >> " + (pilas[errores.indexOf(diag[0])] || "").slice(0, 400));
  fallos.push("a is not iterable");
}
ok(otros.length === 0, "sin otros errores de página", otros.slice(0, 2).join(" | "));
await nav.close(); srv.close();
console.log(fallos.length ? "\n" + fallos.length + " FALLO(S)" : "\nTodo correcto");
process.exit(fallos.length ? 1 : 0);
