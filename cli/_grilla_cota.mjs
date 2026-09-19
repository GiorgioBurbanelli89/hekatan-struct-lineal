/**
 * ¿SE PUEDE DIBUJAR A UNA COTA QUE NO SEA 0?
 *
 * Jorge: «hay por defecto una grilla, pero necesitamos grillas auxiliares cuando
 * queramos; ubico una altura y allí no hay con qué referenciarse».
 *
 * Se mide, con el ratón y los botones, exactamente eso:
 *   1. poner «Cota Z = 3.20» en la cinta   → ¿mueve la vista? (no debería: ETABS/AutoCAD no la mueven)
 *   2. ¿queda rejilla VISIBLE a esa cota, y es la brillante?
 *   3. dibujar un rectángulo con dos clics → ¿los nudos caen en z = 3.20?
 *   4. con SNAP (F9), ¿caen además en cruce de rejilla?
 *
 *   node cli/_grilla_cota.mjs
 */
import puppeteer from "puppeteer";
import { readFileSync, existsSync, statSync, mkdirSync } from "fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "shots", "grilla_cota"); mkdirSync(OUT, { recursive: true });
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
const PUERTO = 4763;
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
await pag.setViewport({ width: 1500, height: 950 });
const errores = []; pag.on("pageerror", (e) => errores.push(e.message));
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const fallos = [];
const ok = (c, q, d = "") => { console.log((c ? "  OK  " : "  --  ") + q + (d ? "  |  " + d : "")); if (!c) fallos.push(q); };

await pag.goto(`http://localhost:${PUERTO}${BASE}workspace/?t=new-blank`, { waitUntil: "networkidle2", timeout: 180000 });
await espera(6000);
await pag.evaluate(() => document.getElementById("hk-ribbon-guia")?.remove());

const COTA = 3.2;

const pulsar = async (txt, ms = 700) => {
  const c = await pag.evaluate((t) => {
    const b = [...document.querySelectorAll("#hk-ribbon button, .tp-btnv_b, button")]
      .filter((e) => e.offsetParent !== null && (e.textContent || "").includes(t))[0];
    if (!b) return null;
    const r = b.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }, txt);
  if (!c) return false;
  await pag.mouse.click(c.x, c.y);
  await espera(ms);
  return true;
};
const camara = () => pag.evaluate(() => {
  const v = document.querySelector("#viewer"), c = v.__ctx.camera, t = v.__ctx.controls.target;
  return [c.position.x, c.position.y, c.position.z, t.x, t.y, t.z].map((q) => +q.toFixed(3));
});
const proy = (P) => pag.evaluate((W) => {
  const v = document.querySelector("#viewer"), cv = v.querySelector("canvas");
  const r = cv.getBoundingClientRect(), cam = v.__ctx.camera; cam.updateMatrixWorld();
  const m = cam.projectionMatrix.elements, mv = cam.matrixWorldInverse.elements;
  const [wx, wy, wz] = W;
  const tx = mv[0]*wx + mv[4]*wy + mv[8]*wz + mv[12], ty = mv[1]*wx + mv[5]*wy + mv[9]*wz + mv[13];
  const tz = mv[2]*wx + mv[6]*wy + mv[10]*wz + mv[14], tw = mv[3]*wx + mv[7]*wy + mv[11]*wz + mv[15];
  const cx = m[0]*tx + m[4]*ty + m[8]*tz + m[12]*tw, cy = m[1]*tx + m[5]*ty + m[9]*tz + m[13]*tw;
  const cw = m[3]*tx + m[7]*ty + m[11]*tz + m[15]*tw;
  return { x: r.left + (cx / cw + 1) / 2 * r.width, y: r.top + (1 - cy / cw) / 2 * r.height };
}, P);
const clicMundo = async (P, ms = 420) => {
  const c = await proy(P);
  await pag.mouse.move(c.x, c.y, { steps: 4 }); await espera(140);
  await pag.mouse.click(c.x, c.y); await espera(ms);
};
const puntos = () => pag.evaluate(() => (window.__hekatanDrawingPoints?.rawVal ?? []).map((p) => p.map((q) => +q.toFixed(3))));

// ── 1. La cota, por el campo de la cinta (ratón + teclado) ────────────────
const camAntes = await camara();
const campo = await pag.evaluate(() => {
  const i = [...document.querySelectorAll("#hk-ribbon input")]
    .find((e) => (e.title || "").includes("Cota Z"));
  if (!i) return null;
  const r = i.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
});
ok(!!campo, "la cinta tiene el campo «Cota Z»");
if (campo) {
  await pag.mouse.click(campo.x, campo.y, { clickCount: 3 });
  await pag.keyboard.type(String(COTA));
  await pag.keyboard.press("Enter");
  await espera(900);
}
const wz = await pag.evaluate(() => window.__hekatanCadState?.get?.()?.workZ);
ok(Math.abs((wz ?? 0) - COTA) < 1e-6, `la cota de trabajo queda en ${COTA} m`, "workZ = " + wz);

const camDespues = await camara();
const movio = camAntes.some((v, i) => Math.abs(v - camDespues[i]) > 0.01);
ok(!movio, "poner la cota NO reencuadra la vista (ETABS/AutoCAD no la mueven)",
   movio ? camAntes.join(",") + "  →  " + camDespues.join(",") : "cámara quieta");

