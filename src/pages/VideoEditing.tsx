import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiVideo, FiUpload, FiPlay, FiClock } from 'react-icons/fi';
import { HamburgerMenu } from '../components/Common/HamburgerMenu';
import { SideMenu } from '../components/Common/SideMenu';
import { Button } from '../components/Common/Button';
import { VideoPlayer } from '../components/Video/VideoPlayer';
import { VideoUploader } from '../components/Video/VideoUploader';
import { EditingTools } from '../components/Video/EditingTools';
import { AudioUploader } from '../components/Video/AudioUploader';
import { useVideo } from '../contexts/VideoContext';

const VideoEditing: React.FC = () => {
  const navigate = useNavigate();
  const { currentVideo } = useVideo();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showTools, setShowTools] = useState(false);

  return (
    <div className="min-h-screen">
      <HamburgerMenu onClick={() => setIsMenuOpen(true)} isOpen={isMenuOpen} />
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div className="pt-20 px-4 pb-8 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Video Editing</h1>
              <p className="text-white/60">Edit and enhance your videos</p>
            </div>
            {currentVideo && (
              <Button onClick={() => navigate('/subtitles-editing')}>
                Continue to Subtitles
              </Button>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card p-4"
            >
              {currentVideo ? (
                <VideoPlayer src={currentVideo.url} />
              ) : (
                <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl">
                  <div className="text-center">
                    <FiVideo className="text-5xl text-white/30 mx-auto mb-4" />
                    <p className="text-white/50">Upload a video to start editing</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="card p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <FiClock className="text-accent-500" />
                  Timeline
                </h3>
                <button
                  onClick={() => setShowTools(!showTools)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    showTools ? 'bg-accent-500 text-white' : 'bg-white/10 text-white/70'
                  }`}
                >
                  {showTools ? 'Hide Tools' : 'Show Tools'}
                </button>
              </div>

              {showTools && <EditingTools />}

              {/* Timeline tracks would go here */}
              <div className="mt-4 h-24 bg-white/5 rounded-xl flex items-center justify-center">
                <p className="text-white/40">Timeline area - drag clips here</p>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <VideoUploader />
            <AudioUploader />

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="card p-4"
            >
              <h3 className="font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full btn-secondary justify-start">
                  <FiPlay className="mr-2" /> Preview Video
                </button>
                <button className="w-full btn-secondary justify-start">
                  <FiUpload className="mr-2" /> Export Video
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoEditing;