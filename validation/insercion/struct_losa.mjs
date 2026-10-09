import { readFileSync } from "node:fs";
import { cargarFem } from "../../tests/lib/bundle.mjs";
const fem = await cargarFem();
const sap = JSON.parse(readFileSync("validation/insercion/sap_losa.json", "utf8"));
const E = 2.5e10, nu = 0.2, G = E / (2 * (1 + nu)), Lx = 4, H = 3, Q = 5000, t = 0.145;
const cp = process.argv[2] ?? "8";
const n = 4, h = Lx / n;
const N = [], idx = new Map(); const nodo = (x, y, z) => { const k = [x, y, z].map(v => v.toFixed(4)).join(","); if (!idx.has(k)) { idx.set(k, N.length); N.push([x, y, z]); } return idx.get(k); };
const els = [], tipo = [];
for (const [x, y] of [[0,0],[Lx,0],[Lx,Lx],[0,Lx]]) { els.push([nodo(x, y, 0), nodo(x, y, H)]); tipo.push("col"); }
for (let i = 0; i < n; i++) for (const [x0, y0, x1, y1] of [[i*h,0,(i+1)*h,0],[Lx,i*h,Lx,(i+1)*h],[Lx-i*h,Lx,Lx-(i+1)*h,Lx],[0,Lx-i*h,0,Lx-(i+1)*h]]) { els.push([nodo(x0, y0, H), nodo(x1, y1, H)]); tipo.push("viga"); }
for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { els.push([nodo(i*h, j*h, H), nodo((i+1)*h, j*h, H), nodo((i+1)*h, (j+1)*h, H), nodo(i*h, (j+1)*h, H)]); tipo.push("losa"); }
const ei = { elasticities: new Map(), poissonsRatios: new Map(), shearModuli: new Map(), densities: new Map(), areas: new Map(), momentsOfInertiaY: new Map(), momentsOfInertiaZ: new Map(), torsionalConstants: new Map(), thicknesses: new Map(), plateFormulations: new Map(), insertionOffsets: new Map() };
els.forEach((e, i) => { ei.elasticities.set(i, E); ei.poissonsRatios.set(i, nu); ei.shearModuli.set(i, G); ei.densities.set(i, 0);
  if (e.length === 2) { const col = tipo[i] === "col"; const [t2, t3] = col ? [0.25, 0.25] : [0.2, 0.4]; ei.areas.set(i, t2 * t3); ei.momentsOfInertiaZ.set(i, t2 * t3 ** 3 / 12); ei.momentsOfInertiaY.set(i, t3 * t2 ** 3 / 12);
    const a = Math.max(t2, t3), b = Math.min(t2, t3); ei.torsionalConstants.set(i, a * b ** 3 * (1 / 3 - 0.21 * (b / a) * (1 - b ** 4 / (12 * a ** 4))));
    if (!col && cp === "8") ei.insertionOffsets.set(i, [-0.2, 0]); }
  else { ei.thicknesses.set(i, t); ei.plateFormulations.set(i, 1); } });
const loads = new Map();
els.forEach((e, i) => { if (e.length !== 4) return; for (const nd of e) { const q = loads.get(nd) ?? [0, 0, 0, 0, 0, 0]; q[2] -= Q * h * h / 4; loads.set(nd, q); } });
const supports = new Map(); els.forEach((e, i) => { if (tipo[i] === "col") supports.set(e[0], [true, true, true, true, true, true]); });
const d = fem.deform(N, els, { supports, loads }, ei);
let mx = 0, dm = 0, mp = "";
for (const [k, s] of Object.entries(sap)) { const [x, y, z] = k.split(",").map(Number); const i = N.findIndex(p => Math.abs(p[0] - x) < 1e-6 && Math.abs(p[1] - y) < 1e-6 && Math.abs(p[2] - z) < 1e-6); if (i < 0) continue; const u = d.deformations.get(i);
  mx = Math.max(mx, Math.abs(s[2])); const e = Math.abs(s[2] - u[2]); if (e > dm) { dm = e; mp = k; } }
const c = N.findIndex(p => Math.abs(p[0] - 2) < 1e-6 && Math.abs(p[1] - 2) < 1e-6 && Math.abs(p[2] - H) < 1e-6);
console.log(`CP${cp}: centro SAP ${sap["2.000,2.000,3.000"][2].toExponential(6)} Struct ${d.deformations.get(c)[2].toExponential(6)} · máx dif uz ${(100 * dm / mx).toFixed(5)} % del máx (nudo ${mp}) · ${Object.keys(sap).length} nudos SAP`);
