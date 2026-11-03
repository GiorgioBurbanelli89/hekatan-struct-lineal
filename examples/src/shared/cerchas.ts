/**
 * CERCHAS PARAMÉTRICAS Y EDITABLES.
 *
 * Una cercha es un TEXTO con fórmulas de sus parámetros. Se elige un tipo (Pratt, Howe, Warren…), se ve su definición
 * y se EDITA para derivar otro tipo: cambiar una fórmula, añadir una barra, quitar un nudo. «Generar» la dibuja en el CAD
 * (nudos, barras con su tubo, articulaciones, apoyos y cargas) y de ahí se sigue con las herramientas de siempre.
 *
 *   # comentario
 *   param L=12, H=2.4, n=6                       parámetros (pueden usar los anteriores)
 *   nudo A[i] = L*i/n , 0   for i=0..n            nudos con índice: x , z  (a lo largo y alto, en m)
 *   nudo B = L/2 , H                              nudo suelto
 *   barra A[i]-A[i+1] inf  for i=0..n-1           barra  nudo-nudo  GRUPO  [for v=a..b]  [si condición]
 *   barra B[i]-A[i+1] diag for i=1..n/2-1 si i<n  condición opcional (JavaScript sobre los parámetros y la variable)
 *   apoyo A[0] articulado                         apoyos a mano (empotrado | articulado | rodillo | horizontal); sin ellos: articulado a la
 *                                                  izquierda y rodillo a la derecha de la cota más baja
 *   opcion articulada=0                           fuerza una opción de este tipo (articulada, arriostrada): 0 = vigas rígidas (Vierendeel)
 *
 *  Grupos de barra (llevan su tubo D×t): inf, sup, mont, diag (y «correa» las que une entre cerchas).
 *  En las fórmulas: + - * / ** ( ), abs sqrt sin cos tan atan min max round floor ceil PI y los parámetros.
 */
export interface CerchaEval {
  ok: true;
  params: Record<string, number>;
  nodos: Array<{ clave: string; x: number; z: number }>;
  barras: Array<{ a: number; b: number; grupo: string }>;
  apoyos: Array<{ k: number; tipo: string }>;
  opciones: Record<string, number>;
}
export interface CerchaError { ok: false; error: string; linea?: number }

const MATEMATICAS: Record<string, unknown> = {
  abs: Math.abs, sqrt: Math.sqrt, sin: Math.sin, cos: Math.cos, tan: Math.tan, atan: Math.atan, atan2: Math.atan2,
  min: Math.min, max: Math.max, round: Math.round, floor: Math.floor, ceil: Math.ceil, pow: Math.pow, PI: Math.PI,
};
const cache = new Map<string, Function>();
function evaluar(expr: string, ambito: Record<string, number>): number {
  let f = cache.get(expr);
  if (!f) { f = new Function("sc", `with (sc) { return (${expr}); }`); cache.set(expr, f); }
  const v = f({ ...MATEMATICAS, ...ambito });
  if (typeof v !== "number" || !Number.isFinite(v)) throw new Error(`«${expr}» no da un número`);
  return v;
}
function evaluarCond(expr: string, ambito: Record<string, number>): boolean {
  let f = cache.get("?" + expr);
  if (!f) { f = new Function("sc", `with (sc) { return (${expr}); }`); cache.set("?" + expr, f); }
  return !!f({ ...MATEMATICAS, ...ambito });
}
/** Parte por comas de primer nivel (sin las de dentro de paréntesis o corchetes). */
function partirComas(s: string): string[] {
  const out: string[] = []; let d = 0, a = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === "(" || c === "[") d++; else if (c === ")" || c === "]") d--;
    else if (c === "," && d === 0) { out.push(s.slice(a, i)); a = i + 1; }
  }
  out.push(s.slice(a)); return out.map((x) => x.trim()).filter(Boolean);
}
const REF = "[A-Za-z_]\\w*(?:\\[[^\\]]*\\])?";

