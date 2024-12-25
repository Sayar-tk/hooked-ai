import React, { useEffect, useState } from "react";
import { db, auth } from "../firebaseConfig";
import { collection, getDocs, doc, query, where } from "firebase/firestore";
import "../styles/YouTubeTitleGenerator.css";
import { generateTitleFramework } from "../services/openaiService";
import VideoGrid from "../components/yt-title-generator/VideoGrid";
import TitleGeneratorModal from "../components/yt-title-generator/TitleGeneratorModal";
import LoadMoreButton from "../components/yt-title-generator/LoadMoreButton";
import VideoFilters from "../components/yt-title-generator/VideoFilters";
import { deductCredits } from "../services/firebase";

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
  const [filter, setFilter] = useState("Best Performers"); // Filter state
  const PAGE_SIZE = 12;

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError("");
      try {
        let fetchedVideos = [];

        if (filter === "Best Performers") {
          // Fetch global saved videos
          const savedVideosRef = collection(db, "savedVideos");
          const snapshot = await getDocs(savedVideosRef);
          fetchedVideos = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        } else if (filter === "Your Saved Videos") {
          // Fetch user's saved videos
          const user = auth.currentUser;
          if (!user) {
            setError("You must be logged in to see your saved videos.");
            return;
          }

          const userSavedVideosRef = collection(
            doc(db, "users", user.uid),
            "savedVideos"
          );
          const snapshot = await getDocs(userSavedVideosRef);
          fetchedVideos = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        }

        setVideos(fetchedVideos);
        setVisibleVideos(fetchedVideos.slice(0, PAGE_SIZE));
        setLoadMoreVisible(fetchedVideos.length > PAGE_SIZE);
      } catch (err) {
        console.error("Error fetching videos:", err);
        setError("Failed to load videos. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [filter]);

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
      // Check if the framework is already saved
      if (video.titleFramework) {
        setFramework(video.titleFramework);
      } else {
        const hasEnoughCredits = await deductCredits(0.5); // Deduct 0.5 credits
        if (!hasEnoughCredits) return; // Abort if not enough credits

        const generatedFramework = await generateTitleFramework(video.title);
        setFramework(generatedFramework);

        // Optionally save the framework to the video
        // await doc(db, "savedVideos", video.id).update({
        //   titleFramework: generatedFramework,
        // });
      }
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

      <VideoFilters filter={filter} setFilter={setFilter} />

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : visibleVideos.length === 0 ? (
        <p>No videos found for the selected filter.</p>
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
