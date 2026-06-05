// Kruskal's Minimum Spanning Tree Algorithm
export async function kruskal(vertices, edges, updateEdges, updateVertices, speed) {
  const mstEdges = [];
  const parent = new Array(vertices.length).fill(0).map((_, i) => i);
  const rank = new Array(vertices.length).fill(0);

  // Sort edges by weight
  const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);

  function find(x) {
    if (parent[x] !== x) {
      parent[x] = find(parent[x]);
    }
    return parent[x];
  }

  function union(x, y) {
    const rootX = find(x);
    const rootY = find(y);

    if (rootX !== rootY) {
      if (rank[rootX] < rank[rootY]) {
        parent[rootX] = rootY;
      } else if (rank[rootX] > rank[rootY]) {
        parent[rootY] = rootX;
      } else {
        parent[rootY] = rootX;
        rank[rootX]++;
      }
      return true;
    }
    return false;
  }

  for (const edge of sortedEdges) {
    // Highlight current edge being considered
    updateEdges({ ...edge, status: 'considering' });
    await new Promise(resolve => setTimeout(resolve, speed));

    if (union(edge.from, edge.to)) {
      // Edge is part of MST
      mstEdges.push(edge);
      updateEdges({ ...edge, status: 'accepted' });
      await new Promise(resolve => setTimeout(resolve, speed));
    } else {
      // Edge creates a cycle, reject it
      updateEdges({ ...edge, status: 'rejected' });
      await new Promise(resolve => setTimeout(resolve, speed));
    }

    if (mstEdges.length === vertices.length - 1) {
      break;
    }
  }

  return mstEdges;
}

export const kruskalInfo = {
  name: "Kruskal's Algorithm",
  timeComplexity: "O(E log E)",
  spaceComplexity: "O(V)",
  description: "Kruskal's algorithm finds a minimum spanning tree by sorting edges by weight and adding them if they don't create a cycle, using a disjoint-set data structure."
};
