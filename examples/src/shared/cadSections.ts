/**
 * cadSections.ts — Helpers PUROS de propiedades de sección para el modelador CAD.
 *
 * Extraído de getCad3d.ts (refactor: separar la matemática pura del God file).
 * Cada función recibe dimensiones y devuelve { A, Iz, Iy, J } con la convención
 * ESTÁNDAR de sección (AISC):
 *    Iz = eje FUERTE (flexión en la dirección del canto h)
 *    Iy = eje DÉBIL  (flexión en la dirección del ancho b)
 *
 * IMPORTANTE — convención de ejes locales del solver (ver CLAUDE.md "Ejes locales"):
 * los ejes locales son ahora los de CSI (eje 2 = plano vertical hacia arriba), así
 * que al asignar al solver el eje FUERTE (Iz aquí) va en `momentsOfInertiaZ` = I33
 * y el débil (Iy aquí) en `momentsOfInertiaY` = I22. Antes era al revés.
 * Para no equivocarse, usar `toLocalInertia()`.
 */

export interface SectionProps {
  A: number;
  Iz: number; // eje fuerte (canto³)
  Iy: number; // eje débil (ancho³)
  J: number;
}

/** Mapea las inercias de sección (Iz=fuerte, Iy=débil) a los ejes LOCALES del solver.
 *  Convención CSI: el fuerte es I33 y va en momentsOfInertiaZ. */
export function toLocalInertia(sec: SectionProps): { moiZ: number; moiY: number } {
  return { moiZ: sec.Iz, moiY: sec.Iy }; // fuerte→Z (I33), débil→Y (I22)
}

/** Sección rectangular maciza. b=ancho, h=canto. */
export function rectSection(b: number, h: number): SectionProps {
  const A = b * h;
  const Iz = (b * h * h * h) / 12; // eje fuerte (canto h al cubo)
  const Iy = (h * b * b * b) / 12; // eje débil
  const a = Math.min(b, h), bv = Math.max(b, h);
  const J = a * a * a * bv * (1 / 3 - 0.21 * (a / bv) * (1 - (a * a * a * a) / (12 * bv * bv * bv * bv)));
  return { A, Iz, Iy, J };
}

/** Sección circular maciza. d=diámetro. */
export function circSection(d: number): SectionProps {
  const r = d / 2;
  const A = Math.PI * r * r;
  const I = (Math.PI * r * r * r * r) / 4;
  const J = (Math.PI * r * r * r * r) / 2;
  return { A, Iz: I, Iy: I, J };
}

/** Perfil I paramétrico. bf=ancho ala, h=canto total, tf=espesor ala, tw=espesor alma. */
export function iParamSection(bf: number, h: number, tf: number, tw: number): SectionProps {
  const hw = h - 2 * tf; // altura del alma
  const A = 2 * bf * tf + hw * tw;
  const Iz = (bf * h * h * h - (bf - tw) * hw * hw * hw) / 12; // eje fuerte
  const Iy = (2 * tf * bf * bf * bf + hw * tw * tw * tw) / 12; // eje débil
  const J = (2 * bf * tf * tf * tf + hw * tw * tw * tw) / 3; // torsión (sección abierta, aprox)
  return { A, Iz, Iy, J };
}

/** Tubular hueca rectangular. b=ancho, h=canto, t=espesor de pared. */
export function hollowRectSection(b: number, h: number, t: number): SectionProps {
  const bi = b - 2 * t, hi = h - 2 * t;
  const A = b * h - bi * hi;
  const Iz = (b * h * h * h - bi * hi * hi * hi) / 12;
  const Iy = (h * b * b * b - hi * bi * bi * bi) / 12;
  const Am = (b - t) * (h - t); // área encerrada por la línea media (Bredt)
  const perim = 2 * ((b - t) / t + (h - t) / t);
  const J = (4 * Am * Am) / (perim > 0 ? perim : 1);
  return { A, Iz, Iy, J };
}

/** CFT (tubo de acero relleno de hormigón) — sección transformada a acero equivalente.
 *  b,h=dims exteriores, t=espesor pared; Es,nuS=acero; fc,nuC=hormigón (kN/m²). */
/** Area de cortante de TIMOSHENKO de una seccion simetrica hecha de bandas
 *  horizontales de ancho constante (ya TRANSFORMADAS al material de referencia):
 *      As = I^2 / ∫ Q(y)^2 / w(y) dy
 *  Es lo que calculan el Section Designer de SAP2000 y la "Filled Steel Tube" de
 *  ETABS, medido el 2-sep-2026 en el CFT 300x300x10 con n = 0.125: ellos 0.015443
 *  (SAP) y 0.015399 (ETABS), esto 0.015366 — dentro de lo que se separan entre si.
 *  Las formulas de siempre no dan eso: 5/6·A = 0.01783 y 2·t·h + n·5/6·Ac = 0.01417. */
