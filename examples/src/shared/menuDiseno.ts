/**
 * Botón «📐 Diseño» de la barra de arriba (junto a Tutorial). Reúne las herramientas de diseño
 * en UN menú que explica cada una, en vez de botones sueltos flotando encima de los paneles
 * (Jorge, 19-sep-2026: «esos botones se ponen encima… mejor un botón explicativo de diseño»).
 * Cada panel registra su entrada con `registrarDiseno`; el botón real del panel queda oculto.
 */
type Entrada = { id: string; icono: string; titulo: string; detalle: string; abrir: () => void; orden: number };
const entradas: Entrada[] = [];

export function registrarDiseno(e: Entrada): void {
  if (entradas.some((x) => x.id === e.id)) return;
  entradas.push(e); entradas.sort((a, b) => a.orden - b.orden);
  montar();
}

function montar(): void {
  if (document.getElementById("hk-diseno-btn")) return;
  const der = document.querySelector("#hk-cad-tit .der");
  if (!der) { setTimeout(montar, 400); return; }   // la barra de arriba aún no está
  const btn = document.createElement("button");
  btn.id = "hk-diseno-btn"; btn.className = "piel tut"; btn.textContent = "📐 Diseño";
  btn.title = "Herramientas de diseño: losas (franjas / elementos finitos) y cargas muertas NEC-15";
  der.insertBefore(btn, der.firstChild);
  const menu = document.createElement("div");
  menu.id = "hk-diseno-menu";
  menu.style.cssText = "position:fixed;z-index:1000;display:none;width:360px;background:rgba(24,28,34,.98);color:#e8e8e8;border:1px solid #4a7fb0;border-radius:6px;font:12px sans-serif;padding:6px;box-shadow:0 6px 18px rgba(0,0,0,.4)";
  document.body.appendChild(menu);
  const pintar = () => {
    menu.innerHTML = '<div style="padding:2px 6px 6px;color:#9cc">Diseño — elige qué hacer:</div>' + entradas.map((e) =>
      `<div data-id="${e.id}" style="padding:6px 8px;border-radius:4px;cursor:pointer"><b>${e.icono} ${e.titulo}</b><div style="opacity:.75;margin-top:2px">${e.detalle}</div></div>`).join("");
    menu.querySelectorAll<HTMLDivElement>("[data-id]").forEach((d) => {
      d.onmouseenter = () => (d.style.background = "#1f3b5a"); d.onmouseleave = () => (d.style.background = "");
      d.onclick = () => { menu.style.display = "none"; entradas.find((x) => x.id === d.dataset.id)?.abrir(); };
    });
  };
  btn.onclick = (ev) => {
    ev.stopPropagation();
    if (menu.style.display === "block") { menu.style.display = "none"; return; }
    pintar(); const r = btn.getBoundingClientRect();
    menu.style.top = r.bottom + 4 + "px"; menu.style.left = Math.max(8, Math.min(r.left, innerWidth - 370)) + "px";
    menu.style.display = "block";
  };
  document.addEventListener("click", (ev) => { if (!menu.contains(ev.target as Node) && ev.target !== btn) menu.style.display = "none"; });
}
