export async function dijkstra(grid, startNode, endNode, updateGrid, speed) {
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  const unvisitedNodes = getAllNodes(grid);

  while (unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();

    // Skip walls
    if (closestNode.isWall) continue;

    // If the closest node is at infinite distance, we're trapped
    if (closestNode.distance === Infinity) return visitedNodesInOrder;

    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);

    // Visualize the current node
    updateGrid([...grid]);
    await new Promise(resolve => setTimeout(resolve, speed));

    // If we reached the end node, we're done
    if (closestNode === endNode) return visitedNodesInOrder;

    updateUnvisitedNeighbors(closestNode, grid);
  }

  return visitedNodesInOrder;
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function updateUnvisitedNeighbors(node, grid) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    neighbor.distance = node.distance + 1;
    neighbor.previousNode = node;
  }
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

export const dijkstraInfo = {
  name: "Dijkstra's Algorithm",
  timeComplexity: "O(V²) or O(E + V log V)",
  spaceComplexity: "O(V)",
  description: "Dijkstra's algorithm finds the shortest path between nodes in a graph by maintaining a set of unvisited nodes and selecting the one with the minimum distance."
};
