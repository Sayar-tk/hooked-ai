// src/components/YouTubeSearch.js
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

  const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

  // Generate random videos using random page tokens
  const generateRandomVideos = async () => {
    setLoading(true);
    setError("");

    try {
      const queryParam = filters.keyword.trim()
        ? `&q=${encodeURIComponent(filters.keyword)}`
        : "";

      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoDuration=${filters.videoDuration}&publishedAfter=${filters.publishedAfter}&publishedBefore=${filters.publishedBefore}&order=${filters.order}&relevanceLanguage=en${queryParam}&maxResults=50&key=${API_KEY}`
      );

      const videos = response.data.items;

      // Process the videos and add to videosToShow
      const videosToShow = await processVideos(videos);

      if (videosToShow.length === 0) {
        setError("No videos found that match the criteria.");
      } else {
        setFilteredVideos(videosToShow);
      }
    } catch (err) {
      setError("Error fetching videos from the YouTube API.");
      console.error(err);
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

  return (
    <div className="app-container">
      <h1 className="title">YouTube Outlier Finder</h1>

      {/* Filters */}
      <Filters filters={filters} setFilters={setFilters} />
      {/* Generate Random Videos Button */}
      <button
        onClick={generateRandomVideos}
        disabled={loading}
        className="button"
      >
        {loading ? "Loading..." : "Generate Videos"}
      </button>

      {error && <p className="error-message">{error}</p>}
      {filteredVideos.length > 0 && (
        <FilteredVideosGrid videos={filteredVideos} />
      )}
    </div>
  );
};

export default YouTubeSearch;
