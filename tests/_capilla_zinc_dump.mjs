/**
 * Arma la CAPILLA + cubierta de ZINC (losa membrana), la resuelve en Hekatan, y
 * vuelca el dump para `csi_desde_dump.py` (compara solvers ETABS/SAP vs Hekatan,
 * misma malla y MISMAS cargas nodales).
 *
 * Carga = peso propio (acero + zinc) repartido a los nudos (mitad/mitad en
 * barras, cuarto en cada esquina del paño). Da igual el método de reparto: el
 * driver aplica ESTE MISMO vector nodal a CSI, así que compara SOLVERES.
 */
import { cargarFem } from "./lib/bundle.mjs";
import { carasCubierta } from "./_caras_roof.mjs";
import { readFileSync, writeFileSync } from "fs";

const F = process.env.FULL;      // capilla_full.json
const OUT = process.env.OUT;     // dump de salida
const G = 9.80665;
const D = JSON.parse(readFileSync(F, "utf8"));
const nodes = D.nodes.map((n) => [n[0], n[1], n[2]]);
const nn = nodes.length;

// ── PARTIR barras en nudos interiores (mesh-at-intersections, como ETABS) ──
// ETABS conecta las barras donde un nudo cae sobre ellas; sin esto el modelo
// importado queda desconectado y flojo (232 mm vs 9 mm). Reparte props y releases
// a los trozos, y el peso propio se recalcula por trozo mas abajo.
if (process.env.SPLIT) {
  const onSeg = (p, a, b) => { const ab = [b[0]-a[0], b[1]-a[1], b[2]-a[2]], ap = [p[0]-a[0], p[1]-a[1], p[2]-a[2]];
    const L2 = ab[0]**2+ab[1]**2+ab[2]**2; if (L2 < 1e-9) return -1;
    const t = (ap[0]*ab[0]+ap[1]*ab[1]+ap[2]*ab[2]) / L2; if (t < 1e-4 || t > 1-1e-4) return -1;
    const pr = [a[0]+ab[0]*t, a[1]+ab[1]*t, a[2]+ab[2]*t];
    return Math.hypot(p[0]-pr[0], p[1]-pr[1], p[2]-pr[2]) < 1e-3 ? t : -1; };
  const nE = [], nSec = [], nTip = [], nRel = [];
  D.elements.forEach((el, e) => {
    if (el.length !== 2) { nE.push(el); nSec.push(D.secciones?.[e]); nTip.push(D.tipos?.[e]); nRel.push(D.releases?.[e]); return; }
    const [i, j] = el, a = nodes[i], b = nodes[j], pts = [];
    for (let k = 0; k < nn; k++) { if (k === i || k === j) continue; const t = onSeg(nodes[k], a, b); if (t > 0) pts.push([t, k]); }
    if (!pts.length) { nE.push(el); nSec.push(D.secciones?.[e]); nTip.push(D.tipos?.[e]); nRel.push(D.releases?.[e]); return; }
    pts.sort((x, y) => x[0]-y[0]); let prev = i;
    const rel = D.releases?.[e];
    for (let s = 0; s < pts.length + 1; s++) {
      const nxt = s < pts.length ? pts[s][1] : j;
      nE.push([prev, nxt]); nSec.push(D.secciones?.[e]); nTip.push(D.tipos?.[e]);
      // release i solo en el primer trozo, release j solo en el ultimo
      const r = rel ? [ (s === 0 ? rel.slice(0,6) : [0,0,0,0,0,0]), (s === pts.length ? rel.slice(6,12) : [0,0,0,0,0,0]) ].flat() : undefined;
      nRel.push(r); prev = nxt;
    }
  });
  D.elements = nE; D.secciones = nSec; D.tipos = nTip; D.releases = nRel;
  console.error(`[split] ${nE.filter(e=>e.length===2).length} barras tras partir en intersecciones`);
}

// ── paños de zinc: lofting entre arcos (mismo método que el importador) ──
const panos = process.env.NOSHELL ? [] : carasCubierta(nodes, D.elements, D.tipos);

// ── elementos: 187 barras + N paños de zinc ──
const elements = D.elements.map((e) => e.slice());
const nFr = elements.length;
panos.forEach((q) => elements.push(q.slice()));

// ── elementInputs (Maps para deform; se serializan a dicts para el dump) ──
const areas = new Map(), moiY = new Map(), moiZ = new Map(), J = new Map();
const asY = new Map(), asZ = new Map(), E = new Map(), G_ = new Map(), nu = new Map(), rho = new Map();
const thick = new Map(), plate = new Map(), releases = new Map();
const dead = new Array(nn).fill(0);   // peso propio -> Fz por nudo
const REL = D.releases || [];         // articulaciones de extremo (ETABS)

