import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const EmotionDetector = () => {
  const webcamRef = useRef<Webcam>(null);
  const [emotion, setEmotion] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const emotionCount = useRef<Record<string, number>>({
    happy: 0,
    angry: 0,
    sad: 0,
    surprised: 0,
    neutral: 0,
    fearful: 0,
  });

  const detectEmotion = async () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    try {
      const response = await axios.post('http://localhost:5000/detect_emotion', {
        image: imageSrc,
      });
      const frameEmotions = response.data;

      if ('error' in frameEmotions) {
        console.error('Error from detect_emotion:', frameEmotions.error);
        return;
      }

      Object.keys(frameEmotions).forEach((key) => {
        const mappedKey = key === 'surprise' ? 'surprised' : key === 'fear' ? 'fearful' : key;
        if (mappedKey in emotionCount.current) {
          emotionCount.current[mappedKey] += frameEmotions[key];
        }
      });
      console.log('Cumulative emotion count:', emotionCount.current);
    } catch (error) {
      console.error('Error in detectEmotion:', error);
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
          const response = await axios.post('http://localhost:5000/get_dominant_emotion', {
            emotion_count: emotionCount.current,
          });
          const data = response.data;
          if ('error' in data) {
            throw new Error(data.error);
          }
          const dominantEmotion = data.dominant_emotion;
          setEmotion(dominantEmotion);
        } catch (error) {
          console.error('Error getting dominant emotion:', error);
          setEmotion('Error detecting emotion');
        }
      }, 10000);
    }
    return () => clearInterval(interval);
  }, [isDetecting]);

  const handleDetectEmotion = () => {
    if (!isDetecting) {
      setEmotion(null);
      emotionCount.current = { happy: 0, angry: 0, sad: 0, surprised: 0, neutral: 0, fearful: 0 };
      console.log('Emotion count reset:', emotionCount.current);
      setIsDetecting(true);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <Webcam
        ref={webcamRef}
        audio={false}
        width={640}
        height={480}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode: 'user' }}
        style={{ borderRadius: '10px' }}
      />
      <br />
      <button
        onClick={handleDetectEmotion}
        disabled={isDetecting}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: isDetecting ? '#ccc' : '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: isDetecting ? 'not-allowed' : 'pointer',
        }}
      >
        {isDetecting ? 'Detecting...' : 'Detect Emotion'}
      </button>
      {emotion && (
        <p style={{ marginTop: '20px', fontSize: '18px', fontWeight: 'bold' }}>
          Dominant Emotion: {emotion}
        </p>
      )}
    </div>
  );
};

export default EmotionDetector;