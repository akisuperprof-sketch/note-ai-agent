import { defineEventHandler, readBody } from 'h3';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default defineEventHandler(async (event) => {
  const { knowhow, selectedTitle, settings, strategy } = await readBody(event) as any;
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    const debugKeys = Object.keys(process.env).filter(k => k.toLowerCase().includes('gemini') || k.toLowerCase().includes('api'));
    return { success: false, error: `GEMINI_API_KEY not set. Found similar keys: ${debugKeys.join(', ')}` };
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  const audienceMap: Record<string, string> = {
    beginner: '初心者向け',
    intermediate: '中級者向け',
    advanced: '専門家向け',
  };

  const prompt = `
あなたはベストセラー作家であり、noteで多くのファンを持つインフルエンサーです。
読者が最後まで一気に読み進めてしまうような、論理的かつ感情を揺さぶる記事構成を作成してください。

【タイトル】
${selectedTitle}

【ノウハウ・一次情報】
${knowhow}

【戦略企画】
- ターゲット: ${strategy?.target || '指定なし'}
- 記事コンセプト: ${strategy?.concept || '指定なし'}
- 記事の強み: ${strategy?.strength || '指定なし'}
- 構成指示: ${strategy?.structure || '指定なし'}
- その他: ${strategy?.otherInstructions || '指定なし'}

【基本設定】
- 文字数目安: ${settings?.wordCount}文字
- 読者層: ${audienceMap[settings?.audience] || settings?.audience || '指定なし'}

■構成の鉄則（note黄金比）
1. **導入（Hook）**: 読者の悩みに深く共感し、「この記事を読むメリット」を提示する。
2. **問題提起（Problem）**: なぜ今までうまくいかなかったのか、誤解や壁を指摘する。
3. **解決策（Solution/Core）**: ノウハウの核心を伝える。具体的で再現性があるように。
4. **実践・詳細（Details）**: ステップバイステップや具体例で、行動イメージを湧かせる。
5. **よくある質問（FAQ）**: 記事の内容に関連する、読者が抱きそうな疑問や不安を3〜5個挙げ、先回りして回答するQ&Aセクションを設ける。
6. **まとめ・CTA**: 読者の背中を押し、「スキ」や「フォロー」を促す、または次のアクションへ誘導する。

■作成ルール
- セクション（大見出しH2）は6〜9個程度。必要に応じて小見出し（H3）を使う。
- ノウハウに含まれる具体的な手順は必ず構成に組み込む。
- 読者が「自分ごと」として捉えられるような見出しの言葉選びをする。

出力は以下のJSON形式のみ。
{
  "sections": [
    { "level": 1, "heading": "はじめに：なぜ〇〇なのか？", "summary": "読者の悩みへの共感と記事のゴール提示" },
    { "level": 1, "heading": "多くの人が陥る罠", "summary": "従来の方法の限界と問題提起" },
    { "level": 1, "heading": "...", "summary": "..." },
    { "level": 1, "heading": "よくある質問", "summary": "Q: 初心者でもできますか？ A: はい、可能です... といったQ&A形式を含める" }
  ]
}
level 1 はH2、level 2 はH3。
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
    const jsonString = text.replace(/```json\n?|\n?```/g, '').trim();
    const parsed = JSON.parse(jsonString);
    return { success: true, outline: { sections: parsed.sections } };
  } catch (e: any) {
    return { success: false, error: e.message || 'Generation failed' };
  }
});
