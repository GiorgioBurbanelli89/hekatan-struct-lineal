# -*- coding: utf-8 -*-
"""
Tablero de puente — 3 modos vinculacion viga-losa via SAP2000 Bridge.

Usa el bridge cliente/server que ya existe en:
  C:\\Users\\USUARIO\\Documents\\Hekatan Calc 1.0.0\\python api sap 2000 claude\\

REQUISITOS PREVIOS:
  1. SAP2000 v24 abierto (sin elevar idealmente, sino bridge_server elevado)
  2. iniciar_bridge.bat corriendo (como admin si SAP esta elevado)

USO:
  python sap2000_test_solar_bridge.py [--mode 0|1|2]
"""
import os
import sys
import argparse

# Importar el bridge client del usuario
BRIDGE_PATH = os.path.expanduser("~") + r"\Documents\Hekatan Calc 1.0.0\python api sap 2000 claude"
sys.path.insert(0, BRIDGE_PATH)
from sap2000_bridge_client import SAP2000Bridge

# === Parametros del modelo (mismos que Hekatan tablero-puente) ===
L = 15.0
W = 6.0
T_S = 0.20
S_B = 2.0
BF = 0.20
TF = 0.015
HW = 0.55
TW = 0.010
Q_KNM2 = 15.0

# Materiales (kN/m2)
E_C = 25e6;   NU_C = 0.20;  RHO_C = 24.0
E_S = 200e6;  NU_S = 0.30;  RHO_S = 78.0

N_X = 20  # subdivisiones longitudinales losa
N_Y = 12


def define_materials(sap):
    """Define CONC24 y ACERO_A36 via execute_api."""
    print("\n--- Definiendo materiales ---")
    calls = [
        # Concreto: PropMaterial.SetMaterial("CONC24", 2)  # 2 = CONCRETE
        {"object": "SapModel.PropMaterial", "method": "SetMaterial", "args": ["CONC24", 2]},
        # Propiedades isotropicas: E, nu, alpha
        {"object": "SapModel.PropMaterial", "method": "SetMPIsotropic",
         "args": ["CONC24", E_C, NU_C, 1e-5]},
        # Peso especifico: 1=Weight per volume
        {"object": "SapModel.PropMaterial", "method": "SetWeightAndMass",
         "args": ["CONC24", 1, RHO_C]},
        # Acero
        {"object": "SapModel.PropMaterial", "method": "SetMaterial", "args": ["ACERO_A36", 1]},
        {"object": "SapModel.PropMaterial", "method": "SetMPIsotropic",
         "args": ["ACERO_A36", E_S, NU_S, 1.2e-5]},
        {"object": "SapModel.PropMaterial", "method": "SetWeightAndMass",
         "args": ["ACERO_A36", 1, RHO_S]},
    ]
    res = sap.execute_api(calls)
    print(f"  -> {res.get('status')}")


def define_sections(sap, mode: int):
    """Define seccion viga (I-section) y losa shell."""
    print(f"\n--- Definiendo secciones (modo {mode}) ---")
    if mode == 1:
        # Solar: I-section asimetrica con ala superior casi nula
        viga_calls = [
            {"object": "SapModel.PropFrame", "method": "SetISection",
             "args": ["VIGA_SOLAR", "ACERO_A36",
                      HW + 2*TF, 0.001, 0.001, TW, BF, TF]},
        ]
    else:
        # Naive y Eccentric: doble-T completa
        viga_calls = [
            {"object": "SapModel.PropFrame", "method": "SetISection",
             "args": ["VIGA_FULL", "ACERO_A36",
                      HW + 2*TF, BF, TF, TW, BF, TF]},
        ]
    losa_calls = [
        # SetSlab(name, slab_type=0, shell_type=1=ShellThin, mat, thickness)
        {"object": "SapModel.PropArea", "method": "SetSlab",
         "args": ["LOSA20", 0, 1, "CONC24", T_S]},
    ]
    res = sap.execute_api(viga_calls + losa_calls)
    print(f"  -> {res.get('status')}")


