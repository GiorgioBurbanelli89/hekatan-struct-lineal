// Importador DXF — lee DXF ASCII (R12 en adelante) en el navegador.
//
// Cierra el viaje de ida y vuelta: hasta ahora el visor EXPORTABA DXF pero solo
// ABRÍA DWG, así que se podía ir de DWG a DXF y no al revés. Con esto los dos
// sentidos funcionan, y además se puede abrir directamente lo que escriben
// ezdxf, ETABS, SAP2000 o FreeCAD sin pasar por AutoCAD.
//
// No se toca el motor de Rust: el DXF es TEXTO, así que se parsea en JS y se
// devuelve el MISMO `doc` que produce `read_dwg_full` — {layers, entities} —
// para que `buildSegments()` haga el resto sin enterarse de por dónde vino.
//
// Qué entiende: LINE, LWPOLYLINE, POLYLINE (con sus VERTEX), CIRCLE, ARC,
// 3DFACE, SOLID, TEXT y MTEXT. Lo demás se cuenta y se ignora, y el recuento se
// devuelve para poder DECIRLO por pantalla en vez de callarlo — un plano al que
// le falta la mitad y no avisa es peor que uno que no abre.
//
// (POINT se ignora a propósito: `buildSegments` no lo dibuja, así que emitirlo
// solo serviría para contarlo como importado y no verlo.)

const NEG = -1;                       // color «de la capa» (BYLAYER)

/** Pares (código, valor) del DXF, ya troceados. */
function pares(texto) {
  // El DXF admite CRLF y espacios de relleno alrededor del código.
  const l = texto.split(/\r\n|\r|\n/);
  const out = [];
  for (let i = 0; i + 1 < l.length; i += 2) {
    const c = parseInt(l[i], 10);
    if (!isNaN(c)) out.push([c, l[i + 1]]);
  }
  return out;
}

/** ACI (índice de la paleta de AutoCAD) -> entero RGB, con la paleta del visor. */
function colorDe(aci, ACI) {
  if (aci === undefined || aci === NEG || aci === 256 || aci === 0) return null;
  return ACI[aci & 255] ?? 0xffffff;
}

