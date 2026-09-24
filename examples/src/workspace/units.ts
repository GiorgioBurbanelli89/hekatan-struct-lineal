/**
 * Sistema de unidades global para el workspace Tweakpane.
 *
 * CONVENCIÓN INTERNA: Todos los cálculos y la API de hekatan-fem usan
 * SI estructural: fuerza en kN, momento en kN·m, longitud/desplazamiento
 * en metros. Lo que el usuario ve y ajusta en los sliders se convierte
 * on-the-fly a/desde estas unidades base.
 *
 * Cuando un ParamDef declara `unitType: "force"` (o "moment", "disp"):
 *   - `currentParams[key]` almacena el valor en la unidad SI base.
 *   - El slider de Tweakpane muestra/recibe el valor en la unidad UI elegida.
 *   - Al cambiar forceUnit/dispUnit, los sliders se reescalan (las mismas
 *     fuerzas físicas, expresadas en la nueva unidad).
 */
import van, { State } from "vanjs-core";

export type ForceUnit = "kN" | "tonf" | "kip";
// ⚠️ El PIE tiene que estar aqui. El preset «U.S. Imperial» ponia
// `lengthStructure: "ft" as DispUnit` —un cast, o sea callar al compilador— y
// `dispFactors` no lo tenia: cualquier cuenta con esa longitud daba **NaN**. No
// se veia porque el momento estaba en una tabla a mano; en cuanto se deriva de
// fuerza x longitud, como hace CSI, sale.
export type DispUnit = "mm" | "cm" | "m" | "in" | "ft";

// Defaults: tonf y mm (preferencia del usuario para cimentaciones/concreto).
// Se persisten en localStorage; al cambiar via Tweakpane se actualizan.
export const forceUnit: State<ForceUnit> = van.state(
  (localStorage.getItem("hk_forceUnit") as ForceUnit) || "tonf"
);
export const dispUnit: State<DispUnit> = van.state(
  (localStorage.getItem("hk_dispUnit") as DispUnit) || "mm"
);

// Persistir preferencias + exponer en window para que hover.ts pueda leerlo
// sin crear dependencia circular hekatan-ui ← examples
van.derive(() => {
  localStorage.setItem("hk_forceUnit", forceUnit.val);
  (window as any).__hekatanForceUnit = forceUnit.val;
});
van.derive(() => {
  localStorage.setItem("hk_dispUnit", dispUnit.val);
  (window as any).__hekatanDispUnit = dispUnit.val;
});

// ── Conversión de FUERZA ──────────────────────────────────────────
// SI base: kN
export const forceFactors: Record<ForceUnit, number> = {
  kN: 1,
  tonf: 9.80665,       // 1 tonf (metric) = 9.80665 kN
  kip: 4.4482216,      // 1 kip = 4.4482216 kN
};

/** Convierte valor UI → kN */
export function toKn(valUI: number, unit?: ForceUnit): number {
  return valUI * forceFactors[unit ?? forceUnit.val];
}
/** Convierte kN → valor UI */
export function fromKn(valKn: number, unit?: ForceUnit): number {
  return valKn / forceFactors[unit ?? forceUnit.val];
}

// ── Conversión de MOMENTO ─────────────────────────────────────────
//
// ⚠️ EN CSI EL MOMENTO NO ES UNA UNIDAD APARTE: es FUERZA × LONGITUD del
// sistema. Sus sistemas se llaman literalmente `<Fuerza>, <Longitud>, <Temp>`
// —`Kip, in, F` · `Kip, ft, F` · `KN, m, C` · `N, mm, C`— y el momento sale de
// los dos primeros (los `eUnits` de la OAPI: `kip_in_F`, `kN_m_C`, `N_mm_C`...).
//
// Antes esto era una tabla a mano: `kip → 1.3558179` (kip·ft) pasara lo que
// pasara con la longitud. Coincide con ETABS mientras el usuario no toque la
// longitud, y deja de coincidir en cuanto la cambia — `Kip, in, F` da kip·in,
// que es DOCE veces distinto. Ahora se deriva, que es lo unico que garantiza
// que la conversion siga siendo la de ETABS, SAP2000 y SAFE en cualquier
// combinacion.
//
// La longitud que manda es `lengthStructureUnit` (la del modelo), no
// `dispUnit`: `dispUnit` es solo la de las FLECHAS, y en CSI un sistema tiene
// una sola longitud.

