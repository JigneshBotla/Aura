import { useState, useEffect, useRef } from 'react';
import './App.css';
import './index.css';
import shuffle from "../../assets/shuffle.svg";
import playback from "../../assets/play_back.svg";
import skipforward from "../../assets/skip_forward.svg";
import pause from "../../assets/pause.svg";
import play from "../../assets/play.svg";
import volume from "../../assets/volume.svg";
import silent from "../../assets/silent.svg"; // Added import for silent.svg

// Define Song type for the playlist
type Song = {
  title: string;
  artist: string;
  duration: number; // Duration in seconds
};

// Sample playlist
const playlist: Song[] = [
  { title: "Levitating", artist: "Dua Lipa", duration: 200 },
  { title: "Blinding Lights", artist: "The Weeknd", duration: 200 },
  { title: "Song 3", artist: "Artist 3", duration: 180 },
];

function App() {
  // State declarations
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showLyrics, setShowLyrics] = useState(false);
  const [volumeLevel, setVolume] = useState(1); // 0 to 1
  const [isLiked, setIsLiked] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [showVolume, setShowVolume] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentSong = playlist[currentSongIndex];

  // Simulate song playback
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTime((prevTime) => {
          if (prevTime >= currentSong.duration) {
            setCurrentSongIndex((prevIndex) => (prevIndex + 1) % playlist.length);
            return 0;
          }
          return prevTime + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentSongIndex]);

  // Helper function to format time as MM:SS
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Control functions
  const previousSong = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex - 1 + playlist.length) % playlist.length);
    setCurrentTime(0);
  };

  const nextSong = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % playlist.length);
    setCurrentTime(0);
  };

  const toggleVolume = () => {
    if (showVolume) {
      setShowVolume(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    } else {
      setShowVolume(true);
      timeoutRef.current = setTimeout(() => {
        setShowVolume(false);
      }, 4000); // Auto-close after 4 seconds
    }
  };

  // Handle dragging the progress bar
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseInt(e.target.value, 10);
    setCurrentTime(newTime);
  };

  // Shuffle function
  const shuffleSong = () => {
    const newIndex = Math.floor(Math.random() * playlist.length);
    setCurrentSongIndex(newIndex);
    setCurrentTime(0);
    setIsPlaying(true); // Optionally start playing the new song
  };

  const lyrics = `If you wanna run away with me, I know a galaxy...`; // Your lyrics here

  return (
    <div
      className="App"
      style={{
        backgroundColor: '#000',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
        fontFamily: "'Fira Code', sans-serif",
      }}
    >
      <div className="player-wrapper">
        <div className={`player-container ${showLyrics ? 'lyrics-active' : ''}`}>
          <div className="controls-wrapper">
            <img src="/Levitating.png" alt="Album Art" className="album-art" />
            <h1 style={{ fontSize: '24px' }}>{currentSong.title}</h1>
            <h1 style={{ fontSize: '15px' }}>{currentSong.artist}</h1>
            <div className="lyrics-like-container">
              <button
                className="control-btn"
                onClick={() => setShowLyrics(!showLyrics)}
              >
                <svg
                  width="24"
                  height="11"
                  viewBox="0 0 24 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="fadeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{ stopColor: 'white', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: 'white', stopOpacity: 0 }} />
                    </linearGradient>
                  </defs>
                  <rect y="0" width="24" height="3" rx="1.5" fill="url(#fadeGradient)" />
                  <rect y="6" width="24" height="3" rx="1.5" fill="url(#fadeGradient)" />
                  <rect y="12" width="24" height="3" rx="1.5" fill="url(#fadeGradient)" />
                </svg>
                Lyrics
              </button>

              <button className="control-btn" onClick={() => setIsLiked(!isLiked)}>
                {isLiked ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="white"
                    stroke="white"
                    strokeWidth="2"
                  >
                    <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                  >
                    <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3z" />
                  </svg>
                )}
              </button>
            </div>
            <div className="time-bar-container">
              <span className="elapsed-time">{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={currentSong.duration}
                value={currentTime}
                onChange={handleProgressChange}
                className="progress-bar"
              />
              <span className="remaining-time">
                -{formatTime(currentSong.duration - currentTime)}
              </span>
            </div>
            <div className="controls">
              <button className="control-btn" onClick={shuffleSong}>
                <img src={shuffle} alt="Shuffle" width="22" height="22" />
              </button>
              <button className="control-btn" onClick={previousSong}>
                <img src={playback} alt="Playback" width="22" height="22" />
              </button>
              <button className="control-btn" onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? (
                  <img src={play} alt="Play" width="22" height="22" />
                ) : (
                  <img src={pause} alt="Pause" width="22" height="22" />
                )}
              </button>
              <button className="control-btn" onClick={nextSong}>
                <img src={skipforward} alt="Skip Forward" width="22" height="22" />
              </button>
              <div className="volume-container">
                <button className="control-btn" onClick={toggleVolume}>
                  <img
                    src={volumeLevel === 0 ? silent : volume} // Toggle between silent and volume icons
                    alt={volumeLevel === 0 ? "Mute" : "Volume"}
                    width="24"
                    height="24"
                    onError={() => console.log("Volume/Silent icon failed to load. Check path or file: ../../assets/")}
                  />
                </button>
                <div className={`volume-slider-wrapper ${showVolume ? 'visible' : ''}`}>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volumeLevel}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="volume-slider vertical"
                    orient="vertical"
                  />
                </div>
              </div>
            </div>
          </div>
          {showLyrics && (
            <div className="lyrics-container">
              <pre>{lyrics}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;