/**
 * ─────────────────────────────────────────────────────────────────────────────
 * INTERPOLACION TRANSFINITA (parche de Coons) — implementacion propia
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * QUE ES. Dado un pano de 4 lados del que se conocen sus CUATRO CURVAS DE BORDE
 * (no solo las 4 esquinas), la interpolacion transfinita rellena el interior con
 * una rejilla estructurada que se apoya EXACTAMENTE en esos bordes.
 *
 *   Coons, S. A. (1967), «Surfaces for Computer-Aided Design of Space Forms»,
 *   MIT MAC-TR-41 — el parche bilinealmente mezclado de 4 curvas.
 *   Gordon, W. J. (1971), «Blending-function methods of bivariate and
 *   multivariate interpolation and approximation», SIAM J. Numer. Anal. 8(1)
 *   — la generalizacion («transfinita»: interpola en un conjunto NO numerable
 *   de puntos, toda la curva de borde, no una lista finita de nudos).
 *
 * LA FORMULA (la que se implementa abajo, tal cual). Con u,v en [0,1]:
 *
 *   Cb(u) = borde v=0   (esquina 0 -> 1)      Dl(v) = borde u=0   (esquina 0 -> 3)
 *   Ct(u) = borde v=1   (esquina 3 -> 2)      Dr(v) = borde u=1   (esquina 1 -> 2)
 *
 *   P(u,v) =  (1-v)·Cb(u) + v·Ct(u)                        <- mezcla en v de los bordes u
 *          +  (1-u)·Dl(v) + u·Dr(v)                        <- mezcla en u de los bordes v
 *          -  [ (1-u)(1-v)·Q0 + u(1-v)·Q1 + uv·Q2 + (1-u)v·Q3 ]   <- bilineal de las esquinas
 *
 * POR QUE SE RESTA LO ULTIMO (el «por que», no el «que»): las dos primeras
 * mezclas son cada una una superficie reglada. Cada una ya clava DOS bordes,
 * pero al sumarlas las cuatro ESQUINAS se cuentan dos veces. El tercer termino
 * es justo esa duplicacion — la bilineal de las 4 esquinas — y restarla deja la
 * superficie pasando por los cuatro bordes y por las cuatro esquinas una sola
 * vez. Es el mismo argumento de inclusion-exclusion de toda la vida.
 *
 * CASO PARTICULAR IMPORTANTE. Si los cuatro bordes son RECTOS, Cb(u) =
 * (1-u)Q0 + uQ1, etc., y entonces:
 *      primera mezcla  = bilineal
 *      segunda mezcla  = bilineal
 *      P = bilineal + bilineal - bilineal = bilineal
 * es decir, la transfinita DEGENERA EXACTAMENTE en la interpolacion bilineal de
 * las 4 esquinas. Por eso el automallado rectangular de Hekatan (bilineal) ya
 * casaba nudo a nudo con el de ETABS (`transfinite_interpolation()`) en panos de
 * lados rectos: es la misma funcion. Lo nuevo es lo que aporta cuando un borde
 * NO es recto (cubiertas curvas de galpon): los nudos interiores caen sobre el
 * ARCO, no sobre la cuerda.
 *
 * NOTA LEGAL: la formula es matematica publica (Coons 1967, Gordon 1971). Aqui
 * no hay codigo ni datos de CSI: solo el enunciado de la formula, escrito de
 * nuevo.
 */

export type V3 = [number, number, number];

/** Curva de borde parametrizada: t en [0,1] -> punto 3D. */
export type Curva = (t: number) => V3;

const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V3, b: V3): V3 =>
  [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: V3) => Math.hypot(a[0], a[1], a[2]);

/** Borde recto: la interpolacion lineal de toda la vida. */
export function recta(A: V3, B: V3): Curva {
  return (t: number) => [A[0] + (B[0] - A[0]) * t,
                         A[1] + (B[1] - A[1]) * t,
                         A[2] + (B[2] - A[2]) * t] as V3;
}

/**
 * ARCO CIRCULAR POR TRES PUNTOS (A = principio, M = un punto CUALQUIERA del
 * arco, B = final). Es el arco «3P» de AutoCAD, que es como Jorge dibuja.
 *
 * Como se saca el centro (sin inventar nada): con a = M-A y b = B-A, el
 * circuncentro del triangulo respecto de A es
 *
 *     c = A + [ (|a|²·b - |b|²·a) x (a x b) ] / (2·|a x b|²)
 *
 * que es la formula estandar del circuncentro en 3D. Si los tres puntos son
 * colineales, |a x b| = 0 y se devuelve la recta (no se fuerza un circulo que
 * no existe).
 *
 * Parametrizacion: por ANGULO uniforme, que en un circulo es tambien longitud de
 * arco uniforme. t=0 -> A, t=1 -> B, y el sentido de giro es el que pasa por M.
 */
