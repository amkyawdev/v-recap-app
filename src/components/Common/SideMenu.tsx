import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FiHome, FiGrid, FiPlay, FiFileText, FiVideo, 
  FiInfo, FiSettings, FiLogOut, FiTrendingUp, FiKey,
  FiChevronRight, FiArrowRight
} from 'react-icons/fi';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  // Workflow navigation items (main flow)
  const workflowItems = [
    { 
      icon: FiGrid, 
      label: 'Dashboard', 
      path: '/dashboard',
      desc: 'My Projects'
    },
    { 
      icon: FiPlay, 
      label: 'Video Editing', 
      path: '/video-editing',
      desc: 'Step 1: Edit Video'
    },
    { 
      icon: FiFileText, 
      label: 'Subtitles', 
      path: '/subtitles-editing',
      desc: 'Step 2: Add Subtitles'
    },
    { 
      icon: FiVideo, 
      label: 'Output Render', 
      path: '/create-video',
      desc: 'Step 3: Export'
    },
  ];

  const otherItems = [
    { icon: FiKey, label: 'API Settings', path: '/settings' },
    { icon: FiSettings, label: 'Settings', path: '/settings' },
    { icon: FiInfo, label: 'About', path: '/about' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-80 bg-gradient-to-b from-blue-900/95 to-blue-800/95 backdrop-blur-xl z-50 shadow-2xl"
          >
            {/* Header */}
            <div className="pt-20 px-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent-500 flex items-center justify-center">
                  <span className="text-xl font-bold text-white">V</span>
                </div>
                <div>
                  <h3 className="font-bold text-white">V Recap</h3>
                  <p className="text-xs text-white/60">Video Editor</p>
                </div>
              </div>
            </div>

            {/* Workflow Section - Main Navigation */}
            <div className="px-4 pt-4">
              <p className="text-xs text-white/40 uppercase tracking-wider mb-2 px-2">Workflow</p>
              <nav className="space-y-1">
                {workflowItems.map((item, index) => (
                  <motion.button
                    key={item.path}
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      navigate(item.path);
                      onClose();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-accent-500/30">
                      <item.icon size={18} />
                    </div>
                    <div className="flex-1 text-left">
                      <span className="font-medium text-sm block">{item.label}</span>
                      <span className="text-xs text-white/40">{item.desc}</span>
                    </div>
                    <FiChevronRight size={16} className="text-white/30 group-hover:text-white/60" />
                  </motion.button>
                ))}
              </nav>
            </div>

            {/* Arrow connector between workflow items */}
            <div className="px-8 pt-1 pb-2">
              <div className="flex items-center gap-1">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center">
                      <span className="text-[10px] text-white/40">{i + 1}</span>
                    </div>
                    {i < 2 && <div className="w-6 h-px bg-white/20" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Next Step Button */}
            <div className="px-4 pb-2">
              <button
                onClick={() => {
                  const currentPath = window.location.pathname;
                  if (currentPath === '/dashboard') navigate('/video-editing');
                  else if (currentPath === '/video-editing') navigate('/subtitles-editing');
                  else if (currentPath === '/subtitles-editing') navigate('/create-video');
                  else navigate('/video-editing');
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent-500/20 hover:bg-accent-500/30 text-accent-400 rounded-xl transition-all"
              >
                <FiArrowRight size={18} />
                <span className="font-medium text-sm">Next Step →</span>
              </button>
            </div>

            {/* Other Items */}
            <div className="px-4 pt-4">
              <p className="text-xs text-white/40 uppercase tracking-wider mb-2 px-2">Other</p>
              <nav className="space-y-1">
                {otherItems.map((item, index) => (
                  <motion.button
                    key={item.path}
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: (index + 4) * 0.05 }}
                    onClick={() => {
                      navigate(item.path);
                      onClose();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-white/60 hover:bg-white/5 hover:text-white/80 transition-all"
                  >
                    <item.icon size={18} />
                    <span className="text-sm">{item.label}</span>
                  </motion.button>
                ))}
              </nav>
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
              <button 
                onClick={() => {
                  localStorage.clear();
                  navigate('/');
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 rounded-xl hover:bg-red-500/10 transition-all"
              >
                <FiLogOut size={18} />
                <span className="font-medium text-sm">Logout</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SideMenu;