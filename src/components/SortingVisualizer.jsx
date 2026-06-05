import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Shuffle, Settings } from 'lucide-react';
import { generateRandomArray, SPEED_PRESETS, COLORS } from '../utils/animationHelpers';

const SortingVisualizer = ({ algorithm, algorithmInfo }) => {
  const [array, setArray] = useState([]);
  const [comparingIndices, setComparingIndices] = useState([]);
  const [swappingIndices, setSwappingIndices] = useState([]);
  const [sortedIndices, setSortedIndices] = useState([]);
  const [isSorting, setIsSorting] = useState(false);
  const [arraySize, setArraySize] = useState(50);
  const [speed, setSpeed] = useState(SPEED_PRESETS.FAST);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    resetArray();
  }, [arraySize]);

  const resetArray = () => {
    if (!isSorting) {
      const newArray = generateRandomArray(arraySize);
      setArray(newArray);
      setComparingIndices([]);
      setSwappingIndices([]);
      setSortedIndices([]);
    }
  };

  const handleSort = async () => {
    if (isSorting) return;
    
    setIsSorting(true);
    setComparingIndices([]);
    setSwappingIndices([]);
    setSortedIndices([]);

    await algorithm(
      array,
      setArray,
      setComparingIndices,
      setSwappingIndices,
      speed
    );

    // Mark all as sorted
    setSortedIndices(array.map((_, idx) => idx));
    setComparingIndices([]);
    setSwappingIndices([]);
    setIsSorting(false);
  };

  const getBarColor = (index) => {
    if (sortedIndices.includes(index)) return COLORS.SORTED;
    if (swappingIndices.includes(index)) return COLORS.SWAPPING;
    if (comparingIndices.includes(index)) return COLORS.COMPARING;
    return COLORS.DEFAULT;
  };

  const maxValue = Math.max(...array);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Algorithm Info */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg shadow-lg">
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
        <button
          onClick={handleSort}
          disabled={isSorting}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold transition-colors"
        >
          <Play size={18} />
          Sort
        </button>

        <button
          onClick={resetArray}
          disabled={isSorting}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold transition-colors"
        >
          <Shuffle size={18} />
          New Array
        </button>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
        >
          <Settings size={18} />
          Settings
        </button>

        <div className="ml-auto text-white text-sm">
          <span className="font-semibold">Array Size:</span> {arraySize}
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-gray-700 p-4 space-y-4">
          <div>
            <label className="text-white text-sm font-semibold mb-2 block">
              Array Size: {arraySize}
            </label>
            <input
              type="range"
              min="10"
              max="100"
              value={arraySize}
              onChange={(e) => setArraySize(Number(e.target.value))}
              disabled={isSorting}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-white text-sm font-semibold mb-2 block">
              Animation Speed
            </label>
            <div className="flex gap-2">
              {Object.entries(SPEED_PRESETS).map(([name, value]) => (
                <button
                  key={name}
                  onClick={() => setSpeed(value)}
                  className={`px-3 py-1 rounded ${
                    speed === value
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  }`}
                >
                  {name.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Visualization Area */}
      <div className="flex-1 bg-gray-900 p-4 flex items-end justify-center gap-[2px] overflow-hidden">
        {array.map((value, idx) => (
          <div
            key={idx}
            className="transition-all duration-75"
            style={{
              height: `${(value / maxValue) * 100}%`,
              width: `${100 / array.length}%`,
              backgroundColor: getBarColor(idx),
              minWidth: '2px',
            }}
            title={`Value: ${value}, Index: ${idx}`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="bg-gray-800 p-3 flex flex-wrap gap-4 justify-center text-sm rounded-b-lg">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS.DEFAULT }}></div>
          <span className="text-white">Unsorted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS.COMPARING }}></div>
          <span className="text-white">Comparing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS.SWAPPING }}></div>
          <span className="text-white">Swapping</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS.SORTED }}></div>
          <span className="text-white">Sorted</span>
        </div>
      </div>
    </div>
  );
};

export default SortingVisualizer;
