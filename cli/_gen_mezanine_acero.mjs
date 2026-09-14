// MEZANINE DE ACERO: vigas I principales y secundarias con TODAS sus dimensiones, columnas tubulares
// (huecas o rellenas de hormigón) y deck. Todo editable por clave=valor.
//   node cli/_gen_mezanine_acero.mjs [tubo=hueco|cft] [salida=cli/shots/mezanine_acero/mezanine_hueco.heks] [dP=0.40 ...]
// Unidades kN, m. Propiedades del perfil I SIN radios de acuerdo (las mismas en Hekatan, SAP2000 y ETABS: van
// como sección General con A, I33, I22, J, As2, As3 escritos, no las recalcula ningún programa).
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
const P = {
  tubo: "hueco", nx: 3, ny: 2, Lx: 6, Ly: 5, h: 4.5,
  // viga principal I (m)
  dP: 0.40, bfP: 0.20, tfP: 0.012, twP: 0.008,
  // viga secundaria I (m) y cuántas por vano (corren por el lado corto de cada vano)
  dS: 0.25, bfS: 0.125, tfS: 0.008, twS: 0.006, nSec: 3,
  // columna tubular rectangular (m): bC ancho, hC canto (eje local 2), tfC paredes paralelas a bC,
  // twC paredes paralelas a hC (TF y TW de CSI); Ec y rhoC del relleno (kN/m2, t/m3)
  bC: 0.25, hC: 0.25, tfC: 0.010, twC: 0.010, Ec: 25e6, rhoC: 2.4,
  // deck (m): tc loseta, hr nervio, wrt/wrb anchos de nervio arriba/abajo, sr separación, w peso lámina (kN/m2)
  tc: 0.05, hr: 0.05, wrt: 0.18, wrb: 0.12, sr: 0.30, w: 0.10,
  salida: "",
};
for (const a of process.argv.slice(2)) { const [k, v] = a.split("="); if (k in P) P[k] = isNaN(+v) ? v : +v; }
if (!P.salida) P.salida = `cli/shots/mezanine_acero/mezanine_${P.tubo}.heks`;
const Es = 200e6, nuS = 0.3, rhoS = 7.85, Ecd = 25e6, rhoC = 2.4;

// ── propiedades de secciones ──
function perfilI(d, bf, tf, tw) {
  const hw = d - 2 * tf;
  const A = 2 * bf * tf + hw * tw;
  const I33 = (bf * d ** 3 - (bf - tw) * hw ** 3) / 12;          // eje fuerte (canto vertical)
  const I22 = (2 * tf * bf ** 3 + hw * tw ** 3) / 12;             // eje débil
  const J = (2 * bf * tf ** 3 + (d - tf) * tw ** 3) / 3;          // Saint-Venant, pared delgada
  return { A, I33, I22, J, As2: tw * d, As3: (5 / 3) * bf * tf, D: d, B: bf };
}
function tuboRect(b, h, tf, tw) {
  const bi = b - 2 * tw, hi = h - 2 * tf;
  const A = b * h - bi * hi;
  const I33 = (b * h ** 3 - bi * hi ** 3) / 12, I22 = (h * b ** 3 - hi * bi ** 3) / 12;
  const Am = (b - tw) * (h - tf);
  const J = 4 * Am * Am / (2 * (b - tw) / tf + 2 * (h - tf) / tw);    // Bredt con dos espesores
  return { A, I33, I22, J, As2: 2 * tw * h, As3: 2 * tf * b, D: h, B: b };
}
const SP = { ...perfilI(P.dP, P.bfP, P.tfP, P.twP), cmd: `isec %ID ${P.dP} ${P.bfP} ${P.tfP} ${P.twP}` };
const SS = { ...perfilI(P.dS, P.bfS, P.tfS, P.twS), cmd: `isec %ID ${P.dS} ${P.bfS} ${P.tfS} ${P.twS}` };
// columna: hueca → `tubo`; rellena → `cft` (que ya lleva b h tf tw) y sin `tubo`
const SC = { ...tuboRect(P.bC, P.hC, P.tfC, P.twC), cmd: P.tubo === "cft" ? "" : `tubo %ID ${P.bC} ${P.hC} ${P.tfC} ${P.twC}` };
const mm = (x) => Math.round(x * 1000);
const nomI = (d, bf, tf, tw) => `I${mm(d)}x${mm(bf)}x${mm(tf)}x${mm(tw)}`;
const NP = nomI(P.dP, P.bfP, P.tfP, P.twP), NS = nomI(P.dS, P.bfS, P.tfS, P.twS);
const NC = `${P.tubo === "cft" ? "CFT" : "HSS"}${mm(P.hC)}x${mm(P.bC)}x${mm(P.tfC)}${P.twC !== P.tfC ? `x${mm(P.twC)}` : ""}`;

