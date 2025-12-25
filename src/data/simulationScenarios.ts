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
];
