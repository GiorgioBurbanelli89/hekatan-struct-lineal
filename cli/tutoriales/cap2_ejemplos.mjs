/**
 * Capítulo 2 — Entrar a los Ejemplos y cambiar fuerzas, longitudes y secciones.
 *
 * Se usa «Pórtico 2D (un piso)» porque tiene los tres tipos de mando separados en
 * carpetas, que es justo lo que hay que enseñar: GEOMETRÍA (ancho del vano, altura),
 * SECCIONES (b y h de columna y viga) y CARGAS (muerta, viva, lateral). Y es un
 * pórtico de un piso: cada cambio se ve a simple vista en el diagrama de momentos.
 *
 * UNA SOLA VISTA (Jorge, 11-sep-2026: «agrandas la pantalla y disminuyes, déjala una
 * sola»). La versión anterior alternaba primer plano y vista general en cada paso y
 * mareaba. Aquí todo va sobre la ventana entera: el cuadro y la nota dicen dónde mirar.
 */
import { barra2d } from "./_barras2d.mjs";

export const titulo = "Hekatan Struct · los ejemplos, mando a mando";
export const ruta = "workspace/";

export const pasos = [
  {
    rotulo: "Portada",
    hacer: async (a) => { await a.portada("Los ejemplos, mando a mando", "Capítulo 2", 16); },
  },
  {
    rotulo: "1 · Desde la pantalla principal, Ejemplos",
    hacer: async (a) => {
      await a.general(); await a.quieto(4, 300);
      await a.marcar("boton", "Ejemplos", "El catálogo: modelos ya montados, con sus mandos.");
      await a.quieto(5, 300);
      await a.sinCuadro();
      await a.pulsar("Ejemplos", 5000);
      await a.quieto(4, 300);
    },
  },
  {
    rotulo: "2 · Se elige la categoría y el ejemplo",
    hacer: async (a) => {
      await a.marcar("fila", "Categoría", "Primero la familia: pórticos planos.");
      await a.quieto(3, 300);
      await a.elegir("Categoría", "Pórtico plano", 4000);
      await a.marcar("fila", "Ejemplo", "Y dentro, el ejemplo: un pórtico de un piso.");
      await a.quieto(3, 300);
      await a.elegir("Ejemplo", "Pórtico 2D (un piso)", 7000);
      await a.sinCuadro(); await a.quieto(2, 300);
    },
  },
  {
    rotulo: "2b · Sin deformada y de frente",
    hacer: async (a) => {
      // La deformada viene exagerada y un pórtico plano en isométrica no se lee: se
      // apaga la deformada y se mira de FRENTE — con el ratón, en sus controles
      // (Jorge: si la vista cambia, se tiene que ver cómo).
      await a.casilla("Deformed shape");
      await a.vista("Elevación X (frente)", 1500);
      await a.quieto(5, 300);
    },
  },
  {
    rotulo: "3 · Para ver lo que cambia: el diagrama de momentos",
    hacer: async (a) => {
      await a.marcar("fila", "Frame results", "Momento 3-3: el diagrama, con su valor en cada tramo.");
      await a.quieto(3, 300);
      await a.elegir("Frame results", "Moment 3-3", 5000);
      console.log("    max M tras encender:", await a.maximo());
      await a.sinCuadro(); await a.quieto(7, 300);
    },
  },
  {
    rotulo: "4 · Una FUERZA: la carga lateral",
    hacer: async (a) => {
      // «Cargas» es la ÚLTIMA carpeta del panel: se abre (eso la sube a un tercio de
      // altura) y se señala su fila; si aun así no asoma, la carpeta.
      await a.abrir("Cargas");
      if (!(await a.marcar("fila", "Ex lateral", "La carga lateral en el tope: de 30 a 120 kN.")))
        await a.marcar("carpeta", "Cargas", "Cargas: la lateral en el tope, de 30 a 120 kN.");
      await a.quieto(3, 300);
      await a.param("Ex lateral", "Ex", 120, 5000);
      console.log("    max M tras Ex 120:", await a.maximo());
      await a.sinCuadro(); await a.quieto(8, 300);
    },
  },
  {
    rotulo: "5 · Una LONGITUD: el ancho del vano",
    hacer: async (a) => {
      await a.abrir("Geometría");
      await a.marcar("fila", "Ancho vano", "De 5 a 9 metros: el pórtico se rehace, y el diagrama con él.");
      await a.quieto(3, 300);
      await a.param("Ancho vano", "width", 9, 5000);
      console.log("    max M tras vano 9:", await a.maximo());
      await a.sinCuadro(); await a.quieto(8, 300);
    },
  },
  {
    rotulo: "6 · Una SECCIÓN: el canto de la viga",
    hacer: async (a) => {
      await a.abrir("Secciones");
      await a.marcar("fila", "h viga", "De 50 a 80 cm de canto: la viga toma más momento que las columnas.");
      await a.quieto(3, 300);
      await a.param("h viga", "vigaH", 0.8, 5000);
      console.log("    max M tras h viga 0.8:", await a.maximo());
      await a.sinCuadro(); await a.quieto(8, 300);
    },
  },
  {
    rotulo: "7 · Y el mismo diagrama, en 2D",
    hacer: async (a) => {
      await a.marcar("boton", "Ver diagrama en 2D", "El alzado, plano, con solo el diagrama y sus valores.");
      await a.quieto(3, 300);
      await a.sinCuadro();
      await a.pulsar("Ver diagrama en 2D", 2500);
      await a.quieto(10, 300);
    },
  },
  {
    rotulo: "8 · Clic en la viga: su gráfico",
    hacer: async (a) => {
      const r = await barra2d(a.pag, "viga");
      await a.marcarR(r, "Clic en una barra: su gráfico, de nudo a nudo.");
      await a.quieto(3, 300);
      await a.sinCuadro();
      await a.pulsarR(r, 1800);
      await a.quieto(4, 300);
      await a.marcarSel("#hk-diagrama-barra .hk-b-cuerpo", "Axil, cortante y momento a lo largo de la viga.");
      await a.quieto(8, 300);
      await a.sinCuadro(); await a.quieto(4, 300);
    },
  },
];
