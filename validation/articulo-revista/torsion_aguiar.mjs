/**
 * Torsión del dual 2×2×4 del artículo por CUATRO caminos, para dos disposiciones de muros (1-oct-2026):
 *   «articulo»  1 muro en x = 0, un vano (el del artículo rev9)
 *   «molinete»  4 muros de un vano, uno por fachada, en molinete (simétrico respecto al centro)
 *
 *   1. NEC-SE-DS: Δmax/Δprom ≤ 1.2 con ±5 % (calcularNEC, la capa NEC de Hekatan Struct)
 *   2. CM contra CR por piso (calcularNEC)
 *   3. modos: 1 y 2 traslacionales (RZ < 10 %), 3 rotacional (modal del modelo de cáscaras)
 *   4. Aguiar: matriz de rigidez en COORDENADAS DE PISO K_E (3 GDL por piso: u_x, u_y, θ en el CM).
 *      Con pórticos planos K_E = Σ Aᵀ K_L A; con losas y muros de CÁSCARA no hay planos que sumar, así que
 *      K_E sale por CONDENSACIÓN: se carga cada piso en su CM con Fx = 1, Fy = 1 y Mz = 1 (repartidos por la masa
 *      de cada nudo), se leen u_x, u_y y θ del piso (promedios pesados por masa) → flexibilidad F (3n×3n) → K_E = F⁻¹.
 *      Este script solo arma F y la masa de piso; el álgebra (K_E, modos de 3n GDL, acoplamiento) va en torsion_aguiar.py.
 *
 *   node validation/articulo-revista/torsion_aguiar.mjs  → torsion_aguiar.json
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { pathToFileURL, fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const AQUI = dirname(fileURLToPath(import.meta.url));
const HS = join(AQUI, "..", "..");
const TMP = join(process.env.TEMP || "/tmp", "hk_art_sismo");
mkdirSync(TMP, { recursive: true });

// buildEdificio de cli/sweep_case.mjs (el del artículo), con los muros elegibles por p.walls
const src = readFileSync(join(HS, "cli", "sweep_case.mjs"), "utf8").replace(/\r\n/g, "\n");
const a = src.indexOf("// ────────── buildEdificio"), b = src.indexOf("// ────────── caso ──────────");
writeFileSync(join(TMP, "_build_muros.mjs"),
  src.slice(a, b).replace("for (const w of dynWallDefaults(p))", "for (const w of (p.walls ?? dynWallDefaults(p)))") +
  "\nexport { buildEdificio, GRAV };\n");
const { buildEdificio, GRAV } = await import(pathToFileURL(join(TMP, "_build_muros.mjs")).href + "?v=" + Date.now());

const { empaquetar, R } = await import(pathToFileURL(join(HS, "tests", "lib", "bundle.mjs")).href);
const fem = await empaquetar(`export * from "${R}/hekatan-fem/src/index";\n`, "fem");
const nec = await empaquetar(`export * from "${R}/examples/src/shared/espectroNEC";\n`, "necSpec2");
const nec2 = await empaquetar(`export * from "${R}/examples/src/shared/nec/calculo";\nexport * from "${R}/examples/src/shared/nec/pisos";\n`, "necCalc2");
const { deform, jointMass } = fem;

const MUROS = {
  articulo: undefined,   // dynWallDefaults con nWalls = 1: muro en x = 0, y 0..5
  molinete: [
    { dir: 0, line: 0, start: 0, span: 1, off: 0, extra: 0 },   // x = 0,  y 0..5
    { dir: 0, line: 2, start: 1, span: 1, off: 0, extra: 0 },   // x = 10, y 5..10
    { dir: 1, line: 0, start: 1, span: 1, off: 0, extra: 0 },   // y = 0,  x 5..10
    { dir: 1, line: 2, start: 0, span: 1, off: 0, extra: 0 },   // y = 10, x 0..5
  ],
};

const sp = nec.necSpectrum({ Z: 0.40, soil: "E", region: "Costa", I: 1, R: 8, phiP: 1, phiE: 1 });
const sitio = { norma: "NEC-15", Z: 0.40, Fa: sp.Fa, Fd: sp.Fd, Fs: sp.Fs, eta: 1.8, r: 1.5, I: 1, R: 8, phiP: 1, phiE: 1, Ct: 0.055, alfa: 0.75 };
const OUT = {};
// solo pórticos (sin cáscaras): el modelo donde Hekatan = SAP2000 a 0.000 %, para juzgar el MÉTODO sin la membrana
const SOLO = process.argv[2];
const CASOS = SOLO === "portico" ? { portico: null, porticoAsim: null } : MUROS;

for (const [nom, walls] of Object.entries(CASOS)) {
  const p = { nbx: 2, nby: 2, nFloors: 4, ms: 1.0, nWalls: 1, tWall: 0.25, tSlab: 0.20, bCol: 0.40, bBeam: 0.30, hBeam: 0.50, q: 1.0, walls: walls ?? undefined };
  const d = buildEdificio(p, nom.startsWith("portico") ? { slab: false, walls: false } : { slab: true, walls: true });
  d.kinds.forEach((k, e) => {   // eje fuerte de la viga en I33 (como hekatan_cortante_derivas.mjs)
    if (k !== "beam") return;
    const y = d.ei.momentsOfInertiaY.get(e), z = d.ei.momentsOfInertiaZ.get(e);
    d.ei.momentsOfInertiaY.set(e, Math.min(y, z)); d.ei.momentsOfInertiaZ.set(e, Math.max(y, z));
  });
  const { nodes, elements, kinds, ni } = d;
  // pórtico ASIMÉTRICO: las columnas del eje x = 0 con 4 veces la inercia → K_yθ ≠ 0 (para juzgar el acoplamiento)
  const colX0 = new Set();
  if (nom === "porticoAsim") kinds.forEach((k, e) => { if (k === "col" && Math.abs(nodes[elements[e][0]][0]) < 1e-6) {
    colX0.add(e); d.ei.momentsOfInertiaY.set(e, d.ei.momentsOfInertiaY.get(e) * 4); d.ei.momentsOfInertiaZ.set(e, d.ei.momentsOfInertiaZ.get(e) * 4); } });
  const ei = { ...d.ei, plateFormulations: new Map(), drillingTypes: new Map() };
  const eiM = { ...ei, densities: new Map([...ei.densities].map(([k, v]) => [k, v / GRAV])) };
  const niM = { supports: ni.supports };

  // 1-3: capa NEC
  const r = nec2.calcularNEC(nodes, elements, niM, eiM, { sitio, irregular: false, nModos: 12, ecc: 0.05 });

  // 4: flexibilidad de piso por condensación
  const pisos = r.pisos, n = pisos.length;
  const mas = jointMass(nodes, elements, eiM, { incluyeElementos: 1 });
  const floor = pisos.map((pz) => {
    const cm = pz.cm, ns = pz.nudos;
    const m = ns.map((i) => mas[i][0]), M = m.reduce((s, v) => s + v, 0);
    const rel = ns.map((i) => [nodes[i][0] - cm[0], nodes[i][1] - cm[1]]);
    const J = ns.reduce((s, _, k) => s + m[k] * (rel[k][0] ** 2 + rel[k][1] ** 2), 0);
    return { ns, m, M, rel, J, cm };
  });
  const F = Array.from({ length: 3 * n }, () => new Array(3 * n).fill(0));
  const casosSap = [];
  for (let j = 0; j < n; j++) for (let g = 0; g < 3; g++) {
    const fl = floor[j], loads = new Map();
    fl.ns.forEach((i, k) => {
      const c = [0, 0, 0, 0, 0, 0], w = fl.m[k];
      if (g === 0) c[0] = w / fl.M; else if (g === 1) c[1] = w / fl.M;
      else { c[0] = -w * fl.rel[k][1] / fl.J; c[1] = w * fl.rel[k][0] / fl.J; }   // Mz = 1 como par repartido por masa
      loads.set(i, c);
    });
    casosSap.push([...loads].map(([i, c]) => [i, c[0], c[1]]));
    const U = deform(nodes, elements, { supports: ni.supports, loads }, ei).deformations;
    floor.forEach((fl2, i2) => {
      let ux = 0, uy = 0, th = 0;
      fl2.ns.forEach((i, k) => {
        const u = U.get(i) ?? [0, 0];
        ux += fl2.m[k] * u[0] / fl2.M; uy += fl2.m[k] * u[1] / fl2.M;
        th += fl2.m[k] * (fl2.rel[k][0] * u[1] - fl2.rel[k][1] * u[0]) / fl2.J;
      });
      F[3 * i2][3 * j + g] = ux; F[3 * i2 + 1][3 * j + g] = uy; F[3 * i2 + 2][3 * j + g] = th;
    });
  }
  // el mismo modelo y las mismas 3n cargas para SAP2000 (juez): sap_aguiar.py
  writeFileSync(join(AQUI, `sap_aguiar_${nom}.json`), JSON.stringify({
    nodes, elements, kinds, supports: [...ni.supports.keys()], colI4: [...colX0], E: 2534564, nu: 0.20, rho: 2.40277,
    bCol: p.bCol, bBeam: p.bBeam, hBeam: p.hBeam, tSlab: p.tSlab, tWall: p.tWall,
    casos: casosSap, pisos: floor.map((f) => ({ ns: f.ns, m: f.m, M: f.M, rel: f.rel, J: f.J })), F_hekatan: F }));
  const derMax = (ks) => Math.max(...ks.flatMap((k) => r.derivasEst[k].map((x) => x.inelastica)));
  OUT[nom] = {
    muros: walls ?? "dynWallDefaults nWalls=1", nudos: nodes.length, elementos: elements.length,
    paredes: kinds.filter((k) => k === "wall").length,
    modos: r.modos.slice(0, 6), chequeoModos: r.chequeoModos,
    torsional: r.torsional,
    relaciones: Object.fromEntries(Object.entries(r.derivasEst).map(([k, v]) => [k, v.map((x) => x.relacion)])),
    derivaMaxX: derMax(["Ex", "Ex+e", "Ex−e"]), derivaMaxY: derMax(["Ey", "Ey+e", "Ey−e"]),
    cm: pisos.map((pz) => pz.cm), cr: r.cr, z: pisos.map((pz) => pz.z),
    estatico: { V: r.estatico.V, W: r.estatico.W }, VdinX: r.dinamico.X.V, VdinY: r.dinamico.Y.V,
    escX: r.dinamico.escX, escY: r.dinamico.escY,
    aguiar: { F, masa: floor.map((fl) => fl.M), J: floor.map((fl) => fl.J) },
  };
  console.log(`\n== ${nom}: ${nodes.length} nudos, ${OUT[nom].paredes} cáscaras de muro`);
  console.log("T", r.modos.slice(0, 4).map((m) => m.T.toFixed(4)).join(" "), "|", r.chequeoModos.join(" | "));
  console.log(`Δmax/Δprom  X ${r.torsional.peorX.toFixed(3)}  Y ${r.torsional.peorY.toFixed(3)}  · deriva máx X ${(OUT[nom].derivaMaxX * 100).toFixed(3)} %  Y ${(OUT[nom].derivaMaxY * 100).toFixed(3)} %`);
  console.log("CM", pisos.map((pz) => pz.cm.map((v) => v.toFixed(2)).join(",")).join("  "), " CR", r.cr.map((c) => c.map((v) => v.toFixed(2)).join(",")).join("  "));
  console.log(`Vest ${r.estatico.V.toFixed(2)}  VdinX ${r.dinamico.X.V.toFixed(2)} (${(r.dinamico.escX.relacion * 100).toFixed(1)} %)  VdinY ${r.dinamico.Y.V.toFixed(2)} (${(r.dinamico.escY.relacion * 100).toFixed(1)} %)`);
}
writeFileSync(join(AQUI, SOLO === "portico" ? "torsion_aguiar_portico.json" : "torsion_aguiar.json"), JSON.stringify(OUT, null, 1));
