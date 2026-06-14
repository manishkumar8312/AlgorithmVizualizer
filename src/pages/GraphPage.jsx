import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import GraphVisualizer from '../components/GraphVisualizer';
import RecursionVisualizer from '../components/RecursionVisualizer';
import { kruskal, kruskalInfo } from '../algorithms/graph/kruskal';
import { prim, primInfo } from '../algorithms/graph/prim';
import { topologicalSort, topologicalSortInfo } from '../algorithms/graph/topologicalSort';
import { towerOfHanoi, towerOfHanoiInfo } from '../algorithms/recursion/towerOfHanoi';
import { solveNQueens, nQueensInfo } from '../algorithms/recursion/nQueens';

const GraphPage = () => {
  const categories = [
    {
      name: 'Graph Algorithms',
      algorithms: [
        { name: 'BFS', type: 'graph', info: { name: 'BFS' } },
        { name: 'DFS', type: 'graph', info: { name: 'DFS' } },
        { name: 'Dijkstra', type: 'graph', info: { name: 'Dijkstra' } },
        { name: 'Bellman-Ford', type: 'graph', info: { name: 'Bellman-Ford' } },
        { name: 'Floyd-Warshall', type: 'graph', info: { name: 'Floyd-Warshall' } },
        { name: "Prim's MST", type: 'graph', info: { name: "Prim's MST" } },
        { name: "Kruskal's MST", type: 'graph', info: { name: "Kruskal's MST" } },
        { name: 'Topological Sort', type: 'graph', info: { name: 'Topological Sort' } },
      ]
    },
    {
      name: 'Recursion & Backtracking',
      algorithms: [
        { name: 'Tower of Hanoi', algorithm: towerOfHanoi, info: towerOfHanoiInfo, type: 'hanoi' },
        { name: 'N-Queens', algorithm: solveNQueens, info: nQueensInfo, type: 'nqueens' },
      ]
    }
  ];

  const allAlgorithms = categories.flatMap(cat => cat.algorithms);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(allAlgorithms[0]);

  return (
    <div className="min-h-screen page-fade-in">
      {/* Header */}
      <div className="page-header">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gray-300 hover:text-purple-400 transition-colors duration-300">
            <ArrowLeft size={20} />
            <span className="font-semibold">Back to Home</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Graph & Recursion Algorithms</h1>
          <div className="w-32"></div>
        </div>
      </div>

      {/* Algorithm Selector */}
      <div className="page-header" style={{ borderTop: 'none' }}>
        <div className="container mx-auto space-y-3">
          {categories.map((category, catIndex) => (
            <div key={catIndex}>
              <h3 className="text-sm font-semibold text-gray-400 mb-2 text-center">
                {category.name}
              </h3>
              <div className="flex flex-wrap gap-3 justify-center">
                {category.algorithms.map((algo, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedAlgorithm(algo)}
                    className={selectedAlgorithm.name === algo.name ? 'glass-btn-active' : 'glass-btn'}
                  >
                    {algo.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visualizer */}
      <div className="container mx-auto p-4 h-[calc(100vh-220px)] min-h-[650px]">
        <GlassCard className="h-full overflow-hidden">
          {selectedAlgorithm.type === 'graph' ? (
            <GraphVisualizer
              algorithm={selectedAlgorithm.algorithm}
              algorithmInfo={selectedAlgorithm.info}
            />
          ) : (
            <RecursionVisualizer
              algorithm={selectedAlgorithm.algorithm}
              algorithmInfo={selectedAlgorithm.info}
              type={selectedAlgorithm.type}
            />
          )}
        </GlassCard>
      </div>
    </div>
  );
};

export default GraphPage;
