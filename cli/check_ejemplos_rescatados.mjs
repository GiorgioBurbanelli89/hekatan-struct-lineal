#!/usr/bin/env node
/**
 * ¿Están SANOS los ejemplos rescatados de FEM Studio?
 *
 *     node cli/check_ejemplos_rescatados.mjs                 (todos)
 *     node cli/check_ejemplos_rescatados.mjs arco talud      (solo esos)
 *     node cli/check_ejemplos_rescatados.mjs --standalone    (además, su página /<carpeta>/)
 *
 * Registrar un ejemplo no es que esté bien. Esto MIDE, ejemplo a ejemplo:
 *
 *   · carga por `?t=<id>` y por su página standalone, sin un solo `pageerror`;
 *   · RESUELVE: hay un desplazamiento por nudo y ninguno es NaN;
 *   · EQUILIBRIO: ΣRz de las reacciones contra la suma de las cargas aplicadas en Z.
 *     Es la primera prueba de un estático y no hace falta otro programa para juzgarla:
 *     si no cierra, o el modelo es un mecanismo o el solver no resolvió;
 *   · y si tiene modal, lo deja en manos de `check_animacion_modal.mjs` (cos con φ).
 *
 * Lo que no cierre NO se registra: mejor 15 buenos que 20 con dos rotos en la web.
 *
 * ⚠️ Necesita el bundle: npm run build:deploy
 */
import { abrirVisor, enganchar, nuevaPagina, hayBundle } from "../tests/lib/visor_modal.mjs";
import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const AQUI = dirname(fileURLToPath(import.meta.url));
if (!hayBundle()) { console.error("no hay bundle: npm run build:deploy"); process.exit(2); }

const args = process.argv.slice(2);
const CON_STANDALONE = args.includes("--standalone");
const filtros = args.filter((a) => !a.startsWith("--"));

// id → carpeta (la página standalone). Los dos «-parametrico» no llevan el id de
// carpeta porque `diagrid/` y `pergola/` ya son las páginas de awatif.
const RESCATADOS = [
  ["arco", "arco"], ["eiffel", "eiffel"], ["puente", "puente-reticular"],
  ["burj", "burj"], ["twisted", "twisted"], ["diagrid", "diagrid-parametrico"],
  ["opera", "opera"], ["edif-acero-diag", "edif-acero-diag"], ["edif-muros", "edif-muros"],
  ["edif-mixto", "edif-mixto"], ["losa-rect", "losa-rect"], ["viga-alta", "viga-alta"],
  ["muro-contencion", "muro-contencion"], ["muro-q4", "muro-q4"], ["viga-q4", "viga-q4"],
  ["pergola", "pergola-parametrica"],
  ["placa-orificios", "placa-orificios"], ["placa-xy", "placa-xy"],
  ["losa-plana", "losa-plana"], ["talud", "talud"],
].filter(([id]) => !filtros.length || filtros.some((f) => id.includes(f)));

const espera = (ms) => new Promise((r) => setTimeout(r, ms));

/** Lo que se puede juzgar del modelo sin otro programa: resuelve, no hay NaN, equilibra. */
const SONDA = () => {
  const S = window.__hekatanStates;
  const nodos = S.nodes.val, elems = S.elements.val;
  const D = S.deformOutputs?.val?.deformations;
  const R = S.deformOutputs?.val?.reactions;
  const it = (m) => (m instanceof Map ? [...m.entries()] : Object.entries(m ?? {}));
  let nDef = 0, maxU = 0, nanU = 0;
  for (const [, d] of it(D)) {
    nDef++;
    for (let k = 0; k < 3; k++) {
      const v = d?.[k] ?? 0;
      if (!Number.isFinite(v)) nanU++; else maxU = Math.max(maxU, Math.abs(v));
    }
  }
  // ⚠️ El equilibrio se mide en las TRES componentes, no solo en Z.
  //
  // Con Z a secas, `twisted` salía «no equilibra» al 100 %: sus cargas son de VIENTO,
  // horizontales, así que ΣFz = 0 y ΣRz = 0 salvo el ruido de coma flotante — y dividir
  // ruido entre ruido da cualquier cosa. El modelo estaba perfecto; el mal medidor era
  // este. La referencia buena es la resultante aplicada MAYOR de las tres.
  const R3 = [0, 0, 0], F3 = [0, 0, 0];
  let nR = 0;
  for (const [, r] of it(R)) { for (let k = 0; k < 3; k++) R3[k] += r?.[k] ?? 0; nR++; }
  for (const [, l] of it(S.nodeInputs?.val?.loads)) for (let k = 0; k < 3; k++) F3[k] += l?.[k] ?? 0;
  const sumRz = R3[2], cargaZ = F3[2];
  let nanXYZ = 0;
  for (const n of nodos) for (let k = 0; k < 3; k++) if (!Number.isFinite(n[k])) nanXYZ++;
  const barras = elems.filter((e) => e.length === 2).length;
  return {
    nudos: nodos.length, barras, cascaras: elems.length - barras,
    nDef, maxU, nanU, nanXYZ, nR, sumRz, cargaZ, R3, F3,
    apoyos: it(S.nodeInputs?.val?.supports).length,
    hasModal: typeof window.__hekatanRunModalAnimate === "function",
  };
};

