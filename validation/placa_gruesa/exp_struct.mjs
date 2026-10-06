// Experimentos Struct: casos de placa gruesa, variando formulación y malla.
// node exp_struct.mjs <caso> <n|tam> <form> [dump.json]
//   caso: losa | safe | L | boveda ; form: thick thin dkmq dse auricchio
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
const W = fileURLToPath(new URL("../..", import.meta.url)).split("\\").join("/").replace(/\/$/, "");
process.chdir(W);
const { resolverHeks } = await import("file:///" + W + "/tests/lib/heks.mjs");
const [caso, nS, form, dumpOut] = process.argv.slice(2);
const OUT = fileURLToPath(new URL("./trabajo/", import.meta.url)).split("\\").join("/");  // crear trabajo/dumps antes
const L = [];
function rejilla(a, b, nx, ny, z, T, E, NU, extra) {
  const id = (i, j) => i * (ny + 1) + j + 1;
  for (let i = 0; i <= nx; i++) for (let j = 0; j <= ny; j++) L.push(`node ${id(i, j)} ${(i * a / nx).toFixed(9)} ${(j * b / ny).toFixed(9)} ${z}`);
  let s = 0;
  for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) { s++; L.push(`shell ${s} ${id(i, j)} ${id(i + 1, j)} ${id(i + 1, j + 1)} ${id(i, j + 1)} ${T} ${E}`); L.push(`shellnu ${s} ${NU}`); extra(s); }
  return { id, ns: s };
}
let ns = 1;
if (caso === "losa") {            // losa_sola.heks: 5x5 t .2, 4 esquinas empotradas, q -10
  const n = +nS; const r = rejilla(5, 5, n, n, 3, 0.2, 25e6, 0.2, (s) => L.push(`areaload ${s} -10`));
  for (const [i, j] of [[0, 0], [n, 0], [n, n], [0, n]]) L.push(`support ${r.id(i, j)} fixed`);
  ns = r.ns;
} else if (caso === "losaP") {    // misma losa, esquinas ARTICULADAS (solo traslaciones)
  const n = +nS; const r = rejilla(5, 5, n, n, 3, 0.2, 25e6, 0.2, (s) => L.push(`areaload ${s} -10`));
  for (const [i, j] of [[0, 0], [n, 0], [n, n], [0, n]]) L.push(`support ${r.id(i, j)} 1 1 1 0 0 0`);
  ns = r.ns;
} else if (caso === "ss" || caso === "losaPnu") {   // SS duro (Navier) / esquinas articuladas con NU y T de entorno
  const n = +nS, T = +(process.env.T ?? 0.2), NU = +(process.env.NU ?? 0.2);
  const r = rejilla(5, 5, n, n, 0, T, 25e6, NU, (s) => L.push(`areaload ${s} -10`));
  if (caso === "ss") {
    for (let i = 0; i <= n; i++) for (let j = 0; j <= n; j++) {
      const bx = i === 0 || i === n, by = j === 0 || j === n;
      // en el plano fijo (no cargado); borde x=cte: w=0 y giro rx=0 (tangencial); borde y=cte: w=0 y ry=0
      L.push(`support ${r.id(i, j)} 1 1 ${bx || by ? 1 : 0} ${bx ? 1 : 0} ${by ? 1 : 0} 1`);
    }
  } else for (const [i, j] of [[0, 0], [n, 0], [n, n], [0, n]]) L.push(`support ${r.id(i, j)} 1 1 1 0 0 0`);
  ns = r.ns;
} else if (caso === "safe") {     // muelle de área: 4x4 t .2 ks 20000 P 1000 centro
  const n = +nS; const h = 4 / n;
  const r = rejilla(4, 4, n, n, 0, 0.2, 25e6, 0.2, (s) => L.push(`areaspring ${s} 20000 nodal`));
  for (let i = 0; i <= n; i++) for (let j = 0; j <= n; j++) L.push(`support ${r.id(i, j)} 1 1 0 0 0 1`);
  L.push(`load ${r.id(n / 2, n / 2)} 0 0 -1000`);
  ns = r.ns;
} else if (caso === "L") {
  L.push(...`node 1 0 0 0
node 2 10 0 0
node 3 10 5 0
node 4 6 5 0
node 5 6 8 0
node 6 0 8 0
node 7 2 1 0
node 8 5 1 0
node 9 5 4 0
node 10 2 4 0
area 1 0.20 25e6 1 2 3 4 5 6
hueco 1 7 8 9 10
areaload 1 -10
apoyoborde 1 pinned
automesh ${nS}`.split("\n"));
} else if (caso === "boveda") {
  L.push(...`node 1 0 0 7
node 2 0 20 7
node 3 6 20 7
node 4 6 0 7
shell 1 1 2 3 4 0.20 25e6 0.2
arco 1 2 0 10 9.5
arco 4 3 6 10 9.5
areaload 1 -10
support 1 fixed
support 2 fixed
support 3 fixed
support 4 fixed
automesh ${nS}`.split("\n"));
}
if (form && form !== "thick") L.push(`shelltype 1-${Math.max(ns, 100000)} ${form}`);
L.push("solve");
const tag = (process.env.T ? '_t' + process.env.T : '') + (process.env.NU ? '_nu' + process.env.NU : '');
const ruta = OUT + `_${caso}${tag}_${nS}_${form}.heks`;
writeFileSync(ruta, L.join("\n") + "\n");
const r = await resolverHeks(ruta);
const U = r.deformOutputs.deformations;
const pf = r.elementInputs.plateFormulations;
const out = { caso, n: nS, form, nN: r.nodes.length, nE: r.elements.length, pf0: pf?.get?.(0), nodes: r.nodes, w: r.nodes.map((_, i) => (U.get(i) ?? [])[2] ?? 0), u: r.nodes.map((_, i) => U.get(i) ?? [0,0,0,0,0,0]) };
let wmin = 0, imin = -1; out.w.forEach((v, i) => { if (v < wmin) { wmin = v; imin = i; } });
out.wmin = wmin; out.at = r.nodes[imin];
writeFileSync(OUT + `_${caso}${tag}_${nS}_${form}.json`, JSON.stringify(out));
if (dumpOut) {
  const plano = (o) => o instanceof Map ? Object.fromEntries([...o].map(([k, v]) => [k, plano(v)])) : Array.isArray(o) ? o.map(plano) : (o && typeof o === "object") ? Object.fromEntries(Object.entries(o).map(([k, v]) => [k, plano(v)])) : o;
  writeFileSync(OUT + dumpOut, JSON.stringify({ nodes: r.nodes, elements: r.elements, nodeInputs: plano(r.nodeInputs), elementInputs: plano(r.elementInputs), deformations: plano(U ?? {}), reactions: plano(r.deformOutputs.reactions ?? {}) }));
}
console.log(JSON.stringify({ caso, n: nS, form, nN: out.nN, nE: out.nE, pf0: out.pf0, wmin: wmin.toExponential(6), at: out.at }));
process.exit(0);
