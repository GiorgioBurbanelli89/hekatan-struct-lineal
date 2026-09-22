/**
 * Capítulo 8 — Del edificio 3D a la cimentación (como ETABS manda a SAFE).
 * Se carga un edificio ya calculado; sus columnas bajan las cargas a la base, y
 * con «Calcular y ver cimentación» se diseñan las zapatas desde las reacciones y
 * se ve la presión de contacto. Igual que exportar de ETABS a SAFE.
 */
export const titulo = "Hekatan Struct · del edificio 3D a la cimentación";
export const ruta = "workspace/?t=edificio-aporticado";

const hover = async (a, px, py, n = 8) => {
  await a.pag.mouse.move(px, py, { steps: 16 });
  await a.pag.evaluate((q) => { if (window.__tutCursor) window.__tutCursor(q.x, q.y); window.__tutXY = q; }, { x: px, y: py });
  await a.quieto(n, 320);
};

export const pasos = [
  {
    rotulo: "Portada",
    hacer: async (a) => { await a.portada("Del edificio 3D a la cimentación", "Capítulo 8", 16); },
  },
  {
    rotulo: "1 · El edificio 3D ya calculado",
    hacer: async (a) => {
      await a.general(); await a.quieto(5, 320);
    },
  },
  {
    rotulo: "2 · Calcular y ver la cimentación",
    hacer: async (a) => {
      // El botón vive muy abajo en el panel (fuera de vista); se dispara por el DOM.
      const ok = await a.pag.evaluate(() => {
        const b = [...document.querySelectorAll("button, .tp-btnv_b")]
          .find((x) => /Calcular y ver cimentaci/i.test(x.textContent || ""));
        if (b) { b.click(); return true; }
        return false;
      });
      console.log("    boton cimentacion:", ok ? "clic OK" : "NO encontrado");
      await a.quieto(8, 380);   // deja que diseñe y dibuje las zapatas
    },
  },
  {
    rotulo: "3 · La presión de contacto en cada zapata",
    hacer: async (a) => {
      await a.general(); await a.quieto(2, 300);
      await hover(a, 640, 380, 8);
    },
  },
  {
    rotulo: "4 · Otra zapata",
    hacer: async (a) => {
      await hover(a, 560, 430, 8);
    },
  },
  {
    rotulo: "5 · Y se exporta a SAFE (.f2k)",
    hacer: async (a) => {
      await a.marcar("boton", "Exportar F2K cimentación",
        "El mismo modelo, listo para abrir en SAFE.");
      await a.quieto(5, 320); await a.sinCuadro();
    },
  },
];
