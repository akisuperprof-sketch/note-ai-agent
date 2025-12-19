// 記事生成に関する型定義

// 文体の種類
export type WritingStyle = 'polite' | 'formal' | 'friendly';

// 読者層
export type AudienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'general';

// 生成ステージ
export type GenerationStage = 'input' | 'title' | 'outline' | 'body';

// 戦略企画設定
export interface StrategySettings {
    title: string;
    target: string;
    concept: string;
    strength: string;
    structure: string;
    otherInstructions: string;
}

// 基本設定
export interface BasicSettings {
    style: WritingStyle;
    audience: AudienceLevel;
    wordCount: number;
    imageTheme: string;
}

// 構成のセクション
export interface OutlineSection {
    level: number;
    heading: string;
    summary: string;
}

// 記事データ全体
export interface ArticleData {
    // 入力データ
    knowhow: string;
    strategy: StrategySettings;
    settings: BasicSettings;

    // 生成結果
    generatedTitles: string[];
    selectedTitle: string;
    outline: OutlineSection[];
    body: string;
    metaDescription: string;

    // 状態
    currentStage: GenerationStage;
    isStepMode: boolean;
    isGenerating: boolean;
}

// デフォルト値
export const defaultStrategy: StrategySettings = {
    title: '',
    target: '',
    concept: '',
    strength: '',
    structure: '',
    otherInstructions: '',
};

export const defaultSettings: BasicSettings = {
    style: 'polite',
    audience: 'beginner',
    wordCount: 5000,
    imageTheme: '',
};

export const defaultArticleData: ArticleData = {
    knowhow: `Obsidianで作る「第二の脳」構築ロードマップ【1週間完全ガイド】
Before→After：情報整理に憧れる人が、何から手をつけていいか分からない状況を、7日間の具体的アクションプランで解決して、迷走期間を0にする。
想定ターゲット：体系的に学びたい真面目な初心者。
合成要素：ロードマップ ＋ フォルダ構成案 ＋ 習慣化スケジュール。
差別化：{初心者} × {1日1タスク（スモールステップ）}。
まとめ軸：時系列（最初の1週間）。
参照先候補：表B-2, D-1, A-1
フック案：
X：Obsidianで「第二の脳」を作りたいけど、挫折した人へ。1日1つ、これだけやってください。7日後には最強の環境が完成します。
YouTube：インストールから1週間で「第二の脳」を作る。初心者のための完全ロードマップ。
中身の骨子：
Day1: インストールと日本語化。
Day2: フォルダ構成（Inbox/Zettelkasten）。
Day3: テンプレート作成。
... Day7: グラフビューを眺める。
CTA：7日間チェックリスト（PDF/Notion）配布。
型：構成「Step by Step」、ターゲット「体系化`,
    strategy: defaultStrategy,
    settings: defaultSettings,
    generatedTitles: [],
    selectedTitle: '',
    outline: [],
    body: '',
    metaDescription: '',
    currentStage: 'input',
    isStepMode: false,
    isGenerating: false,
};

// API レスポンス型
export interface TitleResponse {
    success: boolean;
    titles?: string[];
    error?: string;
}

export interface OutlineResponse {
    success: boolean;
    outline?: {
        sections: OutlineSection[];
    };
    error?: string;
}

export interface BodyResponse {
    success: boolean;
    body?: {
        markdown: string;
        metaDescription: string;
        actualWordCount: number;
    };
    error?: string;
}

// 文体の日本語ラベル
export const styleLabels: Record<WritingStyle, string> = {
    polite: 'ですます調（丁寧）',
    formal: 'である調（簡潔）',
    friendly: 'フレンドリー',
};

// 読者層の日本語ラベル
export const audienceLabels: Record<AudienceLevel, string> = {
    beginner: '初心者向け',
    intermediate: '中級者向け',
    advanced: '上級者向け',
    general: '一般向け',
};

// 文字数オプション
export const wordCountOptions = [
    { value: 1000, label: '1,000文字' },
    { value: 3000, label: '3,000文字' },
    { value: 5000, label: '5,000文字' },
    { value: 10000, label: '10,000文字' },
];
