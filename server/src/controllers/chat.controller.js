const { getAllPages } = require('../models/page.model');
const { formatResponse } = require('../utils/responseFormatter');
const { AppError } = require('../utils/errorHandler');
const { generateContent } = require('../services/chat.service');

exports.chat = async (req, res, next) => {
    try {
        const { message } = req.body;
        if (!message) {
            throw new AppError("Message is required.", 400);
        }

        // Get last 10 articles
        const pages = await getAllPages();
        const articles = pages
            .filter(page => page.type === 'ARTICLE')
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(0, 10);
            
        const systemPrompt = articles.map(page => page.content).join('\n\n');

        const response = await generateContent(systemPrompt, message);
        return formatResponse(res, 200, { response }, 'Chat response generated successfully');
    } catch (error) {
        next(error);
    }
};