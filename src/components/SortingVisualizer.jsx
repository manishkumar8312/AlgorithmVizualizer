import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Shuffle, Settings, BookOpen, Code2, FileText, SkipForward } from 'lucide-react';
import { generateRandomArray, SPEED_PRESETS, COLORS } from '../utils/animationHelpers';
import StepControls from './educational/StepControls';
import ExplanationPanel from './educational/ExplanationPanel';
import CodeViewer from './educational/CodeViewer';
import CustomTestCases from './educational/CustomTestCases';
import { algorithmDatabase } from '../data/algorithmData';

const SortingVisualizer = ({ algorithm, algorithmInfo }) => {
  const [array, setArray] = useState([]);
  const [comparingIndices, setComparingIndices] = useState([]);
  const [swappingIndices, setSwappingIndices] = useState([]);
  const [sortedIndices, setSortedIndices] = useState([]);
  
  const [arraySize, setArraySize] = useState(40);
  const [speed, setSpeed] = useState(SPEED_PRESETS.FAST);
  
  const [showSettings, setShowSettings] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showCodeViewer, setShowCodeViewer] = useState(false);
  const [showCustomTest, setShowCustomTest] = useState(false);
  
  // Playback state
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSorting, setIsSorting] = useState(false); // true while pre-computing

  useEffect(() => {
    resetArray();
  }, [arraySize, algorithmInfo.name]);

  const resetArray = (customArray = null) => {
    setIsPlaying(false);
    setIsPaused(false);
    setSteps([]);
    setCurrentStepIndex(0);
    
    const newArray = customArray || generateRandomArray(arraySize);
    setArray(newArray);
    setComparingIndices([]);
    setSwappingIndices([]);
    setSortedIndices([]);
  };

  const handleSort = async () => {
    if (steps.length > 0 && currentStepIndex === 0) {
      // If we already have steps computed and we're at the start, just play
      setIsPlaying(true);
      setIsPaused(false);
      return;
    }
    
    // Otherwise, generate the steps
    setIsSorting(true);
    
    const generatedSteps = [];
    let currentArrayState = [...array];
    let currentComparing = [];
    let currentSwapping = [];

    const addStep = (arr, comp, swap) => {
      generatedSteps.push({
        arrayState: [...(arr || currentArrayState)],
        comparingIndices: [...(comp || currentComparing)],
        swappingIndices: [...(swap || currentSwapping)],
        isSorted: false
      });
    };

    const proxyUpdateArray = (newArr) => {
      currentArrayState = [...newArr];
      addStep(currentArrayState, currentComparing, currentSwapping);
    };

    const proxySetComparing = (indices) => {
      currentComparing = [...indices];
      addStep(currentArrayState, currentComparing, currentSwapping);
    };

    const proxySetSwapping = (indices) => {
      currentSwapping = [...indices];
      addStep(currentArrayState, currentComparing, currentSwapping);
    };

    const instantSpeedRef = { current: 0 };
    
    // Add initial step
    addStep(array, [], []);

    // Wait slightly to let UI update to sorting state (showing loading if needed)
    await new Promise(resolve => setTimeout(resolve, 0));

    // Pre-compute all steps instantly
    await algorithm(
      array,
      proxyUpdateArray,
      proxySetComparing,
      proxySetSwapping,
      instantSpeedRef
    );

    // Add final sorted state step
    generatedSteps.push({
      arrayState: [...currentArrayState],
      comparingIndices: [],
      swappingIndices: [],
      isSorted: true
    });

    setSteps(generatedSteps);
    setCurrentStepIndex(0);
    setIsSorting(false);
    
    // Automatically start playing
    setIsPlaying(true);
    setIsPaused(false);
  };

  // Playback effect loop
  useEffect(() => {
    let timeoutId;
    if (isPlaying && !isPaused && currentStepIndex < steps.length - 1) {
      timeoutId = setTimeout(() => {
        applyStep(currentStepIndex + 1);
      }, speed);
    } else if (isPlaying && currentStepIndex >= steps.length - 1 && steps.length > 0) {
      setIsPlaying(false);
      setIsPaused(false);
    }
    return () => clearTimeout(timeoutId);
  }, [isPlaying, isPaused, currentStepIndex, steps, speed]);

  const applyStep = (index) => {
    if (index >= 0 && index < steps.length) {
      setCurrentStepIndex(index);
      const step = steps[index];
      setArray(step.arrayState);
      setComparingIndices(step.comparingIndices);
      setSwappingIndices(step.swappingIndices);
      if (step.isSorted) {
         setSortedIndices(step.arrayState.map((_, i) => i));
      } else {
         setSortedIndices([]);
      }
    }
  };

  // Playback control handlers
  const handleStepPlay = () => {
    if (steps.length === 0) {
      handleSort();
    } else {
      if (currentStepIndex >= steps.length - 1) {
        applyStep(0);
      }
      setIsPlaying(true);
      setIsPaused(false);
    }
  };

  const handleStepPause = () => {
    setIsPlaying(false);
    setIsPaused(true);
  };

  const handleStepNext = () => {
    setIsPlaying(false);
    setIsPaused(true);
    if (currentStepIndex < steps.length - 1) {
      applyStep(currentStepIndex + 1);
    }
  };

  const handleStepPrevious = () => {
    setIsPlaying(false);
    setIsPaused(true);
    if (currentStepIndex > 0) {
      applyStep(currentStepIndex - 1);
    }
  };

  const handleStepReset = () => {
    setIsPlaying(false);
    setIsPaused(false);
    if (steps.length > 0) {
      applyStep(0);
    }
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
    if (sortedIndices.includes(index)) return COLORS.SORTED || '#fb923c';
    if (swappingIndices.includes(index)) return COLORS.SWAPPING || '#f43f5e';
    if (comparingIndices.includes(index)) return COLORS.COMPARING || '#f472b6';
    return COLORS.DEFAULT || '#a5b4fc';
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
          <div className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md font-medium border border-indigo-100">
            <span className="font-bold opacity-75 mr-1">Time:</span> {algorithmInfo.timeComplexity}
          </div>
          <div className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md font-medium border border-indigo-100">
            <span className="font-bold opacity-75 mr-1">Space:</span> {algorithmInfo.spaceComplexity}
          </div>
        </div>
        <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-4xl">
          {algorithmInfo.description}
        </p>
      </div>

      {/* Action Controls Bar */}
      <div className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex flex-wrap items-center gap-3">
        {/* If steps exist, the StepControls handle play/pause. Otherwise, show a main Sort button */}
        {steps.length === 0 && (
          <button
            onClick={handleSort}
            disabled={isSorting}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm shadow-indigo-600/20"
          >
            <Play className="w-4 h-4 ml-0.5" />
            {isSorting ? 'Generating...' : 'Sort'}
          </button>
        )}

        <button
          onClick={() => resetArray()}
          className="flex items-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Shuffle className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          New Array
        </button>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm border ${
            showSettings 
              ? 'bg-purple-100 border-purple-200 text-purple-700 dark:bg-purple-900/40 dark:border-purple-700 dark:text-purple-300' 
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <Settings className={`w-4 h-4 ${showSettings ? 'text-purple-600 dark:text-purple-400' : 'text-slate-500 dark:text-slate-400'}`} />
          Settings
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

        {/* Educational Tools */}
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
            showExplanation ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white border border-transparent'
          }`}
        >
          <BookOpen className="w-4 h-4 opacity-80" />
          Info
        </button>

        <button
          onClick={() => setShowCodeViewer(!showCodeViewer)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
            showCodeViewer ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white border border-transparent'
          }`}
        >
          <Code2 className="w-4 h-4 opacity-80" />
          Code
        </button>

        <button
          onClick={() => setShowCustomTest(!showCustomTest)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
            showCustomTest ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700 shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white border border-transparent'
          }`}
        >
          <FileText className="w-4 h-4 opacity-80" />
          Test
        </button>

        <div className="ml-auto flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 font-medium bg-white dark:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 shadow-sm">
          <span>Array Size:</span> 
          <span className="text-slate-900 dark:text-white font-bold">{arraySize}</span>
        </div>
      </div>

      {/* Inline Settings Panel */}
      {showSettings && (
        <div className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6 shadow-inner flex flex-wrap gap-10">
          <div className="flex-1 min-w-[200px]">
            <label className="text-slate-700 dark:text-slate-200 text-sm font-bold mb-3 flex justify-between">
              Array Size <span>{arraySize}</span>
            </label>
            <input
              type="range"
              min="10"
              max="100"
              value={arraySize}
              onChange={(e) => setArraySize(Number(e.target.value))}
              disabled={isPlaying}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          <div className="flex-1 min-w-[250px]">
            <label className="text-slate-700 dark:text-slate-200 text-sm font-bold mb-3 flex justify-between">
              Animation Speed <span>{speed < 50 ? 'Fast' : speed > 200 ? 'Slow' : 'Medium'}</span>
            </label>
            <input
              type="range"
              min="1"
              max="1000"
              value={1001 - speed}
              onChange={(e) => setSpeed(1001 - Number(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              <span>Slow</span>
              <span>Fast</span>
            </div>
          </div>
        </div>
      )}

      {/* Step Controls Toolbar */}
      {steps.length > 0 && (
        <div>
          <StepControls
            currentStep={currentStepIndex + 1}
            totalSteps={steps.length}
            isPlaying={isPlaying}
            isPaused={isPaused}
            onPlay={handleStepPlay}
            onPause={handleStepPause}
            onResume={handleStepPlay}
            onNext={handleStepNext}
            onPrevious={handleStepPrevious}
            onReset={handleStepReset}
          />
        </div>
      )}

      {/* Main Visualization Area */}
      <div className="flex-1 bg-white dark:bg-slate-900 relative min-h-[400px] overflow-hidden">
        <div className="absolute inset-0 px-6 pt-6 pb-2 flex items-end justify-center gap-[2px]">
          {array.map((value, idx) => (
            <div
              key={idx}
              className="transition-all duration-75 rounded-t-sm"
              style={{
                height: `${(value / maxValue) * 85}%`,
                width: `${100 / array.length}%`,
                backgroundColor: getBarColor(idx),
                minWidth: '2px',
              }}
              title={`Value: ${value}, Index: ${idx}`}
            />
          ))}
        </div>
      </div>

      {/* Legend Footer */}
      <div className="bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-6 py-4 flex flex-wrap gap-6 justify-center text-[12px] font-medium text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: COLORS.DEFAULT || '#a5b4fc' }}></div>
          <span>Unsorted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: COLORS.COMPARING || '#f472b6' }}></div>
          <span>Comparing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: COLORS.SWAPPING || '#f43f5e' }}></div>
          <span>Swapping</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: COLORS.SORTED || '#fb923c' }}></div>
          <span>Sorted</span>
        </div>
      </div>

      {/* Educational Modals/Overlays */}
      <ExplanationPanel
        algorithmInfo={getAlgorithmData(algorithmInfo.name) || algorithmInfo}
        isOpen={showExplanation}
        onClose={() => setShowExplanation(false)}
      />

      {showCodeViewer && (
        <div className="fixed bottom-0 right-0 h-3/4 w-[500px] bg-white dark:bg-slate-900 border-t border-l border-slate-200 dark:border-slate-700 z-50 shadow-2xl rounded-tl-2xl overflow-hidden">
          <CodeViewer
            codeSnippets={getAlgorithmData(algorithmInfo.name)?.codeSnippets}
            isOpen={showCodeViewer}
            onClose={() => setShowCodeViewer(false)}
          />
        </div>
      )}

      {showCustomTest && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 z-40 max-h-96 overflow-y-auto shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
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
