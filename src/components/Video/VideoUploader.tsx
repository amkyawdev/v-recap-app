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
  const { addVideo, removeVideo, currentVideo } = useVideo();
  const [uploadStatuses, setUploadStatuses] = useState<UploadStatus[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setError(null);
    
    if (acceptedFiles.length === 0) {
      return;
    }

    const file = acceptedFiles[0]; // Process one file at a time
    const tempId = `upload-${Date.now()}`;
    
    setUploadStatuses(prev => [...prev, {
      id: tempId,
      name: file.name,
      progress: 0,
      status: 'uploading'
    }]);

    try {
      // Update progress
      for (let progress = 0; progress <= 50; progress += 25) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploadStatuses(prev => prev.map(s => 
          s.id === tempId ? { ...s, progress } : s
        ));
      }

      // Add video to context
      await addVideo(file);
      
      setUploadStatuses(prev => prev.map(s => 
        s.id === tempId ? { ...s, status: 'success' as const, progress: 100 } : s
      ));

      // Remove success status after 2 seconds
      setTimeout(() => {
        setUploadStatuses(prev => prev.filter(s => s.id !== tempId));
      }, 2000);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      
      setUploadStatuses(prev => prev.map(s => 
        s.id === tempId ? { 
          ...s, 
          status: 'error' as const,
          message: errorMessage
        } : s
      ));
      
      // Remove error after 3 seconds
      setTimeout(() => {
        setUploadStatuses(prev => prev.filter(s => s.id !== tempId));
      }, 3000);
    }
  }, [addVideo]);

  const onDropRejected = useCallback((rejected: any[]) => {
    if (rejected && rejected.length > 0) {
      const rejectedFile = rejected[0].file;
      const errorMsg = rejected[0].errors?.[0]?.message || 'File rejected';
      
      setError(`${rejectedFile.name}: ${errorMsg}`);
      
      const tempId = `upload-${Date.now()}`;
      setUploadStatuses(prev => [...prev, {
        id: tempId,
        name: rejectedFile.name,
        progress: 0,
        status: 'error',
        message: errorMsg
      }]);
      
      setTimeout(() => {
        setUploadStatuses(prev => prev.filter(s => s.id !== tempId));
      }, 3000);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      'video/mp4': ['.mp4'],
      'video/quicktime': ['.mov'],
      'video/x-msvideo': ['.avi'],
      'video/webm': ['.webm'],
      'video/x-matroska': ['.mkv']
    },
    multiple: false,
    maxSize: 500 * 1024 * 1024, // 500MB
    maxFiles: 1
  });

  return (
    <div className="space-y-4">
      {/* Drop Zone - Button Style for Mobile */}
      <label className="block cursor-pointer w-full">
        <div className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-4 px-6 rounded-xl text-center transition-all duration-300 shadow-lg active:scale-95 flex items-center justify-center gap-3">
          <FiUpload className="text-xl" />
          <span className="text-base">Upload Video</span>
        </div>
        <input {...getInputProps()} className="hidden" />
      </label>

      {/* File Formats Info */}
      <p className="text-white/40 text-xs text-center">
        MP4, MOV, AVI, WebM, MKV (Max 500MB)
      </p>

      {/* Error Message */}
      {error && (
        <div className="p-3 rounded-lg bg-red-500/20 text-red-400 text-sm flex items-center gap-2">
          <FiAlertCircle />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-auto">
            <FiX />
          </button>
        </div>
      )}

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
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
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
                    <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
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
                  <p className="text-xs text-green-400 mt-1">Upload complete!</p>
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
                {currentVideo.duration && ` • ${Math.floor(currentVideo.duration / 60)}:${Math.floor(currentVideo.duration % 60).toString().padStart(2, '0')}`}
              </p>
            </div>
            <button 
              onClick={() => removeVideo(currentVideo.id)}
              className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
            >
              <FiX />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUploader;