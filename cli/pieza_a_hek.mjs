// Pieza A en Hekatan (mismo modelo que cli/sap2000_pieza_a.py): panel 1x4 m membrana A36 4 mm + 2 barras Tubo 50x3, compresion 1 kN en la barra y=1.
// Uso: node cli/pieza_a_hek.mjs [sueltos|tiras|nodal]   (sueltos = 1 Q4, nudos colgados sin atar; tiras = 4 Q4 por los nudos colgados; nodal = igual a tiras mas...)
import { writeFileSync, mkdtempSync } from "node:fs"; import { tmpdir } from "node:os"; import { join } from "node:path";
import { resolverHeks } from "../tests/lib/heks.mjs";
const modo = process.argv[2] || "sueltos";
const E = 199947980, nu = 0.3, rho = 7.849048;
const N = [[0,0],[4,0],[4,1],[0,1],[1,1],[2,1],[3,1]];            // 1=a 2=b 3=c 4=d 5..7 = m1..m3
let h = N.map(([x, y], i) => `node ${i + 1} ${x} ${y} 0`);
const fr = (id, i, j) => `frame ${id} ${i} ${j} ${E} 0.0004429646 1.228119e-7 1.228119e-7 2.456239e-7 ${nu} ${rho} 0.05 0.05`;
h.push(fr(1, 1, 2), fr(2, 4, 5), fr(3, 5, 6), fr(4, 6, 7), fr(5, 7, 3));
let id = 6, sh = [];
if (modo === "sueltos") sh.push(`shell ${id++} 1 2 3 4 0.004 ${E} ${nu} ${rho}`);
else { // tiras: nudos extra en y=0 (8,9,10) para que cada tira sea Q4; la barra y=0 se parte tambien
  const ex = [[1,0],[2,0],[3,0]]; ex.forEach(([x, y], i) => h.push(`node ${8 + i} ${x} ${y} 0`));
  h = h.filter((l) => !l.startsWith("frame 1 ")); h.push(fr(1, 1, 8), fr(11, 8, 9), fr(12, 9, 10), fr(13, 10, 2));
  const bot = [1, 8, 9, 10, 2], top = [4, 5, 6, 7, 3];
  for (let k = 0; k < 4; k++) sh.push(`shell ${id++} ${bot[k]} ${bot[k + 1]} ${top[k + 1]} ${top[k]} 0.004 ${E} ${nu} ${rho}`);
}
if (process.env.EDGE) h.push(process.env.EDGE);
h.push(...sh, `shelltype ${6}-${id - 1} thick`);
for (let e = 6; e < id; e++) h.push(`shellmod ${e} 1 1 1 0 0 0 0 0`);
const ap = { 1: "1 1 1 0 0 0", 2: "0 1 1 0 0 0", 3: "0 0 1 0 0 0", 4: "0 1 1 0 0 0" };
// problema en el plano: uz, rx, ry fijos en TODOS los nudos (la membrana no los rigidiza); ux/uy/rz como en SAP
const nn = h.filter((l) => l.startsWith("node ")).length;
for (let n = 1; n <= nn; n++) { const r = (ap[n] ?? "0 0 1 0 0 0").split(" ").map(Number); h.push(`support ${n} ${r[0]} ${r[1]} 1 1 1 ${r[5]}`); }
h.push(...(process.env.CARGA === "m2" ? ["load 6 1 0 0 0 0 0 Dead"] : ["load 4 1 0 0 0 0 0 Dead", "load 3 -1 0 0 0 0 0 Dead"]), "solve");
const f = join(mkdtempSync(join(tmpdir(), "pa-")), "a.heks"); writeFileSync(f, h.join("\n") + "\n");
const l = console.log; console.log = console.warn = console.info = () => {};
globalThis.__hekatanFactoresPatron = { Dead: 1 };
const s = await resolverHeks(f); console.log = l;
const Nn = s.analyzeOutputs.normals;
s.elements.forEach((e, i) => { if (e.length === 2) { const v = Nn.get(i); console.log("barra", s.nodes[e[0]].join(","), ">", s.nodes[e[1]].join(","), "P", v?.map((x) => x.toFixed(4)).join(" ")); } });
