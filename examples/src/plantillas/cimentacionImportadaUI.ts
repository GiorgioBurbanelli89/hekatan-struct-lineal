/**
 * Enlaza el editor de zapatas con un modelo IMPORTADO que ya está en `states` (csi-importer).
 * La lógica está en `cimentacionImportada.ts` (pura y probada); aquí solo se lee/escribe el estado.
 */
import { copiarModelo, detectarZapatas, anotarPropiedades, aplicarEdiciones, resolver, rectDeVuelos, vuelosDe, cajaColumnas,
  type ModeloEd, type Grupo, type Rect, type VueloZ } from "./cimentacionImportada";
import { montarPanelPlanta } from "./cimentacionPlanta";

/** Ediciones por archivo (así sobreviven a un `rebuild` del importador). */
const EDICIONES = new Map<string, Map<number, Rect>>();

function modeloDeEstados(states: any): ModeloEd {
  const ni = states.nodeInputs.val ?? {}, ei: Record<string, Map<number, any>> = {};
  for (const [k, v] of Object.entries(states.elementInputs.val ?? {})) if (v instanceof Map) ei[k] = new Map(v as Map<number, any>);
  return {
    nodes: (states.nodes.val as number[][]).map((n) => [n[0], n[1], n[2]]),
    elements: (states.elements.val as number[][]).map((e) => [...e]),
    supports: new Map(ni.supports ?? []),
    loads: new Map([...(ni.loads ?? new Map())].map(([k, v]: any) => [k, [...v]])),
    springs: (ni.springs ?? []).map((s: any) => ({ ...s })),
    ei,
  };
}

function escribirEstados(states: any, M: ModeloEd, ks: number) {
  const { out, an } = resolver(M, ks);
  states.nodes.val = M.nodes as any;
  states.elements.val = M.elements as any;
  states.nodeInputs.val = { supports: M.supports, loads: M.loads, springs: M.springs } as any;
  states.elementInputs.val = M.ei as any;
  states.deformOutputs.val = out;
  states.analyzeOutputs.val = an;
}

/** Llamar al final de `csiImporter.build`. Sin zapatas (muelles + cáscaras) no hace nada. */
export function montarEditorImportado(states: any, archivo: string) {
  if (typeof document === "undefined") return;
  const base = modeloDeEstados(states);
  if (!base.springs.some((s) => s.dof === 2 && s.node >= 0)) return;
  const grupos = detectarZapatas(base);
  if (!grupos.length) return;
  anotarPropiedades(base, grupos);
  const ed = EDICIONES.get(archivo) ?? EDICIONES.set(archivo, new Map()).get(archivo)!;
  const ks = grupos.find((g) => g.ks > 0)?.ks ?? 1e4;

  const rectDe = (g: Grupo): Rect => ed.get(g.id) ?? { x0: g.x0, y0: g.y0, x1: g.x1, y1: g.y1 };
  const publicar = () => {
    (states as any).__cimPlanta = {
      sub: 200, siempre: true, bcol: 0.25,
      zapatas: grupos.map((g) => { const r = rectDe(g); return { ...r, t: g.t, vuelos: vuelosDe(g, r), base: vuelosDe(g) }; }),
      columnas: grupos.flatMap((g) => g.columnas.map((c) => ({ ...c, b: Math.max(c.bx, c.by) }))),
      vigas: [],
      aplicar: (i: number, v: VueloZ) => {
        const g = grupos[i]; if (!g || !g.rectangular) return;
        const r = rectDeVuelos(g, v);
        const mismo = Math.abs(r.x0 - g.x0) + Math.abs(r.x1 - g.x1) + Math.abs(r.y0 - g.y0) + Math.abs(r.y1 - g.y1) < 1e-6;
        if (mismo) ed.delete(i); else ed.set(i, r);
        recalcular();
        publicar();
        montarPanelPlanta(states);
      },
    };
  };
  const recalcular = () => {
    if (!ed.size) { escribirEstados(states, copiarModelo(base), ks); return; }
    const { modelo, avisos } = aplicarEdiciones(base, grupos, ed);
    if (avisos.length) console.warn("[Zapatas] " + avisos.join(" · "));
    escribirEstados(states, modelo, ks);
    console.info(`[Zapatas] ${ed.size} zapata(s) editada(s): ${modelo.nodes.length} nudos, ${modelo.elements.length} elementos.`);
  };
  // La primera vez se RESUELVE (el importador solo dibuja): así hay presión del suelo que mirar.
  recalcular();
  publicar();
  montarPanelPlanta(states);
  void cajaColumnas;
}
