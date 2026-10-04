"""
Comprueba en ETABS que los modificadores de barra del .e2k ENTRAN.

    python cli/e2k_propmod_etabs.py C:\\ETABS\\portico_propmod.e2k

Abre el .e2k en un ETABS YA ABIERTO (OAPI, se adjunta, no lo relanza), lee
FrameObj.GetModifiers de cada barra y lo compara con los PROPMODA..PROPMODW del
LINEASSIGN del fichero (orden CSI: A, As2, As3, J, I22, I33, Masa, Peso).
Luego exporta el .e2k que escribe ETABS al lado (_etabs.e2k) para ver con QUE
palabra los guarda ETABS 22 (PROPMOD* en el LINEASSIGN o un NAMEDFMODIFIER).

Ruta corta y sin espacios (ver COMO_PROBAR_E2K_EN_ETABS.md).
"""
import re
import sys

import comtypes
import comtypes.client as cc

TOK = ["PROPMODA", "PROPMODA2", "PROPMODA3", "PROPMODT",
       "PROPMODI22", "PROPMODI33", "PROPMODM", "PROPMODW"]


def leer_e2k(ruta):
    esperado = {}
    for ln in open(ruta, encoding="utf-8", errors="replace"):
        m = re.match(r'\s*LINEASSIGN\s+"([^"]+)"\s+"([^"]+)"', ln)
        if not m:
            continue
        f = [1.0] * 8
        hay = False
        for k, t in enumerate(TOK):
            v = re.search(r"(?:^|\s)" + t + r"\s+([-\d.eE+]+)", ln)
            if v:
                f[k] = float(v.group(1))
                hay = True
        if hay:
            esperado[(m.group(1), m.group(2))] = f
    return esperado


def main(ruta):
    esperado = leer_e2k(ruta)
    print(f"{len(esperado)} LINEASSIGN con PROPMOD* en el fichero")
    h = cc.CreateObject("ETABSv1.Helper").QueryInterface(comtypes.gen.ETABSv1.cHelper)
    sm = h.GetObject("CSI.ETABS.API.ETABSObject").SapModel
    sm.File.OpenFile(ruta)
    n, nombres, _ = sm.FrameObj.GetNameList()
    peor = 0.0
    for nm in nombres:
        ret = sm.FrameObj.GetLabelFromName(nm)
        clave = (ret[0], ret[1])
        mods = list(sm.FrameObj.GetModifiers(nm)[0])
        e = esperado.get(clave, [1.0] * 8)
        d = max(abs(a - b) for a, b in zip(mods, e))
        peor = max(peor, d)
        if d > 1e-9 or clave in esperado:
            print(f"{nm:>6} {clave}: ETABS {mods}  e2k {e}  {'OK' if d <= 1e-9 else 'DISTINTO'}")
    print(f"peor diferencia: {peor:.3e}  -> {'OK' if peor <= 1e-9 else 'FALLA'}")
    sal = ruta[:-4] + "_etabs.edb"
    sm.File.Save(sal)
    sm.File.ExportFile(ruta[:-4] + "_etabs.e2k", 1)
    print("exportado", ruta[:-4] + "_etabs.e2k  (buscar PROPMOD / NAMEDFMODIFIER)")


if __name__ == "__main__":
    main(sys.argv[1])
