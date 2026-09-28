#!/usr/bin/env node
/**
 * test_todo.mjs — UN solo comando que revisa TODO Hekatan Struct, en LOCAL y en el sitio PÚBLICO.
 *
 *   node cli/test_todo.mjs                 todo, en los dos sitios (horas)
 *   node cli/test_todo.mjs local           solo el build local
 *   node cli/test_todo.mjs publico         solo GitHub Pages
 *   node cli/test_todo.mjs --rapido        lo mismo, sin los barridos largos (muestra de 8 ejemplos)
 *   node cli/test_todo.mjs --lista         enseña los pasos y sale
 *
 *   --capas=fuente,interfaz,ejemplos,capturas     solo esas capas
 *   --solo=texto                                   solo los pasos cuyo nombre lleve ese texto
 *   --tiempo=900                                   límite por paso, en segundos
 *   --reanudar=<carpeta>                           sigue una corrida cortada: salta lo ya hecho
 *   --build                                        reconstruye el build local antes de medir
 *
 * POR QUÉ (Jorge, 28-sep-2026: «quiero un test entero que revise todo»): había 33 `ctl_*`,
 * 17 `shot_*`, 8 `check_deploy*`, el barrido de los ejemplos, 86 casos numéricos y los tests
 * de Python, cada uno con su manera de llamarse y su carpeta de salida. No se escribe ninguna
 * prueba nueva: se corren LAS QUE YA HAY, una detrás de otra, y se juntan en un informe.
 *
 * Las capas:
 *   fuente     lo que no depende del sitio: casos numéricos contra CSI (`tests/run.mjs`),
 *              pytest del motor de Python, ¿el sitio público es el build local?, lista de ids
 *   interfaz   los `ctl_*`: botones, teclas y clics de verdad
 *   ejemplos   ejemplo por ejemplo: carga, resuelve, equilibrio, modal, exportar a CSI
 *   capturas   los `shot_*`: PNG para MIRAR (colormap, muros, plantillas, secciones)
 *
 * Local y público corren EL MISMO guion: `cli/lib/destino.mjs` cambia la URL de `page.goto`
 * y copia cada captura a la carpeta del paso.
 *
 * Veredicto de un paso:
 *   ok             terminó, todas sus comprobaciones pasan y la página no dio `pageerror`
 *   FALLA          código de salida ≠ 0, alguna comprobación no pasa, o hubo `pageerror`
 *   COLGADO        pasó el límite de tiempo y se mató
 *   solo capturas  terminó sin error pero no comprueba ningún número: hay que mirar el PNG
 *
 * Salida: cli/shots/test_todo/<fecha>/informe.html · informe.md · resumen.json
 * Sale con código 1 si algún paso falla o se cuelga.
 */
import { spawn, spawnSync } from "node:child_process";
import {
  readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync, statSync, renameSync,
  createWriteStream, statfsSync, copyFileSync, cpSync, rmSync,
} from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join, relative, resolve, sep } from "node:path";
import os from "node:os";

