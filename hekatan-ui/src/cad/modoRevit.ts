/**
 * MODO REVIT — dibujar la estructura como en Revit / ETABS (17-oct-2026).
 *
 * Jorge, tras ver la prueba con el ratón real: «la interfaz está horrible, no es viable modelar así»,
 * «le faltan herramientas más simples, no tiene niveles como ETABS», «que tenga una interfaz como Revit,
 * que es la forma más rápida de dibujar».
 *
 * Lo que hace rápido a Revit (y a ETABS), y es lo que hay aquí:
 *   · NAVEGADOR DE NIVELES: la planta de cada nivel es una vista; un clic en «N+6.00» y se dibuja ahí.
 *   · HERRAMIENTAS POR OBJETO, no por geometría: Columna, Viga, Losa, Muro (no «línea» ni «área»).
 *   · BARRA DE OPCIONES de la herramienta: «En ejes» (todas las columnas o vigas del nivel de un clic),
 *     «Cadena», «Todas las losas».
 *   · El clic se ENGANCHA a los cruces de ejes y a los nudos; la columna va del nivel de abajo al
 *     activo («Profundidad», el defecto de Revit para columnas estructurales y lo que hace ETABS).
 *   · Atajos de dos letras de Revit: CL columna, BM viga, SB losa, WA muro, GR ejes, LL nivel.
 *
 * Escribe en los MISMOS datos del dibujo (puntos, polilíneas, áreas): lo demás de Struct —calcular,
 * exportar a ETABS/SAP2000, el .heks— no cambia. Un nudo en el mismo sitio se reutiliza y una barra o
 * paño que ya existe no se duplica.
 */
import * as THREE from "three";

type V3 = [number, number, number];
type Herr = "modificar" | "columna" | "viga" | "losa" | "muro";
const W = () => window as any;
const LS = "hk_modo_revit";

export interface ModoRevitHooks {
  setView: (v: "iso" | "plan" | "elevX" | "elevY") => void;
  setPlane: (k: "xy" | "xz" | "yz") => void;
  /** pliega / despliega la cinta clásica */
  cinta: (visible: boolean) => void;
  encendidoPorDefecto?: boolean;
}

