/**
 * Asistente de SOBRECARGA MUERTA (DNE — "Super Dead", como el D_NE de CSI/SAFE) — Módulo NUEVO.
 *
 * Jorge (19-sep-2026): el diseño por franjas del radier (`stripDesignPanel.ts`) usa los momentos
 * de las cáscaras del caso/combo EN PANTALLA (`mallaDeLosa()` lee `analyzeOutputs` del
 * `activeLoadCase`), y hoy el `.heks` solo separa `Dead`/`Live` (más lo que el usuario declare a
 * mano en `load`/`frameload ... [patrón]`). `areaload shellID q` — que es como se carga una
 * losa — TODAVÍA no acepta un patrón (`cliModeler.ts`, case "areaload"/"qarea", línea ~780):
 * por eso una losa cargada con `areaload` cae siempre en Dead y la sobrecarga muerta (enlucido,
 * masillado, piso, mampostería, cielo raso...) se pierde o se mezcla con el peso propio.
 *
 * ESTE MÓDULO NO TOCA `cliModeler.ts` NI `main.ts` NI LOS EXPORTADORES — Jorge pidió esperar a
 * que termine el otro despliegue en curso (que ya extiende `LoadPatternType`, `f2kExporter.ts`
 * y `necCombos.ts` con un patrón "Super Dead"/"DNE", visto en el propio código el 19-sep-2026).
 * Aquí solo se calcula la sobrecarga en kN/m² y t/m² con la tabla OFICIAL de la NEC-SE-CG y se
 * arma el texto `.heks` listo para pegar; APLICARLO al patrón DNE del modelo requiere el
 * `areaload shellID q [patrón]` que todavía no existe (ver PLAN al final de este archivo).
 *
 * ── De dónde sale cada peso (NO inventado) ──────────────────────────────────────────────────
 * NEC-15 (oficial, vigente en Ecuador hoy): `referencias/Pdf/1.-NEC-SE-CG-Cargas-No-Sismicas.pdf`
 * (= NEC_SE_CG_Cargas_No_Sismicas.txt, misma extracción), Tabla 8 "Pesos unitarios de materiales
 * de construcción", páginas IMPRESAS 21-24 (páginas de PDF 25-28). Cada valor de abajo lleva su
 * fila y su página.
 *
 * NEC-22 (borrador, NO oficial): buscado en disco (`C:\Users\j-b-j\Documents`,
 * `C:\Users\j-b-j\Downloads\Nec`) y en la web (habitatyvivienda.gob.ec, mit.gob.ec) el
 * 19-sep-2026. Lo único que existe publicado es el borrador de la NEC-SE-DS (peligro sísmico,
 * "Borrador NEC-SE-DS-12-09-23.pdf", ya en `Downloads/Nec/Borrador/`) — NO hay un borrador
 * publicado de la NEC-SE-CG (cargas no sísmicas) con una Tabla 8 distinta. Por eso
 * `TABLA_NEC22_BORRADOR` queda VACÍA a propósito: no se inventa un número. El selector de
 * normativa se deja listo (Jorge, 19-sep-2026: "NEC-15 oficial por defecto, NEC-22 borrador
 * como opción, nunca por defecto, no agregar otras") para el día que aparezca ese documento.
 */

export type Normativa = "NEC-15" | "NEC-22-borrador";

export type UnidadPeso = "kN/m3" | "kN/m2" | "kN/m2/cm";

export interface PesoMaterial {
  id: string;
  grupo: string;          // sección de la Tabla 8 (A..H)
  nombre: string;         // nombre tal como aparece en la NEC
  valor: number;          // en la unidad `unidad`
  unidad: UnidadPeso;
  tabla: string;          // "Tabla 8"
  pagina: number;         // página IMPRESA del documento
  paginaPdf: number;      // página de archivo PDF (offset +4 en la NEC-SE-CG 2015)
  normativa: Normativa;
  nota?: string;
}

