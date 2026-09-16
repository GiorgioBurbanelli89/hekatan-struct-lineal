/**
 * AYUDA QUE SE VE: un ejemplo ANIMADO por cada botón.
 *
 * Jorge (16-sep-2026): «necesitamos un botón help, pero este help preguntará
 * "toca el botón o ventana de la que quieres asistencia", y debe tener un cuadro
 * animado de un ejemplo de cómo usar, así para cada botón».
 *
 * Por qué animado y no un texto: la frase «clic en dos esquinas opuestas» ya
 * estaba en el tooltip y aun así hay que adivinar CUÁNTOS clics, EN QUÉ ORDEN y
 * qué sale. Una herramienta de dibujo se entiende viéndola usar; es lo que hacen
 * los tutoriales de AutoCAD al lado de cada comando.
 *
 * Por qué dibujado y no un GIF grabado: son ~30 botones. A 900 KB por GIF serían
 * 27 MB que cargar; aquí cada ejemplo son dos docenas de números y se dibuja en
 * un SVG de 320×190 que se ve nítido a cualquier tamaño.
 *
 * El guion de cada ejemplo es declarativo:
 *   ["mv", x, y]      mover el cursor (interpolado)
 *   ["clic"]          clic: fija el punto donde esté el cursor
 *   ["txt", "..."]    lo que se está haciendo, debajo del lienzo
 *   ["esp", ms]       esperar
 *   ["limpia"]        borrar lo dibujado y empezar otra vez
 *   ["marca", tipo]   apoyo / carga / nudo en el último punto
 *   ["extra", ...]    copias, resaltes y demás remates de cada ejemplo
 * y el MODO dice qué se pinta con los puntos ya clicados: poli, rect, circ, arco.
 *
 * Coordenadas: las del lienzo del ejemplo, 0..320 × 0..190.
 */

export type Accion =
  | ["mv", number, number]
  | ["clic"]
  | ["txt", string]
  | ["esp", number]
  | ["limpia"]
  | ["marca", "apoyo" | "carga" | "nudo"]
  | ["copias", number, number, number]        // dx, dy, cuántas
  | ["resalta", number, number, number, number]  // x, y, w, h
  | ["colum", number]                            // columna que SUBE desde el último punto
  | ["plano", number, string]                    // plano de rejilla a esa altura (rótulo)
  | ["ejes", number, number];                    // trípode del origen local en (x, y)

export interface Demo {
  /** Cómo se unen los puntos clicados. */
  modo: "poli" | "rect" | "circ" | "arco" | "ninguno";
  /** Qué enseña, en una línea. */
  pie: string;
  guion: Accion[];
}

/** Atajo: mover al punto, esperar un poco y clicar, diciendo qué se hace. */
const cl = (x: number, y: number, t?: string): Accion[] =>
  t ? [["txt", t], ["mv", x, y], ["esp", 260], ["clic"]]
    : [["mv", x, y], ["esp", 260], ["clic"]];

const FIN: Accion[] = [["esp", 1100], ["limpia"], ["esp", 300]];

/**
 * El catálogo, por `id` de botón de la cinta (ver `GRUPOS` en getCadRibbon.ts).
 * Los que no están caen en una ayuda genérica con su texto de tooltip.
 */
