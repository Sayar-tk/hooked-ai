import axios from "axios";

const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

export const fetchVideos = async (filters, pageToken = null) => {
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
    throw new Error("Error fetching videos from the YouTube API.");
  }
};

export const processVideos = async (videos, maxVideos = 9) => {
  const videosToShow = [];

  for (let video of videos) {
    try {
      const videoId = video.id.videoId;
      const videoDetailsResponse = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet,contentDetails&id=${videoId}&key=${API_KEY}`
      );

      const videoItem = videoDetailsResponse.data.items[0];
      if (!videoItem || !videoItem.statistics) continue;

      const snippet = videoItem.snippet;

      // Skip live videos
      if (snippet.liveBroadcastContent === "live") continue;

      const contentDetails = videoItem.contentDetails;
      const durationMatch = contentDetails.duration.match(/PT(\d+M)?(\d+S)?/);
      const minutes = parseInt(durationMatch?.[1]?.replace("M", "") || "0", 10);
      const seconds = parseInt(durationMatch?.[2]?.replace("S", "") || "0", 10);

      // Skip shorts (less than 60 seconds)
      if (minutes === 0 && seconds < 60) continue;

      const views = parseInt(videoItem.statistics.viewCount);

      const channelDetailsResponse = await axios.get(
        `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${snippet.channelId}&key=${API_KEY}`
      );

      const channelStats = channelDetailsResponse.data.items[0]?.statistics;
      const subscriberCount = parseInt(channelStats?.subscriberCount || "0");

      // Include videos with views greater than subscriber count
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

      if (videosToShow.length >= maxVideos) break;
    } catch (error) {
      console.error(
        `Error processing video with ID: ${video.id.videoId}`,
        error
      );
    }
  }

  return videosToShow;
};
