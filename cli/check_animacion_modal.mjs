#!/usr/bin/env node
/**
 * BARRIDO: ¿qué dibuja el visor al animar un modo, en TODOS los ejemplos?
 *
 *     node cli/check_animacion_modal.mjs                  (todo: ~140 ejemplos + 8 plantillas)
 *     node cli/check_animacion_modal.mjs test-m-dual      (solo los ids que contengan eso)
 *     node cli/check_animacion_modal.mjs --desde 40 --hasta 80   (por tandas)
 *     node cli/check_animacion_modal.mjs --modos          (además, modos 2 y 3)
 *
 * El caso de la suite (`tests/casos/animacion_modal_es_el_modo.mjs`) mira TRES modelos
 * en dos minutos y corre en cada `npm test`. Esto mira TODO, tarda una hora larga y se
 * corre a mano: Jorge, 18-sep-2026, «de TODOS los ejemplos, plantillas, de todo lo que
 * existe: revísalo».
 *
 * Las PLANTILLAS son un solo id con el parámetro `tipo` 0..7 — se recorren los ocho, que
 * si no se da por bueno el que salga por defecto (ese error ya pasó con comparar_e2k_etabs).
 *
 * Qué saca por cada id:  ¿anima? · cos(dibujo, φ) · cos(dibujo, Dead) · veredicto.
 * Lo que NO tiene modal o NO carga sale listado como tal, NO como aprobado.
 *
 * ⚠️ Necesita el bundle: npm run build:deploy
 */
import { abrirVisor, enganchar, nuevaPagina, medirModelo, hayBundle } from "../tests/lib/visor_modal.mjs";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const AQUI = dirname(fileURLToPath(import.meta.url));
if (!hayBundle()) { console.error("no hay bundle: npm run build:deploy"); process.exit(2); }

const args = process.argv.slice(2);
const num = (bandera, def) => { const i = args.indexOf(bandera); return i >= 0 ? Number(args[i + 1]) : def; };
const DESDE = num("--desde", 0), HASTA = num("--hasta", Infinity);
const CON_MODOS = args.includes("--modos");
const filtros = args.filter((a) => !a.startsWith("--") && !/^\d+$/.test(a));

const LISTA = join(AQUI, "shots", "deploy", "_ids.txt");
const idsFichero = existsSync(LISTA)
  ? readFileSync(LISTA, "utf8").split(/\r?\n/).map((s) => s.trim()).filter(Boolean)
  : [];
// Las ocho plantillas, una por `tipo`. El id "plantillas" pelado se quita de la lista:
// se recorre entero acá abajo.
const TIPOS = ["pórtico 2D", "pórtico 3D", "pórtico+losa", "solo rejilla",
               "losa plana", "losa+vigas borde", "DUAL (muros)", "arriostrado"];

const LIM_PHI = 0.999, LIM_EXC = 0.02;
const resultados = [];
let visor = await abrirVisor({ puerto: 4795 });
enganchar(visor);
let hechos = 0;

const cerrarYAbrir = async () => {
  await visor.cerrar();
  visor = await abrirVisor({ puerto: 4795 });
  enganchar(visor);
};

// ── El registro, leído UNA vez ───────────────────────────────────────────────
// Abrir cada ejemplo solo para descubrir que no tiene modal costaba minutos: con
// swiftshader (WebGL por software) una carga son 20-60 s, y de los ~140 ejemplos la
// mayoría no tiene modal. `window.__hekatanExamples` ya trae `hasModal`, así que los
// que no lo tienen se listan como «sin-modal (registro)» sin abrirlos — es un dato,
// no un aprobado — y solo se ABREN los que sí.
await visor.pag.goto(visor.url("workspace/?t=plantillas"), { waitUntil: "domcontentloaded", timeout: 180000 }).catch(() => {});
await visor.pag.waitForFunction(() => Array.isArray(window.__hekatanExamples), { timeout: 120000 });
const registro = await visor.pag.evaluate(() => window.__hekatanExamples);
// Y se CIERRA esa pestaña: con swiftshader (WebGL por software) una escena de Three.js
// abierta sigue pintando y se come la CPU del barrido entero.
await visor.pag.goto("about:blank").catch(() => {});
const conModal = new Map(registro.map((e) => [e.id, e.hasModal]));
const sinRegistro = idsFichero.filter((id) => !conModal.has(id));

const trabajos = [];
for (const id of idsFichero) {
  if (id === "plantillas") continue;
  trabajos.push({ id, tipo: null, hasModal: conModal.get(id) });
}
for (let t = 0; t < 8; t++) trabajos.push({ id: "plantillas", tipo: t, mote: TIPOS[t], hasModal: true });

const elegidos = trabajos
  .filter((t) => !filtros.length || filtros.some((f) => t.id.includes(f)))
  .slice(DESDE, HASTA);
const aAbrir = elegidos.filter((t) => t.hasModal !== false).length;

console.log(`# barrido de la animación modal — ${elegidos.length} modelos, ${aAbrir} con modal en el registro` +
            (DESDE || HASTA !== Infinity ? ` (tanda ${DESDE}..${HASTA})` : ""));
if (sinRegistro.length) console.log(`# (${sinRegistro.length} ids de _ids.txt no están en el registro: ${sinRegistro.join(", ")})`);
console.log("# id | tipo | estado | nudos | modos | cos(dib,φ) | cos(dib,Dead) | cos(φ,Dead) | exceso | veredicto");

// Tope de RELOJ por modelo. Un modelo de muchos nudos puede tenerse horas al barrido
// (medido: con la maquina cargada, de 26 s sueltos a 12 min encadenados). Pasado el tope
// se ABANDONA y se anota «no-medido-por-tiempo» — que NO es un aprobado.
const TOPE_MODELO = num("--tope", 240) * 1000;

