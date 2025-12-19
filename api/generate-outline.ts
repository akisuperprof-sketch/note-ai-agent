import { defineEventHandler, readBody } from 'h3';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default defineEventHandler(async (event) => {
  const { knowhow, selectedTitle, settings, strategy } = await readBody(event) as any;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return { success: false, error: 'GEMINI_API_KEY not set' };

  const genAI = new GoogleGenerativeAI(apiKey);

  const prompt = `
あなたはプロのWebライター、編集者です。
以下のタイトルと情報を元に、note記事の構成案（見出し構成）を作成してください。

【タイトル】
${selectedTitle}

【ノウハウ・一次情報】
${knowhow}

【戦略企画】
- ターゲット: ${strategy?.target || '指定なし'}
- 記事コンセプト: ${strategy?.concept || '指定なし'}
- 記事の強み（差別化）: ${strategy?.strength || '指定なし'}
- 記事構成の指示: ${strategy?.structure || '指定なし'}
- その他の指示: ${strategy?.otherInstructions || '指定なし'}

【基本設定】
- 文字数目安: ${settings?.wordCount}文字
- 読者層: ${settings?.audience}

■作成ルール
1. 「${strategy?.target || 'ターゲット'}」の悩みを解決し、読者が行動したくなる流れを作ってください。
2. 「${strategy?.concept || '記事コンセプト'}」を軸に、独自の強みを活かした構成にしてください。
3. 指定された「記事構成の指示」があれば、それを優先的に反映してください。
4. ノウハウ内に「中身の骨子」や「ステップ」、「Day1...Day7」などの具体的な流れがある場合は、それを各セクション（大見出し）として忠実に採用してください。
5. 論理的で読みやすく、読者の満足度が高まる構成にしてください。
6. 記事の後半には、読者の疑問を解消する「FAQ（よくある質問）」セクションや、行動を促す「特典・CTA（まとめ）」セクションを含めることを積極的に検討してください。
7. セクション（大見出し）は5〜10個程度を目安にしてください。

出力は以下のJSON形式のみで行ってください。
{
  "sections": [
    { "level": 1, "heading": "はじめに", "summary": "記事の導入..." },
    { "level": 1, "heading": "見出し1", "summary": "セクションの概要..." },
    { "level": 2, "heading": "小見出し1-1", "summary": "詳細..." },
    { "level": 1, "heading": "FAQ / よくある質問", "summary": "読者の疑問に答える..." },
    { "level": 1, "heading": "まとめ / 特典配布", "summary": "記事の締めくくりとCTA..." }
  ]
}
level 1 はH2（大見出し）、level 2 はH3（小見出し）に相当します。
`;

  async function generateWithModel(modelName: string) {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }

  try {
    let text = '';
    try {
      text = await generateWithModel('gemini-1.5-flash');
    } catch (e: any) {
      console.warn('gemini-1.5-flash failed, trying gemini-pro', e.message);
      text = await generateWithModel('gemini-pro');
    }

    const jsonString = text.replace(/```json\n?|\n?```/g, '').trim();
    const parsed = JSON.parse(jsonString);
    return { success: true, outline: { sections: parsed.sections } };
  } catch (e: any) {
    return { success: false, error: e.message || 'Generation failed' };
  }
});
