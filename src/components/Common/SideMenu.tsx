import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FiHome, FiGrid, FiPlay, FiFileText, FiVideo, 
  FiInfo, FiSettings, FiLogOut, FiTrendingUp, FiKey
} from 'react-icons/fi';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: FiHome, label: 'Home', path: '/main' },
    { icon: FiGrid, label: 'Dashboard', path: '/dashboard' },
    { icon: FiPlay, label: 'Video Editing', path: '/video-editing' },
    { icon: FiFileText, label: 'Subtitles', path: '/subtitles-editing' },
    { icon: FiVideo, label: 'Create Video', path: '/create-video' },
    { icon: FiKey, label: 'API Settings', path: '/settings' },
    { icon: FiTrendingUp, label: 'Analytics', path: '/analytics' },
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
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-72 bg-gradient-to-b from-blue-900/95 to-blue-800/95 backdrop-blur-xl z-50 shadow-2xl"
          >
            {/* Header */}
            <div className="pt-20 px-6 pb-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent-500 flex items-center justify-center">
                  <span className="text-xl font-bold text-white">V</span>
                </div>
                <div>
                  <h3 className="font-bold text-white">V Recap</h3>
                  <p className="text-sm text-white/60">Video Editor</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <nav className="pt-4 px-4">
              {menuItems.map((item, index) => (
                <motion.button
                  key={index}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    navigate(item.path);
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 mb-1 text-white/80 rounded-xl hover:bg-white/10 hover:text-white transition-all"
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              ))}
            </nav>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
              <button 
                onClick={() => {
                  localStorage.clear();
                  navigate('/');
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 rounded-xl hover:bg-red-500/10 transition-all"
              >
                <FiLogOut size={20} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SideMenu;