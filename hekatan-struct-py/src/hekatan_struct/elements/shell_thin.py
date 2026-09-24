"""Shell-Thin: membrana Q6 + flexión DKE (Kirchhoff) + drilling.

Port de `getLocalStiffnessMatrixShellThin` (`hekatan-fem/src/cpp/utils/
shellThin.cpp`). Es el `shelltype thin` del `.heks` y el **Shell-Thin de ETABS**.

Lo único que cambia respecto al Shell-Thick (`shell_q4_motor.py`) es la
**FLEXIÓN**: DKE de Kirchhoff en vez de Mindlin/MITC4. La membrana y el drilling
son los MISMOS — se importan de allí en vez de duplicarlos.

En ETABS pasa exactamente eso: thin/thick cambia el cortante transversal, no el
comportamiento en el plano. Cuando en el C++ se bajó el `drillScale` solo en
`shellQ4.cpp`, el mismo muro cargado en su plano daba 5.3728 mm en Thin y
5.9139 en Thick — y eso delató que las dos formulaciones tenían la constante
escrita a mano por separado.

⚠️ Sin declarar `shelltype thin`, una losa que en ETABS es Shell-Thin entra por
el defecto de Hekatan (Mindlin) y sale MÁS RÍGIDA: medido en el peldaño 2 de la
escalera, 4 % menos de flecha en los nudos de losa y +1.1 % en el modo 1.
"""
import numpy as np

from .plate_dke import dke_plate_stiffness
from .membrane_itw import TIPOS_ITW, TIPO_DRILLING_DEFECTO, k_membrana_itw, kwargs_drilling
from .shell_q4_motor import (
    ALPHA_DRILL,
    GAMMA_ITW,
    DOF_BEN,
    DOF_DRI,
    DOF_MEM,
    _k_drilling,
    _k_membrana,
)


def shell_thin_motor(coords_xy, E, nu, t, *, alpha_drilling=None,
                     mod_membrana=1.0, mod_flexion=1.0, mod_dir=None,
                     tipo_drilling=TIPO_DRILLING_DEFECTO):
    """K local 24x24 del Shell-Thin. Mismo orden de GDL que el Thick.

    `[u, v, w, θx, θy, θz]` x 4 nudos. Los modificadores se leen igual que en
    `shell_q4_motor`: si hay direccionales mandan ellos y los escalares quedan
    en 1.0.
    """
    K = np.zeros((24, 24))
    if E <= 0 or t <= 0:
        return K
    p = np.asarray(coords_xy, float)
    x, y = p[:, 0].copy(), p[:, 1].copy()
    G = E / (2 * (1 + nu))
    al = ALPHA_DRILL if alpha_drilling is None else alpha_drilling

    fm, fb = float(mod_membrana), float(mod_flexion)
    if mod_dir is not None:
        mod_dir = [float(v) for v in mod_dir]
        fm = fb = 1.0
        sin_flexion = all(abs(mod_dir[k]) < 1e-9 for k in (3, 4, 5))
    else:
        sin_flexion = abs(fb) < 1e-9

    # La MISMA membrana que el Thick (`shellThin.cpp` tambien va por
    # `getMembraneITW` para los tipos 3..10): thin y thick tienen que dar lo
    # mismo en su plano.
    usa_itw = tipo_drilling in TIPOS_ITW
    if usa_itw:
        K[np.ix_(DOF_DRI, DOF_DRI)] += fm * k_membrana_itw(
            [(x[i], y[i]) for i in range(4)], E, nu, t, gamma_fac=GAMMA_ITW,
            mod_dir=mod_dir, **kwargs_drilling(tipo_drilling))
    else:
        K[np.ix_(DOF_MEM, DOF_MEM)] += fm * _k_membrana(x, y, E, nu, t, mod_dir)
    if not sin_flexion:
        K[np.ix_(DOF_BEN, DOF_BEN)] += fb * dke_plate_stiffness(
            x, y, E, nu, t, mod_dir)
    # El drilling va escalado por el modificador de MEMBRANA: si la membrana no
    # existe, su θz tampoco tiene que aportar rigidez.
    if not usa_itw:
        K[np.ix_(DOF_DRI, DOF_DRI)] += fm * _k_drilling(x, y, G, t, al)
    return K
