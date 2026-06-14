/**
 * GraphAlgorithms.js
 * 
 * Pre-calculates algorithm steps for visualizer playback.
 * Returns an array of steps. Each step contains:
 *   - verticesState: Map or object mapping node ID to its status ('visited', 'visiting', 'default')
 *   - edgesState: Map or object mapping edge keys to status ('exploring', 'accepted', 'rejected', 'considering', 'default')
 *   - description: Text explaining the current operation
 *   - info: Extra state like queue/stack contents, distances, output path, etc.
 */

// Helper to construct a unique key for edges
export const getEdgeKey = (from, to, isDirected = false) => {
  if (isDirected) {
    return `${from}->${to}`;
  }
  return `${Math.min(from, to)}-${Math.max(from, to)}`;
};

// 1. BFS Step Generator
export const generateBFS = (vertices, edges, sourceId, targetId, isDirected = false) => {
  const steps = [];
  const visited = new Set();
  const queue = [sourceId];
  const parent = {};

  visited.add(sourceId);

  // Initial step
  steps.push({
    verticesState: { [sourceId]: 'visiting' },
    edgesState: {},
    description: `Initialize BFS from source node ${vertices.find(v => v.id === sourceId)?.label || sourceId}.`,
    queue: [...queue],
  });

  while (queue.length > 0) {
    const current = queue.shift();
    const currentLabel = vertices.find(v => v.id === current)?.label || current;

    // Set visiting state
    const verticesState = {};
    visited.forEach(id => {
      verticesState[id] = id === current ? 'visiting' : 'visited';
    });

    steps.push({
      verticesState: { ...verticesState },
      edgesState: {},
      description: `Dequeue node ${currentLabel} and explore its neighbors.`,
      queue: [...queue],
    });

    if (current === targetId) {
      steps.push({
        verticesState: { ...verticesState, [current]: 'visited' },
        edgesState: {},
        description: `Target node ${currentLabel} reached! Stopping traversal.`,
        queue: [...queue],
        pathReached: true,
      });
      break;
    }

    // Find outgoing edges
    const outgoing = edges.filter(e => {
      if (isDirected) return e.from === current;
      return e.from === current || e.to === current;
    });

    for (const edge of outgoing) {
      const neighbor = edge.from === current ? edge.to : edge.from;
      const neighborLabel = vertices.find(v => v.id === neighbor)?.label || neighbor;
      const edgeKey = getEdgeKey(edge.from, edge.to, isDirected);

      const currentEdgesState = {};
      steps[steps.length - 1]?.edgesState && Object.assign(currentEdgesState, steps[steps.length - 1].edgesState);

      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        parent[neighbor] = current;
        queue.push(neighbor);

        currentEdgesState[edgeKey] = 'accepted';
        const nextVerticesState = { ...verticesState, [neighbor]: 'visiting' };

        steps.push({
          verticesState: nextVerticesState,
          edgesState: { ...currentEdgesState },
          description: `Discover neighbor ${neighborLabel} via edge (${currentLabel} - ${neighborLabel}). Add to queue.`,
          queue: [...queue],
        });
      } else {
        // Already visited / in queue
        currentEdgesState[edgeKey] = 'rejected';
        steps.push({
          verticesState: { ...verticesState },
          edgesState: { ...currentEdgesState },
          description: `Neighbor ${neighborLabel} is already visited. Skip edge.`,
          queue: [...queue],
        });
      }
    }

    // Finish current
    const finishedVertices = {};
    visited.forEach(id => {
      finishedVertices[id] = 'visited';
    });
    steps.push({
      verticesState: finishedVertices,
      edgesState: {},
      description: `Completed exploration from node ${currentLabel}.`,
      queue: [...queue],
    });
  }

  // Reconstruct path if target reached
  if (targetId !== null && visited.has(targetId)) {
    const pathNodes = [];
    let curr = targetId;
    while (curr !== undefined) {
      pathNodes.unshift(curr);
      curr = parent[curr];
    }
    
    // Highlight final path
    const finalEdges = {};
    for (let i = 0; i < pathNodes.length - 1; i++) {
      finalEdges[getEdgeKey(pathNodes[i], pathNodes[i+1], isDirected)] = 'accepted';
    }
    const finalNodes = {};
    pathNodes.forEach(id => { finalNodes[id] = 'visited'; });

    steps.push({
      verticesState: finalNodes,
      edgesState: finalEdges,
      description: `Shortest Path: ${pathNodes.map(id => vertices.find(v => v.id === id)?.label).join(' → ')}`,
      queue: [],
      path: pathNodes,
    });
  }

  return steps;
};

