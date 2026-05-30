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
  const { addVideo, removeVideo, videos } = useVideo();
  const [uploadStatuses, setUploadStatuses] = useState<UploadStatus[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      if (!file.type.startsWith('video/')) {
        continue;
      }

      const tempId = `upload-${Date.now()}-${Math.random()}`;
      
      setUploadStatuses(prev => [...prev, {
        id: tempId,
        name: file.name,
        progress: 0,
        status: 'uploading'
      }]);

      try {
        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 20) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setUploadStatuses(prev => prev.map(s => 
            s.id === tempId ? { ...s, progress } : s
          ));
        }

        await addVideo(file);
        
        setUploadStatuses(prev => prev.map(s => 
          s.id === tempId ? { ...s, status: 'success' as const } : s
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
    maxSize: 500 * 1024 * 1024 // 500MB max
  });

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <motion.div
        {...getRootProps()}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`card p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragActive ? 'border-accent-500 bg-accent-500/10' : 'hover:border-white/40'
        }`}
      >
        <input {...getInputProps()} />
        <motion.div
          animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-500/20 mb-4"
        >
          <FiUpload className="text-3xl text-accent-500" />
        </motion.div>
        <h3 className="text-xl font-semibold text-white mb-2">
          {isDragActive ? 'Drop videos here' : 'Upload Videos'}
        </h3>
        <p className="text-white/60 text-sm">
          Drag & drop or click to select (MP4, MOV, AVI, WebM, MKV)
        </p>
        <p className="text-white/40 text-xs mt-2">
          Max file size: 500MB
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
            className={`card p-4 ${
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
              <div className="flex-1">
                <p className="text-white font-medium truncate">{status.name}</p>
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
                  <p className="text-sm text-red-400 mt-1">{status.message}</p>
                )}
                {status.status === 'success' && (
                  <p className="text-sm text-green-400 mt-1">Upload complete!</p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Uploaded Videos */}
      {videos.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-white/70">
            Uploaded Videos ({videos.length})
          </h3>
          <div className="space-y-2">
            {videos.map((video) => (
              <div
                key={video.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <FiVideo className="text-xl text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{video.name}</p>
                  <p className="text-sm text-white/50">
                    {(video.size / (1024 * 1024)).toFixed(2)} MB • 
                    {Math.floor(video.duration / 60)}:{(Math.floor(video.duration % 60)).toString().padStart(2, '0')}
                  </p>
                </div>
                <button
                  onClick={() => removeVideo(video.id)}
                  className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                >
                  <FiX />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUploader;