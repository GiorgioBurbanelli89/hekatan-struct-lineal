# Formulaciones de Wilson y de CSI en Hekatan Struct Py

Submódulo `hekatan_struct.csi` (también `hekatan_struct_py.csi`). Todas las K con la misma firma:

```python
from hekatan_struct import csi
K = csi.k_shell_thick_cuad(xy, E, nu, t)     # xy: nudos antihorarios en el plano del elemento
```

GDL por nudo: placa $[w,\ \theta_x,\ \theta_y]$ con $\theta_x = \partial w/\partial y$, $\theta_y = -\partial w/\partial x$;
membrana $[u,\ v,\ \theta_z]$.

Tabla reproducible (recalcula los errores con los datos ya medidos, no abre SAP2000 ni ETABS):

```bash
python examples/comparar_con_sap_etabs.py        # o: python -m hekatan_struct.csi.comparar
pytest tests/test_csi_vs_medido.py
```

## Estado: elemento × juez

✔ verificado con test · ✔* anotado en bitácora, sin datos en el paquete · ⏳ falta · ✘ comparado y NO coincide · — no aplica

| función | fuente | SAP2000 24 | ETABS 22 | libro / analítico |
|---|---|---|---|---|
| `k_membrana_csi` | Allman, ITW 1990; Wilson (9.8); constantes CSI medidas | ✔ 12 mallas ITW, ≤ 1.2e-10 % de \|u\| (⏳ K12 directa) | ✔ K12, 12 celdas, ≤ 2.1e-15 | ✔ ITW Tabla II ≤ 0.15 %; leyes θθ exactas |
| `k_shell_thin_dkq` | Batoz y Tahar 1982 | ✔ reacciones < 1e-5 %, M a 1e-6 | ✔ K 12×12 3.5e-14 % | ✔ Navier |
| `k_shell_thin_dkt` | Batoz, Bathe y Ho 1980 | ✔ reacciones < 1e-5 %, M a 1e-6 | ✔* 0.000 % | ✔ patch test |
| `k_shell_thick_cuad` | Wilson cap. 8 + MITC4 simetrizado + 8 puntos CANM 7 + penalización | ✔ K 12×12, 136 celdas ≤ 5.8e-11 % | ✔ K 12×12, 4 celdas ≤ 1e-12 % | — (patch test exacto) |
| `k_shell_thick_tri` | medido (lados 4·La·Lb, cortante de Wilson, B-barra) | ✔ reacciones < 1e-5 %, M, V13/V23 a 1e-6 | ✔* reacciones 1.1e-5 % | — |
| `k_dke` | Wilson 2005 (8.21) | ✔ (= DKQ a 1e-12) | ✔ (= DKQ) | ✔ Tablas 8.1–8.3 ≤ 0.15 % |
| `k_dse` | Wilson 2005 (8.18)–(8.19) | ✘ no es el Thick de CSI (64–139 %) | ✘ | ✔ Tablas 8.1–8.3 ≤ 0.15 % |
| `Placa` (multi-elemento) | ensamblado | ⏳ | ⏳ | ✔ Navier, ΣR |

Shell-Thick cuadrilátero: 140 de 142 celdas medidas < 1e-10 %. Las 2 restantes (un solo modificador m11 o m22
distinto de 0) dan 0.0095 % y 0.59 %: el resto es de rango 1, un pivote casi nulo que CSI divide en vez de saltar.

## Fórmulas

### Membrana con giro normal (`k_membrana_csi`)

Desplazamiento de Allman por lados (ITW 1990, §2-3), lado $k$ del nudo $k$ al $k+1$:

$$\mathbf u = \sum_{i=1}^{4} N_i\,\mathbf u_i + \sum_{k=1}^{4} N_{k+4}\,\frac{l_k}{8}\,(\theta_{k+1}-\theta_k)\,\mathbf n_k
 + N_B\,\mathbf a_B,\qquad N_B=(1-r^2)(1-s^2)$$

Proyección del giro (Wilson 2005, ec. 9.8): las columnas $\theta$ de $\mathbf B$ con media nula,
$\mathbf B_\theta \leftarrow \mathbf B_\theta - \frac{1}{A}\int_A \mathbf B_\theta\,dA$. Gauss 2×2.

$$\mathbf K = \operatorname{Schur}_{B}\!\Big(\sum_{2\times 2} w\,|J|\,\mathbf B^{T}\mathbf D\,\mathbf B
 + 0.1\,G t A\,(2\mathbf b_0)(2\mathbf b_0)^T + 5\cdot10^{-5}\,G t A\,\mathbf h\mathbf h^T\Big)$$

$\mathbf b_0$ = $\tfrac12(\partial_x v-\partial_y u)-\theta$ en el centro (penalización (38) de ITW 1990 a un punto con
$\gamma = 0.4\,G$); $\mathbf h = [1,-1,1,-1]$ en los $\theta$. Leyes del cuadrado, $\mathbf h^T K_{\theta\theta}\mathbf h/(GtA)$:
uniforme $1/10$, cruzado $1/(18-6\nu)$, reloj de arena $2\cdot10^{-4}$.

### Shell-Thin (`k_shell_thin_dkq`, `k_shell_thin_dkt`, `k_dke`)

Kirchhoff discreto: $\gamma = 0$ en los lados. DKE de Wilson (8.21):

$$\Delta\theta_{ij} = \frac{3}{2L}(w_j-w_i) - \frac34(\theta_i+\theta_j),\qquad
\mathbf K = \sum_{2\times2} w\,|J|\,\mathbf B_b^T\mathbf D_b\mathbf B_b$$

que es la DKQ de Batoz y Tahar (1982) a 1e-12. DKT: 3 puntos en los puntos medios de los lados.

### Shell-Thick cuadrilátero (`k_shell_thick_cuad`)

