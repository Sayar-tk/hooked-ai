import React from "react";
import YouTubeCard from "./YouTubeCard";
import "../styles/FilteredVideosGrid.css"; // Move styles to a separate CSS file

const FilteredVideosGrid = ({ videos }) => {
  return (
    <div className="filtered-videos-grid">
      {videos.map((video, index) => (
        <YouTubeCard video={video} key={index} />
      ))}
    </div>
  );
};

export default FilteredVideosGrid;