const CLI = dirname(fileURLToPath(import.meta.url));
const RAIZ = join(CLI, "..");
const BUNDLE = join(RAIZ, "website", "src", "examples");
const PRELOAD = pathToFileURL(join(CLI, "lib", "destino.mjs")).href;
const PUBLICA = (process.env.HK_URL_PUBLICA ||
  "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/").replace(/\/*$/, "/");

// ── argumentos ──────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const opcion = (n, d) => { const a = argv.find((x) => x.startsWith(`--${n}=`)); return a ? a.slice(n.length + 3) : d; };
const hay = (n) => argv.includes(`--${n}`);
const donde = argv.find((a) => ["local", "publico", "ambos"].includes(a)) || "ambos";
const DESTINOS = donde === "ambos" ? ["local", "publico"] : [donde];
const CAPAS = opcion("capas", "fuente,interfaz,ejemplos,capturas").split(",").map((s) => s.trim());
const SOLO = opcion("solo", "");
const RAPIDO = hay("rapido");
const TIEMPO = parseInt(opcion("tiempo", "900"), 10);
const REANUDAR = opcion("reanudar", "");
const MIN_DISCO_GB = 2;

const sello = () => { const d = new Date(), p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}`; };
const OUT = REANUDAR ? resolve(REANUDAR) : join(CLI, "shots", "test_todo", sello());

// ── los pasos ───────────────────────────────────────────────────────────────
const fuenteDe = (f) => { try { return readFileSync(join(CLI, f), "utf-8"); } catch { return ""; } };
const existe = (f) => existsSync(join(CLI, f));

/** Un guion de `cli/` como paso. `args` puede depender del destino. */
const guion = (capa, archivo, extra = {}) => ({ capa, archivo, nombre: archivo.replace(/\.mjs$/, ""), ...extra });

const CTL = readdirSync(CLI).filter((f) => /^ctl_.*\.mjs$/.test(f)).sort();

const POR_SITIO = [
  // interfaz
  ...CTL.map((f) => guion("interfaz", f, {
    // los que ya sabían ir al público lo hacen por su argumento: así no levantan su servidor
    args: (d) => (d === "publico" && fuenteDe(f).includes('=== "publico"') ? ["publico"] : []),
  })),
  guion("interfaz", "check_panel_tabla.mjs", { args: () => ["local"] }),
  // ejemplos
  guion("ejemplos", "check_deploy.mjs"),
  guion("ejemplos", "check_deploy_ejemplos.mjs", { analiza: "json" }),
  guion("ejemplos", "check_deploy_csi.mjs"),
  guion("ejemplos", "check_deploy_hover.mjs"),
  guion("ejemplos", "check_deploy_colormap_scope.mjs"),
  guion("ejemplos", "check_deploy_longtasks.mjs", { args: () => ["edificio-dual"] }),
  guion("ejemplos", "check_deploy_modal_hang.mjs", { args: () => ["edificio-dual", "1"] }),
  guion("ejemplos", "check_ejemplos_rescatados.mjs", { tiempo: 3600 }),
  guion("ejemplos", "test_todos_ejemplos.mjs", { args: (d) => (d === "publico" ? ["--deploy"] : []), largo: true, alFinal: true, tiempo: 3 * 3600 }),
  guion("ejemplos", "barrido_162.mjs", {
    especial: "barrido", tiempo: 5 * 3600, alFinal: !RAPIDO,
    args: (d) => [...(d === "publico" ? ["--base", PUBLICA.replace(/\/$/, "")] : []), ...(RAPIDO ? ["--hasta", "8"] : [])],
  }),
  // en el sitio público el modal en headless se cuelga (medido 25 y 40 min): solo en local
  guion("ejemplos", "check_animacion_modal.mjs", { soloEn: "local", tiempo: 3 * 3600, alFinal: !RAPIDO, args: () => (RAPIDO ? ["test-m-dual"] : []) }),
  // capturas
  guion("capturas", "shot_categorias.mjs"),
  guion("capturas", "shot_cad_dibujar.mjs"),
  guion("capturas", "shot_modal_anim.mjs", { args: () => ["local"] }),
  guion("capturas", "shot_muros.mjs", { tiempo: 1800 }),
  guion("capturas", "shot_plantillas.mjs"),
  guion("capturas", "shot_plantillas_colormap.mjs", { tiempo: 3600 }),
  guion("capturas", "shot_extrusion.mjs"),
  guion("capturas", "shot_estructura_mixta.mjs"),
  guion("capturas", "shot_cubierta.mjs"),
];

const DE_FUENTE = [
  // --build: reconstruye el build local ANTES de medir. Si falla, se devuelve el que había.
  ...(hay("build") ? [{ capa: "fuente", nombre: "construir_build_local", especial: "build", cmd: "npm", argsFijos: ["run", "build:deploy"], shell: true, tiempo: 3600 }] : []),
  { capa: "fuente", nombre: "sitio_publico_igual_al_build", especial: "deploy" },
  { capa: "fuente", nombre: "casos_numericos_vs_csi", cmd: "node", script: join("tests", "run.mjs"), tiempo: 3600 },
  { capa: "fuente", nombre: "pytest_motor_python", cmd: "python", argsFijos: ["-m", "pytest", "tests", "-q", "-p", "no:cacheprovider"],
    cwd: join(RAIZ, "hekatan-struct-py"), env: { PYTHONPATH: join(RAIZ, "hekatan-struct-py", "src") }, analiza: "pytest", tiempo: 3600 },
  { capa: "fuente", nombre: "lista_de_ids_al_dia", cmd: "node", script: join("cli", "gen_ids_deploy.mjs"), argsFijos: ["--ver"], analiza: "ids" },
  { capa: "fuente", nombre: "shot_secciones", cmd: "node", script: join("cli", "shot_secciones.mjs") },
  // pinta a propósito el estado «✗ El análisis modal NO se ejecutó»: aquí manda el código de salida
  { capa: "fuente", nombre: "shot_modal_panel", cmd: "node", script: join("cli", "shot_modal_panel.mjs"), analiza: "codigo" },
];

const NO_INCLUIDOS = [
  ["shot_url.mjs", "necesita que le den la URL"],
  ["shot_galpon_dev.mjs", "abre un .heks del servidor de desarrollo, que no está en el build"],
  ["shot_vs_muros.mjs", "escribe en validation/modelos/ (ficheros versionados)"],
  ["shot_todos.mjs", "una captura por ejemplo: ya la deja el barrido"],
  ["shot_colormap_todos.mjs", "barrido de colormap de todos los ejemplos: correr a mano"],
  ["shot_deformadas.mjs", "necesita la lista de ids"],
  ["probe_*.mjs, _deploy_*.mjs, _sonda_*.mjs", "sondas de diagnóstico, no pruebas"],
];

const pasos = [];
if (CAPAS.includes("fuente")) for (const p of DE_FUENTE) pasos.push({ ...p, destino: "fuente" });
for (const d of DESTINOS)
  for (const p of POR_SITIO) {
    if (!CAPAS.includes(p.capa)) continue;
    if (p.soloEn && p.soloEn !== d) continue;
    if (RAPIDO && p.largo) continue;
    if (!existe(p.archivo)) continue;
    pasos.push({ ...p, destino: d, cmd: "node", script: join("cli", p.archivo), argsFijos: p.args ? p.args(d) : [] });
  }
// los barridos de horas van al final: así lo rápido de los dos sitios sale primero
const lista = pasos.filter((p) => !SOLO || p.nombre.includes(SOLO))
  .map((p, i) => ({ p, i })).sort((a, b) => (+!!a.p.alFinal - +!!b.p.alFinal) || (a.i - b.i)).map((x) => x.p);

if (hay("lista")) {
  for (const p of lista) console.log(`${p.destino.padEnd(8)} ${p.capa.padEnd(9)} ${p.nombre}  ${(p.argsFijos ?? []).join(" ")}`);
  console.log(`\n${lista.length} pasos`);
  process.exit(0);
}

// ── utilidades ──────────────────────────────────────────────────────────────
const gbLibres = () => { try { const s = statfsSync(OUT); return (s.bavail * s.bsize) / 2 ** 30; } catch { return NaN; } };
const huellaDe = (f) => { try { const st = statSync(f); return { bytes: st.size, mtime: st.mtime.toISOString() }; } catch { return null; } };
const CENTINELAS = [
  join(RAIZ, "hekatan-fem", "src", "cpp", "built", "deform.wasm"),
  join(RAIZ, "examples", "src", "workspace", "main.ts"),
  join(BUNDLE, "workspace", "index.html"),
];
const huella = () => Object.fromEntries(CENTINELAS.map((f) => [relative(RAIZ, f).split(sep).join("/"), huellaDe(f)]));

function masNuevo(dir, mejor = { t: 0, f: "" }) {
  let ents = [];
  try { ents = readdirSync(dir, { withFileTypes: true }); } catch { return mejor; }
  for (const e of ents) {
    if (e.name === "node_modules" || e.name === "built" || e.name.startsWith(".")) continue;
    const f = join(dir, e.name);
    if (e.isDirectory()) masNuevo(f, mejor);
    else if (/\.(ts|js|mjs|css|html|cpp|h)$/.test(e.name)) {
      const t = statSync(f).mtimeMs; if (t > mejor.t) { mejor.t = t; mejor.f = f; }
    }
  }
  return mejor;
}

function todosLosArchivos(dir, base = dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const f = join(dir, e.name);
    if (e.isDirectory()) todosLosArchivos(f, base, out);
    else out.push(relative(base, f).split(sep).join("/"));
  }
  return out;
}

