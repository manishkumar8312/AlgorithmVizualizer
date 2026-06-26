import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import TreeRecursionVisualizer from '../components/TreeRecursionVisualizer';
import GridBacktrackingVisualizer from '../components/GridBacktrackingVisualizer';
import TowerOfHanoiVisualizer from '../components/TowerOfHanoiVisualizer';
import { recursionAlgorithmsData } from '../data/recursionAlgorithms';

const RecursionAlgorithms = () => {
  const categories = [
    {
      name: 'Tree Recursion',
      type: 'tree',
      list: [
        { id: 'factorial', ...recursionAlgorithmsData.factorial },
        { id: 'fibonacci', ...recursionAlgorithmsData.fibonacci },
        { id: 'permutations', ...recursionAlgorithmsData.permutations },
        { id: 'combinationSum', ...recursionAlgorithmsData.combinationSum },
        { id: 'generateParentheses', ...recursionAlgorithmsData.generateParentheses },
        { id: 'subsets', ...recursionAlgorithmsData.subsets },
      ]
    },
    {
      name: 'Grid Backtracking',
      type: 'grid',
      list: [
        { id: 'nQueens', ...recursionAlgorithmsData.nQueens },
        { id: 'sudoku', ...recursionAlgorithmsData.sudoku },
        { id: 'ratInMaze', ...recursionAlgorithmsData.ratInMaze },
        { id: 'knightsTour', ...recursionAlgorithmsData.knightsTour },
      ]
    },
    {
      name: 'Classic Puzzles',
      type: 'puzzle',
      list: [
        { id: 'towerOfHanoi', ...recursionAlgorithmsData.towerOfHanoi },
      ]
    }
  ];

  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(categories[0].list[0]);

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
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Recursion & Backtracking</h1>
          <div className="w-[140px] hidden md:block" />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => { setSelectedCategory(cat); setSelectedAlgorithm(cat.list[0]); }}
              className={`px-5 py-2.5 rounded-full text-[14px] font-semibold transition-all shadow-sm ${
                selectedCategory.name === cat.name
                  ? 'bg-violet-600 text-white shadow-violet-200'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-violet-600'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Algorithm Sub-selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {selectedCategory.list.map((algo, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedAlgorithm(algo)}
              className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all ${
                selectedAlgorithm.id === algo.id
                  ? 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 border border-violet-300 dark:border-violet-700 shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-800'
              }`}
            >
              {algo.name}
            </button>
          ))}
        </div>

        {/* Visualizer Container */}
        <div className="flex-1 min-h-[600px] w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-sm overflow-hidden flex flex-col">
          {selectedCategory.type === 'tree' && (
            <TreeRecursionVisualizer algorithmId={selectedAlgorithm.id} />
          )}
          {selectedCategory.type === 'grid' && (
            <GridBacktrackingVisualizer algorithmId={selectedAlgorithm.id} />
          )}
          {selectedCategory.type === 'puzzle' && (
            <TowerOfHanoiVisualizer algorithmId={selectedAlgorithm.id} />
          )}
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

export default RecursionAlgorithms;
