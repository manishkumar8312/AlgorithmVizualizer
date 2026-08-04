export async function astar(grid, startNode, endNode, updateGrid, speed) {
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  startNode.fDistance = heuristic(startNode, endNode);
  
  const openSet = [startNode];

  while (openSet.length) {
    // Sort openSet by fDistance (f = g + h)
    openSet.sort((nodeA, nodeB) => {
      if (nodeA.fDistance === nodeB.fDistance) {
        return heuristic(nodeA, endNode) - heuristic(nodeB, endNode);
      }
      return nodeA.fDistance - nodeB.fDistance;
    });

    const currentNode = openSet.shift();

    // Skip walls
    if (currentNode.isWall) continue;

    // If estimated distance is infinity, trapped
    if (currentNode.distance === Infinity) return visitedNodesInOrder;

    currentNode.isVisited = true;
    visitedNodesInOrder.push(currentNode);

    // Visualize the current node
    updateGrid([...grid]);
    await new Promise(resolve => setTimeout(resolve, speed));

    // Reached destination
    if (currentNode === endNode) return visitedNodesInOrder;

    const neighbors = getUnvisitedNeighbors(currentNode, grid);
    for (const neighbor of neighbors) {
      const tentativeG = currentNode.distance + 1;
      if (tentativeG < neighbor.distance) {
        neighbor.distance = tentativeG;
        neighbor.fDistance = tentativeG + heuristic(neighbor, endNode);
        neighbor.previousNode = currentNode;
        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    }
  }

  return visitedNodesInOrder;
}

function heuristic(nodeA, nodeB) {
  // Manhattan distance heuristic
  return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { row, col } = node;
  
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  
  return neighbors.filter(neighbor => !neighbor.isVisited && !neighbor.isWall);
}

export const astarInfo = {
  name: "A* Search Algorithm",
  timeComplexity: "O(E)",
  spaceComplexity: "O(V)",
  description: "A* Search uses heuristics (like Manhattan distance) to estimate the distance to the goal, making it significantly faster and smarter than Dijkstra for spatial grid pathfinding."
};
