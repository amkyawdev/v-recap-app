import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FiGrid, FiClock, FiTrendingUp, FiTrash2, 
  FiEdit3, FiCopy, FiEye, FiMoreVertical, FiPlus, FiVideo, FiFileText,
  FiPlay, FiSettings, FiFolder, FiHardDrive
} from 'react-icons/fi';
import { HamburgerMenu } from '../components/Common/HamburgerMenu';
import { SideMenu } from '../components/Common/SideMenu';
import { Button } from '../components/Common/Button';
import { storageService, Project } from '../services/storage/indexedDb';
import { useVideo } from '../contexts/VideoContext';
import { useSubtitles } from '../contexts/SubtitleContext';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { videos, removeVideo } = useVideo();
  const { subtitles } = useSubtitles();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'recent' | 'favorites'>('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [storageInfo, setStorageInfo] = useState({ used: 0, quota: 0 });

  useEffect(() => {
    loadProjects();
    loadStorageInfo();
  }, []);

  const loadProjects = async () => {
    try {
      const allProjects = await storageService.getAllProjects();
      setProjects(allProjects);
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  };

  const loadStorageInfo = async () => {
    try {
      const info = await storageService.getStorageInfo();
      setStorageInfo(info);
    } catch (error) {
      console.error('Failed to get storage info:', error);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await storageService.deleteProject(id);
      await loadProjects();
      removeVideo(id);
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const handleOpenProject = (project: Project) => {
    storageService.addToRecent(project);
    navigate('/video-editing');
  };

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
    if (!bytes) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatStorageSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString();
  };

  const totalProjects = projects.length;
  const totalDuration = projects.reduce((acc, p) => acc + (p.videoDuration || 0), 0);
  const totalSubtitles = projects.reduce((acc, p) => acc + (p.subtitles?.length || 0), 0);

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
              <h1 className="text-2xl font-bold text-white mb-1">My Projects</h1>
              <p className="text-white/60 text-sm">Manage your video projects</p>
            </div>
            <Button onClick={() => navigate('/video-editing')} size="sm" icon={<FiPlus />}>
              New Project
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="card p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-sm">Projects</span>
              <FiFolder className="text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white">{totalProjects}</div>
            <div className="text-sm text-white/50 mt-1">Total projects</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-sm">Duration</span>
              <FiClock className="text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white">
              {totalDuration > 0 ? formatDuration(totalDuration) : '0:00'}
            </div>
            <div className="text-sm text-white/50 mt-1">Total time</div>
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-sm">Storage</span>
              <FiHardDrive className="text-orange-400" />
            </div>
            <div className="text-2xl font-bold text-white">
              {formatStorageSize(storageInfo.used)}
            </div>
            <div className="text-sm text-white/50 mt-1">
              of {formatStorageSize(storageInfo.quota)}
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Projects', count: projects.length },
            { id: 'recent', label: 'Recent', count: projects.length },
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
        {projects.length === 0 ? (
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
            {projects.map((project, index) => {
              const status = project.status || 'draft';
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="card overflow-hidden group"
                >
                  {/* Thumbnail */}
                  <div 
                    className="relative aspect-video bg-gradient-to-br from-blue-800 to-blue-900 flex items-center justify-center cursor-pointer"
                    onClick={() => handleOpenProject(project)}
                  >
                    <span className="text-5xl">🎬</span>
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenProject(project);
                        }}
                        className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                      >
                        <FiEdit3 className="text-white" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/subtitles-editing');
                        }}
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
                      {project.videoDuration && (
                        <div className="px-2 py-1 rounded bg-black/50 text-white text-xs">
                          {formatDuration(project.videoDuration)}
                        </div>
                      )}
                      {project.videoSize && (
                        <div className="px-2 py-1 rounded bg-black/50 text-white text-xs">
                          {formatFileSize(project.videoSize)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handleOpenProject(project)}>
                        <h3 className="font-semibold text-white mb-1 truncate">{project.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-white/50">
                          <FiClock size={12} />
                          <span>{formatDate(project.updatedAt)}</span>
                        </div>
                      </div>
                      <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                        <FiMoreVertical className="text-white/50" />
                      </button>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-xs text-white/50 mb-3">
                      <span>{project.subtitles?.length || 0} subtitles</span>
                      <span>{project.effects?.length || 0} effects</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                      <button 
                        onClick={() => handleOpenProject(project)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-sm transition-colors"
                      >
                        <FiEdit3 size={14} />
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteProject(project.id)}
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