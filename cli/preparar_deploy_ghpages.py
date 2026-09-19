"""Prepara (NO publica) el deploy del build local a gh-pages, conservando lo que en gh-pages NO sale del build:
m/ (modelos compartidos), googleee7f6c1b9c374c54.html, sitemap.xml, index.html raiz (SEO) y el bloque SEO de
workspace/index.html (lang=es, title, meta description/OG/canonical).

  1. npm run build:deploy                       (DEPLOY_BASE=/hekatan-struct-lineal/ -> website/src/examples)
  2. python cli/preparar_deploy_ghpages.py      (worktree de gh-pages en ../_ghpages_wt, copia el build encima,
                                                 fusiona el SEO del workspace/index.html, muestra git status)
  3. (a mano, lo decide Jorge)  cd ../_ghpages_wt && git add -A && git commit -m "..." && git push hekatan-struct gh-pages
  4. comprobar: sha1 de assets/deform-*.wasm publicado = el local; cli/check_deploy.mjs + PNG.
"""
import os, re, shutil, subprocess, sys, hashlib, glob
RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
BUILD = os.path.join(RAIZ, "website", "src", "examples")
WT = os.path.abspath(os.path.join(RAIZ, "..", "_ghpages_wt"))
CONSERVAR = {"m", "googleee7f6c1b9c374c54.html", "sitemap.xml", "index.html", ".git", ".nojekyll"}
sh = lambda *a, **k: subprocess.run(a, cwd=k.get("cwd", RAIZ), check=True, capture_output=True, text=True).stdout
if not os.path.isdir(BUILD): sys.exit("falta el build: npm run build:deploy")
sh("git", "fetch", "hekatan-struct", "gh-pages")
SHA = sh("git", "rev-parse", "FETCH_HEAD").strip()  # el FETCH_HEAD del worktree no es el del repo
if not os.path.isdir(WT):
    sh("git", "worktree", "add", "--detach", WT, SHA)
else:
    sh("git", "checkout", "--detach", SHA, cwd=WT)
seo_ws = open(os.path.join(WT, "workspace", "index.html"), encoding="utf-8").read()
# copiar el build encima (sin borrar lo que no viene del build; assets viejos se quedan, no molestan)
for nom in os.listdir(BUILD):
    if nom in CONSERVAR: continue
    src, dst = os.path.join(BUILD, nom), os.path.join(WT, nom)
    if os.path.isdir(src): shutil.copytree(src, dst, dirs_exist_ok=True)
    else: shutil.copy2(src, dst)
# workspace/index.html: el del build (hashes nuevos) + el bloque SEO del publicado
nuevo = open(os.path.join(BUILD, "workspace", "index.html"), encoding="utf-8").read()
seo = re.search(r"(\s*<title>.*?</title>.*?<meta name=\"twitter:card\"[^>]*>)", seo_ws, re.S)
if not seo: sys.exit("no encontre el bloque SEO en el workspace/index.html publicado")
nuevo = nuevo.replace('<html lang="en">', '<html lang="es">', 1)
nuevo = re.sub(r"\s*<title>Hekatan Struct Lineal</title>", "", nuevo, 1)
nuevo = re.sub(r"(<meta name=\"viewport\"[^>]*>)", r"\1" + seo.group(1).replace("\\", "\\\\"), nuevo, 1)
open(os.path.join(WT, "workspace", "index.html"), "w", encoding="utf-8").write(nuevo)
w = glob.glob(os.path.join(WT, "assets", "deform-*.wasm"))
wl = glob.glob(os.path.join(BUILD, "assets", "deform-*.wasm"))
print("wasm del build:", [(os.path.basename(f), hashlib.sha1(open(f, "rb").read()).hexdigest()) for f in wl])
print("m/ conservado:", os.path.isdir(os.path.join(WT, "m")), "| google:", os.path.exists(os.path.join(WT, "googleee7f6c1b9c374c54.html")),
      "| sitemap:", os.path.exists(os.path.join(WT, "sitemap.xml")))
print(sh("git", "status", "--short", cwd=WT)[:3000])
print("LISTO para revisar en", WT, "— NO se hizo commit ni push.")
