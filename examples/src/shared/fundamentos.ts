/**
 * FUNDAMENTOS — «todo lo que usa Hekatan Struct», con su referencia y el archivo donde vive.
 *
 * Jorge, 26-sep-2026: dejar en el menú todo lo que usa el programa; al hacer clic en cada
 * entrada se explica qué es y dónde se usa. Sirve de respuesta a quien pregunta «¿qué mallador
 * / qué elemento usaste?» (investigadores de FEM).
 *
 * REGLA: cada dato sale del código o de su encabezado, no de memoria. Las rutas son
 * relativas a la raíz de `hekatan-struct/` y se comprobaron con el disco. Si una pieza existe
 * pero no está conectada, el campo `estado` lo dice.
 */
export type Fundamento = {
  id: string;
  orden: number;
  icono: string;
  grupo: "Mallado" | "Elementos" | "Solver" | "Validación" | "Origen";
  titulo: string;
  /** una línea, la que sale en el menú */
  resumen: string;
  /** qué es y cómo funciona, en lenguaje de ingeniería */
  que: string;
  referencias: string[];
  /** archivos donde vive, con una nota de para qué */
  donde: { ruta: string; nota?: string }[];
  /** activo · biblioteca sin conectar · solo mencionado … */
  estado: string;
};

export const FUNDAMENTOS: Fundamento[] = [
  // ───────────────────────────────────────────────────────────────────────────── MALLADO
  {
    id: "automesh", orden: 1, icono: "▦", grupo: "Mallado",
    titulo: "Automallado por rejilla bilineal (Q4)",
    resumen: "Parte cada paño Q4 en celdas de lado ≤ tam, como el automallado de ETABS.",
    que: "El comando `automesh <tam>` reparte la geometría por interpolación BILINEAL de las 4 esquinas del paño. " +
      "Un paño plano y recto sale exacto; uno alabeado, aproximado (igual que ETABS). Las celdas heredan espesor, material, " +
      "modificadores, tipo, ángulo y la presión del areaload; los nudos que ya existen se reutilizan. Sirve sobre todo al " +
      "importar un .e2k con la losa sin mallar: ETABS la malla y Hekatan resuelve la malla que se le da. " +
      "Medido contra ETABS en una losa 5×5: misma malla (25 nudos, 16 cáscaras).",
    referencias: ["Interpolación bilineal estándar de un cuadrilátero", "ETABS: AUTOMESHOPTIONS … FLOORMESHMAXSIZE 1250 (medido en su .$et, 8-sep-2026)"],
    donde: [
      { ruta: "examples/src/cli-modeler/cliModeler.ts", nota: "aplicarAutomesh; directiva `automesh <tam_m | off>` en el .heks" },
      { ruta: "tests/casos/automesh_vs_etabs.mjs", nota: "prueba contra el modelo de análisis de ETABS" },
    ],
    estado: "Activo (apagado por defecto).",
  },
  {
    id: "pavimentador", orden: 2, icono: "⬚", grupo: "Mallado",
    titulo: "Pavimentador (paños poligonales con hueco)",
    resumen: "Cuadriláteros en paños en L, con huecos o lados oblicuos.",
    que: "Dos caminos. (A) Polígono rectilíneo: rejilla con cortes en todos los vértices, cada tramo en ceil(L/tam) celdas y se conservan las " +
      "celdas cuyo centro cae dentro del polígono y fuera de los huecos («cookie cut»); exacto. (B) Polígono general: muestreo del contorno, " +
      "triangulación de Delaunay por Bowyer-Watson, cada triángulo partido en TRES cuadriláteros por su baricentro (Catmull-Clark) y " +
      "suavizado laplaciano con el borde fijo y sin invertir celdas. Siempre cuadriláteros. La idea general viene de lo que hace ETABS " +
      "(Quad_Build, medido en su binario); el código es propio y sale de matemática pública.",
    referencias: [
      "Bowyer, A. (1981) Computer Journal 24(2)",
      "Watson, D. F. (1981) Computer Journal 24(2)",
      "Catmull, E. y Clark, J. (1978) Computer-Aided Design 10(6)",
      "Field, D. A. (1988) «Laplacian smoothing and Delaunay triangulations», Comm. Appl. Numer. Methods 4",
    ],
    donde: [
      { ruta: "examples/src/cli-modeler/pavimentador.ts", nota: "pavimentar(), delaunay()" },
      { ruta: "tests/casos/automesh_pavimentador.mjs", nota: "su prueba (L, hueco rectangular, hueco girado, muro con ventana)" },
    ],
    estado: "Biblioteca con su prueba. En esta versión `cliModeler.ts` no la llama: el comando `automesh` usa la rejilla bilineal.",
  },
  {
    id: "transfinito", orden: 3, icono: "◠", grupo: "Mallado",
    titulo: "Interpolación transfinita (bordes curvos)",
    resumen: "Malla de un paño de cuatro bordes que pueden ser rectas, arcos o polilíneas.",
    que: "Reparte una malla entre cuatro bordes cualesquiera. Exige exactamente cuatro bordes, y por eso el pavimentador existe " +
      "para lo que no cabe ahí (huecos, L, lados oblicuos). Ofrece los bordes recta, arco por 3 puntos y polilínea, y la bilineal.",
    referencias: ["Interpolación transfinita de Coons (así la llama la prueba del pavimentador)"],
    donde: [{ ruta: "examples/src/cli-modeler/transfinito.ts", nota: "recta, arcoPor3Puntos, polilinea, bilineal" }],
    estado: "Biblioteca; hoy la importa el pavimentador.",
  },

  // ─────────────────────────────────────────────────────────────────────────── ELEMENTOS
  {
    id: "membrana-itw", orden: 10, icono: "▭", grupo: "Elementos",
    titulo: "Membrana ITW 1990 (con drilling)",
    resumen: "Membrana Q4 con el giro normal dentro del campo de desplazamientos.",
    que: "Membrana de Ibrahimbegović, Taylor y Wilson: el giro normal entra en el campo de desplazamientos (interpolación de Allman por los " +
      "lados más una burbuja condensada), no como una penalización pegada aparte. K = ∫[B G]ᵀ C [B G] dΩ con Gauss 3×3, más un término " +
      "de estabilización γ evaluado con un solo punto. Por defecto: tipo 8 (ITW + proyección del drilling de FEAP/Taylor), γ = 0.4·μ. " +
      "Patch test exacto (0.000 % en flecha y giro). Déficit abierto: en cáscara curva de malla gruesa (hemisferio) converge más lento que el paper.",
    referencias: ["Ibrahimbegović, A., Taylor, R. L. y Wilson, E. L. (1990) IJNME 30:445-457"],
    donde: [
      { ruta: "hekatan-fem/src/cpp/utils/shellQ4.cpp", nota: "getMembraneITW" },
      { ruta: "hekatan-fem/src/cpp/utils/shellThin.cpp", nota: "la reutiliza" },
      { ruta: "hekatan-fem/src/utils/itwJoints.ts", nota: "fuerzas de membrana en los joints" },
    ],
    estado: "Activo (membrana de todas las cáscaras).",
  },
  {
    id: "shell-thin", orden: 11, icono: "▱", grupo: "Elementos",
    titulo: "Shell-Thin: placa delgada DKQ (Kirchhoff)",
    resumen: "Flexión de placa delgada; desprecia la deformación por cortante.",
    que: "Elemento de placa DKQ (Kirchhoff discreto): los giros son incógnitas y Kirchhoff se impone en puntos, lo que evita pedir " +
      "continuidad C1. Los momentos en los joints se evalúan en Gauss 2×2 y se extrapolan de forma bilineal a las esquinas; " +
      "con eso coincide con ETABS 22 joint a joint (0.0000 % en 4 plantillas con losa).",
    referencias: ["Batoz, J.-L. y Tahar, M. B. (1982) «Evaluation of a new quadrilateral thin plate bending element», IJNME 18"],
    donde: [
      { ruta: "hekatan-fem/src/cpp/utils/plateDKQ.h" },
      { ruta: "hekatan-fem/src/cpp/utils/shellThin.cpp" },
      { ruta: "hekatan-fem/src/utils/dkqJoints.ts", nota: "recuperación de momentos en los joints" },
    ],
    estado: "Activo (`shelltype thin`).",
  },
  {
    id: "shell-thick", orden: 12, icono: "▰", grupo: "Elementos",
    titulo: "Shell-Thick: placa gruesa MITC4 + modos de Wilson",
    resumen: "Flexión con cortante (Mindlin), sin bloqueo por cortante.",
    que: "Flexión MITC4 (cortante interpolado por tensorial en puntos de atadura) con los modos incompatibles de Wilson condensados. " +
      "Es la formulación por defecto de `shelltype thick`. Existe además DKMQ (Katili 1993) como opción. " +
      "Los modos incompatibles NO se recuperan en los joints: cada formulación usa su propia B.",
    referencias: [
      "Bathe, K.-J. y Dvorkin, E. N. (1985) IJNME 21",
      "Wilson, E. L., Taylor, R. L., Doherty, W. P. y Ghaboussi, J. (1973) — modos incompatibles",
      "Taylor, R. L., Beresford, P. J. y Wilson, E. L. (1976) IJNME 10",
      "Katili, I. (1993) — DKMQ",
    ],
    donde: [
      { ruta: "hekatan-fem/src/cpp/utils/shellQ4.cpp", nota: "getBendingK" },
      { ruta: "hekatan-fem/src/cpp/utils/shellQ4_DKMQ.cpp", nota: "DKMQ" },
      { ruta: "hekatan-fem/src/utils/mitc4Joints.ts" },
    ],
    estado: "Activo (defecto de las placas gruesas).",
  },
  {
    id: "barra", orden: 13, icono: "╱", grupo: "Elementos",
    titulo: "Barra 3D con cortante (Timoshenko)",
    resumen: "Viga con áreas de cortante As y ejes locales de CSI.",
    que: "Barra de 6 gdl por nudo con deformación por cortante (áreas As2/As3; por defecto 5/6·A, como ETABS) y ángulo de eje local. " +
      "Los ejes siguen la convención de CSI: eje 1 de i a j, eje 2 en el plano vertical hacia arriba, eje 3 = 1×2. Con `ang` y `as` " +
      "el galpón de 1120 barras pasó de 16.4 % a 49.9 % de nudos dentro del 1 % de ETABS.",
    referencias: ["Viga de Timoshenko (sin cita en el código)", "Convención de ejes locales de CSI (SAP2000 / ETABS)"],
    donde: [
      { ruta: "hekatan-fem/src/cpp/utils/getLocalStiffnessMatrix.cpp" },
      { ruta: "hekatan-fem/src/cpp/utils/getTransformationMatrix.cpp", nota: "hay 3 copias que deben decir lo mismo (.ts, .cpp, didacticSolver.ts)" },
    ],
    estado: "Activo.",
  },
  {
    id: "shell-t3", orden: 13.5, icono: "△", grupo: "Elementos",
    titulo: "Cáscara triangular T3 (3 nudos) y DKT",
    resumen: "Triángulos que llegan de mallas importadas; sin mallador de triángulos propio.",
    que: "La directiva `tri ID n1 n2 n3 t E` declara una cáscara de 3 nudos y 18 gdl. Existe para resolver la malla GENERAL de ETABS " +
      "(Quad_Build mete triángulos entre los cuadriláteros). Shell-Thin: la flexión es la DKT (Discrete Kirchhoff Triangle), pareja triangular " +
      "de la DKQ; K = ∫BᵀDB dA con los 3 puntos medios de lado (exacto, B es lineal). Validada en un prototipo Python (22-sep-2026): 3 modos nulos, " +
      "patch test de curvatura constante exacto en triángulo distorsionado y placa cuadrada apoyada contra Navier −4.33 / −1.31 / −0.345 / −0.087 % " +
      "(n = 4, 8, 16, 32). Shell-Thick: flexión con cortante y membrana T3 heredadas del fork; el código no cita su origen. " +
      "Limitación: Hekatan Struct NO genera triángulos por sí mismo (`automesh` y el pavimentador dan cuadriláteros), y el dibujo CAD " +
      "deja los triángulos como «solo visual».",
    referencias: [
      "Batoz, J.-L., Bathe, K.-J. y Ho, L.-W. (1980) IJNME 15:1771 — DKT",
      "Batoz, J.-L. (1982) IJNME 18:1077 — forma explícita de la DKT",
    ],
    donde: [
      { ruta: "hekatan-fem/src/cpp/utils/plateDKT.h", nota: "DKT (Shell-Thin del triángulo)" },
      { ruta: "hekatan-fem/src/cpp/utils/getLocalStiffnessMatrix.cpp", nota: "cáscara de 3 nudos: membrana, cortante y elección de DKT" },
      { ruta: "examples/src/cli-modeler/cliModeler.ts", nota: "directiva `tri`" },
    ],
    estado: "Activo; los triángulos se importan o declaran, no se generan.",
  },
  {
    id: "solido-h8", orden: 14, icono: "▣", grupo: "Elementos",
    titulo: "Sólido hexaédrico H8",
    resumen: "Solo mencionado: el elemento existe en el motor, sin desarrollo de uso aquí.",
    que: "Hexaedro de 8 nudos con 3 gdl por nudo, con opción de modos incompatibles, que se ensambla junto a barras y cáscaras. " +
      "Por ahora solo se menciona; los sólidos no son parte del flujo de trabajo de placas de Struct.",
    referencias: ["—"],
    donde: [{ ruta: "hekatan-fem/src/cpp/utils/hex8Stiffness.h" }],
    estado: "Solo mencionado.",
  },
  {
    id: "winkler", orden: 15, icono: "⌇", grupo: "Elementos",
    titulo: "Muelles de Winkler",
    resumen: "Apoyo elástico nodal del suelo: k = ks × área tributaria.",
    que: "Modelo del suelo como muelles independientes. `deform()` recibe una lista de muelles {nudo, gdl, k} y suma k a la diagonal de K. " +
      "El muelle de área de SAFE es el NODAL (∫N_i dA); ETABS malla el paño por el nudo colgado incluso con OBJMESHTYPE NONE.",
    referencias: ["Winkler (1867); coeficiente de balasto ks según Bowles"],
    donde: [
      { ruta: "hekatan-fem/src/cpp/deform.cpp", nota: "5.º argumento springsList" },
      { ruta: "hekatan-fem/src/cpp/utils/springsExtra.h", nota: "muelle de área (consistente / nodal)" },
    ],
    estado: "Activo (zapatas y cimentaciones).",
  },

  // ───────────────────────────────────────────────────────────────────────────── SOLVER
  {
    id: "lineal", orden: 20, icono: "=", grupo: "Solver",
    titulo: "Solución lineal K·u = f",
    resumen: "Cholesky/LDLT de Eigen; gradiente conjugado desde 150 000 gdl.",
    que: "El estático resuelve con factorización LDLT de Eigen. Desde 150 000 gdl pasa a gradiente conjugado con Cholesky incompleta " +
      "(tolerancia 1e-12): 164 mil gdl en 7.4 s. Los apoyos se eliminan (no penalización) y un gdl sin rigidez alguna se saca del sistema.",
    referencias: ["Eigen (biblioteca C++ de álgebra lineal)"],
    donde: [{ ruta: "hekatan-fem/src/cpp/deform.cpp" }],
    estado: "Activo.",
  },
  {
    id: "modal", orden: 21, icono: "〰", grupo: "Solver",
    titulo: "Análisis modal",
    resumen: "Modos y periodos con masa concentrada estilo CSI.",
    que: "Problema de autovalores K·φ = ω²·M·φ. La masa es concentrada (lumped) como la de CSI, con la masa rotacional a 1e-9·m, y se arma " +
      "en los tres pasos de ETABS (fuente de masa, solo lateral, lump at stories). Camino denso y camino de subespacio; el de subespacio " +
      "reproduce los 6 modos del Paz 6.3 de ETABS 22 a 4 decimales.",
    referencias: ["Paz, M. y Leigh, W. — Ejemplo 6.3 (marco espacial), usado como caso de validación"],
    donde: [
      { ruta: "hekatan-fem/src/cpp/modal.cpp", nota: "ensamblarMasa()" },
      { ruta: "hekatan-fem/src/cpp/utils/getGlobalMassMatrix.cpp" },
    ],
    estado: "Activo.",
  },
  {
    id: "diafragma", orden: 22, icono: "▤", grupo: "Solver",
    titulo: "Diafragma rígido",
    resumen: "Ata ux, uy y rz de los nudos de un piso a un maestro virtual.",
    que: "`diaph ID grupo` ata ux, uy, rz a un maestro VIRTUAL en el centro (en el modal, en el centro de masa). " +
      "Un nudo real de esquina como maestro pierde el acoplamiento ux–rz y sobreestima T_x en 1.84 veces. Sin `diaph` el piso es flexible.",
    referencias: ["Restricción de diafragma rígido (definición de CSI)"],
    donde: [{ ruta: "hekatan-fem/src/cpp/utils/rigidDiaphragm.h" }],
    estado: "Activo.",
  },

  // ─────────────────────────────────────────────────────────────────────────── VALIDACIÓN
  {
    id: "oraculos", orden: 30, icono: "✔", grupo: "Validación",
    titulo: "Cómo se comprueba: otro programa como árbitro",
    resumen: "Mismo modelo, misma malla nodo a nodo, contra ETABS, SAP2000, SAFE u OpenSees.",
    que: "La referencia de cada caso es OTRO programa con el mismo modelo y la misma malla, con los brazos rígidos anulados; nunca una cuenta " +
      "a mano ni un número sin fuente reproducible. Cuando se puede, además una solución analítica (Navier). " +
      "Suite de regresión: `npm test`. Los formatos e2k / s2k / f2k se generan del mismo .heks.",
    referencias: ["ETABS 22", "SAP2000 24", "SAFE", "OpenSees", "Navier (placa simplemente apoyada)"],
    donde: [
      { ruta: "tests/run.mjs", nota: "runner de la suite" },
      { ruta: "tests/casos/", nota: "un archivo por caso y su árbitro" },
    ],
    estado: "Activo.",
  },

  // ───────────────────────────────────────────────────────────────────────────── ORIGEN
  {
    id: "origen", orden: 40, icono: "©", grupo: "Origen",
    titulo: "Origen y créditos",
    resumen: "Punto de partida del código y de las ideas.",
    que: "Hekatan Struct Lineal parte de un fork de awatif v2.0.0 (github.com/madil4/awatif), extendido con análisis modal, muelles de " +
      "Winkler nativos en C++, ejemplos parametrizados y un workspace unificado. Las formulaciones de elementos son publicadas (ver cada entrada); " +
      "lo de CSI se compara solo por caja negra: misma malla y resultados, sin usar su código.",
    referencias: ["awatif v2.0.0 — madil4/awatif"],
    donde: [{ ruta: "CLAUDE.md", nota: "descripción de la arquitectura" }],
    estado: "Créditos.",
  },
];

