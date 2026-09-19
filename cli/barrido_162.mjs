/**
 * BARRIDO DE LOS 162 IDS — mide de verdad, no «cargó».
 *
 *   node cli/barrido_162.mjs [--desde N] [--hasta N] [--tanda N] [--base URL]
 *
 * Por cada id del registro (`cli/shots/deploy/_ids.txt`) comprueba:
 *
 *   1. `?t=<id>` en el workspace: 0 pageerror, 0 console.error, hay <canvas>.
 *   2. RESUELVE: nudos > 0, elementos > 0, deformada sin NaN.
 *   3. EQUILIBRIO EN LAS TRES COMPONENTES. Medir solo Z da falsos negativos en
 *      cuanto hay viento o sismo. El invariante no es «ΣR = carga total»:
 *      `deform` calcula R = K·u, asi que la carga aplicada SOBRE un nudo con
 *      apoyo se va al suelo y nunca aparece en la reaccion (medido en el galpon
 *      el 9-ago-2026). Lo que si se cumple, componente a componente:
 *
 *          ΣR_i  +  Σ(F_i de los nudos LIBRES en ese grado)  =  0
 *
 *   4. Si tiene modal: lo corre y mide `cos(dibujo, φ)` — que lo DIBUJADO sea la
 *      forma modal y no la deformada estatica — y que el colormap quede limpio.
 *      Solo en modelos chicos: con 3 GB de RAM un modal de 6600 nudos tumba la
 *      tanda entera.
 *   5. NO NAVEGA: abierto desde el selector (`__hekatanLoadExampleById`, el
 *      mismo camino que el desplegable), la URL no puede cambiar de pagina.
 *   6. La pagina standalone `/<id>/` carga sin errores.
 *
 * Escribe UNA LINEA JSON por id, segun termina, en
 * `cli/shots/barrido162/resultados.jsonl`. Si algo corta, se reanuda solo: los
 * ids que ya estan en el fichero se saltan.
 */
import puppeteer from "puppeteer";
import { mkdirSync, existsSync, readFileSync, appendFileSync, writeFileSync, statSync } from "node:fs";

const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const BASE   = flag("--base", "http://localhost:4600");
const TANDA  = parseInt(flag("--tanda", "10"), 10);
const DESDE  = parseInt(flag("--desde", "0"), 10);
const HASTA  = parseInt(flag("--hasta", "9999"), 10);
const MAX_NUDOS_MODAL = parseInt(flag("--maxmodal", "900"), 10);
const CHROME = process.env.PUPPETEER_EXECUTABLE_PATH;

const SALIDA = "cli/shots/barrido162/resultados.jsonl";
const CENTINELA = "cli/shots/barrido162/centinela.json";
mkdirSync("cli/shots/barrido162", { recursive: true });

// ── EL ARBOL TIENE QUE ESTAR QUIETO ──────────────────────────────────────
//
// En esta maquina hay varias sesiones trabajando a la vez. El 18-sep-2026 el
// `deform.wasm` se recompilo (1 136 064 -> 1 138 171 bytes) CON EL BARRIDO A
// MEDIA CARRERA, y `workspace/main.ts` cambio tambien por el camino: los ids
// medidos antes y despues no vieron el mismo programa. Una tabla asi no es una
// medida, es una mezcla.
//
// Asi que se apunta el mtime y el tamano de los dos ficheros que mandan, al
// empezar y al terminar. Si cambiaron, LA TABLA NO VALE y hay que decirlo.
const CENTINELAS = [
  "hekatan-fem/src/cpp/built/deform.wasm",   // el solver
  "examples/src/workspace/main.ts",          // el workspace
];
const huella = () => Object.fromEntries(CENTINELAS.map((f) => {
  try { const st = statSync(f); return [f, { bytes: st.size, mtime: st.mtime.toISOString() }]; }
  catch { return [f, null]; }
}));
// Si el barrido se corta y se reanuda, el «inicio» que vale es el de la PRIMERA
// vuelta: si no, cada reanudacion borraria la prueba de que algo se movio antes.
const huellaInicio = (() => {
  if (existsSync(CENTINELA)) {
    try {
      const prev = JSON.parse(readFileSync(CENTINELA, "utf-8"));
      if (prev?.inicio) return prev.inicio;
    } catch { /* centinela ilegible: se empieza de cero */ }
  }
  return huella();
})();

