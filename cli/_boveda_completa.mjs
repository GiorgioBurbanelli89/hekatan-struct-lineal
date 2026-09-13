// Bóveda completa sobre el IFC, con fotograma por paso (dev server 4600).
import puppeteer from "puppeteer";
const nav = await puppeteer.launch({ headless: "new", args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-angle=swiftshader"] });
const pag = await nav.newPage(); await pag.setViewport({ width: 1280, height: 720 });
const errs = []; pag.on("pageerror", (e) => errs.push("PE:" + e.message.slice(0, 160)));
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
let k = 0; const foto = async (n) => { await espera(400); await pag.screenshot({ path: `cli/shots/boveda_${String(k++).padStart(2, "0")}_${n}.png` }); };
const ev = (f, a) => pag.evaluate(f, a);
const proj = (P) => ev((P) => { const h = [...document.querySelectorAll("div")].find((d) => d.__ctx && d.__ctx.camera); const c = h.__ctx; const r = h.querySelector("canvas").getBoundingClientRect(); const V = Object.getPrototypeOf(c.camera.position).constructor; return P.map(([x, y, z]) => { const v = new V(x, y, z).project(c.camera); return { x: (v.x * 0.5 + 0.5) * r.width + r.left, y: (-v.y * 0.5 + 0.5) * r.height + r.top }; }); }, P);
const corte = (eje, pos, inv) => ev(({ eje, pos, inv }) => { const c = window.__hekatanClip; c.enableX = c.enableY = c.enableZ = false; if (eje) { c["enable" + eje] = true; c["pos" + eje] = pos; c["invert" + eje] = !!inv; } window.__hekatanClipApply?.(); }, { eje, pos, inv });
const rueda = async (x, y, n) => { await pag.mouse.move(x, y); for (let i = 0; i < n; i++) { await pag.mouse.wheel({ deltaY: -120 }); await espera(60); } };
const estado = () => ev(() => document.getElementById("hk-cad-status")?.textContent);
const cadena = () => ev(() => { const c = window.__hekatanCadenaIfc?.() || []; return { n: c.length, de: c[0]?.map((v) => +v.toFixed(2)), a: c[c.length - 1]?.map((v) => +v.toFixed(2)) }; });
await pag.goto("http://localhost:4600/workspace/?t=new-blank", { waitUntil: "networkidle2", timeout: 120000 }); await espera(2500);
await ev(async () => { try { window.__hekatanRibbon?.guia?.(false); localStorage.setItem("hk_guia_nuevo", "0"); window.__hekatanRibbonPlegar?.(true); } catch (e) {} try { window.__hekatanDrawingPoints.val = []; window.__hekatanDrawingPolylines.val = [[]]; window.__hekatanDrawingAreas.val = []; } catch (e) {} const M = await fetch("/ifc_church.json").then((r) => r.json()); window.__hekatanIfcMesh = M; window.__hekatanRebuild?.(); });
await espera(1500);
for (const id of ["hk-settings-toggle", "hk-pane-toggle"]) { try { await pag.click("#" + id); await espera(400); } catch (e) {} }
await ev(() => window.__hekatanSetView?.("iso")); await foto("iso_ifc");
// ── 1. corte X = 16.5, alzado lateral real, arco de la nave (cara superior = TOP) ──
await corte("X", 16.5, false); await ev(() => window.__hekatanSetView?.("elevY")); await espera(300);
let c = await proj([[16.5, 123.5, 4.5]]); await rueda(c[0].x, c[0].y, 7); await espera(300);
await ev(() => { window.__hekatanCadState.setTool("ifcline"); window.__hekatanArcSegs = 6; });
const P = await ev(() => window.__hekatanSeccionIfcPuntos?.(20000) || []);
const exterior = (y) => { const c = P.filter((p) => Math.abs(p[1] - y) < 0.4); c.sort((u, v) => v[2] - u[2]); return c[0]; };
const nave = exterior(121), ala = exterior(129.8);
let px = await proj([nave, ala]);
await pag.mouse.move(px[0].x, px[0].y - 3); await espera(400); console.log("nave:", JSON.stringify(await cadena())); await foto("nave_iluminada");
await pag.mouse.click(px[0].x, px[0].y - 3); await espera(600); console.log(await estado()); await foto("nave_copiada");
await ev(() => { window.__hekatanArcSegs = 5; });
await pag.mouse.move(px[1].x, px[1].y - 3); await espera(400); console.log("ala:", JSON.stringify(await cadena())); await foto("ala_iluminada");
await pag.mouse.click(px[1].x, px[1].y - 3); await espera(600); console.log(await estado()); await foto("ala_copiada");
// ── 1b. ¿queda hueco entre la nave y el ala en la cumbre? medir y copiar el tramo que falte ──
{
  const pts = await ev(() => (window.__hekatanDrawingPoints?.rawVal || []).map((p) => p.slice()));
  const yN = pts.slice(0, 7).map((p) => p[1]), yA = pts.slice(7, 13).map((p) => p[1]);
  console.log("nave y:", Math.min(...yN).toFixed(2), "→", Math.max(...yN).toFixed(2), "| ala y:", Math.min(...yA).toFixed(2), "→", Math.max(...yA).toFixed(2), "| hueco cumbre:", (Math.min(...yA) - Math.max(...yN)).toFixed(2), "m");
  const cumbre = exterior((Math.max(...yN) + Math.min(...yA)) / 2);
  const pc = await proj([cumbre]); await ev(() => { window.__hekatanArcSegs = 2; });
  await pag.mouse.move(pc[0].x, pc[0].y - 3); await espera(400); console.log("cumbre:", JSON.stringify(await cadena()));
  await pag.mouse.click(pc[0].x, pc[0].y - 3); await espera(500); console.log(await estado()); await foto("cumbre_copiada");
}
// ── 1c. el salto vertical en la cumbre (de 7.48 a 5.98 en y = 127.1): son varias piezas, se copian todas ──
{
  const yA = Math.min(...(await ev(() => (window.__hekatanDrawingPoints?.rawVal || []).slice(7, 13).map((p) => p[1]))));
  // pieza del salto que SÍ existe en el IFC en este corte: 7.07 → 7.48 (entre 5.98 y 7.07 no hay cara)
  { const c = P.filter((p) => Math.abs(p[1] - yA) < 0.15 && p[2] > 7.0 && p[2] < 7.3)[0];
    if (c) { const pv = await proj([c]); await ev(() => { window.__hekatanArcSegs = 2; }); await pag.mouse.move(pv[0].x + 3, pv[0].y); await espera(350); const cd = await cadena(); console.log("salto:", JSON.stringify([cd.de, cd.a])); if (cd.n) { await pag.mouse.click(pv[0].x + 3, pv[0].y); await espera(400); console.log("  →", await estado()); } } }
  console.log("perfil en la cumbre (y 126.9–127.4, z 5.9–7.6):", JSON.stringify(P.filter((p) => p[1] > 126.9 && p[1] < 127.4 && p[2] > 5.9 && p[2] < 7.6).map((p) => [+p[1].toFixed(2), +p[2].toFixed(2)]).sort((a, b) => a[1] - b[1])));
  await foto("salto_copiado");
  console.log("polilíneas:", JSON.stringify(await ev(() => (window.__hekatanDrawingPolylines?.rawVal || []).map((p) => p.length))));
}
// ── 2. extruir por piezas, con la extensión REAL de cada una (medida en el IFC):
//   nave + cumbre + saltos: x 13.2 → 26.1 (toda la nave);  ala: x 14.4 → 25.0 (el cuerpo delantero es más estrecho)
const nPoly = await ev(() => (window.__hekatanDrawingPolylines?.rawVal || []).filter((p) => p.length >= 2).length);
const idsNave = [0, ...Array.from({ length: nPoly - 2 }, (_, i) => i + 2)].map((i) => "poly:" + i);   // todo menos la ala (poly 1)
const ext = async (ids, dx, n) => ev(({ ids, dx, n }) => { window.__hekatanCadState.setTool("select"); window.__hekatanSelectIds(ids); const r = window.__hekatanExtrudeSelection(dx, 0, 0, n); window.__hekatanClearSelection(); window.__hekatanCadState.setTool(null); return r; }, { ids, dx, n });
const rA = await ext(idsNave, -1.65, 2), rB = await ext(idsNave, 1.6, 6);
// el ala va a las MISMAS estaciones x que la nave (14.85 … 24.5) para que el muro del escalón comparta nudos con las dos;
// y sus 0.4 m de más a cada lado (extensión real 14.45 … 24.9) se extruyen desde el borde, segmento a segmento
const rC = await ext(["poly:1"], -1.65, 1), rD = await ext(["poly:1"], 1.6, 5);
// segmentos (de paños) cuyos dos extremos cumplen `f`: "seg:P:S"
const segsDonde = (f) => ev((fSrc) => { const f = eval(fSrc); const P = window.__hekatanDrawingPoints.rawVal, PL = window.__hekatanDrawingPolylines.rawVal, A = new Set(window.__hekatanDrawingAreas.rawVal); const out = []; PL.forEach((pl, k) => { if (!A.has(k)) return; for (let s = 0; s + 1 < pl.length; s++) if (f(P[pl[s]]) && f(P[pl[s + 1]])) out.push("seg:" + k + ":" + s); }); return out; }, f.toString());
const extV = async (ids, dx, dy, dz, n) => ev(({ ids, dx, dy, dz, n }) => { window.__hekatanCadState.setTool("select"); window.__hekatanSelectIds(ids); const r = window.__hekatanExtrudeSelection(dx, dy, dz, n); window.__hekatanClearSelection(); window.__hekatanCadState.setTool(null); return r; }, { ids, dx, dy, dz, n });
const esAla = (p) => p[1] > 127.05 && p[2] < 6.2;   // el ala: y > 127.1, por debajo del escalón
const rE = await extV(await segsDonde((p) => Math.abs(p[0] - 14.85) < 1e-3 && p[1] > 127.05 && p[2] < 6.2), -0.4, 0, 0, 1);
const rF = await extV(await segsDonde((p) => Math.abs(p[0] - 24.5) < 1e-3 && p[1] > 127.05 && p[2] < 6.2), 0.4, 0, 0, 1);
console.log("extruido nave:", JSON.stringify(rA), JSON.stringify(rB), "ala:", JSON.stringify(rC), JSON.stringify(rD), "bordes ala ±0.4:", JSON.stringify(rE), JSON.stringify(rF), "áreas:", await ev(() => (window.__hekatanDrawingAreas?.rawVal || []).length));
// ── 2b. el ESCALÓN nave → ala (y ≈ 127.1): en el IFC no hay cara entre z 7.07 (pie del salto de la nave) y z 5.98
//   (arranque del ala). Sin ella la nave es un voladizo de 12 m apoyado solo en y = 115 (medido: 0.68 m de flecha en
//   Hekatan Y en ETABS). Se cierra con un muro: el borde inferior de la nave se extruye hasta el borde superior del ala.
{
  const v = await ev(() => { const P = window.__hekatanDrawingPoints.rawVal; const en = (f) => P.find(f); const a = en((p) => Math.abs(p[0] - 16.5) < 1e-3 && p[1] > 127.05 && p[2] > 6.5 && p[2] < 7.3); const b = en((p) => Math.abs(p[0] - 16.5) < 1e-3 && p[1] > 127.05 && p[2] > 5.5 && p[2] < 6.2); return a && b ? [b[0] - a[0], b[1] - a[1], b[2] - a[2], a, b] : null; });
  console.log("escalón: de", JSON.stringify(v?.[3]), "a", JSON.stringify(v?.[4]), "vector", JSON.stringify(v?.slice(0, 3)));
  const segs = await segsDonde((p) => p[1] > 127.05 && p[2] > 6.5 && p[2] < 7.3 && p[0] > 14.8 && p[0] < 24.55);
  const rG = await extV(segs, v[0], v[1], v[2], 1);
  console.log("muro del escalón:", segs.length, "segmentos →", JSON.stringify(rG));
  // fotograma: el escalón visto de lado (elevación YZ, corte X = 16.5) y en iso
  await corte("X", 16.5, true); await espera(300); await foto("muro_escalon_elevacion");
  await corte(null); await ev(() => { const h = [...document.querySelectorAll("div")].find((d) => d.__ctx && d.__ctx.camera); const c = h.__ctx; c.setActiveCamera(c.perspCamera); c.camera.position.set(34, 138, 14); c.camera.up.set(0, 0, 1); c.controls.target.set(20, 127, 5); c.camera.lookAt(20, 127, 5); c.controls.update(); c.render(); }); await espera(300); await foto("muro_escalon_iso");
}
await pag.keyboard.press("Escape"); await corte(null); await ev(() => window.__hekatanSetView?.("iso")); await foto("boveda_extruida_iso");
// ── 3. entrepiso desde su cara superior: corte Z ≤ 5.6 (quita la bóveda) y cámara desde arriba ──
// (sonda `cli/_sonda_entrepiso.mjs`: la cara superior del entrepiso está a z = 4.6, y ≈ 126.7, x 17–23)
await pag.keyboard.press("Escape"); await ev(() => window.__hekatanCadState.setTool(null));
await corte("Z", 5.6, false);
await ev(() => { const h = [...document.querySelectorAll("div")].find((d) => d.__ctx && d.__ctx.camera); const c = h.__ctx; c.setActiveCamera(c.perspCamera); c.camera.position.set(20, 108, 30); c.camera.up.set(0, 0, 1); c.controls.target.set(20, 125, 3); c.camera.lookAt(20, 125, 3); c.controls.update(); c.render(); window.__hekatanCadState.setTool("ifcface"); });
await espera(300);
px = await proj([[20, 126.7, 4.6]]);
await pag.mouse.move(px[0].x, px[0].y); await espera(500); console.log("cara entrepiso:", JSON.stringify(await ev(() => { const c = window.__hekatanCaraIfc?.(); return c && { tris: c.tris, plana: c.plana, normal: c.normal, contorno: c.contorno.map((q) => q.map((v) => +v.toFixed(2))) }; }))); await foto("entrepiso_iluminado");
await pag.mouse.click(px[0].x, px[0].y); await espera(800); console.log(await estado()); await foto("entrepiso_area");
// ── 3b. medición: nudos de los paños contra la superficie del IFC ──
{
  const m = await ev(() => {
    const h = [...document.querySelectorAll("div")].find((d) => d.__ctx && d.__ctx.camera); const sc = h.__ctx.scene;
    const mallas = []; sc.traverse((o) => { if (o.userData?.refIfc && o.isMesh) mallas.push(o); });
    const V = Object.getPrototypeOf(h.__ctx.camera.position).constructor;
    const RC = Object.getPrototypeOf(window.__hekatanRaycasterRef || {}).constructor;
    const P = window.__hekatanDrawingPoints.rawVal, A = window.__hekatanDrawingAreas.rawVal, PL = window.__hekatanDrawingPolylines.rawVal;
    const nudosPanos = new Set(); for (const a of A) for (const n of PL[a]) nudosPanos.add(n);
    const THREE_R = mallas[0] && mallas[0].constructor && window.THREE ? window.THREE.Raycaster : null;
    if (!window.__hekatanRaycast) return { error: "sin raycaster expuesto" };
    let peor = 0, suma = 0, n = 0, sinHit = 0;
    for (const i of nudosPanos) { const p = P[i]; const d = window.__hekatanRaycast(p, [0, 0, 1], mallas, 2.0); if (d == null) { sinHit++; continue; } peor = Math.max(peor, d); suma += d; n++; }
    const lista = []; for (const i of nudosPanos) { const p = P[i]; const d = window.__hekatanRaycast(p, [0, 0, 1], mallas, 2.0) ?? window.__hekatanRaycast([p[0] + 0.02, p[1] + 0.02, p[2]], [0, 0, 1], mallas, 2.0) ?? window.__hekatanRaycast([p[0] - 0.02, p[1] - 0.02, p[2]], [0, 0, 1], mallas, 2.0); lista.push({ p: p.map((v) => +v.toFixed(2)), d: d == null ? null : +(d * 100).toFixed(1) }); }
    lista.sort((a, b) => (b.d ?? -1) - (a.d ?? -1));
    const techo = (x, y) => window.__hekatanRaycast([x, y, 9], [0, 0, -1], mallas, 12);
    const ext = [[16.4, 125.3], [16.4, 126.0], [16.4, 127.5], [20, 125.3], [20, 127], [15.5, 126], [19.86, 131.0], [19.86, 130.0], [18.0, 131.0], [21.5, 131.0]].map(([x, y]) => x + "," + y + ":" + (techo(x, y) == null ? "—" : (9 - techo(x, y)).toFixed(2)));
    return { nudosPanos: nudosPanos.size, medidos: n, sinHit, peor_cm: +(peor * 100).toFixed(1), media_cm: +(suma / Math.max(1, n) * 100).toFixed(2), peores: lista.slice(0, 6), techoEnX: ext };
  });
  console.log("nudos vs superficie IFC:", JSON.stringify(m));
}
// ── 3c. exportar el dibujo a .heks (solo la bóveda: arcos + paños; el entrepiso queda fuera porque
//        sus muros no están modelados) → para compararlo con ETABS por OAPI ──
{
  const M = await ev(() => { const P = window.__hekatanDrawingPoints.rawVal, PL = window.__hekatanDrawingPolylines.rawVal, A = new Set(window.__hekatanDrawingAreas.rawVal); return { P, PL, A: [...A] }; });
  // nudos coincidentes (≤ 1 mm) → un solo id (por si quedara alguno duplicado)
  // (por distancia, no por clave redondeada: un nudo extruido que cae a 1e-12 m de otro puede redondear al otro lado del milímetro)
  const usados = new Map(); const idPorNudo = new Map();
  const idDe = (i) => { if (idPorNudo.has(i)) return idPorNudo.get(i); const p = M.P[i]; for (const [id, j] of usados) { const q = M.P[j]; if (Math.abs(p[0] - q[0]) < 1.5e-3 && Math.abs(p[1] - q[1]) < 1.5e-3 && Math.abs(p[2] - q[2]) < 1.5e-3) { idPorNudo.set(i, id); return id; } } const id = usados.size + 1; usados.set(id, i); idPorNudo.set(i, id); return id; };
  const L = ["selfweight 1"];
  const barras = [], panos = [];
  M.PL.forEach((pl, k) => { if (pl.length < 2) return; if (M.A.includes(k)) { if (pl.length >= 5 && pl[0] === pl[4] || pl.length === 4) panos.push(pl.slice(0, 4)); } else for (let i = 0; i + 1 < pl.length; i++) barras.push([pl[i], pl[i + 1]]); });
  // entrepiso fuera: paños con z ≈ 4.6 (horizontal a esa cota)
  const esEntrepiso = (q) => q.every((n) => Math.abs(M.P[n][2] - 4.6) < 0.05);
  const panosBoveda = panos.filter((q) => !esEntrepiso(q));
  for (const [a, b] of barras) { idDe(a); idDe(b); } for (const q of panosBoveda) q.forEach(idDe);
  for (const [id, i] of usados) L.push(`node ${id} ${M.P[i].map((v) => +v.toFixed(4)).join(" ")}`);
  // vigas de hormigón 0.30 × 0.50 (E 25e6 kN/m², ν 0.2, ρ 2.4 t/m³ — en el .heks rho es MASA, como en tests/datos): A, I22, I33, J
  const b = 0.30, h = 0.50, A = b * h, I22 = h * b ** 3 / 12, I33 = b * h ** 3 / 12, J = 0.141 * b ** 3 * h;
  barras.forEach(([a, c], k) => L.push(`frame ${k + 1} ${idDe(a)} ${idDe(c)} 25e6 ${A} ${I22.toExponential(4)} ${I33.toExponential(4)} ${J.toExponential(4)} 0.2 2.4`));
  panosBoveda.forEach((q, k) => L.push(`shell ${k + 1} ${q.map(idDe).join(" ")} 0.20 25e6 0 2.4`));   // shell id n1..n4 t E q rho — el 8º token es CARGA (+z), no ν
  // apoyos: arranque de la nave (z ≈ 4.02, sobre los muros) y pie del ala (z ≈ 0.4): articulados
  let nAp = 0; for (const [id, i] of usados) { const z = M.P[i][2]; if (Math.abs(z - 4.02) < 0.05 || z < 0.5) { L.push(`support ${id} 1 1 1 1 1 1`); nAp++; } }
  L.push("solve");   // sin esta línea cliModeler arma el modelo pero NO resuelve (deformaciones vacías)
  const fs = await import("node:fs"); fs.writeFileSync("cli/shots/boveda_capilla.heks", L.join("\n") + "\n");
  console.log("heks: nudos", usados.size, "barras", barras.length, "paños", panosBoveda.length, "(entrepiso fuera:", panos.length - panosBoveda.length, ") apoyos", nAp);
}
// ── 4. final: sin corte, iso, extruido ──
await pag.keyboard.press("Escape"); await corte(null); await ev(() => { window.__hekatanClearSelection?.(); window.__hekatanCadState.setTool(null); window.__hekatanSetView?.("iso"); const s = window.__hekatanSettings?.(); if (s?.extruded) s.extruded.val = true; }); await espera(1200); await foto("final_extruido");
await ev(() => { const h = [...document.querySelectorAll("div")].find((d) => d.__ctx && d.__ctx.camera); const c = h.__ctx; c.camera.position.set(-6, 98, 20); c.camera.up.set(0, 0, 1); c.controls.target.set(20, 124, 4); c.camera.lookAt(20, 124, 4); c.controls.update(); c.render(); }); await foto("final_extruido_2");
console.log("nudos:", await ev(() => (window.__hekatanDrawingPoints?.rawVal || []).length), "áreas:", await ev(() => (window.__hekatanDrawingAreas?.rawVal || []).length), "errs:", errs);
await nav.close();
