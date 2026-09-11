/**
 * Capítulo 10 — Una zapata DIBUJADA desde Archivo Nuevo: se dibuja el rectángulo
 * (área), se le da MALLA y SUELO (Winkler), y sale el mapa de presión de contacto.
 * El dibujo se inyecta por los globals del lienzo (equivale a dibujar el rectángulo
 * y poner la carga en el centro), para que el vídeo sea reproducible.
 */
export const titulo = "Hekatan Struct · una zapata dibujada";
export const ruta = "workspace/?t=new-blank";

const dibujar = async (a) => {
  await a.pag.evaluate(() => {
    window.__hekatanDrawingPoints = [[0,0,0],[3.45,0,0],[3.45,3.45,0],[0,3.45,0],[1.725,1.725,0]];
    window.__hekatanDrawingPolylines = [[0,1,2,3,0]];
    window.__hekatanDrawingAreas = [0];
    window.__hekatanManualLoads = new Map([[4,[0,0,-1187,0,0,0]]]);
    try { window.__hekatanRebuild && window.__hekatanRebuild(); } catch (e) {}
  });
};
const setP = async (a, clave, val) => {
  await a.pag.evaluate((q) => { try { window.__hekatanSetParam && window.__hekatanSetParam(q.c, q.v); } catch(e){} }, { c: clave, v: val });
};
const hover = async (a, px, py, n = 8) => {
  await a.pag.mouse.move(px, py, { steps: 16 });
  await a.pag.evaluate((q) => { if (window.__tutCursor) window.__tutCursor(q.x, q.y); window.__tutXY = q; }, { x: px, y: py });
  await a.quieto(n, 320);
};

export const pasos = [
  {
    rotulo: "Portada",
    hacer: async (a) => { await a.portada("Una zapata dibujada", "Capítulo 10", 16); },
  },
  {
    rotulo: "1 · Dibujamos el rectángulo de la zapata",
    hacer: async (a) => {
      // Cerrar la ventana de ayuda «Cómo usar» que tapa el visor en un archivo nuevo.
      await a.pag.evaluate(() => {
        try { window.__hekatanRibbon && window.__hekatanRibbon.guia && window.__hekatanRibbon.guia(false); } catch (e) {}
        try { localStorage.setItem("hk_guia_nuevo", "0"); } catch (e) {}
      });
      await a.general(); await a.quieto(2, 300);
      await dibujar(a);
      await a.quieto(5, 350);
    },
  },
  {
    rotulo: "2 · Le damos MALLA al área dibujada",
    hacer: async (a) => {
      await setP(a, "mallaZapata", 6);
      await a.quieto(6, 350);
    },
  },
  {
    rotulo: "3 · Y el SUELO: Winkler con su ks",
    hacer: async (a) => {
      await setP(a, "ksSuelo", 2920);
      await a.elegir("Shell results", "Pressure", 6000);
      await a.quieto(4, 320);
    },
  },
  {
    rotulo: "4 · La presión de contacto en el cursor",
    hacer: async (a) => {
      await a.general(); await a.quieto(2, 300);
      await hover(a, 640, 380, 8);
    },
  },
  {
    rotulo: "5 · Otro punto",
    hacer: async (a) => {
      await hover(a, 560, 440, 8);
    },
  },
];
