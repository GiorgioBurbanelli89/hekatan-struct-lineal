/**
 * El DIAGRAMA de una barra como lo dibuja ETABS: con sus ejes, su signo y su lado.
 *
 * Lo usan el 3D (`frameResults.ts`), la vista 2D y el gráfico de la barra
 * (`diagram2d.ts`), para que los tres digan lo mismo que ETABS.
 *
 * ── Por qué existe (11-sep-2026) ────────────────────────────────────────────────
 * Grabando un tutorial, un pórtico plano visto DE FRENTE no enseñaba su momento: el 3D
 * dibujaba V2 y M3 en horizontal, fuera del plano del pórtico. Era la tríada VIEJA de
 * awatif (`getTransformationMatrixBeam`: eje y horizontal, z hacia arriba), que se
 * quedó en el visor cuando el cálculo pasó a los ejes de CSI (eje 2 hacia arriba). Y
 * el momento salía con el signo contrario al de ETABS: en un pórtico con carga de
 * gravedad marcaba +16 en los extremos de la viga y −21 en el centro; ETABS da −16
 * (negativo, arriba) y +21 (positivo, abajo).
 *
 * ── Lo que dice cada función ────────────────────────────────────────────────────
 * ejesCSI       los ejes 1-2-3 de CSI, con el `ang` — copia de
 *               `hekatan-fem/src/utils/getTransformationMatrix.ts` (y del .cpp).
 * diagramaCSI   el valor en el nudo i y en el j. `analyze()` da FUERZAS DE EXTREMO
 *               (f = k·u): en el nudo i el diagrama es −r0 y en el j es +r1; y M2
 *               lleva además el signo cambiado (CSI dibuja M2 y M3 «positivo =
 *               sagging» en su plano). Es la misma conversión que
 *               `tests/lib/comparar.mjs`, la que cuadra con ETABS barra a barra.
 * ladoPositivo  hacia dónde se pinta un valor POSITIVO. Cortante y axil, hacia +2
 *               (o +3 si es del plano 1-3). El momento, del lado que TRACCIONA: un
 *               M3 positivo tracciona la cara −2 y un M2 positivo la −3, así que el
 *               positivo va hacia −2 / −3 — en una viga, abajo, donde va el hierro.
 */
type V3 = [number, number, number];

export function ejesCSI(a: number[], b: number[], angGrados = 0): { e1: V3; e2: V3; e3: V3 } {
  const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const L = Math.hypot(d[0], d[1], d[2]) || 1;
  const l = d[0] / L, m = d[1] / L, n = d[2] / L;
  const D = Math.sqrt(l * l + m * m);
  let e1: V3, e2: V3, e3: V3;
  if (D < 1e-9) {
    // vertical: no hay plano vertical que la contenga; CSI fija el eje 2 en +X
    const s = n > 0 ? 1 : -1;
    e1 = [0, 0, s]; e2 = [1, 0, 0]; e3 = [0, s, 0];
  } else {
    e1 = [l, m, n];
    e2 = [(-l * n) / D, (-m * n) / D, D];
    e3 = [m / D, -l / D, 0];
  }
  if (Math.abs(angGrados) > 1e-12) {
    const t = (angGrados * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t);
    const g2 = e2.map((x, k) => c * x + s * e3[k]) as V3;
    const g3 = e3.map((x, k) => -s * e2[k] + c * x) as V3;
    e2 = g2; e3 = g3;
  }
  return { e1, e2, e3 };
}

/** [valor en el nudo i, valor en el nudo j], con el signo de ETABS. */
export function diagramaCSI(clave: string, r: ArrayLike<number> | null | undefined): [number, number] {
  if (!r) return [0, 0];
  const r0 = Number(r[0] ?? 0), r1 = Number(r[1] ?? 0);
  return clave === "bendingsY" ? [r0, -r1] : [-r0, r1];
}

/** Dirección (global) hacia la que se dibuja un valor positivo de ese resultado. */
export function ladoPositivo(clave: string, ejes: { e2: V3; e3: V3 }): V3 {
  const neg = (v: V3) => v.map((x) => -x) as V3;
  switch (clave) {
    case "bendingsZ": return neg(ejes.e2);     // M3 +: tracción en la cara −2
    case "bendingsY": return neg(ejes.e3);     // M2 +: tracción en la cara −3
    case "shearsZ": return ejes.e3;            // V3, en su plano 1-3
    default: return ejes.e2;                   // P, T, V2: en el plano 1-2
  }
}
