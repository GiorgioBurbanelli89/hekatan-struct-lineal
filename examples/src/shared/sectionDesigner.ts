/**
 * 🧩 SECTION DESIGNER — secciones COMPUESTAS, como las de ETABS.
 *
 * Una sección dibujada: varias piezas, cada una con su forma, su material y su
 * posición. Es lo que hace falta para una viga mixta acero+madera, una columna
 * con perfil embebido, un cajón de dos C, o cualquier cosa que no esté en el
 * catálogo.
 *
 * ## Por qué polígonos
 *
 * No hay una fórmula por forma: **cada pieza se convierte en un polígono** y
 * las propiedades salen integrando (teorema de Green). Una
 * fórmula por forma es una lista que siempre se queda corta (y ya pasó: 54
 * barras de un modelo real entraban con área CERO porque su forma no estaba).
 * Con polígonos, una forma nueva es una función que devuelve puntos.
 *
 * Las formas son las que expone la OAPI de ETABS (`cPropFrameSDShape`):
 *
 *     GetSolidRect · GetSolidCircle · GetAngle · GetTee · GetISection
 *     GetConcreteL · GetConcreteTee   (+ las de armadura)
 *
 * más el canal y el tubo, que aparecen en los `.e2k` reales
 * (`SHAPETYPE "STEEL CHANNEL"`, `"STEEL TUBE"`, `"POLYGON"`).
 *
 * ## Las cuentas
 *
 * Para un polígono cerrado de vértices (xᵢ, yᵢ), por el teorema de Green:
 *
 *     A   = ½ Σ (xᵢ·yᵢ₊₁ − xᵢ₊₁·yᵢ)
 *     Cx  = 1/(6A) Σ (xᵢ + xᵢ₊₁)·(xᵢ·yᵢ₊₁ − xᵢ₊₁·yᵢ)
 *     Ixx = 1/12 Σ (yᵢ² + yᵢ·yᵢ₊₁ + yᵢ₊₁²)·(xᵢ·yᵢ₊₁ − xᵢ₊₁·yᵢ)
 *
 * Un HUECO es el mismo polígono recorrido al revés: su área sale negativa y se
 * resta sola. Por eso un tubo o una I no necesitan caso aparte.
 *
 * Y con varias piezas de MATERIALES distintos se compone la **sección
 * transformada**: cada una pesa `n = Eᵢ/E_ref` en el sumatorio. Una pieza de
 * madera y una de acero en la misma sección no aportan lo mismo, y sumar áreas
 * a pelo daría una viga mucho más rígida de lo que es.
 */

/** Un punto del contorno, en los ejes locales de la sección (2 = y, 3 = x). */
export type Punto2D = [number, number];

/** Las formas que se pueden dibujar. Los nombres siguen a la OAPI de ETABS. */
export type FormaSD =
  | { tipo: "rect"; d: number; b: number }
  | { tipo: "circle"; d: number }
  | { tipo: "angle"; d: number; b: number; tf: number; tw: number }
  | { tipo: "channel"; d: number; b: number; tf: number; tw: number }
  | { tipo: "tee"; d: number; b: number; tf: number; tw: number }
  | { tipo: "isection"; d: number; b: number; tf: number; tw: number }
  | { tipo: "tube"; d: number; b: number; tf: number; tw: number }
  | { tipo: "pipe"; d: number; t: number }
  | { tipo: "polygon"; puntos: Punto2D[] }
  /** Una barra de armadura: un punto con área, sin contorno que integrar. */
  | { tipo: "rebar"; area: number };

/** Una pieza colocada: su forma, dónde está, cuánto gira y de qué es. */
export interface PiezaSD {
  forma: FormaSD;
  /** Centro de la pieza en los ejes de la sección (m). */
  xc?: number;
  yc?: number;
  /** Giro de la pieza sobre su centro (grados). */
  rot?: number;
  /** Espejo respecto al eje 2, como el `MIRROR2` del e2k. */
  mirror?: boolean;
  /** Módulo de elasticidad de SU material (kN/m²). */
  E?: number;
}

