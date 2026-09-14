import { empaquetar, R } from "../tests/lib/bundle.mjs";
const m = await empaquetar(`export { triangularPoligono } from "${R}/examples/src/shared/e2kParser";\n`, "tri" + Date.now());
const area = (t, N) => { const [a, b, c] = t.map(i => N[i]); const u = b.map((x, k) => x - a[k]), v = c.map((x, k) => x - a[k]); const cr = [u[1]*v[2]-u[2]*v[1], u[2]*v[0]-u[0]*v[2], u[0]*v[1]-u[1]*v[0]]; return { A: Math.hypot(...cr) / 2, nz: cr[2] }; };
// L no convexa en planta, CCW, area 3
const L = [[0,0,0],[2,0,0],[2,1,0],[1,1,0],[1,2,0],[0,2,0]];
let t = m.triangularPoligono([0,1,2,3,4,5], L); let s = t.map(x => area(x, L));
console.log("L:", t.length, "tris, area", s.reduce((a, b) => a + b.A, 0), "todas nz>0:", s.every(q => q.nz > 0));
// hexagono vertical en plano XZ (muro), CW
const H = [...Array(6).keys()].map(i => [Math.cos(-i*Math.PI/3), 5, Math.sin(-i*Math.PI/3) + 3]);
t = m.triangularPoligono([0,1,2,3,4,5], H); s = t.map(x => area(x, H));
console.log("hex XZ:", t.length, "tris, area", s.reduce((a, b) => a + b.A, 0).toFixed(6), "exacta", (3*Math.sqrt(3)/2).toFixed(6));
