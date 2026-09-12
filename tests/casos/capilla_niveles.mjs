/**
 * Capilla Analítico — importar una estructura POR NIVELES (story-based) de ETABS.
 *
 * Por qué existe este caso (Jorge, 11-sep-2026: «tienes que hacer test cuando
 * hay niveles / estructuras así»):
 *
 * La capilla es un modelo de ETABS con 19 «stories» en orden REVUELTO (Nivel5
 * entre Nivel13 y Nivel12, Nivel2 con 103" de altura…) y automallado. El texto
 * e2k de un modelo así es frágil de reconstruir: reparseándolo, el lector
 * `parseE2k` sacaba **306 nudos / 297 barras con 116 sueltos** (matriz singular)
 * en vez de los 152 nudos / 187 barras de ETABS. Salía un modelo que no era el
 * de ETABS y no resolvía.
 *
 * El arreglo (`etabs-cli geom`, OAPI): se lee la geometría 3D EXACTA del propio
 * ETABS —coordenadas cartesianas de cada joint, conectividad de cada barra,
 * apoyos— nudo a nudo, sin reparsear texto. El ORÁCULO es ETABS.
 *
 * Este caso vigila esa geometría fiel: contada en ETABS 22 por OAPI
 * (`csi-cli/etabs-cli/cli/etabs_cli.py geom "Capilla Analitico.EDB"`), volcada a
 * `tests/datos/capilla_geom_etabs.json`. Si el modelo importado deja de tener
 * 152 nudos / 187 barras / 26 apoyos, o aparece UN nudo suelto, falla.
 */
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const M = JSON.parse(readFileSync(join(__dirname, "..", "datos", "capilla_geom_etabs.json"), "utf8"));

// Valores de ETABS 22 (OAPI). El oráculo es otro programa, no una cuenta a mano.
const ETABS = { nudos: 152, barras: 187, apoyos: 26 };

export const nombre = "capilla-niveles";
export const descripcion = "Import por niveles (story-based) de ETABS: 152 nudos / 187 barras / 0 sueltos (geom OAPI)";

/** Nudos que NO llegan a ningún apoyo siguiendo las barras (BFS). 0 = estable. */
function nudosSueltos(M) {
  const N = M.nodes.length;
  const sup = new Set((M.supports || []).map(([i]) => i));
  const adj = Array.from({ length: N }, () => []);
  for (const e of M.elements) if (e.length === 2) { adj[e[0]].push(e[1]); adj[e[1]].push(e[0]); }
  const seen = new Set(sup); const q = [...sup];
  while (q.length) { const u = q.pop(); for (const v of adj[u]) if (!seen.has(v)) { seen.add(v); q.push(v); } }
  let sueltos = 0, aislados = 0;
  for (let i = 0; i < N; i++) { if (!seen.has(i)) sueltos++; if (adj[i].length === 0) aislados++; }
  return { sueltos, aislados };
}

export async function correr() {
  const filas = [];
  const push = (que, medido, limite, ok) => filas.push({ que, medido, limite, ok });

  push("nudos", M.nodes.length, ETABS.nudos, M.nodes.length === ETABS.nudos);
  push("barras", M.elements.length, ETABS.barras, M.elements.length === ETABS.barras);
  push("apoyos", (M.supports || []).length, ETABS.apoyos, (M.supports || []).length === ETABS.apoyos);

  const { sueltos, aislados } = nudosSueltos(M);
  push("nudos sueltos (no llegan a apoyo)", sueltos, 0, sueltos === 0);
  push("nudos aislados (0 barras)", aislados, 0, aislados === 0);

  // La cota de la cubierta: el modelo tiene que llegar a ~7.13 m (la del ridge
  // en ETABS), no a una cota inventada por un apilado de stories mal leído.
  const zmax = Math.max(...M.nodes.map((n) => n[2]));
  push("cota máx cubierta (m)", +zmax.toFixed(2), 7.13, Math.abs(zmax - 7.13) < 0.05);

  return filas;
}
