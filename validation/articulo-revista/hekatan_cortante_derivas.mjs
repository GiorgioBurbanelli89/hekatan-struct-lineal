/**
 * Cortante basal (estatico NEC + dinamico espectral CQC) y DERIVAS DE PISO del
 * dual 2x2x4 del articulo, con la MISMA malla (1.0 m, 545 nudos) que el contraste
 * modal contra SAP2000.
 *
 * Es el MISMO camino de la app (examples/src/test-m/testM.ts, bloque "DERIVAS Y
 * CORTANTE POR PISO"): no se reescribe la formula, se llaman las mismas funciones
 * del paquete (necSpectrum, cortanteBasal, distribucionVertical, combineModal,
 * deform, modalAnalysis).
 *
 *   node validation/articulo-revista/hekatan_cortante_derivas.mjs
 *
 * Salidas:
 *   hekatan_cortante_derivas.json   numeros de Hekatan
 *   dual_2x2x4_sismo.json           el modelo + las fuerzas LX, para SAP2000
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
const { necSpectrum, cortanteBasal, distribucionVertical, baseShearDynamic, baseShearRatioW } = nec;

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

// ── 5) modal (12 modos, masa completa, lateral=0: lo mismo del contraste SAP) ─
const mo = modalAnalysis(nodes, elements, { supports: ni.supports }, eiMasa, 12, 0);
const freqs = mo.frequencies ?? [], mpart = mo.massParticipation ?? [];
const T = freqs.map(f => (f > 0 ? 1 / f : 0));
console.log(`T1..T5  ${T.slice(0, 5).map(x => x.toFixed(4)).join(" ")}`);

// ── 6) NEC-15 ────────────────────────────────────────────────────────────────
const Z = 0.40, Rf = 8, I = 1.0, zeta = 0.05;
const sp = necSpectrum({ Z, soil: "E", region: "Costa", I, R: Rf, phiP: 1, phiE: 1 });
const T1 = T[0];
const { Cs, V: Vest, SaTa } = cortanteBasal(sp, T1, W, { I, R: Rf, phiP: 1, phiE: 1 });
console.log(`W=${W.toFixed(2)} tonf  Sa(T1)=${SaTa.toFixed(4)}g  Cs=${Cs.toFixed(5)}  V=${Vest.toFixed(3)} tonf`);

// dinamico DEFECTO (17-sep-2026): metodo SAP2000, Vi = Gamma_i,x*Gamma_i,k*Sad(Ti)*g
// con el Gamma CON SIGNO del solver, combinado CQC. El viejo (Vi=I*Sad*ratio_i*W)
// queda al lado SOLO para comparar: sobra ~1.9 % porque W=Sigma rho*V incluye la
// masa pegada a los apoyos, que no vibra.
const mdDyn = { frequencies: freqs, participationFactors: mo.participationFactors, massParticipation: mpart };
const optDyn = { W, I, zeta, modal: "CQC" };
const rX = baseShearDynamic(mdDyn, 0, sp.Sad, optDyn);
const rY = baseShearDynamic(mdDyn, 1, sp.Sad, optDyn);
const VdinX = rX.V, VdinY = rY.V;
const VviejoX = baseShearRatioW(mdDyn, 0, sp.Sad, W, { zeta, I });
const VviejoY = baseShearRatioW(mdDyn, 1, sp.Sad, W, { zeta, I });
console.log(`V dinamico CQC [${rX.metodo}]  X=${VdinX.toFixed(4)}  Y=${VdinY.toFixed(4)} tonf  (Vx/Vest=${(VdinX / Vest * 100).toFixed(1)} %)`);
console.log(`V dinamico CQC [viejo ratioW]  X=${VviejoX.toFixed(4)}  Y=${VviejoY.toFixed(4)} tonf  (solo comparacion)`);

// ── 7) derivas: V estatico repartido en altura -> deform -> dM = 0.75*R*de ────
const zl = [...new Set(
  elements.filter(e => e.length === 2 && Math.abs(nodes[e[0]][2] - nodes[e[1]][2]) < 1e-6 && nodes[e[0]][2] > 0.05)
          .map(e => +nodes[e[0]][2].toFixed(2)))].sort((x, y) => x - y);
const idsAt = z => nodes.map((n, i) => [n[2], i]).filter(o => Math.abs(o[0] - z) < 0.02).map(o => o[1]);
const Fx = distribucionVertical(Vest, zl.map(() => W / zl.length), zl, T1);
console.log(`pisos z = ${zl.join(", ")}   Fx = ${Fx.map(x => x.toFixed(3)).join(", ")} tonf`);

const cargasLX = [];   // [nudo, Fx] para volcar a SAP2000
const loads = new Map();
zl.forEach((z, k) => {
  const ids = idsAt(z), f = Fx[k] / Math.max(ids.length, 1);
  ids.forEach(i => {
    const c = loads.get(i) ?? [0, 0, 0, 0, 0, 0]; c[0] += f; loads.set(i, c);
    cargasLX.push([i, f]);
  });
});
const dd = deform(nodes, elements, { supports: ni.supports, loads }, ei);
const U = dd.deformations;
const ux = i => ((U.get ? U.get(i) : U[i]) || [0])[0];
const uxL = zl.map(z => { const ids = idsAt(z); return ids.reduce((s, i) => s + ux(i), 0) / Math.max(ids.length, 1); });

const AMP = 0.75 * Rf;   // NEC-SE-DS 6.3.9
const pisos = [];
for (let k = 0; k < zl.length; k++) {
  const z = zl[k], zPrev = k > 0 ? zl[k - 1] : 0, dPrev = k > 0 ? uxL[k - 1] : 0;
  const de = uxL[k] - dPrev, h = z - zPrev;
  pisos.push({ piso: k + 1, z, h, Fx: Fx[k],
               Vx: Fx.slice(k).reduce((s, v) => s + v, 0),
               ux: uxL[k], driftE: de / h, driftM: AMP * de / h });
}
console.log("piso   z    Fx      ux(mm)   derivaE%  derivaM%");
for (let k = pisos.length - 1; k >= 0; k--) {
  const r = pisos[k];
  console.log(`${String(r.piso).padStart(3)} ${r.z.toFixed(2).padStart(6)} ${r.Fx.toFixed(3).padStart(7)} ${(r.ux * 1000).toFixed(4).padStart(9)} ${(r.driftE * 100).toFixed(4).padStart(9)} ${(r.driftM * 100).toFixed(4).padStart(9)}`);
}

// ── 8) salidas ───────────────────────────────────────────────────────────────
const OUT = {
  modelo: p, nudos: nodes.length, elementos: elements.length,
  nec: { Z, suelo: "E", region: "Costa", eta: sp.eta, Fa: sp.Fa, Fd: sp.Fd, Fs: sp.Fs,
         T0: sp.T0, Tc: sp.Tc, R: Rf, I, zeta, SaMeseta: sp.eta * Z * sp.Fa },
  T, W, T1, SaTa, Cs, Vestatico: Vest, VdinamicoX: VdinX, VdinamicoY: VdinY,
 metodoDinamico: rX.metodo,
 viejoRatioW: { X: VviejoX, Y: VviejoY },
  ratioDinEst: VdinX / Vest,
  pisosZ: zl, Fx, pisos,
  unidades: "tonf, m",
};
writeFileSync(join(AQUI, "hekatan_cortante_derivas.json"), JSON.stringify(OUT, null, 1));

const sup = [...ni.supports.keys()];
writeFileSync(join(AQUI, "dual_2x2x4_sismo.json"), JSON.stringify({
  nodes, elements, kinds, supports: sup,
  E: 2534564, nu: 0.20, rho: 2.40277,
  bCol: p.bCol, bBeam: p.bBeam, hBeam: p.hBeam, tSlab: p.tSlab, tWall: p.tWall,
  // sismo NEC: el espectro ELASTICO Sa(T) tabulado y las fuerzas LX de la FLE
  nec: OUT.nec, W, Cs, Vestatico: Vest, T1,
  espectro: Array.from({ length: 301 }, (_, i) => [i * 0.01, sp.Sa(i * 0.01)]),
  pisosZ: zl, Fx, cargasLX,   // [idxNudo, Fx tonf]
}));
console.log("ok -> hekatan_cortante_derivas.json, dual_2x2x4_sismo.json");
