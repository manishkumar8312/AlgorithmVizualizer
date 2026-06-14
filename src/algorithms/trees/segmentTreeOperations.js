// src/algorithms/trees/segmentTreeOperations.js
// Recursive Segment Tree engine with animated Build, Query, and Update operations.
// Supports Sum, Min, and Max queries.

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ------------------------------------------------------------------ */
/*  ID generation & Config                                            */
/* ------------------------------------------------------------------ */

let _nextId = 1;
const freshId = () => _nextId++;
export const resetSegmentTreeIdCounter = () => { _nextId = 1; };

export const SEG_TYPES = {
  SUM: 'sum',
  MIN: 'min',
  MAX: 'max',
};

const getConfig = (type) => {
  switch (type) {
    case SEG_TYPES.SUM:
      return {
        initial: 0,
        combine: (a, b) => a + b,
        label: 'Sum',
      };
    case SEG_TYPES.MIN:
      return {
        initial: Infinity,
        combine: Math.min,
        label: 'Min',
      };
    case SEG_TYPES.MAX:
      return {
        initial: -Infinity,
        combine: Math.max,
        label: 'Max',
      };
    default:
      return { initial: 0, combine: (a, b) => a + b, label: 'Sum' };
  }
};

/* ------------------------------------------------------------------ */
/*  Build Tree – Animated (Recursive)                                 */
/* ------------------------------------------------------------------ */

// Generates a random array
export function generateRandomArrayForSegTree(count = 8, minVal = 1, maxVal = 99) {
  const arr = [];
  for (let i = 0; i < count; i++) {
    arr.push(Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal);
  }
  return arr;
}

export async function buildSegmentTreeAnimated(
  arr,
  type,
  { setActiveNode, addLog, refreshLayout, speed }
) {
  if (!arr || arr.length === 0) return null;
  resetSegmentTreeIdCounter();
  
  const { combine, label } = getConfig(type);
  addLog({ type: 'start', text: `Building ${label} Segment Tree for array of size ${arr.length}…` });

  async function buildRec(l, r) {
    const node = {
      id: freshId(),
      l,
      r,
      val: null,
      left: null,
      right: null,
    };

    if (l === r) {
      // Leaf node
      node.val = arr[l];
      addLog({ type: 'success', text: `Created leaf node [${l}] with value ${node.val}` });
      return node;
    }

    const mid = Math.floor((l + r) / 2);
    node.left = await buildRec(l, mid);
    node.right = await buildRec(mid + 1, r);

    // Combine
    node.val = combine(node.left.val, node.right.val);
    
    // Animate combination
    setActiveNode(node.id);
    addLog({ type: 'info', text: `Combined range [${l}-${mid}] and [${mid+1}-${r}] → [${l}-${r}] = ${node.val}` });
    
    // We update the global layout here so we can see it build bottom-up if the UI supports partial trees
    // However, for simplicity, we usually just return the final tree. 
    // To support progressive layout, we would need to maintain a wrapper, but it's complex for segment trees.
    // Instead, we just animate the active node logic and wait.
    
    await sleep(speed * 0.5);
    return node;
  }

  const root = await buildRec(0, arr.length - 1);
  refreshLayout(root);
  setActiveNode(null);
  addLog({ type: 'success', text: `Tree build complete. Root [0-${arr.length - 1}] = ${root.val}` });
  return root;
}

// Synchronous build for initial load
export function buildSegmentTreeSync(arr, type) {
  if (!arr || arr.length === 0) return null;
  resetSegmentTreeIdCounter();
  const { combine } = getConfig(type);

  function buildRec(l, r) {
    const node = { id: freshId(), l, r, val: null, left: null, right: null };
    if (l === r) {
      node.val = arr[l];
      return node;
    }
    const mid = Math.floor((l + r) / 2);
    node.left = buildRec(l, mid);
    node.right = buildRec(mid + 1, r);
    node.val = combine(node.left.val, node.right.val);
    return node;
  }
  return buildRec(0, arr.length - 1);
}

/* ------------------------------------------------------------------ */
/*  Tree Layout                                                       */
/* ------------------------------------------------------------------ */

