/**
 * PANEL DE ACCESO RÁPIDO (2-oct-2026). Jorge: «lo que nos interesa siempre es cambiar la carga y fuerzas, dimensiones
 * y ver resultados · hay que dejar la ventana limpia · esos Tweakpane causan dolor de cabeza». Maqueta aprobada el
 * 11-sep (registros/img_ui/interfaz_propuesta_A.png): rápido, con tecla, 📌 fijar (no candado), sin amarillo.
 *
 * Tres grupos y nada más: CARGAS · DIMENSIONES · RESULTADOS. No copia el modelo de datos: cada mando es un ESPEJO de la
 * fila real de Tweakpane (misma etiqueta) — al cambiarlo se escribe en la fila real y se dispara su «change», así corren
 * los mismos manejadores (onParamChange, autorun, hiddenIf) y los guiones de vídeo que buscan por etiqueta siguen
 * encontrando la fila donde estaba. Si la fila no existe (oculta por hiddenIf), se usa `__hekatanSetParam`.
 *
 *   Alt+1 / Alt+2 / Alt+3  abre Cargas / Dimensiones / Resultados · Alt+Q muestra u oculta el panel.
 *   Acordeón: al abrir un grupo se pliegan los otros, salvo los fijados con 📌.
 *   «＋» en cada grupo elige qué mandos van ahí (por ejemplo, se recuerda en localStorage).
 */
import { convertirEtiqueta, pasoRedondo } from "../workspace/unidadEtiqueta";
import { forceUnit, lengthStructureUnit, lengthSectionUnit, stressUnit, subgradeUnit, stripUnitSuffix, forceUnitSuffix, momentUnitSuffix } from "../workspace/units";

type Grupo = "cargas" | "dim" | "res";
type Def = { default: number; min?: number; max?: number; step?: number; label?: string; options?: Record<string, number>; boolean?: boolean; folder?: string; unitType?: string };

/** La misma conversión que el panel principal (unidadEtiqueta.ts): etiqueta y factor k (se enseña valor × k). */
function enSistema(d: Def, etq: string): { etq: string; k: number } {
  // fuerza y momento con unitType: el valor ya está en la unidad de la interfaz; la etiqueta, como la de Tweakpane
  if (d.unitType === "force") return { etq: `${stripUnitSuffix(etq)} ${forceUnitSuffix()}`, k: 1 };
  if (d.unitType === "moment") return { etq: `${stripUnitSuffix(etq)} ${momentUnitSuffix()}`, k: 1 };
  if (d.unitType || d.options || d.boolean) return { etq, k: 1 };
  const c = convertirEtiqueta(etq, { F: forceUnit.val, L: lengthStructureUnit.val, LS: lengthSectionUnit.val, S: stressUnit.val, SG: subgradeUnit.val });
  return c ? { etq: `${c.base} (${c.u})`, k: c.k } : { etq, k: 1 };
}
const redondo = (x: number) => (Number.isFinite(x) ? Number(x.toPrecision(6)) : x);   // 6 cifras a la vista

const ACENTO = "#7f96b3";
const LS = "hk_acceso_";
const w = window as any;
const lsGet = (k: string, d: string) => { try { return localStorage.getItem(LS + k) ?? d; } catch { return d; } };
const lsSet = (k: string, v: string) => { try { localStorage.setItem(LS + k, v); } catch { /* sin almacenamiento */ } };
const txt = (e: Element | null) => (e?.textContent || "").replace(/\s+/g, " ").trim();

const RE_CARGA_CARPETA = /carga|momento|axial|s[ií]sm|masa|empuje|viento|presi/i;
const RE_DIM_CARPETA = /geometr|secci|column|viga|piso|rejilla|muro|hueco|cimiento|losa|posici|cubierta|amarre|zapata|planta|dimens/i;
const RE_FUERA = /material|malla|mesh|solver|avanzad|export|modifier|ver por tipo|time history|suelo avanzado|pernos|soldadura|apoyo|cimentaci/i;
// ⚠ sin \bR\b ni \bZ\b: en JS «í» no es letra para \b y «rígidos» casaba con \bR\b (salían los brazos rígidos en CARGAS)
const RE_CARGA = /carga|load|fuerza|kN(?!\/m³)|viva|muerta|sobrecarga|\bq\b|\bF[xyz]\b|presi|empuje|viento|kPa|sismo|factor z/i;
const RE_DIM = /luz|vano|piso|altura|entrepiso|eje|secci|column|viga|espesor|canto|ancho|longitud|largo|\bb\b|\bh\b|dimens|radio|di[aá]metro|\(m\)|\(cm\)|\(mm\)|n[º°] /i;

