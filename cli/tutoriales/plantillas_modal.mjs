/**
 * Capítulo 1 — De una plantilla a su modal, menú a menú.
 *
 * Alterna VISTA GENERAL (se ve dónde está todo) con PRIMER PLANO del mando del que se
 * habla (recorte 1:1, para que se lea). Cada paso deja su rótulo en `pasos.json`, que
 * es lo que usa el guion de voz para cuadrar con la imagen.
 */
export const titulo = "Hekatan Struct · de una plantilla a su modal";
export const ejemplo = "plantillas";

export const pasos = [
  {
    rotulo: "1 · Las tres zonas de la pantalla",
    hacer: async (a) => { await a.general(); await a.quieto(10, 300); },
  },
  {
    rotulo: "2 · A la izquierda, los resultados",
    hacer: async (a) => {
      await a.cerca("fila", "Case results");
      await a.marcar("fila", "Case results", "Aquí se calcula y aquí se lee: deformada, esfuerzos, modal.");
      await a.quieto(9, 300);
    },
  },
  {
    rotulo: "3 · A la derecha, lo que define el modelo",
    hacer: async (a) => {
      await a.cerca("fila", "Plantilla");
      await a.marcar("fila", "Plantilla", "La plantilla decide qué se construye: pórtico, con losa, arriostrado o dual.");
      await a.quieto(9, 300);
    },
  },
  {
    rotulo: "4 · Se elige el dual: pórtico + losa + muros",
    hacer: async (a) => {
      await a.elegir("Plantilla", "Pórtico + losa + muros (dual)", 9000);
      await a.sinCuadro(); await a.general(); await a.quieto(8, 300);
    },
  },
  {
    rotulo: "5 · El número de pisos es un mando",
    hacer: async (a) => {
      await a.cerca("fila", "nº de pisos");
      await a.marcar("fila", "nº de pisos", "De cuatro pisos a seis: la estructura se rehace entera.");
      await a.quieto(5, 300);
      await a.param("nº de pisos", "pisos", 6, 9000);
      await a.sinCuadro(); await a.general(); await a.quieto(8, 300);
    },
  },
  {
    rotulo: "6 · Y la rejilla en planta",
    hacer: async (a) => {
      // ⚠️ «separación X (m)» vive dentro de «Rejilla (planta)», que arranca plegada,
      // y aun abriéndola queda fuera del trozo visible del panel: su rectángulo mide
      // 0×0 y el primer plano se iba a negro. Este paso se cuenta en la VISTA GENERAL,
      // que además es donde se aprecia lo que importa: la planta creciendo.
      await a.general();
      await a.abrir("Rejilla (planta)");
      await a.quieto(4, 300);
      await a.param("separación X (m)", "sx", 7.5, 9000);
      await a.sinCuadro(); await a.quieto(8, 300);
    },
  },
  {
    rotulo: "7 · Correr modal + animar",
    hacer: async (a) => {
      await a.cerca("boton", "Correr modal");
      await a.marcar("boton", "Correr modal", "Un botón: saca los modos y anima el primero.");
      await a.quieto(5, 300);
      await a.sinCuadro();
      await a.pulsar("Correr modal", 16000);
      await a.general(); await a.quieto(22, 220);
    },
  },
  {
    rotulo: "8 · Lo que hay que leer para revisar",
    hacer: async (a) => {
      await a.cerca("fila", "Período");
      await a.marcar("fila", "Período", "Período y dirección dominante: con eso se compara contra ETABS o SAP2000.");
      await a.quieto(12, 300);
    },
  },
  {
    rotulo: "9 · Y de aquí sale el fichero de CSI",
    hacer: async (a) => {
      await a.sinCuadro(); await a.general(); await a.quieto(10, 260);
    },
  },
];
