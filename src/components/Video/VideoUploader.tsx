import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { FiUpload, FiVideo, FiX } from 'react-icons/fi';
import { useVideo } from '../../contexts/VideoContext';

export const VideoUploader: React.FC = () => {
  const { addVideo, removeVideo, videos } = useVideo();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      if (file.type.startsWith('video/')) {
        addVideo(file);
      }
    });
  }, [addVideo]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'video/*': [] },
    multiple: true
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
          Drag & drop or click to select video files (MP4, MOV, AVI)
        </p>
      </motion.div>

      {/* Uploaded Videos */}
      {videos.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-white/70">Uploaded Videos ({videos.length})</h3>
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
                    {(video.size / 1024 / 1024).toFixed(2)} MB
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