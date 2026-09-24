/**
 * =============================================================================
 *  Materiales estándar para ingeniería estructural
 * =============================================================================
 *
 *  Encapsula Hormigón, Acero y CFT (Concrete Filled Tube) con sus propiedades
 *  relevantes para FEM: E, ν, ρ, fy/f'c. También provee las formas de sección
 *  típicas (Rectangular / Circular / W / HSS / CFT) con cálculo de A, Iy, Iz, J.
 *
 *  Usado por los ejemplos de edificios y columnas individuales.
 * =============================================================================
 */

// ════════════════════════════════════════════════════════════════════════
//  LAS CONSTANTES Y LAS DOS FORMULAS DEL HORMIGON — un solo sitio
// ════════════════════════════════════════════════════════════════════════
//
// Hasta el 18-sep-2026 la formula del modulo del hormigon estaba COPIADA en 20
// ficheros, en DOS versiones que no dan lo mismo, y este fichero —que ya la
// tenia— no lo importaba nadie. Con f'c = 210 kg/cm² salian tres valores:
//
//     21 458 891 kN/m²   15100·√f'c  [kg/cm²]   (NEC-SE-HM / Ecuador)
//     21 328 888 kN/m²   4700·√f'c   [MPa]      (ACI 318)
//     21 460 000 kN/m²   redondeo del csiImporter
//
// Dispersion: 0.61 %. **No es el error de nadie: son dos normas.** 15100 en
// kg/cm² equivale a 4733 en MPa, y ACI redondea a 4700. Por eso aqui NO se
// elige una a escondidas: se dan las dos con su nombre y sus unidades, y cada
// ejemplo declara cual usa. Lo que no puede volver a pasar es que un mismo
// modelo mezcle las dos sin que se vea.
//
// ⏳ Queda por decidir (es de Jorge, no del codigo): unificar TODO en la NEC,
//    que es la norma del pais. Cuesta 0.61 % en E, 0.61 % en flechas y 0.31 %
//    en periodos, y mueve referencias ya validadas contra CSI.

/** La gravedad. UNA. Antes convivian 9.81 y 9.80665 en los tres exportadores
 *  (`e2kExporter:140` 9.81 · `:345` 9.80665 · `s2kExporter:751` 9.81 ·
 *  `f2kExporter:111` 9.80665): el MISMO modelo pesaba distinto en el .s2k y en
 *  el .f2k. Es el valor normal estandar, el que usa CSI. */
export const GRAVEDAD = 9.80665;   // m/s²

/** Peso especifico del hormigon armado [kN/m³]. Es un PESO. */
export const PESO_HORMIGON_kNm3 = 24;

/** Densidad de MASA del hormigon armado [t/m³] = peso / g.
 *
 *  ⚠️ `ElementInputs.densities` y el `rho` del `.heks` son MASA (t/m³), no
 *  peso. Meter 24 ahi es meter la masa multiplicada por g: **×9.81**. Paso de
 *  verdad entre dos ejemplos de la MISMA zapata (`zapata-aislada` usa `24/g` y
 *  `zapata-aislada-validacion` usa `24`). */
export const MASA_HORMIGON_t_m3 = PESO_HORMIGON_kNm3 / GRAVEDAD;   // 2.44733

/** 1 kg/cm² en kN/m². */
export const KGCM2_A_KNM2 = 98.0665;

/**
 * Modulo elastico del hormigon segun **NEC-SE-HM / Ecuador**:
 *     E_c = 15100·√f'c   con f'c en kg/cm², resultado en kg/cm²
 * Devuelto en kN/m².
 */
export function ecHormigonNEC(fc_kgcm2: number): number {
  return 15100 * Math.sqrt(fc_kgcm2) * KGCM2_A_KNM2;
}

/**
 * Modulo elastico del hormigon segun **ACI 318**:
 *     E_c = 4700·√f'c   con f'c en MPa, resultado en MPa
 * Devuelto en kN/m². Da un 0.61 % menos que `ecHormigonNEC` (ver la nota de
 * arriba): no es un bug, es la otra norma.
 */
export function ecHormigonACI(fc_MPa: number): number {
  return 4700 * Math.sqrt(fc_MPa) * 1000;
}

export type MaterialType = "concrete" | "steel" | "cft";
export type SectionShape = "rect" | "circ" | "W" | "HSS" | "cft-rect" | "cft-circ";

