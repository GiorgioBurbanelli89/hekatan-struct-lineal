/**
 * «▾ Añadir a la cinta» — la cinta de acceso rápido se completa con lo que uno usa.
 *
 * Jorge (13-sep-2026): «se supone que debe haber aquí TODAS las funciones de Hekatan
 * Struct: una flecha para agregar los comandos que usamos por defecto y que están en el
 * Tweakpane de dibujo CAD, etc., excepto los de slider; o al presionar el botón se abre
 * un slider». «Todo ese menú son acceso rápido».
 *
 * Cómo: al abrir la flecha se recorren las carpetas del panel de la derecha (Tweakpane)
 * y del panel Settings de la izquierda, y se listan sus BOTONES y sus MANDOS (sliders,
 * casillas, listas) por carpeta, cada uno con una casilla. Lo marcado aparece en la
 * cinta, en el grupo «Mis accesos», y se recuerda (localStorage `hk_ribbon_extra`).
 *
 *   · Un botón añadido hace clic en el botón real del panel (aunque el panel esté
 *     recogido: el elemento existe igual).
 *   · Un mando añadido es un botón que DESPLIEGA el mando REAL: la fila entera de
 *     Tweakpane se mueve a un desplegable bajo la cinta y vuelve a su sitio al
 *     cerrarlo. Así el slider conserva su mínimo, máximo, paso y su reactividad, sin
 *     copiarlos a mano (los límites no están en el DOM).
 */

interface Entrada { clave: string; tipo: "boton" | "mando"; rotulo: string; carpeta: string; el: HTMLElement; }

const CLAVE_LS = "hk_ribbon_extra";

const textoDe = (e: Element | null) => (e?.textContent || "").replace(/\s+/g, " ").trim();

/** Recorre un panel Tweakpane y devuelve sus botones y mandos con la carpeta a la que pertenecen. */
function recorrer(raiz: HTMLElement, prefijo: string): Entrada[] {
  const out: Entrada[] = [];
  const carpetaDe = (el: Element) => {
    const partes: string[] = [];
    let p: Element | null = el.parentElement;
    while (p && p !== raiz) {
      if (p.classList.contains("tp-fldv")) { const t = textoDe(p.querySelector(":scope > .tp-fldv_b")); if (t) partes.unshift(t); }
      p = p.parentElement;
    }
    return [prefijo, ...partes].filter(Boolean).join(" › ");
  };
  raiz.querySelectorAll<HTMLElement>(".tp-btnv_b").forEach((b) => {
    const rot = textoDe(b); if (!rot) return;
    const carpeta = carpetaDe(b);
    out.push({ clave: carpeta + "|" + rot, tipo: "boton", rotulo: rot, carpeta, el: b });
  });
  raiz.querySelectorAll<HTMLElement>(".tp-lblv").forEach((fila) => {
    const rot = textoDe(fila.querySelector(".tp-lblv_l")); if (!rot) return;
    if (fila.closest(".tp-btnv")) return;
    const carpeta = carpetaDe(fila);
    out.push({ clave: carpeta + "|" + rot, tipo: "mando", rotulo: rot, carpeta, el: fila });
  });
  return out;
}

function leerGuardado(): string[] {
  try { const v = JSON.parse(localStorage.getItem(CLAVE_LS) || "[]"); return Array.isArray(v) ? v.filter((x) => typeof x === "string") : []; } catch { return []; }
}
function guardar(claves: string[]) { try { localStorage.setItem(CLAVE_LS, JSON.stringify(claves)); } catch {} }

export interface ExtrasOpts {
  /** Dónde va el botón «▾» (fila de arriba de la cinta). */
  filaBoton: HTMLElement;
  /** Dónde va el grupo «Mis accesos» (fila de abajo). */
  filaGrupo: HTMLElement;
  /** El elemento de la cinta, para colgar los desplegables debajo. */
  barra: HTMLElement;
  /** Los paneles a recorrer: [prefijo, elemento]. Se resuelven al abrir (pueden montarse después). */
  paneles: () => Array<[string, HTMLElement | null]>;
  decir?: (msg: string) => void;
}

