// src/algorithms/trees/avlOperations.js
// Full AVL tree engine with animated insert, delete, rotation visualization,
// height/balance-factor display, and step-by-step logging.

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ------------------------------------------------------------------ */
/*  ID generation                                                     */
/* ------------------------------------------------------------------ */

let _nextId = 1;
const freshId = () => _nextId++;
export const resetIdCounter = () => { _nextId = 1; };

/* ------------------------------------------------------------------ */
/*  AVL node helpers                                                  */
/* ------------------------------------------------------------------ */

function nodeHeight(n) {
  return n ? n.height : 0;
}

function balanceFactor(n) {
  return n ? nodeHeight(n.left) - nodeHeight(n.right) : 0;
}

function updateHeight(n) {
  if (n) n.height = 1 + Math.max(nodeHeight(n.left), nodeHeight(n.right));
}

function minNode(n) {
  while (n && n.left) n = n.left;
  return n;
}

/* ------------------------------------------------------------------ */
/*  Rotations (pure, return new subtree root)                         */
/* ------------------------------------------------------------------ */

function rightRotate(y) {
  const x = y.left;
  const T2 = x.right;
  x.right = y;
  y.left = T2;
  updateHeight(y);
  updateHeight(x);
  return x;
}

function leftRotate(x) {
  const y = x.right;
  const T2 = y.left;
  y.left = x;
  x.right = T2;
  updateHeight(x);
  updateHeight(y);
  return y;
}

/* ------------------------------------------------------------------ */
/*  Generate a valid AVL tree                                         */
/* ------------------------------------------------------------------ */

function buildBalancedAVL(sorted, lo = 0, hi = sorted.length - 1) {
  if (lo > hi) return null;
  const mid = Math.floor((lo + hi) / 2);
  const node = {
    id: freshId(),
    val: sorted[mid],
    left: buildBalancedAVL(sorted, lo, mid - 1),
    right: buildBalancedAVL(sorted, mid + 1, hi),
    height: 1,
  };
  updateHeight(node);
  return node;
}

export function generateRandomAVL(count = 7, minVal = 5, maxVal = 95) {
  resetIdCounter();
  const pool = new Set();
  while (pool.size < count) {
    pool.add(Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal);
  }
  const sorted = [...pool].sort((a, b) => a - b);
  return buildBalancedAVL(sorted);
}

/* ------------------------------------------------------------------ */
/*  Layout – assign (x, y) using in-order index                      */
/* ------------------------------------------------------------------ */

function inorderList(node, out = []) {
  if (!node) return out;
  inorderList(node.left, out);
  out.push(node);
  inorderList(node.right, out);
  return out;
}

function treeDepth(node) {
  if (!node) return 0;
  return 1 + Math.max(treeDepth(node.left), treeDepth(node.right));
}

export function layoutTree(root, svgWidth = 1100, svgHeight = 460) {
  if (!root) return { nodes: [], edges: [] };

  const ordered = inorderList(root);
  const n = ordered.length;
  const h = treeDepth(root);

  const padX = 70;
  const usableW = svgWidth - padX * 2;
  const xGap = n > 1 ? usableW / (n - 1) : 0;

  const indexMap = new Map();
  ordered.forEach((nd, i) => indexMap.set(nd.id, i));

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
  let minV = Infinity;
  let maxV = -Infinity;

  const dfs = (node) => {
    if (!node) return;
    count++;
    if (node.val < minV) minV = node.val;
    if (node.val > maxV) maxV = node.val;
    dfs(node.left);
    dfs(node.right);
  };

  dfs(root);
  return { height: nodeHeight(root), nodeCount: count, min: minV, max: maxV };
}

/* ------------------------------------------------------------------ */
/*  AVL Insert – animated with step-by-step log                      */
/* ------------------------------------------------------------------ */

