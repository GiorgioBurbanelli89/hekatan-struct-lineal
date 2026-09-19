import { c as he, __tla as __tla_0 } from "./cliModeler-D9AgmNSt.js";
import { S as ie, __tla as __tla_1 } from "./zapataAislada-CQrigBkj.js";
import { v as fe, r as H } from "./menuDiseno-DjPLZbn7.js";
let He, Qe;
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
  const B = (a, o = 4) => +a.toFixed(o), De = (a) => K(a.fc) / 98.0665 * 10, W = {
    K: {
      id: "K",
      titulo: [
        "K del elemento de placa",
        "Plate element K"
      ],
      hijos: [
        "B",
        "D",
        "G",
        "ENS"
      ],
      hoja: (a) => {
        const o = a.Lx / a.n;
        return [
          "# La matriz de rigidez K del elemento de placa",
          `#: Qu\xE9 usa de verdad el solver en esta zapata (Shell-Thick): la flexi\xF3n con los modos incompatibles de Wilson condensados y el cortante con el MITC4 de Dvorkin y Bathe (1984). Archivo hekatan-fem/src/cpp/utils/shellQ4.cpp, getBendingK (l\xEDneas 807\u20131015). Elemento del modelo abierto: cuadrado de lado h = ${B(o)} m, espesor ${a.t} m.`,
          "#: La rigidez es la energ\xEDa de deformaci\xF3n escrita en los 12 movimientos del elemento (w, \u03B8x, \u03B8y en sus 4 nudos). Dos energ\xEDas, flexi\xF3n y cortante:",
          "K_e = Integral{transpose(B_b)*D_b*B_b + transpose(B_s)*D_s*B_s}",
          "#: B_{b} pasa de los movimientos a las curvaturas (\xBFde d\xF3nde sale? \u2192 B), D_{b} y D_{s} son el material (\u2192 D), y la integral se hace con puntos de Gauss (\u2192 Gauss). Luego cada K_{e} se suma en la K de toda la zapata (\u2192 ensamble).",
          "#: Qu\xE9 simplifica esta cadena: las cuentas se hacen para el cuadrado del modelo y sin los modos incompatibles (el motor los a\xF1ade en la flexi\xF3n y los condensa: Bathe y Wilson 1976, \xA74, ecs. 4.43\u20134.44). En un cuadrado su efecto es peque\xF1o; en un trapecio no.",
          `h_e = ${B(o, 6)}`,
          "A_e = dec(h_e^2, 6)"
        ].join(`
`) + `
`;
      }
    },
    B: {
      id: "B",
      titulo: [
        "B: de los movimientos a las curvaturas",
        "B: from displacements to curvatures"
      ],
      hijos: [
        "N",
        "J"
      ],
      hoja: (a) => {
        const o = a.Lx / a.n;
        return [
          "# B: de los movimientos a las curvaturas",
          "#: En la placa gruesa los giros \u03B2_{x}, \u03B2_{y} se interpolan con las mismas funciones N que w (\u2192 N). La flexi\xF3n mira c\xF3mo CAMBIAN los giros: las curvaturas son sus derivadas.",
          "kappa_x = Diff{beta_x @ x}",
          "kappa_y = Diff{beta_y @ y}",
          "#: Con \u03B2 = \u03A3 N_{i}\xB7\u03B2_{i}, cada columna de B_{b} es una derivada de una N. Para el nudo 1 de un cuadrado de lado h con origen en ese nudo:",
          "N_1 = (1 - x/h)*(1 - y/h)",
          "dN1 = Diff{(1 - x/h)*(1 - y/h) @ x}",
          `#: Las derivadas en x, y salen de las de \u03BE, \u03B7 con la inversa del Jacobiano (\u2192 J): en el motor, shellQ4.cpp l\xEDneas 876\u2013877. Con el elemento del modelo (h = ${B(o)} m), en el centro (x = y = h/2):`,
          `dN1_c = dec(-(1 - 0.5)/${B(o, 6)}, 4)`,
          "#: En 1/m. Un elemento m\xE1s chico tiene derivadas m\xE1s grandes: por eso la rigidez crece al refinar la malla en flexi\xF3n."
        ].join(`
`) + `
`;
      }
    },
    N: {
      id: "N",
      titulo: [
        "N: funciones de forma del Q4",
        "N: Q4 shape functions"
      ],
      hijos: [],
      hoja: () => [
        "# N: las funciones de forma del cuadril\xE1tero de 4 nudos",
        "#: Con 4 nudos se pueden fijar 4 coeficientes: a + b\xB7\u03BE + c\xB7\u03B7 + d\xB7\u03BE\u03B7 (bilineal). Cada N_{i} vale 1 en su nudo y 0 en los otros tres; en el cuadrado de referencia (\u03BE, \u03B7 de \u22121 a 1):",
        "N_1 = (1 - xi)*(1 - eta)/4",
        "N_2 = (1 + xi)*(1 - eta)/4",
        "N_3 = (1 + xi)*(1 + eta)/4",
        "N_4 = (1 - xi)*(1 + eta)/4",
        "#: Suman 1 en todo el elemento (as\xED un movimiento r\xEDgido no deforma nada):",
        "S_N = Expand{(1 - xi)*(1 - eta)/4 + (1 + xi)*(1 - eta)/4 + (1 + xi)*(1 + eta)/4 + (1 - xi)*(1 + eta)/4}",
        "#: A lo largo de un lado (\u03B7 = \u22121) N_{1} baja recta de 1 a 0 y N_{2} sube: lineal por lado, por eso dos elementos vecinos encajan sin huecos.",
        "#fplot((1 - x)/2, (1 + x)/2, [-1 1])",
        "#: Libro: Chandrupatla y Belegundu, \xABIntroducci\xF3n al estudio del elemento finito en ingenier\xEDa\xBB, cap. 7 (Q4). En el motor: shellQ4.cpp, dNdxi/dNdeta de getBendingK."
      ].join(`
`) + `
`
    },
    J: {
      id: "J",
      titulo: [
        "J: el Jacobiano",
        "J: the Jacobian"
      ],
      hijos: [],
      hoja: (a) => {
        const o = a.Lx / a.n;
        return [
          "# J: del cuadrado de referencia al elemento real",
          "#: Las N se escriben en \u03BE, \u03B7 (de \u22121 a 1) pero la placa vive en x, y. El elemento real se dibuja con las MISMAS N (isoparam\xE9trico): x = \u03A3 N_{i}\xB7x_{i}. El Jacobiano mide cu\xE1nto se estira el cuadrado de referencia:",
          "J_11 = Diff{h/2*(1 + xi) @ xi}",
          "#: En un cuadrado de lado h, x = (h/2)(1 + \u03BE): J es h/2 en la diagonal y cero fuera. El \xE1rea se escala con su determinante:",
          "det_J = (h/2)^2",
          `#: Con el elemento del modelo (h = ${B(o)} m):`,
          `J_1 = dec(${B(o, 6)}/2, 5)`,
          `detJ_1 = dec((${B(o, 6)}/2)^2, 7)`,
          "#: Y las derivadas en x salen de las de \u03BE dividiendo por J: \u2202N/\u2202x = (\u2202N/\u2202\u03BE)/J_{11}. En el motor: jacobian2D, shellQ4.cpp l\xEDnea 858."
        ].join(`
`) + `
`;
      }
    },
    G: {
      id: "G",
      titulo: [
        "Gauss: por qu\xE9 2\xD72 puntos",
        "Gauss: why 2\xD72 points"
      ],
      hijos: [],
      hoja: () => [
        "# La integral con puntos de Gauss",
        "#: La K es una integral sobre el elemento. En vez de integrar a mano, se eval\xFAa el integrando en pocos puntos elegidos y se suma con pesos. Con 2 puntos en \u03BE = \xB11/\u221A3 (peso 1 cada uno) la regla es EXACTA para polinomios hasta grado 3:",
        "I_exacta = Area{xi^2 @ xi=-1:1}",
        "I_gauss = (-1/sqrt(3))^2 + (1/sqrt(3))^2",
        "#: Las dos dan 2/3. En la flexi\xF3n del Q4, B\u1D40\xB7D\xB7B es de grado 2 en cada direcci\xF3n: 2\xD72 puntos la integran exacta. Menos puntos dejar\xEDan modos de energ\xEDa nula (el elemento ser\xEDa un mecanismo); m\xE1s no cambian nada.",
        "#fplot(x^2, 1/3, [-1 1])",
        "#: El cortante, en cambio, integrado as\xED \xABbloquea\xBB la placa delgada (shear locking, Bathe y Wilson 1976, p. 148): por eso el MITC4 lo toma en los centros de los lados y lo interpola (shellQ4.cpp, l\xEDneas 927\u20131010). Libro de la regla: Chandrupatla y Belegundu, cap. 7."
      ].join(`
`) + `
`
    },
    D: {
      id: "D",
      titulo: [
        "D: el material de la placa",
        "D: plate material"
      ],
      hijos: [],
      hoja: (a) => {
        const o = De(a);
        return [
          "# D: la ley del material (flexi\xF3n y cortante)",
          "#: Una placa de espesor t: los momentos por metro salen de las curvaturas multiplicadas por la rigidez a flexi\xF3n. El t\xB3/12 es el momento de inercia de una franja de 1 m de ancho, y 1 \u2212 \u03BD\xB2 es porque la placa no puede encogerse de lado como una viga:",
          "D_0 = E*t^3/(12*(1 - nu^2))",
          "#: El cortante transversal, con el factor 5/6 de la distribuci\xF3n parab\xF3lica de tensiones:",
          "D_s = 5/6*G*t",
          `#: Con el hormig\xF3n del modelo (f'c ${a.fc} kgf/cm\xB2 \u2192 E = 15100\xB7\u221Af'c = ${B(o, 0)} tonf/m\xB2, \u03BD = 0.2) y t = ${a.t} m:`,
          `D_1 = dec(${B(o, 1)}*${a.t}^3/(12*(1 - 0.2^2)), 1)`,
          `Ds_1 = dec(5/6*${B(o, 1)}/(2*(1 + 0.2))*${a.t}, 1)`,
          "#: D_{1} en tonf\xB7m y Ds_{1} en tonf/m. En el motor: shellQ4.cpp l\xEDneas 811\u2013821 (D0, Db, ks = 5/6, Ds)."
        ].join(`
`) + `
`;
      }
    },
    ENS: {
      id: "ENS",
      titulo: [
        "Ensamble: la tabla de GDL",
        "Assembly: the DOF table"
      ],
      hijos: [
        "W"
      ],
      hoja: (a) => {
        const o = (a.n + 1) ** 2;
        return [
          "# El ensamble: de muchas K peque\xF1as a una K grande",
          "#: Cada nudo tiene 6 grados de libertad en el motor (3 traslaciones y 3 giros). El nudo n ocupa las filas 6n a 6n + 5. La K del elemento (en sus 4 nudos) se SUMA en esas filas y columnas: donde dos elementos comparten un nudo, sus rigideces se suman.",
          "#| Nudo | GDL | Qu\xE9 es |",
          "#|---|---|---|",
          "#| n | 6n | u_{x} (fijo en la zapata) |",
          "#| n | 6n+1 | u_{y} (fijo) |",
          "#| n | 6n+2 | w (baja) |",
          "#| n | 6n+3 | \u03B8_{x} |",
          "#| n | 6n+4 | \u03B8_{y} |",
          "#| n | 6n+5 | \u03B8_{z} (fijo) |",
          `#: En el modelo abierto: ${o} nudos \u2192 ${6 * o} filas, de las que quedan libres ${3 * o} (w, \u03B8x, \u03B8y). Despu\xE9s se suman los resortes del suelo en la diagonal del w de cada nudo (\u2192 Winkler) y se resuelve:`,
          "F = K*u",
          "#: En el motor: getGlobalStiffnessMatrix.cpp (tripletas sumadas, l\xEDneas 20\u2013146) y los resortes en deform.cpp l\xEDneas 162\u2013170."
        ].join(`
`) + `
`;
      }
    },
    W: {
      id: "W",
      titulo: [
        "Resorte Winkler: k = ks\xB7A",
        "Winkler spring: k = ks\xB7A"
      ],
      hijos: [
        "NL"
      ]
    },
    NL: {
      id: "NL",
      titulo: [
        "No linealidad: apagar los resortes en tracci\xF3n",
        "Nonlinearity: switching off springs in tension"
      ],
      hijos: []
    }
  }, Me = "https://giorgioburbanelli89.github.io/hekatan-lisp/";
  async function Ce(a) {
    const o = new Blob([
      a
    ]).stream().pipeThrough(new window.CompressionStream("deflate-raw")), e = new Uint8Array(await new Response(o).arrayBuffer());
    let t = "";
    for (const l of e) t += String.fromCharCode(l);
    return btoa(t).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  const Be = {
    es: {
      sub: "Hekatan LISP web \xB7 con los n\xFAmeros del modelo abierto",
      calc: "Abre Hekatan LISP con las variables del modelo y la calculadora \u{1F5A9}",
      plegar: "Plegar / desplegar",
      cerrar: "Cerrar (Esc)",
      ley: "lo usa el modelo abierto \xB7 \u{1F9EE} arriba: calculadora",
      pronto: "\u23F3 pr\xF3ximamente",
      lab: "Hekatan Lab (la K num\xE9rica ensamblada) solo tiene versi\xF3n de escritorio: \u23F3",
      boton: "\u{1F393} Tutor FEM",
      botonT: "El FEM de esta zapata, paso a paso, en Hekatan LISP",
      sinSol: "Primero hay que resolver el modelo.",
      hojaEn: "",
      idioma: "EN",
      idiomaT: "English",
      opsT: "Exporta ESTE modelo (losa ShellMITC4 + resortes; ENT = suelo sin tracci\xF3n) para correrlo en OpenSees"
    },
    en: {
      sub: "Hekatan LISP web \xB7 with the numbers of the open model",
      calc: "Opens Hekatan LISP with the model variables and the calculator \u{1F5A9}",
      plegar: "Collapse / expand",
      cerrar: "Close (Esc)",
      ley: "used by the open model \xB7 \u{1F9EE} top: calculator",
      pronto: "\u23F3 coming soon",
      lab: "Hekatan Lab (the assembled numeric K) is desktop-only: \u23F3",
      boton: "\u{1F393} FEM Tutor",
      botonT: "The FEM of this footing, step by step, in Hekatan LISP",
      sinSol: "Solve the model first.",
      hojaEn: "(the worksheets are in Spanish for now; English \u23F3)",
      idioma: "ES",
      idiomaT: "Espa\xF1ol",
      opsT: "Exports THIS model (ShellMITC4 slab + springs; ENT = tensionless soil) to run it in OpenSees"
    }
  };
  function C() {
    try {
      const a = localStorage.getItem("hk_tutor_lang");
      if (a === "es" || a === "en") return a;
    } catch {
    }
    return (navigator.language || "es").toLowerCase().startsWith("es") ? "es" : "en";
  }
  const E = (a) => Be[C()][a] ?? a, d = (a, o = 3) => Number.isFinite(a) ? +a.toFixed(o) : 0;
  function ge(a, o) {
    const e = a.nodes.map((u) => u[0]), t = a.nodes.map((u) => u[1]), l = Math.min(...e), n = Math.max(...e), h = Math.min(...t), g = Math.max(...t), m = (n - l) / a.p.n, k = (g - h) / a.p.n;
    let i = 0;
    return o.forEach((u, f) => {
      if (!u) return;
      const x = a.nodes[a.nodosComp[f]], r = Math.abs(x[0] - l) < 1e-9 || Math.abs(x[0] - n) < 1e-9 ? 0.5 : 1, p = Math.abs(x[1] - h) < 1e-9 || Math.abs(x[1] - g) < 1e-9 ? 0.5 : 1;
      i += m * k * r * p;
    }), i;
  }
  function xe(a) {
    const { p: o, nodes: e, vueltas: t, nodosComp: l } = a, n = [], h = o.Lx / o.n, g = o.ks, m = K(o.fc) / 98.0665 * 10, k = o.exL * o.Lx, i = o.eyB * o.Ly, u = Math.abs(o.Lx - y.Lx) + Math.abs(o.Ly - y.Ly) + Math.abs(o.exL - y.exL) + Math.abs(o.eyB - y.eyB) + Math.abs(o.t - y.t) + Math.abs(o.ks - y.ks) + Math.abs(o.P - y.P) + Math.abs(o.n - y.n) + Math.abs(o.c - y.c) < 1e-6, f = new Map(l.map((L, A) => [
      L,
      A
    ])), x = t[t.length - 1], r = t.map((L, A) => {
      var _a;
      let q = 0, R = 0, Q = 0;
      L.activo.forEach((T, w) => {
        if (!T) return;
        q++;
        const re = L.uz[l[w]];
        re > 0 && R++, Q = Math.max(Q, -re * g);
      });
      const P = (_a = t[A + 1]) == null ? void 0 : _a.activo, U = P ? L.activo.filter((T, w) => T && !P[w]).length : 0, G = P ? L.activo.filter((T, w) => !T && P[w]).length : 0;
      return {
        k: A + 1,
        act: q,
        trac: R,
        apaga: U,
        enciende: G,
        qmax: Q
      };
    }), p = k >= 0 ? 1 : -1, c = i >= 0 ? 1 : -1, b = p > 0 ? o.Lx : 0, s = c > 0 ? o.Ly : 0, v = o.Lx - b, j = o.Ly - s, D = Math.hypot(o.Lx, o.Ly), F = 11, _ = Array.from({
      length: F
    }, (L, A) => {
      const q = A / (F - 1), R = b + (v - b) * q, Q = s + (j - s) * q;
      let P = 0, U = 1 / 0;
      return e.forEach((G, T) => {
        const w = (G[0] - R) ** 2 + (G[1] - Q) ** 2;
        w < U && (U = w, P = T);
      }), {
        dist: q * D,
        nodo: P
      };
    }), S = t.map((L) => _.map(({ nodo: A }) => {
      const q = f.get(A);
      return q === void 0 || !L.activo[q] ? 0 : d(-L.uz[A] * g, 2);
    })), z = D / (F - 1), N = (L) => `(1 - abs(x - ${d(L, 4)})/${d(z, 4)} + abs(1 - abs(x - ${d(L, 4)})/${d(z, 4)}))/2`, I = S.map((L, A) => `(1 - sign(abs(n - ${A + 1})))*(` + L.map((q, R) => q === 0 ? "" : `${q}*${N(_[R].dist)}`).filter(Boolean).join(" + ") + ")").join(" + ");
    let X = 0, te = 0;
    x.activo.forEach((L, A) => {
      L && te++, X = Math.min(X, x.uz[l[A]]);
    });
    const se = -X * g, Y = ne(o, 200), le = V(o.Lx, o.Ly, k, i);
    return n.push("# Tutor FEM: la zapata que se levanta, paso a paso"), n.push(`#: Esta hoja la escribe Hekatan Struct con los n\xFAmeros del modelo que tienes abierto: zapata de ${o.Lx} \xD7 ${o.Ly} \xD7 ${o.t} m, f'c ${o.fc} kgf/cm\xB2, suelo con ks = ${o.ks} tonf/m\xB3, carga Q = ${d(o.P, 3)} tonf (${d(o.P * Z, 1)} kN) con excentricidades e_{x} = ${d(k, 3)} m y e_{y} = ${d(i, 3)} m, malla de ${o.n} \xD7 ${o.n} elementos. Cambia el modelo y vuelve a abrir el tutor: la hoja cambia con \xE9l.`), n.push(""), n.push("## a) El suelo como resortes (Winkler)"), n.push("#: Winkler: el suelo es una cama de resortes independientes. La presi\xF3n en un punto es proporcional a lo que se hunde ah\xED: q = ks\xB7w. En el FEM la cama se concentra en los nudos: cada nudo carga el \xE1rea que le toca (su \xAB\xE1rea tributaria\xBB), as\xED que su resorte vale ks por esa \xE1rea."), n.push("k_nudo = ks*A_trib"), n.push("#: Con celdas cuadradas de lado h, un nudo interior se lleva una celda entera, uno de borde media y una esquina un cuarto:"), n.push("k_int = ks*h^2"), n.push("k_borde = ks*h^2/2"), n.push("k_esq = ks*h^2/4"), n.push(`#: Con los n\xFAmeros del modelo (h = ${d(h, 4)} m, ks = ${o.ks} tonf/m\xB3):`), n.push(`k_1 = dec(${o.ks}*${d(h, 6)}^2, 3)`), n.push(`k_2 = dec(${o.ks}*${d(h, 6)}^2/2, 3)`), n.push(`k_3 = dec(${o.ks}*${d(h, 6)}^2/4, 3)`), n.push(`#: En tonf/m. Es exactamente lo que hacen SAP2000, ETABS y SAFE con un \xABarea spring\xBB: lo reparten a los nudos por \xE1rea tributaria. Hay ${l.length} resortes, uno por nudo.`), n.push(""), n.push("## b) La zapata como elementos de placa"), n.push("#: La losa se parte en elementos de 4 nudos. Cada nudo tiene 3 movimientos que importan en una placa horizontal: bajar (w) y girar alrededor de x y de y. Un elemento tiene entonces 12 grados de libertad, y su matriz de rigidez K_{e} (12 \xD7 12) dice qu\xE9 fuerzas hacen falta para cada movimiento. La rigidez a flexi\xF3n de la placa por metro es:"), n.push("D_p = E*t^3/(12*(1 - nu^2))"), n.push(`#: Con E = 15100\xB7\u221Af'c = ${d(m, 0)} tonf/m\xB2, t = ${o.t} m y \u03BD = 0.2:`), n.push(`D_1 = dec(${d(m, 1)}*${o.t}^3/(12*(1 - 0.2^2)), 1)`), n.push("#: En tonf\xB7m. La placa es \xABgruesa\xBB (Mindlin, con deformaci\xF3n por cortante): el elemento es el MITC4 de Bathe y Dvorkin (1985), el mismo tipo que usa SAP2000 como Shell-Thick. K_{e} sale de integrar la energ\xEDa de flexi\xF3n y de cortante sobre el elemento; en fuerzas y movimientos del elemento:"), n.push("f_e = K_e*u_e"), n.push(""), n.push("## c) El ensamble: una sola ecuaci\xF3n para toda la zapata"), n.push(`#: Cada elemento aporta su K_{e} a los nudos que comparte con sus vecinos, y cada resorte suma su k en la diagonal del w de su nudo. Todo junto es UNA ecuaci\xF3n: la rigidez de la placa m\xE1s la del suelo, por los movimientos, igual a las cargas. Aqu\xED son ${e.length} nudos \xD7 3 = ${e.length * 3} inc\xF3gnitas.`), n.push("F = (K_placa + K_suelo)*u"), n.push("#: Si el suelo fuera lineal, esto se resuelve UNA vez y se acab\xF3."), n.push(""), n.push("## d) Por qu\xE9 NO es lineal: el suelo no tira"), n.push("#: Un resorte de suelo solo empuja. Si el nudo SUBE, el resorte estar\xEDa tirando de la zapata hacia abajo: eso el suelo no lo hace. Es la ley \xABGap\xBB del manual de CSI (Analysis Reference, p. 286): fuerza = k\xB7w si el resorte se comprime; fuerza = 0 si se estira. Como no se sabe de antemano qu\xE9 nudos se levantan, se itera:"), n.push("#: 1) se resuelve con TODOS los resortes; 2) los resortes cuyo nudo subi\xF3 se APAGAN (k = 0) y los apagados cuyo nudo baj\xF3 se vuelven a encender; 3) se resuelve otra vez; se repite hasta que ning\xFAn resorte cambia. Al final se cumple la ley en cada nudo, sin tolerancias. SAP2000, SAFE y ETABS llegan a lo mismo con pasos de carga y Newton-Raphson."), n.push("#: Las vueltas REALES del solver con este modelo (la presi\xF3n m\xE1xima en tonf/m\xB2; \xABen tracci\xF3n\xBB = resortes activos cuyo nudo subi\xF3, o sea tirando):"), n.push(`#tabla("Vuelta:0","Resortes activos:0","En tracci\xF3n:0","Se apagan:0","Se encienden:0","q_max [tonf/m\xB2]:2")([${r.map((L) => L.k).join(", ")}]; [${r.map((L) => L.act).join(", ")}]; [${r.map((L) => L.trac).join(", ")}]; [${r.map((L) => L.apaga).join(", ")}]; [${r.map((L) => L.enciende).join(", ")}]; [${r.map((L) => d(L.qmax, 2)).join(", ")}])`), n.push(`#: La animaci\xF3n: la presi\xF3n del suelo a lo largo de la DIAGONAL de la zapata, desde la esquina m\xE1s cargada (x = 0) hasta la opuesta (x = ${d(D, 3)} m), en cada vuelta n. Donde la curva baja de cero el resorte est\xE1 TIRANDO: en la vuelta siguiente se apaga y ah\xED la presi\xF3n queda en cero. Pasa el rat\xF3n para pausar.`), n.push(`#anim fplot(q = ${I}, [0 ${d(D, 4)}]), n = 1:${t.length}`), n.push(`#: Resultado: ${te} de ${l.length} nudos tocan el suelo; el resto de la zapata se levant\xF3.`), n.push(""), n.push("## e) Comparaci\xF3n: Braja Das (zapata r\xEDgida) y SAP2000"), n.push("#: Das (Principles of Foundation Engineering, 9.\xAA ed., ec. 6.53, p. 236) supone la zapata R\xCDGIDA con presi\xF3n lineal: para excentricidad en una direcci\xF3n, pasado B/6 la presi\xF3n es un tri\xE1ngulo de largo 3(B/2 \u2212 e) y m\xE1ximo 4Q/(3L(B \u2212 2e)). Para dos direcciones la zapata r\xEDgida se resuelve igual, buscando el plano de asiento que equilibra Q y los dos momentos con el suelo sin tracci\xF3n."), n.push(`#tabla("C\xE1lculo","q_max [tonf/m\xB2]:3","\xC1rea en contacto [m\xB2]:3")({"FEM de este modelo (Hekatan)","Zapata r\xEDgida"${u ? ',"SAP2000 24 (mismo modelo, juez)","SAFE 20","ETABS 22"' : ""}}; [${d(se, 3)}, ${d(Y.qmax, 3)}${u ? ", 81.914, 81.915, 81.915" : ""}]; [${d(ge(a, x.activo), 3)}, ${d(Y.contacto * o.Lx * o.Ly, 3)}${u ? ", 1.888, 1.888, 1.888" : ""}])`), n.push(`#: La zapata r\xEDgida da ${d((Y.qmax / se - 1) * 100, 2)} % de diferencia en la presi\xF3n m\xE1xima: la placa real se flexa y reparte un poco distinto. ` + (u ? "Con este modelo (el ejemplo 6.10 de Das) SAP2000, SAFE y ETABS dan lo mismo que Hekatan a 4 cifras, con los mismos nudos en contacto." : "Los n\xFAmeros de SAP2000, SAFE y ETABS est\xE1n medidos para el ejemplo 6.10 de Das (el modelo por defecto): vuelve a \xE9l para verlos.")), n.push(`#: Ojo con el \xAB\xE1rea efectiva\xBB A' de Das (caso ${le.caso}, A' = ${d(le.A, 3)} m\xB2): es para CAPACIDAD DE CARGA (presi\xF3n \xFAltima uniforme con su centroide bajo la carga), no el \xE1rea que toca el suelo en servicio. Por eso no coincide con el contacto del FEM, y no tiene por qu\xE9.`), n.join(`
`) + `
`;
  }
  function be(a) {
    const o = K(a.fc) / 98.0665 * 10, e = a.Lx / a.n, t = 0.2;
    return [
      "# La rigidez de la placa de la zapata (Shell-Thick, MITC4)",
      `#: Un elemento de la malla del modelo abierto: cuadrado de lado h = ${d(e, 4)} m, espesor t = ${a.t} m, hormig\xF3n f'c ${a.fc} kgf/cm\xB2. En el solver: hekatan-fem/src/cpp/utils/shellQ4.cpp, funci\xF3n getBendingK (l\xEDnea 807): flexi\xF3n con integraci\xF3n 2\xD72 y cortante MITC4 de Dvorkin y Bathe (1984) (l\xEDnea 927). Libro: Bathe, \xABFinite Element Procedures\xBB (1996), \xA75.4.2.`,
      "## 1 \xB7 Qu\xE9 se mueve en cada nudo",
      "#: En una placa horizontal cada nudo baja (w) y gira alrededor de x y de y. Los giros de la placa gruesa NO son la pendiente de w: se interpolan aparte (teor\xEDa de Mindlin), y la diferencia entre pendiente y giro es la deformaci\xF3n por cortante.",
      "#: Funciones de forma bilineales del cuadrado de referencia (\u03BE, \u03B7 entre \u22121 y 1), las mismas para w y para los dos giros:",
      "N_1 = (1 - xi)*(1 - eta)/4",
      "N_2 = (1 + xi)*(1 - eta)/4",
      "N_3 = (1 + xi)*(1 + eta)/4",
      "N_4 = (1 - xi)*(1 + eta)/4",
      "## 2 \xB7 La energ\xEDa de flexi\xF3n: la matriz D de la placa",
      "#: Los momentos por metro salen de las curvaturas con la rigidez a flexi\xF3n D (placa is\xF3tropa):",
      "D_b = E*t^3/(12*(1 - nu^2))",
      `D_1 = dec(${d(o, 1)}*${a.t}^3/(12*(1 - ${t}^2)), 1)`,
      "#: En tonf\xB7m (E = 15100\xB7\u221Af'c en tonf/m\xB2). La matriz constitutiva de flexi\xF3n:",
      "Db = D_1*[1, 0.2, 0; 0.2, 1, 0; 0, 0, 0.4]",
      "## 3 \xB7 La energ\xEDa de cortante",
      "#: La placa gruesa adem\xE1s se deforma por cortante, con rigidez k\xB7G\xB7t (k = 5/6, getBendingK l\xEDnea 817):",
      `G_c = dec(${d(o, 1)}/(2*(1 + ${t})), 1)`,
      `Ds = dec(5/6*G_c*${a.t}, 1)`,
      "#: En tonf/m. Integrado tal cual con 2\xD72 puntos, el cortante \xABbloquea\xBB la placa delgada (shear locking). El MITC4 lo evita: eval\xFAa el cortante en los CENTROS DE LOS LADOS del elemento y lo interpola desde ah\xED (en coordenadas covariantes, l\xEDnea 934).",
      "## 4 \xB7 La K del elemento (12 \xD7 12)",
      "#: Con B_b la matriz que pasa de los 12 movimientos del elemento a las 3 curvaturas y B_s la que los pasa a los 2 cortantes (MITC4), la rigidez es la integral de la energ\xEDa sobre el elemento:",
      "K_e = transpose(B_b)*Db*B_b*A_e + transpose(B_s)*Ds*B_s*A_e",
      `#: Con 2\xD72 puntos de Gauss sobre un elemento de \xE1rea h\xB2 = ${d(e * e, 6)} m\xB2. Las proporciones que mandan: la de flexi\xF3n va con D_b/h\xB2 y la de cortante con k\xB7G\xB7t; su cociente dice si la placa es gruesa o delgada:`,
      `r_s = dec(Ds*${d(e, 6)}^2/D_1, 3)`,
      "#: Mientras m\xE1s chico este n\xFAmero, m\xE1s domina la flexi\xF3n (placa delgada). Hekatan y SAP2000 (Shell-Thick) usan la misma teor\xEDa; con la misma malla dan la misma flecha a 0.0000 % en la zapata lineal (test zapata-winkler-sap2000).",
      "## 5 \xB7 El ensamble",
      `#: Cada K_{e} se suma en las filas y columnas de sus 4 nudos. ${(a.n + 1) ** 2} nudos \xD7 3 movimientos = ${3 * (a.n + 1) ** 2} ecuaciones. A esa K se le suman los resortes del suelo (hoja \xABResorte Winkler\xBB) y se resuelve F = K\xB7u.`,
      "F = K*u"
    ].join(`
`) + `
`;
  }
  function ye(a) {
    const o = a.Lx / a.n;
    return [
      "# El resorte de Winkler: del suelo a los nudos",
      `#: Suelo del modelo abierto: ks = ${a.ks} tonf/m\xB3 (m\xF3dulo de balasto), malla de lado h = ${d(o, 4)} m. En el solver: hekatan-fem/src/cpp/utils/springsExtra.h, addAreaSpringLumped (l\xEDnea 88), y para el suelo que no tira examples/src/shared/muellesSoloCompresion.ts (pesosAreaNudos + resolverSoloCompresion).`,
      "## 1 \xB7 La hip\xF3tesis de Winkler (1867)",
      "#: La presi\xF3n en un punto depende solo del hundimiento en ESE punto: q = ks\xB7w. Es una cama de resortes independientes, sin cortante entre ellos.",
      "q_s = ks*w",
      "## 2 \xB7 De la presi\xF3n a una fuerza por nudo",
      "#: La fuerza que el suelo hace sobre un elemento se reparte a sus nudos con las funciones de forma. Si w var\xEDa poco dentro del elemento, a cada nudo le toca la integral de su funci\xF3n de forma: su \xE1rea tributaria.",
      "#: En una direcci\xF3n, con s = x/h entre 0 y 1, la funci\xF3n de forma de un nudo es 1 \u2212 s y su integral es:",
      "a_1 = Area{1 - s @ s=0:1}",
      "#: O sea medio lado: h/2. En dos direcciones, (h/2)\xB7(h/2) = h\xB2/4 por elemento. Un nudo interior toca 4 elementos: h\xB2. Uno de borde, 2: h\xB2/2. Una esquina, 1: h\xB2/4.",
      "k_int = ks*h^2",
      "k_borde = ks*h^2/2",
      "k_esq = ks*h^2/4",
      "## 3 \xB7 Con los n\xFAmeros del modelo",
      `k_1 = dec(${a.ks}*${d(o, 6)}^2, 3)`,
      `k_2 = dec(${a.ks}*${d(o, 6)}^2/2, 3)`,
      `k_3 = dec(${a.ks}*${d(o, 6)}^2/4, 3)`,
      "#: En tonf/m. La suma de todos los resortes es ks por el \xE1rea de la zapata:",
      `k_total = dec(${a.ks}*${a.Lx}*${a.Ly}, 1)`,
      "#: As\xED lo hacen SAP2000 y ETABS con un \xABarea spring\xBB y tambi\xE9n SAFE (medido nudo a nudo el 8-sep-2026). La alternativa \xABconsistente\xBB ks\xB7\u222BN\u1D40N acopla los nudos y difiere en las esquinas.",
      "## 4 \xB7 El suelo que no tira",
      "#: El resorte solo empuja: si el nudo sube, su fuerza es cero (ley Gap de CSI, Analysis Reference p. 286). Eso vuelve el problema NO lineal: hay que iterar apagando los resortes en tracci\xF3n. Lo explica la hoja \xABLevantamiento (no lineal)\xBB."
    ].join(`
`) + `
`;
  }
  function oe(a) {
    const o = K(a.fc) / 98.0665 * 10;
    return [
      "# Calculadora: corrobora t\xFA mismo",
      "#: Las variables del modelo abierto ya est\xE1n definidas (tonf, m). Escribe debajo cualquier cuenta; la calculadora \u{1F5A9} est\xE1 a la izquierda.",
      `B_x = ${a.Lx}`,
      `L_y = ${a.Ly}`,
      `t_z = ${a.t}`,
      `E_c = ${d(o, 1)}`,
      `k_s = ${a.ks}`,
      `Q = ${d(a.P, 4)}`,
      `e_x = ${d(a.exL * a.Lx, 4)}`,
      `e_y = ${d(a.eyB * a.Ly, 4)}`,
      `h = ${d(a.Lx / a.n, 6)}`,
      "q_media = Q/(B_x*L_y)",
      "k_int = k_s*h^2"
    ].join(`
`) + `
`;
  }
  const je = `
#hk-tutor{ position:fixed; z-index:2147482000; left:12vw; top:9vh; width:min(900px,80vw); height:min(640px,80vh);
  min-width:360px; min-height:44px; resize:both; overflow:hidden; display:flex; flex-direction:column;
  background:var(--hk-panel,#232936); color:var(--hk-texto,#C8D4E4); border:1px solid var(--hk-borde,#39445A);
  border-radius:8px; box-shadow:0 18px 60px rgba(0,0,0,.55); font:13px/1.4 "Segoe UI",system-ui,sans-serif; }
#hk-tutor > header, #hk-libro > header, #hk-codigo > header{ margin:0 !important; border-radius:8px 8px 0 0 !important; }
#hk-tutor[data-plegado="1"]{ height:auto !important; min-height:0; resize:none; }
#hk-tutor header{ display:flex; align-items:center; gap:8px; padding:8px 10px; cursor:move; user-select:none;
  background:var(--hk-chrome,#1B1F26); border-bottom:1px solid var(--hk-borde,#39445A); }
#hk-tutor header b{ font-size:14px; }
#hk-tutor header span{ color:var(--hk-suave,#8C9AAE); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
#hk-tutor header button{ border:0; background:transparent; color:inherit; font-size:15px; cursor:pointer; width:28px; height:28px; border-radius:4px; }
#hk-tutor header button:hover{ background:var(--hk-hover,#2E3646); }
#hk-tutor header .der{ margin-left:auto; display:flex; gap:2px; }
#hk-tutor .cuerpo{ flex:1; min-height:0; display:flex; }
#hk-tutor .migas{ display:none; flex-wrap:wrap; align-items:center; gap:6px; padding:6px 10px; border-bottom:1px solid var(--hk-borde,#39445A);
  background:var(--hk-panel2,#2E3646); }
#hk-tutor .migas .ruta a{ color:var(--hk-foco,#7F96B3); cursor:pointer; text-decoration:underline; }
#hk-tutor .migas .q{ margin-left:10px; color:var(--hk-marca,#D3A53C); font-weight:600; }
#hk-tutor .migas button{ border:1px solid var(--hk-marca,#D3A53C); background:transparent; color:var(--hk-marca,#D3A53C); border-radius:12px;
  padding:3px 10px; cursor:pointer; font:inherit; }
#hk-tutor .migas button:hover{ background:var(--hk-marca,#D3A53C); color:#111; }
#hk-tutor .indice{ width:230px; flex:none; overflow-y:auto; padding:6px; border-right:1px solid var(--hk-borde,#39445A); }
#hk-tutor .indice .ent{ display:block; width:100%; text-align:left; margin:3px 0; padding:6px 8px; border-radius:5px; cursor:pointer;
  border:1px solid transparent; background:transparent; color:inherit; font:inherit; }
#hk-tutor .indice .ent:hover{ background:var(--hk-hover,#2E3646); }
#hk-tutor .indice .ent.usa{ color:var(--hk-marca,#D3A53C); font-weight:600; }
#hk-tutor .indice .ent.on{ border-color:var(--hk-foco,#7F96B3); background:var(--hk-panel2,#2E3646); }
#hk-tutor .indice .ent.pronto{ opacity:.55; cursor:default; }
#hk-tutor .indice small{ display:block; font-weight:400; color:var(--hk-suave,#8C9AAE); }
#hk-tutor .indice .ley{ margin:6px 4px; font-size:11px; color:var(--hk-suave,#8C9AAE); }
#hk-tutor iframe{ flex:1; min-width:0; border:0; background:#fff; }
#hk-tutor-btn{ position:fixed; z-index:2147481000; top:46px; right:330px; padding:6px 12px; border-radius:16px; cursor:pointer;
  border:1px solid var(--hk-marca,#D3A53C); background:var(--hk-chrome,#1B1F26); color:var(--hk-marca,#D3A53C);
  font:600 13px "Segoe UI",system-ui,sans-serif; box-shadow:0 4px 14px rgba(0,0,0,.35); }
.hk-ops-btn{ position:fixed; z-index:2147481000; top:46px; padding:6px 10px; border-radius:16px; cursor:pointer; border:1px solid var(--hk-foco,#7F96B3);
  background:var(--hk-chrome,#1B1F26); color:var(--hk-foco,#7F96B3); font:600 12px "Segoe UI",system-ui,sans-serif; }
.hk-ops-btn:hover{ background:var(--hk-foco,#7F96B3); color:#111; }
#hk-tutor-btn:hover{ background:var(--hk-marca,#D3A53C); color:#111; }
`;
  function we() {
    if (document.getElementById("hk-tutor-css")) return;
    const a = document.createElement("style");
    a.id = "hk-tutor-css", a.textContent = je, document.head.appendChild(a);
  }
  async function J(a, o, e = "\u{1F393} Tutor FEM", t, l) {
    var _a, _b;
    we(), (_a = document.getElementById("hk-tutor")) == null ? void 0 : _a.remove();
    const n = document.createElement("div");
    n.id = "hk-tutor", n.innerHTML = `<header><b></b><span>${E("sub")} ${E("hojaEn")}</span><div class="der"><button data-a="lang" title="${E("idiomaT")}">${E("idioma")}</button><button data-a="calc" title="${E("calc")}">\u{1F9EE}</button><button data-plegar="1" title="${E("plegar")}">\u2581</button><button data-a="cerrar" title="${E("cerrar")}">\u2715</button></div></header><div class="migas"></div><div class="cuerpo"><nav class="indice"></nav><iframe title="Tutor FEM"></iframe></div>`, document.body.appendChild(n), n.querySelector("header b").textContent = e === "\u{1F393} Tutor FEM" ? E("boton") : e, n.querySelector('[data-a="lang"]').addEventListener("click", () => {
      try {
        localStorage.setItem("hk_tutor_lang", C() === "es" ? "en" : "es");
      } catch {
      }
      const c = n.getBoundingClientRect();
      J(a, o, e, t, l).then((s) => {
        s.style.left = c.left + "px", s.style.top = c.top + "px";
      });
      const b = document.getElementById("hk-tutor-btn");
      b && (b.textContent = E("boton"), b.title = E("botonT"));
    }), fe(n), n.querySelector('[data-a="cerrar"]').addEventListener("click", () => n.remove());
    const h = n.querySelector("iframe"), g = async (c, b, s = true) => {
      const v = new URLSearchParams();
      b ? v.set("ej", b) : c && v.set("h", await Ce(c)), s && v.set("solo", "1"), h.src = Me + "#" + v.toString(), window.__hekatanTutorUrl = h.src;
    };
    n.querySelector('[data-a="calc"]').addEventListener("click", () => {
      m.querySelectorAll(".ent").forEach((c) => c.classList.remove("on")), o && g(o(), null, false);
    });
    const m = n.querySelector(".indice"), k = (c) => Array.isArray(c.titulo) ? c.titulo[C() === "es" ? 0 : 1] : c.titulo;
    m.innerHTML = `<div class="ley"><b style="color:var(--hk-marca,#D3A53C)">\u25CF</b> ${E("ley")}</div>` + a.map((c, b) => `<button class="ent${c.usa ? " usa" : ""}${c.pronto ? " pronto" : ""}" data-k="${b}" ${c.pronto ? "disabled" : ""}>${c.usa ? "\u25CF " : ""}${k(c)}${c.pronto ? ` <small>${E("pronto")}</small>` : ""}</button>`).join("") + `<div class="ley">${E("lab")}</div>` + (((_b = l == null ? void 0 : l.pasos) == null ? void 0 : _b.length) ? `<div class="ley"><b>${C() === "es" ? "Pasos del informe" : "Report steps"}</b></div>` + l.pasos.map((c) => `<button class="ent paso" data-paso="${c.id}">\u2753 ${c.titulo[C() === "es" ? 0 : 1]} <small>${C() === "es" ? "Expl\xEDcame" : "Explain"}</small></button>`).join("") : "");
    const i = n.querySelector(".migas"), u = C() === "es";
    let f = [];
    const x = () => {
      if (!f.length) {
        i.innerHTML = "", i.style.display = "none";
        return;
      }
      i.style.display = "flex";
      const c = f[f.length - 1], b = W[c];
      i.innerHTML = (f.length > 1 ? `<button data-c="up">\u2B06 ${u ? "volver" : "back"}</button>` : "") + `<span class="ruta">${f.map((s, v) => `<a data-i="${v}">${W[s].titulo[u ? 0 : 1].split(":")[0]}</a>`).join(" \u2192 ")}</span>` + (b.hijos.length ? `<span class="q">${u ? "\xBFDe d\xF3nde sale?" : "Where does it come from?"}</span>` + b.hijos.map((s) => `<button data-c="${s}">${W[s].titulo[u ? 0 : 1]}</button>`).join("") : ""), i.querySelectorAll("button[data-c]").forEach((s) => s.onclick = () => {
        s.dataset.c === "up" ? f.pop() : f.push(s.dataset.c), r();
      }), i.querySelectorAll("a[data-i]").forEach((s) => s.onclick = () => {
        f = f.slice(0, +s.dataset.i + 1), r();
      });
    }, r = () => {
      const c = f[f.length - 1];
      window.__hekatanTutorCadena = [
        ...f
      ];
      const b = t ? t(c) : null;
      g(b, null), x();
    }, p = (c) => {
      const b = a[c];
      if (!(!b || b.pronto)) {
        if (m.querySelectorAll(".ent[data-k]").forEach((s, v) => s.classList.toggle("on", v === c)), b.cadena && t) {
          f = [
            b.cadena
          ], r();
          return;
        }
        f = [], x(), g(b.hoja ? b.hoja() : null, b.ej ?? null);
      }
    };
    if (m.querySelectorAll(".ent[data-k]").forEach((c) => c.onclick = () => p(+c.dataset.k)), m.querySelectorAll("[data-paso]").forEach((c) => c.onclick = () => {
      var _a2;
      return (_a2 = l == null ? void 0 : l.alExplicar) == null ? void 0 : _a2.call(l, c.dataset.paso);
    }), (l == null ? void 0 : l.inicioCadena) && t) {
      const c = a.findIndex((b) => b.cadena === l.inicioCadena);
      m.querySelectorAll(".ent").forEach((b, s) => b.classList.toggle("on", s === c)), f = [
        l.inicioCadena
      ], r();
    } else (l == null ? void 0 : l.hojaInicial) ? (x(), g(l.hojaInicial.texto, null, l.hojaInicial.solo)) : p(a.findIndex((c) => !c.pronto));
    return window.addEventListener("keydown", function c(b) {
      var _a2;
      b.key !== "Escape" || !document.getElementById("hk-tutor") || (b.stopPropagation(), (_a2 = document.getElementById("hk-tutor")) == null ? void 0 : _a2.remove(), window.removeEventListener("keydown", c, true));
    }, true), n;
  }
  function ze(a, o) {
    return [
      {
        titulo: [
          "Levantamiento: el suelo que no tira (vueltas reales del solver)",
          "Uplift: soil that cannot pull (real solver iterations)"
        ],
        usa: true,
        cadena: "NL"
      },
      {
        titulo: [
          "\xBFC\xF3mo se calcula la matriz de rigidez? (placa MITC4)",
          "How is the stiffness matrix computed? (MITC4 plate)"
        ],
        usa: true,
        cadena: "K"
      },
      {
        titulo: [
          "Resorte Winkler: del suelo a los nudos",
          "Winkler spring: from soil to nodes"
        ],
        usa: true,
        cadena: "W"
      },
      {
        titulo: [
          "Placa Shell-Thick: resumen",
          "Shell-Thick plate: summary"
        ],
        usa: true,
        hoja: () => be(a.p)
      },
      {
        titulo: [
          "Braja Das: zapata exc\xE9ntrica (ej. 6.10)",
          "Braja Das: eccentric footing (Ex. 6.10)"
        ],
        usa: true,
        hoja: () => o
      },
      {
        titulo: [
          "Barra: de d\xF3nde sale la K (EI, L)",
          "Bar: where K comes from (EI, L)"
        ],
        ej: "26 De donde sale la rigidez de barra (EI y L, deducida).lisp"
      },
      {
        titulo: [
          "P\xF3rtico plano: ensamble de la K",
          "Plane frame: assembling K"
        ],
        ej: "24 El portico - de donde sale la K (ensamblaje).lisp"
      },
      {
        titulo: [
          "P\xF3rtico 3D: K de 12\xD712",
          "3D frame: 12\xD712 K"
        ],
        pronto: true
      },
      {
        titulo: [
          "Placa Shell-Thin (DKQ)",
          "Shell-Thin plate (DKQ)"
        ],
        ej: "40 Shell Thin - placa delgada como ETABS y SAP2000.lisp"
      },
      {
        titulo: [
          "Placa DK: Kirchhoff discreto",
          "DK plate: discrete Kirchhoff"
        ],
        ej: "43 Placa DK - teoria del Discrete Kirchhoff y Shell-Thin.lisp"
      },
      {
        titulo: [
          "Placa DKMQ y DSE de Wilson",
          "DKMQ plate and Wilson DSE"
        ],
        pronto: true
      },
      {
        titulo: [
          "Membrana con giro (ITW)",
          "Membrane with drilling (ITW)"
        ],
        pronto: true
      },
      {
        titulo: [
          "S\xF3lido H8",
          "H8 solid"
        ],
        pronto: true
      }
    ];
  }
  const Pe = () => "/hekatan-struct-lineal/tutor-fem/", ke = {
    e: {
      titulo: [
        "Excentricidades",
        "Eccentricities"
      ],
      cadena: "NL",
      calc: (a) => [
        `e_x = ${d(a.exL * a.Lx, 4)}`,
        `e_y = ${d(a.eyB * a.Ly, 4)}`,
        "r_x = e_x/B_x",
        "r_y = e_y/L_y"
      ],
      libro: {
        png: "das9_p236.png",
        cita: "Das 9.\xAA ed., ec. 6.50, p. 235"
      }
    },
    caso: {
      titulo: [
        "Caso de Das (d\xF3nde cae la resultante)",
        "Das case (where the resultant falls)"
      ],
      libro: {
        png: "das9_p244.png",
        cita: "Das 9.\xAA ed., \xA76.12, casos I\u2013IV, p. 243\u2013246"
      },
      codigo: "examples/src/zapata-excentrica/zapataExcentrica.ts \xB7 areaEfectivaDas()"
    },
    q: {
      titulo: [
        "Presi\xF3n m\xE1xima (zapata r\xEDgida)",
        "Maximum pressure (rigid footing)"
      ],
      cadena: "NL",
      calc: (a) => [
        `e_x = ${d(a.exL * a.Lx, 4)}`,
        "q_1 = 4*Q/(3*L_y*(B_x - 2*e_x))"
      ],
      libro: {
        png: "das9_p236.png",
        cita: "Das 9.\xAA ed., ecs. 6.51\u20136.53, p. 236"
      },
      codigo: "examples/src/zapata-excentrica/zapataExcentrica.ts \xB7 zapataRigidaSinTraccion()"
    },
    fem: {
      titulo: [
        "Resultado FEM (Hekatan)",
        "FEM result (Hekatan)"
      ],
      cadena: "K",
      libro: {
        png: "das610_presion.png",
        cita: "Hekatan \xB7 SAP2000 \xB7 SAFE \xB7 ETABS, misma malla (ejemplo 6.10)"
      },
      codigo: "hekatan-fem/src/cpp/utils/shellQ4.cpp:807 getBendingK \xB7 deform.cpp:162"
    },
    k: {
      titulo: [
        "Resorte de Winkler k = ks\xB7A",
        "Winkler spring k = ks\xB7A"
      ],
      cadena: "W",
      calc: () => [
        "k_int = k_s*h^2",
        "k_borde = k_s*h^2/2",
        "k_esq = k_s*h^2/4"
      ],
      codigo: "hekatan-fem/src/cpp/utils/springsExtra.h:88 addAreaSpringLumped"
    },
    nl: {
      titulo: [
        "Levantamiento (suelo sin tracci\xF3n)",
        "Uplift (tensionless soil)"
      ],
      cadena: "NL",
      codigo: "examples/src/shared/muellesSoloCompresion.ts \xB7 resolverSoloCompresion()"
    }
  };
  function Te(a, o) {
    const e = a.p, t = e.exL * e.Lx, l = e.eyB * e.Ly, n = K(e.fc) / 98.0665 * 10, h = ne(e, 200), g = V(e.Lx, e.Ly, t, l), m = a.vueltas[a.vueltas.length - 1];
    let k = 0, i = 0;
    m.activo.forEach((v, j) => {
      v && i++, k = Math.min(k, m.uz[a.nodosComp[j]]);
    });
    const u = -k * e.ks, f = ge(a, m.activo), x = Math.abs(e.Lx - y.Lx) + Math.abs(e.exL - y.exL) + Math.abs(e.eyB - y.eyB) + Math.abs(e.P - y.P) + Math.abs(e.t - y.t) + Math.abs(e.ks - y.ks) + Math.abs(e.n - y.n) < 1e-6, r = t === 0 || l === 0, p = Math.abs(t) >= Math.abs(l) ? Math.abs(t) : Math.abs(l), c = Math.abs(t) >= Math.abs(l) ? e.Lx : e.Ly, b = Math.abs(t) >= Math.abs(l) ? e.Ly : e.Lx, s = [];
    return s.push("# Informe: zapata con levantamiento (suelo sin tracci\xF3n)"), s.push("#: Memoria de c\xE1lculo generada por Hekatan Struct con el modelo abierto. Para imprimir o guardar en PDF: Archivo \u203A PDF."), s.push("## 1 \xB7 Datos"), s.push("#| Dato | Valor |"), s.push("#|---|---:|"), s.push(`#| Zapata B \xD7 L \xD7 t | ${e.Lx} \xD7 ${e.Ly} \xD7 ${e.t} m |`), s.push(`#| Hormig\xF3n | f'c ${e.fc} kgf/cm\xB2 (E = ${d(n, 0)} tonf/m\xB2) |`), s.push(`#| Carga Q | ${d(e.P, 3)} tonf (${d(e.P * Z, 1)} kN) |`), s.push(`#| Excentricidades | e_{x} = ${d(t, 3)} m \xB7 e_{y} = ${d(l, 3)} m |`), s.push(`#| Suelo | ks = ${e.ks} tonf/m\xB3${o ? ` \xB7 q_{adm} = ${o} tonf/m\xB2` : ""} |`), s.push("## 2 \xB7 Geotecnia (Braja M. Das, Principles of Foundation Engineering, 9.\xAA ed.)"), s.push("#: Excentricidad relativa (ec. 6.50, p. 235) y n\xFAcleo central: la base entera comprime si e/B + e/L \u2264 1/6."), s.push(`r_x = dec(${d(t, 6)}/${e.Lx}, 4)`), s.push(`r_y = dec(${d(l, 6)}/${e.Ly}, 4)`), s.push(`#: ${Math.abs(e.exL) + Math.abs(e.eyB) <= 1 / 6 + 1e-9 ? "La resultante cae DENTRO del n\xFAcleo: toda la base comprime." : "La resultante cae FUERA del n\xFAcleo: parte de la base se levanta (el suelo no tira)."} Caso de Das (\xA76.12, p. 243\u2013246): **${g.caso}**; \xE1rea efectiva de capacidad A' = ${d(g.A, 3)} m\xB2 (no es el \xE1rea de contacto).`), r && p > c / 6 ? (s.push("#: Presi\xF3n m\xE1xima con zapata r\xEDgida, una direcci\xF3n, e > B/6 (ec. 6.53, p. 236):"), s.push("q_max = 4*Q/(3*L*(B - 2*e))"), s.push(`q_1 = dec(4*${d(e.P, 4)}/(3*${b}*(${c} - 2*${d(p, 4)})), 3)`)) : r ? (s.push("#: Presi\xF3n m\xE1xima y m\xEDnima con zapata r\xEDgida, una direcci\xF3n, e \u2264 B/6 (ecs. 6.51\u20136.52, p. 236):"), s.push("q_max = Q/(B*L)*(1 + 6*e/B)"), s.push(`q_1 = dec(${d(e.P, 4)}/(${c}*${b})*(1 + 6*${d(p, 4)}/${c}), 3)`), s.push(`q_2 = dec(${d(e.P, 4)}/(${c}*${b})*(1 - 6*${d(p, 4)}/${c}), 3)`)) : s.push(`#: Dos direcciones: sin f\xF3rmula cerrada para la presi\xF3n; la zapata R\xCDGIDA sin tracci\xF3n (plano de asiento que equilibra Q y los dos momentos) da q_{max} = ${d(h.qmax, 3)} tonf/m\xB2 y ${d(h.contacto * e.Lx * e.Ly, 3)} m\xB2 en contacto.`), o && s.push(`#: Verificaci\xF3n de presi\xF3n con la m\xE1xima del FEM (abajo): q_{max}/q_{adm} = ${d(u / o, 3)} \u2192 ${u <= o ? "CUMPLE" : "NO CUMPLE"}.`), x ? s.push("#: Capacidad de carga del ejemplo 6.10 del libro (p. 247\u2013248, caso II): Q_{u} \u2248 606 kN. La carga aplicada es Q = Q_{u} (FS = 1): para dise\xF1o, Q \u2264 Q_{u}/FS.") : s.push("#: Capacidad de carga (ec. 6.55 de Das) para datos propios: \u23F3 pendiente (hace falta \u03C6', c', \u03B3 y D_{f} del estudio de suelos)."), s.push("## 3 \xB7 Resultado FEM (Hekatan Struct)"), s.push(`#: Placa Shell-Thick (MITC4) sobre resortes que solo trabajan a compresi\xF3n, malla ${e.n} \xD7 ${e.n}; ${a.vueltas.length} vueltas hasta que el contacto no cambia.`), s.push("#| Resultado | FEM | Zapata r\xEDgida |"), s.push("#|---|---:|---:|"), s.push(`#| q_max (tonf/m\xB2) | ${d(u, 3)} | ${d(h.qmax, 3)} |`), s.push(`#| Asiento m\xE1ximo (mm) | ${d(-k * 1e3, 3)} | ${d(h.wmax * 1e3, 3)} |`), s.push(`#| \xC1rea en contacto (m\xB2) | ${d(f, 3)} | ${d(h.contacto * e.Lx * e.Ly, 3)} |`), s.push(`#| Nudos en contacto | ${i} de ${a.nodosComp.length} | \u2014 |`), s.push(`#: Diferencia con la zapata r\xEDgida: ${d((h.qmax / u - 1) * 100, 2)} % (la placa real se flexa).`), s.push("## 4 \xB7 Validaci\xF3n"), x ? (s.push("#| Programa | q_max (tonf/m\xB2) | vs SAP2000 |"), s.push("#|---|---:|---:|"), s.push("#| SAP2000 24 (juez) | 81.914 | \u2014 |"), s.push(`#| Hekatan | ${d(u, 3)} | ${d((u / 81.9144 - 1) * 100, 4)} % |`), s.push("#| SAFE 20 | 81.915 | +0.0002 % |"), s.push("#| ETABS 22 | 81.915 | +0.0010 % |"), s.push("#| OpenSeesPy | 81.915 | +0.0006 % |")) : s.push("#: La validaci\xF3n nudo a nudo contra SAP2000, SAFE, ETABS y OpenSees est\xE1 hecha para el ejemplo 6.10 de Das (test zapata-levantamiento-das). Para estos datos: exporta a SAP2000/SAFE/ETABS/OpenSees desde la app."), s.push("## 5 \xB7 Conclusi\xF3n"), s.push(`#: ${o ? u <= o ? "CUMPLE la presi\xF3n admisible" : "NO CUMPLE la presi\xF3n admisible" : "Presi\xF3n m\xE1xima calculada"} (q_{max} = ${d(u, 2)} tonf/m\xB2${o ? ` frente a q_{adm} = ${o}` : ""}); ${i < a.nodosComp.length ? `se levanta ${d((1 - i / a.nodosComp.length) * 100, 1)} % de la base` : "toda la base en contacto"}. Dise\xF1o estructural de la zapata (punzonamiento, cortante, flexi\xF3n): \u23F3 pendiente.`), s.push("#: Hekatan Struct"), s.join(`
`) + `
`;
  }
  function ce(a, o, e) {
    var _a;
    (_a = document.getElementById(a)) == null ? void 0 : _a.remove();
    const t = document.createElement("div");
    t.id = a, t.style.cssText = "position:fixed;z-index:2147482500;left:22vw;top:14vh;max-width:70vw;max-height:76vh;overflow:auto;background:var(--hk-panel,#232936);color:var(--hk-texto,#C8D4E4);border:1px solid var(--hk-borde,#39445A);border-radius:8px;box-shadow:0 18px 60px rgba(0,0,0,.55);font:13px 'Segoe UI',system-ui,sans-serif", t.innerHTML = `<header style="display:flex;gap:8px;align-items:center;padding:8px 10px;background:var(--hk-chrome,#1B1F26)"><b>${o}</b><span style="margin-left:auto"></span><button data-plegar="1" style="border:0;background:transparent;color:inherit;cursor:pointer">\u2581</button><button data-x style="border:0;background:transparent;color:inherit;cursor:pointer">\u2715</button></header><div style="padding:10px">${e}</div>`, document.body.appendChild(t), fe(t), t.querySelector("[data-x]").addEventListener("click", () => t.remove());
  }
  function Le(a, o) {
    var _a;
    const e = ke[a];
    (_a = document.getElementById("hk-explicame")) == null ? void 0 : _a.remove();
    const t = C() === "es", l = document.createElement("div");
    if (l.id = "hk-explicame", l.style.cssText = "position:fixed;z-index:2147483000;left:50%;top:22vh;transform:translateX(-50%);width:340px;background:var(--hk-panel,#232936);color:var(--hk-texto,#C8D4E4);border:1px solid var(--hk-marca,#D3A53C);border-radius:8px;padding:8px;box-shadow:0 18px 60px rgba(0,0,0,.55);font:13px 'Segoe UI',system-ui,sans-serif", !e) {
      l.innerHTML = `<b>\u2753 ${a}</b><p>${t ? "\u23F3 Este paso todav\xEDa no tiene explicaci\xF3n m\xE1s a fondo." : "\u23F3 No deeper explanation for this step yet."}</p>`, document.body.appendChild(l), setTimeout(() => l.remove(), 3500);
      return;
    }
    const n = (h, g, m) => `<button data-k="${h}" ${m ? "" : "disabled"} style="display:block;width:100%;text-align:left;margin:4px 0;padding:7px 9px;border-radius:6px;border:1px solid var(--hk-borde,#39445A);background:var(--hk-panel2,#2E3646);color:inherit;cursor:${m ? "pointer" : "default"};opacity:${m ? 1 : 0.5};font:inherit">${g}${m ? "" : " \u23F3"}</button>`;
    l.innerHTML = `<div style="display:flex"><b>\u2753 ${e.titulo[t ? 0 : 1]}</b><button data-k="x" style="margin-left:auto;border:0;background:transparent;color:inherit;cursor:pointer">\u2715</button></div>` + n("tecnico", t ? "\xBFQu\xE9 no entiendes? (m\xE1s a fondo)" : "What is unclear? (in depth)", !!e.cadena) + n("calc", t ? "\xBFQuieres corroborarlo? (calculadora)" : "Want to check it? (calculator)", !!e.calc) + n("libro", t ? "Ver en el libro" : "See it in the book", !!e.libro) + n("codigo", t ? "Ver en el c\xF3digo" : "See it in the code", !!e.codigo) + n("ia", t ? "Preg\xFAntale al asistente (sin IA en este equipo)" : "Ask the assistant (no AI on this machine)", false), document.body.appendChild(l), l.querySelectorAll("button[data-k]").forEach((h) => h.onclick = () => {
      const g = h.dataset.k;
      l.remove(), g === "tecnico" ? O(o, {
        inicioCadena: e.cadena
      }) : g === "calc" ? O(o, {
        hojaInicial: {
          texto: oe(o.leer().p) + e.calc(o.leer().p).join(`
`) + `
`,
          solo: false
        }
      }) : g === "libro" ? ce("hk-libro", "\u{1F4D6} " + e.libro.cita, `<img src="${Pe() + e.libro.png}" style="max-width:100%;background:#fff">`) : g === "codigo" && ce("hk-codigo", "\u2328 " + (t ? "En el motor" : "In the engine"), `<code style="font:13px Consolas,monospace">${e.codigo}</code>`);
    });
  }
  let M = null;
  function Fe(a) {
    var _a;
    if (!a) return C() === "es" ? "Abre la zapata (ejemplo o plantilla) primero." : "Open the footing (example or template) first.";
    const o = (_a = window.__hekatanExample) == null ? void 0 : _a.call(window);
    return o && !a.ids.includes(o) ? C() === "es" ? "El modelo abierto no es una zapata con levantamiento." : "The open model is not a footing with uplift." : a.leer() ? null : E("sinSol");
  }
  async function O(a, o) {
    const e = a.leer();
    if (e) return J(ze(e, a.hojaDas), () => oe(e.p), "\u{1F393} Tutor FEM", (t) => {
      var _a, _b;
      return t === "W" ? ye(e.p) : t === "NL" ? xe(e) : ((_b = (_a = W[t]) == null ? void 0 : _a.hoja) == null ? void 0 : _b.call(_a, e.p)) ?? "# \u23F3";
    }, o);
  }
  async function de(a) {
    const o = a.leer();
    if (!o) return;
    const e = Object.entries(ke).map(([t, l]) => ({
      id: t,
      titulo: l.titulo
    }));
    return J([
      {
        titulo: [
          "\u{1F4C4} Informe de la zapata",
          "\u{1F4C4} Footing report"
        ],
        hoja: () => {
          var _a;
          return Te(o, (_a = a.q_adm) == null ? void 0 : _a.call(a));
        }
      }
    ], () => oe(o.p), "\u{1F4C4} Informe", void 0, {
      pasos: e,
      alExplicar: (t) => Le(t, a)
    });
  }
  function ee(a, o) {
    var _a;
    const e = (_a = a.exportar) == null ? void 0 : _a.call(a, o);
    if (!e) {
      alert(E("sinSol"));
      return;
    }
    const t = document.createElement("a");
    t.href = URL.createObjectURL(new Blob([
      e
    ], {
      type: "text/plain"
    })), t.download = `zapata_hekatan.${o}`, t.click(), setTimeout(() => URL.revokeObjectURL(t.href), 2e3), window.__hekatanUltimoOpenSees = e;
  }
  function ve(a, o, e, t, l) {
    if (M = {
      leer: a,
      hojaDas: o,
      ids: e,
      exportar: t,
      q_adm: l
    }, window.__hekatanZapataHerramientas = {
      tutor: () => O(M),
      informe: () => de(M),
      explicame: (g) => Le(g, M),
      opensees: (g) => ee(M, g)
    }, window.__hekatanZapataRegistrada) return;
    window.__hekatanZapataRegistrada = true;
    const n = (g) => () => {
      const m = Fe(M);
      if (m) {
        alert(m);
        return;
      }
      g();
    }, h = C() === "es";
    H({
      id: "zapata-informe",
      orden: 10,
      icono: "\u{1F4C4}",
      titulo: h ? "Informe de la zapata (geotecnia + FEM)" : "Footing report (geotechnics + FEM)",
      detalle: h ? "Memoria de c\xE1lculo de ESTA zapata: Das, presi\xF3n, contacto, validaci\xF3n. Cada paso con \u2753 Expl\xEDcame; se imprime a PDF." : "Calculation report of THIS footing: Das, pressure, contact, validation. Each step with \u2753 Explain; prints to PDF.",
      abrir: n(() => de(M))
    }), H({
      id: "zapata-tutor",
      orden: 11,
      icono: "\u{1F393}",
      titulo: E("boton"),
      detalle: h ? "C\xF3mo funciona el FEM de esta zapata, paso a paso, con \xAB\xBFDe d\xF3nde sale?\xBB hasta Gauss y las funciones de forma." : "How the FEM of this footing works, step by step, with \xABWhere does it come from?\xBB down to Gauss and shape functions.",
      abrir: n(() => O(M))
    }), H({
      id: "zapata-levantamiento",
      orden: 12,
      icono: "\u2B06",
      titulo: h ? "Levantamiento: q_max, contacto y caso de Das" : "Uplift: q_max, contact and Das case",
      detalle: h ? "Las vueltas reales del solver: qu\xE9 resortes se apagan y c\xF3mo queda el contacto; comparado con la zapata r\xEDgida de Das." : "The real solver iterations: which springs switch off and the final contact; compared with Das' rigid footing.",
      abrir: n(() => O(M, {
        inicioCadena: "NL"
      }))
    }), H({
      id: "zapata-opensees-py",
      orden: 13,
      icono: "\u2B07",
      titulo: "OpenSeesPy (.py)",
      detalle: E("opsT"),
      abrir: n(() => ee(M, "py"))
    }), H({
      id: "zapata-opensees-tcl",
      orden: 14,
      icono: "\u2B07",
      titulo: "OpenSees Tcl (.tcl)",
      detalle: E("opsT"),
      abrir: n(() => ee(M, "tcl"))
    });
  }
  typeof window < "u" && (window.__hekatanTutorFem = {
    abrirTutorFem: J,
    hojaTutorZapata: xe,
    hojaPlacaZapata: be,
    hojaWinkler: ye
  });
  const ue = (a) => Math.abs(a) < 1e-300 ? "0" : String(+a.toPrecision(12));
  function $e(a, o) {
    const e = o === "py", t = [], l = (i) => t.push("# " + i), n = (i, ...u) => t.push(e ? `ops.${i}(${u.map((f) => typeof f == "string" ? `'${f}'` : ue(f)).join(", ")})` : `${i} ${u.map((f) => typeof f == "string" ? f : ue(f)).join(" ")}`);
    l(`${a.titulo ?? "Modelo de Hekatan Struct"} \u2014 exportado a OpenSees ${e ? "Py" : "Tcl"}. Unidades kN, m.`), l("Losa: ShellMITC4 + ElasticMembranePlateSection. Suelo: zeroLength vertical por nudo; ENT = no resiste tracci\xF3n."), e ? t.push("import openseespy.opensees as ops", "import json, sys", "ops.wipe()") : t.push("wipe"), n("model", "basic", "-ndm", 3, "-ndf", 6);
    const h = a.nodes.length, g = 1e6;
    a.nodes.forEach((i, u) => n("node", u + 1, i[0], i[1], i[2])), a.supports.forEach((i, u) => {
      i.some(Boolean) && n("fix", u + 1, ...i.map((f) => f ? 1 : 0));
    });
    const m = /* @__PURE__ */ new Map();
    a.shells.forEach((i) => {
      const u = `${i.E}|${i.nu}|${i.t}`;
      m.has(u) || (m.set(u, m.size + 1), n("section", "ElasticMembranePlateSection", m.size, i.E, i.nu, i.t, 0));
    }), a.shells.forEach((i, u) => n("element", "ShellMITC4", u + 1, ...i.n.map((f) => f + 1), m.get(`${i.E}|${i.nu}|${i.t}`)));
    let k = 0;
    return a.springs.forEach((i, u) => {
      const f = a.nodes[i.node];
      n("node", g + u, f[0], f[1], f[2]), n("fix", g + u, 1, 1, 1, 1, 1, 1), k++, n("uniaxialMaterial", i.comp ? "ENT" : "Elastic", k, i.k), n("element", "zeroLength", h + 1e3 + u, g + u, i.node + 1, "-mat", k, "-dir", 3);
    }), n("timeSeries", "Linear", 1), n("pattern", "Plain", 1, 1), e || (t[t.length - 1] += " {"), a.loads.forEach((i, u) => {
      i.some((f) => Math.abs(f) > 1e-12) && n("load", u + 1, ...i.slice(0, 6));
    }), e || t.push("}"), n("system", "UmfPack"), n("numberer", "RCM"), n("constraints", "Plain"), n("test", "NormDispIncr", 1e-12, 100), n("algorithm", "Newton"), n("integrator", "LoadControl", 0.1), n("analysis", "Static"), e ? (t.push("ok = ops.analyze(10)"), t.push(`w = {i: ops.nodeDisp(i, 3) for i in range(1, ${h + 1})}`), t.push('out = {"ok": ok, "U3": w}'), t.push("if len(sys.argv) > 1: json.dump(out, open(sys.argv[1], 'w'))"), t.push("print('analyze ->', ok, '  w min =', min(w.values()))")) : (t.push("set ok [analyze 10]"), t.push('set f [open "opensees_U3.txt" w]'), t.push(`for {set i 1} {$i <= ${h}} {incr i} { puts $f "$i [nodeDisp $i 3]" }`), t.push("close $f"), t.push('puts "analyze -> $ok"')), t.join(`
`) + `
`;
  }
  function Ee(a, o) {
    var _a, _b, _c, _d, _e2;
    const e = (_a = a == null ? void 0 : a.nodes) == null ? void 0 : _a.val, t = (_b = a == null ? void 0 : a.elements) == null ? void 0 : _b.val, l = (_c = a == null ? void 0 : a.nodeInputs) == null ? void 0 : _c.val, n = (_d = a == null ? void 0 : a.elementInputs) == null ? void 0 : _d.val;
    if (!(e == null ? void 0 : e.length) || !(t == null ? void 0 : t.length) || !l || !n) return null;
    const h = [];
    t.forEach((m, k) => {
      var _a2, _b2, _c2;
      m.length === 4 && h.push({
        n: m,
        t: ((_a2 = n.thicknesses) == null ? void 0 : _a2.get(k)) ?? 0.2,
        E: ((_b2 = n.elasticities) == null ? void 0 : _b2.get(k)) ?? 25e6,
        nu: ((_c2 = n.poissonsRatios) == null ? void 0 : _c2.get(k)) ?? 0.2
      });
    });
    const g = [
      ...((_e2 = globalThis.window) == null ? void 0 : _e2.__hekatanCliMuellesNodales) ?? []
    ];
    for (const m of l.springs ?? []) m.node >= 0 && m.dof === 2 && !g.some((k) => k.node === m.node) && g.push({
      node: m.node,
      k: m.k,
      comp: false
    });
    return {
      nodes: e,
      shells: h,
      supports: l.supports ?? /* @__PURE__ */ new Map(),
      loads: l.loads ?? /* @__PURE__ */ new Map(),
      springs: g,
      titulo: o
    };
  }
  const _e = `# Cimentaciones con no linealidad: levantamiento de zapatas (suelo sin tracci\xF3n)

#: Pregunta que lleg\xF3 de un usuario: \xABhay situaciones en que las zapatas incurren en rango no lineal, como cuando las columnas son demasiado exc\xE9ntricas\xBB. S\xED: el suelo EMPUJA pero no TIRA. Cuando la carga cae lejos del centro, una parte de la zapata se despega del suelo y el problema deja de ser lineal. Esta hoja lo explica con el libro de Braja M. Das, *Principles of Foundation Engineering*, 9.\xAA ed. (2019), \xA76.10\u20136.12, p. 235\u2013249 (en espa\xF1ol: *Fundamentos de ingenier\xEDa de cimentaciones*, 7.\xAA ed., \xA73.9\u20133.11, p. 157\u2013171), y lo compara con el c\xE1lculo por elementos finitos de Hekatan Struct, SAP2000, SAFE y ETABS.

## 1 \xB7 Qu\xE9 es la excentricidad (Das, ec. 6.50, p. 235)

#: Una columna que baja con una carga vertical Q y un momento M hace lo mismo que la carga Q sola corrida una distancia e del centro de la zapata. Esa distancia es la excentricidad:
e_x = M/Q
#: Mientras m\xE1s momento, m\xE1s lejos cae la carga, y m\xE1s carga toma el borde de ese lado.

## 2 \xB7 La presi\xF3n si el suelo pudiera tirar (Das, ecs. 6.51 y 6.52, p. 236)

#: Si la zapata es r\xEDgida y el suelo responde lineal, la presi\xF3n es un plano: m\xE1xima en el borde cargado y m\xEDnima en el opuesto (B es el lado en la direcci\xF3n de e):
q_max = Q/(B*L)*(1 + 6*e/B)
q_min = Q/(B*L)*(1 - 6*e/B)
#: \xBFCon qu\xE9 excentricidad la presi\xF3n m\xEDnima llega a cero? Es cero cuando el par\xE9ntesis es cero; multiplicado por B queda (con e_{c} la excentricidad cr\xEDtica):
Despejar{B - 6*e_c = 0 @ e_c}
#: Ese es el l\xEDmite del N\xDACLEO CENTRAL: con e hasta B/6 toda la base empuja (rect\xE1ngulo o trapecio de presi\xF3n). Pasado B/6 la f\xF3rmula da presi\xF3n NEGATIVA, o sea el suelo tendr\xEDa que TIRAR de la zapata. No lo hace: el borde se levanta, el \xE1rea de contacto baja y el problema ya no es lineal (Das, p. 236).

## 3 \xB7 Pasado B/6: el tri\xE1ngulo (Das, ec. 6.53, p. 236, Tomlinson 1978)

#: Con el borde levantado la presi\xF3n es un TRI\xC1NGULO. Dos condiciones lo fijan. Primera, la resultante del suelo tiene que caer bajo la carga: la resultante de un tri\xE1ngulo est\xE1 a un tercio de su largo, medido desde el borde cargado, y la carga est\xE1 a B/2 \u2212 e de ese borde, as\xED que el largo de contacto es tres veces esa distancia:
a_c = 3*(B/2 - e)
#: Segunda, equilibrio vertical: el volumen del tri\xE1ngulo de presi\xF3n (medio q_{t} por el largo por el ancho L) tiene que valer Q. Se despeja la presi\xF3n m\xE1xima:
Despejar{Q = q_t*3*(B/2 - e)*L/2 @ q_t}
#: Es la ecuaci\xF3n 6.53 del libro escrita de otra forma: multiplicando arriba y abajo por 2,
q_t = 4*Q/(3*L*(B - 2*e))
#: Al crecer e, el contacto se encoge y q_{t} se dispara; con e = B/2 el contacto es cero: la zapata vuelca.

## 4 \xB7 El ejemplo 6.10 de Das (p. 247\u2013248), tal cual el libro

#: Zapata cuadrada de 1.5 \xD7 1.5 m desplantada a 0.7 m en arena (\u03B3 = 18 kN/m\xB3, \u03C6' = 30\xB0, c' = 0), con excentricidad en DOS direcciones: e_L = 0.3 m y e_B = 0.15 m.
Bd = 1.5
Ld = 1.5
eLd = 0.3
eBd = 0.15
rL = eLd/Ld
rB = eBd/Bd
#: e_L/L = {rL} es MAYOR que 1/6: la resultante sale del n\xFAcleo y un borde se levanta. e_B/B = {rB} es menor que 1/6. Con 1/6 < e_L/L < 0.5 y e_B/B < 1/6 la carga cae en el CASO II de Highter y Anders (1985) (Das, p. 244).
#: En el caso II el \xE1rea efectiva es un trapecio (ec. 6.75). El libro lee L\u2081 y L\u2082 del \xE1baco de la figura 6.27b: L\u2081/L \u2248 0.85 y L\u2082/L \u2248 0.21.
L1d = 0.85*Ld
L2d = 0.21*Ld
Aef = dec(0.5*(L1d + L2d)*Bd, 3)
Lef = L1d
Bef = dec(Aef/Lef, 3)
#: Con el \xE1rea efectiva, la capacidad \xFAltima (ec. 6.55 con c' = 0). Los factores los da el propio ejemplo: q = 0.7\xB718, N_q = 18.4 y N_\u03B3 = 22.4 (tabla 6.2), y los de forma y profundidad de la tabla 6.3:
qs = 0.7*18
Nq = 18.4
Ngam = 22.4
Fqs = dec(1 + (Bef/Lef)*tan(30*pi/180), 3)
Fgs = dec(1 - 0.4*(Bef/Lef), 3)
Fqd = dec(1 + 2*tan(30*pi/180)*(1 - sin(30*pi/180))^2*0.7/Bd, 3)
Qu = dec(Aef*(qs*Nq*Fqs*Fqd + 0.5*18*Bef*Ngam*Fgs), 0)
#: Sin redondear nada sale 605 kN. El libro redondea A' a 1.193 m\xB2 y B' a 0.936 m antes de seguir; con SUS redondeos:
Qu_libro = dec(1.193*(qs*Nq*1.424*1.135 + 0.5*18*0.936*Ngam*0.706), 0)
#: Q_{u} \u2248 606 kN, el n\xFAmero del libro. La diferencia de 1 kN es solo de redondeo.

### El \xE1baco sin leerlo a ojo

#: El trapecio del caso II est\xE1 elegido para que su centroide caiga JUSTO bajo la carga (eso dibuja la figura 6.27a). Con esa condici\xF3n el \xE1baco tiene f\xF3rmula cerrada (deducci\xF3n de esta hoja, no del libro): con m la semisuma de L\u2081 y L\u2082,
m_c = (Ld/2 - eLd)/(1/2 + 6*rB^2)
L1c = dec(m_c + 6*m_c*rB, 4)
L2c = dec(m_c - 6*m_c*rB, 4)
Ac = dec(0.5*(L1c + L2c)*Bd, 4)
#: Da L\u2081/L = 0.857 y L\u2082/L = 0.214 (el libro lee 0.85 y 0.21) y un \xE1rea efectiva un 1 % mayor que la del \xE1baco.

## 5 \xB7 Lo que Das supone y lo que hace el FEM

#: El \xE1rea efectiva A' de Das es de CAPACIDAD DE CARGA: una presi\xF3n \xFAltima UNIFORME sobre la parte de la zapata cuyo centroide cae bajo la carga. No es el \xE1rea que de verdad toca el suelo en servicio. Para la presi\xF3n de contacto, Das (ec. 6.53) y la secci\xF3n 3 suponen una zapata R\xCDGIDA con reparto LINEAL.
#: El FEM no supone eso: la zapata es una placa (flexible) sobre resortes que solo trabajan a compresi\xF3n (el \xABGap\xBB de CSI: fuerza = k\xB7d si el resorte se comprime, cero si se estira). Se resuelve, se apagan los resortes que quedaron en tracci\xF3n y se vuelve a resolver hasta que el contacto no cambia. Mismo ejemplo 6.10, con Q = 606 kN; lo que Das no da se eligi\xF3: espesor 0.40 m, columna 0.30 m, f'c 240 kgf/cm\xB2, ks = 2000 tonf/m\xB3. Malla 30 \xD7 30, la misma nudo a nudo en los cuatro programas.
#tabla("Programa","q_max [tonf/m\xB2]:3","Contacto [m\xB2]:3","Nudos en contacto:0","vs SAP2000 [%]:4")({"SAP2000 24 (juez)","Hekatan Struct","SAFE 20","ETABS 22","Zapata R\xCDGIDA","Lineal (el suelo tira)"}; [81.914, 81.915, 81.915, 81.915, 82.211, 76.670]; [1.888, 1.888, 1.888, 1.888, 1.884, 2.250]; [798, 798, 798, 798, 0, 961]; [0, 0.0002, 0.0002, 0.0010, 0.36, -6.4])
#: Los cuatro programas dan lo mismo a 4 cifras y despegan el MISMO borde (798 de 961 nudos tocan). La zapata r\xEDgida da 0.36 % m\xE1s de presi\xF3n m\xE1xima: la placa real se flexa un poco y reparte mejor. Si se deja que el suelo tire (an\xE1lisis lineal) la presi\xF3n m\xE1xima sale un 6 % MENOR y hay tracci\xF3n bajo el borde levantado: el lineal queda del lado inseguro.

## 6 \xB7 La animaci\xF3n: la presi\xF3n al crecer e (una direcci\xF3n)

#: La zapata del ejemplo con Q = 61.8 tonf (606 kN) y la carga movi\xE9ndose en una sola direcci\xF3n, de e = 0 a e = B/3 en pasos de B/60. Hasta e = B/6 la presi\xF3n es un trapecio que se inclina; en e = B/6 es un tri\xE1ngulo justo; pasado ese punto el borde se despega (presi\xF3n cero) y el tri\xE1ngulo se acorta y sube. x se mide desde el borde cargado. Pasa el rat\xF3n por encima para pausar.
#anim fplot(q = ((1+sign(10-n))/2)*(27.4644*(1+0.1*n) - 27.4644*0.133333*n*x) + ((1-sign(10-n))/2)*(54.9289/(1.5-0.05*n))*((1 - x/(2.25-0.075*n)) + abs(1 - x/(2.25-0.075*n)))/2, [0 1.5]), n = 0:20
#: La presi\xF3n m\xE1xima (en el borde, x = 0) y el largo de contacto en funci\xF3n de e, para la misma zapata:
#fplot(q_max = 27.4644*(1 + 4*x)*(1+sign(0.25-x))/2 + (54.9289/(1.5-2*x))*(1-sign(0.25-x))/2, [0 0.5])
#fplot(contacto = 1.5*(1+sign(0.25-x))/2 + 3*(0.75-x)*(1-sign(0.25-x))/2, [0 0.5])

### El FEM sobre el mismo barrido

#: Barrido con otra zapata (2 \xD7 2 \xD7 0.5 m, P = 60 tonf, malla 60 \xD7 60) en Hekatan y SAP2000, frente a la f\xF3rmula de la zapata r\xEDgida:
#tabla("e/L","F\xF3rmula q_max [tonf/m\xB2]:3","Hekatan [tonf/m\xB2]:3","SAP2000 [tonf/m\xB2]:3","Contacto f\xF3rmula [m]:3","Contacto Hekatan [m]:3")({"0","1/12","1/6","1/4","1/3"}; [15.000, 22.500, 30.000, 40.000, 60.000]; [15.180, 22.464, 30.000, 40.055, 60.072]; [15.180, 22.464, 30.000, 40.052, 60.038]; [2.000, 2.000, 2.000, 1.500, 1.000]; [2.000, 2.000, 2.000, 1.502, 1.002])
#: Lo mismo en una gr\xE1fica: la curva es la f\xF3rmula de la zapata r\xEDgida (Das, ecs. 6.51 y 6.53) en funci\xF3n de e/L; los puntos son el FEM (SAP2000 y Hekatan) con la zapata flexible:
#fplot(q_max = 15*(1 + 6*x)*(1+sign(1/6-x))/2 + (20/(1-2*x))*(1-sign(1/6-x))/2, SAP2000 = [0 15.180; 1/12 22.464; 1/6 30.000; 1/4 40.052; 1/3 60.038], Hekatan = [0 15.180; 1/12 22.464; 1/6 30.000; 1/4 40.055; 1/3 60.072], [0 0.4])
#: Hasta e/L = 1/6 el problema es lineal y todo coincide; m\xE1s all\xE1, el FEM sigue a la f\xF3rmula del tri\xE1ngulo con el borde levantado. Hekatan y SAP2000 quedan a menos de 0.06 % (lo que queda es la tolerancia de convergencia de SAP2000, 1e-4).
`, Z = 9.80665, Se = 98.0665, Ae = {
    Lx: 2,
    Ly: 2,
    t: 0.5,
    fc: 240,
    ks: 2e3,
    c: 0.4,
    P: 60,
    exL: 0.25,
    eyB: 0,
    n: 60
  }, y = {
    Lx: 1.5,
    Ly: 1.5,
    t: 0.4,
    fc: 240,
    ks: 2e3,
    c: 0.3,
    P: 606 / 9.80665,
    exL: 0.1,
    eyB: 0.2,
    n: 30
  }, K = (a) => 15100 * Math.sqrt(a) * Se, ae = (a) => [
    ...new Set(a.map((o) => +o.toFixed(9)))
  ].sort((o, e) => o - e);
  function pe(a, o, e, t) {
    const l = Array.from({
      length: o + 1
    }, (n, h) => a * h / o);
    return ae([
      ...l,
      e - t / 2,
      e + t / 2
    ].filter((n) => n >= -1e-12 && n <= a + 1e-12));
  }
  function qe(a = {}, o) {
    const e = {
      ...Ae,
      ...a
    }, l = [
      [
        "Dead",
        e.exL,
        e.eyB
      ]
    ].map(([r, p, c]) => {
      const b = e.Lx / 2 + p * e.Lx, s = e.Ly / 2 + c * e.Ly;
      if (b + e.c / 2 > e.Lx + 1e-9 || s + e.c / 2 > e.Ly + 1e-9 || b - e.c / 2 < -1e-9 || s - e.c / 2 < -1e-9) throw new Error(`${r}: la columna se sale de la zapata con esa excentricidad`);
      return {
        nom: r,
        xc: b,
        yc: s,
        exL: p,
        eyB: c
      };
    }), n = ae(l.flatMap((r) => pe(e.Lx, e.n, r.xc, e.c))), h = ae(l.flatMap((r) => pe(e.Ly, e.n, r.yc, e.c))), g = K(e.fc), m = e.ks * Z, k = -(e.P * Z) / (e.c * e.c), i = [];
    i.push("# Cimentaciones con no linealidad: levantamiento de zapatas (suelo sin tracci\xF3n)"), i.push(`# Zapata ${e.Lx} x ${e.Ly} x ${e.t} m, f'c ${e.fc} kgf/cm2 (E = ${g.toFixed(0)} kN/m2), ks ${e.ks} tonf/m3 (${m.toFixed(3)} kN/m3)`);
    for (const r of l) i.push(`# ${r.nom}: columna ${e.c} x ${e.c} m, P = ${e.P} tonf en ex = ${(r.exL * e.Lx).toFixed(4)} m (e/L = ${+r.exL.toFixed(6)}), ey = ${(r.eyB * e.Ly).toFixed(4)} m (e/B = ${+r.eyB.toFixed(6)})`);
    i.push("# Unidades kN, m. El muelle de \xE1rea lleva \xABcompresion\xBB: el suelo no tira (ley Gap de CSI).");
    const u = (r, p) => p * n.length + r + 1;
    for (let r = 0; r < h.length; r++) for (let p = 0; p < n.length; p++) i.push(`node ${u(p, r)} ${+n[p].toFixed(9)} ${+h[r].toFixed(9)} 0`);
    let f = 0;
    const x = [];
    for (let r = 0; r < h.length - 1; r++) for (let p = 0; p < n.length - 1; p++) {
      f++, i.push(`shell ${f} ${u(p, r)} ${u(p + 1, r)} ${u(p + 1, r + 1)} ${u(p, r + 1)} ${e.t} ${+g.toFixed(3)} 0 0`), i.push(`shelltype ${f} thick`), i.push(`areaspring ${f} ${+m.toFixed(6)} nodal${e.sinTraccion === false ? "" : " compresion"}`);
      const c = (n[p] + n[p + 1]) / 2, b = (h[r] + h[r + 1]) / 2;
      for (const s of l) Math.abs(c - s.xc) < e.c / 2 && Math.abs(b - s.yc) < e.c / 2 && x.push(`areaload ${f} ${+k.toFixed(6)}${s.nom === "Dead" ? "" : " " + s.nom}`);
    }
    for (let r = 0; r < h.length; r++) for (let p = 0; p < n.length; p++) i.push(`support ${u(p, r)} 1 1 0 0 0 1`);
    return i.push(...x), i.push(`fc ${+(e.fc * Se).toFixed(3)}`), i.push("vista pressure"), i.push("solve"), i.join(`
`) + `
`;
  }
  function ne(a = {}, o = 400) {
    const e = {
      ...Ae,
      ...a
    }, t = e.exL * e.Lx, l = e.eyB * e.Ly, n = e.Lx / o, h = e.Ly / o, g = n * h, m = Array.from({
      length: o
    }, (s, v) => -e.Lx / 2 + (v + 0.5) * n), k = Array.from({
      length: o
    }, (s, v) => -e.Ly / 2 + (v + 0.5) * h);
    let i = new Uint8Array(o * o).fill(1), u = [
      0,
      0,
      0
    ];
    for (let s = 0; s < 200; s++) {
      const v = [
        [
          0,
          0,
          0
        ],
        [
          0,
          0,
          0
        ],
        [
          0,
          0,
          0
        ]
      ];
      for (let _ = 0; _ < o; _++) for (let S = 0; S < o; S++) if (i[_ * o + S]) {
        const z = [
          1,
          m[S],
          k[_]
        ];
        for (let N = 0; N < 3; N++) for (let I = 0; I < 3; I++) v[N][I] += z[N] * z[I] * g;
      }
      const j = [
        e.P / e.ks,
        e.P * t / e.ks,
        e.P * l / e.ks
      ];
      u = Ne(v, j);
      const D = new Uint8Array(o * o);
      let F = true;
      for (let _ = 0; _ < o; _++) for (let S = 0; S < o; S++) {
        const z = u[0] + u[1] * m[S] + u[2] * k[_];
        D[_ * o + S] = z > 0 ? 1 : 0, D[_ * o + S] !== i[_ * o + S] && (F = false);
      }
      if (i = D, F) break;
    }
    const [f, x, r] = u;
    let p = -1 / 0;
    for (const s of [
      -1,
      1
    ]) for (const v of [
      -1,
      1
    ]) p = Math.max(p, f + x * s * e.Lx / 2 + r * v * e.Ly / 2);
    let c = 0;
    for (const s of i) c += s;
    let b = 0;
    for (const s of m) f + x * s + r * l > 0 && (b += n);
    return {
      qmax: e.ks * p,
      contacto: c / (o * o),
      largoContactoX: b,
      wmax: p,
      giroX: x,
      giroY: r
    };
  }
  function Ne(a, o) {
    const e = a.map((t, l) => [
      ...t,
      o[l]
    ]);
    for (let t = 0; t < 3; t++) {
      let l = t;
      for (let n = t + 1; n < 3; n++) Math.abs(e[n][t]) > Math.abs(e[l][t]) && (l = n);
      [e[t], e[l]] = [
        e[l],
        e[t]
      ];
      for (let n = 0; n < 3; n++) if (n !== t) {
        const h = e[n][t] / e[t][t];
        for (let g = t; g < 4; g++) e[n][g] -= h * e[t][g];
      }
    }
    return [
      e[0][3] / e[0][0],
      e[1][3] / e[1][1],
      e[2][3] / e[2][2]
    ];
  }
  let $;
  $ = (a, o, e, t, l, n) => ({
    default: e,
    min: t,
    max: l,
    step: n,
    label: o,
    folder: a
  });
  Qe = {
    id: "zapata-excentrica",
    name: "Levantamiento de zapatas (suelo sin tracci\xF3n) \xB7 Das ej. 6.10, p. 247",
    category: "4\uFE0F\u20E3 Mixtos \xB7 \u{1F9F0} Cimentaciones",
    defaultShellResult: "pressure",
    availableShellResults: [
      "pressure",
      "displacementZ",
      "bendingXX",
      "bendingYY"
    ],
    params: {
      Lx: $("Zapata", "B en x (m)", y.Lx, 1, 5, 0.05),
      Ly: $("Zapata", "L en y (m)", y.Ly, 1, 5, 0.05),
      t: $("Zapata", "Espesor (m)", y.t, 0.25, 1.5, 0.05),
      fc: $("Zapata", "f'c (kgf/cm\xB2)", y.fc, 180, 420, 10),
      c: $("Columna", "Lado columna (m)", y.c, 0.2, 0.8, 0.05),
      P: $("Columna", "Q (tonf)", y.P, 1, 500, 1e-4),
      exL: {
        default: y.exL,
        label: "e_B/B (en x)",
        folder: "Columna",
        options: {
          0: 0,
          "0.1 (Das 6.10)": 0.1,
          "1/12": 1 / 12,
          "1/6 (l\xEDmite)": 1 / 6,
          "1/4": 0.25,
          "1/3": 1 / 3
        }
      },
      eyB: {
        default: y.eyB,
        label: "e_L/L (en y)",
        folder: "Columna",
        options: {
          0: 0,
          "1/12": 1 / 12,
          "1/6 (l\xEDmite)": 1 / 6,
          "0.2 (Das 6.10)": 0.2,
          "1/4": 0.25,
          "1/3": 1 / 3
        }
      },
      ks: $("Suelo", "ks (tonf/m\xB3)", y.ks, 200, 2e4, 100),
      n: $("Malla", "Divisiones por lado", y.n, 10, 80, 2)
    },
    build(a, o, e) {
      var _a;
      const t = {
        ...y,
        ...a
      };
      window.__hekatanCliScript = qe(t), he.build({}, o, e), typeof document < "u" && ((_a = document.body) == null ? void 0 : _a.appendChild) && ve(() => {
        var _a2, _b;
        const l = window.__hekatanCliContactoIter, n = (_a2 = o == null ? void 0 : o.nodes) == null ? void 0 : _a2.val;
        return !((_b = l == null ? void 0 : l.vueltas) == null ? void 0 : _b.length) || !(n == null ? void 0 : n.length) ? null : {
          p: t,
          nodes: n,
          vueltas: l.vueltas,
          nodosComp: l.nodos
        };
      }, _e, [
        "zapata-excentrica",
        "zapata-levantamiento"
      ], (l) => {
        const n = Ee(o, "Zapata con levantamiento (Hekatan Struct)");
        return n ? $e(n, l) : null;
      });
    },
    computedLabels(a, o) {
      var _a, _b, _c, _d;
      const e = {
        ...y,
        ...a
      }, t = {}, l = (_b = (_a = o == null ? void 0 : o.deformOutputs) == null ? void 0 : _a.val) == null ? void 0 : _b.deformations, n = (_c = o == null ? void 0 : o.nodes) == null ? void 0 : _c.val, h = ne(e, 200);
      t["R\xEDgida q_max"] = `${h.qmax.toFixed(2)} tonf/m\xB2`, t["R\xEDgida contacto"] = `${(h.contacto * e.Lx * e.Ly).toFixed(3)} m\xB2 (${(h.contacto * 100).toFixed(1)} %)`;
      const g = V(e.Lx, e.Ly, e.exL * e.Lx, e.eyB * e.Ly);
      if (t["Das: caso / A' (cap. carga)"] = `${g.caso} \xB7 ${g.A.toFixed(3)} m\xB2`, l && (n == null ? void 0 : n.length)) {
        let i = 0, u = 0;
        for (let f = 0; f < n.length; f++) {
          const x = ((_d = l.get(f)) == null ? void 0 : _d[2]) ?? 0;
          x < i && (i = x), x < 0 && u++;
        }
        t["FEM q_max"] = `${(-i * e.ks).toFixed(2)} tonf/m\xB2`, t["FEM asiento m\xE1x"] = `${(-i * 1e3).toFixed(2)} mm`, t["FEM nudos en contacto"] = `${u} de ${n.length}`;
      }
      const m = window.__hekatanCliContacto;
      m && (t["Iteraciones (ley Gap)"] = `${m.iteraciones}: ${m.historial.join(" \u2192 ")}`);
      const k = Math.abs(e.exL) * 6 + Math.abs(e.eyB) * 6 <= 1 + 1e-9;
      return t.Estado = k ? "resultante en el n\xFAcleo: toda la base comprime (lineal)" : "resultante fuera del n\xFAcleo: parte de la base se LEVANTA", t;
    }
  };
  function V(a, o, e, t) {
    const l = e / a, n = t / o;
    if (l === 0 || n === 0) {
      const x = a - 2 * e, r = o - 2 * t;
      return {
        caso: "una direcci\xF3n (Meyerhof)",
        A: x * r,
        Bp: Math.min(x, r),
        Lp: Math.max(x, r)
      };
    }
    if (n >= 1 / 6 && l >= 1 / 6) {
      const x = a * (1.5 - 3 * l), r = o * (1.5 - 3 * n), p = 0.5 * x * r, c = Math.max(x, r);
      return {
        caso: "I",
        A: p,
        Bp: p / c,
        Lp: c,
        B1: x,
        L1: r
      };
    }
    const h = (x, r, p, c) => {
      const b = (x / 2 - c) / (0.5 + 6 * (p / r) ** 2), s = 12 * b * (p / r);
      return [
        b + s / 2,
        b - s / 2
      ];
    };
    if (n > 1 / 6 && n < 0.5 && l < 1 / 6) {
      const [x, r] = h(o, a, e, t), p = 0.5 * (x + r) * a, c = Math.max(x, r);
      return {
        caso: "II",
        A: p,
        Bp: p / c,
        Lp: c,
        L1: x,
        L2: r
      };
    }
    if (n < 1 / 6 && l > 1 / 6 && l < 0.5) {
      const [x, r] = h(a, o, t, e), p = 0.5 * (x + r) * o;
      return {
        caso: "III",
        A: p,
        Bp: p / o,
        Lp: o,
        B1: x,
        B2: r
      };
    }
    let g = 0.5 * a, m = 0.5 * o;
    const k = (x, r) => {
      const p = x * r / 2, c = a * o - p;
      return [
        -p * (-a / 2 + x / 3) / c - e,
        -p * (-o / 2 + r / 3) / c - t
      ];
    };
    for (let x = 0; x < 100; x++) {
      const r = k(g, m), p = 1e-7, c = k(g + p, m), b = k(g, m + p), s = [
        [
          (c[0] - r[0]) / p,
          (b[0] - r[0]) / p
        ],
        [
          (c[1] - r[1]) / p,
          (b[1] - r[1]) / p
        ]
      ], v = s[0][0] * s[1][1] - s[0][1] * s[1][0], j = (r[0] * s[1][1] - r[1] * s[0][1]) / v, D = (s[0][0] * r[1] - s[1][0] * r[0]) / v;
      if (g -= j, m -= D, Math.abs(j) + Math.abs(D) < 1e-13) break;
    }
    const i = a - g, u = o - m, f = a * o - g * m / 2;
    return {
      caso: "IV",
      A: f,
      Bp: f / o,
      Lp: o,
      B2: i,
      L2: u
    };
  }
  function me(a) {
    const o = a.P ?? y.P, e = a.Lx ?? y.Lx, t = a.Ly ?? y.Ly, l = (a.xcol ?? 0) + (o > 0 ? (a.My ?? 0) / o : 0), n = (a.ycol ?? 0) + (o > 0 ? (a.Mx ?? 0) / o : 0);
    return {
      Lx: e,
      Ly: t,
      t: a.t ?? y.t,
      fc: a.fc ?? y.fc,
      ks: a.ks ?? y.ks,
      c: a.c ?? y.c,
      P: o,
      exL: l / e,
      eyB: n / t,
      n: Math.round(a.n ?? y.n),
      sinTraccion: (a.sinTraccion ?? 1) >= 0.5,
      q_adm: a.q_adm ?? 20
    };
  }
  He = {
    id: "zapata-levantamiento",
    name: "Zapata con levantamiento (suelo sin tracci\xF3n) \xB7 cimentaci\xF3n no lineal por contacto \xB7 Footing with uplift (tensionless soil)",
    category: "4\uFE0F\u20E3 Mixtos \xB7 \u{1F9F0} Cimentaciones",
    defaultShellResult: "pressure",
    availableShellResults: [
      "pressure",
      "displacementZ",
      "bendingXX",
      "bendingYY"
    ],
    params: {
      Lx: $("Geometr\xEDa", "B en x (m)", y.Lx, 0.8, 8, 0.05),
      Ly: $("Geometr\xEDa", "L en y (m)", y.Ly, 0.8, 8, 0.05),
      t: $("Geometr\xEDa", "Espesor (m)", y.t, 0.25, 2, 0.05),
      fc: $("Geometr\xEDa", "f'c (kgf/cm\xB2)", y.fc, 180, 420, 10),
      c: $("Columna", "Lado columna (m)", y.c, 0.2, 1, 0.05),
      xcol: $("Columna", "Posici\xF3n x desde el centro (m)", 0.15, -3, 3, 0.05),
      ycol: $("Columna", "Posici\xF3n y desde el centro (m)", 0.3, -3, 3, 0.05),
      P: $("Cargas", "P (tonf, hacia abajo)", y.P, 0.1, 2e3, 1e-4),
      Mx: $("Cargas", "Mx (tonf\xB7m) \u2192 mueve la resultante en y", 0, -500, 500, 0.5),
      My: $("Cargas", "My (tonf\xB7m) \u2192 mueve la resultante en x", 0, -500, 500, 0.5),
      soilType: {
        default: 0,
        label: "Tipo de suelo",
        folder: "Suelo",
        options: Object.fromEntries(ie.map((a, o) => [
          a.name,
          o
        ]))
      },
      q_adm: $("Suelo", "q_adm (tonf/m\xB2)", 20, 1, 300, 1),
      ks: $("Suelo", "ks (tonf/m\xB3)", y.ks, 50, 5e4, 10),
      sinTraccion: {
        default: 1,
        boolean: true,
        label: "Suelo sin tracci\xF3n (no lineal)",
        folder: "Suelo"
      },
      n: $("Malla", "Divisiones por lado", y.n, 10, 80, 2)
    },
    onParamChange(a, o) {
      if (a !== "soilType") return;
      const e = ie[Math.round(o.soilType)];
      !e || e.name === "Custom" || (o.q_adm = e.q_adm, o.ks = +(e.q_adm * e.ks_factor).toFixed(0));
    },
    build(a, o, e) {
      var _a;
      const t = me(a);
      window.__hekatanCliScript = qe(t), he.build({}, o, e), typeof document < "u" && ((_a = document.body) == null ? void 0 : _a.appendChild) && ve(() => {
        var _a2, _b;
        const l = window.__hekatanCliContactoIter, n = (_a2 = o == null ? void 0 : o.nodes) == null ? void 0 : _a2.val;
        return !((_b = l == null ? void 0 : l.vueltas) == null ? void 0 : _b.length) || !(n == null ? void 0 : n.length) ? null : {
          p: t,
          nodes: n,
          vueltas: l.vueltas,
          nodosComp: l.nodos
        };
      }, _e, [
        "zapata-excentrica",
        "zapata-levantamiento"
      ], (l) => {
        const n = Ee(o, "Zapata con levantamiento (Hekatan Struct)");
        return n ? $e(n, l) : null;
      }, () => t.q_adm);
    },
    computedLabels(a, o) {
      var _a, _b, _c, _d;
      const e = me(a), t = {}, l = e.exL * e.Lx, n = e.eyB * e.Ly;
      t.Excentricidad = `e_x = ${l.toFixed(3)} m (e/B ${e.exL.toFixed(3)}) \xB7 e_y = ${n.toFixed(3)} m (e/L ${e.eyB.toFixed(3)})`;
      const h = V(e.Lx, e.Ly, l, n);
      t["Das: caso / A' (cap. carga)"] = `${h.caso} \xB7 ${h.A.toFixed(3)} m\xB2`;
      const g = (_b = (_a = o == null ? void 0 : o.deformOutputs) == null ? void 0 : _a.val) == null ? void 0 : _b.deformations, m = (_c = o == null ? void 0 : o.nodes) == null ? void 0 : _c.val;
      if (g && (m == null ? void 0 : m.length)) {
        let i = 0, u = 0;
        for (let x = 0; x < m.length; x++) {
          const r = ((_d = g.get(x)) == null ? void 0 : _d[2]) ?? 0;
          i = Math.min(i, r), r < 0 && u++;
        }
        const f = -i * e.ks;
        t.q_max = `${f.toFixed(2)} tonf/m\xB2`, t["q_max / q_adm"] = `${(f / e.q_adm).toFixed(2)} ${f > e.q_adm ? "\u26A0\uFE0F NO CUMPLE" : "\u2713"}`, t["Nudos en contacto"] = e.sinTraccion ? `${u} de ${m.length}` : `lineal: ${m.length - u} nudos con el suelo TIRANDO`;
      }
      const k = Math.abs(e.exL) * 6 + Math.abs(e.eyB) * 6 <= 1 + 1e-9;
      return t.Estado = k ? "resultante en el n\xFAcleo: toda la base comprime" : "resultante fuera del n\xFAcleo: parte de la base se LEVANTA", t;
    }
  };
});
export {
  __tla,
  He as a,
  Qe as z
};