export function evaluarCercha(texto: string, sobre: Record<string, number> = {}): CerchaEval | CerchaError {
  const params: Record<string, number> = {};
  const nodos: CerchaEval["nodos"] = [], idx = new Map<string, number>(), barras: CerchaEval["barras"] = [];
  const apoyos: CerchaEval["apoyos"] = [], opciones: Record<string, number> = {};
  const lineas = texto.split(/\r?\n/);
  let n = 0;
  try {
    for (n = 0; n < lineas.length; n++) {
      const raw = lineas[n].replace(/#.*$/, "").trim(); if (!raw) continue;
      const pal = /^(\w+)\s+([\s\S]*)$/.exec(raw); if (!pal) throw new Error(`no entiendo «${raw}»`);
      const [, kw, resto] = pal;
      // «for v=a..b» y «si cond» van al final de nudo/barra
      const sacar = (s: string) => {
        let cond: string | null = null, rango: { v: string; a: string; b: string } | null = null;
        const mc = /\s+si\s+(.+)$/.exec(s); if (mc) { cond = mc[1].trim(); s = s.slice(0, mc.index); }
        const mf = /\s+for\s+(\w+)\s*=\s*(.+?)\.\.(.+)$/.exec(s); if (mf) { rango = { v: mf[1], a: mf[2].trim(), b: mf[3].trim() }; s = s.slice(0, mf.index); }
        // la condición puede ir antes del for
        if (!cond) { const mc2 = /\s+si\s+(.+)$/.exec(s); if (mc2) { cond = mc2[1].trim(); s = s.slice(0, mc2.index); } }
        return { cuerpo: s.trim(), cond, rango };
      };
      const iterar = (rango: { v: string; a: string; b: string } | null, cond: string | null, hacer: (amb: Record<string, number>) => void) => {
        if (!rango) { hacer({ ...params }); return; }
        const a = Math.floor(evaluar(rango.a, params)), b = Math.floor(evaluar(rango.b, params));
        for (let i = a; i <= b; i++) { const amb = { ...params, [rango.v]: i }; if (cond && !evaluarCond(cond, amb)) continue; hacer(amb); }
      };
      const clave = (ref: string, amb: Record<string, number>) => {
        const m = /^([A-Za-z_]\w*)(?:\[([^\]]*)\])?$/.exec(ref.trim()); if (!m) throw new Error(`referencia «${ref}» mal escrita`);
        return m[2] === undefined ? m[1] : `${m[1]}[${Math.round(evaluar(m[2], amb))}]`;
      };
      if (kw === "param") {
        for (const par of partirComas(resto)) {
          const m = /^([A-Za-z_]\w*)\s*=\s*(.+)$/.exec(par); if (!m) throw new Error(`parámetro «${par}»: use nombre=valor`);
          params[m[1]] = m[1] in sobre && Number.isFinite(sobre[m[1]]) ? sobre[m[1]] : evaluar(m[2], params);
        }
      } else if (kw === "nudo") {
        const { cuerpo, cond, rango } = sacar(resto);
        const m = /^([A-Za-z_]\w*(?:\[[^\]]*\])?)\s*=\s*(.+)$/.exec(cuerpo); if (!m) throw new Error("nudo: use  NOMBRE[i] = x , z");
        const xz = partirComas(m[2]); if (xz.length !== 2) throw new Error("nudo: dé dos valores  x , z");
        iterar(rango, cond, (amb) => {
          const k = clave(m[1], amb); if (idx.has(k)) throw new Error(`el nudo «${k}» está repetido`);
          idx.set(k, nodos.length); nodos.push({ clave: k, x: evaluar(xz[0], amb), z: evaluar(xz[1], amb) });
        });
      } else if (kw === "barra") {
        const { cuerpo, cond, rango } = sacar(resto);
        const m = new RegExp(`^(${REF})\\s*-\\s*(${REF})\\s+(\\w+)$`).exec(cuerpo); if (!m) throw new Error("barra: use  NUDO-NUDO  grupo");
        iterar(rango, cond, (amb) => {
          const ka = clave(m[1], amb), kb = clave(m[2], amb);
          const ia = idx.get(ka), ib = idx.get(kb);
          if (ia === undefined) throw new Error(`el nudo «${ka}» no existe`); if (ib === undefined) throw new Error(`el nudo «${kb}» no existe`);
          if (ia !== ib) barras.push({ a: ia, b: ib, grupo: m[3] });
        });
      } else if (kw === "apoyo") {
        const { cuerpo, cond, rango } = sacar(resto);
        const m = new RegExp(`^(${REF})\\s+(\\w+)$`).exec(cuerpo); if (!m) throw new Error("apoyo: use  NUDO  tipo");
        if (!["empotrado", "articulado", "rodillo", "horizontal"].includes(m[2])) throw new Error(`apoyo «${m[2]}»: use empotrado, articulado, rodillo u horizontal`);
        iterar(rango, cond, (amb) => {
          const k = clave(m[1], amb); const i = idx.get(k); if (i === undefined) throw new Error(`el nudo «${k}» no existe`);
          apoyos.push({ k: i, tipo: m[2] });
        });
      } else if (kw === "opcion") {
        for (const par of partirComas(resto)) { const m = /^(\w+)\s*=\s*(.+)$/.exec(par); if (!m) throw new Error("opcion: use nombre=valor"); opciones[m[1]] = evaluar(m[2], params); }
      } else throw new Error(`palabra «${kw}» desconocida (use param, nudo, barra, apoyo u opcion)`);
    }
  } catch (e: any) { return { ok: false, error: `línea ${n + 1}: ${e?.message ?? e}`, linea: n + 1 }; }
  if (!nodos.length) return { ok: false, error: "no hay ningún nudo" };
  if (!barras.length) return { ok: false, error: "no hay ninguna barra" };
  // barras repetidas (mismo par de nudos): se quita la segunda
  const vistos = new Set<string>(), unicas = barras.filter((b) => { const k = Math.min(b.a, b.b) + ":" + Math.max(b.a, b.b); if (vistos.has(k)) return false; vistos.add(k); return true; });
  return { ok: true, params, nodos, barras: unicas, apoyos, opciones };
}

