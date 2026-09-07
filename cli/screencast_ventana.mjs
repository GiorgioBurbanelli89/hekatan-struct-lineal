#!/usr/bin/env node
/**
 * GRABA EN CONTINUO la ventana de Hekatan Struct: un screencast de verdad.
 *
 *   node cli/screencast_ventana.mjs [url]
 *
 * Por qué esto y no una tanda de PNG: catorce cuadros a cinco por segundo dan
 * TRES segundos de movimiento en una escena de doce. El resto la imagen se
 * queda congelada mientras la voz sigue hablando, y eso es exactamente lo que
 * no puede pasar en un tutorial. Con `page.screencast()` el navegador graba a
 * su propio ritmo y la imagen no para nunca.
 *
 * Y el guion manda sobre la mano: cada golpe de voz sabe cuántas palabras
 * tiene, así que se calcula lo que va a durar (2,73 palabras/s medidos con
 * `es-MX-JorgeNeural +14%`), la acción se estira EXACTAMENTE eso, y se escribe
 * un `guion.txt` con el segundo real en el que empieza cada frase. Después
 * `narrar.py` le pega la voz y los subtítulos y quedan clavados.
 *
 * Salida:  cli/shots/cast/ventana.webm  +  cli/shots/cast/guion.txt
 */
import puppeteer from "puppeteer";
import { mkdirSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "shots", "cast");
mkdirSync(OUT, { recursive: true });
const URL_APP = process.argv[2] ||
  "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/";

const RITMO = 2.73;          // palabras por segundo, MEDIDAS
const RESPIRO = 1.15;        // silencio entre frases
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
// stdout va a un fichero: sin escribir a mano no se ve NADA hasta el final,
// y un cuelgue parece un proceso trabajando.
const di = (t) => { process.stdout.write(String(t) + String.fromCharCode(10)); };
const dura = (t) => t.split(/\s+/).filter(Boolean).length / RITMO + RESPIRO;

// ── el guion: qué se dice y qué se hace mientras se dice ────────────────
const GOLPES = [
  { t: "Esta es la ventana de Hekatan Struct lineal al abrirla.", a: "orbita" },
  { t: "A la derecha se elige por dónde empezar: un archivo existente, un ejemplo, o una de las nueve plantillas.", a: "marcaPlantillas" },
  { t: "Se pulsa una, y la estructura llega armada: geometría, secciones, cargas y resultados.", a: "pulsaPlantilla" },
  { t: "El panel de la izquierda no modela: representa. Elige qué resultado se dibuja sobre el modelo.", a: "marcaAjustes" },
  { t: "Y cuánto se amplifica la deformada. Sube la escala: el movimiento se ve, pero la estructura es la misma.", a: "escala" },
  { t: "En el centro, el modelo. La rejilla es el plano de trabajo: la altura a la que cae cada clic.", a: "paseo" },
  { t: "Arriba a la derecha, la posición del cursor sobre ese plano. Es lo que confirma dónde va a caer el punto.", a: "marcaCoord" },
  { t: "Abajo, la línea de comando, para cuando la medida tiene que ser exacta.", a: "marcaComando" },
  { t: "Seis, cero, cero es un punto. Arroba seis, ángulo cuarenta y cinco es una distancia y una dirección desde el punto anterior.", a: "teclea" },
  { t: "Y la cruceta de la esquina encuadra la vista: mueve la cámara, nunca la estructura.", a: "cruceta" },
  { t: "Con esto ya se puede empezar. En el siguiente, una plantilla entera.", a: "orbita" },
];

const nav = await puppeteer.launch({
  headless: "new",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader",
         "--enable-webgl", "--ignore-gpu-blocklist", "--window-size=1920,1080"],
});
const pag = await nav.newPage();
await pag.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
const errs = [];
pag.on("pageerror", (e) => errs.push(e.message));

di("abriendo " + URL_APP);
await pag.goto(URL_APP, { waitUntil: "networkidle2", timeout: 180000 });
await espera(13000);

await pag.evaluate(() => {
  window.__btn = (t) => Array.from(document.querySelectorAll(".tp-btnv_b, button"))
    .find((b) => (b.textContent || "").includes(t));
  window.__fila = (t) => Array.from(document.querySelectorAll(".tp-lblv"))
    .find((r) => (((r.querySelector(".tp-lblv_l") || {}).textContent) || "").includes(t));
  // el resalte: marco de oro y el resto atenuado. Se anima la aparicion para
  // que no salte de golpe.
  window.__marcar = (e) => {
    document.querySelectorAll(".hk-marca").forEach((m) => m.remove());
    if (!e) return false;
    const el = typeof e === "string" ? document.querySelector(e) : e;
    if (!el) return false;
    const r = el.getBoundingClientRect();
    const d = document.createElement("div");
    d.className = "hk-marca";
    d.style.cssText = `position:fixed;left:${r.x - 8}px;top:${r.y - 8}px;` +
      `width:${r.width + 16}px;height:${r.height + 16}px;border:3px solid #D3A53C;` +
      `border-radius:6px;pointer-events:none;z-index:99999;opacity:0;` +
      `box-shadow:0 0 0 9999px rgba(0,0,0,.42);transition:opacity .45s`;
    document.body.appendChild(d);
    requestAnimationFrame(() => { d.style.opacity = "1"; });
    return true;
  };
  window.__quitar = () => document.querySelectorAll(".hk-marca").forEach((m) => m.remove());
  // BALIZA. El screencast no graba a ritmo constante —la pagina se ocupa y
  // pierde cuadros—, asi que el segundo del reloj de node NO es el segundo del
  // video: 79,5 s de acciones salieron como 96 s de pelicula. En vez de estimar
  // el desfase, se marca: un cuadrito magenta en una esquina al empezar cada
  // frase. Luego se leen del video y se sabe el instante REAL de cada una.
  window.__baliza = (on) => {
    let b = document.getElementById("hk-baliza");
    if (!b) {
      b = document.createElement("div");
      b.id = "hk-baliza";
      b.style.cssText = "position:fixed;left:0;top:0;width:26px;height:26px;" +
                        "z-index:2147483647;pointer-events:none;background:#000";
      document.body.appendChild(b);
    }
    b.style.background = on ? "#FF00FF" : "#000000";
  };
});

