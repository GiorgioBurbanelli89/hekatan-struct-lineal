/**
 * GALPÓN CURVO PARAMÉTRICO — la cercha de pórticos en arco, generada desde unos pocos números.
 *
 * Jorge, 2-nov-2026: «Deja la cercha parametrizada». El galpón se dibujó a mano con ratón (arco 2 puntos + altura,
 * copiar, correas, diagonales, cubierta, zapatas); esto es lo mismo como FUNCIÓN: cambia un número y se regenera.
 *
 * Escribe en el MISMO estado del CAD (puntos, polilíneas, áreas y las propiedades «manuales» por barra/área), así que
 * lo generado se sigue editando con todas las herramientas, y `new-blank` lo resuelve igual que algo dibujado.
 *
 *  Geometría (m):  luz L entre ejes de columnas, flecha f (altura del arco sobre su cuerda), altura de columna hCol,
 *                  arco circular por (−L/2, 0), (0, f), (L/2, 0) partido en nSeg tramos; nPorticos a `sep` m.
 *  Barras:         columnas, arco, correas (une cada nudo del arco con el del pórtico vecino), diagonales en cruz
 *                  (cada N vanos), todo en TUBO CIRCULAR D×t de acero A53 Gr.B.
 *  Áreas:          cubierta (un paño por tramo de arco y vano, membrana de lámina) y zapatas cuadradas bajo columnas.
 */
export interface GalponCurvoParams {
  luz: number; flecha: number; hCol: number; nSeg: number; nPorticos: number; sep: number;
  Dcol: number; tcol: number; Darco: number; tarco: number;          // tubos en mm
  correas: boolean; Dcorr: number; tcorr: number;
  diagCadaN: number; Ddiag: number; tdiag: number;                  // 0 = sin diagonales; 1 = en todos los vanos; 2 = vano sí/vano no…
  cubierta: boolean; tLamina: number;                                // espesor en m
  zapataLado: number; zapataEsp: number; ksSuelo: number;           // zapataLado 0 = sin zapatas; ks en tonf/m³ (0 = sin suelo)
  empotrado: boolean;                                                // sin zapatas: apoyo en la base de cada columna
  qArco: number;                                                     // kN/m sobre cada tramo de arco (negativa = hacia abajo)
}

export const GALPON_CURVO_DEFECTO: GalponCurvoParams = {
  luz: 24, flecha: 6, hCol: 3, nSeg: 12, nPorticos: 3, sep: 6,
  Dcol: 168.3, tcol: 5, Darco: 168.3, tarco: 5,
  correas: true, Dcorr: 88.9, tcorr: 3.2,
  diagCadaN: 1, Ddiag: 60.3, tdiag: 3,
  cubierta: true, tLamina: 0.0005,
  zapataLado: 2, zapataEsp: 0.5, ksSuelo: 2000,
  empotrado: false, qArco: -2,
};

/** Resumen de lo que se generó (para el aviso y para los tests). */
export interface ResumenGalpon { nudos: number; barras: number; paños: number; zapatas: number; porticos: number }

/** Los nudos del arco en el plano del pórtico: (x, z) con z medido desde la cota de arranque. Circular por 3 puntos. */
export function puntosArco(luz: number, flecha: number, nSeg: number): Array<[number, number]> {
  const n = Math.max(2, Math.round(nSeg)), h = Math.abs(flecha), a = luz / 2;
  if (h < 1e-6) return Array.from({ length: n + 1 }, (_, j) => [-a + (luz * j) / n, 0] as [number, number]);
  const R = (a * a + h * h) / (2 * h), z0 = h - R, th0 = Math.asin(Math.min(1, a / R));
  // flecha mayor que la semiluz: el arco pasa de la semicircunferencia (ángulo > 90°)
  const t0 = h > a ? Math.PI - Math.asin(Math.min(1, a / R)) : th0;
  return Array.from({ length: n + 1 }, (_, j) => {
    const th = -t0 + (2 * t0 * j) / n;
    return [R * Math.sin(th), z0 + R * Math.cos(th)] as [number, number];
  });
}

