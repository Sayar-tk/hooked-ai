// src/components/YouTubeCard.js
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import "../styles/YouTubeSearch.css";

function YouTubeCard({ video }) {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role || "free"); // Default role is free
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }
    };

    fetchUserRole();
  }, []);

  const saveVideo = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to save videos.");
      return;
    }

    const videoData = {
      title: video.title || "Untitled Video", // Default to "Untitled Video" if title is missing
      thumbnail: video.thumbnail || "", // Default to empty string if thumbnail is missing
      channelName: video.channelName || "Unknown Channel", // Default value
      timeSinceUpload: video.timeSinceUpload || "Unknown", // Default if not provided
      outlierFactor: video.outlierFactor ? String(video.outlierFactor) : "0", // Ensure string format
      views: video.views ? String(video.views) : "0", // Ensure views are strings
    };
    try {
      if (userRole === "free" || userRole === "paid") {
        const userDocRef = doc(db, "users", user.uid);
        const savedVideosRef = collection(userDocRef, "savedVideos"); // Subcollection for saved videos

        await addDoc(savedVideosRef, videoData);

        alert(`Video "${video.title}" saved successfully!`);
      } else {
        await addDoc(collection(db, "savedVideos"), videoData);
        alert(`Video "${videoData.title}" saved successfully!`);
      }
    } catch (error) {
      console.error("Error saving video:", error);
      alert("Failed to save video.");
    }
  };

  return (
    <div className="video-info">
      <img
        src={video.thumbnail}
        alt={video.title}
        className="video-thumbnail"
      />
      <div className="video-details">
        <h3 className="video-title">{video.title}</h3>
        <p className="channel-name">{video.channelName}</p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "10px",
          }}
        >
          <p className="video-stats">{video.timeSinceUpload}</p>
          <p className="video-stats" style={{ marginLeft: "10px" }}>
            {video.views} views
          </p>
        </div>
        <p className="outlier-message">
          <span>{video.outlierFactor}x</span> views over subscribers
        </p>
      </div>
      <button
        onClick={saveVideo}
        className="button"
        style={{ width: "auto", padding: "5px 10px" }}
      >
        Save Video
      </button>
    </div>
  );
}

export default YouTubeCard;
