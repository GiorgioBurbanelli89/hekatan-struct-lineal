/**
 * animadorCargaMovil — el vehículo cruzando la estructura, en el visor 3D.
 *
 * Es OTRO modo del visor, no la animación modal (`animateMode.ts`): aquí no hay un modo que
 * oscila, hay una SUCESIÓN DE ESTADOS ESTÁTICOS, uno por posición del camión. En cada cuadro:
 *   · el cuerpo deformado de las barras (extruido con su espesor), con mapa de color del
 *     desplazamiento |u| — la escala de color es FIJA para todo el recorrido (la del peor
 *     instante), así un color significa lo mismo en todos los cuadros;
 *   · el diagrama de momento M3 a escala, también fija (la de la envolvente);
 *   · el camión 3D (cabina, remolque, ruedas) y las flechas de sus ejes.
 * Al terminar la pasada se enseñan las ENVOLVENTES (M máx / mín con el carril) y vuelve a empezar.
 *
 * Todo vive en un `THREE.Group` propio dentro de la escena del visor y en una ventana flotante
 * (`ventanaFlotante`): no toca `mesh.nodes` (la animación modal sí lo hace) y al cerrarse deja
 * el visor como estaba.
 *
 * Unidades de entrada: kN, m. Se muestran en tonf·m / mm (Ecuador) o kN·m / mm.
 */
import * as THREE from "three";
import { ventanaFlotante } from "./menuDiseno";
import { currentLang } from "./i18n";
import {
  F_POR_BARRA, estadoEnPosicion, largoVehiculo,
  type LineasInfluencia, type Vehiculo, type Envolvente, type EstadoPosicion,
} from "./cargaMovil";

const W = window as any;
const t = (es: string, en: string) => (currentLang() === "en" ? en : es);

export interface DatosCargaMovil {
  nodes: number[][];
  elements: number[][];
  IL: LineasInfluencia;
  vehiculo: Vehiculo;
  /** abscisas del eje delantero (m) */
  xs: number[];
  /** respuesta a la carga permanente (relleno), se suma a cada posición */
  fija?: { U: Float64Array; F: Float64Array; R: Float64Array } | null;
  /** canto de cada barra (m) para dibujarla extruida */
  canto: (e: number) => number;
  /** cota de la cara superior del tablero (m): ahí ruedan las ruedas */
  zRodadura: number;
  /** abscisa global (X) del primer nudo del camino */
  x0: number;
  titulo: string;
  /** encuadrar la cámara de frente-arriba (solo al abrir, no al reconstruir) */
  encuadrar?: boolean;
  /** exportadores (botones de la ventana) */
  exportar?: Array<{ etiqueta: string; accion: () => void }>;
  /** textos extra para la ventana (fuente de la carga, avisos) */
  notas?: string[];
}

export interface AnimadorCargaMovil {
  cargar(d: DatosCargaMovil): void;
  ponerEnvolvente(env: Envolvente): void;
  progreso(texto: string, f: number): void;
  play(): void;
  pausa(): void;
  paso(n: number): void;
  ir(i: number): void;
  estado(): { i: number; n: number; xF: number; jugando: boolean; msCuadro: number; fps: number };
  dispose(): void;
}

// ── colormap JET (como CSI: bajo = azul, alto = rojo) ─────────────────────────
function jet(v: number, out: number[]) {
  const x = Math.min(1, Math.max(0, v));
  const r = Math.min(1, Math.max(0, 1.5 - Math.abs(4 * x - 3)));
  const g = Math.min(1, Math.max(0, 1.5 - Math.abs(4 * x - 2)));
  const b = Math.min(1, Math.max(0, 1.5 - Math.abs(4 * x - 1)));
  out[0] = r; out[1] = g; out[2] = b;
}

/** Hacia dónde se pinta un M3 POSITIVO en el plano XZ: la cara −2 (la traccionada), con el eje 2
 *  de CSI (`ejesCSI` de diagramaCSI.ts): barra no vertical → e2 = (−sgn(l)·n, |l|); vertical → +X. */
function ladoPositivoM(dx: number, dz: number): [number, number] {
  const L = Math.hypot(dx, dz) || 1, l = dx / L, n = dz / L;
  const e2 = Math.abs(l) < 1e-9 ? [1, 0] : [-Math.sign(l) * n, Math.abs(l)];
  return [-e2[0], -e2[1]];
}

function buscarVisor(): any {
  for (const d of document.querySelectorAll("div")) if ((d as any).__settings && (d as any).__ctx) return d;
  return null;
}

let ACTIVO: AnimadorCargaMovil | null = null;
/** Cierra la animación de carga móvil que haya abierta (al cambiar de ejemplo o reconstruir). */
export function cerrarCargaMovil() { try { ACTIVO?.dispose(); } catch { /* nada */ } ACTIVO = null; }