export function areaCortanteTimoshenko(tramos: Array<{ y0: number; y1: number; w: number }>, nDiv = 4000): number {
  const yMin = Math.min(...tramos.map(t => t.y0)), yMax = Math.max(...tramos.map(t => t.y1));
  return areaCortanteTimoshenkoW(y => { const tr = tramos.find(t => y >= t.y0 && y < t.y1); return tr ? tr.w : 0; }, yMin, yMax, nDiv);
}

/** Igual, con el ancho (transformado) dado como FUNCION w(y): sirve para el circulo. */
export function areaCortanteTimoshenkoW(wDe: (y: number) => number, yMin: number, yMax: number, nDiv = 4000): number {
  const dy = (yMax - yMin) / nDiv;
  const w = new Float64Array(nDiv), yc = new Float64Array(nDiv);
  for (let i = 0; i < nDiv; i++) { yc[i] = yMin + (i + 0.5) * dy; w[i] = Math.max(0, wDe(yc[i])); }
  let A = 0, Sy = 0;
  for (let i = 0; i < nDiv; i++) { A += w[i] * dy; Sy += w[i] * yc[i] * dy; }
  const yg = A > 0 ? Sy / A : 0;
  let I = 0;
  for (let i = 0; i < nDiv; i++) I += w[i] * (yc[i] - yg) ** 2 * dy;
  let Q = 0, den = 0;                       // Q(y): momento estatico de lo que queda por encima
  for (let i = nDiv - 1; i >= 0; i--) {
    Q += w[i] * (yc[i] - yg) * dy;
    if (w[i] > 0) den += (Q * Q / w[i]) * dy;
  }
  return den > 0 ? I * I / den : 0;
}

/** J de SAINT-VENANT de un rectangulo b x h con nucleo interior (b-2t) x (h-2t)
 *  de otro material (g = G_nucleo / G_pared), por la funcion de Prandtl:
 *      div( (1/G) grad φ ) = -2,  φ = 0 en el borde,  J = 2 ∫ φ dA
 *  en diferencias finitas (SOR) con extrapolacion de Richardson de primer orden
 *  (el salto de material en las caras deja el error en O(h)). Es lo que hacen
 *  SAP2000 (Section Designer) y ETABS (Filled Steel Tube): 3.802e-4 / 3.795e-4
 *  en el CFT 300x300x10; esto da 3.79e-4. El Bredt del tubo solo daba 2.44e-4 y
 *  Bredt + n·β·a^4 del nucleo 3.52e-4: ninguno de los dos es lo que usa CSI. */
