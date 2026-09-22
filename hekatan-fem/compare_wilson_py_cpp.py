"""
Compara test_wilson_python_result.json vs test_wilson_cpp_result.json.
Verifica que matrices K Wilson sean idénticas (tol 1e-10).
"""
import json
import numpy as np

with open("test_wilson_python_result.json") as f:
    py = json.load(f)
with open("test_wilson_cpp_result.json") as f:
    cpp = json.load(f)

def diff(label, py_val, cpp_val):
    py_arr = np.asarray(py_val, dtype=float)
    cpp_arr = np.asarray(cpp_val, dtype=float)
    diff = np.abs(py_arr - cpp_arr)
    max_diff = float(np.max(diff))
    rel = max_diff / max(np.abs(py_arr).max(), 1e-30)
    status = "OK" if rel < 1e-10 else "FAIL"
    print(f"  [{status}] {label:15s}  max |diff|={max_diff:.3e}  rel={rel:.3e}")
    return rel < 1e-10

print("=" * 70)
print("Comparacion Python <-> C++ Wilson membrane")
print("=" * 70)

all_ok = True
all_ok &= diff("K_plain  matrix", py["K_plain"],  cpp["K_plain"])
all_ok &= diff("K_wilson matrix", py["K_wilson"], cpp["K_wilson"])
all_ok &= diff("u_plain_top",     py["u_plain_top"],  cpp["u_plain_top"])
all_ok &= diff("u_wilson_top",    py["u_wilson_top"], cpp["u_wilson_top"])

print("=" * 70)
print(f"VEREDICTO: {'TODOS PASARON (tol 1e-10)' if all_ok else 'HUBO DIFERENCIAS'}")
print("=" * 70)
print(f"\n[Wilson/Plain] ratio u_top = {py['u_wilson_top']/py['u_plain_top']:.4f}")
print(f"  -> Wilson MAS deflexivo (menos locking parásito en bending in-plane)")
print(f"  -> Diferencia +{(py['u_wilson_top']/py['u_plain_top']-1)*100:.1f}% sobre plain Q4")
