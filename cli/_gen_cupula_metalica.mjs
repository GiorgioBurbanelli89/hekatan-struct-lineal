// Cúpula curva con ÁREAS + nervios metálicos (meridianos) + vigas secundarias (anillos) + 2 entrepisos
// en anillo con columnas metálicas. Todo Q4: óculo arriba (anillo de compresión), sin triángulos
// (un Q4 colapsado no es un elemento definido y cada programa cae en un ruido distinto).
//   node cli/_gen_cupula_metalica.mjs [k=1] [nr=2] [salida=cli/shots/cupula_metalica/cupula_metalica.heks]
// k  = divisiones de cada paño en el sentido del ANILLO (cúpula y entrepisos; nudos sobre la cuerda)
// nr = divisiones de cada franja de entrepiso en el sentido RADIAL
// La ESTRUCTURA no cambia con k y nr (16 nervios, anillos, vigas radiales solo en los meridianos, columnas):
// solo la malla. (14-sep-2026) Con k=1 nr=2 la losa es tan gruesa que SAP2000 y Hekatan (misma malla) quedan
// muy rígidos; ETABS mallea por dentro los pisos horizontales y se va a la solución fina (borde del entrepiso
// −0.44 contra −0.09 mm). Con la malla fina desde el modelo, ETABS no agrega nudos y cierran los tres.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
const O = { k: 1, nr: 2, salida: "cli/shots/cupula_metalica/cupula_metalica.heks" };
for (const a of process.argv.slice(2)) { const [c, v] = a.split("="); if (c in O) O[c] = isNaN(+v) ? v : +v; }
const K = Math.max(1, Math.round(O.k)), NR = Math.max(1, Math.round(O.nr));
const R = 10, NM = 16, NRING = 6, dPhi = 11.25;            // anillos a 0°, 11.25° … 67.5° (óculo r = 3.83 m)
const tC = 0.10, Ec = 25e6, rhoC = 2.4;                    // cáscara de hormigón 10 cm
const Es = 200e6, nuS = 0.3, rhoS = 7.85;                  // acero
// IPE 300 (nervios y anillos): A, I22 (débil), I33 (fuerte), J, D, B
const IPE = [5.381e-3, 6.038e-6, 8.356e-5, 2.013e-7, 0.300, 0.150];
// HSS 200x200x8 (columnas)
const HSS = [5.94e-3, 3.54e-5, 3.54e-5, 5.60e-5, 0.200, 0.200];
const L = [`# Cupula metalica: R=10 m, 16 meridianos, anillos cada 11.25 deg hasta oculo 67.5 deg; cascara 10 cm + nervios IPE300 + anillos IPE300 (secundarias) + entrepisos en anillo a 11.25 y 33.75 deg sobre columnas HSS200x8 · malla k=${K} nr=${NR}`,
  "selfweight 1"];
const ids = new Map(); let n = 0, s = 0, f = 0;
const nodo = ([x, y, z], fijo = false) => {
  const key = [x, y, z].map(v => (Math.abs(v) < 1e-9 ? 0 : v).toFixed(4)).join(",");
  if (!ids.has(key)) { ids.set(key, ++n); L.push(`node ${n} ${+x.toFixed(6)} ${+y.toFixed(6)} ${+z.toFixed(6)}`); if (fijo) L.push(`support ${n} 1 1 1 1 1 1`); }
  return ids.get(key);
};
const rad = d => d * Math.PI / 180;
const lerp = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
const barra = (a, b, P, nom) => { f++; L.push(`frame ${f} ${a} ${b} ${Es} ${P[0]} ${P[1]} ${P[2]} ${P[3]} ${nuS} ${rhoS} ${P[4]} ${P[5]} # ${nom}`); };
const cascara = (a, b, c, d, t = tC) => { s++; L.push(`shell ${s} ${a} ${b} ${c} ${d} ${t} ${Ec} 0 ${rhoC}`); };
// ── cúpula: punto del anillo i, meridiano j, fracción q/K sobre la cuerda hacia j+1 ──
const P0 = (i, j) => { const ph = rad(i * dPhi), th = rad(j * 360 / NM); return [R * Math.cos(ph) * Math.cos(th), R * Math.cos(ph) * Math.sin(th), R * Math.sin(ph)]; };
const PD = (i, j, q) => lerp(P0(i, j), P0(i, (j + 1) % NM), q / K);
const D = (i, j, q = 0) => nodo(PD(i, j, q), i === 0);
for (let i = 0; i < NRING; i++) for (let j = 0; j < NM; j++) for (let q = 0; q < K; q++)
  cascara(D(i, j, q), D(i, j, q + 1), D(i + 1, j, q + 1), D(i + 1, j, q));
for (let i = 0; i < NRING; i++) for (let j = 0; j < NM; j++) barra(D(i, j), D(i + 1, j), IPE, "IPE300");                       // nervios
for (let i = 1; i <= NRING; i++) for (let j = 0; j < NM; j++) for (let q = 0; q < K; q++) barra(D(i, j, q), D(i, j, q + 1), IPE, "IPE300");  // anillos
// ── entrepisos en anillo: losa 15 cm del borde de la cúpula hacia adentro, columnas en el borde interior ──
const tL = 0.15;
for (const [iR, rIn] of [[1, 6.5], [3, 4.5]]) {
  const z = R * Math.sin(rad(iR * dPhi));
  const PI_ = (j, q) => { const th0 = rad(j * 360 / NM), th1 = rad((j + 1) * 360 / NM); return lerp([rIn * Math.cos(th0), rIn * Math.sin(th0), z], [rIn * Math.cos(th1), rIn * Math.sin(th1), z], q / K); };
  // punto de la losa: fracción radial p/NR desde el borde de la cúpula (p=0) al borde interior (p=NR)
  const PL = (j, q, p) => nodo(lerp(PD(iR, j, q), PI_(j, q), p / NR));
  for (let j = 0; j < NM; j++) for (let q = 0; q < K; q++) for (let p = 0; p < NR; p++)
    cascara(PL(j, q, p), PL(j, q + 1, p), PL(j, q + 1, p + 1), PL(j, q, p + 1), tL);
  for (let j = 0; j < NM; j++) {
    for (let q = 0; q < K; q++) barra(PL(j, q, NR), PL(j, q + 1, NR), IPE, "IPE300");        // viga de borde interior
    for (let p = 0; p < NR; p++) barra(PL(j, 0, p), PL(j, 0, p + 1), IPE, "IPE300");         // viga radial (solo en el meridiano)
  }
  for (let j = 0; j < NM; j += 2) barra(nodo([rIn * Math.cos(rad(j * 360 / NM)), rIn * Math.sin(rad(j * 360 / NM)), 0], true), PL(j, 0, NR), HSS, "HSS200X8");   // columnas
}
L.push("solve");                                          // sin `solve` cliModeler arma el modelo pero no lo resuelve
mkdirSync(dirname(O.salida), { recursive: true });
writeFileSync(O.salida, L.join("\n") + "\n");
console.log(`${O.salida}: nudos ${n} cascaras ${s} barras ${f} (k=${K} nr=${NR})`);