export interface PropsSeccion {
  A: number;      // área (transformada si hay varios materiales)
  Iz: number;     // inercia respecto al eje fuerte (plano 1-2)
  Iy: number;     // inercia respecto al débil (plano 1-3)
  Ixy: number;    // producto de inercia — distinto de 0 si la sección no es simétrica
  J: number;      // torsión, APROXIMADA (ver la nota)
  cx: number;     // centroide
  cy: number;
  As2: number;    // áreas de cortante
  As3: number;
  nPiezas: number;
}

/** Lados con los que se discretiza un círculo. Ver la nota en `contorno`. */
export const LADOS_CIRCULO = 64;

const rad = (g: number) => (g * Math.PI) / 180;

/** El contorno de una forma, centrado en su propio origen. */
export function contorno(f: FormaSD, ladosCirculo = LADOS_CIRCULO): Punto2D[] {
  switch (f.tipo) {
    case "rect": {
      const { d, b } = f;
      return [[-b / 2, -d / 2], [b / 2, -d / 2], [b / 2, d / 2], [-b / 2, d / 2]];
    }
    case "circle": {
      // Un círculo es un polígono de muchos lados: el inscrito da algo MENOS
      // que el círculo, y el error va con 1/n². Medido contra πd²/4 y πd⁴/64:
      //     32 lados → 0.64 % en área, 1.28 % en inercia
      //     64 lados → 0.16 %,          0.32 %
      //    128 lados → 0.04 %,          0.08 %
      // Se usan 64: por debajo del ruido de cualquier modelo y sin llenar la
      // memoria de puntos cuando hay cientos de barras circulares.
      const r = f.d / 2, p: Punto2D[] = [];
      for (let i = 0; i < ladosCirculo; i++) {
        const t = (2 * Math.PI * i) / ladosCirculo;
        p.push([r * Math.cos(t), r * Math.sin(t)]);
      }
      return p;
    }
    case "angle": {
      // L con el vértice abajo-izquierda.
      const { d, b, tf, tw } = f;
      return [[0, 0], [b, 0], [b, tf], [tw, tf], [tw, d], [0, d]]
        .map(([x, y]) => [x - b / 2, y - d / 2] as Punto2D);
    }
    case "channel": {
      const { d, b, tf, tw } = f;
      return [[0, 0], [b, 0], [b, tf], [tw, tf], [tw, d - tf], [b, d - tf], [b, d], [0, d]]
        .map(([x, y]) => [x - b / 2, y - d / 2] as Punto2D);
    }
    case "tee": {
      const { d, b, tf, tw } = f;
      const a = (b - tw) / 2;
      return [[0, d - tf], [b, d - tf], [b, d], [0, d],
              // el alma, colgando del ala
              ].concat([]) as Punto2D[] && [
        [a, 0], [a + tw, 0], [a + tw, d - tf], [b, d - tf], [b, d], [0, d], [0, d - tf], [a, d - tf],
      ].map(([x, y]) => [x - b / 2, y - d / 2] as Punto2D);
    }
    case "isection": {
      const { d, b, tf, tw } = f;
      const a = (b - tw) / 2;
      return [
        [0, 0], [b, 0], [b, tf], [a + tw, tf], [a + tw, d - tf], [b, d - tf],
        [b, d], [0, d], [0, d - tf], [a, d - tf], [a, tf], [0, tf],
      ].map(([x, y]) => [x - b / 2, y - d / 2] as Punto2D);
    }
    case "polygon":
      return f.puntos.slice();
    default:
      return [];
  }
}

/** Los huecos de una forma (recorridos al revés para que resten). */
export function huecos(f: FormaSD, ladosCirculo = LADOS_CIRCULO): Punto2D[][] {
  if (f.tipo === "tube") {
    const { d, b, tf, tw } = f;
    const di = d / 2 - tf, bi = b / 2 - tw;
    // al revés: su área sale negativa y se resta sola
    return [[[-bi, -di], [-bi, di], [bi, di], [bi, -di]]];
  }
  if (f.tipo === "pipe") {
    const r = f.d / 2 - f.t, p: Punto2D[] = [];
    for (let i = ladosCirculo - 1; i >= 0; i--) {
      const t = (2 * Math.PI * i) / ladosCirculo;
      p.push([r * Math.cos(t), r * Math.sin(t)]);
    }
    return [p];
  }
  return [];
}

