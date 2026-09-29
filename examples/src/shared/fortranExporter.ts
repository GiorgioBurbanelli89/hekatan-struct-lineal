/**
 * Exportar a FORTRAN los resultados que están ACTIVOS en el visor.
 *
 * Jorge, 29-sep-2026: «al final de las demás, que exporte en Fortran los resultados que estén
 * activos». Sale un `.f90` LEGAL: compila tal cual con gfortran y se abre en Hekatan Fortran,
 * donde los comentarios `!#` (título) y `!'` (texto) hacen de hoja.
 *
 * Qué va dentro:
 *   · la geometría (nudos, y la conectividad de los elementos que tienen resultado);
 *   · los resultados activos: nudo (desplazamientos o reacciones), barra (el esfuerzo elegido en los
 *     dos extremos), cáscara (el campo elegido en cada nudo de cada paño) y sólido;
 *   · un programa que los recorre y saca, en Fortran, el máximo, el mínimo y dónde están; con
 *     reacciones además suma ΣF y ΣM (equilibrio). Los campos principales de cáscara (FMax, MMax…)
 *     los calcula el propio programa con el círculo de Mohr desde XX, YY, XY.
 *
 * Si no hay ningún resultado activo, exporta desplazamientos y reacciones.
 * Unidades: las del solver (kN, m, rad), no las de pantalla. Sin DOM en `fortranDeModelo`: lo usan
 * los tests.
 */

export interface ResultadosActivos { nodo: string; barra: string; cascara: string; solido: string }

const SHELL_DERIVADOS: Record<string, [string, string, string, "max" | "min" | "vmax"]> = {
  membranePrincipalMax: ["membraneXX", "membraneYY", "membraneXY", "max"],
  membranePrincipalMin: ["membraneXX", "membraneYY", "membraneXY", "min"],
  bendingPrincipalMax: ["bendingXX", "bendingYY", "bendingXY", "max"],
  bendingPrincipalMin: ["bendingXX", "bendingYY", "bendingXY", "min"],
  transverseShearMax: ["tranverseShearX", "tranverseShearY", "", "vmax"],
};
const NOMBRE_CSI: Record<string, string> = {
  normals: "P (axial)", torsions: "T (torsión)", shearsY: "V2", shearsZ: "V3", bendingsY: "M2", bendingsZ: "M3",
  membraneXX: "F11", membraneYY: "F22", membraneXY: "F12", membranePrincipalMax: "FMax", membranePrincipalMin: "FMin",
  vonMises: "FVM", tranverseShearX: "V13", tranverseShearY: "V23", transverseShearMax: "VMax",
  bendingXX: "M11", bendingYY: "M22", bendingXY: "M12", bendingPrincipalMax: "MMax", bendingPrincipalMin: "MMin",
  pressure: "presión del suelo", displacementX: "Ux", displacementY: "Uy", displacementZ: "Uz",
};
const UNIDAD: Record<string, string> = {
  normals: "kN", shearsY: "kN", shearsZ: "kN", torsions: "kN·m", bendingsY: "kN·m", bendingsZ: "kN·m",
  membraneXX: "kN/m", membraneYY: "kN/m", membraneXY: "kN/m", membranePrincipalMax: "kN/m", membranePrincipalMin: "kN/m",
  vonMises: "kN/m", tranverseShearX: "kN/m", tranverseShearY: "kN/m", transverseShearMax: "kN/m",
  bendingXX: "kN·m/m", bendingYY: "kN·m/m", bendingXY: "kN·m/m", bendingPrincipalMax: "kN·m/m", bendingPrincipalMin: "kN·m/m",
  pressure: "kN/m²", displacementX: "m", displacementY: "m", displacementZ: "m",
};

/** Número con exponente de Fortran en doble precisión: 1.25d+03. */
export function fd(v: number): string {
  if (!Number.isFinite(v)) return "0.0d0";
  if (v === 0) return "0.0d0";
  return v.toExponential(10).replace("e", "d");
}
const lim = (s: string) => s.replace(/[^\x20-\x7e]/g, (c) => ({ "·": ".", "²": "2", "³": "3", "Σ": "S", "é": "e", "ó": "o", "í": "i", "á": "a", "ú": "u", "ñ": "n", "Á": "A", "É": "E" } as any)[c] ?? "?");

