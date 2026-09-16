// GRILLAS AUXILIARES, EN VIVO: qué se puede hacer HOY en Hekatan Struct con el
// cursor y los botones, sin teclear coordenadas.
//
//   planta baja en cota 0  →  Cota Z = 3 (la vista NO se mueve)  →  ▦+ deja la
//   grilla auxiliar puesta  →  se dibuja el piso 1 enganchando a SUS cruces,
//   desde la misma vista 3D  →  se designa con ventana y se replica hacia arriba.
//
// Fotogramas PNG numerados + GIF. Contra el BUILD LOCAL (sin publicar nada).
//   node cli/_grillas_en_vivo.mjs
import puppeteer from "puppeteer";
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = join(__dirname, "shots", "grillas_vivo");
fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
const BASE = "/hekatan-struct-lineal/";
const raiz = join(__dirname, "..", "website", "src", "examples");
const PUERTO = 4765;
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".wasm": "application/wasm", ".json": "application/json", ".svg": "image/svg+xml",
  ".png": "image/png", ".ico": "image/x-icon", ".woff2": "font/woff2" };
const srv = createServer((req, res) => {
  let p = decodeURIComponent((req.url || "/").split("?")[0]);
  if (p.startsWith(BASE)) p = p.slice(BASE.length - 1);
  let f = join(raiz, p);
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = join(f, "index.html");
  if (!fs.existsSync(f)) { res.writeHead(404); return res.end("404"); }
  res.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" });
  res.end(fs.readFileSync(f));
});
await new Promise((r) => srv.listen(PUERTO, r));

const nav = await puppeteer.launch({ headless: "new",
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--enable-webgl"] });
const pag = await nav.newPage();
await pag.setViewport({ width: 1400, height: 860 });
const esp = (ms) => new Promise((r) => setTimeout(r, ms));
const errores = []; pag.on("pageerror", (e) => errores.push(String(e).slice(0, 200)));
await pag.goto(`http://localhost:${PUERTO}${BASE}workspace/?t=new-blank`, { waitUntil: "networkidle2", timeout: 180000 });
await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 });
await esp(5000);
await pag.evaluate(() => document.getElementById("hk-ribbon-guia")?.remove());
await pag.keyboard.press("Escape"); await esp(400);

// cursor + cartel, como en _cercha_en_vivo.mjs
await pag.evaluate(() => {
  const c = document.createElement("div"); c.id = "vivo-cursor";
  c.innerHTML = '<svg width="26" height="34" viewBox="0 0 26 34"><path id="vivo-flecha" d="M1 1 L1 27 L8 20 L13 32 L18 30 L13 18 L23 18 Z" fill="#fff" stroke="#000" stroke-width="1.6"/></svg>';
  c.style.cssText = "position:fixed;left:0;top:0;z-index:2147483647;pointer-events:none;";
  const aro = document.createElement("div"); aro.id = "vivo-aro";
  aro.style.cssText = "position:fixed;width:34px;height:34px;margin:-17px 0 0 -17px;border:3px solid #ff2d55;border-radius:50%;z-index:2147483646;pointer-events:none;display:none;";
  const nota = document.createElement("div"); nota.id = "vivo-nota";
  nota.style.cssText = "position:fixed;left:50%;bottom:110px;transform:translateX(-50%);z-index:2147483647;pointer-events:none;" +
    "background:rgba(15,23,42,.95);color:#facc15;border:2px solid #facc15;border-radius:8px;padding:8px 18px;font:600 19px system-ui;";
  document.body.append(c, aro, nota);
  window.__vivo = (x, y, rojo) => { c.style.left = x + "px"; c.style.top = y + "px";
    document.getElementById("vivo-flecha").setAttribute("fill", rojo ? "#ff2d55" : "#fff");
    aro.style.display = rojo ? "block" : "none"; aro.style.left = x + "px"; aro.style.top = y + "px"; };
  window.__vivoNota = (t) => { const n = document.getElementById("vivo-nota"); n.textContent = t; n.style.display = t ? "block" : "none"; };
});
let cur = { x: 700, y: 450 }, n = 0;
const foto = async (nombre) => { await esp(220); await pag.screenshot({ path: `${out}/${String(n++).padStart(3, "0")}_${nombre}.png` }); };
const nota = (t) => pag.evaluate((t) => window.__vivoNota(t), t);
const mover = async (x, y, pasos = 10) => {
  for (let i = 1; i <= pasos; i++) {
    const px = cur.x + (x - cur.x) * i / pasos, py = cur.y + (y - cur.y) * i / pasos;
    await pag.mouse.move(px, py); await pag.evaluate((q) => window.__vivo(q.x, q.y, false), { x: px, y: py }); await esp(18);
  }
  cur = { x, y };
};
const clic = async (x, y, nombre) => {
  await mover(x, y); await pag.evaluate((q) => window.__vivo(q.x, q.y, true), { x, y });
  await pag.mouse.click(x, y); await esp(240); if (nombre) await foto(nombre);
  await pag.evaluate((q) => window.__vivo(q.x, q.y, false), { x, y });
};
// ⚠️ `offsetParent !== null` NO basta: un panel lateral cerrado se aparta con un
// `transform`, así que sus botones siguen contando como visibles pero caen FUERA
// de la ventana (medido: «▭ Rectángulo» del panel en x = 1631 con ancho 1400) y el
// clic se pierde sin que nada falle. Hay que exigir que el centro esté en pantalla,
// y mirar primero en la cinta.
const boton = (re) => pag.evaluate((re) => {
  const dentro = (e) => {
    const r = e.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    return r.width > 0 && r.height > 0 && x >= 0 && y >= 0 &&
           x <= window.innerWidth && y <= window.innerHeight ? { x, y } : null;
  };
  const rx = new RegExp(re);
  const cinta = [...document.querySelectorAll("#hk-ribbon button")];
  const resto = [...document.querySelectorAll("button")].filter((e) => !cinta.includes(e));
  for (const e of [...cinta, ...resto])
    if (e.offsetParent !== null && rx.test((e.textContent || "").trim())) {
      const q = dentro(e); if (q) return q;
    }
  return null;
}, re);
const cinta = async (re, texto, nombre) => {
  const b = await boton(re); if (!b) throw new Error("no está el botón " + re);
  await nota(texto); await clic(b.x, b.y, nombre);
};
const proj = (P) => pag.evaluate((P) => {
  const h = document.querySelector("#viewer"), c = h.__ctx;
  const r = h.querySelector("canvas").getBoundingClientRect();
  const V = Object.getPrototypeOf(c.camera.position).constructor;
  return P.map(([x, y, z]) => { const v = new V(x, y, z).project(c.camera);
    return { x: (v.x * 0.5 + 0.5) * r.width + r.left, y: (-v.y * 0.5 + 0.5) * r.height + r.top }; });
}, P);
const clicMundo = async (p, nombre) => { const [q] = await proj([p]); await clic(q.x, q.y, nombre); };
const dom = () => pag.evaluate(() => ({
  nudos: (window.__hekatanDrawingPoints?.rawVal ?? []).length,
  tramos: (window.__hekatanDrawingPolylines?.rawVal ?? []).reduce((s, p) => s + Math.max(0, p.length - 1), 0),
  cotas: [...new Set((window.__hekatanDrawingPoints?.rawVal ?? []).map((p) => +p[2].toFixed(2)))].sort((a, b) => a - b),
  grillas: (window.__hekatanLevels ?? []).map((l) => l.z),
}));
const campoCota = () => pag.evaluate(() => {
  const i = [...document.querySelectorAll("#hk-ribbon input")].find((e) => (e.title || "").includes("Cota Z"));
  if (!i) return null; const r = i.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
});

// ⚠️ Cerrar los dos paneles laterales ANTES de nada: tapan los extremos de la
// cinta (el botón «⇈ Subir» cae debajo del panel derecho y el clic se pierde) y
// se comen los clics del lienzo. Es la trampa de siempre al automatizar el CAD.
for (const id of ["#hk-settings-toggle", "#hk-pane-toggle"]) {
  const b = await pag.evaluate((s) => {
    const e = document.querySelector(s); if (!e) return null;
    const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }, id);
  if (b) { await pag.mouse.click(b.x, b.y); await esp(600); }
}
await esp(500);

// cámara isométrica cómoda y SNAP encendido
await pag.evaluate(() => {
  const v = document.querySelector("#viewer"), c = v.__ctx.camera;
  v.__ctx.controls.target.set(4, 3, 1.5); c.position.set(22, -18, 14);
  c.lookAt(v.__ctx.controls.target); v.__ctx.controls.update?.(); v.__ctx.render?.();
  window.__hekatanSnapEnabled = true;
});
await esp(700);
await nota("Hekatan Struct — grillas auxiliares a la cota que quieras");
await mover(700, 450); await foto("inicio");

// ── 1. planta baja en cota 0 ──────────────────────────────────────────────
await cinta("Rect", "1) Planta baja: rectángulo 8 × 6 en la cota 0", "boton_rect");
await clicMundo([0, 0, 0], "pb_p1");
await clicMundo([8, 6, 0], "pb_p2");
await pag.keyboard.press("Escape"); await esp(300);
await cinta("Columna", "2) Columnas en las 4 esquinas (suben 3 m)", "boton_columna");
for (const P of [[0,0,0],[8,0,0],[8,6,0],[0,6,0]]) await clicMundo(P, "columna");
await pag.keyboard.press("Escape"); await esp(400);
await nota("Planta baja lista"); await foto("planta_baja");
console.log("tras planta baja:", JSON.stringify(await dom()));

// ── 2. subir la cota SIN perder la vista ──────────────────────────────────
const camA = await pag.evaluate(() => { const c = document.querySelector("#viewer").__ctx.camera;
  return [c.position.x, c.position.y, c.position.z].map((q) => +q.toFixed(2)); });
