#!/usr/bin/env python
"""Compara dos .e2k por capas (streaming de texto, sin solver). uso: python comparar_e2k_capas.py orig.e2k otro.e2k"""
import sys, re, collections
Q = re.compile(r'"([^"]*)"|(\S+)')
def toks(l): return [a if a or not b else b for a, b in Q.findall(l)] if False else [(m.group(1) if m.group(1) is not None else m.group(2)) for m in Q.finditer(l)]
def kv(t):
    d = {}; i = 1
    while i < len(t):
        d[t[i]] = t[i+1] if i+1 < len(t) else ''; i += 2
    return d
def secs(p):
    d = collections.OrderedDict(); cur = '_'
    for l in open(p, encoding='utf-8', errors='replace'):
        l = l.rstrip()
        if not l.strip(): continue
        if l.startswith('$ '): cur = l[2:].strip(); d.setdefault(cur, []); continue
        d.setdefault(cur, []).append(l)
    return d
def f(x):
    try: return float(x)
    except: return 0.0
def modelo(S):
    st = [toks(l) for l in S.get('STORIES - IN SEQUENCE FROM TOP', [])]
    names = [t[1] for t in st]; h = [f(kv(t[0:]).get('HEIGHT', 0)) if False else f(dict(zip(t[2::2], t[3::2])).get('HEIGHT', 0)) for t in st]
    elev = {names[-1]: 0.0}
    for i in range(len(names)-2, -1, -1): elev[names[i]] = elev[names[i+1]] + h[i]
    pts = {}
    for l in S.get('POINT COORDINATES', []):
        t = toks(l); pts[t[1]] = (f(t[2]), f(t[3]), f(t[4]) if len(t) > 4 else None)
    pa = {}
    for l in S.get('POINT ASSIGNS', []):
        t = toks(l); pa.setdefault(t[1], []).append((t[2], dict(zip(t[3::2], t[4::2]))))
    return names, elev, pts, pa
def z(elev, pts, p, story):
    x, y, zz = pts[p]; return (round(x, 2), round(y, 2), round(elev[story] + (zz or 0), 2))
def lineas(S, names, elev, pts):
    con = {}
    for l in S.get('LINE CONNECTIVITIES', []):
        t = toks(l); con[t[1]] = (t[2], t[3], t[4], int(f(t[5]) if len(t) > 5 else 0))
    out = []
    for l in S.get('LINE ASSIGNS', []):
        t = toks(l); n, story = t[1], t[2]; d = dict(zip(t[3::2], t[4::2]))
        if n not in con: continue
        ty, a, b, ns = con[n]
        if ty == 'COLUMN':
            idx = names.index(story); lo = names[min(idx+ns, len(names)-1)]
            pi, pj = z(elev, pts, a, lo), z(elev, pts, b, story)
        else:
            pi, pj = z(elev, pts, a, story), z(elev, pts, b, story)
        out.append((ty, tuple(sorted([pi, pj])), d))
    return out
def main(a, b):
    A, B = secs(a), secs(b)
    mA, mB = modelo(A), modelo(B)
    print('STORIES', 'igual' if mA[0] == mB[0] and mA[1] == mB[1] else 'DIF', len(mA[0]))
    print('POINT COORDINATES', len(mA[2]), len(mB[2]))
    LA, LB = lineas(A, *mA[:1], mA[1], mA[2]), lineas(B, mB[0], mB[1], mB[2])
    for ty in ('COLUMN', 'BEAM', 'BRACE'):
        ca = collections.Counter(g for t, g, _ in LA if t == ty); cb = collections.Counter(g for t, g, _ in LB if t == ty)
        print(f'LINE {ty:6} orig={sum(ca.values()):6} hek={sum(cb.values()):6} comunes={sum((ca & cb).values()):6} faltan={sum((ca-cb).values()):5} extra={sum((cb-ca).values()):5}')
    # atributos de LINE ASSIGNS sobre barras comunes
    ka = collections.defaultdict(list)
    for t, g, d in LA: ka[(t, g)].append(d)
    kb = collections.defaultdict(list)
    for t, g, d in LB: kb[(t, g)].append(d)
    claves = collections.Counter(); perd = collections.Counter(); tot = 0
    for k in ka:
        if k in kb:
            tot += 1
            da, db = ka[k][0], kb[k][0]
            for c in da:
                if c not in db: perd[c] += 1
                elif da[c] != db[c]: claves[c] += 1
    print('LINEASSIGN barras comunes', tot, '| atributo ausente en hek:', dict(perd), '| valor distinto:', dict(claves))
    # cargas de area
    def tot_area(S, m):
        pass
    for k in ('SHELL OBJECT LOADS', 'POINT OBJECT LOADS', 'FRAME OBJECT LOADS'):
        print(k, len(A.get(k, [])), len(B.get(k, [])))
    cargas = collections.Counter()
    for nm, S in (('orig', A), ('hek', B)):
        c = collections.Counter(); ar = {}
        for l in S.get('AREA CONNECTIVITIES', []):
            t = toks(l); ar[t[1]] = t[4:4+int(t[3])]
        for l in S.get('SHELL OBJECT LOADS', []):
            t = toks(l); d = dict(zip(t[3::2], t[4::2]))
            if 'LC' in d: c[d['LC']] += f(d.get('FVAL', 0))
        print('  suma FVAL por patron', nm, {k: round(v, 6) for k, v in c.items()}, 'n=', len(S.get('SHELL OBJECT LOADS', [])))
    ra = {n: r for n, v in mA[3].items() for s, r in v if 'RESTRAINT' in r}
    rb = {n: r for n, v in mB[3].items() for s, r in v if 'RESTRAINT' in r}
    print('RESTRAINTS', len(ra), len(rb))
    def cnt(S, key, pre): return collections.Counter(toks(l)[0] + ' ' + (toks(l)[1] if len(toks(l)) > 1 else '') for l in S.get(key, []))
    for key in ('MATERIAL PROPERTIES', 'FRAME SECTIONS', 'LOAD PATTERNS', 'LOAD CASES', 'LOAD COMBINATIONS', 'DIAPHRAGM NAMES', 'ANALYSIS OPTIONS', 'MASS SOURCE'):
        na = {toks(l)[1] if len(toks(l)) > 1 else toks(l)[0] for l in A.get(key, [])}; nb = {toks(l)[1] if len(toks(l)) > 1 else toks(l)[0] for l in B.get(key, [])}
        print(f'{key:22} orig={len(na):3} hek={len(nb):3} faltan={sorted(na-nb)[:8]}')
main(sys.argv[1], sys.argv[2])
