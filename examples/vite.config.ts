import { defineConfig } from "vite";
import topLevelAwait from "vite-plugin-top-level-await";
import path from "path";

export default defineConfig({
  server: {
    port: 4600,
    open: "workspace/index.html",
  },
  // Resolve base path. Fix MSYS/Git-Bash path mangling: si DEPLOY_BASE fue
  // convertido a "C:/Program Files/Git/hekatan-struct/" (conversión POSIX→Windows
  // de la shell de Git Bash), lo restauramos al path que esperamos.
  // También soporta DEPLOY_BASE con doble slash inicial ("//hekatan-struct/")
  // que evita la conversión.
  base: (() => {
    let b = process.env.DEPLOY_BASE || "./";
    // 1) Quitar prefijo "C:/Program Files/Git" o similar (conversión MSYS)
    b = b.replace(/^[A-Z]:\/Program Files\/Git/i, "");
    // 2) Normalizar doble slash inicial ("//hekatan-struct/" → "/hekatan-struct/")
    b = b.replace(/^\/\//, "/");
    return b || "./";
  })(), // to resolve assets
  root: "./src",
  publicDir: path.resolve(__dirname, "public"),
  resolve: {
    // Force single instance of vanjs-core (avoids symlink duplication)
    alias: [
      { find: /^vanjs-core$/, replacement: path.resolve(__dirname, "../node_modules/vanjs-core") },
      { find: /^mathjs$/, replacement: path.resolve(__dirname, "../hekatan-fem/node_modules/mathjs") },
    ],
    dedupe: ["vanjs-core", "three", "mathjs"],
    preserveSymlinks: false,
  },
  build: {
    outDir: "../../website/src/examples",
    emptyOutDir: true,
    rollupOptions: {
      // ── ENTORNO ÚNICO: el workspace ──
      // El workspace es la única app real. Corre IN-PLACE los ~85 ejemplos full
      // (formato {id, category, build} del exampleRegistry) vía su dropdown
      // Categoría/Ejemplo. Por eso esos ejemplos YA NO necesitan página propia:
      // se quitaron del build 82 páginas duplicadas (antes había 124 entradas).
      //
      // Acá solo quedan: (1) el workspace, (2) los ejemplos LEGACY/STANDALONE que
      // el workspace NO corre in-place sino que abre como página (legacyAwatif.ts
      // los registra con standaloneUrl → botón "🔗 Abrir ejemplo"), y (3) un par
      // standalone aún sin registrar (espectro-nec, cortante-basal — pendiente).
      input: {
        // Entorno principal
        workspace: "src/workspace/index.html",

        // ── Legacy awatif (FEM básico / frames / placas / visualización / editores / educativo) ──
        "1d-mesh": "src/1d-mesh/index.html",
        "2d-mesh": "src/2d-mesh/index.html",
        "3d-structure": "src/3d-structure/index.html",
        "axial-bar": "src/axial-bar/index.html",
        truss: "src/truss/index.html",
        "advanced-truss": "src/advanced-truss/index.html",
        beams: "src/beams/index.html",
        building: "src/building/index.html",
        plate: "src/plate/index.html",
        "plate-q4": "src/plate-q4/index.html",
        "plate-q4-report": "src/plate-q4/report.html",
        "color-map": "src/color-map/index.html",
        curves: "src/curves/index.html",
        drawing: "src/drawing/index.html",
        tables: "src/tables/index.html",
        "cad-editor": "src/cad-editor/index.html",
        "slab-designer": "src/slab-designer/index.html",
        "fem-explained": "src/fem-explained/index.html",
        report: "src/report/index.html",

        // ── Estructuras emblemáticas ──
        "gateway-arch": "src/gateway-arch/index.html",
        "cable-stayed-bridge": "src/cable-stayed-bridge/index.html",
        "twisted-tower": "src/twisted-tower/index.html",
        "burj-khalifa": "src/burj-khalifa/index.html",
        "sydney-opera": "src/sydney-opera/index.html",
        "diagrid": "src/diagrid/index.html",
        "pergola": "src/pergola/index.html",

        // ── Demos FEM Q4 / geotécnico / conexiones / columnas / vigas / puentes / sólidos ──
        "shear-wall-q4": "src/shear-wall-q4/index.html",
        "cantilever-beam-q4": "src/cantilever-beam-q4/index.html",
        "placa-cantilever-q4": "src/placa-cantilever-q4/index.html",
        "slope-stability": "src/slope-stability/index.html",
        "placa-base-h": "src/placa-base-h/index.html",
        "placa-base-hueca": "src/placa-base-hueca/index.html",
        "placa-base-cft": "src/placa-base-cft/index.html",
        "bolt-hole-detail": "src/bolt-hole-detail/index.html",
        "solid-cube-fem": "src/solid-cube-fem/index.html",
        "viga-doble-t": "src/viga-doble-t/index.html",
        "tablero-puente": "src/tablero-puente/index.html",
        "columna-cft-h8": "src/columna-cft-h8/index.html",
        "conexion-diafragma-cft": "src/conexion-diafragma-cft/index.html",
        "bulbo-presiones-suelo": "src/bulbo-presiones-suelo/index.html",

        // ── Standalone aún SIN registrar en el workspace (pendiente: registrar) ──
        "espectro-nec": "src/espectro-nec/index.html",
        "cortante-basal": "src/cortante-basal/index.html",
      },
    },
  },
  optimizeDeps: {
    exclude: ["hekatan-fem", "hekatan-mesh", "hekatan-ui"],
  },
  plugins: [topLevelAwait()], // used by hekatan-fem & hekatan-mesh to load wasm at top level
});
