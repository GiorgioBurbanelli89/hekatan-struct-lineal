"""
Comparacion muro de contencion: Hekatan vs OpenSees
3 modelos:
  0 - Rankine (Ka): presion triangular en fuste
  1 - Suelo continuo: muro+suelo como continuo, gravedad
  2 - Interfaz: franja debil entre muro y suelo

Unidades: kN, m, s, kPa
"""
import openseespy.opensees as ops
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.tri as mtri

# ── Parametros (mismos que en Hekatan) ──
H = 4.0        # altura fuste
B = 3.0        # base total
tw = 0.3       # espesor fuste
tb = 0.4       # espesor base
E_conc = 25e6  # E concreto (kPa)
nu_conc = 0.2
gamma = 18.0   # peso especifico suelo (kN/m3)
Ka = 0.33
E_soil = 50000 # E suelo (kPa)
nu_soil = 0.3
E_intf = 500   # E interfaz (kPa)
ti = 0.05      # espesor interfaz (m)
meshSize = 0.2


def generate_grid_nodes(xmin, xmax, ymin, ymax, dx):
    """Genera nodos en grid regular dentro de rectangulo"""
    nx = max(int(round((xmax - xmin) / dx)), 2)
    ny = max(int(round((ymax - ymin) / dx)), 2)
    nodes = []
    for j in range(ny + 1):
        for i in range(nx + 1):
            x = xmin + i * (xmax - xmin) / nx
            y = ymin + j * (ymax - ymin) / ny
            nodes.append((x, y))
    return nodes, nx, ny


def triangulate_grid(nx, ny, node_offset=0):
    """Genera triangulos de un grid nx x ny"""
    elements = []
    for j in range(ny):
        for i in range(nx):
            n0 = node_offset + j * (nx + 1) + i
            n1 = n0 + 1
            n2 = n0 + (nx + 1)
            n3 = n2 + 1
            elements.append((n0, n1, n3))
            elements.append((n0, n3, n2))
    return elements