function matarArbol(pid) {
  if (process.platform === "win32") spawnSync("taskkill", ["/PID", String(pid), "/T", "/F"], { stdio: "ignore" });
  else { try { process.kill(-pid, "SIGKILL"); } catch { try { process.kill(pid, "SIGKILL"); } catch { /* ya no está */ } } }
}

const RESUMEN_RE = /^\s*(OK|FALLA):\s*\d+\s*\/\s*\d+/;
function contar(texto, modo) {
  let ok = 0, no = 0; const lineas = [];
  if (modo === "codigo") return { ok, no, lineas };
  const L = texto.split(/\r?\n/);
  if (modo === "pytest") {
    const fin = [...L].reverse().find((l) => /\b(passed|failed|error)\b/.test(l)) || "";
    const n = (re) => { const m = re.exec(fin); return m ? +m[1] : 0; };
    ok = n(/(\d+) passed/); no = n(/(\d+) failed/) + n(/(\d+) error/);
    for (const l of L) if (/^(FAILED|ERROR) /.test(l)) lineas.push(l.trim().slice(0, 220));
    return { ok, no, lineas, nota: fin.replace(/=+/g, "").trim() };
  }
  if (modo === "ids") {
    const sale = /SALEN \((\d+)/.exec(texto), entra = /ENTRAN \((\d+)/.exec(texto);
    no = (sale ? +sale[1] : 0) + (entra ? +entra[1] : 0); ok = no ? 0 : 1;
    for (const l of L) if (/^(SALEN|ENTRAN) \([1-9]/.test(l)) lineas.push(l.trim().slice(0, 220));
    return { ok, no, lineas, nota: (L.find((l) => l.startsWith("registro:")) || "").trim() };
  }
  if (modo === "json") {
    for (const l of L) {
      if (!l.startsWith("{")) continue;
      try { const j = JSON.parse(l); if (typeof j.ok !== "boolean") continue;
        if (j.ok) ok++; else { no++; lineas.push(`${j.id}: ${(j.fallos ?? []).join(" | ")}`.slice(0, 220)); } } catch { /* no es una fila */ }
    }
    return { ok, no, lineas };
  }
  for (const l of L) {
    if (RESUMEN_RE.test(l)) continue;
    if (/^\s*(✓|✔|ok\b)/.test(l)) ok++;
    else if (/^\s*(✗|✘|NO\b|FALLA\b)/.test(l)) { no++; lineas.push(l.trim().slice(0, 220)); }
    else if (/^\s+ERROR: /.test(l)) { no++; lineas.push(l.trim().slice(0, 220)); }
  }
  return { ok, no, lineas };
}

function leerJson(f, d = null) { try { return JSON.parse(readFileSync(f, "utf-8")); } catch { return d; } }

// ── correr un paso ──────────────────────────────────────────────────────────
function lanzar(paso, dir) {
  return new Promise((resuelve) => {
    const env = { ...process.env, ...(paso.env ?? {}), HK_SALIDA: dir, HK_GUION: paso.nombre, HK_URL_PUBLICA: PUBLICA, FORCE_COLOR: "0", PYTHONIOENCODING: "utf-8" };
    delete env.HK_DESTINO; delete env.URL_BASE;
    if (paso.destino !== "fuente") env.HK_DESTINO = paso.destino;
    if (paso.destino === "publico") env.URL_BASE = PUBLICA;
    const args = paso.cmd === "node"
      ? ["--import", PRELOAD, paso.script, ...(paso.argsFijos ?? [])]
      : [...(paso.argsFijos ?? [])];
    const ejecutable = paso.cmd === "node" ? process.execPath : paso.cmd;
    const salida = createWriteStream(join(dir, "salida.txt"));
    let texto = "";
    const t0 = Date.now();
    let colgado = false;
    const hijo = paso.shell
      ? spawn([ejecutable, ...args].join(" "), { cwd: paso.cwd ?? RAIZ, env, windowsHide: true, shell: true })
      : spawn(ejecutable, args, { cwd: paso.cwd ?? RAIZ, env, windowsHide: true });
    const junta = (b) => { salida.write(b); if (texto.length < 4e6) texto += b.toString("utf-8"); };
    hijo.stdout.on("data", junta); hijo.stderr.on("data", junta);
    const limite = (paso.tiempo ?? TIEMPO) * 1000;
    const reloj = setTimeout(() => { colgado = true; matarArbol(hijo.pid); }, limite);
    hijo.on("error", (e) => { junta(Buffer.from(`\n[no arrancó] ${e.message}\n`)); });
    hijo.on("close", (codigo) => {
      clearTimeout(reloj); salida.end();
      resuelve({ codigo, colgado, texto, seg: (Date.now() - t0) / 1000 });
    });
  });
}

async function compararDeploy(dir) {
  const archivos = todosLosArchivos(BUNDLE);
  const filas = []; let i = 0;
  const uno = async () => {
    while (i < archivos.length) {
      const rel = archivos[i++];
      const local = readFileSync(join(BUNDLE, rel));
      let estado = "igual", detalle = "";
      try {
        const r = await fetch(PUBLICA + rel.split("/").map(encodeURIComponent).join("/"), { signal: AbortSignal.timeout(60000) });
        if (!r.ok) { estado = "falta"; detalle = `HTTP ${r.status}`; }
        else {
          const remoto = Buffer.from(await r.arrayBuffer());
          const h = (b) => createHash("sha1").update(b).digest("hex");
          if (h(remoto) !== h(local)) { estado = "distinto"; detalle = `${local.length} B local · ${remoto.length} B público`; }
        }
      } catch (e) { estado = "error"; detalle = String(e?.message ?? e).slice(0, 80); }
      filas.push({ rel, estado, detalle });
    }
  };
  await Promise.all(Array.from({ length: 8 }, uno));
  writeFileSync(join(dir, "archivos.json"), JSON.stringify(filas.filter((f) => f.estado !== "igual"), null, 1));
  const igual = filas.filter((f) => f.estado === "igual").length;
  const malos = filas.filter((f) => f.estado !== "igual");
  return {
    ok: igual, no: malos.length,
    lineas: malos.slice(0, 40).map((f) => `${f.estado}: ${f.rel} ${f.detalle}`),
    nota: `${igual} de ${filas.length} archivos del build local son idénticos en el sitio público`,
  };
}

async function correr(paso, k) {
  const dir = join(OUT, paso.destino, paso.capa, paso.nombre);
  mkdirSync(dir, { recursive: true });
  const hecho = join(dir, "paso.json");
  if (REANUDAR && existsSync(hecho)) { const r = leerJson(hecho); if (r) { console.log(`[${k}/${lista.length}] ${paso.destino} · ${paso.nombre}  (ya hecho: ${r.veredicto})`); return r; } }

  const r = { capa: paso.capa, destino: paso.destino, nombre: paso.nombre, dir: relative(OUT, dir).split(sep).join("/"),
    orden: [paso.cmd ?? "", paso.script ?? "", ...(paso.argsFijos ?? [])].join(" ").trim(),
    veredicto: "ok", ok: 0, no: 0, lineas: [], nota: "", codigo: null, seg: 0, pageerror: [], avisos: 0, ruido: 0, capturas: [], navegaciones: [] };
  process.stdout.write(`[${k}/${lista.length}] ${paso.destino} · ${paso.capa} · ${paso.nombre} … `);

  const libre = gbLibres();
  if (Number.isFinite(libre) && libre < MIN_DISCO_GB) {
    r.veredicto = "SIN DISCO"; r.nota = `${libre.toFixed(2)} GB libres: no se corre (con el disco lleno los tests fallan sin que el código esté mal)`;
  } else if (paso.especial === "deploy") {
    const t0 = Date.now();
    try { Object.assign(r, await compararDeploy(dir)); if (r.no) r.veredicto = "DISTINTO"; }
    catch (e) { r.veredicto = "FALLA"; r.nota = String(e?.message ?? e); }
    r.seg = (Date.now() - t0) / 1000;
  } else {
    // el barrido escribe siempre en el mismo fichero: se aparta el que hubiera y se devuelve al final
    const JSONL = join(CLI, "shots", "barrido162", "resultados.jsonl");
    const CENT = join(CLI, "shots", "barrido162", "centinela.json");
    const apartados = [];
    if (paso.especial === "barrido")
      for (const f of [JSONL, CENT]) if (existsSync(f)) { renameSync(f, f + ".antes_de_test_todo"); apartados.push(f); }

    const copia = join(OUT, "_build_de_antes");
    const idx = join(BUNDLE, "workspace", "index.html");
    if (paso.especial === "build" && existsSync(idx)) cpSync(BUNDLE, copia, { recursive: true });

    const c = await lanzar(paso, dir);
    r.codigo = c.codigo; r.seg = c.seg;
    const n = contar(c.texto, paso.analiza);
    Object.assign(r, { ok: n.ok, no: n.no, lineas: n.lineas.slice(0, 60), nota: n.nota ?? "" });
    if (paso.analiza === "ids" && c.codigo !== 0) r.ok = 0;

    if (paso.especial === "build") {
      const bien = c.codigo === 0 && !c.colgado && existsSync(idx);
      r.ok = bien ? 1 : 0; r.no = bien ? 0 : 1; r.lineas = [];
      if (bien) r.nota = `build nuevo: ${todosLosArchivos(BUNDLE).length} archivos`;
      else if (existsSync(copia)) {
        rmSync(BUNDLE, { recursive: true, force: true }); cpSync(copia, BUNDLE, { recursive: true });
        r.nota = "el build falló: se devolvió el que había";
      }
      if (existsSync(copia)) rmSync(copia, { recursive: true, force: true });
    }

    if (paso.especial === "barrido") {
      r.ok = 0; r.no = 0; r.lineas = [];
      if (existsSync(JSONL)) {
        for (const l of readFileSync(JSONL, "utf-8").split("\n").filter(Boolean)) {
          const j = leerJson2(l); if (!j) continue;
          if (j.ok) r.ok++; else { r.no++; if (r.lineas.length < 60) r.lineas.push(`${j.id}: ${(j.fallos ?? []).join(" | ")}`.slice(0, 220)); }
        }
        copyFileSync(JSONL, join(dir, "resultados.jsonl")); renameSync(JSONL, JSONL + ".de_test_todo");
      }
      if (existsSync(CENT)) { copyFileSync(CENT, join(dir, "centinela.json")); renameSync(CENT, CENT + ".de_test_todo"); }
      for (const f of apartados) renameSync(f + ".antes_de_test_todo", f);
      r.nota = `${r.ok + r.no} ejemplos medidos`;
    }

    const reg = leerJson(join(dir, "_destino.json"), {});
    r.pageerror = (reg.errores ?? []).map((e) => `${e.texto}  [${e.url}]`.slice(0, 260));
    r.avisos = (reg.avisos ?? []).length; r.ruido = reg.ruido ?? 0;
    r.avisosMuestra = (reg.avisos ?? []).slice(0, 8).map((a) => `${a.tipo}: ${a.texto} ${a.url}`.trim().slice(0, 220));
    r.capturas = (reg.capturas ?? []).map((x) => x.archivo);
    r.navegaciones = (reg.navegaciones ?? []).slice(0, 6);
    const navRotas = (reg.navegaciones ?? []).filter((x) => typeof x.estado === "string" || (typeof x.estado === "number" && x.estado >= 400));
    for (const x of navRotas.slice(0, 5)) r.lineas.push(`no abrió ${x.abierta}: ${x.estado}`);

    if (c.colgado) { r.veredicto = "COLGADO"; r.nota = `pasó de ${(paso.tiempo ?? TIEMPO)} s y se mató. ${r.nota}`.trim(); }
    else if (c.codigo !== 0 || r.no > 0 || r.pageerror.length || navRotas.length) r.veredicto = "FALLA";
    else if (r.ok === 0) r.veredicto = "solo capturas";
    if (r.veredicto === "FALLA" && c.codigo !== 0 && r.no === 0 && !r.pageerror.length)
      r.lineas.push(...c.texto.trim().split(/\r?\n/).slice(-6).map((l) => l.trim().slice(0, 220)));
  }

  writeFileSync(hecho, JSON.stringify(r, null, 1));
  console.log(`${r.veredicto}  ${r.ok}/${r.ok + r.no}  ${r.seg.toFixed(0)} s${r.pageerror.length ? `  ${r.pageerror.length} pageerror` : ""}`);
  return r;
}
function leerJson2(l) { try { return JSON.parse(l); } catch { return null; } }

// ── el informe ──────────────────────────────────────────────────────────────
const MALO = (v) => v === "FALLA" || v === "COLGADO" || v === "SIN DISCO";
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const fecha = (t = Date.now()) => { const d = new Date(t), p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`; };
const hms = (s) => { s = Math.round(s); const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60); return h ? `${h} h ${m} min` : m ? `${m} min ${s % 60} s` : `${s} s`; };

function resumir(res, estado) {
  const sitios = ["fuente", ...DESTINOS], capas = [...new Set(res.map((r) => r.capa))];
  const celda = (capa, sitio) => {
    const R = res.filter((r) => r.capa === capa && r.destino === sitio);
    if (!R.length) return null;
    return { pasos: R.length, malos: R.filter((r) => MALO(r.veredicto)).length,
      ok: R.reduce((a, r) => a + r.ok, 0), no: R.reduce((a, r) => a + r.no, 0) };
  };
  // el mismo paso en los dos sitios, con distinto resultado
  const distintos = [];
  if (DESTINOS.length === 2)
    for (const a of res.filter((r) => r.destino === "local")) {
      const b = res.find((r) => r.destino === "publico" && r.nombre === a.nombre);
      if (b && (a.veredicto !== b.veredicto || a.ok !== b.ok || a.no !== b.no || a.pageerror.length !== b.pageerror.length))
        distintos.push({ nombre: a.nombre, capa: a.capa, local: a, publico: b });
    }
  return { sitios, capas, celda, distintos, malos: res.filter((r) => MALO(r.veredicto)), estado };
}

function informeMd(res, S, total) {
  const L = [];
  L.push(`# Test entero de Hekatan Struct — ${fecha()}`, "");
  L.push(`Sitios: ${DESTINOS.join(" y ")}${RAPIDO ? " · modo rápido" : ""} · ${res.length} de ${lista.length} pasos · ${hms(total)}`, "");
  L.push(`**${S.malos.length ? `FALLA: ${S.malos.length} pasos` : "OK: ningún paso falla"}**`, "");
  L.push("## Estado del árbol", "");
  for (const l of S.estado) L.push(`- ${l}`);
  L.push("", "## Resumen", "", `| capa | ${S.sitios.join(" | ")} |`, `|---|${S.sitios.map(() => "---").join("|")}|`);
  for (const c of S.capas) L.push(`| ${c} | ${S.sitios.map((s) => { const x = S.celda(c, s); return x ? `${x.pasos - x.malos}/${x.pasos} pasos · ${x.ok}/${x.ok + x.no} comprob.` : "—"; }).join(" | ")} |`);
  if (S.distintos.length) {
    L.push("", "## Distinto entre local y público", "", "| paso | local | público |", "|---|---|---|");
    for (const d of S.distintos) L.push(`| ${d.nombre} | ${d.local.veredicto} ${d.local.ok}/${d.local.ok + d.local.no} | ${d.publico.veredicto} ${d.publico.ok}/${d.publico.ok + d.publico.no} |`);
  }
  if (S.malos.length) {
    L.push("", "## Lo que falla", "");
    for (const r of S.malos) {
      L.push(`### ${r.nombre} — ${r.destino} — ${r.veredicto}`, "", `\`${r.orden}\` · ${r.ok}/${r.ok + r.no} · ${hms(r.seg)} · salida: \`${r.dir}/salida.txt\``, "");
      if (r.nota) L.push(r.nota, "");
      for (const l of r.lineas.slice(0, 15)) L.push(`- ${l}`);
      for (const l of r.pageerror.slice(0, 5)) L.push(`- pageerror: ${l}`);
      L.push("");
    }
  }
  L.push("", "## Todos los pasos", "", "| sitio | capa | paso | veredicto | comprob. | pageerror | avisos | capturas | tiempo |", "|---|---|---|---|---|---|---|---|---|");
  for (const r of res) L.push(`| ${r.destino} | ${r.capa} | ${r.nombre} | ${r.veredicto} | ${r.ok}/${r.ok + r.no} | ${r.pageerror.length} | ${r.avisos} | ${r.capturas.length} | ${hms(r.seg)} |`);
  L.push("", "## No incluidos", "");
  for (const [f, q] of NO_INCLUIDOS) L.push(`- \`${f}\`: ${q}`);
  return L.join("\n") + "\n";
}

function informeHtml(res, S, total) {
  const color = (v) => (MALO(v) ? "mal" : v === "ok" ? "bien" : "ojo");
  const miniaturas = (r, max = 400, carga = "lazy") => r.capturas.slice(0, max).map((f) =>
    `<a href="${esc(r.dir)}/${esc(f)}" target="_blank"><img loading="${carga}" src="${esc(r.dir)}/${esc(f)}" alt="${esc(f)}"><span>${esc(f)}</span></a>`).join("");
  const H = [];
  H.push(`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Test entero Struct</title><style>
:root{--f:#fff;--t:#1b1f24;--s:#5b6470;--l:#d9dee5;--c:#f4f6f8;--bien:#1a7f37;--mal:#c62828;--ojo:#9a6700}
@media(prefers-color-scheme:dark){:root{--f:#14171b;--t:#e6e9ee;--s:#9aa4b1;--l:#2c323a;--c:#1c2026;--bien:#4cc26a;--mal:#ff6b6b;--ojo:#e0a83a}}
body{margin:0;padding:24px 16px 64px;background:var(--f);color:var(--t);font:15px/1.5 system-ui,Segoe UI,sans-serif}
main{max-width:1180px;margin:0 auto}h1{font-size:26px;margin:0 0 4px}h2{font-size:19px;margin:36px 0 10px;border-bottom:1px solid var(--l);padding-bottom:6px}
h3{font-size:16px;margin:22px 0 6px}.s{color:var(--s)}.v{font-weight:700;font-size:20px;margin:14px 0}
.bien{color:var(--bien)}.mal{color:var(--mal)}.ojo{color:var(--ojo)}
.tabla{overflow-x:auto}table{border-collapse:collapse;width:100%;font-size:14px}th,td{border:1px solid var(--l);padding:5px 9px;text-align:left;vertical-align:top}
th{background:var(--c)}td.n{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}
code,pre{font:13px/1.45 Consolas,monospace}pre{background:var(--c);border:1px solid var(--l);padding:10px;overflow-x:auto;white-space:pre-wrap;word-break:break-word}
.fotos{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px;margin:10px 0}
.fotos a{display:block;border:1px solid var(--l);background:var(--c);text-decoration:none;color:var(--s);font-size:11px}
.fotos img{display:block;width:100%;height:auto;background:#000}.fotos span{display:block;padding:3px 6px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
details{margin:8px 0;border:1px solid var(--l);padding:6px 10px}summary{cursor:pointer}a{color:inherit}
</style></head><body><main>`);
  H.push(`<h1>Test entero de Hekatan Struct</h1><div class="s">${esc(fecha())} · sitios: ${esc(DESTINOS.join(" y "))}${RAPIDO ? " · modo rápido" : ""} · ${res.length} de ${lista.length} pasos · ${esc(hms(total))}</div>`);
  H.push(`<div class="v ${S.malos.length ? "mal" : "bien"}">${S.malos.length ? `FALLA: ${S.malos.length} pasos` : "OK: ningún paso falla"}</div>`);
  H.push(`<h2>Estado del árbol</h2><ul>${S.estado.map((l) => `<li>${esc(l)}</li>`).join("")}</ul>`);
  H.push(`<h2>Resumen</h2><div class="tabla"><table><tr><th>capa</th>${S.sitios.map((s) => `<th>${esc(s)}</th>`).join("")}</tr>`);
  for (const c of S.capas) H.push(`<tr><td>${esc(c)}</td>${S.sitios.map((s) => { const x = S.celda(c, s); return x ? `<td class="${x.malos ? "mal" : "bien"}">${x.pasos - x.malos}/${x.pasos} pasos<br><span class="s">${x.ok}/${x.ok + x.no} comprobaciones</span></td>` : "<td class=s>—</td>"; }).join("")}</tr>`);
  H.push(`</table></div>`);
  if (S.distintos.length) {
    H.push(`<h2>Distinto entre local y público</h2><div class="tabla"><table><tr><th>paso</th><th>local</th><th>público</th></tr>`);
    for (const d of S.distintos) H.push(`<tr><td>${esc(d.nombre)}</td><td class="${color(d.local.veredicto)}">${esc(d.local.veredicto)} ${d.local.ok}/${d.local.ok + d.local.no}</td><td class="${color(d.publico.veredicto)}">${esc(d.publico.veredicto)} ${d.publico.ok}/${d.publico.ok + d.publico.no}</td></tr>`);
    H.push(`</table></div>`);
  }
  if (S.malos.length) {
    H.push(`<h2>Lo que falla</h2>`);
    for (const r of S.malos) {
      H.push(`<h3 class="mal">${esc(r.nombre)} — ${esc(r.destino)} — ${esc(r.veredicto)}</h3><div class="s"><code>${esc(r.orden)}</code> · ${r.ok}/${r.ok + r.no} · ${esc(hms(r.seg))} · <a href="${esc(r.dir)}/salida.txt">salida.txt</a></div>`);
      const cuerpo = [r.nota, ...r.lineas.slice(0, 25), ...r.pageerror.slice(0, 8).map((l) => "pageerror: " + l)].filter(Boolean).join("\n");
      if (cuerpo) H.push(`<pre>${esc(cuerpo)}</pre>`);
      if (r.capturas.length) H.push(`<div class="fotos">${miniaturas(r, 8, "eager")}</div>`);
    }
  }
  H.push(`<h2>Todos los pasos</h2><div class="tabla"><table><tr><th>sitio</th><th>capa</th><th>paso</th><th>veredicto</th><th>comprob.</th><th>pageerror</th><th>avisos</th><th>capturas</th><th>tiempo</th></tr>`);
  for (const r of res) H.push(`<tr><td>${esc(r.destino)}</td><td>${esc(r.capa)}</td><td><a href="${esc(r.dir)}/salida.txt">${esc(r.nombre)}</a></td><td class="${color(r.veredicto)}">${esc(r.veredicto)}</td><td class=n>${r.ok}/${r.ok + r.no}</td><td class=n>${r.pageerror.length}</td><td class=n>${r.avisos}</td><td class=n>${r.capturas.length}</td><td class=n>${esc(hms(r.seg))}</td></tr>`);
  H.push(`</table></div><h2>Capturas</h2>`);
  for (const r of res.filter((x) => x.capturas.length))
    H.push(`<details><summary><b>${esc(r.nombre)}</b> · ${esc(r.destino)} · <span class="${color(r.veredicto)}">${esc(r.veredicto)}</span> · ${r.capturas.length} capturas</summary><div class="fotos">${miniaturas(r)}</div></details>`);
  H.push(`<h2>No incluidos</h2><ul>${NO_INCLUIDOS.map(([f, q]) => `<li><code>${esc(f)}</code>: ${esc(q)}</li>`).join("")}</ul>`);
  H.push(`</main></body></html>`);
  return H.join("\n");
}

// ── principal ───────────────────────────────────────────────────────────────
mkdirSync(OUT, { recursive: true });
const t0 = Date.now();
const huellaInicio = huella();
const estadoArbol = () => {
  const E = [];
  const rama = spawnSync("git", ["-C", RAIZ, "rev-parse", "--abbrev-ref", "HEAD"], { encoding: "utf-8" }).stdout?.trim();
  const sha = spawnSync("git", ["-C", RAIZ, "log", "-1", "--format=%h %ad %s", "--date=short"], { encoding: "utf-8" }).stdout?.trim();
  E.push(`rama ${rama} · ${sha}`);
  const idx = join(BUNDLE, "workspace", "index.html");
  if (!existsSync(idx)) E.push("NO HAY BUILD LOCAL: npm run build:deploy");
  else {
    const tb = statSync(idx).mtimeMs;
    const n = ["examples", "hekatan-ui", "hekatan-fem"].reduce((m, p) => masNuevo(join(RAIZ, p, "src"), m), { t: 0, f: "" });
    E.push(`build local del ${fecha(tb)}`);
    if (n.t > tb) E.push(`EL BUILD LOCAL ES ANTERIOR AL CÓDIGO: ${relative(RAIZ, n.f).split(sep).join("/")} es del ${fecha(n.t)}. Lo medido en local es el programa de antes.`);
    else E.push("el build local es posterior a todo el código fuente");
  }
  const fin = huella();
  const movidos = Object.keys(fin).filter((f) => JSON.stringify(fin[f]) !== JSON.stringify(huellaInicio[f]));
  E.push(movidos.length ? `EL ÁRBOL SE MOVIÓ DURANTE LA PRUEBA (${movidos.join(", ")}): los pasos de antes y de después no vieron el mismo programa` : "el árbol no se movió durante la prueba");
  E.push(`disco libre ${gbLibres().toFixed(1)} GB · RAM libre ${(os.freemem() / 2 ** 30).toFixed(1)} de ${(os.totalmem() / 2 ** 30).toFixed(1)} GB`);
  return E;
};

const resultados = [];
const escribir = () => {
  const total = (Date.now() - t0) / 1000;
  const S = resumir(resultados, estadoArbol());
  writeFileSync(join(OUT, "informe.md"), informeMd(resultados, S, total));
  writeFileSync(join(OUT, "informe.html"), informeHtml(resultados, S, total));
  writeFileSync(join(OUT, "resumen.json"), JSON.stringify({ destinos: DESTINOS, rapido: RAPIDO, segundos: total,
    pasos: lista.length, hechos: resultados.length, malos: S.malos.map((r) => `${r.destino}/${r.nombre}`),
    distintos: S.distintos.map((d) => d.nombre), estado: S.estado, resultados }, null, 1));
  return S;
};

console.log(`test entero: ${lista.length} pasos · ${DESTINOS.join(" y ")}${RAPIDO ? " · rápido" : ""}\nsalida: ${OUT}\n`);
let k = 0;
for (const paso of lista) {
  let r;
  try { r = await correr(paso, ++k); }
  catch (e) { r = { capa: paso.capa, destino: paso.destino, nombre: paso.nombre, dir: "", orden: "", veredicto: "FALLA", ok: 0, no: 0,
    lineas: [`el corredor falló: ${String(e?.message ?? e)}`], nota: "", seg: 0, pageerror: [], avisos: 0, capturas: [], navegaciones: [] }; console.log("FALLA (corredor)", e?.message); }
  resultados.push(r);
  escribir();
}
const S = escribir();
console.log(`\n${S.malos.length ? "FALLA" : "OK"}: ${resultados.length - S.malos.length}/${resultados.length} pasos en ${hms((Date.now() - t0) / 1000)}`);
for (const r of S.malos) console.log(`  ${r.veredicto.padEnd(8)} ${r.destino.padEnd(8)} ${r.nombre}`);
if (S.distintos.length) console.log(`distinto entre local y público: ${S.distintos.map((d) => d.nombre).join(", ")}`);
console.log(`informe: ${join(OUT, "informe.html")}`);
process.exit(S.malos.length ? 1 : 0);
