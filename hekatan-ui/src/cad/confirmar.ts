/**
 * Cuadro de confirmación DENTRO de la app (17-oct-2026). El `confirm()` nativo del navegador no se ve
 * como el programa (ETABS y Revit usan su propio cuadro), bloquea la página y en algunos navegadores
 * —el panel de vista previa, una grabación— viene desactivado y devuelve `false` sin enseñar nada:
 * «➕ Nuevo» no hacía nada.  Enter = Aceptar, Esc = Cancelar.
 */
export function confirmar(texto: string, aceptar = "Aceptar", cancelar = "Cancelar"): Promise<boolean> {
  return new Promise((resolver) => {
    const fondo = document.createElement("div");
    fondo.id = "hk-confirmar";
    fondo.style.cssText = "position:fixed;inset:0;z-index:2147483000;background:rgba(2,6,23,.55);display:flex;align-items:center;justify-content:center";
    const caja = document.createElement("div");
    caja.setAttribute("role", "dialog");
    caja.style.cssText = "min-width:300px;max-width:440px;background:#0f1b2a;border:1px solid #1e3a4a;border-radius:10px;padding:18px 20px;color:#cdeefb;font:14px system-ui,sans-serif;box-shadow:0 12px 40px rgba(0,0,0,.5)";
    const p = document.createElement("div"); p.textContent = texto; p.style.cssText = "margin-bottom:16px;line-height:1.4";
    const fila = document.createElement("div"); fila.style.cssText = "display:flex;gap:8px;justify-content:flex-end";
    const boton = (t: string, primario: boolean) => { const b = document.createElement("button"); b.type = "button"; b.textContent = t;
      b.style.cssText = `padding:6px 14px;border-radius:6px;cursor:pointer;font:inherit;border:1px solid ${primario ? "#22d3ee" : "#334155"};background:${primario ? "#0e7490" : "transparent"};color:#e2f6fd`; return b; };
    const bNo = boton(cancelar, false), bSi = boton(aceptar, true);
    fila.append(bNo, bSi); caja.append(p, fila); fondo.append(caja); document.body.append(fondo);
    const fin = (v: boolean) => { document.removeEventListener("keydown", tecla, true); fondo.remove(); resolver(v); };
    const tecla = (e: KeyboardEvent) => { if (e.key === "Enter") { e.preventDefault(); e.stopPropagation(); fin(true); } else if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); fin(false); } };
    document.addEventListener("keydown", tecla, true);
    bSi.onclick = () => fin(true); bNo.onclick = () => fin(false);
    fondo.onclick = (e) => { if (e.target === fondo) fin(false); };
    bSi.focus();
  });
}
