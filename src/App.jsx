import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Home from './pages/Home';
import CategoriesPage from './pages/CategoriesPage';
import SortingPage from './pages/SortingPage';
import SearchingPage from './pages/SearchingPage';
import PathFindingPage from './pages/PathFindingPage';
import GraphPage from './pages/GraphPage';
import TreeAlgorithms from './pages/TreeAlgorithms';
import RecursionAlgorithms from './pages/RecursionAlgorithms';
import PlaygroundPage from './pages/PlaygroundPage';

function App() {
  return (
    <ThemeProvider>
      <Router>
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
      </Router>
    </ThemeProvider>
  );
}

export default App;
