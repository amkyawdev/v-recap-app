import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiFolder, FiShield, FiArrowRight, FiCheck } from 'react-icons/fi';
import { DialogBox } from '../components/Common/DialogBox';
import { Button } from '../components/Common/Button';
import { usePermissions } from '../contexts/PermissionContext';

const GetStarted: React.FC = () => {
  const navigate = useNavigate();
  const { requestPermissions, checkSystemPermission } = usePermissions();
  const [showDialog] = useState(true);
  const [inputFolder, setInputFolder] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleContinue = async () => {
    if (!inputFolder.trim()) return;
    
    setIsLoading(true);
    
    
    try {
      const hasPermission = await requestPermissions();
      if (hasPermission) {
        const hasSystemAccess = await checkSystemPermission();
        if (hasSystemAccess) {
          setIsSuccess(true);
          setTimeout(() => {
            navigate('/main');
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-accent-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-accent-500 shadow-lg shadow-red-500/30 mb-4"
          >
            <span className="text-4xl font-bold text-white">V</span>
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">V Recap</h1>
          <p className="text-white/70">Video Editing Made Simple</p>
        </div>

        {/* Permission Dialog */}
        {showDialog && (
          <DialogBox
            isOpen={showDialog}
            onClose={() => {}}
            title="Welcome Setup"
            size="md"
            showClose={false}
          >
            <div className="space-y-6">
              {/* Folder Input */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-white/80 mb-2">
                  <FiFolder className="text-accent-500" />
                  Storage Folder Name
                </label>
                <input
                  type="text"
                  value={inputFolder}
                  onChange={(e) => setInputFolder(e.target.value)}
                  className="input-field"
                  placeholder="my-videos"
                />
                <p className="text-xs text-white/50 mt-1">
                  This folder will store all your video projects
                </p>
              </div>

              {/* Permission Notice */}
              <div className="bg-accent-500/10 border border-accent-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <FiShield className="text-accent-500 text-xl flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-white mb-1">System Permission Required</p>
                    <p className="text-sm text-white/70">
                      V Recap needs access to your file system to save and process videos. Your data stays on your device.
                    </p>
                  </div>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-white/70">
                  <FiCheck className="text-green-400" />
                  <span>Local video processing</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-white/70">
                  <FiCheck className="text-green-400" />
                  <span>AI-powered subtitle translation</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-white/70">
                  <FiCheck className="text-green-400" />
                  <span>Export in multiple formats</span>
                </div>
              </div>

              {/* Action Button */}
              <Button
                onClick={handleContinue}
                disabled={!inputFolder.trim() || isLoading}
                className="w-full"
                icon={isSuccess ? <FiCheck /> : <FiArrowRight />}
              >
                {isLoading ? 'Setting up...' : isSuccess ? 'Welcome!' : 'Get Started'}
              </Button>
            </div>
          </DialogBox>
        )}
      </motion.div>
    </div>
  );
};

export default GetStarted;