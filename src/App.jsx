import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SortingPage from './pages/SortingPage';
import SearchingPage from './pages/SearchingPage';
import PathFindingPage from './pages/PathFindingPage';
import GraphPage from './pages/GraphPage';
import TreeAlgorithms from './pages/TreeAlgorithms';
import RecursionAlgorithms from './pages/RecursionAlgorithms';
import MatrixBackground from './components/MatrixBackground';

function App() {
  return (
    <Router>
      {/* Aurora animated background – always visible behind all routes */}
      <div className="bg-aurora">
        <div className="bg-aurora-orb"></div>
        <div className="bg-aurora-grid"></div>
      </div>

      <MatrixBackground />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sorting" element={<SortingPage />} />
        <Route path="/searching" element={<SearchingPage />} />
        <Route path="/pathfinding" element={<PathFindingPage />} />
        <Route path="/graph" element={<GraphPage />} />
        <Route path="/recursion" element={<RecursionAlgorithms />} />
        <Route path="/trees" element={<TreeAlgorithms />} />
      </Routes>
    </Router>
  );
}

export default App;
