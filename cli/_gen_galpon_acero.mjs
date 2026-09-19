// GALPONES DE ACERO con secciones PARAMÉTRICAS (cotas editables, nada de catálogo) y cubierta de zinc MEMBRANA.
//   node cli/_gen_galpon_acero.mjs tipo=curvo|agua1|mezanine [salida=...] [clave=valor ...]
// Jorge, 14-sep-2026: «galpón curvo, galpón a 1 agua y mi galpón con mezanine; columnas CFT, vigas I modificables,
// cordones superior e inferior en canal C, diagonales 2L (UNA sola sección para las diagonales), cubierta de zinc
// slab membrana».
// Unidades kN, m, t/m3. Cada barra lleva su comando de sección (`cft`, `isec`, `canal`, `dosl`): Hekatan calcula A, I,
// J, As como SAP2000 y el s2k/e2k las escriben como secciones editables. La línea `frame` es solo respaldo.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const P = {
  tipo: "curvo",
  // planta genérica (curvo y agua1): luz transversal L (Y), pórticos cada sep a lo largo de X
  L: 20, nPort: 6, sep: 6, hAlero: 6,
  flecha: 2.5,          // curvo: flecha del arco del cordón superior
  pend: 0.10,           // agua1: pendiente (sube de y = 0 a y = L)
  canto: 1.0,           // canto de la cercha
  nPan: 10,             // paneles de la cercha transversal (par)
  nLong: 2,             // paneles por vano de la cercha longitudinal (par)
  // columna CFT (m): b h tf tw, Ec rhoC del relleno
  bC: 0.25, hC: 0.25, tfC: 0.008, twC: 0.008, Ec: 25e6, rhoC: 2.4,
  // viga I (amarre de alero y correas) y viga del mezanine
  dI: 0.20, bfI: 0.10, tfI: 0.008, twI: 0.005,
  // cordones canal C: d bf tf tw
  dCh: 0.200, bfCh: 0.075, tfCh: 0.0085, twCh: 0.0056,   // (claves propias: tfC/twC son de la columna)
  // diagonales y montantes 2L: ala vertical, ala horizontal, tf, tw, separación
  dL: 0.050, bL: 0.050, tfL: 0.005, twL: 0.005, sepL: 0.010,
  // zinc: espesor, E, densidad (la de galpon_lc, que incluye traslapes y fijaciones)
  tZ: 0.0008, EZ: 2e8, rhoZ: 7.95379,
  // mezanine (tipo=mezanine): ejes del galpón de la bodega electoral (galpon_geom.py)
  zMez: 4.0, dP: 0.35, bfP: 0.17, tfP: 0.010, twP: 0.006, nSecMez: 3,
  tc: 0.05, hr: 0.05, wrt: 0.18, wrb: 0.12, sr: 0.30, w: 0.10,
  salida: "",
};
for (const a of process.argv.slice(2)) { const [k, v] = a.split("="); if (k in P) P[k] = isNaN(+v) ? v : +v; }
if (!P.salida) P.salida = `cli/shots/galpones/galpon_${P.tipo}.heks`;
const Es = 200e6, nuS = 0.3, rhoS = 7.85;

