import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom"; 
import Webcam from "react-webcam";
import axios from "axios";
import "./Home.css";
import Aurora from "../../components/ui/Aurora/Aurora"
const Home: React.FC = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedEmotion, setDetectedEmotion] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const emotionCount = useRef<Record<string, number>>({
    happy: 0,
    angry: 0,
    sad: 0,
    surprised: 0,
    neutral: 0,
    fearful: 0,
  });
  const navigate = useNavigate(); 

  const detectEmotion = async () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    try {
      const response = await axios.post("http://localhost:8000/api/detect_emotion/", {
        image: imageSrc,
      });
      const frameEmotions = response.data;

      if ("error" in frameEmotions) {
        console.error("Error from detect_emotion:", frameEmotions.error);
        return;
      }

      Object.keys(frameEmotions).forEach((key) => {
        const mappedKey = key === "surprise" ? "surprised" : key === "fear" ? "fearful" : key;
        if (mappedKey in emotionCount.current) {
          emotionCount.current[mappedKey] += frameEmotions[key];
        }
      });
      console.log("Cumulative emotion count:", emotionCount.current);
    } catch (error) {
      console.error("Error in detectEmotion:", error);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isDetecting) {
      interval = setInterval(detectEmotion, 500);
      setTimeout(async () => {
        clearInterval(interval);
        setIsDetecting(false);

        try {
          const response = await axios.post("http://localhost:8000/api/get_dominant_emotion/", {
            emotion_count: emotionCount.current,
          });
          const data = response.data;
          if ("error" in data) {
            throw new Error(data.error);
          }
          const dominantEmotion = data.dominant_emotion;
          setDetectedEmotion(dominantEmotion);
        } catch (error) {
          console.error("Error getting dominant emotion:", error);
          setDetectedEmotion("Error detecting emotion");
        }
      }, 10000); // 10 seconds
    }
    return () => clearInterval(interval);
  }, [isDetecting]);

  const handleCaptureFace = () => {
    if (!isDetecting) {
      setDetectedEmotion(null);
      emotionCount.current = { happy: 0, angry: 0, sad: 0, surprised: 0, neutral: 0, fearful: 0 };
      setIsDetecting(true);
    }
  };

  const handleSelectEmotion = () => {
    navigate("/emotion-selection"); // Navigate to EmotionSelection
  };

  return (
    <div className="home-container">
      <Aurora />
      <div className="recommendation">
        <p>Wanna get recommendations based on your current emotion?</p>
        <h2>CHOOSE AN OPTION</h2>
        <div className="button-group">
          <button className="capture-button" onClick={handleCaptureFace} disabled={isDetecting}>
            {isDetecting ? "Detecting..." : "Capture Face"}
          </button>
          <button className="select-button" onClick={handleSelectEmotion}>
            Select Emotion
          </button>
        </div>
        <p className="note">For better results, try Select Emotion.</p>
        {isDetecting && (
          <div className="webcam-container">
            <Webcam
              ref={webcamRef}
              audio={false}
              width={320}
              height={240}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: "user" }}
            />
          </div>
        )}
        {detectedEmotion && (
          <p className="emotion-result">Detected Emotion: {detectedEmotion}</p>
        )}
      </div>
    </div>
  );
};

export default Home;