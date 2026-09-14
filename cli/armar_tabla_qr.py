# -*- coding: utf-8 -*-
"""Tabla de confiabilidad y tarjeta QR de un vídeo de COMPROBACIÓN, desde lo que dejó entrega_modelo.py.
    python cli/armar_tabla_qr.py CARPETA CODIGO "Título" "Subtítulo (modelo, secciones…)"
Lee CARPETA/resumen.json y los *_modal.json; escribe tabla_confiabilidad.html, tarjeta_qr.html y qr.png (enlace
?m=CODIGO&modal=12). Los PNG se sacan después con render_html.py (hay que MIRARLOS)."""
import json, os, sys, html
import qrcode

CARP, CODIGO, TITULO, SUB = sys.argv[1:5]
URL = f"https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?m={CODIGO}&modal=12"
r = json.load(open(os.path.join(CARP, "resumen.json"), encoding="utf-8"))
Sm = json.load(open(os.path.join(CARP, "sap_modal.json"), encoding="utf-8"))
Em = json.load(open(os.path.join(CARP, "etabs_modal.json"), encoding="utf-8"))
Hm = json.load(open(os.path.join(CARP, "hekatan_modal.json"), encoding="utf-8"))
Ts = [m["T"] for m in Sm]; Te = [m["T"] for m in Em]; Th = Hm["periods"]
es, ee, eh = r["estatico_SAP2000"], r["estatico_ETABS"], r["estatico_Hekatan"]
me, mh = r["modal_ETABS"], r["modal_Hekatan"]
n = r["nudos"]; NM = r["modos"]
f4 = lambda x: f"{x:.4f}".replace(".", ".")
pct = lambda x: f"{x:.4f} %" if x >= 1e-4 else "0.0000 %"
ok = lambda x, lim: ' class="ok"' if x <= lim else ""

filas_T = "".join(
    f'<tr><td>Periodo modo {k + 1}</td><td class="juez">{Ts[k]:.6f} s</td><td>{Te[k]:.6f} s</td><td>{Th[k]:.6f} s</td></tr>'
    for k in (0, 1, NM - 1))