export function fortranDeModelo(st: any, activos: ResultadosActivos, meta: { titulo?: string; caso?: string } = {}): string {
  const v = (s: any) => s?.rawVal ?? s?.val ?? s;
  const nodos: number[][] = v(st.nodes) ?? [];
  const elems: number[][] = v(st.elements) ?? [];
  const def = v(st.deformOutputs) ?? {};
  const an = v(st.analyzeOutputs) ?? {};
  const ni = v(st.nodeInputs) ?? {};
  let { nodo, barra, cascara, solido } = activos;
  const nada = [nodo, barra, cascara, solido].every((x) => !x || x === "none");
  if (nada) nodo = "ambos";
  barra = (barra || "none").replace(/^contour:/, "");

  const L: string[] = [];
  const P = (s = "") => L.push(s);
  const nn = nodos.length;
  P(`!# ${lim(meta.titulo || "Modelo de Hekatan Struct")} - resultados exportados a Fortran`);
  P(`!' Exportado desde Hekatan Struct el ${new Date().toISOString().slice(0, 10)}. Caso: ${lim(meta.caso || "el que estaba a la vista")}.`);
  P(`!' Unidades del solver: kN, m y rad. Compila con: gfortran -O2 este_archivo.f90 -o resultados`);
  P("program resultados_hekatan");
  P("  implicit none");
  P(`  integer, parameter :: nn = ${nn}`);
  P("  real(8) :: xyz(3, nn)");
  P("  integer :: i, j, k, imax, imin");
  P("  real(8) :: vmax, vmin, s(6), a, b, c");
  P("");
  P("!' Coordenadas de los nudos (x, y, z en m). El nudo i del programa es el nudo i de Struct.");
  nodos.forEach((p, i) => P(`  xyz(:, ${i + 1}) = [${fd(p[0])}, ${fd(p[1])}, ${fd(p[2])}]`));
  const cuerpo: string[] = [];
  const decl: string[] = [];
  const C = (s = "") => cuerpo.push(s);

  // ── NUDO ─────────────────────────────────────────────────────────────
  const defs: Map<number, number[]> | undefined = def.deformations;
  const reacs: Map<number, number[]> | undefined = def.reactions;
  if ((nodo === "deformations" || nodo === "ambos") && defs?.size) {
    decl.push("  real(8) :: u(6, nn)");
    C("!# Desplazamientos de los nudos");
    C("!' u(1:3) traslaciones en m, u(4:6) giros en rad, ejes globales.");
    C("  u = 0.0d0");
    defs.forEach((d, n) => { if (d.some((x) => x !== 0)) C(`  u(:, ${n + 1}) = [${d.slice(0, 6).map(fd).join(", ")}]`); });
    for (const [k, nom] of [[1, "Ux"], [2, "Uy"], [3, "Uz"]] as const) {
      C(`  imax = maxloc(u(${k}, :), 1); imin = minloc(u(${k}, :), 1)`);
      C(`  print '(a, es14.6, a, i0, a, es14.6, a, i0)', ' ${nom} max = ', u(${k}, imax), ' m en el nudo ', imax, '   min = ', u(${k}, imin), ' m en el nudo ', imin`);
    }
    C("  imax = maxloc(sqrt(u(1,:)**2 + u(2,:)**2 + u(3,:)**2), 1)");
    C("  print '(a, es14.6, a, i0)', ' |U| max  = ', sqrt(sum(u(1:3, imax)**2)), ' m en el nudo ', imax");
  }
  if ((nodo === "reactions" || nodo === "ambos") && reacs?.size) {
    const lista = [...reacs.entries()].filter(([, r]) => r.some((x) => Math.abs(x) > 0));
    decl.push(`  integer, parameter :: nr = ${Math.max(1, lista.length)}`, "  integer :: nudoR(nr)", "  real(8) :: r(6, nr)");
    C("!# Reacciones en los apoyos");
    C("!' r(1:3) fuerzas en kN, r(4:6) momentos en kN.m, ejes globales.");
    C("  r = 0.0d0; nudoR = 0");
    lista.forEach(([n, rr], i) => { C(`  nudoR(${i + 1}) = ${n + 1}`); C(`  r(:, ${i + 1}) = [${rr.slice(0, 6).map(fd).join(", ")}]`); });
    C("!' Equilibrio: suma de reacciones (fuerzas) y su momento respecto al origen.");
    C("  s = 0.0d0");
    C("  do i = 1, nr");
    C("    if (nudoR(i) == 0) cycle");
    C("    s(1:3) = s(1:3) + r(1:3, i)");
    C("    a = xyz(1, nudoR(i)); b = xyz(2, nudoR(i)); c = xyz(3, nudoR(i))");
    C("    s(4) = s(4) + r(4, i) + b*r(3, i) - c*r(2, i)");
    C("    s(5) = s(5) + r(5, i) + c*r(1, i) - a*r(3, i)");
    C("    s(6) = s(6) + r(6, i) + a*r(2, i) - b*r(1, i)");
    C("  end do");
    C("  print '(a, 3es14.6)', ' Suma de reacciones Fx Fy Fz (kN)   = ', s(1:3)");
    C("  print '(a, 3es14.6)', ' Momento de reacciones Mx My Mz     = ', s(4:6)");
    // cargas aplicadas, para cerrar el equilibrio
    const cargas: Map<number, number[]> | undefined = ni.loads;
    if (cargas?.size) {
      const sf = [0, 0, 0];
      cargas.forEach((f) => { for (let k = 0; k < 3; k++) sf[k] += f?.[k] ?? 0; });
      C(`!' Cargas nodales aplicadas (lo que arma el modelo): ${sf.map((x) => x.toFixed(3)).join(", ")} kN. Con muelles de suelo, parte de la vertical la devuelve el suelo y no sale aquí.`);
    }
  }

  // ── BARRA ────────────────────────────────────────────────────────────
  if (barra && barra !== "none") {
    const m: Map<number, [number, number]> | undefined = an[barra];
    const lista = m ? [...m.entries()].filter(([e]) => elems[e]?.length === 2) : [];
    if (lista.length) {
      decl.push(`  integer, parameter :: nb = ${lista.length}`, "  integer :: barraId(nb), barraN(2, nb)", "  real(8) :: fb(2, nb)");
      C(`!# Barras: ${lim(NOMBRE_CSI[barra] ?? barra)} (${lim(UNIDAD[barra] ?? "")})`);
      C("!' fb(1, k) en el nudo inicial y fb(2, k) en el final; fuerzas de extremo del solver (convención de Hekatan Struct).");
      lista.forEach(([e, f], i) => {
        C(`  barraId(${i + 1}) = ${e + 1}; barraN(:, ${i + 1}) = [${elems[e][0] + 1}, ${elems[e][1] + 1}]; fb(:, ${i + 1}) = [${fd(f[0])}, ${fd(f[1])}]`);
      });
      C("  vmax = maxval(fb); vmin = minval(fb)");
      C("  k = maxloc(maxval(fb, 1), 1); j = minloc(minval(fb, 1), 1)");
      C(`  print '(a, es14.6, a, i0, a, es14.6, a, i0)', ' ${lim(NOMBRE_CSI[barra] ?? barra)} max = ', vmax, ' en la barra ', barraId(k), '   min = ', vmin, ' en la barra ', barraId(j)`);
    } else C(`!' Barras: el resultado activo (${barra}) no tiene valores en este modelo.`);
  }

  // ── CÁSCARA ──────────────────────────────────────────────────────────
  if (cascara && cascara !== "none") {
    const deriv = SHELL_DERIVADOS[cascara];
    const esDesp = /^displacement[XYZ]$/.test(cascara);
    const panos = elems.map((e, i) => [i, e] as const).filter(([, e]) => e.length === 3 || e.length === 4);
    const campo = (nom: string): Map<number, number[]> | undefined => an[nom];
    const fuente = esDesp ? null : deriv ? campo(deriv[0]) : campo(cascara);
    const conValores = esDesp ? panos : panos.filter(([i]) => fuente?.get(i)?.length);
    if (conValores.length) {
      decl.push(`  integer, parameter :: ns = ${conValores.length}`, "  integer :: panoId(ns), panoN(4, ns)");
      decl.push(deriv ? "  real(8) :: fxx(4, ns), fyy(4, ns), fxy(4, ns), fs(4, ns)" : "  real(8) :: fs(4, ns)");
      C(`!# Cáscaras: ${lim(NOMBRE_CSI[cascara] ?? cascara)} (${lim(UNIDAD[cascara] ?? "")})`);
      C("!' Un valor por nudo de cada paño (panoN = sus nudos; en un triángulo el 4.º es 0).");
      C("  panoN = 0; fs = 0.0d0");
      const val = (m: Map<number, number[]> | undefined, i: number, n: number) => {
        const a = m?.get(i) ?? [];
        return Array.from({ length: 4 }, (_, k) => (k < n ? a[k] ?? 0 : 0));
      };
      conValores.forEach(([i, e], k) => {
        const nod = Array.from({ length: 4 }, (_, q) => (q < e.length ? e[q] + 1 : 0));
        let linea = `  panoId(${k + 1}) = ${i + 1}; panoN(:, ${k + 1}) = [${nod.join(", ")}]`;
        if (esDesp) {
          const c = "XYZ".indexOf(cascara.slice(-1));
          linea += `; fs(:, ${k + 1}) = [${Array.from({ length: 4 }, (_, q) => fd(q < e.length ? defs?.get(e[q])?.[c] ?? 0 : 0)).join(", ")}]`;
        } else if (deriv) {
          const xx = val(campo(deriv[0]), i, e.length), yy = val(campo(deriv[1]), i, e.length);
          const xy = deriv[2] ? val(campo(deriv[2]), i, e.length) : [0, 0, 0, 0];
          linea += `\n  fxx(:, ${k + 1}) = [${xx.map(fd).join(", ")}]; fyy(:, ${k + 1}) = [${yy.map(fd).join(", ")}]; fxy(:, ${k + 1}) = [${xy.map(fd).join(", ")}]`;
        } else linea += `; fs(:, ${k + 1}) = [${val(fuente, i, e.length).map(fd).join(", ")}]`;
        C(linea);
      });
      if (deriv) {
        C(deriv[3] === "vmax"
          ? "!' VMax = raíz de V13² + V23² (cortante transversal máximo), calculado aquí en Fortran."
          : `!' Principal ${deriv[3] === "max" ? "mayor" : "menor"} por el círculo de Mohr, calculado aquí en Fortran: (xx + yy)/2 ${deriv[3] === "max" ? "+" : "-"} raíz(((xx - yy)/2)² + xy²).`);
        C("  do k = 1, ns");
        C("    do j = 1, 4");
        C("      if (panoN(j, k) == 0) cycle");
        C(deriv[3] === "vmax"
          ? "      fs(j, k) = sqrt(fxx(j, k)**2 + fyy(j, k)**2)"
          : `      fs(j, k) = (fxx(j, k) + fyy(j, k))/2 ${deriv[3] === "max" ? "+" : "-"} sqrt(((fxx(j, k) - fyy(j, k))/2)**2 + fxy(j, k)**2)`);
        C("    end do");
        C("  end do");
      }
      C("  vmax = -huge(1.0d0); vmin = huge(1.0d0); imax = 0; imin = 0");
      C("  do k = 1, ns");
      C("    do j = 1, 4");
      C("      if (panoN(j, k) == 0) cycle");
      C("      if (fs(j, k) > vmax) then; vmax = fs(j, k); imax = k; i = panoN(j, k); end if");
      C("      if (fs(j, k) < vmin) then; vmin = fs(j, k); imin = k; end if");
      C("    end do");
      C("  end do");
      C(`  print '(a, es14.6, a, i0, a, es14.6, a, i0)', ' ${lim(NOMBRE_CSI[cascara] ?? cascara)} max = ', vmax, ' en el pano ', panoId(imax), '   min = ', vmin, ' en el pano ', panoId(imin)`);
    } else C(`!' Cáscaras: el resultado activo (${cascara}) no tiene valores en este modelo.`);
  }

  // ── SÓLIDO ───────────────────────────────────────────────────────────
  if (solido && solido !== "none") {
    const vm: Map<number, number[]> | undefined = an.solidVonMises;
    const ss: Map<number, number[][]> | undefined = an.solidStress;
    const comp = ["sigmaXX", "sigmaYY", "sigmaZZ", "tauXY", "tauYZ", "tauXZ"].indexOf(solido);
    const lista = [...(vm ?? new Map()).keys()].filter((e) => elems[e]?.length === 8);
    if (lista.length && (solido === "vonMises" || comp >= 0)) {
      decl.push(`  integer, parameter :: nh = ${lista.length}`, "  integer :: solidoId(nh)", "  real(8) :: fh(8, nh)");
      C(`!# Sólidos: ${solido} en los 8 puntos de Gauss (kN/m2)`);
      lista.forEach((e, k) => {
        const g = solido === "vonMises" ? vm!.get(e)! : (ss?.get(e) ?? []).map((q) => q[comp]);
        C(`  solidoId(${k + 1}) = ${e + 1}; fh(:, ${k + 1}) = [${Array.from({ length: 8 }, (_, q) => fd(g[q] ?? 0)).join(", ")}]`);
      });
      C("  k = maxloc(maxval(fh, 1), 1); j = minloc(minval(fh, 1), 1)");
      C(`  print '(a, es14.6, a, i0, a, es14.6, a, i0)', ' ${solido} max = ', maxval(fh), ' en el solido ', solidoId(k), '   min = ', minval(fh), ' en el solido ', solidoId(j)`);
    } else if (solido !== "none") C(`!' Sólidos: el resultado activo (${solido}) se ve en pantalla pero no está en la salida por punto de Gauss.`);
  }

  if (!cuerpo.length) C("!' No había resultados calculados que exportar (¿falta analizar el modelo?).");
  // declaraciones antes de la primera sentencia ejecutable
  const iPrimera = L.findIndex((l) => l.startsWith("  xyz(:"));
  L.splice(iPrimera < 0 ? L.length : iPrimera - 1, 0, ...decl);
  L.push("", ...cuerpo, "end program resultados_hekatan", "");
  // el texto de las líneas que no son comentario tiene que ser ASCII (gfortran); los comentarios pueden llevar acentos
  return L.flatMap((l) => l.split("\n")).flatMap((l) => (l.trimStart().startsWith("!") ? [l] : partir(lim(l)))).join("\n");
}