export function layoutSegmentTree(root) {
  if (!root) return { nodes: [], edges: [], svgWidth: 1100, svgHeight: 460 };

  const nodes = [];
  const edges = [];
  
  // Calculate depth
  function getDepth(node) {
    if (!node) return 0;
    return 1 + Math.max(getDepth(node.left), getDepth(node.right));
  }
  const maxDepth = getDepth(root);

  // Layout Constants
  const padY = 60;
  const padX = 60;
  const yGap = 90;
  const leafSpacing = 110;

  // Total elements = root.r - root.l + 1
  const numLeaves = root.r - root.l + 1;
  const treeWidth = (numLeaves > 0 ? numLeaves - 1 : 0) * leafSpacing;
  
  // Dynamic viewBox bounds based on tree size
  // Give minimums to prevent the layout from collapsing too much
  const svgWidth = Math.max(800, treeWidth + padX * 2);
  const svgHeight = Math.max(460, (maxDepth > 0 ? maxDepth - 1 : 0) * yGap + padY * 2);

  // Center horizontally
  const startX = (svgWidth - treeWidth) / 2;

  function walk(node, depth) {
    node.y = padY + depth * yGap;

    if (node.l === node.r) {
      // Leaf
      node.x = startX + (node.l - root.l) * leafSpacing;
    } else {
      // Internal
      walk(node.left, depth + 1);
      walk(node.right, depth + 1);
      // Center above children
      node.x = (node.left.x + node.right.x) / 2;
      
      edges.push({ from: node, to: node.left });
      edges.push({ from: node, to: node.right });
    }
    nodes.push(node);
  }

  walk(root, 0);
  return { nodes, edges, svgWidth, svgHeight };
}

/* ------------------------------------------------------------------ */
/*  Range Query – Animated                                            */
/* ------------------------------------------------------------------ */

export async function querySegmentTreeAnimated(
  root,
  type,
  qL,
  qR,
  { setActiveNode, setVisitedNodes, setContributingNodes, addLog, speed }
) {
  if (!root) return null;
  const { initial, combine } = getConfig(type);

  addLog({ type: 'start', text: `Querying range [${qL}-${qR}]…` });

  async function queryRec(node) {
    setActiveNode(node.id);
    setVisitedNodes(prev => [...prev, node.id]);
    await sleep(speed);

    // 1. No overlap
    if (qL > node.r || qR < node.l) {
      addLog({ type: 'error', text: `Node [${node.l}-${node.r}] is outside query range. Returning ${initial}.` });
      return initial;
    }

    // 2. Full overlap
    if (qL <= node.l && node.r <= qR) {
      addLog({ type: 'success', text: `Node [${node.l}-${node.r}] is fully inside. Returning ${node.val}.` });
      setContributingNodes(prev => [...prev, node.id]);
      await sleep(speed);
      return node.val;
    }

    // 3. Partial overlap
    addLog({ type: 'info', text: `Node [${node.l}-${node.r}] partially overlaps. Splitting query.` });
    
    const leftAns = await queryRec(node.left);
    setActiveNode(node.id); // Return focus
    await sleep(speed * 0.5);
    
    const rightAns = await queryRec(node.right);
    setActiveNode(node.id); // Return focus
    
    const combined = combine(leftAns, rightAns);
    addLog({ type: 'compare', text: `Combined left (${leftAns}) and right (${rightAns}) for [${node.l}-${node.r}] = ${combined}` });
    await sleep(speed);
    
    return combined;
  }

  const result = await queryRec(root);
  setActiveNode(null);
  addLog({ type: 'success', text: `Query complete! Result for [${qL}-${qR}] is ${result}.` });
  return result;
}

/* ------------------------------------------------------------------ */
/*  Point Update – Animated                                           */
/* ------------------------------------------------------------------ */

export async function updateSegmentTreeAnimated(
  root,
  type,
  idx,
  newVal,
  { setActiveNode, setVisitedNodes, setPropagatingNodes, addLog, refreshLayout, speed }
) {
  if (!root || idx < root.l || idx > root.r) {
    addLog({ type: 'error', text: `Index ${idx} is out of bounds.` });
    return root;
  }

  const { combine } = getConfig(type);
  addLog({ type: 'start', text: `Updating index ${idx} to ${newVal}…` });

  async function updateRec(node) {
    setActiveNode(node.id);
    setVisitedNodes(prev => [...prev, node.id]);
    await sleep(speed);

    if (node.l === node.r) {
      // Leaf
      addLog({ type: 'success', text: `Found leaf [${node.l}]. Changing ${node.val} → ${newVal}.` });
      node.val = newVal;
      setPropagatingNodes(prev => [...prev, node.id]);
      refreshLayout(root);
      await sleep(speed);
      return;
    }

    const mid = Math.floor((node.l + node.r) / 2);
    if (idx <= mid) {
      addLog({ type: 'info', text: `Index ${idx} ≤ ${mid}, going left.` });
      await updateRec(node.left);
    } else {
      addLog({ type: 'info', text: `Index ${idx} > ${mid}, going right.` });
      await updateRec(node.right);
    }

    // Backtrack and combine
    setActiveNode(node.id);
    setPropagatingNodes(prev => [...prev, node.id]);
    
    const oldVal = node.val;
    node.val = combine(node.left.val, node.right.val);
    
    addLog({ type: 'compare', text: `Updating [${node.l}-${node.r}]: combined ${node.left.val} and ${node.right.val} → ${node.val} (was ${oldVal})` });
    refreshLayout(root);
    await sleep(speed);
  }

  await updateRec(root);
  setActiveNode(null);
  setPropagatingNodes([]);
  addLog({ type: 'success', text: `Update complete.` });
  return root;
}
