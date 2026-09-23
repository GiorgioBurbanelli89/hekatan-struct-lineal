/**
 * Capítulo 31 — Mesa de torsión: la torsión de la viga depende de la malla de la losa.
 *
 *     node cli/tutorial_struct.mjs cap31_mesa_torsion
 *
 * Los números NO se escriben a mano: salen de registros/2026-09-23_torsion_vs_malla.json
 * (cli/estudio_torsion_malla.mjs, el mismo ejemplo del menú; ETABS 22 por OAPI).
 * Voz: cli/guiones/cap31_es.txt · subtítulo: cli/guiones/cap31_en.txt (una línea por paso).
 *
 * Citas: E. L. Wilson, «Análisis Estático y Dinámico de Estructuras», §7.7 (Fig. 7.6,
 * ec. 7.15) págs. 119-120 del PDF y §8.9.5 (Fig. 8.7, Tabla 8.6) págs. 141-142.
 */
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const AQUI = dirname(fileURLToPath(import.meta.url));
const E = JSON.parse(readFileSync(join(AQUI, "..", "..", "registros", "2026-09-23_torsion_vs_malla.json"), "utf-8"));
const M = (n) => E.mallas.find((m) => m.n === n);
const f2 = (x) => x.toFixed(2), f3 = (x) => x.toFixed(3);

export const titulo = "Mesa de torsión · la torsión de la viga depende de la malla";
export const ruta = "workspace/?t=mesa-torsion";

const Z = 4, L = 6;
const V = (x) => [x, 0, Z];                         // viga sur, y = 0
const nudosViga = (n) => Array.from({ length: n + 1 }, (_, i) => ({ en: V(i * L / n), color: "#34d399", r: 6 }));
const torque = (n, Tu, color = "#ff5d73") => ({
  flechas: [
    { de: V(0.0), a: V(1.3), doble: true, color, texto: `T_u = ${f2(Tu)} tonf·m`, dy: -16 },
    { de: V(L), a: V(L - 1.3), doble: true, color },
  ],
  nudos: nudosViga(n),
  cotas: [{ de: V(0), a: V(L / n), texto: `${f2(L / n)} m`, off: [0, 46] }],
});

/** Pone la malla n y dibuja los nudos que comparten viga y losa + el torque. */
const malla = async (a, n) => {
  await a.sinDibujo(); await a.sinPizarra();
  await a.abrir("Geometría");
  await a.param("Subdiv losa", "nMesh", n, 3500);
  await a.cerrar("Geometría");
  await a.vista("⬇ Planta (X-Y)", 1500);
  const m = M(n);
  await a.dibujo(torque(n, m.Tu));
  await a.pizarra(`Losa ${n}×${n}`, [
    `Nudos que la viga comparte con la losa: ${n + 1}`,
    `T_u (Hekatan) = ${f3(m.Tu)} tonf·m`,
    `T_u (ETABS 22, misma malla) = ${f3(m.etabs.Tu)} tonf·m`,
    `m_borde (centro del borde) = ${f3(m.m_borde)} tonf·m/m`,
    `T₃ = ${m.T3.toFixed(4)} s`,
  ], { lado: "izq", ancho: 400 });
  await a.quieto(12, 300);
};