/** Opciones numéricas para dropdown en Tweakpane (clave = label visible) */
export const MATERIAL_OPTIONS = {
  "Hormigón": 0,
  "Acero": 1,
  "CFT (mixto)": 2,
};

export const SHAPE_OPTIONS_CONCRETE = {
  "Rectangular": 0,
  "Circular": 1,
};
export const SHAPE_OPTIONS_STEEL = {
  "W (Wide Flange)": 0,
  "HSS (Hollow)": 1,
  "Tubular paramétrico": 2,
};
export const SHAPE_OPTIONS_CFT = {
  "CFT Rectangular": 0,
  "CFT Circular": 1,
};

export function materialTypeFromIdx(idx: number): MaterialType {
  return idx < 1 ? "concrete" : idx < 2 ? "steel" : "cft";
}

// ── Propiedades mecánicas ─────────────────────────────────────────

export interface MechanicalProps {
  /** Modulo elástico [kN/m²] */
  E: number;
  /** Poisson */
  nu: number;
  /** Densidad de peso [kN/m³] — ya multiplicado por g, para carga gravitacional directa */
  gamma: number;
}

/**
 * Hormigón según ACI 318 / NEC-SE-HM:
 *   E_c = 15100 √f'c  [kg/cm²]  (fórmula Ecuador/Colombia)
 *      = 4700 √f'c    [MPa]     (ACI 318, equivalente)
 *   Acá recibimos f'c en kg/cm² y retornamos E en kN/m².
 */
export function concreteProps(fc_kgcm2: number): MechanicalProps {
  // E_c en kg/cm² → kN/m² : 1 kg/cm² = 98.0665 kN/m²
  return { E: ecHormigonNEC(fc_kgcm2), nu: 0.20, gamma: PESO_HORMIGON_kNm3 };
}

/** Acero ASTM A992 / A36 / A572 Gr.50 — propiedades elásticas idénticas */
export function steelProps(): MechanicalProps {
  return { E: 200_000_000, nu: 0.30, gamma: 77 };  // E = 200 GPa, γ = 77 kN/m³
}

/**
 * CFT (Concrete-Filled Tube): propiedades equivalentes ponderadas por área.
 * Para análisis lineal simple usamos promedio ponderado de E con fracción de
 * áreas; densidad equivalente también ponderada.
 */
export function cftProps(fc_kgcm2: number, area_concrete: number, area_steel: number): MechanicalProps {
  const c = concreteProps(fc_kgcm2);
  const s = steelProps();
  const A_total = area_concrete + area_steel;
  const E_eq = (c.E * area_concrete + s.E * area_steel) / A_total;
  const gamma_eq = (c.gamma * area_concrete + s.gamma * area_steel) / A_total;
  // Poisson ponderado (aproximación)
  const nu_eq = (c.nu * area_concrete + s.nu * area_steel) / A_total;
  return { E: E_eq, nu: nu_eq, gamma: gamma_eq };
}

// ── Propiedades geométricas por forma ─────────────────────────────

export interface SectionGeometry {
  A: number;    // área transversal [m²]
  Iy: number;   // momento de inercia eje Y local [m⁴]
  Iz: number;   // momento de inercia eje Z local [m⁴]
  J: number;    // constante torsional St Venant [m⁴]
  /** Descripción legible para log */
  desc: string;
}

/** Rectangular b × h (eje fuerte = Z local, coincide con AISC Iz) */
export function rectSection(b: number, h: number): SectionGeometry {
  const A = b * h;
  const Iz = b * h * h * h / 12;     // flexión en el plano de h
  const Iy = h * b * b * b / 12;
  // J aproximado para rectángulo (Timoshenko & Goodier):
  //   J = β·b³·h con β función de h/b. Usamos aproximación β ≈ (1/3)·(1 - 0.63·(b/h))
  //   para h >= b. Si b > h, invertir.
  const a = Math.max(b, h), c = Math.min(b, h);
  const beta = (1 / 3) * (1 - 0.63 * (c / a) * (1 - (Math.pow(c, 4) / (12 * Math.pow(a, 4)))));
  const J = beta * c * c * c * a;
  return { A, Iy, Iz, J, desc: `Rect ${(b*1000).toFixed(0)}×${(h*1000).toFixed(0)}mm` };
}

