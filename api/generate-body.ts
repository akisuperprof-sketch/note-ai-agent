import { defineEventHandler, readBody } from 'h3';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default defineEventHandler(async (event) => {
    try {
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



        const wordCount = settings?.wordCount || 2500;
        const prompt = `
あなたはプロのWebライター、そして熱狂的なファンを持つnoteクリエイターです。
以下の構成案に基づき、読者の心を動かし、行動を変える強力なnote記事を執筆してください。

【タイトル】
${selectedTitle}

【構成案】
${outlineText}

【元となるノウハウ】
${knowhow}

【戦略企画】
- ターゲット: ${strategy?.target || '指定なし'}
- 記事コンセプト: ${strategy?.concept || '指定なし'}
- 強み: ${strategy?.strength || '指定なし'}
- その他: ${strategy?.otherInstructions || '指定なし'}

【執筆ルール（重要）】
1. **「話し言葉」と「書き言葉」の絶妙なバランス**: 堅苦しくなりすぎず、かといって砕けすぎない、隣で優しく語りかけているような文体（ですます調）を基本としてください。
2. **リズムと余白と強調**: スマホでの閲覧を最優先し、2〜3行ごとにこまめに改行を入れてください。重要なポイントや単語は必ず**太字**で強調し、スキャンして読めるようにしてください。
3. **冒頭の鉄則**: 導入文は「共感（悩みへの寄り添い）」→「逆説（しかし、実は...）」→「解決策の提示（この記事で何が得られるか）」→「最後まで読んでほしい旨」の流れで書いてください。
4. **共感と人間味**: AIっぽさを完全に排除してください。「実は私もそうでした」「正直に言うと...」といった主観的なエピソードや感情語を適度に織り交ぜてください。
5. **ノウハウの具体化**: 抽象論で終わらせず、「明日から何ができるか」という具体的なアクションプランを提示してください。
6. **FAQセクション**: 構成に「よくある質問」などが含まれる場合は、Q&A形式（**Q: ...** \n **A: ...**）で具体的かつ丁寧に回答してください。
7. **CTA（行動喚起）**: 記事の最後には、「参考になったら『スキ』ボタンを押してもらえると励みになります！」「感想をコメントで教えてください」といった、note特有のコミュニケーションを促す一文を必ず入れてください。
8. **SEO**: 記事の最後には、検索エンジン向けのメタディスクリプション（120文字）を生成してください。
9. **ハッシュタグ**: noteで検索されやすい効果的なハッシュタグを3〜5個生成してください。（例: #note #副業）

10. **文字数確保**: ${wordCount}文字以上を目安に、具体例や補足説明を加えて内容を充実させてください。
11. **開始時の注意**: 返事は不要です。すぐに出力形式に従って書いてください。
12. **画像プロンプト**: 記事の内容にマッチする見出し画像の生成用プロンプトを**英語で**作成してください。抽象的な概念ではなく、具体的な被写体、背景、スタイル（例: digital art, cinematic lighting）を指定してください。

出力形式:
(ここにマークダウン形式の本文)
---
(ここにメタディスクリプション)
---
(ここにハッシュタグ)
---
(ここに画像生成用プロンプト [英語])
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


        // 本文とメタディスクリプション、ハッシュタグ、画像プロンプトの分離
        const parts = text.split('---');
        const markdown = parts[0].trim();
        let metaDescription = '';
        let hashtags: string[] = [];
        let imagePrompt = '';

        if (parts.length >= 4) {
            // Body --- Meta --- Hashtags --- ImagePrompt
            metaDescription = parts[1].trim();
            const tagsText = parts[2].trim();
            hashtags = tagsText.match(/#[^\s#]+/g) || [];
            imagePrompt = parts[3].trim();
        } else if (parts.length === 3) {
            // Body --- Meta --- Hashtags (fallback)
            metaDescription = parts[1].trim();
            const tagsText = parts[2].trim();
            hashtags = tagsText.match(/#[^\s#]+/g) || [];
        } else if (parts.length === 2) {
            // Body --- Meta (fallback)
            metaDescription = parts[1].trim();
        }


        // 画像生成用URL（Pollinations.aiを使用）
        // 生成されたプロンプトがあればそれを使い、なければタイトルをフォールバックとして使う（ただしタイトルは英語に翻訳されていないので精度は下がる）
        const finalPrompt = imagePrompt || `${selectedTitle} minimalist flat design illustration blog header soft colors`;
        const encodedPrompt = encodeURIComponent(finalPrompt);

        // ランダムなシードを追加して、キャッシュバスティングと毎回異なる画像を生成
        const seed = Math.floor(Math.random() * 1000000);
        const generatedImageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1280&height=720&nologo=true&seed=${seed}`;

        return {
            success: true,
            body: {
                markdown: markdown,
                metaDescription: metaDescription,
                hashtags: hashtags,
                actualWordCount: markdown.length,
                generatedImageUrl: generatedImageUrl
            }
        };
    } catch (e: any) {
        return { success: false, error: e.message || 'Generation failed' };
    }
});
