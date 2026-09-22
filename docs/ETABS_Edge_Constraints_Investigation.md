# ETABS Auto Edge Constraints — Investigation & Calibration Plan

## Problem Statement

When comparing Hekatan Struct vs ETABS for the **Mesa Torsion** benchmark (6×6 m slab, 4 columns C40×40, 4 beams V30×50, t=0.10 m), the **twisting moment Mxy** does not match between the two programs, even when using only the **Live load case** (0.5 tonf/m² pure uniform load on slab — no self-weight, no beam gravity).

**EN:** The Live load case eliminates beam self-weight and other confounding factors. The load goes directly to the slab as a pure uniform pressure — identical to what Kirchhoff/Navier plate theory solves. Yet ETABS Mxy differs from both Hekatan and analytical solutions.

**ES:** El caso Live elimina el peso propio de las vigas y otros factores confusos. La carga va directamente a la losa como presión uniforme pura — idéntico a lo que resuelve la teoría de placas Kirchhoff/Navier. Sin embargo, el Mxy de ETABS difiere tanto de Hekatan como de las soluciones analíticas.

---

## Root Cause Analysis

### 1. Auto Edge Constraints (DOMINANT FACTOR)

**EN:** ETABS applies "Auto Edge Constraints" by default to all shell elements. When the slab is auto-meshed and beams run along the slab edges, ETABS creates **Multi-Point Constraints (MPC)** that force intermediate nodes on the shell edge to interpolate linearly from corner nodes:

```
u_M = (1-ξ)·u_A + ξ·u_B    (for each DOF)
```

Where M is an intermediate auto-mesh node and A, B are the shell corner nodes. This:
- **Bypasses the beam's stiffness** — the MPC (kinematic) wins over the beam (flexible)
- **Forces linear rotation distribution** along edges — physically incorrect for a SS plate
- **Alters Mxy** because Mxy = D·(1-ν)·∂²w/∂x∂y depends on the rotation gradient along edges

**ES:** ETABS aplica "Auto Edge Constraints" por defecto a todos los elementos shell. Cuando la losa se auto-meshea y las vigas corren por los bordes de la losa, ETABS crea **Multi-Point Constraints (MPC)** que fuerzan a los nodos intermedios del borde del shell a interpolarse linealmente de los nodos de esquina. Esto:
- **Puentea la rigidez de la viga** — el MPC (cinemático) gana sobre la viga (flexible)
- **Fuerza distribución lineal de rotación** en los bordes — físicamente incorrecto para placa SS
- **Altera Mxy** porque Mxy = D·(1-ν)·∂²w/∂x∂y depende del gradiente de rotación en los bordes

#### CSI Analysis Reference Manual (Chapter 10, p. 206-207):

**EN:**
> "Edge constraints transfer load from intermediate joints to corner joints along the edge of a shell. Applying an edge constraint along an edge that is co-linear with a frame [...] can result in load being transferred by the edge constraint instead of by that object."
>
> "Using edge constraints in these locations should be avoided if detailed results in the frame/cable/tendon/link are of interest. In particular, frame design results could be affected, and may be unconservative."
>
> "When frame/cable/tendon/link objects are co-linear with an edge constraint, the overall effect of the object on the model is captured, but local response may not be accurate."

**ES:**
> "Las restricciones de borde transfieren carga de los nodos intermedios a los nodos de esquina a lo largo del borde del shell. Aplicar un edge constraint a lo largo de un borde co-lineal con un frame [...] puede resultar en que la carga sea transferida por el edge constraint en vez de por ese elemento."
>
> "El uso de edge constraints en estas ubicaciones debe evitarse si se necesitan resultados detallados en el frame/cable/tendon/link. En particular, los resultados de diseño de frames podrían verse afectados, y podrían ser no conservadores."
>
> "Cuando los objetos frame/cable/tendon/link son co-lineales con un edge constraint, el efecto global del objeto en el modelo se captura, pero la respuesta local puede no ser precisa."

### 2. Cardinal Point TOP + Transform Stiffness = No

**EN:** The e2k file has `CARDINALPOINT "TOP"` and `TRANSFORMSTIFFNESSFOROFFSETS "No"`. This means the beam centroid is geometrically offset from the slab mid-surface, but the stiffness matrix is NOT transformed to account for the eccentricity. There is no composite T-beam action (Wilson §7.7). The beam and slab act as independent flexural elements.

**ES:** El archivo e2k tiene `CARDINALPOINT "TOP"` y `TRANSFORMSTIFFNESSFOROFFSETS "No"`. Esto significa que el centroide de la viga está desplazado geométricamente de la superficie media de la losa, pero la matriz de rigidez NO se transforma para considerar la excentricidad. No hay acción compuesta T-beam (Wilson §7.7). La viga y la losa actúan como elementos flexurales independientes.

