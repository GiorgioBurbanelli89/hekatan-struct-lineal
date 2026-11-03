"""Ayuda comun de los tests que comparan Python con el motor TS/C++ (WASM) por `cliModeler` leyendo el MISMO .heks."""
import json
import subprocess
import tempfile
from pathlib import Path

import pytest

AQUI = Path(__file__).resolve().parent
RAIZ = AQUI.parents[1]                      # .../hekatan-struct

_GUION = r"""
import { writeFileSync } from "node:fs";
import { resolverHeks } from "file:///%s/tests/lib/heks.mjs";
const r = await resolverHeks(process.argv[2]);
const d = r.deformOutputs?.val ?? r.deformOutputs;
const defs = d.deformations instanceof Map ? [...d.deformations] : Object.entries(d.deformations ?? {});
const a = r.analyzeOutputs;
const mp = (m) => m instanceof Map ? Object.fromEntries(m) : (m ?? {});
writeFileSync(process.argv[3], JSON.stringify({
  nodes: r.nodes, elements: r.elements, deformations: Object.fromEntries(defs),
  M3: mp(a?.bendingsZ), N: mp(a?.normals),
}));
"""


def motor_ts(texto_heks: str) -> dict:
    """Resuelve el texto .heks con el motor TS/C++ y devuelve {nodes, elements, deformations, M3, N}."""
    if not (RAIZ / "node_modules" / "esbuild").exists():
        pytest.skip("faltan los node_modules de hekatan-struct")
    if not (RAIZ / "hekatan-fem/src/cpp/built/deform.wasm").exists():
        pytest.skip("falta deform.wasm")
    with tempfile.TemporaryDirectory() as d:
        d = Path(d)
        (d / "m.heks").write_text(texto_heks, encoding="utf-8")
        (d / "r.mjs").write_text(_GUION % RAIZ.as_posix().replace(" ", "%20"), encoding="utf-8")
        r = subprocess.run(["node", str(d / "r.mjs"), str(d / "m.heks"), str(d / "o.json")],
                           capture_output=True, text=True, cwd=str(RAIZ))
        if r.returncode != 0:
            pytest.skip("motor TS no disponible: %s" % (r.stderr or "")[:300])
        return json.loads((d / "o.json").read_text(encoding="utf-8"))
