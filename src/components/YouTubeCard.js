// src/components/YouTubeCard.js
import React from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import "../styles/YouTubeSearch.css";

function YouTubeCard({ video }) {
  // Function to save a video to Firebase
  const saveVideo = async (video) => {
    console.log("Saving video data:", video); // Debugging

    // Validate and clean the video object
    const videoData = {
      title: video.title || "Untitled Video", // Default to "Untitled Video" if title is missing
      thumbnail: video.thumbnail || "", // Default to empty string if thumbnail is missing
      channelName: video.channelName || "Unknown Channel", // Default value
      timeSinceUpload: video.timeSinceUpload || "Unknown", // Default if not provided
      outlierFactor: video.outlierFactor ? String(video.outlierFactor) : "0", // Ensure string format
      views: video.views ? String(video.views) : "0", // Ensure views are strings
    };

    // Log the cleaned video data
    console.log("Cleaned video data to be saved:", videoData);

    try {
      await addDoc(collection(db, "savedVideos"), videoData);
      alert(`Video "${videoData.title}" saved successfully!`);
    } catch (error) {
      console.error("Error saving video to Firestore:", error.message);
      alert("Failed to save video. Please try again.");
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
        onClick={() => saveVideo(video)}
        className="button"
        style={{ width: "auto", padding: "5px" }}
      >
        Save
      </button>
    </div>
  );
}

export default YouTubeCard;
