/**
 * MEMORIA TÉCNICA (2-oct-2026). Jorge: «a Hekatan Struct le falta algo que genere memorias técnicas».
 * Guía de contenido y orden: la memoria de cálculo del Hotel Paraíso (Portoviejo, 2021, NEC-15): generalidades,
 * normas, materiales, sistema, modelo, espectro, irregularidades, torsión, propiedades dinámicas, combinaciones,
 * participación de masa, corrección dinámico/estático, cortantes, derivas, estabilidad y conclusiones.
 *
 * Todo sale del ResultadoNEC del panel «Sismo NEC» (cada número validado allí contra SAP2000/ETABS) y, si el modelo
 * vino de ETABS, del inventario del .e2k (secciones y materiales con su nombre). Se abre en una ventana aparte con
 * los datos del proyecto EDITABLES (se recuerdan en este navegador) y se imprime a PDF con el navegador.
 * Fuerzas en tonf (Ecuador), esfuerzos en kgf/cm², longitudes en m.
 */
import type { ResultadoNEC } from "./calculo";
import { espectro } from "./estatico";
import type { InventarioE2k } from "../e2kAHeks";

type Entrada = { r: ResultadoNEC; nodes: number[][]; elements: number[][]; params: any };

const G = 9.80665;
const esc = (s: any) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" } as any)[c]);
const f = (v: number, d = 2) => (isFinite(v) ? v.toFixed(d) : "—");
const pc = (v: number, d = 2) => (isFinite(v) ? (v * 100).toFixed(d) + " %" : "—");

/** fuerza del ResultadoNEC → tonf */
const aT = (r: ResultadoNEC) => (v: number) => (r.unidad === "tonf" ? v : v / G);

function clasificar(nodes: number[][], elements: number[][]) {
  const c = { columnas: 0, vigas: 0, diagonales: 0, losas: 0, muros: 0 };
  for (const e of elements) {
    const p = e.map((n) => nodes[n]);
    if (e.length === 2) {
      const d = [0, 1, 2].map((k) => p[1][k] - p[0][k]), L = Math.hypot(...d), cz = L ? Math.abs(d[2]) / L : 0;
      if (cz > Math.cos((20 * Math.PI) / 180)) c.columnas++; else if (cz < Math.sin((5 * Math.PI) / 180)) c.vigas++; else c.diagonales++;
    } else if (e.length >= 3) {
      const zs = p.map((q) => q[2]);
      if (Math.max(...zs) - Math.min(...zs) < 1e-6) c.losas++; else c.muros++;
    }
  }
  return c;
}

