/**
 * PLANTILLAS — el «New Model Quick Templates» de Hekatan Struct.
 *
 * Jorge: *"una cosa son ejemplos y otra Plantillas. Haz uno de plantillas donde
 * uno decida si es pórtico plano, pórtico 3D, pórtico con aporte de la losa…
 * cuando se pone nuevo modelo… dentro de nuevo modelo, en sub categorías"*.
 *
 * ## Ejemplo ≠ Plantilla
 *
 * Un **ejemplo** es un caso cerrado: la zapata de Guerra, el Cook, el Test M.
 * Se abre para MIRAR cómo se resuelve algo, y sus números están arbitrados
 * contra otro programa.
 *
 * Una **plantilla** es un punto de partida: se elige la tipología, se dan las
 * luces y los pisos, y sale un modelo **ya montado y resuelto** sobre el que se
 * empieza a trabajar. Es lo que hace ETABS en `File → New Model`, y por eso las
 * cajas de aquí son las mismas que las suyas: rejilla en planta (nº de líneas y
 * separación en X e Y) y pisos (nº, altura típica y altura del primer piso).
 *
 * ## Las tipologías, y qué cambia de una a otra
 *
 * | plantilla | qué monta | para qué |
 * |---|---|---|
 * | **Pórtico plano (2D)** | un solo eje: columnas + vigas en X | el caso de clase, el que se puede comprobar a mano |
 * | **Pórtico 3D** | todos los ejes, vigas en X **y** en Y | el edificio desnudo, sin losa |
 * | **Pórtico + losa** | lo anterior **más la losa** como cáscara | ver el APORTE de la losa: cuánto rigidiza |
 * | **Solo rejilla** | nudos y columnas, sin vigas | arrancar y dibujar encima |
 * | **Losa plana** | solo la losa sobre columnas (sin vigas) | flat slab |
 * | **Losa con vigas de borde** | losa + vigas solo en el perímetro | el caso intermedio |
 *
 * Las tres primeras son la pregunta que hizo Jorge, y juntas responden la que
 * está detrás: **cuánto aporta la losa**. Se abre `Pórtico 3D`, se anota la
 * flecha o el periodo, se cambia a `Pórtico + losa` con los MISMOS parámetros y
 * se compara. Esa es la gracia de que sea un selector y no seis ejemplos
 * sueltos: lo único que cambia entre pasada y pasada es lo que se quiere medir.
 *
 * ## Rejilla: uniforme o a mano
 *
 * Por defecto es uniforme, como el `Uniform Grid Spacing` de ETABS. Si se
 * escriben ordenadas en `ejes X (m)` / `ejes Y (m)` —`0, 6, 12, 18`— mandan
 * esas, que es el `Custom Grid Spacing` de su segunda ventana. Igual con los
 * niveles: `alturas (m)` gana sobre `nº de pisos` + `altura típica`.
 *
 * Se escriben como texto y no como tabla a propósito: una tabla de ordenadas
 * necesita un widget entero, y `0, 6, 12, 18` se teclea más rápido de lo que se
 * rellena una tabla.
 */
import { deform, analyze, modalAnalysis, type Node, type Element } from "hekatan-fem";
import type { ExampleDef } from "../workspace/exampleRegistry";

const G = 9.80665;

/** Tipologías. El número es lo que viaja en el parámetro `tipo`. */
const T_PORTICO_2D = 0;
const T_PORTICO_3D = 1;
const T_PORTICO_LOSA = 2;
const T_SOLO_REJILLA = 3;
const T_LOSA_PLANA = 4;
const T_LOSA_VIGAS_BORDE = 5;
const T_DUAL = 6;              // pórtico + losa + MUROS de corte
const T_ARRIOSTRADO = 7;       // pórtico con diagonales — el `Braced Frame
                               // [Concentric]` de SAP2000, leído del binario

/**
 * Lee ordenadas escritas a mano (`"0, 6, 12"`). Devuelve `null` si el texto no
 * sirve, y entonces manda la rejilla uniforme — nunca a medias: una lista con un
 * número mal escrito daría un modelo con un eje fuera de sitio y nadie lo vería.
 */
function ordenadas(txt: unknown): number[] | null {
  if (typeof txt !== "string") return null;
  const t = txt.trim();
  if (!t) return null;
  const v = t.split(/[,;\s]+/).filter(Boolean).map(Number);
  if (v.length < 2 || v.some((x) => !Number.isFinite(x))) return null;
  return [...new Set(v)].sort((a, b) => a - b);
}

/** Los ejes de un lado: los escritos a mano, o `n` líneas cada `s` metros. */
function ejes(txt: unknown, n: number, s: number): number[] {
  const dado = ordenadas(txt);
  if (dado) return dado;
  const k = Math.max(2, Math.round(n));
  return Array.from({ length: k }, (_, i) => i * s);
}

/** El último de una lista. `Array.at()` pide es2022 y aquí el target es menor. */
const ult = (v: number[]) => (v.length ? v[v.length - 1] : 0);

/** Los niveles, contando que el primer piso puede tener otra altura. */
/**
 * Modificadores de una losa NERVADA respecto a la maciza de su canto total.
 * Portado de `galpon-bodega-electoral/a_heks.py`, donde ya esta validado
 * contra ETABS. La cascara se declara con el canto total `h`, asi que su
 * inercia es h^3/12 por metro — muy superior a la real, porque entre nervio y
 * nervio solo hay loseta. El modificador es la razon de inercias, sacada de la
 * seccion T equivalente por metro.
 *
 * Devuelve los 8 en el orden del .e2k: F11 F22 F12 · M11 M22 M12 · V13 V23.
 */
function modsNervada(h: number, tLoseta: number, bNervio: number,
                     sep: number, dosDirecciones: boolean): number[] {
  const b = bNervio / sep;                 // ancho de alma por metro
  const ha = h - tLoseta;                  // altura del alma
  const A1 = tLoseta * 1.0, y1 = h - tLoseta / 2;
  const A2 = ha * b, y2 = ha / 2;
  const yg = (A1 * y1 + A2 * y2) / (A1 + A2);
  const I = tLoseta ** 3 / 12 + A1 * (y1 - yg) ** 2
          + b * ha ** 3 / 12 + A2 * (y2 - yg) ** 2;
  const f = I / (h ** 3 / 12);
  // en la direccion SIN nervio solo trabaja la loseta
  const fCruz = dosDirecciones ? f : (tLoseta ** 3 / 12) / (h ** 3 / 12);
  // ⚠️ El CORTANTE TRANSVERSAL no se escala con la razon de inercias: lo toman
  // las almas, y su area es del orden de la placa maciza. Escalarlo dejaba la
  // losa artificialmente blanda (nervada: -231 mm contra los -46 de ETABS).
  // La TORSION va con la MEDIA GEOMETRICA de las dos flexiones (Huber): poner
  // el minimo le quita toda la rigidez a torsion, y en una nervada los nervios
  // y la loseta forman celdas que si torsionan.
  return [1, 1, 1, f, fCruz, Math.sqrt(f * fCruz), 1, 1];
}

function niveles(txt: unknown, pisos: number, h: number, h1: number): number[] {
  const dado = ordenadas(txt);
  if (dado) return dado[0] === 0 ? dado : [0, ...dado];
  const n = Math.max(1, Math.round(pisos));
  const z = [0, h1];
  for (let i = 1; i < n; i++) z.push(h1 + i * h);
  return z;
}

