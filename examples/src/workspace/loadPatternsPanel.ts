/**
 * Panel Tweakpane "📋 Load Patterns" + "📊 Load Cases" — estilo ETABS.
 *
 * Render dos folders editables en el pane principal:
 *   - Cada pattern es un sub-folder con: type (dropdown), selfWeightMultiplier
 *     (slider 0..2), autoLateralLoad (dropdown), botón Delete
 *   - Botón "+ Add New Pattern" al final
 *   - Idéntica estructura para cases (con type-specific fields)
 *
 * Los cambios se persisten en localStorage (key: `hk_loadPatterns_${exampleId}`)
 * y se reflejan en `states.loadPatterns` / `states.loadCases` para que los
 * ejemplos puedan leerlos en `build()`.
 */
import type { State } from "vanjs-core";
import type {
  LoadPattern, LoadPatternType, LoadCase, LoadCaseType,
  LoadCombination,
} from "hekatan-fem";
import { generateNecSeCgCombos, mergeCombos } from "../shared/necCombos";

type Pane = any; // Tweakpane Pane type (evita import circular)

const STORAGE_PREFIX = "hk_loadPatterns_v1";

const PATTERN_TYPES: Record<string, string> = {
  "Dead": "Dead", "Live": "Live", "Live (Roof)": "Live (Roof)",
  "Wind": "Wind", "Seismic": "Seismic", "Snow": "Snow",
  "Rain": "Rain", "Temperature": "Temperature", "Other": "Other",
};

const CASE_TYPES: Record<string, string> = {
  "Linear Static": "Linear Static",
  "Modal - Eigen": "Modal - Eigen",
  "Modal - Ritz": "Modal - Ritz",
  "Response Spectrum": "Response Spectrum",
  "Time History - Linear": "Time History - Linear",
  "Time History - Nonlinear": "Time History - Nonlinear",
  "Nonlinear Static (Pushover)": "Nonlinear Static (Pushover)",
  "Buckling": "Buckling",
};

const AUTO_LAT_OPTIONS: Record<string, string> = {
  "None": "None",
  "ASCE 7-22": "ASCE 7-22",
  "NSR-10": "NSR-10",
  "NEC-SE-DS": "NEC-SE-DS",
};

const INIT_COND: Record<string, string> = {
  "Zero": "Zero", "Preset": "Preset",
};

/**
 * Persistir patterns + cases + combos a localStorage por exampleId.
 */
export function persistLoadPatterns(
  exampleId: string,
  patterns: LoadPattern[],
  cases: LoadCase[],
  combinations: LoadCombination[],
): void {
  try {
    const key = `${STORAGE_PREFIX}_${exampleId}`;
    localStorage.setItem(key, JSON.stringify({ patterns, cases, combinations }));
  } catch {}
}

/**
 * Restaurar de localStorage. Devuelve null si no hay nada guardado.
 */
export function loadPersistedLoadPatterns(exampleId: string): {
  patterns: LoadPattern[];
  cases: LoadCase[];
  combinations: LoadCombination[];
} | null {
  try {
    const key = `${STORAGE_PREFIX}_${exampleId}`;
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data.patterns || !data.cases) return null;
    return {
      patterns: data.patterns,
      cases: data.cases,
      combinations: data.combinations ?? [],
    };
  } catch { return null; }
}

/**
 * Renderiza los folders "📋 Load Patterns" + "📊 Load Cases" en el `pane`
 * dado. Retorna las funciones de refresh para que el caller pueda actualizar
 * tras cambios externos.
 */
