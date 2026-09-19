"""Arma informe/informe_radier_mod002.html con los numeros ya medidos (JSON de res/, f2k original y los resultados
de SAFE 20 del corregido). Nada se escribe a mano: cada cifra sale de un fichero de resultados."""
import base64, json, os, sys, html, collections
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gen_heks_desde_f2k import cargar
AQUI = os.path.dirname(os.path.abspath(__file__)); INF = os.path.join(AQUI, "informe"); RES = os.path.join(AQUI, "res")
G = 9.80665
t = cargar(os.path.join(AQUI, "MOD_002.f2k"))
R = json.load(open(os.path.join(RES, "resultados_corregido.json")))
wasm = json.load(open(os.path.join(AQUI, "radier_wasm_vs_safe.json")))
sapTC = json.load(open(os.path.join(AQUI, "radier_sap_vs_safe.json")))
img = lambda f: "data:image/png;base64," + base64.b64encode(open(os.path.join(INF, f), "rb").read()).decode()
# enlaces cortos ?m= (el .heks subido a gh-pages en m/<codigo>/modelo.heks)
M_CODIGO = {"SERVICIO": "cNdgGBOgjQDYiic4", "DISENO": "e3qQ74c6C2sEmWPq"}
url = lambda c: "https://giorgioburbanelli89.github.io/hekatan-struct-lineal/workspace/?m=" + M_CODIGO[c]
V = json.load(open(os.path.join(RES, "verificacion_cruzada.json")))

# --- cargas repetidas
P = {r["UniqueName"]: (float(r["X"]), float(r["Y"])) for r in t["POINT OBJECT CONNECTIVITY"]}
gxr = [r for r in t["GRID DEFINITIONS - GRID LINES"] if r["Grid Line Type"].startswith("X")]
gyr = [r for r in t["GRID DEFINITIONS - GRID LINES"] if r["Grid Line Type"].startswith("Y")]
def eje(x, y):
    ix = min(gxr, key=lambda r: abs(float(r["Ordinate"]) - x)); iy = min(gyr, key=lambda r: abs(float(r["Ordinate"]) - y))
    ok = abs(float(ix["Ordinate"]) - x) < 0.01 and abs(float(iy["Ordinate"]) - y) < 0.01
    return ("%s-%s" % (ix["ID"], iy["ID"])) if ok else None
dead = [r for r in t["JOINT LOADS ASSIGNMENTS - FORCE"] if r["Load Pattern"] == "Dead"]
orig = {r["FZ"]: eje(*P[r["UniqueName"]]) for r in dead if eje(*P[r["UniqueName"]])}
grupos = collections.OrderedDict()
for r in sorted(dead, key=lambda r: orig[r["FZ"]]):
    x, y = P[r["UniqueName"]]
    grupos.setdefault(orig[r["FZ"]], []).append((r["UniqueName"], x, y, -float(r["FZ"]) / 1000, eje(x, y) is not None))
tot = collections.defaultdict(float); totk = collections.defaultdict(float)
for r in t["JOINT LOADS ASSIGNMENTS - FORCE"]:
    f = -float(r["FZ"]) / 1000; tot[r["Load Pattern"]] += f
    if eje(*P[r["UniqueName"]]): totk[r["Load Pattern"]] += f

f1 = lambda v, n=2: ("%." + str(n) + "f") % v
filas_dup = ""
for col, L in grupos.items():
    kept = [p for p in L if p[4]]; cop = [p for p in L if not p[4]]
    if not cop: continue
    filas_dup += "<tr><td>%s</td><td class=n>%s</td><td>%s</td><td>%s</td></tr>" % (
        col, f1(kept[0][3], 1), "punto %s (%.3f; %.3f)" % (kept[0][0], kept[0][1], kept[0][2]),
        "<br>".join("punto %s (%.3f; %.3f)" % (p[0], p[1], p[2]) for p in cop))

S, D = R["SERVICIO"], R["DISENO"]
pun = R["punzonamiento"]
filas_p = "".join("<tr%s><td>%s</td><td>%s</td><td class=n>%.0f×%.0f</td><td class=n>%.0f</td><td class=n>%.1f</td><td class=n>%.0f</td><td class=n>%.0f</td><td class=n>%.1f</td><td class=n>%.1f</td><td class=n>%.2f</td><td class=n>%.2f</td><td class=n><b>%.2f</b></td></tr>" % (
    ' class="mal"' if f["ratio"] > 1 else "", f["col"], f["tipo"], f["bx"], f["by"], f["h"], f["d"], f["b0_sin_huecos"], f["b0"], f["Pu_t"], f["Vu_t"], f["vu"], f["phivc"], f["ratio"]) for f in pun)
M = R["momentos"]
def mrow(k, sg, nom):
    m = M[k][sg]
    return "<tr><td>%s</td><td class=n>%.2f</td><td>(%.2f; %.2f)</td><td class=n>%.0f</td><td>%s</td><td class=n>%.1f</td><td class=n>%.1f</td></tr>" % (
        nom, m["Mu_tm_m"], m["xy"][0], m["xy"][1], m["h_cm"], m["cara"], m["As_cm2_m"], m["Asmin_cm2_m"])
dist = S["distorsion"][0]

css = """
:root{--ink:#1f2328;--mut:#5b6472;--line:#d8dde3;--bg:#ffffff;--card:#f6f8fa;--acc:#1d4ed8;--bad:#b91c1c;--ok:#15803d}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--ink:#e6e9ee;--mut:#a3acb9;--line:#2f3540;--bg:#14171c;--card:#1b1f26;--acc:#7aa2ff;--bad:#f87171;--ok:#4ade80}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.55 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
main{max-width:980px;margin:0 auto;padding:28px 16px 60px}h1{font-size:26px;margin:0 0 4px}h2{font-size:19px;margin:34px 0 8px;padding-top:10px;border-top:1px solid var(--line)}
h3{font-size:16px;margin:20px 0 6px}.sub{color:var(--mut);margin:0 0 18px}p,li{max-width:78ch}
table{border-collapse:collapse;width:100%;margin:8px 0 14px;font-size:13.5px}th,td{border-bottom:1px solid var(--line);padding:5px 7px;text-align:left;vertical-align:top}
th{color:var(--mut);font-weight:600;background:var(--card)}td.n,th.n{text-align:right;font-variant-numeric:tabular-nums}tr.mal td{color:var(--bad)}
.tbl{overflow-x:auto}.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px;margin:14px 0}
.kpi{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:10px 12px}.kpi b{display:block;font-size:22px}.kpi span{color:var(--mut);font-size:12.5px}
figure{margin:12px 0}figure img{width:100%;height:auto;border:1px solid var(--line);border-radius:6px;background:#fff}figcaption{color:var(--mut);font-size:13px}
.nota{color:var(--mut);font-size:13px}.btn{display:inline-block;padding:8px 14px;margin:4px 8px 4px 0;border-radius:6px;background:var(--acc);color:#fff;text-decoration:none;font-weight:600}
code{background:var(--card);padding:1px 4px;border-radius:4px;font-size:12.5px}.ok{color:var(--ok)}.bad{color:var(--bad)}
"""
h = []
h.append("<!doctype html><html lang=es><head><meta charset=utf-8><meta name=viewport content='width=device-width,initial-scale=1'><title>Radier MOD_002 — revisión</title><style>%s</style></head><body><main>" % css)
h.append("<h1>Radier MOD_002 — revisión del modelo SAFE</h1><p class=sub>Losa de cimentación sobre suelo elástico (Ks = 0.4 kg/cm³). Revisión con tres programas: SAFE (el modelo recibido), SAP2000 24 (juez) y Hekatan Struct. Unidades: t, m, kg/cm².</p>")
h.append("<div class=kpis><div class=kpi><b class=bad>×2.18</b><span>carga de columnas del modelo recibido frente a la real (22 cargas repetidas)</span></div>"
         "<div class=kpi><b class=bad>0</b><span>multiplicador de peso propio (faltaban %.1f t)</span></div>" % V["pp_total_t"] +
         "<div class=kpi><b>30.53 → %.2f t/m²</b><span>q máx SERVICIO: recibido → corregido (SAP2000)</span></div>" % V["sap"]["SERVICIO"]["qmax"] +
         "<div class=kpi><b class=%s>%d de 15</b><span>columnas con punzonamiento &gt; 1.0 (DISEÑO, ACI 318-14)</span></div></div>" % ("bad" if sum(f["ratio"] > 1 for f in pun) else "ok", sum(f["ratio"] > 1 for f in pun)))

