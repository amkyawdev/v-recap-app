import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { 
  FiVideo, FiFileText, FiPlay, FiPlus, FiTrendingUp,
  FiClock, FiStar, FiArrowRight
} from 'react-icons/fi';
import { HamburgerMenu } from '../components/Common/HamburgerMenu';
import { SideMenu } from '../components/Common/SideMenu';
import { Button } from '../components/Common/Button';
import { useVideo } from '../contexts/VideoContext';

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const { addVideo } = useVideo();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const onDrop = (acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      if (file.type.startsWith('video/')) {
        addVideo(file);
        navigate('/video-editing');
      }
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'video/*': [] },
    multiple: true
  });

  const quickActions = [
    { icon: FiVideo, label: 'Video Editing', path: '/video-editing', color: 'bg-blue-500' },
    { icon: FiFileText, label: 'Subtitles', path: '/subtitles-editing', color: 'bg-purple-500' },
    { icon: FiPlay, label: 'Create Video', path: '/create-video', color: 'bg-green-500' },
  ];

  const recentProjects = [
    { name: 'Travel Vlog', time: '2 hours ago', thumb: '🗾' },
    { name: 'Family Video', time: 'Yesterday', thumb: '👨‍👩‍👧' },
    { name: 'Product Demo', time: '3 days ago', thumb: '📦' },
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

        {/* Upload Zone */}
        <motion.div
          {...getRootProps()}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className={`card p-8 text-center cursor-pointer transition-all duration-300 mb-8 ${
            isDragActive ? 'border-accent-500 bg-accent-500/10' : 'hover:border-white/40'
          }`}
        >
          <input {...getInputProps()} />
          <motion.div
            animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-500/20 mb-4"
          >
            <FiPlus className="text-3xl text-accent-500" />
          </motion.div>
          <h3 className="text-xl font-semibold text-white mb-2">
            {isDragActive ? 'Drop videos here' : 'Upload Videos'}
          </h3>
          <p className="text-white/60 text-sm">
            Drag & drop or click to select video files
          </p>
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

        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <FiClock className="text-accent-500" />
              Recent Projects
            </h2>
            <button 
              onClick={() => navigate('/dashboard')}
              className="text-sm text-accent-400 hover:text-accent-300"
            >
              View all
            </button>
          </div>
          
          {recentProjects.length > 0 ? (
            <div className="space-y-3">
              {recentProjects.map((project, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <span className="text-3xl">{project.thumb}</span>
                  <div className="flex-1">
                    <h3 className="font-medium text-white">{project.name}</h3>
                    <p className="text-sm text-white/50">{project.time}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-white/50">
              <FiVideo className="text-4xl mx-auto mb-2 opacity-50" />
              <p>No recent projects</p>
            </div>
          )}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'Videos Edited', value: '12', icon: FiVideo },
            { label: 'Subtitles Added', value: '48', icon: FiFileText },
            { label: 'Hours Saved', value: '6.5', icon: FiTrendingUp },
            { label: 'Projects', value: '8', icon: FiStar },
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