const _memoJ = new Map<string, number>();
export function torsionCompuestaRect(b: number, h: number, t: number, g: number, M = 64, tw = t): number {
  // t = espesor de las paredes paralelas a b (alas, TF de CSI); tw = las paralelas a h (almas, TW).
  const clave = `${b}|${h}|${t}|${tw}|${g}|${M}`;
  const memo = _memoJ.get(clave); if (memo !== undefined) return memo;
  // Cholesky en BANDA (la matriz es simetrica definida positiva: -div((1/G) grad)).
  // Con SOR el contraste de 7x entre acero y hormigon no convergia (salian 3.06 /
  // 3.67 / 4.27e-4 segun la malla) y tardaba 12 s; esto es directo y exacto.
  const resolver = (mx: number, my: number) => {
    const hx = b / mx, hy = h / my, n = mx * my, bw = my;
    const inv = new Float64Array(n);
    for (let i = 0; i < mx; i++) for (let j = 0; j < my; j++) {
      const x = (i + 0.5) * hx - b / 2, y = (j + 0.5) * hy - h / 2;
      const nucleo = Math.abs(x) < b / 2 - tw && Math.abs(y) < h / 2 - t;
      inv[i * my + j] = 1 / (nucleo ? g : 1);
    }
    const cara = (a: number, c: number) => 2 * a * c / (a + c);
    const diag = new Float64Array(n), offN = new Float64Array(n), offE = new Float64Array(n);
    for (let i = 0; i < mx; i++) for (let j = 0; j < my; j++) {
      const k = i * my + j, ik = inv[k];
      const cE = (i < mx - 1 ? cara(ik, inv[k + my]) : ik) / (hx * hx);
      const cW = (i > 0 ? cara(ik, inv[k - my]) : ik) / (hx * hx);
      const cN = (j < my - 1 ? cara(ik, inv[k + 1]) : ik) / (hy * hy);
      const cS = (j > 0 ? cara(ik, inv[k - 1]) : ik) / (hy * hy);
      diag[k] = cE + cW + cN + cS;
      if (j < my - 1) offN[k] = -cN;      // A(k, k+1)
      if (i < mx - 1) offE[k] = -cE;      // A(k, k+my)
    }
    const A = (r: number, c: number) => r === c ? diag[c] : (r === c + 1 ? offN[c] : (r === c + bw ? offE[c] : 0));
    const L = new Float64Array(n * (bw + 1));   // L[r*(bw+1) + (r - c)], c en [r-bw, r]
    for (let c = 0; c < n; c++) {
      const rMax = Math.min(n - 1, c + bw);
      for (let r = c; r <= rMax; r++) {
        let suma = A(r, c);
        const kMin = Math.max(0, r - bw);
        for (let k = kMin; k < c; k++) suma -= L[r * (bw + 1) + (r - k)] * L[c * (bw + 1) + (c - k)];
        if (r === c) L[c * (bw + 1)] = Math.sqrt(suma);
        else L[r * (bw + 1) + (r - c)] = suma / L[c * (bw + 1)];
      }
    }
    // L y = 2 ;  L^T phi = y
    const y = new Float64Array(n);
    for (let r = 0; r < n; r++) {
      let suma = 2;
      for (let k = Math.max(0, r - bw); k < r; k++) suma -= L[r * (bw + 1) + (r - k)] * y[k];
      y[r] = suma / L[r * (bw + 1)];
    }
    const phi = new Float64Array(n);
    for (let c = n - 1; c >= 0; c--) {
      let suma = y[c];
      const rMax = Math.min(n - 1, c + bw);
      for (let r = c + 1; r <= rMax; r++) suma -= L[r * (bw + 1) + (r - c)] * phi[r];
      phi[c] = suma / L[c * (bw + 1)];
    }
    let J = 0; for (let k = 0; k < n; k++) J += phi[k];
    return 2 * J * hx * hy;
  };
  // La PARED tiene que ser un numero ENTERO de celdas: con t = 0.01 y b = 0.3, una
  // malla de 48 la hacia de 1.6 celdas (2 celdas = 25 % mas gruesa) y J caia un
  // 20 %. Se malla con t/k por celda, k = 2 y 4, y se extrapola.
  const kb = Math.max(2, Math.round(b / tw)), kh = Math.max(2, Math.round(h / t));   // tw entero en x, t entero en y
  const k1 = 4 * Math.max(kb, kh) <= 160 ? 2 : 1;
  const J1 = resolver(k1 * kb, k1 * kh), J2 = resolver(2 * k1 * kb, 2 * k1 * kh);
  const J = 2 * J2 - J1;
  _memoJ.set(clave, J);
  return J;
}

/** CFT con el E del hormigon DADO (no deducido de f'c). Devuelve ademas As2/As3
 *  (Timoshenko sobre la seccion transformada) y J (Saint-Venant del compuesto),
 *  que son los que usan SAP2000 (Section Designer) y ETABS (Filled Steel Tube).
 *  Con esto la columna CFT cierra contra los dos: ETABS 2.00934 mm y SAP 2.00926
 *  mm de flecha lateral en la columna de prueba, contra 2.03444 con 5/6·A. */
export function cftSectionEc(
  b: number, h: number, t: number,
  Es: number, nuS: number, Ec: number, nuC: number,
  tw: number = t,
): SectionProps & { Es: number; Gs: number; A_steel: number; A_conc: number; As2: number; As3: number; n: number; Ec: number } {
  // t = TF (paredes paralelas a b), tw = TW (paredes paralelas a h), como el Filled Steel Tube de ETABS
  // y el BOX/TUBE del Section Designer (FlngThick/WebThick). Con tw = t, lo de siempre.
  const n = Ec / Es;
  const bi = b - 2 * tw, hi = h - 2 * t;
  const A_steel = b * h - bi * hi;
  const Iz_steel = (b * h * h * h - bi * hi * hi * hi) / 12;
  const Iy_steel = (h * b * b * b - hi * bi * bi * bi) / 12;
  const A_conc = bi * hi;
  const Iz_conc = (bi * hi * hi * hi) / 12;
  const Iy_conc = (hi * bi * bi * bi) / 12;
  const A = A_steel + n * A_conc;
  const Iz = Iz_steel + n * Iz_conc;
  const Iy = Iy_steel + n * Iy_conc;
  const Gs = Es / (2 * (1 + nuS)), Gc = Ec / (2 * (1 + nuC));
  // As2 va con I33 (= Iz, el canto h): bandas a lo largo de h. As3 con I22: a lo largo de b.
  const As2 = areaCortanteTimoshenko([{ y0: -h / 2, y1: -hi / 2, w: b }, { y0: -hi / 2, y1: hi / 2, w: 2 * tw + n * bi }, { y0: hi / 2, y1: h / 2, w: b }]);
  const As3 = areaCortanteTimoshenko([{ y0: -b / 2, y1: -bi / 2, w: h }, { y0: -bi / 2, y1: bi / 2, w: 2 * t + n * hi }, { y0: bi / 2, y1: b / 2, w: h }]);
  const J = torsionCompuestaRect(b, h, t, Gc / Gs, 64, tw);
  return { A, Iz, Iy, J, Es, Gs, A_steel, A_conc, As2, As3, n, Ec };
}