const cz = await campoCota();
await nota("3) Cota Z = 3.00 — ANTES esto te saltaba a vista cenital");
await clic(cz.x, cz.y, "campo_cota");
await pag.keyboard.down("Control"); await pag.keyboard.press("KeyA"); await pag.keyboard.up("Control");
await pag.keyboard.type("3", { delay: 90 });
await pag.keyboard.press("Enter"); await esp(900);
const camB = await pag.evaluate(() => { const c = document.querySelector("#viewer").__ctx.camera;
  return [c.position.x, c.position.y, c.position.z].map((q) => +q.toFixed(2)); });
const quieta = camA.every((v, i) => Math.abs(v - camB[i]) < 0.02);
await nota(quieta ? "La vista NO se movió: sigues en 3D, dibujando a 3.00 m"
                  : "⚠ la vista se movió: " + camA + " → " + camB);
await foto("cota_3");
console.log("cámara", camA, "→", camB, quieta ? "QUIETA" : "SE MOVIÓ");

// ── 3. dejar la grilla auxiliar puesta ────────────────────────────────────
const bAux = await pag.evaluate(() => {
  const b = [...document.querySelectorAll("#hk-ribbon button")].find((e) => (e.title || "").includes("grilla auxiliar"));
  if (!b) return null; const r = b.getBoundingClientRect();
  const q = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  return (q.x <= window.innerWidth && q.y <= window.innerHeight) ? q : null;
});
await nota("4) ▦+  deja la GRILLA AUXILIAR puesta a 3.00 m");
await clic(bAux.x, bAux.y, "boton_grilla_aux");
await esp(700); await foto("grilla_aux_puesta");
// No vale mirar el PNG: una rejilla tenue en perspectiva no se distingue de la del
// suelo. Se leen de la escena las cotas de cada rejilla y su opacidad.
const rejEsc = await pag.evaluate(() => {
  const out = []; document.querySelector("#viewer").__ctx.scene.traverse((o) => {
    if (typeof o.name === "string" && o.name.startsWith("hekatan-grid")) {
      let op = null; o.traverse((c) => { if (c.material && op === null) op = +(c.material.opacity ?? 1).toFixed(2); });
      out.push({ z: +o.position.z.toFixed(2), visible: o.visible, op });
    }
  });
  return out;
});
console.log("grillas (niveles):", JSON.stringify((await dom()).grillas),
            "· rejillas en escena:", JSON.stringify(rejEsc));

// ── 4. dibujar el piso 1 sobre esa grilla, desde la misma vista 3D ────────
await cinta("Rect", "5) Vigas del piso 1, enganchando a los cruces de ESA grilla", "boton_rect2");
await clicMundo([0, 0, 3], "p1_p1");
await clicMundo([8, 6, 3], "p1_p2");
await pag.keyboard.press("Escape"); await esp(400);
await nota("Piso 1 dibujado a 3.00 m sin bajar a planta"); await foto("piso1");
const d1 = await dom(); console.log("tras piso 1:", JSON.stringify(d1));

// ── 5. replicar hacia arriba ──────────────────────────────────────────────
await cinta("Selec", "6) Designar todo con una ventana de dos clics", "boton_selec");
const [a1] = await proj([[-4, -4, 0]]); const [b1] = await proj([[13, 11, 3]]);
await clic(a1.x, a1.y, "ventana_1"); await clic(b1.x, b1.y, "ventana_2");
await esp(600);
const sel = await pag.evaluate(() => window.__hekatanSelection?.size ?? 0);
console.log("seleccionados:", sel);
await nota(`Designados ${sel} objetos con la ventana`); await foto("designado");
await nota("7) ⇈ Subir: replica 3 m × 2, como el Replicate de ETABS");
const bSub = await boton("Subir");
await clic(bSub.x, bSub.y, "boton_subir");
await esp(1200);
await pag.evaluate(() => window.__hekatanAutoFit?.()); await esp(900);
const d2 = await dom();
await nota(`Listo: ${d2.nudos} nudos en las cotas ${d2.cotas.join(" · ")} m`);
await foto("final");
console.log("final:", JSON.stringify(d2));
console.log("pageerror:", errores.length, errores.slice(0, 3), "· fotogramas:", n);
await nota("");
await nav.close(); srv.close();

// GIF con todos los fotogramas en orden
const FF = "C:/Users/j-b-j/AppData/Roaming/Python/Python312/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe";
const lista = fs.readdirSync(out).filter((f) => f.endsWith(".png")).sort();
fs.writeFileSync(`${out}/lista.txt`,
  lista.map((f) => `file '${f}'\nduration 0.6`).join("\n") + `\nfile '${lista[lista.length - 1]}'\n`);
execFileSync(FF, ["-y", "-f", "concat", "-safe", "0", "-i", `${out}/lista.txt`,
  "-vf", "scale=1000:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse=dither=bayer",
  `${out}/grillas_aux.gif`], { stdio: "ignore" });
console.log("GIF:", `${out}/grillas_aux.gif`,
  Math.round(fs.statSync(`${out}/grillas_aux.gif`).size / 1024), "KB");
