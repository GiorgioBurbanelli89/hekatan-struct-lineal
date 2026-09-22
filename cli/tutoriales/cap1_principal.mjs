/**
 * Capítulo 1 — La pantalla principal: con qué se trabaja (Nuevo modelo, Modelo existente,
 * Ejemplos). Rehecho el 11-sep-2026 en el formato de la serie: portada con el logo
 * cuadrado, una sola vista, todo con el ratón y subtítulo en inglés.
 *
 * Es la que sale al abrir `/workspace/` sin nada en la URL: el lienzo en medio y, a la
 * derecha, «¿Con qué vas a trabajar?» (Jorge: «esa no es la principal, esta es la principal»).
 */
export const titulo = "Hekatan Struct · la pantalla principal";
export const ruta = "workspace/";

export const pasos = [
  {
    rotulo: "Portada",
    hacer: async (a) => { await a.portada("La pantalla principal: con qué vas a trabajar", "Capítulo 1", 16); },
  },
  {
    rotulo: "1 · La pantalla principal",
    hacer: async (a) => { await a.general(); await a.quieto(8, 300); },
  },
  {
    rotulo: "2 · ¿Con qué vas a trabajar?",
    hacer: async (a) => {
      await a.marcar("carpeta", "Con qué vas a trabajar", "Todo empieza aquí: se elige con qué se trabaja.");
      await a.quieto(8, 300);
    },
  },
  {
    rotulo: "3 · Modelo existente",
    hacer: async (a) => {
      await a.marcar("boton", "Archivo existente",
        "Abrir un modelo guardado (.heks) o uno de ETABS, SAP2000 o SAFE (.e2k, .s2k, .f2k).");
      await a.quieto(9, 300);
    },
  },
  {
    rotulo: "4 · Ejemplos",
    hacer: async (a) => {
      await a.marcar("boton", "Ejemplos",
        "El catálogo por categorías: pórticos, edificios, losas, muros, zapatas y sólidos.");
      await a.quieto(9, 300);
    },
  },
  {
    rotulo: "5 · Nuevo modelo",
    hacer: async (a) => {
      await a.marcar("carpeta", "Nuevo modelo", "Un modelo nuevo parte de una plantilla y se ajusta.");
      await a.quieto(7, 300);
    },
  },
  {
    rotulo: "6 · Las plantillas",
    hacer: async (a) => {
      await a.marcar("boton", "Pórtico 3D", "Pórtico 3D: columnas y vigas, sin losa.");
      await a.quieto(5, 300);
      await a.marcar("boton", "Pórtico + losa + muros", "El dual: pórtico, losa y muros de corte.");
      await a.quieto(5, 300);
      await a.marcar("boton", "Lienzo en blanco", "O el lienzo en blanco, para dibujar a mano.");
      await a.quieto(5, 300);
    },
  },
  {
    rotulo: "7 · Se elige, y el modelo aparece",
    hacer: async (a) => {
      await a.sinCuadro();
      await a.pulsar("Pórtico + losa + muros", 11000);
      await a.quieto(10, 300);
    },
  },
];
