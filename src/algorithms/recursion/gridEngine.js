// src/algorithms/recursion/gridEngine.js
// Trace generator for Grid-based backtracking algorithms.

function cloneBoard(b) {
  return b.map(row => [...row]);
}

// --- N-Queens ---
export const runNQueensTrace = (n) => {
  const trace = [];
  const stack = [];
  const board = Array(n).fill(null).map(() => Array(n).fill('.'));

  function isSafe(b, row, col) {
    for (let i = 0; i < row; i++) {
      if (b[i][col] === 'Q') return false;
      const rowDiff = row - i;
      if (col - rowDiff >= 0 && b[i][col - rowDiff] === 'Q') return false;
      if (col + rowDiff < n && b[i][col + rowDiff] === 'Q') return false;
    }
    return true;
  }

  function recurse(row) {
    stack.push(`solve(${row})`);
    if (row === n) {
      trace.push({
        type: 'SUCCESS',
        board: cloneBoard(board),
        message: 'All queens placed successfully!',
        stack: [...stack]
      });
      stack.pop();
      return true;
    }

    for (let col = 0; col < n; col++) {
      trace.push({
        type: 'TRY',
        row, col,
        board: cloneBoard(board),
        message: `Trying queen at row ${row}, col ${col}`,
        stack: [...stack]
      });

      if (isSafe(board, row, col)) {
        board[row][col] = 'Q';
        trace.push({
          type: 'PLACE',
          row, col,
          board: cloneBoard(board),
          message: `Placed queen at row ${row}, col ${col}`,
          stack: [...stack]
        });

        if (recurse(row + 1)) {
          stack.pop();
          return true;
        }

        board[row][col] = '.';
        trace.push({
          type: 'BACKTRACK',
          row, col,
          board: cloneBoard(board),
          message: `Backtracking: removed queen from row ${row}, col ${col}`,
          stack: [...stack]
        });
      } else {
        trace.push({
          type: 'INVALID',
          row, col,
          board: cloneBoard(board),
          message: `Position row ${row}, col ${col} is not safe`,
          stack: [...stack]
        });
      }
    }
    
    stack.pop();
    return false;
  }

  trace.push({ type: 'START', board: cloneBoard(board), message: `Starting N-Queens for N=${n}`, stack: [] });
  recurse(0);
  if (trace[trace.length - 1].type !== 'SUCCESS') {
    trace.push({ type: 'FAIL', board: cloneBoard(board), message: 'No solution found', stack: [] });
  }
  return trace;
};

// --- Sudoku Solver ---
export const runSudokuTrace = (initialBoard) => {
  const trace = [];
  const stack = [];
  const board = cloneBoard(initialBoard);

  function isValid(b, r, c, num) {
    const strNum = String(num);
    for (let i = 0; i < 9; i++) {
      if (b[r][i] === strNum && i !== c) return false;
      if (b[i][c] === strNum && i !== r) return false;
      const subR = 3 * Math.floor(r / 3) + Math.floor(i / 3);
      const subC = 3 * Math.floor(c / 3) + (i % 3);
      if (b[subR][subC] === strNum && (subR !== r || subC !== c)) return false;
    }
    return true;
  }

  function recurse() {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === '.') {
          stack.push(`solve(${r}, ${c})`);
          
          for (let num = 1; num <= 9; num++) {
            trace.push({
              type: 'TRY',
              row: r, col: c, val: num,
              board: cloneBoard(board),
              message: `Trying ${num} at row ${r}, col ${c}`,
              stack: [...stack]
            });

            if (isValid(board, r, c, num)) {
              board[r][c] = String(num);
              trace.push({
                type: 'PLACE',
                row: r, col: c, val: num,
                board: cloneBoard(board),
                message: `Placed ${num} at row ${r}, col ${c}`,
                stack: [...stack]
              });

              if (recurse()) return true;

              board[r][c] = '.';
              trace.push({
                type: 'BACKTRACK',
                row: r, col: c, val: num,
                board: cloneBoard(board),
                message: `Backtracking: removed ${num} from row ${r}, col ${c}`,
                stack: [...stack]
              });
            } else {
              trace.push({
                type: 'INVALID',
                row: r, col: c, val: num,
                board: cloneBoard(board),
                message: `${num} is invalid at row ${r}, col ${c}`,
                stack: [...stack]
              });
            }
          }
          stack.pop();
          return false;
        }
      }
    }
    return true; // Solved
  }

  trace.push({ type: 'START', board: cloneBoard(board), message: 'Starting Sudoku Solver', stack: [] });
  if (recurse()) {
    trace.push({ type: 'SUCCESS', board: cloneBoard(board), message: 'Sudoku solved successfully!', stack: [] });
  } else {
    trace.push({ type: 'FAIL', board: cloneBoard(board), message: 'No solution exists', stack: [] });
  }
  return trace;
};