/**
 * Fortran libre admite 132 columnas: una línea más larga se parte con `&` después de una coma (o de
 * `;`, que separa sentencias). Así compila con gfortran SIN `-ffree-line-length-none`.
 */
function partir(l: string, max = 120): string[] {
  const out: string[] = [];
  let r = l;
  while (r.length > max) {
    let k = r.lastIndexOf(", ", max);
    const ks = r.lastIndexOf("; ", max);
    if (ks > k) {
      // entre sentencias no hace falta continuación: se parte en dos líneas
      out.push(r.slice(0, ks));
      r = "  " + r.slice(ks + 2);
      continue;
    }
    if (k < 20) break;
    out.push(r.slice(0, k + 1) + " &");
    r = "      " + r.slice(k + 2);
  }
  out.push(r);
  return out;
}

/** El botón: lee el modelo abierto y los resultados activos del visor, y descarga el .f90. */
export function exportarFortran(): void {
  const W = window as any;
  const st = W.__hekatanStates;
  if (!st?.nodes?.val?.length) { alert("No hay modelo abierto que exportar."); return; }
  const s = W.__hekatanSettings?.() ?? {};
  const g = (k: string) => String(s[k]?.val ?? s[k] ?? "none");
  const activos = { nodo: g("nodeResults"), barra: g("frameResults"), cascara: g("shellResults"), solido: g("solidResults") };
  // `__hekatanExample()` devuelve el ID del ejemplo abierto (no el objeto)
  const id = String(W.__hekatanExample?.() ?? "modelo");
  const sel = document.querySelector<HTMLSelectElement>("#hk-cad-tit .doc");
  const titulo = id !== "modelo" ? id : (sel?.textContent?.trim() || "Modelo de Hekatan Struct");
  const texto = fortranDeModelo(st, activos, { titulo, caso: W.__hekatanCaseId?.() ?? "" });
  const nombre = id.replace(/[^\w-]+/g, "_") + "_resultados.f90";
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([texto], { type: "text/x-fortran" }));
  a.download = nombre;
  document.body.appendChild(a); a.click(); a.remove();
  W.__hekatanUltimoFortran = texto;           // para pruebas
}
