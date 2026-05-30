import axios from 'axios';
import API_CONFIG from './config';

export interface TranslateRequest {
  text: string;
  sourceLang: string;
  targetLang: string;
}

export interface TranslateResponse {
  translatedText: string;
  detectedLanguage?: string;
}

export const geminiTranslate = async (request: TranslateRequest): Promise<TranslateResponse> => {
  const { text, sourceLang, targetLang } = request;
  
  // Simulated translation - in production, call actual Gemini API
  // This would connect to Gemini for translation services
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        translatedText: `[${targetLang.toUpperCase()}] ${text}`,
        detectedLanguage: sourceLang
      });
    }, 500);
  });
};

export const translateBatch = async (requests: TranslateRequest[]): Promise<TranslateResponse[]> => {
  // Process translations in batch
  const results = await Promise.all(
    requests.map(req => geminiTranslate(req))
  );
  return results;
};

export default {
  translate: geminiTranslate,
  translateBatch
};