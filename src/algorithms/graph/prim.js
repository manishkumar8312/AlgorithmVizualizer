// Prim's Minimum Spanning Tree Algorithm
export async function prim(vertices, edges, updateEdges, updateVertices, speed) {
  const mstEdges = [];
  const visited = new Array(vertices.length).fill(false);
  const minHeap = [];

  // Start from vertex 0
  visited[0] = true;
  updateVertices({ index: 0, status: 'visited' });
  await new Promise(resolve => setTimeout(resolve, speed));

  // Add all edges from starting vertex to heap
  for (const edge of edges) {
    if (edge.from === 0 || edge.to === 0) {
      minHeap.push(edge);
    }
  }

  while (minHeap.length > 0 && mstEdges.length < vertices.length - 1) {
    // Sort heap by weight
    minHeap.sort((a, b) => a.weight - b.weight);
    const edge = minHeap.shift();

    const fromVisited = visited[edge.from];
    const toVisited = visited[edge.to];

    // Skip if both vertices are already visited (creates cycle)
    if (fromVisited && toVisited) {
      updateEdges({ ...edge, status: 'rejected' });
      await new Promise(resolve => setTimeout(resolve, speed));
      continue;
    }

    // Highlight current edge
    updateEdges({ ...edge, status: 'considering' });
    await new Promise(resolve => setTimeout(resolve, speed));

    // Add edge to MST
    mstEdges.push(edge);
    updateEdges({ ...edge, status: 'accepted' });

    // Mark the unvisited vertex as visited
    const nextVertex = fromVisited ? edge.to : edge.from;
    visited[nextVertex] = true;
    updateVertices({ index: nextVertex, status: 'visited' });
    await new Promise(resolve => setTimeout(resolve, speed));

    // Add all edges from newly visited vertex to heap
    for (const e of edges) {
      if ((e.from === nextVertex && !visited[e.to]) || 
          (e.to === nextVertex && !visited[e.from])) {
        minHeap.push(e);
      }
    }
  }

  return mstEdges;
}

export const primInfo = {
  name: "Prim's Algorithm",
  timeComplexity: "O(E log V)",
  spaceComplexity: "O(V)",
  description: "Prim's algorithm builds a minimum spanning tree by starting from a single vertex and greedily adding the cheapest edge that connects to an unvisited vertex."
};
