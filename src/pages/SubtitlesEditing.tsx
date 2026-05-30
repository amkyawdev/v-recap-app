import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiFileText, FiType, FiGlobe, FiPlay, FiDownload } from 'react-icons/fi';
import { HamburgerMenu } from '../components/Common/HamburgerMenu';
import { SideMenu } from '../components/Common/SideMenu';
import { Button } from '../components/Common/Button';
import { SubtitleUploader } from '../components/Subtitles/SubtitleUploader';
import { SubtitleEditor } from '../components/Subtitles/SubtitleEditor';
import { FontDesigner } from '../components/Subtitles/FontDesigner';
import { TranslationTools } from '../components/Subtitles/TranslationTools';
import { useSubtitles } from '../contexts/SubtitleContext';
import { useVideo } from '../contexts/VideoContext';

const SubtitlesEditing: React.FC = () => {
  const navigate = useNavigate();
  const { subtitles } = useSubtitles();
  const { currentVideo } = useVideo();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
              <h1 className="text-3xl font-bold text-white mb-2">Subtitle Editing</h1>
              <p className="text-white/60">Create and customize subtitles</p>
            </div>
            {subtitles.length > 0 && (
              <Button onClick={() => navigate('/create-video')}>
                Continue to Create Video
              </Button>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card p-4"
            >
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <FiPlay className="text-accent-500" />
                Preview
              </h3>
              
              {currentVideo ? (
                <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-white/30">Video preview with subtitles</p>
                  </div>
                  <div className="absolute bottom-8 left-0 right-0 text-center">
                    <span className="px-4 py-2 bg-black/70 rounded-lg text-white">
                      {subtitles[0]?.text || 'No subtitle'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <FiFileText className="text-5xl text-white/30 mx-auto mb-4" />
                    <p className="text-white/50">Upload a video to preview subtitles</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Subtitle Editor */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="card p-4"
            >
              <SubtitleEditor />
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <SubtitleUploader />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="card p-4"
            >
              <FontDesigner />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="card p-4"
            >
              <TranslationTools />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubtitlesEditing;