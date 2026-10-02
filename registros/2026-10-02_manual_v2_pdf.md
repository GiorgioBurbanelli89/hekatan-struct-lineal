# Manual PDF v2 — estático y dinámico con el Acceso rápido (2-oct-2026)

- ✅ Capturas del sitio público (después del deploy con redondeo): `cli/_manual_v2_capturas.mjs` → `hekatan-school/VIDEOS/curso_csi/manual_v2/cap/`.
- ✅ PDF: `hekatan-school/serie_curso_csi/manual_v2.py` → `manual_estatico_dinamico_hekatan_struct_v2.pdf` (9 páginas, 14 pasos). Números leídos de las ventanas: V = 519.6 kN, deriva 0.98 % (NEC-15) / 1.07 % (borrador), Vdin/Vest 84.4 / 88.2 %, FZ 85.0 kN.
- ❌ Cambiar `__hekatanNEC.params` sin `correr()`: la ventana Deriva cambia el título a «borrador» pero sigue con números NEC-15 (resultados viejos). Arreglo: `correr()` tras cada cambio.
- ❌ Etiquetas cortadas a la izquierda: el recorte solo miraba las marcas, no los rótulos. Ahora incluye los rótulos.
- ⏳ Marca de «Irregularidades» y «Borrador ec. 6.8»: no son `<b>` en las ventanas nuevas, quitadas.
