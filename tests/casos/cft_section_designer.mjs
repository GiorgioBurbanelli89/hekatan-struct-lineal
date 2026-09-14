/**
 * COLUMNA CFT contra SAP2000 (Section Designer) y ETABS (Filled Steel Tube).
 * Leido del binario el 2-sep-2026: SAP2000 24 no tiene seccion parametrica de
 * tubo relleno; se hace en Section Designer, y SAP recalcula A, I, As y J de las
 * formas (ignora los de la fila). ETABS si la tiene ("Filled Steel Tube") y usa
 * los MISMOS numeros que el SD (0.004 % entre los dos en la flecha lateral).
 * Lo que vigila:
 *   1. `cft` del .heks da las propiedades de CSI: A e I transformadas exactas,
 *      As por Timoshenko sobre la seccion transformada, J de Saint-Venant.
 *   2. la columna cierra contra SAP2000-SD y ETABS-FST (ux y uz).
 *   3. el s2k sale como SECTION DESIGNER (tubo + relleno), no como General, y
 *      el parser lo devuelve como CFT (re-exportar da otra vez SD).
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { empaquetar, R } from "../lib/bundle.mjs";
import { resolverHeks } from "../lib/heks.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
export const nombre = "cft-section-designer";
export const descripcion = "columna CFT: propiedades de CSI, flecha vs SAP2000-SD y ETABS-FST, s2k como Section Designer";

const pct = (a, b) => Math.abs(a - b) / Math.abs(b) * 100;

export async function correr() {
  const ref = JSON.parse(readFileSync(join(AQUI, "..", "datos", "cft_csi_ref.json"), "utf-8"));
  const mod = await empaquetar(`
    export { exportS2k } from "${R}/examples/src/shared/s2kExporter";
    export { parseS2k } from "${R}/examples/src/shared/s2kParser";
    export { exportE2k } from "${R}/examples/src/shared/e2kExporter";
    export { parseE2k } from "${R}/examples/src/shared/e2kParser";
    export { cftSectionEc } from "${R}/examples/src/shared/cadSections";
  `, "cft-sd");
  const filas = [];
  const fila = (que, medido, refv, limite, detalle) => {
    const d = pct(medido, refv);
    filas.push({ que, medido: d, limite, ok: d <= limite, detalle: `${detalle}: ${medido.toPrecision(7)} vs ${refv.toPrecision(7)}` });
  };
  // 1. propiedades de la seccion
  const t0 = Date.now();
  const c = mod.cftSectionEc(0.3, 0.3, 0.01, 2e8, 0.3, 2.5e7, 0.2);
  const ms = Date.now() - t0;
  fila("A transformada = SAP2000-SD", c.A, ref.sap2000_sd.Area, 1e-6, "m2");
  fila("I33 transformada = SAP2000-SD", c.Iz, ref.sap2000_sd.I33, 1e-6, "m4");
  fila("As2 (Timoshenko) ~ SAP2000-SD", c.As2, ref.sap2000_sd.As2, 1.0, `m2; ETABS da ${ref.etabs_fst.As2.toPrecision(5)} (los dos CSI se separan 0.3 %)`);
  fila("J (Saint-Venant compuesto) ~ SAP2000-SD", c.J, ref.sap2000_sd.J, 1.0, `m4 en ${ms} ms; ETABS ${ref.etabs_fst.J.toPrecision(5)}; Bredt del tubo solo daba 2.44e-4`);
  // 2. la columna
  const m = await resolverHeks(join(AQUI, "..", "datos", "cft_columna.heks"));
  const u = m.deformOutputs.deformations.get(1);
  fila("ux lateral vs SAP2000 Section Designer", u[0], ref.sap2000_sd.ux, 0.3, "m");
  fila("ux lateral vs ETABS Filled Steel Tube", u[0], ref.etabs_fst.ux, 0.3, "m");
  fila("uz axial vs SAP2000-SD", u[2], ref.sap2000_sd.uz, 1e-4, "m");
  filas.push({ que: "y NO es la General con 5/6·A (la de antes)", medido: pct(u[0], ref.general_2As3.ux), limite: 100, ok: pct(u[0], ref.general_2As3.ux) > 0.5, detalle: `General daba ${ref.general_2As3.ux.toPrecision(6)}: la diferencia es el As de CSI` });
  // 3. s2k como Section Designer
  const s2k = mod.exportS2k({ nodes: m.nodes, elements: m.elements, nodeInputs: m.nodeInputs, elementInputs: m.elementInputs, title: "cft", units: { force: "KN", length: "m" }, selfWtMult: 0 });
  // el fichero que se le da a SAP2000 (galpon-bodega-electoral/sap_cft_hekatan_s2k.py)
  const dir = join(AQUI, "..", "..", "..", "galpon-bodega-electoral", "sap_cft"); try { mkdirSync(dir, { recursive: true }); } catch {}
  writeFileSync(join(dir, "hekatan_cft.s2k"), s2k, "utf-8");
  const tieneSD = /Shape="SD Section"/.test(s2k), tubo = /SHAPE BOX\/TUBE[\s\S]*?Height=0\.3\s+Width=0\.3\s+FlngThick=0\.01\s+WebThick=0\.01/.test(s2k), rell = /SHAPE SOLID RECTANGLE[\s\S]*?Height=0\.28\s+Width=0\.28/.test(s2k);
  const matRell = /Material=FILL_25000000_r2\.4\s+UnitWeight=\S+\s+UnitMass=(\S+)\s+E1=(\S+)/.exec(s2k);
  filas.push({ que: "el s2k lleva la CFT como SD Section (no General)", crudo: true, medido: tieneSD ? "SD Section" : "General", limite: "SD Section", ok: tieneSD && !/SectionName=SEC1\s+Material=\S+\s+Shape=General/.test(s2k), detalle: "FRAME SECTION PROPERTIES 01" });
  filas.push({ que: "tablas SD: tubo 0.3x0.3x0.01 y relleno 0.28x0.28", crudo: true, medido: `${tubo ? "tubo" : "-"}/${rell ? "relleno" : "-"}`, limite: "tubo/relleno", ok: tubo && rell, detalle: "SECTION DESIGNER PROPERTIES 09 y 12" });
  filas.push({ que: "material del relleno PROPIO (FILL_) E = 2.5e7 con rho REAL del hormigón", crudo: true, medido: matRell ? `UnitMass=${matRell[1]}` : "no esta", limite: "UnitMass=2.4", ok: !!matRell && Math.abs(parseFloat(matRell[1]) - 2.4) < 1e-6 && Math.abs(parseFloat(matRell[2]) - 2.5e7) < 1, detalle: "masa por metro de SAP (Σ rho_i·A_i) = ρs·As + ρc·Ac = la de Hekatan desde el 14-sep-2026 (antes ρ = n·ρs y nombre MAT_ que chocaba con el deck)" });
  const q = mod.parseS2k(s2k);
  const sh = q.sectionShapes?.get(0);
  filas.push({ que: "parseS2k devuelve la forma CFT con fillE", crudo: true, medido: sh ? `${sh.type} ${sh.b}x${sh.h}x${sh.tw} fillE=${sh.fillE}` : "sin forma", limite: "CFT 0.3x0.3x0.01 fillE=25000000", ok: !!sh && sh.type === "CFT" && sh.b === 0.3 && sh.h === 0.3 && sh.tw === 0.01 && sh.fillE === 25000000, detalle: "SECTION DESIGNER PROPERTIES 09/12 + MATERIAL 02" });
  const ei2 = { ...q.elementInputs, sectionShapes: q.sectionShapes };
  const s2k2 = mod.exportS2k({ nodes: q.nodes, elements: q.elements, nodeInputs: q.nodeInputs, elementInputs: ei2, title: "cft", units: { force: "KN", length: "m" }, selfWtMult: 0 });
  const soloSD = (txt) => txt.split(/\r?\n/).filter(l => /SECTION DESIGNER PROPERTIES|ShapeName=|DesignType=|NumFibersD2=/.test(l)).join("|");
  const sd1 = soloSD(s2k), sd2 = soloSD(s2k2);
  filas.push({ que: "re-exportar el importado da las mismas tablas SD", crudo: true, medido: sd1 === sd2 ? "iguales" : "distintas", limite: "iguales", ok: sd1 === sd2 && sd1.length > 100, detalle: `${sd1.length} caracteres de tablas SD` });
  // 4. ETABS: el e2k sale como "Filled Steel Tube" (parametrica, con FILLMATERIAL)
  const e2k = mod.exportE2k({ nodes: m.nodes, elements: m.elements, nodeInputs: m.nodeInputs, elementInputs: m.elementInputs, title: "cft", units: { force: "KN", length: "m" }, weightMode: "manual", diaphragm: "none" });
  const dirE = join(AQUI, "..", "..", "..", "galpon-bodega-electoral", "etabs_cft"); try { mkdirSync(dirE, { recursive: true }); } catch {}
  writeFileSync(join(dirE, "hekatan_cft.e2k"), e2k, "utf-8");
  const fst = /FRAMESECTION\s+"[^"]+"\s+MATERIAL\s+"([^"]+)"\s+SHAPE\s+"Filled Steel Tube"\s+D\s+300\s+B\s+300\s+TF\s+10\s+TW\s+10\s+FILLMATERIAL\s+"([^"]+)"/.exec(e2k);
  const matFill = fst && new RegExp(`MATERIAL\\s+"${fst[2]}"\\s+SYMTYPE\\s+"Isotropic"\\s+E\\s+(\\S+)`).exec(e2k);
  filas.push({ que: "el e2k lleva la CFT como Filled Steel Tube 300x300x10 con FILLMATERIAL", crudo: true, medido: fst ? `${fst[1]} + ${fst[2]}` : "no esta (sale General)", limite: "acero + relleno", ok: !!fst, detalle: "la parametrica de ETABS; N y mm" });
  filas.push({ que: "el material de relleno del e2k tiene E = 25000 N/mm2", crudo: true, medido: matFill ? `E ${matFill[1]}` : "no esta", limite: "E 25000", ok: !!matFill && Math.abs(parseFloat(matFill[1]) - 25000) < 0.5, detalle: "2.5e7 kN/m2 = 25000 N/mm2" });
  // 5. importar un e2k de ETABS con Filled Steel Tube: antes era un rectangulo MACIZO de acero
  const q2 = mod.parseE2k(e2k);
  const iCft = [...q2.sectionShapes.entries()].find(([, sh]) => sh.type === "CFT")?.[0];
  const A2 = iCft !== undefined ? q2.elementInputs.areas.get(iCft) : 0, As2b = iCft !== undefined ? q2.elementInputs.shearAreasZ?.get(iCft) : 0, J2 = iCft !== undefined ? q2.elementInputs.torsionalConstants.get(iCft) : 0;
  fila("parseE2k: A transformada (no D·B maciza)", A2 || 0, 0.0214, 1e-6, "m2");
  fila("parseE2k: As2 de Timoshenko", As2b || 0, c.As2, 1e-6, "m2 (igual que cftSectionEc)");
  fila("parseE2k: J de Saint-Venant", J2 || 0, c.J, 1e-6, "m4");
  filas.push({ que: "parseE2k devuelve la forma CFT con fillE", crudo: true, medido: iCft !== undefined ? `fillE=${q2.sectionShapes.get(iCft).fillE}` : "sin CFT", limite: "fillE=25000000", ok: iCft !== undefined && Math.abs((q2.sectionShapes.get(iCft).fillE || 0) - 2.5e7) < 1, detalle: "con eso el .s2k de ese modelo vuelve a salir como Section Designer" });
  return filas;
}