// ───────────────────────────── NEC-15 (oficial) — Tabla 8 ─────────────────────────────
// Fuente: 1.-NEC-SE-CG-Cargas-No-Sismicas.pdf, Tabla 8 "Pesos unitarios de materiales de
// construcción" (índice de tablas, pág. 4 del PDF). Transcrito el 19-sep-2026 de
// `referencias/Pdf/NEC_SE_CG_Cargas_No_Sismicas.txt` (extracción ya en disco).
const T15 = (o: Omit<PesoMaterial, "tabla" | "normativa">): PesoMaterial => ({
  ...o, tabla: "Tabla 8", normativa: "NEC-15",
});

export const TABLA_NEC15: PesoMaterial[] = [
  // D. Morteros (enlucido) — pág. impresa 22 (PDF 26)
  T15({ id: "mortero_cem_arena_1_3a5", grupo: "D. Morteros", nombre: "Cemento compuesto y arena 1:3 a 1:5 (enlucido)", valor: 20.0, unidad: "kN/m3", pagina: 22, paginaPdf: 26 }),
  T15({ id: "mortero_cem_cal_arena", grupo: "D. Morteros", nombre: "Cemento compuesto, cal y arena", valor: 18.0, unidad: "kN/m3", pagina: 22, paginaPdf: 26 }),
  T15({ id: "mortero_cal_arena", grupo: "D. Morteros", nombre: "Cal y arena", valor: 16.0, unidad: "kN/m3", pagina: 22, paginaPdf: 26 }),
  T15({ id: "mortero_yeso", grupo: "D. Morteros", nombre: "Yeso", valor: 10.0, unidad: "kN/m3", pagina: 22, paginaPdf: 26 }),

  // Elementos secundarios — G. Contrapisos y recubrimientos (kN/m2 POR CADA CM) — pág. 23 (PDF 27)
  T15({ id: "contrapiso_ho_simple", grupo: "G. Contrapisos y recubrimientos", nombre: "Contrapiso de hormigón simple (por cada cm de espesor)", valor: 0.22, unidad: "kN/m2/cm", pagina: 23, paginaPdf: 27 }),
  T15({ id: "contrapiso_ho_ligero", grupo: "G. Contrapisos y recubrimientos", nombre: "Contrapiso de hormigón ligero simple (por cada cm de espesor)", valor: 0.16, unidad: "kN/m2/cm", pagina: 23, paginaPdf: 27 }),
  T15({ id: "baldosa_ceramica", grupo: "G. Contrapisos y recubrimientos", nombre: "Baldosa de cerámica, con mortero de cemento (por cada cm de espesor)", valor: 0.20, unidad: "kN/m2/cm", pagina: 23, paginaPdf: 27 }),
  T15({ id: "baldosa_marmol_reconstituido", grupo: "G. Contrapisos y recubrimientos", nombre: "Baldosa de mármol reconstituido, con mortero de cemento (por cada cm de espesor)", valor: 0.22, unidad: "kN/m2/cm", pagina: 23, paginaPdf: 27 }),

  // H. Cielorrasos y Cubiertas (kN/m2, valor plano, no por espesor) — pág. 23-24 (PDF 27-28)
  T15({ id: "cielo_yeso_listones", grupo: "H. Cielorrasos y Cubiertas", nombre: "Cielo raso de yeso sobre listones de madera (incluidos los listones)", valor: 0.20, unidad: "kN/m2", pagina: 23, paginaPdf: 27 }),
  T15({ id: "cielo_mortero_cal_arena", grupo: "H. Cielorrasos y Cubiertas", nombre: "Cielo raso de mortero de cemento compuesto de cal y arena", valor: 0.55, unidad: "kN/m2", pagina: 23, paginaPdf: 27 }),
  T15({ id: "cubierta_fibrocemento_8mm", grupo: "H. Cielorrasos y Cubiertas", nombre: "Plancha ondulada de fibrocemento, 8 mm de espesor", valor: 0.20, unidad: "kN/m2", pagina: 24, paginaPdf: 28 }),
  T15({ id: "cubierta_fibrocemento_6mm", grupo: "H. Cielorrasos y Cubiertas", nombre: "Plancha ondulada de fibrocemento, 6 mm de espesor", valor: 0.15, unidad: "kN/m2", pagina: 24, paginaPdf: 28 }),
  T15({ id: "cubierta_zinc_0_5mm", grupo: "H. Cielorrasos y Cubiertas", nombre: "Chapa ondulada de acero galvanizado (zinc), 0.5 mm", valor: 0.07, unidad: "kN/m2", pagina: 24, paginaPdf: 28 }),
  T15({ id: "cubierta_zinc_0_8mm", grupo: "H. Cielorrasos y Cubiertas", nombre: "Chapa ondulada de acero galvanizado (zinc), 0.8 mm", valor: 0.09, unidad: "kN/m2", pagina: 24, paginaPdf: 28 }),
  T15({ id: "cubierta_zinc_1_3mm", grupo: "H. Cielorrasos y Cubiertas", nombre: "Chapa ondulada de acero galvanizado (zinc), 1.3 mm", valor: 0.14, unidad: "kN/m2", pagina: 24, paginaPdf: 28 }),
  T15({ id: "cubierta_teja_barro_sin_mortero", grupo: "H. Cielorrasos y Cubiertas", nombre: "Teja de barro cocido sin mortero", valor: 0.50, unidad: "kN/m2", pagina: 24, paginaPdf: 28 }),
  T15({ id: "cubierta_teja_plana_con_mortero", grupo: "H. Cielorrasos y Cubiertas", nombre: "Teja plana con mortero de cemento", valor: 0.85, unidad: "kN/m2", pagina: 24, paginaPdf: 28 }),
  T15({ id: "cubierta_teja_ho_con_mortero", grupo: "H. Cielorrasos y Cubiertas", nombre: "Teja de hormigón con mortero", valor: 1.15, unidad: "kN/m2", pagina: 24, paginaPdf: 28 }),

  // B. Piedras artificiales (mampostería: bloque y ladrillo) — pág. 21-22 (PDF 25-26)
  T15({ id: "bloque_hueco_ho", grupo: "B. Piedras artificiales", nombre: "Bloque hueco de hormigón", valor: 12.0, unidad: "kN/m3", pagina: 22, paginaPdf: 26 }),
  T15({ id: "bloque_hueco_ho_alivianado", grupo: "B. Piedras artificiales", nombre: "Bloque hueco de hormigón alivianado", valor: 8.5, unidad: "kN/m3", pagina: 22, paginaPdf: 26 }),
  T15({ id: "ho_simple_macizo", grupo: "B. Piedras artificiales", nombre: "Hormigón simple (aprox. para bloque/pared MACIZA de hormigón — la NEC no lista un bloque macizo aparte)", valor: 22.0, unidad: "kN/m3", pagina: 21, paginaPdf: 25, nota: "Aproximación: usa el valor de 'Hormigón simple' porque la Tabla 8 no trae una fila propia de bloque MACIZO." }),
  T15({ id: "ladrillo_prensado_0_10", grupo: "B. Piedras artificiales", nombre: "Ladrillo cerámico prensado (0 a 10% de huecos)", valor: 19.0, unidad: "kN/m3", pagina: 21, paginaPdf: 25 }),
  T15({ id: "ladrillo_perforado_20_30", grupo: "B. Piedras artificiales", nombre: "Ladrillo cerámico perforado (20 a 30% de huecos)", valor: 14.0, unidad: "kN/m3", pagina: 21, paginaPdf: 25 }),
  T15({ id: "ladrillo_hueco_40_50", grupo: "B. Piedras artificiales", nombre: "Ladrillo cerámico hueco (40 a 50% de huecos)", valor: 10.0, unidad: "kN/m3", pagina: 21, paginaPdf: 25 }),
  T15({ id: "ladrillo_artesanal", grupo: "B. Piedras artificiales", nombre: "Ladrillo artesanal", valor: 16.0, unidad: "kN/m3", pagina: 21, paginaPdf: 25 }),
  T15({ id: "adobe", grupo: "B. Piedras artificiales", nombre: "Adobe", valor: 16.0, unidad: "kN/m3", pagina: 21, paginaPdf: 25 }),
  T15({ id: "baldosa_ceramica_material", grupo: "B. Piedras artificiales", nombre: "Baldosa cerámica (peso del material, no del asentado)", valor: 18.0, unidad: "kN/m3", pagina: 21, paginaPdf: 25 }),

  // F. Materiales diversos — pág. 23 (PDF 27), usado solo como referencia aproximada de impermeabilización
  T15({ id: "asfalto_material", grupo: "F. Materiales diversos", nombre: "Asfalto (material — aproximación para membrana/impermeabilización; la NEC no lista 'impermeabilización')", valor: 13.0, unidad: "kN/m3", pagina: 23, paginaPdf: 27, nota: "La NEC-SE-CG no tiene una fila de 'impermeabilización'. Se ofrece el peso del asfalto como referencia; usar el campo MANUAL con el dato del fabricante siempre que exista." }),
];