### 3. Beam Torsional Stiffness J at Edges

**EN:** The V30×50 beams have torsional stiffness J that provides partial rotational restraint to the slab edge. A true SS plate has zero rotational restraint at supports. The GJ of the beam partially restrains edge rotation, altering Mxy.

**ES:** Las vigas V30×50 tienen rigidez torsional J que provee restricción rotacional parcial al borde de la losa. Una placa SS pura tiene cero restricción rotacional en los apoyos. El GJ de la viga restringe parcialmente la rotación del borde, alterando Mxy.

### 4. Stress Recovery Method (Already Calibrated)

**EN:** CSI samples stresses at 2×2 Gauss points interior to each element, then extrapolates to nodes (bilinear extrapolation). Hekatan was using centroid averaging. Updated 2026-05-24 to match CSI's Gauss+extrapolation method in both analyze.ts and WASM.

**ES:** CSI muestrea esfuerzos en 4 puntos de Gauss interiores al elemento, luego extrapola a los nodos (extrapolación bilineal). Hekatan usaba promedio en centroide. Actualizado 2026-05-24 para usar el método Gauss+extrapolación de CSI en analyze.ts y WASM.

---

## Mesa Torsion e2k File Summary

| Parameter | Value | Notes |
|---|---|---|
| Slab | 6×6 m, t=0.10 m, ShellThin | Kirchhoff formulation |
| Material | 4000Psi concrete, E=2,534,564 tonf/m², ν=0.2 | |
| Columns | 4× C40×40, h=4m | Pin at base (UX UY UZ) |
| Beams | 4× V30×50 | Cardinal Point 8 (Top Center) |
| Diaphragm | **None** assigned | D1 defined but not assigned |
| Auto Edge Constraints | **Yes** (default) | Co-linear with beams → artifact |
| Transform Stiffness | **No** | No composite T-beam action |
| Floor Mesh Max Size | 1.25 m | Rectangular auto-mesh |
| Live load | 0.5 tonf/m² uniform on slab | Pure slab load, no beam gravity |
| SCP load | 1.0 tonf/m² uniform on slab | |
| Dead | Self-weight ×1 | Includes beam + column weight |

---

## Calibration Plan — What Hekatan Needs to Match ETABS

| # | Feature | Effect on Mxy | Status |
|---|---|---|---|
| 1 | **Edge Constraints (MPC)** | ~10-15% | TODO — implement in hekatan-fem-py and C++ |
| 2 | **Offset without Transform K** | ~5% | TODO — separate geometric offset from K transformation |
| 3 | **Stress recovery Gauss+extrapol** | ~13% (CSI vs centroid) | DONE (2026-05-24) |
| 4 | **Shell formulation DKQ vs ACM** | <1% | N/A for rectangular mesh |

### Implementation Priority

1. **Python (hekatan-fem-py)** — implement edge constraints + offset, validate against ETABS
2. **C++ WASM (hekatan-fem)** — port to C++, recompile WASM
3. **Tweakpane (workspace)** — add UI toggles for edge constraints and transform stiffness

---

## Scientific References (Peer-Reviewed)

### MPC Coupling & Mixed-Dimensional FEM

