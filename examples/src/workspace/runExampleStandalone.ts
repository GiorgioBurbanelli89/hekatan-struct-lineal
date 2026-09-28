/**
 * Runner standalone — cada example folder (`plate-thin/main.ts`, etc.) lo llama
 * con su propio ExampleDef. Crea el viewer, Tweakpane, toolbar.
 * La misma función de construcción se puede cargar desde workspace o standalone.
 */
import van, { State } from "vanjs-core";
import * as THREE from "three";
import { Pane } from "tweakpane";
import {
  Node, Element, NodeInputs, ElementInputs,
  DeformOutputs, AnalyzeOutputs,
} from "hekatan-fem";
import { getToolbar, getViewer, colorMapForceUnit, colorMapDispUnit } from "hekatan-ui";
import type { ExampleDef, BuildStates } from "./exampleRegistry";
import { attachInspect } from "../shared/attachInspect";
import { createModalPanel } from "../shared/renderModalTable";
import { createModalAnimator, type ModalAnimator } from "../shared/animateMode";
import {
  forceUnit, dispUnit, fromKn, toKn, fromKnm, toKnm,
  forceUnitSuffix, momentUnitSuffix, dispUnitSuffix, stripUnitSuffix,
  stressUnit, subgradeUnit, stiffTransUnit, lengthSectionUnit,
  applyConsistentUnits, detectCurrentPreset,
} from "./units";

// Propagación unit → colormap legend del viewer (misma pipeline que el workspace)
van.derive(() => { colorMapForceUnit.val = forceUnit.val; });
van.derive(() => { colorMapDispUnit.val = dispUnit.val; });

