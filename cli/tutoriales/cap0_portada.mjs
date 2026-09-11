/**
 * Capítulo 0 — La pantalla principal: DÓNDE SE ELIGE con qué trabajar.
 *
 * Es la que sale al abrir el deploy sin nada en la URL (`/workspace/` sin `?t=`): el
 * lienzo vacío en medio y, a la derecha, «¿Con qué vas a trabajar?». La primera
 * versión de este capítulo se grabó sobre `inicio/index.html`, una portada de tres
 * tarjetas que NO es la principal — Jorge: «esa no es la principal, esta es la
 * principal».
 */
export const titulo = "Hekatan Struct · la pantalla principal";
export const ruta = "workspace/";

export const pasos = [
  {
    rotulo: "1 · La pantalla principal",
    hacer: async (a) => { await a.general(); await a.quieto(12, 300); },
  },
  {
    rotulo: "2 · ¿Con qué vas a trabajar?",
    hacer: async (a) => {
      await a.cerca("carpeta", "Con qué vas a trabajar");
      await a.marcar("carpeta", "Con qué vas a trabajar",
        "Todo empieza aquí: se elige con qué se trabaja, y recién ahí se abren las herramientas.");
      await a.quieto(10, 300);
    },
  },
  {
    rotulo: "3 · Archivo existente",
    hacer: async (a) => {
      await a.marcar("boton", "Archivo existente",
        "Abrir un modelo guardado (.heks), o uno que viene de ETABS o SAP2000 (.e2k, .s2k).");
      await a.quieto(10, 300);
    },
  },
  {
    rotulo: "4 · Ejemplos",
    hacer: async (a) => {
      await a.marcar("boton", "Ejemplos",
        "El catálogo por categorías: zapatas, placas, cáscaras, pórticos, edificios.");
      await a.quieto(10, 300);
    },
  },
  {
    rotulo: "5 · Nuevo modelo · Plantillas",
    hacer: async (a) => {
      await a.cerca("carpeta", "Nuevo modelo");
      await a.marcar("carpeta", "Nuevo modelo",
        "Un modelo nuevo no se empieza en blanco: se parte de una plantilla y se ajusta.");
      await a.quieto(9, 300);
    },
  },
  {
    rotulo: "6 · Las plantillas",
    hacer: async (a) => {
      await a.marcar("boton", "Pórtico 3D", "Pórtico 3D: columnas y vigas, sin losa.");
      await a.quieto(6, 300);
      await a.marcar("boton", "Pórtico + losa + muros", "El dual: pórtico, losa y muros de corte.");
      await a.quieto(6, 300);
      await a.marcar("boton", "Lienzo en blanco", "Y el lienzo en blanco, para dibujar a mano.");
      await a.quieto(6, 300);
    },
  },
  {
    rotulo: "7 · Se elige, y el modelo aparece",
    hacer: async (a) => {
      await a.sinCuadro(); await a.general();
      await a.pulsar("Pórtico + losa + muros", 11000);
      await a.quieto(12, 300);
    },
  },
];