// 2. DFS Step Generator
export const generateDFS = (vertices, edges, sourceId, targetId, isDirected = false) => {
  const steps = [];
  const visited = new Set();
  const stack = [sourceId];
  const parent = {};

  steps.push({
    verticesState: { [sourceId]: 'visiting' },
    edgesState: {},
    description: `Initialize DFS from source node ${vertices.find(v => v.id === sourceId)?.label || sourceId}.`,
    stack: [...stack],
  });

  const dfsRecursive = (current) => {
    visited.add(current);
    const currentLabel = vertices.find(v => v.id === current)?.label || current;

    const verticesState = {};
    visited.forEach(id => {
      verticesState[id] = id === current ? 'visiting' : 'visited';
    });

    steps.push({
      verticesState: { ...verticesState },
      edgesState: {},
      description: `Visit node ${currentLabel}.`,
      stack: [...stack],
    });

    if (current === targetId) {
      return true;
    }

    const outgoing = edges.filter(e => {
      if (isDirected) return e.from === current;
      return e.from === current || e.to === current;
    });

    for (const edge of outgoing) {
      const neighbor = edge.from === current ? edge.to : edge.from;
      const neighborLabel = vertices.find(v => v.id === neighbor)?.label || neighbor;
      const edgeKey = getEdgeKey(edge.from, edge.to, isDirected);

      if (!visited.has(neighbor)) {
        parent[neighbor] = current;
        stack.push(neighbor);

        steps.push({
          verticesState: { ...verticesState, [neighbor]: 'visiting' },
          edgesState: { [edgeKey]: 'exploring' },
          description: `Traverse edge (${currentLabel} - ${neighborLabel}) to explore ${neighborLabel}.`,
          stack: [...stack],
        });

        const found = dfsRecursive(neighbor);
        stack.pop();

        if (found) return true;

        // Backtracking step
        const backtrackVertices = {};
        visited.forEach(id => { backtrackVertices[id] = 'visited'; });
        backtrackVertices[current] = 'visiting';

        steps.push({
          verticesState: backtrackVertices,
          edgesState: { [edgeKey]: 'rejected' },
          description: `Backtrack from node ${neighborLabel} to ${currentLabel}.`,
          stack: [...stack],
        });
      }
    }
    return false;
  };

  dfsRecursive(sourceId);

  // Path reconstruction
  if (targetId !== null && visited.has(targetId)) {
    const pathNodes = [];
    let curr = targetId;
    while (curr !== undefined) {
      pathNodes.unshift(curr);
      curr = parent[curr];
    }
    
    const finalEdges = {};
    for (let i = 0; i < pathNodes.length - 1; i++) {
      finalEdges[getEdgeKey(pathNodes[i], pathNodes[i+1], isDirected)] = 'accepted';
    }
    const finalNodes = {};
    pathNodes.forEach(id => { finalNodes[id] = 'visited'; });

    steps.push({
      verticesState: finalNodes,
      edgesState: finalEdges,
      description: `DFS Path found: ${pathNodes.map(id => vertices.find(v => v.id === id)?.label).join(' → ')}`,
      stack: [],
      path: pathNodes,
    });
  }

  return steps;
};

