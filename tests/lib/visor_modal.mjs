/**
 * =============================================================================
 *  visor_modal — mide LO QUE EL VISOR DIBUJA cuando anima un modo
 * =============================================================================
 *
 * POR QUÉ EXISTE (18-sep-2026, `registros/2026-09-18_revision_deformada_modal.md`):
 * el visor estuvo animando la deformada del caso DEAD en vez de la forma modal φ.
 * Lo dibujado era exactamente 30.427 veces la deformada de gravedad (12
 * comprobaciones: 4 nudos × 3 componentes, mismo factor a cinco cifras). No lo vio
 * nadie porque los arneses miraban «pageerror: 0» y capturas bonitas, y porque los
 * NÚMEROS del modal (periodos, masas, MAC contra SAP2000 ≈ 1.0000) estaban BIEN.
 * Lo que estaba mal era el DIBUJO.
 *
 * Así que esto no mira si la página cargó: lee los nudos que el visor tiene puestos
 * (`mesh.nodes`) en varios instantes del ciclo, les resta la posición sin deformar
 * (`settings.__modoAnim.orig`, que publica `animateMode.ts`) y compara ese vector
 * contra:
 *
 *   · φ del modo   — `window.__hekatanModalResultados()` (frecuencias, formas, masas);
 *   · la deformada estática del caso — `states.deformOutputs.val.deformations`.
 *
 * ── Contra qué se corre ──────────────────────────────────────────────────────
 * Contra el BUNDLE LOCAL servido por `http.createServer` (el mismo montaje de
 * `cli/tutorial_struct.mjs`), no contra el sitio público: en headless el público
 * se cuelga (medido 25 y 40 min sin terminar el modal) y en local responde en
 * segundos. Chrome es el del sistema (`PUPPETEER_EXECUTABLE_PATH`): no se descarga
 * ninguno.
 *
 * ⚠️ Necesita el bundle construido:  npm run build:deploy
 */
import puppeteer from "puppeteer";
import { createServer } from "http";
import { readFileSync, existsSync, statSync, readdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const AQUI = dirname(fileURLToPath(import.meta.url));
export const RAIZ_BUNDLE = join(AQUI, "..", "..", "website", "src", "examples");
const BASE = "/hekatan-struct-lineal/";
const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".wasm": "application/wasm", ".json": "application/json", ".svg": "image/svg+xml",
  ".png": "image/png", ".ico": "image/x-icon", ".woff2": "font/woff2",
};

export const hayBundle = () => existsSync(join(RAIZ_BUNDLE, "workspace", "index.html"));

/**
 * ¿El bundle es del código de HOY? Este arnés prueba el bundle construido, no las fuentes:
 * si alguien cambia el código y no reconstruye, el test sigue midiendo la versión de ayer y
 * da un veredicto sobre un programa que ya no existe (19-sep-2026: el caso de la animación
 * fallaba contra un bundle de las 19:41 mientras el código ya era otro). Se compara la fecha
 * del bundle con la del fichero fuente más nuevo que entra en él; si hay uno posterior, se
 * NIEGA a probar y dice cuál — mejor una fila roja que diga la verdad que una verde de otro día.
 */
const FUENTES = [
  ["examples", "src"], ["hekatan-ui", "src"], ["hekatan-fem", "src"],
].map((p) => join(AQUI, "..", "..", ...p));
function masNuevo(dir, mejor = { t: 0, f: "" }) {
  let ents = [];
  try { ents = readdirSync(dir, { withFileTypes: true }); } catch { return mejor; }
  for (const e of ents) {
    if (e.name === "node_modules" || e.name.startsWith(".")) continue;
    const f = join(dir, e.name);
    if (e.isDirectory()) masNuevo(f, mejor);
    else if (/\.(ts|js|mjs|wasm|html|css)$/.test(e.name)) {
      const t = statSync(f).mtimeMs;
      if (t > mejor.t) { mejor.t = t; mejor.f = f; }
    }
  }
  return mejor;
}
export function bundleDesactualizado() {
  if (process.env.HK_BUNDLE_VIEJO_OK === "1") return null;   // escape explícito, para depurar
  const tBundle = statSync(join(RAIZ_BUNDLE, "workspace", "index.html")).mtimeMs;
  let mejor = { t: 0, f: "" };
  for (const d of FUENTES) mejor = masNuevo(d, mejor);
  if (mejor.t <= tBundle) return null;
  const hhmm = (t) => new Date(t).toISOString().slice(0, 16).replace("T", " ");
  return `bundle desactualizado: ${mejor.f.split(/[\\/]/).slice(-3).join("/")} (${hhmm(mejor.t)}) ` +
         `es más nuevo que el bundle (${hhmm(tBundle)}) — corré: npm run build:deploy`;
}

