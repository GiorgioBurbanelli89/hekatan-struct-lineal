# Relanza sap_lote.py hasta que termine; si no avanza en 240 s, mata SOLO el SAP2000 que arrancó él.
import subprocess, sys, time, os
AQ = os.path.dirname(os.path.abspath(__file__))
def pids():
    r = subprocess.run(["tasklist", "/FI", "IMAGENAME eq SAP2000.exe", "/FO", "CSV", "/NH"], capture_output=True, text=True)
    return {int(l.split('","')[1]) for l in r.stdout.splitlines() if l.startswith('"SAP2000')}
args = sys.argv[1:]
for intento in range(8):
    antes = pids()
    log = open(os.path.join(AQ, "vigia_%d.log" % intento), "w")
    p = subprocess.Popen([sys.executable, os.path.join(AQ, "sap_lote.py")] + args, stdout=log, stderr=subprocess.STDOUT, cwd=AQ)
    ultimo, tam = time.time(), 0
    while p.poll() is None:
        time.sleep(5)
        n = len(os.listdir(os.path.join(AQ, "res_sap")))
        s = os.path.getsize(log.name)
        if (n, s) != tam: tam, ultimo = (n, s), time.time()
        if time.time() - ultimo > 420:
            print("colgado, intento", intento, flush=True)
            p.kill()
            for q in pids() - antes: subprocess.run(["taskkill", "/F", "/PID", str(q)], capture_output=True)
            time.sleep(5); break
    else:
        print("terminado, codigo", p.returncode, flush=True)
        if p.returncode == 0: break
