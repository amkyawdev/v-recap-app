import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FiClock, FiTrash2, 
  FiEdit3, FiPlus, FiVideo, FiFileText,
  FiFolder, FiCheck
} from 'react-icons/fi';
import { HamburgerMenu } from '../components/Common/HamburgerMenu';
import { SideMenu } from '../components/Common/SideMenu';
import { Button } from '../components/Common/Button';
// Storage service is available for future use;
import { useVideo } from '../contexts/VideoContext';
import { useSubtitles } from '../contexts/SubtitleContext';

interface HistoryItem {
  id: string;
  videoId: string;
  videoName: string;
  videoSize: number;
  videoDuration: number;
  videoUrl: string;
  subtitles: number;
  effects: number;
  status: 'draft' | 'editing' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { videos, removeVideo } = useVideo();
  const { subtitles } = useSubtitles();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'recent' | 'favorites'>('all');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  

  // Load history from localStorage and sync with videos
  useEffect(() => {
    loadHistory();
    loadStorageInfo();
  }, []);

  // Sync videos to history when videos change
  useEffect(() => {
    if (videos.length > 0) {
      syncVideosToHistory();
    }
  }, [videos]);

  const loadHistory = () => {
    try {
      const savedHistory = localStorage.getItem('videoHistory');
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        setHistory(parsed.map((h: any) => ({
          ...h,
          createdAt: new Date(h.createdAt),
          updatedAt: new Date(h.updatedAt)
        })));
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  const syncVideosToHistory = () => {
    // Convert videos from context to history items
    const videoHistoryItems: HistoryItem[] = videos.map(v => ({
      id: v.id,
      videoId: v.id,
      videoName: v.name,
      videoSize: v.size,
      videoDuration: v.duration,
      videoUrl: v.url,
      subtitles: subtitles.length,
      effects: 0,
      status: 'editing' as const,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    // Merge with existing history (keep projects that might have more info)
    setHistory(prev => {
      const existingIds = new Set(videoHistoryItems.map(v => v.videoId));
      const additionalItems = prev.filter(h => !existingIds.has(h.videoId));
      return [...videoHistoryItems, ...additionalItems];
    });

    // Save to localStorage
    localStorage.setItem('videoHistory', JSON.stringify(videoHistoryItems));
  };

  const saveHistory = (newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    localStorage.setItem('videoHistory', JSON.stringify(newHistory));
  };

  const loadStorageInfo = async () => {
    // Storage info loading placeholder
  };

  const handleDeleteHistory = (id: string) => {
    const newHistory = history.filter(h => h.id !== id);
    saveHistory(newHistory);
    removeVideo(id);
  };

  const handleOpenHistory = (_item: HistoryItem) => {
    // Navigate to video editing
    navigate('/video-editing');
  };

  const handleMarkComplete = (id: string) => {
    const newHistory = history.map(h => 
      h.id === id ? { ...h, status: 'completed' as const, updatedAt: new Date() } : h
    );
    saveHistory(newHistory);
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

  // Get filtered history based on active tab
  const getFilteredHistory = () => {
    switch (activeTab) {
      case 'recent':
        return [...history].sort((a, b) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        ).slice(0, 10);
      case 'favorites':
        return history.filter(h => h.status === 'completed');
      default:
        return history;
    }
  };

  const totalProjects = history.length;
  const totalDuration = history.reduce((acc, h) => acc + (h.videoDuration || 0), 0);
  const totalSubtitles = history.reduce((acc, h) => acc + (h.subtitles || 0), 0);
  const completedCount = history.filter(h => h.status === 'completed').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'draft': return 'bg-yellow-500';
      case 'editing': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredHistory = getFilteredHistory();

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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
            <div className="text-sm text-white/50 mt-1">Total</div>
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
            <div className="text-sm text-white/50 mt-1">Items</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-sm">Completed</span>
              <FiCheck className="text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white">{completedCount}</div>
            <div className="text-sm text-white/50 mt-1">Done</div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All', count: history.length },
            { id: 'recent', label: 'Recent', count: Math.min(history.length, 10) },
            { id: 'favorites', label: 'Completed', count: completedCount },
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

        {/* History List */}
        {filteredHistory.length === 0 ? (
          <div className="card p-8 text-center">
            <FiVideo className="text-5xl text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Projects Yet</h3>
            <p className="text-white/60 mb-4">Upload a video to start editing</p>
            <Button onClick={() => navigate('/video-editing')} icon={<FiPlus />}>
              Start New Project
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredHistory.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card p-4 flex items-center gap-4 hover:bg-white/5 transition-colors"
              >
                {/* Thumbnail */}
                <div className="w-20 h-14 rounded-lg bg-gradient-to-br from-blue-800 to-blue-900 flex items-center justify-center flex-shrink-0 cursor-pointer"
                     onClick={() => handleOpenHistory(item)}>
                  <span className="text-2xl">🎬</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handleOpenHistory(item)}>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white truncate">{item.videoName}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(item.status)} text-white capitalize`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-white/50">
                    <span className="flex items-center gap-1">
                      <FiClock size={12} />
                      {formatDate(item.updatedAt)}
                    </span>
                    <span>{formatDuration(item.videoDuration)}</span>
                    <span>{formatFileSize(item.videoSize)}</span>
                    <span>{item.subtitles} subs</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {item.status !== 'completed' && (
                    <button
                      onClick={() => handleMarkComplete(item.id)}
                      className="p-2 rounded-lg hover:bg-green-500/20 text-green-400 transition-colors"
                      title="Mark complete"
                    >
                      <FiCheck size={18} />
                    </button>
                  )}
                  <button 
                    onClick={() => handleOpenHistory(item)}
                    className="p-2 rounded-lg hover:bg-blue-500/20 text-blue-400 transition-colors"
                    title="Edit"
                  >
                    <FiEdit3 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDeleteHistory(item.id)}
                    className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                    title="Delete"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;