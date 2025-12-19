import { defineEventHandler, readBody } from 'h3';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default defineEventHandler(async (event) => {
    const { knowhow, selectedTitle, outline, settings } = await readBody(event);
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return { success: false, error: 'GEMINI_API_KEY not set' };

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

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

【執筆ルール】
- 指定された構成に従って書いてください。
- 文体: ${settings?.style === 'polite' ? 'ですます調（親しみやすく丁寧）' : settings?.style === 'formal' ? 'である調（断定・簡潔）' : 'フレンドリーな口語調'}
- マークダウン形式で出力してください。
- 記事の最後には、SEO用のメタディスクリプション（120文字程度）を「---」で区切って追記してください。

出力形式:
(ここにマークダウン形式の本文)
---
(ここにメタディスクリプション)
`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

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
    } catch (e: any) {
        return { success: false, error: e.message };
    }
});
