"""Extract text + numbers + plot from Calcpad-Symbolic HTML output."""
import re, json, sys, os, base64

INPUT = sys.argv[1] if len(sys.argv) > 1 else 'pdelta_default_etabs.html'

with open(INPUT, 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

print(f'Total HTML size: {len(html):,} bytes')

# ─── 1) Headings ─────────────────────────────────────────────
print('\n[TEXT] Headings:')
for h in re.findall(r'<h[1-6][^>]*>(.*?)</h[1-6]>', html, re.DOTALL):
    clean = re.sub(r'<[^>]+>', '', h).strip()
    if clean and not all(c in '─├┤┬┴┼│┐┘┌└' for c in clean.replace(' ', '')):
        print(f'  {clean[:130]}')

# ─── 2) Computed values — extract FINAL number from <span class="eq">VAR=...=NUMBER</span> ──
print('\n[NUMBERS] Computed values:')

# Find every <span class="eq">...</span> block
eq_blocks = re.findall(r'<span class="eq">(.*?)</span>(?=\s*</p>|\s*[A-Za-z]|\s*$)', html, re.DOTALL)
# Better: just grab all eq blocks
eq_blocks = re.findall(r'<span class="eq">(.*?)</span>', html, re.DOTALL)

results = {}
for block in eq_blocks:
    # Extract variable name from start: <var>NAME</var>[<sub>SUB</sub>]
    m_var = re.match(r'\s*<var>([A-Za-zα-ωΑ-Ω_]+)</var>(?:<sub>([^<]+)</sub>)?', block)
    if not m_var:
        continue
    name = m_var.group(1) + ('_' + m_var.group(2) if m_var.group(2) else '')
    # Extract FINAL number — last "= NUMBER" in the block (or just last number before close)
    # Strip all HTML tags
    plain = re.sub(r'<[^>]+>', ' ', block)
    plain = re.sub(r'\s+', ' ', plain).strip()
    # Find all "= NUMBER" pairs
    nums = re.findall(r'=\s*([\-+]?\d+\.?\d*(?:[eE][\-+]?\d+)?)\s*(?:[a-zA-Zα-ωΑ-Ω_]|$)', plain + ' ')
    if not nums:
        nums = re.findall(r'([\-+]?\d+\.?\d*(?:[eE][\-+]?\d+)?)\s*$', plain)
    if nums:
        results[name] = nums[-1]

# Sort by appearance order — use first occurrence position in html
def first_pos(name):
    base = name.split('_')[0]
    sub = name.split('_', 1)[1] if '_' in name else None
    if sub:
        pat = rf'<var>{re.escape(base)}</var><sub>{re.escape(sub)}</sub>'
    else:
        pat = rf'<var>{re.escape(base)}</var>'
    m = re.search(pat, html)
    return m.start() if m else 9_999_999

for name in sorted(results.keys(), key=first_pos):
    print(f'  {name:18s} = {results[name]}')

# ─── 3) Plot extraction ─────────────────────────────────────
print('\n[PLOTS]')
# Calcpad-Symbolic may use different patterns. Check for:
# (a) Inline SVG
svgs = re.findall(r'<svg[^>]*>.*?</svg>', html, re.DOTALL)
print(f'  Inline SVG: {len(svgs)}')

# (b) <img src="data:image/png;base64,...">
imgs = re.findall(r'<img[^>]*src="data:image/(\w+);base64,([A-Za-z0-9+/=]+)"', html)
print(f'  Inline images (base64): {len(imgs)}')
for i, (fmt, b64) in enumerate(imgs):
    try:
        data = base64.b64decode(b64)
        fname = f'plot_{i+1}.{fmt}'
        with open(fname, 'wb') as f:
            f.write(data)
        print(f'    Image {i+1}: {fmt}, {len(data)} bytes → {fname}')
    except Exception as ex:
        print(f'    Image {i+1}: decode failed ({ex})')

# (c) Plotly JS — script with Plotly.newPlot or similar
plotly_count = html.count('Plotly')
print(f'  Plotly mentions: {plotly_count}')
# Find data array passed to Plotly.newPlot
plotly_data = re.findall(r"Plotly\.\w+\s*\(\s*[^,]+,\s*(\[.*?\])\s*,", html, re.DOTALL)
print(f'  Plotly newPlot data arrays: {len(plotly_data)}')
for i, blk in enumerate(plotly_data):
    print(f'    Block {i+1}: {len(blk)} chars')

# (d) iframe / embed
ifr = re.findall(r'<iframe[^>]*>', html)
print(f'  iframes: {len(ifr)}')

# ─── 4) Errors ──────────────────────────────────────────────
errs = re.findall(r'<span class="err"[^>]*>(.*?)</span>', html, re.DOTALL)
print(f'\n[ERRORS] {len(errs)} found')
for e in errs[:5]:
    clean = re.sub(r'<[^>]+>', '', e).strip()
    print(f'  {clean[:120]}')