// 3. Dijkstra Step Generator
export const generateDijkstra = (vertices, edges, sourceId, targetId, isDirected = false) => {
  const steps = [];
  const distances = {};
  const visited = new Set();
  const parent = {};

  vertices.forEach(v => {
    distances[v.id] = Infinity;
  });
  distances[sourceId] = 0;

  steps.push({
    verticesState: { [sourceId]: 'visiting' },
    edgesState: {},
    description: `Set distance of source node to 0, all other nodes to ∞.`,
    distances: { ...distances },
  });

  const getUnvisitedMin = () => {
    let minNode = null;
    let minDist = Infinity;
    vertices.forEach(v => {
      if (!visited.has(v.id) && distances[v.id] < minDist) {
        minDist = distances[v.id];
        minNode = v.id;
      }
    });
    return minNode;
  };

  for (let i = 0; i < vertices.length; i++) {
    const current = getUnvisitedMin();
    if (current === null) break;

    const currentLabel = vertices.find(v => v.id === current)?.label || current;
    visited.add(current);

    const verticesState = {};
    vertices.forEach(v => {
      if (visited.has(v.id)) {
        verticesState[v.id] = v.id === current ? 'visiting' : 'visited';
      }
    });

    steps.push({
      verticesState: { ...verticesState },
      edgesState: {},
      description: `Select unvisited node ${currentLabel} with minimum distance (${distances[current]}).`,
      distances: { ...distances },
    });

    if (current === targetId) {
      steps.push({
        verticesState: { ...verticesState, [current]: 'visited' },
        edgesState: {},
        description: `Target node ${currentLabel} reached! Stopping Dijkstra.`,
        distances: { ...distances },
      });
      break;
    }

    // Relax neighbors
    const outgoing = edges.filter(e => {
      if (isDirected) return e.from === current;
      return e.from === current || e.to === current;
    });

    for (const edge of outgoing) {
      const neighbor = edge.from === current ? edge.to : edge.from;
      if (visited.has(neighbor)) continue;

      const neighborLabel = vertices.find(v => v.id === neighbor)?.label || neighbor;
      const edgeKey = getEdgeKey(edge.from, edge.to, isDirected);
      const weight = Number(edge.weight || 1);

      const alt = distances[current] + weight;

      const currentEdgesState = { [edgeKey]: 'considering' };

      steps.push({
        verticesState: { ...verticesState, [neighbor]: 'visiting' },
        edgesState: { ...currentEdgesState },
        description: `Check connection to neighbor ${neighborLabel}. Alternative path distance = ${distances[current]} + ${weight} = ${alt}.`,
        distances: { ...distances },
      });

      if (alt < distances[neighbor]) {
        distances[neighbor] = alt;
        parent[neighbor] = current;

        steps.push({
          verticesState: { ...verticesState, [neighbor]: 'visited' },
          edgesState: { [edgeKey]: 'accepted' },
          description: `Relax edge: Update distance of ${neighborLabel} to ${alt} via parent ${currentLabel}.`,
          distances: { ...distances },
        });
      } else {
        steps.push({
          verticesState: { ...verticesState },
          edgesState: { [edgeKey]: 'rejected' },
          description: `Keep existing distance for ${neighborLabel} (${distances[neighbor]} < ${alt}).`,
          distances: { ...distances },
        });
      }
    }
  }

  // Path reconstruction
  if (targetId !== null && distances[targetId] !== Infinity) {
    const pathNodes = [];
    let curr = targetId;
    while (curr !== undefined) {
      pathNodes.unshift(curr);
      curr = parent[curr];
    }

    const finalEdges = {};
    for (let i = 0; i < pathNodes.length - 1; i++) {
      finalEdges[getEdgeKey(pathNodes[i], pathNodes[i+1], isDirected)] = 'accepted';
    }
    const finalNodes = {};
    pathNodes.forEach(id => { finalNodes[id] = 'visited'; });

    steps.push({
      verticesState: finalNodes,
      edgesState: finalEdges,
      description: `Shortest Path: ${pathNodes.map(id => vertices.find(v => v.id === id)?.label).join(' → ')} (Cost: ${distances[targetId]})`,
      distances: { ...distances },
      path: pathNodes,
    });
  }

  return steps;
};

