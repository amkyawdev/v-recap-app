import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { 
  FiVideo, FiFileText, FiPlay, FiTrendingUp,
  FiStar, FiArrowRight, FiUpload, FiCheck, FiAlertCircle
} from 'react-icons/fi';
import { HamburgerMenu } from '../components/Common/HamburgerMenu';
import { SideMenu } from '../components/Common/SideMenu';
import { Button } from '../components/Common/Button';
import { useVideo } from '../contexts/VideoContext';

interface UploadStatus {
  id: string;
  name: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  message?: string;
}

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const { addVideo, currentVideo } = useVideo();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    const tempId = `upload-${Date.now()}`;
    
    setUploadStatus({
      id: tempId,
      name: file.name,
      progress: 0,
      status: 'uploading'
    });

    try {
      // Simulate progress
      for (let progress = 0; progress <= 50; progress += 25) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploadStatus(prev => prev ? { ...prev, progress } : null);
      }

      // Add video
      await addVideo(file);
      
      setUploadStatus({
        id: tempId,
        name: file.name,
        progress: 100,
        status: 'success'
      });

      // Navigate after success
      setTimeout(() => {
        navigate('/video-editing');
      }, 500);

    } catch (err) {
      setUploadStatus({
        id: tempId,
        name: file.name,
        progress: 0,
        status: 'error',
        message: err instanceof Error ? err.message : 'Upload failed'
      });
      
      // Clear error after 3 seconds
      setTimeout(() => setUploadStatus(null), 3000);
    }
  }, [addVideo, navigate]);

  const onDropRejected = useCallback((rejected: any[]) => {
    if (rejected.length > 0) {
      const file = rejected[0].file;
      const error = rejected[0].errors?.[0]?.message || 'File rejected';
      
      setUploadStatus({
        id: `rejected-${Date.now()}`,
        name: file.name,
        progress: 0,
        status: 'error',
        message: `${file.name}: ${error}`
      });
      
      setTimeout(() => setUploadStatus(null), 3000);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      'video/mp4': ['.mp4'],
      'video/quicktime': ['.mov'],
      'video/x-msvideo': ['.avi'],
      'video/webm': ['.webm'],
      'video/x-matroska': ['.mkv']
    },
    multiple: false,
    maxSize: 500 * 1024 * 1024
  });

  const quickActions = [
    { icon: FiVideo, label: 'Video Editing', path: '/video-editing', color: 'bg-blue-500' },
    { icon: FiFileText, label: 'Subtitles', path: '/subtitles-editing', color: 'bg-purple-500' },
    { icon: FiPlay, label: 'Create Video', path: '/create-video', color: 'bg-green-500' },
  ];

  return (
    <div className="min-h-screen">
      <HamburgerMenu onClick={() => setIsMenuOpen(true)} isOpen={isMenuOpen} />
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div className="pt-20 px-4 pb-8 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to V Recap</h1>
          <p className="text-white/60">Create amazing videos with ease</p>
        </motion.div>

        {/* Upload Zone - Mobile Button Style */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <label className="block cursor-pointer w-full">
            <div className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-5 px-6 rounded-2xl text-center transition-all duration-300 shadow-xl active:scale-95 flex items-center justify-center gap-3">
              <FiUpload className="text-2xl" />
              <span className="text-lg">Upload Video</span>
            </div>
            <input {...getInputProps()} className="hidden" />
          </label>
          <p className="text-white/40 text-xs text-center mt-3">
            MP4, MOV, AVI, WebM, MKV (Max 500MB)
          </p>
          
          {/* Upload Status */}
          {uploadStatus && (
            <div className={`mt-4 p-4 rounded-xl ${
              uploadStatus.status === 'success' ? 'bg-green-500/20' :
              uploadStatus.status === 'error' ? 'bg-red-500/20' :
              'bg-blue-500/20'
            }`}>
              <div className="flex items-center justify-center gap-3">
                {uploadStatus.status === 'success' ? (
                  <FiCheck className="text-green-400 text-2xl" />
                ) : uploadStatus.status === 'error' ? (
                  <FiAlertCircle className="text-red-400 text-2xl" />
                ) : (
                  <FiUpload className="text-blue-400 text-2xl animate-pulse" />
                )}
                <div>
                  <p className="text-white font-medium">{uploadStatus.name}</p>
                  {uploadStatus.status === 'uploading' && (
                    <p className="text-sm text-white/60">{uploadStatus.progress}%</p>
                  )}
                  {uploadStatus.message && (
                    <p className="text-sm text-red-400">{uploadStatus.message}</p>
                  )}
                  {uploadStatus.status === 'success' && (
                    <p className="text-sm text-green-400">Success! Redirecting...</p>
                  )}
                </div>
              </div>
              {uploadStatus.status === 'uploading' && (
                <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    style={{ width: `${uploadStatus.progress}%` }}
                  />
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              onClick={() => navigate(action.path)}
              className="card p-6 flex items-center gap-4 hover:bg-white/10 transition-all"
            >
              <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center`}>
                <action.icon size={24} className="text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-white">{action.label}</h3>
                <p className="text-sm text-white/60">Click to start</p>
              </div>
              <FiArrowRight className="text-white/40" />
            </motion.button>
          ))}
        </div>

        {/* Current Video Status */}
        {currentVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card p-4 mb-8 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <FiVideo className="text-green-400 text-xl" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">Current Video</p>
              <p className="text-sm text-white/60">{currentVideo.name}</p>
            </div>
            <Button onClick={() => navigate('/video-editing')} size="sm">
              Edit Video
            </Button>
          </motion.div>
        )}

        {/* Quick Start Guide */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="card p-6 mb-8"
        >
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FiTrendingUp className="text-accent-500" />
            Quick Start Guide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white/5 rounded-xl text-center">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white font-bold mx-auto mb-2 flex items-center justify-center">1</div>
              <p className="text-sm text-white/80">Upload Video</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl text-center">
              <div className="w-8 h-8 rounded-full bg-purple-500 text-white font-bold mx-auto mb-2 flex items-center justify-center">2</div>
              <p className="text-sm text-white/80">Edit Video</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl text-center">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white font-bold mx-auto mb-2 flex items-center justify-center">3</div>
              <p className="text-sm text-white/80">Add Subtitles</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl text-center">
              <div className="w-8 h-8 rounded-full bg-accent-500 text-white font-bold mx-auto mb-2 flex items-center justify-center">4</div>
              <p className="text-sm text-white/80">Export Video</p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'Videos Edited', value: '0', icon: FiVideo },
            { label: 'Subtitles', value: '0', icon: FiFileText },
            { label: 'Projects', value: '0', icon: FiStar },
            { label: 'Hours Saved', value: '0', icon: FiTrendingUp },
          ].map((stat, index) => (
            <div key={index} className="card p-4 text-center">
              <stat.icon className="text-2xl text-accent-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-white/60">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default MainPage;
