import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
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
        { name: "Kruskal's MST", algorithm: kruskal, info: kruskalInfo, type: 'graph' },
        { name: "Prim's MST", algorithm: prim, info: primInfo, type: 'graph' },
        { name: 'Topological Sort', algorithm: topologicalSort, info: topologicalSortInfo, type: 'graph' },
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
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-white hover:text-purple-400 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-semibold">Back to Home</span>
          </Link>
          
          <h1 className="text-2xl font-bold text-white">Graph & Recursion Algorithms</h1>
          
          <div className="w-32"></div>
        </div>
      </div>

      {/* Algorithm Selector */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="container mx-auto space-y-3">
          {categories.map((category, catIndex) => (
            <div key={catIndex}>
              <h3 className="text-sm font-semibold text-gray-400 mb-2 text-center">
                {category.name}
              </h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {category.algorithms.map((algo, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedAlgorithm(algo)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      selectedAlgorithm.name === algo.name
                        ? category.name.includes('Graph')
                          ? 'bg-purple-600 text-white shadow-lg scale-105'
                          : 'bg-orange-600 text-white shadow-lg scale-105'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
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
      <div className="container mx-auto p-4 h-[calc(100vh-220px)]">
        <div className="bg-gray-800 rounded-lg shadow-2xl h-full overflow-hidden">
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
        </div>
      </div>
    </div>
  );
};

export default GraphPage;
