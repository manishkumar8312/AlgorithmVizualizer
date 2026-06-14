import React, { useState } from 'react';
import { ArrowRight, Play, BarChart3 } from 'lucide-react';

const ComparisonMode = ({ algorithms, onCompare, isOpen }) => {
  const [algo1, setAlgo1] = useState(algorithms[0]?.name || '');
  const [algo2, setAlgo2] = useState(algorithms[1]?.name || '');

  if (!isOpen) return null;

  const handleCompare = () => {
    if (algo1 && algo2 && algo1 !== algo2) {
      onCompare(algo1, algo2);
    }
  };

  return (
    <div className="bg-gray-800 border-t border-gray-700 p-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="text-purple-400" size={24} />
        <h3 className="text-2xl font-bold text-white">Algorithm Comparison Mode</h3>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="text-white text-sm font-semibold mb-2 block">First Algorithm</label>
          <select
            value={algo1}
            onChange={(e) => setAlgo1(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 outline-none"
          >
            {algorithms.map((algo) => (
              <option key={algo.name} value={algo.name}>
                {algo.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-center">
          <ArrowRight className="text-gray-400" size={24} />
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="text-white text-sm font-semibold mb-2 block">Second Algorithm</label>
          <select
            value={algo2}
            onChange={(e) => setAlgo2(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 outline-none"
          >
            {algorithms.map((algo) => (
              <option key={algo.name} value={algo.name}>
                {algo.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleCompare}
          disabled={!algo1 || !algo2 || algo1 === algo2}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors mt-6"
        >
          <Play size={18} />
          Compare Algorithms
        </button>
      </div>

      {algo1 === algo2 && (
        <p className="text-red-400 text-sm mt-3">Please select two different algorithms to compare.</p>
      )}
    </div>
  );
};

export default ComparisonMode;
