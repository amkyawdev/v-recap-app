import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

interface DialogBoxProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showClose?: boolean;
}

export const DialogBox: React.FC<DialogBoxProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showClose = true
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="dialog-overlay" onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className={`dialog-box ${sizes[size]} p-6 w-full`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">{title}</h2>
              {showClose && (
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <FiX size={20} className="text-white/70" />
                </button>
              )}
            </div>
            <div className="text-white/90">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DialogBox;