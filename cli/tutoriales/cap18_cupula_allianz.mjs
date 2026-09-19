// Tutorial 8 · Cúpula y cáscara del Allianz Arena, SOLO con la cinta de acceso rápido
// (19-sep-2026, Jorge: «debes usar solo acceso rápido»). La cúpula = un arco meridiano en
// el alzado, girado (Revolución). El Allianz = un contorno de planta con esquinas
// redondeadas barrido según un perfil de alzado (Barrido). Todo en paños Q4, como ETABS
// (contra ETABS: 0.09 % y 0.011 %).
import { mover, clicRojo, caja, rect, panel, proj, clicMundo, vista, orbita, estado,
         pestana, boton, senalar, encendido, casilla, ventana, acercarA, soltar, modeloInfo } from "./_cinta.mjs";
export const ruta = "workspace/?t=new-blank";
export const titulo = "Hekatan Struct · cúpula y cáscara del Allianz Arena";

// «Guía aux.» encendida (las curvas salen como guías y se borran al usarlas)
const guiaOn = async (a, txt) => {
  if (await encendido(a, "^┄ ?Guía aux")) await senalar(a, "^┄ ?Guía aux", txt || "Guía aux.: ya encendida.", 4);
  else await boton(a, "^┄ ?Guía aux", txt);
};