// 4. Bellman-Ford Step Generator
export const generateBellmanFord = (vertices, edges, sourceId, targetId, isDirected = false) => {
  const steps = [];
  const distances = {};
  const parent = {};

  vertices.forEach(v => {
    distances[v.id] = Infinity;
  });
  distances[sourceId] = 0;

  steps.push({
    verticesState: { [sourceId]: 'visiting' },
    edgesState: {},
    description: `Initialize Bellman-Ford: Source distance = 0, others = ∞.`,
    distances: { ...distances },
  });

  // Run V - 1 times relaxation
  const V = vertices.length;
  let relaxedAny = false;

  for (let round = 1; round <= V - 1; round++) {
    relaxedAny = false;
    steps.push({
      verticesState: {},
      edgesState: {},
      description: `Start relaxation Pass ${round} of ${V - 1}.`,
      distances: { ...distances },
    });

    for (const edge of edges) {
      const u = edge.from;
      const v = edge.to;
      const weight = Number(edge.weight || 1);
      const edgeKey = getEdgeKey(u, v, isDirected);

      const uLabel = vertices.find(vertex => vertex.id === u)?.label || u;
      const vLabel = vertices.find(vertex => vertex.id === v)?.label || v;

      // Relax (u -> v)
      if (distances[u] !== Infinity) {
        steps.push({
          verticesState: { [u]: 'visiting', [v]: 'visiting' },
          edgesState: { [edgeKey]: 'considering' },
          description: `Evaluate edge (${uLabel} → ${vLabel}). Current dist(${vLabel}) = ${distances[v] === Infinity ? '∞' : distances[v]}. Check alternative: dist(${uLabel}) + weight = ${distances[u]} + ${weight} = ${distances[u] + weight}.`,
          distances: { ...distances },
        });

        if (distances[u] + weight < distances[v]) {
          distances[v] = distances[u] + weight;
          parent[v] = u;
          relaxedAny = true;

          steps.push({
            verticesState: { [u]: 'visited', [v]: 'visited' },
            edgesState: { [edgeKey]: 'accepted' },
            description: `Relaxed edge! Updated dist(${vLabel}) = ${distances[v]}.`,
            distances: { ...distances },
          });
        }
      }

      // If undirected, we must also relax (v -> u)
      if (!isDirected && distances[v] !== Infinity) {
        steps.push({
          verticesState: { [u]: 'visiting', [v]: 'visiting' },
          edgesState: { [edgeKey]: 'considering' },
          description: `Evaluate edge (${vLabel} → ${uLabel}). Current dist(${uLabel}) = ${distances[u] === Infinity ? '∞' : distances[u]}. Check alternative: dist(${vLabel}) + weight = ${distances[v]} + ${weight} = ${distances[v] + weight}.`,
          distances: { ...distances },
        });

        if (distances[v] + weight < distances[u]) {
          distances[u] = distances[v] + weight;
          parent[u] = v;
          relaxedAny = true;

          steps.push({
            verticesState: { [u]: 'visited', [v]: 'visited' },
            edgesState: { [edgeKey]: 'accepted' },
            description: `Relaxed edge! Updated dist(${uLabel}) = ${distances[u]}.`,
            distances: { ...distances },
          });
        }
      }
    }

    if (!relaxedAny) {
      steps.push({
        verticesState: {},
        edgesState: {},
        description: `Pass ${round}: No distances updated. Graph has stabilized.`,
        distances: { ...distances },
      });
      break;
    }
  }

  // Pass V: Negative cycle detection
  let hasNegativeCycle = false;
  for (const edge of edges) {
    const u = edge.from;
    const v = edge.to;
    const weight = Number(edge.weight || 1);
    const edgeKey = getEdgeKey(u, v, isDirected);

    if (distances[u] !== Infinity && distances[u] + weight < distances[v]) {
      hasNegativeCycle = true;
      steps.push({
        verticesState: { [u]: 'visiting', [v]: 'visiting' },
        edgesState: { [edgeKey]: 'rejected' },
        description: `Negative cycle detected at edge (${vertices.find(vertex => vertex.id === u)?.label} → ${vertices.find(vertex => vertex.id === v)?.label})! Distance can decrease infinitely.`,
        distances: { ...distances },
      });
      break;
    }

    if (!isDirected && distances[v] !== Infinity && distances[v] + weight < distances[u]) {
      hasNegativeCycle = true;
      steps.push({
        verticesState: { [u]: 'visiting', [v]: 'visiting' },
        edgesState: { [edgeKey]: 'rejected' },
        description: `Negative cycle detected at edge (${vertices.find(vertex => vertex.id === v)?.label} → ${vertices.find(vertex => vertex.id === u)?.label})!`,
        distances: { ...distances },
      });
      break;
    }
  }

  if (!hasNegativeCycle && targetId !== null && distances[targetId] !== Infinity) {
    const pathNodes = [];
    let curr = targetId;
    while (curr !== undefined) {
      pathNodes.unshift(curr);
      curr = parent[curr];
    }

    const finalEdges = {};
    for (let i = 0; i < pathNodes.length - 1; i++) {
      finalEdges[getEdgeKey(pathNodes[i], pathNodes[i+1], isDirected)] = 'accepted';
    }
    const finalNodes = {};
    pathNodes.forEach(id => { finalNodes[id] = 'visited'; });

    steps.push({
      verticesState: finalNodes,
      edgesState: finalEdges,
      description: `Bellman-Ford completed. Shortest path to target is: ${pathNodes.map(id => vertices.find(v => v.id === id)?.label).join(' → ')} (Cost: ${distances[targetId]})`,
      distances: { ...distances },
      path: pathNodes,
    });
  }

  return steps;
};

