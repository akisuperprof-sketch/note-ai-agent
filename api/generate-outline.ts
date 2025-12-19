import { defineEventHandler, readBody } from 'h3';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default defineEventHandler(async (event) => {
  const { knowhow, selectedTitle, settings } = await readBody(event) as any;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return { success: false, error: 'GEMINI_API_KEY not set' };

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
あなたはプロのWebライター、編集者です。
以下のタイトルとノウハウを元に、note記事の構成案（見出し構成）を作成してください。

【タイトル】
${selectedTitle}

【ノウハウ・一次情報】
${knowhow}

【設定】
- 文字数目安: ${settings?.wordCount}文字
- 読者層: ${settings?.audience}

論理的で読みやすく、読者の満足度が高まる構成にしてください。
セクション（大見出し）は5〜10個程度を目安にしてください。

出力は以下のJSON形式のみで行ってください。
{
  "sections": [
    { "level": 1, "heading": "はじめに", "summary": "記事の導入..." },
    { "level": 1, "heading": "見出し1", "summary": "セクションの概要..." },
    { "level": 2, "heading": "小見出し1-1", "summary": "詳細..." },
    { "level": 1, "heading": "まとめ", "summary": "記事の締めくくり..." }
  ]
}
level 1 はH2（大見出し）、level 2 はH3（小見出し）に相当します。
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonString = text.replace(/```json\n|\n```/g, '').trim();
    const parsed = JSON.parse(jsonString);
    return { success: true, outline: { sections: parsed.sections } };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
});