/** Metros que vale 1 unidad de la longitud del sistema. */
export function metrosDeLongitud(u?: DispUnit): number {
  return 1 / dispFactors[u ?? lengthStructureUnit.val];
}

/** kN·m que vale 1 unidad de momento del sistema actual (F x L). */
export function factorMomento(f?: ForceUnit, l?: DispUnit): number {
  return forceFactors[f ?? forceUnit.val] * metrosDeLongitud(l);
}

export function toKnm(valUI: number, unit?: ForceUnit): number {
  return valUI * factorMomento(unit);
}
export function fromKnm(valKnm: number, unit?: ForceUnit): number {
  return valKnm / factorMomento(unit);
}

// ── Conversión de DESPLAZAMIENTO ──────────────────────────────────
// SI base: m. Unidades estándar para ingeniería estructural:
//   mm (más común para flechas), cm, m (modelos grandes), in (imperial).
export const dispFactors: Record<DispUnit, number> = {
  mm: 1000,          // 1 m = 1000 mm
  cm: 100,           // 1 m = 100 cm
  m: 1,              // 1 m = 1 m (base)
  in: 39.3700787402, // 1 in = 0.0254 m exacto
  ft: 3.280839895,   // 1 ft = 0.3048 m exacto
};

/** Convierte m → unidad UI */
export function mToDisp(valM: number, unit?: DispUnit): number {
  return valM * dispFactors[unit ?? dispUnit.val];
}
/** Convierte unidad UI → m */
export function dispToM(valUI: number, unit?: DispUnit): number {
  return valUI / dispFactors[unit ?? dispUnit.val];
}

export function formatDisp(valM: number, digits = 2): string {
  const u = dispUnit.val;
  return `${mToDisp(valM, u).toFixed(digits)} ${u}`;
}

export function formatForce(valKn: number, digits = 2): string {
  const u = forceUnit.val;
  return `${fromKn(valKn, u).toFixed(digits)} ${u}`;
}
export function formatMoment(valKnm: number, digits = 2): string {
  return `${fromKnm(valKnm).toFixed(digits)} ${etiquetaMomento()}`;
}

/** «tonf·m», «kip·in»… — la del SISTEMA, fuerza × longitud, como en CSI. */
export function etiquetaMomento(): string {
  return `${forceUnit.val}·${lengthStructureUnit.val}`;
}

/** El nombre CSI del sistema actual: «Tonf, m, C», «Kip, in, F»… */
export function sistemaCSI(): string {
  const f = { kN: "KN", tonf: "Tonf", kip: "Kip" }[forceUnit.val];
  const t = forceUnit.val === "kip" ? "F" : "C";
  return `${f}, ${lengthStructureUnit.val}, ${t}`;
}
export function formatStress(valKnPm2: number, digits = 2): string {
  const u = stressUnit.val;
  return `${fromKnPm2(valKnPm2, u).toFixed(digits)} ${u}`;
}

// ── Helpers para SECCIONES ──────────────────────────────────────────
// Auto-detección: hormigón → cm, acero/CFT → mm
export function formatSectionDim(valM: number, materialOrShape?: string): string {
  const isConcrete = !!materialOrShape && /concrete|hormig|rect.*sólida/i.test(materialOrShape);
  const factor = isConcrete ? 100 : 1000;
  const unit = isConcrete ? "cm" : "mm";
  const x = valM * factor;
  // Entero si es muy cercano, sino 1 decimal
  const txt = Math.abs(x - Math.round(x)) < 0.05 ? `${Math.round(x)}` : `${x.toFixed(1)}`;
  return `${txt} ${unit}`;
}

// ── Helpers UI: label con sufijo de unidad dinámico ───────────────
/** Sufijo de unidad actual: "(kN)", "(tonf)", "(kip)" */
export function forceUnitSuffix(): string {
  return `(${forceUnit.val})`;
}
/** Sufijo momento actual: "(kN·m)", "(tonf·m)", "(kip·ft)" */
export function momentUnitSuffix(): string {
  return `(${etiquetaMomento()})`;
}
/** Sufijo desplazamiento actual */
export function dispUnitSuffix(): string {
  return `(${dispUnit.val})`;
}

/**
 * Remueve cualquier sufijo "(kN)", "(tonf)", "(kip)", "(kN·m)", etc. de un
 * label para luego re-anexar el sufijo correcto según la unidad actual.
 * Útil para actualizar dinámicamente los labels cuando el usuario switchea
 * la unidad desde el folder "Unidades".
 */
