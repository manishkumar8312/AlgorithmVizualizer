export const recursionAlgorithmsData = {
  factorial: {
    name: "Factorial",
    description: "Calculates the factorial of a non-negative integer n (n!). The base case is 0! = 1. For n > 0, n! = n * (n-1)!.",
    complexities: { time: "O(n)", space: "O(n)" },
    code: `function factorial(n) {
  if (n === 0 || n === 1) return 1;
  return n * factorial(n - 1);
}`
  },
  fibonacci: {
    name: "Fibonacci Sequence",
    description: "Finds the nth number in the Fibonacci sequence. The sequence starts with 0 and 1, and each subsequent number is the sum of the previous two.",
    complexities: { time: "O(2^n)", space: "O(n)" },
    code: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`
  },
  permutations: {
    name: "Permutations",
    description: "Generates all possible permutations of an array. It works by swapping elements to explore different arrangements and backtracking.",
    complexities: { time: "O(n * n!)", space: "O(n!)" },
    code: `function permute(nums, current, result) {
  if (current.length === nums.length) {
    result.push([...current]);
    return;
  }
  for (let i = 0; i < nums.length; i++) {
    if (current.includes(nums[i])) continue;
    current.push(nums[i]);
    permute(nums, current, result);
    current.pop(); // backtrack
  }
}`
  },
  combinationSum: {
    name: "Combination Sum",
    description: "Finds all unique combinations in an array where the chosen numbers sum to a target. The same number may be chosen unlimited times.",
    complexities: { time: "O(N^(T/M))", space: "O(T/M)" },
    code: `function combinationSum(candidates, target, start, current, result) {
  if (target === 0) {
    result.push([...current]);
    return;
  }
  for (let i = start; i < candidates.length; i++) {
    if (candidates[i] <= target) {
      current.push(candidates[i]);
      combinationSum(candidates, target - candidates[i], i, current, result);
      current.pop(); // backtrack
    }
  }
}`
  },
  generateParentheses: {
    name: "Generate Parentheses",
    description: "Given n pairs of parentheses, generates all combinations of well-formed parentheses.",
    complexities: { time: "O(4^n / sqrt(n))", space: "O(n)" },
    code: `function generateParentheses(n, open, close, current, result) {
  if (current.length === n * 2) {
    result.push(current);
    return;
  }
  if (open < n) {
    generateParentheses(n, open + 1, close, current + '(', result);
  }
  if (close < open) {
    generateParentheses(n, open, close + 1, current + ')', result);
  }
}`
  },
  subsets: {
    name: "Subset Generation",
    description: "Generates all possible subsets (the power set) of a set of unique elements. For each element, we either include it or exclude it.",
    complexities: { time: "O(N * 2^N)", space: "O(N)" },
    code: `function subsets(nums, index, current, result) {
  if (index === nums.length) {
    result.push([...current]);
    return;
  }
  // Include
  current.push(nums[index]);
  subsets(nums, index + 1, current, result);
  current.pop(); // backtrack
  
  // Exclude
  subsets(nums, index + 1, current, result);
}`
  },
  nQueens: {
    name: "N-Queens",
    description: "Places N chess queens on an N×N chessboard so that no two queens threaten each other.",
    complexities: { time: "O(N!)", space: "O(N)" },
    code: `function solveNQueens(board, row, n) {
  if (row === n) return true;
  for (let col = 0; col < n; col++) {
    if (isSafe(board, row, col)) {
      board[row][col] = 'Q';
      if (solveNQueens(board, row + 1, n)) return true;
      board[row][col] = '.'; // backtrack
    }
  }
  return false;
}`
  },
  sudoku: {
    name: "Sudoku Solver",
    description: "Fills a 9x9 grid so that each column, each row, and each of the nine 3x3 subgrids contain all digits from 1 to 9.",
    complexities: { time: "O(9^(n*n))", space: "O(n*n)" },
    code: `function solveSudoku(board) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === '.') {
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, r, c, num)) {
            board[r][c] = num;
            if (solveSudoku(board)) return true;
            board[r][c] = '.'; // backtrack
          }
        }
        return false;
      }
    }
  }
  return true;
}`
  },
  ratInMaze: {
    name: "Rat in a Maze",
    description: "Finds a path from the top-left to the bottom-right of a maze, avoiding obstacles.",
    complexities: { time: "O(3^(N^2))", space: "O(N^2)" },
    code: `function solveMaze(maze, x, y, sol) {
  if (x === N-1 && y === N-1) return true;
  if (isSafe(maze, x, y)) {
    sol[x][y] = 1;
    if (solveMaze(maze, x + 1, y, sol)) return true;
    if (solveMaze(maze, x, y + 1, sol)) return true;
    sol[x][y] = 0; // backtrack
  }
  return false;
}`
  },
  knightsTour: {
    name: "Knight's Tour",
    description: "Finds a sequence of moves for a knight on a chessboard such that the knight visits every square exactly once.",
    complexities: { time: "O(8^(N^2))", space: "O(N^2)" },
    code: `function solveKT(x, y, movei, sol) {
  if (movei === N * N) return true;
  for (let k = 0; k < 8; k++) {
    let next_x = x + xMove[k];
    let next_y = y + yMove[k];
    if (isSafe(next_x, next_y, sol)) {
      sol[next_x][next_y] = movei;
      if (solveKT(next_x, next_y, movei + 1, sol)) return true;
      sol[next_x][next_y] = -1; // backtrack
    }
  }
  return false;
}`
  },
  towerOfHanoi: {
    name: "Tower of Hanoi",
    description: "Moves a stack of disks from one rod to another, following the rules: move one disk at a time, and a larger disk cannot be placed on a smaller one.",
    complexities: { time: "O(2^n)", space: "O(n)" },
    code: `function hanoi(n, source, target, auxiliary) {
  if (n === 1) {
    moveDisk(source, target);
    return;
  }
  hanoi(n - 1, source, auxiliary, target);
  moveDisk(source, target);
  hanoi(n - 1, auxiliary, target, source);
}`
  }
};