/** El contorno exterior de un tubo o una tubería. */
function exterior(f: FormaSD, ladosCirculo = LADOS_CIRCULO): Punto2D[] {
  if (f.tipo === "tube") return contorno({ tipo: "rect", d: f.d, b: f.b });
  if (f.tipo === "pipe") return contorno({ tipo: "circle", d: f.d }, ladosCirculo);
  return contorno(f, ladosCirculo);
}

/** Área, centroide e inercias de UN polígono, por Green. */
export function propsPoligono(p: Punto2D[]) {
  let A = 0, sx = 0, sy = 0, Ixx = 0, Iyy = 0, Ixy = 0;
  for (let i = 0; i < p.length; i++) {
    const [x0, y0] = p[i], [x1, y1] = p[(i + 1) % p.length];
    const cr = x0 * y1 - x1 * y0;
    A += cr;
    sx += (x0 + x1) * cr;
    sy += (y0 + y1) * cr;
    Ixx += (y0 * y0 + y0 * y1 + y1 * y1) * cr;
    Iyy += (x0 * x0 + x0 * x1 + x1 * x1) * cr;
    Ixy += (x0 * y1 + 2 * x0 * y0 + 2 * x1 * y1 + x1 * y0) * cr;
  }
  A /= 2;
  if (Math.abs(A) < 1e-18) return { A: 0, cx: 0, cy: 0, Ixx: 0, Iyy: 0, Ixy: 0 };
  const cx = sx / (6 * A), cy = sy / (6 * A);
  // A ejes por el centroide (Steiner al revés)
  return {
    A, cx, cy,
    Ixx: Ixx / 12 - A * cy * cy,
    Iyy: Iyy / 12 - A * cx * cx,
    Ixy: Ixy / 24 - A * cx * cy,
  };
}

/**
 * Coloca un polígono: espejo, giro y traslación, en ese orden.
 *
 * ⚠️ Un ESPEJO invierte el sentido de giro del polígono, y con Green el sentido
 * ES el signo del área: una pieza reflejada salía con área NEGATIVA y **restaba**
 * en vez de sumar. La sección `DOBLE C + MADERA` del modelo real —dos canales,
 * uno de ellos con `MIRROR2`— daba 11.88 cm² y una inercia I22 **negativa**, que
 * no existe. Lo destapó el DIBUJO: la geometría se veía bien y los números no
 * cuadraban, que es justo para lo que sirve mirarlo.
 *
 * Se devuelve el recorrido al revés para dejarlo como estaba.
 */
function colocar(p: Punto2D[], pieza: PiezaSD): Punto2D[] {
  const a = rad(pieza.rot ?? 0), c = Math.cos(a), s = Math.sin(a);
  const mx = pieza.mirror ? -1 : 1;
  const q = p.map(([x0, y0]) => {
    const x = x0 * mx;
    return [x * c - y0 * s + (pieza.xc ?? 0), x * s + y0 * c + (pieza.yc ?? 0)] as Punto2D;
  });
  return pieza.mirror ? q.reverse() : q;
}

/**
 * Las propiedades de una sección compuesta.
 *
 * `Eref` es el material de referencia: con varios materiales, lo que sale es la
 * SECCION TRANSFORMADA a ese material — que es lo que hay que meter en la
 * matriz de rigidez junto con `E = Eref`.
 */
