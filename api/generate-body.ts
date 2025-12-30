import { defineEventHandler, readBody } from 'h3';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default defineEventHandler(async (event) => {

    try {
        const { knowhow, selectedTitle, outline, settings, strategy, referenceImage } = await readBody(event) as any;
        const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
            const debugKeys = Object.keys(process.env).filter(k => k.toLowerCase().includes('gemini') || k.toLowerCase().includes('api'));
            return { success: false, error: `GEMINI_API_KEY not set. Found similar keys: ${debugKeys.join(', ')}` };
        }


        const genAI = new GoogleGenerativeAI(apiKey);

        // 参照画像がある場合、その特徴を抽出する
        let referenceDescription = '';
        if (referenceImage) {
            try {
                console.log('Analyzing reference image...');
                const visionModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
                const base64Data = referenceImage.split(',')[1];
                const mimeType = referenceImage.split(';')[0].split(':')[1];

                const imageParts = [{
                    inlineData: {
                        data: base64Data,
                        mimeType: mimeType
                    }
                }];



                const result = await visionModel.generateContent([
                    "You are an expert prompt engineer for Stable Diffusion. Analyze this image and generate a comma-separated list of style keywords to recreate exactly this art style. Focus on: line weight (e.g., thick outlines, bold lines), coloring (e.g., flat color, pastel, cel shading), medium (e.g., vector art, sticker illustration, digital drawing), and vibe (e.g., kawaii, minimalist, simple). Do not describe the subject, ONLY the style keywords.",
                    ...imageParts
                ]);
                referenceDescription = result.response.text();
                console.log('Reference image description:', referenceDescription);
            } catch (e) {
                console.error('Failed to analyze reference image:', e);
            }
        }

        // 構成をテキスト化
        const outlineText = outline.sections
            .map((s: any) => `${'#'.repeat(s.level + 1)} ${s.heading}\n(${s.summary})`)
            .join('\n\n');




        // 参照画像の特徴があれば、それをプロンプトに追加して、スタイルやキャラクターを反映させる
        let referenceInstruction = '';
        if (referenceDescription) {
            referenceInstruction = `ユーザーは参照画像（キャラクターやスタイル）を提供しています。この画像の特徴（"${referenceDescription}"）を**必ず**維持し、それをベースにした画像プロンプトを作成してください。新しい要素を追加しても良いですが、元のスタイルやキャラクター性は崩さないでください。`;
        }

        // Helper function to create safe Pollinations URL
        const createPollinationsUrl = (prompt: string, refDesc: string, isEyecatch: boolean = false) => {
            let safeSubject = prompt.replace(/photorealistic|realistic|4k|photo|photography|cinematic/gi, "");
            if (!safeSubject) safeSubject = selectedTitle;

            // Sanitize
            const cleanSubject = safeSubject.replace(/[\r\n]+/g, " ").slice(0, 100);
            const cleanDescription = refDesc.replace(/[\r\n]+/g, " ").slice(0, 300);

            // Construct prompt
            // Eyecatch: minimal, simple background
            // Inline: character focused, action oriented
            let mixPrompt = '';
            if (isEyecatch) {
                mixPrompt = `(illustration, vector art, flat design:1.6), ${cleanDescription}, ${cleanSubject}, (thick outlines, bold lines:1.4), simple background, no photorealistic, no 3d rendering, no shading`;
            } else {
                mixPrompt = `(illustration, vector art, flat design:1.6), ${cleanDescription}, ${cleanSubject}, (thick outlines, bold lines:1.4), white background, character focus, no text, no photorealistic, no 3d`;
            }

            const encodedPrompt = encodeURIComponent(mixPrompt);
            const seed = Math.floor(Math.random() * 1000000);
            return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1280&height=720&nologo=true&seed=${seed}&model=flux`;
        };

        const wordCount = settings?.wordCount || 2500;

        const prompt = `
あなたはプロのWebライター、そして熱狂的なファンを持つnoteクリエイターです。
今回は「自分の内面を曝け出すような人間味」と「読者への深い共感」を武器に、読者の人生を少しでも前に進めるような力強い記事を書いてください。

【タイトル】
${selectedTitle}

【構成案】
${outlineText}

【元となるノウハウ・入力データ】
${knowhow}

【戦略企画】
- ターゲット: ${strategy?.target || '指定なし'}
- 記事コンセプト: ${strategy?.concept || '指定なし'}
- 強み: ${strategy?.strength || '指定なし'}
- その他: ${strategy?.otherInstructions || '指定なし'}

【執筆ルール（最重要・厳守）】
以下のルールを完璧に守ってください。

**【3-1. 人間味と体験談（最重要）】**
*   **「正直なところ」「実は私自身も」「〜と感じました」**といったフレーズを使い、あなたの（架空でも良いので）具体的な失敗談、苦労話、感動した瞬間を各セクションに必ず盛り込んでください。
*   AIのような無機質な解説は禁止です。あなたの「声」が聞こえるような、体温のある文章を書いてください。
*   読者に「私のことを分かってくれている」と思わせるような、深い共感を示してください。

**【3-2. 構成とボリューム】**
*   **見出し構成**: H2見出しの下には必ず「リード文（導入）」を書き、その後にH3見出しで詳細を展開してください。
*   **具体性**: 抽象的な説明で終わらせず、具体的なツール名（入力データにある場合）、具体的な手順、具体的な数字を使って解説してください。
*   **文字数**: 目標文字数 **${wordCount}文字** を目指してください。そのためには、一つのトピックを深く掘り下げ、多角的な視点（メリット、デメリット、活用例、体験談）から語る必要があります。あっさり終わらせないでください。
*   **FAQ**: 記事の最後に、読者が抱きそうな疑問に答える「FAQ」セクション（Q&A形式で4〜5個）を必ず追加してください。

**【3-3. 文体と読みやすさ】**
*   **基本文体**: 丁寧で落ち着いた「です・ます調」（設定：${settings?.style || 'polite'}）。
*   **段落**: 3〜5文ごとに改行と空行を入れ、読みやすいリズムを作ってください。
*   **禁止**: 1文ごとの改行、過度な絵文字、煽り表現（「神〜」「激変」など）。あくまで知的に、誠実に語りかけてください。

**【3-4. 記事構成フロー】**
1.  **導入**: 読者の悩みに寄り添い、「この記事を読むとどうなるか」を提示。
2.  **本論**: H2 -> H3 の構造で、体験談を交えながら深く解説。
3.  **FAQ**: 疑問への回答。
4.  **結び**: まとめと、温かいメッセージ。
5.  **メタ情報**: SEO用のメタディスクリプションとハッシュタグ。

**【3-5. ツール名・固有名詞の扱い】**
*   入力データにツール名（例: aquavoice, voicy, Obsidian など）が含まれている場合は、それらを必ず文脈の中で自然に使用し、具体的な活用法を示してください。

12. **画像プロンプト作成**:
    *   **アイキャッチ**: 記事のタイトル「${selectedTitle}」を表現する画像のプロンプトを**英語で**作成。
    *   **挿絵**: 記事内の各H2見出し（FAQやまとめを除く主要な章）の内容を表す挿絵のプロンプトを**英語で**作成。「H2見出し: プロンプト」の形式で1行ずつ記述。
    *   **必須**: "minimalist, flat design, vector art, soft colors, high quality" のようなスタイル単語を含める。${referenceInstruction ? '参照画像の特徴を反映してください。' : ''}
    *   **禁止**: 文章（Sentence）にしないこと。文字要素を含めないこと。

出力形式:
(ここにマークダウン形式の本文)
[[SECTION_DIVIDER]]
(ここにメタディスクリプション)
[[SECTION_DIVIDER]]
(ここにハッシュタグ)
[[SECTION_DIVIDER]]
(ここにアイキャッチ画像プロンプト [英語])
[[SECTION_DIVIDER]]
(ここに挿絵画像プロンプト [英語・各行])
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
        const parts = text.split('[[SECTION_DIVIDER]]');
        let markdown = parts[0].trim();
        let metaDescription = '';
        let hashtags: string[] = [];
        let eyecatchPrompt = '';
        let inlinePromptsText = '';

        if (parts.length >= 5) {
            // Body --- Meta --- Hashtags --- Eyecatch --- Inline
            metaDescription = parts[1].trim();
            const tagsText = parts[2].trim();
            hashtags = tagsText.match(/#[^\s#]+/g) || [];
            eyecatchPrompt = parts[3].trim();
            inlinePromptsText = parts[4].trim();
        } else if (parts.length >= 4) {
            // Fallback for old prompt structure
            metaDescription = parts[1].trim();
            const tagsText = parts[2].trim();
            hashtags = tagsText.match(/#[^\s#]+/g) || [];
            eyecatchPrompt = parts[3].trim();
        } else if (parts.length === 3) {
            metaDescription = parts[1].trim();
            const tagsText = parts[2].trim();
            hashtags = tagsText.match(/#[^\s#]+/g) || [];
        } else if (parts.length === 2) {
            metaDescription = parts[1].trim();
        }


        // Helper to generate image with fallback strategy
        async function generateImage(prompt: string, refDesc: string, isEyecatch: boolean = false): Promise<{ url: string, model: string }> {
            let safeSubject = prompt.replace(/photorealistic|realistic|4k|photo|photography|cinematic/gi, "");
            if (!safeSubject) safeSubject = selectedTitle;

            // 1. Try Google Image Gen Direct API
            // Prioritize the user requested 'gemini-3-pro-image-preview' if available via API, then Imagen, then Flash
            const googleModels = ['gemini-3-pro-image-preview', 'imagen-3.0-generate-001', 'gemini-2.0-flash-exp'];

            // Construct a prompt optimized for Google models
            const googlePrompt = isEyecatch
                ? `Draw a high quality image. Style: minimalist, flat design, vector art, soft colors. Content: ${safeSubject}. Details: ${refDesc}. No text.`
                : `Draw an illustration. Style: vector art, flat design, white background. Content: ${safeSubject}. Details: ${refDesc}.`;

            for (const modelName of googleModels) {
                try {
                    // console.log(`Attempting Google Image Gen with ${modelName}...`); 
                    // (Log reduced to avoid clutter, will log success/fail)
                    const model = genAI.getGenerativeModel({ model: modelName });
                    const result = await model.generateContent(googlePrompt);
                    const response = await result.response;

                    // Check for inline image data
                    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
                        for (const part of response.candidates[0].content.parts) {
                            if (part.inlineData && part.inlineData.data) {
                                console.log(`Google Direct API Success (${modelName})`);
                                const mime = part.inlineData.mimeType || 'image/png';
                                return {
                                    url: `data:${mime};base64,${part.inlineData.data}`,
                                    model: `${modelName} (Google)`
                                };
                            }
                        }
                    }
                } catch (e: any) {
                    // console.warn(`Google ${modelName} failed: ${e.message}`);
                    // Silently fail to next model
                }
            }

            // 2. Fallback to Pollinations (Flux)
            // Only used if ALL Google attempts fail (e.g. 404, 429, or text response)
            console.log('All Google models failed or unavailable. Fallback to Pollinations (Flux).');
            try {
                return {
                    url: createPollinationsUrl(prompt, refDesc, isEyecatch),
                    model: 'flux (pollinations)'
                };
            } catch (e) {
                console.error('Pollinations URL creation failed', e);
                return { url: '', model: 'failed' };
            }
        }

        // Generate Eyecatch
        let generatedImageUrl = '';
        let usedModel = '';
        const eyecatchBasePrompt = eyecatchPrompt || 'minimalist flat design illustration blog header soft colors';

        try {
            const result = await generateImage(eyecatchBasePrompt, referenceDescription, true);
            generatedImageUrl = result.url;
            usedModel = result.model;
            console.log('Eyecatch generated via:', usedModel);
        } catch (e) {
            console.error('Failed to generate eyecatch', e);
        }


        // Generate and Inject Inline Images
        if (inlinePromptsText) {
            console.log('Processing inline prompts...');
            const lines = inlinePromptsText.split('\n');

            // Limit inline images to 3 to avoid rate limits
            let count = 0;
            const MAX_INLINE_IMAGES = 3;

            for (const line of lines) {
                if (count >= MAX_INLINE_IMAGES) break;

                // Format: "H2 Header: prompt..."
                const match = line.match(/([^:]+):(.+)/);
                if (match) {
                    const headerKey = match[1].trim();
                    const promptPart = match[2].trim();

                    if (promptPart && promptPart.length > 5) {
                        try {
                            // Add delay to throttle requests (2s)
                            await new Promise(r => setTimeout(r, 2000));

                            const result = await generateImage(promptPart, referenceDescription, false);
                            const url = result.url;

                            let targetHeader = headerKey.replace(/^##\s*/, '').replace(/H2\s*/i, '');
                            const escapedHeader = targetHeader.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                            const regex = new RegExp(`(##\\s*${escapedHeader}[^\\n]*)`, 'i');

                            if (markdown.match(regex)) {
                                markdown = markdown.replace(regex, `$1\n\n![${targetHeader}](${url})\n`);
                                console.log(`Injected inline image for: ${targetHeader}`);
                                count++;
                            }
                        } catch (e) {
                            console.error(`Failed to generate inline image for ${headerKey}`, e);
                        }
                    }
                }
            }
        }

        // Fallback: If no inline prompts were generated/injected, simplistic injection
        // (Skipped to avoid clutter if AI failed)

        return {
            success: true,
            body: {
                markdown: markdown,
                metaDescription: metaDescription,
                hashtags: hashtags,
                actualWordCount: markdown.length,
                generatedImageUrl: generatedImageUrl,
                generatedImageModel: usedModel
            }
        };
    } catch (e: any) {
        return { success: false, error: e.message || 'Generation failed' };
    }
});
