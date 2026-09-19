/**
 * La TABLA de los 162, a partir de `cli/shots/barrido162/resultados.jsonl`.
 *
 *   node cli/barrido_162_tabla.mjs [--md] [--solo-fallos]
 *
 * Re-evalua el equilibrio sobre los datos YA medidos, con el invariante bueno
 * (ver la nota larga de `barrido_162.mjs`): `SR_i + S(TODAS las F_i) = 0`. Las
 * lineas escritas antes del 18-sep-2026 20:00 llevan el criterio viejo (solo los
 * nudos libres), y por eso se recalcula aqui en vez de fiarse del campo `ok`.
 */
import { readFileSync, existsSync } from "node:fs";

const args = process.argv.slice(2);
const MD = args.includes("--md");
const SOLO = args.includes("--solo-fallos");
const F = "cli/shots/barrido162/resultados.jsonl";
const CENTINELA = "cli/shots/barrido162/centinela.json";
if (!existsSync(F)) { console.error(`no existe ${F}`); process.exit(2); }

const TOL_EQ = 0.005;
const filas = readFileSync(F, "utf-8").split("\n").filter(Boolean)
  .map((l) => { try { return JSON.parse(l); } catch { return null; } })
  .filter(Boolean);

// el ULTIMO de cada id gana (el jsonl se puede reanudar y re-medir)
const porId = new Map();
for (const r of filas) porId.set(r.id, r);
const todos = [...porId.values()];

const nom = ["X", "Y", "Z"];

function evaluar(r) {
  const fallos = [];
  // los que no dependen del criterio viejo se conservan tal cual
  for (const f of r.fallos ?? []) {
    if (/^equilibrio [XYZ]/.test(f)) continue;   // se recalcula abajo
    fallos.push(f);
  }
  const res = [null, null, null];
  const total = r.sFtotal ?? null;   // solo lo traen las lineas nuevas
  if (r.nReac > 0 && total) {
    for (let k = 0; k < 3; k++) {
      const Fk = total[k], Rk = r.sReac?.[k] ?? 0;
      if (Math.abs(Fk) < 1e-9) continue;
      const d = Math.abs(Rk + Fk) / Math.abs(Fk);
      res[k] = d;
      if (d > TOL_EQ) fallos.push(
        `equilibrio ${nom[k]}: ${(d * 100).toFixed(2)} % (SR=${Rk.toFixed(3)}, SF=${Fk.toFixed(3)})`);
    }
  }
  return { fallos, res, sinTotal: !total && r.nReac > 0 };
}

const out = todos.map((r) => {
  const e = evaluar(r);
  return { ...r, fallosFinal: e.fallos, residuoFinal: e.res, sinTotal: e.sinTotal,
           okFinal: e.fallos.length === 0 };
}).sort((a, b) => a.id.localeCompare(b.id));

const malos = out.filter((r) => !r.okFinal);
const remedir = out.filter((r) => r.sinTotal);

const veredicto = (r) => {
  if (r.okFinal) return "ok";
  if ((r.fallosFinal ?? []).some((f) => /arnes|ConnectionClosed/.test(f))) return "SIN MEDIR";
  return "FALLA";
};
const pct = (v) => (v == null ? "—" : `${(v * 100).toFixed(3)} %`);

if (MD) {
  console.log(`| id | veredicto | nudos | elem | eq X | eq Y | eq Z | fallo |`);
  console.log(`|---|---|---|---|---|---|---|---|`);
  for (const r of out) {
    if (SOLO && r.okFinal) continue;
    console.log(`| \`${r.id}\` | ${veredicto(r)} | ${r.nNodes ?? (r.embebido ? "—" : "?")} | ` +
      `${r.nElems ?? (r.embebido ? "—" : "?")} | ${pct(r.residuoFinal[0])} | ${pct(r.residuoFinal[1])} | ` +
      `${pct(r.residuoFinal[2])} | ${(r.fallosFinal[0] ?? "").slice(0, 90)} |`);
  }
} else {
  for (const r of out) {
    if (SOLO && r.okFinal) continue;
    console.log(`${veredicto(r).padEnd(9)} ${r.id.padEnd(34)} ` +
      `n=${String(r.nNodes ?? (r.embebido ? "emb" : "?")).padStart(5)} ` +
      `e=${String(r.nElems ?? (r.embebido ? "emb" : "?")).padStart(5)}  ` +
      `${r.fallosFinal.join(" | ").slice(0, 100)}`);
  }
}

// Lo PRIMERO: ¿la tabla vale? Si el arbol se movio mientras se media, no es una
// medida, es una mezcla — y hay que decirlo antes que ningun numero.
if (existsSync(CENTINELA)) {
  const c = JSON.parse(readFileSync(CENTINELA, "utf-8"));
  if (c.movidos?.length) {
    console.error(`
⚠️  ESTA TABLA NO VALE COMO MEDIDA: el arbol se movio mientras se media.`);
    for (const f of c.movidos)
      console.error(`   ${f}: ${c.inicio[f]?.bytes} B (${c.inicio[f]?.mtime}) ` +
        `-> ${c.fin[f]?.bytes} B (${c.fin[f]?.mtime})`);
    console.error(`   Sirve para clasificar causas; para la tabla buena hay que re-correr con el arbol quieto.`);
  } else {
    console.error(`
[arbol quieto] ` + Object.entries(c.fin)
      .map(([f, v]) => `${f.split("/").pop()} ${v?.bytes} B`).join(" · "));
  }
} else {
  console.error(`
(sin centinela: el barrido se corrio con una version del arnes que no lo tenia)`);
}

console.error(`
${out.length - malos.length}/${out.length} ok`);

// Los medidos con el criterio VIEJO (solo nudos libres) no hay que re-medirlos
// todos, solo los que FALLARON:
//
//   viejo:  SR + S(F de nudos libres)      nuevo:  SR + S(F total)
//
// y  S(F total) = S(F libres) + S(F sobre apoyos). El termino que sobra en el
// viejo es la carga sobre los apoyos, que solo puede EMPEORAR el residuo (es
// cero si no hay carga sobre apoyos). O sea que el criterio viejo solo da
// FALSOS POSITIVOS, nunca falsos negativos: lo que paso con el viejo, pasa con
// el nuevo. Por eso basta re-medir los fallos.
// Solo hay que re-medir los que fallan POR EQUILIBRIO con el criterio viejo.
// Un 404 de la pagina standalone o un ConnectionClosedError no tienen nada que
// ver con el invariante: re-medirlos por eso seria ruido.
const viejosQueFallan = malos.filter((r) => r.sinTotal &&
  (r.fallos ?? []).some((f) => /^equilibrio [XYZ]/.test(f)));
if (viejosQueFallan.length) {
  console.error(`   ${viejosQueFallan.length} fallos se midieron con el criterio de equilibrio ` +
    `viejo y hay que RE-MEDIRLOS: ${viejosQueFallan.map((r) => r.id).join(", ")}`);
} else if (remedir.length) {
  console.error(`   (${remedir.length} se midieron con el criterio viejo pero PASARON: el viejo ` +
    `solo da falsos positivos, asi que no hace falta re-medirlos)`);
}
