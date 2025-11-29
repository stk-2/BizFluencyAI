
import { GoogleGenAI, Type } from "@google/genai";
import { CEFRLevel } from "../types";

const getClient = (apiKey?: string) => new GoogleGenAI({ apiKey: apiKey || process.env.API_KEY });

// --- Text & Roleplay ---

export const assessUserLevel = async (introduction: string, model: string = "gemini-2.5-flash", apiKey?: string): Promise<CEFRLevel> => {
  try {
    const ai = getClient(apiKey);
    const response = await ai.models.generateContent({
      model: model,
      contents: `Analyze the following English introduction text and estimate the CEFR level (A1-C2). 
      Return ONLY the level code (e.g., "B1"). Text: "${introduction}"`,
    });
    const text = response.text?.trim().toUpperCase();
    if (Object.values(CEFRLevel).includes(text as CEFRLevel)) {
      return text as CEFRLevel;
    }
    return CEFRLevel.B1; // Default fallback
  } catch (error) {
    console.error("Assessment error", error);
    return CEFRLevel.B1;
  }
};

export const getRoleplayResponse = async (
  history: { role: string; parts: { text: string }[] }[],
  message: string,
  systemInstruction: string,
  model: string = "gemini-2.5-flash",
  apiKey?: string
) => {
  const ai = getClient(apiKey);
  const chat = ai.chats.create({
    model: model,
    config: {
      systemInstruction: systemInstruction,
    },
    history: history,
  });

  const result = await chat.sendMessage({ message });
  return result.text;
};

export const getFeedbackOnMessage = async (message: string, context: string, model: string = "gemini-2.5-flash", apiKey?: string) => {
  const ai = getClient(apiKey);
  const response = await ai.models.generateContent({
    model: model,
    contents: `As an English coach, analyze this user sentence used in a ${context} context: "${message}".
    Provide a brief JSON response with "corrected" (natural business English version) and "tip" (brief explanation).
    Return JSON only.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          corrected: { type: Type.STRING },
          tip: { type: Type.STRING }
        }
      }
    }
  });
  return response.text;
};

// --- Document Review ---

export const reviewBusinessDocument = async (text: string, type: string, model: string = "gemini-3-pro-preview", apiKey?: string) => {
  const ai = getClient(apiKey);
  const response = await ai.models.generateContent({
    model: model, 
    contents: `Review the following business ${type}. Improve tone, grammar, and clarity for a professional setting.
    
    Original Text:
    ${text}
    
    Output structured markdown with:
    1. Revised Version
    2. Key Changes (Bullet points)
    3. Tone Analysis`,
  });
  return response.text;
};

// --- Multimodal ---

export const describeBusinessImage = async (base64Image: string, prompt: string, model: string = "gemini-2.5-flash-image", apiKey?: string) => {
  const ai = getClient(apiKey);
  const response = await ai.models.generateContent({
    model: model,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image
          }
        },
        { text: prompt }
      ]
    }
  });
  return response.text;
};