export async function importarDXF(texto) {
  const { ACI } = await import('/aci_palette.js');
  const P = pares(texto);

  // ── TABLES: capas, con su color ──────────────────────────────────────────
  const layers = [{ name: '0', color: 0xffffff }];
  const idx = new Map([['0', 0]]);
  const capa = (nom) => {
    if (!nom) return 0;
    if (!idx.has(nom)) { idx.set(nom, layers.length); layers.push({ name: nom, color: 0xffffff }); }
    return idx.get(nom);
  };
  for (let i = 0; i < P.length; i++) {
    if (P[i][0] !== 0 || P[i][1] !== 'LAYER') continue;
    let nom = null, col = null;
    for (let j = i + 1; j < P.length && P[j][0] !== 0; j++) {
      if (P[j][0] === 2) nom = P[j][1];
      // el color de capa viene NEGATIVO cuando la capa está apagada
      if (P[j][0] === 62) col = Math.abs(parseInt(P[j][1], 10));
    }
    if (nom) {
      const k = capa(nom);
      if (col !== null) layers[k].color = ACI[col & 255] ?? 0xffffff;
    }
  }

  // ── ENTITIES ─────────────────────────────────────────────────────────────
  let ini = P.findIndex(([c, v], k) => c === 2 && v === 'ENTITIES' && P[k - 1]?.[1] === 'SECTION');
  if (ini < 0) ini = 0;
  const entities = [];
  const ignoradas = new Map();
  const num = (v) => { const x = parseFloat(v); return isFinite(x) ? x : 0; };

  // Trocear en entidades: cada (0, TIPO) abre una.
  const bloques = [];
  for (let i = ini; i < P.length; i++) {
    if (P[i][0] !== 0) continue;
    if (P[i][1] === 'ENDSEC' || P[i][1] === 'EOF') {
      if (bloques.length) break;                     // fin de ENTITIES
      continue;
    }
    bloques.push([P[i][1], i]);
  }

  for (let b = 0; b < bloques.length; b++) {
    const [tipo, i0] = bloques[b];
    const i1 = b + 1 < bloques.length ? bloques[b + 1][1] : P.length;
    // Los grupos se repiten (el 10 sale una vez por vértice en LWPOLYLINE), así
    // que se guardan como LISTA y se coge el primero cuando solo hay uno.
    const g = new Map();
    for (let i = i0 + 1; i < i1; i++) {
      if (!g.has(P[i][0])) g.set(P[i][0], []);
      g.get(P[i][0]).push(P[i][1]);
    }
    const uno = (c, d) => (g.has(c) ? num(g.get(c)[0]) : d);
    const todos = (c) => (g.get(c) || []).map(num);
    const li = capa(g.get(8)?.[0]);
    const c = colorDe(g.has(62) ? parseInt(g.get(62)[0], 10) : undefined, ACI)
      ?? layers[li].color;
    const push = (e) => entities.push(Object.assign({ li, c }, e));

    switch (tipo) {
      case 'LINE':
        push({ type: 'LINE',
               start: [uno(10, 0), uno(20, 0), uno(30, 0)],
               end: [uno(11, 0), uno(21, 0), uno(31, 0)] });
        break;
      case 'LWPOLYLINE': {
        // plana: la Z es la elevación (grupo 38), común a todos los vértices
        const xs = todos(10), ys = todos(20), z = uno(38, 0);
        const p = xs.map((x, k) => [x, ys[k] ?? 0, z]);
        if (p.length > 1) push({ type: 'POLYLINE', points: p,
                                 closed: (uno(70, 0) & 1) === 1 });
        break;
      }
      case 'POLYLINE': {
        // los vértices son entidades APARTE, hasta un SEQEND
        const p = [];
        let cerrada = (uno(70, 0) & 1) === 1;
        for (let k = b + 1; k < bloques.length; k++) {
          const [t2, j0] = bloques[k];
          if (t2 === 'SEQEND') { b = k; break; }
          if (t2 !== 'VERTEX') { b = k - 1; break; }
          const j1 = k + 1 < bloques.length ? bloques[k + 1][1] : P.length;
          let x = 0, y = 0, z = 0;
          for (let i = j0 + 1; i < j1; i++) {
            if (P[i][0] === 10) x = num(P[i][1]);
            if (P[i][0] === 20) y = num(P[i][1]);
            if (P[i][0] === 30) z = num(P[i][1]);
          }
          p.push([x, y, z]);
        }
        if (p.length > 1) push({ type: 'POLYLINE', points: p, closed: cerrada });
        break;
      }
      case 'CIRCLE':
        push({ type: 'CIRCLE',
               center: [uno(10, 0), uno(20, 0), uno(30, 0)], radius: uno(40, 0) });
        break;
      case 'ARC':
        push({ type: 'ARC',
               center: [uno(10, 0), uno(20, 0), uno(30, 0)], radius: uno(40, 0),
               start_angle: uno(50, 0) * Math.PI / 180,
               end_angle: uno(51, 0) * Math.PI / 180 });
        break;
      case '3DFACE':
      case 'SOLID': {
        const p = [0, 1, 2, 3].map(k => [uno(10 + k, 0), uno(20 + k, 0), uno(30 + k, 0)]);
        // el cuarto vértice repetido significa triángulo
        const q = (p[3][0] === p[2][0] && p[3][1] === p[2][1] && p[3][2] === p[2][2])
          ? p.slice(0, 3) : p;
        push({ type: 'POLYLINE', points: q, closed: true });
        break;
      }
      case 'TEXT':
      case 'MTEXT': {
        let t = (g.get(1) || []).join('');
        if (tipo === 'MTEXT') {
          // el MTEXT parte el texto largo en grupos 3 que van ANTES del 1
          t = (g.get(3) || []).join('') + t;
          t = t.replace(/\\P/g, '\n').replace(/\\[A-Za-z][^;]*;/g, '')
               .replace(/[{}]/g, '');
        }
        if (t.trim()) {
          push({ type: 'TEXT', text: t,
                 pos: [uno(10, 0), uno(20, 0), uno(30, 0)],
                 height: uno(40, 0.2) || 0.2,
                 rot: uno(50, 0) * Math.PI / 180 });
        }
        break;
      }
      default:
        if (tipo !== 'VERTEX' && tipo !== 'SEQEND') {
          ignoradas.set(tipo, (ignoradas.get(tipo) || 0) + 1);
        }
    }
  }

  return { doc: { layers, entities }, ignoradas };
}
