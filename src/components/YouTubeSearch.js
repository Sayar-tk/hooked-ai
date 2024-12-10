// src/components/YouTubeSearch.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import FilteredVideosGrid from "./FilteredVideosGrid";
import "../styles/YouTubeSearch.css";

const YouTubeSearch = () => {
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchKeyword, setSearchKeyword] = useState(""); // Store user-entered search keyword
  const [pageTokens, setPageTokens] = useState([]); // Store a list of page tokens for randomization

  const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

  // Fetch initial page tokens for random video generation
  const fetchPageTokens = async () => {
    try {
      const tokens = [];
      let currentPageToken = null;

      // Fetch up to 5 pages of tokens (adjust as needed)
      for (let i = 0; i < 5; i++) {
        const response = await axios.get(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=50&pageToken=${
            currentPageToken || ""
          }&key=${API_KEY}`
        );
        tokens.push(response.data.nextPageToken);
        currentPageToken = response.data.nextPageToken;

        if (!currentPageToken) break; // Stop if no more pages
      }

      setPageTokens(tokens.filter((token) => token)); // Filter out null tokens
    } catch (err) {
      console.error("Error fetching page tokens:", err);
    }
  };

  // Generate random videos using random page tokens
  const generateRandomVideos = async () => {
    if (pageTokens.length === 0) {
      await fetchPageTokens(); // Ensure tokens are available
    }

    setLoading(true);
    setError("");

    try {
      let videosToShow = [];
      const randomPageToken =
        pageTokens[Math.floor(Math.random() * pageTokens.length)]; // Pick a random token

      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=50&pageToken=${randomPageToken}&key=${API_KEY}`
      );

      const videos = response.data.items;

      // Filtering and processing logic (same as before)
      videosToShow = await processVideos(videos);

      setFilteredVideos(videosToShow);
    } catch (err) {
      setError("Error fetching random videos from the YouTube API.");
    } finally {
      setLoading(false);
    }
  };

  // Search for videos using user-entered keyword
  const searchVideos = async () => {
    if (!searchKeyword.trim()) {
      setError("Please enter a search keyword.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${searchKeyword}&order=viewCount&maxResults=50&key=${API_KEY}`
      );
      console.log("RESP:", response);

      const videos = response.data.items;

      // Filtering and processing logic (same as before)
      const videosToShow = await processVideos(videos);

      setFilteredVideos(videosToShow);
      console.log("filtered videos", filteredVideos);
    } catch (err) {
      setError("Error fetching search results from the YouTube API.");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to process and filter videos
  const processVideos = async (videos) => {
    const videosToShow = [];

    for (let video of videos) {
      const videoId = video.id.videoId;
      const videoDetails = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet,contentDetails&id=${videoId}&key=${API_KEY}`
      );

      const videoItem = videoDetails.data.items[0];
      const snippet = videoItem.snippet;

      if (snippet.liveBroadcastContent === "live") continue;

      const contentDetails = videoItem.contentDetails;
      const durationMatch = contentDetails.duration.match(/PT(\d+M)?(\d+S)?/);
      const minutes = parseInt(durationMatch?.[1]?.replace("M", "") || "0", 10);
      const seconds = parseInt(durationMatch?.[2]?.replace("S", "") || "0", 10);

      if (minutes === 0 && seconds < 60) continue;

      const views = parseInt(videoItem.statistics.viewCount);
      const channelDetails = await axios.get(
        `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${snippet.channelId}&key=${API_KEY}`
      );

      const channelStats = channelDetails.data.items[0].statistics;
      const subscriberCount = parseInt(channelStats.subscriberCount);

      if (views > subscriberCount) {
        const outlierFactor = (views / subscriberCount).toFixed(2); // Calculate outlier factor

        const uploadDate = new Date(snippet.publishedAt);
        const currentDate = new Date();
        const daysSinceUpload = Math.floor(
          (currentDate - uploadDate) / (1000 * 60 * 60 * 24)
        );
        let timeSinceUpload;

        if (daysSinceUpload > 365) {
          const years = Math.floor(daysSinceUpload / 365);
          timeSinceUpload = `${years} year${years > 1 ? "s" : ""} ago`;
        } else if (daysSinceUpload > 30) {
          const months = Math.floor(daysSinceUpload / 30);
          timeSinceUpload = `${months} month${months > 1 ? "s" : ""} ago`;
        } else {
          timeSinceUpload = `${daysSinceUpload} day${
            daysSinceUpload > 1 ? "s" : ""
          } ago`;
        }

        videosToShow.push({
          title: snippet.title,
          thumbnail: snippet.thumbnails.high.url,
          channelName: snippet.channelTitle,
          timeSinceUpload,
          outlierFactor,
        });
      }

      if (videosToShow.length >= 9) break;
    }

    return videosToShow;
  };

  // Load initial page tokens on component mount
  useEffect(() => {
    fetchPageTokens();
  }, []);

  return (
    <div className="app-container">
      <h1 className="title">YouTube Outlier Finder</h1>

      {/* Search Bar */}
      <div style={{ marginBottom: "20px", display: "flex" }}>
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="Enter a keyword to search"
          style={{
            padding: "10px",
            width: "70%",
            border: "1px solid #ddd",
            borderRadius: "5px",
          }}
        />
        <button
          onClick={searchVideos}
          disabled={loading}
          className="button"
          style={{ width: "30%", marginLeft: "10px" }}
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      {/* Generate Random Videos Button */}
      <button
        onClick={generateRandomVideos}
        disabled={loading}
        className="button"
      >
        {loading ? "Loading..." : "Generate Random Videos"}
      </button>

      {error && <p className="error-message">{error}</p>}
      {filteredVideos.length > 0 && (
        <FilteredVideosGrid videos={filteredVideos} />
      )}
    </div>
  );
};

export default YouTubeSearch;