const lz = await pag.evaluate(() => {
  const c = Array.from(document.querySelectorAll("canvas"))
    .sort((a, b) => b.clientWidth * b.clientHeight - a.clientWidth * a.clientHeight)[0];
  const r = c.getBoundingClientRect();
  return { x: r.x, y: r.y, w: r.width, h: r.height };
});
const cx = lz.x + lz.w / 2, cy = lz.y + lz.h / 2;

/**
 * Mueve el raton hasta que SE CUMPLE EL TIEMPO, no un numero fijo de pasos.
 *
 * Contando pasos, la primera grabacion se fue a 34,6 s donde tocaban 4,8: cada
 * `mouse.move` es un viaje de ida y vuelta por CDP y cuesta bastante mas que la
 * pausa que uno pone. Yendo por reloj, el bucle se ajusta solo a lo lento que
 * vaya la maquina.
 */
let pulsado = false;
async function suelta() {
  if (pulsado) { try { await pag.mouse.up(); } catch {} pulsado = false; }
}
async function arrastra(ms, ax, ay) {
  const fin = Date.now() + ms;
  await suelta();
  await pag.mouse.move(cx, cy);
  await pag.mouse.down(); pulsado = true;
  try {
    while (Date.now() < fin) {
      const t = 1 - (fin - Date.now()) / ms;
      await pag.mouse.move(cx + ax * t, cy + ay * t);
    }
  } finally { await suelta(); }
}
async function pasea(ms, x0, y0, x1, y1) {
  const fin = Date.now() + ms;
  await suelta();
  while (Date.now() < fin) {
    const t = 1 - (fin - Date.now()) / ms;
    await pag.mouse.move(lz.x + lz.w * (x0 + (x1 - x0) * t),
                         lz.y + lz.h * (y0 + (y1 - y0) * t));
  }
}

