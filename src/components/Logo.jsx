import React from 'react';

const Logo = ({ className = 'w-8 h-8', showText = false, textClassName = 'text-slate-900 dark:text-white' }) => {
  return (
    <div className="flex items-center gap-3 select-none">
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <defs>
          {/* Blue Gradient for 'A' */}
          <linearGradient id="logo-blue-grad" x1="20" y1="20" x2="60" y2="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>

          {/* Green Gradient for 'V' */}
          <linearGradient id="logo-green-grad" x1="50" y1="40" x2="80" y2="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          {/* Cyan Gradient for Bars */}
          <linearGradient id="logo-cyan-grad" x1="40" y1="50" x2="52" y2="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>

          {/* Line Chart Gradient */}
          <linearGradient id="logo-line-grad" x1="45" y1="20" x2="75" y2="45" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>

        {/* 'A' Shape */}
        <path
          d="M45.5 56.5 L40.5 66.5 L48 66.5 Z M22 80 L44.5 35 L57 60 L45.5 83 L36 83 L40.5 74 L31 74 L27.5 80 Z"
          fill="url(#logo-blue-grad)"
        />

        {/* 'V' Shape / Checkmark */}
        <path
          d="M52 50 L61 58 L78 30 L87 35 L61 78 L43 57 Z"
          fill="url(#logo-green-grad)"
        />

        {/* 3 Bar Chart Columns */}
        <rect x="39" y="70" width="3" height="10" rx="1.5" fill="url(#logo-cyan-grad)" />
        <rect x="44" y="63" width="3" height="17" rx="1.5" fill="url(#logo-cyan-grad)" />
        <rect x="49" y="58" width="3" height="22" rx="1.5" fill="url(#logo-cyan-grad)" />

        {/* Line Chart with Nodes */}
        <path
          d="M51 45 L59.5 33.5 L65.5 37 L75.5 23"
          stroke="url(#logo-line-grad)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="51" cy="45" r="1.5" fill="#3b82f6" />
        <circle cx="59.5" cy="33.5" r="1.5" fill="#3b82f6" />
        <circle cx="65.5" cy="37" r="1.5" fill="#10b981" />
        <circle cx="75.5" cy="23" r="2" fill="#10b981" />
      </svg>

      {showText && (
        <div className="flex flex-col">
          <span className={`font-black tracking-wider text-base leading-none uppercase ${textClassName}`}>
            ALGO
          </span>
          <span className="text-[9px] font-bold tracking-[0.25em] text-slate-400 dark:text-slate-500 uppercase leading-none mt-0.5">
            Visualizer
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