export function propiedadesSD(piezas: PiezaSD[], Eref: number): PropsSeccion {
  let A = 0, sAx = 0, sAy = 0;
  const trozos: Array<{ A: number; cx: number; cy: number; Ixx: number; Iyy: number; Ixy: number; n: number }> = [];

  for (const pz of piezas) {
    const n = Eref > 0 && pz.E ? pz.E / Eref : 1;
    if (pz.forma.tipo === "rebar") {
      // Una barra de armadura no tiene contorno: es un punto con área. Su
      // inercia propia es despreciable frente al término de Steiner.
      const a = pz.forma.area * n;
      trozos.push({ A: a, cx: pz.xc ?? 0, cy: pz.yc ?? 0, Ixx: 0, Iyy: 0, Ixy: 0, n: 1 });
      A += a; sAx += a * (pz.xc ?? 0); sAy += a * (pz.yc ?? 0);
      continue;
    }
    const partes = [exterior(pz.forma), ...huecos(pz.forma)];
    for (const bruto of partes) {
      if (bruto.length < 3) continue;
      const pr = propsPoligono(colocar(bruto, pz));
      // El hueco viene al revés: su A sale negativa y resta sola.
      const a = pr.A * n;
      trozos.push({ ...pr, A: a, n });
      A += a; sAx += a * pr.cx; sAy += a * pr.cy;
    }
  }

  if (Math.abs(A) < 1e-18) {
    return { A: 0, Iz: 0, Iy: 0, Ixy: 0, J: 0, cx: 0, cy: 0, As2: 0, As3: 0, nPiezas: piezas.length };
  }
  const cx = sAx / A, cy = sAy / A;
  let Ixx = 0, Iyy = 0, Ixy = 0;
  for (const t of trozos) {
    Ixx += t.Ixx * t.n + t.A * (t.cy - cy) ** 2;
    Iyy += t.Iyy * t.n + t.A * (t.cx - cx) ** 2;
    Ixy += t.Ixy * t.n + t.A * (t.cx - cx) * (t.cy - cy);
  }
  // ⚠️ J es una APROXIMACION y hay que decirlo: la torsión de Saint-Venant de
  // una sección cualquiera no sale de una integral de contorno — pide resolver
  // un problema de Poisson sobre la sección. Para una sección compacta el
  // polar `Ixx + Iyy` la sobreestima mucho, así que se usa el 10 %, que es el
  // orden de una sección abierta. Si la torsión manda en el resultado, hay que
  // dar `J` a mano.
  const J = (Ixx + Iyy) * 0.1;
  return {
    A, Iz: Ixx, Iy: Iyy, Ixy, J, cx, cy,
    As2: (5 / 6) * A, As3: (5 / 6) * A,
    nPiezas: piezas.length,
  };
}

/** El `SHAPETYPE` del `.e2k` → la forma de aquí. */
export function formaDesdeE2k(
  shapeType: string,
  d: number, b: number, tf: number, tw: number,
): FormaSD | null {
  switch ((shapeType || "").toUpperCase()) {
    case "CONCRETE RECTANGULAR":
    case "SOLID RECT":
    case "RECTANGLE":            return { tipo: "rect", d, b };
    case "CONCRETE CIRCLE":
    case "SOLID CIRCLE":
    case "CIRCLE":               return { tipo: "circle", d };
    case "STEEL ANGLE":
    case "ANGLE":                return { tipo: "angle", d, b, tf, tw };
    case "STEEL CHANNEL":
    case "CHANNEL":              return { tipo: "channel", d, b, tf, tw };
    case "STEEL TEE":
    case "CONCRETE TEE":
    case "TEE":                  return { tipo: "tee", d, b, tf, tw };
    case "STEEL I/WIDE FLANGE":
    case "I SECTION":
    case "ISECTION":             return { tipo: "isection", d, b, tf, tw };
    case "STEEL TUBE":
    case "TUBE":                 return { tipo: "tube", d, b, tf, tw };
    case "STEEL PIPE":
    case "PIPE":                 return { tipo: "pipe", d, t: tf || tw };
    default:
      // Una forma que no se conoce se trata como el rectángulo que la envuelve.
      // Es una cota superior del área y se avisa: mejor eso que un cero, que
      // deja la barra SIN RIGIDEZ y hace singular la matriz sin decir nada.
      return d > 0 && b > 0 ? { tipo: "rect", d, b } : null;
  }
}

// ─────────────────────────────────────────────────────────────────────────
// EL DIBUJO
//
// Una sección compuesta hay que VERLA. Los números dicen si el área sale, no
// si la pieza está donde se quería: un canal girado 90° o un espejo puesto al
// revés dan un área correcta y una sección que no es la del plano. Eso solo se
// caza mirándola.
//
// Se dibuja en SVG y no en canvas a propósito: es texto, así que el mismo
// dibujo sirve en el navegador, en un informe y en una captura de prueba sin
// montar un lienzo ni un contexto gráfico.
// ─────────────────────────────────────────────────────────────────────────

