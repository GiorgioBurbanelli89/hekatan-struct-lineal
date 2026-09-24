/**
 * Exportador GENERICO a `.f2k` (SAFE 20) desde el modelo de Hekatan: nudos,
 * barras (las verticales tambien como BEAM: ver abajo), cascaras (losa Thin/Thick),
 * apoyos, MUELLES NODALES (Winkler) y cargas nodales. El mismo modelo que sale
 * a `.e2k` (ETABS) y `.s2k` (SAP2000): asi una cimentacion se compara con los
 * TRES programas de CSI desde el mismo `.heks` (Jorge, 5-sep-2026).
 *
 * De donde sale la gramatica (NO inventada):
 *   · Tablas con nombres largos (`"Total Thickness"=`, `"Is Auto Point"=`…): del
 *     `.f2k` de la cimentacion de 9 zapatas que SAFE ya importo y resolvio
 *     (`edificio-aporticado/sample_output/cimentacion_edificio_9zapatas_12vigas.f2k`).
 *   · Tablas nuevas (muelles de punto, apoyos, seccion General, punto de
 *     insercion, offsets): NOMBRES de campo leidos de la propia API de SAFE 20.3
 *     con `DatabaseTables.GetAllFieldsInTable` (sonda del 5-sep-2026). Ojo: el
 *     .f2k quiere el NOMBRE ("Stiffness UZ", "Rigid Factor"), no la CLAVE
 *     (StiffUZ, RigidFact). Con la clave SAFE no protesta y deja su defecto:
 *     los 9 muelles entraron a 200 kN/m en vez de 27..108 y la flecha salio
 *     un 40-60 % corta. Medido, no supuesto.
 *       Spring Property Definitions - Point Springs: Name "Stiffness UX".."Stiffness RZ" "Nonlinear Option"
 *       Joint Assignments - Springs:                UniqueName SpringProp
 *       Joint Assignments - Restraints:             UniqueName UX UY UZ RX RY RZ
 *       Frame Section Property Definitions - General: Name Material Depth Width Area As2 As3 I33 I22 I23 … J … "Section Type"
 *       Frame Assignments - Insertion Point:        UniqueName "Cardinal Point" Mirror2 Mirror3 "No Transform Stiffness"
 *       Frame Assignments - End Length Offsets:     UniqueName "Offset Option" "Offset I" "Offset J" "Rigid Factor"
 *
 * Como se mete en SAFE: `cFile.OpenFile(.f2k)` devuelve 0 y deja el modelo VACIO;
 * hay que importarlo por tablas (`csi-cli/safe-cli/cli/csi_cli.py --engine safe
 * --open modelo.f2k`). Unidades: kN y m, y el importador lee `CurrUnits` para
 * poner SAFE en esas unidades antes de aplicar las tablas.
 *
 * Lo que NO lleva (dicho): muelles de linea/area (el `.heks` los trae nodales),
 * `ang` de barra, modificadores de cascara, offsets. Peso propio: el patron Dead
 * va con multiplicador 0 y el peso llega como carga nodal consistente, igual que
 * en el `.s2k` con `selfWtMult: 0`.
 */
import type { Node, Element, NodeInputs, ElementInputs } from "../../../hekatan-fem/src/data-model";
import { muellesParaExportar } from "./muellesParaExportar";

export interface F2kExportInput {
  nodes: Node[];
  elements: Element[];
  nodeInputs: NodeInputs;
  elementInputs: ElementInputs;
  title?: string;
  /** Nombre del patron de carga (SAFE trae "Dead" de serie). */
  loadPattern?: string;
  /**
   * Factor que multiplica la J de las barras al escribirla. Defecto **10**.
   *
   * SAFE 20 analiza las barras con **0.1·J**: medido el 5-sep-2026 con dos zapatas,
   * pedestales y una viga de amarre cargada a torsion (`mini m3`): SAFE da en el tope
   * Rx = 1.568e-2 y 1.678e-3 rad; Hekatan con la J de la viga ×0.1 da 1.5675e-2 y
   * 1.678e-3 — los mismos cuatro digitos. Con J×3, ×9 y ×27 la curva es la de
   * Hekatan con 0.3J, 0.9J, 2.7J. No hay tabla ni preferencia que lo cambie
   * (buscado en las 200 tablas de su API): es la semantica de SAFE para una viga de
   * losa. Escribiendo 10·J, SAFE analiza la J de Hekatan. Con 1 se manda J tal cual y
   * SAFE calcula OTRA estructura (la suya: viga con el 10 % de torsion).
   */
  jFactor?: number;
  /** TODOS los patrones del .heks (Dead, DNE, Live...) con sus casos, combinaciones, cargas de barra
   *  repartidas, peso propio calculado por SAFE (multiplicador = `selfweight`), muelle de AREA con su
   *  «Compression Only», losa tipo Mat/Footing y pedestal Stiff con sus modificadores (18-sep-2026).
   *  Sin la opcion, lo de antes (un patron, todo ya sumado en los nudos, muelles puntuales). */
  patrones?: boolean;
  /** Version de SAFE destino (nombres de campo distintos): 20 -> "Subgrade Modulus" y "Footing";
   *  22 -> "Stiffnes U3"/"Nonlinear Option for U3" y "Mat". Defecto 22. */
  versionSafe?: 20 | 22;
}

