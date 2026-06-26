import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Plus, Trash2, Shuffle, RotateCcw, Settings, MessageSquare, ArrowUpToLine, ArrowDownToLine } from 'lucide-react';
import { SPEED_PRESETS } from '../utils/animationHelpers';
import {
  generateRandomHeap,
  layoutHeapTree,
  heapInsertAnimated,
  heapDeleteAnimated,
} from '../algorithms/trees/heapOperations';

/* ------------------------------------------------------------------ */
/*  HeapVisualizer – interactive Max/Min Heap playground              */
/* ------------------------------------------------------------------ */

const HeapVisualizer = () => {
  // State
  const [heapArray, setHeapArray] = useState([]);
  const [treeData, setTreeData] = useState({ nodes: [], edges: [] });
  const [isMaxHeap, setIsMaxHeap] = useState(true);

  // Animation state
  const [activeNode, setActiveNode] = useState(null);
  const [comparingNodes, setComparingNodes] = useState([]);
  const [swappingNodes, setSwappingNodes] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  // UI state
  const [inputValue, setInputValue] = useState('');
  const [speed, setSpeed] = useState(SPEED_PRESETS.MEDIUM);
  const [showSettings, setShowSettings] = useState(false);
  const [showExplanation, setShowExplanation] = useState(true);
  const [logs, setLogs] = useState([]);

  const logEndRef = useRef(null);

  // Update layout when array changes
  const refreshLayout = useCallback((arr) => {
    setHeapArray(arr);
    setTreeData(layoutHeapTree(arr));
  }, []);

  // Init
  useEffect(() => {
    handleRandomHeap(true); // start with Max Heap
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll logs
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  /* ---------- helpers ---------- */

  const addLog = useCallback((entry) => {
    setLogs((prev) => [...prev, { ...entry, ts: Date.now() }]);
  }, []);

  const clearAnimation = () => {
    setActiveNode(null);
    setComparingNodes([]);
    setSwappingNodes([]);
  };

  const parsedValue = () => {
    const v = parseInt(inputValue, 10);
    if (isNaN(v) || v < 1 || v > 999) return null;
    return v;
  };

  /* ---------- operations ---------- */

  const handleRandomHeap = (maxHeapFlag = isMaxHeap) => {
    if (isRunning) return;
    clearAnimation();
    const arr = generateRandomHeap(10, maxHeapFlag);
    refreshLayout(arr);
    setLogs([{ type: 'info', text: `Generated a random ${maxHeapFlag ? 'Max' : 'Min'} Heap with 10 elements.`, ts: Date.now() }]);
  };

  const handleReset = () => {
    if (isRunning) return;
    clearAnimation();
    refreshLayout([]);
    setLogs([{ type: 'info', text: 'Heap cleared.', ts: Date.now() }]);
  };

  const handleToggleHeapType = () => {
    if (isRunning) return;
    const newIsMax = !isMaxHeap;
    setIsMaxHeap(newIsMax);
    handleRandomHeap(newIsMax);
  };

  const handleInsert = async () => {
    const val = parsedValue();
    if (val === null || isRunning) return;
    setIsRunning(true);
    clearAnimation();

    await heapInsertAnimated(heapArray, val, isMaxHeap, {
      setActiveNode,
      setComparingNodes,
      setSwappingNodes,
      addLog,
      refreshLayout,
      speed,
    });

    clearAnimation();
    setIsRunning(false);
    setInputValue('');
  };

  const handleDelete = async () => {
    if (isRunning || heapArray.length === 0) return;
    setIsRunning(true);
    clearAnimation();

    await heapDeleteAnimated(heapArray, isMaxHeap, {
      setActiveNode,
      setComparingNodes,
      setSwappingNodes,
      addLog,
      refreshLayout,
      speed,
    });

    clearAnimation();
    setIsRunning(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isRunning) handleInsert();
  };

  /* ---------- Node / Array Box Styling ---------- */

  const getNodeState = (idx) => {
    if (swappingNodes.includes(idx)) return 'swapping';
    if (comparingNodes.includes(idx)) return 'comparing';
    if (activeNode === idx) return 'active';
    return 'default';
  };

  const getColors = (state) => {
    switch (state) {
      case 'swapping': return { fill: 'url(#heap-grad-swapping)', stroke: '#fca5a5', text: 'white' }; // red
      case 'comparing': return { fill: 'url(#heap-grad-comparing)', stroke: '#fde047', text: 'white' }; // yellow
      case 'active': return { fill: 'url(#heap-grad-active)', stroke: '#6ee7b7', text: 'white' }; // green
      default: return { fill: 'url(#heap-grad-default)', stroke: '#c7d2fe', text: 'white' }; // default blue
    }
  };

  /* ---------- Log Styling ---------- */

  const logColor = (type) => {
    switch (type) {
      case 'start': return 'text-blue-600';
      case 'compare': return 'text-amber-600';
      case 'success': return 'text-emerald-600';
      case 'error': return 'text-red-600';
      case 'warn': return 'text-yellow-600';
      case 'delete': return 'text-rose-600';
      case 'info':
      default: return 'text-slate-600';
    }
  };

  const logIcon = (type) => {
    switch (type) {
      case 'start': return '▶';
      case 'compare': return '⇄';
      case 'success': return '✓';
      case 'error': return '✗';
      case 'warn': return '⚠';
      case 'delete': return '🗑';
      case 'info':
      default: return 'ℹ';
    }
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-3 rounded-t-lg shadow-lg flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Heap Operations</h2>
          <p className="text-xs opacity-90 mt-0.5">
            Insert &amp; Extract Root with Bubble-up / Heapify-down
          </p>
        </div>
        <div className="flex items-center gap-4">
           {/* Heap Type Toggle */}
          <button
            onClick={handleToggleHeapType}
            disabled={isRunning}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 disabled:opacity-50 px-3 py-1.5 rounded-lg transition-colors font-semibold text-sm"
          >
            {isMaxHeap ? <ArrowUpToLine size={16} /> : <ArrowDownToLine size={16} />}
            {isMaxHeap ? 'Max Heap' : 'Min Heap'}
          </button>
          <div className="flex flex-wrap gap-2 text-xs">
            <div className="bg-white/20 px-2.5 py-1 rounded-full">
              <span className="font-semibold">Time:</span> O(log n)
            </div>
            <div className="bg-white/20 px-2.5 py-1 rounded-full">
              <span className="font-semibold">Space:</span> O(n)
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4 flex flex-wrap items-center gap-3">
        <input
          type="number"
          min={1}
          max={999}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Value (1–999)"
          disabled={isRunning}
          className="w-32 px-3 py-2 bg-white dark:bg-slate-700 text-slate-800 dark:text-white rounded-lg border border-slate-200 dark:border-slate-600 shadow-sm focus:border-blue-400 focus:outline-none text-sm placeholder-slate-400 disabled:opacity-50"
        />

        <button
          onClick={handleInsert}
          disabled={isRunning || !parsedValue()}
          className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg font-semibold transition-colors text-sm"
        >
          <Plus size={16} />
          Insert
        </button>

        <button
          onClick={handleDelete}
          disabled={isRunning || heapArray.length === 0}
          className="flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg font-semibold transition-colors text-sm"
        >
          <Trash2 size={16} />
          Extract Root
        </button>

        <div className="h-6 w-px bg-slate-200 mx-1" />

        <button
          onClick={() => handleRandomHeap()}
          disabled={isRunning}
          className="flex items-center gap-1.5 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg font-semibold transition-colors text-sm"
        >
          <Shuffle size={16} />
          Random Heap
        </button>

        <button
          onClick={handleReset}
          disabled={isRunning}
          className="flex items-center gap-1.5 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg font-semibold transition-colors text-sm"
        >
          <RotateCcw size={16} />
          Reset
        </button>

        <div className="h-6 w-px bg-slate-200 mx-1" />

        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold transition-colors text-sm border shadow-sm ${
            showSettings ? 'bg-blue-100 dark:bg-blue-900/40 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
          }`}
        >
          <Settings size={16} />
          Speed
        </button>

        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold transition-colors text-sm border shadow-sm ${
            showExplanation ? 'bg-blue-100 dark:bg-blue-900/40 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
          }`}
        >
          <MessageSquare size={16} />
          Log
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
                  speed === value ? 'bg-blue-600 text-white shadow-sm border-blue-600' : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                {name.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content: Array View + SVG Tree + Log */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Visualizations */}
        <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-800 overflow-hidden relative">
          
          {/* Array Representation */}
          <div className="h-24 border-b border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-2 bg-white dark:bg-slate-900">
            <div className="text-slate-500 dark:text-slate-400 text-xs font-semibold mb-2 tracking-wider uppercase">Array Representation</div>
            <div className="flex items-center gap-1 overflow-x-auto w-full px-4 justify-center">
              {heapArray.length === 0 ? (
                 <span className="text-slate-400 text-sm">Empty</span>
              ) : (
                heapArray.map((val, idx) => {
                  const state = getNodeState(idx);
                  let bg = 'bg-slate-50';
                  let border = 'border-slate-200';
                  let text = 'text-slate-700';
                  if (state === 'swapping') { bg = 'bg-red-100'; border = 'border-red-400'; text = 'text-red-700'; }
                  else if (state === 'comparing') { bg = 'bg-yellow-100'; border = 'border-yellow-400'; text = 'text-yellow-700'; }
                  else if (state === 'active') { bg = 'bg-emerald-100'; border = 'border-emerald-400'; text = 'text-emerald-700'; }

                  return (
                    <div key={`arr-${idx}`} className="flex flex-col items-center">
                      <div className={`w-10 h-10 flex items-center justify-center border-2 rounded ${bg} ${border} ${text} font-mono font-bold transition-colors duration-300`}>
                        {val}
                      </div>
                      <div className="text-slate-400 text-[10px] mt-1">{idx}</div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* SVG Tree */}
          <div 
            className="flex-1 overflow-hidden relative dark:bg-slate-900"
            style={{ backgroundColor: '#f8fafc', backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}
          >
             {heapArray.length === 0 ? (
               <div className="absolute inset-0 flex items-center justify-center text-slate-500 dark:text-slate-400 text-lg font-medium select-none">
                Enter a value and click <span className="text-emerald-600 mx-1">Insert</span> or press{' '}
                <span className="text-purple-600 mx-1">Random Heap</span>
               </div>
             ) : (
                <svg viewBox="0 0 1100 460" preserveAspectRatio="xMidYMid meet" className="w-full h-full">
                  <defs>
                    <filter id="heap-shadow" x="-30%" y="-30%" width="160%" height="160%">
                      <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.45" />
                    </filter>
                    <radialGradient id="heap-grad-default" cx="35%" cy="30%" r="65%">
                      <stop offset="0%" stopColor="#60a5fa" />
                      <stop offset="100%" stopColor="#2563eb" />
                    </radialGradient>
                    <radialGradient id="heap-grad-active" cx="35%" cy="30%" r="65%">
                      <stop offset="0%" stopColor="#34d399" />
                      <stop offset="100%" stopColor="#059669" />
                    </radialGradient>
                    <radialGradient id="heap-grad-comparing" cx="35%" cy="30%" r="65%">
                      <stop offset="0%" stopColor="#fcd34d" />
                      <stop offset="100%" stopColor="#d97706" />
                    </radialGradient>
                    <radialGradient id="heap-grad-swapping" cx="35%" cy="30%" r="65%">
                      <stop offset="0%" stopColor="#fca5a5" />
                      <stop offset="100%" stopColor="#ef4444" />
                    </radialGradient>
                  </defs>

                  {/* Edges */}
                  {treeData.edges.map((edge, i) => {
                    const fromState = getNodeState(edge.from.index);
                    const toState = getNodeState(edge.to.index);
                    const isComparing = (fromState === 'comparing' || fromState === 'active' || fromState === 'swapping') && 
                                        (toState === 'comparing' || toState === 'active' || toState === 'swapping');
                    return (
                      <line
                        key={`edge-${i}`}
                        x1={edge.from.x}
                        y1={edge.from.y}
                        x2={edge.to.x}
                        y2={edge.to.y}
                        stroke={isComparing ? '#fbbf24' : '#cbd5e1'}
                        strokeWidth={isComparing ? 4 : 3}
                        strokeLinecap="round"
                        className="transition-all duration-300"
                      />
                    );
                  })}

                  {/* Nodes */}
                  {treeData.nodes.map((node) => {
                    const state = getNodeState(node.index);
                    const colors = getColors(state);
                    const isHighlighted = state !== 'default';

                    return (
                      <g
                        key={`node-${node.id}`}
                        className="cursor-pointer"
                        style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                      >
                        {/* Glow ring */}
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={40}
                          fill="none"
                          stroke={colors.stroke}
                          strokeWidth={isHighlighted ? 3 : 1.5}
                          opacity={isHighlighted ? 0.6 : 0.25}
                          className="transition-all duration-300"
                        />

                        {/* Main circle */}
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={30}
                          fill={colors.fill}
                          stroke={colors.stroke}
                          strokeWidth={isHighlighted ? 3 : 2}
                          filter="url(#heap-shadow)"
                          className="transition-all duration-300"
                        />

                        {/* Value */}
                        <text
                          x={node.x}
                          y={node.y + 1}
                          textAnchor="middle"
                          dy=".38em"
                          fill={colors.text}
                          fontSize="18"
                          fontWeight="800"
                          fontFamily="monospace"
                          style={{ textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}
                        >
                          {node.val}
                        </text>
                        
                        {/* Index label */}
                        <text
                          x={node.x + 25}
                          y={node.y - 25}
                          textAnchor="middle"
                          fill="#94a3b8"
                          fontSize="10"
                          fontWeight="700"
                          fontFamily="monospace"
                        >
                          [{node.index}]
                        </text>
                      </g>
                    );
                  })}
                </svg>
             )}
          </div>
        </div>

        {/* Right Side: Log Panel */}
        {showExplanation && (
          <div className="w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 flex flex-col">
            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
              <MessageSquare size={16} className="text-blue-500" />
              <span className="text-slate-800 dark:text-slate-100 font-semibold text-sm">Algorithm Log</span>
              <button
                onClick={() => setLogs([])}
                className="ml-auto text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
              >
                Clear
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5 text-xs font-mono">
              {logs.length === 0 && (
                <p className="text-slate-500 dark:text-slate-400 text-center mt-6">
                  Perform an operation to see step‑by‑step logs here.
                </p>
              )}
              {logs.map((entry, i) => (
                <div key={i} className={`flex gap-2 ${logColor(entry.type)}`}>
                  <span className="shrink-0 w-4 text-center">{logIcon(entry.type)}</span>
                  <span className="leading-relaxed">{entry.text}</span>
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="bg-slate-50 dark:bg-slate-800 p-3 flex flex-wrap gap-4 justify-center text-sm rounded-b-lg border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3b82f6' }} />
          <span className="text-slate-600 dark:text-slate-300">Idle</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#10b981' }} />
          <span className="text-slate-600 dark:text-slate-300">Active (Current)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#facc15' }} />
          <span className="text-slate-600 dark:text-slate-300">Comparing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ef4444' }} />
          <span className="text-slate-600 dark:text-slate-300">Swapping</span>
        </div>
      </div>
    </div>
  );
};

export default HeapVisualizer;
