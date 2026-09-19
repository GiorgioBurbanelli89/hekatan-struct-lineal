#!/usr/bin/env node
/**
 * Hekatan Struct — CLI Unificado
 * Analisis estatico + modal sin UI, desde Node.js con WASM (Eigen C++)
 *
 * Uso:
 *   node cli.mjs help
 *   node cli.mjs edificio                    # modelo default
 *   node cli.mjs edificio --static           # solo estatico
 *   node cli.mjs edificio --modal            # solo modal
 *   node cli.mjs edificio --json out.json    # exportar resultados
 *   node cli.mjs edificio svx=5,3 svy=4,4 np=3 hp=3
 *   node cli.mjs frame nv=3 sv=6 np=4 hp=3
 *   node cli.mjs file model.json             # cargar desde archivo
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname, join } from "path";
import { motor } from "./lib/motor.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Load WASM ──────────────────────────────────────────────────────
// ⚠️ `..` a proposito: el WASM es el del PAQUETE, no una copia dentro de cli/.
// Habia una copia duplicada en `cli/hekatan-fem/` (ignorada por git) y el CLI
// cargaba ESA. Hoy 19-ago-2026 daban el mismo binario byte a byte, pero por
// sincronizacion a mano: en cuanto se recompile el paquete y no se copie, el
// CLI resuelve con un motor VIEJO y no avisa. El caso `cli-igual-que-wasm` de
// la suite vigila que no vuelva a pasar.
const wasmPath = join(__dirname, "..", "hekatan-fem", "src", "cpp", "built", "deform.wasm");
const jsPath = join(__dirname, "..", "hekatan-fem", "src", "cpp", "built", "deform.js");
const createModule = (await import(pathToFileURL(jsPath).href)).default;
const mod = await createModule({ wasmBinary: readFileSync(wasmPath) });

// ── WASM Helpers ───────────────────────────────────────────────────
function allocate(data, TypedArrayCtor, heapTypedArray) {
  const buffer = new TypedArrayCtor(data);
  const pointer = mod._malloc(buffer.length * buffer.BYTES_PER_ELEMENT);
  heapTypedArray.set(buffer, pointer / buffer.BYTES_PER_ELEMENT);
  return pointer;
}

function processInput(inputMap) {
  const keys = inputMap ? Array.from(inputMap.keys()) : [];
  const values = inputMap ? Array.from(inputMap.values()) : [];
  const keysPtr = allocate(keys, Uint32Array, mod.HEAPU32);
  const valuesPtr = allocate(values, Float64Array, mod.HEAPF64);
  return { keysPtr, valuesPtr, size: keys.length, gc: [keysPtr, valuesPtr] };
}

// ── Static Analysis (deform) ────────────────────────────────────────
async function runDeform(nodes, elements, nodeInputs, elementInputs) {
  // ⚠️ Esto armaba los punteros de `_deform` A MANO. La firma de `_deform` ha
  // ido creciendo (areas de cortante, muelles, formulacion de placa, tipo de
  // drilling, modificadores, releases) y el CLI se quedo parado: el C++ pide
  // 111 parametros y aqui se pasaban 43. Cualquier `node cli.mjs frame ...`
  // reventaba con `memory access out of bounds`, y no lo cazaba nada porque
  // ningun test ejecutaba el CLI.
  //
  // Ahora entra por LA MISMA PUERTA que la app: `deform` de hekatan-fem. Asi
  // el CLI y el motor no pueden dar numeros distintos, que es justo lo que se
  // le pide a un CLI.
  const { deform } = await motor();
  return deform(nodes, elements, nodeInputs, elementInputs);
}

// ── Modal Analysis ──────────────────────────────────────────────────
async function runModal(nodes, elements, nodeInputs, elementInputs, numModes = 6) {
  // Lo mismo que runDeform: se armaban los punteros de `_modal` a mano y la
  // firma se habia movido. Ahora va por el paquete.
  const { modalAnalysis } = await motor();
  return modalAnalysis(nodes, elements, nodeInputs, elementInputs, numModes);
}

// ══════════════════════════════════════════════════════════════════════
// MODEL GENERATORS
// ══════════════════════════════════════════════════════════════════════

/** Default steel properties (kN, m) */
const STEEL = {
  E: 200e6, G: 77e6, A: 0.01, Iz: 8.33e-5, Iy: 8.33e-5, J: 1.41e-4, rho: 7.85
};

