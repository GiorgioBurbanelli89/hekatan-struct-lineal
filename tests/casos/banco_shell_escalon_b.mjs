/**
 * Escalón B del banco de cáscaras: losa + vigas + columnas, contra ETABS 22.
 *
 * El modelo viene de `edificios-slab/banco_shell.py`, que sube un escalón cada
 * vez (A: losa sola · B: losa + vigas + columnas · C: 3D) y corre cada uno con
 * los TRES tipos de cáscara de ETABS. Aquí se congela el escalón B, que es el
 * que mezcla barras y cáscaras y por tanto el que destapa los problemas de
 * acoplamiento — el drilling entre otros.
 *
 * La referencia son las flechas de ETABS 22 guardadas en el propio JSON
 * (`validation/03-cascaras-muros/banco_shell_escalonB_8x8.json`), medidas con la
 * MISMA malla nudo a nudo.
 *
 * ⚠️ POR QUÉ ESTE CASO EXISTE, y es una lección cara.
 *
 * El banco vivía fuera del repo y NINGUNA suite lo tocaba. El 19-ago-2026, al
 * revisarlo a mano, salió −7.47 % en Membrane y −13.46 % en Thick contra un
 * +0.08 % y un +2.68 % de agosto, y pareció una regresión gorda. Se bisecó el
 * motor de Python commit a commit buscando al culpable.
 *
 * No había ninguno: **estaba comparando 4×4 contra una referencia de 8×8**.
 * `banco_shell.py` tiene `NX, NY = 4, 4` por defecto y el JSON se generó con
 * `--malla=8`. Con la malla correcta:
 *
 *   |          | agosto   | hoy      |
 *   |----------|----------|----------|
 *   | Membrane | +0.082 % | −0.745 % |
 *   | Thin     | +0.153 % | −0.153 % |
 *   | Thick    | +2.684 % | −2.627 % |
 *
 * O sea: no se había movido nada. Y es EXACTAMENTE la trampa que la bitácora ya
 * tenía escrita desde agosto para `calibrar_shell.py` («pone 8×8 pero contrasta
 * con el ETABS guardado, generado con 4×4; daba un 0.02 % inexistente»). Estaba
 * documentada y aun así se repitió, porque el banco no estaba en ninguna suite.
 *
 * Por eso el JSON lleva la malla dentro (`nx`, `ny`) y este caso la comprueba
 * antes de comparar nada: si el modelo no es de la malla de la referencia, el
 * caso falla en vez de dar un número bonito y falso.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { empaquetar, R } from "../lib/bundle.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const JSON_BANCO = join(AQUI, "..", "..", "validation", "03-cascaras-muros",
                        "banco_shell_escalonB_8x8.json");

// tipo de cáscara → plateFormulations (numeración PROPIA de Hekatan, no la de la OAPI:
// ETABS SetSlab 3 = Membrane, SAP SetShell_1 5 = Membrane). Desde el 19-sep-2026 el 2
// es membrana también en el solver (antes flexaba con el MITC4).
const FORM = { Thick: 0, Thin: 1, Membrane: 2 };

/**
 * Límite por tipo, en % contra ETABS 22, con el WASM (el motor del producto).
 * Medido el 19-ago-2026 con la malla y las secciones de la referencia:
 *
 *   | Membrane | 0.745 % |
 *   | Thin     | 0.025 % |
 *   | Thick    | 2.627 % |
 *
 * Los tres coinciden con el motor de Python, así que el escalón B está cerrado.
 * El 2.6 % de Shell-Thick es conocido y viene de que ETABS no usa un MITC4
 * (ver `reference_shell_thick_shear_locking`); no es de este banco.
 *
 * ⚠️ Estos números costaron TRES diagnósticos falsos seguidos, todos por montar
 * mal el modelo, no por el solver:
 *   1. comparar 4×4 contra una referencia de 8×8  → «regresión» de −7 %;
 *   2. leer el Ux del modelo de FLEXIÓN en el caso Membrane → salía 0;
 *   3. recalcular la J como momento POLAR en vez de SAINT-VENANT (1.51× en la
 *      viga 0.30x0.50) → «el WASM no acopla barra con cáscara», 6.6 %.
 *
 * De ahí que el JSON traiga la malla Y las secciones ya calculadas: lo que no se
 * recalcula aquí, no se puede equivocar aquí.
 */
