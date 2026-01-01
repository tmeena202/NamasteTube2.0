import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ Use the REACT_APP_ prefix
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

export const getGeminiResponse = async (prompt, timeout = 30000) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
    });

    // Add timeout to prevent hanging requests
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), timeout)
    );

    const result = await Promise.race([
      model.generateContent(prompt),
      timeoutPromise,
    ]);

    return result.response.text();
  } catch (error) {
    console.error("Gemini API error:", error);
    throw error;
  }
};
