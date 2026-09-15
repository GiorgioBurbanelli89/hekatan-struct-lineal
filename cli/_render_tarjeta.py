# Tarjeta QR a 1920x960 CSS (x2 = 3840x1920), como las de los vídeos anteriores.  python cli/_render_tarjeta.py tarjeta.html salida.png
import asyncio, pathlib, sys
from playwright.async_api import async_playwright
async def main():
    html, out = pathlib.Path(sys.argv[1]).resolve(), pathlib.Path(sys.argv[2]).resolve()
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={"width": 1920, "height": 960}, device_scale_factor=2)
        errores = []
        pg.on("console", lambda m: m.type == "error" and errores.append(m.text))
        await pg.goto(html.as_uri()); await pg.wait_for_timeout(800)
        await pg.screenshot(path=str(out)); await b.close()
        print("ok", out, "errores:", errores)
asyncio.run(main())