def run_model(mode):
    """
    mode=0: Rankine
    mode=1: Suelo continuo
    mode=2: Interfaz
    """
    ops.wipe()
    ops.model('basic', '-ndm', 2, '-ndf', 2)

    toeLen = B * 0.3
    heelLen = B * 0.7

    if mode == 0:
        # ── RANKINE: solo muro L-shape, presion triangular ──
        # Generar grid para base: (-toeLen,0) a (heelLen,tb)
        dx = meshSize
        base_nodes, bnx, bny = generate_grid_nodes(-toeLen, heelLen, 0, tb, dx)
        # Generar grid para fuste: (0,tb) a (tw,tb+H)
        stem_nodes, snx, sny = generate_grid_nodes(0, tw, tb, tb + H, dx)

        # Crear nodos (evitar duplicados en la interfaz base-fuste)
        nid = 1
        node_map = {}  # (x,y) -> nid
        tol = dx * 0.01

        def add_node(x, y):
            nonlocal nid
            for (kx, ky), kid in node_map.items():
                if abs(kx - x) < tol and abs(ky - y) < tol:
                    return kid
            ops.node(nid, x, y)
            node_map[(x, y)] = nid
            nid += 1
            return nid - 1

        # Base nodes
        base_ids = []
        for (x, y) in base_nodes:
            base_ids.append(add_node(x, y))

        # Stem nodes
        stem_ids = []
        for (x, y) in stem_nodes:
            stem_ids.append(add_node(x, y))

        # Material: plane stress concreto
        matTag = 1
        ops.nDMaterial('ElasticIsotropic', matTag, E_conc, nu_conc)

        # Elements - base
        eid = 1
        base_elems = triangulate_grid(bnx, bny)
        for (i0, i1, i2) in base_elems:
            n0, n1, n2 = base_ids[i0], base_ids[i1], base_ids[i2]
            ops.element('tri31', eid, n0, n1, n2, 1.0, 'PlaneStress', matTag)
            eid += 1

        # Elements - stem
        stem_elems = triangulate_grid(snx, sny)
        for (i0, i1, i2) in stem_elems:
            n0, n1, n2 = stem_ids[i0], stem_ids[i1], stem_ids[i2]
            ops.element('tri31', eid, n0, n1, n2, 1.0, 'PlaneStress', matTag)
            eid += 1

        # BC: fix bottom (y=0)
        for (x, y), kid in node_map.items():
            if abs(y) < tol:
                ops.fix(kid, 1, 1)

        # Loads: triangular earth pressure on stem right edge (x~tw)
        ops.timeSeries('Linear', 1)
        ops.pattern('Plain', 1, 1)

        stem_right_nodes = []
        for (x, y), kid in node_map.items():
            if abs(x - tw) < dx * 0.6 and y >= tb - tol:
                stem_right_nodes.append((kid, y))
        stem_right_nodes.sort(key=lambda t: t[1])

        for k, (kid, y) in enumerate(stem_right_nodes):
            depth = (tb + H) - y
            p = Ka * gamma * depth
            # tributary height
            if len(stem_right_nodes) == 1:
                tribH = dx
            elif k == 0:
                tribH = (stem_right_nodes[1][1] - y) / 2
            elif k == len(stem_right_nodes) - 1:
                tribH = (y - stem_right_nodes[k-1][1]) / 2
            else:
                tribH = (stem_right_nodes[k+1][1] - stem_right_nodes[k-1][1]) / 2
            fx = p * tribH
            if abs(fx) > 1e-10:
                ops.load(kid, fx, 0.0)

    elif mode == 1:
        # ── SUELO CONTINUO: muro + suelo, gravedad ──
        dx = meshSize
        soilRight = heelLen
        soilTop = tb + H

        # Combined domain: wall L-shape + soil rectangle
        # Base: (-toeLen,0) to (soilRight, tb)  -- all concrete E at wall zone
        # Stem+Soil: (0,tb) to (soilRight, soilTop)

        # Generate all nodes in a big rectangle: (-toeLen,0) to (soilRight,soilTop)
        all_nodes, anx, any_ = generate_grid_nodes(-toeLen, soilRight, 0, soilTop, dx)

        nid = 1
        node_map = {}
        tol = dx * 0.01

        def add_node(x, y):
            nonlocal nid
            for (kx, ky), kid in node_map.items():
                if abs(kx - x) < tol and abs(ky - y) < tol:
                    return kid
            ops.node(nid, x, y)
            node_map[(x, y)] = nid
            nid += 1
            return nid - 1

        all_ids = []
        for (x, y) in all_nodes:
            all_ids.append(add_node(x, y))

        # Materials
        mat_conc = 1
        mat_soil = 2
        ops.nDMaterial('ElasticIsotropic', mat_conc, E_conc, nu_conc)
        ops.nDMaterial('ElasticIsotropic', mat_soil, E_soil, nu_soil)

        # Triangulate
        all_elems = triangulate_grid(anx, any_)

        eid = 1
        for (i0, i1, i2) in all_elems:
            n0, n1, n2 = all_ids[i0], all_ids[i1], all_ids[i2]
            # Centroid
            x0, y0 = all_nodes[i0]
            x1, y1 = all_nodes[i1]
            x2, y2 = all_nodes[i2]
            cx = (x0 + x1 + x2) / 3
            cy = (y0 + y1 + y2) / 3

            # Is it wall (concrete) or soil?
            in_base = cx >= -toeLen - tol and cx <= heelLen + tol and cy >= -tol and cy <= tb + tol
            in_stem = cx >= -tol and cx <= tw + tol and cy >= tb - tol and cy <= soilTop + tol
            is_wall = in_base or in_stem

            # Skip elements outside the domain (toe side above base with x<0)
            if cx < -tol and cy > tb + tol:
                continue  # outside L-shape + soil

            mat = mat_conc if is_wall else mat_soil
            ops.element('tri31', eid, n0, n1, n2, 1.0, 'PlaneStress', mat)
            eid += 1

        # BC: fix bottom (y=0) and right edge roller
        for (x, y), kid in node_map.items():
            if abs(y) < tol:
                ops.fix(kid, 1, 1)
            elif abs(x - soilRight) < tol:
                ops.fix(kid, 1, 0)  # roller: fix x

        # Gravity on soil elements
        ops.timeSeries('Linear', 1)
        ops.pattern('Plain', 1, 1)

        # Apply body force via nodal loads (same as Hekatan: gamma*area/3 per node)
        for (i0, i1, i2) in all_elems:
            x0, y0 = all_nodes[i0]
            x1, y1 = all_nodes[i1]
            x2, y2 = all_nodes[i2]
            cx = (x0 + x1 + x2) / 3
            cy = (y0 + y1 + y2) / 3

            in_base = cx >= -toeLen - tol and cx <= heelLen + tol and cy >= -tol and cy <= tb + tol
            in_stem = cx >= -tol and cx <= tw + tol and cy >= tb - tol and cy <= soilTop + tol
            is_wall = in_base or in_stem

            if cx < -tol and cy > tb + tol:
                continue
            if is_wall:
                continue  # no gravity on concrete

            area = abs((x1 - x0) * (y2 - y0) - (x2 - x0) * (y1 - y0)) / 2
            fnode = -gamma * area / 3
            for idx in [i0, i1, i2]:
                nid_load = all_ids[idx]
                ops.load(nid_load, 0.0, fnode)

    elif mode == 2:
        # ── INTERFAZ: muro + interface strip + suelo ──
        dx = meshSize
        soilRight = heelLen
        soilTop = tb + H

        nid = 1
        node_map = {}
        tol = dx * 0.01

        def add_node(x, y):
            nonlocal nid
            for (kx, ky), kid in node_map.items():
                if abs(kx - x) < tol and abs(ky - y) < tol:
                    return kid
            ops.node(nid, x, y)
            node_map[(x, y)] = nid
            nid += 1
            return nid - 1

        # Materials
        mat_conc = 1
        mat_intf = 2
        mat_soil = 3
        ops.nDMaterial('ElasticIsotropic', mat_conc, E_conc, nu_conc)
        ops.nDMaterial('ElasticIsotropic', mat_intf, E_intf, nu_soil)
        ops.nDMaterial('ElasticIsotropic', mat_soil, E_soil, nu_soil)

        # 1) Wall L-shape
        # Base: (-toeLen,0) to (heelLen, tb)
        base_nodes, bnx, bny = generate_grid_nodes(-toeLen, heelLen, 0, tb, dx)
        base_ids = [add_node(x, y) for (x, y) in base_nodes]

        # Stem: (0,tb) to (tw,tb+H)
        stem_nodes, snx, sny = generate_grid_nodes(0, tw, tb, soilTop, dx)
        stem_ids = [add_node(x, y) for (x, y) in stem_nodes]

        # 2) Interface strip: (tw, tb) to (tw+ti, soilTop)
        intf_nodes, inx, iny = generate_grid_nodes(tw, tw + ti, tb, soilTop, dx)
        intf_ids = [add_node(x, y) for (x, y) in intf_nodes]

        # 3) Soil: (tw+ti, 0) to (soilRight, soilTop)
        soil_nodes, sox, soy = generate_grid_nodes(tw + ti, soilRight, 0, soilTop, dx)
        soil_ids = [add_node(x, y) for (x, y) in soil_nodes]

        eid = 1

        # Base elements (concrete)
        for (i0, i1, i2) in triangulate_grid(bnx, bny):
            ops.element('tri31', eid, base_ids[i0], base_ids[i1], base_ids[i2],
                        1.0, 'PlaneStress', mat_conc)
            eid += 1

        # Stem elements (concrete)
        for (i0, i1, i2) in triangulate_grid(snx, sny):
            ops.element('tri31', eid, stem_ids[i0], stem_ids[i1], stem_ids[i2],
                        1.0, 'PlaneStress', mat_conc)
            eid += 1

        # Interface elements
        for (i0, i1, i2) in triangulate_grid(inx, iny):
            ops.element('tri31', eid, intf_ids[i0], intf_ids[i1], intf_ids[i2],
                        1.0, 'PlaneStress', mat_intf)
            eid += 1

        # Soil elements
        soil_elems = triangulate_grid(sox, soy)
        for (i0, i1, i2) in soil_elems:
            ops.element('tri31', eid, soil_ids[i0], soil_ids[i1], soil_ids[i2],
                        1.0, 'PlaneStress', mat_soil)
            eid += 1

        # BC: fix bottom (y=0), roller right (x=soilRight)
        for (x, y), kid in node_map.items():
            if abs(y) < tol:
                ops.fix(kid, 1, 1)
            elif abs(x - soilRight) < tol:
                ops.fix(kid, 1, 0)

        # Gravity on soil + interface elements
        ops.timeSeries('Linear', 1)
        ops.pattern('Plain', 1, 1)

        # Interface gravity
        for (i0, i1, i2) in triangulate_grid(inx, iny):
            x0, y0 = intf_nodes[i0]; x1, y1 = intf_nodes[i1]; x2, y2 = intf_nodes[i2]
            area = abs((x1 - x0) * (y2 - y0) - (x2 - x0) * (y1 - y0)) / 2
            fnode = -gamma * area / 3
            for idx in [i0, i1, i2]:
                ops.load(intf_ids[idx], 0.0, fnode)

        # Soil gravity
        for (i0, i1, i2) in soil_elems:
            x0, y0 = soil_nodes[i0]; x1, y1 = soil_nodes[i1]; x2, y2 = soil_nodes[i2]
            area = abs((x1 - x0) * (y2 - y0) - (x2 - x0) * (y1 - y0)) / 2
            fnode = -gamma * area / 3
            for idx in [i0, i1, i2]:
                ops.load(soil_ids[idx], 0.0, fnode)

    # ── Solver ──
    ops.system('BandSPD')
    ops.numberer('RCM')
    ops.constraints('Plain')
    ops.integrator('LoadControl', 1.0)
    ops.algorithm('Linear')
    ops.analysis('Static')
    result = ops.analyze(1)

    if result != 0:
        print(f"  [!] Analysis failed for mode {mode}")
        return None, None

    # Collect results
    all_coords = []
    all_disps = []
    for (x, y), kid in sorted(node_map.items(), key=lambda t: t[1]):
        ux = ops.nodeDisp(kid, 1)
        uy = ops.nodeDisp(kid, 2)
        all_coords.append((x, y))
        all_disps.append((ux, uy))

    all_disps = np.array(all_disps)
    max_disp = np.max(np.sqrt(all_disps[:, 0]**2 + all_disps[:, 1]**2))

    return all_coords, all_disps, max_disp, node_map