/** vista isométrica del modelo (SVG propio: no depende del lienzo 3D) */
function svgModelo(nodes: number[][], elements: number[][]): string {
  const a = Math.PI / 6, P = (p: number[]) => [(p[0] - p[1]) * Math.cos(a), -(p[0] + p[1]) * Math.sin(a) - p[2]];
  const pts = nodes.map(P);
  const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const W = 640, H = 420, m = 20, s = Math.min((W - 2 * m) / (x1 - x0 || 1), (H - 2 * m) / (y1 - y0 || 1));
  const T = (q: number[]) => `${(m + (q[0] - x0) * s).toFixed(1)},${(m + (q[1] - y0) * s).toFixed(1)}`;
  let losas = "", barras = "";
  for (const e of elements) {
    if (e.length >= 3) losas += `<polygon points="${e.map((n) => T(pts[n])).join(" ")}" fill="#93c5fd" fill-opacity="0.25" stroke="#93c5fd" stroke-width="0.4"/>`;
    else if (e.length === 2) {
      const p = nodes[e[0]], q = nodes[e[1]], L = Math.hypot(q[0] - p[0], q[1] - p[1], q[2] - p[2]);
      const cz = L ? Math.abs(q[2] - p[2]) / L : 0, col = cz > 0.94 ? "#b91c1c" : cz < 0.087 ? "#1d4ed8" : "#15803d";
      barras += `<line x1="${T(pts[e[0]]).split(",")[0]}" y1="${T(pts[e[0]]).split(",")[1]}" x2="${T(pts[e[1]]).split(",")[0]}" y2="${T(pts[e[1]]).split(",")[1]}" stroke="${col}" stroke-width="1.1"/>`;
    }
  }
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:640px">${losas}${barras}
  <g font-size="11" font-family="Arial"><rect x="8" y="${H - 22}" width="10" height="3" fill="#b91c1c"/><text x="22" y="${H - 17}">columnas</text>
  <rect x="90" y="${H - 22}" width="10" height="3" fill="#1d4ed8"/><text x="104" y="${H - 17}">vigas</text>
  <rect x="150" y="${H - 22}" width="10" height="3" fill="#15803d"/><text x="164" y="${H - 17}">diagonales</text>
  <rect x="240" y="${H - 24}" width="10" height="8" fill="#93c5fd" fill-opacity="0.5"/><text x="254" y="${H - 17}">losas</text></g></svg>`;
}

/** espectro elástico e inelástico con los periodos de los 3 primeros modos */
function svgEspectro(r: ResultadoNEC): string {
  const s = r.sitio, sp = espectro(s), red = s.I / (s.R * (s.norma === "NEC-15" ? (s.phiP ?? 1) * (s.phiE ?? 1) : 1));
  const W = 640, H = 300, x0 = 50, x1 = W - 15, y0 = 15, y1 = H - 40, Tmax = 4;
  const Smax = Math.max(sp.meseta, sp.Sa(0)) * 1.1;
  const X = (T: number) => x0 + (T / Tmax) * (x1 - x0), Y = (S: number) => y1 - (S / Smax) * (y1 - y0);
  const curva = (k: number) => Array.from({ length: 401 }, (_, i) => { const T = (i / 400) * Tmax; return `${X(T).toFixed(1)},${Y(sp.Sa(T) * k).toFixed(1)}`; }).join(" ");
  let ejes = `<line x1="${x0}" y1="${y1}" x2="${x1}" y2="${y1}" stroke="#333"/><line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y1}" stroke="#333"/>`;
  for (let T = 0; T <= Tmax; T += 0.5) ejes += `<text x="${X(T)}" y="${y1 + 14}" text-anchor="middle">${T.toFixed(1)}</text><line x1="${X(T)}" y1="${y1}" x2="${X(T)}" y2="${y1 + 4}" stroke="#333"/>`;
  for (let i = 0; i <= 5; i++) { const S = (Smax * i) / 5; ejes += `<text x="${x0 - 6}" y="${Y(S) + 4}" text-anchor="end">${S.toFixed(2)}</text><line x1="${x0}" y1="${Y(S)}" x2="${x1}" y2="${Y(S)}" stroke="#ddd"/>`; }
  // los rótulos de los modos van en la leyenda: con periodos cercanos, junto a las rayas se encimaban
  const modos = r.modos.slice(0, 3).map((m) => `<line x1="${X(m.T)}" y1="${y0}" x2="${X(m.T)}" y2="${y1}" stroke="#7c3aed" stroke-dasharray="3 3"/>`).join("") +
    `<line x1="${x1 - 210}" y1="${y0 + 36}" x2="${x1 - 198}" y2="${y0 + 36}" stroke="#7c3aed" stroke-dasharray="3 3"/><text x="${x1 - 194}" y="${y0 + 40}" fill="#7c3aed">${r.modos.slice(0, 3).map((m, j) => `T${j + 1} ${m.T.toFixed(3)}`).join(" · ")} s</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:640px" font-size="11" font-family="Arial">${ejes}
  <polyline points="${curva(1)}" fill="none" stroke="#b91c1c" stroke-width="2"/><polyline points="${curva(red)}" fill="none" stroke="#1d4ed8" stroke-width="2"/>${modos}
  <text x="${(x0 + x1) / 2}" y="${H - 8}" text-anchor="middle">Periodo T [s]</text><text x="12" y="${(y0 + y1) / 2}" transform="rotate(-90 12 ${(y0 + y1) / 2})" text-anchor="middle">Sa [g]</text>
  <g><rect x="${x1 - 210}" y="${y0 + 4}" width="12" height="3" fill="#b91c1c"/><text x="${x1 - 194}" y="${y0 + 9}">elástico Sa(T)</text>
  <rect x="${x1 - 210}" y="${y0 + 18}" width="12" height="3" fill="#1d4ed8"/><text x="${x1 - 194}" y="${y0 + 23}">inelástico Sa·I/(R·φP·φE) = ×${red.toFixed(4)}</text></g></svg>`;
}

