import React, { useState } from 'react';
import { FiUpload, FiFileText, FiX, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useSubtitles } from '../../contexts/SubtitleContext';
import { v4 as uuidv4 } from 'uuid';

interface UploadStatus {
  id: string;
  name: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  message?: string;
}

export const SubtitleUploader: React.FC = () => {
  const { importSubtitles } = useSubtitles();
  const [error, setError] = useState<string | null>(null);
  const [uploadStatuses, setUploadStatuses] = useState<UploadStatus[]>([]);
  const [showDropZone, setShowDropZone] = useState(true);

  const parseSRT = (content: string) => {
    const cues: Array<{ startTime: number; endTime: number; text: string }> = [];
    const blocks = content.split(/\n\n+/);
    
    for (const block of blocks) {
      const lines = block.trim().split('\n');
      if (lines.length < 2) continue;
      
      // Check if first line is a number
      const numLine = lines[0].trim();
      if (!/^\d+$/.test(numLine)) continue;
      
      // Find time line
      let timeLineIdx = -1;
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].includes('-->')) {
          timeLineIdx = i;
          break;
        }
      }
      
      if (timeLineIdx === -1) continue;
      
      const timeLine = lines[timeLineIdx];
      const timeMatch = timeLine.match(/(\d{2}):(\d{2}):(\d{2})[,.](\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2})[,.](\d{3})/);
      
      if (!timeMatch) continue;
      
      const startTime = parseInt(timeMatch[1]) * 3600 + parseInt(timeMatch[2]) * 60 + parseInt(timeMatch[3]) + parseInt(timeMatch[4]) / 1000;
      const endTime = parseInt(timeMatch[5]) * 3600 + parseInt(timeMatch[6]) * 60 + parseInt(timeMatch[7]) + parseInt(timeMatch[8]) / 1000;
      const text = lines.slice(timeLineIdx + 1).join('\n').trim();

      if (text) {
        cues.push({ startTime, endTime, text });
      }
    }
    
    return cues;
  };

  const parseVTT = (content: string) => {
    const cues: Array<{ startTime: number; endTime: number; text: string }> = [];
    const blocks = content.split(/\n\n+/);
    
    for (const block of blocks) {
      const lines = block.trim().split('\n');
      
      let timeLineIdx = -1;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('-->')) {
          timeLineIdx = i;
          break;
        }
      }
      
      if (timeLineIdx === -1) continue;
      
      const timeLine = lines[timeLineIdx];
      const timeMatch = timeLine.match(/(\d{2}):(\d{2}):(\d{2})[,.](\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2})[,.](\d{3})/);
      
      if (!timeMatch) {
        // Try shorter format MM:SS.mmm
        const shortMatch = timeLine.match(/(\d{2}):(\d{2})[,.](\d{3})\s*-->\s*(\d{2}):(\d{2})[,.](\d{3})/);
        if (shortMatch) {
          const startTime = parseInt(shortMatch[1]) * 60 + parseInt(shortMatch[2]) + parseInt(shortMatch[3]) / 1000;
          const endTime = parseInt(shortMatch[4]) * 60 + parseInt(shortMatch[5]) + parseInt(shortMatch[6]) / 1000;
          const text = lines.slice(timeLineIdx + 1).join('\n').trim();
          if (text) {
            cues.push({ startTime, endTime, text });
          }
        }
        continue;
      }
      
      const startTime = parseInt(timeMatch[1]) * 3600 + parseInt(timeMatch[2]) * 60 + parseInt(timeMatch[3]) + parseInt(timeMatch[4]) / 1000;
      const endTime = parseInt(timeMatch[5]) * 3600 + parseInt(timeMatch[6]) * 60 + parseInt(timeMatch[7]) + parseInt(timeMatch[8]) / 1000;
      const text = lines.slice(timeLineIdx + 1).join('\n').trim();

      if (text) {
        cues.push({ startTime, endTime, text });
      }
    }
    
    return cues;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const tempId = `upload-${Date.now()}-${Math.random()}`;
    
    setUploadStatuses(prev => [...prev, {
      id: tempId,
      name: file.name,
      progress: 0,
      status: 'uploading'
    }]);

    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        let cues;
        
        if (file.name.toLowerCase().endsWith('.srt')) {
          cues = parseSRT(content);
        } else if (file.name.toLowerCase().endsWith('.vtt')) {
          cues = parseVTT(content);
        } else {
          // Try to parse as plain text with time codes
          cues = parseSRT(content);
        }
        
        if (cues.length === 0) {
          setUploadStatuses(prev => prev.map(s => 
            s.id === tempId ? { ...s, status: 'error' as const, message: 'No valid subtitles found' } : s
          ));
          return;
        }

        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 20) {
          await new Promise(resolve => setTimeout(resolve, 50));
          setUploadStatuses(prev => prev.map(s => 
            s.id === tempId ? { ...s, progress } : s
          ));
        }
        
        importSubtitles(cues.map((cue) => ({
          id: uuidv4(),
          startTime: cue.startTime,
          endTime: cue.endTime,
          text: cue.text
        })));
        
        setUploadStatuses(prev => prev.map(s => 
          s.id === tempId ? { ...s, status: 'success' as const } : s
        ));

        // Remove success status after 2 seconds
        setTimeout(() => {
          setUploadStatuses(prev => prev.filter(s => s.id !== tempId));
        }, 2000);
        
        setShowDropZone(false);
        setError(null);
        
      } catch (err) {
        setUploadStatuses(prev => prev.map(s => 
          s.id === tempId ? { ...s, status: 'error' as const, message: 'Failed to parse file' } : s
        ));
      }
    };
    
    reader.onerror = () => {
      setUploadStatuses(prev => prev.map(s => 
        s.id === tempId ? { ...s, status: 'error' as const, message: 'Failed to read file' } : s
      ));
    };
    
    reader.readAsText(file);
    
    // Reset input
    e.target.value = '';
  };

  return (
    <div className="space-y-4">
      {/* Upload Button - Mobile Style */}
      <label className="block cursor-pointer w-full">
        <div className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-4 px-6 rounded-xl text-center transition-all duration-300 shadow-lg active:scale-95 flex items-center justify-center gap-3">
          <FiUpload className="text-xl" />
          <span className="text-base">Upload Subtitle File</span>
        </div>
        <input
          type="file"
          accept=".srt,.vtt,.txt"
          onChange={handleFileUpload}
          className="hidden"
        />
      </label>

      {/* File Formats Info */}
      <p className="text-white/40 text-xs text-center">
        SRT, VTT, or TXT formats supported
      </p>

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
                'bg-purple-500/20'
              }`}>
                {status.status === 'success' ? (
                  <FiCheck className="text-green-400" />
                ) : status.status === 'error' ? (
                  <FiAlertCircle className="text-red-400" />
                ) : (
                  <FiFileText className="text-purple-400" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-white font-medium truncate">{status.name}</p>
                {status.status === 'uploading' && (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-purple-500"
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
                  <p className="text-sm text-green-400 mt-1">Import complete!</p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/20 text-red-400 text-sm flex items-center gap-2">
          <FiX />
          {error}
        </div>
      )}

      {/* Quick Format Buttons */}
      <div className="flex gap-2">
        <label className="flex-1 cursor-pointer">
          <div className="btn-secondary text-center text-sm py-3">
            <FiFileText className="mr-2 inline" /> SRT
          </div>
          <input
            type="file"
            accept=".srt"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
        <label className="flex-1 cursor-pointer">
          <div className="btn-secondary text-center text-sm py-3">
            <FiFileText className="mr-2 inline" /> VTT
          </div>
          <input
            type="file"
            accept=".vtt"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};

export default SubtitleUploader;