function grupoDe(clave: string, d: Def): Grupo | null {
  const f = d.folder ?? "", l = d.label ?? clave;
  if (RE_FUERA.test(f) || /f'c|\bfy\b|material|hormig[oó]n \(|acero \(/i.test(l)) return null;   // material: no es carga ni dimensión
  if (RE_CARGA_CARPETA.test(f)) return "cargas";
  if (RE_DIM_CARPETA.test(f)) return "dim";
  if (RE_CARGA.test(l)) return "cargas";
  if (RE_DIM.test(l)) return "dim";
  return null;
}

/** La fila real de Tweakpane con esa etiqueta (panel de la derecha o Settings de la izquierda). */
function filaReal(etq: string, donde: "params" | "settings" | "todo" = "todo"): HTMLElement | null {
  const raices = donde === "params" ? ["#hk-pane-host"] : donde === "settings" ? ["#settings"] : ["#hk-pane-host", "#settings"];
  for (const r of raices) {
    const raiz = document.querySelector(r); if (!raiz) continue;
    for (const f of raiz.querySelectorAll<HTMLElement>(".tp-lblv")) if (txt(f.querySelector(".tp-lblv_l")) === etq) return f;
  }
  return null;
}
/** ¿La fila está escondida (hiddenIf de Tweakpane: el mando no aplica con lo elegido)? */
function oculta(f: HTMLElement): boolean {
  for (let e: HTMLElement | null = f; e && e.id !== "hk-pane-host" && e.id !== "settings"; e = e.parentElement) {
    // solo la marca de Tweakpane: una carpeta PLEGADA también esconde sus filas y esas sí van al acceso rápido
    if (e.classList.contains("tp-v-hidden")) return true;
  }
  return false;
}
function botonReal(t: string): HTMLButtonElement | null {
  for (const b of document.querySelectorAll<HTMLButtonElement>(".tp-btnv_b")) if (txt(b).includes(t)) return b;
  return null;
}
/** Escribe en la fila real y dispara su change (Tweakpane lee el input en «change»). */
function escribirFila(f: HTMLElement, v: string | number | boolean): boolean {
  const sel = f.querySelector<HTMLSelectElement>("select");
  if (sel) { sel.value = String(v); sel.dispatchEvent(new Event("change", { bubbles: true })); return true; }
  const ck = f.querySelector<HTMLInputElement>("input[type=checkbox]");
  if (ck) { if (ck.checked !== !!v) ck.click(); return true; }
  const inp = f.querySelector<HTMLInputElement>("input.tp-txtv_i, input");
  if (inp) { inp.value = String(v); inp.dispatchEvent(new Event("change", { bubbles: true })); return true; }
  return false;
}
function leerFila(f: HTMLElement): { tipo: "lista" | "casilla" | "numero"; valor: string; opciones?: [string, string][] } {
  const sel = f.querySelector<HTMLSelectElement>("select");
  if (sel) return { tipo: "lista", valor: sel.value, opciones: [...sel.options].map((o) => [o.value, o.textContent || o.value]) };
  const ck = f.querySelector<HTMLInputElement>("input[type=checkbox]");
  if (ck) return { tipo: "casilla", valor: ck.checked ? "1" : "0" };
  return { tipo: "numero", valor: f.querySelector<HTMLInputElement>("input")?.value ?? "" };
}

const FILAS_RES = [["Resultados de barra", "Barras"], ["Resultados de cáscara", "Cáscaras"], ["Deformada", "Deformada"], ["Escala XY", "Escala"]] as const;
/** Cuántas de las filas de resultados existen ahora (el visor las crea o filtra después de cargar el ejemplo). */
const nFilasRes = () => FILAS_RES.filter(([e]) => filaReal(e, "settings") ?? filaReal(e)).length + (filaReal("Case", "settings") ? 1 : 0);

const CSS = `
#hk-acceso{position:fixed;left:30px;top:100px;width:272px;max-height:calc(100vh - 170px);overflow:auto;z-index:90;
 background:rgba(18,22,30,.94);border:1px solid rgba(127,150,179,.35);border-radius:8px;color:#e2e8f0;
 font:12px/1.4 system-ui,"Segoe UI",sans-serif;box-shadow:0 6px 22px rgba(0,0,0,.45)}
#hk-acceso .ar-cab{display:flex;align-items:center;gap:6px;padding:7px 9px;border-bottom:1px solid rgba(127,150,179,.25);font-weight:600;color:${ACENTO}}
#hk-acceso .ar-cab .ar-esp{flex:1}
#hk-acceso button{font:inherit;color:#e2e8f0;background:rgba(127,150,179,.14);border:1px solid rgba(127,150,179,.3);border-radius:5px;padding:2px 7px;cursor:pointer}
#hk-acceso button:hover{background:rgba(127,150,179,.3)}
#hk-acceso .ar-g{border-bottom:1px solid rgba(127,150,179,.18)}
#hk-acceso .ar-gt{display:flex;align-items:center;gap:6px;padding:7px 9px;cursor:pointer;user-select:none;font-weight:600;letter-spacing:.03em}
#hk-acceso .ar-gt .ar-t{flex:1}
#hk-acceso .ar-gt kbd{font:10px ui-monospace,monospace;color:#94a3b8;border:1px solid #475569;border-radius:3px;padding:0 4px}
#hk-acceso .ar-gt .ar-pin{opacity:.35;border:none;background:none;padding:0 2px}
#hk-acceso .ar-gt .ar-pin.on{opacity:1}
#hk-acceso .ar-cu{padding:2px 9px 8px;display:none}
#hk-acceso .ar-g.abierto .ar-cu{display:block}
#hk-acceso .ar-f{display:grid;grid-template-columns:1fr 112px;align-items:center;gap:6px;margin:4px 0}
#hk-acceso .ar-f label{color:#cbd5e1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#hk-acceso .ar-f input[type=number],#hk-acceso .ar-f select{width:100%;box-sizing:border-box;background:#0f141b;color:#e2e8f0;border:1px solid #334155;border-radius:4px;padding:2px 4px;font:inherit}
#hk-acceso .ar-f input[type=range]{grid-column:1/3;width:100%;accent-color:${ACENTO};margin:0}
#hk-acceso .ar-bt{display:flex;flex-wrap:wrap;gap:5px;margin-top:6px}
#hk-acceso .ar-nada{color:#94a3b8;font-style:italic;margin:4px 0}
#hk-acceso .ar-mas{margin-top:6px;padding:6px;border:1px dashed #475569;border-radius:5px;display:none}
#hk-acceso .ar-mas.abierto{display:block}
#hk-acceso .ar-mas label{display:block;color:#cbd5e1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#hk-acceso-boton{position:fixed;left:30px;bottom:70px;z-index:90;display:none;font:600 13px system-ui,sans-serif;color:#e2e8f0;
 background:rgba(18,22,30,.94);border:1px solid ${ACENTO};border-radius:8px;padding:6px 10px;cursor:pointer}
@media (max-width:600px){#hk-acceso{left:0;right:0;width:auto;top:auto;bottom:0;max-height:55vh;border-radius:10px 10px 0 0}}
`;

export function montarAccesoRapido(): void {
  if (document.getElementById("hk-acceso")) return;
  const st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
  const el = document.createElement("div"); el.id = "hk-acceso";
  const boton = document.createElement("button"); boton.id = "hk-acceso-boton"; boton.textContent = "⚡ Acceso rápido";
  document.body.append(el, boton);

  let visible = lsGet("visible", window.innerWidth > 600 ? "1" : "0") === "1";
  const fijados = new Set(lsGet("pin", "").split(",").filter(Boolean));
  let abierto = lsGet("abierto", "cargas");
  let ejemplo = "", firma = "";

  const mostrar = (v: boolean) => {
    visible = v; lsSet("visible", v ? "1" : "0");
    el.style.display = v ? "block" : "none"; boton.style.display = v ? "none" : "block";
  };
  boton.onclick = () => mostrar(true);
  w.__hekatanAccesoRapido = (v?: boolean) => mostrar(v ?? !visible);
  // tapado SIN cambiar la preferencia: cuando el panel Settings de la izquierda se abre encima
  let tapado = false;
  w.__hekatanAccesoTapado = (t: boolean) => { tapado = t; el.style.visibility = t ? "hidden" : ""; boton.style.visibility = t ? "hidden" : ""; };

  const defs = (): Record<string, Def> => { try { return w.__hekatanParamDefs?.() ?? {}; } catch { return {}; } };
  const params = (): Record<string, any> => { try { return w.__hekatanGetParams?.() ?? {}; } catch { return {}; } };
  // de serie: lo que más se toca primero (caso, cargas; vanos, pisos, luces, alturas, secciones), hasta 8
  const PRIO = [/caso/i, /^C[MV]\b|muerta|viva|sobrecarga/i, /sismo|^E[xy]\b/i, /^vanos?\b|ejes/i, /piso/i, /luz/i, /\bh\b|altura|entrepiso/i, /columna|col\b/i, /viga/i, /espesor|losa/i];
  const prio = (k: string) => { const l = defs()[k]?.label ?? k; const i = PRIO.findIndex((re) => re.test(l)); return i < 0 ? 99 : i; };
  const elegidos = (g: Grupo, todos: string[]) => {
    const s = lsGet(`sel_${ejemplo}_${g}`, "");
    if (s) return s.split(",").filter((k) => k in defs());
    return [...todos].sort((a, b) => prio(a) - prio(b)).slice(0, 8);
  };

  /** Un mando de PARÁMETRO del ejemplo. */
  function mandoParam(k: string, d: Def): HTMLElement {
    const f = document.createElement("div"); f.className = "ar-f";
    // en el sistema elegido, igual que la fila de Tweakpane de la que es espejo (que se busca por ESA etiqueta)
    const { etq, k: fk } = enSistema(d, d.label ?? k);
    const lab = document.createElement("label"); lab.textContent = etq; lab.title = etq;
    const v0 = params()[k];
    const v = typeof v0 === "number" ? redondo(v0 * fk) : v0;
    const aplicar = (val: number) => {
      const fr = filaReal(etq, "params");
      if (!(fr && escribirFila(fr, d.options ? val : d.boolean ? !!val : val))) w.__hekatanSetParam?.(k, val / fk);
    };
    if (d.options) {
      const s = document.createElement("select");
      for (const [t, n] of Object.entries(d.options)) { const o = document.createElement("option"); o.value = String(n); o.textContent = t; s.appendChild(o); }
      s.value = String(v); s.dataset.k = k; s.onchange = () => aplicar(Number(s.value)); f.append(lab, s);
    } else if (d.boolean) {
      const c = document.createElement("input"); c.type = "checkbox"; c.checked = !!v; c.dataset.k = k;
      c.onchange = () => aplicar(c.checked ? 1 : 0); f.append(lab, c);
    } else if (typeof v === "number") {
      const n = document.createElement("input"); n.type = "number"; n.value = String(v); n.dataset.k = k; n.dataset.fk = String(fk);
      if (d.step) n.step = String(fk === 1 ? d.step : pasoRedondo(d.step * fk));
      n.onchange = () => { const x = Number(n.value); if (isFinite(x)) aplicar(x); };
      f.append(lab, n);
      if (d.min !== undefined && d.max !== undefined) {
        const r = document.createElement("input"); r.type = "range"; r.min = String(d.min * fk); r.max = String(d.max * fk);
        r.step = String(d.step ? (fk === 1 ? d.step : pasoRedondo(d.step * fk)) : ((d.max - d.min) * fk) / 100);
        r.value = String(v); r.dataset.k = k; r.dataset.fk = String(fk);
        r.oninput = () => { n.value = r.value; };
        r.onchange = () => aplicar(Number(r.value));
        f.append(r);
      }
    } else {
      // texto (por ejemplo «ejes X (m, con comas)»): se escribe en la fila real
      const t = document.createElement("input"); t.type = "text"; t.value = String(v ?? ""); t.dataset.k = k;
      Object.assign(t.style, { width: "100%", background: "#0f141b", color: "#e2e8f0", border: "1px solid #334155", borderRadius: "4px" });
      t.onchange = () => { const fr = filaReal(etq, "params"); if (fr) escribirFila(fr, t.value); };
      f.append(lab, t);
    }
    return f;
  }

  /** Un mando de RESULTADO: espejo de una fila de Settings (Case, resultados de barra/cáscara, deformada, escala). */
  function mandoFila(etq: string, rotulo = etq): HTMLElement | null {
    const fr = filaReal(etq, "settings") ?? filaReal(etq); if (!fr) return null;
    const info = leerFila(fr);
    const f = document.createElement("div"); f.className = "ar-f";
    const lab = document.createElement("label"); lab.textContent = rotulo; lab.title = etq;
    if (info.tipo === "lista") {
      const s = document.createElement("select"); s.dataset.fila = etq;
      for (const [v, t] of info.opciones!) { const o = document.createElement("option"); o.value = v; o.textContent = t; s.appendChild(o); }
      s.value = info.valor; s.onchange = () => { const r = filaReal(etq, "settings") ?? filaReal(etq); if (r) escribirFila(r, s.value); };
      f.append(lab, s);
    } else if (info.tipo === "casilla") {
      const c = document.createElement("input"); c.type = "checkbox"; c.checked = info.valor === "1"; c.dataset.fila = etq;
      c.onchange = () => { const r = filaReal(etq, "settings") ?? filaReal(etq); if (r) escribirFila(r, c.checked); };
      f.append(lab, c);
    } else {
      const n = document.createElement("input"); n.type = "number"; n.value = info.valor; n.dataset.fila = etq;
      n.onchange = () => { const r = filaReal(etq, "settings") ?? filaReal(etq); if (r) escribirFila(r, n.value); };
      f.append(lab, n);
    }
    return f;
  }

  function grupo(g: Grupo, titulo: string, tecla: string, cuerpo: (cu: HTMLElement) => void, mas?: (m: HTMLElement) => void): HTMLElement {
    const box = document.createElement("div"); box.className = "ar-g" + (abierto === g || fijados.has(g) ? " abierto" : ""); box.dataset.g = g;
    const t = document.createElement("div"); t.className = "ar-gt";
    t.innerHTML = `<span class="ar-t">${titulo}</span><kbd>Alt+${tecla}</kbd>`;
    const pin = document.createElement("button"); pin.className = "ar-pin" + (fijados.has(g) ? " on" : ""); pin.textContent = "📌";
    pin.title = "Fijar abierto (no se pliega al abrir otro grupo)";
    pin.onclick = (e) => { e.stopPropagation(); fijados.has(g) ? fijados.delete(g) : fijados.add(g); lsSet("pin", [...fijados].join(",")); pintar(); };
    t.appendChild(pin);
    t.onclick = () => abrir(g, !box.classList.contains("abierto"));
    const cu = document.createElement("div"); cu.className = "ar-cu"; cuerpo(cu);
    if (mas) {
      const bm = document.createElement("button"); bm.textContent = "＋ elegir mandos"; bm.style.marginTop = "6px";
      const m = document.createElement("div"); m.className = "ar-mas"; mas(m);
      bm.onclick = () => m.classList.toggle("abierto");
      cu.append(bm, m);
    }
    box.append(t, cu);
    return box;
  }

  function abrir(g: Grupo, si = true) {
    abierto = si ? g : (abierto === g ? "" : abierto); lsSet("abierto", abierto);
    el.querySelectorAll<HTMLElement>(".ar-g").forEach((b) => {
      const k = b.dataset.g as Grupo;
      b.classList.toggle("abierto", (si && k === g) || fijados.has(k) || (!si && k !== g && b.classList.contains("abierto")));
    });
  }

  function pintar() {
    const D = defs(), claves = Object.keys(D);
    const por: Record<Grupo, string[]> = { cargas: [], dim: [], res: [] };
    for (const k of claves) { const g = grupoDe(k, D[k]); if (g) por[g].push(k); }
    el.innerHTML = "";
    const cab = document.createElement("div"); cab.className = "ar-cab";
    cab.innerHTML = `<span>⚡ Acceso rápido</span><span class="ar-esp"></span>`;
    const bTodos = document.createElement("button"); bTodos.textContent = "☰"; bTodos.title = "Todos los parámetros (panel completo de la derecha)";
    bTodos.onclick = () => w.__hekatanPaneles?.("params");
    const bAj = document.createElement("button"); bAj.textContent = "⚙"; bAj.title = "Ajustes completos (panel de la izquierda)";
    bAj.onclick = () => w.__hekatanPaneles?.("settings");
    const bCinta = document.createElement("button"); bCinta.textContent = "★"; bCinta.title = "Personalizar la cinta (añadir cualquier mando o botón)";
    bCinta.onclick = () => (document.querySelector<HTMLButtonElement>('button[title^="Añadir a la cinta"]'))?.click();
    const bX = document.createElement("button"); bX.textContent = "—"; bX.title = "Ocultar (Alt+Q)"; bX.onclick = () => mostrar(false);
    cab.append(bTodos, bAj, bCinta, bX);
    el.appendChild(cab);

    const masDe = (g: Grupo) => (m: HTMLElement) => {
      const todos = claves.filter((k) => !RE_FUERA.test(D[k].folder ?? ""));
      const sel = new Set(elegidos(g, por[g]));
      for (const k of todos) {
        const l = document.createElement("label"); const c = document.createElement("input"); c.type = "checkbox"; c.checked = sel.has(k);
        c.onchange = () => { c.checked ? sel.add(k) : sel.delete(k); lsSet(`sel_${ejemplo}_${g}`, [...sel].join(",") || "-"); pintar(); };
        l.append(c, " " + (D[k].label ?? k)); m.appendChild(l);
      }
    };
    const cuerpoParams = (g: Grupo, vacio: string) => (cu: HTMLElement) => {
      const ks = elegidos(g, por[g]);
      if (!ks.length) { const p = document.createElement("div"); p.className = "ar-nada"; p.textContent = vacio; cu.appendChild(p); return; }
      for (const k of ks) { const fr = filaReal(D[k].label ?? k, "params"); if (fr && oculta(fr)) continue; cu.appendChild(mandoParam(k, D[k])); }
    };
    el.appendChild(grupo("cargas", "CARGAS", "1", (cu) => {
      const c = mandoFila("Case", "Caso / patrón"); if (c) cu.appendChild(c);
      cuerpoParams("cargas", claves.length ? "Este ejemplo no tiene cargas como parámetro." : "El modelo trae sus cargas del archivo: elija el caso.")(cu);
    }, claves.length ? masDe("cargas") : undefined));
    el.appendChild(grupo("dim", "DIMENSIONES", "2",
      cuerpoParams("dim", claves.length ? "Este ejemplo no tiene dimensiones como parámetro." : "Modelo importado: la geometría es la del archivo (se edita en el CAD)."),
      claves.length ? masDe("dim") : undefined));
    el.appendChild(grupo("res", "RESULTADOS", "3", (cu) => {
      for (const [e, r] of FILAS_RES) {
        const m = mandoFila(e, r); if (m) cu.appendChild(m);
      }
      const bt = document.createElement("div"); bt.className = "ar-bt";
      const accion = (rot: string, real: string) => {
        const b = document.createElement("button"); b.textContent = rot;
        b.onclick = () => { const r = botonReal(real); if (r) r.click(); else b.disabled = true; };
        bt.appendChild(b);
      };
      const casilla = (rot: string, etq: string) => {
        const b = document.createElement("button"); b.textContent = rot;
        b.onclick = () => { const r = filaReal(etq); if (r) { const ck = r.querySelector<HTMLInputElement>("input[type=checkbox]"); if (ck) ck.click(); } };
        bt.appendChild(b);
      };
      accion("▶ Modal", "Correr modal + animar");
      accion("📐 Estático", "Análisis estático (solo)");
      accion("〰 Dinámico", "Análisis dinámico (solo)");
      accion("📉 Deriva de piso", "Deriva de piso (sola)");
      casilla("🎯 CM/CR", "🎯 Planta CM/CR en vivo");
      casilla("⚖ 4 jueces", "⚖ 4 jueces en vivo");
      accion("📋 Tabla por piso", "Tabla por piso y planta CM/CR");
      cu.appendChild(bt);
    }));
    firma = JSON.stringify(params());
  }

  /** Mantiene los valores al día (otro panel, el CAD o un enlace pueden cambiarlos). */
  function colocar() {
    const c = document.getElementById("hk-ribbon"), rc = c?.getBoundingClientRect();
    const top = rc && rc.height > 0 && getComputedStyle(c!).display !== "none" ? Math.max(100, Math.round(rc.bottom) + 8) : 100;
    if (el.style.top !== top + "px") { el.style.top = top + "px"; el.style.maxHeight = `calc(100vh - ${top + 70}px)`; }
  }
  function refrescar() {
    colocar();
    if (!visible || tapado) return;
    const id = String(w.__hekatanExample?.() ?? "");
    const nDefs = Object.keys(defs()).length;
    const nRes = String(nFilasRes());
    if (id !== ejemplo || el.dataset.n !== String(nDefs) || el.dataset.r !== nRes) { ejemplo = id; el.dataset.n = String(nDefs); el.dataset.r = nRes; pintar(); return; }
    const P = params(), f = JSON.stringify(P);
    const activo = document.activeElement;
    if (f !== firma) {
      firma = f;
      // un parámetro puede esconder o mostrar otros (hiddenIf): se repinta, salvo que el usuario esté escribiendo aquí
      if (!el.contains(activo)) { setTimeout(pintar, 300); return; }
      el.querySelectorAll<HTMLInputElement | HTMLSelectElement>("[data-k]").forEach((i) => {
        if (i === activo) return; const v = P[i.dataset.k!];
        const fk = Number(i.dataset.fk ?? 1) || 1;
        if (i instanceof HTMLInputElement && i.type === "checkbox") i.checked = !!v; else i.value = String(typeof v === "number" ? redondo(v * fk) : v ?? "");
      });
    }
    el.querySelectorAll<HTMLInputElement | HTMLSelectElement>("[data-fila]").forEach((i) => {
      if (i === activo) return; const r = filaReal(i.dataset.fila!, "settings") ?? filaReal(i.dataset.fila!); if (!r) return;
      const info = leerFila(r);
      if (i instanceof HTMLSelectElement && info.opciones && i.options.length !== info.opciones.length) { pintar(); return; }
      if (i instanceof HTMLInputElement && i.type === "checkbox") i.checked = info.valor === "1"; else if (i.value !== info.valor) i.value = info.valor;
    });
  }
  setInterval(refrescar, 900);
  // al cambiar de sistema de unidades, etiquetas y valores nuevos (antes se quedaban los del sistema anterior)
  window.addEventListener("hk:unidades", () => setTimeout(pintar, 60));

  // en CAPTURA y por e.code: la línea de órdenes del CAD se queda con las teclas sueltas
  window.addEventListener("keydown", (e) => {
    if (!e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.code === "KeyQ") { e.preventDefault(); e.stopPropagation(); mostrar(!visible); return; }
    const g = ({ Digit1: "cargas", Digit2: "dim", Digit3: "res" } as Record<string, Grupo>)[e.code];
    if (g) { e.preventDefault(); e.stopPropagation(); if (!visible) mostrar(true); abrir(g, true); }
  }, true);

  mostrar(visible);
  setTimeout(() => { ejemplo = String(w.__hekatanExample?.() ?? ""); el.dataset.n = String(Object.keys(defs()).length); pintar(); }, 1500);
}
