import * as THREE from "three";
import van, { State } from "vanjs-core";
import { Pane } from "tweakpane";

// Todo: refactor isInPlane to a function

export type Drawing = {
  points?: State<[number, number, number][]>;
  polylines?: State<number[][]>;
  // Índices de polylines marcadas como ÁREA (shell Q4). Una polilínea
  // cerrada NO es automáticamente un área — puede ser una cercha (frames
  // cerrados). Solo el tool "area" agrega entries acá.
  areas?: State<number[]>;
  gridTarget?: State<{
    position: [number, number, number];
    rotation: [number, number, number];
  }>;
};

export function drawing({
  drawingObj,
  gridObj,
  scene,
  getActiveCamera,
  controls,
  gridSize,
  derivedDisplayScale,
  rendererElm,
  viewerRender,
}: {
  drawingObj: Drawing;
  gridObj: THREE.GridHelper;
  scene: THREE.Scene;
  // Getter dinámico — devuelve la cámara activa AHORA (puede ser persp ↔ ortho).
  // Sin esto, el raycaster usa la cámara original cacheada y los clicks caen
  // en world coords que no coinciden con la vista renderizada (off-by-mucho).
  getActiveCamera: () => THREE.Camera;
  controls: THREE.Controls<any>;
  gridSize: number;
  derivedDisplayScale: State<number>;
  rendererElm: HTMLCanvasElement;
  viewerRender: () => void;
}) {
  // Init
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  // Helper: actualiza pointer NDC desde un event de mouse y devuelve la
  // CÁMARA que el caller debe usar para el raycaster (null si el evento
  // no debe procesarse). En split mode, esto permite dibujar desde el
  // panel izquierdo (cámara activa) Y el derecho (cámara secundaria).
  const setPointerFromEvent = (event: { clientX: number; clientY: number }): THREE.Camera | null => {
    const rect = rendererElm.getBoundingClientRect();
    const localX = event.clientX - rect.left;
    const localY = event.clientY - rect.top;
    const w = rect.width || 1;
    const h = rect.height || 1;
    const split = !!(window as any).__hekatanSplitMode;
    if (split) {
      const halfW = w / 2;
      if (localX >= halfW) {
        // Mouse en panel DERECHO → usar splitCamera (preview interactivo).
        // pointer NDC respecto a la mitad derecha del canvas.
        pointer.x = ((localX - halfW) / halfW) * 2 - 1;
        pointer.y = -(localY / h) * 2 + 1;
        const splitCam = (window as any).__hekatanSplitCamera as THREE.Camera | null;
        return splitCam ?? getActiveCamera();
      }
      // Mouse en panel IZQUIERDO → usar cámara activa.
      pointer.x = (localX / halfW) * 2 - 1;
    } else {
      pointer.x = (localX / w) * 2 - 1;
    }
    pointer.y = -(localY / h) * 2 + 1;
    return getActiveCamera();
  };

  // Plano gigante (10000×10000m) — invisible, sólo para raycaster.
  // Antes era gridSize×gridSize (20×20) y se desplazaba a (0,10,10) o
  // (10,10,0) según el plano de trabajo. Eso hacía que en YZ/XZ el plano
  // sólo cubriera un cuadrante chico del viewport ortográfico → si el
  // mouse iba fuera, el rayo no intersectaba nada y el cursor "se moría".
  // Tamaño 10000m garantiza que cualquier click razonable hit.
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(10000, 10000),
    new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,        // invisible visualmente
      depthWrite: false, // no escribe al z-buffer
    })
  );
  plane.visible = true;       // pero "visible" en el grafo (intersectObject lo respeta)
  plane.frustumCulled = false; // siempre evaluable por raycaster
  // CRITICAL: el plano DEBE estar en la escena para que raycaster.intersectObject
  // resuelva correctamente su matrixWorld. Sin esto, los clicks sintéticos
  // (y a veces los reales tras transforms) fallaban silenciosamente al no
  // intersectar nada → drawingPoints jamás se actualizaba.
  scene.add(plane);
  // Planos de raycast adicionales para los GRID PLANES XZ / YZ.
  // Existe `plane` arriba como plano XY global. Para que el cursor (snap +
  // intersección) trabaje sobre los planos XZ y YZ del grid (cuando están
  // activados en Settings → Grid → Plano XZ / Plano YZ), creamos otros 2
  // meshes invisibles. Los activamos vía window.__hekatanGridPlaneXZ/YZ
  // (booleans seteados por getViewer.ts cuando los toggles cambian).
  const mkInvisiblePlane = (rotX: number, rotY: number, rotZ: number) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(10000, 10000),
      new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, transparent: true, opacity: 0, depthWrite: false }),
    );
    m.rotation.set(rotX, rotY, rotZ);
    m.visible = false;
    m.frustumCulled = false;
    scene.add(m);
    return m;
  };
  // PlaneGeometry default está en XY. Para que sea XZ → rotX=π/2.
  // Para YZ → rotY=π/2 (así la normal apunta a +X y el plano queda en YZ).
  const planeXZ = mkInvisiblePlane(Math.PI / 2, 0, 0);
  const planeYZ = mkInvisiblePlane(0, Math.PI / 2, 0);
  // Flag: el plano de trabajo está INCLINADO (no axis-aligned). Lo setea la
  // van.derive de gridTarget según la normal. Cuando es true, el raycast usa
  // SOLO el plano de trabajo inclinado (ignora los planos de referencia
  // horizontales, que sino interceptan el click más cerca y aplastan el área).
  let inclinedPlaneActive = false;
  // Helper: raycast contra el plano de trabajo activo + los planos de
  // referencia visibles. El cursor cae sobre el plano que el rayo de cámara
  // intersecta primero (el "más al frente"). Esto incluye:
  //   - plane (workplane global XY/XZ/YZ a la Cota Z actual)
  //   - planeXZ / planeYZ (si los grid planes XZ/YZ están activos)
  //   - refPlaneMeshes (Z=0,3,6,9,12 si están visibles)
  //   - refFillXY/XZ/YZ (planos ortogonales del último punto del rubber)
  // CRÍTICO para que ORTO detecte el eje correcto según el plano hover:
  // si el cursor está sobre el plano XZ del último punto, el `point` tendrá
  // variación en X y Z (no solo en X como con el plane global XY).
  // ── REFERENCIA IFC (el «DWG de fondo» de Revit) ────────────────────────────
  // Las mallas del IFC que el lienzo pone de fondo (userData.refIfc) se pueden
  // TOCAR con la mirilla: el rayo del cursor las intersecta antes que el plano
  // de trabajo y el punto cae sobre el objeto real. Dos referencias:
  //   · «cara»: el punto de la superficie bajo el cursor;
  //   · «eje»: si el rayo ENTRA y SALE del mismo objeto a menos de 1.2 m (una
  //     viga, un arco, un tubo), el punto medio de entrada y salida ≈ su eje —
  //     que es donde va el nudo del modelo analítico, no en la cara.
  // Respeta los cortes (✂ Cortes X/Y/Z): lo que el corte esconde no engancha,
  // así un corte en elevación deja la referencia limpia, como en Revit.
  // Jorge, 12-sep-2026: «uno pueda acercarse al arco y hacer clic y se haga una
  // división para discretizar… la referencia es el IFC».
  let _refHit: { tipo: "ifc" | "ifcAxis" | "ifcEdge" | "ifcVert" } | null = null;
  // ── BORDES y VÉRTICES de la referencia IFC ─────────────────────────────────
  // Jorge (12-sep-2026): «es preferible que puedas seleccionar bordes del IFC».
  // Las aristas de la malla que son de verdad un borde: las que comparten dos
  // triángulos con normales a más de 25° (una esquina, el canto de una losa, la
  // arista de una viga) y las que tienen un solo triángulo (borde libre). Se
  // calculan UNA vez por malla y se guardan en una rejilla de 1 m para mirar
  // solo las que rodean el punto tocado por el rayo. Prioridad: vértice > borde.
  // ── CADENA de segmentos («Elegir líneas» de Revit) ─────────────────────────
  // Jorge (12-sep-2026): «Revit tiene una opción: si hay una línea, trazar en
  // esa misma línea». Al pasar el cursor por un borde o por el perfil del corte
  // se ILUMINA la línea entera (azul) — la cadena de segmentos que continúa sin
  // quiebro— y con la herramienta «Copiar línea del IFC» un clic la copia como
  // barras: recta → una barra; curva → N tramos (Segmentos arc/círc), con el
  // mismo reparto que el Arco. Las medidas salen de la malla, no de tres clics.
  type Fuente = { S: Float32Array; adj: Map<string, number[]>; s: number };
  let _cadenaFuente: Fuente | null = null;
  let _cadenaActual: THREE.Vector3[] | null = null;
  const cadenaLineas = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0x38bdf8, depthTest: false, transparent: true, opacity: 0.95 }));
  cadenaLineas.name = "ref-ifc-cadena"; cadenaLineas.renderOrder = 1000; cadenaLineas.frustumCulled = false; cadenaLineas.visible = false;
  scene.add(cadenaLineas);
  const kMm = (x: number, y: number, z: number) => Math.round(x * 1e3) + "," + Math.round(y * 1e3) + "," + Math.round(z * 1e3);
  const adjDe = (S: Float32Array): Map<string, number[]> => {
    const adj = new Map<string, number[]>();
    for (let s = 0; s + 0 < S.length / 6; s++) {
      const i = 6 * s;
      for (const k of [kMm(S[i], S[i + 1], S[i + 2]), kMm(S[i + 3], S[i + 4], S[i + 5])]) { const a = adj.get(k); if (a) a.push(s); else adj.set(k, [s]); }
    }
    return adj;
  };
  /** Sigue la cadena desde el segmento s0 en los dos sentidos mientras no haya
   *  quiebro (> 35°) ni bifurcación; luego se queda con el TROZO que contiene
   *  s0 partiendo donde la curvatura cambia de golpe (nave r = 15 → ala r = 6.6). */
  const cadenaDesde = (F: Fuente): THREE.Vector3[] => {
    const { S, adj } = F;
    const P = (s: number, lado: 0 | 1) => new THREE.Vector3(S[6 * s + 3 * lado], S[6 * s + 3 * lado + 1], S[6 * s + 3 * lado + 2]);
    const usados = new Set<number>([F.s]);
    const andar = (desde: THREE.Vector3, hacia: THREE.Vector3): THREE.Vector3[] => {
      const out: THREE.Vector3[] = []; let a = desde, b = hacia;
      for (let paso = 0; paso < 3000; paso++) {
        const cand = (adj.get(kMm(b.x, b.y, b.z)) || []).filter((s) => !usados.has(s));
        if (cand.length !== 1) break;
        const s = cand[0]; const p0 = P(s, 0), p1 = P(s, 1);
        const c = p0.distanceTo(b) < p1.distanceTo(b) ? p1 : p0;
        const d0 = b.clone().sub(a).normalize(), d1 = c.clone().sub(b).normalize();
        if (d0.dot(d1) < Math.cos(35 * Math.PI / 180)) break;
        usados.add(s); out.push(c); a = b; b = c;
      }
      return out;
    };
    const A = P(F.s, 0), B = P(F.s, 1);
    const adelante = andar(A, B), atras = andar(B, A);
    const pts = [...atras.reverse(), A, B, ...adelante];
    const i0 = atras.length;   // índice de A en pts (el segmento tocado es i0 → i0+1)
    if (pts.length < 6) return pts;
    // curvatura discreta por vértice (rad/m), suavizada en ventana de 3
    const L: number[] = [], th: number[] = [];
    for (let i = 1; i < pts.length; i++) L.push(pts[i].distanceTo(pts[i - 1]));
    for (let i = 1; i < pts.length - 1; i++) {
      const d0 = pts[i].clone().sub(pts[i - 1]).normalize(), d1 = pts[i + 1].clone().sub(pts[i]).normalize();
      th.push(Math.acos(Math.max(-1, Math.min(1, d0.dot(d1)))) / Math.max(1e-6, (L[i - 1] + L[i]) / 2));
    }
    const kap = th.map((_, i) => { let s = 0, n = 0; for (let j = i - 1; j <= i + 1; j++) if (j >= 0 && j < th.length) { s += th[j]; n++; } return s / n; });
    // cortes: donde la curvatura suavizada de la izquierda y la derecha difieren ×2.2
    const cortes: number[] = [];
    for (let i = 3; i < kap.length - 3; i++) {
      const izq = (kap[i - 3] + kap[i - 2] + kap[i - 1]) / 3, der = (kap[i + 1] + kap[i + 2] + kap[i + 3]) / 3;
      const mn = Math.min(izq, der), mx = Math.max(izq, der);
      if (mx > 0.03 && mx / Math.max(mn, 1e-6) > 2.2 && Math.abs(kap[i] - (izq + der) / 2) < mx) {
        if (!cortes.length || i - cortes[cortes.length - 1] > 3) cortes.push(i + 1);   // vértice i+1 en pts
      }
    }
    let ini = 0, fin = pts.length - 1;
    for (const c of cortes) { if (c <= i0 && c > ini) ini = c; if (c > i0 && c < fin) fin = c; }
    return pts.slice(ini, fin + 1);
  };
  const mostrarCadena = (pts: THREE.Vector3[] | null) => {
    _cadenaActual = pts;
    if (!pts || pts.length < 2) { cadenaLineas.visible = false; return; }
    cadenaLineas.geometry.dispose(); cadenaLineas.geometry = new THREE.BufferGeometry().setFromPoints(pts);
    cadenaLineas.visible = true;
  };
  /** La cadena como barras: recta → 2 puntos; curva → N tramos según el reparto del arco. */
  const cadenaABarras = (pts: THREE.Vector3[]): [number, number, number][] => {
    let giro = 0;
    for (let i = 1; i < pts.length - 1; i++) { const d0 = pts[i].clone().sub(pts[i - 1]).normalize(), d1 = pts[i + 1].clone().sub(pts[i]).normalize(); giro += Math.acos(Math.max(-1, Math.min(1, d0.dot(d1)))); }
    const N = Math.max(2, Math.round((window as any).__hekatanArcSegs ?? 12));
    if (giro < 3 * Math.PI / 180) return [pts[0].toArray() as any, pts[pts.length - 1].toArray() as any];
    const modo = String((window as any).__hekatanArcModo ?? "angulo");
    const k = modo === "x" ? 0 : modo === "y" ? 1 : modo === "z" ? 2 : -1;
    const acum = [0]; for (let i = 1; i < pts.length; i++) acum.push(acum[i - 1] + pts[i].distanceTo(pts[i - 1]));
    const enParam = (f: (p: THREE.Vector3, i: number) => number, objetivo: number): THREE.Vector3 => {
      for (let i = 1; i < pts.length; i++) {
        const a = f(pts[i - 1], i - 1), b = f(pts[i], i);
        if ((a <= objetivo && objetivo <= b) || (b <= objetivo && objetivo <= a)) { const t = Math.abs(b - a) < 1e-12 ? 0 : (objetivo - a) / (b - a); return pts[i - 1].clone().lerp(pts[i], t); }
      }
      return pts[pts.length - 1].clone();
    };
    const out: [number, number, number][] = [];
    const c0 = k >= 0 ? pts[0].getComponent(k) : 0, c1 = k >= 0 ? pts[pts.length - 1].getComponent(k) : 0;
    const monot = k >= 0 && Math.abs(c1 - c0) > 1e-6 && pts.every((p, i) => i === 0 || (p.getComponent(k) - pts[i - 1].getComponent(k)) * (c1 - c0) >= -1e-6);
    for (let i = 0; i <= N; i++) {
      const p = monot ? enParam((p) => p.getComponent(k), c0 + (c1 - c0) * i / N) : enParam((_, j) => acum[j], acum[acum.length - 1] * i / N);
      out.push([p.x, p.y, p.z]);
    }
    out[0] = pts[0].toArray() as any; out[N] = pts[pts.length - 1].toArray() as any;
    return out;
  };
  (window as any).__hekatanCadenaIfc = () => (_cadenaActual || []).map((p) => [p.x, p.y, p.z]);
  // ── CARAS de la referencia IFC («Área desde cara») ─────────────────────────
  // Jorge (13-sep-2026): «pase con el cursor por el IFC donde es una cara, se
  // seleccione esa cara… agregar área». Con la herramienta ifcface, la cara
  // bajo el cursor (triángulos vecinos con la misma normal, ±12°) se ilumina en
  // cian; el clic la convierte en área: contorno de la región, y la malla se
  // pone donde diga «Malla del área IFC»: PLANO MEDIO (defecto), cara exterior
  // (la tocada) o cara interior (la otra cara del espesor). El espesor se MIDE
  // con un rayo hacia dentro del objeto. Cara curva → no: arco + Extruir.
  type Topo = { V: Float64Array; N: Float64Array; vec: Int32Array; n: number };
  const _topo = new Map<number, Topo>();
  const topoDe = (m: THREE.Mesh): Topo => {
    const c = _topo.get(m.id); if (c) return c;
    const pos = (m.geometry as THREE.BufferGeometry).getAttribute("position");
    const n = pos ? Math.floor(pos.count / 3) : 0;
    const V = new Float64Array(n * 9), N = new Float64Array(n * 3), vec = new Int32Array(n * 3).fill(-1);
    if (pos) {
      m.updateMatrixWorld();
      const v = new THREE.Vector3();
      for (let i = 0; i < n * 3; i++) { v.fromBufferAttribute(pos, i).applyMatrix4(m.matrixWorld); V[3 * i] = v.x; V[3 * i + 1] = v.y; V[3 * i + 2] = v.z; }
      const a = new THREE.Vector3(), b = new THREE.Vector3(), nn = new THREE.Vector3();
      const key = (i: number) => Math.round(V[3 * i] * 1e3) + "," + Math.round(V[3 * i + 1] * 1e3) + "," + Math.round(V[3 * i + 2] * 1e3);
      const ar = new Map<string, number[]>();
      for (let t = 0; t < n; t++) {
        const i0 = 3 * t;
        a.set(V[3 * (i0 + 1)] - V[3 * i0], V[3 * (i0 + 1) + 1] - V[3 * i0 + 1], V[3 * (i0 + 1) + 2] - V[3 * i0 + 2]);
        b.set(V[3 * (i0 + 2)] - V[3 * i0], V[3 * (i0 + 2) + 1] - V[3 * i0 + 1], V[3 * (i0 + 2) + 2] - V[3 * i0 + 2]);
        nn.crossVectors(a, b).normalize(); N[3 * t] = nn.x; N[3 * t + 1] = nn.y; N[3 * t + 2] = nn.z;
        for (let e = 0; e < 3; e++) {
          const ki = key(i0 + e), kj = key(i0 + ((e + 1) % 3)); const k = ki < kj ? ki + "|" + kj : kj + "|" + ki;
          const r = ar.get(k); if (r) r.push(t, e); else ar.set(k, [t, e]);
        }
      }
      for (const r of ar.values()) if (r.length === 4) { vec[3 * r[0] + r[1]] = r[2]; vec[3 * r[2] + r[3]] = r[0]; }
    }
    const res = { V, N, vec, n }; _topo.set(m.id, res); return res;
  };
  const caraMesh = new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.35, depthTest: false, side: THREE.DoubleSide }));
  caraMesh.name = "ref-ifc-cara"; caraMesh.renderOrder = 999; caraMesh.frustumCulled = false; caraMesh.visible = false;
  scene.add(caraMesh);
  let _cara: { m: THREE.Mesh; t0: number; tris: number[]; normal: THREE.Vector3; plana: boolean; punto: THREE.Vector3 } | null = null;
  const regionCara = (T: Topo, t0: number): number[] => {
    const COS12 = Math.cos(12 * Math.PI / 180), COS80 = Math.cos(80 * Math.PI / 180);
    const n0 = [T.N[3 * t0], T.N[3 * t0 + 1], T.N[3 * t0 + 2]];
    const vis = new Uint8Array(T.n); const out: number[] = []; const cola = [t0]; vis[t0] = 1;
    while (cola.length && out.length < 40000) {
      const t = cola.pop()!; out.push(t);
      for (let e = 0; e < 3; e++) {
        const u = T.vec[3 * t + e]; if (u < 0 || vis[u]) continue;
        const cAdj = T.N[3 * t] * T.N[3 * u] + T.N[3 * t + 1] * T.N[3 * u + 1] + T.N[3 * t + 2] * T.N[3 * u + 2];
        const cSem = n0[0] * T.N[3 * u] + n0[1] * T.N[3 * u + 1] + n0[2] * T.N[3 * u + 2];
        if (cAdj >= COS12 && cSem >= COS80) { vis[u] = 1; cola.push(u); }
      }
    }
    return out;
  };
  const mostrarCara = (m: THREE.Mesh | null, t0: number, punto: THREE.Vector3 | null) => {
    if (!m || t0 < 0 || !punto) { if (_cara) { _cara = null; caraMesh.visible = false; } return; }
    if (_cara && _cara.m === m && _cara.tris.indexOf(t0) >= 0) { _cara.punto = punto.clone(); return; }
    const T = topoDe(m); const tris = regionCara(T, t0);
    const pos = new Float32Array(tris.length * 9);
    const nm = new THREE.Vector3(); let plana = true;
    tris.forEach((t, k) => { for (let j = 0; j < 9; j++) pos[9 * k + j] = T.V[9 * t + j]; nm.x += T.N[3 * t]; nm.y += T.N[3 * t + 1]; nm.z += T.N[3 * t + 2]; });
    nm.normalize();
    for (const t of tris) if (nm.x * T.N[3 * t] + nm.y * T.N[3 * t + 1] + nm.z * T.N[3 * t + 2] < Math.cos(5 * Math.PI / 180)) { plana = false; break; }
    caraMesh.geometry.dispose(); caraMesh.geometry = new THREE.BufferGeometry(); caraMesh.geometry.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    (caraMesh.material as THREE.MeshBasicMaterial).color.set(plana ? 0x38bdf8 : 0xf59e0b);
    caraMesh.visible = true;
    _cara = { m, t0, tris, normal: nm, plana, punto: punto.clone() };
  };
  /** Contorno (bucle más largo) de la región, simplificado (vértices colineales fuera). */
  const contornoCara = (T: Topo, tris: number[]): THREE.Vector3[] => {
    const enR = new Uint8Array(T.n); for (const t of tris) enR[t] = 1;
    const key = (i: number) => Math.round(T.V[3 * i] * 1e3) + "," + Math.round(T.V[3 * i + 1] * 1e3) + "," + Math.round(T.V[3 * i + 2] * 1e3);
    const adj = new Map<string, string[]>(); const pt = new Map<string, THREE.Vector3>();
    for (const t of tris) for (let e = 0; e < 3; e++) {
      const u = T.vec[3 * t + e]; if (u >= 0 && enR[u]) continue;   // arista interior
      const i = 3 * t + e, j = 3 * t + ((e + 1) % 3); const ki = key(i), kj = key(j);
      pt.set(ki, new THREE.Vector3(T.V[3 * i], T.V[3 * i + 1], T.V[3 * i + 2])); pt.set(kj, new THREE.Vector3(T.V[3 * j], T.V[3 * j + 1], T.V[3 * j + 2]));
      (adj.get(ki) || adj.set(ki, []).get(ki)!).push(kj); (adj.get(kj) || adj.set(kj, []).get(kj)!).push(ki);
    }
    const usado = new Set<string>(); let mejor: string[] = [];
    for (const k0 of adj.keys()) {
      if (usado.has(k0)) continue;
      const loop = [k0]; usado.add(k0); let prev = "", cur = k0;
      for (let paso = 0; paso < 100000; paso++) {
        const nx = (adj.get(cur) || []).find((k) => k !== prev && !usado.has(k)); if (!nx) break;
        loop.push(nx); usado.add(nx); prev = cur; cur = nx;
      }
      if (loop.length > mejor.length) mejor = loop;
    }
    const P = mejor.map((k) => pt.get(k)!);
    // quitar colineales y repetidos
    const out: THREE.Vector3[] = [];
    for (let i = 0; i < P.length; i++) {
      const a = P[(i + P.length - 1) % P.length], b = P[i], c = P[(i + 1) % P.length];
      if (b.distanceTo(a) < 1e-3) continue;
      const d0 = b.clone().sub(a).normalize(), d1 = c.clone().sub(b).normalize();
      if (d0.dot(d1) > Math.cos(3 * Math.PI / 180)) continue;
      out.push(b);
    }
    return out;
  };
  /** Espesor del objeto bajo la cara: rayo hacia dentro desde el punto tocado. */
  const espesorEn = (m: THREE.Mesh, p: THREE.Vector3, n: THREE.Vector3): number | null => {
    const rc = new THREE.Raycaster(p.clone().addScaledVector(n, -0.002), n.clone().negate(), 0, 3);
    const h = rc.intersectObject(m, false); return h.length ? h[0].distance + 0.002 : null;
  };
  // Medida: distancia de un punto a las mallas dadas a lo largo de ±dir (o null).
  (window as any).__hekatanRaycast = (o: number[], d: number[], objs: THREE.Object3D[], far = 2) => {
    const O = new THREE.Vector3(o[0], o[1], o[2]), D = new THREE.Vector3(d[0], d[1], d[2]).normalize();
    let mejor: number | null = null;
    for (const sg of [1, -1]) { const rc = new THREE.Raycaster(O, D.clone().multiplyScalar(sg), 0, far); const h = rc.intersectObjects(objs, false); if (h.length && (mejor == null || h[0].distance < mejor)) mejor = h[0].distance; }
    return mejor;
  };
  (window as any).__hekatanCaraIfc = () => _cara ? { tris: _cara.tris.length, plana: _cara.plana, normal: _cara.normal.toArray(), punto: _cara.punto.toArray(), contorno: contornoCara(topoDe(_cara.m), _cara.tris).map((q) => [q.x, q.y, q.z]) } : null;
  type Bordes = { segs: Float32Array; celdas: Map<string, number[]>; adj?: Map<string, number[]> };
  const _bordes = new Map<number, Bordes>();
  const bordesLineas = new THREE.LineSegments(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.35, depthTest: true }));
  bordesLineas.name = "ref-ifc-bordes"; bordesLineas.frustumCulled = false; bordesLineas.visible = false;
  scene.add(bordesLineas);
  const CELDA = 1.0;
  const celdaDe = (x: number, y: number, z: number) => Math.floor(x / CELDA) + "," + Math.floor(y / CELDA) + "," + Math.floor(z / CELDA);
  const bordesDe = (m: THREE.Mesh): Bordes => {
    const c = _bordes.get(m.id); if (c) return c;
    const pos = (m.geometry as THREE.BufferGeometry).getAttribute("position");
    const out: number[] = []; const celdas = new Map<string, number[]>();
    if (pos) {
      m.updateMatrixWorld();
      const n = Math.floor(pos.count / 3);
      const V = new Float64Array(pos.count * 3);
      const v = new THREE.Vector3();
      for (let i = 0; i < pos.count; i++) { v.fromBufferAttribute(pos, i).applyMatrix4(m.matrixWorld); V[3 * i] = v.x; V[3 * i + 1] = v.y; V[3 * i + 2] = v.z; }
      const key = (i: number) => (Math.round(V[3 * i] * 1e3) + "," + Math.round(V[3 * i + 1] * 1e3) + "," + Math.round(V[3 * i + 2] * 1e3));
      const N = new Float64Array(n * 3);
      const a = new THREE.Vector3(), b = new THREE.Vector3(), nn = new THREE.Vector3();
      for (let t = 0; t < n; t++) {
        const i0 = 3 * t, i1 = 3 * t + 1, i2 = 3 * t + 2;
        a.set(V[3 * i1] - V[3 * i0], V[3 * i1 + 1] - V[3 * i0 + 1], V[3 * i1 + 2] - V[3 * i0 + 2]);
        b.set(V[3 * i2] - V[3 * i0], V[3 * i2 + 1] - V[3 * i0 + 1], V[3 * i2 + 2] - V[3 * i0 + 2]);
        nn.crossVectors(a, b).normalize(); N[3 * t] = nn.x; N[3 * t + 1] = nn.y; N[3 * t + 2] = nn.z;
      }
      // arista → [triángulo, vértice inicial, vértice final]
      const aristas = new Map<string, number[]>();
      for (let t = 0; t < n; t++) for (let e = 0; e < 3; e++) {
        const i = 3 * t + e, j = 3 * t + ((e + 1) % 3);
        const ki = key(i), kj = key(j); const k = ki < kj ? ki + "|" + kj : kj + "|" + ki;
        const r = aristas.get(k); if (r) r.push(t); else aristas.set(k, [t, i, j]);
      }
      const COS25 = Math.cos(25 * Math.PI / 180);
      for (const r of aristas.values()) {
        const t0 = r[0], i = r[1], j = r[2];
        let borde = r.length === 3;                      // un solo triángulo: borde libre
        if (!borde && r.length === 4) {                  // dos triángulos: ¿quiebro?
          const t1 = r[3];
          const cos = N[3 * t0] * N[3 * t1] + N[3 * t0 + 1] * N[3 * t1 + 1] + N[3 * t0 + 2] * N[3 * t1 + 2];
          borde = Math.abs(cos) < COS25;
        }
        if (!borde) continue;
        const s = out.length / 6;
        out.push(V[3 * i], V[3 * i + 1], V[3 * i + 2], V[3 * j], V[3 * j + 1], V[3 * j + 2]);
        // la arista entra en las celdas de sus dos extremos y del medio
        for (const [x, y, z] of [[V[3 * i], V[3 * i + 1], V[3 * i + 2]], [V[3 * j], V[3 * j + 1], V[3 * j + 2]], [(V[3 * i] + V[3 * j]) / 2, (V[3 * i + 1] + V[3 * j + 1]) / 2, (V[3 * i + 2] + V[3 * j + 2]) / 2]]) {
          const ck = celdaDe(x, y, z); const arr = celdas.get(ck); if (arr) { if (arr[arr.length - 1] !== s) arr.push(s); } else celdas.set(ck, [s]);
        }
      }
    }
    const res = { segs: new Float32Array(out), celdas };
    _bordes.set(m.id, res);
    return res;
  };
  // Dibujo tenue de todos los bordes (para VER a qué se puede enganchar).
  let _bordesClave = "";
  const refrescarBordes = (mallas: THREE.Mesh[]) => {
    const clave = mallas.map((m) => m.id).join(",");
    if (clave === _bordesClave) return; _bordesClave = clave;
    const partes = mallas.map((m) => bordesDe(m).segs); let n = 0; for (const p of partes) n += p.length;
    const todo = new Float32Array(n); let o = 0; for (const p of partes) { todo.set(p, o); o += p.length; }
    bordesLineas.geometry.dispose(); bordesLineas.geometry = new THREE.BufferGeometry();
    bordesLineas.geometry.setAttribute("position", new THREE.BufferAttribute(todo, 3));
    bordesLineas.visible = n > 0 && (window as any).__hekatanRefIfcBordes !== false;
  };
  (window as any).__hekatanRefIfcBordesRefrescar = () => { bordesLineas.visible = _bordesClave !== "" && (window as any).__hekatanRefIfcBordes !== false; viewerRender(); };
  (window as any).__hekatanBordesIfc = () => { let n = 0; for (const b of _bordes.values()) n += b.segs.length / 6; return n; };
  /** Vértice o borde de la referencia cerca del punto tocado (en píxeles). */
  const snapBordeIfc = (m: THREE.Mesh, p: THREE.Vector3): { tipo: "ifcEdge" | "ifcVert"; punto: THREE.Vector3 } | null => {
    const cur = (window as any).__hekatanCursorPx as { x: number; y: number } | undefined; if (!cur) return null;
    const B = bordesDe(m); const S = B.segs;
    const cx = Math.floor(p.x / CELDA), cy = Math.floor(p.y / CELDA), cz = Math.floor(p.z / CELDA);
    const vistos = new Set<number>();
    let mejorV = _aperturaPx, bestV: THREE.Vector3 | null = null, mejorE = _aperturaPx, bestE: THREE.Vector3 | null = null, bestS = -1;
    const A = new THREE.Vector3(), Bv = new THREE.Vector3();
    for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) for (let dz = -1; dz <= 1; dz++) {
      const arr = B.celdas.get((cx + dx) + "," + (cy + dy) + "," + (cz + dz)); if (!arr) continue;
      for (const s of arr) {
        if (vistos.has(s)) continue; vistos.add(s);
        const i = 6 * s;
        A.set(S[i], S[i + 1], S[i + 2]); Bv.set(S[i + 3], S[i + 4], S[i + 5]);
        const a = aPixeles(A.x, A.y, A.z), b = aPixeles(Bv.x, Bv.y, Bv.z); if (!a || !b) continue;
        const da = Math.hypot(a.x - cur.x, a.y - cur.y), db = Math.hypot(b.x - cur.x, b.y - cur.y);
        if (da < mejorV) { mejorV = da; bestV = A.clone(); }
        if (db < mejorV) { mejorV = db; bestV = Bv.clone(); }
        const vx = b.x - a.x, vy = b.y - a.y, L2 = vx * vx + vy * vy || 1e-9;
        let t = ((cur.x - a.x) * vx + (cur.y - a.y) * vy) / L2; t = Math.max(0, Math.min(1, t));
        const d = Math.hypot(cur.x - (a.x + t * vx), cur.y - (a.y + t * vy));
        if (d < mejorE) { mejorE = d; bestE = A.clone().lerp(Bv, t); bestS = s; }
      }
    }
    if (bestS >= 0) { if (!B.adj) B.adj = adjDe(B.segs); _cadenaFuente = { S: B.segs, adj: B.adj, s: bestS }; }
    if (bestV) return { tipo: "ifcVert", punto: bestV };
    if (bestE) return { tipo: "ifcEdge", punto: bestE };
    return null;
  };
  const intersectReferenciaIfc = (): THREE.Intersection[] | null => {
    if ((window as any).__hekatanRefIfcSnap === false) return null;
    const mallas: THREE.Mesh[] = [];
    scene.traverse((o) => { if ((o as any).userData?.refIfc && (o as THREE.Mesh).isMesh) mallas.push(o as THREE.Mesh); });
    if (!mallas.length) { bordesLineas.visible = false; _bordesClave = ""; return null; }
    refrescarBordes(mallas);
    const hits = raycaster.intersectObjects(mallas, false).filter((h) => {
      const m = (h.object as THREE.Mesh).material as THREE.Material;
      const planos: THREE.Plane[] = (m && (m as any).clippingPlanes) || [];
      return planos.every((pl) => pl.distanceToPoint(h.point) >= 0);
    });
    if (!hits.length) return null;
    const h0 = hits[0], h1 = hits[1];
    // Herramienta «Área desde cara»: la cara bajo el cursor se ilumina.
    if ((window as any).__hekatanCadState?.get?.()?.tool === "ifcface") mostrarCara(h0.object as THREE.Mesh, h0.faceIndex ?? -1, h0.point);
    else if (_cara) mostrarCara(null, -1, null);
    // Vértice o borde de la malla cerca del cursor: manda sobre cara y eje.
    const be = snapBordeIfc(h0.object as THREE.Mesh, h0.point);
    if (be) { _refHit = { tipo: be.tipo }; return [{ ...h0, point: be.punto } as THREE.Intersection]; }
    if (h1 && h1.object === h0.object && h1.distance - h0.distance <= 1.2) {
      const mid = h0.point.clone().add(h1.point).multiplyScalar(0.5);
      _refHit = { tipo: "ifcAxis" };
      return [{ ...h0, point: mid } as THREE.Intersection];
    }
    _refHit = { tipo: "ifc" };
    return [h0];
  };
  // ── SECCIÓN de la referencia IFC (el corte en elevación de Revit) ─────────
  // Con un corte activo (✂ Cortes X/Y/Z) el rayo del cursor ya no sirve: en una
  // bóveda mirada de frente el rayo entra por cualquier punto del túnel. Lo que
  // se quiere es la CURVA DE SECCIÓN: cada triángulo de la referencia cortado
  // por el plano da un segmento; todos juntos son el perfil (el arco de la
  // bóveda, el canto del entrepiso, las columnas) y la mirilla engancha al punto
  // más cercano de ese perfil, medido en píxeles como las demás referencias.
  // Se recalcula solo cuando cambia el corte o las mallas.
  let _secClave = ""; let _secSegs: Float32Array = new Float32Array(0);
  const secLineas = new THREE.LineSegments(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.95, depthTest: false }));
  secLineas.name = "ref-ifc-seccion"; secLineas.renderOrder = 998; secLineas.frustumCulled = false; secLineas.visible = false;
  scene.add(secLineas);
  const seccionIfc = (): Float32Array => {
    const clip = (window as any).__hekatanClip;
    if (!clip || (window as any).__hekatanRefIfcSnap === false) { secLineas.visible = false; return (_secSegs = new Float32Array(0)); }
    const planos: Array<[number, number]> = [];   // [eje, posición]
    if (clip.enableX) planos.push([0, +clip.posX]);
    if (clip.enableY) planos.push([1, +clip.posY]);
    if (clip.enableZ) planos.push([2, +clip.posZ]);
    const mallas: THREE.Mesh[] = [];
    scene.traverse((o) => { if ((o as any).userData?.refIfc && (o as THREE.Mesh).isMesh) mallas.push(o as THREE.Mesh); });
    const clave = JSON.stringify(planos) + "|" + mallas.map((m) => m.id).join(",");
    if (clave === _secClave) return _secSegs;
    _secClave = clave;
    const out: number[] = [];
    if (planos.length && mallas.length) {
      const v = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
      for (const m of mallas) {
        const pos = (m.geometry as THREE.BufferGeometry).getAttribute("position");
        if (!pos) continue;
        m.updateMatrixWorld();
        for (let t = 0; t + 2 < pos.count; t += 3) {
          for (let k = 0; k < 3; k++) v[k].fromBufferAttribute(pos, t + k).applyMatrix4(m.matrixWorld);
          for (const [eje, c] of planos) {
            const d = [v[0].getComponent(eje) - c, v[1].getComponent(eje) - c, v[2].getComponent(eje) - c];
            const cruces: THREE.Vector3[] = [];
            for (let k = 0; k < 3; k++) {
              const a = v[k], b = v[(k + 1) % 3], da = d[k], db = d[(k + 1) % 3];
              if ((da < 0 && db >= 0) || (da >= 0 && db < 0)) cruces.push(a.clone().lerp(b, da / (da - db)));
            }
            if (cruces.length === 2) out.push(cruces[0].x, cruces[0].y, cruces[0].z, cruces[1].x, cruces[1].y, cruces[1].z);
          }
        }
      }
    }
    _secSegs = new Float32Array(out);
    secLineas.geometry.dispose();
    secLineas.geometry = new THREE.BufferGeometry();
    secLineas.geometry.setAttribute("position", new THREE.BufferAttribute(_secSegs, 3));
    secLineas.visible = _secSegs.length > 0;
    return _secSegs;
  };
  /** Punto del perfil de sección más cercano al cursor (en píxeles), o null. */
  let _secAdj: Map<string, number[]> | null = null; let _secAdjDe: Float32Array | null = null;
  const snapSeccionIfc = (px: number, py: number): THREE.Vector3 | null => {
    const S = seccionIfc(); if (!S.length) return null;
    let mejor = _aperturaPx * 2, best: THREE.Vector3 | null = null, bestS = -1;
    const A = new THREE.Vector3(), B = new THREE.Vector3();
    for (let i = 0; i + 5 < S.length; i += 6) {
      A.set(S[i], S[i + 1], S[i + 2]); B.set(S[i + 3], S[i + 4], S[i + 5]);
      const a = aPixeles(A.x, A.y, A.z), b = aPixeles(B.x, B.y, B.z); if (!a || !b) continue;
      const vx = b.x - a.x, vy = b.y - a.y, L2 = vx * vx + vy * vy || 1e-9;
      let t = ((px - a.x) * vx + (py - a.y) * vy) / L2; t = Math.max(0, Math.min(1, t));
      const dpx = Math.hypot(px - (a.x + t * vx), py - (a.y + t * vy));
      if (dpx < mejor) { mejor = dpx; best = A.clone().lerp(B, t); bestS = i / 6; }
    }
    if (bestS >= 0) { if (_secAdjDe !== S) { _secAdj = adjDe(S); _secAdjDe = S; } _cadenaFuente = { S, adj: _secAdj!, s: bestS }; }
    return best;
  };
  let _secPt: THREE.Vector3 | null = null;
  (window as any).__hekatanSeccionIfc = () => seccionIfc().length / 6;
  // Muestra de puntos del perfil (para pruebas y para «Ver sección»).
  (window as any).__hekatanSeccionIfcPuntos = (n = 200) => {
    const S = seccionIfc(); const out: number[][] = []; const paso = Math.max(1, Math.floor(S.length / 6 / n));
    for (let i = 0; i + 2 < S.length; i += 6 * paso) out.push([S[i], S[i + 1], S[i + 2]]);
    return out;
  };
  const intersectWorkPlane = () => {
    _refHit = null;
    // PRIORIDAD 0: la referencia IFC bajo el cursor.
    const ref = intersectReferenciaIfc();
    if (ref) return ref;
    // PLANO INCLINADO activo → raycast SOLO el plano de trabajo (que ya está
    // inclinado vía gridTarget). Ignoramos planos de referencia/grid para que
    // el click caiga sobre la inclinación y el área salga inclinada de verdad.
    if (inclinedPlaneActive) {
      return raycaster.intersectObjects([plane], false);
    }
    // Sincronizar visibilidad de planeXZ/YZ con flags globales
    planeXZ.visible = !!(window as any).__hekatanGridPlaneXZ;
    planeYZ.visible = !!(window as any).__hekatanGridPlaneYZ;
    // PRIORIDAD 1: Planos ortogonales del último punto (XY/XZ/YZ).
    // Cuando están visibles, son la referencia ACTIVA del usuario — el rubber
    // band debe caer ahí, no en el plano global XY (que es gigante 10000m
    // y siempre "gana" por estar más cerca a la cámara). Sin esta
    // priorización, ORTO siempre detecta X o Y (nunca Z) en iso.
    // DESACOPLADO: los planos de referencia pueden estar VISIBLES (visual)
    // sin INTERCEPTAR el rayo. El raycast de los planos ortogonales es opt-in
    // (__hekatanOrthoRaycast === true). Por defecto OFF → el click cae en el
    // plano de trabajo (evita que en iso el rayo enganche el plano equivocado),
    // mientras los planos siguen viéndose tenues como guía.
    const orthoRaycast = (window as any).__hekatanOrthoRaycast === true;
    if (orthoRaycast && refFillXY.visible) {
      const orthoHits = raycaster.intersectObjects(
        [refFillXY, refFillXZ, refFillYZ], false,
      );
      if (orthoHits.length > 0) return orthoHits;
    }
    // PRIORIDAD 2: grid planes XZ/YZ del Settings (si activos) + planos
    // de referencia Z=0,3,6,9,12 (si visibles) + workplane XY global.
    const targets: THREE.Object3D[] = [plane];
    if (planeXZ.visible) targets.push(planeXZ);
    if (planeYZ.visible) targets.push(planeYZ);
    if (refPlanesGroup.visible && refPlaneMeshes.length > 0) {
      targets.push(...refPlaneMeshes);
    }
    return raycaster.intersectObjects(targets, false);
  };
  const points = new THREE.Points(
    new THREE.BufferGeometry(),
    new THREE.PointsMaterial()
  );

  const indicationPoint = new THREE.Points(
    new THREE.BufferGeometry(),
    // sizeAttenuation:false → size en PÍXELES (no en world units).
    // Antes, size era world-units con atenuación; al zoomear in el cuadrado
    // gris crecía hasta ser enorme. Ahora queda fijo a ~6px en pantalla.
    new THREE.PointsMaterial({ color: "gray", sizeAttenuation: false, size: 6 })
  );

  const activePoints = new THREE.Points(
    new THREE.BufferGeometry(),
    // Los puntos ya colocados del dibujo en curso. `sizeAttenuation:false` →
    // size en PÍXELES, igual que `indicationPoint` (el gris, 6 px).
    // ⚠️ Estaba con `size: 0.1` SIN atenuación desactivada, o sea 0.10 m del
    // mundo: al acercar el zoom el punto naranja crecía hasta tapar lo que se
    // estaba dibujando, y al alejar desaparecía. Los marcadores de hover ya se
    // escalaban para verse constantes (~6 px) y este no: era el único.
    // 5 px: se ve, pero no tapa el dibujo (el gris de referencia son 6).
    new THREE.PointsMaterial({ color: "orange", sizeAttenuation: false, size: 5 })
  );
  scene.add(activePoints);

  // ── DIMENSION LABEL EN RUBBER BAND (sólo mientras se dibuja) ──
  // Sprite UNA SOLA vez con la longitud de la línea pendiente (último
  // punto → cursor). NO se persisten labels en segmentos ya confirmados.
  // El usuario los ve mientras prolonga, una vez click fijado se quita
  // (la coord readout sigue mostrando coords del cursor).
  // Rubber label EDITABLE — input HTML con tamaño FIJO en pixels (AutoCAD-style).
  // El usuario puede tipear un valor numérico + Enter → confirma el segundo
  // punto a esa distancia exacta en la dirección actual del cursor.
  // Auto-focus cuando se tipea un dígito durante un rubber band activo.
  const rubberLabelInput = document.createElement("input");
  rubberLabelInput.id = "hk-rubber-label";
  rubberLabelInput.type = "text";
  rubberLabelInput.spellcheck = false;
  // Tooltip de sintaxis estilo AutoCAD — aparece al hacer hover sobre el input
  rubberLabelInput.title =
    "Sintaxis estilo AutoCAD:\n" +
    "  5         → 5m en dirección del cursor (DDE)\n" +
    "  5,3,2     → coordenada absoluta (X,Y,Z)\n" +
    "  @5,3,2    → relativa al último punto\n" +
    "  5<45      → polar 2D: 5m a 45° desde origen\n" +
    "  @5<45     → polar relativa: 5m a 45° del último punto\n" +
    "  @5<45<30  → esférica 3D: 5m, azimuth 45°, elevación 30°";
  rubberLabelInput.style.cssText = [
    "position:fixed", "z-index:99996",
    "padding:3px 8px", "background:rgba(15,23,42,0.92)",
    "color:#22d3ee", "border:1.5px solid #22d3ee", "border-radius:4px",
    "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold",
    "transform:translate(-50%,-50%)", "white-space:nowrap",
    "outline:none", "width:80px", "text-align:center",
    "display:none",
    // CLAVE: el click pasa al lienzo (está justo en el punto donde clickeás).
    // El input se enfoca por código, así que no necesita recibir el click.
    "pointer-events:none",
  ].join(";") + ";";
  document.body.appendChild(rubberLabelInput);
  // Cuadro de ÁNGULO junto al extremo (el «0°» de la foto de AutoCAD): solo lectura.
  const rubberAngle = document.createElement("div");
  rubberAngle.id = "hk-rubber-angle";
  rubberAngle.style.cssText = [
    "position:fixed", "z-index:99996", "pointer-events:none",
    "padding:2px 6px", "background:rgba(15,23,42,0.92)",
    "color:#22d3ee", "border:1px solid #22d3ee", "border-radius:3px",
    "font-family:Consolas,monospace", "font-size:12px",
    "transform:translate(-50%,0)", "white-space:nowrap", "display:none",
  ].join(";") + ";";
  document.body.appendChild(rubberAngle);
  // State para "AutoCAD direct distance entry":
  //   - rubberStart: punto inicial del rubber band (último click)
  //   - rubberDir: dirección unitaria desde rubberStart al cursor
  //   - rubberCurrentLen: longitud actual del cursor (sólo display)
  let rubberStart: [number, number, number] | null = null;
  let rubberDir: [number, number, number] | null = null;
  // Flag: true cuando el usuario tipeó manualmente algo en el input. Mientras
  // sea true NO se sobreescribe el value con la cota live del cursor (sino
  // perderíamos lo que está tipeando). Se resetea al confirmar (Enter), al
  // hacer Esc, o al hacer un click nuevo.
  let rubberUserEditing = false;
  const _rubberMid = new THREE.Vector3();
  const updateRubberLabel = (ax: number, ay: number, az: number, bx: number, by: number, bz: number) => {
    const dx = bx - ax, dy = by - ay, dz = bz - az;
    const dL = Math.hypot(dx, dy, dz);
    if (dL < 0.01) { rubberLabelInput.style.display = "none"; return; }
    rubberStart = [ax, ay, az];
    rubberDir = [dx / dL, dy / dL, dz / dL];
    // Proyectar midpoint world → screen usando la cámara activa
    _rubberMid.set((ax+bx)/2, (ay+by)/2, (az+bz)/2);
    _rubberMid.project(getActiveCamera());
    const rect = rendererElm.getBoundingClientRect();
    const sx = rect.left + (_rubberMid.x * 0.5 + 0.5) * rect.width;
    const sy = rect.top + (-_rubberMid.y * 0.5 + 0.5) * rect.height;
    rubberLabelInput.style.left = sx + "px";
    rubberLabelInput.style.top = sy + "px";
    rubberLabelInput.style.display = "block";
    // Ángulo en pantalla, antihorario desde la derecha (en planta y alzado = ángulo del plano)
    const _pa = new THREE.Vector3(ax, ay, az).project(getActiveCamera());
    const _pb = new THREE.Vector3(bx, by, bz).project(getActiveCamera());
    const ax2 = rect.left + (_pa.x * 0.5 + 0.5) * rect.width, ay2 = rect.top + (-_pa.y * 0.5 + 0.5) * rect.height;
    const bx2 = rect.left + (_pb.x * 0.5 + 0.5) * rect.width, by2 = rect.top + (-_pb.y * 0.5 + 0.5) * rect.height;
    let ang = Math.atan2(-(by2 - ay2), bx2 - ax2) * 180 / Math.PI;
    if (ang < 0) ang += 360;
    rubberAngle.textContent = `${Math.round(ang) % 360}°`;
    rubberAngle.style.left = bx2 + "px";
    rubberAngle.style.top = (by2 + 34) + "px";
    rubberAngle.style.display = "block";
    // Live update del value mientras el usuario NO esté editando manualmente.
    if (!rubberUserEditing) {
      rubberLabelInput.value = `${dL.toFixed(2)} m`;
      // Mantener el input enfocado (cursor parpadeante visible) y todo el
      // texto seleccionado — así tipear cualquier dígito reemplaza el valor
      // automáticamente, estilo AutoCAD/Revit. El user no necesita clickear.
      if (document.activeElement !== rubberLabelInput) {
        // No robar focus si está editando otro input (Tweakpane, etc.)
        const ae = document.activeElement;
        const isOtherInput = ae && (ae.tagName === "INPUT" || ae.tagName === "TEXTAREA")
                              && ae !== rubberLabelInput;
        if (!isOtherInput) rubberLabelInput.focus({ preventScroll: true });
      }
      // Seleccionar todo el texto: tipear lo reemplaza directamente
      try { rubberLabelInput.select(); } catch {}
    }
  };
  const hideRubberLabel = () => {
    rubberLabelInput.style.display = "none";
    rubberAngle.style.display = "none";
    rubberStart = null;
    rubberDir = null;
    rubberUserEditing = false;
    if (document.activeElement === rubberLabelInput) rubberLabelInput.blur();
  };
  // Confirma el endpoint a la distancia tipeada: nuevo punto = start + dir*L
  const commitTypedDistance = (lengthM: number) => {
    // Para tools 3D (col/wall/extp/extl) la "distancia" tipeada es la ALTURA
    // del elemento — la guardamos para que el próximo click la use.
    const curTool = ((window as any).__hekatanCadState?.get?.() as any)?.tool ?? "select";
    if (curTool === "offset") {
      pendingDist = lengthM;
      updateStatus(`⇉ DESFASE distancia ${lengthM} m — designe la línea y luego el lado.`);
      rubberLabelInput.blur();
      try { (window as any).__hekatanCadRefreshPrompt?.(); } catch {}
      return;
    }
    if (curTool === "circle" && pendingClicks.length === 1) {
      // "CIRCULO centro, radio 3": la cifra es el radio
      const c = pendingClicks[0];
      pendingClicks = [];
      (window as any).__hekatanDrawCircle?.(c[0], c[1], c[2], lengthM);
      updateStatus(`✓ Círculo r=${lengthM} m en (${c[0].toFixed(2)}, ${c[1].toFixed(2)}, ${c[2].toFixed(2)}).`);
      try { (window as any).__hekatanRebuild?.(); } catch {}
      try { (window as any).__hekatanCadRefreshPrompt?.(); } catch {}
      return;
    }
    if (curTool === "col" || curTool === "wall" || curTool === "extp" || curTool === "extl") {
      pendingHeight = lengthM;
      const labels: any = { col: "columna", wall: "pared", extp: "extrusión punto→línea", extl: "extrusión línea→área" };
      updateStatus(`📐 Altura ${lengthM}m memorizada — hacé el click para crear ${labels[curTool]}.`);
      rubberLabelInput.blur();
      return;
    }
    if (!rubberStart || !rubberDir || !drawingObj.polylines) return;
    // Si hay axis lock activo, OVERRIDE la dirección al eje correspondiente.
    // Sin esto, "Lock Z + tipear 3 + Enter" usaría la dirección del cursor
    // al último hover (puede no ser vertical).
    let dx = rubberDir[0], dy = rubberDir[1], dz = rubberDir[2];
    if (axisLock === "x") { dx = Math.sign(dx) || 1; dy = 0; dz = 0; }
    else if (axisLock === "y") { dx = 0; dy = Math.sign(dy) || 1; dz = 0; }
    else if (axisLock === "z") { dx = 0; dy = 0; dz = Math.sign(dz) || 1; }
    const ex = rubberStart[0] + dx * lengthM;
    const ey = rubberStart[1] + dy * lengthM;
    const ez = rubberStart[2] + dz * lengthM;
    // Agregar punto + extender la polilínea actual (mismo flujo que click)
    if ((window as any).__hekatanPushUndo) (window as any).__hekatanPushUndo();
    drawingObj.points.val = [...drawingObj.points.rawVal, [ex, ey, ez]];
    const polys = drawingObj.polylines.rawVal;
    const last = polys.length ? polys[polys.length - 1] : [];
    drawingObj.polylines.val = [
      ...polys.slice(0, -1),
      [...last, drawingObj.points.rawVal.length - 1],
    ];
    rubberLabelInput.blur();
    try { (window as any).__hekatanRebuild?.(); } catch {}
    viewerRender();
  };
  // ── Parser estilo AutoCAD para el input del rubber label ──
  // Acepta:
  //   "5"         → DDE: 5m en dirección del cursor
  //   "5,3"       → absCart 2D (x=5, y=3, z=0)
  //   "5,3,2"     → absCart 3D
  //   "@5,3"      → relCart 2D desde último punto (Δx=5, Δy=3, Δz=0)
  //   "@5,3,2"    → relCart 3D
  //   "5<45"      → absPolar 2D (5m a 45° desde origen, plano XY)
  //   "@5<45"     → relPolar 2D (5m a 45° desde último punto)
  //   "@5<45<30"  → relSpherical 3D (5m, azimuth 45°, elevación 30°)
  type ParsedInput =
    | { kind: "length"; L: number }
    | { kind: "absCart"; x: number; y: number; z: number }
    | { kind: "relCart"; dx: number; dy: number; dz: number }
    | { kind: "absPolar"; L: number; ang: number }
    | { kind: "relPolar"; L: number; ang: number }
    | { kind: "relSpherical"; L: number; az: number; el: number }
    | null;
  const parseAutoCadInput = (raw: string): ParsedInput => {
    let s = raw.trim().toLowerCase().replace(/m$/g, "").trim();
    if (!s) return null;
    const isRel = s.startsWith("@");
    if (isRel) s = s.slice(1);
    // Polar / esférica: contiene "<"
    if (s.includes("<")) {
      const parts = s.split("<").map(p => parseFloat(p.trim()));
      if (parts.some(isNaN)) return null;
      if (parts.length === 2) {
        const [L, ang] = parts;
        return isRel ? { kind: "relPolar", L, ang } : { kind: "absPolar", L, ang };
      }
      if (parts.length === 3 && isRel) {
        const [L, az, el] = parts;
        return { kind: "relSpherical", L, az, el };
      }
      return null;
    }
    // Cartesiana: contiene ","
    if (s.includes(",")) {
      const parts = s.split(",").map(p => parseFloat(p.trim()));
      if (parts.some(isNaN)) return null;
      const [x, y, z = 0] = parts;
      return isRel ? { kind: "relCart", dx: x, dy: y, dz: z }
                   : { kind: "absCart", x, y, z };
    }
    // Solo número → DDE (longitud)
    const v = parseFloat(s);
    if (isNaN(v) || v <= 0) return null;
    return { kind: "length", L: v };
  };
  // Convierte cualquier ParsedInput en el punto FINAL (x,y,z) que se agrega
  // a la polilínea. Necesita rubberStart (último punto) para los modos rel.
  const resolveParsedInput = (p: ParsedInput): [number, number, number] | null => {
    if (!p) return null;
    // ── EL ORIGEN LOCAL (SCU) ────────────────────────────────────────────────
    // Jorge (16-sep-2026, con el dibujo de los dos trípodes): «cuando hacía un
    // vector había una posición donde dentro había otra coordenada; es lo que
    // quiero para dibujar en 3D».
    //
    // Es el SCU de AutoCAD: pones el origen en un punto del modelo y a partir de
    // ahí «0,0,0» es ESE punto. Sin esto, para dibujar un pórtico que arranca en
    // (12, 7, 3.2) hay que sumar a mano en cada coordenada, que es justo lo que
    // vuelve impracticable teclear en 3D.
    const O = ((window as any).__hekatanSCU ?? [0, 0, 0]) as [number, number, number];
    if (p.kind === "absCart") return [O[0] + p.x, O[1] + p.y, O[2] + p.z];
    if (p.kind === "relCart") {
      if (!rubberStart) return null;
      return [rubberStart[0] + p.dx, rubberStart[1] + p.dy, rubberStart[2] + p.dz];
    }
    if (p.kind === "absPolar") {
      const a = p.ang * Math.PI / 180;
      return [O[0] + p.L * Math.cos(a), O[1] + p.L * Math.sin(a), O[2]];
    }
    if (p.kind === "relPolar") {
      if (!rubberStart) return null;
      const a = p.ang * Math.PI / 180;
      return [rubberStart[0] + p.L * Math.cos(a),
              rubberStart[1] + p.L * Math.sin(a),
              rubberStart[2]];
    }
    if (p.kind === "relSpherical") {
      if (!rubberStart) return null;
      const az = p.az * Math.PI / 180;  // azimuth (XY plane angle)
      const el = p.el * Math.PI / 180;  // elevation (Z angle)
      const horiz = p.L * Math.cos(el);
      return [rubberStart[0] + horiz * Math.cos(az),
              rubberStart[1] + horiz * Math.sin(az),
              rubberStart[2] + p.L * Math.sin(el)];
    }
    return null;  // length → manejado aparte por commitTypedDistance
  };
  // Commit un punto absoluto (x,y,z) — equivalente a un click en esa coord.
  //
  // ⚠️ Antes esto empujaba el punto DIRECTO a `drawingObj.points/polylines`, que
  // es el camino de la Línea y la Polilínea y de nadie más. O sea que teclear
  // una coordenada con el Arco, el Círculo, la Parábola, la Cúbica, el
  // Rectángulo, el Muro o la Columna activos NO le llegaba a la herramienta:
  // el punto caía suelto en la polilínea y la herramienta seguía esperando su
  // primer clic para siempre. Medido en el DEPLOY PÚBLICO el 17-sep-2026 con
  // el Arco y «0,0,6.5 / 10,0,9.5 / 20,0,6.5»: 1 nudo suelto, 0 barras, y el
  // pie repitiendo «ARCO Precise punto inicial». Por eso no se podía dibujar
  // una cercha curva tecleando cotas.
  //
  // Ahora va por `procesarClic`, que es EL MISMO reparto por herramienta que
  // usa el ratón (y el que ya usaba `__hekatanTypeCoord`, la caja de comandos
  // de abajo): un punto tecleado es un clic en esa coordenada, ni más ni menos.
  // De regalo reusa el nudo que ya exista a ≤ 1 mm en vez de crear otro encima.
  const commitAbsolutePoint = (pt: [number, number, number]) => {
    procesarClic(new THREE.Vector3(pt[0], pt[1], pt[2]), null);
    // El punto tecleado pasa a ser el origen del siguiente relativo: sin esto
    // «0,0,3» + «@6,0,0» por la caja de comandos daba «desconocido», porque
    // rubberStart solo lo fijaba el ratón (updateRubberLabel) y con el
    // teclado nunca llegaba a existir. Medido el 8-sep-2026 capturando el
    // vídeo 2 de School: 3 coordenadas → 1 nudo y 0 tramos.
    rubberStart = pt;
    // NO se hace blur: una herramienta de varios puntos (Arco 3, Cúbica 4)
    // se teclea de corrido, y con el foco perdido el segundo punto se iba al
    // vacío. Se deja el campo vivo y seleccionado para el punto siguiente.
    rubberUserEditing = false;
    try { rubberLabelInput.select(); } catch {}
    try { (window as any).__hekatanRebuild?.(); } catch {}
    viewerRender();
    try { (window as any).__hekatanCadRefreshPrompt?.(); } catch {}
  };

  // Exponer para que la barra de comandos pueda colocar un punto desde una
  // COORDENADA tipeada: "1,1,1" (abs), "@5,3" (rel), "5<45" (polar), "5" (DDE).
  // Devuelve true si pudo ubicar el punto.
  (window as any).__hekatanTypeCoord = (raw: string): boolean => {
    const parsed = parseAutoCadInput(raw);
    if (!parsed) return false;
    if (parsed.kind === "length") { commitTypedDistance(parsed.L); return true; }
    const pt = resolveParsedInput(parsed);
    if (!pt) return false;
    // El punto tecleado se trata EXACTAMENTE como un clic en ese sitio: la
    // misma funcion reparte por herramienta (linea, circulo, muro, mover...).
    procesarClic(new THREE.Vector3(pt[0], pt[1], pt[2]), null);
    rubberStart = pt;
    rubberLabelInput.blur();
    try { (window as any).__hekatanCadRefreshPrompt?.(); } catch {}
    return true;
  };

  // Keydown del input — Enter confirma, Esc finaliza, X/Y/Z se delegan al
  // handler global para axis lock, y cualquier dígito marca "userEditing"
  // para que el value no se pise con la cota live mientras el user tipea.
  rubberLabelInput.addEventListener("keydown", (ev: KeyboardEvent) => {
    if (ev.key === "Enter") {
      ev.preventDefault();
      // ⚠️ Enter SIN haber tecleado nada = terminar, como en AutoCAD. La cota viva
      // («1.41») se tomaba como distancia tecleada (DDE) y ponía un punto más en la
      // dirección del cursor: dos barras sobrantes en la esquina de la cercha
      // (medido en el Tutorial 9, 13-sep-2026).
      if (!rubberUserEditing) { (window as any).__hekatanFinalizeDraw?.(); try { (window as any).__hekatanCadState?.setTool?.("select"); } catch {} return; }
      const parsed = parseAutoCadInput(rubberLabelInput.value);
      if (!parsed) return;
      rubberUserEditing = false;
      // DDE (solo longitud) usa commitTypedDistance que aplica axisLock
      if (parsed.kind === "length") {
        commitTypedDistance(parsed.L);
        updateStatus(`✏ DDE ${parsed.L}m aplicado en dirección actual`);
      } else {
        const pt = resolveParsedInput(parsed);
        if (!pt) return;
        commitAbsolutePoint(pt);
        const k = parsed.kind;
        updateStatus(`✏ ${k} → (${pt[0].toFixed(2)}, ${pt[1].toFixed(2)}, ${pt[2].toFixed(2)})`);
      }
      return;
    }
    if (ev.key === "Escape") {
      ev.preventDefault();
      rubberUserEditing = false;
      rubberLabelInput.blur();
      // Esc también finaliza dibujo (manejado por handler global)
      return;
    }
    // Delegar X/Y/Z al global handler (axis lock) — NO insertar como texto
    const k = ev.key.toLowerCase();
    if (k === "x" || k === "y" || k === "z") {
      ev.preventDefault();
      // Disparar manualmente el global handler vía un keydown sintético sería
      // raro — mejor: replicar la lógica acá directamente. Pero como el
      // global handler escucha en window, podemos dispatcher un evento.
      // Más simple: hacer toggle directo aquí si el global ya escucha:
      // ya que ev.preventDefault NO previene el bubbling al window listener,
      // dejamos que el global lo procese. Pero antes restauramos la
      // selección para que el cursor quede visible al volver el value.
      setTimeout(() => {
        if (!rubberUserEditing && rubberLabelInput.style.display === "block") {
          try { rubberLabelInput.select(); } catch {}
        }
      }, 0);
      return;
    }
    // Si el user tipea un dígito / punto / minus / Backspace / Delete →
    // marcar como editing. La selección "todo seleccionado" hace que el
    // primer dígito reemplace el value live ("6.95 m" → "5").
    if (/^[0-9.\-]$/.test(ev.key) || ev.key === "Backspace" || ev.key === "Delete") {
      rubberUserEditing = true;
    }
  });
  // Auto-focus + intercept cuando el usuario tipea un dígito durante rubber band
  // activo (igual a AutoCAD: empezás a tipear y el "campo de distancia" agarra
  // el foco automáticamente sin tener que clickear nada).
  window.addEventListener("keydown", (ev: KeyboardEvent) => {
    if (!rubberStart || !rubberDir) return;
    if (document.activeElement === rubberLabelInput) return;
    // Ignorar si está editando otro input (Tweakpane, etc.)
    const ae = document.activeElement;
    if (ae && (ae.tagName === "INPUT" || ae.tagName === "TEXTAREA")) return;
    // Solo agarrar dígitos / punto / minus
    if (/^[0-9.\-]$/.test(ev.key)) {
      rubberLabelInput.value = ev.key;
      rubberLabelInput.focus();
      // Coloca el cursor al final del input (acabamos de escribir 1 char)
      rubberLabelInput.setSelectionRange(1, 1);
      ev.preventDefault();
    }
  });

  // ── COORD READOUT — texto flotante con coord del cursor (X, Y, Z) ──
  const coordReadout = document.createElement("div");
  coordReadout.id = "hk-coord-readout";
  coordReadout.style.cssText = [
    "position:fixed", "pointer-events:none", "z-index:99997",
    "padding:4px 8px", "background:rgba(15,23,42,0.92)",
    "color:#22d3ee", "border:1px solid #22d3ee", "border-radius:4px",
    "font-family:Consolas,monospace", "font-size:11px",
    "transform:translate(12px,-22px)", "white-space:nowrap",
    "display:none",
  ].join(";") + ";";
  coordReadout.textContent = "X=0.00  Y=0.00  Z=0.00";
  document.body.appendChild(coordReadout);

  // ── PANEL FIJO DE COORDS (siempre visible, top-right del canvas) ──
  // Estilo AutoCAD/Revit: las coords del cursor SIEMPRE se ven en una
  // posición fija (no al lado del cursor), incluso cuando el cursor está
  // sobre paneles. Útil para usuarios que prefieren un readout estable.
  // Cosa diferente del coordReadout que sigue al cursor con hover info.
  // Posicionado top-CENTER del canvas (entre el toolbar y el Properties Pane);
  // cuando el Properties Pane se muestra, este panel no choca porque tiene
  // top más arriba (4px vs 8px del Properties).
  const coordFixed = document.createElement("div");
  coordFixed.id = "hk-coord-fixed";
  coordFixed.style.cssText = [
    "position:fixed", "pointer-events:none", "z-index:99998",
    "right:80px", "top:10px",
    "padding:6px 14px", "background:rgba(15,23,42,0.92)",
    "color:#22d3ee", "border:1px solid rgba(34,211,238,0.55)",
    "border-radius:5px", "font-family:Consolas,monospace",
    "font-size:13px", "font-weight:500", "white-space:nowrap",
    "letter-spacing:0.3px",
    "box-shadow:0 2px 8px rgba(0,0,0,0.4)",
    "backdrop-filter:blur(4px)",
  ].join(";") + ";";
  coordFixed.textContent = "X=0.00  Y=0.00  Z=0.00";
  document.body.appendChild(coordFixed);

  // ── RUBBER BAND — línea de preview/prolongación cursor → último punto ──
  // Mientras el usuario mueve el mouse con tool "line"/"polyline" activa,
  // se ve una línea cyan dashed desde el último punto dibujado hasta la
  // posición actual del cursor. Visible en cualquier vista (planta/iso/elev).
  const rubberBand = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0),
    ]),
    new THREE.LineDashedMaterial({
      color: 0x22d3ee, dashSize: 0.2, gapSize: 0.1,
      transparent: true, opacity: 0.85, linewidth: 2,
    })
  );
  rubberBand.frustumCulled = false;
  rubberBand.visible = false;
  rubberBand.name = "rubberBand";
  scene.add(rubberBand);
  // expuesta para poder MEDIR desde fuera si la goma acaba donde el marcador del
  // cursor (cli/_dbg_cursor_coincide.mjs): sin referencia no hay forma de mirarlo
  (window as any).__hekatanRubberBand = rubberBand;

  // ── PREVIEW del ÁREA LIBRE (polígono) ──
  // Línea cyan que muestra el contorno del polígono mientras se clickea.
  const polyAreaPreview = new THREE.Line(
    new THREE.BufferGeometry(),
    new THREE.LineBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.9 }),
  );
  polyAreaPreview.frustumCulled = false;
  polyAreaPreview.visible = false;
  scene.add(polyAreaPreview);
  // Vértices del polígono de área libre en curso (NO se agregan a drawingObj
  // hasta cerrar — así evitamos nodos huérfanos si se cancela).
  let polyAreaPts: [number, number, number][] = [];

  // ── REGLA / MEDIR (estilo SketchUp): 2 puntos → cota con la distancia ──
  const measureLine = new THREE.Line(
    new THREE.BufferGeometry(),
    new THREE.LineBasicMaterial({ color: 0xffcc00, transparent: true, opacity: 0.95 }),
  );
  measureLine.frustumCulled = false; measureLine.visible = false; measureLine.renderOrder = 999;
  scene.add(measureLine);
  let measurePts: [number, number, number][] = [];
  const measureLabel = document.createElement("div");
  measureLabel.id = "hk-measure-label";
  measureLabel.style.cssText =
    "position:fixed;z-index:130;display:none;background:rgba(20,20,10,0.92);color:#ffd24d;" +
    "border:1px solid #ffcc00;border-radius:3px;padding:1px 5px;font:600 10px monospace;pointer-events:none;box-shadow:0 2px 8px rgba(0,0,0,.5)";   // 10 px, no 12 (Jorge, 13-sep-2026: «el valor de la medida lo quiero de menor tamaño»)
  document.body.appendChild(measureLabel);
  // Raycast al PRIMER objeto sólido de la escena (mallas IFC, etc.); si no hay,
  // cae al plano de trabajo. Así se puede medir sobre el modelo 3D importado.
  const puntoBajoCursor = (ev: PointerEvent): [number, number, number] | null => {
    const cam = setPointerFromEvent(ev); if (!cam) return null;
    raycaster.setFromCamera(pointer, cam);
    // Punto base: sobre la malla 3D (IFC) o sobre el plano de trabajo.
    let base: [number, number, number] | null = null;
    let hitFaceVerts: [number, number, number][] | null = null;
    const hits = raycaster.intersectObjects(scene.children, true)
      .filter((h) => (h.object as any).isMesh && h.object !== snapMarker && h.object !== fillPreview && (h.object as any).visible !== false);
    if (hits.length) {
      const h = hits[0]; const p = h.point; base = [p.x, p.y, p.z];
      // Vértices de la CARA impactada (para OSNAP a esquina de la malla IFC).
      const g: any = (h.object as any).geometry; const pos = g?.attributes?.position;
      if (pos && h.face) hitFaceVerts = [h.face.a, h.face.b, h.face.c].map((i: number) => {
        const v = new THREE.Vector3().fromBufferAttribute(pos, i); (h.object as THREE.Mesh).localToWorld(v); return [v.x, v.y, v.z] as [number, number, number];
      });
    } else {
      const inter = intersectWorkPlane(); if (inter.length) { const p = inter[0].point; base = [p.x, p.y, p.z]; }
    }
    if (!base) return null;
    // ── OSNAP: engancha a la ESQUINA/NUDO más cercano dentro de una mirilla en
    // pantalla (~14 px). Así la medida es EXACTA sobre nudos del modelo o
    // esquinas de la malla IFC, no un punto cualquiera de la superficie. ──
    const rect = rendererElm.getBoundingClientRect();
    const px = (w: [number, number, number]) => { const v = new THREE.Vector3(w[0], w[1], w[2]).project(cam);
      return [rect.left + (v.x*0.5+0.5)*rect.width, rect.top + (-v.y*0.5+0.5)*rect.height]; };
    const cur = [ev.clientX, ev.clientY];
    const TOL = 14;
    let best = base, bestD = TOL;
    const consid = (w: [number, number, number]) => { const q = px(w); const d = Math.hypot(q[0]-cur[0], q[1]-cur[1]); if (d < bestD) { bestD = d; best = w; } };
    for (const w of (hitFaceVerts ?? [])) consid(w);
    for (const n of drawingObj.points.rawVal) consid(n as [number, number, number]);
    return best;
  };
  const actualizarLabelMedida = () => {
    if (measurePts.length < 1) { measureLabel.style.display = "none"; return; }
    const cam = getActiveCamera();
    const a = measurePts[0], b = measurePts[1] ?? measurePts[0];
    const mid = new THREE.Vector3((a[0]+b[0])/2, (a[1]+b[1])/2, (a[2]+b[2])/2);
    const v = mid.clone().project(cam);
    const rect = rendererElm.getBoundingClientRect();
    measureLabel.style.left = (rect.left + (v.x*0.5+0.5)*rect.width) + "px";
    measureLabel.style.top = (rect.top + (-v.y*0.5+0.5)*rect.height - 14) + "px";
    measureLabel.style.display = "block";
  };
  (window as any).__hekatanMeasureRefresh = actualizarLabelMedida;
  // Borra la cota actual (puntos + línea + label). Sin esto, la última medida
  // se queda flotando y reaparece al orbitar (el 'change' de controls la
  // vuelve a pintar). Lo usa el visor IFC al pasar de medir a cortar.
  (window as any).__hekatanClearMeasure = () => {
    measurePts = [];
    measureLine.visible = false;
    measureLabel.style.display = "none";
    try { viewerRender(); } catch {}
  };
  try { (controls as any).addEventListener?.("change", actualizarLabelMedida); } catch {}

  // ── HOVER de «Rellenar área»: malla transparente en la celda bajo el cursor ──
  const fillPreview = new THREE.Mesh(
    new THREE.BufferGeometry(),
    new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.35, side: THREE.DoubleSide, depthWrite: false }),
  );
  fillPreview.frustumCulled = false; fillPreview.visible = false; fillPreview.renderOrder = 998;
  fillPreview.name = "hk-fill-preview";
  scene.add(fillPreview);
  rendererElm.addEventListener("pointerleave", () => { coordReadout.style.display = "none"; if (fillPreview.visible) { fillPreview.visible = false; viewerRender(); } });
  /** Celda cerrada (4 sin diagonal o triángulo) que contiene el punto P (en el plano). */
  const celdaCerradaBajoPunto = (P3: [number, number, number]): number[] | null => {
    const pts = drawingObj.points.rawVal, polys = drawingObj.polylines?.rawVal ?? [];
    const adj = new Map<number, Set<number>>();
    const addE = (a: number, b: number) => { if (a === b) return; (adj.get(a) ?? adj.set(a, new Set()).get(a)!).add(b); (adj.get(b) ?? adj.set(b, new Set()).get(b)!).add(a); };
    for (const poly of polys) for (let i = 0; i + 1 < poly.length; i++) addE(poly[i], poly[i + 1]);
    const has = (a: number, b: number) => !!adj.get(a)?.has(b);
    const cells: number[][] = []; const seen = new Set<string>(); const ids = [...adj.keys()];
    for (const a of ids) for (const b of adj.get(a)!) { if (b < a) continue;
      for (const c of adj.get(b)!) { if (c === a) continue;
        for (const d of adj.get(c)!) { if (d === a || d === b || !has(d, a)) continue; if (has(a, c) || has(b, d)) continue;
          const k = [a, b, c, d].slice().sort((x, y) => x - y).join("-"); if (!seen.has(k)) { seen.add(k); cells.push([a, b, c, d]); } } } }
    for (const a of ids) for (const b of adj.get(a)!) { if (b < a) continue;
      for (const c of adj.get(b)!) { if (c === a || !has(c, a)) continue; const k = [a, b, c].slice().sort((x, y) => x - y).join("-"); if (!seen.has(k)) { seen.add(k); cells.push([a, b, c]); } } }
    const plane = (window as any).__hekatanCadState?.get?.()?.workPlane ?? "xy";
    const to2 = (q: number[]): [number, number] => plane === "xy" ? [q[0], q[1]] : plane === "xz" ? [q[0], q[2]] : [q[1], q[2]];
    const P = to2(P3);
    const pin = (pp: [number, number], poly: [number, number][]) => { let ins = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1]; if (((yi > pp[1]) !== (yj > pp[1])) && (pp[0] < (xj - xi) * (pp[1] - yi) / (yj - yi) + xi)) ins = !ins; } return ins; };
    const parea = (poly: [number, number][]) => { let a = 0; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) a += (poly[j][0] + poly[i][0]) * (poly[j][1] - poly[i][1]); return Math.abs(a) / 2; };
    let best: number[] | null = null, bestA = Infinity;
    for (const c of cells) { const poly = c.map((id) => to2(pts[id])) as [number, number][]; if (!pin(P, poly)) continue; const A = parea(poly); if (A < bestA) { bestA = A; best = c; } }
    return best;
  };

  // ── PLANO DE TRABAJO INCLINADO — guía visible (GRILLA de referencia) ──
  // Relleno semitransparente + borde + LÍNEAS DE GRILLA cada 1 m, orientado al
  // plano inclinado (UCS por 3 puntos). Sirve de REFERENCIA para dibujar
  // (líneas, áreas, todo) sobre ese plano. Las geometrías se reconstruyen al
  // tamaño real en __hekatanSetInclinedPlaneFrom3 (sin escalar el grupo, para
  // que el paso de 1 m sea real).
  const inclinedHelper = new THREE.Group();
  const inclinedFill = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.08, side: THREE.DoubleSide, depthWrite: false }),
  );
  const inclinedBorder = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.PlaneGeometry(1, 1)),
    new THREE.LineBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.85 }),
  );
  const inclinedGrid = new THREE.LineSegments(
    new THREE.BufferGeometry(),
    new THREE.LineBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.30 }),
  );
  // Rellena la geometría del grid en el plano XY local (z=0), de -half..half
  // cada `step`, para que el grupo (orientado al plano) lo muestre inclinado.
  const buildInclinedGrid = (half: number, step: number) => {
    const verts: number[] = [];
    const n = Math.ceil(half / step);
    for (let i = -n; i <= n; i++) {
      const c = i * step;
      verts.push(-half, c, 0, half, c, 0);   // líneas paralelas al eje u
      verts.push(c, -half, 0, c, half, 0);   // líneas paralelas al eje v
    }
    inclinedGrid.geometry.dispose();
    inclinedGrid.geometry = new THREE.BufferGeometry();
    inclinedGrid.geometry.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  };
  inclinedHelper.add(inclinedFill, inclinedBorder, inclinedGrid);
  inclinedHelper.visible = false;
  inclinedHelper.frustumCulled = false;
  scene.add(inclinedHelper);

  // ── EJES DE PROLONGACIÓN (Ortho/Polar tracking) ──
  // Líneas dashed desde el último punto en direcciones X/Y/Z + diagonales
  // 45°. Aparecen cuando el cursor está cerca de uno de esos ángulos.
  const polarLines = new THREE.Group();
  polarLines.frustumCulled = false;
  polarLines.visible = false;
  scene.add(polarLines);
  const mkPolarLine = (col: number) => {
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0),
    ]);
    const mat = new THREE.LineDashedMaterial({
      color: col, dashSize: 0.15, gapSize: 0.08,
      transparent: true, opacity: 0.5, linewidth: 1,
    });
    return new THREE.Line(geo, mat);
  };
  const polarX = mkPolarLine(0xff0000);  // rojo X
  const polarY = mkPolarLine(0x00ff00);  // verde Y
  const polarZ = mkPolarLine(0x0088ff);  // azul Z
  polarLines.add(polarX, polarY, polarZ);
  // ── RASTREO DE REFERENCIA (el «object snap tracking» de AutoCAD) ──────────
  //
  // Las líneas de arriba salen del ÚLTIMO punto y solo dicen ángulo. Lo que
  // faltaba es la otra referencia: la que sale de un nudo YA DIBUJADO y te dice
  // «estás a su misma altura / en su misma vertical». Sin eso, bajando una
  // columna no hay forma de parar en la cota de la base de al lado: el ángulo lo
  // da el ORTO, pero la COTA no la da nadie.
  // las copias tenues de la rejilla en cada nivel (ver el derive de gridTarget)
  const sueloGrids: THREE.Group[] = [];
  const disposeSuelo = (g: THREE.Group) => g.traverse((o: any) => {
    o.geometry?.dispose?.();
    o.material?.dispose?.();
  });
  const trackLine = mkPolarLine(0xffc400);
  (trackLine.material as THREE.LineDashedMaterial).dashSize = 0.28;
  (trackLine.material as THREE.LineDashedMaterial).gapSize = 0.16;
  (trackLine.material as THREE.LineDashedMaterial).opacity = 0.9;
  trackLine.frustumCulled = false;
  trackLine.visible = false;
  trackLine.renderOrder = 98;
  scene.add(trackLine);
  // ── Planos de referencia ortogonales (estilo SketchUp inferencing) ──
  // 3 rectángulos coloreados centrados en el último punto, uno por cada
  // plano principal (XY verde / XZ rojo / YZ azul). Sirven como guía visual
  // y snap targets — el cursor engancha al plano cuya normal es más
  // perpendicular al rayo de cámara.
  const mkRefPlaneRect = (col: number) => {
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0),
      new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0),
    ]);
    const mat = new THREE.LineBasicMaterial({
      // Bordes de los planos ortogonales — antes 0.9, luego 0.45. Bajado a
      // 0.20: que sean una guía MUY sutil, sin tapar ni dominar la vista.
      color: col, transparent: true, opacity: 0.20,
      depthTest: false,
    });
    const loop = new THREE.LineLoop(geo, mat);
    loop.renderOrder = 997;
    loop.frustumCulled = false;
    return loop;
  };
  const refPlaneXY = mkRefPlaneRect(0x34d399);  // verde — plano XY (perp a Z)
  const refPlaneXZ = mkRefPlaneRect(0xff3344);  // rojo  — plano XZ (perp a Y)
  const refPlaneYZ = mkRefPlaneRect(0x60a5fa);  // azul  — plano YZ (perp a X)
  // ── Grupo SEPARADO para los planos de referencia ortogonales (XY/XZ/YZ) ──
  // Antes estaban dentro de polarLines, pero polarLines.visible solo se hace
  // true durante el rubber band. Eso ocultaba los planos aunque el usuario
  // los activara con el toggle. Ahora viven en su propio grupo controlado
  // únicamente por __hekatanSetOrthoPlanes / __hekatanShowOrthoPlanes.
  // (NOTA: el otro `refPlanesGroup` más abajo en este archivo es para los
  // planos Z=0,3,6,9,12 — DIFERENTES; por eso este se llama orthoRefGroup.)
  const orthoRefGroup = new THREE.Group();
  orthoRefGroup.frustumCulled = false;
  orthoRefGroup.visible = false;
  scene.add(orthoRefGroup);
  orthoRefGroup.add(refPlaneXY, refPlaneXZ, refPlaneYZ);
  // ── Fill semitransparente para resaltar el área del plano ──
  // Cuando el cursor está cerca de un plano, el fill aumenta la opacity
  // (highlight) — facilita identificar visualmente sobre qué plano cae el
  // próximo click.
  const mkRefPlaneFill = (col: number) => {
    const geo = new THREE.PlaneGeometry(1, 1);
    const mat = new THREE.MeshBasicMaterial({
      // Fill semitransparente del plano — opacity inicial muy baja (0.06).
      // Apenas tinta el área para identificar el plano sin tapar geometría.
      color: col, transparent: true, opacity: 0.06,
      side: THREE.DoubleSide, depthWrite: false,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.frustumCulled = false;
    mesh.renderOrder = 996;
    return mesh;
  };
  const refFillXY = mkRefPlaneFill(0x34d399);
  const refFillXZ = mkRefPlaneFill(0xff3344);
  const refFillYZ = mkRefPlaneFill(0x60a5fa);
  orthoRefGroup.add(refFillXY, refFillXZ, refFillYZ);
  // Helper para reposicionar+orientar un fill mesh al plano XY/XZ/YZ
  const updateRefPlaneFill = (
    mesh: THREE.Mesh, lp: number[], plane: "xy" | "xz" | "yz", ext: number,
  ) => {
    mesh.scale.set(2 * ext, 2 * ext, 1);
    if (plane === "xy") {
      // PlaneGeometry default está en XY — no rotar
      mesh.position.set(lp[0], lp[1], lp[2]);
      mesh.rotation.set(0, 0, 0);
    } else if (plane === "xz") {
      // Rotar 90° en X para llevar el plano a XZ
      mesh.position.set(lp[0], lp[1], lp[2]);
      mesh.rotation.set(Math.PI / 2, 0, 0);
    } else {
      // Rotar 90° en Y para llevar el plano a YZ
      mesh.position.set(lp[0], lp[1], lp[2]);
      mesh.rotation.set(0, Math.PI / 2, 0);
    }
  };
  // Badge DOM que muestra qué plano de ref está bajo el cursor (XY/XZ/YZ).
  // Más explícito que solo el highlight de opacity — el usuario VE el nombre.
  const refPlaneBadge = document.createElement("div");
  refPlaneBadge.id = "hk-refplane-badge";
  refPlaneBadge.style.cssText = [
    "position:fixed", "pointer-events:none", "z-index:99997",
    "padding:3px 10px", "border-radius:4px",
    "font-family:Consolas,monospace", "font-size:12px", "font-weight:bold",
    "transform:translate(20px,40px)", "white-space:nowrap",
    "display:none",
  ].join(";") + ";";
  document.body.appendChild(refPlaneBadge);
  // Setter expuesto al window — toggle inmediato del flag con efecto visual.
  // El botón Tweakpane "▦ Planos ref. ortogonales" llama a esto.
  // CRÍTICO: las geometrías de refPlane*/refFill* se inicializan vacías
  // (LineLoop con 4 vectores cero, Mesh PlaneGeometry(1,1) sin scale). Si
  // sólo seteamos `.visible=true` sin actualizar geometría, los planos son
  // invisibles a la vista (degenerados/microscópicos en el origen). Por eso
  // acá llamamos a updateRefPlaneRect/Fill con un anchor (último punto de
  // la polilínea actual o el origen) para que el toggle SE VEA al instante.
  (window as any).__hekatanSetOrthoPlanes = (visible: boolean) => {
    (window as any).__hekatanShowOrthoPlanes = visible;
    // Toggle del grupo entero — controla los 6 hijos (3 borders + 3 fills).
    orthoRefGroup.visible = visible;
    if (visible) {
      // Anchor jerárquico:
      //   1. Último click en modo select (__hekatanOrthoAnchor) ← prioritario
      //   2. Último punto de la polilínea actual
      //   3. Origen (0,0,0)
      const savedAnchor = (window as any).__hekatanOrthoAnchor as number[] | undefined;
      const polys = drawingObj.polylines?.rawVal ?? [];
      const lastPoly = polys[polys.length - 1] ?? [];
      const allPts = drawingObj.points.rawVal ?? [];
      const anchor = savedAnchor && savedAnchor.length === 3
        ? savedAnchor
        : (lastPoly.length > 0 && allPts[lastPoly[lastPoly.length - 1]]
            ? allPts[lastPoly[lastPoly.length - 1]]
            : [0, 0, 0]);
      // Tamaño configurable desde Tweakpane vía window.__hekatanOrthoExt.
      // Default 8m (cuadrado 16×16). Usuario puede agrandar/achicar con slider.
      const ext = (window as any).__hekatanOrthoExt ?? 8;
      updateRefPlaneRect(refPlaneXY, anchor, "xy", ext);
      updateRefPlaneRect(refPlaneXZ, anchor, "xz", ext);
      updateRefPlaneRect(refPlaneYZ, anchor, "yz", ext);
      updateRefPlaneFill(refFillXY, anchor, "xy", ext);
      updateRefPlaneFill(refFillXZ, anchor, "xz", ext);
      updateRefPlaneFill(refFillYZ, anchor, "yz", ext);
      // Opacity inicial: muy transparente (0.10) para que no domine la
      // escena. El borde + el tinte sutil son suficientes para identificar
      // los planos sin tapar la geometría detrás. Hover sube a 0.25.
      (refFillXY.material as THREE.MeshBasicMaterial).opacity = 0.05;
      (refFillXZ.material as THREE.MeshBasicMaterial).opacity = 0.05;
      (refFillYZ.material as THREE.MeshBasicMaterial).opacity = 0.05;
    } else {
      const badge = document.getElementById("hk-refplane-badge");
      if (badge) badge.style.display = "none";
    }
    viewerRender();
  };
  // Setter dedicado para redimensionar los planos ortogonales en vivo.
  // El slider Tweakpane "Tamaño área planos ref." llama a esto en cada cambio.
  // Re-aplica la geometría al ext nuevo usando el anchor actual (saved/last/origen).
  (window as any).__hekatanSetOrthoExt = (extNew: number) => {
    (window as any).__hekatanOrthoExt = extNew;
    if (!orthoRefGroup.visible) { viewerRender(); return; }
    const savedAnchor = (window as any).__hekatanOrthoAnchor as number[] | undefined;
    const polys = drawingObj.polylines?.rawVal ?? [];
    const lastPoly = polys[polys.length - 1] ?? [];
    const allPts = drawingObj.points.rawVal ?? [];
    const anchor = savedAnchor && savedAnchor.length === 3
      ? savedAnchor
      : (lastPoly.length > 0 && allPts[lastPoly[lastPoly.length - 1]]
          ? allPts[lastPoly[lastPoly.length - 1]]
          : [0, 0, 0]);
    updateRefPlaneRect(refPlaneXY, anchor, "xy", extNew);
    updateRefPlaneRect(refPlaneXZ, anchor, "xz", extNew);
    updateRefPlaneRect(refPlaneYZ, anchor, "yz", extNew);
    updateRefPlaneFill(refFillXY, anchor, "xy", extNew);
    updateRefPlaneFill(refFillXZ, anchor, "xz", extNew);
    updateRefPlaneFill(refFillYZ, anchor, "yz", extNew);
    viewerRender();
  };
  // Helper para resaltar un plano (cuando el cursor está cerca).
  // hovered: "xy" | "xz" | "yz" | null. Aumenta contraste: dim casi invisible
  // (0.04), highlight muy visible (0.45). Además muestra badge DOM.
  const setRefPlaneHover = (hovered: "xy" | "xz" | "yz" | null) => {
    // Más sutil: dim 0.04 (casi invisible para no-hover), hover 0.22 (antes
    // 0.45 era demasiado fuerte y tapaba el modelo). Sigue siendo distinguible.
    const dimO = 0.025, hiO = 0.09;
    (refFillXY.material as THREE.MeshBasicMaterial).opacity = hovered === "xy" ? hiO : dimO;
    (refFillXZ.material as THREE.MeshBasicMaterial).opacity = hovered === "xz" ? hiO : dimO;
    (refFillYZ.material as THREE.MeshBasicMaterial).opacity = hovered === "yz" ? hiO : dimO;
    if (hovered) {
      const colors = {
        xy: { bg: "rgba(52,211,153,0.90)", text: "#0a1f12" },
        xz: { bg: "rgba(255,51,68,0.90)",  text: "#1f0a0e" },
        yz: { bg: "rgba(96,165,250,0.90)", text: "#0a1224" },
      };
      const c = colors[hovered];
      refPlaneBadge.style.background = c.bg;
      refPlaneBadge.style.color = c.text;
      refPlaneBadge.textContent = `▦ Plano ${hovered.toUpperCase()}`;
      refPlaneBadge.style.display = "block";
    } else {
      refPlaneBadge.style.display = "none";
    }
  };
  // Helper para actualizar geometría del rectángulo de un plano de ref.
  // Tamaño: ext (8m) — suficientemente grande para verse pero sin dominar.
  const updateRefPlaneRect = (
    line: THREE.Line, lp: number[], plane: "xy" | "xz" | "yz", ext: number,
  ) => {
    let pts: THREE.Vector3[];
    if (plane === "xy") {
      pts = [
        new THREE.Vector3(lp[0] - ext, lp[1] - ext, lp[2]),
        new THREE.Vector3(lp[0] + ext, lp[1] - ext, lp[2]),
        new THREE.Vector3(lp[0] + ext, lp[1] + ext, lp[2]),
        new THREE.Vector3(lp[0] - ext, lp[1] + ext, lp[2]),
        new THREE.Vector3(lp[0] - ext, lp[1] - ext, lp[2]),
      ];
    } else if (plane === "xz") {
      pts = [
        new THREE.Vector3(lp[0] - ext, lp[1], lp[2] - ext),
        new THREE.Vector3(lp[0] + ext, lp[1], lp[2] - ext),
        new THREE.Vector3(lp[0] + ext, lp[1], lp[2] + ext),
        new THREE.Vector3(lp[0] - ext, lp[1], lp[2] + ext),
        new THREE.Vector3(lp[0] - ext, lp[1], lp[2] - ext),
      ];
    } else {
      pts = [
        new THREE.Vector3(lp[0], lp[1] - ext, lp[2] - ext),
        new THREE.Vector3(lp[0], lp[1] + ext, lp[2] - ext),
        new THREE.Vector3(lp[0], lp[1] + ext, lp[2] + ext),
        new THREE.Vector3(lp[0], lp[1] - ext, lp[2] + ext),
        new THREE.Vector3(lp[0], lp[1] - ext, lp[2] - ext),
      ];
    }
    line.geometry.setFromPoints(pts);
  };

  // ── AXIS LOCK (estilo AutoCAD/SketchUp) ──
  // Mientras hay rubber band activo, presionar X/Y/Z restringe el cursor
  // a moverse SOLO en ese eje desde el último punto. Esencial para dibujar
  // columnas verticales (Lock Z), vigas horizontales (Lock X o Y) en iso.
  // Esc o repetir la misma tecla libera el lock.
  let axisLock: "x" | "y" | "z" | null = null;
  (window as any).__hekatanAxisLock = () => axisLock;  // getter para debug
  // Punto enganchado por el SNAP A EJES 3D (pointermove). El click lo usa para
  // que el commit coincida con lo que se ve (evita el "2 cursores"). null = sin
  // enganche de eje en este frame.
  let _axisSnapPoint: THREE.Vector3 | null = null;
  // ── LO QUE SE VE ES LO QUE CAE ───────────────────────────────────────────
  //
  // El movimiento del ratón calculaba el punto con TODO puesto (referencia,
  // enganche, ORTO/POLAR a ±6°, rastreo) y lo enseñaba; y después el CLIC volvía a
  // calcularlo por su cuenta, con otras reglas —el ORTO del clic mira el eje
  // dominante y no sabe nada del polar ni del rastreo—. Bajando una columna se veía
  // la goma a plomo y caía un punto en (3.63, 3.63, −4.05).
  //
  // Se guarda el punto que se ESTÁ enseñando junto al píxel donde está el ratón; si
  // el clic cae en ese mismo píxel (±3 px), se commitea ese punto y no se recalcula
  // nada. Es lo que hace AutoCAD: el clic confirma lo que marca el cursor.
  let _puntoPrevisto: { p: THREE.Vector3; x: number; y: number } | null = null;
  // Label DOM que muestra qué eje está bloqueado
  const axisLockBadge = document.createElement("div");
  axisLockBadge.id = "hk-axis-lock-badge";
  axisLockBadge.style.cssText = [
    "position:fixed", "pointer-events:none", "z-index:99998",
    "padding:4px 10px", "border-radius:4px",
    "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold",
    "transform:translate(20px,18px)", "white-space:nowrap",
    "display:none",
  ].join(";") + ";";
  document.body.appendChild(axisLockBadge);
  const updateAxisLockBadge = () => {
    if (!axisLock) { axisLockBadge.style.display = "none"; return; }
    const colors = { x: "#ff3344", y: "#34d399", z: "#60a5fa" };
    axisLockBadge.style.background = "rgba(15,23,42,0.92)";
    axisLockBadge.style.color = colors[axisLock];
    axisLockBadge.style.border = `1.5px solid ${colors[axisLock]}`;
    axisLockBadge.textContent = `🔒 LOCK ${axisLock.toUpperCase()}`;
    axisLockBadge.style.display = "block";
  };
  // Keyboard handler global: X/Y/Z toggle, Esc libera
  window.addEventListener("keydown", (ev: KeyboardEvent) => {
    // Solo activo si hay rubber band en progreso (rubberStart definido al
    // principio del archivo en updateRubberLabel). Y NO si está editando OTRO
    // input distinto al rubber label (Tweakpane, etc.). El rubber label SÍ
    // permite procesar X/Y/Z aunque tenga focus.
    const ae = document.activeElement;
    if (ae && (ae.tagName === "INPUT" || ae.tagName === "TEXTAREA")
        && ae !== rubberLabelInput) return;
    const k = ev.key.toLowerCase();
    const curToolKd = (window as any).__hekatanCadState?.get?.()?.tool;
    if (ev.key === "Enter" && curToolKd === "polyarea" && polyAreaPts.length >= 3) {
      // Enter cierra y mallar el ÁREA LIBRE en curso.
      const cnt = finalizePolyArea();
      updateStatus(`✓ Área libre mallada — ${cnt} shells Q4 creados.`);
      ev.preventDefault();
      return;
    }
    if (k === "x" || k === "y" || k === "z") {
      // Toggle: si ya estaba en ese eje, libera; si no, cambia a ese eje
      axisLock = (axisLock === k) ? null : (k as "x" | "y" | "z");
      updateAxisLockBadge();
      ev.preventDefault();
    } else if (ev.key === "Escape") {
      // Esc → cancelar acción + DESELECCIONAR. También blur cualquier input.
      const ae = document.activeElement;
      if (ae && (ae.tagName === "INPUT" || ae.tagName === "TEXTAREA")) {
        (ae as HTMLElement).blur();
      }
      escapeCancel();
      ev.preventDefault();
    } else if (ev.key === "F3") {
      // F3 → OSNAP (referencia a objetos) sí/no, como en AutoCAD
      ev.preventDefault();
      (window as any).__hekatanToggleOsnap?.();
    } else if (ev.key === "F10") {
      // F10 → rastreo POLAR sí/no, como en AutoCAD
      ev.preventDefault();
      (window as any).__hekatanTogglePolar?.();
    } else if (ev.key === "F8") {
      ev.preventDefault();
      (window as any).__hekatanToggleOrtho?.();
    }
  });
  // Los conmutadores viven en funciones para que la BARRA DE ESTADO (los
  // botones SNAP · ORTO · POLAR · OSNAP de abajo) y las teclas F hagan lo mismo.
  (window as any).__hekatanToggleOsnap = () => {
    const on = !((window as any).__hekatanOsnapOn ?? true);
    (window as any).__hekatanOsnapOn = on;
    if (!on) hideOsnap();
    updateStatus(`🧲 OSNAP ${on ? "ON" : "OFF"} (F3)`);
  };
  (window as any).__hekatanTogglePolar = () => {
    const on = !((window as any).__hekatanPolarTrack !== false);
    (window as any).__hekatanPolarTrack = on;
    if (!on) polarLines.visible = false;
    updateStatus(`◈ POLAR ${on ? "ON" : "OFF"} (F10)`);
  };
  (window as any).__hekatanToggleOrtho = () => {
    {
      // F8 → toggle ORTO mode (AutoCAD-style). Restringe el rubber band al
      // eje X/Y/Z más cercano AUTOMÁTICAMENTE (axis lock dinámico).
      (window as any).__hekatanOrthoMode = !(window as any).__hekatanOrthoMode;
      const on = (window as any).__hekatanOrthoMode;
      // Refrescar status (re-aplica sufijo con modos activos)
      (window as any).__hekatanRefreshStatus?.();
      // Borde cyan grueso alrededor del viewer activo cuando ORTO=ON.
      // Esto hace IMPOSIBLE no notar el cambio visual al apretar F8.
      let orthoFrame = document.getElementById("hk-ortho-frame");
      if (!orthoFrame) {
        orthoFrame = document.createElement("div");
        orthoFrame.id = "hk-ortho-frame";
        orthoFrame.style.cssText = [
          "position:fixed", "inset:0", "z-index:99996",
          "border:3px solid rgba(34,211,238,0.85)",
          "box-shadow:inset 0 0 24px rgba(34,211,238,0.35)",
          "pointer-events:none",
        ].join(";") + ";";
        document.body.appendChild(orthoFrame);
      }
      orthoFrame.style.display = on ? "block" : "none";
      // Badge visual fijo en la esquina superior — siempre visible cuando ON
      let orthoBadge = document.getElementById("hk-ortho-badge");
      if (!orthoBadge) {
        orthoBadge = document.createElement("div");
        orthoBadge.id = "hk-ortho-badge";
        orthoBadge.style.cssText = [
          "position:fixed", "top:10px", "left:50%",
          "transform:translateX(-50%)", "z-index:99998",
          "padding:6px 16px", "background:rgba(34,211,238,0.95)",
          "color:#0a1f24", "border-radius:6px",
          "border:2px solid rgba(8,145,178,1)",
          "box-shadow:0 4px 16px rgba(34,211,238,0.5)",
          "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold",
          "pointer-events:none", "white-space:nowrap",
        ].join(";") + ";";
        orthoBadge.textContent = "⊥ ORTO ON (F8)";
        document.body.appendChild(orthoBadge);
      }
      orthoBadge.style.display = on ? "block" : "none";
    }
  };
  // Helper: proyecta el rayo del raycaster sobre el eje desde lastPt y
  // devuelve el punto del eje más cercano al cursor en pantalla.
  const _axisLockEndA = new THREE.Vector3();
  const _axisLockEndB = new THREE.Vector3();
  const _axisLockOut = new THREE.Vector3();
  const projectOnAxis = (lastPt: number[]): THREE.Vector3 | null => {
    if (!axisLock) return null;
    const ax = lastPt[0], ay = lastPt[1], az = lastPt[2];
    if (axisLock === "x") {
      _axisLockEndA.set(ax - 10000, ay, az);
      _axisLockEndB.set(ax + 10000, ay, az);
    } else if (axisLock === "y") {
      _axisLockEndA.set(ax, ay - 10000, az);
      _axisLockEndB.set(ax, ay + 10000, az);
    } else {
      _axisLockEndA.set(ax, ay, az - 10000);
      _axisLockEndB.set(ax, ay, az + 10000);
    }
    raycaster.ray.distanceSqToSegment(_axisLockEndA, _axisLockEndB, null as any, _axisLockOut);
    return _axisLockOut;
  };
  (window as any).__hekatanProjectOnAxis = projectOnAxis;

  // ── DELETE HOVER HIGHLIGHT ──
  // Cuando el tool "delete" está activo, esta línea roja gruesa se sitúa
  // sobre la polilínea más cercana al cursor para indicar QUÉ se va a
  // borrar. Al hacer click, la polilínea hover se elimina del modelo.
  const deleteHover = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0),
    ]),
    new THREE.LineBasicMaterial({
      color: 0xff3344, transparent: true, opacity: 0.95, linewidth: 4, depthTest: false,
    })
  );
  deleteHover.renderOrder = 998;
  deleteHover.frustumCulled = false;
  deleteHover.visible = false;
  scene.add(deleteHover);
  // Índice de la polilínea + segmento actualmente hover. El hover resalta
  // SOLO el segmento individual; el delete elimina solo ese segmento (a
  // menos que la polilínea sea un área Q4 — entonces se borra entera).
  let hoveredPolyIndex = -1;
  let hoveredSegIndex = -1;
  // Índice de la línea auxiliar bajo el cursor (-1 = ninguna). El tool
  // "delete" lo usa además de hoveredPolyIndex para borrar tanto polilíneas
  // como aux lines. Las aux lines se almacenan en window.__hekatanDrawingAuxLines
  // como array de [x1,y1,z1,x2,y2,z2] (vanjs State).
  let hoveredAuxIndex = -1;

  // ── SELECCIÓN UNIFICADA (sin tool específico) ──
  // En modo "select" (default), el usuario simplemente pasa el mouse cerca
  // de un nodo / línea / área y se RESALTA en amarillo (hover). Click la
  // SELECCIONA en cyan. Ctrl+Click agrega a la selección (múltiple).
  // IDs de selección: "pt:N" (nodo), "seg:P:S" (segmento polilínea P #S),
  // "poly:P" (polilínea P entera, usado para áreas), "aux:N" (línea aux).
  const selection = new Set<string>();
  (window as any).__hekatanSelection = selection;
  // Línea amarilla de HOVER — resalta lo que el cursor encontró antes de click
  const hoverHL = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]),
    new THREE.LineBasicMaterial({ color: 0xffd700, transparent: true, opacity: 0.95, depthTest: false }),
  );
  hoverHL.renderOrder = 997;
  hoverHL.frustumCulled = false;
  hoverHL.visible = false;
  scene.add(hoverHL);
  // Sphere amarilla para hover de NODOS — radio base 0.02m, escala dinámica
  // según distancia de cámara para que se vea constante en pantalla (~6px).
  const hoverPtHL = new THREE.Mesh(
    new THREE.SphereGeometry(0.02, 12, 12),
    new THREE.MeshBasicMaterial({ color: 0xffd700, transparent: true, opacity: 0.9, depthTest: false }),
  );
  hoverPtHL.renderOrder = 998;
  hoverPtHL.visible = false;
  scene.add(hoverPtHL);
  // Helper compartido: factor de escala para markers point-like (spheres
  // de hover, selection, aux points) que deben verse de tamaño aparente
  // constante en pantalla. Funciona con cámara perspective (usa distance
  // al worldPos) y ortográfica (usa frustum height — distance no afecta
  // tamaño aparente en orto: la cámara queda a D=1000m en setView pero
  // el frustum suele ser ~20m). Sin este ajuste todos los markers se ven
  // como bloques de varios metros en vista elevX/plan/elevY.
  const markerScreenScale = (worldPos: THREE.Vector3): number => {
    const cam = getActiveCamera();
    if ((cam as any).isOrthographicCamera) {
      const o = cam as THREE.OrthographicCamera;
      const H = (o.top - o.bottom) / o.zoom;
      return Math.max(0.05, H * 0.006);  // ~0.6% del alto del frustum
    }
    const dist = cam.position.distanceTo(worldPos);
    return Math.max(0.05, dist / 10);    // perspective: 10m → scale 1
  };
  // ⏳ PENDIENTE (9-sep-2026): esto sigue siendo proporcional al tamaño de LA ESCENA,
  // no al de la pantalla, que es el mismo defecto ya corregido en el cursor y en la
  // mirilla. Con el edificio de 5 plantas, el nudo designado sale como una bola que
  // tapa el modelo. Se probó pasarlo a píxeles (5 px) y salió MÁS GRANDE, así que la
  // bola no viene solo de aquí: hay otro camino que la dibuja y hay que encontrarlo
  // antes de tocar este ayudante, que lo comparten hover, selección y puntos auxiliares.
  const updateHoverPtScale = () => {
    if (!hoverPtHL.visible) return;
    hoverPtHL.scale.setScalar(markerScreenScale(hoverPtHL.position));
  };
  // Grupo CYAN para todos los items SELECCIONADOS (líneas + spheres)
  const selectionGroup = new THREE.Group();
  selectionGroup.frustumCulled = false;
  scene.add(selectionGroup);
  const selColor = 0x22d3ee;  // cyan
  // Estado de hover actual (lo que se va a seleccionar al click)
  let hoverItem: { kind: "pt" | "seg" | "poly" | "aux"; a: number; b?: number } | null = null;

  // Encuentra el NODO (punto individual) más cercano al cursor
  const findClosestPoint = (px: number, py: number, pz: number, tol: number): number => {
    if (!drawingObj.points) return -1;
    const pts = drawingObj.points.rawVal;
    let bestIdx = -1, bestD = tol;
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      if (!p) continue;
      const d = Math.hypot(px - p[0], py - p[1], pz - p[2]);
      if (d < bestD) { bestD = d; bestIdx = i; }
    }
    return bestIdx;
  };

  // Reconstruye los meshes cyan del grupo selectionGroup según el Set selection
  const refreshSelectionGroup = () => {
    while (selectionGroup.children.length) {
      const c = selectionGroup.children.pop()!;
      (c as any).geometry?.dispose?.();
      (c as any).material?.dispose?.();
    }
    const pts = drawingObj.points?.rawVal ?? [];
    const polys = drawingObj.polylines?.rawVal ?? [];
    const auxState = (window as any).__hekatanDrawingAuxLines;
    const aux: number[][] = auxState?.rawVal ?? [];
    for (const id of selection) {
      const [kind, ...rest] = id.split(":");
      if (kind === "pt") {
        const p = pts[+rest[0]];
        if (!p) continue;
        // Radio base 0.025m (~consistente con hover/snap markers).
        // El scale se ajusta en updateSelectionPtScale() para que el tamaño
        // aparente en pantalla sea constante (~8 px) a cualquier zoom.
        const m = new THREE.Mesh(
          new THREE.SphereGeometry(0.025, 12, 12),
          new THREE.MeshBasicMaterial({ color: selColor, transparent: true, opacity: 0.9, depthTest: false }),
        );
        m.position.set(p[0], p[1], p[2]);
        m.renderOrder = 999;
        (m as any).__isSelectionPt = true;
        selectionGroup.add(m);
      } else if (kind === "seg") {
        const poly = polys[+rest[0]];
        const a = pts[poly?.[+rest[1]]], b = pts[poly?.[+rest[1]+1]];
        if (!a || !b) continue;
        const g = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(a[0], a[1], a[2]),
          new THREE.Vector3(b[0], b[1], b[2]),
        ]);
        const ln = new THREE.Line(g, new THREE.LineBasicMaterial({
          color: selColor, transparent: true, opacity: 0.95, depthTest: false,
        }));
        ln.renderOrder = 999;
        selectionGroup.add(ln);
      } else if (kind === "poly") {
        const poly = polys[+rest[0]];
        const ptsLine = poly.map(idx => {
          const p = pts[idx];
          return p ? new THREE.Vector3(p[0], p[1], p[2]) : null;
        }).filter(Boolean) as THREE.Vector3[];
        if (ptsLine.length < 2) continue;
        const g = new THREE.BufferGeometry().setFromPoints(ptsLine);
        const ln = new THREE.Line(g, new THREE.LineBasicMaterial({
          color: selColor, transparent: true, opacity: 0.95, depthTest: false,
        }));
        ln.renderOrder = 999;
        selectionGroup.add(ln);
      } else if (kind === "aux") {
        const ln = aux[+rest[0]];
        if (!ln || ln.length !== 6) continue;
        const g = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(ln[0], ln[1], ln[2]),
          new THREE.Vector3(ln[3], ln[4], ln[5]),
        ]);
        const line = new THREE.Line(g, new THREE.LineBasicMaterial({
          color: selColor, transparent: true, opacity: 0.95, depthTest: false,
        }));
        line.renderOrder = 999;
        selectionGroup.add(line);
      }
    }
    // Aplicar escala dinámica inmediata a las esferas cyan recién creadas
    // (definida más abajo, así que verificamos existencia para evitar TDZ).
    const fn = (window as any).__hekatanUpdateSelectionPtScale as (() => void) | undefined;
    if (fn) fn();
    // Auto-actualizar el Properties Pane (definido más abajo, también
    // verificamos para evitar TDZ).
    const upd = (window as any).__hekatanRefreshPropsPane as (() => void) | undefined;
    if (upd) upd();
    // ── Los NUDOS seleccionados hay que escalarlos AL CREARLOS ───────────────
    //
    // La esfera del nudo se crea con radio 0.025 m y escala 1. Sobre un portico
    // de 6 m eso son dos centimetros y medio: invisible. El tamano aparente lo
    // arregla `updateSelectionPtScale`, pero solo se llamaba desde el evento
    // "change" de los controles, o sea AL ORBITAR. Resultado: seleccionabas un
    // nudo y no se resaltaba nada hasta que movias la camara — y para entonces
    // ya habias dado por hecho que no funcionaba.
    //
    // Se llama por window porque la funcion se declara mas abajo.
    try { (window as any).__hekatanUpdateSelectionPtScale?.(); } catch {}
    viewerRender();
  };
  (window as any).__hekatanRefreshSelection = refreshSelectionGroup;
  // Designar por ids («poly:3», «seg:1:2», «pt:7») — para automatizar y para el CLI.
  (window as any).__hekatanSelectIds = (ids: string[]) => { selection.clear(); for (const id of ids) selection.add(id); try { (window as any).__hekatanRefreshSelection?.(); } catch {} viewerRender(); return selection.size; };
  (window as any).__hekatanClearSelection = () => {
    selection.clear();
    refreshSelectionGroup();
  };

  // Distancia de un punto a un segmento (3D)
  const distPointSeg = (px: number, py: number, pz: number,
                         ax: number, ay: number, az: number,
                         bx: number, by: number, bz: number): number => {
    const dx = bx - ax, dy = by - ay, dz = bz - az;
    const L2 = dx*dx + dy*dy + dz*dz;
    if (L2 < 1e-12) return Math.hypot(px-ax, py-ay, pz-az);
    let t = ((px-ax)*dx + (py-ay)*dy + (pz-az)*dz) / L2;
    t = Math.max(0, Math.min(1, t));
    const cx = ax + t*dx, cy = ay + t*dy, cz = az + t*dz;
    return Math.hypot(px-cx, py-cy, pz-cz);
  };

  // Encuentra la polilínea más cercana al punto cursor — devuelve
  // { polyIdx, segIdx, dist } o null si nada en tolerancia.
  const findClosestPoly = (px: number, py: number, pz: number, tol: number) => {
    if (!drawingObj.polylines) return null;
    const polys = drawingObj.polylines.rawVal;
    const allPts = drawingObj.points.rawVal;
    let bestIdx = -1, bestSeg = -1, bestD = tol;
    for (let i = 0; i < polys.length; i++) {
      const poly = polys[i];
      for (let j = 0; j < poly.length - 1; j++) {
        const a = allPts[poly[j]], b = allPts[poly[j+1]];
        if (!a || !b) continue;
        const d = distPointSeg(px, py, pz, a[0],a[1],a[2], b[0],b[1],b[2]);
        if (d < bestD) { bestD = d; bestIdx = i; bestSeg = j; }
      }
    }
    return bestIdx >= 0 ? { polyIdx: bestIdx, segIdx: bestSeg, dist: bestD } : null;
  };

  // Encuentra la línea auxiliar más cercana al cursor — devuelve el índice
  // (en window.__hekatanDrawingAuxLines.rawVal) o -1 si nada en tolerancia.
  const findClosestAuxLine = (px: number, py: number, pz: number, tol: number): number => {
    const auxState = (window as any).__hekatanDrawingAuxLines;
    const lines: number[][] = auxState?.rawVal ?? auxState?.val ?? auxState ?? [];
    let bestIdx = -1, bestD = tol;
    for (let i = 0; i < lines.length; i++) {
      const ln = lines[i];
      if (!ln || ln.length !== 6) continue;
      const d = distPointSeg(px, py, pz, ln[0], ln[1], ln[2], ln[3], ln[4], ln[5]);
      if (d < bestD) { bestD = d; bestIdx = i; }
    }
    return bestIdx;
  };

  // Resalta la aux line `i` en rojo (mismo deleteHover que polilíneas).
  const showDeleteAuxHover = (i: number) => {
    const auxState = (window as any).__hekatanDrawingAuxLines;
    const lines: number[][] = auxState?.rawVal ?? auxState?.val ?? auxState ?? [];
    const ln = lines[i];
    if (!ln || ln.length !== 6) { deleteHover.visible = false; return; }
    deleteHover.geometry.setFromPoints([
      new THREE.Vector3(ln[0], ln[1], ln[2]),
      new THREE.Vector3(ln[3], ln[4], ln[5]),
    ]);
    deleteHover.visible = true;
  };

  // Renderiza solo el SEGMENTO j de la polilínea i en deleteHover (rojo).
  // Excepción: si la polilínea es un ÁREA (Q4), se resalta entera porque
  // un Q4 con 3 vértices no tiene sentido — el delete elimina el área
  // completa.
  const showDeleteHover = (i: number, j: number = -1) => {
    if (!drawingObj.polylines) return;
    const poly = drawingObj.polylines.rawVal[i];
    const allPts = drawingObj.points.rawVal;
    if (!poly || poly.length < 2) { deleteHover.visible = false; return; }
    const isArea = drawingObj.areas?.rawVal?.includes(i) ?? false;
    const pts: THREE.Vector3[] = [];
    if (isArea || j < 0 || j >= poly.length - 1) {
      // Resaltar polilínea entera (área Q4 o segIdx inválido)
      for (const idx of poly) {
        const p = allPts[idx];
        if (p) pts.push(new THREE.Vector3(p[0], p[1], p[2]));
      }
    } else {
      // Resaltar SOLO el segmento (frame individual)
      const a = allPts[poly[j]], b = allPts[poly[j+1]];
      if (a) pts.push(new THREE.Vector3(a[0], a[1], a[2]));
      if (b) pts.push(new THREE.Vector3(b[0], b[1], b[2]));
    }
    deleteHover.geometry.setFromPoints(pts);
    deleteHover.visible = true;
  };

  // Borra la polilínea i, limpia puntos huérfanos, dispara rebuild.
  const deletePoly = (i: number) => {
    if (!drawingObj.polylines) return;
    const polys = drawingObj.polylines.rawVal;
    if (i < 0 || i >= polys.length) return;
    const newPolys = polys.filter((_, k) => k !== i);
    // Limpiar puntos huérfanos: nodes no referenciados por NINGUNA polilínea
    const used = new Set<number>();
    for (const p of newPolys) for (const idx of p) used.add(idx);
    const allPts = drawingObj.points.rawVal;
    const remap = new Map<number, number>();
    const newPts: number[][] = [];
    for (let k = 0; k < allPts.length; k++) {
      if (used.has(k)) { remap.set(k, newPts.length); newPts.push(allPts[k]); }
    }
    // Reindexar polilíneas con el remap
    const reindexed = newPolys.map(p => p.map(idx => remap.get(idx)!).filter(v => v !== undefined));
    drawingObj.points.val = newPts;
    drawingObj.polylines.val = reindexed;
    // Reindexar drawingAreas: descartar el índice borrado y desplazar
    // todos los > i en -1 (porque las polylines posteriores se corrieron).
    if (drawingObj.areas) {
      drawingObj.areas.val = drawingObj.areas.rawVal
        .filter(a => a !== i)
        .map(a => (a > i ? a - 1 : a));
    }
    deleteHover.visible = false;
    hoveredPolyIndex = -1;
    hoveredSegIndex = -1;
    try { (window as any).__hekatanRebuild?.(); } catch {}
  };

  // Borra UN SEGMENTO de una polilínea. Si la polilínea es área → borra
  // entera (un Q4 sin un lado no tiene sentido). Si es polilínea normal:
  //   - segmento al medio → split en 2 polilíneas
  //   - segmento al inicio → shorten (remover poly[0])
  //   - segmento al fin → shorten (remover último)
  //   - polilínea de 2 puntos (1 segmento) → eliminar entera
  const deleteSeg = (polyIdx: number, segIdx: number) => {
    if (!drawingObj.polylines) return;
    const polys = drawingObj.polylines.rawVal;
    if (polyIdx < 0 || polyIdx >= polys.length) return;
    const isArea = drawingObj.areas?.rawVal?.includes(polyIdx) ?? false;
    if (isArea) { deletePoly(polyIdx); return; }
    const poly = polys[polyIdx];
    if (segIdx < 0 || segIdx >= poly.length - 1) return;
    // Si solo hay 1 segmento → eliminar polilínea entera
    if (poly.length === 2) { deletePoly(polyIdx); return; }
    // Construir nuevas polilíneas reemplazando la actual
    let newPolyList: number[][];
    if (segIdx === 0) {
      // Sacar el primer punto: poly[1:]
      newPolyList = [poly.slice(1)];
    } else if (segIdx === poly.length - 2) {
      // Sacar el último punto: poly[:-1]
      newPolyList = [poly.slice(0, -1)];
    } else {
      // Split: dos polilíneas independientes
      newPolyList = [poly.slice(0, segIdx + 1), poly.slice(segIdx + 1)];
    }
    const newPolys = [...polys.slice(0, polyIdx), ...newPolyList, ...polys.slice(polyIdx + 1)];
    // Limpiar puntos huérfanos
    const used = new Set<number>();
    for (const p of newPolys) for (const idx of p) used.add(idx);
    const allPts = drawingObj.points.rawVal;
    const remap = new Map<number, number>();
    const newPts: number[][] = [];
    for (let k = 0; k < allPts.length; k++) {
      if (used.has(k)) { remap.set(k, newPts.length); newPts.push(allPts[k]); }
    }
    const reindexed = newPolys.map(p => p.map(idx => remap.get(idx)!).filter(v => v !== undefined));
    drawingObj.points.val = newPts;
    drawingObj.polylines.val = reindexed;
    // Reindexar áreas — todas las áreas con índice > polyIdx se desplazan
    // según cuántas polilíneas nuevas insertamos (newPolyList.length - 1).
    if (drawingObj.areas) {
      const shift = newPolyList.length - 1;
      drawingObj.areas.val = drawingObj.areas.rawVal.map(a => a > polyIdx ? a + shift : a);
    }
    deleteHover.visible = false;
    hoveredPolyIndex = -1;
    hoveredSegIndex = -1;
    try { (window as any).__hekatanRebuild?.(); } catch {}
  };

  // Update
  points.geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(drawingObj.points.rawVal.flat(), 3)
  );
  points.geometry.computeBoundingSphere();
  points.frustumCulled = false;

  indicationPoint.frustumCulled = false;
  scene.add(indicationPoint);

  // Match initial grid position and rotation — grid centrado en el origen
  // (convención CAD: origen mundial = centro del grid).
  plane.position.set(0, 0, 0);
  plane.rotateX(Math.PI / 2);
  plane.geometry.rotateX(Math.PI / 2);
  plane.updateMatrixWorld(); // to fix intersect object

  // To start with an empty polyline and keep the provided ones
  if (drawingObj.polylines)
    drawingObj.polylines.val = [...drawingObj.polylines.rawVal, []];

  // ── API pública para dibujar programáticamente ──
  // Util para tests/scripts/demos: agrega un punto en coords mundiales
  // (saltando el raycaster). Equivalente a un click real en la posición
  // (x, y, z) sobre el plano.
  (window as any).__hekatanDrawAt = (x: number, y: number, z: number) => {
    drawingObj.points.val = [...drawingObj.points.rawVal, [x, y, z]];
    if (drawingObj.polylines) {
      const polys = drawingObj.polylines.rawVal;
      const last = polys.length ? polys[polys.length - 1] : [];
      drawingObj.polylines.val = [
        ...polys.slice(0, -1),
        [...last, drawingObj.points.rawVal.length - 1],
      ];
    }
  };
  // Empezar nueva polilínea (equivalente a right-click)
  (window as any).__hekatanDrawNewPoly = () => {
    if (!drawingObj.polylines) return;
    const polys = drawingObj.polylines.rawVal;
    if (polys[polys.length - 1]?.length === 0) return;
    drawingObj.polylines.val = [...polys, []];
  };
  // ── Discretización de elementos no-lineales ──
  // Círculo en plano XY (centro cx,cy,cz; radio r). Se discretiza en N
  // segmentos rectos formando un polígono regular cerrado.
  // Los circulos y arcos se guardan TESELADOS (una polilinea): el centro no es
  // ningun punto. Para el OSNAP "centro" se anota aqui (centro y radio). Un
  // circulo borrado se detecta porque no queda ningun punto en su circunferencia.
  const circulos: { c: [number, number, number]; r: number }[] = [];
  (window as any).__hekatanCirculos = circulos;

  // ── Centros DEDUCIDOS de la geometría ────────────────────────────────────
  // El registro de arriba vive en memoria: se pierde al recargar la página y no
  // existe si el dibujo viene de fuera (un .heks importado, por ejemplo), así
  // que el OSNAP "centro" dejaba de funcionar sin que nada lo avisara.
  // Un círculo teselado ES un polígono regular cerrado: su centro es el promedio
  // de sus vértices, y se reconoce porque todos están a la misma distancia de él.
  // Deducirlo no necesita guardar nada y vale para cualquier dibujo.
  // Se recalcula solo cuando cambia el número de puntos o de polilíneas (el
  // OSNAP se evalúa en cada movimiento del ratón: recorrer todo cada vez sería
  // O(n) por frame).
  let cacheCentros: { c: [number, number, number]; r: number }[] = [];
  let cacheClave = "";
  const centrosDeducidos = (): { c: [number, number, number]; r: number }[] => {
    const pts = drawingObj.points.rawVal as [number, number, number][];
    const polys = (drawingObj.polylines?.rawVal ?? []) as number[][];
    const clave = `${pts.length}|${polys.length}|${polys.reduce((a, q) => a + q.length, 0)}`;
    if (clave === cacheClave) return cacheCentros;
    cacheClave = clave;
    const out: { c: [number, number, number]; r: number }[] = [];
    for (const poly of polys) {
      // cerrada = el último índice repite el primero; hacen falta >= 5 vértices
      const n = poly.length;
      if (n < 6 || poly[0] !== poly[n - 1]) continue;
      const vs = poly.slice(0, n - 1).map((i) => pts[i]).filter(Boolean) as [number, number, number][];
      if (vs.length < 5) continue;
      const c: [number, number, number] = [0, 1, 2].map((k) =>
        vs.reduce((a, v) => a + v[k], 0) / vs.length) as [number, number, number];
      const rs = vs.map((v) => Math.hypot(v[0] - c[0], v[1] - c[1], v[2] - c[2]));
      const r = rs.reduce((a, b) => a + b, 0) / rs.length;
      if (r < 1e-9) continue;
      // regular: todos los vértices a la misma distancia (0.5 % del radio)
      if (rs.some((q) => Math.abs(q - r) > 0.005 * r)) continue;
      out.push({ c, r });
    }
    return (cacheCentros = out);
  };
  (window as any).__hekatanCentrosDeducidos = centrosDeducidos;
  // ── GUÍAS AUXILIARES (Jorge, 13-sep-2026: «necesitamos crear líneas auxiliares que
  // luego se borran, porque no se entiende del todo tanto la cúpula como el Allianz»).
  // Con `__hekatanCurvasAux` encendido, Arco, Círculo, Parábola, Cúbica y Losa con
  // chaflanes NO crean barras: crean líneas auxiliares (cian, sin FEM), que son la
  // guía. La Revolución y el Barrido las leen de la selección y, al terminar, las
  // BORRAN: la construcción desaparece y queda solo la cáscara.
  const curvasAux = () => !!(window as any).__hekatanCurvasAux;
  const emitirAux = (pts: [number, number, number][], cerrada: boolean) => {
    const auxState = (window as any).__hekatanDrawingAuxLines; if (!auxState) return 0;
    pushUndo();
    const cur: number[][] = auxState.rawVal ?? auxState.val ?? [];
    const segs: number[][] = [];
    for (let i = 0; i + 1 < pts.length; i++) segs.push([...pts[i], ...pts[i + 1]]);
    if (cerrada && pts.length > 2) segs.push([...pts[pts.length - 1], ...pts[0]]);
    auxState.val = [...cur, ...segs];
    return segs.length;
  };
  (window as any).__hekatanDrawCircle = (
    cx: number, cy: number, cz: number, r: number,
    segs: number = (window as any).__hekatanArcSegs ?? 12,
    plane: "xy" | "xz" | "yz" = "xy",
  ) => {
    const N = Math.max(4, Math.round(segs));
    const baseIdx = drawingObj.points.rawVal.length;
    const newPts: [number, number, number][] = [];
    for (let i = 0; i < N; i++) {
      const ang = (2 * Math.PI * i) / N;
      const dx = r * Math.cos(ang), dy = r * Math.sin(ang);
      let p: [number, number, number];
      if (plane === "xy")      p = [cx + dx, cy + dy, cz];
      else if (plane === "xz") p = [cx + dx, cy, cz + dy];
      else                     p = [cx, cy + dx, cz + dy];
      newPts.push(p);
    }
    circulos.push({ c: [cx, cy, cz], r });
    if (curvasAux()) { emitirAux(newPts, true); return; }
    drawingObj.points.val = [...drawingObj.points.rawVal, ...newPts];
    if (drawingObj.polylines) {
      // Polilínea cerrada (vuelve al primer punto)
      const closed = [...newPts.map((_, i) => baseIdx + i), baseIdx];
      const polys = drawingObj.polylines.rawVal;
      // Cerrar polilínea actual si tiene puntos, abrir nueva con el círculo
      if (polys[polys.length - 1]?.length > 0) {
        drawingObj.polylines.val = [...polys, closed, []];
      } else {
        drawingObj.polylines.val = [...polys.slice(0, -1), closed, []];
      }
    }
  };
  // Arco por 3 puntos (start - mid - end). Discretiza en N segmentos.
  (window as any).__hekatanDrawArc = (
    p1: [number, number, number],
    p2: [number, number, number],
    p3: [number, number, number],
    segs: number = (window as any).__hekatanArcSegs ?? 12,
  ) => {
    const N = Math.max(4, Math.round(segs));
    // Calcular el centro y radio del arco que pasa por 3 puntos
    // Asumimos que los 3 puntos están aproximadamente en un mismo plano.
    // Para simplicidad: arco circular en el plano definido por p1-p2-p3.
    const v1 = new THREE.Vector3(...p1);
    const v2 = new THREE.Vector3(...p2);
    const v3 = new THREE.Vector3(...p3);
    // CIRCUNCENTRO EN 3D (no proyectado a XY): funciona en cualquier plano,
    // incluidos los VERTICALES (un arco de fachada en el plano XZ). El cálculo
    // viejo usaba sólo x,y y degeneraba en planos verticales dando coordenadas
    // basura. Fórmula: c = v1 + ((|a|²·b − |b|²·a) × (a×b)) / (2·|a×b|²).
    const a = new THREE.Vector3().subVectors(v2, v1);   // a = p2 − p1
    const b = new THREE.Vector3().subVectors(v3, v1);   // b = p3 − p1
    const axb = new THREE.Vector3().crossVectors(a, b);
    const denom2 = 2 * axb.lengthSq();
    let center: THREE.Vector3;
    if (denom2 < 1e-12) {
      center = new THREE.Vector3().addVectors(v1, v3).multiplyScalar(0.5);   // casi colineales
    } else {
      const t1 = b.clone().multiplyScalar(a.lengthSq()).sub(a.clone().multiplyScalar(b.lengthSq()));
      const num = new THREE.Vector3().crossVectors(t1, axb);
      center = v1.clone().add(num.divideScalar(denom2));
    }
    const radius = v1.distanceTo(center);
    // Base ortonormal en el plano del arco: u hacia p1, w perpendicular.
    const nrm = axb.lengthSq() > 1e-12 ? axb.clone().normalize() : new THREE.Vector3(0, 1, 0);
    const u = new THREE.Vector3().subVectors(v1, center).normalize();
    const wv = new THREE.Vector3().crossVectors(nrm, u).normalize();
    const angDe = (p: THREE.Vector3) => { const d = new THREE.Vector3().subVectors(p, center); return Math.atan2(d.dot(wv), d.dot(u)); };
    const norm2pi = (x: number) => { let y = x; while (y < 0) y += 2 * Math.PI; while (y >= 2 * Math.PI) y -= 2 * Math.PI; return y; };
    const a2 = norm2pi(angDe(v2)), a3 = norm2pi(angDe(v3));
    // Barrido de v1 (ang 0) a v3, PASANDO por v2: si v2 está antes que v3 en
    // sentido positivo, barrido positivo; si no, negativo.
    const sweep = (a2 <= a3) ? a3 : a3 - 2 * Math.PI;
    const baseIdx = drawingObj.points.rawVal.length;
    const newPts: [number, number, number][] = [];
    const enArco = (th: number) => {
      const dir = u.clone().multiplyScalar(Math.cos(th)).add(wv.clone().multiplyScalar(Math.sin(th)));
      return center.clone().add(dir.multiplyScalar(radius));
    };
    // ── REPARTO de los tramos (`__hekatanArcModo`) ──────────────────────────
    //   "angulo" (defecto): ángulos iguales = cuerdas iguales.
    //   "x" | "y" | "z":    la coordenada elegida avanza a saltos IGUALES —
    //                       así están partidos los arcos del EDB de la capilla
    //                       (7 nudos a Δx = 1.525 m sobre un círculo de 15.3 m),
    //                       y así divide Dynamo con «Curve.PointsAtEqual…».
    // Con reparto por eje el ángulo se busca por bisección: la coordenada es
    // monótona a lo largo del arco mientras no pase por su punto más alto/bajo;
    // si pasa (no es monótona), se cae al reparto por ángulo y se avisa.
    const modo = String((window as any).__hekatanArcModo ?? "angulo");
    const k = modo === "x" ? 0 : modo === "y" ? 1 : modo === "z" ? 2 : -1;
    let porEje = false;
    if (k >= 0) {
      const c0 = p1[k], c1 = p3[k];
      const M = 512; let mono = Math.abs(c1 - c0) > 1e-9;
      let prev = c0;
      for (let i = 1; i <= M && mono; i++) {
        const v = enArco(sweep * i / M).getComponent(k);
        if ((v - prev) * (c1 - c0) < -1e-9) mono = false;
        prev = v;
      }
      if (mono) {
        porEje = true;
        for (let i = 0; i <= N; i++) {
          const objetivo = c0 + (c1 - c0) * i / N;
          let lo = 0, hi = sweep;
          for (let it = 0; it < 60; it++) {
            const mid = (lo + hi) / 2;
            const v = enArco(mid).getComponent(k);
            if ((v - objetivo) * (c1 - c0) < 0) lo = mid; else hi = mid;
          }
          const v = enArco((lo + hi) / 2);
          newPts.push([v.x, v.y, v.z]);
        }
        newPts[0] = [p1[0], p1[1], p1[2]]; newPts[N] = [p3[0], p3[1], p3[2]];
      } else {
        try { (window as any).__hekatanCadUpdateStatus?.(`⚠ El arco no es monótono en ${modo.toUpperCase()}: reparto por ángulo.`); } catch {}
      }
    }
    if (!porEje) for (let i = 0; i <= N; i++) {
      const v = enArco(sweep * (i / N));
      newPts.push([v.x, v.y, v.z]);
    }
    circulos.push({ c: [center.x, center.y, center.z], r: radius });
    if (curvasAux()) { emitirAux(newPts, false); return; }
    drawingObj.points.val = [...drawingObj.points.rawVal, ...newPts];
    if (drawingObj.polylines) {
      const arcPoly = newPts.map((_, i) => baseIdx + i);
      const polys = drawingObj.polylines.rawVal;
      drawingObj.polylines.val = [...polys.slice(0, -1), arcPoly, []];
    }
  };
  /**
   * La última polilínea con al menos dos puntos (la vacía es la marca de
   * «trazo terminado», no un objeto). Es sobre lo que actúan DIVIDIR y DESFASAR
   * cuando no hay nada designado, igual que el «ÚLTIMO» de AutoCAD.
   */
  const ultimaPolilinea = (): { i: number; pl: number[] } | null => {
    const polys = drawingObj.polylines?.rawVal ?? [];
    for (let i = polys.length - 1; i >= 0; i--)
      if (polys[i] && polys[i].length >= 2) return { i, pl: polys[i] };
    return null;
  };

  // ── DIVIDIR: el DIVIDE de AutoCAD, partiendo la barra ────────────────────
  //
  // En AutoCAD DIVIDE siembra puntos a lo largo del objeto; aquí lo que hace
  // falta es que la BARRA quede partida, que es lo que ve el cálculo. Parte cada
  // tramo de la polilínea en `n` trozos iguales.
  //
  // Sin esto, un arco trazado con pocos tramos había que volver a dibujarlo
  // entero para refinarlo, y para colgarle montantes en medio no había dónde
  // engancharlos: no existían los nudos.
  (window as any).__hekatanDividir = (n: number) => {
    const N = Math.round(n);
    if (!(N >= 2)) return { ok: false, msg: "el número de partes va de 2 en adelante" };
    const u = ultimaPolilinea();
    if (!u) return { ok: false, msg: "no hay ninguna polilínea que dividir" };
    if ((window as any).__hekatanPushUndo) (window as any).__hekatanPushUndo();
    const pts = [...drawingObj.points.rawVal] as [number, number, number][];
    const nueva: number[] = [u.pl[0]];
    let largoTotal = 0;
    for (let k = 0; k + 1 < u.pl.length; k++) {
      const A = pts[u.pl[k]], B = pts[u.pl[k + 1]];
      largoTotal += Math.hypot(B[0] - A[0], B[1] - A[1], B[2] - A[2]);
      for (let j = 1; j < N; j++) {
        const t = j / N;
        pts.push([A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t]);
        nueva.push(pts.length - 1);
      }
      nueva.push(u.pl[k + 1]);
    }
    const polys = [...(drawingObj.polylines!.rawVal as number[][])];
    polys[u.i] = nueva;
    drawingObj.points.val = pts;
    drawingObj.polylines!.val = polys;
    try { (window as any).__hekatanRebuild?.(); } catch {}
    viewerRender();
    return { ok: true, tramosAntes: u.pl.length - 1, tramosAhora: nueva.length - 1,
             nudosNuevos: nueva.length - u.pl.length,
             largo: +largoTotal.toFixed(4),
             tramoMedio: +(largoTotal / (nueva.length - 1)).toFixed(4) };
  };

  // ── DESFASAR una curva: el OFFSET de AutoCAD, que sí desfasa arcos ────────
  //
  // El Desfase de aquí movía tramos rectos; una polilínea curva no se podía
  // desfasar, y es justo lo que hace falta para el segundo cordón de una cercha
  // o el intradós de una bóveda.
  //
  // Cada vértice se mueve por la BISECTRIZ de sus dos tramos, y el paso es
  // d / cos(α/2) —no d— para que la distancia perpendicular salga constante:
  // es lo que hace el OFFSET de una polilínea. En los extremos, perpendicular
  // al único tramo que hay.
  (window as any).__hekatanDesfasarCurva = (d: number) => {
    if (!isFinite(d) || Math.abs(d) < 1e-9) return { ok: false, msg: "la distancia no puede ser cero" };
    const u = ultimaPolilinea();
    if (!u) return { ok: false, msg: "no hay ninguna polilínea que desfasar" };
    const P = drawingObj.points.rawVal as [number, number, number][];
    const V = u.pl.map((i) => new THREE.Vector3(...P[i]));
    // La normal del plano de trabajo: el desfase se queda EN el plano dibujado.
    const wp = String((window as any).__hekatanCadState?.get?.()?.workPlane ?? "xy");
    const nrm = new THREE.Vector3(...(wp === "xz" ? [0, 1, 0] : wp === "yz" ? [1, 0, 0] : [0, 0, 1]));
    const perp = (a: THREE.Vector3, b: THREE.Vector3) => {
      const t = new THREE.Vector3().subVectors(b, a);
      const p = new THREE.Vector3().crossVectors(nrm, t);
      return p.lengthSq() < 1e-18 ? null : p.normalize();
    };
    const desp: (THREE.Vector3 | null)[] = V.map((_, k) => {
      const pa = k > 0 ? perp(V[k - 1], V[k]) : null;
      const pb = k + 1 < V.length ? perp(V[k], V[k + 1]) : null;
      if (pa && pb) {
        const bis = pa.clone().add(pb);
        if (bis.lengthSq() < 1e-12) return pa;              // tramos opuestos
        bis.normalize();
        const cos = bis.dot(pa);                            // = cos(α/2)
        return bis.multiplyScalar(Math.abs(cos) < 1e-6 ? 1 : 1 / cos);
      }
      return pa ?? pb;
    });
    if (desp.some((q) => q === null))
      return { ok: false, msg: "la curva es perpendicular al plano de trabajo; cambie de plano" };
    if ((window as any).__hekatanPushUndo) (window as any).__hekatanPushUndo();
    const pts = [...P];
    const nueva: number[] = [];
    V.forEach((v, k) => {
      const q = v.clone().addScaledVector(desp[k]!, d);
      pts.push([q.x, q.y, q.z]); nueva.push(pts.length - 1);
    });
    const polys = [...(drawingObj.polylines!.rawVal as number[][])];
    if (polys.length && polys[polys.length - 1].length === 0) polys.pop();
    polys.push(nueva, []);
    drawingObj.points.val = pts;
    drawingObj.polylines!.val = polys;
    try { (window as any).__hekatanRebuild?.(); } catch {}
    viewerRender();
    // Comprobación honesta: la distancia REAL de cada vértice nuevo a su tramo
    // original. Si el desfase está bien, todas valen |d|.
    let dmin = Infinity, dmax = -Infinity;
    for (let k = 0; k + 1 < V.length; k++) {
      const A = V[k], B = V[k + 1], p = perp(A, B)!;
      const Q = new THREE.Vector3(...pts[nueva[k]]);
      const e = Math.abs(new THREE.Vector3().subVectors(Q, A).dot(p));
      dmin = Math.min(dmin, e); dmax = Math.max(dmax, e);
    }
    return { ok: true, vertices: nueva.length, distancia: +d.toFixed(4),
             separacionMin: +dmin.toFixed(5), separacionMax: +dmax.toFixed(5) };
  };

  // ── CERCHA CURVA, de una orden ──────────────────────────────────────────
  //
  // Dibujar una cercha curva a mano es inviable: la que se trazó en el deploy el
  // 17-sep-2026 costó 31 coordenadas tecleadas —11 del cordón de arriba, 11 del de
  // abajo y 9 montantes—, y todas salieron de calcular la parábola FUERA del
  // programa. Eso no es dibujar acotado. Aquí la cercha se da como viene en un
  // plano de taller: luz, flecha, canto, número de paños y tipo de celosía.
  //
  // Los dos cordones son CONCÉNTRICOS (R y R − canto) y se parten con los MISMOS
  // ángulos, así el canto es constante y medido perpendicular al arco, que es como
  // se fabrica. Los montantes salen entonces radiales, no verticales.
  //
  //     R = (L²/4 + f²) / (2f)      θ = 2·asen((L/2)/R)      centro a R − f del arranque
  //
  // Devuelve las medidas para poder ACOTARLAS: no se dibuja nada cuyas cotas no se
  // puedan leer después.
  (window as any).__hekatanDrawCercha = (o: {
    luz: number; flecha: number; canto: number; panos: number;
    tipo?: "montantes" | "warren" | "howe";
    x0?: number; y0?: number; base?: number; copias?: number; sep?: number; correas?: boolean;
  }) => {
    const L = o.luz, f = o.flecha, h = o.canto;
    const n = Math.max(2, Math.round(o.panos));
    const tipo = o.tipo ?? "montantes";
    const x0 = o.x0 ?? 0, y0 = o.y0 ?? 0, base = o.base ?? 0;
    const copias = Math.max(1, Math.round(o.copias ?? 1)), sep = o.sep ?? 0;
    if (!(L > 0) || !(f > 0) || !(h > 0)) return { ok: false, msg: "luz, flecha y canto tienen que ser positivos" };
    const R = (L * L / 4 + f * f) / (2 * f);
    if (h >= R) return { ok: false, msg: `el canto (${h} m) no puede llegar al radio (${R.toFixed(3)} m)` };
    const th = 2 * Math.asin(Math.min(1, (L / 2) / R));          // ángulo abarcado
    const zc = base - (R - f);                                    // centro del arco
    const a0 = Math.atan2(base - zc, x0 - (x0 + L / 2));          // ángulo del arranque izquierdo
    const a1 = Math.atan2(base - zc, x0 + L - (x0 + L / 2));      // …y del derecho
    const xc = x0 + L / 2;
    const enArco = (ang: number, r: number, y: number): [number, number, number] =>
      [xc + r * Math.cos(ang), y, zc + r * Math.sin(ang)];

    if ((window as any).__hekatanPushUndo) (window as any).__hekatanPushUndo();
    const pts = [...drawingObj.points.rawVal] as [number, number, number][];
    const polys = [...(drawingObj.polylines?.rawVal ?? [])] as number[][];
    if (polys.length && polys[polys.length - 1].length === 0) polys.pop();
    const meter = (p: [number, number, number]) => { pts.push(p); return pts.length - 1; };
    const barra = (a: number, b: number) => { polys.push([a, b]); };

    const supPorCercha: number[][] = [];
    let nDiag = 0, nMont = 0;
    for (let c = 0; c < copias; c++) {
      const y = y0 + c * sep;
      const sup: number[] = [], inf: number[] = [];
      for (let i = 0; i <= n; i++) {
        const ang = a0 + (a1 - a0) * (i / n);
        sup.push(meter(enArco(ang, R, y)));
        inf.push(meter(enArco(ang, R - h, y)));
      }
      supPorCercha.push(sup);
      polys.push([...sup]);            // cordón superior, de una polilínea
      polys.push([...inf]);            // cordón inferior
      // Celosía. Los extremos SIEMPRE llevan su montante: es el cierre de la cercha.
      barra(sup[0], inf[0]); barra(sup[n], inf[n]); nMont += 2;
      for (let i = 1; i < n; i++) {
        if (tipo === "montantes" || tipo === "howe") { barra(sup[i], inf[i]); nMont++; }
        if (tipo === "warren") {                       // zigzag sin montantes intermedios
          if (i % 2 === 1) { barra(inf[i - 1], sup[i]); barra(sup[i], inf[i + 1]); nDiag += 2; }
        } else if (tipo === "howe") {                  // diagonales hacia la clave
          const haciaClave = i < n / 2 ? 1 : -1;
          barra(inf[i], sup[i + haciaClave]); nDiag++;
        }
      }
    }
    // Correas: atan los cordones superiores de cerchas consecutivas (la cercha
    // suelta es un mecanismo fuera de su plano; esto la hace espacial de verdad).
    if (o.correas && copias > 1) {
      for (let c = 0; c + 1 < copias; c++)
        for (let i = 0; i <= n; i++) barra(supPorCercha[c][i], supPorCercha[c + 1][i]);
    }
    polys.push([]);                    // marca de «trazo terminado»
    drawingObj.points.val = pts;
    if (drawingObj.polylines) drawingObj.polylines.val = polys;
    try { (window as any).__hekatanRebuild?.(); } catch {}
    viewerRender();

    // ── Las cotas, para poder acotar lo dibujado ──
    const P = (i: number, r: number) => enArco(a0 + (a1 - a0) * (i / n), r, 0);
    const dist = (p: number[], q: number[]) => Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
    const lSup: number[] = [], lInf: number[] = [], angDiag: number[] = [];
    for (let i = 0; i < n; i++) {
      lSup.push(dist(P(i, R), P(i + 1, R)));
      lInf.push(dist(P(i, R - h), P(i + 1, R - h)));
      const d = [P(i + 1, R)[0] - P(i, R - h)[0], 0, P(i + 1, R)[2] - P(i, R - h)[2]];
      angDiag.push(Math.atan2(d[2], d[0]) * 180 / Math.PI);
    }
    const r3 = (v: number) => +v.toFixed(3);
    return {
      ok: true,
      luz: r3(L), flecha: r3(f), canto: r3(h), radio: r3(R),
      anguloAbarcado: r3(th * 180 / Math.PI),
      clave: r3(base + f), centro: [r3(xc), r3(y0), r3(zc)],
      panos: n, tipo, cerchas: copias, separacion: r3(sep),
      desarrolloSup: r3(R * th), desarrolloInf: r3((R - h) * th),
      tramoSupMin: r3(Math.min(...lSup)), tramoSupMax: r3(Math.max(...lSup)),
      tramoInfMin: r3(Math.min(...lInf)), tramoInfMax: r3(Math.max(...lInf)),
      anguloDiagMin: r3(Math.min(...angDiag)), anguloDiagMax: r3(Math.max(...angDiag)),
      montantes: nMont, diagonales: nDiag,
      nudosNuevos: 2 * (n + 1) * copias,
    };
  };

  // ── Curva POLINÓMICA por k puntos (parábola: 3, cúbica: 4) ──
  // Desafío 2D de Jorge (13-sep-2026): «un círculo, un arco, una parábola, una
  // parábola de 3er grado, todo con el mouse». Los k puntos van en el plano de
  // la vista (el eje que no varía entre los clics, como en el círculo); la
  // abscisa es el eje horizontal de ese plano (X en XZ/XY, Y en YZ) y la
  // ordenada el otro. Por k puntos con abscisas distintas pasa UN polinomio de
  // grado k−1 (Lagrange), y se discretiza en N tramos a saltos IGUALES de
  // abscisa: es como ETABS lo puede recibir (barras rectas) y como divide
  // Dynamo con «Curve.PointsAtEqualParameter».
  (window as any).__hekatanDrawPolinomio = (
    pts: [number, number, number][],
    segs: number = (window as any).__hekatanArcSegs ?? 12,
  ): { ok: boolean; plano?: string; coef?: number[]; ia?: number; io?: number; msg?: string } => {
    const k = pts.length; if (k < 2) return { ok: false, msg: "faltan puntos" };
    const N = Math.max(k - 1, Math.round(segs));
    const rango = (j: number) => Math.max(...pts.map((q) => q[j])) - Math.min(...pts.map((q) => q[j]));
    const r = [rango(0), rango(1), rango(2)];
    // plano = el eje de MENOR variación queda fijo
    // el plano de TRABAJO manda si los puntos están en él; si no, el de menor variación
    const wp = String((window as any).__hekatanCadState?.get?.()?.workPlane ?? "");
    const nWp = wp === "xy" ? 2 : wp === "xz" ? 1 : wp === "yz" ? 0 : -1;
    const fijo = nWp >= 0 && r[nWp] < 1e-6 ? nWp : r[2] <= r[0] && r[2] <= r[1] ? 2 : r[1] <= r[0] ? 1 : 0;
    const plano = fijo === 2 ? "xy" : fijo === 1 ? "xz" : "yz";
    // Los dos ejes del plano: la ABSCISA es el de MAYOR recorrido entre los clics.
    // Así una parábola «tumbada» (la panza del Allianz: x = f(z), los dos extremos
    // con la misma x) también sale, en vez de rechazarse por «misma abscisa».
    const ejes = [0, 1, 2].filter((j) => j !== fijo) as [number, number];
    const [ia, io] = r[ejes[0]] >= r[ejes[1]] ? ejes : [ejes[1], ejes[0]];
    const xs = pts.map((q) => q[ia]), ys = pts.map((q) => q[io]);
    for (let i = 0; i < k; i++) for (let j = i + 1; j < k; j++)
      if (Math.abs(xs[i] - xs[j]) < 1e-9) return { ok: false, msg: `dos puntos con la misma abscisa (${"XYZ"[ia]} en ${plano.toUpperCase()}): no hay polinomio que pase por los dos` };
    // Lagrange: y(x) = Σ y_i · Π_{j≠i} (x − x_j)/(x_i − x_j)
    const y = (x: number) => { let s = 0; for (let i = 0; i < k; i++) { let L = 1; for (let j = 0; j < k; j++) if (j !== i) L *= (x - xs[j]) / (xs[i] - xs[j]); s += ys[i] * L; } return s; };
    // coeficientes a0 + a1·x + … (por Vandermonde, sólo para informar)
    const coef = (() => { const n = k; const A = xs.map((x) => Array.from({ length: n }, (_, j) => x ** j)); const b = ys.slice();
      for (let c = 0; c < n; c++) { let p = c; for (let rr = c + 1; rr < n; rr++) if (Math.abs(A[rr][c]) > Math.abs(A[p][c])) p = rr; [A[c], A[p]] = [A[p], A[c]]; [b[c], b[p]] = [b[p], b[c]];
        for (let rr = c + 1; rr < n; rr++) { const f = A[rr][c] / A[c][c]; for (let cc = c; cc < n; cc++) A[rr][cc] -= f * A[c][cc]; b[rr] -= f * b[c]; } }
      const a = new Array(n).fill(0); for (let rr = n - 1; rr >= 0; rr--) { let s = b[rr]; for (let cc = rr + 1; cc < n; cc++) s -= A[rr][cc] * a[cc]; a[rr] = s / A[rr][rr]; } return a; })();
    const x0 = xs[0], x1 = xs[k - 1];
    const baseIdx = drawingObj.points.rawVal.length;
    const newPts: [number, number, number][] = [];
    for (let i = 0; i <= N; i++) {
      const x = x0 + (x1 - x0) * i / N;
      const q: [number, number, number] = [pts[0][0], pts[0][1], pts[0][2]];
      q[ia] = x; q[io] = y(x); q[fijo] = pts[0][fijo];
      newPts.push(q);
    }
    newPts[0] = [pts[0][0], pts[0][1], pts[0][2]]; newPts[N] = [pts[k - 1][0], pts[k - 1][1], pts[k - 1][2]];
    if (curvasAux()) { emitirAux(newPts, false); return { ok: true, plano, coef, ia, io }; }
    drawingObj.points.val = [...drawingObj.points.rawVal, ...newPts];
    if (drawingObj.polylines) {
      const poly = newPts.map((_, i) => baseIdx + i);
      const polys = drawingObj.polylines.rawVal;
      drawingObj.polylines.val = polys[polys.length - 1]?.length > 0 ? [...polys, poly, []] : [...polys.slice(0, -1), poly, []];
    }
    return { ok: true, plano, coef, ia, io };
  };
  // ── GUÍAS de la selección: segmentos [A, B] en COORDENADAS, vengan de barras
  // (poly:/seg:) o de líneas auxiliares (aux:). Devuelve también qué ids son
  // auxiliares (se borran al terminar) y qué polilíneas cerradas horizontales hay
  // (los contornos de planta, para el barrido).
  type Seg3 = [[number, number, number], [number, number, number]];
  const guiasDeSeleccion = () => {
    const pts = drawingObj.points.rawVal;
    const polys = drawingObj.polylines?.rawVal ?? [];
    const areasYa = new Set(drawingObj.areas?.rawVal ?? []);
    const auxState = (window as any).__hekatanDrawingAuxLines;
    const aux: number[][] = auxState?.rawVal ?? auxState?.val ?? [];
    const segs: Seg3[] = []; const auxIds: string[] = []; const polysVistas = new Set<number>();
    const P = (i: number): [number, number, number] => [pts[i][0], pts[i][1], pts[i][2]];
    [...selection].forEach((id) => {
      const t = id.split(":");
      if (t[0] === "aux") { const l = aux[+t[1]]; if (l && l.length === 6) { segs.push([[l[0], l[1], l[2]], [l[3], l[4], l[5]]]); auxIds.push(id); } return; }
      const p = (t[0] === "poly" || t[0] === "seg") ? +t[1] : -1;
      if (p < 0 || !polys[p] || areasYa.has(p)) return;
      if (t[0] === "poly") { if (polysVistas.has(p)) return; polysVistas.add(p); for (let k = 0; k + 1 < polys[p].length; k++) segs.push([P(polys[p][k]), P(polys[p][k + 1])]); }
      else { const a = polys[p][+t[2]], b = polys[p][+t[2] + 1]; if (a != null && b != null && !polysVistas.has(p)) segs.push([P(a), P(b)]); }
    });
    return { segs, auxIds };
  };
  const mismo = (a: number[], b: number[]) => Math.abs(a[0] - b[0]) < 1e-6 && Math.abs(a[1] - b[1]) < 1e-6 && Math.abs(a[2] - b[2]) < 1e-6;
  // Encadena segmentos en polilíneas (cadenas abiertas o bucles cerrados) por coincidencia de extremos.
  const encadenar = (segs: Seg3[]): { pts: [number, number, number][]; cerrada: boolean }[] => {
    const usado = new Array(segs.length).fill(false); const out: { pts: [number, number, number][]; cerrada: boolean }[] = [];
    for (let i = 0; i < segs.length; i++) {
      if (usado[i]) continue; usado[i] = true;
      const cad: [number, number, number][] = [segs[i][0], segs[i][1]];
      let crecio = true;
      while (crecio) {
        crecio = false;
        for (let j = 0; j < segs.length; j++) {
          if (usado[j]) continue; const [a, b] = segs[j];
          const fin = cad[cad.length - 1], ini = cad[0];
          if (mismo(a, fin)) { cad.push(b); usado[j] = true; crecio = true; }
          else if (mismo(b, fin)) { cad.push(a); usado[j] = true; crecio = true; }
          else if (mismo(b, ini)) { cad.unshift(a); usado[j] = true; crecio = true; }
          else if (mismo(a, ini)) { cad.unshift(b); usado[j] = true; crecio = true; }
        }
      }
      const cerrada = cad.length > 3 && mismo(cad[0], cad[cad.length - 1]);
      if (cerrada) cad.pop();
      out.push({ pts: cad, cerrada });
    }
    return out;
  };
  // Nudo en esas coordenadas: el que ya exista (≤ 1 mm) o uno nuevo.
  const nudoEn = (newPts: [number, number, number][], q: [number, number, number]) => {
    let j = newPts.findIndex((pp) => Math.abs(pp[0] - q[0]) < 1e-3 && Math.abs(pp[1] - q[1]) < 1e-3 && Math.abs(pp[2] - q[2]) < 1e-3);
    if (j < 0) { j = newPts.length; newPts.push(q); }
    return j;
  };
  // Al terminar: las guías AUXILIARES se borran (para eso son); las barras se quedan.
  const borrarGuias = (auxIds: string[]) => {
    if (!auxIds.length) return 0;
    selection.clear(); auxIds.forEach((id) => selection.add(id));
    const n = auxIds.length; deleteSelectedItems(); selection.clear();
    return n;
  };

  // ── REVOLUCIÓN: la guía (segmentos = el meridiano) girada alrededor de un eje
  // VERTICAL (Z) que pasa por (ax, ay), en `sectores` tramos → paños Q4. Es como se
  // hace una cúpula (Jorge, 13-sep-2026): el arco meridiano dibujado en el alzado XZ y
  // girado. Cada punto del perfil da un ANILLO de `sectores` nudos (a 360° el último
  // coincide con el primero: se reusa). Un punto del perfil EN el eje es el polo: no
  // hay anillo, y los paños que llegan a él serían triángulos (Q4 colapsado =
  // elemento indefinido, ver CLAUDE.md); se cierran con COMETAS [polo, R_i, R_i+1,
  // R_i+2] (sectores par → sectores/2 Q4 convexos).
  (window as any).__hekatanRevolveSelection = (
    ax: number, ay: number, sectores: number, anguloDeg = 360,
  ): { anillos: number; areas: number; polo: boolean; guias: number; msg?: string } => {
    const M = Math.max(3, Math.round(sectores || 16));
    const cerrado = Math.abs(anguloDeg - 360) < 1e-9;
    const nSect = M, nAn = cerrado ? M : M + 1;
    const { segs, auxIds } = guiasDeSeleccion();
    if (!segs.length) return { anillos: 0, areas: 0, polo: false, guias: 0, msg: "no hay guía seleccionada (el meridiano: barras o líneas auxiliares)" };
    if (cerrado && M % 2) return { anillos: 0, areas: 0, polo: false, guias: 0, msg: "con el perfil tocando el eje, los sectores tienen que ser PARES (cometas en el polo)" };
    pushUndo();
    const pts = drawingObj.points.rawVal;
    const polys = drawingObj.polylines?.rawVal ?? [];
    const newPts = [...pts];
    let newPolys = polys.slice();
    if (newPolys.length && newPolys[newPolys.length - 1].length === 0) newPolys = newPolys.slice(0, -1);
    const newAreas = [...(drawingObj.areas?.rawVal ?? [])];
    const anillo = new Map<string, number[]>();
    const clave = (q: number[]) => q.map((v) => Math.round(v * 1e4)).join(",");
    const esPolo = (q: number[]) => Math.hypot(q[0] - ax, q[1] - ay) < 1e-6;
    const ringDe = (q: [number, number, number]) => {
      const k = clave(q); let r = anillo.get(k); if (r) return r;
      if (esPolo(q)) { r = [nudoEn(newPts, q)]; anillo.set(k, r); return r; }
      const Rr = Math.hypot(q[0] - ax, q[1] - ay), th0 = Math.atan2(q[1] - ay, q[0] - ax);
      r = [];
      for (let i = 0; i < nAn; i++) {
        const th = th0 + (anguloDeg * Math.PI / 180) * i / M;
        r.push(nudoEn(newPts, i === 0 ? q : [ax + Rr * Math.cos(th), ay + Rr * Math.sin(th), q[2]]));
      }
      anillo.set(k, r); return r;
    };
    let areas = 0, polo = false;
    const addQ = (q: number[]) => { newAreas.push(newPolys.length); newPolys.push([...q, q[0]]); areas++; };
    for (const [a, b] of segs) {
      const A = ringDe(a), B = ringDe(b);
      if (A.length === 1 && B.length === 1) continue;
      if (A.length === 1 || B.length === 1) {
        polo = true; const P0 = A.length === 1 ? A[0] : B[0]; const Rg = A.length === 1 ? B : A;
        for (let i = 0; i + 2 <= nSect; i += 2) addQ([P0, Rg[i % nAn], Rg[(i + 1) % nAn], Rg[(i + 2) % nAn]]);
        continue;
      }
      for (let i = 0; i < nSect; i++) addQ([A[i], B[i], B[(i + 1) % nAn], A[(i + 1) % nAn]]);
    }
    newPolys.push([]);
    drawingObj.points.val = newPts;
    if (drawingObj.polylines) drawingObj.polylines.val = newPolys;
    if (drawingObj.areas) drawingObj.areas.val = newAreas;
    const guias = borrarGuias(auxIds);
    try { (window as any).__hekatanRebuild?.(); } catch {}
    viewerRender();
    return { anillos: anillo.size, areas, polo, guias };
  };

  // ── BARRIDO EN ALZADO (loft): un CONTORNO cerrado de planta desplazado hacia
  // afuera según un PERFIL de alzado → paños Q4. Es la cáscara del Allianz Arena
  // (Jorge, 13-sep-2026): planta = rectángulo redondeado, y en alzado la piel hace
  // panza. La revolución es el caso particular en que el contorno es un círculo.
  // El anillo k es el contorno OFFSET hacia afuera d_k (vértices por la bisectriz,
  // a d/cos(θ/2)) a la cota z_k, con d_k = (p_k − p_0)·u, u = dirección horizontal
  // del perfil hacia afuera (medirla como r_k − r_0 desde el clic del eje dependía
  // de que el clic cayera exacto en el plano del perfil: 3 cm fuera = 26 µm).
  (window as any).__hekatanLoftSelection = (
    ax: number, ay: number,
  ): { contorno: number; perfil: number; areas: number; guias: number; msg?: string } => {
    const { segs, auxIds } = guiasDeSeleccion();
    const cadenas = encadenar(segs);
    const esHoriz = (c: { pts: [number, number, number][] }) => c.pts.every((q) => Math.abs(q[2] - c.pts[0][2]) < 1e-6);
    const cont = cadenas.find((c) => c.cerrada && esHoriz(c));
    const perf = cadenas.find((c) => !c.cerrada && c.pts.length >= 2 && !esHoriz(c));
    if (!cont) return { contorno: 0, perfil: 0, areas: 0, guias: 0, msg: "falta el CONTORNO de planta (una línea cerrada y horizontal) en la selección" };
    if (!perf) return { contorno: 0, perfil: 0, areas: 0, guias: 0, msg: "falta el PERFIL de alzado (una cadena abierta con distintas cotas) en la selección" };
    const C = cont.pts; const nC = C.length;
    const perfil = perf.pts.slice(); if (perfil[perfil.length - 1][2] < perfil[0][2]) perfil.reverse();
    let A2 = 0; for (let i = 0; i < nC; i++) { const p = C[i], q = C[(i + 1) % nC]; A2 += p[0] * q[1] - q[0] * p[1]; }
    const sgn = A2 > 0 ? 1 : -1;
    const normalEn = (i: number): [number, number] => {
      const p0 = C[(i - 1 + nC) % nC], p1 = C[i], p2 = C[(i + 1) % nC];
      const e1 = [p1[0] - p0[0], p1[1] - p0[1]], e2 = [p2[0] - p1[0], p2[1] - p1[1]];
      const l1 = Math.hypot(e1[0], e1[1]) || 1, l2 = Math.hypot(e2[0], e2[1]) || 1;
      const n1 = [sgn * e1[1] / l1, -sgn * e1[0] / l1], n2 = [sgn * e2[1] / l2, -sgn * e2[0] / l2];
      const d = 1 + (n1[0] * n2[0] + n1[1] * n2[1]);
      return [(n1[0] + n2[0]) / Math.max(d, 1e-6), (n1[1] + n2[1]) / Math.max(d, 1e-6)];
    };
    const normales = C.map((_, i) => normalEn(i));
    const p0 = perfil[0];
    let u: [number, number] = [0, 0], lu = 0;
    for (const q of perfil) { const dx = q[0] - p0[0], dy = q[1] - p0[1]; const l = Math.hypot(dx, dy); if (l > lu) { lu = l; u = [dx / l, dy / l]; } }
    if (lu < 1e-9) { const dx = p0[0] - ax, dy = p0[1] - ay; const l = Math.hypot(dx, dy) || 1; u = [dx / l, dy / l]; }
    if (u[0] * (p0[0] - ax) + u[1] * (p0[1] - ay) < 0) u = [-u[0], -u[1]];
    pushUndo();
    const pts = drawingObj.points.rawVal;
    const polys = drawingObj.polylines?.rawVal ?? [];
    const newPts = [...pts];
    let newPolys = polys.slice();
    if (newPolys.length && newPolys[newPolys.length - 1].length === 0) newPolys = newPolys.slice(0, -1);
    const newAreas = [...(drawingObj.areas?.rawVal ?? [])];
    const anillos: number[][] = perfil.map((q) => {
      const d = (q[0] - p0[0]) * u[0] + (q[1] - p0[1]) * u[1], z = q[2];
      return C.map((c, i) => nudoEn(newPts, [c[0] + normales[i][0] * d, c[1] + normales[i][1] * d, z]));
    });
    let areas = 0;
    for (let k2 = 0; k2 + 1 < anillos.length; k2++) for (let i = 0; i < nC; i++) {
      const q = [anillos[k2][i], anillos[k2][(i + 1) % nC], anillos[k2 + 1][(i + 1) % nC], anillos[k2 + 1][i]];
      if (new Set(q).size < 4) continue;
      newAreas.push(newPolys.length); newPolys.push([...q, q[0]]); areas++;
    }
    newPolys.push([]);
    drawingObj.points.val = newPts;
    if (drawingObj.polylines) drawingObj.polylines.val = newPolys;
    if (drawingObj.areas) drawingObj.areas.val = newAreas;
    const guias = borrarGuias(auxIds);
    try { (window as any).__hekatanRebuild?.(); } catch {}
    viewerRender();
    return { contorno: nC, perfil: perfil.length, areas, guias };
  };
  // ── Losa rectangular con chaflanes (esquinas redondeadas) ──
  // 2 clicks: esquinas opuestas de la bounding box. Genera 4 lados rectos
  // + 4 cuartos de círculo en las esquinas. Pensado para volados curvos
  // arquitectónicos (balcones, fachadas redondeadas, losas de piscina).
  (window as any).__hekatanDrawSlabChaflan = (
    p1: [number, number, number],
    p2: [number, number, number],
    chaflanRadius: number = 1.0,
    segArc: number = 6,
    segStr: number = 6,
  ) => {
    const xMin = Math.min(p1[0], p2[0]);
    const xMax = Math.max(p1[0], p2[0]);
    const yMin = Math.min(p1[1], p2[1]);
    const yMax = Math.max(p1[1], p2[1]);
    const z = (p1[2] + p2[2]) / 2;
    const Lx = xMax - xMin;
    const Ly = yMax - yMin;
    const r = Math.min(chaflanRadius, Lx / 2 - 0.01, Ly / 2 - 0.01);
    if (r <= 0) return;
    const baseIdx = drawingObj.points.rawVal.length;
    const newPts: [number, number, number][] = [];
    const polyIdx: number[] = [];
    const addPt = (x: number, y: number) => {
      newPts.push([x, y, z]);
      polyIdx.push(baseIdx + newPts.length - 1);
    };
    // Borde inferior (y=yMin): de (xMin+r, yMin) a (xMax-r, yMin)
    for (let i = 0; i <= segStr; i++) addPt(xMin + r + (Lx - 2*r) * i / segStr, yMin);
    // Chaflán BR
    for (let i = 1; i <= segArc; i++) {
      const ang = -Math.PI/2 + (Math.PI/2) * i / segArc;
      addPt((xMax - r) + r * Math.cos(ang), (yMin + r) + r * Math.sin(ang));
    }
    // Borde derecho
    for (let i = 1; i <= segStr; i++) addPt(xMax, yMin + r + (Ly - 2*r) * i / segStr);
    // Chaflán TR
    for (let i = 1; i <= segArc; i++) {
      const ang = 0 + (Math.PI/2) * i / segArc;
      addPt((xMax - r) + r * Math.cos(ang), (yMax - r) + r * Math.sin(ang));
    }
    // Borde superior
    for (let i = 1; i <= segStr; i++) addPt(xMax - r - (Lx - 2*r) * i / segStr, yMax);
    // Chaflán TL
    for (let i = 1; i <= segArc; i++) {
      const ang = Math.PI/2 + (Math.PI/2) * i / segArc;
      addPt((xMin + r) + r * Math.cos(ang), (yMax - r) + r * Math.sin(ang));
    }
    // Borde izquierdo
    for (let i = 1; i <= segStr; i++) addPt(xMin, yMax - r - (Ly - 2*r) * i / segStr);
    // Chaflán BL — hasta segArc − 1: el último punto del arco ES el primero de la
    // polilínea (xMin+r, yMin); con <= salía un nudo DUPLICADO y un tramo de largo
    // cero al cerrar (medido en el barrido del Allianz, 13-sep-2026).
    for (let i = 1; i < segArc; i++) {
      const ang = Math.PI + (Math.PI/2) * i / segArc;
      addPt((xMin + r) + r * Math.cos(ang), (yMin + r) + r * Math.sin(ang));
    }
    // Cerrar
    polyIdx.push(baseIdx);
    if (curvasAux()) { emitirAux(newPts, true); return; }
    drawingObj.points.val = [...drawingObj.points.rawVal, ...newPts];
    if (drawingObj.polylines) {
      const polys = drawingObj.polylines.rawVal;
      drawingObj.polylines.val = [...polys.slice(0, -1), polyIdx, []];
    }
  };

  // Rectángulo por 2 esquinas en plano XY o XZ
  (window as any).__hekatanDrawRect = (
    p1: [number, number, number],
    p2: [number, number, number],
  ) => {
    const baseIdx = drawingObj.points.rawVal.length;
    // 4 esquinas (asumiendo que los 2 puntos definen una diagonal en un plano)
    const x1 = p1[0], y1 = p1[1], z1 = p1[2];
    const x2 = p2[0], y2 = p2[1], z2 = p2[2];
    let pts: [number, number, number][];
    if (Math.abs(z1 - z2) < 1e-6) {
      // Plano XY (Z constante)
      pts = [[x1, y1, z1], [x2, y1, z1], [x2, y2, z1], [x1, y2, z1]];
    } else if (Math.abs(y1 - y2) < 1e-6) {
      // Plano XZ (Y constante)
      pts = [[x1, y1, z1], [x2, y1, z1], [x2, y1, z2], [x1, y1, z2]];
    } else {
      // Plano YZ (X constante)
      pts = [[x1, y1, z1], [x1, y2, z1], [x1, y2, z2], [x1, y1, z2]];
    }
    drawingObj.points.val = [...drawingObj.points.rawVal, ...pts];
    if (drawingObj.polylines) {
      const rectPoly = [baseIdx, baseIdx + 1, baseIdx + 2, baseIdx + 3, baseIdx];
      const polys = drawingObj.polylines.rawVal;
      drawingObj.polylines.val = [...polys.slice(0, -1), rectPoly, []];
    }
  };

  // ── ÁREA RECTANGULAR: 2 clicks (esquinas opuestas) → shell Q4 marcado como
  // ÁREA. Igual que __hekatanDrawRect pero lo registra en drawingObj.areas
  // para que newBlank lo construya como shell (no como frames de borde).
  (window as any).__hekatanDrawRectArea = (
    p1: [number, number, number],
    p2: [number, number, number],
  ) => {
    const baseIdx = drawingObj.points.rawVal.length;
    const x1 = p1[0], y1 = p1[1], z1 = p1[2];
    const x2 = p2[0], y2 = p2[1], z2 = p2[2];
    let pts: [number, number, number][];
    if (inclinedPlaneActive && drawingObj.gridTarget) {
      // PLANO INCLINADO: construir el rectángulo EN la base (u,v) del plano,
      // así las 2 esquinas opuestas dan un rectángulo limpio sobre la
      // inclinación (no un cuadrilátero raro). u,v = ejes locales del plano.
      const gt = drawingObj.gridTarget.rawVal;
      const e = new THREE.Euler(...gt.rotation);
      const u = new THREE.Vector3(1, 0, 0).applyEuler(e);
      const v = new THREE.Vector3(0, 1, 0).applyEuler(e);
      const O = new THREE.Vector3(...gt.position);
      const A = new THREE.Vector3(x1, y1, z1), C = new THREE.Vector3(x2, y2, z2);
      const au = A.clone().sub(O).dot(u), av = A.clone().sub(O).dot(v);
      const cu = C.clone().sub(O).dot(u), cv = C.clone().sub(O).dot(v);
      const mk = (uu: number, vv: number): [number, number, number] =>
        O.clone().addScaledVector(u, uu).addScaledVector(v, vv).toArray() as [number, number, number];
      pts = [mk(au, av), mk(cu, av), mk(cu, cv), mk(au, cv)];
    }
    else if (Math.abs(z1 - z2) < 1e-6) pts = [[x1, y1, z1], [x2, y1, z1], [x2, y2, z1], [x1, y2, z1]];
    else if (Math.abs(y1 - y2) < 1e-6) pts = [[x1, y1, z1], [x2, y1, z1], [x2, y1, z2], [x1, y1, z2]];
    else pts = [[x1, y1, z1], [x1, y2, z1], [x1, y2, z2], [x1, y1, z2]];
    if ((window as any).__hekatanPushUndo) (window as any).__hekatanPushUndo();
    drawingObj.points.val = [...drawingObj.points.rawVal, ...pts];
    if (drawingObj.polylines) {
      const polys = drawingObj.polylines.rawVal;
      const newAt = polys.length - 1;  // posición del [] final que reemplazamos
      const rectPoly = [baseIdx, baseIdx + 1, baseIdx + 2, baseIdx + 3, baseIdx];
      drawingObj.polylines.val = [...polys.slice(0, -1), rectPoly, []];
      if (drawingObj.areas) drawingObj.areas.val = [...drawingObj.areas.rawVal, newAt];
    }
    try { (window as any).__hekatanRebuild?.(); } catch {}
    viewerRender();
  };

  // ── RELLENAR TODAS las celdas cerradas (topológico, sirve en 3D) ──────────
  // Escanea TODAS las barras y marca como área cada celda CERRADA (cuadrilátero
  // sin diagonal o triángulo) que aún no tenga área. Funciona en cualquier plano
  // (una caja 3D → sus 6 caras). Devuelve cuántas creó. Jorge: "seleccionar todo
  // y que se repinten las áreas de las que cumplen la regla".
  (window as any).__hekatanFillClosedAreas = (): number => {
    const polysRaw = drawingObj.polylines?.rawVal ?? [];
    // Nudos COINCIDENTES → uno solo. Una viga dibujada enganchando (osnap) al
    // nudo de un arco crea un punto NUEVO en la misma coordenada: topológicamente
    // son dos nudos y la celda nunca cierra (medido: bóveda de arcos + vigas
    // longitudinales daba 0 áreas). Se canonicaliza por coordenada (1e-4 m),
    // como el "merge joints" de ETABS.
    const P = drawingObj.points.rawVal;
    const canon = new Map<string, number>(); const alias = new Map<number, number>();
    const key = (p: number[]) => p.map((v) => Math.round(v * 1e4) / 1e4).join(",");
    for (let i = 0; i < P.length; i++) { const k = key(P[i]); const c = canon.get(k); if (c === undefined) canon.set(k, i); alias.set(i, c ?? i); }
    const polys = polysRaw.map((poly) => poly.map((ix) => alias.get(ix) ?? ix));
    const adj = new Map<number, Set<number>>();
    const addE = (a: number, b: number) => { if (a === b) return;
      (adj.get(a) ?? adj.set(a, new Set()).get(a)!).add(b);
      (adj.get(b) ?? adj.set(b, new Set()).get(b)!).add(a); };
    for (const poly of polys) for (let i = 0; i + 1 < poly.length; i++) addE(poly[i], poly[i + 1]);
    const has = (a: number, b: number) => !!adj.get(a)?.has(b);
    const seen = new Set<string>(); const cells: number[][] = [];
    const ids = [...adj.keys()];
    for (const a of ids) for (const b of adj.get(a)!) { if (b < a) continue;
      for (const c of adj.get(b)!) { if (c === a) continue;
        for (const d of adj.get(c)!) { if (d === a || d === b || !has(d, a)) continue;
          if (has(a, c) || has(b, d)) continue;
          const k = [a, b, c, d].slice().sort((x, y) => x - y).join("-");
          if (!seen.has(k)) { seen.add(k); cells.push([a, b, c, d]); } } } }
    for (const a of ids) for (const b of adj.get(a)!) { if (b < a) continue;
      for (const c of adj.get(b)!) { if (c === a || !has(c, a)) continue;
        const k = [a, b, c].slice().sort((x, y) => x - y).join("-");
        if (!seen.has(k)) { seen.add(k); cells.push([a, b, c]); } } }
    if (!cells.length) return 0;
    const areasNow = [...(drawingObj.areas?.rawVal ?? [])];
    const yaArea = new Set(areasNow.map((ai) => [...new Set(polys[ai] ?? [])].sort((x, y) => x - y).join("-")));
    const nuevas = [...polys]; let creadas = 0;
    for (const c of cells) { const k = c.slice().sort((x, y) => x - y).join("-");
      if (yaArea.has(k)) continue; yaArea.add(k);
      nuevas.push([...c, c[0]]); areasNow.push(nuevas.length - 1); creadas++; }
    if (creadas) {
      if ((window as any).__hekatanPushUndo) (window as any).__hekatanPushUndo();
      drawingObj.polylines!.val = nuevas;
      if (drawingObj.areas) drawingObj.areas.val = areasNow;
      try { (window as any).__hekatanRebuild?.(); } catch {}
      viewerRender();
    }
    return creadas;
  };

  // ── ÁREA LIBRE: polígono arbitrario (N vértices, incluso cóncavo tipo
  // escalera/L) → MALLA de shells Q4. El FEM solo soporta Q4, así que
  // dividimos el polígono en una grilla de cuadritos en SU PROPIO plano y
  // conservamos las celdas cuyo centro cae dentro del polígono
  // (point-in-polygon por ray-casting). Devuelve la cantidad de shells.
  (window as any).__hekatanMeshPolyArea = (
    verts3d: [number, number, number][],
    spacingOpt?: number,
  ): number => {
    const n = verts3d.length;
    if (n < 3) return 0;
    // Normal del polígono (método de Newell — robusto para polígonos planos).
    let nx = 0, ny = 0, nz = 0;
    for (let i = 0; i < n; i++) {
      const a = verts3d[i], b = verts3d[(i + 1) % n];
      nx += (a[1] - b[1]) * (a[2] + b[2]);
      ny += (a[2] - b[2]) * (a[0] + b[0]);
      nz += (a[0] - b[0]) * (a[1] + b[1]);
    }
    const nl = Math.hypot(nx, ny, nz) || 1; nx /= nl; ny /= nl; nz /= nl;
    // u = dirección del primer borde (alinea la grilla con la forma → tiles
    // exactos en escaleras/L axis-aligned). v = n × u.
    let ux = verts3d[1][0] - verts3d[0][0], uy = verts3d[1][1] - verts3d[0][1], uz = verts3d[1][2] - verts3d[0][2];
    const ul = Math.hypot(ux, uy, uz) || 1; ux /= ul; uy /= ul; uz /= ul;
    let vx = ny * uz - nz * uy, vy = nz * ux - nx * uz, vz = nx * uy - ny * ux;
    const vln = Math.hypot(vx, vy, vz) || 1; vx /= vln; vy /= vln; vz /= vln;
    const O = verts3d[0];
    const to2d = (p: number[]): [number, number] => [
      (p[0] - O[0]) * ux + (p[1] - O[1]) * uy + (p[2] - O[2]) * uz,
      (p[0] - O[0]) * vx + (p[1] - O[1]) * vy + (p[2] - O[2]) * vz,
    ];
    const to3d = (s: number, t: number): [number, number, number] => [
      O[0] + s * ux + t * vx, O[1] + s * uy + t * vy, O[2] + s * uz + t * vz,
    ];
    const poly2d = verts3d.map(to2d);
    let minS = Infinity, maxS = -Infinity, minT = Infinity, maxT = -Infinity;
    for (const [s, t] of poly2d) {
      if (s < minS) minS = s; if (s > maxS) maxS = s;
      if (t < minT) minT = t; if (t > maxT) maxT = t;
    }
    const w = maxS - minS, h = maxT - minT;
    if (w < 1e-6 || h < 1e-6) return 0;
    // Espaciado: default 0.5 m, duplicando si se generarían demasiadas celdas.
    let step = spacingOpt && spacingOpt > 0 ? spacingOpt : 0.5;
    while ((w / step) * (h / step) > 2500) step *= 2;
    step = Math.min(step, Math.min(w, h));
    const inside = (s: number, t: number): boolean => {
      let c = false;
      for (let i = 0, j = poly2d.length - 1; i < poly2d.length; j = i++) {
        const [si, ti] = poly2d[i], [sj, tj] = poly2d[j];
        if (((ti > t) !== (tj > t)) && (s < (sj - si) * (t - ti) / (tj - ti) + si)) c = !c;
      }
      return c;
    };
    const ns = Math.max(1, Math.round(w / step));
    const nt = Math.max(1, Math.round(h / step));
    const ds = w / ns, dt = h / nt;
    // Nodos de grilla compartidos (solo los usados por celdas internas).
    const nodeKey = new Map<string, number>();
    const newPts: [number, number, number][] = [];
    const baseIdx = drawingObj.points.rawVal.length;
    const getNode = (gi: number, gj: number): number => {
      const k = gi + "," + gj;
      const ex = nodeKey.get(k);
      if (ex !== undefined) return ex;
      const idx = baseIdx + newPts.length;
      newPts.push(to3d(minS + gi * ds, minT + gj * dt));
      nodeKey.set(k, idx);
      return idx;
    };
    const quads: number[][] = [];
    for (let gi = 0; gi < ns; gi++) {
      for (let gj = 0; gj < nt; gj++) {
        if (!inside(minS + (gi + 0.5) * ds, minT + (gj + 0.5) * dt)) continue;
        const a = getNode(gi, gj), b = getNode(gi + 1, gj);
        const cc = getNode(gi + 1, gj + 1), d = getNode(gi, gj + 1);
        quads.push([a, b, cc, d]);
      }
    }
    if (!quads.length) return 0;
    if ((window as any).__hekatanPushUndo) (window as any).__hekatanPushUndo();
    drawingObj.points.val = [...drawingObj.points.rawVal, ...newPts];
    if (drawingObj.polylines && drawingObj.areas) {
      let polys = drawingObj.polylines.rawVal.slice();
      if (polys.length && polys[polys.length - 1].length === 0) polys = polys.slice(0, -1);
      const areaIdxs: number[] = [];
      for (const q of quads) { areaIdxs.push(polys.length); polys.push([q[0], q[1], q[2], q[3], q[0]]); }
      polys.push([]);
      drawingObj.polylines.val = polys;
      drawingObj.areas.val = [...drawingObj.areas.rawVal, ...areaIdxs];
    }
    try { (window as any).__hekatanRebuild?.(); } catch {}
    viewerRender();
    return quads.length;
  };

  // Finaliza el ÁREA LIBRE en curso: malla los puntos clickeados y limpia.
  const finalizePolyArea = (): number => {
    if (polyAreaPts.length < 3) { polyAreaPts = []; polyAreaPreview.visible = false; viewerRender(); return 0; }
    const cnt = (window as any).__hekatanMeshPolyArea(polyAreaPts.slice());
    polyAreaPts = [];
    polyAreaPreview.visible = false;
    viewerRender();
    return cnt;
  };
  (window as any).__hekatanFinalizePolyArea = finalizePolyArea;

  // ── PLANO DE TRABAJO INCLINADO (UCS por 3 puntos) ──
  // El plano de trabajo se orienta vía drawingObj.gridTarget {position, rotation}.
  // A partir de 3 puntos calculamos la normal y el Euler para inclinar el plano
  // (y la grilla) a CUALQUIER orientación → los clicks posteriores caen sobre
  // ese plano inclinado, así se dibujan áreas/shells inclinados.
  (window as any).__hekatanSetInclinedPlaneFrom3 = (
    p1: [number, number, number],
    p2: [number, number, number],
    p3: [number, number, number],
  ): boolean => {
    const a = new THREE.Vector3(p1[0], p1[1], p1[2]);
    const b = new THREE.Vector3(p2[0], p2[1], p2[2]);
    const c = new THREE.Vector3(p3[0], p3[1], p3[2]);
    const N = new THREE.Vector3().subVectors(b, a)
      .cross(new THREE.Vector3().subVectors(c, a));
    if (N.lengthSq() < 1e-9) return false;   // 3 puntos colineales
    N.normalize();
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), N);
    const e = new THREE.Euler().setFromQuaternion(q);
    if (drawingObj.gridTarget) {
      drawingObj.gridTarget.val = {
        position: [a.x, a.y, a.z],
        rotation: [e.x, e.y, e.z],
      };
    }
    inclinedPlaneActive = true;   // síncrono (la derive de gridTarget es async)
    // Guía visible: centrar en el centroide de los 3 puntos, orientar al plano,
    // dimensionar ~ al tamaño del triángulo (con margen). Reconstruimos las
    // geometrías al tamaño real (sin escalar el grupo → paso de grilla = 1 m).
    const ctr = new THREE.Vector3().addVectors(a, b).add(c).multiplyScalar(1 / 3);
    const size = Math.max(a.distanceTo(b), a.distanceTo(c), b.distanceTo(c)) * 2.2 + 4;
    const half = size / 2;
    inclinedFill.geometry.dispose();
    inclinedFill.geometry = new THREE.PlaneGeometry(size, size);
    inclinedBorder.geometry.dispose();
    inclinedBorder.geometry = new THREE.EdgesGeometry(new THREE.PlaneGeometry(size, size));
    buildInclinedGrid(half, 1);
    inclinedHelper.position.copy(ctr);
    inclinedHelper.quaternion.copy(q);
    inclinedHelper.scale.set(1, 1, 1);
    inclinedHelper.visible = true;
    try { (window as any).__hekatanRefreshStatus?.(); } catch {}
    viewerRender();
    return true;
  };
  // Resetear el plano de trabajo a horizontal (XY, Z=0).
  // ⚠️ Horizontal es rotX = π/2: la geometría del plano viene pre-rotada (está en
  // X-Z). Con rotación cero, el botón «reset horizontal» dejaba el plano DE PIE.
  (window as any).__hekatanResetPlaneXY = () => {
    if (drawingObj.gridTarget) drawingObj.gridTarget.val = { position: [0, 0, 0], rotation: [Math.PI / 2, 0, 0] };
    inclinedPlaneActive = false;   // síncrono
    inclinedHelper.visible = false;
    viewerRender();
  };

  // ── Ejes A/B/C + 1/2/3 estilo CAD/FEM Studio ──
  // Dibuja líneas verticales en X=xs[i] (etiquetadas A, B, C...) y
  // líneas horizontales en Y=ys[i] (etiquetadas 1, 2, 3...). Útil para
  // ubicarse en planta y cruzar referencias entre modelo y planos.
  const axesGroup = new THREE.Group();
  axesGroup.visible = false;
  scene.add(axesGroup);
  (window as any).__hekatanShowAxes = (
    xs: number[],
    ys: number[],
    zMax: number = 12,
    extentExtra: number = 2,
  ) => {
    while (axesGroup.children.length) {
      const c = axesGroup.children.pop()!;
      (c as any).geometry?.dispose();
      (c as any).material?.dispose();
    }
    if (!xs.length || !ys.length) return;
    const yMin = Math.min(...ys) - extentExtra;
    const yMax = Math.max(...ys) + extentExtra;
    const xMin = Math.min(...xs) - extentExtra;
    const xMax = Math.max(...xs) + extentExtra;
    const labelLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const mkLabel = (txt: string, x: number, y: number, z: number, color: string) => {
      const c = document.createElement("canvas");
      c.width = 64; c.height = 32;
      const cc = c.getContext("2d")!;
      cc.fillStyle = color;
      cc.font = "bold 22px sans-serif";
      cc.textAlign = "center";
      cc.fillText(txt, 32, 26);
      const tex = new THREE.CanvasTexture(c);
      const m = new THREE.SpriteMaterial({ map: tex, transparent: true });
      const s = new THREE.Sprite(m);
      s.position.set(x, y, z);
      s.scale.set(1.2, 0.6, 1);
      return s;
    };
    // Ejes en X (A, B, C...) — líneas paralelas al eje Y a cada x_i
    xs.forEach((x, i) => {
      const lbl = i < labelLetters.length ? labelLetters[i] : `X${i}`;
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x, yMin, 0),
        new THREE.Vector3(x, yMax, 0),
        new THREE.Vector3(x, yMin, 0),
        new THREE.Vector3(x, yMin, zMax),
      ]);
      const mat = new THREE.LineDashedMaterial({
        color: 0x60a5fa, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6,
      });
      const ln = new THREE.LineSegments(geo, mat);
      ln.computeLineDistances();
      axesGroup.add(ln);
      // Etiqueta en ambos extremos
      axesGroup.add(mkLabel(lbl, x, yMin - 0.5, 0, "#60a5fa"));
      axesGroup.add(mkLabel(lbl, x, yMax + 0.5, 0, "#60a5fa"));
    });
    // Ejes en Y (1, 2, 3...) — líneas paralelas al eje X a cada y_i
    ys.forEach((y, i) => {
      const lbl = `${i + 1}`;
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(xMin, y, 0),
        new THREE.Vector3(xMax, y, 0),
        new THREE.Vector3(xMin, y, 0),
        new THREE.Vector3(xMin, y, zMax),
      ]);
      const mat = new THREE.LineDashedMaterial({
        color: 0xfb7185, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6,
      });
      const ln = new THREE.LineSegments(geo, mat);
      ln.computeLineDistances();
      axesGroup.add(ln);
      axesGroup.add(mkLabel(lbl, xMin - 0.5, y, 0, "#fb7185"));
      axesGroup.add(mkLabel(lbl, xMax + 0.5, y, 0, "#fb7185"));
    });
    axesGroup.visible = true;
    viewerRender();
  };
  (window as any).__hekatanHideAxes = () => {
    axesGroup.visible = false;
    viewerRender();
  };

  // ── Planos de referencia visibles ──
  // Líneas semitransparentes en X-Y a Z=0,3,6,9,12 m que sirven de guía
  // al dibujar (ej. niveles de pisos). El usuario activa/desactiva con
  // window.__hekatanShowRefPlanes(zArray, gridSizeM).
  // Además de las líneas visuales, cada plano tiene un Mesh INVISIBLE de
  // 10000×10000 m para raycast — permite dibujar EN ISOMÉTRICO directamente
  // sobre cualquier plano: el click engancha al plano más cercano al rayo
  // de cámara (el que el usuario "ve al frente").
  const refPlanesGroup = new THREE.Group();
  refPlanesGroup.visible = false;
  scene.add(refPlanesGroup);
  // Meshes invisibles para raycast — separados del group visual.
  let refPlaneMeshes: THREE.Mesh[] = [];
  (window as any).__hekatanShowRefPlanes = (
    zLevels: number[] = [0, 3, 6, 9, 12],
    sizeM: number = 20,
    centerX: number = 0,    // grid centrado en origen (convención CAD)
    centerY: number = 0,
  ) => {
    // Limpiar viejos
    while (refPlanesGroup.children.length) {
      const c = refPlanesGroup.children.pop()!;
      (c as any).geometry?.dispose();
      (c as any).material?.dispose();
    }
    refPlaneMeshes.forEach(m => {
      scene.remove(m);
      m.geometry.dispose();
      (m.material as THREE.Material).dispose();
    });
    refPlaneMeshes = [];
    const colors = [0x60a5fa, 0x34d399, 0xfbbf24, 0xfb7185, 0xc084fc, 0x22d3ee];
    zLevels.forEach((z, i) => {
      const col = colors[i % colors.length];
      // Borde rectangular del plano
      const half = sizeM / 2;
      const pts = [
        new THREE.Vector3(centerX - half, centerY - half, z),
        new THREE.Vector3(centerX + half, centerY - half, z),
        new THREE.Vector3(centerX + half, centerY + half, z),
        new THREE.Vector3(centerX - half, centerY + half, z),
        new THREE.Vector3(centerX - half, centerY - half, z),
      ];
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.55 });
      refPlanesGroup.add(new THREE.Line(geo, mat));
      // Label "Z=X m" como Sprite simple usando texto canvas
      const canvas2 = document.createElement('canvas');
      canvas2.width = 128; canvas2.height = 32;
      const cctx = canvas2.getContext('2d')!;
      cctx.fillStyle = `#${col.toString(16).padStart(6, '0')}`;
      cctx.font = 'bold 18px sans-serif';
      cctx.fillText(`Z = ${z} m`, 4, 22);
      const tex = new THREE.CanvasTexture(canvas2);
      const sprMat = new THREE.SpriteMaterial({ map: tex, transparent: true });
      const spr = new THREE.Sprite(sprMat);
      spr.position.set(centerX - half - 1.5, centerY - half - 1.5, z);
      spr.scale.set(2.5, 0.6, 1);
      refPlanesGroup.add(spr);
      // Mesh INVISIBLE 10000×10000 horizontal en XY a Z=z para raycast.
      // userData.z guarda el nivel para identificarlo después si hace falta.
      const rmGeo = new THREE.PlaneGeometry(10000, 10000);
      const rmMat = new THREE.MeshBasicMaterial({ visible: false, side: THREE.DoubleSide });
      const rmMesh = new THREE.Mesh(rmGeo, rmMat);
      rmMesh.position.set(0, 0, z);  // plano XY a la altura Z dada
      // PlaneGeometry default está en XY → ya es horizontal en este sistema Z-up.
      // Ojo: el "plane" del active workplane usa rotateX(π/2) porque viene
      // pre-rotado con `geometry.rotateX(π/2)`. Acá NO necesitamos rotar.
      rmMesh.frustumCulled = false;
      (rmMesh as any).userData = { refPlaneZ: z };
      scene.add(rmMesh);
      refPlaneMeshes.push(rmMesh);
    });
    refPlanesGroup.visible = true;
    viewerRender();
  };
  (window as any).__hekatanHideRefPlanes = () => {
    refPlanesGroup.visible = false;
    // Los meshes invisibles también dejan de ser raycast targets.
    refPlaneMeshes.forEach(m => { m.visible = false; });
    viewerRender();
  };

  // ── Líneas auxiliares (construction lines) ──
  // Color cyan dashed semitransparente. NO generan frames FEM, pero SÍ son
  // objeto de OSNAP (endpoint/midpoint/intersection). Útil para construir
  // referencias en 3D iso, alinear, proyectar, etc.
  const auxLinesGroup = new THREE.Group();
  auxLinesGroup.frustumCulled = false;
  scene.add(auxLinesGroup);
  const renderAuxLines = () => {
    while (auxLinesGroup.children.length) {
      const c = auxLinesGroup.children.pop()!;
      (c as any).geometry?.dispose?.();
      (c as any).material?.dispose?.();
    }
    const auxState = (window as any).__hekatanDrawingAuxLines;
    const lines: number[][] = auxState?.rawVal ?? auxState?.val ?? auxState ?? [];
    for (const ln of lines) {
      if (ln.length !== 6) continue;
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(ln[0], ln[1], ln[2]),
        new THREE.Vector3(ln[3], ln[4], ln[5]),
      ]);
      const mat = new THREE.LineDashedMaterial({
        color: 0x22d3ee,    // cyan
        dashSize: 0.3,
        gapSize: 0.15,
        transparent: true,
        opacity: 0.8,
      });
      const line = new THREE.Line(geo, mat);
      line.computeLineDistances();  // requerido para dashed
      auxLinesGroup.add(line);
    }
  };
  // Re-render automático cuando cambia el array de aux lines
  van.derive(() => {
    const auxState = (window as any).__hekatanDrawingAuxLines;
    if (auxState?.val) {
      auxState.val;  // dependency
      renderAuxLines();
      viewerRender();
    }
  });

  // ── Puntos auxiliares (aux points) ──
  // Esferitas cyan que NO generan nodos FEM pero sirven de referencia
  // OSnap (endpoint). Cada entry en __hekatanDrawingAuxPoints es [x,y,z].
  // Render como Mesh sphere con scale dinámico (constante en pantalla).
  const auxPointsGroup = new THREE.Group();
  auxPointsGroup.frustumCulled = false;
  scene.add(auxPointsGroup);
  const renderAuxPoints = () => {
    while (auxPointsGroup.children.length) {
      const c = auxPointsGroup.children.pop()!;
      (c as any).geometry?.dispose?.();
      (c as any).material?.dispose?.();
    }
    const apState = (window as any).__hekatanDrawingAuxPoints;
    const pts: number[][] = apState?.rawVal ?? apState?.val ?? apState ?? [];
    for (const p of pts) {
      if (!p || p.length !== 3) continue;
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(0.025, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.85, depthTest: false }),
      );
      m.position.set(p[0], p[1], p[2]);
      m.renderOrder = 996;
      m.scale.setScalar(markerScreenScale(m.position));
      auxPointsGroup.add(m);
    }
  };
  van.derive(() => {
    const apState = (window as any).__hekatanDrawingAuxPoints;
    if (apState?.val !== undefined) {
      apState.val;  // dependency
      renderAuxPoints();
      viewerRender();
    }
  });
  // Re-escalar al cambiar cámara
  controls.addEventListener("change", () => {
    auxPointsGroup.children.forEach((m: any) => {
      m.scale.setScalar(markerScreenScale(m.position));
    });
  });
  (window as any).__hekatanRenderAuxPoints = renderAuxPoints;

  // ── Snap 3D Indicator ──
  // Tamaño REDUCIDO: sphere 1 cm + halo 1.5 cm + cruz 0.08 m. El scale
  // tiene cap _snapMaxScale para evitar cursor gigante en plan view.
  const snapMarker = new THREE.Group();
  const snapSphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.010, 12, 12),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95 }),
  );
  const snapHalo = new THREE.Mesh(
    new THREE.SphereGeometry(0.015, 12, 12),
    new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.20, depthWrite: false }),
  );
  // Como AutoCAD: la cruz es BLANCA (registro R26.0 «XhairPickboxEtc» = 16777215) y sin halo.
  snapHalo.visible = false;
  snapMarker.add(snapSphere, snapHalo);
  // Cruz de ejes 0.08 m — más chica
  const axisLen = 0.08;
  const mkLine = (a: [number, number, number], b: [number, number, number], col: number) => {
    const g = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(...a), new THREE.Vector3(...b),
    ]);
    return new THREE.Line(g, new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.7 }));
  };
  snapMarker.add(mkLine([-axisLen, 0, 0], [axisLen, 0, 0], 0xffffff)); // X (cruz blanca, como AutoCAD)
  snapMarker.add(mkLine([0, -axisLen, 0], [0, axisLen, 0], 0xffffff)); // Y
  snapMarker.add(mkLine([0, 0, -axisLen], [0, 0, axisLen], 0xffffff)); // Z
  snapMarker.visible = false;
  snapMarker.frustumCulled = false;
  scene.add(snapMarker);
  // ── Tamaño constante en pantalla (compensa el zoom) ──
  // Sin esto, al acercarse el snap marker crece visualmente (es geometría
  // 3D world-space). Calculamos el scale = distancia/factor para que el
  // tamaño aparente en píxeles quede igual a cualquier zoom.
  // Calibración: a 10m de la cámara, scale=1 (sphere=2cm, cruz=15cm).
  // ⚠️ Esto escalaba con la DISTANCIA a la cámara (`dist / 40`, con tope 2.5).
  // En perspectiva funciona; en ORTOGRÁFICA (las vistas planta, frente y lado) el
  // zoom NO cambia la distancia —cambia `camera.zoom`—, así que el marcador se
  // quedaba del mismo tamaño en el mundo y CRECÍA en pantalla al acercar: tapaba
  // justo el punto que se iba a marcar. El tope de 2.5 era un parche de eso.
  // Ahora se calculan los METROS QUE MIDE UN PÍXEL con la cámara de verdad y el
  // marcador se fija a un tamaño en píxeles: igual a cualquier zoom y en las dos
  // cámaras. El halo mide 0.015 m de radio con escala 1.
  // Radio aparente del halo, en píxeles. AutoCAD trae 5 de fábrica (su marcador
  // de referencia a objetos); aquí va a 2 porque Jorge lo quiere más discreto:
  // el cursor tiene que dejar VER el punto que va a marcar, no taparlo.
  // Se puede regular desde fuera con `__hekatanSnapPx(n)`.
  let _snapPx = 2;
  const metrosPorPixel = (punto: THREE.Vector3) => {
    const cam = getActiveCamera() as any;
    const h = rendererElm?.clientHeight || 700;
    if (cam.isOrthographicCamera)
      return (cam.top - cam.bottom) / (cam.zoom || 1) / h;
    const dist = cam.position.distanceTo(punto);
    return (2 * dist * Math.tan(((cam.fov || 50) * Math.PI / 180) / 2)) / h;
  };
  const updateSnapMarkerScale = () => {
    if (!snapMarker.visible) return;
    const s = (_snapPx * metrosPorPixel(snapMarker.position)) / 0.015;
    // ⚠️ Sin margen de sobra, el TOPE recorta la escala y el marcador deja de medir lo
    // mismo. Medido el 8-sep-2026 en planta: alejando a zoom ×0.0156 el tope de 60
    // dejaba el halo en 0.84 px en vez de los 2 que toca — se veía encoger al alejar,
    // que es justo lo que este cálculo venía a arreglar. El tope solo está para que un
    // valor absurdo no reviente la escena, no para limitar el zoom.
    snapMarker.scale.setScalar(Math.max(1e-4, Math.min(1e5, s)));
  };
  // ── LA MIRILLA de las referencias a objetos, EN PÍXELES ────────────────────
  // Estaba en METROS FIJOS: `__hekatanSnap2D * 1.2`, o sea 0.6 m pasara lo que
  // pasara. Eso no se puede usar. Medido el 9-sep-2026 dibujando con el ratón:
  // acercado, 0.6 m es media pantalla y CADA punto nuevo saltaba encima de uno ya
  // dibujado (el 3.º cayó sobre el 2.º y el 5.º sobre el 1.º); alejado, 0.6 m es
  // menos de un píxel y no engancha nunca. AutoCAD, Revit y ETABS usan una mirilla
  // en PÍXELES alrededor del cursor —el `aperture` de AutoCAD, 10 px de fábrica—,
  // que es lo único que funciona igual a cualquier zoom.
  let _aperturaPx = 10;
  const toleranciaOsnap = (punto: THREE.Vector3) =>
    Math.max(1e-4, _aperturaPx * metrosPorPixel(punto));
  (window as any).__hekatanAperturaPx = (n?: number) => {
    if (typeof n === "number" && n > 0) _aperturaPx = n;
    return _aperturaPx;
  };

  // expuestos para poder MEDIR el tamaño aparente desde fuera (cli/ctl_cursor_tamano.mjs).
  // El marcador va por referencia: buscarlo en la escena por `geometry.type` no vale,
  // el empaquetado deja las esferas como `BufferGeometry` y no se encuentra.
  (window as any).__hekatanUpdateSnapScale = updateSnapMarkerScale;
  (window as any).__hekatanSnapMarker = snapMarker;
  (window as any).__hekatanMetrosPorPixel = metrosPorPixel;
  // regular el tamaño del marcador sin recompilar: __hekatanSnapPx(2) lo hace más fino
  (window as any).__hekatanSnapPx = (n?: number) => {
    if (typeof n === "number" && n > 0) { _snapPx = n; updateSnapMarkerScale(); viewerRender(); }
    return _snapPx;
  };
  // Helper compartido: re-escala cada esfera de selección (cyan) según
  // su distancia individual a la cámara. Se invoca al orbitar/zoomear y
  // también justo después de refreshSelectionGroup().
  const updateSelectionPtScale = () => {
    if (selectionGroup.children.length === 0) return;
    selectionGroup.children.forEach((child) => {
      if (!(child as any).__isSelectionPt) return;
      const m = child as THREE.Mesh;
      // x1.8 respecto al marcador de hover: un nudo SELECCIONADO tiene que
      // cantar. Con el mismo tamano que el resto de marcadores quedaba un
      // punto de ~8 px que sobre las lineas blancas del modelo no se
      // distinguia de un nudo cualquiera.
      m.scale.setScalar(markerScreenScale(m.position) * 1.8);
    });
  };
  (window as any).__hekatanUpdateSelectionPtScale = updateSelectionPtScale;
  // Re-escalar cuando el usuario zoomea/orbita (OrbitControls emite "change")
  controls.addEventListener("change", () => {
    updateSnapMarkerScale();
    // hoverPtHL — el indicador amarillo de selección de nodo (hover) también
    // debe mantener tamaño constante en pantalla. Sin esto se ve enorme al
    // zoom in (la geometría es 0.02m world-space). Usar la función definida
    // arriba que también maneja cámara ortográfica.
    if (hoverPtHL.visible) updateHoverPtScale();
    // Mismo tratamiento para osnapMarker (Endpoint/Mid/Per/etc.) creado más
    // abajo. Lo referenciamos por window porque la closure todavía no lo tiene.
    // El glifo de referencia a objetos (Punto final / Medio / Perpendicular…): se
    // referencia por window porque se crea más abajo que este manejador.
    (window as any).__hekatanUpdateOsnapScale?.();
    // Esferas cyan de selección — mismo tratamiento.
    updateSelectionPtScale();
  });
  // API pública para mover el snap marker (útil para demos + debug)
  (window as any).__hekatanShowSnap = (x: number, y: number, z: number) => {
    snapMarker.position.set(x, y, z);
    snapMarker.visible = true;
    updateSnapMarkerScale();
    viewerRender();
  };
  (window as any).__hekatanHideSnap = () => {
    snapMarker.visible = false;
    viewerRender();
  };
  // Auto-update el snap marker cuando se mueve el mouse sobre el plano
  // Prioridad: OSNAP (Endpoint/Midpoint/etc.) > grid snap 2D
  // ADEMÁS: rubber band desde último punto al cursor + polar tracking
  rendererElm.addEventListener("pointermove", (event: PointerEvent) => {
    // Dónde está la cruz, en PÍXELES: es contra esto que se mide la mirilla de
    // las referencias (ver `consider` en computeOsnap).
    (window as any).__hekatanCursorPx = { x: event.clientX, y: event.clientY };
    const _camForRay = setPointerFromEvent(event);
    if (!_camForRay) return;
    raycaster.setFromCamera(pointer, _camForRay);
    _cadenaFuente = null;        // se rellena si la mirilla toca un borde o el perfil del IFC
    const hit = intersectWorkPlane();
    // Ocultar el preview de relleno si el rayo no toca el plano o cambió de tool.
    if ((!hit.length || (window as any).__hekatanCadState?.get?.()?.tool !== "fillarea") && fillPreview.visible) fillPreview.visible = false;
    if (hit.length) {
      const p = hit[0].point;
      // ── HOVER «Rellenar área»: resaltar la celda cerrada bajo el cursor ──
      {
        const toolNow = (window as any).__hekatanCadState?.get?.()?.tool;
        if (toolNow === "fillarea") {
          const cell = celdaCerradaBajoPunto([p.x, p.y, p.z]);
          if (cell) {
            const V = cell.map((id) => drawingObj.points.rawVal[id]);
            const pos: number[] = [];
            for (let i = 1; i < V.length - 1; i++) pos.push(V[0][0], V[0][1], V[0][2], V[i][0], V[i][1], V[i][2], V[i+1][0], V[i+1][1], V[i+1][2]);
            const g = fillPreview.geometry as THREE.BufferGeometry;
            g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.computeVertexNormals();
            fillPreview.visible = true;
          } else fillPreview.visible = false;
        } else if (fillPreview.visible) fillPreview.visible = false;
      }
      // ── ALT: «ahora no me enganches» ────────────────────────────────────
      // Idea tomada del cuaderno Napkin (picobloc), y es la que faltaba: ahora que
      // la mirilla va en píxeles y engancha bien, hace falta poder decirle que no.
      // Con ALT pulsado no hay referencia ni rejilla: el punto cae donde está el
      // cursor, en crudo. Es lo mismo que hace AutoCAD.
      const sinEnganche = event.altKey;
      let refEnganchado = false;   // la mirilla tomó la referencia IFC (sección, eje o cara)
      const osnapTol = toleranciaOsnap(p);
      const osnap = sinEnganche
        ? null
        : (window as any).__hekatanOsnapCompute?.(p.x, p.y, p.z, osnapTol,
                                                  { x: event.clientX, y: event.clientY });
      if (osnap) {
        showOsnap(osnap.type, osnap.x, osnap.y, osnap.z);
        snapMarker.position.set(osnap.x, osnap.y, osnap.z);
        snapMarker.visible = true;
        p.set(osnap.x, osnap.y, osnap.z);
        // El nombre de la referencia, junto al cursor: en AutoCAD sale «Punto
        // final», «Intersección»… y es lo que te dice a QUÉ te estás enganchando.
        mostrarEtiquetaOsnap(osnap.type, event.clientX, event.clientY);
      } else if (!sinEnganche && (_secPt = snapSeccionIfc(event.clientX, event.clientY))) {
        // Sobre el PERFIL DE SECCIÓN de la referencia (corte activo): el punto
        // está exactamente en el plano del corte, sobre la curva cortada.
        refEnganchado = true;
        p.copy(_secPt);
        showOsnap("ifcSec", p.x, p.y, p.z);
        mostrarEtiquetaOsnap("ifcSec", event.clientX, event.clientY);
        snapMarker.position.copy(p);
        snapMarker.visible = true;
      } else if (_refHit && !sinEnganche) {
        // Sobre la REFERENCIA IFC: el punto es el de la malla (cara o eje), sin
        // rejilla. Se rotula como una referencia más («Referencia IFC · eje»).
        refEnganchado = true;
        showOsnap(_refHit.tipo, p.x, p.y, p.z);
        mostrarEtiquetaOsnap(_refHit.tipo, event.clientX, event.clientY);
        snapMarker.position.copy(p);
        snapMarker.visible = true;
      } else {
        ocultarEtiquetaOsnap();
        hideOsnap();
        // Toggle global: si __hekatanSnapEnabled es false, NO snap a grid.
        // El cursor queda en la coordenada raw del raycaster.
        const snapEnabled = !sinEnganche && (window as any).__hekatanSnapEnabled !== false;
        // El paso del enganche = la separación de la rejilla que se VE (AutoCAD: la rejilla sigue
        // al snap). Con «Paso cursor» 0.5 y rejilla de 1 m el punto caía entre líneas.
        const snap = (window as any).__hekatanGridConfig?.minorStep || ((window as any).__hekatanSnap2D ?? 0.5);
        if (snapEnabled && snap > 0) {
          p.x = Math.round(p.x / snap) * snap;
          p.y = Math.round(p.y / snap) * snap;
          p.z = Math.round(p.z / snap) * snap;
        }
        snapMarker.position.copy(p);
        snapMarker.visible = true;
      }
      updateSnapMarkerScale();  // tamaño constante en pantalla
      // La LÍNEA entera del IFC bajo el cursor, iluminada (Revit: «elegir líneas»).
      // Con la herramienta ifcline el clic la copia; con las demás solo enseña.
      if (_cadenaFuente && !osnap && (refEnganchado || _refHit)) mostrarCadena(cadenaDesde(_cadenaFuente));
      else mostrarCadena(null);
      // ⚠️ El punto PREVISTO (el que el clic commitea sin recalcular) solo se
      // guardaba con una polilínea en curso (rama del elástico) o con «select».
      // El PRIMER clic de Nodo, Arco o Círculo no tenía previsto y el clic
      // volvía a lanzar el rayo en crudo: con la referencia IFC caía en la cara
      // del objeto, 0.9 m por detrás del perfil que la mirilla enseñaba (medido
      // en cli/_cap17_dbg.mjs). Se guarda SIEMPRE aquí; las ramas de abajo lo
      // sobrescriben con ORTO/polar/rastreo aplicados cuando toca.
      _puntoPrevisto = { p: p.clone(), x: event.clientX, y: event.clientY };
      // ── SELECT TOOL: hover highlight + click para seleccionar ──
      // Cuando el cursor está cerca de un nodo / segmento / aux line, lo
      // resalta en AMARILLO. Click selecciona en CYAN. Ctrl+Click multi.
      // Selección rápida sin tener que activar otra herramienta.
      const curTool = ((window as any).__hekatanCadState?.get?.() as any)?.tool ?? "select";
      if (curTool === "select" || !curTool) {
        const tol = ((window as any).__hekatanSnap2D ?? 0.5) * 1.5;
        // Prioridad: NODO > SEGMENTO > AUX. Más fácil seleccionar un punto.
        const ptIdx = findClosestPoint(p.x, p.y, p.z, tol);
        const found = findClosestPoly(p.x, p.y, p.z, tol);
        const auxIdx = findClosestAuxLine(p.x, p.y, p.z, tol);
        if (ptIdx >= 0) {
          const pt = drawingObj.points.rawVal[ptIdx];
          hoverPtHL.position.set(pt[0], pt[1], pt[2]);
          hoverPtHL.visible = true;
          updateHoverPtScale();  // tamaño constante en pantalla
          hoverHL.visible = false;
          hoverItem = { kind: "pt", a: ptIdx };
        } else if (found) {
          const allPts = drawingObj.points.rawVal;
          const poly = drawingObj.polylines!.rawVal[found.polyIdx];
          const a = allPts[poly[found.segIdx]], b = allPts[poly[found.segIdx+1]];
          hoverHL.geometry.setFromPoints([
            new THREE.Vector3(a[0], a[1], a[2]),
            new THREE.Vector3(b[0], b[1], b[2]),
          ]);
          hoverHL.visible = true;
          hoverPtHL.visible = false;
          // ¿Es un área? entonces seleccionar polilínea entera
          const isArea = drawingObj.areas?.rawVal?.includes(found.polyIdx) ?? false;
          hoverItem = isArea
            ? { kind: "poly", a: found.polyIdx }
            : { kind: "seg", a: found.polyIdx, b: found.segIdx };
        } else if (auxIdx >= 0) {
          const auxState = (window as any).__hekatanDrawingAuxLines;
          const ln = (auxState?.rawVal ?? [])[auxIdx];
          if (ln) {
            hoverHL.geometry.setFromPoints([
              new THREE.Vector3(ln[0], ln[1], ln[2]),
              new THREE.Vector3(ln[3], ln[4], ln[5]),
            ]);
            hoverHL.visible = true;
            hoverPtHL.visible = false;
            hoverItem = { kind: "aux", a: auxIdx };
          }
        } else {
          hoverHL.visible = false;
          hoverPtHL.visible = false;
          hoverItem = null;
        }
        coordReadout.style.left = event.clientX + "px";
        coordReadout.style.top = event.clientY + "px";
        coordReadout.style.display = "block";
        // ── COORDS DISPLAY: si el hover detectó un NODO existente, mostrar
        // las coords EXACTAS del nodo (no el raycast raw). El cursor visual
        // ya se snappeó al nodo (hoverPtHL en pt[0..2]), así que las coords
        // del readout deben coincidir con el snap visible. Antes mostraba
        // X=0.03 cuando el nodo estaba en X=0.00 — confuso.
        let coordPt = p;
        if (hoverItem?.kind === "pt") {
          const nodePt = drawingObj.points.rawVal[hoverItem.a];
          if (nodePt) {
            coordPt = new THREE.Vector3(nodePt[0], nodePt[1], nodePt[2]);
          }
        }
        const coords = `X=${coordPt.x.toFixed(2)} Y=${coordPt.y.toFixed(2)} Z=${coordPt.z.toFixed(2)}`;
        // la barra de estado de abajo (getCadStatusBar) lee de aquí
        (window as any).__hekatanCursorXYZ = [coordPt.x, coordPt.y, coordPt.z];
        if (hoverItem) {
          const labels: any = { pt: "nodo", seg: "segmento", poly: "área", aux: "línea aux" };
          coordReadout.textContent = `${coords}  ·  🖱 Click → ${labels[hoverItem.kind]}`;
        } else {
          coordReadout.textContent = coords;
        }
        // Sincronizar panel fijo de coords (siempre visible)
        const fixedReadout = document.getElementById("hk-coord-fixed");
        if (fixedReadout) fixedReadout.textContent = coords;
        _puntoPrevisto = { p: coordPt.clone(), x: event.clientX, y: event.clientY };
        rubberBand.visible = false;
        polarLines.visible = false;
        trackLine.visible = false;
        viewerRender();
        return;
      }
      if (curTool === "delete" || curTool === "trim" || curTool === "extend" || curTool === "offset") {
        const tol = ((window as any).__hekatanSnap2D ?? 0.5) * 1.5;
        // Buscar lo más cerca entre polilínea y aux line — gana el de menor dist
        const foundPoly = findClosestPoly(p.x, p.y, p.z, tol);
        const foundAuxIdx = findClosestAuxLine(p.x, p.y, p.z, tol);
        // Comparar distancias para elegir cuál resaltar
        let pickAux = false;
        if (foundAuxIdx >= 0) {
          if (!foundPoly) pickAux = true;
          else {
            // Recomputar dist del aux para comparar (cheap, 1 línea)
            const auxState = (window as any).__hekatanDrawingAuxLines;
            const lns: number[][] = auxState?.rawVal ?? auxState?.val ?? auxState ?? [];
            const ln = lns[foundAuxIdx];
            const dAux = distPointSeg(p.x, p.y, p.z, ln[0],ln[1],ln[2], ln[3],ln[4],ln[5]);
            if (dAux < foundPoly.dist) pickAux = true;
          }
        }
        if (pickAux) {
          hoveredAuxIndex = foundAuxIdx;
          hoveredPolyIndex = -1;
          hoveredSegIndex = -1;
          showDeleteAuxHover(foundAuxIdx);
        } else if (foundPoly) {
          hoveredPolyIndex = foundPoly.polyIdx;
          hoveredSegIndex = foundPoly.segIdx;
          hoveredAuxIndex = -1;
          showDeleteHover(foundPoly.polyIdx, foundPoly.segIdx);
        } else {
          hoveredPolyIndex = -1;
          hoveredSegIndex = -1;
          hoveredAuxIndex = -1;
          deleteHover.visible = false;
        }
        // Hide rubberband + polar in delete mode (no sentido)
        rubberBand.visible = false;
        polarLines.visible = false;
        trackLine.visible = false;
        hideRubberLabel();
        coordReadout.style.left = event.clientX + "px";
        coordReadout.style.top = event.clientY + "px";
        coordReadout.style.display = "block";
        const coordsDel = `X=${p.x.toFixed(2)} Y=${p.y.toFixed(2)} Z=${p.z.toFixed(2)}`;
        let hint = "";
        if (pickAux) {
          hint = `🗑 línea aux #${hoveredAuxIndex + 1}`;
        } else if (foundPoly) {
          const isArea = drawingObj.areas?.rawVal?.includes(foundPoly.polyIdx) ?? false;
          hint = isArea
            ? `🗑 área #${foundPoly.polyIdx + 1}`
            : `🗑 seg ${foundPoly.segIdx + 1} / poly #${foundPoly.polyIdx + 1}`;
        } else {
          hint = `🗑 acercá a línea/área`;
        }
        coordReadout.textContent = `${coordsDel}  ·  ${hint}`;
        // Sincronizar panel fijo
        const fixedReadoutDel = document.getElementById("hk-coord-fixed");
        if (fixedReadoutDel) fixedReadoutDel.textContent = coordsDel;
        viewerRender();
        return;
      } else {
        deleteHover.visible = false;
        hoveredPolyIndex = -1;
        hoveredAuxIndex = -1;
      }
      // ── COORD READOUT: texto al lado del cursor con X, Y, Z + ΔL si rubber band
      coordReadout.style.left = event.clientX + "px";
      coordReadout.style.top = event.clientY + "px";
      coordReadout.style.display = "block";
      // ── RUBBER BAND: línea desde el último punto de la polilínea actual
      // hasta el cursor. Solo visible si hay al menos 1 punto previo en la
      // polilínea activa. Da feedback constante "voy a dibujar desde aquí".
      const polys = drawingObj.polylines?.rawVal ?? [];
      const lastPoly = polys[polys.length - 1] ?? [];
      const allPts = drawingObj.points.rawVal ?? [];
      if (lastPoly.length > 0 && allPts[lastPoly[lastPoly.length - 1]]) {
        const lastIdx = lastPoly[lastPoly.length - 1];
        const lastPt = allPts[lastIdx];
        let effectiveLock = axisLock;
        _axisSnapPoint = null; // reset por frame
        // ⚠️ Si la mirilla YA enganchó un objeto (nudo, punto medio…), ese punto
        // manda: ni el eje auxiliar, ni ORTO, ni el polar, ni el rastreo lo
        // mueven. Es la regla de AutoCAD (la referencia a objetos tiene
        // prioridad sobre el rastreo polar). Sin esto, una cumbrera con 0.6° de
        // pendiente que acaba en un nudo existente salía horizontal: el polar
        // (±6°) la aplanaba DESPUÉS de que el osnap hubiera dado el nudo exacto.
        const enganchadoAObjeto = !!osnap || refEnganchado;
        // ── SNAP a EJES auxiliares en 3D (X/Y/Z desde el último punto) ──
        // Si el mouse pasa CERCA (en pantalla) de la LÍNEA de un eje, engancha
        // el punto al punto de ESE eje 3D más cercano al rayo de cámara. Permite
        // alinear al eje Z (vertical) aunque el plano de trabajo sea XY, y a X/Y
        // en cualquier vista. Tiene prioridad sobre ORTO/polar.
        if (!effectiveLock && !enganchadoAObjeto && (window as any).__hekatanAxisSnap !== false) {
          const rectAx = rendererElm.getBoundingClientRect();
          const mx = event.clientX, my = event.clientY;
          const Lax = (settings.gridSize?.rawVal ?? 10);
          const P0 = new THREE.Vector3(lastPt[0], lastPt[1], lastPt[2]);
          const axDirs: Array<["x" | "y" | "z", THREE.Vector3]> = [
            ["x", new THREE.Vector3(1, 0, 0)],
            ["y", new THREE.Vector3(0, 1, 0)],
            ["z", new THREE.Vector3(0, 0, 1)],
          ];
          const toScreenAx = (v: THREE.Vector3) => {
            const c = v.clone().project(_camForRay);
            return { x: (c.x * 0.5 + 0.5) * rectAx.width + rectAx.left,
                     y: (-c.y * 0.5 + 0.5) * rectAx.height + rectAx.top };
          };
          let bestAx: { axis: "x" | "y" | "z"; dpx: number; pt: THREE.Vector3 } | null = null;
          for (const [axis, u] of axDirs) {
            const aS = toScreenAx(P0.clone().addScaledVector(u, -Lax));
            const bS = toScreenAx(P0.clone().addScaledVector(u, Lax));
            const vx = bS.x - aS.x, vy = bS.y - aS.y, wx = mx - aS.x, wy = my - aS.y;
            const len2 = vx * vx + vy * vy || 1;
            let t = (wx * vx + wy * vy) / len2; t = Math.max(0, Math.min(1, t));
            const dpx = Math.hypot(mx - (aS.x + t * vx), my - (aS.y + t * vy));
            if (bestAx === null || dpx < bestAx.dpx) {
              // punto del eje más cercano al rayo de cámara (line-line closest)
              const ray = raycaster.ray;
              const w0 = P0.clone().sub(ray.origin);
              const b = u.dot(ray.direction), d_ = u.dot(w0), e = ray.direction.dot(w0);
              const denom = 1 - b * b;
              const s = Math.abs(denom) < 1e-6 ? -d_ : (b * e - d_) / denom;
              bestAx = { axis, dpx, pt: P0.clone().addScaledVector(u, s) };
            }
          }
          if (bestAx && bestAx.dpx <= 12) {   // ≤12 px del eje → engancha
            p.copy(bestAx.pt);
            effectiveLock = bestAx.axis;
            _axisSnapPoint = bestAx.pt.clone(); // el click commitea acá
          }
        }
        // ── ORTO mode (F8) ── auto-detecta el eje dominante si está activo.
        const orthoOn = !!(window as any).__hekatanOrthoMode;
        if (!effectiveLock && !enganchadoAObjeto && orthoOn) {
          // ── ORTO EN 3D: el eje se elige POR LA PANTALLA ────────────────────
          //
          // ⚠️ Antes se comparaban dx, dy y dz del punto, y ese punto sale del
          // rayo contra el PLANO DE TRABAJO: con el plano XY, dz vale siempre 0
          // y el eje Z no podía ganar NUNCA. Medido en el deploy el 17-sep-2026
          // en isométrica: arrastrando el ratón hacia arriba enganchaba «⊥ ORTO
          // Y». O sea que con el ratón no se podía subir en vertical sin
          // cambiar de plano de trabajo. Jorge: «quiero ver si se puede dibujar
          // en 3D sin usar planos de referencia, los siguientes serían ortho F8».
          //
          // Ahora se mira hacia dónde va el ratón EN PÍXELES y se compara con
          // los tres ejes del mundo proyectados a pantalla desde el último
          // punto: gana aquel cuya dirección en pantalla se parece más. Luego
          // el punto se calcula sobre la recta 3D de ese eje, por el punto más
          // cercano al rayo de la cámara — la misma cuenta que ya usa el
          // enganche a ejes de aquí arriba. Así el ORTO da X, Y **y Z** en
          // cualquier vista, que es lo que hace AutoCAD en isométrica.
          const rectO = rendererElm.getBoundingClientRect();
          const P0o = new THREE.Vector3(lastPt[0], lastPt[1], lastPt[2]);
          const aPantalla = (v: THREE.Vector3) => {
            const c = v.clone().project(_camForRay);
            return { x: (c.x * 0.5 + 0.5) * rectO.width + rectO.left,
                     y: (-c.y * 0.5 + 0.5) * rectO.height + rectO.top };
          };
          const oS = aPantalla(P0o);
          const mvx = event.clientX - oS.x, mvy = event.clientY - oS.y;
          const largo = Math.hypot(mvx, mvy);
          const ejes3D: Array<["x" | "y" | "z", THREE.Vector3]> = [
            ["x", new THREE.Vector3(1, 0, 0)],
            ["y", new THREE.Vector3(0, 1, 0)],
            ["z", new THREE.Vector3(0, 0, 1)],
          ];
          // Un eje casi paralelo a la vista sale como un punto en pantalla y no
          // se puede distinguir: se descarta en vez de dar un enganche falso.
          const esc = Math.max(1, (settings.gridSize?.rawVal ?? 10)) * 0.5;
          if (largo > 4) {
            let mejor: { axis: "x" | "y" | "z"; cos: number; u: THREE.Vector3 } | null = null;
            for (const [axis, u] of ejes3D) {
              const eS = aPantalla(P0o.clone().addScaledVector(u, esc));
              const ex = eS.x - oS.x, ey = eS.y - oS.y;
              const le = Math.hypot(ex, ey);
              if (le < 6) continue;                       // eje de punta a la cámara
              const cos = Math.abs((mvx * ex + mvy * ey) / (largo * le));
              if (!mejor || cos > mejor.cos) mejor = { axis, cos, u };
            }
            if (mejor) {
              effectiveLock = mejor.axis;
              // Punto de la recta 3D más cercano al rayo de la cámara.
              const ray = raycaster.ray;
              const w0 = P0o.clone().sub(ray.origin);
              const b = mejor.u.dot(ray.direction), d_ = mejor.u.dot(w0), e2 = ray.direction.dot(w0);
              const den = 1 - b * b;
              const s = Math.abs(den) < 1e-6 ? -d_ : (b * e2 - d_) / den;
              const q = P0o.clone().addScaledVector(mejor.u, s);
              if (isFinite(q.x) && isFinite(q.y) && isFinite(q.z)) {
                p.copy(q);
                _axisSnapPoint = q.clone();               // el clic confirma AQUÍ
              }
            }
          }
        }
        // ── POLAR TRACKING automático (estilo AutoCAD) ──
        // Si NO hay lock manual ni ORTO, pero el cursor está CERCA (dentro de
        // una tolerancia angular) de uno de los ejes X/Y/Z desde el último
        // punto → enganchar a ese eje. Eso lo RESALTA (la lógica de abajo lo
        // pinta) y hace que al clickear el punto caiga JUSTO sobre el eje.
        const polarOn = (window as any).__hekatanPolarTrack !== false; // default ON
        if (!effectiveLock && !enganchadoAObjeto && polarOn) {
          const dxr = p.x - lastPt[0], dyr = p.y - lastPt[1], dzr = p.z - lastPt[2];
          const len = Math.hypot(dxr, dyr, dzr);
          if (len > 1e-3) {
            const TOL_DEG = 6;                                  // ± grados de enganche
            const band = Math.tan(TOL_DEG * Math.PI / 180) * len; // banda perp. proporcional
            const perpX = Math.hypot(dyr, dzr);                 // dist al eje X
            const perpY = Math.hypot(dxr, dzr);                 // dist al eje Y
            const perpZ = Math.hypot(dxr, dyr);                 // dist al eje Z
            const cands: Array<["x" | "y" | "z", number]> = [["x", perpX], ["y", perpY], ["z", perpZ]];
            cands.sort((a, b) => a[1] - b[1]);
            if (cands[0][1] <= band) effectiveLock = cands[0][0]; // dentro de tolerancia → engancha
          }
        }
        if (effectiveLock) {
          // Proyección manual al eje (sin tocar axisLock global, así no
          // interfiere con direct distance entry que usa axisLock para signo).
          const ax = lastPt[0], ay = lastPt[1], az = lastPt[2];
          if (effectiveLock === "x") p.set(p.x, ay, az);
          else if (effectiveLock === "y") p.set(ax, p.y, az);
          else p.set(ax, ay, p.z);
          // ── Badge dinámico "⊥ ORTO X/Y/Z" o "🔒 LOCK X/Y/Z" ──
          // Confirmación visual junto al cursor de que está alineado al eje.
          // Diferencia manual (axisLock por tecla) vs auto (ORTO mode por F8).
          const isManual = !!axisLock;
          const colors = { x: "#ff3344", y: "#34d399", z: "#60a5fa" };
          const c = colors[effectiveLock];
          axisLockBadge.style.background = "rgba(15,23,42,0.92)";
          axisLockBadge.style.color = c;
          axisLockBadge.style.border = `1.5px solid ${c}`;
          // Detectar plano hover para incluir en el badge (más informativo)
          const hovObj = hit[0]?.object;
          let hovPlane: "xy" | "xz" | "yz" | null = null;
          if (hovObj === refFillXY) hovPlane = "xy";
          else if (hovObj === refFillXZ) hovPlane = "xz";
          else if (hovObj === refFillYZ) hovPlane = "yz";
          const planeText = hovPlane ? ` (plano ${hovPlane.toUpperCase()})` : "";
          axisLockBadge.textContent = isManual
            ? `🔒 LOCK ${effectiveLock.toUpperCase()}${planeText}`
            : `⊥ ORTO ${effectiveLock.toUpperCase()}${planeText}`;
          // Posicionar junto al cursor (offset abajo-derecha del coord readout)
          axisLockBadge.style.left = (event.clientX + 20) + "px";
          axisLockBadge.style.top = (event.clientY + 18) + "px";
          axisLockBadge.style.transform = "none";
          axisLockBadge.style.display = "block";
        } else {
          // Sin lock activo — ocultar badge (a menos que el global keydown
          // lo tenga activo manualmente; pero si llegamos acá axisLock=null).
          if (!axisLock) axisLockBadge.style.display = "none";
        }
        // ── RASTREO: alinearse con un nudo YA DIBUJADO ────────────────────
        // Se busca un nudo que comparta una coordenada con el cursor (dentro de la
        // mirilla, en píxeles). Si lo hay, esa coordenada se CLAVA en la del nudo y
        // sale la línea de rastreo hasta él, con su rótulo. Es lo que permite bajar
        // una columna y parar exactamente en la cota de la base de al lado.
        //
        // Si el ORTO/POLAR ya fijó un eje, el rastreo solo puede tocar el eje LIBRE
        // (el que queda por decidir); si no, cualquiera de los tres.
        let rastreo: { q: number[]; eje: "x" | "y" | "z" } | null = null;
        // El rastreo es una REFERENCIA más: lo apaga el mismo interruptor (F3).
        if (!sinEnganche && !enganchadoAObjeto && (window as any).__hekatanTrack !== false
            && (window as any).__hekatanOsnapOn !== false) {
          const ptsTrack = drawingObj.points.rawVal as [number, number, number][];
          const ejes: Array<"x" | "y" | "z"> = effectiveLock ? [effectiveLock] : ["z", "x", "y"];
          // en PÍXELES, como la mirilla: se mide cuánto se movería el punto en
          // pantalla al alinearlo con el nudo, no cuántos metros hay de diferencia
          const cursorPx = { x: event.clientX, y: event.clientY };
          let mejor = Infinity;
          for (const q of ptsTrack) {
            if (Math.abs(q[0] - lastPt[0]) < 1e-9 && Math.abs(q[1] - lastPt[1]) < 1e-9
                && Math.abs(q[2] - lastPt[2]) < 1e-9) continue;      // el propio origen del trazo
            for (const e of ejes) {
              const cand = new THREE.Vector3(
                e === "x" ? q[0] : p.x, e === "y" ? q[1] : p.y, e === "z" ? q[2] : p.z);
              const s2 = aPixeles(cand.x, cand.y, cand.z);
              if (!s2) continue;
              const d = Math.hypot(s2.x - cursorPx.x, s2.y - cursorPx.y);
              if (d < _aperturaPx && d < mejor) { mejor = d; rastreo = { q, eje: e }; }
            }
          }
        }
        if (rastreo) {
          if (rastreo.eje === "x") p.x = rastreo.q[0];
          else if (rastreo.eje === "y") p.y = rastreo.q[1];
          else p.z = rastreo.q[2];
          trackLine.geometry.setFromPoints([
            new THREE.Vector3(rastreo.q[0], rastreo.q[1], rastreo.q[2]),
            new THREE.Vector3(p.x, p.y, p.z),
          ]);
          (trackLine as any).computeLineDistances?.();
          trackLine.visible = true;
          snapMarker.position.set(p.x, p.y, p.z);
          snapMarker.visible = true;
          mostrarEtiquetaOsnap("track", event.clientX, event.clientY);
        } else {
          trackLine.visible = false;
        }
        _puntoPrevisto = { p: p.clone(), x: event.clientX, y: event.clientY };
        const dL = Math.hypot(p.x - lastPt[0], p.y - lastPt[1], p.z - lastPt[2]);
        const ang = Math.atan2(p.y - lastPt[1], p.x - lastPt[0]) * 180 / Math.PI;
        const coordsRb = `X=${p.x.toFixed(2)} Y=${p.y.toFixed(2)} Z=${p.z.toFixed(2)}`;
        // Entrada dinámica de AutoCAD (DYNMODE, «dimensional input»): mientras se
        // traza, la LONGITUD y el ÁNGULO del tramo van junto al cursor; la
        // coordenada queda detrás. (Jorge, 13-sep-2026: «al ir trazando se debe
        // ver el valor de medida en el hover, al lado de la línea, igual que AutoCAD».)
        const angN = ((ang % 360) + 360) % 360;
        coordReadout.textContent = `L = ${dL.toFixed(3)} m   ∠ ${angN.toFixed(1)}°   ·   ${coordsRb}`;
        const fr = document.getElementById("hk-coord-fixed");
        if (fr) fr.textContent = coordsRb;
        rubberBand.geometry.setFromPoints([
          new THREE.Vector3(lastPt[0], lastPt[1], lastPt[2]),
          new THREE.Vector3(p.x, p.y, p.z),
        ]);
        (rubberBand as any).computeLineDistances?.();
        rubberBand.visible = true;
        // Dim label en midpoint del rubber band (referencial mientras se dibuja)
        updateRubberLabel(lastPt[0], lastPt[1], lastPt[2], p.x, p.y, p.z);
        // ── Polar tracking — líneas X/Y/Z extendidas desde el último punto
        // hasta los bordes del modelo (longitud 5m por dirección, ajustable)
        // Tamaño configurable desde Tweakpane vía window.__hekatanOrthoExt.
      // Default 8m (cuadrado 16×16). Usuario puede agrandar/achicar con slider.
      const ext = (window as any).__hekatanOrthoExt ?? 8;
        // 3 planos de referencia ortogonales (XY/XZ/YZ) centrados en lastPt:
        // bordes (LineLoop) + fill (Mesh transparente). El fill permite
        // identificar visualmente sobre qué plano está cayendo el cursor.
        // El toggle window.__hekatanShowOrthoPlanes controla si se muestran
        // (botón Tweakpane "▦ Planos ref. ortogonales").
        const showOrtho = (window as any).__hekatanShowOrthoPlanes !== false;
        // Toggle del grupo entero (los hijos individualmente quedan visible=true
        // por construcción; el grupo padre orthoRefGroup es el switch real).
        orthoRefGroup.visible = showOrtho;
        if (!showOrtho) {
          setRefPlaneHover(null);
        }
        if (showOrtho) {
          updateRefPlaneRect(refPlaneXY, lastPt, "xy", ext);
          updateRefPlaneRect(refPlaneXZ, lastPt, "xz", ext);
          updateRefPlaneRect(refPlaneYZ, lastPt, "yz", ext);
          updateRefPlaneFill(refFillXY, lastPt, "xy", ext);
          updateRefPlaneFill(refFillXZ, lastPt, "xz", ext);
          updateRefPlaneFill(refFillYZ, lastPt, "yz", ext);
        }
        // Detectar sobre qué plano de referencia está el cursor (raycast).
        // El plano con la PRIMERA intersección es el que el rayo de cámara
        // cruza primero — el más cerca a la pantalla.
        const refHits = !showOrtho ? [] : raycaster.intersectObjects(
          [refFillXY, refFillXZ, refFillYZ], false,
        );
        let hoveredRefPlane: "xy" | "xz" | "yz" | null = null;
        if (refHits.length > 0) {
          const obj = refHits[0].object;
          if (obj === refFillXY) hoveredRefPlane = "xy";
          else if (obj === refFillXZ) hoveredRefPlane = "xz";
          else if (obj === refFillYZ) hoveredRefPlane = "yz";
        }
        setRefPlaneHover(hoveredRefPlane);
        // Posicionar badge cerca del cursor
        if (hoveredRefPlane) {
          refPlaneBadge.style.left = event.clientX + "px";
          refPlaneBadge.style.top = event.clientY + "px";
        }
        polarX.geometry.setFromPoints([
          new THREE.Vector3(lastPt[0] - ext, lastPt[1], lastPt[2]),
          new THREE.Vector3(lastPt[0] + ext, lastPt[1], lastPt[2]),
        ]);
        (polarX as any).computeLineDistances?.();
        polarY.geometry.setFromPoints([
          new THREE.Vector3(lastPt[0], lastPt[1] - ext, lastPt[2]),
          new THREE.Vector3(lastPt[0], lastPt[1] + ext, lastPt[2]),
        ]);
        (polarY as any).computeLineDistances?.();
        polarZ.geometry.setFromPoints([
          new THREE.Vector3(lastPt[0], lastPt[1], lastPt[2] - ext),
          new THREE.Vector3(lastPt[0], lastPt[1], lastPt[2] + ext),
        ]);
        (polarZ as any).computeLineDistances?.();
        polarLines.visible = true;
        // ── Resaltar la polar del eje al que se está proyectando ──
        // Si effectiveLock=x → polarX brillante (op 0.95), polarY/Z apagados
        // (op 0.12). Idem Y, Z. Sin lock → todos opacidad media (0.5).
        // Esto da feedback visual inequívoco: "estás dibujando en EL eje
        // resaltado" (el rubber band cae sobre esa misma línea proyectada).
        const polarMatX = polarX.material as THREE.LineDashedMaterial;
        const polarMatY = polarY.material as THREE.LineDashedMaterial;
        const polarMatZ = polarZ.material as THREE.LineDashedMaterial;
        // Como AutoCAD (foto 14-sep-2026): UN solo vector punteado, el del eje enganchado;
        // sin enganche no se dibuja ninguno (antes los 3 ejes de color cruzaban el punto).
        polarX.visible = effectiveLock === "x";
        polarY.visible = effectiveLock === "y";
        polarZ.visible = effectiveLock === "z";
        polarMatX.opacity = 0.95; polarMatY.opacity = 0.95; polarMatZ.opacity = 0.95;
      } else {
        // Sin punto previo: solo mostrar coords del cursor
        const coordsNop = `X=${p.x.toFixed(2)} Y=${p.y.toFixed(2)} Z=${p.z.toFixed(2)}`;
        coordReadout.textContent = coordsNop;
        const frNop = document.getElementById("hk-coord-fixed");
        if (frNop) frNop.textContent = coordsNop;
        rubberBand.visible = false;
        polarLines.visible = false;
        // ── INPUT PARA EL PRIMER PUNTO ──
        // Si hay un drawing tool activo (line, polyline, area, node, etc.)
        // y aún no se hizo el primer click, mostramos el rubberLabelInput
        // cerca del cursor pre-cargado con la coord snapped del cursor en
        // formato "X,Y,Z". Enter → commitAbsolutePoint con esa coord; o
        // tipear "5,3,2" → ese punto absoluto. Estilo AutoCAD: la primera
        // coordenada también puede ingresarse por teclado, no sólo click.
        const drawingTools = new Set([
          "line", "polyline", "area", "node",
          "column", "wall", "rect", "circle", "arc",
          "polyline-multi", "axis", "chaflan",
        ]);
        if (drawingTools.has(curTool)) {
          rubberStart = null;  // primer punto: no hay rubber start aún
          rubberDir = null;
          rubberLabelInput.style.left = (event.clientX + 20) + "px";
          rubberLabelInput.style.top = (event.clientY - 28) + "px";
          rubberLabelInput.style.display = "block";
          // Live update del placeholder con coords actuales (excepto si el
          // usuario está editando manualmente — preservamos su texto).
          if (!rubberUserEditing) {
            rubberLabelInput.value = `${p.x.toFixed(2)},${p.y.toFixed(2)},${p.z.toFixed(2)}`;
            // Auto-focus + select-all sólo si nadie más tiene focus
            const ae = document.activeElement;
            const isOtherInput = ae && (ae.tagName === "INPUT" || ae.tagName === "TEXTAREA")
                                  && ae !== rubberLabelInput;
            if (!isOtherInput && document.activeElement !== rubberLabelInput) {
              rubberLabelInput.focus({ preventScroll: true });
            }
            try { rubberLabelInput.select(); } catch {}
          }
        } else {
          hideRubberLabel();
        }
      }
      viewerRender();
    } else {
      hideOsnap();
      coordReadout.style.display = "none";
      snapMarker.visible = false;
      rubberBand.visible = false;
      polarLines.visible = false;
      hideRubberLabel();
      viewerRender();
    }
  });

  // Events
  // On gridTarget change, interpolate grid and update plane position and rotation
  van.derive(() => {
    if (!drawingObj.gridTarget) return;

    // ⚠️ El MISMO giro va a dos objetos que NO parten de la misma postura:
    //   · `plane` (el del raycaster) trae la geometría pre-girada rotX(π/2), así
    //     que con π/2 queda TUMBADO (planta) y con 0, de pie;
    //   · `gridObj` (la rejilla que se ve) tiene sus líneas ya en X-Y, o sea que
    //     con 0 está tumbada y con π/2 se pone DE PIE.
    // Se le pasaba el giro tal cual a los dos: el lienzo en blanco abría con la
    // rejilla de canto flotando mientras la barra decía «Plano XY». Se compone el
    // giro con la pre-rotación de la geometría para que los dos acaben igual.
    const qPlano = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(...drawingObj.gridTarget.val.rotation)
    );
    const qPreGeo = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(1, 0, 0), Math.PI / 2
    );
    interpolate(
      gridObj,
      {
        position: new THREE.Vector3(...drawingObj.gridTarget.val.position),
        quaternion: qPlano.clone().multiply(qPreGeo),
      },
      viewerRender
    );

    // ── LA REJILLA EN TODAS LAS ALTURAS ─────────────────────────────────────
    //
    // La rejilla era UNA y se movía con el plano de trabajo: al subir la cota a 21 m
    // para clicar la cubierta se subía con ella, y el edificio quedaba COLGANDO por
    // debajo. La rejilla del nivel 0 es el SUELO —la base, donde solo hay nudos de
    // apoyo— y no se puede ir.
    //
    // Ahora se dibuja una copia TENUE en cada nivel del modelo (las cotas distintas
    // de lo dibujado, el 0 siempre) y la del plano de trabajo se queda como está,
    // brillante. Es lo que enseñan ETABS y Revit: los planos de planta puestos, y
    // resaltado aquel en el que estás dibujando.
    redibujarGrillasNivel(drawingObj.gridTarget.val.position[2],
                          Math.abs(qPlano.x - Math.sin(Math.PI / 4)) < 1e-3, qPreGeo);

    plane.position.set(...drawingObj.gridTarget.val.position);
    plane.quaternion.setFromEuler(
      new THREE.Euler(...drawingObj.gridTarget.val.rotation)
    );
    plane.updateMatrixWorld(); // to fix intersect object
    // ¿El plano quedó INCLINADO (normal no axis-aligned)? Si sí, el raycast
    // usará solo este plano (ver intersectWorkPlane). Las orientaciones
    // ortogonales (XY/XZ/YZ) tienen la normal en ±X/±Y/±Z → NO inclinado.
    const nrm = new THREE.Vector3(0, 0, 1).applyEuler(
      new THREE.Euler(...drawingObj.gridTarget.val.rotation)
    );
    inclinedPlaneActive = !(Math.abs(nrm.x) > 0.999 || Math.abs(nrm.y) > 0.999 || Math.abs(nrm.z) > 0.999);
  });

  // Las copias de rejilla por cota, aparte: las llama el derive de arriba y
  // también quien AÑADE una grilla auxiliar (`__hekatanRefrescarGrillas`), que
  // no cambia el plano de trabajo y por tanto no dispara aquel derive.
  function redibujarGrillasNivel(wz: number, enPlanta: boolean, qPreGeo: THREE.Quaternion) {
    {
      for (const g of sueloGrids) { scene.remove(g); disposeSuelo(g); }
      sueloGrids.length = 0;
      if (enPlanta) {
        const P = (drawingObj.points?.rawVal ?? []) as [number, number, number][];
        const cotas = new Set<number>([0]);
        for (const p of P) cotas.add(+p[2].toFixed(3));
        // Las que PUSO el usuario se marcan aparte: una grilla que has pedido a mano
        // tiene que verse (es donde vas a dibujar), y las que salen solas de las cotas
        // del modelo son solo contexto.
        const pedidas = new Set<number>();
        for (const l of ((window as any).__hekatanLevels ?? []) as Array<{ z: number }>)
          if (isFinite(l?.z)) { cotas.add(+l.z.toFixed(3)); pedidas.add(+l.z.toFixed(3)); }
        const lista = [...cotas].sort((a, b) => a - b).slice(0, 24);
        for (const z of lista) {
          if (Math.abs(z - wz) < 1e-6) continue;          // esa la dibuja la de verdad
          const copia = gridObj.clone(true);
          copia.name = `hekatan-grid-nivel-${z}`;
          copia.traverse((o: any) => {
            if (!o.material) return;
            o.material = o.material.clone();
            o.material.transparent = true;
            // el suelo (0) se ve algo más que los pisos intermedios: es la base.
            // Una grilla auxiliar PEDIDA a mano se ve casi como la de trabajo.
            o.material.opacity = (o.material.opacity ?? 1) *
              (pedidas.has(z) ? 0.65 : Math.abs(z) < 1e-6 ? 0.5 : 0.22);
          });
          copia.position.set(0, 0, z);
          // ⚠️ IDENTIDAD, no la pre-rotación. La geometría de la rejilla ya viene con sus
          // líneas en X-Y: con giro cero está TUMBADA y con rotX(π/2) se pone DE PIE.
          // Aquí se le aplicaba `qPreGeo` (π/2) «para dejarla tumbada» —el comentario
          // decía una cosa y el código hacía la contraria—, así que todas las grillas
          // auxiliares salían VERTICALES. Medido: normal (0,−1,0) en las dos copias.
          copia.quaternion.identity();
          scene.add(copia);
          sueloGrids.push(copia);
        }
      }
    }
    // ── Y LOS PLANOS AUXILIARES VERTICALES (alzados a una distancia) ────────
    {
      const aux = ((window as any).__hekatanPlanosAux ?? []) as Array<{ plano: string; d: number }>;
      const wpAhora = (window as any).__hekatanCadState?.get?.()?.workPlane ?? "xy";
      const dAhora = (window as any).__hekatanCadState?.get?.()
        ?.[wpAhora === "xz" ? "workY" : wpAhora === "yz" ? "workX" : "workZ"] ?? 0;
      for (const g of aux.slice(0, 24)) {
        if (g.plano === "xy" || !isFinite(g.d)) continue;            // las de planta van arriba
        if (g.plano === wpAhora && Math.abs(g.d - dAhora) < 1e-6) continue;  // esa es la de trabajo
        const copia = gridObj.clone(true);
        copia.name = `hekatan-grid-${g.plano}-${g.d}`;
        copia.traverse((o: any) => {
          if (!o.material) return;
          o.material = o.material.clone();
          o.material.transparent = true;
          o.material.opacity = (o.material.opacity ?? 1) * 0.6;
        });
        // la geometría viene tumbada (pre-giro rotX π/2): para ponerla DE PIE en el
        // plano XZ se deshace ese giro, y para el YZ se gira además sobre Z.
        // Partiendo de TUMBADA (identidad, normal +Z):
        //   XZ (normal Y) → girar 90° sobre X   ·   YZ (normal X) → girar 90° sobre Y
        if (g.plano === "xz") {
          copia.quaternion.setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0));
          copia.position.set(0, g.d, 0);
        } else {
          copia.quaternion.setFromEuler(new THREE.Euler(0, Math.PI / 2, 0));
          copia.position.set(g.d, 0, 0);
        }
        scene.add(copia);
        sueloGrids.push(copia);
      }
    }
    viewerRender();
  }

  // Añadir una GRILLA AUXILIAR a la cota que se pida y dejarla puesta, como un
  // nivel de referencia de ETABS/Revit: no cambia el plano de trabajo, solo pone
  // dónde referenciarse. Devuelve las cotas que quedan con grilla.
  //
  // Vale para los TRES planos, no solo para la planta: en alzado la rejilla pasaba
  // por Y = 0 y no se podía llevar al pórtico que tocaba («cómo se coloca la grilla
  // auxiliar a cierta distancia», Jorge 16-sep). `plano` dice de cuál es y `d` a qué
  // distancia: xy → Z, xz → Y, yz → X. Pulsar con la misma distancia la quita.
  (window as any).__hekatanGrillaAux = (d: number, plano: "xy" | "xz" | "yz" = "xy") => {
    if (!isFinite(d)) return [];
    const W = window as any;
    W.__hekatanPushUndo?.();          // poner o quitar una grilla se deshace con Ctrl+Z
    const aux = (W.__hekatanPlanosAux ?? []) as Array<{ plano: string; d: number }>;
    const i = aux.findIndex((g) => g.plano === plano && Math.abs(g.d - d) < 1e-6);
    if (i >= 0) aux.splice(i, 1); else aux.push({ plano, d });
    W.__hekatanPlanosAux = aux;
    // Las de planta siguen además en `__hekatanLevels`, que es lo que miran los ejes
    // y niveles de Revit y el resto del programa.
    if (plano === "xy") {
      const niveles = (W.__hekatanLevels ?? []) as Array<{ label: string; z: number; tipo?: string }>;
      const j = niveles.findIndex((l) => Math.abs(l.z - d) < 1e-6 && l.tipo !== "piso");
      if (i >= 0) { if (j >= 0) niveles.splice(j, 1); }
      else if (j < 0) niveles.push({ label: `N${d >= 0 ? "+" : ""}${d.toFixed(2)}`, z: d, tipo: "aux" });
      W.__hekatanLevels = niveles;
    }
    W.__hekatanRefrescarGrillas?.();
    return aux;
  };
  (window as any).__hekatanQuitarGrillaAux = (z: number): number[] => {
    const niveles = ((window as any).__hekatanLevels ?? []) as Array<{ z: number; tipo?: string }>;
    const quedan = niveles.filter((l) => !(Math.abs(l.z - z) < 1e-6 && l.tipo !== "piso"));
    (window as any).__hekatanLevels = quedan;
    (window as any).__hekatanRefrescarGrillas?.();
    return quedan.map((l) => l.z);
  };
  // ── MOVER LA GRILLA CON EL CURSOR, COMO SE MUEVE UNA LÍNEA EN AUTOCAD ─────
  //
  // Jorge (16-sep-2026): «o con el teclado, así como el cursor: selecciono la grilla
  // y me desplaza, va a hacer paralelo perpendicularmente a una distancia que elija,
  // en un recuadro para colocar la distancia».
  //
  // Es el DESPLAZA de AutoCAD con entrada directa de distancia: la grilla se mueve
  // PARALELA A SÍ MISMA (solo en su normal: Z en planta, Y en alzado frontal, X en
  // el lateral), el recuadro junto al cursor dice cuánto llevas, y si tecleas un
  // número + Enter va exactamente a esa distancia.
  //
  // El cálculo no es «dónde corta el rayo» —el plano se mueve con él y no habría
  // solución—, sino el punto del EJE normal más cercano al rayo del cursor: la
  // distancia mínima entre dos rectas. Si el eje apunta casi a la cámara (mirando la
  // planta desde arriba) las dos rectas son paralelas y no hay nada que resolver: ahí
  // se avisa en vez de dar un salto sin sentido, igual que AutoCAD no deja mover en
  // la dirección de la vista.
  const cajaDist = document.createElement("input");
  cajaDist.id = "hk-grid-dist";
  cajaDist.type = "text"; cajaDist.spellcheck = false;
  cajaDist.title = "Distancia del plano. Teclea un número y Enter para colocarlo exacto; Esc cancela.";
  cajaDist.style.cssText = [
    "position:fixed", "z-index:99997", "pointer-events:none", "display:none",
    "padding:3px 8px", "background:rgba(15,23,42,.94)", "color:#22d3ee",
    "border:1.5px solid #22d3ee", "border-radius:4px", "width:104px", "text-align:center",
    "font:bold 13px Consolas,monospace", "transform:translate(14px,-28px)", "outline:none",
  ].join(";") + ";";
  document.body.appendChild(cajaDist);

  let moviendoGrilla = false;
  let distInicial = 0;
  let tecleado = "";
  const normalDe = (wp: string): THREE.Vector3 =>
    wp === "xz" ? new THREE.Vector3(0, 1, 0) : wp === "yz" ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 0, 1);
  const claveDe = (wp: string) => (wp === "xz" ? "workY" : wp === "yz" ? "workX" : "workZ");
  const planoActualW = () => String((window as any).__hekatanCadState?.get?.()?.workPlane ?? "xy");
  const distActual = () => Number((window as any).__hekatanCadState?.get?.()?.[claveDe(planoActualW())] ?? 0);
  const colocarPlano = (d: number) => {
    const wp = planoActualW();
    const st = (window as any).__hekatanCadState?.get?.();
    if (st) (st as any)[claveDe(wp)] = d;
    if (!drawingObj.gridTarget) return;
    const O = ((window as any).__hekatanSCU ?? [0, 0, 0]) as [number, number, number];
    drawingObj.gridTarget.val = wp === "xy" ? { position: [O[0], O[1], d], rotation: [Math.PI / 2, 0, 0] }
                             : wp === "xz" ? { position: [O[0], d, O[2]], rotation: [0, 0, 0] }
                             : { position: [d, O[1], O[2]], rotation: [0, 0, Math.PI / 2] };
  };
  /** Distancia sobre el eje normal del punto del eje más próximo al rayo del cursor. */
  const distanciaBajoCursor = (): number | null => {
    const n = normalDe(planoActualW());
    const ro = raycaster.ray.origin, rd = raycaster.ray.direction;
    const b = n.dot(rd);
    const den = 1 - b * b;                       // a·c − b² con a = c = 1 (unitarios)
    if (Math.abs(den) < 1e-4) return null;       // el eje apunta a la cámara
    const w0 = ro.clone().negate();              // origen del eje en (0,0,0)
    const d0 = n.dot(w0), e0 = rd.dot(w0);
    return (b * e0 - d0) / den;
  };
  const pintarCaja = (ev: { clientX: number; clientY: number } | null, d: number) => {
    if (ev) { cajaDist.style.left = ev.clientX + "px"; cajaDist.style.top = ev.clientY + "px"; }
    const L = planoActualW() === "xz" ? "Y" : planoActualW() === "yz" ? "X" : "Z";
    cajaDist.value = tecleado !== "" ? `${L} = ${tecleado}` : `${L} = ${d.toFixed(2)} m`;
    cajaDist.style.display = "block";
  };
  const terminarMover = (aplicar: boolean, d?: number) => {
    if (!moviendoGrilla) return;
    moviendoGrilla = false;
    (window as any).__hekatanMoviendoGrilla = false;
    cajaDist.style.display = "none";
    if (!aplicar) colocarPlano(distInicial);
    else if (typeof d === "number" && isFinite(d)) colocarPlano(d);
    tecleado = "";
    (window as any).__hekatanRefrescarGrillas?.();
    viewerRender();
  };
  (window as any).__hekatanMoverGrilla = (on = true) => {
    if (!on) return terminarMover(false);
    distInicial = distActual(); tecleado = "";
    moviendoGrilla = true;
    (window as any).__hekatanMoviendoGrilla = true;
    pintarCaja(null, distInicial);
    return true;
  };
  rendererElm.addEventListener("pointermove", (ev: PointerEvent) => {
    if (!moviendoGrilla) return;
    setPointerFromEvent(ev);
    const d = distanciaBajoCursor();
    if (d === null) { pintarCaja(ev, distActual()); return; }
    if (tecleado === "") colocarPlano(d);
    pintarCaja(ev, d);
  }, true);
  rendererElm.addEventListener("pointerdown", (ev: PointerEvent) => {
    if (!moviendoGrilla) return;
    ev.preventDefault(); ev.stopPropagation();
    terminarMover(true, tecleado !== "" ? parseFloat(tecleado) : distActual());
  }, true);
  window.addEventListener("keydown", (ev: KeyboardEvent) => {
    if (!moviendoGrilla) return;
    if (ev.key === "Escape") { ev.preventDefault(); return terminarMover(false); }
    if (ev.key === "Enter") {
      ev.preventDefault();
      return terminarMover(true, tecleado !== "" ? parseFloat(tecleado) : distActual());
    }
    if (ev.key === "Backspace") { ev.preventDefault(); tecleado = tecleado.slice(0, -1); pintarCaja(null, distActual()); return; }
    if (/^[0-9.\-]$/.test(ev.key)) {
      ev.preventDefault();
      tecleado += ev.key;
      const v = parseFloat(tecleado);
      if (isFinite(v)) colocarPlano(v);              // se ve ir al sitio mientras tecleas
      pintarCaja(null, isFinite(v) ? v : distActual());
    }
  }, true);

  // ── EL TRÍPODE DEL ORIGEN LOCAL ──────────────────────────────────────────
  // Se ve como en el dibujo de Jorge: los ejes pequeños en el punto elegido y una
  // línea de puntos hasta el origen global, para no perder de vista dónde estás.
  const grupoSCU = new THREE.Group();
  grupoSCU.name = "hekatan-scu";
  grupoSCU.visible = false;
  scene.add(grupoSCU);
  const construirSCU = (o: [number, number, number]) => {
    while (grupoSCU.children.length) {
      const c: any = grupoSCU.children.pop();
      c.geometry?.dispose?.(); c.material?.dispose?.(); c.dispose?.();
    }
    const L = Math.max(0.8, ((window as any).__hekatanGridConfig?.minorStep ?? 1) * 2);
    const O = new THREE.Vector3(...o);
    const ejes: Array<[THREE.Vector3, number]> = [
      [new THREE.Vector3(1, 0, 0), 0xff5b5b],
      [new THREE.Vector3(0, 1, 0), 0x5bff8a],
      [new THREE.Vector3(0, 0, 1), 0x6aa8ff],
    ];
    for (const [d, col] of ejes) grupoSCU.add(new THREE.ArrowHelper(d, O, L, col, L * 0.28, L * 0.16));
    // la línea de puntos hasta el origen global (el «dónde estoy» del dibujo)
    const g = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), O]);
    const m = new THREE.LineDashedMaterial({ color: 0x22d3ee, dashSize: 0.35, gapSize: 0.25, transparent: true, opacity: 0.8 });
    const ln = new THREE.Line(g, m); ln.computeLineDistances();
    grupoSCU.add(ln);
    grupoSCU.visible = true;
  };
  (window as any).__hekatanPonerSCU = (o: [number, number, number]) => {
    (window as any).__hekatanSCU = [o[0], o[1], o[2]];
    construirSCU(o);
    // la rejilla se centra en el origen nuevo: es el plano de trabajo de AHÍ
    (window as any).__hekatanRecentrarGrilla?.();
    viewerRender();
    return o;
  };
  (window as any).__hekatanQuitarSCU = () => {
    (window as any).__hekatanSCU = [0, 0, 0];
    grupoSCU.visible = false;
    (window as any).__hekatanRecentrarGrilla?.();
    viewerRender();
    return [0, 0, 0];
  };
  // Colocar el origen CON EL CURSOR: el siguiente clic manda (y el osnap engancha
  // a un nudo, a un cruce de rejilla o a un punto final, que es lo que se quiere).
  let colocandoSCU = false;
  (window as any).__hekatanElegirSCU = (on = true) => {
    colocandoSCU = on;
    (window as any).__hekatanColocandoSCU = on;
    return on;
  };
  rendererElm.addEventListener("pointerdown", (ev: PointerEvent) => {
    if (!colocandoSCU) return;
    ev.preventDefault(); ev.stopPropagation();
    colocandoSCU = false;
    (window as any).__hekatanColocandoSCU = false;
    // el punto que el visor ya calcula bajo el cursor, con su osnap
    const os = (window as any).__hekatanOsnapUltimo as { x: number; y: number; z: number } | null;
    if (os) { (window as any).__hekatanPonerSCU([os.x, os.y, os.z]); return; }
    setPointerFromEvent(ev);
    const inter = intersectWorkPlane();          // devuelve un ARRAY de intersecciones
    if (inter.length) {
      const q = inter[0].point;
      (window as any).__hekatanPonerSCU([q.x, q.y, q.z]);
    }
  }, true);

  // La rejilla se centra en el origen local, manteniendo la distancia del plano:
  // el plano de trabajo es «el suelo de AQUÍ», no el del origen global.
  (window as any).__hekatanRecentrarGrilla = () => {
    if (!drawingObj.gridTarget) return;
    const O = ((window as any).__hekatanSCU ?? [0, 0, 0]) as [number, number, number];
    const wp = String((window as any).__hekatanCadState?.get?.()?.workPlane ?? "xy");
    const st = (window as any).__hekatanCadState?.get?.();
    const d = Number(st?.[wp === "xz" ? "workY" : wp === "yz" ? "workX" : "workZ"] ?? 0);
    drawingObj.gridTarget.val =
      wp === "xy" ? { position: [O[0], O[1], d], rotation: [Math.PI / 2, 0, 0] }
    : wp === "xz" ? { position: [O[0], d, O[2]], rotation: [0, 0, 0] }
                  : { position: [d, O[1], O[2]], rotation: [0, 0, Math.PI / 2] };
  };

  // Quitar TODAS las grillas auxiliares de una vez. Sin esto había que acertar la cota
  // exacta de cada una para apagarlas una a una, y con «▦× replicar» salen tres o
  // cuatro de golpe: era poner y no poder recoger.
  (window as any).__hekatanLimpiarGrillasAux = (): number => {
    const W = window as any;
    const n = ((W.__hekatanPlanosAux ?? []) as any[]).length +
              ((W.__hekatanLevels ?? []) as any[]).filter((l) => l?.tipo !== "piso").length;
    if (!n) return 0;
    W.__hekatanPushUndo?.();
    const G = W.__hekatanPlanosAux; if (Array.isArray(G)) G.length = 0; else W.__hekatanPlanosAux = [];
    const L = W.__hekatanLevels;
    if (Array.isArray(L)) { const pisos = L.filter((l: any) => l?.tipo === "piso"); L.length = 0; L.push(...pisos); }
    W.__hekatanRefrescarGrillas?.();
    try { W.__hekatanRefreshLevels?.(); } catch {}
    return n;
  };

  (window as any).__hekatanRefrescarGrillas = () => {
    if (!drawingObj.gridTarget) return;
    const rot = drawingObj.gridTarget.rawVal.rotation;
    const qPlano = new THREE.Quaternion().setFromEuler(new THREE.Euler(...rot));
    const qPreGeo = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);
    redibujarGrillasNivel(drawingObj.gridTarget.rawVal.position[2],
                          Math.abs(qPlano.x - Math.sin(Math.PI / 4)) < 1e-3, qPreGeo);
  };

  // On points change, update points positions for intersections
  van.derive(() => {
    points.geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(drawingObj.points.val.flat(), 3)
    );
    points.geometry.computeBoundingSphere();
  });

  // On derivedDisplayScale update raycaster threshold (NO tocamos el size del
  // indicationPoint — ahora está en píxeles con sizeAttenuation:false y debe
  // quedar constante al zoom). El threshold sigue en world-units porque es
  // para el raycaster, no el render visual.
  van.derive(() => {
    const sizeWorld = 0.05 * gridSize * 0.5 * derivedDisplayScale.val;
    raycaster.params.Points.threshold = 0.4 * sizeWorld;
  });

  van.derive(() => {
    const allPoints = drawingObj.points.val ?? [];
    const polylines = drawingObj.polylines?.val ?? [];
    const lastPolyline = polylines.at(-1) ?? [];
  
    const posArray: number[] = [];
  
    for (const i of lastPolyline) {
      const [x, y, z] = allPoints[i];
      posArray.push(x, y, z);
    }
  
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(posArray, 3)
    );
  
    activePoints.geometry.dispose();
    activePoints.geometry = geometry;
  });

  // Pointer events
  let pointerdown = false;
  let pointerDownAndMovedCount = 0;

  // Compute pointerDownAndMovedCount (dragging)
  rendererElm.addEventListener("pointerdown", () => {
    pointerdown = true;
  });

  rendererElm.addEventListener("pointerup", () => {
    pointerdown = false;
  });

  rendererElm.addEventListener("pointermove", () => {
    if (pointerdown) pointerDownAndMovedCount++;
  });

  // ── WINDOW / CROSSING SELECTION estilo AutoCAD ──
  // En modo SELECT, drag con botón izquierdo dibuja un rectángulo en pantalla:
  //   • Izquierda → derecha = ventana (azul, sólido) → solo objetos COMPLETAMENTE
  //     dentro del rectángulo se seleccionan.
  //   • Derecha → izquierda = crossing (verde, dashed) → objetos parcialmente
  //     dentro o que CRUCEN el rectángulo se seleccionan.
  // Si no hay drag (mouseup sin movimiento) → click normal (lo maneja el otro
  // listener). El threshold es 8 píxeles para diferenciar click vs drag.
  const dragRect = document.createElement("div");
  dragRect.id = "hk-window-select";
  dragRect.style.cssText = [
    "position:fixed", "pointer-events:none", "z-index:99996",
    "display:none", "border:1.5px solid", "background:rgba(0,0,0,0)",
  ].join(";") + ";";
  document.body.appendChild(dragRect);
  let dragStart: { x: number; y: number } | null = null;
  let dragActive = false;

  // ── CLICK-CLICK RECT SELECT (AutoCAD puro) ──
  // Patrón alternativo al press-drag-release: el usuario hace click sin
  // mantener, mueve el cursor y vuelve a hacer click para definir la
  // esquina opuesta. Útil en mobile (touch sin drag) y para usuarios
  // de AutoCAD que prefieren ese flujo. Se activa SOLO cuando el primer
  // click cae en espacio vacío (sin hoverItem) y no hay multi-modifier.
  let ccAnchor: { x: number; y: number } | null = null;
  // Helper: pinta el preview del rect (usado por ambos modos)
  const paintDragRect = (
    x0: number, y0: number, x1: number, y1: number, isCrossing: boolean,
  ) => {
    if (isCrossing) {
      dragRect.style.borderColor = "#34d399";
      dragRect.style.borderStyle = "dashed";
      dragRect.style.background = "rgba(52, 211, 153, 0.10)";
    } else {
      dragRect.style.borderColor = "#22d3ee";
      dragRect.style.borderStyle = "solid";
      dragRect.style.background = "rgba(34, 211, 238, 0.10)";
    }
    dragRect.style.left = Math.min(x0, x1) + "px";
    dragRect.style.top = Math.min(y0, y1) + "px";
    dragRect.style.width = Math.abs(x1 - x0) + "px";
    dragRect.style.height = Math.abs(y1 - y0) + "px";
    dragRect.style.display = "block";
  };
  // Helper compartido: ejecuta la selección dado un par de esquinas en
  // pantalla. Lo usan AMBOS modos (drag-and-release y click-click).
  const finalizeRectSelection = (
    aX: number, aY: number, bX: number, bY: number, isMulti: boolean,
  ) => {
    const x0 = Math.min(aX, bX);
    const x1 = Math.max(aX, bX);
    const y0 = Math.min(aY, bY);
    const y1 = Math.max(aY, bY);
    const isCrossing = bX < aX;  // R→L = crossing
    const rect = rendererElm.getBoundingClientRect();
    const cam = getActiveCamera();
    cam.updateMatrixWorld();
    const projectToScreen = (p: number[]): { x: number; y: number } => {
      const v = new THREE.Vector3(p[0], p[1], p[2]);
      v.project(cam);
      return {
        x: rect.left + (v.x * 0.5 + 0.5) * rect.width,
        y: rect.top + (-v.y * 0.5 + 0.5) * rect.height,
      };
    };
    const inRect = (sp: { x: number; y: number }) =>
      sp.x >= x0 && sp.x <= x1 && sp.y >= y0 && sp.y <= y1;
    const segCrosses = (a: { x: number; y: number }, b: { x: number; y: number }) => {
      if (a.x < x0 && b.x < x0) return false;
      if (a.x > x1 && b.x > x1) return false;
      if (a.y < y0 && b.y < y0) return false;
      if (a.y > y1 && b.y > y1) return false;
      return true;
    };
    if (!isMulti) selection.clear();
    let added = 0;
    const pts = drawingObj.points?.rawVal ?? [];
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i]; if (!p) continue;
      if (inRect(projectToScreen(p))) { selection.add(`pt:${i}`); added++; }
    }
    // ── Regla estilo AutoCAD ──
    //   WINDOW (izq→der, azul):  selecciona SOLO si está COMPLETAMENTE dentro
    //                            (ambos extremos del segmento adentro).
    //   CROSSING (der→izq, verde): selecciona si TOCA el recuadro (un extremo
    //                            adentro o lo cruza).
    const segMatch = (sa: { x: number; y: number }, sb: { x: number; y: number }) =>
      isCrossing
        ? (inRect(sa) || inRect(sb) || segCrosses(sa, sb))
        : (inRect(sa) && inRect(sb));
    const polys = drawingObj.polylines?.rawVal ?? [];
    const areas = drawingObj.areas?.rawVal ?? [];
    for (let i = 0; i < polys.length; i++) {
      const poly = polys[i];
      const isArea = areas.includes(i);
      if (isArea) {
        // Window: TODOS los vértices del área adentro. Crossing: cualquier arista toca.
        let areaMatch: boolean;
        if (!isCrossing) {
          areaMatch = poly.every((idx) => { const p = pts[idx]; return !!p && inRect(projectToScreen(p)); });
        } else {
          areaMatch = false;
          for (let j = 0; j < poly.length - 1; j++) {
            const a = pts[poly[j]], b = pts[poly[j + 1]]; if (!a || !b) continue;
            if (segMatch(projectToScreen(a), projectToScreen(b))) { areaMatch = true; break; }
          }
        }
        if (areaMatch) { selection.add(`poly:${i}`); added++; }
      } else {
        for (let j = 0; j < poly.length - 1; j++) {
          const a = pts[poly[j]], b = pts[poly[j + 1]]; if (!a || !b) continue;
          if (segMatch(projectToScreen(a), projectToScreen(b))) { selection.add(`seg:${i}:${j}`); added++; }
        }
      }
    }
    const auxState = (window as any).__hekatanDrawingAuxLines;
    const aux: number[][] = auxState?.rawVal ?? [];
    for (let i = 0; i < aux.length; i++) {
      const ln = aux[i];
      if (!ln || ln.length !== 6) continue;
      const sa = projectToScreen([ln[0], ln[1], ln[2]]);
      const sb = projectToScreen([ln[3], ln[4], ln[5]]);
      if (segMatch(sa, sb)) { selection.add(`aux:${i}`); added++; }
    }
    refreshSelectionGroup();
    // Si la VENTANA (izq→der) no cogió nada, se dice por qué: no es que no
    // funcione, es que exige el objeto ENTERO dentro. Es la primera confusión de
    // cualquiera que venga de arrastrar sin mirar la dirección.
    updateStatus(
      added === 0 && !isCrossing
        ? "🔵 Window (izq→der) — 0: solo coge lo que quede ENTERO dentro. De DERECHA a IZQUIERDA (🟢 captura) coge todo lo que toque."
        : `${isCrossing ? "🟢 Crossing" : "🔵 Window"} — ${added} item(s) ${isMulti ? "agregados a" : "→"} selección (total ${selection.size})`,
    );
    dragRect.style.display = "none";
  };
  // API pública: cancela el modo click-click si está activo (Esc, cambio
  // de tool, otra acción).
  const cancelClickClick = () => {
    if (ccAnchor) {
      ccAnchor = null;
      dragRect.style.display = "none";
      updateStatus("Selección cancelada");
    }
  };
  (window as any).__hekatanCancelClickClickRect = cancelClickClick;
  // Cancelar con Escape
  window.addEventListener("keydown", (ev: KeyboardEvent) => {
    if (ev.key === "Escape" && ccAnchor) cancelClickClick();
  });

  // ── DELETE/BACKSPACE: borrar items seleccionados ──
  // Tecla Delete (o Backspace) elimina del modelo todos los items en
  // selection: pt:N (nodo), seg:P:S (segmento), poly:P (polilínea/área),
  // aux:N (línea auxiliar). Tras borrar:
  //   1. Limpia selection
  //   2. Refresca cyan group
  //   3. Trigger __hekatanRebuild() para que el FEM se reconstruya
  // Ignora si: hay un input enfocado (Tweakpane editing), o sin selección.
  const deleteSelectedItems = () => {
    if (selection.size === 0) return false;
    const ids = [...selection];
    const pts = drawingObj.points?.rawVal ?? [];
    const polys = drawingObj.polylines?.rawVal ?? [];
    const areas = drawingObj.areas?.rawVal ?? [];
    const auxState = (window as any).__hekatanDrawingAuxLines;
    const auxLines: number[][] = auxState?.rawVal ?? [];

    // Sets de índices a borrar
    const ptsToDelete = new Set<number>();
    const polysToDelete = new Set<number>();
    const segsToDelete = new Map<number, Set<number>>();  // polyIdx → Set<segIdx>
    const auxToDelete = new Set<number>();
    for (const id of ids) {
      const [kind, ...rest] = id.split(":");
      if (kind === "pt") ptsToDelete.add(+rest[0]);
      else if (kind === "poly") polysToDelete.add(+rest[0]);
      else if (kind === "seg") {
        const pIdx = +rest[0], sIdx = +rest[1];
        if (!segsToDelete.has(pIdx)) segsToDelete.set(pIdx, new Set());
        segsToDelete.get(pIdx)!.add(sIdx);
      } else if (kind === "aux") auxToDelete.add(+rest[0]);
    }

    let deletedCount = 0;

    // 1) Borrar polilíneas completas marcadas + propagar borrado a sus pts huérfanos
    let newPolys: number[][] = [];
    let newAreas: number[] = [];
    const polyIdxRemap = new Map<number, number>();
    for (let i = 0; i < polys.length; i++) {
      if (polysToDelete.has(i)) {
        deletedCount++;
        continue;  // skip
      }
      polyIdxRemap.set(i, newPolys.length);
      // Si tiene segs marcados para borrar, partir la polilínea
      const segDel = segsToDelete.get(i);
      if (segDel && segDel.size > 0) {
        // Reconstruir polilínea sin los segmentos borrados.
        // Cada segmento k es entre poly[k] y poly[k+1]. Si k está en segDel,
        // se "corta" la polilínea allí, generando posiblemente múltiples polilíneas.
        let cur: number[] = [];
        for (let k = 0; k < polys[i].length; k++) {
          cur.push(polys[i][k]);
          if (k < polys[i].length - 1 && segDel.has(k)) {
            // Cerrar fragmento actual
            if (cur.length >= 2) newPolys.push(cur);
            cur = [];  // empezar nuevo (sin el next pt — segmento borrado)
            deletedCount++;
          }
        }
        if (cur.length >= 2) newPolys.push(cur);
        else if (cur.length === 1) {
          // Pt huérfano: lo dejamos, queda un nodo sin segmentos
          newPolys.push(cur);
        }
      } else {
        newPolys.push([...polys[i]]);
      }
    }

    // 1b) Los PUNTOS de las polilíneas borradas que ya no usa nadie se van con ellas.
    //
    // ⚠️ El comentario del paso 1 decía «+ propagar borrado a sus pts huérfanos» y
    // NO se hacía: al borrar una polilínea quedaban todos sus puntos sueltos, que
    // siguen siendo NUDOS del modelo. Medido en el deploy el 17-sep-2026: borrar la
    // cercha entera («E» → TODO → Supr) dejaba 0 barras y los 22 nudos. Y eso no es
    // solo suciedad: el plano de trabajo del alzado se ANCLA en el último punto
    // dibujado (`puntoRef`), así que un punto fantasma lejano manda a dibujar a 100 m
    // de la estructura, que es por lo que no se podía dibujar una cercha con el ratón.
    //
    // Se borran SOLO los que venían de una polilínea borrada y no quedan en ninguna
    // otra: un nudo puesto a mano con la herramienta Nodo nunca estuvo en una de
    // ellas, así que no se lo lleva por delante.
    if (polysToDelete.size > 0) {
      const vivos = new Set<number>();
      for (const pl of newPolys) for (const n of pl) vivos.add(n);
      for (const i of polysToDelete) {
        for (const n of polys[i] ?? []) if (!vivos.has(n)) ptsToDelete.add(n);
      }
    }

    // 2) Borrar pts marcados + propagar a polylines (remover refs + cortar)
    if (ptsToDelete.size > 0) {
      // Filtrar pts y construir remap viejo→nuevo
      const newPts: [number, number, number][] = [];
      const ptRemap = new Map<number, number>();
      for (let i = 0; i < pts.length; i++) {
        if (ptsToDelete.has(i)) { deletedCount++; continue; }
        ptRemap.set(i, newPts.length);
        newPts.push([...pts[i]] as [number, number, number]);
      }
      // Recorrer polylines y reemplazar índices, cortando donde hay borrados
      const polysAfterPtDel: number[][] = [];
      for (const poly of newPolys) {
        let cur: number[] = [];
        for (const oldIdx of poly) {
          const newIdx = ptRemap.get(oldIdx);
          if (newIdx === undefined) {
            // pt borrado → cortar polilínea aquí
            if (cur.length >= 2) polysAfterPtDel.push(cur);
            cur = [];
          } else {
            cur.push(newIdx);
          }
        }
        if (cur.length >= 2) polysAfterPtDel.push(cur);
      }
      newPolys = polysAfterPtDel;
      drawingObj.points.val = newPts;
    }

    // 3) Filtrar y remapear areas
    for (const a of areas) {
      const newIdx = polyIdxRemap.get(a);
      if (newIdx !== undefined && newIdx < newPolys.length) newAreas.push(newIdx);
    }
    if (drawingObj.polylines) drawingObj.polylines.val = newPolys;
    if (drawingObj.areas) drawingObj.areas.val = newAreas;

    // 4) Borrar aux lines
    if (auxToDelete.size > 0 && auxState) {
      const newAux = auxLines.filter((_, i) => !auxToDelete.has(i));
      if ("val" in auxState) auxState.val = newAux;
      else (window as any).__hekatanDrawingAuxLines = newAux;
      deletedCount += auxToDelete.size;
    }

    // 5) Limpiar selection y refrescar
    selection.clear();
    refreshSelectionGroup();
    try { (window as any).__hekatanRebuild?.(); } catch {}
    updateStatus(`🗑 ${deletedCount} item(s) borrado(s)`);
    return true;
  };
  (window as any).__hekatanDeleteSelected = deleteSelectedItems;

  window.addEventListener("keydown", (ev: KeyboardEvent) => {
    if (ev.key !== "Delete" && ev.key !== "Backspace") return;
    const ae = document.activeElement as HTMLElement | null;
    const esBarra = !!ae && (ae.id === "hk3-cmd-input" || ae.id === "hk-dyn-input");
    // ⚠️ SI HAY ALGO DESIGNADO, Supr BORRA LO DESIGNADO. Y punto.
    //
    // Antes la barra de comandos solo dejaba pasar el Delete si estaba VACÍA, y
    // esa barra se autoenfoca siempre: bastaba con que hubiera quedado el texto
    // de una orden anterior para que Supr dejara de borrar, sin decir nada.
    // Medido en el deploy el 17-sep-2026 con 83 objetos designados: el pie decía
    // «SELECCIÓN 83 objetos · Supr borra», se pulsaba Supr y el modelo se
    // quedaba igual —126 nudos y 103 barras antes y después—, porque el foco
    // estaba en `hk3-cmd-input` con texto. Jorge: «trato de seleccionar un arco
    // y borrarlo y no se puede».
    //
    // Es además lo que hacen AutoCAD y ETABS: con objetos designados, Supr es
    // «borra los objetos». El texto que hubiera en la barra se limpia, que era
    // resto de otra orden. Solo se respeta la edición cuando el foco está en
    // OTRO campo (el panel de propiedades, un parámetro), donde Supr sí es
    // «borra caracteres».
    if (selection.size > 0) {
      if (ae && !esBarra && (ae.tagName === "INPUT" || ae.tagName === "TEXTAREA" || ae.isContentEditable)) {
        return;                                   // editando un campo de verdad
      }
      ev.preventDefault();
      if (esBarra) { (ae as HTMLInputElement).value = ""; }
      deleteSelectedItems();
      return;
    }
    // Sin nada designado, Supr es del texto: no se toca.
  });

  // ════════════════════════════════════════════════════════════════════
  // PROPERTIES PANE — Tweakpane real, auto-aparece al seleccionar
  // ════════════════════════════════════════════════════════════════════
  // Construido con la librería `tweakpane` (no DOM vanilla). Al cambiar
  // la selección se DESTRUYE el pane previo y se construye uno nuevo
  // con los folders relevantes según el tipo de items seleccionados:
  //   • Solo nodos      → DOFs apoyo + carga puntual + masa
  //   • Solo segmentos  → sección + material + releases I/J + dist load
  //   • Solo áreas/shells → tipo + espesor + material + carga superficial
  //   • Mixto           → mensaje (sin propiedades)
  // Las modificaciones disparan CustomEvent("hk:property-applied",
  // { detail: { kind, ids, prop, value } }) en window. El workspace
  // (main.ts) puede subscribirse para mutar states.nodeInputs/elementInputs.
  const propsContainer = document.createElement("div");
  propsContainer.id = "hk-properties-pane";
  // Posición persistida en localStorage entre sesiones
  const PROPS_POS_KEY = "hk-props-pane-pos";
  let savedPos: { left: number; top: number } | null = null;
  try {
    const raw = localStorage.getItem(PROPS_POS_KEY);
    if (raw) savedPos = JSON.parse(raw);
  } catch {}
  // ── El panel de propiedades va AL LADO, no en medio ───────────────────────
  //
  // Estaba en `left:50%; top:8px`, o sea centrado arriba: al seleccionar un
  // nudo se abria justo encima del ribbon Y del modelo. Y como es un panel
  // solido, el siguiente clic caia en el en vez de en el lienzo, asi que
  // despues de seleccionar una vez ya no se podia seleccionar nada mas —
  // parecia que la seleccion estaba rota y solo estaba tapada.
  //
  // Ahora arranca en el lateral izquierdo, por debajo de Settings. Sigue
  // siendo arrastrable y la posicion se guarda.
  propsContainer.style.cssText = [
    "position:fixed",
    savedPos ? `left:${savedPos.left}px` : "left:14px",
    // top 200 (debajo de la cinta) y no 452: a 720 px de alto el panel quedaba abajo
    // del todo con 160 px de alto, cortado (Tutorial 9, 13-sep-2026).
    savedPos ? `top:${savedPos.top}px` : "top:200px",
    "transform:none",
    "width:min(300px, calc(100vw - 32px))",
    "max-height:calc(100vh - 260px)",
    "overflow-y:auto",
    "z-index:201",
    "box-shadow:0 6px 24px rgba(0,0,0,0.45)",
    "border-radius:6px",
    "display:none",
  ].join(";") + ";";
  document.body.appendChild(propsContainer);

  // ── DRAG por el title bar (mismo patrón que el paneHost del workspace) ──
  // El handle es la barra de título Tweakpane (.tp-rotv_b). Como el Pane se
  // dispone y recrea en cada cambio de selección, re-attach al final de
  // updatePropsPane() llamando a setupPropsDrag().
  const setupPropsDrag = () => {
    const handle = propsContainer.querySelector(".tp-rotv_b") as HTMLElement | null;
    if (!handle || (handle as any).__hkDragWired) return;
    (handle as any).__hkDragWired = true;
    handle.style.cursor = "move";
    handle.style.userSelect = "none";

    let dragging = false;
    let startX = 0, startY = 0, origLeft = 0, origTop = 0;
    handle.addEventListener("mousedown", (e: MouseEvent) => {
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const r = propsContainer.getBoundingClientRect();
      origLeft = r.left;
      origTop = r.top;
      // Convertir transform-based positioning a left/top fijo para el drag
      propsContainer.style.transform = "none";
      propsContainer.style.left = `${origLeft}px`;
      propsContainer.style.top = `${origTop}px`;
      e.preventDefault();
    });
    window.addEventListener("mousemove", (e: MouseEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const newLeft = Math.max(0, Math.min(window.innerWidth - 80, origLeft + dx));
      const newTop = Math.max(0, Math.min(window.innerHeight - 40, origTop + dy));
      propsContainer.style.left = `${newLeft}px`;
      propsContainer.style.top = `${newTop}px`;
    });
    window.addEventListener("mouseup", () => {
      if (!dragging) return;
      dragging = false;
      try {
        localStorage.setItem(PROPS_POS_KEY, JSON.stringify({
          left: parseFloat(propsContainer.style.left),
          top: parseFloat(propsContainer.style.top),
        }));
      } catch {}
    });
  };

  // Almacén de estado mutable que Tweakpane usa para .addBinding(state, key)
  const propsState = {
    // ── Nodos (Joint en ETABS) ──
    // Restraints
    Ux: false, Uy: false, Uz: false, Rx: false, Ry: false, Rz: false,
    // Joint Loads
    Fx: 0, Fy: 0, Fz: 0, Mx: 0, My: 0, Mz: 0,
    // Springs (joint elastic) — kN/m, kN·m/rad
    Kx: 0, Ky: 0, Kz: 0, Krx: 0, Kry: 0, Krz: 0,
    // Additional Mass
    mass: 0,
    // Diaphragms
    diaphragm: "Ninguno",  // "Ninguno", "D1 (rigid)", "D2", "D3"...
    // ── Frames (segs) ──
    section: "W14x84", material_frame: "A572 Gr 50",
    // Property Modifiers (multipliers sobre A, Iz, Iy, J)
    A_mod: 1.0, Iz_mod: 1.0, Iy_mod: 1.0, J_mod: 1.0,
    // Insertion Point (cardinal point — 1..11 estilo ETABS)
    insertionPoint: "10 — Centroid",
    // Local Axes (rotación angular en grados sobre eje local-x)
    beta: 0,
    // Releases I/J
    relMxI: false, relMyI: false, relMzI: false,
    relMxJ: false, relMyJ: false, relMzJ: false,
    // Hinges (plastic — para nonlinear pushover)
    hinges: "None",  // "None", "Auto-FEMA M3", "Auto-FEMA P-M2-M3", ...
    // Line Springs (kN/m por metro de longitud — Winkler tipo)
    LKx: 0, LKy: 0, LKz: 0,
    // Carga distribuida (kN/m)
    qx: 0, qy: 0, qz: 0,
    // Additional Mass (kg/m)
    massPerM: 0,
    // ── Áreas / shells ──
    shellType: "Mindlin (FSDT)", thickness: 0.20,
    material_shell: "Concreto C25", surfLoad: 0,
  };
  // Estado de la categoría EDITAR (replicar / mover la selección).
  const editState = { dx: 0, dy: 0, dz: 3, copias: 1 };
  let propsPaneInstance: Pane | null = null;

  const fireProp = (kind: string, ids: string[], prop: string, value: any) => {
    window.dispatchEvent(new CustomEvent("hk:property-applied", {
      detail: { kind, ids, prop, value },
    }));
  };

  const updatePropsPane = () => {
    // Destruir el Pane anterior (importante para no acumular)
    if (propsPaneInstance) {
      propsPaneInstance.dispose();
      propsPaneInstance = null;
    }
    if (selection.size === 0) {
      propsContainer.style.display = "none";
      return;
    }
    // Clasificar selección
    const ids = [...selection];
    const nodeIds = ids.filter(id => id.startsWith("pt:"));
    // Las casillas enseñan lo que el nudo YA tiene (apoyo y carga), no los valores por
    // defecto: un apoyo recién puesto con «Apoyo» salía con las seis casillas vacías y
    // parecía sin restringir (Tutorial 9, 13-sep-2026).
    if (nodeIds.length === 1) {
      const iNd = +nodeIds[0].slice(3);
      const supM = (window as any).__hekatanManualSupports as Map<number, boolean[]> | undefined;
      const s6 = supM?.get(iNd); if (s6) [propsState.Ux, propsState.Uy, propsState.Uz, propsState.Rx, propsState.Ry, propsState.Rz] = s6.map(Boolean) as [boolean, boolean, boolean, boolean, boolean, boolean];
      else { propsState.Ux = propsState.Uy = propsState.Uz = propsState.Rx = propsState.Ry = propsState.Rz = false; }
      const ldM = (window as any).__hekatanManualLoads as Map<number, number[]> | undefined;
      const l6 = ldM?.get(iNd); if (l6) [propsState.Fx, propsState.Fy, propsState.Fz, propsState.Mx, propsState.My, propsState.Mz] = l6 as [number, number, number, number, number, number];
      else { propsState.Fx = propsState.Fy = propsState.Fz = propsState.Mx = propsState.My = propsState.Mz = 0; }
    }
    const segIds = ids.filter(id => id.startsWith("seg:"));
    const polyIds = ids.filter(id => id.startsWith("poly:"));
    const auxIds = ids.filter(id => id.startsWith("aux:"));

    // NOTA: antes el panel era excluyente (onlyNodes / onlySegs / onlyPolys /
    // isMixed) y una selección mixta (ej. nodos + segmentos) no mostraba NADA
    // editable. Ahora cada TIPO presente en la selección muestra su propia
    // sección con su botón "Aplicar" que opera SOLO sobre su subconjunto de
    // ids. Así podés seleccionar nodos + frames juntos y asignar restricciones
    // a los nodos y secciones a los frames sin deseleccionar.
    const hasNodes = nodeIds.length > 0;
    const hasSegs = segIds.length > 0;
    const hasPolys = polyIds.length > 0;
    const noneEditable = !hasNodes && !hasSegs && !hasPolys; // solo aux / vacío

    // Título: resumen por tipo
    const parts: string[] = [];
    if (nodeIds.length) parts.push(`🔵 ${nodeIds.length} nodo(s)`);
    if (segIds.length) parts.push(`📏 ${segIds.length} segmento(s)`);
    if (polyIds.length) parts.push(`▭ ${polyIds.length} área(s)`);
    if (auxIds.length) parts.push(`┊ ${auxIds.length} aux`);
    const title = `🎯 ${selection.size} item(s) — ${parts.join(", ")}`;

    propsPaneInstance = new Pane({ container: propsContainer, title });

    // ── CATEGORÍA "✏️ Editar" (Replicar / Mover) ──
    // Arriba del todo, como segunda categoría junto a "Asignar" (Restraints/
    // Loads/Section). Colapsada por defecto para no estorbar. Permite REPLICAR
    // la estructura seleccionada (dx,dy,dz × copias) y togglear el snap.
    {
      const fEdit = propsPaneInstance.addFolder({ title: "✏️ Editar — Replicar / Mover", expanded: false });
      fEdit.addBinding(editState, "dx", { label: "Δx (m)", step: 0.1 });
      fEdit.addBinding(editState, "dy", { label: "Δy (m)", step: 0.1 });
      fEdit.addBinding(editState, "dz", { label: "Δz (m)", step: 0.1 });
      fEdit.addBinding(editState, "copias", { label: "Copias", min: 1, max: 50, step: 1 });
      fEdit.addButton({ title: "⧉ Replicar selección" }).on("click", () => {
        const n = (window as any).__hekatanReplicateSelection?.(editState.dx, editState.dy, editState.dz, editState.copias);
        updateStatus(n ? `⧉ Replicado ×${n} (Δ ${editState.dx},${editState.dy},${editState.dz} m)` : "⚠ Nada que replicar — seleccioná nodos/frames/áreas");
      });
      fEdit.addButton({ title: "⇗ Extruir: nudo → línea, línea → área" }).on("click", () => {
        const r = (window as any).__hekatanExtrudeSelection?.(editState.dx, editState.dy, editState.dz, editState.copias);
        updateStatus(r && (r.lineas || r.areas)
          ? `⇗ Extruido: ${r.lineas} barra(s), ${r.areas} paño(s) (Δ ${editState.dx},${editState.dy},${editState.dz} m × ${editState.copias})`
          : "⚠ Nada que extruir — designá nudos (→ líneas) o barras (→ áreas)");
      });
      // ── Volado sobre la viga designada ──
      // Una viga de 5 m + «vuelo 1.5» = un voladizo de 1.5 m de vuelo por 5 m de ancho.
      // No alarga la viga: la replica en perpendicular y cose las dos.
      const voladoState = { vuelo: 1.5, losa: true, borde: true, ambos: true };
      const fVol = fEdit.addFolder({ title: "⌐ Volado sobre la viga designada", expanded: false });
      fVol.addBinding(voladoState, "vuelo", { label: "vuelo (m)", min: 0.1, max: 6, step: 0.05 });
      fVol.addBinding(voladoState, "losa", { label: "con paño de losa (si no, hueca)" });
      fVol.addBinding(voladoState, "borde", { label: "con viga de borde" });
      fVol.addBinding(voladoState, "ambos", { label: "a los dos lados" });
      fVol.addButton({ title: "⌐ Poner volado (VOL)" }).on("click", () => {
        const n = (window as any).__hekatanVoladoSelection?.(voladoState.vuelo, {
          losa: voladoState.losa, vigaBorde: voladoState.borde,
          lados: voladoState.ambos ? "ambos" : "afuera",
        });
        updateStatus(n ? `⌐ Volado de ${voladoState.vuelo} m en ${n} paño(s)` +
                          (voladoState.losa ? " con losa" : " hueco")
                       : "⚠ Designá una VIGA (un segmento) y volvé a pulsar");
      });
      fEdit.addButton({ title: "→ Mover selección (1 copia, sin duplicar geometría base)" }).on("click", () => {
        // Mover = replicar 1 y borrar original sería complejo; por ahora replica.
        const n = (window as any).__hekatanReplicateSelection?.(editState.dx, editState.dy, editState.dz, 1);
        updateStatus(n ? `→ Copia desplazada Δ ${editState.dx},${editState.dy},${editState.dz} m` : "⚠ Nada seleccionado");
      });
      const fSnap = fEdit.addFolder({ title: "🧲 Snap", expanded: false });
      fSnap.addButton({ title: "Snap a grilla ON/OFF (F9)" }).on("click", () => (window as any).__hekatanToggleSnap?.());
      fSnap.addButton({ title: "OSNAP (endpoints/medios) ON/OFF" }).on("click", () => {
        (window as any).__hekatanOsnapOn = !((window as any).__hekatanOsnapOn ?? true);
        updateStatus(`🧲 OSNAP ${(window as any).__hekatanOsnapOn ? "ON" : "OFF"}`);
      });
    }

    if (hasNodes) {
      // ── Joint > Restraints (Apoyos) ──
      const fApoyo = propsPaneInstance.addFolder({ title: `📌 Restraints (DOFs) — ${nodeIds.length} nodo(s)` });
      fApoyo.addBinding(propsState, "Ux");
      fApoyo.addBinding(propsState, "Uy");
      fApoyo.addBinding(propsState, "Uz");
      fApoyo.addBinding(propsState, "Rx");
      fApoyo.addBinding(propsState, "Ry");
      fApoyo.addBinding(propsState, "Rz");
      // Un clic en vez de seis casillas + Aplicar (Jorge, 13-sep-2026: «a la cúpula
      // abajo agrégale restricciones, aunque sea»): empotrar o articular la selección.
      const apoyoRapido = (dofs: boolean[], nombre: string) => {
        [propsState.Ux, propsState.Uy, propsState.Uz, propsState.Rx, propsState.Ry, propsState.Rz] = dofs as [boolean, boolean, boolean, boolean, boolean, boolean];
        try { propsPaneInstance.refresh(); } catch {}
        fireProp("nodes", nodeIds, "supports", dofs);
        updateStatus(`✓ ${nombre}: ${nodeIds.length} nudo(s) apoyado(s) (${dofs.map((d, i) => d ? ["Ux", "Uy", "Uz", "Rx", "Ry", "Rz"][i] : "").filter(Boolean).join(" ")}).`);
      };
      fApoyo.addButton({ title: `▲ Empotrar los ${nodeIds.length} nudo(s) (6 GDL)` }).on("click", () => apoyoRapido([true, true, true, true, true, true], "Empotrado"));
      fApoyo.addButton({ title: `△ Articular los ${nodeIds.length} nudo(s) (Ux Uy Uz)` }).on("click", () => apoyoRapido([true, true, true, false, false, false], "Articulado"));

      // ── Joint > Springs (Resortes elásticos) ──
      const fSprings = propsPaneInstance.addFolder({ title: "🌀 Springs (kN/m, kN·m/rad)", expanded: false });
      fSprings.addBinding(propsState, "Kx", { label: "Kx", min: 0, step: 100 });
      fSprings.addBinding(propsState, "Ky", { label: "Ky", min: 0, step: 100 });
      fSprings.addBinding(propsState, "Kz", { label: "Kz", min: 0, step: 100 });
      fSprings.addBinding(propsState, "Krx", { label: "Krx", min: 0, step: 1000 });
      fSprings.addBinding(propsState, "Kry", { label: "Kry", min: 0, step: 1000 });
      fSprings.addBinding(propsState, "Krz", { label: "Krz", min: 0, step: 1000 });

      // ── Joint Loads (Carga puntual) ──
      const fCarga = propsPaneInstance.addFolder({ title: "⬇ Joint Loads (kN, kN·m)" });
      fCarga.addBinding(propsState, "Fx", { step: 0.1 });
      fCarga.addBinding(propsState, "Fy", { step: 0.1 });
      fCarga.addBinding(propsState, "Fz", { step: 0.1 });
      fCarga.addBinding(propsState, "Mx", { step: 0.1 });
      fCarga.addBinding(propsState, "My", { step: 0.1 });
      fCarga.addBinding(propsState, "Mz", { step: 0.1 });

      // ── Joint > Additional Mass ──
      const fMasa = propsPaneInstance.addFolder({ title: "⚖ Additional Mass (kg)", expanded: false });
      fMasa.addBinding(propsState, "mass", { label: "m", min: 0, step: 1 });

      // ── Joint > Diaphragms (rigid floor) ──
      const fDiaph = propsPaneInstance.addFolder({ title: "🔗 Diaphragm (rigid link)", expanded: false });
      fDiaph.addBinding(propsState, "diaphragm", {
        label: "Diafragma",
        options: {
          "Ninguno": "Ninguno",
          "D1 (rigid)": "D1 (rigid)",
          "D2 (rigid)": "D2 (rigid)",
          "D3 (rigid)": "D3 (rigid)",
        },
      });

      propsPaneInstance.addButton({ title: `✓ Aplicar a ${nodeIds.length} nodo(s) seleccionado(s)` }).on("click", () => {
        let applied = 0;
        const dofs = [propsState.Ux, propsState.Uy, propsState.Uz,
                      propsState.Rx, propsState.Ry, propsState.Rz];
        if (dofs.some(d => d)) { fireProp("nodes", nodeIds, "supports", dofs); applied++; }

        const loads = [propsState.Fx, propsState.Fy, propsState.Fz,
                       propsState.Mx, propsState.My, propsState.Mz];
        if (loads.some(v => v !== 0)) { fireProp("nodes", nodeIds, "loads", loads); applied++; }

        const springs = [propsState.Kx, propsState.Ky, propsState.Kz,
                         propsState.Krx, propsState.Kry, propsState.Krz];
        if (springs.some(k => k !== 0)) { fireProp("nodes", nodeIds, "springs", springs); applied++; }

        if (propsState.mass !== 0) { fireProp("nodes", nodeIds, "mass", propsState.mass); applied++; }

        if (propsState.diaphragm !== "Ninguno") {
          fireProp("nodes", nodeIds, "diaphragm", propsState.diaphragm); applied++;
        }

        if (applied === 0) {
          // Nada marcado → avisar fuerte en vez de mentir con "aplicadas".
          updateStatus("⚠ Nada que aplicar — marcá un DOF (Ux…Rz) para apoyo, o un valor de carga/resorte/masa, y volvé a aplicar.");
          let toast = document.getElementById("hk-prop-toast");
          if (!toast) {
            toast = document.createElement("div");
            toast.id = "hk-prop-toast";
            toast.style.cssText = "position:fixed;bottom:60px;left:50%;transform:translateX(-50%);z-index:99999;padding:9px 20px;border-radius:8px;font:600 14px system-ui;color:#fff;pointer-events:none;transition:opacity .25s;box-shadow:0 4px 16px rgba(0,0,0,.4)";
            document.body.appendChild(toast);
          }
          toast.textContent = "⚠ Nada que aplicar — marcá un DOF (Ux…Rz) para empotrado/articulado, después Aplicar";
          toast.style.background = "rgba(217,119,6,0.97)";
          toast.style.opacity = "1";
          clearTimeout((window as any).__hekatanPropToastT);
          (window as any).__hekatanPropToastT = setTimeout(() => { if (toast) toast.style.opacity = "0"; }, 3200);
        } else {
          updateStatus(`✓ Propiedades aplicadas a ${nodeIds.length} nodo(s)`);
        }
      });
    }
    if (hasSegs) {
      const fSec = propsPaneInstance.addFolder({ title: `📏 Sección frame — ${segIds.length} seg(s)` });
      fSec.addBinding(propsState, "section", {
        label: "Sección",
        options: {
          "W14x84": "W14x84", "W18x86": "W18x86", "W24x146": "W24x146",
          "HEB300": "HEB300", "IPN300": "IPN300", "IPE400": "IPE400",
          "Custom...": "Custom...",
        },
      });
      fSec.addBinding(propsState, "material_frame", {
        label: "Material",
        options: {
          "A572 Gr 50": "A572 Gr 50", "A36": "A36",
          "A992": "A992", "Concreto C25": "Concreto C25",
        },
      });

      // ── Frame > Property Modifiers (multipliers sobre rigidez) ──
      const fMods = propsPaneInstance.addFolder({ title: "🔧 Property Modifiers", expanded: false });
      fMods.addBinding(propsState, "A_mod", { label: "A mod", min: 0, max: 10, step: 0.1 });
      fMods.addBinding(propsState, "Iz_mod", { label: "Iz mod (fuerte)", min: 0, max: 10, step: 0.1 });
      fMods.addBinding(propsState, "Iy_mod", { label: "Iy mod (débil)", min: 0, max: 10, step: 0.1 });
      fMods.addBinding(propsState, "J_mod", { label: "J mod", min: 0, max: 10, step: 0.1 });

      // ── Frame > Insertion Point (Cardinal Point estilo ETABS) ──
      const fInsert = propsPaneInstance.addFolder({ title: "🎯 Insertion Point", expanded: false });
      fInsert.addBinding(propsState, "insertionPoint", {
        label: "Cardinal",
        options: {
          "1 — Bottom Left":   "1 — Bottom Left",
          "2 — Bottom Center": "2 — Bottom Center",
          "3 — Bottom Right":  "3 — Bottom Right",
          "4 — Middle Left":   "4 — Middle Left",
          "5 — Middle Center": "5 — Middle Center",
          "6 — Middle Right":  "6 — Middle Right",
          "7 — Top Left":      "7 — Top Left",
          "8 — Top Center":    "8 — Top Center",
          "9 — Top Right":     "9 — Top Right",
          "10 — Centroid":     "10 — Centroid",
          "11 — Shear Center": "11 — Shear Center",
        },
      });

      // ── Frame > Local Axes (rotación β) ──
      const fAxes = propsPaneInstance.addFolder({ title: "🧭 Local Axes", expanded: false });
      fAxes.addBinding(propsState, "beta", { label: "β (°)", min: -180, max: 180, step: 5 });

      // ── Frame > Releases I ──
      const fRelI = propsPaneInstance.addFolder({ title: "🔓 Releases extremo I", expanded: false });
      fRelI.addBinding(propsState, "relMxI", { label: "Mx I" });
      fRelI.addBinding(propsState, "relMyI", { label: "My I" });
      fRelI.addBinding(propsState, "relMzI", { label: "Mz I" });

      // ── Frame > Releases J ──
      const fRelJ = propsPaneInstance.addFolder({ title: "🔓 Releases extremo J", expanded: false });
      fRelJ.addBinding(propsState, "relMxJ", { label: "Mx J" });
      fRelJ.addBinding(propsState, "relMyJ", { label: "My J" });
      fRelJ.addBinding(propsState, "relMzJ", { label: "Mz J" });

      // ── Frame > Hinges (plastic, para nonlinear pushover) ──
      const fHinges = propsPaneInstance.addFolder({ title: "🩹 Hinges (plastic)", expanded: false });
      fHinges.addBinding(propsState, "hinges", {
        label: "Tipo",
        options: {
          "None":              "None",
          "Auto-FEMA M3":      "Auto-FEMA M3",
          "Auto-FEMA P-M2-M3": "Auto-FEMA P-M2-M3",
          "Auto-Concrete M3":  "Auto-Concrete M3",
          "Auto-Steel M3":     "Auto-Steel M3",
          "Custom...":         "Custom...",
        },
      });

      // ── Frame > Line Springs (Winkler distribuido por metro) ──
      const fLineSpr = propsPaneInstance.addFolder({ title: "🌀 Line Springs (kN/m por m)", expanded: false });
      fLineSpr.addBinding(propsState, "LKx", { label: "LKx", min: 0, step: 100 });
      fLineSpr.addBinding(propsState, "LKy", { label: "LKy", min: 0, step: 100 });
      fLineSpr.addBinding(propsState, "LKz", { label: "LKz", min: 0, step: 100 });

      // ── Frame Loads — Carga distribuida ──
      const fDist = propsPaneInstance.addFolder({ title: "⬇ Frame Loads (kN/m)" });
      fDist.addBinding(propsState, "qx", { step: 0.1 });
      fDist.addBinding(propsState, "qy", { step: 0.1 });
      fDist.addBinding(propsState, "qz", { step: 0.1 });

      // ── Frame > Additional Mass por longitud ──
      const fMassPerM = propsPaneInstance.addFolder({ title: "⚖ Additional Mass (kg/m)", expanded: false });
      fMassPerM.addBinding(propsState, "massPerM", { label: "m/L", min: 0, step: 1 });

      propsPaneInstance.addButton({ title: "✓ Aplicar a segmentos seleccionados" }).on("click", () => {
        fireProp("segs", segIds, "section", propsState.section);
        fireProp("segs", segIds, "material", propsState.material_frame);

        // Property modifiers (sólo emit si alguno != 1.0)
        const mods = { A: propsState.A_mod, Iz: propsState.Iz_mod, Iy: propsState.Iy_mod, J: propsState.J_mod };
        if (mods.A !== 1 || mods.Iz !== 1 || mods.Iy !== 1 || mods.J !== 1) {
          fireProp("segs", segIds, "modifiers", mods);
        }

        if (propsState.insertionPoint !== "10 — Centroid") {
          fireProp("segs", segIds, "insertionPoint", propsState.insertionPoint);
        }

        if (propsState.beta !== 0) fireProp("segs", segIds, "beta", propsState.beta);

        const relI = [propsState.relMxI, propsState.relMyI, propsState.relMzI];
        const relJ = [propsState.relMxJ, propsState.relMyJ, propsState.relMzJ];
        if (relI.some(r => r) || relJ.some(r => r)) {
          fireProp("segs", segIds, "releases", { i: relI, j: relJ });
        }

        if (propsState.hinges !== "None") fireProp("segs", segIds, "hinges", propsState.hinges);

        const lineSprings = [propsState.LKx, propsState.LKy, propsState.LKz];
        if (lineSprings.some(k => k !== 0)) fireProp("segs", segIds, "lineSprings", lineSprings);

        const qs = [propsState.qx, propsState.qy, propsState.qz];
        if (qs.some(v => v !== 0)) fireProp("segs", segIds, "distLoad", qs);

        if (propsState.massPerM !== 0) fireProp("segs", segIds, "massPerM", propsState.massPerM);

        updateStatus(`✓ Propiedades aplicadas a ${segIds.length} segmento(s)`);
      });
    }
    if (hasPolys) {
      const fShell = propsPaneInstance.addFolder({ title: `▭ Shell / Área — ${polyIds.length}` });
      fShell.addBinding(propsState, "shellType", {
        label: "Tipo",
        options: {
          "Mindlin (FSDT)": "Mindlin (FSDT)",
          "Kirchhoff (CPT)": "Kirchhoff (CPT)",
          "Plane stress": "Plane stress",
        },
      });
      fShell.addBinding(propsState, "thickness", {
        label: "Espesor (m)", min: 0.01, step: 0.01,
      });
      fShell.addBinding(propsState, "material_shell", {
        label: "Material",
        options: {
          "Concreto C20": "Concreto C20", "Concreto C25": "Concreto C25",
          "Concreto C30": "Concreto C30", "Acero A36": "Acero A36",
        },
      });

      const fSurf = propsPaneInstance.addFolder({ title: "⬇ Carga superficial (kN/m²)" });
      fSurf.addBinding(propsState, "surfLoad", { label: "q", step: 0.1 });

      propsPaneInstance.addButton({ title: "✓ Aplicar a áreas seleccionadas" }).on("click", () => {
        fireProp("areas", polyIds, "shellType", propsState.shellType);
        fireProp("areas", polyIds, "thickness", propsState.thickness);
        fireProp("areas", polyIds, "material", propsState.material_shell);
        if (propsState.surfLoad !== 0) {
          fireProp("areas", polyIds, "surfLoad", propsState.surfLoad);
        }
        updateStatus(`✓ Propiedades aplicadas a ${polyIds.length} área(s)/shell(s)`);
      });
    }
    if (noneEditable) {
      // Solo elementos auxiliares (o nada editable) — mostrar info
      const fInfo = propsPaneInstance.addFolder({ title: "ℹ Selección" });
      const infoState = { msg: "Seleccioná nodos, frames o áreas para editar" };
      fInfo.addBinding(infoState, "msg", { readonly: true, label: "" });
    }

    // Botón ✕ cerrar (siempre presente)
    propsPaneInstance.addButton({ title: "✕ Cerrar (limpia selección)" }).on("click", () => {
      selection.clear();
      refreshSelectionGroup();
    });

    propsContainer.style.display = "block";
    // Re-attach drag handler al nuevo title bar (Tweakpane se recrea cada vez)
    setupPropsDrag();
  };

  (window as any).__hekatanRefreshPropsPane = updatePropsPane;

  // ── RIGHT-CLICK TAP = CANCEL (estilo AutoCAD/Revit) ──
  // Al hacer click derecho SIN moverse (tap puro) → cancela la operación
  // pendiente (ccAnchor, drawing en progreso, selección si nada más activo).
  // Implementado vía dispatch de Escape sintético, así reusa TODOS los
  // handlers de cancel existentes (drawMode, selectMode, inspectMode, etc.)
  // sin tener que duplicar la lógica.
  // Si el usuario MANTIENE click derecho y arrastra (>8px) → es PAN de
  // OrbitControls (default), no cancelamos.
  let rcDownPos: { x: number; y: number } | null = null;
  let rcDragged = false;
  rendererElm.addEventListener("pointerdown", (ev: PointerEvent) => {
    if (ev.button === 2) {
      rcDownPos = { x: ev.clientX, y: ev.clientY };
      rcDragged = false;
    }
  });
  rendererElm.addEventListener("pointermove", (ev: PointerEvent) => {
    // Detectar si el right-button está apretado durante move (drag = pan).
    // ev.buttons bitmask: 2 = secondary button. Si está y rcDownPos existe,
    // medimos distancia para diferenciar tap vs drag.
    if (rcDownPos && (ev.buttons & 2) && !rcDragged) {
      const dx = ev.clientX - rcDownPos.x;
      const dy = ev.clientY - rcDownPos.y;
      if (Math.hypot(dx, dy) > 8) rcDragged = true;
    }
  });
  rendererElm.addEventListener("pointerup", (ev: PointerEvent) => {
    if (ev.button === 2) {
      const wasTap = rcDownPos !== null && !rcDragged;
      rcDownPos = null;
      // Si hover.ts marcó que el right-click cayó sobre un nodo/elemento,
      // saltamos el cancel para que el context menu (Asignar / Ver info)
      // pueda mostrarse sin que se cierre la selección.
      const rcOnElement = (window as any).__hekatanRClickOnElement === true;
      (window as any).__hekatanRClickOnElement = false;  // reset
      if (rcOnElement) return;
      if (wasTap) {
        // Right-click TAP → cancel jerárquico (estilo AutoCAD):
        //   1. Si hay rect-select pendiente → cancelar SOLO eso
        //   2. Sino, dispatch Escape (cancela drawing en getCad3d.ts)
        //   3. SIEMPRE limpiar selección + cerrar Properties Pane
        //   4. SIEMPRE salir del tool actual → tool="select" (no quedás
        //      atrapado en line/polyline/etc dibujando sin querer)
        if (ccAnchor) {
          cancelClickClick();
        } else {
          window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
        }
        if (selection.size > 0) {
          selection.clear();
          refreshSelectionGroup();
        }
        // Cerrar la polilínea actual abierta (si estaba dibujando)
        if (drawingObj.polylines) {
          const polys = drawingObj.polylines.rawVal;
          const last = polys[polys.length - 1] ?? [];
          if (last.length > 0) {
            // Si estaba en medio de una polilínea, cerrarla y arrancar nueva
            drawingObj.polylines.val = [...polys, []];
          }
        }
        // Salir del tool — volver a "select" (estilo AutoCAD: ESC o
        // right-click salen al modo de selección por default).
        const cadState = (window as any).__hekatanCadState;
        const curTool = cadState?.get?.()?.tool;
        if (curTool && curTool !== "select" && curTool !== "none") {
          cadState?.setTool?.("select");
          updateStatus(`⎋ Cancelado — tool '${curTool}' cerrado, volvés a Seleccionar`);
        } else {
          updateStatus("⎋ Cancelado (click derecho)");
        }
      }
      // Si fue drag → no hacemos nada (OrbitControls ya hizo pan)
    }
  });
  // Bloquear el menú contextual del browser en el canvas — siempre.
  // Los handlers viejos de contextmenu (delete-point-on-rclick, finish-poly)
  // se neutralizan: usamos right-click sólo para cancel.
  rendererElm.addEventListener("contextmenu", (ev: Event) => {
    ev.preventDefault();
    ev.stopPropagation();
  }, { capture: true });

  rendererElm.addEventListener("pointerdown", (ev: PointerEvent) => {
    const tool = ((window as any).__hekatanCadState?.get?.() as any)?.tool ?? "select";
    if (tool !== "select" && tool !== "none" && tool) return;
    if (ev.button !== 0) return;  // solo botón izquierdo
    // ── La ventana de seleccion NO exige apretar "Seleccionar" antes ─────────
    //
    // Era opt-in: hasta que no se pulsaba el boton, arrastrar orbitaba la
    // camara y no seleccionaba nada. Pero en AutoCAD —y en cualquier CAD—
    // arrastrar sobre el vacio SIEMPRE abre la ventana de seleccion: no hay
    // que activar nada. Sin eso la respuesta a «no puedo seleccionar
    // arrastrando» es «primero aprieta este boton», que no es una respuesta.
    //
    // El opt-in existia por el MOVIL, donde un arrastre tiene que orbitar. Eso
    // ya lo cubre la guarda de `pointerType === "touch"` de aqui abajo, que es
    // la condicion de verdad; el flag sobraba en raton.
    //
    // ⚠️ NO se mira `__hekatanRectSelectExplicit`. Ese flag lo pone el sistema
    // a false al elegir CUALQUIER herramienta de dibujo, no el usuario a
    // proposito: despues de dibujar una linea se quedaba en false para
    // siempre, y el arrastre no pintaba ni el rectangulo. El unico caso en que
    // hay que bloquear la ventana es el modo apoyo/carga del ribbon, y ese se
    // marca aparte y con su nombre.
    if ((window as any).__hekatanBloquearVentana) return;
    // Mouse-only: en touch (pointerType === "touch") no activamos
    // rect-drag aunque el usuario haya elegido Seleccionar — en mobile
    // el drag-to-select es contra-intuitivo (esperan orbit). Para
    // selección puntual, el usuario toca un nodo/línea (click handler).
    if (ev.pointerType === "touch") return;
    // ── MANTENER PULSADO NO SELECCIONA ───────────────────────────────────────
    //
    // La seleccion por ventana es CLIC-CLIC: un clic marca la esquina, el raton
    // se mueve libre y otro clic cierra. Arrastrar con el boton apretado es
    // ORBITAR la camara, y punto.
    //
    // Estaban los dos modos a la vez y se pisaban: al arrastrar para girar el
    // modelo se abria una ventana de seleccion, y al soltar seleccionaba lo que
    // hubiera dentro. Dos gestos parecidos con resultados distintos, y el que
    // sale sin querer es el que rompe el trabajo.
    //
    // `dragStart` se deja a null: el `pointermove` y el `pointerup` de abajo
    // salen solos, y los controles de camara se quedan con el arrastre.
    dragStart = null;
    dragActive = false;
  });
  rendererElm.addEventListener("pointermove", (ev: PointerEvent) => {
    // ── Modo click-click: si hay anchor, pintamos el preview SIN
    // necesidad de tener botón apretado (típica AutoCAD experience).
    // Excepción: si el usuario está holdeando (ev.buttons > 0), está
    // intentando orbitar/pan la cámara — NO pintamos para no confundir.
    if (ccAnchor && ev.buttons === 0) {
      const isCrossing = ev.clientX < ccAnchor.x;
      paintDragRect(ccAnchor.x, ccAnchor.y, ev.clientX, ev.clientY, isCrossing);
      return;
    }
    // ── Modo drag-and-release tradicional ──
    if (!dragStart) return;
    const dx = ev.clientX - dragStart.x;
    const dy = ev.clientY - dragStart.y;
    const dist = Math.hypot(dx, dy);
    if (!dragActive && dist < 8) return;  // threshold click vs drag
    dragActive = true;
    const isCrossing = ev.clientX < dragStart.x;  // R→L = crossing
    paintDragRect(dragStart.x, dragStart.y, ev.clientX, ev.clientY, isCrossing);
  });
  rendererElm.addEventListener("pointerup", (ev: PointerEvent) => {
    if (!dragStart) return;
    if (!dragActive) { dragStart = null; return; }
    const isMulti = ev.ctrlKey || ev.metaKey || ev.shiftKey;
    finalizeRectSelection(dragStart.x, dragStart.y, ev.clientX, ev.clientY, isMulti);
    dragStart = null;
    dragActive = false;
  });

  // On pointer click, add a point and polyline
  // ════════════════════════════════════════════════════════════════════
  // OBJECT SNAP (OSNAP) — estilo AutoCAD
  // ════════════════════════════════════════════════════════════════════
  // Snaps soportados:
  //   - END (Endpoint): extremos de polilíneas/segmentos
  //   - MID (Midpoint): punto medio de un segmento
  //   - NODE: cualquier punto/nodo existente
  //   - CEN (Center): centro de un círculo/arco discretizado
  //   - PER (Perpendicular): proyección perpendicular sobre un segmento
  //   - NEA (Nearest): punto más cercano sobre un segmento
  //   - INT (Intersection): intersección de 2 segmentos
  // El usuario activa cada snap via window.__hekatanOsnap[type] = true
  (window as any).__hekatanOsnap = (window as any).__hekatanOsnap ?? {
    end: true, mid: true, node: true, cen: true,
    per: false, nea: false, int: true,
    // ORIGEN y CRUCE DE REJILLA: lo que hace falta para arrancar un dibujo con el
    // ratón cuando NO hay nada dibujado todavía. Sin ellos, en un lienzo vacío no
    // hay a qué engancharse: el primer punto solo se puede teclear.
    ori: true, grid: true,
  };
  // Snap marker visual (cuadrado coloreado por tipo + label)
  const osnapMarker = new THREE.Group();
  osnapMarker.visible = false;
  osnapMarker.frustumCulled = false;
  scene.add(osnapMarker);
  const osnapColors: Record<string, number> = {
    end: 0xff3344, mid: 0xfbbf24, node: 0x60a5fa, cen: 0x34d399,
    per: 0xc084fc, nea: 0xff7eb6, int: 0xff8800,
    ori: 0xffffff, grid: 0x22d3ee, track: 0xffc400,
    ifc: 0xf59e0b, ifcAxis: 0xfde68a, ifcSec: 0xfb923c, ifcEdge: 0xfbbf24, ifcVert: 0xff3344,
  };
  const showOsnap = (type: string, x: number, y: number, z: number) => {
    // Qué referencia está enganchada AHORA, para poder comprobarlo desde fuera
    // (guiones de prueba): el marcador se ve en pantalla, pero un test necesita
    // el dato, y leerlo de la escena es adivinar por el color del cuadrito.
    (window as any).__hekatanOsnapUltimo = { type, x, y, z };
    while (osnapMarker.children.length) {
      const c = osnapMarker.children.pop()!;
      (c as any).geometry?.dispose?.();
      (c as any).material?.dispose?.();
    }
    const col = osnapColors[type] ?? 0xffffff;
    // ⚠️ El cuadrado se dibujaba con medio lado de 0.05 m EN EL MUNDO, cosido a la
    // coordenada del punto y con el grupo en el origen: crecía al acercar y se
    // encogía al alejar, que es justo lo que Jorge ve moverse. (Y el trozo que iba a
    // reescalarlo usaba `_snapBaseDist`, una variable que no se declara en ningún
    // sitio: código muerto que además habría reventado el manejador del zoom.)
    // Ahora es un cuadrado UNITARIO en el origen; el grupo se lleva al punto y la
    // ESCALA lo deja del mismo tamaño en píxeles, como el halo.
    const sqGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-1, -1, 0), new THREE.Vector3(+1, -1, 0),
      new THREE.Vector3(+1, -1, 0), new THREE.Vector3(+1, +1, 0),
      new THREE.Vector3(+1, +1, 0), new THREE.Vector3(-1, +1, 0),
      new THREE.Vector3(-1, +1, 0), new THREE.Vector3(-1, -1, 0),
    ]);
    osnapMarker.add(new THREE.LineSegments(sqGeo, new THREE.LineBasicMaterial({ color: col, linewidth: 2 })));
    osnapMarker.position.set(x, y, z);
    osnapMarker.visible = true;
    updateOsnapScale();
  };
  // Medio lado del glifo, en píxeles. El de AutoCAD ronda los 6; aquí 4, para que
  // deje ver el punto (el halo va a 2 px de radio).
  let _osnapPx = 4;
  const updateOsnapScale = () => {
    if (!osnapMarker.visible) return;
    osnapMarker.scale.setScalar(_osnapPx * metrosPorPixel(osnapMarker.position));
  };
  (window as any).__hekatanOsnapMarkerRef = osnapMarker;
  (window as any).__hekatanUpdateOsnapScale = updateOsnapScale;
  (window as any).__hekatanOsnapPx = (n?: number) => {
    if (typeof n === "number" && n > 0) { _osnapPx = n; updateOsnapScale(); viewerRender(); }
    return _osnapPx;
  };
  const hideOsnap = () => { osnapMarker.visible = false; (window as any).__hekatanOsnapUltimo = null; };
  // ── El NOMBRE de la referencia, junto al cursor (AutoCAD lo llama tooltip de
  // referencia). Sin él, el cuadradito de color no dice a qué te enganchas.
  const OSNAP_NOMBRE: Record<string, string> = {
    ori: "Origen (0,0,0)", grid: "Cruce de rejilla", end: "Punto final",
    track: "Alineado con un nudo",
    node: "Nudo", mid: "Punto medio", cen: "Centro", int: "Intersección",
    per: "Perpendicular", nea: "Cercano",
    ifc: "Referencia IFC · cara", ifcAxis: "Referencia IFC · eje", ifcSec: "Sección IFC (corte)",
    ifcEdge: "Borde IFC", ifcVert: "Vértice IFC",
  };
  const etiqOsnap = document.createElement("div");
  etiqOsnap.id = "hk-osnap-etiqueta";
  etiqOsnap.style.cssText = [
    "position:fixed", "z-index:99995", "display:none", "pointer-events:none",
    "padding:2px 7px", "border-radius:4px", "white-space:nowrap",
    "background:rgba(15,23,42,0.92)", "border:1px solid rgba(148,163,184,.45)",
    "color:#e2e8f0", "font:12px Consolas,monospace",
  ].join(";") + ";";
  document.body.appendChild(etiqOsnap);
  const mostrarEtiquetaOsnap = (tipo: string, cx: number, cy: number) => {
    const t = OSNAP_NOMBRE[tipo];
    if (!t) { etiqOsnap.style.display = "none"; return; }
    etiqOsnap.textContent = t;
    etiqOsnap.style.color = "#" + (osnapColors[tipo] ?? 0xffffff).toString(16).padStart(6, "0");
    etiqOsnap.style.left = (cx + 18) + "px";
    etiqOsnap.style.top = (cy - 26) + "px";
    etiqOsnap.style.display = "block";
  };
  const ocultarEtiquetaOsnap = () => { etiqOsnap.style.display = "none"; };
  // Compute closest snap for current cursor world point
  /** Un punto del mundo → píxel del lienzo, con la cámara activa. */
  const _vProy = new THREE.Vector3();
  const aPixeles = (x: number, y: number, z: number): { x: number; y: number } | null => {
    const cam = getActiveCamera();
    if (!cam) return null;
    const r = rendererElm.getBoundingClientRect();
    _vProy.set(x, y, z).project(cam);
    if (!isFinite(_vProy.x) || !isFinite(_vProy.y)) return null;
    // ⚠️ Un punto DETRÁS de la cámara (o fuera del cono) se proyecta espejado a
    // cualquier sitio de la pantalla: en un alzado mirando +Y desde y = 108, el
    // origen (0,0,0) quedaba detrás y la mirilla daba «Origen» sobre el canto
    // del entrepiso (el clic ponía el nudo en 0,0,0). Fuera del cono no hay
    // referencia.
    if (_vProy.z < -1 || _vProy.z > 1) return null;
    return {
      x: r.left + (_vProy.x * 0.5 + 0.5) * r.width,
      y: r.top + (-_vProy.y * 0.5 + 0.5) * r.height,
    };
  };
  (window as any).__hekatanAPixeles = aPixeles;

  const computeOsnap = (px: number, py: number, pz: number, tol: number,
                        cursorPx?: { x: number; y: number }): { type: string; x: number; y: number; z: number } | null => {
    // ⚠️ El botón OSNAP (F3) se conmutaba y NO LO MIRABA NADIE: encendido o apagado,
    // las referencias seguían tirando igual. Es el interruptor de las referencias,
    // como en AutoCAD; apagado, el punto cae donde está el cursor.
    if ((window as any).__hekatanOsnapOn === false) return null;
    const opts = (window as any).__hekatanOsnap as Record<string, boolean>;
    const pts = drawingObj.points.rawVal as [number,number,number][];
    const polys = drawingObj.polylines?.rawVal ?? [];
    let best: { type: string; x: number; y: number; z: number; d: number; r: number } | null = null;
    // PRIORIDAD entre referencias, como en AutoCAD: dentro de la mirilla manda el TIPO,
    // no la distancia. Todo lo que llega aquí ya está dentro de `tol`, así que basta con
    // ordenar por rango y, a igual rango, por cercanía. Sin esto, «Cercano» —que cae
    // EXACTO sobre la línea, distancia 0— se comía la Intersección y el Punto final,
    // que son los que se quieren coger.
    const RANGO: Record<string, number> = {
      ori: 0, end: 0, node: 0, int: 1, grid: 2, mid: 2, cen: 3, per: 4, nea: 5,
    };
    // ⚠️ LA MIRILLA SE MIDE EN PANTALLA, no en el mundo.
    //
    // Se medía la distancia del candidato al punto del PLANO DE TRABAJO. En planta
    // eso da igual, pero en isométrico el rayo cruza el plano lejísimos del nudo que
    // se está señalando: dibujando una columna hacia abajo desde una esquina a 3 m
    // de altura, el clic caía en (3.63, 3.63, 0) y NINGÚN nudo fuera del plano podía
    // engancharse nunca. Por eso «no había referencia» al bajar la columna.
    //
    // AutoCAD mide la apertura en píxeles alrededor de la cruz: cualquier cosa que
    // se VEA cerca del cursor se puede coger, esté en el plano o no. Eso es esto.
    // Se pasa por PARÁMETRO, no por una global: quien pregunta por un punto suelto
    // (una prueba, un guion) no tiene cursor y se mide en el mundo, como antes.
    const curPx = cursorPx;
    const consider = (type: string, x: number, y: number, z: number) => {
      let d: number;
      if (curPx) {
        const q = aPixeles(x, y, z);
        if (!q) return;
        d = Math.hypot(q.x - curPx.x, q.y - curPx.y);
        if (d > _aperturaPx) return;
      } else {
        d = Math.hypot(x - px, y - py, z - pz);
        if (d > tol) return;
      }
      const r = RANGO[type] ?? 9;
      if (!best || r < best.r || (r === best.r && d < best.d)) best = { type, x, y, z, d, r };
    };
    // ── ORIGEN (0,0,0) ────────────────────────────────────────────────────
    // Es el punto de referencia del modelo y en un lienzo vacío es lo ÚNICO que
    // hay. Sin esto, «dibujar desde el origen» obligaba a teclear la coordenada.
    if (opts.ori !== false) consider("ori", 0, 0, 0);

    // ── CRUCE DE LA REJILLA ───────────────────────────────────────────────
    // El cruce de la cuadrícula visible, sobre el PLANO DE TRABAJO — es lo que se
    // clica en ETABS y en Revit. Ojo: esto NO es el enganche global a la rejilla
    // (F9), que REDONDEA todo lo que se toca; esto es una referencia más, que solo
    // manda si el cursor está dentro de la mirilla, y deja el resto del dibujo a
    // mano alzada.
    // ⚠️ Solo con el ENGANCHE (F9) encendido. La cuadrícula de fondo cubre TODO el
    // plano: si fuera referencia siempre, con una mirilla de 10 px casi cualquier
    // clic caería en un cruce y se acabó el dibujo a mano alzada, que es justo lo
    // que se pidió. Con F9 encendido el enganche manda —pero ahora engancha al
    // cruce CERCANO en vez de redondear todo lo que se toca.
    if (opts.grid !== false && (window as any).__hekatanSnapEnabled === true) {
      const cfg = (window as any).__hekatanGridConfig as
        { minorStep?: number; gridSize?: number } | undefined;
      const paso = cfg?.minorStep && cfg.minorStep > 0 ? cfg.minorStep : 1;
      const mitad = (cfg?.gridSize ?? 30) / 2;
      const plano = (window as any).__hekatanCadState?.get?.()?.workPlane ?? "xy";
      const cae = (v: number) => Math.round(v / paso) * paso;
      const dentro = (a: number, b: number) => Math.abs(a) <= mitad + 1e-9 && Math.abs(b) <= mitad + 1e-9;
      if (plano === "xz") {
        const gx = cae(px), gz = cae(pz);
        if (dentro(gx, gz)) consider("grid", gx, py, gz);
      } else if (plano === "yz") {
        const gy = cae(py), gz = cae(pz);
        if (dentro(gy, gz)) consider("grid", px, gy, gz);
      } else {
        const gx = cae(px), gy = cae(py);
        if (dentro(gx, gy)) consider("grid", gx, gy, pz);
        // ── Y LOS CRUCES DE LAS GRILLAS AUXILIARES ──────────────────────────
        // Con una sola grilla, en cuanto subes la cota lo de abajo deja de tener
        // referencia: por eso «ubico una altura y allí no hay con qué
        // referenciarse». Cada grilla auxiliar es un plano z = cte, así que su
        // cruce bajo el cursor es donde el RAYO corta ese plano, redondeado al
        // paso — no vale reusar (px,py), que son del plano de trabajo y en
        // isométrico caen metros más allá. Es lo que hace ETABS con sus niveles.
        // planos auxiliares VERTICALES: el rayo corta y = d (xz) o x = d (yz)
        const auxV = ((window as any).__hekatanPlanosAux ?? []) as Array<{ plano: string; d: number }>;
        for (const g of auxV.slice(0, 24)) {
          if (g.plano === "xy" || !isFinite(g.d)) continue;
          const n = g.plano === "xz" ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
          const pl2 = new THREE.Plane(n, -g.d), q2 = new THREE.Vector3();
          if (!raycaster.ray.intersectPlane(pl2, q2)) continue;
          if (g.plano === "xz") { const ax = cae(q2.x), az = cae(q2.z); if (dentro(ax, az)) consider("grid", ax, g.d, az); }
          else { const ay = cae(q2.y), az = cae(q2.z); if (dentro(ay, az)) consider("grid", g.d, ay, az); }
        }
        const niveles = ((window as any).__hekatanLevels ?? []) as Array<{ z: number }>;
        if (niveles.length) {
          const rayo = raycaster.ray;
          const planoZ = new THREE.Plane();
          const corte = new THREE.Vector3();
          for (const l of niveles.slice(0, 24)) {
            if (!isFinite(l?.z) || Math.abs(l.z - pz) < 1e-6) continue;   // esa ya es la de trabajo
            planoZ.set(new THREE.Vector3(0, 0, 1), -l.z);
            if (!rayo.intersectPlane(planoZ, corte)) continue;
            const ax = cae(corte.x), ay = cae(corte.y);
            if (dentro(ax, ay)) consider("grid", ax, ay, l.z);
          }
        }
      }
    }

    // NODE: cada punto existente
    if (opts.node || opts.end) {
      pts.forEach(p => {
        if (opts.node) consider("node", p[0], p[1], p[2]);
      });
    }
    // ENDPOINT + MIDPOINT + NEAREST + PERPENDICULAR sobre segmentos de polilíneas
    for (const poly of polys) {
      if (poly.length < 2) continue;
      for (let i = 0; i < poly.length - 1; i++) {
        const a = pts[poly[i]], b = pts[poly[i+1]];
        if (!a || !b) continue;
        if (opts.end) {
          consider("end", a[0], a[1], a[2]);
          consider("end", b[0], b[1], b[2]);
        }
        if (opts.mid) {
          consider("mid", (a[0]+b[0])/2, (a[1]+b[1])/2, (a[2]+b[2])/2);
        }
        if (opts.nea || opts.per) {
          const dx = b[0]-a[0], dy = b[1]-a[1], dz = b[2]-a[2];
          const len2 = dx*dx + dy*dy + dz*dz;
          if (len2 < 1e-12) continue;
          const t = Math.max(0, Math.min(1, ((px-a[0])*dx + (py-a[1])*dy + (pz-a[2])*dz) / len2));
          const sx = a[0] + t*dx, sy = a[1] + t*dy, sz = a[2] + t*dz;
          if (opts.nea) consider("nea", sx, sy, sz);
          if (opts.per) consider("per", sx, sy, sz);
        }
      }
    }
    // CENTRO de un ÁREA (el centroide del paño). Es donde se pincha para poner una
    // carga repartida o para arrancar un eje por el medio de la losa; sin él, del
    // paño solo se podían coger las esquinas y los bordes.
    if (opts.cen) {
      const areas = drawingObj.areas?.rawVal ?? [];
      for (const ai of areas) {
        const poly = polys[ai];
        if (!poly || poly.length < 3) continue;
        // el último vértice repite el primero cuando la polilínea está cerrada
        const idx = poly[0] === poly[poly.length - 1] ? poly.slice(0, -1) : poly;
        let cx = 0, cy = 0, cz = 0, n = 0;
        for (const k of idx) {
          const q = pts[k];
          if (!q) continue;
          cx += q[0]; cy += q[1]; cz += q[2]; n++;
        }
        if (n >= 3) consider("cen", cx / n, cy / n, cz / n);
      }
    }

    // CENTRO de circulos y arcos: con el cursor sobre la circunferencia (o
    // sobre el propio centro), como en AutoCAD. El candidato queda a tol/2
    // para que un extremo o un nudo mas cercano al cursor le ganen.
    if (opts.cen) {
      // los del registro (dibujados en esta sesión) MÁS los deducidos de la
      // geometría (valen tras recargar y en dibujos importados), sin repetir
      const deducidos = centrosDeducidos();
      const todos = [...circulos];
      for (const d of deducidos)
        if (!todos.some((k) => Math.hypot(k.c[0]-d.c[0], k.c[1]-d.c[1], k.c[2]-d.c[2]) < 1e-6 && Math.abs(k.r - d.r) < 1e-6))
          todos.push(d);
      for (const k of todos) {
        const vivo = pts.some((p) => Math.abs(Math.hypot(p[0]-k.c[0], p[1]-k.c[1], p[2]-k.c[2]) - k.r) < 1e-6);
        if (!vivo) continue;
        const d = Math.hypot(px-k.c[0], py-k.c[1], pz-k.c[2]);
        if (d < tol || Math.abs(d - k.r) < tol) {
          const dd = Math.min(d, tol * 0.5);
          const rc = 3;   // el rango de «Centro», igual que en RANGO
          if (!best || rc < (best as any).r || (rc === (best as any).r && dd < (best as any).d))
            best = { type: "cen", x: k.c[0], y: k.c[1], z: k.c[2], d: dd, r: rc };
        }
      }
    }
    // INTERSECCIÓN: cruce de dos tramos. Solo se miran los tramos que pasan
    // cerca del cursor (a menos de 3·tol), así no es O(n²) sobre el modelo.
    if (opts.int) {
      const cerca: [number, number, number][][] = [];
      for (const poly of polys) {
        for (let i = 0; i < poly.length - 1; i++) {
          const a = pts[poly[i]], b = pts[poly[i + 1]];
          if (!a || !b) continue;
          const dx = b[0]-a[0], dy = b[1]-a[1], dz = b[2]-a[2];
          const len2 = dx*dx + dy*dy + dz*dz;
          if (len2 < 1e-12) continue;
          const t = Math.max(0, Math.min(1, ((px-a[0])*dx + (py-a[1])*dy + (pz-a[2])*dz) / len2));
          if (Math.hypot(a[0]+t*dx-px, a[1]+t*dy-py, a[2]+t*dz-pz) < 3*tol) cerca.push([a, b]);
        }
      }
      for (let i = 0; i < cerca.length; i++) for (let j = i + 1; j < cerca.length; j++) {
        const [p1, p2] = cerca[i], [p3, p4] = cerca[j];
        // puntos más próximos de las dos rectas (Gauss sobre s,t); si casi
        // coinciden y caen dentro de los dos tramos, es un cruce
        const u = [p2[0]-p1[0], p2[1]-p1[1], p2[2]-p1[2]], v = [p4[0]-p3[0], p4[1]-p3[1], p4[2]-p3[2]];
        const w = [p1[0]-p3[0], p1[1]-p3[1], p1[2]-p3[2]];
        const A = u[0]*u[0]+u[1]*u[1]+u[2]*u[2], B = u[0]*v[0]+u[1]*v[1]+u[2]*v[2], C = v[0]*v[0]+v[1]*v[1]+v[2]*v[2];
        const D = u[0]*w[0]+u[1]*w[1]+u[2]*w[2], E = v[0]*w[0]+v[1]*w[1]+v[2]*w[2];
        const den = A*C - B*B;
        if (den < 1e-12) continue;                 // paralelos
        const s = (B*E - C*D) / den, t = (A*E - B*D) / den;
        if (s < -1e-6 || s > 1+1e-6 || t < -1e-6 || t > 1+1e-6) continue;
        const q1 = [p1[0]+s*u[0], p1[1]+s*u[1], p1[2]+s*u[2]];
        const q2 = [p3[0]+t*v[0], p3[1]+t*v[1], p3[2]+t*v[2]];
        if (Math.hypot(q1[0]-q2[0], q1[1]-q2[1], q1[2]-q2[2]) > 1e-4) continue;   // se cruzan sin tocarse
        // los extremos compartidos ya los da END; aquí interesan los cruces
        const esExtremo = [p1, p2, p3, p4].some((e) => Math.hypot(e[0]-q1[0], e[1]-q1[1], e[2]-q1[2]) < 1e-6);
        if (!esExtremo) consider("int", q1[0], q1[1], q1[2]);
      }
    }
    // ── EJES DE REPLANTEO Y NIVELES ────────────────────────────────────────
    // Faltaban, y es donde se replantea un edificio: el cursor solo redondeaba a
    // múltiplos de `__hekatanSnap2D` (0.5 m de fábrica), así que con ejes a 4.60 o
    // 7.25 el punto caía CERCA del cruce, nunca encima. Es lo que se veía: el punto
    // y el cruce de ejes no coincidían. Ahora un eje se referencia como cualquier
    // línea (INTERSECCIÓN entre dos ejes, PUNTO FINAL y CERCANO sobre el eje) y,
    // además, el cruce de un eje con un NIVEL, que es el punto de una elevación.
    const ejes = ((window as any).__hekatanAxisGrids ?? []) as
      { start: [number, number, number]; end: [number, number, number] }[];
    const niveles = ((window as any).__hekatanLevels ?? []) as { z: number }[];
    const segEjes = ejes
      .filter((g) => g && g.start && g.end)
      .map((g) => [g.start, g.end] as [number, number, number][]);
    for (const [a, b] of segEjes) {
      if (opts.end) {
        consider("end", a[0], a[1], a[2]);
        consider("end", b[0], b[1], b[2]);
      }
      const dx = b[0]-a[0], dy = b[1]-a[1], dz = b[2]-a[2];
      const len2 = dx*dx + dy*dy + dz*dz;
      if (len2 < 1e-12) continue;
      const t = Math.max(0, Math.min(1, ((px-a[0])*dx + (py-a[1])*dy + (pz-a[2])*dz) / len2));
      if (opts.nea) consider("nea", a[0]+t*dx, a[1]+t*dy, a[2]+t*dz);
      // eje × NIVEL: el punto del eje a la cota del nivel (solo si el eje sube)
      if (opts.int && Math.abs(dz) > 1e-9) {
        for (const n of niveles) {
          const tn = (n.z - a[2]) / dz;
          if (tn < -1e-6 || tn > 1 + 1e-6) continue;
          consider("int", a[0]+tn*dx, a[1]+tn*dy, n.z);
        }
      }
    }
    // INTERSECCIÓN entre dos ejes. Se miran en 2D sobre el plano de trabajo: dos
    // ejes de planta son coplanarios pero pueden estar a cotas distintas, y lo que
    // se quiere coger es su cruce EN LA COTA DONDE SE DIBUJA.
    if (opts.int || opts.node) {
      for (let i = 0; i < segEjes.length; i++) for (let j = i + 1; j < segEjes.length; j++) {
        const [p1, p2] = segEjes[i], [p3, p4] = segEjes[j];
        const ux = p2[0]-p1[0], uy = p2[1]-p1[1];
        const vx = p4[0]-p3[0], vy = p4[1]-p3[1];
        const den = ux*vy - uy*vx;
        if (Math.abs(den) < 1e-12) continue;                   // paralelos
        const wx = p1[0]-p3[0], wy = p1[1]-p3[1];
        const sPar = (vx*wy - vy*wx) / den;
        const tPar = (ux*wy - uy*wx) / den;
        if (sPar < -1e-6 || sPar > 1+1e-6 || tPar < -1e-6 || tPar > 1+1e-6) continue;
        // La cota del cruce es la del PLANO DE TRABAJO, como en ETABS: el cruce de
        // dos ejes existe en todas las plantas, y el punto que se quiere coger está
        // en la que se está dibujando. Con la z CRUDA del cursor el cruce salía
        // siempre a distancia 0 y se comía las demás referencias — el cruce de un
        // eje con un nivel, por ejemplo, no se podía coger nunca.
        const zt = (window as any).__hekatanCadState?.get?.()?.workZ;
        consider("int", p1[0] + sPar*ux, p1[1] + sPar*uy, typeof zt === "number" ? zt : pz);
      }
    }
    // Líneas auxiliares: endpoint, midpoint, nearest, perpendicular
    const auxState = (window as any).__hekatanDrawingAuxLines;
    const auxLines: number[][] = auxState?.rawVal ?? auxState?.val ?? auxState ?? [];
    for (const ln of auxLines) {
      if (ln.length !== 6) continue;
      const a: [number, number, number] = [ln[0], ln[1], ln[2]];
      const b: [number, number, number] = [ln[3], ln[4], ln[5]];
      if (opts.end) {
        consider("end", a[0], a[1], a[2]);
        consider("end", b[0], b[1], b[2]);
      }
      if (opts.mid) consider("mid", (a[0]+b[0])/2, (a[1]+b[1])/2, (a[2]+b[2])/2);
      if (opts.nea || opts.per) {
        const dx = b[0]-a[0], dy = b[1]-a[1], dz = b[2]-a[2];
        const len2 = dx*dx + dy*dy + dz*dz;
        if (len2 < 1e-12) continue;
        const t = Math.max(0, Math.min(1, ((px-a[0])*dx + (py-a[1])*dy + (pz-a[2])*dz) / len2));
        const sx = a[0] + t*dx, sy = a[1] + t*dy, sz = a[2] + t*dz;
        if (opts.nea) consider("nea", sx, sy, sz);
        if (opts.per) consider("per", sx, sy, sz);
      }
    }
    return best ? { type: best.type, x: best.x, y: best.y, z: best.z } : null;
  };
  // ── DESTELLO al cambiar una propiedad (idea de Napkin) ────────────────────
  // Cuando cambia la sección, el apoyo o la carga de algo, ese algo PARPADEA un
  // segundo. Sin esto, cambias una sección desde el panel y no tienes ninguna
  // señal de que el cambio haya llegado a la barra que creías.
  const grupoDestello = new THREE.Group();
  grupoDestello.frustumCulled = false;
  scene.add(grupoDestello);
  const matDestello = new THREE.LineBasicMaterial({
    color: 0xe6c463, transparent: true, opacity: 1.0, depthTest: false,
  });
  let _destelloHasta = 0;
  const limpiarDestello = () => {
    for (const o of grupoDestello.children.slice()) {
      grupoDestello.remove(o);
      (o as THREE.Line).geometry?.dispose?.();
    }
  };
  (window as any).__hekatanDestello = (ids: string[]) => {
    limpiarDestello();
    const pts = drawingObj.points?.rawVal ?? [];
    const polys = drawingObj.polylines?.rawVal ?? [];
    for (const id of ids || []) {
      const trozos = String(id).split(":");
      let coords: number[][] = [];
      if (trozos[0] === "pt") {
        const q = pts[+trozos[1]];
        if (q) coords = [q, [q[0] + 0.001, q[1], q[2]]];
      } else if (trozos[0] === "seg") {
        const poly = polys[+trozos[1]] || [];
        const a = pts[poly[+trozos[2]]], b = pts[poly[+trozos[2] + 1]];
        if (a && b) coords = [a, b];
      } else if (trozos[0] === "poly") {
        const poly = polys[+trozos[1]] || [];
        coords = poly.map((i: number) => pts[i]).filter(Boolean);
      }
      if (coords.length < 2) continue;
      const g = new THREE.BufferGeometry().setFromPoints(
        coords.map((q) => new THREE.Vector3(q[0], q[1], q[2])));
      const ln = new THREE.Line(g, matDestello);
      ln.renderOrder = 1200;
      grupoDestello.add(ln);
    }
    if (!grupoDestello.children.length) return;
    _destelloHasta = performance.now() + 900;
    const tic = () => {
      const queda = _destelloHasta - performance.now();
      if (queda <= 0) { limpiarDestello(); viewerRender(); return; }
      matDestello.opacity = Math.min(1, queda / 900) * 0.95;
      viewerRender();
      requestAnimationFrame(tic);
    };
    requestAnimationFrame(tic);
  };
  window.addEventListener("hk:property-applied", (ev: any) => {
    const ids = ev?.detail?.ids;
    if (Array.isArray(ids) && ids.length) (window as any).__hekatanDestello(ids);
  });

  (window as any).__hekatanOsnapCompute = computeOsnap;
  (window as any).__hekatanOsnapShow = showOsnap;
  (window as any).__hekatanOsnapHide = hideOsnap;

  // ── Buffer de clicks pendientes para tools multi-click ──
  // Círculo: 2 clicks (centro + radio) → __hekatanDrawCircle
  // Arco: 3 clicks (start + mid + end) → __hekatanDrawArc
  // Rectángulo: 2 clicks (esquina A + B) → __hekatanDrawRect
  let pendingClicks: [number, number, number][] = [];
  // Altura tipeada para tools "col" (columna) y "wall" (pared Q4).
  // Se setea cuando el usuario tipea un número + Enter ANTES de hacer el
  // click final. Default = 3m si no se tipea nada.
  let pendingHeight = 0;
  // DESFASE: distancia tecleada (se conserva entre desfases, como en AutoCAD)
  let pendingDist = 0;
  // RECORTAR / ALARGAR / DESFASE: la linea o contorno designado en el 1er clic
  let designado: { poly: number; seg: number } | null = null;
  // ── Crear status bar HTML siempre visible debajo del viewer ──
  // Muestra: tool activa + paso actual + última acción.
  const statusBar = document.createElement("div");
  statusBar.id = "hk-cad-status";
  statusBar.style.cssText = [
    "position:fixed",
    "bottom:8px",
    "left:50%",
    "transform:translateX(-50%)",
    "padding:6px 14px",
    "background:rgba(15, 23, 42, 0.92)",
    "color:#22d3ee",
    "border:1px solid rgba(34, 211, 238, 0.5)",
    "border-radius:6px",
    "font-family:Consolas, monospace",
    "font-size:12px",
    "z-index:90",
    "pointer-events:none",
    "box-shadow:0 0 8px rgba(34, 211, 238, 0.25)",
    "max-width:90vw",
    "white-space:nowrap",
    "overflow:hidden",
    "text-overflow:ellipsis",
  ].join(";") + ";";
  // Mensaje default — incluye la "leyenda" de sintaxis tipo AutoCAD para que
  // el usuario sepa qué puede tipear apenas active un tool de dibujo.
  statusBar.textContent =
    "🛠 CAD listo — seleccioná un tool. " +
    "Inputs: 5 (DDE) · 5,3,2 (abs) · @5,3,2 (rel) · @5<45 (polar) · @5<45<30 (esférico) + Enter";
  document.body.appendChild(statusBar);

  // Helper de status — el usuario VE en pantalla qué paso del tool va.
  // El sufijo automático muestra modos activos: ⊥ ORTO ON, Cota Z, axisLock.
  const buildStatusSuffix = (): string => {
    const parts: string[] = [];
    if ((window as any).__hekatanOrthoMode) parts.push("⊥ ORTO ON (F8)");
    if (axisLock) parts.push(`🔒 LOCK ${axisLock.toUpperCase()}`);
    const st = (window as any).__hekatanCadState?.get?.();
    const wz = st?.workZ ?? 0;
    if (Math.abs(wz) > 0.001) parts.push(`Cota Z=${wz}m`);
    if ((window as any).__hekatanShowOrthoPlanes !== false) parts.push("▦ Planos XY/XZ/YZ");
    return parts.length > 0 ? `   |   ${parts.join("  ·  ")}` : "";
  };
  const updateStatus = (txt: string) => {
    const fullText = txt + buildStatusSuffix();
    statusBar.textContent = fullText;
    (window as any).__hekatanCadStatusText = fullText;
    // La ventana de comandos (main.ts) lleva un HISTORIAL como la de AutoCAD:
    // cada mensaje de estado se escribe ahí también, así lo que pasó no se
    // pierde al mensaje siguiente. La barra de abajo solo enseña el último.
    try { (window as any).__hekatanCadEcho?.(txt); } catch {}
  };

  // ── EL PROMPT: qué se espera AHORA, en el léxico de AutoCAD ──────────────
  // «Precise primer punto:», «Precise punto siguiente o [Cerrar/desHacer]:».
  // Se deduce del estado (herramienta, clics pendientes, polilínea en curso)
  // y no de cada rama del manejador de clic: así ninguna rama se lo salta.
  // La ventana de comandos lo pinta en su línea de prompt y el Dynamic Input
  // pegado al cursor lo repite en corto.
  const PROMPT_IDLE = "Comando:";
  const promptFor = (): { txt: string; ops: string[] } => {
    const tool = (window as any).__hekatanCadState?.get?.()?.tool ?? "select";
    const polys = drawingObj.polylines?.rawVal ?? [];
    const last = polys.length ? polys[polys.length - 1] : [];
    const n = pendingClicks.length;
    const P = (txt: string, ops: string[] = []) => ({ txt, ops });
    switch (tool) {
      case "line":
        return last.length >= 2 ? P("LÍNEA Precise punto siguiente o", ["Cerrar", "desHacer"])
             : last.length === 1 ? P("LÍNEA Precise punto siguiente o", ["desHacer"])
             : P("LÍNEA Precise primer punto:");
      case "polyline":
        return last.length >= 2 ? P("POLILÍNEA Precise punto siguiente o", ["Cerrar", "desHacer"])
             : last.length === 1 ? P("POLILÍNEA Precise punto siguiente o", ["desHacer"])
             : P("POLILÍNEA Precise punto inicial:");
      case "node": return P("NUDO Precise punto:");
      case "area": return P(`LOSA Precise vértice ${Math.min(last.length + 1, 4)} de 4 (en orden, antihorario):`);
      case "rectarea": return n ? P("LOSA RECTANGULAR Precise otra esquina:") : P("LOSA RECTANGULAR Precise primera esquina:");
      case "polyarea": return P(`ÁREA LIBRE Precise vértice ${polyAreaPts.length + 1} (Enter o clic derecho cierra y malla):`);
      case "fillarea": return P("RELLENAR ÁREA Haga clic DENTRO de una celda cerrada por barras (4 lados) y se crea el área:");
      case "medir": return P(`REGLA ${measurePts.length === 1 ? "Marque el 2º punto (distancia en vivo):" : "Marque el 1er punto a medir (sobre el modelo o la grilla):"}`);
      case "rect": return n ? P("RECTÁNGULO Precise otra esquina:") : P("RECTÁNGULO Precise primera esquina:");
      case "circle": return n ? P("CÍRCULO Precise radio (clic o teclee la cifra):") : P("CÍRCULO Precise centro:");
      case "arc": return n === 0 ? P("ARCO Precise punto inicial:") : n === 1 ? P("ARCO Precise segundo punto:") : P("ARCO Precise punto final:");
      case "parabola": return P(`PARÁBOLA Precise punto ${n + 1} de 3 (pasa por los tres):`);
      case "cubica": return P(`CÚBICA Precise punto ${n + 1} de 4 (pasa por los cuatro):`);
      case "revolve": return P("REVOLUCIÓN Precise un punto del eje vertical (Z) alrededor del que gira la selección:");
      case "loft": return P("BARRIDO Precise el centro de la planta (eje Z desde el que se mide la panza del perfil):");
      case "col": return P(`COLUMNA Precise punto de inserción (altura ${pendingHeight > 0 ? pendingHeight : 3} m; teclee otra + Enter antes del clic):`);
      case "wall": return n ? P("MURO Precise segundo punto de la base:")
                            : P(`MURO Precise primer punto de la base (altura ${pendingHeight > 0 ? pendingHeight : 3} m; teclee otra + Enter):`);
      case "plane3": return P(`PLANO Precise punto ${n + 1} de 3:`);
      case "extp": return P("EXTRUIR Precise el nudo a levantar (altura: teclee la cifra + Enter):");
      case "extl": return P("EXTRUIR Precise la línea a levantar:");
      case "extend": return !designado ? P("ALARGAR Designe el contorno hasta el que alargar:")
                                       : P("ALARGAR Designe la línea a alargar, cerca del extremo libre:");
      case "trim": return !designado ? P("RECORTAR Designe el contorno de corte:")
                                     : P("RECORTAR Designe el trozo de línea a quitar:");
      case "offset": return !designado
        ? P(`DESFASE Designe la línea a desfasar${pendingDist > 0 ? ` (distancia ${pendingDist} m)` : " (teclee la distancia; sin ella, la copia pasa por el punto del lado)"}:`)
        : P("DESFASE Precise el lado hacia el que va la copia:");
      case "axis": return P("EJE Precise el primer punto del eje:");
      case "aux": return n ? P("AUXILIAR Precise el segundo punto:") : P("AUXILIAR Precise el primer punto:");
      case "auxp": return P("PUNTO AUXILIAR Precise punto:");
      case "chaflan": return n ? P("LOSA CHAFLANES Precise otra esquina:") : P("LOSA CHAFLANES Precise primera esquina:");
      case "delete": return P("BORRAR Designe objetos (pase por encima y haga clic):");
      case "move": return !selection.size ? P("MOVER Designe objetos (S o ventana) y vuelva a M:")
                    : n ? P("MOVER Precise segundo punto (o teclee @dx,dy,dz):") : P("MOVER Precise punto base:");
      case "copy": return !selection.size ? P("COPIAR Designe objetos (S o ventana) y vuelva a CO:")
                    : n ? P("COPIAR Precise segundo punto (o teclee @dx,dy,dz):") : P("COPIAR Precise punto base:");
      case "select": return selection.size
        ? P(`SELECCIÓN ${selection.size} objeto${selection.size === 1 ? "" : "s"} · Supr borra · M mueve · CO copia · Esc suelta:`)
        : P("Designe objetos (clic-clic: ventana izq→der, captura der→izq) o teclee un comando:");
      default: return P(PROMPT_IDLE);
    }
  };
  const refreshPrompt = () => {
    try {
      const p = promptFor();
      // ── LIENZO EN BLANCO: decir SOBRE QUÉ referenciarse ────────────────────
      //
      // «¿Cómo me guío, sobre qué me referencio?». La rejilla de fondo NO es una
      // referencia: es papel cuadriculado. La referencia de verdad, en ETABS y en
      // Revit, son los EJES de replanteo (A/B/C · 1/2/3) y los niveles; en AutoCAD,
      // la coordenada tecleada y, a partir del segundo punto, distancia y ángulo.
      // Con el lienzo vacío no hay ni una cosa ni la otra, así que se dice.
      const hayEjes = (((window as any).__hekatanAxisGrids?.rawVal
                      ?? (window as any).__hekatanAxisGrids?.val
                      ?? (window as any).__hekatanAxisGrids) as any[] | undefined)?.length ?? 0;
      const hayPuntos = (drawingObj.points?.rawVal ?? []).length;
      const pideOrigen = /primer punto|punto inicial|vértice 1|Precise punto:/i.test(p.txt);
      const txt = (pideOrigen && !hayEjes && !hayPuntos)
        ? `${p.txt}  —  teclee la coordenada (0,0,0) o pulse 🏗 Rejilla para replantear ejes y niveles`
        : p.txt;
      (window as any).__hekatanCadPrompt?.(txt, p.ops);
    } catch {}
  };
  (window as any).__hekatanCadRefreshPrompt = refreshPrompt;
  // Refresh expuesto al window — para que main.ts y otros listeners
  // (F8, toggle planos, slider Cota Z, cambio de tool) puedan refrescar
  // el status sin saber el texto del tool actual.
  (window as any).__hekatanRefreshStatus = () => {
    const cur = (window as any).__hekatanCadStatusText ?? "";
    // Quitar sufijo previo (split por "   |   " que es nuestro separador)
    const baseTxt = cur.split("   |   ")[0] ?? cur;
    updateStatus(baseTxt);
  };
  // Reset pendingClicks cuando el usuario cambia de tool
  (window as any).__hekatanCadResetPending = () => {
    pendingClicks = [];
    polyAreaPts = [];
    polyAreaPreview.visible = false;
    cerrarPolilinea();
    designado = null;
    viewerRender();
    updateStatus("🛠 Tool cambiado — clicks pendientes limpiados");
    refreshPrompt();
  };

  /**
   * Cierra la polilínea en curso y tira las que no llegan a ser nada.
   *
   * Una polilínea de 0 ó 1 punto NO es ningún frame: es el hueco que queda al
   * cambiar de herramienta a medio dibujar. Se acumulaban en la lista
   * ([0,2,2,1,2,...]) y ensuciaban el modelo y cualquier recuento. Y hace
   * falta dejar SIEMPRE una vacía al final, porque el clic escribe sobre la
   * última de la lista.
   */
  function cerrarPolilinea(): void {
    if (!drawingObj.polylines) return;
    const buenas = drawingObj.polylines.rawVal.filter((p) => p.length >= 2);
    drawingObj.polylines.val = [...buenas, []];
  }
  (window as any).__hekatanCerrarPolilinea = cerrarPolilinea;

  // ── UNDO STACK (Ctrl+Z) ──
  // Snapshot del estado de drawing ANTES de cada modificación. Ctrl+Z hace
  // pop y restaura. Limit 100 estados para no consumir mucha RAM.
  const undoStack: { p: any; l: any; a: any }[] = [];
  // Rehacer (Ctrl+Y / Ctrl+Shift+Z): lo que se deshizo se guarda aquí y se
  // vacía en cuanto se dibuja algo nuevo, como en cualquier editor.
  const redoStack: { p: any; l: any; a: any }[] = [];
  // Las líneas AUXILIARES también entran en el deshacer (Jorge, 13-sep-2026: «no hay
  // Ctrl+Z, ojo con eso»): una guía de cúpula dibujada como auxiliar no se deshacía,
  // y al deshacer una revolución las guías borradas no volvían.
  const auxSnap = () => { const st = (window as any).__hekatanDrawingAuxLines; return JSON.parse(JSON.stringify(st?.rawVal ?? st?.val ?? [])); };
  // Y las REJILLAS y los EJES también, por lo mismo (Jorge, 16-sep-2026: «¿qué es eso
  // de rejilla, no se puede eliminar cuando ya se coloca?»). Medido: 🏗 Rejilla metía
  // 100 nudos, 9 ejes y 2 niveles y Ctrl+Z no tocaba nada de eso, porque el snapshot
  // solo guardaba el dibujo. Lo que no está en la foto no se puede deshacer.
  const ejesSnap = () => JSON.parse(JSON.stringify((window as any).__hekatanAxisGrids ?? []));
  const nivSnap = () => JSON.parse(JSON.stringify((window as any).__hekatanLevels ?? []));
  const auxPlanosSnap = () => JSON.parse(JSON.stringify((window as any).__hekatanPlanosAux ?? []));
  const snapshot = () => ({
    p: JSON.parse(JSON.stringify(drawingObj.points.rawVal ?? [])),
    l: JSON.parse(JSON.stringify(drawingObj.polylines?.rawVal ?? [])),
    a: JSON.parse(JSON.stringify(drawingObj.areas?.rawVal ?? [])),
    x: auxSnap(),
    e: ejesSnap(),
    n: nivSnap(),
    g: auxPlanosSnap(),
  });
  const restore = (s: { p: any; l: any; a: any; x?: any; e?: any; n?: any; g?: any }) => {
    drawingObj.points.val = s.p;
    if (drawingObj.polylines) drawingObj.polylines.val = s.l;
    if (drawingObj.areas) drawingObj.areas.val = s.a;
    if (s.x) { const st = (window as any).__hekatanDrawingAuxLines; if (st && "val" in st) st.val = s.x; }
    // ejes, niveles y grillas auxiliares: son ARRAYS compartidos por referencia con el
    // panel, así que se vacían y se rellenan en su sitio en vez de reasignarlos.
    if (s.e) { const A = (window as any).__hekatanAxisGrids; if (Array.isArray(A)) { A.length = 0; A.push(...s.e); } }
    if (s.n) { const L = (window as any).__hekatanLevels; if (Array.isArray(L)) { L.length = 0; L.push(...s.n); } }
    if (s.g) { const G = (window as any).__hekatanPlanosAux; if (Array.isArray(G)) { G.length = 0; G.push(...s.g); }
               else (window as any).__hekatanPlanosAux = s.g; }
    try { (window as any).__hekatanRefreshAxes?.(); (window as any).__hekatanRefreshLevels?.(); } catch {}
    try { (window as any).__hekatanRefrescarGrillas?.(); } catch {}
    pendingClicks = [];
    rubberBand.visible = false;
    polarLines.visible = false;
    hideRubberLabel();
    try { (window as any).__hekatanRebuild?.(); } catch {}
    viewerRender();
    refreshPrompt();
  };
  const pushUndo = () => {
    undoStack.push(snapshot());
    if (undoStack.length > 100) undoStack.shift();
    redoStack.length = 0;
  };
  const undo = () => {
    const prev = undoStack.pop();
    if (!prev) {
      updateStatus("↶ Nada para deshacer");
      return;
    }
    redoStack.push(snapshot());
    restore(prev);
    updateStatus(`↶ Deshacer — quedan ${undoStack.length}`);
  };
  const redo = () => {
    const next = redoStack.pop();
    if (!next) {
      updateStatus("↷ Nada para rehacer");
      return;
    }
    undoStack.push(snapshot());
    restore(next);
    updateStatus(`↷ Rehacer — quedan ${redoStack.length}`);
  };
  (window as any).__hekatanPushUndo = pushUndo;
  (window as any).__hekatanUndo = undo;
  (window as any).__hekatanRedo = redo;
  document.addEventListener("keydown", (ev: KeyboardEvent) => {
    const k = ev.key.toLowerCase();
    const esRedo = (ev.ctrlKey || ev.metaKey) && (k === "y" || (k === "z" && ev.shiftKey));
    if (!esRedo) return;
    const tgt = ev.target as HTMLInputElement | null;
    const enTexto = tgt && (tgt.tagName === "INPUT" || tgt.tagName === "TEXTAREA")
      && tgt.type !== "checkbox" && tgt.type !== "range" && (tgt.value?.length ?? 0) > 0 && !!(tgt as any).__hkSucio;
    if (enTexto) return;
    ev.preventDefault(); ev.stopPropagation();
    redo();
  }, { capture: true });

  // ── Las OPCIONES del prompt, como en AutoCAD: [Cerrar/desHacer] ──────────
  // Se teclean en la caja de comandos mientras hay una línea en curso.
  //   C / cerrar   → une el último punto con el primero y termina.
  //   U / deshacer → quita SOLO el último punto (no todo el trazo).
  (window as any).__hekatanCadOption = (op: string): boolean => {
    const o = op.trim().toLowerCase();
    const tool = (window as any).__hekatanCadState?.get?.()?.tool;
    if (!drawingObj.polylines) return false;
    const polys = drawingObj.polylines.rawVal;
    const last = polys.length ? polys[polys.length - 1] : [];
    if (tool !== "line" && tool !== "polyline") {
      if (o === "u" || o === "deshacer" || o === "undo") { undo(); return true; }
      return false;
    }
    if (o === "c" || o === "cerrar" || o === "close") {
      if (last.length < 3) { updateStatus("Cerrar necesita al menos tres puntos."); return true; }
      pushUndo();
      drawingObj.polylines.val = [...polys.slice(0, -1), [...last, last[0]], []];
      try { (window as any).__hekatanRebuild?.(); } catch {}
      finalizeDraw();
      updateStatus(`✓ Polilínea cerrada — ${last.length} tramos.`);
      return true;
    }
    if (o === "u" || o === "deshacer" || o === "undo") {
      if (!last.length) { undo(); return true; }
      pushUndo();
      const quitado = last[last.length - 1];
      const rest = last.slice(0, -1);
      // el punto sale también de la lista de puntos si nadie más lo usa
      const usado = polys.some((pl, i) => i !== polys.length - 1 && pl.includes(quitado)) || rest.includes(quitado);
      let pts = drawingObj.points.rawVal;
      let nuevas = [...polys.slice(0, -1), rest];
      if (!usado && quitado === pts.length - 1) {
        pts = pts.slice(0, -1);
        drawingObj.points.val = pts;
      }
      drawingObj.polylines.val = nuevas;
      if (rest.length) {
        const p = pts[rest[rest.length - 1]];
        if (p) rubberStart = [p[0], p[1], p[2]];
      } else { rubberStart = null; rubberBand.visible = false; }
      try { (window as any).__hekatanRebuild?.(); } catch {}
      viewerRender();
      updateStatus(`↶ Último punto quitado — quedan ${rest.length}.`);
      refreshPrompt();
      return true;
    }
    return false;
  };
  // Ctrl+Z / Cmd+Z global — usar CAPTURE phase para interceptar ANTES que
  // los inputs de Tweakpane (sino el input hace su undo de texto y se come
  // el evento, nunca llegando al window listener).
  // Excepción: si el target es un input de TEXTO con value modificado,
  // dejamos que el browser haga su undo nativo del texto. Solo capturamos
  // cuando el focus está en el body, canvas, o un input vacío.
  // ⚠️ «Input de texto no vacío» NO basta: tras tocar un mando de Tweakpane
  // («Segmentos arc/círc» = 8) el foco se queda en ese input, que nunca está
  // vacío, y Ctrl+Z hacía el deshacer del navegador sobre el «8»: para el
  // usuario, «no hay Ctrl+Z» (Jorge, 13-sep-2026). Solo se cede al nativo si el
  // input se está EDITANDO de verdad (ha recibido tecleo desde que tomó el foco).
  document.addEventListener("input", (ev) => { const t = ev.target as HTMLElement | null; if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) (t as any).__hkSucio = true; }, { capture: true });
  document.addEventListener("focusout", (ev) => { const t = ev.target as HTMLElement | null; if (t) (t as any).__hkSucio = false; }, { capture: true });
  document.addEventListener("keydown", (ev: KeyboardEvent) => {
    if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === "z" && !ev.shiftKey) {
      const tgt = ev.target as HTMLElement;
      const tag = tgt?.tagName;
      const isTextInput = (tag === "INPUT" || tag === "TEXTAREA")
        && (tgt as HTMLInputElement).type !== "checkbox"
        && (tgt as HTMLInputElement).type !== "range"
        && (tgt as HTMLInputElement).value?.length > 0
        && !!(tgt as any).__hkSucio;
      if (isTextInput) return;  // browser native undo (solo mientras se teclea en él)
      ev.preventDefault();
      ev.stopPropagation();
      undo();
    }
  }, { capture: true });

  // ── FINALIZAR DIBUJO (Esc / botón Tweakpane / click derecho del usuario) ──
  // Termina la polilínea actual (push empty), libera axis lock, oculta
  // rubber band y polar lines. Equivalente a "ya terminé este trazo, pasá al
  // siguiente click como inicio de algo nuevo".
  const finalizeDraw = () => {
    pendingClicks = [];
    designado = null;
    // Cierra la polilínea en curso Y descarta las que se quedaron en 0 ó 1
    // punto: eso no es ningún frame, es el hueco de haber cambiado de
    // herramienta a medio dibujar. Antes solo se añadía una vacía al final y
    // las huérfanas se iban acumulando en la lista.
    cerrarPolilinea();
    // Liberar axis lock
    axisLock = null;
    updateAxisLockBadge();
    // Ocultar rubber band y polar lines
    rubberBand.visible = false;
    polarLines.visible = false;
    hideRubberLabel();
    updateStatus("⏹ Dibujo finalizado — click para empezar otra serie");
    viewerRender();
    refreshPrompt();
  };
  (window as any).__hekatanFinalizeDraw = finalizeDraw;

  // ⎋ ESC universal: cancela la acción en curso Y deselecciona. Antes ESC solo
  // finalizaba el dibujo (no limpiaba la selección) y encima el command bar se
  // lo comía → "ESC no servía". Esto limpia clicks pendientes, polígono libre,
  // selección + panel de propiedades, y finaliza el dibujo.
  const escapeCancel = () => {
    pendingClicks = [];
    polyAreaPts = [];
    polyAreaPreview.visible = false;
    let hadSel = false;
    if (selection.size) { selection.clear(); refreshSelectionGroup(); hadSel = true; }
    finalizeDraw();
    // ── Esc SUELTA la herramienta, como en AutoCAD ───────────────────────────
    //
    // La herramienta se quedaba pegada: se dibujaba una linea, se pulsaba Esc
    // para terminarla, y el tool seguia siendo "line". Como la ventana de
    // seleccion solo arranca con el tool en "select", arrastrar despues de
    // dibujar no seleccionaba NI PINTABA EL RECTANGULO — parecia que la
    // seleccion por ventana no existiera.
    //
    // En AutoCAD, Esc termina el comando y te deja sin comando: a partir de
    // ahi, arrastrar sobre el vacio abre la ventana de seleccion. Para dibujar
    // otra linea se vuelve a pulsar L, que es un tecleo.
    try {
      const st = (window as any).__hekatanCadState;
      const t = st?.get?.()?.tool;
      if (t && t !== "select") st?.setTool?.("select");
    } catch {}
    updateStatus(hadSel ? "⎋ Selección cancelada" : "⎋ Sin herramienta — clic-clic para seleccionar por ventana");
    viewerRender();
    refreshPrompt();
  };
  (window as any).__hekatanEscapeCancel = escapeCancel;

  // ── MOVER y COPIAR la selección con dos puntos (base → destino) ──────────
  // Es el MOVE/COPY de AutoCAD: se designan los objetos, punto base, segundo
  // punto. Se traslada cada NUDO de la selección (los tramos y áreas que los
  // usan van con ellos, como al mover un nudo en ETABS). COPIAR reusa
  // __hekatanReplicateSelection con una sola copia. Devuelve cuántos nudos.
  const nudosDeSeleccion = (): Set<number> => {
    const polys = drawingObj.polylines?.rawVal ?? [];
    const nodeSet = new Set<number>();
    selection.forEach((id) => {
      if (id.startsWith("pt:")) nodeSet.add(+id.slice(3));
      else if (id.startsWith("poly:")) (polys[+id.slice(5)] || []).forEach((n) => nodeSet.add(n));
      else if (id.startsWith("seg:")) {
        const parts = id.split(":"); const poly = polys[+parts[1]] || [];
        const a = poly[+parts[2]], b = poly[+parts[2] + 1];
        if (a != null) nodeSet.add(a); if (b != null) nodeSet.add(b);
      }
    });
    return nodeSet;
  };
  const moveSelection = (dx: number, dy: number, dz: number): number => {
    const nodeSet = nudosDeSeleccion();
    if (!nodeSet.size) return 0;
    pushUndo();
    const pts = drawingObj.points.rawVal.map((p, i) =>
      nodeSet.has(i) ? [p[0] + dx, p[1] + dy, p[2] + dz] : p) as [number, number, number][];
    drawingObj.points.val = pts;
    try { (window as any).__hekatanRebuild?.(); } catch {}
    refreshSelectionGroup();
    viewerRender();
    return nodeSet.size;
  };
  (window as any).__hekatanMoveSelection = moveSelection;
  // Un paso de MOVER/COPIAR con un punto (clic o coordenada tecleada).
  const pasoMoverCopiar = (tool: string, pt: [number, number, number]): void => {
    if (!selection.size) {
      updateStatus(`${tool === "move" ? "MOVER" : "COPIAR"}: primero designe objetos (S, o ventana), luego vuelva al comando.`);
      (window as any).__hekatanCadState?.setTool?.("select");
      refreshPrompt();
      return;
    }
    pendingClicks.push(pt);
    if (pendingClicks.length === 1) {
      rubberStart = pt;
      updateStatus(`${tool === "move" ? "MOVER" : "COPIAR"} punto base (${pt[0].toFixed(2)}, ${pt[1].toFixed(2)}, ${pt[2].toFixed(2)}). Precise el segundo punto.`);
      refreshPrompt();
      return;
    }
    const [a, b] = pendingClicks;
    const d: [number, number, number] = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    pendingClicks = [];
    rubberBand.visible = false;
    let n = 0;
    if (tool === "move") n = moveSelection(d[0], d[1], d[2]);
    else n = nudosDeSeleccion().size, (window as any).__hekatanReplicateSelection?.(d[0], d[1], d[2], 1);
    updateStatus(`✓ ${tool === "move" ? "Movidos" : "Copiados"} ${n} nudo${n === 1 ? "" : "s"} — Δ (${d[0].toFixed(2)}, ${d[1].toFixed(2)}, ${d[2].toFixed(2)}) m.`);
    if (tool === "move") { selection.clear(); refreshSelectionGroup(); }
    (window as any).__hekatanCadState?.setTool?.("select");
    refreshPrompt();
  };
  (window as any).__hekatanPasoMoverCopiar = pasoMoverCopiar;

  // ── DESFASE · RECORTAR · ALARGAR — el OFFSET / TRIM / EXTEND de AutoCAD ────
  // Los tres empiezan DESIGNANDO una linea (pasa a rojo bajo el cursor, clic):
  //   DESFASE : la linea a copiar en paralelo; luego un clic en el lado. La
  //             distancia se teclea antes (una cifra + Enter) o, si no hay,
  //             la copia pasa POR el punto del lado ("a traves de").
  //   RECORTAR: el contorno de corte; luego clic en el trozo que sobra. El
  //             tramo se parte en el cruce y se quita el lado clicado.
  //   ALARGAR : el contorno; luego clic en la linea a alargar, cerca de su
  //             extremo libre, que se lleva hasta el cruce con el contorno.
  type P3 = [number, number, number];
  const normalPlano = (): P3 => {
    const wp = (window as any).__hekatanCadState?.get?.()?.workPlane ?? "xy";
    return wp === "xz" ? [0, 1, 0] : wp === "yz" ? [1, 0, 0] : [0, 0, 1];
  };
  const d3 = (a: P3, b: P3) => Math.hypot(a[0]-b[0], a[1]-b[1], a[2]-b[2]);
  // Puntos mas proximos de dos rectas (p1->p2, p3->p4). Devuelve el cruce si
  // casi se tocan; `libreA`/`libreB` permiten salirse del tramo (prolongarlo).
  const cruceRectas = (p1: P3, p2: P3, p3: P3, p4: P3, libreA: boolean, libreB: boolean): P3 | null => {
    const u = [p2[0]-p1[0], p2[1]-p1[1], p2[2]-p1[2]], v = [p4[0]-p3[0], p4[1]-p3[1], p4[2]-p3[2]];
    const w = [p1[0]-p3[0], p1[1]-p3[1], p1[2]-p3[2]];
    const A = u[0]*u[0]+u[1]*u[1]+u[2]*u[2], B = u[0]*v[0]+u[1]*v[1]+u[2]*v[2], C = v[0]*v[0]+v[1]*v[1]+v[2]*v[2];
    const D = u[0]*w[0]+u[1]*w[1]+u[2]*w[2], E = v[0]*w[0]+v[1]*w[1]+v[2]*w[2];
    const den = A*C - B*B;
    if (den < 1e-12) return null;
    const sA = (B*E - C*D) / den, tB = (A*E - B*D) / den;
    if (!libreA && (sA < -1e-6 || sA > 1 + 1e-6)) return null;
    if (!libreB && (tB < -1e-6 || tB > 1 + 1e-6)) return null;
    const q1: P3 = [p1[0]+sA*u[0], p1[1]+sA*u[1], p1[2]+sA*u[2]];
    const q2: P3 = [p3[0]+tB*v[0], p3[1]+tB*v[1], p3[2]+tB*v[2]];
    if (d3(q1, q2) > 1e-4) return null;
    return q1;
  };
  const usosDePunto = (idx: number) =>
    (drawingObj.polylines?.rawVal ?? []).reduce((n, pl) => n + pl.filter((k) => k === idx).length, 0);
  const NOMBRE_MOD: Record<string, string> = { offset: "DESFASE", trim: "RECORTAR", extend: "ALARGAR" };
  const pasoModificar = (tool: string, click: P3): void => {
    if (!drawingObj.polylines) return;
    const polys = drawingObj.polylines.rawVal;
    const pts = drawingObj.points.rawVal as P3[];
    const nombre = NOMBRE_MOD[tool];
    if (!designado) {
      if (hoveredPolyIndex < 0) { updateStatus(`${nombre}: pase el cursor por una línea (se pone roja) y haga clic.`); return; }
      designado = { poly: hoveredPolyIndex, seg: Math.max(0, hoveredSegIndex) };
      updateStatus(tool === "offset"
        ? `DESFASE línea #${designado.poly + 1} designada — clic en el lado hacia el que va la copia${pendingDist > 0 ? ` (${pendingDist} m)` : ""}.`
        : tool === "trim" ? "RECORTAR contorno designado — clic en el trozo de línea a quitar."
        : "ALARGAR contorno designado — clic en la línea a alargar, cerca del extremo libre.");
      refreshPrompt();
      return;
    }
    if (tool === "offset") {
      const P = designado.poly; const poly = polys[P];
      if (!poly || poly.length < 2) { designado = null; updateStatus("DESFASE: esa polilínea no tiene tramos."); refreshPrompt(); return; }
      const cerrada = poly.length > 2 && poly[0] === poly[poly.length - 1];
      const nrm = normalPlano();
      const segs = [] as { a: P3; b: P3; n: P3 }[];
      for (let i = 0; i < poly.length - 1; i++) {
        const a = pts[poly[i]], b = pts[poly[i + 1]];
        const u = [b[0]-a[0], b[1]-a[1], b[2]-a[2]]; const L = Math.hypot(u[0], u[1], u[2]) || 1;
        const ux = u[0]/L, uy = u[1]/L, uz = u[2]/L;
        // normal en el plano de trabajo: n = nrm x u
        const nn: P3 = [nrm[1]*uz - nrm[2]*uy, nrm[2]*ux - nrm[0]*uz, nrm[0]*uy - nrm[1]*ux];
        const Ln = Math.hypot(nn[0], nn[1], nn[2]) || 1;
        segs.push({ a, b, n: [nn[0]/Ln, nn[1]/Ln, nn[2]/Ln] });
      }
      // el tramo mas cercano al clic decide el LADO (y la distancia si no se tecleo)
      let iNear = 0, dNear = Infinity;
      segs.forEach((sg, i) => {
        const d = distPointSeg(click[0], click[1], click[2], sg.a[0], sg.a[1], sg.a[2], sg.b[0], sg.b[1], sg.b[2]);
        if (d < dNear) { dNear = d; iNear = i; }
      });
      const sn = segs[iNear];
      const lado = Math.sign((click[0]-sn.a[0])*sn.n[0] + (click[1]-sn.a[1])*sn.n[1] + (click[2]-sn.a[2])*sn.n[2]) || 1;
      const dist = pendingDist > 0 ? pendingDist : dNear;
      if (dist < 1e-6) { updateStatus("DESFASE: distancia nula — teclee una distancia o clique más lejos."); return; }
      const off = segs.map((sg) => ({
        a: [sg.a[0] + lado*dist*sg.n[0], sg.a[1] + lado*dist*sg.n[1], sg.a[2] + lado*dist*sg.n[2]] as P3,
        b: [sg.b[0] + lado*dist*sg.n[0], sg.b[1] + lado*dist*sg.n[1], sg.b[2] + lado*dist*sg.n[2]] as P3,
      }));
      const m = off.length;
      const vertice = (j: number): P3 => {
        // j = vertice entre el tramo j-1 y el j (esquina a inglete)
        const prev = off[(j - 1 + m) % m], next = off[j % m];
        const q = cruceRectas(prev.a, prev.b, next.a, next.b, true, true);
        return q ?? next.a;
      };
      const nuevos: P3[] = [];
      const nV = cerrada ? m : m + 1;
      for (let j = 0; j < nV; j++) {
        if (!cerrada && j === 0) nuevos.push(off[0].a);
        else if (!cerrada && j === m) nuevos.push(off[m - 1].b);
        else nuevos.push(vertice(j));
      }
      pushUndo();
      const base = pts.length;
      drawingObj.points.val = [...pts, ...nuevos];
      const idx = nuevos.map((_, i) => base + i);
      if (cerrada) idx.push(base);
      let lista = polys.slice();
      if (lista.length && lista[lista.length - 1].length === 0) lista = lista.slice(0, -1);
      drawingObj.polylines.val = [...lista, idx, []];
      designado = null;
      updateStatus(`✓ Desfase a ${dist.toFixed(2)} m — ${m} tramo${m === 1 ? "" : "s"} nuevo${m === 1 ? "" : "s"}. Designe otra línea o Esc.`);
      try { (window as any).__hekatanRebuild?.(); } catch {}
      viewerRender();
      refreshPrompt();
      return;
    }
    // RECORTAR / ALARGAR: hace falta OTRA linea bajo el cursor. Cerca del
    // cruce el OSNAP imanta el cursor al punto de interseccion, donde las dos
    // lineas estan a distancia cero y el hover puede quedarse con el propio
    // contorno: entonces se busca la otra linea mas cercana al clic.
    let P = hoveredPolyIndex, S = Math.max(0, hoveredSegIndex);
    if (P < 0 || (P === designado.poly && S === designado.seg)) {
      const tolB = ((window as any).__hekatanSnap2D ?? 0.5) * 1.5;
      let mejor = tolB;
      P = -1;
      polys.forEach((pl, i) => {
        for (let j = 0; j < pl.length - 1; j++) {
          if (i === designado!.poly && j === designado!.seg) continue;
          const a0 = pts[pl[j]], b0 = pts[pl[j + 1]];
          if (!a0 || !b0) continue;
          const d = distPointSeg(click[0], click[1], click[2], a0[0], a0[1], a0[2], b0[0], b0[1], b0[2]);
          if (d < mejor) { mejor = d; P = i; S = j; }
        }
      });
      if (P < 0) { updateStatus(`${nombre}: pase el cursor por OTRA línea y haga clic.`); return; }
    }
    const pc = polys[designado.poly];
    const c1 = pts[pc[designado.seg]], c2 = pts[pc[designado.seg + 1]];
    const poly = polys[P]; const ia = poly[S], ib = poly[S + 1];
    if (!c1 || !c2 || ia == null || ib == null) { updateStatus(`${nombre}: no se pudo leer el tramo.`); return; }
    const a = pts[ia], b = pts[ib];
    if (tool === "trim") {
      const q = cruceRectas(a, b, c1, c2, false, false);
      if (!q) { updateStatus("RECORTAR: esa línea no cruza el contorno designado."); return; }
      pushUndo();
      const iq = pts.length;
      drawingObj.points.val = [...pts, q];
      const partido = [...poly.slice(0, S + 1), iq, ...poly.slice(S + 1)];
      drawingObj.polylines.val = polys.map((pl, i) => (i === P ? partido : pl));
      const ladoA = d3(click, a) < d3(click, b);
      deleteSeg(P, ladoA ? S : S + 1);
      updateStatus(`✓ Recortado en (${q[0].toFixed(2)}, ${q[1].toFixed(2)}, ${q[2].toFixed(2)}). Designe otro trozo o Esc.`);
    } else {
      const q = cruceRectas(a, b, c1, c2, true, false);
      if (!q) { updateStatus("ALARGAR: ni prolongada llega esa línea al contorno."); return; }
      const cercaA = d3(click, a) < d3(click, b);
      const pos = cercaA ? S : S + 1;
      if (pos !== 0 && pos !== poly.length - 1) { updateStatus("ALARGAR: solo se alarga un extremo libre de la polilínea."); return; }
      const iExt = poly[pos];
      // si el cruce cae DENTRO del tramo, eso es recortar, no alargar
      const dentro = d3(q, a) + d3(q, b) < d3(a, b) + 1e-6;
      if (dentro) { updateStatus("ALARGAR: el contorno corta el tramo por dentro; use RECORTAR."); return; }
      pushUndo();
      if (usosDePunto(iExt) > 1) {
        // el extremo lo comparte otra linea: nudo nuevo solo para esta
        const iq = pts.length;
        drawingObj.points.val = [...pts, q];
        const nuevo = poly.slice(); nuevo[pos] = iq;
        drawingObj.polylines.val = polys.map((pl, i) => (i === P ? nuevo : pl));
      } else {
        drawingObj.points.val = pts.map((p, i) => (i === iExt ? q : p));
      }
      updateStatus(`✓ Alargada hasta (${q[0].toFixed(2)}, ${q[1].toFixed(2)}, ${q[2].toFixed(2)}). Designe otra línea o Esc.`);
    }
    // el contorno sigue designado para encadenar recortes, como en AutoCAD
    try { (window as any).__hekatanRebuild?.(); } catch {}
    viewerRender();
    refreshPrompt();
  };

  // ── REPLICAR selección (estilo ETABS "Replicate Linear") ──
  // Clona los nodos + frames/áreas seleccionados `count` veces, cada copia
  // desplazada (dx·i, dy·i, dz·i). Permite duplicar/extender la estructura.
  // cuántos objetos hay designados: lo necesita el comando REPLICAR para avisar
  // «primero designe objetos» en vez de no hacer nada en silencio
  (window as any).__hekatanSelectionSize = () => selection.size;
  // DESIGNAR EL ÚLTIMO — la opción «Last» de la designación de AutoCAD: coge el objeto
  // recién dibujado. Hace falta para replicar UNA parte (el anillo de vigas de una
  // planta) sin arrastrar el resto: con «todo» las columnas de abajo también subirían
  // y el piso de arriba quedaría colgando en vez de apoyado.
  (window as any).__hekatanSelectLast = (): number => {
    const polys = drawingObj.polylines?.rawVal ?? [];
    let i = polys.length - 1;
    while (i >= 0 && (!polys[i] || polys[i].length < 2)) i--;   // la polilínea vacía marca «trazo terminado»
    selection.clear();
    if (i >= 0) selection.add(`poly:${i}`);
    refreshSelectionGroup();
    updateStatus(i >= 0 ? "SELECCIÓN 1 objeto (el último dibujado) · Esc suelta"
                        : "No hay ningún objeto dibujado todavía.");
    return selection.size;
  };
  // DESIGNAR TODO — el «all» de la designación de AutoCAD y el Select All de ETABS.
  // Faltaba: para replicar un piso entero había que encerrarlo con una ventana, y una
  // ventana de píxeles deja fuera lo que no quepa en pantalla. Designa cada polilínea
  // (una polilínea vacía es la marca de «trazo terminado», no un objeto) y los nudos
  // sueltos, que son los que no aparecen en ninguna.
  (window as any).__hekatanSelectAll = (): number => {
    const polys = drawingObj.polylines?.rawVal ?? [];
    const pts = drawingObj.points?.rawVal ?? [];
    selection.clear();
    const enPoly = new Set<number>();
    polys.forEach((pl, i) => {
      if (!pl || pl.length < 2) return;
      selection.add(`poly:${i}`);
      pl.forEach((n) => enPoly.add(n));
    });
    pts.forEach((_, i) => { if (!enPoly.has(i)) selection.add(`pt:${i}`); });
    refreshSelectionGroup();
    updateStatus(`SELECCIÓN ${selection.size} objetos (todo el modelo) · Esc suelta`);
    return selection.size;
  };
  // `desde` = cuántas copias hay YA puestas a ese mismo paso. Sin él, «x5» volvía
  // a poner la copia 1 encima de la que ya estaba: dos barras en el mismo sitio,
  // el doble de rigidez en esa planta y nada que lo delate en pantalla.
  (window as any).__hekatanReplicateSelection = (
    dx: number, dy: number, dz: number, count: number, desde = 0,
  ): number => {
    count = Math.max(1, Math.round(count || 1));
    desde = Math.max(0, Math.round(desde || 0));
    const ids = [...selection];
    const pts = drawingObj.points.rawVal;
    const polys = drawingObj.polylines?.rawVal ?? [];
    const areaSet = new Set(drawingObj.areas?.rawVal ?? []);
    const nodeSet = new Set<number>();
    const polyIdxSet = new Set<number>();
    const segPairs: [number, number][] = [];
    // ⚠️ La designación puede haber QUEDADO VIEJA: «/5» deshace la réplica que
    // había, y las copias que se lleva el deshacer siguen designadas. Con
    // `polys[p].map` sobre una polilínea que ya no existe se caía todo el visor
    // («Cannot read properties of undefined»). Se queda con lo que sobrevive —
    // que son justo los objetos originales, los que hay que volver a sembrar.
    ids.forEach((id) => {
      if (id.startsWith("pt:")) { const n = +id.slice(3); if (pts[n]) nodeSet.add(n); }
      else if (id.startsWith("poly:")) {
        const p = +id.slice(5);
        if (!polys[p] || polys[p].length < 2) return;
        polyIdxSet.add(p);
        polys[p].forEach((n) => nodeSet.add(n));
      } else if (id.startsWith("seg:")) {
        const parts = id.split(":"); const P = +parts[1], S = +parts[2];
        const poly = polys[P] || []; const a = poly[S], b = poly[S + 1];
        if (a != null && b != null) { segPairs.push([a, b]); nodeSet.add(a); nodeSet.add(b); }
      }
    });
    if (!nodeSet.size) return 0;
    pushUndo();
    const newPts = [...pts];
    let newPolys = polys.slice();
    if (newPolys.length && newPolys[newPolys.length - 1].length === 0) newPolys = newPolys.slice(0, -1);
    const newAreas = [...(drawingObj.areas?.rawVal ?? [])];
    const origNodes = [...nodeSet];
    for (let i = 1; i <= count; i++) {
      const j = desde + i;
      const ox = dx * j, oy = dy * j, oz = dz * j;
      const map = new Map<number, number>();
      origNodes.forEach((n) => {
        map.set(n, newPts.length);
        newPts.push([pts[n][0] + ox, pts[n][1] + oy, pts[n][2] + oz]);
      });
      polyIdxSet.forEach((p) => {
        const cloned = polys[p].map((n) => (map.has(n) ? map.get(n)! : n));
        const at = newPolys.length; newPolys.push(cloned);
        if (areaSet.has(p)) newAreas.push(at);
      });
      segPairs.forEach(([a, b]) => { newPolys.push([map.get(a)!, map.get(b)!]); });
    }
    newPolys.push([]);
    drawingObj.points.val = newPts;
    if (drawingObj.polylines) drawingObj.polylines.val = newPolys;
    if (drawingObj.areas) drawingObj.areas.val = newAreas;
    try { (window as any).__hekatanRebuild?.(); } catch {}
    viewerRender();
    return count;
  };

  /**
   * EXTRUIR la designación (Edit › Extrude de ETABS): cada NUDO designado se
   * alarga a una cadena de barras (nudo → línea) y cada BARRA designada barre
   * un paño Q4 por copia (línea → área). Δ es el paso y `count` cuántos pasos.
   * Jorge, 12-sep-2026: «falta que de un nudo se pueda extruir a línea y de
   * línea a área».
   */
  (window as any).__hekatanExtrudeSelection = (
    dx: number, dy: number, dz: number, count: number,
  ): { lineas: number; areas: number } => {
    count = Math.max(1, Math.round(count || 1));
    const ids = [...selection];
    const pts = drawingObj.points.rawVal;
    const polys = drawingObj.polylines?.rawVal ?? [];
    const areasYa = new Set(drawingObj.areas?.rawVal ?? []);
    const nodosSueltos = new Set<number>();
    const segPairs: [number, number][] = [];
    const enSeg = new Set<number>();
    // Nudos que pertenecen a alguna polilínea (barra o área) NO son sueltos:
    // con «seleccionar todo» tras una extrusión, los nudos de los paños ya
    // creados se extruían a barras (medido en la bóveda de la capilla).
    for (const poly of polys) for (const n of poly) enSeg.add(n);
    ids.forEach((id) => {
      if (id.startsWith("poly:")) {
        const p = +id.slice(5); if (areasYa.has(p)) return;   // un paño no se extruye (sería un sólido)
        const poly = polys[p] || [];
        for (let s = 0; s + 1 < poly.length; s++) { segPairs.push([poly[s], poly[s + 1]]); enSeg.add(poly[s]); enSeg.add(poly[s + 1]); }
      } else if (id.startsWith("seg:")) {
        const parts = id.split(":"); const P = +parts[1], S = +parts[2];
        const poly = polys[P] || []; const a = poly[S], b = poly[S + 1];
        if (a != null && b != null) { segPairs.push([a, b]); enSeg.add(a); enSeg.add(b); }
      }
    });
    ids.forEach((id) => { if (id.startsWith("pt:")) { const n = +id.slice(3); if (pts[n] && !enSeg.has(n)) nodosSueltos.add(n); } });
    if (!nodosSueltos.size && !segPairs.length) return { lineas: 0, areas: 0 };
    pushUndo();
    const newPts = [...pts];
    let newPolys = polys.slice();
    if (newPolys.length && newPolys[newPolys.length - 1].length === 0) newPolys = newPolys.slice(0, -1);
    const newAreas = [...(drawingObj.areas?.rawVal ?? [])];
    // copia i del nudo n (misma copia para todos los paños que lo comparten)
    const copia = new Map<string, number>();
    const cop = (n: number, i: number) => {
      if (i === 0) return n;
      const key = n + ":" + i; let j = copia.get(key);
      if (j == null) {
        const q: [number, number, number] = [pts[n][0] + dx * i, pts[n][1] + dy * i, pts[n][2] + dz * i];
        // Si ya hay un nudo ahí (≤ 1 mm) se REUSA: es lo que cose el muro del escalón de la
        // bóveda al borde del ala (ETABS lo haría al mallar por contacto). Sin esto salían
        // dos nudos superpuestos y los paños no se tocaban.
        j = newPts.findIndex((p) => Math.abs(p[0] - q[0]) < 1e-3 && Math.abs(p[1] - q[1]) < 1e-3 && Math.abs(p[2] - q[2]) < 1e-3);
        if (j < 0) { j = newPts.length; newPts.push(q); }
        copia.set(key, j);
      }
      return j;
    };
    let lineas = 0, areas = 0;
    nodosSueltos.forEach((n) => {
      const cadena = [n]; for (let i = 1; i <= count; i++) cadena.push(cop(n, i));
      newPolys.push(cadena); lineas += count;
    });
    segPairs.forEach(([a, b]) => {
      for (let i = 1; i <= count; i++) {
        const q = [cop(a, i - 1), cop(b, i - 1), cop(b, i), cop(a, i)];
        newAreas.push(newPolys.length); newPolys.push([...q, q[0]]); areas++;
      }
    });
    newPolys.push([]);
    drawingObj.points.val = newPts;
    if (drawingObj.polylines) drawingObj.polylines.val = newPolys;
    if (drawingObj.areas) drawingObj.areas.val = newAreas;
    try { (window as any).__hekatanRebuild?.(); } catch {}
    viewerRender();
    return { lineas, areas };
  };

  /**
   * VOLADO sobre las vigas designadas.
   *
   * No alarga la viga: la REPLICA a `largo` metros, en perpendicular, y cose las dos
   * con dos vigas de vuelo — o sea el voladizo que se dibuja de verdad en obra. Una
   * viga de 5 m da un voladizo de `largo` de vuelo por 5 m de ancho.
   *
   *   losa       ON  → el paño queda relleno (una losa en voladizo)
   *                OFF → queda HUECA: solo el marco de vigas
   *   vigaBorde  ON  → se pone la viga del borde libre (la réplica)
   *                OFF → solo las dos vigas de vuelo, sin cerrar
   *   lados      "ambos"  → a los dos lados de la viga
   *              "afuera" → solo hacia fuera del dibujo (el lado que se aleja del centro)
   *
   * La perpendicular se toma EN PLANTA: una viga es horizontal, y el voladizo sale a
   * su lado, no hacia arriba. Si la viga fuera vertical (una columna) no hay plano en
   * el que apoyar el vuelo y se descarta, en vez de sacar un paño de canto.
   */
  (window as any).__hekatanVoladoSelection = (
    largo: number,
    opciones: { losa?: boolean; vigaBorde?: boolean; lados?: "ambos" | "afuera" } = {},
  ): number => {
    const L = Number(largo);
    if (!Number.isFinite(L) || Math.abs(L) < 1e-6) return 0;
    const conLosa = opciones.losa !== false;
    const conBorde = opciones.vigaBorde !== false;
    const lados = opciones.lados === "afuera" ? "afuera" : "ambos";

    const pts = drawingObj.points.rawVal;
    const polys = drawingObj.polylines?.rawVal ?? [];
    // las vigas designadas, como parejas de nudos
    const vigas: [number, number][] = [];
    [...selection].forEach((id) => {
      if (id.startsWith("seg:")) {
        const p = id.split(":"); const P = +p[1], S = +p[2];
        const poly = polys[P] || []; const a = poly[S], b = poly[S + 1];
        if (a != null && b != null) vigas.push([a, b]);
      } else if (id.startsWith("poly:")) {
        const poly = polys[+id.slice(5)] || [];
        for (let i = 0; i + 1 < poly.length; i++) vigas.push([poly[i], poly[i + 1]]);
      }
    });
    if (!vigas.length) return 0;

    // el centro del dibujo, para saber cuál es «afuera»
    let cx = 0, cy = 0;
    for (const p of pts) { cx += p[0]; cy += p[1]; }
    cx /= Math.max(1, pts.length); cy /= Math.max(1, pts.length);

    pushUndo();
    const newPts = [...pts];
    let newPolys = polys.slice();
    if (newPolys.length && newPolys[newPolys.length - 1].length === 0) newPolys = newPolys.slice(0, -1);
    const newAreas = [...(drawingObj.areas?.rawVal ?? [])];
    let hechos = 0;

    for (const [ia, ib] of vigas) {
      const A = pts[ia], B = pts[ib];
      if (!A || !B) continue;
      const dx = B[0] - A[0], dy = B[1] - A[1];
      const len = Math.hypot(dx, dy);
      if (len < 1e-6) continue;                    // vertical en planta: no es viga
      // perpendicular en planta, normalizada
      let px = -dy / len, py = dx / len;
      // ¿hacia dónde es «afuera»? El punto medio de la viga contra el centro del dibujo.
      const mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2;
      if ((mx - cx) * px + (my - cy) * py < 0) { px = -px; py = -py; }
      const sentidos = lados === "ambos" ? [1, -1] : [1];
      for (const s of sentidos) {
        const ox = px * L * s, oy = py * L * s;
        const iA2 = newPts.length; newPts.push([A[0] + ox, A[1] + oy, A[2]]);
        const iB2 = newPts.length; newPts.push([B[0] + ox, B[1] + oy, B[2]]);
        newPolys.push([ia, iA2]);                  // vuelo en el arranque
        newPolys.push([ib, iB2]);                  // vuelo en el otro extremo
        if (conBorde) newPolys.push([iA2, iB2]);   // la viga de borde: la réplica
        if (conLosa) {
          newAreas.push(newPolys.length);
          newPolys.push([ia, ib, iB2, iA2, ia]);   // el paño, cerrado
        }
        hechos++;
      }
    }
    if (!hechos) return 0;
    newPolys.push([]);
    drawingObj.points.val = newPts;
    if (drawingObj.polylines) drawingObj.polylines.val = newPolys;
    if (drawingObj.areas) drawingObj.areas.val = newAreas;
    try { (window as any).__hekatanRebuild?.(); } catch {}
    viewerRender();
    return hechos;
  };

  rendererElm.addEventListener("click", (event: PointerEvent) => {
    (window as any).__hekatanCursorPx = { x: event.clientX, y: event.clientY };
    // Ignorar click que viene de drag (rotación)
    if (pointerDownAndMovedCount > 5) {
      pointerDownAndMovedCount = 0;
      return;
    }
    pointerDownAndMovedCount = 0;

    const _camForRay = setPointerFromEvent(event);
    if (!_camForRay) return;
    raycaster.setFromCamera(pointer, _camForRay);
    // ⚠️ Si la mirilla YA tenía un punto previsto en este mismo píxel (nudo,
    // sección IFC, referencia…), el clic va ahí aunque el rayo en crudo no
    // toque nada: en un alzado el rayo es rasante al plano XY y el clic sobre
    // el canto del perfil se perdía (medido: 2 de 3 clics del arco del ala).
    const previstoOk = !!(_puntoPrevisto
        && Math.abs(event.clientX - _puntoPrevisto.x) <= 3
        && Math.abs(event.clientY - _puntoPrevisto.y) <= 3);
    const intersect = previstoOk
      ? [{ point: _puntoPrevisto!.p.clone(), distance: _camForRay.position.distanceTo(_puntoPrevisto!.p) } as THREE.Intersection]
      : intersectWorkPlane();
    if (!intersect.length) return;

    // GUARD anti-click RASANTE: el plano de trabajo es gigante (10000 m), así
    // que un rayo casi paralelo lo intersecta a miles de metros → metía nodos
    // basura (ej. 2847 m) que disparaban la cámara lejísimos y dejaban TODOS
    // los ejemplos invisibles. Si el impacto cae mucho más lejos que la
    // distancia cámara→objetivo, lo descartamos.
    if (!previstoOk) {
      const camTgtDist = _camForRay.position.distanceTo(controls.target) || 1;
      const hitDist = intersect[0].distance ?? _camForRay.position.distanceTo(intersect[0].point);
      const p0 = intersect[0].point;
      if (!isFinite(p0.x) || !isFinite(p0.y) || !isFinite(p0.z) ||
          hitDist > Math.max(camTgtDist * 12, 300)) {
        updateStatus("⚠ Click rasante descartado — cayó demasiado lejos. Acercá la vista o clickeá sobre la grilla.");
        return;
      }
    }

    let point = intersect[0].point;
    if (event.ctrlKey || event.metaKey) {
      point = new THREE.Vector3(
        Math.round(intersect[0].point.x),
        Math.round(intersect[0].point.y),
        Math.round(intersect[0].point.z)
      );
    }
    // ── AXIS LOCK + ORTO en click ──
    // axisLock manual (X/Y/Z) o ORTO auto (F8) → proyecta el punto al eje.
    {
      const polysNow = drawingObj.polylines?.rawVal ?? [];
      const lastPolyNow = polysNow[polysNow.length - 1] ?? [];
      const allPtsNow = drawingObj.points.rawVal ?? [];
      if (lastPolyNow.length > 0) {
        const lp = allPtsNow[lastPolyNow[lastPolyNow.length - 1]];
        if (lp) {
          const orthoOn = !!(window as any).__hekatanOrthoMode;
          let effectiveLock: "x" | "y" | "z" | null = axisLock;
          if (!effectiveLock && orthoOn) {
            const dx = Math.abs(point.x - lp[0]);
            const dy = Math.abs(point.y - lp[1]);
            const dz = Math.abs(point.z - lp[2]);
            effectiveLock = dx >= dy && dx >= dz ? "x" : (dy >= dz ? "y" : "z");
          }
          if (effectiveLock === "x") point = new THREE.Vector3(point.x, lp[1], lp[2]);
          else if (effectiveLock === "y") point = new THREE.Vector3(lp[0], point.y, lp[2]);
          else if (effectiveLock === "z") point = new THREE.Vector3(lp[0], lp[1], point.z);
        }
      }
    }
    // Si el pointermove enganchó a un EJE 3D auxiliar, commitear EXACTAMENTE
    // ahí (coincide con lo que se ve; evita el "2 cursores" y permite columnas
    // verticales por Z aunque el plano de trabajo sea XY).
    if (_puntoPrevisto
        && Math.abs(event.clientX - _puntoPrevisto.x) <= 3
        && Math.abs(event.clientY - _puntoPrevisto.y) <= 3) {
      // el punto que el cursor estaba marcando: referencia, ORTO/POLAR y rastreo ya
      // aplicados en el movimiento. No se recalcula nada.
      point = _puntoPrevisto.p.clone();
    } else if (_axisSnapPoint) {
      point = _axisSnapPoint.clone();
      updateStatus(`📐 Eje → (${point.x.toFixed(2)}, ${point.y.toFixed(2)}, ${point.z.toFixed(2)})`);
    } else {
      // OSNAP primero (prioridad sobre grid snap)
      const osnapTol = toleranciaOsnap(point);
      const osnap = (window as any).__hekatanOsnapCompute?.(point.x, point.y, point.z, osnapTol,
                                                            { x: event.clientX, y: event.clientY });
      if (osnap) {
        point = new THREE.Vector3(osnap.x, osnap.y, osnap.z);
        updateStatus(`🎯 Snap [${osnap.type.toUpperCase()}] → (${point.x.toFixed(2)}, ${point.y.toFixed(2)}, ${point.z.toFixed(2)})`);
      } else {
        // Si no hay osnap, aplicar grid snap 2D — solo si toggle ON.
        const snapEnabled = (window as any).__hekatanSnapEnabled !== false;
        const snap = (window as any).__hekatanGridConfig?.minorStep || ((window as any).__hekatanSnap2D ?? 0);   // = separación de la rejilla
        if (snapEnabled && snap > 0) {
          point = new THREE.Vector3(
            Math.round(point.x / snap) * snap,
            Math.round(point.y / snap) * snap,
            Math.round(point.z / snap) * snap,
          );
        }
      }
    }

    // ── Tool dispatcher ──
    procesarClic(point, event);
  });
  // Un PUNTO ya resuelto (por clic o TECLEADO en la ventana de comandos) pasa
  // por el mismo reparto de herramientas. Antes lo tecleado solo servia para
  // linea/polilinea (commitAbsolutePoint): "CIRCULO centro 0,0 radio 3" habia
  // que clicarlo. `event` es null cuando el punto viene del teclado.
  /**
   * ¿Ese punto cae a una distancia RAZONABLE de lo que hay dibujado?
   *
   * En vista isométrica el rayo del ratón llega al plano de trabajo casi
   * rasante, así que unos pocos píxeles valen decenas de metros: un clic en
   * mitad de la pantalla caía en X=−67 Y=101 (medido en el deploy público el
   * 17-sep-2026, con la rejilla de 20 m). Esos puntos no se ven —quedan fuera
   * de cuadro— pero se quedan en el dibujo, y como el plano del alzado se
   * ancla en el último punto, la siguiente vez te pone a dibujar a 100 m de la
   * estructura. Así se perdían los clics de la cercha curva.
   *
   * El límite es RELATIVO, que un puente sí mide 100 m: lo que abarque el
   * modelo más cuatro rejillas, y nunca menos de 50 m.
   */
  const puntoRazonable = (p: THREE.Vector3): boolean => {
    // ⚠️ Esto MIDE EL RAYO, no la distancia al origen.
    //
    // La primera versión rechazaba todo punto a más de tantos metros del
    // modelo, y eso es una mala regla: con la cámara alejada un clic legítimo
    // cae lejos y se quedaba sin dibujar. Jorge, en el deploy: «trato de
    // dibujar y no se puede».
    //
    // Lo que de verdad hace malo un punto es que el rayo del ratón llegue al
    // plano de trabajo CASI DE CANTO: ahí unos pocos píxeles valen decenas de
    // metros y el punto es puro ruido —da igual a qué distancia esté—. Con el
    // rayo entrando con ángulo, el punto es bueno aunque caiga a 200 m, que es
    // lo normal en un puente.
    //
    // Se pide 1.5° entre el rayo y el plano. Por debajo de eso, un píxel de
    // pantalla vale más de 38 veces la distancia al plano: no es dibujar.
    const gt = drawingObj.gridTarget?.rawVal;
    if (!gt) return true;
    const n = new THREE.Vector3(0, 0, 1).applyEuler(new THREE.Euler(...gt.rotation)).normalize();
    const d = raycaster.ray.direction;
    if (d.lengthSq() < 1e-12) return true;
    const senoRasante = Math.abs(d.clone().normalize().dot(n));
    return senoRasante >= 0.026;                    // sen(1.5°)
  };

  const procesarClic = (point: THREE.Vector3, event: PointerEvent | null) => {
    const tool = ((window as any).__hekatanCadState?.get?.() as any)?.tool ?? "select";
    // Designar, medir o mover no crea geometría: ahí un clic lejano no ensucia.
    const creaGeometria = !(tool === "select" || tool === "none" || !tool ||
                            tool === "medir" || tool === "move" || tool === "copy" ||
                            tool === "delete" || tool === "trim" || tool === "extend");
    if (creaGeometria && !puntoRazonable(point)) {
      updateStatus(
        `✕ Estás mirando el plano de trabajo casi de canto, y ahí un píxel vale ` +
        `decenas de metros: el punto caería en (${point.x.toFixed(1)}, ${point.y.toFixed(1)}, ` +
        `${point.z.toFixed(1)}) m. Gira la vista, ponte en una ortogonal ` +
        `(Planta / Frente XZ / Lado YZ), engancha a un nudo con OSNAP, o teclea la coordenada.`);
      return;
    }

    // ── SELECT/none: NO crear geometría — los planos ortogonales se quedan
    // SIMÉTRICOS al origen siempre. Antes cualquier click los movía y
    // confundía al usuario ("el cursor no cae en el eje"). Ahora solo
    // se re-anclan con Ctrl+Click (acción deliberada).
    if (tool === "select" || tool === "none" || !tool) {
      // ── Click selecciona el item bajo el cursor (hover detectado en pointermove) ──
      // Ctrl+Click agrega/quita de selección múltiple. Click simple reemplaza
      // toda la selección por el item nuevo (o limpia si no hay hover).
      if (hoverItem) {
        // Si hay click-click activo y el usuario clickea sobre un objeto,
        // cancelar el modo (no tiene sentido seguir el rect).
        if (ccAnchor) cancelClickClick();
        const { kind, a, b } = hoverItem;
        const id = b !== undefined ? `${kind}:${a}:${b}` : `${kind}:${a}`;
        const isMulti = !!event && (event.ctrlKey || event.metaKey || event.shiftKey);
        if (!isMulti) selection.clear();
        if (selection.has(id)) selection.delete(id);
        else selection.add(id);
        refreshSelectionGroup();
        updateStatus(`✓ Seleccionados ${selection.size} elemento(s) — Ctrl+Click para multi-selección`);
      } else {
        // Click en vacío. Tres casos:
        //   1. ccAnchor != null  → SEGUNDO click → finaliza rect-select
        //   2. ccAnchor == null  → PRIMER click vacío → empieza click-click rect
        //                          (siempre que no haya modifier multi)
        //   3. multi-modifier sin anchor → ignora (consistente con AutoCAD)
        const isMulti = !!event && (event.ctrlKey || event.metaKey || event.shiftKey);
        const cx = event?.clientX ?? 0;
        const cy = event?.clientY ?? 0;
        if (ccAnchor) {
          // Cierre del rect — usar la lógica compartida.
          finalizeRectSelection(ccAnchor.x, ccAnchor.y, cx, cy, isMulti);
          ccAnchor = null;
        } else if (!isMulti) {
          // Primer click vacío → empezar click-click rect (no limpia
          // selección todavía; al cerrar el rect se aplica la regla
          // estándar: sin modifier reemplaza, con modifier agrega).
          ccAnchor = { x: cx, y: cy };
          updateStatus(
            "🖱 Click 2 para cerrar el rectángulo (→ derecha=Window azul, ←izquierda=Crossing verde). Esc=cancelar.",
          );
          // Pintar un punto inicial pequeño para feedback inmediato.
          paintDragRect(cx, cy, cx + 1, cy + 1, false);
        }
      }
      return;
    }

    // ── AXIS TOOL: 2 clicks para crear un eje (start → end) con burbuja ──
    if (tool === "axis") {
      const st = (window as any).__hekatanAxisDraw as { mode: string; pendingStart: number[] | null } | undefined;
      if (!st) return;
      if (!st.pendingStart) {
        // Primer click → guarda start
        st.pendingStart = [point.x, point.y, point.z];
        updateStatus(`📍 Eje — click 1 OK en (${point.x.toFixed(2)}, ${point.y.toFixed(2)}, ${point.z.toFixed(2)}). Click 2=fin.`);
        return;
      }
      // Segundo click → crea el eje
      const useNum = st.mode === "number";
      const label = (window as any).__hekatanAxisCommit?.(
        st.pendingStart, [point.x, point.y, point.z], useNum,
      );
      updateStatus(`✓ Eje "${label}" creado. Click 1=nuevo eje, o cambia tool.`);
      return;
    }

    if (tool === "move" || tool === "copy") {
      pasoMoverCopiar(tool, [point.x, point.y, point.z]);
      return;
    }

    if (tool === "delete") {
      // Prioridad: aux line hover > polilínea hover (el de menor dist gana,
      // y eso ya se resolvió en el pointermove → solo uno está activo).
      if (hoveredAuxIndex >= 0) {
        const auxState = (window as any).__hekatanDrawingAuxLines;
        const cur: number[][] = auxState?.rawVal ?? auxState?.val ?? auxState ?? [];
        const idx = hoveredAuxIndex;
        if (idx >= 0 && idx < cur.length) {
          pushUndo();  // snapshot para Ctrl+Z
          const next = cur.slice(0, idx).concat(cur.slice(idx + 1));
          // Soportar tanto vanjs State como array pelado
          if (auxState && typeof auxState === "object" && "val" in auxState) {
            auxState.val = next;
          } else {
            (window as any).__hekatanDrawingAuxLines = next;
          }
          updateStatus(`🗑 Línea auxiliar #${idx + 1} borrada`);
          hoveredAuxIndex = -1;
          deleteHover.visible = false;
          try { (window as any).__hekatanRebuild?.(); } catch {}
        }
      } else if (hoveredPolyIndex >= 0) {
        const polyIdx = hoveredPolyIndex;
        const segIdx = hoveredSegIndex;
        const isArea = drawingObj.areas?.rawVal?.includes(polyIdx) ?? false;
        if (isArea) {
          deletePoly(polyIdx);
          updateStatus(`🗑 Área #${polyIdx + 1} (shell Q4) borrada`);
        } else if (segIdx >= 0) {
          deleteSeg(polyIdx, segIdx);
          updateStatus(`🗑 Segmento ${segIdx + 1} de polilínea #${polyIdx + 1} borrado`);
        } else {
          deletePoly(polyIdx);
          updateStatus(`🗑 Polilínea #${polyIdx + 1} borrada`);
        }
      } else {
        updateStatus(`🗑 Acercá el cursor a una línea/área/aux para borrarla`);
      }
      return;
    }

    if (tool === "circle") {
      // 2 clicks: centro + punto en el radio
      pendingClicks.push([point.x, point.y, point.z]);
      if (pendingClicks.length === 1) {
        updateStatus(`○ Círculo — click 1/2 OK (centro). Ahora marcá el radio.`);
        return;
      }
      // 2 clicks recolectados → calcular radio + plano + dibujar
      const [c, p2] = pendingClicks;
      const r = Math.hypot(p2[0] - c[0], p2[1] - c[1], p2[2] - c[2]);
      // Detectar plano según componente con menor variación
      const dx = Math.abs(p2[0] - c[0]);
      const dy = Math.abs(p2[1] - c[1]);
      const dz = Math.abs(p2[2] - c[2]);
      // El plano es el de TRABAJO si los dos clics están en él (radio horizontal en
      // un alzado XZ: dy = dz = 0 y antes salía "xy" — el círculo se iba de canto,
      // medido en el desafío 2D del 13-sep-2026); si no, el eje que no varía.
      const wpC = String((window as any).__hekatanCadState?.get?.()?.workPlane ?? "");
      const enWp = wpC === "xy" ? dz < 1e-3 : wpC === "xz" ? dy < 1e-3 : wpC === "yz" ? dx < 1e-3 : false;
      const planeKind: "xy" | "xz" | "yz" = enWp ? (wpC as "xy" | "xz" | "yz") : dz < 1e-3 ? "xy" : (dy < 1e-3 ? "xz" : "yz");
      const segs = (window as any).__hekatanArcSegs ?? 12;
      (window as any).__hekatanDrawCircle?.(c[0], c[1], c[2], r, segs, planeKind);
      updateStatus(`✓ Círculo dibujado en ${planeKind.toUpperCase()} — r=${r.toFixed(2)}m, ${segs} segmentos`);
      pendingClicks = [];
      try { (window as any).__hekatanRebuild?.(); } catch {}
      return;
    }
    if (tool === "ifcface") {
      if (!_cara) { updateStatus("▦ Acercá el cursor a una cara del IFC: se ilumina en cian y el clic la convierte en área."); return; }
      if (!_cara.plana) { updateStatus("▦ Esa cara es CURVA (naranja): ETABS no admite áreas curvas. Copiá el arco con «Copiar línea del IFC» y extruílo (Editar › Extruir) para tener paños planos."); return; }
      const T = topoDe(_cara.m); const poly = contornoCara(T, _cara.tris);
      if (poly.length < 3) { updateStatus("▦ No se pudo cerrar el contorno de la cara."); return; }
      const n = _cara.normal.clone();
      const t = espesorEn(_cara.m, _cara.punto, n);
      let pos = String((window as any).__hekatanIfcCaraPos ?? "auto");
      // ETABS: losa (cara con normal vertical) CARDINALPOINT "TOP" = la cara
      // tocada; muro (cara vertical) "MIDDLE" = plano medio.
      // Jorge (13-sep): en HORMIGÓN la losa se inserta por arriba (TOP); en
      // ACERO (deck/zinc sobre correas) por ABAJO: la chapa apoya sobre la viga,
      // así que el plano de análisis es la cara inferior (BOTTOM = la de atrás).
      let acero = false; try { const P = (window as any).__hekatanParams?.(); acero = Math.round(P?.matShell ?? 0) === 1; } catch {}
      if (pos === "auto") pos = Math.abs(n.z) > 0.5 ? (acero ? "interior" : "exterior") : "media";
      const tEf = t ?? 0.2;
      const d = pos === "exterior" ? 0 : pos === "interior" ? tEf : tEf / 2;
      const pts = poly.map((q) => q.clone().addScaledVector(n, -d));
      pushUndo();
      polyAreaPts = pts.map((q) => [q.x, q.y, q.z] as [number, number, number]);
      const cnt = finalizePolyArea();
      try { const P = (window as any).__hekatanParams?.(); if (P && t) { P.tShell = Math.round(t * 100) / 100; } } catch {}
      const formas = ["Shell-Thick (Mindlin)", "Shell-Thin (Kirchhoff)", "Membrana"];
      let forma = "la de «Sección shells»"; try { const P = (window as any).__hekatanParams?.(); if (P && P.formaPlaca != null) forma = formas[Math.round(P.formaPlaca)] ?? forma; } catch {}
      const donde = pos === "exterior" ? "la cara TOCADA (punto de inserción SUPERIOR, como ETABS: CARDINALPOINT TOP, el espesor cuelga hacia dentro y la malla de análisis se queda en el plano dibujado)" : pos === "interior" ? "la cara de ATRÁS (inserción INFERIOR, desfase " + tEf.toFixed(2) + " m: en acero la chapa apoya por abajo sobre la viga)" : "el PLANO MEDIO (desfase " + (tEf / 2).toFixed(2) + " m hacia dentro)";
      updateStatus(`▦ Área desde la cara del IFC: ${poly.length} vértices, ${cnt} shell(s). Espesor medido ${t ? t.toFixed(2) + " m" : "no medido (0.20 m supuesto)"}; malla en ${donde}; formulación ${forma}, t = ${tEf.toFixed(2)} m.`);
      mostrarCara(null, -1, null);
      try { (window as any).__hekatanRebuild?.(); } catch {}
      viewerRender();
      return;
    }
    if (tool === "ifcline") {
      // «Elegir líneas»: la cadena iluminada se copia como barras (medidas de la malla).
      if (!_cadenaActual || _cadenaActual.length < 2) { updateStatus("⟋ Acercá el cursor a un borde o al perfil del corte del IFC: se ilumina en azul y el clic lo copia."); return; }
      const nuevos = cadenaABarras(_cadenaActual);
      pushUndo();
      // Un nudo que ya existe en esa coordenada (≤ 1 mm) se REUSA: si no, la
      // cumbre copiada después de la nave nacía con su propio nudo encima del
      // de la nave y la bóveda quedaba en tiras sueltas (mecanismo; medido en
      // cli/_boveda_completa.mjs: deformaciones vacías).
      const P0 = drawingObj.points.rawVal;
      const idx: number[] = []; const agregados: [number, number, number][] = [];
      for (const q of nuevos) {
        let k = P0.findIndex((p) => Math.abs(p[0] - q[0]) < 1e-3 && Math.abs(p[1] - q[1]) < 1e-3 && Math.abs(p[2] - q[2]) < 1e-3);
        if (k < 0) { k = P0.length + agregados.length; agregados.push(q); }
        idx.push(k);
      }
      drawingObj.points.val = [...P0, ...agregados];
      if (drawingObj.polylines) {
        const polys = drawingObj.polylines.rawVal;
        const cola = polys.length && polys[polys.length - 1].length === 0 ? polys.slice(0, -1) : polys;
        drawingObj.polylines.val = [...cola, idx, []];
      }
      const Ltot = _cadenaActual.reduce((s, p, i) => i ? s + p.distanceTo(_cadenaActual![i - 1]) : 0, 0);
      updateStatus(`⟋ Línea del IFC copiada: ${nuevos.length - 1} tramo(s), ${Ltot.toFixed(2)} m de desarrollo.`);
      mostrarCadena(null);
      try { (window as any).__hekatanRebuild?.(); } catch {}
      viewerRender();
      return;
    }
    if (tool === "arc") {
      // 3 clicks: start + mid + end
      pendingClicks.push([point.x, point.y, point.z]);
      if (pendingClicks.length === 1) { updateStatus(`⌒ Arco — click 1/3 OK (inicio). Marcá el punto medio.`); return; }
      if (pendingClicks.length === 2) { updateStatus(`⌒ Arco — click 2/3 OK (medio). Marcá el final.`); return; }
      const [p1, pm, pe] = pendingClicks;
      const segs = (window as any).__hekatanArcSegs ?? 12;
      (window as any).__hekatanDrawArc?.(p1, pm, pe, segs);
      updateStatus(`✓ Arco dibujado — ${segs} segmentos`);
      pendingClicks = [];
      try { (window as any).__hekatanRebuild?.(); } catch {}
      return;
    }
    if (tool === "parabola" || tool === "cubica") {
      // parábola: 3 clics; cúbica: 4 clics — polinomio de grado k−1 por los k puntos
      const K = tool === "parabola" ? 3 : 4; const nombre = tool === "parabola" ? "Parábola" : "Cúbica";
      pendingClicks.push([point.x, point.y, point.z]);
      if (pendingClicks.length < K) { updateStatus(`∿ ${nombre} — punto ${pendingClicks.length}/${K} OK. Marcá el ${pendingClicks.length + 1}º.`); return; }
      const segs = (window as any).__hekatanArcSegs ?? 12;
      const r = (window as any).__hekatanDrawPolinomio?.(pendingClicks.slice(), segs);
      if (!r?.ok) { updateStatus(`⚠ ${nombre}: ${r?.msg ?? "no se pudo"}. Volvé a marcar los puntos.`); pendingClicks = []; return; }
      const va = "xyz"[r.ia ?? 0], vo = "xyz"[r.io ?? 2];
      const ecu = (r.coef ?? []).map((c: number, i: number) => `${c >= 0 && i ? "+" : ""}${c.toFixed(3)}${i ? "·" + va + (i > 1 ? "^" + i : "") : ""}`).join(" ");
      updateStatus(`✓ ${nombre} dibujada en ${String(r.plano ?? "").toUpperCase()} — ${segs} tramos a Δ igual de ${va} · ${vo} = ${ecu}`);
      pendingClicks = [];
      try { (window as any).__hekatanRebuild?.(); } catch {}
      return;
    }
    if (tool === "revolve") {
      // 1 clic: un punto del eje vertical; gira la selección (el meridiano)
      const sect = Math.round((window as any).__hekatanRevSectores ?? 16);
      const r = (window as any).__hekatanRevolveSelection?.(point.x, point.y, sect, 360);
      if (r?.msg) { updateStatus(`⚠ Revolución: ${r.msg}.`); return; }
      updateStatus(`✓ Revolución: ${r.anillos} anillo(s) × ${sect} sectores → ${r.areas} paño(s) Q4${r.polo ? " (casquete cerrado con cometas en el polo)" : ""}. Eje Z por (${point.x.toFixed(2)}, ${point.y.toFixed(2)}).${r.guias ? ` ${r.guias} línea(s) auxiliar(es) de guía borrada(s).` : ""}`);
      try { (window as any).__hekatanClearSelection?.(); } catch {}
      return;
    }
    if (tool === "loft") {
      // 1 clic: el eje (centro de la planta); barre el contorno seleccionado según el perfil seleccionado
      const r = (window as any).__hekatanLoftSelection?.(point.x, point.y);
      if (r?.msg) { updateStatus(`⚠ Barrido: ${r.msg}.`); return; }
      updateStatus(`✓ Barrido: contorno de ${r.contorno} lados × perfil de ${r.perfil} puntos → ${r.areas} paño(s) Q4. Eje por (${point.x.toFixed(2)}, ${point.y.toFixed(2)}).${r.guias ? ` ${r.guias} línea(s) auxiliar(es) de guía borrada(s).` : ""}`);
      try { (window as any).__hekatanClearSelection?.(); } catch {}
      return;
    }
    if (tool === "rect") {
      // 2 clicks: esquina A + esquina opuesta
      pendingClicks.push([point.x, point.y, point.z]);
      if (pendingClicks.length === 1) {
        updateStatus(`▭ Rectángulo — click 1/2 OK (esquina). Marcá la esquina opuesta.`);
        return;
      }
      const [a, b] = pendingClicks;
      (window as any).__hekatanDrawRect?.(a, b);
      updateStatus(`✓ Rectángulo dibujado — (${a[0].toFixed(1)},${a[1].toFixed(1)}) → (${b[0].toFixed(1)},${b[1].toFixed(1)})`);
      pendingClicks = [];
      try { (window as any).__hekatanRebuild?.(); } catch {}
      return;
    }
    if (tool === "medir") {
      // REGLA: 2 puntos (sobre el modelo 3D o la grilla) → cota con la distancia.
      // El punto ENGANCHADO que ya calculó el pointermove (nudos, extremos de líneas
      // auxiliares, rejilla…): con `puntoBajoCursor` a secas la regla daba 4.932 m
      // por un radio de 5 (medido en la cúpula, 13-sep-2026).
      const pv = _puntoPrevisto && Math.abs(_puntoPrevisto.x - event.clientX) < 3 && Math.abs(_puntoPrevisto.y - event.clientY) < 3 ? [_puntoPrevisto.p.x, _puntoPrevisto.p.y, _puntoPrevisto.p.z] as [number, number, number] : null;
      const pt = pv ?? puntoBajoCursor(event); if (!pt) return;
      if (measurePts.length >= 2) measurePts = [];   // reiniciar tras medida completa
      measurePts.push(pt);
      if (measurePts.length === 1) {
        measureLine.visible = false; actualizarLabelMedida();
        updateStatus("📏 Regla — 1er punto puesto. Marca el 2º.");
      } else {
        const [a, b] = measurePts;
        measureLine.geometry.setFromPoints([new THREE.Vector3(a[0], a[1], a[2]), new THREE.Vector3(b[0], b[1], b[2])]);
        measureLine.visible = true;
        const d = Math.hypot(b[0]-a[0], b[1]-a[1], b[2]-a[2]);
        const dxy = Math.hypot(b[0]-a[0], b[1]-a[1]);
        measureLabel.textContent = `${d.toFixed(3)} m`;
        actualizarLabelMedida();
        updateStatus(`📏 Distancia ${d.toFixed(3)} m  ·  Δx ${(b[0]-a[0]).toFixed(3)}  Δy ${(b[1]-a[1]).toFixed(3)}  Δz ${(b[2]-a[2]).toFixed(3)}  ·  en planta ${dxy.toFixed(3)} m`);
      }
      viewerRender();
      return;
    }
    if (tool === "fillarea") {
      // RELLENAR ÁREA: click en el VACÍO encerrado por barras → crea el área de
      // esa celda cerrada (4 lados sin diagonal, o triángulo). Como el "draw
      // floor" de ETABS pero sobre barras sueltas que cierran un lazo, sin grilla.
      const ptsF = drawingObj.points.rawVal;
      const polysF = drawingObj.polylines?.rawVal ?? [];
      const adjF = new Map<number, Set<number>>();
      const addEF = (a: number, b: number) => { if (a === b) return;
        (adjF.get(a) ?? adjF.set(a, new Set()).get(a)!).add(b);
        (adjF.get(b) ?? adjF.set(b, new Set()).get(b)!).add(a); };
      for (const poly of polysF) for (let i = 0; i + 1 < poly.length; i++) addEF(poly[i], poly[i + 1]);
      const hasF = (a: number, b: number) => !!adjF.get(a)?.has(b);
      const seenF = new Set<string>(); const cellsF: number[][] = [];
      const idsF = [...adjF.keys()];
      for (const a of idsF) for (const b of adjF.get(a)!) { if (b < a) continue;
        for (const c of adjF.get(b)!) { if (c === a) continue;
          for (const d of adjF.get(c)!) { if (d === a || d === b || !hasF(d, a)) continue;
            if (hasF(a, c) || hasF(b, d)) continue;
            const k = [a, b, c, d].slice().sort((x, y) => x - y).join("-");
            if (!seenF.has(k)) { seenF.add(k); cellsF.push([a, b, c, d]); } } } }
      for (const a of idsF) for (const b of adjF.get(a)!) { if (b < a) continue;
        for (const c of adjF.get(b)!) { if (c === a || !hasF(c, a)) continue;
          const k = [a, b, c].slice().sort((x, y) => x - y).join("-");
          if (!seenF.has(k)) { seenF.add(k); cellsF.push([a, b, c]); } } }
      const planeF = (window as any).__hekatanCadState?.get?.()?.workPlane ?? "xy";
      const to2 = (q: number[]): [number, number] => planeF === "xy" ? [q[0], q[1]] : planeF === "xz" ? [q[0], q[2]] : [q[1], q[2]];
      const Pf = to2([point.x, point.y, point.z]);
      const pin = (pp: [number, number], poly: [number, number][]) => { let ins = false;
        for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
          if (((yi > pp[1]) !== (yj > pp[1])) && (pp[0] < (xj - xi) * (pp[1] - yi) / (yj - yi) + xi)) ins = !ins; } return ins; };
      const parea = (poly: [number, number][]) => { let a = 0; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) a += (poly[j][0] + poly[i][0]) * (poly[j][1] - poly[i][1]); return Math.abs(a) / 2; };
      let bestF: number[] | null = null, bestAF = Infinity;
      for (const c of cellsF) { const poly = c.map((id) => to2(ptsF[id])) as [number, number][];
        if (!pin(Pf, poly)) continue; const A = parea(poly); if (A < bestAF) { bestAF = A; bestF = c; } }
      if (!bestF) { updateStatus("▦ Rellenar área — no hay una celda CERRADA de barras bajo el cursor. Cierra los 4 lados primero."); return; }
      const keyF = bestF.slice().sort((x, y) => x - y).join("-");
      const areasNow = drawingObj.areas?.rawVal ?? [];
      const dup = areasNow.some((ai) => { const pl = polysF[ai] ?? []; return [...new Set(pl)].sort((x, y) => x - y).join("-") === keyF; });
      if (dup) { updateStatus("▦ Esa celda ya tiene área."); return; }
      drawingObj.polylines!.val = [...polysF, [...bestF, bestF[0]]];
      drawingObj.areas!.val = [...areasNow, polysF.length];
      updateStatus(`✓ Área creada por relleno (${bestF.length} lados).`);
      try { (window as any).__hekatanRebuild?.(); } catch {}
      return;
    }
    if (tool === "rectarea") {
      // 2 clicks (esquinas opuestas) → shell Q4 marcado como ÁREA.
      pendingClicks.push([point.x, point.y, point.z]);
      if (pendingClicks.length === 1) {
        updateStatus(`▭ Área rectangular — click 1/2 OK (esquina). Marcá la esquina opuesta.`);
        return;
      }
      const [a, b] = pendingClicks;
      (window as any).__hekatanDrawRectArea?.(a, b);
      updateStatus(`✓ Área rectangular (shell Q4) creada — (${a[0].toFixed(1)},${a[1].toFixed(1)}) → (${b[0].toFixed(1)},${b[1].toFixed(1)})`);
      pendingClicks = [];
      return;
    }
    if (tool === "polyarea") {
      // Polígono LIBRE (N vértices): acumula clicks; Enter o click-derecho
      // cierra y mallar en shells Q4. Usa array propio (sin nodos huérfanos).
      polyAreaPts.push([point.x, point.y, point.z]);
      polyAreaPreview.geometry.setFromPoints(
        polyAreaPts.map((q) => new THREE.Vector3(q[0], q[1], q[2])),
      );
      polyAreaPreview.visible = polyAreaPts.length >= 1;
      updateStatus(
        `▰ Área libre — ${polyAreaPts.length} punto(s). Click más vértices, o ` +
        `Enter / click-derecho para cerrar y mallar (mín. 3).`,
      );
      viewerRender();
      return;
    }
    if (tool === "plane3") {
      // PLANO INCLINADO por 3 puntos: clickeá 3 puntos (cambiando Cota Z entre
      // clicks, o enganchando nodos existentes a distintas alturas) → el plano
      // de trabajo + grilla se inclinan a esa orientación. Después dibujás el
      // área con ese plano inclinado activo → shell inclinado.
      pendingClicks.push([point.x, point.y, point.z]);
      if (pendingClicks.length < 3) {
        updateStatus(`◣ Plano inclinado — punto ${pendingClicks.length}/3. ` +
          `Tip: cambiá la Cota Z (o enganchá un nodo) entre clicks para darle inclinación.`);
        return;
      }
      const [a, b, c] = pendingClicks;
      const ok = (window as any).__hekatanSetInclinedPlaneFrom3?.(a, b, c);
      updateStatus(ok
        ? `✓ Plano de trabajo INCLINADO activo. Dibujá el área (▭/⬡) sobre él. (XY para resetear)`
        : `⚠ Los 3 puntos son colineales — no definen un plano. Reintentá.`);
      pendingClicks = [];
      return;
    }
    if (tool === "col") {
      // 1 click + tipear altura + Enter → frame vertical (columna).
      // Si solo hace 1 click sin tipear, usa altura default 3m.
      // Sin pendingClicks porque solo necesitamos 1 click.
      pushUndo();
      const baseZ = point.z;
      const h = pendingHeight && pendingHeight > 0 ? pendingHeight : 3;
      drawingObj.points.val = [
        ...drawingObj.points.rawVal,
        [point.x, point.y, baseZ],
        [point.x, point.y, baseZ + h],
      ];
      const polys = drawingObj.polylines!.rawVal;
      const n = drawingObj.points.rawVal.length;
      drawingObj.polylines!.val = [
        ...polys.slice(0, -1),
        ...(polys[polys.length - 1].length > 0 ? [polys[polys.length - 1]] : []),
        [n - 2, n - 1],
        [],
      ];
      pendingHeight = 0;
      updateStatus(`▌ Columna creada — h=${h.toFixed(2)}m. Tipeá altura + Enter para custom.`);
      try { (window as any).__hekatanRebuild?.(); } catch {}
      return;
    }
    if (tool === "wall") {
      // 2 clicks (esquinas inferiores) + tipear altura + Enter → shell Q4
      // vertical. Los 4 vértices: a, b (base), b+H·z, a+H·z.
      pendingClicks.push([point.x, point.y, point.z]);
      if (pendingClicks.length === 1) {
        updateStatus(`▥ Pared Q4 — click 1/2 OK (esquina base 1). Marcá la otra esquina base.`);
        return;
      }
      const [a, b] = pendingClicks;
      const h = pendingHeight && pendingHeight > 0 ? pendingHeight : 3;
      pushUndo();
      const n0 = drawingObj.points.rawVal.length;
      drawingObj.points.val = [
        ...drawingObj.points.rawVal,
        [a[0], a[1], a[2]],            // n0
        [b[0], b[1], b[2]],            // n0+1
        [b[0], b[1], b[2] + h],        // n0+2
        [a[0], a[1], a[2] + h],        // n0+3
      ];
      const polys = drawingObj.polylines!.rawVal;
      const newPolyIdx = polys.length - 1;  // será el último después del push
      drawingObj.polylines!.val = [
        ...polys.slice(0, -1),
        ...(polys[polys.length - 1].length > 0 ? [polys[polys.length - 1]] : []),
        [n0, n0 + 1, n0 + 2, n0 + 3, n0],   // shell Q4 vertical (cerrado visual)
        [],
      ];
      // Marcar el shell Q4 como área
      if (drawingObj.areas) {
        const newPolyAt = drawingObj.polylines!.rawVal.length - 2;  // antes del último vacío
        drawingObj.areas.val = [...drawingObj.areas.rawVal, newPolyAt];
      }
      updateStatus(`▥ Pared Q4 creada — h=${h.toFixed(2)}m. Tipeá altura + Enter para custom.`);
      pendingClicks = [];
      pendingHeight = 0;
      try { (window as any).__hekatanRebuild?.(); } catch {}
      return;
    }
    if (tool === "extp") {
      // EXTRUIR PUNTO → LÍNEA: 1 click sobre un nodo (OSNAP NODE engancha)
      // o sobre el plano. Crea frame vertical de altura `pendingHeight`.
      // Si el click no enganchó a un node existente, usa el point clickeado.
      // Diferencia con "col": busca explícitamente OSNAP node, ideal para
      // extruir nodes ya creados.
      pushUndo();
      const h = pendingHeight && pendingHeight > 0 ? pendingHeight : 3;
      const baseZ = point.z;
      drawingObj.points.val = [
        ...drawingObj.points.rawVal,
        [point.x, point.y, baseZ],
        [point.x, point.y, baseZ + h],
      ];
      const polys = drawingObj.polylines!.rawVal;
      const n = drawingObj.points.rawVal.length;
      drawingObj.polylines!.val = [
        ...polys.slice(0, -1),
        ...(polys[polys.length - 1].length > 0 ? [polys[polys.length - 1]] : []),
        [n - 2, n - 1],
        [],
      ];
      pendingHeight = 0;
      updateStatus(`⬆ Extrusión punto→línea — h=${h.toFixed(2)}m`);
      try { (window as any).__hekatanRebuild?.(); } catch {}
      return;
    }
    if (tool === "extl") {
      // EXTRUIR LÍNEA → ÁREA Q4: 1 click cerca de una línea existente.
      // Crea shell Q4 con los 2 vértices del segmento + 2 vértices extruidos
      // en +Z por la altura tipeada (o 3m default).
      const tol = ((window as any).__hekatanSnap2D ?? 0.5) * 1.5;
      const found = findClosestPoly(point.x, point.y, point.z, tol);
      if (!found) {
        updateStatus(`⬆ Extruir línea — acercá el cursor a una línea existente y volvé a clickear.`);
        return;
      }
      const polys = drawingObj.polylines!.rawVal;
      const allPts = drawingObj.points.rawVal;
      const poly = polys[found.polyIdx];
      const a = allPts[poly[found.segIdx]];
      const b = allPts[poly[found.segIdx + 1]];
      if (!a || !b) {
        updateStatus(`⬆ Extruir línea — segmento no válido.`);
        return;
      }
      const h = pendingHeight && pendingHeight > 0 ? pendingHeight : 3;
      pushUndo();
      const n0 = drawingObj.points.rawVal.length;
      drawingObj.points.val = [
        ...drawingObj.points.rawVal,
        [a[0], a[1], a[2]],            // n0
        [b[0], b[1], b[2]],            // n0+1
        [b[0], b[1], b[2] + h],        // n0+2
        [a[0], a[1], a[2] + h],        // n0+3
      ];
      const polysAfter = drawingObj.polylines!.rawVal;
      drawingObj.polylines!.val = [
        ...polysAfter.slice(0, -1),
        ...(polysAfter[polysAfter.length - 1].length > 0 ? [polysAfter[polysAfter.length - 1]] : []),
        [n0, n0 + 1, n0 + 2, n0 + 3, n0],   // shell Q4 extrudido
        [],
      ];
      // Marcar como área (shell Q4)
      if (drawingObj.areas) {
        const newPolyAt = drawingObj.polylines!.rawVal.length - 2;
        drawingObj.areas.val = [...drawingObj.areas.rawVal, newPolyAt];
      }
      pendingHeight = 0;
      updateStatus(`⬆ Extrusión línea→área Q4 — h=${h.toFixed(2)}m`);
      try { (window as any).__hekatanRebuild?.(); } catch {}
      return;
    }
    if (tool === "auxp") {
      // 1 click → agrega un punto auxiliar (cyan sphere). NO genera nodo FEM
      // pero sirve como anchor de OSnap (endpoint).
      const apState = (window as any).__hekatanDrawingAuxPoints;
      if (apState) {
        const cur: number[][] = apState.rawVal ?? apState.val ?? [];
        apState.val = [...cur, [point.x, point.y, point.z]];
      }
      updateStatus(`✦ Punto auxiliar agregado en (${point.x.toFixed(2)}, ${point.y.toFixed(2)}, ${point.z.toFixed(2)})`);
      return;
    }
    if (tool === "aux") {
      // 2 clicks: punto inicio + punto fin → crea línea auxiliar (NO frame FEM)
      pendingClicks.push([point.x, point.y, point.z]);
      if (pendingClicks.length === 1) {
        updateStatus(`┊ Línea auxiliar — click 1/2 OK. Marcá el punto final.`);
        return;
      }
      const [a, b] = pendingClicks;
      const auxState = (window as any).__hekatanDrawingAuxLines;
      if (auxState) {
        pushUndo();
        const cur: number[][] = auxState.rawVal ?? auxState.val ?? [];
        auxState.val = [...cur, [a[0], a[1], a[2], b[0], b[1], b[2]]];
      }
      const dx = b[0] - a[0], dy = b[1] - a[1], dz = b[2] - a[2];
      const len = Math.sqrt(dx*dx + dy*dy + dz*dz);
      updateStatus(`✓ Línea auxiliar creada — L=${len.toFixed(2)}m (cyan, no FEM)`);
      pendingClicks = [];
      return;
    }
    if (tool === "extend" || tool === "trim" || tool === "offset") {
      pasoModificar(tool, [point.x, point.y, point.z]);
      return;
    }
    if (tool === "chaflan") {
      // 2 clicks: esquinas opuestas. El radio se lee de window.__hekatanChaflanR
      pendingClicks.push([point.x, point.y, point.z]);
      if (pendingClicks.length === 1) {
        updateStatus(`▱ Losa con chaflanes — click 1/2 OK (esquina). Marcá la esquina opuesta.`);
        return;
      }
      const [a, b] = pendingClicks;
      const rad = (window as any).__hekatanChaflanR ?? 1.0;
      const segArc = Math.max(3, (window as any).__hekatanArcSegs ?? 6);
      (window as any).__hekatanDrawSlabChaflan?.(a, b, rad, segArc, 6);
      const dx = Math.abs(b[0] - a[0]).toFixed(1);
      const dy = Math.abs(b[1] - a[1]).toFixed(1);
      updateStatus(`✓ Losa con chaflanes dibujada — ${dx}×${dy}m, r=${rad}m, ${segArc} seg/chaflán`);
      pendingClicks = [];
      try { (window as any).__hekatanRebuild?.(); } catch {}
      return;
    }

    // ── Default behavior: tools "select", "node", "line", "polyline", "area" ──
    // Click agrega punto + extiende polilínea actual
    rubberUserEditing = false;  // reset al hacer click — el siguiente rubber band parte limpio
    pushUndo();  // snapshot ANTES de modificar — Ctrl+Z restaura
    // Un clic SOBRE un nudo que ya existe (≤ 1 mm) lo REUSA: la cercha Warren
    // dibujada con tres polilíneas (cordones + zigzag) daba 26 nudos por 13, con
    // las diagonales sin tocar los cordones en el dibujo (medido en
    // cli/_cercha.mjs, 13-sep-2026). Así lo hace ETABS: un joint por posición.
    const qClic = point.toArray() as [number, number, number];
    const P0 = drawingObj.points.rawVal;
    let idxClic = P0.findIndex((pp) => Math.abs(pp[0] - qClic[0]) < 1e-3 && Math.abs(pp[1] - qClic[1]) < 1e-3 && Math.abs(pp[2] - qClic[2]) < 1e-3);
    if (idxClic < 0) { drawingObj.points.val = [...P0, qClic]; idxClic = drawingObj.points.rawVal.length - 1; }
    // ⚠️ «● Nodo» ponía el punto Y lo encadenaba a la polilínea abierta: diez
    // nudos sueltos salían unidos en zigzag por barras que nadie pidió (medido
    // en cli/_ref_ifc_test.mjs). Un nudo es un nudo: no toca la polilínea.
    if (drawingObj.polylines && tool !== "node") {
      const polysAhora = drawingObj.polylines.rawVal;
      const ultimaPoly = polysAhora.length ? polysAhora[polysAhora.length - 1] : [];
      // El mismo nudo que cierra la polilínea anterior NO es un tramo de largo cero:
      // es el ARRANQUE de una polilínea nueva (una diagonal que sale de donde acabó la
      // vertical). Descartarlo se comía 3 diagonales de la Howe (medido, 13-sep-2026).
      if (ultimaPoly.length && ultimaPoly[ultimaPoly.length - 1] === idxClic) drawingObj.polylines.val = [...polysAhora, [idxClic]];
      else drawingObj.polylines.val = [...polysAhora.slice(0, -1), [...ultimaPoly, idxClic]];
    }

    // ── Auto-cierre semántico por tool ──
    // Estos comportamientos diferencian la INTENCIÓN del usuario, no la
    // geometría. Una polilínea cerrada con tool "polyline" sigue siendo
    // una cadena de frames (ej: cercha); solo tool "area" la convierte
    // en shell Q4.
    if (drawingObj.polylines) {
      const polysNow = drawingObj.polylines.rawVal;
      const lastIdx = polysNow.length - 1;
      const last = polysNow[lastIdx] ?? [];

      // ⚠️ La herramienta Línea ENCADENA, como el LINE de AutoCAD: cada clic
      // continúa desde el punto anterior y se termina con Esc o clic derecho.
      //
      // Antes cortaba cada 2 clics y arrancaba una polilínea nueva. Con eso un
      // rectángulo de 4 lados costaba 8 clics —repitiendo cada esquina— en vez
      // de 5, y el modelo quedaba troceado: 5 clics daban polilíneas
      // [2],[2],[1], con una huérfana de un punto que no es ningún frame.
      // Medido en cli/ctl_cad.mjs: [0,2,2,1,2,2,2,2,0].
      //
      // Y lo peor es que el programa ya prometía encadenar: el mensaje de la
      // barra decía "Continuá clickeando para extender la polilínea" y la
      // ayuda del botón, "sigue encadenando". El corte era el error, no el
      // texto. Para hacer tramos sueltos se pulsa Esc entre uno y otro, que es
      // lo que se hace en AutoCAD.
      if (tool === "line" && last.length >= 2) {
        updateStatus(`／ Línea — ${last.length - 1} tramo${last.length === 2 ? "" : "s"}. ` +
                     `Seguí marcando puntos; Esc o clic derecho para terminar.`);
        try { (window as any).__hekatanRebuild?.(); } catch {}
        return;
      }

      if (tool === "area" && last.length === 4) {
        // 4 clicks → cerrar la polilínea (agregar el primer punto al final
        // como referencia visual) y marcarla como ÁREA en drawingAreas.
        // El shell Q4 lo construye newBlank.build() leyendo drawingAreas.
        drawingObj.polylines.val = [
          ...polysNow.slice(0, -1),
          [...last, last[0]],   // cerrar visualmente
          [],                    // arrancar polilínea nueva
        ];
        if (drawingObj.areas) {
          drawingObj.areas.val = [...drawingObj.areas.rawVal, lastIdx];
        }
        updateStatus(`▦ Área (shell Q4) creada — 4 vértices marcados.`);
        try { (window as any).__hekatanRebuild?.(); } catch {}
        return;
      }
    }

    if (tool === "node") updateStatus(`● Nodo creado en (${point.x.toFixed(2)}, ${point.y.toFixed(2)}, ${point.z.toFixed(2)})`);
    else if (tool === "line") updateStatus(`／ Línea — click 1/2 OK. Marcá el segundo punto para crear el frame.`);
    else if (tool === "polyline") updateStatus(`⌐ Polilínea — punto agregado. Continuá clickeando, right-click para terminar.`);
    else if (tool === "area") {
      const last = drawingObj.polylines?.rawVal[drawingObj.polylines.rawVal.length - 1] ?? [];
      updateStatus(`▦ Área — click ${last.length}/4. Marcá ${4 - last.length} vértice${4 - last.length === 1 ? "" : "s"} más.`);
    }
  };

  // Tras CADA clic el prompt se recalcula del estado (va detrás del manejador
  // grande porque los listeners corren en orden de registro).
  rendererElm.addEventListener("click", () => refreshPrompt());

  // On contextmenu, add a new empty polyline
  rendererElm.addEventListener("contextmenu", (ev: Event) => {
    // ÁREA LIBRE: click-derecho cierra el polígono y lo mallar en shells Q4.
    const curToolCm = (window as any).__hekatanCadState?.get?.()?.tool;
    if (curToolCm === "polyarea" && polyAreaPts.length >= 3) {
      ev.preventDefault();
      const cnt = finalizePolyArea();
      updateStatus(`✓ Área libre mallada — ${cnt} shells Q4 creados.`);
      return;
    }
    if (
      !drawingObj.polylines ||
      drawingObj.polylines.rawVal[drawingObj.polylines.rawVal.length - 1]
        .length === 0
    )
      return;

    drawingObj.polylines.val = [...drawingObj.polylines.rawVal, []];
  });

  // On pointer move and intersection with plan, show indication point
  // CRÍTICO: este indicationPoint debe quedar en la MISMA coordenada que el
  // snapMarker Y el punto donde el click handler hace commit. Antes había
  // divergencias:
  //   1. indicationPoint mostraba raw raycast → corregido (osnap + grid snap)
  //   2. Click handler aplica AXIS LOCK + ORTO antes de osnap → este
  //      pointermove NO lo hacía → cuando ORTO=ON, cursor visual mostraba
  //      un punto distinto del que el click realmente comiteaba en la línea.
  //   3. Orden CRÍTICO: el click handler hace
  //         (raw → ctrl-round → axis-lock/ORTO → osnap → grid-snap)
  //      por lo que aquí replicamos ESE orden exacto. Discrepancia en el
  //      orden = punto distinto bajo ciertas combinaciones (ej. ORTO + OSNAP).
  rendererElm.addEventListener("pointermove", (event: PointerEvent) => {
    const _camForRay = setPointerFromEvent(event);
    if (!_camForRay) return;
    raycaster.setFromCamera(pointer, _camForRay);
    const intersect = intersectWorkPlane();

    indicationPoint.geometry.deleteAttribute("position"); // delete point if not intersection

    if (intersect.length) {
      let point = intersect[0].point.clone();

      // 1) Ctrl/Cmd → integer round (igual que click handler L2916-2922)
      if (event.ctrlKey || event.metaKey) {
        point.set(Math.round(point.x), Math.round(point.y), Math.round(point.z));
      }

      // 2) AXIS LOCK + ORTO (igual que click handler L2923-2945) — proyecta
      //    al eje dominante respecto al último punto de la polilínea actual.
      //    Sin este bloque, cuando ORTO=ON, cursor visual y commit divergen.
      {
        const polysNow = drawingObj.polylines?.rawVal ?? [];
        const lastPolyNow = polysNow[polysNow.length - 1] ?? [];
        const allPtsNow = drawingObj.points.rawVal ?? [];
        if (lastPolyNow.length > 0) {
          const lp = allPtsNow[lastPolyNow[lastPolyNow.length - 1]];
          if (lp) {
            const orthoOn = !!(window as any).__hekatanOrthoMode;
            // axisLock es la variable de closure (line 739), no el getter window.
            let effectiveLock: "x" | "y" | "z" | null = axisLock;
            if (!effectiveLock && orthoOn) {
              const dx = Math.abs(point.x - lp[0]);
              const dy = Math.abs(point.y - lp[1]);
              const dz = Math.abs(point.z - lp[2]);
              effectiveLock = dx >= dy && dx >= dz ? "x" : (dy >= dz ? "y" : "z");
            }
            if (effectiveLock === "x") point.set(point.x, lp[1], lp[2]);
            else if (effectiveLock === "y") point.set(lp[0], point.y, lp[2]);
            else if (effectiveLock === "z") point.set(lp[0], lp[1], point.z);
          }
        }
      }

      // 3) OSNAP (prioridad sobre grid snap, igual que click handler L2946-2951)
      const osnapTol = toleranciaOsnap(point);
      const osnap = (window as any).__hekatanOsnapCompute?.(point.x, point.y, point.z, osnapTol,
                                                            { x: event.clientX, y: event.clientY });
      if (osnap) {
        point.set(osnap.x, osnap.y, osnap.z);
      } else {
        // 4) Sin osnap → grid snap 2D (igual que click handler L2952-2962)
        const snapEnabled = (window as any).__hekatanSnapEnabled !== false;
        // El paso del enganche = la separación de la rejilla que se VE (AutoCAD: la rejilla sigue
        // al snap). Con «Paso cursor» 0.5 y rejilla de 1 m el punto caía entre líneas.
        const snap = (window as any).__hekatanGridConfig?.minorStep || ((window as any).__hekatanSnap2D ?? 0.5);
        if (snapEnabled && snap > 0) {
          point.x = Math.round(point.x / snap) * snap;
          point.y = Math.round(point.y / snap) * snap;
          point.z = Math.round(point.z / snap) * snap;
        }
      }

      indicationPoint.geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(point.toArray(), 3)
      );
    }

    viewerRender();
  });

  // On pointer move and intersection with a point, hide indication point
  rendererElm.addEventListener("pointermove", (event: PointerEvent) => {
    const _camForRay = setPointerFromEvent(event);
    if (!_camForRay) return;
    raycaster.setFromCamera(pointer, _camForRay);

    // Check if point in the plane
    let isPointInPlane = false;
    const intersectWithPoints = raycaster.intersectObject(points);
    const intersectWithPlane = intersectWorkPlane();
    if (intersectWithPoints.length && intersectWithPlane.length) {
      const point = new THREE.Vector3(
        ...drawingObj.points.rawVal[intersectWithPoints[0].index]
      );
      const planePoint = new THREE.Vector3(...intersectWithPlane[0].point);
      const planeToPoint = point.sub(planePoint);
      const planeNormal = intersectWithPlane[0].face?.normal;
      planeNormal.transformDirection(plane.matrixWorld);
      if (Math.abs(planeToPoint.dot(planeNormal)) < 1e-4) isPointInPlane = true;
    }

    indicationPoint.visible = isPointInPlane ? false : true;
  });

  // On pointer drag and intersection with a point and plane, update point position
  let isPointInPlaneWithoutControl = false;
  let pointIndex: number | undefined;
  rendererElm.addEventListener("pointermove", (event: PointerEvent) => {
    if (!pointerDownAndMovedCount) return;

    const _camForRay = setPointerFromEvent(event);
    if (!_camForRay) return;
    raycaster.setFromCamera(pointer, _camForRay);

    // Check if point in the plane
    let isPointInPlane = false;
    const intersectWithPoints = raycaster.intersectObject(points);
    const intersectWithPlane = intersectWorkPlane();
    if (intersectWithPoints.length && intersectWithPlane.length) {
      const point = new THREE.Vector3(
        ...drawingObj.points.rawVal[intersectWithPoints[0].index]
      );
      const planePoint = new THREE.Vector3(...intersectWithPlane[0].point);
      const planeToPoint = point.sub(planePoint);
      const planeNormal = intersectWithPlane[0].face?.normal;
      planeNormal.transformDirection(plane.matrixWorld);
      if (Math.abs(planeToPoint.dot(planeNormal)) < 1e-4) isPointInPlane = true;
    }

    // < 5 to not trigger with rotation
    if (isPointInPlane && pointerDownAndMovedCount < 5) {
      isPointInPlaneWithoutControl = true;
      controls.enabled = false;
      pointIndex = intersectWithPoints[0].index;
    }

    if (!isPointInPlaneWithoutControl) return;

    if (pointerDownAndMovedCount % 2 !== 0) return; // slow movements for (parametric) performance opt 5

    const newPoints = [...drawingObj.points.rawVal];
    if (pointIndex !== undefined) {
      let newPosition = intersectWithPlane[0].point;

      if (event.ctrlKey || event.metaKey) {
        newPosition = new THREE.Vector3(
          Math.round(newPosition.x),
          Math.round(newPosition.y),
          Math.round(newPosition.z)
        );
      }

      newPoints[pointIndex] = newPosition.toArray();
      // newPoints[pointIndex] = intersectWithPlane[0].point.toArray();
    }
    drawingObj.points.val = newPoints;
  });

  rendererElm.addEventListener("pointerup", () => {
    controls.enabled = true;
    isPointInPlaneWithoutControl = false;
  });

  // On contextmenu move and point in the plane, delete the point and update polyline
  rendererElm.addEventListener("contextmenu", (event: PointerEvent) => {
    const _camForRay = setPointerFromEvent(event);
    if (!_camForRay) return;
    raycaster.setFromCamera(pointer, _camForRay);

    // Check if point in the plane
    let isPointInPlane = false;
    const intersectWithPoints = raycaster.intersectObject(points);
    const intersectWithPlane = intersectWorkPlane();
    if (intersectWithPoints.length && intersectWithPlane.length) {
      const point = new THREE.Vector3(
        ...drawingObj.points.rawVal[intersectWithPoints[0].index]
      );
      const planePoint = new THREE.Vector3(...intersectWithPlane[0].point);
      const planeToPoint = point.sub(planePoint);
      const planeNormal = intersectWithPlane[0].face?.normal;
      planeNormal.transformDirection(plane.matrixWorld);
      if (Math.abs(planeToPoint.dot(planeNormal)) < 1e-4) isPointInPlane = true;
    }

    if (!isPointInPlane) return;

    const newPoints = [...drawingObj.points.rawVal];
    newPoints.splice(intersectWithPoints[0].index, 1);
    drawingObj.points.val = newPoints;

    if (!drawingObj.polylines) return;

    const newPolylines = drawingObj.polylines.rawVal
      .map((polyline) =>
        polyline.filter((i) => i !== intersectWithPoints[0].index)
      ) // remove point index from polyline
      .map((polyline) =>
        polyline.map((i) => (i > intersectWithPoints[0].index ? i - 1 : i))
      ) // update polyline indices
      .filter((polyline) => polyline.length); // remove empty polylines

    newPolylines.push([]); // add new empty polyline

    drawingObj.polylines.val = newPolylines;
  });
}

// Utils
function interpolate(
  object3D: THREE.Object3D,
  target: { position: THREE.Vector3; quaternion: THREE.Quaternion },
  onAnimate?: () => void
) {
  const duration = 500; // In milliseconds
  const fps = 30; // Frames per second
  const steps = Math.round(duration / (1000 / fps));
  const origin = {
    position: object3D.position.clone(),
    quaternion: object3D.quaternion.clone(),
  };
  const animationID = setInterval(animate, 1000 / fps);

  let step = 0;
  function animate() {
    step++;

    const t = step / steps;
    object3D.position.lerpVectors(origin.position, target.position, t);
    object3D.quaternion.slerpQuaternions(
      origin.quaternion,
      target.quaternion,
      t
    );

    if (onAnimate) onAnimate();

    if (step == steps) clearInterval(animationID);
  }
}