// ───────────────────────────── NEC-22 (borrador, NO oficial) ─────────────────────────────
// Vacía a propósito: no se encontró un borrador PUBLICADO de la NEC-SE-CG (cargas no sísmicas)
// con una Tabla 8 distinta (búsqueda en disco y web, 19-sep-2026). Solo existe el borrador de
// la NEC-SE-DS (peligro sísmico, otro capítulo). No inventar valores.
export const TABLA_NEC22_BORRADOR: PesoMaterial[] = [];

export function tablaDe(n: Normativa): PesoMaterial[] {
  return n === "NEC-15" ? TABLA_NEC15 : TABLA_NEC22_BORRADOR;
}

// ───────────────────────────── Conversión de unidades (Ecuador: tonf, t/m²) ─────────────────────────────
// 1 tonf = 9.80665 kN  →  1 kN = 0.1019716 tonf  (memoria: feedback_unidades_ecuador_tonf_kgfcm2.md)
export const KN_A_TONF = 1 / 9.80665;
export const kNaTonf = (kN: number): number => kN * KN_A_TONF;

/** Peso de una capa de material (kN/m²) según su unidad declarada en la tabla. */
export function pesoCapaKNm2(mat: PesoMaterial, espesorCm: number): number {
  if (mat.unidad === "kN/m2") return mat.valor;                    // valor plano, no depende del espesor
  if (mat.unidad === "kN/m2/cm") return mat.valor * espesorCm;      // ya viene "por cada cm"
  return mat.valor * (espesorCm / 100);                             // kN/m3 → kN/m2 = γ · espesor(m)
}

