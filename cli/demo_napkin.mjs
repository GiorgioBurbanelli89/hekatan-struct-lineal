/**
 * DEMOSTRACIÓN de lo que se trajo del cuaderno Napkin — SOLO CON EL CURSOR.
 *
 * Ni una orden tecleada: botones del ribbon, clics en el lienzo y los mandos del
 * panel, que es como se dibuja de verdad. Levanta una planta, la sube siete veces,
 * pone apoyos y cargas —y se ve el DESTELLO dorado de lo que cambia— y enciende los
 * diagramas con A S D F.
 *
 * Deja los fotogramas en `cli/shots/napkin/` para mirarlos y montar el GIF.
 *
 *   node cli/demo_napkin.mjs
 */
import puppeteer from "puppeteer";
import { readFileSync, existsSync, statSync, mkdirSync, rmSync } from "fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "shots", "napkin");
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
const PUERTO = 4768;
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
const W = 1500, H = 940;
await pag.setViewport({ width: W, height: H });
const consola = []; pag.on("console", (m) => consola.push(m.text()));
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
let k = 0, CLICS = 0;
const foto = async (n = 1) => {
  for (let i = 0; i < n; i++)
    await pag.screenshot({ path: join(OUT, `f${String(k++).padStart(3, "0")}.png`) });
};

await pag.goto(`http://localhost:${PUERTO}${BASE}workspace/?t=new-blank`, { waitUntil: "networkidle2", timeout: 180000 });
await espera(6000);
// Fuera los dos paneles laterales: no se toca ninguno (todo sale del ribbon) y
// entre los dos se comían 620 px de los 1500 — el edificio quedaba en un hilo.
await pag.evaluate(() => {
  for (const id of ["hk-ribbon-guia", "settings", "hk-pane-host"])
    document.getElementById(id)?.remove();
});

// ⚠️ El amortiguado de OrbitControls. Poniendo la cámara a mano y llamando a
// `update()`, los controles la van devolviendo poco a poco a lo suyo: las primeras
// capturas de cada encuadre salían con el edificio el doble de grande, y tres
// segundos después ya no. Se apaga y la cámara se queda donde se la deja.
await pag.evaluate(() => {
  const c = document.querySelector("#viewer").__ctx.controls;
  if (c) { c.enableDamping = false; c.update?.(); }
});

// El rótulo de cada paso, para que el GIF se entienda solo.
await pag.evaluate(() => {
  const r = document.createElement("div");
  r.id = "hk-rotulo";
  // arriba a la izquierda: abajo se pisaba con la línea de estado del CAD
  r.style.cssText = "position:fixed;left:26px;top:56px;z-index:99999;color:#e6c463;" +
    "font:600 20px ui-monospace,Consolas,monospace;letter-spacing:.5px;" +
    "text-shadow:0 1px 3px #000;pointer-events:none";
  document.body.appendChild(r);
});
const rotulo = (t) => pag.evaluate((t) => { document.getElementById("hk-rotulo").textContent = t; }, t);

// ── SOLO RATÓN ───────────────────────────────────────────────────────────────
/**
 * Pulsa un boton por su texto. Dos guardas que costaron una tanda entera:
 *   - manda el del RIBBON: en el panel de la derecha hay otro "Apoyos" que es un
 *     interruptor de dibujo, no la herramienta;
 *   - y tiene que estar DENTRO de la ventana. El del panel salia en y = 2244, fuera
 *     de la pantalla: el clic se iba al vacio y nadie avisaba. Los cuatro apoyos se
 *     quedaron sin poner por esto, y el modelo salio "SIN resolver".
 */
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
  if (!c) { console.log("  x no se ve el boton: " + txt); return false; }
  await pag.mouse.click(c.x, c.y); CLICS++;
  await espera(ms);
  return true;
};
/** Coordenada del mundo → píxel del lienzo. */
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
/** Clic en un punto del mundo. Avisa si cae debajo de un panel (y no clica). */
const clicMundo = async (P, ms = 380) => {
  const c = await proy(P);
  const tapado = await pag.evaluate((q) => {
    const e = document.elementFromPoint(q.x, q.y); return e ? e.tagName !== "CANVAS" : true;
  }, c);
  if (tapado) { console.log(`  ✗ (${P.join(",")}) cae bajo un panel`); return false; }
  await pag.mouse.move(c.x, c.y, { steps: 6 });
  await espera(150);
  await pag.mouse.click(c.x, c.y); CLICS++;
  await espera(ms);
  return true;
};
/** Escribe en una casilla del ribbon, buscada por su ayuda emergente. */
const campoRibbon = async (title, valor) => {
  const c = await pag.evaluate((t) => {
    const i = [...document.querySelectorAll("#hk-ribbon input")]
      .find((e) => (e.title || "").toLowerCase().includes(t.toLowerCase()));
    if (!i) return null;
    const r = i.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }, title);
  if (!c) { console.log("  x no se ve la casilla: " + title); return false; }
  await pag.mouse.click(c.x, c.y, { clickCount: 3 }); CLICS++;
  await pag.keyboard.type(String(valor));
  await pag.keyboard.press("Enter");
  await espera(500);
  return true;
};
const modelo = () => pag.evaluate(() => {
  const p = window.__hekatanDrawingPoints?.val || [];
  return { nudos: p.length,
           cotas: [...new Set(p.map((q) => +q[2].toFixed(2)))].sort((a, b) => a - b) };
});

