// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './components/playbackControls/App'; // Import from playbackControls
// import './index.css';

// ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// );
//-------------------------------------------------------------------------
// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import EmotionDetector from './components/Emotion/EmotionDetector';
// import './index.css';

// ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
//   <React.StrictMode>
//     <EmotionDetector />
//   </React.StrictMode>
// );


import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Emotion/Home';
import EmotionSelection from './components/Emotion/EmotionSelection'; 
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/emotion-selection" element={<EmotionSelection />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);