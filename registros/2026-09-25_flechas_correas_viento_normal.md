# 25-sep-2026 — Flechas de correas + viento ⟂ zinc (dirección con ángulo)

## Pedido de Jorge
1. «Las cargas no tiene repartido en todas las correas» (capturas 013302/013630/013941).
2. «¿La dirección con ángulo de las cargas estás considerando? si no arréglalo y deployalo»
   → aclarado: «todas las cargas están en sentido de la gravedad, pero es un galpón curvo,
   el viento va perpendicular al zinc».

## ✅ Funcionó
- **Causa del bug de correas**: `hekatan-ui/src/viewer/objects/loads.ts` submuestreaba con
  `MAX_FLECHAS=240` → Cancha: 582 nudos cargados → solo 160 flechas (27%), 96/186 correas.
- **Arreglo**: `SUBMUESTREA_DESDE = 700` (una flecha por nudo hasta 700; grid solo >700,
  la losa 5476 no regresa). Test `cli/ctl_cargas_correas.mjs` → **582/582 flechas,
  186/186 correas OK** (PNG cli/shots/cargas_correas/cargas_correas.png revisado ✓).
- Diagnóstico dirección/ángulo (probe `_p_direcciones.mjs`): Cancha = 558 filas
  `Dir=Gravity CoordSys=GLOBAL` (todas verticales, incl. VIENTO −0.3599 kN/m uniforme).
  Ejes locales/CoordSys girado NO aparecen en ningún archivo real de Jorge
  (LINELOAD: 4964×GRAV; CoordSys≠GLOBAL solo en SECTION DESIGNER).
- `cargaBarraConsistente` ya resuelve CUALQUIER dirección exacto en barras inclinadas
  (fuerzas + momentos de empotramiento; verificado a mano con t×w).
- Huecos de parser anotados (no afectan a Cancha): e2k `LINELOAD DIR 1/2/3` perdido
  (e2kParser:1134 avisa), s2k `CoordSys≠GLOBAL` descartado (s2kParser:315),
  s2k área `Local Dir=1/2` descartado (s2kParser:343).
- Disco lleno (ENOSPC) → liberado ~5 GB (temporales, shots >7d, npm cache, git gc).
  ⚠️ Los shots borrados están trackeados → `git status` muestra `deleted:` — NO hacer
  `git add -A`; stagiar solo archivos propios (o `git checkout -- cli/shots`).

## ✅ Funcionó — viento ⟂ zinc (implementado 25-sep)
- **Convención s2k confirmada**: `Dir=Gravity FOverLA` positivo = hacia ABAJO; Hekatan
  aplica `fa × [0,0,−1]` → correcto (ΣFz viejo −1352.591 = 865.935 barras + 486.656 peso).
- **`DesignType=Wind` solo en los 2 Cancha** (galpon-bodega, _integ, hekatan-school,
  validation, tests → ninguno) → la rotación es acotada, cero regresión para otros modelos.
- **Implementación en `examples/src/shared/s2kParser.ts`**:
  - `CargasTabla`: filas de barras con `pat?: string`; nuevo `windPats?: Set<string>`.
  - `LOAD PATTERN DEFINITIONS` → `/wind/i.test(DesignType)` ⇒ `windPats.add(LoadPat)`.
  - `FRAME LOADS` ⇒ guarda `LoadPat` de cada fila.
  - `buildModel` (bloque "VIENTO perpendicular al zinc (Jorge, 25-sep-2026)"): por plano
    de Y → cadena de posiciones (x,z) ordenada → tangente por diferencia central →
    `normal = eje × tangente` → signo hacia el interior (centroide) → promedio de
    extremos → muta `c.dir`; fallback = Gravedad si la geometría degenera.
- **Geometría** (`_p_normal_zinc.mjs`): arcos en 7 planos Y=0,6,…,36, 66 nodos; arco
  (0,7.1)→corona (13.75,12.1)→(27.5,7.1); 186 correas × 3 patrones.
  Normal: 0° en corona → 41.8° al alero (media 22.5°); 186/186.
- **Numérico** (`_p_viento_normal.mjs`, PASS): 186/186 filas Wind rotadas;
  ΣF = (−222.862, 0, −1332.686) kN — ΣFx antes era 0; ΣFy = 0 (simetría ✓);
  210 nudos con componente X.
- **Test e2e** `cli/ctl_cargas_correas.mjs` **actualizado y PASS local**: 792 flechas
  (582 vertical + 210 X), 186/186 correas, 0 pageerrors, PNG revisado ✓.
- **Regresión `npm test` (con stash ↔ sin stash)**: ok **666 = 666** en AMBAS corridas
  → mis cambios no rompen ninguna comprobación. Los 36 fallos restantes son
  PREEXISTENTES: 17 `import.meta.env.DEV` (bundle de tests, ya con el fix de
  `tests/lib/bundle.mjs` de la otra sesión), cimentación Σcarga, paridad Python,
  navier, automesh/ transfinito, etc. — idénticos en baseline.
  `animacion-modal` (3) falla IGUAL con mis 2 archivos stasheados + bundle fresco
  → preexistente (no toca loads.ts/s2kParser.ts).
- `build:deploy` ✓ 34.7s con los 2 cambios.

## ⏳ Falta
- Commit fuente (solo archivos propios) → push rama → deploy gh-pages →
  verificar en el SITIO PÚBLICO (`node cli/ctl_cargas_correas.mjs publico`) → avisar a Jorge.
- Huecos anotados sin implementar (no afectan a Cancha): e2k `LINELOAD DIR 1/2/3`,
  `CoordSys≠GLOBAL`, área `Local Dir=1/2`, viento en e2k/area-loads.