const PARAMS = {
  tipo: {
    default: T_PORTICO_3D,
    options: {
      "▦ Pórtico plano (2D)": T_PORTICO_2D,
      "🏗 Pórtico 3D": T_PORTICO_3D,
      "🧱 Pórtico + losa (aporte de losa)": T_PORTICO_LOSA,
      "⬚ Solo rejilla (nudos + columnas)": T_SOLO_REJILLA,
      "▭ Losa plana sobre columnas": T_LOSA_PLANA,
      "▣ Losa con vigas de borde": T_LOSA_VIGAS_BORDE,
      "🧱🧱 Pórtico + losa + muros (dual)": T_DUAL,
      "⟋ Pórtico arriostrado (CBF)": T_ARRIOSTRADO,
    },
    label: "Plantilla",
  },

  // ── Rejilla en planta — el «Grid Dimensions (Plan)» de ETABS ──────────────
  nx: { default: 4, min: 2, max: 12, step: 1, label: "líneas en X", folder: "📐 Rejilla (planta)" },
  ny: { default: 4, min: 2, max: 12, step: 1, label: "líneas en Y", folder: "📐 Rejilla (planta)" },
  sx: { default: 6, min: 2, max: 15, step: 0.5, label: "separación X (m)", folder: "📐 Rejilla (planta)" },
  sy: { default: 6, min: 2, max: 15, step: 0.5, label: "separación Y (m)", folder: "📐 Rejilla (planta)" },

  // ── Pisos — el «Story Dimensions» ────────────────────────────────────────
  pisos: { default: 4, min: 1, max: 20, step: 1, label: "nº de pisos", folder: "🏢 Pisos" },
  etabsjoint: { default: 1, min: 0, max: 1, step: 1, label: "Comparar con (1 = ETABS: unión viga-muro de ETABS · 0 = SAP2000)", folder: "🏢 Pisos" },
  // El e2k le asigna el diafragma rígido D1 a las losas, así que ETABS analiza con él:
  // para comparar, Hekatan también (los nudos de cada planta atados en ux, uy, rz a un
  // maestro virtual en el centro de masa). 0 = flexible (la losa mallada, sin atar).
  // MEDIDO en ETABS 22 (3-sep-2026, dual de 1 planta con empuje en esquina): el D1 del e2k
  // solo ata los PUNTOS de la planta (los 16 nudos de eje de columna); los 244 nudos de la
  // malla de losa y los de muro NO se mueven como sólido rígido (rz distinto nudo a nudo).
  // 1 = como ETABS (ejes de columna) · 2 = rígido total (todos los nudos) · 0 = flexible.
  diafragma: { default: 1, min: 0, max: 3, step: 1, label: "diafragma (0 flexible · 1 ejes de columna, como ETABS · 2 rígido total · 3 total sin muros)", folder: "🏢 Pisos" },
  h: { default: 3.0, min: 2, max: 6, step: 0.1, label: "altura típica (m)", folder: "🏢 Pisos" },
  h1: { default: 3.5, min: 2, max: 8, step: 0.1, label: "altura 1er piso (m)", folder: "🏢 Pisos" },
  // ── Volado ───────────────────────────────────────────────────────────────
  // La losa se pasa `volado` metros del ultimo eje POR LOS CUATRO LADOS, y ahi
  // NO hay columna: es un voladizo de verdad, no un vano mas. 0 = sin volado.
  volado: { default: 0, min: 0, max: 3, step: 0.25, label: "volado perimetral (m)", folder: "🏢 Pisos" },
  // Solo se usan si la losa es Nervada o Waffle
  tLoseta: { default: 0.05, min: 0.03, max: 0.15, step: 0.01, label: "nervada: loseta (m)", folder: "🔩 Secciones" },
  bNervio: { default: 0.10, min: 0.05, max: 0.30, step: 0.01, label: "nervada: ancho nervio (m)", folder: "🔩 Secciones" },
  sNervio: { default: 0.60, min: 0.30, max: 1.50, step: 0.05, label: "nervada: separación (m)", folder: "🔩 Secciones" },

  // ── Material ─────────────────────────────────────────────────────────────
  material: {
    default: 0,
    options: { "🧱 Hormigón armado": 0, "⚙ Acero": 1 },
    label: "Material del pórtico",
    folder: "🔩 Secciones",
  },

  // ── Secciones y cargas ───────────────────────────────────────────────────
  bcol: { default: 0.40, min: 0.2, max: 1.2, step: 0.05, label: "columna, lado (m)", folder: "🔩 Secciones" },
  // Brazos rigidos AUTOMATICOS de ETABS: RZ = 0 (no rigidizan) pero ETABS no pesa ni masa el tramo
  // de viga que cae dentro de la columna (medio lado a cada extremo). Medido el 8-sep-2026 por OAPI:
  // Dead 136.8 = 144.0 - 4 vigas x 2 x 0.25 m; y +2.88 % en los periodos del Paz 6.3. Las columnas
  // no se descuentan. Con 1 (defecto, ETABS) la viga pesa y masa con L - b_col; con 0 = SAP2000.
  offsets: { default: 1, min: 0, max: 1, step: 1, label: "brazos rígidos (1 ETABS · 0 SAP2000)", options: { "ETABS (automáticos: solo peso y masa)": 1, "Ninguno (SAP2000)": 0 }, folder: "🔩 Secciones" },
  bviga: { default: 0.30, min: 0.15, max: 0.8, step: 0.05, label: "viga, ancho (m)", folder: "🔩 Secciones" },
  hviga: { default: 0.50, min: 0.2, max: 1.2, step: 0.05, label: "viga, canto (m)", folder: "🔩 Secciones" },
  tlosa: { default: 0.20, min: 0.08, max: 0.6, step: 0.01, label: "losa, espesor (m)", folder: "🔩 Secciones" },
  tmuro: { default: 0.25, min: 0.15, max: 0.6, step: 0.05, label: "muro, espesor (m)", folder: "🔩 Secciones" },
  bdiag: { default: 0.15, min: 0.05, max: 0.4, step: 0.01, label: "diagonal, lado (m)", folder: "🔩 Secciones" },

  // ── Formulación de la cáscara — el «Shell Thin / Shell Thick» de ETABS ────
  //
  // Se elige aquí, como en ETABS, y va tanto al ANÁLISIS como al `.e2k` que se
  // exporta (`e2kExporter` ya traduce este mismo número a `MODELINGTYPE`).
  // El despachador del motor (`getLocalStiffnessMatrix.cpp`) entiende:
  //   1 = Kirchhoff MZC (Shell-Thin) · 0 = Mindlin MITC4 (Shell-Thick)
  //
  // ⚠️ El defecto es THIN a propósito, y está MEDIDO (2026-08-26, plantilla
  // dual de 4 pisos exportada a e2k y corrida en ETABS 22 con `etabs-cli`):
  // con Thin en los muros el modal cierra en **−0.19 %** contra ETABS
  // (T₁ 0.6903 vs 0.6916) y la masa Uy en 88.7 % vs 88.59 %. Con el MITC4
  // salía **−7.3 %**, porque sobre-rigidiza fuera del plano en paneles
  // alargados (0.5 × 3.5 m). En el propio ETABS, Thin y Thick del muro dan lo
  // mismo (0.1 %) — su «Shell-Thick» no es un MITC4.
  // Los MISMOS numeros que la OAPI de CSI: 0 Thick · 1 Thin · 2 Membrana.
  // «Membrana» es la losa que NO toma flexion: solo reparte su carga a las
  // vigas, como el deck o la maciza declarada membrana en ETABS.
  formLosa: {
    default: 1,
    options: {
      "Shell-Thin (Kirchhoff)": 1,
      "Shell-Thick (Mindlin MITC4)": 0,
      "Membrana (sin flexión)": 2,
      // PLATE = flexion PURA, sin membrana. En SAP2000 es un tipo propio
      // (Plate-Thin / Plate-Thick); ETABS no lo expone en su GUI, pero el
      // motor de CSI si lo tiene: su manual dice «you can choose to model
      // pure-membrane, pure-plate, or full-shell behavior» (§10.1.1).
      //
      // ⚠️ 3 NO se puede usar: en el C++ ya significa DKMQ de Katili.
      // 40/41 no chocan con nada y en `build` se traducen a Thin/Thick + el
      // modificador de MEMBRANA a 0, que es justo «sin membrana».
      "Plate-Thin (flexión pura)": 40,
      "Plate-Thick (flexión pura)": 41,
      // Ortotropas: la cascara se declara con el CANTO TOTAL y se le baja la
      // inercia con modificadores DIRECCIONALES. La nervada solo en el sentido
      // del nervio; la waffle en los dos.
      "Nervada (1 dirección)": 50,
      "Waffle (2 direcciones)": 51,
    },
    label: "losa, formulación", folder: "🔩 Secciones",
  },
  formMuro: {
    default: 1,
    options: { "Shell-Thin (Kirchhoff)": 1, "Shell-Thick (Mindlin MITC4)": 0 },
    label: "muro, formulación", folder: "🔩 Secciones",
  },
  fc: { default: 240, min: 180, max: 500, step: 10, label: "f'c (kg/cm²)", folder: "🔩 Secciones" },
  q: { default: 5.0, min: 0, max: 20, step: 0.5, label: "carga de piso (kN/m²)", folder: "⬇ Cargas" },
  // ── El mallado, como lo hace ETABS ───────────────────────────────────────
  //
  // Leído de las propias cadenas de ayuda de `ETABS.exe`:
  //
  //   «Determines how the floor is meshed. Default behavior is auto COOKIE CUT
  //    at beams and walls if membrane, auto rectangle mesh if shell/plate.»
  //   «Indicates if the elements that are cookie cut are to be further meshed
  //    to a MAX ELEMENT SIZE.»
  //
  // O sea DOS etapas: (1) cortar la losa por cada línea de viga y de muro, y
  // (2) volver a mallar cada trozo hasta un tamaño máximo. Aquí los ejes SON las
  // líneas de viga, así que la etapa 1 sale sola; esta caja es la etapa 2, y va
  // en METROS como en ETABS (`SetAutoMesh` con `MeshType = 3 · MaxSize`), no en
  // «divisiones por vano».
  //
  // ⚠️ No es un detalle de precisión: con 2 divisiones en un vano de 6 m salen
  // elementos de 3 metros y la losa se deforma a saltos — se ve en pantalla
  // antes que en ningún número.
  //
  // **El defecto es 1.25 m porque ES el de ETABS**, medido y luego leído del
  // propio programa (2026-08-27). Antes era 0.5 m —el que usa `test-m-dual`—
  // que son 6.25 veces más elementos por paño que los que arma ETABS.
  //
  // Medido: se le pasó a ETABS 22 un e2k con UN área por paño y
  // `OBJMESHTYPE "DEFAULT"`, y se contó lo que él malló solo:
  //   paño 6 m → 5×5 (1.200 m) · paño 5 m → 4×4 (1.250 m) · paño 4 m → 4×4 (1.000 m)
  // Las tres acotan el máximo a [1.25, 1.333). Y leyendo su propia tabla
  // `Analysis Options - Automatic Mesh Settings for Floors` por la OAPI:
  //   MeshOpt = General · **MaxMeshSize = 1.25** (y lo mismo para muros).
  // De paso: los muros RECTOS ETABS no los malla ("Default: No Meshing for
  // Straight Walls", de las cadenas de ETABS.dll).
  //
  // Lo que cuesta y lo que se gana (plantilla dual, 4 pisos):
  //   0.50 m  5514 nudos  1079 ms  flecha −2.9081 mm
  //   1.25 m  1048 nudos   115 ms  flecha −2.8549 mm  (−1.83 %)
  // 9 veces más rápido; los PERIODOS no se mueven de la cuarta cifra.
  ms: { default: 1.25, min: 0.15, max: 3, step: 0.05,
        label: "malla máx. (m) — como ETABS", folder: "📐 Rejilla (planta)" },

  // ── La malla DEL MODAL, aparte ───────────────────────────────────────────
  //
  // El modal no necesita la malla fina: la piden la flecha de la losa y los
  // esfuerzos. Medido (2026-08-26, plantilla dual, 4 pisos):
  //
  //   malla   GDL      estático   T1       T2       T3
  //   0.50 m  33 084   1082 ms    0.6800   0.2151   0.1828
  //   1.00 m   8 820    291 ms    0.6803   0.2152   0.1828
  //   2.00 m   2 520    112 ms    0.6803   0.2151   0.1824
  //
  // Y por esta misma `runModal`, con el modal entero: **1714 ms con 0.5 m
  // contra 516 ms con 1.0 m** — 3.3 veces, y los periodos no se mueven de la
  // cuarta cifra (la masa Uy queda en 88.0 % en las tres). Se remalla a 1 m
  // por su cuenta, sin tocar el modelo que se ve ni el estático. Ponerlo igual
  // que `ms` desactiva el remallado y usa el modelo tal cual.
  msModal: { default: 1.25, min: 0.15, max: 3, step: 0.05,
             label: "malla del modal (m)", folder: "📐 Rejilla (planta)" },
};

