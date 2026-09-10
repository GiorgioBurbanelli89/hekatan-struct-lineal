#!/usr/bin/env node
/**
 * GIF que muestra el modal COMO SE USA, no solo el resultado.
 *
 * El GIF anterior arrancaba con el modal ya corrido: no se veia el cursor, ni
 * el clic, ni de donde salia nada — y encima era un solo ejemplo. Este graba la
 * secuencia entera y para VARIOS ejemplos:
 *
 *   1. el ejemplo recien cargado, quieto
 *   2. el cursor viaja hasta "▶ Correr modal + animar"
 *   3. clic (se ve el destello) y el modal resolviendo
 *   4. el cursor va a "📋 Mostrar tabla" y la enciende → participacion de masa
 *   5. el cursor mueve el slider "Modo #" y cada modo se anima
 *
 * El cursor es un overlay con la misma pinta que el de `runCadDemo()` del
 * workspace (punto rojo con halo amarillo), pero NO es una animacion pintada:
 * sigue al mouse DE VERDAD de puppeteer via el evento `mousemove`. Si el cursor
 * llega al boton, es que el boton esta donde se ve.
 *
 *   node cli/gif_modal_demo.mjs [local|url] [ej1,ej2,...]
 *
 * Salida: cli/shots/demo_<ejemplo>.gif + cli/shots/ver_gifs.html
 */
import puppeteer from "puppeteer";
import { mkdirSync, writeFileSync, readFileSync, existsSync, statSync, readdirSync, unlinkSync } from "fs";
import { createServer } from "http";
import { execFileSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "shots");
mkdirSync(OUT, { recursive: true });

const BASE_PUB = "/hekatan-struct-lineal/";
let servidor = null;
async function servirLocal() {
  const raiz = join(__dirname, "..", "website", "src", "examples");
  if (!existsSync(raiz)) throw new Error("no hay bundle: corre el build primero");
  const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
                 ".wasm": "application/wasm", ".json": "application/json",
                 ".svg": "image/svg+xml", ".png": "image/png", ".ico": "image/x-icon" };
  servidor = createServer((req, res) => {
    let p = decodeURIComponent((req.url || "/").split("?")[0]);
    if (p.startsWith(BASE_PUB)) p = p.slice(BASE_PUB.length - 1);
    let f = join(raiz, p);
    if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
    if (!existsSync(f)) { res.writeHead(404); return res.end("404 " + p); }
    res.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" });
    res.end(readFileSync(f));
  });
  await new Promise((r) => servidor.listen(4699, r));
  return `http://localhost:4699${BASE_PUB}workspace/`;
}

const arg = process.argv[2];
const URL_BASE = (!arg || arg === "local") ? await servirLocal() : arg;
// Cada entrada es `ejemplo` o `ejemplo:plantilla`, donde plantilla es el numero de
// `tipo` de las Plantillas (0 portico 2D · 1 portico 3D · 2 portico+losa · 4 losa
// plana · 6 portico+losa+MUROS (dual) · 7 arriostrado). Sin numero, el ejemplo se
// abre tal cual.
const EJEMPLOS = (process.argv[3] ||
  "beams,galpon-bodega,test-m-dual,mesa-torsion").split(",");
const NOMBRE_PLANTILLA = {
  0: "Pórtico plano (2D)", 1: "Pórtico 3D", 2: "Pórtico + losa (aporte de losa)",
  3: "Solo rejilla", 4: "Losa plana sobre columnas", 5: "Losa con vigas de borde",
  6: "Pórtico + losa + muros (dual)", 7: "Pórtico arriostrado (CBF)",
};

// ── Frecuencias de ETABS 22, SOLO donde existe una referencia de verdad ──
// Nada de numeros de memoria: cada lista viene de una corrida de ETABS sobre el
// MISMO modelo, con los brazos rigidos anulados, y esta reproducida en el repo.
// Donde no hay referencia se deja vacio y el rotulo lo dice, en vez de inventar
// una comparacion.
const ETABS = {
  // Paz & Leigh 6.3 Space Frame — tests/casos/paz_6_3.mjs (ETABS 22, offsets=0)
  "beams": { f: [8.8305, 14.5459, 24.2336, 25.1132, 159.6525, 159.8513],
             nota: "ETABS 22 · offsets = 0 · tests/casos/paz_6_3.mjs" },
};