const L = [`# Mezanine de acero ${P.nx}x${P.ny} vanos ${P.Lx}x${P.Ly} m, h ${P.h} m · principales ${NP} · secundarias ${NS} (${P.nSec}/vano, lado corto) · columnas ${NC}${P.tubo === "cft" ? " rellenas de hormigón" : " huecas"} · deck tc ${P.tc} hr ${P.hr}`,
  "selfweight 1"];
const ids = new Map(); let n = 0, f = 0, s = 0;
const nodo = (x, y, z) => { const k = `${x.toFixed(4)},${y.toFixed(4)},${z.toFixed(4)}`; if (!ids.has(k)) { ids.set(k, ++n); L.push(`node ${n} ${+x.toFixed(6)} ${+y.toFixed(6)} ${+z.toFixed(6)}`); } return ids.get(k); };
// (14-sep-2026, Jorge: «cotas modificables, nada de catálogo») Cada barra va con su sección PARAMÉTRICA:
// `isec ID d bf tf tw` o `tubo ID b h tf tw` — Hekatan calcula A, I, J y As como SAP2000 y el s2k/e2k
// las escriben como «I/Wide Flange»/«Box/Tube» y «Steel I/Wide Flange»/«Steel Tube» editables.
// Las propiedades de la línea `frame` quedan como respaldo; el comando de sección las pisa.
const barra = (a, b, S, nom, extra = []) => {
  f++; L.push(`frame ${f} ${a} ${b} ${Es} ${S.A.toPrecision(8)} ${S.I22.toPrecision(8)} ${S.I33.toPrecision(8)} ${S.J.toPrecision(8)} ${nuS} ${rhoS} ${S.D} ${S.B} # ${nom}`);
  if (S.cmd) L.push(S.cmd.replace("%ID", f));
  for (const e of extra) L.push(e.replace("%ID", f));
};
// ── columnas ──
for (let i = 0; i <= P.nx; i++) for (let j = 0; j <= P.ny; j++) {
  const b0 = nodo(i * P.Lx, j * P.Ly, 0); L.push(`support ${b0} 1 1 1 1 1 1`);
  barra(b0, nodo(i * P.Lx, j * P.Ly, P.h), SC, NC, P.tubo === "cft" ? [`cft %ID ${P.bC} ${P.hC} ${P.tfC} ${P.twC} ${P.Ec} 0.2 ${P.rhoC}`] : []);
}
// ── losa: por vano, las secundarias corren por el LADO CORTO (paralelas a él) y reparten el lado largo ──
const z = P.h;
const cortoX = P.Lx <= P.Ly;                 // si Lx es el corto, las secundarias van en X (separadas a lo largo de Y)
const nDiv = P.nSec + 1;
// nudos de la planta: en X cada Lx (o Lx/nDiv si las secundarias se separan en X), igual en Y
const xs = [], ys = [];
for (let i = 0; i <= P.nx * (cortoX ? 1 : nDiv); i++) xs.push(i * P.Lx / (cortoX ? 1 : nDiv));
for (let j = 0; j <= P.ny * (cortoX ? nDiv : 1); j++) ys.push(j * P.Ly / (cortoX ? nDiv : 1));
const eje = (v, L0) => Math.abs(v / L0 - Math.round(v / L0)) < 1e-9;
// vigas en X (a lo largo de X, en cada y de la malla)
for (const y of ys) for (let i = 0; i < xs.length - 1; i++) {
  const esPrincipal = eje(y, P.Ly);
  if (!esPrincipal && !cortoX) continue;
  barra(nodo(xs[i], y, z), nodo(xs[i + 1], y, z), esPrincipal ? SP : SS, esPrincipal ? NP : NS);
}
// vigas en Y
for (const x of xs) for (let j = 0; j < ys.length - 1; j++) {
  const esPrincipal = eje(x, P.Lx);
  if (!esPrincipal && cortoX) continue;
  barra(nodo(x, ys[j], z), nodo(x, ys[j + 1], z), esPrincipal ? SP : SS, esPrincipal ? NP : NS);
}
// deck: un paño por celda de la malla (entre vigas), membrana con la geometría del deck
for (let i = 0; i < xs.length - 1; i++) for (let j = 0; j < ys.length - 1; j++) {
  s++;
  L.push(`shell ${s} ${nodo(xs[i], ys[j], z)} ${nodo(xs[i + 1], ys[j], z)} ${nodo(xs[i + 1], ys[j + 1], z)} ${nodo(xs[i], ys[j + 1], z)} ${P.tc} ${Ecd} 0 ${rhoC}`);
  L.push(`decksec ${s} ${P.tc} ${P.hr} ${P.wrt} ${P.wrb} ${P.sr} ${P.w}`);
  L.push(`shellmod ${s} 1 0`);
}
L.push("solve");
mkdirSync(dirname(P.salida), { recursive: true });
writeFileSync(P.salida, L.join("\n") + "\n");
console.log(`${P.salida}: ${n} nudos, ${f} barras, ${s} paños de deck · ${NP} A ${SP.A.toExponential(4)} I33 ${SP.I33.toExponential(4)} · ${NS} · ${NC} A ${SC.A.toExponential(4)}`);
