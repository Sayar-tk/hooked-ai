// src/pages/Profile.js
import React from "react";
import { auth } from "../firebaseConfig";

const Profile = () => {
  const user = auth.currentUser;

  if (!user) {
    return <p>Loading user details...</p>;
  }

  return (
    <div style={styles.container}>
      <h1>Profile</h1>
      <img
        src={user.photoURL || "https://via.placeholder.com/100"}
        alt="Profile"
        style={styles.image}
      />
      <p>
        <strong>Name:</strong> {user.displayName || "N/A"}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>UID:</strong> {user.uid}
      </p>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
  },
  image: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    marginBottom: "20px",
  },
};

export default Profile;