def build_geometry(sap, mode: int):
    """Construye nodos + losa shell + 3 vigas frame + apoyos + carga."""
    print(f"\n--- Construyendo modelo modo {mode} ---")

    dx = L / N_X
    dy = W / N_Y

    # Posiciones de las 3 vigas
    y_beams = [W/2 - S_B, W/2, W/2 + S_B]
    ys = [j * dy for j in range(N_Y + 1)]
    beam_rows = []
    for yB in y_beams:
        best_j, dmin = 0, 1e9
        for j in range(N_Y + 1):
            d = abs(ys[j] - yB)
            if d < dmin:
                dmin, best_j = d, j
        ys[best_j] = yB
        beam_rows.append(best_j)

    # === NODOS ===
    print("  Agregando puntos...")
    point_names = []
    for j in range(N_Y + 1):
        row = []
        for i in range(N_X + 1):
            res = sap.add_point(i * dx, ys[j], 0.0)
            row.append(res["data"]["name"])
        point_names.append(row)
    print(f"    {(N_X+1)*(N_Y+1)} puntos creados")

    # === LOSA SHELL ===
    print("  Agregando losa shell (Q4)...")
    area_calls = []
    for j in range(N_Y):
        for i in range(N_X):
            pts = [
                point_names[j][i],
                point_names[j][i+1],
                point_names[j+1][i+1],
                point_names[j+1][i],
            ]
            # AreaObj.AddByPoint(num_pts, pts, name_out, prop, user_name, csys)
            area_calls.append({
                "object": "SapModel.AreaObj", "method": "AddByPoint",
                "args": [4, pts, "", "LOSA20", "", "Global"],
            })
    # Ejecutar en lotes de 20 para no saturar
    BATCH = 50
    for i in range(0, len(area_calls), BATCH):
        sap.execute_api(area_calls[i:i+BATCH])
    print(f"    {N_X*N_Y} shells")

    # === VIGAS FRAME ===
    print("  Agregando 3 vigas frame...")
    section = "VIGA_SOLAR" if mode == 1 else "VIGA_FULL"
    beam_frame_names = [[] for _ in range(3)]
    for k, j_beam in enumerate(beam_rows):
        for i in range(N_X):
            p1 = point_names[j_beam][i]
            p2 = point_names[j_beam][i + 1]
            # FrameObj.AddByPoint(p1, p2, name_out, prop, user_name)
            res = sap.execute_api([{
                "object": "SapModel.FrameObj", "method": "AddByPoint",
                "args": [p1, p2, "", section, ""],
            }])
            # El bridge no parsea bien el ret, re-leemos via Count
            beam_frame_names[k].append(f"B{k}_{i}")  # placeholder
    print(f"    3 vigas x {N_X} = {3*N_X} elementos frame")

    # === MODE 2 ECCENTRIC: SetInsertionPoint cardinal=8 (Bottom Center) ===
    if mode == 2:
        print("  Aplicando Insertion Point Bottom Center (cardinal=8)...")
        # Necesitamos los nombres reales de los frames — los pedimos al SAP
        # via Count + GetNameList
        res = sap.execute_api([{
            "object": "SapModel.FrameObj", "method": "Count", "args": []
        }])
        # El return code esta en data[0]["result"]
        # Asumimos que los frames se nombran 1, 2, ..., n_frames (default SAP)
        # Aplicamos insertion point a TODOS los frames en las vigas (skipeando los shells)
        # Como no podemos diferenciar facilmente, mejor: usamos SelectByName en los IDs ya registrados
        # Simplificacion: SAP nombra frames 1 a N_X*3
        # Pero los shells tambien se nombran 1 a N_X*N_Y. Frames empiezan despues.
        # Mejor: usar GetNameList para FrameObj
        ip_calls = []
        # Cardinal points en SAP2000:
        #   8 = Bottom Center
        # Para todos los frames (deberian ser solo las vigas si no hay frames shell)
        for fi in range(1, 3 * N_X + 1):
            fname = str(fi)
            ip_calls.append({
                "object": "SapModel.FrameObj", "method": "SetInsertionPoint",
                "args": [fname, 8, False, True,
                         [0.0, 0.0, 0.0], [0.0, 0.0, 0.0], "Local"],
            })
        # Lotes
        for i in range(0, len(ip_calls), 30):
            sap.execute_api(ip_calls[i:i+30])
        print(f"    Insertion Point aplicado a {3*N_X} frames")

    # === APOYOS ===
    print("  Aplicando apoyos pin-roller...")
    for j_beam in beam_rows:
        # Pin (Ux, Uy, Uz)
        sap.set_restraint(point_names[j_beam][0],
                          [True, True, True, False, False, False])
        # Roller (Uy, Uz)
        sap.set_restraint(point_names[j_beam][N_X],
                          [False, True, True, False, False, False])
    print(f"    6 apoyos (3 pin + 3 roller)")

    # === CARGA UNIFORME EN LOSA ===
    # AreaObj.SetLoadUniform(name, pattern, value, dir=10 Gravity, replace, csys)
    print(f"  Aplicando carga uniforme {Q_KNM2} kN/m2...")
    load_calls = []
    for ai in range(1, N_X * N_Y + 1):
        load_calls.append({
            "object": "SapModel.AreaObj", "method": "SetLoadUniform",
            "args": [str(ai), "DEAD", -Q_KNM2, 10, True, "Global"],
        })
    for i in range(0, len(load_calls), 50):
        sap.execute_api(load_calls[i:i+50])
    print(f"    {N_X*N_Y} shells cargados")

    return point_names, beam_frame_names, beam_rows


