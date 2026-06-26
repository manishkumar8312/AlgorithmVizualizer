import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Settings, BookOpen } from 'lucide-react';
import { SPEED_PRESETS, COLORS } from '../utils/animationHelpers';
import ExplanationPanel from './educational/ExplanationPanel';
import { algorithmDatabase } from '../data/algorithmData';

// Helper to generate a complete binary tree with coordinates
const generateTree = (depth = 3) => {
  let idCounter = 1;
  const nodes = [];
  const edges = [];
  const yOffset = 115;
  const startY = 75;

  const buildTree = (level, x, y, horizontalSpacing) => {
    if (level > depth) return null;

    const node = {
      id: idCounter++,
      x,
      y,
      val: Math.floor(Math.random() * 90) + 10,
      left: null,
      right: null
    };

    nodes.push(node);

    if (level < depth) {
      node.left = buildTree(level + 1, x - horizontalSpacing, y + yOffset, horizontalSpacing / 2);
      node.right = buildTree(level + 1, x + horizontalSpacing, y + yOffset, horizontalSpacing / 2);

      if (node.left) {
        edges.push({ from: node, to: node.left });
      }
      if (node.right) {
        edges.push({ from: node, to: node.right });
      }
    }

    return node;
  };

  const root = buildTree(0, 550, startY, 210);

  return { root, nodes, edges };
};

const TreeVisualizer = ({ algorithm, algorithmInfo }) => {
  const [treeData, setTreeData] = useState({ root: null, nodes: [], edges: [] });
  const [activeNode, setActiveNode] = useState(null);
  const [visitedNodes, setVisitedNodes] = useState([]);
  const [isTraversing, setIsTraversing] = useState(false);
  const [speed, setSpeed] = useState(SPEED_PRESETS.FAST);
  const [showSettings, setShowSettings] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    resetTree();
  }, []);

  const resetTree = () => {
    if (isTraversing) return;
    setTreeData(generateTree(3));
    setActiveNode(null);
    setVisitedNodes([]);
  };

  const handleTraverse = async () => {
    if (isTraversing || !treeData.root) return;
    setIsTraversing(true);
    setVisitedNodes([]);
    setActiveNode(null);

    if (algorithmInfo && algorithmInfo.inputRequired) {
      await algorithm(treeData.root, algorithmInfo.inputValue, setActiveNode, setVisitedNodes, speed);
    } else {
      await algorithm(treeData.root, setActiveNode, setVisitedNodes, speed);
    }

    setActiveNode(null);
    setIsTraversing(false);
  };

  const getNodeColor = (id) => {
    if (activeNode === id) return COLORS.COMPARING; // Often yellow/orange
    if (visitedNodes.includes(id)) return COLORS.SORTED; // Often green
    return COLORS.DEFAULT; // Often purple/blue
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-white rounded-3xl overflow-hidden">
      {/* Algorithm Info Header – compact to give tree more room */}
      <div className="bg-white border-b border-slate-200 px-6 py-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{algorithmInfo.name}</h2>
          <p className="text-[13px] text-slate-500 leading-relaxed mt-0.5">{algorithmInfo.description}</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <div className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md font-medium border border-blue-100">
            <span className="font-semibold">Time:</span> {algorithmInfo.timeComplexity}
          </div>
          <div className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md font-medium border border-blue-100">
            <span className="font-semibold">Space:</span> {algorithmInfo.spaceComplexity}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-wrap items-center gap-3">
        <button
          onClick={handleTraverse}
          disabled={isTraversing}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm shadow-blue-600/20"
        >
          <Play size={18} />
          Start Traversal
        </button>

        <button
          onClick={resetTree}
          disabled={isTraversing}
          className="flex items-center gap-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <RotateCcw size={18} />
          New Tree
        </button>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors border ${
            showSettings
              ? 'bg-blue-100 border-blue-300 text-blue-700'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Settings size={18} />
          Settings
        </button>

        <div className="h-6 w-px bg-slate-200 mx-2" />

        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors border ${
            showExplanation
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
          title="Algorithm Explanation"
        >
          <BookOpen size={18} />
          Info
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-4">
          <label className="text-slate-700 text-[11px] font-bold uppercase tracking-wider mb-2 block">Animation Speed</label>
          <div className="flex gap-2">
            {Object.entries(SPEED_PRESETS).map(([name, value]) => (
              <button
                key={name}
                onClick={() => setSpeed(value)}
                className={`px-3 py-1 rounded border text-sm font-medium transition-colors ${
                  speed === value
                    ? 'bg-blue-600 text-white shadow-sm border-blue-600'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {name.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Visualization Area */}
      <div className="flex-1 bg-slate-50 flex items-center justify-center p-4 overflow-hidden relative">
        <svg viewBox="0 0 1100 460" preserveAspectRatio="xMidYMid meet" className="w-full h-full">
          <defs>
            {/* Drop shadow filter for nodes */}
            <filter id="node-shadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#94a3b8" floodOpacity="0.3" />
            </filter>
            {/* Glow filter for active node */}
            <filter id="node-glow" x="-40%" y="-40%" width="180%" height="180%">
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
          </defs>

          {/* Draw Edges – thicker, lighter colour for visibility */}
          {treeData.edges.map((edge, index) => (
            <line
              key={`edge-${index}`}
              x1={edge.from.x}
              y1={edge.from.y}
              x2={edge.to.x}
              y2={edge.to.y}
              stroke="#cbd5e1"
              strokeWidth="3"
              strokeLinecap="round"
            />
          ))}

          {/* Draw Nodes */}
          {treeData.nodes.map((node) => {
            const isVisited = visitedNodes.includes(node.id);
            const isActive  = activeNode === node.id;
            const gradId    = isActive ? 'grad-active' : isVisited ? 'grad-visited' : 'grad-default';
            const strokeClr = isActive ? '#fef3c7' : isVisited ? '#a7f3d0' : '#bfdbfe';

            return (
              <g
                key={`node-${node.id}`}
                className="cursor-pointer"
                style={{ transformOrigin: `${node.x}px ${node.y}px` }}
              >
                {/* Soft ambient glow ring */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={48}
                  fill="none"
                  stroke={strokeClr}
                  strokeWidth={isActive ? 3 : 1.5}
                  opacity={isActive ? 0.6 : 0.25}
                />

                {/* Main node – r=38 (compact but readable) */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={38}
                  fill={`url(#${gradId})`}
                  stroke={strokeClr}
                  strokeWidth={isActive ? 3.5 : 2}
                  filter="url(#node-shadow)"
                  className="transition-all duration-300"
                />

                {/* Node value */}
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
      </div>

      {/* Legend */}
      <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex flex-wrap gap-6 justify-center text-[12px] font-medium text-slate-600 rounded-b-lg">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-sm shadow-sm" style={{ backgroundColor: '#3b82f6' }}></div>
          <span>Unvisited</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-sm shadow-sm" style={{ backgroundColor: '#f59e0b' }}></div>
          <span>Processing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-sm shadow-sm" style={{ backgroundColor: '#10b981' }}></div>
          <span>Visited</span>
        </div>
      </div>

      <ExplanationPanel
        algorithmInfo={algorithmInfo}
        isOpen={showExplanation}
        onClose={() => setShowExplanation(false)}
      />
    </div>
  );
};

export default TreeVisualizer;
