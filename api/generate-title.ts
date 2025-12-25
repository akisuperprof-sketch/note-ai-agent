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

  const styleMap: Record<string, string> = {
    polite: '丁寧で落ち着いた（ですます調）',
    friendly: 'フレンドリーで親しみやすい',
    formal: '専門的で論理的（である調）',
  };
  const audienceMap: Record<string, string> = {
    beginner: '初心者向け',
    intermediate: '中級者向け',
    advanced: '専門家向け',
  };

  const prompt = `
あなたは月間100万PVを誇るカリスマnoteクリエイター兼プロの編集者です。
人々がついクリックしたくなる、SNSで拡散されやすい、心理的フックの効いたタイトルを作成してください。

【ノウハウ・一次情報】
${knowhow}

【戦略企画】
- ターゲット: ${strategy?.target || '指定なし'}
- コンセプト: ${strategy?.concept || '指定なし'}
- 強み: ${strategy?.strength || '指定なし'}

【基本設定】
- 文体: ${styleMap[settings?.style] || '指定なし'}
- 読者層: ${audienceMap[settings?.audience] || settings?.audience || '指定なし'}

【作成ルール】
1. 30〜35文字前後で、スマホで見た時に最適になるようにしてください。
2. 数字（「3つのコツ」「10倍」等）や、権威性、意外性、共感を巧みに混ぜてください。
3. 以下の5つの切り口でそれぞれ1つずつ提案してください。
   - 案1: 【SEO・検索流入型】「【2025年最新】」や隅付き括弧や具体的な年号を使い、検索されやすく権威ある形式にする
   - 案2: 【王道・ノウハウ型】メリットが直感的に伝わる
   - 案3: 【煽り・逆説型】常識を覆して興味を惹く
   - 案4: 【ストーリー・共感型】書き手の人間味が伝わる
   - 案5: 【トレンド・キャッチー型】SNSでの拡散を狙った短いフレーズ

出力は以下のJSON形式のみで行ってください。
{
  "titles": [
    "案1のタイトル",
    "案2のタイトル",
    "案3のタイトル",
    "案4のタイトル",
    "案5のタイトル"
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
    'gemini-2.0-flash-exp',
    'gemini-2.0-flash',
    'gemini-2.0-flash-001',
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