/** Pared de bloque/ladrillo: peso por m² de MURO (γ · espesor). */
export function paredKNm2Muro(mat: PesoMaterial, espesorCm: number): number {
  if (mat.unidad !== "kN/m3") throw new Error(`${mat.id}: se esperaba un material volumétrico (kN/m3) para una pared`);
  return mat.valor * (espesorCm / 100);
}

/** Pared como CARGA LINEAL sobre la viga que la soporta (kN/m de viga). */
export function paredKNm_Lineal(mat: PesoMaterial, espesorCm: number, alturaM: number): number {
  return paredKNm2Muro(mat, espesorCm) * alturaM;
}

/**
 * Pared repartida como sobrecarga DISTRIBUIDA sobre el área de la losa (kN/m² de losa), la
 * forma en que Jorge normalmente mete la mampostería en un edificio de hormigón: el peso total
 * de la pared (longitud × altura × peso por m²) se reparte en el área tributaria de losa.
 */
export function paredKNm2Distribuido(mat: PesoMaterial, espesorCm: number, alturaM: number, longitudTotalM: number, areaLosaM2: number): number {
  if (areaLosaM2 <= 0) throw new Error("areaLosaM2 debe ser > 0 para repartir la pared sobre la losa");
  return (paredKNm2Muro(mat, espesorCm) * alturaM * longitudTotalM) / areaLosaM2;
}

