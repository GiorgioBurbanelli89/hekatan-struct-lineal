/**
 * Visor de IFC — enseña el modelo arquitectónico (mallas B-rep de SketchUp) que
 * NO trae estructura semántica. Lo que hace ETABS al importar un IFC es DOS
 * cosas: (1) dibujar la geometría, (2) convertir los elementos lineales en
 * barras y los planos en áreas. Esto es el paso (1): ver el modelo. La conversión
 * a estructura (paso 2) es aparte.
 *
 * La malla llega en `window.__hekatanIfcMesh` (grupos {positions, color}) que deja
 * el lector `parseIfc` sobre el fichero que sube el usuario.
 */
import * as THREE from "three";
import type { ExampleDef } from "../workspace/exampleRegistry";

interface Grupo { positions: number[]; color: [number, number, number]; }

// Estado de visibilidad por objeto (grupo de color del IFC).
const ifcHidden = new Set<number>();
let ifcSolo = -1;   // -1 = ninguno aislado
let ifcPanelHidden = false;   // panel corredizo (puerta) deslizado fuera
let ifcMin = false;           // panel minimizado (solo cabecera)

/** Desliza el panel de objetos fuera/dentro (puerta corrediza) + tab para reabrir. */
function slidePanelObjetos(hide: boolean): void {
  ifcPanelHidden = hide;
  const panel = document.getElementById("hk-ifc-objs");
  const tab = document.getElementById("hk-ifc-tab");
  if (panel) {
    panel.style.transition = "transform .25s ease, opacity .25s ease";
    panel.style.transform = hide ? "translateX(-115%)" : "";
    panel.style.opacity = hide ? "0" : "";
    panel.style.pointerEvents = hide ? "none" : "";
  }
  if (tab) tab.style.display = hide ? "block" : "none";
}

/** Panel flotante con la LISTA de objetos del IFC: color, nº de triángulos y
 * casillas para ocultar / aislar cada uno. Minimizable y corredizo (puerta). */
function refrescarPanelObjetos(grupos: Grupo[]): void {
  let panel = document.getElementById("hk-ifc-objs");
  if (!panel) {
    panel = document.createElement("div");
    panel.id = "hk-ifc-objs";
    panel.style.cssText =
      "position:fixed;left:16px;bottom:16px;z-index:120;background:rgba(16,22,30,0.95);" +
      "color:#cde;border:1px solid rgba(255,255,255,0.12);border-radius:8px;padding:8px 10px;" +
      "font:11px system-ui,sans-serif;max-height:44vh;overflow:auto;box-shadow:0 6px 24px rgba(0,0,0,.5);min-width:200px;";
    document.body.appendChild(panel);
  }
  // Tab para reabrir cuando está deslizado (puerta corrediza).
  if (!document.getElementById("hk-ifc-tab")) {
    const tab = document.createElement("button");
    tab.id = "hk-ifc-tab"; tab.textContent = "🏛 Objetos ⟩"; tab.title = "Mostrar objetos IFC";
    tab.style.cssText = "position:fixed;left:0;bottom:16px;z-index:121;display:none;padding:6px 10px;" +
      "border:1px solid #3a4a5f;border-radius:0 8px 8px 0;background:rgba(30,40,55,0.96);color:#9ce;cursor:pointer;font:11px system-ui;box-shadow:2px 0 8px rgba(0,0,0,.4)";
    tab.onclick = () => slidePanelObjetos(false);
    document.body.appendChild(tab);
  }
  const rows = ifcMin ? "" : grupos.map((g, i) => {
    const c = g.color.map((v) => Math.round(v * 255));
    const tri = Math.round(g.positions.length / 9);
    const vis = !ifcHidden.has(i) && (ifcSolo < 0 || ifcSolo === i);
    return `<div style="display:flex;align-items:center;gap:6px;padding:2px 0">
      <input type="checkbox" data-ifc-vis="${i}" ${vis ? "checked" : ""}>
      <span style="width:12px;height:12px;border-radius:2px;background:rgb(${c[0]},${c[1]},${c[2]});border:1px solid #0006;display:inline-block"></span>
      <span style="flex:1">Objeto ${i + 1}</span>
      <span style="color:#8ab">${tri} △</span>
      <button data-ifc-solo="${i}" title="Aislar" style="background:#243;color:#9fd;border:1px solid #365;border-radius:3px;cursor:pointer;font-size:10px;padding:1px 5px">solo</button>
    </div>`;
  }).join("");
  const btn = (id: string, txt: string, t: string) => `<button id="${id}" title="${t}" style="background:#333;color:#ccc;border:1px solid #555;border-radius:3px;cursor:pointer;font-size:11px;padding:1px 6px;margin-left:3px">${txt}</button>`;
  panel.innerHTML =
    `<div style="display:flex;justify-content:space-between;align-items:center;gap:6px;${ifcMin ? "" : "margin-bottom:4px"}">
       <b style="color:#9ce">🏛 Objetos IFC (${grupos.length})</b>
       <span style="white-space:nowrap">${ifcMin ? "" : `<button id="hk-ifc-all" style="background:#333;color:#ccc;border:1px solid #555;border-radius:3px;cursor:pointer;font-size:10px;padding:1px 6px">ver todos</button>`}${btn("hk-ifc-min", ifcMin ? "▢" : "▁", "Minimizar")}${btn("hk-ifc-slide", "⟨", "Ocultar (corredizo)")}</span>
     </div>${rows}`;
  const rebuild = () => { try { (window as any).__hekatanRebuild?.(); } catch {} };
  (panel.querySelector("#hk-ifc-min") as HTMLButtonElement).onclick = () => { ifcMin = !ifcMin; refrescarPanelObjetos(grupos); };
  (panel.querySelector("#hk-ifc-slide") as HTMLButtonElement).onclick = () => slidePanelObjetos(true);
  panel.querySelectorAll<HTMLInputElement>("[data-ifc-vis]").forEach((cb) => {
    cb.onchange = () => { const i = +cb.dataset.ifcVis!; ifcSolo = -1; if (cb.checked) ifcHidden.delete(i); else ifcHidden.add(i); rebuild(); };
  });
  panel.querySelectorAll<HTMLButtonElement>("[data-ifc-solo]").forEach((b) => {
    b.onclick = () => { const i = +b.dataset.ifcSolo!; ifcSolo = (ifcSolo === i) ? -1 : i; ifcHidden.clear(); rebuild(); };
  });
  const allBtn = panel.querySelector("#hk-ifc-all") as HTMLButtonElement | null;
  if (allBtn) allBtn.onclick = () => { ifcHidden.clear(); ifcSolo = -1; rebuild(); };
  slidePanelObjetos(ifcPanelHidden);   // conservar el estado corredizo tras redibujar
}
/** Quita el panel y su tab (al salir del visor IFC). */
function quitarPanelObjetos(): void { document.getElementById("hk-ifc-objs")?.remove(); document.getElementById("hk-ifc-tab")?.remove(); }

