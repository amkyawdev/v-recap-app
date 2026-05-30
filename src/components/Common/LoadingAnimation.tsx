import React from 'react';
import { motion } from 'framer-motion';

interface LoadingAnimationProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ 
  size = 'md',
  message 
}) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <motion.div
          className={`${sizes[size]} border-4 border-white/20 rounded-full`}
        />
        <motion.div
          className={`absolute top-0 left-0 ${sizes[size]} border-4 border-accent-500 rounded-full`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      {message && (
        <p className="text-white/80 text-sm animate-pulse">{message}</p>
      )}
    </div>
  );
};

export default LoadingAnimation;