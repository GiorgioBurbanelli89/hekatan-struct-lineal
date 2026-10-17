/**
 * Ejes y niveles estilo Revit/AutoCAD.
 *
 * EJES (axisGrids): líneas rectas con círculo + letra (A, B, C, ...) en
 *   un extremo. Típicamente verticales en planta (líneas paralelas al eje Y)
 *   o horizontales (paralelas al X). Sirven para nombrar y referenciar
 *   ubicaciones en el modelo.
 *
 * NIVELES (levels): planos horizontales con etiqueta de cota (N+0.00,
 *   N+3.00, N+6.00, ...). Se ven como una línea + texto en elevación.
 *
 * Estado vive en window.__hekatanAxisGrids y __hekatanLevels (vanjs states
 * que se serializan a localStorage para persistir entre sesiones).
 *
 * El renderizado se hace en hekatan-ui via render functions invocadas
 * desde drawing.ts cuando los tools "axis" o "level" están activos.
 */
import * as THREE from "three";

export interface AxisGrid {
  /** Letra o número del eje (A, B, C, 1, 2, 3, ...) */
  label: string;
  /** Punto inicio en coords mundiales [x,y,z] */
  start: [number, number, number];
  /** Punto fin en coords mundiales [x,y,z] */
  end: [number, number, number];
}

export interface Level {
  /** Etiqueta del nivel (N+0.00, PB, PA, etc.) */
  label: string;
  /** Cota Z en metros */
  z: number;
  /**
   * De PISO o AUXILIAR, como en ETABS.
   *
   *   piso — planta de verdad: es la que sale como STORY en el .e2k / .s2k y la que
   *          reparte la masa. En Hekatan la marcan las cotas del propio modelo.
   *   aux  — plano de referencia: sirve para dibujar a esa altura (un descanso de
   *          escalera, el arranque de un muro) y NO es una planta del modelo.
   *
   * Sin tipo se entiende «aux»: los que añade el usuario a mano no crean plantas.
   */
  tipo?: "piso" | "aux";
}

// ── Los ejes se dibujan como EJES, no como barras ──────────────────────────
//
// Estaban en rosa coral saturado y con línea CONTINUA a opacidad 0.85. Dos
// cosas mal:
//
//  · Un eje de replanteo se dibuja desde siempre con línea de eje, a
//    RAYA-PUNTO. Es lo que lo distingue a simple vista de una barra de la
//    estructura; con línea continua un eje parece una viga más.
//  · Un rosa saturado por delante de todo compite con el modelo, que es lo
//    que se está mirando. El eje es una referencia: tiene que estar y no
//    llamar la atención.
//
// Gris azulado tenue y trazo raya-punto, como en Revit y en cualquier plano.
const AXIS_COLOR = 0x8fa3b8;
const AXIS_LABEL_BG = "rgba(15,23,42,0.92)";   // burbuja oscura, borde claro
const AXIS_LABEL_FG = "#cbd5e1";
/** Raya-punto: [raya, hueco, punto, hueco] en metros. */
const AXIS_DASH = 0.55, AXIS_GAP = 0.28;
/**
 * Cuánto SOBRESALE el eje del modelo antes de la burbuja, en metros.
 * La burbuja iba justo en el extremo del eje, que es el borde de la planta,
 * así que caía encima de las columnas de esquina. En un plano la burbuja
 * siempre queda fuera del dibujo, colgando de una prolongación.
 */
const AXIS_VUELO = 1.6;
const LEVEL_COLOR = 0x60a5fa;      // azul cielo
const LEVEL_LABEL_BG = "rgba(15,23,42,0.92)";
const LEVEL_LABEL_FG = "#bfdbfe";

/**
 * Genera el siguiente label automático tipo Revit:
 *   - "A" → "B" → ... → "Z" → "AA" → "AB" → ...
 *   - "1" → "2" → ... → "10" → "11" → ...
 * Si labels existentes son letras, sigue con letras. Si son números, números.
 */
export function nextAxisLabel(existing: string[]): string {
  if (existing.length === 0) return "A";
  const last = existing[existing.length - 1];
  // Numérico
  if (/^\d+$/.test(last)) {
    return String(parseInt(last) + 1);
  }
  // Alfabético — incremento estilo Excel (A→B, Z→AA)
  let s = last.toUpperCase();
  let i = s.length - 1;
  const arr = s.split("");
  while (i >= 0) {
    if (arr[i] === "Z") {
      arr[i] = "A";
      i--;
    } else {
      arr[i] = String.fromCharCode(arr[i].charCodeAt(0) + 1);
      return arr.join("");
    }
  }
  return "A" + arr.join("");
}