sumas = r.get("modal_SAP2000", {}).get("sumas", {})
tabla = f"""<!doctype html>
<html lang="es"><head><meta charset="utf-8"><title>Confiabilidad · {html.escape(TITULO)}</title>
<style>
  body {{ margin: 0; background: #ffffff; font-family: "Segoe UI", system-ui, sans-serif; color: #1b2430; }}
  .hoja {{ width: 920px; padding: 22px 26px 18px; }}
  h1 {{ font-size: 21px; margin: 0 0 2px; }}
  .sub {{ font-size: 13px; color: #5a6675; margin-bottom: 14px; }}
  table {{ border-collapse: collapse; width: 100%; font-size: 13.5px; }}
  th, td {{ padding: 6px 9px; border-bottom: 1px solid #e3e8ee; text-align: right; white-space: nowrap; }}
  th {{ background: #f2f5f8; font-weight: 600; }}
  td:first-child, th:first-child {{ text-align: left; }}
  th.juez, td.juez {{ background: #fff7e0; }}
  tr.sec td {{ background: #1f3a5f; color: #fff; font-weight: 600; text-align: left; padding: 5px 9px; }}
  .ok {{ color: #137a3a; font-weight: 600; }}
  .pie {{ font-size: 11.5px; color: #5a6675; margin-top: 10px; line-height: 1.5; }}
</style></head><body><div class="hoja">
<h1>{html.escape(TITULO)} · Hekatan Struct contra SAP2000 y ETABS</h1>
<div class="sub">{html.escape(SUB)} · SAP2000 es el juez</div>
<table>
<tr><th>Resultado</th><th class="juez">SAP2000 24 (juez)</th><th>ETABS 22</th><th>Hekatan Struct</th></tr>
<tr class="sec"><td colspan="4">Estático (Dead: peso propio del acero, el zinc y el relleno)</td></tr>
<tr><td>Desplazamiento máximo</td><td class="juez">{f4(es["umax_mm"])} mm</td><td>{f4(ee["umax_mm"])} mm</td><td>{f4(eh["umax_mm"])} mm</td></tr>
<tr><td>Suma de reacciones verticales</td><td class="juez">{es["SRz"]:.2f} kN</td><td>{ee["SRz"]:.2f} kN</td><td>{eh["SRz"]:.2f} kN</td></tr>
<tr><td>Diferencia nudo a nudo ({n} nudos), peor / media</td><td class="juez">—</td><td>{pct(ee["peor_pct"])} / {pct(ee["media_pct"])}</td><td{ok(eh["peor_pct"], 0.1)}>{pct(eh["peor_pct"])} / {pct(eh["media_pct"])}</td></tr>
<tr class="sec"><td colspan="4">Análisis modal ({NM} modos, masa 3D de los elementos)</td></tr>
{filas_T}
<tr><td>Peor diferencia de periodo ({NM} modos)</td><td class="juez">—</td><td>{pct(me["peor_T_pct"])}</td><td{ok(mh["peor_T_pct"], 0.1)}>{pct(mh["peor_T_pct"])}</td></tr>
<tr><td>Masa participativa acumulada Ux / Uy / Uz (SAP2000)</td><td class="juez">{100*sumas.get("UX",0):.1f} / {100*sumas.get("UY",0):.1f} / {100*sumas.get("UZ",0):.1f} %</td><td>—</td><td>—</td></tr>
</table>
<div class="pie">Mismo modelo exportado por Hekatan Struct a .s2k (SAP2000) y .e2k (ETABS), con secciones paramétricas editables
(perfil I, canal C, doble ángulo 2L, tubo relleno). Diferencia nudo a nudo en % del desplazamiento máximo de SAP2000.
Enlace del modelo: {html.escape(URL)}</div>
</div></body></html>"""
open(os.path.join(CARP, "tabla_confiabilidad.html"), "w", encoding="utf-8").write(tabla)

qrcode.make(URL, box_size=12, border=2).save(os.path.join(CARP, "qr.png"))
tarjeta = f"""<!doctype html><html lang="es"><head><meta charset="utf-8"><title>QR {html.escape(TITULO)}</title>
<style>
  html,body{{margin:0;width:1920px;height:960px;background:radial-gradient(ellipse at 40% 40%,#16202e 0%,#070a10 80%);font-family:"Segoe UI",system-ui,sans-serif;color:#eef2f7;overflow:hidden}}
  .caja{{display:flex;align-items:center;gap:90px;padding:90px 120px;height:100%;box-sizing:border-box}}
  .qr{{background:#fff;padding:26px;border-radius:26px;box-shadow:0 20px 60px rgba(0,0,0,.55)}}
  .qr img{{width:560px;height:560px;image-rendering:pixelated;display:block}}
  h1{{font-size:54px;margin:0 0 10px;color:#e6c463}}
  .sub{{font-size:30px;color:#9fb0c4;margin-bottom:40px}}
  ol{{font-size:36px;line-height:1.55;margin:0;padding-left:44px}}
  li{{margin-bottom:14px}}
  b{{color:#7fd1ff}}
  .pie{{font-size:24px;color:#8a97a8;margin-top:36px}}
</style></head><body><div class="caja">
  <div class="qr"><img src="qr.png" alt="QR"></div>
  <div>
    <h1>Abre este modelo en tu celular</h1>
    <div class="sub">{html.escape(TITULO)} · modal ya corrido · Hekatan Struct</div>
    <ol>
      <li>Haz <b>captura de pantalla</b> ahora.</li>
      <li>Ábrela con <b>Google Lens</b> (Android) o en <b>Fotos</b> (iPhone): toca el código.</li>
      <li>O toca el <b>enlace de la descripción</b>.</li>
    </ol>
    <div class="pie">Sin instalar nada · se abre en el navegador</div>
  </div>
</div></body></html>"""
open(os.path.join(CARP, "tarjeta_qr.html"), "w", encoding="utf-8").write(tarjeta)
print("ok", URL)
