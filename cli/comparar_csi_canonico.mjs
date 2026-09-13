#!/usr/bin/env node
/**
 * ¿DOS FICHEROS CSI DICEN EL MISMO MODELO?  (e2k o s2k, en cualquier combinación)
 *
 *   node cli/comparar_csi_canonico.mjs A.e2k B.e2k [tol=1e-6]
 *
 * ETABS y SAP2000 RENUMERAN nudos y elementos al importar/exportar, así que no
 * se compara índice a índice: cada nudo se identifica por sus COORDENADAS
 * (redondeo 1 mm) y cada elemento por las coordenadas de sus nudos (en su orden
 * cíclico, sin importar por cuál empieza). Después se comparan TODOS los mapas
 * de `elementInputs` y `nodeInputs` que el parser de Hekatan devuelve —barras,
 * cáscaras, apoyos, cargas, muelles— campo a campo, con tolerancia relativa.
 * Lo que un fichero trae y el otro no, también se lista.
 */
import { readFileSync } from "node:fs";
import { empaquetar, R } from "../tests/lib/bundle.mjs";

const [fa, fb, tolArg] = process.argv.slice(2);
if (!fa || !fb) { console.error("uso: node cli/comparar_csi_canonico.mjs A.(e2k|s2k) B.(e2k|s2k) [tol]"); process.exit(2); }
const TOL = tolArg ? parseFloat(tolArg.replace("tol=", "")) : 1e-6;

const mod = await empaquetar(`
export { parseE2k } from "${R}/examples/src/shared/e2kParser";
export { parseS2k } from "${R}/examples/src/shared/s2kParser";
`, "comparar-csi-canonico");

const leer = (f) => {
  const t = readFileSync(f, "utf-8");
  return /\.e2k$|\.\$et$/i.test(f) ? mod.parseE2k(t) : mod.parseS2k(t);
};

const clave = (p) => p.map(v => (Math.round(v * 1000) / 1000).toFixed(3)).join(",");
const claveElem = (m, e) => {
  const c = e.map(i => clave(m.nodes[i]));
  if (c.length === 2) return "B:" + [...c].sort().join("|");
  // polígono: rotación mínima en los dos sentidos (el mismo panel puede empezar por otro nudo)
  const rot = (a) => a.map((_, k) => [...a.slice(k), ...a.slice(0, k)].join("|"));
  return "S:" + [...rot(c), ...rot([...c].reverse())].sort()[0];
};

function canon(m) {
  const N = new Map(), E = new Map();
  m.nodes.forEach((p, i) => {
    const r = {};
    for (const [k, mp] of Object.entries(m.nodeInputs ?? {}))
      if (mp instanceof Map && mp.has(i)) r[k] = mp.get(i);
    N.set(clave(p), r);
  });
  m.elements.forEach((e, i) => {
    const r = { nudos: e.length };
    for (const [k, mp] of Object.entries(m.elementInputs ?? {}))
      if (mp instanceof Map && mp.has(i)) r[k] = mp.get(i);
    E.set(claveElem(m, e), r);
  });
  return { N, E };
}

const igualV = (a, b) => {
  if (typeof a === "number" && typeof b === "number") {
    const s = Math.max(Math.abs(a), Math.abs(b), 1e-12);
    return Math.abs(a - b) / s <= TOL || Math.abs(a - b) < 1e-12;
  }
  if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((x, i) => igualV(x, b[i]));
  return JSON.stringify(a) === JSON.stringify(b);
};

const A = leer(fa), B = leer(fb);
const ca = canon(A), cb = canon(B);
console.log(`A: ${fa}\n   ${A.nodes.length} nudos, ${A.elements.length} elementos`);
console.log(`B: ${fb}\n   ${B.nodes.length} nudos, ${B.elements.length} elementos`);

let malos = 0;
for (const [que, ma, mb] of [["nudo", ca.N, cb.N], ["elemento", ca.E, cb.E]]) {
  const soloA = [...ma.keys()].filter(k => !mb.has(k)), soloB = [...mb.keys()].filter(k => !ma.has(k));
  console.log(`\n${que}s: A ${ma.size} · B ${mb.size} · solo en A ${soloA.length} · solo en B ${soloB.length}`);
  soloA.slice(0, 3).forEach(k => console.log("   solo A: " + k));
  soloB.slice(0, 3).forEach(k => console.log("   solo B: " + k));
  malos += soloA.length + soloB.length;
  const campos = new Map();   // campo -> [iguales, distintos, ejemplo]
  for (const [k, ra] of ma) {
    const rb = mb.get(k); if (!rb) continue;
    for (const c of new Set([...Object.keys(ra), ...Object.keys(rb)])) {
      const s = campos.get(c) ?? [0, 0, null];
      if (igualV(ra[c], rb[c])) s[0]++;
      else { s[1]++; s[2] ??= `${k}: A=${JSON.stringify(ra[c])} B=${JSON.stringify(rb[c])}`; }
      campos.set(c, s);
    }
  }
  for (const [c, [ok, mal, ej]] of [...campos].sort()) {
    console.log(`   ${mal ? "DISTINTO" : "IGUAL   "} ${c.padEnd(26)} ${ok} iguales${mal ? ", " + mal + " distintos · " + ej.slice(0, 160) : ""}`);
    malos += mal;
  }
}
console.log(`\n${malos === 0 ? "MISMO MODELO" : "HAY " + malos + " DIFERENCIAS"} (tol relativa ${TOL})`);
process.exit(malos ? 1 : 0);