/** Caja del cluster más denso: parte por el hueco mayor del eje más largo. */
function cajaPrincipal(grupos: Grupo[], bboxTotal: [number[], number[]]): [number[], number[]] {
  const ax = [0, 1, 2].reduce((a, e) => (bboxTotal[1][e] - bboxTotal[0][e]) > (bboxTotal[1][a] - bboxTotal[0][a]) ? e : a, 0);
  const cen: number[] = [];
  for (const g of grupos) { const p = g.positions; for (let i = 0; i < p.length; i += 9) cen.push((p[i + ax] + p[i + 3 + ax] + p[i + 6 + ax]) / 3); }
  if (cen.length < 2) return bboxTotal;
  cen.sort((a, b) => a - b);
  let gi = 0, gmax = 0;
  for (let i = 1; i < cen.length; i++) { const d = cen[i] - cen[i - 1]; if (d > gmax) { gmax = d; gi = i; } }
  const span = cen[cen.length - 1] - cen[0];
  if (gmax < span * 0.15) return bboxTotal;   // un solo cluster
  const corte = (cen[gi] + cen[gi - 1]) / 2;
  const bajo = gi, alto = cen.length - gi;     // triángulos a cada lado
  const quedarseAlto = alto >= bajo;
  // bbox del lado elegido
  const mn = [1e30, 1e30, 1e30], mx = [-1e30, -1e30, -1e30];
  for (const g of grupos) { const p = g.positions;
    for (let i = 0; i < p.length; i += 9) {
      const c = (p[i + ax] + p[i + 3 + ax] + p[i + 6 + ax]) / 3;
      if ((quedarseAlto && c < corte) || (!quedarseAlto && c >= corte)) continue;
      for (let k = 0; k < 3; k++) for (const o of [0, 3, 6]) {
        const v = p[i + o + k]; if (v < mn[k]) mn[k] = v; if (v > mx[k]) mx[k] = v;
      }
    }
  }
  return [mn, mx];
}