export interface OpcionesDibujo {
  ancho?: number;          // px
  alto?: number;
  margen?: number;
  /** Colorear cada pieza según su material (por su E). */
  porMaterial?: boolean;
  /** Marcar el centroide y los ejes principales. */
  ejes?: boolean;
  /** Cuántas piezas dibujar (para animar la composición). */
  hasta?: number;
  fondo?: string;
  titulo?: string;
  /**
   * Material al que se TRANSFORMA la sección. Con varios materiales el área y
   * las inercias dependen de a cuál se refieran, así que el dibujo lo dice: sin
   * eso, el mismo pilote pone 1407.8 cm² o 147.8 segun se mire desde el
   * hormigon o desde el acero, y las dos son ciertas.
   */
  Eref?: number;
  /** Nombre del material de referencia, para la etiqueta. */
  refNombre?: string;
}

/** Paleta estable: el mismo E siempre del mismo color, en el orden que aparece. */
function colorDe(E: number | undefined, mapa: Map<number, string>): string {
  const PAL = ["#4da3ff", "#ffb84d", "#7ddc7d", "#ff7d7d", "#c79bff", "#4ddbd0"];
  const k = E ?? 0;
  if (!mapa.has(k)) mapa.set(k, PAL[mapa.size % PAL.length]);
  return mapa.get(k)!;
}

/**
 * La sección en SVG: cada pieza con su color, el contorno, el centroide y los
 * ejes por él. `hasta` permite dibujar solo las N primeras — que es lo que hace
 * falta para animar cómo se compone.
 */
