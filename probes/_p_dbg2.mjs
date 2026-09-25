import { readFileSync } from "fs";
const f = "C:\\Users\\j-b-j\\Downloads\\Cancha Parque v24.s2k";
const L = readFileSync(f, "utf8").split(/\r?\n/);
const parse = (l) => Object.fromEntries([...l.matchAll(/(\w+)=("[^"]*"|\S+)/g)].map((m) => [m[1], m[2].replace(/^"|"$/g, "")]));
let t = "", rows = {};
for (const l of L) { const m = l.match(/^TABLE:\s*"([^"]+)"/); if (m) { t = m[1]; continue; } if (t && /^\s*\w+=/.test(l)) (rows[t] ??= []).push(l); }
const nodos = new Map();
for (const l of rows["JOINT COORDINATES"] ?? []) { const r = parse(l); nodos.set(r.Joint, [+r.XorR, +r.Y, +r.Z]); }
const conn = (rows["CONNECTIVITY - FRAME"] ?? []).map(parse);
// arco en plano Y=0
const plano = [...nodos.entries()].filter(([, p]) => p[1] === 0).sort((a, b) => a[1][0] - b[1][0]);
console.log("plano Y=0 (x,z) ordenado por x:", plano.map(([, p]) => `(${p[0]},${p[2]})`).join(" "));
// vecinos
const vec = new Map();
for (const c of conn) for (const [a, b] of [[c.JointI, c.JointJ], [c.JointJ, c.JointI]]) { if (!vec.has(a)) vec.set(a, []); vec.get(a).push(b); }
// debug frame 890
const f890 = conn.find((c) => c.Frame === "890");
console.log("frame 890:", JSON.stringify(f890));
for (const jn of [f890.JointI, f890.JointJ]) {
  const p = nodos.get(jn);
  console.log(` nudo ${jn} (${p}) vecinos:`, (vec.get(jn) ?? []).map((q) => `${q}${JSON.stringify(nodos.get(q))}`).join(" | "));
}
// ¿las correas cargadas están en qué Z? histograma de Z de extremos
const viento = (rows["FRAME LOADS - DISTRIBUTED"] ?? []).map(parse).filter((r) => r.LoadPat === "VIENTO");
const zset = {};
for (const v of viento) { const c = conn.find((x) => x.Frame === v.Frame); if (!c) continue; const p = nodos.get(c.JointI); zset[p[2]] = (zset[p[2]] ?? 0) + 1; }
console.log("Z de correas viento:", JSON.stringify(zset));
