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
 * El MOMENTO se dibuja del lado de la tracción, que es del lado del acero: positivo
 * hacia ABAJO en una viga (el eje invertido de las estructuras). Cortante y axil, al
 * lado izquierdo de la barra según va de su nudo i a su nudo j.
 *
 *   window.__hekatanDiagrama2D()                  abre la ventana (plano por defecto:
 *                                                  el de la barra designada, si hay)
 *   window.__hekatanDiagrama2D({ plano: "XZ", en: 0 })
 */
import type { State } from "vanjs-core";

type Nodo = number[];
type Plano = "XZ" | "YZ" | "XY";

interface Malla {
  nodes?: State<Nodo[]>;
  elements?: State<number[][]>;
  analyzeOutputs?: State<any>;
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
        <label>en <select class="hk-d2-en" style="background:#1b2230;color:#dbe6f5;border:1px solid #33415c;border-radius:4px"></select></label>
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
    const svg = host.querySelector(".hk-d2-svg") as SVGSVGElement;
    const tit = host.querySelector(".hk-d2-tit") as HTMLSpanElement;
    const pie = host.querySelector(".hk-d2-pie") as HTMLDivElement;
    const selP = host.querySelector(".hk-d2-plano") as HTMLSelectElement;
    const selE = host.querySelector(".hk-d2-en") as HTMLSelectElement;
    selP.value = estado.plano;
    const lista = cotas(estado.plano);
    const eje = estado.plano === "XZ" ? "y" : estado.plano === "YZ" ? "x" : "z";
    selE.innerHTML = lista.map((c) =>
      `<option value="${c}" ${Math.abs(c - estado.en) < TOL ? "selected" : ""}>${eje} = ${c.toFixed(2)} m</option>`).join("");

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
      // normal «izquierda» en pantalla (y crece hacia abajo): (dy, -dx)/L
      let nx = (y2 - y1) / L, ny = -(x2 - x1) / L;
      // el momento, del lado de la tracción: positivo hacia ABAJO en una viga. En
      // pantalla «abajo» es +y, así que se voltea la normal si apunta hacia arriba.
      if (esMomento && ny < 0) { nx = -nx; ny = -ny; }
      const r = R ? (R instanceof Map ? R.get(b.i) : R[b.i]) : null;
      // ⚠️ El par es de FUERZAS DE EXTREMO, no del diagrama: en el nudo j el diagrama
      // vale −r[1]. Tomándolo tal cual, la viga salía en dientes de sierra — 21,38 a un
      // lado del nudo y −21,38 al otro —. Es la misma conversión que hace el 3D
      // (`LinearResult`: el rótulo del extremo 2 es `result[1] * -1`).
      const v1 = r ? Number(r[0] ?? 0) : 0, v2 = r ? -Number(r[1] ?? 0) : 0;
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
        (esMomento ? " · el momento va del lado de la tracción" : "");
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
  }, 400);

  (window as any).__hekatanDiagrama2D = abrir;
  return { abrir };
}
