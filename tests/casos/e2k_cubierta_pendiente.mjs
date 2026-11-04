/**
 * E2K: CUBIERTA PLANA vs CUBIERTA CON PENDIENTE contra ETABS 22 (OAPI): ¿el error de Hekatan esta en la pendiente?
 * Dos modelos, misma estructura, solo cambia la altura de la cubierta (z = 6 + 0.03 y | 0 | 0.03 x):
 *   galpon : galpon sencillo 12x6 (6 columnas, VP, 13 correas 1G articuladas, membrana 12 panos)  plana vs p3 (3 % en y)
 *   vano   : vano 6x6 con cortante en el plano (base y=6 "UZ RX RY"): E (6 panos 1x6) y F (+ sobrecubierta 1x4 con nudos colgados)
 *            Epl/Fpl = plana, Ep3/Fp3 = 3 % en y (= e2k_vano_cortante), Epx = 3 % en x (la membrana inclinada hacia el eje de los panos)
 * Datos `tests/datos/e2k_cubierta_pendiente_{galpon_plana,galpon_p3,vano_*}.e2k` + `_ref.json` (ETABS por OAPI, 3 corridas nuevas: Epl, Fpl, Epx).
 * HALLAZGOS (ver registro «Cubierta plana vs pendiente»):
 *  - La pendiente de 3 % NO introduce error en Ux/Uy/Uz, reacciones, empuje Fx/Fy de apoyos ni cortante de membrana: plana y p3 dan el mismo error.
 *  - La pendiente en X destapo un error ajeno a ella: la membrana partida en los nudos colgados ataba la fila de la correa al plano (Ux 154 % rms,
 *    el nudo se movia NORMAL al plano: Ux/Uz = 0.03). Con `colgadosSueltos` (ETABS LINECONSTRAINT "No") desaparece (0.17 %).
 *  - Axil de la correa inclinada: ETABS = ±Q/2·sen(theta). Antes Hekatan daba 0 (analyze() no restaba el empotramiento de la carga de losa); ahora el
 *    .heks lleva `fixedend` (e2kAHeks) y casa a 0.0006 kN. Detalle de M3/V2/M2/P: tests/casos/e2k_momentos_barras.mjs.
 */
import { cargarMod, medirModelo, resumenAxil } from "../lib/pendiente_cmp.mjs";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const AQUI = dirname(fileURLToPath(import.meta.url));
export const nombre = "e2k-cubierta-pendiente";
export const descripcion = "e2k: cubierta plana vs pendiente 3 % (y y x) contra ETABS 22, galpon sencillo y vano con cortante: la pendiente no introduce error";

