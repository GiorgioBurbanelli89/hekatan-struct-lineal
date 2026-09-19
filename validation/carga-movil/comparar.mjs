/**
 * Hekatan contra SAP2000 (juez) y OpenSeesPy (testigo), posición a posición y en la envolvente.
 * uso: node validation/carga-movil/comparar.mjs [ejemplo|plantilla]  -> COMPARACION_<cual>.md (+ consola)
 * Error = |dif| / (máximo absoluto del campo en TODAS las posiciones) · 100  (tolerancia sobre el máximo).
 * Todo en el signo del DIAGRAMA de CSI: P, V2, M3 en el nudo i y en el j.
 */
import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const AQUI = dirname(fileURLToPath(import.meta.url));
const cual = process.argv[2] ?? "ejemplo";
const lee = (f) => JSON.parse(readFileSync(join(AQUI, f), "utf-8"));
const M = lee(`modelo_${cual}.json`), HK = lee(`hekatan_${cual}.json`);

// ejes CSI de cada barra en el plano XZ, y los de OpenSees 2D
const ejes = M.barras.map((b) => {
  const [xi, zi] = M.nudos[b.i], [xj, zj] = M.nudos[b.j];
  const L = Math.hypot(xj - xi, zj - zi), l = (xj - xi) / L, n = (zj - zi) / L;
  const e2 = Math.abs(l) < 1e-9 ? [1, 0] : [-Math.sign(l) * n, Math.abs(l)];
  const e3y = n * e2[0] - l * e2[1];                 // (e1 × e2)·Y
  const yOps = [-n, l];                                // eje y local de OpenSees 2D
  return { s2: e2[0] * yOps[0] + e2[1] * yOps[1], s3: -e3y };   // OpenSees: M sobre −Y
});

function deOpenSees(R) {
  const out = {};
  for (const [k, v] of Object.entries(R)) out[k] = {
    U: v.U.map((u) => [u[0], u[1], -u[2]]),   // su giro es sobre z2D = −Y; el de Hekatan, sobre +Y
    F: v.F.map((f, e) => { const { s2, s3 } = ejes[e];
      return [-f[0], f[3], -s2 * f[1], s2 * f[4], -s3 * f[2], s3 * f[5]]; }),
  };
  return out;
}

const programas = [];
if (existsSync(join(AQUI, `sap2000_${cual}.json`))) programas.push(["SAP2000 (juez)", lee(`sap2000_${cual}.json`)]);
if (existsSync(join(AQUI, `opensees_${cual}.json`))) programas.push(["OpenSeesPy", deOpenSees(lee(`opensees_${cual}.json`))]);

const casos = Object.keys(HK).filter((c) => !c.startsWith("IL"));
const zBase = (n) => Math.abs(M.nudos[n][1]) < 1e-9;
function envolv(D) {
  const e = { Mmax: -Infinity, Mmin: Infinity, Vmax: 0, Uz: 0, UzBase: 0, Pmax: 0 };
  for (const c of casos) { const d = D[c]; if (!d) continue;
    d.F.forEach((f) => { e.Mmax = Math.max(e.Mmax, f[4], f[5]); e.Mmin = Math.min(e.Mmin, f[4], f[5]);
      e.Vmax = Math.max(e.Vmax, Math.abs(f[2]), Math.abs(f[3])); e.Pmax = Math.max(e.Pmax, Math.abs(f[0]), Math.abs(f[1])); });
    d.U.forEach((u, n) => { e.Uz = Math.min(e.Uz, u[1]); if (zBase(n)) e.UzBase = Math.min(e.UzBase, u[1]); });
  }
  return e;
}
const L = [];
const p = (s) => { L.push(s); console.log(s); };
p(`# Alcantarilla + HL-93 (${cual}): Hekatan contra SAP2000 y OpenSeesPy`);
p(`\n${M.descripcion} · ${M.nudos.length} nudos, ${M.barras.length} barras, ${M.muelles.length} muelles, ${casos.length} posiciones (casos estáticos, mismas cargas nodales).`);
p(`Error = |dif| / máximo del campo en todas las posiciones.\n`);
p(`## Posición a posición (peor caso de todos los nudos/barras y posiciones)\n`);
p(`| campo | pico Hekatan | ${programas.map(([n]) => n).join(" | ")} |`);
p(`|---|---|${programas.map(() => "---").join("|")}|`);
const campos = [["Ux (mm)", (d, n) => d.U.map((u) => u[0] * 1000)], ["Uz (mm)", (d) => d.U.map((u) => u[1] * 1000)], ["Ry (rad)", (d) => d.U.map((u) => u[2])],
  ["P (kN)", (d) => d.F.flatMap((f) => [f[0], f[1]])], ["V2 (kN)", (d) => d.F.flatMap((f) => [f[2], f[3]])], ["M3 (kN·m)", (d) => d.F.flatMap((f) => [f[4], f[5]])]];