// ───────────────────────────── Componentes del asistente ─────────────────────────────
export type TipoComponente =
  | "capa"        // enlucido, masillado, piso, cielo raso, cubierta: espesor en cm → kN/m2
  | "pared"       // bloque/ladrillo: espesor + altura, lineal o distribuido
  | "manual";     // el usuario da directamente kN/m2 o kgf/m2 (instalaciones, impermeabilización, piso no listado...)

export interface ComponenteSeleccionado {
  etiqueta: string;
  tipo: TipoComponente;
  matId?: string;          // id de PesoMaterial (capa/pared)
  espesorCm?: number;      // capa y pared
  alturaM?: number;        // pared
  modoParedDistribuido?: boolean; // true=reparte en área de losa, false=carga lineal (no entra en el total kN/m2)
  longitudTotalM?: number; // pared distribuida
  areaLosaM2?: number;     // pared distribuida
  manualKNm2?: number;     // tipo "manual"
  manualNota?: string;
}

export interface ResultadoComponente {
  etiqueta: string;
  kN_m2?: number;          // undefined si es pared en modo LINEAL (no suma al área)
  kN_m_lineal?: number;    // solo pared en modo lineal
  fuente: string;          // "NEC-15 Tabla 8, pág. 22" o "manual (no NEC)"
}

export interface ResultadoSobrecarga {
  normativa: Normativa;
  detalle: ResultadoComponente[];
  total_kN_m2: number;
  total_tonf_m2: number;
  lineales: ResultadoComponente[];  // paredes en modo lineal, no entran en el total de área
}

export function sumarSobrecarga(normativa: Normativa, comps: ComponenteSeleccionado[]): ResultadoSobrecarga {
  const tabla = tablaDe(normativa);
  const detalle: ResultadoComponente[] = [];
  const lineales: ResultadoComponente[] = [];
  let total = 0;

  for (const c of comps) {
    if (c.tipo === "manual") {
      const v = c.manualKNm2 ?? 0;
      detalle.push({ etiqueta: c.etiqueta, kN_m2: v, fuente: c.manualNota ?? "manual (no está en la Tabla 8 de la NEC-SE-CG)" });
      total += v;
      continue;
    }
    const mat = tabla.find(m => m.id === c.matId);
    if (!mat) {
      detalle.push({ etiqueta: c.etiqueta, kN_m2: 0, fuente: `sin dato en ${normativa} — pendiente` });
      continue;
    }
    const fuente = `${mat.tabla} ${normativa}, pág. ${mat.pagina} (PDF pág. ${mat.paginaPdf})${mat.nota ? ` — ${mat.nota}` : ""}`;
    if (c.tipo === "capa") {
      const v = pesoCapaKNm2(mat, c.espesorCm ?? 0);
      detalle.push({ etiqueta: c.etiqueta, kN_m2: v, fuente });
      total += v;
    } else if (c.tipo === "pared") {
      const esp = c.espesorCm ?? 0, alt = c.alturaM ?? 0;
      if (c.modoParedDistribuido) {
        const v = paredKNm2Distribuido(mat, esp, alt, c.longitudTotalM ?? 0, c.areaLosaM2 ?? 1);
        detalle.push({ etiqueta: c.etiqueta, kN_m2: v, fuente });
        total += v;
      } else {
        const v = paredKNm_Lineal(mat, esp, alt);
        const r = { etiqueta: c.etiqueta, kN_m_lineal: v, fuente };
        lineales.push(r);
      }
    }
  }

  return { normativa, detalle, total_kN_m2: total, total_tonf_m2: kNaTonf(total), lineales };
}

/**
 * Línea `.heks` lista para pegar, CON EL PATRÓN "DNE" YA ESCRITO, a la espera de que
 * `cliModeler.ts` acepte `areaload shellID q [patrón]` (ver PLAN en el reporte). Hoy esa
 * sintaxis NO existe (`areaload` solo admite `shellID q`, siempre Dead) — se deja el texto
 * comentado para no sugerir algo que el parser todavía rechaza.
 */