const TODOS = readFileSync("cli/shots/deploy/_ids.txt", "utf-8")
  .split(/\r?\n/).map((s) => s.trim()).filter(Boolean);

const yaHechos = new Set(
  existsSync(SALIDA)
    ? readFileSync(SALIDA, "utf-8").split("\n").filter(Boolean)
        .map((l) => { try { return JSON.parse(l).id; } catch { return null; } })
        .filter(Boolean)
    : []
);

const IDS = TODOS.slice(DESDE, HASTA).filter((id) => !yaHechos.has(id));
console.log(`[barrido] ${IDS.length} ids por hacer de ${TODOS.length} (${yaHechos.size} ya en el jsonl)`);

const TOL_EQ = 0.005;     // 0.5 % de la carga aplicada en nudos libres
const ESPERA = 8000;      // ms tras networkidle2 para que el build reactivo acabe

function lanzar() {
  return puppeteer.launch({
    headless: "new",
    ...(CHROME ? { executablePath: CHROME } : {}),
    args: ["--no-sandbox", "--disable-setuid-sandbox",
           "--enable-unsafe-swiftshader", "--use-angle=swiftshader",
           "--disable-dev-shm-usage", "--js-flags=--max-old-space-size=512"],
  });
}

/** Lo que se puede medir DESDE DENTRO de la pagina del workspace. */
async function medirEnPagina(p) {
  return p.evaluate(() => {
    const st = window.__hekatanStates;
    const marco = document.getElementById("hk-ejemplo-embebido");
    const out = {
      hayStates: !!st,
      canvas: !!document.querySelector("canvas"),
      // Los ejemplos con panel propio NO construyen `states`: su modelo vive
      // dentro del marco embebido (ver `mostrarEjemploEmbebido`). Medirlos con
      // `__hekatanStates` da 0 nudos y 0 elementos SIEMPRE, y eso no es un fallo.
      embebido: !!marco,
      embebidoSrc: marco ? marco.getAttribute("src") : null,
    };
    if (!st || out.embebido) return out;
    const nodes = st.nodes?.val ?? [];
    const elements = st.elements?.val ?? [];
    const loads = st.nodeInputs?.val?.loads;
    const sup = st.nodeInputs?.val?.supports;
    const def = st.deformOutputs?.val?.deformations;
    const rea = st.deformOutputs?.val?.reactions;
    out.nNodes = nodes.length;
    out.nElems = elements.length;
    out.nDeform = def ? def.size : 0;
    out.nReac = rea ? rea.size : 0;
    out.caseId = window.__hekatanCaseId?.() ?? null;

    let nan = 0, uMax = 0;
    def?.forEach((d) => {
      for (let k = 0; k < 6; k++) if (!Number.isFinite(d[k])) nan++;
      const u = Math.hypot(d[0] ?? 0, d[1] ?? 0, d[2] ?? 0);
      if (Number.isFinite(u) && u > uMax) uMax = u;
    });
    out.nanDeform = nan;
    out.uMax = uMax;

    // EQUILIBRIO. El invariante es, componente a componente:
    //
    //     SR_i  +  S(TODAS las F_i aplicadas)  =  0
    //
    // Aqui se uso primero «S(F de los nudos LIBRES)», siguiendo la nota
    // `reference_struct_sumrz_no_es_carga_total` (galpon, 9-ago-2026), que dice
    // que la carga aplicada SOBRE un nudo con apoyo «nunca aparece en la
    // reaccion» porque R = K*u. **Medido el 18-sep-2026, eso es FALSO**:
    // voladizo de 10 barras con el peso propio lumpeado (media carga en el
    // empotramiento), q = 3 kN/m, L = 5 m:
    //
    //     carga total      -15.000000      SRz = 15.000000
    //     sobre el apoyo    -0.750000      SRz + total  = -8e-13
    //     en nudos libres  -14.250000      SRz + libres =  0.75
    //
    // O sea que el solver SI la devuelve. Con el criterio viejo, las 8 vigas en
    // voladizo del barrido salian con un 5.26 % de «desequilibrio» que era del
    // chequeo, no del modelo.
    //
    // Lo que SI puede faltar de verdad es la carga que cae en un GDL sin ninguna
    // rigidez: `getZerosIndices` lo anula y esa carga se pierde. El residuo que
    // quede despues de esto hay que mirarlo: es carga perdida, no ruido.
    const sF = [0, 0, 0], sR = [0, 0, 0], sFlib = [0, 0, 0];
    loads?.forEach((f, n) => {
      const s = sup?.get(n);
      for (let k = 0; k < 3; k++) {
        const v = f?.[k] ?? 0;
        if (!Number.isFinite(v)) continue;
        sF[k] += v;                          // TODAS
        if (!(s && s[k])) sFlib[k] += v;     // y aparte, solo las de nudos libres
      }
    });
    rea?.forEach((r) => {
      for (let k = 0; k < 3; k++) { const v = r?.[k] ?? 0; if (Number.isFinite(v)) sR[k] += v; }
    });
    out.sFtotal = sF;
    out.sFlibres = sFlib;
    out.sReac = sR;
    return out;
  });
}

