import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Layers,
  Search,
  MapPin,
  Network,
  Boxes,
  Trees
} from 'lucide-react';
import Navbar from '../components/Navbar';

const CategoriesPage = () => {
  const categories = [
    {
      title: 'Sorting Algorithms',
      description: 'Visualize popular sorting algorithms like Bubble Sort, Quick Sort, Merge Sort, and more.',
      icon: <Layers className="w-8 h-8" />,
      path: '/sorting',
      color: 'bg-indigo-100 text-indigo-600',
      hoverColor: 'hover:border-indigo-200 hover:shadow-indigo-100',
      algorithms: ['Bubble Sort', 'Selection Sort', 'Insertion Sort', 'Merge Sort', 'Quick Sort']
    },
    {
      title: 'Searching Algorithms',
      description: 'Explore linear and binary search algorithms with interactive visualizations.',
      icon: <Search className="w-8 h-8" />,
      path: '/searching',
      color: 'bg-emerald-100 text-emerald-600',
      hoverColor: 'hover:border-emerald-200 hover:shadow-emerald-100',
      algorithms: ['Linear Search', 'Binary Search']
    },
    {
      title: 'Pathfinding Algorithms',
      description: 'Watch pathfinding algorithms find the shortest path through obstacles.',
      icon: <MapPin className="w-8 h-8" />,
      path: '/pathfinding',
      color: 'bg-blue-100 text-blue-600',
      hoverColor: 'hover:border-blue-200 hover:shadow-blue-100',
      algorithms: ["Dijkstra's Algorithm", 'BFS', 'DFS']
    },
    {
      title: 'Graph Algorithms',
      description: 'Understand graph algorithms including MST and topological sorting.',
      icon: <Network className="w-8 h-8" />,
      path: '/graph',
      color: 'bg-purple-100 text-purple-600',
      hoverColor: 'hover:border-purple-200 hover:shadow-purple-100',
      algorithms: ["Kruskal's MST", "Prim's MST", 'Topological Sort']
    },
    {
      title: 'Recursion & Backtracking',
      description: 'Solve classic recursive problems like Tower of Hanoi and N-Queens.',
      icon: <Boxes className="w-8 h-8" />,
      path: '/recursion',
      color: 'bg-orange-100 text-orange-600',
      hoverColor: 'hover:border-orange-200 hover:shadow-orange-100',
      algorithms: ['Tower of Hanoi', 'N-Queens']
    },
    {
      title: 'Tree Algorithms',
      description: 'Explore binary trees, BSTs, AVL trees, heaps, tries, and segment trees with interactive visualizations.',
      icon: <Trees className="w-8 h-8" />,
      path: '/trees',
      color: 'bg-teal-100 text-teal-600',
      hoverColor: 'hover:border-teal-200 hover:shadow-teal-100',
      algorithms: ['Binary Tree Traversals', 'BST Operations', 'AVL Rotations', 'Heap Operations', 'Trie Visualization', 'Segment Tree Queries']
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-sans selection:bg-blue-100">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">Algorithm Categories</h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl">
            Choose a category below to dive into interactive visualizations and detailed explanations of each algorithm.
          </p>
        </div>
 
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Link 
              key={index} 
              to={category.path}
              className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 group relative overflow-hidden ${category.hoverColor}`}
            >
              {/* Background Accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 dark:bg-slate-700 rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform duration-500"></div>
              
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${category.color}`}>
                {category.icon}
              </div>
              
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{category.title}</h2>
              <p className="text-[14px] text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                {category.description}
              </p>
              
              <div className="space-y-2 mb-8">
                {category.algorithms.slice(0, 4).map((algo, i) => (
                  <div key={i} className="flex items-center gap-2 text-[13px] text-slate-600 dark:text-slate-300 font-medium">
                    <div className={`w-1.5 h-1.5 rounded-full ${category.color.split(' ')[0]}`}></div>
                    {algo}
                  </div>
                ))}
                {category.algorithms.length > 4 && (
                  <div className="text-[12px] text-slate-400 dark:text-slate-500 font-medium italic mt-2">
                    + {category.algorithms.length - 4} more
                  </div>
                )}
              </div>
              
              <div className={`absolute bottom-8 right-8 w-10 h-10 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-700 text-slate-400 group-hover:border-transparent group-hover:text-white group-hover:${category.color.split(' ')[0]} transition-all shadow-sm`}>
                <ArrowRight className="w-5 h-5" />
              </div>
            </Link>
          ))}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-8 py-12 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
         <div className="flex items-center gap-2">
           <img src="/logo-icon.svg" alt="Algo Visualizer" className="w-6 h-6 select-none" draggable="false" />
             <span className="text-sm font-medium text-slate-600 dark:text-slate-400">© 2025 Algorithm Visualizer. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-sm font-medium text-slate-500 dark:text-slate-400">
             <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy</a>
             <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms</a>
             <a href="https://github.com/manishkumar8312/" className="hover:text-slate-900 dark:hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CategoriesPage;