function generateEdificio(params = {}) {
  const svx = params.svx || [5, 5];
  const svy = params.svy || [4, 4];
  const sp = params.sp || [3, 3, 3];
  const mat = { ...STEEL, ...params.mat };

  // Build coordinate arrays
  const xCoords = [0]; for (const s of svx) xCoords.push(xCoords[xCoords.length - 1] + s);
  const yCoords = [0]; for (const s of svy) yCoords.push(yCoords[yCoords.length - 1] + s);
  const zCoords = [0]; for (const s of sp)  zCoords.push(zCoords[zCoords.length - 1] + s);

  const nodes = [];
  const nid = {};
  for (let iz = 0; iz < zCoords.length; iz++)
    for (let iy = 0; iy < yCoords.length; iy++)
      for (let ix = 0; ix < xCoords.length; ix++) {
        nid[`${ix},${iy},${iz}`] = nodes.length;
        nodes.push([xCoords[ix], yCoords[iy], zCoords[iz]]);
      }

  const elements = [];
  // Columns
  for (let iz = 0; iz < zCoords.length - 1; iz++)
    for (let iy = 0; iy < yCoords.length; iy++)
      for (let ix = 0; ix < xCoords.length; ix++)
        elements.push([nid[`${ix},${iy},${iz}`], nid[`${ix},${iy},${iz + 1}`]]);
  // Beams X
  for (let iz = 1; iz < zCoords.length; iz++)
    for (let iy = 0; iy < yCoords.length; iy++)
      for (let ix = 0; ix < xCoords.length - 1; ix++)
        elements.push([nid[`${ix},${iy},${iz}`], nid[`${ix + 1},${iy},${iz}`]]);
  // Beams Y
  for (let iz = 1; iz < zCoords.length; iz++)
    for (let ix = 0; ix < xCoords.length; ix++)
      for (let iy = 0; iy < yCoords.length - 1; iy++)
        elements.push([nid[`${ix},${iy},${iz}`], nid[`${ix},${iy + 1},${iz}`]]);

  // Supports at z=0
  const supports = new Map();
  for (let iy = 0; iy < yCoords.length; iy++)
    for (let ix = 0; ix < xCoords.length; ix++)
      supports.set(nid[`${ix},${iy},0`], [true, true, true, true, true, true]);

  // Gravity loads (CM = weight per node on floors)
  const loads = new Map();
  const totalFloorArea = (xCoords[xCoords.length-1] - xCoords[0]) * (yCoords[yCoords.length-1] - yCoords[0]);
  const nodesPerFloor = xCoords.length * yCoords.length;
  const CM = params.CM || -10; // kN/m2 default
  const loadPerNode = CM * totalFloorArea / nodesPerFloor;
  for (let iz = 1; iz < zCoords.length; iz++)
    for (let iy = 0; iy < yCoords.length; iy++)
      for (let ix = 0; ix < xCoords.length; ix++)
        loads.set(nid[`${ix},${iy},${iz}`], [0, 0, loadPerNode, 0, 0, 0]);

  const nodeInputs = { supports, loads };
  const eMap = (v) => new Map(elements.map((_, i) => [i, v]));
  const elementInputs = {
    elasticities: eMap(mat.E), shearModuli: eMap(mat.G),
    areas: eMap(mat.A), momentsOfInertiaY: eMap(mat.Iz),
    momentsOfInertiaZ: eMap(mat.Iy), torsionalConstants: eMap(mat.J),
    densities: eMap(mat.rho),
  };

  return { nodes, elements, nodeInputs, elementInputs,
    info: { type: "edificio", svx, svy, sp, xCoords, yCoords, zCoords,
            totalNodes: nodes.length, totalElements: elements.length } };
}