// ── Cuánto va a tardar, ANTES de tardarlo ────────────────────────────────────
//
// Las mismas curvas medidas que usa `test-m` (testM.ts:244) — el solver corre en
// el HILO PRINCIPAL, así que mientras calcula la pestaña no responde. El ejemplo
// avisaba y dejaba cancelar; la plantilla no, y por eso "se colgaba" sin decir
// nada. Umbral más bajo que el de test-m (20 s) porque aquí se cambia de
// plantilla con un clic y no hay «Correr» de por medio.
const segDeform = (dof: number) => 3.77e-10 * Math.pow(dof, 2.05);
const segModal = (dof: number) => 2.07e-11 * Math.pow(dof, 2.5);
const SEG_CONFIRMAR = 5;

/** Pregunta si vale la pena seguir. `true` = seguir. Sin `confirm` (Node), sigue. */
function confirmarSiTarda(dof: number, seg: number, nudos: number, malla: number,
                          que: string): boolean {
  if (seg <= SEG_CONFIRMAR || typeof confirm !== "function") return true;
  return confirm(
    `Modelo grande: ${dof.toLocaleString()} grados de libertad ` +
    `(${nudos.toLocaleString()} nudos, malla ${malla} m).

` +
    `${que} va a tardar ~${Math.round(seg)} s y la página queda sin responder ` +
    `mientras calcula (el solver corre en el hilo principal).

` +
    `¿Continuar? — Subir «malla máx. (m)» o bajar pisos/líneas lo hace mucho más rápido.`
  );
}

