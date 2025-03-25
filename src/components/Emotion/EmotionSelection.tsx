import React, { useState } from 'react';
import axios from 'axios';
import './EmotionSelection.css';
// import Aurora from "../../components/ui/Aurora/Aurora"

const emotions = [
  { name: 'Happy', emoji: '😊', color: '#FFD700' },
  { name: 'Sad', emoji: '😢', color: '#1E90FF' },
  { name: 'Angry', emoji: '😠', color: '#FF4500' },
  { name: 'Surprise', emoji: '😲', color: '#FFA500' },
  { name: 'Excited', emoji: '🤩', color: '#FF69B4' },
  { name: 'Calm', emoji: '😌', color: '#32CD32' },
];

const genres = ['Pop', 'Rock', 'Jazz', 'Classical', 'Hip-Hop', 'Electronic'];

const EmotionSelection: React.FC = () => {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]); // Store song recommendations

  const handleGenreClick = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const handleRecommendSongs = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/recommend_songs/', {
        emotion: selectedEmotion,
        genres: selectedGenres,
        // session: "your_session_key_here" // Add if you have session-based auth
      });
      setRecommendations(response.data.songs);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  return (
    <div className="emotion-selection">
      {/* <Aurora /> */}
      <h1>AURA</h1>
      <p>Select your current emotion and preferred genre.</p>
      
      <div className="selections">
        <div className="emotion-section">
          <h3>Emotion</h3>
          <div className="emotion-list">
            {emotions.map(emotion => (
              <div
                key={emotion.name}
                className={`emotion-item ${selectedEmotion === emotion.name ? 'selected' : ''}`}
                style={{ '--emotion-color': emotion.color } as React.CSSProperties}
                onClick={() => setSelectedEmotion(emotion.name)}
              >
                <span className="emoji">{emotion.emoji}</span>
                <span className="name">{emotion.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="genre-section">
          <h3>Genre</h3>
          <div className="genre-list">
            {genres.map(genre => (
              <div
                key={genre}
                className={`genre-item ${selectedGenres.includes(genre) ? 'selected' : ''}`}
                onClick={() => handleGenreClick(genre)}
              >
                {genre}
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        className="generate-button"
        disabled={!selectedEmotion || selectedGenres.length === 0}
        onClick={handleRecommendSongs}
      >
        Recommend Songs
      </button>

      {recommendations.length > 0 && (
        <div className="recommendations">
          <h3>Recommended Songs</h3>
          <ul>
            {recommendations.map((song, index) => (
              <li key={index}>
                {song.name} by {song.artist} (Album: {song.album})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EmotionSelection;