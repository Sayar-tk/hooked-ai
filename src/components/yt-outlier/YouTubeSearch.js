import React, { useState } from "react";
// import axios from "axios";
import FilteredVideosGrid from "./FilteredVideosGrid";
import Filters from "./Filters";
import "../styles/YouTubeSearch.css";
import { fetchVideos, processVideos } from "../../services/youtubeApi";

const YouTubeSearch = () => {
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    publishedAfter: "",
    publishedBefore: "",
    videoDuration: "medium", // Default: Medium
    order: "viewCount", // Default: View Count
    keyword: "",
  });
  const [nextPageToken, setNextPageToken] = useState(null);
  const [hasMoreVideos, setHasMoreVideos] = useState(true); // Track if there are more videos

  // Generate Videos with New Filters
  const generateVideos = async () => {
    setFilteredVideos([]); // Clear existing videos
    setNextPageToken(null); // Reset pagination
    setHasMoreVideos(true); // Allow more videos to load
    setLoading(true);
    setError("");

    try {
      const response = await fetchVideos(filters, nextPageToken);

      if (!response || !response.items.length) {
        setError("No videos found with the current filters.");
        setHasMoreVideos(false);
        return;
      }

      const processedVideos = await processVideos(response.items);
      setFilteredVideos(processedVideos);
      setNextPageToken(response.nextPageToken || null);
      if (!response.nextPageToken) setHasMoreVideos(false);
    } catch (err) {
      console.error("Error generating videos:", err);
      setError("Error generating videos.");
    } finally {
      setLoading(false);
    }
  };

  // Load More Videos
  const loadVideos = async () => {
    if (!hasMoreVideos || !nextPageToken) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetchVideos(filters, nextPageToken);

      if (!response || !response.items.length) {
        setHasMoreVideos(false);
        setError(
          "No more videos found with current filters, please adjust the filters for more videos."
        );
        return;
      }

      const processedVideos = await processVideos(response.items);
      setFilteredVideos((prevVideos) => [...prevVideos, ...processedVideos]);
      setNextPageToken(response.nextPageToken || null);
      if (!response.nextPageToken) setHasMoreVideos(false);
    } catch (err) {
      console.error("Error loading more videos:", err);
      setError("Error loading more videos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1 className="title">YouTube Outlier Finder</h1>

      {/* Filters */}
      <Filters filters={filters} setFilters={setFilters} />

      {/* Generate Videos Button */}
      <button onClick={generateVideos} className="button" disabled={loading}>
        {loading ? "Loading..." : "Generate Videos"}
      </button>

      {/* Video Grid */}
      <FilteredVideosGrid videos={filteredVideos} />

      {/* Load More Button */}
      {hasMoreVideos && !loading && filteredVideos.length > 0 && (
        <button onClick={loadVideos} className="loadmore-button">
          Load More
        </button>
      )}

      {/* Error Message */}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default YouTubeSearch;
