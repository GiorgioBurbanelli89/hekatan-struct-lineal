# Hekatan Struct contra OpenSees, mismo modelo nodo a nodo

Modelo: galpón curvo de 20 m (enlace `?m=95IbfMcEkc2xvBS`), 214 nudos, 443 barras,
100 chapas de zinc de 0.8 mm. Medido el 16-sep-2026.

```bash
node tests/lib/dump_heks.mjs modelo.heks dump.json
python validation/opensees/heks_a_opensees.py dump.json opensees.json 12
node cli/_modal_wasm_entrega.mjs modelo.heks hek_modal.json 12
node validation/opensees/hek_fuerzas.mjs modelo.heks hek_fuerzas.json
```

Las cargas son las que Hekatan ya repartió a los nudos (peso propio incluido): así se
comparan SOLVERES, no repartos de carga. Suma de reacciones idéntica (342.8725 kN).

## Lo que sale

| qué | solo barras | con la chapa (misma física en los dos) |
|---|---|---|
| desplazamientos, peor nudo | **0.055 %** | **0.180 %** |
| T1 | **+0.009 %** | −4.12 % |
| T1..T5 | ≤0.01 % | −0.5 a −6 % |

- **Las barras son el mismo elemento**: Timoshenko 3D contra `ElasticTimoshenkoBeam` de
  OpenSees, 0.009 % en el periodo y 0.055 % en la flecha.
- **La diferencia está en la MEMBRANA de la chapa.** No es la masa (quitándole la masa a
  la chapa la diferencia sigue en −5 %) ni la rigidez a flexión (con flexión en las dos,
  el estático baja a 0.18 %). Es la rigidez EN EL PLANO: Hekatan usa ITW 1990 con burbuja
  y proyección del drilling (tipo 13) y OpenSees `ShellMITC4` una membrana bilineal; la de
  Hekatan es más flexible, por eso sus periodos salen mayores.
- Bajo gravedad la chapa apenas trabaja a membrana: por eso el estático casi clava y el
  modal no.

Fuerzas de extremo de barra (con chapa, % del máximo de cada campo):
N 1.16 % · V2 2.18 % · V3 0.19 % · M2 0.12 % · M3 1.29 % · T 83.8 % **del máximo 0.0646
kN·m** (o sea 0.054 kN·m: la torsión de este modelo es ruido).

## ⚠️ Dos trampas que costaron una vuelta

1. **Ejes locales.** `geomTransf` de OpenSees quiere el vector del plano local x-z, que es
   el eje **3** de CSI (Z × x, horizontal), no el eje 2. Con el eje cambiado salía −54 % en T1
   y 48 % en la flecha; con el eje bien, 0.009 %.
2. **Áreas de cortante.** AS2 (cortante en el eje 2) = `shearAreasZ` de Hekatan, y AS3 =
   `shearAreasY`. Entran cruzadas si se leen por el nombre.

## Falta
- SAP2000 y ETABS sobre este mismo modelo (juez primero SAP, luego ETABS).
- Esfuerzos de la chapa joint a joint y participación de masa modal en los tres.
