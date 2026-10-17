/**
 * La UNIÓN VIGA-MURO de ETABS escrita con barras que SAP2000 sí tiene (16-oct-2026).
 *
 * ETABS (hekatan-fem/src/cpp/utils/etabsWallJoint.h, medido el 2-sep-2026) suma en cada nudo n de un muro al que
 * llega una barra, por cada elemento de muro que lo contiene, c·v·vᵀ con v = (u_h − u_n)·e2 − L·θ_n·e3,
 * c = E·t·(H/L)³/32 (h = vecino por la arista horizontal, L su largo, H la altura, e3 = normal del muro).
 * Una barra n→h EMPOTRADA en n y ARTICULADA en h (M3 liberado) tiene exactamente la rigidez (3·EI/L³)·v·vᵀ en el
 * plano del muro: con EI = c·L³/3 es la MISMA matriz. Sin área, sin inercia fuera del plano, sin torsión, sin peso.
 *
 * Medido (TACNA, empuje 100 tonf, techo): Struct con barras = Struct con la unión de ETABS a 0.0026 % del máximo;
 * SAP2000 con el .s2k y las barras 8.412 mm (sin ellas 8.863), ETABS con el mismo fichero 8.467.
 */
export interface BarraUnionMuro { n: number; h: number; E: number; I33: number }

export function barrasUnionMuro(nodes: number[][], elements: number[][],
                                elasticities: Map<number, number> | undefined,
                                thicknesses: Map<number, number> | undefined): BarraUnionMuro[] {
  const conBarra = new Set<number>();
  elements.forEach((e) => { if (e.length === 2) { conBarra.add(e[0]); conBarra.add(e[1]); } });
  const sub = (a: number[], b: number[]) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const cruz = (a: number[], b: number[]) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const nrm = (a: number[]) => Math.hypot(a[0], a[1], a[2]);
  const acum = new Map<string, { n: number; h: number; EI: number; E: number }>();
  elements.forEach((el, ie) => {
    if (el.length !== 4 || !el.some((p) => conBarra.has(p))) return;
    const E = elasticities?.get(ie) ?? 0, t = thicknesses?.get(ie) ?? 0;
    if (!(E > 0) || !(t > 0)) return;
    const P = el.map((p) => nodes[p]);
    const nv = cruz(sub(P[2], P[0]), sub(P[3], P[1])), nn = nrm(nv);
    if (nn < 1e-12 || Math.abs(nv[2] / nn) > 1e-6) return;            // solo muros (verticales), como ETABS
    for (let a = 0; a < 4; a++) {
      const nd = el[a];
      if (!conBarra.has(nd)) continue;
      const iPrev = (a + 3) % 4, iNext = (a + 1) % 4;
      const dp = sub(P[iPrev], P[a]), dn = sub(P[iNext], P[a]);
      const hp = Math.abs(dp[2]) / Math.max(nrm(dp), 1e-12), hn = Math.abs(dn[2]) / Math.max(nrm(dn), 1e-12);
      const ih = hp <= hn ? iPrev : iNext, iv = hp <= hn ? iNext : iPrev;
      const L = nrm(sub(P[ih], P[a])), H = nrm(sub(P[iv], P[a]));
      if (L < 1e-12 || H < 1e-12) continue;
      const c = E * t * (H / L) ** 3 / 32;
      const h = el[ih], k = `${nd}|${h}`;
      const e = acum.get(k) ?? { n: nd, h, EI: 0, E };
      e.EI += c * L ** 3 / 3;
      acum.set(k, e);
    }
  });
  return [...acum.values()].map(({ n, h, EI, E }) => ({ n, h, E, I33: EI / E }));
}

/** Añade las barras a una copia del modelo (para exportar): elementos nuevos al final, con sus propiedades. */
export function conBarrasUnionMuro(nodes: number[][], elements: number[][], ei: any): { elements: number[][]; ei: any; n: number } {
  const bs = barrasUnionMuro(nodes, elements, ei.elasticities, ei.thicknesses);
  if (!bs.length) return { elements, ei, n: 0 };
  const els = elements.map((e) => [...e]);
  const cp: any = { ...ei };
  const mapa = (k: string) => (cp[k] = new Map(ei[k] ?? []));
  ["elasticities", "shearModuli", "poissonsRatios", "areas", "momentsOfInertiaY", "momentsOfInertiaZ", "torsionalConstants",
   "densities", "shearAreasY", "shearAreasZ", "momentReleases", "localAngles"].forEach(mapa);
  for (const b of bs) {
    const i = els.length;
    els.push([b.n, b.h]);
    cp.elasticities.set(i, b.E); cp.poissonsRatios.set(i, 0.2); cp.shearModuli.set(i, b.E / 2.4);
    cp.areas.set(i, 1e-9); cp.momentsOfInertiaY.set(i, 1e-12); cp.momentsOfInertiaZ.set(i, b.I33);
    cp.torsionalConstants.set(i, 1e-12); cp.densities.set(i, 0);
    cp.shearAreasY.set(i, 1e3); cp.shearAreasZ.set(i, 1e3);           // sin deformación por cortante
    const r = new Array<boolean>(12).fill(false); r[11] = true;        // M3 liberado en el extremo h
    cp.momentReleases.set(i, r);
  }
  return { elements: els, ei: cp, n: bs.length };
}
