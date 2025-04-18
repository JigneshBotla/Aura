import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BACKEND_URL } from "../config/env";
import "./Home.css";
import Aurora from "./ui/Aurora/Aurora";

const Home: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchParams] = useSearchParams();
  const sessionKey = searchParams.get("session");

  useEffect(() => {
    if (!sessionKey) {
      setError("Session key is missing. Please log in again.");
      setLoading(false);
      return;
    }
    
    // Log session key for debugging
    console.log("Session key:", sessionKey);
    console.log("Backend URL being used:", BACKEND_URL);
    
    // Validate backend URL
    if (!BACKEND_URL || BACKEND_URL === "") {
      setError("Backend URL is not configured properly.");
      setLoading(false);
      return;
    }
    
    setLoading(false);
  }, [sessionKey]);

  const handleNavigation = async (endpoint: string) => {
    try {
      const url = `${BACKEND_URL}/api/${endpoint}?session=${sessionKey}`;
      console.log("Navigating to:", url);
      
      const response = await fetch(url, {
        credentials: "include",
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          console.error("404 error: Endpoint not found:", url);
          setError(`The requested resource (${endpoint}) was not found. This could indicate an issue with the API endpoint.`);
          return;
        }
        throw new Error(`HTTP error: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.redirect_url) {
        console.log("Redirecting to:", data.redirect_url);
        window.location.href = data.redirect_url;
      } else {
        setError(data.error || "Failed to navigate.");
      }
    } catch (err) {
      console.error("Navigation error:", err);
      setError(`An error occurred while navigating: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error)
    return (
      <div>
        <p>Error: {error}</p>
        <a href={`${BACKEND_URL}/api/spotify/login/`}>
          Log in with Spotify
        </a>
      </div>
    );

  return (
    <div className="home-container">
      <Aurora />
      <nav className="navbar">
        <div className="navbar-left">
          <h1>Aura</h1>
        </div>
        <div className="navbar-right">
          <button onClick={() => handleNavigation("go/profile")}>
            Profile
          </button>
          <button onClick={() => handleNavigation("go/library")}>
            Library
          </button>
          <button onClick={() => handleNavigation("go/about")}>About</button>
          <button onClick={() => handleNavigation("spotify/logout")}>
            Logout
          </button>
        </div>
      </nav>
      <div className="recommendation">
        <p>Wanna get recommendations based on your current emotion?</p>
        <h2>CHOOSE AN OPTION</h2>
        <div className="button-group">
          <button className="capture-button" onClick={() => handleNavigation("go/detect/emotion")}>Capture Face</button>
          <button className="select-button" onClick={() => handleNavigation("go/select/emotion")}>Select Emotion</button>
        </div>
        <p className="note">For better results, try Select Emotion.</p>
      </div>
    </div>
  );
};

export default Home;