export function arcoPor3Puntos(A: V3, M: V3, B: V3): Curva {
  const a = sub(M, A), b = sub(B, A);
  const axb = cross(a, b);
  const d2 = dot(axb, axb);
  // colineales (o M coincide con A o B): no hay circulo, es una recta
  if (!(d2 > 1e-24 * dot(a, a) * dot(b, b))) return recta(A, B);

  const num = cross(sub(mul(b, dot(a, a)), mul(a, dot(b, b))), axb);
  const c = add(A, mul(num, 1 / (2 * d2)));
  const R = norm(sub(A, c));

  const e1 = mul(sub(A, c), 1 / R);              // angulo 0 en A
  const N = mul(axb, 1 / Math.sqrt(d2));         // normal del plano del arco
  const e2 = cross(N, e1);                       // e1,e2,N triedro directo

  const ang = (P: V3) => {                       // angulo de P en [0, 2pi)
    const w = sub(P, c);
    const th = Math.atan2(dot(w, e2), dot(w, e1));
    return th < 0 ? th + 2 * Math.PI : th;
  };
  const thM = ang(M), thB = ang(B);
  // El arco va de A (0) a B. Si M queda ANTES que B girando en +, el barrido es
  // +thB; si no, hay que ir al reves y el barrido es thB - 2pi.
  const barrido = thM < thB ? thB : thB - 2 * Math.PI;

  return (t: number) => {
    const th = barrido * t;
    return add(c, add(mul(e1, R * Math.cos(th)), mul(e2, R * Math.sin(th)))) as V3;
  };
}

/**
 * BORDE POR UNA POLILINEA DE PUNTOS que YA existen en el modelo. Es como el repo
 * representa hoy los arcos: el CAD y los generadores (galpon curvo, cupula,
 * boveda) discretizan la curva en nudos, y en el `.heks` no queda ninguna
 * entidad «arco», solo la cadena de nudos.
 *
 * Parametrizacion por LONGITUD DE CUERDA acumulada: t reparte proporcional a lo
 * que mide cada tramo. No se inventa un spline que suavice: la geometria que
 * tiene el modelo es esa polilinea, y los nudos nuevos caen sobre ella.
 */
export function polilinea(P: V3[]): Curva {
  if (P.length < 2) throw new Error("polilinea: hacen falta al menos 2 puntos");
  if (P.length === 2) return recta(P[0], P[1]);
  const s: number[] = [0];
  for (let i = 1; i < P.length; i++) s.push(s[i - 1] + norm(sub(P[i], P[i - 1])));
  const L = s[s.length - 1];
  return (t: number) => {
    const x = Math.min(Math.max(t, 0), 1) * L;
    let i = 1;
    while (i < s.length - 1 && s[i] < x) i++;
    const f = (x - s[i - 1]) / (s[i] - s[i - 1] || 1);
    return [0, 1, 2].map(k => P[i - 1][k] + (P[i][k] - P[i - 1][k]) * f) as V3;
  };
}

/** Longitud de una curva por muestreo (para decidir cuantas divisiones caben). */
export function longitudCurva(c: Curva, n = 200): number {
  let L = 0, p = c(0);
  for (let i = 1; i <= n; i++) { const q = c(i / n); L += norm(sub(q, p)); p = q; }
  return L;
}

/** Interpolacion BILINEAL de las 4 esquinas (orden 0-1-2-3 alrededor del pano). */
export function bilineal(Q: [V3, V3, V3, V3], u: number, v: number): V3 {
  return [0, 1, 2].map(k =>
    Q[0][k] * (1 - u) * (1 - v) + Q[1][k] * u * (1 - v) +
    Q[2][k] * u * v + Q[3][k] * (1 - u) * v) as V3;
}

export interface BordesPano {
  Cb: Curva;   // v=0, esquina 0 -> 1
  Dr: Curva;   // u=1, esquina 1 -> 2
  Ct: Curva;   // v=1, esquina 3 -> 2
  Dl: Curva;   // u=0, esquina 0 -> 3
}

/**
 * INTERPOLACION TRANSFINITA (Coons 1967 / Gordon 1971). Ver la cabecera del
 * fichero: P = mezcla en v de los bordes u + mezcla en u de los bordes v -
 * bilineal de las 4 esquinas.
 */
export function transfinita(B: BordesPano, Q: [V3, V3, V3, V3], u: number, v: number): V3 {
  const cb = B.Cb(u), ct = B.Ct(u), dl = B.Dl(v), dr = B.Dr(v);
  const bil = bilineal(Q, u, v);
  return [0, 1, 2].map(k =>
    (1 - v) * cb[k] + v * ct[k] + (1 - u) * dl[k] + u * dr[k] - bil[k]) as V3;
}

/** Las 4 esquinas que implican unos bordes (Q0=Cb(0), Q1=Cb(1), Q2=Ct(1), Q3=Ct(0)). */
export function esquinasDe(B: BordesPano): [V3, V3, V3, V3] {
  return [B.Cb(0), B.Cb(1), B.Ct(1), B.Ct(0)];
}