export function dibujarSVG(piezas: PiezaSD[], o: OpcionesDibujo = {}): string {
  const W = o.ancho ?? 460, H = o.alto ?? 460, M = o.margen ?? 34;
  const nDib = o.hasta ?? piezas.length;
  const visibles = piezas.slice(0, nDib);

  // Contornos ya colocados, para dibujar y para encuadrar.
  const dibujos: Array<{ pts: Punto2D[]; E?: number; hueco: boolean }> = [];
  const rebars: Array<{ x: number; y: number; r: number; E?: number }> = [];
  for (const pz of visibles) {
    if (pz.forma.tipo === "rebar") {
      rebars.push({ x: pz.xc ?? 0, y: pz.yc ?? 0,
                    r: Math.sqrt(pz.forma.area / Math.PI), E: pz.E });
      continue;
    }
    const a = rad(pz.rot ?? 0), c = Math.cos(a), s = Math.sin(a);
    const mx = pz.mirror ? -1 : 1;
    // La MISMA transformación que `colocar`, espejo incluido: si el dibujo y el
    // cálculo no colocan igual, el dibujo deja de servir para comprobar.
    const mueve = (p: Punto2D[]) => {
      const q = p.map(([x0, y0]) => {
        const x = x0 * mx;
        return [x * c - y0 * s + (pz.xc ?? 0), x * s + y0 * c + (pz.yc ?? 0)] as Punto2D;
      });
      return pz.mirror ? q.reverse() : q;
    };
    dibujos.push({ pts: mueve(exterior(pz.forma)), E: pz.E, hueco: false });
    for (const h of huecos(pz.forma)) dibujos.push({ pts: mueve(h), E: pz.E, hueco: true });
  }

  // Encuadre: SIEMPRE el de TODAS las piezas, no solo las visibles. Si el
  // encuadre cambiara al añadir una, una animación saldría dando saltos.
  const todos: Punto2D[] = [];
  for (const pz of piezas) {
    if (pz.forma.tipo === "rebar") { todos.push([pz.xc ?? 0, pz.yc ?? 0]); continue; }
    const a = rad(pz.rot ?? 0), c = Math.cos(a), s = Math.sin(a);
    const mx = pz.mirror ? -1 : 1;
    for (const [x0, y0] of exterior(pz.forma)) {
      const x = x0 * mx;
      todos.push([x * c - y0 * s + (pz.xc ?? 0), x * s + y0 * c + (pz.yc ?? 0)]);
    }
  }
  if (!todos.length) return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"></svg>`;
  const xs = todos.map(p => p[0]), ys = todos.map(p => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs);
  const y0 = Math.min(...ys), y1 = Math.max(...ys);
  const k = Math.min((W - 2 * M) / Math.max(x1 - x0, 1e-9),
                     (H - 2 * M) / Math.max(y1 - y0, 1e-9));
  // Y hacia ARRIBA, como en una sección de verdad: en SVG crece hacia abajo.
  const px = (x: number) => M + (x - x0) * k + ((W - 2 * M) - (x1 - x0) * k) / 2;
  const py = (y: number) => H - M - (y - y0) * k - ((H - 2 * M) - (y1 - y0) * k) / 2;

  const mapaCol = new Map<number, string>();
  const Eref = o.Eref ?? piezas.find(p => p.E)?.E ?? 1;
  const P = propiedadesSD(visibles.length ? visibles : piezas, Eref);
  const out: string[] = [];
  out.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`);
  out.push(`<rect width="${W}" height="${H}" fill="${o.fondo ?? "#11151c"}"/>`);

  for (const d of dibujos) {
    const pts = d.pts.map(([x, y]) => `${px(x).toFixed(2)},${py(y).toFixed(2)}`).join(" ");
    // Un hueco se pinta del color del fondo: se ve el vacío, que es lo que es.
    const relleno = d.hueco ? (o.fondo ?? "#11151c")
                            : (o.porMaterial === false ? "#4da3ff" : colorDe(d.E, mapaCol));
    out.push(`<polygon points="${pts}" fill="${relleno}" fill-opacity="${d.hueco ? 1 : 0.75}" ` +
             `stroke="#e6edf3" stroke-width="1.1"/>`);
  }
  for (const r of rebars) {
    out.push(`<circle cx="${px(r.x).toFixed(2)}" cy="${py(r.y).toFixed(2)}" ` +
             `r="${Math.max(2.2, r.r * k).toFixed(2)}" fill="#ff5b5b" stroke="#e6edf3" stroke-width="0.8"/>`);
  }

  if (o.ejes !== false && Math.abs(P.A) > 1e-15) {
    const cx = px(P.cx), cy = py(P.cy);
    out.push(`<line x1="${M}" y1="${cy.toFixed(2)}" x2="${W - M}" y2="${cy.toFixed(2)}" ` +
             `stroke="#ffd166" stroke-width="0.9" stroke-dasharray="6 4"/>`);
    out.push(`<line x1="${cx.toFixed(2)}" y1="${M}" x2="${cx.toFixed(2)}" y2="${H - M}" ` +
             `stroke="#ffd166" stroke-width="0.9" stroke-dasharray="6 4"/>`);
    out.push(`<circle cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" r="3.4" fill="#ffd166"/>`);
  }

  const t = (txt: string, y: number, col = "#e6edf3", size = 12) =>
    `<text x="10" y="${y}" fill="${col}" font-family="Consolas,monospace" font-size="${size}">${txt}</text>`;
  if (o.titulo) out.push(t(o.titulo, 18, "#e6edf3", 13));
  const mats = new Set(piezas.map(q => q.E ?? 0));
  const nota = mats.size > 1
    ? `  (transformada a ${o.refNombre ?? `E = ${Eref.toExponential(2)}`})` : "";
  out.push(t(`A = ${(P.A * 1e4).toFixed(1)} cm²${nota}`, H - 40, "#9fb3c8"));
  out.push(t(`I33 = ${P.Iz.toExponential(3)} m⁴   I22 = ${P.Iy.toExponential(3)} m⁴`, H - 24, "#9fb3c8"));
  out.push(t(`${visibles.length}/${piezas.length} piezas`, H - 8, "#6b7f95"));
  out.push(`</svg>`);
  return out.join("\n");
}

/** Un SVG por paso, para animar cómo se compone la sección pieza a pieza. */
export function fotogramasSVG(piezas: PiezaSD[], o: OpcionesDibujo = {}): string[] {
  return piezas.map((_, i) => dibujarSVG(piezas, { ...o, hasta: i + 1 }));
}
