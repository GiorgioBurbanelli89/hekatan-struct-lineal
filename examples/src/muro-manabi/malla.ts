/**
 * MURO DE CONTENCIÓN DE MANABÍ — el mismo muro modelado de TRES maneras. La malla, pura.
 *
 * Es el muro de la serie de vídeos (GEO5 → GeoFEM → Hekatan Struct → SAP2000 / ETABS):
 * fuste 2.60 m, zapata 0.40 m, coronación 0.25, pie del fuste 0.40, puntera 0.70, talón 1.90.
 * La cara DELANTERA del fuste es la inclinada; la trasera (la del relleno) es vertical.
 *
 *        x = 0      toe     xb = toe + tBase            B
 *                    ┌──┐
 *                   ╱   │  ← fuste: tTop arriba, tBase abajo
 *                  ╱    │◄── empuje del relleno (hacia −x)
 *   z = tf ┌──────┴─────┴──────────────────┐
 *          │ puntera       │     talón     │  ← zapata
 *   z = 0  └───────────────────────────────┘
 *            ▲ muelles de balasto (uz) en toda la base · ux sujeto en la punta de la puntera
 *
 *   modelo 0  MEMBRANA  la sección x–z con cáscaras Q4 de espesor L (tensión plana, o deformación
 *                       plana equivalente con E' = E/(1−ν²), ν' = ν/(1−ν))
 *   modelo 1  CÁSCARA   fuste y zapata por su plano medio, longitud L; el canto del fuste va por filas
 *   modelo 2  SÓLIDO    la sección extruida L en hexaedros H8
 *
 * CARGAS (kN y m), todas nodales para que SAP2000 y ETABS reciban exactamente las mismas:
 *   PP       peso propio, γc · volumen, a partes iguales entre los nudos del elemento
 *   RELLENO  el relleno sobre el talón: γ · Hf sobre la cara superior de la zapata, de xb a B
 *   EMPUJE   empuje activo de Coulomb sobre la cara trasera del fuste, p = Ka · γ · z, inclinado δ
 *   SISMO    incremento de Mononobe-Okabe, Δp = (Kae − Ka)(1 − kv) · γ · (Hf − z): triángulo
 *            INVERTIDO, nulo al pie y máximo en la coronación (ayuda de GEO5, «Influence of
 *            Earthquake»: «computed from the structure bottom»), más la inercia del muro kh · PP
 *
 * Lo que NO lleva: empuje sobre el canto de la zapata, tierra sobre la puntera, empuje pasivo, agua.
 */
export type Vec3 = [number, number, number];
export type Seis = [number, number, number, number, number, number];
export type Apoyo = [boolean, boolean, boolean, boolean, boolean, boolean];

export interface MuroManabiParams {
  modelo: number;   // 0 membrana · 1 cáscara · 2 sólido
  caso: number;     // 0 estático (PP + RELLENO + EMPUJE) · 1 sísmico (+ SISMO)
  Hf: number;       // alto del fuste (m)
  tf: number;       // canto de la zapata (m)
  tTop: number;     // canto del fuste en la coronación (m)
  tBase: number;    // canto del fuste al pie (m)
  toe: number;      // puntera (m)
  heel: number;     // talón (m)
  L: number;        // longitud de muro que se modela (m)
  ms: number;       // tamaño de elemento (m)
  E: number;        // hormigón, kN/m²
  nu: number;
  gammaC: number;   // kN/m³
  dp: number;       // 1 = la membrana trabaja en deformación plana equivalente
  gamma: number;    // relleno, kN/m³
  phi: number;      // grados
  delta: number;    // rozamiento muro-suelo, grados
  kh: number;
  kv: number;       // positivo = levanta (quita peso), el signo de GEO5
  ks: number;       // módulo de balasto, kN/m³
}