export const plantillas: ExampleDef = {
  id: "plantillas",
  name: "📐 Plantillas — nuevo modelo (pórtico 2D / 3D / con losa)",
  category: "🧪 Utilidades",
  // El color por defecto es el DESPLAZAMIENTO, no von Mises. En una losa el von
  // Mises sale moteado de por sí —tiene picos en las líneas de viga y en el
  // centro de cada paño— y se lee como si la deformada estuviera mal. Con el
  // desplazamiento se ven los paños hundiéndose entre vigas, que es lo que hay
  // que ver al abrir una plantilla.
  defaultShellResult: "displacementZ",
  availableShellResults: ["displacementZ", "bendingXX", "bendingYY", "vonMises"],
  hasModal: true,
  params: PARAMS,

  build(p, states) {
    const tipo = Math.round(p.tipo);
    const X = ejes((p as any).ejesX, p.nx, p.sx);
    const Y = tipo === T_PORTICO_2D ? [0] : ejes((p as any).ejesY, p.ny, p.sy);
    const Z = niveles((p as any).alturas, p.pisos, p.h, p.h1);

    const conVigas = tipo !== T_SOLO_REJILLA && tipo !== T_LOSA_PLANA;
    const soloBorde = tipo === T_LOSA_VIGAS_BORDE;
    const conLosa = tipo === T_PORTICO_LOSA || tipo === T_LOSA_PLANA
                 || tipo === T_LOSA_VIGAS_BORDE || tipo === T_DUAL;
    const conMuros = tipo === T_DUAL;
    const conDiagonales = tipo === T_ARRIOSTRADO;

    // ── La malla fina ───────────────────────────────────────────────────────
    // Los EJES son donde van las columnas; entre eje y eje se meten `div-1`
    // nudos más para que las vigas y la losa tengan puntos intermedios. Sin eso
    // no hay centro de vano y la flecha que se lee no es la del vano.
    const finos = (v: number[], d: number, vol?: boolean[]) => {
      const out: number[] = [], esEje: boolean[] = [], esVol: boolean[] = [];
      for (let i = 0; i < v.length - 1; i++)
        for (let s = 0; s < d; s++) {
          out.push(v[i] + (v[i + 1] - v[i]) * s / d);
          esEje.push(s === 0);
          // ⚠️ el nudo s=0 ES el eje v[i], asi que mira SOLO su extremo. Con
          // `vol[i] || vol[i+1]` el ULTIMO eje real quedaba marcado de volado
          // por ser vecino del tramo volado, y se quedaba sin columna: 16 -> 9.
          // Los intermedios (s>0) si estan dentro del tramo, y ahi vale el OR.
          esVol.push(!!(vol && (s === 0 ? vol[i] : (vol[i] || vol[i + 1]))));
        }
      out.push(v[v.length - 1]); esEje.push(true);
      esVol.push(!!(vol && vol[v.length - 1]));
      return { c: out, eje: esEje, vol: esVol };
    };
    // Etapa 2 de ETABS: cada vano se parte en tantos trozos como haga falta
    // para que ninguno pase del tamaño máximo. Se toma el vano más corto para
    // que la malla sea uniforme y los nudos de vanos contiguos coincidan — si
    // cada vano se partiera por su cuenta, dos vanos distintos no compartirían
    // nudo en la línea que los separa y la losa quedaría cosida a medias.
    const luzMin = Math.min(
      ...X.slice(1).map((v, i) => v - X[i]),
      ...(Y.length > 1 ? Y.slice(1).map((v, i) => v - Y[i]) : [Infinity]));
    const D = Math.max(1, Math.min(24, Math.ceil(luzMin / Math.max(0.05, p.ms))));
    // ── El volado ───────────────────────────────────────────────────────────
    // Se añade un eje mas a cada lado, a `vol` metros, y se marca como DE
    // VOLADO para que ahi no se plante columna. La luz minima se calculo ANTES
    // con los ejes de verdad: si no, un volado de 0.5 m re-mallaria el edificio
    // entero a 0.5 y se irian los tiempos y la comparacion.
    const vol = conLosa ? Math.max(0, (p as any).volado || 0) : 0;
    const hayVol = vol > 1e-6;
    const ampl = (v: number[]) => hayVol ? [v[0] - vol, ...v, ult(v) + vol] : v;
    const marca = (v: number[]) => hayVol
      ? [true, ...v.map(() => false), true] : v.map(() => false);
    const XV = ampl(X), volX = marca(X);
    const YV = Y.length > 1 ? ampl(Y) : Y;
    const volY = Y.length > 1 ? marca(Y) : Y.map(() => false);
    const fx = finos(XV, D, volX);
    const fy = YV.length > 1 ? finos(YV, D, volY)
                             : { c: [0], eje: [true], vol: [false] };
    const XF = fx.c, YF = fy.c;

    // ── Nudos: la malla fina repetida en cada nivel ─────────────────────────
    //
    // ⚠️ SIN LOSA solo se crean los nudos que van a tener algo colgando: los de
    // las líneas de eje (por donde corren vigas y columnas). Antes se creaba la
    // malla entera siempre, así que un «Pórtico 3D» salía con 6845 nudos y 1216
    // elementos — más de cinco mil nudos HUÉRFANOS, sin un solo elemento que los
    // tocara. No dan error (el solver saca los GDL sin rigidez), pero se dibujan,
    // engordan el modelo y falsean cualquier cuenta que mire «nudos».
    const hayLosaAqui = conLosa && YF.length > 1;
    /**
     * ¿Va a colgar algo de este nudo? Es lo único que decide si existe.
     *
     *  · un **cruce de ejes** siempre: ahí nace una columna;
     *  · un nudo de una **línea de eje** solo por encima de la base, y solo si
     *    hay vigas: es un tramo de viga;
     *  · cualquier otro solo si hay **losa** que lo sujete, y tampoco en la base.
     *
     * En la BASE solo viven los cruces. Antes se creaba la malla fina completa
     * en todos los niveles, así que la planta de cimentación entera —1353 nudos
     * en «Pórtico + losa»— se quedaba sin un solo elemento.
     */
    // ⚠️ Los MUROS y las DIAGONALES arrancan en la base, así que sus nudos
    // tienen que existir tambien en k = 0 aunque no sean cruce de ejes. Sin
    // esto, `N(i, j, 0)` devolvía `undefined` para los nudos intermedios del
    // muro, el elemento salía con un nudo inexistente y `analyze` reventaba en
    // `computeQ4ShellStresses` — el `deform` en cambio seguía y daba un número.
    const hastaMuro = Math.min(D, XF.length - 1);
    const medioD = D % 2 === 0 ? D / 2 : -1;
    // ⚠️ El MURO ocupa toda la banda, así que necesita todos sus nudos. Las
    // DIAGONALES en cambio solo tocan tres columnas —los dos extremos del vano y
    // el centro de la viga—, y mantener viva la banda entera dejaba 22 nudos
    // huérfanos en el arriostrado. Cada uno pide lo suyo, ni más ni menos.
    const enMuro = (i: number, j: number, k: number) => {
      if (j !== 0 && j !== YF.length - 1) return false;
      if (conMuros) return i <= hastaMuro;                // el muro ocupa la banda entera
      if (!conDiagonales) return false;
      // La V invertida arranca en las ESQUINAS de abajo y sube al centro de la
      // viga de arriba: el nudo del centro solo hace falta de la primera planta
      // para arriba. Mantenerlo vivo en la base dejaba 2 huérfanos.
      if (i === 0 || i === hastaMuro) return true;
      return medioD > 0 && i === medioD && k > 0;
    };
    const vive = (i: number, j: number, k: number) => {
      const cruce = fx.eje[i] && fy.eje[j];
      if (cruce) return true;
      if (enMuro(i, j, k)) return true;                // muro o diagonal: hasta abajo
      if (k === 0) return false;                       // la base: solo columnas
      if (hayLosaAqui) return true;                    // la losa sujeta todo
      if (conVigas && (fx.eje[i] || fy.eje[j])) return true;   // tramo de viga
      return false;
    };
    const nodes: Node[] = [];
    const idx = new Map<string, number>();
    for (let k = 0; k < Z.length; k++)
      for (let j = 0; j < YF.length; j++)
        for (let i = 0; i < XF.length; i++) {
          if (!vive(i, j, k)) continue;
          idx.set(`${i},${j},${k}`, nodes.length);
          nodes.push([XF[i], YF[j], Z[k]]);
        }
    const N = (i: number, j: number, k: number) => idx.get(`${i},${j},${k}`)!;

    const elements: Element[] = [];
    const clase: ("col" | "viga" | "losa" | "muro" | "diag")[] = [];
    const push = (e: number[], c: "col" | "viga" | "losa" | "muro" | "diag") => {
      elements.push(e as unknown as Element); clase.push(c);
    };

    // ── Columnas: en cada cruce de ejes, entre niveles ──────────────────────
    for (let k = 0; k < Z.length - 1; k++)
      for (let j = 0; j < YF.length; j++)
        for (let i = 0; i < XF.length; i++)
          // ⚠️ en el volado NO hay columna: por eso es un voladizo
          if (fx.eje[i] && fy.eje[j] && !fx.vol[i] && !fy.vol[j])
            push([N(i, j, k), N(i, j, k + 1)], "col");

    // ── Vigas: en los niveles por encima de la base ─────────────────────────
    // En «losa con vigas de borde» solo van las del perímetro; ese es justo el
    // caso intermedio entre la losa plana y el pórtico completo.
    const bordeX = (j: number) => j === 0 || j === YF.length - 1;
    const bordeY = (i: number) => i === 0 || i === XF.length - 1;
    if (conVigas)
      for (let k = 1; k < Z.length; k++) {
        // vigas en X: van por las líneas donde hay eje en Y
        for (let j = 0; j < YF.length; j++) {
          if (!fy.eje[j]) continue;
          if (soloBorde && !bordeX(j)) continue;
          for (let i = 0; i < XF.length - 1; i++) push([N(i, j, k), N(i + 1, j, k)], "viga");
        }
        // vigas en Y: por las líneas donde hay eje en X
        if (YF.length > 1)
          for (let i = 0; i < XF.length; i++) {
            if (!fx.eje[i]) continue;
            if (soloBorde && !bordeY(i)) continue;
            for (let j = 0; j < YF.length - 1; j++) push([N(i, j, k), N(i, j + 1, k)], "viga");
          }
      }

    // ── Losa: un Q4 por paño, en cada nivel ─────────────────────────────────
    if (conLosa && YF.length > 1)
      for (let k = 1; k < Z.length; k++)
        for (let j = 0; j < YF.length - 1; j++)
          for (let i = 0; i < XF.length - 1; i++)
            push([N(i, j, k), N(i + 1, j, k), N(i + 1, j + 1, k), N(i, j + 1, k)], "losa");

    // ── Diagonales (CBF) ────────────────────────────────────────────────────
    // En «V invertida» (chevron) sobre el PRIMER vano de cada fachada en X: de
    // las dos bases del vano al centro de la viga de arriba. Necesita que haya
    // nudo en el centro del vano, o sea `divisiones por vano` par — con D impar
    // no hay centro y se cae a la diagonal simple de esquina a esquina.
    if (conDiagonales) {
      const hastaX = Math.min(D, XF.length - 1);
      const medio = D % 2 === 0 ? D / 2 : -1;
      for (let j = 0; j < YF.length; j++) {
        if (!fy.eje[j]) continue;
        for (let k = 0; k < Z.length - 1; k++) {
          if (medio > 0) {
            push([N(0, j, k), N(medio, j, k + 1)], "diag");
            push([N(hastaX, j, k), N(medio, j, k + 1)], "diag");
          } else {
            push([N(0, j, k), N(hastaX, j, k + 1)], "diag");
          }
        }
      }
    }

    // ── Muros de corte (sistema DUAL) ───────────────────────────────────────
    // Van en el PRIMER vano de X, en las dos fachadas de Y, y suben toda la
    // altura. Es la disposición más común y la que hace de verdad un sistema
    // dual: el pórtico toma la gravedad y los muros la mayor parte del corte.
    if (conMuros && YF.length > 1) {
      const hastaX = Math.min(D, XF.length - 1);   // un vano, de eje a eje
      for (const j of [0, YF.length - 1])
        for (let k = 0; k < Z.length - 1; k++)
          for (let i = 0; i < hastaX; i++)
            push([N(i, j, k), N(i + 1, j, k), N(i + 1, j, k + 1), N(i, j, k + 1)], "muro");
    }

    // ── Material y secciones ────────────────────────────────────────────────
    //
    // Hormigón: E por el ACI (15100·raíz(f'c) en kg/cm² -> kN/m²), secciones
    // MACIZAS.
    //
    // Acero: E = 200 GPa, y las secciones NO pueden ser macizas — una columna de
    // acero de 40×40 cm llena pesaría 1.26 t/m y no existe. Se toman los
    // perfiles que de verdad se usan, sacados de las MISMAS dimensiones que da
    // el usuario:
    //   · columna = TUBO cuadrado de pared b/25   (un HSS típico)
    //   · viga    = perfil I, alas h/20 y alma h/40
    // Así «pórtico de acero» y «pórtico de hormigón» se comparan con la misma
    // geometría sin que uno de los dos sea un disparate.
    const acero = Math.round(p.material) === 1;
    const E = acero ? 200e6 : 15100 * Math.sqrt(p.fc) * 98.0665;
    const NU = acero ? 0.30 : 0.20;
    const Gm = E / (2 * (1 + NU));
    const RHO = (acero ? 78.5 : 24) / G;

    let Ac: number, Ic: number, Jc: number, Av: number, I33: number, I22: number, Jv: number;
    if (acero) {
      const b = p.bcol, t = b / 25, bi = b - 2 * t;
      Ac = b * b - bi * bi;
      Ic = (Math.pow(b, 4) - Math.pow(bi, 4)) / 12;
      // Bredt para sección cerrada de pared delgada: J = 4·Am²·t / perímetro.
      const Am = Math.pow(b - t, 2);
      Jc = 4 * Am * Am * t / (4 * (b - t));
      const h = p.hviga, bf = p.bviga, tf = h / 20, tw = h / 40, hw = h - 2 * tf;
      Av = 2 * bf * tf + hw * tw;
      I33 = (bf * Math.pow(h, 3) - (bf - tw) * Math.pow(hw, 3)) / 12;
      I22 = (2 * tf * Math.pow(bf, 3) + hw * Math.pow(tw, 3)) / 12;
      Jv = (2 * bf * Math.pow(tf, 3) + hw * Math.pow(tw, 3)) / 3;   // abierta
    } else {
      Ac = p.bcol * p.bcol; Ic = Math.pow(p.bcol, 4) / 12; Jc = 0.141 * Math.pow(p.bcol, 4);
      Av = p.bviga * p.hviga;
      I33 = p.bviga * Math.pow(p.hviga, 3) / 12;   // plano del CANTO (fuerte)
      I22 = p.hviga * Math.pow(p.bviga, 3) / 12;
      Jv = I33 + I22;
    }

    const m = <T,>() => new Map<number, T>();
    const elasticities = m<number>(), poissonsRatios = m<number>(), shearModuli = m<number>(),
      densities = m<number>(), areas = m<number>(), momentsOfInertiaY = m<number>(),
      momentsOfInertiaZ = m<number>(), torsionalConstants = m<number>(),
      thicknesses = m<number>(), shearAreasY = m<number>(), shearAreasZ = m<number>(),
      plateFormulations = m<number>(), membraneModifiers = m<number>();
    const shellModifiers = new Map<number, number[]>();
    // La losa y los muros son de HORMIGÓN aunque el pórtico sea de acero: eso es
    // un edificio mixto de verdad, no un edificio de chapa.
    const Eh = 15100 * Math.sqrt(p.fc) * 98.0665, NUh = 0.20, RHOh = 24 / G;
    // brazos rigidos automaticos (ETABS): nudos donde llega una columna, y factor de longitud
    // "que pesa" de cada tramo de viga = (L - off_i - off_j) / L, con off = b_col / 2 en cada
    // extremo que toca columna (las columnas son cuadradas: el mismo medio lado en X y en Y)
    const nudosCol = new Set<number>();
    clase.forEach((c, e) => { if (c === "col") for (const n of elements[e] as unknown as number[]) nudosCol.add(n); });
    const factorBrazos = (e: number) => {
      if (Math.round((p as any).offsets ?? 1) !== 1) return 1;
      const [a, b] = elements[e] as unknown as number[];
      const L = Math.hypot(nodes[b][0] - nodes[a][0], nodes[b][1] - nodes[a][1], nodes[b][2] - nodes[a][2]);
      const off = (nudosCol.has(a) ? p.bcol / 2 : 0) + (nudosCol.has(b) ? p.bcol / 2 : 0);
      return L > 1e-9 ? Math.max(0, L - off) / L : 1;
    };
    clase.forEach((c, e) => {
      if (c === "losa" || c === "muro") {
        elasticities.set(e, Eh); poissonsRatios.set(e, NUh);
        shearModuli.set(e, Eh / (2 * (1 + NUh))); densities.set(e, RHOh);
        thicknesses.set(e, c === "muro" ? p.tmuro : p.tlosa);
        // PLATE (40/41) = flexion pura. No es una formulacion nueva del motor:
        // es Thin/Thick con la MEMBRANA a cero, que es lo que significa
        // «pure-plate» en el manual de CSI. Se traduce aqui para que el C++
        // reciba solo los valores que conoce (0/1/2/3).
        const fRaw = c === "muro" ? p.formMuro : p.formLosa;
        const esPlate = fRaw === 40 || fRaw === 41;
        const esNerv = fRaw === 50 || fRaw === 51;
        // Nervada / waffle son una cascara THIN normal con modificadores
        // DIRECCIONALES: el canto total manda la rigidez y los modificadores
        // la bajan a la real. (El peso lo lleva la densidad, aparte.)
        plateFormulations.set(e, esPlate ? (fRaw === 40 ? 1 : 0)
                               : esNerv ? 1 : fRaw);
        if (esPlate) membraneModifiers.set(e, 0);
        if (esNerv) {
          shellModifiers.set(e, modsNervada(p.tlosa, p.tLoseta, p.bNervio,
                                            p.sNervio, fRaw === 51));
        }
        return;
      }
      elasticities.set(e, E); poissonsRatios.set(e, NU);
      shearModuli.set(e, Gm); densities.set(e, RHO * (c === "viga" ? factorBrazos(e) : 1));
      if (c === "diag") {
        // La diagonal trabaja a AXIL; se deja cuadrada maciza (o tubo si el
        // pórtico es de acero) y con su inercia real, no articulada: articularla
        // pediría releases y eso es otra cosa.
        const b = p.bdiag;
        const t = acero ? b / 20 : b, bi = acero ? b - 2 * t : 0;
        const Ad = b * b - bi * bi, Id = (Math.pow(b, 4) - Math.pow(bi, 4)) / 12;
        areas.set(e, Ad);
        momentsOfInertiaZ.set(e, Id); momentsOfInertiaY.set(e, Id);
        torsionalConstants.set(e, 2 * Id);
        shearAreasY.set(e, 5 / 6 * Ad); shearAreasZ.set(e, 5 / 6 * Ad);
        return;
      }
      const A = c === "col" ? Ac : Av;
      areas.set(e, A);
      // ⚠️ Convención CSI: `momentsOfInertiaZ` es I33 (el plano del canto, el
      // eje fuerte de una viga) y `momentsOfInertiaY` es I22. Cruzarlos deja la
      // viga flexionando por el eje débil y la flecha sale varias veces mayor,
      // sin que nada avise.
      momentsOfInertiaZ.set(e, c === "col" ? Ic : I33);
      momentsOfInertiaY.set(e, c === "col" ? Ic : I22);
      torsionalConstants.set(e, c === "col" ? Jc : Jv);
      shearAreasY.set(e, 5 / 6 * A); shearAreasZ.set(e, 5 / 6 * A);
    });

    // ── Apoyos: empotrados en la base ───────────────────────────────────────
    const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
    nodes.forEach((pt, i) => {
      if (Math.abs(pt[2]) < 1e-9) supports.set(i, [true, true, true, true, true, true]);
    });
    // ⚠️ Aquí el pórtico plano llevaba una atadura fuera-de-plano en TODOS los
    // nudos, puesta «por si acaso» contra una singularidad. Sobraba y encima
    // engañaba: el visor dibuja un marcador de apoyo por cada nudo restringido,
    // así que el pórtico salía con un triángulo azul en cada junta y parecía
    // apoyado entero. Lo cazó Jorge mirando la pantalla — *«¿qué es ese
    // triángulo? ya hay nodos blancos, ¿qué es eso?»*.
    //
    // No hacía falta: las barras son vigas 3D con rigidez en los seis GDL y las
    // bases están empotradas, así que el pórtico no se cae fuera de su plano.
    // Medido: 35/35 nudos con apoyo -> 7/35, y la flecha sale IDÉNTICA
    // (3.2266 mm) sin un solo NaN.
    //
    // La regla: una atadura «por si acaso» no es gratis. Cambia lo que el
    // usuario ve y, si de verdad hiciera falta, taparía el fallo en vez de
    // enseñarlo.

    // ── Cargas: la de piso, repartida donde toque ───────────────────────────
    const loads = new Map<number, [number, number, number, number, number, number]>();
    const addZ = (n: number, fz: number) => {
      const c = loads.get(n) ?? [0, 0, 0, 0, 0, 0] as any;
      c[2] -= fz; loads.set(n, c);
    };
    // ⚠️ Mandato: la suma de lo aplicado tiene que ser `q · A_planta · nº pisos`,
    // salga por donde salga. Antes no cuadraba y nadie lo veía:
    //   · con vigas y sin losa se cargaban las de X y las de Y, CADA UNA con
    //     medio ancho tributario — y eso no es una partición del área: sale un
    //     33 % de más;
    //   · «solo rejilla» repartía `q·sx·sy/4` por nudo sin mirar si el nudo era
    //     de esquina, de borde o interior: un 56 % de MENOS.
    // Ahora se reparte PAÑO a PAÑO, que es lo único que garantiza el total.
    if (p.q > 0) {
      if (conLosa) {
        // Sobre la losa, el vector consistente del Q4: q·A/4 por esquina.
        clase.forEach((c, e) => {
          if (c !== "losa") return;
          const P = (elements[e] as unknown as number[]).map((n) => nodes[n]);
          const a = Math.hypot(P[1][0] - P[0][0], P[1][1] - P[0][1]);
          const b = Math.hypot(P[3][0] - P[0][0], P[3][1] - P[0][1]);
          for (const n of elements[e] as unknown as number[]) addZ(n, p.q * a * b / 4);
        });
      } else if (conVigas) {
        // Sin losa, cada PAÑO reparte su carga entre las cuatro vigas que lo
        // rodean —la mitad a las dos de X y la mitad a las dos de Y— y dentro de
        // cada viga se extiende por sus tramos. Así el total es exactamente
        // `q · A_paño` y no depende de cuántas veces se subdivida.
        const ejeX: number[] = [], ejeY: number[] = [];
        XF.forEach((_, i) => { if (fx.eje[i]) ejeX.push(i); });
        YF.forEach((_, j) => { if (fy.eje[j]) ejeY.push(j); });
        const enTramo = (a: number, b: number, k: number, fila: number, dirX: boolean, F: number) => {
          // reparto uniforme sobre los sub-nudos del tramo (media a cada extremo
          // de cada trocito, o sea trapecio de nudos: extremos F/2n, interiores F/n)
          const n = b - a;
          for (let t = a; t < b; t++) {
            const n1 = dirX ? N(t, fila, k) : N(fila, t, k);
            const n2 = dirX ? N(t + 1, fila, k) : N(fila, t + 1, k);
            addZ(n1, F / n / 2); addZ(n2, F / n / 2);
          }
        };
        const pisos2 = Z.length - 1;
        if (tipo !== T_PORTICO_2D)
        for (let k = 1; k <= pisos2; k++)
          for (let jj = 0; jj < ejeY.length - 1; jj++)
            for (let ii = 0; ii < ejeX.length - 1; ii++) {
              const i0 = ejeX[ii], i1 = ejeX[ii + 1], j0 = ejeY[jj], j1 = ejeY[jj + 1];
              const A = (XF[i1] - XF[i0]) * (YF[j1] - YF[j0]);
              const F = p.q * A;                       // lo que pesa el paño
              enTramo(i0, i1, k, j0, true, F / 4);     // viga X de abajo
              enTramo(i0, i1, k, j1, true, F / 4);     // viga X de arriba
              enTramo(j0, j1, k, i0, false, F / 4);    // viga Y de la izquierda
              enTramo(j0, j1, k, i1, false, F / 4);    // viga Y de la derecha
            }
        // El pórtico plano no tiene paños: es una sola fila de vanos, y su ancho
        // tributario es el de la crujía que representa.
        if (tipo === T_PORTICO_2D)
          for (let k = 1; k <= pisos2; k++)
            for (let ii = 0; ii < ejeX.length - 1; ii++) {
              const i0 = ejeX[ii], i1 = ejeX[ii + 1];
              enTramo(i0, i1, k, 0, true, p.q * (XF[i1] - XF[i0]) * p.sy);
            }
      } else {
        // Solo rejilla: no hay dónde meterla más que en los nudos de cada nivel.
        // Solo rejilla: no hay vigas ni losa, así que la carga del paño va a sus
        // cuatro esquinas. Un nudo interior recibe cuarto de los cuatro paños
        // que toca (= un paño entero) y uno de esquina solo un cuarto — que es
        // justo su área tributaria, y el total vuelve a ser `q·A`.
        const ejeX: number[] = [], ejeY: number[] = [];
        XF.forEach((_, i) => { if (fx.eje[i]) ejeX.push(i); });
        YF.forEach((_, j) => { if (fy.eje[j]) ejeY.push(j); });
        for (let k = 1; k < Z.length; k++)
          for (let jj = 0; jj < ejeY.length - 1; jj++)
            for (let ii = 0; ii < ejeX.length - 1; ii++) {
              const i0 = ejeX[ii], i1 = ejeX[ii + 1], j0 = ejeY[jj], j1 = ejeY[jj + 1];
              const F = p.q * (XF[i1] - XF[i0]) * (YF[j1] - YF[j0]) / 4;
              addZ(N(i0, j0, k), F); addZ(N(i1, j0, k), F);
              addZ(N(i1, j1, k), F); addZ(N(i0, j1, k), F);
            }
      }
    }

    states.nodes.val = nodes;
    states.elements.val = elements;
    // diafragma rigido por planta (todos los nudos de la cota, tambien los de muros y columnas)
    const diaphragms = new Map<number, number>();
    const modoDiaf = Math.round((p as any).diafragma ?? 1);
    if (modoDiaf >= 1) {
      // nudos de muro: los de los elementos de clase "muro" (variantes 2 y 3 para carear con ETABS)
      const nudosMuro = new Set<number>();
      clase.forEach((c, e) => { if (c === "muro") for (const n of elements[e]) nudosMuro.add(n); });
      // modo 1: solo los nudos de EJE de columna (los "puntos" de ETABS)
      const enEje = new Set<number>();
      for (const [key, ni] of idx) { const [i, j, k] = key.split(",").map(Number); if (k > 0 && fx.eje[i] && fy.eje[j]) enEje.add(ni); }
      nodes.forEach((n, i) => {
        const k = Z.findIndex(z => Math.abs(z - n[2]) < 1e-6); if (k <= 0) return;
        if (modoDiaf === 1) { if (enEje.has(i)) diaphragms.set(i, k); return; }
        if (nudosMuro.has(i) && modoDiaf === 3) return;
        diaphragms.set(i, k);
      });
    }
    states.nodeInputs.val = { supports, loads, ...(diaphragms.size ? { diaphragms } : {}) } as any;
    states.elementInputs.val = {
      etabsWallJoint: Math.round(p.etabsjoint ?? 1) === 1,
      elasticities, poissonsRatios, shearModuli, densities, areas,
      momentsOfInertiaY, momentsOfInertiaZ, torsionalConstants,
      thicknesses, shearAreasY, shearAreasZ, plateFormulations,
      membraneModifiers, shellModifiers,
    };
    states.objects3D.val = [];

    // `__soloModelo`: lo usa `runModal` para armar la malla gruesa del modal sin
    // pagar el estático otra vez (con malla 0.5 son ~1.1 s tirados a la basura).
    if ((p as any).__soloModelo) return;
    // ── Una puerta, no dos ───────────────────────────────────────────────────
    //
    // `rebuild()` del workspace (main.ts:1082) llama SIEMPRE a este `build()` y
    // DESPUÉS, si el caso activo es Modal, a `runModal()`. O sea: mover un slider
    // con el modal puesto pagaba el estático entero (~1.5 s con 33 000 GDL) para
    // tirarlo a la basura, porque lo que se muestra es el modo. El estático se
    // recupera solo al volver a un caso "Linear Static", que dispara otro rebuild.
    const caso = (globalThis as any).__hekatanActiveCase;
    if (typeof caso === "string" && caso.startsWith("Modal")) {
      console.info("[Plantillas] caso Modal activo: me salto el estático (lo resuelve runModal).");
      return;
    }
    // El modelo ya está armado (cuesta ~11 ms); lo caro es resolverlo (~99 %).
    // Si va a doler, se avisa y se puede cancelar: el modelo queda dibujado.
    const dofE = nodes.length * 6;
    if (!confirmarSiTarda(dofE, segDeform(dofE), nodes.length, p.ms, "El análisis estático")) {
      console.info("[Plantillas] estático cancelado:", dofE, "GDL. El modelo queda dibujado.");
      return;
    }
    try {
      states.deformOutputs.val = deform(nodes, elements, states.nodeInputs.val,
                                        states.elementInputs.val);
      states.analyzeOutputs.val = analyze(nodes, elements, states.elementInputs.val,
                                          states.deformOutputs.val);
    } catch (e) {
      console.error("[Plantillas] el solver no cerró:", e);
    }
  },

  /**
   * El modal es LA medida del aporte de la losa.
   *
   * La flecha vertical cambia poco entre `Pórtico 3D` y `Pórtico + losa` porque
   * las dos cuelgan de las mismas columnas. El PERIODO no: la losa amarra los
   * nudos de cada planta en su plano y el edificio se vuelve otra cosa. Es la
   * comparación que hay que hacer, y por eso la plantilla trae modal.
   *
   * ⚠️ Masa, no peso. `densities` guarda `24/g` en t/m³; si se pasara el peso
   * específico las frecuencias saldrían √9.81 = 3.13 veces mal.
   */
  runModal(p, states, modalPanel) {
    let nodes = states.nodes.val, elements = states.elements.val;
    let ni = states.nodeInputs.val, ei = states.elementInputs.val;
    // El modal se remalla a `msModal` (ver la nota del parámetro): con la malla
    // de dibujo tarda 13 veces más y devuelve los mismos periodos.
    const msM = (p as any).msModal ?? p.ms;
    let remallado = false;
    if (Math.abs(msM - p.ms) > 1e-9) {
      try {
        // ⚠️ En el `states` REAL, no en uno aparte. `animateMode` deforma la
        // malla MOSTRADA indexando `shape[i*6]`: si el modo viene de otra malla,
        // los nudos que sobran leen `undefined`, el `|| 0` los deja quietos y —
        // como la numeración va por niveles — **solo se mueven los primeros
        // pisos**. Es lo que pasó al meter `msModal`, y lo que ya avisaba el
        // comentario de `runModalEdificio` en testM.ts. La malla fina vuelve
        // sola al elegir un caso "Linear Static", que dispara otro rebuild.
        const mudo: any = { render() {}, clear() {}, show() {}, hide() {} };
        (plantillas.build as any)({ ...p, ms: msM, __soloModelo: true }, states, mudo);
        if (states.nodes.val.length && states.elements.val.length) {
          nodes = states.nodes.val; elements = states.elements.val;
          ni = states.nodeInputs.val; ei = states.elementInputs.val; remallado = true;
        }
      } catch (e: any) {
        console.warn("[Plantillas] no pude remallar para el modal, sigo con el modelo de pantalla:", e?.message);
      }
    }
    if (!nodes?.length || !elements?.length || !ni?.supports?.size || !ei?.densities?.size) return;
    const dofM = nodes.length * 6;
    if (!confirmarSiTarda(dofM, segModal(dofM), nodes.length, msM, "El modal")) {
      try {
        modalPanel.render({ frequencies: [], modeShapes: [], massParticipation: [] },
          { title: "Plantilla", properties: [`Modal cancelado: ${dofM.toLocaleString()} GDL con malla ${msM} m. Subí «malla del modal (m)» o bajá pisos/líneas.`] });
      } catch { /* el panel puede no estar montado */ }
      return;
    }
    try {
      // Masa solo lateral (el `INCLUDEVERTICALMASS "No"` del mass source de
      // ETABS): sin eso los modos verticales roban cupos y ΣUx/ΣUy no llegan.
      const out = modalAnalysis(nodes, elements, ni, ei, 12, 1);
      const NOM = ["Pórtico plano (2D)", "Pórtico 3D", "Pórtico + losa",
                   "Solo rejilla", "Losa plana", "Losa con vigas de borde",
                   "Pórtico + losa + muros (dual)", "Pórtico arriostrado (CBF)"];
      const T1 = out.frequencies?.[0] ? 1 / out.frequencies[0] : NaN;
      modalPanel.render(out, {
        title: `Plantilla · ${NOM[Math.round(p.tipo)] ?? ""}`,
        properties: [
          `${nodes.length} nudos · ${elements.length} elementos` +
            (remallado ? `  ·  malla del modal ${msM} m (la de pantalla es ${p.ms} m)` : ""),
          `T₁ = ${T1.toFixed(4)} s   (f₁ = ${out.frequencies?.[0]?.toFixed(4)} Hz)`,
          "Compará T₁ entre «Pórtico 3D» y «Pórtico + losa»: ahí se ve el aporte",
        ],
      });
    } catch (e: any) {
      console.warn("[Plantillas] modal:", e?.message);
    }
  },

  computedLabels(p, states) {
    const tipo = Math.round(p.tipo);
    const nodes = states.nodes?.val ?? [];
    const cls = states.elements?.val ?? [];
    const d = states.deformOutputs?.val?.deformations;
    let peor = 0;
    if (d) for (const v of d.values()) peor = Math.max(peor, Math.abs(v?.[2] ?? 0));
    const X = ejes((p as any).ejesX, p.nx, p.sx);
    const Z = niveles((p as any).alturas, p.pisos, p.h, p.h1);
    return {
      "nudos / elementos": `${nodes.length} / ${cls.length}`,
      "planta (m)": `${ult(X).toFixed(1)} × ${tipo === T_PORTICO_2D ? 0
        : ult(ejes((p as any).ejesY, p.ny, p.sy)).toFixed(1)}`,
      "altura total (m)": ult(Z).toFixed(2),
      "flecha máx. (mm)": (peor * 1000).toFixed(3),
      "material": Math.round(p.material) === 1 ? "acero (tubo + perfil I)" : "hormigón",
      "malla": (() => {
        const XX = ejes((p as any).ejesX, p.nx, p.sx);
        const YY = ejes((p as any).ejesY, p.ny, p.sy);
        const luz = Math.min(...XX.slice(1).map((v, i) => v - XX[i]),
                             ...YY.slice(1).map((v, i) => v - YY[i]));
        const d = Math.max(1, Math.min(24, Math.ceil(luz / Math.max(0.05, p.ms))));
        return `${d} div/vano · elemento ${(luz / d).toFixed(2)} m (tope ${p.ms} m)`;
      })(),
      "para comparar": "cambia solo la Plantilla y mira cuánto aporta la losa / los muros",
    };
  },
};
