import { a as qt, __tla as __tla_0 } from "./analyze-Bun5MfUS.js";
import { m as Ft, d as Nt, __tla as __tla_1 } from "./didacticCpp-BoYi16rL.js";
import { V as jt } from "./Text-C1TX4d8g.js";
let no, ho, xo, bo, Jt, go;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })(),
  (() => {
    try {
      return __tla_1;
    } catch {
    }
  })()
]).then(async () => {
  const Tt = [
    {
      id: "automesh",
      orden: 1,
      icono: "\u25A6",
      grupo: "Mallado",
      titulo: "Automallado por rejilla bilineal (Q4)",
      resumen: "Parte cada pa\xF1o Q4 en celdas de lado \u2264 tam, como el automallado de ETABS.",
      que: "El comando `automesh <tam>` reparte la geometr\xEDa por interpolaci\xF3n BILINEAL de las 4 esquinas del pa\xF1o. Un pa\xF1o plano y recto sale exacto; uno alabeado, aproximado (igual que ETABS). Las celdas heredan espesor, material, modificadores, tipo, \xE1ngulo y la presi\xF3n del areaload; los nudos que ya existen se reutilizan. Sirve sobre todo al importar un .e2k con la losa sin mallar: ETABS la malla y Hekatan resuelve la malla que se le da. Medido contra ETABS en una losa 5\xD75: misma malla (25 nudos, 16 c\xE1scaras).",
      referencias: [
        "Interpolaci\xF3n bilineal est\xE1ndar de un cuadril\xE1tero",
        "ETABS: AUTOMESHOPTIONS \u2026 FLOORMESHMAXSIZE 1250 (medido en su .$et, 8-sep-2026)"
      ],
      donde: [
        {
          ruta: "examples/src/cli-modeler/cliModeler.ts",
          nota: "aplicarAutomesh; directiva `automesh <tam_m | off>` en el .heks"
        },
        {
          ruta: "tests/casos/automesh_vs_etabs.mjs",
          nota: "prueba contra el modelo de an\xE1lisis de ETABS"
        }
      ],
      estado: "Activo (apagado por defecto)."
    },
    {
      id: "pavimentador",
      orden: 2,
      icono: "\u2B1A",
      grupo: "Mallado",
      titulo: "Pavimentador (pa\xF1os poligonales con hueco)",
      resumen: "Cuadril\xE1teros en pa\xF1os en L, con huecos o lados oblicuos.",
      que: "Dos caminos. (A) Pol\xEDgono rectil\xEDneo: rejilla con cortes en todos los v\xE9rtices, cada tramo en ceil(L/tam) celdas y se conservan las celdas cuyo centro cae dentro del pol\xEDgono y fuera de los huecos (\xABcookie cut\xBB); exacto. (B) Pol\xEDgono general: muestreo del contorno, triangulaci\xF3n de Delaunay por Bowyer-Watson, cada tri\xE1ngulo partido en TRES cuadril\xE1teros por su baricentro (Catmull-Clark) y suavizado laplaciano con el borde fijo y sin invertir celdas. Siempre cuadril\xE1teros. La idea general viene de lo que hace ETABS (Quad_Build, medido en su binario); el c\xF3digo es propio y sale de matem\xE1tica p\xFAblica.",
      referencias: [
        "Bowyer, A. (1981) Computer Journal 24(2)",
        "Watson, D. F. (1981) Computer Journal 24(2)",
        "Catmull, E. y Clark, J. (1978) Computer-Aided Design 10(6)",
        "Field, D. A. (1988) \xABLaplacian smoothing and Delaunay triangulations\xBB, Comm. Appl. Numer. Methods 4"
      ],
      donde: [
        {
          ruta: "examples/src/cli-modeler/pavimentador.ts",
          nota: "pavimentar(), delaunay()"
        },
        {
          ruta: "tests/casos/automesh_pavimentador.mjs",
          nota: "su prueba (L, hueco rectangular, hueco girado, muro con ventana)"
        }
      ],
      estado: "Biblioteca con su prueba. En esta versi\xF3n `cliModeler.ts` no la llama: el comando `automesh` usa la rejilla bilineal."
    },
    {
      id: "transfinito",
      orden: 3,
      icono: "\u25E0",
      grupo: "Mallado",
      titulo: "Interpolaci\xF3n transfinita (bordes curvos)",
      resumen: "Malla de un pa\xF1o de cuatro bordes que pueden ser rectas, arcos o polil\xEDneas.",
      que: "Reparte una malla entre cuatro bordes cualesquiera. Exige exactamente cuatro bordes, y por eso el pavimentador existe para lo que no cabe ah\xED (huecos, L, lados oblicuos). Ofrece los bordes recta, arco por 3 puntos y polil\xEDnea, y la bilineal.",
      referencias: [
        "Interpolaci\xF3n transfinita de Coons (as\xED la llama la prueba del pavimentador)"
      ],
      donde: [
        {
          ruta: "examples/src/cli-modeler/transfinito.ts",
          nota: "recta, arcoPor3Puntos, polilinea, bilineal"
        }
      ],
      estado: "Biblioteca; hoy la importa el pavimentador."
    },
    {
      id: "membrana-itw",
      orden: 10,
      icono: "\u25AD",
      grupo: "Elementos",
      titulo: "Membrana ITW 1990 (con drilling)",
      resumen: "Membrana Q4 con el giro normal dentro del campo de desplazamientos.",
      que: "Membrana de Ibrahimbegovi\u0107, Taylor y Wilson: el giro normal entra en el campo de desplazamientos (interpolaci\xF3n de Allman por los lados m\xE1s una burbuja condensada), no como una penalizaci\xF3n pegada aparte. K = \u222B[B G]\u1D40 C [B G] d\u03A9 con Gauss 3\xD73, m\xE1s un t\xE9rmino de estabilizaci\xF3n \u03B3 evaluado con un solo punto. Por defecto: tipo 8 (ITW + proyecci\xF3n del drilling de FEAP/Taylor), \u03B3 = 0.4\xB7\u03BC. Patch test exacto (0.000 % en flecha y giro). D\xE9ficit abierto: en c\xE1scara curva de malla gruesa (hemisferio) converge m\xE1s lento que el paper.",
      referencias: [
        "Ibrahimbegovi\u0107, A., Taylor, R. L. y Wilson, E. L. (1990) IJNME 30:445-457"
      ],
      donde: [
        {
          ruta: "hekatan-fem/src/cpp/utils/shellQ4.cpp",
          nota: "getMembraneITW"
        },
        {
          ruta: "hekatan-fem/src/cpp/utils/shellThin.cpp",
          nota: "la reutiliza"
        },
        {
          ruta: "hekatan-fem/src/utils/itwJoints.ts",
          nota: "fuerzas de membrana en los joints"
        }
      ],
      estado: "Activo (membrana de todas las c\xE1scaras)."
    },
    {
      id: "shell-thin",
      orden: 11,
      icono: "\u25B1",
      grupo: "Elementos",
      titulo: "Shell-Thin: placa delgada DKQ (Kirchhoff)",
      resumen: "Flexi\xF3n de placa delgada; desprecia la deformaci\xF3n por cortante.",
      que: "Elemento de placa DKQ (Kirchhoff discreto): los giros son inc\xF3gnitas y Kirchhoff se impone en puntos, lo que evita pedir continuidad C1. Los momentos en los joints se eval\xFAan en Gauss 2\xD72 y se extrapolan de forma bilineal a las esquinas; con eso coincide con ETABS 22 joint a joint (0.0000 % en 4 plantillas con losa).",
      referencias: [
        "Batoz, J.-L. y Tahar, M. B. (1982) \xABEvaluation of a new quadrilateral thin plate bending element\xBB, IJNME 18"
      ],
      donde: [
        {
          ruta: "hekatan-fem/src/cpp/utils/plateDKQ.h"
        },
        {
          ruta: "hekatan-fem/src/cpp/utils/shellThin.cpp"
        },
        {
          ruta: "hekatan-fem/src/utils/dkqJoints.ts",
          nota: "recuperaci\xF3n de momentos en los joints"
        }
      ],
      estado: "Activo (`shelltype thin`)."
    },
    {
      id: "shell-thick",
      orden: 12,
      icono: "\u25B0",
      grupo: "Elementos",
      titulo: "Shell-Thick: placa gruesa MITC4 + modos de Wilson",
      resumen: "Flexi\xF3n con cortante (Mindlin), sin bloqueo por cortante.",
      que: "Flexi\xF3n MITC4 (cortante interpolado por tensorial en puntos de atadura) con los modos incompatibles de Wilson condensados. Es la formulaci\xF3n por defecto de `shelltype thick`. Existe adem\xE1s DKMQ (Katili 1993) como opci\xF3n. Los modos incompatibles NO se recuperan en los joints: cada formulaci\xF3n usa su propia B.",
      referencias: [
        "Bathe, K.-J. y Dvorkin, E. N. (1985) IJNME 21",
        "Wilson, E. L., Taylor, R. L., Doherty, W. P. y Ghaboussi, J. (1973) \u2014 modos incompatibles",
        "Taylor, R. L., Beresford, P. J. y Wilson, E. L. (1976) IJNME 10",
        "Katili, I. (1993) \u2014 DKMQ"
      ],
      donde: [
        {
          ruta: "hekatan-fem/src/cpp/utils/shellQ4.cpp",
          nota: "getBendingK"
        },
        {
          ruta: "hekatan-fem/src/cpp/utils/shellQ4_DKMQ.cpp",
          nota: "DKMQ"
        },
        {
          ruta: "hekatan-fem/src/utils/mitc4Joints.ts"
        }
      ],
      estado: "Activo (defecto de las placas gruesas)."
    },
    {
      id: "barra",
      orden: 13,
      icono: "\u2571",
      grupo: "Elementos",
      titulo: "Barra 3D con cortante (Timoshenko)",
      resumen: "Viga con \xE1reas de cortante As y ejes locales de CSI.",
      que: "Barra de 6 gdl por nudo con deformaci\xF3n por cortante (\xE1reas As2/As3; por defecto 5/6\xB7A, como ETABS) y \xE1ngulo de eje local. Los ejes siguen la convenci\xF3n de CSI: eje 1 de i a j, eje 2 en el plano vertical hacia arriba, eje 3 = 1\xD72. Con `ang` y `as` el galp\xF3n de 1120 barras pas\xF3 de 16.4 % a 49.9 % de nudos dentro del 1 % de ETABS.",
      referencias: [
        "Viga de Timoshenko (sin cita en el c\xF3digo)",
        "Convenci\xF3n de ejes locales de CSI (SAP2000 / ETABS)"
      ],
      donde: [
        {
          ruta: "hekatan-fem/src/cpp/utils/getLocalStiffnessMatrix.cpp"
        },
        {
          ruta: "hekatan-fem/src/cpp/utils/getTransformationMatrix.cpp",
          nota: "hay 3 copias que deben decir lo mismo (.ts, .cpp, didacticSolver.ts)"
        }
      ],
      estado: "Activo."
    },
    {
      id: "shell-t3",
      orden: 13.5,
      icono: "\u25B3",
      grupo: "Elementos",
      titulo: "C\xE1scara triangular T3 (3 nudos) y DKT",
      resumen: "Tri\xE1ngulos que llegan de mallas importadas; sin mallador de tri\xE1ngulos propio.",
      que: "La directiva `tri ID n1 n2 n3 t E` declara una c\xE1scara de 3 nudos y 18 gdl. Existe para resolver la malla GENERAL de ETABS (Quad_Build mete tri\xE1ngulos entre los cuadril\xE1teros). Shell-Thin: la flexi\xF3n es la DKT (Discrete Kirchhoff Triangle), pareja triangular de la DKQ; K = \u222BB\u1D40DB dA con los 3 puntos medios de lado (exacto, B es lineal). Validada en un prototipo Python (22-sep-2026): 3 modos nulos, patch test de curvatura constante exacto en tri\xE1ngulo distorsionado y placa cuadrada apoyada contra Navier \u22124.33 / \u22121.31 / \u22120.345 / \u22120.087 % (n = 4, 8, 16, 32). Shell-Thick: flexi\xF3n con cortante y membrana T3 heredadas del fork; el c\xF3digo no cita su origen. Limitaci\xF3n: Hekatan Struct NO genera tri\xE1ngulos por s\xED mismo (`automesh` y el pavimentador dan cuadril\xE1teros), y el dibujo CAD deja los tri\xE1ngulos como \xABsolo visual\xBB.",
      referencias: [
        "Batoz, J.-L., Bathe, K.-J. y Ho, L.-W. (1980) IJNME 15:1771 \u2014 DKT",
        "Batoz, J.-L. (1982) IJNME 18:1077 \u2014 forma expl\xEDcita de la DKT"
      ],
      donde: [
        {
          ruta: "hekatan-fem/src/cpp/utils/plateDKT.h",
          nota: "DKT (Shell-Thin del tri\xE1ngulo)"
        },
        {
          ruta: "hekatan-fem/src/cpp/utils/getLocalStiffnessMatrix.cpp",
          nota: "c\xE1scara de 3 nudos: membrana, cortante y elecci\xF3n de DKT"
        },
        {
          ruta: "examples/src/cli-modeler/cliModeler.ts",
          nota: "directiva `tri`"
        }
      ],
      estado: "Activo; los tri\xE1ngulos se importan o declaran, no se generan."
    },
    {
      id: "solido-h8",
      orden: 14,
      icono: "\u25A3",
      grupo: "Elementos",
      titulo: "S\xF3lido hexa\xE9drico H8",
      resumen: "Solo mencionado: el elemento existe en el motor, sin desarrollo de uso aqu\xED.",
      que: "Hexaedro de 8 nudos con 3 gdl por nudo, con opci\xF3n de modos incompatibles, que se ensambla junto a barras y c\xE1scaras. Por ahora solo se menciona; los s\xF3lidos no son parte del flujo de trabajo de placas de Struct.",
      referencias: [
        "\u2014"
      ],
      donde: [
        {
          ruta: "hekatan-fem/src/cpp/utils/hex8Stiffness.h"
        }
      ],
      estado: "Solo mencionado."
    },
    {
      id: "winkler",
      orden: 15,
      icono: "\u2307",
      grupo: "Elementos",
      titulo: "Muelles de Winkler",
      resumen: "Apoyo el\xE1stico nodal del suelo: k = ks \xD7 \xE1rea tributaria.",
      que: "Modelo del suelo como muelles independientes. `deform()` recibe una lista de muelles {nudo, gdl, k} y suma k a la diagonal de K. El muelle de \xE1rea de SAFE es el NODAL (\u222BN_i dA); ETABS malla el pa\xF1o por el nudo colgado incluso con OBJMESHTYPE NONE.",
      referencias: [
        "Winkler (1867); coeficiente de balasto ks seg\xFAn Bowles"
      ],
      donde: [
        {
          ruta: "hekatan-fem/src/cpp/deform.cpp",
          nota: "5.\xBA argumento springsList"
        },
        {
          ruta: "hekatan-fem/src/cpp/utils/springsExtra.h",
          nota: "muelle de \xE1rea (consistente / nodal)"
        }
      ],
      estado: "Activo (zapatas y cimentaciones)."
    },
    {
      id: "lineal",
      orden: 20,
      icono: "=",
      grupo: "Solver",
      titulo: "Soluci\xF3n lineal K\xB7u = f",
      resumen: "Cholesky/LDLT de Eigen; gradiente conjugado desde 150 000 gdl.",
      que: "El est\xE1tico resuelve con factorizaci\xF3n LDLT de Eigen. Desde 150 000 gdl pasa a gradiente conjugado con Cholesky incompleta (tolerancia 1e-12): 164 mil gdl en 7.4 s. Los apoyos se eliminan (no penalizaci\xF3n) y un gdl sin rigidez alguna se saca del sistema.",
      referencias: [
        "Eigen (biblioteca C++ de \xE1lgebra lineal)"
      ],
      donde: [
        {
          ruta: "hekatan-fem/src/cpp/deform.cpp"
        }
      ],
      estado: "Activo."
    },
    {
      id: "modal",
      orden: 21,
      icono: "\u3030",
      grupo: "Solver",
      titulo: "An\xE1lisis modal",
      resumen: "Modos y periodos con masa concentrada estilo CSI.",
      que: "Problema de autovalores K\xB7\u03C6 = \u03C9\xB2\xB7M\xB7\u03C6. La masa es concentrada (lumped) como la de CSI, con la masa rotacional a 1e-9\xB7m, y se arma en los tres pasos de ETABS (fuente de masa, solo lateral, lump at stories). Camino denso y camino de subespacio; el de subespacio reproduce los 6 modos del Paz 6.3 de ETABS 22 a 4 decimales.",
      referencias: [
        "Paz, M. y Leigh, W. \u2014 Ejemplo 6.3 (marco espacial), usado como caso de validaci\xF3n"
      ],
      donde: [
        {
          ruta: "hekatan-fem/src/cpp/modal.cpp",
          nota: "ensamblarMasa()"
        },
        {
          ruta: "hekatan-fem/src/cpp/utils/getGlobalMassMatrix.cpp"
        }
      ],
      estado: "Activo."
    },
    {
      id: "diafragma",
      orden: 22,
      icono: "\u25A4",
      grupo: "Solver",
      titulo: "Diafragma r\xEDgido",
      resumen: "Ata ux, uy y rz de los nudos de un piso a un maestro virtual.",
      que: "`diaph ID grupo` ata ux, uy, rz a un maestro VIRTUAL en el centro (en el modal, en el centro de masa). Un nudo real de esquina como maestro pierde el acoplamiento ux\u2013rz y sobreestima T_x en 1.84 veces. Sin `diaph` el piso es flexible.",
      referencias: [
        "Restricci\xF3n de diafragma r\xEDgido (definici\xF3n de CSI)"
      ],
      donde: [
        {
          ruta: "hekatan-fem/src/cpp/utils/rigidDiaphragm.h"
        }
      ],
      estado: "Activo."
    },
    {
      id: "oraculos",
      orden: 30,
      icono: "\u2714",
      grupo: "Validaci\xF3n",
      titulo: "C\xF3mo se comprueba: otro programa como \xE1rbitro",
      resumen: "Mismo modelo, misma malla nodo a nodo, contra ETABS, SAP2000, SAFE u OpenSees.",
      que: "La referencia de cada caso es OTRO programa con el mismo modelo y la misma malla, con los brazos r\xEDgidos anulados; nunca una cuenta a mano ni un n\xFAmero sin fuente reproducible. Cuando se puede, adem\xE1s una soluci\xF3n anal\xEDtica (Navier). Suite de regresi\xF3n: `npm test`. Los formatos e2k / s2k / f2k se generan del mismo .heks.",
      referencias: [
        "ETABS 22",
        "SAP2000 24",
        "SAFE",
        "OpenSees",
        "Navier (placa simplemente apoyada)"
      ],
      donde: [
        {
          ruta: "tests/run.mjs",
          nota: "runner de la suite"
        },
        {
          ruta: "tests/casos/",
          nota: "un archivo por caso y su \xE1rbitro"
        }
      ],
      estado: "Activo."
    },
    {
      id: "origen",
      orden: 40,
      icono: "\xA9",
      grupo: "Origen",
      titulo: "Origen y cr\xE9ditos",
      resumen: "Punto de partida del c\xF3digo y de las ideas.",
      que: "Hekatan Struct Lineal parte de un fork de awatif v2.0.0 (github.com/madil4/awatif), extendido con an\xE1lisis modal, muelles de Winkler nativos en C++, ejemplos parametrizados y un workspace unificado. Las formulaciones de elementos son publicadas (ver cada entrada); lo de CSI se compara solo por caja negra: misma malla y resultados, sin usar su c\xF3digo.",
      referencias: [
        "awatif v2.0.0 \u2014 madil4/awatif"
      ],
      donde: [
        {
          ruta: "CLAUDE.md",
          nota: "descripci\xF3n de la arquitectura"
        }
      ],
      estado: "Cr\xE9ditos."
    }
  ], Q = (e) => e.replace(/[&<>"]/g, (o) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  })[o]);
  let Ue = null;
  function Ot(e) {
    if (typeof document > "u") return;
    const o = Tt.find((s) => s.id === e);
    if (!o) return;
    Ue == null ? void 0 : Ue();
    const t = document.createElement("div");
    t.id = "hk-fund-card", t.style.cssText = "position:fixed;z-index:1001;top:70px;left:50%;transform:translateX(-50%);width:min(560px,92vw);max-height:78vh;overflow:auto;background:rgba(24,28,34,.98);color:#e8e8e8;border:1px solid #4a7fb0;border-radius:6px;font:13px/1.5 sans-serif;padding:8px;box-shadow:0 8px 24px rgba(0,0,0,.5)";
    const a = o.referencias.map((s) => `<li>${Q(s)}</li>`).join(""), n = o.donde.map((s) => `<li><code style="color:#9cd">${Q(s.ruta)}</code>${s.nota ? ` \u2014 ${Q(s.nota)}` : ""}</li>`).join("");
    t.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center"><b>${Q(o.icono)} ${Q(o.titulo)}</b><button id="hk-fund-x" title="Cerrar (Esc)" style="background:none;border:0;color:#e8e8e8;font-size:16px;cursor:pointer">\u2715</button></div><div style="opacity:.7;font-size:11px;margin:2px 0 6px">${Q(o.grupo)} \xB7 Estado: ${Q(o.estado)}</div><div style="color:#9cc;margin-top:4px">Qu\xE9 es</div><div>${Q(o.que)}</div><div style="color:#9cc;margin-top:8px">Referencia</div><ul style="margin:2px 0 0 18px;padding:0">${a}</ul><div style="color:#9cc;margin-top:8px">D\xF3nde se usa en Struct</div><ul style="margin:2px 0 0 18px;padding:0">${n}</ul>`, document.body.appendChild(t);
    const r = () => {
      t.remove(), document.removeEventListener("keydown", i, true), Ue = null;
    };
    Ue = r;
    const i = (s) => {
      s.key === "Escape" && r();
    };
    t.querySelector("#hk-fund-x").onclick = r, document.addEventListener("keydown", i, true);
  }
  const he = {
    analisis: [
      {
        id: "estatico",
        orden: 1,
        icono: "\u25B6",
        titulo: "Analizar (est\xE1tico)",
        detalle: "Resuelve el modelo con el caso o la combinaci\xF3n elegida en \xABResultados\xBB.",
        abrir: () => {
          var _a;
          return (_a = window.__hekatanRebuild) == null ? void 0 : _a.call(window);
        }
      },
      {
        id: "modal",
        orden: 2,
        icono: "\u3030",
        titulo: "Modal + animar",
        detalle: "Periodos, modos y participaci\xF3n de masa; anima el modo elegido.",
        abrir: () => {
          var _a;
          return (_a = window.__hekatanRunModalAnimate) == null ? void 0 : _a.call(window);
        }
      },
      {
        id: "parar",
        orden: 3,
        icono: "\u25A0",
        titulo: "Parar animaci\xF3n",
        detalle: "Detiene la animaci\xF3n del modo.",
        abrir: () => {
          var _a;
          return (_a = window.__hekatanModalStop) == null ? void 0 : _a.call(window);
        }
      }
    ],
    diseno: [],
    exportar: [
      {
        id: "e2k",
        orden: 1,
        icono: "\u{1F3D7}",
        titulo: "ETABS (.e2k)",
        detalle: "El modelo entero, para abrirlo en ETABS.",
        abrir: () => Ce("E2K", "ETABS")
      },
      {
        id: "s2k",
        orden: 2,
        icono: "\u{1F4D0}",
        titulo: "SAP2000 (.s2k)",
        detalle: "El modelo entero, para abrirlo en SAP2000.",
        abrir: () => Ce("S2K", "SAP2000")
      },
      {
        id: "f2k",
        orden: 3,
        icono: "\u{1FAA8}",
        titulo: "SAFE (.f2k) \u2014 cimentaci\xF3n",
        detalle: "La cimentaci\xF3n con sus muelles, para SAFE.",
        abrir: () => Ce("F2K", "SAFE")
      },
      {
        id: "tcl",
        orden: 4,
        icono: "\u{1F9EE}",
        titulo: "OpenSees (.tcl)",
        detalle: "El guion de OpenSees, para comprobarlo aparte.",
        abrir: () => Ce(".tcl", "OpenSees")
      },
      {
        id: "dwg",
        orden: 5,
        icono: "\u{1F4D0}",
        titulo: "AutoCAD (.dwg) \u2014 geometr\xEDa",
        detalle: "Barras y \xE1reas en capas COLUMNAS, VIGAS, DIAGONALES, LOSAS, MUROS.",
        abrir: () => Ae("Exportar DWG", "DWG")
      },
      {
        id: "dxf",
        orden: 6,
        icono: "\u{1F4C4}",
        titulo: "DXF \u2014 geometr\xEDa",
        detalle: "Lo mismo en DXF de texto: lo abre cualquier CAD.",
        abrir: () => Ae("Exportar DXF", "DXF")
      },
      {
        id: "idwg",
        orden: 7,
        icono: "\u{1F4E5}",
        titulo: "Importar DWG / DXF (3D o planta)",
        detalle: "L\xEDneas \u2192 barras con sus nudos; 3DFACE \u2192 \xE1reas. Salta ejes, cotas y textos.",
        abrir: () => Ae("Importar DWG/DXF (3D", "DWG")
      },
      {
        id: "idwgxz",
        orden: 8,
        icono: "\u{1F4E5}",
        titulo: "Importar DWG / DXF como alzado (XZ)",
        detalle: "Un p\xF3rtico dibujado en 2D: la Y del plano pasa a ser la altura Z.",
        abrir: () => Ae("como alzado (XZ)", "DWG")
      }
    ]
  };
  function Ce(e, o) {
    const a = Array.from(document.querySelectorAll("button,.tp-btnv_b")).find((n) => {
      const r = (n.textContent || "").replace(/\s+/g, " ").trim();
      return r.includes("Exportar") && r.includes(e) && r.length < 60;
    });
    if (a) {
      a.click();
      return;
    }
    alert("Este ejemplo todav\xEDa no exporta a " + o + `.

Los que s\xED: el galp\xF3n curvo (ETABS, SAP2000, SAFE y OpenSees) y
la zapata (SAFE y OpenSees).`);
  }
  function Ae(e, o) {
    const t = Array.from(document.querySelectorAll("button,.tp-btnv_b")).find((a) => (a.textContent || "").replace(/\s+/g, " ").includes(e));
    if (t) {
      t.click();
      return;
    }
    alert("Abr\xED un modelo o un archivo nuevo para usar " + o + ".");
  }
  he.fundamentos = Tt.map((e) => ({
    id: e.id,
    orden: e.orden,
    icono: e.icono,
    titulo: e.titulo,
    detalle: e.resumen,
    abrir: () => Ot(e.id)
  }));
  const Vt = {
    analisis: "\u25B6 An\xE1lisis",
    diseno: "\u{1F4D0} Dise\xF1o",
    exportar: "\u{1F4E4} Exportar",
    fundamentos: "\u{1F4DA} Fundamentos"
  }, Rt = {
    analisis: "An\xE1lisis \u2014 elige qu\xE9 calcular:",
    diseno: "Dise\xF1o \u2014 elige qu\xE9 hacer:",
    exportar: "Exportar el modelo a otro programa:",
    fundamentos: "Fundamentos \u2014 qu\xE9 usa Hekatan Struct y d\xF3nde (clic para ver):"
  };
  ho = function() {
    at();
  };
  Jt = function(e) {
    const o = he.diseno;
    o.some((t) => t.id === e.id) || (o.push(e), o.sort((t, a) => t.orden - a.orden)), at();
  };
  let ue = null;
  function at() {
    if (document.getElementById("hk-menus")) return;
    const e = document.getElementById("hk-cad-tit"), o = e == null ? void 0 : e.querySelector(".doc");
    if (!e || !o) {
      setTimeout(at, 400);
      return;
    }
    const t = document.createElement("style");
    t.textContent = "#hk-cad-tit button{white-space:nowrap}@media (max-width:1100px){#hk-cad-tit .marca{display:none}}@media (max-width:1150px){#hk-fundamentos-btn .ft{display:none}}@media (max-width:1050px){#hk-cad-tit .piel{padding:3px 6px}#hk-fundamentos-btn .ar{display:none}}@media (max-width:900px){#hk-cad-tit .doc{display:none}#hk-menus{margin-left:4px!important}#hk-cad-tit .piel{padding:3px 6px}}", document.head.appendChild(t);
    const a = document.createElement("span");
    a.id = "hk-menus", a.style.cssText = "display:flex;align-items:center;gap:6px;margin-left:14px", o.after(a);
    const n = (d) => {
      const u = document.getElementById(d);
      if (!u) return false;
      const h = u.style.display !== "none";
      return u.removeAttribute("style"), u.className = "piel", h || (u.style.display = "none"), a.appendChild(u), true;
    };
    let r = 0;
    const i = () => {
      const d = n("hk-home-btn"), u = n("hk-back-btn");
      (!d || !u) && ++r < 20 && setTimeout(i, 400);
    };
    (() => {
      for (const d of [
        "analisis",
        "diseno",
        "exportar",
        "fundamentos"
      ]) {
        const u = document.createElement("button");
        u.id = `hk-${d}-btn`, u.className = "piel", u.textContent = Vt[d] + " \u25BE", d === "fundamentos" && (u.innerHTML = '\u{1F4DA}<span class="ft"> Fundamentos</span><span class="ar"> \u25BE</span>', u.title = "Fundamentos \u2014 qu\xE9 usa Hekatan Struct y d\xF3nde"), u.onclick = (h) => {
          h.stopPropagation(), Wt(d, u);
        }, a.appendChild(u);
      }
    })(), i();
    const c = () => {
      const d = a.querySelector("#hk-analisis-btn");
      for (const u of [
        "hk-back-btn",
        "hk-home-btn"
      ]) {
        const h = document.getElementById(u);
        h && d && h.parentElement === a && a.insertBefore(h, d);
      }
    };
    for (const d of [
      500,
      1200,
      2500,
      5e3
    ]) setTimeout(c, d);
    const m = window, p = m.__hekatanActualizarBotonVolver;
    m.__hekatanActualizarBotonVolver = (d) => {
      p == null ? void 0 : p(d);
      const u = document.getElementById("hk-back-btn");
      u && (u.style.display = d ? "" : "none");
    }, document.addEventListener("click", (d) => {
      ue && !ue.contains(d.target) && Ze();
    });
  }
  function Ze() {
    ue == null ? void 0 : ue.remove(), ue = null;
  }
  function Wt(e, o) {
    const t = (ue == null ? void 0 : ue.dataset.menu) === e;
    if (Ze(), t) return;
    const a = document.createElement("div");
    a.dataset.menu = e, a.id = `hk-${e}-menu`, a.style.cssText = "position:fixed;z-index:1000;width:360px;max-height:calc(100vh - 220px);overflow:auto;background:rgba(24,28,34,.98);color:#e8e8e8;border:1px solid #4a7fb0;border-radius:6px;font:12px sans-serif;padding:6px;box-shadow:0 6px 18px rgba(0,0,0,.4)";
    const n = he[e].length === 0 ? '<div style="padding:8px;opacity:.8;line-height:1.5">Todav\xEDa no hay nada aqu\xED.<br>Las opciones de dise\xF1o las trae el modelo: abre una plantilla o un ejemplo con cimentaci\xF3n o zapata y volver\xE1n a aparecer en este men\xFA.</div>' : "";
    a.innerHTML = `<div style="padding:2px 6px 6px;color:#9cc">${Rt[e]}</div>` + n + he[e].map((i) => `<div data-id="${i.id}" style="padding:6px 8px;border-radius:4px;cursor:pointer"><b>${i.icono} ${i.titulo}</b><div style="opacity:.75;margin-top:2px">${i.detalle}</div></div>`).join(""), a.querySelectorAll("[data-id]").forEach((i) => {
      i.onmouseenter = () => i.style.background = "#1f3b5a", i.onmouseleave = () => i.style.background = "", i.onclick = () => {
        var _a;
        Ze(), (_a = he[e].find((s) => s.id === i.dataset.id)) == null ? void 0 : _a.abrir();
      };
    }), document.body.appendChild(a);
    const r = o.getBoundingClientRect();
    a.style.top = r.bottom + 4 + "px", a.style.left = Math.max(8, Math.min(r.left, innerWidth - 370)) + "px", ue = a;
  }
  go = function(e) {
    let o = false, t = 0, a = 0;
    const n = (s) => {
      const c = e.firstElementChild;
      return !!c && c.contains(s);
    }, r = () => {
      const s = e.dataset.plegado !== "1";
      e.dataset.plegado = s ? "1" : "0", [
        ...e.children
      ].slice(1).forEach((c) => c.style.display = s ? "none" : ""), e.style.overflow = s ? "hidden" : "auto";
    };
    e.addEventListener("pointerdown", (s) => {
      if (!n(s.target)) return;
      const c = s.target;
      if (c.closest("[data-plegar]")) {
        r();
        return;
      }
      if (c.closest("button,select,input,[id$='-x']")) return;
      const m = e.getBoundingClientRect();
      o = true, t = s.clientX - m.left, a = s.clientY - m.top, e.setPointerCapture(s.pointerId), s.preventDefault();
    }), e.addEventListener("pointermove", (s) => {
      o && (e.style.left = Math.min(Math.max(0, s.clientX - t), innerWidth - 80) + "px", e.style.top = Math.min(Math.max(30, s.clientY - a), innerHeight - 30) + "px", e.style.right = "auto");
    }), e.addEventListener("pointerup", () => {
      o = false;
    }), e.addEventListener("dblclick", (s) => {
      n(s.target) && !s.target.closest("[data-plegar]") && r();
    });
    const i = () => {
      const s = e.firstElementChild;
      if (!s || s.dataset.barra === "1") return;
      s.dataset.barra = "1", s.style.cssText += ";cursor:move;background:#1f3b5a;margin:-8px -8px 8px;padding:7px 10px;border-radius:6px 6px 0 0;user-select:none", s.title = "Arrastra esta barra para mover la ventana \xB7 doble clic o \u2581 para plegarla";
      const c = s.querySelector("b");
      c && !c.textContent.startsWith("\u283F") && (c.textContent = "\u283F " + c.textContent);
    };
    i(), new MutationObserver(i).observe(e, {
      childList: true
    });
  };
  const x = () => window, Et = "/hekatan-struct-lineal/", fe = (e) => typeof e == "function" ? e() : e, J = (e) => new Promise((o) => setTimeout(o, e));
  let b = null, C = 0, W = [], kt = "", se = true, L = false, F = 0, de = null;
  const ge = () => {
    var _a;
    (_a = window.speechSynthesis) == null ? void 0 : _a.cancel(), de && (de.pause(), de = null);
  };
  async function Ht(e, o) {
    ge();
    const t = new Audio(Et + e);
    de = t;
    const a = new Promise((n) => {
      t.onended = () => n(), t.onerror = () => n();
    });
    try {
      await t.play();
    } catch {
      return de === t && (de = null), null;
    }
    return o === F ? {
      fin: a
    } : null;
  }
  bo = (e, o = 4) => (+e.toFixed(o)).toString().replace(".", ",");
  function Ut(e, o) {
    const t = window.speechSynthesis, a = Math.max(1800, e.length * 62);
    return !t || !se ? J(a) : new Promise((n) => {
      t.cancel();
      const r = new SpeechSynthesisUtterance(e);
      r.lang = "es-ES", r.rate = 1.02;
      const i = t.getVoices().find((m) => m.lang.startsWith("es"));
      i && (r.voice = i);
      let s = false;
      const c = () => {
        s || (s = true, n());
      };
      r.onend = c, r.onerror = c, setTimeout(c, a + 4e3), o === F ? t.speak(r) : c();
    });
  }
  let R = null, H = null, B = null, k = null, Le = 300, De = 300, St = 0, q = null;
  const Pe = "http://www.w3.org/2000/svg";
  function Gt() {
    if (R) return;
    R = document.createElement("div"), R.innerHTML = '<svg width="34" height="34" viewBox="0 0 24 24"><path d="M3 2l7 19 2.5-7.5L20 11z" fill="#fff" stroke="#000" stroke-width="1.4"/></svg>', R.style.cssText = "position:fixed;z-index:9700;pointer-events:none;left:0;top:0;filter:drop-shadow(0 3px 4px #000c)", H = document.createElement("div"), H.style.cssText = "position:fixed;z-index:9690;pointer-events:none;border:3px solid #22d3ee;border-radius:12px;box-shadow:0 0 0 5px #22d3ee40;transition:all .7s ease;opacity:0", B = document.createElement("div"), B.style.cssText = "position:fixed;z-index:9710;pointer-events:none;background:#111827;color:#cffafe;border:1px solid #22d3ee;border-radius:8px;padding:5px 9px;font:600 14px system-ui;transition:left .7s ease,top .7s ease,opacity .3s;opacity:0;white-space:nowrap", k = document.createElementNS(Pe, "svg"), k.setAttribute("style", "position:fixed;left:0;top:0;width:100vw;height:100vh;z-index:9680;pointer-events:none"), k.innerHTML = '<defs><marker id="hk-fl" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#22d3ee"/></marker></defs>', document.body.append(k, H, R, B);
    const e = document.createElement("style");
    e.id = "hk-tutor-st", e.textContent = "@keyframes hkOnda{from{transform:translate(-50%,-50%) scale(.2);opacity:.9}to{transform:translate(-50%,-50%) scale(2.4);opacity:0}}", document.head.appendChild(e), et(Le, De), wt();
  }
  function Xt() {
    var _a;
    cancelAnimationFrame(St), R == null ? void 0 : R.remove(), H == null ? void 0 : H.remove(), B == null ? void 0 : B.remove(), k == null ? void 0 : k.remove(), (_a = document.getElementById("hk-tutor-st")) == null ? void 0 : _a.remove(), R = H = B = null, k = null, q = null;
  }
  function et(e, o) {
    e = Math.min(Math.max(e, 4), innerWidth - 30), o = Math.min(Math.max(o, 34), innerHeight - 30), Le = e, De = o, R && (R.style.transform = `translate(${e - 3}px,${o - 2}px)`);
  }
  let $e = null;
  function Ge(e, o) {
    const t = Math.hypot(e - Le, o - De), a = Math.min(1300, 450 + t * 0.9);
    return new Promise((n) => {
      $e = {
        x0: Le,
        y0: De,
        x1: e,
        y1: o,
        t0: performance.now(),
        ms: a,
        ok: n
      };
    });
  }
  function Kt(e, o) {
    const t = document.createElement("div");
    t.style.cssText = `position:fixed;left:${e}px;top:${o}px;width:46px;height:46px;border:3px solid #22d3ee;border-radius:50%;z-index:9695;pointer-events:none;animation:hkOnda .7s ease-out forwards`, document.body.appendChild(t), setTimeout(() => t.remove(), 750);
  }
  function wt() {
    St = requestAnimationFrame(wt);
    const e = performance.now();
    if ($e) {
      const o = $e, t = Math.min(1, (e - o.t0) / o.ms), a = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2, n = (o.x0 + o.x1) / 2, r = (o.y0 + o.y1) / 2;
      Math.hypot(o.x1 - o.x0, o.y1 - o.y0);
      const i = n - (o.y1 - o.y0) * 0.12, s = r + (o.x1 - o.x0) * 0.12, c = 1 - a;
      et(c * c * o.x0 + 2 * c * a * i + a * a * o.x1, c * c * o.y0 + 2 * c * a * s + a * a * o.y1), t >= 1 && ($e = null, Kt(o.x1, o.y1), o.ok());
      return;
    }
    if (q) {
      const o = e / 900, t = Math.max(8, q.width * 0.3), a = Math.max(6, q.height * 0.3);
      et(q.left + q.width / 2 + t * Math.cos(o), q.top + q.height / 2 + a * Math.sin(o));
    }
  }
  function be(e) {
    var _a, _b, _c, _d, _e2;
    const o = (_b = (_a = x()).__hekatanViewerCtx) == null ? void 0 : _b.call(_a), a = (_e2 = (_d = (_c = x().__hekatanStates) == null ? void 0 : _c.nodes) == null ? void 0 : _d.val) == null ? void 0 : _e2[e];
    if (!o || !a) return null;
    const n = o.rendererElm.getBoundingClientRect(), r = new jt(a[0], a[1], a[2]).project(o.camera);
    return [
      n.left + (r.x + 1) / 2 * n.width,
      n.top + (1 - r.y) / 2 * n.height
    ];
  }
  function Ct(e) {
    let o = 1e9, t = 1e9, a = -1e9, n = -1e9;
    for (const i of e) {
      const s = be(i);
      s && (o = Math.min(o, s[0]), a = Math.max(a, s[0]), t = Math.min(t, s[1]), n = Math.max(n, s[1]));
    }
    if (o > a) return null;
    const r = 4;
    return new DOMRect(o - r, t - r, a - o + 2 * r, n - t + 2 * r);
  }
  function Yt(e) {
    var _a, _b, _c, _d, _e2;
    if (e === "modelo") {
      const r = (_d = (_c = (_b = (_a = x()).__hekatanViewerCtx) == null ? void 0 : _b.call(_a)) == null ? void 0 : _c.rendererElm) == null ? void 0 : _d.getBoundingClientRect();
      return r ? new DOMRect(r.left + r.width * 0.4, r.top + r.height * 0.4, r.width * 0.2, r.height * 0.2) : null;
    }
    if (/^[#.[]/.test(e)) return ((_e2 = document.querySelector(e)) == null ? void 0 : _e2.getBoundingClientRect()) ?? null;
    const o = e.trim().toLowerCase();
    let t = null, a = 1e12;
    for (const r of document.querySelectorAll("body *")) {
      if ((b == null ? void 0 : b.contains(r)) || r.children.length > 2 || (r.textContent || "").trim().toLowerCase() !== o) continue;
      const i = r.getBoundingClientRect();
      !i.width || !i.height || i.width * i.height < a && (t = r, a = i.width * i.height);
    }
    if (!t) return null;
    const n = t.closest(".tp-lblv, .tp-rotv, tr, li") || t;
    return n.scrollIntoView({
      block: "center"
    }), n.getBoundingClientRect();
  }
  function Qt(e, o, t = "alineada") {
    var _a, _b;
    const a = (_b = (_a = x().__hekatanStates) == null ? void 0 : _a.nodes) == null ? void 0 : _b.val, n = a == null ? void 0 : a[e], r = a == null ? void 0 : a[o];
    if (!n || !r) return null;
    const i = [
      r[0] - n[0],
      r[1] - n[1],
      r[2] - n[2]
    ];
    return t === "vertical" ? Math.abs(i[2]) : t === "horizontal" ? Math.hypot(i[0], i[1]) : Math.hypot(i[0], i[1], i[2]);
  }
  const ft = (e) => (+e.toFixed(At.DIMDEC + (Math.abs(e) < 10 ? 1 : 0))).toString();
  function Zt(e, o, t, a = "alineada") {
    var _a;
    const n = Qt(e, o, a);
    if (n === null) return t ?? "";
    const r = t && t.includes("=") ? t.split("=")[0].trim() + " = " : "", i = t && !t.includes("=") ? t.trim() : (_a = t == null ? void 0 : t.split("=")[1]) == null ? void 0 : _a.trim(), s = i === void 0 ? NaN : parseFloat(i.replace(",", "."));
    return Number.isFinite(s) && Math.abs(s - n) > Math.max(5e-3, 5e-3 * Math.abs(n)) && console.warn(`[tutor] cota ${e}-${o}: el guion dec\xEDa ${i} y el modelo mide ${ft(n)}; se dibuja la del modelo`), r + ft(n);
  }
  const At = {
    DIMEXO: 5,
    DIMEXE: 6,
    DIMTXT: 14,
    DIMGAP: 4,
    DIMDEC: 2
  };
  function eo(e, o, t, a, n, r) {
    const i = At, s = [
      e[0] + a * r,
      e[1] + n * r
    ], c = [
      o[0] + a * r,
      o[1] + n * r
    ], m = (h, N) => `<line x1="${h[0] + a * i.DIMEXO}" y1="${h[1] + n * i.DIMEXO}" x2="${N[0] + a * i.DIMEXE}" y2="${N[1] + n * i.DIMEXE}" stroke="#22d3ee" stroke-width="1"/>`;
    let p = Math.atan2(c[1] - s[1], c[0] - s[0]) * 180 / Math.PI;
    (p > 90 || p < -90) && (p += 180);
    const d = (s[0] + c[0]) / 2 + a * (i.DIMGAP + i.DIMTXT * 0.35), u = (s[1] + c[1]) / 2 + n * (i.DIMGAP + i.DIMTXT * 0.35);
    return m(e, s) + m(o, c) + `<line x1="${s[0]}" y1="${s[1]}" x2="${c[0]}" y2="${c[1]}" stroke="#22d3ee" stroke-width="1.6" marker-start="url(#hk-fl)" marker-end="url(#hk-fl)"/><text x="${d}" y="${u}" transform="rotate(${p.toFixed(1)} ${d} ${u})" fill="#cffafe" font-family="system-ui" font-weight="700" font-size="${i.DIMTXT}" text-anchor="middle" paint-order="stroke" stroke="#0b1020" stroke-width="4">${t}</text>`;
  }
  function ht(e) {
    var _a, _b;
    if (!k) return;
    k.querySelectorAll("g").forEach((s) => s.remove());
    const o = ((_b = (_a = x().__hekatanStates) == null ? void 0 : _a.nodes) == null ? void 0 : _b.val) ?? [];
    let t = 0, a = 0, n = 0;
    for (let s = 0; s < o.length; s++) {
      const c = be(s);
      c && (t += c[0], a += c[1], n++);
    }
    const r = t / (n || 1), i = a / (n || 1);
    for (const [s, c, m, p = 36, d = "alineada"] of e ?? []) {
      const u = be(s), h = be(c);
      if (!u || !h) continue;
      const N = Zt(s, c, m, d), U = Math.abs(p), g = d === "horizontal" ? [
        u[0],
        Math.max(u[1], h[1])
      ] : d === "vertical" ? [
        Math.max(u[0], h[0]),
        u[1]
      ] : u, M = d === "horizontal" ? [
        h[0],
        Math.max(u[1], h[1])
      ] : d === "vertical" ? [
        Math.max(u[0], h[0]),
        h[1]
      ] : h, oe = Math.hypot(M[0] - g[0], M[1] - g[1]) || 1;
      let G = -(M[1] - g[1]) / oe, X = (M[0] - g[0]) / oe;
      G * ((g[0] + M[0]) / 2 - r) + X * ((g[1] + M[1]) / 2 - i) < 0 && (G = -G, X = -X);
      const ae = document.createElementNS(Pe, "g");
      ae.innerHTML = eo(g, M, N, G, X, U), ae.style.opacity = "0", ae.style.transition = "opacity .5s", k.appendChild(ae), requestAnimationFrame(() => ae.style.opacity = "1");
    }
  }
  function to(e) {
    if (k) for (const [o, t] of e ?? []) {
      const a = Ct(o);
      if (!a) continue;
      const n = a.left + a.width / 2, r = a.top + a.height / 2, i = document.createElementNS(Pe, "g");
      i.innerHTML = `<circle cx="${n}" cy="${r}" r="13" fill="#1e3a8a" stroke="#93c5fd" stroke-width="1.5"/><text x="${n}" y="${r + 5}" fill="#fff" font-family="system-ui" font-weight="700" font-size="13" text-anchor="middle">${t}</text>`, i.style.opacity = "0", i.style.transition = "opacity .5s", k.appendChild(i), requestAnimationFrame(() => i.style.opacity = "1");
    }
  }
  async function oo(e, o) {
    var _a, _b, _c, _d, _e2;
    if (Gt(), typeof e == "string" && e !== "modelo" && !/^[#.[]/.test(e) && document.body.classList.contains("hk-pane-oculto")) {
      const i = document.getElementById("hk-pane-toggle");
      if (i) {
        const s = i.getBoundingClientRect();
        H.style.opacity = "0", B.style.opacity = "0", await Ge(s.left + s.width / 2, s.top + s.height / 2), i.click(), Xe = true, yt(true), await J(700);
      }
    } else Xe && (e === void 0 || typeof e != "string" || e === "modelo" || e.startsWith("[data-cuerpo]")) && (tt(), Xe = false, yt(false), await J(700));
    const t = e === void 0 ? null : typeof e == "string" ? Yt(e) : Ct(e.nudos);
    q = null;
    const a = typeof e == "string" && e !== "modelo" && !e.startsWith("[data-cuerpo]");
    if (k && (k.style.transition = "opacity .3s", k.style.opacity = a ? "0" : "1"), !t) {
      if (H.style.opacity = "0", B.style.opacity = "0", b) {
        const i = b.getBoundingClientRect();
        await Ge(i.right - 50, i.bottom - 70);
      }
      return;
    }
    const n = t.left + t.width / 2, r = t.top + t.height / 2;
    if (k.querySelectorAll("[data-punto]").forEach((i) => i.remove()), e !== void 0 && typeof e != "string") {
      H.style.opacity = "0";
      for (const i of e.nudos) {
        const s = be(i);
        if (!s) continue;
        const c = document.createElementNS(Pe, "circle");
        c.setAttribute("data-punto", "1"), c.setAttribute("cx", `${s[0]}`), c.setAttribute("cy", `${s[1]}`), c.setAttribute("r", "7"), c.setAttribute("fill", "#22d3ee"), c.setAttribute("stroke", "#000"), c.setAttribute("stroke-width", "1.5"), c.innerHTML = '<animate attributeName="r" values="5;10;5" dur="1.2s" repeatCount="indefinite"/>', k.appendChild(c);
      }
    } else Object.assign(H.style, {
      left: t.left + "px",
      top: t.top + "px",
      width: t.width + "px",
      height: t.height + "px",
      opacity: "1"
    });
    if (o) {
      B.textContent = o;
      const i = (((_e2 = (_d = (_c = (_b = (_a = x()).__hekatanViewerCtx) == null ? void 0 : _b.call(_a)) == null ? void 0 : _c.rendererElm) == null ? void 0 : _d.getBoundingClientRect()) == null ? void 0 : _e2.right) ?? innerWidth) - 10, s = B.offsetWidth || 260, c = n + 30 + s > i ? n - 30 - s : n + 30;
      Object.assign(B.style, {
        left: Math.max(c, 8) + "px",
        top: Math.max(t.top - 40, 40) + "px",
        opacity: "1"
      });
    } else B.style.opacity = "0";
    await Ge(n, r), q = typeof e == "string" ? t : new DOMRect(n - 20, r - 14, 40, 28);
  }
  async function gt(e) {
    !e || !x().__hekatanParams || !x().__hekatanRebuild || (Object.assign(x().__hekatanParams(), e), x().__hekatanRebuild(), await J(500), Be(), await J(250));
  }
  function bt() {
    if (!b) return;
    const e = W[C], o = b.querySelector("[data-cuerpo]");
    o.innerHTML = `<div style="color:#94a3b8;font-size:12px;margin-bottom:2px">${kt.replace(/^Tutor · /, "")}</div><div style="font-weight:700;color:#7dd3fc;margin-bottom:6px">${C + 1}/${W.length} \xB7 ${e.titulo}</div>` + (e.fig ? `<img src="${Et}img/itw/${e.fig}" style="width:100%;max-height:44vh;object-fit:contain;background:#fff;border-radius:6px;margin:6px 0 12px">` : "") + `<div style="line-height:1.5">${e.texto()}</div>`, b.querySelector("[data-ant]").disabled = C === 0, b.querySelector("[data-sig]").disabled = C === W.length - 1, b.querySelector("[data-barra]").style.width = `${(C + 1) / W.length * 100}%`;
  }
  async function re() {
    var _a, _b;
    if (!b) return;
    const e = ++F;
    ge();
    const o = W[C];
    if (await gt(o.params), e !== F) return;
    bt(), await ((_a = b == null ? void 0 : b.querySelector("[data-cuerpo] img")) == null ? void 0 : _a.decode().catch(() => {
    })), ht([]);
    const t = o.tiempos ?? [
      {
        voz: o.voz ?? (() => b.querySelector("[data-cuerpo]").innerText),
        senalar: o.senalar
      }
    ], a = o.audio && se ? await Ht(o.audio, e) : null;
    if (o.audio && se && !a && b) {
      const n = document.createElement("div");
      if (n.style.cssText = "margin-top:10px;color:#fca5a5;font-size:13px", n.textContent = "Pulsa \u25B6 Reproducir o \u21BB para o\xEDr la voz (el navegador pide un clic).", (_b = b.querySelector("[data-cuerpo]")) == null ? void 0 : _b.appendChild(n), L) {
        L = false, xe();
        return;
      }
    }
    for (const n of t) {
      if (e !== F || !b) return;
      n.params && await gt(n.params), n.accion && (await n.accion(), await J(300)), (n.params || n.accion) && bt(), (n.cotas || n.etiquetas) && (ht(n.cotas ? fe(n.cotas) : []), to(n.etiquetas ? fe(n.etiquetas) : []));
      const r = o.audio ? J(n.ms ?? 2500) : Ut(fe(n.voz), e);
      await oo(n.senalar === void 0 ? void 0 : fe(n.senalar), n.globo === void 0 ? void 0 : fe(n.globo)), await r, await J(250);
    }
    a && e === F && await a.fin, L && e === F && C < W.length - 1 ? (await J(500), e === F && (C++, re())) : L && C === W.length - 1 && (L = false, xe());
  }
  function xe() {
    const e = b == null ? void 0 : b.querySelector("[data-auto]");
    e && (e.textContent = L ? "\u23F8 Pausa" : "\u25B6 Reproducir");
  }
  const ze = "min(44vw, 720px)";
  let le = null, Xe = false, xt = false;
  const Ke = () => document.body.classList.contains("hk-pane-oculto"), tt = () => {
    var _a;
    return (_a = document.getElementById("hk-pane-toggle")) == null ? void 0 : _a.click();
  };
  function ao() {
    var _a, _b, _c, _d, _e2, _f;
    const e = (_b = (_a = x()).__hekatanViewerCtx) == null ? void 0 : _b.call(_a), o = (_d = (_c = x().__hekatanStates) == null ? void 0 : _c.nodes) == null ? void 0 : _d.val;
    if (!e || !(o == null ? void 0 : o.length)) return;
    const t = [
      1 / 0,
      1 / 0,
      1 / 0
    ], a = [
      -1 / 0,
      -1 / 0,
      -1 / 0
    ];
    for (const p of o) for (let d = 0; d < 3; d++) p[d] < t[d] && (t[d] = p[d]), p[d] > a[d] && (a[d] = p[d]);
    const n = [
      a[0] - t[0],
      a[1] - t[1],
      a[2] - t[2]
    ], r = Math.max(...n), i = n.indexOf(Math.min(...n));
    if (n[i] > 0.02 * r) return;
    const s = e.camera, c = e.controls.target;
    c.set((t[0] + a[0]) / 2, (t[1] + a[1]) / 2, (t[2] + a[2]) / 2);
    const m = Math.hypot(...n) * 1.6 + 1;
    s.position.set(c.x + (i === 0 ? m : 0), c.y + (i === 1 ? m : 0), c.z + (i === 2 ? m : 0)), s.up.set(0, i === 2 ? 1 : 0, i === 2 ? 0 : 1), s.lookAt(c), s.updateProjectionMatrix(), (_f = (_e2 = e.controls).update) == null ? void 0 : _f.call(_e2), e.render();
  }
  function Be() {
    var _a, _b;
    (_b = (_a = x()).__hekatanAutoFit) == null ? void 0 : _b.call(_a), setTimeout(() => {
      var _a2, _b2, _c, _d;
      ao();
      const e = (_b2 = (_a2 = x()).__hekatanViewerCtx) == null ? void 0 : _b2.call(_a2);
      if (!e) return;
      const o = e.controls.target, t = e.camera;
      t.isOrthographicCamera ? t.zoom /= 1.3 : t.position.sub(o).multiplyScalar(1.3).add(o), t.updateProjectionMatrix(), (_d = (_c = e.controls).update) == null ? void 0 : _d.call(_c), e.render();
    }, 120);
  }
  function yt(e) {
    var _a, _b, _c;
    const o = (_b = (_a = x()).__hekatanViewerElm) == null ? void 0 : _b.call(_a);
    if (!o || le === null) return;
    (_c = document.getElementById("hk-pane-toggle")) == null ? void 0 : _c.previousElementSibling;
    const t = e ? 450 : 130;
    o.style.width = `calc(100% - ${ze} - ${t}px)`, setTimeout(() => {
      window.dispatchEvent(new Event("resize")), Be();
    }, 300);
  }
  function vt(e) {
    var _a, _b;
    const o = (_b = (_a = x()).__hekatanViewerElm) == null ? void 0 : _b.call(_a);
    o && (e ? (le === null && (le = o.style.cssText, xt = Ke()), Ke() || tt(), document.body.classList.add("hk-tutor"), o.style.marginLeft = ze, o.style.width = `calc(100% - ${ze} - 130px)`) : le !== null && (o.style.cssText = le, le = null, document.body.classList.remove("hk-tutor"), Ke() !== xt && tt()), setTimeout(() => {
      window.dispatchEvent(new Event("resize")), Be();
    }, 400), setTimeout(Be, 1100));
  }
  function Ye(e, o, t = false) {
    var _a, _b;
    W = o, kt = e, C = 0, L = t;
    try {
      const n = (_b = (_a = x()).__hekatanSettings) == null ? void 0 : _b.call(_a);
      (n == null ? void 0 : n.shellResults) && (n.shellResults.val = "displacementZ");
    } catch {
    }
    b == null ? void 0 : b.remove(), b = document.createElement("div"), b.style.cssText = `position:fixed;top:32px;left:0;width:${ze};bottom:92px;overflow-y:auto;overflow-x:hidden;z-index:9500;background:#0f172a;color:#e2e8f0;border-right:2px solid #334155;font:16px system-ui;box-shadow:6px 0 20px #0008`, b.innerHTML = '<div style="padding:8px 10px;background:#1e3a8a;border-radius:10px 10px 0 0;display:flex;gap:8px;align-items:center;cursor:move"><b style="flex:1">\u{1F393} Tutor</b><button data-voz title="Voz s\xED / no" style="background:none;border:0;color:#fff;cursor:pointer">\u{1F50A}</button><button data-x title="Cerrar" style="background:none;border:0;color:#fff;cursor:pointer">\u2715</button></div><div style="height:3px;background:#1e293b"><div data-barra style="height:3px;background:#22d3ee;width:0;transition:width .5s"></div></div><div data-cuerpo style="padding:12px 18px;line-height:1.55"></div><div style="display:flex;gap:8px;padding:10px 18px 16px;position:sticky;bottom:0;background:#0f172a;font-size:16px"><button data-ant style="padding:6px 10px">\u25C0</button><button data-auto style="flex:1;padding:6px;background:#16a34a;color:#fff;border:0;border-radius:4px;font-weight:600">\u25B6 Reproducir</button><button data-rep style="padding:6px 10px" title="Repetir este paso">\u21BB</button><button data-sig style="flex:1;padding:6px;background:#2563eb;color:#fff;border:0;border-radius:4px">Siguiente \u25B6</button></div>', document.body.appendChild(b), vt(true), xe();
    const a = (n) => b.querySelector(n);
    a("[data-x]").addEventListener("click", () => {
      F++, L = false, ge(), b == null ? void 0 : b.remove(), b = null, Xt(), vt(false);
    }), a("[data-voz]").addEventListener("click", (n) => {
      se = !se, n.target.textContent = se ? "\u{1F50A}" : "\u{1F507}", se || ge();
    }), a("[data-ant]").addEventListener("click", () => {
      C > 0 && (L = false, xe(), C--, re());
    }), a("[data-sig]").addEventListener("click", () => {
      C < W.length - 1 && (C++, re());
    }), a("[data-rep]").addEventListener("click", () => re()), a("[data-auto]").addEventListener("click", () => {
      L = !L, xe(), L ? re() : (F++, ge());
    }), re();
  }
  no = function(e, o, t) {
    typeof window > "u" || !x().__hekatanRebuild || (x().__hekatanTutorTest = (a) => Ye(o, t(), !!a), !x().__hekatanTutorAuto && new URLSearchParams(location.search).get("tutor") === "1" && (x().__hekatanTutorAuto = true, setTimeout(() => Ye(o, t(), true), 2500)), Jt({
      id: "tutor-" + e,
      orden: 5,
      icono: "\u{1F393}",
      titulo: "Tutor del test (paso a paso, con voz)",
      detalle: "Explica este banco: el problema del paper, la soluci\xF3n exacta y cada malla con los n\xFAmeros de Hekatan.",
      abrir: () => Ye(o, t())
    }));
  };
  const _t = 9.80665, w = () => window, ye = () => w().__hekatanStates, Z = (e) => Number.isFinite(e) ? e.toFixed(2) : "\u2014", ee = (e) => Number.isFinite(e) ? e.toFixed(3) : "\u2014", nt = () => {
    var _a, _b;
    return ((_b = (_a = ye()) == null ? void 0 : _a.nodes) == null ? void 0 : _b.val) ?? [];
  }, so = () => {
    var _a;
    return (_a = ye()) == null ? void 0 : _a._mesaTorsionIdx;
  }, ot = () => {
    var _a, _b, _c;
    return ((_c = (_b = (_a = w()).__hekatanParams) == null ? void 0 : _b.call(_a)) == null ? void 0 : _c.Lx) ?? 6;
  }, y = () => nt().map((e, o) => [
    e,
    o
  ]).filter(([e]) => Math.abs(e[1]) < 1e-9 && e[2] > 1e-9).sort((e, o) => e[0][0] - o[0][0]).map(([, e]) => e), io = () => {
    const e = nt();
    let o = -1, t = 1e9;
    return e.forEach((a, n) => {
      if (a[2] < 1e-9) return;
      const r = Math.hypot(a[0] - ot() / 2, a[1] - ot() / 2);
      r < t && (t = r, o = n);
    }), o;
  };
  function I() {
    var _a, _b, _c;
    const e = (_c = (_b = (_a = ye()) == null ? void 0 : _a.analyzeOutputs) == null ? void 0 : _b.val) == null ? void 0 : _c.torsions, o = so();
    if (!e || !o) return NaN;
    let t = 0;
    for (let a = o.beamStart; a < o.beamEnd; a++) {
      const n = e.get(a);
      n && (t = Math.max(t, Math.abs(n[0]), Math.abs(n[1])));
    }
    return t / _t;
  }
  function Qe() {
    var _a, _b, _c, _d;
    const e = (_b = (_a = ye()) == null ? void 0 : _a.analyzeOutputs) == null ? void 0 : _b.val, o = (_d = (_c = ye()) == null ? void 0 : _c.elements) == null ? void 0 : _d.val, t = nt(), a = (e == null ? void 0 : e.bendingYYjoint) ?? (e == null ? void 0 : e.bendingYY);
    if (!a || !o) return NaN;
    const n = /* @__PURE__ */ new Map();
    for (const [s, c] of a) {
      const m = o[s];
      !m || m.length !== 4 || m.forEach((p, d) => {
        if (Math.abs(t[p][1]) > 1e-9) return;
        const u = n.get(p) ?? [
          0,
          0
        ];
        n.set(p, [
          u[0] + c[d],
          u[1] + 1
        ]);
      });
    }
    const r = [
      ...n.entries()
    ].map(([s, [c, m]]) => ({
      x: t[s][0],
      m: c / m / _t
    })).sort((s, c) => s.x - c.x), i = ot() / 2;
    for (let s = 0; s < r.length - 1; s++) if (i >= r[s].x - 1e-9 && i <= r[s + 1].x + 1e-9) return r[s].m + (r[s + 1].m - r[s].m) * (i - r[s].x) / (r[s + 1].x - r[s].x);
    return NaN;
  }
  function V() {
    var _a, _b;
    const e = ((_b = (_a = w()).__hekatanParams) == null ? void 0 : _b.call(_a)) ?? {}, o = 2812.279 / 0.70307, t = 1 / 0.0254, a = (e.bViga ?? 0.3) * t, n = (e.hViga ?? 0.5) * t;
    return 0.75 * (4 * Math.sqrt(o) * (a * n) ** 2 / (2 * (a + n))) * 4.4482216 * 0.0254 / 9806.65;
  }
  const $t = (e) => new Promise((o) => setTimeout(o, e));
  async function ce(e) {
    Object.assign(w().__hekatanParams(), e), w().__hekatanRebuild(), await $t(450);
  }
  function te(e, o) {
    var _a, _b;
    const t = (_b = (_a = w()).__hekatanSettings) == null ? void 0 : _b.call(_a);
    t && (e !== void 0 && t.frameResults && (t.frameResults.val = e), o !== void 0 && t.shellResults && (t.shellResults.val = o));
  }
  async function j(e) {
    var _a, _b, _c, _d, _e2, _f, _g;
    if ((_b = (_a = w()).__hekatanSetView) == null ? void 0 : _b.call(_a, e), e !== "iso") return;
    await $t(200);
    const o = (_d = (_c = w()).__hekatanViewerCtx) == null ? void 0 : _d.call(_c);
    if (!o) return;
    const t = o.controls.target, a = o.camera;
    a.isOrthographicCamera ? a.zoom /= 1.35 : a.position.sub(t).multiplyScalar(1.35).add(t), a.updateProjectionMatrix(), (_f = (_e2 = o.controls).update) == null ? void 0 : _f.call(_e2), (_g = o.render) == null ? void 0 : _g.call(o);
  }
  let v = [];
  async function ro(e = 6) {
    v = [];
    let o = 1;
    await ce({
      factorJ: 1
    });
    for (let t = 0; t < e; t++) {
      const a = I();
      if (v.push({
        f: o,
        Tu: a
      }), V() / a >= 0.95) break;
      o *= V() / a, await ce({
        factorJ: +o.toFixed(4)
      });
    }
    return v[v.length - 1];
  }
  const lo = {
    nMesh: 5,
    factorJ: 1,
    vigaNudos: 1,
    activeCase: 4,
    rigidOffsets: 0
  }, ie = (e) => `<p style="font-size:13px;color:#94a3b8;margin-top:8px">${e}</p>`, _e = (e) => `<div style="font:600 19px Cambria,serif;color:#fff;margin:8px 0 8px 12px">${e}</div>`;
  function co() {
    return [
      {
        titulo: "1. La mesa",
        audio: "tutoriales/mesa_torsion/p1.mp3",
        params: lo,
        texto: () => {
          var _a, _b, _c, _d;
          return "<p>Losa de 10 cm sobre cuatro vigas de borde (30\xD750) y cuatro columnas (40\xD740, base articulada). La losa se modela con <b>c\xE1scaras</b> Shell-Thin y la viga con un <b>elemento frame</b>.</p>" + ie(`Modelo: Mesa torsi\xF3nT.e2k (ETABS 19.1), combinaci\xF3n UDCon2 = 1.2D + 1.6L + 1.2SCP, losa ${(_b = (_a = w()).__hekatanParams) == null ? void 0 : _b.call(_a).nMesh}\xD7${(_d = (_c = w()).__hekatanParams) == null ? void 0 : _d.call(_c).nMesh}.`);
        },
        tiempos: [
          {
            voz: "",
            ms: 3200,
            accion: async () => {
              await j("iso"), te("none", "displacementZ");
            },
            senalar: () => ({
              nudos: [
                io()
              ]
            }),
            globo: "Losa: c\xE1scara Shell-Thin, t = 0.10 m"
          },
          {
            voz: "",
            ms: 3200,
            senalar: () => ({
              nudos: y()
            }),
            globo: "Viga 30\xD750: barra (frame)"
          },
          {
            voz: "",
            ms: 2800,
            senalar: () => ({
              nudos: [
                0,
                y()[0]
              ]
            }),
            globo: "Columna 40\xD740, base articulada"
          }
        ]
      },
      {
        titulo: "2. C\xF3mo se unen losa y viga (Wilson \xA77.7)",
        audio: "tutoriales/mesa_torsion/p2.mp3",
        texto: () => "<p>En Wilson el nodo <i>i</i> est\xE1 en el plano medio de la losa y el <i>j</i> en el eje neutro de la viga; se unen con una <b>restricci\xF3n r\xEDgida</b> (ec. 7.15):</p>" + _e("\u03B8<sub>x</sub><sup>losa</sup> = \u03B8<sub>x</sub><sup>viga</sup>") + '<p style="font-size:14px;color:#cbd5e1">Wilson, <i>An\xE1lisis Est\xE1tico y Din\xE1mico de Estructuras</i>, \xA77.7, Fig. 7.6, ec. (7.15), p\xE1gs. 119\u2013120.</p>' + ie("En Struct (brazos r\xEDgidos = 0) viga y losa COMPARTEN el nudo: la restricci\xF3n queda en la igualdad de giros en cada nudo compartido."),
        tiempos: [
          {
            voz: "",
            ms: 6200,
            accion: () => j("elevX"),
            senalar: () => ({
              nudos: y()
            }),
            globo: "\u03B8x losa = \u03B8x viga en cada nudo compartido"
          },
          {
            voz: "",
            ms: 6e3,
            senalar: () => ({
              nudos: [
                y()[Math.floor(y().length / 2)]
              ]
            }),
            globo: "Nudo compartido losa\u2013viga"
          }
        ]
      },
      {
        titulo: "3. Por eso la viga se tuerce",
        audio: "tutoriales/mesa_torsion/p3.mp3",
        texto: () => "<p>La losa cargada quiere girar en su borde; la viga lo impide con su rigidez torsional:</p>" + _e("T<sub>u</sub> = G\xB7J\xB7\u03B8\u2032") + `<p>Es <b>torsi\xF3n de compatibilidad</b>: aparece porque la viga acompa\xF1a el giro de la losa.</p><p>En este modelo: <b>T<sub>u</sub> = ${ee(I())} tonf\xB7m</b> (m\xE1ximo, junto a la columna).</p>`,
        tiempos: [
          {
            voz: "",
            ms: 6e3,
            accion: async () => {
              await j("plan"), te("contour:torsions", "none");
            },
            senalar: () => ({
              nudos: [
                y()[0],
                y()[1]
              ]
            }),
            globo: () => `T_u = ${Z(I())} tonf\xB7m`
          },
          {
            voz: "",
            ms: 5200,
            senalar: () => ({
              nudos: y()
            }),
            globo: "Diagrama de torsi\xF3n de la viga"
          }
        ]
      },
      {
        titulo: "4. \xBFEs confiable esa T<sub>u</sub>? El mallado",
        audio: "tutoriales/mesa_torsion/p4.mp3",
        texto: () => {
          var _a, _b, _c, _d;
          return `<p>La compatibilidad solo se cumple <b>en los nudos compartidos</b>. Wilson: <i>\u201Cpodr\xEDa ser necesario aplicar la restricci\xF3n a varias secciones a lo largo del eje de la viga\u201D</i>.</p><p>Losa ${(_b = (_a = w()).__hekatanParams) == null ? void 0 : _b.call(_a).nMesh}\xD7${(_d = (_c = w()).__hekatanParams) == null ? void 0 : _d.call(_c).nMesh}: <b>${y().length}</b> nudos compartidos \xB7 <b>T<sub>u</sub> = ${ee(I())} tonf\xB7m</b>.</p>` + _e("dT/dx = m<sub>borde</sub>(x) \u21D2 T<sub>u</sub> = \u222B\u2080<sup>L/2</sup> m dx") + '<table style="font-size:13px;color:#cbd5e1;border-collapse:collapse"><tr><th style="padding:2px 8px">n</th><th style="padding:2px 8px">Struct</th><th style="padding:2px 8px">ETABS 22</th></tr>' + [
            [
              1,
              "0.000",
              "0.000"
            ],
            [
              2,
              "2.615",
              "2.528"
            ],
            [
              4,
              "5.040",
              "4.860"
            ],
            [
              8,
              "5.849",
              "5.639"
            ],
            [
              16,
              "6.059",
              "5.844"
            ]
          ].map(([e, o, t]) => `<tr><td style="padding:1px 8px">${e}</td><td style="padding:1px 8px">${o}</td><td style="padding:1px 8px">${t}</td></tr>`).join("") + "</table>" + ie("Tabla: registros/2026-09-23_torsion_vs_malla.md (misma malla en los dos programas, brazos 0). A 32\xD732 T_u = \u2212\u222Bm dx al 1 %.");
        },
        tiempos: [
          1,
          2,
          4,
          8,
          16
        ].map((e) => ({
          voz: "",
          ms: 3300,
          params: {
            nMesh: e
          },
          accion: () => {
            j("plan"), te("contour:torsions", "none");
          },
          senalar: () => ({
            nudos: y()
          }),
          globo: () => `${e}\xD7${e}: ${y().length} nudos compartidos \xB7 T_u = ${Z(I())} tonf\xB7m`
        }))
      },
      {
        titulo: "5. Modelo lineal: la viga no cumple",
        audio: "tutoriales/mesa_torsion/p5.mp3",
        params: {
          nMesh: 5,
          factorJ: 1
        },
        texto: () => `<p>Con J bruta, malla 5\xD75 (la de ETABS): <b>T<sub>u</sub> = ${ee(I())} tonf\xB7m</b> en Struct; la voz cita el de ETABS, 5.22 (Struct queda +3.7 % en torsi\xF3n en todas las mallas).</p><p>\u03C6T<sub>cr</sub> = <b>${ee(V())} tonf\xB7m</b> (ACI 318-19 \xA722.7.5.1, viga 30\xD750 sin alas, f'c = 4000 psi) \u2192 T<sub>u</sub> / \u03C6T<sub>cr</sub> = ${Z(I() / V())}.</p>` + ie("La interacci\xF3n cortante\u2013torsi\xF3n 51.46 > 31.67 kgf/cm\xB2 y el O/S #45 son del dise\xF1o de ETABS: Struct no hace ese chequeo y no los verifica."),
        tiempos: [
          {
            voz: "",
            ms: 7e3,
            accion: async () => {
              await j("plan"), te("contour:torsions", "none");
            },
            senalar: () => ({
              nudos: [
                y()[0],
                y()[1]
              ]
            }),
            globo: () => `T_u = ${Z(I())} > \u03C6T_cr = ${Z(V())} tonf\xB7m`
          },
          {
            voz: "",
            ms: 6500,
            senalar: () => ({
              nudos: y()
            }),
            globo: "ETABS: O/S #45 (sobreesfuerzo cortante + torsi\xF3n)"
          }
        ]
      },
      {
        titulo: "6. La viga se fisura: J se reduce",
        audio: "tutoriales/mesa_torsion/p6.mp3",
        params: {
          nMesh: 5,
          factorJ: 1
        },
        texto: () => "<p>Si T<sub>u</sub> &gt; T<sub>cr</sub> la viga se fisura y su rigidez torsional cae. ACI 318 \xA722.7.3.2 permite dise\xF1arla para \u03C6T<sub>cr</sub>. Se itera:</p>" + _e("f<sub>k+1</sub> = f<sub>k</sub> \xB7 \u03C6T<sub>cr</sub> / T<sub>u,k</sub>") + (v.length ? '<table style="font-size:13px;color:#cbd5e1">' + v.map((e, o) => `<tr><td style="padding:1px 8px">${o}</td><td style="padding:1px 8px">f = ${e.f.toFixed(4)}</td><td style="padding:1px 8px">T_u = ${ee(e.Tu)}</td><td style="padding:1px 8px">\u03C6T_cr/T_u = ${ee(V() / e.Tu)}</td></tr>`).join("") + "</table>" : "") + ie(`Struct, malla 5\xD75, \u03C6T_cr = ${ee(V())}. La voz cita el c\xE1lculo de ETABS (factor 0.0695, T_u = 2.00, \u03C6T_cr = 1.94); el \u03C6T_cr de ETABS no se reprodujo aqu\xED. Reducir J e iterar es una aproximaci\xF3n secante de la viga fisurada. Solo vale en torsi\xF3n de COMPATIBILIDAD; la de EQUILIBRIO no se reduce.`),
        tiempos: [
          0,
          1,
          2,
          3,
          4,
          5
        ].map((e) => ({
          voz: "",
          ms: 3e3,
          accion: async () => {
            if (e === 0) v = [], await ce({
              factorJ: 1
            });
            else {
              const t = v[v.length - 1];
              V() / t.Tu < 0.95 && await ce({
                factorJ: +(t.f * V() / t.Tu).toFixed(4)
              });
            }
            await j("plan"), te("contour:torsions", "none");
            const o = w().__hekatanParams().factorJ;
            (!v.length || v[v.length - 1].f !== o) && v.push({
              f: o,
              Tu: I()
            });
          },
          senalar: () => ({
            nudos: [
              y()[0],
              y()[1]
            ]
          }),
          globo: () => `paso ${e}: factor J = ${w().__hekatanParams().factorJ.toFixed(4)} \xB7 T_u = ${Z(I())} tonf\xB7m`
        }))
      },
      {
        titulo: "7. El momento pasa a la losa",
        audio: "tutoriales/mesa_torsion/p7.mp3",
        texto: () => {
          const e = v.length ? v[v.length - 1].f : NaN;
          return `<p>El torque que la viga ya no toma lo toma la <b>losa</b>. Mapa: momento M22 de la losa (m<sub>yy</sub>).</p><p>Borde sur, centro: <b>m = ${ee(Qe())} tonf\xB7m/m</b> con factor J = ${w().__hekatanParams().factorJ.toFixed(4)}.</p>` + ie(`Lo que se conserva EXACTO es el momento del corte completo x = L/2: losa + vigas + empuje de p\xF3rtico H\xB7h = 65.681 tonf\xB7m con J bruta y con J reducida (malla 16\xD716); la losa pasa de 8.11 a 13.57. La suma borde + centro en UN punto no es constante (no es una franja sobre apoyos r\xEDgidos). La voz cita ETABS (\u22122.73 \u2192 \u22120.85); factor final de Struct: ${Number.isFinite(e) ? e.toFixed(4) : "\u2014"}.`);
        },
        tiempos: [
          {
            voz: "",
            ms: 6200,
            accion: async () => {
              await ce({
                factorJ: 1
              }), await j("iso"), te("none", "bendingYY");
            },
            senalar: () => ({
              nudos: y().filter((e, o, t) => Math.abs(o - (t.length - 1) / 2) <= 0.5)
            }),
            globo: () => `J bruta: m_borde = ${Z(Qe())} tonf\xB7m/m`
          },
          {
            voz: "",
            ms: 6300,
            accion: async () => {
              v.length || await ro(), await ce({
                factorJ: +v[v.length - 1].f.toFixed(4)
              }), await j("iso"), te("none", "bendingYY");
            },
            senalar: () => ({
              nudos: y().filter((e, o, t) => Math.abs(o - (t.length - 1) / 2) <= 0.5)
            }),
            globo: () => `J fisurada: m_borde = ${Z(Qe())} tonf\xB7m/m`
          }
        ]
      },
      {
        titulo: "8. Conclusi\xF3n para el dise\xF1o",
        audio: "tutoriales/mesa_torsion/p8.mp3",
        texto: () => "<p>\u2022 La T<sub>u</sub> lineal es un <b>m\xE1ximo el\xE1stico</b>, confiable solo si la malla converge (T<sub>u</sub> sube al refinar: 0 \u2192 2.62 \u2192 5.04 \u2192 5.85 \u2192 6.06).<br>\u2022 La <b>losa</b> se arma con los momentos <b>despu\xE9s</b> de fisurar la viga (positivo al centro +48 % a 16\xD716).<br>\u2022 La <b>viga</b> igual lleva estribos cerrados y acero longitudinal para \u03C6T<sub>cr</sub>.<br>\u2022 Solo aplica a torsi\xF3n de <b>compatibilidad</b>; la de <b>equilibrio</b> (un volado colgado de la viga) no se reduce.<br>\u2022 Reducir J e iterar es una aproximaci\xF3n secante del comportamiento no lineal.</p>",
        tiempos: [
          {
            voz: "",
            ms: 9500,
            accion: async () => {
              await j("iso"), te("contour:torsions", "none");
            },
            senalar: "modelo"
          },
          {
            voz: "",
            ms: 9e3,
            senalar: () => ({
              nudos: y()
            }),
            globo: "Estribos cerrados + longitudinal para \u03C6T_cr"
          }
        ]
      }
    ];
  }
  let ne, Mt, O;
  ne = 9.80665;
  Mt = {
    Dead: {
      P: 5.72,
      V2: 2.05,
      V3: 0.45,
      T: 0.53,
      M2: 1.57,
      M3: 2.43
    },
    Live: {
      P: 4.5,
      V2: 2.2,
      V3: 0.61,
      T: 1.15,
      M2: 2.13,
      M3: 3.14
    },
    SCP: {
      P: 9,
      V2: 4.41,
      V3: 1.22,
      T: 2.29,
      M2: 4.26,
      M3: 6.28
    },
    UDCon1: {
      P: 20.61,
      V2: 9.03,
      V3: 2.33,
      T: 3.96,
      M2: 8.16,
      M3: 12.2
    },
    UDCon2: {
      P: 24.86,
      V2: 11.27,
      V3: 2.97,
      T: 5.22,
      M2: 10.4,
      M3: 15.48
    }
  };
  O = [
    0.34337,
    0.34337,
    0.28756
  ];
  xo = {
    id: "mesa-torsion",
    name: "\u{1F300} Mesa de Torsi\xF3n (ETABS Gabriela/Seproinca)",
    category: "4\uFE0F\u20E3 Mixtos \xB7 \u{1F500} Losas con vigas",
    benchmark: true,
    defaultShellResult: "displacementZ",
    availableShellResults: [
      "none",
      "pressure",
      "membraneXX",
      "membraneYY",
      "membraneXY",
      "membranePrincipalMax",
      "membranePrincipalMin",
      "vonMises",
      "tranverseShearX",
      "tranverseShearY",
      "transverseShearMax",
      "bendingXX",
      "bendingYY",
      "bendingXY",
      "bendingPrincipalMax",
      "bendingPrincipalMin",
      "displacementX",
      "displacementY",
      "displacementZ"
    ],
    hasModal: true,
    guide: [
      "Modelo 'Mesa de torsi\xF3n' ETABS 19.1 (Gabriela/Seproinca 2020).",
      "6\xD76m \xD7 4m alto \xB7 4 col C40\xD740 PINNED-base \xB7 4 vigas V30\xD750 perim \xB7 losa 10cm \xB7 diaph r\xEDgido.",
      "Selector 'Caso visualizado' cambia entre Dead/Live/SCP/UDCon1/UDCon2.",
      "Tabla \u{1F4CA} Comparaci\xF3n ETABS muestra picks ETABS vs Hekatan por componente y diferencia %.",
      "ETABS periodos modal: T1=T2=0.34337s lateral, T3=0.28756s torsi\xF3n Rz.",
      "Rigid offsets ETABS: col flexible=3.5m (auto -h_viga/2), viga flexible=5.6m (auto -b_col/2).",
      "T_u vs malla (Wilson \xA77.7): cambia 'Subdiv losa' 1\u219216 y 'Uni\xF3n viga\u2013losa'; T_u = 0 / 2.61 / 5.04 / 5.85 / 6.06 tonf\xB7m (UDCon2).",
      "\u{1F393} Tutor con voz: men\xFA \xAB\u{1F4D0} Dise\xF1o\xBB \u2192 \xABTutor del test\xBB, o abre ?t=mesa-torsion&tutor=1 (Wilson \xA77.7, malla, ACI \xA722.7.3.2)."
    ],
    params: {
      activeCase: {
        default: 0,
        label: "Caso visualizado",
        options: {
          "Dead (selfweight)": 0,
          "Live (q=0.5 tonf/m\xB2)": 1,
          "SCP (q=1.0 tonf/m\xB2)": 2,
          "UDCon1 (1.4D+1.4SCP)": 3,
          "UDCon2 (1.2D+1.6L+1.2SCP)": 4
        },
        folder: "Caso"
      },
      Lx: {
        default: 6,
        min: 4,
        max: 12,
        step: 0.5,
        label: "Lx (m)",
        folder: "Geometr\xEDa"
      },
      Ly: {
        default: 6,
        min: 4,
        max: 12,
        step: 0.5,
        label: "Ly (m)",
        folder: "Geometr\xEDa"
      },
      H: {
        default: 4,
        min: 2.5,
        max: 6,
        step: 0.25,
        label: "H piso (m)",
        folder: "Geometr\xEDa"
      },
      nMesh: {
        default: 5,
        min: 1,
        max: 32,
        step: 1,
        label: "Subdiv losa (n\xD7n)",
        folder: "Geometr\xEDa"
      },
      vigaNudos: {
        default: 1,
        label: "Uni\xF3n viga\u2013losa",
        options: {
          "Nudos compartidos (viga partida en la malla)": 1,
          "Solo en los extremos (viga de una pieza)": 0
        },
        folder: "Geometr\xEDa"
      },
      bCol: {
        default: 0.4,
        min: 0.25,
        max: 0.8,
        step: 0.05,
        label: "b col (m)",
        folder: "Secciones"
      },
      hCol: {
        default: 0.4,
        min: 0.25,
        max: 0.8,
        step: 0.05,
        label: "h col (m)",
        folder: "Secciones"
      },
      bViga: {
        default: 0.3,
        min: 0.2,
        max: 0.6,
        step: 0.05,
        label: "b viga (m)",
        folder: "Secciones"
      },
      hViga: {
        default: 0.5,
        min: 0.3,
        max: 0.9,
        step: 0.05,
        label: "h viga (m)",
        folder: "Secciones"
      },
      tLosa: {
        default: 0.1,
        min: 0.08,
        max: 0.3,
        step: 0.01,
        label: "t losa (m)",
        folder: "Secciones"
      },
      factorJ: {
        default: 1,
        min: 1e-3,
        max: 1,
        step: 1e-4,
        label: "Factor J vigas",
        folder: "Secciones"
      },
      E_GPa: {
        default: 24.85,
        min: 15,
        max: 35,
        step: 0.5,
        label: "E (GPa)",
        folder: "Material"
      },
      nu: {
        default: 0.2,
        min: 0.1,
        max: 0.3,
        step: 0.01,
        label: "\u03BD",
        folder: "Material"
      },
      gamma_kNm3: {
        default: 23.57,
        min: 18,
        max: 28,
        step: 0.1,
        label: "\u03B3 (kN/m\xB3)",
        folder: "Material"
      },
      apoyo: {
        default: 0,
        label: "Apoyo base",
        options: {
          "Pinned (UX UY UZ)": 0,
          "Empotrado (6 DOF)": 1
        },
        folder: "Apoyo"
      },
      rigidOffsets: {
        default: 1,
        label: "Rigid offsets ETABS-like",
        options: {
          "ON (h_viga/2 + b_col/2)": 1,
          "OFF (full length)": 0
        },
        folder: "ETABS features"
      },
      q_SCP: {
        default: 1,
        min: 0,
        max: 5,
        step: 0.1,
        label: "SCP (tonf/m\xB2)",
        folder: "Cargas"
      },
      q_Live: {
        default: 0.5,
        min: 0,
        max: 5,
        step: 0.1,
        label: "Live (tonf/m\xB2)",
        folder: "Cargas"
      },
      nModos: {
        default: 12,
        min: 3,
        max: 24,
        step: 1,
        label: "N modos modal",
        folder: "Modal"
      },
      masaModal: {
        default: 0,
        label: "Masa modal",
        options: {
          "ETABS (K_M: viga en esquinas, lateral, por piso)": 0,
          "Por elemento (viga repartida)": 1
        },
        folder: "Modal"
      }
    },
    computedLabels(e, o) {
      const t = {}, a = o._mesaTorsionCases;
      if (!a) return t;
      t["\u2014\u2014 ETABS ref T\u2081 Ux \u2014\u2014"] = `${O[0].toFixed(4)} s`, t["\u2014\u2014 ETABS ref T\u2082 Uy \u2014\u2014"] = `${O[1].toFixed(4)} s`, t["\u2014\u2014 ETABS ref T\u2083 Rz \u2014\u2014"] = `${O[2].toFixed(4)} s`;
      for (const n of [
        "Dead",
        "Live",
        "SCP",
        "UDCon1",
        "UDCon2"
      ]) {
        const r = a[n], i = Mt[n];
        if (!r || !i) continue;
        const s = (c, m) => {
          const p = m !== 0 ? (c - m) / m * 100 : 0;
          return `H=${c.toFixed(2)}  E=${m.toFixed(2)}  \u0394=${p >= 0 ? "+" : ""}${p.toFixed(1)}%`;
        };
        t[`${n} |P|`] = s(r.P, i.P), t[`${n} |V\u2082|`] = s(r.V2, i.V2), t[`${n} |V\u2083|`] = s(r.V3, i.V3), t[`${n} |T|`] = s(r.T, i.T), t[`${n} |M\u2082|`] = s(r.M2, i.M2), t[`${n} |M\u2083|`] = s(r.M3, i.M3);
      }
      return t;
    },
    build(e, o) {
      const t = Math.round(e.nMesh), a = e.Lx, n = e.Ly, r = e.H, i = a / t, s = n / t, c = e.gamma_kNm3 / 9.81, m = [
        [
          0,
          0,
          0
        ],
        [
          a,
          0,
          0
        ],
        [
          a,
          n,
          0
        ],
        [
          0,
          n,
          0
        ]
      ], p = 4;
      for (let l = 0; l <= t; l++) for (let f = 0; f <= t; f++) m.push([
        f * i,
        l * s,
        r
      ]);
      const d = (l, f) => p + f * (t + 1) + l, u = [];
      for (let l = 0; l < t; l++) for (let f = 0; f < t; f++) u.push([
        d(f, l),
        d(f + 1, l),
        d(f + 1, l + 1),
        d(f, l + 1)
      ]);
      const h = u.length;
      u.push([
        0,
        d(0, 0)
      ]), u.push([
        1,
        d(t, 0)
      ]), u.push([
        2,
        d(t, t)
      ]), u.push([
        3,
        d(0, t)
      ]);
      const N = h, U = u.length, g = Math.round(e.vigaNudos ?? 1) === 0 ? 1 : t, M = t / g;
      for (let l = 0; l < g; l++) u.push([
        d(l * M, 0),
        d((l + 1) * M, 0)
      ]);
      for (let l = 0; l < g; l++) u.push([
        d(t, l * M),
        d(t, (l + 1) * M)
      ]);
      for (let l = 0; l < g; l++) u.push([
        d(l * M, t),
        d((l + 1) * M, t)
      ]);
      for (let l = 0; l < g; l++) u.push([
        d(0, l * M),
        d(0, (l + 1) * M)
      ]);
      const oe = U, G = u.length, X = /* @__PURE__ */ new Map(), ae = e.apoyo < 0.5;
      for (const l of [
        0,
        1,
        2,
        3
      ]) X.set(l, ae ? [
        true,
        true,
        true,
        false,
        false,
        false
      ] : [
        true,
        true,
        true,
        true,
        true,
        true
      ]);
      const ve = e.E_GPa * 1e6, st = ve / (2 * (1 + e.nu)), it = /* @__PURE__ */ new Map(), Me = /* @__PURE__ */ new Map(), Te = /* @__PURE__ */ new Map(), Ie = /* @__PURE__ */ new Map(), qe = /* @__PURE__ */ new Map(), Fe = /* @__PURE__ */ new Map(), Ne = /* @__PURE__ */ new Map(), je = /* @__PURE__ */ new Map(), Ee = /* @__PURE__ */ new Map(), Oe = /* @__PURE__ */ new Map(), ke = /* @__PURE__ */ new Map(), rt = /* @__PURE__ */ new Map();
      for (let l = 0; l < h; l++) it.set(l, e.tLosa), Me.set(l, ve), Te.set(l, e.nu), Ee.set(l, c), rt.set(l, 1);
      const lt = e.bCol * e.hCol, Lt = e.bCol * Math.pow(e.hCol, 3) / 12, Dt = e.hCol * Math.pow(e.bCol, 3) / 12, ct = (l, f) => {
        const S = Math.max(l, f), T = Math.min(l, f), _ = T / S;
        return 1 / 3 * (1 - 0.21 * _ * (1 - Math.pow(_, 4) / 12)) * S * Math.pow(T, 3);
      }, zt = ct(e.bCol, e.hCol), dt = e.rigidOffsets > 0.5 ? e.hViga / 2 / r : 0;
      for (let l = N; l < U; l++) Me.set(l, ve), Te.set(l, e.nu), je.set(l, st), Ie.set(l, lt), qe.set(l, Dt), Fe.set(l, Lt), Ne.set(l, zt), Ee.set(l, c), Oe.set(l, {
        type: "rect",
        b: e.bCol,
        h: e.hCol
      }), dt > 0 && ke.set(l, [
        0,
        dt
      ]);
      const ut = e.bViga * e.hViga, Bt = e.bViga * Math.pow(e.hViga, 3) / 12, Pt = e.hViga * Math.pow(e.bViga, 3) / 12, It = ct(e.bViga, e.hViga) * (e.factorJ ?? 1), mt = a / g, Ve = e.rigidOffsets > 0.5 ? e.bCol / 2 / mt : 0;
      let D = oe;
      for (let l = 0; l < 4; l++) for (let f = 0; f < g; f++) {
        if (Me.set(D, ve), Te.set(D, e.nu), je.set(D, st), Ie.set(D, ut), qe.set(D, Pt), Fe.set(D, Bt), Ne.set(D, It), Ee.set(D, c), Oe.set(D, {
          type: "rect",
          b: e.bViga,
          h: e.hViga
        }), Ve > 0) {
          const S = f === 0 ? Ve : 0, T = f === g - 1 ? Ve : 0;
          S + T > 0 && ke.set(D, [
            S,
            T
          ]);
        }
        D++;
      }
      o.nodes.val = m, o.elements.val = u, o.elementInputs.val = {
        elasticities: Me,
        poissonsRatios: Te,
        shearModuli: je,
        areas: Ie,
        momentsOfInertiaY: qe,
        momentsOfInertiaZ: Fe,
        torsionalConstants: Ne,
        thicknesses: it,
        densities: Ee,
        sectionShapes: Oe,
        rigidOffsets: ke.size > 0 ? ke : void 0,
        plateFormulations: rt
      }, o._mesaTorsionIdx = {
        beamStart: oe,
        beamEnd: G,
        RHO: c,
        topCorners: [
          d(0, 0),
          d(t, 0),
          d(t, t),
          d(0, t)
        ]
      };
      function pt(l, f, S) {
        const T = /* @__PURE__ */ new Map(), _ = (E, z) => {
          const P = T.get(E) || [
            0,
            0,
            0,
            0,
            0,
            0
          ];
          T.set(E, [
            P[0],
            P[1],
            P[2] + z,
            P[3],
            P[4],
            P[5]
          ]);
        };
        if (l !== 0) {
          for (let $ = 0; $ < t; $++) for (let A = 0; A < t; A++) {
            const He = -(e.tLosa * i * s * e.gamma_kNm3 * l) / 4;
            for (const we of [
              d(A, $),
              d(A + 1, $),
              d(A + 1, $ + 1),
              d(A, $ + 1)
            ]) _(we, He);
          }
          const E = lt * r * e.gamma_kNm3 * l, z = [
            [
              0,
              d(0, 0)
            ],
            [
              1,
              d(t, 0)
            ],
            [
              2,
              d(t, t)
            ],
            [
              3,
              d(0, t)
            ]
          ];
          for (const [$, A] of z) _($, -E / 2), _(A, -E / 2);
          let P = oe;
          for (let $ = 0; $ < 4; $++) for (let A = 0; A < g; A++) {
            const [Se, He] = u[P], we = ut * mt * e.gamma_kNm3 * l;
            _(Se, -we / 2), _(He, -we / 2), P++;
          }
        }
        const Y = (f + S) * ne;
        if (Y !== 0) for (let E = 0; E <= t; E++) for (let z = 0; z <= t; z++) {
          const A = (z === 0 || z === t) && (E === 0 || E === t) ? 0.25 : z === 0 || z === t || E === 0 || E === t ? 0.5 : 1, Se = -Y * i * s * A;
          _(d(z, E), Se);
        }
        return T;
      }
      const me = [
        {
          name: "Dead",
          sw: 1,
          scp: 0,
          live: 0
        },
        {
          name: "Live",
          sw: 0,
          scp: 0,
          live: e.q_Live
        },
        {
          name: "SCP",
          sw: 0,
          scp: e.q_SCP,
          live: 0
        },
        {
          name: "UDCon1",
          sw: 1.4,
          scp: 1.4 * e.q_SCP,
          live: 0
        },
        {
          name: "UDCon2",
          sw: 1.2,
          scp: 1.2 * e.q_SCP,
          live: 1.6 * e.q_Live
        }
      ], Re = {}, Je = {};
      for (const l of me) {
        const f = pt(l.sw, l.scp, l.live);
        try {
          const S = Nt(m, u, {
            supports: X,
            loads: f
          }, o.elementInputs.val), T = qt(m, u, o.elementInputs.val, S);
          Re[l.name] = {
            deform: S,
            analyze: T
          }, Je[l.name] = uo(T, N, G);
        } catch (S) {
          console.warn(`[Mesa torsi\xF3n] caso ${l.name} fall\xF3:`, S.message);
        }
      }
      o._mesaTorsionCases = Je, o._mesaTorsionAllResults = Re;
      const pe = [
        "Dead",
        "Live",
        "SCP",
        "UDCon1",
        "UDCon2"
      ][Math.round(e.activeCase)] || "UDCon2", We = Re[pe];
      We && (o.deformOutputs.val = We.deform, o.analyzeOutputs.val = We.analyze), o.nodeInputs.val = {
        supports: X,
        loads: pt(me.find((l) => l.name === pe).sw, me.find((l) => l.name === pe).scp, me.find((l) => l.name === pe).live)
      };
      const K = [];
      K.push(`[Mesa torsi\xF3n] Caso visualizado: ${pe}`), K.push(`  Discretizaci\xF3n: ${h} shells losa, 4 cols, ${G - oe} segs viga`), K.push(`  Rigid offsets: ${e.rigidOffsets > 0.5 ? `ON (col top -${(e.hViga / 2).toFixed(2)}m, viga ends -${(e.bCol / 2).toFixed(2)}m)` : "OFF"}`), K.push(""), K.push("  Picks por caso \u2014 Hekatan vs ETABS (\u0394% relativo, sin remapear componentes):"), K.push(`  ${"Case".padEnd(8)} ${"Comp".padEnd(4)} ${"Hekatan".padStart(10)} ${"ETABS".padStart(10)} ${"\u0394%".padStart(8)}`);
      for (const l of me) {
        const f = Je[l.name], S = Mt[l.name];
        if (!(!f || !S)) for (const T of [
          "P",
          "V2",
          "V3",
          "T",
          "M2",
          "M3"
        ]) {
          const _ = f[T], Y = S[T], E = Y !== 0 ? (_ - Y) / Y * 100 : 0;
          K.push(`  ${l.name.padEnd(8)} ${T.padEnd(4)} ${_.toFixed(3).padStart(10)} ${Y.toFixed(3).padStart(10)} ${(E >= 0 ? "+" : "") + E.toFixed(1).padStart(7)}%`);
        }
      }
      console.log(K.join(`
`)), o.objects3D.val = [], no("mesa-torsion", "Tutor \xB7 Mesa de torsi\xF3n: T_u, malla y fisuraci\xF3n", co);
    },
    runModal(e, o, t) {
      if (!o.nodes.val.length) return;
      const a = Math.round(e.nModos);
      try {
        let n = o.nodeInputs.val, r = o.elementInputs.val, i = 0, s = 0;
        const c = o._mesaTorsionIdx;
        if (Math.round(e.masaModal ?? 0) === 0 && c) {
          const d = new Map(r.densities);
          for (let g = c.beamStart; g < c.beamEnd; g++) d.set(g, 0);
          const u = e.rigidOffsets > 0.5 ? e.bCol : 0, h = (g) => c.RHO * e.bViga * e.hViga * (g - u) / 2, N = h(e.Lx) + h(e.Ly), U = new Map(n.masses ?? []);
          for (const g of c.topCorners) U.set(g, (U.get(g) ?? 0) + N);
          r = {
            ...r,
            densities: d
          }, n = {
            ...n,
            masses: U
          }, i = 1, s = 1;
        }
        const m = Ft(o.nodes.val, o.elements.val, n, r, a, i, s);
        o._mesaTorsionModal = {
          nodeInputs: n,
          elementInputs: r,
          lateral: i,
          lump: s,
          out: m
        };
        const p = [];
        p.push(`[Mesa torsi\xF3n Modal Hekatan FEM 3D] ${a} modos:`);
        for (let d = 0; d < Math.min(a, 6); d++) {
          const u = 1 / m.frequencies[d];
          p.push(`  Modo ${d + 1}: T = ${u.toFixed(4)} s   f = ${m.frequencies[d].toFixed(3)} Hz`);
        }
        p.push(""), p.push("ETABS 19.1 reference:"), p.push(`  Modo 1 T\u2081 Ux = ${O[0].toFixed(4)} s`), p.push(`  Modo 2 T\u2082 Uy = ${O[1].toFixed(4)} s`), p.push(`  Modo 3 T\u2083 Rz = ${O[2].toFixed(4)} s`), console.log(p.join(`
`)), (t == null ? void 0 : t.render) && t.render(m, {
          title: `Mesa de Torsi\xF3n \u2014 ${e.Lx}\xD7${e.Ly}m, ${e.H}m alto`,
          properties: [
            `${e.apoyo < 0.5 ? "Pinned base" : "Empotrado"}  E=${e.E_GPa} GPa  \u03BD=${e.nu}`,
            `ETABS ref: T\u2081=${O[0]}s  T\u2082=${O[1]}s  T\u2083=${O[2]}s`
          ]
        });
      } catch (n) {
        console.error("[Mesa torsi\xF3n Modal] error:", n.message);
      }
    }
  };
  function uo(e, o, t) {
    const a = (n) => {
      if (!n) return 0;
      let r = 0;
      for (let i = o; i < t; i++) {
        const s = n.get(i);
        s && (r = Math.max(r, Math.abs(s[0]), Math.abs(s[1])));
      }
      return r;
    };
    return {
      P: a(e.normals) / ne,
      V2: a(e.shearsY) / ne,
      V3: a(e.shearsZ) / ne,
      T: a(e.torsions) / ne,
      M2: a(e.bendingsY) / ne,
      M3: a(e.bendingsZ) / ne
    };
  }
});
export {
  __tla,
  no as a,
  ho as b,
  xo as m,
  bo as n,
  Jt as r,
  go as v
};