export function montarExtras(o: ExtrasOpts) {
  // ── el grupo «Mis accesos» ────────────────────────────────────────────────
  const caja = document.createElement("div");
  caja.id = "hk-ribbon-extras";
  caja.style.cssText = "display:none;flex-direction:column;align-items:center;padding:0 7px;";
  const fila = document.createElement("div");
  fila.style.cssText = "display:flex;gap:3px;";
  const rot = document.createElement("div");
  rot.textContent = "Mis accesos";
  rot.style.cssText = "font-size:9px;color:#64748b;margin-top:2px;letter-spacing:.4px";
  caja.append(fila, rot);
  const sep = document.createElement("div");
  sep.style.cssText = "display:none;width:1px;background:#1e3a4a;margin:4px 0;";
  o.filaGrupo.append(sep, caja);

  // ── el desplegable de un MANDO: la fila real de Tweakpane, prestada ───────
  let abierto: { pop: HTMLElement; hueco: HTMLElement; filaTp: HTMLElement } | null = null;
  const cerrarMando = () => {
    if (!abierto) return;
    abierto.hueco.replaceWith(abierto.filaTp);
    abierto.pop.remove(); abierto = null;
  };
  const abrirMando = (e: Entrada, ancla: HTMLElement) => {
    if (abierto && abierto.filaTp === e.el) { cerrarMando(); return; }
    cerrarMando(); cerrarLista();
    const hueco = document.createElement("div"); hueco.style.display = "none";
    e.el.replaceWith(hueco);
    const pop = document.createElement("div");
    pop.className = "tp-dfwv";   // hereda el tema de Tweakpane
    pop.style.cssText = "position:absolute;z-index:80;min-width:260px;padding:8px 10px;background:rgba(15,23,42,.97);" +
      "border:1px solid #1e3a4a;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,.5);font-family:system-ui,sans-serif;";
    const tit = document.createElement("div");
    tit.textContent = e.carpeta + " › " + e.rotulo;
    tit.style.cssText = "font-size:10px;color:#94a3b8;margin-bottom:6px;";
    pop.append(tit, e.el);
    const rb = o.barra.getBoundingClientRect(), ra = ancla.getBoundingClientRect();
    pop.style.left = Math.max(0, ra.left - rb.left) + "px";
    pop.style.top = (rb.height + 6) + "px";
    o.barra.appendChild(pop);
    abierto = { pop, hueco, filaTp: e.el };
  };

  // ── pintar los accesos guardados ───────────────────────────────────────────
  let entradas: Entrada[] = [];
  const descubrir = () => {
    entradas = [];
    for (const [pref, el] of o.paneles()) if (el) entradas.push(...recorrer(el, pref));
    return entradas;
  };
  const pintar = () => {
    fila.innerHTML = "";
    const claves = leerGuardado();
    if (!entradas.length) descubrir();
    let n = 0;
    for (const c of claves) {
      const e = entradas.find((x) => x.clave === c); if (!e) continue;
      const b = document.createElement("button");
      b.type = "button";
      b.title = (e.tipo === "boton" ? "Botón: " : "Mando (despliega el control): ") + e.carpeta + " › " + e.rotulo;
      b.style.cssText = "display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;" +
        "width:48px;height:44px;cursor:pointer;background:transparent;border:1px solid transparent;border-radius:7px;color:#cbd5e1;font-family:inherit;";
      const corto = e.rotulo.replace(/^[^\wÁ-ú]+\s*/u, "").slice(0, 9);
      b.innerHTML = `<span style="font-size:15px;line-height:1">${e.tipo === "boton" ? "▸" : "≡"}</span>` +
        `<span style="font-size:9px;line-height:1.1;white-space:nowrap">${corto}</span>` +
        `<span style="font-size:8px;opacity:.55;line-height:1">${e.tipo === "boton" ? "" : "slider"}</span>`;
      b.addEventListener("mouseenter", () => { b.style.background = "rgba(34,211,238,.13)"; });
      b.addEventListener("mouseleave", () => { b.style.background = "transparent"; });
      b.addEventListener("click", () => {
        if (e.tipo === "boton") { (e.el as HTMLButtonElement).click(); o.decir?.(`${e.rotulo} (${e.carpeta})`); }
        else abrirMando(e, b);
      });
      fila.appendChild(b); n++;
    }
    caja.style.display = n ? "flex" : "none"; sep.style.display = n ? "block" : "none";
  };

  // ── la lista con casillas («▾») ────────────────────────────────────────────
  let lista: HTMLElement | null = null;
  const cerrarLista = () => { lista?.remove(); lista = null; };
  const abrirLista = () => {
    if (lista) { cerrarLista(); return; }
    cerrarMando();
    descubrir();
    const claves = new Set(leerGuardado());
    lista = document.createElement("div");
    lista.id = "hk-ribbon-extras-lista";
    lista.style.cssText = "position:absolute;right:0;z-index:80;width:420px;max-height:420px;overflow:auto;padding:8px 10px;" +
      "background:rgba(15,23,42,.97);border:1px solid #1e3a4a;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,.5);" +
      "font:12px system-ui,sans-serif;color:#cbd5e1;";
    lista.style.top = (o.barra.getBoundingClientRect().height + 6) + "px";
    const cab = document.createElement("div");
    cab.style.cssText = "display:flex;align-items:center;gap:8px;margin-bottom:6px;";
    cab.innerHTML = `<b style="color:#22d3ee">Añadir a la cinta</b><span style="color:#64748b;font-size:11px">marcá lo que usás; los mandos se despliegan al pulsarlos</span>`;
    const buscar = document.createElement("input");
    buscar.type = "text"; buscar.placeholder = "buscar…";
    buscar.style.cssText = "margin-left:auto;width:120px;height:22px;background:#0a1622;border:1px solid #1e3a4a;border-radius:5px;color:#cdeefb;font:11px inherit;padding:0 6px;outline:none;";
    cab.appendChild(buscar);
    const cuerpo = document.createElement("div");
    lista.append(cab, cuerpo);
    const render = () => {
      cuerpo.innerHTML = "";
      const q = buscar.value.trim().toLowerCase();
      const porCarpeta = new Map<string, Entrada[]>();
      for (const e of entradas) {
        if (q && !(e.rotulo + " " + e.carpeta).toLowerCase().includes(q)) continue;
        (porCarpeta.get(e.carpeta) ?? porCarpeta.set(e.carpeta, []).get(e.carpeta)!).push(e);
      }
      for (const [carpeta, items] of porCarpeta) {
        const h = document.createElement("div");
        h.textContent = carpeta;
        h.style.cssText = "font-size:10px;color:#7f96b3;margin:8px 0 3px;letter-spacing:.4px;text-transform:uppercase;";
        cuerpo.appendChild(h);
        for (const e of items) {
          const l = document.createElement("label");
          l.style.cssText = "display:flex;align-items:center;gap:7px;padding:2px 4px;border-radius:4px;cursor:pointer;";
          const ck = document.createElement("input"); ck.type = "checkbox"; ck.checked = claves.has(e.clave);
          ck.addEventListener("change", () => {
            const c = leerGuardado();
            const nuevo = ck.checked ? [...c.filter((x) => x !== e.clave), e.clave] : c.filter((x) => x !== e.clave);
            guardar(nuevo); claves.clear(); nuevo.forEach((x) => claves.add(x)); pintar();
          });
          const t = document.createElement("span");
          t.innerHTML = `${e.tipo === "boton" ? "▸" : "≡"} ${e.rotulo}` + (e.tipo === "mando" ? ` <span style="color:#64748b;font-size:10px">(mando)</span>` : "");
          l.append(ck, t);
          l.addEventListener("mouseenter", () => { l.style.background = "rgba(34,211,238,.10)"; });
          l.addEventListener("mouseleave", () => { l.style.background = "transparent"; });
          cuerpo.appendChild(l);
        }
      }
      if (!porCarpeta.size) { const v = document.createElement("div"); v.textContent = "nada que mostrar (¿el panel todavía no está montado?)"; v.style.color = "#64748b"; cuerpo.appendChild(v); }
    };
    buscar.addEventListener("input", render);
    render();
    o.barra.appendChild(lista);
    buscar.focus();
  };

  const bMas = document.createElement("button");
  bMas.type = "button"; bMas.id = "hk-ribbon-mas";
  bMas.textContent = "▾";
  bMas.title = "Añadir a la cinta: cualquier botón o mando de los paneles (acceso rápido)";
  bMas.style.cssText = "width:26px;height:26px;margin-left:4px;cursor:pointer;background:transparent;border:1px solid #22d3ee;" +
    "border-radius:6px;color:#22d3ee;font:600 13px inherit;align-self:center;";
  bMas.addEventListener("click", abrirLista);
  o.filaBoton.appendChild(bMas);

  // Cerrar con Esc o clic fuera
  document.addEventListener("keydown", (ev) => { if (ev.key === "Escape") { cerrarLista(); cerrarMando(); } });
  document.addEventListener("pointerdown", (ev) => {
    const t = ev.target as Node;
    if (lista && !lista.contains(t) && t !== bMas) cerrarLista();
    if (abierto && !abierto.pop.contains(t) && !o.barra.contains(t)) cerrarMando();
  }, { capture: true });

  // Los paneles se montan después que la cinta: se reintenta hasta encontrarlos.
  let intentos = 0;
  const reintentar = () => { descubrir(); pintar(); if (!entradas.length && intentos++ < 20) setTimeout(reintentar, 500); };
  setTimeout(reintentar, 300);
  return { pintar, abrirLista };
}
