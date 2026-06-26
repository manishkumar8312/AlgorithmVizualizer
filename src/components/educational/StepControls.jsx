import React from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';

const StepControls = ({
  currentStep,
  totalSteps,
  isPlaying,
  isPaused,
  onPlay,
  onPause,
  onResume,
  onNext,
  onPrevious,
  onReset,
  disabled = false
}) => {
  return (
    <div className="w-full bg-white border-y border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.05)] h-16 flex items-center justify-center gap-3">
      {/* Control Buttons */}
      <button
        onClick={onReset}
        disabled={disabled}
        className="flex items-center gap-2 bg-white border border-red-200 text-red-500 hover:bg-red-50 disabled:border-gray-200 disabled:text-gray-400 disabled:bg-white disabled:cursor-not-allowed px-4 h-10 rounded-lg text-sm font-semibold transition-colors"
      >
        <RotateCcw size={16} />
        Reset
      </button>

      <button
        onClick={onPrevious}
        disabled={disabled || currentStep <= 1}
        className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:border-gray-200 disabled:text-gray-400 disabled:bg-white disabled:cursor-not-allowed px-4 h-10 rounded-lg text-sm font-semibold transition-colors"
      >
        <SkipBack size={16} />
        Previous
      </button>

      {!isPlaying ? (
        <button
          onClick={onPlay}
          disabled={disabled || currentStep >= totalSteps}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed text-white px-6 h-10 rounded-lg text-sm font-semibold transition-colors shadow-sm shadow-purple-600/20"
        >
          <Play size={16} className="ml-0.5" />
          {isPaused ? 'Resume' : 'Play'}
        </button>
      ) : (
        <button
          onClick={onPause}
          disabled={disabled}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed text-white px-6 h-10 rounded-lg text-sm font-semibold transition-colors shadow-sm shadow-purple-600/20"
        >
          <Pause size={16} />
          Pause
        </button>
      )}

      <button
        onClick={onNext}
        disabled={disabled || currentStep >= totalSteps}
        className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:border-gray-200 disabled:text-gray-400 disabled:bg-white disabled:cursor-not-allowed px-4 h-10 rounded-lg text-sm font-semibold transition-colors"
      >
        <SkipForward size={16} />
        Next
      </button>
    </div>
  );
};

export default StepControls;