// ── propiedades de respaldo (el comando de sección las pisa) ──
const rectI = (d, bf, tf, tw) => { const hw = d - 2 * tf; return { A: 2 * bf * tf + hw * tw, I33: (bf * d ** 3 - (bf - tw) * hw ** 3) / 12, I22: (2 * tf * bf ** 3 + hw * tw ** 3) / 12, J: (2 * bf * tf ** 3 + hw * tw ** 3) / 3, D: d, B: bf }; };
const tuboR = (b, h, tf, tw) => { const bi = b - 2 * tw, hi = h - 2 * tf; const Am = (b - tw) * (h - tf); return { A: b * h - bi * hi, I33: (b * h ** 3 - bi * hi ** 3) / 12, I22: (h * b ** 3 - hi * bi ** 3) / 12, J: 4 * Am * Am / (2 * (b - tw) / tf + 2 * (h - tf) / tw), D: h, B: b }; };
const canalR = (d, bf, tf, tw) => { const hw = d - 2 * tf; const A = 2 * bf * tf + hw * tw; const xc = (2 * bf * tf * bf / 2 + hw * tw * tw / 2) / A; return { A, I33: (bf * d ** 3 - (bf - tw) * hw ** 3) / 12, I22: 2 * (tf * bf ** 3 / 12 + bf * tf * (bf / 2 - xc) ** 2) + hw * tw ** 3 / 12 + hw * tw * (tw / 2 - xc) ** 2, J: (2 * bf * tf ** 3 + hw * tw ** 3) / 3, D: d, B: bf }; };
const dosLR = (d, b, tf, tw, s) => { const a1 = b * tf, a2 = (d - tf) * tw, A1 = a1 + a2; const yc = (a1 * tf / 2 + a2 * (tf + (d - tf) / 2)) / A1; const xc = (a1 * b / 2 + a2 * tw / 2) / A1; const I33 = 2 * (b * tf ** 3 / 12 + a1 * (tf / 2 - yc) ** 2 + tw * (d - tf) ** 3 / 12 + a2 * (tf + (d - tf) / 2 - yc) ** 2); const Iy1 = tf * b ** 3 / 12 + a1 * (b / 2 - xc) ** 2 + (d - tf) * tw ** 3 / 12 + a2 * (tw / 2 - xc) ** 2; return { A: 2 * A1, I33, I22: 2 * (Iy1 + A1 * (s / 2 + xc) ** 2), J: 2 * (b * tf ** 3 + (d - tf) * tw ** 3) / 3, D: d, B: 2 * b + s }; };

const mm = (x) => Math.round(x * 1000);
const SEC = {
  col: { ...tuboR(P.bC, P.hC, P.tfC, P.twC), nom: `CFT${mm(P.hC)}x${mm(P.bC)}x${mm(P.tfC)}`, cmd: `cft %ID ${P.bC} ${P.hC} ${P.tfC} ${P.twC} ${P.Ec} 0.2 ${P.rhoC}` },
  vI: { ...rectI(P.dI, P.bfI, P.tfI, P.twI), nom: `I${mm(P.dI)}x${mm(P.bfI)}x${mm(P.tfI)}x${mm(P.twI)}`, cmd: `isec %ID ${P.dI} ${P.bfI} ${P.tfI} ${P.twI}` },
  vP: { ...rectI(P.dP, P.bfP, P.tfP, P.twP), nom: `I${mm(P.dP)}x${mm(P.bfP)}x${mm(P.tfP)}x${mm(P.twP)}`, cmd: `isec %ID ${P.dP} ${P.bfP} ${P.tfP} ${P.twP}` },
  cord: { ...canalR(P.dCh, P.bfCh, P.tfCh, P.twCh), nom: `C${mm(P.dCh)}x${mm(P.bfCh)}x${mm(P.tfCh)}x${mm(P.twCh)}`, cmd: `canal %ID ${P.dCh} ${P.bfCh} ${P.tfCh} ${P.twCh}` },
  // `dosl ID d t2 tf tw dis`: t2 = ancho TOTAL del 2L (dos alas + separación), como el t2 de SAP2000 «Double Angle»
  diag: { ...dosLR(P.dL, P.bL, P.tfL, P.twL, P.sepL), nom: `2L${mm(P.dL)}x${mm(P.bL)}x${mm(P.tfL)}s${mm(P.sepL)}`, cmd: `dosl %ID ${P.dL} ${+(2 * P.bL + P.sepL).toFixed(6)} ${P.tfL} ${P.twL} ${P.sepL}` },
};