// 5. Floyd-Warshall Step Generator (All Pairs Shortest Path)
export const generateFloydWarshall = (vertices, edges, sourceId, targetId, isDirected = false) => {
  const steps = [];
  const V = vertices.length;
  const dist = Array.from({ length: V }, () => Array(V).fill(Infinity));
  const next = Array.from({ length: V }, () => Array(V).fill(null));

  for (let i = 0; i < V; i++) {
    dist[i][i] = 0;
  }

  edges.forEach(edge => {
    const u = edge.from;
    const v = edge.to;
    const w = Number(edge.weight || 1);
    dist[u][v] = w;
    next[u][v] = v;

    if (!isDirected) {
      dist[v][u] = w;
      next[v][u] = u;
    }
  });

  steps.push({
    verticesState: {},
    edgesState: {},
    description: `Initialize Floyd-Warshall distance matrix with direct weights.`,
    matrix: dist.map(row => [...row]),
  });

  for (let k = 0; k < V; k++) {
    const kLabel = vertices.find(vertex => vertex.id === k)?.label || k;

    steps.push({
      verticesState: { [k]: 'visiting' },
      edgesState: {},
      description: `Choose intermediate vertex ${kLabel}. Try updating paths (i → j) using ${kLabel} as a bridge.`,
      matrix: dist.map(row => [...row]),
    });

    for (let i = 0; i < V; i++) {
      for (let j = 0; j < V; j++) {
        if (dist[i][k] !== Infinity && dist[k][j] !== Infinity) {
          const alt = dist[i][k] + dist[k][j];
          if (alt < dist[i][j]) {
            dist[i][j] = alt;
            next[i][j] = next[i][k];

            const iLabel = vertices.find(vertex => vertex.id === i)?.label || i;
            const jLabel = vertices.find(vertex => vertex.id === j)?.label || j;

            steps.push({
              verticesState: { [k]: 'visiting', [i]: 'visited', [j]: 'visited' },
              edgesState: {},
              description: `Relax path through intermediate ${kLabel}: dist(${iLabel} → ${jLabel}) updated to ${alt} (previous: ${dist[i][j] === Infinity ? '∞' : dist[i][j]}).`,
              matrix: dist.map(row => [...row]),
            });
          }
        }
      }
    }
  }

  // Reconstruct path if source and target are selected
  if (sourceId !== null && targetId !== null && dist[sourceId][targetId] !== Infinity) {
    const pathNodes = [sourceId];
    let curr = sourceId;
    while (curr !== targetId) {
      curr = next[curr][targetId];
      if (curr === null) break;
      pathNodes.push(curr);
    }

    const finalEdges = {};
    for (let i = 0; i < pathNodes.length - 1; i++) {
      finalEdges[getEdgeKey(pathNodes[i], pathNodes[i+1], isDirected)] = 'accepted';
    }
    const finalNodes = {};
    pathNodes.forEach(id => { finalNodes[id] = 'visited'; });

    steps.push({
      verticesState: finalNodes,
      edgesState: finalEdges,
      description: `Shortest path Floyd-Warshall: ${pathNodes.map(id => vertices.find(v => v.id === id)?.label).join(' → ')} (Total Cost: ${dist[sourceId][targetId]})`,
      matrix: dist.map(row => [...row]),
      path: pathNodes,
    });
  }

  return steps;
};

