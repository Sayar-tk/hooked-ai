// src/App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import YouTubeOutlier from "./pages/YouTubeOutlier";
import YouTubeTitleGenerator from "./pages/YouTubeTitleGenerator";
import InstagramHooksGenerator from "./pages/InstagramHooksGenerator";
import Header from "./components/Header";
import AuthScreen from "./components/AuthScreen";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import {
  getAuth,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { Navigate } from "react-router-dom";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    // Set local persistence
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        // Listen for authentication state changes
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          setLoading(false);
        });

        // Cleanup listener on unmount
        return () => unsubscribe();
      })
      .catch((error) => {
        console.error("Error setting persistence:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>Loading...</div>
    );
  }

  return (
    <Router>
      <div>
        {/* Show Header only if the user is logged in */}
        {user && <Header />}

        <main style={{ padding: "20px" }}>
          <Routes>
            {/* Public Route */}
            <Route
              path="/"
              element={user ? <Navigate to="/yt-outlier" /> : <AuthScreen />}
            />

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