// ── La cámara: el modelo, en la franja LIBRE ────────────────────────────────
// El ribbon (850×192) flota sobre el lienzo arriba al centro y la línea de órdenes
// abajo, así que el hueco de verdad es la banda de en medio. Se pone el modelo AHÍ
// a propósito, no en el centro del lienzo, o los clics de arriba caen sobre el
// ribbon y no llegan al dibujo.
const BANDA = { x: W / 2, y: 245 + (H - 245 - 110) / 2 };
/** Vista en planta con `alto` metros de alto útil y (cx,cy) en la banda libre. */
const mirarPlanta = (cx, cy, alto) => pag.evaluate(({ cx, cy, alto, BX, BY }) => {
  const v = document.querySelector("#viewer"), cam = v.__ctx.camera, cv = v.querySelector("canvas");
  const r = cv.getBoundingClientRect();
  cam.up.set(0, 1, 0);
  if (cam.isOrthographicCamera) { cam.zoom = (cam.top - cam.bottom) / alto; cam.updateProjectionMatrix(); }
  const mpp = cam.isOrthographicCamera
    ? (cam.top - cam.bottom) / cam.zoom / r.height
    : (2 * 60 * Math.tan(((cam.fov ?? 45) * Math.PI) / 360)) / r.height;
  const dx = (BX - (r.left + r.width / 2)) * mpp, dy = (BY - (r.top + r.height / 2)) * mpp;
  const tx = cx - dx, ty = cy + dy;
  v.__ctx.controls.target.set(tx, ty, 0);
  cam.position.set(tx, ty, 60);
  cam.lookAt(v.__ctx.controls.target); v.__ctx.controls.update?.(); v.__ctx.render?.();
  return { mpp: +mpp.toFixed(4) };
}, { cx, cy, alto, BX: BANDA.x, BY: BANDA.y });
/**
 * Vista 3D encuadrada, también en la banda libre. Con `foco` se mira un trozo
 * concreto — hace falta para la cubierta: encuadrando el edificio ENTERO, su
 * remate cae arriba del todo, justo debajo del ribbon, y los clics no llegan al
 * lienzo (los cuatro salían «cae bajo un panel»).
 */
