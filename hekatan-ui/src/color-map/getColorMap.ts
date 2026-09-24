import * as THREE from "three";
import { Node, Element } from "hekatan-fem";

import { Lut } from "three/addons/math/Lut.js";
import van, { State } from "vanjs-core";
import { fixedColorMapRange } from "../viewer/getViewer";

// CSI contour colormap — EXTRAÍDO (no inventado) de la tabla "OPTIONS - COLORS - OUTPUT",
// fila "Screen"/"Screen Classic", de archivos escritos por los TRES programas (19-sep-2026):
//   SAFE 22.6  → …/scratchpad/mod002/MOD_002.f2k
//   SAP2000    → hekatan-struct/cli/shots/boveda_csi_ventanas/boveda_desde_sap.s2k
//   ETABS      → galpon-bodega-electoral/pm_etabs.e2k
// Los 15 Contour1..15 son BIT A BIT IDÉNTICOS en los tres archivos:
//   13107400, 6553828, Red, 16639, Orange, 43775, 54527, Yellow, 65408, Green,
//   8453888, Cyan, 16755200, 16733440, Blue
// Los números son COLORREF de Windows (0x00BBGGRR, valor = R + 256·G + 65536·B). Decodificados:
//   Contour1  13107400 = RGB(200,  0,200)   Contour9   65408   = RGB(128,255,  0)
//   Contour2   6553828 = RGB(228,  0,100)   Contour11 8453888  = RGB(  0,255,128)
//   Contour4     16639 = RGB(255, 64,  0)   Contour13 16755200 = RGB(  0,170,255)
//   Contour6     43775 = RGB(255,170,  0)   Contour14 16733440 = RGB(  0, 85,255)
//   Contour7     54527 = RGB(255,212,  0)
// Los nombres (Red/Orange/Yellow/Green/Cyan/Blue) NO están numéricos en ningún archivo de CSI
// del repo (grep sin resultado). Se despejan de los propios números: cada color con nombre cae
// EXACTO en el punto medio (interpolación RGB lineal, verificado a 0-1 de diferencia por
// redondeo) entre sus dos vecinos numéricos — p.ej. Contour4=(255,64,0) es el punto medio entre
// Contour3=Red y Contour5=Orange ⇒ Orange = 2·(255,64,0) − Red(255,0,0) = (255,128,0). Con eso:
//   Red=(255,0,0)  Orange=(255,128,0)  Yellow=(255,255,0)  Green=(0,255,0)  Cyan=(0,255,255)  Blue=(0,0,255)
// (Orange=(255,128,0) es la del propio archivo, distinta de Color.Orange de .NET (255,165,0) —
// por eso hay que despejarla del archivo y no usar el estándar de biblioteca.)
// Contour1 es el extremo NEGATIVO (máx. compresión, magenta) y Contour15 el positivo (azul),
// verificado contra el orden izquierda→derecha de la barra real de SAFE (magenta→rojo→naranja→
// amarillo→verde→cian→azul). Las 15 bandas son EVENLY spaced (i/14) — así se generan sin volver
// a inventar posiciones.
const CSI_CONTOUR_15: [number, number, number][] = [
  [200,   0, 200],  // Contour1  13107400 (extremo negativo / máx compresión)
  [228,   0, 100],  // Contour2   6553828
  [255,   0,   0],  // Contour3  Red
  [255,  64,   0],  // Contour4     16639
  [255, 128,   0],  // Contour5  Orange
  [255, 170,   0],  // Contour6     43775
  [255, 212,   0],  // Contour7     54527
  [255, 255,   0],  // Contour8  Yellow
  [128, 255,   0],  // Contour9     65408
  [  0, 255,   0],  // Contour10 Green
  [  0, 255, 128],  // Contour11  8453888
  [  0, 255, 255],  // Contour12 Cyan
  [  0, 170, 255],  // Contour13 16755200
  [  0,  85, 255],  // Contour14 16733440
  [  0,   0, 255],  // Contour15 Blue (extremo positivo)
];
const CSI_CONTOUR_15_STOPS: [number, number, number, number][] =
  CSI_CONTOUR_15.map(([r, g, b], i) => [i / (CSI_CONTOUR_15.length - 1), r, g, b]);

