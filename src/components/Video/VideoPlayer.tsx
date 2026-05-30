import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiPlay, FiPause, FiSkipBack, FiSkipForward,
  FiVolume2, FiVolumeX, FiMaximize, FiSettings,
  FiDownload, FiShare2
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
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      onTimeUpdate?.(video.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [onTimeUpdate]);

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
    <div 
      className="relative rounded-2xl overflow-hidden bg-black aspect-video group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-contain"
        onClick={togglePlay}
      />

      {/* Play/Pause Overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isPlaying ? 0 : 0.8 }}
        className="absolute inset-0 flex items-center justify-center bg-black/30"
      >
        <button
          onClick={togglePlay}
          className="p-6 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
        >
          <FiPlay size={40} className="text-white ml-1" />
        </button>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : 20 }}
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4"
      >
        {/* Progress Bar */}
        <div 
          className="w-full h-1 bg-white/30 rounded-full mb-4 cursor-pointer group/progress"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            handleSeek(percent * duration);
          }}
        >
          <div 
            className="h-full bg-accent-500 rounded-full relative"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={togglePlay} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              {isPlaying ? <FiPause className="text-white" /> : <FiPlay className="text-white" />}
            </button>
            
            <button onClick={() => handleSeek(Math.max(0, currentTime - 10))} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <FiSkipBack className="text-white" />
            </button>
            
            <button onClick={() => handleSeek(Math.min(duration, currentTime + 10))} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <FiSkipForward className="text-white" />
            </button>

            <div className="flex items-center gap-2 ml-2">
              <button onClick={toggleMute} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
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
                className="w-20 h-1 bg-white/30 rounded-full appearance-none cursor-pointer"
              />
            </div>

            <span className="text-white text-sm ml-2">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <FiSettings className="text-white" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <FiMaximize className="text-white" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VideoPlayer;