const Lh = []; const ids = new Map(); let n = 0, f = 0, s = 0;
const nodo = (x, y, z) => { const k = `${x.toFixed(4)},${y.toFixed(4)},${z.toFixed(4)}`; if (!ids.has(k)) { ids.set(k, ++n); Lh.push(`node ${n} ${+x.toFixed(6)} ${+y.toFixed(6)} ${+z.toFixed(6)}`); } return ids.get(k); };
const barra = (a, b, S) => {
  if (a === b) return;
  f++; Lh.push(`frame ${f} ${a} ${b} ${Es} ${S.A.toPrecision(8)} ${S.I22.toPrecision(8)} ${S.I33.toPrecision(8)} ${S.J.toPrecision(8)} ${nuS} ${rhoS} ${S.D} ${S.B} # ${S.nom}`);
  Lh.push(S.cmd.replace("%ID", f));
};
// Zinc = MEMBRANA PURA: `shellmod ID 1 0` (sale `Type=Membrane` al s2k y `MODELINGTYPE "Membrane"` al e2k).
// ⚠️ Con los 8 modificadores `1 1 1 0 0 0 1 1` el s2k escribía Shell-Thick con m=0 y v13=v23=1, y SAP2000 no lo trata
// como membrana: el galpón curvo daba 9.12 mm en SAP contra 7.15 en Hekatan y ETABS (14-sep-2026).
const zinc = (a, b, c, d) => { s++; Lh.push(`shell ${s} ${a} ${b} ${c} ${d} ${P.tZ} ${P.EZ} 0 ${P.rhoZ}`); Lh.push(`shellmod ${s} 1 0`); };

// ── la cercha: cordón superior zSup(y) y canto; cordón inferior = zSup − canto ──
let xs, L, zSup, hApoyo, titulo;
if (P.tipo === "mezanine") {
  // galpón de la bodega electoral: 26.63 × 14.74, alero 8.00, un agua 7.5 %, canto 1.20.
  // galpon_geom.py: ALTO_EN = "y0" → el lado ALTO es y = 0 y baja hacia y = D (antes subía al revés).
  xs = [0.000, 5.025, 10.050, 15.075, 20.100, 26.630];
  L = 14.74; P.hAlero = 8.0; P.canto = 1.2; P.nPan = 12;
  zSup = (y) => P.hAlero + P.canto + 0.075 * (L - y);
  titulo = `Galpón con mezanine (bodega electoral) 26.63×14.74, alero 8 m, un agua 7.5 %, mezanine a ${P.zMez} m`;
} else {
  xs = Array.from({ length: P.nPort }, (_, i) => i * P.sep);
  L = P.L;
  zSup = P.tipo === "curvo"
    ? (y) => P.hAlero + P.canto + P.flecha * (1 - (2 * y / L - 1) ** 2)
    : (y) => P.hAlero + P.canto + P.pend * y;
  titulo = P.tipo === "curvo"
    ? `Galpón curvo luz ${L} m, ${P.nPort} pórticos cada ${P.sep} m, alero ${P.hAlero} m, flecha ${P.flecha} m`
    : `Galpón a un agua luz ${L} m, ${P.nPort} pórticos cada ${P.sep} m, alero ${P.hAlero} m, pendiente ${P.pend * 100} %`;
}
Lh.push(`# ${titulo} · columnas ${SEC.col.nom} · vigas ${SEC.vI.nom} · cordones ${SEC.cord.nom} · diagonales ${SEC.diag.nom} · cubierta zinc ${P.tZ * 1000} mm membrana`);
Lh.push("selfweight 1");
// Misma geometría en los tres programas: nadie parte barras por su cuenta (SAP2000 no lo hace; ETABS sí por defecto
// en los niveles y en los cruces). El e2k sale con AUTOMESH/MESHATINTERSECTIONS "NO".
Lh.push("meshcross 0");
const ysP = Array.from({ length: P.nPan + 1 }, (_, k) => k * L / P.nPan);

