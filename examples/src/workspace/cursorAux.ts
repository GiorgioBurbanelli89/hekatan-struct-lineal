/**
 * Cursor auxiliar: un puntero DIBUJADO encima de la página.
 *
 * El cursor del sistema no sale en las capturas de pantalla ni en la
 * automatización por DevTools, así que al enseñar la app (un LIVE, un tutorial,
 * una verificación con el navegador) no se ve dónde se está pulsando. Este
 * dibuja un círculo que sigue al ratón de verdad y que también se puede mover
 * por código, con un halo al hacer clic.
 *
 * Se enciende con `?cursor=1` en la URL, o desde la consola:
 *     window.__hkCursorAux(true)      // encender
 *     window.__hkCursor(x, y)         // moverlo
 *     window.__hkClic(x, y)           // moverlo y marcar el clic
 */
const ID = "hk-cursor-aux";

function crear(): HTMLDivElement {
  const c = document.createElement("div");
  c.id = ID;
  c.style.cssText = [
    "position:fixed", "left:0", "top:0", "z-index:2147483647", "pointer-events:none",
    "width:34px", "height:34px", "margin:-17px 0 0 -17px",
    "transition:transform .18s ease-out",
  ].join(";");
  c.innerHTML =
    '<svg width="34" height="34" viewBox="0 0 34 34">' +
    '<circle cx="17" cy="17" r="15" fill="none" stroke="#ffb547" stroke-width="2" opacity=".9"/>' +
    '<circle cx="17" cy="17" r="3.5" fill="#ffb547"/>' +
    '<circle class="hk-halo" cx="17" cy="17" r="3" fill="none" stroke="#ffb547" stroke-width="2" opacity="0"/>' +
    "</svg>";
  document.body.appendChild(c);
  return c;
}

export function cursorAux(encender = true): void {
  const viejo = document.getElementById(ID);
  if (!encender) { viejo?.remove(); return; }
  const c = (viejo as HTMLDivElement) ?? crear();

  const mover = (x: number, y: number) => { c.style.transform = `translate(${x}px,${y}px)`; };
  const clic = (x: number, y: number) => {
    mover(x, y);
    const h = c.querySelector(".hk-halo") as SVGCircleElement | null;
    if (!h) return;
    const t0 = performance.now();
    const paso = () => {
      const k = Math.min(1, (performance.now() - t0) / 480);
      h.setAttribute("r", String(3 + 14 * k));
      h.setAttribute("opacity", String(0.9 * (1 - k)));
      if (k < 1) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  };

  (window as any).__hkCursor = mover;
  (window as any).__hkClic = clic;
  addEventListener("mousemove", (e) => mover(e.clientX, e.clientY), true);
  addEventListener("mousedown", (e) => clic(e.clientX, e.clientY), true);
  mover(innerWidth / 2, innerHeight / 2);
}

(window as any).__hkCursorAux = cursorAux;
if (new URLSearchParams(location.search).get("cursor") === "1") {
  if (document.body) cursorAux(true);
  else addEventListener("DOMContentLoaded", () => cursorAux(true));
}