console.log(`# ${RESCATADOS.length} ejemplos rescatados de FEM Studio`);
console.log("# id | nudos | barras/cáscaras | desplaz. | NaN | ΣRz | carga Z | error equil. | standalone | veredicto");

const visor = await abrirVisor({ puerto: 4799 });
enganchar(visor);
const filas = [];
try {
  for (const [id, carpeta] of RESCATADOS) {
    const antes = visor.errores.length;
    const pag = await nuevaPagina(visor);
    let r = null, nota = "";
    try {
      await pag.goto(visor.url(`workspace/?t=${id}`), { waitUntil: "domcontentloaded", timeout: 180000 }).catch(() => {});
      await pag.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 120000 });
      await espera(5000);
      r = await pag.evaluate(SONDA);
    } catch (e) { nota = String(e.message ?? e).slice(0, 110); }
    finally { try { await pag.close(); } catch {} }

    // La página standalone `/<carpeta>/`: es OTRA entrada del build y puede
    // compilar y aun así romperse al arrancar. Se mira aparte.
    let sa = "—";
    if (CON_STANDALONE) {
      const p2 = await nuevaPagina(visor);
      const eAntes = visor.errores.length;
      try {
        await p2.goto(visor.url(`${carpeta}/`), { waitUntil: "domcontentloaded", timeout: 120000 }).catch(() => {});
        await p2.waitForFunction(() => !!document.querySelector("#viewer")?.__ctx, { timeout: 90000 });
        await espera(3000);
        // ⚠️ La página standalone NO expone `__hekatanStates` — ese gancho lo pone
        // `workspace/main.ts`, y el runner standalone es otro (`runExampleStandalone`).
        // Preguntando por él salían las 21 «sin nudos» estando bien. Se juzga por lo
        // que de verdad hay: objetos dibujados en la escena de Three.js.
        const n = await p2.evaluate(() => {
          const c = document.querySelector("#viewer")?.__ctx;
          let mallas = 0;
          c?.scene?.traverse?.((o) => { if (o.isMesh || o.isLine || o.isPoints || o.isLineSegments) mallas++; });
          return mallas;
        });
        sa = visor.errores.length > eAntes ? "pageerror" : (n > 0 ? `ok (${n})` : "escena vacía");
      } catch { sa = "no carga"; }
      finally { try { await p2.close(); } catch {} }
    }

    const errores = visor.errores.length - antes;
    let veredicto;
    if (!r) veredicto = "❌ no carga";
    else if (r.nanXYZ || r.nanU) veredicto = "❌ NaN";
    else if (!r.nDef || r.nDef < r.nudos) veredicto = "❌ no resuelve";
    else if (!r.apoyos) veredicto = "❌ sin apoyos";
    else {
      // ΣR + ΣF = 0 en las tres componentes. La referencia es la resultante aplicada
      // mayor: si todas son cero no hay nada que equilibrar y el error es 0.
      const ref = Math.max(...r.F3.map(Math.abs), ...r.R3.map(Math.abs));
      r.errEquil = ref > 1e-6
        ? Math.max(...[0, 1, 2].map((k) => Math.abs(r.R3[k] + r.F3[k]))) / ref * 100
        : 0;
      veredicto = r.errEquil > 0.1 ? "❌ no equilibra" : (errores ? "⚠ pageerror" : "✅");
    }
    const f = (x, d = 3) => (typeof x === "number" ? x.toFixed(d) : "—");
    console.log([id, r?.nudos ?? "—", r ? `${r.barras}/${r.cascaras}` : "—", r?.nDef ?? "—",
                 r ? (r.nanXYZ + r.nanU) : "—", f(r?.sumRz, 4), f(r?.cargaZ, 4),
                 r?.errEquil !== undefined ? f(r.errEquil, 4) + " %" : "—", sa,
                 veredicto, nota].join(" | "));
    filas.push({ id, carpeta, ...(r ?? {}), errores, standalone: sa, veredicto, nota });
  }
} finally { await visor.cerrar(); }

const cuenta = {};
for (const f of filas) cuenta[f.veredicto] = (cuenta[f.veredicto] ?? 0) + 1;
console.log("\n## resumen");
for (const [k, n] of Object.entries(cuenta).sort((a, b) => b[1] - a[1])) console.log(`${n}  ${k}`);
const malos = filas.filter((f) => !f.veredicto.startsWith("✅"));
if (malos.length) {
  console.log("\n## NO APTOS — no deberían quedar registrados");
  for (const m of malos) console.log(`${m.id}: ${m.veredicto} ${m.nota || ""}`);
}
process.exit(malos.length ? 1 : 0);
