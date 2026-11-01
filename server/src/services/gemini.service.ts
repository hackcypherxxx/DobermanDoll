// src/services/gemini.service.ts
import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env.js";
import { ProxyAgent, setGlobalDispatcher } from "undici";

// Configure proxy if PROXY_URL is set in .env
if (env.PROXY_URL) {
  const proxyAgent = new ProxyAgent(env.PROXY_URL);
  setGlobalDispatcher(proxyAgent);
  console.log(`✓ Gemini API routing through proxy: ${env.PROXY_URL}`);
}

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

export const geminiService = {
  async generateProductDescription(
    productName: string, 
    shortDescription: string, 
    imageUrl?: string
  ): Promise<string> {
    
    const prompt = `
      You are an expert copywriter and image analyst for "DreamBaby Silicone Nursery", a premium reborn baby doll store.
      
      Product Name: ${productName}
      Short Description: ${shortDescription}
      
      ${imageUrl ? "I have attached an image of the doll. Analyze the image carefully to extract visual details such as hair color, eye color, skin tone, expression, and outfit." : ""}
      
      Your task is to generate a luxurious, highly detailed product description that matches the image and the short description.
      
      Instructions:
      1. Format the output STRICTLY as valid HTML (use <h3>, <p>, <ul>, <li>, <strong>). Do NOT use Markdown.
      2. At the top, create an elegant opening paragraph that brings the doll to life.
      3. Create a section titled "✨ Product Details" and use a <ul> list to clearly state the core specs (Size, Weight, Gender, Age, Eyes, Skin Tone, Material, Hairstyle). Use the visual analysis from the image to fill these in accurately.
      4. Create a section called "🥇 About Silicone Baby" detailing Material and Safety (mentioning Platinum Liquid Silicone and being free from PVE).
      5. Create a section called "Advantages VS Vinyl Dolls" (full silicone construction vs hollow vinyl).
      6. Create a section called "🤍 Realistic Touch and Feel" (soft, huggable, realistic appearance).
      7. End with a warm, inviting conclusion.
      8. Only return the HTML. Do not wrap it in markdown blocks.
    `;

    try {
      const contents: any[] = [{ text: prompt }];

      if (imageUrl) {
        contents.push({
          fileData: {
            mimeType: "image/jpeg",
            fileUri: imageUrl,
          },
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: contents,
      });

      return response.text || "";
    } catch (error: any) {
      console.error("Gemini API Error Details:", error);
      throw new Error(`Failed to generate description: ${error.message || "Unknown error"}`);
    }
  }
};