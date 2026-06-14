import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Settings, MessageSquare, BarChart3, Shuffle, RotateCcw } from 'lucide-react';
import { SPEED_PRESETS } from '../utils/animationHelpers';
import {
  generateRandomArrayForSegTree,
  buildSegmentTreeAnimated,
  buildSegmentTreeSync,
  layoutSegmentTree,
  querySegmentTreeAnimated,
  updateSegmentTreeAnimated,
  SEG_TYPES
} from '../algorithms/trees/segmentTreeOperations';

/* ------------------------------------------------------------------ */
/*  SegmentTreeVisualizer                                             */
/* ------------------------------------------------------------------ */

const SegmentTreeVisualizer = () => {
  // Tree state
  const [baseArray, setBaseArray] = useState([]);
  const [segRoot, setSegRoot] = useState(null);
  const [treeData, setTreeData] = useState({ nodes: [], edges: [] });
  const [treeType, setTreeType] = useState(SEG_TYPES.SUM);

  // Animation state
  const [activeNode, setActiveNode] = useState(null);
  const [visitedNodes, setVisitedNodes] = useState([]);
  const [contributingNodes, setContributingNodes] = useState([]);
  const [propagatingNodes, setPropagatingNodes] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  // UI Inputs
  const [arrayInput, setArrayInput] = useState('');
  const [queryL, setQueryL] = useState('');
  const [queryR, setQueryR] = useState('');
  const [updateIdx, setUpdateIdx] = useState('');
  const [updateVal, setUpdateVal] = useState('');
  
  // UI Panels
  const [speed, setSpeed] = useState(SPEED_PRESETS.MEDIUM);
  const [showSettings, setShowSettings] = useState(false);
  const [showExplanation, setShowExplanation] = useState(true);
  const [logs, setLogs] = useState([]);

  const logEndRef = useRef(null);
  
  // Need a stable ref for operations that update UI
  const rootRef = useRef(null);

  const refreshLayout = useCallback((root) => {
    if (!root) return;
    setTreeData(layoutSegmentTree(root));
  }, []);

  // Init
  useEffect(() => {
    handleRandomArray();
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
    setVisitedNodes([]);
    setContributingNodes([]);
    setPropagatingNodes([]);
  };

  /* ---------- operations ---------- */

  const initTreeWithArray = (arr, type) => {
    setBaseArray([...arr]);
    setArrayInput(arr.join(', '));
    const root = buildSegmentTreeSync(arr, type);
    setSegRoot(root);
    rootRef.current = root;
    refreshLayout(root);
  };

  const handleRandomArray = () => {
    if (isRunning) return;
    clearAnimation();
    const arr = generateRandomArrayForSegTree(8, 1, 50);
    initTreeWithArray(arr, treeType);
    setLogs([{ type: 'info', text: `Generated random array and built ${treeType} tree.`, ts: Date.now() }]);
  };

  const handleTypeChange = (e) => {
    if (isRunning) return;
    const newType = e.target.value;
    setTreeType(newType);
    clearAnimation();
    initTreeWithArray(baseArray, newType);
    setLogs([{ type: 'info', text: `Switched tree type to ${newType.toUpperCase()}.`, ts: Date.now() }]);
  };

  const handleBuildUserArray = () => {
    if (isRunning) return;
    const parts = arrayInput.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
    if (parts.length === 0) return;
    clearAnimation();
    initTreeWithArray(parts, treeType);
    setLogs([{ type: 'success', text: `Built new tree from input array.`, ts: Date.now() }]);
  };

  const handleQuery = async () => {
    const l = parseInt(queryL, 10);
    const r = parseInt(queryR, 10);
    if (isNaN(l) || isNaN(r) || l > r || l < 0 || r >= baseArray.length || isRunning) {
      addLog({ type: 'error', text: 'Invalid query range.' });
      return;
    }
    
    setIsRunning(true);
    clearAnimation();

    await querySegmentTreeAnimated(segRoot, treeType, l, r, {
      setActiveNode,
      setVisitedNodes,
      setContributingNodes,
      addLog,
      speed,
    });

    setIsRunning(false);
  };

  const handleUpdate = async () => {
    const idx = parseInt(updateIdx, 10);
    const val = parseInt(updateVal, 10);
    if (isNaN(idx) || isNaN(val) || idx < 0 || idx >= baseArray.length || isRunning) {
      addLog({ type: 'error', text: 'Invalid update parameters.' });
      return;
    }

    setIsRunning(true);
    clearAnimation();

    // Update base array locally
    const newArr = [...baseArray];
    newArr[idx] = val;
    setBaseArray(newArr);
    setArrayInput(newArr.join(', '));

    await updateSegmentTreeAnimated(segRoot, treeType, idx, val, {
      setActiveNode,
      setVisitedNodes,
      setPropagatingNodes,
      addLog,
      refreshLayout,
      speed,
    });

    setIsRunning(false);
  };

  /* ---------- UI Node Styling ---------- */

  const getGradId = (node) => {
    if (activeNode === node.id) return 'seg-grad-active';
    if (contributingNodes.includes(node.id)) return 'seg-grad-contributing';
    if (propagatingNodes.includes(node.id)) return 'seg-grad-propagating';
    if (visitedNodes.includes(node.id)) return 'seg-grad-visited';
    return 'seg-grad-default';
  };

  const getStrokeColor = (node) => {
    if (activeNode === node.id) return '#fef3c7'; // active yellow
    if (contributingNodes.includes(node.id)) return '#bbf7d0'; // green
    if (propagatingNodes.includes(node.id)) return '#bfdbfe'; // light blue
    if (visitedNodes.includes(node.id)) return '#a7f3d0';
    return '#6366f1';
  };

  /* ---------- Log Styling ---------- */

  const logColor = (type) => {
    switch (type) {
      case 'start': return 'text-blue-400';
      case 'compare': return 'text-amber-300';
      case 'success': return 'text-emerald-400';
      case 'error': return 'text-red-400';
      case 'warn': return 'text-yellow-400';
      case 'info':
      default: return 'text-gray-300';
    }
  };

  const logIcon = (type) => {
    switch (type) {
      case 'start': return '▶';
      case 'compare': return '⇄';
      case 'success': return '✓';
      case 'error': return '✗';
      case 'warn': return '⚠';
      case 'info':
      default: return 'ℹ';
    }
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-3 rounded-t-lg shadow-lg flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Segment Tree</h2>
          <p className="text-xs opacity-90 mt-0.5">
            Range Queries &amp; Point Updates
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select
             value={treeType}
             onChange={handleTypeChange}
             disabled={isRunning}
             className="bg-white/20 border border-white/30 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-white transition-colors"
          >
            <option value={SEG_TYPES.SUM} className="text-black">Sum Tree</option>
            <option value={SEG_TYPES.MIN} className="text-black">Min Tree</option>
            <option value={SEG_TYPES.MAX} className="text-black">Max Tree</option>
          </select>
          <div className="flex flex-wrap gap-2 text-xs">
            <div className="bg-white/20 px-2.5 py-1 rounded-full">
              <span className="font-semibold">Query:</span> O(log N)
            </div>
            <div className="bg-white/20 px-2.5 py-1 rounded-full">
              <span className="font-semibold">Update:</span> O(log N)
            </div>
          </div>
        </div>
      </div>

      {/* Controls Bar 1: Array Build */}
      <div className="bg-gray-800 px-4 py-2 flex flex-wrap items-center gap-3 border-b border-gray-700">
        <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider w-16">Array</span>
        <input
          type="text"
          value={arrayInput}
          onChange={(e) => setArrayInput(e.target.value)}
          placeholder="e.g. 5, 2, 9, 1, 7"
          disabled={isRunning}
          className="flex-1 max-w-sm px-3 py-1.5 bg-gray-700 text-white rounded border border-gray-600 focus:border-indigo-400 focus:outline-none text-sm placeholder-gray-400 disabled:opacity-50"
        />
        <button
          onClick={handleBuildUserArray}
          disabled={isRunning}
          className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-600 text-white px-3 py-1.5 rounded text-sm font-semibold transition-colors"
        >
          Build
        </button>
        <button
          onClick={handleRandomArray}
          disabled={isRunning}
          className="flex items-center gap-1.5 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 text-white px-3 py-1.5 rounded text-sm font-semibold transition-colors"
        >
          <Shuffle size={14} /> Random
        </button>
      </div>

      {/* Controls Bar 2: Operations */}
      <div className="bg-gray-800 p-3 flex flex-wrap items-center gap-4">
        
        {/* Point Update */}
        <div className="flex items-center gap-2 bg-gray-700 p-1.5 rounded-lg border border-gray-600">
          <span className="text-gray-300 text-xs font-semibold px-2 border-r border-gray-600">Point Update</span>
          <input
            type="number"
            min={0}
            max={baseArray.length - 1}
            value={updateIdx}
            onChange={(e) => setUpdateIdx(e.target.value)}
            placeholder="Idx"
            disabled={isRunning}
            className="w-14 px-2 py-1 bg-gray-800 text-white rounded border border-transparent focus:border-blue-400 focus:outline-none text-sm"
          />
          <input
            type="number"
            value={updateVal}
            onChange={(e) => setUpdateVal(e.target.value)}
            placeholder="Val"
            disabled={isRunning}
            className="w-16 px-2 py-1 bg-gray-800 text-white rounded border border-transparent focus:border-blue-400 focus:outline-none text-sm"
          />
          <button
            onClick={handleUpdate}
            disabled={isRunning || updateIdx === '' || updateVal === ''}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm font-semibold transition-colors"
          >
            Update
          </button>
        </div>

        {/* Range Query */}
        <div className="flex items-center gap-2 bg-gray-700 p-1.5 rounded-lg border border-gray-600">
          <span className="text-gray-300 text-xs font-semibold px-2 border-r border-gray-600">Range Query</span>
          <input
            type="number"
            min={0}
            max={baseArray.length - 1}
            value={queryL}
            onChange={(e) => setQueryL(e.target.value)}
            placeholder="L"
            disabled={isRunning}
            className="w-14 px-2 py-1 bg-gray-800 text-white rounded border border-transparent focus:border-emerald-400 focus:outline-none text-sm"
          />
          <input
            type="number"
            min={0}
            max={baseArray.length - 1}
            value={queryR}
            onChange={(e) => setQueryR(e.target.value)}
            placeholder="R"
            disabled={isRunning}
            className="w-14 px-2 py-1 bg-gray-800 text-white rounded border border-transparent focus:border-emerald-400 focus:outline-none text-sm"
          />
          <button
            onClick={handleQuery}
            disabled={isRunning || queryL === '' || queryR === ''}
            className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm font-semibold transition-colors"
          >
            <Play size={14} /> Query
          </button>
        </div>

        <div className="flex-1" />

        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors text-sm ${
            showSettings ? 'bg-indigo-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
          }`}
        >
          <Settings size={14} /> Speed
        </button>

        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors text-sm ${
            showExplanation ? 'bg-blue-500 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
          }`}
        >
          <MessageSquare size={14} /> Log
        </button>
      </div>

      {/* Speed settings */}
      {showSettings && (
        <div className="bg-gray-700 p-3 flex items-center gap-3">
          <span className="text-white text-sm font-semibold">Animation Speed</span>
          <div className="flex gap-2">
            {Object.entries(SPEED_PRESETS).map(([name, value]) => (
              <button
                key={name}
                onClick={() => setSpeed(value)}
                className={`px-3 py-1 rounded text-sm ${
                  speed === value ? 'bg-indigo-500 text-white' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
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
        
        {/* Visualizations Container */}
        <div className="flex-1 flex flex-col bg-gray-950 overflow-hidden relative">
          
          {/* Base Array Representation */}
          <div className="h-20 border-b border-gray-800 flex flex-col items-center justify-center p-2">
            <div className="text-gray-400 text-[10px] font-semibold mb-1 tracking-wider uppercase">Base Array</div>
            <div className="flex items-center gap-1.5 overflow-x-auto w-full px-4 justify-center">
              {baseArray.length === 0 ? (
                 <span className="text-gray-600 text-sm">Empty</span>
              ) : (
                baseArray.map((val, idx) => {
                  // Determine if this array element is part of the current operation
                  let isTarget = false;
                  if (activeNode !== null) {
                    const node = treeData.nodes.find(n => n.id === activeNode);
                    if (node && idx >= node.l && idx <= node.r) isTarget = true;
                  }
                  
                  return (
                    <div key={`arr-${idx}`} className="flex flex-col items-center">
                      <div className={`w-10 h-10 flex items-center justify-center border-2 rounded ${isTarget ? 'bg-indigo-900/50 border-indigo-500 text-white scale-110' : 'bg-gray-800 border-gray-600 text-gray-300'} font-mono font-bold transition-all duration-300`}>
                        {val}
                      </div>
                      <div className="text-gray-500 text-[10px] mt-1">{idx}</div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* SVG Tree */}
          <div className="flex-1 overflow-auto relative p-4">
             {baseArray.length === 0 ? (
               <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-lg font-medium select-none">
                 Enter an array and click <span className="text-indigo-400 mx-1">Build</span>
               </div>
             ) : (
                <div style={{ minWidth: treeData.svgWidth || 800, minHeight: treeData.svgHeight || 460 }} className="flex items-center justify-center h-full">
                  <svg viewBox={`0 0 ${treeData.svgWidth || 800} ${treeData.svgHeight || 460}`} preserveAspectRatio="xMidYMid meet" className="w-full h-full">
                    <defs>
                      <filter id="seg-shadow" x="-30%" y="-30%" width="160%" height="160%">
                      <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.4" />
                    </filter>
                    <radialGradient id="seg-grad-default" cx="35%" cy="30%" r="65%">
                      <stop offset="0%" stopColor="#818cf8" />
                      <stop offset="100%" stopColor="#4f46e5" />
                    </radialGradient>
                    <radialGradient id="seg-grad-active" cx="35%" cy="30%" r="65%">
                      <stop offset="0%" stopColor="#fcd34d" />
                      <stop offset="100%" stopColor="#d97706" />
                    </radialGradient>
                    <radialGradient id="seg-grad-visited" cx="35%" cy="30%" r="65%">
                      <stop offset="0%" stopColor="#34d399" />
                      <stop offset="100%" stopColor="#059669" />
                    </radialGradient>
                    <radialGradient id="seg-grad-contributing" cx="35%" cy="30%" r="65%">
                      <stop offset="0%" stopColor="#6ee7b7" />
                      <stop offset="100%" stopColor="#10b981" />
                    </radialGradient>
                    <radialGradient id="seg-grad-propagating" cx="35%" cy="30%" r="65%">
                      <stop offset="0%" stopColor="#93c5fd" />
                      <stop offset="100%" stopColor="#2563eb" />
                    </radialGradient>
                  </defs>

                  {/* Edges */}
                  {treeData.edges.map((edge, i) => {
                    const fromState = getGradId(edge.from);
                    const toState = getGradId(edge.to);
                    const isActivePath = fromState !== 'seg-grad-default' && toState !== 'seg-grad-default';
                    
                    return (
                      <line
                        key={`edge-${i}`}
                        x1={edge.from.x}
                        y1={edge.from.y}
                        x2={edge.to.x}
                        y2={edge.to.y}
                        stroke={isActivePath ? '#fcd34d' : '#475569'}
                        strokeWidth={isActivePath ? 4 : 2}
                        className="transition-all duration-300"
                      />
                    );
                  })}

                  {/* Nodes */}
                  {treeData.nodes.map((node) => {
                    const gradId = getGradId(node);
                    const strokeClr = getStrokeColor(node);
                    const isHighlighted = gradId !== 'seg-grad-default';

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
                          r={35}
                          fill="none"
                          stroke={strokeClr}
                          strokeWidth={isHighlighted ? 3 : 1}
                          opacity={isHighlighted ? 0.6 : 0.1}
                          className="transition-all duration-300"
                        />

                        {/* Main shape - Rect for segment tree nodes to look different */}
                        <rect
                          x={node.x - 28}
                          y={node.y - 20}
                          width={56}
                          height={40}
                          rx={8}
                          fill={`url(#${gradId})`}
                          stroke={strokeClr}
                          strokeWidth={isHighlighted ? 2.5 : 1.5}
                          filter="url(#seg-shadow)"
                          className="transition-all duration-300"
                        />

                        {/* Value */}
                        <text
                          x={node.x}
                          y={node.y + 1}
                          textAnchor="middle"
                          dy=".38em"
                          fill="white"
                          fontSize="16"
                          fontWeight="800"
                          fontFamily="monospace"
                          style={{ textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}
                        >
                          {node.val}
                        </text>
                        
                        {/* Range Label underneath */}
                        <rect
                           x={node.x - 20}
                           y={node.y + 24}
                           width={40}
                           height={16}
                           rx={4}
                           fill="#1e293b"
                           opacity={0.9}
                        />
                        <text
                          x={node.x}
                          y={node.y + 35}
                          textAnchor="middle"
                          fill="#94a3b8"
                          fontSize="10"
                          fontWeight="700"
                          fontFamily="monospace"
                        >
                          [{node.l}-{node.r}]
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
             )}
          </div>
        </div>

        {/* Right Side: Log Panel */}
        {showExplanation && (
          <div className="w-80 bg-gray-900 border-l border-gray-700 flex flex-col">
            <div className="px-4 py-3 bg-gray-800 border-b border-gray-700 flex items-center gap-2">
              <MessageSquare size={16} className="text-blue-400" />
              <span className="text-white font-semibold text-sm">Algorithm Log</span>
              <button
                onClick={() => setLogs([])}
                className="ml-auto text-xs text-gray-400 hover:text-white transition-colors"
              >
                Clear
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5 text-xs font-mono">
              {logs.length === 0 && (
                <p className="text-gray-500 text-center mt-6">
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
      <div className="bg-gray-800 p-3 flex flex-wrap gap-4 justify-center text-sm rounded-b-lg border-t border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#6366f1' }} />
          <span className="text-white">Idle Node</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#eab308' }} />
          <span className="text-white">Active Path</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#10b981' }} />
          <span className="text-white">Contributing (Query)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3b82f6' }} />
          <span className="text-white">Propagating (Update)</span>
        </div>
      </div>
    </div>
  );
};

export default SegmentTreeVisualizer;
