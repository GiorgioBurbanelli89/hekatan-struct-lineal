/**
 * 🗂 EXPLORADOR DEL MODELO (1-oct-2026) — como el «Model Explorer» de ETABS, pero para cualquier modelo del workspace
 * (ejemplo paramétrico, dibujado o importado). Jorge: «si selecciono líneas frame poderle cambiar la sección igual que
 * ETABS, pero más cómodo; una ventana de listas donde se vean todos los elementos».
 *
 *   Propiedades  › Secciones de barra (agrupadas por A, I33, I22, J, E) · Secciones de área (espesor, E) · Materiales
 *   Objetos      › Columnas · Vigas · Diagonales · Losas · Muros · Nudos · Apoyos
 *   Pisos        › por cota: barras y áreas de cada piso
 * Pulsar un grupo lo RESALTA en 3D; «Editar» cambia la sección de TODO el grupo: barra rectangular b × h o perfil I
 * paramétrico (cotas libres, iSectionCsi = SAP2000), área = espesor; E y ρ editables (hormigón ↔ acero). El cambio va a
 * elementInputs: el modelo se recalcula y los «4 jueces en vivo» se actualizan solos.
 * ⚠️ En un ejemplo paramétrico, mover un parámetro que REGENERA el modelo deshace lo editado aquí.
 */
import * as THREE from "three";
import type { State } from "vanjs-core";
import { rectSection, iSectionCsi } from "./cadSections";

export interface ModeloExpl { nodes: State<any[]>; elements: State<any[]>; nodeInputs: State<any>; elementInputs: State<any> }

type Grupo = { clave: string; nombre: string; detalle: string; elems: number[]; tipo: "barra" | "area" | "otro" };

const aMap = (o: any) => (o instanceof Map ? o : new Map(Object.entries(o ?? {}).map(([k, v]) => [Number(k), v])));
const r3 = (v: number) => (v === undefined || v === null || !isFinite(v) ? "—" : Math.abs(v) >= 1000 || (Math.abs(v) < 0.001 && v !== 0) ? v.toExponential(3) : v.toFixed(4));

function clasificar(nodes: number[][], el: number[]) {
  if (el.length === 2) {
    const d = [0, 1, 2].map((c) => nodes[el[1]][c] - nodes[el[0]][c]), L = Math.hypot(...d);
    const v = L > 0 ? Math.abs(d[2]) / L : 0;
    return v > 0.94 ? "Columnas" : v < 0.34 ? "Vigas" : "Diagonales";
  }
  if (el.length >= 3) {
    const zs = el.map((n) => nodes[n][2]);
    return Math.max(...zs) - Math.min(...zs) < 1e-6 ? "Losas" : "Muros";
  }
  return "Otros";
}

