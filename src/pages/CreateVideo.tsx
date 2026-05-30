import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiVideo, FiDownload, FiSettings, FiPlay, FiCheck, 
  FiFilm, FiFile, FiImage, FiCpu, FiHardDrive, FiAlertCircle
} from 'react-icons/fi';
import { HamburgerMenu } from '../components/Common/HamburgerMenu';
import { SideMenu } from '../components/Common/SideMenu';
import { Button } from '../components/Common/Button';
import { DialogBox } from '../components/Common/DialogBox';
import { useVideo } from '../contexts/VideoContext';
import { useSubtitles } from '../contexts/SubtitleContext';
import { videoProcessor } from '../services/video/processor';

// Render tools
const renderTools = [
  { id: 'quality', icon: <FiSettings />, label: 'Quality', color: 'from-blue-500 to-blue-600' },
  { id: 'format', icon: <FiFilm />, label: 'Format', color: 'from-green-500 to-green-600' },
  { id: 'preview', icon: <FiPlay />, label: 'Preview', color: 'from-purple-500 to-purple-600' },
  { id: 'watermark', icon: <FiImage />, label: 'Brand', color: 'from-orange-500 to-orange-600' },
];

const qualities = [
  { id: '240', label: '240p', desc: 'Mobile', size: '~50MB' },
  { id: '480', label: '480p', desc: 'SD', size: '~150MB' },
  { id: '720', label: '720p', desc: 'HD', size: '~300MB' },
  { id: '1080', label: '1080p', desc: 'FHD', size: '~600MB' },
  { id: '4k', label: '4K', desc: 'Ultra', size: '~2GB' },
];

const formats = [
  { id: 'mp4', label: 'MP4', desc: 'Best compatibility', icon: '🎬' },
  { id: 'webm', label: 'WebM', desc: 'Web optimized', icon: '🌐' },
  { id: 'mov', label: 'MOV', desc: 'Pro quality', icon: '🎥' },
  { id: 'avi', label: 'AVI', desc: 'Legacy format', icon: '📼' },
];

const fpsOptions = [
  { id: '24', label: '24 fps', desc: 'Film' },
  { id: '30', label: '30 fps', desc: 'Standard' },
  { id: '60', label: '60 fps', desc: 'Smooth' },
];

const codecOptions = [
  { id: 'h264', label: 'H.264', desc: 'Best compatibility' },
  { id: 'h265', label: 'H.265/HEVC', desc: 'Better compression' },
  { id: 'vp9', label: 'VP9', desc: 'Web optimized' },
];