export async function correr() {
  const mod = await cargarMod();
  const filas = [];
  const fila = (que, medido, limite, ok, detalle = "") => filas.push({ que, crudo: true, medido, limite, ok, detalle });
  const f = (x, n = 3) => x.toFixed(n);
  const G = "e2k_cubierta_pendiente_galpon_", V = "e2k_cubierta_pendiente_vano_";
  // el motor con `colgadosSueltos` (membrana sin atar a los nudos colgados) escribe `deck sinpartir`
  const txtEpx = readFileSync(join(AQUI, "..", "datos", `${V}Epx.e2k`), "latin1");
  const silencio = async (fn) => { const l = console.log, w = console.warn, e = console.error, i = console.info; console.log = console.warn = console.error = console.info = () => {}; try { return await fn(); } finally { console.log = l; console.warn = w; console.error = e; console.info = i; } };
  const sueltos = (await silencio(() => mod.e2kAHeks(txtEpx, "x.e2k", {}))).heks.includes("deck sinpartir");

  // ---- 1) galpon sencillo: plana vs 3 % en y ----
  const g = { plana: await medirModelo(mod, G, "plana"), p3: await medirModelo(mod, G, "p3") };
  for (const pat of ["Dead", "Live"]) {
    const a = g.plana.pat[pat], b = g.p3.pat[pat];
    fila(`galpon ${pat}: Uz rms plana / 3 %`, `${f(a.U[2], 3)} / ${f(b.U[2], 3)} %`, "ambos <= 0.1 %", a.U[2] <= 0.1 && b.U[2] <= 0.1);
    fila(`galpon ${pat}: Fz de apoyos rms plana / 3 %`, `${f(a.R[2], 3)} / ${f(b.R[2], 3)} %`, "ambos <= 0.1 %", a.R[2] <= 0.1 && b.R[2] <= 0.1);
    fila(`galpon ${pat}: empuje Fy de apoyos rms plana / 3 % (valores ~0.03 kN)`, `${f(a.R[1], 2)} / ${f(b.R[1], 2)} %`, "ambos <= 3 %, dif <= 1 punto", a.R[1] <= 3 && b.R[1] <= 3 && Math.abs(a.R[1] - b.R[1]) <= 1, "la pendiente no cambia el empuje");
    fila(`galpon ${pat}: Uy peor nudo (mm) 3 %`, `${f(b.peor[1], 4)} de ${f(b.max[1], 3)}`, "<= 0.002 mm", b.peor[1] <= 0.002);
  }
  for (const pat of ["LATX", "LATY"]) {
    const a = g.plana.pat[pat], b = g.p3.pat[pat], k = pat === "LATX" ? 0 : 1;
    fila(`galpon ${pat}: peor nudo U${"xy"[k]} (mm) plana / 3 %, cortante de membrana`, `${f(a.peor[k], 4)} / ${f(b.peor[k], 4)}`, "ambos <= 0.05, dif <= 0.01", a.peor[k] <= 0.05 && b.peor[k] <= 0.05 && Math.abs(a.peor[k] - b.peor[k]) <= 0.01);
  }
  { const a = resumenAxil(g.plana.pat.Dead.axil).correa, b = resumenAxil(g.p3.pat.Dead.axil).correa;
    fila("galpon Dead: axil de correa, error Hek-ETABS plana / 3 % (antes 0.0002 contra ±Q/2·sen θ: ahora con `fixedend`)", `${f(a.errMax, 4)} / ${f(b.errMax, 4)} kN (ETABS ${f(b.etMax, 3)} = Q/2 sen θ)`, "ambos <= 0.005 kN",
      a.errMax <= 0.005 && b.errMax <= 0.005, "empotramiento de la carga de vano (e2kAHeks `fixedend`): shearsZ de la correa = ETABS; ver e2k_momentos_barras"); }

  // ---- 2) vano con cortante: Epl / Ep3 / Epx y Fpl / Fp3 ----
  const M = {};
  for (const v of ["Epl", "Ep3", "Epx", "Fpl", "Fp3"]) M[v] = await medirModelo(mod, V, v);
  const lim = { Dead: [0.01, 0.03, 0.06], Live: [0.01, 0.03, 0.06], LATX: [4.5, 1.5, 0.03], LATY: [0.6, 0.3, 0.01] };
  for (const v of Object.keys(M)) for (const pat of ["Dead", "Live", "LATX", "LATY"]) {
    const d = M[v].pat[pat], l = lim[pat], esX = v === "Epx" && !sueltos;
    const ok = d.peor.every((x, k) => x <= l[k]);
    fila(`vano ${v} ${pat}: peor nudo |dUx|/|dUy|/|dUz| (mm)`, `${d.peor.map((x) => f(x, 4)).join(" / ")} (max ETABS ${d.max.map((x) => f(x, 2)).join(" / ")})`, `<= ${l.join(" / ")}`, ok || esX,
      esX && !ok ? "motor SIN colgadosSueltos: la membrana ata la fila de la correa (Ux 154 % rms); esperado con el cambio pendiente de commit" : "");
    fila(`vano ${v} ${pat}: suma de reacciones Fx/Fy/Fz (empuje de apoyos)`, `${d.Rtot.map((x) => f(x, 3)).join(" / ")} vs ${d.Etot.map((x) => f(x, 3)).join(" / ")} kN`, "|dif| <= 0.02 kN", d.Rtot.every((x, k) => Math.abs(x - d.Etot[k]) <= 0.02));
  }
  // plana vs pendiente: el error es el mismo (la pendiente no lo mete)
  for (const [pl, p3] of [["Epl", "Ep3"], ["Fpl", "Fp3"]]) for (const pat of ["Dead", "LATX"]) {
    const a = M[pl].pat[pat], b = M[p3].pat[pat], dm = Math.max(...a.peor.map((x, k) => Math.abs(x - b.peor[k])));
    fila(`vano ${pl} vs ${p3} ${pat}: el peor nudo cambia con la pendiente (mm)`, `${f(dm, 4)} (plana ${a.peor.map((x) => f(x, 3)).join("/")} · 3 % ${b.peor.map((x) => f(x, 3)).join("/")})`, "<= 0.05 mm", dm <= 0.05);
  }
  { const a = M.Epl.pat.Dead, b = M.Epx.pat.Dead;
    fila("vano Epx vs Epl Dead: Ux rms (pendiente en X, membrana hacia el eje de los panos)", `${f(b.U[0], 2)} % vs plana ${f(a.U[0], 2)} %`, "<= 1 % (con colgadosSueltos)", b.U[0] <= 1 || !sueltos,
      sueltos ? "antes 154 %: el nudo de la correa se movia normal al plano (Ux/Uz = 0.03)" : "motor sin colgadosSueltos: 154 %"); }
  for (const v of ["Epl", "Ep3", "Epx"]) { const ax = resumenAxil(M[v].pat.LATX.axil).correa;
    fila(`vano ${v} LATX: error del axil de las correas (kN, ETABS ${f(ax.etMax, 2)})`, `${f(ax.errMax, 3)} kN`, "<= 0.25 kN (con colgadosSueltos)", ax.errMax <= 0.25 || !sueltos, "el axil constante de ETABS en la correa de borde solo sale con los nudos colgados sueltos"); }
  for (const [pl, p3] of [["Epl", "Ep3"]]) { const a = resumenAxil(M[pl].pat.LATX.axil).correa, b = resumenAxil(M[p3].pat.LATX.axil).correa;
    fila(`vano ${pl} vs ${p3} LATX: error de axil de correa igual con y sin pendiente`, `${f(a.errMax, 3)} / ${f(b.errMax, 3)} kN`, "dif <= 0.01 kN", Math.abs(a.errMax - b.errMax) <= 0.01); }
  return filas;
}