function grupos(st: ModeloExpl) {
  const nodes = st.nodes.val ?? [], elements = st.elements.val ?? [], ei = st.elementInputs.val ?? {}, ni = st.nodeInputs.val ?? {};
  const A = aMap(ei.areas), I33 = aMap(ei.momentsOfInertiaZ), I22 = aMap(ei.momentsOfInertiaY), J = aMap(ei.torsionalConstants);
  const E = aMap(ei.elasticities), T = aMap(ei.thicknesses), R = aMap(ei.densities);
  const secB = new Map<string, Grupo>(), secA = new Map<string, Grupo>(), mats = new Map<string, Grupo>(), objs = new Map<string, Grupo>();
  const pisos = new Map<number, Grupo>();
  const zs = [...new Set(nodes.map((p) => +p[2].toFixed(3)))].sort((a, b) => a - b);
  elements.forEach((el: number[], i: number) => {
    const cl = clasificar(nodes, el);
    if (!objs.has(cl)) objs.set(cl, { clave: "o:" + cl, nombre: cl, detalle: "", elems: [], tipo: el.length === 2 ? "barra" : "area" });
    objs.get(cl)!.elems.push(i);
    const e = E.get(i), rho = R.get(i);
    const km = `${r3(e)}|${r3(rho)}`;
    if (!mats.has(km)) mats.set(km, { clave: "m:" + km, nombre: `E ${r3(e)} · ρ ${r3(rho)}`, detalle: "", elems: [], tipo: "otro" });
    mats.get(km)!.elems.push(i);
    if (el.length === 2) {
      const k = [A.get(i), I33.get(i), I22.get(i), J.get(i), e].map(r3).join("|");
      if (!secB.has(k)) secB.set(k, { clave: "b:" + k, nombre: "", detalle: `A ${r3(A.get(i))} · I33 ${r3(I33.get(i))} · I22 ${r3(I22.get(i))} · J ${r3(J.get(i))}`, elems: [], tipo: "barra" });
      secB.get(k)!.elems.push(i);
    } else if (el.length >= 3) {
      const k = [T.get(i), e].map(r3).join("|");
      if (!secA.has(k)) secA.set(k, { clave: "a:" + k, nombre: `espesor ${(T.get(i) ?? 0).toFixed(3)} m`, detalle: `E ${r3(e)}`, elems: [], tipo: "area" });
      secA.get(k)!.elems.push(i);
    }
    const ztop = Math.max(...el.map((n) => nodes[n][2]));
    if (ztop > 1e-6) {
      const kz = zs.find((z) => Math.abs(z - ztop) < 1e-3) ?? ztop;
      if (!pisos.has(kz)) pisos.set(kz, { clave: "p:" + kz, nombre: `z = ${kz.toFixed(2)} m`, detalle: "", elems: [], tipo: "otro" });
      pisos.get(kz)!.elems.push(i);
    }
  });
  // nombre de cada sección de barra por el tipo dominante (C1, V1…), como en ETABS
  let nc = 0, nv = 0, nd = 0;
  for (const g of secB.values()) {
    const cuenta = (c: string) => g.elems.filter((i) => clasificar(nodes, elements[i]) === c).length;
    const t = ["Columnas", "Vigas", "Diagonales"].sort((a, b) => cuenta(b) - cuenta(a))[0];
    g.nombre = t === "Columnas" ? `C${++nc}` : t === "Vigas" ? `V${++nv}` : `D${++nd}`;
  }
  const apoyos = [...aMap(ni.supports).keys()];
  return { secB: [...secB.values()], secA: [...secA.values()], mats: [...mats.values()], objs: [...objs.values()],
    pisos: [...pisos.entries()].sort((a, b) => a[0] - b[0]).map(([, g]) => g), nudos: nodes.length, apoyos: apoyos.length };
}

export function montarExplorador(folder: any, st: ModeloExpl) {
  const f = folder.addFolder({ title: "🗂 Explorador del modelo", expanded: false });
  f.addButton({ title: "Abrir explorador (secciones, objetos, pisos)" }).on("click", () => ventana(st).abrir());
  return { folder: f, abrir: () => ventana(st).abrir() };
}

// ── la ventana ─────────────────────────────────────────────────────────────────────────────────────────────
let _v: { abrir: () => void } | null = null;
let _resaltes: THREE.Object3D[] = [];

function ctxVisor(): any { return (document.querySelector("#viewer") as any)?.__ctx ?? ([...document.querySelectorAll("div")] as any[]).find((d) => d.__ctx)?.__ctx; }

function resaltar(st: ModeloExpl, elems: number[]) {
  const ctx = ctxVisor(); if (!ctx) return;
  for (const o of _resaltes) { ctx.scene.remove(o); (o as any).geometry?.dispose(); }
  _resaltes = [];
  if (!elems.length) { ctx.render(); return; }
  const nodes = st.nodes.val, elements = st.elements.val, pts: number[] = [];
  for (const i of elems) {
    const el = elements[i]; if (!el) continue;
    const ring = el.length === 2 ? [el[0], el[1]] : [...el, el[0]];
    for (let k = 0; k + 1 < ring.length; k++) { const a = nodes[ring[k]], b = nodes[ring[k + 1]]; pts.push(a[0], a[1], a[2], b[0], b[1], b[2]); }
  }
  const geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  const lin = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: 0xff00ff, depthTest: false, transparent: true, opacity: 0.95 }));
  lin.renderOrder = 9999; ctx.scene.add(lin); _resaltes.push(lin); ctx.render();
}