export const ifcViewer: ExampleDef = {
  id: "ifc-viewer",
  name: "Ver IFC (arquitectura)",
  category: "🧪 Utilidades",
  defaultShellResult: "none",
  availableShellResults: [],
  params: {
    opacidad: { default: 100, min: 10, max: 100, step: 5, label: "Opacidad (%)", folder: "🏛 IFC" },
    caras: { default: 1, boolean: true, label: "Mostrar caras", folder: "🏛 IFC" },
  },
  computedLabels() {
    const M = (window as any).__hekatanIfcMesh;
    if (!M) return { "IFC": "ninguno — usa 📥 Importar IFC" };
    const e = M.estructura;
    const out: Record<string, string> = {
      "Archivo": String(M.archivo ?? "ifc"),
      "Objetos (colores)": String(M.grupos?.length ?? 0),
      "Triángulos": String(M.nTri ?? 0),
      "Tamaño (m)": M.bbox ? M.bbox[1].map((v: number, i: number) => (v - M.bbox[0][i]).toFixed(1)).join(" × ") : "—",
    };
    if (e) {
      const nEst = e.columnas + e.vigas + e.miembros + e.losas + e.muros + e.zapatas;
      out["Elementos estructurales"] = nEst > 0
        ? `col ${e.columnas} · vig ${e.vigas} · losa ${e.losas} · muro ${e.muros}`
        : `0 (solo mallas${e.proxies ? ` — ${e.proxies} objetos SketchUp` : ""})`;
      out["Convertible a estructura"] = nEst > 0 ? "sí" : "no (IFC de arquitectura)";
    }
    return out;
  },
  build(p, states) {
    const M = (window as any).__hekatanIfcMesh as { grupos: Grupo[]; bbox: [number[], number[]] } | undefined;
    if (!M || !M.grupos?.length) {
      states.nodes.val = []; states.elements.val = [];
      states.nodeInputs.val = { supports: new Map(), loads: new Map() };
      states.elementInputs.val = { elasticities: new Map(), shearModuli: new Map(), areas: new Map(),
        momentsOfInertiaY: new Map(), momentsOfInertiaZ: new Map(), torsionalConstants: new Map(),
        densities: new Map(), poissonsRatios: new Map() };
      states.objects3D.val = [];
      quitarPanelObjetos();
      console.log("[IFC] Sin modelo. Usa '📥 Importar IFC'.");
      return;
    }
    const op = Math.max(0.1, Math.min(1, (p.opacidad ?? 100) / 100));
    const objs: THREE.Object3D[] = [];
    // Luces: el visor arma la escena sin luz propia para las mallas IFC; sin esto
    // un MeshLambert/Standard sale NEGRO. Se meten como objects3D.
    objs.push(new THREE.AmbientLight(0xffffff, 0.75));
    const dl1 = new THREE.DirectionalLight(0xffffff, 0.7); dl1.position.set(1, 1, 2);
    const dl2 = new THREE.DirectionalLight(0xffffff, 0.4); dl2.position.set(-1, -0.5, 1);
    objs.push(dl1, dl2);
    if (p.caras) M.grupos.forEach((g, i) => {
      if (!g.positions.length) return;
      if (ifcHidden.has(i)) return;                       // objeto oculto
      if (ifcSolo >= 0 && i !== ifcSolo) return;          // modo aislar
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.Float32BufferAttribute(g.positions, 3));
      geo.computeVertexNormals();
      const col = new THREE.Color(g.color[0], g.color[1], g.color[2]);
      objs.push(new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
        color: col, emissive: col.clone().multiplyScalar(0.25), roughness: 0.9, metalness: 0.0,
        transparent: op < 1, opacity: op, side: THREE.DoubleSide,
      })));
    });
    states.objects3D.val = objs;
    refrescarPanelObjetos(M.grupos);
    // Encuadre: un IFC de SketchUp puede traer VARIAS edificaciones lejos entre
    // sí (aquí la iglesia y otra construcción a ~120 m). Se encuadra el CLUSTER
    // más denso (más triángulos), partiendo por el hueco mayor del eje más largo.
    const [mn, mx] = cajaPrincipal(M.grupos, M.bbox);
    states.nodes.val = [[mn[0], mn[1], mn[2]], [mx[0], mx[1], mx[2]]];
    states.elements.val = [];
    states.nodeInputs.val = { supports: new Map(), loads: new Map() };
    states.elementInputs.val = { elasticities: new Map(), shearModuli: new Map(), areas: new Map(),
      momentsOfInertiaY: new Map(), momentsOfInertiaZ: new Map(), torsionalConstants: new Map(),
      densities: new Map(), poissonsRatios: new Map() };
    console.log(`[IFC] ${M.grupos.length} objetos, ${(M as any).nTri ?? "?"} triángulos.`);
  },
};
