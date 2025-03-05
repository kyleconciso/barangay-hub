const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");
const { AppError } = require('../utils/errorHandler');
const { getSettings } = require('../models/settings.model');

let genAI;

const initializeGemini = async () => {
    const settings = await getSettings();
    if (!settings.googleGeminiKey) {
        throw new AppError('Gemini API key not configured', 500);
    }
    genAI = new GoogleGenerativeAI(settings.googleGeminiKey);
};

const modelConfig = {
    model: "gemini-2.0-flash-lite",
    generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
    },
};

exports.generateContent = async (systemPrompt, userMessage) => {
    try {
        if (!genAI) await initializeGemini();
        
        const model = genAI.getGenerativeModel(modelConfig);
        const chatSession = model.startChat({
            history: [],
        });

        const prompt = `${systemPrompt}\n\n${userMessage}`;
        const result = await chatSession.sendMessage(prompt);
        return result.response.text();
    } catch (error) {
        throw new AppError("Error during Gemini content generation", 500, error);
    }
};