Giros con 9 funciones: $\boldsymbol\theta = \sum_{a=1}^{9} N_a\,\boldsymbol\theta_a$, $N_{5..8}$ jerárquicas de lado
(Wilson 8.1–8.2, con DOS componentes por lado), $N_9$ burbuja. Curvaturas (Wilson 8.10):
$\kappa_x=\theta_{y,x}$, $\kappa_y=-\theta_{x,y}$, $\kappa_{xy}=\theta_{y,y}-\theta_{x,x}$.

Cortante de lado (Wilson 8.7):

$$\gamma_k = \frac{w_j-w_i}{L} - \frac{s_k}{2}(\theta_{x,i}+\theta_{x,j}) + \frac{c_k}{2}(\theta_{y,i}+\theta_{y,j})
 - \tfrac23 s_k\,\theta_{x,k} + \tfrac23 c_k\,\theta_{y,k}$$

Campo covariante con la parte lineal simetrizada: $\gamma_\xi = A + m\,\eta$, $\gamma_\eta = C + m\,\xi$,
$m = (b+d)/2$; $(\gamma_x,\gamma_y) = J^{-1}(\gamma_\xi,\gamma_\eta)$.

$$\mathbf K_{22} = \sum_{8\ \text{ptos}} w_a|J|\left(\mathbf B^T\!\begin{bmatrix}\mathbf D_b&0\\0&\mathbf D_s\end{bmatrix}\!\mathbf B
 + 1000\,\operatorname{tr}(\mathbf D_b)\,\mathbf v\mathbf v^T\right),\qquad \mathbf v\cdot\mathbf a = \theta_{x,x}+\theta_{y,y}$$

$\mathbf D_s = \tfrac56 G t\,\mathbf I$. Regla de 8 puntos (Ibrahimbegović y Wilson, CANM 7 1991, ec. 30): $\pm\sqrt{7/9}$ peso $9/49$,
$\pm\sqrt{7/15}$ en ejes peso $40/49$. B-barra en las 10 columnas internas (Wilson 8.17) y condensación
$22\to12$ saltando pivotes nulos.

### DSE de Wilson (`k_dse`)

Igual que el DKE pero con $\mathbf D_s$ y los 4 $\Delta\theta$ (una componente, normal al lado) condensados,
(8.18)–(8.19). NO es el Thick de CSI: CSI usa dos componentes por lado, burbuja, 8 puntos y penalización.

## ⏳ Lo que falta y cómo medirlo (cuando haya ~5 GB de RAM libres; no tocar instancias abiertas de Jorge)

1. **K12 de membrana en SAP2000.** Correr `sap_celda_membrana12.py` (repo privado de ingeniería inversa,
   carpeta `csi_drilling`): áreas Membrane (5), Shell-Thin (1) y Shell-Thick (2) en las 10 celdas de
   `memb12`, w, θx, θy sujetos, carga unidad en los 9 GDL libres → F 9×9 → `memb12_sap.json`. Luego
   `python verificar.py` la compara; añadirla a `tests/datos_csi/medidas_csi.json.gz` como
   `membrana_sap` y extender `test_membrana_vs_etabs` a ese conjunto (umbral 1e-12).
2. **Membrana del triángulo de SAP2000** (resto 4e-6…5e-5 de |K| en θθ). Datos ya medidos:
   `hekatan-struct/validation/pandeo_cascara/sap_tri_flex.json` (5 geometrías, K 9×9 por flexibilidad);
   prototipo `proto_mem_tri.py`. Falta la forma exacta del bloque θθ (SAP no es simétrico ante la
   reflexión del triángulo). Si hace falta otra medida: `sap_tri_flex.py` con más geometrías (reflejadas).
3. **Cáscara curva (hemisferio ITW)**: con esta membrana montada en Struct, 4×4 −2.93 %, 8×8 −1.10 %,
   16×16 −0.38 % frente a SAP2000 (`validation/insercion/sap_hemisferio.py`, juez ya medido). Falta
   el ensamblado de cáscara en Python con `k_membrana_csi` + `k_shell_thin_dkq` y ejes locales de CSI
   (`validation/itw_python/hemisferio_py.py` como base) para separar elemento de ensamblado.
4. **Shell-Thick con un solo modificador m11/m22**: emular el bucle de condensación de CSI (pivote
   casi nulo dividido en lugar de saltado).
5. **Shell-Thick triángulo**: K 9×9 por flexibilidad en SAP2000 y ETABS (hoy solo reacciones, M y V).
6. **Membrana**: ν en geometrías no cuadradas en SAP2000, material ortótropo, modificadores f11/f22/f12
   sobre la 12×12.

## Referencias

- E. L. Wilson, *Three-Dimensional Static and Dynamic Analysis of Structures*, CSI, 2005, cap. 8 (pp. 8-3…8-10)
  y cap. 9 (ec. 9.8, 9.10).
- A. Ibrahimbegović, R. L. Taylor, E. L. Wilson, «A robust quadrilateral membrane finite element with drilling
  degrees of freedom», IJNME 30 (1990) 445–457.
- A. Ibrahimbegović, E. L. Wilson, «A Unified Formulation for Triangular and Quadrilateral Flat Shell Finite
  Elements with Six Nodal Degrees of Freedom», CANM 7 (1991) 1–9, ec. 30 (regla de 8 puntos; el peso 9/49 lo
  elige CSI).
- J.-L. Batoz, M. Ben Tahar, «Evaluation of a new quadrilateral thin plate bending element», IJNME 18 (1982).
- J.-L. Batoz, K.-J. Bathe, L.-W. Ho, «A study of three-node triangular plate bending elements», IJNME 15 (1980).
- CSI Analysis Reference Manual, cap. «The Shell Element».
