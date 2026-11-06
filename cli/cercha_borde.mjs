// Cordon superior/inferior/diagonales del recorte de cercha vs ETABS segun la union panel-arista. Uso: node cli/cercha_borde.mjs [tiras|interp]
import { medirCercha } from "./cercha_cmp.mjs";
const modo = process.argv[2] || "interp";
const o = await medirCercha({ bordeInterpolado: modo === "interp", ...(modo === "tiras" ? { membranaEnNudos: true } : {}) });
for (const pat of ["Dead", "Live"]) {
  const { barras, nodos } = o[pat]; const sq = [0, 0, 0], sr = [0, 0, 0];
  for (const n of nodos) for (let k = 0; k < 3; k++) { sq[k] += (n.h[k] - n.e[k]) ** 2; sr[k] += n.e[k] ** 2; }
  console.log(modo, pat, "U rms% x/y/z", sq.map((v, k) => (100 * Math.sqrt(v / sr[k])).toFixed(2)).join(" / "));
  const en = (b) => b.sec.startsWith("Tubo 50") && Math.abs(b.p1[1] - 29) < 1e-3 && Math.abs(b.p2[1] - 29) < 1e-3 && b.p1[0] > 78.6 && b.p2[0] < 85.8;
  const sup = barras.filter((b) => en(b) && b.p1[2] > 11.8 && b.p2[2] > 11.8).sort((a, c) => a.p1[0] - c.p1[0]);
  console.log(" sup (x: ETABS/Hek)", sup.map((b) => `${b.p1[0].toFixed(1)}:${b.eJ.toFixed(2)}/${b.hJ.toFixed(2)}`).join(" "));
  const inf = barras.filter((b) => en(b) && b.p1[2] < 11.5 && b.p2[2] < 11.5), dia = barras.filter((b) => en(b) && Math.abs(b.p2[2] - b.p1[2]) > 0.3);
  const err = (l) => l.reduce((m, b) => Math.max(m, Math.abs(b.hJ - b.eJ)), 0).toFixed(3);
  console.log(" inf err", err(inf), "dia err", err(dia));
}
