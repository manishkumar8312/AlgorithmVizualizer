import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import TreeVisualizer from '../components/TreeVisualizer';
import BSTVisualizer from '../components/BSTVisualizer';
import AVLVisualizer from '../components/AVLVisualizer';
import HeapVisualizer from '../components/HeapVisualizer';
import TrieVisualizer from '../components/TrieVisualizer';
import SegmentTreeVisualizer from '../components/SegmentTreeVisualizer';
import { preOrderTraversal, inOrderTraversal, postOrderTraversal, levelOrderTraversal } from '../algorithms/trees/traversals';
import { algorithmData } from '../data/treeAlgorithms';

const TreeAlgorithms = () => {
  const categories = [
    { name: 'Traversals', list: [
        { name: 'Pre‑order', fn: preOrderTraversal, info: algorithmData.traversals.preOrder },
        { name: 'In‑order', fn: inOrderTraversal, info: algorithmData.traversals.inOrder },
        { name: 'Post‑order', fn: postOrderTraversal, info: algorithmData.traversals.postOrder },
        { name: 'Level‑order', fn: levelOrderTraversal, info: algorithmData.traversals.levelOrder },
    ]},
    { name: 'BST Operations', isBST: true, list: [] },
    { name: 'AVL Rotations', isAVL: true, list: [] },
    { name: 'Heap Operations', isHeap: true, list: [] },
    { name: 'Trie', isTrie: true, list: [] },
    { name: 'Segment Tree', isSegmentTree: true, list: [] },
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
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Tree Algorithms</h1>
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
                  ? 'bg-teal-600 text-white shadow-teal-200'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-teal-600'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Algorithm Sub-selector – only for categories with algo list */}
        {!selectedCategory.isBST && !selectedCategory.isAVL && !selectedCategory.isHeap && !selectedCategory.isTrie && !selectedCategory.isSegmentTree && selectedCategory.list.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {selectedCategory.list.map((algo, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedAlgorithm(algo)}
                className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all ${
                  selectedAlgorithm?.name === algo.name
                    ? 'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 border border-teal-300 dark:border-teal-700 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-800'
                }`}
              >
                {algo.name}
              </button>
            ))}
          </div>
        )}

        {/* Visualizer Container */}
        <div className="flex-1 min-h-[600px] w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-sm overflow-hidden flex flex-col">
          {selectedCategory.isBST ? (
            <BSTVisualizer />
          ) : selectedCategory.isAVL ? (
            <AVLVisualizer />
          ) : selectedCategory.isHeap ? (
            <HeapVisualizer />
          ) : selectedCategory.isTrie ? (
            <TrieVisualizer />
          ) : selectedCategory.isSegmentTree ? (
            <SegmentTreeVisualizer />
          ) : (
            <TreeVisualizer
              algorithm={selectedAlgorithm?.fn}
              algorithmInfo={selectedAlgorithm?.info}
            />
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

export default TreeAlgorithms;
