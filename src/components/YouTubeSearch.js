import React, { useState } from "react";
import axios from "axios";
import FilteredVideosGrid from "./FilteredVideosGrid";
import Filters from "./Filters";
import "../styles/YouTubeSearch.css";

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

  const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

  // Helper Function to Fetch Videos from YouTube API
  const fetchVideos = async (pageToken = null) => {
    try {
      const queryParam = filters.keyword.trim()
        ? `&q=${encodeURIComponent(filters.keyword)}`
        : "";

      const publishedAfter = filters.publishedAfter
        ? `${filters.publishedAfter}T00:00:00Z`
        : "";
      const publishedBefore = filters.publishedBefore
        ? `${filters.publishedBefore}T00:00:00Z`
        : "";

      const publishedAfterParam = publishedAfter
        ? `&publishedAfter=${publishedAfter}`
        : "";
      const publishedBeforeParam = publishedBefore
        ? `&publishedBefore=${publishedBefore}`
        : "";

      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoDuration=${
          filters.videoDuration
        }&order=${
          filters.order
        }&relevanceLanguage=en${publishedAfterParam}${publishedBeforeParam}${queryParam}&maxResults=50&pageToken=${
          pageToken || ""
        }&key=${API_KEY}`
      );

      return response.data;
    } catch (err) {
      console.error("Error fetching videos:", err);
      setError("Error fetching videos from the YouTube API.");
      return null;
    }
  };

  // Helper Function to Process Videos
  const processVideos = async (videos) => {
    const videosToShow = [];

    for (let video of videos) {
      const videoId = video.id.videoId;
      const videoDetails = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet,contentDetails&id=${videoId}&key=${API_KEY}`
      );

      const videoItem = videoDetails.data.items[0];
      if (!videoItem || !videoItem.statistics) continue;

      const snippet = videoItem.snippet;

      if (snippet.liveBroadcastContent === "live") continue;

      const contentDetails = videoItem.contentDetails;
      const durationMatch = contentDetails.duration.match(/PT(\d+M)?(\d+S)?/);
      const minutes = parseInt(durationMatch?.[1]?.replace("M", "") || "0", 10);
      const seconds = parseInt(durationMatch?.[2]?.replace("S", "") || "0", 10);

      if (minutes === 0 && seconds < 60) continue; // Skip shorts

      const views = parseInt(videoItem.statistics.viewCount);
      const channelDetails = await axios.get(
        `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${snippet.channelId}&key=${API_KEY}`
      );

      const channelStats = channelDetails.data.items[0]?.statistics;
      const subscriberCount = parseInt(channelStats?.subscriberCount || "0");

      if (views > subscriberCount) {
        const outlierFactor = (views / subscriberCount).toFixed(2);

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
          views: views.toLocaleString(),
        });
      }

      if (videosToShow.length >= 9) break;
    }

    return videosToShow;
  };

  // Generate Videos with New Filters
  const generateVideos = async () => {
    setFilteredVideos([]); // Clear existing videos
    setNextPageToken(null); // Reset pagination
    setHasMoreVideos(true); // Allow more videos to load
    setLoading(true);
    setError("");

    try {
      const response = await fetchVideos();

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
      const response = await fetchVideos(nextPageToken);

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