# ── Run all 3 models ──
mode_labels = ["Rankine (Ka)", "Suelo continuo", "Interfaz"]
awatif_results = [9.8318e-4, 1.4338e-3, 4.0793e-3]  # from browser console

print("=" * 60)
print("MURO DE CONTENCION: Hekatan vs OpenSees")
print("=" * 60)
print(f"H={H}m, B={B}m, tw={tw}m, tb={tb}m")
print(f"E_conc={E_conc} kPa, nu={nu_conc}")
print(f"gamma={gamma} kN/m3, Ka={Ka}")
print(f"E_soil={E_soil} kPa, nu_soil={nu_soil}")
print(f"E_intf={E_intf} kPa, ti={ti}m")
print(f"meshSize={meshSize}m")
print()

fig, axes = plt.subplots(1, 3, figsize=(18, 8))

for mode in range(3):
    print(f"--- Modo {mode}: {mode_labels[mode]} ---")
    result = run_model(mode)
    if result[0] is None:
        continue

    coords, disps, max_disp, node_map = result
    coords = np.array(coords)

    print(f"  OpenSees:  max|u| = {max_disp:.6e} m")
    print(f"  Hekatan:    max|u| = {awatif_results[mode]:.6e} m")
    diff = abs(max_disp - awatif_results[mode]) / max(awatif_results[mode], 1e-15) * 100
    print(f"  Diferencia: {diff:.2f}%")
    print(f"  Nodos: {len(coords)}")
    print()

    # Plot deformed shape with displacement magnitude
    ax = axes[mode]
    disp_mag = np.sqrt(disps[:, 0]**2 + disps[:, 1]**2)
    scale = 200  # deformation scale factor

    # Triangulate for plotting
    triang = mtri.Triangulation(
        coords[:, 0] + disps[:, 0] * scale,
        coords[:, 1] + disps[:, 1] * scale
    )

    tcf = ax.tricontourf(triang, disp_mag, levels=20, cmap='jet')
    ax.triplot(triang, 'w-', linewidth=0.3, alpha=0.5)
    plt.colorbar(tcf, ax=ax, label='|u| (m)')
    ax.set_title(f'{mode_labels[mode]}\nmax|u|={max_disp:.4e} m\n(Hekatan: {awatif_results[mode]:.4e})')
    ax.set_xlabel('x (m)')
    ax.set_ylabel('y (m)')
    ax.set_aspect('equal')
    ax.grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig('retaining_wall_comparison.png', dpi=150, bbox_inches='tight')
plt.show()
print("Grafico guardado: retaining_wall_comparison.png")
