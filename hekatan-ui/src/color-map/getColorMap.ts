import * as THREE from "three";
import { Node, Element } from "hekatan-fem";

import { Lut } from "three/addons/math/Lut.js";
import van, { State } from "vanjs-core";
import { fixedColorMapRange } from "../viewer/getViewer";

// Colormap de contornos EXACTO de ETABS — extraído por INGENIERÍA INVERSA vía la OAPI
// (tabla "Options - Colors - Output": los COLORREF/BGR reales del binario; SIN decompilar).
// 15 bandas Contour1(min)→Contour15(max): magenta → rojo → naranja → amarillo → verde →
// cian → azul (reverse-rainbow ≈ jet_r). Fuente: hekatan-csi-debug/etabs_colormap.py.
const SAP2000_PALETTE: [number, number, number, number][] = [
  [0.0000, 200,   0, 200],  // C1  magenta (min)
  [0.0714, 228,   0, 100],  // C2
  [0.1429, 255,   0,   0],  // C3  rojo
  [0.2143, 255,  64,   0],  // C4
  [0.2857, 255, 128,   0],  // C5  naranja
  [0.3571, 255, 170,   0],  // C6
  [0.4286, 255, 212,   0],  // C7
  [0.5000, 255, 255,   0],  // C8  amarillo
  [0.5714, 128, 255,   0],  // C9
  [0.6429,   0, 255,   0],  // C10 verde
  [0.7143,   0, 255, 128],  // C11
  [0.7857,   0, 255, 255],  // C12 cian
  [0.8571,   0, 170, 255],  // C13
  [0.9286,   0,  85, 255],  // C14
  [1.0000,   0,   0, 255],  // C15 azul (max)
];

/** Lookup en la palette interpolando linealmente entre stops. */
function sap2000Color(t: number): [number, number, number] {
  t = Math.max(0, Math.min(1, t));
  for (let i = 0; i < SAP2000_PALETTE.length - 1; i++) {
    const [t0, r0, g0, b0] = SAP2000_PALETTE[i];
    const [t1, r1, g1, b1] = SAP2000_PALETTE[i + 1];
    if (t <= t1) {
      const f = (t - t0) / (t1 - t0);
      return [r0 + (r1 - r0) * f, g0 + (g1 - g0) * f, b0 + (b1 - b0) * f];
    }
  }
  const last = SAP2000_PALETTE[SAP2000_PALETTE.length - 1];
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
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.needsUpdate = true;
  return tex;
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
        // BANDAS DISCRETAS como ETABS (15 contornos): quantizar el escalar a la
        // banda y tomar su color central (no gradiente suave).
        float NB = 15.0;
        float band = min(floor(clamp(vScalar, 0.0, 1.0) * NB), NB - 1.0);
        float q = (band + 0.5) / NB;
        vec3 color = texture2D(cmap, vec2(q, 0.5)).rgb;
        gl_FragColor = vec4(color * ambient, 1.0);
      }
    `,
    side: THREE.DoubleSide,
    transparent: false,
    clipping: true,  // habilitar soporte de clipping planes en ShaderMaterial
    depthWrite: true,
    depthTest: true,
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
    for (const e of elements.val) {
      if (e.length === 3) {
        triIndices.push(e[0], e[1], e[2]);
      } else if (e.length === 4) {
        triIndices.push(e[0], e[1], e[2]);
        triIndices.push(e[0], e[2], e[3]);
      }
    }
    colorMap.geometry.setIndex(
      new THREE.Uint32BufferAttribute(triIndices, 1)
    );

    // Min/max ignorando NaN
    const validValues = values.val.filter((v) => Number.isFinite(v));
    let vMax: number;
    let vMin: number;
    const rng = fixedColorMapRange.val;
    if (rng) {
      vMin = rng[0];
      vMax = rng[1];
    } else {
      vMax = validValues.length ? Math.max(...validValues) : 1;
      vMin = validValues.length ? Math.min(...validValues) : 0;
      if (vMin >= 0 && vMax > 0) vMin = 0;
    }
    if (vMax === vMin) {
      const eps = Math.max(Math.abs(vMax) * 1e-6, 1e-9);
      vMax += eps;
      vMin -= eps;
    }
    const userInverted = (rng && rng[0] > rng[1]);
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
