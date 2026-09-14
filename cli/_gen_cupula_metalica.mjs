// Cúpula curva con ÁREAS + nervios metálicos (meridianos) + vigas secundarias (anillos) + 2 entrepisos
// en anillo con columnas metálicas. Todo Q4: óculo arriba (anillo de compresión), sin triángulos
// (un Q4 colapsado no es un elemento definido y cada programa cae en un ruido distinto).
//   node cli/_gen_cupula_metalica.mjs → cli/shots/cupula_metalica/cupula_metalica.heks
import { mkdirSync, writeFileSync } from "node:fs";
const R = 10, NM = 16, NR = 6, dPhi = 11.25;              // anillos a 0°, 11.25° … 67.5° (óculo r = 3.83 m)
const tC = 0.10, Ec = 25e6, rhoC = 2.4;                    // cáscara de hormigón 10 cm
const Es = 200e6, nuS = 0.3, rhoS = 7.85;                  // acero
// IPE 300 (nervios y anillos): A, I22 (débil), I33 (fuerte), J, D, B
const IPE = [5.381e-3, 6.038e-6, 8.356e-5, 2.013e-7, 0.300, 0.150];
// HSS 200x200x8 (columnas)
const HSS = [5.94e-3, 3.54e-5, 3.54e-5, 5.60e-5, 0.200, 0.200];
const L = ["# Cupula metalica: R=10 m, 16 meridianos, anillos cada 11.25 deg hasta oculo 67.5 deg; cascara 10 cm + nervios IPE300 + anillos IPE300 (secundarias) + entrepisos en anillo a 11.25 y 33.75 deg sobre columnas HSS200x8",
  "selfweight 1"];
const ids = new Map(); let n = 0, s = 0, f = 0;
const nodo = (x, y, z, fijo = false) => {
  const k = [x, y, z].map(v => (Math.abs(v) < 1e-9 ? 0 : v).toFixed(4)).join(",");
  if (!ids.has(k)) { ids.set(k, ++n); L.push(`node ${n} ${+x.toFixed(6)} ${+y.toFixed(6)} ${+z.toFixed(6)}`); if (fijo) L.push(`support ${n} 1 1 1 1 1 1`); }
  return ids.get(k);
};
const rad = d => d * Math.PI / 180;
const pc = (r, th, z, fijo) => nodo(r * Math.cos(th), r * Math.sin(th), z, fijo);
const barra = (a, b, P, nom) => { f++; L.push(`frame ${f} ${a} ${b} ${Es} ${P[0]} ${P[1]} ${P[2]} ${P[3]} ${nuS} ${rhoS} ${P[4]} ${P[5]} # ${nom}`); };
const cascara = (a, b, c, d, t = tC) => { s++; L.push(`shell ${s} ${a} ${b} ${c} ${d} ${t} ${Ec} 0 ${rhoC}`); };
// ── cúpula: nudos por anillo i y meridiano j ──
const D = (i, j) => { const ph = rad(i * dPhi), th = rad(j * 360 / NM); return pc(R * Math.cos(ph), th, R * Math.sin(ph), i === 0); };
for (let i = 0; i < NR; i++) for (let j = 0; j < NM; j++) cascara(D(i, j), D(i, (j + 1) % NM), D(i + 1, (j + 1) % NM), D(i + 1, j));
for (let i = 0; i < NR; i++) for (let j = 0; j < NM; j++) barra(D(i, j), D(i + 1, j), IPE, "IPE300");          // nervios
for (let i = 1; i <= NR; i++) for (let j = 0; j < NM; j++) barra(D(i, j), D(i, (j + 1) % NM), IPE, "IPE300");  // anillos (secundarias)
// ── entrepisos en anillo: losa 15 cm del borde de la cúpula hacia adentro, columnas en el borde interior ──
const tL = 0.15;
for (const [iR, rIn] of [[1, 6.5], [3, 4.5]]) {
  const ph = rad(iR * dPhi), z = R * Math.sin(ph), rOut = R * Math.cos(ph), rMid = (rOut + rIn) / 2;
  const P = (r, j) => r === rOut ? D(iR, j) : pc(r, rad(j * 360 / NM), z);
  for (let j = 0; j < NM; j++) {
    const j1 = (j + 1) % NM;
    cascara(P(rOut, j), P(rOut, j1), P(rMid, j1), P(rMid, j), tL);
    cascara(P(rMid, j), P(rMid, j1), P(rIn, j1), P(rIn, j), tL);
    barra(P(rIn, j), P(rIn, j1), IPE, "IPE300");                     // viga de borde interior
    barra(P(rOut, j), P(rMid, j), IPE, "IPE300"); barra(P(rMid, j), P(rIn, j), IPE, "IPE300");   // vigas radiales
  }
  for (let j = 0; j < NM; j += 2) barra(pc(rIn, rad(j * 360 / NM), 0, true), P(rIn, j), HSS, "HSS200X8");      // columnas
}
L.push("solve");                                          // sin `solve` cliModeler arma el modelo pero no lo resuelve
mkdirSync("cli/shots/cupula_metalica", { recursive: true });
writeFileSync("cli/shots/cupula_metalica/cupula_metalica.heks", L.join("\n") + "\n");
console.log("nudos", n, "cascaras", s, "barras", f);
