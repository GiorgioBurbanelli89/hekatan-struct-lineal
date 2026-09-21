/**
 * tutorCadena.ts — el árbol «¿De dónde sale?» del Tutor FEM, sin IA: cada hoja explica UN término y
 * enlaza las hojas de los términos que usa. Para la placa de la zapata (Shell-Thick del solver):
 *
 *   K → B → N, J · K → Gauss · K → D · K → ensamble → Winkler → no linealidad
 *
 * Cada hoja: fórmula en letras → valores del modelo abierto, libro, archivo:línea del solver y un
 * dibujo cuando lo hay. La placa es la del motor de verdad: MITC4 (cortante) + modos incompatibles de
 * Wilson condensados (flexión), `getBendingK` de hekatan-fem/src/cpp/utils/shellQ4.cpp. Donde la hoja
 * simplifica (elemento cuadrado, sin los modos incompatibles en las cuentas), lo dice.
 */
import { moduloE, type ParamsZapataExc } from "../zapata-excentrica/zapataExcentrica";

export interface NodoCadena { id: string; titulo: [string, string]; hijos: string[]; hoja?: (p: ParamsZapataExc) => string }

const f = (x: number, d = 4) => +x.toFixed(d);
const Etf = (p: ParamsZapataExc) => moduloE(p.fc) / 98.0665 * 10;   // tonf/m²

