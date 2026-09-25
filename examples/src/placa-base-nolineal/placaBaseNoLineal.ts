/**
 * PLACA BASE NO LINEAL (J2 + contacto) — PRUEBA LOCAL, solo en el servidor de desarrollo (no se publica:
 * el registro la añade con `import.meta.env.DEV`).
 *
 * Resultado del gemelo `hekatan-abaqus-bridge/baseplate/twin_j2.py` sobre EL MISMO .inp de Abaqus
 * (`twin_plastic.inp`: pedestal C3D8 + placa + columna, contacto HARD placa-pedestal, 4 anclajes, N = 80 kN +
 * M = 220 kN·m, acero J2 perfecto Fy = 250 MPa). Se dibuja la PIEL del sólido (caras exteriores de los C3D8)
 * con el campo del hexaedro al que pertenece cada cara. Datos: `datos.json` (datos_visor_placa_base.py).
 */
import type { ExampleDef } from "../workspace/exampleRegistry";
import datos from "./datos.json";

type Six = [number, number, number, number, number, number];

export const placaBaseNoLineal: ExampleDef = {
  id: "placa-base-nolineal",
  name: "Placa base NO LINEAL (J2 + contacto) vs Abaqus — local",
  category: "2️⃣ Shells · 🔩 Conexiones",
  defaultShellResult: "vonMises",
  availableShellResults: ["none", "vonMises", "displacementZ"],
  params: {
    campo: { default: 0, label: "Campo", options: { "von Mises Hekatan": 0, "von Mises Abaqus (placa)": 1, "PEEQ Hekatan (×10⁻⁶)": 2 } },
    ver: { default: 0, label: "Mostrar", options: { "Todo": 0, "Solo la placa": 1, "Placa + columna": 2 } },
  },
  computedLabels: () => {
    const r = (datos as any).resumen;
    return {
      "uplift Hekatan / Abaqus": `${r.uplift_H} / ${r.uplift_A} mm`,
      "PEEQ máx Hekatan / Abaqus": `${r.peeq_H.toExponential(2)} / ${r.peeq_A.toExponential(2)}`,
      "vM Gauss a Gauss (1600 pts)": `correlación ${r.corr_vm}`,
      "PEEQ Gauss a Gauss (112 pts)": `correlación ${r.corr_peeq}`,
      "Fy": `${r.fy_MPa} MPa (vM de la placa = 250.000 en los dos)`,
    };
  },
  build(p, states) {
    const d: any = datos;
    const campo = Math.round(p.campo ?? 0), ver = Math.round(p.ver ?? 0);
    const entra = (s: string) => ver === 0 || s === "PLACA" || (ver === 2 && s === "COLUMNA");
    const idx: number[] = []; d.caras.forEach((_: number[], k: number) => { if (entra(d.set[k])) idx.push(k); });
    // solo los nudos que usan las caras visibles
    const usa = new Map<number, number>(); const nodes: [number, number, number][] = [];
    const el = idx.map((k) => d.caras[k].map((n: number) => {
      if (!usa.has(n)) { usa.set(n, nodes.length); nodes.push(d.nodos[n]); }
      return usa.get(n)!;
    }));
    const vm = new Map<number, number[]>();
    idx.forEach((k, e) => {
      const v = campo === 0 ? d.vmH[k] : campo === 1 ? (d.vmA[k] ?? NaN) : d.peeq[k] * 1e6;
      vm.set(e, [v, v, v, v]);
    });
    const deformations = new Map<number, Six>();
    for (const [n, i] of usa) { const u = d.u[n]; deformations.set(i, [u[0], u[1], u[2], 0, 0, 0]); }
    const supports = new Map<number, [boolean, boolean, boolean, boolean, boolean, boolean]>();
    for (const n of d.apoyos) if (usa.has(n)) supports.set(usa.get(n)!, [true, true, true, true, true, true]);
    states.nodes.val = nodes as any;
    states.elements.val = el as any;
    states.nodeInputs.val = { supports } as any;
    states.elementInputs.val = { thicknesses: new Map(el.map((_, e) => [e, 0.001])) } as any;
    states.deformOutputs.val = { deformations } as any;
    const ao: any = { vonMises: vm };
    if (campo !== 2) ao.colorMapRanges = { vonMises: [0, 250000] };   // 0..Fy: lo que fluye sale en el tope
    states.analyzeOutputs.val = ao;
  },
};
