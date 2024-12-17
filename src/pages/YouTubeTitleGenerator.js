import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import "../styles/YouTubeTitleGenerator.css";
import { generateTitleFramework } from "../services/openaiService";

const YouTubeTitleGenerator = () => {
  const [videos, setVideos] = useState([]);
  const [visibleVideos, setVisibleVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadMoreVisible, setLoadMoreVisible] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(null); // Modal video data
  const [framework, setFramework] = useState(""); // Title framework state
  const [frameworkLoading, setFrameworkLoading] = useState(false); // Loading state for framework

  const PAGE_SIZE = 12;

  useEffect(() => {
    const fetchSavedVideos = async () => {
      setLoading(true);
      setError("");
      try {
        const savedVideosRef = collection(db, "savedVideos");
        const snapshot = await getDocs(savedVideosRef);

        const fetchedVideos = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setVideos(fetchedVideos);
        setVisibleVideos(fetchedVideos.slice(0, PAGE_SIZE));
        setLoadMoreVisible(fetchedVideos.length > PAGE_SIZE);
      } catch (err) {
        console.error("Error fetching saved videos:", err);
        setError("Failed to load videos. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedVideos();
  }, []);

  const loadMoreVideos = () => {
    const nextIndex = startIndex + PAGE_SIZE;
    const newVisibleVideos = videos.slice(0, nextIndex + PAGE_SIZE);

    setVisibleVideos(newVisibleVideos);
    setStartIndex(nextIndex);

    if (newVisibleVideos.length >= videos.length) {
      setLoadMoreVisible(false);
    }
  };

  const openModal = async (video) => {
    setSelectedVideo(video);
    setFramework("");
    setFrameworkLoading(true);

    try {
      const generatedFramework = await generateTitleFramework(video.title);
      setFramework(generatedFramework);
    } catch (error) {
      setFramework("Error generating title framework. Try again later.");
    } finally {
      setFrameworkLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedVideo(null);
    setFramework("");
  };

  return (
    <div className="yt-title-generator-container">
      <h1 className="yt-title-generator-title">YouTube Title Generator</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : visibleVideos.length === 0 ? (
        <p>No saved videos found.</p>
      ) : (
        <>
          <div className="yt-title-videos-grid">
            {visibleVideos.map((video) => (
              <div key={video.id} className="yt-video-card">
                <img
                  src={video.thumbnail || "https://via.placeholder.com/150"}
                  alt={video.title}
                  className="yt-video-thumbnail"
                />
                <div className="yt-video-details">
                  <h3 className="yt-video-title">{video.title}</h3>
                  <p className="yt-video-channel">
                    Channel: {video.channelName || "Unknown Channel"}
                  </p>
                  <button
                    className="model-video-button"
                    onClick={() => openModal(video)}
                  >
                    Model this video
                  </button>
                </div>
              </div>
            ))}
          </div>

          {loadMoreVisible && (
            <button onClick={loadMoreVideos} className="load-more-button">
              Load More
            </button>
          )}
        </>
      )}

      {selectedVideo && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Model this Video</h2>
            <p className="modal-video-title">{selectedVideo.title}</p>
            {frameworkLoading ? (
              <p>Loading title framework...</p>
            ) : (
              <p className="modal-framework">{framework}</p>
            )}
            <button className="modal-close-button" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default YouTubeTitleGenerator;
