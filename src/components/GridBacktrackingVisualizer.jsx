import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, Pause, RotateCcw, FastForward, Settings, MessageSquare, List } from 'lucide-react';
import { SPEED_PRESETS } from '../utils/animationHelpers';
import {
  runNQueensTrace,
  runSudokuTrace,
  runRatInMazeTrace,
  runKnightsTourTrace
} from '../algorithms/recursion/gridEngine';
import { recursionAlgorithmsData } from '../data/recursionAlgorithms';

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

const GridBacktrackingVisualizer = ({ algorithmId }) => {
  // Config state
  const [inputValue, setInputValue] = useState('');
  
  // Simulation State
  const [trace, setTrace] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(SPEED_PRESETS.MEDIUM);
  
  // UI Panels
  const [showSettings, setShowSettings] = useState(false);

  // Derived state for the current step
  const currentStep = currentStepIndex >= 0 && currentStepIndex < trace.length ? trace[currentStepIndex] : null;

  // Refs for auto-scroll and animation
  const timerRef = useRef(null);

  // Default initial boards
  const defaultSudoku = [
    ['5','3','.','.','7','.','.','.','.'],
    ['6','.','.','1','9','5','.','.','.'],
    ['.','9','8','.','.','.','.','6','.'],
    ['8','.','.','.','6','.','.','.','3'],
    ['4','.','.','8','.','3','.','.','1'],
    ['7','.','.','.','2','.','.','.','6'],
    ['.','6','.','.','.','.','2','8','.'],
    ['.','.','.','4','1','9','.','.','5'],
    ['.','.','.','.','8','.','.','7','9']
  ];

  const defaultMaze = [
    [1, 0, 0, 0],
    [1, 1, 0, 1],
    [0, 1, 0, 0],
    [1, 1, 1, 1]
  ];

  // Update default input based on algorithm
  useEffect(() => {
    switch (algorithmId) {
      case 'nQueens': setInputValue('4'); break;
      case 'sudoku': setInputValue('default'); break;
      case 'ratInMaze': setInputValue('default'); break;
      case 'knightsTour': setInputValue('5'); break;
      default: setInputValue('4');
    }
    handleReset();
  }, [algorithmId]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

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
    let newTrace = [];
    
    try {
      if (algorithmId === 'nQueens') {
        newTrace = runNQueensTrace(parseInt(inputValue, 10) || 4);
      } else if (algorithmId === 'sudoku') {
        newTrace = runSudokuTrace(defaultSudoku);
      } else if (algorithmId === 'ratInMaze') {
        newTrace = runRatInMazeTrace(defaultMaze);
      } else if (algorithmId === 'knightsTour') {
        newTrace = runKnightsTourTrace(parseInt(inputValue, 10) || 5);
      }
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
      case 'PLACE': return 'text-blue-400';
      case 'TRY': return 'text-yellow-400';
      case 'SUCCESS': return 'text-emerald-400';
      case 'BACKTRACK': return 'text-rose-400';
      case 'INVALID': return 'text-orange-400';
      default: return 'text-gray-300';
    }
  };

  const meta = recursionAlgorithmsData[algorithmId] || {};

  const renderGrid = () => {
    if (!currentStep || !currentStep.board) return null;
    const board = currentStep.board;
    const n = board.length;
    const m = board[0].length;

    return (
      <div 
        className="grid gap-1 p-2 bg-white rounded-lg shadow-md border border-slate-200"
        style={{ 
          gridTemplateColumns: `repeat(${m}, minmax(0, 1fr))`,
          maxWidth: Math.min(600, m * 60) + 'px',
          width: '100%',
          aspectRatio: `${m}/${n}`
        }}
      >
        {board.map((row, i) => (
          row.map((cell, j) => {
            const isFocused = currentStep.row === i && currentStep.col === j;
            let cellContent = cell;
            let cellStyle = "bg-slate-50 text-slate-800 border-2 border-slate-200";
            
            if (algorithmId === 'nQueens') {
              cellContent = cell === 'Q' ? '♕' : '';
              cellStyle = (i + j) % 2 === 0 ? "bg-slate-100" : "bg-white";
              if (cell === 'Q') cellStyle += " text-3xl text-blue-600";
            } else if (algorithmId === 'sudoku') {
              cellContent = cell === '.' ? '' : cell;
              cellStyle = "bg-white text-xl font-semibold border border-slate-200 text-slate-800";
              // thicker borders for 3x3
              if (j % 3 === 2 && j !== 8) cellStyle += " border-r-slate-400 border-r-2";
              if (i % 3 === 2 && i !== 8) cellStyle += " border-b-slate-400 border-b-2";
            } else if (algorithmId === 'ratInMaze') {
              cellContent = cell === 1 ? '🐀' : '';
              if (currentStep.maze[i][j] === 0) {
                cellStyle = "bg-slate-800 border-slate-700"; // wall
              } else {
                cellStyle = "bg-white border-slate-200"; // path
                if (cell === 1) cellStyle += " bg-emerald-100";
              }
            } else if (algorithmId === 'knightsTour') {
              cellContent = cell === -1 ? '' : cell;
              cellStyle = (i + j) % 2 === 0 ? "bg-slate-100" : "bg-white";
              if (cell !== -1) cellStyle += " font-bold text-blue-600 text-lg";
            }

            if (isFocused) {
              if (currentStep.type === 'PLACE') cellStyle += " ring-2 ring-blue-500 ring-inset bg-blue-100";
              else if (currentStep.type === 'TRY') cellStyle += " ring-2 ring-yellow-500 ring-inset bg-yellow-100";
              else if (currentStep.type === 'BACKTRACK') cellStyle += " ring-2 ring-red-500 ring-inset bg-red-100";
              else if (currentStep.type === 'INVALID') cellStyle += " ring-2 ring-orange-500 ring-inset bg-orange-100";
            }

            return (
              <div 
                key={`${i}-${j}`} 
                className={`flex items-center justify-center rounded-sm transition-all duration-300 ${cellStyle}`}
              >
                {cellContent}
              </div>
            );
          })
        ))}
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-3 rounded-t-lg shadow-lg flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">{meta.name || "Grid Backtracking"}</h2>
          <p className="text-xs opacity-90 mt-0.5">
            Visualize the State Space Search and Backtracking
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
      <div className="bg-slate-50 dark:bg-slate-800 p-3 flex flex-wrap items-center gap-4 border-b border-slate-200 dark:border-slate-700">
        
        <div className="flex items-center gap-2 bg-white dark:bg-slate-700 p-1.5 rounded-lg border border-slate-200 dark:border-slate-600 shadow-sm">
          <span className="text-slate-600 dark:text-slate-300 text-xs font-semibold px-2 border-r border-slate-200 dark:border-slate-600">Input</span>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={algorithmId === 'sudoku' || algorithmId === 'ratInMaze'}
            placeholder="Grid size"
            className="w-32 px-2 py-1 bg-slate-50 dark:bg-slate-600 text-slate-800 dark:text-white rounded border border-transparent focus:border-blue-400 focus:outline-none text-sm disabled:opacity-50"
          />
        </div>

        <button
          onClick={handleRun}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg font-semibold transition-colors text-sm shadow-sm"
        >
          <RotateCcw size={14} /> Run
        </button>

        <div className="h-6 w-px bg-slate-200 mx-1" />

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
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors text-sm border shadow-sm ${
            showSettings ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300'
          }`}
        >
          <Settings size={14} /> Speed
        </button>

      </div>

      {/* Speed settings */}
      {showSettings && (
        <div className="bg-slate-100 dark:bg-slate-800 p-3 flex items-center gap-3 border-b border-slate-200 dark:border-slate-700">
          <span className="text-slate-700 dark:text-slate-200 text-sm font-semibold">Animation Speed</span>
          <div className="flex gap-2">
            {Object.entries(SPEED_PRESETS).map(([name, value]) => (
              <button
                key={name}
                onClick={() => setSpeed(value)}
                className={`px-3 py-1 rounded border text-sm transition-colors ${
                  speed === value ? 'bg-blue-600 text-white shadow-sm border-blue-600' : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600'
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
        
        {/* Grid View */}
        <div 
          className="flex-1 flex flex-col items-center justify-center relative p-4 overflow-auto custom-scrollbar dark:bg-slate-900"
          style={{ backgroundColor: '#f8fafc', backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        >
          {trace.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center text-slate-500 dark:text-slate-400 text-lg font-medium select-none">
              Click <span className="text-blue-600 mx-1">Run</span> to visualize backtracking
            </div>
          ) : (
            renderGrid()
          )}
        </div>

        {/* Right Side: Call Stack & Logs (Removed) */}
      </div>
    </div>
  );
};

export default GridBacktrackingVisualizer;
