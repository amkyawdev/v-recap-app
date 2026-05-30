import React from 'react';
import { motion } from 'framer-motion';
import { FiMenu } from 'react-icons/fi';

interface HamburgerMenuProps {
  onClick: () => void;
  isOpen: boolean;
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ onClick, isOpen }) => {
  return (
    <motion.button
      onClick={onClick}
      className="fixed top-4 left-4 z-50 p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:bg-white/20 transition-all"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle menu"
    >
      <motion.div
        animate={{ rotate: isOpen ? 90 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <FiMenu size={24} className="text-white" />
      </motion.div>
    </motion.button>
  );
};

export default HamburgerMenu;