/**
 * openseesZapata.ts — el modelo ABIERTO (placa sobre resortes, con o sin suelo que tira) a OpenSeesPy y
 * a OpenSees Tcl. Lo que exporta, sacado de lo que resolvió cliModeler (mismos nudos, mismas cargas):
 *
 *   - losa: ShellMITC4 + ElasticMembranePlateSection (E, ν, t). Hekatan Shell-Thick = MITC4 con los
 *     modos incompatibles de Wilson en la flexión; OpenSees ShellMITC4 es el MITC4 sin ellos → en un
 *     cuadrado la diferencia es chica, se mide y se dice.
 *   - suelo: un zeroLength vertical por nudo (nudo de tierra fijo → nudo de la losa), k = ks·A_trib.
 *     Suelo SIN tracción: uniaxialMaterial ENT («Elastic-No Tension»: resiste compresión con E, cero en
 *     tracción; comprobado en OpenSeesPy 3.7.1 con testUniaxialMaterial, validation/zapata-levantamiento/
 *     opensees_ent_prueba.py). Suelo lineal: Elastic.
 *   - apoyos del plano (ux, uy, rz) y cargas nodales del caso: los mismos del .heks.
 *   - análisis: Newton, NormDispIncr 1e-12, 10 pasos (el ENT cambia de rigidez cuando un nudo se despega).
 *
 * Solo sirve para modelos de CÁSCARAS de 4 nudos + resortes verticales (zapatas, losas de cimentación).
 * Para barras está openseesIO.ts.
 */
export interface DatosOpenSees {
  nodes: number[][];
  shells: Array<{ n: number[]; t: number; E: number; nu: number }>;
  supports: Map<number, boolean[]>;
  loads: Map<number, number[]>;
  springs: Array<{ node: number; k: number; comp: boolean }>;
  titulo?: string;
}

const num = (x: number) => (Math.abs(x) < 1e-300 ? "0" : String(+x.toPrecision(12)));

export function opensees(d: DatosOpenSees, lenguaje: "py" | "tcl"): string {
  const py = lenguaje === "py";
  const L: string[] = [];
  const c = (t: string) => L.push((py ? "# " : "# ") + t);
  const cmd = (nombre: string, ...a: (string | number)[]) =>
    L.push(py ? `ops.${nombre}(${a.map((x) => (typeof x === "string" ? `'${x}'` : num(x))).join(", ")})`
              : `${nombre} ${a.map((x) => (typeof x === "string" ? x : num(x))).join(" ")}`);
  c(`${d.titulo ?? "Modelo de Hekatan Struct"} — exportado a OpenSees ${py ? "Py" : "Tcl"}. Unidades kN, m.`);
  c("Losa: ShellMITC4 + ElasticMembranePlateSection. Suelo: zeroLength vertical por nudo; ENT = no resiste tracción.");
  if (py) { L.push("import openseespy.opensees as ops", "import json, sys", "ops.wipe()"); } else L.push("wipe");
  cmd("model", "basic", "-ndm", 3, "-ndf", 6);
  const N = d.nodes.length, TIERRA = 1000000;
  d.nodes.forEach((q, i) => cmd("node", i + 1, q[0], q[1], q[2]));
  d.supports.forEach((s, i) => { if (s.some(Boolean)) cmd("fix", i + 1, ...s.map((b) => (b ? 1 : 0))); });
  // secciones: una por (E, ν, t)
  const secs = new Map<string, number>();
  d.shells.forEach((s) => { const k = `${s.E}|${s.nu}|${s.t}`; if (!secs.has(k)) { secs.set(k, secs.size + 1); cmd("section", "ElasticMembranePlateSection", secs.size, s.E, s.nu, s.t, 0.0); } });
  d.shells.forEach((s, e) => cmd("element", "ShellMITC4", e + 1, ...s.n.map((n) => n + 1), secs.get(`${s.E}|${s.nu}|${s.t}`)!));
  // resortes: nudo de tierra (fijo) debajo de cada nudo de la losa
  let mat = 0;
  d.springs.forEach((s, i) => {
    const q = d.nodes[s.node];
    cmd("node", TIERRA + i, q[0], q[1], q[2]);
    cmd("fix", TIERRA + i, 1, 1, 1, 1, 1, 1);
    mat++;
    cmd("uniaxialMaterial", s.comp ? "ENT" : "Elastic", mat, s.k);
    cmd("element", "zeroLength", N + 1000 + i, TIERRA + i, s.node + 1, "-mat", mat, "-dir", 3);
  });
  cmd("timeSeries", "Linear", 1);
  cmd("pattern", "Plain", 1, 1);
  if (!py) L[L.length - 1] += " {";
  d.loads.forEach((v, i) => { if (v.some((x) => Math.abs(x) > 1e-12)) cmd("load", i + 1, ...v.slice(0, 6)); });
  if (!py) L.push("}");
  cmd("system", "UmfPack"); cmd("numberer", "RCM"); cmd("constraints", "Plain");
  cmd("test", "NormDispIncr", 1e-12, 100); cmd("algorithm", "Newton");
  cmd("integrator", "LoadControl", 0.1); cmd("analysis", "Static");
  if (py) {
    L.push("ok = ops.analyze(10)");
    L.push(`w = {i: ops.nodeDisp(i, 3) for i in range(1, ${N + 1})}`);
    L.push(`out = {"ok": ok, "U3": w}`);
    L.push("if len(sys.argv) > 1: json.dump(out, open(sys.argv[1], 'w'))");
    L.push("print('analyze ->', ok, '  w min =', min(w.values()))");
  } else {
    L.push("set ok [analyze 10]");
    L.push(`set f [open "opensees_U3.txt" w]`);
    L.push(`for {set i 1} {$i <= ${N}} {incr i} { puts $f "$i [nodeDisp $i 3]" }`);
    L.push("close $f");
    L.push(`puts "analyze -> $ok"`);
  }
  return L.join("\n") + "\n";
}

/** Los datos para OpenSees salen de lo que cliModeler dejó en states + las vueltas del suelo. */
export function datosOpenSeesDeStates(states: any, titulo?: string): DatosOpenSees | null {
  const nodes = states?.nodes?.val as number[][]; const els = states?.elements?.val as number[][];
  const ni = states?.nodeInputs?.val, ei = states?.elementInputs?.val;
  if (!nodes?.length || !els?.length || !ni || !ei) return null;
  const shells: DatosOpenSees["shells"] = [];
  els.forEach((el, e) => { if (el.length === 4) shells.push({ n: el, t: ei.thicknesses?.get(e) ?? 0.2, E: ei.elasticities?.get(e) ?? 25e6, nu: ei.poissonsRatios?.get(e) ?? 0.2 }); });
  const springs: DatosOpenSees["springs"] = [...((globalThis as any).window?.__hekatanCliMuellesNodales ?? [])];
  for (const s of ni.springs ?? []) if (s.node >= 0 && s.dof === 2 && !springs.some((q) => q.node === s.node)) springs.push({ node: s.node, k: s.k, comp: false });
  return { nodes, shells, supports: ni.supports ?? new Map(), loads: ni.loads ?? new Map(), springs, titulo };
}
