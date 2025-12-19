
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) { console.error('API KEY REQUIRED'); process.exit(1); }

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

async function testTitleGeneration() {
    console.log('--- Testing Title Generation ---');
    const knowhow = `「ポモドーロ・テクニック」を独自に改良した「50分作業・10分休憩」のサイクル。従来の25分では深い集中に入りきれないが、50分ならフロー状態を維持できる。休憩中はスマホを見ず、ストレッチや遠くを見ることで脳疲労を回復させる。これを午前中に3セット行うだけで、1日の重要タスクの8割が完了する。`;
    const strategy = { target: 'デスクワーク中心のビジネスマン', concept: '科学的根拠に基づいた最強の時間術', strength: '実体験に基づく独自理論' };
    const settings = { style: 'polite', audience: 'beginner' };

    const prompt = `
あなたはnote記事のタイトル作成の専門家です。
以下の情報を元に、読者を惹きつける魅力的なタイトル案を5つ提案してください。
【ノウハウ・一次情報】
${knowhow}
【戦略企画（わど式）】
- ターゲット: ${strategy.target}
- コンセプト: ${strategy.concept}
- 強み: ${strategy.strength}
【基本設定】
- 文体: ですます調（丁寧）
- 読者層: 初心者

出力は以下のJSON形式のみで行ってください。
{ "titles": ["...", "..."] }
`;

    try {
        const result = await model.generateContent(prompt);
        console.log(result.response.text());
    } catch (e) {
        console.error(e);
    }
}

testTitleGeneration();
