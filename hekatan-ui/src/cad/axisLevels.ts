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
export function buildAxisGridMesh(axis: AxisGrid): THREE.Group {
  const g = new THREE.Group();
  g.name = `axis-${axis.label}`;

  // ── La línea, a raya-punto y con vuelo en los dos extremos ───────────────
  const A = new THREE.Vector3(...axis.start);
  const B = new THREE.Vector3(...axis.end);
  const dir = new THREE.Vector3().subVectors(B, A);
  const largo = dir.length() || 1;
  dir.divideScalar(largo);
  const a = A.clone().addScaledVector(dir, -AXIS_VUELO);
  const b = B.clone().addScaledVector(dir, AXIS_VUELO);

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
  const [x0, x1] = Array.isArray(extent) ? extent : [-extent, extent];
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
  sprite.position.set(x0 - 1.2, 0, lvl.z);
  // ~80x20 px. Con 0.16 (160 px de ancho) las cinco etiquetas de un edificio
  // de 4 pisos se apilaban una encima de otra y tapaban el centro del modelo.
  sprite.scale.set(0.08, 0.02, 1);
  sprite.userData.isLevelLabel = true;
  g.add(sprite);
  return g;
}
