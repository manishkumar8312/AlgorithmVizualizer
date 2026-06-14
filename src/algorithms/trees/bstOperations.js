// src/algorithms/trees/bstOperations.js
// Full BST operations engine with animation hooks and step-by-step logging.

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ------------------------------------------------------------------ */
/*  BST Tree Generation (proper left < root < right)                  */
/* ------------------------------------------------------------------ */

let _nextId = 1;
const freshId = () => _nextId++;

/**
 * Build a balanced BST from a sorted array of unique values.
 * Each node gets { id, val, left, right } – coordinates are assigned later.
 */
function buildBalancedBST(sorted, lo = 0, hi = sorted.length - 1) {
  if (lo > hi) return null;
  const mid = Math.floor((lo + hi) / 2);
  return {
    id: freshId(),
    val: sorted[mid],
    left: buildBalancedBST(sorted, lo, mid - 1),
    right: buildBalancedBST(sorted, mid + 1, hi),
  };
}

/**
 * Generate a random BST with `count` unique nodes in range [minVal, maxVal].
 */
export function generateRandomBST(count = 7, minVal = 5, maxVal = 95) {
  _nextId = 1;
  const pool = new Set();
  while (pool.size < count) {
    pool.add(Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal);
  }
  const sorted = [...pool].sort((a, b) => a - b);
  const root = buildBalancedBST(sorted);
  return root;
}

/* ------------------------------------------------------------------ */
/*  Layout – assign (x, y) based on in-order index                    */
/* ------------------------------------------------------------------ */

function inorderList(node, out = []) {
  if (!node) return out;
  inorderList(node.left, out);
  out.push(node);
  inorderList(node.right, out);
  return out;
}

function getHeight(node) {
  if (!node) return 0;
  return 1 + Math.max(getHeight(node.left), getHeight(node.right));
}

/**
 * Assign coordinates for SVG rendering.
 * Returns { nodes: [], edges: [] } ready for the visualizer.
 */
export function layoutTree(root, svgWidth = 1100, svgHeight = 460) {
  if (!root) return { nodes: [], edges: [] };

  const ordered = inorderList(root);
  const n = ordered.length;
  const h = getHeight(root);

  // Horizontal spacing based on inorder index
  const padX = 70;
  const usableW = svgWidth - padX * 2;
  const xGap = n > 1 ? usableW / (n - 1) : 0;

  // Map each node to its inorder index for x
  const indexMap = new Map();
  ordered.forEach((nd, i) => indexMap.set(nd.id, i));

  // Vertical spacing based on depth
  const padY = 60;
  const usableH = svgHeight - padY * 2;
  const yGap = h > 1 ? usableH / (h - 1) : 0;

  const nodes = [];
  const edges = [];

  const walk = (node, depth) => {
    if (!node) return;
    const idx = indexMap.get(node.id);
    node.x = padX + idx * xGap;
    node.y = padY + depth * yGap;
    nodes.push(node);

    if (node.left) {
      edges.push({ from: node, to: node.left });
      walk(node.left, depth + 1);
    }
    if (node.right) {
      edges.push({ from: node, to: node.right });
      walk(node.right, depth + 1);
    }
  };

  walk(root, 0);
  return { nodes, edges };
}

/* ------------------------------------------------------------------ */
/*  Tree Statistics                                                   */
/* ------------------------------------------------------------------ */

export function getTreeStats(root) {
  if (!root) return { height: 0, nodeCount: 0, min: '-', max: '-' };

  let count = 0;
  let minVal = Infinity;
  let maxVal = -Infinity;

  const dfs = (node) => {
    if (!node) return 0;
    count++;
    if (node.val < minVal) minVal = node.val;
    if (node.val > maxVal) maxVal = node.val;
    return 1 + Math.max(dfs(node.left), dfs(node.right));
  };

  const height = dfs(root);
  return { height, nodeCount: count, min: minVal, max: maxVal };
}

/* ------------------------------------------------------------------ */
/*  BST Insert (animated, with step log)                              */
/* ------------------------------------------------------------------ */

export async function bstInsertAnimated(
  root,
  val,
  { setActiveNode, setVisitedNodes, addLog, speed }
) {
  if (!root) {
    // Empty tree – create root
    const newNode = { id: freshId(), val, left: null, right: null };
    addLog({ type: 'info', text: `Tree is empty. Created root node with value ${val}.` });
    return newNode; // caller sets as new root
  }

  let current = root;
  addLog({ type: 'start', text: `Inserting ${val} into BST…` });

  while (true) {
    setActiveNode(current.id);
    await sleep(speed);

    if (val === current.val) {
      addLog({ type: 'warn', text: `Value ${val} already exists. Skipping insert.` });
      setVisitedNodes((prev) => [...prev, current.id]);
      break;
    }

    if (val < current.val) {
      addLog({
        type: 'compare',
        text: `${val} < ${current.val}  →  go left`,
      });
      setVisitedNodes((prev) => [...prev, current.id]);

      if (!current.left) {
        const newNode = { id: freshId(), val, left: null, right: null };
        current.left = newNode;
        addLog({ type: 'success', text: `Inserted ${val} as left child of ${current.val}.` });
        // briefly highlight new node after layout
        setActiveNode(newNode.id);
        await sleep(speed);
        break;
      }
      current = current.left;
    } else {
      addLog({
        type: 'compare',
        text: `${val} > ${current.val}  →  go right`,
      });
      setVisitedNodes((prev) => [...prev, current.id]);

      if (!current.right) {
        const newNode = { id: freshId(), val, left: null, right: null };
        current.right = newNode;
        addLog({ type: 'success', text: `Inserted ${val} as right child of ${current.val}.` });
        setActiveNode(newNode.id);
        await sleep(speed);
        break;
      }
      current = current.right;
    }
  }

  setActiveNode(null);
  return root;
}

