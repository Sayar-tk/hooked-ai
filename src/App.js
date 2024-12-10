// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import YouTubeOutlier from './pages/YouTubeOutlier';
import YouTubeTitleGenerator from './pages/YouTubeTitleGenerator';
import InstagramHooksGenerator from './pages/InstagramHooksGenerator';
import Header from './components/Header';

const App = () => {
  return (
    <Router>
      <div>
        {/* Header with navigation links */}
        <Header />

        {/* Define routes for each page */}
        <main style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<YouTubeOutlier />} />
            <Route path="/youtube-title-generator" element={<YouTubeTitleGenerator />} />
            <Route path="/instagram-hooks-generator" element={<InstagramHooksGenerator />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
