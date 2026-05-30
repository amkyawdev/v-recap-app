import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiPlay, FiPause, FiSkipBack, FiSkipForward,
  FiVolume2, FiVolumeX, FiMaximize, FiSettings, FiAlertCircle,
  FiRefreshCw, FiX
} from 'react-icons/fi';

interface VideoPlayerProps {
  src: string;
  onTimeUpdate?: (currentTime: number) => void;
  isConverting?: boolean;
  conversionProgress?: number;
  errorMessage?: string | null;
  onRetry?: () => void;
  onClearError?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  src, 
  onTimeUpdate,
  isConverting = false,
  conversionProgress = 0,
  errorMessage = null,
  onRetry,
  onClearError
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [videoError, setVideoError] = useState<string>('');

  // Log when src changes
  useEffect(() => {
    console.log('VideoPlayer: src changed to:', src ? 'blob URL exists' : 'empty');
    setVideoError('');
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
      console.log('VideoPlayer: Metadata loaded, duration:', videoRef.current.duration);
      setDuration(videoRef.current.duration);
      setVideoError('');
    }
  };

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleEnded = () => setIsPlaying(false);
  
  const handleError = () => {
    if (videoRef.current?.error) {
      const error = videoRef.current.error;
      console.error('VideoPlayer: Error code:', error.code);
      
      let message = '';
      switch (error.code) {
        case 1: message = 'Loading aborted'; break;
        case 2: message = 'Network error'; break;
        case 3: message = 'Video codec not supported - converting...'; break;
        case 4: message = 'Video format not supported by browser'; break;
        default: message = `Unknown error (${error.code})`;
      }
      
      setVideoError(message);
    }
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
    <div 
      className="relative rounded-2xl overflow-hidden bg-black aspect-video group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        preload="auto"
        playsInline
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        onError={handleError}
        className="w-full h-full object-contain bg-gray-900"
      />
      
      {/* Error overlay - only show when NOT converting */}
      {((videoError || errorMessage) && !isConverting) && (
        <div 
          className="absolute inset-0 bg-red-900/90 flex items-center justify-center z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center text-white p-6 max-w-sm mx-4">
            <FiAlertCircle className="text-5xl mb-4 mx-auto text-red-400" />
            <p className="text-lg font-semibold mb-4">
              {videoError || errorMessage || 'Video format not supported'}
            </p>
            <div className="flex flex-col gap-3">
              {onRetry && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Retry button clicked');
                    onRetry();
                  }}
                  className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <FiRefreshCw className="text-xl" />
                  <span>Retry Conversion</span>
                </button>
              )}
              {onClearError && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Dismiss button clicked');
                    onClearError();
                  }}
                  className="px-4 py-2 text-white/60 hover:text-white text-sm flex items-center justify-center gap-1 cursor-pointer"
                >
                  <FiX />
                  <span>Dismiss</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Conversion progress overlay */}
      {isConverting && (
        <div className="absolute inset-0 bg-blue-900/95 flex items-center justify-center z-20">
          <div className="text-center text-white p-6">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="text-white/20"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={226}
                  strokeDashoffset={226 - (226 * conversionProgress) / 100}
                  strokeLinecap="round"
                  className="text-blue-400 transition-all duration-300"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold">{conversionProgress}%</span>
              </div>
            </div>
            <p className="text-lg font-semibold">Converting Video...</p>
            <p className="text-white/60 text-sm mt-1">Optimizing for browser playback</p>
          </div>
        </div>
      )}

      {/* Play/Pause Overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isPlaying || isConverting || videoError || errorMessage ? 0 : 0.8 }}
        className="absolute inset-0 flex items-center justify-center bg-black/30 z-10"
      >
        <button
          onClick={togglePlay}
          className="p-6 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
        >
          <FiPlay size={40} className="text-white ml-1" />
        </button>
      </motion.div>

      {/* Custom Controls Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showControls && !isConverting && !videoError && !errorMessage ? 1 : 0, y: showControls ? 0 : 20 }}
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 z-10"
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