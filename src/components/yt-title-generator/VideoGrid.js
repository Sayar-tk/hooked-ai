import React from "react";
import VideoCard from "./VideoCard";

const VideoGrid = ({ videos, onModelVideo }) => (
  <div className="yt-title-videos-grid">
    {videos.map((video) => (
      <VideoCard key={video.id} video={video} onModelVideo={onModelVideo} />
    ))}
  </div>
);

export default VideoGrid;
