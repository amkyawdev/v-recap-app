import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload, FiVideo, FiX, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { useVideo } from '../../contexts/VideoContext';

interface UploadStatus {
  id: string;
  name: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  message?: string;
}

export const VideoUploader: React.FC = () => {
  const { addVideo, removeVideo, videos, currentVideo } = useVideo();
  const [uploadStatuses, setUploadStatuses] = useState<UploadStatus[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: any[]) => {
    // Handle rejected files
    if (rejectedFiles && rejectedFiles.length > 0) {
      rejectedFiles.forEach((rejected: any) => {
        const file = rejected.file;
        const errorMessage = rejected.errors?.[0]?.message || 'File rejected';
        
        const tempId = `upload-${Date.now()}-${Math.random()}`;
        setUploadStatuses(prev => [...prev, {
          id: tempId,
          name: file.name,
          progress: 0,
          status: 'error',
          message: errorMessage
        }]);
        
        // Remove error after 3 seconds
        setTimeout(() => {
          setUploadStatuses(prev => prev.filter(s => s.id !== tempId));
        }, 3000);
      });
    }
    
    // Handle accepted files
    for (const file of acceptedFiles) {
      const tempId = `upload-${Date.now()}-${Math.random()}`;
      
      setUploadStatuses(prev => [...prev, {
        id: tempId,
        name: file.name,
        progress: 0,
        status: 'uploading'
      }]);

      try {
        // Simulate initial progress
        for (let progress = 0; progress <= 30; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 50));
          setUploadStatuses(prev => prev.map(s => 
            s.id === tempId ? { ...s, progress } : s
          ));
        }

        await addVideo(file);
        
        setUploadStatuses(prev => prev.map(s => 
          s.id === tempId ? { ...s, status: 'success' as const, progress: 100 } : s
        ));

        // Remove success status after 2 seconds
        setTimeout(() => {
          setUploadStatuses(prev => prev.filter(s => s.id !== tempId));
        }, 2000);

      } catch (error) {
        setUploadStatuses(prev => prev.map(s => 
          s.id === tempId ? { 
            ...s, 
            status: 'error' as const,
            message: error instanceof Error ? error.message : 'Upload failed'
          } : s
        ));
        
        // Remove error after 3 seconds
        setTimeout(() => {
          setUploadStatuses(prev => prev.filter(s => s.id !== tempId));
        }, 3000);
      }
    }
  }, [addVideo]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/mp4': ['.mp4'],
      'video/quicktime': ['.mov'],
      'video/x-msvideo': ['.avi'],
      'video/webm': ['.webm'],
      'video/x-matroska': ['.mkv']
    },
    multiple: true,
    maxSize: 500 * 1024 * 1024, // 500MB
    maxFiles: 5,
    useFsAccessApi: false,
    onDropRejected: (rejected) => {
      console.log('Rejected files:', rejected);
    }
  });

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <motion.div
        {...getRootProps()}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`card p-6 text-center cursor-pointer transition-all duration-300 ${
          isDragActive ? 'border-accent-500 bg-accent-500/10' : 'hover:border-white/40'
        }`}
      >
        <input {...getInputProps()} />
        <motion.div
          animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
          className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent-500/20 mb-3"
        >
          <FiUpload className="text-2xl text-accent-500" />
        </motion.div>
        <h3 className="text-base font-semibold text-white mb-1">
          {isDragActive ? 'Drop here' : 'Upload Video'}
        </h3>
        <p className="text-white/60 text-xs">
          MP4, MOV, AVI, WebM, MKV
        </p>
        <p className="text-white/40 text-xs mt-1">
          Max 500MB
        </p>
      </motion.div>

      {/* Upload Status */}
      <AnimatePresence>
        {uploadStatuses.map(status => (
          <motion.div
            key={status.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`card p-3 ${
              status.status === 'error' ? 'border-red-500' : 
              status.status === 'success' ? 'border-green-500' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                status.status === 'success' ? 'bg-green-500/20' :
                status.status === 'error' ? 'bg-red-500/20' :
                'bg-blue-500/20'
              }`}>
                {status.status === 'success' ? (
                  <FiCheck className="text-green-400" />
                ) : status.status === 'error' ? (
                  <FiAlertCircle className="text-red-400" />
                ) : (
                  <FiVideo className="text-blue-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm truncate">{status.name}</p>
                {status.status === 'uploading' && (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-accent-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${status.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-white/50">{status.progress}%</span>
                  </div>
                )}
                {status.message && (
                  <p className="text-xs text-red-400 mt-1">{status.message}</p>
                )}
                {status.status === 'success' && (
                  <p className="text-xs text-green-400 mt-1">Done!</p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Current Video */}
      {currentVideo && (
        <div className="space-y-2">
          <p className="text-xs text-white/50">Current Video</p>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <FiVideo className="text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm truncate">{currentVideo.name}</p>
              <p className="text-xs text-white/50">
                {((currentVideo.size || 0) / (1024 * 1024)).toFixed(1)} MB
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUploader;