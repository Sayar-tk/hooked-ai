import React, { useState } from "react";
import {
  generateTitleFrameworks,
  generateTitlesFromFramework,
} from "../../services/openaiService";

import "../../styles/TitleGeneratorModal.css";

const TitleGeneratorModal = ({
  video,
  framework,
  frameworkLoading,
  onClose,
}) => {
  const [titleVariations, setTitleVariations] = useState([]);
  const [selectedFramework, setSelectedFramework] = useState("");
  const [videoIdea, setVideoIdea] = useState("");
  const [generatedTitles, setGeneratedTitles] = useState([]);
  const [loadingTitles, setLoadingTitles] = useState(false);

  // Generate 4 title variations when framework is provided
  const handleGenerateVariations = async () => {
    try {
      const variations = await generateTitleFrameworks(video.title);
      setTitleVariations(variations);
    } catch (error) {
      console.error("Error generating variations:", error);
    }
  };

  // Generate titles from user input based on the selected framework
  const handleGenerateTitles = async () => {
    if (!selectedFramework || !videoIdea.trim()) {
      alert("Please select a framework and enter a video idea.");
      return;
    }

    setLoadingTitles(true);
    setGeneratedTitles([]);
    try {
      const titles = await generateTitlesFromFramework(
        selectedFramework,
        videoIdea
      );
      setGeneratedTitles(titles);
    } catch (error) {
      console.error("Error generating titles:", error);
    } finally {
      setLoadingTitles(false);
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
            <p className="modal-framework">Main Framework: {framework}</p>
            <button onClick={handleGenerateVariations} className="modal-button">
              Generate 4 Variations
            </button>
            <ul className="framework-variations">
              {titleVariations.map((item, index) => (
                <li key={index} className="variation-item">
                  <strong>{item.niche}: </strong> {item.title} <br />
                </li>
              ))}
            </ul>
            {selectedFramework && (
              <div className="user-input-section">
                <p>Selected Framework: {selectedFramework}</p>
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
            )}
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