export function attachLoadPatternsPanel(opts: {
  pane: Pane;
  exampleId: string;
  loadPatterns: State<LoadPattern[]>;
  loadCases: State<LoadCase[]>;
  loadCombinations: State<LoadCombination[]>;
  activeLoadCase: State<string>;
  onChange?: () => void;  // callback tras cualquier cambio (re-build, persist)
}): { rebuildPatterns: () => void; rebuildCases: () => void; rebuildCombos: () => void } {
  const { pane, exampleId, loadPatterns, loadCases, loadCombinations, activeLoadCase, onChange } = opts;

  const persist = () => {
    persistLoadPatterns(exampleId, loadPatterns.val, loadCases.val, loadCombinations.val);
    onChange?.();
  };

  // ════════════════════════════════════════════════════════════════════
  // PATTERNS FOLDER
  // ════════════════════════════════════════════════════════════════════
  const patternsFolder = pane.addFolder({ title: "📋 Patrones de carga", expanded: false });
  // La sobrecarga muerta es CARGA (entrada del análisis), no diseño: su asistente vive aquí
  // (Jorge, 19-sep-2026). Abre el panel de sobrecargaMuertaPanel.ts (botón oculto #hk-dne-btn).
  patternsFolder.addButton({ title: "🧱 Sobrecarga muerta DNE (NEC-15)…" })
    .on("click", () => (document.getElementById("hk-dne-btn") as HTMLButtonElement | null)?.click());

  // Cada pattern como sub-folder
  const patternSubfolders: any[] = [];
  const rebuildPatterns = () => {
    patternSubfolders.forEach(f => { try { f.dispose(); } catch {} });
    patternSubfolders.length = 0;
    // Limpiar también el botón Add (lo recreamos al final)
    try {
      (patternsFolder.children ?? []).slice().forEach((c: any) => {
        if (c.element?.classList?.contains("hk-pattern-add")) try { c.dispose(); } catch {}
      });
    } catch {}

    loadPatterns.val.forEach((pat, idx) => {
      const sub = patternsFolder.addFolder({
        title: `▸ ${pat.name} (${pat.type})  SW=${pat.selfWeightMultiplier}`,
        expanded: false,
      });
      patternSubfolders.push(sub);
      // Name (string)
      sub.addBinding(pat, "name", { label: "Nombre" }).on("change", () => {
        sub.title = `▸ ${pat.name} (${pat.type})  SW=${pat.selfWeightMultiplier}`;
        persist();
      });
      // Type (dropdown)
      sub.addBinding(pat, "type", { label: "Tipo", options: PATTERN_TYPES }).on("change", () => {
        sub.title = `▸ ${pat.name} (${pat.type})  SW=${pat.selfWeightMultiplier}`;
        persist();
      });
      // Self Weight Multiplier
      sub.addBinding(pat, "selfWeightMultiplier", {
        label: "Factor de peso propio", min: 0, max: 2, step: 0.05,
      }).on("change", () => {
        sub.title = `▸ ${pat.name} (${pat.type})  SW=${pat.selfWeightMultiplier}`;
        persist();
      });
      // Auto Lateral Load
      pat.autoLateralLoad ??= "None";
      sub.addBinding(pat, "autoLateralLoad", {
        label: "Carga lateral automática", options: AUTO_LAT_OPTIONS,
      }).on("change", () => persist());
      // Delete
      sub.addButton({ title: "🗑 Borrar patrón" }).on("click", () => {
        loadPatterns.val = loadPatterns.val.filter((_, i) => i !== idx);
        rebuildPatterns();
        rebuildCases();    // cases pueden referenciar este pattern
        rebuildCombos();
        persist();
      });
    });

    // Add new
    const addBtn = patternsFolder.addButton({ title: "+ Patrón nuevo" });
    try { addBtn.element?.classList?.add("hk-pattern-add"); } catch {}
    addBtn.on("click", () => {
      const newName = `Pattern${loadPatterns.val.length + 1}`;
      loadPatterns.val = [...loadPatterns.val, {
        name: newName, type: "Other", selfWeightMultiplier: 0, autoLateralLoad: "None",
      }];
      rebuildPatterns();
      persist();
    });
  };

  // ════════════════════════════════════════════════════════════════════
  // CASES FOLDER
  // ════════════════════════════════════════════════════════════════════
  const casesFolder = pane.addFolder({ title: "📊 Casos de carga", expanded: false });

  const caseSubfolders: any[] = [];
  const rebuildCases = () => {
    caseSubfolders.forEach(f => { try { f.dispose(); } catch {} });
    caseSubfolders.length = 0;
    try {
      (casesFolder.children ?? []).slice().forEach((c: any) => {
        if (c.element?.classList?.contains("hk-case-add") ||
            c.element?.classList?.contains("hk-case-active")) try { c.dispose(); } catch {}
      });
    } catch {}

    // NOTA: el selector de "Caso activo" (qué resultado VISUALIZAR) vive SOLO en el panel
    // Settings ("Case results"). Acá el pane derecho solo DEFINE los cases (no selecciona el
    // activo) — separación: derecho = definiciones, izquierdo (Settings) = visualización.

    loadCases.val.forEach((cs, idx) => {
      const patternsTxt = (cs.patterns ?? []).map(p => `${p.pattern}×${p.scaleFactor}`).join(", ") || "(none)";
      const sub = casesFolder.addFolder({
        title: `▸ ${cs.name} (${cs.type})`,
        expanded: false,
      });
      caseSubfolders.push(sub);
      // Name
      sub.addBinding(cs, "name", { label: "Nombre" }).on("change", () => {
        sub.title = `▸ ${cs.name} (${cs.type})`;
        rebuildCases();   // refresh active selector
        rebuildCombos();
        persist();
      });
      // Type
      sub.addBinding(cs, "type", { label: "Tipo", options: CASE_TYPES }).on("change", () => {
        sub.title = `▸ ${cs.name} (${cs.type})`;
        persist();
      });
      // Initial Condition
      cs.initialCondition ??= "Zero";
      sub.addBinding(cs, "initialCondition", {
        label: "Condición inicial", options: INIT_COND,
      }).on("change", () => persist());
      // Patterns aplicados (texto info por ahora)
      cs.patterns ??= [];
      const patternsInfo = { value: patternsTxt };
      sub.addBinding(patternsInfo, "value", { label: "Patrones", readonly: true });
      // maxModes (solo si Modal)
      if (cs.type.startsWith("Modal")) {
        cs.maxModes ??= 12;
        sub.addBinding(cs, "maxModes", {
          label: "Modos máx.", min: 1, max: 50, step: 1,
        }).on("change", () => persist());
      }
      // Delete
      sub.addButton({ title: "🗑 Borrar caso" }).on("click", () => {
        loadCases.val = loadCases.val.filter((_, i) => i !== idx);
        if (activeLoadCase.val === cs.name) {
          activeLoadCase.val = loadCases.val[0]?.name ?? "";
        }
        rebuildCases();
        rebuildCombos();
        persist();
      });
    });

    // Add new
    const addBtn = casesFolder.addButton({ title: "+ Caso nuevo" });
    try { addBtn.element?.classList?.add("hk-case-add"); } catch {}
    addBtn.on("click", () => {
      const newName = `Case${loadCases.val.length + 1}`;
      const firstPattern = loadPatterns.val[0]?.name;
      loadCases.val = [...loadCases.val, {
        name: newName, type: "Linear Static",
        patterns: firstPattern ? [{ pattern: firstPattern, scaleFactor: 1 }] : [],
        initialCondition: "Zero",
      }];
      rebuildCases();
      persist();
    });
  };

  // ════════════════════════════════════════════════════════════════════
  // COMBINATIONS FOLDER
  // ════════════════════════════════════════════════════════════════════
  const combosFolder = pane.addFolder({ title: "Σ Combinaciones", expanded: false });

  const comboSubfolders: any[] = [];
  const rebuildCombos = () => {
    comboSubfolders.forEach(f => { try { f.dispose(); } catch {} });
    comboSubfolders.length = 0;
    try {
      (combosFolder.children ?? []).slice().forEach((c: any) => {
        if (c.element?.classList?.contains("hk-combo-add")) try { c.dispose(); } catch {}
      });
    } catch {}

    loadCombinations.val.forEach((cm, idx) => {
      const txt = cm.cases.map(c => `${c.scaleFactor}·${c.case}`).join(" + ");
      const sub = combosFolder.addFolder({ title: `▸ ${cm.name}: ${txt}`, expanded: false });
      comboSubfolders.push(sub);
      sub.addBinding(cm, "name", { label: "Nombre" }).on("change", () => {
        const t = cm.cases.map(c => `${c.scaleFactor}·${c.case}`).join(" + ");
        sub.title = `▸ ${cm.name}: ${t}`;
        persist();
      });
      const txtInfo = { value: txt };
      sub.addBinding(txtInfo, "value", { label: "Fórmula", readonly: true });
      sub.addButton({ title: "🗑 Borrar combinación" }).on("click", () => {
        loadCombinations.val = loadCombinations.val.filter((_, i) => i !== idx);
        rebuildCombos();
        persist();
      });
    });
    const addBtn = combosFolder.addButton({ title: "+ Combinación nueva" });
    try { addBtn.element?.classList?.add("hk-combo-add"); } catch {}
    addBtn.on("click", () => {
      const firstCase = loadCases.val[0]?.name ?? "Dead";
      loadCombinations.val = [...loadCombinations.val, {
        name: `Combo${loadCombinations.val.length + 1}`,
        type: "Linear Add",
        cases: [{ case: firstCase, scaleFactor: 1.0 }],
      }];
      rebuildCombos();
      persist();
    });

    // ── OPCIONAL: generar combinaciones NEC-SE-CG (Módulo 2) ──
    const necBtn = combosFolder.addButton({ title: "⚡ Generar NEC-SE-CG" });
    try { necBtn.element?.classList?.add("hk-combo-add"); } catch {}
    necBtn.on("click", () => {
      const gen = generateNecSeCgCombos(loadCases.val, loadPatterns.val);
      if (gen.length === 0) {
        try { necBtn.title = "⚠️ Define cases (D, L, E...) primero"; setTimeout(() => { necBtn.title = "⚡ Generar NEC-SE-CG"; }, 2500); } catch {}
        return;
      }
      loadCombinations.val = mergeCombos(loadCombinations.val, gen);
      rebuildCombos();
      persist();
    });
  };

  // Render inicial
  rebuildPatterns();
  rebuildCases();
  rebuildCombos();

  return { rebuildPatterns, rebuildCases, rebuildCombos };
}
