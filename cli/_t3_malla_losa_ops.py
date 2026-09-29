# Losa apoyada N×N en triángulos con OpenSees ASDShellT3 (Petracca, Camata): la misma malla y carga que
# cli/_t3_malla_losa.mjs, para tener otro programa de referencia.
import openseespy.opensees as ops
a, E, nu, q = 4.0, 2.2e7, 0.3, 10.0
for t in (0.02, 0.4):
    for N in (4, 8, 16):
        ops.wipe(); ops.model('basic', '-ndm', 3, '-ndf', 6)
        nid = lambda i, j: i*(N+1) + j + 1
        for i in range(N+1):
            for j in range(N+1):
                ops.node(nid(i, j), a*i/N, a*j/N, 0.0)
                borde = i in (0, N) or j in (0, N)
                ops.fix(nid(i, j), 1, 1, 1 if borde else 0, 0, 0, 1)
        ops.section('ElasticMembranePlateSection', 1, E, nu, t, 0.0)
        ops.timeSeries('Linear', 1); ops.pattern('Plain', 1, 1)
        k = 0; carga = {}
        for i in range(N):
            for j in range(N):
                for tri in ((nid(i,j), nid(i+1,j), nid(i+1,j+1)), (nid(i,j), nid(i+1,j+1), nid(i,j+1))):
                    k += 1; ops.element('ASDShellT3', k, *tri, 1)
                    for n in tri: carga[n] = carga.get(n, 0.0) - q*(a/N)**2/2/3
        for n, f in carga.items(): ops.load(n, 0, 0, f, 0, 0, 0)
        ops.system('UmfPack'); ops.numberer('RCM'); ops.constraints('Plain'); ops.integrator('LoadControl', 1.0); ops.algorithm('Linear'); ops.analysis('Static')
        ops.analyze(1)
        print(f"t={t} N={N:2d} ASDShellT3: w centro {-ops.nodeDisp(nid(N//2, N//2), 3):.6e}")