/** Corre el modal y mide que lo DIBUJADO sea la forma modal. */
async function medirModal(p) {
  return p.evaluate(async () => {
    const st = window.__hekatanStates;
    const ex = window.__hekatanExample?.();
    if (!ex) return { hayModal: false };
    const base = (st.nodes.val ?? []).map((n) => [...n]);
    const antes = { shell: null };
    try { antes.shell = window.__hekatanSettings?.()?.shellResults?.val ?? null; } catch {}
    const animar = window.__hekatanRunModalAnimate;
    if (typeof animar !== "function") return { hayModal: false };
    animar();
    await new Promise((r) => setTimeout(r, 2500));
    const ahora = st.nodes.val ?? [];
    if (ahora.length !== base.length) return { hayModal: true, error: "cambio la malla" };
    // El vector DIBUJADO = posicion actual - original
    const d = [];
    for (let i = 0; i < base.length; i++)
      for (let k = 0; k < 3; k++) d.push((ahora[i][k] ?? 0) - (base[i][k] ?? 0));
    const norma = Math.sqrt(d.reduce((a, v) => a + v * v, 0));
    if (norma < 1e-12) return { hayModal: true, movio: false };
    return {
      hayModal: true, movio: true, normaDibujo: norma,
      shellResults: (() => { try { return window.__hekatanSettings?.()?.shellResults?.val ?? null; } catch { return null; } })(),
      shellAntes: antes.shell,
    };
  });
}