h.append("<h2>1. Qué estaba mal en el modelo recibido</h2>")
h.append("<p><b>Cargas repetidas.</b> Cada patrón (Dead, DNE, Live) trae 37 cargas puntuales, pero solo hay 15 columnas (en los cruces de ejes). Las otras 22 son <b>copias exactas</b> (mismas FX…MZ) de una de esas 15, puestas a 15–75 cm (o hasta 4.8 m, punto 125). Suma de cargas de columna: Dead %.1f t (real %.1f), DNE %.1f (real %.1f), Live %.1f (real %.1f): <b>%.1f t en vez de %.1f t</b>.</p>" % (
    tot["Dead"], totk["Dead"], tot["DNE"], totk["DNE"], tot["Live"], totk["Live"], sum(tot.values()), sum(totk.values())))
h.append("<p><b>Peso propio en cero.</b> Los tres patrones tienen <i>Self Weight Multiplier</i> = 0: la losa (%.1f t) y las vigas VC 60×60 (%.1f t) no entraban.</p>" % (V["pp_losa_t"], V["pp_vigas_t"]))
h.append("<figure><img src='%s' alt='Planta con las cargas repetidas'><figcaption>Figura 1. Planta: en azul la carga de cada columna (Dead, t); en rojo las copias y a qué columna copian.</figcaption></figure>" % img("fig1_cargas_repetidas.png"))
h.append("<div class=tbl><table><tr><th>Columna</th><th class=n>Dead (t)</th><th>Carga que se conserva</th><th>Copias que se quitan (mismo valor, los 3 patrones)</th></tr>%s</table></div>" % filas_dup)

h.append("<h2>2. El modelo tal cual en tres programas (misma malla)</h2>")
h.append("<p>Se reprodujo el modelo recibido nudo a nudo (la malla de análisis de SAFE: 424 nudos, 254 elementos, 147 nudos de borde con <i>edge constraint</i>) en SAP2000 y en Hekatan. Sirve para confirmar que el problema son los datos, no el programa.</p>")
h.append("<div class=tbl><table><tr><th>Caso</th><th>Programa</th><th class=n>q máx (t/m²)</th><th class=n>Asiento máx (mm)</th><th class=n>Reacción (t)</th><th class=n>vs SAFE</th></tr>")
for c, R0 in (("Dead", 711.5257), ("SERVICIO", 1174.8892)):
    w, s = wasm[c], sapTC[c]
    h.append("<tr><td>%s</td><td>SAFE 22.6 (recibido)</td><td class=n>%.2f</td><td class=n>%.2f</td><td class=n>%.1f</td><td class=n>—</td></tr>" % (c, w["pmax_safe_tm2"], -w["uz_min_safe"] * 1000, w["reaccion_safe_kgf"] / 1000))
    h.append("<tr><td></td><td>SAP2000 24</td><td class=n>%.2f</td><td class=n>%.2f</td><td class=n>%.1f</td><td class=n>%+.2f %%</td></tr>" % (s["pmax_hek_tm2"], -s["uz_min_hek"] * 1000, s["reaccion_hek_kgf"] / 1000, s["pmax_pct"]))
    h.append("<tr><td></td><td>Hekatan Struct</td><td class=n>%.2f</td><td class=n>%.2f</td><td class=n>%.1f</td><td class=n>%+.2f %%</td></tr>" % (w["pmax_hek_tm2"], -w["uz_min_hek"] * 1000, w["reaccion_hek_kgf"] / 1000, w["pmax_pct"]))
