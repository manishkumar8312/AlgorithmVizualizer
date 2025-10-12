// Topological Sort using DFS
export async function topologicalSort(vertices, edges, updateVertices, updateEdges, speed) {
  const visited = new Array(vertices.length).fill(false);
  const stack = [];
  const adjList = buildAdjacencyList(vertices.length, edges);

  async function dfsVisit(vertex) {
    visited[vertex] = true;
    updateVertices({ index: vertex, status: 'visiting' });
    await new Promise(resolve => setTimeout(resolve, speed));

    // Visit all adjacent vertices
    if (adjList[vertex]) {
      for (const neighbor of adjList[vertex]) {
        if (!visited[neighbor]) {
          updateEdges({ from: vertex, to: neighbor, status: 'exploring' });
          await new Promise(resolve => setTimeout(resolve, speed));
          
          await dfsVisit(neighbor);
        }
      }
    }

    updateVertices({ index: vertex, status: 'visited' });
    stack.unshift(vertex);
    await new Promise(resolve => setTimeout(resolve, speed));
  }

  // Visit all vertices
  for (let i = 0; i < vertices.length; i++) {
    if (!visited[i]) {
      await dfsVisit(i);
    }
  }

  return stack;
}

function buildAdjacencyList(vertexCount, edges) {
  const adjList = {};
  
  for (let i = 0; i < vertexCount; i++) {
    adjList[i] = [];
  }

  for (const edge of edges) {
    if (!adjList[edge.from]) {
      adjList[edge.from] = [];
    }
    adjList[edge.from].push(edge.to);
  }

  return adjList;
}

// Topological Sort using Kahn's Algorithm (BFS-based)
export async function topologicalSortKahn(vertices, edges, updateVertices, updateEdges, speed) {
  const inDegree = new Array(vertices.length).fill(0);
  const adjList = buildAdjacencyList(vertices.length, edges);
  const result = [];
  const queue = [];

  // Calculate in-degree for each vertex
  for (const edge of edges) {
    inDegree[edge.to]++;
  }

  // Add all vertices with in-degree 0 to queue
  for (let i = 0; i < vertices.length; i++) {
    if (inDegree[i] === 0) {
      queue.push(i);
    }
  }

  while (queue.length > 0) {
    const vertex = queue.shift();
    result.push(vertex);
    
    updateVertices({ index: vertex, status: 'processed' });
    await new Promise(resolve => setTimeout(resolve, speed));

    // Reduce in-degree for all neighbors
    if (adjList[vertex]) {
      for (const neighbor of adjList[vertex]) {
        updateEdges({ from: vertex, to: neighbor, status: 'exploring' });
        await new Promise(resolve => setTimeout(resolve, speed));
        
        inDegree[neighbor]--;
        
        if (inDegree[neighbor] === 0) {
          queue.push(neighbor);
        }
      }
    }
  }

  // Check if there was a cycle
  if (result.length !== vertices.length) {
    return { error: "Graph has a cycle! Topological sort not possible." };
  }

  return result;
}

export const topologicalSortInfo = {
  name: "Topological Sort",
  timeComplexity: "O(V + E)",
  spaceComplexity: "O(V)",
  description: "Topological Sort produces a linear ordering of vertices in a directed acyclic graph (DAG) such that for every directed edge from vertex u to v, u comes before v in the ordering."
};
