import React, { useState, useRef, useEffect } from 'react';
import { 
  FiPlay, FiPause, FiSkipBack, FiSkipForward,
  FiVolume2, FiVolumeX, FiMaximize, FiSettings
} from 'react-icons/fi';

interface VideoPlayerProps {
  src: string;
  onTimeUpdate?: (currentTime: number) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, onTimeUpdate }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // Clear states when src changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [src]);

  // Handle video events
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      onTimeUpdate?.(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleEnded = () => setIsPlaying(false);
  
  const handleError = () => {
    console.error('Video error');
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative rounded-2xl overflow-hidden bg-black">
      {/* Video element - simple and direct */}
      <video
        ref={videoRef}
        src={src}
        preload="auto"
        className="w-full h-auto block"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        onError={handleError}
      />

      {/* Play/Pause Overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer" onClick={togglePlay}>
          <div className="p-8 rounded-full bg-white/30 backdrop-blur-sm">
            <FiPlay size={48} className="text-white" />
          </div>
        </div>
      )}

      {/* Controls Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
        <div className="flex items-center gap-3">
          <button onClick={togglePlay} className="p-2 hover:bg-white/20 rounded-lg">
            {isPlaying ? <FiPause className="text-white" /> : <FiPlay className="text-white" />}
          </button>
          <button onClick={() => handleSeek(Math.max(0, currentTime - 10))} className="p-2 hover:bg-white/20 rounded-lg">
            <FiSkipBack className="text-white" />
          </button>
          <button onClick={() => handleSeek(Math.min(duration, currentTime + 10))} className="p-2 hover:bg-white/20 rounded-lg">
            <FiSkipForward className="text-white" />
          </button>
          <button onClick={toggleMute} className="p-2 hover:bg-white/20 rounded-lg">
            {isMuted ? <FiVolumeX className="text-white" /> : <FiVolume2 className="text-white" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setVolume(val);
              if (videoRef.current) videoRef.current.volume = val;
            }}
            className="w-20"
          />
          <span className="text-white text-sm">{formatTime(currentTime)} / {formatTime(duration)}</span>
          <div className="ml-auto flex gap-2">
            <button className="p-2 hover:bg-white/20 rounded-lg"><FiSettings className="text-white" /></button>
            <button className="p-2 hover:bg-white/20 rounded-lg"><FiMaximize className="text-white" /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;