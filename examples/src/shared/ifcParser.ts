/**
 * Lector de IFC (subconjunto de geometría B-rep, como el que exporta SketchUp).
 *
 * Un IFC de arquitectura no trae vigas/columnas como elementos estructurales:
 * trae MALLAS (`IFCFACETEDBREP`). Esto las reconstruye para VER el modelo:
 *
 *   IFCFACETEDBREP(#shell)
 *     → IFCCLOSEDSHELL / IFCOPENSHELL ((#face …))
 *        → IFCFACE ((#bound …))
 *           → IFCFACEOUTERBOUND / IFCFACEBOUND (#polyloop)
 *              → IFCPOLYLOOP ((#punto …))
 *                 → IFCCARTESIANPOINT ((x, y, z))
 *   color: IFCSTYLEDITEM(#brep,(#psa)) → IFCSURFACESTYLE → …SHADING → IFCCOLOURRGB
 *
 * Devuelve grupos {positions, color}: un grupo por color, ya triangulado (fan),
 * en las coordenadas del fichero (SketchUp exporta en mundo). `unidad` escala a
 * metros si hace falta (IFC suele venir en mm).
 */
export interface IfcGrupo { positions: number[]; color: [number, number, number]; }
export interface IfcMalla { grupos: IfcGrupo[]; nTri: number; bbox: [number[], number[]]; unidad: number; }

export function parseIfc(txt: string, escala = 0.001): IfcMalla {
  const data = txt.slice(Math.max(0, txt.indexOf("DATA;")));
  const re = /#(\d+)\s*=\s*([A-Z0-9]+)\s*\(([\s\S]*?)\);/g;
  const P = new Map<number, [number, number, number]>();
  const loop = new Map<number, number[]>();
  const bound = new Map<number, number>();
  const face = new Map<number, number[]>();
  const shell = new Map<number, number[]>();
  const brep = new Map<number, number>();
  const styledOf = new Map<number, number>();     // item(brep) → presentationStyleAssignment
  const psa = new Map<number, number[]>();         // psa → [surfaceStyle]
  const surfStyle = new Map<number, number[]>();    // surfaceStyle → [shading]
  const shading = new Map<number, number>();        // shading → colourRGB
  const colour = new Map<number, [number, number, number]>();
  const refs = (s: string) => { const o: number[] = []; const r = /#(\d+)/g; let mm; while ((mm = r.exec(s))) o.push(+mm[1]); return o; };
  let m: RegExpExecArray | null;
  while ((m = re.exec(data))) {
    const id = +m[1], t = m[2], a = m[3];
    switch (t) {
      case "IFCCARTESIANPOINT": { const n = a.match(/\(([^)]*)\)/); if (n) { const v = n[1].split(",").map(Number); P.set(id, [v[0] || 0, v[1] || 0, v[2] || 0]); } break; }
      case "IFCPOLYLOOP": loop.set(id, refs(a)); break;
      case "IFCFACEOUTERBOUND": case "IFCFACEBOUND": bound.set(id, refs(a)[0]); break;
      case "IFCFACE": face.set(id, refs(a)); break;
      case "IFCCLOSEDSHELL": case "IFCOPENSHELL": shell.set(id, refs(a)); break;
      case "IFCFACETEDBREP": brep.set(id, refs(a)[0]); break;
      case "IFCSTYLEDITEM": { const r = refs(a); if (r.length >= 2) styledOf.set(r[0], r[1]); break; }
      case "IFCPRESENTATIONSTYLEASSIGNMENT": psa.set(id, refs(a)); break;
      case "IFCSURFACESTYLE": surfStyle.set(id, refs(a)); break;
      case "IFCSURFACESTYLESHADING": case "IFCSURFACESTYLERENDERING": shading.set(id, refs(a)[0]); break;
      case "IFCCOLOURRGB": { const v = a.split(",").map((s) => parseFloat(s)).filter((x) => !isNaN(x)); if (v.length >= 3) colour.set(id, [v[v.length - 3], v[v.length - 2], v[v.length - 1]]); break; }
    }
  }
  const colorDe = (bid: number): [number, number, number] => {
    const s = styledOf.get(bid); if (s == null) return [0.72, 0.77, 0.82];
    for (const ss of (psa.get(s) || [])) for (const sh of (surfStyle.get(ss) || [])) {
      const c = colour.get(shading.get(sh) ?? -1); if (c) return c;
    }
    return [0.72, 0.77, 0.82];
  };
  const porColor = new Map<string, IfcGrupo>();
  const bb: [number[], number[]] = [[1e30, 1e30, 1e30], [-1e30, -1e30, -1e30]];
  let nTri = 0;
  for (const [bid, sid] of brep) {
    const col = colorDe(bid); const key = col.map((c) => Math.round(c * 255)).join(",");
    let g = porColor.get(key); if (!g) { g = { positions: [], color: col }; porColor.set(key, g); }
    for (const fid of (shell.get(sid) || [])) for (const bnd of (face.get(fid) || [])) {
      const lp = loop.get(bound.get(bnd) ?? -1); if (!lp) continue;
      const pts = lp.map((p) => P.get(p)).filter(Boolean) as [number, number, number][];
      for (let i = 1; i < pts.length - 1; i++) {
        for (const v of [pts[0], pts[i], pts[i + 1]]) {
          const x = v[0] * escala, y = v[1] * escala, z = v[2] * escala;
          g.positions.push(x, y, z);
          if (x < bb[0][0]) bb[0][0] = x; if (y < bb[0][1]) bb[0][1] = y; if (z < bb[0][2]) bb[0][2] = z;
          if (x > bb[1][0]) bb[1][0] = x; if (y > bb[1][1]) bb[1][1] = y; if (z > bb[1][2]) bb[1][2] = z;
        }
        nTri++;
      }
    }
  }
  return { grupos: [...porColor.values()], nTri, bbox: bb, unidad: escala };
}
