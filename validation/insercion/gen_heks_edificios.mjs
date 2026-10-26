// Escribe, por cada edificio del estudio, el .heks de la GEOMETRÍA (sin cargas) y un JSON con las cargas nodales D, L, EX, EY para ETABS.
import { writeFileSync, mkdirSync } from "node:fs";
import { EDIFICIOS, construir } from "./edificios_estudio.mjs";
mkdirSync("validation/insercion/etabs/edificios", { recursive: true });
const E = 2.5e7, nu = 0.2;
const J = (a, b) => { const A = Math.max(a, b), B = Math.min(a, b); return A * B ** 3 * (1 / 3 - 0.21 * (B / A) * (1 - B ** 4 / (12 * A ** 4))); };
for (const id of Object.keys(EDIFICIOS)) {
  const S = EDIFICIOS[id], B = construir(S);
  const L = [];
  B.N.forEach((p, i) => L.push(`node ${i + 1} ${p[0]} ${p[1]} ${p[2]}`));
  let k = 1; const sh = [];
  B.els.forEach((e, i) => {
    if (B.tipo[i] === "losa") { sh.push(k); L.push(`shell ${k++} ${e.map(n => n + 1).join(" ")} ${S.t} ${E} 0 0`); return; }
    const col = B.tipo[i] === "col"; const [t2, t3] = col ? [B.info[i].lado, B.info[i].lado] : [S.bb, S.bh];
    L.push(`frame ${k++} ${e[0] + 1} ${e[1] + 1} ${E} ${t2 * t3} ${t3 * t2 ** 3 / 12} ${t2 * t3 ** 3 / 12} ${J(t2, t3)} ${nu} 0`);
  });
  // los .heks numeran barras y cáscaras con un mismo contador: se escriben las cáscaras como rango por ids sueltos
  L.push(`shelltype ${sh.map(x => x).join(",")} thin`.length > 4000 ? "" : "");
  for (const id2 of sh) { L.push(`shelltype ${id2} thin`); L.push(`shellnu ${id2} ${nu}`); }
  for (const [n] of B.supports) L.push(`support ${n + 1} fixed`);
  L.push("selfweight 0", "solve");
  writeFileSync(`validation/insercion/etabs/edificios/e_${id}.heks`, L.join("\n") + "\n");
  const cargas = {}; for (const lc of ["D", "L", "EX", "EY"]) cargas[lc] = [...B.cargas[lc].entries()].map(([n, q]) => [B.N[n][0], B.N[n][1], B.N[n][2], q[0], q[1], q[2]]);
  writeFileSync(`validation/insercion/etabs/edificios/e_${id}.json`, JSON.stringify({ cargas, h: S.h, bb: S.bb, bh: S.bh }));
  console.log(id, B.N.length, "nudos", B.els.length, "elementos");
}
