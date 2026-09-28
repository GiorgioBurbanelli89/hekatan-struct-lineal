// Compara dos corridas de `test_todo.mjs` paso a paso: la de ANTES (main) y la de DESPUÉS.
//
//   node cli/comparar_test_todo.mjs <resumen_antes.json> <resumen_despues.json> [destino=local]
//
// Un paso «empeora» si pasa de ok a FALLA/COLGADO o si baja su cuenta de comprobaciones buenas;
// «mejora» si es al revés. Lo que ya fallaba antes y sigue igual no es culpa del cambio.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const [antesF, despuesF, destino = "local"] = process.argv.slice(2);
if (!antesF || !despuesF) { console.error("uso: node cli/comparar_test_todo.mjs <antes.json> <despues.json> [destino]"); process.exit(2); }
const lee = (f) => JSON.parse(readFileSync(f, "utf-8"));
const A = lee(antesF), D = lee(despuesF);
const clave = (r) => `${r.destino}/${r.nombre}`;
const de = (R) => new Map(R.resultados.filter((r) => r.destino === destino || r.destino === "fuente").map((r) => [clave(r), r]));
const a = de(A), d = de(D);
const MALO = new Set(["FALLA", "COLGADO", "SIN DISCO"]);
const filas = [];
for (const k of new Set([...a.keys(), ...d.keys()])) {
  const x = a.get(k), y = d.get(k);
  let que;
  if (!x) que = "NUEVO";
  else if (!y) que = "sin correr";
  else if (MALO.has(y.veredicto) && !MALO.has(x.veredicto)) que = "EMPEORA";
  else if (!MALO.has(y.veredicto) && MALO.has(x.veredicto)) que = "MEJORA";
  // si no se comprobó lo MISMO (otro número de comprobaciones) las cuentas no se pueden restar:
  // p. ej. la suite numérica de main reventaba a medias (576) y la de ahora llega al final (1002)
  else if (Math.abs(((y.ok ?? 0) + (y.no ?? 0)) - ((x.ok ?? 0) + (x.no ?? 0))) > 0) que = "OTRO TAMAÑO";
  else if ((y.ok ?? 0) < (x.ok ?? 0) || (y.no ?? 0) > (x.no ?? 0)) que = "EMPEORA";
  else if ((y.ok ?? 0) > (x.ok ?? 0) || (y.no ?? 0) < (x.no ?? 0)) que = "MEJORA";
  else que = "igual";
  filas.push({ paso: k, que, antes: x ? `${x.veredicto} ${x.ok ?? 0}/${(x.ok ?? 0) + (x.no ?? 0)}` : "—",
    despues: y ? `${y.veredicto} ${y.ok ?? 0}/${(y.ok ?? 0) + (y.no ?? 0)}` : "—", nota: y?.nota ?? "" });
}
const orden = { EMPEORA: 0, "OTRO TAMAÑO": 1, MEJORA: 2, NUEVO: 3, "sin correr": 4, igual: 5 };
filas.sort((p, q) => orden[p.que] - orden[q.que] || p.paso.localeCompare(q.paso));
const cuenta = {};
for (const f of filas) cuenta[f.que] = (cuenta[f.que] ?? 0) + 1;
// `estado` es una lista de frases; la primera dice la rama y el commit
const rama = (R) => String([].concat(R.estado ?? [])[0] ?? "?").replace(/^rama\s+/, "").split(/\s+\d{4}-/)[0];
const L = [`# Test entero: antes (${rama(A)}) y después (${rama(D)}) · ${destino}`, "",
  Object.entries(cuenta).map(([k, v]) => `${k}: ${v}`).join(" · "), "",
  "| paso | qué pasa | antes | después |", "|---|---|---|---|",
  ...filas.filter((f) => f.que !== "igual").map((f) => `| ${f.paso} | **${f.que}** | ${f.antes} | ${f.despues} |`),
  "", "## Igual que antes", "", "| paso | antes | después |", "|---|---|---|",
  ...filas.filter((f) => f.que === "igual").map((f) => `| ${f.paso} | ${f.antes} | ${f.despues} |`)];
const salida = join(dirname(despuesF), "comparacion_con_main.md");
writeFileSync(salida, L.join("\n") + "\n", "utf-8");
console.log(Object.entries(cuenta).map(([k, v]) => `${k}: ${v}`).join(" · "));
for (const f of filas.filter((f) => f.que === "EMPEORA")) console.log(`  EMPEORA  ${f.paso}  ${f.antes} → ${f.despues}`);
for (const f of filas.filter((f) => f.que === "OTRO TAMAÑO")) console.log(`  OTRO TAMAÑO  ${f.paso}  ${f.antes} → ${f.despues}  (mirar a mano)`);
for (const f of filas.filter((f) => f.que === "MEJORA")) console.log(`  MEJORA   ${f.paso}  ${f.antes} → ${f.despues}`);
console.log("→", salida);
