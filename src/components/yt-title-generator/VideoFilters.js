import React from "react";

const VideoFilters = ({ filter, setFilter }) => {
  return (
    <div className="filter-container">
      <label htmlFor="filter" className="filter-label">
        Filter Videos:
      </label>
      <select
        id="filter"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="filter-select"
      >
        <option value="Best Performers">Best Performers</option>
        <option value="Your Saved Videos">Your Saved Videos</option>
      </select>
    </div>
  );
};

export default VideoFilters;
