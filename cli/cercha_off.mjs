import { medirCercha } from "./cercha_cmp.mjs";
const o = await medirCercha(JSON.parse(process.argv[2] || "{}"));
let n = 0, dif = 0; const cls = {};
for (const b of o.Dead.barras) {
  const e1 = b.eo[0] / 1000, e2 = b.eo[1] / 1000, h1 = b.ho[0], h2 = b.ho[1];
  const d = Math.abs(e1 - h1) > 2e-3 || Math.abs(e2 - h2) > 2e-3 || (b.ho[2] === 1 && b.eo[2] === 0 && (e1 > 0 || e2 > 0));
  const k = b.sec.slice(0, 18) + (d ? " DIF" : " ok"); cls[k] = (cls[k] || 0) + 1;
  if (d && n++ < 25) console.log(b.nm, b.sec.slice(0, 14), "ETABS mm", b.eo.map((v) => +v.toFixed(1)).join("/"), " Hek m", b.ho.map((v) => +v.toFixed(4)).join("/"));
}
console.log(cls);
console.log("--- cordon superior y=29 (Tubo 50, z>11.8, 78<x<86)");
for (const b of o.Dead.barras.filter((q) => q.sec.startsWith("Tubo 50") && Math.abs(q.p1[1] - 29) < 1e-3 && Math.abs(q.p2[1] - 29) < 1e-3 && q.p1[2] > 11.8 && q.p2[2] > 11.8 && q.p1[0] > 78 && q.p2[0] < 86))
  console.log(b.nm, b.p1.map((v) => +v.toFixed(2)).join(","), ">", b.p2.map((v) => +v.toFixed(2)).join(","), "ETABS mm", b.eo.map((v) => +v.toFixed(1)).join("/"), " Hek m", b.ho.map((v) => +v.toFixed(4)).join("/"));
console.log("--- DIF por grupo (primer ejemplo y cuenta)");
const g = {};
for (const b of o.Dead.barras) {
  const e1 = b.eo[0] / 1000, e2 = b.eo[1] / 1000, h1 = b.ho[0], h2 = b.ho[1];
  if (!(Math.abs(e1 - h1) > 2e-3 || Math.abs(e2 - h2) > 2e-3 || (b.ho[2] === 1 && b.eo[2] === 0 && (e1 > 0 || e2 > 0)))) continue;
  const dir = Math.abs(b.p2[2] - b.p1[2]) > 0.5 ? "vert/diag" : Math.abs(b.p2[0] - b.p1[0]) > 0.3 ? "en x" : "en y";
  const k = `${b.sec.slice(0, 12)} | ${dir} | ETABS ${b.eo.map((v) => Math.round(v)).join("/")} | Hek ${b.ho.map((v) => +(v * (v < 2 ? 1000 : 1)).toFixed(0)).join("/")}`;
  (g[k] ??= []).push(b);
}
for (const [k, v] of Object.entries(g).sort((a, c) => c[1].length - a[1].length).slice(0, 25)) console.log(v.length, k, "ej", v[0].nm, v[0].p1.map((x) => +x.toFixed(2)).join(","), ">", v[0].p2.map((x) => +x.toFixed(2)).join(","));
