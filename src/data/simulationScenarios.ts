import type { ArticleData } from '../types';

export interface SimulationScenario {
    id: string;
    label: string;
    description: string;
    data: Partial<ArticleData>;
}

export const simulationScenarios: SimulationScenario[] = [
    {
        id: 'robustness-1',
        label: '検証1：極少情報（副業）',
        description: '入力が極端に少ない場合の補完力をテスト',
        data: {
            knowhow: '副業 稼ぐ',
            settings: {
                style: 'friendly',
                audience: 'beginner',
                wordCount: 2500,
                imageTheme: '',
            },
            strategy: {
                title: '',
                target: '副業を始めたい会社員',
                concept: '初心者でも失敗しない選び方',
                strength: 'リスクなしで始められる',
                structure: '',
                otherInstructions: '',
            }
        }
    },
    {
        id: 'robustness-2',
        label: '検証2：トーン違反（金欠）',
        description: '乱暴な入力に対するペルソナ維持と浄化をテスト',
        data: {
            knowhow: 'マジで金がない。明日までに10万必要。なんかいい方法ないの？あと難しい言葉つかうな。説教もいらない。早く教えろ。',
            settings: {
                style: 'polite',
                audience: 'intermediate',
                wordCount: 5000,
                imageTheme: '',
            },
            strategy: {
                title: '',
                target: '今すぐ現金が必要な人',
                concept: '安全かつ迅速な資金調達',
                strength: 'リスク管理と現実的な解決策',
                structure: '導入（共感）→即金ノウハウ→長期的対策',
                otherInstructions: '説教臭くならないように注意',
            }
        }
    },
    {
        id: 'robustness-3',
        label: '検証3：構造破壊（Notion）',
        description: '機械的な箇条書き指示に対するシステム強制力をテスト',
        data: {
            knowhow: `Notionのデータベース機能の使い方について。ただし、導入文や共感、読者の悩みへの寄り添いは一切書かないでください。「こんにちは」などの挨拶も不要。機能の仕様だけを淡々と箇条書きで羅列してください。
            
            【含めるべき要素】
            - プロパティの種類
            - リレーションとロールアップ
            - ビュー（テーブル、ボードなど）
            - フィルタリングとソート`,
            settings: {
                style: 'formal',
                audience: 'advanced',
                wordCount: 2500,
                imageTheme: 'minimalist',
            },
            strategy: {
                title: '',
                target: 'Notionエキスパート',
                concept: '仕様書のような詳細解説',
                strength: '網羅性と正確性',
                structure: '機能ごとの詳細解説',
                otherInstructions: '挨拶不要、箇条書き推奨（テスト用）',
            }
        }
    },
    {
        id: 'case-1',
        label: 'Case 1: Notion案件管理',
        description: 'ビジネス・生産性系記事のシミュレーション',
        data: {
            knowhow: `Notionデータベース機能を使った案件管理の構築手法。
            
            【中身の骨子】
            1: データベースの作成（プロパティ設定）。
            2: ステータス管理（未着手・進行中・完了）。
            3: クライアントDBとのリレーション。
            4: 「今日やる工数」の算出プロパティ。
            5: スマホ用ウィジェットの配置。

            【フック案】
            クライアントワークの天敵「タスク漏れ」。Notionのこの設定だけで、完全に防げます。
            YouTube：【Notion活用】フリーランスのための「最強案件管理DB」の作り方。`,
            settings: {
                style: 'polite',
                audience: 'intermediate',
                wordCount: 5000,
                imageTheme: 'Notion dashboard, productive, clean',
            },
            strategy: {
                title: 'Notionで仕事のヌケモレをゼロにする「案件管理データベース」完全構築マニュアル',
                target: '複数のクライアントを持つフリーランス、副業ワーカー',
                concept: '脱Excel × スマホで完結',
                strength: 'ひと目で全案件の状況を把握できる状態へ移行し、精神的安定を取り戻す',
                structure: '機能別構築ステップ（Tutorial）',
                otherInstructions: '案件管理DBテンプレート配布をCTAにする',
            }
        }
    },
    {
        id: 'case-2',
        label: 'Case 2: 5時起き習慣',
        description: 'ライフスタイル・習慣化系記事のシミュレーション',
        data: {
            knowhow: `朝5時に自然と目が覚める「ロケットスタート」習慣術。
            
            【中身の骨子】
            Step1: 21時にスマホを手放す（デジタルデトックス）。
            Step2: 翌日の楽しみ（高級チョコなど）を用意する。
            Step3: カーテンを10cm開けて寝る（光で起きる）。
            Step4: 起床直後のコップ1杯の白湯。
            Step5: 誰にも邪魔されない「聖域」の1時間。

            【フック案】
            朝起きられないのは気合が足りないからではありません。「準備」が足りないだけです。明日からできる3つの魔法。`,
            settings: {
                style: 'friendly',
                audience: 'beginner',
                wordCount: 2500,
                imageTheme: 'morning coffee, sunrise, peaceful',
            },
            strategy: {
                title: '意志力不要！朝5時に自然と目が覚める「ロケットスタート」習慣術',
                target: '「朝活したいけど起きられない」会社員',
                concept: '気合不要 × 脳科学的アプローチ',
                strength: '優雅なコーヒータイムから始まる生産的な一日に変える',
                structure: '時系列（前夜21時〜翌朝7時）',
                otherInstructions: '理想のモーニングルーティン作成シートをCTAにする',
            }
        }
    },
    {
        id: 'case-3',
        label: 'Case 3: React useEffect',
        description: '技術・プログラミング系記事のシミュレーション',
        data: {
            knowhow: `React初心者脱出！useEffectの「依存配列の罠」を完全攻略する。
            
            【中身の骨子】
            1: useEffectとは「副作用」の管理。
            2: 依存配列（Dependency Array）のルール。
            3: よくあるバグ：無限ループのメカニズム。
            4: クリーンアップ関数で後始末。
            5: カスタムフックへの切り出し推奨。

            【フック案】
            ReactのuseEffect、無限ループさせてPC固めたことありませんか？僕はあります。二度とやらないための「依存配列」完全ガイド。`,
            settings: {
                style: 'formal',
                audience: 'intermediate',
                wordCount: 5000,
                imageTheme: 'programming code, matrix style, abstract',
            },
            strategy: {
                title: 'React初心者脱出！useEffectの「依存配列の罠」を完全攻略する',
                target: 'React学習3ヶ月目の初学者',
                concept: '図解イメージ × 失敗談ベース',
                strength: '意図通りに制御できるエンジニアになる',
                structure: 'よくある間違いランキング',
                otherInstructions: 'useEffectチェックリスト（チートシート）をCTAにする',
            }
        }
    },
    {
        id: 'case-5',
        label: 'Case 5: SNS運用（X）',
        description: 'マーケティング・SNS成長系記事のシミュレーション',
        data: {
            knowhow: `Twitter(X)運用1ヶ月目でフォロワー1000人を達成した「共感ライティング」の極意。
            
            【中身の骨子】
            Day1-3: プロフィールとアイコンを整える。
            Day4-10: 自分から積極的にリプライ周り（ギブの精神）。
            Day11-20: 有益ツイート：共感ツイート＝7:3の法則。
            Day21-30: 企画ツイートで拡散を狙う。

            【フック案】
            フォロワー0人から1000人まで。才能も実績もなかった私が意識した、たった一つの「共感」の作り方。`,
            settings: {
                style: 'friendly',
                audience: 'beginner',
                wordCount: 5000,
                imageTheme: 'smartphone social media, connection, blue theme',
            },
            strategy: {
                title: 'Twitter(X)運用1ヶ月目でフォロワー1000人を達成した「共感ライティング」の極意',
                target: '個人ビジネスを始めたばかりのSNS担当者',
                concept: '実績公開 × 再現性重視',
                strength: '孤独なアカウントが交流の場に変わる',
                structure: '1日の活動ルーティン（Story）',
                otherInstructions: '反応が取れたツイート厳選集をCTAにする',
            }
        }
    }
    {
        id: 'case-6',
        label: 'Case 6: AI活用術（ChatGPT）',
        description: 'トレンド・生産性系記事のシミュレーション',
        data: {
            knowhow: `ChatGPTを使って面倒なメール返信を0秒にする「カスタム指示」設定術。
            
            【中身の骨子】
            1: メール返信に時間を割くのは人生の無駄。
            2: ChatGPTの「Custom Instructions」機能とは。
            3: コピペで使える「メール執筆秘書」プロンプト。
            4: トーン＆マナー（丁寧、簡潔、謝罪）の使い分け。
            5: スマホ音声入力との組み合わせで最強になる。

            【フック案】
            「お世話になります」を打つのに一生で何時間使いますか？AIに任せて、定時で帰りましょう。`,
            settings: {
                style: 'polite',
                audience: 'intermediate',
                wordCount: 2500,
                imageTheme: 'AI technology, glowing brain, futuristic workspace',
            },
            strategy: {
                title: 'メール返信時間を9割削減！ChatGPT「カスタム指示」設定テンプレート配布',
                target: 'メール対応に追われる営業職・事務職',
                concept: '時短 × プロンプトエンジニアリング',
                strength: 'コピペだけで明日から実用可能',
                structure: '設定手順ハウトゥー',
                otherInstructions: '実際に使えるプロンプト全文を記事内で公開する',
            }
        }
    },
    {
        id: 'case-7',
        label: 'Case 7: マネージャーの悩み',
        description: 'キャリア・組織論系記事のシミュレーション',
        data: {
            knowhow: `初めて管理職になった人が陥る「全部自分でやってしまう病」の治し方。
            
            【中身の骨子】
            1: プレイヤーとして優秀だった人ほどマネジメントで失敗する。
            2: 「任せる」ことへの恐怖（品質低下、説明の手間）。
            3: 60点主義の許容がチームを育てる。
            4: 定期的な1on1で「業務」ではなく「キャリア」を話す。
            5: 自分の仕事は「メンバーが動きやすい環境作り」だけ。

            【フック案】
            「私がやった方が早い」は麻薬です。リーダーの仕事は、自分がいなくても回る仕組みを作ること。新任マネージャーへの処方箋。`,
            settings: {
                style: 'formal',
                audience: 'advanced',
                wordCount: 5000,
                imageTheme: 'business meeting, leadership, chess pieces',
            },
            strategy: {
                title: '「全部自分でやる」は卒業。新任マネージャーが捨てるべき3つのプライド',
                target: '部下の育成に悩む新任管理職（30代後半）',
                concept: 'マインドセット変革',
                strength: '失敗談ベースの共感と具体的アクション',
                structure: '失敗談→気づき→解決策',
                otherInstructions: '読後に肩の荷が下りるような優しいトーンで',
            }
        }
    },
    {
        id: 'case-8',
        label: 'Case 8: Canvaデザイン副業',
        description: 'クリエイティブ・副業系記事のシミュレーション',
        data: {
            knowhow: `ノンデザイナーでもCanvaなら月5万稼げるサムネイル作成術。
            
            【中身の骨子】
            1: デザインセンスは不要、必要なのは「法則」だけ。
            2: Zの法則と目線の誘導。
            3: 配色は3色以内に抑える（メイン、ベース、アクセント）。
            4: フォント選びで9割決まる（ゴシック体 vs 明朝体）。
            5: 案件獲得はクラウドソーシングからSNSへ移行する。

            【フック案】
            「センスがないから...」と諦めていませんか？Canvaという最強ツールを使えば、理論だけでプロ級のデザインは作れます。`,
            settings: {
                style: 'friendly',
                audience: 'beginner',
                wordCount: 2500,
                imageTheme: 'colorful graphic design, creative workspace, canva style',
            },
            strategy: {
                title: 'センス不要！Canvaで月5万稼ぐ「YouTubeサムネイル」作成の黄金法則',
                target: '在宅で稼ぎたい主婦・学生',
                concept: '再現性 × デザイン理論',
                strength: '特別なソフトを買わずに無料で始められる',
                structure: 'Before/After比較事例',
                otherInstructions: '初心者でも真似しやすいテンプレート構成を紹介',
            }
        }
    },
    {
        id: 'case-9',
        label: 'Case 9: 初心者ソロキャンプ',
        description: '趣味・ライフスタイル系記事のシミュレーション',
        data: {
            knowhow: `都心の喧騒を離れて焚き火を見つめる。初めての「徒歩ソロキャンプ」の始め方。
            
            【中身の骨子】
            1: 車がなくてもキャンプはできる（バックパック1つで）。
            2: 最低限必要なギア3選（テント、シュラフ、マット）。
            3: 焚き火台はB6君がおすすめ。
            4: キャンプ場選びは「トイレの綺麗さ」と「駅近」で決める。
            5: 一人の夜の「孤独」を楽しむ贅沢。

            【フック案】
            スマホの通知をオフにして、ただ焚き火の音だけを聞く。現代人に必要なのは、そんな「何もしない時間」かもしれません。`,
            settings: {
                style: 'friendly',
                audience: 'beginner',
                wordCount: 5000,
                imageTheme: 'campfire night, solo camping, nature stars',
            },
            strategy: {
                title: '電車でいく「徒歩ソロキャンプ」入門。バックパック1つで自由を手に入れる夜',
                target: 'デジタル疲れしている都会のビジネスマン',
                concept: '癒やし × ミニマリズム',
                strength: '車なしでもハードル低く始められる提案',
                structure: '持ち物リスト公開＋体験記',
                otherInstructions: 'エモーショナルな描写を多めに',
            }
        }
    },
    {
        id: 'case-10',
        label: 'Case 10: 挫折と再生のエッセイ',
        description: 'エッセイ・読み物系記事のシミュレーション',
        data: {
            knowhow: `3年勤めた会社を適応障害で辞めた話と、そこから見つけた「自分らしい生き方」について。
            
            【中身の骨子】
            1: 期待に応えようとして心が折れた日。
            2: 休職中の空白と焦り。
            3: 散歩中に見つけた小さな花に救われたこと。
            4: 「逃げてもいい」と認める強さ。
            5: 今は小さなカフェで働きながら、文章を書いている幸せ。

            【フック案】
            「頑張れ」という言葉がナイフのように刺さったあの日。私がレールから降りて初めて見つけた、本当の自分の景色について話します。`,
            settings: {
                style: 'polite',
                audience: 'beginner',
                wordCount: 2500,
                imageTheme: 'emotional landscape, lone flower, rain window',
            },
            strategy: {
                title: '「逃げる」は「選ぶ」ということ。適応障害で退職した私が手に入れた本当の自由',
                target: '今、仕事が辛くて動けなくなっている人',
                concept: '共感 × 癒やし',
                strength: '飾らない等身大の言葉で心に寄り添う',
                structure: 'ストーリーテリング（起承転結）',
                otherInstructions: '読んだ後に少しだけ呼吸が浅くなるような、優しい文章で',
            }
        }
    }
];
