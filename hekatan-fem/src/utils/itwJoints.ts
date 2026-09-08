/**
 * Fuerzas de MEMBRANA (F11, F22, F12 por unidad de ancho) en los 4 joints de un Q4
 * con la membrana ITW (Ibrahimbegović, Taylor & Wilson 1990) tal como la arma
 * `getMembraneITW` (shellQ4.cpp): Allman por los lados + burbuja (1−r²)(1−s²) con
 * dos gdl internos condensados, proyección FEAP del drilling (B-barra del giro),
 * penalización P en el centro con γ = gammaFac·μ y reloj de arena del θz.
 *
 * Recuperación: la deformación se evalúa en Gauss 2×2 con la B de Allman proyectada
 * (SIN la burbuja: así clava los joints de CSI, ver abajo) y se extrapola
 * bilinealmente a las esquinas, como en el DKQ.
 * Tipo 12 (el defecto, la membrana de CSI): ng = 2, proyección, khg = 2e-4.
 * Tipo 3 (ITW 1990): ng = 3, sin proyección, sin reloj. Otros: null.
 *
 * GDL por nudo [u, v, θz] en ejes locales del elemento (los mismos que xl, yl).
 */
function shapeQ4(xi: number, eta: number) {
  return {
    N: [0.25 * (1 - xi) * (1 - eta), 0.25 * (1 + xi) * (1 - eta), 0.25 * (1 + xi) * (1 + eta), 0.25 * (1 - xi) * (1 + eta)],
    dNxi: [-0.25 * (1 - eta), 0.25 * (1 - eta), 0.25 * (1 + eta), -0.25 * (1 + eta)],
    dNeta: [-0.25 * (1 - xi), -0.25 * (1 + xi), 0.25 * (1 + xi), 0.25 * (1 - xi)],
  };
}
function jac(xl: number[], yl: number[], dNxi: number[], dNeta: number[]) {
  let J00 = 0, J01 = 0, J10 = 0, J11 = 0;
  for (let i = 0; i < 4; i++) { J00 += dNxi[i] * xl[i]; J01 += dNxi[i] * yl[i]; J10 += dNeta[i] * xl[i]; J11 += dNeta[i] * yl[i]; }
  let det = J00 * J11 - J01 * J10; if (Math.abs(det) < 1e-15) det = 1e-15;
  const inv = 1 / det;
  return { det, Ji: [[J11 * inv, -J01 * inv], [-J10 * inv, J00 * inv]] };
}

