// Cubierta de una BÓVEDA por LOFTING entre arcos. Los arcos son las cadenas de
// barras BRACE (a Y constante en la capilla); se agrupan por sección (nº de
// nudos + centro en X), se ordenan por Y, y entre arcos consecutivos se tienden
// quads. Cubre toda la superficie sin depender de dónde caen las correas.
import { readFileSync } from "fs";

export function carasCubierta(nodes, elements, tipos) {
  // 1) componentes conexas de barras BRACE = arcos
  const adj = {};
  elements.forEach((e, k) => { if (e.length === 2 && tipos[k] === "BRACE") {
    (adj[e[0]] = adj[e[0]] || []).push(e[1]); (adj[e[1]] = adj[e[1]] || []).push(e[0]); } });
  const seen = new Set(); const arcos = [];
  for (const s of Object.keys(adj).map(Number)) { if (seen.has(s)) continue;
    const c = []; const q = [s]; seen.add(s);
    while (q.length) { const u = q.pop(); c.push(u); for (const v of adj[u]) if (!seen.has(v)) { seen.add(v); q.push(v); } }
    arcos.push(c); }
  // 2) ordenar los nudos de cada arco a lo largo de la cadena (desde un extremo)
  const ordenar = (comp) => {
    const g = new Map(comp.map((n) => [n, adj[n].filter((x) => comp.includes(x))]));
    let ini = comp.find((n) => g.get(n).length === 1) ?? comp[0];
    const orden = [ini]; const vis = new Set([ini]); let cur = ini;
    while (true) { const nx = g.get(cur).find((x) => !vis.has(x)); if (nx == null) break; orden.push(nx); vis.add(nx); cur = nx; }
    return orden.length === comp.length ? orden : comp;
  };
  const cad = arcos.map(ordenar);
  // 3) agrupar por sección: nº de nudos + centro X redondeado
  const cen = (a) => a.reduce((s, n) => s + nodes[n][0], 0) / a.length;
  const cenY = (a) => a.reduce((s, n) => s + nodes[n][1], 0) / a.length;
  const grupos = new Map();
  cad.forEach((a) => { const k = a.length + ":" + Math.round(cen(a) / 4);
    (grupos.get(k) || grupos.set(k, []).get(k)).push(a); });
  // 4) por grupo: ordenar arcos por Y, orientar igual, y loftear
  const caras = [];
  const d2 = (p, q) => (nodes[p][0]-nodes[q][0])**2 + (nodes[p][2]-nodes[q][2])**2;  // distancia en X-Z
  for (const arcs of grupos.values()) {
    if (arcs.length < 2) continue;
    arcs.sort((A, B) => cenY(A) - cenY(B));
    for (let g = 0; g < arcs.length - 1; g++) {
      let A = arcs[g], B = arcs[g + 1].slice();
      if (A.length !== B.length) continue;
      // orientar B para que B[0] quede del lado de A[0]
      if (d2(A[0], B[0]) + d2(A[A.length-1], B[B.length-1]) > d2(A[0], B[B.length-1]) + d2(A[A.length-1], B[0])) B.reverse();
      for (let m = 0; m < A.length - 1; m++) caras.push([A[m], A[m+1], B[m+1], B[m]]);
    }
  }
  return caras;
}

// --- prueba + render ---
if (process.env.FULL) {
  const D = JSON.parse(readFileSync(process.env.FULL, "utf8"));
  const caras = carasCubierta(D.nodes, D.elements, D.tipos);
  console.log(`caras (loft): ${caras.length}  (quads ${caras.filter(c=>c.length===4).length}, tri ${caras.filter(c=>c.length===3).length})`);
  if (process.env.CARAS) require("fs").writeFileSync(process.env.CARAS, JSON.stringify(caras));
}
