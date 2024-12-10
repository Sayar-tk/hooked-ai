// src/components/FilteredVideosGrid.js
import React from "react";
import YouTubeCard from "./YouTubeCard";

const FilteredVideosGrid = ({ videos }) => {
  console.log("FilteredVideosGrid", videos);
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "15px",
        marginTop: "20px",
      }}
    >
      {videos.map((video, index) => (
        <YouTubeCard video={video} key={index} />
      ))}
    </div>
  );
};

export default FilteredVideosGrid;