export function crearAnimadorCargaMovil(vigente?: () => boolean): AnimadorCargaMovil {
  cerrarCargaMovil();
  const visor = buscarVisor();
  const ctx = visor?.__ctx;
  const settings = visor?.__settings ?? ctx?.settings;
  const grupo = new THREE.Group();
  grupo.name = "hk-carga-movil";
  ctx?.scene?.add(grupo);
  const render = () => { try { ctx?.render?.(); } catch { /* nada */ } };

  // ── estado ──
  let D: DatosCargaMovil | null = null;
  let env: Envolvente | null = null;
  let i = 0, jugando = true, raf = 0, tUlt = 0, acum = 0;
  let velocidad = 12;          // posiciones por segundo
  let escDef = 0;              // factor de amplificación de la deformada (0 = automático)
  let escDefAuto = 1;
  let escM = 1;                // multiplicador del tamaño del diagrama
  let verDef = true, verM = true, verEnv = true, unidad: "tonf" | "kN" = "tonf";
  let enEnvolvente = false, tEnv = 0;
  let uMax = 1e-12, mMax = 1e-12, diag = 10;
  const tiempos: number[] = [];
  let estadoActual: EstadoPosicion | null = null;
  const visorPrevio = { def: settings?.deformedShape?.rawVal, fr: settings?.frameResults?.rawVal };
  if (settings?.deformedShape) settings.deformedShape.val = false;
  if (settings?.frameResults) settings.frameResults.val = "none";

  // ── marca de agua (PNG / vídeo publicables) ──
  const marca = document.createElement("div");
  marca.textContent = "Hekatan Struct";
  marca.style.cssText = "position:absolute;left:14px;bottom:10px;z-index:40;font:600 15px sans-serif;color:rgba(255,255,255,.35);pointer-events:none;letter-spacing:.5px";
  (visor ?? document.body).appendChild(marca);

  // ── ventana ──
  const pan = document.createElement("div");
  pan.id = "hk-carga-movil";
  pan.style.cssText = "position:fixed;bottom:84px;left:312px;z-index:950;width:300px;max-height:78vh;overflow:auto;background:rgba(22,26,32,.95);color:#e8e8e8;border:1px solid #4a7fb0;border-radius:6px;font:12px sans-serif;padding:8px";
  document.body.appendChild(pan);
  const btn = "background:#2a3340;color:#e8e8e8;border:1px solid #4a5a6a;border-radius:4px;padding:3px 7px;cursor:pointer;font:12px sans-serif";
  pan.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center"><b>🚚 ${t("Carga móvil", "Moving load")}</b>
      <span><span data-plegar title="${t("Plegar / desplegar", "Fold / unfold")}" style="cursor:pointer;margin-right:12px">▁</span><span id="hkcm-x" style="cursor:pointer" title="${t("Cerrar", "Close")}">✕</span></span></div>
    <div>
      <div id="hkcm-tit" style="color:#9fc3e6;margin:4px 0"></div>
      <div id="hkcm-prog" style="margin:4px 0;color:#e0c070"></div>
      <div style="display:flex;gap:4px;flex-wrap:wrap;margin:6px 0">
        <button id="hkcm-ini" style="${btn}" title="${t("Al inicio", "To start")}">⏮</button>
        <button id="hkcm-ant" style="${btn}" title="${t("Paso atrás", "Step back")}">◀</button>
        <button id="hkcm-play" style="${btn};min-width:70px"></button>
        <button id="hkcm-sig" style="${btn}" title="${t("Paso adelante", "Step forward")}">▶</button>
        <button id="hkcm-env" style="${btn}" title="${t("Ver envolventes", "Show envelopes")}">${t("Envolvente", "Envelope")}</button>
      </div>
      <input id="hkcm-pos" type="range" min="0" max="0" value="0" style="width:100%">
      <div style="display:grid;grid-template-columns:110px 1fr 44px;gap:3px;align-items:center;margin-top:4px">
        <span>${t("Velocidad", "Speed")}</span><input id="hkcm-vel" type="range" min="1" max="60" value="12"><span id="hkcm-velv"></span>
        <span>${t("Escala deformada", "Deformed scale")}</span><input id="hkcm-esc" type="range" min="-10" max="10" value="0"><span id="hkcm-escv"></span>
        <span>${t("Escala de M", "M scale")}</span><input id="hkcm-escm" type="range" min="-10" max="10" value="0"><span id="hkcm-escmv"></span>
      </div>
      <div style="margin:6px 0">
        <label><input id="hkcm-vdef" type="checkbox" checked> ${t("Deformada", "Deformed")}</label>
        <label style="margin-left:8px"><input id="hkcm-vm" type="checkbox" checked> ${t("Momento M", "Moment M")}</label>
        <label style="margin-left:8px"><input id="hkcm-venv" type="checkbox" checked> ${t("Envolvente al final", "Envelope at the end")}</label>
        <select id="hkcm-uni" style="margin-left:6px" title="${t("Unidades", "Units")}"><option value="tonf">tonf·m</option><option value="kN">kN·m</option></select>
      </div>
      <div id="hkcm-est" style="font:12px ui-monospace,Consolas,monospace;line-height:1.5;margin:6px 0;white-space:pre"></div>
      <canvas id="hkcm-cbar" width="300" height="34" style="width:100%;height:34px"></canvas>
      <div id="hkcm-envtxt" style="font:12px ui-monospace,Consolas,monospace;line-height:1.45;white-space:pre;color:#cfe3f5"></div>
      <div id="hkcm-exp" style="display:flex;gap:4px;flex-wrap:wrap;margin-top:6px"></div>
      <details style="margin-top:6px"><summary style="cursor:pointer;color:#9fc3e6">${t("Fuente, notas y tiempos", "Source, notes and timing")}</summary>
        <div id="hkcm-notas" style="color:#9aa1ad;margin-top:6px;line-height:1.4"></div>
        <div id="hkcm-perf" style="color:#7d8a99;margin-top:4px;font:11px ui-monospace,Consolas,monospace;white-space:pre"></div>
      </details>
    </div>`;
  ventanaFlotante(pan);
  const $ = (id: string) => pan.querySelector("#" + id) as any;

  // ── objetos 3D ──
  const matCuerpo = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide });
  const geoCuerpo = new THREE.BufferGeometry();
  const cuerpo = new THREE.Mesh(geoCuerpo, matCuerpo);
  grupo.add(cuerpo);
  const geoBordes = new THREE.BufferGeometry();
  const bordes = new THREE.LineSegments(geoBordes, new THREE.LineBasicMaterial({ color: 0x0b0f14, transparent: true, opacity: 0.55 }));
  grupo.add(bordes);
  const geoM = new THREE.BufferGeometry();
  const diagM = new THREE.Mesh(geoM, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false }));
  grupo.add(diagM);
  const geoMl = new THREE.BufferGeometry();
  const diagMl = new THREE.LineSegments(geoMl, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 }));
  grupo.add(diagMl);
  const geoEnv = new THREE.BufferGeometry();
  const envLineas = new THREE.LineSegments(geoEnv, new THREE.LineBasicMaterial({ vertexColors: true }));
  grupo.add(envLineas);
  const geoEnvF = new THREE.BufferGeometry();
  const envArea = new THREE.Mesh(geoEnvF, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.4, side: THREE.DoubleSide, depthWrite: false }));
  grupo.add(envArea);
  const camion = new THREE.Group();
  grupo.add(camion);

  // geometría del cuerpo: por barra, estaciones a lo largo; por estación 4 esquinas × 4 caras
  interface Tramo { e: number; nSeg: number; off: number }
  let tramos: Tramo[] = [];
  let nVert = 0;
  let pos: Float32Array = new Float32Array(0), col: Float32Array = new Float32Array(0);
  let posB: Float32Array = new Float32Array(0);
  const FONDO = 3.0;   // la franja de 1 m se DIBUJA con 3 m de fondo para que se vea (solo dibujo)
  const SOMBRA = [1.0, 0.82, 0.62, 0.7];   // cara frontal, superior, trasera, inferior

  function prepararCuerpo() {
    if (!D) return;
    tramos = []; let off = 0;
    D.elements.forEach((el, e) => {
      if (el.length !== 2) return;
      const a = D!.nodes[el[0]], b = D!.nodes[el[1]];
      const L = Math.hypot(b[0] - a[0], b[2] - a[2]);
      const nSeg = Math.max(1, Math.min(12, Math.ceil(L / 0.1 - 1e-9)));
      tramos.push({ e, nSeg, off });
      off += (nSeg + 1) * 8;
    });
    nVert = off;
    pos = new Float32Array(nVert * 3); col = new Float32Array(nVert * 3);
    const idx: number[] = [];
    for (const tr of tramos) for (let s = 0; s < tr.nSeg; s++) for (let f = 0; f < 4; f++) {
      const a0 = tr.off + s * 8 + f * 2, a1 = a0 + 1, b0 = a0 + 8, b1 = a1 + 8;
      idx.push(a0, b0, b1, a0, b1, a1);
    }
    geoCuerpo.setIndex(idx);
    geoCuerpo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geoCuerpo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    // bordes: las 4 aristas longitudinales
    let nB = 0; for (const tr of tramos) nB += tr.nSeg * 4;
    posB = new Float32Array(nB * 2 * 3);
    geoBordes.setAttribute("position", new THREE.BufferAttribute(posB, 3));
  }

  const tmpC = [0, 0, 0];
  /** Rellena el cuerpo con los desplazamientos U (6 por nudo) × esc, color = |u| / uRef. */
  function pintarCuerpo(U: Float64Array | null, esc: number, uRef: number, colorDe?: (n: number) => number) {
    if (!D) return;
    let kb = 0;
    for (const tr of tramos) {
      const el = D.elements[tr.e];
      const A = D.nodes[el[0]], B = D.nodes[el[1]];
      const dx = B[0] - A[0], dz = B[2] - A[2], L = Math.hypot(dx, dz) || 1;
      const ex = dx / L, ez = dz / L;
      const tx = ez, tz = -ex;                       // transversal en el plano (giro +θy la mueve)
      const h = D.canto(tr.e) / 2;
      const ui = U ? [U[el[0] * 6], U[el[0] * 6 + 2], U[el[0] * 6 + 4]] : [0, 0, 0];
      const uj = U ? [U[el[1] * 6], U[el[1] * 6 + 2], U[el[1] * 6 + 4]] : [0, 0, 0];
      const ai = ui[0] * ex + ui[1] * ez, aj = uj[0] * ex + uj[1] * ez;       // axial
      const vi = ui[0] * tx + ui[1] * tz, vj = uj[0] * tx + uj[1] * tz;       // transversal
      const ti = ui[2], tj = uj[2];                                            // θy
      const ci = colorDe ? colorDe(el[0]) : Math.hypot(ui[0], ui[1]);
      const cj = colorDe ? colorDe(el[1]) : Math.hypot(uj[0], uj[1]);
      for (let s = 0; s <= tr.nSeg; s++) {
        const x = s / tr.nSeg;
        // Hermite cúbica para lo transversal (con los giros de los extremos), lineal para lo axial
        const N1 = 1 - 3 * x * x + 2 * x ** 3, N2 = L * (x - 2 * x * x + x ** 3), N3 = 3 * x * x - 2 * x ** 3, N4 = L * (-x * x + x ** 3);
        const v = N1 * vi + N2 * ti + N3 * vj + N4 * tj;
        const a = (1 - x) * ai + x * aj;
        const ux = a * ex + v * tx, uz = a * ez + v * tz;
        const X = A[0] + x * dx + esc * ux, Z = A[2] + x * dz + esc * uz;
        const mag = colorDe ? (1 - x) * ci + x * cj : Math.hypot(ux, uz);
        jet(mag / (uRef || 1), tmpC);
        // 4 esquinas de la sección: (±h en el plano, ±FONDO/2 en Y)
        const P = [
          [X - tx * h, -FONDO / 2, Z - tz * h], [X + tx * h, -FONDO / 2, Z + tz * h],
          [X + tx * h, FONDO / 2, Z + tz * h], [X - tx * h, FONDO / 2, Z - tz * h],
        ];
        const base = tr.off + s * 8;
        for (let f = 0; f < 4; f++) {
          const p0 = P[f], p1 = P[(f + 1) % 4], k0 = (base + f * 2) * 3, k1 = k0 + 3;
          pos[k0] = p0[0]; pos[k0 + 1] = p0[1]; pos[k0 + 2] = p0[2];
          pos[k1] = p1[0]; pos[k1 + 1] = p1[1]; pos[k1 + 2] = p1[2];
          const sh = SOMBRA[f];
          col[k0] = tmpC[0] * sh; col[k0 + 1] = tmpC[1] * sh; col[k0 + 2] = tmpC[2] * sh;
          col[k1] = col[k0]; col[k1 + 1] = col[k0 + 1]; col[k1 + 2] = col[k0 + 2];
        }
        if (s > 0) for (let f = 0; f < 4; f++) {
          const kPrev = (base - 8 + f * 2) * 3, kNow = (base + f * 2) * 3;
          posB.set(pos.subarray(kPrev, kPrev + 3), kb); posB.set(pos.subarray(kNow, kNow + 3), kb + 3); kb += 6;
        }
      }
    }
    (geoCuerpo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    (geoCuerpo.attributes.color as THREE.BufferAttribute).needsUpdate = true;
    (geoBordes.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    geoCuerpo.computeBoundingSphere(); geoBordes.computeBoundingSphere();
  }

  /** Diagrama de M3 (valores del diagrama de CSI, positivo del lado traccionado −2). */
  function pintarM(F: Float64Array | null, escala: number) {
    if (!D || !F) { geoM.setAttribute("position", new THREE.BufferAttribute(new Float32Array(0), 3)); geoMl.setAttribute("position", new THREE.BufferAttribute(new Float32Array(0), 3)); return; }
    const P: number[] = [], C: number[] = [], Lp: number[] = [];
    const y = -FONDO / 2 - 0.05;
    D.elements.forEach((el, e) => {
      if (el.length !== 2) return;
      const A = D!.nodes[el[0]], B = D!.nodes[el[1]];
      const dx = B[0] - A[0], dz = B[2] - A[2], L = Math.hypot(dx, dz) || 1;
      // eje 2 de CSI en el plano XZ: barra horizontal → +Z; vertical → +X
      const lado = ladoPositivoM(dx, dz);
      const mi = F[e * F_POR_BARRA + 4] * escala, mj = F[e * F_POR_BARRA + 5] * escala;
      const push = (x: number, z: number) => P.push(x, y, z);
      const colr = (m: number) => (m >= 0 ? [0.95, 0.35, 0.3] : [0.3, 0.55, 0.95]);
      const tri = (x0: number, z0: number, m0: number, x1: number, z1: number, m1: number) => {
        // un trapecio (dos triángulos) entre la barra y la curva; si cambia de signo, se parte en el cero
        if (m0 * m1 < 0) {
          const r = m0 / (m0 - m1), xm = x0 + r * (x1 - x0), zm = z0 + r * (z1 - z0);
          tri(x0, z0, m0, xm, zm, 0); tri(xm, zm, 0, x1, z1, m1); return;
        }
        const c = colr(m0 + m1);
        const q0 = [x0 + lado[0] * m0, z0 + lado[1] * m0], q1 = [x1 + lado[0] * m1, z1 + lado[1] * m1];
        push(x0, z0); push(x1, z1); push(q1[0], q1[1]);
        push(x0, z0); push(q1[0], q1[1]); push(q0[0], q0[1]);
        for (let k = 0; k < 6; k++) C.push(c[0], c[1], c[2]);
        Lp.push(q0[0], y, q0[1], q1[0], y, q1[1]);
      };
      tri(A[0], A[2], mi, B[0], B[2], mj);
    });
    geoM.setAttribute("position", new THREE.BufferAttribute(new Float32Array(P), 3));
    geoM.setAttribute("color", new THREE.BufferAttribute(new Float32Array(C), 3));
    geoMl.setAttribute("position", new THREE.BufferAttribute(new Float32Array(Lp), 3));
    geoM.computeBoundingSphere(); geoMl.computeBoundingSphere();
  }

  /** Envolvente de M: el área de los máximos (roja) y la de los mínimos (azul), con su contorno. */
  function pintarEnvolvente(ver: boolean, escala: number) {
    if (!D || !env || !ver) {
      geoEnv.setAttribute("position", new THREE.BufferAttribute(new Float32Array(0), 3));
      geoEnvF.setAttribute("position", new THREE.BufferAttribute(new Float32Array(0), 3));
      return;
    }
    const P: number[] = [], C: number[] = [], Pf: number[] = [], Cf: number[] = [];
    const y = -FONDO / 2 - 0.08;
    D.elements.forEach((el, e) => {
      if (el.length !== 2) return;
      const A = D!.nodes[el[0]], B = D!.nodes[el[1]];
      const lado = ladoPositivoM(B[0] - A[0], B[2] - A[2]);
      for (const [arr, c] of [[env!.Fmax, [1, 0.35, 0.3]], [env!.Fmin, [0.35, 0.6, 1]]] as const) {
        const mi = (arr[e * F_POR_BARRA + 4] + (D!.fija?.F[e * F_POR_BARRA + 4] ?? 0)) * escala;
        const mj = (arr[e * F_POR_BARRA + 5] + (D!.fija?.F[e * F_POR_BARRA + 5] ?? 0)) * escala;
        const q0 = [A[0] + lado[0] * mi, A[2] + lado[1] * mi], q1 = [B[0] + lado[0] * mj, B[2] + lado[1] * mj];
        P.push(q0[0], y, q0[1], q1[0], y, q1[1]);
        C.push(c[0], c[1], c[2], c[0], c[1], c[2]);
        Pf.push(A[0], y, A[2], B[0], y, B[2], q1[0], y, q1[1], A[0], y, A[2], q1[0], y, q1[1], q0[0], y, q0[1]);
        for (let k = 0; k < 6; k++) Cf.push(c[0], c[1], c[2]);
      }
    });
    geoEnv.setAttribute("position", new THREE.BufferAttribute(new Float32Array(P), 3));
    geoEnv.setAttribute("color", new THREE.BufferAttribute(new Float32Array(C), 3));
    geoEnv.computeBoundingSphere();
    geoEnvF.setAttribute("position", new THREE.BufferAttribute(new Float32Array(Pf), 3));
    geoEnvF.setAttribute("color", new THREE.BufferAttribute(new Float32Array(Cf), 3));
    geoEnvF.computeBoundingSphere();
  }

  // ── el camión ──
  const flechas: THREE.ArrowHelper[] = [];
  const etiquetas: THREE.Sprite[] = [];
  function textoSprite(txt: string, color = "#ffdddd") {
    const c = document.createElement("canvas"); c.width = 256; c.height = 64;
    const g = c.getContext("2d")!; g.font = "bold 40px sans-serif"; g.fillStyle = color; g.textAlign = "center"; g.textBaseline = "middle";
    g.fillText(txt, 128, 32);
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), depthTest: false, transparent: true }));
    sp.scale.set(2.4, 0.6, 1);
    return sp;
  }
  function armarCamion() {
    camion.clear(); flechas.length = 0; etiquetas.length = 0;
    if (!D) return;
    const v = D.vehiculo, Lv = largoVehiculo(v);
    const R = 0.5, anchoC = 2.5, yR = 0.95;
    const caja = (w: number, h: number, d: number, color: number) => new THREE.Mesh(new THREE.BoxGeometry(w, d, h), new THREE.MeshBasicMaterial({ color }));
    const aristas = (m: THREE.Mesh) => { const l = new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry), new THREE.LineBasicMaterial({ color: 0x222222 })); m.add(l); return m; };
    // cabina (delante del eje delantero), remolque (del eje 2 hacia atrás)
    const cab = aristas(caja(2.3, 2.6, anchoC, 0xc62828)); cab.position.set(0.1, 0, R + 0.5 + 1.3); camion.add(cab);
    const vid = caja(0.05, 0.9, anchoC * 0.8, 0x7fb3e0); vid.position.set(1.26, 0, R + 0.5 + 1.9); camion.add(vid);
    const largoRem = Lv + 1.6 - 1.4;
    const rem = aristas(caja(largoRem, 2.9, anchoC, 0xdcdcdc)); rem.position.set(-1.4 - largoRem / 2, 0, R + 0.7 + 1.45); camion.add(rem);
    for (let k = 1; k <= 5; k++) { const r = caja(largoRem * 0.96, 0.03, 0.02, 0x9a9a9a); r.position.set(-1.4 - largoRem / 2, -anchoC / 2 - 0.01, R + 0.7 + k * 0.48); camion.add(r); }
    const chasis = caja(Lv + 2.2, 0.25, 1.4, 0x444444); chasis.position.set(-Lv / 2 + 0.2, 0, R + 0.35); camion.add(chasis);
    const geoR = new THREE.CylinderGeometry(R, R, 0.4, 20), matR = new THREE.MeshBasicMaterial({ color: 0x1b1b1b });
    const geoL = new THREE.CylinderGeometry(R * 0.45, R * 0.45, 0.42, 14), matL = new THREE.MeshBasicMaterial({ color: 0x9a9a9a });
    for (const e of v.ejes) for (const sy of [-1, 1]) {
      const w = new THREE.Mesh(geoR, matR); w.position.set(-e.d, sy * yR, R); camion.add(w);   // cilindro de three va en Y: ya es el eje de la rueda
      const l = new THREE.Mesh(geoL, matL); l.position.set(-e.d, sy * (yR + 0.01), R); camion.add(l);
    }
    // flechas de los ejes (largo ∝ P) y su valor
    const Pmax = Math.max(...v.ejes.map((e) => e.P)) || 1;
    for (const e of v.ejes) {
      const largo = 1.0 + 2.2 * e.P / Pmax, zTop = R + 0.7 + 2.9 + 0.3 + largo;
      const ar = new THREE.ArrowHelper(new THREE.Vector3(0, 0, -1), new THREE.Vector3(-e.d, 0, zTop), largo, 0xff3b30, 0.45, 0.3);
      camion.add(ar); flechas.push(ar);
      const sp = textoSprite(""); sp.position.set(-e.d, 0, zTop + 0.45); camion.add(sp); etiquetas.push(sp);
    }
    actualizarEtiquetas();
  }
  function actualizarEtiquetas() {
    if (!D) return;
    D.vehiculo.ejes.forEach((e, k) => {
      const sp = etiquetas[k]; if (!sp) return;
      const val = unidad === "tonf" ? `${(e.P / 9.80665).toFixed(2)} tonf` : `${e.P.toFixed(1)} kN`;
      const c = document.createElement("canvas"); c.width = 256; c.height = 64;
      const g = c.getContext("2d")!; g.font = "bold 40px sans-serif"; g.fillStyle = "#ffd0d0"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(val, 128, 32);
      (sp.material as THREE.SpriteMaterial).map?.dispose();
      (sp.material as THREE.SpriteMaterial).map = new THREE.CanvasTexture(c);
      (sp.material as THREE.SpriteMaterial).needsUpdate = true;
    });
  }

  // ── cálculo de escalas fijas para todo el recorrido ──
  function escalas() {
    if (!D) return;
    let xmin = Infinity, xmax = -Infinity, zmin = Infinity, zmax = -Infinity;
    for (const n of D.nodes) { xmin = Math.min(xmin, n[0]); xmax = Math.max(xmax, n[0]); zmin = Math.min(zmin, n[2]); zmax = Math.max(zmax, n[2]); }
    diag = Math.hypot(xmax - xmin, zmax - zmin) || 10;
    uMax = 1e-12; mMax = 1e-12;
    for (const xF of D.xs) {
      const s = estado(xF);
      for (let n = 0; n < D.nodes.length; n++) uMax = Math.max(uMax, Math.hypot(s.U[n * 6], s.U[n * 6 + 2]));
      for (let e = 0; e < D.elements.length; e++) mMax = Math.max(mMax, Math.abs(s.F[e * F_POR_BARRA + 4]), Math.abs(s.F[e * F_POR_BARRA + 5]));
    }
    // deformada: el peor desplazamiento se ve como el 4 % de la diagonal (del orden de SAP2000 en «Auto»)
    escDefAuto = 0.04 * diag / uMax;
  }
  const cache = new Map<number, EstadoPosicion>();
  function estado(xF: number): EstadoPosicion {
    let s = cache.get(xF);
    if (s) return s;
    s = estadoEnPosicion(D!.IL, D!.vehiculo, xF);
    if (D!.fija) {
      for (let k = 0; k < s.U.length; k++) s.U[k] += D!.fija.U[k];
      for (let k = 0; k < s.F.length; k++) s.F[k] += D!.fija.F[k];
    }
    cache.set(xF, s);
    return s;
  }
  const factorEsc = (v: number) => Math.pow(10, v / 10);   // slider −10…10 → ×0.1…×10
  const escM_ = () => escM * 0.12 * diag / (env ? Math.max(mMax, ...[...env.Fmax, ...env.Fmin].map(Math.abs)) : mMax);

  function fmtF(kN: number) { return unidad === "tonf" ? `${(kN / 9.80665).toFixed(2)} tonf·m` : `${kN.toFixed(1)} kN·m`; }

  // ── un cuadro ──
  function dibujar() {
    if (!D) return;
    const t0 = performance.now();
    const n = D.xs.length;
    i = Math.max(0, Math.min(n - 1, i));
    const xF = D.xs[i];
    const s = estado(xF);
    estadoActual = s;
    const esc = (escDef === 0 ? 1 : 1) * escDefAuto * factorEsc(escDef);
    if (enEnvolvente && env) {
      // envolvente: cuerpo sin deformar coloreado con el peor asiento vertical (Uz mín)
      const colorDe = (nd: number) => Math.abs(Math.min(0, env!.Umin[nd * 6 + 2] + (D!.fija?.U[nd * 6 + 2] ?? 0)));
      let ref = 1e-12; for (let nd = 0; nd < D.nodes.length; nd++) ref = Math.max(ref, colorDe(nd));
      pintarCuerpo(null, 0, ref, colorDe);
      pintarM(null, 0);
      pintarEnvolvente(true, escM_());
      camion.visible = false;
    } else {
      pintarCuerpo(verDef ? s.U : null, verDef ? esc : 0, uMax);
      pintarM(verM ? s.F : null, escM_());
      pintarEnvolvente(false, 0);
      camion.visible = true;
      // el camión rueda sobre la cara superior del tablero, siguiendo la deformada bajo sus ejes
      const zs = s.pesos.xEjes.map((x) => zDeformada(x, s.U, verDef ? esc : 0));
      camion.position.set(D.x0 + xF, 0, D.zRodadura + Math.max(...zs));
    }
    cuerpo.visible = true;
    diagM.visible = verM && !enEnvolvente; diagMl.visible = diagM.visible;
    render();
    // estado en la ventana
    let uzMin = 0, mMx = -Infinity, mMn = Infinity;
    for (let nd = 0; nd < D.nodes.length; nd++) uzMin = Math.min(uzMin, s.U[nd * 6 + 2]);
    for (let e = 0; e < D.elements.length; e++) { const a = s.F[e * F_POR_BARRA + 4], b = s.F[e * F_POR_BARRA + 5]; mMx = Math.max(mMx, a, b); mMn = Math.min(mMn, a, b); }
    const eq = s.sumaCargas - s.sumaReacciones;
    $("hkcm-est").textContent = enEnvolvente
      ? t("ENVOLVENTE (camión + carril)", "ENVELOPE (truck + lane)")
      : `${t("Posición", "Position")} ${i + 1}/${n}   x = ${xF.toFixed(2)} m\n` +
        `ΣP ${t("ejes", "axles")} = ${fmtF(s.sumaCargas).replace("·m", "")}\n` +
        `ΣR − ΣP = ${eq.toExponential(1)} kN\n` +
        `Uz ${t("mín", "min")} = ${(uzMin * 1000).toFixed(3)} mm\n` +
        `M3 ${t("máx", "max")} = ${fmtF(mMx)}\nM3 ${t("mín", "min")} = ${fmtF(mMn)}`;
    $("hkcm-play").textContent = jugando ? `⏸ ${t("Pausa", "Pause")}` : `▶ ${t("Play", "Play")}`;
    $("hkcm-pos").max = String(n - 1); $("hkcm-pos").value = String(i);
    $("hkcm-velv").textContent = `${velocidad}/s`;
    $("hkcm-escv").textContent = `×${(esc).toPrecision(3)}`;
    $("hkcm-escmv").textContent = `×${factorEsc(Math.log10(escM) * 10).toFixed(2)}`;
    const dt = performance.now() - t0;
    tiempos.push(dt); if (tiempos.length > 60) tiempos.shift();
    const med = tiempos.reduce((a, b) => a + b, 0) / tiempos.length;
    W.__hekatanCargaMovilPerf = { msCuadro: med, i, n };
    $("hkcm-perf").textContent = `${t("IL", "IL")}: ${D.IL.camino.nudos.length} ${t("casos", "cases")} · ${D.IL.ms.toFixed(0)} ms` +
      (env ? `\n${t("envolvente", "envelope")}: ${env.nPosiciones} ${t("posiciones", "positions")} · ${env.ms.toFixed(0)} ms` : "") +
      `\n${t("cuadro", "frame")}: ${med.toFixed(1)} ms (${t("máx.", "max")} ${(1000 / Math.max(med, 1e-3)).toFixed(0)} fps)`;
    pintarBarra(enEnvolvente ? null : uMax);
  }

  function zDeformada(x: number, U: Float64Array, esc: number) {
    if (!D) return 0;
    const c = D.IL.camino; const s = c.s; const nn = s.length;
    if (x <= s[0] || x >= s[nn - 1]) return 0;
    let lo = 0, hi = nn - 1;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (s[m] <= x) lo = m; else hi = m; }
    const r = (x - s[lo]) / (s[hi] - s[lo]);
    return esc * ((1 - r) * U[c.nudos[lo] * 6 + 2] + r * U[c.nudos[hi] * 6 + 2]);
  }

  function pintarBarra(ref: number | null) {
    const cv = $("hkcm-cbar") as HTMLCanvasElement; const g = cv.getContext("2d")!;
    g.clearRect(0, 0, cv.width, cv.height);
    for (let x = 0; x < cv.width; x++) { jet(x / (cv.width - 1), tmpC); g.fillStyle = `rgb(${tmpC.map((v) => Math.round(v * 255)).join(",")})`; g.fillRect(x, 0, 1, 14); }
    g.fillStyle = "#ddd"; g.font = "11px sans-serif";
    let r = ref;
    if (r === null && env && D) { r = 0; for (let nd = 0; nd < D.nodes.length; nd++) r = Math.max(r, Math.abs(Math.min(0, env.Umin[nd * 6 + 2] + (D.fija?.U[nd * 6 + 2] ?? 0)))); }
    g.textAlign = "left"; g.fillText("0", 2, 28);
    g.textAlign = "right"; g.fillText(`${((r ?? 0) * 1000).toFixed(2)} mm  ${ref === null ? t("(Uz mín., envolvente)", "(min Uz, envelope)") : "|u|"}`, cv.width - 2, 28);
  }

  function textoEnvolvente() {
    if (!env || !D) { $("hkcm-envtxt").textContent = t("Envolvente: calculando…", "Envelope: computing…"); return; }
    let mx = -Infinity, mn = Infinity, eMx = -1, eMn = -1, uz = 0, nUz = -1;
    for (let e = 0; e < D.elements.length; e++) for (const k of [4, 5]) {
      const a = env.Fmax[e * F_POR_BARRA + k] + (D.fija?.F[e * F_POR_BARRA + k] ?? 0), b = env.Fmin[e * F_POR_BARRA + k] + (D.fija?.F[e * F_POR_BARRA + k] ?? 0);
      if (a > mx) { mx = a; eMx = e; } if (b < mn) { mn = b; eMn = e; }
    }
    for (let nd = 0; nd < D.nodes.length; nd++) { const u = env.Umin[nd * 6 + 2] + (D.fija?.U[nd * 6 + 2] ?? 0); if (u < uz) { uz = u; nUz = nd; } }
    const donde = (e: number) => { const el = D!.elements[e]; const a = D!.nodes[el[0]], b = D!.nodes[el[1]]; return `x≈${((a[0] + b[0]) / 2).toFixed(2)} z≈${((a[2] + b[2]) / 2).toFixed(2)}`; };
    $("hkcm-envtxt").textContent =
      `${t("Envolvente", "Envelope")} (${env.nPosiciones} ${t("pos.", "pos.")}` + (env.separaciones.length > 1 ? `, ${t("sep. trasera", "rear spacing")} ${env.separaciones[0]}–${env.separaciones[env.separaciones.length - 1]} m` : "") + `)\n` +
      `M3 máx = ${fmtF(mx)}  (${donde(eMx)})\nM3 mín = ${fmtF(mn)}  (${donde(eMn)})\n` +
      `Uz mín = ${(uz * 1000).toFixed(3)} mm` + (nUz >= 0 ? `  (x=${D.nodes[nUz][0].toFixed(2)}, z=${D.nodes[nUz][2].toFixed(2)})` : "");
  }

  /** Cámara de frente y algo desde arriba, con el camión dentro del cuadro. */
  function encuadrar() {
    if (!D || !ctx?.camera || !ctx?.controls) return;
    let xmin = Infinity, xmax = -Infinity, zmin = Infinity, zmax = -Infinity;
    for (const n of D.nodes) { xmin = Math.min(xmin, n[0]); xmax = Math.max(xmax, n[0]); zmin = Math.min(zmin, n[2]); zmax = Math.max(zmax, n[2]); }
    // el camión entra en el cuadro: medio camión por delante y por detrás, y su alto
    const Lv = largoVehiculo(D.vehiculo) + 2.5;
    xmin -= Lv * 0.5; xmax += Lv * 0.5; zmax += 5.5;
    const cx = (xmin + xmax) / 2, cz = (zmin + zmax) / 2, ext = Math.hypot(xmax - xmin, zmax - zmin);
    const dir = new THREE.Vector3(0.28, -1, 0.42).normalize();
    const cam = ctx.camera as THREE.PerspectiveCamera;
    // el centro de la vista, un poco a la izquierda del modelo: la ventana 🚚 tapa la esquina izquierda
    const tx = cx - 0.22 * ext, k = 1.55 * ext;
    ctx.controls.target.set(tx, 0, cz);
    cam.position.set(tx + dir.x * k, dir.y * k, cz + dir.z * k);
    cam.up.set(0, 0, 1);
    cam.lookAt(tx, 0, cz);
    cam.updateProjectionMatrix?.();
    ctx.controls.update();
  }

  // ── bucle ──
  function tick(now: number) {
    raf = requestAnimationFrame(tick);
    // otro ejemplo cargado, o el mismo reconstruido: esta animación ya no es de lo que hay en pantalla
    if (vigente && !vigente()) { api.dispose(); return; }
    if (!D || !jugando) { tUlt = now; return; }
    const dt = Math.min(0.25, (now - (tUlt || now)) / 1000); tUlt = now;
    if (enEnvolvente) { tEnv += dt; if (tEnv > 3.5) { enEnvolvente = false; i = 0; dibujar(); } return; }
    acum += dt * velocidad;
    if (acum < 1) return;
    const pasos = Math.floor(acum); acum -= pasos;
    if (i + pasos >= D.xs.length) {
      if (verEnv && env) { enEnvolvente = true; tEnv = 0; i = D.xs.length - 1; dibujar(); return; }
      i = 0;
    } else i += pasos;
    dibujar();
  }
  raf = requestAnimationFrame(tick);

  // ── eventos de la ventana ──
  $("hkcm-x").onclick = () => api.dispose();
  $("hkcm-play").onclick = () => { jugando ? api.pausa() : api.play(); };
  $("hkcm-ini").onclick = () => { enEnvolvente = false; api.pausa(); api.ir(0); };
  $("hkcm-ant").onclick = () => { api.pausa(); api.paso(-1); };
  $("hkcm-sig").onclick = () => { api.pausa(); api.paso(1); };
  $("hkcm-env").onclick = () => { if (!env) return; api.pausa(); enEnvolvente = true; dibujar(); };
  $("hkcm-pos").oninput = (ev: any) => { enEnvolvente = false; api.pausa(); api.ir(+ev.target.value); };
  $("hkcm-vel").oninput = (ev: any) => { velocidad = +ev.target.value; dibujar(); };
  $("hkcm-esc").oninput = (ev: any) => { escDef = +ev.target.value; dibujar(); };
  $("hkcm-escm").oninput = (ev: any) => { escM = factorEsc(+ev.target.value); dibujar(); };
  $("hkcm-vdef").onchange = (ev: any) => { verDef = ev.target.checked; dibujar(); };
  $("hkcm-vm").onchange = (ev: any) => { verM = ev.target.checked; dibujar(); };
  $("hkcm-venv").onchange = (ev: any) => { verEnv = ev.target.checked; };
  $("hkcm-uni").onchange = (ev: any) => { unidad = ev.target.value; actualizarEtiquetas(); textoEnvolvente(); dibujar(); };

  const api: AnimadorCargaMovil = {
    cargar(d) {
      D = d; cache.clear(); i = 0; enEnvolvente = false;
      $("hkcm-tit").textContent = d.titulo;
      $("hkcm-prog").textContent = "";
      $("hkcm-notas").innerHTML = (d.notas ?? []).map((s) => `<div>${s}</div>`).join("");
      const ex = $("hkcm-exp"); ex.innerHTML = "";
      for (const b of d.exportar ?? []) { const bb = document.createElement("button"); bb.textContent = b.etiqueta; bb.style.cssText = btn; bb.onclick = b.accion; ex.appendChild(bb); }
      prepararCuerpo(); escalas(); armarCamion(); textoEnvolvente();
      if (d.encuadrar) encuadrar();
      dibujar();
    },
    ponerEnvolvente(e) { env = e; textoEnvolvente(); dibujar(); },
    progreso(texto, f) { $("hkcm-prog").textContent = `${texto} ${(f * 100).toFixed(0)} %`; },
    play() { jugando = true; tUlt = 0; dibujar(); },
    pausa() { jugando = false; dibujar(); },
    paso(n) { if (!D) return; enEnvolvente = false; i = (i + n + D.xs.length) % D.xs.length; dibujar(); },
    ir(k) { i = k; dibujar(); },
    estado() {
      const med = tiempos.length ? tiempos.reduce((a, b) => a + b, 0) / tiempos.length : 0;
      return { i, n: D?.xs.length ?? 0, xF: D?.xs[i] ?? 0, jugando, msCuadro: med, fps: med ? 1000 / med : 0 };
    },
    dispose() {
      cancelAnimationFrame(raf);
      ctx?.scene?.remove(grupo);
      grupo.traverse((o: any) => { o.geometry?.dispose?.(); if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m: any) => { m.map?.dispose?.(); m.dispose?.(); }); });
      pan.remove(); marca.remove();
      if (settings?.deformedShape && visorPrevio.def !== undefined) settings.deformedShape.val = visorPrevio.def;
      render();
      if (ACTIVO === api) ACTIVO = null;
      W.__hekatanCargaMovil = undefined;
    },
  };
  ACTIVO = api;
  W.__hekatanCargaMovil = api;
  void estadoActual;
  return api;
}
