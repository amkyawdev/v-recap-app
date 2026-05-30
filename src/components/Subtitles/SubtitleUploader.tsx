import React, { useState } from 'react';
import { FiUpload, FiFileText, FiX, FiEdit3 } from 'react-icons/fi';
import { useSubtitles } from '../../contexts/SubtitleContext';

export const SubtitleUploader: React.FC = () => {
  const { importSubtitles } = useSubtitles();
  const [error, setError] = useState<string | null>(null);

  const parseSRT = (content: string) => {
    const cues = content.split(/\n\n+/);
    return cues.map(cue => {
      const lines = cue.split('\n');
      if (lines.length < 3) return null;
      
      const timeLine = lines[1];
      const timeMatch = timeLine.match(/(\d{2}):(\d{2}):(\d{2}),(\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2}),(\d{3})/);
      
      if (!timeMatch) return null;
      
      const startTime = parseInt(timeMatch[1]) * 3600 + parseInt(timeMatch[2]) * 60 + parseInt(timeMatch[3]) + parseInt(timeMatch[4]) / 1000;
      const endTime = parseInt(timeMatch[5]) * 3600 + parseInt(timeMatch[6]) * 60 + parseInt(timeMatch[7]) + parseInt(timeMatch[8]) / 1000;
      const text = lines.slice(2).join('\n');

      return { startTime, endTime, text };
    }).filter(Boolean);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const cues = parseSRT(content);
        
        if (cues.length === 0) {
          setError('Invalid subtitle file format');
          return;
        }

        importSubtitles(cues.map((cue, index) => ({
          id: `sub-${index}`,
          startTime: cue!.startTime,
          endTime: cue!.endTime,
          text: cue!.text
        })));
        
        setError(null);
      } catch (err) {
        setError('Failed to parse subtitle file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4">
      <label className="block cursor-pointer">
        <div className="card p-6 text-center hover:border-accent-500/50 transition-colors border-dashed">
          <FiUpload className="text-3xl text-accent-500 mx-auto mb-3" />
          <p className="text-white font-medium">Upload Subtitle File</p>
          <p className="text-sm text-white/50 mt-1">SRT, VTT, or TXT formats</p>
          <input
            type="file"
            accept=".srt,.vtt,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </label>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/20 text-red-400 text-sm flex items-center gap-2">
          <FiX />
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <button className="btn-secondary flex-1">
          <FiFileText className="mr-2" /> Import SRT
        </button>
        <button className="btn-secondary flex-1">
          <FiFileText className="mr-2" /> Import VTT
        </button>
      </div>
    </div>
  );
};

export default SubtitleUploader;