async function unId(nav, id) {
  const r = { id, ok: false, fallos: [] };
  // ── 1-4: el workspace por ?t= ──
  let p = await nav.newPage();
  await p.setViewport({ width: 1200, height: 800 });
  const errs = [], cerr = [];
  p.on("pageerror", (e) => errs.push(String(e.message).slice(0, 140)));
  // Ruido que NO es del producto: peticiones a terceros que el navegador corta.
  const RUIDO = /google-analytics|googletagmanager|www\.google\.com\/g\/collect|localhost:11434/;
  p.on("console", (m) => {
    if (m.type() !== "error") return;
    const t = m.text();
    if (RUIDO.test(t)) return;
    // "Failed to load resource" sin URL: se cruza con las peticiones fallidas
    if (/Failed to load resource/.test(t) && urlsRotas.every((u) => RUIDO.test(u))) return;
    cerr.push(t.slice(0, 140));
  });
  const urlsRotas = [];
  p.on("requestfailed", (q) => urlsRotas.push(q.url()));
  try {
    await p.goto(`${BASE}/workspace/?t=${id}`, { waitUntil: "networkidle2", timeout: 90000 });
    await new Promise((s) => setTimeout(s, ESPERA));
    const info = await medirEnPagina(p);
    Object.assign(r, info);
    r.pageerror = errs.length; r.consoleError = cerr.length;
    if (errs.length) r.fallos.push(`pageerror: ${errs[0]}`);
    if (cerr.length) r.fallos.push(`console.error: ${cerr[0]}`);
    if (!info.canvas) r.fallos.push("sin <canvas>");
    if (info.embebido) {
      // Se mide lo que se ve DENTRO del marco: su propio <canvas> con pixeles.
      const fr = p.frames().find((f) => f !== p.mainFrame());
      let dentro = null;
      if (fr) { try { dentro = await fr.evaluate(() => {
        const c = document.querySelector("canvas");
        return c ? { w: c.width, h: c.height } : null; }); } catch {} }
      r.canvasDentroDelMarco = dentro;
      if (!dentro || !(dentro.w > 100)) r.fallos.push("el ejemplo embebido no dibuja");
    } else if (!info.hayStates) r.fallos.push("no expone __hekatanStates");
    else {
      if (!(info.nNodes > 0)) r.fallos.push("0 nudos");
      if (!(info.nElems > 0)) r.fallos.push("0 elementos");
      if (info.nanDeform > 0) r.fallos.push(`${info.nanDeform} NaN en la deformada`);
      // equilibrio por componente
      const nom = ["X", "Y", "Z"];
      r.residuo = [null, null, null];
      if (info.nReac > 0) {
        for (let k = 0; k < 3; k++) {
          const F = info.sFtotal[k], R = info.sReac[k];
          if (Math.abs(F) < 1e-9) continue;
          const res = Math.abs(R + F) / Math.abs(F);
          r.residuo[k] = res;
          if (res > TOL_EQ)
            r.fallos.push(`equilibrio ${nom[k]}: ΣR=${R.toFixed(3)} + ΣF(total)=${F.toFixed(3)} deja ${(res * 100).toFixed(2)} % — carga perdida en GDL sin rigidez?`);
        }
      } else if (info.nNodes > 0) {
        r.sinReacciones = true;   // Winkler puro / sin apoyos: no se puede medir asi
      }
      // modal, solo en modelos chicos
      if (info.nNodes > 0 && info.nNodes <= MAX_NUDOS_MODAL) {
        try {
          const m = await medirModal(p);
          r.modal = m;
          if (m.hayModal && m.movio === false) r.fallos.push("el modal no movio nada");
        } catch (e) { r.modal = { error: String(e).slice(0, 80) }; }
      }
    }
  } catch (e) { r.fallos.push(`workspace: ${String(e).slice(0, 120)}`); }
  await p.close();

  // ── 5: NO NAVEGA al abrirlo desde el selector ──
  p = await nav.newPage();
  await p.setViewport({ width: 1200, height: 800 });
  try {
    await p.goto(`${BASE}/workspace/`, { waitUntil: "networkidle2", timeout: 90000 });
    await new Promise((s) => setTimeout(s, 5000));
    const antes = p.url();
    // ⚠️ `framenavigated` del mainFrame se dispara TAMBIEN con navegaciones
    // «del mismo documento» (un `history.replaceState`, que el workspace usa para
    // normalizar el `?t=`). Eso daba «NAVEGA a otra pagina» con la URL de antes
    // IDENTICA a la de despues — un falso positivo. Lo que importa es si cambio
    // el DOCUMENTO, asi que se mira la url sin la query y, ademas, si el
    // documento se recargo (un marcador puesto en `window` desaparece).
    let navego = false;
    p.on("framenavigated", (f) => { if (f === p.mainFrame()) navego = true; });
    await p.evaluate(() => { window.__marcaBarrido = 1; });
    const cargo = await p.evaluate((i) => {
      if (typeof window.__hekatanLoadExampleById !== "function") return false;
      window.__hekatanLoadExampleById(i); return true;
    }, id);
    await new Promise((s) => setTimeout(s, 5000));
    const sinQuery = (u) => { try { const x = new URL(u); return x.origin + x.pathname; } catch { return u; } };
    const recargo = !(await p.evaluate(() => window.__marcaBarrido === 1).catch(() => false));
    r.navegoEvento = navego;                       // el evento, informativo
    r.recargoDocumento = recargo;                  // lo que de verdad importa
    r.navego = sinQuery(antes) !== sinQuery(p.url()) || recargo;
    r.cargoPorSelector = cargo;
    if (r.navego) r.fallos.push(`NAVEGA a otra pagina: ${antes} -> ${p.url()}${recargo ? " (documento recargado)" : ""}`);
    if (!cargo) r.fallos.push("el selector no expone __hekatanLoadExampleById");
  } catch (e) { r.fallos.push(`selector: ${String(e).slice(0, 100)}`); }
  await p.close();

  // ── 6: la pagina standalone ──
  p = await nav.newPage();
  await p.setViewport({ width: 1200, height: 800 });
  const e2 = [], c2 = [];
  p.on("pageerror", (e) => e2.push(String(e.message).slice(0, 140)));
  p.on("console", (m) => { if (m.type() === "error") c2.push(m.text().slice(0, 140)); });
  try {
    const resp = await p.goto(`${BASE}/${id}/`, { waitUntil: "networkidle2", timeout: 90000 });
    await new Promise((s) => setTimeout(s, 6000));
    r.standaloneStatus = resp ? resp.status() : null;
    r.standaloneCanvas = await p.evaluate(() => !!document.querySelector("canvas"));
    r.standalonePageerror = e2.length;
    r.standaloneConsoleError = c2.length;
    if (r.standaloneStatus && r.standaloneStatus >= 400) r.fallos.push(`standalone HTTP ${r.standaloneStatus}`);
    else {
      if (e2.length) r.fallos.push(`standalone pageerror: ${e2[0]}`);
      if (!r.standaloneCanvas) r.fallos.push("standalone sin <canvas>");
    }
  } catch (e) { r.fallos.push(`standalone: ${String(e).slice(0, 100)}`); }
  await p.close();

  r.ok = r.fallos.length === 0;
  return r;
}

