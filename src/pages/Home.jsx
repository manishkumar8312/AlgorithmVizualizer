import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Layers,
  Search,
  MapPin,
  Network,
  Boxes
} from 'lucide-react';

const GitHubIcon = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.54 2.87 8.39 6.84 9.75.5.09.66-.22.66-.48 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.38-3.37-1.38-.46-1.2-1.12-1.52-1.12-1.52-.91-.64.07-.63.07-.63 1.01.08 1.54 1.06 1.54 1.06.9 1.58 2.35 1.12 2.92.85.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.13-4.56-5.03 0-1.11.38-2.02 1.01-2.74-.1-.26-.44-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.2 9.2 0 0 1 12 7.15c.85 0 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.54 1.41.2 2.45.1 2.71.63.72 1 1.63 1 2.74 0 3.91-2.34 4.77-4.57 5.02.36.32.68.95.68 1.92 0 1.39-.01 2.51-.01 2.85 0 .27.16.59.67.48A10.28 10.28 0 0 0 22 12.26C22 6.58 17.52 2 12 2z" />
  </svg>
);

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
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-16">

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
              <GitHubIcon />
              <span>CS-Fundamentals</span>
            </a>

            <a
              href="https://github.com/manishkumar8312/cp-notes"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <GitHubIcon />
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
                Modern UI, smooth transitions and engaging visuals.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-20 text-center text-gray-500 text-sm">
          <p>Built with React, TailwindCSS and ❤️ by Manish Kumar Sah</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;