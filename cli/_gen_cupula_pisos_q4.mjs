// La MISMA cúpula con pisos de cupula_pisos.heks (R=10, 8 anillos × 16, losas interiores en los anillos 2 y 4,
// entrepiso a z=5 sobre 4 columnas), pero SIN Q4 colapsados. Cada abanico de 16 triángulos (casquete y centro
// de las dos losas) pasa a ser un parche de 4×4 Q4 cosido a los 16 nudos del anillo (Coons); el del casquete se
// proyecta a la esfera. Motivo: un Q4 con un nudo repetido no es un elemento definido y cada programa cae en un
// ruido distinto — contra SAP2000 el modelo con abanicos daba 7 % en el peor nudo.
//   node cli/_gen_cupula_pisos_q4.mjs → cli/shots/cupula_niveles/cupula_pisos_q4.heks
import { writeFileSync } from "node:fs";
const R = 10, NM = 16, NA = 8, dPhi = 11.25, E = 25e6, rho = 2.4;
const L = ["# cupula R=10 (8 anillos x 16) + losas interiores en los anillos 2 y 4 + entrepiso a z=5 sobre 4 columnas — TODO Q4 (casquete y centros de losa con parche 4x4)",
  "selfweight 1"];
const ids = new Map(); let n = 0, s = 0;
const nodo = ([x, y, z]) => {
  const k = [x, y, z].map(v => (Math.abs(v) < 1e-9 ? 0 : v).toFixed(5)).join(",");
  if (!ids.has(k)) { ids.set(k, ++n); L.push(`node ${n} ${x.toFixed(6)} ${y.toFixed(6)} ${z.toFixed(6)}`); }
  return ids.get(k);
};
const shell = (a, b, c, d, t) => L.push(`shell ${++s} ${a} ${b} ${c} ${d} ${t} ${E} 0 ${rho}`);
const rad = d => d * Math.PI / 180;
const anillo = (r, z) => Array.from({ length: NM }, (_, j) => [r * Math.cos(rad(j * 22.5)), r * Math.sin(rad(j * 22.5)), z]);
// parche 4×4 Q4 dentro de un anillo de 16 puntos (esquinas en j = 2, 6, 10, 14)
function parche(P, t, proyectar) {
  const borde = (a, b) => b === 0 ? P[10 + a] : b === 4 ? P[2 + (4 - a)] : a === 4 ? P[(14 + b) % 16] : P[6 + (4 - b)];
  const G = [];
  for (let a = 0; a <= 4; a++) { G.push([]); for (let b = 0; b <= 4; b++) {
    let p;
    if (a === 0 || a === 4 || b === 0 || b === 4) p = borde(a, b);
    else {
      const u = a / 4, v = b / 4;
      p = [0, 1, 2].map(k => (1 - v) * borde(a, 0)[k] + v * borde(a, 4)[k] + (1 - u) * borde(0, b)[k] + u * borde(4, b)[k]
        - ((1 - u) * (1 - v) * borde(0, 0)[k] + u * (1 - v) * borde(4, 0)[k] + (1 - u) * v * borde(0, 4)[k] + u * v * borde(4, 4)[k]));
      if (proyectar) p[2] = Math.sqrt(R * R - p[0] ** 2 - p[1] ** 2);
    }
    G[a].push(nodo(p));
  } }
  for (let a = 0; a < 4; a++) for (let b = 0; b < 4; b++) shell(G[a][b], G[a + 1][b], G[a + 1][b + 1], G[a][b + 1], t);
}
// cúpula
const A = Array.from({ length: NA }, (_, i) => anillo(R * Math.cos(rad(i * dPhi)), R * Math.sin(rad(i * dPhi))));
const AN = A.map(r => r.map(nodo));
for (const id of AN[0]) L.push(`support ${id} 1 1 1 1 1 1`);
for (let i = 0; i < NA - 1; i++) for (let j = 0; j < NM; j++) shell(AN[i][j], AN[i][(j + 1) % NM], AN[i + 1][(j + 1) % NM], AN[i + 1][j], 0.12);
parche(A[NA - 1], 0.12, true);
// losas interiores en los anillos 2 y 4: corona hasta r/2 + parche 4×4 en el centro
for (const i of [2, 4]) {
  const ri = R * Math.cos(rad(i * dPhi)) / 2, z = R * Math.sin(rad(i * dPhi));
  const In = anillo(ri, z), IN = In.map(nodo);
  for (let j = 0; j < NM; j++) shell(IN[j], AN[i][j], AN[i][(j + 1) % NM], IN[(j + 1) % NM], 0.2);
  parche(In, 0.2, false);
}
// entrepiso 4×4 m a z=5 (2×2 celdas) sobre 4 columnas 30×30
const ez = (x, y) => nodo([x, y, 5]);
for (const [x0, y0] of [[-2, -2], [-2, 0], [0, -2], [0, 0]]) shell(ez(x0, y0), ez(x0 + 2, y0), ez(x0 + 2, y0 + 2), ez(x0, y0 + 2), 0.15);
let f = 0;
for (const [x, y] of [[-2, -2], [2, -2], [2, 2], [-2, 2]]) {
  const b = nodo([x, y, 0]);
  L.push(`frame ${++f} ${b} ${ez(x, y)} ${E} 0.09 0.000675 0.000675 0.001 0.2 2.4`);
  L.push(`support ${b} 1 1 1 1 1 1`);
}
L.push(`load ${ez(0, 0)} 0 0 -10 0 0 0 Live`, "solve");
writeFileSync("cli/shots/cupula_niveles/cupula_pisos_q4.heks", L.join("\n") + "\n");
console.log("nudos", n, "cascaras", s, "barras", f);