const medirConPestaña = async (t) => {
  // Una pestaña por modelo: reusando una sola, el barrido se moría a los 6-7 con
  // «detached Frame» (cada modelo deja su escena de Three.js y su WASM en memoria).
  const pag = await nuevaPagina(visor);
  let reloj = null;
  try {
    const porTiempo = new Promise((res) => {
      reloj = setTimeout(() => res({ id: t.id, tipo: t.tipo, estado: "no-medido-por-tiempo",
        nota: `pasó de ${TOPE_MODELO / 1000} s de reloj` }), TOPE_MODELO);
    });
    // ⚠️ El `.catch` va DENTRO de la carrera: si gana el reloj, la medición sigue viva
    // sobre una pestaña que se cierra y su rechazo tardío tumbaría el proceso entero
    // (unhandled rejection). Con el catch, el que llega tarde no molesta.
    const medida = medirModelo(pag, {
      id: t.id, tipo: t.tipo, muestras: 10,   // sin `dt`: lo calcula para cubrir un ciclo (4.4 s)
      topeModal: 150000, modosExtra: CON_MODOS ? [1, 2] : [],
    }).catch((e) => ({ id: t.id, tipo: t.tipo, estado: "revienta",
                       nota: String(e?.message ?? e).slice(0, 160) }));
    return await Promise.race([medida, porTiempo]);
  } finally {
    if (reloj) clearTimeout(reloj);
    // La pestaña abandonada se cierra igual: si no, su escena sigue pintando y frena el resto.
    try { await pag.close(); } catch {}
  }
};

for (const t of elegidos) {
  const et = t.tipo === null ? t.id : `${t.id}#${t.tipo} (${t.mote})`;
  let r;
  if (t.hasModal === false) {
    // El registro dice que no tiene modal: se LISTA, no se aprueba, y no se abre.
    r = { id: t.id, tipo: t.tipo, estado: "sin-modal", nota: "hasModal=false en el registro" };
    resultados.push({ ...r, etiqueta: et, veredicto: "sin-modal" });
    console.log([et, "", "sin-modal", "", "", "—", "—", "—", "—", "sin-modal", r.nota].join(" | "));
    continue;
  }
  if (t.hasModal === undefined) {
    r = { id: t.id, tipo: t.tipo, estado: "sin-registro", nota: "el id no está en el registro del workspace" };
    resultados.push({ ...r, etiqueta: et, veredicto: "sin-registro" });
    console.log([et, "", "sin-registro", "", "", "—", "—", "—", "—", "sin-registro", r.nota].join(" | "));
    continue;
  }
  try {
    r = await medirConPestaña(t);
  } catch (e) {
    // Si Chrome se cayó entero, se levanta otro y se le da UNA segunda
    // oportunidad: así un modelo pesado no invalida el resto del barrido.
    try {
      await cerrarYAbrir();
      r = await medirConPestaña(t);
    } catch (e2) {
      r = { id: t.id, tipo: t.tipo, estado: "revienta", nota: String(e2.message ?? e2).slice(0, 160) };
    }
  }
  let veredicto = r.estado;
  if (r.estado === "ok") {
    const malPhi = !(r.cosPhiTodosMin >= LIM_PHI);
    const malDead = r.excesoDead > LIM_EXC;
    const sucio = !(r.shellResults === "none" && (r.solidResults === "none" || r.solidResults == null));
    veredicto = malPhi || malDead ? "❌ NO es el modo"
              : sucio ? "⚠ colormap sucio" : "✅";
    if (sucio && !(malPhi || malDead)) r.nota = `colormap ${r.shellResults}/${r.solidResults}`;
  }
  r.etiqueta = et; r.veredicto = veredicto;
  resultados.push(r);
  const f = (x, d = 4) => (typeof x === "number" ? x.toFixed(d) : "—");
  console.log([et, t.tipo === null ? "" : t.tipo, r.estado, r.nNudos ?? "", r.nModos ?? "",
               f(r.cosPhiTodosMin, 6), f(r.cosDeadMax), f(r.cosPhiDead),
               typeof r.excesoDead === "number" ? r.excesoDead.toExponential(1) : "—",
               veredicto, r.nota || ""].join(" | "));
  hechos++;
  // Chrome se queda con la memoria de cada modelo; con la máquina de Jorge (~5 GB libres)
  // un barrido de 140 la llena, y Chrome se va frenando aunque las pestañas se cierren
  // (medido: de 20 s por modelo a más de 100). Se recicla el navegador cada 6 modelos.
  if (hechos % 6 === 0 && hechos < elegidos.length) await cerrarYAbrir();
}
await visor.cerrar();

const cuenta = {};
for (const r of resultados) cuenta[r.veredicto] = (cuenta[r.veredicto] ?? 0) + 1;
console.log("\n## resumen");
for (const [k, n] of Object.entries(cuenta).sort((a, b) => b[1] - a[1])) console.log(`${n}  ${k}`);
const malos = resultados.filter((r) => r.veredicto.startsWith("❌") || r.veredicto.startsWith("⚠"));
if (malos.length) {
  console.log("\n## los que hay que mirar");
  for (const r of malos) console.log(`${r.etiqueta}: ${r.veredicto} — cos(dib,φ)=${r.cosPhiTodosMin?.toFixed(6)} cos(dib,Dead)=${r.cosDeadMax?.toFixed(4)} ${r.nota || ""}`);
}
const salida = join(AQUI, "..", "registros", "_check_animacion_modal.json");
writeFileSync(salida, JSON.stringify(resultados.map((r) => ({ ...r, modos: undefined })), null, 1));
console.log(`\n(detalle en ${salida})`);
process.exit(malos.length ? 1 : 0);
