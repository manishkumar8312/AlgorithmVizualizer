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
    return (row + col) % 2 === 0 ? "#e2e8f0" : "#f8fafc";
  };

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-3xl overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-5">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">{algorithmInfo.name}</h2>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md font-medium border border-blue-100">
            <span className="font-semibold">Time:</span> {algorithmInfo.timeComplexity}
          </div>
          <div className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md font-medium border border-blue-100">
            <span className="font-semibold">Space:</span> {algorithmInfo.spaceComplexity}
          </div>
        </div>
        <p className="text-[13px] text-slate-500 leading-relaxed max-w-4xl mt-3">{algorithmInfo.description}</p>
      </div>

      {/* Controls */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-wrap items-center gap-3">
        <button
          onClick={handleVisualize}
          disabled={isVisualizing}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm shadow-blue-600/20"
        >
          <Play size={18} /> Start
        </button>

        <button
          onClick={handleReset}
          disabled={isVisualizing}
          className="flex items-center gap-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <RotateCcw size={18} /> Reset
        </button>

        {type === "hanoi" && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setNumDisks(Math.max(2, numDisks - 1))}
              disabled={isVisualizing}
              className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 p-2 rounded-lg shadow-sm"
            >
              <Minus size={16} />
            </button>
            <span className="text-slate-800 text-sm font-semibold">Disks: {numDisks}</span>
            <button
              onClick={() => setNumDisks(Math.min(7, numDisks + 1))}
              disabled={isVisualizing}
              className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 p-2 rounded-lg shadow-sm"
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
              className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 p-2 rounded-lg shadow-sm"
            >
              <Minus size={16} />
            </button>
            <span className="text-slate-800 text-sm font-semibold">
              Board: {boardSize}×{boardSize}
            </span>
            <button
              onClick={() => setBoardSize(Math.min(10, boardSize + 1))}
              disabled={isVisualizing}
              className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 p-2 rounded-lg shadow-sm"
            >
              <Plus size={16} />
            </button>
          </div>
        )}

        {type === "hanoi" && (
          <div className="ml-auto text-slate-700 text-sm">
            <span className="font-semibold">Moves:</span> {moveCount}
          </div>
        )}
      </div>

      {/* Message */}
      {message && (
        <div className="bg-blue-50 text-blue-700 border-b border-blue-100 px-6 py-3 text-center text-sm font-semibold">{message}</div>
      )}

      {/* Visualization */}
      <div className="flex-1 bg-slate-50 p-6 flex items-center justify-center overflow-auto">
        {type === "hanoi" && (
          <div className="flex items-center justify-around w-full max-w-3xl h-80 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            {towers.map((tower, towerIdx) => (
              <div key={towerIdx} className="relative w-48 h-64 flex flex-col items-center justify-end">
                {/* The Peg (Stand) */}
                <div className="absolute bottom-10 w-2.5 h-44 bg-gradient-to-t from-slate-400 to-slate-300 rounded-t-full shadow-sm"></div>
                
                {/* The Base */}
                <div className="absolute bottom-6 w-36 h-4 bg-gradient-to-r from-slate-300 to-slate-200 rounded-md shadow-md border-b border-slate-300"></div>

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
                <div className="absolute bottom-0 text-slate-500 text-sm font-semibold tracking-wider select-none">
                  Tower {towerIdx + 1}
                </div>
              </div>
            ))}
          </div>
        )}

        {type === "nqueens" && (
          <div
            className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm"
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
                  className="flex items-center justify-center border border-slate-200 animate-fadeIn"
                  style={{
                    backgroundColor: getCellColor(rowIdx, colIdx),
                    fontSize: `${Math.max(16, 220 / boardSize)}px`,
                  }}
                >
                  {cell === 1 && <div className="text-blue-600 font-bold">♛</div>}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex flex-wrap gap-6 justify-center text-[12px] font-medium text-slate-600">
        {type === "nqueens" && (
          <>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-sm shadow-sm" style={{ backgroundColor: COLORS.COMPARING }}></div>
              <span>Trying</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-sm shadow-sm" style={{ backgroundColor: COLORS.SWAPPING }}></div>
              <span>Unsafe</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-sm shadow-sm" style={{ backgroundColor: COLORS.SORTED }}></div>
              <span>Queen Placed</span>
            </div>
          </>
        )}
        {type === "hanoi" && (
          <div className="text-slate-600">Move disks from Tower 1 to Tower 3 following the rules</div>
        )}
      </div>
    </div>
  );
};

export default RecursionVisualizer;
