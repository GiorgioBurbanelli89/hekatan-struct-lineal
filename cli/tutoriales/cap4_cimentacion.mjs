/**
 * Capítulo 4 — Cimentación: una zapata aislada sobre el suelo, y su archivo para SAFE.
 *
 * Todo con el ratón, como lo haría una persona (Jorge, 11-sep-2026): menú → Ejemplos →
 * categoría → ejemplo; el tipo de suelo en su desplegable; las dimensiones escritas en
 * su casilla; y el botón «Exportar F2K» — el archivo que sale se enseña en pantalla.
 */
export const titulo = "Hekatan Struct · cimentación: la zapata aislada";
export const ruta = "workspace/";

const calculados = (a) => a.pag.evaluate(() => {
  const out = {};
  document.querySelectorAll("#hk-pane-host .tp-lblv").forEach((x) => {
    const l = (x.querySelector(".tp-lblv_l")?.textContent || "").trim();
    if (/σ|q_max|q_adm|ratio|w_max|k_r/i.test(l)) out[l] = [...x.querySelectorAll("input")].map((i) => i.value).join("|");
  });
  return out;
});

export const pasos = [
  {
    rotulo: "Portada",
    hacer: async (a) => { await a.portada("Cimentación: la zapata aislada", "Capítulo 4", 16); },
  },
  {
    rotulo: "1 · Desde el menú: la zapata aislada",
    hacer: async (a) => {
      await a.general(); await a.quieto(2, 300);
      await a.pulsar("Ejemplos", 5000);
      await a.elegir("Categoría", "Cimentaciones (4", 4000);
      await a.elegir("Ejemplo", "Zapata Aislada (Ecuador", 8000);
      await a.quieto(4, 300);
      console.log("    al abrir:", JSON.stringify(await calculados(a)));
    },
  },
  {
    rotulo: "2 · Lo que se ve: la placa sobre resortes y la presión del suelo",
    hacer: async (a) => {
      await a.marcarSel("#legend", "La presión bajo la zapata, en tonf/m².");
      await a.quieto(6, 300);
      await a.sinCuadro(); await a.quieto(2, 300);
    },
  },
  {
    rotulo: "3 · El suelo: de su desplegable",
    hacer: async (a) => {
      await a.marcar("fila", "Tipo de suelo", "El tipo de suelo trae su q admisible y su módulo de balasto.");
      await a.quieto(3, 300);
      await a.elegir("Tipo de suelo", "Arcilla blanda", 5000);
      await a.abrir("Calculados");
      const c = await calculados(a);
      console.log("    arcilla blanda:", JSON.stringify(c));
      const fila = Object.keys(c).find((k) => /q\/q_adm/i.test(k));
      if (fila) await a.marcar("fila", fila, "La presión contra el admisible.");
      await a.quieto(6, 300);
      await a.sinCuadro();
    },
  },
  {
    rotulo: "4 · Más grande: la planta de la zapata",
    hacer: async (a) => {
      await a.abrir("Parámetros");
      await a.param("Lz", "Lz", 3.5, 3500);
      await a.param("Bz", "Bz", 3.5, 5000);
      const c = await calculados(a);
      console.log("    3.5 x 3.5:", JSON.stringify(c));
      await a.abrir("Calculados");
      const fila = Object.keys(c).find((k) => /q\/q_adm/i.test(k));
      if (fila) await a.marcar("fila", fila, "Con más área, la presión baja.");
      await a.quieto(6, 300);
      await a.sinCuadro();
    },
  },
  {
    rotulo: "5 · Para SAFE: exportar el .f2k",
    hacer: async (a) => {
      await a.abrir("SAFE");
      await a.marcar("boton", "Exportar F2K", "El mismo modelo, para abrirlo en SAFE.");
      await a.quieto(2, 300);
      await a.sinCuadro();
      await a.pulsar("Exportar F2K", 1500);
      await a.dialogo(8);                        // el aviso que ve la persona, y su Aceptar
      const f = await a.archivo("Nudos, losa, resortes y cargas: tabla por tabla.",
        { lineas: 22, marcas: ["TABLE:"], buscar: "COORDINATES" });
      if (f) console.log("    archivo:", f.nombre, f.lineas, "lineas");
      await a.quieto(9, 300);
      await a.sinArchivo(); await a.quieto(2, 300);
    },
  },
];
