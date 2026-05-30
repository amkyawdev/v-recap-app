import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SubtitleCue, SubtitleStyle, TranslationResult } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface SubtitleContextType {
  subtitles: SubtitleCue[];
  currentSubtitle: SubtitleCue | null;
  style: SubtitleStyle;
  subtitleStyle: SubtitleStyle; // Alias for compatibility
  addSubtitle: (start: number, end: number, text: string) => void;
  updateSubtitle: (id: string, updates: Partial<SubtitleCue>) => void;
  removeSubtitle: (id: string) => void;
  deleteSubtitle: (id: string) => void; // Alias for compatibility
  setCurrentSubtitle: (subtitle: SubtitleCue | null) => void;
  setStyle: (style: Partial<SubtitleStyle>) => void;
  importSubtitles: (cues: SubtitleCue[]) => void;
  translateSubtitles: (results: TranslationResult[]) => void;
  clearSubtitles: () => void;
}

const defaultStyle: SubtitleStyle = {
  fontFamily: 'Inter',
  fontSize: 24,
  fontColor: '#ffffff',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  position: 'bottom',
  bold: false,
  italic: false
};

const SubtitleContext = createContext<SubtitleContextType | undefined>(undefined);

export const SubtitleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [subtitles, setSubtitles] = useState<SubtitleCue[]>([]);
  const [currentSubtitle, setCurrentSubtitle] = useState<SubtitleCue | null>(null);
  const [style, setStyleState] = useState<SubtitleStyle>(defaultStyle);

  const addSubtitle = (start: number, end: number, text: string) => {
    const subtitle: SubtitleCue = {
      id: uuidv4(),
      startTime: start,
      endTime: end,
      text,
      style: { ...defaultStyle }
    };
    setSubtitles(prev => [...prev, subtitle].sort((a, b) => a.startTime - b.startTime));
  };

  const updateSubtitle = (id: string, updates: Partial<SubtitleCue>) => {
    setSubtitles(prev => prev.map(s => 
      s.id === id ? { ...s, ...updates } : s
    ));
  };

  const removeSubtitle = (id: string) => {
    setSubtitles(prev => prev.filter(s => s.id !== id));
    if (currentSubtitle?.id === id) {
      setCurrentSubtitle(null);
    }
  };

  const setStyle = (newStyle: Partial<SubtitleStyle>) => {
    setStyleState(prev => ({ ...prev, ...newStyle }));
  };

  const importSubtitles = (cues: SubtitleCue[]) => {
    setSubtitles(cues.map(c => ({ ...c, id: uuidv4() })));
  };

  const translateSubtitles = (results: TranslationResult[]) => {
    setSubtitles(prev => prev.map((subtitle) => {
      const result = results.find(r => r.original === subtitle.text);
      return result ? { ...subtitle, text: result.translated } : subtitle;
    }));
  };

  const clearSubtitles = () => {
    setSubtitles([]);
    setCurrentSubtitle(null);
  };

  return (
    <SubtitleContext.Provider value={{
      subtitles,
      currentSubtitle,
      style,
      subtitleStyle: style, // Alias for compatibility
      addSubtitle,
      updateSubtitle,
      removeSubtitle,
      deleteSubtitle: removeSubtitle, // Alias for compatibility
      setCurrentSubtitle,
      setStyle,
      importSubtitles,
      translateSubtitles,
      clearSubtitles
    }}>
      {children}
    </SubtitleContext.Provider>
  );
};

export const useSubtitles = () => {
  const context = useContext(SubtitleContext);
  if (!context) {
    throw new Error('useSubtitles must be used within a SubtitleProvider');
  }
  return context;
};