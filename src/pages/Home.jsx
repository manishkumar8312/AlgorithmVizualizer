import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, Search, MapPin, Network, Boxes } from 'lucide-react';

const Home = () => {
  const categories = [
    {
      title: 'Sorting Algorithms',
      description: 'Visualize popular sorting algorithms like Bubble Sort, Quick Sort, Merge Sort, and more.',
      icon: <Layers className="w-12 h-12" />,
      path: '/sorting',
      color: 'from-blue-500 to-purple-600',
      algorithms: ['Bubble Sort', 'Selection Sort', 'Insertion Sort', 'Merge Sort', 'Quick Sort']
    },
    {
      title: 'Searching Algorithms',
      description: 'Explore linear and binary search algorithms with interactive visualizations.',
      icon: <Search className="w-12 h-12" />,
      path: '/searching',
      color: 'from-teal-500 to-cyan-600',
      algorithms: ['Linear Search', 'Binary Search']
    },
    {
      title: 'Pathfinding Algorithms',
      description: 'Watch pathfinding algorithms find the shortest path through obstacles.',
      icon: <MapPin className="w-12 h-12" />,
      path: '/pathfinding',
      color: 'from-cyan-500 to-blue-600',
      algorithms: ['Dijkstra\'s Algorithm', 'BFS', 'DFS']
    },
    {
      title: 'Graph Algorithms',
      description: 'Understand graph algorithms including MST and topological sorting.',
      icon: <Network className="w-12 h-12" />,
      path: '/graph',
      color: 'from-purple-500 to-pink-600',
      algorithms: ['Kruskal\'s MST', 'Prim\'s MST', 'Topological Sort']
    },
    {
      title: 'Recursion & Backtracking',
      description: 'Solve classic recursive problems like Tower of Hanoi and N-Queens.',
      icon: <Boxes className="w-12 h-12" />,
      path: '/recursion',
      color: 'from-orange-500 to-red-600',
      algorithms: ['Tower of Hanoi', 'N-Queens']
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-4 animate-pulse-slow">
            Algorithm Visualizer
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Learn algorithms through interactive visualizations. Watch how different algorithms work step-by-step.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={category.path}
              className="group relative bg-gray-800 rounded-xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
            >
              {/* Gradient Header */}
              <div className={`bg-gradient-to-r ${category.color} p-6 text-white`}>
                <div className="flex items-center justify-between mb-2">
                  {category.icon}
                  <ArrowRight className="w-6 h-6 transform group-hover:translate-x-2 transition-transform" />
                </div>
                <h2 className="text-2xl font-bold">{category.title}</h2>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-300 mb-4">{category.description}</p>
                
                {/* Algorithm List */}
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-400">Includes:</p>
                  <ul className="text-sm text-gray-400 space-y-1">
                    {category.algorithms.map((algo, idx) => (
                      <li key={idx} className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                        {algo}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </Link>
          ))}
        </div>

        {/* Features Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Why Use This Visualizer?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg text-center">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-xl font-bold text-white mb-2">Interactive</h3>
              <p className="text-gray-400">Control speed, input size, and watch algorithms in action</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg text-center">
              <div className="text-4xl mb-3">📚</div>
              <h3 className="text-xl font-bold text-white mb-2">Educational</h3>
              <p className="text-gray-400">Learn time and space complexity for each algorithm</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg text-center">
              <div className="text-4xl mb-3">🎨</div>
              <h3 className="text-xl font-bold text-white mb-2">Beautiful</h3>
              <p className="text-gray-400">Modern UI with smooth animations and color coding</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-gray-500 text-sm">
          <p>Built with React, TailwindCSS, and ❤️</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
