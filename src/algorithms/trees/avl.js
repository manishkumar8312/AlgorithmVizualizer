// src/algorithms/trees/avl.js
// AVL tree insertion with visual callbacks
// The function receives the root node, a value to insert, UI state setters, and speed.

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// Helper to get height
function height(node) {
  if (!node) return 0;
  return Math.max(height(node.left), height(node.right)) + 1;
}

// Right rotate
function rightRotate(y) {
  const x = y.left;
  const T2 = x.right;
  // Rotation
  x.right = y;
  y.left = T2;
  return x;
}

// Left rotate
function leftRotate(x) {
  const y = x.right;
  const T2 = y.left;
  y.left = x;
  x.right = T2;
  return y;
}

// Get balance factor
function getBalance(node) {
  if (!node) return 0;
  return height(node.left) - height(node.right);
}

export async function avlInsert(root, val, setActiveNode, setVisitedNodes, speed) {
  // Recursive insert with rebalancing
  async function insert(node, val) {
    if (!node) {
      const newId = Date.now();
      return { id: newId, val, left: null, right: null };
    }
    setActiveNode(node.id);
    await sleep(speed);
    setVisitedNodes(prev => [...prev, node.id]);

    if (val < node.val) {
      node.left = await insert(node.left, val);
    } else if (val > node.val) {
      node.right = await insert(node.right, val);
    } else {
      // duplicate values ignored for demo
      setActiveNode(null);
      return node;
    }

    // Update height and balance
    const balance = getBalance(node);

    // Left Left Case
    if (balance > 1 && val < node.left.val) {
      return rightRotate(node);
    }
    // Right Right Case
    if (balance < -1 && val > node.right.val) {
      return leftRotate(node);
    }
    // Left Right Case
    if (balance > 1 && val > node.left.val) {
      node.left = leftRotate(node.left);
      return rightRotate(node);
    }
    // Right Left Case
    if (balance < -1 && val < node.right.val) {
      node.right = rightRotate(node.right);
      return leftRotate(node);
    }

    return node;
  }

  const newRoot = await insert(root, val);
  // Overwrite root reference (caller holds reference via state)
  root.id = newRoot.id;
  root.val = newRoot.val;
  root.left = newRoot.left;
  root.right = newRoot.right;
  setActiveNode(null);
}
