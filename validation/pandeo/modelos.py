"""Modelos de prueba del pandeo lineal (mismos para SAP2000 y Hekatan). Unidades kN, m."""
E, NU = 2.5e7, 0.2

def columna(n):
    L = 3.0
    return dict(nombre="columna_%d" % n, nodes=[[0, 0, L * k / n] for k in range(n + 1)],
                frames=[[k, k + 1, 0.3, 0.3, 0.0] for k in range(n)], apoyos={0: [1] * 6},
                cargas={n: [0, 0, -1000.0, 0, 0, 0]})

def portico(n):
    # pórtico plano en XZ: 2 columnas de 3 m, viga de 5 m, cada barra en n trozos; fuera del plano libre (3D)
    nodes, frames = [], []
    def linea(a, b, sec):
        ids = []
        for k in range(n + 1):
            p = [a[c] + (b[c] - a[c]) * k / n for c in range(3)]
            for q, x in enumerate(nodes):
                if max(abs(x[c] - p[c]) for c in range(3)) < 1e-9: ids.append(q); break
            else: nodes.append(p); ids.append(len(nodes) - 1)
        for k in range(n): frames.append([ids[k], ids[k + 1]] + sec)
    linea([0, 0, 0], [0, 0, 3], [0.3, 0.4, 0.0]); linea([5, 0, 0], [5, 0, 3], [0.3, 0.4, 30.0]); linea([0, 0, 3], [5, 0, 3], [0.25, 0.5, 0.0])
    top = [q for q, x in enumerate(nodes) if abs(x[2] - 3) < 1e-9 and x[0] in (0, 5)]
    car = {q: [0, 0, -800.0, 0, 0, 0] for q in top}; car[top[0]] = [20.0, 0, -800.0, 0, 0, 0]
    return dict(nombre="portico_%d" % n, nodes=nodes, frames=frames, apoyos={0: [1] * 6, nodes.index([5, 0, 0]): [1, 1, 1, 0, 0, 0]}, cargas=car)

def edificio(n):
    # 2×2 vanos de 4 m, 2 pisos de 3 m, cada barra en n trozos; gravedad en los nudos de piso + lateral en X
    nodes, frames = [], []
    def nudo(p):
        for q, x in enumerate(nodes):
            if max(abs(x[c] - p[c]) for c in range(3)) < 1e-9: return q
        nodes.append(p); return len(nodes) - 1
    def linea(a, b, sec):
        ids = [nudo([a[c] + (b[c] - a[c]) * k / n for c in range(3)]) for k in range(n + 1)]
        for k in range(n): frames.append([ids[k], ids[k + 1]] + sec)
    for z0, z1 in ((0, 3), (3, 6)):
        for x in (0, 4, 8):
            for y in (0, 4, 8): linea([x, y, z0], [x, y, z1], [0.4, 0.4, 0.0])
        for y in (0, 4, 8):
            for x0 in (0, 4): linea([x0, y, z1], [x0 + 4, y, z1], [0.3, 0.5, 0.0])
        for x in (0, 4, 8):
            for y0 in (0, 4): linea([x, y0, z1], [x, y0 + 4, z1], [0.3, 0.5, 90.0])
    apo = {q: [1] * 6 for q, x in enumerate(nodes) if abs(x[2]) < 1e-9}
    car = {q: [0, 0, -400.0, 0, 0, 0] for q, x in enumerate(nodes) if abs(x[2] - 3) < 1e-9 or abs(x[2] - 6) < 1e-9}
    for q, x in enumerate(nodes):
        if abs(x[2] - 6) < 1e-9 and x[0] == 0 and x[1] in (0, 4, 8) and x[0] % 4 == 0: car[q] = [30.0, 0, -400.0, 0, 0, 0]
    return dict(nombre="edificio_%d" % n, nodes=nodes, frames=frames, apoyos=apo, cargas=car)

MODELOS = [columna(1), columna(4), portico(1), portico(4), edificio(4)]