// ───────────────────────── tipos de cercha (se editan y se guardan como propios) ─────────────────────────
const CABECERA = "# Edite las fórmulas o los parámetros y pulse «Generar». Grupos: inf, sup, mont, diag.\n";
export const CERCHAS_PRESETS: Record<string, { nombre: string; categoria: string; spec: string }> = {
  // ───────────── de techo, dos aguas ─────────────
  pratt: { nombre: "Pratt (dos aguas)", categoria: "Techo", spec: CABECERA +
`param L=12, H=2.4, n=6                          # luz, altura de la cumbrera, paneles (n par)
nudo A[i] = L*i/n , 0                for i=0..n                       # cordón inferior
nudo B[i] = L*i/n , H*(1-abs(2*i/n-1)) for i=1..n-1                   # cordón superior (en el faldón)
barra A[i]-A[i+1] inf                for i=0..n-1
barra A[0]-B[1] sup
barra B[i]-B[i+1] sup                for i=1..n-2
barra B[n-1]-A[n] sup
barra B[i]-A[i] mont                 for i=1..n-1                     # montantes
barra B[i]-A[i+1] diag               for i=1..n/2-1                   # diagonales hacia el centro (tracción)
barra B[i]-A[i-1] diag               for i=n/2+1..n-1
` },
  howe: { nombre: "Howe (dos aguas)", categoria: "Techo", spec: CABECERA +
`param L=12, H=2.4, n=6
nudo A[i] = L*i/n , 0                for i=0..n
nudo B[i] = L*i/n , H*(1-abs(2*i/n-1)) for i=1..n-1
barra A[i]-A[i+1] inf                for i=0..n-1
barra A[0]-B[1] sup
barra B[i]-B[i+1] sup                for i=1..n-2
barra B[n-1]-A[n] sup
barra B[i]-A[i] mont                 for i=1..n-1
barra B[i+1]-A[i] diag               for i=1..n/2-1                   # diagonales hacia los apoyos (compresión)
barra B[i-1]-A[i] diag               for i=n/2+1..n-1
` },
  warren: { nombre: "Warren / Belga (alma solo inclinada, dos aguas)", categoria: "Techo", spec: CABECERA +
`param L=12, H=2.4, n=6
nudo A[i] = L*i/n , 0                for i=0..n
nudo C[i] = L*(i+0.5)/n , H*(1-abs(2*(i+0.5)/n-1)) for i=0..n-1       # nudos del cordón superior a media luz de panel
barra A[i]-A[i+1] inf                for i=0..n-1
barra C[i]-C[i+1] sup                for i=0..n-2
barra A[i]-C[i] diag                 for i=0..n-1
barra C[i]-A[i+1] diag               for i=0..n-1
` },
  fink: { nombre: "Fink (en W)", categoria: "Techo", spec: CABECERA +
`param L=12, H=2.4
nudo A[i] = L*i/3 , 0                for i=0..3                        # cordón inferior en tercios
nudo B[1] = L/6 , H/3                                                  # cordón superior: sextos y cumbrera
nudo B[2] = L/2 , H
nudo B[3] = 5*L/6 , H/3
barra A[i]-A[i+1] inf                for i=0..2
barra A[0]-B[1] sup
barra B[1]-B[2] sup
barra B[2]-B[3] sup
barra B[3]-A[3] sup
barra B[1]-A[1] diag
barra A[1]-B[2] diag                                                    # la W
barra B[2]-A[2] diag
barra A[2]-B[3] diag
` },
  pendola: { nombre: "Péndola (king post)", categoria: "Techo", spec: CABECERA +
`param L=8, H=2
nudo A[i] = L*i/2 , 0                for i=0..2
nudo B = L/2 , H
barra A[0]-A[1] inf
barra A[1]-A[2] inf
barra A[0]-B sup
barra B-A[2] sup
barra B-A[1] mont
` },
  dobleP: { nombre: "Doble péndola (queen post)", categoria: "Techo", spec: CABECERA +
`param L=12, H=2.5
nudo A[i] = L*i/3 , 0                for i=0..3
nudo B[i] = L*i/3 , H                for i=1..2
barra A[i]-A[i+1] inf                for i=0..2
barra A[0]-B[1] sup
barra B[1]-B[2] sup
barra B[2]-A[3] sup
barra B[i]-A[i] mont                 for i=1..2
barra A[1]-B[2] diag                                                    # diagonal de arriostre
` },
  tijera: { nombre: "Tijera (scissor, cordones inferiores cruzados)", categoria: "Techo", spec: CABECERA +
`param L=12, H=3                                 # los cordones inferiores suben y se cruzan en X, a un tercio de la altura
nudo A[i] = L*i , 0                  for i=0..1
nudo R[1] = L/4 , H/2
nudo R[2] = 3*L/4 , H/2
nudo T = L/2 , H
nudo X = L/2 , H/3                                                      # cruce de los dos cordones inferiores
barra A[0]-R[1] sup
barra R[1]-T sup
barra T-R[2] sup
barra R[2]-A[1] sup
barra A[0]-X inf
barra X-R[2] inf
barra A[1]-X inf
barra X-R[1] inf
barra T-X mont
` },
  mansarda: { nombre: "Mansarda / gambrel (faldón quebrado)", categoria: "Techo", spec: CABECERA +
`param L=12, H=3.6, H1=2.4, a=3, n=8              # H1 = altura de la quiebra, a = proyección horizontal del faldón bajo, n par
nudo A[i] = L*i/n , 0                for i=0..n
nudo B[i] = L*i/n , (min(L*i/n, L-L*i/n)<=a ? H1*min(L*i/n, L-L*i/n)/a : H1+(H-H1)*(min(L*i/n, L-L*i/n)-a)/(L/2-a)) for i=1..n-1
barra A[i]-A[i+1] inf                for i=0..n-1
barra A[0]-B[1] sup
barra B[i]-B[i+1] sup                for i=1..n-2
barra B[n-1]-A[n] sup
barra B[i]-A[i] mont                 for i=1..n-1
barra B[i]-A[i+1] diag               for i=1..n/2-1
barra B[i]-A[i-1] diag               for i=n/2+1..n-1
` },
  arco: { nombre: "Arco parabólico (bowstring)", categoria: "Techo", spec: CABECERA +
`param L=12, H=2.5, n=8
nudo A[i] = L*i/n , 0                for i=0..n
nudo B[i] = L*i/n , H*(1-(2*i/n-1)**2) for i=1..n-1                  # cordón superior en parábola
barra A[i]-A[i+1] inf                for i=0..n-1
barra A[0]-B[1] sup
barra B[i]-B[i+1] sup                for i=1..n-2
barra B[n-1]-A[n] sup
barra B[i]-A[i] mont                 for i=1..n-1
barra B[i]-A[i+1] diag               for i=1..n/2-1
barra B[i]-A[i-1] diag               for i=n/2+1..n-1
` },
  mono: { nombre: "Un agua (media cercha, lean-to)", categoria: "Techo", spec: CABECERA +
`param L=10, H=2.5, n=5
nudo A[i] = L*i/n , 0                for i=0..n
nudo B[i] = L*i/n , H*i/n            for i=1..n                        # cordón superior inclinado
barra A[i]-A[i+1] inf                for i=0..n-1
barra A[0]-B[1] sup
barra B[i]-B[i+1] sup                for i=1..n-1
barra B[i]-A[i] mont                 for i=1..n
barra A[i]-B[i+1] diag               for i=1..n-1
` },
  sierra: { nombre: "Diente de sierra (shed)", categoria: "Techo", spec: CABECERA +
`param L=18, H=3, nd=3                           # nd = número de dientes
nudo A[j] = L*j/nd , 0               for j=0..nd
nudo P[j] = L*j/nd , H               for j=0..nd-1                     # cresta (lado vertical, vidriado)
barra A[j]-A[j+1] inf                for j=0..nd-1
barra P[j]-A[j] mont                 for j=0..nd-1
barra P[j]-A[j+1] sup                for j=0..nd-1                     # faldón inclinado
barra P[j]-P[j+1] diag               for j=0..nd-2                     # ligadura entre crestas
` },
  // ───────────── de cordones paralelos (entrepisos, puentes, mezanines) ─────────────
  paralela: { nombre: "Cordones paralelos · Pratt", categoria: "Paralela", spec: CABECERA +
`param L=12, H=1.5, n=6
nudo A[i] = L*i/n , 0                for i=0..n
nudo B[i] = L*i/n , H                for i=0..n
barra A[i]-A[i+1] inf                for i=0..n-1
barra B[i]-B[i+1] sup                for i=0..n-1
barra A[i]-B[i] mont                 for i=0..n
barra B[i]-A[i+1] diag               for i=0..n/2-1
barra B[i+1]-A[i] diag               for i=n/2..n-1
` },
  paralelaHowe: { nombre: "Cordones paralelos · Howe", categoria: "Paralela", spec: CABECERA +
`param L=12, H=1.5, n=6
nudo A[i] = L*i/n , 0                for i=0..n
nudo B[i] = L*i/n , H                for i=0..n
barra A[i]-A[i+1] inf                for i=0..n-1
barra B[i]-B[i+1] sup                for i=0..n-1
barra A[i]-B[i] mont                 for i=0..n
barra B[i+1]-A[i] diag               for i=0..n/2-1
barra B[i]-A[i+1] diag               for i=n/2..n-1
` },
  paralelaWarren: { nombre: "Cordones paralelos · Warren (sin montantes)", categoria: "Paralela", spec: CABECERA +
`param L=12, H=1.5, n=6
nudo A[i] = L*i/n , 0                for i=0..n
nudo C[i] = L*(i+0.5)/n , H          for i=0..n-1
barra A[i]-A[i+1] inf                for i=0..n-1
barra C[i]-C[i+1] sup                for i=0..n-2
barra A[i]-C[i] diag                 for i=0..n-1
barra C[i]-A[i+1] diag               for i=0..n-1
` },
  warrenMont: { nombre: "Cordones paralelos · Warren con montantes", categoria: "Paralela", spec: CABECERA +
`param L=12, H=1.5, n=6
nudo A[i] = L*i/n , 0                for i=0..n
nudo B[i] = L*i/n , H                for i=0..n
barra A[i]-A[i+1] inf                for i=0..n-1
barra B[i]-B[i+1] sup                for i=0..n-1
barra A[i]-B[i] mont                 for i=0..n
barra A[i]-B[i+1] diag               for i=0..n-1 si i%2==0            # diagonales alternadas
barra B[i]-A[i+1] diag               for i=0..n-1 si i%2==1
` },
  k: { nombre: "Cordones paralelos · K", categoria: "Paralela", spec: CABECERA +
`param L=12, H=2, n=6
nudo A[i] = L*i/n , 0                for i=0..n
nudo B[i] = L*i/n , H                for i=0..n
nudo M[i] = L*i/n , H/2              for i=0..n-1                       # punto medio del montante
barra A[i]-A[i+1] inf                for i=0..n-1
barra B[i]-B[i+1] sup                for i=0..n-1
barra A[i]-M[i] mont                 for i=0..n-1
barra M[i]-B[i] mont                 for i=0..n-1
barra A[n]-B[n] mont
barra M[i]-A[i+1] diag               for i=0..n-1                       # la K
barra M[i]-B[i+1] diag               for i=0..n-1
` },
  vierendeel: { nombre: "Vierendeel (sin diagonales, nudos rígidos)", categoria: "Paralela", spec: CABECERA +
`param L=12, H=1.5, n=6
opcion articulada=0                                                      # Vierendeel resiste por flexión de los nudos
nudo A[i] = L*i/n , 0                for i=0..n
nudo B[i] = L*i/n , H                for i=0..n
barra A[i]-A[i+1] inf                for i=0..n-1
barra B[i]-B[i+1] sup                for i=0..n-1
barra A[i]-B[i] mont                 for i=0..n
` },
  voladizo: { nombre: "Voladizo (Pratt en ménsula)", categoria: "Paralela", spec: CABECERA +
`param L=6, H=1.5, n=4                           # empotrada a un muro en x = 0
nudo A[i] = L*i/n , 0                for i=0..n
nudo B[i] = L*i/n , H                for i=0..n
barra A[i]-A[i+1] inf                for i=0..n-1
barra B[i]-B[i+1] sup                for i=0..n-1
barra A[i]-B[i] mont                 for i=0..n
barra B[i]-A[i+1] diag               for i=0..n-1
apoyo A[0] articulado                                                    # al muro: abajo articulado…
apoyo B[0] horizontal                                                    # …y arriba solo empuje horizontal
` },
};

