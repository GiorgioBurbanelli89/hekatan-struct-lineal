/**
 * CORTANTE BASAL DINAMICO del dual 2x2x4: metodo VIEJO (cortantes modales
 * ratio*W) contra metodo NUEVO (estilo SAP2000: por GDL -> reacciones -> CQC),
 * con SAP2000 de juez.
 *
 * Mismo modelo, misma malla (1.0 m, 545 nudos) y MISMO camino de construccion
 * que hekatan_cortante_derivas.mjs: no se reescribe nada, se llama al paquete.
 *
 *   node validation/articulo-revista/hekatan_espectral_sap.mjs
 *
 * Juez: validation/articulo-revista/sap_dual_sismo.json (SAP2000 24, 14-sep-2026).
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { pathToFileURL, fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const AQUI = dirname(fileURLToPath(import.meta.url));
const HS = join(AQUI, "..", "..");
const TMP = join(process.env.TEMP || "/tmp", "hk_art_sismo");
mkdirSync(TMP, { recursive: true });

// ── 1) buildEdificio, igual que hekatan_cortante_derivas.mjs ─────────────────
const src = readFileSync(join(HS, "cli", "sweep_case.mjs"), "utf8").replace(/\r\n/g, "\n");
const a = src.indexOf("// ────────── buildEdificio"), b = src.indexOf("// ────────── caso ──────────");
if (a < 0 || b < 0) throw new Error("no encuentro buildEdificio en sweep_case.mjs");
writeFileSync(join(TMP, "_build.mjs"), src.slice(a, b) + "\nexport { buildEdificio, GRAV };\n");
const { buildEdificio, GRAV } = await import(pathToFileURL(join(TMP, "_build.mjs")).href);

const { empaquetar, R } = await import(pathToFileURL(join(HS, "tests", "lib", "bundle.mjs")).href);
const fem = await empaquetar(`export * from "${R}/hekatan-fem/src/index";\n`, "fem");
const nec = await empaquetar(
  `export * from "${R}/examples/src/shared/espectroNEC";\nexport * from "${R}/examples/src/shared/responseSpectrum";\n`,
  "necSpec");
const { modalAnalysis } = fem;
const { necSpectrum, cortanteBasal, combineModal, baseShearSAP, modalBaseShearsSAP } = nec;

const p = { nbx: 2, nby: 2, nFloors: 4, ms: 1.0, nWalls: 1, tWall: 0.25, tSlab: 0.20,
            bCol: 0.40, bBeam: 0.30, hBeam: 0.50, q: 1.0 };
const d = buildEdificio(p, { slab: true, walls: true });
d.kinds.forEach((k, e) => {
  if (k !== "beam") return;
  const y = d.ei.momentsOfInertiaY.get(e), z = d.ei.momentsOfInertiaZ.get(e);
  d.ei.momentsOfInertiaY.set(e, Math.min(y, z)); d.ei.momentsOfInertiaZ.set(e, Math.max(y, z));
});
const { nodes, elements, ni } = d;
const ei = { ...d.ei, plateFormulations: new Map(), drillingTypes: new Map() };
const eiMasa = { ...ei, densities: new Map([...ei.densities].map(([k, v]) => [k, v / GRAV])) };

// ── 2) peso sismico W (copia literal de testM.ts pesoSismico) ────────────────
const RHO = 2.40277;
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

// ── 3) modal, 12 modos ───────────────────────────────────────────────────────
const mo = modalAnalysis(nodes, elements, { supports: ni.supports }, eiMasa, 12, 0);
const freqs = mo.frequencies ?? [], mpart = mo.massParticipation ?? [];
const Gam = mo.participationFactors ?? [], Mtot = mo.totalMass ?? [];
const T = freqs.map(f => (f > 0 ? 1 / f : 0));
console.log(`nudos ${nodes.length}  elementos ${elements.length}`);
console.log(`T1..T5  ${T.slice(0, 5).map(x => x.toFixed(4)).join(" ")}`);
if (!Gam.length) throw new Error("el WASM no devuelve participationFactors: falta recompilar");

// ── 4) NEC-15 ────────────────────────────────────────────────────────────────
const Z = 0.40, Rf = 8, I = 1.0, zeta = 0.05;
const sp = necSpectrum({ Z, soil: "E", region: "Costa", I, R: Rf, phiP: 1, phiE: 1 });
const { V: Vest } = cortanteBasal(sp, T[0], W, { I, R: Rf, phiP: 1, phiE: 1 });

// ── 5) VIEJO: Vi = I*Sad(Ti)*ratio_i*W, CQC ─────────────────────────────────
const Vmod = dir => freqs.map((f, i) => I * sp.Sad(f > 0 ? 1 / f : 0) * ((mpart[i]?.[dir]) ?? 0) * W);
const viejoX = combineModal(Vmod(0), T, "CQC", zeta);
const viejoY = combineModal(Vmod(1), T, "CQC", zeta);

// ── 6) NUEVO: por GDL -> reacciones -> CQC (SAP2000) ────────────────────────
const md = { frequencies: freqs, participationFactors: Gam };
const nuevoX = baseShearSAP(md, 0, sp.Sad, { zeta });
const nuevoY = baseShearSAP(md, 1, sp.Sad, { zeta });
// componentes CRUZADAS: reaccion Y de un sismo en X (el metodo viejo no puede darlas)
const cruzXY = combineModal(modalBaseShearsSAP(md, 0, sp.Sad, 1), T, "CQC", zeta);
const cruzYX = combineModal(modalBaseShearsSAP(md, 1, sp.Sad, 0), T, "CQC", zeta);

// ── 7) el juez ──────────────────────────────────────────────────────────────
const sap = JSON.parse(readFileSync(join(AQUI, "sap_dual_sismo.json"), "utf8"));
const pc = (h, s) => ((h / s - 1) * 100);

console.log(`\nW (Sigma rho*V)                 = ${W.toFixed(4)} tonf   (SAP ${sap.W_sap_tonf.toFixed(4)})`);
console.log(`M_total*g  X/Y/Z                = ${Mtot.slice(0,3).map(m => (m*GRAV).toFixed(4)).join("  ")} tonf`);
console.log(`peso que NO participa (apoyos)  = ${(W - Mtot[0]*GRAV).toFixed(4)} tonf  (${((1 - Mtot[0]*GRAV/W)*100).toFixed(3)} %)`);
console.log(`\nV estatico NEC = ${Vest.toFixed(4)} tonf`);
console.log("\nmodo    T(s)    Sad     ratioUx    Vviejo_X    Vnuevo_X");
freqs.forEach((f, i) => {
  const t = 1 / f;
  console.log(`${String(i + 1).padStart(4)} ${t.toFixed(4).padStart(8)} ${sp.Sad(t).toFixed(5).padStart(8)} ` +
    `${(mpart[i][0]).toFixed(6).padStart(10)} ${Vmod(0)[i].toFixed(4).padStart(11)} ` +
    `${modalBaseShearsSAP(md, 0, sp.Sad)[i].toFixed(4).padStart(11)}`);
});

const tab = [
  ["X", viejoX, nuevoX, sap.V_SPECX_tonf],
  ["Y", viejoY, nuevoY, sap.V_SPECY_tonf],
];
console.log("\ndir     VIEJO      dif%      NUEVO      dif%     SAP2000");
for (const [dir, v, n, s] of tab)
  console.log(`${dir.padStart(3)} ${v.toFixed(4).padStart(10)} ${pc(v, s).toFixed(3).padStart(8)} ` +
              `${n.toFixed(4).padStart(10)} ${pc(n, s).toFixed(3).padStart(8)} ${s.toFixed(4).padStart(11)}`);
console.log(`\ncomponentes cruzadas (el viejo no las tiene): Vy(SPECX) = ${cruzXY.toFixed(4)}   Vx(SPECY) = ${cruzYX.toFixed(4)} tonf`);

writeFileSync(join(AQUI, "hekatan_espectral_sap.json"), JSON.stringify({
  nudos: nodes.length, T, W, Mtot, MtotPeso: Mtot.map(m => m * GRAV), Vest,
  viejo: { X: viejoX, Y: viejoY }, nuevo: { X: nuevoX, Y: nuevoY },
  cruzadas: { VyDeSPECX: cruzXY, VxDeSPECY: cruzYX },
  sap: { X: sap.V_SPECX_tonf, Y: sap.V_SPECY_tonf, W: sap.W_sap_tonf },
  difPorCiento: { viejoX: pc(viejoX, sap.V_SPECX_tonf), viejoY: pc(viejoY, sap.V_SPECY_tonf),
                  nuevoX: pc(nuevoX, sap.V_SPECX_tonf), nuevoY: pc(nuevoY, sap.V_SPECY_tonf) },
  unidades: "tonf, m, s",
}, null, 1));
console.log("ok -> hekatan_espectral_sap.json");