export function lineaHeksSugerida(shellId: number, q_kNm2: number): string {
  return [
    `# Sobrecarga muerta (DNE) calculada por el asistente: ${q_kNm2.toFixed(4)} kN/m2 = ${kNaTonf(q_kNm2).toFixed(4)} tonf/m2`,
    `# Pendiente: "areaload ${shellId} ${q_kNm2.toFixed(4)} DNE" (requiere extender cliModeler.ts, ver plan)`,
    `areaload ${shellId} ${q_kNm2.toFixed(4)}   # hoy entra como Dead — revisar cuando exista el patrón`,
  ].join("\n");
}

/*
 * ═══════════════════════════════ PLAN — Patrón "Sobrecarga Muerta" (DNE) ═══════════════════════════════
 * (para aplicar DESPUÉS de que termine el otro despliegue en curso, sobre main.ts, cliModeler.ts,
 * los exportadores y el parser .heks — NO tocados por este módulo)
 *
 * 1. `hekatan-fem/src/data-model.ts`: agregar "Super Dead" a `LoadPatternType` (junto a "Dead",
 *    "Live", ...). Mismo estilo que ya existe.
 * 2. `examples/src/cli-modeler/cliModeler.ts`:
 *      - `areaload`/`qarea` (línea ~780): aceptar un 4º token opcional [patrón], igual que ya
 *        hacen `load` (línea ~811) y `frameload` (línea ~822): `patL = tokens[N] && isNaN(parseFloat(...)) ? tokens[N] : "Dead"`.
 *      - el `shell ... [q]` (8º token, línea ~703) también carga como Dead siempre: si Jorge
 *        quiere pegar la DNE al MISMO shell (su otro camino: "meter parte de la sobrecarga
 *        como peso del material"), no hace falta tocar esto — ya funciona así.
 *      - sumar "DNE" a `cargasPorPatron`/`frameLoadsPorPatron` igual que los demás patrones
 *        (líneas ~1518, ~1791): ya son genéricos por nombre, no hace falta lista cerrada.
 * 3. `hekatan-struct-py/src/hekatan_struct/heks.py`: mismo cambio, para que el árbitro Python
 *    lea el mismo `.heks` (regla del repo: "el mismo texto que come cliModeler.ts").
 * 4. Exportadores — YA EMPEZADO por el otro agente (visto en el código, 18/19-sep-2026):
 *      - `f2kExporter.ts` línea 255: `tipoDe()` ya reconoce `/^(dne|sdead|scm|superdead)$/i` → `"Super Dead"`.
 *      - falta lo mismo en `e2kExporter.ts` (ETABS `Type="Super Dead"`) y `s2kExporter.ts` (SAP
 *        también soporta el tipo "Super Dead" en LOAD PATTERN DEFINITIONS).
 * 5. `examples/src/shared/necCombos.ts`: agregar el bucket `"Super Dead": []`, sumar `DNE` al
 *    término D en cada combinación (D+DNE en vez de solo D) y las dos combos que pidió Jorge:
 *      SERVICIO  = 1.0 D + 1.0 DNE + 1.0 L
 *      DISEÑO    = 1.2 D + 1.2 DNE + 1.6 L      (ACI 318-19 vía NEC-SE-CG, D y DNE con el MISMO factor)
 * 6. UI: los ejemplos con checkboxes D/L/S (zapata-aislada, edificio-aporticado...) necesitan un
 *    checkbox "DNE" más — no se toca ahora (son `main.ts` de cada ejemplo).
 * 7. Radier / franjas: `stripDesignPanel.ts` no necesita cambios — ya lee el caso/combo activo
 *    en pantalla; en cuanto SERVICIO/DISEÑO sumen DNE, el diseño por franjas la ve sola.
 * 8. Verificación pedida por Jorge: el radier de SAFE da 707.47 t en SERVICIO y 881.93 t en
 *    DISEÑO — comparar la reacción total de Hekatan con esos dos números una vez conectada la DNE.
 */