for (const [nom, sel] of campos) {
  let pico = 0; for (const c of casos) for (const v of sel(HK[c])) pico = Math.max(pico, Math.abs(v));
  const cols = programas.map(([, D]) => { let m = 0; for (const c of casos) { if (!D[c]) return "falta"; const a = sel(HK[c]), b = sel(D[c]); a.forEach((v, i) => m = Math.max(m, Math.abs(v - b[i]))); } return `${(m / pico * 100).toFixed(4)} %`; });
  p(`| ${nom} | ${pico.toPrecision(5)} | ${cols.join(" | ")} |`);
}
p(`\n## Envolvente del camión (${casos.length} posiciones, separación trasera fija)\n`);
const eh = envolv(HK);
p(`| valor | Hekatan | ${programas.map(([n]) => n).join(" | ")} |`);
p(`|---|---|${programas.map(() => "---").join("|")}|`);
const envs = programas.map(([, D]) => envolv(D));
for (const [k, nom, f] of [["Mmax", "M3 máx (kN·m)", 1], ["Mmin", "M3 mín (kN·m)", 1], ["Vmax", "|V2| máx (kN)", 1], ["Pmax", "|P| máx (kN)", 1], ["Uz", "Uz mín (mm)", 1000], ["UzBase", "asiento máx losa inf. (mm)", 1000]]) {
  p(`| ${nom} | ${(eh[k] * f).toFixed(4)} | ${envs.map((e) => `${(e[k] * f).toFixed(4)} (${((e[k] - eh[k]) / Math.abs(eh[k]) * 100).toFixed(4)} %)`).join(" | ")} |`);
}
// ── La envolvente que ENSEÑA LA APP, rehecha con las respuestas unitarias de cada programa ──
// Código escrito aparte (no usa shared/cargaMovil.ts): camión HL-93 con todas las separaciones
// traseras, cada una recorriendo su propio largo, y el carril sumado solo donde empeora.
function envolventeIndependiente(D) {
  const V = M.vehiculo, s = M.camino.s, nS = s.length, L = s[nS - 1] - s[0];
  const ilU = M.casosIL.map((c) => D[c.nombre].U.map((u) => u[1]));
  const ilF = M.casosIL.map((c) => D[c.nombre].F);
  const nN = M.nudos.length, nE = M.barras.length;
  const mk = (v) => ({ Fmax: new Float64Array(nE * 6).fill(v), Fmin: new Float64Array(nE * 6).fill(-v), Umin: new Float64Array(nN).fill(-v) });
  const E = mk(-Infinity);
  const f = (1 + (V.IM || 0) / 100) / (V.ancho || 1);
  let nPos = 0;
  for (const sep of V.sepTraseras) {
    const ejes = [[0, V.ejesKN[0] * f], [V.sepDelantera, V.ejesKN[1] * f], [V.sepDelantera + sep, V.ejesKN[2] * f]];
    const fin = L + V.sepDelantera + sep, n = Math.max(1, Math.round(fin / V.paso));
    for (let i = 0; i <= n; i++) {
      const xF = +(i * fin / n).toFixed(9);
      const w = new Float64Array(nS);
      for (const [d, P] of ejes) {
        const x = xF - d; if (x < s[0] - 1e-6 || x > s[nS - 1] + 1e-6) continue;
        let k = 0; while (k < nS - 1 && s[k + 1] <= x + 1e-9) k++;
        if (Math.abs(x - s[k]) < 1e-6) w[k] += P; else { const r = (x - s[k]) / (s[k + 1] - s[k]); w[k] += P * (1 - r); w[k + 1] += P * r; }
      }
      const U = new Float64Array(nN), F = new Float64Array(nE * 6);
      w.forEach((wk, k) => { if (!wk) return; for (let a = 0; a < nN; a++) U[a] += wk * ilU[k][a]; ilF[k].forEach((fe, e) => { for (let c = 0; c < 6; c++) F[e * 6 + c] += wk * fe[c]; }); });
      for (let a = 0; a < nN; a++) E.Umin[a] = Math.min(E.Umin[a], U[a]);
      for (let q = 0; q < nE * 6; q++) { E.Fmax[q] = Math.max(E.Fmax[q], F[q]); E.Fmin[q] = Math.min(E.Fmin[q], F[q]); }
      nPos++;
    }
  }
  const camion = { Fmax: E.Fmax.slice(), Fmin: E.Fmin.slice(), Umin: E.Umin.slice() };
  const wl = (V.carril || 0) / (V.ancho || 1);
  if (wl > 0) s.forEach((_, k) => {
    const q = wl * ((k > 0 ? s[k] - s[k - 1] : 0) + (k < nS - 1 ? s[k + 1] - s[k] : 0)) / 2;
    for (let a = 0; a < nN; a++) { const r = q * ilU[k][a]; if (r < 0) E.Umin[a] += r; }
    ilF[k].forEach((fe, e) => { for (let c = 0; c < 6; c++) { const r = q * fe[c]; if (r > 0) E.Fmax[e * 6 + c] += r; else E.Fmin[e * 6 + c] += r; } });
  });
  return { nPos, camion, total: E };
}
const HKE = existsSync(join(AQUI, `hekatan_${cual}_env.json`)) ? lee(`hekatan_${cual}_env.json`) : null;
if (HKE && M.casosIL) {
  const res = (E, uz) => {   // Uz de la app viene con 6 GDL por nudo
    let mx = -Infinity, mn = Infinity, u = 0;
    for (let e = 0; e < M.barras.length; e++) for (const k of [4, 5]) { mx = Math.max(mx, E.Fmax[e * 6 + k]); mn = Math.min(mn, E.Fmin[e * 6 + k]); }
    for (let a = 0; a < M.nudos.length; a++) u = Math.min(u, uz(E, a));
    return { mx, mn, u };
  };
  const uzApp = (E, a) => E.Umin[a * 6 + 2], uzInd = (E, a) => E.Umin[a];
  p(`
## La envolvente QUE ENSEÑA LA APP (${HKE.nPosiciones} posiciones: separación trasera ${M.vehiculo.sepTraseras[0]}–${M.vehiculo.sepTraseras.at(-1)} m, cada una recorriendo su largo)
`);
  p(`Los programas resuelven ${M.casosIL.length} casos UNITARIOS (1 kN en cada nudo del tablero); la envolvente se rehace con código aparte (no el de la app) y se compara componente a componente con la de la app.
`);
  for (const [nomP, D] of programas) {
    if (!D[M.casosIL[0].nombre]) continue;
    const ind = envolventeIndependiente(D);
    // referencia del test: la envolvente del programa (arrays completos, redondeados)
    const r10 = (a) => Array.from(a, (v) => +v.toPrecision(10));
    const clave = /SAP/.test(nomP) ? "sap2000" : "opensees";
    writeFileSync(join(AQUI, "..", "..", "tests", "datos", `alcantarilla_${clave}_env.json`), JSON.stringify({ programa: nomP, cual, nPos: ind.nPos,
      camion: { Fmax: r10(ind.camion.Fmax), Fmin: r10(ind.camion.Fmin), Umin: r10(ind.camion.Umin) },
      total: { Fmax: r10(ind.total.Fmax), Fmin: r10(ind.total.Fmin), Umin: r10(ind.total.Umin) } }));
    p(`### ${nomP} (${ind.nPos} posiciones)
`);
    p(`| envolvente | valor | Hekatan (app) | ${nomP} | dif |`);
    p(`|---|---|---|---|---|`);
    for (const [tit, a, b] of [["① camión solo", HKE.camion, ind.camion], ["② camión + carril (la del dibujo)", HKE.total, ind.total]]) {
      const ra = res(a, uzApp), rb = res(b, uzInd);
      for (const [k, nom, fac] of [["mx", "M3 máx (kN·m)", 1], ["mn", "M3 mín (kN·m)", 1], ["u", "Uz mín (mm)", 1000]])
        p(`| ${tit} | ${nom} | ${(ra[k] * fac).toFixed(4)} | ${(rb[k] * fac).toFixed(4)} | ${(Math.abs(ra[k] - rb[k]) / Math.abs(ra[k]) * 100).toFixed(4)} % |`);
      let dm = 0, pk = 0;
      for (let q = 0; q < a.Fmax.length; q++) { pk = Math.max(pk, Math.abs(a.Fmax[q]), Math.abs(a.Fmin[q])); dm = Math.max(dm, Math.abs(a.Fmax[q] - b.Fmax[q]), Math.abs(a.Fmin[q] - b.Fmin[q])); }
      p(`| ${tit} | peor componente P/V2/M3 (${M.barras.length} barras × 2 extremos) | | | ${(dm / pk * 100).toFixed(4)} % |`);
    }
    p("");
  }
}
writeFileSync(join(AQUI, `COMPARACION_${cual}.md`), L.join("\n") + "\n");
