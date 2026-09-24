# -*- coding: utf-8 -*-
"""Mesa Torsion - Interfaz CLI Hekatan-Struct

Corre el modelo Mesa Torsion (Gabriela / Seproinca 2020) con switches configurables
y compara contra la referencia ETABS 19.1.

El solver Python "hekatan-struct" replica el solver C++ del workspace web
(MZC Kirchhoff para flexion de placa + Wilson incompatible-modes para membrana),
asi que los resultados deberian ser indistinguibles del workspace
https://giorgioburbanelli89.github.io/hekatan-struct/workspace/?t=mesa-torsion

USAGE
-----
    # Static analysis con switches default
    python examples/mesa_torsion_cli.py --static

    # Static + modal + comparacion contra ETABS
    python examples/mesa_torsion_cli.py --static --modal --compare

    # Iteracion completa (96 variantes)
    python examples/mesa_torsion_cli.py --iterate

    # Lanza la GUI Qt
    python examples/mesa_torsion_cli.py --gui

    # Headless plot a PNG
    python examples/mesa_torsion_cli.py --static --plot out.png

    # Match ETABS-like: diafragma rigido + cardinal 8 + cracking ACI
    python examples/mesa_torsion_cli.py --static --modal --compare \\
        --rigid-diaphragm --cardinal-point-8 \\
        --crack-col 0.7 --crack-beam 0.35 --crack-slab 0.25
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

import numpy as np

# Asegura imports relativos al package incluso si se invoca desde otro cwd.
HERE = Path(__file__).parent.absolute()
ROOT = HERE.parent
sys.path.insert(0, str(ROOT / "src"))

# Reutiliza el modelo Mesa Torsion del script de iteracion.
sys.path.insert(0, str(HERE))
import mesa_torsion_iterate as MT  # build_mesa_torsion, run_static_case, ETABS_PICKS

from hekatan_struct import (
    modal_analysis,
    compute_picks,
    compare_picks,
)
from hekatan_struct.extensions import G_GRAV
import hekatan_struct.solver as solver

# Default reference: el JSON generado por la API ETABS oficial del usuario.
ETABS_PERIODS_DEFAULT = Path(
    ROOT.parent / "validacion" / "Api CSI Computers" / "etabs-api" /
    "python-verificado" / "mesa_torsion_user_etabs_results.json"
)


# ============================================================================
# Parser CLI
# ============================================================================
def make_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        prog="mesa_torsion_cli",
        description="Mesa Torsion - Hekatan-Struct CLI (solver Python mirror del C++)",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    actions = p.add_argument_group("Acciones")
    actions.add_argument("--static",   action="store_true", help="Corre los 5 casos estaticos (Dead/Live/SCP/UDCon1/UDCon2)")
    actions.add_argument("--modal",    action="store_true", help="Corre analisis modal (12 modos default)")
    actions.add_argument("--compare",  action="store_true", help="Compara contra la referencia ETABS (picks + periodos)")
    actions.add_argument("--iterate",  action="store_true", help="Itera 96 variantes y reporta la ganadora")
    actions.add_argument("--gui",      action="store_true", help="Lanza la GUI Qt interactiva")
    actions.add_argument("--plot",     metavar="PNG", help="Guarda screenshot 3D headless (sin abrir ventana)")

    sw = p.add_argument_group("Switches del modelo")
    sw.add_argument("--nmesh",            type=int,   default=5,    help="Subdivisiones por lado de losa (default: 5)")
    sw.add_argument("--rigid-diaphragm",  action="store_true",     help="Activa constraint diafragma rigido en losa")
    sw.add_argument("--cardinal-point-8", action="store_true",     help="Offset vigas Top Center (CSI Cardinal Point 8)")
    sw.add_argument("--crack-col",        type=float, default=1.0,  help="Factor cracking columnas (ACI 0.70)")
    sw.add_argument("--crack-beam",       type=float, default=1.0,  help="Factor cracking vigas (ACI 0.35)")
    sw.add_argument("--crack-slab",       type=float, default=1.0,  help="Factor cracking losa (ACI 0.25)")

    fs = p.add_argument_group("Formulacion shell")
    fs.add_argument("--shell", choices=["mzc", "wilson"], default="mzc",
                    help="Formulacion placa: mzc (Kirchhoff DKE-like, default = ETABS Shell-Thin) o wilson (Q4 con drilling)")

    rep = p.add_argument_group("Reporte")
    rep.add_argument("--etabs-ref", type=str, default=str(ETABS_PERIODS_DEFAULT),
                     help="JSON ETABS con periods_s y picks (default: mesa_torsion_user_etabs_results.json)")
    rep.add_argument("--json-out",  type=str, default=None, help="Vuelca resultados a JSON")
    rep.add_argument("--quiet",     action="store_true", help="No imprime tablas, solo retorna codigo de salida")

    return p


# ============================================================================
# Utilidades
# ============================================================================
def banner(title: str, ch: str = "="):
    print(ch * 80)
    print(f"  {title}")
    print(ch * 80)


def collect_variant(args: argparse.Namespace) -> dict:
    return {
        "rigid_diaphragm":  args.rigid_diaphragm,
        "cardinal_point_8": args.cardinal_point_8,
        "slab_membrane":    True,
        "crack_col_factor":  args.crack_col,
        "crack_beam_factor": args.crack_beam,
        "crack_slab_factor": args.crack_slab,
        "nmesh":            args.nmesh,
    }


def configure_solver(args: argparse.Namespace):
    if args.shell == "mzc":
        solver.USE_KIRCHHOFF_MZC = True
        if not args.quiet:
            print("  Formulacion: MZC Kirchhoff (= ETABS Shell-Thin / DKE Wilson)")
    else:
        solver.USE_KIRCHHOFF_MZC = False
        if not args.quiet:
            print("  Formulacion: Wilson Q4 (drilling DOF)")


# ============================================================================
# Static analysis
# ============================================================================
CASES = [
    {"name": "Dead",   "sw": 1.0, "q_scp": 0,   "q_live": 0},
    {"name": "Live",   "sw": 0,   "q_scp": 0,   "q_live": 0.5},
    {"name": "SCP",    "sw": 0,   "q_scp": 1.0, "q_live": 0},
    {"name": "UDCon1", "sw": 1.4, "q_scp": 1.4, "q_live": 0},
    {"name": "UDCon2", "sw": 1.2, "q_scp": 1.2, "q_live": 0.8},
]


def run_static(args, model) -> dict:
    nodes, elements, base_ni, ei, master_idx, slaves, col_end, beam_end = model
    frame_indices = list(range(beam_end))
    picks_by_case = {}
    full_results = {}
    for c in CASES:
        ana = MT.run_static_case(
            nodes, elements, base_ni, ei, master_idx, slaves,
            sw_mult=c["sw"], q_scp_tm2=c["q_scp"], q_live_tm2=c["q_live"],
            rigid_diaphragm=args.rigid_diaphragm,
        )
        picks_by_case[c["name"]] = compute_picks(ana, frame_indices=frame_indices)
        full_results[c["name"]] = ana
    return {"picks": picks_by_case, "ana": full_results}


def print_picks_table(picks_by_case: dict):
    print(f"\n  {'Caso':<10} {'|P|':<8} {'|V2|':<8} {'|V3|':<8} {'|T|':<8} {'|M2|':<8} {'|M3|':<8}  [tonf, tonf-m]")
    print("  " + "-" * 70)
    for case, pk in picks_by_case.items():
        print(f"  {case:<10} "
              f"{pk['P']:<8.3f} {pk['V2']:<8.3f} {pk['V3']:<8.3f} "
              f"{pk['T']:<8.3f} {pk['M2']:<8.3f} {pk['M3']:<8.3f}")


# ============================================================================
# Modal analysis
# ============================================================================
def run_modal(args, model, n_modes: int = 12) -> dict:
    nodes, elements, base_ni, ei, master_idx, slaves, col_end, beam_end = model
    # Para modal usamos selfweight como mass source (Dead) sin loads dependientes.
    from hekatan_struct import NodeInputs
    from hekatan_struct.extensions import apply_selfweight
    ni = NodeInputs(supports=dict(base_ni.supports), loads={})
    apply_selfweight(nodes, elements, ei, ni, sw_multiplier=1.0)
    modal = modal_analysis(nodes, elements, ni, ei, n_modes=n_modes)
    return {"periods_s": list(modal.periods), "frequencies_hz": list(modal.frequencies)}


def print_modal_table(modal_results: dict, ref_periods: list | None = None):
    print(f"\n  Modo  T [s]      f [Hz]" + (f"     T_ETABS [s]   diff%" if ref_periods else ""))
    print("  " + "-" * (28 + (24 if ref_periods else 0)))
    for i, (T, f) in enumerate(zip(modal_results["periods_s"], modal_results["frequencies_hz"])):
        line = f"  {i+1:<5} {T:<10.6f} {f:<10.3f}"
        if ref_periods and i < len(ref_periods):
            tref = ref_periods[i]
            diff = (T - tref) / tref * 100 if tref else 0
            line += f" {tref:<13.6f} {diff:+.2f}%"
        print(line)


# ============================================================================
# Comparacion contra ETABS
# ============================================================================
def load_etabs_reference(path: str) -> dict:
    p = Path(path)
    if not p.exists():
        print(f"  ! Archivo ETABS no encontrado: {p}")
        return {}
    with open(p, encoding="utf-8") as fh:
        data = json.load(fh)
    return data


# ============================================================================
# Iteracion (delegado al script existente)
# ============================================================================
def run_iterate(args):
    import importlib
    importlib.reload(MT)
    # Reaprovecha la logica del script: simplemente llama a su __main__.
    # En vez de exec, replicamos la parte util en un loop reducido.
    import itertools
    space = {
        "rigid_diaphragm":  [False, True],
        "cardinal_point_8": [False, True],
        "slab_membrane":    [True],
        "crack_col":        [1.0, 0.7],
        "crack_beam":       [1.0, 0.35],
        "crack_slab":       [1.0, 0.25],
        "nmesh":            [args.nmesh],
    }
    keys = list(space.keys())
    combos = list(itertools.product(*[space[k] for k in keys]))
    banner(f"Iteracion - {len(combos)} variantes")
    results = []
    for idx, combo in enumerate(combos):
        v = dict(zip(keys, combo))
        try:
            picks, score = MT.evaluate_variant(v)
            results.append({**v, "picks": picks, "score": score})
            tag = "/".join(f"{k[:3]}={vv}" for k, vv in v.items()
                           if k not in ["slab_membrane", "nmesh"])
            print(f"  [{idx+1:2}/{len(combos)}] {tag:80} score={score:.4f}")
        except Exception as e:
            print(f"  [{idx+1:2}/{len(combos)}] FAIL: {e}")
    results.sort(key=lambda r: r["score"])
    best = results[0]
    print(f"\n  GANADOR:")
    for k in keys:
        print(f"     {k:18}: {best[k]}")
    print(f"     score = {best['score']:.5f}")
    print("\n  Comparativa GANADOR vs ETABS:")
    print(compare_picks(best["picks"], MT.ETABS_PICKS))
    return best


# ============================================================================
# Plot (3D headless)
# ============================================================================
def render_plot(args, model, out_png: str):
    from hekatan_struct.viewer import View
    nodes, elements, base_ni, ei, master_idx, slaves, col_end, beam_end = model
    # Quita master virtual del display si existe
    n_real = master_idx if master_idx >= 0 else len(nodes)
    v = View(list(nodes[:n_real]), elements, element_inputs=ei, show_grid=True)
    v.set_supports(base_ni)
    try:
        v.plotter.off_screen = True
    except Exception:
        pass
    out_path = Path(out_png).absolute()
    out_path.parent.mkdir(parents=True, exist_ok=True)
    v.screenshot(str(out_path))
    print(f"  PNG -> {out_path}")


# ============================================================================
# Main
# ============================================================================
def main(argv: list[str] | None = None) -> int:
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

    args = make_parser().parse_args(argv)

    if not any([args.static, args.modal, args.compare, args.iterate, args.gui, args.plot]):
        print("Especifica al menos una accion. Usa -h para ayuda.")
        return 2

    configure_solver(args)

    # GUI: delega y termina
    if args.gui:
        try:
            import mesa_torsion_gui as GUI
        except ImportError as e:
            print(f"  GUI no disponible: {e}")
            print("  Instala dependencias: pip install pyvistaqt PyQt5")
            return 1
        return GUI.launch(initial=collect_variant(args))

    # Itera y termina
    if args.iterate:
        best = run_iterate(args)
        if args.json_out:
            with open(args.json_out, "w", encoding="utf-8") as fh:
                json.dump(best, fh, indent=2, default=str)
            print(f"  JSON -> {args.json_out}")
        return 0

    banner("Mesa Torsion - Hekatan-Struct (Python)")
    variant = collect_variant(args)
    print(f"  Switches: {variant}")

    model = MT.build_mesa_torsion(
        nmesh=variant["nmesh"],
        rigid_diaphragm=variant["rigid_diaphragm"],
        cardinal_point_8=variant["cardinal_point_8"],
        slab_membrane=variant["slab_membrane"],
        crack_col_factor=variant["crack_col_factor"],
        crack_beam_factor=variant["crack_beam_factor"],
        crack_slab_factor=variant["crack_slab_factor"],
    )

    nodes, elements, _, _, _, _, col_end, beam_end = model
    n_shells = sum(1 for e in elements if len(e) == 4)
    n_frames = sum(1 for e in elements if len(e) == 2)
    print(f"  Modelo: {len(nodes)} nodos, {col_end} cols, {beam_end - col_end} vigas, {n_shells} shells")

    payload: dict = {"variant": variant, "model_size": {
        "nodes": len(nodes), "cols": col_end,
        "beams": beam_end - col_end, "shells": n_shells,
    }}

    if args.static:
        banner("Analisis estatico - 5 casos", ch="-")
        static_out = run_static(args, model)
        if not args.quiet:
            print_picks_table(static_out["picks"])
        payload["picks"] = static_out["picks"]

    if args.modal:
        banner("Analisis modal - 12 modos", ch="-")
        modal_out = run_modal(args, model)
        payload["modal"] = modal_out
        ref_periods = None
        if args.compare:
            ref = load_etabs_reference(args.etabs_ref)
            ref_periods = ref.get("periods_s")
        if not args.quiet:
            print_modal_table(modal_out, ref_periods=ref_periods)

    if args.compare and args.static:
        banner("Comparacion vs ETABS reference (picks)", ch="-")
        if not args.quiet:
            print(compare_picks(payload["picks"], MT.ETABS_PICKS))

    if args.plot:
        banner("Render 3D headless", ch="-")
        render_plot(args, model, args.plot)
        payload["plot_path"] = str(Path(args.plot).absolute())

    if args.json_out:
        with open(args.json_out, "w", encoding="utf-8") as fh:
            json.dump(payload, fh, indent=2, default=str)
        print(f"\n  JSON -> {args.json_out}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
