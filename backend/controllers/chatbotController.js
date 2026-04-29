import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const chat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // Use current 2026 model names
    const modelNames = [
      "gemini-2.0-flash",        // Fast and stable (recommended)
      "gemini-2.0-flash-lite",   // Lightweight option
      "gemini-2.5-pro"           // Most powerful (may need higher quota)
    ];

    let result;
    let successModel = null;

    for (const modelName of modelNames) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        
        const prompt = `You are a friendly travel assistant for Travel World, a tour booking website.

Your role:
- Help users find tours and destinations
- Answer travel-related questions
- Provide travel tips and recommendations
- Be concise (2-3 sentences max)
- Be friendly and enthusiastic about travel

User asks: ${message}

Respond as a helpful travel assistant:`;

        result = await model.generateContent(prompt);
        successModel = modelName;
        console.log(`✅ Success with model: ${modelName}`);
        break;
      } catch (err) {
        console.log(`❌ Failed with model: ${modelName}`, err.message);
        continue;
      }
    }

    if (!result) {
      throw new Error("All models failed");
    }

    const response = result.response;
    const text = response.text();

    res.status(200).json({
      success: true,
      reply: text,
      model: successModel
    });
  } catch (err) {
    console.error("Chatbot error:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to get response",
      reply: "Sorry, I'm having trouble connecting right now. Please try again!",
    });
  }
};
