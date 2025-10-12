import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SortingVisualizer from '../components/SortingVisualizer';
import { bubbleSort, bubbleSortInfo } from '../algorithms/sorting/bubbleSort';
import { selectionSort, selectionSortInfo } from '../algorithms/sorting/selectionSort';
import { insertionSort, insertionSortInfo } from '../algorithms/sorting/insertionSort';
import { mergeSort, mergeSortInfo } from '../algorithms/sorting/mergeSort';
import { quickSort, quickSortInfo } from '../algorithms/sorting/quickSort';

const SortingPage = () => {
  const algorithms = [
    { name: 'Bubble Sort', algorithm: bubbleSort, info: bubbleSortInfo },
    { name: 'Selection Sort', algorithm: selectionSort, info: selectionSortInfo },
    { name: 'Insertion Sort', algorithm: insertionSort, info: insertionSortInfo },
    { name: 'Merge Sort', algorithm: mergeSort, info: mergeSortInfo },
    { name: 'Quick Sort', algorithm: quickSort, info: quickSortInfo },
  ];

  const [selectedAlgorithm, setSelectedAlgorithm] = useState(algorithms[0]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-semibold">Back to Home</span>
          </Link>
          
          <h1 className="text-2xl font-bold text-white">Sorting Algorithms</h1>
          
          <div className="w-32"></div>
        </div>
      </div>

      {/* Algorithm Selector */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="container mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            {algorithms.map((algo, index) => (
              <button
                key={index}
                onClick={() => setSelectedAlgorithm(algo)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedAlgorithm.name === algo.name
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {algo.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Visualizer */}
      <div className="container mx-auto p-4 h-[calc(100vh-180px)]">
        <div className="bg-gray-800 rounded-lg shadow-2xl h-full overflow-hidden">
          <SortingVisualizer
            algorithm={selectedAlgorithm.algorithm}
            algorithmInfo={selectedAlgorithm.info}
          />
        </div>
      </div>
    </div>
  );
};

export default SortingPage;
