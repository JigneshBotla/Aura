import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App" style={{ backgroundColor: '#000', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#fff', fontFamily: "'Fira Code', sans-serif" }}>
      <div className="welcome-text">
        <h2 style={{ fontSize: '1.5em', margin: '0' }}>Welcome to</h2>
        <h1 style={{ fontSize: '6em', fontWeight: 'bold', margin: '0' }}>AURA</h1>
        <p style={{ fontSize: '1.3em', margin: '0' }}>Levitate the aura within you.</p>
      </div>
      <button
        className="welcome-button"
        onClick={() => alert('Connecting to Spotify...')} 
      >
        Connect with Spotify
      </button>
      <div className="card" style={{ marginTop: '2em' }}>
      </div>
    </div>
  )
}

export default App