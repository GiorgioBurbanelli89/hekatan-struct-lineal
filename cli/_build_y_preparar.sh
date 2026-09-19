#!/bin/bash
# build de deploy + copia a ../_ghpages_wt + quita el bloque SEO duplicado (sin commit ni push)
set -e
MSYS_NO_PATHCONV=1 npm run build:deploy > /tmp/b.log 2>&1 || { tail -20 /tmp/b.log; exit 1; }
python cli/preparar_deploy_ghpages.py | grep -i "wasm\|m/"
python - <<'PY'
import re
p="../_ghpages_wt/workspace/index.html"; s=open(p,encoding="utf-8").read()
b=re.findall(r"\s*<title>.*?</title>.*?<meta name=\"twitter:card\"[^>]*>", s, re.S)
if len(b)==2: s=s.replace(b[1],"",1)
open(p,"w",encoding="utf-8").write(s); print("title", s.count("<title>"), "noscript", s.count("<noscript"))
PY
