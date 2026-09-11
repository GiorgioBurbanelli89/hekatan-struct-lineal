/**
 * VISTA 2D DEL DIAGRAMA — un plano (alzado XZ, alzado YZ o planta XY) con SOLO las
 * barras de ese plano y el diagrama del resultado que esté puesto en «Frame results».
 *
 * Jorge: «lo que sí falta es ver ese resultado en un plano XZ, por ejemplo, o que al
 * seleccionar se abra una vista solo con el diagrama de ese resultado… pero en una
 * vista 2D». Es lo que hace ETABS con *Display › Force/Stress Diagrams › Frame* sobre
 * un alzado: plano, sin perspectiva, con el valor escrito en cada extremo.
 *
 * No calcula nada: lee los mismos esfuerzos que dibuja el 3D (`analyzeOutputs`, un
 * par [inicio, fin] por barra). Como el modelo parte las vigas en tramos, los extremos
 * de cada tramo ya dan la curva.
 *
 * ── Convención ────────────────────────────────────────────────────────────────
 * Valores y lados, los de ETABS (`objects/utils/diagramaCSI.ts`): el MOMENTO del lado
 * de la tracción, que es del lado del acero — positivo hacia ABAJO en una viga —; el
 * cortante y el axil hacia el eje +2 de la barra.
 *
 *   window.__hekatanDiagrama2D()                  abre la ventana (plano por defecto:
 *                                                  el de la barra designada, si hay)
 *   window.__hekatanDiagrama2D({ plano: "XZ", en: 0 })
 */
import type { State } from "vanjs-core";
import { ejesCSI, diagramaCSI, ladoPositivo } from "./objects/utils/diagramaCSI";

type Nodo = number[];
type Plano = "XZ" | "YZ" | "XY";

interface Malla {
  nodes?: State<Nodo[]>;
  elements?: State<number[][]>;
  analyzeOutputs?: State<any>;
  elementInputs?: State<any>;
}

const NOMBRE: Record<string, string> = {
  normals: "Axial", torsions: "Torsión", shearsY: "Cortante 2-2", shearsZ: "Cortante 3-3",
  bendingsY: "Momento 2-2", bendingsZ: "Momento 3-3",
};
const UNIDAD: Record<string, string> = {
  normals: "kN", torsions: "kN·m", shearsY: "kN", shearsZ: "kN",
  bendingsY: "kN·m", bendingsZ: "kN·m",
};
const TOL = 1e-3;                     // m: a qué distancia del plano un nudo cuenta como «en él»

/** Coordenadas 2D de un nudo en el plano, y la coordenada que queda fuera (la «cota»). */
function proyectar(p: Nodo, plano: Plano): { u: number; v: number; fuera: number } {
  if (plano === "XZ") return { u: p[0], v: p[2], fuera: p[1] };
  if (plano === "YZ") return { u: p[1], v: p[2], fuera: p[0] };
  return { u: p[0], v: p[1], fuera: p[2] };
}

/** Qué plano toca a una barra: el que la contiene y es vertical, salvo que sea horizontal y vaya en diagonal. */
function planoDeBarra(a: Nodo, b: Nodo): { plano: Plano; en: number } {
  const dx = Math.abs(b[0] - a[0]), dy = Math.abs(b[1] - a[1]);
  // una barra que no avanza en Y vive en un alzado XZ; si no avanza en X, en uno YZ
  if (dy < TOL) return { plano: "XZ", en: a[1] };
  if (dx < TOL) return { plano: "YZ", en: a[0] };
  return { plano: "XY", en: a[2] };
}