/** CFT CIRCULAR (tubo redondo relleno): D exterior, t pared. A e I transformadas
 *  al acero; As por Timoshenko sobre la seccion transformada (ancho del nucleo
 *  escalado por n); J EXACTO: en circulos concentricos no hay alabeo, asi que
 *  J = Js + (Gc/Gs)·Jc — lo mismo que da Saint-Venant. */
export function cftPipeSectionEc(
  D: number, t: number, Es: number, nuS: number, Ec: number, nuC: number,
): SectionProps & { Es: number; Gs: number; A_steel: number; A_conc: number; As2: number; As3: number; n: number; Ec: number } {
  const n = Ec / Es, d = D - 2 * t, R = D / 2, r = d / 2;
  const A_steel = Math.PI * (D * D - d * d) / 4, A_conc = Math.PI * d * d / 4;
  const Is = Math.PI * (D ** 4 - d ** 4) / 64, Ic = Math.PI * d ** 4 / 64;
  const A = A_steel + n * A_conc, I = Is + n * Ic;
  const Gs = Es / (2 * (1 + nuS)), Gc = Ec / (2 * (1 + nuC));
  const w = (y: number) => 2 * Math.sqrt(Math.max(0, R * R - y * y)) - (Math.abs(y) < r ? (1 - n) * 2 * Math.sqrt(Math.max(0, r * r - y * y)) : 0);
  const As = areaCortanteTimoshenkoW(w, -R, R, 8000);
  const J = Math.PI * (D ** 4 - d ** 4) / 32 + (Gc / Gs) * Math.PI * d ** 4 / 32;
  return { A, Iz: I, Iy: I, J, Es, Gs, A_steel, A_conc, As2: As, As3: As, n, Ec };
}

export function cftSection(
  b: number, h: number, t: number,
  Es: number, nuS: number, fc: number, nuC: number,
): SectionProps & { Es: number; Gs: number; A_steel: number; A_conc: number } {
  const Ec = 4700 * Math.sqrt(fc / 1000) * 1000; // kN/m²
  return cftSectionEc(b, h, t, Es, nuS, Ec, nuC);
}

/** (la version de antes, con J de Bredt del tubo solo — se deja para comparar) */
export function cftSectionBredt(
  b: number, h: number, t: number,
  Es: number, nuS: number, fc: number, nuC: number,
): SectionProps & { Es: number; Gs: number; A_steel: number; A_conc: number } {
  const Ec = 4700 * Math.sqrt(fc / 1000) * 1000; // kN/m²
  const n = Ec / Es; // razón modular
  // Tubo de acero
  const bi = b - 2 * t, hi = h - 2 * t;
  const A_steel = b * h - bi * hi;
  const Iz_steel = (b * h * h * h - bi * hi * hi * hi) / 12;
  const Iy_steel = (h * b * b * b - hi * bi * bi * bi) / 12;
  // Núcleo de hormigón
  const A_conc = bi * hi;
  const Iz_conc = (bi * hi * hi * hi) / 12;
  const Iy_conc = (hi * bi * bi * bi) / 12;
  // Transformada (acero equivalente)
  const A = A_steel + n * A_conc;
  const Iz = Iz_steel + n * Iz_conc;
  const Iy = Iy_steel + n * Iy_conc;
  const Gs = Es / (2 * (1 + nuS));
  // Torsión (Bredt sólo tubo de acero — conservador)
  const Am = (b - t) * (h - t);
  const perim = 2 * ((b - t) / t + (h - t) / t);
  const J = (4 * Am * Am) / (perim > 0 ? perim : 1);
  return { A, Iz, Iy, J, Es, Gs, A_steel, A_conc };
}
