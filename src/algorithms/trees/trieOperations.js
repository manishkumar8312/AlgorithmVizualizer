// src/algorithms/trees/trieOperations.js
// Full Trie (Prefix Tree) engine with layout and animated operations.

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ------------------------------------------------------------------ */
/*  ID generation & Node Helpers                                      */
/* ------------------------------------------------------------------ */

let _nextId = 1;
const freshId = () => _nextId++;
export const resetTrieIdCounter = () => { _nextId = 1; };

export function createTrieNode(char = '') {
  return {
    id: freshId(),
    char,
    children: {}, // map of char -> node
    isEnd: false,
    // layout coords
    x: 0,
    y: 0,
  };
}

// Generate random list of words for the Trie
export function generateRandomWords(count = 5) {
  const words = ['cat', 'car', 'cart', 'bat', 'ball', 'dog', 'door', 'dot', 'apple', 'ape', 'app', 'bee'];
  const shuffled = [...words].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function buildTrieFromWords(words) {
  resetTrieIdCounter();
  const root = createTrieNode('ROOT'); // Root usually conceptually empty, use 'ROOT' as label
  words.forEach(word => {
    let curr = root;
    for (const char of word) {
      if (!curr.children[char]) {
        curr.children[char] = createTrieNode(char);
      }
      curr = curr.children[char];
    }
    curr.isEnd = true;
  });
  return root;
}

/* ------------------------------------------------------------------ */
/*  Tree Layout (N-ary Tree)                                          */
/* ------------------------------------------------------------------ */

export function layoutTrie(root, svgWidth = 1100, svgHeight = 460) {
  if (!root) return { nodes: [], edges: [] };

  const padY = 60;
  const yGap = 70; // Fixed vertical gap between levels

  // 1. First pass: compute subtree width (number of leaves)
  function computeWidths(node) {
    const keys = Object.keys(node.children).sort();
    if (keys.length === 0) {
      node.leafWidth = 1;
      return 1;
    }
    let total = 0;
    for (const k of keys) {
      total += computeWidths(node.children[k]);
    }
    node.leafWidth = total;
    return total;
  }
  
  computeWidths(root);

  // 2. Second pass: assign X and Y coordinates
  const padX = 50;
  const usableW = svgWidth - padX * 2;
  const unitW = root.leafWidth > 0 ? usableW / root.leafWidth : 0;

  const nodes = [];
  const edges = [];

  function assignCoords(node, depth, xStart) {
    node.y = padY + depth * yGap;
    
    // Node's x is the center of its allocated width bounds
    const allocatedWidth = node.leafWidth * unitW;
    node.x = xStart + allocatedWidth / 2;
    nodes.push(node);

    const keys = Object.keys(node.children).sort();
    let currentX = xStart;

    for (const k of keys) {
      const child = node.children[k];
      edges.push({ from: node, to: child, char: k });
      assignCoords(child, depth + 1, currentX);
      currentX += child.leafWidth * unitW;
    }
  }

  assignCoords(root, 0, padX);

  return { nodes, edges };
}

/* ------------------------------------------------------------------ */
/*  Tree Statistics                                                   */
/* ------------------------------------------------------------------ */

export function getTrieStats(root) {
  if (!root) return { wordCount: 0, nodeCount: 0, maxDepth: 0 };

  let words = 0;
  let nodes = 0;
  let maxD = 0;

  function dfs(node, depth) {
    nodes++;
    if (depth > maxD) maxD = depth;
    if (node.isEnd) words++;
    for (const k in node.children) {
      dfs(node.children[k], depth + 1);
    }
  }

  dfs(root, 0);
  return { wordCount: words, nodeCount: nodes, maxDepth: maxD };
}

/* ------------------------------------------------------------------ */
/*  Trie Insert – Animated                                            */
/* ------------------------------------------------------------------ */

export async function trieInsertAnimated(
  root,
  word,
  { setActiveNode, setVisitedNodes, addLog, refreshLayout, speed }
) {
  if (!word || word.trim() === '') return root;
  const w = word.toLowerCase().trim();
  
  addLog({ type: 'start', text: `Inserting word '${w}'…` });
  
  let curr = root;
  setActiveNode(curr.id);
  await sleep(speed);
  setVisitedNodes(prev => [...prev, curr.id]);

  for (let i = 0; i < w.length; i++) {
    const char = w[i];
    addLog({ type: 'info', text: `Processing char '${char}'…` });
    
    if (!curr.children[char]) {
      addLog({ type: 'success', text: `Creating new node for '${char}'.` });
      curr.children[char] = createTrieNode(char);
      refreshLayout(); // Relayout immediately
      await sleep(speed);
    } else {
      addLog({ type: 'compare', text: `Node '${char}' already exists. Moving down.` });
    }

    curr = curr.children[char];
    setActiveNode(curr.id);
    await sleep(speed);
    setVisitedNodes(prev => [...prev, curr.id]);
  }

  if (!curr.isEnd) {
    curr.isEnd = true;
    addLog({ type: 'success', text: `Marked '${w[w.length-1]}' as end of word.` });
    refreshLayout();
  } else {
    addLog({ type: 'warn', text: `Word '${w}' is already in the Trie.` });
  }

  setActiveNode(null);
  return root;
}

/* ------------------------------------------------------------------ */
/*  Trie Search – Animated                                            */
/* ------------------------------------------------------------------ */

export async function trieSearchAnimated(
  root,
  word,
  { setActiveNode, setVisitedNodes, setFoundNodes, addLog, speed }
) {
  if (!word || word.trim() === '') return;
  const w = word.toLowerCase().trim();
  
  addLog({ type: 'start', text: `Searching for word '${w}'…` });

  let curr = root;
  setActiveNode(curr.id);
  await sleep(speed);
  setVisitedNodes(prev => [...prev, curr.id]);

  for (let i = 0; i < w.length; i++) {
    const char = w[i];
    
    if (!curr.children[char]) {
      addLog({ type: 'error', text: `Path for '${char}' not found. Word does not exist.` });
      setActiveNode(null);
      return false;
    }
    
    addLog({ type: 'compare', text: `Matched '${char}'. Moving down.` });
    curr = curr.children[char];
    setActiveNode(curr.id);
    await sleep(speed);
    setVisitedNodes(prev => [...prev, curr.id]);
  }

  if (curr.isEnd) {
    addLog({ type: 'success', text: `Found '${w}' in the Trie!` });
    setFoundNodes([curr.id]);
    setActiveNode(null);
    return true;
  } else {
    addLog({ type: 'warn', text: `Prefix '${w}' exists, but it's not marked as a complete word.` });
    setActiveNode(null);
    return false;
  }
}

/* ------------------------------------------------------------------ */
/*  Trie Autocomplete (Prefix Search) – Animated                      */
/* ------------------------------------------------------------------ */

export async function trieAutocompleteAnimated(
  root,
  prefix,
  { setActiveNode, setVisitedNodes, setFoundNodes, addLog, speed }
) {
  if (!prefix || prefix.trim() === '') return;
  const p = prefix.toLowerCase().trim();
  
  addLog({ type: 'start', text: `Searching for prefix '${p}'…` });

  let curr = root;
  setActiveNode(curr.id);
  await sleep(speed);
  setVisitedNodes(prev => [...prev, curr.id]);

  // 1. Find the prefix node
  for (let i = 0; i < p.length; i++) {
    const char = p[i];
    if (!curr.children[char]) {
      addLog({ type: 'error', text: `Prefix '${p}' not found.` });
      setActiveNode(null);
      return [];
    }
    curr = curr.children[char];
    setActiveNode(curr.id);
    await sleep(speed);
    setVisitedNodes(prev => [...prev, curr.id]);
  }

  addLog({ type: 'success', text: `Prefix '${p}' found! Collecting all words below…` });

  // 2. DFS to find all end nodes
  const foundWords = [];
  const foundNodeIds = [];

  async function dfs(node, currentWord) {
    setActiveNode(node.id);
    await sleep(speed * 0.5); // faster DFS
    setVisitedNodes(prev => [...prev, node.id]);

    if (node.isEnd) {
      foundWords.push(currentWord);
      foundNodeIds.push(node.id);
      addLog({ type: 'info', text: `Found word: '${currentWord}'` });
    }

    const keys = Object.keys(node.children).sort();
    for (const k of keys) {
      await dfs(node.children[k], currentWord + k);
    }
  }

  await dfs(curr, p);

  if (foundWords.length > 0) {
    addLog({ type: 'success', text: `Autocomplete results: ${foundWords.join(', ')}` });
    setFoundNodes(foundNodeIds);
  } else {
    addLog({ type: 'warn', text: `No complete words found for prefix '${p}'.` });
  }

  setActiveNode(null);
  return foundWords;
}

/* ------------------------------------------------------------------ */
/*  Trie Delete – Animated                                            */
/* ------------------------------------------------------------------ */

export async function trieDeleteAnimated(
  root,
  word,
  { setActiveNode, setVisitedNodes, setDeletingNode, addLog, refreshLayout, speed }
) {
  if (!word || word.trim() === '') return;
  const w = word.toLowerCase().trim();
  
  addLog({ type: 'start', text: `Deleting word '${w}'…` });

  async function deleteRec(node, depth) {
    if (!node) return false;
    
    setActiveNode(node.id);
    await sleep(speed);
    setVisitedNodes(prev => [...prev, node.id]);

    // Base case: end of the word
    if (depth === w.length) {
      if (!node.isEnd) {
        addLog({ type: 'warn', text: `Word '${w}' not present in Trie.` });
        return false;
      }
      
      node.isEnd = false;
      addLog({ type: 'delete', text: `Unmarked end-of-word for '${w}'.` });
      refreshLayout();
      await sleep(speed);
      
      // If node has no children, it can be safely deleted
      return Object.keys(node.children).length === 0;
    }

    const char = w[depth];
    const child = node.children[char];
    
    if (!child) {
      addLog({ type: 'warn', text: `Path broken at '${char}'. Word not found.` });
      return false;
    }

    // Recurse
    const shouldDeleteChild = await deleteRec(child, depth + 1);

    // Backtrack logic
    setActiveNode(node.id); // going back up
    await sleep(speed);

    if (shouldDeleteChild) {
      setDeletingNode(child.id);
      addLog({ type: 'delete', text: `Deleting node '${char}' as it's no longer part of any word.` });
      await sleep(speed);
      
      delete node.children[char];
      setDeletingNode(null);
      refreshLayout();
      
      // Return true if current node is also a leaf AND not end of another word
      return !node.isEnd && Object.keys(node.children).length === 0;
    }

    return false;
  }

  await deleteRec(root, 0);
  setActiveNode(null);
  addLog({ type: 'success', text: `Delete operation complete.` });
  return root;
}
