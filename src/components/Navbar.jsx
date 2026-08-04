import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, Search, Moon, Sun, Menu, X } from 'lucide-react';
import GitHubIcon from './GitHubIcon';
import { useTheme } from '../context/ThemeContext';

import Logo from './Logo';

const SEARCH_ITEMS = [
  { name: 'Bubble Sort', path: '/sorting', category: 'Sorting' },
  { name: 'Selection Sort', path: '/sorting', category: 'Sorting' },
  { name: 'Insertion Sort', path: '/sorting', category: 'Sorting' },
  { name: 'Merge Sort', path: '/sorting', category: 'Sorting' },
  { name: 'Quick Sort', path: '/sorting', category: 'Sorting' },
  { name: 'Linear Search', path: '/searching', category: 'Searching' },
  { name: 'Binary Search', path: '/searching', category: 'Searching' },
  { name: "Dijkstra's Algorithm", path: '/pathfinding', category: 'Pathfinding' },
  { name: 'A* Search', path: '/pathfinding', category: 'Pathfinding' },
  { name: 'BFS (Breadth-First Search)', path: '/graph', category: 'Graph' },
  { name: 'DFS (Depth-First Search)', path: '/graph', category: 'Graph' },
  { name: 'Factorial', path: '/recursion', category: 'Recursion' },
  { name: 'Fibonacci', path: '/recursion', category: 'Recursion' },
  { name: 'Binary Search Tree', path: '/trees', category: 'Trees' },
  { name: '0/1 Knapsack', path: '/dp', category: 'Dynamic Programming' },
  { name: 'Longest Common Subsequence (LCS)', path: '/dp', category: 'Dynamic Programming' },
];

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);
  const navigate = useNavigate();

  // Handle Cmd/Ctrl + K shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle clicking outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredItems = SEARCH_ITEMS.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectResult = (item) => {
    navigate(item.path);
    setSearchQuery('');
    setIsSearchFocused(false);
    setIsMobileMenuOpen(false);
    searchInputRef.current?.blur();
  };

  return (
    <nav className="border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0 hover:opacity-90 transition-opacity">
            <Logo showText={true} className="w-10 h-10" />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6 text-[14px] font-medium text-slate-600 dark:text-slate-300 relative">
            <div
              className="flex items-center gap-1 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors py-4"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              Algorithms <ChevronDown className="w-4 h-4 text-slate-400" />

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute top-full left-0 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-xl py-2 z-50 transform origin-top-left transition-all">
                  <Link to="/algorithms" className="block px-4 py-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    Categories &rarr;
                  </Link>
                  <Link to="/sorting" className="block px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Sorting Algorithms</Link>
                  <Link to="/searching" className="block px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Searching Algorithms</Link>
                  <Link to="/pathfinding" className="block px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Pathfinding Algorithms</Link>
                  <Link to="/graph" className="block px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Graph Algorithms</Link>
                  <Link to="/recursion" className="block px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Recursion & Backtracking</Link>
                  <Link to="/trees" className="block px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Tree Algorithms</Link>
                  <Link to="/dp" className="block px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Dynamic Programming</Link>
                </div>
              )}
            </div>

            <Link to="/algorithms" className="hover:text-slate-900 dark:hover:text-white transition-colors">Categories</Link>
            <Link to="/playground" className="hover:text-slate-900 dark:hover:text-white transition-colors">Playground</Link>
            <a
              href="https://github.com/manishkumar8312/CS-Fundamentals"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Learn
            </a>
            <a
              href="https://github.com/manishkumar8312/CP-Notes"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              About
            </a>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div ref={searchContainerRef} className="relative hidden lg:block">
            <div className={`flex items-center bg-slate-50 dark:bg-slate-800 border rounded-lg px-3 py-1.5 w-64 transition-all ${
              isSearchFocused ? 'ring-2 ring-indigo-500/20 border-indigo-400' : 'border-slate-200 dark:border-slate-700'
            }`}>
              <Search className="w-4 h-4 text-slate-400 mr-2" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search algorithms..."
                className="bg-transparent text-[13px] outline-none w-full placeholder:text-slate-400 text-slate-900 dark:text-white"
              />
              <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-1.5 py-0.5 rounded ml-2 shadow-sm whitespace-nowrap">
                <span className="font-sans">⌘</span> K
              </div>
            </div>

            {/* Search Dropdown Results */}
            {isSearchFocused && (
              <div className="absolute top-full mt-2 left-0 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-xl py-2 z-50 max-h-80 overflow-y-auto">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item, idx) => (
                    <div
                      key={idx}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelectResult(item);
                      }}
                      className="px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer flex flex-col transition-colors border-b border-slate-50 dark:border-slate-700 last:border-0"
                    >
                      <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-200">{item.name}</span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">{item.category}</span>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-[13px] text-slate-500 dark:text-slate-400 text-center">
                    No algorithms found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <a
            href="https://github.com/manishkumar8312/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-medium px-4 py-2 rounded-lg shadow-sm shadow-indigo-600/20 transition-all"
          >
            <GitHubIcon className="w-4 h-4 fill-current" />
            GitHub
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 md:hidden text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4 space-y-3">
          <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Navigation</div>
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-700 dark:text-slate-200">Home</Link>
          <Link to="/algorithms" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-700 dark:text-slate-200">All Categories</Link>
          <Link to="/sorting" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm text-slate-600 dark:text-slate-300 pl-3 border-l-2 border-indigo-500">Sorting Algorithms</Link>
          <Link to="/searching" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm text-slate-600 dark:text-slate-300 pl-3 border-l-2 border-indigo-500">Searching Algorithms</Link>
          <Link to="/pathfinding" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm text-slate-600 dark:text-slate-300 pl-3 border-l-2 border-indigo-500">Pathfinding Algorithms</Link>
          <Link to="/graph" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm text-slate-600 dark:text-slate-300 pl-3 border-l-2 border-indigo-500">Graph Algorithms</Link>
          <Link to="/recursion" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm text-slate-600 dark:text-slate-300 pl-3 border-l-2 border-indigo-500">Recursion & Backtracking</Link>
          <Link to="/trees" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm text-slate-600 dark:text-slate-300 pl-3 border-l-2 border-indigo-500">Tree Algorithms</Link>
          <Link to="/playground" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-slate-700 dark:text-slate-200">Playground</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