function fmt(v: number): string {
  if (!isFinite(v) || Math.abs(v) < 1e-15) return "0";
  if (Math.abs(v) >= 1e7 || Math.abs(v) < 1e-4) return v.toExponential(8);
  return parseFloat(v.toPrecision(10)).toString();
}

export function exportF2k(input: F2kExportInput): string {
  const { nodes, elements, nodeInputs, elementInputs } = input;
  const LP = input.loadPattern ?? "Dead";
  const PAT = !!input.patrones && !!(nodeInputs as any).cargasPorPatron;
  const V20 = input.versionSafe === 20;
  const areaExp = PAT ? ((elementInputs as any).areaSpringsExport as Map<number, { ks: number; nodal: boolean; comp: boolean }> | undefined) : undefined;
  const JF = input.jFactor ?? 10;
  const L: string[] = [];
  const push = (s: string) => L.push(s);
  const tabla = (nombre: string) => { push(`TABLE:  "${nombre}"`); };
  const fin = () => push(" ");
  const yn = (b: boolean) => (b ? "Yes" : "No");

  push(`File "${input.title ?? "Hekatan"}.f2k" exportado desde Hekatan Struct Lineal`);
  push(`File contains the same model that goes to .e2k (ETABS) and .s2k (SAP2000): nodes, frames, shells, restraints, point springs, joint loads.`);
  fin();

  tabla("PROGRAM CONTROL");
  push(`   ProgramName=SAFE   Version=${PAT && !V20 ? "22.6.0" : "20.3.0"}   ProgLevel="Post Tensioning"   CurrUnits="kN, m, C"   CompBmCode="AISC 360-16"   ConcFrmCode="ACI 318-19"   ConcSlbCode="ACI 318-19"`);
  fin();

  // ── Materiales: uno por (E, nu), como en el .s2k ──
  const matDe = (i: number) => {
    const E = elementInputs.elasticities?.get(i) || 0;
    const nuDecl = elementInputs.poissonsRatios?.get(i);
    const Gdecl = elementInputs.shearModuli?.get(i) || 0;
    const nu = nuDecl !== undefined ? nuDecl
             : (E > 0 && Gdecl > 0 ? Math.max(0, Math.min(0.5, E / (2 * Gdecl) - 1)) : 0.2);
    const G = Gdecl > 0 ? Gdecl : (E > 0 ? E / (2 * (1 + nu)) : 0);
    const rho = elementInputs.densities?.get(i) || 0;   // t/m3
    // con `patrones` el peso lo calcula SAFE: la densidad entra en la clave (pedestal con peso 0 != losa)
    return { E, nu, G, rho, key: `MAT_${Math.round(E)}_n${nu.toFixed(4)}${PAT ? `_r${rho.toFixed(4)}` : ""}` };
  };
  const frameIdx: number[] = [], shellIdx: number[] = [];
  elements.forEach((el, i) => { if (el.length === 2) frameIdx.push(i); else if (el.length === 3 || el.length === 4) shellIdx.push(i); });
  const mats = new Map<string, { E: number; nu: number; G: number; rho: number }>();
  for (const i of [...frameIdx, ...shellIdx]) { const m = matDe(i); if (!mats.has(m.key)) mats.set(m.key, m); }
  if (mats.size === 0) mats.set("MAT_DEFAULT", { E: 25e6, nu: 0.2, G: 25e6 / 2.4, rho: 2.4 });

  // El material de ARMADURA hay que definirlo aqui: al importar la tabla de materiales SAFE se
  // queda solo con los del fichero, y una seccion de hormigon sin "Longitudinal Rebar Material"
  // valido se rechaza entera (las barras se quedan con la seccion por defecto de SAFE, sin aviso).
  // Valores del A615 Gr60 de serie de SAFE en kN y m (60 ksi = 413 685 kN/m2).
  tabla("MATERIAL PROPERTIES - GENERAL");
  for (const [k] of mats) push(`   Material=${k}   Type=Concrete   SymType=Isotropic   Grade="Hekatan"   Color=Gray8Dark`);
  push(`   Material=A615Gr60   Type=Rebar   SymType=Uniaxial   Grade="Grade 60"   Color=Green`);
  fin();
  tabla("MATERIAL PROPERTIES - BASIC MECHANICAL PROPERTIES");
  for (const [k, m] of mats) push(`   Material=${k}   DensityType=Weight   UnitWeight=${fmt(m.rho * 9.80665)}   UnitMass=${fmt(m.rho)}   E1=${fmt(m.E)}   G12=${fmt(m.G)}   U12=${fmt(m.nu)}   A1=1E-05`);
  push(`   Material=A615Gr60   DensityType=Weight   UnitWeight=76.9729   UnitMass=7.849047   E1=199947978.8   A1=1.17E-05`);
  fin();
  tabla("MATERIAL PROPERTIES - REBAR DATA");
  push(`   Material=A615Gr60   Fy=413685.5   Fu=620528.2   Fye=455054   Fue=682581   SSCurveOpt=Simple   SSHysType=Kinematic   SHard=0.01   SCap=0.09   FinalSlope=-0.1`);
  fin();
  // SAFE exige los datos de hormigon para un material Type=Concrete; f'c no entra en el analisis lineal.
  tabla("MATERIAL PROPERTIES - CONCRETE DATA");
  for (const [k] of mats) push(`   Material=${k}   Fc=${fmt((elementInputs as any).fcExport ?? 27579.03)}   LtWtConc=No   IsUserFr=No   SSCurveOpt=Mander   SSHysType=Concrete   SFc=0.002219   SCap=0.005   FinalSlope=-0.1   FAngle=0   DAngle=0`);
  fin();

  // ── Secciones de barra: General (A, I33=Iz, I22=Iy, J, As2, As3), como el .s2k ──
  const frameSecs = new Map<string, { A: number; Iz: number; Iy: number; J: number; b: number; h: number; matKey: string; As2: number; As3: number }>();
  const elemToFrameSec = new Map<number, string>();
  for (const i of frameIdx) {
    const A = elementInputs.areas?.get(i) || 0;
    const Iz = elementInputs.momentsOfInertiaZ?.get(i) || 0;
    const Iy = elementInputs.momentsOfInertiaY?.get(i) || 0;
    const J = elementInputs.torsionalConstants?.get(i) || 0;
    const matKey = matDe(i).key;
    const As2r = elementInputs.shearAreasZ?.get(i) ?? 0;
    const As3r = elementInputs.shearAreasY?.get(i) ?? 0;
    const key = `A${A.toPrecision(6)}_Iz${Iz.toPrecision(6)}_Iy${Iy.toPrecision(6)}_J${J.toPrecision(6)}_s${As2r.toPrecision(6)}_${As3r.toPrecision(6)}_${matKey}`;
    if (!frameSecs.has(key)) {
      let h = 0.3, b = 0.3;
      if (A > 0 && Iz > 0) { h = Math.sqrt(12 * Iz / A); b = A / h; }
      frameSecs.set(key, { A, Iz, Iy, J, b, h, matKey, As2: As2r > 0 ? As2r : A * 5 / 6, As3: As3r > 0 ? As3r : A * 5 / 6 });
    }
    elemToFrameSec.set(i, `SEC${[...frameSecs.keys()].indexOf(key) + 1}`);
  }
  if (frameSecs.size > 0) {
    tabla("FRAME SECTION PROPERTY DEFINITIONS - SUMMARY");
    let k = 0;
    for (const [, s] of frameSecs) {
      k++;
      push(`   Name=SEC${k}   Material=${s.matKey}   Shape=General   Color=Magenta   Area=${fmt(s.A)}   J=${fmt(s.J * JF)}   I33=${fmt(s.Iz)}   I22=${fmt(s.Iy)}   As2=${fmt(s.As2)}   As3=${fmt(s.As3)}   "Area Modifier"=1   "As2 Modifier"=1   "As3 Modifier"=1   "J Modifier"=1   "I33 Modifier"=1   "I22 Modifier"=1   "Mass Modifier"=1   "Weight Modifier"=1`);
    }
    fin();
    tabla("FRAME SECTION PROPERTY DEFINITIONS - GENERAL");
    k = 0;
    for (const [, s] of frameSecs) {
      k++;
      // I23 = 0, radios de giro y modulos resistentes derivados (SAFE los pide en la tabla; no entran en la rigidez).
      // Los materiales de armadura son OBLIGATORIOS para una seccion de hormigon: sin ellos SAFE rechaza la
      // seccion entera (log: "Field name: LONGITUDINAL REBAR MATERIAL") y las 21 barras se quedan con SU
      // seccion por defecto, sin avisar en la barra. A615Gr60 viene de serie en todo modelo nuevo de SAFE.
      const r33 = s.A > 0 ? Math.sqrt(s.Iz / s.A) : 0, r22 = s.A > 0 ? Math.sqrt(s.Iy / s.A) : 0;
      const s33 = s.h > 0 ? s.Iz / (s.h / 2) : 0, s22 = s.b > 0 ? s.Iy / (s.b / 2) : 0;
      push(`   Name=SEC${k}   Material=${s.matKey}   Depth=${fmt(s.h)}   Width=${fmt(s.b)}   Area=${fmt(s.A)}   As2=${fmt(s.As2)}   As3=${fmt(s.As3)}   I33=${fmt(s.Iz)}   I22=${fmt(s.Iy)}   I23=0   S33Pos=${fmt(s33)}   S33Neg=${fmt(s33)}   S22Pos=${fmt(s22)}   S22Neg=${fmt(s22)}   R33=${fmt(r33)}   R22=${fmt(r22)}   Z33=${fmt(s33)}   Z22=${fmt(s22)}   J=${fmt(s.J * JF)}   "CG Offset3"=0   "CG Offset2"=0   "PNA Offset3"=0   "PNA Offset2"=0   "SC Offset3"=0   "SC Offset2"=0   "Section Type"=Beam   "Longitudinal Rebar Material"=A615Gr60   "Shear Rebar Material"=A615Gr60   "Flange Dimension Option"="Analysis Property"   "Cover Top"=0.06   "Cover Bottom"=0.06   "Area Modifier"=1   "As2 Modifier"=1   "As3 Modifier"=1   "J Modifier"=1   "I22 Modifier"=1   "I33 Modifier"=1   "Mass Modifier"=1   "Weight Modifier"=1   Color=Magenta`);
    }
    fin();
  }

  // ── Secciones de losa: una por (t, formulacion). plateFormulations: 1 = Thin (Kirchhoff), 0 = Thick (Mindlin) ──
  const shellSecs = new Map<string, { t: number; matKey: string; thin: boolean; mods?: number[]; tipo?: string }>();
  const elemToShellSec = new Map<number, string>();
  const smodsF = (elementInputs as any).shellModifiers as Map<number, number[]> | undefined;
  const bmodsF = (elementInputs as any).bendingModifiers as Map<number, number> | undefined;
  const mmodsF = (elementInputs as any).membraneModifiers as Map<number, number> | undefined;
  for (const i of shellIdx) {
    const t = elementInputs.thicknesses?.get(i) || 0.1;
    const f = (elementInputs as any).plateFormulations?.get(i) ?? 0;
    const thin = f === 1 || f === 3;
    const matKey = matDe(i).key;
    // `patrones`: modificadores por propiedad (SAFE los guarda en la losa) y tipo: Stiff si la flexion va
    // x10 o mas (el pedestal de SAFE), Mat/Footing si lleva muelle de area, Slab si no.
    let mods: number[] | undefined, tipo: string | undefined;
    if (PAT) {
      mods = smodsF?.get(i) ?? (() => { const m = mmodsF?.get(i) ?? 1, b = bmodsF?.get(i) ?? 1; return [m, m, m, b, b, b, b, b]; })();
      tipo = Math.min(mods[3], mods[4]) >= 10 ? "Stiff" : areaExp?.has(i) ? (V20 ? "Footing" : "Mat") : "Slab";
    }
    const key = `t${t.toPrecision(6)}_${thin ? "thin" : "thick"}_${matKey}${PAT ? `_${tipo}_${mods!.join(",")}` : ""}`;
    if (!shellSecs.has(key)) shellSecs.set(key, { t, matKey, thin, mods, tipo });
    elemToShellSec.set(i, `LOSA${[...shellSecs.keys()].indexOf(key) + 1}`);
  }
  if (shellSecs.size > 0) {
    tabla("AREA SECTION PROPERTY DEFINITIONS - SUMMARY");
    let k = 0;
    for (const [, s] of shellSecs) { k++; push(`   Name=LOSA${k}   Type=Slab   "Element Type"=${s.thin ? "Shell-Thin" : "Shell-Thick"}   Material=${s.matKey}   "Total Thickness"=${fmt(s.t)}`); }
    fin();
    tabla("SLAB PROPERTY DEFINITIONS");
    k = 0;
    for (const [, s] of shellSecs) {
      k++;
      const md = s.mods ?? [1, 1, 1, 1, 1, 1, 1, 1];
      push(`   Name=LOSA${k}   "Modeling Type"=${s.thin ? "Shell-Thin" : "Shell-Thick"}   "Property Type"=${s.tipo ?? "Slab"}   Material=${s.matKey}   "Slab Thickness"=${fmt(s.t)}   "Notional Size Type"=Auto   "Notional Auto Factor"=1   "f11 Modifier"=${fmt(md[0])}   "f22 Modifier"=${fmt(md[1])}   "f12 Modifier"=${fmt(md[2])}   "m11 Modifier"=${fmt(md[3])}   "m22 Modifier"=${fmt(md[4])}   "m12 Modifier"=${fmt(md[5])}   "v13 Modifier"=${fmt(md[6])}   "v23 Modifier"=${fmt(md[7])}   "Mass Modifier"=1   "Weight Modifier"=1   Color=Blue   Orthotropic?=No`);
    }
    fin();
  }

  // ── Muelles nodales: una propiedad por vector k distinto ──
  // muelles de AREA -> nodales (int N_i dA); los nudos colgados no son muelles (muellesParaExportar.ts)
  const muellesExp = muellesParaExportar(nodes as any, elements as any, (nodeInputs as any).springs, { sinArea: !!areaExp?.size });
  // muelle de AREA como propiedad de area (SAFE): una por (ks, solo compresion)
  const areaSprProp = new Map<string, { ks: number; comp: boolean }>();
  const areaSprDe = new Map<number, string>();
  if (areaExp?.size) {
    for (const [e, a] of areaExp) {
      const key = `${+a.ks.toPrecision(10)}_${a.comp}`;
      let nm = [...areaSprProp.entries()].find(([, v]) => `${+v.ks.toPrecision(10)}_${v.comp}` === key)?.[0];
      if (!nm) { nm = `KS${areaSprProp.size + 1}`; areaSprProp.set(nm, { ks: a.ks, comp: a.comp }); }
      areaSprDe.set(e, nm);
    }
    tabla("SPRING PROPERTY DEFINITIONS - AREA SPRINGS");
    for (const [nm, v] of areaSprProp) {
      const nl = v.comp ? `"Compression Only"` : `"None (Linear)"`;
      push(V20 ? `   Name=${nm}   "Subgrade Modulus"=${fmt(v.ks)}   "Nonlinear Option"=${nl}   Color=Cyan`
               : `   Name=${nm}   "Stiffness Option"=User   "Stiffnes U1"=0   "Stiffnes U2"=0   "Stiffnes U3"=${fmt(v.ks)}   "Nonlinear Option for U3"=${nl}   Color=Cyan`);
    }
    fin();
  }
  const kNudo = muellesExp.nodales;
  const springPropDeNudo = new Map<number, string>();
  const springProps = new Map<string, number[]>();
  for (const [ni, v] of kNudo) {
    const key = v.map(x => +x.toPrecision(12)).join("|");
    let nm = [...springProps.entries()].find(([, w]) => w.map(x => +x.toPrecision(12)).join("|") === key)?.[0];
    if (!nm) { nm = `SPR${springProps.size + 1}`; springProps.set(nm, v); }
    springPropDeNudo.set(ni, nm);
  }
  if (springProps.size > 0) {
    tabla("SPRING PROPERTY DEFINITIONS - POINT SPRINGS");
    for (const [nm, v] of springProps)
      push(`   Name=${nm}   "Stiffness UX"=${fmt(v[0])}   "Stiffness UY"=${fmt(v[1])}   "Stiffness UZ"=${fmt(v[2])}   "Stiffness RX"=${fmt(v[3])}   "Stiffness RY"=${fmt(v[4])}   "Stiffness RZ"=${fmt(v[5])}   "Nonlinear Option"="None (Linear)"   Color=Green`);
    fin();
  }

  const cargasPP = (nodeInputs as any).cargasPorPatron as Record<string, Map<number, number[]>> | undefined;
  const flPP = ((elementInputs as any).frameLoadsPorPatron ?? {}) as Record<string, Map<number, [number, number, number]>>;
  const pats = PAT ? [...new Set([...Object.keys(cargasPP!), ...Object.keys(flPP)])] : [];
  if (PAT) {
    const tipoDe = (p: string) => /^dead$/i.test(p) ? "Dead" : /^(dne|sdead|scm|superdead)$/i.test(p) ? `"Super Dead"` : /^(live|viva|l)$/i.test(p) ? "Live" : "Other";
    const sw = (elementInputs as any).selfWeight ?? 0;
    tabla("LOAD PATTERN DEFINITIONS");
    for (const p of pats) push(`   Name=${p}   "Is Auto Load"=No   Type=${tipoDe(p)}   "Self Weight Multiplier"=${/^dead$/i.test(p) ? fmt(sw) : 0}`);
    fin();
    tabla("LOAD CASE DEFINITIONS - SUMMARY");
    for (const p of pats) push(`   Name=${p}   Type="Linear Static"`);
    fin();
    tabla("LOAD CASE DEFINITIONS - LINEAR STATIC");
    for (const p of pats) push(`   Name=${p}   "Exclude Group"=None   "Mass Source"=MsSrc1   "Initial Condition"=Unstressed   "Load Type"=Load   "Load Name"=${p}   "Load SF"=1   "Design Type"="Program Determined"`);
    fin();
    const combos = ((elementInputs as any).combos ?? []) as Array<{ name: string; items: Array<[string, number]> }>;
    if (combos.length) {
      tabla("LOAD COMBINATION DEFINITIONS");
      for (const c of combos) c.items.forEach(([p, f], k) => push(k === 0
        ? `   Name=${c.name}   Type="Linear Add"   "Is Auto"=No   "Load Name"=${p}   SF=${fmt(f)}`
        : `   Name=${c.name}   "Load Name"=${p}   SF=${fmt(f)}`));
      fin();
    }
  } else {
  // ── Cargas: un patron, multiplicador de peso propio 0 (el peso ya viene como carga nodal) ──
    tabla("LOAD PATTERN DEFINITIONS");
    push(`   Name=${LP}   "Is Auto Load"=No   Type=Dead   "Self Weight Multiplier"=0`);
    fin();
    tabla("LOAD CASE DEFINITIONS - SUMMARY");
    push(`   Name=${LP}   Type="Linear Static"`);
    fin();
    tabla("LOAD CASE DEFINITIONS - LINEAR STATIC");
    push(`   Name=${LP}   "Exclude Group"=None   "Mass Source"=MsSrc1   "Initial Condition"=Unstressed   "Load Type"=Load   "Load Name"=${LP}   "Load SF"=1   "Design Type"="Program Determined"`);
    fin();
  }
  tabla("MASS SOURCE DEFINITION");
  push(`   Name=MsSrc1   "Is Default"=Yes   "Include Lateral Mass?"=No   "Include Vertical Mass?"=Yes   "Lump Mass?"=Yes   "Source Self Mass?"=Yes   "Source Added Mass?"=Yes   "Source Load Patterns?"=No   "Move Mass Centroid?"=No`);
  fin();

  // ── Geometria ──
  tabla("POINT OBJECT CONNECTIVITY");
  nodes.forEach((n, i) => push(`   UniqueName=${i + 1}   "Is Auto Point"=No   IsSpecial=Yes   X=${fmt(n[0])}   Y=${fmt(n[1])}   Z=${fmt(n[2])}`));
  fin();
  const dist = (a: Node, b: Node) => Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
  // TODAS las barras van como BEAM, tambien las verticales (pedestales). Medido el
  // 5-sep-2026 con 14 variantes importadas en SAFE 20.3: en cuanto el fichero lleva
  // una tabla `COLUMN OBJECT CONNECTIVITY`, SAFE se queda SOLO con esas columnas y
  // tira las losas y las vigas (0 areas, 9 barras), vaya donde vaya la tabla y sin
  // una linea en el log de importacion. Como vigas verticales entran las 21 barras
  // y las 144 losas.
  if (frameIdx.length) {
    tabla("BEAM OBJECT CONNECTIVITY");
    for (const i of frameIdx) { const [a, b] = elements[i]; push(`   "Unique Name"=B${i + 1}   UniquePtI=${a + 1}   UniquePtJ=${b + 1}   Length=${fmt(dist(nodes[a], nodes[b]))}`); }
    fin();
  }
  if (shellIdx.length) {
    tabla("FLOOR OBJECT CONNECTIVITY");
    for (const i of shellIdx) {
      const el = elements[i];
      const pts = el.map((n, k) => `UniquePt${k + 1}=${n + 1}`).join("   ");
      let per = 0, area = 0;
      for (let k = 0; k < el.length; k++) {
        const a = nodes[el[k]], b = nodes[el[(k + 1) % el.length]];
        per += dist(a, b); area += (a[0] * b[1] - b[0] * a[1]) / 2;
      }
      push(`   "Unique Name"=A${i + 1}   ${pts}   Perimeter=${fmt(per)}   Area=${fmt(Math.abs(area))}`);
    }
    fin();
  }

  // ── Apoyos y muelles en los nudos ──
  const sup = nodeInputs.supports;
  if (sup && [...sup.values()].some(r => r.some(Boolean))) {
    tabla("JOINT ASSIGNMENTS - RESTRAINTS");
    for (const [i, r] of [...sup].sort((a, b) => a[0] - b[0])) {
      if (!r.some(Boolean)) continue;
      push(`   UniqueName=${i + 1}   UX=${yn(r[0])}   UY=${yn(r[1])}   UZ=${yn(r[2])}   RX=${yn(r[3])}   RY=${yn(r[4])}   RZ=${yn(r[5])}`);
    }
    fin();
  }
  if (springPropDeNudo.size) {
    tabla("JOINT ASSIGNMENTS - SPRINGS");
    for (const [i, nm] of [...springPropDeNudo].sort((a, b) => a[0] - b[0])) push(`   UniqueName=${i + 1}   SpringProp=${nm}`);
    fin();
  }
  // Los ejemplos de placa Q4 dejan en `loadsSolver` las cargas que recibio el solver (columna +
  // peso propio); `loads` son solo las de visualizacion. Ver shared/f2kPlateQ4.ts.
  const loads = (nodeInputs as any).loadsSolver ?? nodeInputs.loads;
  if (PAT) {
    const filas: string[] = [];
    for (const p of pats) for (const [i, f] of [...(cargasPP![p] ?? new Map())].sort((a, b) => a[0] - b[0])) {
      if (!f.some((v: number) => Math.abs(v) > 1e-12)) continue;
      filas.push(`   UniqueName=${i + 1}   "Load Pattern"=${p}   FX=${fmt(f[0])}   FY=${fmt(f[1])}   FZ=${fmt(f[2])}   MX=${fmt(f[3])}   MY=${fmt(f[4])}   MZ=${fmt(f[5])}   "X Dimension"=0   "Y Dimension"=0`);
    }
    if (filas.length) { tabla("JOINT LOADS ASSIGNMENTS - FORCE"); filas.forEach(push); fin(); }
    // cargas repartidas de barra: Direction=Gravity, Force>0 hacia abajo (formato del f2k de SAFE)
    const filasF: string[] = [];
    for (const p of pats) for (const [i, w] of flPP[p] ?? new Map()) {
      const el = elements[i]; if (!el || el.length !== 2 || Math.abs(w[2]) < 1e-12) continue;
      const Lb = dist(nodes[el[0]], nodes[el[1]]);
      filasF.push(`   UniqueName=B${i + 1}   "Load Pattern"=${p}   "Load Type"=Force   Direction=Gravity   "Distance Type"=Relative   "Relative Distance A"=0   "Relative Distance B"=1   "Absolute Distance A"=0   "Absolute Distance B"=${fmt(Lb)}   "Force A"=${fmt(-w[2])}   "Force B"=${fmt(-w[2])}`);
    }
    if (filasF.length) { tabla("FRAME LOADS ASSIGNMENTS - DISTRIBUTED"); filasF.forEach(push); fin(); }
  } else if (loads && loads.size) {
    tabla("JOINT LOADS ASSIGNMENTS - FORCE");
    for (const [i, f] of [...loads].sort((a, b) => a[0] - b[0])) {
      if (!f.some(v => Math.abs(v) > 1e-12)) continue;
      push(`   UniqueName=${i + 1}   "Load Pattern"=${LP}   FX=${fmt(f[0])}   FY=${fmt(f[1])}   FZ=${fmt(f[2])}   MX=${fmt(f[3])}   MY=${fmt(f[4])}   MZ=${fmt(f[5])}   "X Dimension"=0   "Y Dimension"=0`);
    }
    fin();
  }

  // ── Asignaciones de barra y de area ──
  if (frameIdx.length) {
    tabla("FRAME ASSIGNMENTS - SECTION PROPERTIES");
    for (const i of frameIdx) push(`   UniqueName=B${i + 1}   Shape=General   "Auto Select List"=N.A.   "Section Property"=${elemToFrameSec.get(i)}`);
    fin();
    // Eje de la barra en su centroide, sin transformar: como Hekatan (SAFE pondria la viga colgada de su cara superior).
    tabla("FRAME ASSIGNMENTS - INSERTION POINT");
    for (const i of frameIdx) push(`   UniqueName=B${i + 1}   "Cardinal Point"="10 (Centroid)"   Mirror2=No   Mirror3=No   "Offset CSys"=Global   XI=0   YI=0   ZI=0   XJ=0   YJ=0   ZJ=0   "No Transform Stiffness"=Yes`);
    fin();
    tabla("FRAME ASSIGNMENTS - END LENGTH OFFSETS");
    for (const i of frameIdx) push(`   UniqueName=B${i + 1}   "Offset Option"=User   "Offset I"=0   "Offset J"=0   "Rigid Factor"=0   "Self Weight Option"=Auto`);
    fin();
  }
  if (shellIdx.length) {
    tabla("AREA ASSIGNMENTS - SECTION PROPERTIES");
    for (const i of shellIdx) push(`   UniqueName=A${i + 1}   "Section Property"=${elemToShellSec.get(i)}   "Property Type"=Slab`);
    fin();
    if (areaSprDe.size) {
      tabla("AREA ASSIGNMENTS - AREA SPRINGS");
      for (const [e, nm] of [...areaSprDe].sort((a, b) => a[0] - b[0])) push(`   UniqueName=A${e + 1}   "Spring Property"=${nm}`);
      fin();
    }
    tabla("AREA ASSIGNMENTS - INSERTION POINT");
    for (const i of shellIdx) push(`   UniqueName=A${i + 1}   "Cardinal Point"=Middle   Transform=No`);
    fin();
    tabla("AREA ASSIGNMENTS - FLOOR AUTO MESH OPTIONS");
    for (const i of shellIdx) push(`   UniqueName=A${i + 1}   "Mesh Option"=Default   "Add Restraints"=No`);
    fin();
    // Sin edge constraint: la malla ya es compatible (misma que Hekatan y que SAP2000).
    tabla("AREA ASSIGNMENTS - AUTO EDGE CONSTRAINTS");
    // `edge etabs` / `edge lineal` en el .heks (hay nudos colgados atados): SAFE con su edge constraint
    // (el @LC, lineal). Sin nudos colgados, No (lo de antes).
    const conEdge = muellesExp.colgados.length > 0;
    for (const i of shellIdx) push(`   UniqueName=A${i + 1}   Constraint=${conEdge ? "Yes" : "No"}`);
    fin();
  }

  // ── Opciones de analisis: malla maxima grande para que SAFE no parta los objetos (misma malla nudo a nudo) ──
  tabla("ANALYSIS OPTIONS - AUTOMATIC MESH SETTINGS FOR FLOORS");
  push(`   "Mesh Option"=Rectangular   "Use Localized Meshing"=Yes   "Merge Joints"=Yes   "Maximum Mesh Size"=100`);
  fin();
  tabla("ANALYSIS MODELING OPTIONS");
  push(`   "Two Dimensional Only"=No   "Rigid Diaphragm At Top"=No   "Ignore Vertical Offsets"=Yes`);
  fin();
  tabla("ANALYSIS OPTIONS - SAPFIRE OPTIONS");
  push(`   "Solver Option"=Advanced   "Analysis Process"=Auto   "Number Analysis Threads"=0   "Max File Size"=0`);
  fin();
  push("END TABLE DATA");
  return L.join("\n") + "\n";
}
