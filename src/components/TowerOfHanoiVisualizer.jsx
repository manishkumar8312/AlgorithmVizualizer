import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, FastForward, Settings, MessageSquare, List } from 'lucide-react';
import { SPEED_PRESETS } from '../utils/animationHelpers';
import { runTowerOfHanoiTrace } from '../algorithms/recursion/puzzleEngine';
import { recursionAlgorithmsData } from '../data/recursionAlgorithms';

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

const TowerOfHanoiVisualizer = ({ algorithmId }) => {
  // Config state
  const [inputValue, setInputValue] = useState('3'); // Default 3 disks
  
  // Simulation State
  const [trace, setTrace] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(SPEED_PRESETS.MEDIUM);
  
  // UI Panels
  const [showSettings, setShowSettings] = useState(false);
  const [showStack, setShowStack] = useState(true);

  // Derived state for the current step
  const currentStep = currentStepIndex >= 0 && currentStepIndex < trace.length ? trace[currentStepIndex] : null;

  // Refs for auto-scroll and animation
  const stackEndRef = useRef(null);
  const logEndRef = useRef(null);
  const timerRef = useRef(null);

  // Update default input based on algorithm
  useEffect(() => {
    setInputValue('3');
    handleReset();
  }, [algorithmId]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  // Auto-scroll logic
  useEffect(() => {
    stackEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentStepIndex]);

  // Playback Loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= trace.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, speed, trace.length]);

  /* ---------- Operations ---------- */

  const handleRun = () => {
    handleReset();
    let numDisks = parseInt(inputValue, 10);
    if (isNaN(numDisks) || numDisks < 1) numDisks = 3;
    if (numDisks > 8) numDisks = 8; // Cap at 8 for performance/visual limits
    setInputValue(numDisks.toString());

    let newTrace = [];
    try {
      newTrace = runTowerOfHanoiTrace(numDisks);
    } catch (e) {
      console.error(e);
      return;
    }

    setTrace(newTrace);
    setCurrentStepIndex(0);
    setIsPlaying(true);
  };

  const handleReset = () => {
    setIsPlaying(false);
    clearInterval(timerRef.current);
    setTrace([]);
    setCurrentStepIndex(-1);
  };

  const togglePlay = () => {
    if (trace.length === 0) {
      handleRun();
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const stepForward = () => {
    setIsPlaying(false);
    if (currentStepIndex < trace.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  /* ---------- Rendering Helpers ---------- */

  const logColor = (type) => {
    switch (type) {
      case 'CALL': return 'text-blue-400';
      case 'MOVE': return 'text-fuchsia-400';
      case 'RETURN': return 'text-purple-400';
      case 'SUCCESS': return 'text-emerald-400';
      default: return 'text-gray-300';
    }
  };

  const meta = recursionAlgorithmsData[algorithmId] || {};

  const getDiskColor = (diskNum, totalDisks) => {
    const colors = [
      'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 
      'bg-blue-500', 'bg-indigo-500', 'bg-violet-500', 'bg-fuchsia-500'
    ];
    // Map colors so smallest disk is always the same relative color, etc.
    return colors[(diskNum - 1) % colors.length];
  };

  const renderPeg = (pegName, disks, totalDisks) => {
    const pegHeight = totalDisks * 24 + 40; // dynamically size peg height

    return (
      <div className="flex flex-col items-center justify-end relative mx-4" style={{ height: `${pegHeight}px`, width: '120px' }}>
        {/* The Peg (Pole) */}
        <div className="absolute bottom-0 w-3 bg-gray-600 rounded-t-full shadow-inner" style={{ height: '100%' }} />
        
        {/* The Base */}
        <div className="absolute bottom-0 w-full h-4 bg-gray-600 rounded-lg shadow-lg z-10" />

        {/* Disks */}
        <div className="flex flex-col-reverse items-center pb-4 z-20 w-full gap-1">
          {disks.map((disk, idx) => {
            const widthPct = 30 + (disk / Math.max(totalDisks, 1)) * 70;
            return (
              <div 
                key={disk}
                className={`h-5 rounded-full shadow-md ${getDiskColor(disk, totalDisks)} border border-white/20 flex items-center justify-center transition-all duration-300`}
                style={{ width: `${widthPct}%` }}
              >
                <span className="text-[10px] text-white/90 font-bold">{disk}</span>
              </div>
            );
          })}
        </div>

        {/* Peg Label */}
        <div className="absolute -bottom-8 text-gray-400 font-bold text-sm">Peg {pegName}</div>
      </div>
    );
  };

  const renderPuzzle = () => {
    if (!currentStep || !currentStep.pegs) return null;
    const pegs = currentStep.pegs;
    const totalDisks = Math.max(1, parseInt(inputValue, 10));

    return (
      <div className="flex justify-center items-end pb-16 w-full max-w-3xl">
        {renderPeg('A', pegs.A, totalDisks)}
        {renderPeg('B', pegs.B, totalDisks)}
        {renderPeg('C', pegs.C, totalDisks)}
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-5 py-3 rounded-t-lg shadow-lg flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">{meta.name || "Tower of Hanoi"}</h2>
          <p className="text-xs opacity-90 mt-0.5">
            Visualize the classic recursive puzzle
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <div className="bg-white/20 px-2.5 py-1 rounded-full">
            <span className="font-semibold">Time:</span> {meta.complexities?.time}
          </div>
          <div className="bg-white/20 px-2.5 py-1 rounded-full">
            <span className="font-semibold">Space:</span> {meta.complexities?.space}
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-gray-800 p-3 flex flex-wrap items-center gap-4 border-b border-gray-700">
        
        <div className="flex items-center gap-2 bg-gray-700 p-1.5 rounded-lg border border-gray-600">
          <span className="text-gray-300 text-xs font-semibold px-2 border-r border-gray-600">Disks</span>
          <input
            type="number"
            min="1"
            max="8"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-16 px-2 py-1 bg-gray-800 text-white rounded border border-transparent focus:border-violet-400 focus:outline-none text-sm"
          />
        </div>

        <button
          onClick={handleRun}
          className="flex items-center gap-1.5 bg-violet-500 hover:bg-violet-600 text-white px-4 py-1.5 rounded-lg font-semibold transition-colors text-sm"
        >
          <RotateCcw size={14} /> Run
        </button>

        <div className="h-6 w-px bg-gray-600 mx-1" />

        <button
          onClick={togglePlay}
          className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-semibold transition-colors text-sm"
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          {isPlaying ? 'Pause' : 'Play'}
        </button>

        <button
          onClick={stepForward}
          disabled={isPlaying || currentStepIndex >= trace.length - 1}
          className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white px-3 py-1.5 rounded-lg font-semibold transition-colors text-sm"
        >
          <FastForward size={14} /> Step
        </button>

        <div className="flex-1" />

        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors text-sm ${
            showSettings ? 'bg-fuchsia-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
          }`}
        >
          <Settings size={14} /> Speed
        </button>

        <button
          onClick={() => setShowStack(!showStack)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors text-sm ${
            showStack ? 'bg-violet-500 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
          }`}
        >
          <List size={14} /> Call Stack
        </button>
      </div>

      {/* Speed settings */}
      {showSettings && (
        <div className="bg-gray-700 p-3 flex items-center gap-3 border-b border-gray-600">
          <span className="text-white text-sm font-semibold">Animation Speed</span>
          <div className="flex gap-2">
            {Object.entries(SPEED_PRESETS).map(([name, value]) => (
              <button
                key={name}
                onClick={() => setSpeed(value)}
                className={`px-3 py-1 rounded text-sm ${
                  speed === value ? 'bg-fuchsia-500 text-white' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                }`}
              >
                {name.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Puzzle View */}
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-950 relative p-4 overflow-auto custom-scrollbar">
          {trace.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-lg font-medium select-none">
              Click <span className="text-violet-400 mx-1">Run</span> to visualize Tower of Hanoi
            </div>
          ) : (
            renderPuzzle()
          )}
        </div>

        {/* Right Side: Call Stack & Logs */}
        {showStack && (
          <div className="w-80 flex flex-col bg-gray-900 border-l border-gray-700">
            {/* Call Stack */}
            <div className="flex-1 flex flex-col border-b border-gray-700 min-h-0">
              <div className="px-4 py-2 bg-gray-800 border-b border-gray-700 flex items-center gap-2">
                <List size={16} className="text-violet-400" />
                <span className="text-white font-semibold text-sm">Call Stack</span>
              </div>
              <div className="flex-1 overflow-y-auto p-3 flex flex-col justify-end space-y-1 bg-gray-900 custom-scrollbar">
                {(!currentStep || currentStep.stack.length === 0) ? (
                   <p className="text-gray-500 text-xs text-center pb-4">Stack is empty</p>
                ) : (
                  currentStep.stack.map((call, idx) => {
                    const isTop = idx === currentStep.stack.length - 1;
                    return (
                      <div 
                        key={idx}
                        className={`px-3 py-2 rounded font-mono text-xs border-l-4 ${
                          isTop 
                            ? 'bg-violet-900/40 border-violet-500 text-violet-100 shadow-sm transform scale-100' 
                            : 'bg-gray-800 border-gray-600 text-gray-400 opacity-75'
                        } transition-all duration-300`}
                      >
                        <div className="flex justify-between items-center">
                          <span>{call}</span>
                          {isTop && <span className="text-[10px] text-violet-300">TOP</span>}
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={stackEndRef} />
              </div>
            </div>

            {/* Event Log */}
            <div className="h-1/3 flex flex-col min-h-0">
              <div className="px-4 py-2 bg-gray-800 border-b border-gray-700 flex items-center gap-2">
                <MessageSquare size={16} className="text-fuchsia-400" />
                <span className="text-white font-semibold text-sm">Execution Log</span>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-1.5 text-xs font-mono custom-scrollbar">
                {currentStepIndex < 0 ? (
                  <p className="text-gray-500 text-center mt-2">Waiting to run...</p>
                ) : (
                  trace.slice(0, currentStepIndex + 1).map((step, i) => (
                    <div key={i} className={`flex gap-2 ${logColor(step.type)}`}>
                      <span className="shrink-0 font-bold opacity-75">
                        {step.type === 'CALL' ? '→' : step.type === 'MOVE' ? '↹' : step.type === 'SUCCESS' ? '✓' : step.type === 'RETURN' ? '←' : '•'}
                      </span>
                      <span className="leading-relaxed">{step.message}</span>
                    </div>
                  ))
                )}
                <div ref={logEndRef} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TowerOfHanoiVisualizer;