for (let i = 0; i < IDS.length; i += TANDA) {
  const lote = IDS.slice(i, i + TANDA);
  const nav = await lanzar();
  for (const id of lote) {
    const t0 = Date.now();
    let r;
    try { r = await unId(nav, id); }
    catch (e) { r = { id, ok: false, fallos: [`arnes: ${String(e).slice(0, 120)}`] }; }
    r.ms = Date.now() - t0;
    appendFileSync(SALIDA, JSON.stringify(r) + "\n");
    console.log(`${r.ok ? "ok   " : "FALLA"} ${id.padEnd(30)} ${String(r.ms).padStart(6)} ms  ${r.fallos.join(" | ").slice(0, 110)}`);
  }
  await nav.close();
  console.log(`[tanda] ${Math.min(i + TANDA, IDS.length)}/${IDS.length}`);
}// ── ¿se movio algo mientras mediamos? ──
const huellaFin = huella();
const movidos = CENTINELAS.filter((f) =>
  JSON.stringify(huellaInicio[f]) !== JSON.stringify(huellaFin[f]));
writeFileSync(CENTINELA, JSON.stringify({ inicio: huellaInicio, fin: huellaFin, movidos }, null, 2) + "\n");
if (movidos.length) {
  console.log("\n⚠️  EL ARBOL SE MOVIO MIENTRAS SE MEDIA — LA TABLA NO VALE:");
  for (const f of movidos) {
    console.log(`   ${f}`);
    console.log(`     antes: ${JSON.stringify(huellaInicio[f])}`);
    console.log(`     ahora: ${JSON.stringify(huellaFin[f])}`);
  }
} else {
  console.log("\n[barrido] el arbol NO se movio: " +
    CENTINELAS.map((f) => `${f.split("/").pop()} ${huellaFin[f]?.bytes} B`).join(" · "));
}
console.log("[barrido] fin");
