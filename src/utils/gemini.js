import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ Use the REACT_APP_ prefix
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

export const getGeminiResponse = async (prompt) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
  });

  const result = await model.generateContent(prompt);
  console.log(result);

  return result.response.text();
};
