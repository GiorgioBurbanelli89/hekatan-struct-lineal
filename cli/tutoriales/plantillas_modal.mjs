/**
 * Capítulo 1 — De cero a un edificio con losa y muros, y su modal.
 *
 * Lo que tiene que quedar claro al que mira: de dónde sale el modelo (una plantilla),
 * qué se toca para cambiarlo (los mandos, no un fichero), y que el modal se corre y
 * se VE, con su período y su dirección dominante.
 */
export const titulo = "Hekatan Struct · plantillas y modal";
export const ejemplo = "plantillas";

export const pasos = [
  {
    rotulo: "1 · La aplicacion: panel a la izquierda, modelo en medio, mandos a la derecha",
    hacer: async (a) => { await a.quieto(10, 300); },
  },
  {
    rotulo: "2 · La plantilla decide que se construye",
    hacer: async (a) => {
      await a.elegir("Plantilla", "Pórtico + losa + muros (dual)", 9000);
      await a.quieto(8, 300);
    },
  },
  {
    rotulo: "3 · Los mandos cambian el edificio, no un fichero: 4 -> 6 pisos",
    hacer: async (a) => { await a.param("nº de pisos", "pisos", 6, 9000); await a.quieto(8, 300); },
  },
  {
    rotulo: "4 · Y la rejilla en planta: la separacion en X",
    hacer: async (a) => { await a.param("separación X (m)", "sx", 7, 9000); await a.quieto(6, 300); },
  },
  {
    rotulo: "5 · «Correr modal + animar»: el edificio vibra en su primer modo",
    hacer: async (a) => { await a.pulsar("Correr modal", 16000); await a.quieto(24, 220); },
  },
  {
    rotulo: "6 · El periodo y la direccion dominante, en el panel",
    hacer: async (a) => { await a.quieto(14, 300); },
  },
  {
    rotulo: "7 · Y se pasa de un modo al siguiente",
    hacer: async (a) => {
      for (const m of [2, 3]) {
        await a.pag.evaluate((n) => {
          const fila = [...document.querySelectorAll(".tp-lblv")]
            .find((x) => ((x.querySelector(".tp-lblv_l") || {}).textContent || "").includes("Modo #"));
          const i = fila && fila.querySelector("input");
          if (!i) return;
          const set = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
          set.call(i, String(n));
          i.dispatchEvent(new Event("input", { bubbles: true }));
          i.dispatchEvent(new Event("change", { bubbles: true }));
        }, m);
        await a.espera(900);
        await a.quieto(10, 240);
      }
    },
  },
];
