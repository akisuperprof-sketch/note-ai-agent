import { defineEventHandler, readBody } from 'h3';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default defineEventHandler(async (event) => {
    const { knowhow, strategy, settings } = await readBody(event);
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return { success: false, error: 'GEMINI_API_KEY not set' };

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = `
あなたはnote記事のタイトル作成の専門家です。
以下の情報を元に、読者を惹きつける魅力的なタイトル案を5つ提案してください。

【ノウハウ・一次情報】
${knowhow}

【戦略企画（わど式）】
- ターゲット: ${strategy?.target || '指定なし'}
- コンセプト: ${strategy?.concept || '指定なし'}
- 強み: ${strategy?.strength || '指定なし'}

【基本設定】
- 文体: ${settings?.style === 'polite' ? 'ですます調（丁寧）' : settings?.style === 'formal' ? 'である調（簡潔）' : 'フレンドリー'}
- 読者層: ${settings?.audience}

出力は以下のJSON形式のみで行ってください。余計な文字列は含めないでください。
{
  "titles": [
    "タイトル案1",
    "タイトル案2",
    "タイトル案3",
    "タイトル案4",
    "タイトル案5"
  ]
}
`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        // JSON部分だけ抽出（Markdownコードブロック除去）
        const jsonString = text.replace(/```json\n|\n```/g, '').trim();
        const parsed = JSON.parse(jsonString);
        return { success: true, titles: parsed.titles };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
});
