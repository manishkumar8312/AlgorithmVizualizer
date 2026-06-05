import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Shuffle } from 'lucide-react';
import { createGraph, SPEED_PRESETS, COLORS } from '../utils/animationHelpers';

const GraphVisualizer = ({ algorithm, algorithmInfo }) => {
  const [vertices, setVertices] = useState([]);
  const [edges, setEdges] = useState([]);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [speed, setSpeed] = useState(SPEED_PRESETS.MEDIUM);
  const [result, setResult] = useState(null);
  const [nodeCount, setNodeCount] = useState(7);

  const isDirected = algorithmInfo?.name === "Topological Sort";

  useEffect(() => {
    generateNewGraph();
  }, [nodeCount, algorithmInfo]);

  const generateNewGraph = () => {
    if (!isVisualizing) {
      const { vertices: newVertices, edges: newEdges } = createGraph(nodeCount, isDirected);
      setVertices(newVertices);
      setEdges(newEdges);
      setResult(null);
    }
  };

  const getEdgeCoords = (from, to, nodeRadius = 30) => {
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

  const reset = () => {
    if (!isVisualizing) {
      setResult(null);
      setEdges(prevEdges =>
        prevEdges.map(edge => ({ ...edge, status: undefined }))
      );
      setVertices(prevVertices =>
        prevVertices.map(vertex => ({ ...vertex, status: undefined }))
      );
    }
  };

  const visualize = async () => {
    if (isVisualizing) return;
    
    setIsVisualizing(true);
    reset();

    const updateEdges = (edgeUpdate) => {
      setEdges(prevEdges =>
        prevEdges.map(edge =>
          (edge.from === edgeUpdate.from && edge.to === edgeUpdate.to) ||
          (edge.from === edgeUpdate.to && edge.to === edgeUpdate.from)
            ? { ...edge, status: edgeUpdate.status }
            : edge
        )
      );
    };

    const updateVertices = (vertexUpdate) => {
      setVertices(prevVertices =>
        prevVertices.map((vertex, idx) =>
          idx === vertexUpdate.index
            ? { ...vertex, status: vertexUpdate.status }
            : vertex
        )
      );
    };

    const algorithmResult = await algorithm(
      vertices,
      edges,
      updateEdges,
      updateVertices,
      speed
    );

    setResult(algorithmResult);
    setIsVisualizing(false);
  };

  const getEdgeColor = (edge) => {
    if (edge.status === 'accepted') return COLORS.SORTED;
    if (edge.status === 'considering') return COLORS.COMPARING;
    if (edge.status === 'rejected') return COLORS.SWAPPING;
    if (edge.status === 'exploring') return COLORS.VISITED;
    return COLORS.DEFAULT;
  };

  const getNodeColor = (vertex) => {
    if (vertex.status === 'visited' || vertex.status === 'processed') return COLORS.SORTED;
    if (vertex.status === 'visiting') return COLORS.COMPARING;
    return COLORS.DEFAULT;
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Algorithm Info */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-lg shadow-lg">
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
          onClick={visualize}
          disabled={isVisualizing}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold transition-colors"
        >
          <Play size={18} />
          Visualize
        </button>

        <button
          onClick={reset}
          disabled={isVisualizing}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold transition-colors"
        >
          <RotateCcw size={18} />
          Reset
        </button>

        <button
          onClick={generateNewGraph}
          disabled={isVisualizing}
          className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold transition-colors"
        >
          <Shuffle size={18} />
          New Graph
        </button>

        <div className="ml-auto flex items-center gap-2">
          <label className="text-white text-sm font-semibold">Nodes:</label>
          <input
            type="range"
            min="4"
            max="10"
            value={nodeCount}
            onChange={(e) => setNodeCount(Number(e.target.value))}
            disabled={isVisualizing}
          />
          <span className="text-white text-sm">{nodeCount}</span>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="bg-green-500 text-white p-3 text-center font-semibold animate-fadeIn">
          {isDirected ? (
            `Topological Order: ${result.map(v => vertices[v]?.label || v).join(' → ')}`
          ) : (
            `MST Found! ${result.length} Edges: ${result.map(e => `${vertices[e.from]?.label}-${vertices[e.to]?.label} (${e.weight})`).join(', ')} (Total Weight: ${result.reduce((sum, e) => sum + e.weight, 0)})`
          )}
        </div>
      )}

      {/* Graph Visualization */}
      <div className="flex-1 bg-gray-900 p-4 relative overflow-auto">
        <svg className="w-full h-full" viewBox="0 0 1000 380" preserveAspectRatio="xMidYMid meet">
          <defs>
            <marker
              id="arrow-default"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#60a5fa" />
            </marker>
            <marker
              id="arrow-exploring"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#14b8a6" />
            </marker>
            <marker
              id="arrow-considering"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#fbbf24" />
            </marker>
            <marker
              id="arrow-accepted"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#22c55e" />
            </marker>
            <marker
              id="arrow-rejected"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#ef4444" />
            </marker>
          </defs>

          {/* Draw edges */}
          {edges.map((edge, idx) => {
            const from = vertices[edge.from];
            const to = vertices[edge.to];
            if (!from || !to) return null;

            const coords = getEdgeCoords(from, to, 30);
            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;

            const markerId = isDirected
              ? `url(#arrow-${edge.status || 'default'})`
              : undefined;

            return (
              <g key={idx}>
                <line
                  x1={coords.x1}
                  y1={coords.y1}
                  x2={coords.x2}
                  y2={coords.y2}
                  stroke={getEdgeColor(edge)}
                  strokeWidth={edge.status === 'accepted' ? 4 : 2}
                  markerEnd={markerId}
                  className="transition-all duration-300"
                />
                {!isDirected && (
                  <g className="transition-all duration-300">
                    <rect
                      x={midX - 16}
                      y={midY - 12}
                      width={32}
                      height={24}
                      rx={6}
                      fill="#1f2937"
                      stroke="#4b5563"
                      strokeWidth="1.5"
                    />
                    <text
                      x={midX}
                      y={midY + 1}
                      fill="white"
                      fontSize="13"
                      fontWeight="bold"
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

          {/* Draw vertices */}
          {vertices.map((vertex, idx) => (
            <g
              key={idx}
              className="cursor-pointer transition-all duration-300 transform hover:scale-110"
              style={{ transformOrigin: `${vertex.x}px ${vertex.y}px` }}
            >
              <circle
                cx={vertex.x}
                cy={vertex.y}
                r={30}
                fill={getNodeColor(vertex)}
                stroke="white"
                strokeWidth="3"
                className="transition-all duration-300"
              />
              <text
                x={vertex.x}
                y={vertex.y}
                fill="white"
                fontSize="20"
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="middle"
                className="select-none"
              >
                {vertex.label}
              </text>
            </g>
          ))}
        </svg>
      </div>


      {/* Legend */}
      <div className="bg-gray-800 p-3 flex flex-wrap gap-4 justify-center text-sm rounded-b-lg">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS.DEFAULT }}></div>
          <span className="text-white">Default</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS.COMPARING }}></div>
          <span className="text-white">Considering</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS.SORTED }}></div>
          <span className="text-white">Accepted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS.SWAPPING }}></div>
          <span className="text-white">Rejected</span>
        </div>
      </div>
    </div>
  );
};

export default GraphVisualizer;
