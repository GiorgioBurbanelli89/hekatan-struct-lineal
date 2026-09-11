/**
 * Capítulo 2 — Entrar a los Ejemplos y cambiar fuerzas, longitudes y secciones.
 *
 * Se usa «Pórtico 2D (un piso)» porque tiene los tres tipos de mando separados en
 * carpetas, que es justo lo que hay que enseñar: GEOMETRÍA (ancho del vano, altura),
 * SECCIONES (b y h de columna y viga) y CARGAS (muerta, viva, lateral). Y es un
 * pórtico de un piso: cada cambio se ve a simple vista en el diagrama de momentos.
 */
export const titulo = "Hekatan Struct · los ejemplos, mando a mando";
export const ruta = "workspace/";

export const pasos = [
  {
    rotulo: "1 · Desde la pantalla principal, Ejemplos",
    hacer: async (a) => {
      await a.general(); await a.quieto(5, 300);
      await a.cerca("boton", "Ejemplos");
      await a.marcar("boton", "Ejemplos", "El catálogo: modelos ya montados, con sus mandos.");
      await a.quieto(5, 300);
      await a.sinCuadro();
      await a.pulsar("Ejemplos", 5000);
      await a.general(); await a.quieto(5, 300);
    },
  },
  {
    rotulo: "2 · Se elige la categoría y el ejemplo",
    hacer: async (a) => {
      await a.cerca("fila", "Categoría");
      await a.marcar("fila", "Categoría", "Primero la familia: pórticos planos.");
      await a.quieto(4, 300);
      await a.elegir("Categoría", "Pórtico plano", 4000);
      await a.cerca("fila", "Ejemplo");
      await a.marcar("fila", "Ejemplo", "Y dentro, el ejemplo: un pórtico de un piso.");
      await a.quieto(4, 300);
      await a.elegir("Ejemplo", "Pórtico 2D (un piso)", 7000);
      // La deformada viene exagerada y un pórtico plano en isométrica no se lee:
      // se apaga la deformada y se mira de FRENTE, como en un plano.
      await a.ajuste("deformedShape", false);
      await a.alzado();
      await a.sinCuadro(); await a.general(); await a.quieto(8, 300);
    },
  },
  {
    rotulo: "3 · Para ver lo que cambia: el diagrama de momentos",
    hacer: async (a) => {
      await a.cerca("fila", "Frame results");
      await a.marcar("fila", "Frame results", "Momento 3-3: el diagrama, con su valor en cada tramo.");
      await a.quieto(4, 300);
      await a.elegir("Frame results", "Moment 3-3", 5000);
      console.log("    max M tras encender:", await a.maximo());
      await a.alzado();
      await a.sinCuadro(); await a.general(); await a.quieto(8, 300);
    },
  },
  {
    rotulo: "4 · Una FUERZA: la carga lateral",
    hacer: async (a) => {
      // «Cargas» es la ÚLTIMA carpeta del panel y su fila «Ex lateral» no llega a
      // verse aun abierta (queda bajo la barra de órdenes). Se señala la carpeta,
      // que sí se ve, y el cambio se lee en la escala de colores.
      await a.cerca("carpeta", "Cargas");
      await a.marcar("carpeta", "Cargas", "Cargas: la lateral en el tope, de 30 a 120 kN.");
      await a.quieto(4, 300);
      await a.param("Ex lateral", "Ex", 120, 5000);
      console.log("    max M tras Ex 120:", await a.maximo());
      await a.alzado();
      await a.sinCuadro(); await a.general(); await a.quieto(9, 300);
    },
  },
  {
    rotulo: "5 · Una LONGITUD: el ancho del vano",
    hacer: async (a) => {
      await a.abrir("Geometría");
      await a.cerca("fila", "Ancho vano");
      await a.marcar("fila", "Ancho vano", "De 5 a 9 metros: el pórtico se rehace, y el diagrama con él.");
      await a.quieto(4, 300);
      await a.param("Ancho vano", "width", 9, 5000);
      console.log("    max M tras vano 9:", await a.maximo());
      await a.alzado();
      await a.sinCuadro(); await a.general(); await a.quieto(9, 300);
    },
  },
  {
    rotulo: "6 · Una SECCIÓN: el canto de la viga",
    hacer: async (a) => {
      await a.abrir("Secciones");
      await a.cerca("fila", "h viga");
      await a.marcar("fila", "h viga", "De 50 a 80 cm de canto: la viga toma más momento que las columnas.");
      await a.quieto(4, 300);
      await a.param("h viga", "vigaH", 0.8, 5000);
      console.log("    max M tras h viga 0.8:", await a.maximo());
      await a.alzado();
      await a.sinCuadro(); await a.general(); await a.quieto(9, 300);
    },
  },
  {
    rotulo: "7 · Y el mismo diagrama, en 2D",
    hacer: async (a) => {
      await a.general();
      await a.cerca("boton", "Ver diagrama en 2D");
      await a.marcar("boton", "Ver diagrama en 2D", "El alzado, plano, con solo el diagrama y sus valores.");
      await a.quieto(4, 300);
      await a.sinCuadro();
      await a.pulsar("Ver diagrama en 2D", 2500);
      await a.general(); await a.quieto(16, 300);
    },
  },
];