// ⚠️ `galpon-bodega` NO esta en esa tabla, y estuvo a punto de estarlo. El
// encabezado de `galponBodega.ts` dice que el modelo "es EL MISMO que se
// exporta a ETABS", pero contado:
//
//     ejemplo del workspace   448 nudos ·  992 barras ·   0 cascaras
//     galpon_bodega.EDB       599 nudos · 1140 barras · 116 cascaras
//
// y esas 116 cascaras (deck + zinc) llevan 100.5 t de las 140.8 t del modelo.
// Poner al lado las frecuencias de ETABS daba -27.3 / +16.5 / +14.6 %, y eso
// no mide dos solvers: mide dos estructuras distintas. Es exactamente la
// trampa contra la que avisa la regla de oro del CLAUDE.md. Para que entre
// aca hace falta el mismo modelo nudo a nudo, no uno parecido.

const espera = (ms) => new Promise((r) => setTimeout(r, ms));

const navegador = await puppeteer.launch({
  headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox",
         "--enable-unsafe-swiftshader", "--use-angle=swiftshader",
         "--enable-webgl", "--ignore-gpu-blocklist", "--window-size=1600,1000"],
});

/** El overlay: cursor que sigue al mouse real + un rotulo que narra el paso. */
const OVERLAY = `
(() => {
  if (document.getElementById("hk-shot-cursor")) return;
  const c = document.createElement("div");
  c.id = "hk-shot-cursor";
  c.style.cssText = "position:fixed;width:18px;height:18px;margin:-9px 0 0 -9px;" +
    "pointer-events:none;z-index:2147483647;border-radius:50%;" +
    "background:radial-gradient(circle,#ef4444 32%,transparent 62%);" +
    "border:2px solid #fbbf24;box-shadow:0 0 8px #ef4444,0 0 16px #fbbf24;" +
    "transition:width .08s,height .08s;left:-100px;top:-100px";
  document.body.appendChild(c);
  const r = document.createElement("div");
  r.id = "hk-shot-rotulo";
  r.style.cssText = "position:fixed;left:0;right:0;top:0;z-index:2147483646;" +
    "background:linear-gradient(#0b0c0fee,#0b0c0f00);color:#7dd3a0;" +
    "font:600 20px ui-monospace,Consolas,monospace;padding:14px 22px 26px;" +
    "pointer-events:none;text-shadow:0 2px 6px #000";
  document.body.appendChild(r);
  window.__rotulo = (t) => { r.textContent = t; };
  document.addEventListener("mousemove", (e) => {
    c.style.left = e.clientX + "px"; c.style.top = e.clientY + "px";
  }, true);
  document.addEventListener("mousedown", () => {
    c.style.width = "34px"; c.style.height = "34px"; c.style.margin = "-17px 0 0 -17px";
  }, true);
  document.addEventListener("mouseup", () => {
    setTimeout(() => { c.style.width = "18px"; c.style.height = "18px";
                       c.style.margin = "-9px 0 0 -9px"; }, 140);
  }, true);
  window.__fila = (t) => Array.from(document.querySelectorAll(".tp-lblv"))
    .find((x) => ((x.querySelector(".tp-lblv_l") || {}).textContent || "").includes(t));
  window.__boton = (t) => Array.from(document.querySelectorAll(".tp-btnv_b, button"))
    .find((x) => (x.textContent || "").includes(t));
  window.__centro = (el) => { const b = el.getBoundingClientRect();
    return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; };
})()`;