export const CADENA: Record<string, NodoCadena> = {
  K: {
    id: "K", titulo: ["K del elemento de placa", "Plate element K"], hijos: ["B", "D", "G", "ENS"],
    hoja: (p) => {
      const h = p.Lx / p.n;
      return [
        "# La matriz de rigidez K del elemento de placa",
        `#: Qué usa de verdad el solver en esta zapata (Shell-Thick): la flexión con los modos incompatibles de Wilson condensados y el cortante con el MITC4 de Dvorkin y Bathe (1984). Archivo hekatan-fem/src/cpp/utils/shellQ4.cpp, getBendingK (líneas 807–1015). Elemento del modelo abierto: cuadrado de lado h = ${f(h)} m, espesor ${p.t} m.`,
        "#: La rigidez es la energía de deformación escrita en los 12 movimientos del elemento (w, θx, θy en sus 4 nudos). Dos energías, flexión y cortante:",
        "K_e = Integral{transpose(B_b)*D_b*B_b + transpose(B_s)*D_s*B_s}",
        "#: B_{b} pasa de los movimientos a las curvaturas (¿de dónde sale? → B), D_{b} y D_{s} son el material (→ D), y la integral se hace con puntos de Gauss (→ Gauss). Luego cada K_{e} se suma en la K de toda la zapata (→ ensamble).",
        "#: Qué simplifica esta cadena: las cuentas se hacen para el cuadrado del modelo y sin los modos incompatibles (el motor los añade en la flexión y los condensa: Bathe y Wilson 1976, §4, ecs. 4.43–4.44). En un cuadrado su efecto es pequeño; en un trapecio no.",
        `h_e = ${f(h, 6)}`,
        `A_e = dec(h_e^2, 6)`,
      ].join("\n") + "\n";
    },
  },
  B: {
    id: "B", titulo: ["B: de los movimientos a las curvaturas", "B: from displacements to curvatures"], hijos: ["N", "J"],
    hoja: (p) => {
      const h = p.Lx / p.n;
      return [
        "# B: de los movimientos a las curvaturas",
        "#: En la placa gruesa los giros β_{x}, β_{y} se interpolan con las mismas funciones N que w (→ N). La flexión mira cómo CAMBIAN los giros: las curvaturas son sus derivadas.",
        "kappa_x = Diff{beta_x @ x}",
        "kappa_y = Diff{beta_y @ y}",
        "#: Con β = Σ N_{i}·β_{i}, cada columna de B_{b} es una derivada de una N. Para el nudo 1 de un cuadrado de lado h con origen en ese nudo:",
        "N_1 = (1 - x/h)*(1 - y/h)",
        "dN1 = Diff{(1 - x/h)*(1 - y/h) @ x}",
        `#: Las derivadas en x, y salen de las de ξ, η con la inversa del Jacobiano (→ J): en el motor, shellQ4.cpp líneas 876–877. Con el elemento del modelo (h = ${f(h)} m), en el centro (x = y = h/2):`,
        `dN1_c = dec(-(1 - 0.5)/${f(h, 6)}, 4)`,
        "#: En 1/m. Un elemento más chico tiene derivadas más grandes: por eso la rigidez crece al refinar la malla en flexión.",
      ].join("\n") + "\n";
    },
  },
  N: {
    id: "N", titulo: ["N: funciones de forma del Q4", "N: Q4 shape functions"], hijos: [],
    hoja: () => [
      "# N: las funciones de forma del cuadrilátero de 4 nudos",
      "#: Con 4 nudos se pueden fijar 4 coeficientes: a + b·ξ + c·η + d·ξη (bilineal). Cada N_{i} vale 1 en su nudo y 0 en los otros tres; en el cuadrado de referencia (ξ, η de −1 a 1):",
      "N_1 = (1 - xi)*(1 - eta)/4",
      "N_2 = (1 + xi)*(1 - eta)/4",
      "N_3 = (1 + xi)*(1 + eta)/4",
      "N_4 = (1 - xi)*(1 + eta)/4",
      "#: Suman 1 en todo el elemento (así un movimiento rígido no deforma nada):",
      "S_N = Expand{(1 - xi)*(1 - eta)/4 + (1 + xi)*(1 - eta)/4 + (1 + xi)*(1 + eta)/4 + (1 - xi)*(1 + eta)/4}",
      "#: A lo largo de un lado (η = −1) N_{1} baja recta de 1 a 0 y N_{2} sube: lineal por lado, por eso dos elementos vecinos encajan sin huecos.",
      "#fplot((1 - x)/2, (1 + x)/2, [-1 1])",
      "#: Libro: Chandrupatla y Belegundu, «Introducción al estudio del elemento finito en ingeniería», cap. 7 (Q4). En el motor: shellQ4.cpp, dNdxi/dNdeta de getBendingK.",
    ].join("\n") + "\n",
  },
  J: {
    id: "J", titulo: ["J: el Jacobiano", "J: the Jacobian"], hijos: [],
    hoja: (p) => {
      const h = p.Lx / p.n;
      return [
        "# J: del cuadrado de referencia al elemento real",
        "#: Las N se escriben en ξ, η (de −1 a 1) pero la placa vive en x, y. El elemento real se dibuja con las MISMAS N (isoparamétrico): x = Σ N_{i}·x_{i}. El Jacobiano mide cuánto se estira el cuadrado de referencia:",
        "J_11 = Diff{h/2*(1 + xi) @ xi}",
        "#: En un cuadrado de lado h, x = (h/2)(1 + ξ): J es h/2 en la diagonal y cero fuera. El área se escala con su determinante:",
        "det_J = (h/2)^2",
        `#: Con el elemento del modelo (h = ${f(h)} m):`,
        `J_1 = dec(${f(h, 6)}/2, 5)`,
        `detJ_1 = dec((${f(h, 6)}/2)^2, 7)`,
        "#: Y las derivadas en x salen de las de ξ dividiendo por J: ∂N/∂x = (∂N/∂ξ)/J_{11}. En el motor: jacobian2D, shellQ4.cpp línea 858.",
      ].join("\n") + "\n";
    },
  },
  G: {
    id: "G", titulo: ["Gauss: por qué 2×2 puntos", "Gauss: why 2×2 points"], hijos: [],
    hoja: () => [
      "# La integral con puntos de Gauss",
      "#: La K es una integral sobre el elemento. En vez de integrar a mano, se evalúa el integrando en pocos puntos elegidos y se suma con pesos. Con 2 puntos en ξ = ±1/√3 (peso 1 cada uno) la regla es EXACTA para polinomios hasta grado 3:",
      "I_exacta = Area{xi^2 @ xi=-1:1}",
      "I_gauss = (-1/sqrt(3))^2 + (1/sqrt(3))^2",
      "#: Las dos dan 2/3. En la flexión del Q4, Bᵀ·D·B es de grado 2 en cada dirección: 2×2 puntos la integran exacta. Menos puntos dejarían modos de energía nula (el elemento sería un mecanismo); más no cambian nada.",
      "#fplot(x^2, 1/3, [-1 1])",
      "#: El cortante, en cambio, integrado así «bloquea» la placa delgada (shear locking, Bathe y Wilson 1976, p. 148): por eso el MITC4 lo toma en los centros de los lados y lo interpola (shellQ4.cpp, líneas 927–1010). Libro de la regla: Chandrupatla y Belegundu, cap. 7.",
    ].join("\n") + "\n",
  },
  D: {
    id: "D", titulo: ["D: el material de la placa", "D: plate material"], hijos: [],
    hoja: (p) => {
      const E = Etf(p);
      return [
        "# D: la ley del material (flexión y cortante)",
        "#: Una placa de espesor t: los momentos por metro salen de las curvaturas multiplicadas por la rigidez a flexión. El t³/12 es el momento de inercia de una franja de 1 m de ancho, y 1 − ν² es porque la placa no puede encogerse de lado como una viga:",
        "D_0 = E*t^3/(12*(1 - nu^2))",
        "#: El cortante transversal, con el factor 5/6 de la distribución parabólica de tensiones:",
        "D_s = 5/6*G*t",
        `#: Con el hormigón del modelo (f'c ${p.fc} kgf/cm² → E = 15100·√f'c = ${f(E, 0)} tonf/m², ν = 0.2) y t = ${p.t} m:`,
        `D_1 = dec(${f(E, 1)}*${p.t}^3/(12*(1 - 0.2^2)), 1)`,
        `Ds_1 = dec(5/6*${f(E, 1)}/(2*(1 + 0.2))*${p.t}, 1)`,
        "#: D_{1} en tonf·m y Ds_{1} en tonf/m. En el motor: shellQ4.cpp líneas 811–821 (D0, Db, ks = 5/6, Ds).",
      ].join("\n") + "\n";
    },
  },
  ENS: {
    id: "ENS", titulo: ["Ensamble: la tabla de GDL", "Assembly: the DOF table"], hijos: ["W"],
    hoja: (p) => {
      const nn = (p.n + 1) ** 2;
      return [
        "# El ensamble: de muchas K pequeñas a una K grande",
        "#: Cada nudo tiene 6 grados de libertad en el motor (3 traslaciones y 3 giros). El nudo n ocupa las filas 6n a 6n + 5. La K del elemento (en sus 4 nudos) se SUMA en esas filas y columnas: donde dos elementos comparten un nudo, sus rigideces se suman.",
        "#| Nudo | GDL | Qué es |",
        "#|---|---|---|",
        "#| n | 6n | u_{x} (fijo en la zapata) |",
        "#| n | 6n+1 | u_{y} (fijo) |",
        "#| n | 6n+2 | w (baja) |",
        "#| n | 6n+3 | θ_{x} |",
        "#| n | 6n+4 | θ_{y} |",
        "#| n | 6n+5 | θ_{z} (fijo) |",
        `#: En el modelo abierto: ${nn} nudos → ${6 * nn} filas, de las que quedan libres ${3 * nn} (w, θx, θy). Después se suman los resortes del suelo en la diagonal del w de cada nudo (→ Winkler) y se resuelve:`,
        "F = K*u",
        "#: En el motor: getGlobalStiffnessMatrix.cpp (tripletas sumadas, líneas 20–146) y los resortes en deform.cpp líneas 162–170.",
      ].join("\n") + "\n";
    },
  },
  W: { id: "W", titulo: ["Resorte Winkler: k = ks·A", "Winkler spring: k = ks·A"], hijos: ["NL"] },
  NL: { id: "NL", titulo: ["No linealidad: apagar los resortes en tracción", "Nonlinearity: switching off springs in tension"], hijos: [] },
};
