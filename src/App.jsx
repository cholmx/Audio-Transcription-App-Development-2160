import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import TranscriptionPage from './pages/TranscriptionPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Routes>
          <Route path="/" element={<TranscriptionPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;