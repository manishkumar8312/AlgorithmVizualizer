import React, { useState } from 'react';
import { Upload, Download, Shuffle, FileText, AlertCircle, X } from 'lucide-react';

const CustomTestCases = ({ onApplyTest, isOpen, onClose }) => {
  const [inputType, setInputType] = useState('manual');
  const [manualInput, setManualInput] = useState('');
  const [jsonInput, setJsonInput] = useState('');
  const [randomSize, setRandomSize] = useState(50);
  const [randomMin, setRandomMin] = useState(1);
  const [randomMax, setRandomMax] = useState(100);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleManualSubmit = () => {
    try {
      const array = manualInput
        .split(',')
        .map(num => parseInt(num.trim()))
        .filter(num => !isNaN(num));

      if (array.length === 0) {
        setError('Please enter valid numbers separated by commas');
        return;
      }

      if (array.length < 2) {
        setError('Please enter at least 2 numbers');
        return;
      }

      setError('');
      onApplyTest(array);
    } catch (err) {
      setError('Invalid input format');
    }
  };

  const handleJsonUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (Array.isArray(data) && data.every(num => typeof num === 'number')) {
          setJsonInput(JSON.stringify(data));
          setError('');
        } else {
          setError('JSON must be an array of numbers');
        }
      } catch (err) {
        setError('Invalid JSON format');
      }
    };
    reader.readAsText(file);
  };

  const handleJsonSubmit = () => {
    try {
      const array = JSON.parse(jsonInput);
      if (Array.isArray(array) && array.every(num => typeof num === 'number')) {
        setError('');
        onApplyTest(array);
      } else {
        setError('JSON must be an array of numbers');
      }
    } catch (err) {
      setError('Invalid JSON format');
    }
  };

  const handleRandomGenerate = () => {
    const array = Array.from({ length: randomSize }, () =>
      Math.floor(Math.random() * (randomMax - randomMin + 1)) + randomMin
    );
    onApplyTest(array);
  };

  return (
    <div className="bg-gray-800 border-t border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileText className="text-blue-400" size={24} />
          <h3 className="text-2xl font-bold text-white">Custom Test Cases</h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Input Type Selector */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setInputType('manual')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            inputType === 'manual'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Manual Input
        </button>
        <button
          onClick={() => setInputType('json')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            inputType === 'json'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          JSON Upload
        </button>
        <button
          onClick={() => setInputType('random')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            inputType === 'random'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Random Generate
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded-lg flex items-center gap-2">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Manual Input */}
      {inputType === 'manual' && (
        <div className="space-y-4">
          <div>
            <label className="text-white text-sm font-semibold mb-2 block">
              Enter array (comma-separated numbers):
            </label>
            <textarea
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="e.g., 64, 34, 25, 12, 22, 11, 90"
              className="w-full h-32 px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 outline-none resize-none font-mono"
            />
          </div>
          <button
            onClick={handleManualSubmit}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Apply Test Case
          </button>
        </div>
      )}

      {/* JSON Upload */}
      {inputType === 'json' && (
        <div className="space-y-4">
          <div>
            <label className="text-white text-sm font-semibold mb-2 block">
              Upload JSON file or paste JSON array:
            </label>
            <div className="flex gap-2 mb-3">
              <label className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors">
                <Upload size={18} />
                Upload File
                <input
                  type="file"
                  accept=".json"
                  onChange={handleJsonUpload}
                  className="hidden"
                />
              </label>
            </div>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='e.g., [64, 34, 25, 12, 22, 11, 90]'
              className="w-full h-32 px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 outline-none resize-none font-mono"
            />
          </div>
          <button
            onClick={handleJsonSubmit}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Apply Test Case
          </button>
        </div>
      )}

      {/* Random Generate */}
      {inputType === 'random' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-white text-sm font-semibold mb-2 block">
                Array Size: {randomSize}
              </label>
              <input
                type="range"
                min="10"
                max="200"
                value={randomSize}
                onChange={(e) => setRandomSize(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-white text-sm font-semibold mb-2 block">
                Min Value: {randomMin}
              </label>
              <input
                type="range"
                min="1"
                max="50"
                value={randomMin}
                onChange={(e) => setRandomMin(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-white text-sm font-semibold mb-2 block">
                Max Value: {randomMax}
              </label>
              <input
                type="range"
                min="51"
                max="500"
                value={randomMax}
                onChange={(e) => setRandomMax(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
          <button
            onClick={handleRandomGenerate}
            className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            <Shuffle size={18} />
            Generate Random Array
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomTestCases;
