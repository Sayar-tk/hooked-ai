// src/components/Filters.js
import "../styles/Filters.css";
import React, { useState } from "react";

const Filters = ({ filters, setFilters }) => {
  const [searchKeyword, setSearchKeyword] = useState(""); // Store user-entered search keyword

  return (
    <div className="filters-container">
      {/* Published After */}
      <div className="filter-item">
        <label htmlFor="publishedAfter">After:</label>
        <input
          type="date"
          id="publishedAfter"
          value={filters.publishedAfter}
          onChange={(e) =>
            setFilters({ ...filters, publishedAfter: e.target.value })
          }
        />
      </div>

      {/* Published Before */}
      <div className="filter-item">
        <label htmlFor="publishedBefore">Before:</label>
        <input
          type="date"
          id="publishedBefore"
          value={filters.publishedBefore}
          onChange={(e) =>
            setFilters({ ...filters, publishedBefore: e.target.value })
          }
        />
      </div>

      {/* Video Duration */}
      <div className="filter-item">
        <label htmlFor="videoDuration">Duration:</label>
        <select
          id="videoDuration"
          value={filters.videoDuration}
          onChange={(e) =>
            setFilters({ ...filters, videoDuration: e.target.value })
          }
        >
          <option value="short">Short</option>
          <option value="medium">Medium</option>
          <option value="long">Long</option>
        </select>
      </div>

      {/* Order */}
      <div className="filter-item">
        <label htmlFor="order">Order:</label>
        <select
          id="order"
          value={filters.order}
          onChange={(e) => setFilters({ ...filters, order: e.target.value })}
        >
          <option value="viewCount">View Count</option>
          <option value="rating">Rating</option>
          <option value="date">Date</option>
          <option value="relevance">Relevance</option>
        </select>
      </div>

      {/* Search Keyword */}
      <div className="filter-item">
        <label htmlFor="keyword">Keyword:</label>
        <input
          type="text"
          id="keyword"
          value={searchKeyword}
          onChange={(e) => {
            setSearchKeyword(e.target.value); // Update local state
            setFilters({ ...filters, keyword: e.target.value }); // Update parent state
          }}
          placeholder="Enter a keyword to search"
          style={{
            padding: "10px",
            width: "100%",
            border: "1px solid #ddd",
            borderRadius: "5px",
          }}
        />
      </div>
    </div>
  );
};

export default Filters;
