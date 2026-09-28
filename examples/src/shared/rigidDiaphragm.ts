/**
 * =============================================================================
 *  Diafragma Rígido (Rigid Diaphragm) — implementación por Master-Slave MPCs
 * =============================================================================
 *
 *  En análisis sísmico de edificios, ASCE/SEI 7-22 §12.3.1 y NEC-SE-DS
 *  permiten asumir que la losa de cada piso actúa como DIAFRAGMA RÍGIDO:
 *  todos los nodos del piso se mueven como cuerpo rígido en el plano X-Y,
 *  reduciendo los DOFs laterales del piso a solo 3 (Ux_m, Uy_m, Rz_m) en un
 *  NODO MAESTRO (centroide del piso).
 *
 *  Ecuaciones de restricción (rigid body motion en X-Y):
 *    Ux_i = Ux_m - (y_i - y_m) · Rz_m
 *    Uy_i = Uy_m + (x_i - x_m) · Rz_m
 *    Rz_i = Rz_m            (rotación vertical slaved)
 *
 *  Uz_i, Rx_i, Ry_i quedan LIBRES (cada nodo se puede mover verticalmente y
 *  rotar fuera-del-plano independientemente — solo se restringe el in-plane).
 *
 *  Implementación: método de PENALIZACIÓN. Para cada slave i y su master m,
 *  se agrega un resorte lineal de rigidez muy alta (k_p ≈ 1e10 × k_max_diag)
 *  entre el DOF slave y la expresión master del slave.
 *
 *  hekatan-fem soporta springs nodales vía `deform(..., springsList)` — pero
 *  solo self-stiffness (K[gdof,gdof] += k). Para MPC necesitamos coupling
 *  entre DOFs, lo cual requiere extender deform.cpp OR usar un approach
 *  alternativo: AGREGAR EL MASTER COMO NODO + RIGID LINKS (diagonales
 *  enormemente rígidas). Para una primera implementación, usamos la
 *  alternativa más simple:
 *
 *    RIGID FRAME LINKS: conectar cada slave al master con un elemento frame
 *    de rigidez EA ≫ suma de pórticos. El link rígido transmite los 3 DOFs
 *    (Ux, Uy, Rz) en el plano pero deja Uz/Rx/Ry con rigidez normal (limitada
 *    por el propio frame). No es 100% matemáticamente puro pero cumple la
 *    intención y funciona con la infraestructura existente.
 *
 *  TODO: cuando se extienda deform.cpp con MPCs nativos (constraint equations),
 *  migrar a implementación pura penalty method. Ver roadmap item "Diafragma
 *  rígido nativo C++".
 * =============================================================================
 */
import type { Node, Element } from "hekatan-fem";

export interface DiaphragmResult {
  /** Nodos agregados (un master por piso) al final del array `nodes` */
  masterNodes: Array<{ idx: number; z: number; x: number; y: number }>;
  /** Elementos frame rígidos agregados (links master → slaves) */
  rigidLinks: Element[];
  /** Rigideces a aplicar a cada rigid link (A, Iy, Iz, J, E) */
  linkProps: {
    areas: Map<number, number>;
    momentsOfInertiaY: Map<number, number>;
    momentsOfInertiaZ: Map<number, number>;
    torsionalConstants: Map<number, number>;
    elasticities: Map<number, number>;
    shearModuli: Map<number, number>;
    densities: Map<number, number>;
  };
}

export interface AddRigidDiaphragmsOptions {
  /**
   * Altura mínima del piso. Nodos con z < 1e-6 (base) NO se consideran para
   * diafragma (están en supports). Nodos con z ≈ z_k se agrupan al mismo piso.
   */
  tol?: number;
  /** Rigidez del link (Young · Area). Default: 1e12 (muy rígido) */
  linkStiffness?: number;
}

/**
 * Agrega un master node por cada piso (a la altura del piso, centrado en XY)
 * y conecta cada nodo slave con el master vía un elemento frame de rigidez
 * muy alta. Retorna la información para que el ejemplo la mergee con nodes,
 * elements, elementInputs.
 *
 * Uso típico en el build() de un edificio:
 *
 *   const dia = addRigidDiaphragms(nodes, zCoords.slice(1));  // sin piso 0
 *   nodes.push(...dia.masterNodes.map(m => [m.x, m.y, m.z] as Node));
 *   elements.push(...dia.rigidLinks);
 *   // merge linkProps en elementInputs
 */
