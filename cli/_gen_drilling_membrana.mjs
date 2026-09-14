// Ejemplo aparte de DRILLING: muro MEMBRANA (sin flexión) + viga en voladizo en SU PLANO.
// El momento de la viga entra al muro SOLO por el giro normal a la membrana (drilling, Ry).
//   node cli/_gen_drilling_membrana.mjs  → cli/shots/drilling_membrana/drilling_membrana.heks
import { mkdirSync, writeFileSync } from "node:fs";
const W = 3, H = 3, nx = 6, nz = 6, t = 0.2, E = 25e6;
const L = 2, nb = 4, zViga = 1.5, F = -50;            // voladizo 2 m a media altura, 50 kN hacia abajo
const b = 0.3, h = 0.5, A = b * h, I33 = b * h ** 3 / 12, I22 = h * b ** 3 / 12;
const J = (h * b ** 3) * (1 / 3 - 0.21 * (b / h) * (1 - (b / h) ** 4 / 12));
const L_ = ["# Drilling aparte: muro membrana 3x3 m (t 0.20, shellmod flexion 0) + viga voladizo 30x50 L=2 m en su plano, 50 kN en la punta",
  "selfweight 0"];
const id = new Map(); let n = 0;
const nodo = (x, z) => { const k = x.toFixed(4) + "," + z.toFixed(4); if (!id.has(k)) { id.set(k, ++n); L_.push(`node ${n} ${x} 0 ${z}`); L_.push(z === 0 ? `support ${n} 1 1 1 1 1 1` : `support ${n} 0 1 0 1 0 1`); } return id.get(k); };
for (let k = 0; k <= nz; k++) for (let i = 0; i <= nx; i++) nodo(i * W / nx, k * H / nz);
let s = 0;
for (let k = 0; k < nz; k++) for (let i = 0; i < nx; i++) {
  const x0 = i * W / nx, x1 = (i + 1) * W / nx, z0 = k * H / nz, z1 = (k + 1) * H / nz;
  s++; L_.push(`shell ${s} ${nodo(x0, z0)} ${nodo(x1, z0)} ${nodo(x1, z1)} ${nodo(x0, z1)} ${t} ${E}`);
  L_.push(`shellmod ${s} 1 0`);
}
let prev = nodo(W, zViga);
for (let j = 1; j <= nb; j++) {
  const nj = nodo(W + j * L / nb, zViga);
  L_.push(`frame ${j} ${prev} ${nj} ${E} ${A} ${I22} ${I33} ${J.toPrecision(6)} 0.2 0 ${h} ${b} # V30X50`);
  prev = nj;
}
L_.push(`load ${prev} 0 0 ${F} 0 0 0`);
L_.push("solve");                                         // sin `solve` cliModeler arma el modelo pero no lo resuelve
mkdirSync("cli/shots/drilling_membrana", { recursive: true });
writeFileSync("cli/shots/drilling_membrana/drilling_membrana.heks", L_.join("\n") + "\n");
console.log("nudos", n, "shells", s, "barras", nb, "momento en el muro", Math.abs(F * L), "kN·m");