// ───────────────────────── generación en el CAD ─────────────────────────
export interface CerchaOpts {
  spec?: string; tipo?: string;
  sobre?: Record<string, number>;          // valores que pisan los «param» del texto
  nCerchas: number; sep: number;           // cerchas iguales a lo largo de Y
  correas: boolean;                        // une los nudos del cordón superior entre cerchas
  articulada: boolean;                     // barras articuladas en sus dos extremos (celosía)
  arriostrada: boolean;                    // Uy = 0 en todos los nudos (cercha plana sin pandeo fuera del plano)
  carga: number;                           // kN por nudo del cordón superior (negativa = hacia abajo)
  tubos: Record<string, { D: number; t: number }>;
}
export const CERCHA_OPTS_DEFECTO: CerchaOpts = {
  tipo: "pratt", nCerchas: 1, sep: 4, correas: true, articulada: true, arriostrada: true, carga: -5,
  tubos: { inf: { D: 88.9, t: 4 }, sup: { D: 88.9, t: 4 }, mont: { D: 60.3, t: 3 }, diag: { D: 60.3, t: 3 }, correa: { D: 60.3, t: 3 } },
};
export interface ResumenCercha { ok: boolean; error?: string; nudos?: number; barras?: number; cerchas?: number; params?: Record<string, number> }

