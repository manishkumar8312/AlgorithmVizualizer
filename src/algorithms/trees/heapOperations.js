// src/algorithms/trees/heapOperations.js
// Full Heap engine with animated insert, extract root, bubble up/down,
// and step-by-step logging. Supports both Max and Min heaps.

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ------------------------------------------------------------------ */
/*  Heap Helpers & Generation                                         */
/* ------------------------------------------------------------------ */

// Generates a random array of unique values.
export function generateRandomArray(count = 10, minVal = 5, maxVal = 95) {
  const pool = new Set();
  while (pool.size < count) {
    pool.add(Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal);
  }
  return [...pool];
}

// Builds a valid heap (max or min) from an array in-place. O(N)
export function buildHeapArray(arr, isMaxHeap = true) {
  const n = arr.length;
  const compare = isMaxHeap ? (a, b) => a > b : (a, b) => a < b;

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    let idx = i;
    while (true) {
      const left = 2 * idx + 1;
      const right = 2 * idx + 2;
      let target = idx;

      if (left < n && compare(arr[left], arr[target])) target = left;
      if (right < n && compare(arr[right], arr[target])) target = right;

      if (target === idx) break;

      // Swap
      [arr[idx], arr[target]] = [arr[target], arr[idx]];
      idx = target;
    }
  }
  return arr;
}

export function generateRandomHeap(count = 10, isMaxHeap = true) {
  const arr = generateRandomArray(count);
  return buildHeapArray(arr, isMaxHeap);
}

/* ------------------------------------------------------------------ */
/*  Tree Layout (Complete Binary Tree)                                */
/* ------------------------------------------------------------------ */

// Layout a complete binary tree based on array indices.
export function layoutHeapTree(arr, svgWidth = 1100, svgHeight = 460) {
  if (!arr || arr.length === 0) return { nodes: [], edges: [] };

  const n = arr.length;
  // Calculate total depth (0-indexed)
  const maxDepth = Math.floor(Math.log2(n));

  const padY = 60;
  const usableH = svgHeight - padY * 2;
  const yGap = maxDepth > 0 ? usableH / maxDepth : 0;

  const nodes = [];
  const edges = [];

  for (let i = 0; i < n; i++) {
    const depth = Math.floor(Math.log2(i + 1));
    // Index within the current level (0 to 2^depth - 1)
    const levelIndex = i - (Math.pow(2, depth) - 1);
    const nodesInLevel = Math.pow(2, depth);
    
    // Distribute nodes evenly across the width for this level
    const widthPerNode = svgWidth / nodesInLevel;
    const x = widthPerNode * levelIndex + widthPerNode / 2;
    const y = padY + depth * yGap;

    nodes.push({ id: i, val: arr[i], x, y, index: i });

    // Edges to children
    const leftChildIdx = 2 * i + 1;
    const rightChildIdx = 2 * i + 2;

    if (leftChildIdx < n) {
      edges.push({ fromId: i, toId: leftChildIdx });
    }
    if (rightChildIdx < n) {
      edges.push({ fromId: i, toId: rightChildIdx });
    }
  }

  // Map edges to actual node references for the visualizer
  const resolvedEdges = edges.map(e => ({
    from: nodes[e.fromId],
    to: nodes[e.toId]
  }));

  return { nodes, edges: resolvedEdges };
}

/* ------------------------------------------------------------------ */
/*  Heap Operations (Animated)                                        */
/* ------------------------------------------------------------------ */

