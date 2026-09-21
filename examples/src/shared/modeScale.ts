/**
 * LA escala de la animación modal. Una sola, para los tres sitios que la usaban
 * con tres valores distintos.
 *
 * Hasta el 18-sep-2026 había tres, y además con DOS definiciones de "tamaño del
 * modelo":
 *
 *   · `getCad3d.ts`   5 %  del LADO MAYOR   (valor puesto a ojo)
 *   · `animateMode.ts` 3.7 % de la DIAGONAL (medido contra SAP2000)
 *   · `gifExport.ts`   6 %  de la DIAGONAL  (valor puesto a ojo)
 *
 * En un edificio de 20×15×30 m el MISMO modo salía 1.500 m en el CAD, 1.445 m
 * en el visor y 2.343 m en el GIF: el GIF era 1.62× el visor. Mirando dos
 * pantallas del mismo modelo no se veía lo mismo.
 *
 * Se queda el del visor porque es el único con oráculo: 3.7 % de la diagonal es
 * lo que hace SAP2000 con «Scaling: Automatic», medido cuadro a cuadro sobre SAP
 * corriendo (ver la nota larga en `animateMode.ts` y
 * `registros/2026-09-18_escala_velocidad_sap2000.md`).
 */
export const MODE_SCALE_SAP2000 = 3.7;
/** Jorge, 21-sep-2026: «y 10 % más de deformación visual, la escala». Igual que
 *  con la velocidad: el 3.7 % es lo MEDIDO contra SAP2000 y el factor va aparte. */
export const HK_ESCALA = 1.10;
export const MODE_SCALE_PERCENT = MODE_SCALE_SAP2000 * HK_ESCALA;        // 4.07 %

/**
 * El "tamaño del modelo" que acompaña a `MODE_SCALE_PERCENT`: la DIAGONAL de la
 * caja envolvente, no el lado mayor. La constante está medida contra esta
 * definición, así que usar el lado mayor con ese 3.7 % NO da la amplitud de
 * SAP2000.
 */
export function modelDiagonal(nodes: ArrayLike<ArrayLike<number>>): number {
  let xMin = Infinity, yMin = Infinity, zMin = Infinity;
  let xMax = -Infinity, yMax = -Infinity, zMax = -Infinity;
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    const x = n[0], y = n[1], z = n[2];
    if (x < xMin) xMin = x; if (x > xMax) xMax = x;
    if (y < yMin) yMin = y; if (y > yMax) yMax = y;
    if (z < zMin) zMin = z; if (z > zMax) zMax = z;
  }
  if (!isFinite(xMin)) return 1;
  const d = Math.sqrt((xMax - xMin) ** 2 + (yMax - yMin) ** 2 + (zMax - zMin) ** 2);
  return d > 1e-12 ? d : 1;
}
