import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Layers,
  Search,
  MapPin,
  Network,
  Boxes,
  BookOpenIcon,
  NotebookIcon
  
} from 'lucide-react';

import GitHubIcon from '../components/GitHubIcon';

const Home = () => {
  const categories = [
    {
      title: 'Sorting Algorithms',
      description:
        'Visualize popular sorting algorithms like Bubble Sort, Quick Sort, Merge Sort, and more.',
      icon: <Layers className="w-12 h-12" />,
      path: '/sorting',
      color: 'from-blue-500 to-purple-600',
      algorithms: [
        'Bubble Sort',
        'Selection Sort',
        'Insertion Sort',
        'Merge Sort',
        'Quick Sort'
      ]
    },
    {
      title: 'Searching Algorithms',
      description:
        'Explore linear and binary search algorithms with interactive visualizations.',
      icon: <Search className="w-12 h-12" />,
      path: '/searching',
      color: 'from-teal-500 to-cyan-600',
      algorithms: ['Linear Search', 'Binary Search']
    },
    {
      title: 'Pathfinding Algorithms',
      description:
        'Watch pathfinding algorithms find the shortest path through obstacles.',
      icon: <MapPin className="w-12 h-12" />,
      path: '/pathfinding',
      color: 'from-cyan-500 to-blue-600',
      algorithms: ["Dijkstra's Algorithm", 'BFS', 'DFS']
    },
    {
      title: 'Graph Algorithms',
      description:
        'Understand graph algorithms including MST and topological sorting.',
      icon: <Network className="w-12 h-12" />,
      path: '/graph',
      color: 'from-purple-500 to-pink-600',
      algorithms: [
        "Kruskal's MST",
        "Prim's MST",
        'Topological Sort'
      ]
    },
    {
      title: 'Recursion & Backtracking',
      description:
        'Solve classic recursive problems like Tower of Hanoi and N-Queens.',
      icon: <Boxes className="w-12 h-12" />,
      path: '/recursion',
      color: 'from-orange-500 to-red-600',
      algorithms: ['Tower of Hanoi', 'N-Queens']
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-16 flex-1">

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-6">
            Algorithm Visualizer
          </h1>

          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Learn algorithms through interactive visualizations.
            Watch how different algorithms work step-by-step and
            understand their time and space complexities.
          </p>

          {/* GitHub Links */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <a
              href="https://github.com/manishkumar8312/CS-Fundamentals"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <GitHubIcon className="w-5 h-5" />
              <span>CS-Fundamentals</span>
            </a>

            <a
              href="https://github.com/manishkumar8312/cp-notes"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <GitHubIcon className="w-5 h-5" />
              <span>CP Notes</span>
            </a>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-10 flex-wrap">
            <div>
              <h3 className="text-3xl font-bold text-blue-400">15+</h3>
              <p className="text-gray-400">Algorithms</p>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-purple-400">5</h3>
              <p className="text-gray-400">Categories</p>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-cyan-400">100%</h3>
              <p className="text-gray-400">Interactive</p>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={category.path}
              className="group relative bg-gray-800/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300"
            >
              {/* Header */}
              <div
                className={`bg-gradient-to-r ${category.color} p-6 text-white`}
              >
                <div className="flex items-center justify-between mb-4">
                  {category.icon}

                  <ArrowRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-2" />
                </div>

                <h2 className="text-2xl font-bold">
                  {category.title}
                </h2>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-300 mb-5 leading-relaxed">
                  {category.description}
                </p>

                <div>
                  <p className="text-sm font-semibold text-gray-400 mb-2">
                    Includes:
                  </p>

                  <ul className="space-y-2">
                    {category.algorithms.map((algo, idx) => (
                      <li
                        key={idx}
                        className="flex items-center text-sm text-gray-400"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-3"></span>
                        {algo}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </Link>
          ))}
        </div>

        {/* Features */}
        <div className="mt-24 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-10">
            Why Use This Visualizer?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/90 rounded-xl p-6 text-center hover:-translate-y-1 transition-transform">
              <div className="text-4xl mb-3">🎯</div>

              <h3 className="text-xl font-bold text-white mb-2">
                Interactive
              </h3>

              <p className="text-gray-400">
                Control speed, input size and visualize every step.
              </p>
            </div>

            <div className="bg-gray-800/90 rounded-xl p-6 text-center hover:-translate-y-1 transition-transform">
              <div className="text-4xl mb-3">📚</div>

              <h3 className="text-xl font-bold text-white mb-2">
                Educational
              </h3>

              <p className="text-gray-400">
                Understand time and space complexity with ease.
              </p>
            </div>

            <div className="bg-gray-800/90 rounded-xl p-6 text-center hover:-translate-y-1 transition-transform">
              <div className="text-4xl mb-3">🎨</div>

              <h3 className="text-xl font-bold text-white mb-2">
                Beautiful
              </h3>

              <p className="text-gray-400">
                Beautiful UI and clear visuals.
              </p>
            </div>
          </div>
        </div>

      </div>
      {/* Footer */}
        <footer className="w-screen relative left-1/2 right-1/2 -mx-[50vw] bg-slate-950 border-t border-slate-800 px-8 py-12 mt-16">
  <div className="max-w-5xl mx-auto">

    {/* Top Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-10">

      {/* Brand Column */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-indigo-400 font-semibold text-[12px] tracking-wide">
            AV
          </div>
          <span className="text-[15px] font-medium text-slate-100">Algorithm Visualizer</span>
        </div>
        <p className="text-[13px] text-slate-500 leading-relaxed mb-4">
          An interactive platform to explore sorting, searching, graph, and pathfinding algorithms — step by step, visually.
        </p>
        <div className="flex gap-2">
          <span className="text-[11px] px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-indigo-400">
            Open Source
          </span>
          <span className="text-[11px] px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-400">
            v1.0
          </span>
        </div>
      </div>

      {/* Resources Column */}
      <div>
        <p className="text-[11px] font-medium text-slate-600 uppercase tracking-widest mb-4">Resources</p>
        <div className="flex flex-col gap-3">
          <a href="https://github.com/manishkumar8312/CS-Fundamentals" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-[13px] text-slate-400 no-underline hover:text-indigo-400 transition-colors">
            <BookOpenIcon className="w-4 h-4 text-indigo-500" />
            CS Fundamentals
          </a>
          <a href="https://github.com/manishkumar8312/cp-notes" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-[13px] text-slate-400 no-underline hover:text-indigo-400 transition-colors">
            <NotebookIcon className="w-4 h-4 text-indigo-500" />
            CP Notes
          </a>
          <a href="https://github.com/manishkumar8312" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-[13px] text-slate-400 no-underline hover:text-indigo-400 transition-colors">
            <GitHubIcon className="w-4 h-4 text-indigo-500" />
            GitHub Profile
          </a>
        </div>
      </div>

      {/* Topics Column */}
      <div>
        <p className="text-[11px] font-medium text-slate-600 uppercase tracking-widest mb-4">Topics Covered</p>
        <div className="flex flex-wrap gap-2">
          {["Sorting", "Searching", "Graphs", "Pathfinding", "Trees", "DP"].map(tag => (
            <span key={tag} className="text-[11px] px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-500">
              {tag}
            </span>
          ))}
        </div>
      </div>

    </div>

    {/* Bottom Bar */}
    <div className="border-t border-slate-800 pt-5 flex flex-wrap items-center justify-between gap-3">
      <p className="text-[12px] text-slate-600 m-0">
        Built by{" "}
        <a href="https://github.com/manishkumar8312" target="_blank" rel="noopener noreferrer"
          className="text-indigo-500 no-underline hover:text-indigo-400 transition-colors">
          Manish Kumar
        </a>{" "}
        · Made for learners and competitive programmers
      </p>
      <p className="text-[12px] text-slate-600 m-0">© 2025 Algorithm Visualizer</p>
    </div>

  </div>
</footer>
    </div>
    
  );
};

export default Home;