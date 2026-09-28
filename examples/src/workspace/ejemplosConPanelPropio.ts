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

// 28-sep-2026 — FUERA los 13 ejemplos heredados del proyecto de origen (1d-mesh,
// 2d-mesh, 3d-structure, truss, advanced-truss, building, plate, color-map,
// curves, drawing, tables, slab-designer, report): eran demos del fork, no
// ejemplos de Hekatan, y lo que hacian ya lo hace el workspace (cercha → `truss-gen`,
// placa → `plate-thin`/`plate-thick`, edificio → `edificio-aporticado`). Y fuera
// `cad-editor`: el dibujo vive dentro del workspace (`cad-draw`, `new-blank`).

// ─── Frames ──────────────────────────────────────────────────────────
export const legacyAxialBar     = legacy("axial-bar",     "Barra axial",                "1️⃣ Frames · 🎯 1 GDL Axial");
export const legacyBeams        = legacy("beams",         "Paz 6.3 Space Frame (validación 4 solvers)", "1️⃣ Frames · 🎯 n GDL Sistemas", true);

// ─── Placas ─────────────────────────────────────────────────────────
export const legacyPlateQ4      = legacy("plate-q4",      "Placa Q4 — estudio",         "2️⃣ Shells · 🧱 Placas");

// ─── Educativo ──────────────────────────────────────────────────────
export const legacyFemExplained = legacy("fem-explained", "FEM paso a paso",            "🧪 Utilidades");

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
// viejas `/diagrid/` y `/pergola/` se quitaron del todo el 28-sep-2026.

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

/** Los que quedan por GRADUAR a `ExampleDef` (params + build). */
export const ejemplosConPanelPropio: ExampleDef[] = [
  legacyAxialBar,
  legacyBeams,
  legacyPlateQ4,
  legacyFemExplained,
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