// ── 2. ¿Hay rejilla a esa cota? ───────────────────────────────────────────
const rejillas = await pag.evaluate(() => {
  const v = document.querySelector("#viewer");
  const out = [];
  v.__ctx.scene.traverse((o) => {
    if (typeof o.name === "string" && o.name.startsWith("hekatan-grid")) {
      let op = null;
      o.traverse((c) => { if (c.material && op === null) op = c.material.opacity ?? 1; });
      out.push({ nombre: o.name, z: +o.position.z.toFixed(3), visible: o.visible, opacidad: op });
    }
  });
  return out;
});
console.log("       rejillas en escena: " + JSON.stringify(rejillas));
const enCota = rejillas.find((r) => Math.abs(r.z - COTA) < 1e-3);
ok(!!enCota, `hay una rejilla dibujada a z = ${COTA} m`, enCota ? JSON.stringify(enCota) : "ninguna");

// ── 3. Dibujar allí, con SNAP, y ver dónde caen los nudos ─────────────────
await pag.evaluate(() => { window.__hekatanSnapEnabled = true; });
ok(await pulsar("Rect"), "el botón RECTÁNGULO responde");
await clicMundo([2, 2, COTA]);
await clicMundo([8, 6, COTA], 700);
await pag.keyboard.press("Escape"); await espera(400);
const P = await puntos();
console.log("       nudos: " + JSON.stringify(P));
const enZ = P.length > 0 && P.every((p) => Math.abs(p[2] - COTA) < 0.02);
ok(enZ, `los nudos dibujados caen en la cota ${COTA}`, P.map((p) => p[2]).join(" · "));
const paso = await pag.evaluate(() => window.__hekatanGridConfig?.minorStep ?? null);
const enCruce = P.length > 0 && P.every((p) =>
  Math.abs(p[0] / paso - Math.round(p[0] / paso)) < 1e-3 && Math.abs(p[1] / paso - Math.round(p[1] / paso)) < 1e-3);
ok(enCruce, "y con SNAP caen en cruce de rejilla", "paso " + paso + " m");

await pag.screenshot({ path: join(OUT, "01_cota_" + COTA + ".png") });

// ── 4. GRILLA AUXILIAR: dejarla puesta y volver a la cota 0 ───────────────
const bAux = await pag.evaluate(() => {
  const b = [...document.querySelectorAll("#hk-ribbon button")]
    .find((e) => (e.title || "").includes("grilla auxiliar"));
  if (!b) return null;
  const r = b.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
});
ok(!!bAux, "la cinta tiene el botón «▦+» de grilla auxiliar");
if (bAux) { await pag.mouse.click(bAux.x, bAux.y); await espera(700); }
const niveles = await pag.evaluate(() => (window.__hekatanLevels ?? []).map((l) => ({ z: l.z, tipo: l.tipo })));
ok(niveles.some((l) => Math.abs(l.z - COTA) < 1e-6), "queda un nivel auxiliar a esa cota", JSON.stringify(niveles));

// volver a la cota 0 y comprobar que la grilla de 3.2 SIGUE ahí
if (campo) {
  await pag.mouse.click(campo.x, campo.y, { clickCount: 3 });
  await pag.keyboard.type("0"); await pag.keyboard.press("Enter"); await espera(900);
}
const rej2 = await pag.evaluate(() => {
  const out = []; document.querySelector("#viewer").__ctx.scene.traverse((o) => {
    if (typeof o.name === "string" && o.name.startsWith("hekatan-grid")) out.push(+o.position.z.toFixed(3));
  });
  return out.sort((a, b) => a - b);
});
ok(rej2.some((z) => Math.abs(z - COTA) < 1e-3),
   `con el plano de trabajo en 0, la grilla de ${COTA} m SIGUE puesta`, "cotas con grilla: " + rej2.join(" · "));

// ── 5. ¿El OSNAP engancha a un cruce de la grilla auxiliar? ───────────────
// Se apunta al cruce (5, 3, COTA) estando el plano de trabajo en Z = 0.
const q = await proy([5, 3, COTA]);
await pag.mouse.move(q.x, q.y, { steps: 6 }); await espera(500);
const enganche = await pag.evaluate(() => window.__hekatanOsnapUltimo ?? null);
console.log("       osnap bajo el cursor: " + JSON.stringify(enganche));
const pegó = !!enganche && Math.abs((enganche.z ?? 0) - COTA) < 0.05
          && Math.abs(enganche.x - 5) < 0.51 && Math.abs(enganche.y - 3) < 0.51;
ok(pegó, `el OSNAP engancha a un cruce de la grilla auxiliar (z = ${COTA}) desde la cota 0`,
   JSON.stringify(enganche));
await pag.screenshot({ path: join(OUT, "02_grilla_aux.png") });
ok(errores.length === 0, "sin errores de página", errores.slice(0, 2).join(" | "));
await nav.close(); srv.close();
console.log(fallos.length ? "\n" + fallos.length + " FALLO(S)" : "\nTodo correcto");
process.exit(fallos.length ? 1 : 0);