export const DEMOS: Record<string, Demo> = {
  line: { modo: "poli", pie: "Línea: clic tras clic, encadena. Esc termina.",
    guion: [...cl(50, 140, "clic en el primer punto"), ...cl(150, 60, "clic en el siguiente"),
            ...cl(260, 120, "y sigue encadenando"), ["txt", "Esc para terminar"], ...FIN] },

  polyline: { modo: "poli", pie: "Polilínea: clics seguidos, Enter termina.",
    guion: [...cl(40, 150, "clic a clic, sin soltar la herramienta"), ...cl(110, 70), ...cl(200, 100),
            ...cl(280, 50), ["txt", "Enter (o clic derecho) cierra la polilínea"], ...FIN] },

  rect: { modo: "rect", pie: "Rectángulo: dos clics, esquinas opuestas.",
    guion: [...cl(60, 140, "clic en una esquina"), ["mv", 160, 100], ["esp", 200],
            ...cl(250, 50, "clic en la esquina OPUESTA"), ["txt", "salen los 4 lados de una vez"], ...FIN] },

  circle: { modo: "circ", pie: "Círculo: clic en el centro, clic en el radio.",
    guion: [...cl(160, 100, "clic en el CENTRO"), ...cl(240, 100, "clic para dar el radio (o tecléalo)"),
            ["txt", "el radio también se teclea + Enter"], ...FIN] },

  arc: { modo: "arco", pie: "Arco: tres clics — inicio, medio y fin.",
    guion: [...cl(50, 150, "clic: inicio"), ...cl(160, 45, "clic: por dónde pasa"),
            ...cl(270, 150, "clic: fin"), ["txt", "el arco pasa por los tres puntos"], ...FIN] },

  parabola: { modo: "arco", pie: "Parábola: tres clics en el plano de la vista.",
    guion: [...cl(50, 150, "tres clics"), ...cl(160, 60), ...cl(270, 150),
            ["txt", "la parábola que pasa por los tres"], ...FIN] },

  cubica: { modo: "poli", pie: "Cúbica: cuatro clics.",
    guion: [...cl(40, 140, "cuatro clics"), ...cl(120, 60), ...cl(200, 140), ...cl(280, 60),
            ["txt", "el polinomio de 3er grado por los cuatro"], ...FIN] },

  col: { modo: "ninguno", pie: "Columna: teclea la altura, luego clic en la base.",
    guion: [["txt", "teclea la altura (3) + Enter"], ["esp", 700],
            ...cl(100, 160, "clic en la base"), ["marca", "nudo"], ["colum", 95],
            ...cl(220, 160, "otra base, otra columna"), ["marca", "nudo"], ["colum", 95],
            ["txt", "cada clic levanta una columna de esa altura"], ...FIN] },

  wall: { modo: "poli", pie: "Muro: altura + Enter, y dos clics en la base.",
    guion: [["txt", "teclea la altura + Enter"], ["esp", 650],
            ...cl(70, 150, "clic: arranque del muro"), ...cl(250, 150, "clic: final"),
            ["txt", "el paño sube esa altura"], ...FIN] },

  area: { modo: "poli", pie: "Losa: cuatro clics en orden, antihorario.",
    guion: [...cl(70, 150, "1"), ...cl(250, 150, "2"), ...cl(250, 55, "3"), ...cl(70, 55, "4"),
            ["txt", "cuatro nudos = un paño Q4"], ...FIN] },

  apoyo: { modo: "ninguno", pie: "Apoyo: clic sobre un nudo y queda empotrado.",
    guion: [["txt", "clic sobre el nudo"], ...cl(80, 150), ["marca", "apoyo"],
            ...cl(240, 150, "y el otro"), ["marca", "apoyo"],
            ["txt", "sin apoyos no hay solución"], ...FIN] },

  carga: { modo: "ninguno", pie: "Carga: clic en un nudo, con el valor de la casilla.",
    guion: [["txt", "pon el valor en la casilla (−10 kN)"], ["esp", 650],
            ...cl(120, 90, "clic en el nudo"), ["marca", "carga"],
            ...cl(210, 90, "y en otro"), ["marca", "carga"], ...FIN] },

  cargaq: { modo: "ninguno", pie: "Carga q: clic sobre una BARRA, no sobre el nudo.",
    guion: [["txt", "clic sobre la barra"], ...cl(160, 95), ["marca", "carga"],
            ["txt", "carga repartida en kN/m, como el Frame Distributed Load de ETABS"], ...FIN] },

  select: { modo: "ninguno", pie: "Selec.: clic-clic hace la ventana (arrastrar orbita).",
    guion: [["txt", "clic en una esquina…"], ...cl(45, 45), ["txt", "…mueve…"], ["mv", 160, 110], ["esp", 400],
            ["txt", "…y clic en la otra: izq→der coge lo que queda ENTERO dentro"], ...cl(275, 160),
            ["resalta", 45, 45, 230, 115], ...FIN] },

  replicar: { modo: "rect", pie: "Replicar: lo designado, tantas copias (Replicate de ETABS).",
    guion: [...cl(70, 150, "esto ya está dibujado y designado"), ...cl(250, 110),
            ["txt", "desplazamiento y nº de copias"], ["esp", 500],
            ["copias", 0, -34, 2], ["txt", "dos copias, cada una 3 m más arriba"], ...FIN] },

  move: { modo: "ninguno", pie: "Mover: punto base y punto destino.",
    guion: [["txt", "con algo designado: clic en el punto BASE"], ...cl(90, 140),
            ["txt", "clic en el destino (o @dx,dy,dz)"], ...cl(230, 80), ...FIN] },

  copy: { modo: "ninguno", pie: "Copiar: igual que mover, pero deja el original.",
    guion: [["txt", "clic en el punto base"], ...cl(90, 140), ["txt", "clic en el destino"], ...cl(230, 80), ...FIN] },

  offset: { modo: "poli", pie: "Desfase: distancia, clic en la línea, clic en el lado.",
    guion: [["txt", "teclea la distancia + Enter"], ["esp", 600],
            ...cl(60, 120, "clic en la línea"), ...cl(260, 120),
            ["txt", "clic en el lado hacia donde va"], ["mv", 160, 70], ["esp", 400], ["clic"], ...FIN] },

  trim: { modo: "ninguno", pie: "Recortar: contorno de corte y trozo que sobra.",
    guion: [["txt", "clic en el contorno de corte"], ...cl(160, 60),
            ["txt", "clic en el trozo que sobra"], ...cl(240, 130), ...FIN] },

  extend: { modo: "ninguno", pie: "Alargar: contorno y línea a alargar, por su extremo.",
    guion: [["txt", "clic en el contorno"], ...cl(260, 60),
            ["txt", "clic en la línea, cerca del extremo libre"], ...cl(120, 120), ...FIN] },

  delete: { modo: "ninguno", pie: "Borrar: pasa por encima (se pone rojo) y clic.",
    guion: [["txt", "pasa el cursor: se pone rojo"], ["mv", 160, 100], ["esp", 600],
            ["txt", "clic y fuera (o Supr con algo designado)"], ["clic"], ...FIN] },

  medir: { modo: "poli", pie: "Medir: dos clics y te da la distancia y Δx Δy Δz.",
    guion: [...cl(70, 140, "clic"), ...cl(250, 70, "clic"), ["txt", "distancia y Δx Δy Δz"], ...FIN] },

  aux: { modo: "poli", pie: "Auxiliar: línea de construcción (cian, no es estructura).",
    guion: [...cl(50, 60, "dos clics"), ...cl(280, 140), ["txt", "sirve de referencia; no entra en el FEM"], ...FIN] },

  deshacer: { modo: "poli", pie: "Anterior: deshace lo último (Ctrl+Z).",
    guion: [...cl(60, 140), ...cl(160, 70), ...cl(260, 130), ["esp", 500],
            ["txt", "Anterior quita el último tramo"], ["esp", 700], ...FIN] },

  rehacer: { modo: "poli", pie: "Rehacer: devuelve lo deshecho (Ctrl+Y).",
    guion: [...cl(60, 140), ...cl(160, 70), ["txt", "Rehacer lo devuelve"], ...cl(260, 130), ...FIN] },

  revolve: { modo: "arco", pie: "Revolución: el meridiano designado gira sobre el eje.",
    guion: [...cl(90, 150, "el meridiano ya dibujado"), ...cl(140, 60), ...cl(190, 150),
            ["txt", "1 clic en el eje y sale la cúpula en paños Q4"], ...cl(160, 150), ...FIN] },

  loft: { modo: "rect", pie: "Barrido: contorno de planta + perfil de alzado.",
    guion: [...cl(60, 150, "designa el contorno…"), ...cl(260, 110),
            ["txt", "…y el perfil; 1 clic en el centro"], ...cl(160, 130), ...FIN] },

  // ── Los de la cinta que no son herramientas de dibujo ────────────────────
  grillaAux: { modo: "ninguno", pie: "▦+ : deja una grilla auxiliar a la cota escrita.",
    guion: [["plano", 150, "suelo · Z = 0"], ["txt", "solo hay rejilla en el suelo"],
            ["mv", 90, 150], ["mv", 240, 150], ["esp", 250],
            ["txt", "escribe la cota (3.00) y pulsa ▦+"], ["mv", 240, 100], ["mv", 120, 80],
            ["plano", 75, "grilla auxiliar · Z = 3.00"],
            ["mv", 90, 75], ["mv", 250, 75], ["esp", 250],
            ["txt", "ya hay dónde engancharse a 3 m, sin bajar a planta"], ["mv", 160, 60], ...FIN] },

  cotaZ: { modo: "ninguno", pie: "Cota Z: a qué altura cae lo que dibujes.",
    guion: [["plano", 150, "Z = 0"], ["txt", "el clic cae SIEMPRE en el plano de trabajo"], ["esp", 850],
            ["plano", 75, "Z = 3.00 — aquí caen ahora los clics"],
            ["txt", "y la vista NO se mueve al cambiar de cota"], ["esp", 900], ...FIN] },

  subir: { modo: "rect", pie: "⇈ Subir: copia lo dibujado a los pisos de arriba.",
    guion: [...cl(70, 150, "esta planta…"), ...cl(250, 120),
            ["txt", "altura de piso × nº de pisos"], ["esp", 500],
            ["copias", 0, -32, 3], ["txt", "…y ya es un edificio"], ...FIN] },

  ayuda: { modo: "ninguno", pie: "? : esta misma ayuda — toca un botón y te enseño su ejemplo.",
    guion: [["txt", "pulsa ? y toca CUALQUIER boton"], ["mv", 90, 40], ["mv", 210, 40],
            ["resalta", 190, 26, 46, 30], ["txt", "el boton no se ejecuta: se explica"],
            ["mv", 210, 90], ["esp", 300],
            ["txt", "sale el ejemplo animado y «▶ Probar ahora» lo activa · Esc sale"],
            ["mv", 160, 120], ...FIN] },

  plegar: { modo: "ninguno", pie: "▴ : pliega la cinta a un solo botón (y ▾ la devuelve).",
    guion: [["resalta", 20, 20, 280, 46], ["txt", "la cinta ocupa el tercio de arriba"],
            ["mv", 250, 30], ["mv", 290, 30], ["esp", 250],
            ["limpia"], ["resalta", 250, 20, 50, 22], ["txt", "plegada: queda un boton y el lienzo entero"],
            ["mv", 160, 120], ["esp", 300], ...FIN] },

  extras: { modo: "ninguno", pie: "▾ : añadir a la cinta lo que uses del panel.",
    guion: [["txt", "▾ abre la lista de TODO lo que hay en los paneles"],
            ["mv", 260, 40], ["esp", 250], ["resalta", 150, 55, 150, 110],
            ["txt", "marcas lo que usas y aparece en la cinta, en «Mis accesos»"],
            ["mv", 200, 90], ["mv", 120, 70], ["esp", 300],
            ["txt", "se recuerda para la proxima vez"], ...FIN] },

  moverGrilla: { modo: "ninguno", pie: "↕ : coge la grilla con el cursor y la desplaza.",
    guion: [["plano", 150, "aqui esta la grilla"], ["txt", "pulsa ↕ y mueve el raton"], ["esp", 700],
            ["mv", 200, 120], ["plano", 110, "la grilla sigue al cursor"], ["esp", 500],
            ["mv", 200, 80], ["plano", 70, "paralela a si misma, solo en su normal"], ["esp", 700],
            ["txt", "teclea la distancia (4.75) + Enter y queda exacta · Esc cancela"], ...FIN] },

  repGrid: { modo: "ninguno", pie: "▦× : deja varias grillas NUEVAS, sin mover la tuya.",
    guion: [["plano", 160, "tu grilla, en Z = 0"], ["txt", "pon la separacion y cuantas (3 × 3)"], ["esp", 800],
            ["txt", "▦× deja las NUEVAS aparte"], ["esp", 400],
            ["plano", 120, "Z = 3"], ["esp", 340], ["plano", 80, "Z = 6"], ["esp", 340],
            ["plano", 40, "Z = 9"], ["esp", 340],
            ["txt", "desplazar mueve la tuya · replicar deja otras aparte"], ...FIN] },

  scu: { modo: "ninguno", pie: "⌖ Origen local: 0,0,0 pasa a ser el punto que toques.",
    guion: [["txt", "pulsa ⌖ y toca un punto del modelo"], ...cl(210, 90, "clic (el osnap engancha al nudo)"),
            ["marca", "nudo"], ["ejes", 210, 90],
            ["txt", "ahi queda el origen: ahora «0,0,0» es ESE punto"], ["esp", 800],
            ["txt", "«3,0,0» son 3 m desde ahi, no desde el origen del modelo"], ...FIN] },

  vista: { modo: "ninguno", pie: "Las vistas cambian el PLANO DE TRABAJO, no solo la cámara.",
    guion: [["plano", 150, "Planta XY: el clic cae en Z"], ["txt", "Planta (1) · Frente (2) · Lado (3) · 3D (4)"], ["esp", 900],
            ["limpia"], ["resalta", 120, 40, 90, 120], ["txt", "Frente XZ: el clic cae en el plano vertical, a la Y que elijas"],
            ["esp", 900], ...FIN] },

  snap: { modo: "ninguno", pie: "SNAP (F9): el cursor cae en los cruces de la rejilla.",
    guion: [["txt", "sin SNAP el punto cae donde este el cursor"],
            ["mv", 93, 117], ["mv", 147, 83], ["clic"],
            ["txt", "con SNAP (F9) salta al CRUCE mas cercano"], ["limpia"],
            ["mv", 100, 120], ["mv", 147, 83], ["mv", 140, 80], ["clic"],
            ["mv", 208, 122], ["mv", 200, 120], ["clic"],
            ["txt", "el paso es la separacion de la rejilla que se ve"], ["mv", 160, 100], ...FIN] },

  osnap: { modo: "ninguno", pie: "OSNAP (F3): engancha a nudo, punto final, medio, cruce…",
    guion: [...cl(80, 140, "hay un nudo aqui"), ["marca", "nudo"],
            ["txt", "al acercarte, el cuadrito dice a QUE te enganchas"], ["mv", 86, 134], ["esp", 800],
            ["txt", "manda la referencia, no el pixel donde clicas"], ...FIN] },

  orto: { modo: "ninguno", pie: "ORTO (F8): obliga a dibujar horizontal o vertical.",
    guion: [...cl(60, 140, "primer punto"), ["txt", "sin ORTO la linea va a donde apuntes"],
            ["mv", 250, 90], ["esp", 600],
            ["txt", "con ORTO (F8) se queda recta"], ["mv", 250, 140], ["esp", 600], ["clic"], ...FIN] },

  rejilla: { modo: "ninguno", pie: "🏗 Rejilla: ejes, niveles y columnas de golpe.",
    guion: [["txt", "vanos en X, en Y y pisos en las casillas (4x6 · 3x5 · 4x3)"],
            ["mv", 60, 40], ["mv", 260, 40], ["esp", 200],
            ["txt", "🏗 Rejilla replantea los ejes…"],
            ["plano", 150, "nivel 0"], ["mv", 60, 150], ["mv", 260, 150],
            ["txt", "…y los niveles, con sus columnas"],
            ["plano", 105, "nivel 1"], ["esp", 250], ["plano", 60, "nivel 2"],
            ["mv", 160, 60], ["esp", 300], ...FIN] },
};

