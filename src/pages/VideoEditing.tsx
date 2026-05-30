import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FiVideo, FiUpload, FiPlay, FiClock, FiChevronDown, FiCheck,
  FiScissors, FiZap, FiRotateCw, FiType, FiFilter, FiVolume2,
  FiTrim, FiCrop, FiSun, FiMoon, FiImage, FiMusic, FiDownload, FiFileText, FiCpu
} from 'react-icons/fi';
import { HamburgerMenu } from '../components/Common/HamburgerMenu';
import { SideMenu } from '../components/Common/SideMenu';
import { Button } from '../components/Common/Button';
import { VideoPlayer } from '../components/Video/VideoPlayer';
import { VideoUploader } from '../components/Video/VideoUploader';
import { useVideo } from '../contexts/VideoContext';
import { DialogBox } from '../components/Common/DialogBox';

// Tool definitions
const videoTools = [
  { id: 'trim', icon: <FiScissors />, label: 'Trim', color: 'from-blue-500 to-blue-600' },
  { id: 'speed', icon: <FiZap />, label: 'Speed', color: 'from-green-500 to-green-600' },
  { id: 'rotate', icon: <FiRotateCw />, label: 'Rotate', color: 'from-purple-500 to-purple-600' },
  { id: 'crop', icon: <FiCrop />, label: 'Crop', color: 'from-orange-500 to-orange-600' },
  { id: 'brightness', icon: <FiSun />, label: 'Brightness', color: 'from-yellow-500 to-yellow-600' },
  { id: 'volume', icon: <FiVolume2 />, label: 'Volume', color: 'from-cyan-500 to-cyan-600' },
  { id: 'text', icon: <FiType />, label: 'Text', color: 'from-pink-500 to-pink-600' },
  { id: 'filter', icon: <FiFilter />, label: 'Filter', color: 'from-red-500 to-red-600' },
  { id: 'audio', icon: <FiMusic />, label: 'Audio', color: 'from-indigo-500 to-indigo-600' },
  { id: 'subtitle', icon: <FiType />, label: 'Subtitle', color: 'from-teal-500 to-teal-600' },
  { id: 'watermark', icon: <FiImage />, label: 'Watermark', color: 'from-gray-500 to-gray-600' },
  { id: 'export', icon: <FiDownload />, label: 'Export', color: 'from-accent-500 to-accent-600' },
];

const speedOptions = [
  { value: '0.25', label: '0.25x', desc: 'Very Slow' },
  { value: '0.5', label: '0.5x', desc: 'Slow' },
  { value: '0.75', label: '0.75x', desc: 'Slower' },
  { value: '1', label: '1x', desc: 'Normal' },
  { value: '1.25', label: '1.25x', desc: 'Faster' },
  { value: '1.5', label: '1.5x', desc: 'Fast' },
  { value: '2', label: '2x', desc: 'Faster' },
  { value: '4', label: '4x', desc: 'Very Fast' },
];

const rotateOptions = [
  { value: '90', label: '90°', desc: 'Clockwise' },
  { value: '180', label: '180°', desc: 'Flip' },
  { value: '270', label: '270°', desc: 'Counter' },
  { value: 'h', label: 'H-Flip', desc: 'Horizontal' },
  { value: 'v', label: 'V-Flip', desc: 'Vertical' },
];

const filterOptions = [
  { value: 'none', label: 'None' },
  { value: 'vintage', label: 'Vintage' },
  { value: 'warm', label: 'Warm' },
  { value: 'cool', label: 'Cool' },
  { value: 'bw', label: 'B&W' },
  { value: 'sepia', label: 'Sepia' },
  { value: 'vivid', label: 'Vivid' },
  { value: 'dramatic', label: 'Dramatic' },
];

