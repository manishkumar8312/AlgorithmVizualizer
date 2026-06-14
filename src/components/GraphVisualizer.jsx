import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, ArrowRight, Plus, Trash2, HelpCircle, Shuffle, ChevronLeft, ChevronRight } from 'lucide-react';
import { COLORS } from '../utils/animationHelpers';
import * as GraphAlgos from '../utils/GraphAlgorithms';

// Algorithm details including description, complexity, etc.
const ALGORITHM_DETAILS = {
  'BFS': {
    name: 'Breadth-First Search (BFS)',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    description: 'Explores neighbors level-by-level using a Queue. Finds shortest paths in unweighted graphs.',
    generator: GraphAlgos.generateBFS,
    needsSource: true,
    needsTarget: true,
  },
  'DFS': {
    name: 'Depth-First Search (DFS)',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    description: 'Explores as deep as possible along each branch before backtracking. Uses a Stack or Recursion.',
    generator: GraphAlgos.generateDFS,
    needsSource: true,
    needsTarget: true,
  },
  'Dijkstra': {
    name: "Dijkstra's Algorithm",
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
    description: 'Finds the single-source shortest path in weighted graphs with non-negative weights.',
    generator: GraphAlgos.generateDijkstra,
    needsSource: true,
    needsTarget: true,
  },
  'Bellman-Ford': {
    name: 'Bellman-Ford Algorithm',
    timeComplexity: 'O(V × E)',
    spaceComplexity: 'O(V)',
    description: 'Finds the single-source shortest path in graphs. Detects negative weight cycles.',
    generator: GraphAlgos.generateBellmanFord,
    needsSource: true,
    needsTarget: true,
  },
  'Floyd-Warshall': {
    name: 'Floyd-Warshall Algorithm',
    timeComplexity: 'O(V³)',
    spaceComplexity: 'O(V²)',
    description: 'All-pairs shortest path algorithm. Computes shortest paths between all pairs of nodes.',
    generator: GraphAlgos.generateFloydWarshall,
    needsSource: true,
    needsTarget: true,
  },
  'Prim\'s MST': {
    name: "Prim's Minimum Spanning Tree",
    timeComplexity: 'O(E log V)',
    spaceComplexity: 'O(V)',
    description: 'Grows a Minimum Spanning Tree from a starting node by greedily adding the cheapest cut edge.',
    generator: GraphAlgos.generatePrim,
    needsSource: false,
    needsTarget: false,
    undirectedOnly: true,
  },
  'Kruskal\'s MST': {
    name: "Kruskal's Minimum Spanning Tree",
    timeComplexity: 'O(E log E)',
    spaceComplexity: 'O(V)',
    description: 'Finds a Minimum Spanning Tree by sorting edges by weight and unioning disjoint components.',
    generator: GraphAlgos.generateKruskal,
    needsSource: false,
    needsTarget: false,
    undirectedOnly: true,
  },
  'Topological Sort': {
    name: 'Topological Sort',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    description: 'Linear ordering of vertices such that for every directed edge u → v, u comes before v in the ordering. Requires a DAG.',
    generator: GraphAlgos.generateTopologicalSort,
    needsSource: false,
    needsTarget: false,
    directedOnly: true,
  }
};

