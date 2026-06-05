import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SortingPage from './pages/SortingPage';
import SearchingPage from './pages/SearchingPage';
import PathFindingPage from './pages/PathFindingPage';
import GraphPage from './pages/GraphPage';
import ParticlesBackground from './components/ParticlesBackground';
function App() {
  return (
    <Router>
      <ParticlesBackground />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sorting" element={<SortingPage />} />
        <Route path="/searching" element={<SearchingPage />} />
        <Route path="/pathfinding" element={<PathFindingPage />} />
        <Route path="/graph" element={<GraphPage />} />
        <Route path="/recursion" element={<GraphPage />} />
      </Routes>
    </Router>
  );
}

export default App;
