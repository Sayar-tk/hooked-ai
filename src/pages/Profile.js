// src/pages/Profile.js
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../styles/ProfilePage.css";

const Profile = () => {
  const user = auth.currentUser;
  const [savedVideos, setSavedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(""); // Tracks "free", "paid", or "admin"
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDataAndVideos = async () => {
      if (!user) {
        alert("You must be logged in to view your saved videos.");
        return;
      }

      try {
        // Fetch user role
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserRole(userData.role || "free"); // Default to "free" if no role is found
        } else {
          console.error("User document not found in Firestore");
        }

        // Fetch saved videos for free/paid users
        if (userRole === "free" || userRole === "paid") {
          const savedVideosRef = collection(
            db,
            "users",
            user.uid,
            "savedVideos"
          );
          const snapshot = await getDocs(savedVideosRef);

          const videos = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setSavedVideos(videos);
        } else if (userRole === "admin") {
          // Fetch global saved videos for admins
          // const savedVideosRef = collection(db, "savedVideos");
          // const snapshot = await getDocs(savedVideosRef);
          // const videos = snapshot.docs.map((doc) => ({
          //   id: doc.id,
          //   ...doc.data(),
          // }));
          // setSavedVideos(videos);
        }
      } catch (error) {
        console.error("Error fetching user data or saved videos:", error);
        alert("Failed to fetch saved videos.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDataAndVideos();
  }, [user, userRole]);

  if (!user) {
    return <p>Loading user details...</p>;
  }

  const handleUpgradeClick = () => {
    navigate("/pricing"); // Navigate to the pricing page
  };

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

      {/* Show Upgrade Subscription button for "free" users */}
      {userRole === "free" && (
        <button onClick={handleUpgradeClick} style={styles.upgradeButton}>
          Upgrade Subscription
        </button>
      )}

      {/* Saved Videos Section */}
      {userRole !== "admin" && (
        <div>
          <h2>Saved Videos</h2>
          {loading ? (
            <p>Loading saved videos...</p>
          ) : savedVideos.length === 0 ? (
            <p>No saved videos found.</p>
          ) : (
            <div className="saved-videos-grid">
              {savedVideos.map((video) => (
                <div key={video.id} className="video-card">
                  <img src={video.thumbnail} alt={video.title} />
                  <h3>{video.title}</h3>
                  <p>{video.channelName}</p>
                  <p>{video.timeSinceUpload}</p>
                  <p>{video.views} views</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
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
  upgradeButton: {
    marginTop: "20px",
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Profile;