export const pasos = [
  { rotulo: "Portada", hacer: async (a) => { await a.portada("Cúpula y cáscara del Allianz Arena", "Tutorial 8", 16); } },
  {
    rotulo: "1 · Lienzo vacío, paneles cerrados; pestaña Áreas: 8 tramos por arco y curvas como guía",
    hacer: async (a) => {
      await a.pag.evaluate(() => { try { window.__hekatanRibbon?.guia?.(false); localStorage.setItem("hk_guia_nuevo", "0"); } catch (e) {} try { window.__hekatanDrawingPoints.val = []; window.__hekatanDrawingPolylines.val = [[]]; window.__hekatanDrawingAreas.val = []; } catch (e) {} });
      await a.general(); await a.quieto(2, 320);
      await panel(a, "izq", false); await panel(a, "der", false);
      await pestana(a, "areas", "Pestaña Áreas: superficies curvas.");
      await casilla(a, "Tramos", 8, "Ocho tramos rectos por arco: ETABS no admite curvas.");
      await guiaOn(a, "Guía aux.: el meridiano es una GUÍA, se borra al usarlo.");
      await a.quieto(3, 320);
    },
  },
  {
    rotulo: "2 · Frente (XZ), SNAP, acercar; Arco por 3 puntos (5,0) (3,4) (0,5); Medir el radio",
    hacer: async (a) => {
      await boton(a, "^➡ ?Frente", "Frente: alzado X-Z.");
      await boton(a, "^SNAP", "SNAP: coordenadas exactas en la rejilla.");
      await acercarA(a, [2.5, 0, 2.2], 55);
      await pestana(a, "dibujo", "Pestaña Dibujo.");
      await boton(a, "^⌒ ?Arco", "Arco por tres puntos.");
      await clicMundo(a, [5, 0, 0], "Arranque (5, 0).");
      await clicMundo(a, [3, 0, 4], "Punto medio (3, 4): 3² + 4² = 5².");
      await clicMundo(a, [0, 0, 5], "Cumbre en el eje (0, 5).");
      console.log("   ", await estado(a));
      await a.quieto(3, 360);
      await boton(a, "^📏 ?Medir", "Medir.");
      await clicMundo(a, [0, 0, 0], "Del centro…");
      await clicMundo(a, [5, 0, 0], "…al arranque: 5.000 m, el radio.");
      await a.quieto(4, 360);
      await soltar(a);
    },
  },
  {
    rotulo: "3 · Seleccionar el meridiano con una ventana (clic, clic)",
    hacer: async (a) => {
      await boton(a, "^🖱 ?Selec", "Seleccionar.");
      await ventana(a, [-0.6, 0, 5.6], [5.6, 0, -0.6], "Primera esquina de la ventana.");
      await a.quieto(4, 360);
    },
  },
  {
    rotulo: "4 · Pestaña Áreas: 16 sectores y Revolución; un clic en el eje → la cúpula en paños Q4",
    hacer: async (a) => {
      await pestana(a, "areas");
      await casilla(a, "Sectores", 16, "Dieciséis sectores alrededor del eje.");
      await boton(a, "^⟳ ?Revoluc", "Revolución: el meridiano gira.");
      await clicMundo(a, [0, 0, 2], "Un clic en el eje vertical (x = 0).");
      console.log("   ", await estado(a), JSON.stringify(await modeloInfo(a)));
      await a.quieto(5, 360);
    },
  },
  {
    rotulo: "5 · Apoyos: ventana sobre la base (z = 0) y «Empotr.» → los 16 nudos empotrados",
    hacer: async (a) => {
      await pestana(a, "dibujo");
      await boton(a, "^🖱 ?Selec", "Seleccionar.");
      await ventana(a, [-5.6, 0, 0.35], [5.6, 0, -0.35], "Una ventana estrecha sobre la base.");
      await a.quieto(2, 360);
      await boton(a, "^▲ ?Empotr", "Empotr.: se aplica a TODOS los nudos seleccionados.", true);
      console.log("   ", JSON.stringify(await modeloInfo(a)));
      await soltar(a);
      await a.quieto(4, 360);
    },
  },
  {
    rotulo: "6 · 3D y Encuadrar: 120 paños sobre la esfera; se gira para verla",
    hacer: async (a) => {
      await boton(a, "^🧊 ?3D", "Vista 3D.");
      await boton(a, "^⛶ ?Encuadrar", "Encuadrar: la cúpula en el hueco libre.");
      await a.quieto(3, 360);
      await orbita(a, [0, 0], 14, 8, [0, 0, 2.5], 26);
      await vista(a, [11, -9, 6], [0, 0, 2.5]);
      await boton(a, "^⛶ ?Encuadrar");
      await a.quieto(5, 360);
    },
  },
  {
    rotulo: "7 · Allianz: se borra la cúpula (ventana + Supr); Planta; chaflán 5 m, 4 tramos; Chaflanes por dos esquinas (26 × 24)",
    hacer: async (a) => {
      await boton(a, "^⬇ ?Planta", "Planta XY.");
      await boton(a, "^⛶ ?Encuadrar", "Encuadrar.");
      await boton(a, "^🖱 ?Selec", "Seleccionar todo con una ventana…");
      await ventana(a, [-5.4, -5.4, 0], [5.4, 5.4, 0]);
      await a.quieto(2, 300);
      await caja(a, { x: 540, y: 300, w: 200, h: 40 }, "…y la tecla Supr: la cúpula se borra.", 4);
      await a.pag.keyboard.press("Delete"); await a.quieto(3, 320);
      console.log("    después de Supr:", JSON.stringify(await modeloInfo(a)));
      await soltar(a);
      await acercarA(a, [0, 0, 0], 12.5);
      await pestana(a, "areas", "Pestaña Áreas.");
      await casilla(a, "Tramos", 4, "Cuatro tramos por esquina redondeada.");
      await casilla(a, "Chaflán r", 5, "Radio de las esquinas: 5 m (escala 1 a 10).");
      await guiaOn(a, "Sigue como guía: contorno y perfil se borran al barrer.");
      await boton(a, "^▱ ?Chaflanes", "Chaflanes: el contorno de planta.");
      await clicMundo(a, [-13, -12, 0], "Esquina (−13, −12).");
      await clicMundo(a, [13, 12, 0], "Esquina opuesta (13, 12): 26 × 24.");
      console.log("   ", await estado(a));
      await a.quieto(4, 360);
    },
  },
  {
    rotulo: "8 · La panza en el alzado XZ: 12 tramos y Parábola por (16,0) (17,2) (16,4); Medir la salida",
    hacer: async (a) => {
      await boton(a, "^➡ ?Frente", "Frente: alzado.");
      await acercarA(a, [2, 0, 2], 32);   // de x = −13 a 17: contorno y panza a la vista
      await casilla(a, "Tramos", 12, "Doce tramos en altura.");
      await pestana(a, "dibujo");
      await boton(a, "^∪ ?Parábola", "Parábola por tres puntos: la panza.");
      await clicMundo(a, [16, 0, 0], "Pie (16, 0).");
      await clicMundo(a, [17, 0, 2], "A media altura sale 1 m: (17, 2).");
      await clicMundo(a, [16, 0, 4], "Arriba vuelve: (16, 4).");
      console.log("   ", await estado(a));
      await a.quieto(3, 360);
      await boton(a, "^📏 ?Medir", "Medir: cuánto sale la panza.");
      await clicMundo(a, [16, 0, 2], "Del pie…");
      await clicMundo(a, [17, 0, 2], "…a media altura: 1.000 m.");
      await a.quieto(4, 360);
      await soltar(a);
    },
  },
  {
    rotulo: "9 · Una ventana selecciona contorno y perfil; Barrido y un clic en el centro → 480 paños",
    hacer: async (a) => {
      await boton(a, "^🖱 ?Selec", "Seleccionar.");
      await ventana(a, [-14, 0, 4.6], [18, 0, -0.6], "Contorno y perfil en una ventana.");
      await a.quieto(3, 320);
      await pestana(a, "areas");
      await boton(a, "^⟲ ?Barrido", "Barrido: el contorno se desplaza según el perfil.");
      await clicMundo(a, [0, 0, 2], "Un clic en el centro de la planta.");
      console.log("   ", await estado(a), JSON.stringify(await modeloInfo(a)));
      await a.quieto(5, 360);
    },
  },
  {
    rotulo: "10 · Apoyos del Allianz: ventana sobre la base y «Empotr.»",
    hacer: async (a) => {
      await pestana(a, "dibujo");
      await boton(a, "^🖱 ?Selec", "Seleccionar.");
      await ventana(a, [-14, 0, 0.15], [14, 0, -0.35], "Ventana sobre la base (z = 0).");
      await a.quieto(2, 360);
      await boton(a, "^▲ ?Empotr", "Empotr.: todos los nudos de la base.", true);
      console.log("   ", JSON.stringify(await modeloInfo(a)));
      await soltar(a);
      await a.quieto(4, 360);
    },
  },
  {
    rotulo: "11 · La piel del Allianz en 3D: 480 Q4, 520 nudos; = ETABS al 0.011 %",
    hacer: async (a) => {
      await boton(a, "^🧊 ?3D", "Vista 3D.");
      await boton(a, "^⛶ ?Encuadrar", "Encuadrar.");
      await a.quieto(3, 360);
      await orbita(a, [0, 0], 42, 20, [0, 0, 2], 30);
      await vista(a, [30, -34, 16], [0, 0, 2]);
      await boton(a, "^⛶ ?Encuadrar");
      await a.quieto(7, 360);
    },
  },
];
