# Mesa a torsión en Hekatan Struct — 2026-09-23

- ✅ El ejemplo YA existía y estaba en el menú: `examples/src/mesa-torsion/mesaTorsion.ts`, categoría «4️⃣ Mixtos · 🔀 Losas con vigas» (`?t=mesa-torsion`).
- ❌ Modal antes: T1 0.3484 s (+1.4 %), T3 0.2629 s (−8.6 %). Causa: masa de viga repartida en los tramos (MMI ≈ 215) y con largo 6 m.
- ✅ Árbitro de masa: `Downloads/Etabs Torsion/Mesa torsiónT.K_M` (38×6 float64). ETABS pone la viga (luz libre 5.6 m) en las 4 esquinas: 2.8737 t; bordes 0.173 t; suma 19.7988 t.
- ✅ Con esa masa: M 19.7978 t, MMI 256.72, T1 0.34324 (−0.04 %), T3 0.28569 (−0.65 %). Test `tests/casos/mesa_torsion_modal.mjs`.
- ✅ `npm test`: 623/653; los 30 fallos son los mismos sin mis cambios (617/647).
- ⏳ w = −6.59 mm no comparado. Residual T3 −0.65 % = rigidez torsional (K_θ ~1.3 % más rígida), sin investigar.
