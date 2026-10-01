"""Estado estacionario (Steady State) como SAP2000 — 1-oct-2026.

CSI Analysis Reference Manual, cap. XXV «Frequency-Domain Analyses»:
    carga armónica  r(t) = p0·cos(ωt) + p90·sin(ωt)  → en complejo  p(ω) = Σ s_j f_j(ω) e^{iθ_j} p_j
    impedancia      K̄(ω) = K − ω²·M + i·D(ω)           D = d_K·K + d_M·M   (amortiguamiento HISTERÉTICO)
    respuesta       K̄(ω)·a(ω) = p(ω)                  a = parte real (en fase) + i·parte imaginaria (90°)
    magnitud        |a| = √(Re² + Im²)
M es la masa concentrada de CSI (la misma del modal). Sin muelles dependientes de la frecuencia.
"""
from __future__ import annotations
import numpy as np
from .solver import _assemble_K, _assemble_M_lumped


def estacionario(nodes, elements, node_inputs, element_inputs, frecuencias_hz, dK=0.0, dM=0.0, cargas=None):
    """Devuelve (frecuencias, A) con A[k] = vector complejo de 6n desplazamientos a la frecuencia k.
    cargas: lista de (vector p de 6n, función f(Hz)→float, escala s, fase θ en grados); por defecto node_inputs.loads × 1."""
    n = len(nodes)
    K = _assemble_K(nodes, elements, element_inputs); K = K.toarray() if hasattr(K, "toarray") else np.asarray(K)
    M = _assemble_M_lumped(nodes, elements, element_inputs)
    M = np.diag(M) if M.ndim == 1 else M
    for nod, gdl, k in getattr(node_inputs, "springs", []) or []: K[6 * nod + gdl, 6 * nod + gdl] += k
    if cargas is None:
        p = np.zeros(6 * n)
        for q, c in node_inputs.loads.items(): p[6 * q:6 * q + 6] += np.asarray(c, float)
        cargas = [(p, lambda f: 1.0, 1.0, 0.0)]
    fijo = np.zeros(6 * n, bool)
    for q, s in node_inputs.supports.items():
        for c in range(6): fijo[6 * q + c] = bool(s[c])
    dk = np.abs(np.diag(K)); lib = np.where(~fijo & (dk > 1e-12 * dk.max()))[0]
    Kf, Mf = K[np.ix_(lib, lib)], M[np.ix_(lib, lib)]
    D = dK * Kf + dM * Mf
    A = []
    for fhz in frecuencias_hz:
        w = 2 * np.pi * fhz
        pw = sum(s * f(fhz) * np.exp(1j * np.radians(th)) * pv for pv, f, s, th in cargas)
        a = np.zeros(6 * n, complex)
        a[lib] = np.linalg.solve(Kf - w * w * Mf + 1j * D, pw[lib])
        A.append(a)
    return np.asarray(frecuencias_hz), A
