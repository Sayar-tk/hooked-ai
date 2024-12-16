// src/pages/Profile.js
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import "../styles/ProfilePage.css";

const Profile = () => {
  const user = auth.currentUser;
  const [savedVideos, setSavedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(false);
  useEffect(() => {
    const fetchSavedVideos = async () => {
      const user = auth.currentUser;
      if (!user) {
        alert("You must be logged in to view your saved videos.");
        return;
      }
      if (user?.role === "free" || user?.role === "paid") {
        setUserRole(true);
      }

      try {
        const savedVideosRef = collection(db, "users", user.uid, "savedVideos");
        const snapshot = await getDocs(savedVideosRef);

        const videos = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setSavedVideos(videos);
      } catch (error) {
        console.error("Error fetching saved videos:", error);
        alert("Failed to fetch saved videos.");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedVideos();
  }, []);

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
      {userRole ? <h2>Saved Videos</h2> : <></>}

      {loading ? (
        <p>Loading saved videos...</p>
      ) : savedVideos.length === 0 && userRole ? (
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