/** perfil de derivas inelásticas por piso (estático y dinámico, X e Y) con el límite */
function svgDerivas(r: ResultadoNEC, est: { X: number[]; Y: number[] }): string {
  const n = r.pisos.length, W = 640, H = 60 + 46 * n, x0 = 60, x1 = W - 20, y0 = 20, y1 = H - 36;
  const lim = r.limiteDeriva, vmax = Math.max(lim, ...est.X, ...est.Y, ...r.dirDerivas.X, ...r.dirDerivas.Y) * 1.15;
  const X = (v: number) => x0 + (v / vmax) * (x1 - x0), Y = (k: number) => y1 - (k / n) * (y1 - y0);
  const linea = (v: number[], col: string, dash = "") => {
    let d = `M${X(0)},${Y(0)}`; v.forEach((q, i) => { d += ` L${X(q)},${Y(i)} L${X(q)},${Y(i + 1)}`; });
    return `<path d="${d}" fill="none" stroke="${col}" stroke-width="2" ${dash ? `stroke-dasharray="${dash}"` : ""}/>`;
  };
  let ejes = `<line x1="${x0}" y1="${y1}" x2="${x1}" y2="${y1}" stroke="#333"/><line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y1}" stroke="#333"/>`;
  for (let i = 0; i <= 5; i++) { const v = (vmax * i) / 5; ejes += `<text x="${X(v)}" y="${y1 + 14}" text-anchor="middle">${(v * 100).toFixed(2)}</text>`; }
  r.pisos.forEach((p, i) => { ejes += `<text x="${x0 - 6}" y="${Y(i + 1) + 4}" text-anchor="end">P${p.k}</text><line x1="${x0}" y1="${Y(i + 1)}" x2="${x1}" y2="${Y(i + 1)}" stroke="#eee"/>`; });
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:640px" font-size="11" font-family="Arial">${ejes}
  <line x1="${X(lim)}" y1="${y0}" x2="${X(lim)}" y2="${y1}" stroke="#dc2626" stroke-width="2"/><text x="${X(lim) - 4}" y="${y0 + 10}" text-anchor="end" fill="#dc2626">límite ${(lim * 100).toFixed(1)} %</text>
  ${linea(est.X, "#1d4ed8")}${linea(est.Y, "#b45309")}${linea(r.dirDerivas.X, "#1d4ed8", "5 3")}${linea(r.dirDerivas.Y, "#b45309", "5 3")}
  <text x="${(x0 + x1) / 2}" y="${H - 6}" text-anchor="middle">Deriva inelástica ΔM [%] — continua: estático · trazos: dinámico · azul X · ocre Y</text></svg>`;
}

const CAMPOS: [string, string][] = [
  ["proyecto", "NOMBRE DEL PROYECTO"], ["propietario", "Propietario / solicitante"], ["ubicacion", "Cantón, provincia"],
  ["ingeniero", "Ing. calculista estructural"], ["registro", "Reg. SENESCYT"], ["fecha", new Date().toLocaleDateString("es-EC", { month: "long", year: "numeric" })],
  ["objetivo", "El presente informe tiene como objetivo mostrar el análisis y diseño estructural sismorresistente del proyecto, conforme a la Norma Ecuatoriana de la Construcción."],
  ["antecedente", "Este documento se realiza a petición del propietario para la aprobación de planos ante el GAD municipal. Se detalla, en síntesis, el análisis estructural y las bases de diseño."],
  ["geotecnia", "Capacidad admisible y perfil de suelo según el estudio geotécnico del sitio (adjuntar)."],
];

export function htmlMemoria({ r, nodes, elements, params }: Entrada): string {
  const inv: InventarioE2k | undefined = (globalThis as any).__hekatanInventario;
  const T = aT(r), s = r.sitio, sp = espectro(s), nec15 = s.norma === "NEC-15";
  const e = r.estatico, D = r.dinamico, cls = clasificar(nodes, elements);
  const normaTxt = nec15 ? "NEC-SE-DS 2015" : "borrador NEC-SE-DS 12-09-2023";
  const ed = (k: string, def: string, tag = "span") => `<${tag} class="ed" contenteditable="true" data-k="${k}">${esc(def)}</${tag}>`;
  const dv = Object.fromEntries(CAMPOS);
  const peor = (ks: string[], i: number) => ks.map((k) => r.derivasEst[k][i]).reduce((a, b) => (b.inelastica > a.inelastica ? b : a));
  const estX = r.pisos.map((_, i) => peor(["Ex", "Ex+e", "Ex−e"], i).inelastica), estY = r.pisos.map((_, i) => peor(["Ey", "Ey+e", "Ey−e"], i).inelastica);
  const hayAcero = inv?.materiales.some((m) => /steel|acero/i.test(m.tipo)) ?? true;
  const hayHA = inv?.materiales.some((m) => /concrete|hormig/i.test(m.tipo)) ?? true;
  const ctTxt = ["pórtico especial de H.A. sin muros", "pórtico de H.A. con muros (dual)", "acero sin arriostramientos", "acero con arriostramientos"][params?.sistema ?? 0];
  const h = (n: string, t: string) => `<h2 id="s${n.replace(/\./g, "_")}">${n} ${t}</h2>`;
  const h3 = (n: string, t: string) => `<h3 id="s${n.replace(/\./g, "_")}">${n} ${t}</h3>`;
  const tabla = (cab: string[], filas: string[][]) => `<table><thead><tr>${cab.map((c) => `<th>${c}</th>`).join("")}</tr></thead><tbody>${filas.map((f) => `<tr>${f.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
  const ok = (b: boolean) => (b ? `<span class="ok">cumple</span>` : `<span class="no">no cumple</span>`);

  // ── materiales y secciones ──
  const mats = inv?.materiales.length
    ? tabla(["Material", "Tipo", "E [kgf/cm²]", "f'c / Fy [kgf/cm²]", "γ [tonf/m³]"], inv.materiales.map((m) => [esc(m.nombre), esc(m.tipo),
        f(m.E / 98.0665, 0), m.fc ? "f'c " + f(m.fc / 98.0665, 0) : m.fy ? "Fy " + f(m.fy / 98.0665, 0) : "—", m.densidad ? f(m.densidad / G, 3) : "—"]))
    : `<p>Los materiales son los asignados en el modelo (módulo de elasticidad y densidad por elemento).</p>`;
  const secs = inv?.secciones.length
    ? tabla(["Sección", "Uso", "Forma", "Material (relleno)", "D × B [mm]", "tf / tw [mm]", "N.º", "L total [m]"], inv.secciones.map((q) => [esc(q.nombre),
        ({ COLUMN: "columna", BEAM: "viga", BRACE: "diagonal" } as any)[q.tipo] ?? esc(q.tipo), esc(q.forma), esc(q.material) + (q.relleno ? ` (${esc(q.relleno)})` : ""),
        `${f(q.D * 1000, 0)} × ${f(q.B * 1000, 0)}`, q.TF ? `${f(q.TF * 1000, 0)} / ${f(q.TW * 1000, 0)}` : "—", String(q.n), f(q.L, 1)]))
    : "";
  // las de diseño que ETABS genera solo (UDStl…, UDCon…, UDCmp…) se cuentan aparte: son decenas y repiten las del usuario
  const auto = (inv?.combos ?? []).filter((c) => /^UD[A-Z]/.test(c.nombre)), propias = (inv?.combos ?? []).filter((c) => !/^UD[A-Z]/.test(c.nombre));
  const fila = (c: { nombre: string; items: [string, number][] }) => [esc(c.nombre), c.items.map(([p, k]) => `${k} ${esc(p)}`).join(" + ").replace(/\+ -/g, "− ")];
  const combos = inv?.combos?.length
    ? (propias.length ? tabla(["Combinación", "Patrones × factor"], propias.map(fila)) : "") +
      (auto.length ? `<p>Además, ${auto.length} combinaciones de diseño generadas por el programa (acero, hormigón, compuesto) con los factores de NEC-SE-CG:</p>` +
        tabla(["Combinación", "Patrones × factor"], auto.filter((c) => !c.items.some(([p]) => /^NL[XY]_/.test(p))).map(fila)) : "")
    : `<p>Las combinaciones de carga del modelo, según NEC-SE-CG.</p>`;

  // ── modos ──
  let sx = 0, sy = 0, sz = 0;
  const filasModos = r.modos.map((m, j) => { sx += m.ux; sy += m.uy; sz += m.rz; return [String(j + 1), f(m.T, 4), pc(m.ux), pc(m.uy), pc(m.rz), pc(sx), pc(sy), pc(sz)]; });

  // ── conclusiones (automáticas, con el número que las sostiene) ──
  const dmaxEst = Math.max(...estX, ...estY), dmaxDin = Math.max(...r.dirDerivas.X, ...r.dirDerivas.Y);
  const concl: [boolean, string][] = [
    [r.sumaMasa.ux >= 0.9 && r.sumaMasa.uy >= 0.9, `Con ${r.modos.length} modos la masa participativa acumulada es ${pc(r.sumaMasa.ux, 1)} en X y ${pc(r.sumaMasa.uy, 1)} en Y (mínimo 90 %).`],
    [r.chequeoModos.every((c) => c.includes("✓")), `Modos fundamentales: ${r.chequeoModos.map((c) => c.replace(/[✓✗]\s*/, "")).join("; ")}.`],
    [!r.torsional.X && !r.torsional.Y, `Relación Δmáx/Δprom con excentricidad accidental de 5 %: X ${f(r.torsional.peorX, 3)}, Y ${f(r.torsional.peorY, 3)} (irregularidad torsional si > 1.2).`],
    [true, `Cortante basal estático V = ${f(T(e.V))} tonf = ${pc(e.Cs)} de W; factor de escala del dinámico ×${f(D.escX.factor, 3)} en X y ×${f(D.escY.factor, 3)} en Y (mínimo ${f(D.minimo * 100, 0)} % del estático).`],
    [dmaxEst <= r.limiteDeriva && dmaxDin <= r.limiteDeriva, `Deriva inelástica máxima: estático ${pc(dmaxEst)}, dinámico ${pc(dmaxDin)}, frente al límite ${pc(r.limiteDeriva, 1)}.`],
    [r.estabilidad.max <= 0.1, `Índice de estabilidad máximo Q = ${f(r.estabilidad.max, 4)} (P-Δ despreciable si Q ≤ 0.10).`],
  ];

  const cuerpo = `
<section class="portada">
  <div class="cab">${ed("ingeniero", dv.ingeniero, "div")}<div>INGENIERO CIVIL CALCULISTA ESTRUCTURAL</div>${ed("registro", dv.registro, "div")}</div>
  <h1>MEMORIA DE CÁLCULO, ANÁLISIS Y DISEÑO ESTRUCTURAL</h1>
  <p class="proy">«${ed("proyecto", dv.proyecto)}»</p>
  <p class="cen">${ed("ubicacion", dv.ubicacion)} — ${ed("fecha", dv.fecha)}</p>
  <p class="cen pie">Análisis sísmico ${normaTxt} · modelo de ${nodes.length} nudos y ${elements.length} elementos${inv ? ` · importado de ETABS (${esc(inv.archivo)})` : ""}</p>
</section>
<nav class="indice"><h2>ÍNDICE DE CONTENIDO</h2><ol id="indice"></ol></nav>

${h("I.", "GENERALIDADES")}
${h3("1.1", "Objetivo")}${ed("objetivo", dv.objetivo, "p")}
${h3("1.2", "Antecedentes y ubicación")}${ed("antecedente", dv.antecedente, "p")}<p>Ubicación: ${ed("ubicacion", dv.ubicacion)}.</p>
${h3("1.3", "Normas utilizadas")}<ul>
  <li>${nec15 ? "NEC-SE-DS 2015 — Peligro sísmico, diseño sismorresistente" : "Borrador NEC-SE-DS 12-09-2023 — Peligro sísmico, diseño sismorresistente"}</li>
  <li>NEC-SE-CG — Cargas (no sísmicas)</li>${hayHA ? "<li>NEC-SE-HM — Estructuras de hormigón armado; ACI 318-19</li>" : ""}
  ${hayAcero ? "<li>NEC-SE-AC — Estructuras de acero; AISC 360-16 y AISC 341-16</li>" : ""}<li>NEC-SE-GC — Geotecnia y cimentaciones</li></ul>
${h3("1.4", "Materiales")}${mats}
${h3("1.5", "Sistema estructural")}<p>Sistema para el periodo aproximado: <b>${ctTxt}</b> (Ct = ${s.Ct}, α = ${s.alfa}). El modelo tiene
  ${cls.columnas} columnas, ${cls.vigas} vigas, ${cls.diagonales} diagonales${cls.muros ? `, ${cls.muros} elementos de muro` : ""} y ${cls.losas} elementos de losa.</p>${secs}
${h3("1.6", "Requisitos geotécnicos")}${ed("geotecnia", dv.geotecnia, "p")}
${h3("1.7", "Modelo estructural")}<figure>${svgModelo(nodes, elements)}<figcaption>Modelo numérico lineal (vista isométrica).</figcaption></figure>
${tabla(["Piso", "Cota z [m]", "h entrepiso [m]", "Masa [tonf·s²/m]", "Peso W [tonf]", "CM x [m]", "CM y [m]"], r.pisos.map((p, i) => ["P" + p.k, f(p.z), f(r.derivasEst.Ex[i]?.h ?? NaN),
  f(T(p.masa), 3), f(T(p.peso)), f(p.cm[0], 3), f(p.cm[1], 3)]))}
<p>Peso sísmico total W = <b>${f(T(e.W))} tonf</b>.</p>
${h3("1.8", "Hipótesis de la modelación")}<ul><li>Análisis elástico lineal por el método de los elementos finitos (barras de 6 grados de libertad por nudo y cáscaras).</li>
  <li>Losas como diafragma rígido en su plano por piso; base empotrada en los apoyos del modelo.</li>
  <li>Inercias ${r.agrietadas ? "agrietadas NEC-SE-DS §6.1.6: vigas 0.5·Ig, columnas 0.8·Ig, muros 0.6·Ig" : "brutas (sin agrietar)"}.</li>
  <li>Excentricidad accidental de ±5 % de la dimensión de la planta, aplicada en el centro de masa de cada piso.</li>
  <li>Análisis modal espectral con ${r.modos.length} modos, combinación modal ${D.X.modal}, combinación direccional ${r.dirDerivas.metodo}.</li></ul>
${h3("1.9", `Espectro de diseño (${normaTxt})`)}
${tabla(["Z", "Fa", "Fd", "Fs", nec15 ? "η" : "—", "r", "T0 [s]", "Tc [s]", "I", "R", nec15 ? "φP" : "Cd", nec15 ? "φE" : "—"],
  [[f(s.Z), f(s.Fa), f(s.Fd), f(s.Fs), nec15 ? f(s.eta ?? 1.8) : "—", f(s.r, 1), f(sp.T0, 3), f(sp.Tc, 3), f(s.I, 1), f(s.R, 1), nec15 ? f(s.phiP ?? 1) : f(s.Cd ?? 5.5), nec15 ? f(s.phiE ?? 1) : "—"]])}
<p class="eq">${nec15 ? "Sa = Z·Fa·[1 + (η − 1)·T/T0] para T < T0 (modos superiores; el fundamental y el estático usan la meseta); Sa = η·Z·Fa para T0 ≤ T ≤ Tc; Sa = η·Z·Fa·(Tc/T)<sup>r</sup> para T > Tc; T0 = 0.10·Fs·Fd/Fa, Tc = 0.55·Fs·Fd/Fa (NEC-SE-DS §3.3.1)"
  : "Sa = 2.4·Z·Fa para T0 ≤ T ≤ Tc; Sa = 2.4·Z·Fa·(Tc/T)<sup>r</sup> hasta TL = 2.4·Fd; Tc = 0.40·Fs·Fd/Fa (borrador §3.4.1)"}.</p>
<figure>${svgEspectro(r)}<figcaption>Espectro de diseño en aceleraciones y periodos de los tres primeros modos.</figcaption></figure>
${h3("1.10", "Regularidad y configuración estructural")}
${tabla(["Tipo", "Irregularidad", "¿Existe?", "Detalle"], r.irregularidades.lista.map((q) => [q.clave, esc(q.nombre), q.valor ? "<b>sí</b>" + (q.manual ? " (manual)" : "") : "no", esc(q.detalle)]))}
<p>${nec15 ? `Coeficientes de configuración: φP = <b>${f(r.irregularidades.phiP)}</b>, φE = <b>${f(r.irregularidades.phiE)}</b>.` : `Amplificación de la torsión accidental Ax: X ${r.irregularidades.Ax ? f(Math.max(...r.irregularidades.Ax.X)) : "1.00"}, Y ${r.irregularidades.Ax ? f(Math.max(...r.irregularidades.Ax.Y)) : "1.00"}.`}
  Estructura <b>${r.irregularidades.irregular ? "irregular" : "regular"}</b>.</p>
${h3("1.11", "Chequeo de irregularidad torsional (excentricidad accidental 5 %)")}
${tabla(["Piso", "Ex: Δmáx/Δprom", "Ex+e", "Ex−e", "Ey: Δmáx/Δprom", "Ey+e", "Ey−e", "¿Torsional? (> 1.2)"], r.pisos.map((p, i) => {
  const v = ["Ex", "Ex+e", "Ex−e", "Ey", "Ey+e", "Ey−e"].map((k) => r.derivasEst[k][i].relacion);
  return ["P" + p.k, ...v.map((x) => f(x, 3)), Math.max(...v) > 1.2 ? "<b>sí</b>" : "no"]; }))}
${h3("1.12", "Combinaciones de carga")}${combos}

${h("II.", "RESULTADOS DEL ANÁLISIS")}
${h3("2.1", "Periodos y participación de masas")}
${tabla(["Modo", "T [s]", "Ux", "Uy", "Rz", "ΣUx", "ΣUy", "ΣRz"], filasModos)}
<ul>${r.chequeoModos.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>
${h3("2.2", "Cortante basal estático")}
<p class="eq">T<sub>a</sub> = C<sub>t</sub>·h<sub>n</sub><sup>α</sup> = ${f(e.Ta, 3)} s · T de diseño = ${f(e.T, 3)} s · Sa(T) = ${f(e.Sa, 3)} g · k = ${f(e.k, 3)}<br>
  V = I·Sa/(R${nec15 ? "·φP·φE" : ""})·W = ${f(e.Cs, 4)} × ${f(T(e.W))} = <b>${f(T(e.V))} tonf</b>${e.Vmin ? ` (mínimo 0.03·W = ${f(T(e.Vmin))} tonf)` : ""}</p>
${tabla(["Piso", "z [m]", "W [tonf]", "F [tonf]", "V piso [tonf]"], e.pisos.map((q) => ["P" + q.k, f(q.z), f(T(q.w)), f(T(q.F)), f(T(q.Vpiso))]))}
${h3("2.3", "Corrección del cortante dinámico respecto al estático")}
${tabla(["Dirección", "V dinámico [tonf]", "V estático [tonf]", "Relación", `Mínimo`, "Factor de escala", "Estado"], [
  ["X", f(T(D.X.V)), f(T(e.V)), pc(D.escX.relacion, 1), pc(D.minimo, 0), f(D.escX.factor, 3), D.escX.cumple ? "cumple sin escalar" : "se escala"],
  ["Y", f(T(D.Y.V)), f(T(e.V)), pc(D.escY.relacion, 1), pc(D.minimo, 0), f(D.escY.factor, 3), D.escY.cumple ? "cumple sin escalar" : "se escala"]])}
${h3("2.4", "Cortantes por piso y centros de masa y rigidez")}
${tabla(["Piso", "V est. [tonf]", "V din. X [tonf]", "V din. Y [tonf]", "CM (x, y) [m]", "CR (x, y) [m]", "e x / e y [m]"], r.pisos.map((p, i) => ["P" + p.k,
  f(T(e.pisos[i].Vpiso)), f(T(D.X.pisos[i].V * D.escX.factor)), f(T(D.Y.pisos[i].V * D.escY.factor)),
  `${f(p.cm[0], 3)}, ${f(p.cm[1], 3)}`, r.cr[i] ? `${f(r.cr[i][0], 3)}, ${f(r.cr[i][1], 3)}` : "—", r.cr[i] ? `${f(r.cr[i][0] - p.cm[0], 3)} / ${f(r.cr[i][1] - p.cm[1], 3)}` : "—"]))}

${h("III.", "DERIVAS DE PISO")}
<p class="eq">${nec15 ? `Deriva inelástica ΔM = 0.75·R·ΔE (NEC-SE-DS §6.3.9) = ${f(0.75 * s.R, 2)}·ΔE; límite ΔM ≤ ${pc(r.limiteDeriva, 1)} (hormigón armado y acero).`
  : `Deriva de diseño Δ = Cd·Δe/Ie = ${f((s.Cd ?? 5.5) / s.I, 2)}·Δe (ec. 6.8); límite ${pc(r.limiteDeriva, 1)} (Tabla 4.3).`}</p>
${h3("3.1", "Derivas del análisis estático (peor de Ex, Ex±e / Ey, Ey±e)")}
${tabla(["Piso", "h [m]", "ΔE X", "ΔM X", "ΔE Y", "ΔM Y", "Límite", "Estado"], r.pisos.map((p, i) => { const dx = peor(["Ex", "Ex+e", "Ex−e"], i), dy = peor(["Ey", "Ey+e", "Ey−e"], i);
  return ["P" + p.k, f(dx.h), pc(dx.max, 3), pc(dx.inelastica), pc(dy.max, 3), pc(dy.inelastica), pc(r.limiteDeriva, 1), ok(Math.max(dx.inelastica, dy.inelastica) <= r.limiteDeriva)]; }))}
${h3("3.2", `Derivas del análisis dinámico (${D.X.modal}, escalado, ${r.dirDerivas.metodo})`)}
${tabla(["Piso", "ΔM X", "ΔM Y", "Límite", "Estado"], r.pisos.map((p, i) => ["P" + p.k, pc(r.dirDerivas.X[i]), pc(r.dirDerivas.Y[i]), pc(r.limiteDeriva, 1), ok(Math.max(r.dirDerivas.X[i], r.dirDerivas.Y[i]) <= r.limiteDeriva)]))}
<figure>${svgDerivas(r, { X: estX, Y: estY })}<figcaption>Derivas inelásticas por piso.</figcaption></figure>
${h3("3.3", "Índice de estabilidad (efecto P-Δ)")}
${tabla(["Piso", "Qx", "Qy", "Estado (Q ≤ 0.10)"], r.pisos.map((p, i) => ["P" + p.k, f(r.estabilidad.X[i], 4), f(r.estabilidad.Y[i], 4), ok(Math.max(r.estabilidad.X[i], r.estabilidad.Y[i]) <= 0.1)]))}

${h("IV.", "CONCLUSIONES Y RECOMENDACIONES")}
<ul class="concl">${concl.map(([b, t]) => `<li class="${b ? "c-ok" : "c-no"}">${b ? "✔" : "✘"} ${t}</li>`).join("")}</ul>
${ed("recomendaciones", "Recomendaciones: (escribir aquí las del calculista).", "p")}
<p class="firma">______________________________<br>${ed("ingeniero", dv.ingeniero)}<br>${ed("registro", dv.registro)}</p>`;

  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Memoria técnica</title><style>
:root{color-scheme:light}
body{margin:0;background:#e5e7eb;font:11pt/1.45 "Times New Roman",Georgia,serif;color:#111}
.hoja{max-width:820px;margin:16px auto;background:#fff;padding:40px 56px;box-shadow:0 2px 12px rgba(0,0,0,.2)}
.barra{position:sticky;top:0;z-index:5;background:#1f2937;color:#fff;padding:8px 16px;display:flex;gap:10px;align-items:center;font:13px Arial}
.barra button{font:13px Arial;padding:5px 12px;cursor:pointer}
h1{font-size:20pt;text-align:center;margin:60px 0 24px}h2{font-size:14pt;margin:28px 0 8px;border-bottom:2px solid #1f2937;padding-bottom:2px}
h3{font-size:12pt;margin:18px 0 6px}table{border-collapse:collapse;width:100%;margin:6px 0 12px;font:9.5pt Arial}
th,td{border:1px solid #9ca3af;padding:3px 6px;text-align:center}th{background:#e5e7eb}
td:first-child{text-align:left}figure{margin:10px 0;text-align:center}figcaption{font:italic 9.5pt Arial;color:#374151}
.ed{background:#fef9c3;outline:1px dashed #ca8a04;padding:0 2px}.eq{font:10pt "Cambria Math",Cambria,serif;background:#f9fafb;padding:6px 10px;border-left:3px solid #1f2937}
.portada{min-height:880px;display:flex;flex-direction:column}.cab{font:bold 10pt Arial;text-align:right}.proy{font-size:16pt;text-align:center;font-weight:bold}
.cen{text-align:center}.pie{margin-top:auto;font:9pt Arial;color:#4b5563}.ok{color:#15803d;font-weight:bold}.no{color:#b91c1c;font-weight:bold}
.c-ok{color:#14532d}.c-no{color:#991b1b;font-weight:bold}.concl li{margin:4px 0}.firma{margin-top:60px;text-align:center}
.indice ol{list-style:none;padding:0;columns:1}.indice li{margin:2px 0}.indice li.n3{padding-left:22px}.indice a{color:#111;text-decoration:none}
.gen{font:8.5pt Arial;color:#6b7280;text-align:center;margin-top:30px}
@media print{body{background:#fff}.barra{display:none}.hoja{box-shadow:none;margin:0;padding:0;max-width:none}.ed{background:none;outline:none}
 h2{break-after:avoid}h3{break-after:avoid}table,figure{break-inside:avoid}.portada,.indice{break-after:page}@page{size:A4;margin:20mm 18mm}}
@media (max-width:700px){.hoja{padding:16px}}
</style></head><body>
<div class="barra"><b>Memoria técnica</b><span style="opacity:.75">— lo amarillo se edita con un clic</span><span style="flex:1"></span>
<button id="imp">🖨 Imprimir / Guardar PDF</button><button id="des">⬇ Descargar HTML</button></div>
<main class="hoja">${cuerpo}<p class="gen">Generado con Hekatan Struct · ${new Date().toLocaleString("es-EC")}</p></main>
<script>
(function(){
  var K="hk-memoria-campos", d={}; try{d=JSON.parse(localStorage.getItem(K)||"{}")}catch(e){}
  document.querySelectorAll(".ed").forEach(function(el){var k=el.dataset.k; if(d[k]) el.textContent=d[k];
    el.addEventListener("input",function(){ document.querySelectorAll('.ed[data-k="'+k+'"]').forEach(function(o){ if(o!==el) o.textContent=el.textContent; });
      d[k]=el.textContent; try{localStorage.setItem(K,JSON.stringify(d))}catch(e){} });});
  var ol=document.getElementById("indice");
  document.querySelectorAll("main h2[id],main h3[id]").forEach(function(h){var li=document.createElement("li"); li.className=h.tagName==="H3"?"n3":"";
    var a=document.createElement("a"); a.href="#"+h.id; a.textContent=h.textContent; li.appendChild(a); ol.appendChild(li);});
  document.getElementById("imp").onclick=function(){window.print()};
  document.getElementById("des").onclick=function(){var c=document.documentElement.cloneNode(true); var b=c.querySelector(".barra"); if(b) b.remove();
    c.querySelectorAll(".ed").forEach(function(e){e.removeAttribute("contenteditable"); e.className="";});
    var u=URL.createObjectURL(new Blob(["<!doctype html>"+c.outerHTML],{type:"text/html"})); var a=document.createElement("a"); a.href=u; a.download="memoria_tecnica.html"; a.click();};
})();
</script></body></html>`;
}

export function abrirMemoria(e: Entrada): Window | null {
  const html = htmlMemoria(e);
  const w = window.open("", "_blank");
  if (!w) { alert("El navegador bloqueó la ventana de la memoria: permite las ventanas emergentes de esta página."); return null; }
  w.document.open(); w.document.write(html); w.document.close();
  (window as any).__hekatanUltimaMemoria = html;
  return w;
}
