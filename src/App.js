// src/App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import YouTubeOutlier from "./pages/YouTubeOutlier";
import YouTubeTitleGenerator from "./pages/YouTubeTitleGenerator";
import InstagramHooksGenerator from "./pages/InstagramHooksGenerator";
import Header from "./components/Header";
import AuthScreen from "./pages/AuthScreen";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import Pricing from "./pages/Pricing";
import { checkCreditsExpiry } from "./services/firebase";

import {
  getAuth,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { Navigate } from "react-router-dom";
import PaymentSuccess from "./pages/payment/PaymentSuccess";
import PaymentFailure from "./pages/payment/PaymentFailure";
import PrivacyPolicy from "./pages/policy/PrivacyPolicy";
import ContactUs from "./pages/policy/ContactUs";
import TermsConditions from "./pages/policy/TermsConditions";
import RefundsCancellations from "./pages/policy/RefundsCancellations";
import Footer from "./components/Footer";

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

    //notify for credit expiry
    checkCreditsExpiry();
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
            <Route
              path="/pricing"
              element={
                <ProtectedRoute>
                  <Pricing />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment-success/:orderId"
              element={
                <ProtectedRoute>
                  <PaymentSuccess />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment-failure"
              element={
                <ProtectedRoute>
                  <PaymentFailure />
                </ProtectedRoute>
              }
            />
            <Route
              path="/privacy-policy"
              element={
                <ProtectedRoute>
                  <PrivacyPolicy />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contact-us"
              element={
                <ProtectedRoute>
                  <ContactUs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/terms-of-service"
              element={
                <ProtectedRoute>
                  <TermsConditions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/refund-policy"
              element={
                <ProtectedRoute>
                  <RefundsCancellations />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