export function addModoRevit(viewerElm: HTMLElement, host: HTMLElement, hooks: ModoRevitHooks) {
  if (document.getElementById("hk-revit")) return;
  const ctx = () => (viewerElm as any).__ctx as { scene: THREE.Scene; camera: THREE.Camera; render: () => void } | undefined;
  const canvas = () => viewerElm.querySelector("canvas") as HTMLCanvasElement | null;

  // ── datos ───────────────────────────────────────────────────────────────
  const niveles = (): { label: string; z: number }[] => {
    const L = (W().__hekatanLevels ?? []) as { label: string; z: number; tipo?: string }[];
    const pisos = L.filter((l) => l.tipo !== "aux");
    return [...pisos].sort((a, b) => a.z - b.z);
  };
  const asegurarNiveles = () => {
    const L = W().__hekatanLevels as { label: string; z: number }[] | undefined;
    if (!L) return;
    if (!L.length) { L.push({ label: "N+0.00", z: 0 }, { label: "N+3.00", z: 3 }); W().__hekatanRefreshLevels?.(); }
  };
  const ejes = () => {
    const A = (W().__hekatanAxisGrids ?? []) as { label: string; start: number[]; end: number[] }[];
    const xs = new Set<number>(), ys = new Set<number>();
    for (const a of A) {
      if (Math.abs(a.start[0] - a.end[0]) < 1e-6) xs.add(+a.start[0].toFixed(6));
      else if (Math.abs(a.start[1] - a.end[1]) < 1e-6) ys.add(+a.start[1].toFixed(6));
    }
    return { xs: [...xs].sort((a, b) => a - b), ys: [...ys].sort((a, b) => a - b) };
  };
  let zAct = 0;
  const nivelAbajo = (z: number) => { const N = niveles().filter((l) => l.z < z - 1e-6); return N.length ? N[N.length - 1].z : null; };
  const nivelArriba = (z: number) => niveles().find((l) => l.z > z + 1e-6)?.z ?? null;
  /** tramo vertical de lo que se pone en el nivel activo: del de abajo al activo (o al de arriba si es el más bajo) */
  const tramo = (z: number): [number, number] | null => {
    const ab = nivelAbajo(z); if (ab != null) return [ab, z];
    const ar = nivelArriba(z); return ar != null ? [z, ar] : null;
  };

  // ── escribir en el dibujo (una sola asignación por operación) ───────────
  const editar = (fn: (e: { punto: (p: V3) => number; barra: (a: V3, b: V3) => boolean; area: (ps: V3[]) => boolean }) => void) => {
    const Pw = W().__hekatanDrawingPoints, PLw = W().__hekatanDrawingPolylines, Aw = W().__hekatanDrawingAreas;
    if (!Pw || !PLw) return 0;
    const P: number[][] = [...Pw.rawVal];
    let PL: number[][] = [...PLw.rawVal];
    if (PL.length && PL[PL.length - 1].length === 0) PL = PL.slice(0, -1);
    const A: number[] = [...(Aw?.rawVal ?? [])];
    const areaSet = new Set(A);
    const k = (p: number[]) => p.map((v) => Math.round(v * 1e4)).join(",");
    const enP = new Map<string, number>(); P.forEach((p, i) => { if (p && !enP.has(k(p))) enP.set(k(p), i); });
    const firma = (pl: number[], ar: boolean) => (ar ? "A" : "L") + [...new Set(pl.map((i) => k(P[i])))].sort().join("|");
    const hay = new Set<string>(); PL.forEach((pl, i) => { if (pl.length >= 2) hay.add(firma(pl, areaSet.has(i))); });
    let n = 0;
    const punto = (p: V3) => { const c = enP.get(k(p)); if (c != null) return c; P.push(p); enP.set(k(p), P.length - 1); return P.length - 1; };
    const barra = (a: V3, b: V3) => {
      const pl = [punto(a), punto(b)]; if (pl[0] === pl[1]) return false;
      const f = firma(pl, false); if (hay.has(f)) return false; hay.add(f); PL.push(pl); n++; return true;
    };
    const area = (ps: V3[]) => {
      const ids = ps.map(punto); const pl = [...ids, ids[0]];
      const f = firma(pl, true); if (hay.has(f)) return false; hay.add(f); PL.push(pl); A.push(PL.length - 1); n++; return true;
    };
    W().__hekatanPushUndo?.();
    fn({ punto, barra, area });
    PL.push([]);
    // El rebuild REENCUADRA la cámara al modelo: con una sola columna hacía un zoom enorme y los
    // clics siguientes caían en otro sitio (medido en el navegador). En Revit dibujar no mueve la vista.
    const c: any = (viewerElm as any).__ctx;
    const foto = c && {
      cam: c.camera, pos: c.camera.position.clone(), up: c.camera.up.clone(), zoom: c.camera.zoom,
      lrtb: [c.camera.left, c.camera.right, c.camera.top, c.camera.bottom], tgt: c.controls?.target?.clone(),
    };
    const reponer = () => {
      if (!foto) return;
      if (c.camera !== foto.cam) c.setActiveCamera?.(foto.cam);
      const k = foto.cam; k.position.copy(foto.pos); k.up.copy(foto.up); k.zoom = foto.zoom;
      if (k.isOrthographicCamera) [k.left, k.right, k.top, k.bottom] = foto.lrtb;
      if (foto.tgt) { c.controls.target.copy(foto.tgt); k.lookAt(foto.tgt); }
      k.updateProjectionMatrix(); c.controls?.update?.(); c.render?.();
    };
    Pw.val = P; PLw.val = PL; if (Aw) Aw.val = A;
    try { W().__hekatanRebuild?.(); } catch {}
    reponer(); setTimeout(reponer, 60); setTimeout(reponer, 400);
    return n;
  };

  // ── UI ──────────────────────────────────────────────────────────────────
  const css = document.createElement("style");
  css.textContent = `
  #hk-revit{position:absolute;inset:0;pointer-events:none;z-index:55;font:12px system-ui,-apple-system,Segoe UI,sans-serif;color:#dbeafe}
  #hk-revit .rv-bar{pointer-events:auto;position:absolute;left:50%;transform:translateX(-50%);top:8px;display:flex;gap:4px;align-items:stretch;
    background:rgba(15,23,42,.96);border:1px solid #1e3a4a;border-radius:10px;padding:5px;box-shadow:0 6px 20px rgba(0,0,0,.45)}
  #hk-revit .rv-b{display:flex;flex-direction:column;align-items:center;justify-content:center;min-width:58px;padding:4px 6px;border:1px solid transparent;
    border-radius:7px;background:transparent;color:#dbeafe;cursor:pointer;font:600 11px inherit}
  #hk-revit .rv-b .ic{font-size:20px;line-height:22px}
  #hk-revit .rv-b .ta{font:10px Consolas,monospace;color:#64748b}
  #hk-revit .rv-b:hover{background:#12304a}
  #hk-revit .rv-b.on{background:#0e7490;border-color:#22d3ee;color:#fff}
  #hk-revit .rv-sep{width:1px;background:#1e3a4a;margin:2px 3px}
  #hk-revit .rv-op{pointer-events:auto;position:absolute;left:50%;transform:translateX(-50%);top:74px;display:none;gap:8px;align-items:center;
    background:rgba(8,47,73,.96);border:1px solid #0e7490;border-radius:8px;padding:5px 10px;white-space:nowrap}
  #hk-revit .rv-op button{height:24px;padding:0 10px;border-radius:6px;border:1px solid #22d3ee;background:#0e7490;color:#ecfeff;font:600 11px inherit;cursor:pointer}
  #hk-revit .rv-op input[type=text]{width:46px;height:22px;background:#0a1622;border:1px solid #1e3a4a;border-radius:5px;color:#cdeefb;text-align:center;font:12px Consolas,monospace}
  #hk-revit .rv-nav{pointer-events:auto;position:absolute;right:8px;top:48px;width:150px;background:rgba(15,23,42,.96);border:1px solid #1e3a4a;border-radius:10px;padding:6px}
  #hk-revit .rv-nav h4{margin:2px 4px 6px;font:700 11px inherit;color:#7dd3fc;letter-spacing:.4px}
  #hk-revit .rv-niv{display:flex;justify-content:space-between;padding:5px 8px;border-radius:6px;cursor:pointer;font:12px Consolas,monospace}
  #hk-revit .rv-niv:hover{background:#12304a}
  #hk-revit .rv-niv.on{background:#0e7490;color:#fff}
  #hk-revit .rv-nav .rv-mini{display:flex;gap:4px;margin-top:6px}
  #hk-revit .rv-nav .rv-mini button{flex:1;height:24px;border-radius:6px;border:1px solid #1e3a4a;background:#0a1622;color:#cdeefb;cursor:pointer;font:600 11px inherit}
  #hk-revit .rv-msg{position:absolute;left:50%;transform:translateX(-50%);bottom:10px;background:rgba(15,23,42,.92);border:1px solid #1e3a4a;
    border-radius:8px;padding:5px 12px;color:#cbd5e1;font:12px inherit;pointer-events:none;max-width:70%;text-align:center}
  body.hk-revit-on #hk-ribbon-abrir,body.hk-revit-on #hk-dyn{display:none!important}
  #hk-revit-toggle{position:absolute;right:10px;top:8px;z-index:56;height:30px;padding:0 12px;border-radius:8px;border:1px solid #22d3ee;
    background:#0e7490;color:#ecfeff;font:600 12px system-ui,sans-serif;cursor:pointer;pointer-events:auto}`;
  document.head.appendChild(css);

  const raiz = document.createElement("div"); raiz.id = "hk-revit";
  const barra = document.createElement("div"); barra.className = "rv-bar";
  const opc = document.createElement("div"); opc.className = "rv-op";
  const nav = document.createElement("div"); nav.className = "rv-nav";
  const msg = document.createElement("div"); msg.className = "rv-msg";
  raiz.append(barra, opc, nav, msg);
  const decir = (t: string) => { msg.textContent = t; };

  const HERR: { id: Herr | "ejes" | "cinta"; ic: string; tx: string; ta: string }[] = [
    { id: "modificar", ic: "⬉", tx: "Modificar", ta: "Esc" },
    { id: "ejes", ic: "#", tx: "Ejes", ta: "GR" },
    { id: "columna", ic: "▮", tx: "Columna", ta: "CL" },
    { id: "viga", ic: "━", tx: "Viga", ta: "BM" },
    { id: "losa", ic: "▦", tx: "Losa", ta: "SB" },
    { id: "muro", ic: "▥", tx: "Muro", ta: "WA" },
  ];
  const botones = new Map<string, HTMLButtonElement>();
  HERR.forEach((h, i) => {
    if (i === 2) { const s = document.createElement("div"); s.className = "rv-sep"; barra.appendChild(s); }
    const b = document.createElement("button"); b.type = "button"; b.className = "rv-b"; b.dataset.rv = h.id;
    b.innerHTML = `<span class="ic">${h.ic}</span><span>${h.tx}</span><span class="ta">${h.ta}</span>`;
    b.addEventListener("click", () => (h.id === "ejes" ? abrirEjes() : usar(h.id as Herr)));
    botones.set(h.id, b); barra.appendChild(b);
  });
  { const s = document.createElement("div"); s.className = "rv-sep"; barra.appendChild(s);
    const b = document.createElement("button"); b.type = "button"; b.className = "rv-b"; b.dataset.rv = "3d";
    b.innerHTML = `<span class="ic">🧊</span><span>3D</span><span class="ta">vista</span>`;
    b.addEventListener("click", () => ver3D()); barra.appendChild(b); }

  // ── navegador de niveles ────────────────────────────────────────────────
  const pintarNav = () => {
    nav.innerHTML = "<h4>NIVELES</h4>";
    const N = [...niveles()].reverse();
    for (const l of N) {
      const d = document.createElement("div"); d.className = "rv-niv" + (Math.abs(l.z - zAct) < 1e-6 ? " on" : "");
      d.dataset.z = String(l.z);
      d.innerHTML = `<span>${l.label}</span><span style="color:#64748b">${l.z.toFixed(2)}</span>`;
      d.addEventListener("click", () => activarNivel(l.z));
      nav.appendChild(d);
    }
    const mini = document.createElement("div"); mini.className = "rv-mini";
    const bMas = document.createElement("button"); bMas.textContent = "+ Nivel"; bMas.title = "Nivel nuevo encima del último (LL)";
    bMas.onclick = () => nuevoNivel();
    const bMenos = document.createElement("button"); bMenos.textContent = "− Nivel"; bMenos.title = "Quita el nivel de arriba (si no tiene nada)";
    bMenos.onclick = () => quitarNivel();
    mini.append(bMas, bMenos); nav.appendChild(mini);
  };
  const nuevoNivel = (h = parseFloat(String(W().__hekatanAlturaPiso ?? 3)) || 3) => {
    asegurarNiveles();
    const L = W().__hekatanLevels as { label: string; z: number }[];
    const top = Math.max(0, ...niveles().map((l) => l.z));
    const z = +(top + h).toFixed(4);
    L.push({ label: `N+${z.toFixed(2)}`, z });
    W().__hekatanRefreshLevels?.(); pintarNav(); activarNivel(z);
  };
  const quitarNivel = () => {
    const L = W().__hekatanLevels as { label: string; z: number }[];
    const N = niveles(); if (N.length <= 1) return;
    const top = N[N.length - 1];
    const usado = ((W().__hekatanDrawingPoints?.rawVal ?? []) as number[][]).some((p) => Math.abs(p[2] - top.z) < 1e-6);
    if (usado) { decir(`${top.label} tiene elementos: bórralos antes de quitar el nivel.`); return; }
    L.splice(L.indexOf(top as any), 1); W().__hekatanRefreshLevels?.();
    if (Math.abs(zAct - top.z) < 1e-6) activarNivel(N[N.length - 2].z); else pintarNav();
  };
  const activarNivel = (z: number) => {
    zAct = z;
    const st = W().__hekatanCadState?.get?.(); if (st) st.workZ = z;
    hooks.setPlane("xy");
    const inZ = document.getElementById("hk-dist-plano") as HTMLInputElement | null; if (inZ) inZ.value = String(z);
    hooks.setView("plan");
    encuadrar("plan"); setTimeout(() => encuadrar("plan"), 150);
    pintarNav();
    decir(`Planta ${niveles().find((l) => Math.abs(l.z - z) < 1e-6)?.label ?? z} — elige Columna, Viga, Losa o Muro.`);
  };
  const ver3D = () => { hooks.setView("iso"); encuadrar("iso"); setTimeout(() => encuadrar("iso"), 150); };
  // Encuadre por la RETÍCULA (ejes + niveles + lo dibujado), no por los nudos del modelo: con el
  // lienzo recién hecho no hay nudos y la planta salía centrada en el origen, sin los ejes a la vista.
  const encuadrar = (modo: "plan" | "iso") => {
    const c: any = (viewerElm as any).__ctx; if (!c) return;
    const { xs, ys } = ejes();
    const P = ((W().__hekatanDrawingPoints?.rawVal ?? []) as number[][]);
    const X = [...xs, ...P.map((p) => p[0])], Y = [...ys, ...P.map((p) => p[1])];
    const Zs = [...niveles().map((l) => l.z), ...P.map((p) => p[2])];
    if (!X.length || !Y.length) return;
    const x0 = Math.min(...X), x1 = Math.max(...X), y0 = Math.min(...Y), y1 = Math.max(...Y);
    const z0 = Zs.length ? Math.min(...Zs) : 0, z1 = Zs.length ? Math.max(...Zs) : 0;
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    const w = viewerElm.clientWidth || innerWidth, h = viewerElm.clientHeight || innerHeight;
    if (modo === "plan" && c.orthoCamera) {
      const m = 0.18, hw = (x1 - x0) / 2 * (1 + m) + 2, hh = (y1 - y0) / 2 * (1 + m) + 2;
      const halfH = Math.max(hh, hw * h / w), halfW = halfH * w / h;
      const o = c.orthoCamera;
      o.left = -halfW; o.right = halfW; o.top = halfH; o.bottom = -halfH; o.zoom = 1;
      o.position.set(cx, cy, zAct + 1000); o.up.set(0, 1, 0); o.lookAt(cx, cy, zAct); o.updateProjectionMatrix();
      c.controls?.target?.set(cx, cy, zAct);
    } else if (c.perspCamera) {
      const cz = (z0 + z1) / 2, d = Math.hypot(x1 - x0, y1 - y0, z1 - z0) * 1.45 + 5;
      const pc = c.perspCamera;
      pc.position.set(cx + d * 0.6, cy - d * 0.7, cz + d * 0.55); pc.up.set(0, 0, 1); pc.lookAt(cx, cy, cz); pc.updateProjectionMatrix();
      c.controls?.target?.set(cx, cy, cz);
    }
    c.controls?.update?.(); c.render?.();
  };

  // ── herramientas y barra de opciones ────────────────────────────────────
  let herr: Herr = "modificar";
  let cadena = true;
  let pendiente: V3 | null = null;
  const usar = (h: Herr) => {
    herr = h; pendiente = null; limpiarFantasma();
    botones.forEach((b, id) => b.classList.toggle("on", id === h));
    // la herramienta CAD de debajo se apaga: los clics los lleva este modo
    try { W().__hekatanCadState?.setTool?.(h === "modificar" ? "select" : "none"); W().__hekatanCadResetPending?.(); } catch {}
    opc.innerHTML = ""; opc.style.display = "none";
    const boton = (t: string, f: () => void, title = "") => { const b = document.createElement("button"); b.textContent = t; b.title = title; b.onclick = f; opc.appendChild(b); return b; };
    const texto = (t: string) => { const s = document.createElement("span"); s.textContent = t; opc.appendChild(s); };
    if (h === "columna") {
      texto("Clic en un cruce de ejes · del nivel de abajo a este"); boton("En ejes", () => columnasEnEjes(false), "Una columna en cada cruce de ejes, en este nivel");
      boton("En ejes · todos los niveles", () => columnasEnEjes(true));
    } else if (h === "viga") {
      const l = document.createElement("label"); l.innerHTML = `<input type="checkbox" ${cadena ? "checked" : ""}> Cadena`;
      (l.firstChild as HTMLInputElement).onchange = (e) => { cadena = (e.target as HTMLInputElement).checked; };
      opc.appendChild(l);
      texto("Clic-clic entre cruces"); boton("En ejes", () => vigasEnEjes(false), "Vigas sobre todos los ejes de este nivel");
      boton("En ejes · todos los niveles", () => vigasEnEjes(true));
    } else if (h === "losa") {
      texto("Clic DENTRO de un vano"); boton("Todas", () => losasTodas(false), "Losa en todos los vanos de este nivel");
      boton("Todas · todos los niveles", () => losasTodas(true));
    } else if (h === "muro") {
      texto("Clic-clic: muro del nivel de abajo a este");
    }
    if (opc.childNodes.length) opc.style.display = "flex";
    const ayuda: Record<Herr, string> = {
      modificar: "Modificar: selecciona y edita. Elige un nivel a la izquierda y una herramienta arriba.",
      columna: "COLUMNA: clic en un cruce de ejes (o «En ejes» para todos). Esc termina.",
      viga: "VIGA: clic en un cruce y en el siguiente; sigue en cadena. Esc termina.",
      losa: "LOSA: clic dentro del vano (entre ejes) o «Todas».",
      muro: "MURO: clic en el inicio y en el final.",
    };
    decir(ayuda[h]);
  };

  const columnasEnEjes = (todos: boolean) => {
    const { xs, ys } = ejes(); if (!xs.length || !ys.length) { decir("Primero los ejes (botón Ejes)."); return; }
    const zs = todos ? niveles().map((l) => l.z) : [zAct];
    const n = editar(({ barra }) => { for (const z of zs) { const t = tramo(z); if (!t || (todos && t[1] !== z)) continue; for (const x of xs) for (const y of ys) barra([x, y, t[0]], [x, y, t[1]]); } });
    decir(`${n} columna${n === 1 ? "" : "s"} nueva${n === 1 ? "" : "s"} (las que ya estaban no se duplican).`);
  };
  const vigasEnEjes = (todos: boolean) => {
    const { xs, ys } = ejes(); if (!xs.length || !ys.length) { decir("Primero los ejes (botón Ejes)."); return; }
    const zs = todos ? niveles().map((l) => l.z).filter((z) => nivelAbajo(z) != null) : [zAct];
    const n = editar(({ barra }) => {
      for (const z of zs) {
        for (const y of ys) for (let i = 0; i + 1 < xs.length; i++) barra([xs[i], y, z], [xs[i + 1], y, z]);
        for (const x of xs) for (let j = 0; j + 1 < ys.length; j++) barra([x, ys[j], z], [x, ys[j + 1], z]);
      }
    });
    decir(`${n} viga${n === 1 ? "" : "s"} nueva${n === 1 ? "" : "s"}.`);
  };
  const vano = (x: number, y: number) => {
    const { xs, ys } = ejes();
    const i = xs.findIndex((v, k) => k + 1 < xs.length && x > v && x < xs[k + 1]);
    const j = ys.findIndex((v, k) => k + 1 < ys.length && y > v && y < ys[k + 1]);
    return i < 0 || j < 0 ? null : { x0: xs[i], x1: xs[i + 1], y0: ys[j], y1: ys[j + 1] };
  };
  const losasTodas = (todos: boolean) => {
    const { xs, ys } = ejes(); if (xs.length < 2 || ys.length < 2) { decir("Primero los ejes (botón Ejes)."); return; }
    const zs = todos ? niveles().map((l) => l.z).filter((z) => nivelAbajo(z) != null) : [zAct];
    const n = editar(({ area }) => { for (const z of zs) for (let i = 0; i + 1 < xs.length; i++) for (let j = 0; j + 1 < ys.length; j++)
      area([[xs[i], ys[j], z], [xs[i + 1], ys[j], z], [xs[i + 1], ys[j + 1], z], [xs[i], ys[j + 1], z]]); });
    decir(`${n} losa${n === 1 ? "" : "s"} nueva${n === 1 ? "" : "s"}.`);
  };

  // ── ejes (rejilla) ──────────────────────────────────────────────────────
  const abrirEjes = () => {
    usar("modificar"); botones.get("ejes")!.classList.add("on");
    opc.innerHTML = ""; opc.style.display = "flex";
    const campo = (v: string, t: string) => { const i = document.createElement("input"); i.type = "text"; i.value = v; i.title = t; opc.appendChild(i); return i; };
    const tx = (t: string) => { const s = document.createElement("span"); s.textContent = t; opc.appendChild(s); };
    tx("Vanos X"); const ix = campo("4x6", "4 vanos de 6 m (o 5,6,5)");
    tx("Vanos Y"); const iy = campo("3x5", "3 vanos de 5 m");
    tx("Pisos"); const iz = campo("4x3", "4 pisos de 3 m");
    const b = document.createElement("button"); b.textContent = "Crear ejes y niveles"; opc.appendChild(b);
    b.onclick = () => {
      W().__hekatanGenerarRejilla?.(ix.value, iy.value, iz.value, false);
      setTimeout(() => { pintarNav(); activarNivel(nivelArriba(0) ?? 0); usar("columna"); }, 400);
    };
    decir("EJES: escribe los vanos y pulsa «Crear ejes y niveles». Después: Columna → En ejes.");
  };

  // ── clic en el lienzo: enganche a cruces de ejes y nudos del nivel ──────
  const rc = new THREE.Raycaster();
  const enPlano = (ev: MouseEvent): V3 | null => {
    const c = ctx(), cv = canvas(); if (!c || !cv) return null;
    const r = cv.getBoundingClientRect();
    rc.setFromCamera(new THREE.Vector2(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1), c.camera);
    const p = new THREE.Vector3();
    return rc.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 0, 1), -zAct), p) ? [p.x, p.y, zAct] : null;
  };
  const aPantalla = (p: V3) => {
    const c = ctx(), cv = canvas(); if (!c || !cv) return [1e9, 1e9];
    const r = cv.getBoundingClientRect(); const v = new THREE.Vector3(...p).project(c.camera);
    return [(v.x * 0.5 + 0.5) * r.width + r.left, (-v.y * 0.5 + 0.5) * r.height + r.top];
  };
  const enganchar = (ev: MouseEvent): { p: V3; tipo: string } | null => {
    const q = enPlano(ev); if (!q) return null;
    const { xs, ys } = ejes();
    const cand: { p: V3; tipo: string }[] = [];
    for (const x of xs) for (const y of ys) cand.push({ p: [x, y, zAct], tipo: "cruce de ejes" });
    for (const p of (W().__hekatanDrawingPoints?.rawVal ?? []) as number[][]) if (Math.abs(p[2] - zAct) < 1e-6) cand.push({ p: [p[0], p[1], zAct], tipo: "nudo" });
    let mejor: { p: V3; tipo: string } | null = null, dm = 16;
    for (const c of cand) { const s = aPantalla(c.p); const d = Math.hypot(s[0] - ev.clientX, s[1] - ev.clientY); if (d < dm) { dm = d; mejor = c; } }
    if (mejor) return mejor;
    // sobre un eje: se proyecta a él
    for (const x of xs) { const s = aPantalla([x, q[1], zAct]); if (Math.hypot(s[0] - ev.clientX, s[1] - ev.clientY) < 10) return { p: [x, +q[1].toFixed(2), zAct], tipo: "sobre eje" }; }
    for (const y of ys) { const s = aPantalla([q[0], y, zAct]); if (Math.hypot(s[0] - ev.clientX, s[1] - ev.clientY) < 10) return { p: [+q[0].toFixed(2), y, zAct], tipo: "sobre eje" }; }
    return { p: [Math.round(q[0] * 4) / 4, Math.round(q[1] * 4) / 4, zAct], tipo: "libre (0.25 m)" };
  };

  // fantasma (vista previa) en la escena
  const fant = new THREE.Group(); fant.name = "hk-revit-fantasma"; fant.renderOrder = 999;
  const matL = new THREE.LineBasicMaterial({ color: 0x22d3ee, depthTest: false, transparent: true });
  const matM = new THREE.MeshBasicMaterial({ color: 0x22d3ee, depthTest: false, transparent: true, opacity: 0.25, side: THREE.DoubleSide });
  const limpiarFantasma = () => { while (fant.children.length) { const o = fant.children.pop() as any; o.geometry?.dispose?.(); } ctx()?.render?.(); };
  const linea = (ps: V3[]) => { const g = new THREE.BufferGeometry().setFromPoints(ps.map((p) => new THREE.Vector3(...p))); const l = new THREE.Line(g, matL); l.renderOrder = 999; fant.add(l); };
  const cara = (ps: V3[]) => { const g = new THREE.BufferGeometry(); const v = ps.map((p) => new THREE.Vector3(...p));
    g.setFromPoints([v[0], v[1], v[2], v[0], v[2], v[3]]); const m = new THREE.Mesh(g, matM); m.renderOrder = 998; fant.add(m); };
  const cruz = (p: V3, s: number) => { linea([[p[0] - s, p[1], p[2]], [p[0] + s, p[1], p[2]]]); linea([[p[0], p[1] - s, p[2]], [p[0], p[1] + s, p[2]]]); };
  const vistaPrevia = (ev: MouseEvent) => {
    const c = ctx(); if (!c) return;
    if (!c.scene.children.includes(fant)) c.scene.add(fant);
    limpiarFantasma();
    const e = enganchar(ev); if (!e) return;
    const p = e.p, t = tramo(zAct);
    cruz(p, 0.4);
    if (herr === "columna" && t) linea([[p[0], p[1], t[0]], [p[0], p[1], t[1]]]);
    if ((herr === "viga") && pendiente) linea([pendiente, p]);
    if (herr === "muro" && pendiente && t) cara([[pendiente[0], pendiente[1], t[0]], [p[0], p[1], t[0]], [p[0], p[1], t[1]], [pendiente[0], pendiente[1], t[1]]]);
    if (herr === "losa") { const q = enPlano(ev); const v = q && vano(q[0], q[1]); if (v) cara([[v.x0, v.y0, zAct], [v.x1, v.y0, zAct], [v.x1, v.y1, zAct], [v.x0, v.y1, zAct]]); }
    msg.textContent = `${herr.toUpperCase()} · ${e.tipo} (${p[0].toFixed(2)}, ${p[1].toFixed(2)}, ${p[2].toFixed(2)})`;
    c.render();
  };
  const alClic = (ev: MouseEvent) => {
    const e = enganchar(ev); if (!e) return;
    const p = e.p, t = tramo(zAct);
    if (herr === "columna") {
      if (!t) { decir("Hace falta otro nivel (+ Nivel)."); return; }
      const n = editar(({ barra }) => { barra([p[0], p[1], t[0]], [p[0], p[1], t[1]]); });
      decir(n ? `Columna en (${p[0]}, ${p[1]}).` : "Ahí ya hay una columna.");
    } else if (herr === "viga") {
      if (!pendiente) { pendiente = p; decir("VIGA: clic en el final."); return; }
      const a = pendiente; editar(({ barra }) => { barra(a, p); });
      pendiente = cadena ? p : null;
      decir(cadena ? "Viga puesta · sigue en cadena (Esc termina)." : "Viga puesta.");
    } else if (herr === "muro") {
      if (!t) { decir("Hace falta otro nivel (+ Nivel)."); return; }
      if (!pendiente) { pendiente = p; decir("MURO: clic en el final."); return; }
      const a = pendiente; pendiente = null;
      editar(({ area }) => { area([[a[0], a[1], t[0]], [p[0], p[1], t[0]], [p[0], p[1], t[1]], [a[0], a[1], t[1]]]); });
      decir("Muro puesto.");
    } else if (herr === "losa") {
      const q = enPlano(ev); const v = q && vano(q[0], q[1]);
      if (!v) { decir("Clic DENTRO de un vano (entre cuatro ejes)."); return; }
      const n = editar(({ area }) => { area([[v.x0, v.y0, zAct], [v.x1, v.y0, zAct], [v.x1, v.y1, zAct], [v.x0, v.y1, zAct]]); });
      decir(n ? "Losa puesta." : "Ese vano ya tiene losa.");
    }
  };
  // Los clics del lienzo se interceptan en CAPTURA (antes que el CAD y la órbita) solo con una
  // herramienta de este modo activa, y solo el botón izquierdo: la rueda y el derecho siguen moviendo la vista.
  const activo = () => encendido && herr !== "modificar";
  let abajo: { x: number; y: number } | null = null;
  viewerElm.addEventListener("pointerdown", (ev) => {
    if (!activo() || ev.button !== 0 || (ev.target as HTMLElement).tagName !== "CANVAS") return;
    ev.stopPropagation(); ev.preventDefault(); abajo = { x: ev.clientX, y: ev.clientY };
  }, true);
  viewerElm.addEventListener("pointerup", (ev) => {
    if (!activo() || ev.button !== 0 || !abajo) return;
    ev.stopPropagation();
    if (Math.hypot(ev.clientX - abajo.x, ev.clientY - abajo.y) < 6) alClic(ev);
    abajo = null; vistaPrevia(ev);
  }, true);
  viewerElm.addEventListener("click", (ev) => { if (activo() && (ev.target as HTMLElement).tagName === "CANVAS") ev.stopPropagation(); }, true);
  viewerElm.addEventListener("pointermove", (ev) => { if (activo()) vistaPrevia(ev); });
  viewerElm.addEventListener("contextmenu", (ev) => { if (activo() && pendiente) { ev.preventDefault(); ev.stopPropagation(); pendiente = null; limpiarFantasma(); } }, true);

  // teclado: Esc y atajos de dos letras de Revit
  let buf = "", tBuf = 0;
  window.addEventListener("keydown", (ev) => {
    if (!encendido) return;
    const t = ev.target as HTMLElement | null;
    if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
    if (ev.key === "Escape") { if (pendiente) { pendiente = null; limpiarFantasma(); } else usar("modificar"); return; }
    if (!/^[a-z]$/i.test(ev.key) || ev.ctrlKey || ev.altKey) return;
    const ahora = performance.now(); buf = (ahora - tBuf < 900 ? buf : "") + ev.key.toUpperCase(); tBuf = ahora;
    const mapa: Record<string, () => void> = { CL: () => usar("columna"), BM: () => usar("viga"), SB: () => usar("losa"), WA: () => usar("muro"), GR: () => abrirEjes(), LL: () => nuevoNivel() };
    const f = mapa[buf.slice(-2)]; if (f) { ev.preventDefault(); ev.stopPropagation(); buf = ""; f(); }
  }, true);

  // ── encender / apagar ───────────────────────────────────────────────────
  const tog = document.createElement("button"); tog.id = "hk-revit-toggle"; tog.type = "button";
  let encendido = false;
  const poner = (v: boolean) => {
    encendido = v;
    document.body.classList.toggle("hk-revit-on", v);
    colocar();
    raiz.style.display = v ? "block" : "none";
    tog.textContent = v ? "Cinta clásica" : "🏛 Modo Revit";
    tog.title = v ? "Volver a la cinta de herramientas de siempre" : "Dibujar por niveles: Columna, Viga, Losa, Muro";
    hooks.cinta(!v);
    try { localStorage.setItem(LS, v ? "1" : "0"); } catch {}
    if (v) { try { W().__hekatanAccesoRapido?.(false); } catch {} asegurarNiveles(); pintarNav(); usar("modificar"); } else { limpiarFantasma(); }
  };
  tog.onclick = () => poner(!encendido);
  // La barra de título de la app es FIJA (30 px) y el lienzo empieza debajo de ella: todo se baja
  // lo que tape, medido (si no, la fila de herramientas quedaba cortada por arriba).
  const colocar = () => {
    const tope = Math.max(0, (document.getElementById("hk-cad-tit")?.getBoundingClientRect().bottom ?? 0) - host.getBoundingClientRect().top);
    barra.style.top = `${tope + 8}px`; opc.style.top = `${tope + 74}px`;
    tog.style.top = `${tope + 8}px`; nav.style.top = `${tope + 48}px`;
  };
  window.addEventListener("resize", colocar);
  if (getComputedStyle(host).position === "static") host.style.position = "relative";
  host.append(raiz, tog);
  let ini = !!hooks.encendidoPorDefecto;
  try { const g = localStorage.getItem(LS); if (g !== null) ini = g === "1"; } catch {}
  raiz.style.display = "none"; tog.textContent = "🏛 Modo Revit";
  if (ini) setTimeout(() => poner(true), 300);

  (window as any).__hekatanModoRevit = {
    poner, usar, activarNivel, nuevoNivel, columnasEnEjes, vigasEnEjes, losasTodas, abrirEjes,
    estado: () => ({ encendido, herr, zAct, niveles: niveles(), ejes: ejes() }),
  };
}