// --- Rat in a Maze ---
export const runRatInMazeTrace = (maze) => {
  const n = maze.length;
  const trace = [];
  const stack = [];
  const sol = Array(n).fill(null).map(() => Array(n).fill(0));

  function isSafe(x, y) {
    return x >= 0 && x < n && y >= 0 && y < n && maze[x][y] === 1 && sol[x][y] === 0;
  }

  const dx = [1, 0]; // Down, Right (simplified to standard 2-directions, can add Up/Left if needed)
  const dy = [0, 1];
  const moves = ['D', 'R'];

  function recurse(x, y) {
    stack.push(`solve(${x}, ${y})`);
    
    if (x === n - 1 && y === n - 1) {
      sol[x][y] = 1;
      trace.push({
        type: 'SUCCESS',
        row: x, col: y,
        board: cloneBoard(sol),
        maze: cloneBoard(maze),
        message: 'Rat reached the cheese!',
        stack: [...stack]
      });
      stack.pop();
      return true;
    }

    if (isSafe(x, y)) {
      sol[x][y] = 1;
      trace.push({
        type: 'PLACE',
        row: x, col: y,
        board: cloneBoard(sol),
        maze: cloneBoard(maze),
        message: `Rat moved to row ${x}, col ${y}`,
        stack: [...stack]
      });

      for (let k = 0; k < 2; k++) {
        const nextX = x + dx[k];
        const nextY = y + dy[k];
        
        trace.push({
          type: 'TRY',
          row: nextX, col: nextY,
          board: cloneBoard(sol),
          maze: cloneBoard(maze),
          message: `Rat trying to move ${moves[k]} to row ${nextX}, col ${nextY}`,
          stack: [...stack]
        });

        if (recurse(nextX, nextY)) {
          stack.pop();
          return true;
        }
      }

      sol[x][y] = 0;
      trace.push({
        type: 'BACKTRACK',
        row: x, col: y,
        board: cloneBoard(sol),
        maze: cloneBoard(maze),
        message: `Backtracking from row ${x}, col ${y}`,
        stack: [...stack]
      });
    } else {
      trace.push({
          type: 'INVALID',
          row: x, col: y,
          board: cloneBoard(sol),
          maze: cloneBoard(maze),
          message: `Position row ${x}, col ${y} is invalid or blocked`,
          stack: [...stack]
      });
    }

    stack.pop();
    return false;
  }

  trace.push({ type: 'START', board: cloneBoard(sol), maze: cloneBoard(maze), message: 'Rat starting at 0, 0', stack: [] });
  if (!recurse(0, 0)) {
    trace.push({ type: 'FAIL', board: cloneBoard(sol), maze: cloneBoard(maze), message: 'No path found', stack: [] });
  }
  return trace;
};

// --- Knight's Tour ---
export const runKnightsTourTrace = (n) => {
  const trace = [];
  const stack = [];
  const sol = Array(n).fill(null).map(() => Array(n).fill(-1));

  const xMove = [2, 1, -1, -2, -2, -1, 1, 2];
  const yMove = [1, 2, 2, 1, -1, -2, -2, -1];

  function isSafe(x, y) {
    return x >= 0 && x < n && y >= 0 && y < n && sol[x][y] === -1;
  }

  function recurse(x, y, movei) {
    stack.push(`move(${movei})`);
    
    if (movei === n * n) {
      trace.push({
        type: 'SUCCESS',
        board: cloneBoard(sol),
        message: "Knight's tour completed successfully!",
        stack: [...stack]
      });
      stack.pop();
      return true;
    }

    for (let k = 0; k < 8; k++) {
      let nextX = x + xMove[k];
      let nextY = y + yMove[k];

      trace.push({
        type: 'TRY',
        row: nextX, col: nextY,
        board: cloneBoard(sol),
        message: `Trying move ${movei} to row ${nextX}, col ${nextY}`,
        stack: [...stack]
      });

      if (isSafe(nextX, nextY)) {
        sol[nextX][nextY] = movei;
        trace.push({
          type: 'PLACE',
          row: nextX, col: nextY,
          board: cloneBoard(sol),
          message: `Knight moved to row ${nextX}, col ${nextY} (Step ${movei})`,
          stack: [...stack]
        });

        if (recurse(nextX, nextY, movei + 1)) {
          stack.pop();
          return true;
        }

        sol[nextX][nextY] = -1;
        trace.push({
          type: 'BACKTRACK',
          row: nextX, col: nextY,
          board: cloneBoard(sol),
          message: `Backtracking: removed step ${movei} from row ${nextX}, col ${nextY}`,
          stack: [...stack]
        });
      } else {
        trace.push({
          type: 'INVALID',
          row: nextX, col: nextY,
          board: cloneBoard(sol),
          message: `Move ${movei} to row ${nextX}, col ${nextY} is invalid`,
          stack: [...stack]
        });
      }
    }

    stack.pop();
    return false;
  }

  sol[0][0] = 0;
  trace.push({ type: 'START', board: cloneBoard(sol), message: `Starting Knight's Tour for N=${n} at 0,0`, stack: [] });
  if (!recurse(0, 0, 1)) {
    trace.push({ type: 'FAIL', board: cloneBoard(sol), message: 'No tour found', stack: [] });
  }
  return trace;
};
