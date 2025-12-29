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

【執筆ルール（最重要・厳守）】
以下のルールを破った場合、出力は失敗とみなされます。

**【3-1. 段落構成の徹底（パラグラフ・ライティング）】**
*   **禁止事項**: スマホ最適化を意識しすぎて「1文ごとに改行」すること。チャットのようなスカスカした見た目は厳禁です。
*   **必須事項**: 意味のまとまりごとに「3〜5文（150〜200文字程度）」の段落を作ってください。
*   段落内では改行せず、文章を滑らかに繋げてください。
*   段落と段落の間には、必ず空行を1行入れてください。

**【3-2. 文体とトーンの制御】**
*   **基本文体**: 丁寧で落ち着いた「です・ます調」。
*   **NG表現（煽り・過剰演出の禁止）**:
    *   ×「魔法」「激変」「神〜」「衝撃」「〜してはいけない」「損している」
    *   ×「〜だなぁ」「〜かも」「〜しちゃう」（砕けすぎた表現）
    *   × 感情的な記号の多用（「！」「！？」は最小限に。「…」の多用も避ける）
*   **推奨スタイル**:
    *   事実と経験則に基づいた「断定」や「提案」の形をとる。
    *   （例: 「〜と考えられます。」「〜をおすすめします。」「〜という視点が重要です。」）

**【3-3. 論理構成】**
*   接続詞を適切に使い、文章のリズムを整える。
*   過度な逆接（「でも、」「実は、」）を減らし、順接（「まず、」「そして、」「さらに、」）を使って論理を積み上げる。

**【3-4. 記事構成要素】**
1.  **導入**: 読者の課題を定義し、本記事で得られる専門的な知見やメリットを明確に提示する。
2.  **本論**: 抽象論で終わらせず、「明日から何ができるか」という具体的なアクションプランを提示する。
3.  **FAQ**: 構成に含まれる場合は、Q&A形式で簡潔に回答する。
4.  **結び & CTA**: 記事の最後には、「参考になったら『スキ』ボタンを押してもらえると励みになります」といった控えめなCTAと、SEO用のメタディスクリプション（120文字）、ハッシュタグ（3-5個）を含める。

10. **文字数確保**: ${wordCount}文字以上を目安に、具体例や補足説明を加えて内容を充実させてください。
11. **開始時の注意**: 返事は不要です。すぐに出力形式に従って書いてください。


12. **画像プロンプト**: ${referenceInstruction || ''} 記事の内容にマッチする見出し画像の生成用プロンプトを**英語で**作成してください。「文字」に関する指示は含めないでください（プログラム側でタイトルを合成します）。具体的な被写体、背景、スタイル（例: digital art, cinematic lighting, photorealistic）のみを記述してください。

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
            cleanMixPrompt = `(illustration, vector art, flat design:1.6), ${referenceDescription}, ${safeSubject}, (thick outlines, bold lines:1.4), simple background, no photorealistic, no 3d rendering, no shading`;
            console.log('Using reference-focused prompt (High Fidelity):', cleanMixPrompt);
        } else {
            // 参照画像なし：デフォルトのきれいな背景
            cleanMixPrompt = `${basePrompt}, minimalist, spacious, copy space, high quality, 8k, blog header background, no text, empty background`;
        }

        const encodedCleanPrompt = encodeURIComponent(cleanMixPrompt);

        // ランダムなシードを追加して、キャッシュバスティングと毎回異なる画像を生成
        const seed = Math.floor(Math.random() * 1000000);

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
