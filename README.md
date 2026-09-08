# Hekatan Struct Lineal

**Structural FEM analysis platform that runs entirely in the browser.** No installation, no server — C++/Eigen solver compiled to WebAssembly, Three.js 3D visualization, reactive UI with VanJS + Tweakpane.

Hekatan Struct Lineal started as a fork of [awatif v2.0.0](https://github.com/madil4/awatif/tree/v2.0.0) by Mohamed Adil (thanks for the original UI framework and viewer, ~10% of the current codebase). Everything else — modal analysis, Winkler springs, native Q4 plane-stress solver, unified Tweakpane workspace, 25+ parametric examples, reactive unit system, modal animation, foundation workflows, CSI membrane, draggable panes, and more — was added for this project.

🌐 **Live:** [https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/)

## Validation status

Every number below is measured against **another program** — same model, same
mesh node by node, rigid offsets zeroed — never against a hand calculation.
Full detail in [`ESTADO_VS_ETABS.md`](./ESTADO_VS_ETABS.md).

| layer | arbiter | closure | |
|---|---|---|---|
| **Frames** (1 → n DOF) | closed-form solution | **0.063 %** worst of 6 steps | ✅ |
| **Frames** — full warehouse, 378 nodes | ETABS 22 | **0.000 %** on all 378 | ✅ |
| **Frames + deck** — warehouse, 609 nodes, same mesh by OAPI | SAP2000 24 · ETABS 22 (`--noedge`) | **0.001 %** on all nodes with stiffness | ✅ |
| **Modal** (Paz & Leigh 6.3) | ETABS 22 | **0.00 %** on 6 modes, subspace path | ✅ |
| **Shell-Thin** (Kirchhoff) | ETABS 22, 3 load steps | **0.93 %** worst | ✅ |
| **Shell-Membrane** (CSI drilling, `drillingTypes = 12`) | ETABS 22, measured 12×12 cell, 9 geometries | **1e-13 %** | ✅ |
| **Shell-Thick** (CSI formulation read from `CsiGo2.dll`) | ETABS/SAP2000, ~140 measured cells | **1e-12 %** on K · plate 8×8 = ETABS to 7 digits | ✅ [how](#the-plate-element-identifying-csis-shell-thick-2026-09-01) |
| **Deck / membrane floors** — ETABS semantics (`deck etabs [oneway]`) | ETABS 22 by OAPI and e2k | **0.0000 %** (two-way) · **0.0010 %** (one-way) | ✅ [table](#etabs--sap2000--safe--hekatan-struct-lineal-side-by-side) |
| **Deck / membrane floors** — no directive (= SAP2000 semantics) | SAP2000 24 by OAPI | **1e-13 %** | ✅ |
| **Self weight** (Dead, consistent nodal vector) | SAP2000 24 own weight · ETABS 22 own weight | **0.0000 %** · **0.0000 %** (with `deck etabs`) | ✅ |
| **E2K export** → ETABS 22 | round-trip re-import | **0.000 %** — 372/378 nodes | ✅ |
| **E2K areas round-trip** | Hekatan → ETABS → Hekatan | **58/58** examples keep their shells | ✅ |
| **S2K export** → SAP2000 24 | round-trip re-import | **0.000 %** — 378/378 nodes | ✅ |
| **F2K export** → SAFE 20 | real foundation (9 footings + pedestals + tie beams, 225 nodal springs) read from the `.f2k` | **1.5e-3 %** (SAFE prints U to 0.0005 mm); same `.heks` → `.s2k` SAP2000 1.2e-8 %, `.e2k` ETABS 1.4e-8 % | ✅ closed 2026-09-05 |
| **Assembled mass** | ETABS `AssembledJointMass` | **0.002 %** | ✅ |
| **Building with shear walls** (6 storeys, slab, walls in X / in X+Y; 3333 / 3981 nodes) — same mesh by OAPI and by file | SAP2000 24 (`comparar=0`) · ETABS 22 (`comparar=1`, ETABS beam–wall joint) | **0.0000 %** on every node, both programs; 6 periods identical to 4 decimals vs SAP2000, ≤ 0.6 % vs ETABS with its lateral-mass rule | ✅ closed 2026-09-08 |
| **E2K diaphragm** — `DIAPH "D1"` now follows Hekatan's diaphragm map (it used to sit on every 0.5 m column segment and on every slab area) | ETABS 22 by e2k vs by OAPI | **0.0000 %** (was 1.3–15.9 % stiffer) · 8 templates re-run: statics 0.000 %, modes 1–3 0.00 % | ✅ 2026-09-08 |
| **Area springs (Winkler, SSI)** | SAP2000 24 · ETABS 22, area spring vs nodal springs lumped by tributary area | **0.0000 %** in both → same as Hekatan `spring`; only SAFE uses the consistent matrix (−1.9 %) | ✅ 2026-09-08 |
| **Edge constraint** | ETABS 22, hanging joint on a shell edge, analysis model read via `PointElm` | by default ETABS *meshes through the joint* (ON = OFF to the last digit) = Hekatan `deck etabs`; the interpolated constraint only acts with `OBJMESHTYPE "NONE"` | ✅ measured 2026-09-08 |

Regression suite: **`npm test` → 552/552**, plus **208 passed** in the Python
engine (`hekatan-struct-py`), which reproduces the TS/C++ solver at `1e-9` and is
used as the fast arbiter.

## ETABS · SAP2000 · SAFE · Hekatan Struct Lineal, side by side

Difference between each arbiter and **Hekatan Struct Lineal**, same model, same mesh
node by node, same loads (% of the maximum displacement unless stated). Hekatan is the
software; ETABS, SAP2000 and SAFE are only used to check it.

| what is compared | Hekatan switch | **SAP2000 24** | **ETABS 22** | **SAFE 20** |
|---|---|:---:|:---:|:---:|
| Frames only — warehouse, 609 nodes, `ang` + releases | — | **0.001 %** | **0.000 %** | — |
| Frames — modal, Paz & Leigh 6.3, 6 modes | — | — | **0.00 %** | — |
| Frames + deck — warehouse, 609 nodes, 4-node panels | — | **0.001 %** | 4.5 % ¹ → **0.001 %** with `--noedge` | — |
| Frames + deck — warehouse, panels split at edge nodes | `deck etabs` | **3e-4 %** | **2e-5 %** | — |
| Mezzanines 1×1 → 3×2 × 3 storeys — SCM, Live, Ex | `deck etabs` | **1e-13 %** | **1e-9 %** | — |
| Mezzanines — Dead (each program weighs its own model) | `deck etabs` | **0.0000 %** | **0.0000 %** | — |
| Membrane area load — each program's own transfer | `deck etabs` | **9e-13 %** ² | **2.5e-5 %** | — |
| One-way deck (`ONEWAYLOADDIST`, `ANG 90`) | `deck etabs oneway` | n/a ³ | **0.0010 %** | — |
| Shell-Thin (DKQ) — 9 modes of the cell | `shelltype thin` | — | **0.000000 %** | — |
| Shell-Thin — plate 8×8, 5 thicknesses | `shelltype thin` | — | **0.000 %** | — |
| Shell-Thick (CSI formulation) — K of ~140 measured cells | `shelltype thick` | **1e-12 %** | **1e-12 %** | — |
| Shell-Thick — solid-slab mezzanine, 1284 nodes | `shelltype thick` | **< 1e-6 %** | **< 1e-6 %** | — |
| 6 slab types (deck, membrane, thin, thick, ribbed, waffle) | — | — | **< 3e-7 %** | — |
| Membrane / drilling — 12×12 cell, 9 geometries | `drillingTypes 12` | — | **1e-13 %** | — |
| Drilling — 2 walls + coupling beam, 92 nodes | — | **2.5e-12 %** | — | — |
| Beam–wall joint — dual template with walls, modes 1–3 | `etabsjoint 1` | — | **0.00–0.01 %** | — |
| Rigid diaphragm — 8 templates, mass · modes 1–3 | `diaph` | **0.0000 %** (mezzanine) | **0.000 %** · **0.00–0.01 %** | — |
| Assembled mass — warehouse, `AssembledJointMass` | — | — | **0.000 %** | — |
| Footing on Winkler — Shell-Thin, nodal springs | `spring` | **1e-9 %** | — | **1e-9 %** |
| Footing on Winkler — SAFE's **area** spring | `spring` | — | — | 1.92 % ⁴ |
| 5 foundation benchmarks (w_max) | — | — | — | **0.01–0.29 %** |
| Strip footing, shell + frames | — | — | — | **0.01 %** |
| File round-trip (Hekatan → file → program → Hekatan) | — | `.s2k` **0.000 %** | `.e2k` **0.000 %** | — |
| Real foundation read from the file — 9 footings, pedestals, tie beams, 225 nodal springs | `spring` | `.s2k` **1.2e-8 %** | `.e2k` **1.4e-8 %** | `.f2k` **1.5e-3 %** ⁵ |

¹ ETABS with its defaults connects a floor panel to every node lying on its edges (edge
constraint) and cuts it at crossing beams; SAP2000 only connects the 4 nodes. Without the
switch Hekatan behaves like SAP2000; with `deck etabs` like ETABS (see the deck section).
² SAP2000 puts a membrane's weight and area load on its 4 corners, like Hekatan without the switch.
³ SAP2000 has no one-way load distribution.
⁴ SAFE's default Winkler is an *area* spring; Hekatan's (and SAP2000's) is nodal. The 1.92 % is
the difference between the two models, not an error; with nodal springs SAFE closes to 1e-9 %.
⁵ SAFE prints displacements with 6 decimals in m (0.0005 mm on 32 mm): that is the 1.5e-3 %, not the solver. Four SAFE laws measured on the way (`f2kExporter.ts`): a `COLUMN OBJECT CONNECTIVITY` table makes SAFE drop every slab and beam; tables want field *names* (`"Stiffness UZ"`), with keys it silently keeps 200 kN/m; a concrete section without a rebar material is rejected whole; and SAFE analyses beams with **0.1·J**, so the file carries 10·J.

Rule of the house: **compare with SAP2000 first** (it only connects what you mesh,
so it measures the solver), **then with ETABS**, adding ETABS's behaviour to
Hekatan as a *named switch* that can be turned off (`deck etabs`, `etabsjoint`,
`meshcross`). Never bend the engine toward ETABS silently.

### The membrane element and its drilling DOF

The rotation about the shell normal ("drilling") is the one place where Hekatan
still differs measurably from ETABS, and it has its own section because the
answer turned out to be a **published formulation we were not using**.

CSI's own manual names its sources (§10.1.1 of the *Analysis Reference Manual*,
plus the bibliography): **Ibrahimbegović & Wilson (1991)**, **Taylor & Simo
(1985)** and **Batoz & Tahar (1982)** — the last one being the DKQ we already
had. Notably absent: Allman, Hughes, and Bathe/Dvorkin, i.e. **the homogeneous
shell carries no MITC4**.

`elementInputs.drillingTypes` selects the formulation. All of them pass the
higher-order patch test **exactly** (1.500000 / 0.600000) and have exactly
**3 zero-energy modes** — both checked on the matrix the binary emits, not on a
displacement:

| type | ETABS 12×12 matrix | drilling vs ETABS | pinched hemisphere 8×8 | mezzanine axial |
|---|---|---|---|---|
| 2 — Hughes-Brezzi (legacy) | — | +11.46 % | −3.6 % | 0.30 / 1.15 |
| 3 — ITW 1990 | 15.97 % | +5.45 % | −34.07 % | 0.62 / 3.47 |
| 7 — ITW 1991, eight-point rule | 17.84 % | +6.46 % | −4.07 % | 0.86 / 8.27 |
| **8 — drilling projection** ← **default** | **1.42 %** | **+3.09 %** | −33.26 % | **0.30 / 1.15** |
| 9 — projection + eight-point | 7.41 % | +7.65 % | **−0.50 %** | **0.30 / 1.15** |

Type 8 became the default on 2026-08-19: it wins or ties type 3 in **every**
column, which had not happened with any previous candidate — every earlier one
traded curved-shell accuracy against slab-with-beams accuracy. Type **9** stays
available for doubly-curved shells, where it reproduces the paper's hemisphere
(−0.50 % at 8×8 against the published −0.32 %).

Two findings, both from primary sources rather than guesswork:

**The eight-point rule of ITW 1991, eq. (30).** `W_α + W_β = 1`,
`α = 1/(9W_α)^{1/4}`, `β = ((2/3 − 2W_α α²)/W_β)^{1/2}`: four points at
`(±α, ±α)` plus four at `(±β, 0)`, `(0, ±β)`. The paper is explicit about why it
exists — it *"has a similar effect … as the 2×2 Gaussian quadrature **but does
not produce a rank-deficient matrix**"*. That matters because genuine 2×2 leaves
the element with **four** zero-energy modes, a mechanism, while this rule keeps
three (measured). It is what takes the pinched hemisphere from −34 % to −4 %.

⚠️ A **retracted claim**, kept here on purpose: this was briefly reported as
"proven by the binary", on the grounds that `CsiGo2.dll` loads
`0.5773502691896258` and `α(W_α = 1) = 9^{-1/4} = 1/√3`. The arithmetic is right
but the evidence is not: the function those loads live in has **three** natural
coordinates and writes **24** shape-function slots — it is an 8-node
**hexahedral solid**, not the shell, and its `0.125` is the `1/8` of
`N = ⅛(1±r)(1±s)(1±t)`. A constant compatible with two explanations proves
neither. Everything else in this section stands on its own footing: measurements
against ETABS's reconstructed matrix, and CSI's own published bibliography.

**ETABS's drilling term, isolated and measured — no binary needed.** Subtract
from ETABS's reconstructed matrix our own **without** the penalty, and look at
what is left. Its dominant eigenvector, on a unit square, is

```
u : [ 1,  1, -1, -1]     ← rigid-body rotation
v : [-1,  1,  1, -1]     ← rigid-body rotation
θ : [-1, -1, -1, -1]     ← all four rotations equal
```

which is `θ_nodal − θ_rigid-body`: **Wilson's rank-one penalty**, eqs.
(9.11)-(9.13) of his chapter 9. Scaling it gives `k₀ = 0.4·G` **exactly** in 9 of
10 geometries, with **1.0000** alignment against our own residual — the same
vector, not a similar one. Two days of disassembly had failed at this; half an
hour of subtracting matrices did it. The lesson is recorded: when a measurement
of the real system exists, exhaust it before opening a disassembler.

**And the missing piece was a projection, only present in source code.**
Reconstructing ETABS's full 12×12 membrane matrix by flexibility (10 geometries)
showed the pure-membrane block `K_uu` matching at **0.00 %** while `K_uθ` was off
by 223–434 %: a different *shape*, not a different constant — so no choice of
quadrature or penalty could fix it. **FEAP** (Robert Taylor's own program, BSD-3)
resolves it in `elements/shells/shell3d.f`: it integrates the drilling shape
functions over the element and **subtracts their mean**, forcing `∫ B_θ dΩ = 0`.
That single change takes `K_uθ` from 328 % to **9.28 %** and the whole 12×12 from
16 % to **1.42 %** — and the least-squares fit for `γ` lands on **0.40·μ**, the
same value already measured by an independent route.

Type **8 wins or ties type 3 in every column**, so it is the natural next
default; type **9** is the one for doubly-curved shells. Sources extracted under
[`registros/itw_1991/`](../registros/itw_1991/) (equations in LaTeX + page
scans).

⚠️ **Known limitation — `Shell-Thick` on a coarse mesh.** Use **8 or more
divisions per bay**; at 2×2 it is far too stiff. `Thin` and `Membrane` are
unaffected. The cause is measured and it is *not* the shear formulation — see
[Shell status](#shell-status-vs-etabs-measured-2026-08-18).

Jump directly to any example with `?t=<id>` (122 examples total). The most relevant grouped by category:

**Plates & Shells**
- [`?t=plane`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=plane) — Plane Q4 cantilever wall (plane stress) w/ Wilson incompatible modes
- [`?t=plate-thin`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=plate-thin) — Kirchhoff thin plate (BFS Q4, 16-DOF)
- [`?t=plate-thick`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=plate-thick) — Mindlin-Reissner (MITC4) — ⚠️ needs a fine mesh, [see status](#validation-status)
- [`?t=plate-thick-validacion`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=plate-thick-validacion) — MITC4 validation vs SAP 2000
- [`?t=plate-q4`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=plate-q4) — Generic Q4 plate solver
- [`?t=triangular-plate`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=triangular-plate) — DKT triangular plate element
- [`?t=shell-thin`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=shell-thin) / [`?t=shell-thick`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=shell-thick) — Thin/Thick shell elements
- [`?t=layered-shell`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=layered-shell) — Composite layered shell
- [`?t=membrana-csi`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=membrana-csi) — CSI Shell-Membrane with drilling DOF
- [`?t=membrana-pstress`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=membrana-pstress) — Plane-stress membrane
- [`?t=shear-wall-q4`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=shear-wall-q4) — Shear wall meshed with Q4
- [`?t=cantilever-beam-q4`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=cantilever-beam-q4) / [`?t=placa-cantilever-q4`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=placa-cantilever-q4) — Cantilever benchmarks
- [`?t=membrana`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=membrana) — Membrane (plane stress) — Hekatan vs SAP -0.23%
- [`?t=plate-with-beams`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=plate-with-beams) — Plate + perimeter beams (vs SAP benchmark)
- [`?t=slab-beams-columns`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=slab-beams-columns) — Slab + perimeter beams + columns (1-story benchmark)
- [`?t=benchmark-safe-ex01-plate`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=benchmark-safe-ex01-plate) — SAFE Ex.1 · Rectangular SS plate (Timoshenko)
- [`?t=benchmark-safe-ex04-plate-beams`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=benchmark-safe-ex04-plate-beams) — SAFE Ex.4 · Plate + elastic beams (Timoshenko, λ=4)
- [`?t=plate`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=plate) — Generic plate (legacy)

**Foundations & Soil**
- [`?t=zapata-aislada`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=zapata-aislada) — Isolated footing + Winkler springs (11 soil types, NEC-SE-GC)
- [`?t=zapata-aislada-validacion`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=zapata-aislada-validacion) — Isolated footing validation vs SAFE
- [`?t=zapata-viga-amarre`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=zapata-viga-amarre) — Strap-beam footing
- [`?t=safe-bench-viga-cimentacion`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=safe-bench-viga-cimentacion) — Strip footing: shell + frame beam + pedestals (composite model)
- [`?t=viga-cim-guerra-ej7`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=viga-cim-guerra-ej7) — **Ejercicio 7 Libro Guerra MDI** (L=17.20m, 4 cols c/M, shell+frame model)
- [`?t=viga-cim-guerra-ej7-tinv`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=viga-cim-guerra-ej7-tinv) — **Ej.7 Guerra, variante T invertida** (Hetényi · frame T-section + pedestales, sin shell)
- [`?t=safe-bench-losa-cimentacion`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=safe-bench-losa-cimentacion) — Mat foundation 6×8m (cross-validated vs SAFE)
- [`?t=safe-bench-zapata-combinada`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=safe-bench-zapata-combinada) — Combined footing 4×2m
- [`?t=safe-bench-zapata-conectada`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=safe-bench-zapata-conectada) — Connected footings 5×1m, variable t
- [`?t=safe-bench-zapata-comparativa`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=safe-bench-zapata-comparativa) — 🎓 ISSE comparativa: Empotrada vs Winkler vs Vesic (5 autores)

**📚 Libros · SAFE - Marcelo Guerra MDI** (cimentaciones validadas contra libro Guerra)
- [`?t=guerra-ej1-zapata-cuadrada`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=guerra-ej1-zapata-cuadrada) — Ej.1 · Zapata aislada cuadrada 3.45×3.45×0.45m
- [`?t=guerra-ej2-zapata-rectangular-sismo`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=guerra-ej2-zapata-rectangular-sismo) — Ej.2 · Zapata rectangular + sismo 4.60×4.00 (e>L/6)
- [`?t=guerra-ej3-zapata-rectangular-eccentricidad-grande`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=guerra-ej3-zapata-rectangular-eccentricidad-grande) — Ej.3 · Excentricidad GRANDE (e=1.29m, M_live=96 t·m)
- [`?t=guerra-ej4-zapata-combinada-rectangular`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=guerra-ej4-zapata-combinada-rectangular) — Ej.4 · Combinada rectangular (2 cols 90/100, L=7.50m)
- [`?t=guerra-ej5-zapata-combinada-trapezoidal`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=guerra-ej5-zapata-combinada-trapezoidal) — Ej.5 · Combinada **trapezoidal** (B1=3.75 → B2=1.60)
- [`?t=guerra-ej6-zapata-unida-viga-amarre`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=guerra-ej6-zapata-unida-viga-amarre) — Ej.6 · Zapata unida con **viga de amarre** (2 zapatas + frame V45×95)
- [`?t=guerra-ej7-viga-cimentacion-new`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=guerra-ej7-viga-cimentacion-new) — Ej.7 NEW · Viga de cimentación L=17.20m, 4 cols (shell único)
- [`?t=viga-cim-guerra-ej7`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=viga-cim-guerra-ej7) — Ej.7 · Variante shell+frame+pedestal
- [`?t=viga-cim-guerra-ej7-tinv`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=viga-cim-guerra-ej7-tinv) — Ej.7 · Variante **T invertida** (Hetényi)
- [`?t=guerra-ej8-losa-cimentacion`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=guerra-ej8-losa-cimentacion) — Ej.8 · Losa de cimentación (raft 23×21m, 16 cols grid 4×4)

- [`?t=placa-base`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=placa-base) — Steel column base plate
- [`?t=placa-base-cft`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=placa-base-cft) — CFT column base plate
- [`?t=placa-base-h`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=placa-base-h) / [`?t=placa-base-hueca`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=placa-base-hueca) — H + hollow profile bases
- [`?t=viga-medio-elastico`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=viga-medio-elastico) — Beam on elastic foundation (Winkler)
- [`?t=bulbo-presiones-suelo`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=bulbo-presiones-suelo) — Soil pressure bulb diagram
- [`?t=slope-stability`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=slope-stability) — Slope stability analysis

**Convención de modelado para cimentaciones compuestas (z=0 cara inferior):**
Para `safe-bench-viga-cimentacion`, `viga-cim-guerra-ej7` y `viga-cim-guerra-ej7-tinv` (modelos shell+frame y T-section), todos los frames y el shell de la zapata comparten el plano `z=0` (cara INFERIOR de la cimentación, donde se anclan los aceros longitudinal de viga y vertical de columna). Cada elemento se extruye HACIA ARRIBA con sus dimensiones reales: zapata → z=t_zap, viga → z=h_viga, pedestal → z=h_viga+h_ped. La unión es automática por compartir nodos en z=0 (sin rigid links). Las cargas P,M se aplican en el TOP del pedestal. Ver `insertion-points-preview.html` para diagramas explicativos de la sección transversal y vista lateral.

**Building variants** (AISC 360-22 / ACI 318-22 / ASCE 7-22)
- [`?t=edificio-hormigon`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=edificio-hormigon) — Concrete moment frame (IMF/SMF)
- [`?t=edificio-acero-v2`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=edificio-acero-v2) — Steel W moment frame (OMF/IMF/SMF)
- [`?t=edificio-mixto`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=edificio-mixto) — Composite (concrete columns + steel W beams)
- [`?t=edificio-muros`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=edificio-muros) — Concrete + Special RC shear walls (ACI 318-22 §18.10)
- [`?t=edificio-dual`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=edificio-dual) — Dual system (composite + walls + braces, R=7)
- [`?t=edificio-aporticado`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=edificio-aporticado) — Generic frame building
- [`?t=edificio-con-losa`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=edificio-con-losa) — Building with slab membrane
- [`?t=edificio-con-muros`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=edificio-con-muros) — Variant with embedded walls
- [`?t=edificio-ladera`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=edificio-ladera) — Building on slope (asymmetric supports)
- [`?t=edificio-comparativa-fem`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=edificio-comparativa-fem) — Side-by-side FEM comparison
- [`?t=edif-acero`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=edif-acero) — Steel building (legacy)
- [`?t=mezanine`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=mezanine) / [`?t=galpon`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=galpon) — Mezzanine + industrial warehouse

All buildings support the **Rigid Diaphragm** toggle (ASCE 7-22 §12.3.1) in the *Avanzado* folder, adjustable *Secciones por Piso* / *Luces por Vano* via `dynamicParams`, and separate XY / Z deform scales in Settings.

**Frames, beams & trusses**
- [`?t=1d-mesh`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=1d-mesh) / [`?t=2d-mesh`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=2d-mesh) / [`?t=3d-structure`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=3d-structure) — Mesh tutorials (1D/2D/3D)
- [`?t=truss`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=truss) / [`?t=advanced-truss`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=advanced-truss) / [`?t=truss-gen`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=truss-gen) — Truss systems
- [`?t=portico-2d`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=portico-2d) — 2D portal frame
- [`?t=beams`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=beams) / [`?t=viga-doble-t`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=viga-doble-t) — Beam elements
- [`?t=axial-bar`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=axial-bar) / [`?t=barra-axial`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=barra-axial) — Axial bar elements
- [`?t=releases-demo`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=releases-demo) — Member end releases
- [`?t=cerramiento`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=cerramiento) — Cerramiento (pórtico plano N vanos, construcción cotidiana)

**CFT (Concrete-Filled Tubes)**
- [`?t=columna-cft`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=columna-cft) — CFT column (beam element, AISC 360-22 §I)
- [`?t=columna-cft-h8`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=columna-cft-h8) — CFT column with H8 solid elements
- [`?t=benchmark-cft`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=benchmark-cft) / [`?t=benchmark-cft-cantilever`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=benchmark-cft-cantilever) — Validation vs ETABS

**Steel & RC connections**
- [`?t=conexion-bfp`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=conexion-bfp) — Bolted Flange Plate (AISC 358 §7)
- [`?t=conexion-rbs`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=conexion-rbs) — Reduced Beam Section (AISC 358 §5)
- [`?t=conexion-end-plate`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=conexion-end-plate) — End-Plate Moment Connection
- [`?t=conexion-diafragma-cft`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=conexion-diafragma-cft) — Diaphragm-through CFT connection
- [`?t=bolt-hole-detail`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=bolt-hole-detail) — Bolt hole detail visualization

**Benchmarks (validation against textbooks + commercial software)**
- [`?t=benchmark-3way`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=benchmark-3way) — 3-way comparison (Hekatan / ETABS / hand calc)
- [`?t=benchmark-concrete-beam`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=benchmark-concrete-beam) / [`?t=benchmark-concrete-cantilever`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=benchmark-concrete-cantilever) — Concrete beam tests
- [`?t=benchmark-steel-beam`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=benchmark-steel-beam) / [`?t=benchmark-steel-cantilever`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=benchmark-steel-cantilever) — Steel beam tests

*Vigas W1 / W2 — n-DOF axial & flexion benchmarks*
- [`?t=W1_barra_axial`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=W1_barra_axial) — W1 · Barra axial genérica (1 DOF)
- [`?t=W2_viga_axial_concrete_cantilever`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=W2_viga_axial_concrete_cantilever) — Viga axial Hormigón 30×30 (1 DOF)
- [`?t=W2_viga_axial_cantilever`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=W2_viga_axial_cantilever) — Viga axial Acero I-450 (1 DOF)
- [`?t=W2_viga_axial_composite_cantilever`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=W2_viga_axial_composite_cantilever) — Viga axial Compuesta Slab (IPE+losa colaborante) (1 DOF)
- [`?t=W2_viga_axial_composite_encased_cantilever`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=W2_viga_axial_composite_encased_cantilever) — Viga axial Compuesta SRC Encased (1 DOF)
- [`?t=W2_viga_flexion_concrete_cantilever`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=W2_viga_flexion_concrete_cantilever) — Viga flexión Hormigón 30×60 (2 DOF)
- [`?t=W2_viga_flexion_steel_cantilever`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=W2_viga_flexion_steel_cantilever) — Viga flexión Acero IPE 300 (2 DOF)
- [`?t=W2_viga_flexion_composite_slab_cantilever`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=W2_viga_flexion_composite_slab_cantilever) — Viga flexión Compuesta Slab (2 DOF)
- [`?t=W2_viga_flexion_composite_encased_cantilever`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=W2_viga_flexion_composite_encased_cantilever) — Viga flexión Compuesta SRC Encased (2 DOF)

*Mario Paz "Structural Dynamics" 6ª ed.*
- [`?t=benchmark-paz-4-1`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=benchmark-paz-4-1) — Paz 4.1 (1-DOF rectangular impulse)
- [`?t=benchmark-paz-6-1`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=benchmark-paz-6-1) — Paz 6.1 (Newmark-β canónico 1-DOF)
- [`?t=benchmark-paz-7-1`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=benchmark-paz-7-1) — Paz 7.1 (2-story shear building)
- [`?t=benchmark-paz-8-1`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=benchmark-paz-8-1) — Paz 8.1 (2-DOF triangular impulse)
- [`?t=benchmark-paz-9-3`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=benchmark-paz-9-3) — Paz 9.3 (4-story uniform shear building)
- [`?t=benchmark-paz-10-7`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=benchmark-paz-10-7) — Paz 10.7 (fixed-fixed beam, 4 elementos)
- [`?t=benchmark-paz-11-1`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=benchmark-paz-11-1) — Paz 11.1 (plane frame inclinado 45°)
- [`?t=benchmark-paz-12-1`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=benchmark-paz-12-1) — Paz 12.1 (grid frame 3D horizontal)
- [`?t=benchmark-paz-13-1`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=benchmark-paz-13-1) — Paz 13.1 (space frame 3D, 5 nodos)

**Iconic 3D structures**
- [`?t=burj-khalifa`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=burj-khalifa) / [`?t=twisted-tower`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=twisted-tower) / [`?t=tower-3d`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=tower-3d) — Tower models
- [`?t=cable-stayed-bridge`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=cable-stayed-bridge) / [`?t=tablero-puente`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=tablero-puente) — Bridge models
- [`?t=sydney-opera`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=sydney-opera) — Sydney Opera House shells
- [`?t=gateway-arch`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=gateway-arch) — Gateway Arch catenary
- [`?t=diagrid`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=diagrid) — Diagrid structural system
- [`?t=pergola`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=pergola) — Pergola / canopy

**Slabs & design**
- [`?t=slab-designer`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=slab-designer) — Slab design module
- [`?t=building`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=building) — Generic building generator
- [`?t=solid-cube-fem`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=solid-cube-fem) — Solid H8 cube FEM

**CAD & Modeling tools**
- [`?t=new-blank`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=new-blank) — **Blank canvas** for drawing from scratch (see CAD Tools section below)
- [`?t=cad-draw`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=cad-draw) / [`?t=cad-editor`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=cad-editor) — CAD-style drawing tools
- [`?t=drawing`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=drawing) — Basic 2D drawing
- [`?t=cli-modeler`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=cli-modeler) — CLI-style parametric modeling

**Utilities & tutorials**
- [`?t=fem-explained`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=fem-explained) — Step-by-step FEM explainer
- [`?t=calc-editor`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=calc-editor) — Calc editor (Calcpad integration)
- [`?t=report`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=report) — Auto-generated reports
- [`?t=color-map`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=color-map) / [`?t=curves`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=curves) / [`?t=tables`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=tables) — UI components
- [`?t=tutorials`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=tutorials) — Tutorial index
- [`?t=csi-importer`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=csi-importer) — Import E2K / S2K files

### The plate element: identifying CSI's Shell-Thick (2026-09-01)

The membrane section above closed by *reading CSI's own bibliography*. The plate
side needed more: the manual says "Mindlin/Reissner" and cites no
implementation. So the element was identified by **measuring the 12×12 cell of a
single SAP2000 area object** (one area = one element; ETABS auto-meshes past
1.25 m, SAP2000 does not) and by **reading the binary**.

**Shell-Thin is closed — three independent programs, same nine modes:**

```
ETABS Shell-Thin    0.4529  0.4529  0.4587  0.8000  0.8000  1.2000  15.0137  15.0137  16.7413
OpenSees ShellDKGQ  0.4529  0.4529  0.4587  0.8000  0.8000  1.2000  15.0138  15.0138  16.7413
DKQ (ours)          0.4529  0.4529  0.4587  0.8000  0.8000  1.2000  15.0137  15.0137  16.7413
```

It is the **DKQ of Batoz & Tahar (1982)**, matching the *whole* matrix at
`0.000000 %` — not just a deflection.

**Shell-Thick is the DSE of Wilson (ch. 8) = the PQ3 of Ibrahimbegović (1993)**,
confirmed from `CsiGo2.dll`: the type switch sets **16 DOF = 12 + 4 edge Δθ**
and loads the **−2/3** factor of the edge equation; the quadrature is the
8-point rule of ITW 1991 (`9/49`, `40/49`, `√(7/9)`, `√(7/15)`), written
verbatim in the code.

⚠️ *This section originally said a **single** rank-1 term was missing. That was
wrong and is corrected below: there are **four**, and as of 2026-09-01 all four are
measured and the square cell closes to `0.0000 %` — see [The square cell, closed](#the-square-cell-closed-2026-09-01).
The first of the four, and the largest, is:*

A **rank-1 stiffness on one mode** — rotations opening from the centroid (`θx = x−x_c`,
`θy = y−y_c`, `w = 0`) — split equally across the three bending terms:

    λ_φ / D = k (2 + (1−ν)/2),   k = 181.81

constant over 5 decades of element size (L = 0.5 … 10) and 18 thicknesses
(t = 0.001 … 0.4), linear in ν to 4 digits. Independent of `E`, `L` and `t`,
which is why it is a **numerical penalty, not physics**. Candidate source:
Belytschko, Tsay & Liu, *A stabilization matrix for the bilinear Mindlin plate
element*, CMAME **29** (1981).

**Element bench.** Six formulations were implemented and measured against the
same problems — four of them from published sources, one translated from
MYSTRAN's Fortran, one from OpenSees:

| element | deflection vs Navier (8×8) | thin limit `t = L/10⁴` | zero modes |
|---|---|---|---|
| **DSQ** (Batoz-Lardeur 1990) | **−0.001 %** | 0.004060 ✅ | 3 ✅ |
| **DKMQ** (Katili 1993) | **−0.016 %** | 0.004060 ✅ | 3 ✅ |
| DKQ (Batoz-Tahar 1982) | −0.058 % | 0.004060 ✅ | 3 ✅ |
| MIN4 (Tessler-Hughes, from MYSTRAN) | +0.958 % | 0.004097 ✅ | 3 ✅ |
| DSE / PQ3 (Wilson, = CSI's) | +4.060 % | 0.004223 ⚠️ | 3 ✅ |
| Mindlin Q4 + bubble | −85.4 % | 0.000000 ❌ | 3 |

(exact = `0.004062`)

Two different answers for two different questions: **DSQ or DKMQ for
production**, the **DSE only to replicate CSI**. And note the DSE converges
*from above* — it is too flexible, which is precisely what the missing `k`
term corrects.

**Every piece of the binary is published — in Wilson's own book.** Reading
*Three-Dimensional Static and Dynamic Analysis of Structures* end to end
(423 pages) matched each constant read from the disassembler to an equation:

| read from `CsiGo2.dll` | equation in the book |
|---|---|
| `0.125` with the edge Δx, Δy | **(F.7a)** `β₁ = (L/8)(θi−θj)` |
| `−2/3` | **(F.9)** `γ = (wj−wi)/L − (θi+θj)/2 − (2/3)Δθ` |
| `κ = 5/6` | **(F.21)**, derived |
| `9/49`, `40/49`, `√(7/9)`, `√(7/15)` | **(G.18)-(G.20)**, the 8-point rule |
| subtract `Σ w·detJ·B` over the internal columns | **(6.7)** `B_IC = −(1/V)∫B_I dV` |
| static condensation | **(6.11)** and **(F.14)** |
| the **rank-one stiffness** that is missing | **(9.13)-(9.14)** |

Appendix F is the beam element *«to develop constraint equations that can be used
in the development of a plate bending element»* — the DSE's own foundation. And
§9.7, on the membrane, states the technique verbatim: *«this **rank one matrix is
added to the 12 by 12 stiffness matrix**, the zero energy mode is removed»*, with

    K₀ = k₀ · Vol · b̄ᵀb̄        (9.13)
    k₀ = 0.025 · D₃₃            (9.14)

and the honest footnote: *«**experience** with the solution of a large number of
problems indicates that this value **is effective**»*.

**So the technique is published; the numbers mostly are not.** `k₀` is chosen, not
derived — which is why `k = 181.81` appears in no paper, and why it is absent from
the binary's constant pool (searched both `.rdata` and the 64-bit immediates, where
`√(7/9)` had been hiding).

The hourglass term's dependence on thickness factorises as
`(1 + B s²)(1 + φ s²)` with `s = t/L`, and at `ν = 0` that second root is `2.400`
— numerically identical to Katili's `φ_k` (eq. 74) for `κ = 5/6`.

⚠️ **That identification was premature and a `t × ν` sweep the same day disproved
it.** With 24 cells (`ν` = 0, 0.15, 0.30, 0.45 × six thicknesses) the root divided by
Katili's `φ_k` comes out **1.000, 1.150, 1.300, 1.450 — exactly `(1 + ν)`**. So the
true law is `φ = 2(1+ν)/(κ(1−ν))`, not `2/(κ(1−ν))`: it carries one factor of
`(1+ν)` more than Katili's, and the two agree **only at `ν = 0`**, which is exactly
where the first sweep lived. Left as a standing note so the conclusion is not drawn
again. None of these constants is published.

Code: `validation/02-placas/dse-de-wilson/` (`dsq_batoz.py`, `min4_mystran.py`,
`campeonato.py`, `pruebas_fisicas.py`, `dse_mas_phi.py`, `tamiz*.py`,
`mapa_funcion.py`, `buscar_constantes.py`).

Adding the measured term to the DSE **halves** the Navier error (4.06 % → 2.75 %
at 8×8) and reproduces ETABS' φ mode to 0.004 % on squares.

#### The square cell, closed (2026-09-01)

The residual `R = K_ETABS − K_DSE` turned out to have **rank 1-2**, not 4 —
fitting it with four vectors was over-parameterised and still failed, which meant
the *vectors* were wrong, not the model. Printing the dominant eigenvector node by
node settled it: the hourglass term is **not** a penalty on `w` alone (MAC 0.889,
not 1.000). It carries rotations worth exactly `w/4`. With `ξ,η` the natural
coordinates and `h = ξ·η`:

| mode | shape | λ/D (E=2.2e7, ν=0, t=0.20, L=1) |
|---|---|---|
| φ | w=0, θ=(x−xc, y−yc) | **454.542** |
| hg | w=h/L, θx=−ξ/4, θy=+η/4 | **83.629** |
| hg_tx | w=0, θx=h | **0.499867** |
| hg_ty | w=0, θy=h | **0.499867** |

That `1/L` matters and was not there at first. “The rotations are worth `w/4`” only
holds at `L = 1`, because `w` is a length and rotations are not. Setting `w = L·h`
made it *worse* (3.1 % → 7.7 %), so the factor was **swept instead of assumed** and
came out `c = 1/L` **exactly** (2.0, 1.0, 0.5, 0.2, 0.1 for L = 0.5, 1, 2, 5, 10).
The dimensionally sound statement is `θ = w/(4L)` — rotation = displacement over
length. With it the unexplained residual is **0.001-0.010 % across all 23 square
cells at any size**.

Two things were ruled out with evidence along the way: the `L ≠ 1` cells were *not*
auto-meshed (all 16 have **exactly 3 zero eigenvalues**, so they are genuine single
elements), and ETABS and our own `K_DSE` are **both self-similar to 0.00000 %**
(cells with equal `t/L` and different size give the same dimensionless matrix) —
which is what forced the search onto the normalisation, where the answer was.

**The three closed-form laws**, against all 34 measured square cells:

| term | law | error |
|---|---|---|
| `λ_φ/D` | `181.817 · (2.5 − ν/2)` | ±0.18 % |
| `λ_htx/D = λ_hty/D` | `0.5 · (1 − ν)` | ±0.027 % |
| `λ_hg/D` | `A/[(1 + B s²)(1 + φ_k)] · (4/L² + 0.5)/4.5` | **0.0000 %** |

with `s = t/L`, `φ_k = 2/(κ(1−ν))·s²`, `A = 4500.90`, `B = 1202.64`. The last factor
is not physics — it is the artefact of normalising a vector whose direction moves
with `L` (`|v|² = 4/L² + 0.5`, which is 4.5 at `L=1`).

#### `A(ν)` and `B(ν)`, closed by the `t × ν` sweep (24 new ETABS cells)

`A` and `B` were initially measured at `ν = 0` only — every stored cell with
`ν ≠ 0` sat at `t = 0.2`, and one thickness cannot separate two constants. A sweep
of `ν × t` = 4 × 6 closed it. Its `ν = 0` row is the **control** and returns
`A = 4500.9001`, `B = 1202.6400`, `R² = 1.0000000` — the values measured earlier by
an independent route.

⚠️ The raw sweep came back with the **rotational DOFs scaled by 1000** (the `.K_0`
wrote moments in kN·mm; the capture script does not pin units). It is detected from
the matrix itself rather than by comparison: a free element has two rigid-body
rotation modes in its null space, where `|w|/|θ|` must be the coordinate scale, so
the power of 1000 is read off the null vector (`escala_rot.py`). Corrected, the
cell reproduces the stored one to `5·10⁻⁸ %`.

Fitting the full polynomial per `ν` and factorising it — imposing nothing — gives
`0.00000 %` at all four `ν`, and the three laws read straight off:

| constant | law | worst error |
|---|---|---|
| `A(ν)` | `4500.90 − 900.90·ν` | **0.00000 %** (R² = 1.000000000) |
| `B(ν)` | `(1202.64 − 237.84·ν)/(1−ν)` | 0.00041 % |
| `φ(ν)` | `2(1+ν)/(κ(1−ν))`, `κ = 5/6` | 0.00127 % |

**The whole square cell in closed form**, checked entry by entry against all
**55 measured square cells** (`ν` 0→0.45, `L` 0.5→10, `t` 0.001→2.0):
worst **0.179 %**, typical `0.01 %`. The worst case is `t/L = 2` — an absurdly thick
plate — and it comes from the `λ_φ` law, whose own error is ±0.18 %.
Implementation: `validation/02-placas/dse-de-wilson/ley_shellthick.py` (`K_shellthick`).

⚠️ The `z_*` cells in `celda_sap2000.json` are **trapezoids** (0.9/0.1, 0.8/0.2,
0.7/0.3) and a bounding-box test lets them through, since they also measure 1×1.
They must be excluded with a real squareness test (equal edges *and* equal
diagonals) — with one of them in, the "worst case" reads 149 % and means nothing.

#### Trapezoids: closed on 2026-09-02 (the diagnosis below is history)

*Update 2026-09-02:* the distorted cells closed too, once the Shell-Thick was read
out of `CsiGo2.dll` instead of being fitted — `getBendingK_CSI` / `plate_csi_thick.py`
reproduce **27 trapezoids and irregular quads at 1e-12 %** together with the square
(see [The plate element](#the-plate-element-identifying-csis-shell-thick-2026-09-01)).
What follows is the diagnosis as it stood on 2026-09-01, kept because it says *why*
fitting additive terms could never have worked.


The same basis does *not* close on distorted cells (12-96 % out). Both remaining
hypotheses were tested and both fail: adding a fifth/sixth vector, and letting the
penalty be `V C Vᵀ` with **C non-diagonal** (the cross terms come out *exactly
zero* on the square, as symmetry predicts, but only take 96.9 % → 89.0 %). Sweeping
the `1/L` factor freely does not save them either: with the optimal `c` and all
seven candidate lengths (bottom edge, top edge, mean edge, height, √A, diagonal,
√detJ₀) the residual stays at 12-96 %.

The decisive measurement is what fraction of the *real* eigenvector lies inside the
span of the four modes: **1.000** on the square, 0.94-0.99 at `d=0.05`, and
**0.25-0.61** at `d≥0.30`, degrading smoothly with distortion. That is not the
signature of a missing additive term — it is the signature of the **base DSE
formulation itself differing** once the cell is distorted.

#### How much does this matter in a real building?

Measured, not argued (`pruebas_fisicas.resolver_dist`, 8×8 mesh progressively
skewed; `d` = how far each interior node moves). Centre deflection error vs Navier:

| element | d=0.0 | d=0.1 | d=0.2 | d=0.3 |
|---|---|---|---|---|
| DKQ (Shell-Thin) | −0.058 % | −0.355 % | −1.168 % | −2.240 % |
| DSQ | −0.001 % | −0.299 % | −1.148 % | −2.901 % |
| **DKMQ (ours)** | −0.016 % | −0.313 % | −1.124 % | **−2.233 %** |
| MIN4 | 0.958 % | 0.367 % | −2.338 % | −9.677 % |
| DSE (CSI's) | 4.060 % | 3.731 % | 2.826 % | 1.554 % |

Trapezoids appear in slabs with non-parallel edges, ramps, stair openings and mesh
transitions. Under the worst skew, DKMQ stays at **−2.2 %** deflection — and
periods go with the square root of that, so **~1 %**. The 99 % gap being chased is
between *isolated element* matrices and is dominated by λ_φ ≈ 455·D, a numerical
penalty, not physics.

⚠️ **MIN4 collapses to −9.7 %** under skew — the only element here that should not
be used on an irregular mesh.

Code: `quinto_modo.py`, `quien_es_el_quinto.py`, `espectro_resto.py`,
`los_dos_modos.py`, `modo2_crudo.py`, `reconstruir.py`, `trapecios_v4.py`,
`ajuste_cruzado.py`, `donde_vive.py`.

## 📐 CAD Tools (new — NewBlank canvas)

[`?t=new-blank`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=new-blank) — **Lienzo CAD 2D/3D** for drawing structures from scratch with mouse + Tweakpane controls.

**Tools** (folder `✏ Herramientas CAD`):
- 🖱 Seleccionar / ● Nodo / ／ Línea (frame) / ▭ Área (shell Q4)
- ⌒ Polilínea / ▭ Rectángulo / ○ Círculo / ⌒ Arco (3 ptos)
- ┊ Línea auxiliar / ↗ Prolongar línea
- **ORTO (90°)** + **POLAR (45°)** modes
- **Segmentos arc/círc** slider (4–64) — discretizes any non-linear element to N straight segments at FEM export

**Work planes:** XY (planta) / XZ (elevación frontal) / YZ (elevación lateral) — sync with raycaster so mouse clicks fall on the active plane.

**Snap:** separate **Snap 2D** + **Snap 3D** sliders. Snap 3D Indicator (sphere + RGB axes cross) follows the cursor on the work plane to help orient in 3D.

**Views** (folder `Vista`):
- 🏗 Isométrica / ⬇ Planta (X-Y) / → Elevación X / ↑ Elevación Y
- 📍 **Ejes (frames individuales):** auto-generated buttons per unique X (Eje A, B, C…) and Y (Eje 1, 2, 3…) coordinate of the model — click to view that frame in elevation (FEM Studio style)
- 👁 **Toggle ejes en escena** — draws dashed gridlines + labels A/B/C (blue) + 1/2/3 (red) at each gridline for CAD-style reference
- 🎬 **Demo simulador CAD** — animates a virtual cursor through CAD tools and draws a portico in the canvas (visible mouse simulation)

**Sections (Tweakpane params):** material (Hormigón/Acero), b/h column, b/h beam, shell thickness — applied to drawn elements automatically.

**Supports/Loads (auto):** apoyo type at z_min nodes (Empotrado / Articulado / Rótula / sin apoyo), Fz/Fx loads at z_max nodes — toggleable.

**Public TS API** (exposed on `window` for scripting/demos):
```ts
__hekatanDrawAt(x, y, z)         // add point (= mouse click)
__hekatanDrawNewPoly()           // start new polyline (= right-click)
__hekatanDrawCircle(cx, cy, cz, r, segs, plane)
__hekatanDrawArc([p1], [p2], [p3], segs)
__hekatanDrawRect([p1], [p2])
__hekatanShowSnap(x, y, z) / __hekatanHideSnap()
__hekatanShowAxes(xs, ys, zMax) / __hekatanHideAxes()
__hekatanShowRefPlanes(zLevels, sizeM, cx, cy)
```

## 🏁 Benchmarks unificados (W##)

Naming canonical para validación cruzada hekatan-struct-lineal ↔ ETABS / SAP2000 / SAFE / Octave / MATLAB / Calcpad-Lab. Cada **W##** vive con el mismo nombre en cada plataforma para encontrar el mismo benchmark en cualquier lado.

| ID | Nombre | Wilson cap | Categoría | URL hekatan-web |
|---|---|---|---|---|
| **W1** | Barra axial 1D | 2/4 | Frames 1D | [`?t=W1_barra_axial`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=W1_barra_axial) |
| **W2** | Viga Euler-Bernoulli | 4 | Frames 1D | (pendiente migración) |
| **W3** | Armadura plana 2D | 2 | Trusses | (pendiente migración) |
| **W4** | Pórtico plano 2D | 4 | Frames 2D | (pendiente migración) |
| **W5** | Torre espacial 3D | — | Frames 3D | (pendiente migración) |
| **W6** | Placa flexión Q4 | — | Shells | (pendiente migración) |

**Mapa de archivos por benchmark** (ejemplo W1):

| Plataforma | Path |
|---|---|
| hekatan-struct-lineal registry | `examples/src/W1_barra_axial/barraAxial.ts` |
| hekatan-struct-lineal web | `?t=W1_barra_axial` |
| ETABS API + E2K | `validacion/Etabs/W1_barra_axial/` (E2K + Python pythonnet validator) |
| Calcpad-Lab | `Calcpad-Lab/Examples/Finite Elements/W1_barra_axial.cpd` |
| Calcpad-Symbolic | `Calcpad-Symbolic/Examples/Finite Elements/W1_barra_axial.cpd` |
| Octave reference | `validation/octave/W1_barra_axial.m` |
| Markdown doc | `markdown/benchmarks/W1_BARRA_AXIAL.md` |
| Files index | `markdown/benchmarks/W1_FILES_INDEX.md` |

**Validación cruzada W1** (todos coinciden con 0% error):
- Analítica Hooke 1D: δ = F·L/(A·E) = 0.250000 mm
- ETABS API (pythonnet, .NET InterOp): 0.250000 mm ✓
- ETABS via E2K → API: 0.250000 mm ✓
- hekatan-struct-lineal FEM 1D: ✓

## 🔌 SAP2000 / ETABS / SAFE integration (PowerShell)

**Imports (file → Hekatan):**
- E2K (ETABS) — any benchmark workspace has a 📥 Importar E2K button (in ETABS folder). Click → pick file → auto-redirect to `?t=new-blank` with the imported model loaded as drawing geometry. Round-trip: export from a benchmark, modify externally, import back.
  - **Fixed 2026-08-28 — the importer used to drop every AREA.** `parseE2k` read the
    `AREA CONNECTIVITIES` block and only *counted* it (`info.nAreas`): a `.e2k` written
    with 900 slabs came back with **zero shells** — no thickness, no shell type, no
    modifiers, and no warning. It now builds them from `AREA CONNECTIVITIES` +
    `AREA ASSIGNS` + `SHELLPROP` (across `SLAB`, `WALL` and `DECK PROPERTIES`).
  - **And it converted no units.** A `.e2k` is written in **N and mm**, so an imported
    model came in a thousand times too big (X from 0 to 18000 for an 18 m frame,
    thicknesses of 200, E in N/mm²). Every quantity is now converted to kN·m with its
    own power — inertia in L⁴, modulus in F/L², a moment in F·L.
- S2K (SAP2000) — same flow with 📥 Importar S2K in SAP folder
- F2K (SAFE) — for foundation benchmarks via `📥 Importar F2K cimentación COMPLETA` in Cimentación folder
- Mesh, sections, loads, releases, supports parsed from text format
- Round-trip implementation: `examples/src/workspace/main.ts` (handlers) + `examples/src/new-blank/newBlank.ts` (consumer)

**Exports (Hekatan → file) — round-trip measured 2026-08-18:**

| format | target | round-trip closure | notes |
|---|---|---|---|
| **E2K** | ETABS 22 | **0.000 %** — 372/378 nodes, ΣRz exact | must be written in **N and MM**: the E2K parser has **no `UNITS` token** (confirmed in `ETABS.dll` ~0x03490e00) and always reads SAPFire base units. Moments are **N·mm (×1e6)**, not N·m |
| **S2K** | SAP2000 24 | **0.000 %** — 378/378 nodes; re-measured 2026-08-27 on the 8 templates: reaction **and** deflection at 0.000 % in all 8 | `Shape=General`, not `Rectangular`: with a parametric shape SAP **recomputes I22 and J** from t3/t2 and discards what you wrote. And `CurrUnits` must say **KN, m** — see below |
| **F2K** | SAFE 20 | ✅ 1.5e-3 % (2026-09-05) | generic `f2kExporter.ts` from the same model as e2k/s2k: point springs, restraints, General sections, Thin/Thick slabs; imported by tables (`csi_cli.py --engine safe --open`) |

⚠️ **Both E2K and S2K used to fail the same way, silently**: a *parametric* section
shape makes ETABS/SAP recompute the section properties from D/B (or t3/t2) and
throw away the A/I/J actually written. Always emit `General` when the model
carries real A/I33/I22. And write the **real shear areas** (`AS2`/`AS3`) plus the
**local axis angle** — those two alone were worth 20 % on the warehouse model.

**Two more silent failures, found 2026-08-27** running the 8 *Plantillas* through
ETABS 22 (`cli/plantillas_etabs.py` → `cli/plantillas_vs_csi.mjs`). The static
side closed at **0.000 %** while the modal was off by up to 72 % — because they
were not two solvers disagreeing, they were **two different buildings**:

| what was wrong | why it mattered | now |
|---|---|---|
| `$ MASS SOURCE` was hard-coded to `INCLUDELOADS "Yes"` for both weight modes | in `weightMode: "manual"` the self weight is **not** in any load (`SELFWEIGHT 0`), so ETABS took the mass of the *imposed load* and dropped the material's | it follows `weightMode`: `manual` → `INCLUDEELEMENTS "Yes"` / `INCLUDELOADS "No"`, which is what `getGlobalMassMatrix.cpp` does |
| shell **modifiers** were never exported | a slab cracked to 25 % (`shellmod`) reached ETABS **intact**, without a warning | second `SHELLPROP` line with the same name, format copied from an ETABS-written `.e2k`; ETABS reads all 8 back exactly (`PropArea.GetModifiers`, 0 deviations) |

Modal error against ETABS 22, before → after the mass-source fix:

| template | before | after |
|---|---|---|
| 3D frame | −36.02 % | **+0.59 %** |
| frame + slab | +17.04 % | **+0.16 %** |
| slab + edge beams | +9.94 % | **+0.56 %** |
| dual (walls) | +21.35 % | **+0.26 %** |

Both are guarded by regression cases: `tests/casos/e2k_mass_source.mjs` and
`tests/casos/e2k_shell_props.mjs`.

⚠️ **The `.s2k` used to lie about its own units.** `units.force` only set the
`CurrUnits` label in PROGRAM CONTROL — it converted **nothing**: loads, modulus
and densities are all written straight from the model, which works in **kN and
m**. Exporting with `units: {force: "Tonf"}` produced a file that contradicts
itself, and SAP2000 does the right thing with it: it reads tonnes.

Measured 2026-08-27 on the 8 templates: a 6480 kN model wrote `ΣF3 = -6480`
under `CurrUnits="Tonf, m, C"`, and SAP2000 returned **ΣRz = 63547.09 kN** —
6480 × 9.80665. The solver was fine; the file was wrong.

⚠️ **And the deflections came out right anyway**, which is what made it
invisible: `E1` carries the same mismatch, so the factor cancels in `u = F/K`
and displacements closed to 4 decimals against Hekatan. Only **forces and
reactions** were off, by exactly g. With the label fixed, SAP2000 closes at
**0.000 %** on all 8 templates in reaction *and* deflection. Guarded by
`tests/casos/s2k_unidades.mjs`.

### Areas: what was silently wrong until 2026-08-28

Measured with the full loop **Hekatan → .e2k → ETABS → .e2k → Hekatan** over
**all 58 registry examples that carry areas** (`cli/roundtrip_areas.mjs`, then
`cli/roundtrip_areas_etabs.py`). Not a sample: a slab is declared in many ways
— Q4, triangle, wall PANEL, deck, membrane, with modifiers — and one that
doesn't survive is enough to leave a hole.

| what was wrong | what it did | now |
|---|---|---|
| one `SHELLPROP "Losa"` and one `"Muro"`, with the **first** element's thickness | a model with several shells lost all but one: `placa-base` went out as `[0.014, 0.022, 0.025]` and came back `[0.022, 0.025]` | one property per distinct shell (wall/slab, thickness, formulation, modifiers) |
| **triangles were not collected** (`el.length === 4`) | `triangular-plate` exported its 128 shells as **zero areas** | `AREA ... 3 "p1" "p2" "p3" 0 0 0` |
| every `FLOOR` written with story jumps `0 0 0 0` | the four nodes landed on the **same story**, so the element came out **flat** | real jumps per node, assigned to the topmost story |

That last one is why a **curved shell** did not survive. Measured on the R = 10 m
hemisphere:

| | before | after |
|---|---|---|
| nodes (model has 81) | 131 | **86** |
| radius | 9.4884 … **10.7448** | 9.0891 … **10.0001** |
| nodes on the sphere | 82 of 131 | **81 of 86** |
| areas | — | **64 of 64** |

Flat floors are unaffected: all their nodes share a story, so the jump is 0 and
nothing changes.

⚠️ **A `POINT` carries a third number** — a drop in mm below its story
elevation. That is what allows elevations that are not stories, and the exporter
already uses it: a level is only declared for an elevation shared by ≥3 nodes,
everything else hangs from the one above with its drop. The hemisphere failed
*despite* that, because each of its rings has 9 nodes and became a legitimate
story — the bug was in the area, which ignored which story each of its nodes
belonged to.

⚠️ **Never compare T1 against T1.** A plane frame has its first mode **out of
plane** (ETABS: mode 1 = 77 % UY), so "mode 1" can be a different mode in each
program. `cli/plantillas_vs_csi.mjs` pairs them by **mass participation**
(cosine of `[UX UY UZ RX RY RZ]` > 0.7).

**Cross-validation pipeline** (Windows + PowerShell + CSI OAPI):
- `Benchmark_Placa/safe_debug_zapata.ps1` — diagnostic tool that opens .FDB in SAFE, runs analysis, extracts settlement + Mxx via OAPI
- `Benchmark_Placa/safe_extract_zapata.py` — Python OAPI version with SetRunCaseFlag + post-import joint count
- Validated: zapata-aislada (Hekatan Q4 + Winkler) vs SAFE 21 — 96.7 mm SAFE vs 84 mm analytical (acceptable for Boussinesq deep formulation differences)
- ETABS validation: ratio = 1.0000 for frames + modal, 0.99–1.003 for shells (full table at `/validation/python-etabs-verificado/`)

**Known issue:** SAFE OAPI `File.OpenFile(.f2k)` returns `ret=0` but model is empty. **Workaround**: open .f2k in SAFE GUI manually → File → Save As → .FDB → OAPI reads .FDB correctly. Documented in `Benchmark_Placa/REPORTE_SAFE_F2K_BUG.md`.

**More SAFE 20 OAPI dead ends (measured 2026-08-18, do not retry):**
- `cFile` has **no** `ExportToSAFEFile`; `Save` with a `.f2k` extension returns 0 and writes nothing. To see the model SAFE actually solved, read its **`.LOG`**.
- `GetAvailableTables()` and `cAreaObj.GetElm()` **hang the process** — it had to be killed twice.
- These do answer: `PointObj.GetNameList/GetRestraint/GetCoordCartesian`, `PropAreaSpring.GetNameList/GetAreaSpringProp`.
- `strings` finds nothing in SAFE's DLLs (they are .NET — literals live in the metadata heap). Load them with `clr` and **inspect by reflection** instead.
- SAP2000 twin: `File.Save("x.s2k")` returns 0 and leaves the text in **`x.$2k`** (with `$`, like ETABS's `.$et`).

**Build & deploy in PowerShell** (Windows native, no MSYS):
```powershell
# Build
$env:DEPLOY_BASE="/hekatan-struct-lineal/"; npm run build -w examples

# Deploy (no MSYS_NO_PATHCONV needed in pure PowerShell)
$env:GIT_AUTHOR_NAME="Your Name"
$env:GIT_AUTHOR_EMAIL="you@example.com"
npx gh-pages --dist website/src/examples `
  --repo https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal.git `
  --branch gh-pages --dotfiles `
  --message "your commit message"
```

## What Hekatan Struct Lineal adds on top of Awatif

| Feature | Awatif v2.0.0 | Hekatan Struct Lineal |
|---------|:---:|:---:|
| Modal analysis (eigenvalue) | ❌ | ✅ Eigen C++/WASM, mass participation, validated 0.00% vs OpenSees/SciPy |
| Modal animation (live mode shapes) | ❌ | ✅ Shared helper — works in EVERY example with `hasModal: true` |
| Winkler springs (native C++) | ❌ | ✅ `deform()` extended with `springsList: {node, dof, k}[]`, assembled into K |
| Plane Q4 plane-stress solver | ❌ | ✅ Pure-TS `planeQ4Solve`: 2 DOFs/node, 2×2 Gauss, LU dense, stress recovery |
| Wilson incompatible modes (Q4 bending) | ❌ | ✅ Taylor-Beresford-Wilson 1976; reduces cantilever error ~10% → <2% |
| Rigid diaphragm (ASCE 7-22 §12.3.1) | ❌ | ✅ Integrated in all 5 building variants via toggle *Avanzado → Diafragma rígido* |
| Separate deform scale XY / Z (axial rigidity respect) | ❌ | ✅ Auto-detects Edificio vs Placa; user-adjustable in Settings |
| Dynamic per-floor params (regenOnChange) | ❌ | ✅ `ExampleDef.dynamicParams(currentParams)` — Secciones/Alturas/Luces por piso |
| Bathe composite time integration (α-dissipative) | ❌ | ✅ TS scaffold `batheStep()` + `newmarkStep()` for ASCE 7-22 §16 RHA |
| ETABS-style slab discretization (25-50 cm per bay) | ❌ | ✅ `etabsDiscretize2D()` — each bay meshed to target size, like ETABS default |
| Materials helper (Hormigón/Acero/CFT × Rect/Circ/W/HSS) | ❌ | ✅ `materials.ts` w/ ACI 318-22 Ec=15100√f'c, AISC/A992 steel, composite |
| Mindlin-Reissner plates | ❌ | ✅ CSI Shell-Thick formulation (read from `CsiGo2.dll`, 1e-12 % on measured cells) via `plateQ4Solve(theoryType: 0)`; MITC4 kept as build option |
| Kirchhoff thin plates | ❌ | ✅ `plateQ4Solve(theoryType: 1)` |
| CSI Shell-Membrane formulation | ❌ | ✅ ITW + bubble + hourglass drilling (`drillingTypes = 12`): 1e-13 % vs ETABS's 12×12 cell |
| ETABS floor semantics (`deck etabs [oneway]`) | ❌ | ✅ panel split at edge nodes + tributary load transfer to edge beams; off = SAP2000 semantics |
| Timoshenko beams | ❌ Euler-Bernoulli only | ✅ φ = 12EI/GA_sL² |
| Shell Q4 incompatible modes | ❌ | ✅ Wilson + drilling DOF |
| Nonlinear pushover | ❌ | ✅ Newton-Raphson |
| Rigid end offsets | ❌ | ✅ R^T·K·R |
| Moment releases | ❌ | ✅ Static condensation |
| **Unified Tweakpane workspace** | ❌ | ✅ Hub at `?t=<id>` loads any example; draggable + position persisted |
| **Reactive unit system** | ❌ | ✅ kN/tonf/kip × mm/cm/m/in; sliders + colormap legend + values cascade |
| **Shell colormap — 17 fields** | ❌ | ✅ F11/F22/F12, **FMax/FMin**, FVM, V13/V23, **VMax**, M11/M22/M12, **MMax/MMin**, Ux/Uy/Uz — CSI naming |
| **Dynamic slider ranges** | ❌ | ✅ Folder "📏 Rangos": user can extend min/max of load sliders in-session |
| Import E2K (ETABS) | ❌ | ✅ frames **and areas** — thickness, shell type, modifiers; units converted to kN·m |
| Import S2K (SAP2000) | ❌ | ✅ |
| Import IFC (Revit/ArchiCAD) | ❌ | ✅ web-ifc WASM |
| Export E2K / S2K | ❌ | ✅ |
| Export OpenSees (Py/Tcl) | ❌ | ✅ |
| Didactic FEM solver | ❌ | ✅ K_local, T, K_global per element |
| Calc panel (math.js + KaTeX) | ❌ | ✅ MATLAB-like with symbolic math |
| Parametric building generator | Basic | ✅ Per-axis spans, per-floor heights, overhangs, shear walls, braces |
| Foundation examples (zapatas) | ❌ | ✅ Isolated, strap-beam, validation vs hand calc |
| ETABS-style releases UI | ❌ | ✅ 6 DOFs × 2 ends + springs |
| Section assignment dialog | ❌ | ✅ Rect, circular, I-shape, HSS, CFT |
| Mobile responsive | ❌ | ✅ Hamburger menu |
| Validated vs ETABS 22 / SAP2000 24 / SAFE 20 | ❌ | ✅ frames + deck 0.001 %, mezzanines 1e-13 % (SAP) / 0.0000 % (ETABS), foundations 0.01–0.29 % — see [Validation status](#validation-status) |

## Workspace architecture

```
examples/src/
├── workspace/                  ← unified hub (Tweakpane-based)
│   ├── main.ts                 Selector + params + modal + units + ranges
│   ├── exampleRegistry.ts      ExampleDef interface + list of all 25+ examples
│   ├── runExampleStandalone.ts Runner for individual pages /<id>/
│   ├── units.ts                Reactive forceUnit/dispUnit (localStorage)
│   └── exampleVersion.ts       Version counter (invalidates stale van.derive)
├── shared/
│   ├── animateMode.ts          Modal mode-shape animator (reusable)
│   ├── renderModalTable.ts     Modal frequencies table
│   └── ...
└── <example-id>/               each example self-contained
    ├── <name>.ts               exports ExampleDef
    ├── main.ts                 runExampleStandalone(<def>)
    └── index.html
```

Every example exports an `ExampleDef` with:
```ts
{ id, name, category, params, build,
  hasModal?, runModal?, onParamChange?, computedLabels?, inlineComputed?,
  defaultShellResult?, availableShellResults? }
```

`ParamDef` supports:
- Standard sliders (`min`, `max`, `step`, `default`)
- Dropdowns (`options: {label: value}`)
- Checkboxes (`boolean: true`)
- **Typed units** (`unitType: "force" | "moment" | "disp"`) — auto-convert + label suffix
- **Dynamic ranges** (`rangeAdjustable: true`) — folder "📏 Rangos" lets user extend min/max

## Architecture

```
┌──────────────────────────────────────────────────────┐
│                    Browser                            │
│                                                      │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │  hekatan-ui  │  │  hekatan-fem  │  │   examples  │ │
│  │  Three.js   │  │  C++/WASM    │  │  Workspace  │ │
│  │  VanJS      │  │  Eigen 3.4   │  │  Tweakpane  │ │
│  │  Tweakpane  │  │  SparseLU    │  │  25+ demos  │ │
│  └──────┬──────┘  └──────┬───────┘  └──────┬──────┘ │
│         │    signals       │                 │        │
│         └─────────────────┼─────────────────┘        │
│                           │                          │
│                    ┌──────┴───────┐                   │
│                    │  deform.wasm │ ~350 KB           │
│                    │  (Eigen C++) │                   │
│                    └──────────────┘                   │
└──────────────────────────────────────────────────────┘
```

### Packages

| Package | Description |
|---------|-------------|
| `hekatan-fem` | FEM solver: `deform()`, `analyze()`, `modalAnalysis()`, `plateQ4Solve()`, `planeQ4Solve()`, C++/WASM bindings |
| `hekatan-ui` | UI: `getViewer()` (Three.js + colormap + legend), `getToolbar()`; exports reactive `colorMapForceUnit`, `colorMapDispUnit` |
| `examples` | Unified workspace + 25+ self-contained examples + `getCad3d.ts` legacy FEM Studio (being phased out) |
| `awatif-py` | **Python port de awatif v2** — pure numpy/scipy, API 1:1 (deform/analyze/modal_analysis), PyVista viewer, Qt + trame GUIs, 8 tests pytest |
| `hekatan-struct-py` | **Hekatan extensions sobre awatif-py** — selfweight automation, rigid diaphragm constraint, Cardinal Point offsets, MZC Kirchhoff plate, stiffness modifiers, Mesa Torsión paramétrica, iterator framework |

### C++ Solver (hekatan-fem/src/cpp/)

| File | Description |
|------|-------------|
| `deform.cpp` | Static analysis entry point; supports Winkler springs via 5th arg |
| `modal.cpp` | Eigenvalue analysis (K·φ = ω²·M·φ) |
| `didactic.cpp` | Didactic solver — returns all intermediate steps |
| `nonlinear.cpp` | Newton-Raphson nonlinear static |
| `cyclic_pushover.cpp` | Cyclic pushover analysis |
| `utils/getLocalStiffnessMatrix.cpp` | K_local 12×12 (Timoshenko) + Q4 shell |
| `utils/getTransformationMatrix.cpp` | T matrix (3D rotation) |
| `utils/getGlobalStiffnessMatrix.cpp` | Assembly with rigid offsets + releases |
| `utils/shellQ4.cpp` | Shell Q4: membrane + Mindlin plate + drilling DOF — **= ETABS Shell-Thick**. Holds every drilling formulation (`drillingTypes` 2/3/7/8/9, see [above](#the-membrane-element-and-its-drilling-dof)). ⚠️ **too stiff on a coarse mesh — see below** |
| `utils/shellThin.cpp` | **NUEVO: Shell Q4 Kirchhoff** = ETABS Shell-Thin (DKE Wilson Ch10), MZC plate bending puro, libre de shear locking. Validated <1.5% vs ETABS Mesa Torsión |
| `plate_q4/kirchhoff_q4.cpp` | Dedicated Mindlin / Kirchhoff plate solver (legacy, separate API) |

### Pure-TS solvers (no WASM)

| File | Description |
|------|-------------|
| `hekatan-fem/src/planeQ4.ts` | Q4 plane-stress element (`planeQ4Solve`): 2 DOFs/node, 2×2 Gauss, LU dense with partial pivoting, stress recovery (σxx, σyy, τxy, von Mises, principal) |

### Shell status vs ETABS (measured 2026-08-18) — superseded

This section used to carry the 2026-08-18 three-step benchmark (Thin 0.93 %,
Membrane 0.85 %, **Thick 11.28 % open**) and the diagnosis that MITC4's four
missing modes were the cause. Both are history: on 2026-09-01/02 the membrane
was closed by reproducing ETABS's measured 12×12 cell (`drillingTypes = 12`,
1e-13 %) and the Shell-Thick by reading CSI's own formulation out of
`CsiGo2.dll` (1e-12 % on ~140 measured cells). See
[The plate element](#the-plate-element-identifying-csis-shell-thick-2026-09-01)
and [`ESTADO_VS_ETABS.md`](./ESTADO_VS_ETABS.md). The Python regression
`hekatan-struct-py/tests/test_csi_thick_cells.py` guards it cell by cell.

### Import/Export

| Format | Import | Export | Software | round-trip |
|--------|:---:|:---:|----------|---|
| E2K | ✅ | ✅ | ETABS | **0.000 %** |
| S2K | ✅ | ✅ | SAP2000 | **0.000 %** |
| F2K | ✅ | ✅ | SAFE | ✅ 1.5e-3 % (real foundation, nodal Winkler) |
| IFC | ✅ | — | Revit, ArchiCAD | — |
| OpenSeesPy | ✅ | ✅ | OpenSees |
| OpenSees Tcl | ✅ | ✅ | OpenSees |

## Getting Started

```bash
git clone https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal.git
cd hekatan-struct-lineal
npm install
npm run dev:examples    # opens localhost:4600 (workspace auto-opens)
```

### Compile C++ → WASM (only needed if modifying C++)

```bash
# Install emsdk (one time)
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk && ./emsdk install latest && ./emsdk activate latest
source ./emsdk_env.sh

# Compile solver
cd hekatan-fem/src/cpp
em++ -O2 -Ieigen -I. \
  didactic.cpp utils/*.cpp \
  -sEXPORTED_FUNCTIONS=[_didactic_solve,_malloc,_free] \
  -sALLOW_MEMORY_GROWTH=1 -sMODULARIZE=1 -sEXPORT_ES6=1 \
  --no-entry -o built/deform.js
```

> The compiled `.wasm` and `.js` are **versioned in git** — you only need emsdk to modify C++ code.

### Deploy to GitHub Pages

```bash
# Build (MSYS_NO_PATHCONV prevents git-bash from mangling the deploy base)
MSYS_NO_PATHCONV=1 DEPLOY_BASE=/hekatan-struct-lineal/ npm run build -w examples

# Push the compiled bundle to gh-pages branch
npx gh-pages --dist website/src/examples \
  --repo https://github.com/GiorgioBurbanelli89/hekatan-struct-lineal.git \
  --branch gh-pages --dotfiles \
  --message "<commit message>"
```

## Validation

Solver validated against ETABS 22.6 via Python API (comtypes), plus Paz & Leigh Example 6.3 vs four solvers (browser-WASM, CLI-WASM, native C++, Python/SciPy — all 0.00% difference):

| Test | awatif/ETABS Ratio |
|------|:---:|
| Cantilever Timoshenko | 1.0000 |
| Portal frame | 1.0000 |
| 3D Space frame | 1.0000 |
| Shell Q4 membrane | 0.99–1.003 |
| Shell Q4 plate bending | 0.99–1.01 |
| Modal analysis (6 modes) | 1.0000 |
| Plane Q4 cantilever (flex+shear) | 1.10 FEM/teórico (expected for Q4 without incompatible modes) |

### Cross-validation framework against SAFE 20 (automated via API)

End-to-end framework that runs Hekatan `plateQ4Solve` and SAFE 20 (vía `SAFEv1.dll` + pythonnet) on the **exact same model** and compares N sampled points. Live in [`benchmarks/`](./benchmarks/) (índice y guía de uso) + [`benchmarks/safe/`](./benchmarks/safe/) (casos resueltos).

| # | Caso | Mesh | Cols | w_max Hekatan | w_max SAFE | Δ |
|---|------|:---:|:---:|:---:|:---:|:---:|
| 1 | [Zapata aislada 1.5×1.5×0.30m](./benchmarks/safe/zapata-aislada/) | 12×12 (144 Q4) | 1 | −4.5356 mm | −4.5370 mm | **+0.03%** |
| 2 | [Losa cimentación 6×8×0.50m, 6 cols 2×3](./benchmarks/safe/losa-cimentacion/) | 12×16 (192 Q4) | 6 | −1.5824 mm | −1.5870 mm | **+0.29%** |
| 3 | [Zapata combinada 4×2×0.40m, 2 cols alineadas](./benchmarks/safe/zapata-combinada/) | 16×8 (128 Q4) | 2 | −3.8458 mm | −3.8490 mm | **+0.08%** |
| 4 | [Zapata conectada 5×1m, t variable (0.40/0.20)](./benchmarks/safe/zapata-conectada/) | 20×4 (80 Q4) | 2 | −8.9003 mm | −8.898 mm | **−0.07%** |
| 5 | [Viga de cimentación 8×1×0.50m, 4 cols alineadas](./benchmarks/safe/viga-cimentacion/) | 32×4 (128 Q4) | 4 | −5.1093 mm | −5.1100 mm | **+0.01%¹** |
| 6 | [Edificio real 9 zap + 12 vigas amarre](./benchmarks/safe/edificio-cimentacion-real/) | 144 Q4 + 12 frames | 9 | −16.33 mm (col 3) | −27.12 mm | **no comparable²** |

**Casos 1-5 (plate-only): promedio Δ máx 0.14%, todos <0.33%.**

² **Caso 6 — resuelto el 2026-08-18, y NO era del solver.** Estuvo tres meses
marcado como «límite del Q4 sin drilling DOF». El motor ya lleva MITC4 +
drilling de Hughes-Brezzi + modos de Wilson, y el gap no venía de ahí: **los
dos modelos no tienen la misma carga**. En un suelo de Winkler la reacción
total tiene que igualar a la carga aplicada, y sumando `q·A` de las nueve
zapatas:

| | reacción del suelo | carga aplicada | |
|---|---|---|---|
| Hekatan | **19.31 tonf** | 19.27 tonf | **1.00 ×** ✔ |
| SAFE | **55.01 tonf** | 19.27 tonf | **2.85 ×** ✘ |

Hekatan cierra el equilibrio al **0.2 %**; el modelo de SAFE mete casi tres
veces la carga. Esas 55 t son el **peso propio** (zapatas 20.65 + vigas 14.40 +
pedestales 1.73 + cargas 19.27 = 56.05 t, o sea 1.9 % de lo medido), que SAFE
aplica aunque el script pida `SelfWeight = 0`. Para dar el caso por medido hay
que igualar la hipótesis de carga, no tocar el solver. Detalle en el
[README del caso 6](./benchmarks/safe/edificio-cimentacion-real/README.md).

⚠️ La lección: **antes de tocar el solver, comprobar el equilibrio**. Tres meses
de «bug de drilling» que se cerraban con una suma. Documentación API SAFE (con 8 gotchas críticos, incluyendo el bug silencioso de `SubModulus` que produce gap del 38% si se usa `SetAreaSpringProp(U3=ks)` ingenuamente): [`benchmarks/safe/README.md`](./benchmarks/safe/README.md).

¹ **Nota caso 5**: el modelo workspace `?t=safe-bench-viga-cimentacion` evolucionó al modelo compuesto realista (zapata corrida shell + viga frame + 4 pedestales frames), distinto al benchmark original de losa 8×1×0.50m pura. El benchmark `Δ +0.01%` se preserva en `/benchmarks/safe/viga-cimentacion/` (CLI standalone) y dejó de aplicar al workspace que muestra el modelo de viga de cimentación realista.

### 🌀 Mesa de Torsión — validación ETABS 19.1 Shell-Thin (DKE Kirchhoff)

Modelo CSI ETABS 19.1 (Gabriela/Seproinca 2020): pórtico 6×6 m × 4 m alto,
4 columnas C40×40 pinned-base, 4 vigas V30×50 perimetrales, losa 10 cm ShellThin,
diafragma rígido. Validado end-to-end vs ETABS API (modal + frame forces).

**Discretización auto-confirmada vía API**: 25 Q4 (5×5), 24 LineElm (4 cols + 4×5 vigas), 40 nodos.

| Componente | Hekatan (Shell-Thin DKE) | ETABS 19.1 | Δ% |
|---|---|---|---|
| T₁ lateral X | 0.343 s | 0.343 s | < 1% ✓ |
| T₂ lateral Y | 0.343 s | 0.343 s | < 1% ✓ |
| T₃ torsión Rz | 0.288 s | 0.288 s | < 1% ✓ |
| Dead V₂/V₃ | 0.444 t | 0.450 t | **−1.3% ✓** |
| Dead M₃ | 2.407 t·m | 2.430 t·m | −0.9% ✓ |
| UDCon2 P axial | 24.11 t | 24.86 t | −3% ✓ |
| UDCon2 M₃ | 15.49 t·m | 15.48 t·m | +0.05% ✓ |
| Live M₂ col (nudo z=4.0) | 2.461 t·m | 2.434 t·m | **+1.1% ✓** |
| Live M₂ col (cara z=3.5) | 2.153 t·m | 2.130 t·m | **+1.1% ✓** |

**Score: todas las cantidades dentro de ±5%.**

> **Resuelto el histórico "+15% en M₂ de columna"** (2026-06-03): no era un bug del
> solver sino una comparación inconsistente — Hekatan reportaba en el **nudo** (z=4.0)
> mientras ETABS reporta en la **cara del soporte** (z=3.5). El e2k tiene
> `CARDINALPT 8` (eje de viga en el tope) + `PZENDOFFSETSRIGID No`: el offset
> (peralte completo de viga = 0.50 m) **no rigidiza K**, sólo desplaza el punto de
> reporte. Reportando en la cara, M₂ cae a **+1.1%** en los 5 patrones de carga
> (Dead/Live/SCP/UDCon1/UDCon2, todos en −4%…+1%). Verificado por tres vías
> independientes: `hekatan-fem-py` (MZC), **Python DKE** (Batoz DKQ) y **Calcpad DKE**.

| Componente C++/WASM | Rol |
|---|---|
| `shellQ4.cpp` | Mindlin-Reissner = ETABS Shell-Thick (DSE Wilson Ch10) — default |
| `shellThin.cpp` ← NUEVO | MZC Kirchhoff = ETABS Shell-Thin (DKE Wilson Ch10) |
| `getLocalStiffnessMatrix.cpp` | Dispatcher según `ElementInputs.plateFormulations[idx]` (0/1) |
| `plate_mzc.py` (`hekatan-struct-py`) | Reference implementation puro numpy — validada primero |

**Live**:
- Workspace: [`?t=mesa-torsion`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=mesa-torsion)
- Standalone: [`/mesa-torsion/`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/mesa-torsion/)
- Validación cruzada Python: [`hekatan-struct-py/examples/mesa_torsion_iterate.py`](./hekatan-struct-py/examples/mesa_torsion_iterate.py)
- Validación M₂ < 5% (Python DKE vs Calcpad DKE vs ETABS): [`validacion/Calcpad/mesa_torsion/validar_mesa_torsion_python.py`](./validacion/Calcpad/mesa_torsion/validar_mesa_torsion_python.py) · Calcpad: [`mesa_torsion_DKE_completo.cpd`](./validacion/Calcpad/mesa_torsion/mesa_torsion_DKE_completo.cpd)
- ETABS API scripts: [`validacion/Api CSI Computers/etabs-api/python-verificado/`](./validacion/Api%20CSI%20Computers/etabs-api/python-verificado/) (15_mesa_torsion.py + 16_mesa_torsion_frame_forces.py)
- Reporte completo: [`validacion/Api CSI Computers/etabs-api/GUIA_API_ETABS.md`](./validacion/Api%20CSI%20Computers/etabs-api/GUIA_API_ETABS.md)

### Benchmarks libro Marcelo Guerra Avendaño MDI — Catálogo completo

Ejemplos de ejercicios resueltos del libro **"Cimentaciones Sismo Resistentes utilizando SAFE"** (Ing. Marcelo Guerra Avendaño MDI, 2013), referencia ecuatoriana de cimentaciones. Cada ejemplo tiene:
- ✅ Implementación Hekatan-struct con datos exactos del libro
- ✅ Script Python SAFE-API correspondiente en `validacion/Api CSI Computers/safe-api/ejN_*.py`
- ✅ `safe-reference.json` con valores del libro + bloque `safe_api_live` con corrida real de SAFE 20

Categoría en workspace: **📚 Libros · SAFE - Marcelo Guerra**

| Ej | Tema | ID workspace | Pag. libro | Modelo Hekatan | σ_max validado |
|---|---|---|---|---|---|
| **1** | Zapata aislada cuadrada (3.45×3.45×0.45) | [`guerra-ej1-zapata-cuadrada`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=guerra-ej1-zapata-cuadrada) | 17-42 | Shell Q4 Winkler + self-weight + load distribuido en huella columna | **13.27 t/m²** vs libro 13.163 (+0.8%) ✅ triple cross con Python FEM |
| **2** | Zapata rectangular + sismo (4.60×4.00, e>L/6) | [`guerra-ej2-zapata-rectangular-sismo`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=guerra-ej2-zapata-rectangular-sismo) | 42-58 | + combos servicio/último D+L y D+L+S | 14.62 servicio (q_adm=14 cumple) |
| **3** | Rectangular EXCENTRICIDAD GRANDE (e=1.29m >> L/6) | [`guerra-ej3-zapata-rectangular-eccentricidad-grande`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=guerra-ej3-zapata-rectangular-eccentricidad-grande) | 69-72 | M_live=96 t·m vs Ej.2 de 36 | 18.81 (q_adm=20 cumple) |
| **4** | Combinada rectangular (2 cols 90/100, L=7.50m) | [`guerra-ej4-zapata-combinada-rectangular`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=guerra-ej4-zapata-combinada-rectangular) | 74-90 | Shell único + cols distribuidas | 25.70 FEM (libro rígido 16.02) |
| **5** | Combinada TRAPEZOIDAL (B1=3.75 → B2=1.60) | [`guerra-ej5-zapata-combinada-trapezoidal`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=guerra-ej5-zapata-combinada-trapezoidal) | 93-112 | Mesh bbox + máscara trapezoidal | σ_uniforme≈19.96 libro |
| **6** | Zapata unida con viga amarre (2 zapatas + frame) | [`guerra-ej6-zapata-unida-viga-amarre`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=guerra-ej6-zapata-unida-viga-amarre) | 113-130 | Wrapper sobre `zapata-viga-amarre` con Hp≈0 (sin pedestal frame). 2 shells + viga V45×95 frame entre cols. SAFE-API: σ_max=23.77 t/m² | libro Fig.180: 26.18 (-9.2%) |
| **7** | Viga de cimentación L=17.20m, 4 cols c/M (NEW formato) | [`guerra-ej7-viga-cimentacion-new`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=guerra-ej7-viga-cimentacion-new) | 135-148 | Shell único + 4 cols distribuidas | mismo libro 18 |
| **7-old** | Viga cimentación L=17.20m (formato shell+frame+pedestal) | [`viga-cim-guerra-ej7`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=viga-cim-guerra-ej7) | 135-148 | Shell zapata + frame viga + 4 frames pedestal | ✓ validado |
| **7-T** | Viga cimentación variante **T-invertida** (Hetényi) | [`viga-cim-guerra-ej7-tinv`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=viga-cim-guerra-ej7-tinv) | 135-148 | Frame T-section (ala B×t_zap + alma b_viga×h_viga) + frames pedestal · Winkler 1D | ✓ validado |
| **8** | Losa de cimentación (raft 23×21m, 16 cols grid 4×4) | [`guerra-ej8-losa-cimentacion`](https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?t=guerra-ej8-losa-cimentacion) | 149-170 | Shell único raft + 16 cargas col en grid | σ_promedio libro 5.85 |

**Convención**: todos los ejemplos usan datos exactos del libro (P_CM, P_CV, M_CM, M_CV por columna; f'c según ejercicio; q_adm y ks por tipo de suelo). El folder "📊 Calculados" muestra σ_max/σ_min Hekatan vs valores del libro y vs SAFE-API live, con `Δ%` automático.

**Validación cruzada SAFE-API**: cada ejercicio tiene un script Python en `validacion/Api CSI Computers/safe-api/` que arma el modelo SAFE 20 desde cero via `pythonnet`, corre análisis, y dumpea resultados a JSON. Esto permite triple cross-check Hekatan ↔ Python FEM ↔ SAFE 20 nativo. Validado a <1% en Ej.1, <10% en los demás (diff principal: SAFE usa frame coupling completo de viga amarre + pedestales, Hekatan modelos simplificados).

**PowerShell extractor** (opcional): `Safe Powershell/safe_extract_clean.ps1` permite abrir cualquier `.fdb` o `.f2k` desde CLI y extraer resultados a JSON sin pasar por Python:
```powershell
powershell -ExecutionPolicy Bypass -File "Safe Powershell\safe_extract_clean.ps1" `
  -ModelPath "C:\CSi_SAFE_API_Example\guerra_ej6.f2k" `
  -OutPath "results.json"
```

## Stack

| Technology | Purpose |
|-----------|---------|
| **C++ / Eigen 3.4** | FEM solver (SparseLU, eigenvalues) |
| **Emscripten** | C++ → WebAssembly compiler |
| **Three.js** | 3D rendering (WebGL) |
| **VanJS** | Reactive state management (1.5 KB) |
| **Tweakpane** | Unified UI — *single source of truth, no custom panels* |
| **math.js** | Matrix operations in calc panel |
| **KaTeX** | LaTeX equation rendering |
| **nerdamer** | Symbolic math (derivatives, integrals) |
| **web-ifc** | IFC geometry parser (WASM) |
| **Vite** | Build tool / dev server |

## Author

**Jorge Burbano** — Structural Engineer, Ecuador
- LinkedIn: [jorge-burbano-213741138](https://www.linkedin.com/in/jorge-burbano-213741138/)
- Also creator of [Hekatan Calc](https://github.com/GiorgioBurbanelli89) — math/engineering desktop app (.NET/WPF)

## Credits

- [awatif v2.0.0](https://github.com/madil4/awatif/tree/v2.0.0) by Mohamed Adil — original UI framework and viewer (~10% of the current codebase; thank you!)
- [Eigen 3.4](https://eigen.tuxfamily.org/) — C++ linear algebra
- [web-ifc](https://github.com/ThatOpen/engine_web-ifc) — IFC parser by That Open Company
- Dr. Roberto Aguiar — Timoshenko beam formulation and parametric building methodology
- Edward Wilson — Shell element formulation (incompatible modes, drilling DOF)

## License

MIT (inherited from awatif). See [LICENSE](LICENSE) for details.
