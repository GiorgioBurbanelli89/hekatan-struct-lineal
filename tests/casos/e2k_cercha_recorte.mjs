/**
 * E2K: recorte de la CERCHA Tubo 50x3 del vano x 78.7-84.7 (y = 25 y 29, z ~ 11-12) del mercado, con sus vecinos
 * (ventana x 71.7..91.7, y 23..37: 479 barras, 40 paños de cubierta, 64 nudos de corte empotrados) contra ETABS 22 por OAPI,
 * Dead y Live. Datos: tests/datos/e2k_cercha.e2k + _ref.json (axiles de TODAS las barras, desplazamientos, reacciones);
 * script: C:\ETABS\mercado\galpon\hacer_cercha.py. Comparador: cli/cercha_cmp.mjs (+ cercha_top / cercha_off / cercha_reac).
 *
 * Reproduce el residuo del mercado completo (Uy 4-7 %): el cordon superior del vano recibe en Hekatan 1.0-1.6 kN y en ETABS 0.2-0.4.
 * Descartado con este recorte (4-nov-2026): reparto de la carga (GRAV, ANG, ONEWAYLOADDIST: cortante de las correas 1G 1.504 = 1.500,
 * reacciones por nudo de corte a 0.1 kN), malla de la membrana (ETABS la deja en UN Q4 por paño: AreaForceShell da 4 puntos),
 * brazos rigidos (cordones: 24.9/49.8 mm = Hekatan), modificadores (todos 1), ejes locales, punto de insercion 10/8.
 */
import { medirCercha } from "../../cli/cercha_cmp.mjs";
export const nombre = "e2k-cercha-recorte";
export const descripcion = "e2k: cercha Tubo 50x3 del vano x 78.7-84.7 recortada del mercado vs ETABS 22 (axiles de cordones/diagonales, Uz/Uy, cortante de correas)";

export async function correr() {
  const O = await medirCercha({});
  const filas = [];
  const fila = (que, medido, limite, ok, detalle = "") => filas.push({ que, crudo: true, medido, limite, ok, detalle });
  const f = (x, n = 3) => x.toFixed(n);
  const enVano = (b) => b.sec.startsWith("Tubo 50") && Math.abs(b.p1[1] - 29) < 1e-3 && Math.abs(b.p2[1] - 29) < 1e-3 && b.p1[0] > 78.6 && b.p2[0] > 78.6 && b.p1[0] < 85.8 && b.p2[0] < 85.8;
  for (const pat of ["Dead", "Live"]) {
    const { barras, nodos } = O[pat];
    fila(`${pat}: nudos de ETABS casados por coordenada`, nodos.length, "254 de 254", nodos.length === 254);
    const sq = [0, 0, 0], sr = [0, 0, 0];
    for (const n of nodos) for (let k = 0; k < 3; k++) { sq[k] += (n.h[k] - n.e[k]) ** 2; sr[k] += n.e[k] ** 2; }
    const rms = sq.map((v, k) => 100 * Math.sqrt(v / (sr[k] || 1e-30)));
    fila(`${pat}: Uz rms relativo`, `${f(rms[2], 2)} %`, "<= 2 %", rms[2] <= 2);
    // abierto: Ux/Uy rms (Ux sube de 6 % a 11 % por el mismo escalon de la cubierta); cota = lo medido + holgura
    fila(`${pat}: Uy rms relativo (abierto, mismo escalon del mercado completo)`, `${f(rms[1], 2)} %`, "<= 10 %", rms[1] <= 10);
    fila(`${pat}: Ux rms relativo (abierto)`, `${f(rms[0], 2)} %`, "<= 13 %", rms[0] <= 13);
    const err = (lista) => lista.reduce((m, b) => Math.max(m, Math.abs(b.hJ - b.eJ)), 0);
    const inf = barras.filter((b) => enVano(b) && b.p1[2] < 11.5 && b.p2[2] < 11.5);
    const dia = barras.filter((b) => enVano(b) && Math.abs(b.p2[2] - b.p1[2]) > 0.3);
    fila(`${pat}: cordon INFERIOR (${inf.length} barras) error maximo de axil`, `${f(err(inf))} kN (pico ETABS ${f(Math.max(...inf.map((b) => Math.abs(b.eJ))), 2)})`, "<= 0.2 kN", inf.length >= 6 && err(inf) <= 0.2);
    fila(`${pat}: diagonales y montantes (${dia.length} barras) error maximo de axil`, `${f(err(dia))} kN (pico ETABS ${f(Math.max(...dia.map((b) => Math.abs(b.eJ))), 2)})`, "<= 0.2 kN", dia.length >= 10 && err(dia) <= 0.2);
    // cortante de las correas 1G de la cubierta (carga repartida igual: GRAV, ANG 0, una direccion)
    const g1 = barras.filter((b) => b.sec.startsWith("SOBRE CUBIERTA") && b.eV > 0.1);
    const eg = g1.reduce((m, b) => Math.max(m, Math.abs(b.vh - b.eV) / b.eV), 0);
    fila(`${pat}: cortante de las correas 1G de la cubierta (${g1.length}) error maximo relativo`, `${f(100 * eg, 2)} %`, "<= 1.5 %", g1.length >= 7 && eg <= 0.015, "mismo reparto de la losa a cada barra");
    // ABIERTO: el cordon superior (y = 29, z ~ 12) lo carga la cubierta (membrana A36 4 mm) como ala comprimida.
    const sup = barras.filter((b) => enVano(b) && b.p1[2] > 11.8 && b.p2[2] > 11.8).sort((a, c) => a.p1[0] - c.p1[0]);
    const eMax = Math.max(...sup.map((b) => Math.abs(b.eJ))), hMax = Math.max(...sup.map((b) => Math.abs(b.hJ)));
    fila(`${pat}: cordon SUPERIOR (${sup.length} barras) axil maximo ETABS / Hekatan (documenta, abierto)`, `${f(eMax, 2)} / ${f(hMax, 2)} kN`,
      "ETABS <= 0.5 kN; Hekatan entre 0.9 y 1.8 kN", eMax <= 0.5 && hMax >= 0.9 && hMax <= 1.8,
      "la cubierta en ETABS toma el 94 % de la compresion del ala, en Hekatan el 75 %; el cordon inferior y la flecha casan");
  }
  return filas;
}
