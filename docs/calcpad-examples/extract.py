"""Extract text + numbers + PNG plot from Calcpad puro HTML output."""
import re
import base64
import sys

with open('modal_cantilever_validation.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

# ─── 1) PNG plot ─────────────────────────────────────────────
png_match = re.search(r'<img\s+[^>]*src="data:image/png;base64,([A-Za-z0-9+/=]+)"[^>]*>', html)
if png_match:
    png_b64 = png_match.group(1)
    png_bytes = base64.b64decode(png_b64)
    with open('mode_shapes_plot.png', 'wb') as f:
        f.write(png_bytes)
    print(f'[PNG] Extracted plot: {len(png_bytes)} bytes -> mode_shapes_plot.png')
else:
    print('[PNG] No inline PNG found')

# ─── 2) Variables y resultados numéricos ────────────────────
print('\n[NUMBERS] Computed values:')
# Patron: <var>X</var>[<sub>SUB</sub>] = ... = NUMBER
# Captura la última asignación de cada variable
for v, sub in [('L', None), ('E', 'steel'), ('A', 'sec'), ('I', 'sec'), ('ρ', None),
                ('m', None), ('M', 'total'), ('W', 'kN'), ('EI', 'kNm2'), ('EI', 'Nm2'),
                ('βL', '1'), ('βL', '2'), ('βL', '3'),
                ('f', '1'), ('f', '2'), ('f', '3'),
                ('T', '1'), ('T', '2'), ('T', '3'),
                ('r', '21'), ('r', '31'),
                ('β', '1'), ('β', '2'), ('β', '3'),
                ('σ', '1'), ('σ', '2'), ('σ', '3')]:
    if sub:
        pat = rf'<var>{v}</var><sub>{sub}</sub>\s*=.*?=\s*(?:<[^>]+>)*\s*([\-+]?\d[\d\.eE\-+]*?)\s*</span>'
    else:
        pat = rf'<var>{v}</var>\s*=.*?=\s*(?:<[^>]+>)*\s*([\-+]?\d[\d\.eE\-+]*?)\s*</span>'
    matches = re.findall(pat, html)
    label = f'{v}_{sub}' if sub else v
    if matches:
        # Last assignment is the final value
        print(f'  {label:12s} = {matches[-1]}')
    else:
        # Try simpler pattern: just <var>X</var> = NUMBER
        if sub:
            pat2 = rf'<var>{v}</var><sub>{sub}</sub>\s*=\s*([\-+]?\d[\d\.eE\-+]*?)\s*</span>'
        else:
            pat2 = rf'<var>{v}</var>\s*=\s*([\-+]?\d[\d\.eE\-+]*?)\s*</span>'
        m2 = re.findall(pat2, html)
        if m2:
            print(f'  {label:12s} = {m2[-1]}  (input)')

# ─── 3) Texto: headings + paragraphs ────────────────────────
print('\n[TEXT] Headings (descriptions):')
# h3 tags
for h in re.findall(r'<h3[^>]*>(.*?)</h3>', html, re.DOTALL):
    clean = re.sub(r'<[^>]+>', '', h).strip()
    if clean and not clean.startswith('---'):
        print(f'  {clean}')

# ─── 4) Errores si los hay ──────────────────────────────────
errs = re.findall(r'<span class="err"[^>]*>(.*?)</span>', html, re.DOTALL)
if errs:
    print(f'\n[ERRORS] {len(errs)} found:')
    for e in errs[:5]:
        print(f'  {re.sub(chr(60)+"[^"+chr(62)+"]+"+chr(62), "", e)[:120]}')
else:
    print('\n[ERRORS] None — execution clean')