export function stripUnitSuffix(label: string): string {
  return label
    .replace(/\s*\((kN|tonf|kip)(·m|·ft)?\)\s*$/i, "")
    .replace(/\s*\((mm|cm|m|in|ft|µm|um)\)\s*$/i, "")
    .trim();
}

// ============================================================================
// EXTENSION SAFE-style: unidades granulares por categoría + presets
// ============================================================================
// Modelo basado en SAFE Display Units form. Cada categoría almacena su unit
// de display independiente. Internamente todo sigue siendo SI base (kN, m).
//
// Para cambiar todo coherentemente: applyConsistentUnits("Metric MKS").
// Para cambiar individual: stressUnit.val = "MPa", etc.
// ============================================================================

export type StressUnit = "kN/m²" | "kPa" | "MPa" | "GPa" | "kgf/cm²" | "tonf/m²" | "psi" | "ksi" | "kip/ft²";
export type SubgradeUnit = "kN/m³" | "tonf/m³" | "kgf/cm³" | "kip/ft³" | "pci";
export type StiffTransUnit = "kN/m" | "tonf/m" | "kip/in" | "kip/ft" | "N/mm";
export type LengthSectionUnit = "mm" | "cm" | "m" | "in" | "ft";

const G = 9.80665; // gravedad / conversión tonf↔kN

// ── Stress (Force/Area). SI base: kN/m² = kPa ──
export const stressFactors: Record<StressUnit, number> = {
  "kN/m²":   1,
  "kPa":     1,
  "MPa":     1 / 1000,
  "GPa":     1 / 1e6,
  "kgf/cm²": 1 / 98.0665,
  "tonf/m²": 1 / G,
  "psi":     1 / 6.89476,
  "ksi":     1 / 6894.76,
  "kip/ft²": 1 / 47.88026,
};
export const stressUnit: State<StressUnit> = van.state(
  (localStorage.getItem("hk_stressUnit") as StressUnit) || "tonf/m²"
);
van.derive(() => {
  localStorage.setItem("hk_stressUnit", stressUnit.val);
  (window as any).__hekatanStressUnit = stressUnit.val;
});

/** kN/m² → unidad UI */
export function fromKnPm2(valKnPm2: number, u?: StressUnit): number {
  return valKnPm2 * stressFactors[u ?? stressUnit.val];
}

// ── Subgrade modulus (Force/Length³). SI base: kN/m³ ──
export const subgradeFactors: Record<SubgradeUnit, number> = {
  "kN/m³":   1,
  "tonf/m³": 1 / G,
  "kgf/cm³": 1 / 9806.65,
  "kip/ft³": 1 / 157.0875,
  "pci":     1 / 271.4471,        // pound per cubic inch
};
export const subgradeUnit: State<SubgradeUnit> = van.state(
  (localStorage.getItem("hk_subgradeUnit") as SubgradeUnit) || "tonf/m³"
);
van.derive(() => { localStorage.setItem("hk_subgradeUnit", subgradeUnit.val); });
export function fromKnPm3(val: number, u?: SubgradeUnit): number {
  return val * subgradeFactors[u ?? subgradeUnit.val];
}

// ── Stiffness translational (Force/Length). SI base: kN/m ──
export const stiffTransFactors: Record<StiffTransUnit, number> = {
  "kN/m":  1,
  "tonf/m": 1 / G,
  "kip/in": 1 / 175.1268,
  "kip/ft": 1 / 14.5939,
  "N/mm":  1,                     // 1 kN/m = 1 N/mm
};
export const stiffTransUnit: State<StiffTransUnit> = van.state(
  (localStorage.getItem("hk_stiffTransUnit") as StiffTransUnit) || "tonf/m"
);
van.derive(() => { localStorage.setItem("hk_stiffTransUnit", stiffTransUnit.val); });

// ── Section length (mm/cm para sección, distinto al lengthStructure m). ──
export const sectionLengthFactors: Record<LengthSectionUnit, number> = {
  mm: 1000, cm: 100, m: 1, in: 39.3700787402, ft: 3.2808399,
};
export const lengthSectionUnit: State<LengthSectionUnit> = van.state(
  (localStorage.getItem("hk_lengthSectionUnit") as LengthSectionUnit) || "mm"
);
van.derive(() => { localStorage.setItem("hk_lengthSectionUnit", lengthSectionUnit.val); });

