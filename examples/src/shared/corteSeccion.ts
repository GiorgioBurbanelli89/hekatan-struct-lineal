/**
 * CORTE DE SECCIÓN (1-oct-2026), el «Section Cut» de SAP2000 / ETABS: de los esfuerzos por metro de las cáscaras
 * (tonf·m/m, tonf/m) a la fuerza y el momento TOTALES que atraviesan un plano (tonf, tonf·m).
 *
 * Por equilibrio, igual que CSI (suma de las fuerzas de los elementos sobre los nudos de un lado del corte): los nudos
 * del lado «+» del plano están en equilibrio, así que lo que les transmiten los elementos que cruzan el corte es
 * MENOS la suma de todo lo externo que actúa sobre ellos (cargas nodales, reacciones de apoyo, fuerzas de muelle).
 * Se reporta la fuerza que el lado «+» ejerce sobre el lado «−» (= Σ externo del lado «+»), reducida al centro del corte.
 * Con «por metro» se divide entre la longitud del corte: es la MEDIA de F22 / M22 / V23 a lo largo de la línea.
 */
export type Corte = {
  eje: 0 | 1 | 2; pos: number;
  F: [number, number, number]; M: [number, number, number];     // global, en el punto P
  P: [number, number, number]; L: number;                       // centro y longitud del corte
  nudosLado: number; elementosCortados: number;
  desequilibrio: number;   // |Σ externo de TODO el modelo| / máx(|externo|): si no es ~0 faltan cargas (p. ej. internas del solver)
};

export function corteDeSeccion(nodes: number[][], elements: number[][], loads: Map<number, number[]> | undefined,
  reactions: Map<number, number[]> | undefined, supports: Map<number, boolean[]> | undefined,
  springs: Array<{ node: number; dof: number; k: number }> | undefined, U: Map<number, number[]> | undefined,
  eje: 0 | 1 | 2, pos: number): Corte {
  const ext = new Map<number, number[]>();
  const add = (n: number, f: number[]) => { const a = ext.get(n) ?? [0, 0, 0, 0, 0, 0]; for (let c = 0; c < 6; c++) a[c] += f[c] ?? 0; ext.set(n, a); };
  loads?.forEach((f, n) => add(n, f));
  reactions?.forEach((r, n) => { if (!supports || supports.has(n)) add(n, r); });
  for (const s of springs ?? []) if (s.node >= 0) { const f = [0, 0, 0, 0, 0, 0]; f[s.dof] = -s.k * (U?.get(s.node)?.[s.dof] ?? 0); add(s.node, f); }
  // centro y longitud: los segmentos donde el plano corta a cada cáscara
  let Lt = 0; const Pm = [0, 0, 0]; let cortados = 0;
  for (const e of elements) {
    if (e.length !== 3 && e.length !== 4) continue;
    const pts: number[][] = [];
    for (let i = 0; i < e.length; i++) {
      const a = nodes[e[i]], b = nodes[e[(i + 1) % e.length]], da = a[eje] - pos, db = b[eje] - pos;
      if (da * db < 0) { const t = da / (da - db); pts.push([0, 1, 2].map((c) => a[c] + t * (b[c] - a[c]))); }
    }
    if (pts.length >= 2) {
      const l = Math.hypot(pts[1][0] - pts[0][0], pts[1][1] - pts[0][1], pts[1][2] - pts[0][2]);
      Lt += l; cortados++; for (let c = 0; c < 3; c++) Pm[c] += l * (pts[0][c] + pts[1][c]) / 2;
    }
  }
  const P = (Lt > 0 ? Pm.map((v) => v / Lt) : [0, 0, 0]) as [number, number, number];
  P[eje] = pos;
  const F: [number, number, number] = [0, 0, 0], M: [number, number, number] = [0, 0, 0];
  let nl = 0; const tot = [0, 0, 0]; let mx = 0;
  ext.forEach((f, n) => {
    for (let c = 0; c < 3; c++) { tot[c] += f[c]; mx = Math.max(mx, Math.abs(f[c])); }
    if (nodes[n][eje] <= pos) return;
    nl++;
    const r = [0, 1, 2].map((c) => nodes[n][c] - P[c]);
    for (let c = 0; c < 3; c++) F[c] += f[c];
    M[0] += f[3] + r[1] * f[2] - r[2] * f[1];
    M[1] += f[4] + r[2] * f[0] - r[0] * f[2];
    M[2] += f[5] + r[0] * f[1] - r[1] * f[0];
  });
  return { eje, pos, F, M, P, L: Lt, nudosLado: nl, elementosCortados: cortados, desequilibrio: Math.hypot(tot[0], tot[1], tot[2]) / (mx || 1) };
}