// Membrane bajado de 1.5 % a 0.5 % el 19-ago-2026 con el defecto en el
// `drillingTypes = 8`: pasa de 0.745 % a 0.283 %. Thin y Thick no se mueven
// (0.025 % y 2.627 %), porque el drilling no los toca.
const LIMITE = { Membrane: 0.5, Thin: 0.5, Thick: 3.5 };

export const nombre = "banco-shell-escalon-b";
export const descripcion =
  "losa + vigas + columnas (escalón B) con los 3 tipos de cáscara, contra ETABS 22";

export async function correr() {
  const m = JSON.parse(readFileSync(JSON_BANCO, "utf-8"));
  const { deform } = await empaquetar(
    `export { deform } from "${R}/hekatan-fem/src/index";\n`, "bancoB");

  const filas = [{
    que: "la malla es la de la referencia (8×8), no otra",
    medido: (m.nx === 8 && m.ny === 8) ? 0 : 1, limite: 0,
    ok: m.nx === 8 && m.ny === 8,
    detalle: `${m.nx}×${m.ny} · ${m.casos.flexion.nodos.length} nudos · ${m.casos.flexion.shells.length} cáscaras`
             + " — comparar contra otra malla fue lo que simuló una regresión que no existía",
    crudo: false,
  }];

  // ⚠️ Las secciones vienen YA CALCULADAS en el JSON, no se recalculan aquí.
  // Recalcularlas fue el tercer fallo del día: el banco usa la J de
  // SAINT-VENANT (Roark para rectángulo) y aquí se puso el momento POLAR, que
  // en la viga 0.30x0.50 sale 1.51 veces mayor. Eso rigidiza la torsión de las
  // vigas y bajaba la flecha un 6.6 % — que se interpretó como «el WASM no
  // acopla bien barra con cáscara». No era el motor: era el modelo mal montado.

  for (const tipo of ["Membrane", "Thin", "Thick"]) {
    // ⚠️ El caso Membrane NO es el mismo modelo con otra propiedad: lleva la
    // carga EN EL PLANO (`modelo(escalon, membrana=True)` en banco_shell.py),
    // mientras los otros dos cargan a gravedad. Montar el de flexión y leerle
    // el Ux da CERO, que es lo que pasó la primera vez.
    const c = m.casos[tipo === "Membrane" ? "membrana" : "flexion"];
    const nodes = c.nodos, elements = [...c.barras, ...c.shells];
    const supports = new Map(), loads = new Map();
    for (const [k, v] of Object.entries(c.apoyos)) supports.set(+k, v);
    for (const [k, v] of Object.entries(c.cargas)) loads.set(+k, v);
    const th=new Map(), el=new Map(), po=new Map(), de=new Map(), pf=new Map();
    const ar=new Map(), iy=new Map(), iz=new Map(), tc=new Map(), sm=new Map();
    // sin `orientations`: el banco de Python tampoco las fija, y forzar
    // [0,0,1] en una columna VERTICAL es degenerado (fue el segundo fallo).
    c.barras.forEach((_, k) => {
      const s = m.secciones[c.sec[k]];
      el.set(k, m.E); po.set(k, m.nu); sm.set(k, m.E/(2*(1+m.nu))); de.set(k, 0);
      ar.set(k, s.A); iy.set(k, s.I22); iz.set(k, s.I33); tc.set(k, s.J);
    });
    c.shells.forEach((_, j) => {
      const k = c.barras.length + j;
      th.set(k, m.t); el.set(k, m.E); po.set(k, m.nu); de.set(k, 0);
      pf.set(k, FORM[tipo]);
    });
    const d = deform(nodes, elements, { supports, loads },
      { thicknesses: th, elasticities: el, poissonsRatios: po, densities: de,
        areas: ar, momentsOfInertiaY: iy, momentsOfInertiaZ: iz,
        torsionalConstants: tc, shearModuli: sm, plateFormulations: pf });
    // Membrane trabaja en su plano (Ux); las otras dos flectan (Uz)
    const comp = tipo === "Membrane" ? 0 : 2;
    const v = d.deformations?.get(c.centro)?.[comp] ?? NaN;
    const ref = m.etabs[tipo];
    const err = Math.abs(v / ref - 1) * 100;
    filas.push({
      que: `${tipo} — flecha del centro contra ETABS`,
      medido: err, limite: LIMITE[tipo], ok: err <= LIMITE[tipo],
      detalle: `Hekatan ${v.toExponential(6)} vs ETABS ${ref.toExponential(6)}`,
    });
  }
  return filas;
}