/* ------------------------------------------------------------------ */
/*  BST Search (animated, with step log)                              */
/* ------------------------------------------------------------------ */

export async function bstSearchAnimated(
  root,
  val,
  { setActiveNode, setVisitedNodes, setFoundNode, addLog, speed }
) {
  if (!root) {
    addLog({ type: 'warn', text: 'Tree is empty. Nothing to search.' });
    return;
  }

  let current = root;
  addLog({ type: 'start', text: `Searching for ${val}…` });

  while (current) {
    setActiveNode(current.id);
    await sleep(speed);

    if (val === current.val) {
      addLog({ type: 'success', text: `Found ${val}!` });
      setFoundNode(current.id);
      setVisitedNodes((prev) => [...prev, current.id]);
      setActiveNode(null);
      return;
    }

    if (val < current.val) {
      addLog({ type: 'compare', text: `${val} < ${current.val}  →  go left` });
      setVisitedNodes((prev) => [...prev, current.id]);
      current = current.left;
    } else {
      addLog({ type: 'compare', text: `${val} > ${current.val}  →  go right` });
      setVisitedNodes((prev) => [...prev, current.id]);
      current = current.right;
    }
  }

  addLog({ type: 'error', text: `Value ${val} not found in the BST.` });
  setActiveNode(null);
}

/* ------------------------------------------------------------------ */
/*  BST Delete (animated, with step log)                              */
/*  Handles all three cases:                                          */
/*    1. Leaf node                                                    */
/*    2. One child                                                    */
/*    3. Two children (inorder successor)                             */
/* ------------------------------------------------------------------ */

export async function bstDeleteAnimated(
  root,
  val,
  { setActiveNode, setVisitedNodes, setDeletingNode, setSuccessorNode, addLog, speed }
) {
  if (!root) {
    addLog({ type: 'warn', text: 'Tree is empty. Nothing to delete.' });
    return null;
  }

  addLog({ type: 'start', text: `Deleting ${val} from BST…` });

  // --- Find the node and its parent ---
  let parent = null;
  let current = root;
  let direction = null; // 'left' | 'right'

  while (current && current.val !== val) {
    setActiveNode(current.id);
    await sleep(speed);

    if (val < current.val) {
      addLog({ type: 'compare', text: `${val} < ${current.val}  →  go left` });
      setVisitedNodes((prev) => [...prev, current.id]);
      parent = current;
      direction = 'left';
      current = current.left;
    } else {
      addLog({ type: 'compare', text: `${val} > ${current.val}  →  go right` });
      setVisitedNodes((prev) => [...prev, current.id]);
      parent = current;
      direction = 'right';
      current = current.right;
    }
  }

  if (!current) {
    addLog({ type: 'error', text: `Value ${val} not found. Cannot delete.` });
    setActiveNode(null);
    return root;
  }

  // Highlight the node to delete
  setActiveNode(current.id);
  setDeletingNode(current.id);
  await sleep(speed * 2);
  addLog({ type: 'info', text: `Found node ${val}. Determining deletion case…` });

  // ---- CASE 1: Leaf node (no children) ----
  if (!current.left && !current.right) {
    addLog({ type: 'delete', text: `Case 1 — Leaf node: simply remove ${val}.` });
    await sleep(speed);

    if (!parent) {
      // Deleting root which is a leaf
      setActiveNode(null);
      setDeletingNode(null);
      addLog({ type: 'success', text: `Deleted root node ${val}. Tree is now empty.` });
      return null;
    }
    parent[direction] = null;
    addLog({ type: 'success', text: `Removed leaf ${val} from ${parent.val}'s ${direction} child.` });
  }

  // ---- CASE 2: One child ----
  else if (!current.left || !current.right) {
    const child = current.left || current.right;
    const side = current.left ? 'left' : 'right';
    addLog({
      type: 'delete',
      text: `Case 2 — One child: replace ${val} with its ${side} child (${child.val}).`,
    });
    await sleep(speed);

    if (!parent) {
      // Deleting root with one child
      setActiveNode(null);
      setDeletingNode(null);
      addLog({ type: 'success', text: `Root ${val} replaced by ${child.val}.` });
      return child;
    }
    parent[direction] = child;
    addLog({ type: 'success', text: `Replaced ${val} with ${child.val} under ${parent.val}.` });
  }

  // ---- CASE 3: Two children (inorder successor) ----
  else {
    addLog({
      type: 'delete',
      text: `Case 3 — Two children: finding inorder successor of ${val}…`,
    });
    await sleep(speed);

    // Find inorder successor (smallest in right subtree)
    let succParent = current;
    let successor = current.right;

    setActiveNode(successor.id);
    await sleep(speed);

    while (successor.left) {
      addLog({ type: 'compare', text: `Going left to ${successor.left.val} to find minimum…` });
      setVisitedNodes((prev) => [...prev, successor.id]);
      succParent = successor;
      successor = successor.left;
      setActiveNode(successor.id);
      await sleep(speed);
    }

    setSuccessorNode(successor.id);
    addLog({
      type: 'info',
      text: `Inorder successor is ${successor.val}. Swapping with ${val}…`,
    });
    await sleep(speed * 2);

    // Copy successor value to current node
    current.val = successor.val;

    // Delete the successor (it has at most one right child)
    if (succParent === current) {
      succParent.right = successor.right;
    } else {
      succParent.left = successor.right;
    }

    addLog({
      type: 'success',
      text: `Replaced ${val} with successor ${successor.val} and removed successor.`,
    });
  }

  setActiveNode(null);
  setDeletingNode(null);
  setSuccessorNode(null);
  return root;
}
