/**
 * Example: Zapata Medianera + Viga de Amarre + Zapata Centrada
 * Shell Q4 (zapatas) + Frame (viga) + Frame (pedestales) + Winkler springs real.
 */
import * as THREE from "three";
import van from "vanjs-core";
import { deform, analyze, modalAnalysis, type Node, type Element } from "hekatan-fem";
import type { ExampleDef, BuildStates } from "../exampleRegistry";
import { activeExampleVersion } from "../workspace/exampleVersion";

// f'c=210 kg/cm² → E=14100·√210=2043284.12 t/m²=20.04e6 kN/m² (valor del libro/SAFE Ej.6).
// Antes 25e6 (≈f'c 327): más rígido que el libro, repartía la presión ~4% más plano.
const Ec = 20.04e6;
const nu_c = 0.2;
const Gc = Ec / (2 * (1 + nu_c));
const G_GRAVITY = 9.81, rho = 24 / G_GRAVITY;  // 2.446 t/m3 (masa)

// ── Parámetros visuales de resortes 3D (igual estilo que zapata-aislada) ──
const SPRING_HEIGHT = 0.20;
const SPRING_WIDTH  = 0.035;
const SPRING_COILS  = 8;
const ANCHOR_SIZE   = 0.04;
const MAT_SPRING = new THREE.LineBasicMaterial({ color: 0xff0033, linewidth: 2 });
const MAT_GROUND = new THREE.LineBasicMaterial({ color: 0x00cc00, linewidth: 2 });