const ACCIONES = {
  orbita: (ms) => arrastra(ms, 210, 22),
  paseo:  (ms) => pasea(ms, 0.26, 0.68, 0.72, 0.34),
  marcaPlantillas: async (ms) => {
    await pag.evaluate(() => {
      const b = window.__btn("Pórtico 3D") || window.__btn("Solo rejilla");
      window.__marcar(b && b.parentElement && b.parentElement.parentElement);
    });
    await espera(ms);
  },
  pulsaPlantilla: async (ms) => {
    await pag.evaluate(() => {
      window.__quitar();
      const b = window.__btn("Pórtico 3D") || window.__btn("Solo rejilla");
      if (b) b.click();
    });
    // ESPERAR A QUE EXISTA, no dormir a ciegas: la plantilla dispara un armado
    // y un analisis, y mientras el hilo de la pagina esta ocupado toda llamada
    // de puppeteer se queda en cola. Asi se colgo la primera grabacion.
    const t0 = Date.now();
    let n = 0;
    while (Date.now() - t0 < 22000) {
      n = await pag.evaluate(() => {
        const s = window.__hekatanStates, v = (x) => (x && "val" in x ? x.val : x) || [];
        return v(s?.elements).length;
      }).catch(() => 0);
      if (n > 0) break;
      await espera(500);
    }
    di(`    modelo armado: ${n} elementos en ${((Date.now()-t0)/1000).toFixed(1)} s`);
    const resto = ms - (Date.now() - t0);
    if (resto > 900) await arrastra(Math.min(resto, 2600), 70, 8);
    else if (resto > 0) await espera(resto);
  },
  marcaAjustes: async (ms) => {
    await pag.evaluate(() => {
      window.__marcar(document.querySelector("#settings") || document.querySelectorAll(".tp-dfwv")[0]);
    });
    await espera(ms);
  },
  escala: async (ms) => {
    await pag.evaluate(() => { window.__quitar(); window.__marcar(window.__fila("Scale Z")); });
    const vs = ["5", "15", "35", "70", "120", "70", "35"];
    const cada = Math.max(120, Math.round(ms / vs.length));
    for (const v of vs) {
      await pag.evaluate((v) => {
        const f = window.__fila("Scale Z"); const i = f && f.querySelector("input");
        if (!i) return;
        const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
        set.call(i, v);
        i.dispatchEvent(new Event("input", { bubbles: true }));
        i.dispatchEvent(new Event("change", { bubbles: true }));
        i.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
      }, v);
      await espera(cada);
    }
  },
  marcaCoord: async (ms) => {
    await pag.evaluate(() => { window.__quitar(); window.__marcar("#hk-coord-fixed"); });
    await pasea(ms, 0.34, 0.62, 0.66, 0.38);
  },
  marcaComando: async (ms) => {
    await pag.evaluate(() => {
      window.__quitar();
      const i = document.querySelector("#hk3-cmd-input");
      window.__marcar(i && i.closest("div") && i.closest("div").parentElement);
    });
    await espera(ms);
  },
  teclea: async (ms) => {
    const sel = "#hk3-cmd-input";
    const mitad = Math.round(ms / 2);
    for (const txt of ["6,0,0", "@6<45"]) {
      await pag.evaluate((s) => { const i = document.querySelector(s); if (i) { i.focus(); i.value = ""; } }, sel);
      const d = Math.max(60, Math.round((mitad - 700) / txt.length));
      for (const ch of txt) { await pag.keyboard.type(ch, { delay: 30 }); await espera(d); }
      await espera(700);
    }
  },
  cruceta: async (ms) => {
    const n = await pag.evaluate(() => {
      window.__quitar();
      const bs = Array.from(document.querySelectorAll("button"))
        .map((b) => ({ b, r: b.getBoundingClientRect() }))
        .filter((o) => o.r.width > 18 && o.r.width < 70 &&
                       o.r.y > innerHeight * 0.75 && o.r.x > innerWidth * 0.82);
      if (!bs.length) return 0;
      const x0 = Math.min(...bs.map(o => o.r.x)) - 10, y0 = Math.min(...bs.map(o => o.r.y)) - 10;
      const x1 = Math.max(...bs.map(o => o.r.x + o.r.width)) + 10;
      const y1 = Math.max(...bs.map(o => o.r.y + o.r.height)) + 10;
      const d = document.createElement("div");
      d.className = "hk-marca";
      d.style.cssText = `position:fixed;left:${x0}px;top:${y0}px;width:${x1-x0}px;` +
        `height:${y1-y0}px;border:3px solid #D3A53C;border-radius:7px;` +
        `pointer-events:none;z-index:99999;box-shadow:0 0 0 9999px rgba(0,0,0,.42)`;
      document.body.appendChild(d);
      // SOLO las flechas y la casa: con los de zoom la camara se mete dentro
      // de la losa y el cuadro sale de un solo color
      const f = (t) => bs.map(o => o.b).find((b) => (b.textContent || "").includes(t));
      window.__paso = ["←", "→", "↑", "↓", "⌂"].map(f).filter(Boolean);
      return window.__paso.length;
    });
    const cada = Math.max(200, Math.round(ms / Math.max(1, n)));
    for (let j = 0; j < n; j++) {
      await pag.evaluate((j) => { const b = window.__paso[j]; if (b) b.click(); }, j);
      await espera(cada);
    }
  },
};

// ── a grabar ─────────────────────────────────────────────────────────────
const webm = join(OUT, "ventana.webm");
const cast = await pag.screencast({ path: webm });
const t0 = Date.now();
const guion = [];

for (const g of GOLPES) {
  // la baliza se enciende JUSTO antes de la frase y se apaga enseguida
  await pag.evaluate(() => window.__baliza(true));
  await espera(320);
  await pag.evaluate(() => window.__baliza(false));
  const seg = (Date.now() - t0) / 1000;
  const ms = Math.round(dura(g.t) * 1000);
  guion.push(`${seg.toFixed(2)}  | ${g.t}`);
  di(`${seg.toFixed(1).padStart(6)}s  ${String(ms).padStart(5)}ms  ${g.a.padEnd(16)} ${g.t.slice(0, 52)}`);
  // Nada de carreras contra un reloj de guardia: la accion que «vencia» seguia
  // corriendo por detras con el boton del raton pulsado, y la siguiente moria
  // con «left is already pressed». Cada accion se limita a si misma.
  const fn = ACCIONES[g.a];
  if (fn) { try { await fn(ms); } catch (e) { di("    fallo en " + g.a + ": " + e.message); } }
  else await espera(ms);
  await suelta();
  const real = (Date.now() - t0) / 1000 - seg;
  if (real > dura(g.t) * 1.6) di(`    AVISO: «${g.a}» tardo ${real.toFixed(1)} s (tocaban ${dura(g.t).toFixed(1)})`);
}
await pag.evaluate(() => window.__quitar());
await espera(1200);
await cast.stop();
const total = (Date.now() - t0) / 1000;

writeFileSync(join(OUT, "guion.txt"), guion.join("\n") + "\n", "utf8");
di(`\ngrabados ${total.toFixed(1)} s -> ${webm}`);
di("guion -> " + join(OUT, "guion.txt"));
di("errores de pagina: " + errs.length);
await nav.close();