for (let i = 0; i < nFr; i++) {
  const sp = D.secprops[D.secciones[i]];
  if (!sp || sp.err) { console.error("sin props:", D.secciones[i]); process.exit(1); }
  const Ev = sp.E, nuv = sp.nu ?? 0.3, rhov = sp.rho ?? 0;
  areas.set(i, sp.A); moiY.set(i, sp.I22); moiZ.set(i, sp.I33); J.set(i, sp.J);
  asZ.set(i, sp.As2); asY.set(i, sp.As3);      // As2 va con I33 (=momentsOfInertiaZ / SetGeneral As2)
  E.set(i, Ev); nu.set(i, nuv); G_.set(i, Ev / (2 * (1 + nuv))); rho.set(i, rhov);
  const [a, b] = elements[i];
  const L = Math.hypot(nodes[a][0]-nodes[b][0], nodes[a][1]-nodes[b][1], nodes[a][2]-nodes[b][2]);
  const w = rhov * sp.A * L * G;               // kN (rho t/m3 * m2 * m * g)
  dead[a] -= w / 2; dead[b] -= w / 2;
  if (REL[i] && REL[i].some(Boolean)) releases.set(i, REL[i].map(Boolean));
}
// CUBIERTA = LOSA de hormigón (cáscara) del e2k: f'c=210, 60 mm, CON flexión
// (Shell-Thin, plateFormulations=1). NO es membrana: por eso ETABS salía rígido.
const tZ = 0.060, Ez = 2.146e7, nuz = 0.2, rhoz = 2.4;
for (let k = 0; k < panos.length; k++) {
  const i = nFr + k;
  E.set(i, Ez); nu.set(i, nuz); G_.set(i, Ez / (2 * (1 + nuz))); rho.set(i, rhoz);
  thick.set(i, tZ); plate.set(i, +(process.env.FORM ?? 1));   // 1 Shell-Thin · 0 Shell-Thick
  const q = panos[k];
  // area del quad (dos triangulos)
  const [A0, B0, C0, Dd] = q.map((n) => nodes[n]);
  const tri = (p, r, s) => { const u = [r[0]-p[0], r[1]-p[1], r[2]-p[2]], v = [s[0]-p[0], s[1]-p[1], s[2]-p[2]];
    const cx = u[1]*v[2]-u[2]*v[1], cy = u[2]*v[0]-u[0]*v[2], cz = u[0]*v[1]-u[1]*v[0];
    return 0.5 * Math.hypot(cx, cy, cz); };
  const area = tri(A0, B0, C0) + tri(A0, C0, Dd);
  const w = rhoz * tZ * area * G;              // kN
  q.forEach((n) => dead[n] -= w / 4);
}

// ── supports & loads ──
const supports = new Map(); D.supports.forEach(([i, b]) => supports.set(i, b.map(Boolean)));
const loads = new Map();
for (let i = 0; i < nn; i++) if (Math.abs(dead[i]) > 1e-12) loads.set(i, [0, 0, dead[i], 0, 0, 0]);

const nodeInputs = { supports, loads };
const elementInputs = { areas, momentsOfInertiaY: moiY, momentsOfInertiaZ: moiZ,
  torsionalConstants: J, shearAreasY: asY, shearAreasZ: asZ, elasticities: E,
  shearModuli: G_, poissonsRatios: nu, densities: rho, thicknesses: thick, plateFormulations: plate,
  momentReleases: releases };

const fem = await cargarFem();
const dout = fem.deform(nodes, elements, nodeInputs, elementInputs);
const def = dout.deformations;   // Map<node,[6]>
let umax = 0, arg = -1;
for (const [n, u] of def) { const m = Math.max(Math.abs(u[0]), Math.abs(u[1]), Math.abs(u[2])); if (m > umax) { umax = m; arg = n; } }
let nan = 0; for (const [, u] of def) if (u.some((v) => !isFinite(v))) nan++;
console.log(`Hekatan: ${nn} nudos, ${nFr} barras, ${panos.length} paños zinc | u_max ${(umax*1000).toFixed(3)} mm (nudo ${arg}) | NaN ${nan}`);

// ── serializar dump ──
const mp = (m) => { const o = {}; for (const [k, v] of m) o[k] = v; return o; };
// Losa con flexión (Shell-Thin): SIN modificadores (no se anula la flexión). El
// driver la construye como Shell-Thin porque plateFormulations = 1.
const shellMods = {};
const defObj = {}; for (const [n, u] of def) defObj[n] = u;
const dump = {
  nodes, elements,
  elementInputs: { areas: mp(areas), momentsOfInertiaY: mp(moiY), momentsOfInertiaZ: mp(moiZ),
    torsionalConstants: mp(J), shearAreasY: mp(asY), shearAreasZ: mp(asZ), elasticities: mp(E),
    shearModuli: mp(G_), poissonsRatios: mp(nu), densities: mp(rho), thicknesses: mp(thick),
    plateFormulations: mp(plate), shellModifiers: shellMods, momentReleases: mp(releases) },
  nodeInputs: { supports: mp(supports), loads: mp(loads) },
  deformations: defObj,
};
writeFileSync(OUT, JSON.stringify(dump));
console.log("dump ->", OUT, "(", nFr, "barras +", panos.length, "paños )");
