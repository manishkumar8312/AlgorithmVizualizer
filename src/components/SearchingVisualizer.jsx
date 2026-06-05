import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Search, Shuffle } from 'lucide-react';
import { generateSortedArray, SPEED_PRESETS, COLORS } from '../utils/animationHelpers';

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

  useEffect(() => {
    resetArray();
  }, [arraySize]);

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
    if (foundIndex === index) return COLORS.SORTED;
    if (currentIndex === index) return COLORS.COMPARING;
    if (searchRange[0] !== -1 && index >= searchRange[0] && index <= searchRange[1]) {
      return COLORS.VISITED;
    }
    return COLORS.DEFAULT;
  };

  const maxValue = Math.max(...array);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Algorithm Info */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-6 rounded-t-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-2">{algorithmInfo.name}</h2>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="bg-white/20 px-3 py-1 rounded-full">
            <span className="font-semibold">Time:</span> {algorithmInfo.timeComplexity}
          </div>
          <div className="bg-white/20 px-3 py-1 rounded-full">
            <span className="font-semibold">Space:</span> {algorithmInfo.spaceComplexity}
          </div>
        </div>
        <p className="mt-3 text-sm opacity-90">{algorithmInfo.description}</p>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 p-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-white text-sm font-semibold">Target:</label>
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
            disabled={isSearching}
            className="w-20 px-2 py-1 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 outline-none"
          />
        </div>

        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold transition-colors"
        >
          <Search size={18} />
          Search
        </button>

        <button
          onClick={resetArray}
          disabled={isSearching}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold transition-colors"
        >
          <Shuffle size={18} />
          New Array
        </button>

        <div className="ml-auto">
          <label className="text-white text-sm font-semibold mr-2">Array Size:</label>
          <input
            type="range"
            min="10"
            max="50"
            value={arraySize}
            onChange={(e) => setArraySize(Number(e.target.value))}
            disabled={isSearching}
            className="w-32"
          />
          <span className="text-white text-sm ml-2">{arraySize}</span>
        </div>
      </div>

      {/* Search Result */}
      {searchResult && (
        <div className={`p-3 text-center font-semibold ${
          searchResult.found ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {searchResult.found
            ? `Found at index ${searchResult.index} in ${searchResult.time}ms`
            : `Element ${target} not found in ${searchResult.time}ms`}
        </div>
      )}

      {/* Visualization Area */}
      <div className="flex-1 bg-gray-900 p-4 flex items-end justify-center gap-1 overflow-hidden">
        {array.map((value, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1">
            <div
              className="transition-all duration-150"
              style={{
                height: `${(value / maxValue) * 80}%`,
                width: `${Math.max(600 / array.length, 15)}px`,
                backgroundColor: getBarColor(idx),
                minHeight: '20px',
              }}
            />
            <span className="text-white text-xs">{value}</span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="bg-gray-800 p-3 flex flex-wrap gap-4 justify-center text-sm rounded-b-lg">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS.DEFAULT }}></div>
          <span className="text-white">Unsearched</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS.VISITED }}></div>
          <span className="text-white">Search Range</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS.COMPARING }}></div>
          <span className="text-white">Checking</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS.SORTED }}></div>
          <span className="text-white">Found</span>
        </div>
      </div>
    </div>
  );
};

export default SearchingVisualizer;