function generateFrame(params = {}) {
  const nv = params.nv || 3, sv = params.sv || 6;
  const np = params.np || 3, hp = params.hp || 3;
  const mat = { ...STEEL, ...params.mat };

  const xCoords = []; for (let i = 0; i <= nv; i++) xCoords.push(i * sv);
  const zCoords = []; for (let i = 0; i <= np; i++) zCoords.push(i * hp);

  const nodes = [];
  const nid = {};
  for (let iz = 0; iz < zCoords.length; iz++)
    for (let ix = 0; ix < xCoords.length; ix++) {
      nid[`${ix},${iz}`] = nodes.length;
      nodes.push([xCoords[ix], 0, zCoords[iz]]);
    }

  const elements = [];
  for (let iz = 0; iz < zCoords.length - 1; iz++)
    for (let ix = 0; ix < xCoords.length; ix++)
      elements.push([nid[`${ix},${iz}`], nid[`${ix},${iz + 1}`]]);
  for (let iz = 1; iz < zCoords.length; iz++)
    for (let ix = 0; ix < xCoords.length - 1; ix++)
      elements.push([nid[`${ix},${iz}`], nid[`${ix + 1},${iz}`]]);

  const supports = new Map();
  for (let ix = 0; ix < xCoords.length; ix++)
    supports.set(nid[`${ix},0`], [true, true, true, true, true, true]);

  const loads = new Map();
  const CM = params.CM || -10;
  const loadPerNode = CM * sv / 2;
  for (let iz = 1; iz < zCoords.length; iz++)
    for (let ix = 0; ix < xCoords.length; ix++)
      loads.set(nid[`${ix},${iz}`], [0, 0, loadPerNode, 0, 0, 0]);

  const nodeInputs = { supports, loads };
  const eMap = (v) => new Map(elements.map((_, i) => [i, v]));
  const elementInputs = {
    elasticities: eMap(mat.E), shearModuli: eMap(mat.G),
    areas: eMap(mat.A), momentsOfInertiaY: eMap(mat.Iz),
    momentsOfInertiaZ: eMap(mat.Iy), torsionalConstants: eMap(mat.J),
    densities: eMap(mat.rho),
  };

  return { nodes, elements, nodeInputs, elementInputs,
    info: { type: "frame", nv, sv, np, hp,
            totalNodes: nodes.length, totalElements: elements.length } };
}

// ══════════════════════════════════════════════════════════════════════
// OUTPUT / PRINTING
// ══════════════════════════════════════════════════════════════════════

function printModel(model) {
  const { info, nodes, elements, nodeInputs } = model;
  const nSup = nodeInputs.supports ? nodeInputs.supports.size : 0;
  const nLoads = nodeInputs.loads ? nodeInputs.loads.size : 0;
  console.log("=".repeat(72));
  console.log(`  HEKATAN STRUCT CLI | Modelo: ${info.type}`);
  console.log("=".repeat(72));
  console.log(`  Nodos: ${nodes.length}  |  Elementos: ${elements.length}  |  Apoyos: ${nSup}  |  Cargas: ${nLoads}`);
  if (info.svx) console.log(`  svx = [${info.svx.join(", ")}]  svy = [${info.svy.join(", ")}]  sp = [${info.sp.join(", ")}]`);
  if (info.nv) console.log(`  nv=${info.nv}  sv=${info.sv}  np=${info.np}  hp=${info.hp}`);
}

