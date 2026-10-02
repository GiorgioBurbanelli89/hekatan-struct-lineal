/**
 * Lo que le FALTA al análisis sísmico del artículo (rev9, §4.3), con el MISMO modelo dual 2×2×4 (malla 1.0 m,
 * 545 nudos) y el MISMO camino que hekatan_cortante_derivas.mjs (que reproduce las Tablas 4 y 5).
 * Lista de chequeo = la memoria de un reforzamiento real (Colegio San Francisco, Sección I) + NEC-15-SE-DS:
 *   1. periodo: T ≤ 1.3·Ta (§6.3.3)            2. escalado del dinámico en Y (§6.2.2.b)
 *   3. derivas en Y                            4. excentricidad accidental ±5 % (§6.3.7)
 *   5. irregularidad torsional Δmax/Δprom      6. secciones agrietadas (§6.1.6: vigas 0.5, columnas 0.8, muros 0.6)
 *   7. índice de estabilidad P-Δ Qi ≤ 0.1 (§6.3.8)
 *   node validation/articulo-revista/hekatan_lo_que_falta.mjs  → hekatan_lo_que_falta.json
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const HS = join(AQUI, "..", "..");
const TMP = join(process.env.TEMP || "/tmp", "hk_art_sismo");
mkdirSync(TMP, { recursive: true });

// ── 1) buildEdificio: la copia fiel de testM.ts que usa cli/sweep_case.mjs ────
const src = readFileSync(join(HS, "cli", "sweep_case.mjs"), "utf8").replace(/\r\n/g, "\n");
const a = src.indexOf("// ────────── buildEdificio"), b = src.indexOf("// ────────── caso ──────────");
if (a < 0 || b < 0) throw new Error("no encuentro buildEdificio en sweep_case.mjs");
writeFileSync(join(TMP, "_build.mjs"), src.slice(a, b) + "\nexport { buildEdificio, GRAV };\n");
const { buildEdificio, GRAV } = await import(pathToFileURL(join(TMP, "_build.mjs")).href);

// ── 2) el paquete de verdad (motor + espectro NEC + CQC) ─────────────────────
const { empaquetar, R } = await import(pathToFileURL(join(HS, "tests", "lib", "bundle.mjs")).href);
const fem = await empaquetar(`export * from "${R}/hekatan-fem/src/index";\n`, "fem");
const nec = await empaquetar(
  `export * from "${R}/examples/src/shared/espectroNEC";\nexport * from "${R}/examples/src/shared/responseSpectrum";\n`,
  "necSpec");
const { deform, modalAnalysis } = fem;
const { necSpectrum, cortanteBasal, distribucionVertical } = nec;

// ── 3) el modelo del articulo (mismo que hekatan_variantes.mjs) ──────────────
const p = { nbx: 2, nby: 2, nFloors: 4, ms: 1.0, nWalls: 1, tWall: 0.25, tSlab: 0.20,
            bCol: 0.40, bBeam: 0.30, hBeam: 0.50, q: 1.0 };
const d = buildEdificio(p, { slab: true, walls: true });
// sweep_case es anterior al 8-ago: pone el eje FUERTE de la viga en momentsOfInertiaY.
// testM.ts (y el motor) hoy: momentsOfInertiaZ = I33 = fuerte.
d.kinds.forEach((k, e) => {
  if (k !== "beam") return;
  const y = d.ei.momentsOfInertiaY.get(e), z = d.ei.momentsOfInertiaZ.get(e);
  d.ei.momentsOfInertiaY.set(e, Math.min(y, z)); d.ei.momentsOfInertiaZ.set(e, Math.max(y, z));
});
const { nodes, elements, kinds, ni } = d;
// El articulo mide la variante «H DEFECTO DE HOY (sin-binario)» de
// hekatan_variantes.json: sin formulacion de placa ni drilling impuestos, el
// motor usa su DEFECTO. buildEdificio fuerza pf=2/dt=2 (variante A), asi que se
// vacian los dos mapas para quedarnos con el mismo modelo de la tabla de periodos.
const ei = { ...d.ei, plateFormulations: new Map(), drillingTypes: new Map() };
// densities del build son PESO (tonf/m3). Para el modal hace falta masa = peso/g.
const eiMasa = { ...ei, densities: new Map([...ei.densities].map(([k, v]) => [k, v / GRAV])) };
console.log(`nudos ${nodes.length}, elementos ${elements.length}`);

// ── 4) peso sismico W = Sigma rho*V  (copia literal de testM.ts pesoSismico) ──
const RHO = 2.40277;
function pesoSismico() {
  let W = 0;
  elements.forEach((e, i) => {
    const rho = ei.densities?.get(i) ?? RHO;
    if (e.length === 2) {
      const L = Math.hypot(...[0, 1, 2].map(k => nodes[e[1]][k] - nodes[e[0]][k]));
      W += rho * (ei.areas?.get(i) ?? 0) * L;
    } else {
      const q = e.map(n => nodes[n]);
      const A = Math.hypot(q[1][0] - q[0][0], q[1][1] - q[0][1], q[1][2] - q[0][2]);
      const B = Math.hypot(q[3][0] - q[0][0], q[3][1] - q[0][1], q[3][2] - q[0][2]);
      W += rho * (ei.thicknesses?.get(i) ?? 0) * A * B;
    }
  });
  return W;
}
const W = pesoSismico();

// la CAPA NEC del producto (calcularNEC: pisos con masa real, ±5 %, CR, CQC por piso, escalado), validada contra
// SAP2000/ETABS pieza por pieza; aquí sobre el modelo EXACTO del artículo.
const nec2 = await empaquetar(`export * from "${R}/examples/src/shared/nec/calculo";\n`, "necCalc");
const sp = necSpectrum({ Z: 0.40, soil: "E", region: "Costa", I: 1, R: 8, phiP: 1, phiE: 1 });
const sitio = { norma: "NEC-15", Z: 0.40, Fa: sp.Fa, Fd: sp.Fd, Fs: sp.Fs, eta: 1.8, r: 1.5, I: 1, R: 8, phiP: 1, phiE: 1, Ct: 0.055, alfa: 0.75 };
const niM = { supports: ni.supports };
const agr = { ...eiMasa, momentsOfInertiaY: new Map(ei.momentsOfInertiaY), momentsOfInertiaZ: new Map(ei.momentsOfInertiaZ), shellModifiers: new Map() };
kinds.forEach((k, e) => {   // NEC-SE-DS §6.1.6: vigas 0.5 Ig, columnas 0.8 Ig, muros 0.6 Ig
  const f = k === "beam" ? 0.5 : k === "col" ? 0.8 : 0;
  if (f) { agr.momentsOfInertiaY.set(e, ei.momentsOfInertiaY.get(e) * f); agr.momentsOfInertiaZ.set(e, ei.momentsOfInertiaZ.get(e) * f); }
  if (k === "wall") agr.shellModifiers.set(e, [0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 1, 1]);
});
const OUT = { nudos: nodes.length, W, sitio };
// «irregular»: Δmax/Δprom > 1.2 en Y → irregularidad torsional tipo 1 (NEC-SE-DS tabla 13): φP = 0.9 y dinámico ≥ 85 %
// BORRADOR NEC-SE-DS 2023 (2-oct-2026): zona IV suelo E (Fa 0.9, Fd 1.52, Fs 1.94), r 1.2, dual R 7, Cd 5.5 (Tabla 4.4),
// Ct 0.0488 · α 0.75 (Tabla 6.2), deriva Δ = Cd·δe/Ie ≤ 0.015 (ec. 6.8, Tabla 4.3, categoría I-II, paredes rígidas)
const borr = { norma: "borrador", Z: 0.40, Fa: 0.9, Fd: 1.52, Fs: 1.94, r: 1.2, I: 1, R: 7, Cd: 5.5, limDeriva: 0.015, Ct: 0.0488, alfa: 0.75 };
for (const [nom, eiX, st, irr] of [["bruta", eiMasa, sitio, false], ["agrietada", agr, sitio, false], ["agrietada irregular", agr, { ...sitio, phiP: 0.9 }, true], ["borrador agrietada", agr, borr, null]]) {
  const r = nec2.calcularNEC(nodes, elements, niM, eiX, { sitio: st, irregular: irr, nModos: 12, ecc: 0.05, dual: true });
  const hn = Math.max(...nodes.map(n => n[2])), Ta = 0.055 * hn ** 0.75;
  // índice de estabilidad NEC §6.3.8: Qi = Pi·Δi/(Vi·hi), Δ = deriva elástica en el CM (Ex / Ey sin excentricidad)
  const Q = d => r.estatico.pisos.map((p, k) => {
    const Pi = r.estatico.pisos.slice(k).reduce((s, q) => s + q.w, 0);
    return Pi * r.derivasEst[d][k].prom / p.Vpiso;
  });
  OUT[nom] = { modos: r.modos.slice(0, 4), chequeoModos: r.chequeoModos, Ta, Tmax: 1.3 * Ta, estatico: { V: r.estatico.V, W: r.estatico.W, T: r.estatico.T },
    VdinX: r.dinamico.X.V, VdinY: r.dinamico.Y.V, escX: r.dinamico.escX, escY: r.dinamico.escY, torsional: r.torsional,
    derivas: Object.fromEntries(Object.entries(r.derivasEst).map(([k, v]) => [k, v.map(d => ({ piso: d.k, max: d.max, inel: d.inelastica, rel: d.relacion }))])),
    derivasDin: { X: r.dinamico.X.pisos.map(p => p.derivaInel), Y: r.dinamico.Y.pisos.map(p => p.derivaInel) },
    QX: Q("Ex"), QY: Q("Ey"), limite: r.limiteDeriva, Ax: r.irregularidades.Ax, phiP: r.irregularidades.phiP,
    dinMax: { X: Math.max(...r.dirDerivas.X), Y: Math.max(...r.dirDerivas.Y) } };
  const o = OUT[nom], pc = x => (x * 100).toFixed(3);
  console.log(`\n== ${nom}: T ${o.modos.map(m => m.T.toFixed(4)).join(" ")}  Ta ${Ta.toFixed(3)} 1.3Ta ${(1.3 * Ta).toFixed(3)}`);
  console.log(`W ${o.estatico.W.toFixed(2)} Vest ${o.estatico.V.toFixed(2)}  VdinX ${o.VdinX.toFixed(2)} (${pc(o.escX.relacion)} %, f ${o.escX.factor.toFixed(3)})  VdinY ${o.VdinY.toFixed(2)} (${pc(o.escY.relacion)} %, f ${o.escY.factor.toFixed(3)})`);
  console.log(o.chequeoModos.join(" | "), " torsión X", o.torsional.peorX.toFixed(3), "Y", o.torsional.peorY.toFixed(3));
  for (const [k, v] of Object.entries(o.derivas)) console.log(k.padEnd(5), v.map(d => `${d.piso}:${pc(d.inel)}% r${d.rel.toFixed(2)}`).join("  "));
  console.log("din X", o.derivasDin.X.map(pc).join(" "), " din Y", o.derivasDin.Y.map(pc).join(" "));
  console.log("Q X", o.QX.map(x => x.toFixed(4)).join(" "), " Q Y", o.QY.map(x => x.toFixed(4)).join(" "));
}
writeFileSync(join(AQUI, "hekatan_lo_que_falta.json"), JSON.stringify(OUT, null, 1));
