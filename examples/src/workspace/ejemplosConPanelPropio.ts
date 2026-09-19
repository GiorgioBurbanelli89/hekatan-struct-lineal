/**
 * Ejemplos que traen su PROPIO panel de control (patron VanJS toolbar) en vez
 * de exportar `params` + `build()` como los demas.
 *
 * Cada uno se compila ademas como pagina propia (`/<id>/index.html`, ver
 * `examples/vite.config.ts`). Pero eso es un detalle de COMPILACION: dentro de
 * la app se ven en el lienzo del workspace, sin salir de la pagina
 * (`mostrarEjemploEmbebido` en `workspace/main.ts`).
 *
 * Convenciones para anadir uno:
 *   - id: igual a la carpeta en `examples/src/`
 *   - name: el nombre que sale en el selector
 *   - category: agrupa en el selector
 *   - standaloneUrl: ruta relativa a `/workspace/` (ej. "../1d-mesh/")
 *
 * NOTA: lo que toca es GRADUARLOS al patron `ExampleDef` (params + build). El
 * visor del workspace ya sabe pintar lo suyo, incluidos los solidos
 * (`settings.solids` + `analyzeOutputs.solidStress`). Mientras tanto, se ven
 * embebidos.
 *
 * (El fork parte de awatif v2.0.0; la atribucion esta en los CREDITOS, en el
 * desplegable del logo — `hekatan-ui/src/toolbar/getToolbar.ts`.)
 */

import type { ExampleDef } from "./exampleRegistry";

/** Helper para una entrada minima de ejemplo con panel propio. */
function legacy(id: string, name: string, category: string, benchmark = false): ExampleDef {
  return {
    id,
    name,
    category,
    benchmark,
    standaloneUrl: `../${id}/`,
  };
}

// ─── FEM básico ──────────────────────────────────────────────────────
export const legacy1dMesh       = legacy("1d-mesh",       "Hekatan – 1D Mesh",          "1️⃣ Frames · 🎯 2 GDL Flexión");
export const legacy2dMesh       = legacy("2d-mesh",       "Hekatan – 2D Mesh",          "2️⃣ Shells · 🧱 Placas");
export const legacy3dStructure  = legacy("3d-structure",  "Hekatan – 3D Structure",     "1️⃣ Frames · 🎯 6 GDL Espacial");

// ─── Frames y trusses ────────────────────────────────────────────────
export const legacyAxialBar     = legacy("axial-bar",     "Hekatan – Axial Bar",        "1️⃣ Frames · 🎯 1 GDL Axial");
export const legacyTruss        = legacy("truss",         "Hekatan – Truss",            "1️⃣ Frames · 🎯 6 GDL Espacial");
export const legacyAdvancedTruss= legacy("advanced-truss","Hekatan – Advanced Truss",   "1️⃣ Frames · 🎯 6 GDL Espacial");
export const legacyBeams        = legacy("beams",         "Paz 6.3 Space Frame (validación 4 solvers)", "1️⃣ Frames · 🎯 n GDL Sistemas", true);

// ─── Edificios ──────────────────────────────────────────────────────
export const legacyBuilding     = legacy("building",      "Hekatan – Building (upstream)", "4️⃣ Mixtos · 🏢 Edificios");

// ─── Placas ─────────────────────────────────────────────────────────
export const legacyPlate        = legacy("plate",         "Hekatan – Plate (legacy)",   "2️⃣ Shells · 🧱 Placas");
export const legacyPlateQ4      = legacy("plate-q4",      "Hekatan – Plate Q4 Studio",  "2️⃣ Shells · 🧱 Placas");

// ─── Visualización / didácticos ─────────────────────────────────────
export const legacyColorMap     = legacy("color-map",     "Hekatan – Color Map demo",   "🗄 Legacy");
export const legacyCurves       = legacy("curves",        "Hekatan – Curves demo",      "🗄 Legacy");
export const legacyDrawing      = legacy("drawing",       "Hekatan – Drawing canvas",   "🗄 Legacy");
export const legacyTables       = legacy("tables",        "Hekatan – Tables demo",      "🗄 Legacy");

// ─── Editores (CAD / cálculo / losas) ───────────────────────────────
export const legacyCadEditor    = legacy("cad-editor",    "Hekatan – CAD Editor",       "🧪 Utilidades");
// `calc-editor` NO es una pagina: `examples/src/calc-editor/` solo tiene
// modulos (`calcPanel.ts` y compania) que cargan las FEM Tools y el panel de
// tutoriales. No hay `index.html` ni entrada en `examples/vite.config.ts`, asi
// que este stub apuntaba a `../calc-editor/` = **404**. Fuera del selector
// (18-sep-2026).
export const legacySlabDesigner = legacy("slab-designer", "Hekatan – Slab Designer",    "🧪 Utilidades");

// ─── Educativo ──────────────────────────────────────────────────────
export const legacyFemExplained = legacy("fem-explained", "Hekatan – FEM Explained",    "🗄 Legacy");
export const legacyReport       = legacy("report",        "Hekatan – Report (Calcpad)", "🗄 Legacy");

