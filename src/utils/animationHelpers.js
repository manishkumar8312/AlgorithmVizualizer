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
      distance: Infinity,
      previousNode: null,
    }))
  );
};

// Create graph nodes and edges
export const createGraph = (nodeCount = 7) => {
  const vertices = Array.from({ length: nodeCount }, (_, i) => ({
    id: i,
    label: String.fromCharCode(65 + i), // A, B, C, etc.
    x: Math.random() * 700 + 50,
    y: Math.random() * 500 + 50,
  }));

  const edges = [];
  for (let i = 0; i < nodeCount - 1; i++) {
    for (let j = i + 1; j < nodeCount; j++) {
      if (Math.random() > 0.6) { // 40% chance to create edge
        edges.push({
          from: i,
          to: j,
          weight: Math.floor(Math.random() * 20) + 1,
        });
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
