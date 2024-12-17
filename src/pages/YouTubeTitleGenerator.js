import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import "../styles/YouTubeTitleGenerator.css";
import { generateTitleFramework } from "../services/openaiService";
import VideoGrid from "../components/yt-title-generator/VideoGrid";
import TitleGeneratorModal from "../components/yt-title-generator/TitleGeneratorModal";
import LoadMoreButton from "../components/yt-title-generator/LoadMoreButton";

const YouTubeTitleGenerator = () => {
  const [videos, setVideos] = useState([]);
  const [visibleVideos, setVisibleVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadMoreVisible, setLoadMoreVisible] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [framework, setFramework] = useState("");
  const [frameworkLoading, setFrameworkLoading] = useState(false);

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
          <VideoGrid videos={visibleVideos} onModelVideo={openModal} />
          {loadMoreVisible && <LoadMoreButton onClick={loadMoreVideos} />}
        </>
      )}
      {selectedVideo && (
        <TitleGeneratorModal
          video={selectedVideo}
          framework={framework}
          frameworkLoading={frameworkLoading}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default YouTubeTitleGenerator;
