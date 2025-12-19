import { defineEventHandler, readBody } from 'h3';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default defineEventHandler(async (event) => {
    const { knowhow, selectedTitle, outline, settings, strategy } = await readBody(event) as any;
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
        const debugKeys = Object.keys(process.env).filter(k => k.toLowerCase().includes('gemini') || k.toLowerCase().includes('api'));
        return { success: false, error: `GEMINI_API_KEY not set. Found similar keys: ${debugKeys.join(', ')}` };
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // 構成をテキスト化
    const outlineText = outline.sections
        .map((s: any) => `${'#'.repeat(s.level + 1)} ${s.heading}\n(${s.summary})`)
        .join('\n\n');

    const prompt = `
あなたはプロのWebライターです。
以下の構成案に基づき、note記事の本文を執筆してください。

【タイトル】
${selectedTitle}

【構成案】
${outlineText}

【元となるノウハウ】
${knowhow}

【戦略企画】
- ターゲット: ${strategy?.target || '指定なし'}
- 記事コンセプト: ${strategy?.concept || '指定なし'}
- 記事の強み（差別化）: ${strategy?.strength || '指定なし'}
- その他の指示: ${strategy?.otherInstructions || '指定なし'}

【執筆ルール】
1. 指定された構成案に見出し構造を厳密に従ってください。
2. 「${strategy?.target || 'ターゲット'}」に向けて、専門用語を適切に噛み砕きながら分かりやすく解説してください。
3. 「${strategy?.concept || '記事コンセプト'}」を意識し、独自の視点や強みを盛り込んでください。
4. ノウハウ内に「Before→After」や「フック案」がある場合は、リード文（導入）でそれらを活用し、読者の興味を強く惹きつけてください。
5. ノウハウ内に「CTA」や「特典」の情報がある場合は、記事の締めくくり（まとめ）で自然な形で案内を入れてください。
6. 文体: ${settings?.style === 'polite' ? 'ですます調（親しみやすく丁寧）' : settings?.style === 'formal' ? 'である調（断定・簡潔）' : 'フレンドリーな口語調'}。時折、「正直なところ...」や「私の経験では...」といった人間味のある表現やエピソードを交え、AIっぽさを消してください。
7. マークダウン形式で出力してください。見出しは #, ##, ### を使用してください。
8. **記事の最後には、SEO用のメタディスクリプション（120文字程度）を「---」で区切って追記してください。**

出力形式:
(ここにマークダウン形式の本文)
---
(ここにメタディスクリプション)
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

    // 本文とメタディスクリプションの分離
    const parts = text.split('---');
    const markdown = parts[0].trim();
    const metaDescription = parts.length > 1 ? parts[parts.length - 1].trim() : '';

    return {
        success: true,
        body: {
            markdown: markdown,
            metaDescription: metaDescription,
            actualWordCount: markdown.length
        }
    };
};
});