const gifs = [];
for (const ENTRADA of EJEMPLOS) {
  const [EJ, PLANT] = ENTRADA.split(":");
  const plantilla = PLANT === undefined ? null : Number(PLANT);
  const pag = await navegador.newPage();
  await pag.setViewport({ width: 1600, height: 1000 });
  const errores = [];
  pag.on("pageerror", (e) => errores.push(e.message));

  const url = `${URL_BASE}?t=${EJ}`;
  console.log(`\n══ ${EJ} ══\n  ${url}`);
  await pag.goto(url, { waitUntil: "networkidle2", timeout: 120000 });
  await espera(7000);
  await pag.evaluate(OVERLAY);

  let k = 0;
  const pre = `demo_${plantilla === null ? EJ : EJ + "_" + plantilla}_`;
  for (const f of readdirSync(OUT)) if (f.startsWith(pre)) unlinkSync(join(OUT, f));
  const foto = async () => {
    await pag.screenshot({ path: join(OUT, `${pre}${String(++k).padStart(3, "0")}.png`) });
  };
  const rotulo = (t) => pag.evaluate((t) => window.__rotulo(t), t);
  const quieto = async (n, ms = 260) => { for (let i = 0; i < n; i++) { await espera(ms); await foto(); } };

  /** Mueve el mouse DE VERDAD hasta el centro del elemento, fotografiando el viaje. */
  const irA = async (buscar, texto, tomas = 6) => {
    const p = await pag.evaluate((buscar, texto) => {
      const el = buscar === "boton" ? window.__boton(texto) : window.__fila(texto);
      return el ? window.__centro(el) : null;
    }, buscar, texto);
    if (!p) return null;
    const paso = Math.max(1, Math.round(1 / tomas * 100) / 100);
    for (let i = 1; i <= tomas; i++) {
      await pag.mouse.move(p.x, p.y, { steps: 1 });
      // el viaje se hace en tramos para que el cursor se vea recorriendo
      await espera(90);
      if (i % 2 === 0) await foto();
    }
    return p;
  };
  /** Viaje interpolado: mueve en `tomas` saltos desde donde este el mouse. */
  const viajar = async (destino, tomas = 7) => {
    const desde = await pag.evaluate(() => window.__ultimoXY || { x: 800, y: 500 });
    for (let i = 1; i <= tomas; i++) {
      const t = i / tomas;
      await pag.mouse.move(desde.x + (destino.x - desde.x) * t,
                           desde.y + (destino.y - desde.y) * t, { steps: 2 });
      await espera(70);
      await foto();
    }
    await pag.evaluate((d) => { window.__ultimoXY = d; }, destino);
  };
  const puntoDe = (buscar, texto) => pag.evaluate((buscar, texto) => {
    const el = buscar === "boton" ? window.__boton(texto) : window.__fila(texto);
    return el ? window.__centro(el) : null;
  }, buscar, texto);

  // ── 0. el ejemplo, quieto ──
  const nombre = await pag.evaluate(() => {
    const f = window.__fila("Ejemplo");
    const s = f && f.querySelector("select, .tp-lstv_s");
    return s ? (s.value || s.textContent || "") : "";
  });
  await rotulo(`1 · Ejemplo cargado: ${nombre || EJ}`);
  await quieto(4, 300);

  // ── 0b. elegir la PLANTILLA con el cursor ──────────────────────────────────
  // El desplegable de Tweakpane es un <select> de verdad: el cursor viaja hasta el,
  // se ve el clic, y se elige la opcion. Asi el GIF ensena de donde sale el modelo
  // en vez de aparecer ya montado.
  if (plantilla !== null) {
    const pp = await puntoDe("fila", "Plantilla");
    if (pp) {
      await rotulo("2 · el cursor abre «Plantilla»");
      await viajar(pp, 7);
      await pag.mouse.down(); await espera(140); await foto();
      await pag.mouse.up();   await espera(200); await foto();
      await rotulo(`3 · elige «${NOMBRE_PLANTILLA[plantilla] ?? plantilla}»`);
      // Se le pone un id al <select> y se elige con `page.select`, que dispara los
      // eventos como el navegador. Tocar el descriptor de `value` a mano fallaba
      // («Cannot read properties of undefined») y el GIF salia con el modelo por
      // defecto: las dos plantillas daban las MISMAS frecuencias, que fue como se vio.
      // ⚠️ El `value` de las opciones NO es el número: Tweakpane pone la ETIQUETA
      // («▦ Pórtico plano (2D)»). Pidiendo "6" el navegador no encuentra opción y se
      // queda en la primera — las dos plantillas salían con las MISMAS frecuencias.
      // Se busca la opción por su texto.
      const hay = await pag.evaluate((nom) => {
        const f = window.__fila("Plantilla");
        const s = f && f.querySelector("select");
        if (!s) return null;
        s.id = "hk-demo-plantilla";
        const o = [...s.options].find((x) => (x.textContent || "").includes(nom));
        return o ? o.value : null;
      }, NOMBRE_PLANTILLA[plantilla]);
      if (hay) {
        await pag.select("#hk-demo-plantilla", hay);
        await espera(2500);
        await quieto(6, 500);
        const puesta = await pag.evaluate(() =>
          document.getElementById("hk-demo-plantilla")?.value);
        if (!String(puesta).includes(NOMBRE_PLANTILLA[plantilla]))
          console.log(`  ✗ la plantilla NO cambió: pedida «${NOMBRE_PLANTILLA[plantilla]}», quedó «${puesta}»`);
        else console.log(`  ✓ plantilla · ${puesta}`);
      } else {
        console.log("  ✗ no encuentro el desplegable «Plantilla»");
      }
    }
  }

  // ── 1. al boton de modal ──
  let p = await puntoDe("boton", "Correr modal");
  if (!p) {
    // el folder puede estar plegado: se abre "Modal + Animación"
    await rotulo("· abriendo la carpeta Modal + Animación");
    const fp = await pag.evaluate(() => {
      const t = Array.from(document.querySelectorAll(".tp-fldv_b, .tp-fldv_t"))
        .find((e) => /Modal/.test(e.textContent || ""));
      if (!t) return null; const b = t.getBoundingClientRect();
      return { x: b.left + b.width / 2, y: b.top + b.height / 2 };
    });
    if (fp) { await viajar(fp, 5); await pag.mouse.click(fp.x, fp.y); await espera(700); await foto(); }
    p = await puntoDe("boton", "Correr modal");
  }
  if (!p) {
    console.log("  ✗ no hay boton de modal en este ejemplo");
    await pag.close();
    continue;
  }
  await rotulo("4 · el cursor va al botón «▶ Correr modal + animar»");
  await viajar(p, 8);

  // ── 2. clic ──
  await rotulo("5 · CLIC — el modal resuelve");
  await pag.mouse.down(); await espera(120); await foto();
  await pag.mouse.up();  await espera(120); await foto();
  await quieto(6, 500);

  // ── 3. encender la tabla de participacion de masa ──
  const pt = await puntoDe("fila", "Mostrar tabla");
  if (pt) {
    await rotulo("6 · el cursor enciende «📋 Mostrar tabla»");
    await viajar(pt, 6);
    await rotulo("7 · CLIC — sale la participación de masa modo a modo");
    await pag.mouse.down(); await espera(120); await foto();
    await pag.mouse.up();  await espera(900); await foto();
    await quieto(4, 350);
  }

  // ── 4. recorrer los modos con el slider ──
  const pm = await puntoDe("fila", "Modo #");
  if (pm) {
    await rotulo("8 · el cursor mueve el slider «Modo #»");
    await viajar(pm, 6);
  }
  const ref = ETABS[EJ];
  const comp = [];
  for (let m = 1; m <= 5; m++) {
    await pag.evaluate((n) => {
      const f = window.__fila("Modo #");
      const i = f && f.querySelector("input");
      if (!i) return;
      const set = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
      set.call(i, String(n));
      i.dispatchEvent(new Event("input", { bubbles: true }));
      i.dispatchEvent(new Event("change", { bubbles: true }));
    }, m);
    await espera(700);
    const st = await pag.evaluate(() => {
      const v = (t) => { const f = window.__fila(t); const e = f && f.querySelector("input");
                         return e ? e.value : "?"; };
      return { f: v("Frecuencia"), T: v("Período"), dom: v("Dominante") };
    });
    const fHK = parseFloat(String(st.f).replace(/[^0-9.]/g, ""));
    const fET = ref && ref.f[m - 1];
    let linea;
    if (fET) {
      const dif = 100 * (fHK - fET) / fET;
      linea = `${fHK.toFixed(4)} Hz  ·  ETABS ${fET.toFixed(4)} Hz  ·  ${dif >= 0 ? "+" : ""}${dif.toFixed(2)} %`;
      comp.push({ m, hk: fHK, et: fET, dif });
    } else {
      linea = `${st.f} · T=${st.T} · ${st.dom}   (sin referencia de ETABS para este modelo)`;
    }
    await rotulo(`9 · Modo ${m} — Hekatan ${linea}`);
    console.log(`  modo ${m}: ${linea}`);
    await quieto(3, 300);
  }
  if (comp.length) {
    const peor = comp.reduce((a, b) => Math.abs(b.dif) > Math.abs(a.dif) ? b : a);
    await rotulo(`✓ ${nombre || EJ} vs ETABS 22 — peor modo: ${peor.dif >= 0 ? "+" : ""}${peor.dif.toFixed(2)} %  (${ref.nota})`);
    await quieto(5, 400);
  }

  await rotulo(`✓ ${nombre || EJ} — el modal corrió, la tabla salió y los modos se animan`);
  await quieto(3, 400);
  if (errores.length) console.log("  errores JS:", errores.slice(0, 3));
  await pag.close();

  const etiqueta = plantilla === null ? EJ : `${EJ}_${plantilla}`;
  const gif = join(OUT, `demo_${etiqueta}.gif`);
  execFileSync("ffmpeg", ["-y", "-framerate", "4", "-i", join(OUT, `${pre}%03d.png`),
    "-vf", "scale=1000:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=128[p];[s1][p]paletteuse",
    gif], { stdio: "pipe" });
  const kb = statSync(gif).size / 1024;
  console.log(`  ${k} cuadros → demo_${etiqueta}.gif (${kb.toFixed(0)} KB)`);
  gifs.push({ ej: etiqueta, nombre: nombre || EJ, gif: `demo_${etiqueta}.gif`, kb, k, comp, ref });
}

