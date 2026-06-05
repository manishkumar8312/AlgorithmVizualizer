import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Eraser, Zap } from 'lucide-react';
import { createInitialGrid, resetGrid, SPEED_PRESETS } from '../utils/animationHelpers';
import { getNodesInShortestPathOrder } from '../algorithms/pathfinding/dijkstra';

// ─── Synchronous algorithm runners (no delays) ────────────────────────────────

function runDijkstraSync(grid, startNode, endNode) {
  const visited = [];
  startNode.distance = 0;
  const unvisited = getAllNodes(grid);
  while (unvisited.length) {
    unvisited.sort((a, b) => a.distance - b.distance);
    const closest = unvisited.shift();
    if (closest.isWall) continue;
    if (closest.distance === Infinity) return visited;
    closest.isVisited = true;
    visited.push(closest);
    if (closest === endNode) return visited;
    for (const nb of getNeighbors(closest, grid)) {
      nb.distance = closest.distance + 1;
      nb.previousNode = closest;
    }
  }
  return visited;
}

function runBfsSync(grid, startNode, endNode) {
  const visited = [];
  const queue = [startNode];
  startNode.isVisited = true;
  while (queue.length) {
    const cur = queue.shift();
    if (cur.isWall) continue;
    visited.push(cur);
    if (cur === endNode) return visited;
    for (const nb of getNeighbors(cur, grid)) {
      nb.isVisited = true;
      nb.previousNode = cur;
      queue.push(nb);
    }
  }
  return visited;
}

function runDfsSync(grid, startNode, endNode) {
  const visited = [];
  const stack = [startNode];
  startNode.isVisited = true;
  while (stack.length) {
    const cur = stack.pop();
    if (cur.isWall) continue;
    visited.push(cur);
    if (cur === endNode) return visited;
    for (const nb of getNeighbors(cur, grid)) {
      nb.isVisited = true;
      nb.previousNode = cur;
      stack.push(nb);
    }
  }
  return visited;
}

function getAllNodes(grid) {
  return grid.flatMap(row => row);
}

function getNeighbors(node, grid) {
  const { row, col } = node;
  const nbs = [];
  if (row > 0) nbs.push(grid[row - 1][col]);
  if (row < grid.length - 1) nbs.push(grid[row + 1][col]);
  if (col > 0) nbs.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) nbs.push(grid[row][col + 1]);
  return nbs.filter(n => !n.isVisited && !n.isWall);
}

function deepCloneGrid(grid) {
  return grid.map(row =>
    row.map(node => ({ ...node, isVisited: false, isPath: false, distance: Infinity, previousNode: null }))
  );
}

function computeInstant(algorithmKey, grid, startRow, startCol, endRow, endCol) {
  const g = deepCloneGrid(grid);
  const s = g[startRow][startCol];
  const e = g[endRow][endCol];
  s.isStart = true; e.isEnd = true;
  let runner;
  if (algorithmKey === 'bfs') runner = runBfsSync;
  else if (algorithmKey === 'dfs') runner = runDfsSync;
  else runner = runDijkstraSync;
  runner(g, s, e);
  // Mark path
  let cur = e;
  while (cur && cur.previousNode) {
    cur.isPath = true;
    cur = cur.previousNode;
  }
  if (s) s.isPath = true;
  return g;
}

// ─── Component ────────────────────────────────────────────────────────────────

const ROWS = 20;
const COLS = 48;

