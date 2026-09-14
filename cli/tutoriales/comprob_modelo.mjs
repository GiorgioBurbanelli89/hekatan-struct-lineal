// Comprobación de un modelo compartido por ENLACE: lo que ve quien lo abre (el jefe, un
// colega): el modelo, el modal ya corrido con su tabla de participación, la deformada del
// caso Dead y la casilla «Animar» para cualquier caso. Todo con el cursor.
//
//   HK_CODIGO=7nF68EUiy5UVJuli HK_MODOS=80 HK_TITULO="Bóveda de la capilla" \
//     node cli/tutorial_struct.mjs comprob_modelo
const CODIGO = process.env.HK_CODIGO || "7nF68EUiy5UVJuli";
const MODOS = process.env.HK_MODOS || "12";
const NOMBRE = process.env.HK_TITULO || "Bóveda de la capilla";

export const ruta = `workspace/?m=${CODIGO}&modal=${MODOS}`;
export const titulo = `Hekatan Struct · ${NOMBRE} · comprobado contra SAP2000 y ETABS`;

export const pasos = [
  {
    rotulo: "1 · Portada",
    hacer: async (a) => { await a.portada(NOMBRE, "Comprobación · Hekatan Struct contra SAP2000 y ETABS", 14); },
  },
  {
    rotulo: "2 · El enlace abre el modelo con el modal ya corrido",
    hacer: async (a) => {
      // el enlace corre el modal solo (&modal=N); se espera a que la tabla esté
      await a.pag.waitForFunction(() => !!document.getElementById("modal-results")?.innerText?.includes("MODAL"), { timeout: 120000 }).catch(() => {});
      await a.general();
      await a.quieto(14, 300);
    },
  },
  {
    rotulo: "3 · Case results: el modo que se anima",
    hacer: async (a) => {
      await a.elegir("Case results", "◈ Modo 2 ", 3500);
      await a.quieto(8, 300);
      await a.elegir("Case results", "◈ Modo 1 ", 3500);
      await a.quieto(6, 300);
    },
  },
  {
    rotulo: "4 · Caso Dead: la deformada estática",
    hacer: async (a) => {
      await a.elegir("Case results", "Dead", 4000);
      await a.quieto(8, 300);
    },
  },
  {
    rotulo: "5 · Animar: para cualquier caso, no solo el modal",
    hacer: async (a) => {
      await a.casilla("Animar", 1500);
      await a.quieto(14, 300);
      await a.casilla("Animar", 1200);
      await a.quieto(3, 300);
    },
  },
];