// 6. Prim's MST Step Generator (Undirected Only)
export const generatePrim = (vertices, edges) => {
  const steps = [];
  const visited = new Set();
  const mstEdges = [];
  const V = vertices.length;

  if (V === 0) return steps;

  const startNode = vertices[0].id;
  visited.add(startNode);

  steps.push({
    verticesState: { [startNode]: 'visited' },
    edgesState: {},
    description: `Start Prim's MST at vertex ${vertices[0].label}. Add to visited set.`,
  });

  while (visited.size < V) {
    let minEdge = null;
    let minWeight = Infinity;

    // Evaluate all edges cutting from visited nodes to unvisited nodes
    for (const edge of edges) {
      const u = edge.from;
      const v = edge.to;
      const w = Number(edge.weight || 1);

      const uVisited = visited.has(u);
      const vVisited = visited.has(v);

      if ((uVisited && !vVisited) || (!uVisited && vVisited)) {
        if (w < minWeight) {
          minWeight = w;
          minEdge = edge;
        }
      }
    }

    if (!minEdge) {
      // Graph is disconnected
      break;
    }

    const u = minEdge.from;
    const v = minEdge.to;
    const nextNode = visited.has(u) ? v : u;
    const nextLabel = vertices.find(vertex => vertex.id === nextNode)?.label || nextNode;
    const edgeKey = getEdgeKey(u, v, false);

    // Show edge consideration step
    const preVerticesState = {};
    visited.forEach(id => { preVerticesState[id] = 'visited'; });
    preVerticesState[nextNode] = 'visiting';

    steps.push({
      verticesState: { ...preVerticesState },
      edgesState: { [edgeKey]: 'considering' },
      description: `Find minimum cut edge. Edge (${vertices.find(vertex => vertex.id === u)?.label} - ${vertices.find(vertex => vertex.id === v)?.label}) has weight ${minWeight}.`,
    });

    visited.add(nextNode);
    mstEdges.push(minEdge);

    const postVerticesState = {};
    visited.forEach(id => { postVerticesState[id] = 'visited'; });

    const postEdgesState = {};
    mstEdges.forEach(e => { postEdgesState[getEdgeKey(e.from, e.to, false)] = 'accepted'; });

    steps.push({
      verticesState: { ...postVerticesState },
      edgesState: { ...postEdgesState },
      description: `Add node ${nextLabel} and edge to MST. Tree currently contains ${visited.size} vertices.`,
    });
  }

  // Final summary
  const finalEdges = {};
  mstEdges.forEach(e => { finalEdges[getEdgeKey(e.from, e.to, false)] = 'accepted'; });
  const finalVertices = {};
  vertices.forEach(v => { finalVertices[v.id] = 'visited'; });

  steps.push({
    verticesState: finalVertices,
    edgesState: finalEdges,
    description: `Prim's MST complete! Total MST edges = ${mstEdges.length}. Total Weight = ${mstEdges.reduce((sum, e) => sum + Number(e.weight || 0), 0)}.`,
    resultEdges: mstEdges,
  });

  return steps;
};

// 7. Kruskal's MST Step Generator (Undirected Only)
export const generateKruskal = (vertices, edges) => {
  const steps = [];
  const mstEdges = [];

  // Sort edges by weight
  const sortedEdges = [...edges].sort((a, b) => Number(a.weight || 1) - Number(b.weight || 1));

  steps.push({
    verticesState: {},
    edgesState: {},
    description: `Sort all edges by weight: ${sortedEdges.map(e => `${vertices.find(v => v.id === e.from)?.label}-${vertices.find(v => v.id === e.to)?.label} (${e.weight})`).join(', ')}`,
  });

  // DSU structure helper
  const parent = {};
  const find = (i) => {
    if (parent[i] === undefined) return i;
    let curr = i;
    while (parent[curr] !== undefined) {
      curr = parent[curr];
    }
    return curr;
  };
  const union = (i, j) => {
    const rootI = find(i);
    const rootJ = find(j);
    if (rootI !== rootJ) {
      parent[rootI] = rootJ;
      return true;
    }
    return false;
  };

  for (const edge of sortedEdges) {
    const u = edge.from;
    const v = edge.to;
    const edgeKey = getEdgeKey(u, v, false);
    const w = Number(edge.weight || 1);

    const uLabel = vertices.find(vertex => vertex.id === u)?.label || u;
    const vLabel = vertices.find(vertex => vertex.id === v)?.label || v;

    const rootU = find(u);
    const rootV = find(v);

    const currentVertices = {};
    currentVertices[u] = 'visiting';
    currentVertices[v] = 'visiting';

    const currentEdges = {};
    mstEdges.forEach(e => { currentEdges[getEdgeKey(e.from, e.to, false)] = 'accepted'; });
    currentEdges[edgeKey] = 'considering';

    steps.push({
      verticesState: currentVertices,
      edgesState: { ...currentEdges },
      description: `Consider edge (${uLabel} - ${vLabel}) with weight ${w}. Check if they belong to the same component.`,
    });

    if (rootU !== rootV) {
      union(u, v);
      mstEdges.push(edge);

      currentEdges[edgeKey] = 'accepted';
      const postVertices = {};
      postVertices[u] = 'visited';
      postVertices[v] = 'visited';

      steps.push({
        verticesState: postVertices,
        edgesState: { ...currentEdges },
        description: `Components are disjoint. Accept edge into MST.`,
      });
    } else {
      currentEdges[edgeKey] = 'rejected';
      steps.push({
        verticesState: {},
        edgesState: { ...currentEdges },
        description: `Nodes ${uLabel} and ${vLabel} are in the same component. Reject edge to avoid a cycle.`,
      });
    }
  }

  // Final summary
  const finalEdges = {};
  mstEdges.forEach(e => { finalEdges[getEdgeKey(e.from, e.to, false)] = 'accepted'; });
  const finalVertices = {};
  vertices.forEach(v => { finalVertices[v.id] = 'visited'; });

  steps.push({
    verticesState: finalVertices,
    edgesState: finalEdges,
    description: `Kruskal's MST complete! Total Weight = ${mstEdges.reduce((sum, e) => sum + Number(e.weight || 0), 0)}.`,
    resultEdges: mstEdges,
  });

  return steps;
};