export function runExampleStandalone(ex: ExampleDef) {
  const nodes: State<Node[]> = van.state([]);
  const elements: State<Element[]> = van.state([]);
  const nodeInputs: State<NodeInputs> = van.state({});
  const elementInputs: State<ElementInputs> = van.state({});
  const deformOutputs: State<DeformOutputs> = van.state({});
  const analyzeOutputs: State<AnalyzeOutputs> = van.state({});
  const objects3D: State<THREE.Object3D[]> = van.state([]);

  const states: BuildStates = {
    nodes, elements, nodeInputs, elementInputs,
    deformOutputs, analyzeOutputs, objects3D,
  };

  // currentParams en UNIDAD UI. Los p.default están en SI; convertir para display.
  const currentParams: Record<string, number> = Object.fromEntries(
    Object.entries(ex.params).map(([k, p]) => {
      const valSI = p.default;
      if (p.unitType === "force")  return [k, fromKn(valSI)];
      if (p.unitType === "moment") return [k, fromKnm(valSI)];
      return [k, valSI];
    }),
  );

  /** Convierte UI unit → SI para pasar a ex.build(). */
  const toSIParams = (): Record<string, number> => {
    const si: Record<string, number> = { ...currentParams };
    for (const [k, p] of Object.entries(ex.params)) {
      if (p.unitType === "force")  si[k] = toKn(currentParams[k]);
      if (p.unitType === "moment") si[k] = toKnm(currentParams[k]);
    }
    return si;
  };

  // computedObj backea el folder "📊 Resultados". Se rellena con
  // ex.computedLabels() y se refresca tras cada rebuild() vía pane.refresh().
  let computedObj: Record<string, string> | null = null;
  let currentPaneRef: Pane | null = null;

  const rebuild = () => {
    ex.build(toSIParams(), states);
    // Refrescar valores calculados después del build (lecturas de outputs)
    if (ex.computedLabels && computedObj && currentPaneRef) {
      const latest = ex.computedLabels(toSIParams(), states);
      for (const key of Object.keys(computedObj)) {
        if (key in latest) computedObj[key] = latest[key];
      }
      // Agregar nuevas keys que no estaban en el initial
      for (const key of Object.keys(latest)) {
        if (!(key in computedObj)) computedObj[key] = latest[key];
      }
      currentPaneRef.refresh();
    }
  };

  // ── Tweakpane panel (ARRASTRABLE, posición persistida) ─────────────
  const paneHost = document.createElement("div");
  const PANE_POS_KEY = `hk_paneHostPos_${ex.id}`;
  const savedPos = (() => {
    try {
      const raw = localStorage.getItem(PANE_POS_KEY);
      if (raw) return JSON.parse(raw) as { left: number; top: number };
    } catch {}
    return null;
  })();
  paneHost.style.cssText =
    "position:fixed;" +
    (savedPos ? `left:${savedPos.left}px;top:${savedPos.top}px;right:auto;` : "top:16px;right:16px;") +
    "width:min(320px,calc(100vw - 32px));max-width:90vw;z-index:100;" +
    "max-height:90vh;overflow-y:auto;font-size:12px;" +
    "box-shadow:0 6px 24px rgba(0,0,0,0.35);border:1px solid rgba(255,255,255,0.08);";
  document.body.appendChild(paneHost);

  // Función para construir (o reconstruir) el pane. Se reconstruye al cambiar
  // la unidad de fuerza/desplazamiento para que los labels/valores reflejen
  // la unidad actual.
  let currentPane: Pane | null = null;
  const buildPane = () => {
    if (currentPane) { currentPane.dispose(); }
    paneHost.innerHTML = "";
    const pane = new Pane({ container: paneHost, title: ex.name });
    currentPane = pane;
    currentPaneRef = pane;

    // Hacer el pane arrastrable desde el title-bar.
    setTimeout(() => {
      const handle = paneHost.querySelector(".tp-rotv_b, .tp-fldv_b") as HTMLElement | null;
      if (!handle) return;
      handle.style.cursor = "move";
      handle.style.userSelect = "none";
      let dragging = false;
      let startX = 0, startY = 0, origLeft = 0, origTop = 0;
      handle.addEventListener("mousedown", (e) => {
        dragging = true;
        startX = e.clientX; startY = e.clientY;
        const r = paneHost.getBoundingClientRect();
        origLeft = r.left; origTop = r.top;
        paneHost.style.right = "auto";
        paneHost.style.left = `${origLeft}px`;
        paneHost.style.top = `${origTop}px`;
        e.preventDefault();
      });
      window.addEventListener("mousemove", (e) => {
        if (!dragging) return;
        const dx = e.clientX - startX, dy = e.clientY - startY;
        const newLeft = Math.max(0, Math.min(window.innerWidth - 40, origLeft + dx));
        const newTop = Math.max(0, Math.min(window.innerHeight - 40, origTop + dy));
        paneHost.style.left = `${newLeft}px`;
        paneHost.style.top = `${newTop}px`;
      });
      window.addEventListener("mouseup", () => {
        if (!dragging) return;
        dragging = false;
        try {
          localStorage.setItem(PANE_POS_KEY, JSON.stringify({
            left: parseFloat(paneHost.style.left),
            top: parseFloat(paneHost.style.top),
          }));
        } catch {}
      });
    }, 0);

    // ── SAFE F2K Export/Import (solo cimentaciones puras) ─────
    // Mismo behavior que el workspace: roundtrip Hekatan ↔ SAFE para validación.
    // Cubre zapata*, guerra-ej* y safe-bench-* (el modelo ES la zapata).
    if (/^(zapata|guerra-ej|safe-bench-)/.test(ex.id)) {
      const fF2K = pane.addFolder({ title: "📄 SAFE F2K", expanded: false });
      fF2K.addButton({ title: "📤 Exportar a SAFE (.f2k)" }).on("click", async () => {
        try {
          const p = currentParams;
          // Si el ejemplo provee su propio exportador (compuesto, losa, viga
          // de cimentación, etc.), lo usamos en vez del genérico de zapata única.
          if (typeof ex.exportF2k === "function") {
            ex.exportF2k(p);
            return;
          }
          const { downloadZapataF2k } = await import("../zapata-aislada/f2kExporter");
          const ks_factor = p.ks_factor ?? 10.5;
          const q_adm_tonf = p.q_adm ?? 20;
          const ks_kNm3 = ks_factor * q_adm_tonf * 9.80665;
          const useSimple = (p.useSimple ?? 1) >= 0.5;
          const P_dead_kN = useSimple ? (p.P_simple ?? 0) * 9.80665 : (p.P_D ?? 10) * 9.80665;
          const P_live_kN = useSimple ? 0 : (p.P_L ?? 5) * 9.80665;
          const Mx_dead = useSimple ? (p.Mx_simple ?? 0) * 9.80665 : (p.Mx_D ?? 0) * 9.80665;
          const My_dead = useSimple ? (p.My_simple ?? 0) * 9.80665 : (p.My_D ?? 0) * 9.80665;
          downloadZapataF2k({
            Lz: p.Lz ?? 1.5,
            Bz: p.Bz ?? 1.5,
            tz: p.tz ?? 0.30,
            bc: p.bc ?? 0.4,
            ks_kNm3, P_dead_kN, P_live_kN,
            Mx_dead_kNm: Mx_dead, My_dead_kNm: My_dead,
          }, `Zapata_Hekatan_${Date.now()}.f2k`);
          alert(`F2K descargado.\nks=${ks_kNm3.toFixed(0)} kN/m³, P_dead=${P_dead_kN.toFixed(1)} kN.\nAbrilo en SAFE: File → Import → SAFE Text File.`);
        } catch (e: any) {
          alert(`Error: ${e?.message ?? e}`);
        }
      });
      // Función reutilizable para aplicar un F2K text (también expuesta en window
      // como `__hekatanImportF2kText` para testing programático del flujo).
      const applyF2kText = async (text: string, sourceName: string) => {
        const { parseZapataF2k } = await import("../zapata-aislada/f2kImporter");
        const p = parseZapataF2k(text);
        if (p.Lz != null) currentParams.Lz = p.Lz;
        if (p.Bz != null) currentParams.Bz = p.Bz;
        if (p.tz != null) currentParams.tz = p.tz;
        if (p.bc != null) currentParams.bc = p.bc;
        if (p.q_adm != null) currentParams.q_adm = p.q_adm;
        if (p.ks_factor != null) currentParams.ks_factor = p.ks_factor;
        // CRÍTICO: ks (kN/m³) es el valor REAL que usa el solver, no q_adm × ks_factor.
        // Sin este line, el slider ks queda en default (2059) aunque el F2K traía
        // 19,999 kN/m³ (= 2,039 tonf/m³ que muestra SAFE).
        if (p.ks_kNm3 != null) currentParams.ks = p.ks_kNm3;
        if (p.P_dead_tonf != null) {
          currentParams.useSimple = 1;
          currentParams.P_simple = p.P_dead_tonf;
          currentParams.useD = 0;
          currentParams.useL = 0;
          currentParams.useS = 0;
        }
        if (p.Mx_dead_tonfm != null) currentParams.Mx_simple = p.Mx_dead_tonfm;
        if (p.My_dead_tonfm != null) currentParams.My_simple = p.My_dead_tonfm;
        if (p.q_adm != null && p.ks_factor != null) {
          currentParams.soilType = 0;
        }
        buildPane();
        rebuild();
        return p;
      };
      // Exponer para testing CLI / DOM scripts
      (window as any).__hekatanImportF2kText = applyF2kText;

      fF2K.addButton({ title: "📥 Importar F2K…" }).on("click", () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".f2k,.txt";
        input.onchange = async (ev: any) => {
          const file = ev.target.files?.[0];
          if (!file) return;
          try {
            const text = await file.text();
            const p = await applyF2kText(text, file.name);
            alert(
              `F2K importado: ${file.name}\n` +
              `\nGeometría:` +
              `\n  Lz = ${p.Lz?.toFixed(2)} m, Bz = ${p.Bz?.toFixed(2)} m, tz = ${p.tz?.toFixed(2)} m` +
              `\n  Columna = ${p.bc?.toFixed(2)} m` +
              `\n\nSuelo:` +
              `\n  ks = ${p.ks_kNm3?.toFixed(0)} kN/m³` +
              `\n  q_adm = ${p.q_adm?.toFixed(1)} tonf/m²  ks_factor = ${p.ks_factor?.toFixed(1)}` +
              `\n\nCargas (modo Simple):` +
              `\n  P = ${p.P_dead_tonf?.toFixed(2)} tonf` +
              `\n  Mx = ${(p.Mx_dead_tonfm ?? 0).toFixed(2)} tonf·m` +
              `\n  My = ${(p.My_dead_tonfm ?? 0).toFixed(2)} tonf·m` +
              `\n\n✓ Los sliders del Tweakpane se actualizaron.`
            );
          } catch (e: any) {
            alert(`Error: ${e?.message ?? e}`);
          }
        };
        input.click();
      });
      // OpenSeesPy + TCL exporters (bonus)
      fF2K.addButton({ title: "🐍 Exportar a OpenSeesPy (.py)" }).on("click", async () => {
        try {
          const { exportZapataOpsPy } = await import("../zapata-aislada/opsPyExporter");
          const p = currentParams;
          const ks_kNm3 = (p.ks_factor ?? 10.5) * (p.q_adm ?? 20) * 9.80665;
          const useSimple = (p.useSimple ?? 1) >= 0.5;
          const text = exportZapataOpsPy({
            Lz: p.Lz ?? 1.5, Bz: p.Bz ?? 1.5, tz: p.tz ?? 0.30, bc: p.bc ?? 0.4,
            ks_kNm3,
            P_dead_kN: useSimple ? (p.P_simple ?? 0) * 9.80665 : (p.P_D ?? 10) * 9.80665,
            P_live_kN: useSimple ? 0 : (p.P_L ?? 5) * 9.80665,
          });
          const blob = new Blob([text], { type: "text/x-python" });
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = `Zapata_Hekatan_${Date.now()}.py`;
          a.click();
          alert(`OpenSeesPy script descargado.\nEjecutar: python -X utf8 <archivo>.py`);
        } catch (e: any) { alert(`Error: ${e?.message ?? e}`); }
      });
    }

    // ── Unidades ─────────────────────────────────────────────
    const fUnits = pane.addFolder({ title: "Unidades", expanded: false });
    const unitsProxy = { force: forceUnit.val, disp: dispUnit.val };
    fUnits.addBinding(unitsProxy, "force", {
      label: "Fuerza",
      options: { kN: "kN", tonf: "tonf", kip: "kip" },
    }).on("change", (e) => {
      const oldUnit = forceUnit.val;
      const newUnit = e.value as any;
      if (oldUnit !== newUnit) {
        const fOld = oldUnit === "kN" ? 1 : oldUnit === "tonf" ? 9.80665 : 4.4482216;
        const fNew = newUnit === "kN" ? 1 : newUnit === "tonf" ? 9.80665 : 4.4482216;
        for (const [k, p] of Object.entries(ex.params)) {
          if (p.unitType === "force" || p.unitType === "moment") {
            currentParams[k] = (currentParams[k] * fOld) / fNew;
          }
        }
      }
      forceUnit.val = newUnit;
      buildPane();
      rebuild();
    });
    fUnits.addBinding(unitsProxy, "disp", {
      label: "Desplazamiento",
      options: { mm: "mm", cm: "cm", m: "m", in: "in" },
    }).on("change", (e) => {
      dispUnit.val = e.value as any;
      buildPane();
      rebuild();
    });

    // Sub-folder "🌐 Sistema (preset)" — un click setea todo coherente
    const fPreset = fUnits.addFolder({ title: "🌐 Sistema (preset)", expanded: true });
    const presetProxy = { sistema: detectCurrentPreset() };
    fPreset.addBinding(presetProxy, "sistema", {
      label: "Preset",
      options: {
        "Metric MKS (tonf, m, mm, kgf/cm²)": "Metric MKS",
        "Metric SI (kN, m, mm, MPa)": "Metric SI",
        "U.S. Imperial (kip, ft, in, ksi)": "U.S. Imperial",
        "Custom (granular)": "Custom",
      },
    }).on("change", (e: any) => {
      if (e.value === "Custom") return;
      applyConsistentUnits(e.value);
      unitsProxy.force = forceUnit.val;
      unitsProxy.disp = dispUnit.val;
      customProxy.stress = stressUnit.val;
      customProxy.subgrade = subgradeUnit.val;
      customProxy.stiffTrans = stiffTransUnit.val;
      customProxy.lengthSection = lengthSectionUnit.val;
      pane.refresh();
      buildPane();
      rebuild();
    });

    // Sub-folder "📐 Display Units (granular)"
    const fCustom = fUnits.addFolder({ title: "📐 Display Units (granular)", expanded: false });
    const customProxy = {
      stress: stressUnit.val,
      subgrade: subgradeUnit.val,
      stiffTrans: stiffTransUnit.val,
      lengthSection: lengthSectionUnit.val,
    };
    fCustom.addBinding(customProxy, "stress", {
      label: "Stress",
      options: { "kN/m²": "kN/m²", "kPa": "kPa", "MPa": "MPa", "GPa": "GPa",
                 "kgf/cm²": "kgf/cm²", "tonf/m²": "tonf/m²", "psi": "psi",
                 "ksi": "ksi", "kip/ft²": "kip/ft²" },
    }).on("change", (e: any) => {
      stressUnit.val = e.value;
      presetProxy.sistema = detectCurrentPreset();
      pane.refresh();
      rebuild();
    });
    fCustom.addBinding(customProxy, "subgrade", {
      label: "Subgrade ks",
      options: { "kN/m³": "kN/m³", "tonf/m³": "tonf/m³", "kgf/cm³": "kgf/cm³",
                 "kip/ft³": "kip/ft³", "pci": "pci" },
    }).on("change", (e: any) => {
      subgradeUnit.val = e.value;
      presetProxy.sistema = detectCurrentPreset();
      pane.refresh();
      rebuild();
    });
    fCustom.addBinding(customProxy, "stiffTrans", {
      label: "Stiffness K",
      options: { "kN/m": "kN/m", "tonf/m": "tonf/m", "kip/in": "kip/in",
                 "kip/ft": "kip/ft", "N/mm": "N/mm" },
    }).on("change", (e: any) => {
      stiffTransUnit.val = e.value;
      presetProxy.sistema = detectCurrentPreset();
      pane.refresh();
      rebuild();
    });
    fCustom.addBinding(customProxy, "lengthSection", {
      label: "Length section",
      options: { "mm": "mm", "cm": "cm", "m": "m", "in": "in", "ft": "ft" },
    }).on("change", (e: any) => {
      lengthSectionUnit.val = e.value;
      presetProxy.sistema = detectCurrentPreset();
      pane.refresh();
      rebuild();
    });

    // ── Parámetros — agrupados en folders según ParamDef.folder ──
    // Mismo comportamiento que el workspace pane builder: si un param tiene
    // `folder: "Cargas — Patrón D"`, se mete bajo ese folder. Sin folder → root "Parámetros".
    const defaultFolderTitle = "Parámetros";
    const folderMap = new Map<string, any>();
    const isExpandedByDefault = (title: string) =>
      title === defaultFolderTitle ||
      /\bmodo\b/i.test(title) ||
      /activar/i.test(title) ||
      /combinaci/i.test(title);
    const getFolder = (title: string) => {
      if (!folderMap.has(title)) {
        folderMap.set(title, pane.addFolder({ title, expanded: isExpandedByDefault(title) }));
      }
      return folderMap.get(title);
    };
    let timer: number | null = null;
    const scheduleRebuild = () => {
      if (timer !== null) clearTimeout(timer);
      timer = window.setTimeout(() => { timer = null; rebuild(); }, 120);
    };
    // Proxy para checkboxes (p.boolean=true) — Tweakpane requiere true/false nativo
    const boolProxy: Record<string, boolean> = {};
    for (const [key, p] of Object.entries(ex.params)) {
      const folderTitle = p.folder ?? defaultFolderTitle;
      const fTarget = getFolder(folderTitle);
      // Boolean → checkbox
      if (p.boolean) {
        boolProxy[key] = currentParams[key] >= 0.5;
        fTarget.addBinding(boolProxy, key, { label: p.label ?? key }).on("change", (e: any) => {
          currentParams[key] = e.value ? 1 : 0;
          if (ex.onParamChange) {
            ex.onParamChange(key, currentParams);
            pane.refresh();  // sync UI con currentParams modificado en onParamChange
          }
          scheduleRebuild();
        });
        continue;
      }
      // Slider / dropdown / number input
      const baseLabel = stripUnitSuffix(p.label ?? key);
      const unitSuffix = p.unitType === "force"  ? ` ${forceUnitSuffix()}` :
                         p.unitType === "moment" ? ` ${momentUnitSuffix()}` :
                         p.unitType === "disp"   ? ` ${dispUnitSuffix()}` :
                         "";
      const opts: any = { label: baseLabel + unitSuffix };
      if (p.options !== undefined) {
        opts.options = p.options;
      } else {
        if (p.min !== undefined) opts.min = p.min;
        if (p.max !== undefined) opts.max = p.max;
        if (p.step !== undefined) opts.step = p.step;
      }
      fTarget.addBinding(currentParams, key, opts).on("change", () => {
        if (ex.onParamChange) {
          ex.onParamChange(key, currentParams);
          pane.refresh();  // sync UI con currentParams modificado en onParamChange
        }
        scheduleRebuild();
      });
    }

    // ── Folder "📊 Resultados" (read-only) — valores derivados del análisis ──
    // Solo se muestra si el ejemplo exporta computedLabels(). Se pobla en el
    // primer build (después del buildPane inicial) y se refresca tras cada
    // rebuild() vía pane.refresh() — ver el override de rebuild() arriba.
    if (ex.computedLabels) {
      const fResults = pane.addFolder({ title: "📊 Resultados", expanded: true });
      // Llamar computedLabels con los params actuales — states puede estar vacío
      // en el primer build, pero la función debe manejar eso (ej: q_max=0).
      const initial = ex.computedLabels(toSIParams(), states);
      computedObj = computedObj ?? {};
      for (const key of Object.keys(initial)) {
        computedObj[key] = initial[key];
      }
      for (const key of Object.keys(initial)) {
        fResults.addBinding(computedObj, key, {
          readonly: true,
          view: "text",
          interval: 0,
        } as any);
      }
    }
  };

  buildPane();

  // ── 3D viewer ────────────────────────────────────────────
  const viewerElm = getViewer({
    mesh: { nodes, elements, nodeInputs, elementInputs, deformOutputs, analyzeOutputs },
    objects3D,
    settingsObj: {
      deformedShape: true,
      displayScale: -1.5,    // markers y flechas a 0.5× (no tapan el modelo)
      // un modelo de sólidos abre con su campo de sólido, no con uno de cáscara
      shellResults: ex.defaultShellResult ?? (ex.defaultSolidResult ? "none" : "displacementZ"),
      solidResults: ex.defaultSolidResult ?? "none",
      gridSize: 10,
      showCotas: true,
    },
  });
  document.body.append(
    viewerElm,
    getToolbar({
      sourceCode: "https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal",
      author: "https://www.linkedin.com/in/jorge-burbano-213741138/",
    })
  );

  // ── Botón Inspect (todos los ejemplos lo tienen ahora) ──────
  attachInspect(viewerElm, {
    nodes, elements, nodeInputs, elementInputs, deformOutputs, analyzeOutputs,
  });

  rebuild();

  // Donde cuelgan Modal y Design.
  //
  // Estaban en el panel del EJEMPLO (arriba a la derecha), que en un modelo
  // importado sale casi vacio —solo Unidades, Modal y Design— mientras que
  // "🔬 Analyze", con los resultados, vive en el panel de Settings del viewer,
  // al otro lado de la pantalla. Repartidos asi no se encuentran: Jorge, con el
  // galpon abierto, dijo *"el tweakpane, el modal, la animacion y la ejecucion
  // no lo veo"*. El viewer ya expone su folder Analyze en
  // `window.__hekatanOutputsFolder` justo para esto, asi que Modal y Design van
  // DENTRO de el, junto a los resultados. Si no existe (un ejemplo sin salidas)
  // se cae al panel del ejemplo, como antes.
  const folderAnalisis = (): any =>
    (window as any).__hekatanOutputsFolder ?? (currentPaneRef as any);

  // ── ▶ EJECUTAR ───────────────────────────────────────────────────────
  // El modelo se resuelve solo al construirse y al mover cualquier parametro,
  // asi que no habia boton de correr: si algo no cuadraba, la unica forma de
  // rehacer el analisis era tocar un slider y devolverlo. Un boton explicito
  // cuesta cuatro lineas y es lo que se busca cuando se abre un modelo.
  try {
    const fa = folderAnalisis();
    if (fa?.addButton) {
      const btnRun = fa.addButton({ title: "▶ Ejecutar analisis", index: 0 });
      btnRun.on("click", async () => {
        const t = (btnRun as any).title;
        try {
          (btnRun as any).title = "⏳ resolviendo…";
          await new Promise((r) => setTimeout(r, 30));   // que se pinte el aviso
          rebuild();
        } catch (e: any) {
          console.error("[ejecutar]", e);
          alert(`El analisis fallo: ${e?.message ?? e}`);
        } finally {
          (btnRun as any).title = t;
        }
      });
    }
  } catch (e: any) { console.warn("[ejecutar] no se pudo montar:", e?.message ?? e); }

  // ── ⚡ MODAL ─────────────────────────────────────────────────────────
  // Jorge: *"no veo el analisis modal ... creamos un tweakpane que indique
  // analyze y dentro frame results, shell results, etc."*. En el workspace el
  // modal vive en su propio folder y hay que ir a buscarlo; aqui va DENTRO del
  // panel, junto a los resultados, que es donde se lo espera.
  try {
    const paneAny = folderAnalisis();
    if (paneAny?.addFolder) {
      const fm = paneAny.addFolder({ title: "⚡ Modal", expanded: false });
      const cfg = { modos: 12 };

      // ANIMACION de los modos. `shared/animateMode.ts` ya existia y solo la
      // usaba el hub (`workspace/main.ts`): las paginas standalone y las
      // plantillas nueva/existente corrian el modal y enseñaban la TABLA, pero
      // no habia forma de VER moverse el modo. Es lo primero que se mira de un
      // modal, y lo que Jorge echaba en falta.
      let animador: ModalAnimator | null = null;
      const estado = { modo: 1, info: "—", freq: "—", periodo: "—", dir: "—" };
      const verAnim = () => {
        if (!animador) return;
        const st = animador.getStatus();
        estado.info = st.state; estado.freq = st.frequency;
        estado.periodo = st.period; estado.dir = st.dominant;
        try { fm.refresh(); } catch { /* el folder puede estar cerrado */ }
      };
      const daAnimador = (): ModalAnimator => {
        if (!animador) {
          animador = createModalAnimator({
            mesh: { nodes, elements, deformOutputs, analyzeOutputs },
            viewerElm,
            onStatusChange: verAnim,
          });
        }
        return animador;
      };
      fm.addBinding(cfg, "modos", { min: 1, max: 60, step: 1, label: "Nº de modos" });
      let panel: { div: HTMLElement; render: Function } | null = null;
      const btnModal = fm.addButton({ title: "▶ Correr modal" });
      btnModal.on("click", async () => {
        const ns = nodes.rawVal || [];
        const es = elements.rawVal || [];
        const ni: any = nodeInputs.rawVal || {};
        const ei: any = elementInputs.rawVal || {};
        if (!ns.length || !es.length) { alert("No hay modelo que analizar."); return; }
        if (!ni.supports?.size) { alert("El modelo no tiene apoyos: sin ellos el modal no tiene sentido."); return; }
        if (!ei.densities?.size) { alert("Las barras no tienen densidad: sin masa no hay modos."); return; }
        if (!panel) { panel = createModalPanel(); document.body.appendChild(panel.div); }
        const titulo = (btnModal as any).title;
        const fin = (t: string) => { try { (btnModal as any).title = t; } catch {} };
        try {
          // Si el ejemplo trae su propio runModal (los edificios filtran losas
          // y lumpean masa como ETABS), se respeta el suyo — va en el hilo
          // principal porque manipula `states`.
          if (typeof (ex as any).runModal === "function") {
            fin("⏳ calculando…");
            await new Promise((r) => setTimeout(r, 30));   // que se pinte el aviso
            (ex as any).runModal(toSIParams(), states, panel);
            fin(titulo);
            return;
          }
          // EN UN WORKER: el modal es sincrono y bloqueaba la pagina entera
          // mientras resolvia (medido: 431 nudos y 12 modos = mas de 30 s con
          // la UI congelada, sin responder ni al raton).
          fin("⏳ calculando…");
          const w = new Worker(new URL("../shared/modal.worker.ts", import.meta.url),
                               { type: "module" });
          const aPares = (o: any) => {
            const out: Record<string, [number, unknown][]> = {};
            for (const [k, v] of Object.entries(o ?? {})) {
              if (v instanceof Map) out[k] = [...v.entries()] as [number, unknown][];
            }
            return out;
          };
          // RESPALDO. El worker evita que la pagina se congele, pero si por lo
          // que sea no contesta —el WASM tiene que cargarse otra vez dentro del
          // worker y puede no arrancar— NO se puede dejar al usuario sin
          // resultado: se resuelve en el hilo principal, como antes. Vale mas
          // una pagina trabada unos segundos que un boton que no hace nada.
          let contesto = false;
          let arranco = false;      // el worker dio señal de vida
          const enElHilo = async (motivo: string) => {
            if (contesto) return;
            contesto = true;
            try { w.terminate(); } catch { /* ya terminado */ }
            console.warn(`[modal] ${motivo}: se resuelve en el hilo principal`);
            fin("⏳ calculando (sin worker)…");
            await new Promise((r) => setTimeout(r, 30));
            try {
              const { modalAnalysis } = await import("hekatan-fem");
              const m = (modalAnalysis as any)(ns, es, ni, ei, cfg.modos);
              panel!.render(m, { title: ex.name, properties: [] } as any);
            try { daAnimador().setResults(m); verAnim(); } catch { /* sin animar */ }
            } catch (e2: any) {
              console.error("[modal]", e2);
              alert(`El modal fallo: ${e2?.message ?? e2}`);
            }
            fin(titulo);
          };
          // NO hay reloj contra el CALCULO, solo contra el ARRANQUE.
          //
          // Antes habia uno de 180 s. Medido con este mismo galpon (609 nudos,
          // 1256 elementos, 12 modos), el modal tarda 3 min 38 s: el reloj
          // saltaba a falta de veinte segundos, mataba al worker que estaba a
          // punto de terminar y rehacia los tres minutos y medio enteros en el
          // hilo principal, con la pagina congelada. Lo peor de las dos cosas.
          //
          // Con la señal de vida ya se distingue lo que hacia falta distinguir:
          // si el worker ARRANCO, esta calculando y se le deja acabar —para eso
          // esta, la pagina sigue viva—; si a los 8 s no ha dado señal, es que
          // el modulo no resolvio y ahi si vale la pena el respaldo.
          const reloj = setTimeout(() => {
            if (!arranco && !contesto) enElHilo("el worker no dio señal de vida en 8 s");
          }, 8000);
          // Y que se vea que avanza: tres minutos con un boton quieto parecen
          // un cuelgue.
          const t0 = Date.now();
          const cronometro = setInterval(() => {
            if (contesto) { clearInterval(cronometro); return; }
            fin(`⏳ calculando… ${Math.round((Date.now() - t0) / 1000)} s`);
          }, 1000);
          w.onmessage = (evt: MessageEvent) => {
            if (contesto) return;
            // SEÑAL DE VIDA. El worker manda `{vivo:true}` nada mas arrancar,
            // ANTES de calcular, para poder distinguir "no arranco" de "esta
            // tardando". Este handler la tomaba como si fuera el resultado:
            // `ok` venia undefined y el modal moria siempre con
            // "El modal fallo: undefined", pasara lo que pasara despues. Por
            // eso el modal "no funcionaba" — y no era el solver, que ni
            // llegaba a devolver nada.
            if (evt.data?.vivo) { arranco = true; return; }
            contesto = true;
            clearTimeout(reloj);
            clearInterval(cronometro);
            const { ok, m, error } = evt.data ?? {};
            fin(titulo);
            w.terminate();
            if (!ok) { console.error("[modal]", error); alert(`El modal fallo: ${error}`); return; }
            panel!.render(m, { title: ex.name, properties: [] } as any);
            try { daAnimador().setResults(m); verAnim(); } catch { /* sin animar */ }
          };
          w.onerror = (err) => {
            clearTimeout(reloj);
            clearInterval(cronometro);
            console.error("[modal worker]", err);
            enElHilo("el worker fallo al arrancar");
          };
          w.postMessage({
            nodes: ns, elements: es,
            nodeInputs: aPares(ni), elementInputs: aPares(ei),
            nModes: cfg.modos,
          });
        } catch (err: any) {
          fin(titulo);
          console.error("[modal]", err);
          alert(`El modal fallo: ${err?.message ?? err}`);
        }
      });

      // ── ver el modo: estatico, animado, y por que modo ──
      fm.addBinding(estado, "modo", {
        min: 1, max: 60, step: 1, label: "Modo a ver",
      }).on("change", (ev: any) => {
        if (!animador || animador.modeCount() === 0) return;
        const i = Math.min(Math.max(1, Math.round(ev.value)), animador.modeCount()) - 1;
        // Si esta animando, cambia el modo sin parar; si no, lo deja congelado
        // como hace ETABS al elegir un Mode en el selector de resultados.
        if (animador.isPlaying()) animador.setMode(i);
        else animador.showStatic(i);
        verAnim();
      });
      const btnAnim = fm.addButton({ title: "▶ Animar modo" });
      btnAnim.on("click", () => {
        const a = daAnimador();
        if (a.modeCount() === 0) {
          alert("Primero hay que correr el modal: no hay modos que animar.");
          return;
        }
        if (a.isPlaying()) {
          a.stop();
          try { (btnAnim as any).title = "▶ Animar modo"; } catch {}
        } else {
          a.setMode(Math.min(Math.max(1, estado.modo), a.modeCount()) - 1);
          a.play();
          try { (btnAnim as any).title = "⏹ Parar animacion"; } catch {}
        }
        verAnim();
      });
      // Lo que esta pasando, en texto: sin esto la animacion se ve pero no se
      // sabe QUE modo es ni a que frecuencia.
      fm.addBinding(estado, "freq", { readonly: true, label: "Frecuencia" });
      fm.addBinding(estado, "periodo", { readonly: true, label: "Periodo" });
      fm.addBinding(estado, "dir", { readonly: true, label: "Direccion" });
      fm.addBinding(estado, "info", { readonly: true, label: "Estado" });
    }
  } catch (e: any) { console.warn("[modal] no se pudo montar:", e?.message ?? e); }

  // ── 🔧 DESIGN ────────────────────────────────────────────────────────
  // Primer ladrillo del modulo de diseno. Hoy comprueba SERVICIO —la flecha
  // contra L/360, L/240 y L/180, y la esbeltez L/d de cada barra—, que es
  // justo lo que destapo que el entrepiso del galpon no cumplia: bajaba
  // 237.8 mm con una I de 25 cm, NUEVE veces el limite.
  // Lo que NO hace todavia y hay que decirlo: resistencia AISC 360 (P-M,
  // pandeo, cortante) y composite beam. Eso es el siguiente paso.
  try {
    const paneAny = folderAnalisis();
    if (paneAny?.addFolder) {
      const fd = paneAny.addFolder({ title: "🔧 Design", expanded: false });
      const cfgD = { limite: 360 };
      fd.addBinding(cfgD, "limite", {
        options: { "L/360 (entrepiso)": 360, "L/240": 240, "L/180 (cubierta)": 180 },
        label: "Límite de flecha",
      });
      fd.addButton({ title: "▶ Comprobar servicio" }).on("click", () => {
        const ns = nodes.rawVal || [];
        const es = elements.rawVal || [];
        const df: any = deformOutputs.rawVal || {};
        const defs = df.deformations;
        if (!defs || !defs.size) { alert("Primero hay que resolver el modelo."); return; }
        // LA FLECHA SE MIDE POR VANO, RELATIVA A SU CUERDA.
        //
        // Barra a barra no vale: un tramo de 0.51 m en una zona que baja 15 mm
        // salia con "ratio 10.52, NO CUMPLE" cuando su flecha propia es casi
        // cero. Lo que limita la norma es cuanto se separa el centro del vano
        // de la RECTA que une sus apoyos.
        //
        // Un vano es una cadena de barras colineales; se corta donde llega
        // otra barra que no sigue la misma direccion (una columna, una viga
        // transversal), que es donde de verdad esta apoyada.
        const filas: string[] = [];
        const dirDe = (e: any) => {
          const a = ns[e[0]], b = ns[e[1]];
          const L = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
          return L < 1e-9 ? null : [(b[0] - a[0]) / L, (b[1] - a[1]) / L, (b[2] - a[2]) / L];
        };
        const enNudo = new Map<number, number[]>();
        es.forEach((e: any, i: number) => {
          if (!e || e.length !== 2) return;
          for (const n of e) {
            if (!enNudo.has(n)) enNudo.set(n, []);
            enNudo.get(n)!.push(i);
          }
        });
        const visto = new Set<number>();
        let peor: any = null;
        for (let i = 0; i < es.length; i++) {
          const e: any = es[i];
          if (!e || e.length !== 2 || visto.has(i)) continue;
          const d0 = dirDe(e);
          if (!d0) continue;
          // crecer la cadena por los dos extremos mientras siga recta
          const cadena = [i]; visto.add(i);
          const extremos = [e[0], e[1]];
          for (let lado = 0; lado < 2; lado++) {
            let n = extremos[lado];
            for (;;) {
              const sig = (enNudo.get(n) || []).filter((j) => !visto.has(j))
                .find((j) => {
                  const dj = dirDe(es[j]);
                  if (!dj) return false;
                  const dot = Math.abs(dj[0] * d0[0] + dj[1] * d0[1] + dj[2] * d0[2]);
                  return dot > 0.999;                 // colineal
                });
              if (sig === undefined) break;
              visto.add(sig); cadena.push(sig);
              const ej: any = es[sig];
              n = ej[0] === n ? ej[1] : ej[0];
              extremos[lado] = n;
            }
          }
          const A = ns[extremos[0]], B = ns[extremos[1]];
          const L = Math.hypot(B[0] - A[0], B[1] - A[1], B[2] - A[2]);
          if (L < 1.0) continue;
          const uA = (defs.get(extremos[0]) || [0, 0, 0])[2];
          const uB = (defs.get(extremos[1]) || [0, 0, 0])[2];
          // el nudo del vano que mas se separa de la cuerda A-B
          let f = 0;
          for (const j of cadena) {
            for (const n of es[j] as any) {
              const P = ns[n];
              const t = L < 1e-9 ? 0 : (
                (P[0] - A[0]) * (B[0] - A[0]) + (P[1] - A[1]) * (B[1] - A[1])
                + (P[2] - A[2]) * (B[2] - A[2])) / (L * L);
              const uCuerda = uA + (uB - uA) * t;
              const rel = Math.abs(((defs.get(n) || [0, 0, 0])[2]) - uCuerda) * 1000;
              if (rel > f) f = rel;
            }
          }
          const lim = L / cfgD.limite * 1000;
          const r = f / lim;
          if (!peor || r > peor.r) peor = { i, L, f, lim, r };
        }
        if (!peor) { alert("No hay barras con luz suficiente que comprobar."); return; }
        const ok = peor.r <= 1;
        filas.push(`Límite: L/${cfgD.limite}`);
        filas.push(`Barra más solicitada: luz ${peor.L.toFixed(2)} m`);
        filas.push(`   flecha ${peor.f.toFixed(1)} mm  ·  límite ${peor.lim.toFixed(1)} mm`);
        filas.push(`   ratio ${peor.r.toFixed(2)}  ->  ${ok ? "CUMPLE" : "NO CUMPLE"}`);
        filas.push("");
        filas.push("Falta: resistencia AISC 360 (P-M, pandeo, cortante)");
        filas.push("y composite beam. Esto comprueba SERVICIO.");
        alert(filas.join("\n"));
      });
    }
  } catch (e: any) { console.warn("[design] no se pudo montar:", e?.message ?? e); }

  // ── CLIC DERECHO: menu tipo «Assign» de ETABS ────────────────────────
  // Jorge: *"cuando presione clic derecho debe salir Design"*. El workspace de
  // ejemplos ya tenia un menu asi; las plantillas no tenian ninguno.
  try {
    const rend = viewerElm as HTMLElement;
    const MENU: Array<[string, string]> = [
      ["Design ▸ Steel Frame Design", "Design"],
      ["Design ▸ Composite Beam Design", "Design"],
      ["", ""],
      ["Assign ▸ Frame ▸ Section Property", "Ver"],
      ["Assign ▸ Frame ▸ Local Axes", "Ver"],
      ["Display ▸ Frame Forces", "Analyze"],
      ["Display ▸ Shell Forces", "Analyze"],
      ["", ""],
      ["Analyze ▸ Run Modal", "Modal"],
      ["Analyze ▸ Tablas", "Analyze"],
    ];
    const menu = document.createElement("div");
    menu.style.cssText = [
      "position:fixed", "display:none", "z-index:9500", "min-width:230px",
      "background:#232a35", "border:1px solid #3a4150", "border-radius:6px",
      "padding:4px 0", "color:#cfd6e0",
      "font:12px ui-monospace,Consolas,monospace",
      "box-shadow:0 8px 28px rgba(0,0,0,.45)",
    ].join(";");
    document.body.appendChild(menu);
    const cerrar = () => { menu.style.display = "none"; };
    window.addEventListener("click", cerrar);
    window.addEventListener("blur", cerrar);

    /** Abre el folder del panel cuyo titulo contenga `txt`. */
    const abrir = (txt: string): boolean => {
      const rec = (p: any): boolean => {
        for (const c of (p?.children ?? [])) {
          if (typeof c.title === "string" && c.children) {
            if (c.title.toLowerCase().includes(txt.toLowerCase())) {
              try { c.expanded = true; } catch { /* no-op */ }
              try { (c as any).element?.scrollIntoView?.({ block: "nearest" }); } catch {}
              return true;
            }
            if (rec(c)) return true;
          }
        }
        return false;
      };
      return rec(currentPaneRef);
    };

    // Si estaba orbitando con el boton derecho, no molestar con el menu.
    let xD = 0, yD = 0, tD = 0;
    rend.addEventListener("pointerdown", (e: PointerEvent) => {
      if (e.button === 2) { xD = e.clientX; yD = e.clientY; tD = Date.now(); }
    }, true);
    rend.addEventListener("contextmenu", (ev: MouseEvent) => {
      ev.preventDefault();
      if (Math.hypot(ev.clientX - xD, ev.clientY - yD) > 5 || Date.now() - tD > 400) return;
      ev.stopPropagation();
      menu.innerHTML = "";
      const cab = document.createElement("div");
      cab.textContent = (nodes.rawVal || []).length
        ? `${(nodes.rawVal || []).length} nudos · ${(elements.rawVal || []).length} elementos`
        : "sin modelo";
      cab.style.cssText = "padding:5px 12px;color:#8a94a6;font-size:11px;"
                        + "border-bottom:1px solid #3a4150;margin-bottom:3px";
      menu.appendChild(cab);
      for (const [texto, destino] of MENU) {
        if (!texto) {
          const hr = document.createElement("div");
          hr.style.cssText = "height:1px;background:#3a4150;margin:4px 0";
          menu.appendChild(hr);
          continue;
        }
        const it = document.createElement("div");
        it.textContent = texto;
        it.style.cssText = "padding:5px 12px;cursor:pointer;white-space:nowrap";
        it.onmouseenter = () => { it.style.background = "#2f3742"; };
        it.onmouseleave = () => { it.style.background = "transparent"; };
        it.onclick = (e) => {
          e.stopPropagation();
          cerrar();
          if (!abrir(destino)) {
            console.warn("[menu] no hay carpeta:", destino);
            alert(`«${texto}» todavía no está: falta la carpeta "${destino}".`);
          }
        };
        menu.appendChild(it);
      }
      menu.style.left = Math.min(ev.clientX, window.innerWidth - 250) + "px";
      menu.style.top = Math.min(ev.clientY, window.innerHeight - 320) + "px";
      menu.style.display = "block";
    });
    console.log("[menu] clic derecho sobre el modelo -> Design / Assign / Analyze");
  } catch (e: any) { console.warn("[menu] no se pudo montar:", e?.message ?? e); }

  // ── ENCUADRAR EL MODELO ──────────────────────────────────────────────
  // `rebuild()` construye la geometria pero NADIE movia la camara: el
  // workspace tiene su `autoFitCamera()` y aqui no habia equivalente. Con un
  // ejemplo chico no se notaba (cabe en la grilla de 10 m), pero un modelo
  // importado de verdad -el galpon son 26.63 x 14.74- quedaba FUERA del
  // encuadre: el panel lo contaba bien (412 nudos, 726 elementos) y en
  // pantalla solo se veia la grilla vacia.
  const encuadrar = () => {
    const ctx = (viewerElm as any).__ctx;
    const ns = nodes.rawVal || [];
    if (!ctx || !ns.length) return;
    let mnX = Infinity, mnY = Infinity, mnZ = Infinity;
    let mxX = -Infinity, mxY = -Infinity, mxZ = -Infinity;
    for (const n of ns) {
      if (!isFinite(n[0]) || !isFinite(n[1]) || !isFinite(n[2])) continue;
      if (n[0] < mnX) mnX = n[0]; if (n[0] > mxX) mxX = n[0];
      if (n[1] < mnY) mnY = n[1]; if (n[1] > mxY) mxY = n[1];
      if (n[2] < mnZ) mnZ = n[2]; if (n[2] > mxZ) mxZ = n[2];
    }
    if (!isFinite(mnX)) return;
    const cx = (mnX + mxX) / 2, cy = (mnY + mxY) / 2, cz = (mnZ + mxZ) / 2;
    const d = Math.hypot(mxX - mnX, mxY - mnY, mxZ - mnZ) || 10;
    // la grilla, al menos tan grande como el modelo (10 m por defecto se queda
    // corta para cualquier edificio)
    try {
      const s = (viewerElm as any).__settings;
      if (s?.gridSize) s.gridSize.val = Math.max(10, Math.ceil(d));
    } catch { /* no-op */ }
    const { camera, controls, render } = ctx;
    // El TARGET va primero: OrbitControls recalcula la orientacion en su
    // update() a partir de el, asi que un lookAt() puesto antes se pierde.
    if (controls?.target) controls.target.set(cx, cy, cz);
    // 1.4 x la diagonal: con 0.9 el modelo entraba pero recortado por arriba.
    const k = d * 1.4;
    camera.position.set(cx + k * 0.8, cy - k * 0.8, cz + k * 0.6);  // isometrica
    camera.up?.set?.(0, 0, 1);          // Z arriba, como todo el visor
    camera.lookAt?.(cx, cy, cz);
    camera.updateProjectionMatrix?.();
    controls?.update?.();
    render?.();
  };
  // tras un frame: el viewer necesita haber montado su escena
  requestAnimationFrame(() => requestAnimationFrame(encuadrar));
}
