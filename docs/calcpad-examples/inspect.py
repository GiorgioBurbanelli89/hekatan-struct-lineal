"""Inspect Calcpad HTML output: errors, plots, numeric values."""
import re

with open('modal_cantilever_validation.html', 'r', encoding='utf-8', errors='ignore') as f:
    txt = f.read()

print(f'Size: {len(txt)} bytes')

# Errors
errs = re.findall(r'<span class="err"[^>]*>(.*?)</span>', txt, re.DOTALL)
print(f'Errors: {len(errs)}')
for e in errs[:10]:
    clean = re.sub(r'<[^>]+>', '', e).strip()
    print(f'  {clean[:120]}')

# SVG inline plots
svgs = re.findall(r'<svg[^>]*>.*?</svg>', txt, re.DOTALL)
print(f'\nSVG inline plots: {len(svgs)}')
for i, s in enumerate(svgs):
    print(f'  SVG {i+1}: {len(s)} chars')

# Find numeric results
print('\nNumeric results:')
for v in ['f_1', 'f_2', 'f_3', 'T_1', 'T_2', 'r_21', 'r_31', 'm', 'M_total', 'W_kN']:
    if '_' in v:
        base, sub = v.split('_', 1)
        pat = rf'<var>{base}</var><sub>{sub}</sub>[^<]*?=[^<]*?([\d\.\-+eE]+)\s*</span>'
    else:
        pat = rf'<var>{v}</var>[^<]*?=[^<]*?([\d\.\-+eE]+)\s*</span>'
    matches = re.findall(pat, txt)
    if matches:
        print(f'  {v}: last result = {matches[-1]}')

# Save SVG separately if found
if svgs:
    with open('plot.svg', 'w', encoding='utf-8') as f:
        f.write(svgs[0])
    print(f'\nFirst SVG saved as plot.svg')