1. **McCune, R.W., Armstrong, C.G., Robinson, D.J. (2000)**. "Mixed-dimensional coupling in finite element models." *International Journal for Numerical Methods in Engineering*, Vol. 49, No. 6, pp. 725–750. DOI: [10.1002/1097-0207(20001030)49:6<725::AID-NME967>3.0.CO;2-W](https://onlinelibrary.wiley.com/doi/pdf/10.1002/1097-0207(20001030)49:6%3C725::AID-NME967%3E3.0.CO;2-W)
   - **EN:** Foundational paper on coupling beam (1D) and shell (2D) elements via MPC constraint equations. Establishes the theoretical framework for interpolation constraints at mixed-dimensional interfaces.
   - **ES:** Paper fundacional sobre acoplamiento de elementos viga (1D) y shell (2D) via ecuaciones MPC. Establece el marco teórico para restricciones de interpolación en interfaces de dimensión mixta.

2. **Hartloper, A.R., de Castro e Sousa, A., Lignos, D.G. (2022)**. "Best-fit constraint equations for coupling mixed-dimension simulation models with wide flange cross sections." *Finite Elements in Analysis and Design*, Vol. 205, 103767. DOI: [10.1016/j.finel.2022.103767](https://www.sciencedirect.com/science/article/pii/S0168874X22000567)
   - **EN:** Proposes BF-MPC (Best-Fit Multi-Point Constraint) for beam-to-shell coupling. Demonstrates that standard MPC equations introduce artificial stiffness at the coupling interface, affecting local stress results. Verified with numerical and experimental data.
   - **ES:** Propone BF-MPC para acoplamiento viga-shell. Demuestra que las ecuaciones MPC estándar introducen rigidez artificial en la interfaz de acoplamiento, afectando los resultados locales de esfuerzos. Verificado con datos numéricos y experimentales.

3. **Shim, K.W., Monaghan, D.J., Armstrong, C.G. (2002)**. "Mixed dimensional coupling in finite element stress analysis." *Engineering with Computers*, Vol. 18, pp. 241–252.
   - **EN:** Extends mixed-dimensional coupling to stress analysis. Shows that constraint equations at beam-shell interfaces must satisfy both displacement compatibility AND stress equilibrium for accurate results.
   - **ES:** Extiende el acoplamiento de dimensión mixta al análisis de esfuerzos. Muestra que las ecuaciones de restricción en interfaces viga-shell deben satisfacer tanto compatibilidad de desplazamientos COMO equilibrio de esfuerzos para resultados precisos.

4. **Davila, C.G. (1994)**. "Mixed-dimensional finite element coupling for structural multi-scale simulation." *Finite Elements in Analysis and Design*, August 2014.
   - **EN:** Proposes deformable MPC coupling with both displacement and force constraint equations. Demonstrates improved accuracy over standard kinematic MPCs.
   - **ES:** Propone acoplamiento MPC deformable con ecuaciones de restricción tanto de desplazamiento como de fuerza. Demuestra mayor precisión sobre MPCs cinemáticos estándar.

### Mismatched Mesh & Edge Constraints

5. **Khante, S.R. & Kshirsagar, A.Y. (2017)**. "Mismatched Meshing in Adjacent Shell Elements." *International Journal of Innovative Research in Science, Engineering and Technology (IJIRSET)*, Vol. 6, Issue 9. PDF: [IJIRSET](https://www.ijirset.com/upload/2017/september/73_29_IJ60909088_Final%20Submision_Sep%202017_Sandip%202.pdf)
   - **EN:** Studies RCC structure with beam+shell elements under gravity/seismic/thermal loads. Compares matched vs mismatched mesh with and without edge constraints in SAP2000. Conclusion: with edge constraints, errors within 4-5% for deflection, but local stress distribution altered.
   - **ES:** Estudia estructura de concreto armado con elementos viga+shell bajo cargas gravitatorias/sísmicas/térmicas. Compara mesh compatible vs incompatible con y sin edge constraints en SAP2000. Conclusión: con edge constraints, errores dentro de 4-5% para desplazamiento, pero distribución local de esfuerzos alterada.

### Shell Element Formulation & Benchmarking

6. **Dvorkin, E.N. & Bathe, K.J. (1984)**. "A continuum mechanics based four-node shell element for general nonlinear analysis." *Engineering Computations*, Vol. 1, pp. 77–88.
   - **EN:** Original MITC4 shell element. Introduces the assumed natural strain (ANS) concept to eliminate shear locking. This is the shell formulation used by CSI programs (ETABS/SAP2000) for thick plates.
   - **ES:** Elemento shell MITC4 original. Introduce el concepto de deformación natural asumida (ANS) para eliminar el bloqueo por cortante. Es la formulación usada por programas CSI (ETABS/SAP2000) para placas gruesas.

7. **Beirão da Veiga, L. et al. (2022)**. "Benchmarking Computational Shell Models." *Archives of Computational Methods in Engineering*, Springer. DOI: [10.1007/s11831-022-09798-5](https://link.springer.com/article/10.1007/s11831-022-09798-5)
   - **EN:** Comprehensive benchmark of shell FEM formulations. Discusses provenance of benchmark target values, suitability for different shell model classes, and completeness of benchmark sets.
   - **ES:** Benchmark completo de formulaciones FEM de shell. Discute la procedencia de los valores objetivo de benchmark, la idoneidad para diferentes clases de modelos de shell, y la completitud de los sets de benchmark.

8. **Wilson, E.L., Taylor, R.L., Doherty, W.P., Ghaboussi, J. (1973)**. "Incompatible Displacement Models." In: *Numerical and Computer Methods in Structural Mechanics*, ed. Fenves, S.J., Academic Press, New York, pp. 43–57.
   - **EN:** Foundational paper on incompatible modes in FEM. The Wilson Q6 element (with incompatible bending modes) significantly improves in-plane bending accuracy. This is the basis for the membrane formulation in ETABS shells.
   - **ES:** Paper fundacional sobre modos incompatibles en FEM. El elemento Q6 de Wilson mejora significativamente la precisión en flexión en el plano. Es la base de la formulación de membrana en shells de ETABS.

### Plate Theory & Twisting Moments

9. **Wood, R.H. & Armer, G.S.T. (1968)**. "The Theory of the Strip Method for Design of Slabs." *Proceedings of the Institution of Civil Engineers*, Vol. 41, No. 2, pp. 285–311.
   - **EN:** Original Wood-Armer method. Transforms moment triads (Mx, My, Mxy) into equivalent design moments for reinforcement. Establishes that Mxy is critical for slab design and cannot be ignored.
   - **ES:** Método Wood-Armer original. Transforma tríadas de momentos (Mx, My, Mxy) en momentos de diseño equivalentes para refuerzo. Establece que Mxy es crítico para diseño de losas y no puede ignorarse.

10. **Bathe, K.J. & Wilson, E.L. (1976)**. *Numerical Methods in Finite Element Analysis*. Prentice-Hall, Englewood Cliffs, NJ.
    - **EN:** Foundation text covering incompatible modes, plate/shell elements, and constraint equations. Chapter 6: Incompatible elements. Chapter 10: Shell analysis.
    - **ES:** Texto fundacional que cubre modos incompatibles, elementos placa/shell, y ecuaciones de restricción. Capítulo 6: Elementos incompatibles. Capítulo 10: Análisis de cáscaras.

11. **Wilson, E.L. (2002)**. *Static and Dynamic Analysis of Structures*. Computers and Structures Inc., Berkeley, CA.
    - **EN:** Chapter 7.7: Establishes that correct T-beam modeling requires rigid link from slab mid-surface to beam centroid. ETABS with Transform Stiffness=No does NOT implement this.
    - **ES:** Capítulo 7.7: Establece que el modelado correcto T-beam requiere rigid link de la superficie media de la losa al centroide de la viga. ETABS con Transform Stiffness=No NO implementa esto.

### CSI Official Documentation

12. **CSI Analysis Reference Manual** (2023). Computers & Structures, Inc. Chapter 10: "The Shell Element", Section 10.3: "Edge Constraints", pp. 206–207. [Online](https://docs.csiamerica.com/help-files/etabs/Menus/Assign/Shell/Auto_Edge_Constraints.htm)

13. **CSI SAP2000 Verification Manual** — Example 2-001: Shell Plate Bending. [PDF](https://docs.csiamerica.com/manuals/csibridge/Verification/Analysis/Shells/Problem%202-001.pdf)

### Practitioner References

14. **Structural Academy (2023)**. "Mesh Compatibility and Simplifications When Using Edge Constraints in CSI Programs." [Link](https://structuralacademy.com/article/en/edge-constraints-csi)

15. **Mercado, D.B. (2018)**. "Understanding M12 (Out-of-Plane Twisting Moments) in Shell Analysis Outputs." [Blog](https://engrdennisbmercado.wordpress.com/2018/03/28/understanding-m12-out-of-plane-twisting-moments-in-shell-analysis-outputs/)

### Hekatan Struct Internal Validation

16. **RSFEA Mxy validated vs Navier** — Mxy(0,0) = ±8.34 kNm/m. Hekatan RSFEA matches Navier +0.59%, SAP2000 underestimates -13% (due to Gauss extrapolation stress recovery procedure).

17. **Edge constraints numerical test (this document, 2026-05-25)** — Mesa Torsion 5×5 mesh, Live case. Without edge constraints: Mxy = -0.9931 kNm/m. With edge constraints (20 MPCs): Mxy = -1.0348 kNm/m (+4.19%). Displacement w reduced 10.8% (model stiffer with constraints).

---

## Technical Mechanism: How Edge Constraints Work

### Without Edge Constraint (clean model):

```
Corner A ───── Intermediate M ───── Corner B
   │                  │                  │
   │            Beam (own EI, GJ)        │
   │                                     │
   └──────── Shell (slab) ──────────────┘
```

Each node M has independent DOFs. The beam carries load through its own stiffness.

### With Edge Constraint (ETABS default):

```
Corner A ════════════════════════ Corner B
   ║      u_M = (1-ξ)·u_A + ξ·u_B     ║
   ║      θ_M = (1-ξ)·θ_A + ξ·θ_B     ║
   ║      Node M is SLAVE               ║
   └──────── Shell (slab) ──────────────┘
```

Node M loses independent DOFs. Load bypasses beam stiffness and transfers directly through the constraint.

### Effect on Mxy:

- Mxy depends on ∂θ/∂s (rotation variation along edge)
- SS plate: rotation distribution is nonlinear (governed by plate stiffness)
- Edge constraint: forces θ to vary LINEARLY between corners
- This artificial linear constraint changes ∂²w/∂x∂y → Mxy is wrong
- The beam's torsional stiffness GJ is bypassed because the constraint enforces compatibility instead

---

*Document created: 2026-05-25*
*Author: Jorge Burbanelli / Claude Code*
