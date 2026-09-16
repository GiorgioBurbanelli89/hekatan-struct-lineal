/**
 * De donde saca ETABS la MASA en el .e2k exportado.
 *
 * El bloque `$ MASS SOURCE` estaba fijo en `INCLUDELOADS "Yes"` con
 * `MASSSOURCELOAD "Dead" 1` para los DOS modos de peso. En "auto" eso es
 * correcto —el patron Dead lleva `SELFWEIGHT 1`, o sea que las cargas de Dead
 * SON el peso propio— pero en "manual" es un error de bulto:
 *
 *   "manual" pone `SELFWEIGHT 0` y emite las cargas del modelo como POINTLOAD.
 *   Pedir entonces la masa "de las cargas" le da a ETABS la masa de la
 *   SOBRECARGA y le quita la del material.
 *
 * Medido el 2026-08-27 con las 8 plantillas (`cli/plantillas_vs_csi.mjs`,
 * ETABS 22): el estatico cerraba al 0.000 % y el modal se iba de -72 % a +21 %.
 * Arreglado, el portico 3D pasa de -36.0 % a **+0.6 %**. La diferencia no era
 * de solvers: eran dos edificios con distinta masa.
 *
 * Se comprueba sobre el TEXTO del e2k, que es lo que lee ETABS.
 */
import { empaquetar, R } from "../lib/bundle.mjs";

export const nombre = "e2k-mass-source";
export const descripcion =
  "la masa del modal sale del sitio donde este el peso propio, segun weightMode";

const cargar = () =>
  empaquetar(`export { exportE2k } from "${R}/examples/src/shared/e2kExporter";\n`, "e2kMass");

/** Portico minimo: 4 nudos, 2 columnas y 1 viga, con carga vertical arriba. */
function modelo() {
  const nodes = [[0, 0, 0], [0, 0, 3], [5, 0, 3], [5, 0, 0]];
  const elements = [[0, 1], [1, 2], [2, 3]];
  const m = (v) => new Map(elements.map((_, i) => [i, v]));
  return {
    nodes, elements,
    nodeInputs: {
      supports: new Map([[0, [true, true, true, true, true, true]],
                         [3, [true, true, true, true, true, true]]]),
      loads: new Map([[1, [0, 0, -25, 0, 0, 0]], [2, [0, 0, -25, 0, 0, 0]]]),
    },
    elementInputs: {
      elasticities: m(2e7), areas: m(0.09), momentsOfInertiaY: m(6.75e-4),
      momentsOfInertiaZ: m(6.75e-4), torsionalConstants: m(1.1e-3),
      shearModuli: m(8.3e6), densities: m(2.4),
    },
    units: { force: "Tonf", length: "m" },
  };
}

/** El valor de una clave dentro de la linea MASSSOURCE. */
const clave = (e2k, k) => {
  const l = (e2k.match(/^\s*MASSSOURCE\s.*$/m) ?? [])[0] ?? "";
  return (l.match(new RegExp(k + '\\s+"([^"]+)"')) ?? [])[1] ?? "sin " + k;
};

export async function correr() {
  const { exportE2k } = await cargar();
  const filas = [];

  // ── "auto": el peso propio ES el patron Dead ──────────────────────────────
  const auto = exportE2k({ ...modelo(), title: "auto" });
  filas.push({
    que: "auto: la masa sale de las CARGAS (Dead = SELFWEIGHT 1)", crudo: true,
    medido: `elem=${clave(auto, "INCLUDEELEMENTS")} loads=${clave(auto, "INCLUDELOADS")}`,
    limite: "elem=No loads=Yes",
    ok: clave(auto, "INCLUDEELEMENTS") === "No" && clave(auto, "INCLUDELOADS") === "Yes",
    detalle: "con SELFWEIGHT 1 las cargas de Dead son el peso propio",
  });
  filas.push({
    que: "auto: y el patron de masa es Dead x1", crudo: true,
    medido: /MASSSOURCELOAD\s+"MsSrc1"\s+"Dead"\s+1/.test(auto) ? "si" : "no",
    limite: "si", ok: /MASSSOURCELOAD\s+"MsSrc1"\s+"Dead"\s+1/.test(auto),
    detalle: "sin esta linea, INCLUDELOADS Yes no sabe de que patron",
  });

  // ── "manual": el peso propio NO esta en ninguna carga ─────────────────────
  const manual = exportE2k({ ...modelo(), title: "manual", weightMode: "manual" });
  filas.push({
    que: "manual: la masa sale de los ELEMENTOS (SELFWEIGHT 0)", crudo: true,
    medido: `elem=${clave(manual, "INCLUDEELEMENTS")} loads=${clave(manual, "INCLUDELOADS")}`,
    limite: "elem=Yes loads=No",
    ok: clave(manual, "INCLUDEELEMENTS") === "Yes" && clave(manual, "INCLUDELOADS") === "No",
    detalle: "es lo que hace el motor: getGlobalMassMatrix pesa por densities",
  });
  filas.push({
    que: "manual: no queda un MASSSOURCELOAD colgado", crudo: true,
    medido: /MASSSOURCELOAD/.test(manual) ? "si" : "no", limite: "no",
    ok: !/MASSSOURCELOAD/.test(manual),
    detalle: "con INCLUDELOADS No, un patron de masa sobra y confunde",
  });

  // ── MASA VERTICAL: el e2k tiene que decir lo que el motor RESUELVE ───────
  // Esto exigia `vert=No lump=Yes` (el defecto de ETABS) mientras el modal de
  // Hekatan usa la masa 3D, la de SAP2000. O sea que el e2k mandaba a ETABS otra
  // masa y los modos verticales desaparecian: medido en el galpon curvo el
  // 16-sep-2026, SumUZ = 0 en ETABS contra 38.4 % en Hekatan y SAP2000, y el modo
  // 4 a -29.7 % (su "modo 4" era el 6). Con la masa vertical encendida, ETABS =
  // Hekatan a -0.01 %. Ver validation/opensees/README.md.
  for (const [modo, e2k] of [["auto", auto], ["manual", manual]]) {
    filas.push({
      que: `${modo}: masa en las TRES direcciones, sin agrupar por piso`, crudo: true,
      medido: `vert=${clave(e2k, "INCLUDEVERTICALMASS")} lump=${clave(e2k, "LUMPATSTORIES")}`,
      limite: "vert=Yes lump=No",
      ok: clave(e2k, "INCLUDEVERTICALMASS") === "Yes" && clave(e2k, "LUMPATSTORIES") === "No",
      detalle: "con vert=No, ETABS se come los modos verticales (-29.7 % en el modo 4)",
    });
  }
  return filas;
}
