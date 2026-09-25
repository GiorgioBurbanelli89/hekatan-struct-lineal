# Exportador Mesa de Torsión → Fortran (.f90) para Hekatan Fortran — 2026-09-24

## ✅ Funcionó
- Motor leído (Lexer/Parser/Interpreter C#). CLI compilado con `--artifacts-path %TEMP%` → sin bin/obj en carpeta MEGA.
- Truco clave: `sum([ (a(k)*b(k), k=i0,i1) ])` corre dentro de una sola sentencia → no gasta el límite de
  60 M sentencias y va ~5 M mult/s. Cholesky skyline con eso.
- Reales impresos como 3 enteros (hi, lo, exp) porque `print *` del motor da solo 6 decimales.
- 1x1x1 shellthin: Hekatan Fortran = mesa_modelo.resumen a ~1e-14 al primer intento; gfortran igual.

## ❌ No funcionó / limitaciones del motor (probado con programas mínimos)
- `real(8) :: a(2,2)` → "falta ')' (encontre ',')"  → matrices aplanadas 1D.
- `allocatable a(:)` → "no esperaba ':' aqui"  → tamaños PARAMETER desde el exportador.
- subroutine/contains → "subrutina 'f' no soportada" → todo en el programa principal.
- `exit` → "falta '='";  `data` → "falta '='";  `matmul` → "'a' es un arreglo: falta el indice".
- `.and.` no es cortocircuito; división real por 0 da error.

- test_fortran.py: 14 casos (1x1x1 x 4 losas x {L,ULT}, 2x1x2/2x2x3 none, 2x1x2/2x2x3 shellthin) TODOS OK,
  error max 9e-14 (HF) y 9e-14 (gfortran). 2x2x3 shellthin (2232 GDL, perfil 242064): 3.3 s en el intérprete.
- ❌→✅ primera corrida marcó FALLA en membrane/none: viga_T = 1e-14 (cero por simetría), el error
  relativo no sirve ahí → criterio |Δ|/max(|ref|,1).

- Cambio del coordinador en mesa_modelo (waffle tipo ETABS con 10 modificadores sobre Db/Em;
  axil de columna descuenta w/2 de peso propio) → exportador actualizado (imod, fm11..mm12 en Fortran;
  corrección fe(1), fe(7) = +facD·w/2·ex_z). Re-corrida: 14/14 OK, error máx 9.2e-14.

## ⏳ Falta
- Nada del alcance. (Opcional: losas no rectangulares/inclinadas → hoy el exportador lo rechaza con assert.)