/** Ayuda genérica para un botón sin ejemplo propio. */
export const DEMO_GENERICA = (texto: string): Demo => ({
  modo: "ninguno", pie: texto,
  guion: [["txt", texto], ["esp", 1800]],
});

// ── El reproductor ─────────────────────────────────────────────────────────

const W = 320, H = 190;
const NS = "http://www.w3.org/2000/svg";
const el = (t: string, a: Record<string, string | number>) => {
  const e = document.createElementNS(NS, t);
  for (const k in a) e.setAttribute(k, String(a[k]));
  return e;
};

/**
 * Monta el lienzo del ejemplo dentro de `host` y lo reproduce en bucle.
 * Devuelve la función para pararlo (hay que llamarla al cerrar el cuadro: si no,
 * el temporizador sigue vivo y se apilan reproducciones).
 */
export function reproducir(host: HTMLElement, demo: Demo): () => void {
  host.innerHTML = "";
  const svg = el("svg", { width: "100%", viewBox: `0 0 ${W} ${H}`,
    style: "display:block;background:#0b1220;border:1px solid #1e3a4a;border-radius:8px" });
  // rejilla de fondo, como la del programa
  for (let x = 0; x <= W; x += 20)
    svg.appendChild(el("line", { x1: x, y1: 0, x2: x, y2: H, stroke: "#1b2434", "stroke-width": 1 }));
  for (let y = 0; y <= H; y += 20)
    svg.appendChild(el("line", { x1: 0, y1: y, x2: W, y2: y, stroke: "#1b2434", "stroke-width": 1 }));
  const capa = el("g", {});                       // lo dibujado
  const capaCur = el("g", {});                    // el cursor, siempre encima
  svg.append(capa, capaCur);
  const pie = document.createElement("div");
  pie.style.cssText = "margin-top:7px;color:#94a3b8;font:12px/1.5 system-ui;min-height:2.6em";
  host.append(svg, pie);

  // cruz del cursor (blanca, como la del CAD) + aro rojo al clicar
  const cruz = el("g", { stroke: "#fff", "stroke-width": 1.4 });
  cruz.append(el("line", { x1: -9, y1: 0, x2: 9, y2: 0 }), el("line", { x1: 0, y1: -9, x2: 0, y2: 9 }));
  const aro = el("circle", { r: 9, fill: "none", stroke: "#ff2d55", "stroke-width": 2, opacity: 0 });
  capaCur.append(cruz, aro);

  let cur = { x: W / 2, y: H / 2 };
  const ponerCursor = () => {
    cruz.setAttribute("transform", `translate(${cur.x},${cur.y})`);
    aro.setAttribute("cx", String(cur.x)); aro.setAttribute("cy", String(cur.y));
  };
  ponerCursor();

  let pts: Array<[number, number]> = [];
  const pintar = () => {
    // se repinta entero: son cuatro trazos, y así no hay estado que se desincronice
    while (capa.firstChild) capa.removeChild(capa.firstChild);
    const trazo = { stroke: "#7dd3fc", "stroke-width": 2, fill: "none" };
    if (demo.modo === "poli" && pts.length > 1)
      capa.appendChild(el("polyline", { ...trazo, points: pts.map((p) => p.join(",")).join(" ") }));
    if (demo.modo === "rect" && pts.length > 1) {
      const [a, b] = [pts[0], pts[pts.length - 1]];
      capa.appendChild(el("rect", { ...trazo, x: Math.min(a[0], b[0]), y: Math.min(a[1], b[1]),
        width: Math.abs(b[0] - a[0]), height: Math.abs(b[1] - a[1]) }));
    }
    if (demo.modo === "circ" && pts.length > 1)
      capa.appendChild(el("circle", { ...trazo, cx: pts[0][0], cy: pts[0][1],
        r: Math.hypot(pts[1][0] - pts[0][0], pts[1][1] - pts[0][1]) }));
    if (demo.modo === "arco" && pts.length === 3) {
      const [a, m, b] = pts;
      capa.appendChild(el("path", { ...trazo, d: `M ${a[0]} ${a[1]} Q ${2 * m[0] - (a[0] + b[0]) / 2} ${2 * m[1] - (a[1] + b[1]) / 2} ${b[0]} ${b[1]}` }));
    } else if (demo.modo === "arco" && pts.length === 2) {
      capa.appendChild(el("line", { ...trazo, x1: pts[0][0], y1: pts[0][1], x2: pts[1][0], y2: pts[1][1] }));
    }
    for (const p of pts) capa.appendChild(el("circle", { cx: p[0], cy: p[1], r: 2.6, fill: "#22d3ee" }));
  };

  let vivo = true;
  const dormir = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

  const correr = async () => {
    while (vivo) {
      for (const acc of demo.guion) {
        if (!vivo) return;
        switch (acc[0]) {
          case "mv": {
            const [, x, y] = acc; const de = { ...cur };
            for (let i = 1; i <= 14 && vivo; i++) {
              cur = { x: de.x + (x - de.x) * i / 14, y: de.y + (y - de.y) * i / 14 };
              ponerCursor(); await dormir(16);
            }
            break;
          }
          case "clic":
            aro.setAttribute("opacity", "1"); await dormir(150);
            aro.setAttribute("opacity", "0");
            pts.push([cur.x, cur.y]); pintar();
            break;
          case "txt": pie.textContent = acc[1]; break;
          case "esp": await dormir(acc[1]); break;
          case "limpia": pts = []; pintar(); pie.textContent = ""; break;
          case "marca": {
            const [, tipo] = acc; const p = pts[pts.length - 1] ?? [cur.x, cur.y];
            if (tipo === "apoyo")
              capa.appendChild(el("path", { d: `M ${p[0] - 8} ${p[1] + 12} L ${p[0]} ${p[1]} L ${p[0] + 8} ${p[1] + 12} Z`,
                fill: "none", stroke: "#4ade80", "stroke-width": 2 }));
            else if (tipo === "carga") {
              capa.appendChild(el("line", { x1: p[0], y1: p[1] - 26, x2: p[0], y2: p[1] - 4,
                stroke: "#f87171", "stroke-width": 2 }));
              capa.appendChild(el("path", { d: `M ${p[0] - 4} ${p[1] - 10} L ${p[0]} ${p[1] - 2} L ${p[0] + 4} ${p[1] - 10} Z`, fill: "#f87171" }));
            } else capa.appendChild(el("circle", { cx: p[0], cy: p[1], r: 3.4, fill: "#22d3ee" }));
            break;
          }
          case "copias": {
            const [, dx, dy, n] = acc;
            for (let k = 1; k <= n; k++) {
              if (!vivo) return;
              const g = capa.cloneNode(true) as SVGGElement;
              g.setAttribute("transform", `translate(${dx * k},${dy * k})`);
              g.setAttribute("opacity", "0.85");
              capa.parentNode?.insertBefore(g, capaCur);
              await dormir(320);
            }
            break;
          }
          case "colum": {
            const [, alto] = acc; const q = pts[pts.length - 1] ?? [cur.x, cur.y];
            const ln = el("line", { x1: q[0], y1: q[1], x2: q[0], y2: q[1],
              stroke: "#7dd3fc", "stroke-width": 3 });
            capa.appendChild(ln);
            for (let i = 1; i <= 12 && vivo; i++) {           // que se VEA subir
              ln.setAttribute("y2", String(q[1] - alto * i / 12)); await dormir(28);
            }
            break;
          }
          case "plano": {
            const [, y, rotulo] = acc;
            const g = el("g", {});
            // un plano de rejilla en perspectiva: paralelogramo con sus líneas
            const izq = 30, der = 290, sesgo = 34, h = 26;
            const pol = `${izq},${y} ${der},${y} ${der - sesgo},${y + h} ${izq - sesgo + 34},${y + h}`;
            g.appendChild(el("polygon", { points: pol, fill: "rgba(34,211,238,.07)",
              stroke: "#22d3ee", "stroke-width": 1.4 }));
            for (let k = 1; k < 6; k++) {
              const t = k / 6;
              g.appendChild(el("line", { x1: izq + (der - izq) * t, y1: y,
                x2: izq + 34 - sesgo + (der - sesgo - izq - 34 + sesgo) * t, y2: y + h,
                stroke: "#22d3ee", "stroke-width": 0.7, opacity: 0.5 }));
            }
            g.appendChild(el("text", { x: izq, y: y - 6, fill: "#7dd3fc", "font-size": 10 })).textContent = rotulo;
            capa.appendChild(g);
            break;
          }
          case "ejes": {
            const [, ex, ey] = acc;
            const g = el("g", {});
            const fl = (dx: number, dy: number, col: string) => {
              g.appendChild(el("line", { x1: ex, y1: ey, x2: ex + dx, y2: ey + dy, stroke: col, "stroke-width": 2 }));
              g.appendChild(el("circle", { cx: ex + dx, cy: ey + dy, r: 2.4, fill: col }));
            };
            fl(30, 12, "#ff5b5b");     // X
            fl(-26, 12, "#5bff8a");    // Y
            fl(0, -32, "#6aa8ff");     // Z
            // la línea de puntos hasta el origen del dibujo, como en el programa
            g.appendChild(el("line", { x1: 40, y1: 150, x2: ex, y2: ey, stroke: "#22d3ee",
              "stroke-width": 1.2, "stroke-dasharray": "5 4", opacity: 0.85 }));
            capa.appendChild(g);
            break;
          }
          case "resalta": {
            const [, x, y, w, h] = acc;
            capa.appendChild(el("rect", { x, y, width: w, height: h, fill: "rgba(34,211,238,.10)",
              stroke: "#22d3ee", "stroke-width": 1.5, "stroke-dasharray": "5 4" }));
            break;
          }
        }
      }
      // limpiar las copias que hayan quedado sueltas antes de repetir
      for (const g of [...svg.querySelectorAll("g")]) if (g !== capa && g !== capaCur) g.remove();
      pts = []; pintar(); await dormir(500);
    }
  };
  correr();
  return () => { vivo = false; };
}