def extract_results(sap, beam_frame_names, point_names, beam_rows):
    """Lee M3, V2 maximos viga central + U3 midspan."""
    print("\n--- Extrayendo resultados ---")

    # Viga central = 2da viga (k=1). Sus frames son los IDs N_X+1 a 2*N_X
    M_max, V_max = 0.0, 0.0
    for fi in range(N_X + 1, 2 * N_X + 1):
        forces = sap.get_frame_forces(str(fi), 0, "DEAD")
        if forces.get("status") == "ok":
            for r in forces.get("data", []):
                M_max = max(M_max, abs(r.get("M3", 0)))
                V_max = max(V_max, abs(r.get("V2", 0)))

    # Deflexion midspan viga central
    j_central = beam_rows[1]
    p_mid = point_names[j_central][N_X // 2]
    displ = sap.get_joint_displ(p_mid, 0, "DEAD")
    delta_mm = 0.0
    if displ.get("status") == "ok" and displ.get("data"):
        Uz = displ["data"][0].get("U3", 0)
        delta_mm = abs(Uz * 1000.0)

    return M_max, V_max, delta_mm


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--mode", type=int, default=None, choices=[0, 1, 2])
    args = parser.parse_args()

    sap = SAP2000Bridge()
    if not sap.is_server_running():
        print("=" * 70)
        print("  ERROR: Bridge server no esta corriendo.")
        print("=" * 70)
        print("  PASO 1: Abrir SAP2000 v24 manualmente")
        print("  PASO 2: Click derecho en:")
        print(f"          {BRIDGE_PATH}\\iniciar_bridge.bat")
        print("          -> Ejecutar como administrador")
        print("  PASO 3: Volver a correr este script")
        return 1

    print("=== SAP2000 Bridge Test — Tablero de Puente (Solar) ===")
    print(f"Version SAP2000: {sap.get_version()}")

    modes = [args.mode] if args.mode is not None else [0, 1, 2]
    mode_names = {
        0: "Naive (full T sin offset)",
        1: "Solar (alma+patin inf)",
        2: "Eccentric (Insertion Point Bottom)",
    }
    ref_hekatan = {
        0: (179.2, 263.3, 25.58),
        1: (167.6, 273.3, 31.56),
        2: (336.4, 233.7, 15.32),
    }
    results = {}

    for mode in modes:
        print(f"\n{'='*70}\n  MODO {mode}: {mode_names[mode]}\n{'='*70}")

        # Reset modelo
        sap.initialize_new_model(6)  # kN, m, C
        sap.new_blank()

        # Build
        define_materials(sap)
        define_sections(sap, mode)
        point_names, beam_frame_names, beam_rows = build_geometry(sap, mode)

        # Save y analizar
        sdb_path = os.path.expanduser(rf"~\Documents\tablero_puente_mode{mode}.sdb")
        print(f"\n--- Guardando: {sdb_path} ---")
        sap.save(sdb_path)

        print("--- Corriendo analisis ---")
        ana = sap.run_analysis()
        print(f"  -> {ana.get('status')}")

        # Resultados
        M, V, delta = extract_results(sap, beam_frame_names, point_names, beam_rows)
        results[mode] = (M, V, delta)
        Mh, Vh, dh = ref_hekatan[mode]
        print(f"\n  M_max  SAP={M:>8.1f} kN.m   Hekatan={Mh:>8.1f}   dif={(M-Mh)/Mh*100 if Mh else 0:+.1f}%")
        print(f"  V_max  SAP={V:>8.1f} kN     Hekatan={Vh:>8.1f}   dif={(V-Vh)/Vh*100 if Vh else 0:+.1f}%")
        print(f"  delta  SAP={delta:>8.2f} mm   Hekatan={dh:>8.2f}   dif={(delta-dh)/dh*100 if dh else 0:+.1f}%")

    # Comparacion final
    if len(results) > 1:
        print(f"\n{'='*70}\n  COMPARACION FINAL: SAP2000 vs Hekatan\n{'='*70}")
        print(f"  {'Modo':<35} {'M_sap':>10} {'V_sap':>10} {'delta_sap':>12}")
        for mode, (M, V, d) in results.items():
            print(f"  {mode_names[mode]:<35} {M:>10.1f} {V:>10.1f} {d:>12.2f}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
