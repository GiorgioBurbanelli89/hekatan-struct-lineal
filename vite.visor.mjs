// Compila el VISOR de Hekatan Struct como una libreria suelta, para poder usarlo
// en las paginas de los videos sin arrastrar toda la aplicacion.
//
// Por que: dibujar una viga a mano en three.js da una CAJA. El visor de Struct
// ya sabe dibujar vigas y columnas con su SECCION real, losas, mallas, apoyos,
// cargas y los diagramas de esfuerzos. Es el mismo que se ve en el programa.
import { defineConfig } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const aqui = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(aqui, "hekatan-ui/src/index.ts"),
      name: "HekatanUI",
      formats: ["es"],
      fileName: () => "hekatan-visor.js",
    },
    outDir: path.resolve(aqui, "..", "hekatan-school", "visor"),
    emptyOutDir: true,
    sourcemap: false,
    minify: true,
  },
});
