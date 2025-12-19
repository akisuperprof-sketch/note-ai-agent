
import dotenv from 'dotenv';
import fs from 'fs';

// Try loading from .env.local manually since we are running this script directly
const envLocalPath = '.env.local';
if (fs.existsSync(envLocalPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envLocalPath));
    if (envConfig.GEMINI_API_KEY) {
        console.log('✅ GEMINI_API_KEY found in .env.local');
        console.log('Key length:', envConfig.GEMINI_API_KEY.length);
    } else {
        console.log('❌ GEMINI_API_KEY is NOT defined in .env.local');
    }
} else {
    console.log('❌ .env.local file does not exist');
}