function printStatic(result, nodes, nodeInputs) {
  console.log("\n" + "-".repeat(72));
  console.log("  ANALISIS ESTATICO (Ku=F)");
  console.log("-".repeat(72));

  let maxU = 0, maxNode = 0;
  result.deformations.forEach((d, i) => {
    const mag = Math.sqrt(d[0]**2 + d[1]**2 + d[2]**2);
    if (mag > maxU) { maxU = mag; maxNode = i; }
  });
  console.log(`  Max |U| = ${maxU.toExponential(4)}  (nodo ${maxNode})`);

  // Top 10 displacements
  const sorted = [...result.deformations.entries()]
    .map(([i, d]) => ({ i, mag: Math.sqrt(d[0]**2 + d[1]**2 + d[2]**2), d }))
    .sort((a, b) => b.mag - a.mag)
    .slice(0, 10);

  console.log(`\n  Top 10 desplazamientos:`);
  console.log(`  ${"Nodo".padStart(6)}  ${"Ux".padStart(12)}  ${"Uy".padStart(12)}  ${"Uz".padStart(12)}  ${"|U|".padStart(12)}`);
  console.log("  " + "-".repeat(56));
  for (const s of sorted) {
    console.log(`  ${String(s.i).padStart(6)}  ${s.d[0].toExponential(4).padStart(12)}  ${s.d[1].toExponential(4).padStart(12)}  ${s.d[2].toExponential(4).padStart(12)}  ${s.mag.toExponential(4).padStart(12)}`);
  }

  // Reactions
  if (result.reactions.size > 0) {
    console.log(`\n  Reacciones (${result.reactions.size} apoyos):`);
    console.log(`  ${"Nodo".padStart(6)}  ${"Rx".padStart(12)}  ${"Ry".padStart(12)}  ${"Rz".padStart(12)}`);
    console.log("  " + "-".repeat(44));
    let sumRz = 0;
    result.reactions.forEach((r, i) => {
      console.log(`  ${String(i).padStart(6)}  ${r[0].toFixed(3).padStart(12)}  ${r[1].toFixed(3).padStart(12)}  ${r[2].toFixed(3).padStart(12)}`);
      sumRz += r[2];
    });
    console.log("  " + "-".repeat(44));
    console.log(`  ${"TOTAL".padStart(6)}  ${"".padStart(12)}  ${"".padStart(12)}  ${sumRz.toFixed(3).padStart(12)}`);
  }
}

function printModal(result) {
  console.log("\n" + "-".repeat(72));
  console.log("  ANALISIS MODAL (K*phi = w2*M*phi)");
  console.log("-".repeat(72));

  const dirs = ["Ux", "Uy", "Uz", "Rx", "Ry", "Rz"];
  console.log(`\n  ${"Modo".padStart(4)}  ${"f (Hz)".padStart(10)}  ${"T (s)".padStart(10)}  ${"w (rad/s)".padStart(12)}`);
  console.log("  " + "-".repeat(40));
  for (let i = 0; i < result.frequencies.length; i++) {
    const f = result.frequencies[i];
    const T = f > 0 ? 1 / f : 0;
    const w = f * 2 * Math.PI;
    console.log(`  ${String(i + 1).padStart(4)}  ${f.toFixed(4).padStart(10)}  ${T.toFixed(4).padStart(10)}  ${w.toFixed(4).padStart(12)}`);
  }

  if (result.massParticipation.length > 0) {
    console.log(`\n  Masa Participativa (%):`);
    console.log(`  ${"Modo".padStart(4)}  ${dirs.map(d => d.padStart(8)).join("  ")}`);
    console.log("  " + "-".repeat(56));
    for (let i = 0; i < result.massParticipation.length; i++) {
      const mp = result.massParticipation[i];
      const vals = mp.map(v => (v * 100).toFixed(1).padStart(7) + "%").join("  ");
      console.log(`  ${String(i + 1).padStart(4)}  ${vals}`);
    }
  }
}

// ══════════════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════════════

