// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import YouTubeOutlier from "./pages/YouTubeOutlier";
import YouTubeTitleGenerator from "./pages/YouTubeTitleGenerator";
import InstagramHooksGenerator from "./pages/InstagramHooksGenerator";
import Header from "./components/Header";
import AuthScreen from "./components/AuthScreen";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <Router>
      <div>
        {/* Header with navigation links */}
        <Header />

        {/* Define routes for each page */}
        <main style={{ padding: "20px" }}>
          <Routes>
            {/* Public Route */}
            <Route path="/" element={<AuthScreen />} />

            {/* Protected Routes */}
            <Route
              path="/yt-outlier"
              element={
                <ProtectedRoute>
                  <YouTubeOutlier />
                </ProtectedRoute>
              }
            />
            <Route
              path="/youtube-title-generator"
              element={
                <ProtectedRoute>
                  <YouTubeTitleGenerator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instagram-hooks-generator"
              element={
                <ProtectedRoute>
                  <InstagramHooksGenerator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
