/**
 * DWG ⇄ GEOMETRÍA (examples/src/shared/dwgGeometria.ts), con el motor del visor DWG
 * (acadrust en WASM, examples/public/dwg/).
 *
 *  (a) El galpón 3D del visor: se importan SOLO las capas ANALITICO-* / SHELL-* (el resto son
 *      los perfiles dibujados) → 917 nudos · 1466 barras · 10 áreas.
 *  (b) Ida y vuelta: exportar a DWG (write_dwg) y volver a importar da los MISMOS conteos y
 *      los mismos nudos (conjunto de coordenadas a 1 mm).
 *  (c) Los cortes 2D como alzado XZ: salta ejes, cotas, niveles y rótulo; la Y pasa a Z.
 *  (d) Unión en T: una columna de 0 a 8 con una viga que llega a media altura se PARTE en
 *      el nudo (reference_cad_a_fem_partir_uniones_t: sin partir, el nudo queda suelto).
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { empaquetar, R } from "../lib/bundle.mjs";
import { RAIZ } from "../lib/wasm.mjs";

export const nombre = "dwg-geometria";
export const descripcion = "DWG/DXF ⇄ nudos, barras y áreas (import, export, ida y vuelta, unión en T)";

export async function correr() {
  const G = await empaquetar(`export * from "${R}/examples/src/shared/dwgGeometria.ts";`, "dwgGeometria");
  const pub = join(RAIZ, "examples/public/dwg");
  const N = await import(pathToFileURL(join(pub, "_native.js")).href);
  await N.default({ module_or_path: readFileSync(join(pub, "_native_bg.wasm")) });
  const leer = (f) => JSON.parse(N.read_dwg_full(readFileSync(join(RAIZ, "tests/datos/dwg", f))));
  const filas = [];
  const fila = (que, medido, esperado) =>
    filas.push({ que, medido, limite: esperado, ok: medido === esperado, detalle: "" });

  const g = G.docAGeometria(leer("galpon_bodega_3d.dwg"));
  const nb = g.polylines.length - g.areas.length;
  fila("galpón 3D: nudos", g.nodes.length, 917);
  fila("galpón 3D: barras", nb, 1466);
  fila("galpón 3D: áreas", g.areas.length, 10);
  fila("galpón 3D: capas de perfiles saltadas", g.capasSaltadas.includes("COLUMNAS") ? 1 : 0, 1);

  const els = g.polylines.map((p) => (p.length === 2 ? p : p.slice(0, -1)));
  const g2 = G.docAGeometria(JSON.parse(N.read_dwg_full(N.write_dwg(JSON.stringify(G.modeloAEntidades(g.nodes, els))))), { escala: 1 });
  fila("ida y vuelta DWG: nudos", g2.nodes.length, 917);
  fila("ida y vuelta DWG: barras", g2.polylines.length - g2.areas.length, 1466);
  fila("ida y vuelta DWG: áreas", g2.areas.length, 10);
  const k = (p) => p.map((v) => Math.round(v * 1000)).join(",");
  const A = new Set(g.nodes.map(k));
  fila("ida y vuelta DWG: nudos que no coinciden (1 mm)", g2.nodes.filter((p) => !A.has(k(p))).length, 0);

  const c = G.docAGeometria(leer("cortes_galpon.dwg"), { plano: "xz" });
  fila("cortes XZ: nudos", c.nodes.length, 541);
  fila("cortes XZ: todos en y = 0", c.nodes.filter((p) => p[1] !== 0).length, 0);
  fila("cortes XZ: capas de ejes y cotas saltadas", ["A-EJES", "A-COTAS", "ROTULO"].every((n) => c.capasSaltadas.includes(n)) ? 1 : 0, 1);

  const t = G.docAGeometria({ layers: [{ name: "COL" }], entities: [
    { type: "LINE", li: 0, start: [0, 0, 0], end: [0, 0, 8] },
    { type: "LINE", li: 0, start: [0, 0, 4], end: [5, 0, 4] } ] });
  fila("unión en T: barras (columna partida en 2 + viga)", t.polylines.length, 3);
  return filas;
}
