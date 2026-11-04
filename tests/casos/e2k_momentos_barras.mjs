/**
 * E2K: FUERZAS DE BARRA (M3, M2, V2, V3, P) de las barras que sostienen la membrana (correas 1G, VP, vigas de borde) contra ETABS 22,
 * en extremos y a media luz, con carga VIVA y MUERTA. Verifica dos cosas:
 *  1. El reparto de la losa en UNA direccion (ONEWAYLOADDIST) sigue los EJES LOCALES DEL AREA (eje 1 = +X girado ANG, la direccion del vano):
 *     ANG 0 -> la carga va a las correas, ANG 90 -> a las VP, y cada barra recibe lo que ETABS le asigna (diagrama de momentos igual).
 *  2. `fixedend` (empotramiento de la carga de vano, e2kAHeks -> .heks -> analyze): sin el, analyze() no resta la carga del vano y V/M/axil
 *     de la correa salian sin ella (shearsZ 0 contra 2.3 kN de ETABS). Los extremos de analyze() NO traen la carga de vano: a media luz se
 *     recupera con V lineal y M cuadratico (carga uniforme), evaluado en las estaciones de ETABS (cara del brazo rigido).
 * Datos: galpon sencillo 12x6 (plana, 3 %, rot90 = ANG 90), vano E/F (e2k_cubierta_pendiente_*) y galpon recortado (e2k_galpon1, ventana x 24..36).
 * ETABS por OAPI (FrameForce con estaciones); rot90 y galpon1 se corrieron para este test (2 corridas, sin colgarse).
 */
import { cargarMod, medirFuerzas, resumenFuerzas } from "../lib/momentos_cmp.mjs";
export const nombre = "e2k-momentos-barras";
export const descripcion = "e2k: M3/V2/M2/P de correas y vigas que sostienen la membrana vs ETABS (extremo y media luz, Live/Dead), ejes locales del area ANG 0/90, fixedend";

