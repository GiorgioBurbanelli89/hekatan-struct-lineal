/**
 * Formulaciones de PLACA que el usuario puede elegir para un área (2-nov-2026).
 *
 * UNA sola tabla para todo Struct: el selector del modelo dibujado (newBlank «Formulación placa»),
 * la palabra del `.heks` (`shelltype <id> <clave>`, cliModeler) y lo que se guarda al exportar.
 * El número `pf` es `elementInputs.plateFormulations[idx]`, el mismo que lee el C++
 * (getLocalStiffnessMatrix.cpp → getLocalStiffnessMatrixShellQ4/Thin/DKMQ). No es un sistema
 * nuevo: solo pone nombre, cita y alias a lo que el solver ya tenía.
 *
 * `enWasm = false`: el C++ nativo la tiene pero el WASM publicado todavía NO (falta correr
 * hekatan-fem/build_wasm.sh). Con el WASM viejo ese pf cae en el MITC4 SIN avisar, así que
 * el lector la RECHAZA con un error hasta que se reconstruya y se cambie el flag a true.
 */
export interface FormulacionPlaca {
  pf: number;              // plateFormulations del solver
  clave: string;           // palabra del .heks (la que escribe el exportador)
  alias: string[];         // otras palabras que acepta `shelltype`
  nombre: string;          // para el menú
  que: string;             // una línea: qué es
  fuente: string;          // de dónde viene
  enWasm: boolean;
}

export const FORMULACIONES_PLACA: FormulacionPlaca[] = [
  { pf: 0, clave: "thick", alias: ["gruesa", "mindlin", "mitc4", "0"], nombre: "Shell-Thick · MITC4",
    que: "Mindlin con cortante; cortante asumido en los lados + 4 modos incompatibles condensados (defecto)",
    fuente: "Bathe y Dvorkin 1985; modos incompatibles de Wilson et al. 1973", enWasm: true },
  { pf: 1, clave: "thin", alias: ["delgada", "kirchhoff", "dkq", "1"], nombre: "Shell-Thin · DKQ (Discrete Kirchhoff Quadrilateral)",
    que: "Kirchhoff discreto, sin cortante; en triángulos DKT. Es el Shell-Thin de CSI (0.000 % ETABS)",
    fuente: "Batoz y Tahar 1982; = DKE de Wilson cap. 8 a 3e-16 (DKQ = jacobiano real en cada punto de Gauss)", enWasm: true },
  { pf: 6, clave: "dke", alias: ["wilson-dke", "6"], nombre: "Shell-Thin · DKE (Discrete Kirchhoff Element, Wilson)",
    que: "Kirchhoff discreto del libro de Wilson (cap. 8, Ec. 8.21), sin cortante. Es la misma placa que la DKQ; sirve para contrastar",
    fuente: "Wilson, Analisis estatico y dinamico de estructuras, cap. 8 (plateWilsonCSI.h kWilsonDKE)", enWasm: true },
  { pf: 4, clave: "dse", alias: ["wilson", "4"], nombre: "DSE · Wilson cap. 8",
    que: "Discrete Shear Element: cortante constante por lado, corrección de patch test y condensación (con la inversa correcta de la Ec. 8.8)",
    fuente: "Wilson cap. 8, Ec. 8.6-8.19 (Análisis estático y dinámico de estructuras)", enWasm: true },
  { pf: 3, clave: "dkmq", alias: ["katili", "3"], nombre: "DKMQ · Katili",
    que: "Discrete Kirchhoff-Mindlin: gruesa y delgada sin bloqueo. ⚠ ignora los modificadores f/m/v",
    fuente: "Katili 1993, IJNME 36", enWasm: true },
  { pf: 5, clave: "auricchio", alias: ["at", "auricchio-taylor", "5"], nombre: "Auricchio-Taylor",
    que: "Mindlin mixto: w ligado a los giros + burbujas; carga de área con momentos",
    fuente: "Auricchio y Taylor 1994, CMAME 118 (FEAPpv plate2d.f)", enWasm: true },
  { pf: 8, clave: "csi", alias: ["thickcsi", "csi-thick", "8"], nombre: "Shell-Thick · CSI",
    que: "La placa gruesa de SAP2000/ETABS (22 GDL condensados), medida contra su kernel",
    fuente: "CSI (caja negra, plateWilsonCSI.h kShellThickCSI)", enWasm: true },
];

/** Busca por palabra del .heks (clave o alias), sin mayúsculas. */
export function formulacionPorPalabra(palabra: string): FormulacionPlaca | undefined {
  const q = (palabra ?? "").toLowerCase();
  return FORMULACIONES_PLACA.find((f) => f.clave === q || f.alias.includes(q));
}

export function formulacionPorPf(pf: number): FormulacionPlaca | undefined {
  return FORMULACIONES_PLACA.find((f) => f.pf === pf);
}
