# Mesa a torsión en Hekatan Struct — 2026-09-23

- ✅ El ejemplo YA existía y estaba en el menú: `examples/src/mesa-torsion/mesaTorsion.ts`, categoría «4️⃣ Mixtos · 🔀 Losas con vigas» (`?t=mesa-torsion`).
- ❌ Modal antes: T1 0.3484 s (+1.4 %), T3 0.2629 s (−8.6 %). Causa: masa de viga repartida en los tramos (MMI ≈ 215) y con largo 6 m.
- ✅ Árbitro de masa: `Downloads/Etabs Torsion/Mesa torsiónT.K_M` (38×6 float64). ETABS pone la viga (luz libre 5.6 m) en las 4 esquinas: 2.8737 t; bordes 0.173 t; suma 19.7988 t.
- ✅ Con esa masa: M 19.7978 t, MMI 256.72, T1 0.34324 (−0.04 %), T3 0.28569 (−0.65 %). Test `tests/casos/mesa_torsion_modal.mjs`.
- ✅ `npm test`: 623/653; los 30 fallos son los mismos sin mis cambios (617/647).
- ⏳ w = −6.59 mm no comparado. Residual T3 −0.65 % = rigidez torsional (K_θ ~1.3 % más rígida), sin investigar.

## Parte 2 — T_u vs malla, agrietada vs no, tutor (2026-09-23)
- ✅ Estudio malla (UDCon2, viga sur, brazos 0): T_u = 0 / 2.615 / 5.040 / 5.849 / 6.059 / 6.118 (n = 1/2/4/8/16/32). ETABS 22 OAPI misma malla: 0 / 2.528 / 4.860 / 5.639 / 5.844 / 5.903 (+3.7 % constante). → registros/2026-09-23_torsion_vs_malla.{md,json}
- ✅ Hipótesis de Jorge: la malla gruesa SÍ subestima T_u, pero no porque la viga sea más rígida (su J no cambia): hay menos nudos donde la losa le impone el giro. n = 1 y «solo extremos» → T_u = 0 exacto (ETABS también).
- ✅ Agrietada: J·1 / 0.15 / 0.10 (SAFE) / 0.0402 (ACI) a 16×16: m_centro +48 %, m_borde −74 %. Corte x = L/2: losa + vigas + H·h = 65.681 tonf·m en los 4 casos. La suma borde+centro en un punto NO se conserva.
- ❌ J·0.15: sin fuente verificada (no hay ACI 318 en referencias/). 0.10 sí: SAFE, medido en el repo.
- ✅ Tutor en vivo con los mp3 de Jorge: `?t=mesa-torsion&tutor=1` (tutorTest.ts + audio). 8 pasos, 0 errores de consola; capturas en cli/shots/tutor_mesa/.
- ⏳ Vídeo cap31 del grabador: la capa de dibujo funciona; «Planta (X-Y)» no la encuentra tras abrir Geometría; falta montar la toma.
- ⏳ Los números de la VOZ (5.22, 0.0695, φT_cr 1.94, −2.73→−0.85, O/S #45) son de ETABS; Struct da 5.42, 0.0495, 1.876, −3.09→−1.01. φT_cr de ETABS no reproducido.
