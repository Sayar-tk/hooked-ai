import React, { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { generateTitleFramework } from "../services/openaiService";
import "../styles/YouTubeCard.css";

function YouTubeCard({ video }) {
  const [userRole, setUserRole] = useState(null);
  const [showModal, setShowModal] = useState(false); // State to toggle modal
  const [framework, setFramework] = useState(""); // State to store framework
  const [loadingFramework, setLoadingFramework] = useState(false); // Framework loading state
  const [editedFramework, setEditedFramework] = useState(""); // State for editable framework

  useEffect(() => {
    const fetchUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role || "free"); // Default role is free
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }
    };

    fetchUserRole();
  }, []);

  const openSaveModal = async () => {
    setLoadingFramework(true);
    setShowModal(true);

    try {
      const generatedFramework = await generateTitleFramework(video.title);
      setFramework(generatedFramework);
      setEditedFramework(generatedFramework);
    } catch (error) {
      console.error("Error generating framework:", error);
      setFramework("Error generating framework. Try again later.");
    } finally {
      setLoadingFramework(false);
    }
  };

  const saveVideo = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to save videos.");
      return;
    }

    const videoData = {
      title: video.title || "Untitled Video", // Default to "Untitled Video" if title is missing
      thumbnail: video.thumbnail || "", // Default to empty string if thumbnail is missing
      channelName: video.channelName || "Unknown Channel", // Default value
      timeSinceUpload: video.timeSinceUpload || "Unknown", // Default if not provided
      outlierFactor: video.outlierFactor ? String(video.outlierFactor) : "0", // Ensure string format
      views: video.views ? String(video.views) : "0", // Ensure views are strings
      ...(userRole === "admin" && { titleFramework: editedFramework }), // Only add framework for admin
    };

    try {
      if (userRole === "free" || userRole === "paid") {
        const userDocRef = doc(db, "users", user.uid);
        const savedVideosRef = collection(userDocRef, "savedVideos"); // Subcollection for saved videos

        await addDoc(savedVideosRef, videoData);
        alert(`Video "${video.title}" saved successfully!`);
      } else if (userRole === "admin") {
        await addDoc(collection(db, "savedVideos"), videoData);
        alert(`Video "${video.title}" with framework saved successfully!`);
        setShowModal(false); // Close the modal
      }
    } catch (error) {
      console.error("Error saving video:", error);
      alert("Failed to save video.");
    }
  };

  return (
    <div className="video-info">
      <img
        src={video.thumbnail}
        alt={video.title}
        className="video-thumbnail"
      />
      <div className="video-details">
        <h3 className="video-title">{video.title}</h3>
        <p className="channel-name">{video.channelName}</p>
        <div className="video-stats">
          <p className="video-views">{video.views} views</p>
          <p className="video-time" style={{ marginLeft: "10px" }}>
            {video.timeSinceUpload}
          </p>
        </div>
        <p className="outlier-message">
          <span>{video.outlierFactor}x</span> views over subscribers
        </p>
      </div>
      <div className="button-container">
        {userRole === "admin" ? (
          <button
            onClick={openSaveModal}
            className="button"
            style={{ width: "auto", padding: "5px 10px" }}
          >
            Save Video
          </button>
        ) : (
          <button
            onClick={saveVideo}
            className="button"
            style={{ width: "auto", padding: "5px 10px" }}
          >
            Save Video
          </button>
        )}
      </div>

      {/* Modal for Admin Framework Input */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // Prevent closing on click inside modal
          >
            <h3>Title Framework</h3>
            {loadingFramework ? (
              <p>Loading framework...</p>
            ) : (
              <textarea
                value={editedFramework}
                onChange={(e) => setEditedFramework(e.target.value)}
                rows="4"
                style={{ width: "100%", marginBottom: "15px" }}
              ></textarea>
            )}
            <button onClick={saveVideo} className="modal-button">
              Save Video
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="modal-close-button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default YouTubeCard;
