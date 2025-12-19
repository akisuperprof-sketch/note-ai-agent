
import { defineEventHandler } from 'h3';

export default defineEventHandler((event) => {
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    return {
        status: 'ok',
        hasKey: !!apiKey,
        envCheck: {
            hasGemini: !!process.env.GEMINI_API_KEY,
            hasViteGemini: !!process.env.VITE_GEMINI_API_KEY,
            nodeEnv: process.env.NODE_ENV
        }
    };
});
