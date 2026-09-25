# Galpón curvo (?m=95IbfMcEkc2xvBS) contra OpenSees: qué formulación de placa (22-sep-2026)

## Qué usa Hekatan en ese modelo (leído del código, no supuesto)
- Las 100 chapas de zinc (t 0.8 mm) no llevan `shelltype` → tipo **0 = Shell-Thick MITC4 (Mindlin)** (data-model.ts, `plateFormulations`).
- Pero llevan `shellmod <id> 1 0` → **flexión = 0**: la placa MITC4 no aporta; la chapa trabaja como **membrana** (ITW 1990 + drilling, tipo 13 según README de validation/opensees).
- El .heks del enlace es byte a byte `validation/opensees/galpon_curvo.heks`.

## ✅ Funcionó
- Hekatan hoy = Hekatan 16-sep (T1 0.331144 s, 12 modos idénticos) → la referencia SAP2000 (0.00 %) sigue valiendo.
- `heks_a_opensees.py --flexion=hekatan` (nuevo): pasa el `bendingModifiers` de Hekatan al `Ep_mod` de `ElasticMembranePlateSection` (0 → 1e-9).
- Masa idéntica: 34.963 t, ΣRz 342.8725 kN, MX modo 2 = 99.73 % en todos.

| OpenSees | flexión completa: peor T / estático | flexión = Hekatan: peor T / estático |
|---|---|---|
| ShellMITC4 | 11.38 % / 4.45 % | **0.37 % / 0.27 %** |
| ASDShellQ4 | 10.74 % / 4.46 % | **0.34 % / 0.12 %** |
| ShellDKGQ | 0.41 % / 0.81 % | 0.41 % / 0.81 % (no cambia) |

## ❌ No funcionó / trampas
- El −11 % (modos 6–9, locales de la chapa) NO era el solver: OpenSees tenía la FLEXIÓN de la chapa y Hekatan no. Misma física → ≤0.37 %.
- ShellDKGQ da lo mismo con y sin `Ep_mod` (su flexión Kirchhoff de 0.8 mm no pesa, o no lee el modificador: no verificado cuál).
- OpenSees no tiene la membrana ITW + drilling de Hekatan: por eso queda 0.1–0.4 % y no 4 decimales. El juez exacto sigue siendo SAP2000 (0.00 %).

## ⏳ Falta
- MAC modo a modo (el conversor no vuelca las formas modales de Hekatan en el mismo formato).