export const pasos = [
  {
    rotulo: "Portada",
    hacer: async (a) => { await a.portada("Mesa de torsión: la torsión de la viga depende de la malla", "Tutorial 31", 16); },
  },
  {
    rotulo: "1 · La mesa: losa, vigas y columnas",
    hacer: async (a) => {
      await a.general(); await a.quieto(2, 300);
      await a.dibujo({ etiquetas: [
        { en: [3, 3, Z], texto: "Losa: cáscara Shell-Thin, t = 0.10 m", color: "#e8f6fb" },
        { en: V(3), texto: "Viga V30×50 (barra)", color: "#22d3ee", dy: 26 },
        { en: [0, 0, 2], texto: "Columna C40×40", color: "#34d399", anchor: "end", dx: -12 },
        { en: [0, 0, 0], texto: "base articulada", color: "#34d399", anchor: "end", dx: -12, dy: 16 },
      ] }, 14);
    },
  },
  {
    rotulo: "2 · Caso UDCon2 y torsión de las barras",
    hacer: async (a) => {
      await a.sinDibujo();
      await a.abrir("Caso");
      await a.elegir("Caso visualizado", "UDCon2", 5000);
      await a.elegir("Frame results", "Torsion (diagram)", 3000);
      await a.elegir("Shell results", "none", 3000);   // una sola leyenda: la de la torsión
      await a.quieto(6, 300);
    },
  },
  {
    rotulo: "3 · Por qué se tuerce la viga (alzado)",
    hacer: async (a) => {
      await a.vista("→ Elevación X (frente)", 1800);
      await a.dibujo({ flechas: [
        { de: V(0.2), a: V(1.4), doble: true, color: "#ff5d73", texto: "T_u", dy: -16 },
        { de: V(5.8), a: V(4.6), doble: true, color: "#ff5d73", texto: "T_u", dx: -40, dy: -16 },
      ] });
      await a.pizarra("Compatibilidad en el borde", [
        "La losa flexiona y gira en su borde; en cada nudo compartido",
        "$θx (losa) = θx (viga)",
        "La viga recibe ese giro como torsión:",
        "$T = G·J · dθx/dx",
        "La columna restringe el giro en los extremos: allí T es máxima (T_u).",
      ], { lado: "izq", ancho: 410, n: 16 });
      await a.sinPizarra();
    },
  },
  {
    rotulo: "4 · Wilson §7.7: restricción viga–losa",
    hacer: async (a) => {
      await a.pizarra("Wilson §7.7 · Fig. 7.6 · ec. (7.15)", [
        "Nudo i de la losa atado al nudo j de la viga (cuerpo rígido):",
        "$ux(i) = ux(m) + (zi − zm)·θy(m) − (yi − ym)·θz(m)",
        "$θx(i) = θx(m) ,  θy(i) = θy(m) ,  θz(i) = θz(m)",
        "«Para mantener la compatibilidad entre la viga y la losa, podría ser necesario aplicar la restricción […] a varias secciones a lo largo del eje de la viga.»",
        "~E. L. Wilson, Análisis Estático y Dinámico de Estructuras, §7.7, págs. 119-120 (PDF).",
        "~En Hekatan (offsets = 0) viga y losa comparten nudo: la restricción es la igualdad de giros.",
      ], { lado: "centro", ancho: 700, n: 20 });
      await a.sinPizarra();
    },
  },
  {
    rotulo: "5 · Wilson §8.9.5: la torsión la lleva la barra",
    hacer: async (a) => {
      await a.pizarra("Wilson §8.9.5 · Fig. 8.7 · Tabla 8.6", [
        "«No se deben usar los elementos placa para modelar el comportamiento torsional de vigas.»",
        "Voladizo 6.0 × 0.2 × 0.1 con T = 1: DKE da ~68 % del giro de elasticidad (0.034 rad) y no mejora al refinar.",
        "Por eso la viga va como BARRA con su G·J; la losa solo le impone el giro en los nudos compartidos.",
        "~Wilson, §8.9.5, págs. 141-142 (PDF).",
      ], { lado: "centro", ancho: 700, n: 18 });
      await a.sinPizarra(); await a.sinDibujo();
    },
  },
  { rotulo: "6 · Malla 1×1: la viga no se tuerce", hacer: async (a) => { await malla(a, 1); } },
  { rotulo: "7 · Malla 2×2", hacer: async (a) => { await malla(a, 2); } },
  { rotulo: "8 · Malla 4×4", hacer: async (a) => { await malla(a, 4); } },
  { rotulo: "9 · Malla 8×8", hacer: async (a) => { await malla(a, 8); } },
  { rotulo: "10 · Malla 16×16", hacer: async (a) => { await malla(a, 16); } },
  {
    rotulo: "11 · T_u contra la malla (Hekatan y ETABS)",
    hacer: async (a) => {
      await a.sinDibujo();
      await a.pizarra("T_u de la viga (tonf·m) · UDCon2", [
        "n       Hekatan     ETABS 22",
        ...E.mallas.map((m) => `$${String(m.n).padEnd(4)}   ${f3(m.Tu).padStart(7)}     ${f3(m.etabs.Tu).padStart(7)}`),
        "T_u CRECE al refinar y converge. La malla gruesa la SUBESTIMA.",
        "~Hekatan queda +3.7 % sobre ETABS en todas las mallas (diferencia de torsión ya registrada, no de malla).",
      ], { lado: "centro", ancho: 560, n: 22 });
      await a.sinPizarra();
    },
  },
  {
    rotulo: "12 · Viga unida a la losa solo en los extremos",
    hacer: async (a) => {
      await a.abrir("Geometría");
      await a.elegir("Unión viga–losa", "Solo en los extremos", 4000);
      await a.vista("🏗 Isométrica", 1500);
      const s = E.solo_extremos;
      await a.pizarra("Sin nudos compartidos a lo largo de la viga", [
        `T_u = ${f3(s.Tu)} tonf·m: la losa no le impone giro relativo.`,
        `Flecha en el centro de la losa: ${f2(s.flecha)} mm (compatible 16×16: ${f2(M(16).flecha)} mm).`,
        "El borde de la losa queda libre: la losa se apoya solo en las cuatro esquinas.",
      ], { lado: "izq", ancho: 410, n: 16 });
      await a.sinPizarra();
      await a.elegir("Unión viga–losa", "Nudos compartidos", 4000);
      await a.cerrar("Geometría");
    },
  },
  {
    rotulo: "13 · Equilibrio de la viga: dT/dx = m(x)",
    hacer: async (a) => {
      await a.vista("→ Elevación X (frente)", 1500);
      await a.pizarra("Equilibrio de la media viga", [
        "$dT/dx = m(x)   ⇒   T_u = ∫₀^{L/2} m(x) dx",
        "m(x): momento de la losa en su borde (por metro).",
        "n     T_u      −∫m dx    razón",
        ...E.mallas.filter((m) => m.n > 1).map((m) => `$${String(m.n).padEnd(4)} ${f3(m.Tu)}   ${f3(-m.integral_m)}   ${(m.Tu / -m.integral_m).toFixed(3)}`),
        "~La integral usa m en los nudos (promedio de los elementos): con malla gruesa ese m es pobre; a 32×32 cierra al 1 %.",
      ], { lado: "izq", ancho: 410, n: 20 });
      await a.sinPizarra();
    },
  },
  {
    rotulo: "14 · La viga se fisura: compatibilidad y equilibrio",
    hacer: async (a) => {
      const c = E.aci, T16 = M(16).Tu;
      await a.pizarra("Fisuración por torsión", [
        `T_u = ${f2(T16)} tonf·m  >  T_cr = ${f2(c.Tcr)} tonf·m: la viga se fisura.`,
        "Fisurada, su rigidez torsional cae del orden del 85-90 % (SAFE analiza con 0.1·J).",
        "El giro que la viga ya no restringe lo toma la LOSA: el momento se redistribuye y el equilibrio del paño se conserva.",
        "COMPATIBILIDAD: la torsión nace de la continuidad con la losa → se puede reducir a φT_cr (ACI §22.7.3.2).",
        "EQUILIBRIO: la torsión es necesaria para sostener la carga (voladizo sobre la viga) → NO se reduce.",
        "~Reducir J e iterar es una aproximación SECANTE del comportamiento no lineal de la viga fisurada.",
      ], { lado: "centro", ancho: 700, n: 24 });
      await a.sinPizarra();
    },
  },
  {
    rotulo: "15 · ACI 318-19 §22.7.3.2: torsión de compatibilidad",
    hacer: async (a) => {
      const c = E.aci;
      await a.pizarra("ACI 318-19 §22.7.3.2 y §22.7.5.1", [
        "$φT_cr = φ·4λ·√f'c·A_cp²/p_cp",
        `f'c = ${c.fc_psi.toFixed(0)} psi · A_cp = ${c.Acp_in2.toFixed(1)} in² · p_cp = ${c.pcp_in.toFixed(2)} in · φ = 0.75`,
        `$φT_cr = ${f3(c.phiTcr)} tonf·m`,
        "Iteración: J(k+1) = J(k)·φT_cr/T_u(k)  hasta  φT_cr/T_u ≥ 0.95",
        "paso  factor J   T_u     φT_cr/T_u",
        ...E.iteracion_aci.map((s) => `$${s.paso}   ${s.factor_J.toFixed(4)}   ${f3(s.Tu)}   ${f3(s.ratio)}`),
      ], { lado: "centro", ancho: 560, n: 22 });
      await a.sinPizarra();
    },
  },
  {
    rotulo: "16 · Losa en 3D: momento M22 con la viga sin fisurar",
    hacer: async (a) => {
      const c0 = E.agrietada_vs_no[0];
      await a.vista("🏗 Isométrica", 1500);
      await a.elegir("Frame results", "none", 2500);
      await a.elegir("Shell results", "M22", 3500);
      await a.dibujo({ etiquetas: [
        { en: V(3), texto: `m borde = ${f2(c0.m_borde)} tonf·m/m`, color: "#22d3ee", dy: 30 },
        { en: [3, 3, Z], texto: `m centro = +${f2(c0.m_centro)}`, color: "#e8f6fb", dy: -14 },
      ] }, 16);
      await a.sinDibujo();
    },
  },
  {
    rotulo: "17 · J reducida: la losa toma el momento",
    hacer: async (a) => {
      const i0 = E.iteracion_aci[0], iN = E.iteracion_aci[E.iteracion_aci.length - 1];
      await a.sinPizarra();
      await a.abrir("Secciones");
      await a.param("Factor J vigas", "factorJ", iN.factor_J, 3500);
      await a.cerrar("Secciones");
      await a.dibujo({ etiquetas: [
        { en: V(3), texto: `m borde: ${f2(i0.m_borde)} → ${f2(iN.m_borde)} tonf·m/m`, color: "#22d3ee", dy: 30 },
        { en: [3, 3, Z], texto: `m centro: +${f2(i0.m_centro)} → +${f2(iN.m_centro)}`, color: "#e8f6fb", dy: -14 },
      ] });
      await a.pizarra("Viga sin fisurar vs fisurada (16×16)", [
        "caso          J      T_u    m_borde  m_centro",
        ...E.agrietada_vs_no.map((c) => `$${c.factor_J.toFixed(3).padEnd(6)} ${f2(c.Tu).padStart(5)}  ${f2(c.m_borde).padStart(6)}   +${f2(c.m_centro)}`),
        `Corte x = L/2: M_losa + M_vigas + H·h = ${f2(E.agrietada_vs_no[0].M_estatico)} tonf·m en TODOS los casos.`,
        `La losa pasa de ${f2(E.agrietada_vs_no[0].M_losa)} a ${f2(E.agrietada_vs_no.at(-1).M_losa)} tonf·m: el momento se redistribuye, no desaparece.`,
      ], { lado: "izq", ancho: 410, n: 22 });
      await a.sinPizarra(); await a.sinDibujo();
    },
  },
  {
    rotulo: "18 · Consecuencia para el armado",
    hacer: async (a) => {
      const c0 = E.agrietada_vs_no[0], cA = E.agrietada_vs_no.at(-1);
      await a.pizarra("Diseño", [
        `Losa: el positivo al centro sube ${((cA.m_centro / c0.m_centro - 1) * 100).toFixed(0)} % (+${f2(c0.m_centro)} → +${f2(cA.m_centro)} tonf·m/m): el acero inferior se diseña con el momento DESPUÉS de fisurar la viga.`,
        `El negativo de borde baja ${((1 - cA.m_borde / c0.m_borde) * 100).toFixed(0)} % en el mismo análisis.`,
        `Flecha al centro: ${f2(c0.flecha)} → ${f2(cA.flecha)} mm.`,
        `Viga: estribos cerrados + acero longitudinal para φT_cr = ${f2(E.aci.phiTcr)} tonf·m.`,
      ], { lado: "centro", ancho: 640, n: 20 });
      await a.sinPizarra();
    },
  },
  {
    rotulo: "19 · Conclusión",
    hacer: async (a) => {
      await a.pizarra("Conclusión", [
        `T_u sube al refinar: 0 (1×1) → ${f2(M(2).Tu)} (2×2) → ${f2(M(16).Tu)} (16×16) tonf·m.`,
        "La J de la viga es la misma en todas las mallas: lo que cambia es en cuántos nudos la losa le impone su giro.",
        "Con malla gruesa la viga NO recibe la torsión: el modelo la subestima.",
        "Refinar hasta que T_u no cambie (aquí 8×8 ya está a 4 %) y luego aplicar ACI §22.7.3.2.",
      ], { lado: "centro", ancho: 640, n: 20 });
      await a.sinPizarra();
    },
  },
];
