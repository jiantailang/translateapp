import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';

const apiKey = process.env.API_KEY;
// Initialize with empty key if process.env is missing to prevent crash on load, 
// though actual calls will fail if key is missing.
const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key' });

export const streamTranslation = async (
  text: string,
  targetLanguage: string,
  customRules: string, // New parameter for user-defined rules
  onChunk: (text: string) => void
): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  try {
    const model = 'gemini-3-flash-preview'; 
    
    // Construct the prompt with optional custom rules
    let prompt = "";
    
    if (customRules && customRules.trim()) {
      prompt += `[IMPORTANT INSTRUCTIONS & TERMINOLOGY]\nFollow these specific rules provided by the user:\n${customRules}\n\n`;
      prompt += `--------------------------------\n\n`;
    }

    prompt += `Translate the following text into ${targetLanguage}:\n\n${text}`;

    const responseStream = await ai.models.generateContentStream({
      model: model,
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.3,
      },
    });

    let fullText = '';
    for await (const chunk of responseStream) {
      const chunkText = chunk.text;
      if (chunkText) {
        fullText += chunkText;
        onChunk(fullText);
      }
    }
    return fullText;

  } catch (error) {
    console.error("Translation error:", error);
    throw error;
  }
};