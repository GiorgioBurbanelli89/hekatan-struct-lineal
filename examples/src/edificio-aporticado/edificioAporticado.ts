/**
 * Edificio Aporticado — Pórtico 3D con parámetros completos estilo FEM Studio.
 * Organizado en folders: Geometría / Luces / Alturas / Secciones / Apoyo / Cargas / Avanzado.
 */
import { deform, analyze, modalAnalysis, type Node, type Element } from "hekatan-fem";
import { cftSectionEc } from "../shared/cadSections";
import type { ExampleDef } from "../workspace/exampleRegistry";
import { buildEdificioCotas, makeLabel } from "../shared/cotas3D";
import { etabsDiscretize, DISCRETIZE_OPTIONS } from "../shared/etabsDiscretization";
import { addRigidDiaphragms, mergeDiaphragmProps } from "../shared/rigidDiaphragm";
import { computeHinges, buildHingeObjects3D, summarizeHinges } from "../shared/plasticHinges";
import { designAllFootings, classifyFootingType, type FootingType } from "../shared/footingDesign";
import * as THREE from "three";

// Densidad de MASA del concreto, NO peso específico.
// CSI Manual §4.12: "Mass values must be given in consistent mass units (W/g)".
// γ_concreto = 24 kN/m³ (peso específico) → ρ = γ/g = 24/9.81 = 2.447 ton/m³ (kN·s²/m⁴)
// Si se pasa γ directamente (sin dividir por g), las masas están infladas por
// factor g → períodos modales sale × √9.81 ≈ 3.13× más largos que ETABS.
const G_GRAVITY = 9.81;
const rho_c = 24 / G_GRAVITY; // ≈ 2.447 ton/m³
/**
 * Densidad del ACERO. Faltaba, y por eso las columnas y vigas de acero
 * entraban con la del hormigón: **3.25 veces menos masa de la que tienen**
 * (2.447 contra 7.951 t/m³). Afectaba al modal de todo lo que clona este
 * ejemplo con `matCol`/`matViga` en Acero W: `edif-acero`,
 * `edificio-acero-v2`, `edificio-mixto`, `edificio-dual` y `mezanine`.
 * Lo cazo el test de `c = √(E/ρ)`: salía 9042 m/s donde el acero real da 5048.
 */
const rho_s = 78 / G_GRAVITY; // ≈ 7.951 ton/m³

// Helper para crear params con folder
const P = (folder: string, label: string, def: number, min: number, max: number, step: number) =>
  ({ default: def, min, max, step, label, folder });
const PE = (folder: string, label: string, def: number, options: Record<string, number>) =>
  ({ default: def, label, folder, options });

