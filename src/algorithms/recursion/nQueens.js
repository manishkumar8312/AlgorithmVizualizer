// Optimized & Visualized N-Queens Problem using Backtracking
export async function solveNQueens(n, updateBoard, speed, findAllSolutions = false) {
  const board = Array(n).fill(null).map(() => Array(n).fill(0));
  const solutions = [];
  let steps = 0;

  // Helper arrays for O(1) safety checks
  const cols = Array(n).fill(false);
  const diag1 = Array(2 * n - 1).fill(false); // row - col + n - 1
  const diag2 = Array(2 * n - 1).fill(false); // row + col

  // Delay utility for animation timing
  const delay = (ms) =>
    new Promise((resolve) => setTimeout(() => requestAnimationFrame(resolve), ms));

  async function solveNQueensUtil(row) {
    steps++;

    // Base case: all queens placed
    if (row >= n) {
      const solution = board.map((r) => [...r]);
      solutions.push(solution);

      updateBoard({
        board: solution,
        status: "solution",
        solutionCount: solutions.length,
        steps,
      });
      await delay(speed * 3);

      return !findAllSolutions; // stop if not finding all
    }

    // Try placing queen in each column
    for (let col = 0; col < n; col++) {
      // Visualization: Trying this cell
      updateBoard({
        board: board.map((r) => [...r]),
        trying: { row, col },
        status: "trying",
        steps,
      });
      await delay(speed);

      // Check if placing queen is safe
      if (!cols[col] && !diag1[row - col + n - 1] && !diag2[row + col]) {
        // Place queen
        board[row][col] = 1;
        cols[col] = diag1[row - col + n - 1] = diag2[row + col] = true;

        updateBoard({
          board: board.map((r) => [...r]),
          placed: { row, col },
          status: "placing",
          steps,
        });
        await delay(speed);

        // Recurse to next row
        if (await solveNQueensUtil(row + 1)) {
          return true;
        }

        // Backtrack: Remove queen
        board[row][col] = 0;
        cols[col] = diag1[row - col + n - 1] = diag2[row + col] = false;

        updateBoard({
          board: board.map((r) => [...r]),
          removed: { row, col },
          status: "backtracking",
          steps,
        });
        await delay(speed);
      } else {
        // Unsafe position visualization
        updateBoard({
          board: board.map((r) => [...r]),
          unsafe: { row, col },
          status: "unsafe",
          steps,
        });
        await delay(speed);
      }
    }

    return false;
  }

  // Start solving
  const solved = await solveNQueensUtil(0);

  // No solution found
  if (solutions.length === 0) {
    updateBoard({
      board: board.map((r) => [...r]),
      status: "no-solution",
      steps,
    });
  }

  return {
    solved: solved || solutions.length > 0,
    board: solutions.length > 0 ? solutions[0] : board,
    solutions,
    totalSolutions: solutions.length,
    steps,
  };
}

// Generate all N-Queens solutions
export async function generateAllNQueensSolutions(n, updateBoard, speed) {
  return await solveNQueens(n, updateBoard, speed, true);
}

// Problem Info
export const nQueensInfo = {
  name: "N-Queens Problem",
  timeComplexity: "O(n!)",
  spaceComplexity: "O(n²)",
  description:
    "The N-Queens problem requires placing N queens on an N×N chessboard such that no two queens attack each other. This optimized solution uses backtracking with O(1) safety checks and supports animated visualization.",
};
