/**
 * Alcantarilla cajón de N celdas en 2D (franja de 1 m de ancho), sobre muelles Winkler.
 *
 * Pórtico plano en el plano XZ (X a lo largo, Z hacia arriba, Y = el ancho de 1 m):
 *   · losa superior  z = H, de x = 0 a x = N·L  (malla fina: un nudo cada `dx` para que los
 *     ejes del camión caigan SIEMPRE en nudo — la carga móvil queda exacta, sin palanca);
 *   · losa inferior  z = 0, un nudo cada ~0.5 m, cada nudo con su muelle vertical
 *     k = ks · (ancho tributario) · 1 m  (el mismo muelle nodal que SAP2000);
 *   · muros verticales en x = j·L (j = 0…N), del nudo de abajo al de arriba (eje 1 hacia +Z,
 *     como las columnas de CSI).
 * Medidas a EJES de las piezas. Sin brazos rígidos (offsets = 0).
 *
 * Apoyos: solo los GDL fuera del plano (Uy, Rx, Rz) en la losa inferior, y Ux en el nudo de
 * abajo a la izquierda (sin él, el cajón podría deslizar: los muelles son solo verticales).
 * Las cargas son verticales, así que esa reacción horizontal sale 0.
 *
 * Unidades: kN, m.
 */

export interface ParamsAlcantarilla {
  nCeldas: number;     // número de celdas
  L: number;           // luz de cada celda, a ejes (m)
  H: number;           // alto, a ejes (m)
  tSup: number;        // espesor losa superior (m)
  tInf: number;        // espesor losa inferior (m)
  tMuro: number;       // espesor de los muros (m)
  E: number;           // módulo de elasticidad (kN/m²)
  nu: number;          // Poisson
  ks: number;          // módulo de balasto (kN/m³)
  dx: number;          // separación de nudos en la losa superior (m) = paso del camión
  dxInf: number;       // separación objetivo de nudos en losa inferior y muros (m)
  hRelleno: number;    // relleno sobre la losa superior (m); 0 = sin relleno
  gRelleno: number;    // peso unitario del relleno (kN/m³)
}

export const DEFECTO: ParamsAlcantarilla = {
  // Medidas leídas del vídeo de referencia (vano 9.5 m, alto 6 m, 0.50 / 0.55 m).
  nCeldas: 2, L: 9.5, H: 6.0, tSup: 0.50, tInf: 0.55, tMuro: 0.45,
  E: 25e6, nu: 0.2, ks: 20000, dx: 0.1, dxInf: 0.5, hRelleno: 0, gRelleno: 19,
};

export interface ModeloAlcantarilla {
  heks: string;
  /** coordenadas por id de nudo (1-based como en el .heks) */
  nudos: Map<number, [number, number, number]>;
  /** ids de los nudos de la losa superior, de izquierda a derecha */
  tablero: number[];
  /** ids de los nudos con muelle y su k (kN/m) */
  muelles: Array<{ id: number; k: number }>;
  /** barras: id, i, j, pieza */
  barras: Array<{ id: number; i: number; j: number; pieza: "sup" | "inf" | "muro"; t: number }>;
  /** carga permanente del relleno por nudo del tablero (kN, hacia abajo) */
  relleno: Map<number, number>;
  largo: number;
  avisos: string[];
}

const esMultiplo = (a: number, b: number) => Math.abs(a / b - Math.round(a / b)) < 1e-6;

