import React, { useState, useEffect } from "react";
import { Play, RotateCcw, Plus, Minus } from "lucide-react";
import { SPEED_PRESETS, COLORS } from "../utils/animationHelpers";

const RecursionVisualizer = ({ algorithm, algorithmInfo, type }) => {
  const [towers, setTowers] = useState([[], [], []]);
  const [numDisks, setNumDisks] = useState(3);
  const [moveCount, setMoveCount] = useState(0);
  const [message, setMessage] = useState("");

  const [board, setBoard] = useState([]);
  const [boardSize, setBoardSize] = useState(4);
  const [queensStatus, setQueensStatus] = useState(null);
  const [solutionCount, setSolutionCount] = useState(0);

  const [isVisualizing, setIsVisualizing] = useState(false);
  const [speed, setSpeed] = useState(SPEED_PRESETS.MEDIUM);

  useEffect(() => {
    if (type === "hanoi") resetHanoi();
    else if (type === "nqueens") resetNQueens();
  }, [numDisks, boardSize, type]);

  const resetHanoi = () => {
    if (!isVisualizing) {
      const initialTower = Array.from({ length: numDisks }, (_, i) => numDisks - i);
      setTowers([initialTower, [], []]);
      setMoveCount(0);
      setMessage('Click "Start" to begin');
    }
  };

  const resetNQueens = () => {
    if (!isVisualizing) {
      const emptyBoard = Array(boardSize)
        .fill(null)
        .map(() => Array(boardSize).fill(0));
      setBoard(emptyBoard);
      setQueensStatus(null);
      setSolutionCount(0);
      setMessage('Click "Start" to solve N-Queens');
    }
  };

  const visualizeHanoi = async () => {
    if (isVisualizing) return;

    setIsVisualizing(true);
    setMoveCount(0);
    resetHanoi();
    await new Promise((resolve) => setTimeout(resolve, 500));

    let finalMovesCount = 0;

    const updateState = async ({ move, totalMoves, message: msg }) => {
      setTowers((prevTowers) => {
        const newTowers = prevTowers.map((tower) => [...tower]);
        const disk = newTowers[move.from - 1].pop();
        newTowers[move.to - 1].push(disk);
        return newTowers;
      });
      finalMovesCount = totalMoves;
      setMoveCount(totalMoves);
      setMessage(msg);
    };

    await algorithm(numDisks, 1, 3, 2, updateState, speed);

    setMessage(`Completed in ${finalMovesCount} moves!`);
    setIsVisualizing(false);
  };

  const visualizeNQueens = async () => {
    if (isVisualizing) return;

    setIsVisualizing(true);
    resetNQueens();
    await new Promise((resolve) => setTimeout(resolve, 500));

    const updateBoard = async (state) => {
      setBoard(state.board);
      setQueensStatus(state);
      if (state.status === "solution") setSolutionCount(state.solutionCount);
    };

    const result = await algorithm(boardSize, updateBoard, speed);

    if (result.solved) {
      setMessage(`Solution found! ${result.totalSolutions || 1} solution(s).`);
    } else {
      setMessage("No solution exists for this configuration.");
    }

    setIsVisualizing(false);
  };

  const handleVisualize = () => {
    if (type === "hanoi") visualizeHanoi();
    else if (type === "nqueens") visualizeNQueens();
  };

  const handleReset = () => {
    if (type === "hanoi") resetHanoi();
    else if (type === "nqueens") resetNQueens();
  };

  const getCellColor = (row, col) => {
    if (board[row]?.[col] === 1) return COLORS.SORTED;
    if (queensStatus) {
      const { trying, unsafe, placing, removed } = queensStatus;
      if (trying && trying.row === row && trying.col === col) return COLORS.COMPARING;
      if (unsafe && unsafe.row === row && unsafe.col === col) return COLORS.SWAPPING;
      if (placing && placing.row === row && placing.col === col) return COLORS.VISITED;
      if (removed && removed.row === row && removed.col === col) return COLORS.DEFAULT;
    }
    return (row + col) % 2 === 0 ? "#374151" : "#1f2937";
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 rounded-t-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-2">{algorithmInfo.name}</h2>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="bg-white/20 px-3 py-1 rounded-full">
            <span className="font-semibold">Time:</span> {algorithmInfo.timeComplexity}
          </div>
          <div className="bg-white/20 px-3 py-1 rounded-full">
            <span className="font-semibold">Space:</span> {algorithmInfo.spaceComplexity}
          </div>
        </div>
        <p className="mt-3 text-sm opacity-90">{algorithmInfo.description}</p>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 p-4 flex flex-wrap items-center gap-3">
        <button
          onClick={handleVisualize}
          disabled={isVisualizing}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold"
        >
          <Play size={18} /> Start
        </button>

        <button
          onClick={handleReset}
          disabled={isVisualizing}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold"
        >
          <RotateCcw size={18} /> Reset
        </button>

        {type === "hanoi" && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setNumDisks(Math.max(2, numDisks - 1))}
              disabled={isVisualizing}
              className="bg-gray-600 hover:bg-gray-500 text-white p-2 rounded"
            >
              <Minus size={16} />
            </button>
            <span className="text-white text-sm font-semibold">Disks: {numDisks}</span>
            <button
              onClick={() => setNumDisks(Math.min(7, numDisks + 1))}
              disabled={isVisualizing}
              className="bg-gray-600 hover:bg-gray-500 text-white p-2 rounded"
            >
              <Plus size={16} />
            </button>
          </div>
        )}

        {type === "nqueens" && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setBoardSize(Math.max(4, boardSize - 1))}
              disabled={isVisualizing}
              className="bg-gray-600 hover:bg-gray-500 text-white p-2 rounded"
            >
              <Minus size={16} />
            </button>
            <span className="text-white text-sm font-semibold">
              Board: {boardSize}×{boardSize}
            </span>
            <button
              onClick={() => setBoardSize(Math.min(10, boardSize + 1))}
              disabled={isVisualizing}
              className="bg-gray-600 hover:bg-gray-500 text-white p-2 rounded"
            >
              <Plus size={16} />
            </button>
          </div>
        )}

        {type === "hanoi" && (
          <div className="ml-auto text-white text-sm">
            <span className="font-semibold">Moves:</span> {moveCount}
          </div>
        )}
      </div>

      {/* Message */}
      {message && (
        <div className="bg-blue-500 text-white p-3 text-center font-semibold">{message}</div>
      )}

      {/* Visualization */}
      <div className="flex-1 bg-gray-900 p-6 flex items-center justify-center overflow-auto">
        {type === "hanoi" && (
          <div className="flex items-center justify-around w-full max-w-3xl h-80 bg-gray-950 p-6 rounded-xl border border-gray-800 shadow-inner">
            {towers.map((tower, towerIdx) => (
              <div key={towerIdx} className="relative w-48 h-64 flex flex-col items-center justify-end">
                {/* The Peg (Stand) */}
                <div className="absolute bottom-10 w-2.5 h-44 bg-gradient-to-t from-gray-700 to-gray-500 rounded-t-full shadow-md"></div>
                
                {/* The Base */}
                <div className="absolute bottom-6 w-36 h-4 bg-gradient-to-r from-gray-800 to-gray-700 rounded-md shadow-lg border-b border-gray-600"></div>

                {/* The Disks Stack */}
                <div className="absolute bottom-10 flex flex-col-reverse items-center gap-0.5">
                  {tower.map((disk, diskIdx) => {
                    const diskWidth = 45 + (disk * 12);
                    return (
                      <div
                        key={diskIdx}
                        className="rounded-md shadow-md border-b-2 border-black/35 transition-all duration-300 hover:brightness-110 z-10"
                        style={{
                          width: `${diskWidth}px`,
                          height: "22px",
                          backgroundColor: `hsl(${(disk / numDisks) * 360}, 80%, 50%)`,
                          backgroundImage: "linear-gradient(to bottom, rgba(255,255,255,0.2), rgba(0,0,0,0.2))"
                        }}
                      />
                    );
                  })}
                </div>

                {/* Tower Label */}
                <div className="absolute bottom-0 text-gray-400 text-sm font-semibold tracking-wider select-none">
                  Tower {towerIdx + 1}
                </div>
              </div>
            ))}
          </div>
        )}

        {type === "nqueens" && (
          <div
            className="p-4 bg-gray-800 rounded-lg"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
              aspectRatio: "1 / 1",
              width: "min(340px, 100%)",
              height: "min(340px, 100%)",
            }}
          >
            {board.map((row, rowIdx) =>
              row.map((cell, colIdx) => (
                <div
                  key={`${rowIdx}-${colIdx}`}
                  className="flex items-center justify-center border border-gray-700 animate-fadeIn"
                  style={{
                    backgroundColor: getCellColor(rowIdx, colIdx),
                    fontSize: `${Math.max(16, 220 / boardSize)}px`,
                  }}
                >
                  {cell === 1 && <div className="text-yellow-400 font-bold">♛</div>}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="bg-gray-800 p-3 flex flex-wrap gap-4 justify-center text-sm rounded-b-lg">
        {type === "nqueens" && (
          <>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS.COMPARING }}></div>
              <span className="text-white">Trying</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS.SWAPPING }}></div>
              <span className="text-white">Unsafe</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS.SORTED }}></div>
              <span className="text-white">Queen Placed</span>
            </div>
          </>
        )}
        {type === "hanoi" && (
          <div className="text-white">Move disks from Tower 1 to Tower 3 following the rules</div>
        )}
      </div>
    </div>
  );
};

export default RecursionVisualizer;
