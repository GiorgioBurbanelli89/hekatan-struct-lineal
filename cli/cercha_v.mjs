import { medirCercha } from "./cercha_cmp.mjs";
const o = await medirCercha(JSON.parse(process.argv[2] || "{}"));
const L = o.Dead.barras.filter((b) => b.sec.startsWith(process.argv[3] || "SOBRE"));
for (const b of L.sort((a, c) => a.p1[0] - c.p1[0]).slice(0, 30)) console.log(b.nm, b.p1.map((v) => +v.toFixed(2)).join(","), "ETABS V", b.eV.toFixed(3), b.eV2.toFixed(3), "Hek", b.vh.toFixed(3), b.vh2.toFixed(3), " P", b.eJ.toFixed(3), b.hJ.toFixed(3));
