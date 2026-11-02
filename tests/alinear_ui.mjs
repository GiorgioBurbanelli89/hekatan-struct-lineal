// Test de ALINEAR en el CAD (navegador real, vite en :4600). Uso: node tests/alinear_ui.mjs
// Dibuja nudos con __hekatanDrawingPoints, los designa, alinea y comprueba coordenadas, ejes y Ctrl+Z.
import puppeteer from "puppeteer";
const b = await puppeteer.launch({ headless: "new", channel: "chrome", args: ["--no-sandbox"] });
const p = await b.newPage(); await p.setViewport({ width: 1500, height: 1000 });
const err = []; p.on("pageerror", (e) => err.push(e.message));
await p.goto("http://localhost:4600/workspace/?t=new-blank", { waitUntil: "networkidle2" });
const w = (ms) => new Promise((r) => setTimeout(r, ms)); await w(5000);
let ok = 0, mal = 0;
const check = (nom, cond, det = "") => { cond ? ok++ : mal++; console.log((cond ? "  ✓ " : "  ✗ ") + nom + (det ? "  " + det : "")); };
const pts = () => p.evaluate(() => (window.__hekatanDrawingPoints?.val || []).map((q) => q.map((v) => +v.toFixed(6))));
const poner = (P) => p.evaluate((P) => { window.__hekatanDrawingPoints.val = P; window.__hekatanDrawingPolylines.val = [[...P.keys()], []]; window.__hekatanRebuild?.(); }, P);
const todo = () => p.evaluate(() => window.__hekatanSelectAll?.());
const alinear = (ref, ejes) => p.evaluate((ref, ejes) => window.__hekatanAlignSelection(ref, ejes), ref, ejes);
const nuevo = () => p.evaluate(() => { window.__hekatanDrawingPoints.val = []; window.__hekatanDrawingPolylines.val = []; window.__hekatanClearSelection?.(); });

console.log("1) alinear en Y: tres nudos quedan en una fila");
await poner([[0, 0, 0], [5, 2, 0], [9, -3, 0]]); await todo();
let n = await alinear([0, 4, 0], { y: true });
let P = await pts();
check("movió 3 nudos", n === 3, `n=${n}`);
check("todos y=4", P.every((q) => q[1] === 4), JSON.stringify(P));
check("x intactas", P[0][0] === 0 && P[1][0] === 5 && P[2][0] === 9);
check("z intactas", P.every((q) => q[2] === 0));

console.log("2) alinear en Z (altura de un alzado)");
await nuevo(); await poner([[0, 0, 0], [6, 0, 2.5], [12, 0, 7]]); await todo();
n = await alinear([0, 0, 3], { z: true }); P = await pts();
check("todos z=3", P.every((q) => q[2] === 3), JSON.stringify(P));
check("movió solo los que no estaban (3)", n === 3);

console.log("3) varios ejes a la vez (X y Z) a un punto");
await nuevo(); await poner([[1, 1, 1], [4, 5, 6]]); await todo();
n = await alinear([10, 99, 20], { x: true, z: true }); P = await pts();
check("x=10 y z=20 en ambos", P.every((q) => q[0] === 10 && q[2] === 20), JSON.stringify(P));
check("y intactas (1 y 5)", P[0][1] === 1 && P[1][1] === 5);

console.log("4) idempotente: ya alineados → 0 y no ensucia el deshacer");
n = await alinear([10, 0, 20], { x: true, z: true });
check("segunda vez mueve 0", n === 0, `n=${n}`);

console.log("5) sin ejes marcados no toca nada");
await nuevo(); await poner([[0, 0, 0], [3, 3, 3]]); await todo();
n = await alinear([9, 9, 9], {}); P = await pts();
check("0 movidos y nudos iguales", n === 0 && P[1][0] === 3);

console.log("6) solo la selección: un nudo sin designar no se mueve");
await nuevo(); await poner([[0, 0, 0], [5, 2, 0], [9, -3, 0]]);
await p.evaluate(() => { window.__hekatanClearSelection?.(); });
n = await alinear([0, 4, 0], { y: true }); P = await pts();
check("sin selección → 0 movidos", n === 0 && P[1][1] === 2, `n=${n}`);

console.log("7) deshacer devuelve las posiciones");
await nuevo(); await poner([[0, 0, 0], [5, 2, 0], [9, -3, 0]]); await todo();
await alinear([0, 4, 0], { y: true });
await p.evaluate(() => window.__hekatanUndo?.()); await w(300); P = await pts();
check("Ctrl+Z restaura y=0,2,-3", P[0][1] === 0 && P[1][1] === 2 && P[2][1] === -3, JSON.stringify(P));

console.log("8) con barras: la geometría sigue conectada tras alinear");
await nuevo(); await poner([[0, 0, 0], [5, 2, 0], [9, -3, 0]]); await todo();
await alinear([0, 4, 0], { y: true });
const polys = await p.evaluate(() => (window.__hekatanDrawingPolylines?.val || []).filter((x) => x.length));
check("la polilínea conserva sus 3 nudos", polys.length === 1 && polys[0].length === 3, JSON.stringify(polys));

console.log(`\n${ok} ok · ${mal} fallan · errores de página: ${err.length}`); if (err.length) console.log(err);
await b.close(); process.exit(mal || err.length ? 1 : 0);
