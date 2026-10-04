/**
 * Los MODIFICADORES de barra en el .e2k (inercia agrietada, etc.).
 *
 * Hasta el 4-oct-2026 el exportador escribia en el LINEASSIGN
 *     PROPMODIFIERS "1 1 1 1 0.5 0.5 1 1"
 * y esa palabra NO existe en ETABS. Los tokens reales se leyeron de las cadenas
 * UTF-16 de ETABS.exe (v19) y ETABS.dll (v22):
 *   LINEASSIGN   PROPMODA PROPMODA2 PROPMODA3 PROPMODT PROPMODI22 PROPMODI33 PROPMODM PROPMODW
 *   AREAASSIGN   PROPMODF11 ... PROPMODV23 PROPMODM PROPMODW
 *   FRAMESECTION AMOD A2MOD A3MOD JMOD I2MOD I3MOD MMOD WMOD  (en .$et reales)
 *
 * Struct guarda los valores EFECTIVOS (el motor no tiene modificadores); el
 * e2k lleva la seccion BRUTA y el factor en el LINEASSIGN. Se comprueba:
 *   1. la palabra clave y los valores que salen;
 *   2. que el lector devuelve las mismas cifras efectivas (ida y vuelta);
 *   3. con un .e2k REAL de ETABS (`ref_riochico.e2k`, secciones con I2MOD/I3MOD)
 *      y un LINEASSIGN con PROPMOD* a mano: ETABS → Struct → e2k → Struct da
 *      las mismas A, As, J, I y densidad en todas las barras.
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { empaquetar, R } from "../lib/bundle.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const RIOCHICO = join(AQUI, "..", "..", "..", "galpon-bodega-electoral", "ref_riochico.e2k");

export const nombre = "e2k-propmodifiers";
export const descripcion =
  "modificadores de barra: PROPMODA..PROPMODW en el LINEASSIGN (tokens de ETABS.dll) y ida y vuelta";

const cargar = () => empaquetar(
  `export { exportE2k } from "${R}/examples/src/shared/e2kExporter";\n` +
  `export { parseE2k } from "${R}/examples/src/shared/e2kParser";\n`, "e2kPropMod");

/** Portico de 2 columnas y 1 viga, 30x50 de hormigon. */
export function portico(mods) {
  const nodes = [[0, 0, 0], [0, 0, 3], [5, 0, 3], [5, 0, 0]];
  const elements = [[0, 1], [1, 2], [2, 3]];
  const b = 0.3, h = 0.5, A = b * h, I33 = b * h ** 3 / 12, I22 = h * b ** 3 / 12, J = 0.0028;
  const todos = (v) => new Map(elements.map((_, i) => [i, v]));
  const ef = (k, v) => new Map(elements.map((_, i) => [i, v * (mods.get(i)?.[k] ?? 1)]));
  return {
    nodes, elements,
    nodeInputs: { supports: new Map([[0, [true, true, true, true, true, true]], [3, [true, true, true, true, true, true]]]),
                  loads: new Map() },
    elementInputs: {
      elasticities: todos(2.5e7), shearModuli: todos(1.04e7), poissonsRatios: todos(0.2),
      densities: new Map(elements.map((_, i) => [i, 2.4 * (mods.get(i)?.[6] ?? 1) / (mods.get(i)?.[0] ?? 1)])),
      areas: ef(0, A), shearAreasZ: ef(1, A * 5 / 6), shearAreasY: ef(2, A * 5 / 6),
      torsionalConstants: ef(3, J), momentsOfInertiaY: ef(4, I22), momentsOfInertiaZ: ef(5, I33),
    },
    propertyModifiers: mods,
    units: { force: "kN", length: "m" },
    title: "propmod",
  };
}

const lineas = (e2k, re) => e2k.split(/\r?\n/).filter(l => re.test(l));
/** Barra -> indice, por la geometria (el lector puede numerar en otro orden). */
const porGeometria = (mdl) => {
  const k = (p) => p.map(v => v.toFixed(3)).join(",");
  const mapa = new Map();
  mdl.elements.forEach((e, i) => {
    if (e.length !== 2) return;
    mapa.set([k(mdl.nodes[e[0]]), k(mdl.nodes[e[1]])].sort().join("|"), i);
  });
  return mapa;
};
const relErr = (a, b) => Math.abs(a - b) / Math.max(Math.abs(b), 1e-30);