export async function avlInsertAnimated(
  root,
  val,
  { setActiveNode, setVisitedNodes, setRotatingNodes, addLog, refreshLayout, speed }
) {
  addLog({ type: 'start', text: `Inserting ${val} into AVL tree…` });

  async function insert(node) {
    // Base case – insert new leaf
    if (!node) {
      const newNode = { id: freshId(), val, left: null, right: null, height: 1 };
      addLog({ type: 'success', text: `Created new node ${val}.` });
      return newNode;
    }

    // Highlight current node
    setActiveNode(node.id);
    await sleep(speed);
    setVisitedNodes((prev) => [...prev, node.id]);

    // BST comparison
    if (val < node.val) {
      addLog({ type: 'compare', text: `${val} < ${node.val}  →  go left` });
      node.left = await insert(node.left);
    } else if (val > node.val) {
      addLog({ type: 'compare', text: `${val} > ${node.val}  →  go right` });
      node.right = await insert(node.right);
    } else {
      addLog({ type: 'warn', text: `${val} already exists. Skipping.` });
      return node;
    }

    // Update height
    updateHeight(node);
    const bf = balanceFactor(node);
    addLog({
      type: 'info',
      text: `Node ${node.val}: height=${node.height}, BF=${bf}`,
    });

    // Check for imbalance
    if (bf > 1 || bf < -1) {
      addLog({ type: 'warn', text: `⚠ Imbalance at node ${node.val} (BF=${bf}). Rotation needed!` });

      // Highlight the imbalanced node
      setActiveNode(node.id);
      setRotatingNodes([node.id]);
      await sleep(speed * 2);

      // LL Case
      if (bf > 1 && val < node.left.val) {
        addLog({ type: 'rotation', text: `LL Case → Right Rotate at ${node.val}` });
        setRotatingNodes([node.id, node.left.id]);
        await sleep(speed * 2);
        const result = rightRotate(node);
        addLog({ type: 'success', text: `Right rotation complete. New subtree root: ${result.val}` });
        refreshLayout(null); // signal relayout
        setRotatingNodes([]);
        await sleep(speed);
        return result;
      }

      // RR Case
      if (bf < -1 && val > node.right.val) {
        addLog({ type: 'rotation', text: `RR Case → Left Rotate at ${node.val}` });
        setRotatingNodes([node.id, node.right.id]);
        await sleep(speed * 2);
        const result = leftRotate(node);
        addLog({ type: 'success', text: `Left rotation complete. New subtree root: ${result.val}` });
        refreshLayout(null);
        setRotatingNodes([]);
        await sleep(speed);
        return result;
      }

      // LR Case
      if (bf > 1 && val > node.left.val) {
        addLog({ type: 'rotation', text: `LR Case → Left Rotate at ${node.left.val}, then Right Rotate at ${node.val}` });
        setRotatingNodes([node.id, node.left.id, node.left.right ? node.left.right.id : null].filter(Boolean));
        await sleep(speed * 2);
        node.left = leftRotate(node.left);
        addLog({ type: 'info', text: `Left rotation at ${node.left.right ? node.left.val : '?'} done.` });
        refreshLayout(null);
        await sleep(speed);
        const result = rightRotate(node);
        addLog({ type: 'success', text: `Right rotation complete. New subtree root: ${result.val}` });
        refreshLayout(null);
        setRotatingNodes([]);
        await sleep(speed);
        return result;
      }

      // RL Case
      if (bf < -1 && val < node.right.val) {
        addLog({ type: 'rotation', text: `RL Case → Right Rotate at ${node.right.val}, then Left Rotate at ${node.val}` });
        setRotatingNodes([node.id, node.right.id, node.right.left ? node.right.left.id : null].filter(Boolean));
        await sleep(speed * 2);
        node.right = rightRotate(node.right);
        addLog({ type: 'info', text: `Right rotation at ${node.right.val} done.` });
        refreshLayout(null);
        await sleep(speed);
        const result = leftRotate(node);
        addLog({ type: 'success', text: `Left rotation complete. New subtree root: ${result.val}` });
        refreshLayout(null);
        setRotatingNodes([]);
        await sleep(speed);
        return result;
      }

      setRotatingNodes([]);
    }

    return node;
  }

  const newRoot = await insert(root);
  setActiveNode(null);
  return newRoot;
}

/* ------------------------------------------------------------------ */
/*  AVL Delete – animated with step-by-step log                      */
/* ------------------------------------------------------------------ */

