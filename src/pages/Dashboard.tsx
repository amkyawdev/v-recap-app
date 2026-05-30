import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FiGrid, FiClock, FiTrendingUp, FiTrash2, 
  FiEdit3, FiCopy, FiEye, FiMoreVertical, FiPlus, FiVideo, FiFileText
} from 'react-icons/fi';
import { HamburgerMenu } from '../components/Common/HamburgerMenu';
import { SideMenu } from '../components/Common/SideMenu';
import { Button } from '../components/Common/Button';
import { useVideo } from '../contexts/VideoContext';
import { useSubtitles } from '../contexts/SubtitleContext';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { videos, removeVideo } = useVideo();
  const { subtitles } = useSubtitles();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'recent' | 'favorites'>('all');

  const formatDuration = (seconds: number) => {
    if (!seconds) return '0:00';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return h > 0 
      ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
      : `${m}:${s.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Calculate real stats
  const totalProjects = videos.length;
  const totalDuration = videos.reduce((acc, v) => acc + (v.duration || 0), 0);
  const totalSubtitles = subtitles.length;

  const getStatusFromProject = (video: typeof videos[0]) => {
    if (!video) return 'draft';
    const hasSubtitles = subtitles.length > 0;
    return hasSubtitles ? 'editing' : 'draft';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'draft': return 'bg-yellow-500';
      case 'editing': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

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
              <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
              <p className="text-white/60 text-sm">Manage your video projects</p>
            </div>
            <Button onClick={() => navigate('/video-editing')} size="sm" icon={<FiPlus />}>
              New Project
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="card p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-sm">Total Projects</span>
              <FiVideo className="text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white">{totalProjects}</div>
            <div className="text-sm text-white/50 mt-1">{totalProjects > 0 ? 'Active projects' : 'No projects yet'}</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-sm">Total Duration</span>
              <FiClock className="text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white">
              {totalDuration > 0 ? formatDuration(totalDuration) : '0:00'}
            </div>
            <div className="text-sm text-white/50 mt-1">Video time</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-sm">Subtitles</span>
              <FiFileText className="text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white">{totalSubtitles}</div>
            <div className="text-sm text-white/50 mt-1">Subtitle items</div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Projects', count: videos.length },
            { id: 'recent', label: 'Recent', count: Math.min(videos.length, 2) },
            { id: 'favorites', label: 'Favorites', count: 0 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-accent-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {videos.length === 0 ? (
          <div className="card p-8 text-center">
            <FiVideo className="text-5xl text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Projects Yet</h3>
            <p className="text-white/60 mb-4">Create your first video project</p>
            <Button onClick={() => navigate('/video-editing')} icon={<FiPlus />}>
              Start New Project
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video, index) => {
              const status = getStatusFromProject(video);
              return (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="card overflow-hidden group"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-gradient-to-br from-blue-800 to-blue-900 flex items-center justify-center">
                    <span className="text-5xl">🎬</span>
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button 
                        onClick={() => navigate('/video-editing')}
                        className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                      >
                        <FiEdit3 className="text-white" />
                      </button>
                      <button 
                        onClick={() => navigate('/subtitles-editing')}
                        className="p-3 rounded-full bg-purple-500/40 hover:bg-purple-500/60 transition-colors"
                      >
                        <FiFileText className="text-white" />
                      </button>
                    </div>

                    {/* Status Badge */}
                    <div className={`absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(status)} text-white capitalize`}>
                      {status}
                    </div>

                    {/* Duration & Size */}
                    <div className="absolute bottom-3 right-3 flex gap-2">
                      <div className="px-2 py-1 rounded bg-black/50 text-white text-xs">
                        {formatDuration(video.duration)}
                      </div>
                      <div className="px-2 py-1 rounded bg-black/50 text-white text-xs">
                        {formatFileSize(video.size)}
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white mb-1 truncate">{video.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-white/50">
                          <span>{subtitles.length} subtitles</span>
                        </div>
                      </div>
                      <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                        <FiMoreVertical className="text-white/50" />
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                      <button 
                        onClick={() => navigate('/video-editing')}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-sm transition-colors"
                      >
                        <FiEdit3 size={14} />
                        Edit
                      </button>
                      <button 
                        onClick={() => removeVideo(video.id)}
                        className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm transition-colors"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;