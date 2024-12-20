import React, { useState } from "react";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, provider, db } from "../firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";

const AuthScreen = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between signup and login

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          uid: user.uid,
          role: "free", // Default role
        });
      }
      navigate("/yt-outlier");
    } catch (error) {
      console.error("Error signing in with Google: ", error);
      alert("Failed to sign in.");
    }
  };

  const handleEmailSubmit = async () => {
    try {
      if (isSignUp) {
        // Sign up with email and password
        const result = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = result.user;

        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          await setDoc(userDocRef, {
            name: user.email.split("@")[0], // Use part of the email as the name
            email: user.email,
            photoURL: null,
            uid: user.uid,
            role: "free", // Default role
          });
        }
        alert("Sign up successful! Redirecting...");
        navigate("/yt-outlier");
      } else {
        // Log in with email and password
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/yt-outlier");
      }
    } catch (error) {
      console.error("Error with email authentication: ", error);
      alert(isSignUp ? "Failed to sign up." : "Failed to sign in.");
    }
  };

  return (
    <div style={styles.container}>
      <h1>{isSignUp ? "Sign Up" : "Sign In"} to ViralVideoSpy</h1>
      <p style={styles.subheading}>
        Spy on the best performing videos on the internet.
      </p>
      <button onClick={handleGoogleSignIn} style={styles.button}>
        {isSignUp ? "Sign Up" : "Sign In"} with Google
      </button>
      <p style={styles.emailSeparator}>OR</p>

      <div style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleEmailSubmit} style={styles.button}>
          {isSignUp ? "Sign Up" : "Sign In"}
        </button>
        <p
          style={styles.toggleText}
          onClick={() => setIsSignUp((prev) => !prev)}
        >
          {isSignUp
            ? "Already have an account? Sign in here."
            : "Don't have an account? Sign up here."}
        </p>
      </div>
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
    backgroundColor: "#020100",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    minWidth: "300px",
    marginTop: "15px",
  },
  subheading: {
    marginBottom: "20px",
    marginTop: "10px",
  },
  emailSeparator: {
    marginBottom: "20px",
    marginTop: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    width: "100%",
  },
  input: {
    padding: "10px",
    width: "300px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    fontSize: "16px",
  },
  toggleText: {
    marginTop: "10px",
    color: "#235789",
    cursor: "pointer",
    textDecoration: "underline",
  },
};

export default AuthScreen;
