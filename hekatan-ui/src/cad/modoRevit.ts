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
type Herr = "modificar" | "eje" | "nivel" | "columna" | "viga" | "losa" | "muro";
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
  const editar = (fn: (e: { punto: (p: V3) => number; barra: (a: V3, b: V3) => boolean; area: (ps: V3[]) => boolean; P: number[][] }) => void) => {
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
    fn({ punto, barra, area, P });
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
    W().__hekatanAjustarRejilla?.();
    return n;
  };

  // ── UI ──────────────────────────────────────────────────────────────────
  const css = document.createElement("style");
  css.textContent = `
  #hk-revit{position:absolute;inset:0;pointer-events:none;z-index:55;font:12px system-ui,-apple-system,Segoe UI,sans-serif;color:#dbeafe}
  #hk-revit .rv-bar{pointer-events:auto;position:absolute;left:58px;top:8px;display:flex;gap:4px;align-items:stretch;
    background:rgba(15,23,42,.96);border:1px solid #1e3a4a;border-radius:10px;padding:5px;box-shadow:0 6px 20px rgba(0,0,0,.45)}
  #hk-revit .rv-b{display:flex;flex-direction:column;align-items:center;justify-content:center;min-width:50px;padding:4px 4px;border:1px solid transparent;
    border-radius:7px;background:transparent;color:#dbeafe;cursor:pointer;font:600 11px inherit}
  #hk-revit .rv-b .ic{font-size:20px;line-height:22px}
  #hk-revit .rv-b .ta{font:10px Consolas,monospace;color:#64748b}
  #hk-revit .rv-b:hover{background:#12304a}
  #hk-revit .rv-b.on{background:#0e7490;border-color:#22d3ee;color:#fff}
  #hk-revit .rv-sep{width:1px;background:#1e3a4a;margin:2px 3px}
  #hk-revit .rv-op{pointer-events:auto;position:absolute;left:58px;top:74px;display:none;gap:8px;align-items:center;
    background:rgba(8,47,73,.96);border:1px solid #0e7490;border-radius:8px;padding:5px 10px;white-space:nowrap}
  #hk-revit .rv-op button{height:24px;padding:0 10px;border-radius:6px;border:1px solid #22d3ee;background:#0e7490;color:#ecfeff;font:600 11px inherit;cursor:pointer}
  #hk-revit .rv-op input[type=text]{width:46px;height:22px;background:#0a1622;border:1px solid #1e3a4a;border-radius:5px;color:#cdeefb;text-align:center;font:12px Consolas,monospace}
  #hk-revit .rv-nav{pointer-events:auto;position:absolute;right:8px;top:48px;width:170px;background:rgba(15,23,42,.96);border:1px solid #1e3a4a;border-radius:10px;padding:6px}
  #hk-revit .rv-nav h4{margin:2px 4px 6px;font:700 11px inherit;color:#7dd3fc;letter-spacing:.4px}
  #hk-revit .rv-niv{display:flex;justify-content:space-between;padding:5px 8px;border-radius:6px;cursor:pointer;font:12px Consolas,monospace}
  #hk-revit .rv-niv:hover{background:#12304a}
  #hk-revit .rv-niv.on{background:#0e7490;color:#fff}
  #hk-revit .rv-nav .rv-mini{display:flex;gap:4px;margin-top:6px}
  #hk-revit .rv-nav .rv-mini button{flex:1;height:24px;border-radius:6px;border:1px solid #1e3a4a;background:#0a1622;color:#cdeefb;cursor:pointer;font:600 11px inherit}
  #hk-revit .rv-msg{position:absolute;left:50%;transform:translateX(-50%);bottom:10px;background:rgba(15,23,42,.92);border:1px solid #1e3a4a;
    border-radius:8px;padding:5px 12px;color:#cbd5e1;font:12px inherit;pointer-events:none;max-width:70%;text-align:center}
  body.hk-revit-on #hk-ribbon-abrir,body.hk-revit-on #hk-dyn,body.hk-revit-on #hk-ribbon-guia,body.hk-revit-on #hk-osnap-etiqueta{display:none!important}
  #hk-revit-toggle.en-cinta{position:static!important;align-self:center;margin:4px 6px;top:auto!important}
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
    { id: "ejes", ic: "#", tx: "Rejilla", ta: "REJ" },
    { id: "eje", ic: "◯", tx: "Eje", ta: "GR" },
    { id: "nivel", ic: "⊼", tx: "Nivel", ta: "LL" },
    { id: "columna", ic: "▮", tx: "Columna", ta: "CL" },
    { id: "viga", ic: "━", tx: "Viga", ta: "BM" },
    { id: "losa", ic: "▦", tx: "Losa", ta: "SB" },
    { id: "muro", ic: "▥", tx: "Muro", ta: "WA" },
  ];
  const botones = new Map<string, HTMLButtonElement>();
  HERR.forEach((h, i) => {
    if (i === 2 || i === 4) { const s = document.createElement("div"); s.className = "rv-sep"; barra.appendChild(s); }
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
  // ── PEGADO a niveles y ejes (Revit: los elementos van atados a su nivel y a su eje) ──
  // Jorge, 17-oct-2026: «una opción para que los elementos queden pegados al nivel y a la grid: cuando se
  // modifique, que cambien». Con el pegado puesto, cambiar la cota de un nivel mueve TODOS los nudos que
  // están en esa cota, y mover un eje mueve los nudos que están sobre él. Sin pegado, solo la referencia.
  let pegado = true;
  try { pegado = localStorage.getItem("hk_revit_pegado") !== "0"; } catch {}
  const moverNivel = (zViejo: number, zNuevo: number): string | null => {
    if (!isFinite(zNuevo)) return "Cota no válida.";
    const N = niveles(); const i = N.findIndex((l) => Math.abs(l.z - zViejo) < 1e-6);
    if (i < 0) return "No encuentro el nivel.";
    const abajo = N[i - 1]?.z ?? -Infinity, arriba = N[i + 1]?.z ?? Infinity;
    if (!(zNuevo > abajo + 1e-6 && zNuevo < arriba - 1e-6)) return "La cota tiene que quedar entre el nivel de abajo y el de arriba.";
    const L = W().__hekatanLevels as { label: string; z: number }[];
    const lv = L.find((l) => Math.abs(l.z - zViejo) < 1e-6)!;
    const auto = /^N[+-]?\d/.test(lv.label);
    lv.z = zNuevo; if (auto) lv.label = `N${zNuevo >= 0 ? "+" : ""}${zNuevo.toFixed(2)}`;
    if (pegado) editar(({ P }) => { for (let k = 0; k < P.length; k++) if (P[k] && Math.abs(P[k][2] - zViejo) < 1e-6) P[k] = [P[k][0], P[k][1], zNuevo]; });
    W().__hekatanRefreshLevels?.(); W().__hekatanAjustarRejilla?.();
    if (Math.abs(zAct - zViejo) < 1e-6) activarNivel(zNuevo); else pintarNav();
    return null;
  };
  const moverEje = (label: string, nuevo: number): string | null => {
    if (!isFinite(nuevo)) return "Posición no válida.";
    const A = (W().__hekatanAxisGrids ?? []) as { label: string; start: number[]; end: number[] }[];
    const ax = A.find((a) => a.label === label); if (!ax) return "No encuentro el eje.";
    const k = Math.abs(ax.start[0] - ax.end[0]) < 1e-6 ? 0 : 1;          // 0: eje de x constante (letra)
    const viejo = ax.start[k];
    if (A.some((a) => a !== ax && Math.abs(a.start[k] - a.end[k]) < 1e-6 && Math.abs(a.start[k] - nuevo) < 1e-6)) return "Ya hay un eje en esa posición.";
    ax.start[k] = nuevo; ax.end[k] = nuevo;
    // los ejes perpendiculares se alargan o acortan para seguir cubriendo la retícula
    const otros = A.filter((a) => Math.abs(a.start[k] - a.end[k]) < 1e-6).map((a) => a.start[k]);
    const lo = Math.min(...otros), hi = Math.max(...otros);
    for (const a of A) if (Math.abs(a.start[k] - a.end[k]) > 1e-6) {
      const dir = a.end[k] >= a.start[k]; a.start[k] = dir ? lo : hi; a.end[k] = dir ? hi : lo;
    }
    if (pegado) editar(({ P }) => { for (let q = 0; q < P.length; q++) if (P[q] && Math.abs(P[q][k] - viejo) < 1e-6) { const c = [...P[q]]; c[k] = nuevo; P[q] = c; } });
    W().__hekatanRefreshAxes?.(); W().__hekatanAjustarRejilla?.(); pintarNav();
    return null;
  };
  /** casilla que se vuelve editable con doble clic; Enter aplica, Esc cancela */
  const editable = (span: HTMLElement, valor: number, aplicar: (v: number) => string | null) => {
    span.title = "Doble clic para cambiar";
    // el clic sobre el NÚMERO no activa la fila: si no, la fila se redibuja con el primer clic y el doble
    // clic cae en un elemento que ya no existe (medido en el tutorial con el ratón: no editaba)
    span.addEventListener("click", (ev) => ev.stopPropagation());
    span.addEventListener("dblclick", (ev) => {
      ev.stopPropagation();
      const i = document.createElement("input"); i.type = "text"; i.value = valor.toFixed(2);
      i.style.cssText = "width:58px;height:20px;background:#0a1622;border:1px solid #22d3ee;border-radius:4px;color:#ecfeff;font:12px Consolas,monospace;text-align:right";
      span.replaceWith(i); i.focus(); i.select();
      const fin = (ok: boolean) => {
        if (ok) { const e = aplicar(parseFloat(i.value.replace(",", "."))); if (e) { decir(e); pintarNav(); } }
        else pintarNav();
      };
      i.addEventListener("keydown", (k) => { k.stopPropagation(); if (k.key === "Enter") fin(true); if (k.key === "Escape") fin(false); });
      // perder el foco por cambiar de VENTANA (Alt+Tab, una captura) no cancela; un clic en otro sitio sí
      i.addEventListener("blur", () => setTimeout(() => { if (document.hasFocus() && document.activeElement !== i) fin(false); }, 0));
      i.addEventListener("click", (k) => k.stopPropagation());
    });
  };
  const pintarNav = () => {
    nav.innerHTML = "<h4>PLANTAS</h4>";
    const N = [...niveles()].reverse();
    for (const l of N) {
      const d = document.createElement("div"); d.className = "rv-niv" + (Math.abs(l.z - zAct) < 1e-6 ? " on" : "");
      d.dataset.z = String(l.z);
      d.innerHTML = `<span>${l.label}</span><span class="rv-cota" style="color:#94a3b8">${l.z.toFixed(2)}</span>`;
      d.addEventListener("click", () => activarNivel(l.z));
      editable(d.querySelector(".rv-cota") as HTMLElement, l.z, (v) => moverNivel(l.z, v));
      nav.appendChild(d);
    }
    const mini = document.createElement("div"); mini.className = "rv-mini";
    const bMas = document.createElement("button"); bMas.textContent = "+ Nivel"; bMas.title = "Nivel nuevo encima del último (LL)";
    bMas.onclick = () => nuevoNivel();
    const bMenos = document.createElement("button"); bMenos.textContent = "− Nivel"; bMenos.title = "Quita el nivel de arriba (si no tiene nada)";
    bMenos.onclick = () => quitarNivel();
    mini.append(bMas, bMenos); nav.appendChild(mini);
    // ALZADOS: donde se dibujan los NIVELES (como en Revit: la herramienta Nivel vive en un alzado)
    { const h = document.createElement("h4"); h.textContent = "ALZADOS"; h.style.marginTop = "10px"; nav.appendChild(h);
      const caja = document.createElement("div"); caja.style.cssText = "display:grid;grid-template-columns:1fr 1fr;gap:2px 6px";
      for (const [k, t] of [["S", "Sur"], ["N", "Norte"], ["O", "Oeste"], ["E", "Este"]] as const) {
        const d = document.createElement("div"); d.className = "rv-niv" + (vista === "alzado" && dirAlz === k ? " on" : ""); d.dataset.alzado = k;
        d.innerHTML = `<span>${t}</span>`; d.addEventListener("click", () => activarAlzado(k)); caja.appendChild(d);
      }
      nav.appendChild(caja);
      const d3 = document.createElement("div"); d3.className = "rv-niv" + (vista === "3d" ? " on" : ""); d3.dataset.vista3d = "1";
      d3.style.marginTop = "6px"; d3.innerHTML = `<span>🧊 Vista 3D</span>`; d3.addEventListener("click", () => ver3D()); nav.appendChild(d3); }
    // EJES: posición editable de cada eje (doble clic)
    const A = (W().__hekatanAxisGrids ?? []) as { label: string; start: number[]; end: number[] }[];
    if (A.length) {
      const h = document.createElement("h4"); h.textContent = "EJES"; h.style.marginTop = "10px"; nav.appendChild(h);
      const caja = document.createElement("div"); caja.style.cssText = "display:grid;grid-template-columns:1fr 1fr;gap:0 6px;max-height:190px;overflow:auto";
      for (const a of A) {
        const k = Math.abs(a.start[0] - a.end[0]) < 1e-6 ? 0 : 1;
        const d = document.createElement("div"); d.className = "rv-niv"; d.dataset.eje = a.label;
        d.innerHTML = `<span>${a.label}</span><span class="rv-cota" style="color:#94a3b8">${a.start[k].toFixed(2)}</span>`;
        editable(d.querySelector(".rv-cota") as HTMLElement, a.start[k], (v) => moverEje(a.label, v));
        caja.appendChild(d);
      }
      nav.appendChild(caja);
    }
    const lp = document.createElement("label"); lp.style.cssText = "display:flex;gap:6px;align-items:center;margin:8px 4px 2px;cursor:pointer;font-size:11px";
    lp.title = "Con esto puesto, al cambiar la cota de un nivel o mover un eje, los elementos se mueven con él (como en Revit)";
    lp.innerHTML = `<input type="checkbox" ${pegado ? "checked" : ""}> 📎 Pegado a niveles y ejes`;
    (lp.firstChild as HTMLInputElement).onchange = (e) => { pegado = (e.target as HTMLInputElement).checked; try { localStorage.setItem("hk_revit_pegado", pegado ? "1" : "0"); } catch {} };
    nav.appendChild(lp);
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
  let vista: "planta" | "alzado" | "3d" = "planta";
  let dirAlz: "S" | "N" | "O" | "E" = "S";
  const activarNivel = (z: number) => {
    zAct = z; vista = "planta"; quitarCotas(); limpiarDatos();
    const st = W().__hekatanCadState?.get?.(); if (st) st.workZ = z;
    hooks.setPlane("xy");
    const inZ = document.getElementById("hk-dist-plano") as HTMLInputElement | null; if (inZ) inZ.value = String(z);
    hooks.setView("plan");
    encuadrar("plan"); setTimeout(() => encuadrar("plan"), 150);
    pintarNav();
    decir(`Planta ${niveles().find((l) => Math.abs(l.z - z) < 1e-6)?.label ?? z} — elige Columna, Viga, Losa o Muro.`);
  };
  // En 3D la rejilla (el plano de trabajo) va al SUELO: a media altura cortaba el edificio (Jorge,
  // 17-oct-2026). En planta vuelve al nivel activo (activarNivel). Revit tampoco la pone a media altura.
  const ver3D = () => {
    vista = "3d"; quitarCotas(); limpiarDatos(); pintarNav();
    hooks.setView("iso");
    const gt = W().__hekatanDrawingGridTarget;
    const z0 = niveles()[0]?.z ?? 0;
    if (gt) gt.val = { position: [0, 0, z0], rotation: [Math.PI / 2, 0, 0] };
    encuadrar("iso"); setTimeout(() => encuadrar("iso"), 150);
  };
  // Encuadre por la RETÍCULA (ejes + niveles + lo dibujado), no por los nudos del modelo: con el
  // lienzo recién hecho no hay nudos y la planta salía centrada en el origen, sin los ejes a la vista.
  /** ALZADOS (como Revit: Sur, Norte, Este, Oeste). La fachada es el plano por el borde de la retícula;
   *  `u` es la coordenada horizontal en pantalla (x en Sur/Norte, y en Este/Oeste). */
  const fachada = () => {
    const { xs, ys } = ejes();
    const X0 = xs.length ? Math.min(...xs) : 0, X1 = xs.length ? Math.max(...xs) : 10;
    const Y0 = ys.length ? Math.min(...ys) : 0, Y1 = ys.length ? Math.max(...ys) : 10;
    const d = dirAlz, enX = d === "S" || d === "N";
    const fijo = d === "S" ? Y0 : d === "N" ? Y1 : d === "O" ? X0 : X1;
    const u0 = enX ? X0 : Y0, u1 = enX ? X1 : Y1;
    const punto = (u: number, z: number): V3 => (enX ? [u, fijo, z] : [fijo, u, z]);
    const normal = enX ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
    const desde = d === "S" ? [0, -1, 0] : d === "N" ? [0, 1, 0] : d === "O" ? [-1, 0, 0] : [1, 0, 0];   // dónde está la cámara
    return { enX, fijo, u0, u1, punto, normal, desde };
  };
  const yFrente = () => fachada().fijo;   // (compatibilidad)
  /** dónde va la cota de un nivel en el alzado: en medio del primer vano (lejos de columnas y burbujas) */
  const uCota = (fa: ReturnType<typeof fachada>) => {
    const p = listaEjes().filter((a) => kEje(a) === (fa.enX ? 0 : 1)).map((a) => a.start[fa.enX ? 0 : 1]).sort((u, v) => u - v);
    return p.length >= 2 ? (p[0] + p[1]) / 2 : fa.u0 + 0.2 * (fa.u1 - fa.u0);
  };
  const activarAlzado = (k: "S" | "N" | "O" | "E") => {
    dirAlz = k; vista = "alzado"; quitarCotas();
    hooks.setView(k === "S" || k === "N" ? "elevX" : "elevY");
    encuadrar("alzado"); setTimeout(() => { encuadrar("alzado"); pintarDatos(); }, 150);
    pintarNav(); pintarDatos();
    const nom = { S: "SUR", N: "NORTE", O: "OESTE", E: "ESTE" }[k];
    decir(`Alzado ${nom} — con «Nivel» se dibujan los niveles; un clic en un nivel enseña sus cotas.`);
  };
  const activarFrente = () => activarAlzado(dirAlz);
  const encuadrar = (modo: "plan" | "iso" | "alzado") => {
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
    if ((modo === "plan" || modo === "alzado") && c.orthoCamera) {
      // Parte LIBRE del lienzo, medida: lo que tapan la barra de herramientas + opciones (arriba), la
      // línea de órdenes (abajo) y el panel de niveles (derecha). Regla de Jorge: nada choca, así que
      // el edificio y sus burbujas se encajan solo ahí (antes las burbujas A–E caían bajo la línea de
      // órdenes y la fila de arriba bajo la barra de opciones).
      const cv = canvas()!; const r = cv.getBoundingClientRect();
      const libre = (x: number, y: number) => document.elementFromPoint(x, y) === cv;
      let arriba = 0, abajo = 0;
      for (let y = r.top + 2; y < r.top + r.height * 0.5; y += 4) if (!libre(r.left + r.width / 2, y)) arriba = y - r.top + 6;
      for (let y = r.bottom - 2; y > r.top + r.height * 0.5; y -= 4) if (!libre(r.left + r.width / 2, y)) abajo = r.bottom - y + 6;
      // la barra de opciones aparece al elegir herramienta: su sitio se reserva siempre
      arriba = Math.max(arriba, (parseFloat(opc.style.top) || 74) + 40 - (r.top - host.getBoundingClientRect().top));
      if (!encendido) arriba += 56;   // cinta clásica: el rótulo «Dibujando en PLANTA» sale bajo ella, sobre el borde del modelo
      const der = (nav.getBoundingClientRect().width || 150) + 24, izq = 24;
      const fa = fachada();
      // en planta se encaja la REJILLA entera (las burbujas van fuera de ella) más el sitio de las burbujas
      const R = (W().__hekatanGridConfig ?? {}).rect;
      const uu0 = modo === "plan" ? (R ? Math.min(R.x0, x0) : x0) : fa.u0, uu1 = modo === "plan" ? (R ? Math.max(R.x1, x1) : x1) : fa.u1;
      // en alzado, hueco ARRIBA para dibujar niveles nuevos sin chocar con las burbujas de los ejes
      const vv0 = modo === "plan" ? (R ? Math.min(R.y0, y0) : y0) : Math.min(z0, 0),
            vv1 = modo === "plan" ? (R ? Math.max(R.y1, y1) : y1) : z1 + Math.max(4, 0.4 * (z1 - Math.min(z0, 0)));
      const m = modo === "plan" && R ? 0.04 : 0.35, Wc = (uu1 - uu0) * (1 + m) + 1, Hc = (vv1 - vv0) * (1 + m) + 1;
      const PB = (modo === "plan" && R) || modo === "alzado" ? 44 : 0;                    // píxeles para las burbujas, a cada lado
      const aw = Math.max(200, w - izq - der - 2 * PB), ah = Math.max(150, h - arriba - abajo - 2 * PB);
      const halfH = Math.max(Wc * h / (2 * aw), Hc * h / (2 * ah)), halfW = halfH * w / h;
      const mpp = 2 * halfH / h;                                  // metros por píxel
      const dx = (izq + (w - der)) / 2 - w / 2, dy = (arriba + (h - abajo)) / 2 - h / 2;
      const cvv = (vv0 + vv1) / 2, cuu = (uu0 + uu1) / 2;
      // en Norte y Oeste la u crece hacia la IZQUIERDA de la pantalla
      const signoU = modo === "alzado" && (dirAlz === "N" || dirAlz === "O") ? -1 : 1;   // (cámara mirando +y: derecha = +x; mirando −x: derecha = +y)
      const cxv = cuu - signoU * dx * mpp, cyv = cvv + dy * mpp;
      const o = c.orthoCamera;
      o.left = -halfW; o.right = halfW; o.top = halfH; o.bottom = -halfH; o.zoom = 1;
      if (modo === "plan") {
        o.position.set(cxv, cyv, zAct + 1000); o.up.set(0, 1, 0); o.lookAt(cxv, cyv, zAct); c.controls?.target?.set(cxv, cyv, zAct);
      } else {
        const t = fa.punto(cxv, cyv), dd = fa.desde;
        o.position.set(t[0] + dd[0] * 1000, t[1] + dd[1] * 1000, t[2]); o.up.set(0, 0, 1); o.lookAt(t[0], t[1], t[2]); c.controls?.target?.set(t[0], t[1], t[2]);
      }
      o.updateProjectionMatrix();
    } else if (c.perspCamera) {
      const cz = (z0 + z1) / 2, d = Math.hypot(x1 - x0, y1 - y0, z1 - z0) * 1.7 + 5;
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
    // cada herramienta en SU vista, como Revit: Nivel solo en alzado; Eje, columnas, vigas, losas y muros en planta
    if (h === "nivel" && vista !== "alzado") activarAlzado(dirAlz);
    else if (h !== "nivel" && h !== "modificar" && vista !== "planta") activarNivel(zAct);
    herr = h; pendiente = null; limpiarFantasma(); quitarCotas();
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
    } else if (h === "eje") {
      texto("Clic-clic: el eje y su burbuja · la cota azul al eje paralelo se pulsa y se escribe");
    } else if (h === "nivel") {
      texto("Clic a la altura del nivel · la cota azul al nivel vecino se pulsa y se escribe");
    }
    if (opc.childNodes.length) opc.style.display = "flex";
    const ayuda: Record<Herr, string> = {
      modificar: "Modificar: un clic en un eje (planta) o en un nivel (alzado) enseña sus cotas, y se cambian pulsándolas.",
      eje: "EJE: clic en el inicio y en el final; la burbuja sale sola con la letra o el número siguiente.",
      nivel: "NIVEL: clic a la altura; se crea con su planta. La cota azul cambia la distancia al nivel vecino.",
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
      setTimeout(() => W().__hekatanAjustarRejilla?.(), 50);
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
    if (vista === "alzado") { const fa = fachada(); if (!rc.ray.intersectPlane(new THREE.Plane(fa.normal, -fa.fijo), p)) return null; return fa.punto(fa.enX ? p.x : p.y, p.z); }
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
    if (herr === "nivel") { previaNivel(ev); c.render(); return; }
    const e = enganchar(ev); if (!e) return;
    const p = e.p, t = tramo(zAct);
    cruz(p, 0.4);
    if (herr === "eje") { previaEje(p); c.render(); return; }
    if (herr === "columna" && t) linea([[p[0], p[1], t[0]], [p[0], p[1], t[1]]]);
    if ((herr === "viga") && pendiente) linea([pendiente, p]);
    if (herr === "muro" && pendiente && t) cara([[pendiente[0], pendiente[1], t[0]], [p[0], p[1], t[0]], [p[0], p[1], t[1]], [pendiente[0], pendiente[1], t[1]]]);
    if (herr === "losa") { const q = enPlano(ev); const v = q && vano(q[0], q[1]); if (v) cara([[v.x0, v.y0, zAct], [v.x1, v.y0, zAct], [v.x1, v.y1, zAct], [v.x0, v.y1, zAct]]); }
    msg.textContent = `${herr.toUpperCase()} · ${e.tipo} (${p[0].toFixed(2)}, ${p[1].toFixed(2)}, ${p[2].toFixed(2)})`;
    c.render();
  };
  const alClic = (ev: MouseEvent) => {
    if (herr === "nivel") { clicNivel(ev); return; }
    const e = enganchar(ev); if (!e) return;
    if (herr === "eje") { clicEje(e.p); return; }
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


  // ── LO QUE SE VE EN UN ALZADO (Revit): las líneas de nivel con su rótulo a un lado, fuera del edificio,
  // y los ejes que cortan la fachada en VERTICAL con la burbuja arriba. Las del visor están pensadas para la
  // planta (un eje en alzado es un punto), así que en alzado se dibujan aquí.
  const grupoDatos = new THREE.Group(); grupoDatos.name = "hk-revit-datos";
  const matDato = new THREE.LineDashedMaterial({ color: 0x94a3b8, dashSize: 0.35, gapSize: 0.18, transparent: true, opacity: 0.8, depthTest: false });
  const capaDatos = document.createElement("div"); capaDatos.style.cssText = "position:absolute;inset:0;pointer-events:none";
  raiz.insertBefore(capaDatos, raiz.firstChild);
  let bucleDatos = 0;
  function limpiarDatos() {
    cancelAnimationFrame(bucleDatos); bucleDatos = 0; capaDatos.innerHTML = "";
    while (grupoDatos.children.length) { const o = grupoDatos.children.pop() as any; o.geometry?.dispose?.(); }
    // las líneas de nivel del visor vuelven a verse
    for (const nom of ["levels", "axis-grids"])
      ctx()?.scene?.getObjectByName(nom)?.traverse((o: any) => { if (o.userData?.ocultoAlzado) { o.visible = true; delete o.userData.ocultoAlzado; } });
    ctx()?.render?.();
  }
  function pintarDatos() {
    limpiarDatos();
    if (vista !== "alzado") return;
    const c = ctx(); if (!c) return;
    if (!c.scene.children.includes(grupoDatos)) c.scene.add(grupoDatos);
    // las del visor (pensadas para planta) se esconden en alzado: aquí van las de la fachada
    for (const nom of ["levels", "axis-grids"]) {
      const g = c.scene.getObjectByName(nom);
      g?.traverse((o: any) => { if (o !== g && o.visible && o.type !== "Group") { o.visible = false; o.userData.ocultoAlzado = true; } });
    }
    const fa = fachada(), N = niveles();
    const zTop = N.length ? Math.max(...N.map((l) => l.z)) : 3, zBot = N.length ? Math.min(...N.map((l) => l.z)) : 0;
    const vu = Math.max(1.5, 0.12 * (fa.u1 - fa.u0)), vz = Math.max(1.0, 0.12 * (zTop - zBot));
    const raya = (a: V3, b: V3) => { const g = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(...a), new THREE.Vector3(...b)]);
      const l = new THREE.Line(g, matDato); l.computeLineDistances(); l.renderOrder = 997; grupoDatos.add(l); };
    // niveles: de un lado a otro de la fachada, sobresaliendo; el rótulo va FUERA, en el lado izquierdo de la pantalla
    // el lado IZQUIERDO de la pantalla: Sur y Este tienen la u creciendo hacia la derecha; Norte y Oeste, al revés
    const izq = dirAlz === "S" || dirAlz === "E" ? fa.u0 - vu : fa.u1 + vu;
    for (const l of N) raya(fa.punto(fa.u0 - vu, l.z), fa.punto(fa.u1 + vu, l.z));
    // ejes que cortan la fachada: perpendiculares a ella (Sur/Norte: los de x constante; Este/Oeste: los de y constante)
    const A = listaEjes().filter((a) => kEje(a) === (fa.enX ? 0 : 1));
    for (const a of A) { const u = a.start[fa.enX ? 0 : 1]; raya(fa.punto(u, zBot - vz * 0.5), fa.punto(u, zTop + vz)); }
    c.render();
    // rótulos HTML (nítidos, tamaño fijo), anclados por su borde hacia fuera: no tocan nada del modelo
    const etiquetas = () => {
      capaDatos.innerHTML = "";
      const hr = host.getBoundingClientRect();
      for (const l of N) {
        const [x, y] = aPantalla(fa.punto(izq, l.z));
        const e = document.createElement("div"); e.textContent = `${l.label}`;
        const derecha = true;   // está en el lado izquierdo: crece hacia la izquierda, alejándose del edificio
        e.style.cssText = `position:absolute;top:${y - hr.top}px;left:${x - hr.left}px;transform:translate(${derecha ? "-100%" : "0"},-50%);` +
          "margin:0 6px;background:#0b1220;border:1px solid #94a3b8;color:#e2e8f0;font:600 11px Consolas,monospace;padding:1px 6px;border-radius:3px;white-space:nowrap";
        capaDatos.appendChild(e);
      }
      for (const a of A) {
        const u = a.start[fa.enX ? 0 : 1]; const [x, y] = aPantalla(fa.punto(u, zTop + vz));
        const e = document.createElement("div"); e.textContent = a.label;
        e.style.cssText = `position:absolute;top:${y - hr.top}px;left:${x - hr.left}px;transform:translate(-50%,-100%);` +
          "width:24px;height:24px;border-radius:50%;background:#0b1220;border:2px solid #cbd5e1;color:#e2e8f0;font:700 12px Consolas,monospace;display:flex;align-items:center;justify-content:center";
        capaDatos.appendChild(e);
      }
      bucleDatos = requestAnimationFrame(etiquetas);
    };
    etiquetas();
  }

  // ── COTAS TEMPORALES (Revit) ────────────────────────────────────────────
  // Sacado de la interfaz de Revit (UIFrameworkRes.dll, ayuda de «Temporary Dimensions»):
  // «Temporary dimensions are created to the nearest perpendicular component and increment by the
  // increment value specified for snap increments». O sea: al dibujar o designar un eje o un nivel sale una
  // cota azul hasta el paralelo MÁS CERCANO; se pulsa el número, se escribe y el elemento se mueve.
  type Cota = { a: V3; b: V3; valor: number; aplicar?: (v: number) => string | null };
  let cotas: Cota[] = [];
  const capa = document.createElement("div"); capa.className = "rv-cotas";
  capa.style.cssText = "position:absolute;inset:0;pointer-events:none";
  raiz.insertBefore(capa, raiz.firstChild);
  let bucle = 0;
  const pintarCotas = () => {
    capa.innerHTML = "";
    if (!cotas.length) return;
    const hr = host.getBoundingClientRect();
    const NS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(NS, "svg"); svg.setAttribute("width", "100%"); svg.setAttribute("height", "100%");
    svg.style.cssText = "position:absolute;inset:0;overflow:visible"; capa.appendChild(svg);
    for (const c of cotas) {
      const [ax, ay] = aPantalla(c.a), [bx, by] = aPantalla(c.b);
      const x1 = ax - hr.left, y1 = ay - hr.top, x2 = bx - hr.left, y2 = by - hr.top;
      const L = Math.hypot(x2 - x1, y2 - y1) || 1, nx = -(y2 - y1) / L * 6, ny = (x2 - x1) / L * 6;
      const ln = (a: number, b: number, c2: number, d: number) => { const l = document.createElementNS(NS, "line");
        l.setAttribute("x1", String(a)); l.setAttribute("y1", String(b)); l.setAttribute("x2", String(c2)); l.setAttribute("y2", String(d));
        l.setAttribute("stroke", "#38bdf8"); l.setAttribute("stroke-width", "1.5"); svg.appendChild(l); };
      ln(x1, y1, x2, y2); ln(x1 - nx, y1 - ny, x1 + nx, y1 + ny); ln(x2 - nx, y2 - ny, x2 + nx, y2 + ny);
      const t = document.createElement("div"); t.className = "rv-cota-t"; t.textContent = c.valor.toFixed(2);
      t.style.cssText = `position:absolute;left:${(x1 + x2) / 2}px;top:${(y1 + y2) / 2}px;transform:translate(-50%,-50%);` +
        "background:#0b1220;border:1px solid #38bdf8;color:#7dd3fc;font:600 12px Consolas,monospace;padding:1px 6px;border-radius:4px;" +
        (c.aplicar ? "pointer-events:auto;cursor:text" : "pointer-events:none");
      if (c.aplicar) t.title = "Pulsa para escribir la distancia";
      if (c.aplicar) t.addEventListener("pointerdown", (ev) => {
        ev.stopPropagation(); ev.preventDefault();
        const i = document.createElement("input"); i.type = "text"; i.value = c.valor.toFixed(2); i.className = "rv-cota-in";
        i.style.cssText = t.style.cssText + ";width:64px;outline:none;color:#ecfeff;border-color:#22d3ee";
        cancelAnimationFrame(bucle); bucle = 0;
        t.replaceWith(i); setTimeout(() => { i.focus(); i.select(); }, 0);
        let hecho = false;
        const fin = (ok: boolean) => {
          if (hecho) return; hecho = true;
          if (ok) { const e = c.aplicar!(parseFloat(i.value.replace(",", "."))); if (e) decir(e); }
          seguirCotas();
        };
        i.addEventListener("keydown", (k) => { k.stopPropagation(); if (k.key === "Enter") fin(true); if (k.key === "Escape") fin(false); });
        i.addEventListener("blur", () => setTimeout(() => { if (document.hasFocus() && document.activeElement !== i) fin(false); }, 0));
      });
      capa.appendChild(t);
    }
  };
  // las cotas siguen a la cámara (zoom, órbita) mientras estén puestas
  const seguirCotas = () => {
    cancelAnimationFrame(bucle); bucle = 0;
    const paso = () => { if (!cotas.length) { capa.innerHTML = ""; return; } if (!capa.querySelector(".rv-cota-in")) pintarCotas(); bucle = requestAnimationFrame(paso); };
    paso();
  };
  const ponerCotas = (cs: Cota[]) => { cotas = cs; seguirCotas(); };
  function quitarCotas() { cotas = []; capa.innerHTML = ""; cancelAnimationFrame(bucle); bucle = 0; datoSel = null; }

  type Eje = { label: string; start: number[]; end: number[] };
  const listaEjes = () => (W().__hekatanAxisGrids ?? []) as Eje[];
  const kEje = (a: Eje) => (Math.abs(a.start[0] - a.end[0]) < 1e-6 ? 0 : Math.abs(a.start[1] - a.end[1]) < 1e-6 ? 1 : -1);
  /** cotas de un eje a sus paralelos vecinos (el de antes y el de después) */
  const cotasDeEje = (label: string, solo1 = false): Cota[] => {
    const A = listaEjes(); const ax = A.find((a) => a.label === label); if (!ax) return [];
    const k = kEje(ax); if (k < 0) return [];
    const pos = ax.start[k], o = 1 - k;
    const lo = Math.min(ax.start[o], ax.end[o]), hi = Math.max(ax.start[o], ax.end[o]);
    const par = A.filter((a) => a !== ax && kEje(a) === k).map((a) => a.start[k]).sort((u, v) => u - v);
    const antes = par.filter((v) => v < pos - 1e-9).pop(), despues = par.find((v) => v > pos + 1e-9);
    let vecinos = [antes, despues].filter((v) => v !== undefined) as number[];
    if (solo1 && vecinos.length > 1) vecinos = [vecinos.sort((u, v) => Math.abs(u - pos) - Math.abs(v - pos))[0]];
    const along = ax.end[o] >= ax.start[o] ? hi - 0.18 * (hi - lo) : lo + 0.18 * (hi - lo);
    return vecinos.map((n) => {
      const a: V3 = [0, 0, zAct], b: V3 = [0, 0, zAct];
      (a as number[])[k] = n; (b as number[])[k] = pos; (a as number[])[o] = along; (b as number[])[o] = along;
      return { a, b, valor: Math.abs(pos - n), aplicar: (v: number) => {
        if (!(v > 0)) return "La distancia tiene que ser mayor que cero.";
        const nuevo = +(n + Math.sign(pos - n) * v).toFixed(6); const e = moverEje(label, nuevo);
        if (!e) { datoSel = { tipo: "eje", id: label }; ponerCotas(cotasDeEje(label)); } return e;
      } };
    });
  };
  /** cotas de un nivel a sus vecinos, dibujadas en el alzado frente */
  const cotasDeNivel = (z: number, solo1 = false): Cota[] => {
    const N = niveles(); const i = N.findIndex((l) => Math.abs(l.z - z) < 1e-6); if (i < 0) return [];
    let vecinos = [N[i - 1]?.z, N[i + 1]?.z].filter((v) => v !== undefined) as number[];
    if (solo1 && vecinos.length > 1) vecinos = [N[i - 1].z];
    const fa = fachada(), um = uCota(fa);
    return vecinos.map((n) => ({ a: fa.punto(um, n), b: fa.punto(um, z), valor: Math.abs(z - n), aplicar: (v: number) => {
      if (!(v > 0)) return "La distancia tiene que ser mayor que cero.";
      const nuevo = +(n + Math.sign(z - n) * v).toFixed(6); const e = moverNivel(z, nuevo);
      if (!e) { pintarDatos(); datoSel = { tipo: "nivel", id: String(nuevo) }; ponerCotas(cotasDeNivel(nuevo)); } return e;
    } }));
  };
  let datoSel: { tipo: "eje" | "nivel"; id: string } | null = null;
  /** Modificar: ¿el clic cae sobre un eje (planta) o un nivel (alzado)? */
  /** ¿Hay un nudo o una barra del MODELO bajo el cursor (≤ 8 px)? Entonces manda la selección, no el eje. */
  const modeloBajo = (ev: MouseEvent): boolean => {
    const P = (W().__hekatanDrawingPoints?.rawVal ?? []) as V3[], L = (W().__hekatanDrawingPolylines?.rawVal ?? []) as number[][];
    const tol = 8, mx = ev.clientX, my = ev.clientY;
    const pant = P.map((p) => aPantalla(p));
    for (const [x, y] of pant) if (Math.hypot(x - mx, y - my) <= tol) return true;
    for (const pl of L) for (let i = 0; i + 1 < (pl?.length ?? 0); i++) {
      const A = pant[pl[i]], B = pant[pl[i + 1]]; if (!A || !B) continue;
      const vx = B[0] - A[0], vy = B[1] - A[1], L2 = vx * vx + vy * vy || 1;
      const t = Math.max(0, Math.min(1, ((mx - A[0]) * vx + (my - A[1]) * vy) / L2));
      if (Math.hypot(mx - (A[0] + t * vx), my - (A[1] + t * vy)) <= tol / 2) return true;
    }
    return false;
  };
  const designarDato = (ev: MouseEvent): boolean => {
    // Como Revit/AutoCAD: el elemento del modelo manda sobre la línea de referencia. En planta TODOS los
    // nudos están sobre ejes y el clic se iba al eje (enseñaba sus cotas): no se podía seleccionar ni un
    // nudo, ni cerrar una ventana de selección cerca de un eje (Jorge, 18-oct-2026).
    if (modeloBajo(ev) || W().__hekatanRectEnCurso?.()) return false;
    const d = (p: V3, q: V3) => { const [ax, ay] = aPantalla(p), [bx, by] = aPantalla(q);
      const vx = bx - ax, vy = by - ay, L2 = vx * vx + vy * vy || 1; const t = Math.max(0, Math.min(1, ((ev.clientX - ax) * vx + (ev.clientY - ay) * vy) / L2));
      return Math.hypot(ev.clientX - (ax + t * vx), ev.clientY - (ay + t * vy)); };
    if (vista === "planta") {
      let mejor: Eje | null = null, dm = 7;
      for (const a of listaEjes()) { const dd = d([a.start[0], a.start[1], zAct], [a.end[0], a.end[1], zAct]); if (dd < dm) { dm = dd; mejor = a; } }
      if (!mejor) return false;
      datoSel = { tipo: "eje", id: mejor.label }; ponerCotas(cotasDeEje(mejor.label));
      decir(`Eje ${mejor.label} designado: pulsa una cota azul y escribe la distancia.`); return true;
    }
    if (vista === "alzado") {
      const fa = fachada();
      let mejor: number | null = null, dm = 7;
      for (const l of niveles()) { const dd = d(fa.punto(fa.u0 - 2, l.z), fa.punto(fa.u1 + 2, l.z)); if (dd < dm) { dm = dd; mejor = l.z; } }
      if (mejor === null) return false;
      const zz = mejor;
      datoSel = { tipo: "nivel", id: String(zz) }; ponerCotas(cotasDeNivel(zz));
      decir(`Nivel ${niveles().find((l) => l.z === zz)?.label} designado: pulsa una cota azul y escribe la distancia.`); return true;
    }
    return false;
  };

  // ── herramienta EJE (GR): dos clics, burbuja sola, cota al paralelo más cercano ─────────────
  const siguienteEtiqueta = (vertical: boolean) => {
    const A = listaEjes();
    if (vertical) {   // letra: x constante (corre en Y), como lo hace la Rejilla
      const usadas = new Set(A.filter((a) => !/^\d+$/.test(a.label)).map((a) => a.label));
      for (let i = 0; i < 702; i++) { const l = i < 26 ? String.fromCharCode(65 + i) : String.fromCharCode(64 + Math.floor(i / 26)) + String.fromCharCode(65 + (i % 26)); if (!usadas.has(l)) return l; }
      return "Z" + A.length;
    }
    const nums = A.filter((a) => /^\d+$/.test(a.label)).map((a) => +a.label);
    return String((nums.length ? Math.max(...nums) : 0) + 1);
  };
  const finEje = (p: V3): V3 => {   // ortogonal: horizontal o vertical según hacia dónde va el ratón
    if (!pendiente) return p;
    return Math.abs(p[0] - pendiente[0]) >= Math.abs(p[1] - pendiente[1]) ? [p[0], pendiente[1], zAct] : [pendiente[0], p[1], zAct];
  };
  const cotaProvisional = (a: V3, b: V3): Cota[] => {
    const vertical = Math.abs(a[0] - b[0]) < 1e-9, k = vertical ? 0 : 1, o = 1 - k, pos = a[k];
    const par = listaEjes().filter((e) => kEje(e) === k).map((e) => e.start[k]);
    if (!par.length) return [];
    const n = par.reduce((m, v) => (Math.abs(v - pos) < Math.abs(m - pos) ? v : m), par[0]);
    const along = a[o] + 0.82 * (b[o] - a[o]);
    const p1: V3 = [0, 0, zAct], p2: V3 = [0, 0, zAct]; p1[k] = n; p2[k] = pos; p1[o] = along; p2[o] = along;
    return Math.abs(pos - n) > 1e-9 ? [{ a: p1, b: p2, valor: Math.abs(pos - n) }] : [];
  };
  // la cota EDITABLE del último elemento se queda puesta (como en Revit, hasta empezar el siguiente);
  // la provisional del que se está dibujando va al lado, solo para leer
  const fijas = () => cotas.filter((c) => c.aplicar);
  function previaEje(p: V3) {
    if (!pendiente) return;
    const q = finEje(p);
    linea([pendiente, q]);
    ponerCotas([...fijas(), ...cotaProvisional(pendiente, q)]);
  }
  function clicEje(p: V3) {
    if (!pendiente) { quitarCotas(); pendiente = p; decir("EJE: clic en el final."); return; }
    const a = pendiente, b = finEje(p); pendiente = null;
    if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 0.5) { decir("El eje es demasiado corto."); return; }
    const vertical = Math.abs(a[0] - b[0]) < 1e-9;
    const k = vertical ? 0 : 1;
    if (listaEjes().some((e) => kEje(e) === k && Math.abs(e.start[k] - a[k]) < 1e-6)) { decir("Ya hay un eje ahí."); return; }
    const label = siguienteEtiqueta(vertical);
    listaEjes().push({ label, start: [a[0], a[1], 0], end: [b[0], b[1], 0] });
    W().__hekatanRefreshAxes?.(); W().__hekatanAjustarRejilla?.(); pintarNav(); limpiarFantasma();
    datoSel = { tipo: "eje", id: label }; ponerCotas(cotasDeEje(label, true));
    decir(`Eje ${label} creado. Pulsa la cota azul para fijar la distancia exacta.`);
  }

  // ── herramienta NIVEL (LL): en el alzado, un clic a la altura ─────────────────────────────────
  const zNivel = (ev: MouseEvent): number | null => {
    const q = enPlano(ev); if (!q) return null;
    let z = Math.round(q[2] * 10) / 10;                                  // paso de 0.10 m
    for (const p of (W().__hekatanDrawingPoints?.rawVal ?? []) as number[][]) {   // o la cota de un nudo cercano
      const s = aPantalla([q[0], q[1], p[2]]); if (Math.abs(s[1] - ev.clientY) < 6) { z = p[2]; break; }
    }
    return z;
  };
  const cotaNivelProvisional = (z: number): Cota[] => {
    const N = niveles(); if (!N.length) return [];
    const n = N.reduce((m, l) => (Math.abs(l.z - z) < Math.abs(m - z) ? l.z : m), N[0].z);
    const fa = fachada(), um = uCota(fa);
    return Math.abs(z - n) > 1e-9 ? [{ a: fa.punto(um, n), b: fa.punto(um, z), valor: Math.abs(z - n) }] : [];
  };
  function previaNivel(ev: MouseEvent) {
    limpiarFantasma();
    const z = zNivel(ev); if (z === null) return;
    const fa = fachada();
    linea([fa.punto(fa.u0 - 2, z), fa.punto(fa.u1 + 2, z)]);
    ponerCotas([...fijas(), ...cotaNivelProvisional(z)]);
    msg.textContent = `NIVEL · cota ${z.toFixed(2)} m`;
  }
  function clicNivel(ev: MouseEvent) {
    const z = zNivel(ev); if (z === null) return;
    if (niveles().some((l) => Math.abs(l.z - z) < 1e-6)) { decir("Ya hay un nivel a esa cota."); return; }
    asegurarNiveles();
    (W().__hekatanLevels as { label: string; z: number }[]).push({ label: `N${z >= 0 ? "+" : ""}${z.toFixed(2)}`, z });
    W().__hekatanRefreshLevels?.(); W().__hekatanAjustarRejilla?.(); pintarNav(); limpiarFantasma(); pintarDatos();
    datoSel = { tipo: "nivel", id: String(z) }; ponerCotas(cotasDeNivel(z, true));
    decir(`Nivel N${z >= 0 ? "+" : ""}${z.toFixed(2)} creado, con su planta en el navegador. Pulsa la cota azul para ajustar la altura.`);
  }
  // Los clics del lienzo se interceptan en CAPTURA (antes que el CAD y la órbita) solo con una
  // herramienta de este modo activa, y solo el botón izquierdo: la rueda y el derecho siguen moviendo la vista.
  const activo = () => encendido && herr !== "modificar";
  let abajo: { x: number; y: number } | null = null;
  viewerElm.addEventListener("pointerdown", (ev) => {
    // Modificar: un clic sobre un eje (en planta) o un nivel (en alzado) lo designa y enseña sus cotas
    if (encendido && herr === "modificar" && ev.button === 0 && (ev.target as HTMLElement).tagName === "CANVAS") {
      if (designarDato(ev)) { ev.stopPropagation(); ev.preventDefault(); } else quitarCotas();
      return;
    }
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
    if (ev.key === "Escape") { if (pendiente) { pendiente = null; limpiarFantasma(); quitarCotas(); } else if (cotas.length) quitarCotas(); else usar("modificar"); return; }
    if (!/^[a-z]$/i.test(ev.key) || ev.ctrlKey || ev.altKey) return;
    const ahora = performance.now(); buf = (ahora - tBuf < 900 ? buf : "") + ev.key.toUpperCase(); tBuf = ahora;
    const mapa: Record<string, () => void> = { CL: () => usar("columna"), BM: () => usar("viga"), SB: () => usar("losa"), WA: () => usar("muro"), GR: () => usar("eje"), LL: () => usar("nivel") };
    const f = mapa[buf.slice(-2)]; if (f) { ev.preventDefault(); ev.stopPropagation(); buf = ""; f(); }
  }, true);

  // ── encender / apagar ───────────────────────────────────────────────────
  const tog = document.createElement("button"); tog.id = "hk-revit-toggle"; tog.type = "button";
  let encendido = false;
  let extruAntes: boolean | null = null;
  const poner = (v: boolean) => {
    encendido = v;
    document.body.classList.toggle("hk-revit-on", v);
    setTimeout(() => { try { W().__hekatanRefrescarGrillas?.(); } catch {} }, 0);
    colocar();
    raiz.style.display = v ? "block" : "none";
    tog.textContent = v ? "Cinta clásica" : "🏛 Modo Revit";
    tog.title = v ? "Volver a la cinta de herramientas de siempre" : "Dibujar por niveles: Columna, Viga, Losa, Muro";
    hooks.cinta(!v);
    // con la cinta clásica el botón quedaba DEBAJO de ella (z 56 < 60; solo asomaba «…it» y Jorge no
    // encontraba cómo volver): pasa a ser un botón más DENTRO de la cinta. En Revit vuelve a su sitio.
    setTimeout(ubicarToggle, 0);
    try { localStorage.setItem(LS, v ? "1" : "0"); } catch {}
    // secciones EXTRUIDAS: en planta una columna de línea es un punto invisible; Revit la dibuja con su
    // sección (cuadrado). Al salir se deja como estaba.
    try { const sv = W().__hekatanSettings?.(); if (sv?.extruded) { if (v) { extruAntes = sv.extruded.rawVal; sv.extruded.val = true; } else if (extruAntes !== null) sv.extruded.val = extruAntes; } } catch {}
    if (v) { try { W().__hekatanAccesoRapido?.(false); } catch {} asegurarNiveles(); pintarNav(); usar("modificar"); }
    else {
      limpiarFantasma();
      // la cinta clásica es más alta que la barra de Revit: sin reencuadrar, tapaba la fila de arriba de la
      // planta (test ctl_edificio_revit: 5 de 20 apoyos caían sobre la cinta). encuadrar() mide lo que tapa.
      const m = vista === "alzado" ? "alzado" : vista === "3d" ? "iso" : "plan";
      setTimeout(() => encuadrar(m), 250); setTimeout(() => encuadrar(m), 600);
    }
  };
  tog.onclick = () => poner(!encendido);
  // La barra de título de la app es FIJA (30 px) y el lienzo empieza debajo de ella: todo se baja
  // lo que tape, medido (si no, la fila de herramientas quedaba cortada por arriba).
  const ubicarToggle = () => {
    const cintaEl = document.getElementById("hk-ribbon");
    if (!encendido && cintaEl) { if (tog.parentElement !== cintaEl) cintaEl.appendChild(tog); tog.classList.add("en-cinta"); }
    else if (tog.parentElement !== host) { host.append(tog); tog.classList.remove("en-cinta"); colocar(); }
  };
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
  else { setTimeout(ubicarToggle, 300); setTimeout(ubicarToggle, 1500); }   // la cinta puede crearse después

  (window as any).__hekatanModoRevit = {
    poner, usar, activarNivel, activarFrente, activarAlzado, ver3D, vista: () => ({ vista, dirAlz }), nuevoNivel, cotas: () => cotas.map((c) => ({ valor: c.valor, editable: !!c.aplicar })), moverNivel, moverEje, pegado: (v?: boolean) => (v === undefined ? pegado : (pegado = v)), columnasEnEjes, vigasEnEjes, losasTodas, abrirEjes,
    estado: () => ({ encendido, herr, zAct, niveles: niveles(), ejes: ejes() }),
  };
}
