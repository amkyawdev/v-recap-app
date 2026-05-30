// Type definitions for V Recap App

export interface VideoFile {
  id: string;
  file: File;
  name: string;
  size: number;
  duration: number;
  thumbnail?: string;
  url: string;
}

export interface VideoOperation {
  type: 'trim' | 'scale' | 'fps' | 'rotate' | 'filter' | 'speed';
  params: Record<string, unknown>;
}

export interface ProcessingJob {
  id: string;
  inputFile: VideoFile;
  operations: VideoOperation[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  outputUrl?: string;
  createdAt: Date;
}

export interface EditingHistory {
  id: string;
  projectName: string;
  videoFile: VideoFile;
  operations: VideoOperation[];
  createdAt: Date;
  thumbnail: string;
}

export interface SubtitleCue {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  style?: SubtitleStyle;
}

export interface SubtitleStyle {
  fontFamily?: string;
  fontSize?: number;
  fontColor?: string;
  backgroundColor?: string;
  position?: 'top' | 'center' | 'bottom';
  bold?: boolean;
  italic?: boolean;
}

export interface TranslationResult {
  original: string;
  translated: string;
  sourceLang: string;
  targetLang: string;
}

export interface UserSettings {
  recapFolder: string;
  defaultQuality: 'low' | 'medium' | 'high';
  autoSave: boolean;
  language: string;
}