// ── Length structure (m/ft para Lz, Bz, Hp). ──
// Reuso DispUnit type pero conceptualmente puede ser m o ft.
export const lengthStructureUnit: State<DispUnit> = van.state(
  (localStorage.getItem("hk_lengthStructureUnit") as DispUnit) || "m"
);
van.derive(() => { localStorage.setItem("hk_lengthStructureUnit", lengthStructureUnit.val); });

// ============================================================================
// PRESETS "Consistent Units" — un click setea todo
// ============================================================================

export type UnitsPresetName = "Metric MKS" | "Metric SI" | "U.S. Imperial" | "Custom";

export interface UnitsPreset {
  force: ForceUnit;
  disp: DispUnit;
  stress: StressUnit;
  subgrade: SubgradeUnit;
  stiffTrans: StiffTransUnit;
  lengthSection: LengthSectionUnit;
  lengthStructure: DispUnit;
}

export const UNITS_PRESETS: Record<Exclude<UnitsPresetName, "Custom">, UnitsPreset> = {
  // Sudamérica/concreto/zapatas — el default actual
  "Metric MKS": {
    force: "tonf",   disp: "mm",   stress: "kgf/cm²", subgrade: "tonf/m³",
    stiffTrans: "tonf/m", lengthSection: "cm", lengthStructure: "m",
  },
  // Académico/ACI/Eurocódigo
  "Metric SI": {
    force: "kN",     disp: "mm",   stress: "MPa",     subgrade: "kN/m³",
    stiffTrans: "kN/m",  lengthSection: "mm", lengthStructure: "m",
  },
  // Imperial U.S. (AISC, ACI 318 imperial)
  "U.S. Imperial": {
    force: "kip",    disp: "in",   stress: "ksi",     subgrade: "kip/ft³",
    stiffTrans: "kip/in", lengthSection: "in", lengthStructure: "ft",
  },
};

/**
 * Aplica un preset coherente. Setea las 7 unidades de display de un golpe.
 * Útil al inicio del workspace o cuando el usuario quiere "todo SI" o
 * "todo Imperial" sin configurar item por item.
 */
export function applyConsistentUnits(name: Exclude<UnitsPresetName, "Custom">) {
  const p = UNITS_PRESETS[name];
  forceUnit.val = p.force;
  dispUnit.val = p.disp;
  stressUnit.val = p.stress;
  subgradeUnit.val = p.subgrade;
  stiffTransUnit.val = p.stiffTrans;
  lengthSectionUnit.val = p.lengthSection;
  lengthStructureUnit.val = p.lengthStructure;
  localStorage.setItem("hk_unitsPreset", name);
  // Exponer en window para que hover.ts y otros lo lean (sin import cíclico)
  (window as any).__hekatanForceUnit  = forceUnit.val;
  (window as any).__hekatanDispUnit   = dispUnit.val;
  (window as any).__hekatanStressUnit = stressUnit.val;
}

// ── Aplicar preset DEFAULT al iniciar el workspace (primera visita) ──
// Si no hay preset persistido, usa "Metric MKS" (tonf, mm, kgf/cm² para Sudamérica/concreto).
// Esto garantiza que TODOS los ejemplos arrancan con unidades consistentes.
(() => {
  const savedPreset = localStorage.getItem("hk_unitsPreset");
  if (!savedPreset) {
    applyConsistentUnits("Metric MKS");
  } else if (savedPreset !== "Custom" && savedPreset in UNITS_PRESETS) {
    // Re-aplicar el preset guardado (asegura que window globals estén seteados)
    applyConsistentUnits(savedPreset as Exclude<UnitsPresetName, "Custom">);
  } else {
    // Custom: solo asegurar que window globals estén actualizados
    (window as any).__hekatanForceUnit  = forceUnit.val;
    (window as any).__hekatanDispUnit   = dispUnit.val;
    (window as any).__hekatanStressUnit = stressUnit.val;
  }
})();

/**
 * Detecta cuál preset corresponde a la combinación actual de units, o
 * "Custom" si no matchea ninguno.
 */
export function detectCurrentPreset(): UnitsPresetName {
  for (const [name, p] of Object.entries(UNITS_PRESETS)) {
    if (
      p.force === forceUnit.val && p.disp === dispUnit.val &&
      p.stress === stressUnit.val && p.subgrade === subgradeUnit.val &&
      p.stiffTrans === stiffTransUnit.val &&
      p.lengthSection === lengthSectionUnit.val &&
      p.lengthStructure === lengthStructureUnit.val
    ) return name as UnitsPresetName;
  }
  return "Custom";
}

