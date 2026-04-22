import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import KnowledgeBase from './pages/KnowledgeBase';
import Tasks from './pages/Tasks';
import CanvasGen from './pages/CanvasGen';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="knowledge" element={<KnowledgeBase />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="canvas" element={<CanvasGen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
