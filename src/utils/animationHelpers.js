// Helper functions for animations and array manipulation

export const generateRandomArray = (size = 50, min = 5, max = 500) => {
  return Array.from({ length: size }, () => 
    Math.floor(Math.random() * (max - min + 1)) + min
  );
};

export const generateSortedArray = (size = 50, min = 5, max = 500) => {
  const arr = generateRandomArray(size, min, max);
  return arr.sort((a, b) => a - b);
};

export const generateReverseSortedArray = (size = 50, min = 5, max = 500) => {
  const arr = generateRandomArray(size, min, max);
  return arr.sort((a, b) => b - a);
};

export const generateNearlySortedArray = (size = 50, min = 5, max = 500) => {
  const arr = generateSortedArray(size, min, max);
  const swaps = Math.floor(size * 0.1);
  
  for (let i = 0; i < swaps; i++) {
    const idx1 = Math.floor(Math.random() * size);
    const idx2 = Math.floor(Math.random() * size);
    [arr[idx1], arr[idx2]] = [arr[idx2], arr[idx1]];
  }
  
  return arr;
};

export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Speed presets (in milliseconds)
export const SPEED_PRESETS = {
  SLOW: 500,
  MEDIUM: 200,
  FAST: 50,
  VERY_FAST: 10,
  INSTANT: 1
};

// Color schemes for visualizations
export const COLORS = {
  DEFAULT: '#60a5fa',      // blue-400
  COMPARING: '#fbbf24',    // amber-400
  SWAPPING: '#ef4444',     // red-500
  SORTED: '#22c55e',       // green-500
  PIVOT: '#a855f7',        // purple-500
  VISITED: '#14b8a6',      // teal-500
  PATH: '#facc15',         // yellow-400
  WALL: '#1f2937',         // gray-800
  START: '#10b981',        // emerald-500
  END: '#f43f5e',          // rose-500
};

// Create initial grid for pathfinding
export const createInitialGrid = (rows = 20, cols = 50) => {
  const grid = [];
  
  for (let row = 0; row < rows; row++) {
    const currentRow = [];
    for (let col = 0; col < cols; col++) {
      currentRow.push({
        row,
        col,
        isStart: row === Math.floor(rows / 2) && col === 5,
        isEnd: row === Math.floor(rows / 2) && col === cols - 6,
        isWall: false,
        isVisited: false,
        distance: Infinity,
        previousNode: null,
      });
    }
    grid.push(currentRow);
  }
  
  return grid;
};

// Reset grid keeping walls
export const resetGrid = (grid) => {
  return grid.map(row =>
    row.map(node => ({
      ...node,
      isVisited: false,
      isPath: false,
      distance: Infinity,
      previousNode: null,
    }))
  );
};

// Create graph nodes and edges
export const createGraph = (nodeCount = 7, isDirected = false) => {
  const centerX = 500;
  const centerY = 190;
  const radiusX = 430;
  const radiusY = 140;

  const vertices = Array.from({ length: nodeCount }, (_, i) => {
    const angle = (i * 2 * Math.PI) / nodeCount - Math.PI / 2;
    return {
      id: i,
      label: String.fromCharCode(65 + i), // A, B, C, etc.
      x: centerX + radiusX * Math.cos(angle),
      y: centerY + radiusY * Math.sin(angle),
    };
  });

  const edges = [];
  const edgeSet = new Set();

  const addEdge = (from, to) => {
    const key = isDirected ? `${from}->${to}` : `${Math.min(from, to)}-${Math.max(from, to)}`;
    if (!edgeSet.has(key) && from !== to) {
      edgeSet.add(key);
      edges.push({
        from,
        to,
        weight: isDirected ? 1 : Math.floor(Math.random() * 20) + 1,
      });
    }
  };

  if (isDirected) {
    // Generate DAG (Topological Sort)
    // 1. Ensure connectivity by creating a backbone chain
    for (let i = 0; i < nodeCount - 1; i++) {
      addEdge(i, i + 1);
    }
    // 2. Add some random forward edges
    for (let i = 0; i < nodeCount - 2; i++) {
      for (let j = i + 2; j < nodeCount; j++) {
        if (Math.random() < 0.3) {
          addEdge(i, j);
        }
      }
    }
  } else {
    // Generate connected undirected graph (MST)
    // 1. Ensure connectivity with a spanning tree
    for (let i = 1; i < nodeCount; i++) {
      const parent = Math.floor(Math.random() * i);
      addEdge(parent, i);
    }
    // 2. Add extra random edges for alternative paths/cycles
    for (let i = 0; i < nodeCount - 1; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (Math.random() < 0.35) {
          addEdge(i, j);
        }
      }
    }
  }

  return { vertices, edges };
};

// Format time for display
export const formatTime = (ms) => {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
};

// Calculate array statistics
export const getArrayStats = (array) => {
  return {
    min: Math.min(...array),
    max: Math.max(...array),
    avg: (array.reduce((a, b) => a + b, 0) / array.length).toFixed(2),
    length: array.length,
  };
};