export function generarCercha(pIn: Partial<CerchaOpts> = {}): ResumenCercha {
  const W = window as any;
  const O: CerchaOpts = { ...CERCHA_OPTS_DEFECTO, ...pIn, tubos: { ...CERCHA_OPTS_DEFECTO.tubos, ...(pIn.tubos ?? {}) } };
  const spec = O.spec ?? CERCHAS_PRESETS[O.tipo ?? "pratt"]?.spec ?? "";
  const ev = evaluarCercha(spec, O.sobre ?? {});
  if (!ev.ok) return { ok: false, error: ev.error };
  if ("articulada" in ev.opciones) O.articulada = !!ev.opciones.articulada;
  if ("arriostrada" in ev.opciones) O.arriostrada = !!ev.opciones.arriostrada;
  const nC = Math.max(1, Math.round(O.nCerchas));
  const pts: number[][] = [], polys: number[][] = [];
  const sec = new Map<string, any>(), mat = new Map<string, string>(), rel = new Map<string, any>();
  const apoyos = new Map<number, boolean[]>(), cargas = new Map<number, number[]>();
  const enSup = new Set<number>();
  for (const b of ev.barras) if (b.grupo === "sup") { enSup.add(b.a); enSup.add(b.b); }
  const base: number[][] = [];                                   // base[k][i] = índice del nudo i de la cercha k
  const marca = (pi: number, grupo: string) => {
    const t = O.tubos[grupo] ?? O.tubos.diag; const c = W.__hekatanChsProps?.(`CHS ${t.D}x${t.t}`);
    if (c) sec.set(`${pi}:0`, c); mat.set(`${pi}:0`, "A53Gr.B");
    // Celosía articulada: flexión (My, Mz) liberada en los DOS extremos y la torsión (Mx) en el extremo I. Con las tres en los dos
    // extremos la matriz queda singular y el solver devuelve todo en cero; con solo flexión, los giros de un nudo plano quedan acoplados
    // por la torsión de las barras y LDLT avisa (pendola, sierra, warren: uz = −inf). Medido: torsión en I + flexión en ambos → sin avisos.
    if (O.articulada) rel.set(`${pi}:0`, { i: [true, true, true], j: [false, true, true] });
  };
  // apoyos: nudo más a la izquierda y más a la derecha de la cota más baja (articulado y rodillo)
  const zMin = Math.min(...ev.nodos.map((n) => n.z));
  const bajos = ev.nodos.map((n, i) => ({ n, i })).filter((q) => Math.abs(q.n.z - zMin) < 1e-9);
  const iIzq = bajos.reduce((a, q) => (q.n.x < a.n.x ? q : a)).i, iDer = bajos.reduce((a, q) => (q.n.x > a.n.x ? q : a)).i;
  for (let k = 0; k < nC; k++) {
    const y = k * O.sep, f: number[] = [];
    for (const n of ev.nodos) f.push(pts.push([n.x, y, n.z]) - 1);
    base.push(f);
    for (const b of ev.barras) { const pi = polys.push([f[b.a], f[b.b]]) - 1; marca(pi, b.grupo); }
    ev.nodos.forEach((_, i) => {
      const gi = f[i];
      const dof = [false, !!O.arriostrada, false, false, false, false];
      if (!ev.apoyos.length) {
        if (i === iIzq) { dof[0] = true; dof[1] = true; dof[2] = true; }
        else if (i === iDer) { dof[1] = true; dof[2] = true; }
      } else for (const ap of ev.apoyos) if (ap.k === i) {
        // empotrado: todo · articulado: Ux Uy Uz · rodillo: Uy Uz (libre en x) · horizontal: Ux Uy (libre en z)
        if (ap.tipo === "empotrado") dof.fill(true);
        else if (ap.tipo === "articulado") { dof[0] = true; dof[1] = true; dof[2] = true; }
        else if (ap.tipo === "rodillo") { dof[1] = true; dof[2] = true; }
        else if (ap.tipo === "horizontal") { dof[0] = true; dof[1] = true; }
      }
      if (dof.some(Boolean)) apoyos.set(gi, dof);
      if (enSup.has(i) && O.carga) cargas.set(gi, [0, 0, O.carga, 0, 0, 0]);
    });
  }
  if (O.correas) for (let k = 0; k + 1 < nC; k++) for (const i of enSup) { const pi = polys.push([base[k][i], base[k + 1][i]]) - 1; marca(pi, "correa"); }
  polys.push([]);

  const lim = (m: any) => { try { m?.clear?.(); } catch { /* sin mapa */ } };
  for (const m of ["__hekatanManualSections", "__hekatanManualMaterial", "__hekatanManualDistLoads", "__hekatanManualArea",
    "__hekatanManualSupports", "__hekatanManualLoads", "__hekatanManualModifiers", "__hekatanManualReleases"]) lim(W[m]);
  for (const [k, v] of sec) W.__hekatanManualSections?.set(k, v);
  for (const [k, v] of mat) W.__hekatanManualMaterial?.set(k, v);
  for (const [k, v] of rel) W.__hekatanManualReleases?.set(k, v);
  for (const [k, v] of apoyos) W.__hekatanManualSupports?.set(k, v);
  for (const [k, v] of cargas) W.__hekatanManualLoads?.set(k, v);
  W.__hekatanDrawingPoints.val = pts; W.__hekatanDrawingPolylines.val = polys; W.__hekatanDrawingAreas.val = [];
  W.__hekatanSetParam?.("apoyo", 3); W.__hekatanSetParam?.("mallaZapata", 1); W.__hekatanSetParam?.("ksSuelo", 0);
  try { const el = [...document.querySelectorAll("*")].find((e: any) => e.__settings && e.__ctx) as any; if (el?.__settings?.loads) el.__settings.loads.val = true; } catch { /* sin visor */ }
  try { W.__hekatanRebuild?.(); } catch { /* sin rebuild */ }
  return { ok: true, nudos: pts.length, barras: polys.filter((p) => p.length > 1).length, cerchas: nC, params: ev.params };
}
