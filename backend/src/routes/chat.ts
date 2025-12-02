import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

router.post('/', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, message: 'Message is required' });
        }

        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
            return res.status(500).json({
                success: false,
                message: 'Gemini API Key is not configured in the backend.'
            });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        res.json({
            success: true,
            reply: text,
        });
    } catch (error: any) {
        console.error('Gemini API Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate response from AI',
            error: error.message,
        });
    }
});

export default router;
