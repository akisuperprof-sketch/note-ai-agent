import { defineEventHandler, readBody } from 'h3';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default defineEventHandler(async (event) => {
  const { knowhow, strategy, settings } = await readBody(event) as any;
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    const debugKeys = Object.keys(process.env).filter(k => k.toLowerCase().includes('gemini') || k.toLowerCase().includes('api'));
    return { success: false, error: `GEMINI_API_KEY not set. Found similar keys: ${debugKeys.join(', ')}` };
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  const prompt = `
あなたはnote記事のタイトル作成の専門家です。
以下の情報を元に、読者を惹きつける魅力的なタイトル案を5つ提案してください。

【ノウハウ・一次情報】
${knowhow}

【戦略企画】
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

  async function generateWithModel(modelName: string) {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }

  // List of models to try in order of preference
  const modelsToTry = [
    'gemini-1.5-flash',
    'gemini-1.5-flash-001',
    'gemini-1.5-flash-002',
    'gemini-1.5-pro',
    'gemini-1.5-pro-001',
    'gemini-1.0-pro',
    'gemini-pro'
  ];

  let lastError = null;
  let text = '';

  for (const modelName of modelsToTry) {
    try {
      console.log(`Trying model: ${modelName}`);
      text = await generateWithModel(modelName);
      if (text) break; // Success!
    } catch (e: any) {
      console.warn(`Model ${modelName} failed:`, e.message);
      lastError = e;
      // Continue to next model
    }
  }

  if (!text && lastError) {
    throw new Error(`All models failed. Last error: ${lastError.message}. Accessing: v1beta API.`);
  }

  try {
    // JSON部分だけ抽出（Markdownコードブロック除去）
    const jsonString = text.replace(/```json\n?|\n?```/g, '').trim();
    const parsed = JSON.parse(jsonString);
    return { success: true, titles: parsed.titles };
  } catch (e: any) {
    return { success: false, error: e.message || 'Generation failed' };
  }
});
