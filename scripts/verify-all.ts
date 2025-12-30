
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load Environment Variables
const envLocalPath = path.resolve(__dirname, '../.env.local');
const envPath = path.resolve(__dirname, '../../.env');

if (fs.existsSync(envLocalPath)) {
    console.log(`[ENV] Loading .env.local from ${envLocalPath}`);
    dotenv.config({ path: envLocalPath });
} else if (fs.existsSync(envPath)) {
    console.log(`[ENV] Loading .env from ${envPath}`);
    dotenv.config({ path: envPath });
} else {
    console.warn('[ENV] No .env file found. Relying on system environment.');
}

const API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

console.log(`[ENV] API Key present: ${!!API_KEY}`);
if (API_KEY) {
    console.log(`[ENV] API Key length: ${API_KEY.length}`);
}

async function verifyGoogleGen() {
    console.log('\n--- Verifying Google Image Generation ---');
    if (!API_KEY) {
        console.warn('  [SKIP] No API Key. Skipping Google verification.');
        return;
    }

    const genAI = new GoogleGenerativeAI(API_KEY);

    // Models to test
    const googleModels = [
        'gemini-2.0-flash-exp',
        'imagen-3.0-generate-001',
        'gemini-3-pro-image-preview' // The user requested model
    ];

    for (const modelName of googleModels) {
        console.log(`\n  Testing Model: ${modelName}`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const prompt = "Draw a small red circle.";

            console.log('    > Sending request...');
            const result = await model.generateContent(prompt);
            const response = await result.response;

            if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
                const parts = response.candidates[0].content.parts;
                const imagePart = parts.find(p => p.inlineData);

                if (imagePart) {
                    console.log(`    [SUCCESS] Image generated! Mime: ${imagePart.inlineData?.mimeType}`);
                } else {
                    console.log(`    [INFO] Text response received: "${parts[0].text?.substring(0, 20)}..." (Not an image)`);
                }
            } else {
                console.log('    [WARN] No content in response.');
            }
        } catch (e: any) {
            console.error(`    [FAILED] ${e.message}`);
        }
    }
}

async function verifyPollinations() {
    console.log('\n--- Verifying Pollinations Image Generation ---');

    // Test the specific model requested via Pollinations URL
    const model = 'gemini-3-pro-image-preview';
    const prompt = 'minimalist apple logo';
    const encodedPrompt = encodeURIComponent(prompt);
    const seed = 12345;
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&nologo=true&seed=${seed}&model=${model}`;

    console.log(`  Target URL: ${url}`);

    try {
        console.log('    > Fetching headers...');
        const res = await fetch(url, { method: 'HEAD' });
        console.log(`    [STATUS] ${res.status} ${res.statusText}`);
        console.log(`    [TYPE] ${res.headers.get('content-type')}`);
        console.log(`    [SIZE] ${res.headers.get('content-length')} bytes`);

        if (res.ok) {
            console.log('    [SUCCESS] URL is valid and returns content.');
            if (res.headers.get('content-type')?.includes('image')) {
                console.log('    [VERIFIED] Content is an image.');
            }
        } else {
            console.warn('    [WARN] URL fetch failed.');
        }

    } catch (e: any) {
        console.error(`    [FAILED] Fetch error: ${e.message}`);
    }
}

async function main() {
    await verifyGoogleGen();
    await verifyPollinations();
}

main().catch(console.error);
