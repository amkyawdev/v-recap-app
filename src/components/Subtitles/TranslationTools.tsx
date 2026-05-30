import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiGlobe, FiEdit3, FiCheck, FiX, FiPlus, FiChevronDown } from 'react-icons/fi';
import { useSubtitles } from '../../contexts/SubtitleContext';

const languages = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'my', name: 'Myanmar', native: 'မြန်မာ' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'de', name: 'German', native: 'Deutsch' },
  { code: 'it', name: 'Italian', native: 'Italiano' },
  { code: 'pt', name: 'Portuguese', native: 'Português' },
  { code: 'zh', name: 'Chinese', native: '中文' },
  { code: 'ja', name: 'Japanese', native: '日本語' },
  { code: 'ko', name: 'Korean', native: '한국어' },
  { code: 'ar', name: 'Arabic', native: 'العربية' },
  { code: 'th', name: 'Thai', native: 'ไทย' },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt' },
  { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia' },
  { code: 'ms', name: 'Malay', native: 'Bahasa Melayu' },
  { code: 'ru', name: 'Russian', native: 'Русский' },
];

export const TranslationTools: React.FC = () => {
  const { subtitles, translateSubtitles } = useSubtitles();
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('my');
  const [isTranslating, setIsTranslating] = useState(false);
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [showTargetDropdown, setShowTargetDropdown] = useState(false);

  const handleTranslate = async () => {
    if (subtitles.length === 0) return;
    
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

  const sourceLanguage = languages.find(l => l.code === sourceLang);
  const targetLanguage = languages.find(l => l.code === targetLang);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        <FiGlobe className="text-accent-500" />
        Translation
      </h3>

      {/* Language Selection with Dropdowns */}
      <div className="grid grid-cols-2 gap-4">
        <div className="relative">
          <label className="text-sm text-white/70 mb-2 block">From</label>
          <button
            onClick={() => {
              setShowSourceDropdown(!showSourceDropdown);
              setShowTargetDropdown(false);
            }}
            className="w-full input-field flex items-center justify-between"
          >
            <span>{sourceLanguage?.native || 'Select'}</span>
            <FiChevronDown className={`transition-transform ${showSourceDropdown ? 'rotate-180' : ''}`} />
          </button>
          {showSourceDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-blue-900 border border-white/20 rounded-xl shadow-xl max-h-48 overflow-y-auto">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setSourceLang(lang.code);
                    setShowSourceDropdown(false);
                  }}
                  className={`w-full px-4 py-2 text-left hover:bg-white/10 flex items-center justify-between ${
                    sourceLang === lang.code ? 'bg-accent-500/20' : ''
                  }`}
                >
                  <span>{lang.native}</span>
                  <span className="text-xs text-white/50">{lang.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="relative">
          <label className="text-sm text-white/70 mb-2 block">To</label>
          <button
            onClick={() => {
              setShowTargetDropdown(!showTargetDropdown);
              setShowSourceDropdown(false);
            }}
            className="w-full input-field flex items-center justify-between"
          >
            <span>{targetLanguage?.native || 'Select'}</span>
            <FiChevronDown className={`transition-transform ${showTargetDropdown ? 'rotate-180' : ''}`} />
          </button>
          {showTargetDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-blue-900 border border-white/20 rounded-xl shadow-xl max-h-48 overflow-y-auto">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setTargetLang(lang.code);
                    setShowTargetDropdown(false);
                  }}
                  className={`w-full px-4 py-2 text-left hover:bg-white/10 flex items-center justify-between ${
                    targetLang === lang.code ? 'bg-accent-500/20' : ''
                  }`}
                >
                  <span>{lang.native}</span>
                  <span className="text-xs text-white/50">{lang.name}</span>
                </button>
              ))}
            </div>
          )}
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
          {['en', 'my', 'es', 'zh', 'ja', 'th'].map(code => {
            const lang = languages.find(l => l.code === code);
            return (
              <button
                key={code}
                onClick={() => {
                  setTargetLang(code);
                  if (subtitles.length > 0) handleTranslate();
                }}
                disabled={subtitles.length === 0}
                className="px-3 py-1.5 rounded-lg bg-white/10 text-white/70 text-sm hover:bg-white/20 transition-colors disabled:opacity-50"
              >
                → {lang?.native}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TranslationTools;