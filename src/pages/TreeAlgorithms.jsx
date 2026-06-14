import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import GlassCard from '../components/GlassCard';
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
    <div className="min-h-screen page-fade-in">
      {/* Header */}
      <div className="page-header">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gray-300 hover:text-emerald-400 transition-colors duration-300">
            <ArrowLeft size={20} />
            <span className="font-semibold">Back to Home</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Tree Algorithms</h1>
          <div className="w-32" />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-gray-800 p-2 flex flex-wrap gap-2 justify-center">
        {categories.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => { setSelectedCategory(cat); setSelectedAlgorithm(cat.list[0]); }}
            className={selectedCategory.name === cat.name ? 'glass-btn-active' : 'glass-btn'}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Algorithm Selector – hidden for dedicated visualizers */}
      {!selectedCategory.isBST && !selectedCategory.isAVL && !selectedCategory.isHeap && !selectedCategory.isTrie && !selectedCategory.isSegmentTree && selectedCategory.list.length > 0 && (
        <div className="bg-gray-800 p-2 flex flex-wrap gap-2 justify-center mt-2">
          {selectedCategory.list.map((algo, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedAlgorithm(algo)}
              className={selectedAlgorithm.name === algo.name ? 'glass-btn-active' : 'glass-btn'}
            >
              {algo.name}
            </button>
          ))}
        </div>
      )}

      {/* Visualizer – full remaining viewport height */}
      <div className="container mx-auto p-4" style={{ height: 'calc(100vh - 190px)', minHeight: '560px' }}>
        <GlassCard className="h-full" style={{ overflow: 'hidden' }}>
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
              algorithm={selectedAlgorithm.fn}
              algorithmInfo={selectedAlgorithm.info}
            />
          )}
        </GlassCard>
      </div>
    </div>
  );
};

export default TreeAlgorithms;
