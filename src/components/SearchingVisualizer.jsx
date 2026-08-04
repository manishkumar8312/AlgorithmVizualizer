import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Search, Shuffle, Settings, BookOpen, Code2, FileText } from 'lucide-react';
import { generateSortedArray, SPEED_PRESETS, COLORS } from '../utils/animationHelpers';
import ExplanationPanel from './educational/ExplanationPanel';
import CodeViewer from './educational/CodeViewer';
import CustomTestCases from './educational/CustomTestCases';
import { algorithmDatabase } from '../data/algorithmData';

const SearchingVisualizer = ({ algorithm, algorithmInfo }) => {
  const [array, setArray] = useState([]);
  const [target, setTarget] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [foundIndex, setFoundIndex] = useState(-1);
  const [searchRange, setSearchRange] = useState([-1, -1]);
  const [isSearching, setIsSearching] = useState(false);
  const [arraySize, setArraySize] = useState(30);
  const [speed, setSpeed] = useState(SPEED_PRESETS.MEDIUM);
  const [searchResult, setSearchResult] = useState(null);

  const [showExplanation, setShowExplanation] = useState(false);
  const [showCodeViewer, setShowCodeViewer] = useState(false);
  const [showCustomTest, setShowCustomTest] = useState(false);

  useEffect(() => {
    resetArray();
  }, [arraySize, algorithmInfo.name]);

  const resetArray = () => {
    if (!isSearching) {
      const newArray = generateSortedArray(arraySize, 1, 100);
      setArray(newArray);
      setTarget(newArray[Math.floor(Math.random() * newArray.length)]);
      setCurrentIndex(-1);
      setFoundIndex(-1);
      setSearchRange([-1, -1]);
      setSearchResult(null);
    }
  };

  const handleSearch = async () => {
    if (isSearching) return;
    
    setIsSearching(true);
    setCurrentIndex(-1);
    setFoundIndex(-1);
    setSearchRange([-1, -1]);
    setSearchResult(null);

    const startTime = Date.now();
    const result = await algorithm(
      array,
      target,
      setCurrentIndex,
      setFoundIndex,
      setSearchRange,
      speed
    );
    const endTime = Date.now();

    setSearchResult({
      found: result !== -1,
      index: result,
      time: endTime - startTime,
    });

    setIsSearching(false);
  };

  const getBarColor = (index) => {
    if (foundIndex === index) return '#10b981'; // emerald-500
    if (currentIndex === index) return '#f43f5e'; // rose-500
    if (searchRange[0] !== -1 && index >= searchRange[0] && index <= searchRange[1]) {
      return '#34d399'; // emerald-400
    }
    return '#a7f3d0'; // emerald-200 (using a light green base)
  };

  const maxValue = Math.max(...array);

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-slate-900 rounded-3xl overflow-hidden">
      {/* Algorithm Info Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-6 py-5">
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
          {algorithmInfo.name}
        </h2>
        <div className="flex flex-wrap gap-3 text-xs mb-3">
          <div className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md font-medium border border-emerald-100">
            <span className="font-bold opacity-75 mr-1">Time:</span> {algorithmInfo.timeComplexity}
          </div>
          <div className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md font-medium border border-emerald-100">
            <span className="font-bold opacity-75 mr-1">Space:</span> {algorithmInfo.spaceComplexity}
          </div>
        </div>
        <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-4xl">
          {algorithmInfo.description}
        </p>
      </div>

      {/* Action Controls Bar */}
      <div className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-slate-700 dark:text-slate-200 text-sm font-semibold">Target:</label>
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
            disabled={isSearching}
            className="w-20 px-2.5 py-2 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm font-medium shadow-sm transition-all"
          />
        </div>

        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm shadow-emerald-600/20 ml-2"
        >
          <Search className="w-4 h-4 ml-0.5" />
          {isSearching ? 'Searching...' : 'Search'}
        </button>

        <button
          onClick={resetArray}
          disabled={isSearching}
          className="flex items-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Shuffle className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          New Array
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

        {/* Educational Tools */}
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
            showExplanation ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white border border-transparent'
          }`}
        >
          <BookOpen className="w-4 h-4 opacity-80" />
          Info
        </button>

        <button
          onClick={() => setShowCodeViewer(!showCodeViewer)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
            showCodeViewer ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white border border-transparent'
          }`}
        >
          <Code2 className="w-4 h-4 opacity-80" />
          Code
        </button>

        <button
          onClick={() => setShowCustomTest(!showCustomTest)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
            showCustomTest ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white border border-transparent'
          }`}
        >
          <FileText className="w-4 h-4 opacity-80" />
          Test
        </button>

        <div className="ml-auto flex items-center gap-3 text-slate-700 dark:text-slate-200 text-[13px] font-medium">
          <div className="flex flex-col mr-2">
            <label className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">Array Size</label>
            <input
              type="range"
              min="10"
              max="50"
              value={arraySize}
              onChange={(e) => setArraySize(Number(e.target.value))}
              disabled={isSearching}
              className="w-32 accent-emerald-600 cursor-pointer"
            />
          </div>
          <span className="text-slate-900 dark:text-white font-bold bg-white dark:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 shadow-sm text-center min-w-[2.5rem]">
            {arraySize}
          </span>
        </div>
      </div>

      {/* Search Result */}
      {searchResult && (
        <div className={`px-6 py-3 text-[13px] font-semibold border-b ${
          searchResult.found 
            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
            : 'bg-rose-50 text-rose-700 border-rose-100'
        }`}>
          {searchResult.found
            ? `Found at index ${searchResult.index} in ${searchResult.time}ms`
            : `Element ${target} not found in ${searchResult.time}ms`}
        </div>
      )}

      {/* Visualization Area */}
      <div className="flex-1 bg-white dark:bg-slate-900 p-6 flex items-end justify-center gap-[4px] overflow-hidden">
        {array.map((value, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end">
            <div
              className="rounded-t-md transition-all duration-150 border border-black/5 shadow-sm"
              style={{
                height: `${(value / maxValue) * 80}%`,
                width: `${Math.max(800 / array.length, 16)}px`,
                backgroundColor: getBarColor(idx),
                minHeight: '24px',
              }}
            />
            <span className="text-slate-600 dark:text-slate-400 text-[11px] font-bold">{value}</span>
          </div>
        ))}
      </div>

      {/* Legend Footer */}
      <div className="bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-6 py-4 flex flex-wrap gap-6 justify-center text-[12px] font-medium text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-sm bg-[#a7f3d0]"></div>
          <span>Unsearched</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-sm bg-[#34d399]"></div>
          <span>Search Range</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-sm bg-[#f43f5e]"></div>
          <span>Checking</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-sm bg-[#10b981]"></div>
          <span>Found</span>
        </div>
      </div>

      {/* Educational Modals/Overlays */}
      <ExplanationPanel
        algorithmInfo={algorithmDatabase.searching[algorithmInfo.name === 'Binary Search' ? 'binarySearch' : 'linearSearch'] || algorithmInfo}
        isOpen={showExplanation}
        onClose={() => setShowExplanation(false)}
      />

      {showCodeViewer && (
        <div className="fixed bottom-0 right-0 h-3/4 w-[500px] bg-white dark:bg-slate-900 border-t border-l border-slate-200 dark:border-slate-700 z-50 shadow-2xl rounded-tl-2xl overflow-hidden">
          <CodeViewer
            codeSnippets={algorithmDatabase.searching[algorithmInfo.name === 'Binary Search' ? 'binarySearch' : 'linearSearch']?.codeSnippets}
            isOpen={showCodeViewer}
            onClose={() => setShowCodeViewer(false)}
          />
        </div>
      )}

      {showCustomTest && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 z-40 max-h-96 overflow-y-auto shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
          <CustomTestCases
            onApplyTest={(customArr) => {
              const sorted = [...customArr].sort((a, b) => a - b);
              setArray(sorted);
              if (!sorted.includes(target)) setTarget(sorted[0] || 0);
              setShowCustomTest(false);
            }}
            isOpen={showCustomTest}
            onClose={() => setShowCustomTest(false)}
          />
        </div>
      )}
    </div>
  );
};

export default SearchingVisualizer;
