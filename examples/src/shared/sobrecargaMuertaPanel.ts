/**
 * Panel «Sobrecarga DNE» — asistente de sobrecarga muerta (enlucido, masillado, piso, cielo
 * raso, paredes, mampostería, cubierta) con los pesos de la NEC-SE-CG. Módulo NUEVO, mismo
 * patrón que `stripDesignPanel.ts` (DOM flotante, sin Tweakpane): botón fijo + panel que lee
 * `window.__hekatanStates` SOLO para mostrar contexto (no escribe nada en el modelo — ver
 * `sobrecargaMuertaNEC.ts` para el porqué: `areaload` todavía no acepta un patrón).
 *
 * Uso (cuando se autorice conectarlo, un solo `<script>` en `workspace/index.html`, igual que
 * `franjasEntry.ts`): NO se toca esa página desde este módulo.
 */
import {
  TABLA_NEC15, TABLA_NEC22_BORRADOR, tablaDe, sumarSobrecarga, lineaHeksSugerida, kNaTonf,
  type Normativa, type PesoMaterial, type ComponenteSeleccionado, type TipoComponente,
} from "./sobrecargaMuertaNEC";

const W = window as any;

interface FilaUI {
  id: string;
  etiqueta: string;
  tipo: TipoComponente;
  matId?: string;
  activo: boolean;
}

// Catálogo de componentes que ofrece el asistente (Jorge, 19-sep-2026): cada fila apunta a un
// material de la tabla NEC o queda "manual" si la norma no lo lista.
const CATALOGO: FilaUI[] = [
  { id: "enlucido", etiqueta: "Enlucido (mortero cemento-arena)", tipo: "capa", matId: "mortero_cem_arena_1_3a5", activo: false },
  { id: "masillado", etiqueta: "Masillado / contrapiso de hormigón simple", tipo: "capa", matId: "contrapiso_ho_simple", activo: false },
  { id: "masillado_ligero", etiqueta: "Contrapiso de hormigón ligero", tipo: "capa", matId: "contrapiso_ho_ligero", activo: false },
  { id: "piso_ceramica", etiqueta: "Recubrimiento: baldosa cerámica con mortero", tipo: "capa", matId: "baldosa_ceramica", activo: false },
  { id: "piso_marmol", etiqueta: "Recubrimiento: baldosa de mármol reconstituido", tipo: "capa", matId: "baldosa_marmol_reconstituido", activo: false },
  { id: "piso_porcelanato", etiqueta: "Recubrimiento: porcelanato (NO está en la NEC — manual)", tipo: "manual", activo: false },
  { id: "piso_madera", etiqueta: "Recubrimiento: piso de madera (NO está en la NEC — manual)", tipo: "manual", activo: false },
  { id: "cielo_yeso", etiqueta: "Cielo raso de yeso sobre listones", tipo: "capa", matId: "cielo_yeso_listones", activo: false },
  { id: "cielo_mortero", etiqueta: "Cielo raso de mortero cal-arena", tipo: "capa", matId: "cielo_mortero_cal_arena", activo: false },
  { id: "cielo_suspendido", etiqueta: "Cielo raso suspendido (gypsum sobre perfilería — NO está en la NEC — manual)", tipo: "manual", activo: false },
  { id: "pared_bloque_hueco", etiqueta: "Pared de bloque hueco de hormigón", tipo: "pared", matId: "bloque_hueco_ho", activo: false },
  { id: "pared_bloque_alivianado", etiqueta: "Pared de bloque hueco alivianado", tipo: "pared", matId: "bloque_hueco_ho_alivianado", activo: false },
  { id: "pared_bloque_macizo", etiqueta: "Pared de bloque/hormigón MACIZO (aprox., ver nota)", tipo: "pared", matId: "ho_simple_macizo", activo: false },
  { id: "pared_ladrillo_prensado", etiqueta: "Mampostería: ladrillo prensado (0-10% huecos)", tipo: "pared", matId: "ladrillo_prensado_0_10", activo: false },
  { id: "pared_ladrillo_perforado", etiqueta: "Mampostería: ladrillo perforado (20-30% huecos)", tipo: "pared", matId: "ladrillo_perforado_20_30", activo: false },
  { id: "pared_ladrillo_hueco", etiqueta: "Mampostería: ladrillo hueco (40-50% huecos)", tipo: "pared", matId: "ladrillo_hueco_40_50", activo: false },
  { id: "pared_adobe", etiqueta: "Mampostería: adobe", tipo: "pared", matId: "adobe", activo: false },
  { id: "cubierta_zinc", etiqueta: "Cubierta: chapa galvanizada (zinc) 0.8 mm", tipo: "capa", matId: "cubierta_zinc_0_8mm", activo: false },
  { id: "cubierta_teja", etiqueta: "Cubierta: teja de hormigón con mortero", tipo: "capa", matId: "cubierta_teja_ho_con_mortero", activo: false },
  { id: "impermeabilizacion", etiqueta: "Impermeabilización (NO está literal en la NEC — manual; asfalto como referencia)", tipo: "manual", activo: false },
  { id: "instalaciones", etiqueta: "Instalaciones / MEP (NO está en la NEC — manual, práctica usual 0.10-0.20 kN/m², NO normativo)", tipo: "manual", activo: false },
];

