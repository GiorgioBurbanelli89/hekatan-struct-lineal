/**
 * «K local ▸ LISP»: designas una barra en el visor y su matriz de rigidez
 * local se explica en una hoja de Hekatan LISP, término a término.
 *
 * Jorge, 21-sep-2026: «no vi una forma de que al seleccionar una barra [salga]
 * la matriz de rigidez local y se la pueda explicar en Hekatan LISP web».
 *
 * Las piezas ya estaban sueltas y aquí se juntan:
 *   · `window.__hekatanModelSelection` dice qué está designado;
 *   · `window.__hekatanStates` tiene los nudos y las propiedades del elemento;
 *   · `hojaLisp.abrirHoja` abre el motor de Hekatan LISP en la ventana de al lado.
 *
 * La hoja NO trae la matriz hecha: lleva E, A, I, L y las FÓRMULAS, y es el
 * motor de LISP el que saca cada término y arma la matriz de 12 × 12. Así se
 * puede cambiar un dato y ver cómo se mueve toda la matriz — que es de lo que
 * se trata cuando se explica.
 */

import { abrirHoja } from "./hojaLisp";

type Sel = { type: "node" | "frame" | "shell" | "solid"; idx: number };
const W = () => window as any;

/** Lo último designado que sea barra o cáscara. */
export function designado(): Sel | null {
  const sel: Sel[] = W().__hekatanModelSelection ?? [];
  for (let i = sel.length - 1; i >= 0; i--)
    if (sel[i].type === "frame" || sel[i].type === "shell") return sel[i];
  return null;
}

const num = (v: any, d = 6): string => {
  const x = Number(v);
  if (!Number.isFinite(x)) return "0";
  if (x !== 0 && (Math.abs(x) < 1e-4 || Math.abs(x) >= 1e7)) return x.toExponential(4);
  return String(+x.toFixed(d));
};

/** Datos de la barra: los dos nudos y las propiedades que hacen falta. */
function datosBarra(idx: number) {
  const st = W().__hekatanStates;
  const nodos: number[][] = st?.nodes?.val ?? st?.nodes?.rawVal ?? [];
  const elems: number[][] = st?.elements?.val ?? st?.elements?.rawVal ?? [];
  const ei = st?.elementInputs?.val ?? st?.elementInputs?.rawVal ?? {};
  const el = elems[idx];
  if (!el || el.length !== 2) return null;
  const a = nodos[el[0]], b = nodos[el[1]];
  if (!a || !b) return null;
  const g = (m: any, def: number) =>
    Number((m?.get?.(idx) ?? m?.[idx] ?? def)) || def;
  const L = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
  const E = g(ei.elasticities, 2.1e8);
  const nu = g(ei.poissonsRatios ?? ei.poissons, 0.3);
  return {
    idx, a, b, L,
    n1: el[0] + 1, n2: el[1] + 1,
    E,
    A: g(ei.areas, 0.01),
    I22: g(ei.I22 ?? ei.momentsOfInertiaZ, 1e-5),
    I33: g(ei.I33 ?? ei.momentsOfInertiaY, 1e-5),
    J: g(ei.J ?? ei.torsionalConstants, 1e-5),
    G: g(ei.shearModuli, E / (2 * (1 + nu))),
    nu,
  };
}

