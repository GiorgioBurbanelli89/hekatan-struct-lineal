/**
 * Panel «✂ Corte de sección (fuerzas totales)» del workspace (1-oct-2026): el Section Cut de SAP2000/ETABS sobre el
 * modelo en pantalla. Validado contra SAP2000 (muro con 4 apoyos, corte horizontal en la base de la pantalla):
 * F1 = −1.7814 y F3 = −2.6310 tonf idénticos; el momento, igual al llevarlo al punto que usa SAP2000 (el centroide de
 * los nudos del grupo). Aquí se da en el CENTRO del corte, que es el que sirve para diseñar.
 */
import type { State } from "vanjs-core";
import { corteDeSeccion } from "./corteSeccion";

export interface ModeloCorte { nodes: State<any[]>; elements: State<any[]>; nodeInputs: State<any>; deformOutputs: State<any> }
const G = 9.80665;

export function montarCorte(folder: any, estado: ModeloCorte) {
  const f = folder.addFolder({ title: "✂ Corte de sección (fuerzas totales)", expanded: false });
  const p = { eje: 2, pos: 0.25, info: "Elige el plano y pulsa Calcular." };
  f.addBinding(p, "eje", { label: "Plano", options: { "X = pos (corte vertical)": 0, "Y = pos (corte vertical)": 1, "Z = pos (corte horizontal)": 2 } });
  f.addBinding(p, "pos", { label: "pos (m)", min: -100, max: 100, step: 0.01 });
  f.addButton({ title: "▶ Calcular el corte" }).on("click", () => calcular());
  f.addBinding(p, "info", { label: "", readonly: true, multiline: true, rows: 9 });
  const aMap = (o: any) => (o instanceof Map ? o : new Map(Object.entries(o ?? {}).map(([k, v]) => [Number(k), v])));
  function calcular() {
    const ni = estado.nodeInputs.val ?? {}, d = estado.deformOutputs.val ?? {};
    const springs = (window as any).__hekatanStates?.springs?.val ?? ni.springs;
    const c = corteDeSeccion(estado.nodes.val, estado.elements.val, aMap(ni.loads), aMap(d.reactions), aMap(ni.supports), springs, aMap(d.deformations), p.eje as 0 | 1 | 2, p.pos);
    if (!c.elementosCortados) { p.info = "✗ el plano no corta ninguna cáscara"; f.refresh(); return; }
    const t = (v: number) => (v / G).toFixed(3), e = ["X", "Y", "Z"][p.eje];
    p.info = `Corte ${e} = ${p.pos} m · ${c.elementosCortados} cáscaras cortadas · L = ${c.L.toFixed(3)} m
Centro del corte: (${c.P.map((v) => v.toFixed(3)).join(", ")}) m
Fuerza (lado +${e} sobre −${e}), tonf: Fx ${t(c.F[0])} · Fy ${t(c.F[1])} · Fz ${t(c.F[2])}
Momento en el centro, tonf·m: Mx ${t(c.M[0])} · My ${t(c.M[1])} · Mz ${t(c.M[2])}
Por metro de corte (tonf/m, tonf·m/m): F ${c.F.map((v) => (v / G / c.L).toFixed(3)).join(" · ")}
   M ${c.M.map((v) => (v / G / c.L).toFixed(3)).join(" · ")}  (= la MEDIA de F22, M22… a lo largo del corte)
${c.desequilibrio > 1e-6 ? "⚠ el modelo no cierra el equilibrio con sus cargas nodales (" + c.desequilibrio.toExponential(1) + "): faltan cargas internas" : "Equilibrio del modelo: ✓"}`;
    f.refresh();
    (window as any).__hekatanUltimoCorte = c;
    ventana(p.info);
  }
  return { calcular, params: p, folder: f };
}

/** El resultado en una ventana flotante ancha: en la columna de Settings el texto quedaba cortado. */
function ventana(texto: string) {
  let el = document.getElementById("hk-corte-panel") as HTMLDivElement | null;
  if (!el) {
    el = document.createElement("div"); el.id = "hk-corte-panel";
    Object.assign(el.style, { position: "fixed", left: "50%", top: "70px", transform: "translateX(-50%)", maxWidth: "calc(100vw - 32px)",
      background: "rgba(20, 24, 30, 0.95)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", boxShadow: "0 6px 24px rgba(0,0,0,0.5)",
      padding: "8px 12px", fontFamily: "ui-monospace, Consolas, monospace", fontSize: "13px", color: "#e2e8f0", zIndex: "101" } as CSSStyleDeclaration);
    const cab = document.createElement("div");
    Object.assign(cab.style, { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px", borderBottom: "1px solid rgba(255,255,255,0.1)" });
    const tit = document.createElement("b"); tit.textContent = "Corte de sección — fuerzas totales"; tit.style.color = "#a5b4fc";
    const x = document.createElement("button"); x.textContent = "×";
    Object.assign(x.style, { background: "transparent", border: "none", color: "#e2e8f0", fontSize: "18px", cursor: "pointer", marginLeft: "16px" });
    x.onclick = () => { el!.style.display = "none"; };
    const pre = document.createElement("pre"); pre.id = "hk-corte-texto"; Object.assign(pre.style, { margin: "0", whiteSpace: "pre-wrap", lineHeight: "1.5" });
    cab.append(tit, x); el.append(cab, pre); document.body.appendChild(el);
  }
  (el.querySelector("#hk-corte-texto") as HTMLElement).textContent = texto;
  el.style.display = "block";
}
