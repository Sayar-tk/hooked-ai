// src/components/AuthScreen.js
import React from "react";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, provider, db } from "../firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";

const AuthScreen = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      // Sign in user with Google
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if the user already exists in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // If the user doesn't exist, create a new user document with role = "free"
        await setDoc(userDocRef, {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          uid: user.uid,
          role: "free", // Default role
        });
      }
      navigate("/yt-outlier"); // Redirect to the outlier page
    } catch (error) {
      console.error("Error signing in with Google: ", error);
      alert("Failed to sign in.");
    }
  };

  return (
    <div style={styles.container}>
      <h1>Welcome to YouTube Outlier Finder</h1>
      <button onClick={handleGoogleSignIn} style={styles.button}>
        Sign in with Google
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f0f2f5",
    textAlign: "center",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    color: "#fff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default AuthScreen;
