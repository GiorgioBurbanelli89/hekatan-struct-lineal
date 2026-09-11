/**
 * Capítulo 3 — Un edificio: cómo se elige QUÉ pórtico ver, y el gráfico de una barra.
 *
 * Jorge (11-sep-2026): «¿cómo elijo qué pórtico plano quiero ver? … en pórticos planos
 * que son varios no sé cómo eliges». Respuesta en vídeo: la vista 2D nombra cada pórtico
 * («Pórtico 2 · y = 5 m»), las flechas pasan de uno a otro, el plano cambia la dirección,
 * y un clic en una barra da su gráfico (el «Diagram for Frame Object» de ETABS).
 *
 * Una sola vista, como el capítulo 2.
 */
import { barra2d } from "./_barras2d.mjs";

export const titulo = "Hekatan Struct · pórtico a pórtico, barra a barra";
export const ejemplo = "edificio-frame-nec";

export const pasos = [
  {
    rotulo: "1 · Un edificio y su diagrama de momentos",
    hacer: async (a) => {
      await a.ajuste("deformedShape", false);
      await a.general(); await a.quieto(3, 300);
      await a.marcar("fila", "Frame results", "Momento 3-3, en todo el edificio.");
      await a.quieto(2, 300);
      await a.elegir("Frame results", "Moment 3-3", 4000);
      await a.sinCuadro(); await a.quieto(6, 300);
    },
  },
  {
    rotulo: "2 · En 3D se cruzan: la vista 2D",
    hacer: async (a) => {
      await a.marcar("boton", "Ver diagrama en 2D", "Un pórtico solo, plano, con sus valores.");
      await a.quieto(2, 300);
      await a.sinCuadro();
      await a.pulsar("Ver diagrama en 2D", 2500);
      await a.quieto(6, 300);
    },
  },
  {
    rotulo: "3 · Cada pórtico, con su número y su cota",
    hacer: async (a) => {
      await a.marcarSel("#hk-diagrama-2d .hk-d2-en", "Pórtico 1, en y = 0: la fachada de delante.");
      await a.quieto(6, 300);
      await a.sinCuadro();
    },
  },
  {
    rotulo: "4 · Las flechas: al pórtico siguiente",
    hacer: async (a) => {
      await a.pulsar("#hk-diagrama-2d .hk-d2-sig", 1500, "sel");
      await a.marcarSel("#hk-diagrama-2d .hk-d2-tit", "Pórtico 2: el del medio, en y = 5 m.");
      await a.quieto(4, 300);
      await a.sinCuadro();
      await a.pulsar("#hk-diagrama-2d .hk-d2-sig", 1500, "sel");
      await a.quieto(4, 300);
    },
  },
  {
    rotulo: "5 · El plano: la otra dirección o una planta",
    hacer: async (a) => {
      // Solo se señala: en este edificio la carga es en X, y en el alzado YZ el M3 de
      // las columnas trabaja en el otro plano — la vista lo deja sin dibujar, como ETABS.
      await a.marcarSel("#hk-diagrama-2d .hk-d2-plano", "Alzado XZ, alzado YZ o planta XY.");
      await a.quieto(7, 300);
      await a.sinCuadro(); await a.quieto(2, 300);
    },
  },
  {
    rotulo: "6 · Clic en una columna: su gráfico",
    hacer: async (a) => {
      const r = await barra2d(a.pag, "columna");
      await a.marcarR(r, "La columna de abajo, en la esquina.");
      await a.quieto(2, 300);
      await a.sinCuadro();
      await a.pulsarR(r, 1800);
      await a.quieto(3, 300);
      await a.marcarSel("#hk-diagrama-barra .hk-b-cuerpo", "Axil, cortante y momento, de la base al primer piso.");
      await a.quieto(7, 300);
      await a.sinCuadro(); await a.quieto(3, 300);
    },
  },
  {
    rotulo: "7 · Otra barra, otro gráfico",
    hacer: async (a) => {
      const r = await barra2d(a.pag, "viga");
      await a.marcarR(r, "Una viga: el cortante constante y el momento cambia de signo.");
      await a.quieto(2, 300);
      await a.sinCuadro();
      await a.pulsarR(r, 1800);
      await a.quieto(8, 300);
    },
  },
];