/** Paletas cuya barra debe dibujarse en 15 BANDAS DISCRETAS (estilo CSI real), no degradado
 *  continuo — "safe"/"etabs"/"sap2000" llevan la MISMA tabla Contour1..15 extraída arriba. */
const DISCRETE_CSI_PALETTES = new Set(["safe", "etabs", "sap2000", "csi"]);
export function isDiscreteCsiPalette(name: string): boolean {
  return DISCRETE_CSI_PALETTES.has(name);
}

// Paletas seleccionables. safe/etabs/sap2000 son la MISMA tabla CSI (idéntica en los 3
// programas, ver arriba). Las demás son alternativas perceptuales/clásicas para quien prefiera.
const PALETTES: Record<string, [number, number, number, number][]> = {
  safe: CSI_CONTOUR_15_STOPS,
  etabs: CSI_CONTOUR_15_STOPS,
  sap2000: CSI_CONTOUR_15_STOPS,
  csi: CSI_CONTOUR_15_STOPS,                             // alias histórico (compat)
  jet_r: [                                               // rojo(máx)→azul(mín)
    [0.0, 200, 0, 0], [0.15, 255, 80, 0], [0.32, 255, 200, 0], [0.48, 180, 255, 0],
    [0.6, 0, 230, 90], [0.74, 0, 220, 230], [0.88, 0, 110, 255], [1.0, 0, 0, 180]],
  jet: [                                                 // azul(mín)→rojo(máx)
    [0.0, 0, 0, 180], [0.12, 0, 110, 255], [0.26, 0, 220, 230], [0.4, 0, 230, 90],
    [0.52, 180, 255, 0], [0.68, 255, 200, 0], [0.85, 255, 80, 0], [1.0, 200, 0, 0]],
  viridis: [
    [0.0, 68, 1, 84], [0.25, 59, 82, 139], [0.5, 33, 145, 140], [0.75, 94, 201, 98], [1.0, 253, 231, 37]],
};
/** Paleta activa (seleccionable desde Settings). Por defecto la de SAFE (cimentaciones). */
export const colorMapPalette: State<string> = van.state("safe");
// Gancho para verificación headless (puppeteer): colorMapPalette es un singleton de módulo,
// no vive en el objeto `settings` de cada viewer, así que sin esto un script externo no
// puede cambiar de paleta. `window.__hekatanColorPalette.val = "etabs"` etc.
if (typeof window !== "undefined") {
  (window as any).__hekatanColorPalette = colorMapPalette;
}
/** De qué elementos sale el RANGO del colormap: "auto" = todas las cáscaras, "muros" = solo las
 *  verticales, "losas" = solo las horizontales. Con un rango global, un muro que trabaja a 10 kN/m²
 *  al lado de otro a 110 sale entero en la banda de abajo y "no se ve su colormap" (Jorge, 6-sep-2026):
 *  el número es correcto, la escala no le sirve. Con "muros" cada familia se mira con su propia escala. */
export const colorMapScope: State<string> = van.state("auto");

/** Lookup en la palette ACTIVA. Las paletas CSI (safe/etabs/sap2000) son de 15 BANDAS
 *  DISCRETAS (sin interpolar, como el "Fill" de SAFE/ETABS/SAP2000: cada valor cae en UNA
 *  banda con un color sólido, no en un degradado). Las demás (jet/jet_r/viridis) siguen
 *  interpolando linealmente entre sus stops. */