export function montarPanelSobrecarga() {
  if (document.getElementById("hk-dne-btn")) return;
  const btn = document.createElement("button");
  btn.id = "hk-dne-btn"; btn.textContent = "🧱 Sobrecarga DNE";
  btn.title = "Asistente de sobrecarga muerta (enlucido, piso, mampostería...) con pesos de la NEC-SE-CG";
  btn.style.display = "none";   // se abre desde «📋 Patrones de carga»
  document.body.appendChild(btn);
  // se abre desde «📋 Patrones de carga» (loadPatternsPanel.ts): es carga, no diseño

  const pan = document.createElement("div");
  pan.id = "hk-dne";
  pan.style.cssText = "position:fixed;top:90px;right:12px;z-index:950;width:560px;max-height:80vh;overflow:auto;background:rgba(24,28,34,.96);color:#e8e8e8;border:1px solid #b0834a;border-radius:6px;font:12px sans-serif;padding:8px;display:none";
  document.body.appendChild(pan);
  const $ = (id: string) => pan.querySelector("#" + id) as any;

  let normativa: Normativa = "NEC-15";
  const filas: FilaUI[] = CATALOGO.map(f => ({ ...f }));
  const espesores = new Map<string, number>();
  const alturas = new Map<string, number>();
  const modoDistribuido = new Map<string, boolean>();
  const longitudes = new Map<string, number>();
  const areasLosa = new Map<string, number>();
  const manuales = new Map<string, number>();

  const opcionesTabla = () => {
    const tabla = tablaDe(normativa);
    const disponible = tabla.length > 0;
    return { tabla, disponible };
  };

  const filaHTML = (f: FilaUI): string => {
    const { tabla, disponible } = opcionesTabla();
    const mat = f.matId ? tabla.find(m => m.id === f.matId) : undefined;
    const sinDato = !!f.matId && !mat; // NEC-22 borrador vacía: el material no existe ahí
    const check = `<input type="checkbox" class="hkd-chk" data-id="${f.id}" ${f.activo ? "checked" : ""}>`;
    const fuente = f.tipo === "manual"
      ? `<span style="color:#e0a05a">manual (no NEC)</span>`
      : sinDato
        ? `<span style="color:#e05a5a">sin dato en ${normativa}</span>`
        : `<span style="color:#7ab0e0">${mat!.tabla} pág. ${mat!.pagina}${mat!.nota ? " ⚠" : ""}</span>`;
    let campos = "";
    if (f.tipo === "capa" && mat?.unidad === "kN/m2") {
      campos = `<span style="color:#999">valor fijo ${mat.valor} kN/m², sin espesor</span>`;
    } else if (f.tipo === "capa") {
      campos = `espesor <input type="number" class="hkd-esp" data-id="${f.id}" value="${espesores.get(f.id) ?? 2}" step="0.5" style="width:44px"> cm`;
    } else if (f.tipo === "pared") {
      const dist = modoDistribuido.get(f.id) ?? true;
      campos = `espesor <input type="number" class="hkd-esp" data-id="${f.id}" value="${espesores.get(f.id) ?? 10}" step="1" style="width:40px"> cm
        alto <input type="number" class="hkd-alt" data-id="${f.id}" value="${alturas.get(f.id) ?? 2.5}" step="0.1" style="width:44px"> m
        <label><input type="checkbox" class="hkd-dist" data-id="${f.id}" ${dist ? "checked" : ""}> repartir en losa</label>
        ${dist ? `long. total <input type="number" class="hkd-long" data-id="${f.id}" value="${longitudes.get(f.id) ?? 0}" step="0.5" style="width:44px"> m
          área losa <input type="number" class="hkd-area" data-id="${f.id}" value="${areasLosa.get(f.id) ?? 0}" step="0.5" style="width:50px"> m²`
          : `<span style="color:#999">carga LINEAL, no entra en el kN/m² total</span>`}`;
    } else {
      campos = `valor <input type="number" class="hkd-man" data-id="${f.id}" value="${manuales.get(f.id) ?? 0}" step="0.01" style="width:52px"> kN/m²`;
    }
    return `<div style="padding:2px 0;border-bottom:1px solid #333">
      <label>${check} ${f.etiqueta}</label> ${fuente}
      <div style="margin-left:20px;color:#ccc">${campos}</div>
    </div>`;
  };

  const render = () => {
    const { disponible } = opcionesTabla();
    pan.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center"><b>Asistente de sobrecarga muerta (DNE)</b><span id="hkd-x" style="cursor:pointer">✕</span></div>
    <div style="margin:4px 0">Normativa
      <select id="hkd-norma">
        <option value="NEC-15" ${normativa === "NEC-15" ? "selected" : ""}>NEC-15 (oficial, vigente)</option>
        <option value="NEC-22-borrador" ${normativa === "NEC-22-borrador" ? "selected" : ""}>NEC-22 (borrador, NO oficial)</option>
      </select>
      ${!disponible ? `<span style="color:#e05a5a"> — no hay borrador NEC-22 de SE-CG (cargas) publicado; solo existe el de peligro sísmico (SE-DS). No se inventan valores.</span>` : ""}
    </div>
    <div style="color:#999;font-size:11px;margin-bottom:4px">Pesos: NEC-SE-CG Tabla 8 "Pesos unitarios de materiales de construcción". Cada fila cita tabla y página. ⚠ = ver nota (aproximación, dicha explícitamente).</div>
    <div id="hkd-filas">${filas.map(filaHTML).join("")}</div>
    <div style="margin-top:6px;padding-top:6px;border-top:1px solid #556">
      <b>Total sobrecarga muerta (área): <span id="hkd-total-kn"></span> kN/m² = <span id="hkd-total-t"></span> tonf/m²</b>
      <div id="hkd-lineales" style="color:#e0a05a"></div>
    </div>
    <div style="margin-top:6px">
      <label>Shell ID destino (para el texto .heks) <input id="hkd-shell" type="number" value="1" style="width:50px"></label>
      <button id="hkd-heks">Generar línea .heks</button>
    </div>
    <textarea id="hkd-heks-out" readonly style="width:100%;height:60px;margin-top:4px;font:11px monospace;background:#111;color:#9c9;display:none"></textarea>
    <div style="color:#e0a05a;font-size:11px;margin-top:6px">
      ⚠ Este asistente SOLO calcula. Aplicar el resultado como patrón "DNE" en el modelo requiere
      extender <code>areaload</code> en <code>cliModeler.ts</code> (pendiente, ver plan en
      <code>sobrecargaMuertaNEC.ts</code> — no se toca hasta que termine el despliegue en curso).
    </div>`;
    wire();
    recalcular();
  };

  const recalcular = () => {
    const comps: ComponenteSeleccionado[] = [];
    for (const f of filas) {
      if (!f.activo) continue;
      if (f.tipo === "manual") {
        comps.push({ etiqueta: f.etiqueta, tipo: "manual", manualKNm2: manuales.get(f.id) ?? 0 });
      } else if (f.tipo === "capa") {
        comps.push({ etiqueta: f.etiqueta, tipo: "capa", matId: f.matId, espesorCm: espesores.get(f.id) ?? 0 });
      } else if (f.tipo === "pared") {
        const dist = modoDistribuido.get(f.id) ?? true;
        comps.push({
          etiqueta: f.etiqueta, tipo: "pared", matId: f.matId,
          espesorCm: espesores.get(f.id) ?? 0, alturaM: alturas.get(f.id) ?? 0,
          modoParedDistribuido: dist, longitudTotalM: longitudes.get(f.id) ?? 0, areaLosaM2: areasLosa.get(f.id) || 1,
        });
      }
    }
    const r = sumarSobrecarga(normativa, comps);
    $("hkd-total-kn").textContent = r.total_kN_m2.toFixed(4);
    $("hkd-total-t").textContent = r.total_tonf_m2.toFixed(4);
    $("hkd-lineales").innerHTML = r.lineales.length
      ? "Paredes en carga LINEAL (no suman al área): " + r.lineales.map(l => `${l.etiqueta} = ${l.kN_m_lineal!.toFixed(3)} kN/m (${kNaTonf(l.kN_m_lineal!).toFixed(3)} tonf/m)`).join("; ")
      : "";
    W.__hekatanSobrecargaDNE = r; // para pruebas (mismo patrón que __hekatanFranjas)
  };

  const wire = () => {
    $("hkd-x").onclick = () => (pan.style.display = "none");
    $("hkd-norma").onchange = (e: any) => { normativa = e.target.value; render(); };
    pan.querySelectorAll(".hkd-chk").forEach((el: any) => el.onchange = (e: any) => {
      const f = filas.find(x => x.id === e.target.dataset.id)!; f.activo = e.target.checked; render();
    });
    pan.querySelectorAll(".hkd-esp").forEach((el: any) => el.oninput = (e: any) => { espesores.set(e.target.dataset.id, +e.target.value); recalcular(); });
    pan.querySelectorAll(".hkd-alt").forEach((el: any) => el.oninput = (e: any) => { alturas.set(e.target.dataset.id, +e.target.value); recalcular(); });
    pan.querySelectorAll(".hkd-long").forEach((el: any) => el.oninput = (e: any) => { longitudes.set(e.target.dataset.id, +e.target.value); recalcular(); });
    pan.querySelectorAll(".hkd-area").forEach((el: any) => el.oninput = (e: any) => { areasLosa.set(e.target.dataset.id, +e.target.value); recalcular(); });
    pan.querySelectorAll(".hkd-man").forEach((el: any) => el.oninput = (e: any) => { manuales.set(e.target.dataset.id, +e.target.value); recalcular(); });
    pan.querySelectorAll(".hkd-dist").forEach((el: any) => el.onchange = (e: any) => { modoDistribuido.set(e.target.dataset.id, e.target.checked); render(); });
    $("hkd-heks").onclick = () => {
      const shellId = +$("hkd-shell").value;
      const out = $("hkd-heks-out");
      out.style.display = "block";
      out.value = lineaHeksSugerida(shellId, +$("hkd-total-kn").textContent);
    };
  };

  btn.onclick = () => { pan.style.display = pan.style.display === "none" ? "block" : "none"; if (pan.style.display === "block") render(); };
  W.__hekatanSobrecargaPanel = { abrir: () => { pan.style.display = "block"; render(); }, catalogo: filas, get normativa() { return normativa; } };
}
