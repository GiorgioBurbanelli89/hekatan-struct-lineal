# validacion/etabs-api/ — ETABS 18+ API verification

> # ⚠️ ANTES DE TOCAR CUALQUIER SCRIPT — LEER PRIMERO:
> # 👉 [`GUIA_API_ETABS.md`](./GUIA_API_ETABS.md)
>
> Esa guía documenta TODOS los gotchas que ya hemos descubierto a las malas:
> - **`SM.FrameObj.GetNameList()` crashea** (access violation) → hardcodear nombres
> - **`Results.FrameForce("C1", 0)` retorna 0** → usar LineElement IDs numéricos `"1"`..`"N"` post-auto-mesh
> - **`BaseReact` Fx empieza en `ret[4]`**, no en `ret[1]` (los primeros índices son strings de case/step)
> - **`ApplicationStart()` rompe la licencia SentinelLM** → usar `GetActiveObject` con ETABS ya abierto
> - **rigid offsets col/viga automáticos** afectan las stations de FrameForce
> - **mass source default** excluye masa UZ RX RY (importante para matchear desde FEM externo)
>
> Cada vez que abras un script aquí, antes de "arreglar" un bug, chequeá si ya
> está documentado en la guía. NO repetir los mismos errores.

---

Cada caso FEM está implementado en **3 lenguajes** que invocan la misma
API .NET de ETABS (`ETABSv1.dll`).

## Estructura

```
etabs-api/
├── matlab/          MATLAB R2017a (NET.addAssembly)
├── python/          Python 3.8+ (comtypes.client)
└── powershell/      PowerShell 7+ (Add-Type)
```

## Scripts por caso

| Caso              | HekatanLab | eShellType ETABS        | Sección API           | Archivo            |
|-------------------|-----------|-------------------------|-----------------------|--------------------|
| Plate Thin        | FE02      | `ShellThin` (1)         | `SetSlab`             | `plate_thin_etabs.{m,py,ps1}` |
| Plate Thick       | FE03      | `ShellThick` (2)        | `SetSlab`             | `plate_thick_etabs.{m,py,ps1}` |
| Membrane (wall)   | FE01b     | `Membrane` (3)          | `SetWall(Specified)`  | `membrane_etabs.{m,py,ps1}` |
| Layered           | FE04      | `ShellLayered` (4)      | `SetSlab` + `SetSlabLayer` | `layered_etabs.{m,py,ps1}` |
| Shell Thin        | FE05      | `ShellThin` (1)         | `SetSlab`             | `shell_thin_etabs.{m,py,ps1}` |
| Shell Thick       | FE06      | `ShellThick` (2)        | `SetSlab`             | `shell_thick_etabs.{m,py,ps1}` |
| Example 1-001     | (frame ref) | n/a                   | `SetRectangle`        | `example_1_001.{m,py,ps1}` |

## Requisitos

- ETABS 18+ instalado
- Ajustar `APIDLLPath` al path real de `ETABSv1.dll`

## Cómo correr cada lenguaje

### MATLAB R2017a+

```bash
cd matlab/
matlab -batch "plate_thin_etabs"
matlab -batch "plate_thick_etabs"
matlab -batch "membrane_etabs"
matlab -batch "layered_etabs"
matlab -batch "shell_thin_etabs"
matlab -batch "shell_thick_etabs"
matlab -batch "example_1_001"
```

### Python 3.8+

```bash
cd python/
pip install comtypes
python plate_thin_etabs.py
python plate_thick_etabs.py
python membrane_etabs.py
python layered_etabs.py
python shell_thin_etabs.py
python shell_thick_etabs.py
python example_1_001.py
```

### PowerShell 7+

```bash
cd powershell/
pwsh -File plate_thin_etabs.ps1
pwsh -File plate_thick_etabs.ps1
pwsh -File membrane_etabs.ps1
pwsh -File layered_etabs.ps1
pwsh -File shell_thin_etabs.ps1
pwsh -File shell_thick_etabs.ps1
pwsh -File example_1_001.ps1
```

## Diferencias clave vs SAP2000

| Aspecto                   | SAP2000                                | ETABS                                       |
|---------------------------|----------------------------------------|---------------------------------------------|
| Helper class              | `SAP2000v1.Helper`                     | `ETABSv1.Helper`                            |
| Object cast               | `cOAPI` en `SAP2000v1`                 | `cOAPI` en `ETABSv1`                        |
| Init w/ units             | `InitializeNewModel(eUnits)`           | `InitializeNewModel()` + `SetPresentUnits`  |
| Shell type API            | `SetShell_1(name, shellType_int, ...)` | `SetSlab(name, eSlabType, eShellType, ...)` |
| Vertical walls            | `SetShell_1` con `Membrane`            | `SetWall(eWallPropType.Specified, ...)`     |
| Layered                   | `SetShellLayer_1`                      | `SetSlabLayer` (sin `_1`)                   |
| Códigos ShellType         | numéricos (1=Shell, 2=Plate-Thin,...)  | enum: ShellThin/ShellThick/Membrane/ShellLayered |

## Variables clave de output

```
ETABSResult_<caso>   = <valor extraído del API>
IndResult_<caso>     = <valor de referencia analítica>
PercentDiff_<caso>   = <ratio - 1>
```

## Notas técnicas

### Membrane wall (FE01b)

ETABS está orientado a edificios con stories. Para modelar un muro
cantilever simple sin stories, los 3 scripts usan `PropArea.SetWall` con
`eWallPropType.Specified=2` y `eShellType.Membrane=3`. En la GUI esto sería:
- Define → Section Properties → Wall Sections → Add New
- Type: **Specified**, Shell Type: **Membrane**

### Layered (FE04)

ETABS usa `SetSlabLayer` (sin sufijo `_1`) a diferencia de SAP2000 que usa
`SetShellLayer_1`. La firma es muy similar pero el orden de argumentos
varía ligeramente — ver cada script para el detalle exacto.

### Cantilever shells (FE05, FE06)

Para shells planos arbitrarios (no horizontales para edificio), usamos
`SetSlab` con `eShellType.ShellThin/ShellThick`. En la GUI no estarían
asociados a un story específico — verifica en tu instalación que ETABS
no requiera un story de building para procesar el modelo.

## Próximos pasos

- [ ] Correr los 7 casos en cada lenguaje con ETABS 18+ real
- [ ] Comparar contra SAP2000 (en `../sap2000-api/`) — los resultados pueden
      diferir levemente por el elemento usado (ETABS Shell vs SAP Shell-Thin/Thick)