export async function heapInsertAnimated(
  arr,
  val,
  isMaxHeap,
  { setActiveNode, setComparingNodes, setSwappingNodes, addLog, refreshLayout, speed }
) {
  addLog({ type: 'start', text: `Inserting ${val} into ${isMaxHeap ? 'Max' : 'Min'} Heap…` });

  // 1. Add to end
  const newArr = [...arr, val];
  let currentIdx = newArr.length - 1;
  refreshLayout(newArr); // Update visual immediately to show new node
  
  addLog({ type: 'info', text: `Added ${val} at index ${currentIdx}.` });
  setActiveNode(currentIdx);
  await sleep(speed);

  const compareStr = isMaxHeap ? '>' : '<';
  const compareFn = isMaxHeap ? (a, b) => a > b : (a, b) => a < b;

  // 2. Bubble up
  while (currentIdx > 0) {
    const parentIdx = Math.floor((currentIdx - 1) / 2);
    
    setComparingNodes([currentIdx, parentIdx]);
    addLog({ type: 'compare', text: `Comparing node ${newArr[currentIdx]} with parent ${newArr[parentIdx]}` });
    await sleep(speed);

    if (compareFn(newArr[currentIdx], newArr[parentIdx])) {
      addLog({ type: 'success', text: `${newArr[currentIdx]} ${compareStr} ${newArr[parentIdx]}. Swapping!` });
      setSwappingNodes([currentIdx, parentIdx]);
      await sleep(speed);
      
      // Swap
      [newArr[currentIdx], newArr[parentIdx]] = [newArr[parentIdx], newArr[currentIdx]];
      currentIdx = parentIdx;
      
      // Clear swap highlight, keep active
      setSwappingNodes([]);
      refreshLayout(newArr);
      setActiveNode(currentIdx);
      await sleep(speed);
    } else {
      addLog({ type: 'info', text: `Heap property satisfied. Stopping bubble-up.` });
      break;
    }
  }

  setComparingNodes([]);
  setActiveNode(null);
  addLog({ type: 'success', text: `Insertion complete.` });
  return newArr;
}

export async function heapDeleteAnimated(
  arr,
  isMaxHeap,
  { setActiveNode, setComparingNodes, setSwappingNodes, addLog, refreshLayout, speed }
) {
  if (!arr || arr.length === 0) {
    addLog({ type: 'warn', text: 'Heap is empty. Nothing to extract.' });
    return arr;
  }

  const newArr = [...arr];
  const rootVal = newArr[0];
  addLog({ type: 'start', text: `Extracting root (${rootVal}) from ${isMaxHeap ? 'Max' : 'Min'} Heap…` });

  if (newArr.length === 1) {
    addLog({ type: 'delete', text: `Removed the only element.` });
    return [];
  }

  // 1. Swap root with last element
  const lastIdx = newArr.length - 1;
  const lastVal = newArr[lastIdx];
  
  setActiveNode(0);
  setSwappingNodes([0, lastIdx]);
  addLog({ type: 'info', text: `Swapping root (${rootVal}) with last element (${lastVal}).` });
  await sleep(speed * 1.5);
  
  newArr[0] = lastVal;
  newArr.pop(); // Remove the old root
  
  setSwappingNodes([]);
  refreshLayout(newArr);
  addLog({ type: 'delete', text: `Root extracted. New root is ${lastVal}.` });
  await sleep(speed);

  // 2. Heapify down
  let currentIdx = 0;
  const compareStr = isMaxHeap ? '>' : '<';
  const compareFn = isMaxHeap ? (a, b) => a > b : (a, b) => a < b;

  while (true) {
    setActiveNode(currentIdx);
    const leftIdx = 2 * currentIdx + 1;
    const rightIdx = 2 * currentIdx + 2;
    let targetIdx = currentIdx;

    const comparing = [];
    if (leftIdx < newArr.length) comparing.push(leftIdx);
    if (rightIdx < newArr.length) comparing.push(rightIdx);
    
    if (comparing.length > 0) {
      setComparingNodes(comparing);
      addLog({ type: 'compare', text: `Checking children of ${newArr[currentIdx]}: ${comparing.map(i => newArr[i]).join(', ')}` });
      await sleep(speed);
    }

    if (leftIdx < newArr.length && compareFn(newArr[leftIdx], newArr[targetIdx])) {
      targetIdx = leftIdx;
    }
    if (rightIdx < newArr.length && compareFn(newArr[rightIdx], newArr[targetIdx])) {
      targetIdx = rightIdx;
    }

    if (targetIdx !== currentIdx) {
      addLog({ type: 'success', text: `Child ${newArr[targetIdx]} ${compareStr} parent. Swapping!` });
      setComparingNodes([]);
      setSwappingNodes([currentIdx, targetIdx]);
      await sleep(speed);

      [newArr[currentIdx], newArr[targetIdx]] = [newArr[targetIdx], newArr[currentIdx]];
      currentIdx = targetIdx;

      setSwappingNodes([]);
      refreshLayout(newArr);
      await sleep(speed);
    } else {
      addLog({ type: 'info', text: `Heap property satisfied. Stopping heapify-down.` });
      break;
    }
  }

  setComparingNodes([]);
  setActiveNode(null);
  addLog({ type: 'success', text: `Extraction complete.` });
  return newArr;
}
