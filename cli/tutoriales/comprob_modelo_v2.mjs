// Comprobación de un modelo por ENLACE, con la interfaz de Settings del 13-sep-2026 (como ETABS):
// «Resultado» = Case / Combo / Mode · «Modo» = el número de modo · «🎞 Animar» una sola casilla.
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
    rotulo: "3 · Resultado = Mode: al pasar de modo SIGUE vibrando",
    hacer: async (a) => {
      // ⚠️ El TEXTO EXACTO de la opción: `elegir` busca primero la igual y si no la que CONTIENE.
      // Con «2 » a secas cogía «1 (T = 0.2478 s)» (lleva un 2) y el modo 2 salía como modo 1.
      await a.elegir("Modo", "2  (T = 0.1451 s)", 3000);
      await a.quieto(10, 300);
      await a.elegir("Modo", "3  (T = 0.1174 s)", 3000);
      await a.quieto(10, 300);
    },
  },
  {
    rotulo: "4 · Resultado = Case · Dead, animando",
    hacer: async (a) => {
      await a.elegir("Resultado", "Case", 4000);
      await a.quieto(4, 300);
      await a.elegir("Case", "Dead", 4000);
      await a.quieto(12, 300);
    },
  },
  {
    rotulo: "5 · Vuelta a Mode · modo 1",
    hacer: async (a) => {
      await a.elegir("Resultado", "Mode", 4000);
      await a.quieto(3, 300);
      await a.elegir("Modo", "1  (T = 0.2478 s)", 3000);
      await a.quieto(12, 300);
    },
  },
];