function ventana(st: ModeloExpl) {
  if (_v) return _v;
  const el = document.createElement("div");
  el.id = "hk-explorador";
  Object.assign(el.style, { position: "fixed", right: "340px", top: "50px", width: "360px", maxHeight: "calc(100vh - 130px)", overflow: "auto",
    background: "rgba(16, 20, 28, 0.97)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: "8px", boxShadow: "0 6px 24px rgba(0,0,0,0.5)",
    padding: "8px", fontFamily: "Segoe UI, system-ui, sans-serif", fontSize: "12px", color: "#e2e8f0", zIndex: "103", display: "none" } as CSSStyleDeclaration);
  const cab = document.createElement("div"); cab.style.cssText = "display:flex;justify-content:space-between;align-items:center;cursor:move;margin-bottom:6px";
  cab.innerHTML = `<b style="color:#a5b4fc;font-size:13px">🗂 Explorador del modelo</b>`;
  const x = document.createElement("button"); x.textContent = "×"; x.style.cssText = "background:transparent;border:none;color:#e2e8f0;font-size:18px;cursor:pointer";
  x.onclick = () => { el.style.display = "none"; resaltar(st, []); };
  cab.appendChild(x);
  const arbol = document.createElement("div"), editor = document.createElement("div");
  editor.style.cssText = "margin-top:8px;border-top:1px solid rgba(255,255,255,0.15);padding-top:6px";
  el.append(cab, arbol, editor); document.body.appendChild(el);
  let arr: { x: number; y: number } | null = null;
  cab.onmousedown = (e) => { const r = el.getBoundingClientRect(); arr = { x: e.clientX - r.left, y: e.clientY - r.top }; };
  window.addEventListener("mousemove", (e) => { if (!arr) return; Object.assign(el.style, { left: `${e.clientX - arr.x}px`, top: `${e.clientY - arr.y}px`, right: "auto" }); });
  window.addEventListener("mouseup", () => { arr = null; });

  let elegido: Grupo | null = null;
  const fila = (g: Grupo, editable: boolean) =>
    `<div class="hk-ex-fila" data-k="${encodeURIComponent(g.clave)}" style="display:flex;justify-content:space-between;align-items:center;padding:2px 6px;border-radius:4px;cursor:pointer;${elegido?.clave === g.clave ? "background:#3b2a5c" : ""}">
      <span><b>${g.nombre}</b> <span style="color:#94a3b8">${g.detalle}</span></span>
      <span style="color:#cbd5e1;white-space:nowrap">${g.elems.length}${editable ? ` <button class="hk-ex-ed" data-k="${encodeURIComponent(g.clave)}" style="margin-left:6px;background:#336699;color:#fff;border:none;border-radius:4px;padding:1px 6px;cursor:pointer">Editar</button>` : ""}</span></div>`;
  const rama = (t: string, cuerpo: string, abierta = true) => `<details ${abierta ? "open" : ""} style="margin:2px 0"><summary style="cursor:pointer;color:#a5b4fc;font-weight:600">${t}</summary><div style="margin-left:12px">${cuerpo}</div></details>`;
  let G: ReturnType<typeof grupos>;
  function pintar() {
    G = grupos(st);
    arbol.innerHTML = rama("Modelo", [
      rama("Propiedades", rama(`Secciones de barra (${G.secB.length})`, G.secB.map((g) => fila(g, true)).join("") || "—") +
        rama(`Secciones de área (${G.secA.length})`, G.secA.map((g) => fila(g, true)).join("") || "—") +
        rama(`Materiales (${G.mats.length})`, G.mats.map((g) => fila(g, false)).join(""), false)),
      rama("Objetos estructurales", G.objs.map((g) => fila(g, false)).join("") +
        `<div style="padding:2px 6px;color:#94a3b8">Nudos ${G.nudos} · Apoyos ${G.apoyos}</div>`),
      rama("Pisos", G.pisos.map((g) => fila(g, false)).join(""), false),
    ].join(""));
    const todos = [...G.secB, ...G.secA, ...G.mats, ...G.objs, ...G.pisos];
    arbol.querySelectorAll<HTMLElement>(".hk-ex-fila").forEach((d) => d.onclick = (e) => {
      if ((e.target as HTMLElement).classList.contains("hk-ex-ed")) return;
      const g = todos.find((q) => q.clave === decodeURIComponent(d.dataset.k!)); if (!g) return;
      elegido = g; resaltar(st, g.elems); pintar();
    });
    arbol.querySelectorAll<HTMLElement>(".hk-ex-ed").forEach((b) => b.onclick = () => {
      const g = todos.find((q) => q.clave === decodeURIComponent(b.dataset.k!)); if (!g) return;
      elegido = g; resaltar(st, g.elems); pintar(); editar(g);
    });
  }
  function editar(g: Grupo) {
    const ei = st.elementInputs.val ?? {}, i0 = g.elems[0];
    const E0 = aMap(ei.elasticities).get(i0) ?? 0, R0 = aMap(ei.densities).get(i0) ?? 0, nu0 = aMap(ei.poissonsRatios).get(i0) ?? 0.2;
    const inp = (id: string, v: number, paso = "0.01") => `<input id="${id}" type="number" step="${paso}" value="${v}" style="width:84px;background:#1f2937;color:#fff;border:1px solid #475569;border-radius:3px;padding:2px">`;
    const barra = g.tipo === "barra";
    editor.innerHTML = `<b style="color:#fbbf24">Editar ${g.nombre} · ${g.elems.length} elementos</b>
      <div style="display:grid;grid-template-columns:auto auto;gap:4px 8px;margin-top:6px;align-items:center">
      ${barra ? `<span>Forma</span><select id="ex-forma" style="background:#1f2937;color:#fff;border:1px solid #475569"><option value="rect">Rectangular (hormigón)</option><option value="I">Perfil I (acero, cotas)</option></select>
        <span id="ex-l1">b (m)</span>${inp("ex-b", 0.4)}<span id="ex-l2">h canto (m)</span>${inp("ex-h", 0.4)}
        <span class="ex-I" style="display:none">tf (m)</span><span class="ex-I" style="display:none">${inp("ex-tf", 0.012, "0.001")}</span>
        <span class="ex-I" style="display:none">tw (m)</span><span class="ex-I" style="display:none">${inp("ex-tw", 0.008, "0.001")}</span>`
        : `<span>espesor (m)</span>${inp("ex-t", aMap(ei.thicknesses).get(i0) ?? 0.2)}`}
      <span>E</span>${inp("ex-E", E0, "1")}<span>ρ</span>${inp("ex-rho", R0, "0.01")}
      </div>
      <div style="color:#94a3b8;margin-top:4px">${barra ? "h = canto en las vigas (eje local 2); en columnas, la dimensión en X. I33 = fuerte, I22 = débil (CSI)." : "se cambia el espesor de todas las áreas del grupo"}</div>
      <button id="ex-aplicar" style="margin-top:6px;width:100%;padding:6px;background:#00aa66;color:#fff;border:none;border-radius:4px;cursor:pointer;font-weight:600">✓ Aplicar a ${g.elems.length} elementos</button>`;
    const forma = editor.querySelector("#ex-forma") as HTMLSelectElement | null;
    forma?.addEventListener("change", () => {
      const I = forma.value === "I";
      editor.querySelectorAll<HTMLElement>(".ex-I").forEach((e) => (e.style.display = I ? "" : "none"));
      (editor.querySelector("#ex-l1") as HTMLElement).textContent = I ? "bf ala (m)" : "b (m)";
      (editor.querySelector("#ex-l2") as HTMLElement).textContent = I ? "d canto (m)" : "h canto (m)";
    });
    editor.querySelector("#ex-aplicar")!.addEventListener("click", () => {
      const v = (id: string) => parseFloat((editor.querySelector("#" + id) as HTMLInputElement).value);
      const nuevo: any = { ...ei };
      const copia = (k: string) => (nuevo[k] = new Map(aMap(ei[k])));
      ["elasticities", "densities", "poissonsRatios", "shearModuli"].forEach(copia);
      if (barra) {
        ["areas", "momentsOfInertiaZ", "momentsOfInertiaY", "torsionalConstants", "shearAreasY", "shearAreasZ"].forEach(copia);
        let p: { A: number; I33: number; I22: number; J: number; As2: number; As3: number };
        if (forma?.value === "I") { const s = iSectionCsi(v("ex-h"), v("ex-b"), v("ex-tf"), v("ex-tw")); p = { A: s.A, I33: s.Iz, I22: s.Iy, J: s.J, As2: s.As2, As3: s.As3 }; }
        else { const s = rectSection(v("ex-b"), v("ex-h")); p = { A: s.A, I33: s.Iz, I22: s.Iy, J: s.J, As2: (5 / 6) * s.A, As3: (5 / 6) * s.A }; }
        for (const i of g.elems) {
          nuevo.areas.set(i, p.A); nuevo.momentsOfInertiaZ.set(i, p.I33); nuevo.momentsOfInertiaY.set(i, p.I22); nuevo.torsionalConstants.set(i, p.J);
          nuevo.shearAreasY.set(i, p.As2); nuevo.shearAreasZ.set(i, p.As3);
        }
      } else { copia("thicknesses"); for (const i of g.elems) nuevo.thicknesses.set(i, v("ex-t")); }
      for (const i of g.elems) { nuevo.elasticities.set(i, v("ex-E")); nuevo.densities.set(i, v("ex-rho")); nuevo.shearModuli.set(i, v("ex-E") / (2 * (1 + nu0))); }
      st.elementInputs.val = nuevo;
      editor.innerHTML = `<div style="color:#4ade80">✓ aplicado a ${g.elems.length} elementos · el modelo se recalcula</div>`;
      elegido = null; setTimeout(() => { pintar(); resaltar(st, []); }, 300);
    });
  }
  _v = { abrir: () => { pintar(); editor.innerHTML = `<span style="color:#94a3b8">pulse un grupo para verlo en 3D; «Editar» cambia su sección</span>`; el.style.display = "block"; } };
  return _v;
}
