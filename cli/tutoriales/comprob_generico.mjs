// Comprobación de CUALQUIER modelo por enlace (?m=código), Settings como SAP2000 (Resultado = Case | Combo;
// Case: Modal, Dead, Live…; con Modal aparece «Modo»). A diferencia de comprob_modelo_v2 NO lleva los
// periodos escritos: lee del menú el texto EXACTO de cada modo (con «2 » a secas se cogía «1 (T = 0.2478 s)»).
//
//   HK_CODIGO=UePx9ALhS7Re3kG HK_MODOS=12 HK_TITULO="Muro de corte 6 x 6 m" \
//     node cli/tutorial_struct.mjs comprob_generico
const CODIGO = process.env.HK_CODIGO || "7nF68EUiy5UVJuli";
const MODOS = process.env.HK_MODOS || "12";
const NOMBRE = process.env.HK_TITULO || "Modelo";

export const ruta = `workspace/?m=${CODIGO}&modal=${MODOS}`;
export const titulo = `Hekatan Struct · ${NOMBRE} · comprobado contra SAP2000 y ETABS`;

/** El texto exacto de la opción n (0 = primera) de la lista con esa etiqueta. */
const opcion = (a, etiqueta, n) => a.pag.evaluate((q) => {
  const f = [...document.querySelectorAll(".tp-lblv")].find((e) => (e.querySelector(".tp-lblv_l")?.textContent ?? "").trim() === q.e);
  const o = f?.querySelector("select")?.options?.[q.n];
  return o ? o.textContent.trim() : null;
}, { e: etiqueta, n });

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
      for (const n of [1, 2]) {
        const t = await opcion(a, "Modo", n);
        if (t) { await a.elegir("Modo", t, 3000); await a.quieto(10, 300); }
      }
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
      const t = await opcion(a, "Modo", 0);
      if (t) await a.elegir("Modo", t, 3000);
      await a.quieto(12, 300);
    },
  },
];
