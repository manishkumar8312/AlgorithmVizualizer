import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Eraser } from 'lucide-react';
import { createInitialGrid, resetGrid, SPEED_PRESETS, COLORS } from '../utils/animationHelpers';
import { getNodesInShortestPathOrder } from '../algorithms/pathfinding/dijkstra';

const PathFindingVisualizer = ({ algorithm, algorithmInfo }) => {
  const [grid, setGrid] = useState([]);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawMode, setDrawMode] = useState('wall');
  const [speed, setSpeed] = useState(SPEED_PRESETS.FAST);
  const [startNode, setStartNode] = useState(null);
  const [endNode, setEndNode] = useState(null);

  useEffect(() => {
    const initialGrid = createInitialGrid(20, 50);
    setGrid(initialGrid);
    setStartNode(initialGrid[10][5]);
    setEndNode(initialGrid[10][44]);
  }, []);

  const resetVisualization = () => {
    if (!isVisualizing) {
      const newGrid = resetGrid(grid);
      setGrid(newGrid);
    }
  };

  const clearWalls = () => {
    if (!isVisualizing) {
      const newGrid = grid.map(row =>
        row.map(node => ({ ...node, isWall: false }))
      );
      setGrid(resetGrid(newGrid));
    }
  };

  const handleMouseDown = (row, col) => {
    if (isVisualizing) return;
    const node = grid[row][col];
    
    if (node.isStart || node.isEnd) return;
    
    setIsDrawing(true);
    toggleWall(row, col);
  };

  const handleMouseEnter = (row, col) => {
    if (!isDrawing || isVisualizing) return;
    const node = grid[row][col];
    
    if (node.isStart || node.isEnd) return;
    
    toggleWall(row, col);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const toggleWall = (row, col) => {
    const newGrid = grid.map(r =>
      r.map(node => {
        if (node.row === row && node.col === col) {
          return { ...node, isWall: !node.isWall };
        }
        return node;
      })
    );
    setGrid(newGrid);
  };

  const visualize = async () => {
    if (isVisualizing || !startNode || !endNode) return;
    
    setIsVisualizing(true);
    const newGrid = resetGrid(grid);
    setGrid(newGrid);

    const startNodeInGrid = newGrid[startNode.row][startNode.col];
    const endNodeInGrid = newGrid[endNode.row][endNode.col];

    const visitedNodesInOrder = await algorithm(
      newGrid,
      startNodeInGrid,
      endNodeInGrid,
      setGrid,
      speed
    );

    if (visitedNodesInOrder) {
      const nodesInShortestPath = getNodesInShortestPathOrder(endNodeInGrid);
      await animateShortestPath(nodesInShortestPath);
    }

    setIsVisualizing(false);
  };

  const animateShortestPath = async (nodesInShortestPath) => {
    for (let i = 0; i < nodesInShortestPath.length; i++) {
      await new Promise(resolve => setTimeout(resolve, speed));
      const node = nodesInShortestPath[i];
      
      setGrid(prevGrid =>
        prevGrid.map(row =>
          row.map(n =>
            n.row === node.row && n.col === node.col
              ? { ...n, isPath: true }
              : n
          )
        )
      );
    }
  };

  const getNodeClass = (node) => {
    if (node.isStart) return 'bg-green-500';
    if (node.isEnd) return 'bg-red-500';
    if (node.isWall) return 'bg-gray-800';
    if (node.isPath) return 'bg-yellow-400';
    if (node.isVisited) return 'bg-cyan-400';
    return 'bg-gray-700';
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Algorithm Info */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-6 rounded-t-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-2">{algorithmInfo.name}</h2>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="bg-white/20 px-3 py-1 rounded-full">
            <span className="font-semibold">Time:</span> {algorithmInfo.timeComplexity}
          </div>
          <div className="bg-white/20 px-3 py-1 rounded-full">
            <span className="font-semibold">Space:</span> {algorithmInfo.spaceComplexity}
          </div>
        </div>
        <p className="mt-3 text-sm opacity-90">{algorithmInfo.description}</p>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 p-4 flex flex-wrap items-center gap-3">
        <button
          onClick={visualize}
          disabled={isVisualizing}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold transition-colors"
        >
          <Play size={18} />
          Visualize
        </button>

        <button
          onClick={resetVisualization}
          disabled={isVisualizing}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold transition-colors"
        >
          <RotateCcw size={18} />
          Reset
        </button>

        <button
          onClick={clearWalls}
          disabled={isVisualizing}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold transition-colors"
        >
          <Eraser size={18} />
          Clear Walls
        </button>

        <div className="ml-auto text-white text-sm">
          <span className="font-semibold">Draw walls by clicking and dragging</span>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 bg-gray-900 p-4 flex items-center justify-center overflow-auto">
        <div className="inline-block">
          {grid.map((row, rowIdx) => (
            <div key={rowIdx} className="flex">
              {row.map((node, nodeIdx) => (
                <div
                  key={nodeIdx}
                  className={`w-6 h-6 border border-gray-800 cursor-pointer transition-colors ${getNodeClass(node)}`}
                  onMouseDown={() => handleMouseDown(node.row, node.col)}
                  onMouseEnter={() => handleMouseEnter(node.row, node.col)}
                  onMouseUp={handleMouseUp}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-gray-800 p-3 flex flex-wrap gap-4 justify-center text-sm rounded-b-lg">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-500"></div>
          <span className="text-white">Start</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500"></div>
          <span className="text-white">End</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-800 border border-gray-600"></div>
          <span className="text-white">Wall</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-cyan-400"></div>
          <span className="text-white">Visited</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-400"></div>
          <span className="text-white">Path</span>
        </div>
      </div>
    </div>
  );
};

export default PathFindingVisualizer;