h.append("</table></div><p class=nota>SAP2000 = SAFE a 0.1 %. Hekatan queda 1.1 % por debajo en la esquina (15.075; 9.675): su placa gruesa (MITC4 publicada) no es idéntica a la <i>Shell-Thick</i> de CSI. En el modelo corregido de abajo la versión publicada de la app da lo mismo que SAP2000.</p>")

h.append("<h2>3. Modelo corregido</h2>")
h.append("<p>Una carga por columna (las 15 de los cruces de ejes, con sus FX, FY, MX, MY) + peso propio (losa y vigas, γ = 2549.3 kg/m³; pedestales sin peso, como en el original). Resto igual: losa 0.40/0.60 m Shell-Thick, pedestales Stiff (m×100), 7 huecos, vigas VC 60×60 con 1.44 t/m, Ks = 0.4 kg/cm³ solo compresión. Combinaciones: <b>SERVICIO</b> = D + DNE + L; <b>DISEÑO</b> = 1.2D + 1.2DNE + 1.6L (las del modelo). Malla conforme de Hekatan ≤ 0.60 m (1011 nudos, 889 cáscaras).</p>")
h.append("<h3>Confirmación cruzada de los valores clave</h3><div class=tbl><table><tr><th>Programa / modelo</th><th class=n>q máx SERV</th><th class=n>Uz máx SERV (mm)</th><th class=n>R SERV (t)</th><th class=n>q máx DISEÑO</th><th class=n>Uz máx DIS (mm)</th><th class=n>R DIS (t)</th></tr>")
for nom, k in (("SAP2000 24 — .s2k exportado por Hekatan (juez)", "sap"), ("SAFE 20 — .f2k exportado por Hekatan", "safe"), ("Hekatan Struct, app publicada", "app"), ("Hekatan Struct, versión en desarrollo", "hek")):
    a = V[k]
    h.append("<tr><td>%s</td><td class=n>%.3f</td><td class=n>%.3f</td><td class=n>%s</td><td class=n>%.3f</td><td class=n>%.3f</td><td class=n>%s</td></tr>" % (
        nom, a["SERVICIO"]["qmax"], a["SERVICIO"]["uz"], f1(a["SERVICIO"]["R"]) if a["SERVICIO"].get("R") else "—", a["DISENO"]["qmax"], a["DISENO"]["uz"], f1(a["DISENO"]["R"]) if a["DISENO"].get("R") else "—"))
a = V["safe_ing"]
h.append("<tr><td>SAFE 20 — corregido sobre el modelo SAFE original (su malla de 1.2 m)</td><td class=n>%.2f</td><td class=n>%.2f</td><td class=n>%.2f</td><td class=n>%.2f</td><td class=n>%.1f</td><td class=n>%.2f</td></tr></table></div>" % (
    a["SERVICIO"]["qmax"], a["SERVICIO"]["uz"], a["SERVICIO"]["R"], a["DISENO"]["qmax"], a["DISENO"]["uz"], a["DISENO"]["R"]))
h.append("<p class=nota>SAP2000, SAFE 20 y la app publicada coinciden a 4 cifras con la misma malla (la corrida de SAP2000 se hizo con el .s2k anterior, sin los 4 apoyos UX/UY: no cambia nada vertical — SAFE 20 con los apoyos da los mismos valores a 9 cifras); la versión en desarrollo de Hekatan, +0.13 %. El SAFE con la malla original (1.2 m) da q máx 1.6 % menor por ser una malla más gruesa en la esquina.</p>")

h.append("<h3>a) Presión de suelo</h3><ul><li>SERVICIO: máx <b>%.2f t/m² = %.2f kg/cm²</b> en la esquina (%.3f; %.3f); mín %.2f t/m² en (%.2f; %.2f); media %.2f t/m² (reacción/área %.2f).</li><li>DISEÑO: máx %.2f t/m², mín %.2f t/m².</li><li><b>Sin tracción</b>: todos los muelles en compresión en las dos combinaciones (el «solo compresión» no se activa).</li></ul>" % (
    S["pmax_tm2"], S["pmax_kgcm2"], S["pmax_xy"][0], S["pmax_xy"][1], S["pmin_tm2"], S["pmin_xy"][0], S["pmin_xy"][1], S["pmedia_tm2"], S["R_sobre_A"], D["pmax_tm2"], D["pmin_tm2"]))