export async function correr() {
  const { exportE2k, parseE2k } = await cargar();
  const filas = [];

  // ── 1. Palabra clave y valores ────────────────────────────────────────────
  const mods = new Map([[0, [1, 1, 1, 1, 0.8, 0.8, 1, 1]],            // columna: 0.8 Ig
                        [1, [1, 1, 1, 0.1, 0.35, 0.5, 0.9, 0.9]],      // viga: 0.5 Ig, J 0.1, masa 0.9
                        [2, [0.7, 1, 1, 1, 0.8, 0.8, 1, 1]]]);          // columna con AMOD 0.7
  const m = portico(mods);
  const e2k = exportE2k(m);
  const la = lineas(e2k, /^\s*LINEASSIGN/);
  filas.push({ que: "sin PROPMODIFIERS", crudo: true, medido: /PROPMODIFIERS/.test(e2k) ? "sale" : "no sale",
               limite: "no sale", ok: !/PROPMODIFIERS/.test(e2k), detalle: "token inventado, ETABS no lo conoce" });
  const viga = la.find(l => /PROPMODI33 0\.5\b/.test(l) && /PROPMODT 0\.1\b/.test(l));
  filas.push({ que: "viga PROPMODI33/T/M", crudo: true, medido: viga ? "ok" : la.join(" | "), limite: "ok",
               ok: !!viga && /PROPMODI22 0\.35\b/.test(viga) && /PROPMODM 0\.9\b/.test(viga) && /PROPMODW 0\.9\b/.test(viga)
                   && !/PROPMODA /.test(viga),
               detalle: "un token por factor distinto de 1, como ETABS en FRAMESECTION" });
  const nCol = la.filter(l => /PROPMODI22 0\.8\b/.test(l) && /PROPMODI33 0\.8\b/.test(l)).length;
  filas.push({ que: "columnas PROPMODI22/33", crudo: true, medido: nCol, limite: 2, ok: nCol === 2 });
  filas.push({ que: "columna AMOD → PROPMODA", crudo: true, medido: la.filter(l => /PROPMODA 0\.7\b/.test(l)).length,
               limite: 1, ok: la.filter(l => /PROPMODA 0\.7\b/.test(l)).length === 1 });

  // ── 2. Ida y vuelta Struct → e2k → Struct: mismas cifras efectivas ────────
  const p = parseE2k(e2k);
  const campos = ["areas", "shearAreasZ", "shearAreasY", "torsionalConstants", "momentsOfInertiaY",
                  "momentsOfInertiaZ", "densities"];
  // el lector entrega la densidad como MASA en las unidades del fichero; se compara el COCIENTE
  // entre barras para no depender de la conversion de unidades del material
  let peor = 0, donde = "";
  const gp = porGeometria(p), gm = porGeometria(m);
  const ip = (i) => gp.get([...gm].find(([, v]) => v === i)[0]);
  for (const c of campos) {
    if (c === "densities") continue;
    for (let i = 0; i < 3; i++) {
      const a = p.elementInputs[c]?.get(ip(i)), b = m.elementInputs[c].get(i);
      const e = relErr(a ?? 0, b);
      if (e > peor) { peor = e; donde = `${c}[${i}] ${a} vs ${b}`; }
    }
  }
  filas.push({ que: "ida y vuelta A,As,J,I", medido: peor * 100, limite: 1e-4, ok: peor * 100 <= 1e-4, detalle: donde });
  const d = p.elementInputs.densities, d0 = m.elementInputs.densities;
  const eD = Math.max(relErr(d.get(ip(1)) / d.get(ip(0)), d0.get(1) / d0.get(0)),
                      relErr(d.get(ip(2)) / d.get(ip(0)), d0.get(2) / d0.get(0)));
  filas.push({ que: "ida y vuelta masa", medido: eD * 100, limite: 1e-4, ok: eD * 100 <= 1e-4,
               detalle: "PROPMODM y AMOD (CSI no aplica AMOD a la masa)" });
  const pm = p.elementInputs.propertyModifiers?.get(ip(1)) ?? [];
  filas.push({ que: "propertyModifiers leidos", crudo: true, medido: pm.join(" "), limite: "1 1 1 0.1 0.35 0.5 0.9 0.9",
               ok: pm.join(" ") === "1 1 1 0.1 0.35 0.5 0.9 0.9" });
  // y el e2k re-exportado desde lo leido trae las mismas lineas de modificadores
  const e2k2 = exportE2k({ ...p, nodes: p.nodes, elements: p.elements, title: "propmod" });
  const toks = (t) => lineas(t, /^\s*LINEASSIGN/).map(l => (l.match(/PROPMOD\w+ [\d.]+/g) ?? []).join(" ")).sort().join(" | ");
  filas.push({ que: "re-export PROPMOD*", crudo: true, medido: toks(e2k2) === toks(e2k) ? "iguales" : toks(e2k2),
               limite: "iguales", ok: toks(e2k2) === toks(e2k) });

  // ── 3. .e2k REAL de ETABS → Struct → e2k → Struct ─────────────────────────
  if (existsSync(RIOCHICO)) {
    let txt = readFileSync(RIOCHICO, "utf-8");
    // un modificador de OBJETO con la sintaxis de ETABS (ETABS 19 lo escribe en el LINEASSIGN)
    let tocadas = 0;
    txt = txt.replace(/^(\s*LINEASSIGN\s+"[^"]+"\s+"[^"]+"\s+SECTION\s+"[^"]+")/m, (s) => { tocadas++; return `${s}  PROPMODI33 0.35 PROPMODT 0.1 PROPMODM 0.9 PROPMODW 0.9`; });
    const r1 = parseE2k(txt);
    const conMod = [...(r1.elementInputs.propertyModifiers ?? new Map()).keys()].length;
    filas.push({ que: "riochico: barras con mod", crudo: true, medido: conMod, limite: "> 0",
                 ok: tocadas === 1 && conMod > 0, detalle: "I2MOD/I3MOD de FRAMESECTION + PROPMOD* del LINEASSIGN" });
    const r2 = parseE2k(exportE2k({ ...r1, title: "riochico" }));
    let peorR = 0, dondeR = "", n = 0, sinPar = 0;
    const g2 = porGeometria(r2);
    const pares = [...porGeometria(r1)].map(([k, i]) => [i, g2.get(k)]);
    for (const c of campos) {
      for (const [i, j] of pares) {
        if (j === undefined) { sinPar++; continue; }
        const a = r1.elementInputs[c]?.get(i); if (!a) continue;
        const b = r2.elementInputs[c]?.get(j) ?? 0; n++;
        const e = relErr(b, a);
        if (e > peorR) { peorR = e; dondeR = `${c}[${i}] ${b} vs ${a}`; }
      }
    }
    filas.push({ que: "riochico ida y vuelta", medido: peorR * 100, limite: 1e-3, ok: n > 0 && peorR * 100 <= 1e-3,
                 detalle: `${n} valores (A, As, J, I, densidad); ${sinPar / campos.length} barras sin pareja; ${dondeR}` });
  }
  return filas;
}
