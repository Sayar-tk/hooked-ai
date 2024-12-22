// src/components/Filters.js
import "../../styles/Filters.css";
import React from "react";

const Filters = ({ filters, setFilters }) => (
  <div className="filters-container">
    <div className="filter-group">
      <label htmlFor="keyword" className="filter-label">
        Keyword
      </label>
      <input
        id="keyword"
        type="text"
        className="filter-input"
        value={filters.keyword}
        onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
      />
    </div>
    <div className="filter-group">
      <label htmlFor="publishedAfter" className="filter-label">
        Published After
      </label>
      <input
        id="publishedAfter"
        type="date"
        className="filter-input"
        value={filters.publishedAfter}
        onChange={(e) =>
          setFilters({ ...filters, publishedAfter: e.target.value })
        }
      />
    </div>
    <div className="filter-group">
      <label htmlFor="publishedBefore" className="filter-label">
        Published Before
      </label>
      <input
        id="publishedBefore"
        type="date"
        className="filter-input"
        value={filters.publishedBefore}
        onChange={(e) =>
          setFilters({ ...filters, publishedBefore: e.target.value })
        }
      />
    </div>
    <div className="filter-group">
      <label htmlFor="videoDuration" className="filter-label">
        Video Duration
      </label>
      <select
        id="videoDuration"
        className="filter-input"
        value={filters.videoDuration}
        onChange={(e) =>
          setFilters({ ...filters, videoDuration: e.target.value })
        }
      >
        <option value="any">Any</option>
        <option value="short">Short (&lt; 4 min)</option>
        <option value="medium">Medium (4-20 min)</option>
        <option value="long">Long (&gt; 20 min)</option>
      </select>
    </div>
    <div className="filter-group">
      <label htmlFor="order" className="filter-label">
        Order By
      </label>
      <select
        id="order"
        className="filter-input"
        value={filters.order}
        onChange={(e) => setFilters({ ...filters, order: e.target.value })}
      >
        <option value="viewCount">View Count</option>
        <option value="relevance">Relevance</option>
        <option value="date">Upload Date</option>
      </select>
    </div>
  </div>
);

export default Filters;
