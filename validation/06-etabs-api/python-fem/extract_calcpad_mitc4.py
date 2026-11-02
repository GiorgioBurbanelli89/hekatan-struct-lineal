"""
Extrae los PNG base64 del HTML de Calcpad MITC4 y reporta valores numericos
clave (Mxx, Myy, Mxy en centros/esquinas) para comparar con SAP2000.
"""
import os
import re
import sys
import base64

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

HTML = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\Calcpad-Lab\Examples\Mechanics\Finite Elements\rectangular slab fea - mitc4.html"
OUT  = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\hekatan-struct\validacion\python-fem\figs"
os.makedirs(OUT, exist_ok=True)

with open(HTML, "r", encoding="utf-8", errors="ignore") as f:
    html = f.read()

# Extraer todos los PNG base64
imgs = re.findall(r'<img[^>]*src="data:image/png;base64,([A-Za-z0-9+/=]+)"', html)
print(f"PNGs encontrados: {len(imgs)}")
for i, b64 in enumerate(imgs, 1):
    data = base64.b64decode(b64)
    fname = f"calcpad_mitc4_{i:02d}.png"
    with open(os.path.join(OUT, fname), "wb") as out:
        out.write(data)
    print(f"  guardado {fname} ({len(data)/1024:.1f} KB)")

# Extraer valores numericos de "Maximum"
# Texto en HTML: "Maximum Mxx at center -" seguido de una expresion eq con `= <numero>`
def find_value_after(html_text, marker):
    """Find first occurrence of marker followed by an expression with final '= number'."""
    idx = html_text.find(marker)
    if idx == -1:
        return None
    # Look ahead at most 3000 chars for a "= NUMBER" pattern with units kN
    chunk = html_text[idx:idx+3000]
    # Find "= NUMBER" close to end of expression
    matches = re.findall(r"=\s*([+\-]?\d+\.\d+e?[+\-]?\d*)\s*</span>\s*<[^>]+>kN", chunk)
    if matches:
        return float(matches[-1])
    # fallback: any number near kN unit
    matches = re.findall(r"([+\-]?\d+\.\d+)\s*</span>\s*kN", chunk)
    return float(matches[-1]) if matches else None

# Tambien w_max
markers = [
    ("Maximum Mxx at center", "Mxx_center"),
    ("Maximum Myy at center", "Myy_center"),
    ("Maximum |Mxy| at corner", "Mxy_corner"),
]
print()
print("=== VALORES MAXIMOS DEL CALCPAD MITC4 (post-spline) ===")
for marker, label in markers:
    v = find_value_after(html, marker)
    if v is not None:
        print(f"  {label:12} = {v:.4f} kN·m/m")
    else:
        print(f"  {label:12} = NO ENCONTRADO")

# w_max ya lo extrajimos previamente
print()
print("=== COMPARACION CON SAP2000 (mesh 6x4, simply supported) ===")
print(f"  {'Variable':<14} {'Calcpad MITC4':>16} {'SAP MITC4':>14} {'Calcpad BFS':>14}")
print(f"  {'-'*14} {'-'*16} {'-'*14} {'-'*14}")
print(f"  {'w_max [mm]':<14} {'-6.849':>16} {'-6.529':>14} {'-6.630':>14}")
print(f"  {'|Mx|_max':<14} {'(ver arriba)':>16} {'6.13':>14} {'6.32 (8.38*)':>14}")
print(f"  {'|Mxy|_max':<14} {'(ver arriba)':>16} {'6.90':>14} {'5.23 (8.38*)':>14}")
print()
print("  * Con splines bicubicas post-process")