for (const x of xs) {
  const sup = ysP.map((y) => nodo(x, y, zSup(y)));
  const inf = ysP.map((y) => nodo(x, y, zSup(y) - P.canto));
  // columnas a los dos lados: de la base al cordón inferior y del inferior al superior (la cercha se apoya entre los dos)
  for (const k of [0, P.nPan]) {
    const b0 = nodo(x, ysP[k], 0); Lh.push(`support ${b0} 1 1 1 1 1 1`);
    barra(b0, inf[k], SEC.col); barra(inf[k], sup[k], SEC.col);
  }
  for (let k = 0; k < P.nPan; k++) {
    barra(sup[k], sup[k + 1], SEC.cord);
    barra(inf[k], inf[k + 1], SEC.cord);
    // Pratt simétrica: diagonales hacia el centro
    if (k < P.nPan / 2) barra(inf[k], sup[k + 1], SEC.diag); else barra(sup[k], inf[k + 1], SEC.diag);
  }
  for (let k = 1; k < P.nPan; k++) barra(inf[k], sup[k], SEC.diag);      // montantes (misma 2L)
}
// ── SENTIDO LARGO (Jorge, 14-sep-2026: «genera la cercha en ambos sentidos, en el largo está vacía») ──
// Cerchas longitudinales en los dos ejes de columnas (k = 0, nPan) y en el centro de la luz (k = nPan/2): cordón superior
// e inferior canal C, montantes y diagonales la misma 2L, cada vano partido en nLong paneles. En las demás líneas del
// cordón superior van correas I. El zinc se malla con los mismos paneles (nudos compartidos con correas y cordones).
const xsF = [];
for (let i = 0; i < xs.length - 1; i++) for (let q = 0; q < P.nLong; q++) xsF.push(xs[i] + q * (xs[i + 1] - xs[i]) / P.nLong);
xsF.push(xs[xs.length - 1]);
const lineasCercha = new Set([0, P.nPan / 2, P.nPan]);
const esPortico = (x) => xs.some((u) => Math.abs(u - x) < 1e-9);
for (let k = 0; k <= P.nPan; k++) {
  const y = ysP[k], zs = zSup(y), zi = zs - P.canto;
  const cercha = lineasCercha.has(k);
  for (let q = 0; q < xsF.length - 1; q++) {
    const a = xsF[q], b = xsF[q + 1];
    barra(nodo(a, y, zs), nodo(b, y, zs), cercha ? SEC.cord : SEC.vI);          // cordón superior / correa
    if (!cercha) continue;
    barra(nodo(a, y, zi), nodo(b, y, zi), SEC.cord);                            // cordón inferior
    // diagonal hacia el centro de cada vano entre pórticos
    const qv = q % P.nLong;
    if (qv < P.nLong / 2) barra(nodo(a, y, zi), nodo(b, y, zs), SEC.diag); else barra(nodo(a, y, zs), nodo(b, y, zi), SEC.diag);
  }
  if (cercha) for (const x of xsF) if (!esPortico(x)) barra(nodo(x, y, zi), nodo(x, y, zs), SEC.diag);   // montantes entre pórticos
}
for (let q = 0; q < xsF.length - 1; q++)
  for (let k = 0; k < P.nPan; k++)
    zinc(nodo(xsF[q], ysP[k], zSup(ysP[k])), nodo(xsF[q + 1], ysP[k], zSup(ysP[k])),
         nodo(xsF[q + 1], ysP[k + 1], zSup(ysP[k + 1])), nodo(xsF[q], ysP[k + 1], zSup(ysP[k + 1])));