const GraphVisualizer = ({ algorithm: legacyAlgo, algorithmInfo }) => {
  // Read algorithm type from context. Fall back to Dijkstra if not found.
  const currentAlgoKey = Object.keys(ALGORITHM_DETAILS).find(
    key => ALGORITHM_DETAILS[key].name === algorithmInfo?.name || key === algorithmInfo?.name
  ) || 'Dijkstra';

  const details = ALGORITHM_DETAILS[currentAlgoKey];

  // Graph state
  const [vertices, setVertices] = useState([]);
  const [edges, setEdges] = useState([]);
  const [isDirected, setIsDirected] = useState(details.directedOnly || false);
  const [isWeighted, setIsWeighted] = useState(true);

  // Selector states
  const [sourceId, setSourceId] = useState(null);
  const [targetId, setTargetId] = useState(null);

  // Visualizer step states
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(300); // ms per step

  // Editor states
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [edgeStartNodeId, setEdgeStartNodeId] = useState(null);
  const [editMode, setEditMode] = useState('select'); // 'select', 'add-node', 'add-edge', 'delete'
  
  // Drag node ref
  const draggingNodeRef = useRef(null);
  const svgRef = useRef(null);
  const playIntervalRef = useRef(null);

  // Sync isDirected when selected algorithm changes
  useEffect(() => {
    if (details.directedOnly) {
      setIsDirected(true);
    } else if (details.undirectedOnly) {
      setIsDirected(false);
    }
  }, [currentAlgoKey, details]);

  // Generate an initial random graph
  useEffect(() => {
    generateRandomGraph();
    return () => clearInterval(playIntervalRef.current);
  }, []);

  // Set default source/target after graph generation
  useEffect(() => {
    if (vertices.length > 0) {
      if (sourceId === null || !vertices.some(v => v.id === sourceId)) {
        setSourceId(vertices[0].id);
      }
      if (targetId === null || !vertices.some(v => v.id === targetId)) {
        setTargetId(vertices[vertices.length - 1]?.id || null);
      }
    }
  }, [vertices]);

  // Handle auto playback interval
  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        handleNextStep();
      }, speed);
    } else {
      clearInterval(playIntervalRef.current);
    }
    return () => clearInterval(playIntervalRef.current);
  }, [isPlaying, currentStepIndex, steps, speed]);

  const generateRandomGraph = () => {
    setIsPlaying(false);
    setSteps([]);
    setCurrentStepIndex(-1);

    const count = 6;
    const width = 800;
    const height = 340;
    const padding = 60;

    // Arrange nodes in a neat circle
    const newVertices = [];
    const centerX = width / 2;
    const centerY = height / 2;
    const radiusX = width / 2.8;
    const radiusY = height / 2.5;

    for (let i = 0; i < count; i++) {
      const angle = (i * 2 * Math.PI) / count - Math.PI / 2;
      newVertices.push({
        id: i,
        label: String.fromCharCode(65 + i),
        x: centerX + radiusX * Math.cos(angle),
        y: centerY + radiusY * Math.sin(angle),
      });
    }

    const newEdges = [];
    const addedPairs = new Set();

    const addEdge = (u, v) => {
      const pairKey = isDirected ? `${u}->${v}` : `${Math.min(u, v)}-${Math.max(u, v)}`;
      if (u !== v && !addedPairs.has(pairKey)) {
        addedPairs.add(pairKey);
        newEdges.push({
          from: u,
          to: v,
          weight: Math.floor(Math.random() * 15) + 1,
        });
      }
    };

    // Ensure connectivity
    for (let i = 0; i < count - 1; i++) {
      addEdge(i, i + 1);
    }
    addEdge(count - 1, 0);

    // Random cross edges
    for (let i = 0; i < count; i++) {
      if (Math.random() < 0.4) {
        const target = (i + Math.floor(Math.random() * (count - 2)) + 2) % count;
        addEdge(i, target);
      }
    }

    setVertices(newVertices);
    setEdges(newEdges);
    setSourceId(0);
    setTargetId(count - 1);
  };

  const handleSvgDoubleClick = (e) => {
    if (editMode !== 'add-node' && editMode !== 'select') return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Add node
    const maxId = vertices.reduce((max, v) => (v.id > max ? v.id : max), -1);
    const newId = maxId + 1;
    const newLabel = String.fromCharCode(65 + (newId % 26)) + (newId >= 26 ? Math.floor(newId / 26) : '');
    
    setVertices([...vertices, { id: newId, label: newLabel, x, y }]);
    // Keep it on select mode
    setEditMode('select');
  };

  // Node Drag and Drop handlers
  const handleNodeMouseDown = (e, node) => {
    e.stopPropagation();
    if (editMode === 'delete') {
      // Delete Node
      setVertices(vertices.filter(v => v.id !== node.id));
      setEdges(edges.filter(edge => edge.from !== node.id && edge.to !== node.id));
      if (sourceId === node.id) setSourceId(null);
      if (targetId === node.id) setTargetId(null);
      return;
    }

    if (editMode === 'add-edge') {
      if (edgeStartNodeId === null) {
        setEdgeStartNodeId(node.id);
      } else if (edgeStartNodeId !== node.id) {
        // Draw edge
        const u = edgeStartNodeId;
        const v = node.id;
        const weightInput = isWeighted ? prompt('Enter edge weight (integer):', '1') : '1';
        const weight = parseInt(weightInput, 10) || 1;

        // Check if edge already exists
        const edgeExists = edges.some(edge => 
          isDirected ? (edge.from === u && edge.to === v) : 
          ((edge.from === u && edge.to === v) || (edge.from === v && edge.to === u))
        );

        if (!edgeExists) {
          setEdges([...edges, { from: u, to: v, weight }]);
        }
        setEdgeStartNodeId(null);
        setEditMode('select');
      }
      return;
    }

    // Default select/drag mode
    setSelectedNodeId(node.id);
    draggingNodeRef.current = node.id;
  };

  const handleSvgMouseMove = (e) => {
    if (draggingNodeRef.current === null) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setVertices(prev => 
      prev.map(v => v.id === draggingNodeRef.current ? { ...v, x, y } : v)
    );
  };

  const handleSvgMouseUp = () => {
    draggingNodeRef.current = null;
  };

  // Delete specific edge
  const handleEdgeClick = (e, edge) => {
    e.stopPropagation();
    if (editMode === 'delete') {
      setEdges(edges.filter(el => !(el.from === edge.from && el.to === edge.to)));
    }
  };

  const getEdgeCoords = (from, to, nodeRadius = 24) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance === 0) return { x1: from.x, y1: from.y, x2: to.x, y2: to.y };
    
    const arrowOffset = isDirected ? 8 : 0;
    const totalEndOffset = nodeRadius + arrowOffset;

    return {
      x1: from.x + (dx / distance) * nodeRadius,
      y1: from.y + (dy / distance) * nodeRadius,
      x2: to.x - (dx / distance) * totalEndOffset,
      y2: to.y - (dy / distance) * totalEndOffset,
    };
  };

  // Run the generator to compile steps
  const compileSteps = () => {
    if (details.needsSource && sourceId === null) {
      alert('Please select a source node first.');
      return;
    }

    setIsPlaying(false);
    const gen = details.generator;
    let computedSteps = [];

    if (currentAlgoKey === 'BFS' || currentAlgoKey === 'DFS' || currentAlgoKey === 'Dijkstra' || currentAlgoKey === 'Bellman-Ford') {
      computedSteps = gen(vertices, edges, sourceId, targetId, isDirected);
    } else if (currentAlgoKey === 'Floyd-Warshall') {
      computedSteps = gen(vertices, edges, sourceId, targetId, isDirected);
    } else {
      // MST algorithms and Topological Sort do not need source/target selection
      computedSteps = gen(vertices, edges);
    }

    setSteps(computedSteps);
    setCurrentStepIndex(0);
  };

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const resetVisualization = () => {
    setIsPlaying(false);
    setSteps([]);
    setCurrentStepIndex(-1);
  };

  const activeStep = steps[currentStepIndex] || null;

  // Compute status colors for rendering
  const getNodeColor = (nodeId) => {
    if (details.needsSource && nodeId === sourceId) return COLORS.START;
    if (details.needsTarget && nodeId === targetId) return COLORS.END;

    if (activeStep) {
      const nodeStatus = activeStep.verticesState[nodeId];
      if (nodeStatus === 'visiting') return COLORS.COMPARING;
      if (nodeStatus === 'visited') return COLORS.SORTED;
    }
    return '#1e293b'; // Default slate-800
  };

  const getEdgeColor = (edge) => {
    if (activeStep) {
      const key = GraphAlgos.getEdgeKey(edge.from, edge.to, isDirected);
      const edgeStatus = activeStep.edgesState[key];
      if (edgeStatus === 'considering') return COLORS.COMPARING;
      if (edgeStatus === 'accepted') return COLORS.SORTED;
      if (edgeStatus === 'rejected') return COLORS.SWAPPING;
      if (edgeStatus === 'exploring') return COLORS.VISITED;
    }
    return '#475569'; // Default slate-600
  };

  const getEdgeWidth = (edge) => {
    if (activeStep) {
      const key = GraphAlgos.getEdgeKey(edge.from, edge.to, isDirected);
      const edgeStatus = activeStep.edgesState[key];
      if (edgeStatus === 'accepted') return 4;
      if (edgeStatus === 'considering') return 3.5;
    }
    return 2;
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* 1. Algorithm Info Header */}
      <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 text-white p-5 rounded-t-lg shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">{details.name}</h2>
          <p className="text-xs opacity-90">{details.description}</p>
        </div>
        <div className="flex gap-3 text-xs shrink-0">
          <div className="bg-white/15 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full">
            <span className="font-semibold">Time:</span> {details.timeComplexity}
          </div>
          <div className="bg-white/15 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full">
            <span className="font-semibold">Space:</span> {details.spaceComplexity}
          </div>
        </div>
      </div>

      {/* 2. Controls Toolbar */}
      <div className="bg-slate-900 border-b border-slate-800 p-4 flex flex-wrap items-center justify-between gap-3 text-white">
        <div className="flex flex-wrap items-center gap-2">
          {/* Main playback control */}
          {steps.length === 0 ? (
            <button
              onClick={compileSteps}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-md shadow-indigo-600/10"
            >
              <Play size={16} />
              Visualize
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-md shadow-emerald-600/10"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                {isPlaying ? 'Pause' : 'Play'}
              </button>

              <button
                onClick={handlePrevStep}
                disabled={currentStepIndex <= 0}
                className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-lg transition-colors border border-slate-700"
              >
                <ChevronLeft size={16} />
              </button>

              <button
                onClick={handleNextStep}
                disabled={currentStepIndex >= steps.length - 1}
                className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-lg transition-colors border border-slate-700"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}

          <button
            onClick={resetVisualization}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors border border-slate-700"
          >
            <RotateCcw size={16} />
            Reset
          </button>

          <button
            onClick={generateRandomGraph}
            disabled={steps.length > 0}
            className="flex items-center gap-1.5 bg-purple-900/60 hover:bg-purple-800/60 border border-purple-700/50 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          >
            <Shuffle size={16} />
            Randomize
          </button>
        </div>

        {/* Speed Slider */}
        <div className="flex items-center gap-3 bg-slate-800/60 border border-slate-700/50 px-3 py-1.5 rounded-lg">
          <span className="text-xs text-slate-400 font-semibold select-none">Speed</span>
          <input
            type="range"
            min="50"
            max="1200"
            step="50"
            value={1250 - speed}
            onChange={(e) => setSpeed(1250 - Number(e.target.value))}
            className="w-20 accent-indigo-500 cursor-pointer"
          />
        </div>
      </div>

      {/* 3. Interactive Graph Editor Drawer */}
      <div className="bg-slate-950/85 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-slate-300">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-semibold mr-1.5 select-none">Editor Tools:</span>
          
          <button
            onClick={() => { setEditMode('select'); setEdgeStartNodeId(null); }}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all border ${editMode === 'select' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-800 hover:bg-slate-850'}`}
          >
            Select/Drag
          </button>

          <button
            onClick={() => { setEditMode('add-node'); setEdgeStartNodeId(null); }}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all border ${editMode === 'add-node' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-800 hover:bg-slate-850'}`}
            title="Double-click canvas to place a node"
          >
            + Add Node
          </button>

          <button
            onClick={() => { setEditMode('add-edge'); setEdgeStartNodeId(null); }}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all border ${editMode === 'add-edge' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-800 hover:bg-slate-850'}`}
            title="Click node A then node B to link"
          >
            + Link Edges
          </button>

          <button
            onClick={() => { setEditMode('delete'); setEdgeStartNodeId(null); }}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all border ${editMode === 'delete' ? 'bg-rose-950/60 border-rose-800 text-rose-300 hover:bg-rose-900/60' : 'bg-slate-900 border-slate-800'}`}
            title="Click node or edge to erase"
          >
            <Trash2 size={13} className="inline mr-1" />
            Erase Mode
          </button>

          <button
            onClick={() => { setVertices([]); setEdges([]); setSourceId(null); setTargetId(null); }}
            className="px-3 py-1.5 rounded-md font-semibold transition-all bg-slate-900 border border-slate-800 hover:bg-slate-800 text-rose-400"
          >
            Clear Canvas
          </button>
        </div>

        {/* Settings Toggle & Node Source Selectors */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {!details.undirectedOnly && !details.directedOnly && (
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isDirected}
                onChange={(e) => setIsDirected(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 accent-indigo-500"
              />
              <span>Directed</span>
            </label>
          )}

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={isWeighted}
              onChange={(e) => setIsWeighted(e.target.checked)}
              className="rounded border-slate-700 bg-slate-800 accent-indigo-500"
            />
            <span>Weighted</span>
          </label>

          {/* Select Source/Target */}
          {details.needsSource && vertices.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span>Source:</span>
              <select
                value={sourceId || ''}
                onChange={(e) => setSourceId(Number(e.target.value))}
                className="bg-slate-900 border border-slate-800 rounded px-1.5 py-1 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
              >
                {vertices.map(v => (
                  <option key={v.id} value={v.id}>{v.label}</option>
                ))}
              </select>
            </div>
          )}

          {details.needsTarget && vertices.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span>Target:</span>
              <select
                value={targetId || ''}
                onChange={(e) => setTargetId(Number(e.target.value))}
                className="bg-slate-900 border border-slate-800 rounded px-1.5 py-1 text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
              >
                <option value="">None</option>
                {vertices.map(v => (
                  <option key={v.id} value={v.id}>{v.label}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* 4. Steps Operational Logs Overlay */}
      {steps.length > 0 && activeStep && (
        <div className="bg-slate-900 border-b border-slate-800 px-5 py-3 flex items-center justify-between text-xs md:text-sm font-semibold">
          <div className="flex items-center gap-2 text-indigo-400">
            <span>Step {currentStepIndex + 1} of {steps.length}:</span>
            <span className="text-white font-medium">{activeStep.description}</span>
          </div>
          {activeStep.queue && activeStep.queue.length > 0 && (
            <div className="text-xs text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
              Queue: [{activeStep.queue.map(id => vertices.find(v => v.id === id)?.label || id).join(', ')}]
            </div>
          )}
          {activeStep.stack && activeStep.stack.length > 0 && (
            <div className="text-xs text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
              Stack: [{activeStep.stack.map(id => vertices.find(v => v.id === id)?.label || id).join(', ')}]
            </div>
          )}
        </div>
      )}

      {/* 5. Main Canvas Drawing Screen */}
      <div className="flex-1 bg-slate-950 p-4 relative overflow-hidden flex items-center justify-center min-h-[360px]">
        {vertices.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 text-sm gap-2 select-none pointer-events-none">
            <HelpCircle size={32} />
            <span>Canvas is empty. Double-click to place nodes, or click Randomize!</span>
          </div>
        )}

        <svg
          ref={svgRef}
          className="w-full h-full min-h-[350px] border border-slate-900 rounded-lg bg-slate-950/40"
          onMouseMove={handleSvgMouseMove}
          onMouseUp={handleSvgMouseUp}
          onMouseLeave={handleSvgMouseUp}
          onDoubleClick={handleSvgDoubleClick}
        >
          <defs>
            {/* Edge arrowhead markers for directed transitions */}
            <marker
              id="arrow-default"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#475569" />
            </marker>
            <marker
              id="arrow-considering"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill={COLORS.COMPARING} />
            </marker>
            <marker
              id="arrow-accepted"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill={COLORS.SORTED} />
            </marker>
            <marker
              id="arrow-rejected"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill={COLORS.SWAPPING} />
            </marker>
            <marker
              id="arrow-exploring"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="8"
              markerHeight="8"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill={COLORS.VISITED} />
            </marker>
          </defs>

          {/* Links / Edges */}
          {edges.map((edge, idx) => {
            const fromNode = vertices.find(v => v.id === edge.from);
            const toNode = vertices.find(v => v.id === edge.to);
            if (!fromNode || !toNode) return null;

            const coords = getEdgeCoords(fromNode, toNode, 24);
            const midX = (fromNode.x + toNode.x) / 2;
            const midY = (fromNode.y + toNode.y) / 2;
            const statusKey = activeStep ? activeStep.edgesState[GraphAlgos.getEdgeKey(edge.from, edge.to, isDirected)] : null;

            const markerId = isDirected
              ? `url(#arrow-${statusKey || 'default'})`
              : undefined;

            return (
              <g key={idx} onClick={(e) => handleEdgeClick(e, edge)} className="group cursor-pointer">
                <line
                  x1={coords.x1}
                  y1={coords.y1}
                  x2={coords.x2}
                  y2={coords.y2}
                  stroke={getEdgeColor(edge)}
                  strokeWidth={getEdgeWidth(edge)}
                  markerEnd={markerId}
                  className="transition-all duration-200"
                />
                {/* Visual helper line for mouse click target width */}
                <line
                  x1={coords.x1}
                  y1={coords.y1}
                  x2={coords.x2}
                  y2={coords.y2}
                  stroke="transparent"
                  strokeWidth="10"
                />
                {isWeighted && (
                  <g className="transition-all duration-200">
                    <rect
                      x={midX - 12}
                      y={midY - 10}
                      width={24}
                      height={20}
                      rx={4}
                      fill="#0f172a"
                      stroke="#334155"
                      strokeWidth="1"
                    />
                    <text
                      x={midX}
                      y={midY + 1}
                      fill="#cbd5e1"
                      fontSize="11"
                      fontWeight="600"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="select-none"
                    >
                      {edge.weight}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Draw connecting line if linking nodes */}
          {editMode === 'add-edge' && edgeStartNodeId !== null && (() => {
            const startNode = vertices.find(v => v.id === edgeStartNodeId);
            if (!startNode) return null;
            return (
              <line
                x1={startNode.x}
                y1={startNode.y}
                x2={startNode.x}
                y2={startNode.y}
                stroke="#6366f1"
                strokeWidth="1.5"
                strokeDasharray="4,4"
              />
            );
          })()}

          {/* Vertices / Nodes */}
          {vertices.map((node) => {
            const isSource = details.needsSource && node.id === sourceId;
            const isTarget = details.needsTarget && node.id === targetId;

            return (
              <g
                key={node.id}
                onMouseDown={(e) => handleNodeMouseDown(e, node)}
                className={`cursor-pointer transition-all duration-200 select-none ${editMode === 'delete' ? 'hover:text-red-500' : ''}`}
                style={{ transformOrigin: `${node.x}px ${node.y}px` }}
              >
                {/* Outer glow ring for Source node */}
                {isSource && (
                  <>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={34}
                      fill="none"
                      stroke={COLORS.START}
                      strokeWidth={2.5}
                      opacity={0.6}
                    />
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={42}
                      fill="none"
                      stroke={COLORS.START}
                      strokeWidth={1}
                      opacity={0.25}
                    />
                  </>
                )}

                {/* Outer glow ring for Target node */}
                {isTarget && (
                  <>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={34}
                      fill="none"
                      stroke={COLORS.END}
                      strokeWidth={2.5}
                      opacity={0.6}
                    />
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={42}
                      fill="none"
                      stroke={COLORS.END}
                      strokeWidth={1}
                      opacity={0.25}
                    />
                  </>
                )}

                {/* Main node circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={24}
                  fill={getNodeColor(node.id)}
                  stroke={
                    isSource ? COLORS.START :
                    isTarget ? COLORS.END :
                    selectedNodeId === node.id ? '#6366f1' : '#475569'
                  }
                  strokeWidth={isSource || isTarget ? 3 : selectedNodeId === node.id ? 3 : 2}
                  className="transition-all duration-200"
                />

                {/* Node label text */}
                <text
                  x={node.x}
                  y={node.y + 1}
                  fill="#f8fafc"
                  fontSize="14"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {node.label}
                </text>

                {/* START badge – rendered BELOW the node to avoid clipping at top edge */}
                {isSource && (
                  <g>
                    <rect
                      x={node.x - 22}
                      y={node.y + 30}
                      width={44}
                      height={17}
                      rx={8}
                      fill={COLORS.START}
                      opacity={0.92}
                    />
                    <text
                      x={node.x}
                      y={node.y + 39}
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      letterSpacing="0.5"
                    >
                      START
                    </text>
                  </g>
                )}

                {/* TARGET badge – rendered BELOW the node */}
                {isTarget && (
                  <g>
                    <rect
                      x={node.x - 26}
                      y={node.y + 30}
                      width={52}
                      height={17}
                      rx={8}
                      fill={COLORS.END}
                      opacity={0.92}
                    />
                    <text
                      x={node.x}
                      y={node.y + 39}
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      letterSpacing="0.5"
                    >
                      TARGET
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* 6. Footer Legend */}
      <div className="bg-slate-900 border-t border-slate-800 p-4 flex flex-wrap gap-4 justify-center text-xs text-slate-300 rounded-b-lg">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-md border border-slate-700 bg-slate-800"></div>
          <span>Unvisited</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-md" style={{ backgroundColor: COLORS.COMPARING }}></div>
          <span>Visiting / Evaluating</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-md" style={{ backgroundColor: COLORS.SORTED }}></div>
          <span>Visited / Solved</span>
        </div>
        {details.needsSource && (
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-md" style={{ backgroundColor: COLORS.START }}></div>
            <span>Source Node</span>
          </div>
        )}
        {details.needsTarget && (
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-md" style={{ backgroundColor: COLORS.END }}></div>
            <span>Target Node</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GraphVisualizer;
