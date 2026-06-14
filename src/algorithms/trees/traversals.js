// Helper to pause execution for animation
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const preOrderTraversal = async (root, setActiveNode, setVisitedNodes, speed) => {
  if (!root) return;
  
  // Set current node as active
  setActiveNode(root.id);
  await sleep(speed);
  
  // Mark as visited
  setVisitedNodes((prev) => [...prev, root.id]);
  setActiveNode(null);

  // Traverse left
  if (root.left) {
    await preOrderTraversal(root.left, setActiveNode, setVisitedNodes, speed);
  }
  
  // Traverse right
  if (root.right) {
    await preOrderTraversal(root.right, setActiveNode, setVisitedNodes, speed);
  }
};

export const inOrderTraversal = async (root, setActiveNode, setVisitedNodes, speed) => {
  if (!root) return;

  // Traverse left
  if (root.left) {
    await inOrderTraversal(root.left, setActiveNode, setVisitedNodes, speed);
  }
  
  // Set current node as active
  setActiveNode(root.id);
  await sleep(speed);
  
  // Mark as visited
  setVisitedNodes((prev) => [...prev, root.id]);
  setActiveNode(null);

  // Traverse right
  if (root.right) {
    await inOrderTraversal(root.right, setActiveNode, setVisitedNodes, speed);
  }
};

export const postOrderTraversal = async (root, setActiveNode, setVisitedNodes, speed) => {
  if (!root) return;

  // Traverse left
  if (root.left) {
    await postOrderTraversal(root.left, setActiveNode, setVisitedNodes, speed);
  }
  
  // Traverse right
  if (root.right) {
    await postOrderTraversal(root.right, setActiveNode, setVisitedNodes, speed);
  }

  // Set current node as active
  setActiveNode(root.id);
  await sleep(speed);
  
  // Mark as visited
  setVisitedNodes((prev) => [...prev, root.id]);
  setActiveNode(null);
};

export const levelOrderTraversal = async (root, setActiveNode, setVisitedNodes, speed) => {
  if (!root) return;

  const queue = [root];

  while (queue.length > 0) {
    const current = queue.shift();
    
    // Set current node as active
    setActiveNode(current.id);
    await sleep(speed);
    
    // Mark as visited
    setVisitedNodes((prev) => [...prev, current.id]);
    setActiveNode(null);

    if (current.left) queue.push(current.left);
    if (current.right) queue.push(current.right);
  }
};
