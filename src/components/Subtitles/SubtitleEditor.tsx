import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit3, FiTrash2, FiPlus, FiClock, FiCheck, FiX } from 'react-icons/fi';
import { useSubtitles } from '../../contexts/SubtitleContext';
import { SubtitleCue } from '../../types';

export const SubtitleEditor: React.FC = () => {
  const { subtitles, updateSubtitle, removeSubtitle, addSubtitle, setCurrentSubtitle, currentSubtitle } = useSubtitles();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${ms.toString().padStart(3, '0')}`;
  };


  const startEditing = (subtitle: SubtitleCue) => {
    setEditingId(subtitle.id);
    setEditText(subtitle.text);
  };

  const saveEdit = () => {
    if (editingId) {
      updateSubtitle(editingId, { text: editText });
      setEditingId(null);
      setEditText('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <FiEdit3 className="text-accent-500" />
          Subtitle Editor
        </h3>
        <button
          onClick={() => addSubtitle(0, 5, 'New subtitle')}
          className="btn-secondary flex items-center gap-2 text-sm"
        >
          <FiPlus /> Add
        </button>
      </div>

      {/* Subtitle List */}
      <div className="space-y-2 max-h-96 overflow-y-auto no-scrollbar">
        <AnimatePresence>
          {subtitles.map((subtitle, index) => (
            <motion.div
              key={subtitle.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`card p-3 cursor-pointer transition-all ${
                currentSubtitle?.id === subtitle.id ? 'border-accent-500' : ''
              }`}
              onClick={() => setCurrentSubtitle(subtitle)}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/60">
                  {index + 1}
                </div>
                
                <div className="flex-1 min-w-0">
                  {editingId === subtitle.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="input-field text-sm resize-none"
                        rows={2}
                        autoFocus
                      />
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => setEditingId(null)} className="p-2 rounded-lg hover:bg-white/10">
                          <FiX className="text-white/60" />
                        </button>
                        <button onClick={saveEdit} className="p-2 rounded-lg bg-accent-500">
                          <FiCheck className="text-white" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-white font-medium truncate">{subtitle.text}</p>
                      <p className="text-xs text-white/50 mt-1 flex items-center gap-2">
                        <FiClock size={12} />
                        {formatTime(subtitle.startTime)} → {formatTime(subtitle.endTime)}
                      </p>
                    </>
                  )}
                </div>

                <div className="flex-shrink-0 flex gap-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); startEditing(subtitle); }}
                    className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                  >
                    <FiEdit3 size={16} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeSubtitle(subtitle.id); }}
                    className="p-2 rounded-lg hover:bg-red-500/20 text-white/60 hover:text-red-400 transition-colors"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {subtitles.length === 0 && (
        <div className="text-center py-8">
          <FiEdit3 className="text-4xl text-white/20 mx-auto mb-3" />
          <p className="text-white/50">No subtitles yet</p>
          <p className="text-sm text-white/30">Upload a subtitle file or add manually</p>
        </div>
      )}

      {/* Export */}
      {subtitles.length > 0 && (
        <div className="flex gap-2">
          <button className="btn-secondary flex-1 text-sm">
            Export SRT
          </button>
          <button className="btn-secondary flex-1 text-sm">
            Export VTT
          </button>
        </div>
      )}
    </div>
  );
};

export default SubtitleEditor;