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
あなたは世界トップクラスのコピーライター兼note編集長です。
以下の記事に向けた、思わずクリックせずにはいられない「最強のタイトル」を5つ考案してください。
ありきたりなタイトルは不要です。読者の感情を揺さぶり、行動させる言葉を選んでください。

【ノウハウ・一次情報】
${knowhow}

【戦略企画・ターゲット】
- ターゲット: ${strategy?.target || '指定なし'}
- コンセプト: ${strategy?.concept || '指定なし'}
- 記事の強み(USP): ${strategy?.strength || '指定なし'}

【基本設定】
- 文体: ${styleMap[settings?.style] || '指定なし'}
- 読者層: ${audienceMap[settings?.audience] || settings?.audience || '指定なし'}

【タイトル生成の絶対ルール - コピーライティング技術の適用】
以下の5つの異なるアプローチで、それぞれ最高傑作を1つずつ作成してください。
※「30文字〜40文字」を目安に、スマホで見やすい長さに収めること。
※単なる説明ではなく、「読みたくなる」キャッチコピーとして仕上げること。

パターン1：【数字と具体性】（数字マジック）
具体的な数字を使って信頼性とインパクトを与える。
例：「たった3日で」「売上10倍」「9割が知らない」など、数字をフックにする。

パターン2：【疑問と問いかけ】（当事者意識）
読者に問いかけることで「自分のことだ」と思わせる。または常識への疑義を投げかける。
例：「まだ〜しているのですか？」「なぜ〜なのか？」「あなたは大丈夫？」

パターン3：【意外性と好奇心】（常識の破壊/GDTの法則）
常識を否定したり、秘密を明かすような表現で「知りたい」欲求（Curiosity）を強く刺激する。逆説的なアプローチも有効。
例：「実は〜だった」「〜してはいけない」「プロは〜しない」「悪用厳禁」

パターン4：【ベネフィット直球】（得られる未来/快楽と苦痛）
この記事を読むことで得られる利益（快楽）や、避けられる損失（痛み）を明確かつ魅力的に提示する。
例：「〜するだけで」「〜から解放される」「一生使える」「誰でも簡単に」

パターン5：【権威性とトレンド】（情報の信頼度/SEO）
【2025年最新】【完全保存版】などの隅付き括弧で目を引いたり、プロの視点やトレンド性を強調する。検索流入も意識したキーワード配置にする。

【禁止事項】
・抽象的な表現（「いろいろな」「たくさんの」など）は避ける。
・AIっぽい堅苦しい表現は避け、人間味のある言葉を選ぶ。
・5つのパターンの語尾や構成が似通らないようにする。全く違う角度から切り込むこと。

出力は以下のJSON形式のみで行ってください。
{
  "titles": [
    "パターン1のタイトル",
    "パターン2のタイトル",
    "パターン3のタイトル",
    "パターン4のタイトル",
    "パターン5のタイトル"
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
