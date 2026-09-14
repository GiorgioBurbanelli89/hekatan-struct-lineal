// Comprobación de un modelo por ENLACE con Settings como SAP2000 (14-sep-2026):
// «Resultado» = Case | Combo (solo UNO activo) · Case: Modal, Dead, Live… · con Modal aparece «Modo».
// v2 del vídeo de la bóveda: en la v1 la animación se congelaba al pasar de modo (Jorge).
//
//   HK_CODIGO=7nF68EUiy5UVJuli HK_MODOS=80 HK_TITULO="Bóveda de la capilla" \
//     node cli/tutorial_struct.mjs comprob_modelo_v2
const CODIGO = process.env.HK_CODIGO || "7nF68EUiy5UVJuli";
const MODOS = process.env.HK_MODOS || "80";
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
      await a.pag.waitForFunction(() => !!document.getElementById("modal-results")?.innerText?.includes("MODAL"), { timeout: 180000 }).catch(() => {});
      await a.general();
      await a.quieto(14, 300);
    },
  },
  {
    rotulo: "3 · Case = Modal: al pasar de modo SIGUE vibrando",
    hacer: async (a) => {
      // ⚠️ texto EXACTO de la opción («2 » a secas cogía «1 (T = 0.2478 s)», que lleva un 2)
      await a.elegir("Modo", "2  (T = 0.1451 s)", 3000);
      await a.quieto(10, 300);
      await a.elegir("Modo", "3  (T = 0.1174 s)", 3000);
      await a.quieto(10, 300);
    },
  },
  {
    rotulo: "4 · Case = Dead y Combo = 1.4D, animando",
    hacer: async (a) => {
      await a.elegir("Case", "Dead", 4000);
      await a.quieto(10, 300);
      await a.elegir("Resultado", "Combo", 3500);
      await a.quieto(3, 300);
      await a.elegir("Combo", "1.4D", 4000);
      await a.quieto(10, 300);
    },
  },
  {
    rotulo: "5 · Vuelta a Case = Modal · modo 1",
    hacer: async (a) => {
      await a.elegir("Resultado", "Case", 3500);
      await a.quieto(3, 300);
      await a.elegir("Case", "Modal", 4000);
      await a.quieto(3, 300);
      await a.elegir("Modo", "1  (T = 0.2478 s)", 3000);
      await a.quieto(12, 300);
    },
  },
];