/** Circular de diámetro D */
export function circSection(D: number): SectionGeometry {
  const R = D / 2;
  const A = Math.PI * R * R;
  const I = Math.PI * Math.pow(R, 4) / 4;
  return { A, Iy: I, Iz: I, J: 2 * I, desc: `Circ Ø${(D*1000).toFixed(0)}mm` };
}

/** CFT Circular: tubo de acero exterior de diámetro D_out, espesor t, relleno concreto */
export function cftCircSection(D_out: number, t: number): SectionGeometry {
  const D_in = D_out - 2 * t;
  const R_out = D_out / 2, R_in = D_in / 2;
  const A_total = Math.PI * R_out * R_out;
  const I_total = Math.PI * (Math.pow(R_out, 4)) / 4;   // I homogéneo transformado asumido
  return { A: A_total, Iy: I_total, Iz: I_total, J: 2 * I_total, desc: `CFT-Circ Ø${(D_out*1000).toFixed(0)}/t${(t*1000).toFixed(0)}mm` };
}

/** CFT Rectangular: tubo acero exterior B×H, espesor t, relleno concreto */
export function cftRectSection(B: number, H: number, t: number): SectionGeometry {
  const A_total = B * H;
  const Iz = B * H * H * H / 12;
  const Iy = H * B * B * B / 12;
  const J = (B * H * H * H + H * B * B * B) / 12 * 0.15;  // aproximación tubo cerrado
  return { A: A_total, Iy, Iz, J, desc: `CFT-Rect ${(B*1000).toFixed(0)}×${(H*1000).toFixed(0)}/t${(t*1000).toFixed(0)}mm` };
}

/**
 * Helper completo: dado {material, forma, dims} retorna todas las propiedades
 * mecánicas + geométricas en un solo objeto, listo para pasar al solver.
 */
export interface FullSection {
  mat: MechanicalProps;
  geom: SectionGeometry;
  material: MaterialType;
  shape: SectionShape;
}

export function buildSection(
  matIdx: number,       // 0=concrete, 1=steel, 2=cft
  shapeIdx: number,     // depende del material (ver SHAPE_OPTIONS_*)
  dims: { b?: number; h?: number; D?: number; t?: number; fc?: number },
): FullSection {
  const material = materialTypeFromIdx(matIdx);
  let geom: SectionGeometry;
  let shape: SectionShape;
  let mat: MechanicalProps;

  if (material === "concrete") {
    mat = concreteProps(dims.fc ?? 210);
    if (shapeIdx < 1) {
      shape = "rect"; geom = rectSection(dims.b ?? 0.40, dims.h ?? 0.40);
    } else {
      shape = "circ"; geom = circSection(dims.D ?? 0.40);
    }
  } else if (material === "steel") {
    mat = steelProps();
    if (shapeIdx < 1) { shape = "W"; geom = rectSection(dims.b ?? 0.20, dims.h ?? 0.30); /* placeholder — usar lookupAISC para geom real */ }
    else if (shapeIdx < 2) { shape = "HSS"; geom = cftRectSection(dims.b ?? 0.30, dims.h ?? 0.30, dims.t ?? 0.01); }
    else { shape = "HSS"; geom = rectSection(dims.b ?? 0.20, dims.h ?? 0.30); }
  } else {
    // CFT
    if (shapeIdx < 1) {
      shape = "cft-rect"; geom = cftRectSection(dims.b ?? 0.40, dims.h ?? 0.40, dims.t ?? 0.01);
      const t = dims.t ?? 0.01;
      const B = dims.b ?? 0.40, H = dims.h ?? 0.40;
      const A_steel = 2 * (B + H) * t - 4 * t * t;    // cruz aproximada
      const A_concrete = geom.A - A_steel;
      mat = cftProps(dims.fc ?? 210, A_concrete, A_steel);
    } else {
      shape = "cft-circ"; geom = cftCircSection(dims.D ?? 0.40, dims.t ?? 0.01);
      const D = dims.D ?? 0.40;
      const R_out = D / 2, R_in = R_out - (dims.t ?? 0.01);
      const A_steel = Math.PI * (R_out * R_out - R_in * R_in);
      const A_concrete = geom.A - A_steel;
      mat = cftProps(dims.fc ?? 210, A_concrete, A_steel);
    }
  }

  return { mat, geom, material, shape };
}