/** Valores del muro de la serie, cada uno con su fuente (registros/2026-09-28_PENDIENTE_muro…). */
export const MURO_MANABI: MuroManabiParams = {
  modelo: 0, caso: 1,
  Hf: 2.60, tf: 0.40, tTop: 0.25, tBase: 0.40, toe: 0.70, heel: 1.90, L: 1.0, ms: 0.10,
  // f'c = 21 MPa (el mínimo de la NEC-SE-HM); Ec = 4700·√f'c MPa (ACI 318-19, 19.2.2.1.b)
  E: 4700 * Math.sqrt(21) * 1000, nu: 0.2,
  gammaC: 23,                 // el que trae GEO5 Cantilever Wall
  dp: 1,
  gamma: 18.5,                // arena SP de compacidad media, catálogo de GEO5
  phi: 30, delta: 20,         // estudio de suelos de Portoviejo; δ en el rango de Das (15–25°)
  kh: 0.336, kv: 0,           // NEC-SE-GC 4.2.2: kh = 0.6 · Z · Fa = 0.6 · 0.50 · 1.12
  // estudio de suelos, tramo −2.55 a −3.00 m: 6.59 kg/cm³ (tabla de Nelson Morrison 1993)
  ks: 6.59 * 9806.65,
};

export type Patron = "PP" | "RELLENO" | "EMPUJE" | "SISMO";
export const PATRONES: Patron[] = ["PP", "RELLENO", "EMPUJE", "SISMO"];

export interface MuroManabiMalla {
  tipo: "membrana" | "cascara" | "solido";
  nodes: Vec3[];
  /** 4 nudos (cáscara Q4) u 8 (hexaedro H8, 0-3 abajo antihorario visto desde +z, 4-7 arriba) */
  elements: number[][];
  /** canto de cada cáscara, por índice de elemento (vacío en sólidos) */
  thicknesses: Map<number, number>;
  /** material que se le da al elemento (el de la membrana cambia con `dp`) */
  E: number;
  nu: number;
  supports: Map<number, Apoyo>;
  springs: Array<{ node: number; dof: number; k: number }>;
  cargas: Record<Patron, Map<number, Seis>>;
  /** la suma de los patrones del caso pedido */
  loads: Map<number, Seis>;
  /** nudo de la coronación, en la cara trasera (o en el plano medio) y a media longitud */
  nudoCoronacion: number;
  /** nudos de la base que llevan muelle, con su área tributaria (m²) */
  base: Array<{ node: number; area: number }>;
  info: {
    Ka: number; Kae: number; psi: number;
    suma: Record<Patron, [number, number, number]>;
    nudos: number; elementos: number;
  };
}

const rad = (g: number) => (g * Math.PI) / 180;
const rd = (v: number) => Math.round(v * 1e9) / 1e9;

/** Coulomb, trasdós vertical y terreno horizontal. */
export function kaCoulomb(phi: number, delta: number): number {
  const f = rad(phi), d = rad(delta);
  const r = Math.sqrt((Math.sin(f + d) * Math.sin(f)) / Math.cos(d));
  return Math.cos(f) ** 2 / (Math.cos(d) * (1 + r) ** 2);
}

/** Mononobe-Okabe, trasdós vertical y terreno horizontal. ψ = atan(kh / (1 − kv)). */
export function kaeMononobeOkabe(phi: number, delta: number, kh: number, kv: number): { Kae: number; psi: number } {
  const f = rad(phi), d = rad(delta), psi = Math.atan(kh / (1 - kv));
  // límite de la teoría: φ − ψ ≥ 0 (con terreno horizontal). Por debajo la raíz no existe.
  const r = Math.sqrt(Math.max(0, (Math.sin(f + d) * Math.sin(f - psi)) / Math.cos(d + psi)));
  const Kae = Math.cos(f - psi) ** 2 / (Math.cos(psi) * Math.cos(d + psi) * (1 + r) ** 2);
  return { Kae, psi: (psi * 180) / Math.PI };
}

/** Reparte una longitud en tramos iguales de tamaño ≈ ms. */
function tramos(a: number, b: number, ms: number): number[] {
  const n = Math.max(1, Math.round((b - a) / ms));
  return Array.from({ length: n + 1 }, (_, i) => rd(a + ((b - a) * i) / n));
}
const unir = (...l: number[][]) => [...new Set(l.flat().map(rd))].sort((p, q) => p - q);

