import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Plus, Trash2, Search, Shuffle, RotateCcw, Settings, ChevronDown, ChevronUp, BarChart3, MessageSquare } from 'lucide-react';
import { SPEED_PRESETS } from '../utils/animationHelpers';
import {
  generateRandomBST,
  layoutTree,
  getTreeStats,
  bstInsertAnimated,
  bstSearchAnimated,
  bstDeleteAnimated,
} from '../algorithms/trees/bstOperations';

/* ------------------------------------------------------------------ */
/*  BSTVisualizer – fully interactive BST playground                  */
/* ------------------------------------------------------------------ */

const BSTVisualizer = () => {
  // Tree state
  const [bstRoot, setBstRoot] = useState(null);
  const [treeData, setTreeData] = useState({ nodes: [], edges: [] });
  const [stats, setStats] = useState({ height: 0, nodeCount: 0, min: '-', max: '-' });

  // Animation state
  const [activeNode, setActiveNode] = useState(null);
  const [visitedNodes, setVisitedNodes] = useState([]);
  const [foundNode, setFoundNode] = useState(null);
  const [deletingNode, setDeletingNode] = useState(null);
  const [successorNode, setSuccessorNode] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  // UI state
  const [inputValue, setInputValue] = useState('');
  const [speed, setSpeed] = useState(SPEED_PRESETS.MEDIUM);
  const [showSettings, setShowSettings] = useState(false);
  const [showExplanation, setShowExplanation] = useState(true);
  const [showStats, setShowStats] = useState(true);
  const [logs, setLogs] = useState([]);

  const logEndRef = useRef(null);

  // Refresh layout & stats whenever root changes
  const refreshTree = useCallback((root) => {
    const layout = layoutTree(root);
    setTreeData(layout);
    setStats(getTreeStats(root));
  }, []);

  // Initialize with a random BST
  useEffect(() => {
    handleRandomTree();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll log panel
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
    setFoundNode(null);
    setDeletingNode(null);
    setSuccessorNode(null);
  };

  const parsedValue = () => {
    const v = parseInt(inputValue, 10);
    if (isNaN(v) || v < 1 || v > 999) return null;
    return v;
  };

  /* ---------- operations ---------- */

  const handleRandomTree = () => {
    if (isRunning) return;
    clearAnimation();
    const root = generateRandomBST(7, 5, 95);
    setBstRoot(root);
    refreshTree(root);
    setLogs([{ type: 'info', text: 'Generated a random BST with 7 nodes.', ts: Date.now() }]);
  };

  const handleReset = () => {
    if (isRunning) return;
    clearAnimation();
    setBstRoot(null);
    setTreeData({ nodes: [], edges: [] });
    setStats({ height: 0, nodeCount: 0, min: '-', max: '-' });
    setLogs([{ type: 'info', text: 'Tree cleared.', ts: Date.now() }]);
  };

  const handleInsert = async () => {
    const val = parsedValue();
    if (val === null || isRunning) return;
    setIsRunning(true);
    clearAnimation();

    const newRoot = await bstInsertAnimated(bstRoot, val, {
      setActiveNode,
      setVisitedNodes,
      addLog,
      speed,
    });

    setBstRoot(newRoot);
    refreshTree(newRoot);
    clearAnimation();
    setIsRunning(false);
    setInputValue('');
  };

  const handleSearch = async () => {
    const val = parsedValue();
    if (val === null || isRunning) return;
    setIsRunning(true);
    clearAnimation();

    await bstSearchAnimated(bstRoot, val, {
      setActiveNode,
      setVisitedNodes,
      setFoundNode,
      addLog,
      speed,
    });

    setIsRunning(false);
  };

  const handleDelete = async () => {
    const val = parsedValue();
    if (val === null || isRunning) return;
    setIsRunning(true);
    clearAnimation();

    const newRoot = await bstDeleteAnimated(bstRoot, val, {
      setActiveNode,
      setVisitedNodes,
      setDeletingNode,
      setSuccessorNode,
      addLog,
      speed,
    });

    setBstRoot(newRoot);
    refreshTree(newRoot);
    clearAnimation();
    setIsRunning(false);
    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isRunning) {
      handleInsert();
    }
  };

  /* ---------- node colour logic ---------- */

  const getGradId = (id) => {
    if (deletingNode === id) return 'grad-deleting';
    if (successorNode === id) return 'grad-successor';
    if (foundNode === id) return 'grad-found';
    if (activeNode === id) return 'grad-active';
    if (visitedNodes.includes(id)) return 'grad-visited';
    return 'grad-default';
  };

  const getStrokeColor = (id) => {
    if (deletingNode === id) return '#fecaca';
    if (successorNode === id) return '#e9d5ff';
    if (foundNode === id) return '#bbf7d0';
    if (activeNode === id) return '#fef3c7';
    if (visitedNodes.includes(id)) return '#a7f3d0';
    return '#bfdbfe';
  };

  /* ---------- log entry styling ---------- */

  const logColor = (type) => {
    switch (type) {
      case 'start': return 'text-blue-400';
      case 'compare': return 'text-amber-300';
      case 'success': return 'text-emerald-400';
      case 'error': return 'text-red-400';
      case 'warn': return 'text-yellow-400';
      case 'delete': return 'text-rose-400';
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
      case 'delete': return '🗑';
      case 'info':
      default: return 'ℹ';
    }
  };

  /* ---------- render ---------- */

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-3 rounded-t-lg shadow-lg flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">BST Operations</h2>
          <p className="text-xs opacity-90 mt-0.5">
            Insert, Search &amp; Delete with step‑by‑step animation
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <div className="bg-white/20 px-2.5 py-1 rounded-full">
            <span className="font-semibold">Time:</span> O(h)
          </div>
          <div className="bg-white/20 px-2.5 py-1 rounded-full">
            <span className="font-semibold">Space:</span> O(1)
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 p-4 flex flex-wrap items-center gap-3">
        {/* Value input */}
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            min={1}
            max={999}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Value (1–999)"
            disabled={isRunning}
            className="w-32 px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-emerald-400 focus:outline-none text-sm placeholder-gray-400 disabled:opacity-50"
          />
        </div>

        {/* Operation buttons */}
        <button
          onClick={handleInsert}
          disabled={isRunning || !parsedValue()}
          className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg font-semibold transition-colors text-sm"
        >
          <Plus size={16} />
          Insert
        </button>

        <button
          onClick={handleSearch}
          disabled={isRunning || !parsedValue() || !bstRoot}
          className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg font-semibold transition-colors text-sm"
        >
          <Search size={16} />
          Search
        </button>

        <button
          onClick={handleDelete}
          disabled={isRunning || !parsedValue() || !bstRoot}
          className="flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg font-semibold transition-colors text-sm"
        >
          <Trash2 size={16} />
          Delete
        </button>

        <div className="h-6 w-px bg-gray-600 mx-1" />

        {/* Random & Reset */}
        <button
          onClick={handleRandomTree}
          disabled={isRunning}
          className="flex items-center gap-1.5 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg font-semibold transition-colors text-sm"
        >
          <Shuffle size={16} />
          Random Tree
        </button>

        <button
          onClick={handleReset}
          disabled={isRunning}
          className="flex items-center gap-1.5 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg font-semibold transition-colors text-sm"
        >
          <RotateCcw size={16} />
          Reset
        </button>

        <div className="h-6 w-px bg-gray-600 mx-1" />

        {/* Toggles */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold transition-colors text-sm ${
            showSettings ? 'bg-purple-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
          }`}
        >
          <Settings size={16} />
          Speed
        </button>

        <button
          onClick={() => setShowStats(!showStats)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold transition-colors text-sm ${
            showStats ? 'bg-cyan-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
          }`}
        >
          <BarChart3 size={16} />
          Stats
        </button>

        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold transition-colors text-sm ${
            showExplanation ? 'bg-indigo-500 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
          }`}
        >
          <MessageSquare size={16} />
          Log
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
                  speed === value ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                }`}
              >
                {name.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tree stats bar */}
      {showStats && (
        <div className="bg-gray-800/80 border-t border-gray-700 px-5 py-2 flex flex-wrap gap-5 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Nodes:</span>
            <span className="text-white font-bold">{stats.nodeCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Height:</span>
            <span className="text-white font-bold">{stats.height}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Min:</span>
            <span className="text-emerald-400 font-bold">{stats.min}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Max:</span>
            <span className="text-rose-400 font-bold">{stats.max}</span>
          </div>
        </div>
      )}

      {/* Main content: Tree SVG + Explanation log */}
      <div className="flex-1 flex overflow-hidden">
        {/* SVG Tree */}
        <div className="flex-1 bg-gray-950 flex items-center justify-center p-2 overflow-hidden relative">
          {treeData.nodes.length === 0 ? (
            <div className="text-gray-500 text-lg font-medium select-none">
              Enter a value and click <span className="text-emerald-400">Insert</span> or press{' '}
              <span className="text-emerald-400">Random Tree</span>
            </div>
          ) : (
            <svg viewBox="0 0 1100 460" preserveAspectRatio="xMidYMid meet" className="w-full h-full">
              <defs>
                <filter id="bst-shadow" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.45" />
                </filter>
                <filter id="bst-glow" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                {/* Gradient fills */}
                <radialGradient id="grad-default" cx="35%" cy="30%" r="65%">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#2563eb" />
                </radialGradient>
                <radialGradient id="grad-visited" cx="35%" cy="30%" r="65%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#059669" />
                </radialGradient>
                <radialGradient id="grad-active" cx="35%" cy="30%" r="65%">
                  <stop offset="0%" stopColor="#fcd34d" />
                  <stop offset="100%" stopColor="#d97706" />
                </radialGradient>
                <radialGradient id="grad-found" cx="35%" cy="30%" r="65%">
                  <stop offset="0%" stopColor="#6ee7b7" />
                  <stop offset="100%" stopColor="#10b981" />
                </radialGradient>
                <radialGradient id="grad-deleting" cx="35%" cy="30%" r="65%">
                  <stop offset="0%" stopColor="#fca5a5" />
                  <stop offset="100%" stopColor="#ef4444" />
                </radialGradient>
                <radialGradient id="grad-successor" cx="35%" cy="30%" r="65%">
                  <stop offset="0%" stopColor="#c4b5fd" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </radialGradient>
              </defs>

              {/* Edges */}
              {treeData.edges.map((edge, i) => {
                const fromActive = activeNode === edge.from.id || visitedNodes.includes(edge.from.id);
                const toActive = activeNode === edge.to.id;
                return (
                  <line
                    key={`edge-${i}`}
                    x1={edge.from.x}
                    y1={edge.from.y}
                    x2={edge.to.x}
                    y2={edge.to.y}
                    stroke={fromActive && toActive ? '#fbbf24' : '#64748b'}
                    strokeWidth={fromActive && toActive ? 4 : 3}
                    strokeLinecap="round"
                    className="transition-all duration-300"
                  />
                );
              })}

              {/* Nodes */}
              {treeData.nodes.map((node) => {
                const gradId = getGradId(node.id);
                const strokeClr = getStrokeColor(node.id);
                const isHighlighted = activeNode === node.id || foundNode === node.id || deletingNode === node.id || successorNode === node.id;

                return (
                  <g
                    key={`node-${node.id}`}
                    className="cursor-pointer"
                    style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                  >
                    {/* Ambient glow ring */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={48}
                      fill="none"
                      stroke={strokeClr}
                      strokeWidth={isHighlighted ? 3 : 1.5}
                      opacity={isHighlighted ? 0.6 : 0.25}
                      className="transition-all duration-300"
                    />

                    {/* Main circle */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={38}
                      fill={`url(#${gradId})`}
                      stroke={strokeClr}
                      strokeWidth={isHighlighted ? 3.5 : 2}
                      filter="url(#bst-shadow)"
                      className="transition-all duration-300"
                    />

                    {/* Value */}
                    <text
                      x={node.x}
                      y={node.y}
                      textAnchor="middle"
                      dy=".38em"
                      fill="white"
                      fontSize="22"
                      fontWeight="800"
                      fontFamily="monospace"
                      style={{ textShadow: '0 1px 3px rgba(0,0,0,0.6)', letterSpacing: '-0.5px' }}
                    >
                      {node.val}
                    </text>
                  </g>
                );
              })}
            </svg>
          )}
        </div>

        {/* Explanation / Log Panel */}
        {showExplanation && (
          <div className="w-80 bg-gray-900 border-l border-gray-700 flex flex-col">
            <div className="px-4 py-3 bg-gray-800 border-b border-gray-700 flex items-center gap-2">
              <MessageSquare size={16} className="text-indigo-400" />
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
      <div className="bg-gray-800 p-3 flex flex-wrap gap-4 justify-center text-sm rounded-b-lg">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3b82f6' }} />
          <span className="text-white">Unvisited</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f59e0b' }} />
          <span className="text-white">Visiting</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#10b981' }} />
          <span className="text-white">Visited / Found</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ef4444' }} />
          <span className="text-white">Deleting</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#8b5cf6' }} />
          <span className="text-white">Successor</span>
        </div>
      </div>
    </div>
  );
};

export default BSTVisualizer;