const mirar3D = (margen = 1.05, foco = null) => pag.evaluate(({ margen, foco, BX, BY }) => {
  const P = (window.__hekatanDrawingPoints?.val || []);
  if (!P.length) return null;
  const mn = [1e9, 1e9, 1e9], mx = [-1e9, -1e9, -1e9];
  for (const p of P) for (let i = 0; i < 3; i++) { mn[i] = Math.min(mn[i], p[i]); mx[i] = Math.max(mx[i], p[i]); }
  const c = foco ? foco.c : mn.map((v, i) => (v + mx[i]) / 2);
  const rad = foco ? foco.rad : Math.max(0.5, Math.hypot(...mn.map((v, i) => (mx[i] - v) / 2)));
  const v = document.querySelector("#viewer"), cam = v.__ctx.camera;
  const cv = v.querySelector("canvas"), r = cv.getBoundingClientRect();
  const fv = ((cam.fov ?? 45) * Math.PI) / 360, fh = Math.atan(Math.tan(fv) * (r.width / r.height));
  const d = (rad * margen) / Math.sin(Math.min(fv, fh));
  cam.up.set(0, 0, 1);
  v.__ctx.controls.target.set(c[0], c[1], c[2]);
  cam.position.set(c[0] + d * 0.58, c[1] - d * 0.74, c[2] + d * 0.34);
  if (cam.isOrthographicCamera) { cam.zoom = 1; cam.updateProjectionMatrix(); }
  cam.lookAt(v.__ctx.controls.target);
  // y ahora se corre la cámara para que el modelo caiga en la banda libre
  cam.updateMatrixWorld();
  const e = cam.matrixWorld.elements;
  const der = [e[0], e[1], e[2]], arr = [e[4], e[5], e[6]];
  const mpp = (2 * d * Math.tan(fv)) / r.height;
  const dx = (BX - (r.left + r.width / 2)) * mpp, dy = (BY - (r.top + r.height / 2)) * mpp;
  const s = [-der[0] * dx + arr[0] * dy, -der[1] * dx + arr[1] * dy, -der[2] * dx + arr[2] * dy];
  cam.position.set(cam.position.x + s[0], cam.position.y + s[1], cam.position.z + s[2]);
  v.__ctx.controls.target.set(c[0] + s[0], c[1] + s[1], c[2] + s[2]);
  cam.lookAt(v.__ctx.controls.target); v.__ctx.controls.update?.(); v.__ctx.render?.();
  return { rad: +rad.toFixed(2), d: +d.toFixed(2) };
}, { margen, foco, BX: BANDA.x, BY: BANDA.y });

// ═══ 1 · LA PLANTA, con el RECTÁNGULO: dos clics ═════════════════════════════
await pulsar("Planta", 1100);
await mirarPlanta(3, -2.5, 11);
await rotulo("1 · el contorno de la planta: dos clics");
await espera(500); await foto(3);
await pulsar("Rect");
await clicMundo([0, 0, 0]);
await clicMundo([6, -5, 0], 700);
await pag.keyboard.press("Escape"); await espera(300);
await foto(4);
const m1 = await modelo();

// ═══ 2 · LAS COLUMNAS: un clic en cada esquina ══════════════════════════════
await rotulo("2 · columnas: un clic en cada esquina (3 m por defecto)");
await foto(2);
await pulsar("Columna");
const ESQ = [[0, 0, 0], [6, 0, 0], [6, -5, 0], [0, -5, 0]];
for (const P of ESQ) { await clicMundo(P, 420); await foto(); }
await pag.keyboard.press("Escape"); await espera(300);
await foto(3);
const m2 = await modelo();

// ═══ 3 · APOYOS: botón y clic en los cuatro nudos de la base ════════════════
// El destello dorado avisa de que la propiedad LLEGÓ. Es del cuaderno Napkin: se
// edita encima del objeto y el objeto contesta.
await rotulo("3 · apoyos: lo aplicado PARPADEA en dorado");
await foto(2);
await pulsar("Apoyo");
for (const P of ESQ) { await clicMundo(P, 200); await foto(2); }
await espera(500); await foto(2);

// ═══ 4 · SUBIR: la planta se hace edificio desde el propio ribbon ══════════
// «⇈ Subir» es el Replicate Linear de ETABS y, sin nada designado, sube TODO —
// que es lo que se quiere el 90 % de las veces. Ni ventana de designación ni panel.
await rotulo("4 · ribbon: subir 6 pisos de 3 m");
await foto(2);
const nPisos = await campoRibbon("Cuantos pisos", 6);
await foto(2);
await pulsar("Subir", 1600);
const m3 = await modelo();
await pulsar("3D", 900);
await mirar3D(1.15);
await espera(700); await foto(8);

