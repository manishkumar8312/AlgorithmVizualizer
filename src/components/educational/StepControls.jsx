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
    <div className="bg-gray-800 p-4 flex flex-wrap items-center gap-3">
      {/* Step Counter */}
      <div className="text-white text-sm font-semibold bg-gray-700 px-4 py-2 rounded-lg">
        Step {currentStep} / {totalSteps}
      </div>

      {/* Control Buttons */}
      <button
        onClick={onReset}
        disabled={disabled}
        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold transition-colors"
      >
        <RotateCcw size={18} />
        Reset
      </button>

      <button
        onClick={onPrevious}
        disabled={disabled || currentStep <= 1}
        className="flex items-center gap-2 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold transition-colors"
      >
        <SkipBack size={18} />
        Previous
      </button>

      {!isPlaying ? (
        <button
          onClick={onPlay}
          disabled={disabled || currentStep >= totalSteps}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold transition-colors"
        >
          <Play size={18} />
          {isPaused ? 'Resume' : 'Play'}
        </button>
      ) : (
        <button
          onClick={onPause}
          disabled={disabled}
          className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold transition-colors"
        >
          <Pause size={18} />
          Pause
        </button>
      )}

      <button
        onClick={onNext}
        disabled={disabled || currentStep >= totalSteps}
        className="flex items-center gap-2 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold transition-colors"
      >
        <SkipForward size={18} />
        Next
      </button>

      {/* Progress Bar */}
      <div className="flex-1 ml-4">
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default StepControls;