class Cargas {
  por: Record<Patron, Map<number, Seis>> = { PP: new Map(), RELLENO: new Map(), EMPUJE: new Map(), SISMO: new Map() };
  mas(p: Patron, n: number, gdl: number, v: number) {
    if (!v) return;
    const f = this.por[p].get(n) ?? [0, 0, 0, 0, 0, 0];
    f[gdl] += v; this.por[p].set(n, f);
  }
  suma(p: Patron): [number, number, number] {
    const s: [number, number, number] = [0, 0, 0];
    this.por[p].forEach((f) => { s[0] += f[0]; s[1] += f[1]; s[2] += f[2]; });
    return s;
  }
  delCaso(caso: number): Map<number, Seis> {
    const out = new Map<number, Seis>();
    for (const p of PATRONES) {
      if (p === "SISMO" && Math.round(caso) !== 1) continue;
      this.por[p].forEach((f, n) => {
        const g = out.get(n) ?? [0, 0, 0, 0, 0, 0];
        for (let k = 0; k < 6; k++) g[k] += f[k];
        out.set(n, g);
      });
    }
    return out;
  }
}

/** Área de un cuadrilátero plano dado por sus 4 vértices en 3D. */
function areaQ4(P: Vec3[]): number {
  const cruz = (a: Vec3, b: Vec3, c: Vec3) => {
    const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
    return Math.hypot(u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]) / 2;
  };
  return cruz(P[0], P[1], P[2]) + cruz(P[0], P[2], P[3]);
}

/** Pesos de los extremos de cada tramo de una línea de nudos: mitad de cada tramo vecino. */
function tributaria(c: number[]): number[] {
  return c.map((_, i) => ((i > 0 ? c[i] - c[i - 1] : 0) + (i < c.length - 1 ? c[i + 1] - c[i] : 0)) / 2);
}

