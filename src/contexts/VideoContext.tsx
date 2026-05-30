import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { VideoFile, VideoOperation, ProcessingJob } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface VideoContextType {
  videos: VideoFile[];
  currentVideo: VideoFile | null;
  processingJobs: ProcessingJob[];
  addVideo: (file: File) => Promise<void>;
  setCurrentVideo: (video: VideoFile | null) => void;
  removeVideo: (id: string) => void;
  addProcessingJob: (video: VideoFile, operations: VideoOperation[]) => ProcessingJob;
  updateJobProgress: (id: string, progress: number) => void;
  completeJob: (id: string, outputUrl: string) => void;
  failJob: (id: string) => void;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const VideoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [currentVideo, setCurrentVideo] = useState<VideoFile | null>(null);
  const [processingJobs, setProcessingJobs] = useState<ProcessingJob[]>([]);

  const addVideo = useCallback(async (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const videoUrl = URL.createObjectURL(file);
      const videoElement = document.createElement('video');
      
      videoElement.onloadedmetadata = () => {
        const video: VideoFile = {
          id: uuidv4(),
          file,
          name: file.name,
          size: file.size,
          duration: videoElement.duration,
          thumbnail: '',
          url: videoUrl
        };
        
        setVideos(prev => [...prev, video]);
        setCurrentVideo(video);
        resolve(undefined);
      };
      
      videoElement.onerror = () => {
        reject(new Error('Failed to load video'));
      };
      
      videoElement.src = videoUrl;
    });
  }, []);

  const removeVideo = useCallback((id: string) => {
    setVideos(prev => {
      const video = prev.find(v => v.id === id);
      if (video?.url) {
        URL.revokeObjectURL(video.url);
      }
      return prev.filter(v => v.id !== id);
    });
    if (currentVideo?.id === id) {
      setCurrentVideo(null);
    }
  }, [currentVideo]);

  const addProcessingJob = useCallback((video: VideoFile, operations: VideoOperation[]): ProcessingJob => {
    const job: ProcessingJob = {
      id: uuidv4(),
      inputFile: video,
      operations,
      status: 'pending',
      progress: 0,
      createdAt: new Date()
    };
    setProcessingJobs(prev => [...prev, job]);
    return job;
  }, []);

  const updateJobProgress = useCallback((id: string, progress: number) => {
    setProcessingJobs(prev => prev.map(job => 
      job.id === id ? { ...job, progress, status: 'processing' as const } : job
    ));
  }, []);

  const completeJob = useCallback((id: string, outputUrl: string) => {
    setProcessingJobs(prev => prev.map(job => 
      job.id === id ? { ...job, status: 'completed' as const, progress: 100, outputUrl } : job
    ));
  }, []);

  const failJob = useCallback((id: string) => {
    setProcessingJobs(prev => prev.map(job => 
      job.id === id ? { ...job, status: 'failed' as const } : job
    ));
  }, []);

  return (
    <VideoContext.Provider value={{
      videos,
      currentVideo,
      processingJobs,
      addVideo,
      setCurrentVideo,
      removeVideo,
      addProcessingJob,
      updateJobProgress,
      completeJob,
      failJob
    }}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
};