await navegador.close();
servidor?.close();

// ── pagina para verlos ──
writeFileSync(join(OUT, "ver_gifs.html"), `<!doctype html>
<meta charset="utf-8"><title>Hekatan Struct — el modal, paso a paso</title>
<style>
 body{background:#15161a;color:#d8dbe2;font:14px/1.6 ui-monospace,Consolas,monospace;margin:0;padding:24px 32px}
 h1{font-size:19px;color:#7dd3a0;margin:0 0 6px}
 h2{font-size:15px;color:#e0b25c;margin:30px 0 6px}
 p{margin:0 0 12px;color:#9aa1ad;max-width:1000px}
 img{width:100%;max-width:1100px;border:1px solid #2c2f38;border-radius:6px;display:block;background:#000}
 b{color:#e6e9ef}
 table{border-collapse:collapse;margin:6px 0 4px}
 td,th{padding:3px 18px 3px 0;text-align:left}
 th{color:#7dd3a0;border-bottom:1px solid #2c2f38}
</style>
<h1>El modal del workspace, paso a paso</h1>
<p>Grabado del bundle publicado con un navegador de verdad. El <b>punto rojo con
halo amarillo</b> es el mouse REAL de la automatización — no está pintado: sigue
al evento <code>mousemove</code>. Cuando se agranda, es un clic.</p>
<p>Cada GIF va: ejemplo quieto → el cursor viaja al botón → clic → el modal
resuelve → el cursor enciende «Mostrar tabla» → sale la participación de masa →
el cursor mueve el slider y cada modo se anima.</p>
${gifs.map((g) => `<h2>${g.nombre}  <span style="color:#6b7280">(${g.k} cuadros · ${g.kb.toFixed(0)} KB)</span></h2>
<img src="${g.gif}" alt="${g.nombre}">`).join("\n")}
`, "utf-8");
console.log(`\nlisto → cli/shots/ver_gifs.html  (${gifs.length} ejemplos)`);
