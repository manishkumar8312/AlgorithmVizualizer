import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Scale } from 'lucide-react';
import Navbar from '../components/Navbar';
import SortingVisualizer from '../components/SortingVisualizer';
import ComparisonMode from '../components/educational/ComparisonMode';
import { bubbleSort, bubbleSortInfo } from '../algorithms/sorting/bubbleSort';
import { selectionSort, selectionSortInfo } from '../algorithms/sorting/selectionSort';
import { insertionSort, insertionSortInfo } from '../algorithms/sorting/insertionSort';
import { mergeSort, mergeSortInfo } from '../algorithms/sorting/mergeSort';
import { quickSort, quickSortInfo } from '../algorithms/sorting/quickSort';
import { algorithmDatabase } from '../data/algorithmData';

const SortingPage = () => {
  const algorithms = [
    { name: 'Bubble Sort', algorithm: bubbleSort, info: bubbleSortInfo },
    { name: 'Selection Sort', algorithm: selectionSort, info: selectionSortInfo },
    { name: 'Insertion Sort', algorithm: insertionSort, info: insertionSortInfo },
    { name: 'Merge Sort', algorithm: mergeSort, info: mergeSortInfo },
    { name: 'Quick Sort', algorithm: quickSort, info: quickSortInfo },
  ];

  const [selectedAlgorithm, setSelectedAlgorithm] = useState(algorithms[0]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [compareAlgos, setCompareAlgos] = useState(null);

  const handleCompare = (algo1Name, algo2Name) => {
    const a1 = algorithms.find(a => a.name === algo1Name);
    const a2 = algorithms.find(a => a.name === algo2Name);
    if (a1 && a2) {
      setCompareAlgos([a1, a2]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-sans selection:bg-indigo-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <Link to="/algorithms" className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Categories
          </Link>
          
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Sorting Algorithms</h1>
          
          <button
            onClick={() => { setIsCompareOpen(!isCompareOpen); if (isCompareOpen) setCompareAlgos(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm ${
              isCompareOpen
                ? 'bg-indigo-600 text-white shadow-indigo-200'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <Scale className="w-4 h-4 text-indigo-500" />
            {isCompareOpen ? 'Exit Compare' : 'Compare Mode'}
          </button>
        </div>

        {/* Comparison Selector */}
        {isCompareOpen && (
          <div className="mb-8 rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700">
            <ComparisonMode
              algorithms={algorithms}
              onCompare={handleCompare}
              isOpen={isCompareOpen}
            />
          </div>
        )}

        {/* Algorithm Selector Tabs (Single mode) */}
        {!compareAlgos && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {algorithms.map((algo, index) => {
              const isActive = selectedAlgorithm.name === algo.name;
              return (
                <button
                  key={index}
                  onClick={() => setSelectedAlgorithm(algo)}
                  className={`px-5 py-2.5 rounded-full text-[14px] font-semibold transition-all shadow-sm ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-indigo-200'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600'
                  }`}
                >
                  {algo.name}
                </button>
              );
            })}
          </div>
        )}

        {/* Visualizer Container */}
        {compareAlgos ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[600px] w-full">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-sm overflow-hidden flex flex-col">
              <SortingVisualizer
                algorithm={compareAlgos[0].algorithm}
                algorithmInfo={compareAlgos[0].info}
              />
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-sm overflow-hidden flex flex-col">
              <SortingVisualizer
                algorithm={compareAlgos[1].algorithm}
                algorithmInfo={compareAlgos[1].info}
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 min-h-[600px] w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-sm overflow-hidden flex flex-col">
            <SortingVisualizer
              algorithm={selectedAlgorithm.algorithm}
              algorithmInfo={selectedAlgorithm.info}
            />
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-8 py-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
           <img src="/logo-icon.svg" alt="Algo Visualizer" className="w-6 h-6 select-none" draggable="false" />
             <span className="text-sm font-medium text-slate-500 dark:text-slate-400">© 2025 Algorithm Visualizer.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SortingPage;
