import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import TreeRecursionVisualizer from '../components/TreeRecursionVisualizer';
import GridBacktrackingVisualizer from '../components/GridBacktrackingVisualizer';
import TowerOfHanoiVisualizer from '../components/TowerOfHanoiVisualizer';
import { recursionAlgorithmsData } from '../data/recursionAlgorithms';

const RecursionAlgorithms = () => {
  // We will divide the 11 algorithms into logical categories
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
    <div className="min-h-screen page-fade-in flex flex-col">
      {/* Header */}
      <div className="page-header shrink-0">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gray-300 hover:text-violet-400 transition-colors duration-300">
            <ArrowLeft size={20} />
            <span className="font-semibold">Back to Home</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Recursion & Backtracking</h1>
          <div className="w-32" />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-gray-800 p-2 flex flex-wrap gap-2 justify-center shrink-0">
        {categories.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => { setSelectedCategory(cat); setSelectedAlgorithm(cat.list[0]); }}
            className={`px-4 py-1.5 rounded-full font-semibold transition-all duration-300 ${
              selectedCategory.name === cat.name
                ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg scale-105'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Algorithm Selector */}
      <div className="bg-gray-800/80 p-2 flex flex-wrap gap-2 justify-center shrink-0 border-t border-gray-700">
        {selectedCategory.list.map((algo, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedAlgorithm(algo)}
            className={`px-3 py-1 rounded text-sm transition-all duration-300 ${
              selectedAlgorithm.id === algo.id
                ? 'bg-violet-600/80 text-white shadow border border-violet-400'
                : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-gray-200 border border-transparent'
            }`}
          >
            {algo.name}
          </button>
        ))}
      </div>

      {/* Visualizer Container - takes remaining height */}
      <div className="flex-1 p-4 flex flex-col overflow-hidden min-h-[600px]">
        <GlassCard className="flex-1 w-full max-w-7xl mx-auto overflow-hidden flex flex-col shadow-2xl border border-gray-700/50">
          
          {selectedCategory.type === 'tree' && (
            <TreeRecursionVisualizer algorithmId={selectedAlgorithm.id} />
          )}

          {selectedCategory.type === 'grid' && (
            <GridBacktrackingVisualizer algorithmId={selectedAlgorithm.id} />
          )}

          {selectedCategory.type === 'puzzle' && (
            <TowerOfHanoiVisualizer algorithmId={selectedAlgorithm.id} />
          )}

        </GlassCard>
      </div>
    </div>
  );
};

export default RecursionAlgorithms;