// 8. Topological Sort Step Generator (Directed Acyclic Graph)
export const generateTopologicalSort = (vertices, edges) => {
  const steps = [];
  const V = vertices.length;

  // Calculate indegrees
  const indegree = {};
  vertices.forEach(v => { indegree[v.id] = 0; });
  edges.forEach(edge => {
    indegree[edge.to]++;
  });

  steps.push({
    verticesState: {},
    edgesState: {},
    description: `Calculate in-degree for all vertices.`,
    indegrees: { ...indegree },
  });

  const queue = [];
  vertices.forEach(v => {
    if (indegree[v.id] === 0) {
      queue.push(v.id);
    }
  });

  steps.push({
    verticesState: {},
    edgesState: {},
    description: `Find nodes with in-degree = 0: ${queue.map(id => vertices.find(v => v.id === id)?.label).join(', ')}. Push to queue.`,
    indegrees: { ...indegree },
    queue: [...queue],
  });

  const order = [];
  const edgesState = {};

  while (queue.length > 0) {
    const current = queue.shift();
    const currentLabel = vertices.find(v => v.id === current)?.label || current;

    const verticesState = {};
    order.forEach(id => { verticesState[id] = 'visited'; });
    verticesState[current] = 'visiting';

    steps.push({
      verticesState: { ...verticesState },
      edgesState: { ...edgesState },
      description: `Dequeue node ${currentLabel} and add it to topological order.`,
      indegrees: { ...indegree },
      queue: [...queue],
      order: [...order, current],
    });

    order.push(current);

    // Find direct outgoing edges from current
    const outgoing = edges.filter(e => e.from === current);

    for (const edge of outgoing) {
      const neighbor = edge.to;
      const neighborLabel = vertices.find(v => v.id === neighbor)?.label || neighbor;
      const edgeKey = getEdgeKey(edge.from, edge.to, true);

      indegree[neighbor]--;
      edgesState[edgeKey] = 'exploring';

      steps.push({
        verticesState: { ...verticesState, [neighbor]: 'visiting' },
        edgesState: { ...edgesState },
        description: `Reduce in-degree of neighbor ${neighborLabel} to ${indegree[neighbor]}.`,
        indegrees: { ...indegree },
        queue: [...queue],
        order: [...order],
      });

      if (indegree[neighbor] === 0) {
        queue.push(neighbor);
        edgesState[edgeKey] = 'accepted';

        steps.push({
          verticesState: { ...verticesState, [neighbor]: 'visited' },
          edgesState: { ...edgesState },
          description: `Neighbor ${neighborLabel} now has in-degree = 0. Push to queue.`,
          indegrees: { ...indegree },
          queue: [...queue],
          order: [...order],
        });
      } else {
        edgesState[edgeKey] = 'rejected';
      }
    }
  }

  const verticesState = {};
  vertices.forEach(v => {
    verticesState[v.id] = order.includes(v.id) ? 'visited' : 'default';
  });

  if (order.length < V) {
    steps.push({
      verticesState,
      edgesState,
      description: `Graph contains a cycle! Topological sort is only possible on Directed Acyclic Graphs (DAGs).`,
      indegrees: { ...indegree },
      queue: [],
      order: [...order],
    });
  } else {
    steps.push({
      verticesState,
      edgesState,
      description: `Topological Sort complete: ${order.map(id => vertices.find(v => v.id === id)?.label).join(' → ')}`,
      indegrees: { ...indegree },
      queue: [],
      order: [...order],
    });
  }

  return steps;
};
