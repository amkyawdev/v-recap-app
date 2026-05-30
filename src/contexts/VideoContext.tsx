import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { VideoFile, VideoOperation, ProcessingJob } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { videoProcessor } from '../services/video/processor';

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
  const [isConverting, setIsConverting] = useState(false);

  const addVideo = useCallback(async (file: File): Promise<void> => {
    console.log('VideoContext: Adding video', file.name, file.type, file.size);
    
    const videoUrl = URL.createObjectURL(file);
    
    // Create video object immediately
    const newVideo: VideoFile = {
      id: uuidv4(),
      file,
      name: file.name,
      size: file.size,
      duration: 0,
      thumbnail: '',
      url: videoUrl
    };
    
    console.log('VideoContext: Setting state with new video');
    
    // Set state immediately
    setVideos(prev => [...prev, newVideo]);
    setCurrentVideo(newVideo);
    
    // Check if we can get metadata (this will trigger error if codec not supported)
    const testVideo = document.createElement('video');
    testVideo.preload = 'metadata';
    testVideo.muted = true;
    
    return new Promise((resolve) => {
      testVideo.onloadedmetadata = () => {
        console.log('VideoContext: Metadata loaded, duration:', testVideo.duration);
        setCurrentVideo(prev => prev ? { ...prev, duration: testVideo.duration } : null);
        resolve();
      };
      
      testVideo.onerror = async () => {
        console.log('VideoContext: Codec not supported, will convert with FFmpeg');
        
        // Try to convert with FFmpeg
        setIsConverting(true);
        
        try {
          const result = await videoProcessor.convertToMP4(file, (progress) => {
            console.log('Conversion progress:', progress + '%');
          });
          
          if (result.success && result.outputUrl) {
            console.log('VideoContext: Conversion successful');
            
            const convertedVideo: VideoFile = {
              id: uuidv4(),
              file,
              name: file.name.replace(/\.[^.]+$/, '_converted.mp4'),
              size: result.outputBlob?.size || 0,
              duration: 0,
              thumbnail: '',
              url: result.outputUrl
            };
            
            // Remove original and add converted
            setVideos(prev => prev.filter(v => v.id !== newVideo.id).concat(convertedVideo));
            setCurrentVideo(convertedVideo);
            
            // Revoke original URL
            URL.revokeObjectURL(videoUrl);
          } else {
            console.log('VideoContext: Conversion failed, keeping original');
          }
        } catch (err) {
          console.error('VideoContext: Conversion error', err);
        }
        
        setIsConverting(false);
        resolve();
      };
      
      // Timeout after 2 seconds
      setTimeout(() => {
        console.log('VideoContext: Timeout, resolving');
        resolve();
      }, 2000);
      
      testVideo.src = videoUrl;
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