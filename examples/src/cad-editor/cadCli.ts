import type { CadState, ViewMode } from "./types";
import {
  addGridDirection,
  addStory,
  addNode,
  addNodeAtGrid,
  addNodesAtGrid,
  addFrame,
  addColumnsAtLevel,
  removeNode,
  removeFrame,
  clearAll,
} from "./cadModel";

/**
 * Creates the CLI object exposed as window.cad
 * All commands return feedback to the console.
 */
export function createCli(
  state: CadState,
  viewPanel: HTMLElement
): Record<string, any> {
  const cli = {
    // === Grid ===
    addGrid(
      direction: "X" | "Y",
      positions: number[],
      names?: string[]
    ) {
      addGridDirection(state, direction, positions, names);
      console.log(
        `Grid ${direction}: ${positions.length} axes at [${positions.join(", ")}]`
      );
      return state.grid.val;
    },

    addStory(name: string, elevation: number) {
      addStory(state, name, elevation);
      console.log(`Story "${name}" at z=${elevation}`);
      return state.grid.val.stories;
    },

    getGrid() {
      const g = state.grid.val;
      console.log("Grid X:", g.x.axes.map((a) => `${a.name}@${a.position}`).join(", "));
      console.log("Grid Y:", g.y.axes.map((a) => `${a.name}@${a.position}`).join(", "));
      console.log(
        "Stories:",
        g.stories.map((s) => `${s.name}@${s.elevation}`).join(", ")
      );
      return g;
    },

    // === Nodes ===
    addNode(x: number, y: number, z: number) {
      const id = addNode(state, x, y, z);
      console.log(`Node ${id} at (${x}, ${y}, ${z})`);
      return id;
    },

    addNodeAtGrid(xAxis: string, yAxis: string, story: string) {
      const id = addNodeAtGrid(state, xAxis, yAxis, story);
      console.log(`Node ${id} at grid ${xAxis}-${yAxis}-${story}`);
      return id;
    },

    addNodesAtGrid(storyName: string) {
      const ids = addNodesAtGrid(state, storyName);
      console.log(
        `${ids.length} nodes added at all grid intersections of "${storyName}"`
      );
      return ids;
    },

    removeNode(id: number) {
      removeNode(state, id);
      console.log(`Node ${id} removed`);
    },

    listNodes() {
      const nodes = state.nodes.val;
      console.table(
        nodes.map((n) => ({
          id: n.id,
          x: n.position[0],
          y: n.position[1],
          z: n.position[2],
        }))
      );
      return nodes;
    },

    // === Frames ===
    addFrame(nodeI: number, nodeJ: number) {
      const id = addFrame(state, nodeI, nodeJ);
      console.log(`Frame ${id}: node ${nodeI} -> node ${nodeJ}`);
      return id;
    },

    removeFrame(id: number) {
      removeFrame(state, id);
      console.log(`Frame ${id} removed`);
    },

    addColumnsAtLevel(storyName: string) {
      const ids = addColumnsAtLevel(state, storyName);
      console.log(
        `${ids.length} columns added at "${storyName}"`
      );
      return ids;
    },

    listFrames() {
      const frames = state.frames.val;
      console.table(
        frames.map((f) => ({
          id: f.id,
          nodeI: f.nodeI,
          nodeJ: f.nodeJ,
        }))
      );
      return frames;
    },

    // === Views ===
    view(mode: ViewMode | string, selector?: string) {
      // Aliases for convenience
      const aliases: Record<string, ViewMode> = {
        "elevX": "elevationX", "elevx": "elevationX",
        "elevY": "elevationY", "elevy": "elevationY",
        "planta": "plan", "corte": "section",
      };
      const resolved = (aliases[mode] || mode) as ViewMode;
      const applyView = (viewPanel as any).applyView;
      if (applyView) {
        applyView(resolved, selector);
        console.log(`View: ${resolved}${selector ? ` (${selector})` : ""}`);
      } else {
        console.error("View panel not initialized");
      }
    },

    // === Utility ===
    clear() {
      clearAll(state);
      console.log("Model cleared");
    },

    help() {
      console.log(`
=== Hekatan Struct CLI ===

Grid:
  cad.addGrid('X', [0, 4, 8, 12])     Add X axes (auto-names: 1,2,3,4)
  cad.addGrid('Y', [0, 5, 10])        Add Y axes (auto-names: A,B,C)
  cad.addStory('Base', 0)             Add story level
  cad.getGrid()                        Show grid state

Nodes:
  cad.addNode(x, y, z)                Add node, returns id
  cad.addNodeAtGrid('A','1','Base')   Add node at grid intersection
  cad.addNodesAtGrid('Story 1')       Add nodes at all intersections
  cad.removeNode(id)                  Remove node
  cad.listNodes()                     List all nodes

Frames:
  cad.addFrame(n1, n2)                Add frame between nodes
  cad.removeFrame(id)                 Remove frame
  cad.addColumnsAtLevel('Story 1')    Add columns at all grid points
  cad.listFrames()                    List all frames

Frame 2D (portico plano):
  cad.frame([2.93,4.72,3.20], [3.45,3.07])           Portico irregular
  cad.frame([5,5,5], [3,3,3])                         Portico regular 3x3
  cad.frame([4,6], [3.5,3], 1.5, 2)                   Con volados

Building 3D (edificio):
  cad.building([2.93,4.72,3.20], [3,4.5], [3.45,3.07])  Edificio irregular
  cad.building([5,5], [4,4], [3,3,3])                     Edificio regular

Views:
  cad.view('3d')                      3D perspective
  cad.view('plan', 'Base')            Plan view of story
  cad.view('elevX', 'A')              Elevation looking along X (sees Y-Z)
  cad.view('elevY', '1')              Elevation looking along Y (sees X-Z)

Examples:
  cad.example()                       List available examples
  cad.example('truss')               2D Truss
  cad.example('building')            3-story building
  cad.example('3d')                  3D space frame
  cad.example('portico')             Portico irregular 2D (Matlab)
  cad.example('edificio')            Edificio irregular 3D

Utility:
  cad.clear()                         Clear model
  cad.help()                          Show this help
      `);
    },

    // === Frame Generator (ETABS-style) ===
    /**
     * Generate a portal frame from bay spacings and story heights.
     * sv: bay spacings (X direction), e.g. [2.93, 4.72, 3.20]
     * sp: story heights, e.g. [3.45, 3.07]
     * Lvi: left cantilever length (default 0)
     * Lvd: right cantilever length (default 0)
     */
    frame(sv: number[], sp: number[], Lvi = 0, Lvd = 0) {
      cli.clear();

      // Build X coordinates from bay spacings + cantilevers
      const xCoords: number[] = [];
      if (Lvi > 0) xCoords.push(-Lvi);
      let xAcc = 0;
      xCoords.push(xAcc);
      for (const s of sv) {
        xAcc += s;
        xCoords.push(xAcc);
      }
      if (Lvd > 0) xCoords.push(xAcc + Lvd);

      // Build Z coordinates from story heights
      const zCoords = [0];
      let zAcc = 0;
      for (const s of sp) {
        zAcc += s;
        zCoords.push(zAcc);
      }

      // Cantilever tip detection
      const isCantTip = (ix: number) =>
        (Lvi > 0 && ix === 0) || (Lvd > 0 && ix === xCoords.length - 1);

      // Create nodes — skip ground level for cantilever tips
      const nid: Record<string, number> = {};
      for (let iz = 0; iz < zCoords.length; iz++) {
        for (let ix = 0; ix < xCoords.length; ix++) {
          if (iz === 0 && isCantTip(ix)) continue;
          nid[`${ix},${iz}`] = addNode(state, xCoords[ix], 0, zCoords[iz]);
        }
      }

      // Columns — skip cantilever tips
      let colCount = 0;
      for (let iz = 0; iz < zCoords.length - 1; iz++) {
        for (let ix = 0; ix < xCoords.length; ix++) {
          if (isCantTip(ix)) continue;
          addFrame(state, nid[`${ix},${iz}`], nid[`${ix},${iz + 1}`]);
          colCount++;
        }
      }

      // Beams (cantilever beams connect at iz >= 1 where tip nodes exist)
      let beamCount = 0;
      for (let iz = 1; iz < zCoords.length; iz++) {
        for (let ix = 0; ix < xCoords.length - 1; ix++) {
          addFrame(state, nid[`${ix},${iz}`], nid[`${ix + 1},${iz}`]);
          beamCount++;
        }
      }

      const nNodes = Object.keys(nid).length;
      console.log(
        `Frame generado: ${sv.length} vanos, ${sp.length} pisos` +
          (Lvi > 0 ? `, volado izq=${Lvi}` : "") +
          (Lvd > 0 ? `, volado der=${Lvd}` : "")
      );
      console.log(
        `  ${nNodes} nodos, ${colCount} columnas, ${beamCount} vigas`
      );
      console.log(`  X: [${xCoords.map((v) => v.toFixed(2)).join(", ")}]`);
      console.log(`  Z: [${zCoords.map((v) => v.toFixed(2)).join(", ")}]`);

      return { nodes: nNodes, columns: colCount, beams: beamCount, xCoords, zCoords };
    },

    /**
     * Generate a 3D building from bay spacings in X, Y, and story heights.
     * svX: bay spacings in X, e.g. [2.93, 4.72, 3.20]
     * svY: bay spacings in Y, e.g. [3.00, 4.50]
     * sp:  story heights, e.g. [3.45, 3.07]
     */
    building(svX: number[], svY: number[], sp: number[]) {
      cli.clear();

      // Build X coordinates
      const xCoords = [0];
      for (const s of svX) xCoords.push(xCoords[xCoords.length - 1] + s);

      // Build Y coordinates
      const yCoords = [0];
      for (const s of svY) yCoords.push(yCoords[yCoords.length - 1] + s);

      // Build Z coordinates
      const zCoords = [0];
      for (const s of sp) zCoords.push(zCoords[zCoords.length - 1] + s);

      // Create all nodes (X × Y × Z grid)
      const nid: Record<string, number> = {};
      for (let iz = 0; iz < zCoords.length; iz++)
        for (let iy = 0; iy < yCoords.length; iy++)
          for (let ix = 0; ix < xCoords.length; ix++)
            nid[`${ix},${iy},${iz}`] = addNode(state, xCoords[ix], yCoords[iy], zCoords[iz]);

      // Columns (vertical, between each level)
      let colCount = 0;
      for (let iz = 0; iz < zCoords.length - 1; iz++)
        for (let iy = 0; iy < yCoords.length; iy++)
          for (let ix = 0; ix < xCoords.length; ix++) {
            addFrame(state, nid[`${ix},${iy},${iz}`], nid[`${ix},${iy},${iz + 1}`]);
            colCount++;
          }

      // Beams in X direction (at each elevated level)
      let beamXCount = 0;
      for (let iz = 1; iz < zCoords.length; iz++)
        for (let iy = 0; iy < yCoords.length; iy++)
          for (let ix = 0; ix < xCoords.length - 1; ix++) {
            addFrame(state, nid[`${ix},${iy},${iz}`], nid[`${ix + 1},${iy},${iz}`]);
            beamXCount++;
          }

      // Beams in Y direction (at each elevated level)
      let beamYCount = 0;
      for (let iz = 1; iz < zCoords.length; iz++)
        for (let ix = 0; ix < xCoords.length; ix++)
          for (let iy = 0; iy < yCoords.length - 1; iy++) {
            addFrame(state, nid[`${ix},${iy},${iz}`], nid[`${ix},${iy + 1},${iz}`]);
            beamYCount++;
          }

      const nNodes = Object.keys(nid).length;
      const totalFrames = colCount + beamXCount + beamYCount;
      console.log(
        `Edificio generado: ${svX.length}×${svY.length} vanos, ${sp.length} pisos`
      );
      console.log(
        `  ${nNodes} nodos, ${colCount} columnas, ${beamXCount} vigas X, ${beamYCount} vigas Y (${totalFrames} total)`
      );
      console.log(`  X: [${xCoords.map((v) => v.toFixed(2)).join(", ")}]`);
      console.log(`  Y: [${yCoords.map((v) => v.toFixed(2)).join(", ")}]`);
      console.log(`  Z: [${zCoords.map((v) => v.toFixed(2)).join(", ")}]`);

      return { nodes: nNodes, columns: colCount, beamsX: beamXCount, beamsY: beamYCount, xCoords, yCoords, zCoords };
    },

    // === Examples ===
    example(name?: string) {
      if (!name) {
        console.log(`
Available examples:
  cad.example('truss')            Parametric truss (span=15, div=5, h=2)
  cad.example('beams')            Portal frame (L=10, H=10)
  cad.example('3d-structure')     3D tower with diagonals (dx=dy=dz=2, div=4)
  cad.example('advanced-truss')   Tapered truss (span=20, h=2.5)
  cad.example('curves')           Bezier curved grid (xSpan=16, h=9)
  cad.example('1d-mesh')          Triangular frame (span=10, h=10, mesh=7)
  cad.example('report')           Simple 2-bar truss
  cad.example('building')         3-story building (grid + beams)

Custom generators:
  cad.example('portico')          Portico irregular 2D
  cad.example('edificio')         Edificio irregular 3D
        `);
        return;
      }

      cli.clear();

      switch (name) {
        case "truss": {
          // Parametric truss (awatif truss example, default params)
          const span = 15, divisions = 5, height = 2;
          const dx = span / divisions;
          // Bottom chord nodes
          const bottom: number[] = [];
          for (let i = 0; i <= divisions; i++)
            bottom.push(addNode(state, dx * i, 0, 0));
          // Top chord nodes
          const top: number[] = [];
          for (let i = 0; i <= divisions; i++)
            top.push(addNode(state, dx * i, 0, height));
          // Bottom chord elements
          for (let i = 0; i < divisions; i++)
            addFrame(state, bottom[i], bottom[i + 1]);
          // Top chord elements
          for (let i = 0; i < divisions; i++)
            addFrame(state, top[i], top[i + 1]);
          // Vertical posts
          for (let i = 0; i <= divisions; i++)
            addFrame(state, bottom[i], top[i]);
          // Diagonal web members
          for (let i = 0; i < divisions; i++) {
            if (i < divisions / 2)
              addFrame(state, bottom[i], top[i + 1]);
            else
              addFrame(state, top[i], bottom[i + 1]);
          }
          console.log(`Loaded: Truss (span=${span}, divisions=${divisions}, height=${height})`);
          console.log(`  ${state.nodes.val.length} nodes, ${state.frames.val.length} frames`);
          break;
        }

        case "beams": {
          // Portal frame (awatif beams example, default params)
          const length = 10, height = 10;
          const n0 = addNode(state, 0, 0, 0);
          const n1 = addNode(state, 0, 0, height);
          const n2 = addNode(state, length, 0, height);
          const n3 = addNode(state, length, 0, 0);
          addFrame(state, n0, n1); // left column
          addFrame(state, n1, n2); // top beam
          addFrame(state, n2, n3); // right column
          console.log(`Loaded: Portal Frame (L=${length}, H=${height}) — 4 nodes, 3 frames`);
          break;
        }

        case "3d-structure":
        case "3d": {
          // 3D tower with diagonals (awatif 3d-structure example)
          const dx = 2, dy = 2, dz = 2, divisions = 4;
          // 4 corners per level, offset to center in grid
          const nid: number[][] = [];
          for (let i = 0; i <= divisions; i++) {
            const level: number[] = [];
            level.push(addNode(state, 6 + 0,  6 + 0,  dz * i));
            level.push(addNode(state, 6 + dx, 6 + 0,  dz * i));
            level.push(addNode(state, 6 + dx, 6 + dy, dz * i));
            level.push(addNode(state, 6 + 0,  6 + dy, dz * i));
            nid.push(level);
          }
          // Horizontal beams at each elevated level
          for (let i = 1; i <= divisions; i++) {
            addFrame(state, nid[i][0], nid[i][1]);
            addFrame(state, nid[i][1], nid[i][2]);
            addFrame(state, nid[i][2], nid[i][3]);
            addFrame(state, nid[i][3], nid[i][0]);
            addFrame(state, nid[i][0], nid[i][2]); // X diagonal
          }
          // Columns
          for (let i = 0; i < divisions; i++)
            for (let c = 0; c < 4; c++)
              addFrame(state, nid[i][c], nid[i + 1][c]);
          // Wall diagonals
          for (let i = 0; i < divisions; i++) {
            addFrame(state, nid[i][0], nid[i + 1][1]);
            addFrame(state, nid[i][3], nid[i + 1][2]);
            addFrame(state, nid[i][0], nid[i + 1][3]);
            addFrame(state, nid[i][1], nid[i + 1][2]);
          }
          console.log(`Loaded: 3D Structure (dx=${dx}, dy=${dy}, dz=${dz}, divisions=${divisions})`);
          console.log(`  ${state.nodes.val.length} nodes, ${state.frames.val.length} frames`);
          break;
        }

        case "advanced-truss": {
          // Tapered truss (awatif advanced-truss, default params, single truss)
          const span = 20, spacing = 2.5;
          const leftHeight = 2.5, rightHeight = 2.5;
          const adjSpacing = span / Math.round(span / spacing);
          const divisions = Math.round(span / adjSpacing);
          const heightSlope = (leftHeight - rightHeight) / span;
          // Bottom chord
          const bottom: number[] = [];
          for (let i = 0; i <= divisions; i++)
            bottom.push(addNode(state, adjSpacing * i, 0, 0));
          // Top chord (height varies linearly)
          const top: number[] = [];
          for (let i = 0; i <= divisions; i++) {
            const h = leftHeight - heightSlope * adjSpacing * i;
            top.push(addNode(state, adjSpacing * i, 0, h));
          }
          // Bottom chord elements
          for (let i = 0; i < divisions; i++)
            addFrame(state, bottom[i], bottom[i + 1]);
          // Top chord elements
          for (let i = 0; i < divisions; i++)
            addFrame(state, top[i], top[i + 1]);
          // Vertical posts
          for (let i = 0; i <= divisions; i++)
            addFrame(state, bottom[i], top[i]);
          // Web diagonals (webType=1: bottom[i] to top[i+1])
          for (let i = 0; i < divisions; i++)
            addFrame(state, bottom[i], top[i + 1]);
          console.log(`Loaded: Advanced Truss (span=${span}, spacing=${adjSpacing}, h=${leftHeight})`);
          console.log(`  ${state.nodes.val.length} nodes, ${state.frames.val.length} frames`);
          break;
        }

        case "curves": {
          // Bezier curved grid (awatif curves example, default params)
          const xSpan = 16, xDiv = 14, ySpan = 5, yDiv = 3, height = 9;
          // Generate Bezier curve points
          const curvePoints: [number, number, number][] = [];
          for (let t = 0; t <= xDiv; t++) {
            const u = t / xDiv;
            // Quadratic Bezier: P0=(0,0,0), P1=(xSpan/2, 0, height), P2=(xSpan, 0, 0)
            const x = (1 - u) * (1 - u) * 0 + 2 * (1 - u) * u * (xSpan / 2) + u * u * xSpan;
            const z = (1 - u) * (1 - u) * 0 + 2 * (1 - u) * u * height + u * u * 0;
            curvePoints.push([x, 0, z]);
          }
          // Create nodes: curve replicated along Y
          const nodeIds: number[][] = [];
          for (let iy = 0; iy <= yDiv; iy++) {
            const row: number[] = [];
            const y = iy * (ySpan / yDiv);
            for (const [cx, , cz] of curvePoints)
              row.push(addNode(state, cx, y, cz));
            nodeIds.push(row);
          }
          // Main beams (along curve, X direction)
          for (let iy = 0; iy <= yDiv; iy++)
            for (let ix = 0; ix < xDiv; ix++)
              addFrame(state, nodeIds[iy][ix], nodeIds[iy][ix + 1]);
          // Secondary beams (perpendicular, Y direction)
          for (let iy = 0; iy < yDiv; iy++)
            for (let ix = 0; ix <= xDiv; ix++)
              addFrame(state, nodeIds[iy][ix], nodeIds[iy + 1][ix]);
          console.log(`Loaded: Curved Grid (xSpan=${xSpan}, ySpan=${ySpan}, height=${height})`);
          console.log(`  ${state.nodes.val.length} nodes, ${state.frames.val.length} frames`);
          break;
        }

        case "1d-mesh": {
          // Triangular frame with mesh (awatif 1d-mesh, default params)
          const count = 7, span = 10, height = 10;
          const ids: number[] = [];
          // Beam 1: vertical from (0,0,0) to (0,0,height)
          for (let i = 0; i <= count; i++)
            ids.push(addNode(state, 0, 0, (height / count) * i));
          for (let i = 0; i < count; i++)
            addFrame(state, ids[i], ids[i + 1]);
          // Beam 2: horizontal from (0,0,height) to (span,0,height)
          const s1 = ids.length;
          for (let i = 1; i <= count; i++)
            ids.push(addNode(state, (span / count) * i, 0, height));
          addFrame(state, ids[s1 - 1], ids[s1]); // connect to top of beam 1
          for (let i = 0; i < count - 1; i++)
            addFrame(state, ids[s1 + i], ids[s1 + i + 1]);
          // Beam 3: vertical from (span,0,height) to (span,0,0)
          const s2 = ids.length;
          for (let i = 1; i <= count; i++)
            ids.push(addNode(state, span, 0, height - (height / count) * i));
          addFrame(state, ids[s2 - 1], ids[s2]); // connect to end of beam 2
          for (let i = 0; i < count - 1; i++)
            addFrame(state, ids[s2 + i], ids[s2 + i + 1]);
          console.log(`Loaded: 1D Mesh Triangular Frame (span=${span}, height=${height}, mesh=${count})`);
          console.log(`  ${state.nodes.val.length} nodes, ${state.frames.val.length} frames`);
          break;
        }

        case "report": {
          // Simple 2-bar truss (awatif report example)
          const n0 = addNode(state, 250, 0, 0);
          const n1 = addNode(state, 600, 0, 0);
          const n2 = addNode(state, 250, 0, 400);
          addFrame(state, n0, n1);
          addFrame(state, n1, n2);
          console.log("Loaded: Report Truss — 3 nodes, 2 frames (units: mm scale)");
          break;
        }

        case "building": {
          // 3-story building (based on awatif building example)
          cli.addGrid("X", [0, 5, 10]);
          cli.addGrid("Y", [0, 4, 8]);
          cli.addStory("Base", 0);
          cli.addStory("Story 1", 3.5);
          cli.addStory("Story 2", 7.0);
          cli.addStory("Roof", 10.5);

          // Nodes at all levels
          cli.addNodesAtGrid("Base");
          cli.addNodesAtGrid("Story 1");
          cli.addNodesAtGrid("Story 2");
          cli.addNodesAtGrid("Roof");

          // Columns between each level
          cli.addColumnsAtLevel("Story 1");
          cli.addColumnsAtLevel("Story 2");
          cli.addColumnsAtLevel("Roof");

          // Beams at each elevated level (X direction)
          const grid = state.grid.val;
          for (const story of grid.stories.slice(1)) {
            const z = story.elevation;
            for (const yAxis of grid.y.axes) {
              const y = yAxis.position;
              for (let i = 0; i < grid.x.axes.length - 1; i++) {
                const x1 = grid.x.axes[i].position;
                const x2 = grid.x.axes[i + 1].position;
                const nI = findNodeId(state, x1, y, z);
                const nJ = findNodeId(state, x2, y, z);
                if (nI >= 0 && nJ >= 0) addFrame(state, nI, nJ);
              }
            }
            // Beams Y direction
            for (const xAxis of grid.x.axes) {
              const x = xAxis.position;
              for (let i = 0; i < grid.y.axes.length - 1; i++) {
                const y1 = grid.y.axes[i].position;
                const y2 = grid.y.axes[i + 1].position;
                const nI = findNodeId(state, x, y1, z);
                const nJ = findNodeId(state, x, y2, z);
                if (nI >= 0 && nJ >= 0) addFrame(state, nI, nJ);
              }
            }
          }

          console.log(
            `Loaded: 3-Story Building (${state.nodes.val.length} nodes, ${state.frames.val.length} frames)`
          );
          break;
        }

        case "portico": {
          // Portico irregular 2D (from Matlab etabs)
          cli.frame([2.93, 4.72, 3.20], [3.45, 3.07]);
          cli.view("elevationY");
          console.log("Loaded: Portico Irregular 2D (sv=[2.93,4.72,3.20], sp=[3.45,3.07])");
          break;
        }

        case "edificio": {
          // Edificio irregular 3D
          cli.building([2.93, 4.72, 3.20], [3.00, 4.50], [3.45, 3.07]);
          cli.view("3d");
          console.log("Loaded: Edificio Irregular 3D (svX=[2.93,4.72,3.20], svY=[3,4.5], sp=[3.45,3.07])");
          break;
        }

        default:
          console.error(`Unknown example: "${name}". Type cad.example() for list.`);
      }
    },

    // === Direct state access (for advanced users) ===
    get state() {
      return state;
    },
  };

  return cli;
}

function findNodeId(state: CadState, x: number, y: number, z: number): number {
  const tol = 1e-6;
  const node = state.nodes.val.find(
    (n) =>
      Math.abs(n.position[0] - x) < tol &&
      Math.abs(n.position[1] - y) < tol &&
      Math.abs(n.position[2] - z) < tol
  );
  return node ? node.id : -1;
}
