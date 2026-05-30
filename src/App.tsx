import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PermissionProvider } from './contexts/PermissionContext';
import { VideoProvider } from './contexts/VideoContext';
import { SubtitleProvider } from './contexts/SubtitleContext';
import GetStarted from './pages/GetStarted';
import MainPage from './pages/MainPage';
import Dashboard from './pages/Dashboard';
import VideoEditing from './pages/VideoEditing';
import SubtitlesEditing from './pages/SubtitlesEditing';
import CreateVideo from './pages/CreateVideo';
import About from './pages/About';

function App() {
  return (
    <PermissionProvider>
      <VideoProvider>
        <SubtitleProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
              <Routes>
                <Route path="/" element={<GetStarted />} />
                <Route path="/main" element={<MainPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/video-editing" element={<VideoEditing />} />
                <Route path="/subtitles-editing" element={<SubtitlesEditing />} />
                <Route path="/create-video" element={<CreateVideo />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </div>
          </Router>
        </SubtitleProvider>
      </VideoProvider>
    </PermissionProvider>
  );
}

export default App;