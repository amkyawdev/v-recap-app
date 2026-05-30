import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { VideoFile, VideoOperation, ProcessingJob } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { videoProcessor } from '../services/video/processor';

interface VideoContextType {
  videos: VideoFile[];
  currentVideo: VideoFile | null;
  processingJobs: ProcessingJob[];
  isConverting: boolean;
  conversionProgress: number;
  errorMessage: string | null;
  addVideo: (file: File) => Promise<void>;
  setCurrentVideo: (video: VideoFile | null) => void;
  removeVideo: (id: string) => void;
  clearError: () => void;
  retryConversion: () => void;
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
  const [conversionProgress, setConversionProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const addVideo = useCallback(async (file: File): Promise<void> => {
    console.log('VideoContext: Adding video', file.name, file.type, file.size);
    
    // Clear previous error
    setErrorMessage(null);
    
    // Keep reference to file for blob URL
    const fileObj = file;
    
    // Create blob URL - this needs to stay valid
    const videoUrl = URL.createObjectURL(fileObj);
    console.log('VideoContext: Created blob URL:', videoUrl);
    
    // Create video object with the blob URL
    const newVideo: VideoFile = {
      id: uuidv4(),
      file: fileObj,
      name: fileObj.name,
      size: fileObj.size,
      duration: 0,
      thumbnail: '',
      url: videoUrl
    };
    
    console.log('VideoContext: Setting currentVideo with URL:', newVideo.url);
    
    // Set state immediately
    setVideos(prev => [...prev, newVideo]);
    setCurrentVideo(newVideo);
    
    console.log('VideoContext: Video added');
    
    // Don't wait for metadata - let the component handle it
    return Promise.resolve();
  }, []);

  // FFmpeg conversion function
  const performConversion = useCallback(async (file: File, originalUrl: string, originalId: string) => {
    setIsConverting(true);
    setConversionProgress(0);
    setErrorMessage(null);
    setPendingFile(file);

    try {
      const result = await videoProcessor.convertToMP4(file, (progress) => {
        console.log('Conversion progress:', progress + '%');
        setConversionProgress(progress);
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

        // Get metadata of converted video
        const testVideo = document.createElement('video');
        testVideo.preload = 'metadata';
        
        await new Promise<void>((res) => {
          testVideo.onloadedmetadata = () => {
            convertedVideo.duration = testVideo.duration;
            res();
          };
          testVideo.onerror = () => res();
          setTimeout(() => res(), 2000);
          testVideo.src = result.outputUrl!;
        });

        // Remove original and add converted
        setVideos(prev => prev.filter(v => v.id !== originalId).concat(convertedVideo));
        setCurrentVideo(convertedVideo);

        // Revoke original URL
        URL.revokeObjectURL(originalUrl);
        
        setConversionProgress(100);
        setPendingFile(null); // Clear on success
      } else {
        console.log('VideoContext: Conversion failed');
        setErrorMessage(result.error || 'Video format not supported. Please try MP4 format.');
        // Keep pendingFile for retry
      }
    } catch (err) {
      console.error('VideoContext: Conversion error', err);
      setErrorMessage('Failed to convert video. Please try a different format.');
      // Keep pendingFile for retry
    }

    setIsConverting(false);
    // Don't clear pendingFile on failure - needed for retry
  }, []);

  // Clear error message
  const clearError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  // Retry conversion with the same file
  const retryConversion = useCallback(() => {
    if (pendingFile) {
      const url = URL.createObjectURL(pendingFile);
      performConversion(pendingFile, url, currentVideo?.id || '');
    }
  }, [pendingFile, currentVideo, performConversion]);

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
      isConverting,
      conversionProgress,
      errorMessage,
      addVideo,
      setCurrentVideo,
      removeVideo,
      clearError,
      retryConversion,
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