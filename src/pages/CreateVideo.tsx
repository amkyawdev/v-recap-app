import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiVideo, FiDownload, FiSettings, FiPlay, FiCheck } from 'react-icons/fi';
import { HamburgerMenu } from '../components/Common/HamburgerMenu';
import { SideMenu } from '../components/Common/SideMenu';
import { Button } from '../components/Common/Button';
import { DialogBox } from '../components/Common/DialogBox';
import { useVideo } from '../contexts/VideoContext';
import { useSubtitles } from '../contexts/SubtitleContext';

const qualities = [
  { id: 'low', label: '480p', desc: 'Small file size' },
  { id: 'medium', label: '720p', desc: 'Balanced' },
  { id: 'high', label: '1080p', desc: 'Best quality' },
  { id: '4k', label: '4K', desc: 'Ultra HD' },
];

const formats = [
  { id: 'mp4', label: 'MP4', icon: '🎬' },
  { id: 'webm', label: 'WebM', icon: '🌐' },
  { id: 'mov', label: 'MOV', icon: '🎥' },
];

const CreateVideo: React.FC = () => {
  const { currentVideo } = useVideo();
  const { subtitles, style } = useSubtitles();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState('high');
  const [selectedFormat, setSelectedFormat] = useState('mp4');
  const [isRendering, setIsRendering] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);

  const handleRender = async () => {
    setIsRendering(true);
    setRenderProgress(0);

    // Simulate rendering progress
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setRenderProgress(i);
    }

    setIsRendering(false);
    setShowSuccess(true);
  };

  return (
    <div className="min-h-screen">
      <HamburgerMenu onClick={() => setIsMenuOpen(true)} isOpen={isMenuOpen} />
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div className="pt-20 px-4 pb-8 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Create Video</h1>
          <p className="text-white/60">Export and render your video with subtitles</p>
        </motion.div>

        {/* Preview Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card p-6 mb-6"
        >
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <FiPlay className="text-accent-500" />
            Final Preview
          </h3>
          
          {currentVideo ? (
            <div className="aspect-video bg-black rounded-xl overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-white/30">Video with subtitles overlay</p>
              </div>
              <div className="absolute bottom-8 left-0 right-0 text-center">
                <span 
                  className="px-6 py-3 rounded-lg text-white inline-block"
                  style={{
                    backgroundColor: style.backgroundColor,
                    fontFamily: style.fontFamily,
                    fontSize: style.fontSize,
                  }}
                >
                  {subtitles[0]?.text || 'Sample subtitle text'}
                </span>
              </div>
            </div>
          ) : (
            <div className="aspect-video bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <FiVideo className="text-5xl text-white/30 mx-auto mb-4" />
                <p className="text-white/50">No video selected</p>
              </div>
            </div>
          )}

          <div className="mt-4 p-4 bg-white/5 rounded-xl">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-white/50 text-sm">Video</p>
                <p className="text-white font-medium">{currentVideo?.name || 'Not selected'}</p>
              </div>
              <div>
                <p className="text-white/50 text-sm">Subtitles</p>
                <p className="text-white font-medium">{subtitles.length} items</p>
              </div>
              <div>
                <p className="text-white/50 text-sm">Duration</p>
                <p className="text-white font-medium">{currentVideo ? '3:45' : '--:--'}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quality Settings */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="card p-6 mb-6"
        >
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <FiSettings className="text-accent-500" />
            Output Settings
          </h3>

          {/* Quality Selection */}
          <div className="mb-6">
            <label className="text-sm text-white/70 mb-3 block">Quality</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {qualities.map((q) => (
                <button
                  key={q.id}
                  onClick={() => setSelectedQuality(q.id)}
                  className={`p-4 rounded-xl border transition-all ${
                    selectedQuality === q.id
                      ? 'bg-accent-500/20 border-accent-500'
                      : 'bg-white/5 border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="text-xl font-bold text-white">{q.label}</div>
                  <div className="text-xs text-white/50 mt-1">{q.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Format Selection */}
          <div>
            <label className="text-sm text-white/70 mb-3 block">Format</label>
            <div className="flex gap-3">
              {formats.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFormat(f.id)}
                  className={`flex-1 p-4 rounded-xl border transition-all ${
                    selectedFormat === f.id
                      ? 'bg-accent-500/20 border-accent-500'
                      : 'bg-white/5 border-white/10 hover:border-white/30'
                  }`}
                >
                  <span className="text-2xl">{f.icon}</span>
                  <div className="font-medium text-white mt-2">{f.label}</div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Render Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {isRendering ? (
            <div className="card p-8">
              <div className="text-center mb-4">
                <p className="text-white font-medium">Rendering video...</p>
                <p className="text-4xl font-bold text-accent-500 mt-2">{renderProgress}%</p>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-accent-500 rounded-full"
                  style={{ width: `${renderProgress}%` }}
                />
              </div>
              <p className="text-white/50 text-sm text-center mt-4">
                Please wait while we process your video...
              </p>
            </div>
          ) : (
            <Button
              onClick={handleRender}
              disabled={!currentVideo}
              className="w-full py-4 text-lg"
              icon={<FiDownload />}
            >
              Render & Export Video
            </Button>
          )}
        </motion.div>

        {/* Success Dialog */}
        <DialogBox
          isOpen={showSuccess}
          onClose={() => setShowSuccess(false)}
          title="Video Created!"
        >
          <div className="text-center py-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 rounded-full bg-green-500 mx-auto mb-4 flex items-center justify-center"
            >
              <FiCheck className="text-4xl text-white" />
            </motion.div>
            <p className="text-white/80 mb-6">
              Your video has been successfully rendered and is ready for download!
            </p>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowSuccess(false)}
                className="flex-1"
              >
                Close
              </Button>
              <Button
                onClick={() => setShowSuccess(false)}
                className="flex-1"
                icon={<FiDownload />}
              >
                Download
              </Button>
            </div>
          </div>
        </DialogBox>
      </div>
    </div>
  );
};

export default CreateVideo;