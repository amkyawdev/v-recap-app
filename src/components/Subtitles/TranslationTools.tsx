import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiGlobe, FiEdit3, FiCheck, FiX, FiPlus } from 'react-icons/fi';
import { useSubtitles } from '../../contexts/SubtitleContext';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
];

export const TranslationTools: React.FC = () => {
  const { subtitles, translateSubtitles } = useSubtitles();
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [isTranslating, setIsTranslating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleTranslate = async () => {
    setIsTranslating(true);
    
    // Simulate translation API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real app, you'd call a translation API here
    const translations = subtitles.map(sub => ({
      original: sub.text,
      translated: `[${targetLang.toUpperCase()}] ${sub.text}`,
      sourceLang,
      targetLang
    }));
    
    translateSubtitles(translations);
    setIsTranslating(false);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        <FiGlobe className="text-accent-500" />
        Translation
      </h3>

      {/* Language Selection */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-white/70 mb-2 block">From</label>
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="input-field"
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-white/70 mb-2 block">To</label>
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="input-field"
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleTranslate}
          disabled={subtitles.length === 0 || isTranslating}
          className="btn-primary flex-1 flex items-center justify-center gap-2"
        >
          {isTranslating ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
              Translating...
            </>
          ) : (
            <>
              <FiGlobe />
              Translate All
            </>
          )}
        </button>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="btn-secondary"
        >
          Preview
        </button>
      </div>

      {/* Stats */}
      <div className="card p-4">
        <div className="flex justify-between text-sm">
          <span className="text-white/60">Subtitles to translate:</span>
          <span className="text-white font-medium">{subtitles.length}</span>
        </div>
      </div>

      {/* Quick Translate Buttons */}
      <div>
        <label className="text-sm text-white/70 mb-2 block">Quick Translate</label>
        <div className="flex flex-wrap gap-2">
          {['en', 'es', 'fr', 'de', 'zh', 'ja'].map(code => {
            const lang = languages.find(l => l.code === code);
            return (
              <button
                key={code}
                onClick={() => {
                  setTargetLang(code);
                  handleTranslate();
                }}
                disabled={subtitles.length === 0}
                className="px-3 py-1.5 rounded-lg bg-white/10 text-white/70 text-sm hover:bg-white/20 transition-colors disabled:opacity-50"
              >
                → {lang?.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TranslationTools;