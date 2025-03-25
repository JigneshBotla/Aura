import React from 'react';
import EmotionDetector from './components/Emotion/EmotionDetector';
import './App.css';

function App() {
  return (
    <div className="App" style={{ backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', padding: '20px', color: '#333' }}>
        Emotion-Based Music Player
      </h1>
      <EmotionDetector />
    </div>
  );
}

export default App;