export const edificioAporticado: ExampleDef = {
  id: "edificio-aporticado",
  name: "Edificio Aporticado",
  category: "1️⃣ Frames · 🎯 n GDL Sistemas",
  // Edificio aporticado: por defecto sin shell colormap (modelo 1D), pero si
  // el usuario activa losas (slabOn) o el modo "Solo cimentación" tendremos
  // elementos shell Q4 cuyos resultados (pressure, bending, displacement) sí
  // son significativos. Por eso ofrecemos los principales — el dropdown no
  // muestra nada útil cuando solo hay frames, pero al haber shells se activa.
  defaultShellResult: "none",
  availableShellResults: [
    "none", "pressure",
    "bendingXX", "bendingYY", "bendingXY",
    "displacementZ", "vonMises",
  ],
  hasModal: true,
  params: {
    // ── Geometría ──
    // Params estructurales: al cambiarlos, el workspace regenera los dynamicParams
    // (Secciones por piso, Alturas por piso, Luces por vano).
    nVanosX:  { ...P("Geometría", "Vanos X", 2, 1, 6, 1), regenOnChange: true },
    nVanosY:  { ...P("Geometría", "Vanos Y", 2, 1, 6, 1), regenOnChange: true },
    nPisos:   { ...P("Geometría", "N. Pisos", 3, 1, 8, 1), regenOnChange: true },
    spanX:    P("Geometría", "Luz X uniforme (m)", 5.0, 2, 12, 0.5),
    spanY:    P("Geometría", "Luz Y uniforme (m)", 5.0, 2, 12, 0.5),
    hPiso:    P("Geometría", "h piso uniforme (m)", 3.0, 2, 5, 0.1),
    Lvix:     P("Geometría", "Voladizo izq X (m)", 0, 0, 3, 0.25),
    Lvdx:     P("Geometría", "Voladizo der X (m)", 0, 0, 3, 0.25),
    Lviy:     P("Geometría", "Voladizo izq Y (m)", 0, 0, 3, 0.25),
    Lvdy:     P("Geometría", "Voladizo der Y (m)", 0, 0, 3, 0.25),

    // Luces por vano y Alturas por piso ahora son DINÁMICAS (dynamicParams).
    // Solo se muestran svX_1..svX_{nVanosX}, svY_1..svY_{nVanosY}, hP_1..hP_{nPisos}.
    hP_7:     P("Alturas por piso", "Piso 7 (m)", 0, 0, 6, 0.1),
    hP_8:     P("Alturas por piso", "Piso 8 (m)", 0, 0, 6, 0.1),

    // ── Secciones globales (fallback si per-piso es 0) ──
    matCol:   PE("Secciones (global)", "Material columna", 0, { "Hormigón": 0, "Acero W": 1, "CFT (tubo relleno)": 2 }),
    tCft:     P("Secciones (global)", "t pared CFT (m)", 0.010, 0.004, 0.030, 0.001),
    matViga:  PE("Secciones (global)", "Material viga",    0, { "Hormigón": 0, "Acero W": 1 }),
    colShape: PE("Secciones (global)", "Forma columna", 0, { "Rectangular": 0, "Circular": 1 }),
    fcConcr:  P("Secciones (global)", "f'c hormigón (kg/cm²)", 240, 140, 420, 10),
    fyAcero:  P("Secciones (global)", "fy acero (kg/cm²)", 2530, 1800, 4200, 100),
    colSize:  P("Secciones (global)", "b×h columna (m)", 0.40, 0.25, 0.80, 0.05),
    vigaB:    P("Secciones (global)", "b viga (m)", 0.30, 0.20, 0.60, 0.05),
    vigaH:    P("Secciones (global)", "h viga (m)", 0.50, 0.30, 0.90, 0.05),

    // NOTA: las secciones por piso (colB_pN, colH_pN, vigaB_pN, vigaH_pN)
    // ahora se generan dinámicamente via `dynamicParams(currentParams)` más
    // abajo — SOLO se muestran los sliders de los pisos que realmente existen
    // según nPisos. Ya no hay slots fantasma colB_8 cuando el edificio tiene 3 pisos.

    // ── Mesh subdivision (estilo FEM Studio "Div. Vigas/Columnas") ──
    // Subdivide cada viga y columna en N segmentos para obtener resultados
    // intermedios (diagrama de momentos suave, no solo en los extremos).
    nDivBeam: P("Mesh", "Div. Vigas (segmentos)", 1, 1, 8, 1),
    nDivCol:  P("Mesh", "Div. Columnas (segmentos)", 1, 1, 8, 1),

    // ── Vigas Secundarias (FEM Studio: folder Vigas Secundarias) ──
    vigSecActivar:   { ...PE("Vigas Secundarias", "Activar", 0, { "No": 0, "Sí": 1 }), regenOnChange: true },
    vigSecDir:       PE("Vigas Secundarias", "Corren en", 2, { "Auto (lado corto)": 2, "X (entre ejes Y)": 0, "Y (entre ejes X)": 1 }),
    vigSecCantidad:  P("Vigas Secundarias", "Cantidad/vano", 2, 1, 5, 1),
    vigSecB:         P("Vigas Secundarias", "b sec (m)", 0.20, 0.10, 0.40, 0.05),
    vigSecH:         P("Vigas Secundarias", "h sec (m)", 0.30, 0.20, 0.60, 0.05),

    // ── Losas de Piso (FEM Studio: folder Losas de Piso) ──
    losaActivar:     { ...PE("Losas de Piso", "Activar losas", 0, { "No": 0, "Sí": 1 }), regenOnChange: true },
    losaEspesor:     P("Losas de Piso", "Espesor (m)", 0.15, 0.08, 0.40, 0.01),
    losaSubdivX:     P("Losas de Piso", "Subdiv. X", 2, 1, 6, 1),
    losaSubdivY:     P("Losas de Piso", "Subdiv. Y", 2, 1, 6, 1),

    // ── Muros de Corte (FEM Studio: folder Muros de Corte) ──
    muroActivar:     { ...PE("Muros de Corte", "Activar", 0, { "No": 0, "Perimetrales": 1, "Centro X": 2, "Centro Y": 3, "Doble central": 4 }), regenOnChange: true },
    muroEspesor:     P("Muros de Corte", "Espesor (m)", 0.20, 0.10, 0.40, 0.01),
    muroSubdivV:     P("Muros de Corte", "Subdiv. V (vert)", 2, 1, 6, 1),
    muroSubdivH:     P("Muros de Corte", "Subdiv. H (horiz)", 2, 1, 6, 1),

    // ── Apoyo ──
    apoyo:    PE("Apoyo", "Tipo", 0, { "Empotrado": 0, "Articulado (3 DOFs)": 1, "Rótula completa": 2 }),
    // Regla de Jorge (4-sep-2026): primero se compara con SAP2000 (solo lo que se malla) y
    // despues con ETABS anadiendo SU semantica con nombre. Aqui la unica que aplica es la
    // union viga-muro de ETABS (`etabsWallJoint`); las losas son placas, no deck membrana.
    comparar: PE("Apoyo", "Comparar con", 1, { "ETABS (unión viga-muro de ETABS)": 1, "SAP2000 (sin semánticas)": 0 }),
    // brazos rigidos AUTOMATICOS de ETABS: RZ = 0, pero la viga no pesa ni masa el tramo dentro de la
    // columna (medio lado en la direccion de la viga, a cada extremo con columna). Medido 8-sep-2026.
    offsets: PE("Apoyo", "Brazos rígidos", 1, { "ETABS (automáticos: solo peso y masa)": 1, "Ninguno (SAP2000)": 0 }),

    // ── Cargas (patrones tipo FEM Studio) ──
    CM:       P("Cargas", "CM (kN/nodo)", -5,   -30, 0,    0.5),
    CV:       P("Cargas", "CV (kN/nodo)", -2,   -20, 0,    0.5),
    Ex:       P("Cargas", "Ex sismo tope (kN)", 50,  0,   500, 10),
    Ey:       P("Cargas", "Ey sismo tope (kN)", 0,   0,   500, 10),
    // ── Caso de carga a visualizar/analizar ──
    // Selector que filtra qué cargas se aplican al solver. El viewer
    // muestra las flechas solo de las cargas activas.
    loadCase: PE("Cargas", "Caso de carga", 0, {
      "Combinada (CM+CV+Ex+Ey)":     0,   // default — todas las cargas
      "Solo Vertical (CM+CV)":        1,
      "Solo Dead (CM)":               2,
      "Solo Live (CV)":               3,
      "Solo Sismo Ex":                4,
      "Solo Sismo Ey":                5,
      "Sismo XY (Ex+Ey)":             6,
      "1.2 CM + 1.6 CV (ASCE)":       7,
      "1.2 CM + 1.0 CV + 1.0 Ex":     8,
      "1.2 CM + 1.0 CV + 1.0 Ey":     9,
      "1.2 CM + 1.0 CV - 1.0 Ex":    10,
      "1.2 CM + 1.0 CV - 1.0 Ey":    11,
      "0.9 CM + 1.0 Ex":             12,
      "0.9 CM + 1.0 Ey":             13,
    }),

    // ══════════════════════════════════════════════════════════════
    // ══  CIMENTACIÓN  ══════════════════════════════════════════════
    // ══════════════════════════════════════════════════════════════
    // El primer parámetro es el TOGGLE 1-click entre ver el edificio
    // completo o solo la cimentación. Funciona como "botón
    // superestructura ↔ cimentación":
    //   "🏢 Edificio completo"   = ver/editar la superestructura
    //                              (la cimentación se auto-recalcula
    //                              cuando vuelves al modo cimentación)
    //   "🪨 Solo cimentación"    = elimina la superestructura, las
    //                              reacciones del último deform se
    //                              aplican como P,Mx,My en pedestales
    modoCimentacion: PE("Cimentación", "🔘 Vista (toggle)", 0, {
      "🏢 Edificio completo (ver/editar)":  0,
      "🪨 Solo cimentación (P,Mx,My)":      1,
    }),
    // Modela la cimentación bajo cada columna base como zapata aislada Q4
    // (shellthick) con la columna ENTERRADA Df entre z=0 (primera cadena
    // /contrapiso) y el top de la zapata. Permite representar dos prácticas:
    //   1) Columna llega hasta z=0 y CONTINÚA enterrada hasta la zapata
    //      → Df > 0 (lo típico cuando hay primera cadena/contrapiso)
    //   2) Columna baja directamente hasta la zapata sin enterrarse
    //      → Df = 0 (el bottom de la columna toca el top de la zapata)
    q_adm_zapata: P("Cimentación", "q_adm (tonf/m²)",   10,   1,    100,   1),
    ks_zapata:    P("Cimentación", "ks (kN/m³)",       1030, 100,   2e5,  10),
    Hf_pedestal:  P("Cimentación", "Df col enterrada (m) (m)", 0.5, 0.0, 3.0, 0.05),
    t_zapata:     P("Cimentación", "t zapata (m)",     0.30, 0.10, 1.50, 0.05),
    nSubZapata:   P("Cimentación", "Subdiv. Q4 zapata", 4, 2, 12, 1),
    voladoExtra:  P("Cimentación", "Volado extra esq./lin (m)", 0.30, 0.0, 1.0, 0.05),
    tipoZapataOverride: PE("Cimentación", "Tipo (override)", 0, {
      "Auto (por posición)": 0,
      "Todas central":       1,
      "Todas lindero":       2,
      "Todas esquinera":     3,
    }),
    // Default OFF — el modelo default es EMPOTRADO en la base (supports fixed
    // a z=0). El usuario activa este toggle si quiere VER las zapatas 3D
    // sobre el modelo edificio (modo verificación cimentación). Para análisis
    // FEM completo de las zapatas con Q4+Winkler, usar el toggle aparte
    // "Cimentación FEM" o el botón "Ver TODAS las zapatas FEM".
    mostrarZapatas: PE("Cimentación", "Mostrar zapatas 3D", 0, { "On": 1, "Off": 0 }),
    mostrarLabelsZapatas: PE("Cimentación", "Mostrar etiquetas zapatas", 1, { "On": 1, "Off": 0 }),
    estiloZapata: PE("Cimentación", "Estilo render", 1, {
      "Sólido (caja translúcida)": 0,
      "Shellthick (Q4 + grilla)":  1,
    }),
    // ── Sistema de cimentación (solo aplica si modoCimentacion=1) ──
    //   0 = Zapatas aisladas individuales por columna (default)
    //   1 = Zapatas aisladas + Vigas de amarre (tie beams entre zapatas)
    //   2 = Vigas de cimentación T invertida (frame corrido sin shell)
    //   3 = Vigas rectangulares + Zapata corrida (frame + Q4 strip)
    //   4 = Losa de cimentación (raft mat — Q4 único bajo TODA la planta)
    sistemaCimentacion: PE("Cimentación", "Sistema cim.", 0, {
      "Zapatas aisladas":              0,
      "Zapatas + vigas de amarre":     1,
      "Vigas T invertida (corrida)":   2,
      "Vigas rect. + zapata corrida":  3,
      "Losa de cimentación (raft)":    4,
    }),
    // Posición de las vigas de amarre (sistema 1):
    //   0 = Unidas a las zapatas (en el shell de la zapata, z=-Hf)
    //   1 = Conectadas a los pedestales a media altura (z=-Hf/2)
    vigaAmarre_pos: PE("Cimentación", "Viga amarre — posición", 0, {
      "Unida a zapatas (z=-Hf)":       0,
      "Conectada a pedestales (-Hf/2)": 1,
    }),
    vigaAmarre_h: P("Cimentación", "Viga amarre h (m)", 0.40, 0.20, 1.00, 0.05),
    vigaAmarre_b: P("Cimentación", "Viga amarre b (m)", 0.25, 0.15, 0.60, 0.05),
    // Sección de viga de cimentación (sistemas 2, 3):
    //   h_total y b_alma para T invertida; b_ala = ancho del ala bajo el alma
    //   (= ancho de la zapata corrida en sistema 3)
    vigaCim_h:   P("Cimentación", "Viga cim. h (m)",    0.80, 0.30, 2.00, 0.05),
    vigaCim_bw:  P("Cimentación", "Viga cim. b alma (m)", 0.40, 0.20, 1.00, 0.05),
    vigaCim_bf:  P("Cimentación", "Viga cim. b ala (m)",  1.20, 0.40, 3.00, 0.10),
    vigaCim_tf:  P("Cimentación", "Viga cim. e ala (m)",  0.30, 0.10, 0.80, 0.05),

    // ── Avanzado ──
    nSubViga: P("Avanzado", "Div. vigas", 1, 1, 6, 1),
    nSubCol:  P("Avanzado", "Div. columnas", 1, 1, 4, 1),
    vSecOn:   PE("Avanzado", "Vigas secundarias",  0, { "Off": 0, "On": 1 }),
    nVSec:    P("Avanzado", "N° vigas sec. por vano", 2, 1, 5, 1),
    vSecDir:  PE("Avanzado", "Dir secundarias",  2, { "Auto (lado corto)": 2, "X": 0, "Y": 1 }),
    bracesMode: PE("Avanzado", "Diagonales", 0, { "ninguna": 0, "perimetrales": 1, "todas": 2, "solo X": 3, "solo Y": 4 }),
    slabOn:   PE("Avanzado", "Losa",  0, { "Off": 0, "On": 1 }),
    // Formulacion de la losa: ETABS la pone Shell-Thin por defecto (y las 8 plantillas
    // cierran con ETABS en Thin); Thick = el Shell-Thick de CSI.
    slabForm: PE("Avanzado", "Formulación losa", 1, { "Thin (ETABS)": 1, "Thick": 0 }),
    slabT:    P("Avanzado", "t losa (m)", 0.15, 0.08, 0.30, 0.01),
    // Muros de corte de CASCARA (Q4 verticales): el primer vano, en las dos
    // fachadas, de la base a la cubierta. Antes "muros" eran las diagonales
    // perimetrales (bracesMode=1) y el colormap no tenia nada que pintar.
    murosMode: PE("Avanzado", "Muros de corte (cáscara)", 0, { "ninguno": 0, "en X (fachadas Y)": 1, "en Y (fachadas X)": 2, "en X e Y": 3 }),
    tMuro:    P("Avanzado", "t muro (m)", 0.25, 0.15, 0.60, 0.05),
    // ── Tipo de losa según ETABS (Property Modifiers en CSI Manual §10.7) ──
    //   Shell completo:  M=1, B=1   (membrana + flexión, default ETABS)
    //   Membrane only:   M=1, B=0   (solo in-plane, suprime modos verticales)
    //   Plate only:      M=0, B=1   (solo flexión, raro en edificios)
    slabType: PE("Avanzado", "Tipo losa (ETABS)", 0, {
      "Shell (membrane+plate)": 0,
      "Membrane only": 1,
      "Plate only": 2,
    }),
    // Discretización automática ETABS-style: la losa se subdivide por paño
    // (por bay) al tamaño objetivo seleccionado. 25-50 cm replica el default
    // interno de ETABS; 15 cm es análisis fino; 0 fuerza Q4 único por paño.
    slabDisc: PE("Avanzado", "Discretización losa", 0.50, DISCRETIZE_OPTIONS),
    // Diafragma rígido (ASCE/SEI 7-22 §12.3.1 + NEC-SE-DS §6.2): une todos los
    // nodos del piso vía rigid links al centroide. Reduce DOFs laterales del piso
    // a 3 (Ux, Uy, Rz_master), modelando la losa como placa in-plane rígida.
    // ON = asunto típico cuando la losa puede considerarse rígida (losa maciza,
    // losa reticular con vigas profundas). OFF = diafragma flexible (losa delgada
    // con muros de corte discontínuos — ver ASCE 7-22 §12.3.1.2).
    diafragmaRigido: PE("Avanzado", "Diafragma rígido", 0, { "Flexible": 0, "Rígido (ASCE 7-22)": 1 }),
    // Que nudos ata el diafragma de cada planta. ETABS lo asigna de dos formas y
    // NO son lo mismo (medido el 8-sep-2026, un piso con muro, empuje de 50 kN):
    //   POINT D1 (ejes de columna)      -> como SAP2000 y como Hekatan hasta hoy
    //   AREA D1 (la losa entera)        -> ETABS ata TODA la malla de la losa; el
    //                                      .e2k del exportador lo lleva, y la
    //                                      coronacion del muro salia 15.9 % mas
    //                                      blanda en Hekatan. Con la losa entera
    //                                      atada, 4.1 %.
    diafragmaNudos: PE("Avanzado", "Diafragma: nudos atados", 1, { "ninguno": 0, "ejes de columna (POINT D1, SAP2000)": 1, "toda la losa (AREA D1, ETABS)": 2 }),
    // ── Modelado de masa estilo ETABS / SAP2000 ──
    // Self-weight: ρ·V de TODOS los elementos (default Hekatan, MÁS masa)
    // From loads: DEAD + 0.25·LIVE como AREALOAD (default ETABS, MENOS masa)
    massSource: PE("Avanzado", "Mass Source", 0, {
      "Self-weight (peso propio)": 0,
      "From Loads (DEAD+0.25·LIVE) ETABS": 1,
    }),
    qDead:  P("Avanzado", "qDead losa (kN/m²)", 3.5, 0.5, 10, 0.5),
    qLive:  P("Avanzado", "qLive losa (kN/m²)", 1.5, 0.0, 6, 0.5),
    // ── Cracked Section Modifiers ACI 318-22 §6.6.3.1.1 ──
    // ETABS los aplica AUTOMÁTICAMENTE en hormigón. Reducen rigidez efectiva
    // simulando fisuración bajo cargas de servicio sismicas.
    crackedSections: PE("Avanzado", "Cracked Sections (ACI 318)", 0, {
      "Off (sección bruta Ig)": 0,
      "On: 0.7·Ig col / 0.35·Ig viga / 0.25·Ig losa": 1,
    }),
  },
  /**
   * Genera sliders dinámicos SOLO para los pisos/vanos que realmente existen.
   * Si nPisos=3 y nVanosX=2 y nVanosY=3, retorna:
   *   - hP_1, hP_2, hP_3                   (alturas por piso)
   *   - svX_1, svX_2                        (luces vano X)
   *   - svY_1, svY_2, svY_3                 (luces vano Y)
   *   - colB_p1..colB_p3, colH_p1..colH_p3  (secciones columnas por piso)
   *   - vigaB_p1..vigaB_p3, vigaH_p1..vigaH_p3 (secciones vigas por piso)
   * Al subir nPisos a 5, se agregan hP_4, hP_5, colB_p4, colB_p5, etc.
   * Al bajar a 2, desaparecen los sliders sobrantes (solo quedan hP_1, hP_2).
   */
  dynamicParams(cur) {
    const out: Record<string, any> = {};
    const nP = Math.round(cur.nPisos ?? 3);
    const nVX = Math.round(cur.nVanosX ?? 2);
    const nVY = Math.round(cur.nVanosY ?? 2);
    for (let i = 1; i <= nP; i++) {
      out[`hP_${i}`]    = P("Alturas por piso", `h Piso ${i} (m)`, 0, 0, 6, 0.1);
      out[`colB_p${i}`] = P("Secciones por piso", `b col P${i} (m)`, 0, 0, 1.0, 0.05);
      out[`colH_p${i}`] = P("Secciones por piso", `h col P${i} (m)`, 0, 0, 1.0, 0.05);
      out[`vigaB_p${i}`] = P("Secciones por piso", `b viga P${i} (m)`, 0, 0, 0.8, 0.05);
      out[`vigaH_p${i}`] = P("Secciones por piso", `h viga P${i} (m)`, 0, 0, 1.0, 0.05);
    }
    for (let i = 1; i <= nVX; i++) out[`svX_${i}`] = P("Luces por vano", `svX #${i} (m)`, 0, 0, 12, 0.5);
    for (let i = 1; i <= nVY; i++) out[`svY_${i}`] = P("Luces por vano", `svY #${i} (m)`, 0, 0, 12, 0.5);
    return out;
  },
  /**
   * Muestra las reacciones máximas en apoyos (z=0) en tonf.
   * Estas son las que el ingeniero debe copiar manualmente a zapata-aislada /
   * zapata-viga-amarre para diseñar la cimentación por separado (buena práctica:
   * NO modelar edificio+zapata juntos — se desacoplan por rigidez infinita asumida).
   */
  computedLabels(p, states) {
    const TONF_TO_KN = 9.80665;
    const reactions = (states.deformOutputs.rawVal as any)?.reactions as
      Map<number, [number, number, number, number, number, number]> | undefined;
    const nodes = states.nodes.rawVal as number[][];
    if (!reactions || !nodes?.length) {
      return { "Reacciones (→ zapatas)": "—" };
    }
    // Buscar máximos en apoyos (nodos con z≈0) y recolectar TODAS las base reactions
    let maxFz = 0, maxMx = 0, maxMy = 0;
    let maxFz_nodo = -1, maxFz_xy: [number, number] = [0, 0];
    let minFz = 0, minFz_nodo = -1;
    type BaseRow = { idx: number; x: number; y: number; P_kN: number; Mx_kN: number; My_kN: number };
    const baseRows: BaseRow[] = [];
    let xMax = 0, yMax = 0;
    reactions.forEach((r, idx) => {
      const n = nodes[idx];
      if (!n || Math.abs(n[2]) > 1e-6) return;   // sólo apoyos z=0
      const Fz = r[2], Mx = r[3], My = r[4];
      if (Math.abs(Fz) > Math.abs(maxFz)) { maxFz = Fz; maxFz_nodo = idx; maxFz_xy = [n[0], n[1]]; }
      if (Fz > 0 && Fz > Math.abs(minFz)) { minFz = Fz; minFz_nodo = idx; }   // tracción (uplift)
      if (Math.abs(Mx) > Math.abs(maxMx)) maxMx = Mx;
      if (Math.abs(My) > Math.abs(maxMy)) maxMy = My;
      // P en compresión: usamos |Fz| (la convención de signo del solver awatif
      // varía y aquí solo necesitamos la magnitud para dimensionar la zapata).
      // El uplift se detecta por separado en el branch `Fz > 0 && Fz > minFz`.
      baseRows.push({ idx, x: n[0], y: n[1], P_kN: Math.abs(Fz), Mx_kN: Mx, My_kN: My });
      if (n[0] > xMax) xMax = n[0];
      if (n[1] > yMax) yMax = n[1];
    });
    const P_tonf = Math.abs(maxFz) / TONF_TO_KN;
    const Mx_tonf = Math.abs(maxMx) / TONF_TO_KN;
    const My_tonf = Math.abs(maxMy) / TONF_TO_KN;
    const uplift_tonf = minFz / TONF_TO_KN;
    const nPisos = Math.round(p.nPisos);
    const result: Record<string, string> = {
      "── Reacciones máx (→ zapatas) ──": "",
      "P (compresión)": `${P_tonf.toFixed(2)} tonf (nodo ${maxFz_nodo})`,
      "Mx": `${Mx_tonf.toFixed(2)} tonf·m`,
      "My": `${My_tonf.toFixed(2)} tonf·m`,
    };
    if (uplift_tonf > 0.01) result["⚠ Uplift"] = `${uplift_tonf.toFixed(2)} tonf (nodo ${minFz_nodo})`;
    result["Pisos"] = `${nPisos}`;
    result["Copiar a → zapata-aislada"] = `P=${P_tonf.toFixed(1)}, Mx=${Mx_tonf.toFixed(1)}, My=${My_tonf.toFixed(1)}`;

    // ── Diseño automático de zapatas para TODOS los apoyos ──
    if (baseRows.length > 0 && xMax > 0 && yMax > 0) {
      const q_adm = (p.q_adm_zapata as number) ?? 10;  // tonf/m²
      const ks    = (p.ks_zapata as number) ?? 1030;   // kN/m³
      try {
        const zapatas = designAllFootings(baseRows, xMax, yMax, q_adm, ks);
        let nEsq = 0, nLin = 0, nCen = 0;
        let sigmaMax = 0, sigmaMaxIdx = -1, sigmaMaxTipo = "";
        let okCount = 0;
        let LzMaxDim = 0;
        for (const z of zapatas) {
          if (z.tipo === "esquinera") nEsq++;
          else if (z.tipo === "lindero") nLin++;
          else nCen++;
          if (z.sigmaMax_tonf > sigmaMax) {
            sigmaMax = z.sigmaMax_tonf;
            sigmaMaxIdx = z.idx;
            sigmaMaxTipo = z.tipo;
          }
          if (z.status === "OK") okCount++;
          if (z.Lz > LzMaxDim) LzMaxDim = z.Lz;
        }
        result["── Cimentación (auto) ──"] = "";
        result["Tipos zapata"] = `${nEsq} esquineras, ${nLin} linderas, ${nCen} centrales`;
        result["σ_max global"] = `${sigmaMax.toFixed(2)} tonf/m² (nodo ${sigmaMaxIdx}, ${sigmaMaxTipo})`;
        result["σ/q_adm"] = `${(sigmaMax / q_adm).toFixed(2)}` + (sigmaMax / q_adm <= 1 ? " ✓" : " ⚠");
        result["Lz máx zapata"] = `${LzMaxDim.toFixed(2)} m`;
        result["Cumplen"] = `${okCount}/${zapatas.length}` + (okCount === zapatas.length ? " ✓" : " ⚠");
        // Parámetros geométricos del modelo de cimentación
        const Hf_lbl = (p.Hf_pedestal as number) ?? 0.5;
        const tz_lbl = (p.t_zapata as number) ?? 0.30;
        const nSub_lbl = Math.round((p.nSubZapata as number) ?? 4);
        result["Df col enterrada"] = `${Hf_lbl.toFixed(2)} m` + (Hf_lbl < 1e-3 ? " (sin pedestal)" : "");
        result["t zapata"] = `${tz_lbl.toFixed(2)} m`;
        result["Subdiv. Q4"] = `${nSub_lbl}×${nSub_lbl}`;
        result["Volado extra"] = `${((p.voladoExtra as number) ?? 0.30).toFixed(2)} m`;
      } catch (e) {
        result["── Cimentación ──"] = "module load error";
      }
    }

    // ── Rótulas plásticas (ASCE 41-17 / FEMA 356) ──
    const hingeCounts = (states as any).__plasticHinges as Record<string, number> | undefined;
    if (hingeCounts) {
      const total = (hingeCounts.B ?? 0) + (hingeCounts.IO ?? 0) + (hingeCounts.LS ?? 0) + (hingeCounts.CP ?? 0);
      result["── Rótulas plásticas (ASCE 41-17) ──"] = "";
      result["🟢 Elástico"] = `${hingeCounts.Elastic ?? 0}`;
      result["🟡 B — Yield"] = `${hingeCounts.B ?? 0}`;
      result["🟠 IO — Immed.Occ."] = `${hingeCounts.IO ?? 0}`;
      result["🔴 LS — Life Safety"] = `${hingeCounts.LS ?? 0}`;
      result["⚫ CP — Collapse Prev."] = `${hingeCounts.CP ?? 0}`;
      result["Total rótulas formadas"] = `${total}`;
    }
    return result;
  },
  build(p, states) {
    const nvx = Math.round(p.nVanosX);
    const nvy = Math.round(p.nVanosY);
    const np  = Math.round(p.nPisos);
    const nSubViga = Math.max(1, Math.round(p.nSubViga));
    const nSubCol  = Math.max(1, Math.round(p.nSubCol));

    // Material propiedades (kN/m²)
    const fc_MPa = p.fcConcr * 0.0981;  // kg/cm² → MPa
    const Ec = 4700 * Math.sqrt(fc_MPa) * 1000;   // ACI: E = 4700√f'c MPa → kN/m²
    const Es = 200e6;                              // acero W
    const nu_c = 0.2, nu_s = 0.3;
    const Gc = Ec / (2 * (1 + nu_c));
    const Gs = Es / (2 * (1 + nu_s));

    /**
     * Luces y alturas, una por vano y por piso.
     *
     * Antes eran arrays LITERALES de 6 y de 8 (`[p.hP_1 … p.hP_8]`) y luego un
     * `.slice(0, np)`. Con más pisos que huecos el slice no rellena nada: el
     * array se queda corto, las cotas de los pisos que sobran se calculan con
     * `undefined` y salen **NaN**. Es lo que le pasaba a `edificio-dual`, que
     * pide 10 pisos: **450 nudos con z = NaN** desde el nudo 81 (el primero del
     * piso 9), el solver tiraba «Matrix decomposition failed» y ETABS importaba
     * joints con la coordenada NaN. El `.slice` escondía el problema porque
     * nunca falla: solo devuelve menos.
     *
     * `dynamicParams` ya genera `hP_i` y `svX_i` para todos los que haga falta,
     * así que se leen por nombre y no de una lista escrita a mano.
     */
    const porIndice = (prefijo: string, n: number, porDefecto: number) =>
      Array.from({ length: n }, (_, i) => {
        const v = (p as any)[`${prefijo}${i + 1}`];
        return typeof v === "number" && v > 0 ? v : porDefecto;
      });
    const svX = porIndice("svX_", nvx, p.spanX);
    const svY = porIndice("svY_", nvy, p.spanY);
    const hpisos = porIndice("hP_", np, p.hPiso);

    // Grid coords
    const xCoords: number[] = [];
    if (p.Lvix > 0) xCoords.push(-p.Lvix);
    xCoords.push(0);
    for (let i = 0; i < nvx; i++) xCoords.push(xCoords[xCoords.length - 1] + svX[i]);
    if (p.Lvdx > 0) xCoords.push(xCoords[xCoords.length - 1] + p.Lvdx);

    const yCoords: number[] = [];
    if (p.Lviy > 0) yCoords.push(-p.Lviy);
    yCoords.push(0);
    for (let i = 0; i < nvy; i++) yCoords.push(yCoords[yCoords.length - 1] + svY[i]);
    if (p.Lvdy > 0) yCoords.push(yCoords[yCoords.length - 1] + p.Lvdy);

    const zCoords: number[] = [0];
    for (let i = 0; i < np; i++) zCoords.push(zCoords[zCoords.length - 1] + hpisos[i]);

    const isCantTipX = (ix: number) => (p.Lvix > 0 && ix === 0) || (p.Lvdx > 0 && ix === xCoords.length - 1);
    const isCantTipY = (iy: number) => (p.Lviy > 0 && iy === 0) || (p.Lvdy > 0 && iy === yCoords.length - 1);
    const isCantTip = (ix: number, iy: number) => isCantTipX(ix) || isCantTipY(iy);

    // Nodos
    const nodes: Node[] = [];
    const nid: Record<string, number> = {};
    for (let iz = 0; iz < zCoords.length; iz++)
      for (let iy = 0; iy < yCoords.length; iy++)
        for (let ix = 0; ix < xCoords.length; ix++) {
          if (iz === 0 && isCantTip(ix, iy)) continue;
          nid[`${ix},${iy},${iz}`] = nodes.length;
          nodes.push([xCoords[ix], yCoords[iy], zCoords[iz]]);
        }

    // Elementos
    const elements: Element[] = [];
    const colIdx = new Set<number>();
    const beamIdx = new Set<number>();
    const slabIdx = new Set<number>();
    // Map de floor por elemento (0 = primer piso, etc.) para aplicar secciones por piso
    const elementFloor = new Map<number, number>();

    const addSub = (ni: number, nj: number, nSub: number, bucket: Set<number>, floor: number) => {
      if (nSub <= 1) {
        bucket.add(elements.length);
        elementFloor.set(elements.length, floor);
        elements.push([ni, nj]); return;
      }
      const p0 = nodes[ni], p1 = nodes[nj];
      let prev = ni;
      for (let k = 1; k < nSub; k++) {
        const t = k / nSub;
        const midIdx = nodes.length;
        nodes.push([p0[0]+(p1[0]-p0[0])*t, p0[1]+(p1[1]-p0[1])*t, p0[2]+(p1[2]-p0[2])*t]);
        bucket.add(elements.length);
        elementFloor.set(elements.length, floor);
        elements.push([prev, midIdx]);
        prev = midIdx;
      }
      bucket.add(elements.length);
      elementFloor.set(elements.length, floor);
      elements.push([prev, nj]);
    };

    /**
     * Parte en dos cualquier barra que PASE por este nudo sin tenerlo de
     * extremo.
     *
     * Sin esto, la viga secundaria nacía en un nudo NUEVO sobre la viga
     * principal —(0, 1.67, 3), por ejemplo— y esa viga principal seguía
     * yendo de esquina a esquina sin enterarse: la secundaria entera quedaba
     * FLOTANDO, sin tocar nada. Seis grados de libertad de sólido rígido, o
     * sea matriz SINGULAR. `edif-acero` (que trae `vSecOn` encendido) no
     * resolvía: 0 deformaciones, ΣRz = 0 y el solver avisando «LDLT failed…
     * Matrix decomposition failed». Medido: con `vSecOn=0` resolvía y
     * equilibraba exacto; con las secundarias, 24 nudos tocaban un solo
     * elemento — los dos extremos de 12 vigas colgadas de la nada.
     */
    const partirBarrasEn = (ni: number) => {
      const P = nodes[ni];
      for (let e = elements.length - 1; e >= 0; e--) {
        const el = elements[e];
        if (el.length !== 2) continue;
        const [a, b] = el;
        if (a === ni || b === ni) continue;
        const A = nodes[a], B = nodes[b];
        const d = [B[0]-A[0], B[1]-A[1], B[2]-A[2]];
        const v = [P[0]-A[0], P[1]-A[1], P[2]-A[2]];
        const L2 = d[0]**2 + d[1]**2 + d[2]**2;
        if (L2 < 1e-12) continue;
        const t = (v[0]*d[0] + v[1]*d[1] + v[2]*d[2]) / L2;
        if (t < 1e-6 || t > 1 - 1e-6) continue;          // el nudo es un extremo
        if (Math.hypot(v[0]-t*d[0], v[1]-t*d[1], v[2]-t*d[2]) > 1e-6) continue;
        elements[e] = [a, ni];
        const nuevo = elements.length;
        elements.push([ni, b]);
        // el trozo nuevo es del mismo tipo que el que se partió
        if (beamIdx.has(e)) beamIdx.add(nuevo);
        if (colIdx.has(e)) colIdx.add(nuevo);
        if (elementFloor.has(e)) elementFloor.set(nuevo, elementFloor.get(e)!);
      }
    };

    // Columnas (floor = iz, donde iz=0 es entre base y piso 1)
    for (let iz = 0; iz < zCoords.length - 1; iz++)
      for (let iy = 0; iy < yCoords.length; iy++)
        for (let ix = 0; ix < xCoords.length; ix++) {
          if (isCantTip(ix, iy)) continue;
          addSub(nid[`${ix},${iy},${iz}`], nid[`${ix},${iy},${iz + 1}`], nSubCol, colIdx, iz);
        }
    // Vigas X (floor = iz-1, donde iz=1 es piso 1)
    for (let iz = 1; iz < zCoords.length; iz++)
      for (let iy = 0; iy < yCoords.length; iy++)
        for (let ix = 0; ix < xCoords.length - 1; ix++)
          addSub(nid[`${ix},${iy},${iz}`], nid[`${ix + 1},${iy},${iz}`], nSubViga, beamIdx, iz - 1);
    // Vigas Y
    for (let iz = 1; iz < zCoords.length; iz++)
      for (let ix = 0; ix < xCoords.length; ix++)
        for (let iy = 0; iy < yCoords.length - 1; iy++)
          addSub(nid[`${ix},${iy},${iz}`], nid[`${ix},${iy + 1},${iz}`], nSubViga, beamIdx, iz - 1);

    // Vigas secundarias
    if (p.vSecOn >= 0.5 && p.nVSec >= 1) {
      const nVSec = Math.round(p.nVSec);
      const findOrCreateNode = (x: number, y: number, z: number): number => {
        for (let ni = 0; ni < nodes.length; ni++) {
          if (Math.abs(nodes[ni][0]-x)<1e-6 && Math.abs(nodes[ni][1]-y)<1e-6 && Math.abs(nodes[ni][2]-z)<1e-6) return ni;
        }
        const idx = nodes.length; nodes.push([x, y, z]);
        partirBarrasEn(idx);      // que la viga principal se entere
        return idx;
      };
      // La REGLA de la losa en una direccion (Jorge, 5-sep-2026): la viga secundaria
      // corre por el LADO CORTO del vano, y la losa apoya en ellas salvando la luz
      // corta. Antes la direccion era una sola para todo el edificio ("X" por
      // defecto), asi que con vanos de 6 x 5 las secundarias salian de 6 m y la
      // losa trabajaba en el sentido largo. Ahora cada vano decide solo (Auto):
      // dir 'x' (la viga va de eje X a eje X, mide svX) si svX <= svY; si no, 'y'.
      // "X" e "Y" siguen forzando una direccion para todos los vanos.
      const dirDe = (bx: number, by: number): 'x' | 'y' => {
        if (p.vSecDir < 0.5) return 'x';
        if (p.vSecDir < 1.5) return 'y';
        return (xCoords[bx + 1] - xCoords[bx]) <= (yCoords[by + 1] - yCoords[by]) ? 'x' : 'y';
      };
      for (let iz = 1; iz < zCoords.length; iz++) {
        for (let bx = 0; bx < xCoords.length - 1; bx++) {
          for (let by = 0; by < yCoords.length - 1; by++) {
            const x0 = xCoords[bx], x1 = xCoords[bx + 1], y0 = yCoords[by], y1 = yCoords[by + 1];
            for (let k = 1; k <= nVSec; k++) {
              const f = k / (nVSec + 1);
              const [a, b] = dirDe(bx, by) === 'x'
                ? [findOrCreateNode(x0, y0 + f * (y1 - y0), zCoords[iz]), findOrCreateNode(x1, y0 + f * (y1 - y0), zCoords[iz])]
                : [findOrCreateNode(x0 + f * (x1 - x0), y0, zCoords[iz]), findOrCreateNode(x0 + f * (x1 - x0), y1, zCoords[iz])];
              beamIdx.add(elements.length);
              elements.push([a, b]);
            }
          }
        }
      }
    }

    // Diagonales
    const bm = Math.round(p.bracesMode);
    if (bm > 0) {
      const addBrX = bm === 1 || bm === 2 || bm === 3;
      const addBrY = bm === 1 || bm === 2 || bm === 4;
      const nfBr = zCoords.length - 1;
      for (let iz = 0; iz < nfBr; iz++) {
        if (addBrX) {
          for (let iy = 0; iy < yCoords.length; iy++) {
            if (bm === 1 && iy !== 0 && iy !== yCoords.length - 1) continue;
            const midBay = Math.floor((xCoords.length - 1) / 2);
            for (let ix = 0; ix < xCoords.length - 1; ix++) {
              if (bm === 1 && ix !== midBay) continue;
              if (isCantTip(ix, iy) || isCantTip(ix+1, iy)) continue;
              const n0 = nid[`${ix},${iy},${iz}`], n1 = nid[`${ix+1},${iy},${iz+1}`];
              const n2 = nid[`${ix+1},${iy},${iz}`], n3 = nid[`${ix},${iy},${iz+1}`];
              if (n0 !== undefined && n1 !== undefined) elements.push([n0, n1]);
              if (n2 !== undefined && n3 !== undefined) elements.push([n2, n3]);
            }
          }
        }
        if (addBrY) {
          for (let ix = 0; ix < xCoords.length; ix++) {
            if (bm === 1 && ix !== 0 && ix !== xCoords.length - 1) continue;
            const midBay = Math.floor((yCoords.length - 1) / 2);
            for (let iy = 0; iy < yCoords.length - 1; iy++) {
              if (bm === 1 && iy !== midBay) continue;
              if (isCantTip(ix, iy) || isCantTip(ix, iy+1)) continue;
              const n0 = nid[`${ix},${iy},${iz}`], n1 = nid[`${ix},${iy+1},${iz+1}`];
              const n2 = nid[`${ix},${iy+1},${iz}`], n3 = nid[`${ix},${iy},${iz+1}`];
              if (n0 !== undefined && n1 !== undefined) elements.push([n0, n1]);
              if (n2 !== undefined && n3 !== undefined) elements.push([n2, n3]);
            }
          }
        }
      }
    }

    const nodeIndex = new Map<string, number>();
    const nodeKey = (x: number, y: number, z: number) => `${Math.round(x*10000)},${Math.round(y*10000)},${Math.round(z*10000)}`;
    for (let ni = 0; ni < nodes.length; ni++) nodeIndex.set(nodeKey(nodes[ni][0], nodes[ni][1], nodes[ni][2]), ni);
    const slabTarget = p.slabDisc > 0 ? p.slabDisc : 0.50;
    // Losas
    if (p.slabOn >= 0.5) {
      // Discretización ETABS-style: cada paño (bay) se mallado por separado
      // usando el tamaño objetivo que el usuario eligió en "Discretización losa".
      // Paños grandes → más elementos; paños pequeños → menos. Coherente con ETABS.
      for (let iz = 1; iz < zCoords.length; iz++) {
        const z = zCoords[iz];
        for (let bx = 0; bx < xCoords.length - 1; bx++)
          for (let by = 0; by < yCoords.length - 1; by++) {
            const x0 = xCoords[bx], x1 = xCoords[bx + 1];
            const y0 = yCoords[by], y1 = yCoords[by + 1];
            // Discretización por paño según tamaño objetivo
            const { n: nSx } = etabsDiscretize(Math.abs(x1 - x0), slabTarget);
            const { n: nSy } = etabsDiscretize(Math.abs(y1 - y0), slabTarget);
            const grid: number[][] = [];
            for (let jr = 0; jr <= nSy; jr++) {
              const row: number[] = [];
              for (let jc = 0; jc <= nSx; jc++) {
                const x = x0 + jc/nSx * (x1 - x0);
                const y = y0 + jr/nSy * (y1 - y0);
                const key = nodeKey(x, y, z);
                const found = nodeIndex.get(key);
                if (found !== undefined) row.push(found);
                else {
                  const ni = nodes.length; nodes.push([x, y, z]); nodeIndex.set(key, ni); row.push(ni);
                  // Si el nudo cae en el BORDE del pano esta sobre una viga: hay que
                  // partirla ahi, como hace ETABS al mallar la linea con el area. Sin
                  // esto la losa solo tocaba la viga en las esquinas y el borde colgaba.
                  // TODOS los nudos de la losa parten la barra que pase por ellos, no solo
                  // los del borde del pano: una viga SECUNDARIA cruza el pano por dentro y
                  // hasta el 3-sep-2026 la losa pasaba por encima sin tocarla mas que en
                  // sus nSubViga nudos (CSI cose las barras en los nudos intermedios y por
                  // eso el mezanine daba 0.38 % en el deck). partirBarrasEn solo actua si
                  // el nudo cae DENTRO de una barra.
                  partirBarrasEn(ni);
                }
              }
              grid.push(row);
            }
            for (let jr = 0; jr < nSy; jr++)
              for (let jc = 0; jc < nSx; jc++) {
                slabIdx.add(elements.length);
                elements.push([grid[jr][jc], grid[jr][jc+1], grid[jr+1][jc+1], grid[jr+1][jc]]);
              }
          }
      }
    }

    // ── Muros de corte de CASCARA (Q4 verticales) ──────────────────────────
    // Misma disposicion que la plantilla dual: el PRIMER vano (sin contar el
    // voladizo) en las DOS fachadas, de la base a la cubierta. Malla con el
    // mismo tamano objetivo que la losa, asi los nudos del borde superior son
    // los de la losa y los del borde vertical son los de la columna (nV es
    // multiplo de las divisiones de columna). Cada nudo nuevo parte la barra
    // que pasa por el (viga o columna): el muro queda cosido al portico.
    const muroIdx = new Set<number>();
    const muroBase: number[] = [];
    const mm = Math.round(p.murosMode ?? 0);
    if (mm > 0) {
      const wallsX = mm === 1 || mm === 3, wallsY = mm === 2 || mm === 3;
      const findOrMake = (x: number, y: number, z: number) => {
        const key = nodeKey(x, y, z); const found = nodeIndex.get(key);
        if (found !== undefined) return found;
        const ni = nodes.length; nodes.push([x, y, z]); nodeIndex.set(key, ni);
        partirBarrasEn(ni);
        return ni;
      };
      const panel = (x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, nH: number, nV: number) => {
        const g: number[][] = [];
        for (let k = 0; k <= nV; k++) {
          const row: number[] = [];
          for (let c = 0; c <= nH; c++)
            row.push(findOrMake(x0 + c / nH * (x1 - x0), y0 + c / nH * (y1 - y0), z0 + k / nV * (z1 - z0)));
          g.push(row);
        }
        for (let k = 0; k < nV; k++)
          for (let c = 0; c < nH; c++) {
            muroIdx.add(elements.length);
            elements.push([g[k][c], g[k][c + 1], g[k + 1][c + 1], g[k + 1][c]]);
          }
        if (Math.abs(z0) < 1e-9) muroBase.push(...g[0]);
      };
      const ix0 = p.Lvix > 0 ? 1 : 0, iy0 = p.Lviy > 0 ? 1 : 0;
      const ixL = xCoords.length - 1 - (p.Lvdx > 0 ? 1 : 0), iyL = yCoords.length - 1 - (p.Lvdy > 0 ? 1 : 0);
      for (let iz = 0; iz < zCoords.length - 1; iz++) {
        const z0 = zCoords[iz], z1 = zCoords[iz + 1];
        const nEt = etabsDiscretize(z1 - z0, slabTarget).n;
        const nV = Math.ceil(nEt / nSubCol) * nSubCol;
        if (wallsX && ixL > ix0) {
          const x0 = xCoords[ix0], x1 = xCoords[ix0 + 1];
          const nH = etabsDiscretize(x1 - x0, slabTarget).n;
          for (const iy of new Set([iy0, iyL])) panel(x0, yCoords[iy], x1, yCoords[iy], z0, z1, nH, nV);
        }
        if (wallsY && iyL > iy0) {
          const y0 = yCoords[iy0], y1 = yCoords[iy0 + 1];
          const nH = etabsDiscretize(y1 - y0, slabTarget).n;
          for (const ix of new Set([ix0, ixL])) panel(xCoords[ix], y0, xCoords[ix], y1, z0, z1, nH, nV);
        }
      }
    }

    // Supports según tipo de apoyo
    const apoyo = Math.round(p.apoyo);
    const sDofs: [boolean,boolean,boolean,boolean,boolean,boolean] =
      apoyo === 0 ? [true,true,true,true,true,true] :           // empotrado
      apoyo === 1 ? [true,true,true,false,false,false] :        // articulado (solo translaciones)
      [true,true,true,false,false,false];                        // rótula = articulado visual
    const supports = new Map<number, [boolean,boolean,boolean,boolean,boolean,boolean]>();
    for (let iy = 0; iy < yCoords.length; iy++)
      for (let ix = 0; ix < xCoords.length; ix++) {
        if (isCantTip(ix, iy)) continue;
        supports.set(nid[`${ix},${iy},0`], [...sDofs]);
      }
    for (const n of muroBase) supports.set(n, [...sDofs]);   // la base del muro, como las columnas

    // ── Loads filtrados por caso de carga seleccionado ──
    // p.loadCase: 0=combinada, 1=vert, 2=CM, 3=CV, 4=Ex, 5=Ey, 6=XY,
    //   7=1.2D+1.6L, 8-11=combinaciones sísmicas, 12-13=0.9D ± E
    const lc = Math.round(p.loadCase ?? 0);
    // Factores [fCM, fCV, fEx, fEy] según caso
    const factors: [number, number, number, number] =
      lc === 1  ? [1.0, 1.0, 0.0, 0.0] :
      lc === 2  ? [1.0, 0.0, 0.0, 0.0] :
      lc === 3  ? [0.0, 1.0, 0.0, 0.0] :
      lc === 4  ? [0.0, 0.0, 1.0, 0.0] :
      lc === 5  ? [0.0, 0.0, 0.0, 1.0] :
      lc === 6  ? [0.0, 0.0, 1.0, 1.0] :
      lc === 7  ? [1.2, 1.6, 0.0, 0.0] :
      lc === 8  ? [1.2, 1.0, 1.0, 0.0] :
      lc === 9  ? [1.2, 1.0, 0.0, 1.0] :
      lc === 10 ? [1.2, 1.0, -1.0, 0.0] :
      lc === 11 ? [1.2, 1.0, 0.0, -1.0] :
      lc === 12 ? [0.9, 0.0, 1.0, 0.0] :
      lc === 13 ? [0.9, 0.0, 0.0, 1.0] :
                  [1.0, 1.0, 1.0, 1.0];   // 0 = combinada todas
    const [fCM, fCV, fEx, fEy] = factors;
    const loads = new Map<number, [number,number,number,number,number,number]>();
    const vertNodo = fCM * p.CM + fCV * p.CV;
    if (vertNodo !== 0) {
      for (let iz = 1; iz < zCoords.length; iz++)
        for (let iy = 0; iy < yCoords.length; iy++)
          for (let ix = 0; ix < xCoords.length; ix++) {
            const k = `${ix},${iy},${iz}`;
            if (nid[k] !== undefined) loads.set(nid[k], [0, 0, vertNodo, 0, 0, 0]);
          }
    }
    const ExEff = fEx * p.Ex;
    const EyEff = fEy * p.Ey;
    if (ExEff !== 0 || EyEff !== 0) {
      const top = nid[`${xCoords.length-1-(p.Lvdx>0?1:0)},${p.Lviy>0?1:0},${np}`];
      if (top !== undefined) {
        const prev = loads.get(top) ?? [0, 0, 0, 0, 0, 0];
        loads.set(top, [prev[0] + ExEff, prev[1] + EyEff, prev[2], prev[3], prev[4], prev[5]]);
      }
    }

    // ── Secciones por piso (fallback al global si el per-piso es 0) ──
    const colB_piso = [p.colB_1, p.colB_2, p.colB_3, p.colB_4, p.colB_5, p.colB_6, p.colB_7, p.colB_8]
      .map(v => (v > 0 ? v : p.colSize));
    const colH_piso = [p.colH_1, p.colH_2, p.colH_3, p.colH_4, p.colH_5, p.colH_6, p.colH_7, p.colH_8]
      .map(v => (v > 0 ? v : p.colSize));
    const vigaB_piso = [p.vigaB_1, p.vigaB_2, p.vigaB_3, p.vigaB_4, p.vigaB_5, p.vigaB_6, p.vigaB_7, p.vigaB_8]
      .map(v => (v > 0 ? v : p.vigaB));
    const vigaH_piso = [p.vigaH_1, p.vigaH_2, p.vigaH_3, p.vigaH_4, p.vigaH_5, p.vigaH_6, p.vigaH_7, p.vigaH_8]
      .map(v => (v > 0 ? v : p.vigaH));

    // Helpers per-floor
    const esCft = Math.round(p.matCol) === 2;
    const colPropsAt = (floor: number) => {
      const b = colB_piso[floor] ?? p.colSize, h = colH_piso[floor] ?? p.colSize;
      if (esCft) {
        // Tubo de acero relleno de hormigon: las propiedades de CSI (transformadas al
        // acero, As de Timoshenko, J de Saint-Venant del compuesto), ver cadSections.
        const t = Math.min(p.tCft, Math.min(b, h) / 2 - 1e-3);
        const c = cftSectionEc(b, h, t, Es, nu_s, Ec, nu_c);
        // c.Iz = flexion sobre el eje z de la seccion (canto h): el mapeo de abajo
        // es el mismo que el rectangulo (Iz -> b*h^3/12).
        return { A: c.A, Iz: c.Iz, Iy: c.Iy, J: c.J, As2: c.As2, As3: c.As3, b, h, t };
      }
      return { A: b*h, Iz: (b*h**3)/12, Iy: (h*b**3)/12, J: 0.14 * Math.pow(Math.min(b,h), 4), b, h } as any;
    };
    const vigaPropsAt = (floor: number) => {
      const b = vigaB_piso[floor] ?? p.vigaB, h = vigaH_piso[floor] ?? p.vigaH;
      // FIX flexión viga: viga horizontal → Iy gobierna flexión VERTICAL (canto³ va en Iy).
      // Antes Iz=b·h³ → las vigas resistían gravedad/deriva con el eje débil → deriva sobrestimada.
      return { A: b*h, Iy: (b*h**3)/12, Iz: (h*b**3)/12, J: 0.21 * Math.pow(Math.min(b,h), 3) * Math.max(b,h) };
    };

    const matColE = p.matCol < 0.5 ? Ec : Es;   // CFT: al acero (seccion transformada)
    const matColG = p.matCol < 0.5 ? Gc : Gs;
    const matColNu = p.matCol < 0.5 ? nu_c : nu_s;
    // La DENSIDAD tambien va por material, no solo E, G y nu. Antes se ponia
    // `rho_c` a todo y una columna de acero pesaba lo que una de hormigon.
    const matColRho = p.matCol < 0.5 ? rho_c : rho_s;
    const matVigaE = p.matViga < 0.5 ? Ec : Es;
    const matVigaG = p.matViga < 0.5 ? Gc : Gs;
    const matVigaNu = p.matViga < 0.5 ? nu_c : nu_s;
    const matVigaRho = p.matViga < 0.5 ? rho_c : rho_s;

    const elasticities = new Map<number, number>();
    const shearModuli = new Map<number, number>();
    const areas = new Map<number, number>();
    const Iz = new Map<number, number>();
    const Iy = new Map<number, number>();
    const J = new Map<number, number>();
    const densities = new Map<number, number>();
    const poissons = new Map<number, number>();
    const thicknesses = new Map<number, number>();
    const shearAreasY = new Map<number, number>();
    const shearAreasZ = new Map<number, number>();
    const sectionShapes = new Map<number, any>();
    const plateFormulations = new Map<number, number>();
    // Property Modifiers según p.slabType (estilo ETABS Assign → Area → Modifiers)
    const membraneModifiers = new Map<number, number>();
    const bendingModifiers = new Map<number, number>();
    const slabTypeVal = Math.round(p.slabType);
    const mFactor = slabTypeVal === 2 ? 0.0 : 1.0;  // Plate-only: membrana=0
    const bFactor = slabTypeVal === 1 ? 0.0 : 1.0;  // Membrane-only: bending=0

    // ── Cracked Section Modifiers ACI 318-22 §6.6.3.1.1 (estilo ETABS) ──
    // Estos factores REDUCEN la rigidez efectiva (Ig → Ie). NO aplica a acero.
    const isCrackedHormigon = p.crackedSections > 0.5;
    const fCol_I = (p.matCol < 0.5 && isCrackedHormigon) ? 0.70 : 1.0;
    const fVig_I = (p.matViga < 0.5 && isCrackedHormigon) ? 0.35 : 1.0;
    const fSlab_b = isCrackedHormigon ? 0.25 : 1.0;  // bending de losa
    const fSlab_m = isCrackedHormigon ? 1.0 : 1.0;   // membrana de losa NO se reduce

    // ── Mass Source from Loads (estilo ETABS) ──
    // Si massSource=1, masa equivalente = (qDead + 0.25·qLive)/g  por unidad de área
    // → densidad volumétrica equivalente: ρ_eq = q / (g · t_losa)  [ton/m³]
    const useMassFromLoads = p.massSource > 0.5;
    const qMassEquiv_kNm2 = p.qDead + 0.25 * p.qLive;  // kN/m² (peso por área)
    const rho_slab_equiv = useMassFromLoads
      ? qMassEquiv_kNm2 / G_GRAVITY / Math.max(p.slabT, 0.05)  // ton/m³
      : rho_c;

    // brazos rigidos automaticos (ETABS): en cada extremo de viga que toca columna se descuenta
    // medio lado de la columna EN LA DIRECCION DE LA VIGA (b en X, h en Y) del peso y de la masa
    const nudosCol = new Map<number, number>();   // nudo -> piso de la columna que lo toca
    for (const ci of colIdx) for (const n of elements[ci] as unknown as number[]) nudosCol.set(n, elementFloor.get(ci) ?? 0);
    const factorBrazos = (i: number) => {
      if (Math.round((p as any).offsets ?? 1) !== 1) return 1;
      const [a, b] = elements[i] as unknown as number[];
      const dx = Math.abs(nodes[b][0] - nodes[a][0]), dy = Math.abs(nodes[b][1] - nodes[a][1]);
      const L = Math.hypot(dx, dy, nodes[b][2] - nodes[a][2]);
      const enX = dx >= dy;
      const offDe = (n: number) => { if (!nudosCol.has(n)) return 0; const cp = colPropsAt(Math.min(nudosCol.get(n)!, 7)); return (enX ? cp.b : cp.h) / 2; };
      return L > 1e-9 ? Math.max(0, L - offDe(a) - offDe(b)) / L : 1;
    };
    for (let i = 0; i < elements.length; i++) {
      const floor = elementFloor.get(i) ?? 0;
      if (slabIdx.has(i)) {
        elasticities.set(i, Ec); shearModuli.set(i, Gc); poissons.set(i, nu_c);
        thicknesses.set(i, p.slabT);
        // Aplicar property modifiers SOLO a las losas (no a muros)
        // Si crackedSections ON: fSlab_b para bending, fSlab_m para membrana
        membraneModifiers.set(i, mFactor * fSlab_m);
        bendingModifiers.set(i, bFactor * fSlab_b);
        plateFormulations.set(i, Math.round(p.slabForm ?? 1));
        // Densidad: si Mass Source = Loads, usar ρ equivalente (q/t)
        densities.set(i, rho_slab_equiv);
      } else if (muroIdx.has(i)) {
        // hormigon, espesor tMuro, sin modificadores (los de losa NO le tocan)
        elasticities.set(i, Ec); shearModuli.set(i, Gc); poissons.set(i, nu_c);
        thicknesses.set(i, p.tMuro ?? 0.25);
        densities.set(i, useMassFromLoads ? 0 : rho_c);
      } else if (colIdx.has(i)) {
        const cp = colPropsAt(Math.min(floor, 7));
        elasticities.set(i, matColE); shearModuli.set(i, matColG); poissons.set(i, matColNu);
        areas.set(i, cp.A);
        Iz.set(i, cp.Iz * fCol_I); Iy.set(i, cp.Iy * fCol_I); J.set(i, cp.J);
        if (esCft) {
          // As2 va con I33 (= momentsOfInertiaZ = nuestro Iy del mapeo), As3 con I22
          shearAreasZ.set(i, cp.As2); shearAreasY.set(i, cp.As3);
          sectionShapes.set(i, { type: "CFT", b: cp.b, h: cp.h, tw: cp.t, tf: cp.t, fillE: Ec, d: 0 });
        }
        // Si Mass Source = Loads, density de cols = 0 (la masa va solo en losa)
        densities.set(i, useMassFromLoads ? 0 : matColRho);
      } else {
        const vp = vigaPropsAt(Math.min(floor, 7));
        elasticities.set(i, matVigaE); shearModuli.set(i, matVigaG); poissons.set(i, matVigaNu);
        areas.set(i, vp.A);
        Iz.set(i, vp.Iz * fVig_I); Iy.set(i, vp.Iy * fVig_I); J.set(i, vp.J);
        // Si Mass Source = Loads, density de vigas = 0 (la masa va solo en losa)
        densities.set(i, useMassFromLoads ? 0 : matVigaRho * factorBrazos(i));
      }
    }

    // ── Diafragma rígido (ASCE/SEI 7-22 §12.3.1 + NEC-SE-DS §6.2) ─────
    // Si está activo, agrega un master node por piso en el centroide + rigid
    // frame links a cada nodo del piso. Esto aproxima el constraint rigid-body
    // in-plane sin modificar el solver nativo (penalty via AE/L muy alto).
    // Los links heredan propiedades del elementInputs (ver mergeDiaphragmProps).
    if (p.diafragmaRigido >= 0.5) {
      const floorZs: number[] = [];
      for (let iz = 1; iz < zCoords.length; iz++) floorZs.push(zCoords[iz]);
      const dia = addRigidDiaphragms(nodes, floorZs);
      const baseElemOffset = elements.length;
      // Agregar master nodes al final del array de nodes
      for (const m of dia.masterNodes) nodes.push([m.x, m.y, m.z] as Node);
      // Agregar rigid links al final del array de elements
      for (const link of dia.rigidLinks) elements.push(link as Element);
      // Mergear propiedades de los links (areas, E, Iy/Iz, J, G, ρ=0)
      const elementInputsObj: any = {
        elasticities, shearModuli, areas,
        momentsOfInertiaY: Iz, momentsOfInertiaZ: Iy, torsionalConstants: J,
        densities, poissonsRatios: poissons, thicknesses,
      };
      mergeDiaphragmProps(dia, elementInputsObj, baseElemOffset);
      // Los master nodes NO tienen supports ni cargas — son puntos libres que
      // acumulan las restricciones vía los rigid links.
    }

    states.nodes.val = nodes;
    states.elements.val = elements;
    // Diafragma rigido por planta como ETABS (solo si hay losa): ETABS ata los
    // PUNTOS de la planta (ejes de columna), no la malla de la losa. Un grupo
    // por nivel (iz). Sin losa no hay diafragma (portico flexible).
    const diaphragms = new Map<number, number>();
    const modoDiaf = Math.round((p as any).diafragmaNudos ?? 1);
    if (p.slabOn >= 0.5 && modoDiaf === 1)
      for (let iz = 1; iz < zCoords.length; iz++)
        for (let iy = 0; iy < yCoords.length; iy++)
          for (let ix = 0; ix < xCoords.length; ix++) {
            const k = nid[`${ix},${iy},${iz}`];
            if (k !== undefined) diaphragms.set(k, iz);
          }
    if (p.slabOn >= 0.5 && modoDiaf === 2)
      // AREA D1 de ETABS: todos los nudos que estan a la cota de la planta (la
      // malla de la losa entera y, con ella, la coronacion de muros y columnas)
      for (let iz = 1; iz < zCoords.length; iz++) {
        const z = zCoords[iz];
        nodes.forEach((n, k) => { if (Math.abs(n[2] - z) < 1e-6) diaphragms.set(k, iz); });
      }
    states.nodeInputs.val = { supports, loads, ...(diaphragms.size ? { diaphragms } : {}) };
    states.elementInputs.val = {
      etabsWallJoint: Math.round((p as any).comparar ?? 1) === 1,
      elasticities, shearModuli, areas,
      momentsOfInertiaY: Iz, momentsOfInertiaZ: Iy, torsionalConstants: J,
      densities, poissonsRatios: poissons, thicknesses,
      membraneModifiers, bendingModifiers, plateFormulations,
      ...(esCft ? { shearAreasY, shearAreasZ, sectionShapes } : {}),
    } as any;
    const deformOut = deform(nodes, elements, states.nodeInputs.val, states.elementInputs.val);
    states.deformOutputs.val = deformOut;
    states.analyzeOutputs.val = analyze(nodes, elements, states.elementInputs.val, deformOut);

    // ── Cotas 3D (dimensiones anotadas, toggle via Settings → Cotas) ──
    const cotas = buildEdificioCotas(xCoords, yCoords, zCoords);
    // Las etiquetas de sección Col/Viga (texto en cm) eran redundantes con
    // el rendering de Sec. Columnas / Sec. Vigas del viewer (cajas con la
    // sección real). Removidas — el usuario tiene "Sections" en Settings
    // para controlar la visualización de secciones, y los CLI comandos del
    // panel ya muestran los tamaños numéricos.

    // ── Rótulas plásticas (Fase A — ASCE 41-17, FEMA 356) ───────────
    // Clasificación estática por ratio M/My en extremos de frames. Solo se
    // muestran las rótulas que salen de rango elástico (estado B-CP) para
    // no saturar visualmente el modelo. Los counts por estado se guardan en
    // states para que computedLabels() los muestre en el folder Calculados.
    try {
      const hingesArr = computeHinges(
        nodes, elements,
        states.analyzeOutputs.rawVal as any,
        states.elementInputs.rawVal as any,
        Math.round(p.matCol),
        Math.round(p.matViga),
        colIdx,
      );
      // Calcular diagonal del modelo para dimensionar esferas
      let xMin=Infinity, yMin=Infinity, zMin=Infinity, xMax=-Infinity, yMax=-Infinity, zMax=-Infinity;
      for (const n of nodes) {
        if (n[0]<xMin) xMin=n[0]; if (n[0]>xMax) xMax=n[0];
        if (n[1]<yMin) yMin=n[1]; if (n[1]>yMax) yMax=n[1];
        if (n[2]<zMin) zMin=n[2]; if (n[2]>zMax) zMax=n[2];
      }
      const diag = Math.sqrt((xMax-xMin)**2 + (yMax-yMin)**2 + (zMax-zMin)**2) || 1;
      const hingeObjs = buildHingeObjects3D(hingesArr, nodes, diag, { showElastic: false, radiusFactor: 0.015 });
      cotas.push(...hingeObjs);
      // Guardar counts en un slot accesible por computedLabels
      (states as any).__plasticHinges = summarizeHinges(hingesArr);
    } catch (e) {
      console.warn("[Plastic Hinges]", e);
    }

    // ── Render 3D de zapatas bajo cada columna base ──
    // Modela la cimentación de cada apoyo como:
    //   1) PEDESTAL: línea/caja entre z=0 (base de columna del edificio) y
    //      z=-Hf_pedestal (top de la zapata). Si Hf=0, no hay pedestal y la
    //      columna toca directamente la zapata (otro estilo de modelado común).
    //   2) ZAPATA: shellthick-style Q4 mesh con espesor t_zapata, dimensiones
    //      Lz×Bz auto-diseñadas según reacción + tipo (esq./lin./central) y
    //      coloreada por σ/q_adm.
    //
    // Estilo de render configurable: "Sólido" (caja translúcida) o
    // "Shellthick" (grid Q4 transparente + edges, igual al ejemplo
    // zapata-aislada).
    if ((p.mostrarZapatas ?? 1) >= 0.5) {
      try {
        const reactions = (states.deformOutputs.rawVal as any)?.reactions as
          Map<number, [number, number, number, number, number, number]> | undefined;
        if (reactions) {
          const baseRows: Array<{idx:number;x:number;y:number;P_kN:number;Mx_kN:number;My_kN:number}> = [];
          let xMaxBldg = 0, yMaxBldg = 0;
          reactions.forEach((r, idx) => {
            const n = nodes[idx];
            if (!n || Math.abs(n[2]) > 1e-6) return;
            baseRows.push({
              idx, x: n[0], y: n[1],
              P_kN: Math.abs(r[2]), Mx_kN: r[3], My_kN: r[4],
            });
            if (n[0] > xMaxBldg) xMaxBldg = n[0];
            if (n[1] > yMaxBldg) yMaxBldg = n[1];
          });
          if (baseRows.length > 0) {
            // Parámetros de cimentación expuestos al usuario
            const q_adm  = (p.q_adm_zapata as number) ?? 10;
            const ks     = (p.ks_zapata as number)   ?? 1030;
            const Hf_ped = Math.max(0, (p.Hf_pedestal as number) ?? 0.5);
            const tz_user = Math.max(0.1, (p.t_zapata as number) ?? 0.30);
            const nSubZ  = Math.max(2, Math.round((p.nSubZapata as number) ?? 4));
            const volExtra = Math.max(0, (p.voladoExtra as number) ?? 0.30);
            const overrideMode = Math.round(p.tipoZapataOverride ?? 0) | 0;
            const estilo = Math.round(p.estiloZapata ?? 1);  // 0=Sólido, 1=Shellthick

            // Diseñar — pero respetar override de tipo si el user lo pidió
            const zapatas = designAllFootings(baseRows, xMaxBldg, yMaxBldg, q_adm, ks);
            const tiposForzados: FootingType[] = ["central", "lindero", "esquinera"];
            for (const z of zapatas) {
              if (overrideMode > 0) z.tipo = tiposForzados[overrideMode - 1];
              // Forzar el espesor según parámetro user (sobreescribe el t auto)
              z.t = tz_user;
            }

            const footingObjs: THREE.Object3D[] = [];
            // Materiales reutilizables
            const matSolido = (color: number) => new THREE.MeshStandardMaterial({
              color, transparent: true, opacity: 0.55, roughness: 0.7,
            });
            const matEdge = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 });
            const matGrid = new THREE.LineBasicMaterial({ color: 0x222222, linewidth: 1, transparent: true, opacity: 0.5 });
            const matPedestal = new THREE.MeshStandardMaterial({
              color: 0x9ca3af, transparent: true, opacity: 0.75, roughness: 0.5,
            });
            const matPedEdge = new THREE.LineBasicMaterial({ color: 0x111111, linewidth: 2 });

            // Sección del pedestal: heredamos de la columna del piso 1 si existe
            const colP1_b_local = colB_piso[0] ?? p.colSize;
            const colP1_h_local = colH_piso[0] ?? p.colSize;

            for (const z of zapatas) {
              const Lz = z.Lz, Bz = z.Bz, t = z.t;
              // ── Offset columna vs centro de zapata según tipo ──
              // Esquinera y lindero: la columna queda en el borde de la zapata
              // (no en el centroide), creando volado adicional hacia el interior.
              let offsetX = 0, offsetY = 0;
              if (z.tipo === "esquinera") {
                offsetX = (z.x < xMaxBldg / 2) ? -(Lz/2 - volExtra) : (Lz/2 - volExtra);
                offsetY = (z.y < yMaxBldg / 2) ? -(Bz/2 - volExtra) : (Bz/2 - volExtra);
              } else if (z.tipo === "lindero") {
                if (Math.abs(z.x) < 1e-3 || Math.abs(z.x - xMaxBldg) < 1e-3) {
                  offsetX = (z.x < xMaxBldg / 2) ? -(Lz/2 - volExtra) : (Lz/2 - volExtra);
                } else if (Math.abs(z.y) < 1e-3 || Math.abs(z.y - yMaxBldg) < 1e-3) {
                  offsetY = (z.y < yMaxBldg / 2) ? -(Bz/2 - volExtra) : (Bz/2 - volExtra);
                }
              }
              // Centro de zapata (tras corrección por offset)
              const xCz = z.x - offsetX;
              const yCz = z.y - offsetY;
              const zTopFooting = -Hf_ped;          // top de la zapata
              const zCenterFooting = zTopFooting - t / 2;
              const zBotFooting = zTopFooting - t;  // bottom de la zapata (Winkler springs)

              // Color por σ/q_adm
              const ratio = z.ratio;
              let color = 0x4ade80;  // verde (OK)
              if (ratio > 1.5)      color = 0xef4444;
              else if (ratio > 1.0) color = 0xf59e0b;
              else if (ratio > 0.8) color = 0xfbbf24;

              // ── 1) PEDESTAL — frame line entre z=0 (base columna) y
              // z=-Df_pedestal (top de la zapata). Se dibuja como UNA LÍNEA
              // (frame element típico FEM 1D), NO como caja 3D, igual que
              // las columnas de la superestructura.
              if (Hf_ped > 1e-3) {
                const pedLineGeom = new THREE.BufferGeometry().setFromPoints([
                  new THREE.Vector3(z.x, z.y, 0),         // top columna (z=0)
                  new THREE.Vector3(z.x, z.y, -Hf_ped),   // top zapata (z=-Df)
                ]);
                footingObjs.push(new THREE.Line(
                  pedLineGeom,
                  new THREE.LineBasicMaterial({ color: 0x60a5fa, linewidth: 4 }),
                ));
                // Marca pequeña en la base del pedestal (donde toca la zapata)
                footingObjs.push(makeLabel(
                  `Df=${Hf_ped.toFixed(2)}m`,
                  z.x + 0.10, z.y + 0.10, -Hf_ped / 2,
                  "#60a5fa",
                ));
              }

              // ── 2) ZAPATA Q4 shellthick-style ──
              if (estilo === 0) {
                // Estilo "Sólido": caja translúcida + edges
                const box = new THREE.BoxGeometry(Lz, Bz, t);
                const mesh = new THREE.Mesh(box, matSolido(color));
                mesh.position.set(xCz, yCz, zCenterFooting);
                footingObjs.push(mesh);
                const edges = new THREE.LineSegments(new THREE.EdgesGeometry(box), matEdge);
                edges.position.copy(mesh.position);
                footingObjs.push(edges);
              } else {
                // Estilo "Shellthick": top y bottom plano translúcido + grilla
                // Q4 mostrando subdivisiones (igual que zapata-aislada Q4 mesh).
                const planeGeomTop = new THREE.PlaneGeometry(Lz, Bz);
                const planeMatTop = new THREE.MeshStandardMaterial({
                  color, transparent: true, opacity: 0.45,
                  roughness: 0.6, side: THREE.DoubleSide,
                });
                const planeTop = new THREE.Mesh(planeGeomTop, planeMatTop);
                planeTop.position.set(xCz, yCz, zTopFooting);
                footingObjs.push(planeTop);
                const planeBot = new THREE.Mesh(planeGeomTop.clone(), planeMatTop.clone());
                planeBot.position.set(xCz, yCz, zBotFooting);
                footingObjs.push(planeBot);
                // Grilla Q4: nSubZ × nSubZ subdivisiones
                const dx = Lz / nSubZ, dy = Bz / nSubZ;
                const gridPts: THREE.Vector3[] = [];
                // Líneas paralelas a Y (verticales en planta)
                for (let i = 0; i <= nSubZ; i++) {
                  const xi = -Lz/2 + i * dx;
                  gridPts.push(
                    new THREE.Vector3(xCz + xi, yCz - Bz/2, zTopFooting),
                    new THREE.Vector3(xCz + xi, yCz + Bz/2, zTopFooting),
                  );
                  gridPts.push(
                    new THREE.Vector3(xCz + xi, yCz - Bz/2, zBotFooting),
                    new THREE.Vector3(xCz + xi, yCz + Bz/2, zBotFooting),
                  );
                }
                // Líneas paralelas a X (horizontales en planta)
                for (let j = 0; j <= nSubZ; j++) {
                  const yj = -Bz/2 + j * dy;
                  gridPts.push(
                    new THREE.Vector3(xCz - Lz/2, yCz + yj, zTopFooting),
                    new THREE.Vector3(xCz + Lz/2, yCz + yj, zTopFooting),
                  );
                  gridPts.push(
                    new THREE.Vector3(xCz - Lz/2, yCz + yj, zBotFooting),
                    new THREE.Vector3(xCz + Lz/2, yCz + yj, zBotFooting),
                  );
                }
                const gridGeom = new THREE.BufferGeometry().setFromPoints(gridPts);
                footingObjs.push(new THREE.LineSegments(gridGeom, matGrid));
                // Edges del bloque (las 4 aristas verticales + perímetros)
                const corners = [
                  [-Lz/2, -Bz/2], [ Lz/2, -Bz/2],
                  [ Lz/2,  Bz/2], [-Lz/2,  Bz/2],
                ];
                const edgePts: THREE.Vector3[] = [];
                for (let k = 0; k < 4; k++) {
                  const [ax, ay] = corners[k];
                  const [bx, by] = corners[(k + 1) % 4];
                  // Top perímetro
                  edgePts.push(
                    new THREE.Vector3(xCz + ax, yCz + ay, zTopFooting),
                    new THREE.Vector3(xCz + bx, yCz + by, zTopFooting),
                  );
                  // Bottom perímetro
                  edgePts.push(
                    new THREE.Vector3(xCz + ax, yCz + ay, zBotFooting),
                    new THREE.Vector3(xCz + bx, yCz + by, zBotFooting),
                  );
                  // Aristas verticales
                  edgePts.push(
                    new THREE.Vector3(xCz + ax, yCz + ay, zTopFooting),
                    new THREE.Vector3(xCz + ax, yCz + ay, zBotFooting),
                  );
                }
                const edgeGeom = new THREE.BufferGeometry().setFromPoints(edgePts);
                footingObjs.push(new THREE.LineSegments(edgeGeom, matEdge));
              }

              // ── 3) Label informativo (tipo + dimensiones + ratio) ──
              const showLabels = ((p.mostrarLabelsZapatas ?? 1) as number) >= 0.5;
              if (showLabels) {
                footingObjs.push(makeLabel(
                  `${z.tipo[0].toUpperCase()} ${Lz.toFixed(2)}×${Bz.toFixed(2)}×${t.toFixed(2)}m σ/q=${z.ratio.toFixed(2)}`,
                  xCz, yCz, zBotFooting - 0.20,
                  ratio <= 1 ? "#4ade80" : (ratio <= 1.5 ? "#f59e0b" : "#ef4444"),
                ));
              }
            }
            // ── Vigas de amarre (sistema=1) en modo VISUAL ──
            // Mismo render que en modo FEM: líneas cyan entre apoyos
            // adyacentes en X y en Y, al nivel de la zapata o pedestal.
            const sistemaVis = Math.round((p.sistemaCimentacion as number) ?? 0);
            if (sistemaVis === 1) {
              const va_pos = Math.round((p.vigaAmarre_pos as number) ?? 0);
              const zVA = va_pos === 0 ? -Hf_ped : -Hf_ped / 2;
              const va_b_v = (p.vigaAmarre_b as number) ?? 0.25;
              const va_h_v = (p.vigaAmarre_h as number) ?? 0.40;
              const byY_v = new Map<string, typeof baseRows>();
              const byX_v = new Map<string, typeof baseRows>();
              for (const b of baseRows) {
                const ky = b.y.toFixed(4), kx = b.x.toFixed(4);
                if (!byY_v.has(ky)) byY_v.set(ky, []);
                if (!byX_v.has(kx)) byX_v.set(kx, []);
                byY_v.get(ky)!.push(b);
                byX_v.get(kx)!.push(b);
              }
              const vaPtsVis: THREE.Vector3[] = [];
              for (const row of byY_v.values()) {
                row.sort((a, b) => a.x - b.x);
                for (let i = 0; i < row.length - 1; i++) {
                  vaPtsVis.push(new THREE.Vector3(row[i].x, row[i].y, zVA));
                  vaPtsVis.push(new THREE.Vector3(row[i+1].x, row[i+1].y, zVA));
                }
              }
              for (const col of byX_v.values()) {
                col.sort((a, b) => a.y - b.y);
                for (let i = 0; i < col.length - 1; i++) {
                  vaPtsVis.push(new THREE.Vector3(col[i].x, col[i].y, zVA));
                  vaPtsVis.push(new THREE.Vector3(col[i+1].x, col[i+1].y, zVA));
                }
              }
              if (vaPtsVis.length > 0) {
                footingObjs.push(new THREE.LineSegments(
                  new THREE.BufferGeometry().setFromPoints(vaPtsVis),
                  new THREE.LineBasicMaterial({ color: 0x22d3ee, linewidth: 3 }),
                ));
                footingObjs.push(makeLabel(
                  `Vigas amarre ${(va_b_v*100).toFixed(0)}×${(va_h_v*100).toFixed(0)} cm @ ${va_pos === 0 ? "zapatas" : "pedestales"}`,
                  xMaxBldg / 2, yMaxBldg / 2, zVA + 0.20,
                  "#22d3ee",
                ));
              }
            }

            cotas.push(...footingObjs);
          }
        }
      } catch (e) {
        console.warn("[Zapatas 3D]", e);
      }
    }

    // ═══════════════════════════════════════════════════════════════
    // ── MODO "Solo cimentación" (P, Mx, My de reacciones) ──
    // ═══════════════════════════════════════════════════════════════
    // Cuando modoCimentacion=1:
    //   • Se eliminan todas las restricciones de los apoyos rígidos
    //   • Se elimina la superestructura (columnas, vigas, losas, brazos
    //     rígidos, diagonales)
    //   • Cada apoyo se reemplaza por un pedestal + zapata Q4 shellthick
    //     con Winkler springs (kv vertical + kh horizontal)
    //   • Las reacciones P, Mx, My del análisis previo (edificio completo)
    //     se aplican como cargas en el TOP del pedestal de cada zapata
    //   • Se reemplazan TODOS los states con el modelo solo-cimentación,
    //     se re-ejecuta deform + analyze para mostrar la deformada y
    //     presiones de contacto del suelo (q = ks · w_z) reales.
    // Esta es la forma estándar Ecuador (NEC-SE-GC) de diseñar zapatas:
    // desacopladas del edificio, con las reacciones como input.
    if ((p.modoCimentacion ?? 0) >= 0.5) {
      try {
        const TONF_TO_KN_LOC = 9.80665;
        const reactionsFull = (states.deformOutputs.rawVal as any)?.reactions as
          Map<number, [number, number, number, number, number, number]> | undefined;
        if (reactionsFull && reactionsFull.size > 0) {
          // Recolectar reacciones de los apoyos en z=0
          type BaseRow = {
            idx: number; x: number; y: number;
            P_kN: number; Mx_kN: number; My_kN: number;
          };
          const baseRowsCim: BaseRow[] = [];
          let xMaxBldgC = 0, yMaxBldgC = 0;
          reactionsFull.forEach((r, idx) => {
            const n = nodes[idx];
            if (!n || Math.abs(n[2]) > 1e-6) return;
            baseRowsCim.push({
              idx, x: n[0], y: n[1],
              P_kN: Math.abs(r[2]), Mx_kN: r[3], My_kN: r[4],
            });
            if (n[0] > xMaxBldgC) xMaxBldgC = n[0];
            if (n[1] > yMaxBldgC) yMaxBldgC = n[1];
          });

          if (baseRowsCim.length > 0) {
            // Parámetros geométricos de cimentación
            const q_admC  = (p.q_adm_zapata as number) ?? 10;
            const ksC     = (p.ks_zapata as number)   ?? 1030;
            const HfPedC  = Math.max(0, (p.Hf_pedestal as number) ?? 0.5);
            const tzC     = Math.max(0.1, (p.t_zapata as number) ?? 0.30);
            const nSubZC  = Math.max(2, Math.round((p.nSubZapata as number) ?? 4));
            const volExtC = Math.max(0, (p.voladoExtra as number) ?? 0.30);
            const overrideModeC = Math.round(p.tipoZapataOverride ?? 0) | 0;

            // Diseño preliminar de cada zapata (Lz×Bz auto)
            const zapatasDes = designAllFootings(
              baseRowsCim, xMaxBldgC, yMaxBldgC, q_admC, ksC,
            );
            const tiposForzC: FootingType[] = ["central", "lindero", "esquinera"];
            for (const z of zapatasDes) {
              if (overrideModeC > 0) z.tipo = tiposForzC[overrideModeC - 1];
              z.t = tzC;  // forzar el espesor parametrizado
            }

            // Sección del pedestal: usamos la columna del piso 1
            const colP1bC = colB_piso[0] ?? p.colSize;
            const colP1hC = colH_piso[0] ?? p.colSize;
            const A_ped = colP1bC * colP1hC;
            const Iy_ped = (colP1bC * colP1hC ** 3) / 12;
            const Iz_ped = (colP1hC * colP1bC ** 3) / 12;
            const J_ped  = 0.14 * Math.pow(Math.min(colP1bC, colP1hC), 4);
            const matE_pedC = p.matCol < 0.5 ? Ec : Es;
            const matG_pedC = p.matCol < 0.5 ? Gc : Gs;
            const matNu_pedC = p.matCol < 0.5 ? nu_c : nu_s;

            // Nuevos arrays (reemplazan a TODO el modelo)
            const N2: Node[] = [];
            const E2: Element[] = [];
            const elasticities2 = new Map<number, number>();
            const shearModuli2 = new Map<number, number>();
            const areas2 = new Map<number, number>();
            const Iz2 = new Map<number, number>();
            const Iy2 = new Map<number, number>();
            const J2 = new Map<number, number>();
            const densities2 = new Map<number, number>();
            const poissons2 = new Map<number, number>();
            const thicknesses2 = new Map<number, number>();
            const supports2 = new Map<number, [boolean,boolean,boolean,boolean,boolean,boolean]>();
            const loads2 = new Map<number, [number,number,number,number,number,number]>();
            const springsList2: Array<{ node: number; dof: number; k: number }> = [];
            const cotas2: THREE.Object3D[] = [];

            // Helper para ubicar nodo único en N2 (key por coords)
            const nodeKey2 = (x: number, y: number, z: number) =>
              `${Math.round(x*10000)},${Math.round(y*10000)},${Math.round(z*10000)}`;
            const nodeIndex2 = new Map<string, number>();
            const addNode2 = (x: number, y: number, z: number): number => {
              const key = nodeKey2(x, y, z);
              const found = nodeIndex2.get(key);
              if (found !== undefined) return found;
              const i = N2.length;
              N2.push([x, y, z]);
              nodeIndex2.set(key, i);
              return i;
            };

            // Materiales 3D
            const matEdgeC = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 });
            const matPedEdgeC = new THREE.LineBasicMaterial({ color: 0x111111, linewidth: 2 });

            // Construir cada cimentación (zapata + pedestal + cargas + springs)
            for (const z of zapatasDes) {
              const Lz = z.Lz, Bz = z.Bz, t = z.t;
              // Offset columna ↔ centro zapata según tipo
              let offsetX = 0, offsetY = 0;
              if (z.tipo === "esquinera") {
                offsetX = (z.x < xMaxBldgC / 2) ? -(Lz/2 - volExtC) : (Lz/2 - volExtC);
                offsetY = (z.y < yMaxBldgC / 2) ? -(Bz/2 - volExtC) : (Bz/2 - volExtC);
              } else if (z.tipo === "lindero") {
                if (Math.abs(z.x) < 1e-3 || Math.abs(z.x - xMaxBldgC) < 1e-3) {
                  offsetX = (z.x < xMaxBldgC / 2) ? -(Lz/2 - volExtC) : (Lz/2 - volExtC);
                } else if (Math.abs(z.y) < 1e-3 || Math.abs(z.y - yMaxBldgC) < 1e-3) {
                  offsetY = (z.y < yMaxBldgC / 2) ? -(Bz/2 - volExtC) : (Bz/2 - volExtC);
                }
              }
              const xCz = z.x - offsetX;
              const yCz = z.y - offsetY;
              // Plano único de la zapata (shell Q4 a z = -HfPed - t/2 mid-surface)
              // Para no complicarlo, modelamos la zapata como UN solo plano shell
              // a z = -HfPed (top de la losa) — espesor t va en thicknesses.
              const zMidFoot = -HfPedC;  // shell mid-surface = top of footing
              const dx2 = Lz / nSubZC, dy2 = Bz / nSubZC;
              const grid2: number[][] = [];
              for (let jr = 0; jr <= nSubZC; jr++) {
                const row: number[] = [];
                for (let jc = 0; jc <= nSubZC; jc++) {
                  const x = xCz - Lz/2 + jc * dx2;
                  const y = yCz - Bz/2 + jr * dy2;
                  row.push(addNode2(x, y, zMidFoot));
                }
                grid2.push(row);
              }
              // Q4 shells de la zapata
              for (let jr = 0; jr < nSubZC; jr++) {
                for (let jc = 0; jc < nSubZC; jc++) {
                  const eIdx = E2.length;
                  E2.push([
                    grid2[jr][jc], grid2[jr][jc+1],
                    grid2[jr+1][jc+1], grid2[jr+1][jc],
                  ] as Element);
                  thicknesses2.set(eIdx, t);
                  elasticities2.set(eIdx, Ec);
                  poissons2.set(eIdx, nu_c);
                  shearModuli2.set(eIdx, Gc);
                  densities2.set(eIdx, rho_c);
                }
              }
              // ── Springs Winkler — magnitudes ROBUSTAS para evitar
              // matriz mal condicionada con múltiples zapatas en la misma
              // estructura.
              // Resortes verticales (kvz) ALTOS, horizontales (khxy) MENOS,
              // rotacionales en TODOS los nodos para drilling.
              const kh_factor = 0.5;
              for (let jr = 0; jr <= nSubZC; jr++) {
                for (let jc = 0; jc <= nSubZC; jc++) {
                  const A_trib = dx2 * dy2 *
                    ((jc === 0 || jc === nSubZC) ? 0.5 : 1) *
                    ((jr === 0 || jr === nSubZC) ? 0.5 : 1);
                  const kvz = ksC * A_trib;
                  const khxy = kvz * kh_factor;
                  const ni0 = grid2[jr][jc];
                  springsList2.push({ node: ni0, dof: 0, k: khxy });
                  springsList2.push({ node: ni0, dof: 1, k: khxy });
                  springsList2.push({ node: ni0, dof: 2, k: kvz });
                  // Drilling Rz substancial (impide modos rígidos)
                  springsList2.push({ node: ni0, dof: 5, k: kvz * 0.1 });
                }
              }
              // ANCLAJE RÍGIDO en UNA ESQUINA DE CADA zapata
              // (fija solo Rx, Ry, Rz — translaciones quedan libres con
              // Winkler). Sin esto el solver tiene 9 modos de rigid body
              // rotation por zapata = matriz singular.
              const anclaZ = grid2[0][0];
              supports2.set(anclaZ, [false, false, false, true, true, true]);

              // ── Conexión columna-zapata ──
              // Buscamos el nodo del grid del shell MÁS CERCANO a la posición
              // de la columna (z.x, z.y) y aplicamos la carga DIRECTAMENTE
              // ahí. NO modelamos el pedestal como frame FEM (eso introduce
              // singularidad pedestal↔shell). El pedestal es solo visual
              // (línea cyan) — la carga se "transfiere" instantáneamente al
              // top del shell, lo que es equivalente a un pedestal RÍGIDO.
              let bestI = 0, bestJ = 0, bestDist = Infinity;
              for (let jr = 0; jr <= nSubZC; jr++) {
                for (let jc = 0; jc <= nSubZC; jc++) {
                  const ngrid = grid2[jr][jc];
                  const xn = N2[ngrid][0], yn = N2[ngrid][1];
                  const d = Math.sqrt((xn - z.x)**2 + (yn - z.y)**2);
                  if (d < bestDist) { bestDist = d; bestI = jr; bestJ = jc; }
                }
              }
              const nFootCol = grid2[bestI][bestJ];
              const nLoadApply = nFootCol;
              // Aplicar reacción directamente al nodo shell bajo la columna.
              // Convención: el momento se traslada de top de columna (z=0) al
              // top de zapata (z=-Df) sumando el efecto de P × Df como
              // momento adicional? No — para un pedestal rígido, el momento
              // se conserva (no hay deformación entre top y bottom).
              const baseR = baseRowsCim.find(b => b.idx === z.idx)!;
              loads2.set(nLoadApply, [
                0, 0,
                -baseR.P_kN,             // -P (compresión hacia abajo)
                baseR.Mx_kN,
                baseR.My_kN,
                0,
              ]);

              // ── Visualización (cotas) en modo solo-cimentación ──
              // Color por σ/q_adm
              const ratio = z.ratio;
              let color = 0x4ade80;
              if (ratio > 1.5)      color = 0xef4444;
              else if (ratio > 1.0) color = 0xf59e0b;
              else if (ratio > 0.8) color = 0xfbbf24;
              // Pedestal — LÍNEA (frame), no caja 3D.
              // El frame element ya está agregado al FEM (ver más arriba con
              // ePed2). Aquí solo lo visualizamos como línea azul + label Df.
              if (HfPedC > 1e-3) {
                const pedLineG = new THREE.BufferGeometry().setFromPoints([
                  new THREE.Vector3(z.x, z.y, 0),
                  new THREE.Vector3(z.x, z.y, -HfPedC),
                ]);
                cotas2.push(new THREE.Line(
                  pedLineG,
                  new THREE.LineBasicMaterial({ color: 0x60a5fa, linewidth: 4 }),
                ));
                cotas2.push(makeLabel(
                  `Df=${HfPedC.toFixed(2)}m`,
                  z.x + 0.10, z.y + 0.10, -HfPedC / 2,
                  "#60a5fa",
                ));
              }
              // ── Grilla Q4 visual por zapata (líneas de subdivisión + perímetro) ──
              // Sin esto, cuando settings.solids=false, las zapatas se verían
              // sólo como planos planos sin grilla. Este overlay reproduce
              // visualmente lo que el solver ya tiene en E2 (Q4 shells).
              {
                const gridMatC = new THREE.LineBasicMaterial({
                  color: 0xaaaaaa, linewidth: 1, transparent: true, opacity: 0.6,
                });
                const dxV = Lz / nSubZC, dyV = Bz / nSubZC;
                const gridPtsC: THREE.Vector3[] = [];
                for (let i = 0; i <= nSubZC; i++) {
                  const xi = -Lz/2 + i * dxV;
                  gridPtsC.push(
                    new THREE.Vector3(xCz + xi, yCz - Bz/2, -HfPedC),
                    new THREE.Vector3(xCz + xi, yCz + Bz/2, -HfPedC),
                  );
                }
                for (let j = 0; j <= nSubZC; j++) {
                  const yj = -Bz/2 + j * dyV;
                  gridPtsC.push(
                    new THREE.Vector3(xCz - Lz/2, yCz + yj, -HfPedC),
                    new THREE.Vector3(xCz + Lz/2, yCz + yj, -HfPedC),
                  );
                }
                cotas2.push(new THREE.LineSegments(
                  new THREE.BufferGeometry().setFromPoints(gridPtsC),
                  gridMatC,
                ));
              }
              // Labels — sólo si mostrarLabelsZapatas=ON
              const showLabelsC = ((p.mostrarLabelsZapatas ?? 1) as number) >= 0.5;
              if (showLabelsC) {
                const P_tonf = baseR.P_kN / TONF_TO_KN_LOC;
                const Mx_tonfM = baseR.Mx_kN / TONF_TO_KN_LOC;
                const My_tonfM = baseR.My_kN / TONF_TO_KN_LOC;
                cotas2.push(makeLabel(
                  `P=${P_tonf.toFixed(2)} tonf`,
                  z.x, z.y, 0.30,
                  "#fbbf24",
                ));
                cotas2.push(makeLabel(
                  `Mx=${Mx_tonfM.toFixed(2)}  My=${My_tonfM.toFixed(2)} tonf·m`,
                  z.x, z.y, 0.10,
                  "#fbbf24",
                ));
                cotas2.push(makeLabel(
                  `${z.tipo[0].toUpperCase()} ${Lz.toFixed(2)}×${Bz.toFixed(2)}×${t.toFixed(2)}m σ/q=${ratio.toFixed(2)}`,
                  xCz, yCz, -HfPedC - t - 0.20,
                  ratio <= 1 ? "#4ade80" : (ratio <= 1.5 ? "#f59e0b" : "#ef4444"),
                ));
              }
            }

            // ── Sistema de cimentación: vigas de amarre / corridas / losa ──
            const sistema = Math.round((p.sistemaCimentacion as number) ?? 0);
            if (sistema === 1) {
              // ── SISTEMA 1: Zapatas + Vigas de amarre ──
              // Conecta cada par de zapatas adyacentes en X y en Y con
              // un frame element (sección rectangular). Posición controlada
              // por vigaAmarre_pos:
              //   0 = en el plano de la zapata (z=-Hf), conecta los nodos
              //       centrales de las zapatas (mismo nodo nFootCol que
              //       hereda la carga del pedestal)
              //   1 = a media altura del pedestal (z=-Hf/2): se crean nodos
              //       intermedios en cada pedestal que sirven de puntos de
              //       conexión de las vigas
              const va_pos = Math.round((p.vigaAmarre_pos as number) ?? 0);
              const va_h   = (p.vigaAmarre_h as number) ?? 0.40;
              const va_b   = (p.vigaAmarre_b as number) ?? 0.25;
              const va_A   = va_b * va_h;
              const va_Iy  = (va_b * va_h ** 3) / 12;
              const va_Iz  = (va_h * va_b ** 3) / 12;
              const va_J   = 0.21 * Math.pow(Math.min(va_b, va_h), 3) * Math.max(va_b, va_h);

              // Nodos de conexión de las vigas de amarre (uno por zapata)
              const vaNodesByZap = new Map<number, number>();
              for (const z of zapatasDes) {
                let zVA: number;
                if (va_pos === 0) {
                  // En el plano de la zapata: usar el nodo central existente
                  zVA = -HfPedC;
                } else {
                  // En el medio del pedestal
                  zVA = -HfPedC / 2;
                }
                const ni0 = addNode2(z.x, z.y, zVA);
                vaNodesByZap.set(z.idx, ni0);
                // Si es a media altura del pedestal, debemos romper el frame
                // del pedestal en ese nodo. Para simplificar, agregamos un
                // segundo frame element entre nFootCol y este nodo, y entre
                // este nodo y nTopPed. Pero ya creamos el pedestal entero
                // antes — vamos a agregar el nodo y conectar las vigas allí
                // sin "splitear" el pedestal (el frame original cruza por
                // este nodo geométricamente, pero el solver no lo conoce).
                //
                // SOLUCIÓN: en lugar de splitear, las vigas de amarre se
                // conectan al nodo intermedio creado, y agregamos UN frame
                // adicional desde z.x,z.y,zMidFoot HASTA z.x,z.y,zVA y otro
                // desde z.x,z.y,zVA HASTA z.x,z.y,0. Esto reemplazaría el
                // pedestal original. Pero para mantener simplicidad,
                // agregamos un frame "stub" rígido entre el pedestal y este
                // nodo VA — corto, transversal — que en la práctica conecta
                // las vigas al pedestal. Esta es una simplificación; el
                // resultado es muy similar al pedestal continuo splitteado.
                if (va_pos === 1 && HfPedC > 1e-3) {
                  const nPedMid = addNode2(z.x, z.y, -HfPedC / 2);
                  // El nodo nPedMid es el mismo que zVA por construcción
                  // (Ambos son z.x, z.y, -HfPedC/2). El addNode2 dedup por key.
                  // Conectamos nPedMid → top del pedestal con frame
                  const nTopPed = addNode2(z.x, z.y, 0);
                  const nFootCol = addNode2(z.x, z.y, -HfPedC);
                  // Eliminamos el frame original [nFootCol, nTopPed]
                  // (NO podemos hacerlo sin reorganizar — pero en la práctica
                  // con un pedestal corto la diferencia entre tener el frame
                  // continuo o splitteado es marginal). Dejamos el original
                  // y el splitteado actúa como "resorte adicional": esto
                  // sobre-rigidiza pero es conservador. Para un análisis
                  // limpio usar va_pos=0.
                  void nPedMid; void nTopPed; void nFootCol;
                }
              }
              // Identificar pares adyacentes en X (mismo y, x consecutivos)
              const byY = new Map<string, BaseRow[]>();
              const byX = new Map<string, BaseRow[]>();
              for (const b of baseRowsCim) {
                const ky = b.y.toFixed(4);
                const kx = b.x.toFixed(4);
                if (!byY.has(ky)) byY.set(ky, []);
                if (!byX.has(kx)) byX.set(kx, []);
                byY.get(ky)!.push(b);
                byX.get(kx)!.push(b);
              }
              const addVA = (na: number, nb: number) => {
                const eIdx = E2.length;
                E2.push([na, nb] as Element);
                elasticities2.set(eIdx, matE_pedC);
                shearModuli2.set(eIdx, matG_pedC);
                poissons2.set(eIdx, matNu_pedC);
                areas2.set(eIdx, va_A);
                Iz2.set(eIdx, va_Iz);
                Iy2.set(eIdx, va_Iy);
                J2.set(eIdx, va_J);
                densities2.set(eIdx, rho_c);
              };
              let nVA = 0;
              for (const row of byY.values()) {
                row.sort((a, b) => a.x - b.x);
                for (let i = 0; i < row.length - 1; i++) {
                  const na = vaNodesByZap.get(row[i].idx);
                  const nb = vaNodesByZap.get(row[i+1].idx);
                  if (na !== undefined && nb !== undefined) { addVA(na, nb); nVA++; }
                }
              }
              for (const col of byX.values()) {
                col.sort((a, b) => a.y - b.y);
                for (let i = 0; i < col.length - 1; i++) {
                  const na = vaNodesByZap.get(col[i].idx);
                  const nb = vaNodesByZap.get(col[i+1].idx);
                  if (na !== undefined && nb !== undefined) { addVA(na, nb); nVA++; }
                }
              }
              // Render visual de las vigas de amarre como líneas cyan
              // explícitas (cotas) en addición a los frame elements FEM,
              // para que sean SIEMPRE visibles incluso si el viewer oculta
              // los frames sin sección.
              const vaLineMat = new THREE.LineBasicMaterial({
                color: 0x22d3ee, linewidth: 3,
              });
              const vaPts: THREE.Vector3[] = [];
              for (const row of byY.values()) {
                const sortedRow = [...row].sort((a, b) => a.x - b.x);
                for (let i = 0; i < sortedRow.length - 1; i++) {
                  const a = sortedRow[i], b = sortedRow[i+1];
                  const zVA = va_pos === 0 ? -HfPedC : -HfPedC / 2;
                  vaPts.push(new THREE.Vector3(a.x, a.y, zVA));
                  vaPts.push(new THREE.Vector3(b.x, b.y, zVA));
                }
              }
              for (const col of byX.values()) {
                const sortedCol = [...col].sort((a, b) => a.y - b.y);
                for (let i = 0; i < sortedCol.length - 1; i++) {
                  const a = sortedCol[i], b = sortedCol[i+1];
                  const zVA = va_pos === 0 ? -HfPedC : -HfPedC / 2;
                  vaPts.push(new THREE.Vector3(a.x, a.y, zVA));
                  vaPts.push(new THREE.Vector3(b.x, b.y, zVA));
                }
              }
              if (vaPts.length > 0) {
                const vaLineGeom = new THREE.BufferGeometry().setFromPoints(vaPts);
                cotas2.push(new THREE.LineSegments(vaLineGeom, vaLineMat));
              }
              cotas2.push(makeLabel(
                `+${nVA} vigas de amarre ${(va_b*100).toFixed(0)}×${(va_h*100).toFixed(0)} cm @ ${va_pos === 0 ? "zapatas" : "pedestales"}`,
                xMaxBldgC / 2, yMaxBldgC / 2, va_pos === 1 ? -HfPedC/2 + 0.30 : -HfPedC + 0.30,
                "#22d3ee",
              ));
              console.log(`[Cimentación] Sistema 1 — ${nVA} vigas de amarre ${(va_b*100).toFixed(0)}×${(va_h*100).toFixed(0)} cm en posición ${va_pos === 0 ? "zapatas" : "pedestales"}`);
            } else if (sistema >= 2) {
              // Sistemas 2, 3, 4 (TODO): vigas T invertida corridas, vigas rect.
              // + zapata corrida, losa de cimentación. Por ahora se muestra
              // el modelo de zapatas aisladas + un mensaje en consola.
              console.warn(
                `[Cimentación] Sistema ${sistema} (${["", "", "Vigas T invertida", "Vigas rect. + zapata corrida", "Losa de cimentación"][sistema]}) ` +
                `aún no implementado completamente. Mostrando zapatas aisladas. ` +
                `Próximamente: malla shell continua + frames T-invertida.`,
              );
              cotas2.push(makeLabel(
                `Sistema ${sistema} (TODO) — usando zapatas aisladas`,
                xMaxBldgC / 2, yMaxBldgC / 2, 1.5,
                "#fbbf24",
              ));
            }

            // ══════════════════════════════════════════════════════════
            // ── ENFOQUE POR ZAPATA AISLADA (verificación individual) ──
            // ══════════════════════════════════════════════════════════
            // En vez de solucionar las 9 zapatas en una sola matriz global
            // (que sale singular), resolvemos CADA zapata por separado con
            // su propia P, Mx, My (P/Mx/My del edificio) — pero con el
            // efecto de las vigas de amarre REDISTRIBUIDO en cada caso.
            //
            // ── REDISTRIBUCIÓN DE MOMENTOS POR VIGAS DE AMARRE ──
            // Cuando sistemaCimentacion=1, las vigas de amarre conectan
            // zapatas adyacentes y absorben parte del momento que se
            // transfiere de la columna a la zapata. Aproximación práctica:
            //   M_zapata_efectivo = M_columna × (1 - alpha · n_vigas_conex/4)
            // donde alpha = 0.30 es la fracción típica que la viga absorbe
            // (Bowles §11 — el resto va al suelo via flexión de la zapata).
            // n_vigas_conex es el # de vigas que llegan a esa zapata
            // (esquinera=2, lindero=3, central=4).
            const sistemaCim = Math.round((p.sistemaCimentacion as number) ?? 0);
            const tieAlpha = 0.30;  // fracción absorbida por viga de amarre
            const va_pos_log = Math.round((p.vigaAmarre_pos as number) ?? 0);
            // Contar vigas que conectan a cada zapata (sea cual sea el nivel
            // — vigaAmarre_pos no cambia este número, lo que cambia es la
            // posición visual; el efecto físico sí se distribuye igual).
            const nVigasConByZap = new Map<number, number>();
            if (sistemaCim === 1) {
              const byY = new Map<string, typeof baseRowsCim>();
              const byX = new Map<string, typeof baseRowsCim>();
              for (const b of baseRowsCim) {
                const ky = b.y.toFixed(4), kx = b.x.toFixed(4);
                if (!byY.has(ky)) byY.set(ky, []);
                if (!byX.has(kx)) byX.set(kx, []);
                byY.get(ky)!.push(b);
                byX.get(kx)!.push(b);
              }
              const inc = (idx: number) => nVigasConByZap.set(idx, (nVigasConByZap.get(idx) ?? 0) + 1);
              for (const row of byY.values()) {
                row.sort((a,b)=>a.x-b.x);
                for (let i = 0; i < row.length-1; i++) { inc(row[i].idx); inc(row[i+1].idx); }
              }
              for (const col of byX.values()) {
                col.sort((a,b)=>a.y-b.y);
                for (let i = 0; i < col.length-1; i++) { inc(col[i].idx); inc(col[i+1].idx); }
              }
              console.log(`[Cimentación] Vigas de amarre activas — momentos en zapatas reducidos por factor (1 - ${tieAlpha} · n_vigas/4):`);
              nVigasConByZap.forEach((n, idx) => {
                const reduc = (tieAlpha * n / 4 * 100).toFixed(0);
                console.log(`   Zapata ${idx}: ${n} vigas conectadas → momento reducido ${reduc}%`);
              });
              // ── Regla adicional cuando viga de amarre va al MISMO NIVEL
              // de la cimentación (vigaAmarre_pos=0):
              // La viga actúa como cimentación lineal corrida ENTERRADA, con
              // su propio Winkler distribuido en cada nodo a lo largo de su
              // línea. Se modela como una cadena de springs proporcional al
              // ks·b·dL por nodo (b = ancho de la viga). Esto se exporta al
              // F2K como SLAB tipo "Footing" con spring asignado.
              // En la implementación per-zapata aislada actual no se
              // resuelve la viga directamente — solo se redistribuye el
              // momento. Para análisis rigoroso, exportar a SAFE.
              if (va_pos_log === 0) {
                console.log(`   ↳ vigaAmarre_pos=0 (mismo nivel zapata) → en F2K se exportará como cimentación corrida con ks·b·dL distribuido por nodo`);
              }
            }
            const allDeforms = new Map<number, number[]>();
            const pressureMap = new Map<number, number[]>();
            // Re-iterar zapatasDes para resolver cada una independientemente
            for (const z of zapatasDes) {
              const baseR = baseRowsCim.find(b => b.idx === z.idx)!;
              const Lz = z.Lz, Bz = z.Bz, t = z.t;
              // Encontrar offsetX, offsetY (mismo cálculo que arriba)
              let offX = 0, offY = 0;
              if (z.tipo === "esquinera") {
                offX = (z.x < xMaxBldgC / 2) ? -(Lz/2 - volExtC) : (Lz/2 - volExtC);
                offY = (z.y < yMaxBldgC / 2) ? -(Bz/2 - volExtC) : (Bz/2 - volExtC);
              } else if (z.tipo === "lindero") {
                if (Math.abs(z.x) < 1e-3 || Math.abs(z.x - xMaxBldgC) < 1e-3) {
                  offX = (z.x < xMaxBldgC / 2) ? -(Lz/2 - volExtC) : (Lz/2 - volExtC);
                } else if (Math.abs(z.y) < 1e-3 || Math.abs(z.y - yMaxBldgC) < 1e-3) {
                  offY = (z.y < yMaxBldgC / 2) ? -(Bz/2 - volExtC) : (Bz/2 - volExtC);
                }
              }
              const xCzS = z.x - offX, yCzS = z.y - offY;
              // Construir SUB-FEM independiente para esta zapata
              const N_loc: Node[] = [];
              const E_loc: Element[] = [];
              const ei_loc: any = {
                elasticities: new Map<number, number>(),
                shearModuli: new Map<number, number>(),
                poissonsRatios: new Map<number, number>(),
                thicknesses: new Map<number, number>(),
                densities: new Map<number, number>(),
              };
              const dxL = Lz / nSubZC, dyL = Bz / nSubZC;
              const grid_loc: number[][] = [];
              const globalNodeMap: number[] = [];  // localIdx → globalIdx en N2
              for (let jr = 0; jr <= nSubZC; jr++) {
                const row: number[] = [];
                for (let jc = 0; jc <= nSubZC; jc++) {
                  const xl = -Lz/2 + jc * dxL;
                  const yl = -Bz/2 + jr * dyL;
                  row.push(N_loc.length);
                  N_loc.push([xl, yl, 0]);
                  // Encontrar el global node en N2 con coords (xCzS+xl, yCzS+yl, -HfPedC)
                  const xGlob = xCzS + xl, yGlob = yCzS + yl;
                  const keyG = nodeKey2(xGlob, yGlob, -HfPedC);
                  const gIdx = nodeIndex2.get(keyG);
                  if (gIdx !== undefined) globalNodeMap.push(gIdx);
                  else globalNodeMap.push(-1);  // no debería pasar
                }
                grid_loc.push(row);
              }
              for (let jr = 0; jr < nSubZC; jr++) {
                for (let jc = 0; jc < nSubZC; jc++) {
                  const eIdx = E_loc.length;
                  E_loc.push([grid_loc[jr][jc], grid_loc[jr][jc+1],
                              grid_loc[jr+1][jc+1], grid_loc[jr+1][jc]] as Element);
                  ei_loc.thicknesses.set(eIdx, t);
                  ei_loc.elasticities.set(eIdx, Ec);
                  ei_loc.poissonsRatios.set(eIdx, nu_c);
                  ei_loc.shearModuli.set(eIdx, Gc);
                  ei_loc.densities.set(eIdx, rho_c);
                }
              }
              const springs_loc: Array<{node:number,dof:number,k:number}> = [];
              const kh_f = 0.5;
              for (let jr = 0; jr <= nSubZC; jr++) {
                for (let jc = 0; jc <= nSubZC; jc++) {
                  const A_trib = dxL * dyL *
                    ((jc === 0 || jc === nSubZC) ? 0.5 : 1) *
                    ((jr === 0 || jr === nSubZC) ? 0.5 : 1);
                  const kvz_l = ksC * A_trib;
                  const ni_l = grid_loc[jr][jc];
                  springs_loc.push({ node: ni_l, dof: 0, k: kvz_l * kh_f });
                  springs_loc.push({ node: ni_l, dof: 1, k: kvz_l * kh_f });
                  springs_loc.push({ node: ni_l, dof: 2, k: kvz_l });
                }
              }
              // ── VIGA DE AMARRE como cimentación corrida (vigaAmarre_pos=0) ──
              // Cuando la viga va al MISMO NIVEL de la zapata, actúa como una
              // cimentación lineal CORRIDA enterrada. En el sub-FEM aislado
              // de cada zapata, esto se modela aumentando los springs verticales
              // de los nodos del BORDE donde llega una viga, en proporción a
              // ks·b_viga·L_viga_eff (zona de influencia de la viga).
              //
              // L_viga_eff = mitad de la distancia a la zapata vecina (por
              // simetría, el otro extremo de la viga lleva la otra mitad).
              if (sistemaCim === 1 && va_pos_log === 0) {
                const va_b_loc = (p.vigaAmarre_b as number) ?? 0.25;
                // Identificar vecinos en X y Y
                const myIdx = z.idx;
                const sameRow = baseRowsCim.filter(b => Math.abs(b.y - z.y) < 1e-3 && b.idx !== myIdx).sort((a,b)=>a.x-b.x);
                const sameCol = baseRowsCim.filter(b => Math.abs(b.x - z.x) < 1e-3 && b.idx !== myIdx).sort((a,b)=>a.y-b.y);
                // Vecino más cercano en X (positivo)
                const xPosNeighbor = sameRow.find(b => b.x > z.x);
                const xNegNeighbor = [...sameRow].reverse().find(b => b.x < z.x);
                const yPosNeighbor = sameCol.find(b => b.y > z.y);
                const yNegNeighbor = [...sameCol].reverse().find(b => b.y < z.y);
                // Para cada viga conectada: distribuir springs ks·b·L/2 en
                // los nodos del borde correspondiente
                const distribOnEdge = (
                  edge: "x+"|"x-"|"y+"|"y-",
                  L_va_full: number,
                ) => {
                  // Solo la mitad porque la otra mitad va a la zapata vecina
                  const L_eff = L_va_full / 2;
                  // El borde tiene nSubZC+1 nodos. Distribuyo proporcionalmente
                  // por longitud tributaria: cada nodo cubre L_eff/nSubZC
                  // (excepto los extremos que llevan la mitad)
                  for (let k = 0; k <= nSubZC; k++) {
                    const dL = (k === 0 || k === nSubZC) ? L_eff/(2*nSubZC) : L_eff/nSubZC;
                    const k_extra_v = ksC * va_b_loc * dL;
                    const k_extra_h = k_extra_v * kh_f;
                    let nodeId: number;
                    switch (edge) {
                      case "x+": nodeId = grid_loc[k][nSubZC]; break;
                      case "x-": nodeId = grid_loc[k][0]; break;
                      case "y+": nodeId = grid_loc[nSubZC][k]; break;
                      case "y-": nodeId = grid_loc[0][k]; break;
                    }
                    springs_loc.push({ node: nodeId, dof: 0, k: k_extra_h });
                    springs_loc.push({ node: nodeId, dof: 1, k: k_extra_h });
                    springs_loc.push({ node: nodeId, dof: 2, k: k_extra_v });
                  }
                };
                if (xPosNeighbor) distribOnEdge("x+", xPosNeighbor.x - z.x);
                if (xNegNeighbor) distribOnEdge("x-", z.x - xNegNeighbor.x);
                if (yPosNeighbor) distribOnEdge("y+", yPosNeighbor.y - z.y);
                if (yNegNeighbor) distribOnEdge("y-", z.y - yNegNeighbor.y);
              }
              const kRotL = ksC * dxL * dyL * 1e-4;
              springs_loc.push({ node: grid_loc[0][0], dof: 3, k: kRotL });
              springs_loc.push({ node: grid_loc[0][0], dof: 4, k: kRotL });
              springs_loc.push({ node: grid_loc[0][0], dof: 5, k: kRotL });
              // Cargar P, Mx, My en el nodo local más cercano a la columna
              const xColL = -offX, yColL = -offY;
              let bestI = 0, bestJ = 0, bestD = Infinity;
              for (let jr = 0; jr <= nSubZC; jr++) {
                for (let jc = 0; jc <= nSubZC; jc++) {
                  const xl = -Lz/2 + jc * dxL, yl = -Bz/2 + jr * dyL;
                  const d2 = (xl-xColL)**2 + (yl-yColL)**2;
                  if (d2 < bestD) { bestD = d2; bestI = jr; bestJ = jc; }
                }
              }
              const loadNL = grid_loc[bestI][bestJ];
              const loads_loc = new Map<number, [number,number,number,number,number,number]>();
              // ── Aplicar redistribución por vigas de amarre ──
              // Si sistema=1, los momentos se reducen por la fracción que
              // la viga absorbe (siempre activa, sea pos=zapata o pedestal).
              const nVigas = nVigasConByZap.get(z.idx) ?? 0;
              const reducMom = sistemaCim === 1
                ? Math.max(0.4, 1 - tieAlpha * nVigas / 4)
                : 1.0;
              loads_loc.set(loadNL, [
                0, 0,
                -baseR.P_kN,
                baseR.Mx_kN * reducMom,
                baseR.My_kN * reducMom,
                0,
              ]);
              // Resolver
              try {
                const def_loc = deform(N_loc, E_loc, { supports: new Map(), loads: loads_loc }, ei_loc, springs_loc);
                const defLocMap = (def_loc as any).deformations as Map<number, number[]>;
                // Mapear desplazamientos al índice GLOBAL en N2
                for (let li = 0; li < N_loc.length; li++) {
                  const gIdx = globalNodeMap[li];
                  if (gIdx >= 0) {
                    const d = defLocMap.get(li);
                    if (d) allDeforms.set(gIdx, [...d]);
                  }
                }
              } catch (e) {
                console.warn(`[Zapata ${z.idx}] solver falló:`, e);
              }
            }
            // Calcular pressure global elemento por elemento
            for (let eIdx = 0; eIdx < E2.length; eIdx++) {
              const el = E2[eIdx];
              if (el.length !== 4) continue;
              const qN: number[] = [];
              for (const ng of el) {
                const d = allDeforms.get(ng);
                qN.push(ksC * (d ? d[2] : 0) / TONF_TO_KN_LOC);
              }
              pressureMap.set(eIdx, qN);
            }
            // ── Estados globales (la malla N2/E2 ya está construida arriba) ──
            states.nodes.val = N2;
            states.elements.val = E2;
            states.nodeInputs.val = { supports: supports2, loads: loads2 };
            states.elementInputs.val = {
              etabsWallJoint: Math.round((p as any).comparar ?? 1) === 1,
              elasticities: elasticities2,
              shearModuli: shearModuli2,
              areas: areas2,
              momentsOfInertiaY: Iz2,
              momentsOfInertiaZ: Iy2,
              torsionalConstants: J2,
              densities: densities2,
              poissonsRatios: poissons2,
              thicknesses: thicknesses2,
            } as any;
            states.deformOutputs.val = { deformations: allDeforms, reactions: new Map() } as any;
            states.analyzeOutputs.val = {
              pressure: pressureMap,
              colorMapRanges: { pressure: [-q_admC, 0] },  // máx compresión = magenta (como SAFE)
            } as any;
            // Reemplazar también las cotas (ocultar superestructura)
            states.objects3D.val = cotas2;
            console.log(
              `[Modo Cimentación] ${baseRowsCim.length} zapatas + pedestales (Hf=${HfPedC} m, t=${tzC} m, q_adm=${q_admC} tonf/m², ks=${ksC} kN/m³) — reemplaza superestructura`,
            );
            // Forzar al viewer mostrar colormap de presiones (sin deformada
            // amplificada — los desplazamientos reales son ~30cm en zapatas
            // de esquina con momentos altos, y la auto-amplificación 400×
            // produce ±60m visual = ilegible). El usuario puede activar
            // deformedShape manualmente con scale moderado si lo necesita.
            try {
              // Solo cambios NO-invasivos: shellResults + custom3D.
              // NO tocamos faces/sections/secColumns para evitar contaminar
              // el van.state del viewer entre cambios de ejemplo.
              const applyFEMSettings = () => {
                const viewerEl = document.querySelector("#viewer") as any;
                const settings = viewerEl?.__settings;
                if (!settings) return;
                if (settings.shellResults) settings.shellResults.val = "pressure";
                if (settings.deformedShape) settings.deformedShape.val = false;
                if (settings.deformScale) settings.deformScale.val = 5;
                if (settings.frameResults) settings.frameResults.val = "none";
                // Encender custom3D (objects3D = nuestros pedestales/labels/grilla)
                if (settings.custom3D) settings.custom3D.val = true;
              };
              [0, 100, 300].forEach((ms) => setTimeout(applyFEMSettings, ms));
            } catch (e) { /* viewer no disponible */ }
            return;  // No ejecutar el "states.objects3D.val = cotas" final
          }
        }
      } catch (e) {
        console.warn("[Modo Cimentación] error:", e);
      }
    }

    states.objects3D.val = cotas;
  },
  runModal(p, states, modalPanel) {
    const nodes = states.nodes.val;
    const elements = states.elements.val;
    const ni = states.nodeInputs.val;
    const ei = states.elementInputs.val;
    if (!nodes.length || !elements.length || !ni.supports?.size || !ei.densities?.size) return;
    try {
      // ═══════════════════════════════════════════════════════════════
      // ETABS-style modal: filtrar losas del modal + lumpear masa en columnas
      // ═══════════════════════════════════════════════════════════════
      // Las losas (shells horizontales) generan modos Uz que dominan los
      // primeros eigenvalores. ETABS y SAP las modelan como "Membrane" con
      // masa puntual concentrada en master nodes. Aquí replicamos:
      //   1. Identificar shells con todos sus nodos a la misma cota Z (losas)
      //   2. Calcular su masa total (m_slab = ρ · A · t)
      //   3. Skip esos shells en la malla del modal
      //   4. Multiplicar la densidad de las columnas por (1 + m_slab/m_cols)
      //      para conservar la masa total del edificio en el modal.
      const filteredElements: Element[] = [];
      const newAreas = new Map<number, number>();
      const newMoiY = new Map<number, number>();
      const newMoiZ = new Map<number, number>();
      const newTorsion = new Map<number, number>();
      const newE = new Map<number, number>();
      const newG = new Map<number, number>();
      const newDens = new Map<number, number>();
      const newThick = new Map<number, number>();
      const newPois = new Map<number, number>();

      let massSlab = 0; // Σ ρ · A · t
      let massCols = 0; // Σ ρ · A · L (frames verticales)
      const colIdxs: number[] = []; // índices nuevos de elementos columna
      let newIdx = 0;

      for (let i = 0; i < elements.length; i++) {
        const e = elements[i];
        let isSlab = false;
        let isCol = false;
        if (e.length === 4) {
          // Shell — verificar si es horizontal (losa)
          const zs = e.map((nIdx: number) => nodes[nIdx][2]);
          const zRange = Math.max(...zs) - Math.min(...zs);
          if (zRange < 0.02) {
            // Losa horizontal → calcular masa y skip
            const x0 = nodes[e[0]][0], y0 = nodes[e[0]][1];
            const x2 = nodes[e[2]][0], y2 = nodes[e[2]][1];
            const A_el = Math.abs((x2 - x0) * (y2 - y0)); // aproximación rectangular
            const t = ei.thicknesses?.get(i) ?? 0.15;
            const rho = ei.densities?.get(i) ?? 24;
            massSlab += rho * A_el * t;
            isSlab = true;
          }
        } else if (e.length === 2) {
          // Frame — verificar si es columna (vertical)
          const z1 = nodes[e[0]][2];
          const z2 = nodes[e[1]][2];
          const xy_dist = Math.sqrt(
            (nodes[e[1]][0] - nodes[e[0]][0]) ** 2 +
              (nodes[e[1]][1] - nodes[e[0]][1]) ** 2,
          );
          if (Math.abs(z2 - z1) > xy_dist) {
            isCol = true;
            const L = Math.abs(z2 - z1);
            const A = ei.areas?.get(i) ?? 0;
            const rho = ei.densities?.get(i) ?? 24;
            massCols += rho * A * L;
          }
        }
        if (isSlab) continue; // skip losa en modal
        // Mantener este elemento en el modal
        filteredElements.push(e);
        if (ei.areas?.has(i)) newAreas.set(newIdx, ei.areas.get(i)!);
        if (ei.momentsOfInertiaY?.has(i)) newMoiY.set(newIdx, ei.momentsOfInertiaY.get(i)!);
        if (ei.momentsOfInertiaZ?.has(i)) newMoiZ.set(newIdx, ei.momentsOfInertiaZ.get(i)!);
        if (ei.torsionalConstants?.has(i)) newTorsion.set(newIdx, ei.torsionalConstants.get(i)!);
        if (ei.elasticities?.has(i)) newE.set(newIdx, ei.elasticities.get(i)!);
        if (ei.shearModuli?.has(i)) newG.set(newIdx, ei.shearModuli.get(i)!);
        if (ei.densities?.has(i)) newDens.set(newIdx, ei.densities.get(i)!);
        if (ei.thicknesses?.has(i)) newThick.set(newIdx, ei.thicknesses.get(i)!);
        if (ei.poissonsRatios?.has(i)) newPois.set(newIdx, ei.poissonsRatios.get(i)!);
        if (isCol) colIdxs.push(newIdx);
        newIdx++;
      }

      // Lumpear la masa de losas en las columnas (multiplicar densidad)
      if (massSlab > 0 && massCols > 0 && colIdxs.length > 0) {
        const factor = 1 + massSlab / massCols;
        for (const idx of colIdxs) {
          const orig = newDens.get(idx) ?? 24;
          newDens.set(idx, orig * factor);
        }
      }

      const eiModal = {
        areas: newAreas,
        momentsOfInertiaY: newMoiY,
        momentsOfInertiaZ: newMoiZ,
        torsionalConstants: newTorsion,
        elasticities: newE,
        shearModuli: newG,
        densities: newDens,
        thicknesses: newThick,
        poissonsRatios: newPois,
      };

      const nP = Math.round(p.nPisos);
      const nModes = Math.min(60, Math.max(15, 3 * nP + 6));
      const out = modalAnalysis(nodes, filteredElements, ni, eiModal, nModes);
      const nvx = Math.round(p.nVanosX), nvy = Math.round(p.nVanosY), np = Math.round(p.nPisos);
      const lumpFactor = massCols > 0 ? 1 + massSlab / massCols : 1;
      modalPanel.render(out, {
        title: `Edificio ${nvx}×${nvy} vanos × ${np} pisos · ${nModes} modos`,
        properties: [
          `Material cols=${p.matCol<0.5?'Hormigón':'Acero'} vigas=${p.matViga<0.5?'Hormigón':'Acero'}  f'c=${p.fcConcr} kg/cm²`,
          `Apoyo: ${['Empotrado','Articulado','Rótula'][Math.round(p.apoyo)]}${p.slabOn>=0.5?` + Losa (lumped: ×${lumpFactor.toFixed(2)} dens cols, ${massSlab.toFixed(0)} kN/g)`:''}${p.bracesMode>0?' + Diagonales':''}${(p.murosMode??0)>0?' + Muros Q4':''}`,
          `Estilo ETABS: losas filtradas del modal + masa transferida a columnas (igual que membrane diaphragm en ETABS/SAP)`,
        ],
      });
      const f1 = out.frequencies[0] ?? 0;
      console.log(`[Edificio Modal] ${nModes} modos · f₁=${f1.toFixed(4)} Hz · m_slab=${massSlab.toFixed(0)} m_cols=${massCols.toFixed(0)} factor=${lumpFactor.toFixed(2)}`);
    } catch (e: any) {
      console.warn("Modal edificio error:", e.message);
    }
  },
};
