import React, { useState } from 'react';

import { FiUpload, FiMusic } from 'react-icons/fi';

export const AudioUploader: React.FC = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [volume, setVolume] = useState(80);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
    }
  };

  return (
    <div className="card p-6 space-y-4">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        <FiMusic className="text-accent-500" />
        Audio Track
      </h3>

      {!audioFile ? (
        <label className="block cursor-pointer">
          <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-accent-500/50 transition-colors">
            <FiUpload className="text-3xl text-white/50 mx-auto mb-3" />
            <p className="text-white/70">Click to upload audio</p>
            <p className="text-sm text-white/40 mt-1">MP3, WAV, OGG supported</p>
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </label>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <FiMusic className="text-purple-400" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium truncate">{audioFile.name}</p>
              <p className="text-sm text-white/50">
                {(audioFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button 
              onClick={() => setAudioFile(null)}
              className="text-red-400 hover:text-red-300"
            >
              Remove
            </button>
          </div>

          <div>
            <label className="text-sm text-white/70 flex justify-between">
              <span>Volume</span>
              <span>{volume}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(parseInt(e.target.value))}
              className="w-full mt-2"
            />
          </div>

          <div className="flex gap-2">
            <button className="btn-secondary flex-1">Mute Original Audio</button>
            <button className="btn-secondary flex-1">Mix Audio</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioUploader;