import { defineConfig } from "vite";
import topLevelAwait from "vite-plugin-top-level-await";
import path from "path";
import { mkdirSync, writeFileSync } from "fs";


/**
 * TODO VIVE EN EL WORKSPACE (Jorge, 28-sep-2026).
 *
 * Hasta ese día el build sacaba 154 páginas: una por ejemplo, que repetía lo que el workspace
 * ya hace con `?t=<id>`. Ahora se compila una sola, y las direcciones de antes (`/<carpeta>/`)
 * quedan como REDIRECCIONES al mismo ejemplo dentro del workspace, para que un enlace viejo
 * siga llegando a su sitio.
 *
 * clave = carpeta de la dirección de antes · valor = id del ejemplo ("" = el workspace sin más).
 */
const PAGINAS_DE_ANTES: Record<string, string> = {
  "beams": "beams",
  "inicio": "",
  "workspace_new": "new-blank",
  "workspace_existent": "csi-importer",
  "axial-bar": "axial-bar",
  "plate-q4": "plate-q4",
  "zapata-viga-amarre": "zapata-viga-amarre",
  "zapata-aislada": "zapata-aislada",
  // pagina suelta vieja que dejo en gh-pages el deploy de la rama zapata-levantamiento (21-sep): cargaba su
  // propio JS viejo; ahora redirige al workspace, que ya lleva la ley Gap (29-sep-2026)
  "zapata-excentrica": "zapata-excentrica",
  "zapata-aislada-validacion": "zapata-aislada-validacion",
  "safe-bench-losa-cimentacion": "safe-bench-losa-cimentacion",
  "safe-bench-viga-cimentacion": "safe-bench-viga-cimentacion",
  "safe-bench-zapata-combinada": "safe-bench-zapata-combinada",
  "safe-bench-zapata-conectada": "safe-bench-zapata-conectada",
  "safe-bench-zapata-comparativa": "safe-bench-zapata-comparativa",
  "guerra-ej1-zapata-cuadrada": "guerra-ej1-zapata-cuadrada",
  "guerra-ej2-zapata-rectangular-sismo": "guerra-ej2-zapata-rectangular-sismo",
  "guerra-ej3-zapata-rectangular-eccentricidad-grande": "guerra-ej3-zapata-rectangular-eccentricidad-grande",
  "guerra-ej4-zapata-combinada-rectangular": "guerra-ej4-zapata-combinada-rectangular",
  "guerra-ej5-zapata-combinada-trapezoidal": "guerra-ej5-zapata-combinada-trapezoidal",
  "guerra-ej6-zapata-unida-viga-amarre": "guerra-ej6-zapata-unida-viga-amarre",
  "benchmark-safe-ex01-plate": "benchmark-safe-ex01-plate",
  "benchmark-safe-ex04-plate-beams": "benchmark-safe-ex04-plate-beams",
  "guerra-ej7-viga-cimentacion-new": "guerra-ej7-viga-cimentacion-new",
  "guerra-ej8-losa-cimentacion": "guerra-ej8-losa-cimentacion",
  "viga-cim-guerra-ej7": "viga-cim-guerra-ej7",
  "viga-cim-guerra-ej7-tinv": "viga-cim-guerra-ej7-tinv",
  "viga-medio-elastico": "viga-medio-elastico",
  "cli-modeler": "cli-modeler",
  "cad-draw": "cad-draw",
  "new-blank": "new-blank",
  "edificio-con-losa": "edificio-con-losa",
  "edificio-con-muros": "edificio-con-muros",
  "plane": "plane",
  "membrana-csi": "membrana-csi",
  "edificio-aporticado": "edificio-aporticado",
  "edificio-ladera": "edificio-ladera",
  "edificio-comparativa-fem": "edificio-comparativa-fem",
  "edificio-hormigon": "edificio-hormigon",
  "edificio-acero-v2": "edificio-acero-v2",
  "edificio-mixto": "edificio-mixto",
  "edificio-muros": "edificio-muros",
  "edificio-dual": "edificio-dual",
  "columna-cft": "columna-cft",
  "triangular-plate": "triangular-plate",
  "conexion-rbs": "conexion-rbs",
  "conexion-bfp": "conexion-bfp",
  "conexion-end-plate": "conexion-end-plate",
  "placa-base": "placa-base",
  "truss-gen": "truss-gen",
  "W1_barra_axial": "W1_barra_axial",
  "W2_viga_axial_cantilever": "W2_viga_axial_cantilever",
  "W2_viga_axial_concrete_cantilever": "W2_viga_axial_concrete_cantilever",
  "W2_viga_axial_composite_cantilever": "W2_viga_axial_composite_cantilever",
  "W2_viga_axial_composite_encased_cantilever": "W2_viga_axial_composite_encased_cantilever",
  "W2_viga_flexion_concrete_cantilever": "W2_viga_flexion_concrete_cantilever",
  "W2_viga_flexion_steel_cantilever": "W2_viga_flexion_steel_cantilever",
  "W2_viga_flexion_composite_slab_cantilever": "W2_viga_flexion_composite_slab_cantilever",
  "W2_viga_flexion_composite_encased_cantilever": "W2_viga_flexion_composite_encased_cantilever",
  "portico-2d": "portico-2d",
  "cerramiento": "cerramiento",
  "tower-3d": "tower-3d",
  "galpon": "galpon",
  "muro-largueros": "muro-largueros",
  "galpon-bodega": "galpon-bodega",
  "edif-acero": "edif-acero",
  "mezanine": "mezanine",
  "plate-thin": "plate-thin",
  "plate-thick": "plate-thick",
  "membrana-pstress": "membrana",
  "shell-thin": "shell-thin",
  "shell-thick": "shell-thick",
  "layered-shell": "layered-shell",
  "plate-with-beams": "plate-with-beams",
  "slab-beams-columns": "slab-beams-columns",
  "benchmark-3way": "benchmark-3way",
  "benchmark-cft": "benchmark-cft",
  "benchmark-cft-cantilever": "benchmark-cft-cantilever",
  "benchmark-steel-cantilever": "benchmark-steel-cantilever",
  "benchmark-concrete-cantilever": "benchmark-concrete-cantilever",
  "benchmark-paz-4-1": "benchmark-paz-4-1",
  "benchmark-paz-6-1": "benchmark-paz-6-1",
  "benchmark-paz-7-1": "benchmark-paz-7-1",
  "benchmark-paz-8-1": "benchmark-paz-8-1",
  "benchmark-paz-9-3": "benchmark-paz-9-3",
  "benchmark-paz-10-7": "benchmark-paz-10-7",
  "benchmark-paz-11-1": "benchmark-paz-11-1",
  "benchmark-paz-12-1": "benchmark-paz-12-1",
  "benchmark-paz-13-1": "benchmark-paz-13-1",
  "gateway-arch": "gateway-arch",
  "cable-stayed-bridge": "cable-stayed-bridge",
  "twisted-tower": "twisted-tower",
  "burj-khalifa": "burj-khalifa",
  "sydney-opera": "sydney-opera",
  "plate-thick-validacion": "plate-thick",
  "arco": "arco",
  "eiffel": "eiffel",
  "puente-reticular": "puente",
  "burj": "burj",
  "twisted": "twisted",
  "diagrid-parametrico": "diagrid",
  "opera": "opera",
  "edif-acero-diag": "edif-acero-diag",
  "edif-muros": "edif-muros",
  "edif-mixto": "edif-mixto",
  "losa-rect": "losa-rect",
  "viga-alta": "viga-alta",
  "muro-contencion": "muro-contencion",
  "muro-q4": "muro-q4",
  "viga-q4": "viga-q4",
  "pergola-parametrica": "pergola",
  "col-placa": "col-placa",
  "placa-orificios": "placa-orificios",
  "validacion-losas-csi": "validacion-losas-csi",
  "placa-xy": "placa-xy",
  "losa-plana": "losa-plana",
  "talud": "talud",
  "shear-wall-q4": "shear-wall-q4",
  "cantilever-beam-q4": "cantilever-beam-q4",
  "slope-stability": "slope-stability",
  "placa-base-h": "placa-base-h",
  "bolt-hole-detail": "bolt-hole-detail",
  "solid-cube-fem": "solid-cube-fem",
  "viga-doble-t": "viga-doble-t",
  "tablero-puente": "tablero-puente",
  "columna-cft-h8": "columna-cft-h8",
  "conexion-diafragma-cft": "conexion-diafragma-cft",
  "placa-base-hueca": "placa-base-hueca",
  "placa-base-cft": "placa-base-cft",
  "bulbo-presiones-suelo": "bulbo-presiones-suelo",
  "muro-contencion-solido": "muro-contencion-solido",
  "mesa-torsion": "mesa-torsion",
  "espectro-nec": "edificio-frame-nec",
  "cortante-basal": "edificio-frame-nec",
  "edificio-frame-nec": "edificio-frame-nec",
  "1d-mesh": "truss-gen",
  "2d-mesh": "plate-thin",
  "3d-structure": "tower-3d",
  "truss": "truss-gen",
  "advanced-truss": "truss-gen",
  "building": "edificio-aporticado",
  "plate": "plate-thin",
  "slab-designer": "losa-plana",
  "cad-editor": "cad-draw",
  "drawing": "cad-draw",
  "placa-cantilever-q4": "placa-xy",
  "diagrid": "diagrid",
  "pergola": "pergola",
  "color-map": "",
  "curves": "",
  "tables": "",
  "report": "",
};