export function iniciarDiagrama2D(mesh: Malla, settings: any) {
  let host: HTMLDivElement | null = null;
  let estado: { plano: Plano; en: number } = { plano: "XZ", en: 0 };

  const resultadoActual = (): string | null => {
    const r = settings?.frameResults?.rawVal ?? settings?.frameResults?.val;
    if (!r || r === "none") return null;
    return String(r).replace(/^contour:/, "");     // el «(diagram)» de colores usa el mismo dato
  };

  /** Las cotas distintas del plano elegido: los ejes que se pueden mirar. */
  const cotas = (plano: Plano): number[] => {
    const N = mesh.nodes?.rawVal ?? [];
    const E = mesh.elements?.rawVal ?? [];
    const s = new Set<number>();
    for (const e of E) {
      if (e.length !== 2) continue;
      const a = N[e[0]], b = N[e[1]];
      if (!a || !b) continue;
      const pa = proyectar(a, plano), pb = proyectar(b, plano);
      if (Math.abs(pa.fuera - pb.fuera) < TOL) s.add(Math.round(pa.fuera * 1000) / 1000);
    }
    return [...s].sort((x, y) => x - y);
  };

  function abrir(opc?: { plano?: Plano; en?: number }) {
    if (opc?.plano) estado = { plano: opc.plano, en: opc.en ?? cotas(opc.plano)[0] ?? 0 };
    else {
      // lo designado manda: la barra que el usuario tocó decide el plano
      const sel = ((window as any).__hekatanModelSelection as any[] | undefined) ?? [];
      const fr = [...sel].reverse().find((s) => s.type === "frame");
      const N = mesh.nodes?.rawVal ?? [], E = mesh.elements?.rawVal ?? [];
      if (fr && E[fr.idx] && N[E[fr.idx][0]] && N[E[fr.idx][1]])
        estado = planoDeBarra(N[E[fr.idx][0]], N[E[fr.idx][1]]);
      else estado = { plano: "XZ", en: cotas("XZ")[0] ?? 0 };
    }
    if (!host) crearVentana();
    host!.hidden = false;
    pintar();
  }

  function crearVentana() {
    host = document.createElement("div");
    host.id = "hk-diagrama-2d";
    host.style.cssText = [
      "position:fixed", "left:50%", "top:70px", "transform:translateX(-50%)",
      "width:min(900px,92vw)", "height:min(560px,78vh)", "z-index:9990",
      "background:#0b0e14", "border:1px solid #2f3b50", "border-radius:8px",
      "box-shadow:0 12px 40px rgba(0,0,0,.6)", "display:flex", "flex-direction:column",
      "font:12px 'Segoe UI',system-ui,sans-serif", "color:#c9d3e0",
    ].join(";");
    host.innerHTML = `
      <div class="hk-d2-bar" style="display:flex;align-items:center;gap:10px;padding:7px 10px;
           background:#141a24;border-bottom:1px solid #2f3b50;cursor:move;user-select:none">
        <b style="color:#e6c463">📐 Diagrama 2D</b>
        <span class="hk-d2-tit" style="color:#9fb0c6"></span>
        <label style="margin-left:auto">plano
          <select class="hk-d2-plano" style="background:#1b2230;color:#dbe6f5;border:1px solid #33415c;border-radius:4px">
            <option value="XZ">Alzado XZ</option><option value="YZ">Alzado YZ</option><option value="XY">Planta XY</option>
          </select></label>
        <button class="hk-d2-ant" title="pórtico anterior" style="background:#1b2230;color:#dbe6f5;border:1px solid #33415c;border-radius:4px;cursor:pointer;padding:1px 7px">◀</button>
        <select class="hk-d2-en" style="background:#1b2230;color:#dbe6f5;border:1px solid #33415c;border-radius:4px"></select>
        <button class="hk-d2-sig" title="pórtico siguiente" style="background:#1b2230;color:#dbe6f5;border:1px solid #33415c;border-radius:4px;cursor:pointer;padding:1px 7px">▶</button>
        <button class="hk-d2-x" style="background:#7a2d2d;color:#fff;border:1px solid #b04545;border-radius:4px;cursor:pointer;padding:2px 9px">✕</button>
      </div>
      <svg class="hk-d2-svg" style="flex:1;width:100%;height:100%"></svg>
      <div class="hk-d2-pie" style="padding:4px 10px;color:#6f7d90;border-top:1px solid #1d2533"></div>`;
    document.body.appendChild(host);
    host.querySelector(".hk-d2-x")!.addEventListener("click", () => { host!.hidden = true; });
    const selP = host.querySelector(".hk-d2-plano") as HTMLSelectElement;
    const selE = host.querySelector(".hk-d2-en") as HTMLSelectElement;
    selP.addEventListener("change", () => {
      estado = { plano: selP.value as Plano, en: cotas(selP.value as Plano)[0] ?? 0 };
      pintar();
    });
    selE.addEventListener("change", () => { estado.en = Number(selE.value); pintar(); });
    // ◀ ▶ — de un pórtico al siguiente sin abrir el desplegable
    const paso = (d: number) => {
      const l = cotas(estado.plano);
      const i = l.findIndex((c) => Math.abs(c - estado.en) < TOL);
      const j = Math.max(0, Math.min(l.length - 1, (i < 0 ? 0 : i) + d));
      if (l.length) { estado.en = l[j]; pintar(); }
    };
    host.querySelector(".hk-d2-ant")!.addEventListener("click", () => paso(-1));
    host.querySelector(".hk-d2-sig")!.addEventListener("click", () => paso(+1));
    // se arrastra por la barra, como las demás ventanas del programa
    const bar = host.querySelector(".hk-d2-bar") as HTMLDivElement;
    let arr: { x: number; y: number; l: number; t: number } | null = null;
    bar.addEventListener("pointerdown", (e) => {
      if ((e.target as HTMLElement).closest("select,button")) return;
      const r = host!.getBoundingClientRect();
      arr = { x: e.clientX, y: e.clientY, l: r.left, t: r.top };
      host!.style.transform = "none"; host!.style.left = r.left + "px"; host!.style.top = r.top + "px";
    });
    window.addEventListener("pointermove", (e) => {
      if (!arr || !host) return;
      host.style.left = arr.l + e.clientX - arr.x + "px";
      host.style.top = arr.t + e.clientY - arr.y + "px";
    });
    window.addEventListener("pointerup", () => { arr = null; });
    new ResizeObserver(() => { if (host && !host.hidden) pintar(); }).observe(host);
  }

  function pintar() {
    if (!host || host.hidden) return;
    const enGrafico = new Set<number>(hostB && !hostB.hidden && barraActual >= 0 ? cadenaDe(barraActual) : []);
    const svg = host.querySelector(".hk-d2-svg") as SVGSVGElement;
    const tit = host.querySelector(".hk-d2-tit") as HTMLSpanElement;
    const pie = host.querySelector(".hk-d2-pie") as HTMLDivElement;
    const selP = host.querySelector(".hk-d2-plano") as HTMLSelectElement;
    const selE = host.querySelector(".hk-d2-en") as HTMLSelectElement;
    selP.value = estado.plano;
    const lista = cotas(estado.plano);
    const eje = estado.plano === "XZ" ? "y" : estado.plano === "YZ" ? "x" : "z";
    // «Pórtico 2 · y = 6,00 m», no una coordenada suelta: con varios pórticos planos
    // Jorge no sabía cuál estaba mirando ni cómo elegir otro.
    const quien = estado.plano === "XY" ? "Planta" : "Pórtico";
    selE.innerHTML = lista.map((c, n) =>
      `<option value="${c}" ${Math.abs(c - estado.en) < TOL ? "selected" : ""}>${quien} ${n + 1} · ${eje} = ${c.toFixed(2)} m</option>`).join("");

    const clave = resultadoActual();
    const N = mesh.nodes?.rawVal ?? [];
    const E = mesh.elements?.rawVal ?? [];
    const R = clave ? mesh.analyzeOutputs?.rawVal?.[clave] : null;
    svg.innerHTML = "";
    const W = svg.clientWidth || 880, H = svg.clientHeight || 480;

    // las barras de ESTE plano
    const barras: { i: number; a: { u: number; v: number }; b: { u: number; v: number } }[] = [];
    E.forEach((e, i) => {
      if (e.length !== 2) return;
      const a = N[e[0]], b = N[e[1]];
      if (!a || !b) return;
      const pa = proyectar(a, estado.plano), pb = proyectar(b, estado.plano);
      if (Math.abs(pa.fuera - estado.en) < TOL && Math.abs(pb.fuera - estado.en) < TOL)
        barras.push({ i, a: pa, b: pb });
    });
    if (!barras.length) {
      pie.textContent = "No hay barras en este plano.";
      tit.textContent = "";
      return;
    }
    // encuadre: el plano entero con margen, sin deformar (misma escala en u y v)
    let umin = Infinity, umax = -Infinity, vmin = Infinity, vmax = -Infinity;
    for (const b of barras) for (const p of [b.a, b.b]) {
      umin = Math.min(umin, p.u); umax = Math.max(umax, p.u);
      vmin = Math.min(vmin, p.v); vmax = Math.max(vmax, p.v);
    }
    const du = umax - umin || 1, dv = vmax - vmin || 1;
    const M = 70;                                   // margen en px (los rótulos van fuera de la barra)
    const esc = Math.min((W - 2 * M) / du, (H - 2 * M) / dv);
    const ox = (W - du * esc) / 2, oy = (H - dv * esc) / 2;
    const px = (u: number) => ox + (u - umin) * esc;
    const py = (v: number) => H - (oy + (v - vmin) * esc);   // v hacia ARRIBA en pantalla

    const NS = "http://www.w3.org/2000/svg";
    const el = (t: string, at: Record<string, string | number>, txt?: string) => {
      const e = document.createElementNS(NS, t);
      for (const k in at) e.setAttribute(k, String(at[k]));
      if (txt != null) e.textContent = txt;
      svg.appendChild(e);
      return e;
    };

    // el máximo del plano: fija la escala del diagrama (el mayor, al 12 % del lado)
    let vmaxAbs = 0;
    if (R) for (const b of barras) {
      const r = R instanceof Map ? R.get(b.i) : R[b.i];
      if (r) vmaxAbs = Math.max(vmaxAbs, Math.abs(r[0] ?? 0), Math.abs(r[1] ?? 0));
    }
    const altoDiag = 0.12 * Math.max(du, dv) * esc;
    const k = vmaxAbs > 0 ? altoDiag / vmaxAbs : 0;
    const esMomento = clave === "bendingsY" || clave === "bendingsZ";
    const fmt = (x: number) => Math.abs(x) >= 100 ? x.toFixed(1) : Math.abs(x) >= 10 ? x.toFixed(2) : x.toFixed(3);

    // los valores por NUDO de barra, para escribir solo los que aportan
    const rotulos: { x: number; y: number; t: string; peso: number }[] = [];
    for (const b of barras) {
      const x1 = px(b.a.u), y1 = py(b.a.v), x2 = px(b.b.u), y2 = py(b.b.v);
      const L = Math.hypot(x2 - x1, y2 - y1) || 1;
      // hacia dónde va un valor POSITIVO: el lado de ETABS (momento → la cara que
      // tracciona), proyectado en el plano. Si el resultado se dibuja fuera del plano
      // (el M2 de una viga vista en alzado), la normal a la barra, abajo el momento.
      const ang = mesh.elementInputs?.rawVal?.localAngles?.get?.(b.i) ?? 0;
      const lado = ladoPositivo(clave!, ejesCSI(N[E[b.i][0]], N[E[b.i][1]], ang));
      const pl = proyectar(lado, estado.plano);
      let nx = pl.u, ny = -pl.v;                     // en pantalla la y crece hacia abajo
      const ln = Math.hypot(nx, ny);
      if (ln > 0.3) { nx /= ln; ny /= ln; }
      else {
        nx = (y2 - y1) / L; ny = -(x2 - x1) / L;
        if (esMomento && ny < 0) { nx = -nx; ny = -ny; }
      }
      const r = R ? (R instanceof Map ? R.get(b.i) : R[b.i]) : null;
      // ⚠️ El par es de FUERZAS DE EXTREMO, no del diagrama: tomándolo tal cual la viga
      // salía en dientes de sierra (21,38 a un lado del nudo y −21,38 al otro). En el
      // nudo i el diagrama es −r0 y en el j +r1 (M2 al revés): `diagramaCSI`.
      const [v1, v2] = r ? diagramaCSI(clave!, r) : [0, 0];
      if (r && k > 0) {
        const s = esMomento ? 1 : 1;
        const p1 = [x1 + nx * v1 * k * s, y1 + ny * v1 * k * s];
        const p2 = [x2 + nx * v2 * k * s, y2 + ny * v2 * k * s];
        const colorPos = "#3fa7d6", colorNeg = "#d9534f";
        const color = (v1 + v2) >= 0 ? colorPos : colorNeg;
        el("polygon", { points: `${x1},${y1} ${p1[0]},${p1[1]} ${p2[0]},${p2[1]} ${x2},${y2}`,
          fill: color, "fill-opacity": 0.38, stroke: color, "stroke-width": 1.2 });
        rotulos.push({ x: p1[0] + nx * 12, y: p1[1] + ny * 12, t: fmt(v1), peso: Math.abs(v1) });
        rotulos.push({ x: p2[0] + nx * 12, y: p2[1] + ny * 12, t: fmt(v2), peso: Math.abs(v2) });
      }
      el("line", { x1, y1, x2, y2, stroke: "#e6ecf5", "stroke-width": 2.2, "stroke-linecap": "round" });
      // la barra cuyo gráfico está abierto, en amarillo: se sabe cuál se está mirando
      if (enGrafico.has(b.i))
        el("line", { x1, y1, x2, y2, stroke: "#e6c463", "stroke-width": 5, "stroke-linecap": "round" });
      // una línea gorda e invisible encima, para poder pulsar la barra con el ratón
      const toque = el("line", { x1, y1, x2, y2, stroke: "transparent", "stroke-width": 14,
        style: "cursor:pointer;pointer-events:stroke" });
      toque.addEventListener("click", () => abrirBarra(b.i));
      const ttl = document.createElementNS(NS, "title");
      ttl.textContent = "Clic: gráfico de esta barra (axil, cortante, momento)";
      toque.appendChild(ttl);
    }
    // los apoyos del plano (nudos con z mínima), para situarse
    for (const b of barras) for (const p of [b.a, b.b])
      if (estado.plano !== "XY" && Math.abs(p.v - vmin) < TOL)
        el("rect", { x: px(p.u) - 6, y: py(p.v), width: 12, height: 7, fill: "#b03a3a" });

    // rótulos: sin repetir dos casi iguales en el mismo sitio, y los menores
    // del 2 % del máximo fuera — si no, un pórtico de diez tramos es ilegible
    const puestos: { x: number; y: number }[] = [];
    rotulos.sort((a, b) => b.peso - a.peso);
    for (const r of rotulos) {
      if (r.peso < 0.02 * vmaxAbs) continue;
      if (puestos.some((q) => Math.hypot(q.x - r.x, q.y - r.y) < 34)) continue;
      puestos.push(r);
      const t = el("text", { x: r.x, y: r.y + 4, "text-anchor": "middle", fill: "#f2f5fa",
        "font-size": 12, "font-weight": 600, "paint-order": "stroke", stroke: "#0b0e14",
        "stroke-width": 3 }, r.t);
      void t;
    }

    const nombre = clave ? (NOMBRE[clave] ?? clave) : "sin resultado";
    tit.textContent = `${nombre} · ${estado.plano === "XY" ? "planta" : "alzado"} ${estado.plano} en ${eje} = ${estado.en.toFixed(2)} m`;
    pie.textContent = !clave
      ? "Elegí un resultado en «Frame results» (Axial, Cortante, Momento) para ver su diagrama aquí."
      : `${barras.length} barras en el plano · máximo ${fmt(vmaxAbs)} ${UNIDAD[clave] ?? ""}` +
        (esMomento ? " · el momento va del lado de la tracción" : "") +
        " · clic en una barra: su gráfico";
  }

  // se repinta solo cuando cambia el resultado o se recalcula el modelo
  const repintar = () => { try { pintar(); } catch { /* ventana cerrada o sin modelo */ } };
  settings?.frameResults && (window as any).van?.derive?.(() => { settings.frameResults.val; repintar(); });
  let ultimo: any = null;
  setInterval(() => {
    const a = mesh.analyzeOutputs?.rawVal, f = settings?.frameResults?.rawVal;
    const firma = [a, f];
    if (ultimo && ultimo[0] === a && ultimo[1] === f) return;
    ultimo = firma;
    repintar();
    try { pintarBarra(); } catch { /* sin barra abierta */ }
  }, 400);


  // ════════════════════════════════════════════════════════════════════════════
  //  GRÁFICO DE UNA BARRA — el «Diagram for Frame Object» de ETABS
  //
  //  La barra que se ve en pantalla suele estar PARTIDA en tramos (la malla). ETABS
  //  enseña el objeto entero, de nudo a nudo del pórtico, así que aquí también: desde
  //  el tramo pulsado se sigue por los nudos donde solo hay otro tramo alineado.
  // ════════════════════════════════════════════════════════════════════════════
  let hostB: HTMLDivElement | null = null;
  let barraActual = -1;
  let planoLocal: "12" | "13" = "12";

  function cadenaDe(e0: number): number[] {
    const N = mesh.nodes?.rawVal ?? [], E = mesh.elements?.rawVal ?? [];
    const porNudo = new Map<number, number[]>();
    E.forEach((e, i) => {
      if (e.length !== 2) return;
      for (const n of e) { if (!porNudo.has(n)) porNudo.set(n, []); porNudo.get(n)!.push(i); }
    });
    const dir = (i: number) => {
      const a = N[E[i][0]], b = N[E[i][1]];
      const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], L = Math.hypot(d[0], d[1], d[2]) || 1;
      return d.map((x) => x / L);
    };
    const alineado = (i: number, j: number) => {
      const a = dir(i), b = dir(j);
      return Math.abs(a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) > 0.9999;
    };
    const cadena = [e0];
    for (const lado of [0, 1]) {                 // hacia el nudo i y hacia el nudo j
      let actual = e0, nudo = E[e0][lado];
      for (let guard = 0; guard < 500; guard++) {
        // en ese nudo tiene que haber UN solo tramo más, y alineado; si llega otra
        // barra (una viga a la columna, por ejemplo) ahí se acaba el objeto
        const otros = (porNudo.get(nudo) ?? []).filter((x) => x !== actual);
        if (otros.length !== 1 || !alineado(actual, otros[0])) break;
        const sig = otros[0];
        if (lado === 0) cadena.unshift(sig); else cadena.push(sig);
        nudo = E[sig][0] === nudo ? E[sig][1] : E[sig][0];
        actual = sig;
      }
    }
    return cadena;
  }

  function abrirBarra(e0?: number) {
    if (e0 == null) {
      const sel = ((window as any).__hekatanModelSelection as any[] | undefined) ?? [];
      const fr = [...sel].reverse().find((x) => x.type === "frame");
      if (!fr) { alert("Designá una barra (clic sobre ella) y volvé a pulsar."); return; }
      e0 = fr.idx;
    }
    barraActual = e0 as number;
    if (!hostB) {
      hostB = document.createElement("div");
      hostB.id = "hk-diagrama-barra";
      hostB.style.cssText = [
        "position:fixed", "right:24px", "top:90px", "width:min(620px,92vw)", "z-index:9991",
        "background:#0b0e14", "border:1px solid #2f3b50", "border-radius:8px",
        "box-shadow:0 12px 40px rgba(0,0,0,.6)", "font:12px 'Segoe UI',system-ui,sans-serif",
        "color:#c9d3e0",
      ].join(";");
      hostB.innerHTML =
        '<div style="display:flex;align-items:center;gap:10px;padding:7px 10px;background:#141a24;border-bottom:1px solid #2f3b50">' +
        '<b style="color:#e6c463">📈 Barra</b><span class="hk-b-tit" style="color:#9fb0c6"></span>' +
        '<select class="hk-b-pl" style="margin-left:auto;background:#1b2230;color:#dbe6f5;border:1px solid #33415c;border-radius:4px">' +
        '<option value="12">plano 1-2 (V2 · M3)</option><option value="13">plano 1-3 (V3 · M2)</option></select>' +
        '<button class="hk-b-x" style="background:#7a2d2d;color:#fff;border:1px solid #b04545;border-radius:4px;cursor:pointer;padding:2px 9px">✕</button>' +
        '</div><div class="hk-b-cuerpo" style="padding:6px 10px 10px"></div>';
      document.body.appendChild(hostB);
      hostB.querySelector(".hk-b-x")!.addEventListener("click", () => { hostB!.hidden = true; acomodar(); pintar(); });
      (hostB.querySelector(".hk-b-pl") as HTMLSelectElement).addEventListener("change", (ev) => {
        planoLocal = (ev.target as HTMLSelectElement).value as "12" | "13";
        pintarBarra();
      });
    }
    hostB.hidden = false;
    acomodar();
    pintarBarra();
    pintar();
  }

  // Las dos ventanas a la vez: el alzado a la izquierda y el gráfico de la barra a la
  // derecha, lado a lado. Encima una de otra tapaban el ◀ ▶ y medio pórtico.
  function acomodar() {
    if (!host || !hostB) return;
    const W = window.innerWidth, ancho = Math.min(560, Math.round(W * 0.4));
    hostB.style.width = ancho + "px";
    if (!hostB.hidden && !host.hidden) {
      host.style.transform = "none";
      host.style.left = "12px";
      host.style.width = W - ancho - 36 + "px";
      hostB.style.top = host.getBoundingClientRect().top + "px";
    } else if (!host.hidden) {
      host.style.left = "50%"; host.style.transform = "translateX(-50%)";
      host.style.width = "min(900px,92vw)";
    }
  }

  function pintarBarra() {
    if (!hostB || hostB.hidden || barraActual < 0) return;
    const N = mesh.nodes?.rawVal ?? [], E = mesh.elements?.rawVal ?? [];
    const A = mesh.analyzeOutputs?.rawVal ?? {};
    if (!E[barraActual]) return;
    const cad = cadenaDe(barraActual);
    // estaciones a lo largo de la barra: x desde su primer nudo
    const pts: { x: number; e: number; fin: 0 | 1 }[] = [];
    let x = 0, nudoPrev = -1;
    cad.forEach((i, k) => {
      const [a, b] = E[i];
      // ¿el tramo va en el sentido de la cadena? Si no, se recorre al revés
      const alReves = k === 0 ? (cad.length > 1 && E[cad[1]].includes(a)) : a !== nudoPrev;
      const ini = alReves ? b : a, fin = alReves ? a : b;
      const L = Math.hypot(N[fin][0] - N[ini][0], N[fin][1] - N[ini][1], N[fin][2] - N[ini][2]);
      pts.push({ x, e: i, fin: alReves ? 1 : 0 });
      x += L;
      pts.push({ x, e: i, fin: alReves ? 0 : 1 });
      nudoPrev = fin;
    });
    const Ltot = x;
    // el valor del DIAGRAMA en un extremo de tramo, con el signo de ETABS
    // (el par del cálculo son fuerzas de extremo: `diagramaCSI`, igual que el 3D)
    const valor = (clave: string, p: { e: number; fin: 0 | 1 }) => {
      const R = (A as any)[clave];
      const r = R ? (R instanceof Map ? R.get(p.e) : R[p.e]) : null;
      return r ? diagramaCSI(clave, r)[p.fin] : 0;
    };
    const a0 = N[E[cad[0]][0]], z = (v: number) => v.toFixed(2);
    (hostB.querySelector(".hk-b-tit") as HTMLSpanElement).textContent =
      "L = " + Ltot.toFixed(2) + " m · " + cad.length + " tramo(s) · desde (" +
      z(a0[0]) + ", " + z(a0[1]) + ", " + z(a0[2]) + ")";
    const graficos: [string, string, string, boolean][] = planoLocal === "12"
      ? [["normals", "Axial P", "kN", false], ["shearsY", "Cortante V2", "kN", false], ["bendingsZ", "Momento M3", "kN·m", true]]
      : [["normals", "Axial P", "kN", false], ["shearsZ", "Cortante V3", "kN", false], ["bendingsY", "Momento M2", "kN·m", true]];
    const cuerpo = hostB.querySelector(".hk-b-cuerpo") as HTMLDivElement;
    cuerpo.innerHTML = "";
    const W = Math.max(300, cuerpo.clientWidth), H = 124, M = 46;
    const yc = (H - 14) / 2;                     // el eje; abajo queda la franja de 0 … L
    for (const [clave, nombre, unidad, invertido] of graficos) {
      const vs = pts.map((p) => valor(clave, p));
      const vmax = Math.max(...vs), vmin = Math.min(...vs);
      const amp = Math.max(Math.abs(vmax), Math.abs(vmin)) || 1;
      const px = (xx: number) => M + (xx / (Ltot || 1)) * (W - 2 * M);
      // el MOMENTO, positivo hacia abajo (del lado de la tracción); el resto, hacia arriba
      const py = (v: number) => yc + (invertido ? 1 : -1) * (v / amp) * (yc - 16);
      const fmt = (v: number) => Math.abs(v) >= 100 ? v.toFixed(1) : Math.abs(v) >= 10 ? v.toFixed(2) : v.toFixed(3);
      let poli = px(0) + "," + yc + " ";
      pts.forEach((p, k) => { poli += px(p.x) + "," + py(vs[k]) + " "; });
      poli += px(Ltot) + "," + yc;
      const iMax = vs.indexOf(vmax), iMin = vs.indexOf(vmin);
      const rot = (i: number, color: string) => {
        const yy = py(vs[i]) + (py(vs[i]) < yc ? -5 : 13);
        return '<text x="' + px(pts[i].x) + '" y="' + yy + '" text-anchor="middle" fill="' + color +
          '" font-size="11" font-weight="700" paint-order="stroke" stroke="#0b0e14" stroke-width="3">' +
          fmt(vs[i]) + "</text>";
      };
      const color = invertido ? "#d9534f" : "#3fa7d6";
      cuerpo.insertAdjacentHTML("beforeend",
        '<div style="display:flex;justify-content:space-between;margin-top:4px">' +
        '<b style="color:#dbe6f5">' + nombre + ' <span style="color:#6f7d90;font-weight:400">(' + unidad + ")</span></b>" +
        '<span style="color:#9fb0c6">máx ' + fmt(vmax) + " · mín " + fmt(vmin) +
        (invertido ? " · positivo hacia abajo" : "") + "</span></div>" +
        '<svg width="' + W + '" height="' + H + '" style="display:block;background:#0e131c;border-radius:4px">' +
        '<line x1="' + M + '" y1="' + yc + '" x2="' + (W - M) + '" y2="' + yc + '" stroke="#e6ecf5" stroke-width="2"/>' +
        '<polygon points="' + poli + '" fill="' + color + '" fill-opacity=".35" stroke="' + color + '" stroke-width="1.4"/>' +
        rot(0, "#f2f5fa") + rot(pts.length - 1, "#f2f5fa") +
        (iMax > 0 && iMax < pts.length - 1 ? rot(iMax, "#8fd3ff") : "") +
        (iMin > 0 && iMin < pts.length - 1 && iMin !== iMax ? rot(iMin, "#ff9f9a") : "") +
        '<text x="' + M + '" y="' + (H - 3) + '" fill="#6f7d90" font-size="10" text-anchor="middle">0</text>' +
        '<text x="' + (W - M) + '" y="' + (H - 3) + '" fill="#6f7d90" font-size="10" text-anchor="middle">' +
        Ltot.toFixed(2) + " m</text></svg>");
    }
  }
  (window as any).__hekatanDiagramaBarra = abrirBarra;

  (window as any).__hekatanDiagrama2D = abrir;
  return { abrir, abrirBarra };
}