export const zapataVigaAmarre: ExampleDef = {
  id: "zapata-viga-amarre",
  name: "Zapata + Viga de Amarre + Pedestal",
  category: "4️⃣ Mixtos · 🧰 Cimentaciones",
  defaultShellResult: "pressure",
  availableShellResults: ["pressure", "bendingXX", "bendingYY", "displacementZ", "vonMises"],
  hasModal: true,
  params: {
    // ── 📐 Geometría zapatas ─────────────────────────────────────
    Lz1: { default: 2.0, min: 1.0, max: 4.0, step: 0.1, label: "Lz1 (m)", folder: "📐 Geometría zapatas",
      description: "Lado X de la Zapata 1 (medianera). Dimensión paralela al eje viga amarre. Típico 2-4 m." },
    Bz1: { default: 2.0, min: 1.0, max: 4.0, step: 0.1, label: "Bz1 (m)", folder: "📐 Geometría zapatas",
      description: "Lado Y de la Zapata 1. Dimensión perpendicular al eje viga amarre. Típico 2-4 m." },
    Lz2: { default: 2.5, min: 1.0, max: 4.0, step: 0.1, label: "Lz2 (m)", folder: "📐 Geometría zapatas",
      description: "Lado X de la Zapata 2 (interna). Dimensión paralela al eje viga amarre." },
    Bz2: { default: 2.0, min: 1.0, max: 4.0, step: 0.1, label: "Bz2 (m)", folder: "📐 Geometría zapatas",
      description: "Lado Y de la Zapata 2. Dimensión perpendicular al eje viga amarre." },
    tz:  { default: 0.5, min: 0.2, max: 1.0, step: 0.05, label: "tz espesor (m)", folder: "📐 Geometría zapatas",
      description: "Espesor (canto) común de ambas zapatas, en metros. Típico 0.30-0.80 m. Afecta rigidez flexural y peso propio del slab." },
    // ── 🏗 Viga de amarre ────────────────────────────────────────
    Lv:  { default: 3.0, min: 1.0, max: 6.0, step: 0.1, label: "Lv claro (m)", folder: "🏗 Viga de amarre",
      description: "Distancia LIBRE entre borde derecho de Z1 y borde izquierdo de Z2 (el gap). NO es la longitud total de la viga (que va col-a-col, atravesando ambas zapatas)." },
    Bv:  { default: 0.25, min: 0.2, max: 0.8, step: 0.05, label: "Bv ancho (m)", folder: "🏗 Viga de amarre",
      description: "Ancho (dimensión horizontal) de la sección rectangular de la viga de amarre. Típico 0.25-0.45 m." },
    Hv:  { default: 0.30, min: 0.2, max: 0.8, step: 0.05, label: "Hv canto (m)", folder: "🏗 Viga de amarre",
      description: "Canto (dimensión vertical) de la sección rectangular de la viga. Mayor canto = más rigidez flexural. Típico 0.40-0.95 m." },
    vigaLevel: { default: 0, min: 0, max: 1, step: 1, label: "Viga: 0=baja 1=alta", folder: "🏗 Viga de amarre",
      description: "0 = viga al nivel del slab (z=0). 1 = viga elevada al nivel del pedestal. La convención SAFE es 0 (mismo plano que la zapata)." },
    // ── 🏛 Columna + pedestal ────────────────────────────────────
    bc:  { default: 0.4, min: 0.2, max: 0.8, step: 0.05, label: "bc columna (m)", folder: "🏛 Columna + pedestal",
      description: "Lado de la sección CUADRADA de la columna. La columna NO va como frame: se modela como un Stiff patch en el slab (área rígida que distribuye la carga axial)." },
    Hp:  { default: 0.8, min: 0.3, max: 2.0, step: 0.1, label: "Hp pedestal (m)", folder: "🏛 Columna + pedestal",
      description: "Altura del pedestal (frame vertical) sobre la zapata, en metros. Las cargas P/M se aplican en el TOPE del pedestal a z=Hp." },
    // ── 🌍 Suelo (Winkler) ───────────────────────────────────────
    ks:  { default: 2000, min: 500, max: 30000, step: 500, label: "ks Winkler (kN/m³)", folder: "🌍 Suelo",
      description: "Módulo de balasto vertical kv del suelo (modelo Winkler). Típico: 10000 (suelo blando) - 50000 kN/m³ (suelo denso). Para Guerra Ej6 = 37461 kN/m³." },
    // ── 🔴 Cargas Dead (CM) ──────────────────────────────────────
    useDead: { default: 1, boolean: true, label: "Activar Dead (CM)", folder: "🔴 Cargas Dead (CM)",
      description: "Activa/desactiva el patrón Dead. Si OFF las cargas P_dead/M_dead se ignoran en el análisis Y en el F2K. Default ON." },
    P1:  { default: 25,  min: 1,  max: 200, step: 1,   label: "P1 Dead (tonf)",   folder: "🔴 Cargas Dead (CM)",
      hiddenIf: (p) => (p.useDead ?? 1) < 0.5,
      description: "Carga axial muerta (peso propio + CM) sobre Columna 1, en tonf. +compresión. Para Guerra Ej6 Col1 = 70 t." },
    M1x: { default: 1,   min: -5, max: 5,   step: 0.1, label: "M1x Dead (tonf·m)", folder: "🔴 Cargas Dead (CM)",
      hiddenIf: (p) => (p.useDead ?? 1) < 0.5,
      description: "Momento muerto en eje X de Columna 1, tonf·m. Genera flexión My en la zapata." },
    M1y: { default: 2.5, min: -5, max: 5,   step: 0.1, label: "M1y Dead (tonf·m)", folder: "🔴 Cargas Dead (CM)",
      hiddenIf: (p) => (p.useDead ?? 1) < 0.5,
      description: "Momento muerto en eje Y de Columna 1, tonf·m. Genera flexión Mx en la zapata." },
    P2:  { default: 40,  min: 1,  max: 200, step: 1,   label: "P2 Dead (tonf)",   folder: "🔴 Cargas Dead (CM)",
      hiddenIf: (p) => (p.useDead ?? 1) < 0.5,
      description: "Carga axial muerta sobre Columna 2. Para Guerra Ej6 Col2 = 89 t." },
    M2x: { default: 1,   min: -5, max: 5,   step: 0.1, label: "M2x Dead (tonf·m)", folder: "🔴 Cargas Dead (CM)",
      hiddenIf: (p) => (p.useDead ?? 1) < 0.5,
      description: "Momento muerto en eje X de Columna 2." },
    M2y: { default: 2.5, min: -5, max: 5,   step: 0.1, label: "M2y Dead (tonf·m)", folder: "🔴 Cargas Dead (CM)",
      hiddenIf: (p) => (p.useDead ?? 1) < 0.5,
      description: "Momento muerto en eje Y de Columna 2." },
    // ── 🔵 Cargas Live (CV) ──────────────────────────────────────
    useLive: { default: 1, boolean: true, label: "Activar Live (CV)", folder: "🔵 Cargas Live (CV)",
      description: "Activa/desactiva el patrón Live. Si OFF las cargas P_live/M_live se ignoran en análisis Y en F2K. La combinación Pu=1.4D+1.7L solo aplica si ambos están activos." },
    P1_L:  { default: 0, min: 0,  max: 200, step: 1,   label: "P1 Live (tonf)",   folder: "🔵 Cargas Live (CV)",
      hiddenIf: (p) => (p.useLive ?? 1) < 0.5,
      description: "Carga axial viva (CV) sobre Columna 1. Para Guerra Ej6 Col1 = 40 t." },
    M1x_L: { default: 0, min: -5, max: 5,   step: 0.1, label: "M1x Live (tonf·m)", folder: "🔵 Cargas Live (CV)",
      hiddenIf: (p) => (p.useLive ?? 1) < 0.5,
      description: "Momento vivo en eje X de Columna 1." },
    M1y_L: { default: 0, min: -5, max: 5,   step: 0.1, label: "M1y Live (tonf·m)", folder: "🔵 Cargas Live (CV)",
      hiddenIf: (p) => (p.useLive ?? 1) < 0.5,
      description: "Momento vivo en eje Y de Columna 1." },
    P2_L:  { default: 0, min: 0,  max: 200, step: 1,   label: "P2 Live (tonf)",   folder: "🔵 Cargas Live (CV)",
      hiddenIf: (p) => (p.useLive ?? 1) < 0.5,
      description: "Carga axial viva sobre Columna 2. Para Guerra Ej6 Col2 = 51 t." },
    M2x_L: { default: 0, min: -5, max: 5,   step: 0.1, label: "M2x Live (tonf·m)", folder: "🔵 Cargas Live (CV)",
      hiddenIf: (p) => (p.useLive ?? 1) < 0.5,
      description: "Momento vivo en eje X de Columna 2." },
    M2y_L: { default: 0, min: -5, max: 5,   step: 0.1, label: "M2y Live (tonf·m)", folder: "🔵 Cargas Live (CV)",
      hiddenIf: (p) => (p.useLive ?? 1) < 0.5,
      description: "Momento vivo en eje Y de Columna 2." },
    // ── 🔧 Mallado FEM ───────────────────────────────────────────
    nSubX: { default: 8, min: 2, max: 12, step: 1, label: "nx subdivisiones", folder: "🔧 Mallado FEM",
      description: "Subdivisiones del mesh Q4 en X. El pico del borde de la medianera es SINGULAR: con 4×4 se subestima (~18); con 8×8 llega a ~26 como el libro (validado nodo-a-nodo vs SAFE)." },
    nSubY: { default: 8, min: 2, max: 12, step: 1, label: "ny subdivisiones", folder: "🔧 Mallado FEM",
      description: "Subdivisiones en Y. 8×8 reproduce el pico del libro (24-26 t/m²); 4×4 lo subestima." },
  },
  build(p, states) {
    const Lz1 = p.Lz1, Bz1 = p.Bz1, Lv = p.Lv, Bv = p.Bv, Hv = p.Hv;
    const Lz2 = p.Lz2, Bz2 = p.Bz2, tz = p.tz, bc = p.bc, Hp = p.Hp;
    // Conversión tonf → kN (para el solver que trabaja en SI kN/m).
    // Aplicamos el combo D+L (servicio) como carga total en el FEM, respetando
    // los toggles useDead/useLive. Para diseño LRFD el exporter F2K agrega la
    // combo Pu=1.4D+1.7L.
    const TONF_TO_KN = 9.80665;
    const fD = (p.useDead ?? 1) >= 0.5 ? 1 : 0;
    const fL = (p.useLive ?? 1) >= 0.5 ? 1 : 0;
    const P1 = (fD * (p.P1 ?? 0) + fL * (p.P1_L ?? 0)) * TONF_TO_KN;
    const P2 = (fD * (p.P2 ?? 0) + fL * (p.P2_L ?? 0)) * TONF_TO_KN;
    const ks = p.ks;
    const M1x = (fD * (p.M1x ?? 0) + fL * (p.M1x_L ?? 0)) * TONF_TO_KN;
    const M1y = (fD * (p.M1y ?? 0) + fL * (p.M1y_L ?? 0)) * TONF_TO_KN;
    const M2x = (fD * (p.M2x ?? 0) + fL * (p.M2x_L ?? 0)) * TONF_TO_KN;
    const M2y = (fD * (p.M2y ?? 0) + fL * (p.M2y_L ?? 0)) * TONF_TO_KN;
    const nSubX = Math.round(p.nSubX), nSubY = Math.round(p.nSubY);

    // Offset Y para alinear centros de las 2 zapatas (la viga amarre debe
    // pasar por el centro de AMBAS, asi como en el libro Guerra Fig.179).
    // xC1 = bc/2: Col Z1 es MEDIANERA — cara izq de columna flush con borde
    // izq de zapata (convención Guerra Fig.179). Antes hardcoded 0.2 → con
    // bc=0.5 el Stiff patch xCol±bc/2 sobresalía 5cm fuera del slab.
    const yOff2 = (Bz1 - Bz2) / 2;
    const xC1 = bc / 2, yC1 = Bz1 / 2;
    const xC2 = Lz1 + Lv + Lz2 / 2, yC2 = Bz2 / 2 + yOff2;  // = yC1 = Bz1/2
    const yViga = yC1;  // la viga es horizontal en Y centro

    function buildGridX(xMin: number, xMax: number, forced: number[], nSub: number): number[] {
      const raw = [xMin, ...forced.filter((x) => x > xMin && x < xMax), xMax].sort((a, b) => a - b);
      // dedup con tolerancia: si se fuerzan 2 líneas casi iguales (yC1≈yViga) se duplicaba
      // la fila → shells degenerados. Lo evitamos.
      const all = raw.filter((x, i) => i === 0 || x - raw[i - 1] > 1e-6);
      const out: number[] = [];
      for (let i = 0; i < all.length - 1; i++) {
        const a = all[i], b = all[i + 1];
        const segNSub = Math.max(1, Math.round((b - a) / ((xMax - xMin) / nSub)));
        for (let k = 0; k < segNSub; k++) out.push(a + ((b - a) * k) / segNSub);
      }
      out.push(all[all.length - 1]);
      return out;
    }
    const xs1 = buildGridX(0, Lz1, [xC1], nSubX);
    const ys1 = buildGridX(0, Bz1, [yC1, yViga], nSubY);
    const xs2 = buildGridX(Lz1 + Lv, Lz1 + Lv + Lz2, [xC2], nSubX);
    const ys2 = buildGridX(yOff2, yOff2 + Bz2, [yC2, yViga], nSubY);

    const N: [number, number, number][] = [];
    const elsEl: number[][] = [];
    const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
    const loads = new Map<number, [number, number, number, number, number, number]>();
    const elasticities = new Map<number, number>();
    const poissons = new Map<number, number>();
    const areas = new Map<number, number>();
    const thicknesses = new Map<number, number>();
    const Iz = new Map<number, number>();
    const Iy = new Map<number, number>();
    const J = new Map<number, number>();
    const Gm = new Map<number, number>();
    const densities = new Map<number, number>();
    const sections = new Map<number, any>();

    const nodeMap = new Map<string, number>();
    const addNode = (x: number, y: number, z: number): number => {
      const k = `${x.toFixed(4)},${y.toFixed(4)},${z.toFixed(4)}`;
      if (nodeMap.has(k)) return nodeMap.get(k)!;
      const idx = N.length;
      N.push([x, y, z]);
      nodeMap.set(k, idx);
      return idx;
    };

    // Shell zapata 1
    const idx1: number[][] = [];
    for (let j = 0; j < ys1.length; j++) {
      const row: number[] = [];
      for (let i = 0; i < xs1.length; i++) row.push(addNode(xs1[i], ys1[j], 0));
      idx1.push(row);
    }
    for (let j = 0; j < ys1.length - 1; j++)
      for (let i = 0; i < xs1.length - 1; i++) {
        const e = elsEl.length;
        elsEl.push([idx1[j][i], idx1[j][i + 1], idx1[j + 1][i + 1], idx1[j + 1][i]]);
        thicknesses.set(e, tz); elasticities.set(e, Ec); poissons.set(e, nu_c); densities.set(e, rho);
      }
    // Shell zapata 2
    const idx2: number[][] = [];
    for (let j = 0; j < ys2.length; j++) {
      const row: number[] = [];
      for (let i = 0; i < xs2.length; i++) row.push(addNode(xs2[i], ys2[j], 0));
      idx2.push(row);
    }
    for (let j = 0; j < ys2.length - 1; j++)
      for (let i = 0; i < xs2.length - 1; i++) {
        const e = elsEl.length;
        elsEl.push([idx2[j][i], idx2[j][i + 1], idx2[j + 1][i + 1], idx2[j + 1][i]]);
        thicknesses.set(e, tz); elasticities.set(e, Ec); poissons.set(e, nu_c); densities.set(e, rho);
      }

    // Pedestales + viga de amarre — convención SAFE col-a-col.
    //
    // PEDESTALES (frame vertical):  conectan el shell de la zapata con el
    //   tope donde aterriza la columna. Cargas P+M se aplican en el TOPE.
    //
    // VIGA DE AMARRE (tie beam):  va al NIVEL DEL SLAB (z=0) conectando
    //   las DOS COLUMNAS (xCol1, yCol1) → (xCol2, yCol2). Atraviesa
    //   longitudinalmente ambas zapatas. Esta es la convención SAFE
    //   habitual: en el modelo SAFE el beam atraviesa los slabs y comparte
    //   los joints de columna.
    //
    // Topología correcta:
    //   nCol*_Bot (z=0, shell de zapata) ─[pedestal frame bc×bc]─ nCol*_Top (z=Hp)
    //                                                              ↑ aquí P+M
    //   nCol1Bot ──────[viga frame Bv×Hv, len = xCol2-xCol1]──────── nCol2Bot
    //
    // La transferencia de momento Col1→Col2 va: Col1 P+M → pedestal →
    // nCol1Bot → viga frame directa → nCol2Bot → pedestal → Col2.
    // Los rigid links de la columna al shell distribuyen carga al slab.
    // SIN PEDESTAL (como SAFE, Fig.163): la carga de columna va DIRECTO sobre el slab,
    // en la huella stiff (z=0). El pedestal elevado dispersaba la excentricidad y aplanaba
    // el pico de la medianera. La rigidez de la columna queda dada por los rigid-links
    // (la zona stiff de 0.5m), igual que el "Stiff Footing" de SAFE.
    const nCol1Bot = addNode(xC1, yC1, 0);
    const nCol2Bot = addNode(xC2, yC2, 0);
    // Viga de amarre — DE COLUMNA A COLUMNA, SUBDIVIDIDA por nodos del slab.
    //
    // Topología: la viga atraviesa Z1 (de x=0 a x=Lz1), salta el gap entre
    // zapatas (de x=Lz1 a x=Lz1+Lv), y atraviesa Z2 (de x=Lz1+Lv a
    // x=Lz1+Lv+Lz2). En cada zapata la viga COMPARTE NODOS con el slab a
    // lo largo de su path en y=yC1. Esto hace que la viga "engaje" todo
    // el slab, no solo los nodos de columna — sin esto la zapata se inclina
    // y "flota" porque el frame solo tira de los 2 endpoints.
    //
    // Implementación: para cada x del mesh shell (xs1, xs2) a y=yC1,
    // creamos un segmento de viga consecutivo. addNode reusa los nodos
    // existentes del slab.
    // CLIP COLUMNA-A-COLUMNA (como el libro Guerra y el f2k nativo de SAFE):
    // la viga va SOLO de xCol1 a xCol2. NO se extiende a los bordes exteriores
    // de las zapatas — más allá de la columna no hay viga física. En Z2 la
    // columna está al CENTRO → la viga termina en el centro, no en el borde
    // derecho (antes sobraba Lz2/2 de "viga fantasma"). El f2k nativo Ejm6
    // tiene la viga 0→5.94 (col-a-col). El slab sigue compartiendo nodos en el
    // tramo entre columnas + rigid-links bajo cada columna → no "flota".
    const vigaPathNodes: number[] = [];
    for (const x of xs1) if (x >= xC1 - 1e-6) vigaPathNodes.push(addNode(x, yC1, 0));
    for (const x of xs2) if (x <= xC2 + 1e-6) vigaPathNodes.push(addNode(x, yC2, 0));
    let nVigaSegments = 0;
    for (let i = 0; i < vigaPathNodes.length - 1; i++) {
      const a = vigaPathNodes[i], b = vigaPathNodes[i + 1];
      if (a === b) continue;  // dedup
      const eViga = elsEl.length;
      elsEl.push([a, b]);
      elasticities.set(eViga, Ec); poissons.set(eViga, nu_c); Gm.set(eViga, Gc);
      areas.set(eViga, Bv * Hv);
      // BUG-FIX (vuelco): la viga es HORIZONTAL (a lo largo de x) → local_z=global Z (vertical),
      // local_y=global Y (horizontal). En la K del frame, Iy gobierna la flexión VERTICAL (x-z)
      // y Iz la horizontal (x-y). El canto Hv=0.95 debe resistir el vuelco → ese inercia (Bv·Hv³/12)
      // va en Iy, NO en Iz. Antes estaba al revés → la viga aguantaba el vuelco con el eje débil
      // (ancho³) → la zapata medianera basculaba ~2× de más vs SAFE. Validado nodo-a-nodo.
      Iy.set(eViga, (Bv * Hv ** 3) / 12);   // FUERTE (canto³) → flexión vertical = restringe vuelco
      Iz.set(eViga, (Hv * Bv ** 3) / 12);   // débil (ancho³) → flexión horizontal
      J.set(eViga, 0.28 * Bv * Hv ** 3);
      densities.set(eViga, rho);
      sections.set(eViga, { type: "rect", b: Bv, h: Hv });
      nVigaSegments++;
    }
    console.log(`[viga amarre] ${nVigaSegments} segmentos col-a-col compartiendo nodos con slab`);

    // ── Rigid links zone (SAFE "Stiff Slab") ──
    // Per libro Guerra Fig.180: la columna NO se conecta a UN solo nodo del
    // shell, sino a una ZONA ~0.5×0.5m del slab (monolítica concreta entre
    // columna y zapata). Modelado con frames rígidos (E×1000) desde el
    // nCol*Bot a shell nodes dentro de ±STIFF/2. La viga col-a-col se ancla
    // a nCol1Bot/nCol2Bot, así que estos rigid links también transmiten la
    // carga de la viga al slab de cada zapata.
    const STIFF_SIZE = 0.50;
    const E_RIG  = Ec * 1000;
    const G_RIG  = Gc * 1000;
    const A_RIG  = bc * bc * 100;
    const I_RIG  = (bc ** 4 / 12) * 100;
    const J_RIG  = 0.14 * bc ** 4 * 100;
    function addRigidLinks(masterNode: number, masterX: number, masterY: number,
                            xs: number[], ys: number[], idx: number[][]): number {
      let added = 0;
      for (let j = 0; j < ys.length; j++) {
        for (let i = 0; i < xs.length; i++) {
          const x = xs[i], y = ys[j];
          if (Math.abs(x - masterX) > STIFF_SIZE / 2 + 1e-6) continue;
          if (Math.abs(y - masterY) > STIFF_SIZE / 2 + 1e-6) continue;
          const slave = idx[j][i];
          if (slave === masterNode) continue;
          const e = elsEl.length;
          elsEl.push([masterNode, slave]);
          elasticities.set(e, E_RIG); poissons.set(e, nu_c); Gm.set(e, G_RIG);
          areas.set(e, A_RIG); Iz.set(e, I_RIG); Iy.set(e, I_RIG);
          J.set(e, J_RIG); densities.set(e, 0);   // densidad 0 → sin peso propio
          sections.set(e, { type: "rect", b: bc, h: bc });
          added++;
        }
      }
      return added;
    }
    const nLinks1 = addRigidLinks(nCol1Bot, xC1, yC1, xs1, ys1, idx1);
    const nLinks2 = addRigidLinks(nCol2Bot, xC2, yC2, xs2, ys2, idx2);
    console.log(`[Rigid links] Col1:${nLinks1} Col2:${nLinks2}  (viga col-a-col directa nCol1Bot↔nCol2Bot)`);

    loads.set(nCol1Bot, [0, 0, -P1, M1x, M1y, 0]);
    loads.set(nCol2Bot, [0, 0, -P2, M2x, M2y, 0]);

    // ── Winkler SSI completo: resortes en X, Y, Z en cada nodo ──
    // kh = ks_horizontal ≈ 0.5 × ks_vertical (fricción suelo-zapata tipo Bowles).
    const dxAvg1 = Lz1 / nSubX, dyAvg1 = Bz1 / nSubY;
    const dxAvg2 = Lz2 / nSubX, dyAvg2 = Bz2 / nSubY;
    const kh_factor = 0.5;
    const springsList: Array<{ node: number; dof: number; k: number }> = [];
    const zapataSpringNodes: number[] = [];
    for (let j = 0; j < ys1.length; j++)
      for (let i = 0; i < xs1.length; i++) {
        const A_trib = dxAvg1 * dyAvg1 *
          ((i === 0 || i === xs1.length - 1) ? 0.5 : 1) *
          ((j === 0 || j === ys1.length - 1) ? 0.5 : 1);
        const kvz = ks * A_trib;
        const khxy = ks * A_trib * kh_factor;
        springsList.push({ node: idx1[j][i], dof: 0, k: khxy });
        springsList.push({ node: idx1[j][i], dof: 1, k: khxy });
        springsList.push({ node: idx1[j][i], dof: 2, k: kvz });
        zapataSpringNodes.push(idx1[j][i]);
      }
    for (let j = 0; j < ys2.length; j++)
      for (let i = 0; i < xs2.length; i++) {
        const A_trib = dxAvg2 * dyAvg2 *
          ((i === 0 || i === xs2.length - 1) ? 0.5 : 1) *
          ((j === 0 || j === ys2.length - 1) ? 0.5 : 1);
        const kvz = ks * A_trib;
        const khxy = ks * A_trib * kh_factor;
        springsList.push({ node: idx2[j][i], dof: 0, k: khxy });
        springsList.push({ node: idx2[j][i], dof: 1, k: khxy });
        springsList.push({ node: idx2[j][i], dof: 2, k: kvz });
        zapataSpringNodes.push(idx2[j][i]);
      }
    // Rotacionales suaves para anti-singularidad
    const kRot = ks * dxAvg1 * dyAvg1 * 1e-4;
    springsList.push({ node: idx1[0][0], dof: 3, k: kRot });
    springsList.push({ node: idx1[0][0], dof: 4, k: kRot });
    springsList.push({ node: idx1[0][0], dof: 5, k: kRot });

    // Commit
    states.nodes.val = N.map((n) => [n[0], n[1], n[2]] as Node);
    states.elements.val = elsEl;

    // Los RESORTES tambien van en nodeInputs, no solo a `deform()`:
    // `modalCpp` los busca ahi (`springs ?? nodeInputs.springs`) y sin ellos
    // el modal corre con la zapata FLOTANDO en el aire. Se veia en las
    // frecuencias: 1.6e-5 Hz el primer modo -solido rigido- y 1.9e+10 el
    // segundo, que ya es basura numerica. El estatico si los recibia, asi que
    // el modelo parecia bueno hasta que se pedia el modal.
    states.nodeInputs.val = { supports, loads, springs: springsList } as any;
    // Elemento: Mindlin-Reissner (shellQ4, default). El Mindlin de Hekatan ya matchea σ_max de SAFE (24.1 vs 24.18, 0.4%). El DKQ thin
    // (sin cortante) sobre-rigidiza la zapata gruesa (h/L=0.23) → descartado.
    states.elementInputs.val = {
      elasticities, poissonsRatios: poissons,
      areas, momentsOfInertiaY: Iz, momentsOfInertiaZ: Iy,
      torsionalConstants: J, shearModuli: Gm,
      thicknesses, densities, sectionShapes: sections,
    };
    try {
      states.deformOutputs.val = deform(
        states.nodes.val, states.elements.val,
        states.nodeInputs.val, states.elementInputs.val,
        springsList
      );
      const ao = analyze(
        states.nodes.val, states.elements.val,
        states.elementInputs.val, states.deformOutputs.val
      );
      // ── Presión de contacto Winkler: q = ks × w (kN/m²), por elemento shell ──
      // CONVENCIÓN libro Guerra / SAFE / Calcpad: compresión = NEGATIVA.
      // Match con zapata-aislada.ts línea 718: q = ks * w (sin negar).
      // Cuando w < 0 (suelo se hunde), q < 0 (compresión).
      const deformsMap = states.deformOutputs.rawVal.deformations;
      const pressureMap = new Map<number, number[]>();
      let qMin_kN = 0;   // mínimo (más negativo) = pico de compresión
      let qMax_kN = 0;   // máximo (menos negativo) = bordes
      states.elements.rawVal.forEach((el, eIdx) => {
        if (el.length !== 4) return;            // solo shells Q4
        const qPerNode: number[] = [];
        for (const n of el) {
          const d = deformsMap?.get(n);
          const w = d ? d[2] : 0;
          const q_kN = ks * w;                  // kN/m², compresión NEGATIVA
          qPerNode.push(q_kN);
          if (q_kN < qMin_kN) qMin_kN = q_kN;
          if (q_kN > qMax_kN) qMax_kN = q_kN;
        }
        pressureMap.set(eIdx, qPerNode);
      });
      (ao as any).pressure = pressureMap;  // 👈 slot dedicado "pressure" en shellResults

      // Fijar rango de colormap al rango libro Fig.180 (≈ -12 a -26 t/m² compresión).
      // Si el usuario está en libro Ej.6 Guerra (P1≈110t, P2≈140t, ks=37461), los σ
      // resultantes deben caer en ese rango → colormap muestra full jet_r spectrum.
      // Auto-extiende si los datos exceden esos límites.
      const TONF_TO_KN = 9.80665;
      const vCyan = Math.min(-12 * TONF_TO_KN, qMax_kN);   // mín compresión (≈ -12) → AZUL
      const vRed  = Math.max(-26 * TONF_TO_KN, qMin_kN);   // máx compresión (≈ -26) → MAGENTA/ROJO
      // Orden [vRed, vCyan] (más-negativo primero) → SAFE: máx compresión = magenta (t=0),
      // mín = azul (t=1). Antes estaba [vCyan, vRed] → quedaba invertido (mín=magenta).
      (ao as any).colorMapRanges = { pressure: [vRed, vCyan] };

      states.analyzeOutputs.val = ao;
    } catch (e) {
      console.error("Solver error:", e);
    }

    // ── Resortes 3D helicoidales (igual estilo que zapata-aislada) ──
    // Usan hélice paramétrica + anclaje cúbico + reactive toggle con deformedShape.
    const deforms = states.deformOutputs.rawVal.deformations;
    let wMaxAbs = 1e-9;
    for (const nIdx of zapataSpringNodes) {
      const d = deforms?.get(nIdx);
      if (d && Number.isFinite(d[2])) wMaxAbs = Math.max(wMaxAbs, Math.abs(d[2]));
    }
    // Diagonal del modelo (zapata + viga + zapata)
    const Ltot = Lz1 + Lv + Lz2;
    const Btot = Math.max(Bz1, Bz2);
    const diag = Math.sqrt(Ltot ** 2 + Btot ** 2 + Hp ** 2);
    const VISUAL_AMP = (0.07 * diag) / wMaxAbs;

    // Muestra TODOS los nodos donde hay un resorte k Winkler (sin samplear) —
    // así los springs visibles coinciden exactamente con donde la física los aplica.
    const visibleSet = new Set<number>(zapataSpringNodes);

    const HELIX_SEGMENTS_PER_COIL = 12;
    const totalSegs = SPRING_COILS * HELIX_SEGMENTS_PER_COIL;

    const viewerEl = document.querySelector("#viewer") as any;
    const settings = viewerEl?.__settings;

    const buildSprings = (deformedOn: boolean, deformScaleSetting: number, dispScale: number = 1): THREE.Object3D[] => {
      // ampEff = el MISMO scale que usa el viewer (settings.deformScale)
      const ampEff = deformedOn ? deformScaleSetting : 0;
      const maxSinkingEff = wMaxAbs * Math.max(ampEff, 1);
      const zBotEff = -(maxSinkingEff + SPRING_HEIGHT);
      // displayScale: escala el RADIO del coil y el TAMAÑO del anchor (igual
      // que las flechas de loads/supports). dispScale puede ser negativo.
      const visScale = dispScale > 0 ? dispScale : (dispScale < 0 ? -1 / dispScale : 1);
      const SPRING_WIDTH_EFF = SPRING_WIDTH * visScale;
      const ANCHOR_SIZE_EFF  = ANCHOR_SIZE  * visScale;
      const out: THREE.Object3D[] = [];
      for (const nIdx of zapataSpringNodes) {
        if (!visibleSet.has(nIdx)) continue;
        const node = states.nodes.rawVal[nIdx];
        if (!node) continue;
        const x = node[0], y = node[1];
        const d = deforms?.get(nIdx);
        const safe = (v: number) => Number.isFinite(v) ? v : 0;
        const dx_real = d ? safe(d[0]) : 0;
        const dy_real = d ? safe(d[1]) : 0;
        const dz_real = d ? safe(d[2]) : 0;
        // Punta del resorte sigue al nodo en las 3 direcciones; base anclada al suelo
        const xTop = x + dx_real * ampEff;
        const yTop = y + dy_real * ampEff;
        const zTop = 0 + dz_real * ampEff;
        const zLen = zTop - zBotEff;
        const axisAt = (t: number): [number, number, number] => [
          x + (xTop - x) * t,
          y + (yTop - y) * t,
          zBotEff + zLen * t,
        ];
        const [axB0x, axB0y, axB0z] = axisAt(0);
        const [axB1x, axB1y, axB1z] = axisAt(0.05);
        const pts: THREE.Vector3[] = [
          new THREE.Vector3(axB0x, axB0y, axB0z),
          new THREE.Vector3(axB1x, axB1y, axB1z),
        ];
        for (let k = 0; k <= totalSegs; k++) {
          const t = 0.05 + 0.9 * (k / totalSegs);
          const [cx, cy, cz] = axisAt(t);
          const angle = 2 * Math.PI * SPRING_COILS * (k / totalSegs);
          pts.push(new THREE.Vector3(
            cx + SPRING_WIDTH_EFF * Math.cos(angle),
            cy + SPRING_WIDTH_EFF * Math.sin(angle),
            cz
          ));
        }
        pts.push(new THREE.Vector3(xTop, yTop, zTop));
        out.push(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), MAT_SPRING));
        // Anclaje simple: cuadrado horizontal plano (sin replicación visual en elevación)
        const a = ANCHOR_SIZE_EFF;
        const cv = [
          new THREE.Vector3(x - a, y - a, zBotEff),
          new THREE.Vector3(x + a, y - a, zBotEff),
          new THREE.Vector3(x + a, y + a, zBotEff),
          new THREE.Vector3(x - a, y + a, zBotEff),
          new THREE.Vector3(x - a, y - a, zBotEff),
        ];
        out.push(new THREE.Line(new THREE.BufferGeometry().setFromPoints(cv), MAT_GROUND));
      }
      return out;
    };

    const myVersion = activeExampleVersion.v;
    if (settings) {
      van.derive(() => {
        // ── BUGFIX zombie derive: guard ANTES de leer `.val` (ver
        // zapataAisladaValidacion.ts para explicación completa). ──
        if (activeExampleVersion.v !== myVersion) return;
        const on = settings.deformedShape.val;
        const dScale = settings.deformScale.val;
        const dispScale = settings.displayScale.val;
        states.objects3D.val = buildSprings(on, dScale, dispScale);
      });
    } else {
      states.objects3D.val = buildSprings(true, 1, 1);
    }
  },
  runModal(p, states, modalPanel) {
    const nodes = states.nodes.val;
    const elements = states.elements.val;
    const ni = states.nodeInputs.val;
    const ei = states.elementInputs.val;
    if (!nodes.length || !elements.length || !ei.densities?.size) return;
    try {
      const out = modalAnalysis(nodes, elements, ni, ei, 12);
      modalPanel.render(out, {
        title: `Zapata + Viga amarre Lv=${p.Lv}m`,
        properties: [`E=25 GPa  ν=0.2  ρ=24 kN/m³  Viga ${p.Bv}×${p.Hv}m`],
      });
      console.log(`[Zapata+Viga Modal] f₁=${out.frequencies[0]?.toFixed(4)} Hz`);
    } catch (e: any) { console.warn("Modal zapata-viga error:", e.message); }
  },
  // Exporta el modelo "tal como se ve": 2 zapatas + viga de amarre en UN solo
  // F2K SAFE. Reusa downloadEdificioCimentacionF2k (mismo exporter que usan
  // los edificios con cimentación) pero leyendo la geometría directamente
  // desde los params del ejemplo, NO desde reacciones de superestructura.
  // Aplicado vía herencia spread a Guerra Ej.6 (mismo modelo, otros defaults).
  async exportF2k(p) {
    const { downloadEdificioCimentacionF2k } = await import("../shared/f2kCimentacionCompleta");
    const TONF_TO_KN = 9.80665;
    const Lz1 = p.Lz1, Bz1 = p.Bz1, Lv = p.Lv, Bv = p.Bv, Hv = p.Hv;
    const Lz2 = p.Lz2, Bz2 = p.Bz2, tz = p.tz, bc = p.bc;
    const ks = p.ks;  // ya en kN/m³
    // Mismas coordenadas que en build(): Col Z1 MEDIANERA (xCol1 = bc/2 →
    // cara izq de columna FLUSH con borde izq de Z1, como Guerra Fig.179).
    // Col Z2 en el centro de Z2. El offset Y de Z2 alinea la viga horizontal.
    const yOff2 = (Bz1 - Bz2) / 2;
    const xCol1 = bc / 2,                 yCol1 = Bz1 / 2;
    const xCol2 = Lz1 + Lv + Lz2 / 2,     yCol2 = Bz2 / 2 + yOff2;
    // Centros físicos de cada rectángulo de zapata (xC, yC del API F2K).
    const xC_Z1 = Lz1 / 2,                yC_Z1 = Bz1 / 2;
    const xC_Z2 = Lz1 + Lv + Lz2 / 2,     yC_Z2 = yOff2 + Bz2 / 2;
    // Gating Dead/Live según toggles del usuario (default ambos ON)
    const fD = (p.useDead ?? 1) >= 0.5 ? 1 : 0;
    const fL = (p.useLive ?? 1) >= 0.5 ? 1 : 0;
    const zapatas = [
      {
        xC: xC_Z1, yC: yC_Z1, xCol: xCol1, yCol: yCol1,
        Lz: Lz1, Bz: Bz1, tz, bc,
        P_dead_kN: fD * (p.P1 ?? 0) * TONF_TO_KN,
        Mx_dead_kNm: fD * (p.M1x ?? 0) * TONF_TO_KN,
        My_dead_kNm: fD * (p.M1y ?? 0) * TONF_TO_KN,
        P_live_kN: fL * (p.P1_L ?? 0) * TONF_TO_KN,
        Mx_live_kNm: fL * (p.M1x_L ?? 0) * TONF_TO_KN,
        My_live_kNm: fL * (p.M1y_L ?? 0) * TONF_TO_KN,
        label: 1,
      },
      {
        xC: xC_Z2, yC: yC_Z2, xCol: xCol2, yCol: yCol2,
        Lz: Lz2, Bz: Bz2, tz, bc,
        P_dead_kN: fD * (p.P2 ?? 0) * TONF_TO_KN,
        Mx_dead_kNm: fD * (p.M2x ?? 0) * TONF_TO_KN,
        My_dead_kNm: fD * (p.M2y ?? 0) * TONF_TO_KN,
        P_live_kN: fL * (p.P2_L ?? 0) * TONF_TO_KN,
        Mx_live_kNm: fL * (p.M2x_L ?? 0) * TONF_TO_KN,
        My_live_kNm: fL * (p.M2y_L ?? 0) * TONF_TO_KN,
        label: 2,
      },
    ];
    // Viga de amarre: de COLUMNA a COLUMNA (convención SAFE habitual).
    // Conecta el centro de la columna sobre Z1 con el centro de la columna
    // sobre Z2 — atraviesa las zapatas longitudinalmente. El exporter
    // f2kCimentacionCompleta reusa el joint de la columna en cada extremo
    // (findOrCreateJoint) para compartir DOFs entre slab + frame en SAFE.
    const vigasAmarre = [{
      x1: xCol1, y1: yCol1,
      x2: xCol2, y2: yCol2,
      h: Hv, b: Bv, z: 0,
    }];
    try {
      downloadEdificioCimentacionF2k(
        // E_concreto_MPa = Ec del ejemplo (kN/m² → MPa). Para Guerra Ej.6 (f'c=210)
        // Ec=20.04e6 kN/m² → 20040 MPa, así el f2k exportado lleva el E del libro
        // (antes el exporter usaba su default 24855 MPa ≈ f'c 4000psi → E equivocado).
        { zapatas, vigasAmarre, ks_kNm3: ks, Z: 0, E_concreto_MPa: Ec / 1000 },
        `ZapataVigaAmarre_Hekatan_${Date.now()}.f2k`,
      );
      const P1tot = (p.P1 ?? 0) + (p.P1_L ?? 0);
      const P2tot = (p.P2 ?? 0) + (p.P2_L ?? 0);
      const Pu1 = 1.4 * (p.P1 ?? 0) + 1.7 * (p.P1_L ?? 0);
      const Pu2 = 1.4 * (p.P2 ?? 0) + 1.7 * (p.P2_L ?? 0);
      alert(
        `✅ F2K exportado con 2 zapatas + viga de amarre:\n\n` +
        `• Z1 ${Lz1}×${Bz1} m — PD=${p.P1} + PL=${p.P1_L ?? 0} = ${P1tot} tonf | Pu=${Pu1.toFixed(1)} tonf\n` +
        `• Z2 ${Lz2}×${Bz2} m — PD=${p.P2} + PL=${p.P2_L ?? 0} = ${P2tot} tonf | Pu=${Pu2.toFixed(1)} tonf\n` +
        `• Viga amarre ${Bv}×${Hv} m, Lv=${Lv} m\n` +
        `• ks = ${ks.toFixed(0)} kN/m³\n\n` +
        `Patrones de carga incluidos: Dead (+peso propio), Live\n` +
        `Combinación: Pu = 1.4D + 1.7L (ACI 318 nominal Guerra MDI)\n\n` +
        `Abrilo en SAFE 20.x: File → Import → SAFE Text File (.f2k)`,
      );
      console.log(`[F2K Zapata+Viga] exportado: Z1=${Lz1}×${Bz1}, Z2=${Lz2}×${Bz2}, ks=${ks} kN/m³`);
    } catch (e: any) {
      alert(`❌ Error exportando F2K: ${e.message}`);
      console.error(e);
    }
  },
};
