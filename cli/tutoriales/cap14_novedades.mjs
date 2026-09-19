// Capítulo 14 · Áreas, regla y paneles corredizos, SOLO con la cinta de acceso rápido
// (19-sep-2026, Jorge: «debes usar solo acceso rápido»; «no se ve ninguna línea»).
// Tres celdas con Rectángulo en PLANTA y bien de cerca, Rellenar una, Llenar las demás,
// medir, y los paneles/cinta que se pliegan.
import { mover, clicRojo, caja, rect, panel, proj, clicMundo, estado,
         pestana, boton, senalar, casilla, acercarA, soltar, modeloInfo } from "./_cinta.mjs";
export const ruta = "workspace/?t=new-blank";
export const titulo = "Hekatan Struct · áreas, regla y paneles corredizos";

export const pasos = [
  { rotulo: "Portada", hacer: async (a) => { await a.portada("Áreas, regla y paneles corredizos", "Capítulo 14", 16); } },
  {
    rotulo: "1 · Paneles corredizos: la puerta derecha y la izquierda los ocultan",
    hacer: async (a) => {
      await a.pag.evaluate(() => { try { window.__hekatanRibbon?.guia?.(false); localStorage.setItem("hk_guia_nuevo", "0"); } catch (e) {} try { window.__hekatanDrawingPoints.val = []; window.__hekatanDrawingPolylines.val = [[]]; window.__hekatanDrawingAreas.val = []; } catch (e) {} });
      await a.general(); await a.quieto(2, 320);
      const d = await rect(a, () => document.getElementById("hk-pane-toggle"));
      if (d) await caja(a, { x: d.rx - 4, y: d.ry - 4, w: d.rw + 8, h: d.rh + 8 }, "Esta puerta desliza el panel de la derecha.", 5);
      await panel(a, "der", false);
      const i = await rect(a, () => document.getElementById("hk-settings-toggle"));
      if (i) await caja(a, { x: i.rx - 4, y: i.ry - 4, w: i.rw + 8, h: i.rh + 8 }, "Y esta, el de ajustes de la izquierda.", 5);
      await panel(a, "izq", false);
      await a.quieto(3, 320);
    },
  },
  {
    rotulo: "2 · Planta, SNAP y acercar; Rectángulo: tres celdas de 3 × 3 m",
    hacer: async (a) => {
      await boton(a, "^⬇ ?Planta", "Planta XY.");
      await boton(a, "^SNAP", "SNAP: esquinas exactas en la rejilla.");
      await acercarA(a, [4.5, 1.5, 0], 75);
      // un solo clic en el botón: la herramienta sigue activa (pulsarla otra vez la APAGA)
      await boton(a, "^▭ ?Rectáng", "Rectángulo: dos esquinas opuestas, tres veces.");
      for (let k = 0; k < 3; k++) {
        await clicMundo(a, [3 * k, 0, 0], k === 0 ? "(0, 0)" : "");
        await clicMundo(a, [3 * k + 3, 3, 0], k === 0 ? "(3, 3)" : "");
      }
      await soltar(a);
      console.log("   ", JSON.stringify(await modeloInfo(a)));
      await a.quieto(3, 320);
    },
  },
  {
    rotulo: "3 · Pestaña Áreas · Rellenar: al pasar el ratón la celda se resalta; un clic crea el área",
    hacer: async (a) => {
      await pestana(a, "areas", "Pestaña Áreas.");
      await boton(a, "^▦ ?Rellenar", "Rellenar: clic DENTRO de una celda cerrada.");
      const [q] = await proj(a, [[1.5, 1.5, 0]]);
      await mover(a, q.x - 40, q.y + 30, 10); await a.quieto(2, 300);
      await mover(a, q.x, q.y, 10); await a.quieto(3, 300);
      await clicMundo(a, [1.5, 1.5, 0], "Clic dentro: ya es un área (paño Q4).");
      await soltar(a);
      console.log("   ", JSON.stringify(await modeloInfo(a)));
      await a.quieto(3, 320);
    },
  },
  {
    rotulo: "4 · Llenar todas: las celdas cerradas que quedan, de un clic",
    hacer: async (a) => {
      await boton(a, "^▦▦ ?Llenar todas", "Llenar todas: todas las celdas cerradas de una vez.");
      console.log("   ", await estado(a), JSON.stringify(await modeloInfo(a)));
      await a.quieto(5, 360);
    },
  },
  {
    rotulo: "5 · Pestaña Dibujo · Medir: engancha a las esquinas, 6.000 m exactos",
    hacer: async (a) => {
      await pestana(a, "dibujo", "Pestaña Dibujo.");
      await boton(a, "^📏 ?Medir", "Medir: dos clics.");
      await clicMundo(a, [0, 0, 0], "De la esquina…");
      await clicMundo(a, [6, 0, 0], "…a la otra: 6.000 m.");
      await a.quieto(5, 360);
      await soltar(a);
    },
  },
  {
    rotulo: "6 · 3D y Encuadrar",
    hacer: async (a) => {
      await boton(a, "^🧊 ?3D", "Vista 3D.");
      await boton(a, "^⛶ ?Encuadrar", "Encuadrar.");
      await a.quieto(5, 360);
    },
  },
  {
    rotulo: "7 · La cinta también se pliega (▴) y vuelve (✏ Dibujar)",
    hacer: async (a) => {
      const pl = await rect(a, () => document.getElementById("hk-ribbon-plegar"));
      if (pl) { await mover(a, pl.x, pl.y, 12); await caja(a, { x: pl.rx - 4, y: pl.ry - 4, w: pl.rw + 8, h: pl.rh + 8 }, "▴ pliega la cinta: toda la vista libre.", 5); await clicRojo(a, pl.x, pl.y, false); }
      await a.quieto(4, 360);
      const ab = await rect(a, () => document.getElementById("hk-ribbon-abrir"));
      if (ab) { await mover(a, ab.x, ab.y, 12); await caja(a, { x: ab.rx - 4, y: ab.ry - 4, w: ab.rw + 8, h: ab.rh + 8 }, "✏ Dibujar la vuelve a abrir.", 5); await clicRojo(a, ab.x, ab.y, false); }
      await a.quieto(3, 360);
    },
  },
  {
    rotulo: "8 · Volver al menú principal (🏠 Menú, barra de arriba)",
    hacer: async (a) => {
      const r = await rect(a, () => [...document.querySelectorAll("button")].find((b) => /Menú/.test(b.textContent || "") && b.getBoundingClientRect().top < 40));
      if (r) { await mover(a, r.x, r.y, 12); await caja(a, { x: r.rx - 4, y: r.ry - 4, w: r.rw + 8, h: r.rh + 8 }, "🏠 Menú: vuelve a la ventana principal desde cualquier ejemplo.", 6); }
      else console.log("  x no está el botón Menú");
      await a.quieto(3, 360);
    },
  },
];