export async function correr() {
  const mod = await cargarMod();
  const filas = [];
  const fila = (que, medido, limite, ok, detalle = "") => filas.push({ que, crudo: true, medido, limite, ok, detalle });
  const f = (x, n = 2) => x.toFixed(n);
  const G = "e2k_cubierta_pendiente_galpon_", V = "e2k_cubierta_pendiente_vano_";
  const pct = (q) => `${f(q.pctExt)} % ext / ${f(q.pctMid)} % vano`;
  const caso = async (pref, nom, pats = ["Live", "Dead"]) => medirFuerzas(mod, pref, nom, {}, pats);

  // ---- 1) galpon sencillo ANG 0: la carga va a las correas ----
  for (const nom of ["plana", "p3"]) {
    const M = await caso(G, nom);
    for (const pat of ["Live", "Dead"]) {
      const rs = resumenFuerzas(M[pat]);
      const c = rs.correa, v = rs.VP;
      fila(`galpon ${nom} ${pat}: correa M3 (pico ETABS ${f(c.M3.pico, 3)} kN·m)`, pct(c.M3), "<= 1.0 % ext, <= 0.6 % vano", c.M3.pctExt <= 1.0 && c.M3.pctMid <= 0.6, "extremo = cara del brazo; vano = carga uniforme, V lineal / M cuadratico");
      fila(`galpon ${nom} ${pat}: correa V2 (pico ${f(c.V2.pico, 3)} kN)`, pct(c.V2), "<= 0.5 %", c.V2.pctExt <= 0.5 && c.V2.pctMid <= 0.5);
      fila(`galpon ${nom} ${pat}: VP M3 (pico ${f(v.M3.pico, 3)} kN·m, carga puntual de las correas)`, pct(v.M3), "<= 0.6 %", v.M3.pctExt <= 0.6 && v.M3.pctMid <= 0.6);
      fila(`galpon ${nom} ${pat}: VP V2 (pico ${f(v.V2.pico, 3)} kN)`, pct(v.V2), "<= 0.9 %", v.V2.pctExt <= 0.9 && v.V2.pctMid <= 0.9);
      if (nom === "p3") {
        // la pendiente aparece SOLO en el axil de la correa (Q/2·sen θ): antes 0.0002 contra 0.069 kN
        fila(`galpon p3 ${pat}: correa P (axil Q/2·sen θ, pico ${f(c.P.pico, 3)} kN)`, `${f(c.P.errExt + 0, 4)} kN de error`, "<= 0.003 kN", c.P.errExt <= 0.003 && c.P.errMid <= 0.003, "sin fixedend: Hek 0.0002 contra 0.069 de ETABS");
        fila(`galpon p3 ${pat}: correa M2/V3 (flexion fuera del plano) ~ 0`, `${f(c.M2.errExt, 4)} / ${f(c.V3.errExt, 4)} kN·m / kN`, "<= 0.005", c.M2.errExt <= 0.005 && c.V3.errExt <= 0.005);
      }
    }
  }
  // ---- 2) ejes locales del area: ANG 90 (rot90) manda la carga a las VP, no a las correas ----
  {
    const M = await medirFuerzas(mod, "e2k_galpon_simple_", "rot90", {}, ["Live", "Dead"]);
    for (const pat of ["Live", "Dead"]) {
      const L = M[pat], rs = resumenFuerzas(L);
      const corr = L.filter((b) => b.cls === "correa"), mx = (arr, k) => Math.max(...arr.map((b) => Math.max(...b.e[k].map(Math.abs))));
      const mh = (arr, k) => Math.max(...arr.map((b) => Math.max(...b.h[k].map(Math.abs))));
      const vp = rs.VP;
      fila(`rot90 (ANG 90) ${pat}: VP M3 (pico ETABS ${f(vp.M3.pico, 3)} kN·m, la losa carga a las VP)`, pct(vp.M3), "<= 0.6 %", vp.M3.pctExt <= 0.6 && vp.M3.pctMid <= 0.6, "ejes locales del area: eje 1 girado 90 = vano en Y");
      fila(`rot90 (ANG 90) ${pat}: VP V2 (pico ${f(vp.V2.pico, 3)} kN)`, pct(vp.V2), "<= 0.8 %", vp.V2.pctExt <= 0.8 && vp.V2.pctMid <= 0.8);
      const eC = mx(corr, "M3"), hC = mh(corr, "M3");
      fila(`rot90 ${pat}: correas (sin carga de losa) max|M3| ETABS / Hek`, `${f(eC, 3)} / ${f(hC, 3)} kN·m`, "Hek <= ETABS + 0.02", hC <= eC + 0.02, "con ANG 90 las correas solo llevan su peso (Dead) / nada (Live)");
      // sentido: contra ANG 0 las VP no cargarian con 7.3 kN de cortante (Live); aqui si
      if (pat === "Live") fila("rot90 Live: VP V2 pico (ANG 90) comparado con el galpon ANG 0 (VP solo con reacciones de correas)", `${f(vp.V2.pico, 2)} kN vs 6.45`, "ETABS y Hek = 7.3 (carga directa de la losa)", Math.abs(vp.V2.pico - 7.313) < 0.01 && vp.V2.pctMid <= 0.8);
    }
  }
  // ---- 3) vano con cortante E/F (ANG 0), plana y 3 % ----
  for (const nom of ["Epl", "Fp3"]) {
    const M = await caso(V, nom, ["Live"]);
    const rs = resumenFuerzas(M.Live);
    fila(`vano ${nom} Live: correa M3 (pico ${f(rs.correa.M3.pico, 3)})`, pct(rs.correa.M3), "<= 0.3 %", rs.correa.M3.pctExt <= 0.3 && rs.correa.M3.pctMid <= 0.3);
    fila(`vano ${nom} Live: VP M3 (pico ${f(rs.VP.M3.pico, 3)})`, pct(rs.VP.M3), "<= 0.3 %", rs.VP.M3.pctExt <= 0.3 && rs.VP.M3.pctMid <= 0.3);
  }
  // ---- 4) galpon recortado del mercado (ventana x 24..36): correas interiores = ETABS; la del borde de la ventana es un caso aparte ----
  {
    const M = await caso("e2k_", "galpon1");
    for (const pat of ["Live", "Dead"]) {
      const L = M[pat], int = L.filter((b) => !(b.cls === "correa" && Math.abs(b.p1[0] - 24) < 1e-3));
      const rs = resumenFuerzas(int, ["M3", "V2"]);
      fila(`galpon1 ${pat}: correas 1G de la ventana (sin la x=24) M3 (pico ${f(rs.correa.M3.pico, 3)})`, pct(rs.correa.M3), "<= 0.3 %", rs.correa.M3.pctExt <= 0.3 && rs.correa.M3.pctMid <= 0.3);
      fila(`galpon1 ${pat}: correas 1G V2 (pico ${f(rs.correa.V2.pico, 3)})`, pct(rs.correa.V2), "<= 0.3 %", rs.correa.V2.pctExt <= 0.3 && rs.correa.V2.pctMid <= 0.3);
      fila(`galpon1 ${pat}: tubos M3 (pico ${f(rs.tubo.M3.pico, 3)})`, pct(rs.tubo.M3), "<= 3 % (CFT sin 0.8, 4-nov-2026: era 2.2 con 0.8 en CFT; pico 0.2 kN·m)", rs.tubo.M3.pctExt <= 3 && rs.tubo.M3.pctMid <= 3);
    }
    // documenta: la correa x=24 (borde de la ventana, ambos extremos apoyados de «corte») ETABS no la carga; Hek le da la franja de 0.5 m
    const b = M.Live.find((q) => q.cls === "correa" && Math.abs(q.p1[0] - 24) < 1e-3);
    if (b) fila("galpon1 Live: correa x=24 (borde de la ventana, nudos de corte) max|M3| ETABS / Hek (documenta, abierto)", `${f(Math.max(...b.e.M3.map(Math.abs)), 3)} / ${f(Math.max(...b.h.M3.map(Math.abs)), 3)} kN·m`, "ETABS 0 (sin carga), Hek 1.44", Math.max(...b.e.M3.map(Math.abs)) < 1e-6, "artefacto del modelo recortado: sus columnas tampoco llevan axil en ETABS; las reacciones casan");
  }
  return filas;
}