const CHROME = process.env.PUPPETEER_EXECUTABLE_PATH ||
  "C:/Program Files/Google/Chrome/Application/chrome.exe";

const espera = (ms) => new Promise((r) => setTimeout(r, ms));

/** Levanta el servidor del bundle + Chrome del sistema y devuelve la página lista. */
export async function abrirVisor({ puerto: puertoPedido = 4793, ancho = 1100, alto = 700 } = {}) {
  let puerto = puertoPedido;
  if (!hayBundle())
    throw new Error("no hay bundle en website/src/examples — corré: npm run build:deploy");
  const viejo = bundleDesactualizado();
  if (viejo) throw new Error(viejo);
  const srv = createServer((req, res) => {
    let p = decodeURIComponent((req.url || "/").split("?")[0]);
    if (p.startsWith(BASE)) p = p.slice(BASE.length - 1);
    let f = join(RAIZ_BUNDLE, p);
    if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
    if (!existsSync(f)) { res.writeHead(404); return res.end("404"); }
    res.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" });
    res.end(readFileSync(f));
  });
  // ⚠️ Si el puerto está pillado, se prueba el siguiente.
  //
  // Corriendo `node tests/run.mjs animacion` justo después de un `npm test`, el 4793
  // seguía tomado y el servidor emitía EADDRINUSE: como es un evento 'error' del
  // Server, no lo cazaba el try del caso y **tumbaba el proceso entero** — la suite
  // moría en vez de dar una fila roja. Un arnés no puede caerse por eso.
  let intento = 0;
  for (;;) {
    try {
      await new Promise((res, rej) => {
        const alFallar = (e) => { srv.removeListener("listening", alSalir); rej(e); };
        const alSalir = () => { srv.removeListener("error", alFallar); res(); };
        srv.once("error", alFallar);
        srv.once("listening", alSalir);
        srv.listen(puerto + intento);
      });
      break;
    } catch (e) {
      if (e?.code !== "EADDRINUSE" || ++intento > 20) throw e;
    }
  }
  puerto += intento;
  const nav = await puppeteer.launch({
    headless: "new",
    executablePath: CHROME,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--enable-unsafe-swiftshader",
           "--use-angle=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"],
  });
  const pag = await nav.newPage();
  await pag.setViewport({ width: ancho, height: alto });
  const errores = [];
  pag.on("pageerror", (e) => errores.push(String(e.message).slice(0, 180)));
  pag.on("dialog", (d) => d.accept().catch(() => {}));
  const url = (ruta) => `http://localhost:${puerto}${BASE}${ruta}`;
  return { srv, nav, pag, errores, url, cerrar: async () => { try { await nav.close(); } catch {} try { srv.close(); } catch {} } };
}

// ── Álgebra (la misma de un MAC, pero sobre los 3 GDL de traslación) ─────────
/** Coseno |a·b| / (|a||b|). En valor absoluto: φ y −φ son el MISMO modo, y la
 *  animación pasa por las dos mitades del ciclo. */
export function coseno(a, b) {
  let p = 0, na = 0, nb = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) { p += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; }
  return (na > 1e-30 && nb > 1e-30) ? Math.abs(p) / Math.sqrt(na * nb) : 0;
}
/** De un φ de 6 GDL por nudo a los 3 de traslación, que es lo que se DIBUJA. */
export function soloTraslacion(phi) {
  const n = Math.floor(phi.length / 6), o = new Array(n * 3);
  for (let i = 0; i < n; i++) for (let c = 0; c < 3; c++) o[i * 3 + c] = phi[i * 6 + c] || 0;
  return o;
}
const norma = (v) => Math.sqrt(v.reduce((s, x) => s + x * x, 0));