export function mallaMuroManabi(p: MuroManabiParams): MuroManabiMalla {
  const modelo = Math.round(p.modelo);
  const B = p.toe + p.tBase + p.heel, xb = p.toe + p.tBase, Zt = p.tf + p.Hf;
  const Ka = kaCoulomb(p.phi, p.delta);
  const { Kae, psi } = kaeMononobeOkabe(p.phi, p.delta, p.kh, p.kv);
  const cd = Math.cos(rad(p.delta)), sd = Math.sin(rad(p.delta));
  // presiones sobre el trasdós a la cota z (kN/m²), a lo largo de la dirección del empuje (δ)
  const pEst = (z: number) => Ka * p.gamma * (Zt - z);
  const pSis = (z: number) => (Kae - Ka) * (1 - p.kv) * p.gamma * (z - p.tf);
  // cara delantera del fuste a la cota z
  const xFrente = (z: number) => p.toe + ((p.tBase - p.tTop) * (z - p.tf)) / p.Hf;

  const nodes: Vec3[] = [], elements: number[][] = [];
  const thicknesses = new Map<number, number>();
  const supports = new Map<number, Apoyo>();
  const springs: Array<{ node: number; dof: number; k: number }> = [];
  const base: Array<{ node: number; area: number }> = [];
  const C = new Cargas();
  let nudoCoronacion = 0;
  let E = p.E, nu = p.nu;

  const ys = modelo === 0 ? [0] : tramos(0, p.L, p.ms);
  const wy = modelo === 0 ? [p.L] : tributaria(ys);   // la membrana lleva toda la longitud en su espesor
  const jm = Math.floor(ys.length / 2);

  // empuje sobre una línea vertical de nudos del trasdós: carga consistente de una presión lineal
  const empujeEnLinea = (zs: number[], nudoDe: (k: number) => number, ancho: number, brazo: (k: number) => number) => {
    for (const [pat, pres] of [["EMPUJE", pEst], ["SISMO", pSis]] as Array<[Patron, (z: number) => number]>) {
      for (let k = 0; k + 1 < zs.length; k++) {
        const l = zs[k + 1] - zs[k], p1 = pres(zs[k]), p2 = pres(zs[k + 1]);
        const F = [(l * (2 * p1 + p2)) / 6, (l * (p1 + 2 * p2)) / 6];
        [k, k + 1].forEach((kk, a) => {
          const n = nudoDe(kk), f = F[a] * ancho;
          C.mas(pat, n, 0, -f * cd);              // hacia la puntera
          C.mas(pat, n, 2, -f * sd);              // el rozamiento tira hacia abajo
          C.mas(pat, n, 4, f * sd * brazo(kk));   // y lo hace en la cara, no en el plano medio
        });
      }
    }
  };

  if (modelo === 1) {
    // ── CÁSCARA: zapata en z = tf/2 y fuste por su plano medio ─────────────────────────────
    const xm = (z: number) => (xFrente(Math.max(z, p.tf)) + xb) / 2;
    const xEje = rd(xm(p.tf));
    const xs = unir(tramos(0, p.toe, p.ms), tramos(p.toe, xb, p.ms), tramos(xb, B, p.ms), [xEje]);
    const zs = unir([p.tf / 2, p.tf], tramos(p.tf, Zt, p.ms));
    const iEje = xs.indexOf(xEje);
    const nz = new Map<string, number>();
    const zap = (i: number, j: number) => {
      const key = `z${i},${j}`; let id = nz.get(key);
      if (id === undefined) { id = nodes.length; nz.set(key, id); nodes.push([xs[i], ys[j], rd(p.tf / 2)]); }
      return id;
    };
    const fus = (k: number, j: number) => {
      if (k === 0) return zap(iEje, j);
      const key = `f${k},${j}`; let id = nz.get(key);
      if (id === undefined) { id = nodes.length; nz.set(key, id); nodes.push([rd(xm(zs[k])), ys[j], zs[k]]); }
      return id;
    };
    for (let j = 0; j + 1 < ys.length; j++) for (let i = 0; i + 1 < xs.length; i++) {
      thicknesses.set(elements.length, p.tf);
      elements.push([zap(i, j), zap(i + 1, j), zap(i + 1, j + 1), zap(i, j + 1)]);
    }
    const nZap = elements.length;
    for (let k = 0; k + 1 < zs.length; k++) for (let j = 0; j + 1 < ys.length; j++) {
      // canto de la fila: el del fuste a media altura de la fila (la fila de dentro de la zapata, tBase)
      const zc = Math.max((zs[k] + zs[k + 1]) / 2, p.tf);
      thicknesses.set(elements.length, rd(xb - xFrente(zc)));
      elements.push([fus(k, j), fus(k, j + 1), fus(k + 1, j + 1), fus(k + 1, j)]);
    }
    // peso propio; la fila del fuste que cae DENTRO de la zapata no pesa (ya la pesa la zapata)
    elements.forEach((el, e) => {
      if (e >= nZap && nodes[el[0]][2] < p.tf - 1e-9 && nodes[el[2]][2] <= p.tf + 1e-9) return;
      const W = areaQ4(el.map((n) => nodes[n])) * (thicknesses.get(e) ?? 0) * p.gammaC;
      for (const n of el) {
        C.mas("PP", n, 2, -W / 4);
        C.mas("SISMO", n, 0, (-p.kh * W) / 4);
        C.mas("SISMO", n, 2, (p.kv * W) / 4);
      }
    });
    const wx = tributaria(xs);
    // el relleno carga de xb a B: a cada nudo, la parte de su ancho tributario que cae detrás del trasdós
    const wRell = xs.map((x, i) => {
      const a = Math.max(xb, i > 0 ? (xs[i - 1] + x) / 2 : x), b = i < xs.length - 1 ? (x + xs[i + 1]) / 2 : x;
      return Math.max(0, b - a);
    });
    for (let j = 0; j < ys.length; j++) for (let i = 0; i < xs.length; i++) {
      const n = zap(i, j);
      const A = wx[i] * wy[j];
      springs.push({ node: n, dof: 2, k: p.ks * A }); base.push({ node: n, area: A });
      C.mas("RELLENO", n, 2, -p.gamma * p.Hf * wRell[i] * wy[j]);
      if (i === 0) supports.set(n, [true, true, false, true, false, true]);
    }
    const k0 = zs.indexOf(rd(p.tf));
    for (let j = 0; j < ys.length; j++)
      empujeEnLinea(zs.slice(k0), (k) => fus(k0 + k, j), wy[j], (k) => xb - nodes[fus(k0 + k, j)][0]);
    nudoCoronacion = fus(zs.length - 1, jm);
    // faja de muro: nada se mueve a lo largo (uy) ni gira fuera del plano x–z (rx, rz)
    nodes.forEach((_, n) => { if (!supports.has(n)) supports.set(n, [false, true, false, true, false, true]); });
  } else {
    // ── MEMBRANA y SÓLIDO: la sección x–z, tal cual o extruida ─────────────────────────────
    const xs = unir(tramos(0, p.toe, p.ms), tramos(p.toe, xb, p.ms), tramos(xb, B, p.ms));
    const zF = tramos(0, p.tf, p.ms), zS = tramos(p.tf, Zt, p.ms);
    const zs = unir(zF, zS);
    const kf = zF.length - 1, i0 = xs.indexOf(rd(p.toe)), i1 = xs.indexOf(rd(xb));
    const xDe = (i: number, k: number) => {
      if (k <= kf || i < i0 || i > i1) return xs[i];
      const xf = xFrente(zs[k]);
      return rd(xf + ((xs[i] - p.toe) / p.tBase) * (xb - xf));
    };
    const ids = new Map<string, number>();
    const nudo = (i: number, j: number, k: number) => {
      const key = `${i},${j},${k}`; let id = ids.get(key);
      if (id === undefined) { id = nodes.length; ids.set(key, id); nodes.push([xDe(i, k), ys[j], zs[k]]); }
      return id;
    };
    const dentro = (i: number, k: number) => k < kf || (i >= i0 && i < i1);
    const nyE = modelo === 0 ? 1 : ys.length - 1;
    for (let k = 0; k + 1 < zs.length; k++) for (let j = 0; j < nyE; j++) for (let i = 0; i + 1 < xs.length; i++) {
      if (!dentro(i, k)) continue;
      const q = [[i, k], [i + 1, k], [i + 1, k + 1], [i, k + 1]];
      // área de la celda en la sección, para el peso
      const A = areaQ4(q.map(([a, c]) => [xDe(a, c), 0, zs[c]] as Vec3));
      let el: number[], W: number;
      if (modelo === 0) {
        el = q.map(([a, c]) => nudo(a, 0, c));
        thicknesses.set(elements.length, p.L);
        W = A * p.L * p.gammaC;
      } else {
        el = [nudo(i, j, k), nudo(i + 1, j, k), nudo(i + 1, j + 1, k), nudo(i, j + 1, k),
              nudo(i, j, k + 1), nudo(i + 1, j, k + 1), nudo(i + 1, j + 1, k + 1), nudo(i, j + 1, k + 1)];
        W = A * (ys[j + 1] - ys[j]) * p.gammaC;
      }
      elements.push(el);
      for (const n of el) {
        C.mas("PP", n, 2, -W / el.length);
        C.mas("SISMO", n, 0, (-p.kh * W) / el.length);
        C.mas("SISMO", n, 2, (p.kv * W) / el.length);
      }
    }
    const wx = tributaria(xs);
    const wRell = xs.map((x, i) => (i < i1 ? 0 : ((i > i1 ? x - xs[i - 1] : 0) + (i < xs.length - 1 ? xs[i + 1] - x : 0)) / 2));
    for (let j = 0; j < ys.length; j++) {
      for (let i = 0; i < xs.length; i++) {
        const n = nudo(i, j, 0), A = wx[i] * wy[j];
        springs.push({ node: n, dof: 2, k: p.ks * A }); base.push({ node: n, area: A });
        C.mas("RELLENO", nudo(i, j, kf), 2, -p.gamma * p.Hf * wRell[i] * wy[j]);
      }
      empujeEnLinea(zs.slice(kf), (k) => nudo(i1, j, kf + k), wy[j], () => 0);
    }
    nudoCoronacion = nudo(i1, modelo === 0 ? 0 : jm, zs.length - 1);
    const libre: Apoyo = modelo === 0
      ? [false, true, false, true, false, true]      // membrana en x–z: fuera uy, rx, rz; queda el giro normal ry
      : [false, true, false, false, false, false];   // sólido: deformación plana, uy = 0 (no tiene giros)
    nodes.forEach((_, n) => supports.set(n, [...libre] as Apoyo));
    for (let j = 0; j < ys.length; j++) { const a = supports.get(nudo(0, j, 0))!; a[0] = true; }
    if (modelo === 0 && Math.round(p.dp) === 1) { E = p.E / (1 - p.nu ** 2); nu = p.nu / (1 - p.nu); }
  }

  const suma = Object.fromEntries(PATRONES.map((q) => [q, C.suma(q)])) as Record<Patron, [number, number, number]>;
  return {
    tipo: modelo === 1 ? "cascara" : modelo === 2 ? "solido" : "membrana",
    nodes, elements, thicknesses, E, nu, supports, springs, cargas: C.por, loads: C.delCaso(p.caso),
    nudoCoronacion, base,
    info: { Ka, Kae, psi, suma, nudos: nodes.length, elementos: elements.length },
  };
}
