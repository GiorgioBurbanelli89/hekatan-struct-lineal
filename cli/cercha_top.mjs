import { medirCercha } from "./cercha_cmp.mjs";
const o = await medirCercha(JSON.parse(process.argv[2] || "{}"));
const pat = process.argv[3] || "Dead";
const L = o[pat].barras.map((b) => ({ ...b, d: b.hJ - b.eJ, hH: b.hJ })).sort((a, c) => Math.abs(c.d) - Math.abs(a.d));
for (const b of L.slice(0, 40)) console.log(b.nm, b.sec.slice(0, 14), b.p1.map((v) => +v.toFixed(2)).join(","), ">", b.p2.map((v) => +v.toFixed(2)).join(","), "ETABS", b.eJ.toFixed(3), "Hek", b.hJ.toFixed(3), "d", b.d.toFixed(3));
let tot = 0; for (const b of L) tot += b.d * b.d; console.log("rms dif axil", Math.sqrt(tot / L.length).toFixed(4), "n", L.length);
