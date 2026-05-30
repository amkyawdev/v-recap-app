import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiGrid, FiClock, FiTrendingUp, FiTrash2, 
  FiEdit3, FiCopy, FiEye, FiMoreVertical
} from 'react-icons/fi';
import { HamburgerMenu } from '../components/Common/HamburgerMenu';
import { SideMenu } from '../components/Common/SideMenu';
import { Button } from '../components/Common/Button';

const Dashboard: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'recent' | 'favorites'>('all');

  const projects = [
    { 
      id: 1, 
      name: 'Summer Vacation 2024', 
      thumbnail: '🏖️',
      date: '2 hours ago',
      duration: '3:45',
      status: 'completed'
    },
    { 
      id: 2, 
      name: 'Product Launch Video', 
      thumbnail: '🚀',
      date: 'Yesterday',
      duration: '1:20',
      status: 'draft'
    },
    { 
      id: 3, 
      name: 'Family Birthday', 
      thumbnail: '🎂',
      date: '3 days ago',
      duration: '5:30',
      status: 'completed'
    },
    { 
      id: 4, 
      name: 'Tech Tutorial', 
      thumbnail: '💻',
      date: '1 week ago',
      duration: '12:45',
      status: 'editing'
    },
  ];

  const stats = [
    { label: 'Total Projects', value: '24', change: '+12%' },
    { label: 'Hours of Video', value: '48h', change: '+8%' },
    { label: 'Subtitles Created', value: '156', change: '+24%' },
  ];

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
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-white/60">Manage your video projects</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/60">{stat.label}</span>
                <FiTrendingUp className="text-green-400" />
              </div>
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-green-400 mt-1">{stat.change} this month</div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Projects', count: projects.length },
            { id: 'recent', label: 'Recent', count: 2 },
            { id: 'favorites', label: 'Favorites', count: 1 },
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="card overflow-hidden group"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gradient-to-br from-blue-800 to-blue-900 flex items-center justify-center">
                <span className="text-6xl">{project.thumbnail}</span>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                    <FiEye className="text-white" />
                  </button>
                  <button className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                    <FiEdit3 className="text-white" />
                  </button>
                </div>

                {/* Status Badge */}
                <div className={`absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(project.status)} text-white`}>
                  {project.status}
                </div>

                {/* Duration */}
                <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/50 text-white text-sm">
                  {project.duration}
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-white mb-1">{project.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-white/50">
                      <FiClock size={14} />
                      <span>{project.date}</span>
                    </div>
                  </div>
                  <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                    <FiMoreVertical className="text-white/50" />
                  </button>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 text-sm transition-colors">
                    <FiCopy size={16} />
                    Duplicate
                  </button>
                  <button className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm transition-colors">
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;