import { i, c as l, h as d, r as T, t as h } from "./cadSections-CEHEfdGW.js";
const r = { "Perfil I / W": 0, "Rectangular maciza": 1, "Tubo rectangular": 2, "Circular maciza": 3 };
function S(a = "Secciones", c = {}) {
  const t = c.prefijo ?? "sec", e = (n, s, m, u, o) => ({ default: s, min: m, max: u, step: o, label: n, folder: a });
  return { [`${t}Forma`]: { default: c.forma ?? r["Perfil I / W"], options: { ...r }, label: "Forma", folder: a }, [`${t}H`]: e("Canto h (mm)", c.h ?? 160, 20, 2e3, 5), [`${t}B`]: e("Ancho b / ala (mm)", c.bf ?? c.b ?? 82, 10, 1e3, 2), [`${t}Tf`]: e("Espesor ala tf (mm)", c.tf ?? 7.4, 1, 100, 0.2), [`${t}Tw`]: e("Espesor alma tw (mm)", c.tw ?? 5, 1, 100, 0.2), [`${t}T`]: e("Espesor pared t (mm)", c.t ?? 5, 0.5, 60, 0.5), [`${t}D`]: e("Di\xE1metro D (mm)", c.d ?? 200, 10, 2e3, 5) };
}
function b(a, c = "sec") {
  const t = ($) => ($ ?? 0) / 1e3, e = t(a[`${c}H`]), n = t(a[`${c}B`]), s = t(a[`${c}Tf`]), m = t(a[`${c}Tw`]), u = t(a[`${c}T`]), o = t(a[`${c}D`]);
  switch (Math.round(a[`${c}Forma`] ?? 0)) {
    case r["Rectangular maciza"]:
      return T(n, e);
    case r["Tubo rectangular"]:
      return d(n, e, u);
    case r["Circular maciza"]:
      return l(o);
    default:
      return i(n, e, s, m);
  }
}
function g(a, c = "sec") {
  const t = ($) => ($ ?? 0) / 1e3, e = t(a[`${c}H`]), n = t(a[`${c}B`]), s = t(a[`${c}Tf`]), m = t(a[`${c}Tw`]), u = t(a[`${c}T`]), o = t(a[`${c}D`]);
  switch (Math.round(a[`${c}Forma`] ?? 0)) {
    case r["Rectangular maciza"]:
      return { type: "rect", b: n, h: e };
    case r["Tubo rectangular"]:
      return { type: "HSS", b: n, h: e, tw: u, tf: u };
    case r["Circular maciza"]:
      return { type: "circ", d: o };
    default:
      return { type: "I", b: n, h: e, tf: s, tw: m };
  }
}
function w(a, c = "sec") {
  const t = (s) => (s ?? 0).toFixed(s % 1 ? 1 : 0), e = a[`${c}H`], n = a[`${c}B`];
  switch (Math.round(a[`${c}Forma`] ?? 0)) {
    case r["Rectangular maciza"]:
      return `Rect ${t(n)}\xD7${t(e)}`;
    case r["Tubo rectangular"]:
      return `Tubo ${t(n)}\xD7${t(e)}\xD7${t(a[`${c}T`])}`;
    case r["Circular maciza"]:
      return `\xD8 ${t(a[`${c}D`])}`;
    default:
      return `I ${t(e)}\xD7${t(n)}\xD7${t(a[`${c}Tf`])}/${t(a[`${c}Tw`])}`;
  }
}
function f(a, c = "sec") {
  const t = b(a, c), { moiZ: e, moiY: n } = h(t);
  return { Secci\u00F3n: w(a, c), "A (cm\xB2)": (t.A * 1e4).toFixed(2), "I33 fuerte (cm\u2074)": (e * 1e8).toFixed(0), "I22 d\xE9bil (cm\u2074)": (n * 1e8).toFixed(0), "J torsi\xF3n (cm\u2074)": (t.J * 1e8).toFixed(0), "i33 radio giro (cm)": (Math.sqrt(e / t.A) * 100).toFixed(2) };
}
export {
  r as F,
  f as e,
  g as f,
  w as n,
  S as p,
  b as s
};
