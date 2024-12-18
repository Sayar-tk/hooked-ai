// /src/components/yt-title-generator/TitleGeneratorModal.js
// /src/components/yt-title-generator/TitleGeneratorModal.js
import React, { useState, useEffect } from "react";
import {
  generateTitleFrameworks,
  generateTitlesFromFramework,
} from "../../services/openaiService";
import { auth, db } from "../../firebaseConfig";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import "../../styles/TitleGeneratorModal.css";

const TitleGeneratorModal = ({
  video,
  framework,
  frameworkLoading,
  onClose,
}) => {
  const [userRole, setUserRole] = useState(null);
  const [titleVariations, setTitleVariations] = useState([]);
  const [variationsLoading, setVariationsLoading] = useState(false);
  const [videoIdea, setVideoIdea] = useState("");
  const [generatedTitles, setGeneratedTitles] = useState([]);
  const [loadingTitles, setLoadingTitles] = useState(false);
  const [editableFramework, setEditableFramework] = useState(framework);

  // Initialize editableFramework when the framework prop changes
  useEffect(() => {
    setEditableFramework(framework);
  }, [framework]);

  // Fetch user role on component mount
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

  // Generate 4 title variations when framework is provided
  const handleGenerateVariations = async () => {
    setVariationsLoading(true);
    try {
      const variations = await generateTitleFrameworks(video.title);
      setTitleVariations(variations);
    } catch (error) {
      console.error("Error generating variations:", error);
    } finally {
      setVariationsLoading(false);
    }
  };

  // Generate titles from user input based on the selected framework
  const handleGenerateTitles = async () => {
    if (!videoIdea.trim()) {
      alert("Please select a framework and enter a video idea.");
      return;
    }

    setLoadingTitles(true);
    setGeneratedTitles([]);
    try {
      const titles = await generateTitlesFromFramework(framework, videoIdea);
      setGeneratedTitles(titles);
    } catch (error) {
      console.error("Error generating titles:", error);
    } finally {
      setLoadingTitles(false);
      setVideoIdea("");
    }
  };

  // Save the edited framework to the database
  const handleSaveFramework = async () => {
    try {
      const videoDocRef = doc(db, "savedVideos", video.id);
      await updateDoc(videoDocRef, { titleFramework: editableFramework });
      alert("Framework saved successfully!");
    } catch (error) {
      console.error("Error saving framework:", error);
      alert("Failed to save framework. Please try again.");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-video-title">{video.title}</h3>
        {frameworkLoading ? (
          <p>Loading title framework...</p>
        ) : (
          <div>
            {userRole === "admin" ? (
              <div>
                <textarea
                  className="editable-framework"
                  value={editableFramework}
                  rows={2}
                  onChange={(e) => setEditableFramework(e.target.value)}
                />
                <button onClick={handleSaveFramework} className="modal-button">
                  Save Framework
                </button>
              </div>
            ) : (
              <p className="modal-framework">{framework}</p>
            )}

            <button onClick={handleGenerateVariations} className="modal-button">
              {variationsLoading ? "Generating..." : "Generate 4 Variations"}
            </button>
            <ul className="framework-variations">
              {titleVariations.map((item, index) => (
                <li key={index} className="variation-item">
                  <strong>{item.niche}: </strong> {item.title} <br />
                </li>
              ))}
            </ul>

            <div className="user-input-section">
              <p>Describe your video idea to generate variations</p>
              <input
                type="text"
                placeholder="Describe your video idea..."
                value={videoIdea}
                onChange={(e) => setVideoIdea(e.target.value)}
                className="video-idea-input"
              />
              <button onClick={handleGenerateTitles} className="modal-button">
                Generate Titles
              </button>
            </div>

            {loadingTitles ? (
              <p>Generating titles...</p>
            ) : (
              <ul className="generated-titles">
                {generatedTitles.map((title, index) => (
                  <li key={index}>{title}</li>
                ))}
              </ul>
            )}
          </div>
        )}
        <button className="modal-close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default TitleGeneratorModal;