function redirigirPaginasSueltas() {
  let salida = "";
  return {
    name: "hekatan-redirigir-paginas-sueltas",
    apply: "build" as const,
    configResolved(c: any) { salida = path.resolve(c.root, c.build.outDir); },
    closeBundle() {
      for (const [carpeta, id] of Object.entries(PAGINAS_DE_ANTES)) {
        const destino = id ? `../workspace/?t=${encodeURIComponent(id)}` : "../workspace/";
        const html = `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8" />
<title>Hekatan Struct</title>
<meta name="robots" content="noindex" />
<link rel="canonical" href="${destino}" />
<meta http-equiv="refresh" content="0; url=${destino}" />
<script>location.replace(${JSON.stringify(destino)} + (location.hash || ""));</script>
</head><body><a href="${destino}">Abrir en Hekatan Struct</a></body></html>
`;
        mkdirSync(path.join(salida, carpeta), { recursive: true });
        writeFileSync(path.join(salida, carpeta, "index.html"), html, "utf-8");
      }
    },
  };
}

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
        // UN solo entorno: el workspace. Cada ejemplo se abre con `?t=<id>`.
        workspace: "src/workspace/index.html",
        // La lección paso a paso todavía trae su propia interfaz y se ve embebida.
        "fem-explained": "src/fem-explained/index.html",
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
  plugins: [topLevelAwait(), redirigirPaginasSueltas()], // topLevelAwait: used by hekatan-fem & hekatan-mesh to load wasm at top level
});