function parseArgs(args) {
  const params = {};
  let doStatic = false, doModal = false, jsonOut = null;

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--static") { doStatic = true; continue; }
    if (a === "--modal") { doModal = true; continue; }
    if (a === "--json" && i + 1 < args.length) { jsonOut = args[++i]; continue; }
    if (a === "--modes" && i + 1 < args.length) { params.modes = parseInt(args[++i]); continue; }
    if (a.includes("=")) {
      const [k, v] = a.split("=");
      if (v.includes(",")) params[k] = v.split(",").map(Number);
      else params[k] = Number(v);
    }
  }

  // Default: both
  if (!doStatic && !doModal) { doStatic = true; doModal = true; }

  return { params, doStatic, doModal, jsonOut };
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === "help") {
    console.log(`
Hekatan Struct CLI — Analisis Estructural sin UI
=============================================
Uso: node cli.mjs <generador> [parametros] [opciones]

Generadores:
  edificio   Edificio 3D (svx, svy, sp, CM)
  frame      Portico 2D  (nv, sv, np, hp, CM)

Parametros (edificio):
  svx=5,5,3    Luces individuales en X (m)
  svy=4,4      Luces individuales en Y (m)
  sp=3,3,3     Alturas de piso (m)
  CM=-10       Carga muerta (kN/m2)

Parametros (frame):
  nv=3         Numero de vanos
  sv=6         Luz de vano (m)
  np=3         Numero de pisos
  hp=3         Altura de piso (m)
  CM=-10       Carga muerta (kN/m)

Opciones:
  --static     Solo analisis estatico
  --modal      Solo analisis modal
  --modes 12   Numero de modos (default 6)
  --json f.json  Exportar resultados a JSON

Ejemplos:
  node cli.mjs edificio
  node cli.mjs edificio svx=6,4,6 svy=5,5 sp=3,3,3,3
  node cli.mjs edificio --modal --modes 12
  node cli.mjs frame nv=4 sv=5 np=5 hp=3.2
  node cli.mjs frame --json results.json
`);
    return;
  }

  const gen = args[0];
  const { params, doStatic, doModal, jsonOut } = parseArgs(args.slice(1));

  let model;
  if (gen === "edificio") {
    const p = {};
    if (params.svx) p.svx = Array.isArray(params.svx) ? params.svx : [params.svx];
    if (params.svy) p.svy = Array.isArray(params.svy) ? params.svy : [params.svy];
    if (params.sp) p.sp = Array.isArray(params.sp) ? params.sp : [params.sp];
    if (params.CM) p.CM = params.CM;
    if (params.np) p.sp = Array(params.np).fill(params.hp || 3);
    model = generateEdificio(p);
  } else if (gen === "frame") {
    model = generateFrame(params);
  } else {
    console.log(`Generador desconocido: ${gen}. Use: edificio, frame`);
    return;
  }

  printModel(model);

  const output = { model: model.info };
  const t0 = performance.now();

  if (doStatic) {
    const ts = performance.now();
    const staticResult = await runDeform(model.nodes, model.elements, model.nodeInputs, model.elementInputs);
    const staticTime = performance.now() - ts;
    printStatic(staticResult, model.nodes, model.nodeInputs);
    console.log(`  Tiempo: ${(staticTime).toFixed(1)} ms`);

    output.static = {
      maxDisplacement: [...staticResult.deformations.values()].reduce((max, d) => {
        const m = Math.sqrt(d[0]**2 + d[1]**2 + d[2]**2);
        return m > max ? m : max;
      }, 0),
      deformations: Object.fromEntries(staticResult.deformations),
      reactions: Object.fromEntries(staticResult.reactions),
    };
  }

  if (doModal) {
    const numModes = params.modes || 6;
    const tm = performance.now();
    const modalResult = await runModal(model.nodes, model.elements, model.nodeInputs, model.elementInputs, numModes);
    const modalTime = performance.now() - tm;
    printModal(modalResult);
    console.log(`  Tiempo: ${(modalTime).toFixed(1)} ms`);

    output.modal = {
      frequencies: modalResult.frequencies,
      periods: modalResult.frequencies.map(f => f > 0 ? 1/f : 0),
      massParticipation: modalResult.massParticipation,
    };
  }

  const totalTime = performance.now() - t0;
  console.log("\n" + "=".repeat(72));
  console.log(`  TOTAL: ${totalTime.toFixed(1)} ms`);
  console.log("=".repeat(72));

  if (jsonOut) {
    writeFileSync(jsonOut, JSON.stringify(output, null, 2));
    console.log(`  Resultados exportados: ${jsonOut}`);
  }
}

main();
