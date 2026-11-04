"""Variantes del vano con cortante (e2k_vano_cortante_E/F) con la cubierta plana o inclinada en X, para ETABS por OAPI.
Edita el desfase Z de los POINT de la cubierta (740 mm - 30 mm por metro de y = pendiente 3 % en y) y corre `ext.py NOM` (C:\ETABS\mercado\galpon).
  pl : todos los POINT de cubierta a 740            (plana)       -> vano_Epl / vano_Fpl
  px : 740 - 30 * x[m]                               (3 % en x)    -> vano_Epx
Galpon sencillo: `simple.py plana --slope 0` y `simple.py base` (3 %, ver e2k_galpon_simple_genera_etabs.py)."""
import re, sys
def conv(t, mode):
    def f(m):
        x = float(m.group(2)); off = 740 if mode == 'pl' else 740 - 30 * x / 1000
        return f'{m.group(1)}{m.group(2)} {m.group(3)} {off:g}'
    return re.sub(r'(^\s*POINT\s+"[^"]+"\s+)(\S+)\s+(\S+)\s+\S+[ \t]*$', f, t, flags=re.M)
if __name__ == '__main__':
    src, mode, dst = sys.argv[1:4]
    open(dst, 'w', encoding='latin1', newline='').write(conv(open(src, encoding='latin1').read(), mode))
