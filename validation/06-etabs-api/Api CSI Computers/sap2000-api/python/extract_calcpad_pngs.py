"""
Extrae los PNGs base64 embebidos en un HTML de Calcpad y los guarda como
archivos individuales para inspeccion visual via Read tool.
"""
import os
import sys
import re
import base64

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

HTML_PATH = os.path.expanduser("~") + r"\Documents\Calcpad-oficial\Examples\Mechanics\Finite Elements\rectangular slab fea.html"
OUT_DIR   = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\hekatan-struct\validacion\Api CSI Computers\sap2000-api\python\figs"
os.makedirs(OUT_DIR, exist_ok=True)

with open(HTML_PATH, "r", encoding="utf-8", errors="ignore") as f:
    html = f.read()

# Regex para encontrar todos los <img ... src="data:image/png;base64,XXXXX"
# Captura el base64 hasta el comienzo del próximo no-base64
pattern = re.compile(
    r'<img[^>]*src="data:image/(png|svg\+xml);base64,([A-Za-z0-9+/=]+)"',
    re.IGNORECASE | re.DOTALL,
)

matches = pattern.findall(html)
print(f"Encontradas {len(matches)} imagenes base64 en el HTML")
print(f"Guardando en: {OUT_DIR}")

for i, (img_type, b64data) in enumerate(matches, 1):
    ext = "png" if img_type.lower() == "png" else "svg"
    name = f"calcpad_extracted_{i:02d}.{ext}"
    out_path = os.path.join(OUT_DIR, name)
    try:
        data = base64.b64decode(b64data)
        with open(out_path, "wb") as out:
            out.write(data)
        size_kb = len(data) / 1024
        print(f"  [OK] {name}  ({size_kb:.1f} KB)")
    except Exception as e:
        print(f"  [FAIL] {name}: {e}")

# Tambien intentar extraer texto numerico clave: Maximal value
print()
print("=== Maximal values mencionados en el HTML ===")
# Maximal value - <var>M</var><sub>x</sub>... (a/2; b/2) = ...
maximal_pattern = re.compile(r'Maximal value[^<]*(?:<[^>]+>)*\s*[-+]?[0-9]+\.?[0-9]*', re.DOTALL)
for m in maximal_pattern.finditer(html)[:5] if hasattr(maximal_pattern.finditer(html), '__getitem__') else list(maximal_pattern.finditer(html))[:10]:
    fragment = m.group(0)[:200].replace("\n", " ").replace("  ", " ")
    print(f"  {fragment}...")

# Buscar Z_e o el primer numero con mm o con coma decimal
print()
print("=== Sample texto cercano a 'Z<sub>e</sub>' (deflexion) ===")
for match in re.finditer(r"Z<sub>e</sub>[^<]{0,200}", html):
    fragment = match.group(0)[:200]
    print(f"  {fragment}")
    break

print()
print("=== Numeros mas grandes encontrados (posibles w_max en m) ===")
numbers = re.findall(r"[-+]?\d+\.\d{4,}", html)
nums_float = sorted(set(float(n) for n in numbers if abs(float(n)) < 1.0), reverse=True)[:10]
print(f"  {nums_float}")