const ESC = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string));

/** Tarjeta flotante con la explicación de una entrada. Se cierra con ✕, Esc o al elegir otra. */
let limpiar: (() => void) | null = null;
export function mostrarFundamento(id: string): void {
  if (typeof document === "undefined") return;
  const f = FUNDAMENTOS.find((x) => x.id === id); if (!f) return;
  limpiar?.();
  const c = document.createElement("div");
  c.id = "hk-fund-card";
  c.style.cssText = "position:fixed;z-index:1001;top:70px;left:50%;transform:translateX(-50%);width:min(560px,92vw);max-height:78vh;overflow:auto;" +
    "background:rgba(24,28,34,.98);color:#e8e8e8;border:1px solid #4a7fb0;border-radius:6px;font:13px/1.5 sans-serif;padding:8px;box-shadow:0 8px 24px rgba(0,0,0,.5)";
  const refs = f.referencias.map((r) => `<li>${ESC(r)}</li>`).join("");
  const donde = f.donde.map((d) => `<li><code style="color:#9cd">${ESC(d.ruta)}</code>${d.nota ? ` — ${ESC(d.nota)}` : ""}</li>`).join("");
  c.innerHTML =
    `<div style="display:flex;justify-content:space-between;align-items:center"><b>${ESC(f.icono)} ${ESC(f.titulo)}</b>` +
    `<button id="hk-fund-x" title="Cerrar (Esc)" style="background:none;border:0;color:#e8e8e8;font-size:16px;cursor:pointer">✕</button></div>` +
    `<div style="opacity:.7;font-size:11px;margin:2px 0 6px">${ESC(f.grupo)} · Estado: ${ESC(f.estado)}</div>` +
    `<div style="color:#9cc;margin-top:4px">Qué es</div><div>${ESC(f.que)}</div>` +
    `<div style="color:#9cc;margin-top:8px">Referencia</div><ul style="margin:2px 0 0 18px;padding:0">${refs}</ul>` +
    `<div style="color:#9cc;margin-top:8px">Dónde se usa en Struct</div><ul style="margin:2px 0 0 18px;padding:0">${donde}</ul>`;
  document.body.appendChild(c);
  // en fase de CAPTURA: la línea de órdenes del CAD también escucha Esc y no deja pasar el evento
  const cerrar = () => { c.remove(); document.removeEventListener("keydown", tecla, true); limpiar = null; };
  limpiar = cerrar;
  const tecla = (e: KeyboardEvent) => { if (e.key === "Escape") cerrar(); };
  (c.querySelector("#hk-fund-x") as HTMLElement).onclick = cerrar;
  document.addEventListener("keydown", tecla, true);
}