const CreateVideo: React.FC = () => {
  const { currentVideo } = useVideo();
  const { subtitles, subtitleStyle } = useSubtitles();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState('1080');
  const [selectedFormat, setSelectedFormat] = useState('mp4');
  const [selectedFps, setSelectedFps] = useState('30');
  const [selectedCodec, setSelectedCodec] = useState('h264');
  const [isRendering, setIsRendering] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  
  const handleToolClick = (_toolId: string) => {
    // Tool selection handled by state-based UI
  };

  // Convert subtitles to SRT format
  const generateSRTContent = (): string => {
    let srt = '';
    subtitles.forEach((cue, index) => {
      const startTime = formatSRTTime(cue.startTime);
      const endTime = formatSRTTime(cue.endTime);
      srt += `${index + 1}\n${startTime} --> ${endTime}\n${cue.text}\n\n`;
    });
    return srt;
  };

  const formatSRTTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')},${ms.toString().padStart(3, '0')}`;
  };

  const handleRender = async () => {
    if (!currentVideo) {
      setRenderError('No video to render');
      return;
    }

    setIsRendering(true);
    setRenderProgress(0);
    setRenderError(null);
    setOutputUrl(null);

    try {
      // Step 1: Load FFmpeg
      setRenderProgress(5);
      await videoProcessor.load();
      setRenderProgress(15);

      // Step 2: If we have subtitles, add them to the video
      if (subtitles.length > 0) {
        const srtContent = generateSRTContent();
        
        // Get video blob from URL
        const response = await fetch(currentVideo.url);
        const videoBlob = await response.blob();
        
        setRenderProgress(30);
        
        // Add subtitles using FFmpeg
        const result = await videoProcessor.addSubtitles(videoBlob, srtContent, 'srt');
        
        if (result.success && result.outputUrl) {
          setOutputUrl(result.outputUrl);
          setRenderProgress(100);
        } else {
          throw new Error(result.error || 'Failed to add subtitles');
        }
      } else {
        // No subtitles - just use the original video
        setOutputUrl(currentVideo.url);
        setRenderProgress(100);
      }

      setShowSuccess(true);
    } catch (err) {
      console.error('Render error:', err);
      setRenderError(err instanceof Error ? err.message : 'Failed to render video');
    }

    setIsRendering(false);
  };

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return h > 0 
      ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
      : `${m}:${s.toString().padStart(2, '0')}`;
  };

  const estimatedSize = () => {
    const baseSizes: Record<string, number> = {
      '240': 50, '480': 150, '720': 300, '1080': 600, '4k': 2000
    };
    const duration = currentVideo?.duration || 60;
    const base = baseSizes[selectedQuality] || 300;
    return (base * (duration / 60)).toFixed(0);
  };

  return (
    <div className="min-h-screen">
      <HamburgerMenu onClick={() => setIsMenuOpen(true)} isOpen={isMenuOpen} />
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div className="pt-20 px-4 pb-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Render Video</h1>
              <p className="text-white/60 text-sm">
                {currentVideo ? `${currentVideo.name} • ${formatDuration(currentVideo.duration)}` : 'Configure output settings'}
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => window.history.back()} variant="secondary" size="sm">
                ← Back
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Render Tools Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card p-3 mb-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2">
              <FiCpu className="text-accent-500 text-xs" />
              Render Tools
            </h3>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {renderTools.map((tool) => (
              <motion.button
                key={tool.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleToolClick(tool.id)}
                className={`p-2 rounded-lg bg-gradient-to-r ${tool.color} text-white text-center transition-all shadow-md hover:shadow-lg`}
              >
                <div className="text-lg mb-1">{tool.icon}</div>
                <div className="text-xs font-medium">{tool.label}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-4">
            {/* Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card p-3"
            >
              <h3 className="font-semibold text-white text-sm mb-3 flex items-center gap-2">
                <FiPlay className="text-accent-500 text-xs" />
                Preview
                <span className="text-xs text-white/50 ml-auto">{selectedQuality}p • {selectedFormat.toUpperCase()}</span>
              </h3>
              
              <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
                {currentVideo ? (
                  <>
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900/50 to-black/50">
                      <p className="text-white/30">Video Preview</p>
                    </div>
                    {/* Subtitle Preview */}
                    {subtitles.length > 0 && (
                      <div 
                        className="absolute bottom-8 left-4 right-4 text-center"
                        style={{ 
                          fontFamily: subtitleStyle.fontFamily,
                          fontSize: `${subtitleStyle.fontSize}px`,
                          color: subtitleStyle.color,
                        }}
                      >
                        <span 
                          className="px-4 py-2 rounded-lg inline-block"
                          style={{ backgroundColor: subtitleStyle.backgroundColor }}
                        >
                          {subtitles[0]?.text || 'Sample subtitle'}
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <FiVideo className="text-4xl text-white/30 mx-auto mb-3" />
                      <p className="text-white/50 text-sm">Upload video to preview</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Output Settings */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="card p-3"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                  <FiHardDrive className="text-accent-500 text-xs" />
                  Output Settings
                </h3>
              </div>

              <div className="space-y-4">
                {/* Quality */}
                <div>
                  <label className="text-xs text-white/50 mb-2 block">Quality & Resolution</label>
                  <div className="grid grid-cols-5 gap-2">
                    {qualities.map((q) => (
                      <button
                        key={q.id}
                        onClick={() => setSelectedQuality(q.id)}
                        className={`p-2 rounded-lg border text-center transition-all ${
                          selectedQuality === q.id
                            ? 'bg-accent-500/20 border-accent-500'
                            : 'border-white/10 hover:border-white/30'
                        }`}
                      >
                        <div className="text-white font-bold text-sm">{q.label}</div>
                        <div className="text-xs text-white/50">{q.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Format & Codec */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-white/50 mb-2 block">Format</label>
                    <div className="grid grid-cols-4 gap-2">
                      {formats.map((f) => (
                        <button
                          key={f.id}
                          onClick={() => setSelectedFormat(f.id)}
                          className={`p-2 rounded-lg border text-center transition-all ${
                            selectedFormat === f.id
                              ? 'bg-green-500/20 border-green-500'
                              : 'border-white/10 hover:border-white/30'
                          }`}
                        >
                          <div className="text-lg">{f.icon}</div>
                          <div className="text-white text-xs font-medium">{f.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-2 block">Frame Rate</label>
                    <div className="grid grid-cols-3 gap-2">
                      {fpsOptions.map((fps) => (
                        <button
                          key={fps.id}
                          onClick={() => setSelectedFps(fps.id)}
                          className={`p-2 rounded-lg border text-center transition-all ${
                            selectedFps === fps.id
                              ? 'bg-purple-500/20 border-purple-500'
                              : 'border-white/10 hover:border-white/30'
                          }`}
                        >
                          <div className="text-white text-sm font-medium">{fps.label}</div>
                          <div className="text-xs text-white/50">{fps.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Codec */}
                <div>
                  <label className="text-xs text-white/50 mb-2 block">Video Codec</label>
                  <div className="grid grid-cols-3 gap-2">
                    {codecOptions.map((codec) => (
                      <button
                        key={codec.id}
                        onClick={() => setSelectedCodec(codec.id)}
                        className={`p-2 rounded-lg border text-center transition-all ${
                          selectedCodec === codec.id
                            ? 'bg-blue-500/20 border-blue-500'
                            : 'border-white/10 hover:border-white/30'
                        }`}
                      >
                        <div className="text-white text-sm font-medium">{codec.label}</div>
                        <div className="text-xs text-white/50">{codec.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Progress Section */}
            {(isRendering || renderError) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="card p-6"
              >
                {isRendering ? (
                  <>
                    <div className="text-center mb-4">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="w-16 h-16 rounded-full border-4 border-accent-500 border-t-transparent mx-auto mb-3"
                      />
                      <p className="text-white font-medium">Rendering Video...</p>
                      <p className="text-5xl font-bold text-accent-500 mt-2">{renderProgress}%</p>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-accent-500 to-red-500 rounded-full"
                        style={{ width: `${renderProgress}%` }}
                      />
                    </div>
                    <p className="text-white/50 text-sm text-center mt-4">
                      Please wait while processing your video...
                    </p>
                  </>
                ) : renderError ? (
                  <div className="text-center">
                    <FiAlertCircle className="text-5xl text-red-400 mx-auto mb-4" />
                    <p className="text-white font-medium mb-2">Render Failed</p>
                    <p className="text-white/60 text-sm mb-4">{renderError}</p>
                    <button
                      onClick={() => setRenderError(null)}
                      className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white"
                    >
                      Try Again
                    </button>
                  </div>
                ) : null}
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-4">
            {/* Info Panel */}
            <div className="card p-3">
              <h3 className="font-semibold text-white text-sm mb-3">Project Info</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                  <FiFilm className="text-blue-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm truncate">{currentVideo?.name || 'No video'}</p>
                    <p className="text-xs text-white/50">
                      {currentVideo ? formatDuration(currentVideo.duration) : '--:--'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                  <FiFile className="text-green-400" />
                  <div className="flex-1">
                    <p className="text-white text-sm">{subtitles.length} subtitles</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                  <FiHardDrive className="text-orange-400" />
                  <div className="flex-1">
                    <p className="text-white text-sm">~{estimatedSize()} MB</p>
                    <p className="text-xs text-white/50">Estimated size</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card p-3">
              <h3 className="font-semibold text-white text-sm mb-3">Output Config</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/50">Resolution</span>
                  <span className="text-white">{selectedQuality}p</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Format</span>
                  <span className="text-white">{selectedFormat.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">FPS</span>
                  <span className="text-white">{selectedFps}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Codec</span>
                  <span className="text-white">{selectedCodec.toUpperCase()}</span>
                </div>
              </div>
            </div>

            {/* Render Button */}
            {!isRendering && (
              <button
                onClick={handleRender}
                disabled={!currentVideo}
                className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-lg disabled:opacity-50"
              >
                <FiDownload /> Render Video
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      <DialogBox
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Success!"
        size="sm"
      >
        <div className="text-center py-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 rounded-full bg-green-500 mx-auto mb-4 flex items-center justify-center"
          >
            <FiCheck className="text-3xl text-white" />
          </motion.div>
          <p className="text-white/80 mb-2">Video rendered successfully!</p>
          <p className="text-white/50 text-sm mb-6">
            ~{estimatedSize()} MB • {selectedQuality}p {selectedFormat.toUpperCase()}
          </p>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setShowSuccess(false)} className="flex-1">
              Close
            </Button>
            <Button onClick={() => setShowSuccess(false)} className="flex-1" icon={<FiDownload />}>
              Download
            </Button>
          </div>
        </div>
      </DialogBox>
    </div>
  );
};

export default CreateVideo;