/**
 * Genera el siguiente label de nivel.
 *   - PB → P1 → P2 → ...
 *   - N+0.00 → N+3.00 → ...
 * Default usa "N+{z}.00".
 */
export function nextLevelLabel(existing: Level[], z: number): string {
  // Si todos los existentes empiezan con "N+" o "N-", seguir el patrón
  const allN = existing.length > 0 && existing.every(l => /^N[+-]/.test(l.label));
  if (allN || existing.length === 0) {
    const sign = z >= 0 ? "+" : "";
    return `N${sign}${z.toFixed(2)}`;
  }
  return `Nivel ${existing.length + 1}`;
}

/**
 * Construye un mesh THREE.Group con la línea del eje + sprite de etiqueta
 * (círculo con la letra/número). El sprite es siempre face-camera y de
 * tamaño constante en pantalla (no crece con zoom).
 */

/**
 * La etiqueta (burbuja de eje, rótulo de nivel) mide lo mismo EN PANTALLA siempre, así que, centrada en
 * la punta de la línea, al alejar la vista caía encima del modelo (Jorge, 17-oct-2026: «los textos
 * colisionan con el dibujo»). Se ancla por su borde INTERIOR a la punta y crece HACIA FUERA, en la
 * dirección en que la línea sale del modelo tal como se ve en pantalla (se recalcula en cada cuadro).
 */
// Regla de Jorge (17-oct-2026): «no puede haber colisiones de gráficas, texto, etc.». Cada cuadro, las
// etiquetas se van apuntando con su rectángulo en pantalla; la que pisa a una ya pintada no se pinta (en
// una vista casi de frente, las burbujas 1-2-3-4 caían una encima de otra).
let marcoEtiquetas = -1;
const ocupadas: number[][] = [];
/** Borde de la rejilla en planta (x0, x1, y0, y1). Regla de Jorge (17-oct-2026): los rótulos y las
 *  burbujas van FUERA de la rejilla, nunca dentro; las líneas de eje y de nivel llegan hasta su borde. */
function bordeRejilla(): [number, number, number, number] | null {
  const g = (window as any).__hekatanGridConfig; if (!g) return null;
  if (g.rect) return [g.rect.x0, g.rect.x1, g.rect.y0, g.rect.y1];
  const h = (g.gridSize ?? 30) / 2; return [-h, h, -h, h];
}
const FUERA = 0.4;   // cuánto sale la línea más allá del borde, para que la etiqueta no lo toque

function anclarHaciaFuera(sprite: THREE.Sprite, desde: THREE.Vector3, punta: THREE.Vector3, ocultarEnPlanta = false) {
  const a = new THREE.Vector3(), b = new THREE.Vector3(), mira = new THREE.Vector3(), tam = new THREE.Vector2();
  sprite.onBeforeRender = (renderer, _s, camera) => {
    // `sizeAttenuation: false` solo vale con cámara en PERSPECTIVA (three multiplica por la profundidad).
    // Con la ortográfica de planta la escala se lee en METROS y la burbuja medía 3 cm: no se veía.
    // Se pasa la fracción de pantalla a metros con el alto del encuadre ortográfico.
    const base = (sprite.userData.escalaPantalla ??= [sprite.scale.x, sprite.scale.y]) as number[];
    const oc = camera as THREE.OrthographicCamera;
    if (oc.isOrthographicCamera) {
      const alto = (oc.top - oc.bottom) / (oc.zoom || 1);
      sprite.scale.set(base[0] * alto, base[1] * alto, 1);
    } else sprite.scale.set(base[0], base[1], 1);
    // el rótulo de nivel no dice nada mirando desde arriba (todos caen en la misma línea, apilados)

    a.copy(desde).applyMatrix4(sprite.parent?.matrixWorld ?? new THREE.Matrix4()).project(camera);
    b.copy(punta).applyMatrix4(sprite.parent?.matrixWorld ?? new THREE.Matrix4()).project(camera);
    let dx = b.x - a.x, dy = b.y - a.y; const L = Math.hypot(dx, dy);
    if (L < 1e-9) sprite.center.set(0.5, 0.5);
    else {
      dx /= L; dy /= L;
      // el centro del sprite se corre al lado contrario: su borde queda en la punta y el resto, fuera
      const k = Math.max(Math.abs(dx), Math.abs(dy));
      sprite.center.set(0.5 - 0.5 * dx / k, 0.5 - 0.5 * dy / k);
    }
    const mat = sprite.material as THREE.SpriteMaterial;
    mat.opacity = 1;
    if (ocultarEnPlanta) {
      camera.getWorldDirection(mira);
      if (Math.abs(mira.z) > 0.98) { mat.opacity = 0; return; }
    }
    // rectángulo en pantalla (px): centro proyectado + tamaño (fracción del alto) corrido por `center`
    const f = renderer.info.render.frame;
    if (f !== marcoEtiquetas) { marcoEtiquetas = f; ocupadas.length = 0; }
    renderer.getSize(tam);
    const base2 = sprite.userData.escalaPantalla as number[];
    const hPx = base2[1] * tam.y * 1.2, wPx = base2[0] * tam.y * 1.2;   // 1.2: un poco de aire entre etiquetas
    const cx = (b.x * 0.5 + 0.5) * tam.x + (0.5 - sprite.center.x) * wPx;
    const cy = (-b.y * 0.5 + 0.5) * tam.y - (0.5 - sprite.center.y) * hPx;
    const r = [cx - wPx / 2, cy - hPx / 2, cx + wPx / 2, cy + hPx / 2];
    if (ocupadas.some((o) => r[0] < o[2] && r[2] > o[0] && r[1] < o[3] && r[3] > o[1])) { mat.opacity = 0; return; }
    ocupadas.push(r);
  };
}

