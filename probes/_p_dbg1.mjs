import { readFileSync } from "fs";
const f = "C:\\Users\\j-b-j\\Downloads\\Cancha Parque v24.s2k";
const L = readFileSync(f, "utf8").split(/\r?\n/);
const parse = (l) => Object.fromEntries([...l.matchAll(/(\w+)=("[^"]*"|\S+)/g)].map((m) => [m[1], m[2].replace(/^"|"$/g, "")]));
let t = "", rows = {};
for (const l of L) { const m = l.match(/^TABLE:\s*"([^"]+)"/); if (m) { t = m[1]; continue; } if (t && /^\s*\w+=/.test(l)) (rows[t] ??= []).push(l); }
console.log("JOINTS n=", (rows["JOINT COORDINATES"] || []).length);
console.log((rows["JOINT COORDINATES"] || []).slice(0, 2));
console.log("CONN n=", (rows["CONNECTIVITY - FRAME"] || []).length);
console.log((rows["CONNECTIVITY - FRAME"] || []).slice(0, 2));
const c890 = (rows["CONNECTIVITY - FRAME"] || []).map(parse).find((r) => r.Frame === "890");
console.log("frame 890:", JSON.stringify(c890));
