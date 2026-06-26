import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Play, Pause, RotateCcw, FastForward, Settings, MessageSquare, List } from 'lucide-react';
import { SPEED_PRESETS } from '../utils/animationHelpers';
import {
  runFactorialTrace,
  runFibonacciTrace,
  runPermutationsTrace,
  runCombinationSumTrace,
  runGenerateParenthesesTrace,
  runSubsetsTrace
} from '../algorithms/recursion/engine';
import { recursionAlgorithmsData } from '../data/recursionAlgorithms';

/* ------------------------------------------------------------------ */
/*  Tree Layout Helper                                                */
/* ------------------------------------------------------------------ */

// Builds a tree of nodes from the trace.
// We do a full pass over the trace to find all CALL events and establish parent-child relationships.
function computeTreeLayout(trace, svgWidth = 1100, svgHeight = 500) {
  if (!trace || trace.length === 0) return { nodes: [], edges: [], finalWidth: svgWidth, finalHeight: svgHeight };

  const nodeMap = new Map();
  const rootNodes = [];
  let maxNodeWidth = 80;

  trace.forEach(step => {
    if (step.type === 'CALL') {
      if (!nodeMap.has(step.nodeId)) {
        const argLength = step.callArgs ? step.callArgs.length : 10;
        const nodeW = Math.max(80, argLength * 8 + 20);
        if (nodeW > maxNodeWidth) maxNodeWidth = nodeW;

        const newNode = {
          id: step.nodeId,
          parentId: step.parentId,
          callArgs: step.callArgs,
          depth: step.depth,
          children: [],
          x: 0,
          y: 0,
          leafWidth: 0,
          nodeWidth: nodeW
        };
        nodeMap.set(step.nodeId, newNode);

        if (step.parentId === null) {
          rootNodes.push(newNode);
        } else {
          const parent = nodeMap.get(step.parentId);
          if (parent && !parent.children.includes(newNode)) {
            parent.children.push(newNode);
          }
        }
      }
    }
  });

  // Calculate widths for n-ary tree
  let maxDepth = 0;
  function computeWidths(node) {
    if (node.depth > maxDepth) maxDepth = node.depth;
    if (node.children.length === 0) {
      node.leafWidth = 1;
      return 1;
    }
    let w = 0;
    node.children.forEach(c => { w += computeWidths(c); });
    node.leafWidth = w;
    return w;
  }

  rootNodes.forEach(computeWidths);

  const padY = 60;
  const padX = 60;
  const yGap = 90;
  const leafSpacing = Math.max(120, maxNodeWidth + 40); // Need wider spacing for dynamic node width

  const nodes = [];
  const edges = [];

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  function assignCoords(node, currentX) {
    node.y = padY + node.depth * yGap;
    
    // x is the center of its allocated leaf bounds
    const allocatedW = node.leafWidth * leafSpacing;
    node.x = currentX + (node.leafWidth === 1 ? 0 : (allocatedW - leafSpacing) / 2);
    
    const halfW = node.nodeWidth / 2;
    minX = Math.min(minX, node.x - halfW - 20); // 20px extra padding for glow/shadow
    maxX = Math.max(maxX, node.x + halfW + 20);
    minY = Math.min(minY, node.y - 30);
    maxY = Math.max(maxY, node.y + 30);

    nodes.push(node);

    let childX = currentX;
    node.children.forEach(child => {
      edges.push({ from: node.id, to: child.id });
      assignCoords(child, childX);
      childX += child.leafWidth * leafSpacing;
    });
  }

  let currX = 0;
  rootNodes.forEach(root => {
    assignCoords(root, currX);
    currX += root.leafWidth * leafSpacing;
  });

  let finalWidth = 800;
  let finalHeight = 460;

  if (nodes.length > 0) {
    const treeActualWidth = maxX - minX;
    finalWidth = Math.max(800, treeActualWidth + padX * 2);
    finalHeight = Math.max(460, maxY + padY);

    const shiftX = (finalWidth - treeActualWidth) / 2 - minX;
    nodes.forEach(n => { n.x += shiftX; });
  }

  return { nodes, edges, finalWidth, finalHeight };
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

const TreeRecursionVisualizer = ({ algorithmId }) => {
  // Config state
  const [inputValue, setInputValue] = useState('');
  
  // Simulation State
  const [trace, setTrace] = useState([]);
  const [treeLayout, setTreeLayout] = useState({ nodes: [], edges: [], finalWidth: 800, finalHeight: 460 });
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(SPEED_PRESETS.MEDIUM);
  
  // UI Panels
  const [showSettings, setShowSettings] = useState(false);

  // Derived state for the current step
  const currentStep = currentStepIndex >= 0 && currentStepIndex < trace.length ? trace[currentStepIndex] : null;

  // Refs for auto-scroll and animation
  const timerRef = useRef(null);

  // Update default input based on algorithm
  useEffect(() => {
    switch (algorithmId) {
      case 'factorial': setInputValue('5'); break;
      case 'fibonacci': setInputValue('4'); break;
      case 'permutations': setInputValue('1,2,3'); break;
      case 'combinationSum': setInputValue('2,3,6,7; 7'); break; // array; target
      case 'generateParentheses': setInputValue('3'); break;
      case 'subsets': setInputValue('1,2,3'); break;
      default: setInputValue('5');
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
      if (algorithmId === 'factorial') {
        newTrace = runFactorialTrace(parseInt(inputValue, 10));
      } else if (algorithmId === 'fibonacci') {
        newTrace = runFibonacciTrace(parseInt(inputValue, 10));
      } else if (algorithmId === 'permutations') {
        const arr = inputValue.split(',').map(s => s.trim());
        newTrace = runPermutationsTrace(arr).trace;
      } else if (algorithmId === 'combinationSum') {
        const parts = inputValue.split(';');
        const arr = parts[0].split(',').map(Number);
        const target = parseInt(parts[1], 10);
        newTrace = runCombinationSumTrace(arr, target).trace;
      } else if (algorithmId === 'generateParentheses') {
        newTrace = runGenerateParenthesesTrace(parseInt(inputValue, 10)).trace;
      } else if (algorithmId === 'subsets') {
        const arr = inputValue.split(',').map(s => s.trim());
        newTrace = runSubsetsTrace(arr).trace;
      }
    } catch (e) {
      console.error(e);
      return;
    }

    setTrace(newTrace);
    setTreeLayout(computeTreeLayout(newTrace));
    setCurrentStepIndex(0);
    setIsPlaying(true);
  };

  const handleReset = () => {
    setIsPlaying(false);
    clearInterval(timerRef.current);
    setTrace([]);
    setTreeLayout({ nodes: [], edges: [], finalWidth: 800, finalHeight: 460 });
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

  // Compute which nodes and edges are visible based on the current trace index.
  // A node is visible if it was CALLed before or at the current step.
  // An edge is visible if the target node is visible.
  const visibleNodesMap = useMemo(() => {
    const map = new Map();
    for (let i = 0; i <= currentStepIndex; i++) {
      if (trace[i]) {
        // Track the latest state of each node
        map.set(trace[i].nodeId, trace[i]); 
      }
    }
    return map;
  }, [trace, currentStepIndex]);

  // Which node is currently active?
  const activeNodeId = currentStep ? currentStep.nodeId : null;

  const getGradId = (nodeId) => {
    if (nodeId === activeNodeId) return 'rec-grad-active';
    const state = visibleNodesMap.get(nodeId);
    if (!state) return 'rec-grad-default';
    if (state.type === 'SUCCESS' || state.type === 'RETURN') return 'rec-grad-success';
    if (state.type === 'BACKTRACK') return 'rec-grad-backtrack';
    return 'rec-grad-visited'; // ongoing CALL
  };

  const getStrokeColor = (nodeId) => {
    if (nodeId === activeNodeId) return '#fef3c7'; // yellow
    const state = visibleNodesMap.get(nodeId);
    if (!state) return '#bfdbfe';
    if (state.type === 'SUCCESS' || state.type === 'RETURN') return '#bbf7d0'; // green
    if (state.type === 'BACKTRACK') return '#fecaca'; // red
    return '#a7f3d0';
  };

  const logColor = (type) => {
    switch (type) {
      case 'CALL': return 'text-blue-400';
      case 'RETURN': return 'text-purple-400';
      case 'SUCCESS': return 'text-emerald-400';
      case 'BACKTRACK': return 'text-rose-400';
      default: return 'text-gray-300';
    }
  };

  const meta = recursionAlgorithmsData[algorithmId] || {};

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-3 rounded-t-lg shadow-lg flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">{meta.name || "Recursion Tree"}</h2>
          <p className="text-xs opacity-90 mt-0.5">
            Visualize the Call Stack and Backtracking paths
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
            placeholder="Input args"
            className="w-32 px-2 py-1 bg-slate-50 dark:bg-slate-600 text-slate-800 dark:text-white rounded border border-transparent focus:border-blue-400 focus:outline-none text-sm"
          />
        </div>

        <button
          onClick={handleRun}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 shadow-sm text-white px-4 py-1.5 rounded-lg font-semibold transition-colors text-sm"
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
        
        {/* SVG Tree View */}
        <div 
          className="flex-1 relative overflow-auto custom-scrollbar dark:bg-slate-900"
          style={{ backgroundColor: '#f8fafc', backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        >
          {trace.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center text-slate-500 dark:text-slate-400 text-lg font-medium select-none">
              Click <span className="text-blue-600 mx-1">Run</span> to trace recursion tree
            </div>
          ) : (
            <div style={{ minWidth: treeLayout.finalWidth, minHeight: treeLayout.finalHeight, padding: '16px' }}>
              <svg
                width={treeLayout.finalWidth}
                height={treeLayout.finalHeight}
                viewBox={`0 0 ${treeLayout.finalWidth} ${treeLayout.finalHeight}`}
              >
                <defs>
                  <filter id="rec-shadow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.4" />
                  </filter>
                  <radialGradient id="rec-grad-default" cx="35%" cy="30%" r="65%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#2563eb" />
                  </radialGradient>
                  <radialGradient id="rec-grad-visited" cx="35%" cy="30%" r="65%">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#4f46e5" />
                  </radialGradient>
                  <radialGradient id="rec-grad-active" cx="35%" cy="30%" r="65%">
                    <stop offset="0%" stopColor="#fcd34d" />
                    <stop offset="100%" stopColor="#d97706" />
                  </radialGradient>
                  <radialGradient id="rec-grad-success" cx="35%" cy="30%" r="65%">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#059669" />
                  </radialGradient>
                  <radialGradient id="rec-grad-backtrack" cx="35%" cy="30%" r="65%">
                    <stop offset="0%" stopColor="#fca5a5" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </radialGradient>
                </defs>

                {/* Edges */}
                {treeLayout.edges.map((edge, i) => {
                  const toNodeVisible = visibleNodesMap.has(edge.to);
                  if (!toNodeVisible) return null;

                  const toState = visibleNodesMap.get(edge.to);
                  const isBacktracking = toState && toState.type === 'BACKTRACK';
                  const isReturned = toState && (toState.type === 'SUCCESS' || toState.type === 'RETURN');
                  const isActive = activeNodeId === edge.to || activeNodeId === edge.from;

                  const fromNode = treeLayout.nodes.find(n => n.id === edge.from);
                  const toNode = treeLayout.nodes.find(n => n.id === edge.to);

                  let stroke = '#cbd5e1';
                  if (isActive) stroke = '#fcd34d';
                  else if (isBacktracking) stroke = '#ef4444';
                  else if (isReturned) stroke = '#10b981';
                  else stroke = '#3b82f6';

                  return (
                    <line
                      key={`edge-${i}`}
                      x1={fromNode.x}
                      y1={fromNode.y}
                      x2={toNode.x}
                      y2={toNode.y}
                      stroke={stroke}
                      strokeWidth={isActive ? 4 : 2}
                      strokeDasharray={isBacktracking ? "5,5" : "none"}
                      className="transition-all duration-300"
                    />
                  );
                })}

                {/* Nodes */}
                {treeLayout.nodes.map((node) => {
                  const isVisible = visibleNodesMap.has(node.id);
                  if (!isVisible) return null;

                  const gradId = getGradId(node.id);
                  const strokeClr = getStrokeColor(node.id);
                  const isHighlighted = activeNodeId === node.id;
                  const nodeState = visibleNodesMap.get(node.id);

                  // Extract return value if present
                  const retVal = nodeState?.returnValue;

                  return (
                    <g
                      key={`node-${node.id}`}
                      style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                    >
                      {/* Glow ring */}
                      <rect
                        x={node.x - (node.nodeWidth / 2) - 5}
                        y={node.y - 25}
                        width={node.nodeWidth + 10}
                        height={50}
                        rx={10}
                        fill="none"
                        stroke={strokeClr}
                        strokeWidth={isHighlighted ? 4 : 1}
                        opacity={isHighlighted ? 0.6 : 0.1}
                        className="transition-all duration-300"
                      />

                      {/* Main shape */}
                      <rect
                        x={node.x - (node.nodeWidth / 2)}
                        y={node.y - 20}
                        width={node.nodeWidth}
                        height={40}
                        rx={8}
                        fill={`url(#${gradId})`}
                        stroke={strokeClr}
                        strokeWidth={isHighlighted ? 2 : 1}
                        filter="url(#rec-shadow)"
                        className="transition-all duration-300"
                      />

                      {/* Value (Call Args) */}
                      <text
                        x={node.x}
                        y={node.y + 1}
                        textAnchor="middle"
                        dy=".35em"
                        fill="white"
                        fontSize="12"
                        fontWeight="700"
                        fontFamily="monospace"
                        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
                      >
                        {node.callArgs}
                      </text>

                      {/* Return Value badge */}
                      {retVal && (
                        <g transform={`translate(${node.x + (node.nodeWidth / 2) - 10}, ${node.y - 15})`}>
                          <circle cx={0} cy={0} r={12} fill="#1e293b" stroke="#10b981" strokeWidth={1.5} />
                          <text x={0} y={0} textAnchor="middle" dy=".3em" fill="#10b981" fontSize="10" fontWeight="bold">
                            {retVal === 'null' ? '∅' : retVal.substring(0, 3)}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          )}
        </div>

        {/* Right Side: Call Stack & Logs (Removed) */}
      </div>

      {/* Legend */}
      <div className="bg-slate-50 dark:bg-slate-800 p-3 flex flex-wrap gap-4 justify-center text-sm rounded-b-lg border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3b82f6' }} />
          <span className="text-slate-600 dark:text-slate-300">Active Frame</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#10b981' }} />
          <span className="text-slate-600 dark:text-slate-300">Returned / Success</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 border-[#ef4444] border-dashed bg-transparent" />
          <span className="text-slate-600 dark:text-slate-300">Backtracked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#fcd34d' }} />
          <span className="text-slate-600 dark:text-slate-300">Current Executing</span>
        </div>
      </div>
    </div>
  );
};

export default TreeRecursionVisualizer;