// ─── Estructuras emblemáticas (extraídas de getCad3d.ts) ────────────
export const iconicGatewayArch  = legacy("gateway-arch",         "Gateway Arch",                "4️⃣ Mixtos · 🌉 Puentes e icónicos");
export const iconicCableBridge  = legacy("cable-stayed-bridge",  "Puente Atirantado",           "4️⃣ Mixtos · 🌉 Puentes e icónicos");
export const iconicTwistedTower = legacy("twisted-tower",        "Torre Retorcida",             "4️⃣ Mixtos · 🌉 Puentes e icónicos");
export const iconicBurjKhalifa  = legacy("burj-khalifa",         "Burj Khalifa style",          "4️⃣ Mixtos · 🌉 Puentes e icónicos");
export const iconicSydneyOpera  = legacy("sydney-opera",         "Sydney Opera House",          "2️⃣ Shells · 🐚 Cáscaras");
// ⚠️ Aqui habia dos stubs mas, `legacy("diagrid")` y `legacy("pergola")`, que
// SECUESTRABAN el id de los ejemplos parametricos del mismo nombre: `?t=diagrid`
// abria el stub, no el ejemplo. El comentario decia "hasta que se registre
// moreExamples". Ya esta: los 21 viven en su carpeta y estan en el registry
// (18-sep-2026), asi que los stubs se van y el id vuelve a su dueno. Las paginas
// `/diagrid/` y `/pergola/` siguen existiendo y se pueden abrir por URL directa.

// ─── Demos FEM Q4 (validación contra OpenSees/SAP/ETABS) ────────────
export const demoShearWallQ4    = legacy("shear-wall-q4",        "Muro de Corte Q4",            "2️⃣ Shells · 🕸 Membranas");
export const demoCantileverQ4   = legacy("cantilever-beam-q4",   "Viga Cantilever Q4",          "2️⃣ Shells · 🧱 Placas");
export const demoPlacaQ4        = legacy("placa-cantilever-q4",  "Placa Cantilever XY Q4",      "2️⃣ Shells · 🧱 Placas");

// ─── Geotécnico ────────────────────────────────────────────────────
export const demoSlope          = legacy("slope-stability",      "Estabilidad de Talud (SRM)",  "2️⃣ Shells · 🕸 Membranas");

// ─── Conexiones (CBFEM-style con FEM sólidos / shells) ─────────────
export const conexPlacaBaseH    = legacy("placa-base-h",         "Placa Base + Columna H (CBFEM)",                "2️⃣ Shells · 🔩 Conexiones");
export const detBoltHole        = legacy("bolt-hole-detail",     "Detalle Perno + Orificio (Kirsch)",             "3️⃣ Sólidos");
export const conexDiafCft       = legacy("conexion-diafragma-cft","Conexión Viga-Columna CFT con Diafragma (Cervantes)", "2️⃣ Shells · 🔩 Conexiones");
export const conexPlacaBaseHueca= legacy("placa-base-hueca",     "Placa Base + Columna HSS Hueca (acero)",        "2️⃣ Shells · 🔩 Conexiones");
export const conexPlacaBaseCft  = legacy("placa-base-cft",       "Placa Base + Columna CFT (rellena de concreto)","2️⃣ Shells · 🔩 Conexiones");

// ─── Columnas (FEM detallado, sólidos H8) ──────────────────────────
export const colCftH8           = legacy("columna-cft-h8",       "Columna CFT con sólidos H8",                     "3️⃣ Sólidos");

// ─── Vigas (perfiles) ──────────────────────────────────────────────
export const vigaDobleT         = legacy("viga-doble-t",         "Viga Doble-T (perfil W)",                        "2️⃣ Shells · 🐚 Cáscaras");

// ─── Puentes / tableros ────────────────────────────────────────────
export const tableroPuente      = legacy("tablero-puente",       "Tablero Puente (3 vigas+losa, test Solar)",      "4️⃣ Mixtos · 🌉 Puentes e icónicos");

// ─── FEM 3D Sólido H8 (validación cruzada con CalculiX/CodeAster/FEniCS) ───
export const solidCubeFEM       = legacy("solid-cube-fem",       "Cubo Sólido H8 (validación CalculiX)",          "3️⃣ Sólidos", true);
export const bulboPresionesSuelo= legacy("bulbo-presiones-suelo","Bulbo de Presiones — Serquen SF-70",            "3️⃣ Sólidos", true);
export const muroContencionSolido = legacy("muro-contencion-solido","Muro de contención en SÓLIDOS H8 (vs SAP2000)",  "3️⃣ Sólidos", true);

/** Array completo de los 19+11 ejemplos legacy para registrar de un golpe. */
export const ejemplosConPanelPropio: ExampleDef[] = [
  legacy1dMesh,
  legacy2dMesh,
  legacy3dStructure,
  legacyAxialBar,
  legacyTruss,
  legacyAdvancedTruss,
  legacyBeams,
  legacyBuilding,
  legacyPlate,
  legacyPlateQ4,
  legacyColorMap,
  legacyCurves,
  legacyDrawing,
  legacyTables,
  legacyCadEditor,
  legacySlabDesigner,
  legacyFemExplained,
  legacyReport,
  // Iconic structures
  iconicGatewayArch,
  iconicCableBridge,
  iconicTwistedTower,
  iconicBurjKhalifa,
  iconicSydneyOpera,
  // FEM demos Q4
  demoShearWallQ4,
  demoCantileverQ4,
  demoPlacaQ4,
  // Geotécnico
  demoSlope,
  // Conexiones (CBFEM + CFT)
  conexPlacaBaseH,
  detBoltHole,
  conexDiafCft,
  conexPlacaBaseHueca,
  conexPlacaBaseCft,
  // Columnas FEM 3D
  colCftH8,
  // Vigas / Perfiles
  vigaDobleT,
  // Puentes
  tableroPuente,
  // 🏁 Benchmarks (FEM 3D Sólido validados)
  solidCubeFEM,
  bulboPresionesSuelo,
  muroContencionSolido,
];
