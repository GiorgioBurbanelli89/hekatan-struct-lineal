"""sap_ss.json + sap_psd.json -> examples/src/estacionario-csi/sapDatos.ts (lo que SAP2000 24 dio por OAPI, sin tocar).
python validation/estacionario/gen_datos_ejemplo.py"""
import json, os
A = os.path.dirname(os.path.abspath(__file__)); R = os.path.join(A, "..", "..")
S = json.load(open(os.path.join(A, "sap_ss.json"))); P = json.load(open(os.path.join(R, "validation", "psd", "sap_psd.json")))
def reim(o):
    fr = sorted(set(o["stepnum"])); re = []; im = []
    for f in fr:
        for t, n, u in zip(o["steptype"], o["stepnum"], o["u"]):
            if n == f and t.startswith("Real"): re.append(u[:3])
            if n == f and t.startswith("Imag"): im.append(u[:3])
    return fr, re, im
fr, re, im = reim(S["opciones"]["1"]); _, are, aim = reim(S["opciones"]["acel"])
d = dict(frec=fr, re=re, im=im, acelRe=are, acelIm=aim, psdF=P["psd"][0], psdS=P["psd"][1],
         raizPSD=[u[:3] for u in P["opciones"]["2"]["u"]], rms=P["opciones"]["1"]["u"][0][:3])
out = os.path.join(R, "examples", "src", "estacionario-csi", "sapDatos.ts")
open(out, "w", encoding="utf8").write("// GENERADO por validation/estacionario/gen_datos_ejemplo.py desde sap_ss.json y sap_psd.json (SAP2000 24, OAPI).\n"
  "// Nudo de control (0,0,3), componentes ux uy uz (m). No editar a mano.\nexport const SAP_SS = " + json.dumps(d) + " as const;\n")
print(out, len(fr))