if (P.tipo === "mezanine") {
  // mezanine en toda la planta a zMez: columnas interiores en los ejes B y C (y = 3.20, 12.42) de la base al mezanine;
  // las exteriores (A y D) ya existen y se parten en zMez. Vigas principales I en X y en Y por los ejes; secundarias
  // I cada vano por el lado corto; deck como membrana con la geometría del deck.
  const ysEj = [0.000, 3.200, 12.420, 14.740];
  const z = P.zMez;
  for (const x of xs) for (const y of [3.200, 12.420]) {
    const b0 = nodo(x, y, 0); Lh.push(`support ${b0} 1 1 1 1 1 1`);
    barra(b0, nodo(x, y, z), SEC.col);
  }
  // partir las columnas exteriores en z: se rehacen como dos tramos (se reescriben las líneas de esas barras)
  // → más simple: las exteriores se generaron de 0 a inf; aquí se sustituyen buscando la línea y cambiando el nudo final.
  for (const x of xs) for (const y of [0.000, 14.740]) {
    const b0 = nodo(x, y, 0), bz = nodo(x, y, z), bInf = nodo(x, y, zSup(y) - P.canto);
    const idx = Lh.findIndex((l) => l.startsWith("frame ") && l.split(" ")[2] === String(b0) && l.split(" ")[3] === String(bInf));
    if (idx >= 0) { const t = Lh[idx].split(" "); t[3] = String(bz); Lh[idx] = t.join(" "); barra(bz, bInf, SEC.col); }
  }
  // malla del mezanine: xs (ejes) con nSecMez secundarias por vano en X; ys = ejes Y
  const xm = [];
  for (let i = 0; i < xs.length - 1; i++) for (let q = 0; q <= P.nSecMez; q++) { const v = xs[i] + q * (xs[i + 1] - xs[i]) / (P.nSecMez + 1); if (!xm.some((u) => Math.abs(u - v) < 1e-6)) xm.push(v); }
  xm.push(xs[xs.length - 1]);
  // HUECO DE LA RAMPA en L (galpon_geom.py HUECO_RAMPA; Jorge 15-sep-2026: «le falta la rampa, no tiene vacío»):
  // brazo oeste x 0–2.00 · y 3.20–14.74 y brazo norte x 2.00–20.10 · y 12.42–14.74. Dentro no va losa, ni viga ni
  // vigueta; el borde lo cierran las vigas que quedan en su contorno (brochales). x = 2.00 entra como línea de viga.
  const HUECO = [[0.0, 3.2, 2.0, L], [2.0, 12.42, 20.1, L]];
  const RAMPA_X1 = 2.0;
  if (!xm.some((u) => Math.abs(u - RAMPA_X1) < 1e-6)) xm.push(RAMPA_X1);
  xm.sort((a, b) => a - b);
  const dentro = (x, y) => HUECO.some(([x0, y0, x1, y1]) => x > x0 + 1e-6 && x < x1 - 1e-6 && y > y0 + 1e-6 && y < y1 - 1e-6);
  const esEjeX = (v) => xs.some((u) => Math.abs(u - v) < 1e-6);
  for (const y of ysEj) for (let i = 0; i < xm.length - 1; i++) {   // en X por los ejes
    if (dentro((xm[i] + xm[i + 1]) / 2, y)) continue;
    barra(nodo(xm[i], y, z), nodo(xm[i + 1], y, z), SEC.vP);
  }
  for (const x of xm) for (let j = 0; j < ysEj.length - 1; j++) {   // en Y
    if (dentro(x, (ysEj[j] + ysEj[j + 1]) / 2)) continue;
    // la de x = 2.00 solo existe como brochal del brazo oeste (no es vigueta suelta en el resto de la planta)
    if (Math.abs(x - RAMPA_X1) < 1e-6 && !(ysEj[j] >= 3.2 - 1e-6 && ysEj[j + 1] <= 12.42 + 1e-6)) continue;
    barra(nodo(x, ysEj[j], z), nodo(x, ysEj[j + 1], z), esEjeX(x) || Math.abs(x - RAMPA_X1) < 1e-6 ? SEC.vP : SEC.vI);
  }
  for (let i = 0; i < xm.length - 1; i++) for (let j = 0; j < ysEj.length - 1; j++) {
    if (dentro((xm[i] + xm[i + 1]) / 2, (ysEj[j] + ysEj[j + 1]) / 2)) continue;
    s++;
    Lh.push(`shell ${s} ${nodo(xm[i], ysEj[j], z)} ${nodo(xm[i + 1], ysEj[j], z)} ${nodo(xm[i + 1], ysEj[j + 1], z)} ${nodo(xm[i], ysEj[j + 1], z)} ${P.tc} 25000000 0 2.4`);
    Lh.push(`decksec ${s} ${P.tc} ${P.hr} ${P.wrt} ${P.wrb} ${P.sr} ${P.w}`);
    Lh.push(`shellmod ${s} 1 0`);
  }
}
Lh.push("solve");
mkdirSync(dirname(P.salida), { recursive: true });
writeFileSync(P.salida, Lh.join("\n") + "\n");
console.log(`${P.salida}: ${n} nudos, ${f} barras, ${s} cáscaras · ${titulo}`);