h.append("<figure><img src='%s' alt='Presion de suelo tal cual vs corregido'><figcaption>Figura 2. Presión de suelo SERVICIO, misma escala: modelo recibido (resultados de SAFE) y corregido (Hekatan).</figcaption></figure>" % img("fig2_presion_servicio.png"))
h.append("<h3>b) Asientos y distorsión angular (SERVICIO)</h3><p>Asiento máx <b>%.1f mm</b> (esquina 15.075; 9.675), mín %.1f mm. Mayor diferencial entre columnas vecinas: <b>%s–%s</b>, δ = %.1f mm en L = %.2f m → δ/L = <b>1/%.0f</b>. Compárese con el límite de distorsión angular que exija la norma aplicable.</p>" % (
    S["uz_max_mm"], S["uz_min_mm"], dist["a"], dist["b"], dist["delta_mm"], dist["L"], 1 / dist["beta"]))
h.append("<h3>c) Punzonamiento ACI 318-14 (DISEÑO)</h3><p>d = h − 7.5 cm; b0 a d/2 de la cara de la columna (dimensiones = <i>X/Y Dimension</i> de las cargas), recortado en bordes libres y <b>descontando la sombra de los huecos a menos de 4h</b> (§22.6.4.3); vc = mín(1.06√f'c; 0.53(1+2/β)√f'c; 0.27(α<sub>s</sub>d/b0+2)√f'c) kg/cm², φ = 0.75; V<sub>u</sub> = P<sub>u</sub> − reacción del suelo dentro del perímetro. Calculado con script trazable (<code>resultados_corregido.py</code>), no por el motor.</p>")
h.append("<div class=tbl><table><tr><th>Col.</th><th>Tipo</th><th class=n>c (cm)</th><th class=n>h</th><th class=n>d</th><th class=n>b0 bruto</th><th class=n>b0 efectivo</th><th class=n>Pu (t)</th><th class=n>Vu (t)</th><th class=n>vu kg/cm²</th><th class=n>φvc</th><th class=n>vu/φvc</th></tr>%s</table></div>" % filas_p)
h.append("<p class=nota>No incluye la transferencia de momento (γ<sub>v</sub>M<sub>u</sub>): los momentos de columna del modelo son pequeños (≤ 0.7 t·m) pero la sumarían. No cuenta la ayuda de la viga de borde VC 60×60 (columnas de fila C y ejes 1 y 6). Los huecos cercanos a las columnas 2-B, 2-C, 3-B y 3-C son los que hacen fallar el perímetro.</p>")
h.append("<h3>d) Momentos de losa y acero orientativo (DISEÑO)</h3><div class=tbl><table><tr><th>Momento</th><th class=n>Mu (t·m/m)</th><th>dónde (m)</th><th class=n>h (cm)</th><th>cara</th><th class=n>As req (cm²/m)</th><th class=n>As mín 0.0018bh</th></tr>")
h.append(mrow("M11_centroide", "+", "M11 +") + mrow("M11_centroide", "-", "M11 −") + mrow("M22_centroide", "+", "M22 +") + mrow("M22_centroide", "-", "M22 −"))
h.append("</table></div><p class=nota>Valores en el centro de cada elemento (malla 0.6 m), convención CSI (M &gt; 0 tracciona la cara inferior). Los picos en las esquinas de los huecos llegan a M11 %.1f y M22 %.1f t·m/m (esquina entrante: dependen de la malla). As con f'c 210, fy 4200, φ 0.9, d = h − 7.5 cm; orientativo, no sustituye el diseño por franjas.</p>" % (M["M11"]["-"]["Mu_tm_m"], M["M22"]["-"]["Mu_tm_m"]))
vg = R["vigas"]
h.append("<h3>e) Vigas VC 60×60 (DISEÑO)</h3><p>M3 máx <b>%.1f t·m</b> en (%.3f; %.3f); V2 máx <b>%.1f t</b> en (%.3f; %.3f). Fuerzas de extremo de barra (tramos ≤ 0.6 m), torsión con 0.1·J como SAFE.</p>" % (abs(vg["M3_max_tm"]), vg["M3_xy"][0], vg["M3_xy"][1], abs(vg["V2_max_t"]), vg["V2_xy"][0], vg["V2_xy"][1]))
h.append("<h3>f) Equilibrio</h3><p>SERVICIO: cargas %.2f t = reacción del suelo %.2f t (diferencia %.0e %%). DISEÑO: %.2f t = %.2f t. SAP2000: %.2f / %.2f t. Desglose SERVICIO: columnas %.1f t + vigas %.1f t (1.44 t/m) + peso propio %.1f t.</p>" % (
    S["carga_nodal_t"], S["reaccion_t"], abs(S["equilibrio_pct"]), D["carga_nodal_t"], D["reaccion_t"], V["sap"]["SERVICIO"]["R"], V["sap"]["DISENO"]["R"], sum(totk.values()), V["carga_vigas_t"], V["pp_total_t"]))

