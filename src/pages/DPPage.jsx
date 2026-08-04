import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import DPVisualizer from '../components/DPVisualizer';

const DPPage = () => {
  const [selectedAlgo, setSelectedAlgo] = useState('knapsack');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <Link to="/algorithms" className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Categories
          </Link>

          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Dynamic Programming</h1>

          <div className="w-[140px] hidden md:block" />
        </div>

        {/* Algorithm Tabs */}
        <div className="flex justify-center gap-3 mb-8">
          <button
            onClick={() => setSelectedAlgo('knapsack')}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm ${
              selectedAlgo === 'knapsack'
                ? 'bg-purple-600 text-white shadow-purple-200'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            0/1 Knapsack
          </button>
          <button
            onClick={() => setSelectedAlgo('lcs')}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm ${
              selectedAlgo === 'lcs'
                ? 'bg-purple-600 text-white shadow-purple-200'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            Longest Common Subsequence (LCS)
          </button>
        </div>

        {/* Visualizer Container */}
        <div className="flex-1 min-h-[600px] w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-sm overflow-hidden flex flex-col">
          <DPVisualizer algorithmType={selectedAlgo} />
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

export default DPPage;
