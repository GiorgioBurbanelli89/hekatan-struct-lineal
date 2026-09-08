import * as THREE from "three";
import van, { State } from "vanjs-core";
import { Pane } from "tweakpane";

// Todo: refactor isInPlane to a function

export type Drawing = {
  points?: State<[number, number, number][]>;
  polylines?: State<number[][]>;
  // Índices de polylines marcadas como ÁREA (shell Q4). Una polilínea
  // cerrada NO es automáticamente un área — puede ser una cercha (frames
  // cerrados). Solo el tool "area" agrega entries acá.
  areas?: State<number[]>;
  gridTarget?: State<{
    position: [number, number, number];
    rotation: [number, number, number];
  }>;
};

export function drawing({
  drawingObj,
  gridObj,
  scene,
  getActiveCamera,
  controls,
  gridSize,
  derivedDisplayScale,
  rendererElm,
  viewerRender,
}: {
  drawingObj: Drawing;
  gridObj: THREE.GridHelper;
  scene: THREE.Scene;
  // Getter dinámico — devuelve la cámara activa AHORA (puede ser persp ↔ ortho).
  // Sin esto, el raycaster usa la cámara original cacheada y los clicks caen
  // en world coords que no coinciden con la vista renderizada (off-by-mucho).
  getActiveCamera: () => THREE.Camera;
  controls: THREE.Controls<any>;
  gridSize: number;
  derivedDisplayScale: State<number>;
  rendererElm: HTMLCanvasElement;
  viewerRender: () => void;
}) {
  // Init
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  // Helper: actualiza pointer NDC desde un event de mouse y devuelve la
  // CÁMARA que el caller debe usar para el raycaster (null si el evento
  // no debe procesarse). En split mode, esto permite dibujar desde el
  // panel izquierdo (cámara activa) Y el derecho (cámara secundaria).
  const setPointerFromEvent = (event: { clientX: number; clientY: number }): THREE.Camera | null => {
    const rect = rendererElm.getBoundingClientRect();
    const localX = event.clientX - rect.left;
    const localY = event.clientY - rect.top;
    const w = rect.width || 1;
    const h = rect.height || 1;
    const split = !!(window as any).__hekatanSplitMode;
    if (split) {
      const halfW = w / 2;
      if (localX >= halfW) {
        // Mouse en panel DERECHO → usar splitCamera (preview interactivo).
        // pointer NDC respecto a la mitad derecha del canvas.
        pointer.x = ((localX - halfW) / halfW) * 2 - 1;
        pointer.y = -(localY / h) * 2 + 1;
        const splitCam = (window as any).__hekatanSplitCamera as THREE.Camera | null;
        return splitCam ?? getActiveCamera();
      }
      // Mouse en panel IZQUIERDO → usar cámara activa.
      pointer.x = (localX / halfW) * 2 - 1;
    } else {
      pointer.x = (localX / w) * 2 - 1;
    }
    pointer.y = -(localY / h) * 2 + 1;
    return getActiveCamera();
  };

  // Plano gigante (10000×10000m) — invisible, sólo para raycaster.
  // Antes era gridSize×gridSize (20×20) y se desplazaba a (0,10,10) o
  // (10,10,0) según el plano de trabajo. Eso hacía que en YZ/XZ el plano
  // sólo cubriera un cuadrante chico del viewport ortográfico → si el
  // mouse iba fuera, el rayo no intersectaba nada y el cursor "se moría".
  // Tamaño 10000m garantiza que cualquier click razonable hit.
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(10000, 10000),
    new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,        // invisible visualmente
      depthWrite: false, // no escribe al z-buffer
    })
  );
  plane.visible = true;       // pero "visible" en el grafo (intersectObject lo respeta)
  plane.frustumCulled = false; // siempre evaluable por raycaster
  // CRITICAL: el plano DEBE estar en la escena para que raycaster.intersectObject
  // resuelva correctamente su matrixWorld. Sin esto, los clicks sintéticos
  // (y a veces los reales tras transforms) fallaban silenciosamente al no
  // intersectar nada → drawingPoints jamás se actualizaba.
  scene.add(plane);
  // Planos de raycast adicionales para los GRID PLANES XZ / YZ.
  // Existe `plane` arriba como plano XY global. Para que el cursor (snap +
  // intersección) trabaje sobre los planos XZ y YZ del grid (cuando están
  // activados en Settings → Grid → Plano XZ / Plano YZ), creamos otros 2
  // meshes invisibles. Los activamos vía window.__hekatanGridPlaneXZ/YZ
  // (booleans seteados por getViewer.ts cuando los toggles cambian).
  const mkInvisiblePlane = (rotX: number, rotY: number, rotZ: number) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(10000, 10000),
      new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, transparent: true, opacity: 0, depthWrite: false }),
    );
    m.rotation.set(rotX, rotY, rotZ);
    m.visible = false;
    m.frustumCulled = false;
    scene.add(m);
    return m;
  };
  // PlaneGeometry default está en XY. Para que sea XZ → rotX=π/2.
  // Para YZ → rotY=π/2 (así la normal apunta a +X y el plano queda en YZ).
  const planeXZ = mkInvisiblePlane(Math.PI / 2, 0, 0);
  const planeYZ = mkInvisiblePlane(0, Math.PI / 2, 0);
  // Flag: el plano de trabajo está INCLINADO (no axis-aligned). Lo setea la
  // van.derive de gridTarget según la normal. Cuando es true, el raycast usa
  // SOLO el plano de trabajo inclinado (ignora los planos de referencia
  // horizontales, que sino interceptan el click más cerca y aplastan el área).
  let inclinedPlaneActive = false;
  // Helper: raycast contra el plano de trabajo activo + los planos de
  // referencia visibles. El cursor cae sobre el plano que el rayo de cámara
  // intersecta primero (el "más al frente"). Esto incluye:
  //   - plane (workplane global XY/XZ/YZ a la Cota Z actual)
  //   - planeXZ / planeYZ (si los grid planes XZ/YZ están activos)
  //   - refPlaneMeshes (Z=0,3,6,9,12 si están visibles)
  //   - refFillXY/XZ/YZ (planos ortogonales del último punto del rubber)
  // CRÍTICO para que ORTO detecte el eje correcto según el plano hover:
  // si el cursor está sobre el plano XZ del último punto, el `point` tendrá
  // variación en X y Z (no solo en X como con el plane global XY).
  const intersectWorkPlane = () => {
    // PLANO INCLINADO activo → raycast SOLO el plano de trabajo (que ya está
    // inclinado vía gridTarget). Ignoramos planos de referencia/grid para que
    // el click caiga sobre la inclinación y el área salga inclinada de verdad.
    if (inclinedPlaneActive) {
      return raycaster.intersectObjects([plane], false);
    }
    // Sincronizar visibilidad de planeXZ/YZ con flags globales
    planeXZ.visible = !!(window as any).__hekatanGridPlaneXZ;
    planeYZ.visible = !!(window as any).__hekatanGridPlaneYZ;
    // PRIORIDAD 1: Planos ortogonales del último punto (XY/XZ/YZ).
    // Cuando están visibles, son la referencia ACTIVA del usuario — el rubber
    // band debe caer ahí, no en el plano global XY (que es gigante 10000m
    // y siempre "gana" por estar más cerca a la cámara). Sin esta
    // priorización, ORTO siempre detecta X o Y (nunca Z) en iso.
    // DESACOPLADO: los planos de referencia pueden estar VISIBLES (visual)
    // sin INTERCEPTAR el rayo. El raycast de los planos ortogonales es opt-in
    // (__hekatanOrthoRaycast === true). Por defecto OFF → el click cae en el
    // plano de trabajo (evita que en iso el rayo enganche el plano equivocado),
    // mientras los planos siguen viéndose tenues como guía.
    const orthoRaycast = (window as any).__hekatanOrthoRaycast === true;
    if (orthoRaycast && refFillXY.visible) {
      const orthoHits = raycaster.intersectObjects(
        [refFillXY, refFillXZ, refFillYZ], false,
      );
      if (orthoHits.length > 0) return orthoHits;
    }
    // PRIORIDAD 2: grid planes XZ/YZ del Settings (si activos) + planos
    // de referencia Z=0,3,6,9,12 (si visibles) + workplane XY global.
    const targets: THREE.Object3D[] = [plane];
    if (planeXZ.visible) targets.push(planeXZ);
    if (planeYZ.visible) targets.push(planeYZ);
    if (refPlanesGroup.visible && refPlaneMeshes.length > 0) {
      targets.push(...refPlaneMeshes);
    }
    return raycaster.intersectObjects(targets, false);
  };
  const points = new THREE.Points(
    new THREE.BufferGeometry(),
    new THREE.PointsMaterial()
  );

  const indicationPoint = new THREE.Points(
    new THREE.BufferGeometry(),
    // sizeAttenuation:false → size en PÍXELES (no en world units).
    // Antes, size era world-units con atenuación; al zoomear in el cuadrado
    // gris crecía hasta ser enorme. Ahora queda fijo a ~6px en pantalla.
    new THREE.PointsMaterial({ color: "gray", sizeAttenuation: false, size: 6 })
  );

  const activePoints = new THREE.Points(
    new THREE.BufferGeometry(),
    new THREE.PointsMaterial({ color: "orange", size: 0.1 })
  );
  scene.add(activePoints);

  // ── DIMENSION LABEL EN RUBBER BAND (sólo mientras se dibuja) ──
  // Sprite UNA SOLA vez con la longitud de la línea pendiente (último
  // punto → cursor). NO se persisten labels en segmentos ya confirmados.
  // El usuario los ve mientras prolonga, una vez click fijado se quita
  // (la coord readout sigue mostrando coords del cursor).
  // Rubber label EDITABLE — input HTML con tamaño FIJO en pixels (AutoCAD-style).
  // El usuario puede tipear un valor numérico + Enter → confirma el segundo
  // punto a esa distancia exacta en la dirección actual del cursor.
  // Auto-focus cuando se tipea un dígito durante un rubber band activo.
  const rubberLabelInput = document.createElement("input");
  rubberLabelInput.id = "hk-rubber-label";
  rubberLabelInput.type = "text";
  rubberLabelInput.spellcheck = false;
  // Tooltip de sintaxis estilo AutoCAD — aparece al hacer hover sobre el input
  rubberLabelInput.title =
    "Sintaxis estilo AutoCAD:\n" +
    "  5         → 5m en dirección del cursor (DDE)\n" +
    "  5,3,2     → coordenada absoluta (X,Y,Z)\n" +
    "  @5,3,2    → relativa al último punto\n" +
    "  5<45      → polar 2D: 5m a 45° desde origen\n" +
    "  @5<45     → polar relativa: 5m a 45° del último punto\n" +
    "  @5<45<30  → esférica 3D: 5m, azimuth 45°, elevación 30°";
  rubberLabelInput.style.cssText = [
    "position:fixed", "z-index:99996",
    "padding:3px 8px", "background:rgba(15,23,42,0.92)",
    "color:#22d3ee", "border:1.5px solid #22d3ee", "border-radius:4px",
    "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold",
    "transform:translate(-50%,-50%)", "white-space:nowrap",
    "outline:none", "width:80px", "text-align:center",
    "display:none",
    // CLAVE: el click pasa al lienzo (está justo en el punto donde clickeás).
    // El input se enfoca por código, así que no necesita recibir el click.
    "pointer-events:none",
  ].join(";") + ";";
  document.body.appendChild(rubberLabelInput);
  // State para "AutoCAD direct distance entry":
  //   - rubberStart: punto inicial del rubber band (último click)
  //   - rubberDir: dirección unitaria desde rubberStart al cursor
  //   - rubberCurrentLen: longitud actual del cursor (sólo display)
  let rubberStart: [number, number, number] | null = null;
  let rubberDir: [number, number, number] | null = null;
  // Flag: true cuando el usuario tipeó manualmente algo en el input. Mientras
  // sea true NO se sobreescribe el value con la cota live del cursor (sino
  // perderíamos lo que está tipeando). Se resetea al confirmar (Enter), al
  // hacer Esc, o al hacer un click nuevo.
  let rubberUserEditing = false;
  const _rubberMid = new THREE.Vector3();
  const updateRubberLabel = (ax: number, ay: number, az: number, bx: number, by: number, bz: number) => {
    const dx = bx - ax, dy = by - ay, dz = bz - az;
    const dL = Math.hypot(dx, dy, dz);
    if (dL < 0.01) { rubberLabelInput.style.display = "none"; return; }
    rubberStart = [ax, ay, az];
    rubberDir = [dx / dL, dy / dL, dz / dL];
    // Proyectar midpoint world → screen usando la cámara activa
    _rubberMid.set((ax+bx)/2, (ay+by)/2, (az+bz)/2);
    _rubberMid.project(getActiveCamera());
    const rect = rendererElm.getBoundingClientRect();
    const sx = rect.left + (_rubberMid.x * 0.5 + 0.5) * rect.width;
    const sy = rect.top + (-_rubberMid.y * 0.5 + 0.5) * rect.height;
    rubberLabelInput.style.left = sx + "px";
    rubberLabelInput.style.top = sy + "px";
    rubberLabelInput.style.display = "block";
    // Live update del value mientras el usuario NO esté editando manualmente.
    if (!rubberUserEditing) {
      rubberLabelInput.value = `${dL.toFixed(2)} m`;
      // Mantener el input enfocado (cursor parpadeante visible) y todo el
      // texto seleccionado — así tipear cualquier dígito reemplaza el valor
      // automáticamente, estilo AutoCAD/Revit. El user no necesita clickear.
      if (document.activeElement !== rubberLabelInput) {
        // No robar focus si está editando otro input (Tweakpane, etc.)
        const ae = document.activeElement;
        const isOtherInput = ae && (ae.tagName === "INPUT" || ae.tagName === "TEXTAREA")
                              && ae !== rubberLabelInput;
        if (!isOtherInput) rubberLabelInput.focus({ preventScroll: true });
      }
      // Seleccionar todo el texto: tipear lo reemplaza directamente
      try { rubberLabelInput.select(); } catch {}
    }
  };
  const hideRubberLabel = () => {
    rubberLabelInput.style.display = "none";
    rubberStart = null;
    rubberDir = null;
    rubberUserEditing = false;
    if (document.activeElement === rubberLabelInput) rubberLabelInput.blur();
  };
  // Confirma el endpoint a la distancia tipeada: nuevo punto = start + dir*L
  const commitTypedDistance = (lengthM: number) => {
    // Para tools 3D (col/wall/extp/extl) la "distancia" tipeada es la ALTURA
    // del elemento — la guardamos para que el próximo click la use.
    const curTool = ((window as any).__hekatanCadState?.get?.() as any)?.tool ?? "select";
    if (curTool === "offset") {
      pendingDist = lengthM;
      updateStatus(`⇉ DESFASE distancia ${lengthM} m — designe la línea y luego el lado.`);
      rubberLabelInput.blur();
      try { (window as any).__hekatanCadRefreshPrompt?.(); } catch {}
      return;
    }
    if (curTool === "circle" && pendingClicks.length === 1) {
      // "CIRCULO centro, radio 3": la cifra es el radio
      const c = pendingClicks[0];
      pendingClicks = [];
      (window as any).__hekatanDrawCircle?.(c[0], c[1], c[2], lengthM);
      updateStatus(`✓ Círculo r=${lengthM} m en (${c[0].toFixed(2)}, ${c[1].toFixed(2)}, ${c[2].toFixed(2)}).`);
      try { (window as any).__hekatanRebuild?.(); } catch {}
      try { (window as any).__hekatanCadRefreshPrompt?.(); } catch {}
      return;
    }
    if (curTool === "col" || curTool === "wall" || curTool === "extp" || curTool === "extl") {
      pendingHeight = lengthM;
      const labels: any = { col: "columna", wall: "pared", extp: "extrusión punto→línea", extl: "extrusión línea→área" };
      updateStatus(`📐 Altura ${lengthM}m memorizada — hacé el click para crear ${labels[curTool]}.`);
      rubberLabelInput.blur();
      return;
    }
    if (!rubberStart || !rubberDir || !drawingObj.polylines) return;
    // Si hay axis lock activo, OVERRIDE la dirección al eje correspondiente.
    // Sin esto, "Lock Z + tipear 3 + Enter" usaría la dirección del cursor
    // al último hover (puede no ser vertical).
    let dx = rubberDir[0], dy = rubberDir[1], dz = rubberDir[2];
    if (axisLock === "x") { dx = Math.sign(dx) || 1; dy = 0; dz = 0; }
    else if (axisLock === "y") { dx = 0; dy = Math.sign(dy) || 1; dz = 0; }
    else if (axisLock === "z") { dx = 0; dy = 0; dz = Math.sign(dz) || 1; }
    const ex = rubberStart[0] + dx * lengthM;
    const ey = rubberStart[1] + dy * lengthM;
    const ez = rubberStart[2] + dz * lengthM;
    // Agregar punto + extender la polilínea actual (mismo flujo que click)
    if ((window as any).__hekatanPushUndo) (window as any).__hekatanPushUndo();
    drawingObj.points.val = [...drawingObj.points.rawVal, [ex, ey, ez]];
    const polys = drawingObj.polylines.rawVal;
    const last = polys.length ? polys[polys.length - 1] : [];
    drawingObj.polylines.val = [
      ...polys.slice(0, -1),
      [...last, drawingObj.points.rawVal.length - 1],
    ];
    rubberLabelInput.blur();
    try { (window as any).__hekatanRebuild?.(); } catch {}
    viewerRender();
  };
  // ── Parser estilo AutoCAD para el input del rubber label ──
  // Acepta:
  //   "5"         → DDE: 5m en dirección del cursor
  //   "5,3"       → absCart 2D (x=5, y=3, z=0)
  //   "5,3,2"     → absCart 3D
  //   "@5,3"      → relCart 2D desde último punto (Δx=5, Δy=3, Δz=0)
  //   "@5,3,2"    → relCart 3D
  //   "5<45"      → absPolar 2D (5m a 45° desde origen, plano XY)
  //   "@5<45"     → relPolar 2D (5m a 45° desde último punto)
  //   "@5<45<30"  → relSpherical 3D (5m, azimuth 45°, elevación 30°)
  type ParsedInput =
    | { kind: "length"; L: number }
    | { kind: "absCart"; x: number; y: number; z: number }
    | { kind: "relCart"; dx: number; dy: number; dz: number }
    | { kind: "absPolar"; L: number; ang: number }
    | { kind: "relPolar"; L: number; ang: number }
    | { kind: "relSpherical"; L: number; az: number; el: number }
    | null;
  const parseAutoCadInput = (raw: string): ParsedInput => {
    let s = raw.trim().toLowerCase().replace(/m$/g, "").trim();
    if (!s) return null;
    const isRel = s.startsWith("@");
    if (isRel) s = s.slice(1);
    // Polar / esférica: contiene "<"
    if (s.includes("<")) {
      const parts = s.split("<").map(p => parseFloat(p.trim()));
      if (parts.some(isNaN)) return null;
      if (parts.length === 2) {
        const [L, ang] = parts;
        return isRel ? { kind: "relPolar", L, ang } : { kind: "absPolar", L, ang };
      }
      if (parts.length === 3 && isRel) {
        const [L, az, el] = parts;
        return { kind: "relSpherical", L, az, el };
      }
      return null;
    }
    // Cartesiana: contiene ","
    if (s.includes(",")) {
      const parts = s.split(",").map(p => parseFloat(p.trim()));
      if (parts.some(isNaN)) return null;
      const [x, y, z = 0] = parts;
      return isRel ? { kind: "relCart", dx: x, dy: y, dz: z }
                   : { kind: "absCart", x, y, z };
    }
    // Solo número → DDE (longitud)
    const v = parseFloat(s);
    if (isNaN(v) || v <= 0) return null;
    return { kind: "length", L: v };
  };
  // Convierte cualquier ParsedInput en el punto FINAL (x,y,z) que se agrega
  // a la polilínea. Necesita rubberStart (último punto) para los modos rel.
  const resolveParsedInput = (p: ParsedInput): [number, number, number] | null => {
    if (!p) return null;
    if (p.kind === "absCart") return [p.x, p.y, p.z];
    if (p.kind === "relCart") {
      if (!rubberStart) return null;
      return [rubberStart[0] + p.dx, rubberStart[1] + p.dy, rubberStart[2] + p.dz];
    }
    if (p.kind === "absPolar") {
      const a = p.ang * Math.PI / 180;
      return [p.L * Math.cos(a), p.L * Math.sin(a), 0];
    }
    if (p.kind === "relPolar") {
      if (!rubberStart) return null;
      const a = p.ang * Math.PI / 180;
      return [rubberStart[0] + p.L * Math.cos(a),
              rubberStart[1] + p.L * Math.sin(a),
              rubberStart[2]];
    }
    if (p.kind === "relSpherical") {
      if (!rubberStart) return null;
      const az = p.az * Math.PI / 180;  // azimuth (XY plane angle)
      const el = p.el * Math.PI / 180;  // elevation (Z angle)
      const horiz = p.L * Math.cos(el);
      return [rubberStart[0] + horiz * Math.cos(az),
              rubberStart[1] + horiz * Math.sin(az),
              rubberStart[2] + p.L * Math.sin(el)];
    }
    return null;  // length → manejado aparte por commitTypedDistance
  };
  // Commit un punto absoluto (x,y,z) — equivalente a un click en esa coord.
  const commitAbsolutePoint = (pt: [number, number, number]) => {
    if (!drawingObj.polylines) return;
    if ((window as any).__hekatanPushUndo) (window as any).__hekatanPushUndo();
    drawingObj.points.val = [...drawingObj.points.rawVal, pt];
    const polys = drawingObj.polylines.rawVal;
    const last = polys.length ? polys[polys.length - 1] : [];
    drawingObj.polylines.val = [
      ...polys.slice(0, -1),
      [...last, drawingObj.points.rawVal.length - 1],
    ];
    // El punto tecleado pasa a ser el origen del siguiente relativo: sin esto
    // «0,0,3» + «@6,0,0» por la caja de comandos daba «desconocido», porque
    // rubberStart solo lo fijaba el ratón (updateRubberLabel) y con el
    // teclado nunca llegaba a existir. Medido el 8-sep-2026 capturando el
    // vídeo 2 de School: 3 coordenadas → 1 nudo y 0 tramos.
    rubberStart = pt;
    rubberLabelInput.blur();
    try { (window as any).__hekatanRebuild?.(); } catch {}
    viewerRender();
    try { (window as any).__hekatanCadRefreshPrompt?.(); } catch {}
  };

  // Exponer para que la barra de comandos pueda colocar un punto desde una
  // COORDENADA tipeada: "1,1,1" (abs), "@5,3" (rel), "5<45" (polar), "5" (DDE).
  // Devuelve true si pudo ubicar el punto.
  (window as any).__hekatanTypeCoord = (raw: string): boolean => {
    const parsed = parseAutoCadInput(raw);
    if (!parsed) return false;
    if (parsed.kind === "length") { commitTypedDistance(parsed.L); return true; }
    const pt = resolveParsedInput(parsed);
    if (!pt) return false;
    // El punto tecleado se trata EXACTAMENTE como un clic en ese sitio: la
    // misma funcion reparte por herramienta (linea, circulo, muro, mover...).
    procesarClic(new THREE.Vector3(pt[0], pt[1], pt[2]), null);
    rubberStart = pt;
    rubberLabelInput.blur();
    try { (window as any).__hekatanCadRefreshPrompt?.(); } catch {}
    return true;
  };

  // Keydown del input — Enter confirma, Esc finaliza, X/Y/Z se delegan al
  // handler global para axis lock, y cualquier dígito marca "userEditing"
  // para que el value no se pise con la cota live mientras el user tipea.
  rubberLabelInput.addEventListener("keydown", (ev: KeyboardEvent) => {
    if (ev.key === "Enter") {
      ev.preventDefault();
      const parsed = parseAutoCadInput(rubberLabelInput.value);
      if (!parsed) return;
      rubberUserEditing = false;
      // DDE (solo longitud) usa commitTypedDistance que aplica axisLock
      if (parsed.kind === "length") {
        commitTypedDistance(parsed.L);
        updateStatus(`✏ DDE ${parsed.L}m aplicado en dirección actual`);
      } else {
        const pt = resolveParsedInput(parsed);
        if (!pt) return;
        commitAbsolutePoint(pt);
        const k = parsed.kind;
        updateStatus(`✏ ${k} → (${pt[0].toFixed(2)}, ${pt[1].toFixed(2)}, ${pt[2].toFixed(2)})`);
      }
      return;
    }
    if (ev.key === "Escape") {
      ev.preventDefault();
      rubberUserEditing = false;
      rubberLabelInput.blur();
      // Esc también finaliza dibujo (manejado por handler global)
      return;
    }
    // Delegar X/Y/Z al global handler (axis lock) — NO insertar como texto
    const k = ev.key.toLowerCase();
    if (k === "x" || k === "y" || k === "z") {
      ev.preventDefault();
      // Disparar manualmente el global handler vía un keydown sintético sería
      // raro — mejor: replicar la lógica acá directamente. Pero como el
      // global handler escucha en window, podemos dispatcher un evento.
      // Más simple: hacer toggle directo aquí si el global ya escucha:
      // ya que ev.preventDefault NO previene el bubbling al window listener,
      // dejamos que el global lo procese. Pero antes restauramos la
      // selección para que el cursor quede visible al volver el value.
      setTimeout(() => {
        if (!rubberUserEditing && rubberLabelInput.style.display === "block") {
          try { rubberLabelInput.select(); } catch {}
        }
      }, 0);
      return;
    }
    // Si el user tipea un dígito / punto / minus / Backspace / Delete →
    // marcar como editing. La selección "todo seleccionado" hace que el
    // primer dígito reemplace el value live ("6.95 m" → "5").
    if (/^[0-9.\-]$/.test(ev.key) || ev.key === "Backspace" || ev.key === "Delete") {
      rubberUserEditing = true;
    }
  });
  // Auto-focus + intercept cuando el usuario tipea un dígito durante rubber band
  // activo (igual a AutoCAD: empezás a tipear y el "campo de distancia" agarra
  // el foco automáticamente sin tener que clickear nada).
  window.addEventListener("keydown", (ev: KeyboardEvent) => {
    if (!rubberStart || !rubberDir) return;
    if (document.activeElement === rubberLabelInput) return;
    // Ignorar si está editando otro input (Tweakpane, etc.)
    const ae = document.activeElement;
    if (ae && (ae.tagName === "INPUT" || ae.tagName === "TEXTAREA")) return;
    // Solo agarrar dígitos / punto / minus
    if (/^[0-9.\-]$/.test(ev.key)) {
      rubberLabelInput.value = ev.key;
      rubberLabelInput.focus();
      // Coloca el cursor al final del input (acabamos de escribir 1 char)
      rubberLabelInput.setSelectionRange(1, 1);
      ev.preventDefault();
    }
  });

  // ── COORD READOUT — texto flotante con coord del cursor (X, Y, Z) ──
  const coordReadout = document.createElement("div");
  coordReadout.id = "hk-coord-readout";
  coordReadout.style.cssText = [
    "position:fixed", "pointer-events:none", "z-index:99997",
    "padding:4px 8px", "background:rgba(15,23,42,0.92)",
    "color:#22d3ee", "border:1px solid #22d3ee", "border-radius:4px",
    "font-family:Consolas,monospace", "font-size:11px",
    "transform:translate(12px,-22px)", "white-space:nowrap",
    "display:none",
  ].join(";") + ";";
  coordReadout.textContent = "X=0.00  Y=0.00  Z=0.00";
  document.body.appendChild(coordReadout);

  // ── PANEL FIJO DE COORDS (siempre visible, top-right del canvas) ──
  // Estilo AutoCAD/Revit: las coords del cursor SIEMPRE se ven en una
  // posición fija (no al lado del cursor), incluso cuando el cursor está
  // sobre paneles. Útil para usuarios que prefieren un readout estable.
  // Cosa diferente del coordReadout que sigue al cursor con hover info.
  // Posicionado top-CENTER del canvas (entre el toolbar y el Properties Pane);
  // cuando el Properties Pane se muestra, este panel no choca porque tiene
  // top más arriba (4px vs 8px del Properties).
  const coordFixed = document.createElement("div");
  coordFixed.id = "hk-coord-fixed";
  coordFixed.style.cssText = [
    "position:fixed", "pointer-events:none", "z-index:99998",
    "right:80px", "top:10px",
    "padding:6px 14px", "background:rgba(15,23,42,0.92)",
    "color:#22d3ee", "border:1px solid rgba(34,211,238,0.55)",
    "border-radius:5px", "font-family:Consolas,monospace",
    "font-size:13px", "font-weight:500", "white-space:nowrap",
    "letter-spacing:0.3px",
    "box-shadow:0 2px 8px rgba(0,0,0,0.4)",
    "backdrop-filter:blur(4px)",
  ].join(";") + ";";
  coordFixed.textContent = "X=0.00  Y=0.00  Z=0.00";
  document.body.appendChild(coordFixed);

  // ── RUBBER BAND — línea de preview/prolongación cursor → último punto ──
  // Mientras el usuario mueve el mouse con tool "line"/"polyline" activa,
  // se ve una línea cyan dashed desde el último punto dibujado hasta la
  // posición actual del cursor. Visible en cualquier vista (planta/iso/elev).
  const rubberBand = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0),
    ]),
    new THREE.LineDashedMaterial({
      color: 0x22d3ee, dashSize: 0.2, gapSize: 0.1,
      transparent: true, opacity: 0.85, linewidth: 2,
    })
  );
  rubberBand.frustumCulled = false;
  rubberBand.visible = false;
  scene.add(rubberBand);

  // ── PREVIEW del ÁREA LIBRE (polígono) ──
  // Línea cyan que muestra el contorno del polígono mientras se clickea.
  const polyAreaPreview = new THREE.Line(
    new THREE.BufferGeometry(),
    new THREE.LineBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.9 }),
  );
  polyAreaPreview.frustumCulled = false;
  polyAreaPreview.visible = false;
  scene.add(polyAreaPreview);
  // Vértices del polígono de área libre en curso (NO se agregan a drawingObj
  // hasta cerrar — así evitamos nodos huérfanos si se cancela).
  let polyAreaPts: [number, number, number][] = [];

  // ── PLANO DE TRABAJO INCLINADO — guía visible (GRILLA de referencia) ──
  // Relleno semitransparente + borde + LÍNEAS DE GRILLA cada 1 m, orientado al
  // plano inclinado (UCS por 3 puntos). Sirve de REFERENCIA para dibujar
  // (líneas, áreas, todo) sobre ese plano. Las geometrías se reconstruyen al
  // tamaño real en __hekatanSetInclinedPlaneFrom3 (sin escalar el grupo, para
  // que el paso de 1 m sea real).
  const inclinedHelper = new THREE.Group();
  const inclinedFill = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.08, side: THREE.DoubleSide, depthWrite: false }),
  );
  const inclinedBorder = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.PlaneGeometry(1, 1)),
    new THREE.LineBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.85 }),
  );
  const inclinedGrid = new THREE.LineSegments(
    new THREE.BufferGeometry(),
    new THREE.LineBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.30 }),
  );
  // Rellena la geometría del grid en el plano XY local (z=0), de -half..half
  // cada `step`, para que el grupo (orientado al plano) lo muestre inclinado.
  const buildInclinedGrid = (half: number, step: number) => {
    const verts: number[] = [];
    const n = Math.ceil(half / step);
    for (let i = -n; i <= n; i++) {
      const c = i * step;
      verts.push(-half, c, 0, half, c, 0);   // líneas paralelas al eje u
      verts.push(c, -half, 0, c, half, 0);   // líneas paralelas al eje v
    }
    inclinedGrid.geometry.dispose();
    inclinedGrid.geometry = new THREE.BufferGeometry();
    inclinedGrid.geometry.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  };
  inclinedHelper.add(inclinedFill, inclinedBorder, inclinedGrid);
  inclinedHelper.visible = false;
  inclinedHelper.frustumCulled = false;
  scene.add(inclinedHelper);

  // ── EJES DE PROLONGACIÓN (Ortho/Polar tracking) ──
  // Líneas dashed desde el último punto en direcciones X/Y/Z + diagonales
  // 45°. Aparecen cuando el cursor está cerca de uno de esos ángulos.
  const polarLines = new THREE.Group();
  polarLines.frustumCulled = false;
  polarLines.visible = false;
  scene.add(polarLines);
  const mkPolarLine = (col: number) => {
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0),
    ]);
    const mat = new THREE.LineDashedMaterial({
      color: col, dashSize: 0.15, gapSize: 0.08,
      transparent: true, opacity: 0.5, linewidth: 1,
    });
    return new THREE.Line(geo, mat);
  };
  const polarX = mkPolarLine(0xff0000);  // rojo X
  const polarY = mkPolarLine(0x00ff00);  // verde Y
  const polarZ = mkPolarLine(0x0088ff);  // azul Z
  polarLines.add(polarX, polarY, polarZ);
  // ── Planos de referencia ortogonales (estilo SketchUp inferencing) ──
  // 3 rectángulos coloreados centrados en el último punto, uno por cada
  // plano principal (XY verde / XZ rojo / YZ azul). Sirven como guía visual
  // y snap targets — el cursor engancha al plano cuya normal es más
  // perpendicular al rayo de cámara.
  const mkRefPlaneRect = (col: number) => {
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0),
      new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0),
    ]);
    const mat = new THREE.LineBasicMaterial({
      // Bordes de los planos ortogonales — antes 0.9, luego 0.45. Bajado a
      // 0.20: que sean una guía MUY sutil, sin tapar ni dominar la vista.
      color: col, transparent: true, opacity: 0.20,
      depthTest: false,
    });
    const loop = new THREE.LineLoop(geo, mat);
    loop.renderOrder = 997;
    loop.frustumCulled = false;
    return loop;
  };
  const refPlaneXY = mkRefPlaneRect(0x34d399);  // verde — plano XY (perp a Z)
  const refPlaneXZ = mkRefPlaneRect(0xff3344);  // rojo  — plano XZ (perp a Y)
  const refPlaneYZ = mkRefPlaneRect(0x60a5fa);  // azul  — plano YZ (perp a X)
  // ── Grupo SEPARADO para los planos de referencia ortogonales (XY/XZ/YZ) ──
  // Antes estaban dentro de polarLines, pero polarLines.visible solo se hace
  // true durante el rubber band. Eso ocultaba los planos aunque el usuario
  // los activara con el toggle. Ahora viven en su propio grupo controlado
  // únicamente por __hekatanSetOrthoPlanes / __hekatanShowOrthoPlanes.
  // (NOTA: el otro `refPlanesGroup` más abajo en este archivo es para los
  // planos Z=0,3,6,9,12 — DIFERENTES; por eso este se llama orthoRefGroup.)
  const orthoRefGroup = new THREE.Group();
  orthoRefGroup.frustumCulled = false;
  orthoRefGroup.visible = false;
  scene.add(orthoRefGroup);
  orthoRefGroup.add(refPlaneXY, refPlaneXZ, refPlaneYZ);
  // ── Fill semitransparente para resaltar el área del plano ──
  // Cuando el cursor está cerca de un plano, el fill aumenta la opacity
  // (highlight) — facilita identificar visualmente sobre qué plano cae el
  // próximo click.
  const mkRefPlaneFill = (col: number) => {
    const geo = new THREE.PlaneGeometry(1, 1);
    const mat = new THREE.MeshBasicMaterial({
      // Fill semitransparente del plano — opacity inicial muy baja (0.06).
      // Apenas tinta el área para identificar el plano sin tapar geometría.
      color: col, transparent: true, opacity: 0.06,
      side: THREE.DoubleSide, depthWrite: false,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.frustumCulled = false;
    mesh.renderOrder = 996;
    return mesh;
  };
  const refFillXY = mkRefPlaneFill(0x34d399);
  const refFillXZ = mkRefPlaneFill(0xff3344);
  const refFillYZ = mkRefPlaneFill(0x60a5fa);
  orthoRefGroup.add(refFillXY, refFillXZ, refFillYZ);
  // Helper para reposicionar+orientar un fill mesh al plano XY/XZ/YZ
  const updateRefPlaneFill = (
    mesh: THREE.Mesh, lp: number[], plane: "xy" | "xz" | "yz", ext: number,
  ) => {
    mesh.scale.set(2 * ext, 2 * ext, 1);
    if (plane === "xy") {
      // PlaneGeometry default está en XY — no rotar
      mesh.position.set(lp[0], lp[1], lp[2]);
      mesh.rotation.set(0, 0, 0);
    } else if (plane === "xz") {
      // Rotar 90° en X para llevar el plano a XZ
      mesh.position.set(lp[0], lp[1], lp[2]);
      mesh.rotation.set(Math.PI / 2, 0, 0);
    } else {
      // Rotar 90° en Y para llevar el plano a YZ
      mesh.position.set(lp[0], lp[1], lp[2]);
      mesh.rotation.set(0, Math.PI / 2, 0);
    }
  };
  // Badge DOM que muestra qué plano de ref está bajo el cursor (XY/XZ/YZ).
  // Más explícito que solo el highlight de opacity — el usuario VE el nombre.
  const refPlaneBadge = document.createElement("div");
  refPlaneBadge.id = "hk-refplane-badge";
  refPlaneBadge.style.cssText = [
    "position:fixed", "pointer-events:none", "z-index:99997",
    "padding:3px 10px", "border-radius:4px",
    "font-family:Consolas,monospace", "font-size:12px", "font-weight:bold",
    "transform:translate(20px,40px)", "white-space:nowrap",
    "display:none",
  ].join(";") + ";";
  document.body.appendChild(refPlaneBadge);
  // Setter expuesto al window — toggle inmediato del flag con efecto visual.
  // El botón Tweakpane "▦ Planos ref. ortogonales" llama a esto.
  // CRÍTICO: las geometrías de refPlane*/refFill* se inicializan vacías
  // (LineLoop con 4 vectores cero, Mesh PlaneGeometry(1,1) sin scale). Si
  // sólo seteamos `.visible=true` sin actualizar geometría, los planos son
  // invisibles a la vista (degenerados/microscópicos en el origen). Por eso
  // acá llamamos a updateRefPlaneRect/Fill con un anchor (último punto de
  // la polilínea actual o el origen) para que el toggle SE VEA al instante.
  (window as any).__hekatanSetOrthoPlanes = (visible: boolean) => {
    (window as any).__hekatanShowOrthoPlanes = visible;
    // Toggle del grupo entero — controla los 6 hijos (3 borders + 3 fills).
    orthoRefGroup.visible = visible;
    if (visible) {
      // Anchor jerárquico:
      //   1. Último click en modo select (__hekatanOrthoAnchor) ← prioritario
      //   2. Último punto de la polilínea actual
      //   3. Origen (0,0,0)
      const savedAnchor = (window as any).__hekatanOrthoAnchor as number[] | undefined;
      const polys = drawingObj.polylines?.rawVal ?? [];
      const lastPoly = polys[polys.length - 1] ?? [];
      const allPts = drawingObj.points.rawVal ?? [];
      const anchor = savedAnchor && savedAnchor.length === 3
        ? savedAnchor
        : (lastPoly.length > 0 && allPts[lastPoly[lastPoly.length - 1]]
            ? allPts[lastPoly[lastPoly.length - 1]]
            : [0, 0, 0]);
      // Tamaño configurable desde Tweakpane vía window.__hekatanOrthoExt.
      // Default 8m (cuadrado 16×16). Usuario puede agrandar/achicar con slider.
      const ext = (window as any).__hekatanOrthoExt ?? 8;
      updateRefPlaneRect(refPlaneXY, anchor, "xy", ext);
      updateRefPlaneRect(refPlaneXZ, anchor, "xz", ext);
      updateRefPlaneRect(refPlaneYZ, anchor, "yz", ext);
      updateRefPlaneFill(refFillXY, anchor, "xy", ext);
      updateRefPlaneFill(refFillXZ, anchor, "xz", ext);
      updateRefPlaneFill(refFillYZ, anchor, "yz", ext);
      // Opacity inicial: muy transparente (0.10) para que no domine la
      // escena. El borde + el tinte sutil son suficientes para identificar
      // los planos sin tapar la geometría detrás. Hover sube a 0.25.
      (refFillXY.material as THREE.MeshBasicMaterial).opacity = 0.05;
      (refFillXZ.material as THREE.MeshBasicMaterial).opacity = 0.05;
      (refFillYZ.material as THREE.MeshBasicMaterial).opacity = 0.05;
    } else {
      const badge = document.getElementById("hk-refplane-badge");
      if (badge) badge.style.display = "none";
    }
    viewerRender();
  };
  // Setter dedicado para redimensionar los planos ortogonales en vivo.
  // El slider Tweakpane "Tamaño área planos ref." llama a esto en cada cambio.
  // Re-aplica la geometría al ext nuevo usando el anchor actual (saved/last/origen).
  (window as any).__hekatanSetOrthoExt = (extNew: number) => {
    (window as any).__hekatanOrthoExt = extNew;
    if (!orthoRefGroup.visible) { viewerRender(); return; }
    const savedAnchor = (window as any).__hekatanOrthoAnchor as number[] | undefined;
    const polys = drawingObj.polylines?.rawVal ?? [];
    const lastPoly = polys[polys.length - 1] ?? [];
    const allPts = drawingObj.points.rawVal ?? [];
    const anchor = savedAnchor && savedAnchor.length === 3
      ? savedAnchor
      : (lastPoly.length > 0 && allPts[lastPoly[lastPoly.length - 1]]
          ? allPts[lastPoly[lastPoly.length - 1]]
          : [0, 0, 0]);
    updateRefPlaneRect(refPlaneXY, anchor, "xy", extNew);
    updateRefPlaneRect(refPlaneXZ, anchor, "xz", extNew);
    updateRefPlaneRect(refPlaneYZ, anchor, "yz", extNew);
    updateRefPlaneFill(refFillXY, anchor, "xy", extNew);
    updateRefPlaneFill(refFillXZ, anchor, "xz", extNew);
    updateRefPlaneFill(refFillYZ, anchor, "yz", extNew);
    viewerRender();
  };
  // Helper para resaltar un plano (cuando el cursor está cerca).
  // hovered: "xy" | "xz" | "yz" | null. Aumenta contraste: dim casi invisible
  // (0.04), highlight muy visible (0.45). Además muestra badge DOM.
  const setRefPlaneHover = (hovered: "xy" | "xz" | "yz" | null) => {
    // Más sutil: dim 0.04 (casi invisible para no-hover), hover 0.22 (antes
    // 0.45 era demasiado fuerte y tapaba el modelo). Sigue siendo distinguible.
    const dimO = 0.025, hiO = 0.09;
    (refFillXY.material as THREE.MeshBasicMaterial).opacity = hovered === "xy" ? hiO : dimO;
    (refFillXZ.material as THREE.MeshBasicMaterial).opacity = hovered === "xz" ? hiO : dimO;
    (refFillYZ.material as THREE.MeshBasicMaterial).opacity = hovered === "yz" ? hiO : dimO;
    if (hovered) {
      const colors = {
        xy: { bg: "rgba(52,211,153,0.90)", text: "#0a1f12" },
        xz: { bg: "rgba(255,51,68,0.90)",  text: "#1f0a0e" },
        yz: { bg: "rgba(96,165,250,0.90)", text: "#0a1224" },
      };
      const c = colors[hovered];
      refPlaneBadge.style.background = c.bg;
      refPlaneBadge.style.color = c.text;
      refPlaneBadge.textContent = `▦ Plano ${hovered.toUpperCase()}`;
      refPlaneBadge.style.display = "block";
    } else {
      refPlaneBadge.style.display = "none";
    }
  };
  // Helper para actualizar geometría del rectángulo de un plano de ref.
  // Tamaño: ext (8m) — suficientemente grande para verse pero sin dominar.
  const updateRefPlaneRect = (
    line: THREE.Line, lp: number[], plane: "xy" | "xz" | "yz", ext: number,
  ) => {
    let pts: THREE.Vector3[];
    if (plane === "xy") {
      pts = [
        new THREE.Vector3(lp[0] - ext, lp[1] - ext, lp[2]),
        new THREE.Vector3(lp[0] + ext, lp[1] - ext, lp[2]),
        new THREE.Vector3(lp[0] + ext, lp[1] + ext, lp[2]),
        new THREE.Vector3(lp[0] - ext, lp[1] + ext, lp[2]),
        new THREE.Vector3(lp[0] - ext, lp[1] - ext, lp[2]),
      ];
    } else if (plane === "xz") {
      pts = [
        new THREE.Vector3(lp[0] - ext, lp[1], lp[2] - ext),
        new THREE.Vector3(lp[0] + ext, lp[1], lp[2] - ext),
        new THREE.Vector3(lp[0] + ext, lp[1], lp[2] + ext),
        new THREE.Vector3(lp[0] - ext, lp[1], lp[2] + ext),
        new THREE.Vector3(lp[0] - ext, lp[1], lp[2] - ext),
      ];
    } else {
      pts = [
        new THREE.Vector3(lp[0], lp[1] - ext, lp[2] - ext),
        new THREE.Vector3(lp[0], lp[1] + ext, lp[2] - ext),
        new THREE.Vector3(lp[0], lp[1] + ext, lp[2] + ext),
        new THREE.Vector3(lp[0], lp[1] - ext, lp[2] + ext),
        new THREE.Vector3(lp[0], lp[1] - ext, lp[2] - ext),
      ];
    }
    line.geometry.setFromPoints(pts);
  };

  // ── AXIS LOCK (estilo AutoCAD/SketchUp) ──
  // Mientras hay rubber band activo, presionar X/Y/Z restringe el cursor
  // a moverse SOLO en ese eje desde el último punto. Esencial para dibujar
  // columnas verticales (Lock Z), vigas horizontales (Lock X o Y) en iso.
  // Esc o repetir la misma tecla libera el lock.
  let axisLock: "x" | "y" | "z" | null = null;
  (window as any).__hekatanAxisLock = () => axisLock;  // getter para debug
  // Punto enganchado por el SNAP A EJES 3D (pointermove). El click lo usa para
  // que el commit coincida con lo que se ve (evita el "2 cursores"). null = sin
  // enganche de eje en este frame.
  let _axisSnapPoint: THREE.Vector3 | null = null;
  // Label DOM que muestra qué eje está bloqueado
  const axisLockBadge = document.createElement("div");
  axisLockBadge.id = "hk-axis-lock-badge";
  axisLockBadge.style.cssText = [
    "position:fixed", "pointer-events:none", "z-index:99998",
    "padding:4px 10px", "border-radius:4px",
    "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold",
    "transform:translate(20px,18px)", "white-space:nowrap",
    "display:none",
  ].join(";") + ";";
  document.body.appendChild(axisLockBadge);
  const updateAxisLockBadge = () => {
    if (!axisLock) { axisLockBadge.style.display = "none"; return; }
    const colors = { x: "#ff3344", y: "#34d399", z: "#60a5fa" };
    axisLockBadge.style.background = "rgba(15,23,42,0.92)";
    axisLockBadge.style.color = colors[axisLock];
    axisLockBadge.style.border = `1.5px solid ${colors[axisLock]}`;
    axisLockBadge.textContent = `🔒 LOCK ${axisLock.toUpperCase()}`;
    axisLockBadge.style.display = "block";
  };
  // Keyboard handler global: X/Y/Z toggle, Esc libera
  window.addEventListener("keydown", (ev: KeyboardEvent) => {
    // Solo activo si hay rubber band en progreso (rubberStart definido al
    // principio del archivo en updateRubberLabel). Y NO si está editando OTRO
    // input distinto al rubber label (Tweakpane, etc.). El rubber label SÍ
    // permite procesar X/Y/Z aunque tenga focus.
    const ae = document.activeElement;
    if (ae && (ae.tagName === "INPUT" || ae.tagName === "TEXTAREA")
        && ae !== rubberLabelInput) return;
    const k = ev.key.toLowerCase();
    const curToolKd = (window as any).__hekatanCadState?.get?.()?.tool;
    if (ev.key === "Enter" && curToolKd === "polyarea" && polyAreaPts.length >= 3) {
      // Enter cierra y mallar el ÁREA LIBRE en curso.
      const cnt = finalizePolyArea();
      updateStatus(`✓ Área libre mallada — ${cnt} shells Q4 creados.`);
      ev.preventDefault();
      return;
    }
    if (k === "x" || k === "y" || k === "z") {
      // Toggle: si ya estaba en ese eje, libera; si no, cambia a ese eje
      axisLock = (axisLock === k) ? null : (k as "x" | "y" | "z");
      updateAxisLockBadge();
      ev.preventDefault();
    } else if (ev.key === "Escape") {
      // Esc → cancelar acción + DESELECCIONAR. También blur cualquier input.
      const ae = document.activeElement;
      if (ae && (ae.tagName === "INPUT" || ae.tagName === "TEXTAREA")) {
        (ae as HTMLElement).blur();
      }
      escapeCancel();
      ev.preventDefault();
    } else if (ev.key === "F3") {
      // F3 → OSNAP (referencia a objetos) sí/no, como en AutoCAD
      ev.preventDefault();
      (window as any).__hekatanToggleOsnap?.();
    } else if (ev.key === "F10") {
      // F10 → rastreo POLAR sí/no, como en AutoCAD
      ev.preventDefault();
      (window as any).__hekatanTogglePolar?.();
    } else if (ev.key === "F8") {
      ev.preventDefault();
      (window as any).__hekatanToggleOrtho?.();
    }
  });
  // Los conmutadores viven en funciones para que la BARRA DE ESTADO (los
  // botones SNAP · ORTO · POLAR · OSNAP de abajo) y las teclas F hagan lo mismo.
  (window as any).__hekatanToggleOsnap = () => {
    const on = !((window as any).__hekatanOsnapOn ?? true);
    (window as any).__hekatanOsnapOn = on;
    if (!on) hideOsnap();
    updateStatus(`🧲 OSNAP ${on ? "ON" : "OFF"} (F3)`);
  };
  (window as any).__hekatanTogglePolar = () => {
    const on = !((window as any).__hekatanPolarTrack !== false);
    (window as any).__hekatanPolarTrack = on;
    if (!on) polarLines.visible = false;
    updateStatus(`◈ POLAR ${on ? "ON" : "OFF"} (F10)`);
  };
  (window as any).__hekatanToggleOrtho = () => {
    {
      // F8 → toggle ORTO mode (AutoCAD-style). Restringe el rubber band al
      // eje X/Y/Z más cercano AUTOMÁTICAMENTE (axis lock dinámico).
      (window as any).__hekatanOrthoMode = !(window as any).__hekatanOrthoMode;
      const on = (window as any).__hekatanOrthoMode;
      // Refrescar status (re-aplica sufijo con modos activos)
      (window as any).__hekatanRefreshStatus?.();
      // Borde cyan grueso alrededor del viewer activo cuando ORTO=ON.
      // Esto hace IMPOSIBLE no notar el cambio visual al apretar F8.
      let orthoFrame = document.getElementById("hk-ortho-frame");
      if (!orthoFrame) {
        orthoFrame = document.createElement("div");
        orthoFrame.id = "hk-ortho-frame";
        orthoFrame.style.cssText = [
          "position:fixed", "inset:0", "z-index:99996",
          "border:3px solid rgba(34,211,238,0.85)",
          "box-shadow:inset 0 0 24px rgba(34,211,238,0.35)",
          "pointer-events:none",
        ].join(";") + ";";
        document.body.appendChild(orthoFrame);
      }
      orthoFrame.style.display = on ? "block" : "none";
      // Badge visual fijo en la esquina superior — siempre visible cuando ON
      let orthoBadge = document.getElementById("hk-ortho-badge");
      if (!orthoBadge) {
        orthoBadge = document.createElement("div");
        orthoBadge.id = "hk-ortho-badge";
        orthoBadge.style.cssText = [
          "position:fixed", "top:10px", "left:50%",
          "transform:translateX(-50%)", "z-index:99998",
          "padding:6px 16px", "background:rgba(34,211,238,0.95)",
          "color:#0a1f24", "border-radius:6px",
          "border:2px solid rgba(8,145,178,1)",
          "box-shadow:0 4px 16px rgba(34,211,238,0.5)",
          "font-family:Consolas,monospace", "font-size:13px", "font-weight:bold",
          "pointer-events:none", "white-space:nowrap",
        ].join(";") + ";";
        orthoBadge.textContent = "⊥ ORTO ON (F8)";
        document.body.appendChild(orthoBadge);
      }
      orthoBadge.style.display = on ? "block" : "none";
    }
  };
  // Helper: proyecta el rayo del raycaster sobre el eje desde lastPt y
  // devuelve el punto del eje más cercano al cursor en pantalla.
  const _axisLockEndA = new THREE.Vector3();
  const _axisLockEndB = new THREE.Vector3();
  const _axisLockOut = new THREE.Vector3();
  const projectOnAxis = (lastPt: number[]): THREE.Vector3 | null => {
    if (!axisLock) return null;
    const ax = lastPt[0], ay = lastPt[1], az = lastPt[2];
    if (axisLock === "x") {
      _axisLockEndA.set(ax - 10000, ay, az);
      _axisLockEndB.set(ax + 10000, ay, az);
    } else if (axisLock === "y") {
      _axisLockEndA.set(ax, ay - 10000, az);
      _axisLockEndB.set(ax, ay + 10000, az);
    } else {
      _axisLockEndA.set(ax, ay, az - 10000);
      _axisLockEndB.set(ax, ay, az + 10000);
    }
    raycaster.ray.distanceSqToSegment(_axisLockEndA, _axisLockEndB, null as any, _axisLockOut);
    return _axisLockOut;
  };
  (window as any).__hekatanProjectOnAxis = projectOnAxis;

  // ── DELETE HOVER HIGHLIGHT ──
  // Cuando el tool "delete" está activo, esta línea roja gruesa se sitúa
  // sobre la polilínea más cercana al cursor para indicar QUÉ se va a
  // borrar. Al hacer click, la polilínea hover se elimina del modelo.
  const deleteHover = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0),
    ]),
    new THREE.LineBasicMaterial({
      color: 0xff3344, transparent: true, opacity: 0.95, linewidth: 4, depthTest: false,
    })
  );
  deleteHover.renderOrder = 998;
  deleteHover.frustumCulled = false;
  deleteHover.visible = false;
  scene.add(deleteHover);
  // Índice de la polilínea + segmento actualmente hover. El hover resalta
  // SOLO el segmento individual; el delete elimina solo ese segmento (a
  // menos que la polilínea sea un área Q4 — entonces se borra entera).
  let hoveredPolyIndex = -1;
  let hoveredSegIndex = -1;
  // Índice de la línea auxiliar bajo el cursor (-1 = ninguna). El tool
  // "delete" lo usa además de hoveredPolyIndex para borrar tanto polilíneas
  // como aux lines. Las aux lines se almacenan en window.__hekatanDrawingAuxLines
  // como array de [x1,y1,z1,x2,y2,z2] (vanjs State).
  let hoveredAuxIndex = -1;

  // ── SELECCIÓN UNIFICADA (sin tool específico) ──
  // En modo "select" (default), el usuario simplemente pasa el mouse cerca
  // de un nodo / línea / área y se RESALTA en amarillo (hover). Click la
  // SELECCIONA en cyan. Ctrl+Click agrega a la selección (múltiple).
  // IDs de selección: "pt:N" (nodo), "seg:P:S" (segmento polilínea P #S),
  // "poly:P" (polilínea P entera, usado para áreas), "aux:N" (línea aux).
  const selection = new Set<string>();
  (window as any).__hekatanSelection = selection;
  // Línea amarilla de HOVER — resalta lo que el cursor encontró antes de click
  const hoverHL = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]),
    new THREE.LineBasicMaterial({ color: 0xffd700, transparent: true, opacity: 0.95, depthTest: false }),
  );
  hoverHL.renderOrder = 997;
  hoverHL.frustumCulled = false;
  hoverHL.visible = false;
  scene.add(hoverHL);
  // Sphere amarilla para hover de NODOS — radio base 0.02m, escala dinámica
  // según distancia de cámara para que se vea constante en pantalla (~6px).
  const hoverPtHL = new THREE.Mesh(
    new THREE.SphereGeometry(0.02, 12, 12),
    new THREE.MeshBasicMaterial({ color: 0xffd700, transparent: true, opacity: 0.9, depthTest: false }),
  );
  hoverPtHL.renderOrder = 998;
  hoverPtHL.visible = false;
  scene.add(hoverPtHL);
  // Helper compartido: factor de escala para markers point-like (spheres
  // de hover, selection, aux points) que deben verse de tamaño aparente
  // constante en pantalla. Funciona con cámara perspective (usa distance
  // al worldPos) y ortográfica (usa frustum height — distance no afecta
  // tamaño aparente en orto: la cámara queda a D=1000m en setView pero
  // el frustum suele ser ~20m). Sin este ajuste todos los markers se ven
  // como bloques de varios metros en vista elevX/plan/elevY.
  const markerScreenScale = (worldPos: THREE.Vector3): number => {
    const cam = getActiveCamera();
    if ((cam as any).isOrthographicCamera) {
      const o = cam as THREE.OrthographicCamera;
      const H = (o.top - o.bottom) / o.zoom;
      return Math.max(0.05, H * 0.006);  // ~0.6% del alto del frustum
    }
    const dist = cam.position.distanceTo(worldPos);
    return Math.max(0.05, dist / 10);    // perspective: 10m → scale 1
  };
  const updateHoverPtScale = () => {
    if (!hoverPtHL.visible) return;
    hoverPtHL.scale.setScalar(markerScreenScale(hoverPtHL.position));
  };
  // Grupo CYAN para todos los items SELECCIONADOS (líneas + spheres)
  const selectionGroup = new THREE.Group();
  selectionGroup.frustumCulled = false;
  scene.add(selectionGroup);
  const selColor = 0x22d3ee;  // cyan
  // Estado de hover actual (lo que se va a seleccionar al click)
  let hoverItem: { kind: "pt" | "seg" | "poly" | "aux"; a: number; b?: number } | null = null;

  // Encuentra el NODO (punto individual) más cercano al cursor
  const findClosestPoint = (px: number, py: number, pz: number, tol: number): number => {
    if (!drawingObj.points) return -1;
    const pts = drawingObj.points.rawVal;
    let bestIdx = -1, bestD = tol;
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      if (!p) continue;
      const d = Math.hypot(px - p[0], py - p[1], pz - p[2]);
      if (d < bestD) { bestD = d; bestIdx = i; }
    }
    return bestIdx;
  };

  // Reconstruye los meshes cyan del grupo selectionGroup según el Set selection
  const refreshSelectionGroup = () => {
    while (selectionGroup.children.length) {
      const c = selectionGroup.children.pop()!;
      (c as any).geometry?.dispose?.();
      (c as any).material?.dispose?.();
    }
    const pts = drawingObj.points?.rawVal ?? [];
    const polys = drawingObj.polylines?.rawVal ?? [];
    const auxState = (window as any).__hekatanDrawingAuxLines;
    const aux: number[][] = auxState?.rawVal ?? [];
    for (const id of selection) {
      const [kind, ...rest] = id.split(":");
      if (kind === "pt") {
        const p = pts[+rest[0]];
        if (!p) continue;
        // Radio base 0.025m (~consistente con hover/snap markers).
        // El scale se ajusta en updateSelectionPtScale() para que el tamaño
        // aparente en pantalla sea constante (~8 px) a cualquier zoom.
        const m = new THREE.Mesh(
          new THREE.SphereGeometry(0.025, 12, 12),
          new THREE.MeshBasicMaterial({ color: selColor, transparent: true, opacity: 0.9, depthTest: false }),
        );
        m.position.set(p[0], p[1], p[2]);
        m.renderOrder = 999;
        (m as any).__isSelectionPt = true;
        selectionGroup.add(m);
      } else if (kind === "seg") {
        const poly = polys[+rest[0]];
        const a = pts[poly?.[+rest[1]]], b = pts[poly?.[+rest[1]+1]];
        if (!a || !b) continue;
        const g = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(a[0], a[1], a[2]),
          new THREE.Vector3(b[0], b[1], b[2]),
        ]);
        const ln = new THREE.Line(g, new THREE.LineBasicMaterial({
          color: selColor, transparent: true, opacity: 0.95, depthTest: false,
        }));
        ln.renderOrder = 999;
        selectionGroup.add(ln);
      } else if (kind === "poly") {
        const poly = polys[+rest[0]];
        const ptsLine = poly.map(idx => {
          const p = pts[idx];
          return p ? new THREE.Vector3(p[0], p[1], p[2]) : null;
        }).filter(Boolean) as THREE.Vector3[];
        if (ptsLine.length < 2) continue;
        const g = new THREE.BufferGeometry().setFromPoints(ptsLine);
        const ln = new THREE.Line(g, new THREE.LineBasicMaterial({
          color: selColor, transparent: true, opacity: 0.95, depthTest: false,
        }));
        ln.renderOrder = 999;
        selectionGroup.add(ln);
      } else if (kind === "aux") {
        const ln = aux[+rest[0]];
        if (!ln || ln.length !== 6) continue;
        const g = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(ln[0], ln[1], ln[2]),
          new THREE.Vector3(ln[3], ln[4], ln[5]),
        ]);
        const line = new THREE.Line(g, new THREE.LineBasicMaterial({
          color: selColor, transparent: true, opacity: 0.95, depthTest: false,
        }));
        line.renderOrder = 999;
        selectionGroup.add(line);
      }
    }
    // Aplicar escala dinámica inmediata a las esferas cyan recién creadas
    // (definida más abajo, así que verificamos existencia para evitar TDZ).
    const fn = (window as any).__hekatanUpdateSelectionPtScale as (() => void) | undefined;
    if (fn) fn();
    // Auto-actualizar el Properties Pane (definido más abajo, también
    // verificamos para evitar TDZ).
    const upd = (window as any).__hekatanRefreshPropsPane as (() => void) | undefined;
    if (upd) upd();
    // ── Los NUDOS seleccionados hay que escalarlos AL CREARLOS ───────────────
    //
    // La esfera del nudo se crea con radio 0.025 m y escala 1. Sobre un portico
    // de 6 m eso son dos centimetros y medio: invisible. El tamano aparente lo
    // arregla `updateSelectionPtScale`, pero solo se llamaba desde el evento
    // "change" de los controles, o sea AL ORBITAR. Resultado: seleccionabas un
    // nudo y no se resaltaba nada hasta que movias la camara — y para entonces
    // ya habias dado por hecho que no funcionaba.
    //
    // Se llama por window porque la funcion se declara mas abajo.
    try { (window as any).__hekatanUpdateSelectionPtScale?.(); } catch {}
    viewerRender();
  };
  (window as any).__hekatanRefreshSelection = refreshSelectionGroup;
  (window as any).__hekatanClearSelection = () => {
    selection.clear();
    refreshSelectionGroup();
  };

  // Distancia de un punto a un segmento (3D)
  const distPointSeg = (px: number, py: number, pz: number,
                         ax: number, ay: number, az: number,
                         bx: number, by: number, bz: number): number => {
    const dx = bx - ax, dy = by - ay, dz = bz - az;
    const L2 = dx*dx + dy*dy + dz*dz;
    if (L2 < 1e-12) return Math.hypot(px-ax, py-ay, pz-az);
    let t = ((px-ax)*dx + (py-ay)*dy + (pz-az)*dz) / L2;
    t = Math.max(0, Math.min(1, t));
    const cx = ax + t*dx, cy = ay + t*dy, cz = az + t*dz;
    return Math.hypot(px-cx, py-cy, pz-cz);
  };

  // Encuentra la polilínea más cercana al punto cursor — devuelve
  // { polyIdx, segIdx, dist } o null si nada en tolerancia.
  const findClosestPoly = (px: number, py: number, pz: number, tol: number) => {
    if (!drawingObj.polylines) return null;
    const polys = drawingObj.polylines.rawVal;
    const allPts = drawingObj.points.rawVal;
    let bestIdx = -1, bestSeg = -1, bestD = tol;
    for (let i = 0; i < polys.length; i++) {
      const poly = polys[i];
      for (let j = 0; j < poly.length - 1; j++) {
        const a = allPts[poly[j]], b = allPts[poly[j+1]];
        if (!a || !b) continue;
        const d = distPointSeg(px, py, pz, a[0],a[1],a[2], b[0],b[1],b[2]);
        if (d < bestD) { bestD = d; bestIdx = i; bestSeg = j; }
      }
    }
    return bestIdx >= 0 ? { polyIdx: bestIdx, segIdx: bestSeg, dist: bestD } : null;
  };

  // Encuentra la línea auxiliar más cercana al cursor — devuelve el índice
  // (en window.__hekatanDrawingAuxLines.rawVal) o -1 si nada en tolerancia.
  const findClosestAuxLine = (px: number, py: number, pz: number, tol: number): number => {
    const auxState = (window as any).__hekatanDrawingAuxLines;
    const lines: number[][] = auxState?.rawVal ?? auxState?.val ?? auxState ?? [];
    let bestIdx = -1, bestD = tol;
    for (let i = 0; i < lines.length; i++) {
      const ln = lines[i];
      if (!ln || ln.length !== 6) continue;
      const d = distPointSeg(px, py, pz, ln[0], ln[1], ln[2], ln[3], ln[4], ln[5]);
      if (d < bestD) { bestD = d; bestIdx = i; }
    }
    return bestIdx;
  };

  // Resalta la aux line `i` en rojo (mismo deleteHover que polilíneas).
  const showDeleteAuxHover = (i: number) => {
    const auxState = (window as any).__hekatanDrawingAuxLines;
    const lines: number[][] = auxState?.rawVal ?? auxState?.val ?? auxState ?? [];
    const ln = lines[i];
    if (!ln || ln.length !== 6) { deleteHover.visible = false; return; }
    deleteHover.geometry.setFromPoints([
      new THREE.Vector3(ln[0], ln[1], ln[2]),
      new THREE.Vector3(ln[3], ln[4], ln[5]),
    ]);
    deleteHover.visible = true;
  };

  // Renderiza solo el SEGMENTO j de la polilínea i en deleteHover (rojo).
  // Excepción: si la polilínea es un ÁREA (Q4), se resalta entera porque
  // un Q4 con 3 vértices no tiene sentido — el delete elimina el área
  // completa.
  const showDeleteHover = (i: number, j: number = -1) => {
    if (!drawingObj.polylines) return;
    const poly = drawingObj.polylines.rawVal[i];
    const allPts = drawingObj.points.rawVal;
    if (!poly || poly.length < 2) { deleteHover.visible = false; return; }
    const isArea = drawingObj.areas?.rawVal?.includes(i) ?? false;
    const pts: THREE.Vector3[] = [];
    if (isArea || j < 0 || j >= poly.length - 1) {
      // Resaltar polilínea entera (área Q4 o segIdx inválido)
      for (const idx of poly) {
        const p = allPts[idx];
        if (p) pts.push(new THREE.Vector3(p[0], p[1], p[2]));
      }
    } else {
      // Resaltar SOLO el segmento (frame individual)
      const a = allPts[poly[j]], b = allPts[poly[j+1]];
      if (a) pts.push(new THREE.Vector3(a[0], a[1], a[2]));
      if (b) pts.push(new THREE.Vector3(b[0], b[1], b[2]));
    }
    deleteHover.geometry.setFromPoints(pts);
    deleteHover.visible = true;
  };

  // Borra la polilínea i, limpia puntos huérfanos, dispara rebuild.
  const deletePoly = (i: number) => {
    if (!drawingObj.polylines) return;
    const polys = drawingObj.polylines.rawVal;
    if (i < 0 || i >= polys.length) return;
    const newPolys = polys.filter((_, k) => k !== i);
    // Limpiar puntos huérfanos: nodes no referenciados por NINGUNA polilínea
    const used = new Set<number>();
    for (const p of newPolys) for (const idx of p) used.add(idx);
    const allPts = drawingObj.points.rawVal;
    const remap = new Map<number, number>();
    const newPts: number[][] = [];
    for (let k = 0; k < allPts.length; k++) {
      if (used.has(k)) { remap.set(k, newPts.length); newPts.push(allPts[k]); }
    }
    // Reindexar polilíneas con el remap
    const reindexed = newPolys.map(p => p.map(idx => remap.get(idx)!).filter(v => v !== undefined));
    drawingObj.points.val = newPts;
    drawingObj.polylines.val = reindexed;
    // Reindexar drawingAreas: descartar el índice borrado y desplazar
    // todos los > i en -1 (porque las polylines posteriores se corrieron).
    if (drawingObj.areas) {
      drawingObj.areas.val = drawingObj.areas.rawVal
        .filter(a => a !== i)
        .map(a => (a > i ? a - 1 : a));
    }
    deleteHover.visible = false;
    hoveredPolyIndex = -1;
    hoveredSegIndex = -1;
    try { (window as any).__hekatanRebuild?.(); } catch {}
  };

  // Borra UN SEGMENTO de una polilínea. Si la polilínea es área → borra
  // entera (un Q4 sin un lado no tiene sentido). Si es polilínea normal:
  //   - segmento al medio → split en 2 polilíneas
  //   - segmento al inicio → shorten (remover poly[0])
  //   - segmento al fin → shorten (remover último)
  //   - polilínea de 2 puntos (1 segmento) → eliminar entera
  const deleteSeg = (polyIdx: number, segIdx: number) => {
    if (!drawingObj.polylines) return;
    const polys = drawingObj.polylines.rawVal;
    if (polyIdx < 0 || polyIdx >= polys.length) return;
    const isArea = drawingObj.areas?.rawVal?.includes(polyIdx) ?? false;
    if (isArea) { deletePoly(polyIdx); return; }
    const poly = polys[polyIdx];
    if (segIdx < 0 || segIdx >= poly.length - 1) return;
    // Si solo hay 1 segmento → eliminar polilínea entera
    if (poly.length === 2) { deletePoly(polyIdx); return; }
    // Construir nuevas polilíneas reemplazando la actual
    let newPolyList: number[][];
    if (segIdx === 0) {
      // Sacar el primer punto: poly[1:]
      newPolyList = [poly.slice(1)];
    } else if (segIdx === poly.length - 2) {
      // Sacar el último punto: poly[:-1]
      newPolyList = [poly.slice(0, -1)];
    } else {
      // Split: dos polilíneas independientes
      newPolyList = [poly.slice(0, segIdx + 1), poly.slice(segIdx + 1)];
    }
    const newPolys = [...polys.slice(0, polyIdx), ...newPolyList, ...polys.slice(polyIdx + 1)];
    // Limpiar puntos huérfanos
    const used = new Set<number>();
    for (const p of newPolys) for (const idx of p) used.add(idx);
    const allPts = drawingObj.points.rawVal;
    const remap = new Map<number, number>();
    const newPts: number[][] = [];
    for (let k = 0; k < allPts.length; k++) {
      if (used.has(k)) { remap.set(k, newPts.length); newPts.push(allPts[k]); }
    }
    const reindexed = newPolys.map(p => p.map(idx => remap.get(idx)!).filter(v => v !== undefined));
    drawingObj.points.val = newPts;
    drawingObj.polylines.val = reindexed;
    // Reindexar áreas — todas las áreas con índice > polyIdx se desplazan
    // según cuántas polilíneas nuevas insertamos (newPolyList.length - 1).
    if (drawingObj.areas) {
      const shift = newPolyList.length - 1;
      drawingObj.areas.val = drawingObj.areas.rawVal.map(a => a > polyIdx ? a + shift : a);
    }
    deleteHover.visible = false;
    hoveredPolyIndex = -1;
    hoveredSegIndex = -1;
    try { (window as any).__hekatanRebuild?.(); } catch {}
  };

  // Update
  points.geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(drawingObj.points.rawVal.flat(), 3)
  );
  points.geometry.computeBoundingSphere();
  points.frustumCulled = false;

  indicationPoint.frustumCulled = false;
  scene.add(indicationPoint);

  // Match initial grid position and rotation — grid centrado en el origen
  // (convención CAD: origen mundial = centro del grid).
  plane.position.set(0, 0, 0);
  plane.rotateX(Math.PI / 2);
  plane.geometry.rotateX(Math.PI / 2);
  plane.updateMatrixWorld(); // to fix intersect object

  // To start with an empty polyline and keep the provided ones
  if (drawingObj.polylines)
    drawingObj.polylines.val = [...drawingObj.polylines.rawVal, []];

  // ── API pública para dibujar programáticamente ──
  // Util para tests/scripts/demos: agrega un punto en coords mundiales
  // (saltando el raycaster). Equivalente a un click real en la posición
  // (x, y, z) sobre el plano.
  (window as any).__hekatanDrawAt = (x: number, y: number, z: number) => {
    drawingObj.points.val = [...drawingObj.points.rawVal, [x, y, z]];
    if (drawingObj.polylines) {
      const polys = drawingObj.polylines.rawVal;
      const last = polys.length ? polys[polys.length - 1] : [];
      drawingObj.polylines.val = [
        ...polys.slice(0, -1),
        [...last, drawingObj.points.rawVal.length - 1],
      ];
    }
  };
  // Empezar nueva polilínea (equivalente a right-click)
  (window as any).__hekatanDrawNewPoly = () => {
    if (!drawingObj.polylines) return;
    const polys = drawingObj.polylines.rawVal;
    if (polys[polys.length - 1]?.length === 0) return;
    drawingObj.polylines.val = [...polys, []];
  };
  // ── Discretización de elementos no-lineales ──
  // Círculo en plano XY (centro cx,cy,cz; radio r). Se discretiza en N
  // segmentos rectos formando un polígono regular cerrado.
  // Los circulos y arcos se guardan TESELADOS (una polilinea): el centro no es
  // ningun punto. Para el OSNAP "centro" se anota aqui (centro y radio). Un
  // circulo borrado se detecta porque no queda ningun punto en su circunferencia.
  const circulos: { c: [number, number, number]; r: number }[] = [];
  (window as any).__hekatanCirculos = circulos;
  (window as any).__hekatanDrawCircle = (
    cx: number, cy: number, cz: number, r: number,
    segs: number = (window as any).__hekatanArcSegs ?? 12,
    plane: "xy" | "xz" | "yz" = "xy",
  ) => {
    const N = Math.max(4, Math.round(segs));
    const baseIdx = drawingObj.points.rawVal.length;
    const newPts: [number, number, number][] = [];
    for (let i = 0; i < N; i++) {
      const ang = (2 * Math.PI * i) / N;
      const dx = r * Math.cos(ang), dy = r * Math.sin(ang);
      let p: [number, number, number];
      if (plane === "xy")      p = [cx + dx, cy + dy, cz];
      else if (plane === "xz") p = [cx + dx, cy, cz + dy];
      else                     p = [cx, cy + dx, cz + dy];
      newPts.push(p);
    }
    drawingObj.points.val = [...drawingObj.points.rawVal, ...newPts];
    circulos.push({ c: [cx, cy, cz], r });
    if (drawingObj.polylines) {
      // Polilínea cerrada (vuelve al primer punto)
      const closed = [...newPts.map((_, i) => baseIdx + i), baseIdx];
      const polys = drawingObj.polylines.rawVal;
      // Cerrar polilínea actual si tiene puntos, abrir nueva con el círculo
      if (polys[polys.length - 1]?.length > 0) {
        drawingObj.polylines.val = [...polys, closed, []];
      } else {
        drawingObj.polylines.val = [...polys.slice(0, -1), closed, []];
      }
    }
  };
  // Arco por 3 puntos (start - mid - end). Discretiza en N segmentos.
  (window as any).__hekatanDrawArc = (
    p1: [number, number, number],
    p2: [number, number, number],
    p3: [number, number, number],
    segs: number = (window as any).__hekatanArcSegs ?? 12,
  ) => {
    const N = Math.max(4, Math.round(segs));
    // Calcular el centro y radio del arco que pasa por 3 puntos
    // Asumimos que los 3 puntos están aproximadamente en un mismo plano.
    // Para simplicidad: arco circular en el plano definido por p1-p2-p3.
    const v1 = new THREE.Vector3(...p1);
    const v2 = new THREE.Vector3(...p2);
    const v3 = new THREE.Vector3(...p3);
    // Normal del plano que contiene los 3 puntos
    const a = new THREE.Vector3().subVectors(v2, v1);
    const b = new THREE.Vector3().subVectors(v3, v1);
    const normal = new THREE.Vector3().crossVectors(a, b).normalize();
    // Centro del círculo: intersección de mediatrices de p1p2 y p2p3 en el plano
    const m12 = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5);
    const m23 = new THREE.Vector3().addVectors(v2, v3).multiplyScalar(0.5);
    const dir12 = new THREE.Vector3().crossVectors(a, normal).normalize();
    const dir23 = new THREE.Vector3().crossVectors(new THREE.Vector3().subVectors(v3, v2), normal).normalize();
    // Resolver m12 + t * dir12 = m23 + s * dir23 (proyectado)
    const w = new THREE.Vector3().subVectors(m23, m12);
    const denom = dir12.x * dir23.y - dir12.y * dir23.x;
    let center: THREE.Vector3;
    if (Math.abs(denom) > 1e-9) {
      const t = (w.x * dir23.y - w.y * dir23.x) / denom;
      center = new THREE.Vector3().addVectors(m12, dir12.clone().multiplyScalar(t));
    } else {
      // Caso degenerado: usar el punto medio
      center = m12.clone();
    }
    const radius = v1.distanceTo(center);
    const startVec = new THREE.Vector3().subVectors(v1, center);
    const endVec = new THREE.Vector3().subVectors(v3, center);
    const angle = Math.acos(Math.max(-1, Math.min(1, startVec.dot(endVec) / (radius * radius))));
    // Generar N+1 puntos a lo largo del arco
    const baseIdx = drawingObj.points.rawVal.length;
    const newPts: [number, number, number][] = [];
    const axis = normal.clone();
    // Asegurar dirección correcta del arco (que pase cerca de p2)
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const ang = angle * t;
      const q = new THREE.Quaternion().setFromAxisAngle(axis, ang);
      const v = startVec.clone().applyQuaternion(q).add(center);
      newPts.push([v.x, v.y, v.z]);
    }
    drawingObj.points.val = [...drawingObj.points.rawVal, ...newPts];
    circulos.push({ c: [center.x, center.y, center.z], r: radius });
    if (drawingObj.polylines) {
      const arcPoly = newPts.map((_, i) => baseIdx + i);
      const polys = drawingObj.polylines.rawVal;
      drawingObj.polylines.val = [...polys.slice(0, -1), arcPoly, []];
    }
  };
  // ── Losa rectangular con chaflanes (esquinas redondeadas) ──
  // 2 clicks: esquinas opuestas de la bounding box. Genera 4 lados rectos
  // + 4 cuartos de círculo en las esquinas. Pensado para volados curvos
  // arquitectónicos (balcones, fachadas redondeadas, losas de piscina).
  (window as any).__hekatanDrawSlabChaflan = (
    p1: [number, number, number],
    p2: [number, number, number],
    chaflanRadius: number = 1.0,
    segArc: number = 6,
    segStr: number = 6,
  ) => {
    const xMin = Math.min(p1[0], p2[0]);
    const xMax = Math.max(p1[0], p2[0]);
    const yMin = Math.min(p1[1], p2[1]);
    const yMax = Math.max(p1[1], p2[1]);
    const z = (p1[2] + p2[2]) / 2;
    const Lx = xMax - xMin;
    const Ly = yMax - yMin;
    const r = Math.min(chaflanRadius, Lx / 2 - 0.01, Ly / 2 - 0.01);
    if (r <= 0) return;
    const baseIdx = drawingObj.points.rawVal.length;
    const newPts: [number, number, number][] = [];
    const polyIdx: number[] = [];
    const addPt = (x: number, y: number) => {
      newPts.push([x, y, z]);
      polyIdx.push(baseIdx + newPts.length - 1);
    };
    // Borde inferior (y=yMin): de (xMin+r, yMin) a (xMax-r, yMin)
    for (let i = 0; i <= segStr; i++) addPt(xMin + r + (Lx - 2*r) * i / segStr, yMin);
    // Chaflán BR
    for (let i = 1; i <= segArc; i++) {
      const ang = -Math.PI/2 + (Math.PI/2) * i / segArc;
      addPt((xMax - r) + r * Math.cos(ang), (yMin + r) + r * Math.sin(ang));
    }
    // Borde derecho
    for (let i = 1; i <= segStr; i++) addPt(xMax, yMin + r + (Ly - 2*r) * i / segStr);
    // Chaflán TR
    for (let i = 1; i <= segArc; i++) {
      const ang = 0 + (Math.PI/2) * i / segArc;
      addPt((xMax - r) + r * Math.cos(ang), (yMax - r) + r * Math.sin(ang));
    }
    // Borde superior
    for (let i = 1; i <= segStr; i++) addPt(xMax - r - (Lx - 2*r) * i / segStr, yMax);
    // Chaflán TL
    for (let i = 1; i <= segArc; i++) {
      const ang = Math.PI/2 + (Math.PI/2) * i / segArc;
      addPt((xMin + r) + r * Math.cos(ang), (yMax - r) + r * Math.sin(ang));
    }
    // Borde izquierdo
    for (let i = 1; i <= segStr; i++) addPt(xMin, yMax - r - (Ly - 2*r) * i / segStr);
    // Chaflán BL
    for (let i = 1; i <= segArc; i++) {
      const ang = Math.PI + (Math.PI/2) * i / segArc;
      addPt((xMin + r) + r * Math.cos(ang), (yMin + r) + r * Math.sin(ang));
    }
    // Cerrar
    polyIdx.push(baseIdx);
    drawingObj.points.val = [...drawingObj.points.rawVal, ...newPts];
    if (drawingObj.polylines) {
      const polys = drawingObj.polylines.rawVal;
      drawingObj.polylines.val = [...polys.slice(0, -1), polyIdx, []];
    }
  };

  // Rectángulo por 2 esquinas en plano XY o XZ
  (window as any).__hekatanDrawRect = (
    p1: [number, number, number],
    p2: [number, number, number],
  ) => {
    const baseIdx = drawingObj.points.rawVal.length;
    // 4 esquinas (asumiendo que los 2 puntos definen una diagonal en un plano)
    const x1 = p1[0], y1 = p1[1], z1 = p1[2];
    const x2 = p2[0], y2 = p2[1], z2 = p2[2];
    let pts: [number, number, number][];
    if (Math.abs(z1 - z2) < 1e-6) {
      // Plano XY (Z constante)
      pts = [[x1, y1, z1], [x2, y1, z1], [x2, y2, z1], [x1, y2, z1]];
    } else if (Math.abs(y1 - y2) < 1e-6) {
      // Plano XZ (Y constante)
      pts = [[x1, y1, z1], [x2, y1, z1], [x2, y1, z2], [x1, y1, z2]];
    } else {
      // Plano YZ (X constante)
      pts = [[x1, y1, z1], [x1, y2, z1], [x1, y2, z2], [x1, y1, z2]];
    }
    drawingObj.points.val = [...drawingObj.points.rawVal, ...pts];
    if (drawingObj.polylines) {
      const rectPoly = [baseIdx, baseIdx + 1, baseIdx + 2, baseIdx + 3, baseIdx];
      const polys = drawingObj.polylines.rawVal;
      drawingObj.polylines.val = [...polys.slice(0, -1), rectPoly, []];
    }
  };

  // ── ÁREA RECTANGULAR: 2 clicks (esquinas opuestas) → shell Q4 marcado como
  // ÁREA. Igual que __hekatanDrawRect pero lo registra en drawingObj.areas
  // para que newBlank lo construya como shell (no como frames de borde).
  (window as any).__hekatanDrawRectArea = (
    p1: [number, number, number],
    p2: [number, number, number],
  ) => {
    const baseIdx = drawingObj.points.rawVal.length;
    const x1 = p1[0], y1 = p1[1], z1 = p1[2];
    const x2 = p2[0], y2 = p2[1], z2 = p2[2];
    let pts: [number, number, number][];
    if (inclinedPlaneActive && drawingObj.gridTarget) {
      // PLANO INCLINADO: construir el rectángulo EN la base (u,v) del plano,
      // así las 2 esquinas opuestas dan un rectángulo limpio sobre la
      // inclinación (no un cuadrilátero raro). u,v = ejes locales del plano.
      const gt = drawingObj.gridTarget.rawVal;
      const e = new THREE.Euler(...gt.rotation);
      const u = new THREE.Vector3(1, 0, 0).applyEuler(e);
      const v = new THREE.Vector3(0, 1, 0).applyEuler(e);
      const O = new THREE.Vector3(...gt.position);
      const A = new THREE.Vector3(x1, y1, z1), C = new THREE.Vector3(x2, y2, z2);
      const au = A.clone().sub(O).dot(u), av = A.clone().sub(O).dot(v);
      const cu = C.clone().sub(O).dot(u), cv = C.clone().sub(O).dot(v);
      const mk = (uu: number, vv: number): [number, number, number] =>
        O.clone().addScaledVector(u, uu).addScaledVector(v, vv).toArray() as [number, number, number];
      pts = [mk(au, av), mk(cu, av), mk(cu, cv), mk(au, cv)];
    }
    else if (Math.abs(z1 - z2) < 1e-6) pts = [[x1, y1, z1], [x2, y1, z1], [x2, y2, z1], [x1, y2, z1]];
    else if (Math.abs(y1 - y2) < 1e-6) pts = [[x1, y1, z1], [x2, y1, z1], [x2, y1, z2], [x1, y1, z2]];
    else pts = [[x1, y1, z1], [x1, y2, z1], [x1, y2, z2], [x1, y1, z2]];
    if ((window as any).__hekatanPushUndo) (window as any).__hekatanPushUndo();
    drawingObj.points.val = [...drawingObj.points.rawVal, ...pts];
    if (drawingObj.polylines) {
      const polys = drawingObj.polylines.rawVal;
      const newAt = polys.length - 1;  // posición del [] final que reemplazamos
      const rectPoly = [baseIdx, baseIdx + 1, baseIdx + 2, baseIdx + 3, baseIdx];
      drawingObj.polylines.val = [...polys.slice(0, -1), rectPoly, []];
      if (drawingObj.areas) drawingObj.areas.val = [...drawingObj.areas.rawVal, newAt];
    }
    try { (window as any).__hekatanRebuild?.(); } catch {}
    viewerRender();
  };

  // ── ÁREA LIBRE: polígono arbitrario (N vértices, incluso cóncavo tipo
  // escalera/L) → MALLA de shells Q4. El FEM solo soporta Q4, así que
  // dividimos el polígono en una grilla de cuadritos en SU PROPIO plano y
  // conservamos las celdas cuyo centro cae dentro del polígono
  // (point-in-polygon por ray-casting). Devuelve la cantidad de shells.
  (window as any).__hekatanMeshPolyArea = (
    verts3d: [number, number, number][],
    spacingOpt?: number,
  ): number => {
    const n = verts3d.length;
    if (n < 3) return 0;
    // Normal del polígono (método de Newell — robusto para polígonos planos).
    let nx = 0, ny = 0, nz = 0;
    for (let i = 0; i < n; i++) {
      const a = verts3d[i], b = verts3d[(i + 1) % n];
      nx += (a[1] - b[1]) * (a[2] + b[2]);
      ny += (a[2] - b[2]) * (a[0] + b[0]);
      nz += (a[0] - b[0]) * (a[1] + b[1]);
    }
    const nl = Math.hypot(nx, ny, nz) || 1; nx /= nl; ny /= nl; nz /= nl;
    // u = dirección del primer borde (alinea la grilla con la forma → tiles
    // exactos en escaleras/L axis-aligned). v = n × u.
    let ux = verts3d[1][0] - verts3d[0][0], uy = verts3d[1][1] - verts3d[0][1], uz = verts3d[1][2] - verts3d[0][2];
    const ul = Math.hypot(ux, uy, uz) || 1; ux /= ul; uy /= ul; uz /= ul;
    let vx = ny * uz - nz * uy, vy = nz * ux - nx * uz, vz = nx * uy - ny * ux;
    const vln = Math.hypot(vx, vy, vz) || 1; vx /= vln; vy /= vln; vz /= vln;
    const O = verts3d[0];
    const to2d = (p: number[]): [number, number] => [
      (p[0] - O[0]) * ux + (p[1] - O[1]) * uy + (p[2] - O[2]) * uz,
      (p[0] - O[0]) * vx + (p[1] - O[1]) * vy + (p[2] - O[2]) * vz,
    ];
    const to3d = (s: number, t: number): [number, number, number] => [
      O[0] + s * ux + t * vx, O[1] + s * uy + t * vy, O[2] + s * uz + t * vz,
    ];
    const poly2d = verts3d.map(to2d);
    let minS = Infinity, maxS = -Infinity, minT = Infinity, maxT = -Infinity;
    for (const [s, t] of poly2d) {
      if (s < minS) minS = s; if (s > maxS) maxS = s;
      if (t < minT) minT = t; if (t > maxT) maxT = t;
    }
    const w = maxS - minS, h = maxT - minT;
    if (w < 1e-6 || h < 1e-6) return 0;
    // Espaciado: default 0.5 m, duplicando si se generarían demasiadas celdas.
    let step = spacingOpt && spacingOpt > 0 ? spacingOpt : 0.5;
    while ((w / step) * (h / step) > 2500) step *= 2;
    step = Math.min(step, Math.min(w, h));
    const inside = (s: number, t: number): boolean => {
      let c = false;
      for (let i = 0, j = poly2d.length - 1; i < poly2d.length; j = i++) {
        const [si, ti] = poly2d[i], [sj, tj] = poly2d[j];
        if (((ti > t) !== (tj > t)) && (s < (sj - si) * (t - ti) / (tj - ti) + si)) c = !c;
      }
      return c;
    };
    const ns = Math.max(1, Math.round(w / step));
    const nt = Math.max(1, Math.round(h / step));
    const ds = w / ns, dt = h / nt;
    // Nodos de grilla compartidos (solo los usados por celdas internas).
    const nodeKey = new Map<string, number>();
    const newPts: [number, number, number][] = [];
    const baseIdx = drawingObj.points.rawVal.length;
    const getNode = (gi: number, gj: number): number => {
      const k = gi + "," + gj;
      const ex = nodeKey.get(k);
      if (ex !== undefined) return ex;
      const idx = baseIdx + newPts.length;
      newPts.push(to3d(minS + gi * ds, minT + gj * dt));
      nodeKey.set(k, idx);
      return idx;
    };
    const quads: number[][] = [];
    for (let gi = 0; gi < ns; gi++) {
      for (let gj = 0; gj < nt; gj++) {
        if (!inside(minS + (gi + 0.5) * ds, minT + (gj + 0.5) * dt)) continue;
        const a = getNode(gi, gj), b = getNode(gi + 1, gj);
        const cc = getNode(gi + 1, gj + 1), d = getNode(gi, gj + 1);
        quads.push([a, b, cc, d]);
      }
    }
    if (!quads.length) return 0;
    if ((window as any).__hekatanPushUndo) (window as any).__hekatanPushUndo();
    drawingObj.points.val = [...drawingObj.points.rawVal, ...newPts];
    if (drawingObj.polylines && drawingObj.areas) {
      let polys = drawingObj.polylines.rawVal.slice();
      if (polys.length && polys[polys.length - 1].length === 0) polys = polys.slice(0, -1);
      const areaIdxs: number[] = [];
      for (const q of quads) { areaIdxs.push(polys.length); polys.push([q[0], q[1], q[2], q[3], q[0]]); }
      polys.push([]);
      drawingObj.polylines.val = polys;
      drawingObj.areas.val = [...drawingObj.areas.rawVal, ...areaIdxs];
    }
    try { (window as any).__hekatanRebuild?.(); } catch {}
    viewerRender();
    return quads.length;
  };

  // Finaliza el ÁREA LIBRE en curso: malla los puntos clickeados y limpia.
  const finalizePolyArea = (): number => {
    if (polyAreaPts.length < 3) { polyAreaPts = []; polyAreaPreview.visible = false; viewerRender(); return 0; }
    const cnt = (window as any).__hekatanMeshPolyArea(polyAreaPts.slice());
    polyAreaPts = [];
    polyAreaPreview.visible = false;
    viewerRender();
    return cnt;
  };
  (window as any).__hekatanFinalizePolyArea = finalizePolyArea;

  // ── PLANO DE TRABAJO INCLINADO (UCS por 3 puntos) ──
  // El plano de trabajo se orienta vía drawingObj.gridTarget {position, rotation}.
  // A partir de 3 puntos calculamos la normal y el Euler para inclinar el plano
  // (y la grilla) a CUALQUIER orientación → los clicks posteriores caen sobre
  // ese plano inclinado, así se dibujan áreas/shells inclinados.
  (window as any).__hekatanSetInclinedPlaneFrom3 = (
    p1: [number, number, number],
    p2: [number, number, number],
    p3: [number, number, number],
  ): boolean => {
    const a = new THREE.Vector3(p1[0], p1[1], p1[2]);
    const b = new THREE.Vector3(p2[0], p2[1], p2[2]);
    const c = new THREE.Vector3(p3[0], p3[1], p3[2]);
    const N = new THREE.Vector3().subVectors(b, a)
      .cross(new THREE.Vector3().subVectors(c, a));
    if (N.lengthSq() < 1e-9) return false;   // 3 puntos colineales
    N.normalize();
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), N);
    const e = new THREE.Euler().setFromQuaternion(q);
    if (drawingObj.gridTarget) {
      drawingObj.gridTarget.val = {
        position: [a.x, a.y, a.z],
        rotation: [e.x, e.y, e.z],
      };
    }
    inclinedPlaneActive = true;   // síncrono (la derive de gridTarget es async)
    // Guía visible: centrar en el centroide de los 3 puntos, orientar al plano,
    // dimensionar ~ al tamaño del triángulo (con margen). Reconstruimos las
    // geometrías al tamaño real (sin escalar el grupo → paso de grilla = 1 m).
    const ctr = new THREE.Vector3().addVectors(a, b).add(c).multiplyScalar(1 / 3);
    const size = Math.max(a.distanceTo(b), a.distanceTo(c), b.distanceTo(c)) * 2.2 + 4;
    const half = size / 2;
    inclinedFill.geometry.dispose();
    inclinedFill.geometry = new THREE.PlaneGeometry(size, size);
    inclinedBorder.geometry.dispose();
    inclinedBorder.geometry = new THREE.EdgesGeometry(new THREE.PlaneGeometry(size, size));
    buildInclinedGrid(half, 1);
    inclinedHelper.position.copy(ctr);
    inclinedHelper.quaternion.copy(q);
    inclinedHelper.scale.set(1, 1, 1);
    inclinedHelper.visible = true;
    try { (window as any).__hekatanRefreshStatus?.(); } catch {}
    viewerRender();
    return true;
  };
  // Resetear el plano de trabajo a horizontal (XY, Z=0).
  (window as any).__hekatanResetPlaneXY = () => {
    if (drawingObj.gridTarget) drawingObj.gridTarget.val = { position: [0, 0, 0], rotation: [0, 0, 0] };
    inclinedPlaneActive = false;   // síncrono
    inclinedHelper.visible = false;
    viewerRender();
  };

  // ── Ejes A/B/C + 1/2/3 estilo CAD/FEM Studio ──
  // Dibuja líneas verticales en X=xs[i] (etiquetadas A, B, C...) y
  // líneas horizontales en Y=ys[i] (etiquetadas 1, 2, 3...). Útil para
  // ubicarse en planta y cruzar referencias entre modelo y planos.
  const axesGroup = new THREE.Group();
  axesGroup.visible = false;
  scene.add(axesGroup);
  (window as any).__hekatanShowAxes = (
    xs: number[],
    ys: number[],
    zMax: number = 12,
    extentExtra: number = 2,
  ) => {
    while (axesGroup.children.length) {
      const c = axesGroup.children.pop()!;
      (c as any).geometry?.dispose();
      (c as any).material?.dispose();
    }
    if (!xs.length || !ys.length) return;
    const yMin = Math.min(...ys) - extentExtra;
    const yMax = Math.max(...ys) + extentExtra;
    const xMin = Math.min(...xs) - extentExtra;
    const xMax = Math.max(...xs) + extentExtra;
    const labelLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const mkLabel = (txt: string, x: number, y: number, z: number, color: string) => {
      const c = document.createElement("canvas");
      c.width = 64; c.height = 32;
      const cc = c.getContext("2d")!;
      cc.fillStyle = color;
      cc.font = "bold 22px sans-serif";
      cc.textAlign = "center";
      cc.fillText(txt, 32, 26);
      const tex = new THREE.CanvasTexture(c);
      const m = new THREE.SpriteMaterial({ map: tex, transparent: true });
      const s = new THREE.Sprite(m);
      s.position.set(x, y, z);
      s.scale.set(1.2, 0.6, 1);
      return s;
    };
    // Ejes en X (A, B, C...) — líneas paralelas al eje Y a cada x_i
    xs.forEach((x, i) => {
      const lbl = i < labelLetters.length ? labelLetters[i] : `X${i}`;
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x, yMin, 0),
        new THREE.Vector3(x, yMax, 0),
        new THREE.Vector3(x, yMin, 0),
        new THREE.Vector3(x, yMin, zMax),
      ]);
      const mat = new THREE.LineDashedMaterial({
        color: 0x60a5fa, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6,
      });
      const ln = new THREE.LineSegments(geo, mat);
      ln.computeLineDistances();
      axesGroup.add(ln);
      // Etiqueta en ambos extremos
      axesGroup.add(mkLabel(lbl, x, yMin - 0.5, 0, "#60a5fa"));
      axesGroup.add(mkLabel(lbl, x, yMax + 0.5, 0, "#60a5fa"));
    });
    // Ejes en Y (1, 2, 3...) — líneas paralelas al eje X a cada y_i
    ys.forEach((y, i) => {
      const lbl = `${i + 1}`;
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(xMin, y, 0),
        new THREE.Vector3(xMax, y, 0),
        new THREE.Vector3(xMin, y, 0),
        new THREE.Vector3(xMin, y, zMax),
      ]);
      const mat = new THREE.LineDashedMaterial({
        color: 0xfb7185, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6,
      });
      const ln = new THREE.LineSegments(geo, mat);
      ln.computeLineDistances();
      axesGroup.add(ln);
      axesGroup.add(mkLabel(lbl, xMin - 0.5, y, 0, "#fb7185"));
      axesGroup.add(mkLabel(lbl, xMax + 0.5, y, 0, "#fb7185"));
    });
    axesGroup.visible = true;
    viewerRender();
  };
  (window as any).__hekatanHideAxes = () => {
    axesGroup.visible = false;
    viewerRender();
  };

  // ── Planos de referencia visibles ──
  // Líneas semitransparentes en X-Y a Z=0,3,6,9,12 m que sirven de guía
  // al dibujar (ej. niveles de pisos). El usuario activa/desactiva con
  // window.__hekatanShowRefPlanes(zArray, gridSizeM).
  // Además de las líneas visuales, cada plano tiene un Mesh INVISIBLE de
  // 10000×10000 m para raycast — permite dibujar EN ISOMÉTRICO directamente
  // sobre cualquier plano: el click engancha al plano más cercano al rayo
  // de cámara (el que el usuario "ve al frente").
  const refPlanesGroup = new THREE.Group();
  refPlanesGroup.visible = false;
  scene.add(refPlanesGroup);
  // Meshes invisibles para raycast — separados del group visual.
  let refPlaneMeshes: THREE.Mesh[] = [];
  (window as any).__hekatanShowRefPlanes = (
    zLevels: number[] = [0, 3, 6, 9, 12],
    sizeM: number = 20,
    centerX: number = 0,    // grid centrado en origen (convención CAD)
    centerY: number = 0,
  ) => {
    // Limpiar viejos
    while (refPlanesGroup.children.length) {
      const c = refPlanesGroup.children.pop()!;
      (c as any).geometry?.dispose();
      (c as any).material?.dispose();
    }
    refPlaneMeshes.forEach(m => {
      scene.remove(m);
      m.geometry.dispose();
      (m.material as THREE.Material).dispose();
    });
    refPlaneMeshes = [];
    const colors = [0x60a5fa, 0x34d399, 0xfbbf24, 0xfb7185, 0xc084fc, 0x22d3ee];
    zLevels.forEach((z, i) => {
      const col = colors[i % colors.length];
      // Borde rectangular del plano
      const half = sizeM / 2;
      const pts = [
        new THREE.Vector3(centerX - half, centerY - half, z),
        new THREE.Vector3(centerX + half, centerY - half, z),
        new THREE.Vector3(centerX + half, centerY + half, z),
        new THREE.Vector3(centerX - half, centerY + half, z),
        new THREE.Vector3(centerX - half, centerY - half, z),
      ];
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.55 });
      refPlanesGroup.add(new THREE.Line(geo, mat));
      // Label "Z=X m" como Sprite simple usando texto canvas
      const canvas2 = document.createElement('canvas');
      canvas2.width = 128; canvas2.height = 32;
      const cctx = canvas2.getContext('2d')!;
      cctx.fillStyle = `#${col.toString(16).padStart(6, '0')}`;
      cctx.font = 'bold 18px sans-serif';
      cctx.fillText(`Z = ${z} m`, 4, 22);
      const tex = new THREE.CanvasTexture(canvas2);
      const sprMat = new THREE.SpriteMaterial({ map: tex, transparent: true });
      const spr = new THREE.Sprite(sprMat);
      spr.position.set(centerX - half - 1.5, centerY - half - 1.5, z);
      spr.scale.set(2.5, 0.6, 1);
      refPlanesGroup.add(spr);
      // Mesh INVISIBLE 10000×10000 horizontal en XY a Z=z para raycast.
      // userData.z guarda el nivel para identificarlo después si hace falta.
      const rmGeo = new THREE.PlaneGeometry(10000, 10000);
      const rmMat = new THREE.MeshBasicMaterial({ visible: false, side: THREE.DoubleSide });
      const rmMesh = new THREE.Mesh(rmGeo, rmMat);
      rmMesh.position.set(0, 0, z);  // plano XY a la altura Z dada
      // PlaneGeometry default está en XY → ya es horizontal en este sistema Z-up.
      // Ojo: el "plane" del active workplane usa rotateX(π/2) porque viene
      // pre-rotado con `geometry.rotateX(π/2)`. Acá NO necesitamos rotar.
      rmMesh.frustumCulled = false;
      (rmMesh as any).userData = { refPlaneZ: z };
      scene.add(rmMesh);
      refPlaneMeshes.push(rmMesh);
    });
    refPlanesGroup.visible = true;
    viewerRender();
  };
  (window as any).__hekatanHideRefPlanes = () => {
    refPlanesGroup.visible = false;
    // Los meshes invisibles también dejan de ser raycast targets.
    refPlaneMeshes.forEach(m => { m.visible = false; });
    viewerRender();
  };

  // ── Líneas auxiliares (construction lines) ──
  // Color cyan dashed semitransparente. NO generan frames FEM, pero SÍ son
  // objeto de OSNAP (endpoint/midpoint/intersection). Útil para construir
  // referencias en 3D iso, alinear, proyectar, etc.
  const auxLinesGroup = new THREE.Group();
  auxLinesGroup.frustumCulled = false;
  scene.add(auxLinesGroup);
  const renderAuxLines = () => {
    while (auxLinesGroup.children.length) {
      const c = auxLinesGroup.children.pop()!;
      (c as any).geometry?.dispose?.();
      (c as any).material?.dispose?.();
    }
    const auxState = (window as any).__hekatanDrawingAuxLines;
    const lines: number[][] = auxState?.rawVal ?? auxState?.val ?? auxState ?? [];
    for (const ln of lines) {
      if (ln.length !== 6) continue;
      const geo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(ln[0], ln[1], ln[2]),
        new THREE.Vector3(ln[3], ln[4], ln[5]),
      ]);
      const mat = new THREE.LineDashedMaterial({
        color: 0x22d3ee,    // cyan
        dashSize: 0.3,
        gapSize: 0.15,
        transparent: true,
        opacity: 0.8,
      });
      const line = new THREE.Line(geo, mat);
      line.computeLineDistances();  // requerido para dashed
      auxLinesGroup.add(line);
    }
  };
  // Re-render automático cuando cambia el array de aux lines
  van.derive(() => {
    const auxState = (window as any).__hekatanDrawingAuxLines;
    if (auxState?.val) {
      auxState.val;  // dependency
      renderAuxLines();
      viewerRender();
    }
  });

  // ── Puntos auxiliares (aux points) ──
  // Esferitas cyan que NO generan nodos FEM pero sirven de referencia
  // OSnap (endpoint). Cada entry en __hekatanDrawingAuxPoints es [x,y,z].
  // Render como Mesh sphere con scale dinámico (constante en pantalla).
  const auxPointsGroup = new THREE.Group();
  auxPointsGroup.frustumCulled = false;
  scene.add(auxPointsGroup);
  const renderAuxPoints = () => {
    while (auxPointsGroup.children.length) {
      const c = auxPointsGroup.children.pop()!;
      (c as any).geometry?.dispose?.();
      (c as any).material?.dispose?.();
    }
    const apState = (window as any).__hekatanDrawingAuxPoints;
    const pts: number[][] = apState?.rawVal ?? apState?.val ?? apState ?? [];
    for (const p of pts) {
      if (!p || p.length !== 3) continue;
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(0.025, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.85, depthTest: false }),
      );
      m.position.set(p[0], p[1], p[2]);
      m.renderOrder = 996;
      m.scale.setScalar(markerScreenScale(m.position));
      auxPointsGroup.add(m);
    }
  };
  van.derive(() => {
    const apState = (window as any).__hekatanDrawingAuxPoints;
    if (apState?.val !== undefined) {
      apState.val;  // dependency
      renderAuxPoints();
      viewerRender();
    }
  });
  // Re-escalar al cambiar cámara
  controls.addEventListener("change", () => {
    auxPointsGroup.children.forEach((m: any) => {
      m.scale.setScalar(markerScreenScale(m.position));
    });
  });
  (window as any).__hekatanRenderAuxPoints = renderAuxPoints;

  // ── Snap 3D Indicator ──
  // Tamaño REDUCIDO: sphere 1 cm + halo 1.5 cm + cruz 0.08 m. El scale
  // tiene cap _snapMaxScale para evitar cursor gigante en plan view.
  const snapMarker = new THREE.Group();
  const snapSphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.010, 12, 12),
    new THREE.MeshBasicMaterial({ color: 0xff3344, transparent: true, opacity: 0.95 }),
  );
  const snapHalo = new THREE.Mesh(
    new THREE.SphereGeometry(0.015, 12, 12),
    new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.20, depthWrite: false }),
  );
  snapMarker.add(snapSphere, snapHalo);
  // Cruz de ejes 0.08 m — más chica
  const axisLen = 0.08;
  const mkLine = (a: [number, number, number], b: [number, number, number], col: number) => {
    const g = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(...a), new THREE.Vector3(...b),
    ]);
    return new THREE.Line(g, new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.7 }));
  };
  snapMarker.add(mkLine([-axisLen, 0, 0], [axisLen, 0, 0], 0xff0000)); // X rojo
  snapMarker.add(mkLine([0, -axisLen, 0], [0, axisLen, 0], 0x00ff00)); // Y verde
  snapMarker.add(mkLine([0, 0, -axisLen], [0, 0, axisLen], 0x0088ff)); // Z azul
  snapMarker.visible = false;
  snapMarker.frustumCulled = false;
  scene.add(snapMarker);
  // ── Tamaño constante en pantalla (compensa el zoom) ──
  // Sin esto, al acercarse el snap marker crece visualmente (es geometría
  // 3D world-space). Calculamos el scale = distancia/factor para que el
  // tamaño aparente en píxeles quede igual a cualquier zoom.
  // Calibración: a 10m de la cámara, scale=1 (sphere=2cm, cruz=15cm).
  const _snapBaseDist = 40;   // factor mayor → sphere mas chica al alejar
  const _snapMaxScale = 2.5;  // cap mas agresivo para plan view de modelos grandes
  const updateSnapMarkerScale = () => {
    if (!snapMarker.visible) return;
    const cam = getActiveCamera();
    const dist = cam.position.distanceTo(snapMarker.position);
    const s = Math.max(0.05, Math.min(_snapMaxScale, dist / _snapBaseDist));
    snapMarker.scale.setScalar(s);
  };
  // Helper compartido: re-escala cada esfera de selección (cyan) según
  // su distancia individual a la cámara. Se invoca al orbitar/zoomear y
  // también justo después de refreshSelectionGroup().
  const updateSelectionPtScale = () => {
    if (selectionGroup.children.length === 0) return;
    selectionGroup.children.forEach((child) => {
      if (!(child as any).__isSelectionPt) return;
      const m = child as THREE.Mesh;
      // x1.8 respecto al marcador de hover: un nudo SELECCIONADO tiene que
      // cantar. Con el mismo tamano que el resto de marcadores quedaba un
      // punto de ~8 px que sobre las lineas blancas del modelo no se
      // distinguia de un nudo cualquiera.
      m.scale.setScalar(markerScreenScale(m.position) * 1.8);
    });
  };
  (window as any).__hekatanUpdateSelectionPtScale = updateSelectionPtScale;
  // Re-escalar cuando el usuario zoomea/orbita (OrbitControls emite "change")
  controls.addEventListener("change", () => {
    updateSnapMarkerScale();
    // hoverPtHL — el indicador amarillo de selección de nodo (hover) también
    // debe mantener tamaño constante en pantalla. Sin esto se ve enorme al
    // zoom in (la geometría es 0.02m world-space). Usar la función definida
    // arriba que también maneja cámara ortográfica.
    if (hoverPtHL.visible) updateHoverPtScale();
    // Mismo tratamiento para osnapMarker (Endpoint/Mid/Per/etc.) creado más
    // abajo. Lo referenciamos por window porque la closure todavía no lo tiene.
    const om = (window as any).__hekatanOsnapMarkerRef as THREE.Group | undefined;
    if (om?.visible) {
      const dist2 = getActiveCamera().position.distanceTo(om.position);
      om.scale.setScalar(Math.max(0.05, dist2 / _snapBaseDist));
    }
    // Esferas cyan de selección — mismo tratamiento.
    updateSelectionPtScale();
  });
  // API pública para mover el snap marker (útil para demos + debug)
  (window as any).__hekatanShowSnap = (x: number, y: number, z: number) => {
    snapMarker.position.set(x, y, z);
    snapMarker.visible = true;
    updateSnapMarkerScale();
    viewerRender();
  };
  (window as any).__hekatanHideSnap = () => {
    snapMarker.visible = false;
    viewerRender();
  };
  // Auto-update el snap marker cuando se mueve el mouse sobre el plano
  // Prioridad: OSNAP (Endpoint/Midpoint/etc.) > grid snap 2D
  // ADEMÁS: rubber band desde último punto al cursor + polar tracking
  rendererElm.addEventListener("pointermove", (event: PointerEvent) => {
    const _camForRay = setPointerFromEvent(event);
    if (!_camForRay) return;
    raycaster.setFromCamera(pointer, _camForRay);
    const hit = intersectWorkPlane();
    if (hit.length) {
      const p = hit[0].point;
      const osnapTol = ((window as any).__hekatanSnap2D ?? 0.5) * 1.2;
      const osnap = (window as any).__hekatanOsnapCompute?.(p.x, p.y, p.z, osnapTol);
      if (osnap) {
        showOsnap(osnap.type, osnap.x, osnap.y, osnap.z);
        snapMarker.position.set(osnap.x, osnap.y, osnap.z);
        snapMarker.visible = true;
        p.set(osnap.x, osnap.y, osnap.z);
      } else {
        hideOsnap();
        // Toggle global: si __hekatanSnapEnabled es false, NO snap a grid.
        // El cursor queda en la coordenada raw del raycaster.
        const snapEnabled = (window as any).__hekatanSnapEnabled !== false;
        const snap = (window as any).__hekatanSnap2D ?? 0.5;
        if (snapEnabled && snap > 0) {
          p.x = Math.round(p.x / snap) * snap;
          p.y = Math.round(p.y / snap) * snap;
          p.z = Math.round(p.z / snap) * snap;
        }
        snapMarker.position.copy(p);
        snapMarker.visible = true;
      }
      updateSnapMarkerScale();  // tamaño constante en pantalla
      // ── SELECT TOOL: hover highlight + click para seleccionar ──
      // Cuando el cursor está cerca de un nodo / segmento / aux line, lo
      // resalta en AMARILLO. Click selecciona en CYAN. Ctrl+Click multi.
      // Selección rápida sin tener que activar otra herramienta.
      const curTool = ((window as any).__hekatanCadState?.get?.() as any)?.tool ?? "select";
      if (curTool === "select" || !curTool) {
        const tol = ((window as any).__hekatanSnap2D ?? 0.5) * 1.5;
        // Prioridad: NODO > SEGMENTO > AUX. Más fácil seleccionar un punto.
        const ptIdx = findClosestPoint(p.x, p.y, p.z, tol);
        const found = findClosestPoly(p.x, p.y, p.z, tol);
        const auxIdx = findClosestAuxLine(p.x, p.y, p.z, tol);
        if (ptIdx >= 0) {
          const pt = drawingObj.points.rawVal[ptIdx];
          hoverPtHL.position.set(pt[0], pt[1], pt[2]);
          hoverPtHL.visible = true;
          updateHoverPtScale();  // tamaño constante en pantalla
          hoverHL.visible = false;
          hoverItem = { kind: "pt", a: ptIdx };
        } else if (found) {
          const allPts = drawingObj.points.rawVal;
          const poly = drawingObj.polylines!.rawVal[found.polyIdx];
          const a = allPts[poly[found.segIdx]], b = allPts[poly[found.segIdx+1]];
          hoverHL.geometry.setFromPoints([
            new THREE.Vector3(a[0], a[1], a[2]),
            new THREE.Vector3(b[0], b[1], b[2]),
          ]);
          hoverHL.visible = true;
          hoverPtHL.visible = false;
          // ¿Es un área? entonces seleccionar polilínea entera
          const isArea = drawingObj.areas?.rawVal?.includes(found.polyIdx) ?? false;
          hoverItem = isArea
            ? { kind: "poly", a: found.polyIdx }
            : { kind: "seg", a: found.polyIdx, b: found.segIdx };
        } else if (auxIdx >= 0) {
          const auxState = (window as any).__hekatanDrawingAuxLines;
          const ln = (auxState?.rawVal ?? [])[auxIdx];
          if (ln) {
            hoverHL.geometry.setFromPoints([
              new THREE.Vector3(ln[0], ln[1], ln[2]),
              new THREE.Vector3(ln[3], ln[4], ln[5]),
            ]);
            hoverHL.visible = true;
            hoverPtHL.visible = false;
            hoverItem = { kind: "aux", a: auxIdx };
          }
        } else {
          hoverHL.visible = false;
          hoverPtHL.visible = false;
          hoverItem = null;
        }
        coordReadout.style.left = event.clientX + "px";
        coordReadout.style.top = event.clientY + "px";
        coordReadout.style.display = "block";
        // ── COORDS DISPLAY: si el hover detectó un NODO existente, mostrar
        // las coords EXACTAS del nodo (no el raycast raw). El cursor visual
        // ya se snappeó al nodo (hoverPtHL en pt[0..2]), así que las coords
        // del readout deben coincidir con el snap visible. Antes mostraba
        // X=0.03 cuando el nodo estaba en X=0.00 — confuso.
        let coordPt = p;
        if (hoverItem?.kind === "pt") {
          const nodePt = drawingObj.points.rawVal[hoverItem.a];
          if (nodePt) {
            coordPt = new THREE.Vector3(nodePt[0], nodePt[1], nodePt[2]);
          }
        }
        const coords = `X=${coordPt.x.toFixed(2)} Y=${coordPt.y.toFixed(2)} Z=${coordPt.z.toFixed(2)}`;
        // la barra de estado de abajo (getCadStatusBar) lee de aquí
        (window as any).__hekatanCursorXYZ = [coordPt.x, coordPt.y, coordPt.z];
        if (hoverItem) {
          const labels: any = { pt: "nodo", seg: "segmento", poly: "área", aux: "línea aux" };
          coordReadout.textContent = `${coords}  ·  🖱 Click → ${labels[hoverItem.kind]}`;
        } else {
          coordReadout.textContent = coords;
        }
        // Sincronizar panel fijo de coords (siempre visible)
        const fixedReadout = document.getElementById("hk-coord-fixed");
        if (fixedReadout) fixedReadout.textContent = coords;
        rubberBand.visible = false;
        polarLines.visible = false;
        viewerRender();
        return;
      }
      if (curTool === "delete" || curTool === "trim" || curTool === "extend" || curTool === "offset") {
        const tol = ((window as any).__hekatanSnap2D ?? 0.5) * 1.5;
        // Buscar lo más cerca entre polilínea y aux line — gana el de menor dist
        const foundPoly = findClosestPoly(p.x, p.y, p.z, tol);
        const foundAuxIdx = findClosestAuxLine(p.x, p.y, p.z, tol);
        // Comparar distancias para elegir cuál resaltar
        let pickAux = false;
        if (foundAuxIdx >= 0) {
          if (!foundPoly) pickAux = true;
          else {
            // Recomputar dist del aux para comparar (cheap, 1 línea)
            const auxState = (window as any).__hekatanDrawingAuxLines;
            const lns: number[][] = auxState?.rawVal ?? auxState?.val ?? auxState ?? [];
            const ln = lns[foundAuxIdx];
            const dAux = distPointSeg(p.x, p.y, p.z, ln[0],ln[1],ln[2], ln[3],ln[4],ln[5]);
            if (dAux < foundPoly.dist) pickAux = true;
          }
        }
        if (pickAux) {
          hoveredAuxIndex = foundAuxIdx;
          hoveredPolyIndex = -1;
          hoveredSegIndex = -1;
          showDeleteAuxHover(foundAuxIdx);
        } else if (foundPoly) {
          hoveredPolyIndex = foundPoly.polyIdx;
          hoveredSegIndex = foundPoly.segIdx;
          hoveredAuxIndex = -1;
          showDeleteHover(foundPoly.polyIdx, foundPoly.segIdx);
        } else {
          hoveredPolyIndex = -1;
          hoveredSegIndex = -1;
          hoveredAuxIndex = -1;
          deleteHover.visible = false;
        }
        // Hide rubberband + polar in delete mode (no sentido)
        rubberBand.visible = false;
        polarLines.visible = false;
        hideRubberLabel();
        coordReadout.style.left = event.clientX + "px";
        coordReadout.style.top = event.clientY + "px";
        coordReadout.style.display = "block";
        const coordsDel = `X=${p.x.toFixed(2)} Y=${p.y.toFixed(2)} Z=${p.z.toFixed(2)}`;
        let hint = "";
        if (pickAux) {
          hint = `🗑 línea aux #${hoveredAuxIndex + 1}`;
        } else if (foundPoly) {
          const isArea = drawingObj.areas?.rawVal?.includes(foundPoly.polyIdx) ?? false;
          hint = isArea
            ? `🗑 área #${foundPoly.polyIdx + 1}`
            : `🗑 seg ${foundPoly.segIdx + 1} / poly #${foundPoly.polyIdx + 1}`;
        } else {
          hint = `🗑 acercá a línea/área`;
        }
        coordReadout.textContent = `${coordsDel}  ·  ${hint}`;
        // Sincronizar panel fijo
        const fixedReadoutDel = document.getElementById("hk-coord-fixed");
        if (fixedReadoutDel) fixedReadoutDel.textContent = coordsDel;
        viewerRender();
        return;
      } else {
        deleteHover.visible = false;
        hoveredPolyIndex = -1;
        hoveredAuxIndex = -1;
      }
      // ── COORD READOUT: texto al lado del cursor con X, Y, Z + ΔL si rubber band
      coordReadout.style.left = event.clientX + "px";
      coordReadout.style.top = event.clientY + "px";
      coordReadout.style.display = "block";
      // ── RUBBER BAND: línea desde el último punto de la polilínea actual
      // hasta el cursor. Solo visible si hay al menos 1 punto previo en la
      // polilínea activa. Da feedback constante "voy a dibujar desde aquí".
      const polys = drawingObj.polylines?.rawVal ?? [];
      const lastPoly = polys[polys.length - 1] ?? [];
      const allPts = drawingObj.points.rawVal ?? [];
      if (lastPoly.length > 0 && allPts[lastPoly[lastPoly.length - 1]]) {
        const lastIdx = lastPoly[lastPoly.length - 1];
        const lastPt = allPts[lastIdx];
        let effectiveLock = axisLock;
        _axisSnapPoint = null; // reset por frame
        // ── SNAP a EJES auxiliares en 3D (X/Y/Z desde el último punto) ──
        // Si el mouse pasa CERCA (en pantalla) de la LÍNEA de un eje, engancha
        // el punto al punto de ESE eje 3D más cercano al rayo de cámara. Permite
        // alinear al eje Z (vertical) aunque el plano de trabajo sea XY, y a X/Y
        // en cualquier vista. Tiene prioridad sobre ORTO/polar.
        if (!effectiveLock && (window as any).__hekatanAxisSnap !== false) {
          const rectAx = rendererElm.getBoundingClientRect();
          const mx = event.clientX, my = event.clientY;
          const Lax = (settings.gridSize?.rawVal ?? 10);
          const P0 = new THREE.Vector3(lastPt[0], lastPt[1], lastPt[2]);
          const axDirs: Array<["x" | "y" | "z", THREE.Vector3]> = [
            ["x", new THREE.Vector3(1, 0, 0)],
            ["y", new THREE.Vector3(0, 1, 0)],
            ["z", new THREE.Vector3(0, 0, 1)],
          ];
          const toScreenAx = (v: THREE.Vector3) => {
            const c = v.clone().project(_camForRay);
            return { x: (c.x * 0.5 + 0.5) * rectAx.width + rectAx.left,
                     y: (-c.y * 0.5 + 0.5) * rectAx.height + rectAx.top };
          };
          let bestAx: { axis: "x" | "y" | "z"; dpx: number; pt: THREE.Vector3 } | null = null;
          for (const [axis, u] of axDirs) {
            const aS = toScreenAx(P0.clone().addScaledVector(u, -Lax));
            const bS = toScreenAx(P0.clone().addScaledVector(u, Lax));
            const vx = bS.x - aS.x, vy = bS.y - aS.y, wx = mx - aS.x, wy = my - aS.y;
            const len2 = vx * vx + vy * vy || 1;
            let t = (wx * vx + wy * vy) / len2; t = Math.max(0, Math.min(1, t));
            const dpx = Math.hypot(mx - (aS.x + t * vx), my - (aS.y + t * vy));
            if (bestAx === null || dpx < bestAx.dpx) {
              // punto del eje más cercano al rayo de cámara (line-line closest)
              const ray = raycaster.ray;
              const w0 = P0.clone().sub(ray.origin);
              const b = u.dot(ray.direction), d_ = u.dot(w0), e = ray.direction.dot(w0);
              const denom = 1 - b * b;
              const s = Math.abs(denom) < 1e-6 ? -d_ : (b * e - d_) / denom;
              bestAx = { axis, dpx, pt: P0.clone().addScaledVector(u, s) };
            }
          }
          if (bestAx && bestAx.dpx <= 12) {   // ≤12 px del eje → engancha
            p.copy(bestAx.pt);
            effectiveLock = bestAx.axis;
            _axisSnapPoint = bestAx.pt.clone(); // el click commitea acá
          }
        }
        // ── ORTO mode (F8) ── auto-detecta el eje dominante si está activo.
        const orthoOn = !!(window as any).__hekatanOrthoMode;
        if (!effectiveLock && orthoOn) {
          const dx = Math.abs(p.x - lastPt[0]);
          const dy = Math.abs(p.y - lastPt[1]);
          const dz = Math.abs(p.z - lastPt[2]);
          // Detectar plano hover desde la intersección actual (igual que
          // refPlaneBadge calcula más abajo). El plano hover restringe ORTO
          // a solo los 2 ejes del plano.
          const hoveredObj = hit[0]?.object;
          let hoveredPlane: "xy" | "xz" | "yz" | null = null;
          if (hoveredObj === refFillXY) hoveredPlane = "xy";
          else if (hoveredObj === refFillXZ) hoveredPlane = "xz";
          else if (hoveredObj === refFillYZ) hoveredPlane = "yz";
          if (hoveredPlane === "xy") {
            effectiveLock = dx >= dy ? "x" : "y";
          } else if (hoveredPlane === "xz") {
            effectiveLock = dx >= dz ? "x" : "z";
          } else if (hoveredPlane === "yz") {
            effectiveLock = dy >= dz ? "y" : "z";
          } else {
            effectiveLock = dx >= dy && dx >= dz ? "x" : (dy >= dz ? "y" : "z");
          }
        }
        // ── POLAR TRACKING automático (estilo AutoCAD) ──
        // Si NO hay lock manual ni ORTO, pero el cursor está CERCA (dentro de
        // una tolerancia angular) de uno de los ejes X/Y/Z desde el último
        // punto → enganchar a ese eje. Eso lo RESALTA (la lógica de abajo lo
        // pinta) y hace que al clickear el punto caiga JUSTO sobre el eje.
        const polarOn = (window as any).__hekatanPolarTrack !== false; // default ON
        if (!effectiveLock && polarOn) {
          const dxr = p.x - lastPt[0], dyr = p.y - lastPt[1], dzr = p.z - lastPt[2];
          const len = Math.hypot(dxr, dyr, dzr);
          if (len > 1e-3) {
            const TOL_DEG = 6;                                  // ± grados de enganche
            const band = Math.tan(TOL_DEG * Math.PI / 180) * len; // banda perp. proporcional
            const perpX = Math.hypot(dyr, dzr);                 // dist al eje X
            const perpY = Math.hypot(dxr, dzr);                 // dist al eje Y
            const perpZ = Math.hypot(dxr, dyr);                 // dist al eje Z
            const cands: Array<["x" | "y" | "z", number]> = [["x", perpX], ["y", perpY], ["z", perpZ]];
            cands.sort((a, b) => a[1] - b[1]);
            if (cands[0][1] <= band) effectiveLock = cands[0][0]; // dentro de tolerancia → engancha
          }
        }
        if (effectiveLock) {
          // Proyección manual al eje (sin tocar axisLock global, así no
          // interfiere con direct distance entry que usa axisLock para signo).
          const ax = lastPt[0], ay = lastPt[1], az = lastPt[2];
          if (effectiveLock === "x") p.set(p.x, ay, az);
          else if (effectiveLock === "y") p.set(ax, p.y, az);
          else p.set(ax, ay, p.z);
          // ── Badge dinámico "⊥ ORTO X/Y/Z" o "🔒 LOCK X/Y/Z" ──
          // Confirmación visual junto al cursor de que está alineado al eje.
          // Diferencia manual (axisLock por tecla) vs auto (ORTO mode por F8).
          const isManual = !!axisLock;
          const colors = { x: "#ff3344", y: "#34d399", z: "#60a5fa" };
          const c = colors[effectiveLock];
          axisLockBadge.style.background = "rgba(15,23,42,0.92)";
          axisLockBadge.style.color = c;
          axisLockBadge.style.border = `1.5px solid ${c}`;
          // Detectar plano hover para incluir en el badge (más informativo)
          const hovObj = hit[0]?.object;
          let hovPlane: "xy" | "xz" | "yz" | null = null;
          if (hovObj === refFillXY) hovPlane = "xy";
          else if (hovObj === refFillXZ) hovPlane = "xz";
          else if (hovObj === refFillYZ) hovPlane = "yz";
          const planeText = hovPlane ? ` (plano ${hovPlane.toUpperCase()})` : "";
          axisLockBadge.textContent = isManual
            ? `🔒 LOCK ${effectiveLock.toUpperCase()}${planeText}`
            : `⊥ ORTO ${effectiveLock.toUpperCase()}${planeText}`;
          // Posicionar junto al cursor (offset abajo-derecha del coord readout)
          axisLockBadge.style.left = (event.clientX + 20) + "px";
          axisLockBadge.style.top = (event.clientY + 18) + "px";
          axisLockBadge.style.transform = "none";
          axisLockBadge.style.display = "block";
        } else {
          // Sin lock activo — ocultar badge (a menos que el global keydown
          // lo tenga activo manualmente; pero si llegamos acá axisLock=null).
          if (!axisLock) axisLockBadge.style.display = "none";
        }
        const dL = Math.hypot(p.x - lastPt[0], p.y - lastPt[1], p.z - lastPt[2]);
        const ang = Math.atan2(p.y - lastPt[1], p.x - lastPt[0]) * 180 / Math.PI;
        const coordsRb = `X=${p.x.toFixed(2)} Y=${p.y.toFixed(2)} Z=${p.z.toFixed(2)}`;
        coordReadout.textContent = `${coordsRb} | ΔL=${dL.toFixed(2)}m ${ang.toFixed(0)}°`;
        const fr = document.getElementById("hk-coord-fixed");
        if (fr) fr.textContent = coordsRb;
        rubberBand.geometry.setFromPoints([
          new THREE.Vector3(lastPt[0], lastPt[1], lastPt[2]),
          new THREE.Vector3(p.x, p.y, p.z),
        ]);
        (rubberBand as any).computeLineDistances?.();
        rubberBand.visible = true;
        // Dim label en midpoint del rubber band (referencial mientras se dibuja)
        updateRubberLabel(lastPt[0], lastPt[1], lastPt[2], p.x, p.y, p.z);
        // ── Polar tracking — líneas X/Y/Z extendidas desde el último punto
        // hasta los bordes del modelo (longitud 5m por dirección, ajustable)
        // Tamaño configurable desde Tweakpane vía window.__hekatanOrthoExt.
      // Default 8m (cuadrado 16×16). Usuario puede agrandar/achicar con slider.
      const ext = (window as any).__hekatanOrthoExt ?? 8;
        // 3 planos de referencia ortogonales (XY/XZ/YZ) centrados en lastPt:
        // bordes (LineLoop) + fill (Mesh transparente). El fill permite
        // identificar visualmente sobre qué plano está cayendo el cursor.
        // El toggle window.__hekatanShowOrthoPlanes controla si se muestran
        // (botón Tweakpane "▦ Planos ref. ortogonales").
        const showOrtho = (window as any).__hekatanShowOrthoPlanes !== false;
        // Toggle del grupo entero (los hijos individualmente quedan visible=true
        // por construcción; el grupo padre orthoRefGroup es el switch real).
        orthoRefGroup.visible = showOrtho;
        if (!showOrtho) {
          setRefPlaneHover(null);
        }
        if (showOrtho) {
          updateRefPlaneRect(refPlaneXY, lastPt, "xy", ext);
          updateRefPlaneRect(refPlaneXZ, lastPt, "xz", ext);
          updateRefPlaneRect(refPlaneYZ, lastPt, "yz", ext);
          updateRefPlaneFill(refFillXY, lastPt, "xy", ext);
          updateRefPlaneFill(refFillXZ, lastPt, "xz", ext);
          updateRefPlaneFill(refFillYZ, lastPt, "yz", ext);
        }
        // Detectar sobre qué plano de referencia está el cursor (raycast).
        // El plano con la PRIMERA intersección es el que el rayo de cámara
        // cruza primero — el más cerca a la pantalla.
        const refHits = !showOrtho ? [] : raycaster.intersectObjects(
          [refFillXY, refFillXZ, refFillYZ], false,
        );
        let hoveredRefPlane: "xy" | "xz" | "yz" | null = null;
        if (refHits.length > 0) {
          const obj = refHits[0].object;
          if (obj === refFillXY) hoveredRefPlane = "xy";
          else if (obj === refFillXZ) hoveredRefPlane = "xz";
          else if (obj === refFillYZ) hoveredRefPlane = "yz";
        }
        setRefPlaneHover(hoveredRefPlane);
        // Posicionar badge cerca del cursor
        if (hoveredRefPlane) {
          refPlaneBadge.style.left = event.clientX + "px";
          refPlaneBadge.style.top = event.clientY + "px";
        }
        polarX.geometry.setFromPoints([
          new THREE.Vector3(lastPt[0] - ext, lastPt[1], lastPt[2]),
          new THREE.Vector3(lastPt[0] + ext, lastPt[1], lastPt[2]),
        ]);
        (polarX as any).computeLineDistances?.();
        polarY.geometry.setFromPoints([
          new THREE.Vector3(lastPt[0], lastPt[1] - ext, lastPt[2]),
          new THREE.Vector3(lastPt[0], lastPt[1] + ext, lastPt[2]),
        ]);
        (polarY as any).computeLineDistances?.();
        polarZ.geometry.setFromPoints([
          new THREE.Vector3(lastPt[0], lastPt[1], lastPt[2] - ext),
          new THREE.Vector3(lastPt[0], lastPt[1], lastPt[2] + ext),
        ]);
        (polarZ as any).computeLineDistances?.();
        polarLines.visible = true;
        // ── Resaltar la polar del eje al que se está proyectando ──
        // Si effectiveLock=x → polarX brillante (op 0.95), polarY/Z apagados
        // (op 0.12). Idem Y, Z. Sin lock → todos opacidad media (0.5).
        // Esto da feedback visual inequívoco: "estás dibujando en EL eje
        // resaltado" (el rubber band cae sobre esa misma línea proyectada).
        const polarMatX = polarX.material as THREE.LineDashedMaterial;
        const polarMatY = polarY.material as THREE.LineDashedMaterial;
        const polarMatZ = polarZ.material as THREE.LineDashedMaterial;
        if (effectiveLock === "x") {
          polarMatX.opacity = 0.95; polarMatY.opacity = 0.10; polarMatZ.opacity = 0.10;
        } else if (effectiveLock === "y") {
          polarMatX.opacity = 0.10; polarMatY.opacity = 0.95; polarMatZ.opacity = 0.10;
        } else if (effectiveLock === "z") {
          polarMatX.opacity = 0.10; polarMatY.opacity = 0.10; polarMatZ.opacity = 0.95;
        } else {
          polarMatX.opacity = 0.5; polarMatY.opacity = 0.5; polarMatZ.opacity = 0.5;
        }
      } else {
        // Sin punto previo: solo mostrar coords del cursor
        const coordsNop = `X=${p.x.toFixed(2)} Y=${p.y.toFixed(2)} Z=${p.z.toFixed(2)}`;
        coordReadout.textContent = coordsNop;
        const frNop = document.getElementById("hk-coord-fixed");
        if (frNop) frNop.textContent = coordsNop;
        rubberBand.visible = false;
        polarLines.visible = false;
        // ── INPUT PARA EL PRIMER PUNTO ──
        // Si hay un drawing tool activo (line, polyline, area, node, etc.)
        // y aún no se hizo el primer click, mostramos el rubberLabelInput
        // cerca del cursor pre-cargado con la coord snapped del cursor en
        // formato "X,Y,Z". Enter → commitAbsolutePoint con esa coord; o
        // tipear "5,3,2" → ese punto absoluto. Estilo AutoCAD: la primera
        // coordenada también puede ingresarse por teclado, no sólo click.
        const drawingTools = new Set([
          "line", "polyline", "area", "node",
          "column", "wall", "rect", "circle", "arc",
          "polyline-multi", "axis", "chaflan",
        ]);
        if (drawingTools.has(curTool)) {
          rubberStart = null;  // primer punto: no hay rubber start aún
          rubberDir = null;
          rubberLabelInput.style.left = (event.clientX + 20) + "px";
          rubberLabelInput.style.top = (event.clientY - 28) + "px";
          rubberLabelInput.style.display = "block";
          // Live update del placeholder con coords actuales (excepto si el
          // usuario está editando manualmente — preservamos su texto).
          if (!rubberUserEditing) {
            rubberLabelInput.value = `${p.x.toFixed(2)},${p.y.toFixed(2)},${p.z.toFixed(2)}`;
            // Auto-focus + select-all sólo si nadie más tiene focus
            const ae = document.activeElement;
            const isOtherInput = ae && (ae.tagName === "INPUT" || ae.tagName === "TEXTAREA")
                                  && ae !== rubberLabelInput;
            if (!isOtherInput && document.activeElement !== rubberLabelInput) {
              rubberLabelInput.focus({ preventScroll: true });
            }
            try { rubberLabelInput.select(); } catch {}
          }
        } else {
          hideRubberLabel();
        }
      }
      viewerRender();
    } else {
      hideOsnap();
      coordReadout.style.display = "none";
      snapMarker.visible = false;
      rubberBand.visible = false;
      polarLines.visible = false;
      hideRubberLabel();
      viewerRender();
    }
  });

  // Events
  // On gridTarget change, interpolate grid and update plane position and rotation
  van.derive(() => {
    if (!drawingObj.gridTarget) return;

    interpolate(
      gridObj,
      {
        position: new THREE.Vector3(...drawingObj.gridTarget.val.position),
        quaternion: new THREE.Quaternion().setFromEuler(
          new THREE.Euler(...drawingObj.gridTarget.val.rotation)
        ),
      },
      viewerRender
    );

    plane.position.set(...drawingObj.gridTarget.val.position);
    plane.quaternion.setFromEuler(
      new THREE.Euler(...drawingObj.gridTarget.val.rotation)
    );
    plane.updateMatrixWorld(); // to fix intersect object
    // ¿El plano quedó INCLINADO (normal no axis-aligned)? Si sí, el raycast
    // usará solo este plano (ver intersectWorkPlane). Las orientaciones
    // ortogonales (XY/XZ/YZ) tienen la normal en ±X/±Y/±Z → NO inclinado.
    const nrm = new THREE.Vector3(0, 0, 1).applyEuler(
      new THREE.Euler(...drawingObj.gridTarget.val.rotation)
    );
    inclinedPlaneActive = !(Math.abs(nrm.x) > 0.999 || Math.abs(nrm.y) > 0.999 || Math.abs(nrm.z) > 0.999);
  });

  // On points change, update points positions for intersections
  van.derive(() => {
    points.geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(drawingObj.points.val.flat(), 3)
    );
    points.geometry.computeBoundingSphere();
  });

  // On derivedDisplayScale update raycaster threshold (NO tocamos el size del
  // indicationPoint — ahora está en píxeles con sizeAttenuation:false y debe
  // quedar constante al zoom). El threshold sigue en world-units porque es
  // para el raycaster, no el render visual.
  van.derive(() => {
    const sizeWorld = 0.05 * gridSize * 0.5 * derivedDisplayScale.val;
    raycaster.params.Points.threshold = 0.4 * sizeWorld;
  });

  van.derive(() => {
    const allPoints = drawingObj.points.val ?? [];
    const polylines = drawingObj.polylines?.val ?? [];
    const lastPolyline = polylines.at(-1) ?? [];
  
    const posArray: number[] = [];
  
    for (const i of lastPolyline) {
      const [x, y, z] = allPoints[i];
      posArray.push(x, y, z);
    }
  
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(posArray, 3)
    );
  
    activePoints.geometry.dispose();
    activePoints.geometry = geometry;
  });

  // Pointer events
  let pointerdown = false;
  let pointerDownAndMovedCount = 0;

  // Compute pointerDownAndMovedCount (dragging)
  rendererElm.addEventListener("pointerdown", () => {
    pointerdown = true;
  });

  rendererElm.addEventListener("pointerup", () => {
    pointerdown = false;
  });

  rendererElm.addEventListener("pointermove", () => {
    if (pointerdown) pointerDownAndMovedCount++;
  });

  // ── WINDOW / CROSSING SELECTION estilo AutoCAD ──
  // En modo SELECT, drag con botón izquierdo dibuja un rectángulo en pantalla:
  //   • Izquierda → derecha = ventana (azul, sólido) → solo objetos COMPLETAMENTE
  //     dentro del rectángulo se seleccionan.
  //   • Derecha → izquierda = crossing (verde, dashed) → objetos parcialmente
  //     dentro o que CRUCEN el rectángulo se seleccionan.
  // Si no hay drag (mouseup sin movimiento) → click normal (lo maneja el otro
  // listener). El threshold es 8 píxeles para diferenciar click vs drag.
  const dragRect = document.createElement("div");
  dragRect.id = "hk-window-select";
  dragRect.style.cssText = [
    "position:fixed", "pointer-events:none", "z-index:99996",
    "display:none", "border:1.5px solid", "background:rgba(0,0,0,0)",
  ].join(";") + ";";
  document.body.appendChild(dragRect);
  let dragStart: { x: number; y: number } | null = null;
  let dragActive = false;

  // ── CLICK-CLICK RECT SELECT (AutoCAD puro) ──
  // Patrón alternativo al press-drag-release: el usuario hace click sin
  // mantener, mueve el cursor y vuelve a hacer click para definir la
  // esquina opuesta. Útil en mobile (touch sin drag) y para usuarios
  // de AutoCAD que prefieren ese flujo. Se activa SOLO cuando el primer
  // click cae en espacio vacío (sin hoverItem) y no hay multi-modifier.
  let ccAnchor: { x: number; y: number } | null = null;
  // Helper: pinta el preview del rect (usado por ambos modos)
  const paintDragRect = (
    x0: number, y0: number, x1: number, y1: number, isCrossing: boolean,
  ) => {
    if (isCrossing) {
      dragRect.style.borderColor = "#34d399";
      dragRect.style.borderStyle = "dashed";
      dragRect.style.background = "rgba(52, 211, 153, 0.10)";
    } else {
      dragRect.style.borderColor = "#22d3ee";
      dragRect.style.borderStyle = "solid";
      dragRect.style.background = "rgba(34, 211, 238, 0.10)";
    }
    dragRect.style.left = Math.min(x0, x1) + "px";
    dragRect.style.top = Math.min(y0, y1) + "px";
    dragRect.style.width = Math.abs(x1 - x0) + "px";
    dragRect.style.height = Math.abs(y1 - y0) + "px";
    dragRect.style.display = "block";
  };
  // Helper compartido: ejecuta la selección dado un par de esquinas en
  // pantalla. Lo usan AMBOS modos (drag-and-release y click-click).
  const finalizeRectSelection = (
    aX: number, aY: number, bX: number, bY: number, isMulti: boolean,
  ) => {
    const x0 = Math.min(aX, bX);
    const x1 = Math.max(aX, bX);
    const y0 = Math.min(aY, bY);
    const y1 = Math.max(aY, bY);
    const isCrossing = bX < aX;  // R→L = crossing
    const rect = rendererElm.getBoundingClientRect();
    const cam = getActiveCamera();
    cam.updateMatrixWorld();
    const projectToScreen = (p: number[]): { x: number; y: number } => {
      const v = new THREE.Vector3(p[0], p[1], p[2]);
      v.project(cam);
      return {
        x: rect.left + (v.x * 0.5 + 0.5) * rect.width,
        y: rect.top + (-v.y * 0.5 + 0.5) * rect.height,
      };
    };
    const inRect = (sp: { x: number; y: number }) =>
      sp.x >= x0 && sp.x <= x1 && sp.y >= y0 && sp.y <= y1;
    const segCrosses = (a: { x: number; y: number }, b: { x: number; y: number }) => {
      if (a.x < x0 && b.x < x0) return false;
      if (a.x > x1 && b.x > x1) return false;
      if (a.y < y0 && b.y < y0) return false;
      if (a.y > y1 && b.y > y1) return false;
      return true;
    };
    if (!isMulti) selection.clear();
    let added = 0;
    const pts = drawingObj.points?.rawVal ?? [];
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i]; if (!p) continue;
      if (inRect(projectToScreen(p))) { selection.add(`pt:${i}`); added++; }
    }
    // ── Regla estilo AutoCAD ──
    //   WINDOW (izq→der, azul):  selecciona SOLO si está COMPLETAMENTE dentro
    //                            (ambos extremos del segmento adentro).
    //   CROSSING (der→izq, verde): selecciona si TOCA el recuadro (un extremo
    //                            adentro o lo cruza).
    const segMatch = (sa: { x: number; y: number }, sb: { x: number; y: number }) =>
      isCrossing
        ? (inRect(sa) || inRect(sb) || segCrosses(sa, sb))
        : (inRect(sa) && inRect(sb));
    const polys = drawingObj.polylines?.rawVal ?? [];
    const areas = drawingObj.areas?.rawVal ?? [];
    for (let i = 0; i < polys.length; i++) {
      const poly = polys[i];
      const isArea = areas.includes(i);
      if (isArea) {
        // Window: TODOS los vértices del área adentro. Crossing: cualquier arista toca.
        let areaMatch: boolean;
        if (!isCrossing) {
          areaMatch = poly.every((idx) => { const p = pts[idx]; return !!p && inRect(projectToScreen(p)); });
        } else {
          areaMatch = false;
          for (let j = 0; j < poly.length - 1; j++) {
            const a = pts[poly[j]], b = pts[poly[j + 1]]; if (!a || !b) continue;
            if (segMatch(projectToScreen(a), projectToScreen(b))) { areaMatch = true; break; }
          }
        }
        if (areaMatch) { selection.add(`poly:${i}`); added++; }
      } else {
        for (let j = 0; j < poly.length - 1; j++) {
          const a = pts[poly[j]], b = pts[poly[j + 1]]; if (!a || !b) continue;
          if (segMatch(projectToScreen(a), projectToScreen(b))) { selection.add(`seg:${i}:${j}`); added++; }
        }
      }
    }
    const auxState = (window as any).__hekatanDrawingAuxLines;
    const aux: number[][] = auxState?.rawVal ?? [];
    for (let i = 0; i < aux.length; i++) {
      const ln = aux[i];
      if (!ln || ln.length !== 6) continue;
      const sa = projectToScreen([ln[0], ln[1], ln[2]]);
      const sb = projectToScreen([ln[3], ln[4], ln[5]]);
      if (segMatch(sa, sb)) { selection.add(`aux:${i}`); added++; }
    }
    refreshSelectionGroup();
    updateStatus(
      `${isCrossing ? "🟢 Crossing" : "🔵 Window"} — ${added} item(s) ${isMulti ? "agregados a" : "→"} selección (total ${selection.size})`,
    );
    dragRect.style.display = "none";
  };
  // API pública: cancela el modo click-click si está activo (Esc, cambio
  // de tool, otra acción).
  const cancelClickClick = () => {
    if (ccAnchor) {
      ccAnchor = null;
      dragRect.style.display = "none";
      updateStatus("Selección cancelada");
    }
  };
  (window as any).__hekatanCancelClickClickRect = cancelClickClick;
  // Cancelar con Escape
  window.addEventListener("keydown", (ev: KeyboardEvent) => {
    if (ev.key === "Escape" && ccAnchor) cancelClickClick();
  });

  // ── DELETE/BACKSPACE: borrar items seleccionados ──
  // Tecla Delete (o Backspace) elimina del modelo todos los items en
  // selection: pt:N (nodo), seg:P:S (segmento), poly:P (polilínea/área),
  // aux:N (línea auxiliar). Tras borrar:
  //   1. Limpia selection
  //   2. Refresca cyan group
  //   3. Trigger __hekatanRebuild() para que el FEM se reconstruya
  // Ignora si: hay un input enfocado (Tweakpane editing), o sin selección.
  const deleteSelectedItems = () => {
    if (selection.size === 0) return false;
    const ids = [...selection];
    const pts = drawingObj.points?.rawVal ?? [];
    const polys = drawingObj.polylines?.rawVal ?? [];
    const areas = drawingObj.areas?.rawVal ?? [];
    const auxState = (window as any).__hekatanDrawingAuxLines;
    const auxLines: number[][] = auxState?.rawVal ?? [];

    // Sets de índices a borrar
    const ptsToDelete = new Set<number>();
    const polysToDelete = new Set<number>();
    const segsToDelete = new Map<number, Set<number>>();  // polyIdx → Set<segIdx>
    const auxToDelete = new Set<number>();
    for (const id of ids) {
      const [kind, ...rest] = id.split(":");
      if (kind === "pt") ptsToDelete.add(+rest[0]);
      else if (kind === "poly") polysToDelete.add(+rest[0]);
      else if (kind === "seg") {
        const pIdx = +rest[0], sIdx = +rest[1];
        if (!segsToDelete.has(pIdx)) segsToDelete.set(pIdx, new Set());
        segsToDelete.get(pIdx)!.add(sIdx);
      } else if (kind === "aux") auxToDelete.add(+rest[0]);
    }

    let deletedCount = 0;

    // 1) Borrar polilíneas completas marcadas + propagar borrado a sus pts huérfanos
    let newPolys: number[][] = [];
    let newAreas: number[] = [];
    const polyIdxRemap = new Map<number, number>();
    for (let i = 0; i < polys.length; i++) {
      if (polysToDelete.has(i)) {
        deletedCount++;
        continue;  // skip
      }
      polyIdxRemap.set(i, newPolys.length);
      // Si tiene segs marcados para borrar, partir la polilínea
      const segDel = segsToDelete.get(i);
      if (segDel && segDel.size > 0) {
        // Reconstruir polilínea sin los segmentos borrados.
        // Cada segmento k es entre poly[k] y poly[k+1]. Si k está en segDel,
        // se "corta" la polilínea allí, generando posiblemente múltiples polilíneas.
        let cur: number[] = [];
        for (let k = 0; k < polys[i].length; k++) {
          cur.push(polys[i][k]);
          if (k < polys[i].length - 1 && segDel.has(k)) {
            // Cerrar fragmento actual
            if (cur.length >= 2) newPolys.push(cur);
            cur = [];  // empezar nuevo (sin el next pt — segmento borrado)
            deletedCount++;
          }
        }
        if (cur.length >= 2) newPolys.push(cur);
        else if (cur.length === 1) {
          // Pt huérfano: lo dejamos, queda un nodo sin segmentos
          newPolys.push(cur);
        }
      } else {
        newPolys.push([...polys[i]]);
      }
    }

    // 2) Borrar pts marcados + propagar a polylines (remover refs + cortar)
    if (ptsToDelete.size > 0) {
      // Filtrar pts y construir remap viejo→nuevo
      const newPts: [number, number, number][] = [];
      const ptRemap = new Map<number, number>();
      for (let i = 0; i < pts.length; i++) {
        if (ptsToDelete.has(i)) { deletedCount++; continue; }
        ptRemap.set(i, newPts.length);
        newPts.push([...pts[i]] as [number, number, number]);
      }
      // Recorrer polylines y reemplazar índices, cortando donde hay borrados
      const polysAfterPtDel: number[][] = [];
      for (const poly of newPolys) {
        let cur: number[] = [];
        for (const oldIdx of poly) {
          const newIdx = ptRemap.get(oldIdx);
          if (newIdx === undefined) {
            // pt borrado → cortar polilínea aquí
            if (cur.length >= 2) polysAfterPtDel.push(cur);
            cur = [];
          } else {
            cur.push(newIdx);
          }
        }
        if (cur.length >= 2) polysAfterPtDel.push(cur);
      }
      newPolys = polysAfterPtDel;
      drawingObj.points.val = newPts;
    }

    // 3) Filtrar y remapear areas
    for (const a of areas) {
      const newIdx = polyIdxRemap.get(a);
      if (newIdx !== undefined && newIdx < newPolys.length) newAreas.push(newIdx);
    }
    if (drawingObj.polylines) drawingObj.polylines.val = newPolys;
    if (drawingObj.areas) drawingObj.areas.val = newAreas;

    // 4) Borrar aux lines
    if (auxToDelete.size > 0 && auxState) {
      const newAux = auxLines.filter((_, i) => !auxToDelete.has(i));
      if ("val" in auxState) auxState.val = newAux;
      else (window as any).__hekatanDrawingAuxLines = newAux;
      deletedCount += auxToDelete.size;
    }

    // 5) Limpiar selection y refrescar
    selection.clear();
    refreshSelectionGroup();
    try { (window as any).__hekatanRebuild?.(); } catch {}
    updateStatus(`🗑 ${deletedCount} item(s) borrado(s)`);
    return true;
  };
  (window as any).__hekatanDeleteSelected = deleteSelectedItems;

  window.addEventListener("keydown", (ev: KeyboardEvent) => {
    if (ev.key !== "Delete" && ev.key !== "Backspace") return;
    const ae = document.activeElement as HTMLElement | null;
    // La barra de comandos (siempre enfocada) y su input al cursor NO deben
    // bloquear el Delete si están VACÍOS → permitir borrar la selección.
    const isEmptyCmd = ae && (ae.id === "hk3-cmd-input" || ae.id === "hk-dyn-input")
      && (ae as HTMLInputElement).value === "";
    if (ae && (ae.tagName === "INPUT" || ae.tagName === "TEXTAREA" || ae.isContentEditable) && !isEmptyCmd) {
      return; // editando texto real → no borrar la selección
    }
    if (selection.size === 0) return;
    ev.preventDefault();
    deleteSelectedItems();
  });

  // ════════════════════════════════════════════════════════════════════
  // PROPERTIES PANE — Tweakpane real, auto-aparece al seleccionar
  // ════════════════════════════════════════════════════════════════════
  // Construido con la librería `tweakpane` (no DOM vanilla). Al cambiar
  // la selección se DESTRUYE el pane previo y se construye uno nuevo
  // con los folders relevantes según el tipo de items seleccionados:
  //   • Solo nodos      → DOFs apoyo + carga puntual + masa
  //   • Solo segmentos  → sección + material + releases I/J + dist load
  //   • Solo áreas/shells → tipo + espesor + material + carga superficial
  //   • Mixto           → mensaje (sin propiedades)
  // Las modificaciones disparan CustomEvent("hk:property-applied",
  // { detail: { kind, ids, prop, value } }) en window. El workspace
  // (main.ts) puede subscribirse para mutar states.nodeInputs/elementInputs.
  const propsContainer = document.createElement("div");
  propsContainer.id = "hk-properties-pane";
  // Posición persistida en localStorage entre sesiones
  const PROPS_POS_KEY = "hk-props-pane-pos";
  let savedPos: { left: number; top: number } | null = null;
  try {
    const raw = localStorage.getItem(PROPS_POS_KEY);
    if (raw) savedPos = JSON.parse(raw);
  } catch {}
  // ── El panel de propiedades va AL LADO, no en medio ───────────────────────
  //
  // Estaba en `left:50%; top:8px`, o sea centrado arriba: al seleccionar un
  // nudo se abria justo encima del ribbon Y del modelo. Y como es un panel
  // solido, el siguiente clic caia en el en vez de en el lienzo, asi que
  // despues de seleccionar una vez ya no se podia seleccionar nada mas —
  // parecia que la seleccion estaba rota y solo estaba tapada.
  //
  // Ahora arranca en el lateral izquierdo, por debajo de Settings. Sigue
  // siendo arrastrable y la posicion se guarda.
  propsContainer.style.cssText = [
    "position:fixed",
    savedPos ? `left:${savedPos.left}px` : "left:14px",
    savedPos ? `top:${savedPos.top}px` : "top:452px",
    "transform:none",
    "width:min(300px, calc(100vw - 32px))",
    "max-height:calc(100vh - 560px)",
    "overflow-y:auto",
    "z-index:201",
    "box-shadow:0 6px 24px rgba(0,0,0,0.45)",
    "border-radius:6px",
    "display:none",
  ].join(";") + ";";
  document.body.appendChild(propsContainer);

  // ── DRAG por el title bar (mismo patrón que el paneHost del workspace) ──
  // El handle es la barra de título Tweakpane (.tp-rotv_b). Como el Pane se
  // dispone y recrea en cada cambio de selección, re-attach al final de
  // updatePropsPane() llamando a setupPropsDrag().
  const setupPropsDrag = () => {
    const handle = propsContainer.querySelector(".tp-rotv_b") as HTMLElement | null;
    if (!handle || (handle as any).__hkDragWired) return;
    (handle as any).__hkDragWired = true;
    handle.style.cursor = "move";
    handle.style.userSelect = "none";

    let dragging = false;
    let startX = 0, startY = 0, origLeft = 0, origTop = 0;
    handle.addEventListener("mousedown", (e: MouseEvent) => {
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const r = propsContainer.getBoundingClientRect();
      origLeft = r.left;
      origTop = r.top;
      // Convertir transform-based positioning a left/top fijo para el drag
      propsContainer.style.transform = "none";
      propsContainer.style.left = `${origLeft}px`;
      propsContainer.style.top = `${origTop}px`;
      e.preventDefault();
    });
    window.addEventListener("mousemove", (e: MouseEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const newLeft = Math.max(0, Math.min(window.innerWidth - 80, origLeft + dx));
      const newTop = Math.max(0, Math.min(window.innerHeight - 40, origTop + dy));
      propsContainer.style.left = `${newLeft}px`;
      propsContainer.style.top = `${newTop}px`;
    });
    window.addEventListener("mouseup", () => {
      if (!dragging) return;
      dragging = false;
      try {
        localStorage.setItem(PROPS_POS_KEY, JSON.stringify({
          left: parseFloat(propsContainer.style.left),
          top: parseFloat(propsContainer.style.top),
        }));
      } catch {}
    });
  };

  // Almacén de estado mutable que Tweakpane usa para .addBinding(state, key)
  const propsState = {
    // ── Nodos (Joint en ETABS) ──
    // Restraints
    Ux: false, Uy: false, Uz: false, Rx: false, Ry: false, Rz: false,
    // Joint Loads
    Fx: 0, Fy: 0, Fz: 0, Mx: 0, My: 0, Mz: 0,
    // Springs (joint elastic) — kN/m, kN·m/rad
    Kx: 0, Ky: 0, Kz: 0, Krx: 0, Kry: 0, Krz: 0,
    // Additional Mass
    mass: 0,
    // Diaphragms
    diaphragm: "Ninguno",  // "Ninguno", "D1 (rigid)", "D2", "D3"...
    // ── Frames (segs) ──
    section: "W14x84", material_frame: "A572 Gr 50",
    // Property Modifiers (multipliers sobre A, Iz, Iy, J)
    A_mod: 1.0, Iz_mod: 1.0, Iy_mod: 1.0, J_mod: 1.0,
    // Insertion Point (cardinal point — 1..11 estilo ETABS)
    insertionPoint: "10 — Centroid",
    // Local Axes (rotación angular en grados sobre eje local-x)
    beta: 0,
    // Releases I/J
    relMxI: false, relMyI: false, relMzI: false,
    relMxJ: false, relMyJ: false, relMzJ: false,
    // Hinges (plastic — para nonlinear pushover)
    hinges: "None",  // "None", "Auto-FEMA M3", "Auto-FEMA P-M2-M3", ...
    // Line Springs (kN/m por metro de longitud — Winkler tipo)
    LKx: 0, LKy: 0, LKz: 0,
    // Carga distribuida (kN/m)
    qx: 0, qy: 0, qz: 0,
    // Additional Mass (kg/m)
    massPerM: 0,
    // ── Áreas / shells ──
    shellType: "Mindlin (FSDT)", thickness: 0.20,
    material_shell: "Concreto C25", surfLoad: 0,
  };
  // Estado de la categoría EDITAR (replicar / mover la selección).
  const editState = { dx: 0, dy: 0, dz: 3, copias: 1 };
  let propsPaneInstance: Pane | null = null;

  const fireProp = (kind: string, ids: string[], prop: string, value: any) => {
    window.dispatchEvent(new CustomEvent("hk:property-applied", {
      detail: { kind, ids, prop, value },
    }));
  };

  const updatePropsPane = () => {
    // Destruir el Pane anterior (importante para no acumular)
    if (propsPaneInstance) {
      propsPaneInstance.dispose();
      propsPaneInstance = null;
    }
    if (selection.size === 0) {
      propsContainer.style.display = "none";
      return;
    }
    // Clasificar selección
    const ids = [...selection];
    const nodeIds = ids.filter(id => id.startsWith("pt:"));
    const segIds = ids.filter(id => id.startsWith("seg:"));
    const polyIds = ids.filter(id => id.startsWith("poly:"));
    const auxIds = ids.filter(id => id.startsWith("aux:"));

    // NOTA: antes el panel era excluyente (onlyNodes / onlySegs / onlyPolys /
    // isMixed) y una selección mixta (ej. nodos + segmentos) no mostraba NADA
    // editable. Ahora cada TIPO presente en la selección muestra su propia
    // sección con su botón "Aplicar" que opera SOLO sobre su subconjunto de
    // ids. Así podés seleccionar nodos + frames juntos y asignar restricciones
    // a los nodos y secciones a los frames sin deseleccionar.
    const hasNodes = nodeIds.length > 0;
    const hasSegs = segIds.length > 0;
    const hasPolys = polyIds.length > 0;
    const noneEditable = !hasNodes && !hasSegs && !hasPolys; // solo aux / vacío

    // Título: resumen por tipo
    const parts: string[] = [];
    if (nodeIds.length) parts.push(`🔵 ${nodeIds.length} nodo(s)`);
    if (segIds.length) parts.push(`📏 ${segIds.length} segmento(s)`);
    if (polyIds.length) parts.push(`▭ ${polyIds.length} área(s)`);
    if (auxIds.length) parts.push(`┊ ${auxIds.length} aux`);
    const title = `🎯 ${selection.size} item(s) — ${parts.join(", ")}`;

    propsPaneInstance = new Pane({ container: propsContainer, title });

    // ── CATEGORÍA "✏️ Editar" (Replicar / Mover) ──
    // Arriba del todo, como segunda categoría junto a "Asignar" (Restraints/
    // Loads/Section). Colapsada por defecto para no estorbar. Permite REPLICAR
    // la estructura seleccionada (dx,dy,dz × copias) y togglear el snap.
    {
      const fEdit = propsPaneInstance.addFolder({ title: "✏️ Editar — Replicar / Mover", expanded: false });
      fEdit.addBinding(editState, "dx", { label: "Δx (m)", step: 0.1 });
      fEdit.addBinding(editState, "dy", { label: "Δy (m)", step: 0.1 });
      fEdit.addBinding(editState, "dz", { label: "Δz (m)", step: 0.1 });
      fEdit.addBinding(editState, "copias", { label: "Copias", min: 1, max: 50, step: 1 });
      fEdit.addButton({ title: "⧉ Replicar selección" }).on("click", () => {
        const n = (window as any).__hekatanReplicateSelection?.(editState.dx, editState.dy, editState.dz, editState.copias);
        updateStatus(n ? `⧉ Replicado ×${n} (Δ ${editState.dx},${editState.dy},${editState.dz} m)` : "⚠ Nada que replicar — seleccioná nodos/frames/áreas");
      });
      fEdit.addButton({ title: "→ Mover selección (1 copia, sin duplicar geometría base)" }).on("click", () => {
        // Mover = replicar 1 y borrar original sería complejo; por ahora replica.
        const n = (window as any).__hekatanReplicateSelection?.(editState.dx, editState.dy, editState.dz, 1);
        updateStatus(n ? `→ Copia desplazada Δ ${editState.dx},${editState.dy},${editState.dz} m` : "⚠ Nada seleccionado");
      });
      const fSnap = fEdit.addFolder({ title: "🧲 Snap", expanded: false });
      fSnap.addButton({ title: "Snap a grilla ON/OFF (F9)" }).on("click", () => (window as any).__hekatanToggleSnap?.());
      fSnap.addButton({ title: "OSNAP (endpoints/medios) ON/OFF" }).on("click", () => {
        (window as any).__hekatanOsnapOn = !((window as any).__hekatanOsnapOn ?? true);
        updateStatus(`🧲 OSNAP ${(window as any).__hekatanOsnapOn ? "ON" : "OFF"}`);
      });
    }

    if (hasNodes) {
      // ── Joint > Restraints (Apoyos) ──
      const fApoyo = propsPaneInstance.addFolder({ title: `📌 Restraints (DOFs) — ${nodeIds.length} nodo(s)` });
      fApoyo.addBinding(propsState, "Ux");
      fApoyo.addBinding(propsState, "Uy");
      fApoyo.addBinding(propsState, "Uz");
      fApoyo.addBinding(propsState, "Rx");
      fApoyo.addBinding(propsState, "Ry");
      fApoyo.addBinding(propsState, "Rz");

      // ── Joint > Springs (Resortes elásticos) ──
      const fSprings = propsPaneInstance.addFolder({ title: "🌀 Springs (kN/m, kN·m/rad)", expanded: false });
      fSprings.addBinding(propsState, "Kx", { label: "Kx", min: 0, step: 100 });
      fSprings.addBinding(propsState, "Ky", { label: "Ky", min: 0, step: 100 });
      fSprings.addBinding(propsState, "Kz", { label: "Kz", min: 0, step: 100 });
      fSprings.addBinding(propsState, "Krx", { label: "Krx", min: 0, step: 1000 });
      fSprings.addBinding(propsState, "Kry", { label: "Kry", min: 0, step: 1000 });
      fSprings.addBinding(propsState, "Krz", { label: "Krz", min: 0, step: 1000 });

      // ── Joint Loads (Carga puntual) ──
      const fCarga = propsPaneInstance.addFolder({ title: "⬇ Joint Loads (kN, kN·m)" });
      fCarga.addBinding(propsState, "Fx", { step: 0.1 });
      fCarga.addBinding(propsState, "Fy", { step: 0.1 });
      fCarga.addBinding(propsState, "Fz", { step: 0.1 });
      fCarga.addBinding(propsState, "Mx", { step: 0.1 });
      fCarga.addBinding(propsState, "My", { step: 0.1 });
      fCarga.addBinding(propsState, "Mz", { step: 0.1 });

      // ── Joint > Additional Mass ──
      const fMasa = propsPaneInstance.addFolder({ title: "⚖ Additional Mass (kg)", expanded: false });
      fMasa.addBinding(propsState, "mass", { label: "m", min: 0, step: 1 });

      // ── Joint > Diaphragms (rigid floor) ──
      const fDiaph = propsPaneInstance.addFolder({ title: "🔗 Diaphragm (rigid link)", expanded: false });
      fDiaph.addBinding(propsState, "diaphragm", {
        label: "Diafragma",
        options: {
          "Ninguno": "Ninguno",
          "D1 (rigid)": "D1 (rigid)",
          "D2 (rigid)": "D2 (rigid)",
          "D3 (rigid)": "D3 (rigid)",
        },
      });

      propsPaneInstance.addButton({ title: `✓ Aplicar a ${nodeIds.length} nodo(s) seleccionado(s)` }).on("click", () => {
        let applied = 0;
        const dofs = [propsState.Ux, propsState.Uy, propsState.Uz,
                      propsState.Rx, propsState.Ry, propsState.Rz];
        if (dofs.some(d => d)) { fireProp("nodes", nodeIds, "supports", dofs); applied++; }

        const loads = [propsState.Fx, propsState.Fy, propsState.Fz,
                       propsState.Mx, propsState.My, propsState.Mz];
        if (loads.some(v => v !== 0)) { fireProp("nodes", nodeIds, "loads", loads); applied++; }

        const springs = [propsState.Kx, propsState.Ky, propsState.Kz,
                         propsState.Krx, propsState.Kry, propsState.Krz];
        if (springs.some(k => k !== 0)) { fireProp("nodes", nodeIds, "springs", springs); applied++; }

        if (propsState.mass !== 0) { fireProp("nodes", nodeIds, "mass", propsState.mass); applied++; }

        if (propsState.diaphragm !== "Ninguno") {
          fireProp("nodes", nodeIds, "diaphragm", propsState.diaphragm); applied++;
        }

        if (applied === 0) {
          // Nada marcado → avisar fuerte en vez de mentir con "aplicadas".
          updateStatus("⚠ Nada que aplicar — marcá un DOF (Ux…Rz) para apoyo, o un valor de carga/resorte/masa, y volvé a aplicar.");
          let toast = document.getElementById("hk-prop-toast");
          if (!toast) {
            toast = document.createElement("div");
            toast.id = "hk-prop-toast";
            toast.style.cssText = "position:fixed;bottom:60px;left:50%;transform:translateX(-50%);z-index:99999;padding:9px 20px;border-radius:8px;font:600 14px system-ui;color:#fff;pointer-events:none;transition:opacity .25s;box-shadow:0 4px 16px rgba(0,0,0,.4)";
            document.body.appendChild(toast);
          }
          toast.textContent = "⚠ Nada que aplicar — marcá un DOF (Ux…Rz) para empotrado/articulado, después Aplicar";
          toast.style.background = "rgba(217,119,6,0.97)";
          toast.style.opacity = "1";
          clearTimeout((window as any).__hekatanPropToastT);
          (window as any).__hekatanPropToastT = setTimeout(() => { if (toast) toast.style.opacity = "0"; }, 3200);
        } else {
          updateStatus(`✓ Propiedades aplicadas a ${nodeIds.length} nodo(s)`);
        }
      });
    }
    if (hasSegs) {
      const fSec = propsPaneInstance.addFolder({ title: `📏 Sección frame — ${segIds.length} seg(s)` });
      fSec.addBinding(propsState, "section", {
        label: "Sección",
        options: {
          "W14x84": "W14x84", "W18x86": "W18x86", "W24x146": "W24x146",
          "HEB300": "HEB300", "IPN300": "IPN300", "IPE400": "IPE400",
          "Custom...": "Custom...",
        },
      });
      fSec.addBinding(propsState, "material_frame", {
        label: "Material",
        options: {
          "A572 Gr 50": "A572 Gr 50", "A36": "A36",
          "A992": "A992", "Concreto C25": "Concreto C25",
        },
      });

      // ── Frame > Property Modifiers (multipliers sobre rigidez) ──
      const fMods = propsPaneInstance.addFolder({ title: "🔧 Property Modifiers", expanded: false });
      fMods.addBinding(propsState, "A_mod", { label: "A mod", min: 0, max: 10, step: 0.1 });
      fMods.addBinding(propsState, "Iz_mod", { label: "Iz mod (fuerte)", min: 0, max: 10, step: 0.1 });
      fMods.addBinding(propsState, "Iy_mod", { label: "Iy mod (débil)", min: 0, max: 10, step: 0.1 });
      fMods.addBinding(propsState, "J_mod", { label: "J mod", min: 0, max: 10, step: 0.1 });

      // ── Frame > Insertion Point (Cardinal Point estilo ETABS) ──
      const fInsert = propsPaneInstance.addFolder({ title: "🎯 Insertion Point", expanded: false });
      fInsert.addBinding(propsState, "insertionPoint", {
        label: "Cardinal",
        options: {
          "1 — Bottom Left":   "1 — Bottom Left",
          "2 — Bottom Center": "2 — Bottom Center",
          "3 — Bottom Right":  "3 — Bottom Right",
          "4 — Middle Left":   "4 — Middle Left",
          "5 — Middle Center": "5 — Middle Center",
          "6 — Middle Right":  "6 — Middle Right",
          "7 — Top Left":      "7 — Top Left",
          "8 — Top Center":    "8 — Top Center",
          "9 — Top Right":     "9 — Top Right",
          "10 — Centroid":     "10 — Centroid",
          "11 — Shear Center": "11 — Shear Center",
        },
      });

      // ── Frame > Local Axes (rotación β) ──
      const fAxes = propsPaneInstance.addFolder({ title: "🧭 Local Axes", expanded: false });
      fAxes.addBinding(propsState, "beta", { label: "β (°)", min: -180, max: 180, step: 5 });

      // ── Frame > Releases I ──
      const fRelI = propsPaneInstance.addFolder({ title: "🔓 Releases extremo I", expanded: false });
      fRelI.addBinding(propsState, "relMxI", { label: "Mx I" });
      fRelI.addBinding(propsState, "relMyI", { label: "My I" });
      fRelI.addBinding(propsState, "relMzI", { label: "Mz I" });

      // ── Frame > Releases J ──
      const fRelJ = propsPaneInstance.addFolder({ title: "🔓 Releases extremo J", expanded: false });
      fRelJ.addBinding(propsState, "relMxJ", { label: "Mx J" });
      fRelJ.addBinding(propsState, "relMyJ", { label: "My J" });
      fRelJ.addBinding(propsState, "relMzJ", { label: "Mz J" });

      // ── Frame > Hinges (plastic, para nonlinear pushover) ──
      const fHinges = propsPaneInstance.addFolder({ title: "🩹 Hinges (plastic)", expanded: false });
      fHinges.addBinding(propsState, "hinges", {
        label: "Tipo",
        options: {
          "None":              "None",
          "Auto-FEMA M3":      "Auto-FEMA M3",
          "Auto-FEMA P-M2-M3": "Auto-FEMA P-M2-M3",
          "Auto-Concrete M3":  "Auto-Concrete M3",
          "Auto-Steel M3":     "Auto-Steel M3",
          "Custom...":         "Custom...",
        },
      });

      // ── Frame > Line Springs (Winkler distribuido por metro) ──
      const fLineSpr = propsPaneInstance.addFolder({ title: "🌀 Line Springs (kN/m por m)", expanded: false });
      fLineSpr.addBinding(propsState, "LKx", { label: "LKx", min: 0, step: 100 });
      fLineSpr.addBinding(propsState, "LKy", { label: "LKy", min: 0, step: 100 });
      fLineSpr.addBinding(propsState, "LKz", { label: "LKz", min: 0, step: 100 });

      // ── Frame Loads — Carga distribuida ──
      const fDist = propsPaneInstance.addFolder({ title: "⬇ Frame Loads (kN/m)" });
      fDist.addBinding(propsState, "qx", { step: 0.1 });
      fDist.addBinding(propsState, "qy", { step: 0.1 });
      fDist.addBinding(propsState, "qz", { step: 0.1 });

      // ── Frame > Additional Mass por longitud ──
      const fMassPerM = propsPaneInstance.addFolder({ title: "⚖ Additional Mass (kg/m)", expanded: false });
      fMassPerM.addBinding(propsState, "massPerM", { label: "m/L", min: 0, step: 1 });

      propsPaneInstance.addButton({ title: "✓ Aplicar a segmentos seleccionados" }).on("click", () => {
        fireProp("segs", segIds, "section", propsState.section);
        fireProp("segs", segIds, "material", propsState.material_frame);

        // Property modifiers (sólo emit si alguno != 1.0)
        const mods = { A: propsState.A_mod, Iz: propsState.Iz_mod, Iy: propsState.Iy_mod, J: propsState.J_mod };
        if (mods.A !== 1 || mods.Iz !== 1 || mods.Iy !== 1 || mods.J !== 1) {
          fireProp("segs", segIds, "modifiers", mods);
        }

        if (propsState.insertionPoint !== "10 — Centroid") {
          fireProp("segs", segIds, "insertionPoint", propsState.insertionPoint);
        }

        if (propsState.beta !== 0) fireProp("segs", segIds, "beta", propsState.beta);

        const relI = [propsState.relMxI, propsState.relMyI, propsState.relMzI];
        const relJ = [propsState.relMxJ, propsState.relMyJ, propsState.relMzJ];
        if (relI.some(r => r) || relJ.some(r => r)) {
          fireProp("segs", segIds, "releases", { i: relI, j: relJ });
        }

        if (propsState.hinges !== "None") fireProp("segs", segIds, "hinges", propsState.hinges);

        const lineSprings = [propsState.LKx, propsState.LKy, propsState.LKz];
        if (lineSprings.some(k => k !== 0)) fireProp("segs", segIds, "lineSprings", lineSprings);

        const qs = [propsState.qx, propsState.qy, propsState.qz];
        if (qs.some(v => v !== 0)) fireProp("segs", segIds, "distLoad", qs);

        if (propsState.massPerM !== 0) fireProp("segs", segIds, "massPerM", propsState.massPerM);

        updateStatus(`✓ Propiedades aplicadas a ${segIds.length} segmento(s)`);
      });
    }
    if (hasPolys) {
      const fShell = propsPaneInstance.addFolder({ title: `▭ Shell / Área — ${polyIds.length}` });
      fShell.addBinding(propsState, "shellType", {
        label: "Tipo",
        options: {
          "Mindlin (FSDT)": "Mindlin (FSDT)",
          "Kirchhoff (CPT)": "Kirchhoff (CPT)",
          "Plane stress": "Plane stress",
        },
      });
      fShell.addBinding(propsState, "thickness", {
        label: "Espesor (m)", min: 0.01, step: 0.01,
      });
      fShell.addBinding(propsState, "material_shell", {
        label: "Material",
        options: {
          "Concreto C20": "Concreto C20", "Concreto C25": "Concreto C25",
          "Concreto C30": "Concreto C30", "Acero A36": "Acero A36",
        },
      });

      const fSurf = propsPaneInstance.addFolder({ title: "⬇ Carga superficial (kN/m²)" });
      fSurf.addBinding(propsState, "surfLoad", { label: "q", step: 0.1 });

      propsPaneInstance.addButton({ title: "✓ Aplicar a áreas seleccionadas" }).on("click", () => {
        fireProp("areas", polyIds, "shellType", propsState.shellType);
        fireProp("areas", polyIds, "thickness", propsState.thickness);
        fireProp("areas", polyIds, "material", propsState.material_shell);
        if (propsState.surfLoad !== 0) {
          fireProp("areas", polyIds, "surfLoad", propsState.surfLoad);
        }
        updateStatus(`✓ Propiedades aplicadas a ${polyIds.length} área(s)/shell(s)`);
      });
    }
    if (noneEditable) {
      // Solo elementos auxiliares (o nada editable) — mostrar info
      const fInfo = propsPaneInstance.addFolder({ title: "ℹ Selección" });
      const infoState = { msg: "Seleccioná nodos, frames o áreas para editar" };
      fInfo.addBinding(infoState, "msg", { readonly: true, label: "" });
    }

    // Botón ✕ cerrar (siempre presente)
    propsPaneInstance.addButton({ title: "✕ Cerrar (limpia selección)" }).on("click", () => {
      selection.clear();
      refreshSelectionGroup();
    });

    propsContainer.style.display = "block";
    // Re-attach drag handler al nuevo title bar (Tweakpane se recrea cada vez)
    setupPropsDrag();
  };

  (window as any).__hekatanRefreshPropsPane = updatePropsPane;

  // ── RIGHT-CLICK TAP = CANCEL (estilo AutoCAD/Revit) ──
  // Al hacer click derecho SIN moverse (tap puro) → cancela la operación
  // pendiente (ccAnchor, drawing en progreso, selección si nada más activo).
  // Implementado vía dispatch de Escape sintético, así reusa TODOS los
  // handlers de cancel existentes (drawMode, selectMode, inspectMode, etc.)
  // sin tener que duplicar la lógica.
  // Si el usuario MANTIENE click derecho y arrastra (>8px) → es PAN de
  // OrbitControls (default), no cancelamos.
  let rcDownPos: { x: number; y: number } | null = null;
  let rcDragged = false;
  rendererElm.addEventListener("pointerdown", (ev: PointerEvent) => {
    if (ev.button === 2) {
      rcDownPos = { x: ev.clientX, y: ev.clientY };
      rcDragged = false;
    }
  });
  rendererElm.addEventListener("pointermove", (ev: PointerEvent) => {
    // Detectar si el right-button está apretado durante move (drag = pan).
    // ev.buttons bitmask: 2 = secondary button. Si está y rcDownPos existe,
    // medimos distancia para diferenciar tap vs drag.
    if (rcDownPos && (ev.buttons & 2) && !rcDragged) {
      const dx = ev.clientX - rcDownPos.x;
      const dy = ev.clientY - rcDownPos.y;
      if (Math.hypot(dx, dy) > 8) rcDragged = true;
    }
  });
  rendererElm.addEventListener("pointerup", (ev: PointerEvent) => {
    if (ev.button === 2) {
      const wasTap = rcDownPos !== null && !rcDragged;
      rcDownPos = null;
      // Si hover.ts marcó que el right-click cayó sobre un nodo/elemento,
      // saltamos el cancel para que el context menu (Asignar / Ver info)
      // pueda mostrarse sin que se cierre la selección.
      const rcOnElement = (window as any).__hekatanRClickOnElement === true;
      (window as any).__hekatanRClickOnElement = false;  // reset
      if (rcOnElement) return;
      if (wasTap) {
        // Right-click TAP → cancel jerárquico (estilo AutoCAD):
        //   1. Si hay rect-select pendiente → cancelar SOLO eso
        //   2. Sino, dispatch Escape (cancela drawing en getCad3d.ts)
        //   3. SIEMPRE limpiar selección + cerrar Properties Pane
        //   4. SIEMPRE salir del tool actual → tool="select" (no quedás
        //      atrapado en line/polyline/etc dibujando sin querer)
        if (ccAnchor) {
          cancelClickClick();
        } else {
          window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
        }
        if (selection.size > 0) {
          selection.clear();
          refreshSelectionGroup();
        }
        // Cerrar la polilínea actual abierta (si estaba dibujando)
        if (drawingObj.polylines) {
          const polys = drawingObj.polylines.rawVal;
          const last = polys[polys.length - 1] ?? [];
          if (last.length > 0) {
            // Si estaba en medio de una polilínea, cerrarla y arrancar nueva
            drawingObj.polylines.val = [...polys, []];
          }
        }
        // Salir del tool — volver a "select" (estilo AutoCAD: ESC o
        // right-click salen al modo de selección por default).
        const cadState = (window as any).__hekatanCadState;
        const curTool = cadState?.get?.()?.tool;
        if (curTool && curTool !== "select" && curTool !== "none") {
          cadState?.setTool?.("select");
          updateStatus(`⎋ Cancelado — tool '${curTool}' cerrado, volvés a Seleccionar`);
        } else {
          updateStatus("⎋ Cancelado (click derecho)");
        }
      }
      // Si fue drag → no hacemos nada (OrbitControls ya hizo pan)
    }
  });
  // Bloquear el menú contextual del browser en el canvas — siempre.
  // Los handlers viejos de contextmenu (delete-point-on-rclick, finish-poly)
  // se neutralizan: usamos right-click sólo para cancel.
  rendererElm.addEventListener("contextmenu", (ev: Event) => {
    ev.preventDefault();
    ev.stopPropagation();
  }, { capture: true });

  rendererElm.addEventListener("pointerdown", (ev: PointerEvent) => {
    const tool = ((window as any).__hekatanCadState?.get?.() as any)?.tool ?? "select";
    if (tool !== "select" && tool !== "none" && tool) return;
    if (ev.button !== 0) return;  // solo botón izquierdo
    // ── La ventana de seleccion NO exige apretar "Seleccionar" antes ─────────
    //
    // Era opt-in: hasta que no se pulsaba el boton, arrastrar orbitaba la
    // camara y no seleccionaba nada. Pero en AutoCAD —y en cualquier CAD—
    // arrastrar sobre el vacio SIEMPRE abre la ventana de seleccion: no hay
    // que activar nada. Sin eso la respuesta a «no puedo seleccionar
    // arrastrando» es «primero aprieta este boton», que no es una respuesta.
    //
    // El opt-in existia por el MOVIL, donde un arrastre tiene que orbitar. Eso
    // ya lo cubre la guarda de `pointerType === "touch"` de aqui abajo, que es
    // la condicion de verdad; el flag sobraba en raton.
    //
    // ⚠️ NO se mira `__hekatanRectSelectExplicit`. Ese flag lo pone el sistema
    // a false al elegir CUALQUIER herramienta de dibujo, no el usuario a
    // proposito: despues de dibujar una linea se quedaba en false para
    // siempre, y el arrastre no pintaba ni el rectangulo. El unico caso en que
    // hay que bloquear la ventana es el modo apoyo/carga del ribbon, y ese se
    // marca aparte y con su nombre.
    if ((window as any).__hekatanBloquearVentana) return;
    // Mouse-only: en touch (pointerType === "touch") no activamos
    // rect-drag aunque el usuario haya elegido Seleccionar — en mobile
    // el drag-to-select es contra-intuitivo (esperan orbit). Para
    // selección puntual, el usuario toca un nodo/línea (click handler).
    if (ev.pointerType === "touch") return;
    // ── MANTENER PULSADO NO SELECCIONA ───────────────────────────────────────
    //
    // La seleccion por ventana es CLIC-CLIC: un clic marca la esquina, el raton
    // se mueve libre y otro clic cierra. Arrastrar con el boton apretado es
    // ORBITAR la camara, y punto.
    //
    // Estaban los dos modos a la vez y se pisaban: al arrastrar para girar el
    // modelo se abria una ventana de seleccion, y al soltar seleccionaba lo que
    // hubiera dentro. Dos gestos parecidos con resultados distintos, y el que
    // sale sin querer es el que rompe el trabajo.
    //
    // `dragStart` se deja a null: el `pointermove` y el `pointerup` de abajo
    // salen solos, y los controles de camara se quedan con el arrastre.
    dragStart = null;
    dragActive = false;
  });
  rendererElm.addEventListener("pointermove", (ev: PointerEvent) => {
    // ── Modo click-click: si hay anchor, pintamos el preview SIN
    // necesidad de tener botón apretado (típica AutoCAD experience).
    // Excepción: si el usuario está holdeando (ev.buttons > 0), está
    // intentando orbitar/pan la cámara — NO pintamos para no confundir.
    if (ccAnchor && ev.buttons === 0) {
      const isCrossing = ev.clientX < ccAnchor.x;
      paintDragRect(ccAnchor.x, ccAnchor.y, ev.clientX, ev.clientY, isCrossing);
      return;
    }
    // ── Modo drag-and-release tradicional ──
    if (!dragStart) return;
    const dx = ev.clientX - dragStart.x;
    const dy = ev.clientY - dragStart.y;
    const dist = Math.hypot(dx, dy);
    if (!dragActive && dist < 8) return;  // threshold click vs drag
    dragActive = true;
    const isCrossing = ev.clientX < dragStart.x;  // R→L = crossing
    paintDragRect(dragStart.x, dragStart.y, ev.clientX, ev.clientY, isCrossing);
  });
  rendererElm.addEventListener("pointerup", (ev: PointerEvent) => {
    if (!dragStart) return;
    if (!dragActive) { dragStart = null; return; }
    const isMulti = ev.ctrlKey || ev.metaKey || ev.shiftKey;
    finalizeRectSelection(dragStart.x, dragStart.y, ev.clientX, ev.clientY, isMulti);
    dragStart = null;
    dragActive = false;
  });

  // On pointer click, add a point and polyline
  // ════════════════════════════════════════════════════════════════════
  // OBJECT SNAP (OSNAP) — estilo AutoCAD
  // ════════════════════════════════════════════════════════════════════
  // Snaps soportados:
  //   - END (Endpoint): extremos de polilíneas/segmentos
  //   - MID (Midpoint): punto medio de un segmento
  //   - NODE: cualquier punto/nodo existente
  //   - CEN (Center): centro de un círculo/arco discretizado
  //   - PER (Perpendicular): proyección perpendicular sobre un segmento
  //   - NEA (Nearest): punto más cercano sobre un segmento
  //   - INT (Intersection): intersección de 2 segmentos
  // El usuario activa cada snap via window.__hekatanOsnap[type] = true
  (window as any).__hekatanOsnap = (window as any).__hekatanOsnap ?? {
    end: true, mid: true, node: true, cen: true,
    per: false, nea: false, int: true,
  };
  // Snap marker visual (cuadrado coloreado por tipo + label)
  const osnapMarker = new THREE.Group();
  osnapMarker.visible = false;
  osnapMarker.frustumCulled = false;
  scene.add(osnapMarker);
  const osnapColors: Record<string, number> = {
    end: 0xff3344, mid: 0xfbbf24, node: 0x60a5fa, cen: 0x34d399,
    per: 0xc084fc, nea: 0xff7eb6, int: 0xff8800,
  };
  const showOsnap = (type: string, x: number, y: number, z: number) => {
    while (osnapMarker.children.length) {
      const c = osnapMarker.children.pop()!;
      (c as any).geometry?.dispose?.();
      (c as any).material?.dispose?.();
    }
    const col = osnapColors[type] ?? 0xffffff;
    // Cuadrado pequeño + label
    const s = 0.05;
    const sqGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(x-s, y-s, z), new THREE.Vector3(x+s, y-s, z),
      new THREE.Vector3(x+s, y-s, z), new THREE.Vector3(x+s, y+s, z),
      new THREE.Vector3(x+s, y+s, z), new THREE.Vector3(x-s, y+s, z),
      new THREE.Vector3(x-s, y+s, z), new THREE.Vector3(x-s, y-s, z),
    ]);
    osnapMarker.add(new THREE.LineSegments(sqGeo, new THREE.LineBasicMaterial({ color: col, linewidth: 2 })));
    osnapMarker.position.set(0, 0, 0);
    osnapMarker.visible = true;
  };
  const hideOsnap = () => { osnapMarker.visible = false; };
  // Compute closest snap for current cursor world point
  const computeOsnap = (px: number, py: number, pz: number, tol: number): { type: string; x: number; y: number; z: number } | null => {
    const opts = (window as any).__hekatanOsnap as Record<string, boolean>;
    const pts = drawingObj.points.rawVal as [number,number,number][];
    const polys = drawingObj.polylines?.rawVal ?? [];
    let best: { type: string; x: number; y: number; z: number; d: number } | null = null;
    const consider = (type: string, x: number, y: number, z: number) => {
      const d = Math.hypot(x - px, y - py, z - pz);
      if (d > tol) return;
      if (!best || d < best.d) best = { type, x, y, z, d };
    };
    // NODE: cada punto existente
    if (opts.node || opts.end) {
      pts.forEach(p => {
        if (opts.node) consider("node", p[0], p[1], p[2]);
      });
    }
    // ENDPOINT + MIDPOINT + NEAREST + PERPENDICULAR sobre segmentos de polilíneas
    for (const poly of polys) {
      if (poly.length < 2) continue;
      for (let i = 0; i < poly.length - 1; i++) {
        const a = pts[poly[i]], b = pts[poly[i+1]];
        if (!a || !b) continue;
        if (opts.end) {
          consider("end", a[0], a[1], a[2]);
          consider("end", b[0], b[1], b[2]);
        }
        if (opts.mid) {
          consider("mid", (a[0]+b[0])/2, (a[1]+b[1])/2, (a[2]+b[2])/2);
        }
        if (opts.nea || opts.per) {
          const dx = b[0]-a[0], dy = b[1]-a[1], dz = b[2]-a[2];
          const len2 = dx*dx + dy*dy + dz*dz;
          if (len2 < 1e-12) continue;
          const t = Math.max(0, Math.min(1, ((px-a[0])*dx + (py-a[1])*dy + (pz-a[2])*dz) / len2));
          const sx = a[0] + t*dx, sy = a[1] + t*dy, sz = a[2] + t*dz;
          if (opts.nea) consider("nea", sx, sy, sz);
          if (opts.per) consider("per", sx, sy, sz);
        }
      }
    }
    // CENTRO de circulos y arcos: con el cursor sobre la circunferencia (o
    // sobre el propio centro), como en AutoCAD. El candidato queda a tol/2
    // para que un extremo o un nudo mas cercano al cursor le ganen.
    if (opts.cen) {
      for (const k of circulos) {
        const vivo = pts.some((p) => Math.abs(Math.hypot(p[0]-k.c[0], p[1]-k.c[1], p[2]-k.c[2]) - k.r) < 1e-6);
        if (!vivo) continue;
        const d = Math.hypot(px-k.c[0], py-k.c[1], pz-k.c[2]);
        if (d < tol || Math.abs(d - k.r) < tol) {
          const dd = Math.min(d, tol * 0.5);
          if (!best || dd < (best as any).d) best = { type: "cen", x: k.c[0], y: k.c[1], z: k.c[2], d: dd };
        }
      }
    }
    // INTERSECCIÓN: cruce de dos tramos. Solo se miran los tramos que pasan
    // cerca del cursor (a menos de 3·tol), así no es O(n²) sobre el modelo.
    if (opts.int) {
      const cerca: [number, number, number][][] = [];
      for (const poly of polys) {
        for (let i = 0; i < poly.length - 1; i++) {
          const a = pts[poly[i]], b = pts[poly[i + 1]];
          if (!a || !b) continue;
          const dx = b[0]-a[0], dy = b[1]-a[1], dz = b[2]-a[2];
          const len2 = dx*dx + dy*dy + dz*dz;
          if (len2 < 1e-12) continue;
          const t = Math.max(0, Math.min(1, ((px-a[0])*dx + (py-a[1])*dy + (pz-a[2])*dz) / len2));
          if (Math.hypot(a[0]+t*dx-px, a[1]+t*dy-py, a[2]+t*dz-pz) < 3*tol) cerca.push([a, b]);
        }
      }
      for (let i = 0; i < cerca.length; i++) for (let j = i + 1; j < cerca.length; j++) {
        const [p1, p2] = cerca[i], [p3, p4] = cerca[j];
        // puntos más próximos de las dos rectas (Gauss sobre s,t); si casi
        // coinciden y caen dentro de los dos tramos, es un cruce
        const u = [p2[0]-p1[0], p2[1]-p1[1], p2[2]-p1[2]], v = [p4[0]-p3[0], p4[1]-p3[1], p4[2]-p3[2]];
        const w = [p1[0]-p3[0], p1[1]-p3[1], p1[2]-p3[2]];
        const A = u[0]*u[0]+u[1]*u[1]+u[2]*u[2], B = u[0]*v[0]+u[1]*v[1]+u[2]*v[2], C = v[0]*v[0]+v[1]*v[1]+v[2]*v[2];
        const D = u[0]*w[0]+u[1]*w[1]+u[2]*w[2], E = v[0]*w[0]+v[1]*w[1]+v[2]*w[2];
        const den = A*C - B*B;
        if (den < 1e-12) continue;                 // paralelos
        const s = (B*E - C*D) / den, t = (A*E - B*D) / den;
        if (s < -1e-6 || s > 1+1e-6 || t < -1e-6 || t > 1+1e-6) continue;
        const q1 = [p1[0]+s*u[0], p1[1]+s*u[1], p1[2]+s*u[2]];
        const q2 = [p3[0]+t*v[0], p3[1]+t*v[1], p3[2]+t*v[2]];
        if (Math.hypot(q1[0]-q2[0], q1[1]-q2[1], q1[2]-q2[2]) > 1e-4) continue;   // se cruzan sin tocarse
        // los extremos compartidos ya los da END; aquí interesan los cruces
        const esExtremo = [p1, p2, p3, p4].some((e) => Math.hypot(e[0]-q1[0], e[1]-q1[1], e[2]-q1[2]) < 1e-6);
        if (!esExtremo) consider("int", q1[0], q1[1], q1[2]);
      }
    }
    // Líneas auxiliares: endpoint, midpoint, nearest, perpendicular
    const auxState = (window as any).__hekatanDrawingAuxLines;
    const auxLines: number[][] = auxState?.rawVal ?? auxState?.val ?? auxState ?? [];
    for (const ln of auxLines) {
      if (ln.length !== 6) continue;
      const a: [number, number, number] = [ln[0], ln[1], ln[2]];
      const b: [number, number, number] = [ln[3], ln[4], ln[5]];
      if (opts.end) {
        consider("end", a[0], a[1], a[2]);
        consider("end", b[0], b[1], b[2]);
      }
      if (opts.mid) consider("mid", (a[0]+b[0])/2, (a[1]+b[1])/2, (a[2]+b[2])/2);
      if (opts.nea || opts.per) {
        const dx = b[0]-a[0], dy = b[1]-a[1], dz = b[2]-a[2];
        const len2 = dx*dx + dy*dy + dz*dz;
        if (len2 < 1e-12) continue;
        const t = Math.max(0, Math.min(1, ((px-a[0])*dx + (py-a[1])*dy + (pz-a[2])*dz) / len2));
        const sx = a[0] + t*dx, sy = a[1] + t*dy, sz = a[2] + t*dz;
        if (opts.nea) consider("nea", sx, sy, sz);
        if (opts.per) consider("per", sx, sy, sz);
      }
    }
    return best ? { type: best.type, x: best.x, y: best.y, z: best.z } : null;
  };
  (window as any).__hekatanOsnapCompute = computeOsnap;
  (window as any).__hekatanOsnapShow = showOsnap;
  (window as any).__hekatanOsnapHide = hideOsnap;

  // ── Buffer de clicks pendientes para tools multi-click ──
  // Círculo: 2 clicks (centro + radio) → __hekatanDrawCircle
  // Arco: 3 clicks (start + mid + end) → __hekatanDrawArc
  // Rectángulo: 2 clicks (esquina A + B) → __hekatanDrawRect
  let pendingClicks: [number, number, number][] = [];
  // Altura tipeada para tools "col" (columna) y "wall" (pared Q4).
  // Se setea cuando el usuario tipea un número + Enter ANTES de hacer el
  // click final. Default = 3m si no se tipea nada.
  let pendingHeight = 0;
  // DESFASE: distancia tecleada (se conserva entre desfases, como en AutoCAD)
  let pendingDist = 0;
  // RECORTAR / ALARGAR / DESFASE: la linea o contorno designado en el 1er clic
  let designado: { poly: number; seg: number } | null = null;
  // ── Crear status bar HTML siempre visible debajo del viewer ──
  // Muestra: tool activa + paso actual + última acción.
  const statusBar = document.createElement("div");
  statusBar.id = "hk-cad-status";
  statusBar.style.cssText = [
    "position:fixed",
    "bottom:8px",
    "left:50%",
    "transform:translateX(-50%)",
    "padding:6px 14px",
    "background:rgba(15, 23, 42, 0.92)",
    "color:#22d3ee",
    "border:1px solid rgba(34, 211, 238, 0.5)",
    "border-radius:6px",
    "font-family:Consolas, monospace",
    "font-size:12px",
    "z-index:90",
    "pointer-events:none",
    "box-shadow:0 0 8px rgba(34, 211, 238, 0.25)",
    "max-width:90vw",
    "white-space:nowrap",
    "overflow:hidden",
    "text-overflow:ellipsis",
  ].join(";") + ";";
  // Mensaje default — incluye la "leyenda" de sintaxis tipo AutoCAD para que
  // el usuario sepa qué puede tipear apenas active un tool de dibujo.
  statusBar.textContent =
    "🛠 CAD listo — seleccioná un tool. " +
    "Inputs: 5 (DDE) · 5,3,2 (abs) · @5,3,2 (rel) · @5<45 (polar) · @5<45<30 (esférico) + Enter";
  document.body.appendChild(statusBar);

  // Helper de status — el usuario VE en pantalla qué paso del tool va.
  // El sufijo automático muestra modos activos: ⊥ ORTO ON, Cota Z, axisLock.
  const buildStatusSuffix = (): string => {
    const parts: string[] = [];
    if ((window as any).__hekatanOrthoMode) parts.push("⊥ ORTO ON (F8)");
    if (axisLock) parts.push(`🔒 LOCK ${axisLock.toUpperCase()}`);
    const st = (window as any).__hekatanCadState?.get?.();
    const wz = st?.workZ ?? 0;
    if (Math.abs(wz) > 0.001) parts.push(`Cota Z=${wz}m`);
    if ((window as any).__hekatanShowOrthoPlanes !== false) parts.push("▦ Planos XY/XZ/YZ");
    return parts.length > 0 ? `   |   ${parts.join("  ·  ")}` : "";
  };
  const updateStatus = (txt: string) => {
    const fullText = txt + buildStatusSuffix();
    statusBar.textContent = fullText;
    (window as any).__hekatanCadStatusText = fullText;
    // La ventana de comandos (main.ts) lleva un HISTORIAL como la de AutoCAD:
    // cada mensaje de estado se escribe ahí también, así lo que pasó no se
    // pierde al mensaje siguiente. La barra de abajo solo enseña el último.
    try { (window as any).__hekatanCadEcho?.(txt); } catch {}
  };

  // ── EL PROMPT: qué se espera AHORA, en el léxico de AutoCAD ──────────────
  // «Precise primer punto:», «Precise punto siguiente o [Cerrar/desHacer]:».
  // Se deduce del estado (herramienta, clics pendientes, polilínea en curso)
  // y no de cada rama del manejador de clic: así ninguna rama se lo salta.
  // La ventana de comandos lo pinta en su línea de prompt y el Dynamic Input
  // pegado al cursor lo repite en corto.
  const PROMPT_IDLE = "Comando:";
  const promptFor = (): { txt: string; ops: string[] } => {
    const tool = (window as any).__hekatanCadState?.get?.()?.tool ?? "select";
    const polys = drawingObj.polylines?.rawVal ?? [];
    const last = polys.length ? polys[polys.length - 1] : [];
    const n = pendingClicks.length;
    const P = (txt: string, ops: string[] = []) => ({ txt, ops });
    switch (tool) {
      case "line":
        return last.length >= 2 ? P("LÍNEA Precise punto siguiente o", ["Cerrar", "desHacer"])
             : last.length === 1 ? P("LÍNEA Precise punto siguiente o", ["desHacer"])
             : P("LÍNEA Precise primer punto:");
      case "polyline":
        return last.length >= 2 ? P("POLILÍNEA Precise punto siguiente o", ["Cerrar", "desHacer"])
             : last.length === 1 ? P("POLILÍNEA Precise punto siguiente o", ["desHacer"])
             : P("POLILÍNEA Precise punto inicial:");
      case "node": return P("NUDO Precise punto:");
      case "area": return P(`LOSA Precise vértice ${Math.min(last.length + 1, 4)} de 4 (en orden, antihorario):`);
      case "rectarea": return n ? P("LOSA RECTANGULAR Precise otra esquina:") : P("LOSA RECTANGULAR Precise primera esquina:");
      case "polyarea": return P(`ÁREA LIBRE Precise vértice ${polyAreaPts.length + 1} (Enter o clic derecho cierra y malla):`);
      case "rect": return n ? P("RECTÁNGULO Precise otra esquina:") : P("RECTÁNGULO Precise primera esquina:");
      case "circle": return n ? P("CÍRCULO Precise radio (clic o teclee la cifra):") : P("CÍRCULO Precise centro:");
      case "arc": return n === 0 ? P("ARCO Precise punto inicial:") : n === 1 ? P("ARCO Precise segundo punto:") : P("ARCO Precise punto final:");
      case "col": return P(`COLUMNA Precise punto de inserción (altura ${pendingHeight > 0 ? pendingHeight : 3} m; teclee otra + Enter antes del clic):`);
      case "wall": return n ? P("MURO Precise segundo punto de la base:")
                            : P(`MURO Precise primer punto de la base (altura ${pendingHeight > 0 ? pendingHeight : 3} m; teclee otra + Enter):`);
      case "plane3": return P(`PLANO Precise punto ${n + 1} de 3:`);
      case "extp": return P("EXTRUIR Precise el nudo a levantar (altura: teclee la cifra + Enter):");
      case "extl": return P("EXTRUIR Precise la línea a levantar:");
      case "extend": return !designado ? P("ALARGAR Designe el contorno hasta el que alargar:")
                                       : P("ALARGAR Designe la línea a alargar, cerca del extremo libre:");
      case "trim": return !designado ? P("RECORTAR Designe el contorno de corte:")
                                     : P("RECORTAR Designe el trozo de línea a quitar:");
      case "offset": return !designado
        ? P(`DESFASE Designe la línea a desfasar${pendingDist > 0 ? ` (distancia ${pendingDist} m)` : " (teclee la distancia; sin ella, la copia pasa por el punto del lado)"}:`)
        : P("DESFASE Precise el lado hacia el que va la copia:");
      case "axis": return P("EJE Precise el primer punto del eje:");
      case "aux": return n ? P("AUXILIAR Precise el segundo punto:") : P("AUXILIAR Precise el primer punto:");
      case "auxp": return P("PUNTO AUXILIAR Precise punto:");
      case "chaflan": return n ? P("LOSA CHAFLANES Precise otra esquina:") : P("LOSA CHAFLANES Precise primera esquina:");
      case "delete": return P("BORRAR Designe objetos (pase por encima y haga clic):");
      case "move": return !selection.size ? P("MOVER Designe objetos (S o ventana) y vuelva a M:")
                    : n ? P("MOVER Precise segundo punto (o teclee @dx,dy,dz):") : P("MOVER Precise punto base:");
      case "copy": return !selection.size ? P("COPIAR Designe objetos (S o ventana) y vuelva a CO:")
                    : n ? P("COPIAR Precise segundo punto (o teclee @dx,dy,dz):") : P("COPIAR Precise punto base:");
      case "select": return selection.size
        ? P(`SELECCIÓN ${selection.size} objeto${selection.size === 1 ? "" : "s"} · Supr borra · M mueve · CO copia · Esc suelta:`)
        : P("Designe objetos (clic-clic: ventana izq→der, captura der→izq) o teclee un comando:");
      default: return P(PROMPT_IDLE);
    }
  };
  const refreshPrompt = () => {
    try {
      const p = promptFor();
      (window as any).__hekatanCadPrompt?.(p.txt, p.ops);
    } catch {}
  };
  (window as any).__hekatanCadRefreshPrompt = refreshPrompt;
  // Refresh expuesto al window — para que main.ts y otros listeners
  // (F8, toggle planos, slider Cota Z, cambio de tool) puedan refrescar
  // el status sin saber el texto del tool actual.
  (window as any).__hekatanRefreshStatus = () => {
    const cur = (window as any).__hekatanCadStatusText ?? "";
    // Quitar sufijo previo (split por "   |   " que es nuestro separador)
    const baseTxt = cur.split("   |   ")[0] ?? cur;
    updateStatus(baseTxt);
  };
  // Reset pendingClicks cuando el usuario cambia de tool
  (window as any).__hekatanCadResetPending = () => {
    pendingClicks = [];
    polyAreaPts = [];
    polyAreaPreview.visible = false;
    cerrarPolilinea();
    designado = null;
    viewerRender();
    updateStatus("🛠 Tool cambiado — clicks pendientes limpiados");
    refreshPrompt();
  };

  /**
   * Cierra la polilínea en curso y tira las que no llegan a ser nada.
   *
   * Una polilínea de 0 ó 1 punto NO es ningún frame: es el hueco que queda al
   * cambiar de herramienta a medio dibujar. Se acumulaban en la lista
   * ([0,2,2,1,2,...]) y ensuciaban el modelo y cualquier recuento. Y hace
   * falta dejar SIEMPRE una vacía al final, porque el clic escribe sobre la
   * última de la lista.
   */
  function cerrarPolilinea(): void {
    if (!drawingObj.polylines) return;
    const buenas = drawingObj.polylines.rawVal.filter((p) => p.length >= 2);
    drawingObj.polylines.val = [...buenas, []];
  }
  (window as any).__hekatanCerrarPolilinea = cerrarPolilinea;

  // ── UNDO STACK (Ctrl+Z) ──
  // Snapshot del estado de drawing ANTES de cada modificación. Ctrl+Z hace
  // pop y restaura. Limit 100 estados para no consumir mucha RAM.
  const undoStack: { p: any; l: any; a: any }[] = [];
  // Rehacer (Ctrl+Y / Ctrl+Shift+Z): lo que se deshizo se guarda aquí y se
  // vacía en cuanto se dibuja algo nuevo, como en cualquier editor.
  const redoStack: { p: any; l: any; a: any }[] = [];
  const snapshot = () => ({
    p: JSON.parse(JSON.stringify(drawingObj.points.rawVal ?? [])),
    l: JSON.parse(JSON.stringify(drawingObj.polylines?.rawVal ?? [])),
    a: JSON.parse(JSON.stringify(drawingObj.areas?.rawVal ?? [])),
  });
  const restore = (s: { p: any; l: any; a: any }) => {
    drawingObj.points.val = s.p;
    if (drawingObj.polylines) drawingObj.polylines.val = s.l;
    if (drawingObj.areas) drawingObj.areas.val = s.a;
    pendingClicks = [];
    rubberBand.visible = false;
    polarLines.visible = false;
    hideRubberLabel();
    try { (window as any).__hekatanRebuild?.(); } catch {}
    viewerRender();
    refreshPrompt();
  };
  const pushUndo = () => {
    undoStack.push(snapshot());
    if (undoStack.length > 100) undoStack.shift();
    redoStack.length = 0;
  };
  const undo = () => {
    const prev = undoStack.pop();
    if (!prev) {
      updateStatus("↶ Nada para deshacer");
      return;
    }
    redoStack.push(snapshot());
    restore(prev);
    updateStatus(`↶ Deshacer — quedan ${undoStack.length}`);
  };
  const redo = () => {
    const next = redoStack.pop();
    if (!next) {
      updateStatus("↷ Nada para rehacer");
      return;
    }
    undoStack.push(snapshot());
    restore(next);
    updateStatus(`↷ Rehacer — quedan ${redoStack.length}`);
  };
  (window as any).__hekatanPushUndo = pushUndo;
  (window as any).__hekatanUndo = undo;
  (window as any).__hekatanRedo = redo;
  document.addEventListener("keydown", (ev: KeyboardEvent) => {
    const k = ev.key.toLowerCase();
    const esRedo = (ev.ctrlKey || ev.metaKey) && (k === "y" || (k === "z" && ev.shiftKey));
    if (!esRedo) return;
    const tgt = ev.target as HTMLInputElement | null;
    const enTexto = tgt && (tgt.tagName === "INPUT" || tgt.tagName === "TEXTAREA")
      && tgt.type !== "checkbox" && tgt.type !== "range" && (tgt.value?.length ?? 0) > 0;
    if (enTexto) return;
    ev.preventDefault(); ev.stopPropagation();
    redo();
  }, { capture: true });

  // ── Las OPCIONES del prompt, como en AutoCAD: [Cerrar/desHacer] ──────────
  // Se teclean en la caja de comandos mientras hay una línea en curso.
  //   C / cerrar   → une el último punto con el primero y termina.
  //   U / deshacer → quita SOLO el último punto (no todo el trazo).
  (window as any).__hekatanCadOption = (op: string): boolean => {
    const o = op.trim().toLowerCase();
    const tool = (window as any).__hekatanCadState?.get?.()?.tool;
    if (!drawingObj.polylines) return false;
    const polys = drawingObj.polylines.rawVal;
    const last = polys.length ? polys[polys.length - 1] : [];
    if (tool !== "line" && tool !== "polyline") {
      if (o === "u" || o === "deshacer" || o === "undo") { undo(); return true; }
      return false;
    }
    if (o === "c" || o === "cerrar" || o === "close") {
      if (last.length < 3) { updateStatus("Cerrar necesita al menos tres puntos."); return true; }
      pushUndo();
      drawingObj.polylines.val = [...polys.slice(0, -1), [...last, last[0]], []];
      try { (window as any).__hekatanRebuild?.(); } catch {}
      finalizeDraw();
      updateStatus(`✓ Polilínea cerrada — ${last.length} tramos.`);
      return true;
    }
    if (o === "u" || o === "deshacer" || o === "undo") {
      if (!last.length) { undo(); return true; }
      pushUndo();
      const quitado = last[last.length - 1];
      const rest = last.slice(0, -1);
      // el punto sale también de la lista de puntos si nadie más lo usa
      const usado = polys.some((pl, i) => i !== polys.length - 1 && pl.includes(quitado)) || rest.includes(quitado);
      let pts = drawingObj.points.rawVal;
      let nuevas = [...polys.slice(0, -1), rest];
      if (!usado && quitado === pts.length - 1) {
        pts = pts.slice(0, -1);
        drawingObj.points.val = pts;
      }
      drawingObj.polylines.val = nuevas;
      if (rest.length) {
        const p = pts[rest[rest.length - 1]];
        if (p) rubberStart = [p[0], p[1], p[2]];
      } else { rubberStart = null; rubberBand.visible = false; }
      try { (window as any).__hekatanRebuild?.(); } catch {}
      viewerRender();
      updateStatus(`↶ Último punto quitado — quedan ${rest.length}.`);
      refreshPrompt();
      return true;
    }
    return false;
  };
  // Ctrl+Z / Cmd+Z global — usar CAPTURE phase para interceptar ANTES que
  // los inputs de Tweakpane (sino el input hace su undo de texto y se come
  // el evento, nunca llegando al window listener).
  // Excepción: si el target es un input de TEXTO con value modificado,
  // dejamos que el browser haga su undo nativo del texto. Solo capturamos
  // cuando el focus está en el body, canvas, o un input vacío.
  document.addEventListener("keydown", (ev: KeyboardEvent) => {
    if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === "z" && !ev.shiftKey) {
      const tgt = ev.target as HTMLElement;
      const tag = tgt?.tagName;
      // Si el focus está en un input de texto NO vacío, dejar que el browser
      // haga su undo nativo (esperado por el usuario). En cualquier otro
      // caso, hacer undo del modelo CAD.
      const isTextInput = (tag === "INPUT" || tag === "TEXTAREA")
        && (tgt as HTMLInputElement).type !== "checkbox"
        && (tgt as HTMLInputElement).type !== "range"
        && (tgt as HTMLInputElement).value?.length > 0;
      if (isTextInput) return;  // browser native undo
      ev.preventDefault();
      ev.stopPropagation();
      undo();
    }
  }, { capture: true });

  // ── FINALIZAR DIBUJO (Esc / botón Tweakpane / click derecho del usuario) ──
  // Termina la polilínea actual (push empty), libera axis lock, oculta
  // rubber band y polar lines. Equivalente a "ya terminé este trazo, pasá al
  // siguiente click como inicio de algo nuevo".
  const finalizeDraw = () => {
    pendingClicks = [];
    designado = null;
    // Cierra la polilínea en curso Y descarta las que se quedaron en 0 ó 1
    // punto: eso no es ningún frame, es el hueco de haber cambiado de
    // herramienta a medio dibujar. Antes solo se añadía una vacía al final y
    // las huérfanas se iban acumulando en la lista.
    cerrarPolilinea();
    // Liberar axis lock
    axisLock = null;
    updateAxisLockBadge();
    // Ocultar rubber band y polar lines
    rubberBand.visible = false;
    polarLines.visible = false;
    hideRubberLabel();
    updateStatus("⏹ Dibujo finalizado — click para empezar otra serie");
    viewerRender();
    refreshPrompt();
  };
  (window as any).__hekatanFinalizeDraw = finalizeDraw;

  // ⎋ ESC universal: cancela la acción en curso Y deselecciona. Antes ESC solo
  // finalizaba el dibujo (no limpiaba la selección) y encima el command bar se
  // lo comía → "ESC no servía". Esto limpia clicks pendientes, polígono libre,
  // selección + panel de propiedades, y finaliza el dibujo.
  const escapeCancel = () => {
    pendingClicks = [];
    polyAreaPts = [];
    polyAreaPreview.visible = false;
    let hadSel = false;
    if (selection.size) { selection.clear(); refreshSelectionGroup(); hadSel = true; }
    finalizeDraw();
    // ── Esc SUELTA la herramienta, como en AutoCAD ───────────────────────────
    //
    // La herramienta se quedaba pegada: se dibujaba una linea, se pulsaba Esc
    // para terminarla, y el tool seguia siendo "line". Como la ventana de
    // seleccion solo arranca con el tool en "select", arrastrar despues de
    // dibujar no seleccionaba NI PINTABA EL RECTANGULO — parecia que la
    // seleccion por ventana no existiera.
    //
    // En AutoCAD, Esc termina el comando y te deja sin comando: a partir de
    // ahi, arrastrar sobre el vacio abre la ventana de seleccion. Para dibujar
    // otra linea se vuelve a pulsar L, que es un tecleo.
    try {
      const st = (window as any).__hekatanCadState;
      const t = st?.get?.()?.tool;
      if (t && t !== "select") st?.setTool?.("select");
    } catch {}
    updateStatus(hadSel ? "⎋ Selección cancelada" : "⎋ Sin herramienta — clic-clic para seleccionar por ventana");
    viewerRender();
    refreshPrompt();
  };
  (window as any).__hekatanEscapeCancel = escapeCancel;

  // ── MOVER y COPIAR la selección con dos puntos (base → destino) ──────────
  // Es el MOVE/COPY de AutoCAD: se designan los objetos, punto base, segundo
  // punto. Se traslada cada NUDO de la selección (los tramos y áreas que los
  // usan van con ellos, como al mover un nudo en ETABS). COPIAR reusa
  // __hekatanReplicateSelection con una sola copia. Devuelve cuántos nudos.
  const nudosDeSeleccion = (): Set<number> => {
    const polys = drawingObj.polylines?.rawVal ?? [];
    const nodeSet = new Set<number>();
    selection.forEach((id) => {
      if (id.startsWith("pt:")) nodeSet.add(+id.slice(3));
      else if (id.startsWith("poly:")) (polys[+id.slice(5)] || []).forEach((n) => nodeSet.add(n));
      else if (id.startsWith("seg:")) {
        const parts = id.split(":"); const poly = polys[+parts[1]] || [];
        const a = poly[+parts[2]], b = poly[+parts[2] + 1];
        if (a != null) nodeSet.add(a); if (b != null) nodeSet.add(b);
      }
    });
    return nodeSet;
  };
  const moveSelection = (dx: number, dy: number, dz: number): number => {
    const nodeSet = nudosDeSeleccion();
    if (!nodeSet.size) return 0;
    pushUndo();
    const pts = drawingObj.points.rawVal.map((p, i) =>
      nodeSet.has(i) ? [p[0] + dx, p[1] + dy, p[2] + dz] : p) as [number, number, number][];
    drawingObj.points.val = pts;
    try { (window as any).__hekatanRebuild?.(); } catch {}
    refreshSelectionGroup();
    viewerRender();
    return nodeSet.size;
  };
  (window as any).__hekatanMoveSelection = moveSelection;
  // Un paso de MOVER/COPIAR con un punto (clic o coordenada tecleada).
  const pasoMoverCopiar = (tool: string, pt: [number, number, number]): void => {
    if (!selection.size) {
      updateStatus(`${tool === "move" ? "MOVER" : "COPIAR"}: primero designe objetos (S, o ventana), luego vuelva al comando.`);
      (window as any).__hekatanCadState?.setTool?.("select");
      refreshPrompt();
      return;
    }
    pendingClicks.push(pt);
    if (pendingClicks.length === 1) {
      rubberStart = pt;
      updateStatus(`${tool === "move" ? "MOVER" : "COPIAR"} punto base (${pt[0].toFixed(2)}, ${pt[1].toFixed(2)}, ${pt[2].toFixed(2)}). Precise el segundo punto.`);
      refreshPrompt();
      return;
    }
    const [a, b] = pendingClicks;
    const d: [number, number, number] = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    pendingClicks = [];
    rubberBand.visible = false;
    let n = 0;
    if (tool === "move") n = moveSelection(d[0], d[1], d[2]);
    else n = nudosDeSeleccion().size, (window as any).__hekatanReplicateSelection?.(d[0], d[1], d[2], 1);
    updateStatus(`✓ ${tool === "move" ? "Movidos" : "Copiados"} ${n} nudo${n === 1 ? "" : "s"} — Δ (${d[0].toFixed(2)}, ${d[1].toFixed(2)}, ${d[2].toFixed(2)}) m.`);
    if (tool === "move") { selection.clear(); refreshSelectionGroup(); }
    (window as any).__hekatanCadState?.setTool?.("select");
    refreshPrompt();
  };
  (window as any).__hekatanPasoMoverCopiar = pasoMoverCopiar;

  // ── DESFASE · RECORTAR · ALARGAR — el OFFSET / TRIM / EXTEND de AutoCAD ────
  // Los tres empiezan DESIGNANDO una linea (pasa a rojo bajo el cursor, clic):
  //   DESFASE : la linea a copiar en paralelo; luego un clic en el lado. La
  //             distancia se teclea antes (una cifra + Enter) o, si no hay,
  //             la copia pasa POR el punto del lado ("a traves de").
  //   RECORTAR: el contorno de corte; luego clic en el trozo que sobra. El
  //             tramo se parte en el cruce y se quita el lado clicado.
  //   ALARGAR : el contorno; luego clic en la linea a alargar, cerca de su
  //             extremo libre, que se lleva hasta el cruce con el contorno.
  type P3 = [number, number, number];
  const normalPlano = (): P3 => {
    const wp = (window as any).__hekatanCadState?.get?.()?.workPlane ?? "xy";
    return wp === "xz" ? [0, 1, 0] : wp === "yz" ? [1, 0, 0] : [0, 0, 1];
  };
  const d3 = (a: P3, b: P3) => Math.hypot(a[0]-b[0], a[1]-b[1], a[2]-b[2]);
  // Puntos mas proximos de dos rectas (p1->p2, p3->p4). Devuelve el cruce si
  // casi se tocan; `libreA`/`libreB` permiten salirse del tramo (prolongarlo).
  const cruceRectas = (p1: P3, p2: P3, p3: P3, p4: P3, libreA: boolean, libreB: boolean): P3 | null => {
    const u = [p2[0]-p1[0], p2[1]-p1[1], p2[2]-p1[2]], v = [p4[0]-p3[0], p4[1]-p3[1], p4[2]-p3[2]];
    const w = [p1[0]-p3[0], p1[1]-p3[1], p1[2]-p3[2]];
    const A = u[0]*u[0]+u[1]*u[1]+u[2]*u[2], B = u[0]*v[0]+u[1]*v[1]+u[2]*v[2], C = v[0]*v[0]+v[1]*v[1]+v[2]*v[2];
    const D = u[0]*w[0]+u[1]*w[1]+u[2]*w[2], E = v[0]*w[0]+v[1]*w[1]+v[2]*w[2];
    const den = A*C - B*B;
    if (den < 1e-12) return null;
    const sA = (B*E - C*D) / den, tB = (A*E - B*D) / den;
    if (!libreA && (sA < -1e-6 || sA > 1 + 1e-6)) return null;
    if (!libreB && (tB < -1e-6 || tB > 1 + 1e-6)) return null;
    const q1: P3 = [p1[0]+sA*u[0], p1[1]+sA*u[1], p1[2]+sA*u[2]];
    const q2: P3 = [p3[0]+tB*v[0], p3[1]+tB*v[1], p3[2]+tB*v[2]];
    if (d3(q1, q2) > 1e-4) return null;
    return q1;
  };
  const usosDePunto = (idx: number) =>
    (drawingObj.polylines?.rawVal ?? []).reduce((n, pl) => n + pl.filter((k) => k === idx).length, 0);
  const NOMBRE_MOD: Record<string, string> = { offset: "DESFASE", trim: "RECORTAR", extend: "ALARGAR" };
  const pasoModificar = (tool: string, click: P3): void => {
    if (!drawingObj.polylines) return;
    const polys = drawingObj.polylines.rawVal;
    const pts = drawingObj.points.rawVal as P3[];
    const nombre = NOMBRE_MOD[tool];
    if (!designado) {
      if (hoveredPolyIndex < 0) { updateStatus(`${nombre}: pase el cursor por una línea (se pone roja) y haga clic.`); return; }
      designado = { poly: hoveredPolyIndex, seg: Math.max(0, hoveredSegIndex) };
      updateStatus(tool === "offset"
        ? `DESFASE línea #${designado.poly + 1} designada — clic en el lado hacia el que va la copia${pendingDist > 0 ? ` (${pendingDist} m)` : ""}.`
        : tool === "trim" ? "RECORTAR contorno designado — clic en el trozo de línea a quitar."
        : "ALARGAR contorno designado — clic en la línea a alargar, cerca del extremo libre.");
      refreshPrompt();
      return;
    }
    if (tool === "offset") {
      const P = designado.poly; const poly = polys[P];
      if (!poly || poly.length < 2) { designado = null; updateStatus("DESFASE: esa polilínea no tiene tramos."); refreshPrompt(); return; }
      const cerrada = poly.length > 2 && poly[0] === poly[poly.length - 1];
      const nrm = normalPlano();
      const segs = [] as { a: P3; b: P3; n: P3 }[];
      for (let i = 0; i < poly.length - 1; i++) {
        const a = pts[poly[i]], b = pts[poly[i + 1]];
        const u = [b[0]-a[0], b[1]-a[1], b[2]-a[2]]; const L = Math.hypot(u[0], u[1], u[2]) || 1;
        const ux = u[0]/L, uy = u[1]/L, uz = u[2]/L;
        // normal en el plano de trabajo: n = nrm x u
        const nn: P3 = [nrm[1]*uz - nrm[2]*uy, nrm[2]*ux - nrm[0]*uz, nrm[0]*uy - nrm[1]*ux];
        const Ln = Math.hypot(nn[0], nn[1], nn[2]) || 1;
        segs.push({ a, b, n: [nn[0]/Ln, nn[1]/Ln, nn[2]/Ln] });
      }
      // el tramo mas cercano al clic decide el LADO (y la distancia si no se tecleo)
      let iNear = 0, dNear = Infinity;
      segs.forEach((sg, i) => {
        const d = distPointSeg(click[0], click[1], click[2], sg.a[0], sg.a[1], sg.a[2], sg.b[0], sg.b[1], sg.b[2]);
        if (d < dNear) { dNear = d; iNear = i; }
      });
      const sn = segs[iNear];
      const lado = Math.sign((click[0]-sn.a[0])*sn.n[0] + (click[1]-sn.a[1])*sn.n[1] + (click[2]-sn.a[2])*sn.n[2]) || 1;
      const dist = pendingDist > 0 ? pendingDist : dNear;
      if (dist < 1e-6) { updateStatus("DESFASE: distancia nula — teclee una distancia o clique más lejos."); return; }
      const off = segs.map((sg) => ({
        a: [sg.a[0] + lado*dist*sg.n[0], sg.a[1] + lado*dist*sg.n[1], sg.a[2] + lado*dist*sg.n[2]] as P3,
        b: [sg.b[0] + lado*dist*sg.n[0], sg.b[1] + lado*dist*sg.n[1], sg.b[2] + lado*dist*sg.n[2]] as P3,
      }));
      const m = off.length;
      const vertice = (j: number): P3 => {
        // j = vertice entre el tramo j-1 y el j (esquina a inglete)
        const prev = off[(j - 1 + m) % m], next = off[j % m];
        const q = cruceRectas(prev.a, prev.b, next.a, next.b, true, true);
        return q ?? next.a;
      };
      const nuevos: P3[] = [];
      const nV = cerrada ? m : m + 1;
      for (let j = 0; j < nV; j++) {
        if (!cerrada && j === 0) nuevos.push(off[0].a);
        else if (!cerrada && j === m) nuevos.push(off[m - 1].b);
        else nuevos.push(vertice(j));
      }
      pushUndo();
      const base = pts.length;
      drawingObj.points.val = [...pts, ...nuevos];
      const idx = nuevos.map((_, i) => base + i);
      if (cerrada) idx.push(base);
      let lista = polys.slice();
      if (lista.length && lista[lista.length - 1].length === 0) lista = lista.slice(0, -1);
      drawingObj.polylines.val = [...lista, idx, []];
      designado = null;
      updateStatus(`✓ Desfase a ${dist.toFixed(2)} m — ${m} tramo${m === 1 ? "" : "s"} nuevo${m === 1 ? "" : "s"}. Designe otra línea o Esc.`);
      try { (window as any).__hekatanRebuild?.(); } catch {}
      viewerRender();
      refreshPrompt();
      return;
    }
    // RECORTAR / ALARGAR: hace falta OTRA linea bajo el cursor. Cerca del
    // cruce el OSNAP imanta el cursor al punto de interseccion, donde las dos
    // lineas estan a distancia cero y el hover puede quedarse con el propio
    // contorno: entonces se busca la otra linea mas cercana al clic.
    let P = hoveredPolyIndex, S = Math.max(0, hoveredSegIndex);
    if (P < 0 || (P === designado.poly && S === designado.seg)) {
      const tolB = ((window as any).__hekatanSnap2D ?? 0.5) * 1.5;
      let mejor = tolB;
      P = -1;
      polys.forEach((pl, i) => {
        for (let j = 0; j < pl.length - 1; j++) {
          if (i === designado!.poly && j === designado!.seg) continue;
          const a0 = pts[pl[j]], b0 = pts[pl[j + 1]];
          if (!a0 || !b0) continue;
          const d = distPointSeg(click[0], click[1], click[2], a0[0], a0[1], a0[2], b0[0], b0[1], b0[2]);
          if (d < mejor) { mejor = d; P = i; S = j; }
        }
      });
      if (P < 0) { updateStatus(`${nombre}: pase el cursor por OTRA línea y haga clic.`); return; }
    }
    const pc = polys[designado.poly];
    const c1 = pts[pc[designado.seg]], c2 = pts[pc[designado.seg + 1]];
    const poly = polys[P]; const ia = poly[S], ib = poly[S + 1];
    if (!c1 || !c2 || ia == null || ib == null) { updateStatus(`${nombre}: no se pudo leer el tramo.`); return; }
    const a = pts[ia], b = pts[ib];
    if (tool === "trim") {
      const q = cruceRectas(a, b, c1, c2, false, false);
      if (!q) { updateStatus("RECORTAR: esa línea no cruza el contorno designado."); return; }
      pushUndo();
      const iq = pts.length;
      drawingObj.points.val = [...pts, q];
      const partido = [...poly.slice(0, S + 1), iq, ...poly.slice(S + 1)];
      drawingObj.polylines.val = polys.map((pl, i) => (i === P ? partido : pl));
      const ladoA = d3(click, a) < d3(click, b);
      deleteSeg(P, ladoA ? S : S + 1);
      updateStatus(`✓ Recortado en (${q[0].toFixed(2)}, ${q[1].toFixed(2)}, ${q[2].toFixed(2)}). Designe otro trozo o Esc.`);
    } else {
      const q = cruceRectas(a, b, c1, c2, true, false);
      if (!q) { updateStatus("ALARGAR: ni prolongada llega esa línea al contorno."); return; }
      const cercaA = d3(click, a) < d3(click, b);
      const pos = cercaA ? S : S + 1;
      if (pos !== 0 && pos !== poly.length - 1) { updateStatus("ALARGAR: solo se alarga un extremo libre de la polilínea."); return; }
      const iExt = poly[pos];
      // si el cruce cae DENTRO del tramo, eso es recortar, no alargar
      const dentro = d3(q, a) + d3(q, b) < d3(a, b) + 1e-6;
      if (dentro) { updateStatus("ALARGAR: el contorno corta el tramo por dentro; use RECORTAR."); return; }
      pushUndo();
      if (usosDePunto(iExt) > 1) {
        // el extremo lo comparte otra linea: nudo nuevo solo para esta
        const iq = pts.length;
        drawingObj.points.val = [...pts, q];
        const nuevo = poly.slice(); nuevo[pos] = iq;
        drawingObj.polylines.val = polys.map((pl, i) => (i === P ? nuevo : pl));
      } else {
        drawingObj.points.val = pts.map((p, i) => (i === iExt ? q : p));
      }
      updateStatus(`✓ Alargada hasta (${q[0].toFixed(2)}, ${q[1].toFixed(2)}, ${q[2].toFixed(2)}). Designe otra línea o Esc.`);
    }
    // el contorno sigue designado para encadenar recortes, como en AutoCAD
    try { (window as any).__hekatanRebuild?.(); } catch {}
    viewerRender();
    refreshPrompt();
  };

  // ── REPLICAR selección (estilo ETABS "Replicate Linear") ──
  // Clona los nodos + frames/áreas seleccionados `count` veces, cada copia
  // desplazada (dx·i, dy·i, dz·i). Permite duplicar/extender la estructura.
  (window as any).__hekatanReplicateSelection = (
    dx: number, dy: number, dz: number, count: number,
  ): number => {
    count = Math.max(1, Math.round(count || 1));
    const ids = [...selection];
    const pts = drawingObj.points.rawVal;
    const polys = drawingObj.polylines?.rawVal ?? [];
    const areaSet = new Set(drawingObj.areas?.rawVal ?? []);
    const nodeSet = new Set<number>();
    const polyIdxSet = new Set<number>();
    const segPairs: [number, number][] = [];
    ids.forEach((id) => {
      if (id.startsWith("pt:")) nodeSet.add(+id.slice(3));
      else if (id.startsWith("poly:")) {
        const p = +id.slice(5); polyIdxSet.add(p);
        (polys[p] || []).forEach((n) => nodeSet.add(n));
      } else if (id.startsWith("seg:")) {
        const parts = id.split(":"); const P = +parts[1], S = +parts[2];
        const poly = polys[P] || []; const a = poly[S], b = poly[S + 1];
        if (a != null && b != null) { segPairs.push([a, b]); nodeSet.add(a); nodeSet.add(b); }
      }
    });
    if (!nodeSet.size) return 0;
    pushUndo();
    const newPts = [...pts];
    let newPolys = polys.slice();
    if (newPolys.length && newPolys[newPolys.length - 1].length === 0) newPolys = newPolys.slice(0, -1);
    const newAreas = [...(drawingObj.areas?.rawVal ?? [])];
    const origNodes = [...nodeSet];
    for (let i = 1; i <= count; i++) {
      const ox = dx * i, oy = dy * i, oz = dz * i;
      const map = new Map<number, number>();
      origNodes.forEach((n) => {
        map.set(n, newPts.length);
        newPts.push([pts[n][0] + ox, pts[n][1] + oy, pts[n][2] + oz]);
      });
      polyIdxSet.forEach((p) => {
        const cloned = polys[p].map((n) => (map.has(n) ? map.get(n)! : n));
        const at = newPolys.length; newPolys.push(cloned);
        if (areaSet.has(p)) newAreas.push(at);
      });
      segPairs.forEach(([a, b]) => { newPolys.push([map.get(a)!, map.get(b)!]); });
    }
    newPolys.push([]);
    drawingObj.points.val = newPts;
    if (drawingObj.polylines) drawingObj.polylines.val = newPolys;
    if (drawingObj.areas) drawingObj.areas.val = newAreas;
    try { (window as any).__hekatanRebuild?.(); } catch {}
    viewerRender();
    return count;
  };

  rendererElm.addEventListener("click", (event: PointerEvent) => {
    // Ignorar click que viene de drag (rotación)
    if (pointerDownAndMovedCount > 5) {
      pointerDownAndMovedCount = 0;
      return;
    }
    pointerDownAndMovedCount = 0;

    const _camForRay = setPointerFromEvent(event);
    if (!_camForRay) return;
    raycaster.setFromCamera(pointer, _camForRay);
    const intersect = intersectWorkPlane();
    if (!intersect.length) return;

    // GUARD anti-click RASANTE: el plano de trabajo es gigante (10000 m), así
    // que un rayo casi paralelo lo intersecta a miles de metros → metía nodos
    // basura (ej. 2847 m) que disparaban la cámara lejísimos y dejaban TODOS
    // los ejemplos invisibles. Si el impacto cae mucho más lejos que la
    // distancia cámara→objetivo, lo descartamos.
    {
      const camTgtDist = _camForRay.position.distanceTo(controls.target) || 1;
      const hitDist = intersect[0].distance ?? _camForRay.position.distanceTo(intersect[0].point);
      const p0 = intersect[0].point;
      if (!isFinite(p0.x) || !isFinite(p0.y) || !isFinite(p0.z) ||
          hitDist > Math.max(camTgtDist * 12, 300)) {
        updateStatus("⚠ Click rasante descartado — cayó demasiado lejos. Acercá la vista o clickeá sobre la grilla.");
        return;
      }
    }

    let point = intersect[0].point;
    if (event.ctrlKey || event.metaKey) {
      point = new THREE.Vector3(
        Math.round(intersect[0].point.x),
        Math.round(intersect[0].point.y),
        Math.round(intersect[0].point.z)
      );
    }
    // ── AXIS LOCK + ORTO en click ──
    // axisLock manual (X/Y/Z) o ORTO auto (F8) → proyecta el punto al eje.
    {
      const polysNow = drawingObj.polylines?.rawVal ?? [];
      const lastPolyNow = polysNow[polysNow.length - 1] ?? [];
      const allPtsNow = drawingObj.points.rawVal ?? [];
      if (lastPolyNow.length > 0) {
        const lp = allPtsNow[lastPolyNow[lastPolyNow.length - 1]];
        if (lp) {
          const orthoOn = !!(window as any).__hekatanOrthoMode;
          let effectiveLock: "x" | "y" | "z" | null = axisLock;
          if (!effectiveLock && orthoOn) {
            const dx = Math.abs(point.x - lp[0]);
            const dy = Math.abs(point.y - lp[1]);
            const dz = Math.abs(point.z - lp[2]);
            effectiveLock = dx >= dy && dx >= dz ? "x" : (dy >= dz ? "y" : "z");
          }
          if (effectiveLock === "x") point = new THREE.Vector3(point.x, lp[1], lp[2]);
          else if (effectiveLock === "y") point = new THREE.Vector3(lp[0], point.y, lp[2]);
          else if (effectiveLock === "z") point = new THREE.Vector3(lp[0], lp[1], point.z);
        }
      }
    }
    // Si el pointermove enganchó a un EJE 3D auxiliar, commitear EXACTAMENTE
    // ahí (coincide con lo que se ve; evita el "2 cursores" y permite columnas
    // verticales por Z aunque el plano de trabajo sea XY).
    if (_axisSnapPoint) {
      point = _axisSnapPoint.clone();
      updateStatus(`📐 Eje → (${point.x.toFixed(2)}, ${point.y.toFixed(2)}, ${point.z.toFixed(2)})`);
    } else {
      // OSNAP primero (prioridad sobre grid snap)
      const osnapTol = ((window as any).__hekatanSnap2D ?? 0.5) * 1.2;
      const osnap = (window as any).__hekatanOsnapCompute?.(point.x, point.y, point.z, osnapTol);
      if (osnap) {
        point = new THREE.Vector3(osnap.x, osnap.y, osnap.z);
        updateStatus(`🎯 Snap [${osnap.type.toUpperCase()}] → (${point.x.toFixed(2)}, ${point.y.toFixed(2)}, ${point.z.toFixed(2)})`);
      } else {
        // Si no hay osnap, aplicar grid snap 2D — solo si toggle ON.
        const snapEnabled = (window as any).__hekatanSnapEnabled !== false;
        const snap = (window as any).__hekatanSnap2D ?? 0;
        if (snapEnabled && snap > 0) {
          point = new THREE.Vector3(
            Math.round(point.x / snap) * snap,
            Math.round(point.y / snap) * snap,
            Math.round(point.z / snap) * snap,
          );
        }
      }
    }

    // ── Tool dispatcher ──
    procesarClic(point, event);
  });
  // Un PUNTO ya resuelto (por clic o TECLEADO en la ventana de comandos) pasa
  // por el mismo reparto de herramientas. Antes lo tecleado solo servia para
  // linea/polilinea (commitAbsolutePoint): "CIRCULO centro 0,0 radio 3" habia
  // que clicarlo. `event` es null cuando el punto viene del teclado.
  const procesarClic = (point: THREE.Vector3, event: PointerEvent | null) => {
    const tool = ((window as any).__hekatanCadState?.get?.() as any)?.tool ?? "select";

    // ── SELECT/none: NO crear geometría — los planos ortogonales se quedan
    // SIMÉTRICOS al origen siempre. Antes cualquier click los movía y
    // confundía al usuario ("el cursor no cae en el eje"). Ahora solo
    // se re-anclan con Ctrl+Click (acción deliberada).
    if (tool === "select" || tool === "none" || !tool) {
      // ── Click selecciona el item bajo el cursor (hover detectado en pointermove) ──
      // Ctrl+Click agrega/quita de selección múltiple. Click simple reemplaza
      // toda la selección por el item nuevo (o limpia si no hay hover).
      if (hoverItem) {
        // Si hay click-click activo y el usuario clickea sobre un objeto,
        // cancelar el modo (no tiene sentido seguir el rect).
        if (ccAnchor) cancelClickClick();
        const { kind, a, b } = hoverItem;
        const id = b !== undefined ? `${kind}:${a}:${b}` : `${kind}:${a}`;
        const isMulti = !!event && (event.ctrlKey || event.metaKey || event.shiftKey);
        if (!isMulti) selection.clear();
        if (selection.has(id)) selection.delete(id);
        else selection.add(id);
        refreshSelectionGroup();
        updateStatus(`✓ Seleccionados ${selection.size} elemento(s) — Ctrl+Click para multi-selección`);
      } else {
        // Click en vacío. Tres casos:
        //   1. ccAnchor != null  → SEGUNDO click → finaliza rect-select
        //   2. ccAnchor == null  → PRIMER click vacío → empieza click-click rect
        //                          (siempre que no haya modifier multi)
        //   3. multi-modifier sin anchor → ignora (consistente con AutoCAD)
        const isMulti = !!event && (event.ctrlKey || event.metaKey || event.shiftKey);
        const cx = event?.clientX ?? 0;
        const cy = event?.clientY ?? 0;
        if (ccAnchor) {
          // Cierre del rect — usar la lógica compartida.
          finalizeRectSelection(ccAnchor.x, ccAnchor.y, cx, cy, isMulti);
          ccAnchor = null;
        } else if (!isMulti) {
          // Primer click vacío → empezar click-click rect (no limpia
          // selección todavía; al cerrar el rect se aplica la regla
          // estándar: sin modifier reemplaza, con modifier agrega).
          ccAnchor = { x: cx, y: cy };
          updateStatus(
            "🖱 Click 2 para cerrar el rectángulo (→ derecha=Window azul, ←izquierda=Crossing verde). Esc=cancelar.",
          );
          // Pintar un punto inicial pequeño para feedback inmediato.
          paintDragRect(cx, cy, cx + 1, cy + 1, false);
        }
      }
      return;
    }

    // ── AXIS TOOL: 2 clicks para crear un eje (start → end) con burbuja ──
    if (tool === "axis") {
      const st = (window as any).__hekatanAxisDraw as { mode: string; pendingStart: number[] | null } | undefined;
      if (!st) return;
      if (!st.pendingStart) {
        // Primer click → guarda start
        st.pendingStart = [point.x, point.y, point.z];
        updateStatus(`📍 Eje — click 1 OK en (${point.x.toFixed(2)}, ${point.y.toFixed(2)}, ${point.z.toFixed(2)}). Click 2=fin.`);
        return;
      }
      // Segundo click → crea el eje
      const useNum = st.mode === "number";
      const label = (window as any).__hekatanAxisCommit?.(
        st.pendingStart, [point.x, point.y, point.z], useNum,
      );
      updateStatus(`✓ Eje "${label}" creado. Click 1=nuevo eje, o cambia tool.`);
      return;
    }

    if (tool === "move" || tool === "copy") {
      pasoMoverCopiar(tool, [point.x, point.y, point.z]);
      return;
    }

    if (tool === "delete") {
      // Prioridad: aux line hover > polilínea hover (el de menor dist gana,
      // y eso ya se resolvió en el pointermove → solo uno está activo).
      if (hoveredAuxIndex >= 0) {
        const auxState = (window as any).__hekatanDrawingAuxLines;
        const cur: number[][] = auxState?.rawVal ?? auxState?.val ?? auxState ?? [];
        const idx = hoveredAuxIndex;
        if (idx >= 0 && idx < cur.length) {
          pushUndo();  // snapshot para Ctrl+Z
          const next = cur.slice(0, idx).concat(cur.slice(idx + 1));
          // Soportar tanto vanjs State como array pelado
          if (auxState && typeof auxState === "object" && "val" in auxState) {
            auxState.val = next;
          } else {
            (window as any).__hekatanDrawingAuxLines = next;
          }
          updateStatus(`🗑 Línea auxiliar #${idx + 1} borrada`);
          hoveredAuxIndex = -1;
          deleteHover.visible = false;
          try { (window as any).__hekatanRebuild?.(); } catch {}
        }
      } else if (hoveredPolyIndex >= 0) {
        const polyIdx = hoveredPolyIndex;
        const segIdx = hoveredSegIndex;
        const isArea = drawingObj.areas?.rawVal?.includes(polyIdx) ?? false;
        if (isArea) {
          deletePoly(polyIdx);
          updateStatus(`🗑 Área #${polyIdx + 1} (shell Q4) borrada`);
        } else if (segIdx >= 0) {
          deleteSeg(polyIdx, segIdx);
          updateStatus(`🗑 Segmento ${segIdx + 1} de polilínea #${polyIdx + 1} borrado`);
        } else {
          deletePoly(polyIdx);
          updateStatus(`🗑 Polilínea #${polyIdx + 1} borrada`);
        }
      } else {
        updateStatus(`🗑 Acercá el cursor a una línea/área/aux para borrarla`);
      }
      return;
    }

    if (tool === "circle") {
      // 2 clicks: centro + punto en el radio
      pendingClicks.push([point.x, point.y, point.z]);
      if (pendingClicks.length === 1) {
        updateStatus(`○ Círculo — click 1/2 OK (centro). Ahora marcá el radio.`);
        return;
      }
      // 2 clicks recolectados → calcular radio + plano + dibujar
      const [c, p2] = pendingClicks;
      const r = Math.hypot(p2[0] - c[0], p2[1] - c[1], p2[2] - c[2]);
      // Detectar plano según componente con menor variación
      const dx = Math.abs(p2[0] - c[0]);
      const dy = Math.abs(p2[1] - c[1]);
      const dz = Math.abs(p2[2] - c[2]);
      const planeKind: "xy" | "xz" | "yz" = dz < 1e-3 ? "xy" : (dy < 1e-3 ? "xz" : "yz");
      const segs = (window as any).__hekatanArcSegs ?? 12;
      (window as any).__hekatanDrawCircle?.(c[0], c[1], c[2], r, segs, planeKind);
      updateStatus(`✓ Círculo dibujado en ${planeKind.toUpperCase()} — r=${r.toFixed(2)}m, ${segs} segmentos`);
      pendingClicks = [];
      try { (window as any).__hekatanRebuild?.(); } catch {}
      return;
    }
    if (tool === "arc") {
      // 3 clicks: start + mid + end
      pendingClicks.push([point.x, point.y, point.z]);
      if (pendingClicks.length === 1) { updateStatus(`⌒ Arco — click 1/3 OK (inicio). Marcá el punto medio.`); return; }
      if (pendingClicks.length === 2) { updateStatus(`⌒ Arco — click 2/3 OK (medio). Marcá el final.`); return; }
      const [p1, pm, pe] = pendingClicks;
      const segs = (window as any).__hekatanArcSegs ?? 12;
      (window as any).__hekatanDrawArc?.(p1, pm, pe, segs);
      updateStatus(`✓ Arco dibujado — ${segs} segmentos`);
      pendingClicks = [];
      try { (window as any).__hekatanRebuild?.(); } catch {}
      return;
    }
    if (tool === "rect") {
      // 2 clicks: esquina A + esquina opuesta
      pendingClicks.push([point.x, point.y, point.z]);
      if (pendingClicks.length === 1) {
        updateStatus(`▭ Rectángulo — click 1/2 OK (esquina). Marcá la esquina opuesta.`);
        return;
      }
      const [a, b] = pendingClicks;
      (window as any).__hekatanDrawRect?.(a, b);
      updateStatus(`✓ Rectángulo dibujado — (${a[0].toFixed(1)},${a[1].toFixed(1)}) → (${b[0].toFixed(1)},${b[1].toFixed(1)})`);
      pendingClicks = [];
      try { (window as any).__hekatanRebuild?.(); } catch {}
      return;
    }
    if (tool === "rectarea") {
      // 2 clicks (esquinas opuestas) → shell Q4 marcado como ÁREA.
      pendingClicks.push([point.x, point.y, point.z]);
      if (pendingClicks.length === 1) {
        updateStatus(`▭ Área rectangular — click 1/2 OK (esquina). Marcá la esquina opuesta.`);
        return;
      }
      const [a, b] = pendingClicks;
      (window as any).__hekatanDrawRectArea?.(a, b);
      updateStatus(`✓ Área rectangular (shell Q4) creada — (${a[0].toFixed(1)},${a[1].toFixed(1)}) → (${b[0].toFixed(1)},${b[1].toFixed(1)})`);
      pendingClicks = [];
      return;
    }
    if (tool === "polyarea") {
      // Polígono LIBRE (N vértices): acumula clicks; Enter o click-derecho
      // cierra y mallar en shells Q4. Usa array propio (sin nodos huérfanos).
      polyAreaPts.push([point.x, point.y, point.z]);
      polyAreaPreview.geometry.setFromPoints(
        polyAreaPts.map((q) => new THREE.Vector3(q[0], q[1], q[2])),
      );
      polyAreaPreview.visible = polyAreaPts.length >= 1;
      updateStatus(
        `▰ Área libre — ${polyAreaPts.length} punto(s). Click más vértices, o ` +
        `Enter / click-derecho para cerrar y mallar (mín. 3).`,
      );
      viewerRender();
      return;
    }
    if (tool === "plane3") {
      // PLANO INCLINADO por 3 puntos: clickeá 3 puntos (cambiando Cota Z entre
      // clicks, o enganchando nodos existentes a distintas alturas) → el plano
      // de trabajo + grilla se inclinan a esa orientación. Después dibujás el
      // área con ese plano inclinado activo → shell inclinado.
      pendingClicks.push([point.x, point.y, point.z]);
      if (pendingClicks.length < 3) {
        updateStatus(`◣ Plano inclinado — punto ${pendingClicks.length}/3. ` +
          `Tip: cambiá la Cota Z (o enganchá un nodo) entre clicks para darle inclinación.`);
        return;
      }
      const [a, b, c] = pendingClicks;
      const ok = (window as any).__hekatanSetInclinedPlaneFrom3?.(a, b, c);
      updateStatus(ok
        ? `✓ Plano de trabajo INCLINADO activo. Dibujá el área (▭/⬡) sobre él. (XY para resetear)`
        : `⚠ Los 3 puntos son colineales — no definen un plano. Reintentá.`);
      pendingClicks = [];
      return;
    }
    if (tool === "col") {
      // 1 click + tipear altura + Enter → frame vertical (columna).
      // Si solo hace 1 click sin tipear, usa altura default 3m.
      // Sin pendingClicks porque solo necesitamos 1 click.
      pushUndo();
      const baseZ = point.z;
      const h = pendingHeight && pendingHeight > 0 ? pendingHeight : 3;
      drawingObj.points.val = [
        ...drawingObj.points.rawVal,
        [point.x, point.y, baseZ],
        [point.x, point.y, baseZ + h],
      ];
      const polys = drawingObj.polylines!.rawVal;
      const n = drawingObj.points.rawVal.length;
      drawingObj.polylines!.val = [
        ...polys.slice(0, -1),
        ...(polys[polys.length - 1].length > 0 ? [polys[polys.length - 1]] : []),
        [n - 2, n - 1],
        [],
      ];
      pendingHeight = 0;
      updateStatus(`▌ Columna creada — h=${h.toFixed(2)}m. Tipeá altura + Enter para custom.`);
      try { (window as any).__hekatanRebuild?.(); } catch {}
      return;
    }
    if (tool === "wall") {
      // 2 clicks (esquinas inferiores) + tipear altura + Enter → shell Q4
      // vertical. Los 4 vértices: a, b (base), b+H·z, a+H·z.
      pendingClicks.push([point.x, point.y, point.z]);
      if (pendingClicks.length === 1) {
        updateStatus(`▥ Pared Q4 — click 1/2 OK (esquina base 1). Marcá la otra esquina base.`);
        return;
      }
      const [a, b] = pendingClicks;
      const h = pendingHeight && pendingHeight > 0 ? pendingHeight : 3;
      pushUndo();
      const n0 = drawingObj.points.rawVal.length;
      drawingObj.points.val = [
        ...drawingObj.points.rawVal,
        [a[0], a[1], a[2]],            // n0
        [b[0], b[1], b[2]],            // n0+1
        [b[0], b[1], b[2] + h],        // n0+2
        [a[0], a[1], a[2] + h],        // n0+3
      ];
      const polys = drawingObj.polylines!.rawVal;
      const newPolyIdx = polys.length - 1;  // será el último después del push
      drawingObj.polylines!.val = [
        ...polys.slice(0, -1),
        ...(polys[polys.length - 1].length > 0 ? [polys[polys.length - 1]] : []),
        [n0, n0 + 1, n0 + 2, n0 + 3, n0],   // shell Q4 vertical (cerrado visual)
        [],
      ];
      // Marcar el shell Q4 como área
      if (drawingObj.areas) {
        const newPolyAt = drawingObj.polylines!.rawVal.length - 2;  // antes del último vacío
        drawingObj.areas.val = [...drawingObj.areas.rawVal, newPolyAt];
      }
      updateStatus(`▥ Pared Q4 creada — h=${h.toFixed(2)}m. Tipeá altura + Enter para custom.`);
      pendingClicks = [];
      pendingHeight = 0;
      try { (window as any).__hekatanRebuild?.(); } catch {}
      return;
    }
    if (tool === "extp") {
      // EXTRUIR PUNTO → LÍNEA: 1 click sobre un nodo (OSNAP NODE engancha)
      // o sobre el plano. Crea frame vertical de altura `pendingHeight`.
      // Si el click no enganchó a un node existente, usa el point clickeado.
      // Diferencia con "col": busca explícitamente OSNAP node, ideal para
      // extruir nodes ya creados.
      pushUndo();
      const h = pendingHeight && pendingHeight > 0 ? pendingHeight : 3;
      const baseZ = point.z;
      drawingObj.points.val = [
        ...drawingObj.points.rawVal,
        [point.x, point.y, baseZ],
        [point.x, point.y, baseZ + h],
      ];
      const polys = drawingObj.polylines!.rawVal;
      const n = drawingObj.points.rawVal.length;
      drawingObj.polylines!.val = [
        ...polys.slice(0, -1),
        ...(polys[polys.length - 1].length > 0 ? [polys[polys.length - 1]] : []),
        [n - 2, n - 1],
        [],
      ];
      pendingHeight = 0;
      updateStatus(`⬆ Extrusión punto→línea — h=${h.toFixed(2)}m`);
      try { (window as any).__hekatanRebuild?.(); } catch {}
      return;
    }
    if (tool === "extl") {
      // EXTRUIR LÍNEA → ÁREA Q4: 1 click cerca de una línea existente.
      // Crea shell Q4 con los 2 vértices del segmento + 2 vértices extruidos
      // en +Z por la altura tipeada (o 3m default).
      const tol = ((window as any).__hekatanSnap2D ?? 0.5) * 1.5;
      const found = findClosestPoly(point.x, point.y, point.z, tol);
      if (!found) {
        updateStatus(`⬆ Extruir línea — acercá el cursor a una línea existente y volvé a clickear.`);
        return;
      }
      const polys = drawingObj.polylines!.rawVal;
      const allPts = drawingObj.points.rawVal;
      const poly = polys[found.polyIdx];
      const a = allPts[poly[found.segIdx]];
      const b = allPts[poly[found.segIdx + 1]];
      if (!a || !b) {
        updateStatus(`⬆ Extruir línea — segmento no válido.`);
        return;
      }
      const h = pendingHeight && pendingHeight > 0 ? pendingHeight : 3;
      pushUndo();
      const n0 = drawingObj.points.rawVal.length;
      drawingObj.points.val = [
        ...drawingObj.points.rawVal,
        [a[0], a[1], a[2]],            // n0
        [b[0], b[1], b[2]],            // n0+1
        [b[0], b[1], b[2] + h],        // n0+2
        [a[0], a[1], a[2] + h],        // n0+3
      ];
      const polysAfter = drawingObj.polylines!.rawVal;
      drawingObj.polylines!.val = [
        ...polysAfter.slice(0, -1),
        ...(polysAfter[polysAfter.length - 1].length > 0 ? [polysAfter[polysAfter.length - 1]] : []),
        [n0, n0 + 1, n0 + 2, n0 + 3, n0],   // shell Q4 extrudido
        [],
      ];
      // Marcar como área (shell Q4)
      if (drawingObj.areas) {
        const newPolyAt = drawingObj.polylines!.rawVal.length - 2;
        drawingObj.areas.val = [...drawingObj.areas.rawVal, newPolyAt];
      }
      pendingHeight = 0;
      updateStatus(`⬆ Extrusión línea→área Q4 — h=${h.toFixed(2)}m`);
      try { (window as any).__hekatanRebuild?.(); } catch {}
      return;
    }
    if (tool === "auxp") {
      // 1 click → agrega un punto auxiliar (cyan sphere). NO genera nodo FEM
      // pero sirve como anchor de OSnap (endpoint).
      const apState = (window as any).__hekatanDrawingAuxPoints;
      if (apState) {
        const cur: number[][] = apState.rawVal ?? apState.val ?? [];
        apState.val = [...cur, [point.x, point.y, point.z]];
      }
      updateStatus(`✦ Punto auxiliar agregado en (${point.x.toFixed(2)}, ${point.y.toFixed(2)}, ${point.z.toFixed(2)})`);
      return;
    }
    if (tool === "aux") {
      // 2 clicks: punto inicio + punto fin → crea línea auxiliar (NO frame FEM)
      pendingClicks.push([point.x, point.y, point.z]);
      if (pendingClicks.length === 1) {
        updateStatus(`┊ Línea auxiliar — click 1/2 OK. Marcá el punto final.`);
        return;
      }
      const [a, b] = pendingClicks;
      const auxState = (window as any).__hekatanDrawingAuxLines;
      if (auxState) {
        const cur: number[][] = auxState.rawVal ?? auxState.val ?? [];
        auxState.val = [...cur, [a[0], a[1], a[2], b[0], b[1], b[2]]];
      }
      const dx = b[0] - a[0], dy = b[1] - a[1], dz = b[2] - a[2];
      const len = Math.sqrt(dx*dx + dy*dy + dz*dz);
      updateStatus(`✓ Línea auxiliar creada — L=${len.toFixed(2)}m (cyan, no FEM)`);
      pendingClicks = [];
      return;
    }
    if (tool === "extend" || tool === "trim" || tool === "offset") {
      pasoModificar(tool, [point.x, point.y, point.z]);
      return;
    }
    if (tool === "chaflan") {
      // 2 clicks: esquinas opuestas. El radio se lee de window.__hekatanChaflanR
      pendingClicks.push([point.x, point.y, point.z]);
      if (pendingClicks.length === 1) {
        updateStatus(`▱ Losa con chaflanes — click 1/2 OK (esquina). Marcá la esquina opuesta.`);
        return;
      }
      const [a, b] = pendingClicks;
      const rad = (window as any).__hekatanChaflanR ?? 1.0;
      const segArc = Math.max(3, (window as any).__hekatanArcSegs ?? 6);
      (window as any).__hekatanDrawSlabChaflan?.(a, b, rad, segArc, 6);
      const dx = Math.abs(b[0] - a[0]).toFixed(1);
      const dy = Math.abs(b[1] - a[1]).toFixed(1);
      updateStatus(`✓ Losa con chaflanes dibujada — ${dx}×${dy}m, r=${rad}m, ${segArc} seg/chaflán`);
      pendingClicks = [];
      try { (window as any).__hekatanRebuild?.(); } catch {}
      return;
    }

    // ── Default behavior: tools "select", "node", "line", "polyline", "area" ──
    // Click agrega punto + extiende polilínea actual
    rubberUserEditing = false;  // reset al hacer click — el siguiente rubber band parte limpio
    pushUndo();  // snapshot ANTES de modificar — Ctrl+Z restaura
    drawingObj.points.val = [...drawingObj.points.rawVal, point.toArray()];
    if (drawingObj.polylines) {
      drawingObj.polylines.val = [
        ...drawingObj.polylines.rawVal.slice(0, -1),
        [
          ...(drawingObj.polylines.rawVal.length
            ? drawingObj.polylines.rawVal.pop()
            : []),
          drawingObj.points.rawVal.length - 1,
        ],
      ];
    }

    // ── Auto-cierre semántico por tool ──
    // Estos comportamientos diferencian la INTENCIÓN del usuario, no la
    // geometría. Una polilínea cerrada con tool "polyline" sigue siendo
    // una cadena de frames (ej: cercha); solo tool "area" la convierte
    // en shell Q4.
    if (drawingObj.polylines) {
      const polysNow = drawingObj.polylines.rawVal;
      const lastIdx = polysNow.length - 1;
      const last = polysNow[lastIdx] ?? [];

      // ⚠️ La herramienta Línea ENCADENA, como el LINE de AutoCAD: cada clic
      // continúa desde el punto anterior y se termina con Esc o clic derecho.
      //
      // Antes cortaba cada 2 clics y arrancaba una polilínea nueva. Con eso un
      // rectángulo de 4 lados costaba 8 clics —repitiendo cada esquina— en vez
      // de 5, y el modelo quedaba troceado: 5 clics daban polilíneas
      // [2],[2],[1], con una huérfana de un punto que no es ningún frame.
      // Medido en cli/ctl_cad.mjs: [0,2,2,1,2,2,2,2,0].
      //
      // Y lo peor es que el programa ya prometía encadenar: el mensaje de la
      // barra decía "Continuá clickeando para extender la polilínea" y la
      // ayuda del botón, "sigue encadenando". El corte era el error, no el
      // texto. Para hacer tramos sueltos se pulsa Esc entre uno y otro, que es
      // lo que se hace en AutoCAD.
      if (tool === "line" && last.length >= 2) {
        updateStatus(`／ Línea — ${last.length - 1} tramo${last.length === 2 ? "" : "s"}. ` +
                     `Seguí marcando puntos; Esc o clic derecho para terminar.`);
        try { (window as any).__hekatanRebuild?.(); } catch {}
        return;
      }

      if (tool === "area" && last.length === 4) {
        // 4 clicks → cerrar la polilínea (agregar el primer punto al final
        // como referencia visual) y marcarla como ÁREA en drawingAreas.
        // El shell Q4 lo construye newBlank.build() leyendo drawingAreas.
        drawingObj.polylines.val = [
          ...polysNow.slice(0, -1),
          [...last, last[0]],   // cerrar visualmente
          [],                    // arrancar polilínea nueva
        ];
        if (drawingObj.areas) {
          drawingObj.areas.val = [...drawingObj.areas.rawVal, lastIdx];
        }
        updateStatus(`▦ Área (shell Q4) creada — 4 vértices marcados.`);
        try { (window as any).__hekatanRebuild?.(); } catch {}
        return;
      }
    }

    if (tool === "node") updateStatus(`● Nodo creado en (${point.x.toFixed(2)}, ${point.y.toFixed(2)}, ${point.z.toFixed(2)})`);
    else if (tool === "line") updateStatus(`／ Línea — click 1/2 OK. Marcá el segundo punto para crear el frame.`);
    else if (tool === "polyline") updateStatus(`⌐ Polilínea — punto agregado. Continuá clickeando, right-click para terminar.`);
    else if (tool === "area") {
      const last = drawingObj.polylines?.rawVal[drawingObj.polylines.rawVal.length - 1] ?? [];
      updateStatus(`▦ Área — click ${last.length}/4. Marcá ${4 - last.length} vértice${4 - last.length === 1 ? "" : "s"} más.`);
    }
  };

  // Tras CADA clic el prompt se recalcula del estado (va detrás del manejador
  // grande porque los listeners corren en orden de registro).
  rendererElm.addEventListener("click", () => refreshPrompt());

  // On contextmenu, add a new empty polyline
  rendererElm.addEventListener("contextmenu", (ev: Event) => {
    // ÁREA LIBRE: click-derecho cierra el polígono y lo mallar en shells Q4.
    const curToolCm = (window as any).__hekatanCadState?.get?.()?.tool;
    if (curToolCm === "polyarea" && polyAreaPts.length >= 3) {
      ev.preventDefault();
      const cnt = finalizePolyArea();
      updateStatus(`✓ Área libre mallada — ${cnt} shells Q4 creados.`);
      return;
    }
    if (
      !drawingObj.polylines ||
      drawingObj.polylines.rawVal[drawingObj.polylines.rawVal.length - 1]
        .length === 0
    )
      return;

    drawingObj.polylines.val = [...drawingObj.polylines.rawVal, []];
  });

  // On pointer move and intersection with plan, show indication point
  // CRÍTICO: este indicationPoint debe quedar en la MISMA coordenada que el
  // snapMarker Y el punto donde el click handler hace commit. Antes había
  // divergencias:
  //   1. indicationPoint mostraba raw raycast → corregido (osnap + grid snap)
  //   2. Click handler aplica AXIS LOCK + ORTO antes de osnap → este
  //      pointermove NO lo hacía → cuando ORTO=ON, cursor visual mostraba
  //      un punto distinto del que el click realmente comiteaba en la línea.
  //   3. Orden CRÍTICO: el click handler hace
  //         (raw → ctrl-round → axis-lock/ORTO → osnap → grid-snap)
  //      por lo que aquí replicamos ESE orden exacto. Discrepancia en el
  //      orden = punto distinto bajo ciertas combinaciones (ej. ORTO + OSNAP).
  rendererElm.addEventListener("pointermove", (event: PointerEvent) => {
    const _camForRay = setPointerFromEvent(event);
    if (!_camForRay) return;
    raycaster.setFromCamera(pointer, _camForRay);
    const intersect = intersectWorkPlane();

    indicationPoint.geometry.deleteAttribute("position"); // delete point if not intersection

    if (intersect.length) {
      let point = intersect[0].point.clone();

      // 1) Ctrl/Cmd → integer round (igual que click handler L2916-2922)
      if (event.ctrlKey || event.metaKey) {
        point.set(Math.round(point.x), Math.round(point.y), Math.round(point.z));
      }

      // 2) AXIS LOCK + ORTO (igual que click handler L2923-2945) — proyecta
      //    al eje dominante respecto al último punto de la polilínea actual.
      //    Sin este bloque, cuando ORTO=ON, cursor visual y commit divergen.
      {
        const polysNow = drawingObj.polylines?.rawVal ?? [];
        const lastPolyNow = polysNow[polysNow.length - 1] ?? [];
        const allPtsNow = drawingObj.points.rawVal ?? [];
        if (lastPolyNow.length > 0) {
          const lp = allPtsNow[lastPolyNow[lastPolyNow.length - 1]];
          if (lp) {
            const orthoOn = !!(window as any).__hekatanOrthoMode;
            // axisLock es la variable de closure (line 739), no el getter window.
            let effectiveLock: "x" | "y" | "z" | null = axisLock;
            if (!effectiveLock && orthoOn) {
              const dx = Math.abs(point.x - lp[0]);
              const dy = Math.abs(point.y - lp[1]);
              const dz = Math.abs(point.z - lp[2]);
              effectiveLock = dx >= dy && dx >= dz ? "x" : (dy >= dz ? "y" : "z");
            }
            if (effectiveLock === "x") point.set(point.x, lp[1], lp[2]);
            else if (effectiveLock === "y") point.set(lp[0], point.y, lp[2]);
            else if (effectiveLock === "z") point.set(lp[0], lp[1], point.z);
          }
        }
      }

      // 3) OSNAP (prioridad sobre grid snap, igual que click handler L2946-2951)
      const osnapTol = ((window as any).__hekatanSnap2D ?? 0.5) * 1.2;
      const osnap = (window as any).__hekatanOsnapCompute?.(point.x, point.y, point.z, osnapTol);
      if (osnap) {
        point.set(osnap.x, osnap.y, osnap.z);
      } else {
        // 4) Sin osnap → grid snap 2D (igual que click handler L2952-2962)
        const snapEnabled = (window as any).__hekatanSnapEnabled !== false;
        const snap = (window as any).__hekatanSnap2D ?? 0.5;
        if (snapEnabled && snap > 0) {
          point.x = Math.round(point.x / snap) * snap;
          point.y = Math.round(point.y / snap) * snap;
          point.z = Math.round(point.z / snap) * snap;
        }
      }

      indicationPoint.geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(point.toArray(), 3)
      );
    }

    viewerRender();
  });

  // On pointer move and intersection with a point, hide indication point
  rendererElm.addEventListener("pointermove", (event: PointerEvent) => {
    const _camForRay = setPointerFromEvent(event);
    if (!_camForRay) return;
    raycaster.setFromCamera(pointer, _camForRay);

    // Check if point in the plane
    let isPointInPlane = false;
    const intersectWithPoints = raycaster.intersectObject(points);
    const intersectWithPlane = intersectWorkPlane();
    if (intersectWithPoints.length && intersectWithPlane.length) {
      const point = new THREE.Vector3(
        ...drawingObj.points.rawVal[intersectWithPoints[0].index]
      );
      const planePoint = new THREE.Vector3(...intersectWithPlane[0].point);
      const planeToPoint = point.sub(planePoint);
      const planeNormal = intersectWithPlane[0].face?.normal;
      planeNormal.transformDirection(plane.matrixWorld);
      if (Math.abs(planeToPoint.dot(planeNormal)) < 1e-4) isPointInPlane = true;
    }

    indicationPoint.visible = isPointInPlane ? false : true;
  });

  // On pointer drag and intersection with a point and plane, update point position
  let isPointInPlaneWithoutControl = false;
  let pointIndex: number | undefined;
  rendererElm.addEventListener("pointermove", (event: PointerEvent) => {
    if (!pointerDownAndMovedCount) return;

    const _camForRay = setPointerFromEvent(event);
    if (!_camForRay) return;
    raycaster.setFromCamera(pointer, _camForRay);

    // Check if point in the plane
    let isPointInPlane = false;
    const intersectWithPoints = raycaster.intersectObject(points);
    const intersectWithPlane = intersectWorkPlane();
    if (intersectWithPoints.length && intersectWithPlane.length) {
      const point = new THREE.Vector3(
        ...drawingObj.points.rawVal[intersectWithPoints[0].index]
      );
      const planePoint = new THREE.Vector3(...intersectWithPlane[0].point);
      const planeToPoint = point.sub(planePoint);
      const planeNormal = intersectWithPlane[0].face?.normal;
      planeNormal.transformDirection(plane.matrixWorld);
      if (Math.abs(planeToPoint.dot(planeNormal)) < 1e-4) isPointInPlane = true;
    }

    // < 5 to not trigger with rotation
    if (isPointInPlane && pointerDownAndMovedCount < 5) {
      isPointInPlaneWithoutControl = true;
      controls.enabled = false;
      pointIndex = intersectWithPoints[0].index;
    }

    if (!isPointInPlaneWithoutControl) return;

    if (pointerDownAndMovedCount % 2 !== 0) return; // slow movements for (parametric) performance opt 5

    const newPoints = [...drawingObj.points.rawVal];
    if (pointIndex !== undefined) {
      let newPosition = intersectWithPlane[0].point;

      if (event.ctrlKey || event.metaKey) {
        newPosition = new THREE.Vector3(
          Math.round(newPosition.x),
          Math.round(newPosition.y),
          Math.round(newPosition.z)
        );
      }

      newPoints[pointIndex] = newPosition.toArray();
      // newPoints[pointIndex] = intersectWithPlane[0].point.toArray();
    }
    drawingObj.points.val = newPoints;
  });

  rendererElm.addEventListener("pointerup", () => {
    controls.enabled = true;
    isPointInPlaneWithoutControl = false;
  });

  // On contextmenu move and point in the plane, delete the point and update polyline
  rendererElm.addEventListener("contextmenu", (event: PointerEvent) => {
    const _camForRay = setPointerFromEvent(event);
    if (!_camForRay) return;
    raycaster.setFromCamera(pointer, _camForRay);

    // Check if point in the plane
    let isPointInPlane = false;
    const intersectWithPoints = raycaster.intersectObject(points);
    const intersectWithPlane = intersectWorkPlane();
    if (intersectWithPoints.length && intersectWithPlane.length) {
      const point = new THREE.Vector3(
        ...drawingObj.points.rawVal[intersectWithPoints[0].index]
      );
      const planePoint = new THREE.Vector3(...intersectWithPlane[0].point);
      const planeToPoint = point.sub(planePoint);
      const planeNormal = intersectWithPlane[0].face?.normal;
      planeNormal.transformDirection(plane.matrixWorld);
      if (Math.abs(planeToPoint.dot(planeNormal)) < 1e-4) isPointInPlane = true;
    }

    if (!isPointInPlane) return;

    const newPoints = [...drawingObj.points.rawVal];
    newPoints.splice(intersectWithPoints[0].index, 1);
    drawingObj.points.val = newPoints;

    if (!drawingObj.polylines) return;

    const newPolylines = drawingObj.polylines.rawVal
      .map((polyline) =>
        polyline.filter((i) => i !== intersectWithPoints[0].index)
      ) // remove point index from polyline
      .map((polyline) =>
        polyline.map((i) => (i > intersectWithPoints[0].index ? i - 1 : i))
      ) // update polyline indices
      .filter((polyline) => polyline.length); // remove empty polylines

    newPolylines.push([]); // add new empty polyline

    drawingObj.polylines.val = newPolylines;
  });
}

// Utils
function interpolate(
  object3D: THREE.Object3D,
  target: { position: THREE.Vector3; quaternion: THREE.Quaternion },
  onAnimate?: () => void
) {
  const duration = 500; // In milliseconds
  const fps = 30; // Frames per second
  const steps = Math.round(duration / (1000 / fps));
  const origin = {
    position: object3D.position.clone(),
    quaternion: object3D.quaternion.clone(),
  };
  const animationID = setInterval(animate, 1000 / fps);

  let step = 0;
  function animate() {
    step++;

    const t = step / steps;
    object3D.position.lerpVectors(origin.position, target.position, t);
    object3D.quaternion.slerpQuaternions(
      origin.quaternion,
      target.quaternion,
      t
    );

    if (onAnimate) onAnimate();

    if (step == steps) clearInterval(animationID);
  }
}
