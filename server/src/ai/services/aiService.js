
import { GoogleGenAI } from '@google/genai';

export const generateAIResponse = async (userMessage) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Gemini API key is missing.');
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: `
          You are ShopSmart AI, a friendly e-commerce shopping assistant.
          Help customers with shopping-related questions.
          Be clear, helpful and concise.
          Do not invent product prices, stock availability or order details.
          If you do not have reliable information, say so.
        `
      }
    });

    return response.text;

  } catch (error) {
    console.error('========== GEMINI ERROR ==========');
    console.error('Message:', error.message);
    console.error('Status:', error.status);
    console.error('Code:', error.code);
    console.error('===================================');

    throw error;
  }
};