const VideoEditing: React.FC = () => {
  const navigate = useNavigate();
  const { currentVideo, addVideo } = useVideo();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showToolPanel, setShowToolPanel] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [appliedEffects, setAppliedEffects] = useState<string[]>([]);
  const [trimStart, setTrimStart] = useState('00:00:00');
  const [trimEnd, setTrimEnd] = useState('00:00:10');
  const [selectedSpeed, setSelectedSpeed] = useState('1');
  const [selectedRotation, setSelectedRotation] = useState('90');
  const [selectedFilter, setSelectedFilter] = useState('none');
  const [volume, setVolume] = useState(100);
  const [brightness, setBrightness] = useState(100);

  const handleToolClick = (toolId: string) => {
    setSelectedTool(toolId);
    setShowToolPanel(true);
  };

  const applyEffect = (effect: string) => {
    if (!appliedEffects.includes(effect)) {
      setAppliedEffects([...appliedEffects, effect]);
    }
    setShowToolPanel(false);
    setSelectedTool(null);
  };

  const getToolContent = () => {
    switch (selectedTool) {
      case 'trim':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-white/70 mb-2 block">Start Time</label>
              <input
                type="text"
                value={trimStart}
                onChange={(e) => setTrimStart(e.target.value)}
                className="input-field"
                placeholder="00:00:00"
              />
            </div>
            <div>
              <label className="text-sm text-white/70 mb-2 block">End Time</label>
              <input
                type="text"
                value={trimEnd}
                onChange={(e) => setTrimEnd(e.target.value)}
                className="input-field"
                placeholder="00:00:10"
              />
            </div>
            <button onClick={() => applyEffect('trim')} className="btn-primary w-full">
              Apply Trim
            </button>
          </div>
        );
      
      case 'speed':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-2">
              {speedOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedSpeed(opt.value)}
                  className={`p-2 rounded-lg border text-center transition-all ${
                    selectedSpeed === opt.value
                      ? 'bg-accent-500/20 border-accent-500'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="text-white font-bold">{opt.label}</div>
                  <div className="text-xs text-white/50">{opt.desc}</div>
                </button>
              ))}
            </div>
            <button onClick={() => applyEffect(`speed-${selectedSpeed}`)} className="btn-primary w-full">
              Apply Speed
            </button>
          </div>
        );
      
      case 'rotate':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-5 gap-2">
              {rotateOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedRotation(opt.value)}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    selectedRotation === opt.value
                      ? 'bg-purple-500/20 border-purple-500'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="text-xl text-white font-bold">{opt.label}</div>
                  <div className="text-xs text-white/50">{opt.desc}</div>
                </button>
              ))}
            </div>
            <button onClick={() => applyEffect(`rotate-${selectedRotation}`)} className="btn-primary w-full">
              Apply Rotation
            </button>
          </div>
        );
      
      case 'filter':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-2">
              {filterOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedFilter(opt.value)}
                  className={`p-2 rounded-lg border text-center transition-all ${
                    selectedFilter === opt.value
                      ? 'bg-red-500/20 border-red-500'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="text-white">{opt.label}</div>
                </button>
              ))}
            </div>
            <button onClick={() => applyEffect(`filter-${selectedFilter}`)} className="btn-primary w-full">
              Apply Filter
            </button>
          </div>
        );
      
      case 'volume':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-white/70 mb-2 block">Volume: {volume}%</label>
              <input
                type="range"
                min="0"
                max="200"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <button onClick={() => applyEffect(`volume-${volume}`)} className="btn-primary w-full">
              Apply Volume
            </button>
          </div>
        );
      
      case 'brightness':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-white/70 mb-2 block">Brightness: {brightness}%</label>
              <input
                type="range"
                min="0"
                max="200"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <button onClick={() => applyEffect(`brightness-${brightness}`)} className="btn-primary w-full">
              Apply Brightness
            </button>
          </div>
        );
      
      default:
        return (
          <div className="text-center text-white/50 py-8">
            <p>Configure {selectedTool} settings</p>
          </div>
        );
    }
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
              <h1 className="text-2xl font-bold text-white mb-1">Video Editor</h1>
              <p className="text-white/60 text-sm">Edit your videos with professional tools</p>
            </div>
            {currentVideo && (
              <Button onClick={() => navigate('/subtitles-editing')} size="sm">
                Continue to Subtitles →
              </Button>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-4">
            {/* Video Player */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card p-3"
            >
              {currentVideo ? (
                <VideoPlayer src={currentVideo.url} />
              ) : (
                <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl">
                  <div className="text-center">
                    <FiVideo className="text-4xl text-white/30 mx-auto mb-3" />
                    <p className="text-white/50 text-sm">Upload a video to start editing</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Compact Tools Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="card p-3"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                  <FiScissors className="text-accent-500 text-xs" />
                  Tools
                </h3>
                <span className="text-xs text-white/50">{appliedEffects.length} applied</span>
              </div>
              
              {/* Tools Grid - Compact */}
              <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
                {videoTools.map((tool) => (
                  <motion.button
                    key={tool.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleToolClick(tool.id)}
                    className={`p-2 rounded-lg bg-gradient-to-r ${tool.color} text-white text-center transition-all shadow-lg hover:shadow-xl`}
                  >
                    <div className="text-lg mb-1">{tool.icon}</div>
                    <div className="text-xs font-medium">{tool.label}</div>
                  </motion.button>
                ))}
              </div>

              {/* Applied Effects Tags */}
              {appliedEffects.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-white/10">
                  {appliedEffects.map((effect, i) => (
                    <span key={i} className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs flex items-center gap-1">
                      <FiCheck className="text-xs" /> {effect}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Navigation Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 btn-secondary py-3 flex items-center justify-center gap-2"
              >
                ← Back to Dashboard
              </button>
              {currentVideo && (
                <button
                  onClick={() => navigate('/subtitles-editing')}
                  className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"
                >
                  Next: Subtitles → <FiFileText />
                </button>
              )}
            </div>

            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="card p-3"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                  <FiClock className="text-accent-500 text-xs" />
                  Timeline
                </h3>
                <div className="flex gap-2">
                  <button className="p-1.5 rounded bg-white/10 hover:bg-white/20">
                    <FiPlay className="text-sm" />
                  </button>
                  <button className="p-1.5 rounded bg-white/10 hover:bg-white/20">
                    <FiScissors className="text-sm" />
                  </button>
                </div>
              </div>
              <div className="h-16 bg-gradient-to-r from-blue-800/50 to-blue-900/50 rounded-lg flex items-center justify-center border border-white/10">
                <p className="text-white/40 text-xs">{currentVideo ? 'Timeline - drag clips here' : 'Upload video to see timeline'}</p>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-4">
            <div className="card p-3">
              <h3 className="font-semibold text-white text-sm mb-3">Upload</h3>
              <VideoUploader />
            </div>

            {/* Applied Effects Panel */}
            {appliedEffects.length > 0 && (
              <div className="card p-3">
                <h3 className="font-semibold text-white text-sm mb-3">Applied Effects</h3>
                <div className="space-y-2">
                  {appliedEffects.map((effect, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                      <span className="text-white text-sm">{effect}</span>
                      <button className="text-red-400 hover:text-red-300">×</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Export Button */}
            {currentVideo && (
              <button
                onClick={() => navigate('/create-video')}
                className="w-full btn-primary py-3 flex items-center justify-center gap-2"
              >
                <FiDownload /> Render Video
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tool Settings Dialog */}
      <DialogBox
        isOpen={showToolPanel}
        onClose={() => { setShowToolPanel(false); setSelectedTool(null); }}
        title={`${selectedTool?.charAt(0).toUpperCase()}${selectedTool?.slice(1)} Settings`}
        size="sm"
      >
        {getToolContent()}
      </DialogBox>
    </div>
  );
};

export default VideoEditing;