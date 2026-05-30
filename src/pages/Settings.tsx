import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiKey, FiEye, FiEyeOff, FiSave, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { HamburgerMenu } from '../components/Common/HamburgerMenu';
import { SideMenu } from '../components/Common/SideMenu';
import { Button } from '../components/Common/Button';
import { DialogBox } from '../components/Common/DialogBox';

interface APIKey {
  id: string;
  name: string;
  key: string;
  provider: string;
  icon: string;
}

const defaultAPIs: APIKey[] = [
  { id: 'gemini', name: 'Google Gemini', key: '', provider: 'gemini', icon: '🤖' },
  { id: 'groq', name: 'Groq', key: '', provider: 'groq', icon: '⚡' },
  { id: 'claude', name: 'Claude (Anthropic)', key: '', provider: 'claude', icon: '🧠' },
  { id: 'elevenlabs', name: 'ElevenLabs', key: '', provider: 'elevenlabs', icon: '🎙️' },
];

const Settings: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [apiKeys, setApiKeys] = useState<APIKey[]>(defaultAPIs);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [tempKey, setTempKey] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const loadSavedKeys = () => {
    const saved = localStorage.getItem('vrecap_api_keys');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setApiKeys(prev => prev.map(api => ({
          ...api,
          key: parsed[api.provider] || ''
        })));
      } catch (e) {
        console.error('Failed to load API keys');
      }
    }
  };

  React.useEffect(() => {
    loadSavedKeys();
  }, []);

  const toggleShowKey = (id: string) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const startEditing = (api: APIKey) => {
    setEditingKey(api.id);
    setTempKey(api.key);
  };

  const saveKey = (id: string) => {
    setApiKeys(prev => prev.map(api => 
      api.id === id ? { ...api, key: tempKey } : api
    ));
    setEditingKey(null);
    setTempKey('');
  };

  const saveAllKeys = () => {
    setSaveStatus('saving');
    
    const keysToSave: Record<string, string> = {};
    apiKeys.forEach(api => {
      keysToSave[api.provider] = api.key;
    });
    
    localStorage.setItem('vrecap_api_keys', JSON.stringify(keysToSave));
    
    // Also save to environment variables for API calls
    Object.entries(keysToSave).forEach(([key, value]) => {
      if (value) {
        localStorage.setItem(`VITE_${key.toUpperCase()}_API_KEY`, value);
      }
    });
    
    setTimeout(() => {
      setSaveStatus('success');
      setShowSaveDialog(true);
      setTimeout(() => {
        setSaveStatus('idle');
        setShowSaveDialog(false);
      }, 2000);
    }, 500);
  };

  const maskKey = (key: string) => {
    if (!key) return '';
    if (key.length <= 8) return '•'.repeat(key.length);
    return key.substring(0, 4) + '•'.repeat(key.length - 8) + key.substring(key.length - 4);
  };

  return (
    <div className="min-h-screen">
      <HamburgerMenu onClick={() => setIsMenuOpen(true)} isOpen={isMenuOpen} />
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div className="pt-20 px-4 pb-8 max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-white/60">Manage your API keys and preferences</p>
        </motion.div>

        {/* API Keys Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FiKey className="text-accent-500" />
              API Keys
            </h2>
            <p className="text-sm text-white/50 mb-6">
              Enter your API keys to enable AI-powered features. Keys are stored locally in your browser.
            </p>

            <div className="space-y-4">
              {apiKeys.map((api) => (
                <div
                  key={api.id}
                  className="p-4 bg-white/5 rounded-xl border border-white/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{api.icon}</span>
                      <div>
                        <h3 className="font-medium text-white">{api.name}</h3>
                        <p className="text-xs text-white/50">{api.provider.toUpperCase()}</p>
                      </div>
                    </div>
                    {api.key && !editingKey && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs">
                        Configured
                      </span>
                    )}
                  </div>

                  <div className="mt-3">
                    {editingKey === api.id ? (
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <input
                            type={showKeys[api.id] ? 'text' : 'password'}
                            value={tempKey}
                            onChange={(e) => setTempKey(e.target.value)}
                            placeholder="Enter API key..."
                            className="input-field pr-10"
                          />
                          <button
                            onClick={() => toggleShowKey(api.id)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                          >
                            {showKeys[api.id] ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                          </button>
                        </div>
                        <button
                          onClick={() => saveKey(api.id)}
                          className="btn-primary px-4"
                        >
                          <FiCheck />
                        </button>
                        <button
                          onClick={() => setEditingKey(null)}
                          className="btn-secondary px-4"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 px-4 py-3 bg-white/5 rounded-lg text-white/70">
                          {api.key ? maskKey(api.key) : 'No API key configured'}
                        </div>
                        <button
                          onClick={() => startEditing(api)}
                          className="btn-secondary"
                        >
                          {api.key ? 'Update' : 'Add Key'}
                        </button>
                        {api.key && (
                          <button
                            onClick={() => toggleShowKey(api.id)}
                            className="p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                          >
                            {showKeys[api.id] ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
              <Button
                onClick={saveAllKeys}
                disabled={saveStatus === 'saving'}
                className="w-full"
                icon={saveStatus === 'saving' ? undefined : <FiSave />}
              >
                {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'success' ? 'Saved!' : 'Save All Keys'}
              </Button>
            </div>
          </div>

          {/* How to get API keys */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-white mb-4">How to Get API Keys</h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-xl">
                <h3 className="font-medium text-white mb-2">🤖 Google Gemini</h3>
                <p className="text-sm text-white/60 mb-2">Get your API key from Google AI Studio</p>
                <a 
                  href="https://aistudio.google.com/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent-400 hover:text-accent-300 text-sm"
                >
                  https://aistudio.google.com/apikey →
                </a>
              </div>

              <div className="p-4 bg-white/5 rounded-xl">
                <h3 className="font-medium text-white mb-2">⚡ Groq</h3>
                <p className="text-sm text-white/60 mb-2">Get your API key from Groq Console</p>
                <a 
                  href="https://console.groq.com/keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent-400 hover:text-accent-300 text-sm"
                >
                  https://console.groq.com/keys →
                </a>
              </div>

              <div className="p-4 bg-white/5 rounded-xl">
                <h3 className="font-medium text-white mb-2">🧠 Claude (Anthropic)</h3>
                <p className="text-sm text-white/60 mb-2">Get your API key from Anthropic Console</p>
                <a 
                  href="https://console.anthropic.com/settings/keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent-400 hover:text-accent-300 text-sm"
                >
                  https://console.anthropic.com/settings/keys →
                </a>
              </div>

              <div className="p-4 bg-white/5 rounded-xl">
                <h3 className="font-medium text-white mb-2">🎙️ ElevenLabs</h3>
                <p className="text-sm text-white/60 mb-2">Get your API key from ElevenLabs Dashboard</p>
                <a 
                  href="https://elevenlabs.io/app/api-key" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent-400 hover:text-accent-300 text-sm"
                >
                  https://elevenlabs.io/app/api-key →
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Success Dialog */}
        <DialogBox
          isOpen={showSaveDialog}
          onClose={() => setShowSaveDialog(false)}
          title="Success"
        >
          <div className="text-center py-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 rounded-full bg-green-500 mx-auto mb-4 flex items-center justify-center"
            >
              <FiCheck className="text-3xl text-white" />
            </motion.div>
            <p className="text-white/80">API keys saved successfully!</p>
          </div>
        </DialogBox>
      </div>
    </div>
  );
};

export default Settings;