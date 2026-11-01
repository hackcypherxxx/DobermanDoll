import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function testGemini() {
  console.log("Testing connection to Gemini API...");
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash", 
      contents: "Say 'Connection Successful!' in exactly those words.",
    });
    console.log("✅ SUCCESS:", response.text);
  } catch (error) {
    console.error("❌ FAILED:", error.message);
  }
}

testGemini();