function sap2000Color(t: number): [number, number, number] {
  t = Math.max(0, Math.min(1, t));
  const palName = colorMapPalette.val;
  const pal = PALETTES[palName] ?? CSI_CONTOUR_15_STOPS;
  if (isDiscreteCsiPalette(palName)) {
    const n = pal.length;
    const idx = Math.min(n - 1, Math.floor(t * n));
    const [, r, g, b] = pal[idx];
    return [r, g, b];
  }
  for (let i = 0; i < pal.length - 1; i++) {
    const [t0, r0, g0, b0] = pal[i];
    const [t1, r1, g1, b1] = pal[i + 1];
    if (t <= t1) {
      const f = (t - t0) / (t1 - t0);
      return [r0 + (r1 - r0) * f, g0 + (g1 - g0) * f, b0 + (b1 - b0) * f];
    }
  }
  const last = pal[pal.length - 1];
  return [last[1], last[2], last[3]];
}

/** Construye textura 1D 256-pixel del colormap SAP2000 para el shader. */
function buildSap2000Texture(): THREE.DataTexture {
  const N = 256;
  const data = new Uint8Array(N * 4);
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    const [r, g, b] = sap2000Color(t);
    data[i * 4 + 0] = r;
    data[i * 4 + 1] = g;
    data[i * 4 + 2] = b;
    data[i * 4 + 3] = 255;
  }
  const tex = new THREE.DataTexture(data, N, 1, THREE.RGBAFormat);
  // Paletas CSI (safe/etabs/sap2000): filtro NEAREST → bordes de banda NÍTIDOS, sin
  // mezclar un texel del sample 256 con el vecino (como el "Fill" real de SAFE/ETABS/
  // SAP2000, no un degradado). Las continuas siguen con LinearFilter.
  const nearest = isDiscreteCsiPalette(colorMapPalette.val);
  tex.minFilter = nearest ? THREE.NearestFilter : THREE.LinearFilter;
  tex.magFilter = nearest ? THREE.NearestFilter : THREE.LinearFilter;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.needsUpdate = true;
  return tex;
}

/** Gradiente CSS de la leyenda, construido de la paleta ACTIVA (top=t=1 → bottom=t=0,
 *  igual orientación que los markers de valor). Reemplaza el gradiente hardcodeado.
 *
 *  Paletas CSI (safe/etabs/sap2000): 15 BANDAS DISCRETAS con bordes duros (dos color-stops
 *  en el mismo % → CSS no interpola entre ellos), igual que la barra real de SAFE/ETABS/
 *  SAP2000. Las demás paletas (jet/jet_r/viridis) siguen como degradado continuo. */
export function legendGradientCss(): string {
  const palName = colorMapPalette.val;
  if (isDiscreteCsiPalette(palName)) {
    const pal = PALETTES[palName] ?? CSI_CONTOUR_15_STOPS;
    const n = pal.length;
    const stops: string[] = [];
    for (let i = 0; i < n; i++) {
      const bandIdx = n - 1 - i;                 // top (i=0) = banda más alta (t≈1)
      const [, r, g, b] = pal[bandIdx];
      const c = `rgb(${r | 0},${g | 0},${b | 0})`;
      const p0 = ((i / n) * 100).toFixed(4);
      const p1 = (((i + 1) / n) * 100).toFixed(4);
      stops.push(`${c} ${p0}%`, `${c} ${p1}%`);
    }
    return `linear-gradient(${stops.join(",")})`;
  }
  const N = 12, stops: string[] = [];
  for (let i = 0; i <= N; i++) {
    const t = 1 - i / N;                       // top (i=0) = t=1, bottom (i=N) = t=0
    const [r, g, b] = sap2000Color(t);
    stops.push(`rgb(${r | 0},${g | 0},${b | 0}) ${((i / N) * 100).toFixed(0)}%`);
  }
  return `linear-gradient(${stops.join(",")})`;
}

/** Rango del colormap: MIN/MAX REAL de los valores finitos (como SAFE/ETABS/SAP2000), salvo que el
 *  selector «Rango colormap» diga «todas, recortando picos»: entonces percentiles 1 y 99 (lo que se puso
 *  el 6-sep-2026 para un pico de vonMises en la base de un muro; lo que queda fuera se satura al color
 *  del extremo). Si todo es positivo, el mínimo es 0; si todo es negativo, el máximo es 0. */