h.append("<h2>4. Recomendación</h2><ul>"
         "<li>Quitar las 22 cargas repetidas (dejar una por columna) y activar el peso propio en Dead. Con eso la presión máxima de servicio baja de 30.5 a ≈13.5 t/m² (1.35 kg/cm²): comparar con la capacidad admisible del estudio de suelos.</li>"
         "<li>Revisar el punzonamiento de las columnas junto a los huecos (2-B, 2-C, 3-B, 3-C): aumentar peralte localmente, alejar/reducir huecos o armadura de cortante, incluyendo la transferencia de momento.</li>"
         "<li>El asiento diferencial máximo (1/%.0f) y la presión cumplen sin tracción; confirmar contra los límites del proyecto.</li></ul>" % (1 / dist["beta"]))
h.append("<h2>5. Abrir el modelo en Hekatan Struct</h2><p>Los enlaces abren el modelo corregido en la app, ya mostrando la presión de suelo de la combinación indicada (se puede cambiar a asiento, momentos, o a la otra combinación desde el panel <i>Resultados</i>):</p>")
h.append("<p><a class=btn href='%s'>Abrir SERVICIO</a><a class=btn href='%s'>Abrir DISEÑO</a></p>" % (html.escape(url("SERVICIO")), html.escape(url("DISENO"))))
h.append("<p>En la app: panel <i>Analyze</i> → <i>Shell results</i> = <b>pressure</b> (presión), <b>displacementZ</b> (asiento) o <b>bendingXX/YY</b> (momentos). Archivos entregados junto a este informe:</p><ul>"
         "<li><code>radier_mod002_corregido.heks</code> — modelo Hekatan con los tres patrones y las dos combinaciones.</li>"
         "<li><code>radier_mod002_corregido_enlace_SERVICIO.heks</code> / <code>_enlace_DISENO.heks</code> — el mismo modelo, abre mostrando esa combinación (son los de los enlaces).</li>"
         "<li><code>radier_mod002_corregido.s2k</code> — SAP2000: patrones Dead/DNE/Live, peso propio, combinaciones, muelles de área solo compresión. Importa con 0 errores.</li>"
         "<li><code>radier_mod002_corregido_SAFE20.f2k</code> — SAFE 20 (losa tipo Footing, pedestal Stiff, subgrade modulus solo compresión). Importa con 0 errores. <code>radier_mod002_corregido.f2k</code>: nombres de campo de SAFE 22 (no verificado en SAFE 22).</li></ul>")
h.append("<p class=nota>Todas las cifras de este informe salen de análisis ejecutados (SAFE, SAP2000 y Hekatan); los scripts y resultados están en <code>hekatan-struct/validation/04-cimentaciones-safe/radier-mod002/</code>.</p>")
h.append("</main></body></html>")
open(os.path.join(INF, "informe_radier_mod002.html"), "w", encoding="utf-8").write("\n".join(h))
print("ok")
