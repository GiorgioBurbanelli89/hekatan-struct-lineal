/**
 * Awatif Viewer Theme System
 * Supports dark (default) and light themes.
 */

export type ThemeName = "dark" | "light";

export interface ThemeColors {
  // Three.js scene
  background: number;         // renderer clear color
  grid: number;               // grid lines
  axisArrow: number;          // axis arrow shafts
  elementLine: number;        // wireframe elements
  nodePoint: number;          // node points
  resultOutline: string;      // result diagram outline (CSS color)

  // Shell panels (walls / slabs)
  shellWall: number;          // wall panel color (vertical shells)
  shellSlab: number;          // slab panel color (horizontal shells)
  shellTri: number;           // triangle shell color
  shellOpacity: number;       // shell panel opacity

  // Text (canvas-based)
  textColor: string;          // default text color
  textBackground: string;     // default text background

  // CSS
  legendMarker: string;       // legend tick & text color
}

const DARK: ThemeColors = {
  // Hekatan Acero. El fondo y la rejilla siguen la relacion del area de dibujo
  // de AutoCAD (registro, Drawing Window): un fondo casi negro con tinte azul y
  // una rejilla dos escalones por encima, no un gris neutro.
  background: 0x0e1116,
  // ⚠️ Subida el 9-sep-2026 de 0x2c3647 a 0x44546e. Con la anterior, la línea de
  // rejilla quedaba a 25 puntos del fondo (0x0e1116) y con 1 píxel de ancho no se
  // veía: el lienzo parecía VACÍO y no había sobre qué referenciarse para poner el
  // primer punto. AutoCAD pone su rejilla dos escalones por encima del fondo, no
  // uno.
  grid: 0x44546e,
  axisArrow: 0x888888,
  elementLine: 0xffffff,
  nodePoint: 0xffffff,
  resultOutline: "white",
  shellWall: 0xcc6622,     // warm brown-orange
  shellSlab: 0x4488cc,     // cool blue
  shellTri: 0x66aa66,      // green
  shellOpacity: 0.35,
  textColor: "#bbbcc4",
  textBackground: "#0d0d0d",
  legendMarker: "white",
};

const LIGHT: ThemeColors = {
  // El claro NO es el oscuro invertido: invertir da grises sucios y se pierde
  // el texto pequeno. Sale del LightTheme.xbel, que es un blanco frio.
  background: 0xf4f6f9,
  grid: 0xb9c0d0,
  axisArrow: 0x444444,
  elementLine: 0x111111,
  nodePoint: 0x111111,
  resultOutline: "#222",
  shellWall: 0x994411,     // darker brown for light bg
  shellSlab: 0x2266aa,     // darker blue for light bg
  shellTri: 0x448844,      // darker green
  shellOpacity: 0.30,
  textColor: "#111111",
  textBackground: "#e8e8e8",
  legendMarker: "#222",
};

const THEMES: Record<ThemeName, ThemeColors> = { dark: DARK, light: LIGHT };

// ---- singleton state ----
let _current: ThemeName = "dark";
const _listeners: Array<(t: ThemeName, c: ThemeColors) => void> = [];

export function getThemeName(): ThemeName {
  return _current;
}

export function getTheme(): ThemeColors {
  return THEMES[_current];
}

export function setTheme(name: ThemeName): void {
  if (name === _current) return;
  _current = name;
  const colors = THEMES[name];
  for (const fn of _listeners) fn(name, colors);
}

export function toggleTheme(): ThemeName {
  const next: ThemeName = _current === "dark" ? "light" : "dark";
  setTheme(next);
  return next;
}

export function onThemeChange(fn: (t: ThemeName, c: ThemeColors) => void): () => void {
  _listeners.push(fn);
  return () => {
    const idx = _listeners.indexOf(fn);
    if (idx >= 0) _listeners.splice(idx, 1);
  };
}
