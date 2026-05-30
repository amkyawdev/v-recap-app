// API Configuration
// Note: In production, API keys should be stored securely and never exposed client-side

export const API_CONFIG = {
  gemini: {
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    apiKey: import.meta.env.VITE_GEMINI_API_KEY || ''
  },
  elevenlabs: {
    baseUrl: 'https://api.elevenlabs.io/v1',
    apiKey: import.meta.env.VITE_ELEVENLABS_API_KEY || ''
  },
  groq: {
    baseUrl: 'https://api.groq.com/openai/v1',
    apiKey: import.meta.env.VITE_GROQ_API_KEY || ''
  },
  claude: {
    baseUrl: 'https://api.anthropic.com/v1',
    apiKey: import.meta.env.VITE_CLAUDE_API_KEY || ''
  }
};

// Export for use in services
export default API_CONFIG;