/** Lo fija el visor antes de pintar: ¿el campo es un DESPLAZAMIENTO (Ux/Uy/Uz, ux/uy/uz de sólido)? */
let campoEsDesplazamiento = false;
export function setCampoEsDesplazamiento(v: boolean) { campoEsDesplazamiento = v; }
export function robustRange(valid: number[]): [number, number] {
  if (!valid.length) return [0, 1];
  const s = [...valid].sort((a, b) => a - b);
  const q = (f: number) => s[Math.min(s.length - 1, Math.max(0, Math.round(f * (s.length - 1))))];
  // Por defecto el MIN/MAX REAL, como SAFE/ETABS/SAP2000: la barra tiene que llegar al pico (Jorge,
  // 22-sep-2026: la losa con ductos marcaba −4.01 mm con la flecha real en −4.78). El recorte p1–p99
  // queda como opción del selector «Rango colormap» → «todas, recortando picos».
  // Desplazamientos: campo suave, sin singularidades -> min/max real. Esfuerzos/fuerzas (von Mises, presion,
  // momentos): una carga puntual o una esquina crean un pico SINGULAR que se come la escala (bulbo de presiones,
  // conexiones, placas base: todo magenta, revision por fotogramas 23-sep-2026) -> p1-p99.
  const sc = colorMapScope.val;
  const recortar = s.length >= 20 && (sc === "robusto" || (sc !== "real" && !campoEsDesplazamiento));
  let vMin = recortar ? q(0.01) : s[0];
  let vMax = recortar ? q(0.99) : s[s.length - 1];
  if (vMin >= 0 && vMax > 0) vMin = 0;
  if (vMax <= 0 && vMin < 0) vMax = 0;
  return [vMin, vMax];
}

