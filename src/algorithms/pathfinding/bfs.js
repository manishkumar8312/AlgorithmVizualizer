export async function bfs(grid, startNode, endNode, updateGrid, speed) {
  const visitedNodesInOrder = [];
  const queue = [startNode];
  startNode.isVisited = true;

  while (queue.length > 0) {
    const currentNode = queue.shift();
    
    // Skip walls
    if (currentNode.isWall) continue;

    visitedNodesInOrder.push(currentNode);

    // Visualize the current node
    updateGrid([...grid]);
    await new Promise(resolve => setTimeout(resolve, speed));

    // If we reached the end node, we're done
    if (currentNode === endNode) return visitedNodesInOrder;

    const neighbors = getUnvisitedNeighbors(currentNode, grid);
    for (const neighbor of neighbors) {
      neighbor.isVisited = true;
      neighbor.previousNode = currentNode;
      queue.push(neighbor);
    }
  }

  return visitedNodesInOrder;
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { row, col } = node;
  
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  
  return neighbors.filter(neighbor => !neighbor.isVisited);
}

export function getNodesInShortestPathOrder(endNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = endNode;
  
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  
  return nodesInShortestPathOrder;
}

export const bfsInfo = {
  name: "Breadth-First Search",
  timeComplexity: "O(V + E)",
  spaceComplexity: "O(V)",
  description: "BFS explores all vertices at the present depth before moving to vertices at the next depth level, guaranteeing the shortest path in unweighted graphs."
};
