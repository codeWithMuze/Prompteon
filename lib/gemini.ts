import { GoogleGenAI, Type } from "@google/genai";
import { PromptMode } from "../types";

export const analyzePromptServer = async (prompt: string, mode: PromptMode) => {
  // Always initialize inside the function to ensure the freshest API key context in serverless environments
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const FORGE_SYSTEM_INSTRUCTION = `You are the PromptForge Neural Engine. 
Audit raw user input and reconstruct it into a high-performance "Forged Output".
Return response in strictly valid JSON format.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `[Mode: ${mode}]\nForge the following Prompt:\n${prompt}`,
    config: {
      systemInstruction: FORGE_SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          difficulty: { type: Type.STRING },
          useCase: { type: Type.STRING },
          detailedAnalysis: { type: Type.STRING },
          metrics: {
            type: Type.OBJECT,
            properties: {
              clarity: { type: Type.NUMBER },
              specificity: { type: Type.NUMBER },
              context: { type: Type.NUMBER },
              goalOrientation: { type: Type.NUMBER },
              structure: { type: Type.NUMBER },
              constraints: { type: Type.NUMBER }
            },
            required: ['clarity', 'specificity', 'context', 'goalOrientation', 'structure', 'constraints']
          },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
          improvedPrompt: { type: Type.STRING }
        },
        required: ['score', 'difficulty', 'useCase', 'detailedAnalysis', 'metrics', 'strengths', 'improvements', 'improvedPrompt']
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("The Forge failed to respond.");
  
  return JSON.parse(text);
};