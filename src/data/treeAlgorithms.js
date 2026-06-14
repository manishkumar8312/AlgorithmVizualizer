// src/data/treeAlgorithms.js
// Metadata for each tree algorithm used by TreeAlgorithms page.
// Each entry contains a name, description, time/space complexity, and optional UI input flag.

export const algorithmData = {
  traversals: {
    preOrder: {
      name: 'Pre‑order Traversal',
      description: 'Visit root, then left subtree, then right subtree.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(h) (recursion stack)',
      inputRequired: false,
    },
    inOrder: {
      name: 'In‑order Traversal',
      description: 'Left subtree → root → right subtree (produces sorted order for BST).',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(h)',
      inputRequired: false,
    },
    postOrder: {
      name: 'Post‑order Traversal',
      description: 'Left subtree → right subtree → root.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(h)',
      inputRequired: false,
    },
    levelOrder: {
      name: 'Level‑order Traversal',
      description: 'Breadth‑first traversal using a queue.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(w) where w is max width',
      inputRequired: false,
    },
  },
  bst: {
    insert: {
      name: 'BST Insert',
      description: 'Insert a value maintaining binary‑search‑tree property.',
      timeComplexity: 'O(h)',
      spaceComplexity: 'O(1)',
      inputRequired: true,
      inputValue: 42, // example placeholder; UI can let user modify
    },
    delete: {
      name: 'BST Delete',
      description: 'Remove a node while preserving BST order.',
      timeComplexity: 'O(h)',
      spaceComplexity: 'O(1)',
      inputRequired: true,
      inputValue: 30,
    },
    search: {
      name: 'BST Search',
      description: 'Find a node by value.',
      timeComplexity: 'O(h)',
      spaceComplexity: 'O(1)',
      inputRequired: true,
      inputValue: 15,
    },
  },
  avl: {
    insert: {
      name: 'AVL Insert',
      description: 'Insert with automatic rebalancing via rotations.',
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(1)',
      inputRequired: true,
      inputValue: 55,
    },
  },
  heap: {
    insert: {
      name: 'Heap Insert',
      description: 'Insert into a binary max‑heap.',
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(1)',
      inputRequired: true,
      inputValue: 23,
    },
    delete: {
      name: 'Heap Delete',
      description: 'Remove the root element from a max‑heap.',
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(1)',
      inputRequired: false,
    },
    heapify: {
      name: 'Heapify',
      description: 'Convert an array into a valid heap.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      inputRequired: true,
      inputValue: [5,2,9,1,6],
    },
  },
  trie: {
    insert: {
      name: 'Trie Insert',
      description: 'Insert a word into a prefix tree.',
      timeComplexity: 'O(k)',
      spaceComplexity: 'O(k)',
      inputRequired: true,
      inputValue: 'hello',
    },
    search: {
      name: 'Trie Search',
      description: 'Check if a word exists in the trie.',
      timeComplexity: 'O(k)',
      spaceComplexity: 'O(1)',
      inputRequired: true,
      inputValue: 'world',
    },
    delete: {
      name: 'Trie Delete',
      description: 'Remove a word from the trie.',
      timeComplexity: 'O(k)',
      spaceComplexity: 'O(1)',
      inputRequired: true,
      inputValue: 'test',
    },
  },
  segmentTree: {
    build: {
      name: 'Segment Tree Build',
      description: 'Construct a segment tree for range queries.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(4n)',
      inputRequired: true,
      inputValue: [3,8,7,6,2,5,4,1],
    },
    query: {
      name: 'Segment Tree Query',
      description: 'Query a range (e.g., sum) in O(log n).',
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(1)',
      inputRequired: true,
      inputValue: { l: 2, r: 5 },
    },
    update: {
      name: 'Segment Tree Update',
      description: 'Update a single element and propagate changes.',
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(1)',
      inputRequired: true,
      inputValue: { index: 3, newVal: 10 },
    },
  },
};