/**
 * Carga un modelo, corre el modal, lo pone a animar y MIDE lo dibujado.
 *
 * Devuelve `{ estado, ... }` donde `estado` es:
 *   "ok"          → se midió (mirá las métricas)
 *   "no-carga"    → el visor no llegó a existir o reventó
 *   "sin-modal"   → el ejemplo no tiene modal (no es un fallo, es un dato)
 *   "sin-modos"   → el modal corrió pero no devolvió modos (tope de GDL)
 *   "no-anima"    → hay modos pero el animador nunca publicó nada que medir
 */
export async function medirModelo(pag, {
  id,
  tipo = null,              // plantillas: el número de plantilla (0..7)
  muestras = 20,            // instantes del ciclo
  // ms entre instantes. Por defecto se calcula para que `muestras · dt` cubra UN CICLO
  // ENTERO con margen (5.3 s), sea cual sea `muestras`.
  // ⚠️ Antes estaba clavado a 110 ms: con 18 ó 20 muestras eran ~2 s, que bastaban
  // cuando el animador daba un ciclo por segundo. Desde que la velocidad es la de
  // SAP2000 (**4.4 s por ciclo**, leída del binario — ver `animateMode.ts`), 2 s son
  // MEDIO ciclo: en el peor arranque de fase el seno no cambia de signo y las
  // comprobaciones «oscila» y «amplitud estable» reprobarían a un visor correcto.
  // Esto NO sube ningún límite: mide la misma magnitud, durante el tiempo que hace
  // falta para que exista.
  dt = null,
  esperaCarga = 6000,
  topeModal = 240000,       // ms para que el modal termine
  modosExtra = [1, 2],      // otros modos a comprobar (0-indexado); [] para saltarlo
} = {}) {
  // ciclo de SAP2000 = 4.4 s; se cubre uno entero con margen
  if (dt == null) dt = Math.ceil(5300 / Math.max(1, muestras));
  const r = { id, tipo, estado: "no-carga", nota: "" };
  const ruta = `workspace/?t=${encodeURIComponent(id)}`;
  try {
    await pag.goto(pag.__urlBase(ruta), { waitUntil: "domcontentloaded", timeout: 180000 });
  } catch (e) {
    if (!/ERR_ABORTED|Navigation timeout/.test(String(e))) { r.nota = String(e).slice(0, 120); return r; }
  }
  try {
    await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 });
  } catch { r.nota = "el visor nunca apareció (#viewer.__ctx)"; return r; }
  await espera(esperaCarga);

  // Plantillas: son UN id con un parámetro `tipo` 0..7. Si no se recorren los ocho,
  // se da por bueno el que salga por defecto (ese error ya pasó con comparar_e2k_etabs).
  if (tipo !== null) {
    await pag.evaluate((t) => {
      window.__hekatanSetParam?.("tipo", t);
      window.__hekatanRebuild?.();
    }, tipo);
    await espera(3500);
  }

  if (!(await pag.evaluate(() => typeof window.__hekatanRunModalAnimate === "function"))) {
    r.estado = "sin-modal"; return r;
  }

  // ── Se ENSUCIA el colormap a propósito ───────────────────────────────────
  // Al entrar en modal, la magnitud del caso anterior no vale: el animador solo mueve
  // `mesh.nodes` y nunca toca `analyzeOutputs`, así que la malla se movía con el modo
  // pero seguía pintada con la presión de suelo del caso anterior. Si no se ensucia
  // antes, la comprobación de abajo no prueba nada (ya estaba en "none").
  r.colormapSucio = await pag.evaluate(() => {
    const s = window.__hekatanSettings?.();
    if (!s?.shellResults) return null;
    try {
      s.shellResults.val = "vonMises";
      if (s.solidResults) s.solidResults.val = "vonMises";
      return s.shellResults.val;
    } catch { return null; }
  });

  await pag.evaluate(() => window.__hekatanRunModalAnimate());
  try {
    await pag.waitForFunction(
      () => (window.__hekatanModalResultados?.()?.modeShapes?.length || 0) > 0,
      { timeout: topeModal, polling: 500 });
  } catch { r.estado = "sin-modos"; r.nota = "el modal no devolvió modos en " + (topeModal / 1000) + " s"; return r; }
  await espera(1500);

  // Lo que se dibuja SOLO se puede medir si el animador publicó la foto sin deformar.
  try {
    await pag.waitForFunction(() => {
      const v = document.querySelector("#viewer");
      const s = v.__settings ?? v.__ctx?.settings;
      return !!s?.__modoAnim?.orig?.length;
    }, { timeout: 20000, polling: 200 });
  } catch { r.estado = "no-anima"; r.nota = "hay modos pero `settings.__modoAnim` sigue vacío: no anima"; return r; }

  const base = await pag.evaluate(() => {
    const S = window.__hekatanStates;
    const R = window.__hekatanModalResultados();
    const s = window.__hekatanSettings?.();
    const n = S.nodes.val.length;
    // La deformada ESTÁTICA del caso activo (Dead por defecto): es el impostor.
    const D = S.deformOutputs?.val?.deformations;
    const dead = new Array(n * 3).fill(0);
    if (D) {
      const it = D instanceof Map ? D.entries() : Object.entries(D);
      for (const [k, d] of it) { const i = Number(k); if (i >= 0 && i < n) for (let c = 0; c < 3; c++) dead[i * 3 + c] = d?.[c] ?? 0; }
    }
    return {
      n, caso: S.activeLoadCase?.val ?? "",
      freqs: R.frequencies, part: R.massParticipation ?? [],
      phi: R.modeShapes.slice(0, 4), dead,
      shellResults: s?.shellResults?.val ?? null,
      solidResults: s?.solidResults?.val ?? null,
      estado: window.__hekatanModalAnimator?.getStatus?.() ?? null,
    };
  });
  r.estado = "ok";
  r.nNudos = base.n;
  r.nModos = base.freqs.length;
  r.periodos = base.freqs.map((f) => (f > 0 ? 1 / f : 0));
  r.caso = base.caso;
  r.shellResults = base.shellResults;
  r.solidResults = base.solidResults;
  r.textoEstado = base.estado?.mode ?? "";

  const phi0 = soloTraslacion(base.phi[0]);
  r.cosPhiDead = coseno(phi0, base.dead);   // cuánto se parecen φ y Dead POR SÍ MISMOS
  r.deadNulo = norma(base.dead) < 1e-12;

  // ── Muestreo del ciclo ───────────────────────────────────────────────────
  // Mismo cuidado que al cambiar de modo: se muestrea el modo 1, no lo que quedara antes.
  try {
    await pag.waitForFunction(() => window.__hekatanModalAnimator?.currentMode?.() === 0,
      { timeout: 15000, polling: 100 });
  } catch { /* sin animador expuesto: se mide igual y lo dirá el coseno */ }
  const tomas = [];
  for (let k = 0; k < muestras; k++) {
    tomas.push(await pag.evaluate(() => {
      const v = document.querySelector("#viewer");
      const s = v.__settings ?? v.__ctx?.settings;
      const ma = s?.__modoAnim;
      const N = window.__hekatanStates.nodes.val;
      if (!ma?.orig || ma.orig.length !== N.length) return null;
      const d = new Array(N.length * 3);
      for (let i = 0; i < N.length; i++) for (let c = 0; c < 3; c++) d[i * 3 + c] = N[i][c] - ma.orig[i][c];
      return { amp: ma.amp, d };
    }));
    await espera(dt);
  }
  const buenas = tomas.filter(Boolean);
  if (!buenas.length) { r.estado = "no-anima"; r.nota = "no se pudo leer ni un instante del ciclo"; return r; }
  r.nMuestras = buenas.length;

  // (a) ¿lo dibujado ES φ?  (b) ¿se parece a Dead MÁS que φ?
  r.cosPhiMin = Infinity; r.cosDeadMax = 0;
  const amps = [], normas = [];
  for (const t of buenas) {
    const c = coseno(t.d, phi0);
    if (c < r.cosPhiMin) r.cosPhiMin = c;
    const cd = coseno(t.d, base.dead);
    if (cd > r.cosDeadMax) r.cosDeadMax = cd;
    amps.push(t.amp); normas.push(norma(t.d));
  }
  // El exceso sobre φ, NO el coseno crudo con Dead.
  //
  // Un límite fijo de 0.2 al coseno con Dead reprobaría a un programa CORRECTO: en
  // `test-m-dual` el propio φ₁ tiene coseno 0.379 con la deformada de gravedad
  // (medido) — son dos vectores del mismo edificio, no tienen por qué ser
  // perpendiculares. Lo que delata el fallo es que lo dibujado se parezca a Dead
  // MÁS de lo que se le parece φ: con el fallo daba 1.000 contra 0.379 (exceso 0.62).
  r.excesoDead = r.deadNulo ? 0 : (r.cosDeadMax - r.cosPhiDead);

  // (c) ¿la componente dibujada dominante es la que dice la participación?
  const sum3 = (v) => { const s = [0, 0, 0]; for (let i = 0; i < v.length; i += 3) for (let c = 0; c < 3; c++) s[c] += v[i + c] * v[i + c]; return s; };
  const pico = buenas.reduce((a, b) => (Math.abs(b.amp) > Math.abs(a.amp) ? b : a));
  const eDib = sum3(pico.d);
  r.dirDibujada = eDib.indexOf(Math.max(...eDib));
  const p0 = (base.part[0] ?? [0, 0, 0]).slice(0, 3).map(Math.abs);
  r.dirParticipacion = p0.indexOf(Math.max(...p0));
  r.participacion = p0;
  r.energia = eDib;
  r.dirOk = Math.max(...p0) > 1e-9 ? r.dirDibujada === r.dirParticipacion : null;

  // (d) ¿oscila?: hay instantes con amplitud de los dos signos y pasa cerca de cero.
  const ampMax = Math.max(...amps.map(Math.abs));
  r.hayPositivos = amps.some((a) => a > 0.05 * ampMax);
  r.hayNegativos = amps.some((a) => a < -0.05 * ampMax);
  r.ampMinRel = ampMax > 0 ? Math.min(...amps.map(Math.abs)) / ampMax : 1;
  // amplitud ESTABLE: la mitad de atrás del muestreo llega al mismo pico que la de
  // adelante (una animación que se apaga o se dispara no lo cumple).
  const mitad = Math.ceil(buenas.length / 2);
  const picoA = Math.max(...amps.slice(0, mitad).map(Math.abs));
  const picoB = Math.max(...amps.slice(mitad).map(Math.abs));
  r.picoRel = picoA > 0 && picoB > 0 ? Math.min(picoA, picoB) / Math.max(picoA, picoB) : 0;
  // y el dibujo tiene que ser un ESCALADO de una forma fija: |d| / |amp| constante.
  const rel = buenas.map((t, i) => (Math.abs(t.amp) > 1e-9 ? normas[i] / Math.abs(t.amp) : null)).filter((x) => x !== null);
  const med = rel.reduce((a, b) => a + b, 0) / (rel.length || 1);
  r.dispersionEscala = med > 0 ? Math.max(...rel.map((x) => Math.abs(x - med))) / med : 1;

  // (e) cambiar de MODO cambia la forma dibujada — por el desplegable «Modo» de
  // verdad (Settings ▸ Resultado = Case ▸ Modo), que es el camino donde vivía el fallo.
  r.modos = [{ i: 0, cosPhi: r.cosPhiMin }];
  r.cosEntreModos = [];
  const formaModo0 = pico.d;
  for (const m of modosExtra) {
    if (m >= base.freqs.length) continue;
    const elegido = await pag.evaluate((n) => {
      const f = [...document.querySelectorAll(".tp-lblv")].find((e) =>
        (e.querySelector(".tp-lblv_l")?.textContent ?? "").trim() === "Modo");
      const s = f?.querySelector("select");
      if (!s || !s.options[n]) return null;
      s.selectedIndex = n; s.value = s.options[n].value;
      s.dispatchEvent(new Event("input", { bubbles: true }));
      s.dispatchEvent(new Event("change", { bubbles: true }));
      return s.options[n].textContent.trim();
    }, m);
    if (!elegido) { r.modos.push({ i: m, error: "no hay desplegable «Modo»" }); continue; }
    // ⚠️ NO vale esperar «un ratito» tras cambiar el desplegable. Con 900 ms fijos el test
    // fallaba una vez de cada tres con `cos(dibujo, φ) = 0.83`: se muestreaba un fotograma
    // del modo ANTERIOR y se comparaba contra φ del modo NUEVO. Se espera a que el animador
    // DIGA que ya está en ese modo (`currentMode()`), y luego un respiro para el primer ciclo.
    try {
      await pag.waitForFunction(
        (k) => window.__hekatanModalAnimator?.currentMode?.() === k,
        { timeout: 15000, polling: 100 }, m);
    } catch { r.modos.push({ i: m, error: "el animador no llegó a ese modo" }); continue; }
    await espera(700);
    const t2 = [];
    for (let k = 0; k < 6; k++) {
      t2.push(await pag.evaluate(() => {
        const v = document.querySelector("#viewer");
        const s = v.__settings ?? v.__ctx?.settings;
        const ma = s?.__modoAnim;
        const N = window.__hekatanStates.nodes.val;
        if (!ma?.orig || ma.orig.length !== N.length) return null;
        const d = new Array(N.length * 3);
        for (let i = 0; i < N.length; i++) for (let c = 0; c < 3; c++) d[i * 3 + c] = N[i][c] - ma.orig[i][c];
        return { amp: ma.amp, d };
      }));
      await espera(dt);
    }
    const b2 = t2.filter(Boolean);
    if (!b2.length) { r.modos.push({ i: m, error: "no anima ese modo" }); continue; }
    const phiM = soloTraslacion(base.phi[m] ?? []);
    const cM = Math.min(...b2.map((t) => coseno(t.d, phiM)));
    const p2 = b2.reduce((a, b) => (Math.abs(b.amp) > Math.abs(a.amp) ? b : a));
    const cCruz = coseno(p2.d, formaModo0);
    r.modos.push({ i: m, etiqueta: elegido, cosPhi: cM, cosConModo1: cCruz });
    r.cosEntreModos.push(cCruz);
  }
  r.cosPhiTodosMin = Math.min(...r.modos.map((m) => (typeof m.cosPhi === "number" ? m.cosPhi : 1)));
  r.cosEntreModosMax = r.cosEntreModos.length ? Math.max(...r.cosEntreModos) : null;
  return r;
}

/** `medirModelo` necesita saber armar la URL; se le cuelga a la página al abrirla. */
export function enganchar(visor) {
  visor.pag.__urlBase = visor.url;
  return visor.pag;
}

/**
 * Una PESTAÑA NUEVA para cada modelo, y se cierra al terminar.
 *
 * Reusando la misma pestaña, el barrido se moría a los 6-7 modelos con
 * «Attempted to use detached Frame»: cada modelo deja su escena de Three.js, su
 * WASM y su malla, y con losas de 1040 nudos el renderer se queda sin memoria y
 * Chrome tira la pestaña. Una pestaña por modelo devuelve esa memoria.
 */
export async function nuevaPagina(visor, { ancho = 1100, alto = 700 } = {}) {
  const pag = await visor.nav.newPage();
  await pag.setViewport({ width: ancho, height: alto });
  pag.on("pageerror", (e) => visor.errores.push(String(e.message).slice(0, 180)));
  pag.on("dialog", (d) => d.accept().catch(() => {}));
  pag.__urlBase = visor.url;
  return pag;
}
