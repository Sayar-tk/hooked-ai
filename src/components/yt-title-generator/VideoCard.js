import React from "react";

const VideoCard = ({ video, onModelVideo }) => (
  <div className="yt-video-card">
    <img
      src={video.thumbnail || "https://via.placeholder.com/150"}
      alt={video.title}
      className="yt-video-thumbnail"
    />
    <div className="yt-video-details">
      <h3 className="yt-video-title">{video.title || "Untitled Video"}</h3>
      <p className="yt-video-channel">
        Channel: {video.channelName || "Unknown Channel"}
      </p>
      {video.outlierFactor && (
        <p className="yt-video-outlier">
          Outlier Factor: {video.outlierFactor}x
        </p>
      )}
      <button
        className="model-video-button"
        onClick={() => onModelVideo(video)}
      >
        Model this video
      </button>
    </div>
  </div>
);

export default VideoCard;