export function buildAxisGridMesh(axis: AxisGrid): THREE.Group {
  const g = new THREE.Group();
  g.name = `axis-${axis.label}`;

  // ── La línea, a raya-punto y con vuelo en los dos extremos ───────────────
  const A = new THREE.Vector3(...axis.start);
  const B = new THREE.Vector3(...axis.end);
  const dir = new THREE.Vector3().subVectors(B, A);
  const largo = dir.length() || 1;
  dir.divideScalar(largo);
  // vuelo proporcional al eje (10 % de su largo, mínimo el de siempre): con 1 m fijo, en un edificio de
  // 24 m la burbuja quedaba pegada a la columna de esquina
  let vuelo = Math.max(AXIS_VUELO, 0.1 * largo), vueloA = vuelo;
  // hasta el borde de la rejilla y un poco más: la burbuja queda FUERA
  const bd = bordeRejilla();
  if (bd) {
    const hasta = (P: THREE.Vector3, d: THREE.Vector3) => {
      let t = Infinity;
      if (d.x > 1e-9) t = Math.min(t, (bd[1] - P.x) / d.x); else if (d.x < -1e-9) t = Math.min(t, (bd[0] - P.x) / d.x);
      if (d.y > 1e-9) t = Math.min(t, (bd[3] - P.y) / d.y); else if (d.y < -1e-9) t = Math.min(t, (bd[2] - P.y) / d.y);
      return isFinite(t) && t > 0 ? t + FUERA : null;
    };
    vuelo = hasta(B, dir) ?? vuelo; vueloA = hasta(A, dir.clone().negate()) ?? vueloA;
  }
  const a = A.clone().addScaledVector(dir, -vueloA);
  const b = B.clone().addScaledVector(dir, vuelo);

  const lineGeo = new THREE.BufferGeometry().setFromPoints([a, b]);
  // `LineDashedMaterial` NO dibuja los trazos si falta `computeLineDistances()`:
  // sale una línea continua, exactamente igual que antes y sin ningún aviso.
  const lineMat = new THREE.LineDashedMaterial({
    color: AXIS_COLOR, transparent: true, opacity: 0.55,
    dashSize: AXIS_DASH, gapSize: AXIS_GAP,
  });
  const line = new THREE.Line(lineGeo, lineMat);
  line.computeLineDistances();
  g.add(line);

  // Sprite con círculo + letra en el EXTREMO end (estilo Revit)
  const canvas = document.createElement("canvas");
  canvas.width = 128; canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  // Burbuja OSCURA con aro claro y la letra clara, en vez de un disco rosa
  // relleno. Sobre el modelo, un circulo de color solido es una mancha; el aro
  // deja ver lo que hay detras y sigue leyendose.
  ctx.fillStyle = AXIS_LABEL_BG;
  ctx.beginPath();
  ctx.arc(64, 64, 55, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = AXIS_LABEL_FG;
  ctx.lineWidth = 5;
  ctx.stroke();
  ctx.fillStyle = AXIS_LABEL_FG;
  ctx.font = "bold 60px Consolas, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(axis.label, 64, 68);
  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  // `sizeAttenuation: false` = el tamaño es EN PANTALLA, no en metros.
  //
  // Con la escala en world units la burbuja crecia al acercar la camara, y con
  // `depthTest: false` ademas se pinta siempre por delante: las dos juntas
  // llenaban el viewport de rosa y azul y tapaban la estructura entera. Se
  // estuvo buscando "el plano cian que tapa" durante dos builds y no habia
  // ningun plano — eran estas etiquetas a pantalla completa
  // (cli/shots/ctl_ribbon/frame_08.png).
  //
  // En Revit la burbuja de un eje mide lo mismo en pantalla siempre, se este
  // mirando la planta entera o un nudo: es un simbolo, no un objeto. Con
  // sizeAttenuation la escala pasa a ser fraccion de la altura del viewport,
  // asi que 0.3 m -> 0.045 de pantalla (~45 px en 1000).
  const spriteMat = new THREE.SpriteMaterial({ map: tex, depthTest: false, sizeAttenuation: false });
  const sprite = new THREE.Sprite(spriteMat);
  // Al final del VUELO, no en el extremo del eje: ahi esta el borde de la
  // planta y la burbuja caia justo encima de las columnas de esquina.
  sprite.position.copy(b);
  anclarHaciaFuera(sprite, B, b);
  // 0.028 = 2.8 % de la altura del viewport, ~28 px en una pantalla de 1000.
  // Con 0.045 (45 px) las burbujas de ejes contiguos se tocaban entre si.
  sprite.scale.set(0.028, 0.028, 1);
  sprite.userData.isAxisLabel = true;
  g.add(sprite);
  return g;
}

/**
 * Construye un mesh para un nivel (línea horizontal larga + label "N+0.00").
 * El nivel se dibuja extendido en X (de -extent a +extent) a la cota Z dada.
 */
export function buildLevelMesh(
  lvl: Level,
  extent: number | [number, number] = 20,
): THREE.Group {
  const g = new THREE.Group();
  g.name = `level-${lvl.label}`;
  // El nivel abarca el RANGO EN X DEL MODELO, no un +-extent centrado en el
  // origen. Una estructura se dibuja creciendo desde (0,0) hacia +X, asi que
  // una linea simetrica se pasa de largo por el lado negativo y se queda corta
  // por el positivo — y la etiqueta, colgada de ese extremo, acababa a veinte
  // metros del modelo, detras del panel de Settings.
  const [xm0, x1] = Array.isArray(extent) ? extent : [-extent, extent];
  // la línea sale por la izquierda lo mismo que vuelan los ejes (10 % del ancho): ahí va el rótulo
  const bd = bordeRejilla();
  const x0 = bd ? Math.min(bd[0], xm0) - FUERA : xm0 - Math.max(1.2, 0.1 * (x1 - xm0));
  const lineGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(x0, 0, lvl.z),
    new THREE.Vector3(x1, 0, lvl.z),
  ]);
  const lineMat = new THREE.LineDashedMaterial({
    color: LEVEL_COLOR, transparent: true, opacity: 0.7,
    dashSize: 0.3, gapSize: 0.15,
  });
  const line = new THREE.Line(lineGeo, lineMat);
  line.computeLineDistances();
  g.add(line);
  // Sprite con label "N+0.00" en el extremo derecho
  const canvas = document.createElement("canvas");
  canvas.width = 256; canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  // Mismo criterio que la burbuja de eje: fondo oscuro, borde y texto del
  // color del nivel. El rectangulo azul relleno tapaba lo que hubiera detras.
  ctx.fillStyle = LEVEL_LABEL_BG;
  ctx.fillRect(0, 0, 256, 64);
  ctx.strokeStyle = LEVEL_LABEL_FG;
  ctx.lineWidth = 3;
  ctx.strokeRect(2, 2, 252, 60);
  ctx.fillStyle = LEVEL_LABEL_FG;
  ctx.font = "bold 36px Consolas, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(lvl.label, 128, 36);
  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  // Igual que la burbuja: tamano en pantalla, no en metros. La etiqueta es
  // 4:1 (256x64 px), asi que la escala mantiene esa proporcion.
  const spriteMat = new THREE.SpriteMaterial({ map: tex, depthTest: false, sizeAttenuation: false });
  const sprite = new THREE.Sprite(spriteMat);
  // A la IZQUIERDA del origen, no a la derecha. Una estructura se dibuja
  // creciendo hacia +X, asi que en x = extent+1 la etiqueta caia justo encima
  // del modelo y las cinco de un edificio de 4 pisos se apilaban en el centro
  // de la pantalla (cli/shots/ctl_ribbon/frame_07.png). Del lado negativo
  // quedan fuera del dibujo, que es donde va la cota de niveles en un alzado.
  // Pegada al arranque de la linea y por fuera: es donde va la cota de niveles
  // en un alzado.
  sprite.position.set(x0, 0, lvl.z);
  anclarHaciaFuera(sprite, new THREE.Vector3(xm0, 0, lvl.z), new THREE.Vector3(x0, 0, lvl.z), true);
  // ~80x20 px. Con 0.16 (160 px de ancho) las cinco etiquetas de un edificio
  // de 4 pisos se apilaban una encima de otra y tapaban el centro del modelo.
  sprite.scale.set(0.08, 0.02, 1);
  sprite.userData.isLevelLabel = true;
  g.add(sprite);
  return g;
}
