import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, BookOpen, Clock, Cpu, Zap, AlertTriangle, CheckCircle } from 'lucide-react';

const ExplanationPanel = ({ algorithmInfo, isOpen, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed right-0 top-0 h-full bg-gray-800 shadow-2xl z-50 transition-all duration-300 ${
        isExpanded ? 'w-96' : 'w-12'
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -left-12 top-1/2 -translate-y-1/2 bg-gray-800 text-white p-2 rounded-l-lg shadow-lg hover:bg-gray-700 transition-colors"
      >
        {isExpanded ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      {/* Close Button */}
      {isExpanded && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      )}

      {/* Content */}
      {isExpanded && (
        <div className="p-6 overflow-y-auto h-full">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="text-blue-400" size={24} />
              <h2 className="text-2xl font-bold text-white">Algorithm Info</h2>
            </div>
            <h3 className="text-xl font-semibold text-blue-400">{algorithmInfo.name}</h3>
          </div>

          {/* Overview */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              <BookOpen size={18} className="text-purple-400" />
              Overview
            </h4>
            <p className="text-gray-300 text-sm leading-relaxed">{algorithmInfo.description}</p>
          </div>

          {/* Purpose */}
          {algorithmInfo.purpose && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <Zap size={18} className="text-yellow-400" />
                Purpose
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed">{algorithmInfo.purpose}</p>
            </div>
          )}

          {/* Working Principle */}
          {algorithmInfo.workingPrinciple && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <BookOpen size={18} className="text-green-400" />
                Working Principle
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed">{algorithmInfo.workingPrinciple}</p>
            </div>
          )}

          {/* Complexity */}
          <div className="mb-6 bg-gray-700/50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Clock size={18} className="text-cyan-400" />
              Time Complexity
            </h4>
            <div className="space-y-2">
              {algorithmInfo.bestCase && (
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-400" />
                  <span className="text-gray-300 text-sm">
                    <span className="font-semibold text-white">Best:</span> {algorithmInfo.bestCase}
                  </span>
                </div>
              )}
              {algorithmInfo.averageCase && (
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-yellow-400" />
                  <span className="text-gray-300 text-sm">
                    <span className="font-semibold text-white">Average:</span> {algorithmInfo.averageCase}
                  </span>
                </div>
              )}
              {algorithmInfo.worstCase && (
                <div className="flex items-center gap-2">
                  <AlertTriangle size={16} className="text-red-400" />
                  <span className="text-gray-300 text-sm">
                    <span className="font-semibold text-white">Worst:</span> {algorithmInfo.worstCase}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Space Complexity */}
          <div className="mb-6 bg-gray-700/50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              <Cpu size={18} className="text-pink-400" />
              Space Complexity
            </h4>
            <p className="text-gray-300 text-sm font-semibold">{algorithmInfo.spaceComplexity}</p>
          </div>

          {/* Applications */}
          {algorithmInfo.applications && algorithmInfo.applications.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <Zap size={18} className="text-orange-400" />
                Applications
              </h4>
              <ul className="space-y-1">
                {algorithmInfo.applications.map((app, idx) => (
                  <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                    <span className="text-blue-400 mt-1">•</span>
                    {app}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Advantages */}
          {algorithmInfo.advantages && algorithmInfo.advantages.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <CheckCircle size={18} className="text-green-400" />
                Advantages
              </h4>
              <ul className="space-y-1">
                {algorithmInfo.advantages.map((adv, idx) => (
                  <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    {adv}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Disadvantages */}
          {algorithmInfo.disadvantages && algorithmInfo.disadvantages.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <AlertTriangle size={18} className="text-red-400" />
                Disadvantages
              </h4>
              <ul className="space-y-1">
                {algorithmInfo.disadvantages.map((dis, idx) => (
                  <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                    <span className="text-red-400 mt-1">✗</span>
                    {dis}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExplanationPanel;
