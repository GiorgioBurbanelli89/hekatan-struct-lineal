"""
Mouse-simulator para probar las CAD tools de Hekatan NewBlank.

Objetivo: intentar dibujar un pórtico 2D (2 columnas + 1 viga) usando solo
clicks de mouse sobre el viewer, replicando lo que haría un usuario humano
recien llegado. Reporta los problemas que encuentra.
"""
import json, os, sys
from pathlib import Path
from playwright.sync_api import sync_playwright

OUT = Path(__file__).parent / "cad_mouse_test_out"
OUT.mkdir(exist_ok=True)
URL = "http://localhost:4601/workspace/?t=new-blank"
CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe"

# Log buffer — todo lo que pasa se reporta al final
log = []
def L(msg):
    print(msg, flush=True)
    log.append(msg)

with sync_playwright() as p:
    browser = p.chromium.launch(
        headless=True,
        executable_path=CHROME,
        args=["--disable-gpu-vsync", "--no-sandbox"],
    )
    ctx = browser.new_context(
        viewport={"width": 1600, "height": 900},
        device_scale_factor=1,
    )
    page = ctx.new_page()

    # Capturar consola del browser
    page.on("console", lambda m: log.append(f"[BROWSER {m.type}] {m.text}"))
    page.on("pageerror", lambda e: log.append(f"[PAGEERROR] {e}"))

    # 1) Cargar NewBlank y esperar setup
    L(f"→ Abriendo {URL}")
    page.goto(URL, wait_until="networkidle", timeout=60000)
    page.wait_for_timeout(3000)  # dar tiempo a Three.js + Tweakpane + ejemplo

    # PRIMERA OBSERVACIÓN: limpiar drawing previo de localStorage
    page.evaluate("""
        () => {
            localStorage.removeItem('hk_drawingPoints');
            localStorage.removeItem('hk_drawingPolylines');
            localStorage.removeItem('hk_drawingAreas');
        }
    """)
    page.reload(wait_until="networkidle")
    page.wait_for_timeout(3000)
    page.screenshot(path=str(OUT / "01_initial.png"))
    L("✓ Screenshot 01_initial guardado")

    # 2) Inspeccionar el estado del CAD
    state = page.evaluate("""
        () => {
            const cad = window.__hekatanCadState?.get?.();
            const pts = window.__hekatanDrawingPoints?.val ?? null;
            const polys = window.__hekatanDrawingPolylines?.val ?? null;
            const grid = window.__hekatanGridConfig ?? null;
            const target = window.__hekatanDrawingGridTarget?.val ?? null;
            return {
                tool: cad?.tool, workPlane: cad?.workPlane, workZ: cad?.workZ,
                snap: cad?.snap,
                pts, polys, grid, gridTarget: target,
            };
        }
    """)
    L(f"Estado inicial CAD: {json.dumps(state, indent=2, default=str)[:600]}")

    # 3) Localizar el canvas del viewer Three.js
    canvas = page.locator("canvas").first
    if not canvas.is_visible():
        L("✗ FAIL: no se encontró canvas visible")
    else:
        box = canvas.bounding_box()
        L(f"Canvas bbox: {box}")
        cx = box["x"] + box["width"] / 2
        cy = box["y"] + box["height"] / 2
        L(f"Centro canvas: ({cx:.0f}, {cy:.0f})")

    # 4) Activar tool=line vía JS (no via Tweakpane button — fragil)
    L("→ Activando tool='line' via __hekatanCadState.setTool")
    activated = page.evaluate("""
        () => {
            try {
                window.__hekatanCadState?.setTool?.('line');
                const cad = window.__hekatanCadState?.get?.();
                return { ok: true, tool: cad?.tool };
            } catch (e) { return { ok: false, err: String(e) }; }
        }
    """)
    L(f"setTool result: {activated}")

    # 5) Simular 4 clicks para un pórtico: base izq, top izq, top der, base der
    # (en plano XY default — Z=0). Coordenadas pixel relativas al canvas.
    # Hekatan camera default es iso, así que las coords pixel→mundo son
    # difíciles de predecir sin un raycaster. Probaré 4 clicks dispersos
    # alrededor del centro y veré qué puntos se registran.
    clicks_relative = [
        (-200, +120),  # esperando base izq
        (-200, -120),  # esperando top izq
        (+200, -120),  # esperando top der
        (+200, +120),  # esperando base der
    ]

    points_progress = []
    for i, (dx, dy) in enumerate(clicks_relative, 1):
        x, y = cx + dx, cy + dy
        L(f"\n→ Click #{i} en pixel ({x:.0f}, {y:.0f})")
        page.mouse.move(x, y)
        page.wait_for_timeout(300)
        page.mouse.click(x, y, delay=50)
        page.wait_for_timeout(800)
        pts_now = page.evaluate("() => window.__hekatanDrawingPoints?.val ?? []")
        polys_now = page.evaluate("() => window.__hekatanDrawingPolylines?.val ?? []")
        L(f"  drawingPoints len={len(pts_now)} polys len={len(polys_now)}")
        L(f"  drawingPoints={pts_now}")
        L(f"  drawingPolylines={polys_now}")
        page.screenshot(path=str(OUT / f"02_click{i}.png"))
        points_progress.append({"i": i, "px": (x, y), "pts": pts_now, "polys": polys_now})

    # 6) Cambiar a tool=polyline e intentar otra cosa
    L("\n→ Cambiando a tool='polyline'")
    page.evaluate("() => window.__hekatanCadState?.setTool?.('polyline')")
    page.wait_for_timeout(300)

    # 7) Screenshot final + dump estado
    page.screenshot(path=str(OUT / "03_final.png"))
    final = page.evaluate("""
        () => {
            const cad = window.__hekatanCadState?.get?.();
            return {
                tool: cad?.tool, workPlane: cad?.workPlane,
                drawingPoints: window.__hekatanDrawingPoints?.val,
                drawingPolylines: window.__hekatanDrawingPolylines?.val,
                drawingAreas: window.__hekatanDrawingAreas?.val,
            };
        }
    """)
    L(f"\nESTADO FINAL: {json.dumps(final, indent=2, default=str)}")

    browser.close()

# Persistir log
(OUT / "log.txt").write_text("\n".join(log), encoding="utf-8")
L(f"\nLog completo: {OUT / 'log.txt'}")
