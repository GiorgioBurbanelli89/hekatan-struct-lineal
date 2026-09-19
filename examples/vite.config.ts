import { defineConfig } from "vite";
import topLevelAwait from "vite-plugin-top-level-await";
import path from "path";

export default defineConfig({
  server: {
    port: 4600,
    open: "workspace/index.html",
  },
  // Resolve base path. Fix MSYS/Git-Bash path mangling: si DEPLOY_BASE fue
  // convertido a "C:/Program Files/Git/hekatan-struct-lineal/" (conversión POSIX→Windows
  // de la shell de Git Bash), lo restauramos al path que esperamos.
  // También soporta DEPLOY_BASE con doble slash inicial ("//hekatan-struct-lineal/")
  // que evita la conversión.
  base: (() => {
    let b = process.env.DEPLOY_BASE || "./";
    // 1) Quitar prefijo "C:/Program Files/Git" o similar (conversión MSYS)
    b = b.replace(/^[A-Z]:\/Program Files\/Git/i, "");
    // 2) Normalizar doble slash inicial ("//hekatan-struct-lineal/" → "/hekatan-struct-lineal/")
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
      input: {
        "3d-structure": "src/3d-structure/index.html",
        "advanced-truss": "src/advanced-truss/index.html",
        beams: "src/beams/index.html",
        workspace: "src/workspace/index.html",
        // plantilla para MODELOS EXISTENTES (.heks) — panel compacto,
        // sin selector de ejemplos ni sliders de geometria
        // portada: donde el usuario elige nuevo / existente / ejemplos
        inicio: "src/inicio/index.html",
        workspace_new: "src/workspace_new/index.html",
        workspace_existent: "src/workspace_existent/index.html",
        curves: "src/curves/index.html",
        "1d-mesh": "src/1d-mesh/index.html",
        truss: "src/truss/index.html",
        tables: "src/tables/index.html",
        "2d-mesh": "src/2d-mesh/index.html",
        drawing: "src/drawing/index.html",
        report: "src/report/index.html",
        plate: "src/plate/index.html",
        building: "src/building/index.html",
        "slab-designer": "src/slab-designer/index.html",
        "color-map": "src/color-map/index.html",
        "cad-editor": "src/cad-editor/index.html",
        "axial-bar": "src/axial-bar/index.html",
        "plate-q4": "src/plate-q4/index.html",
        "plate-q4-report": "src/plate-q4/report.html",
        "fem-explained": "src/fem-explained/index.html",
        "zapata-viga-amarre": "src/zapata-viga-amarre/index.html",
        "zapata-aislada": "src/zapata-aislada/index.html",
        "zapata-excentrica": "src/zapata-excentrica/index.html",
        "zapata-aislada-validacion": "src/zapata-aislada-validacion/index.html",
        "safe-bench-losa-cimentacion": "src/safe-bench-losa-cimentacion/index.html",
        "safe-bench-viga-cimentacion": "src/safe-bench-viga-cimentacion/index.html",
        "safe-bench-zapata-combinada": "src/safe-bench-zapata-combinada/index.html",
        "safe-bench-zapata-conectada": "src/safe-bench-zapata-conectada/index.html",
        "safe-bench-zapata-comparativa": "src/safe-bench-zapata-comparativa/index.html",
        "guerra-ej1-zapata-cuadrada": "src/guerra-ej1-zapata-cuadrada/index.html",
        "guerra-ej2-zapata-rectangular-sismo": "src/guerra-ej2-zapata-rectangular-sismo/index.html",
        "guerra-ej3-zapata-rectangular-eccentricidad-grande": "src/guerra-ej3-zapata-rectangular-eccentricidad-grande/index.html",
        "guerra-ej4-zapata-combinada-rectangular": "src/guerra-ej4-zapata-combinada-rectangular/index.html",
        "guerra-ej5-zapata-combinada-trapezoidal": "src/guerra-ej5-zapata-combinada-trapezoidal/index.html",
        "guerra-ej6-zapata-unida-viga-amarre": "src/guerra-ej6-zapata-unida-viga-amarre/index.html",
        "benchmark-safe-ex01-plate": "src/benchmark-safe-ex01-plate/index.html",
        "benchmark-safe-ex04-plate-beams": "src/benchmark-safe-ex04-plate-beams/index.html",
        "guerra-ej7-viga-cimentacion-new": "src/guerra-ej7-viga-cimentacion-new/index.html",
        "guerra-ej8-losa-cimentacion": "src/guerra-ej8-losa-cimentacion/index.html",
        "viga-cim-guerra-ej7": "src/viga-cim-guerra-ej7/index.html",
        "viga-cim-guerra-ej7-tinv": "src/viga-cim-guerra-ej7-tinv/index.html",
        "viga-medio-elastico": "src/viga-medio-elastico/index.html",
        "cli-modeler": "src/cli-modeler/index.html",
        "cad-draw": "src/cad-draw/index.html",
        "new-blank": "src/new-blank/index.html",
        "edificio-con-losa": "src/edificio-con-losa/index.html",
        "edificio-con-muros": "src/edificio-con-muros/index.html",
        "plane": "src/plane/index.html",
        "membrana-csi": "src/membrana-csi/index.html",
        "edificio-aporticado": "src/edificio-aporticado/index.html",
        "edificio-ladera": "src/edificio-ladera/index.html",
        "edificio-comparativa-fem": "src/edificio-comparativa-fem/index.html",
        "edificio-hormigon": "src/edificio-hormigon/index.html",
        "edificio-acero-v2": "src/edificio-acero-v2/index.html",
        "edificio-mixto": "src/edificio-mixto/index.html",
        "edificio-muros": "src/edificio-muros/index.html",
        "edificio-dual": "src/edificio-dual/index.html",
        "columna-cft": "src/columna-cft/index.html",
        "triangular-plate": "src/triangular-plate/index.html",
        "conexion-rbs": "src/conexion-rbs/index.html",
        "conexion-bfp": "src/conexion-bfp/index.html",
        "conexion-end-plate": "src/conexion-end-plate/index.html",
        "placa-base": "src/placa-base/index.html",
        "truss-gen": "src/truss-gen/index.html",
        "W1_barra_axial": "src/W1_barra_axial/index.html",
        "W2_viga_axial_cantilever": "src/W2_viga_axial_cantilever/index.html",
        "W2_viga_axial_concrete_cantilever": "src/W2_viga_axial_concrete_cantilever/index.html",
        "W2_viga_axial_composite_cantilever": "src/W2_viga_axial_composite_cantilever/index.html",
        "W2_viga_axial_composite_encased_cantilever": "src/W2_viga_axial_composite_encased_cantilever/index.html",
        "W2_viga_flexion_concrete_cantilever": "src/W2_viga_flexion_concrete_cantilever/index.html",
        "W2_viga_flexion_steel_cantilever": "src/W2_viga_flexion_steel_cantilever/index.html",
        "W2_viga_flexion_composite_slab_cantilever": "src/W2_viga_flexion_composite_slab_cantilever/index.html",
        "W2_viga_flexion_composite_encased_cantilever": "src/W2_viga_flexion_composite_encased_cantilever/index.html",
        "portico-2d": "src/portico-2d/index.html",
        "cerramiento": "src/cerramiento/index.html",
        "tower-3d": "src/tower-3d/index.html",
        "galpon": "src/galpon/index.html",
        "muro-largueros": "src/muro-largueros/index.html",
        "galpon-bodega": "src/galpon-bodega/index.html",
        "edif-acero": "src/edif-acero/index.html",
        "mezanine": "src/mezanine/index.html",
        "plate-thin": "src/plate-thin/index.html",
        "plate-thick": "src/plate-thick/index.html",
        "membrana-pstress": "src/membrana-pstress/index.html",
        "shell-thin": "src/shell-thin/index.html",
        "shell-thick": "src/shell-thick/index.html",
        "layered-shell": "src/layered-shell/index.html",
        "plate-with-beams": "src/plate-with-beams/index.html",
        "slab-beams-columns": "src/slab-beams-columns/index.html",
        "benchmark-3way": "src/benchmark-3way/index.html",
        "benchmark-cft": "src/benchmark-cft/index.html",
        "benchmark-cft-cantilever": "src/benchmark-cft-cantilever/index.html",
        "benchmark-steel-cantilever": "src/benchmark-steel-cantilever/index.html",
        "benchmark-concrete-cantilever": "src/benchmark-concrete-cantilever/index.html",
        // ── Benchmarks Paz (Mario Paz "Structural Dynamics" 6ª ed) ──
        "benchmark-paz-4-1": "src/benchmark-paz-4-1/index.html",
        "benchmark-paz-6-1": "src/benchmark-paz-6-1/index.html",
        "benchmark-paz-7-1": "src/benchmark-paz-7-1/index.html",
        "benchmark-paz-8-1": "src/benchmark-paz-8-1/index.html",
        "benchmark-paz-9-3": "src/benchmark-paz-9-3/index.html",
        "benchmark-paz-10-7": "src/benchmark-paz-10-7/index.html",
        "benchmark-paz-11-1": "src/benchmark-paz-11-1/index.html",
        "benchmark-paz-12-1": "src/benchmark-paz-12-1/index.html",
        "benchmark-paz-13-1": "src/benchmark-paz-13-1/index.html",
        // ── Iconic structures (extraídas de getCad3d.ts a awatif v2 pattern) ──
        "gateway-arch": "src/gateway-arch/index.html",
        "cable-stayed-bridge": "src/cable-stayed-bridge/index.html",
        "twisted-tower": "src/twisted-tower/index.html",
        "burj-khalifa": "src/burj-khalifa/index.html",
        "sydney-opera": "src/sydney-opera/index.html",
        "diagrid": "src/diagrid/index.html",
        "pergola": "src/pergola/index.html",
        "plate-thick-validacion": "src/plate-thick-validacion/index.html",
        // ── FEM Studio rescatados a su carpeta (18-sep-2026) ──
        "arco": "src/arco/index.html",
        "eiffel": "src/eiffel/index.html",
        "puente-reticular": "src/puente-reticular/index.html",
        "burj": "src/burj/index.html",
        "twisted": "src/twisted/index.html",
        "diagrid-parametrico": "src/diagrid-parametrico/index.html",
        "opera": "src/opera/index.html",
        "edif-acero-diag": "src/edif-acero-diag/index.html",
        "edif-muros": "src/edif-muros/index.html",
        "edif-mixto": "src/edif-mixto/index.html",
        "losa-rect": "src/losa-rect/index.html",
        "viga-alta": "src/viga-alta/index.html",
        "muro-contencion": "src/muro-contencion/index.html",
        "muro-q4": "src/muro-q4/index.html",
        "viga-q4": "src/viga-q4/index.html",
        "pergola-parametrica": "src/pergola-parametrica/index.html",
        "col-placa": "src/col-placa/index.html",
        "placa-orificios": "src/placa-orificios/index.html",
        "placa-xy": "src/placa-xy/index.html",
        "losa-plana": "src/losa-plana/index.html",
        "talud": "src/talud/index.html",
        // ── FEM demos Q4 (validación) ──
        "shear-wall-q4": "src/shear-wall-q4/index.html",
        "cantilever-beam-q4": "src/cantilever-beam-q4/index.html",
        "placa-cantilever-q4": "src/placa-cantilever-q4/index.html",
        // ── Geotécnico ──
        "slope-stability": "src/slope-stability/index.html",
        // ── Conexión placa base con columna H (CBFEM-style) ──
        "placa-base-h": "src/placa-base-h/index.html",
        // ── Detalle perno + orificio (concentración tensiones) ──
        "bolt-hole-detail": "src/bolt-hole-detail/index.html",
        // ── FEM 3D Sólido H8 (TS puro, validación CalculiX/CodeAster/FEniCS) ──
        "solid-cube-fem": "src/solid-cube-fem/index.html",
        // ── Viga doble T ASIMÉTRICA (patines sup/inf independientes) ──
        "viga-doble-t": "src/viga-doble-t/index.html",
        // ── Tablero de puente: 3 vigas doble-T + losa shell (test Solar) ──
        "tablero-puente": "src/tablero-puente/index.html",
        // ── Columna CFT MIXTA (HSS shells Q4 + concreto H8 sólidos) ──
        "columna-cft-h8": "src/columna-cft-h8/index.html",
        // ── Conexión viga-columna con diafragma (Cervantes / CIDECT México) ──
        "conexion-diafragma-cft": "src/conexion-diafragma-cft/index.html",
        // ── Placa base con columna HSS hueca + pernos de anclaje ──
        "placa-base-hueca": "src/placa-base-hueca/index.html",
        // ── Placa base con columna CFT + pernos de anclaje ──
        "placa-base-cft": "src/placa-base-cft/index.html",
        // ── Bulbo de presiones bajo carga rectangular (Serquen SF-70, hex8) ──
        "bulbo-presiones-suelo": "src/bulbo-presiones-suelo/index.html",
        "muro-contencion-solido": "src/muro-contencion-solido/index.html",
        // ── Mesa de torsión: validación contra ETABS 19 (Gabriela/Seproinca 2020) ──
        "mesa-torsion": "src/mesa-torsion/index.html",
        // ── Módulo 1 NEC: Espectro de diseño NEC-SE-DS (peligro sísmico) ──
        "espectro-nec": "src/espectro-nec/index.html",
        // ── Módulo 3 NEC: Cortante basal y distribución de fuerzas sísmicas ──
        "cortante-basal": "src/cortante-basal/index.html",
        // ── Edificio pórtico paramétrico (frame-only) con carga lateral NEC ──
        "edificio-frame-nec": "src/edificio-frame-nec/index.html",
      },
    },
  },
  optimizeDeps: {
    exclude: ["hekatan-fem", "hekatan-mesh", "hekatan-ui"],
  },
  // El worker del modal (src/shared/modal.worker.ts) importa hekatan-fem, que
  // carga el WASM con un await de nivel superior. Vite compila los workers en
  // `iife`, que NO admite ese await, y el build de produccion moria ahi:
  //   Module format "iife" does not support top-level await
  // El pipeline de plugins del worker es APARTE del de arriba, asi que hay que
  // volver a poner topLevelAwait aca (en Vite 5 `worker.plugins` es una funcion).
  worker: {
    format: "es",
    plugins: () => [topLevelAwait()],
  },
  plugins: [topLevelAwait()], // used by hekatan-fem & hekatan-mesh to load wasm at top level
});
