/**
 * El marcador del cursor tiene que verse IGUAL a cualquier zoom.
 *
 * Escalaba con la distancia a la cámara (`dist / 40`, tope 2.5). En perspectiva vale; en las vistas
 * PLANTA / FRENTE / LADO la cámara es ORTOGRÁFICA y el zoom no cambia la distancia —cambia
 * `camera.zoom`—, así que el marcador se quedaba del mismo tamaño en metros y crecía en pantalla
 * al acercar, tapando el punto que se iba a marcar. Arreglado el 8-sep-2026: se calculan los
 * metros que mide un píxel con la cámara de verdad (orto y perspectiva) y el marcador se fija a
 * 7 px de radio.
 *
 * Se mide el TAMAÑO APARENTE del marcador (su escala × su radio, pasado a píxeles) a tres zooms
 * muy distintos, en planta y en 3D.
 *
 *   node cli/ctl_cursor_tamano.mjs
 */
import puppeteer from "puppeteer";
import { readFileSync, existsSync, statSync } from "fs";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
const PUERTO = 4743;
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
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const fallos = [];
const ok = (cond, que, detalle = "") => {
  console.log(`${cond ? "  ✓" : "  ✗"} ${que}${detalle ? "  —  " + detalle : ""}`);
  if (!cond) fallos.push(que);
};
await pag.goto(`http://localhost:${PUERTO}${BASE}workspace/?t=new-blank`, { waitUntil: "networkidle2", timeout: 180000 });
await espera(6000);
await pag.evaluate(() => document.getElementById("hk-ribbon-guia")?.remove());

// el tamaño APARENTE del marcador de snap, en píxeles de pantalla
const radioPx = () => pag.evaluate(() => {
  const g = (window).__hekatanSnapMarker;
  const cam = document.querySelector("#viewer").__ctx.camera;
  if (!g) return null;
  const mpp = (window).__hekatanMetrosPorPixel?.(g.position);
  if (!mpp) return null;
  // el halo mide 0.015 m de radio con escala 1
  return { px: +((0.015 * g.scale.x) / mpp).toFixed(2), zoom: +(cam.zoom || 0).toFixed(3),
           orto: !!cam.isOrthographicCamera, escala: +g.scale.x.toFixed(4) };
});
const forzarUpdate = () => pag.evaluate(() => { const v = document.querySelector("#viewer"); v.__ctx.render?.(); });
// el GLIFO de referencia a objetos (el cuadrito de Punto final / Medio / Perpendicular):
// medio lado aparente, en píxeles. Se dibujaba con medio lado de 0.05 m EN EL MUNDO, así
// que crecía al acercar y se encogía al alejar — lo vio Jorge, no la prueba.
const glifoPx = () => pag.evaluate(() => {
  const om = (window).__hekatanOsnapMarkerRef;
  if (!om) return null;
  const mpp = (window).__hekatanMetrosPorPixel?.(om.position);
  if (!mpp) return null;
  return +((om.scale.x * 1) / mpp).toFixed(2);   // el cuadrado es unitario: medio lado = escala
});

for (const [vista, boton] of [["planta (ortográfica)", "Planta"], ["3D (perspectiva)", "3D"]]) {
  await pag.evaluate((b) => [...document.querySelectorAll("#hk-ribbon button")]
    .find((q) => (q.textContent || "").includes(b))?.click(), boton);
  await espera(1200);
  const medidas = [];
  // ALEJAR y acercar: hasta el 8-sep-2026 solo se probaba acercando (1, 4, 16) y el
  // tope de escala del marcador (`Math.min(60, s)`) solo salta ALEJANDO — Jorge lo vio
  // antes que la prueba.
  for (const z of [1 / 64, 1 / 8, 1, 4, 16]) {
    await pag.evaluate((f) => {
      const c = document.querySelector("#viewer").__ctx.camera;
      if (c.isOrthographicCamera) { c.zoom = f; c.updateProjectionMatrix(); }
      else { c.position.multiplyScalar(1 / Math.sqrt(f)); c.updateMatrixWorld(); }
    }, z);
    // el marcador solo se re-escala si está VISIBLE (como cuando el ratón está
    // sobre el lienzo): se enciende antes de pedir la actualización, que es el
    // mismo camino que sigue la rueda del ratón al hacer zoom
    await pag.evaluate(() => {
      const g = (window).__hekatanSnapMarker; if (g) g.visible = true;
      (window).__hekatanUpdateSnapScale?.();
    });
    await forzarUpdate(); await espera(400);
    const r = await radioPx();
    if (r) medidas.push({ z, ...r });
  }
  if (medidas.length < 5) { ok(false, `${vista}: se puede medir el marcador`); continue; }
  const px = medidas.map((m) => m.px);
  const disp = (Math.max(...px) - Math.min(...px)) / Math.max(...px) * 100;
  console.log(`   ${vista}: ${medidas.map((m) => `zoom×${(+m.z).toFixed(4).replace(/0+$/, "")} → ${m.px}px`).join(" · ")}`);
  ok(disp < 15, `${vista}: el marcador se ve IGUAL a cualquier zoom`, `dispersión ${disp.toFixed(1)} % (antes crecía con el zoom)`);
  ok(px.every((q) => q > 0.8 && q < 4), `${vista}: y fino, que deje ver el punto (1–4 px)`, `${px.join(", ")} px`);
}
// ── EL GLIFO DE REFERENCIA A OBJETOS, a cinco zooms, en las dos cámaras ──────
for (const [vista, boton] of [["planta (ortográfica)", "Planta"], ["3D (perspectiva)", "3D"]]) {
  await pag.evaluate((b) => [...document.querySelectorAll("#hk-ribbon button")]
    .find((q) => (q.textContent || "").includes(b))?.click(), boton);
  await espera(1000);
  const px = [];
  for (const z of [1 / 64, 1 / 8, 1, 4, 16]) {
    await pag.evaluate((f) => {
      const c = document.querySelector("#viewer").__ctx.camera;
      if (c.isOrthographicCamera) { c.zoom = f; c.updateProjectionMatrix(); }
      else { c.position.multiplyScalar(1 / Math.sqrt(f)); c.updateMatrixWorld(); }
    }, z);
    await pag.evaluate(() => {
      const om = (window).__hekatanOsnapMarkerRef;
      if (om) { om.visible = true; om.position.set(0, 0, 0); }
      (window).__hekatanUpdateOsnapScale?.();
    });
    await forzarUpdate(); await espera(250);
    const r = await glifoPx();
    if (r != null) px.push(r);
  }
  if (px.length < 5) { ok(false, `${vista}: se puede medir el glifo de referencia`); continue; }
  const disp = (Math.max(...px) - Math.min(...px)) / Math.max(...px) * 100;
  console.log(`   ${vista} · glifo: ${px.join(", ")} px`);
  ok(disp < 5, `${vista}: el GLIFO de referencia también se ve igual a cualquier zoom`,
     `dispersión ${disp.toFixed(1)} % (era 0.05 m del mundo: crecía al acercar)`);
  ok(px.every((q) => q >= 3 && q <= 6), `${vista}: y con el medio lado que toca (3–6 px)`, `${px.join(", ")} px`);
}

await nav.close(); srv.close();
console.log(fallos.length ? `\n${fallos.length} FALLO(S)` : "\nTodo correcto");
process.exit(fallos.length ? 1 : 0);