/** La hoja: los datos, cada término deducido, y la matriz armada por el motor. */
function hojaBarra(d: NonNullable<ReturnType<typeof datosBarra>>): string {
  const BT = "`".repeat(3);
  const L = [
    `# Matriz de rigidez local de la barra ${d.idx + 1}`,
    "",
    `#: Barra del nudo **${d.n1}** (${num(d.a[0], 3)}, ${num(d.a[1], 3)}, ${num(d.a[2], 3)}) al nudo **${d.n2}** (${num(d.b[0], 3)}, ${num(d.b[1], 3)}, ${num(d.b[2], 3)}), tomada del modelo que está abierto en Hekatan Struct. La matriz local es la que relaciona las doce fuerzas de los extremos con los doce desplazamientos, **en los ejes de la propia barra**: primero el nudo inicial (3 traslaciones y 3 giros) y después el final.`,
    "",
    "## 1 · Lo que define a esta barra",
    "",
    "#| Dato | Valor | Dato | Valor |",
    "#|---|---:|---|---:|",
    `#| Largo L | ${num(d.L, 4)} m | E | ${num(d.E, 0)} kN/m^{2} |`,
    `#| Área A | ${num(d.A)} m^{2} | G | ${num(d.G, 0)} kN/m^{2} |`,
    `#| I_{22} | ${num(d.I22)} m^{4} | I_{33} | ${num(d.I33)} m^{4} |`,
    `#| J | ${num(d.J)} m^{4} | ν | ${num(d.nu, 3)} |`,
    "",
    "## 2 · De dónde sale cada término",
    "",
    "#: La barra hace cuatro cosas a la vez, y cada una da su propio término. **Estirarse**: es un muelle, y su rigidez es el área por el módulo, repartida en el largo.",
    "k_N = E*A/L",
    "#: **Torcerse**: lo mismo pero con el módulo de corte y la constante de torsión.",
    "k_T = G*J/L",
    "#: **Flectar**: aquí salen tres, y los tres vienen de la misma viga empotrada. Empujar el extremo sin dejarlo girar cuesta doce; el giro que ese empujón provoca vale seis; y girar el extremo sin moverlo cuesta cuatro. El largo entra al cubo, al cuadrado y solo, respectivamente.",
    "k_V = 12*E*I/L^3",
    "k_M = 6*E*I/L^2",
    "k_G = 4*E*I/L",
    "",
    "#: Y el que sale a menudo en los libros sin decir de dónde viene: el término CRUZADO del otro extremo es la mitad del propio, porque la deformada es una cúbica.",
    "k_C = 2*E*I/L",
    "",
    "## 3 · Con los números de ESTA barra",
    "",
    `E = ${num(d.E, 0)}`,
    `A = ${num(d.A)}`,
    `L = ${num(d.L, 6)}`,
    `G = ${num(d.G, 0)}`,
    `J = ${num(d.J)}`,
    `I = ${num(d.I33)}`,
    "#: El axial, la torsión y los tres de flexión, en kN/m y kN·m:",
    "k_N = dec(E*A/L, 2)",
    "k_T = dec(G*J/L, 2)",
    "k_V = dec(12*E*I/L^3, 2)",
    "k_M = dec(6*E*I/L^2, 2)",
    "k_G = dec(4*E*I/L, 2)",
    "",
    "## 4 · La matriz, armada por el motor",
    "",
    "#: Con esos cinco números ya está todo: la matriz de 12 × 12 no tiene ni un valor más, solo estos repetidos y con su signo. Se arma aquí, no viene hecha de fuera.",
    "",
    BT + "lisp",
    ";;;; La K local de la barra, armada termino a termino.",
    `(defparameter *E* ${d.E}d0)`,
    `(defparameter *A* ${d.A}d0)`,
    `(defparameter *L* ${d.L}d0)`,
    `(defparameter *G* ${d.G}d0)`,
    `(defparameter *J* ${d.J}d0)`,
    `(defparameter *I22* ${d.I22}d0)`,
    `(defparameter *I33* ${d.I33}d0)`,
    "",
    "(defun k-local ()",
    "  (let* ((k (make-array '(12 12) :element-type 'double-float :initial-element 0d0))",
    "         (ea (/ (* *E* *A*) *L*))                       ; axial",
    "         (gj (/ (* *G* *J*) *L*))                       ; torsion",
    "         (v3 (/ (* 12d0 *E* *I33*) (expt *L* 3)))       ; cortante en el plano 1-2",
    "         (m3 (/ (*  6d0 *E* *I33*) (expt *L* 2)))",
    "         (g3 (/ (*  4d0 *E* *I33*) *L*))",
    "         (c3 (/ (*  2d0 *E* *I33*) *L*))",
    "         (v2 (/ (* 12d0 *E* *I22*) (expt *L* 3)))       ; cortante en el plano 1-3",
    "         (m2 (/ (*  6d0 *E* *I22*) (expt *L* 2)))",
    "         (g2 (/ (*  4d0 *E* *I22*) *L*))",
    "         (c2 (/ (*  2d0 *E* *I22*) *L*)))",
    "    (macrolet ((s (i j v) `(setf (aref k ,i ,j) ,v (aref k ,j ,i) ,v)))",
    "      ;; axial: nudo i tira del j",
    "      (s 0 0 ea) (s 6 6 ea) (s 0 6 (- ea))",
    "      ;; torsion",
    "      (s 3 3 gj) (s 9 9 gj) (s 3 9 (- gj))",
    "      ;; flexion en el plano 1-2 (desplazamiento 2, giro 6)",
    "      (s 1 1 v3) (s 7 7 v3) (s 1 7 (- v3))",
    "      (s 5 5 g3) (s 11 11 g3) (s 5 11 c3)",
    "      (s 1 5 m3) (s 1 11 m3) (s 5 7 (- m3)) (s 7 11 (- m3))",
    "      ;; flexion en el plano 1-3 (desplazamiento 3, giro 5) — el signo se da vuelta",
    "      (s 2 2 v2) (s 8 8 v2) (s 2 8 (- v2))",
    "      (s 4 4 g2) (s 10 10 g2) (s 4 10 c2)",
    "      (s 2 4 (- m2)) (s 2 10 (- m2)) (s 4 8 m2) (s 8 10 m2))",
    "    k))",
    "",
    "(let ((k (k-local))",
    "      (nom #(\"u1\" \"u2\" \"u3\" \"r1\" \"r2\" \"r3\" \"u1'\" \"u2'\" \"u3'\" \"r1'\" \"r2'\" \"r3'\")))",
    "  (format t \"~&K local de la barra, 12 x 12 [kN/m y kN*m]~%~%     \")",
    "  (dotimes (j 12) (format t \"~12a\" (aref nom j)))",
    "  (format t \"~%\")",
    "  (dotimes (i 12)",
    "    (format t \"~4a \" (aref nom i))",
    "    (dotimes (j 12)",
    "      (let ((v (aref k i j)))",
    "        (format t \"~12a\" (if (zerop v) \".\" (format nil \"~,1f\" v)))))",
    "    (format t \"~%\"))",
    "  (format t \"~%comprobaciones:~%\")",
    "  (format t \"  simetrica: ~a~%\"",
    "          (let ((ok t)) (dotimes (i 12) (dotimes (j 12)",
    "            (when (> (abs (- (aref k i j) (aref k j i))) 1d-9) (setf ok nil)))) ok))",
    "  (format t \"  suma de la fila del axial = ~,10f  (tiene que ser 0: mover la barra entera no genera fuerza)~%\"",
    "          (let ((s 0d0)) (dotimes (j 12) (incf s (aref k 0 j))) s))",
    "  (format t \"  suma de la fila de la torsion = ~,10f~%\"",
    "          (let ((s 0d0)) (dotimes (j 12) (incf s (aref k 3 j))) s)))",
    BT,
  ];
  return L.join("\n");
}

/** Abre la hoja de la barra designada. Devuelve el mensaje de lo que pasó. */
export function explicarKLocal(): string {
  const s = designado();
  if (!s) return "Designá primero una barra en el visor (clic encima).";
  if (s.type === "shell")
    return "La cáscara todavía no: por ahora la hoja explica la barra. (La placa Q4 está en camino.)";
  const d = datosBarra(s.idx);
  if (!d) return "No pude leer los datos de esa barra.";
  if (!(d.L > 0)) return "Esa barra tiene largo cero.";
  abrirHoja(`K local · barra ${d.idx + 1}`, hojaBarra(d));
  return `Barra ${d.idx + 1}: L = ${num(d.L, 3)} m. La hoja está a la izquierda.`;
}
