/**
 * Capítulo 5 — Las zapatas de Marcelo Guerra: sin sismo, con sismo y con viga de amarre.
 * Se cargan los ejemplos ya hechos (ej1, ej2, ej6) y se ve la presión del suelo de cada uno,
 * comparándola con el libro. Todo con el ratón sobre la app real.
 * Arranca directo en ej1 por URL; ej2 y ej6 se cambian desde el desplegable «Ejemplo»
 * (los tres viven en la misma categoría de Cimentaciones).
 */
export const titulo = "Hekatan Struct · zapatas de Guerra vs libro";
export const ruta = "workspace/?t=guerra-ej1-zapata-cuadrada";

const verPresion = async (a, nota) => {
  await a.marcarSel("#legend", nota);
  await a.quieto(6, 300);
  await a.sinCuadro();
  await a.quieto(2, 300);
};

export const pasos = [
  {
    rotulo: "Portada",
    hacer: async (a) => { await a.portada("Zapatas de Guerra vs el libro", "Capítulo 5", 16); },
  },
  {
    rotulo: "1 · Ej.1 sin sismo: zapata cuadrada",
    hacer: async (a) => {
      await a.general(); await a.quieto(3, 300);
      await verPresion(a, "Ej.1 sin sismo: la presión bajo la zapata, en tonf/m².");
    },
  },
  {
    rotulo: "2 · Ej.2 con sismo: la rectangular",
    hacer: async (a) => {
      await a.elegir("Ejemplo", "Ej.2 · Zapata Rectangular + Sismo", 8000);
      await a.quieto(4, 300);
      await verPresion(a, "Ej.2 con sismo: se despega un lado (e > L/6).");
    },
  },
  {
    rotulo: "3 · Ej.6: dos zapatas con viga de amarre",
    hacer: async (a) => {
      // ej6 vive en OTRA categoría (4️⃣ Mixtos · Cimentaciones); el desplegable la
      // muestra como «🧰 Cimentaciones (4️⃣)». ej1/ej2 son la «(2️⃣)».
      await a.elegir("Categoría", "Cimentaciones (4", 4000);
      await a.elegir("Ejemplo", "Ej.6 · Zapata Unida con Viga de Amarre", 8000);
      await a.quieto(4, 300);
      await verPresion(a, "Ej.6: dos zapatas unidas; se concentra en la columna de lindero.");
    },
  },
  {
    rotulo: "4 · Cierre: contra el libro",
    hacer: async (a) => {
      await a.general();
      await a.quieto(8, 300);
    },
  },
];