// ═══ 5 · CARGA en la cubierta, subiendo el PLANO DE TRABAJO ════════════════
// Un clic no puede coger un nudo que no está en el plano de trabajo: el rayo cae
// en el plano y el nudo de la cubierta queda a 21 m de ahí. Por eso el ribbon
// tiene la casilla «Cota Z» — se sube el plano a la cubierta y ya se clica.
const zTop = m3.cotas.slice(-1)[0];
await rotulo("5 · cota Z = " + zTop + " m: el plano de trabajo sube a la cubierta");
await foto(2);
const cota = await campoRibbon("Cota Z", zTop);
await mirarPlanta(3, -2.5, 13);
await espera(500); await foto(3);
await rotulo("6 · carga: clic en los cuatro nudos de la cubierta");
await pulsar("Carga");
let cargados = 0;
const quien = [];
for (const [x, y] of [[0, 0], [6, 0], [6, -5], [0, -5]]) {
  if (await clicMundo([x, y, zTop], 260)) cargados++;
  quien.push(await pag.evaluate(() => window.__hekatanManualLoads?.size ?? -1));
  await foto(2);
}
await espera(400); await foto(2);
await pag.keyboard.press("Escape"); await espera(300);
await pag.evaluate(() => document.activeElement && document.activeElement.blur());
await espera(1500);
await pulsar("3D", 900);
await mirar3D(1.15);            // 0.80 y 0.95 recortaban la cabeza del edificio
await espera(600); await foto(3);

// ═══ 7 · A S D F: los diagramas a una tecla ════════════════════════════════
// El tamaño del diagrama es `0.05 · gridSize · displayScale` (frameResults.ts): con
// la rejilla de 20 m y la escala de fábrica tapa el edificio. Se baja para que se
// lea la FORMA, que es de lo que va esto.
// Ya NO se toca el tamaño del diagrama: desde el 9-sep va con la diagonal del
// modelo (`frameResults.ts`), no con la rejilla, así que sale bien de fábrica. Lo
// único que se sube es la deformada: aquí la carga es toda vertical —es lo que pone
// el botón CARGA— y sin amplificar no se ve el acortamiento de las columnas.
const escala = await pag.evaluate(() => {
  const s = window.__hekatanSettings?.();
  if (s?.deformScale) s.deformScale.val = 300;
  return { rejilla: s?.gridSize?.rawVal ?? null, mando: s?.displayScale?.rawVal ?? null };
});
const NOM = { a: "7 · «A» axil", s: "8 · «S» cortante", d: "9 · «D» momento" };
// ⚠️ Se vuelve a encuadrar ANTES de cada foto: al encender un diagrama el
// workspace rehace el modelo y con eso se re-encuadra solo, así que el axil salía
// con un encuadre y el momento con otro. Se fija el mismo para los cuatro.
for (const t of ["a", "s", "d"]) {
  await rotulo(NOM[t]);
  await pag.keyboard.press(t);
  await espera(1200);
  await mirar3D(1.15);
  await espera(400);
  await foto(6);
}
await rotulo("10 · «F» deformada (x300)");
await pag.keyboard.press("f"); await espera(1200);
// «F» CONMUTA: si venía encendida, esa pulsación la apaga. Se mira y se corrige.
const defOn = await pag.evaluate(() => !!window.__hekatanSettings?.()?.deformedShape?.rawVal);
if (!defOn) { await pag.keyboard.press("f"); await espera(1200); }
await mirar3D(1.15);
await espera(400); await foto(8);

const m4 = await modelo();
const solve = consola.filter((t) => /\[NewBlank\]/.test(t)).slice(-1)[0] || "SIN resolver";
const puestos = await pag.evaluate(() => ({
  apoyos: window.__hekatanManualSupports?.size ?? -1,
  cargas: window.__hekatanManualLoads?.size ?? -1,
}));
console.log("fotogramas:", k, "· clics de ratón:", CLICS);
console.log("planta:", m1.nudos, "nudos · con columnas:", m2.nudos, "· replicado:", m3.nudos);
console.log("casillas del ribbon (pisos / cota Z):", nPisos, "/", cota);
console.log("cargas puestas a clic:", cargados, "en la cota", zTop, "m · el mapa iba", quien.join(" -> "));
console.log("cotas:", m4.cotas.join(", "));
console.log("apoyos/cargas guardados:", puestos.apoyos, "/", puestos.cargas);
console.log("rejilla:", escala.rejilla, "m · displayScale de fabrica:", escala.mando);
console.log("solver:", solve);
await nav.close(); srv.close();
