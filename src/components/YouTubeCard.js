// src/components/YouTubeCard.js
import React from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import "../styles/YouTubeSearch.css";

function YouTubeCard({ video }) {
  // Function to save a video to Firebase
  const saveVideo = async (video) => {
    try {
      await addDoc(collection(db, "savedVideos"), {
        title: video.title,
        thumbnail: video.thumbnail,
        channelName: video.channelName,
        timeSinceUpload: video.timeSinceUpload,
        outlierFactor: video.outlierFactor, // Save the outlier factor as well
        views: video.views, // Save the view count as well
      });
      alert(`Video "${video.title}" saved successfully!`);
    } catch (error) {
      console.error("Error saving video: ", error);
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
            {video.views.toLocaleString()} views
          </p>
        </div>
        <p className="outlier-message">
          <span>{video.outlierFactor}x</span> views over subscribers
        </p>
      </div>
      <button
        onClick={() => saveVideo(video)}
        className="button"
        style={{ width: "auto", padding: "5px 10px" }}
      >
        Save
      </button>
    </div>
  );
}

export default YouTubeCard;