export function itwJointForces(
  xl: number[], yl: number[], u12: number[], E: number, nu: number, t: number,
  opts: { tipo?: number; gammaFac?: number; mod?: number[] | null } = {}
): number[][] | null {
  const tipo = opts.tipo ?? 12, gammaFac = opts.gammaFac ?? 0.4, mod = opts.mod ?? null;
  let ng: number, proy: boolean, khg: number;
  if (tipo === 12) { ng = 2; proy = true; khg = 2e-4; }
  else if (tipo === 3) { ng = 3; proy = false; khg = 0; }
  else return null;
  const f = E / (1 - nu * nu);
  const Dm = [[f, f * nu, 0], [f * nu, f, 0], [0, 0, (f * (1 - nu)) / 2]];
  if (mod) {
    const f11 = mod[0], f22 = mod[1], f12 = mod[2];
    Dm[0][0] *= f11; Dm[1][1] *= f22; Dm[2][2] *= f12;
    const c = Math.sqrt(Math.max(0, f11 * f22)); Dm[0][1] *= c; Dm[1][0] *= c;
  }
  for (const r of Dm) for (let c = 0; c < 3; c++) r[c] *= t;
  const sig = [1, 2, 3, 0], ant = [3, 0, 1, 2];
  const cx: number[] = [], cy: number[] = [];
  for (let i = 0; i < 4; i++) { cx.push((yl[sig[i]] - yl[i]) / 8); cy.push(-(xl[sig[i]] - xl[i]) / 8); }
  const GP2 = 0.5773502691896258;
  const g3 = [-0.7745966692414834, 0, 0.7745966692414834], w3 = [5 / 9, 8 / 9, 5 / 9];
  const gg = ng === 2 ? [-GP2, GP2] : g3, wg = ng === 2 ? [1, 1] : w3;
  const q: { r: number; s: number; w: number }[] = [];
  for (let a = 0; a < ng; a++) for (let b = 0; b < ng; b++) q.push({ r: gg[a], s: gg[b], w: wg[a] * wg[b] });

  // derivadas cartesianas de las 4 bilineales, las 4 serendipity de lado y la burbuja en (r,s)
  const deriv = (r: number, s: number) => {
    const { N, dNxi, dNeta } = shapeQ4(r, s);
    const { det, Ji } = jac(xl, yl, dNxi, dNeta);
    const dNx: number[] = [], dNy: number[] = [];
    for (let i = 0; i < 4; i++) { dNx.push(Ji[0][0] * dNxi[i] + Ji[0][1] * dNeta[i]); dNy.push(Ji[1][0] * dNxi[i] + Ji[1][1] * dNeta[i]); }
    const nsr = [-r * (1 - s), 0.5 * (1 - s * s), -r * (1 + s), -0.5 * (1 - s * s)];
    const nss = [-0.5 * (1 - r * r), -s * (1 + r), 0.5 * (1 - r * r), -s * (1 - r)];
    const NSx: number[] = [], NSy: number[] = [];
    for (let i = 0; i < 4; i++) { NSx.push(Ji[0][0] * nsr[i] + Ji[0][1] * nss[i]); NSy.push(Ji[1][0] * nsr[i] + Ji[1][1] * nss[i]); }
    const nbr = -2 * r * (1 - s * s), nbs = -2 * s * (1 - r * r);
    const dNBx = Ji[0][0] * nbr + Ji[0][1] * nbs, dNBy = Ji[1][0] * nbr + Ji[1][1] * nbs;
    const gt1: number[] = [], gt2: number[] = [], gt3: number[] = [], gt4: number[] = [];
    for (let i = 0; i < 4; i++) {
      const p = ant[i];
      gt1.push(NSx[p] * cx[p] - NSx[i] * cx[i]); gt2.push(NSy[p] * cx[p] - NSy[i] * cx[i]);
      gt3.push(NSx[p] * cy[p] - NSx[i] * cy[i]); gt4.push(NSy[p] * cy[p] - NSy[i] * cy[i]);
    }
    return { N, dNx, dNy, dNBx, dNBy, gt1, gt2, gt3, gt4, dJ: Math.abs(det) };
  };
  // proyección del drilling: media (pesada) de las columnas del giro sobre la cuadratura
  const mg1 = [0, 0, 0, 0], mg4 = [0, 0, 0, 0], mg23 = [0, 0, 0, 0];
  if (proy) {
    let area = 0;
    for (const p of q) { const d = deriv(p.r, p.s); const w = p.w * d.dJ;
      for (let i = 0; i < 4; i++) { mg1[i] += d.gt1[i] * w; mg4[i] += d.gt4[i] * w; mg23[i] += (d.gt2[i] + d.gt3[i]) * w; }
      area += w; }
    for (let i = 0; i < 4; i++) { mg1[i] /= area; mg4[i] /= area; mg23[i] /= area; }
  }
  const Ben = (r: number, s: number) => {
    const d = deriv(r, s);
    const B = [new Array<number>(14).fill(0), new Array<number>(14).fill(0), new Array<number>(14).fill(0)];
    for (let i = 0; i < 4; i++) {
      B[0][3 * i] = d.dNx[i]; B[1][3 * i + 1] = d.dNy[i]; B[2][3 * i] = d.dNy[i]; B[2][3 * i + 1] = d.dNx[i];
      B[0][3 * i + 2] = d.gt1[i] - mg1[i]; B[1][3 * i + 2] = d.gt4[i] - mg4[i]; B[2][3 * i + 2] = d.gt2[i] + d.gt3[i] - mg23[i];
    }
    B[0][12] = d.dNBx; B[2][12] = d.dNBy; B[1][13] = d.dNBy; B[2][13] = d.dNBx;
    return { B, d };
  };
  // K14 = Σ BᵀDmB w|J| + P (centro) + reloj
  const K: number[][] = Array.from({ length: 14 }, () => new Array<number>(14).fill(0));
  for (const p of q) {
    const { B, d } = Ben(p.r, p.s); const w = p.w * d.dJ;
    const DB = [0, 1, 2].map((i) => B[0].map((_, c) => Dm[i][0] * B[0][c] + Dm[i][1] * B[1][c] + Dm[i][2] * B[2][c]));
    for (let a = 0; a < 14; a++) for (let b = 0; b < 14; b++) K[a][b] += (B[0][a] * DB[0][b] + B[1][a] * DB[1][b] + B[2][a] * DB[2][b]) * w;
  }
  {
    const d0 = deriv(0, 0);
    const mu = E / (2 * (1 + nu)), gamma = gammaFac * mu;
    const res = new Array<number>(14).fill(0);
    for (let i = 0; i < 4; i++) { res[3 * i] = -0.5 * d0.dNy[i]; res[3 * i + 1] = 0.5 * d0.dNx[i]; res[3 * i + 2] = 0.5 * (d0.gt3[i] - d0.gt2[i]) - d0.N[i]; }
    res[12] = 0; res[13] = 0;   // la burbuja tiene derivada nula en el centro
    const fac = gamma * t * 4 * d0.dJ;
    for (let a = 0; a < 14; a++) for (let b = 0; b < 14; b++) K[a][b] += fac * res[a] * res[b];
    if (khg > 0) {
      let A = 0; for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; A += xl[i] * yl[j] - xl[j] * yl[i]; } A = Math.abs(A) / 2;
      const hg = new Array<number>(14).fill(0); for (let i = 0; i < 4; i++) hg[3 * i + 2] = i % 2 === 0 ? 1 : -1;
      const fh = (khg * mu * t * A) / 4;
      for (let a = 0; a < 14; a++) for (let b = 0; b < 14; b++) K[a][b] += fh * hg[a] * hg[b];
    }
  }
  // burbuja recuperada: u_b = −Kbb⁻¹ Kabᵀ u
  const u14 = [...u12, 0, 0];
  const Kbb = [[K[12][12], K[12][13]], [K[13][12], K[13][13]]];
  const det = Kbb[0][0] * Kbb[1][1] - Kbb[0][1] * Kbb[1][0];
  if (Math.abs(det) > 1e-30) {
    const r0 = K[12].slice(0, 12).reduce((s, v, c) => s + v * u12[c], 0);
    const r1 = K[13].slice(0, 12).reduce((s, v, c) => s + v * u12[c], 0);
    u14[12] = -(Kbb[1][1] * r0 - Kbb[0][1] * r1) / det;
    u14[13] = -(-Kbb[1][0] * r0 + Kbb[0][0] * r1) / det;
  }
  // Medido el 8-sep-2026 contra AreaForceShell de ETABS 22 y SAP2000 24 (plantilla dual, 3760
  // joints, muros incluidos, desplazamientos 0.0000 %): la deformacion en Gauss 2x2 con la
  // proyeccion y SIN la burbuja, extrapolada a las esquinas, da los joints de CSI a 0.0000 %.
  // Con la burbuja recuperada dentro, 5.7 % en los joints de muro (el centroide sale igual en
  // los dos casos: la burbuja no tiene deformacion media). Evaluar en las esquinas con la
  // Allman SIN proyeccion da lo mismo (0.0000 %): son la misma cosa por otro camino.
  // __hekatanItwRec (solo para medir): "conBurbuja" | "sinProy" | "sinTheta" | "esquinas".
  const REC: string = (globalThis as any).__hekatanItwRec ?? "";
  const uRec = u14.slice();
  if (!REC.includes("conBurbuja")) { uRec[12] = 0; uRec[13] = 0; }
  if (REC.includes("sinTheta")) for (let i = 0; i < 4; i++) uRec[3 * i + 2] = 0;
  const Nen = (r: number, s: number) => {
    const { B, d } = Ben(r, s);
    if (REC.includes("sinProy")) for (let i = 0; i < 4; i++) { B[0][3 * i + 2] = d.gt1[i]; B[1][3 * i + 2] = d.gt4[i]; B[2][3 * i + 2] = d.gt2[i] + d.gt3[i]; }
    const e = [0, 1, 2].map((i) => B[i].reduce((s2, v, c) => s2 + v * uRec[c], 0));
    return [0, 1, 2].map((i) => Dm[i][0] * e[0] + Dm[i][1] * e[1] + Dm[i][2] * e[2]);
  };
  const esq = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  if (REC.includes("esquinas")) return esq.map(([r, s]) => Nen(r, s));
  const g = GP2; const Ng = esq.map(([r, s]) => Nen(r * g, s * g));
  return esq.map(([r, s]) => {
    const R = r / g, S = s / g;
    const Nn = esq.map(([a, b]) => ((1 + a * R) * (1 + b * S)) / 4);
    return [0, 1, 2].map((i) => Nn.reduce((acc, w, k) => acc + w * Ng[k][i], 0));
  });
}