export function addRigidDiaphragms(
  nodes: Node[],
  floorZs: number[],
  opts: AddRigidDiaphragmsOptions = {},
): DiaphragmResult {
  const tol = opts.tol ?? 1e-5;
  const nextElemIdx = 0;  // el caller sumará su offset
  const masterNodes: DiaphragmResult["masterNodes"] = [];
  const rigidLinks: Element[] = [];
  const linkProps: DiaphragmResult["linkProps"] = {
    areas: new Map(),
    momentsOfInertiaY: new Map(),
    momentsOfInertiaZ: new Map(),
    torsionalConstants: new Map(),
    elasticities: new Map(),
    shearModuli: new Map(),
    densities: new Map(),
  };

  // Propiedades del link: muy rígido pero no infinito (evita mal condicionamiento)
  // Young · Area ≈ 1e12 kN. Para hormigón E ~ 2.5e7 kN/m² → A ≈ 4e4 m² (irreal, pero OK
  // para análisis lineal porque el link solo aporta rigidez, no masa ni peso).
  const E_link = 1e8;   // kN/m² (100 GPa, acero-plus)
  const A_link = 1e4;   // m² (muy alto)
  const I_link = 1e4;   // m⁴
  const J_link = 2 * I_link;
  const G_link = E_link / (2 * (1 + 0.30));

  for (const z of floorZs) {
    // Encontrar slaves de este piso
    const slaves: number[] = [];
    let xsum = 0, ysum = 0;
    for (let i = 0; i < nodes.length; i++) {
      if (Math.abs(nodes[i][2] - z) < tol) {
        slaves.push(i);
        xsum += nodes[i][0];
        ysum += nodes[i][1];
      }
    }
    if (slaves.length < 2) continue;   // sin diafragma si < 2 nodos

    const xm = xsum / slaves.length;
    const ym = ysum / slaves.length;
    const masterIdx = nodes.length + masterNodes.length;   // aún sin push a nodes[]
    masterNodes.push({ idx: masterIdx, z, x: xm, y: ym });

    // Link: master → cada slave (frame element con alta rigidez)
    //
    // ⚠️ Menos el slave que CAE ENCIMA del master. El master va al centroide
    // del piso, y en una planta simetrica con un numero par de vanos hay un
    // nudo justo ahi: el link salia de longitud CERO, que no es un elemento —
    // no tiene direccion y su matriz es nula. `edificio-muros` (6 pisos, uno
    // por piso) moria por eso, y el mensaje culpaba a unos offsets que no
    // existian. Ese nudo no queda suelto: lo sujetan sus propias vigas, y ES
    // el centro del diafragma, o sea el punto que no se mueve respecto al
    // master.
    for (const s of slaves) {
      const dx = nodes[s][0] - xm, dy = nodes[s][1] - ym;
      if (Math.hypot(dx, dy) < tol) {
        console.info(`[diafragma] z = ${z}: el nudo ${s} cae sobre el master ` +
          `(${xm.toFixed(3)}, ${ym.toFixed(3)}): sin link, un elemento de ` +
          `longitud cero no ata nada.`);
        continue;
      }
      rigidLinks.push([masterIdx, s]);
      const eIdx = nextElemIdx + rigidLinks.length - 1;   // caller ajusta con offset real
      linkProps.areas.set(eIdx, A_link);
      linkProps.momentsOfInertiaY.set(eIdx, I_link);
      linkProps.momentsOfInertiaZ.set(eIdx, I_link);
      linkProps.torsionalConstants.set(eIdx, J_link);
      linkProps.elasticities.set(eIdx, E_link);
      linkProps.shearModuli.set(eIdx, G_link);
      linkProps.densities.set(eIdx, 0);   // sin masa — el link es ficticio
    }
  }

  // Suppress unused
  void opts.linkStiffness;

  return { masterNodes, rigidLinks, linkProps };
}

/**
 * Helper para mergear el resultado con los elementInputs del ejemplo.
 * El parámetro `baseOffset` es el nuevo índice de elemento inicial para
 * los rigid links (length actual de `elements` antes del push).
 */
export function mergeDiaphragmProps(
  diaphragm: DiaphragmResult,
  elementInputs: any,
  baseOffset: number,
): void {
  const remap = (src: Map<number, number>, dst: Map<number, number>) => {
    src.forEach((v, k) => dst.set(k + baseOffset, v));
  };
  elementInputs.areas              = elementInputs.areas              ?? new Map();
  elementInputs.momentsOfInertiaY  = elementInputs.momentsOfInertiaY  ?? new Map();
  elementInputs.momentsOfInertiaZ  = elementInputs.momentsOfInertiaZ  ?? new Map();
  elementInputs.torsionalConstants = elementInputs.torsionalConstants ?? new Map();
  elementInputs.elasticities       = elementInputs.elasticities       ?? new Map();
  elementInputs.shearModuli        = elementInputs.shearModuli        ?? new Map();
  elementInputs.densities          = elementInputs.densities          ?? new Map();
  remap(diaphragm.linkProps.areas,              elementInputs.areas);
  remap(diaphragm.linkProps.momentsOfInertiaY,  elementInputs.momentsOfInertiaY);
  remap(diaphragm.linkProps.momentsOfInertiaZ,  elementInputs.momentsOfInertiaZ);
  remap(diaphragm.linkProps.torsionalConstants, elementInputs.torsionalConstants);
  remap(diaphragm.linkProps.elasticities,       elementInputs.elasticities);
  remap(diaphragm.linkProps.shearModuli,        elementInputs.shearModuli);
  remap(diaphragm.linkProps.densities,          elementInputs.densities);
}
