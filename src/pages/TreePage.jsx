import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import TreeVisualizer from '../components/TreeVisualizer';
import { preOrderTraversal, inOrderTraversal, postOrderTraversal, levelOrderTraversal } from '../algorithms/trees/traversals';
import { algorithmDatabase } from '../data/algorithmData';

const TreePage = () => {
  const algorithms = [
    { name: 'Pre-order Traversal', algorithm: preOrderTraversal, info: algorithmDatabase.trees.preOrder },
    { name: 'In-order Traversal', algorithm: inOrderTraversal, info: algorithmDatabase.trees.inOrder },
    { name: 'Post-order Traversal', algorithm: postOrderTraversal, info: algorithmDatabase.trees.postOrder },
    { name: 'Level-order Traversal', algorithm: levelOrderTraversal, info: algorithmDatabase.trees.levelOrder },
  ];

  const [selectedAlgorithm, setSelectedAlgorithm] = useState(algorithms[0]);

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
          <div className="w-32"></div>
        </div>
      </div>

      {/* Algorithm Selector */}
      <div className="page-header" style={{ borderTop: 'none' }}>
        <div className="container mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {algorithms.map((algo, index) => (
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
      </div>

      {/* Visualizer */}
      <div className="container mx-auto p-4 h-[calc(100vh-180px)]">
        <GlassCard className="h-full overflow-hidden">
          <TreeVisualizer
            algorithm={selectedAlgorithm.algorithm}
            algorithmInfo={selectedAlgorithm.info}
          />
        </GlassCard>
      </div>
    </div>
  );
};

export default TreePage;
