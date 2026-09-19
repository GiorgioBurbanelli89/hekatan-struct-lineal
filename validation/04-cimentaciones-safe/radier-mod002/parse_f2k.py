"""Lector de tablas f2k/$2k (SAFE/SAP2000) -> dict tabla -> lista de filas (dict campo->texto).
Las filas largas siguen con ' _' al final de la linea. Se quitan todos los CR (el f2k trae CR CR LF)."""
import re, sys, pickle
TOK = re.compile(r'("(?:[^"]*)"|[^\s=]+)=("(?:[^"]*)"|\S+)')

def parse(path):
    txt = open(path, encoding='utf-8', errors='replace', newline='').read().replace('\r', '')
    tables = {}; cur = None; buf = ''
    def flush(s):
        if cur is None or not s.strip(): return
        tables[cur].append({k.strip('"'): v.strip('"') for k, v in TOK.findall(s)})
    for ln in txt.split('\n'):
        if ln.startswith('TABLE:'):
            if buf: flush(buf); buf = ''
            cur = ln.split('"')[1]; tables[cur] = []; continue
        r = ln.rstrip()
        if r.endswith(' _'):
            buf += r[:-2] + ' '; continue
        buf += ln; flush(buf); buf = ''
    return tables

if __name__ == '__main__':
    t = parse(sys.argv[1]); pickle.dump(t, open(sys.argv[2], 'wb'))
    for k, v in t.items(): print(len(v), k)
