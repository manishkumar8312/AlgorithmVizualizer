import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import GraphVisualizer from '../components/GraphVisualizer';

const GraphPage = () => {
  const algorithms = [
    { name: 'BFS', type: 'graph', info: { name: 'BFS' } },
    { name: 'DFS', type: 'graph', info: { name: 'DFS' } },
    { name: 'Dijkstra', type: 'graph', info: { name: 'Dijkstra' } },
    { name: 'Bellman-Ford', type: 'graph', info: { name: 'Bellman-Ford' } },
    { name: 'Floyd-Warshall', type: 'graph', info: { name: 'Floyd-Warshall' } },
    { name: "Prim's MST", type: 'graph', info: { name: "Prim's MST" } },
    { name: "Kruskal's MST", type: 'graph', info: { name: "Kruskal's MST" } },
    { name: 'Topological Sort', type: 'graph', info: { name: 'Topological Sort' } },
  ];

  const [selectedAlgorithm, setSelectedAlgorithm] = useState(algorithms[0]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <Link to="/algorithms" className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Categories
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Graph Algorithms</h1>
          <div className="w-[140px] hidden md:block" />
        </div>

        {/* Algorithm Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {algorithms.map((algo, index) => {
            const isActive = selectedAlgorithm.name === algo.name;
            return (
              <button
                key={index}
                onClick={() => setSelectedAlgorithm(algo)}
                className={`px-4 py-2.5 rounded-full text-[14px] font-semibold transition-all shadow-sm ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-purple-200'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-purple-600'
                }`}
              >
                {algo.name}
              </button>
            );
          })}
        </div>

        {/* Visualizer Container */}
        <div className="flex-1 min-h-[600px] w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-sm overflow-hidden flex flex-col">
          <GraphVisualizer
            algorithm={selectedAlgorithm.algorithm}
            algorithmInfo={selectedAlgorithm.info}
          />
        </div>
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-8 py-8 mt-auto">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <img src="/logo-icon.svg" alt="Algo Visualizer" className="w-6 h-6 select-none" draggable="false" />
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">© 2025 Algorithm Visualizer.</span>
        </div>
      </footer>
    </div>
  );
};

export default GraphPage;