export function modeloAlcantarilla(p: ParamsAlcantarilla): ModeloAlcantarilla {
  const avisos: string[] = [];
  const nC = Math.max(1, Math.round(p.nCeldas));
  const L = p.L, H = p.H, dx = p.dx;
  if (!esMultiplo(L, dx)) avisos.push(`La luz ${L} m no es múltiplo del paso ${dx} m: los muros no caen en nudo del tablero.`);
  const largo = nC * L;
  const nSup = Math.round(largo / dx);
  const nInfCelda = Math.max(2, Math.ceil(L / p.dxInf - 1e-9));
  const nMuro = Math.max(2, Math.ceil(H / p.dxInf - 1e-9));

  const nudos = new Map<number, [number, number, number]>();
  const porClave = new Map<string, number>();
  const L_: string[] = [];
  let nId = 0;
  const nudo = (x: number, z: number) => {
    const k = `${x.toFixed(6)},${z.toFixed(6)}`;
    let id = porClave.get(k);
    if (!id) {
      id = ++nId; porClave.set(k, id); nudos.set(id, [x, 0, z]);
      L_.push(`node ${id} ${+x.toFixed(6)} 0 ${+z.toFixed(6)}`);
    }
    return id;
  };
  // tablero primero: sus ids quedan de izquierda a derecha
  const tablero: number[] = [];
  for (let i = 0; i <= nSup; i++) tablero.push(nudo(+(i * largo / nSup).toFixed(9), H));
  // losa inferior
  const xsInf: number[] = [];
  for (let c = 0; c < nC; c++) for (let i = 0; i < nInfCelda; i++) xsInf.push(c * L + i * L / nInfCelda);
  xsInf.push(largo);
  const inferior = xsInf.map((x) => nudo(x, 0));
  // muros
  const muros: number[][] = [];
  for (let j = 0; j <= nC; j++) {
    const col: number[] = [];
    for (let k = 0; k <= nMuro; k++) col.push(nudo(j * L, k * H / nMuro));
    muros.push(col);
  }

  const barras: ModeloAlcantarilla["barras"] = [];
  let fId = 0;
  const seccion = (t: number) => {
    // franja de 1 m: b = 1, h = t. I33 (plano del pórtico) = b·t³/12; I22 = t·b³/12;
    // J de rectángulo (Roark): a·b³·(1/3 − 0.21·b/a·(1 − b⁴/(12a⁴))) con a ≥ b.
    const b = 1, a = Math.max(b, t), c = Math.min(b, t);
    return { A: b * t, I33: b * t ** 3 / 12, I22: t * b ** 3 / 12, J: a * c ** 3 * (1 / 3 - 0.21 * c / a * (1 - c ** 4 / (12 * a ** 4))) };
  };
  const barra = (i: number, j: number, t: number, pieza: "sup" | "inf" | "muro") => {
    const s = seccion(t);
    fId++;
    const nom = `${pieza === "sup" ? "LOSA_SUP" : pieza === "inf" ? "LOSA_INF" : "MURO"}_${Math.round(t * 100)}`;
    L_.push(`frame ${fId} ${i} ${j} ${p.E} ${+s.A.toPrecision(10)} ${+s.I22.toPrecision(10)} ${+s.I33.toPrecision(10)} ${+s.J.toPrecision(10)} ${p.nu} 2.4 ${t} 1 # ${nom}`);
    barras.push({ id: fId, i, j, pieza, t });
  };
  for (let i = 0; i < tablero.length - 1; i++) barra(tablero[i], tablero[i + 1], p.tSup, "sup");
  for (let i = 0; i < inferior.length - 1; i++) barra(inferior[i], inferior[i + 1], p.tInf, "inf");
  for (const col of muros) for (let k = 0; k < col.length - 1; k++) barra(col[k], col[k + 1], p.tMuro, "muro");

  // apoyos y muelles en la losa inferior
  const muelles: ModeloAlcantarilla["muelles"] = [];
  xsInf.forEach((x, i) => {
    const trib = ((i > 0 ? x - xsInf[i - 1] : 0) + (i < xsInf.length - 1 ? xsInf[i + 1] - x : 0)) / 2;
    const k = p.ks * trib * 1;
    const id = inferior[i];
    muelles.push({ id, k });
    L_.push(`support ${id} ${i === 0 ? 1 : 0} 1 0 1 0 1`);
    L_.push(`spring ${id} uz ${+k.toPrecision(10)}`);
  });

  // relleno: carga permanente γ·h por ancho tributario de cada nudo del tablero (1 m de franja)
  const relleno = new Map<number, number>();
  if (p.hRelleno > 0) {
    tablero.forEach((id, i) => {
      const x = nudos.get(id)![0];
      const xa = i > 0 ? nudos.get(tablero[i - 1])![0] : x, xb = i < tablero.length - 1 ? nudos.get(tablero[i + 1])![0] : x;
      relleno.set(id, p.gRelleno * p.hRelleno * (xb - xa) / 2);
    });
  }

  const cab = [
    `# Alcantarilla cajón · ${nC} celda(s) de ${L} m × ${H} m (a ejes) · franja de 1 m`,
    `# losa sup ${p.tSup} m · losa inf ${p.tInf} m · muros ${p.tMuro} m · E ${p.E} kN/m² · ks ${p.ks} kN/m³`,
    `# tablero con un nudo cada ${dx} m (los ejes del camión caen en nudo) · unidades kN, m`,
    `# Carga móvil HL-93: se calcula aparte, por líneas de influencia (examples/src/shared/cargaMovil.ts)`,
  ];
  // El relleno va como carga del modelo (caso Dead) para que se vea y se exporte; la carga
  // móvil se suma aparte, por superposición.
  const cargas = [...relleno].map(([id, P]) => `load ${id} 0 0 ${-(+P.toFixed(6))} 0 0 0`);
  const heks = [...cab, ...L_, ...cargas, "solve"].join("\n") + "\n";
  return { heks, nudos, tablero, muelles, barras, relleno, largo, avisos };
}