const PathFindingVisualizer = ({ algorithm, algorithmInfo }) => {
  const [grid, setGrid] = useState([]);
  const [startPos, setStartPos] = useState({ row: 10, col: 4 });
  const [endPos, setEndPos] = useState({ row: 10, col: 43 });
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDragging, setIsDragging] = useState(null); // 'start' | 'end' | null
  const [liveMode, setLiveMode] = useState(false);
  const [speed, setSpeed] = useState(SPEED_PRESETS.FAST);
  const [stats, setStats] = useState(null);
  const animationRef = useRef(null);
  const algorithmKey = algorithmInfo?.name?.toLowerCase().includes('bfs') ? 'bfs'
    : algorithmInfo?.name?.toLowerCase().includes('dfs') ? 'dfs' : 'dijkstra';

  // Build fresh base grid (walls only, no path/visited)
  const buildBaseGrid = useCallback(() => {
    const initial = createInitialGrid(ROWS, COLS);
    initial[startPos.row][startPos.col].isStart = true;
    initial[endPos.row][endPos.col].isEnd = true;
    return initial;
  }, [startPos, endPos]);

  useEffect(() => {
    const g = buildBaseGrid();
    setGrid(g);
    setStats(null);
  }, []);

  // Live-mode: re-run instantly whenever positions change
  useEffect(() => {
    if (!liveMode || isVisualizing || grid.length === 0) return;
    const computed = computeInstant(
      algorithmKey, grid, startPos.row, startPos.col, endPos.row, endPos.col
    );
    setGrid(computed);
  }, [liveMode, startPos, endPos, algorithmKey]);

  // ── Reset
  const handleReset = () => {
    if (isVisualizing) return;
    if (animationRef.current) clearTimeout(animationRef.current);
    const g = grid.map(row =>
      row.map(node => ({ ...node, isVisited: false, isPath: false, distance: Infinity, previousNode: null }))
    );
    setGrid(g);
    setStats(null);
  };

  const handleClearWalls = () => {
    if (isVisualizing) return;
    const g = grid.map(row =>
      row.map(node => ({ ...node, isWall: false, isVisited: false, isPath: false, distance: Infinity, previousNode: null }))
    );
    setGrid(g);
    setStats(null);
  };

  // ── Animated visualize
  const visualize = async () => {
    if (isVisualizing) return;
    setIsVisualizing(true);
    setStats(null);

    // Reset visited/path
    const baseGrid = grid.map(row =>
      row.map(node => ({ ...node, isVisited: false, isPath: false, distance: Infinity, previousNode: null }))
    );
    const sNode = baseGrid[startPos.row][startPos.col];
    const eNode = baseGrid[endPos.row][endPos.col];
    sNode.isStart = true; eNode.isEnd = true;

    // Choose runner
    let runner;
    if (algorithmKey === 'bfs') runner = runBfsSync;
    else if (algorithmKey === 'dfs') runner = runDfsSync;
    else runner = runDijkstraSync;

    // Compute all at once
    runner(baseGrid, sNode, eNode);

    // Collect visited order (re-run for order tracking)
    const gForAnim = grid.map(row =>
      row.map(node => ({ ...node, isVisited: false, isPath: false, distance: Infinity, previousNode: null }))
    );
    const s2 = gForAnim[startPos.row][startPos.col];
    const e2 = gForAnim[endPos.row][endPos.col];
    s2.isStart = true; e2.isEnd = true;

    const visitedOrder = [];
    // Collect with wrapper
    if (algorithmKey === 'dijkstra') {
      s2.distance = 0;
      const unvisited = getAllNodes(gForAnim);
      while (unvisited.length) {
        unvisited.sort((a, b) => a.distance - b.distance);
        const closest = unvisited.shift();
        if (closest.isWall) continue;
        if (closest.distance === Infinity) break;
        closest.isVisited = true;
        visitedOrder.push(closest);
        if (closest === e2) break;
        for (const nb of getNeighbors(closest, gForAnim)) {
          nb.distance = closest.distance + 1;
          nb.previousNode = closest;
        }
      }
    } else if (algorithmKey === 'bfs') {
      const q = [s2]; s2.isVisited = true;
      while (q.length) {
        const cur = q.shift();
        if (cur.isWall) continue;
        visitedOrder.push(cur);
        if (cur === e2) break;
        for (const nb of getNeighbors(cur, gForAnim)) {
          nb.isVisited = true; nb.previousNode = cur; q.push(nb);
        }
      }
    } else {
      const stk = [s2]; s2.isVisited = true;
      while (stk.length) {
        const cur = stk.pop();
        if (cur.isWall) continue;
        visitedOrder.push(cur);
        if (cur === e2) break;
        for (const nb of getNeighbors(cur, gForAnim)) {
          nb.isVisited = true; nb.previousNode = cur; stk.push(nb);
        }
      }
    }

    // Animate visited nodes
    setGrid(gForAnim.map(row => row.map(n => ({ ...n, isVisited: false, isPath: false }))));
    await new Promise(resolve => {
      let i = 0;
      const step = () => {
        if (i >= visitedOrder.length) { resolve(); return; }
        const node = visitedOrder[i++];
        setGrid(prev => prev.map(row =>
          row.map(n => n.row === node.row && n.col === node.col ? { ...n, isVisited: true } : n)
        ));
        animationRef.current = setTimeout(step, speed);
      };
      step();
    });

    // Animate path
    let pathLen = 0;
    let cur = e2;
    const pathNodes = [];
    while (cur && cur.previousNode) { pathNodes.unshift(cur); cur = cur.previousNode; }
    if (s2) pathNodes.unshift(s2);
    pathLen = pathNodes.length;

    await new Promise(resolve => {
      let i = 0;
      const step = () => {
        if (i >= pathNodes.length) { resolve(); return; }
        const node = pathNodes[i++];
        setGrid(prev => prev.map(row =>
          row.map(n => n.row === node.row && n.col === node.col ? { ...n, isPath: true } : n)
        ));
        animationRef.current = setTimeout(step, speed * 2);
      };
      step();
    });

    setStats({ visited: visitedOrder.length, path: pathLen });
    setIsVisualizing(false);
  };

  // ── Mouse handlers
  const handleMouseDown = (row, col) => {
    if (isVisualizing) return;
    if (row === startPos.row && col === startPos.col) { setIsDragging('start'); return; }
    if (row === endPos.row && col === endPos.col) { setIsDragging('end'); return; }
    setIsDrawing(true);
    toggleWall(row, col);
  };

  const handleMouseEnter = (row, col) => {
    if (isVisualizing) return;
    if (isDragging === 'start') {
      if (row === endPos.row && col === endPos.col) return;
      const newStart = { row, col };
      setStartPos(newStart);
      // Update grid immediately
      setGrid(prev => {
        const g = prev.map(r => r.map(n => ({ ...n, isStart: false })));
        g[row][col] = { ...g[row][col], isStart: true, isWall: false, isVisited: false, isPath: false };
        if (liveMode) {
          const computed = computeInstant(algorithmKey, g, row, col, endPos.row, endPos.col);
          return computed;
        }
        return g.map(r => r.map(n => ({ ...n, isVisited: false, isPath: false, distance: Infinity, previousNode: null })));
      });
      return;
    }
    if (isDragging === 'end') {
      if (row === startPos.row && col === startPos.col) return;
      const newEnd = { row, col };
      setEndPos(newEnd);
      setGrid(prev => {
        const g = prev.map(r => r.map(n => ({ ...n, isEnd: false })));
        g[row][col] = { ...g[row][col], isEnd: true, isWall: false, isVisited: false, isPath: false };
        if (liveMode) {
          const computed = computeInstant(algorithmKey, g, startPos.row, startPos.col, row, col);
          return computed;
        }
        return g.map(r => r.map(n => ({ ...n, isVisited: false, isPath: false, distance: Infinity, previousNode: null })));
      });
      return;
    }
    if (!isDrawing) return;
    if (row === startPos.row && col === startPos.col) return;
    if (row === endPos.row && col === endPos.col) return;
    toggleWall(row, col);
  };

  const handleMouseUp = () => {
    setIsDragging(null);
    setIsDrawing(false);
  };

  const toggleWall = (row, col) => {
    setGrid(prev =>
      prev.map(r =>
        r.map(n => {
          if (n.row === row && n.col === col) {
            return { ...n, isWall: !n.isWall, isVisited: false, isPath: false };
          }
          return { ...n, isVisited: false, isPath: false };
        })
      )
    );
    setStats(null);
  };

  // ── Cell appearance
  const getCellStyle = (node) => {
    if (node.isStart) return 'bg-emerald-400 shadow-[0_0_12px_2px_rgba(52,211,153,0.7)] z-10 scale-110';
    if (node.isEnd) return 'bg-rose-500 shadow-[0_0_12px_2px_rgba(244,63,94,0.7)] z-10 scale-110';
    if (node.isWall) return 'bg-slate-950 border-slate-700 wall-cell';
    if (node.isPath) return 'path-cell bg-yellow-300';
    if (node.isVisited) return 'visited-cell bg-cyan-500';
    return 'bg-gray-700 hover:bg-gray-600';
  };

  const getCursor = (node) => {
    if (node.isStart || node.isEnd) return 'cursor-grab active:cursor-grabbing';
    return 'cursor-crosshair';
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white p-5 rounded-t-lg shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">{algorithmInfo.name}</h2>
            <div className="flex flex-wrap gap-3 text-sm mb-2">
              <div className="bg-white/20 px-3 py-1 rounded-full">
                <span className="font-semibold">Time:</span> {algorithmInfo.timeComplexity}
              </div>
              <div className="bg-white/20 px-3 py-1 rounded-full">
                <span className="font-semibold">Space:</span> {algorithmInfo.spaceComplexity}
              </div>
              {stats && (
                <>
                  <div className="bg-cyan-400/30 px-3 py-1 rounded-full">
                    <span className="font-semibold">Visited:</span> {stats.visited} nodes
                  </div>
                  <div className="bg-yellow-400/30 px-3 py-1 rounded-full">
                    <span className="font-semibold">Path:</span> {stats.path} steps
                  </div>
                </>
              )}
            </div>
            <p className="text-xs opacity-80">{algorithmInfo.description}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 px-4 py-3 flex flex-wrap items-center gap-2 border-b border-gray-700">
        <button
          onClick={visualize}
          disabled={isVisualizing}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-400 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold transition-all shadow"
        >
          <Play size={16} /> Visualize
        </button>

        <button
          onClick={handleReset}
          disabled={isVisualizing}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-400 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold transition-all shadow"
        >
          <RotateCcw size={16} /> Reset
        </button>

        <button
          onClick={handleClearWalls}
          disabled={isVisualizing}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-400 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold transition-all shadow"
        >
          <Eraser size={16} /> Clear Walls
        </button>

        {/* Live mode toggle */}
        <button
          onClick={() => setLiveMode(v => !v)}
          disabled={isVisualizing}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all shadow border-2 ${
            liveMode
              ? 'bg-yellow-400 text-gray-900 border-yellow-300'
              : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
          }`}
        >
          <Zap size={16} />
          {liveMode ? 'Live ON' : 'Live OFF'}
        </button>

        {/* Speed */}
        <div className="flex items-center gap-2 ml-2">
          <span className="text-gray-400 text-xs font-semibold">SPEED</span>
          {[['Slow', 100], ['Med', 30], ['Fast', 8]].map(([label, val]) => (
            <button
              key={label}
              onClick={() => setSpeed(val)}
              disabled={isVisualizing}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                speed === val ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="ml-auto text-gray-400 text-xs text-right hidden sm:block">
          <span className="text-emerald-400 font-bold">●</span> drag start &nbsp;
          <span className="text-rose-400 font-bold">●</span> drag end &nbsp;
          <span className="text-gray-300 font-bold">□</span> click/drag = wall &nbsp;
          <span className="text-yellow-400 font-bold">⚡</span> Live = instant path
        </div>
      </div>

      {/* Grid */}
      <div
        className="flex-1 bg-gray-900 flex items-center justify-center overflow-auto select-none p-2"
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="inline-block rounded-md overflow-hidden border border-gray-700 shadow-2xl">
          {grid.map((row, rIdx) => (
            <div key={rIdx} className="flex">
              {row.map((node, cIdx) => (
                <div
                  key={cIdx}
                  className={`w-5 h-5 border border-gray-800/50 transition-all duration-100 ${getCellStyle(node)} ${getCursor(node)}`}
                  onMouseDown={() => handleMouseDown(node.row, node.col)}
                  onMouseEnter={() => handleMouseEnter(node.row, node.col)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-gray-800 p-3 flex flex-wrap gap-4 justify-center text-xs rounded-b-lg border-t border-gray-700">
        {[
          ['bg-emerald-400', 'Start'],
          ['bg-rose-500', 'End'],
          ['bg-gray-900 border border-gray-600', 'Wall'],
          ['bg-cyan-500', 'Visited'],
          ['bg-yellow-300', 'Shortest Path'],
        ].map(([cls, label]) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`w-4 h-4 rounded-sm ${cls}`} />
            <span className="text-gray-300">{label}</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes visitedPop {
          0%   { transform: scale(0.3); opacity: 0; background-color: #06b6d4; }
          50%  { transform: scale(1.15); background-color: #67e8f9; }
          100% { transform: scale(1);   opacity: 1; background-color: #06b6d4; }
        }
        @keyframes pathPop {
          0%   { transform: scale(0.5); background-color: #fde047; }
          60%  { transform: scale(1.3); background-color: #fef08a; }
          100% { transform: scale(1);   background-color: #fde047; }
        }
        .visited-cell { animation: visitedPop 0.35s ease forwards; }
        .path-cell    { animation: pathPop 0.3s ease forwards; }
      `}</style>
    </div>
  );
};

export default PathFindingVisualizer;
