import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

const Home = lazy(() => import('./pages/Home'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));
const SortingPage = lazy(() => import('./pages/SortingPage'));
const SearchingPage = lazy(() => import('./pages/SearchingPage'));
const PathFindingPage = lazy(() => import('./pages/PathFindingPage'));
const GraphPage = lazy(() => import('./pages/GraphPage'));
const TreeAlgorithms = lazy(() => import('./pages/TreeAlgorithms'));
const RecursionAlgorithms = lazy(() => import('./pages/RecursionAlgorithms'));
const PlaygroundPage = lazy(() => import('./pages/PlaygroundPage'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Loading Visualizer...</p>
    </div>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/algorithms" element={<CategoriesPage />} />
            <Route path="/sorting" element={<SortingPage />} />
            <Route path="/searching" element={<SearchingPage />} />
            <Route path="/pathfinding" element={<PathFindingPage />} />
            <Route path="/graph" element={<GraphPage />} />
            <Route path="/recursion" element={<RecursionAlgorithms />} />
            <Route path="/trees" element={<TreeAlgorithms />} />
            <Route path="/playground" element={<PlaygroundPage />} />
          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;
