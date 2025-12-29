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

        const wordCount = settings?.wordCount || 2500;
        // 出力形式:
        // (ここにマークダウン形式の本文)
        // [[SECTION_DIVIDER]]
        // (ここにメタディスクリプション)
        // [[SECTION_DIVIDER]]
        // (ここにハッシュタグ)
        // [[SECTION_DIVIDER]]
        // (ここに画像生成用プロンプト [英語])
        // `;
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

12. **画像プロンプト**: ${referenceInstruction || ''} 記事のタイトル「${selectedTitle}」を表現する見出し画像のプロンプトを**英語で**作成してください。
    *   **必須**: "minimalist, flat design, vector art, soft colors, high quality" のような、スタイルを表す英単語をカンマ区切りで列挙する形式にしてください。
    *   **禁止**: 文章（Sentence）にしないこと。日本語を含めないこと。"text", "word", "letter", "typography" などの文字要素を一切含めないこと。
    *   **構成**: [主題(Subject)], [スタイル(Style)], [背景(Background)] の順で、合計20単語以内で簡潔に記述してください。

出力形式:
(ここにマークダウン形式の本文)
[[SECTION_DIVIDER]]
(ここにメタディスクリプション)
[[SECTION_DIVIDER]]
(ここにハッシュタグ)
[[SECTION_DIVIDER]]
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
        const parts = text.split('[[SECTION_DIVIDER]]');
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
        // 生成されたプロンプトがあればそれを使い、なければタイトルをフォールバックとして使う
        // タイトルテキストを画像に埋め込むための特別なプロンプト構成
        let basePrompt = imagePrompt || 'minimalist flat design illustration blog header soft colors';

        // 参照画像の特徴があれば、それをプロンプトに追加して、スタイルやキャラクターを反映させる
        if (referenceDescription) {
            basePrompt = `${referenceDescription}, ${basePrompt}`;
        }





        // すべてのモデルで共通して「テキストを含まない、文字配置に適したクリーンな画像」を生成する戦略に変更
        // これにより、AIによる日本語描画の文字化け（中華フォント化など）を完全に回避し、
        // フロントエンド側で正しくタイトルをオーバーレイ表示（合成）する「コンポジット戦略」をとる



        let cleanMixPrompt = '';
        if (referenceDescription) {
            // 参照画像あり：【再現度99%を目指す最強プロンプト構成】
            // 1. ユーザーの期待（Subject）を維持しつつ
            // 2. 参照画像のスタイル（Style）を強制適用する
            // 3. 邪魔な「フォトリアル」「写真」要素を徹底排除するネガティブプロンプト的な構成を行う

            let safeSubject = imagePrompt.replace(/photorealistic|realistic|4k|photo|photography|cinematic/gi, "");
            if (!safeSubject) safeSubject = selectedTitle;

            // スタイルの重みを最大化しつつ、具体的なタッチ（ベクター、フラット、太い線など）を強調
            // descriptionが長すぎるとURLエラーになるため、500文字でカットする
            const safeDescription = referenceDescription.slice(0, 500);
            cleanMixPrompt = `(illustration, vector art, flat design:1.6), ${safeDescription}, ${safeSubject}, (thick outlines, bold lines:1.4), simple background, no photorealistic, no 3d rendering, no shading`;
            console.log('Using reference-focused prompt (High Fidelity):', cleanMixPrompt);
        } else {
            // 参照画像なし：デフォルトのきれいな背景
            cleanMixPrompt = `${basePrompt}, minimalist, spacious, copy space, high quality, 8k, blog header background, no text, empty background`;
        }

        const encodedCleanPrompt = encodeURIComponent(cleanMixPrompt);

        // ランダムなシードを追加して、キャッシュバスティングと毎回異なる画像を生成
        const seed = Math.floor(Math.random() * 1000000);

        // 画像生成モデルの優先順位設定
        // 画像生成モデルの優先順位設定
        const imageStrategies = [
            { model: 'magen-3.0-generate-001', type: 'google' },     // 最優先
            { model: 'gemini-3-pro-image-preview', type: 'google' }, // 2番目
            { model: 'nano-banana-pro-preview', type: 'pollinations' }, // 3番目 (User preferred)
            { model: 'gemini-2.0-flash-exp', type: 'google' }        // フォールバック
        ];


        let generatedImageUrl = '';
        let usedModel = '';

        for (const strategy of imageStrategies) {
            try {
                console.log(`Trying image generation with model: ${strategy.model} (${strategy.type})`);

                if (strategy.type === 'google') {
                    // Google系モデルの試行
                    try {
                        const model = genAI.getGenerativeModel({ model: strategy.model });
                        // 画像生成を試みる


                        // 現行SDKでは画像生成専用のレスポンス構造ではない場合が多いため
                        // 明確な成功以外は失敗とみなしてPollinationsへフォールバックさせる
                        const result = await model.generateContent(cleanMixPrompt);
                        // もしここで有効な画像バイナリが取得成功したらgeneratedImageUrlにセット（未実装：SDK仕様待ち）
                        throw new Error("Google model generation integration pending. Fallback to next.");
                    } catch (gErr) {
                        console.warn(`Google generation failed for ${strategy.model}.`);
                        continue;
                    }



                } else if (strategy.type === 'pollinations') {
                    // Pollinations AI (URL生成のみ行い、サーバーサイドfetchはしない)
                    // これによりタイムアウトを回避しつつ、指定モデルでの生成URLを発行する
                    const modelParam = strategy.model;
                    generatedImageUrl = `https://image.pollinations.ai/prompt/${encodedCleanPrompt}?width=1280&height=720&nologo=true&seed=${seed}&model=${modelParam}`;
                    usedModel = modelParam;
                    console.log(`Using Pollinations URL with model: ${modelParam}`);
                    break; // URL生成できたのでループ終了
                }

            } catch (e) {
                console.warn(`Strategy failed: ${strategy.model}`);
                continue;
            }
        }



        // 全て失敗した場合の最終フォールバック
        if (!generatedImageUrl) {
            generatedImageUrl = `https://image.pollinations.ai/prompt/${encodedCleanPrompt}?width=1280&height=720&nologo=true&seed=${seed}&model=flux`;
            usedModel = 'flux (fallback)';
        }

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