export function generarGalponCurvo(pIn: Partial<GalponCurvoParams> = {}): ResumenGalpon {
  const W = window as any;
  const P: GalponCurvoParams = { ...GALPON_CURVO_DEFECTO, ...pIn };
  const nSeg = Math.max(2, Math.round(P.nSeg)), nP = Math.max(1, Math.round(P.nPorticos));
  const arco = puntosArco(P.luz, P.flecha, nSeg);

  const pts: number[][] = [], polys: number[][] = [], areas: number[] = [];
  const idx = { colI: [] as number[], arco: [] as number[], colD: [] as number[], base: [] as number[][] };
  const sec = new Map<string, any>(), mat = new Map<string, string>(), dist = new Map<string, [number, number, number]>();
  const areaProp = new Map<number, { thickness?: number; material?: string; shellType?: string }>();
  const chs = (D: number, t: number) => W.__hekatanChsProps?.(`CHS ${D}x${t}`);
  const MAT = "A53Gr.B";
  const marca = (pi: number, s: number, D: number, t: number) => { const c = chs(D, t); if (c) sec.set(`${pi}:${s}`, c); mat.set(`${pi}:${s}`, MAT); };

  // ── pórticos: columna izquierda, arco, columna derecha ──
  const A: number[][] = [];                                   // A[k][j] = índice del nudo j del arco del pórtico k
  const B: Array<[number, number]> = [];                      // bases (izq, der)
  for (let k = 0; k < nP; k++) {
    const y = k * P.sep;
    const bi = pts.push([-P.luz / 2, y, 0]) - 1;
    const fila = arco.map(([x, z]) => pts.push([x, y, P.hCol + z]) - 1);
    const bd = pts.push([P.luz / 2, y, 0]) - 1;
    A.push(fila); B.push([bi, bd]);
    let pi = polys.push([bi, fila[0]]) - 1; marca(pi, 0, P.Dcol, P.tcol);
    pi = polys.push([...fila]) - 1; for (let s = 0; s < nSeg; s++) { marca(pi, s, P.Darco, P.tarco); if (P.qArco) dist.set(`${pi}:${s}`, [0, 0, P.qArco]); }
    pi = polys.push([fila[nSeg], bd]) - 1; marca(pi, 0, P.Dcol, P.tcol);
  }
  // ── correas y diagonales entre pórticos vecinos ──
  for (let k = 0; k + 1 < nP; k++) {
    if (P.correas) for (let j = 0; j <= nSeg; j++) { const pi = polys.push([A[k][j], A[k + 1][j]]) - 1; marca(pi, 0, P.Dcorr, P.tcorr); }
    const cada = Math.round(P.diagCadaN);
    if (cada > 0 && k % cada === 0) for (let j = 0; j < nSeg; j++) {
      for (const [a, b] of [[A[k][j], A[k + 1][j + 1]], [A[k][j + 1], A[k + 1][j]]]) { const pi = polys.push([a, b]) - 1; marca(pi, 0, P.Ddiag, P.tdiag); }
    }
    if (P.cubierta) for (let j = 0; j < nSeg; j++) {
      const q = [A[k][j], A[k][j + 1], A[k + 1][j + 1], A[k + 1][j]];
      const pi = polys.push([...q, q[0]]) - 1; areas.push(pi);
      areaProp.set(pi, { thickness: P.tLamina, material: "A36", shellType: "Plane stress" });
    }
  }
  // ── zapatas cuadradas bajo cada base ──
  let zapatas = 0;
  const sup = new Map<number, boolean[]>();
  for (const [bi, bd] of B) for (const nb of [bi, bd]) {
    if (P.zapataLado > 0) {
      const [x, y, z] = pts[nb], h = P.zapataLado / 2;
      const q = [[x - h, y - h, z], [x + h, y - h, z], [x + h, y + h, z], [x - h, y + h, z]].map((c) => pts.push(c) - 1);
      const pi = polys.push([...q, q[0]]) - 1; areas.push(pi); zapatas++;
      areaProp.set(pi, { thickness: P.zapataEsp, material: "C25/30", shellType: "Mindlin (FSDT)" });
    } else {
      sup.set(nb, P.empotrado ? [true, true, true, true, true, true] : [true, true, true, false, false, false]);
    }
  }
  polys.push([]);

  // ── escribir en el estado del CAD (reemplaza el dibujo) ──
  const lim = (m: any) => { try { m?.clear?.(); } catch { /* sin mapa */ } };
  for (const m of ["__hekatanManualSections", "__hekatanManualMaterial", "__hekatanManualDistLoads", "__hekatanManualArea",
    "__hekatanManualSupports", "__hekatanManualLoads", "__hekatanManualModifiers", "__hekatanManualReleases"]) lim(W[m]);
  for (const [k, v] of sec) W.__hekatanManualSections?.set(k, v);
  for (const [k, v] of mat) W.__hekatanManualMaterial?.set(k, v);
  for (const [k, v] of dist) W.__hekatanManualDistLoads?.set(k, v);
  for (const [k, v] of areaProp) { if (!W.__hekatanManualArea) W.__hekatanManualArea = new Map(); W.__hekatanManualArea.set(k, v); }
  for (const [k, v] of sup) W.__hekatanManualSupports?.set(k, v);
  W.__hekatanDrawingPoints.val = pts;
  W.__hekatanDrawingPolylines.val = polys;
  W.__hekatanDrawingAreas.val = areas;
  // suelo y apoyo automático: con zapatas el suelo las sostiene; sin ellas, los apoyos manuales de arriba
  W.__hekatanSetParam?.("apoyo", 3);
  W.__hekatanSetParam?.("mallaZapata", P.zapataLado > 0 ? 2 : 1);
  W.__hekatanSetParam?.("ksSuelo", P.zapataLado > 0 ? P.ksSuelo : 0);
  try { const el = [...document.querySelectorAll("*")].find((e: any) => e.__settings && e.__ctx) as any; if (el?.__settings?.loads) el.__settings.loads.val = true; } catch { /* sin visor */ }
  try { W.__hekatanRebuild?.(); } catch { /* sin rebuild */ }
  W.__hekatanGalponParams = P;
  const barras = polys.filter((pl, i) => pl.length > 1 && !areas.includes(i)).reduce((s, pl) => s + pl.length - 1, 0);
  return { nudos: pts.length, barras, paños: areas.length, zapatas, porticos: nP };
}
