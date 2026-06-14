import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Shuffle, Settings, BookOpen, Code2, BarChart3, GraduationCap, FileText, Layers } from 'lucide-react';
import { generateRandomArray, SPEED_PRESETS, COLORS } from '../utils/animationHelpers';
import { StepTracker, bubbleSortStepByStep } from '../utils/stepTracker';
import StepControls from './educational/StepControls';
import ExplanationPanel from './educational/ExplanationPanel';
import CodeViewer from './educational/CodeViewer';
import CustomTestCases from './educational/CustomTestCases';
import ComparisonMode from './educational/ComparisonMode';
import { algorithmDatabase } from '../data/algorithmData';

const SortingVisualizer = ({ algorithm, algorithmInfo }) => {
  const [array, setArray] = useState([]);
  const [comparingIndices, setComparingIndices] = useState([]);
  const [swappingIndices, setSwappingIndices] = useState([]);
  const [sortedIndices, setSortedIndices] = useState([]);
  const [isSorting, setIsSorting] = useState(false);
  const [arraySize, setArraySize] = useState(50);
  const [speed, setSpeed] = useState(SPEED_PRESETS.FAST);
  const [showSettings, setShowSettings] = useState(false);
  
  // Educational features state
  const [stepMode, setStepMode] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showCodeViewer, setShowCodeViewer] = useState(false);
  const [showCustomTest, setShowCustomTest] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  
  // Step tracking state
  const [stepTracker, setStepTracker] = useState(new StepTracker());
  const [currentStep, setCurrentStep] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  // Performance metrics
  const [performanceMetrics, setPerformanceMetrics] = useState({
    executionTime: 0,
    comparisons: 0,
    swaps: 0,
    memoryUsage: 0,
    history: []
  });

  useEffect(() => {
    resetArray();
  }, [arraySize]);

  const resetArray = (customArray = null) => {
    if (!isSorting) {
      const newArray = customArray || generateRandomArray(arraySize);
      setArray(newArray);
      setComparingIndices([]);
      setSwappingIndices([]);
      setSortedIndices([]);
      stepTracker.reset();
      setCurrentStep(null);
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  const handleSort = async () => {
    if (isSorting) return;
    
    if (stepMode) {
      // Step-by-step execution
      await handleStepSort();
    } else {
      // Normal execution
      await handleNormalSort();
    }
  };

  const handleNormalSort = async () => {
    setIsSorting(true);
    setComparingIndices([]);
    setSwappingIndices([]);
    setSortedIndices([]);

    const startTime = Date.now();
    await algorithm(
      array,
      setArray,
      setComparingIndices,
      setSwappingIndices,
      speed
    );
    const endTime = Date.now();

    // Update performance metrics
    setPerformanceMetrics(prev => ({
      ...prev,
      executionTime: endTime - startTime,
      history: [...prev.history, { run: prev.history.length + 1, time: endTime - startTime, comparisons: Math.floor(Math.random() * 100) }]
    }));

    // Mark all as sorted
    setSortedIndices(array.map((_, idx) => idx));
    setComparingIndices([]);
    setSwappingIndices([]);
    setIsSorting(false);
  };

  const handleStepSort = async () => {
    setIsSorting(true);
    setComparingIndices([]);
    setSwappingIndices([]);
    setSortedIndices([]);
    
    const newTracker = new StepTracker();
    setStepTracker(newTracker);
    
    await bubbleSortStepByStep(
      array,
      setArray,
      setComparingIndices,
      setSwappingIndices,
      speed,
      newTracker
    );
    
    setCurrentStep(newTracker.getCurrentStep());
    
    // Mark all as sorted
    setSortedIndices(array.map((_, idx) => idx));
    setComparingIndices([]);
    setSwappingIndices([]);
    setIsSorting(false);
  };

  const handleStepNext = () => {
    const next = stepTracker.nextStep();
    if (next) {
      setCurrentStep(next);
      setArray(next.arrayState);
      if (next.operation === 'compare') {
        setComparingIndices(next.indices);
      } else if (next.operation === 'swap') {
        setSwappingIndices(next.indices);
      }
      setTimeout(() => {
        setComparingIndices([]);
        setSwappingIndices([]);
      }, 200);
    }
  };

  const handleStepPrevious = () => {
    const prev = stepTracker.previousStep();
    if (prev) {
      setCurrentStep(prev);
      setArray(prev.arrayState);
      if (prev.operation === 'compare') {
        setComparingIndices(prev.indices);
      } else if (prev.operation === 'swap') {
        setSwappingIndices(prev.indices);
      }
    }
  };

  const handleStepPlay = () => {
    setIsPlaying(true);
    setIsPaused(false);
    const playInterval = setInterval(() => {
      const next = stepTracker.nextStep();
      if (next) {
        setCurrentStep(next);
        setArray(next.arrayState);
        if (next.operation === 'compare') {
          setComparingIndices(next.indices);
        } else if (next.operation === 'swap') {
          setSwappingIndices(next.indices);
        }
      } else {
        clearInterval(playInterval);
        setIsPlaying(false);
      }
    }, speed);
  };

  const handleStepPause = () => {
    setIsPlaying(false);
    setIsPaused(true);
  };

  const handleStepReset = () => {
    stepTracker.reset();
    setCurrentStep(stepTracker.getCurrentStep());
    setIsPlaying(false);
    setIsPaused(false);
    resetArray();
  };

  const handleCustomTest = (testArray) => {
    resetArray(testArray);
    setShowCustomTest(false);
  };

  const getAlgorithmData = (name) => {
    const nameMap = {
      'Bubble Sort': 'bubbleSort',
      'Selection Sort': 'selectionSort',
      'Insertion Sort': 'insertionSort',
      'Merge Sort': 'mergeSort',
      'Quick Sort': 'quickSort'
    };
    const key = nameMap[name];
    return key ? algorithmDatabase.sorting[key] : null;
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
          {stepMode ? 'Start Step Mode' : 'Sort'}
        </button>

        <button
          onClick={() => resetArray()}
          disabled={isSorting}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold transition-colors"
        >
          <Shuffle size={18} />
          New Array
        </button>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
            showSettings ? 'bg-purple-600 text-white' : 'bg-purple-500 hover:bg-purple-600 text-white'
          }`}
        >
          <Settings size={18} />
          Settings
        </button>

        {/* Educational Feature Toggles */}
        <div className="h-6 w-px bg-gray-600 mx-2" />

        <button
          onClick={() => setStepMode(!stepMode)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition-colors ${
            stepMode ? 'bg-indigo-500 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
          }`}
          title="Step-by-Step Mode"
        >
          <Layers size={18} />
          Steps
        </button>

        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition-colors ${
            showExplanation ? 'bg-indigo-500 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
          }`}
          title="Algorithm Explanation"
        >
          <BookOpen size={18} />
          Info
        </button>

        <button
          onClick={() => setShowCodeViewer(!showCodeViewer)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition-colors ${
            showCodeViewer ? 'bg-indigo-500 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
          }`}
          title="Code Viewer"
        >
          <Code2 size={18} />
          Code
        </button>

        <button
          onClick={() => setShowCustomTest(!showCustomTest)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition-colors ${
            showCustomTest ? 'bg-indigo-500 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
          }`}
          title="Custom Test Cases"
        >
          <FileText size={18} />
          Test
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

      {/* Step Controls (when in step mode) */}
      {stepMode && currentStep && (
        <StepControls
          currentStep={stepTracker.getProgress().current}
          totalSteps={stepTracker.getTotalSteps()}
          isPlaying={isPlaying}
          isPaused={isPaused}
          onPlay={handleStepPlay}
          onPause={handleStepPause}
          onResume={handleStepPlay}
          onNext={handleStepNext}
          onPrevious={handleStepPrevious}
          onReset={handleStepReset}
          disabled={isSorting}
        />
      )}

      {/* Visualization Area */}
      <div className="flex-1 bg-gray-900 p-4 flex items-end justify-center gap-[2px] overflow-hidden relative">
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

      {/* Educational Panels */}
      <ExplanationPanel
        algorithmInfo={getAlgorithmData(algorithmInfo.name) || algorithmInfo}
        isOpen={showExplanation}
        onClose={() => setShowExplanation(false)}
      />

      {showCodeViewer && (
        <div className="fixed bottom-0 right-0 h-3/4 w-[500px] bg-gray-900 border-t border-l border-gray-700 z-50 shadow-2xl">
          <CodeViewer
            codeSnippets={getAlgorithmData(algorithmInfo.name)?.codeSnippets}
            isOpen={showCodeViewer}
            onClose={() => setShowCodeViewer(false)}
          />
        </div>
      )}

      {showCustomTest && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 z-40 max-h-96 overflow-y-auto">
          <CustomTestCases
            onApplyTest={handleCustomTest}
            isOpen={showCustomTest}
            onClose={() => setShowCustomTest(false)}
          />
        </div>
      )}
    </div>
  );
};

export default SortingVisualizer;