export function getColorMap(
  nodes: State<Node[]>,
  elements: State<Element[]>,
  values: State<number[]>
): THREE.Mesh {
  // Fallback Lut (no usado pero conservado para compatibilidad)
  const lut = new Lut();
  void lut;

  // ── ShaderMaterial estilo Calcpad: interpolación POR VALOR + lookup en
  // textura 1D del colormap. Esto da bandas NÍTIDAS (no gradiente RGB feo).
  // Incluye chunks de Three.js para soporte de clipping planes (cortes X/Y/Z).
  const cmapTex = buildSap2000Texture();
  const material = new THREE.ShaderMaterial({
    uniforms: {
      cmap: { value: cmapTex },
      ambient: { value: 0.95 },
    },
    vertexShader: `
      #include <common>
      #include <clipping_planes_pars_vertex>
      attribute float scalar;
      varying float vScalar;
      void main() {
        vScalar = scalar;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        #include <clipping_planes_vertex>
      }
    `,
    fragmentShader: `
      #include <common>
      #include <clipping_planes_pars_fragment>
      uniform sampler2D cmap;
      uniform float ambient;
      varying float vScalar;
      void main() {
        #include <clipping_planes_fragment>
        // Si NaN (vScalar < -0.5 sentinel), gris neutro
        if (vScalar < -0.5) {
          gl_FragColor = vec4(0.5, 0.5, 0.5, 1.0);
          return;
        }
        vec3 color = texture2D(cmap, vec2(clamp(vScalar, 0.0, 1.0), 0.5)).rgb;
        gl_FragColor = vec4(color * ambient, 1.0);
      }
    `,
    side: THREE.DoubleSide,
    transparent: false,
    clipping: true,  // habilitar soporte de clipping planes en ShaderMaterial
    depthWrite: true,
    depthTest: true,
  });

  // Reconstruir la textura del colormap cuando el usuario cambia la paleta en Settings.
  van.derive(() => {
    void colorMapPalette.val;  // dependencia
    const old = material.uniforms.cmap.value as THREE.DataTexture;
    material.uniforms.cmap.value = buildSap2000Texture();
    old?.dispose?.();
  });

  const colorMap = new THREE.Mesh(new THREE.BufferGeometry(), material);
  colorMap.renderOrder = -1;
  colorMap.frustumCulled = false;
  // Marcar como área shell con colormap para que setupShellHoverTooltip filtre
  // SOLO los Q4 reales (no cilindros de frames con userData.isFrameSection).
  colorMap.userData.isShellArea = true;
  colorMap.name = "__hekatan_shell_colormap";

  // Update — al cambiar nodes/elements/values, regenerar geometría + scalar attribute
  van.derive(() => {
    // Update geometry
    colorMap.geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(nodes.val.flat(), 3)
    );
    // Triangulate Q4/Q3 → triangles
    const triIndices: number[] = [];
    // Que elemento es cada triangulo (faceIndex del raycaster -> indice en elements). Las barras
    // no ponen triangulos y un T3 pone uno solo: `faceIndex / 2` NO es el elemento (6-sep-2026:
    // en el dual el hover decia «Nodo 420» de un piso intermedio con el cursor en la azotea).
    const faceToElem: number[] = [];
    const faceLocal: number[] = [];   // 0 = triangulo [0,1,2] del elemento, 1 = [0,2,3]
    elements.val.forEach((e, ei) => {
      if (e.length === 3) {
        triIndices.push(e[0], e[1], e[2]);
        faceToElem.push(ei); faceLocal.push(0);
      } else if (e.length === 4) {
        triIndices.push(e[0], e[1], e[2]);
        triIndices.push(e[0], e[2], e[3]);
        faceToElem.push(ei, ei); faceLocal.push(0, 1);
      }
    });
    colorMap.geometry.setIndex(
      new THREE.Uint32BufferAttribute(triIndices, 1)
    );
    colorMap.userData.faceToElem = faceToElem;
    colorMap.userData.faceLocal = faceLocal;

    // Min/max ignorando NaN
    const validValues = values.val.filter((v) => Number.isFinite(v));
    let vMax: number;
    let vMin: number;
    const rng = fixedColorMapRange.val;
    if (rng) {
      vMin = rng[0];
      vMax = rng[1];
    } else {
      [vMin, vMax] = robustRange(validValues);
    }
    if (vMax === vMin) {
      const eps = Math.max(Math.abs(vMax) * 1e-6, 1e-9);
      vMax += eps;
      vMin -= eps;
    }
    // Paletas CSI (safe/etabs/sap2000): SIEMPRE mín algebraico → banda1 (magenta) y máx
    // algebraico → banda15 (azul), igual que la barra real de SAFE/ETABS/SAP2000 — sin
    // importar el ORDEN en que un ejemplo haya escrito su `colorMapRanges` override (p.ej.
    // zapata-aislada pone `pressure: [0, -q_adm]`, con rng[0] > rng[1]: ese orden es solo
    // para fijar los EXTREMOS del rango, no para invertir qué color le toca a cada signo).
    // "userInverted" es un truco de otros ejemplos/paletas que si se aplica aquí revierte
    // el sentido de CSI (18-sep-2026: -10.3 tonf/m² salía azul y 0 salía magenta — al revés).
    const userInverted = (rng && rng[0] > rng[1]) && !isDiscreteCsiPalette(colorMapPalette.val);
    const minActual = Math.min(vMin, vMax);
    const maxActual = Math.max(vMin, vMax);
    const range = maxActual - minActual;

    // Scalar attribute por vértice (en [0, 1], o -1 si NaN)
    const scalars = new Float32Array(values.val.length);
    for (let i = 0; i < values.val.length; i++) {
      const v = values.val[i];
      if (!Number.isFinite(v)) {
        scalars[i] = -1; // sentinel NaN → gris neutro en shader
        continue;
      }
      const vLookup = userInverted ? (maxActual + minActual - v) : v;
      const t = (vLookup - minActual) / range;
      scalars[i] = Math.max(0, Math.min(1, t));
    }
    colorMap.geometry.setAttribute("scalar", new THREE.BufferAttribute(scalars, 1));
  });

  return colorMap;
}