export async function avlDeleteAnimated(
  root,
  val,
  { setActiveNode, setVisitedNodes, setDeletingNode, setRotatingNodes, addLog, refreshLayout, speed }
) {
  if (!root) {
    addLog({ type: 'warn', text: 'Tree is empty. Nothing to delete.' });
    return null;
  }

  addLog({ type: 'start', text: `Deleting ${val} from AVL tree…` });

  async function deleteNode(node, value) {
    if (!node) {
      addLog({ type: 'error', text: `Value ${value} not found.` });
      return null;
    }

    setActiveNode(node.id);
    await sleep(speed);
    setVisitedNodes((prev) => [...prev, node.id]);

    if (value < node.val) {
      addLog({ type: 'compare', text: `${value} < ${node.val}  →  go left` });
      node.left = await deleteNode(node.left, value);
    } else if (value > node.val) {
      addLog({ type: 'compare', text: `${value} > ${node.val}  →  go right` });
      node.right = await deleteNode(node.right, value);
    } else {
      // Found the node to delete
      setDeletingNode(node.id);
      await sleep(speed * 2);

      // Case 1: Leaf
      if (!node.left && !node.right) {
        addLog({ type: 'delete', text: `Leaf node ${value} removed.` });
        return null;
      }

      // Case 2: One child
      if (!node.left) {
        addLog({ type: 'delete', text: `Node ${value} has right child only → replace with ${node.right.val}.` });
        return node.right;
      }
      if (!node.right) {
        addLog({ type: 'delete', text: `Node ${value} has left child only → replace with ${node.left.val}.` });
        return node.left;
      }

      // Case 3: Two children – find inorder successor
      const successor = minNode(node.right);
      addLog({ type: 'info', text: `Two children. Inorder successor is ${successor.val}.` });
      await sleep(speed);
      node.val = successor.val;
      addLog({ type: 'info', text: `Replaced ${value} with ${successor.val}. Now deleting successor…` });
      node.right = await deleteNode(node.right, successor.val);
    }

    if (!node) return null;

    // Update height and check balance
    updateHeight(node);
    const bf = balanceFactor(node);
    addLog({ type: 'info', text: `Node ${node.val}: height=${node.height}, BF=${bf}` });

    if (bf > 1 || bf < -1) {
      addLog({ type: 'warn', text: `⚠ Imbalance at node ${node.val} (BF=${bf}). Rotation needed!` });
      setActiveNode(node.id);
      setRotatingNodes([node.id]);
      await sleep(speed * 2);

      // LL
      if (bf > 1 && balanceFactor(node.left) >= 0) {
        addLog({ type: 'rotation', text: `LL Case → Right Rotate at ${node.val}` });
        setRotatingNodes([node.id, node.left.id]);
        await sleep(speed * 2);
        const result = rightRotate(node);
        addLog({ type: 'success', text: `Right rotation complete. New subtree root: ${result.val}` });
        refreshLayout(null);
        setRotatingNodes([]);
        await sleep(speed);
        return result;
      }

      // LR
      if (bf > 1 && balanceFactor(node.left) < 0) {
        addLog({ type: 'rotation', text: `LR Case → Left Rotate at ${node.left.val}, then Right Rotate at ${node.val}` });
        setRotatingNodes([node.id, node.left.id]);
        await sleep(speed * 2);
        node.left = leftRotate(node.left);
        refreshLayout(null);
        await sleep(speed);
        const result = rightRotate(node);
        addLog({ type: 'success', text: `Double rotation complete. New subtree root: ${result.val}` });
        refreshLayout(null);
        setRotatingNodes([]);
        await sleep(speed);
        return result;
      }

      // RR
      if (bf < -1 && balanceFactor(node.right) <= 0) {
        addLog({ type: 'rotation', text: `RR Case → Left Rotate at ${node.val}` });
        setRotatingNodes([node.id, node.right.id]);
        await sleep(speed * 2);
        const result = leftRotate(node);
        addLog({ type: 'success', text: `Left rotation complete. New subtree root: ${result.val}` });
        refreshLayout(null);
        setRotatingNodes([]);
        await sleep(speed);
        return result;
      }

      // RL
      if (bf < -1 && balanceFactor(node.right) > 0) {
        addLog({ type: 'rotation', text: `RL Case → Right Rotate at ${node.right.val}, then Left Rotate at ${node.val}` });
        setRotatingNodes([node.id, node.right.id]);
        await sleep(speed * 2);
        node.right = rightRotate(node.right);
        refreshLayout(null);
        await sleep(speed);
        const result = leftRotate(node);
        addLog({ type: 'success', text: `Double rotation complete. New subtree root: ${result.val}` });
        refreshLayout(null);
        setRotatingNodes([]);
        await sleep(speed);
        return result;
      }

      setRotatingNodes([]);
    }

    return node;
  }

  const newRoot = await deleteNode(root, val);
  setActiveNode(null);
  setDeletingNode(null);
  setRotatingNodes([]);
  return newRoot;
}

/* ------------------------------------------------------------------ */
/*  AVL Search – animated (same as BST search, AVL is a BST)         */
/* ------------------------------------------------------------------ */

export async function avlSearchAnimated(
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

    const bf = balanceFactor(current);
    addLog({ type: 'info', text: `At node ${current.val} (h=${current.height}, BF=${bf})` });

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

  addLog({ type: 'error', text: `Value ${val} not found in the AVL tree.` });
  setActiveNode(null);
}
